// 路由鉴权：项目中路由能否被访问的权限设置
import router from './router'
// 进度条
// @ts-expect-error
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 引入 setting 来进行网页 title 的修改
import setting from './setting'

// 获取用户仓库内部 token 数据，判断用户是否登录成功
import useUserStore from './store/modules/user'
// 在组件外部必须得先获取 pinia 才能访问仓库
import pinia from './store'
const userStore = useUserStore(pinia)

// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  // 获取 token 判断用户登录还是未登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  if (token) {
    // 登录成功不能访问 login
    if (to.path == '/login') {
      // 如果访问 login 则跳转到 /
      next({ path: '/' })
    } else {
      // 有用户信息
      if (username) {
        // 放行
        next()
      } else {
        // 如果没有用户信息，在守卫这里发请求获取到了用户信息再放行
        try {
          // 获取用户信息
          await userStore.userInfo()
          // 放行
          next()
        } catch (error) {
          // 可能 error 原因：1. token过期，获取不到用户信息了
          // 2. 用户手动修改本地存储 token
          // 退出登录 -> 用户相关的数据清空
          await userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  } else {
    // 未登录时只能访问 login
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
  next()
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
