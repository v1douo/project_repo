<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        v-model="skuParams.price"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        v-model="skuParams.weight"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        v-model="skuParams.skuDesc"
        type="textarea"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="item.saleAttrName"
          v-for="item in saleArr"
          :key="item.id"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="名称"
          prop="imgName"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template #="{ row }">
            <el-button @click="handler(row)" type="primary" size="small">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="danger" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  reqAddSku,
  reqSpuHasSaleAttr,
  reqSpuImageList,
} from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

let emits = defineEmits(['changeScene'])
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片的数据
let imgArr = ref<any>([])
// 获取table组件实例
// let table = ref<any>()
//收集SKU的参数
let skuParams = reactive<SkuData>({
  // 父组件传递过来的数据
  category3Id: '', // 三级分类的 ID
  spuId: '', // 已有的 SPU 的ID
  tmId: '', // SPU 品牌的ID
  // v-model收集
  skuName: '', // sku 名字
  price: '', // sku 格
  weight: '', // sku 重量
  skuDesc: '', // sku 的描述

  //平台属性的收集
  skuAttrValueList: [],
  // 销售属性
  skuSaleAttrValueList: [],
  // sku图片地址
  skuDefaultImg: '',
})

// 获取 table 组件实例
let table = ref<any>()

// 取消按钮的回调
function cancel() {
  emits('changeScene', { flag: 0, params: '' })
}

async function initSkuData(
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = result.data
  // 销售属性
  saleArr.value = result1.data
  // 图片
  imgArr.value = result2.data
}

// 设置默认图片按钮的回调
function handler(row: any) {
  // 点击的时候，全部图片的的复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮的方法
async function save() {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  // 添加 SKU 的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零
    emits('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

defineExpose({ initSkuData })
</script>
