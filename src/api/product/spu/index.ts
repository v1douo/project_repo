import request from '@/utils/request'
import {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SpuHasImg,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

enum API {
  // 获取已有的SPU的数据
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个 SPU 下的商品图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个 SPU 下的全部销售属性
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的 SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的 SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新增的 SKU
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有 SPU 下的全部售卖商品（SKU 列表）
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的 SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部 SPU 品牌的数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

// 获取某个 SPU 下全部商品的图片
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取某个 SPU 的全部销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加一个新的 SPU 接口/ 更新已有的 SPU 接口
// data 即为新增的 SPU 或者 已有的 SPU 对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果 SPU 对象拥有 ID，则就是更新
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

//新增 SKU 请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取 SKU 数据（为了展示 SKU 列表）
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

// 删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
