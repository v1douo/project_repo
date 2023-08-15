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
          <el-input placeholder="请输入属性名称"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="Plus">添加属性值</el-button>
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center"></el-table-column>
        <el-table-column label="属性值操作" align="center"></el-table-column>
      </el-table>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="danger" size="default" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

import { watch, ref } from 'vue'
// 引入获取数据的接口
import { reqAttr } from '@/api/product/attr'
import { AttrResponseData, Attr } from '@/api/product/attr/type'
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
let scene = ref<number>(1)
// 添加属性按钮的回调
function addAttr() {
  scene.value = 1
}
// 修改属性按钮的回调
function updateAttr() {
  scene.value = 1
}
// 取消按钮的回调
function cancel() {
  scene.value = 0
}
</script>

<style scoped lang="scss"></style>
