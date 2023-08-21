<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" />
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 800px;
    height: 400px;
  }

  button {
    width: 100px;
    border: none;
    border-radius: 20px;
    height: 50px;
    transition: all 0.4s;

    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
}
</style>
