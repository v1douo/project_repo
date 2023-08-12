<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="login_Form"
        >
          <h1>星舱商管</h1>
          <h2>登陆</h2>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login-btn"
              @click="login"
            >
              登陆
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="footage">欢迎使用@星舱商管</span>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 引入路由
import { useRouter } from 'vue-router'
// elePlus 的弹窗提示工具
import { ElNotification } from 'element-plus'

// 获取用户相关仓库
let userStore = useUserStore()
// 获取路由器
let $router = useRouter()
// 控制按钮加载效果（loading）
let loading = ref(false)

// 获取登陆表单数据
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})

// 获取登陆表单(el-form)组件
let login_Form = ref()

// 登陆按钮回调
async function login() {
  // 如果表单验证失败则会抛出异常，从而中断后面代码，这里并没有对其捕获
  await login_Form.value.validate()
  try {
    // 点击按钮后让按钮转起来 —— 开始加载
    loading.value = true
    // 根据 userLogin 返回的 promise 做事，这里通过 try-catch，也可以用 .then()
    await userStore.userLogin(loginForm)
    // 成功了则跳转到数据首页（home）
    // push：程序式地通过将一条记录加入到历史栈中来导航到一个新的 URL。
    $router.push('/')
    // 登陆成功的提示信息
    ElNotification({
      type: 'success',
      title: 'Hi, welcome Back!',
      message: '登陆成功！',
    })
    // 加载效果消失
    loading.value = false
  } catch (error) {
    // 加载效果消失
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 表单校验需要的配置对象
const rules = {
  username: [
    {
      required: true,
      min: 4,
      message: '用户名长度至少四位！',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      message: '用户名长度至少六位！',
      trigger: 'change',
    },
  ],
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.png') no-repeat;
  background-size: cover;
  position: relative;

  .login-form {
    position: relative;
    width: 70%;
    top: 30vh;
    background-color: rgba(255, 255, 255, 0.116);
    border-radius: 15px;
    padding: 30px 40px;
    text-align: center;

    h1 {
      color: white;
      font-size: 40px;
      margin: 20px 0;
    }

    h2 {
      color: white;
      font-size: 0px;
      margin: 20px 0;
    }

    .el-button {
      margin: 20px auto 0;
      width: 90%;
    }
  }

  .footage {
    color: rgb(120, 120, 120);
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
