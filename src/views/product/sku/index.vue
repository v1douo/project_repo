<template>
  <el-card>
    <el-table border style="margin: 10px 0px">
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
        width="150px"
        prop=""
      ></el-table-column>
      <el-table-column
        label="描述"
        align="center"
        show-overflow-tooltip
        width="150px"
        prop=""
      ></el-table-column>
      <el-table-column label="图片" align="center" width="150px">
        <template #="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        align="center"
        prop="weight"
      ></el-table-column>
      <el-table-column
        align="center"
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click=""
          ></el-button>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled"></el-button>
          <el-popconfirm :title="`确定删除${row.skuName}?`" width="200px">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
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
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)

</script>

<style scoped lang="scss"></style>
