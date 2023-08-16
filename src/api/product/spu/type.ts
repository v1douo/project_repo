// 都有的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU 数据的 ts 类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
}
// SPU 数据的数组
export type Records = SpuData[]
// 获取 SPU 数据接口返回数据的 ts 类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据的 ts 类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 获取全部品牌接口返回数据的 ts 类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片数据的 ts 类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
// SPU 照片墙数据的 ts 类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 销售属性值对象的 ts 类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 存储已有销售属性值的数组
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象的 ts 类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU 已有销售属性接口，返回数据的 ts 类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 全部 SPU 的返回数据的 ts 类型
export interface HasSaleAttr {
  id: number
  name: string
}
// 获取全部的销售属性接口 返回数据的 ts 类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
