import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { Md5 } from 'ts-md5'
import axios from 'axios'
import "element-plus/dist/index.css"
import "@/assets/css/theme.scss"
import "@/assets/font/iconfont.js"
import terminalsSelectComponents  from '@/components/terminals-select-components.vue'
import quickMusicDialog  from '@/components/quick-music-dialog.vue'
const app = createApp(App)

app.component('terminals-select-components', terminalsSelectComponents)
app.component('quick-music-dialog', quickMusicDialog)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const global = app.config.globalProperties //原型链
global.$md5 = Md5
global.$http = axios.create({
    baseURL: '/api/v29+',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
})
//请求拦截器
global.$http.interceptors.request.use((config: { headers: { Authorization: string } }) => {
    // 在发送请求之前做些什么
    const token = localStorage.get('userToken')
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error)
})
// 添加响应拦截器
global.$http.interceptors.response.use((response: { data: { result: any; return_message: any } }) => {
    if ([6, 7, 8, 401, 404, 10308].includes(response.data.result)) {
        global.$message.error(response.data.return_message)
        router.push('/')
        localStorage.remove('userToken')
        return response.data
    }
    if (response.data.result !== 200 && response.data.result !== undefined) {
        global.$message.error(response.data.return_message)
    }
    if (response.data.result === 400) {
        global.$message.error(response.data.return_message)
        return response.data
    } else if (response.data.result === 500) {
        global.$message.error('服务器连接超时')
        return response.data
    }
    // 对响应数据做点什么
    return response.data
}, (error: { response: { data: { return_message: any } } }) => {
    // 对响应错误做点什么
    if (error.response.data && error.response.data.return_message) {
        global.$message.error(error.response.data.return_message)
    }
    return Promise.reject(error)
})
app
    .use(createPinia() as any)
    .use(router as any)
    .mount("#app");
