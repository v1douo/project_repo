<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select>
        <el-option label="apple"></el-option>
        <el-option label="apple"></el-option>
        <el-option label="apple"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请输入SPU描述"></el-input>
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
      <el-select>
        <el-option label="apple"></el-option>
        <el-option label="apple"></el-option>
        <el-option label="apple"></el-option>
      </el-select>
      <!-- 添加销售属性按钮 -->
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加销售属性
      </el-button>
      <!-- 展示销售属性与属性值的 table -->
      <el-table border style="margin: 10px 0px">
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
          prop=""
        ></el-table-column>
        <el-table-column align="center" label="销售属性值"></el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template #="{}">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click=""
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="">保存</el-button>
      <el-button type="danger" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
let emits = defineEmits(['changeScene'])

// 点击取消按钮通知父组件切换场景为 0，展示 SPU 数据
function cancel() {
  emits('changeScene', 0)
}
</script>
