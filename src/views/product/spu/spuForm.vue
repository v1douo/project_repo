<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :value="`${item.id}:${item.name}`"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <!-- 添加销售属性按钮 -->
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加销售属性
      </el-button>
      <!-- 展示销售属性与属性值的 table -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          align="center"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column align="center" label="销售属性值">
          <template #="{ row }">
            <el-tag
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              v-else
              @click="toEdit(row)"
              type="success"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template #="{ index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice(index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 最下面的操作按钮 -->
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="danger" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { SpuData } from '@/api/product/spu/type'
import type {
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SaleAttrValue,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

let emits = defineEmits(['changeScene'])
// 点击取消按钮通知父组件切换场景为 0，展示 SPU 数据
function cancel() {
  emits('changeScene', {
    flag: 0,
    params: 'update',
  })
}

// 存储 SPU的这些数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有 SPU 销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])

// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的 ID
  spuName: '', // SPU 的名字
  description: '', // SPU 的描述
  tmId: '', // 品牌的 ID
  spuImageList: [],
  spuSaleAttrList: [],
})

async function initHasSpuData(spu: SpuData) {
  // 存储已有的 SPU 对象，将来在模板中展示
  SpuParams.value = spu
  // spu 即为父组件传递过来的已有的SPU对象(不完整)
  // 获取品牌的全部的数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取品牌的全部商品图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取 SPU 已有的销售属性数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目的全部 SPU销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 存储全部品牌的数据
  AllTradeMark.value = result.data
  // SPU 的对应商品图片
  imgList.value = result1.data.map((item) => {
    // 用 map 遍历修改对应名称来符合 el-upload 的规范
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有 SPU的销售属性
  saleAttr.value = result2.data
  // 存储全部的销售属性
  allSaleAttr.value = result3.data
}

// 控制图片预览对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片地址
let dialogImageUrl = ref<string>('')
// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  // 对话框弹出来
  dialogVisible.value = true
}
// 照片墙删除文件钩子
function handleRemove() {}
// 照片墙上传成功之前的钩子约束文件的大小与类型
function handlerUpload(file: any) {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M!',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件必类型必须是 PNG | JPG | GIF',
    })
    return false
  }
}
// 计算出当前 SPU 还没有的销售属性，进行下拉框内的展示
let unSelectSaleAttr = computed(() => {
  // 全部销售属性: 颜色、版本、尺码
  // 已有的销售属性: 颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 收集还未选择的销售属性的 ID与 名字
let saleAttrIdAndValueName = ref<string>('')
// 添加销售属性按钮的回调
function addSaleAttr() {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象，将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 把新增的追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 添加属性值按钮的点击事件
function toEdit(row: SaleAttr) {
  // 点击按钮的时候，input 组件出现
  row.flag = true
  row.saleAttrValue = ''
}
// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 整理收集的属性的 ID 与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    row.flag = false
    ElMessage({
      type: 'error',
      message: '属性值不能为空!',
    })
    return
  }
  // 判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })

  if (repeat) {
    row.flag = false
    ElMessage({
      type: 'error',
      message: '属性值重复!',
    })
    return
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切 换为查看模式
  row.flag = false
}

// 最下面保存按钮的回调
async function save() {
  // 整理参数，修改成服务器需要的字段
  // 1: 照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2: 整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  // 提交数据
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景为 0
    emits('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加一个新的 SPU 初始化方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '', // 收集三级分类的ID
    spuName: '', // SPU的名字
    description: '', // SPU的描述
    tmId: '', // 品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''

  // 存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储数据
  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data
}

// 让父组件拿到这些方法
defineExpose({ initHasSpuData, initAddSpu })
</script>
