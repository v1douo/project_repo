<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id">
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select></el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select></el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

// 挂载后获取一级分类的数据
onMounted(() => {
  getC1()
})

const getC1 = () => {
  // 通知分类仓库发请求，获取一级分类的数据
  categoryStore.getC1()
}
</script>

<style scoped lang="scss">
.el-form {
  display: flex;
  justify-content: space-around;
}

.el-form-item {
  margin: 0;
}
</style>
