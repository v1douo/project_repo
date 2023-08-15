// 定义仓库数据 state 类型
import type { RouteRecordRaw } from 'vue-router'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

import type { CategoryObj } from '@/api/product/attr/type'
// 定义分类仓库 state 对象的 ts 类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
  c2Id: string | number
  c2Arr: CategoryObj[]
  c3Id: string | number
  c3Arr: CategoryObj[]
}
