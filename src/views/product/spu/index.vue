<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <!-- 添加按钮 -->
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>

        <!-- 展示已有 SPU数据 -->
        <el-table style="margin: 15px 0px" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="SPU名称"
            align="center"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            align="center"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作" align="center">
            <template #="{ row }">
              <el-button
                @click="addSku(row)"
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                @click="updateSpu(row)"
                type="success"
                size="small"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                type="info"
                size="small"
                @click="findSku(row)"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}?`" width="200px">
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
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
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>

      <!-- 添加 SPU / 修改 SPU 的子组件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>

      <!-- 添加 SKU 的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>

      <!-- dialog 对话框: 展示已有的 SKU 数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 引入分类仓库，监视三级 id，一旦有就展示数据
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SkuData,
  SkuInfoData,
  SpuData,
} from '@/api/product/spu/type'
import { ref, watch } from 'vue'
// 引入两个 Form 子组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'

let categoryStore = useCategoryStore()
// 场景切换，0: 显示 SPU 数据，1: 添加修改 SPU，3: 添加 SKU
let scene = ref<number>(2)
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(3)
// 存储已有 SPU 总个数
let total = ref<number>(0)
// 存储已有的 SPU的数据
let records = ref<Records>([])

// 获取子组件实例 SpuForm
let spu = ref<any>()
// 获取子组件实例 SkuForm
let sku = ref<any>()

// 监听三级分类 id
watch(
  () => categoryStore.c3Id,
  () => {
    // 改变时清空对应数据
    records.value = []
    // 如果没有 c3Id 则不展示数据
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
// 获取某一三级分类下的全部 SPU 数据
async function getHasSpu(pager = 1) {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器的展示个数发生变化时触发（x条/页）
function changeSize() {
  getHasSpu()
}

// 添加 SPU 按钮的回调
function addSpu() {
  // 切换场景
  scene.value = 1
  // 点击添加 SPU 调用初始化方法
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 子组件 SpuForm 绑定的子定义事件
function changeScene(obj: any) {
  // 子组件点击取消，将 scene 变为 0，展示数据
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加留在第一页
    getHasSpu()
  }
}
// 修改 SPU 按钮的回调
function updateSpu(row: SpuData) {
  // 点击切换为场景 0，展示数据
  scene.value = 1
  // 调用子组件的实例方法获取完整的 Spu 数据
  spu.value.initHasSpuData(row)
}

// 添加 SKU 按钮的回调
function addSku(row: SpuData) {
  // 点击切换为场景为 2
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 存储 SKU 数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

//查看 SKU 列表的按钮回调
async function findSku(row: SpuData) {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    //对话框显示出来
    show.value = true
  }
}
</script>
