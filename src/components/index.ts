// 插件 用来全局注册

// 进行全局注册 SvgIcon
import SvgIcon from '@/components/SvgIcon/index.vue'

// 把所有的需要全局注册的组件都放到这里，这里就一个，但是模拟多个的情况
const allGlobalComponents: any = { SvgIcon }

export default {
  // 在 main.ts 中一旦 use 就会执行 install()
  install(app: any) {
    // 利用 forEach 把需要注册的组件全部注册
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key])
    })
  },
}
