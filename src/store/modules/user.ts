// 创建用户相关仓库
import { defineStore } from 'pinia'
// 引入登陆接口
import { reqLogin, reqUserInfo } from '@/api/user'
// 引入数据类型
import type { loginFormData, loginResponseData } from '@/api/user/type'
import { UserState } from './types/types'
// 引入操作本地存储数据的工具
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoute } from '@/router/routes'

const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      // 存储用户的唯一标识 token
      token: GET_TOKEN(),
      // 生成菜单需要的数组（路由）
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登陆按钮回调方法
    async userLogin(data: loginFormData) {
      // 发送登陆请求，过程如下
      // 通过统一管理的 API 接口 reqLogin 传入 data
      // 在 reqLogin 中传入 url 路径和 data 给 request（即二次封装的 axios）
      // mock 接口在 request 中处理访问，然后决定返回的数据
      const res: loginResponseData = await reqLogin(data)
      // 登陆成功 200 -> token
      if (res.code === 200) {
        this.token = res.data.token as string
        // 进行本地持久化存储
        SET_TOKEN(res.data.token as string)
        // 让当前的 async 函数返回一个成功的 promise
        return 'OK'
      } else {
        // 登陆失败 201 -> 返回错误信息
        return Promise.reject(new Error(res.data.message))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息存储在仓库中
      let res = await reqUserInfo()
      // 如果获取用户信息成功
      if (res.code == 200) {
        this.username = res.data.checkUser.username
        this.avatar = res.data.checkUser.avatar
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败！')
      }
    },
    //退出登录
    async userLogout() {
      // 目前没有 mock 接口（退出登录接口，通知服务器本地用户唯一标识失效)
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  getters: {},
})

export default useUserStore
