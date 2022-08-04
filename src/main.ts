import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { Md5 } from 'ts-md5'
import axios from 'axios'
import "element-plus/dist/index.css"
import "@/assets/css/theme.scss"
import "@/assets/font/iconfont.js"
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const global = app.config.globalProperties //原型链
global.$md5 = Md5
global.$http = axios.create({
    baseURL: '/api/v2',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
})
//请求拦截器
global.$http.interceptors.request.use((config: { headers: { Authorization: string } }) => {
    // 在发送请求之前做些什么
    const token = sessionStorage.getItem('userToken')
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error)
})
// 添加响应拦截器
global.$http.interceptors.response.use((response: { data: { result: any; result_message: any } }) => {
    if ([6, 7, 8, 401, 404, 10308].includes(response.data.result)) {
        global.$message.error(response.data.result_message)
        router.push('/')
        sessionStorage.removeItem('userToken')
        return response.data
    }
    if (response.data.result !== 0 && response.data.result !== undefined) {
        global.$message.error(response.data.result_message)
    }
    if (response.data.result === 400) {
        global.$message.error(response.data.result_message)
        return response.data
    } else if (response.data.result === 500) {
        global.$message.error('服务器连接超时')
        return response.data
    }
    // 对响应数据做点什么
    return response.data
}, (error: { response: { data: { result_message: any } } }) => {
    // 对响应错误做点什么
    if (error.response.data && error.response.data.result_message) {
        global.$message.error(error.response.data.result_message)
    }
    return Promise.reject(error)
})
app
    .use(createPinia() as any)
    .use(router as any)
    .mount("#app");
