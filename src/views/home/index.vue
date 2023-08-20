<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">Welcome! {{ userStore.username }}</h3>
        <p class="subtitle">星舱商管运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关的仓库 获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin-right: 30px;
  }

  .bottom {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .title {
      font-size: 35px;
      font-weight: bold;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottoms {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
</style>
