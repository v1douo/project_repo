<template>
  <Category></Category>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="">
      添加属性
    </el-button>
    <el-table border style="margin: 15px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="属性名称"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column label="属性值名称" align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
      ></el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
