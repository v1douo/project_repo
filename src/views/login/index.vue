<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0">12321321</el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login-form">
          <h1>星舱商管</h1>
          <h2>登陆</h2>
          <el-form-item>
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn">登陆</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="footage">欢迎使用@星舱商管</span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

let loginForm = reactive({
  username: 'admin',
  password: '111111',
})
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
