// 路由鉴权：项目中路由能否被访问的权限设置
import router from './router'
// 进度条
// @ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局前置守卫
router.beforeEach((to: any, from: any, next: any) => {
  nprogress.start()
  next()
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
