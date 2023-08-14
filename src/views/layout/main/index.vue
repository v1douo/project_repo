<!-- 封装的目的主要是为了添加动画 -->
<template>
  <router-view v-slot="{ Component }">
    <transition appear enter-active-class="animate__animated animate__fadeIn">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// 引入安装好的 animate.css
import 'animate.css'
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style lang="scss" scoped></style>
