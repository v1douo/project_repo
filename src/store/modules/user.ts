// 创建用户相关仓库
import { defineStore } from 'pinia'
// 引入登陆接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
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
        // 设置 TOKEN
        this.token = res.data as string
        // 进行本地持久化存储 TOKEN
        SET_TOKEN(res.data as string)
        // 让当前的 async 函数返回一个成功的 promise
        return 'OK'
      } else {
        // 登陆失败 201 -> 返回错误信息
        return Promise.reject(new Error(res.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息存储在仓库中
      let res = await reqUserInfo()
      // 如果获取用户信息成功
      if (res.code == 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    // 退出登录方法
    async userLogout() {
      // 退出登录请求
      const result = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
