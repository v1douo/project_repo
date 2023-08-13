// 定义仓库数据 state 类型
import type { RouteRecordRaw } from "vue-router"
export interface UserState {
  token: string | null,
  menuRoutes: RouteRecordRaw[]
}
