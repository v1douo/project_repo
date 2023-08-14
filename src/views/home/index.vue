<template>
  <div>Home {{ userStore.username }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore()
onMounted(() => {
  // 首页挂载完毕之后，发请求获取用户信息
  userStore.userInfo()
})
</script>

<style lang="scss" scoped></style>
