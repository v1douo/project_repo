<template>
  <el-card>
    <el-form :inline="true" style="height: 35px">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="success" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建世间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row: 已有的职位对象 -->
        <template #="{ row }">
          <el-button
            type="success"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="getHasRole"
      small
    />
  </el-card>

  <!-- 添加职位与更新已有职位的对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" size="default" @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>

  <!-- 分配不同职位的 菜单权限与按钮权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqRemoveRole,
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import { ref, onMounted, reactive, nextTick } from 'vue'
import useNavControl from '@/store/modules/navControl'
import { ElMessage } from 'element-plus'

// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 搜索职位关键字
let keyword = ref<string>('')
// 存储全部已有的职位
let allRole = ref<Records>([])
// 职位总个数
let total = ref<number>(0)

let navControl = useNavControl()

// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 获取form组件实例
let form = ref<any>()
// 收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})

// 控制分配权限抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 准备一个数组 用于存储勾选的节点 ID(四级的)
let selectArr = ref<number[]>([])
// 定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
// 获取 tree 组件实例
let tree = ref<any>()

onMounted(() => {
  // 获取全部职位
  getHasRole()
})
// 获取全部角色（职位）
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
// 搜索按钮的回调
const search = () => {
  // 再次发请求根据关键字
  getHasRole()
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  navControl.refresh = !navControl.refresh
}

// 添加职位按钮的回调
const addRole = () => {
  // 对话框显示出来
  dialogVisible.value = true
  // 清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  // 清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
// 更新已有的职位按钮的回调
const updateRole = (row: RoleData) => {
  // 显示出对话框
  dialogVisible.value = true
  // 存储已有的职位(带有ID的)
  Object.assign(RoleParams, row)
  // 清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 自定义校验规则的回调
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
// 职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//确定按钮的回调
const save = async () => {
  // 表单校验结果 结果通过再发请求
  await form.value.validate()
  // 添加职位/更新职位的请求
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    // 提示文字
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisible.value = false
    // 再次获取全部的已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

// 分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  // 收集当前要分类权限的职位的数据
  Object.assign(RoleParams, row)
  // 根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

// 树形控件的测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 抽屉确定按钮的回调
const handler = async () => {
  // 职位的ID
  const roleId = RoleParams.id as number
  // 选中节点的ID
  let arr = tree.value.getCheckedKeys()
  // 半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  // 下发权限
  let result: any = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: '分配权限成功' })
    // 页面刷新，重新获取权限
    window.location.reload()
  }
}

// 删除已有的职位
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>
