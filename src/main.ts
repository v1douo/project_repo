import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置国际化
// @ts-expect-error: 'ts 类型检测飘红'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
// svg 插件配置代码
import 'virtual:svg-icons-register'
// 插件，用于全局注册组件
import globalComponent from '@/components/index.ts'
// 引入全局样式
import '@/styles/index.scss'
// 引入路由
import router from './router'
// 引入 pinia
import pinia from './store'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(globalComponent)
app.use(router)
app.use(pinia)

app.mount('#app')
