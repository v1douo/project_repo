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
        type="danger"
        circle
        @click="reUpdate"
      ></el-button>
      <el-button
        size="small"
        icon="FullScreen"
        type="info"
        circle
        @click="fullScreen"
      ></el-button>
      <el-popover
        placement="bottom"
        title="主题设置"
        :width="300"
        trigger="hover"
      >
        <!-- 表单元素 -->
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker
              @change="setColor"
              v-model="color"
              size="small"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch
              @change="changeDark"
              v-model="dark"
              class="mt-2"
              style="margin-left: 24px"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button
            type="primary"
            size="small"
            icon="setting"
            circle
          ></el-button>
        </template>
      </el-popover>

      <img
        :src="userStore.avatar"
        style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
      />
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNavControl from '@/store/modules/navControl.ts'
// 获取用户相关的仓库来展示头像和用户名
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
// 获取路由器对象，用于退出登录
import { useRouter } from 'vue-router'

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

// 用户 store
const userStore = useUserStore()

// 获取 $router
const $router = useRouter()
// 退出登录按钮回调
async function logout() {
  // 向服务器发请求（目前没这个接口，先跳过）
  // 仓库中关于用户的数据清空
  await userStore.userLogout()
  // 跳转至登陆界面
  $router.push({ path: '/login' })
}

// 颜色组件的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 收集暗黑模式开关的数据
let dark = ref<boolean>(false)

// switch开关的 chang 事件，进行暗黑模式的切换
const changeDark = () => {
  // 获取HTML根节点
  let html = document.documentElement
  // 判断 HTML 标签是否有类名 dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 主题颜色的设置
const setColor = () => {
  // 通知 js 修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
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
    margin-right: 15px;
  }
}
</style>
