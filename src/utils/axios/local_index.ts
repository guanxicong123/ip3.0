import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AxiosCanceler } from './axios_cancel'
// import qs from "qs"; // qs是axios自带的序列化参数方式
import { ElMessage } from 'element-plus'
import { isString } from '@/utils/is'
import router from '@/router'

// const url = localStorage.get("serverIP");
const axiosCancel = new AxiosCanceler()
// 处理请求状态码
const showStatus = (status: number) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}
// 创建 axios
const $http = axios.create({
  baseURL: '/api/v1/', // 'http://127.0.0.1:9999/api/v1/' || /api/v1/
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    // 'Access-Control-Allow-Origin' : '*',
    // 'Access-Control-Allow-Headers': 'content-type',
    // 'Access-Control-Request-Method': 'GET,POST'
  },
  withCredentials: true, // 是否跨站点访问控制请求
  timeout: 5 * 1000, // 5s超时
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  // 允许在向服务器发送 ‘PUT’, ‘POST’ 和 ‘PATCH’ 这几个请求方法前，修改请求数据
  // transformRequest: [
  //   (data, headers) => {
  //     data = qs.stringify(data);
  //     return data;
  //   },
  // ],
  // 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    (data) => {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = JSON.parse(data)
      }
      return data
    },
  ],
})
// 请求拦截器
$http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // // 在请求开始前，对之前的请求做检查，重复就取消操作
    // axiosCancel.removePending(config)
    // // 将当前请求添加到 pending 中
    // axiosCancel.addPending(config)
    const token = localStorage.get('userToken')
    // 每次请求带上token
    if (token && config.headers) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    // 请求还没有到达服务器，但是报错了,抛到弹窗提示
    ElMessage({
      type: 'error',
      message: '服务器异常，请联系管理员！',
      grouping: true,
    })
    return Promise.reject(error)
  }
)
// 响应拦截器
$http.interceptors.response.use(
    (response: AxiosResponse) => {
        // 在请求结束后，移除本次请求
        // axiosCancel.removePending(response)
        const status = response.status
        if (status < 200 || status >= 300) {
            const message = showStatus(status)
            // 处理http错误，抛到业务代码
            if (isString(response.data)) {
                // 组装成后端返回一样的数据结构
                response.data = {
                    result: {
                        message,
                    },
                }
            } else {
                // 判断后端有返回 message
                const isMsg = Object.prototype.hasOwnProperty.call(
                response.data,
                'return_message'
                )
                // 没有就添加上自定义 message
                if (!isMsg) {
                    response.data.return_message = message
                } else {
                    ElMessage.error(response.data.return_message)
                }
            }
        }
        if (status === 200 && response.data.result !== 200 ) {
            ElMessage.error(response.data.return_message)
        }
        if (status === 401 && response.data.result === 401 ) {
            router.push('/')
        }
        return response.data
    },
    (error) => {
        // 判断该异常是否是由取消请求导致
        if (axios.isCancel(error)) {
            console.log('Cancel request reason: ' + error.message)
        } else {
            // 请求无响应时（超时或服务器挂了）
            ElMessage({
                type: 'error',
                message: '请求超时或服务器异常，请检查网络或联系管理员！',
                grouping: true,
            })
        }
        return Promise.reject(error)
    }
)

export default $http
