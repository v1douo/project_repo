<!-- 封装的目的主要是为了添加动画 -->
<template>
  <transition appear enter-active-class="animate__animated animate__fadeIn">
    <router-view></router-view>
  </transition>
</template>

<script setup lang="ts">
// 引入安装好的 animate.css
import 'animate.css'
</script>

<style lang="scss" scoped></style>
