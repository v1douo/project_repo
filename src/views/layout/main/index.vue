<!-- 封装的目的主要是为了添加动画 -->
<template>
  <router-view v-slot="{ Component }">
    <transition appear enter-active-class="animate__animated animate__fadeIn">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// 引入安装好的 animate.css 添加动画
import 'animate.css'

// 刷新的实现
import useNavControl from '@/store/modules/navControl'
import { watch, ref, nextTick } from 'vue'
let navControl = useNavControl()
let flag = ref(true)
// 监听仓库数据是否发生变化，发生变化则用户点击了刷新，让组件销毁重建
watch(
  () => navControl.refresh,
  () => {
    flag.value = false
    // DOM 更新后再 v-if=true
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style lang="scss" scoped></style>
