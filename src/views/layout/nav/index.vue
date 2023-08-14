<template>
  <div class="nav">
    <!-- 左！ -->
    <div class="nav-left">
      <!-- 左侧图标 -->
      <el-icon style="margin-right: 10px" @click="changeIcon">
        <component :is="navControl.fold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 左侧面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包动态展示路由名字与标题 -->
        <el-breadcrumb-item
          v-for="(item, index) in $route.matched"
          :key="index"
          v-show="item.meta.title"
          :to="item.path"
        >
          <!-- 路由图标 -->
          <el-icon style="margin: 0 5px; vertical-align: top">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!-- 路由的标题 -->
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右！ -->
    <div class="nav-right">
      <el-button
        size="small"
        icon="Refresh"
        circle
        @click="reUpdate"
      ></el-button>
      <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-button size="small" icon="setting" circle></el-button>
      <img src="logo.svg" style="width: 24px; height: 24px; margin: 0 10px" />
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNavControl from '@/store/modules/navControl.ts'

// 控制折叠菜单图标的切换
const navControl = useNavControl()
function changeIcon() {
  navControl.fold = !navControl.fold
}

// 刷新按钮的回调
function reUpdate() {
  // 改变 refresh 的值，让 main 监听，改变了就刷新一下
  navControl.refresh = !navControl.refresh
}

// 全屏按钮的回调
function fullScreen() {
  // DOM 对象的属性，可以判断是否是全屏模式
  let full = document.fullscreenElement
  if (!full) {
    // 文档根节点的方法实现全屏
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>
<script lang="ts">
export default {
  name: 'Nav',
}
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.667),
    rgba(255, 162, 0, 0.18),
    rgba(255, 255, 255, 0.667)
  );
  background-size: 200%;
  background-position: 0%;
  transition: 0.5s;

  &:hover {
    background-position: 100%;
  }

  .nav-left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .nav-right {
    display: flex;
    align-items: center;
  }
}
</style>
@/store/modules/navControl
