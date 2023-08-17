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

export interface Attr {
  attrId: number | string // 平台属性的ID
  valueId: number | string // 属性值的ID
}
export interface saleArr {
  saleAttrId: number | string // 属性ID
  saleAttrValueId: number | string // 属性值的ID
}
// 添加 SKU 接口参数 ts 类型
export interface SkuData {
  category3Id: string | number // 三级分类的ID
  spuId: string | number // 已有的SPU的ID
  tmId: string | number // SPU品牌的ID
  skuName: string // sku名字
  price: string | number // sku价格
  weight: string | number // sku重量
  skuDesc: string // sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string // sku图片地址
}

//获取 SKU 数据接口的 ts 类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
