<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>

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
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
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

  <!-- 对话框组件: 在添加品牌与修改已有品牌的业务时候使用 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- action: 图片上传路径，必须在前面写 /api，否则代理服务器不会发送这次 post 请求 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽 footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="danger" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'

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

// 控制对话框 dialog 显示与隐藏
let dialogFormVisible = ref<boolean>(true)
// 收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取 form 组件
let formRef = ref()

// 添加品牌按钮的回调
function addTrademark() {
  // 对话框显示
  dialogFormVisible.value = true
  // 清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 在展示表单之前清除所有的校验报错信息
  // 第一种写法: ts的问号语法，在没有创建 formRef 的时候也不会报错
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
  // 第二种写法，获取更新后的 DOM
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 修改已有品牌的按钮的回调 row:row即为当前已有的品牌
function updateTrademark(row: TradeMark) {
  // 清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // 对话框显示
  dialogFormVisible.value = true
  // 用 assign 直接将全部的数据赋值给 trademarkParams 显示
  Object.assign(trademarkParams, row)
}
// 对话框底部取消按钮
function cancel() {
  dialogFormVisible.value = false
}
// 对话框底部确认按钮
async function confirm() {
  // 在你发请求之前，要对于整个表单进行校验（主要是校验 Logo，因为没办法触发函数）
  // 调用这个方法进行全部表单相校验，如校验全部通过，再执行后面的语句
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加 or 修改已有品牌
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功!' : '添加品牌成功!',
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败!' : '添加品牌失败!',
    })
    //关闭对话框
    dialogFormVisible.value = false
  }
}
// 上传图片之前触发的钩子函数，可以约束文件类型与大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求：上传文件格式 png|jpg|gif 且小于 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小应小于 4M!',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必为 PNG/JPG/GIF!',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // response 即为当前这次上传图片的 post 请求，服务器返回的数据
  // 收集上传图片的地址，将来添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清除对应图片校验报错（必须上传 LOGO 的报错）
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  // 自定义校验规则
  if (value.trim().length >= 2) {
    // 放行
    callBack()
  } else {
    // 校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称应大于等于两位！'))
  }
}
// 品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    // 放行
    callBack()
  } else {
    callBack(new Error('必须上传 LOGO!'))
  }
}
//表单校验规则对象
const rules = {
  tmName: [
    // required: 这个字段务必校验，表单项前面出来五角星
    // trigger: 代表触发校验规则的时机 [blur, change]
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
