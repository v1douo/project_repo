// 二次封装 axios，为了使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
//创建 axios 实例
const request = axios.create({
  // 基础路径上会携带 /api
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
//请求拦截器
request.interceptors.request.use((config) => {
  // 获取用户仓库，目的是为了获取仓库中存储的登陆用户的 token
  // 用于携带给服务器（使用 headers）
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token 过期！'
        break
      case 403:
        msg = '无权访问！'
        break
      case 404:
        msg = '请求地址错误！'
        break
      case 500:
        msg = '服务器出现问题！'
        break
      default:
        msg = '无网络！'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
