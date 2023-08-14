// 控制菜单是否折叠的仓库，方便其他组件访问 fold 和 refresh
// 当前可以使用 emit 因为没有进一步将 nav 里面的内容封装成组件，为子给父传
// 但为了方便以后可能的进一步封装，这里使用 pinia
import { defineStore } from 'pinia'

export default defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 控制菜单折叠还是收起
      refresh: false, // 控制刷新效果
    }
  },
})
