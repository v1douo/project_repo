<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>

    <!-- 表格组件：展示已有数据 -->
    <el-table style="margin: 20px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        align="center"
        prop="tmName"
      ></el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template #="{ row }">
          <img :src="row.logoUrl" height="80" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" align="center">
        <template #="{}">
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @current-change="getHasTrademark"
      @size-change="sizeChange"
      :pager-count="9"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      small="small"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'

// 当前页码
let pageNo = ref<number>(1)
// 每一页显示多少条数据
let limit = ref<number>(5)
// 一共有几条数据
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])

// 获取已有品牌的接口封装为一个函数
async function getHasTrademark(pager = 1) {
  //当前页码
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

//组件挂载完毕发一次数据请求
onMounted(() => {
  getHasTrademark()
})

// 当下拉菜单发生变化的时候触发(即改变一页几条数据的时候)
const sizeChange = () => {
  // 这里会自动传参，当前的页码数，因此必须要写在下面，让 pager 一直为默认值 1
  getHasTrademark()
}
</script>

<style scoped lang="scss"></style>
