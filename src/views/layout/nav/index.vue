<!-- 封装的目的主要是为了添加动画 -->
<template>
  <div class="nav">
    <!-- 左！ -->
    <div class="nav-left">
      <!-- 左侧图标 -->
      <el-icon style="margin-right: 10px">
        <Expand></Expand>
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
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!-- 路由的标题 -->
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右！ -->
    <div class="nav-right">
      <el-button size="small" icon="Refresh" circle></el-button>
      <el-button size="small" icon="FullScreen" circle></el-button>
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

<script setup lang="ts"></script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgba(198, 198, 197, 0.667),
    rgba(255, 162, 0, 0.402),
    rgba(198, 197, 197, 0.667)
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
