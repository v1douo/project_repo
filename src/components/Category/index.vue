<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler1">
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler2">
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id">
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
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

// 通知分类仓库发请求，获取一级分类的数据
const getC1 = () => {
  categoryStore.getC1()
}

// 一级分类下拉菜单的 change 事件，即 c1Id 有了
function handler1() {
  // 清除其他分类的数据
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // 有了一级 id 就开始获取二级分类的数据
  categoryStore.getC2()
}

function handler2() {
  // 只需要清除 id 就可以
  categoryStore.c3Id = ''
  // 有了二级 id 就开始获取三级分类的数据
  categoryStore.getC3()
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
