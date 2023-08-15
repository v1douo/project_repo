<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        @click="addAttr"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 15px 0" :data="attrArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          align="center"
          width="120"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row }">
            <el-tag
              type="warning"
              style="margin: 5px"
              v-for="item in row.attrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateAttr"
            ></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加 or 修改的 card -->
    <div v-show="scene == 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            v-model="attrParams.attrName"
            placeholder="请输入属性名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加属性值按钮 -->
      <el-button
        :disabled="attrParams.attrName ? false : true"
        type="primary"
        icon="Plus"
        @click="addAttrValue"
      >
        添加属性值
      </el-button>
      <!-- 添加属性的展示 table -->
      <el-table
        :data="attrParams.attrValueList"
        border
        style="margin: 10px 0px"
      >
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              v-if="row.flag"
              @blur="toLook(row, $index)"
              size="small"
              placeholder="请你输入属性值名称"
              v-model="row.valueName"
            ></el-input>
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作" align="center">
          <template #="{ index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="attrParams.attrValueList.splice(index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="attrParams.attrValueList.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="danger" size="default" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

import { watch, ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 引入接口
import { reqAttr, reqAddOrUpdateAttr } from '@/api/product/attr'
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
// 存储已有属性与属性值
let attrArr = ref<Attr[]>([])
// 监听三级分类的 id 变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 有 c3Id 才发请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)
// 获取已有的属性与属性值方法
async function getAttr() {
  // 解构获取分类的 id
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 空值卡片内容切换（点击添加修改后的跳转）0 就展示 table，1 就展示修改/添加界面
let scene = ref<number>(0)
// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', // 新增的属性的名字
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类的ID
  categoryLevel: 3, // 代表的是三级分类
})
// 添加属性按钮的回调
function addAttr() {
  // 每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  scene.value = 1
  // 收集三级分类的 id
  attrParams.categoryId = categoryStore.c3Id
}
// 修改属性按钮的回调
function updateAttr() {
  scene.value = 1
}
// 取消按钮的回调
function cancel() {
  scene.value = 0
}
// 添加属性值按钮的回调
function addAttrValue() {
  attrParams.attrValueList.push({
    valueName: '',
    // 控制每一个属性的编辑模式与视图模式的切换
    flag: true,
  })
  // 获取最后的 el-input 组件，让其自动聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存按钮回调
async function save() {
  console.log(attrParams)
  // 发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  // 添加属性/修改已有的属性成功
  if (result.code == 200) {
    // 切换场景
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功!' : '添加成功!',
    })
    // 获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败!' : '添加失败!',
    })
  }
}
// 属性值表单 input 元素失去焦点的事件回调
function toLook(row: AttrValue, $index: number) {
  // 非法情况判断 1：为空
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空！',
    })
    return
  }
  // 非法情况 2：重复
  let repeat = attrParams.attrValueList.find((item) => {
    // 不要判断自己
    if (item != row) {
      return item.valueName === row.valueName
    }
  })

  // 将重复的属性值从数组当中干掉
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复！',
    })
    return
  }

  row.flag = false
}
// 获取焦点时候的事件回调
function toEdit(row: AttrValue, $index: number) {
  row.flag = true

  // 响应式数据发生变化后，获取更新的 DOM(组件实例)
  nextTick(() => {
    // 用 ele-plus 的方法 focus 让组件聚焦
    inputArr.value[$index].focus()
  })
}

// el-input 实例
let inputArr = ref<any>([])
</script>

<style scoped lang="scss"></style>
