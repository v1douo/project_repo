<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-sidebar clearfix">
      <!-- logo -->
      <div class="logo">
        <img :src="setting.logo" alt="Logo" />
        <p>{{ setting.title }}</p>
      </div>
      <!-- 展示菜单（滚动组件） -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu background-color="$sidebar-bgc" text-color="white">
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶部导航 -->
    <div class="layout-nav"></div>

    <!-- 内容展示区 -->
    <div class="layout-main">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
import Menu from './menu/index.vue'
import useUserStore from '@/store/modules/user'
// 引入封装好的 main（内容展示区）
import Main from './main/index.vue'
let userStore = useUserStore()
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-sidebar {
    width: $sidebar-width;
    height: 100vh;
    background-color: $sidebar-bgc;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      color: white;
      margin-top: 15px;

      img {
        width: 50px;
        height: 50px;
      }

      p {
        font-size: 20px;
        margin-left: 10px;
      }
    }

    .scrollbar {
      width: 100%;
      // 减去 logo 的 height + mt，防止撑大 sidebar
      height: calc(100vh - 50px - 15px);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout-nav {
    width: $nav-width;
    height: $nav-height;
    background-color: #bfc;
    position: fixed;
    top: 0;
    left: $sidebar-width;
  }

  .layout-main {
    position: absolute;
    // 宽度和 nav 一样宽
    width: $nav-width;
    height: calc(100vh - $nav-height);
    background-color: skyblue;
    left: $sidebar-width;
    top: $nav-height;
    padding: 20px;
    overflow: auto;
  }
}
</style>
