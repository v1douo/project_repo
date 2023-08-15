<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-sidebar clearfix" :class="{ fold: navControl.fold }">
      <!-- logo -->
      <div class="logo" ref="logo">
        <img :src="setting.logo" alt="Logo" />
        <p v-show="isShow">{{ setting.title }}</p>
      </div>
      <!-- 展示菜单（滚动组件） -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="$sidebar-bgc"
          text-color="black"
          :default-active="$route.path"
          active-text-color="rgb(255, 145, 0)"
          :collapse="navControl.fold"
          :collapse-transition="false"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶部导航 -->
    <div class="layout-nav" :class="{ fold: navControl.fold }">
      <Nav></Nav>
    </div>

    <!-- 内容展示区 -->
    <div class="layout-main" :class="{ fold: navControl.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
import Menu from './menu/index.vue'
import Nav from './nav/index.vue'
import useUserStore from '@/store/modules/user'
// 引入封装好的 main（内容展示区）
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
import useNavControl from '@/store/modules/navControl.ts'
import { onMounted, ref } from 'vue'

let userStore = useUserStore()
// 用于获取当前路由地址，让 el-menu 展开当前 path 的菜单
let $route = useRoute()

let navControl = useNavControl()

// 实时监视 logo 宽度以改变标题的显示
let logo = ref()
let logoWidth = ref(0)
let isShow = ref(true)
onMounted(() => {
  if (logo.value) {
    // 初始化获取元素宽度
    logoWidth.value = logo.value.offsetWidth
    // 使用 Resize Observer 监听宽度变化
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        logoWidth.value = entry.contentRect.width
        isShow.value = logoWidth.value > 220 ? true : false
      }
    })
    resizeObserver.observe(logo.value)
  }
})
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-sidebar {
    width: $sidebar-width;
    height: 100vh;
    background-color: $sidebar-bgc;
    transition: 0.4s;

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
        color: rgb(255, 145, 0);
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

    &.fold {
      width: $sidebar-fold-width;
    }
  }

  .layout-nav {
    width: $nav-width;
    height: $nav-height;
    position: fixed;
    top: 0;
    left: $sidebar-width;
    transition: 0.4s;

    &.fold {
      width: $nav-fold-width;
      left: $sidebar-fold-width;
    }
  }

  .layout-main {
    position: absolute;
    // 宽度和 nav 一样宽
    width: $nav-width;
    height: calc(100vh - $nav-height);
    left: $sidebar-width;
    top: $nav-height;
    padding: 20px;
    overflow: auto;
    transition: 0.4s;

    &.fold {
      width: $nav-fold-width;
      left: $sidebar-fold-width;
    }
  }
}
.el-menu--collapse .el-submenu.is-active,
.el-menu--collapse .el-menu-item.is-active {
  background-color: #333 !important; /* 设置你想要的背景颜色 */
}
</style>
