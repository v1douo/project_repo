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

// 属性值（数据）对象的 ts 类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

// 存储多个属性值（数据）的数组类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

// 存储 属性对象 的数组的 ts 类型
export type AttrList = Attr[]

// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
