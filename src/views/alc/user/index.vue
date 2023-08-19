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
    <el-button type="danger" size="default">批量删除</el-button>

    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0px" border :data="userArr">
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
          <el-button type="success" size="small" icon="User">
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
          <el-popconfirm :title="`确定删除${row.username}?`" width="260px">
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
</template>

<script setup lang="ts">
import { reqAddOrUpdateUser, reqUserInfo } from '@/api/acl/user'
import { Records, User, UserResponseData } from '@/api/acl/user/type'
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
  console.log(row)
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
    // 浏览器自动刷新一次
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
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名至少五位'))
  }
}
// 校验用户名字回调函数
const validatorName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
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
</script>
