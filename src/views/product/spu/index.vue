<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <el-button @click="" type="primary" size="default" icon="Plus">
        添加SPU
      </el-button>
      <!-- 展示已有 SPU数据 -->
      <el-table style="margin: 15px 0px" border>
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column label="SPU名称" align="center"></el-table-column>
        <el-table-column label="SPU描述" align="center"></el-table-column>
        <el-table-column label="SPU操作" align="center"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        small="small"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 场景切换
let scene = ref<number>(0)
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(3)
// 存储已有 SPU 总个数
let total = ref<number>(30)
</script>

<style scoped lang="scss"></style>
