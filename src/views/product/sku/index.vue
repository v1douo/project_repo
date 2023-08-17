<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="70px"
      ></el-table-column>
      <el-table-column
        label="名称"
        align="center"
        show-overflow-tooltip
        width="130px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        align="center"
        show-overflow-tooltip
        width="130px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" align="center" width="150px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="130px"
        align="center"
        prop="weight"
      ></el-table-column>
      <el-table-column
        align="center"
        label="价格"
        width="130px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'success' : 'info'"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button type="info" size="small" icon="InfoFilled"></el-button>
          <el-popconfirm :title="`确定删除${row.skuName}?`" width="200px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      small="small"
      @current-change="getHasSku"
      @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
import { reqCancelSale, reqSaleSku, reqSkuList } from '@/api/product/sku'
import { SkuData, SkuResponseData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
// 存储 SKU 数据
let skuArr = ref<SkuData[]>([])

// 挂载后获取数据
onMounted(() => {
  getHasSku()
})
async function getHasSku(pager = 1) {
  // 当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单发生变化触发
function handler() {
  getHasSku()
}

// 商品的上架与下架的操作
const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    ElMessage({ type: 'success', message: '下架成功' })
    // 发请求获取当前更新完毕的全部已有的 SKU
    getHasSku(pageNo.value)
  } else {
    // 上架操作
    await reqSaleSku(row.id as number)
    //提示信息
    ElMessage({ type: 'success', message: '上架成功' })
    //发请求获取当前更新完毕的全部已有的 SKU
    getHasSku(pageNo.value)
  }
}

// 更新已有的 SKU
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}
</script>

<style scoped lang="scss"></style>
