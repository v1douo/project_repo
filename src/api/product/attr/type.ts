// 分类相关的数据 ts 类型

// 都有的属性
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 各种分类的 data 的 ts 类型
export interface CategoryObj {
  id: number | string
  name: string
  // 二级分类 需要 c1Id
  category1Id?: number
  // 三级分类需要 c2Id
  category2Id?: number
}

// 分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  // 不同的分类有不同的 data，其他都一样
  data: CategoryObj[]
}
