<template>
  <el-card style="height: 75px">
    <el-form :inline="true">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="danger" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      @click="deleteSelectUser"
      :disabled="selectIdArr.length ? false : true"
      type="danger"
      size="default"
    >
      批量删除
    </el-button>

    <!-- table展示用户信息 -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0px"
      border
      :data="userArr"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户昵称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button
            @click="setRole(row)"
            type="success"
            size="small"
            icon="User"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            @confirm="deleteUser(row.id)"
            :title="`确定删除${row.username}?`"
            width="260px"
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
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      small="small"
      @current-change="getHasUser"
      @size-change="getHasUser"
    />
  </el-card>

  <!-- 添加新的用户，修改用户信息 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" ref="formRef" :rules="rules">
        <el-form-item label="用姓名" prop="username">
          <el-input
            placeholder="请您输入用户名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 分配角色 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="danger" @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRole,
  reqUserInfo,
} from '@/api/acl/user'
import {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])

// 定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户信息的响应式数据（添加用户，修改用户）
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

// 获取 form
let formRef = ref<any>()

onMounted(() => {
  getHasUser()
})

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 添加用户回调
const addUser = () => {
  // 抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    // 如果点击更新用户是会存储 id 的，需要清除 id
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
// 更新已有的用户按钮的回调
const updateUser = (row: User) => {
  // 抽屉显示出来
  drawer.value = true
  // 显示当前点击的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
// 添加 or 更新 保存按钮的回调
async function save() {
  // 表单必须符合全部 validator 才能继续执行
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  // 添加或者更新成功
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1);
    // 浏览器自动刷新一次，修改了用户名后，token 就失效了，所以直接刷新一下
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  drawer.value = false
}

// 校验用户名字回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 3) {
    callBack()
  } else {
    callBack(new Error('用户名至少三位'))
  }
}
// 校验用户名字回调函数
const validatorName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 3) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少三位'))
  }
}
// 校验密码
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 表单校验的规则对象(使用自定义校验规则)
const rules = {
  // 用户名
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // 用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 控制分配角色抽屉显示隐藏
let drawer1 = ref<boolean>(false)
// 全选
const checkAll = ref<boolean>(false)
// 控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的职位
let userRole = ref<AllRole>([])

async function setRole(row: User) {
  // 存储点击的用户数据（拿用户名）
  Object.assign(userParams, row)
  // 获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部的职位
    allRole.value = result.data.allRolesList
    // 存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    // 抽屉显示出来
    drawer1.value = true
  }
}
// 全选复选框的 change 事件
const handleCheckAllChange = (val: boolean) => {
  // val:true(全选) / false(没有全选)
  userRole.value = val ? allRole.value : []
  // 不确定的样式(确定样式)
  isIndeterminate.value = false
}
// 全部复选框的 change 事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 如果勾选上的项目个数与全部的职位个数相等，则勾选上全选
  checkAll.value = value.length === allRole.value.length
  // 不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
// 确认按钮
async function confirmClick() {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    // 提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    // 关闭抽屉
    drawer1.value = false
    // 获取更新完毕用户的信息 更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

// 准备一个数组存储批量删除的用户的 ID
let selectIdArr = ref<User[]>([])

// 删除用户
async function deleteUser(userId: number) {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// table复选框勾选的时候会触发的事件
function selectChange(value: any) {
  selectIdArr.value = value
}
// 批量删除按钮的回调
async function deleteSelectUser() {
  // 整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  // 批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>
