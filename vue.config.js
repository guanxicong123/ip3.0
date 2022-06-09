const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')
const path = require('path')
const pathSrc = path.resolve(__dirname, 'src')

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        resolve: { // 路径别名配置
            alias: {
                '@': pathSrc,
            },
        },
        plugins: [ // 导入插件
            AutoImport({
                imports: ['vue'], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
                resolvers: [
                    ElementPlusResolver(), // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                    IconsResolver({
                        prefix: 'Icon', // 自动导入图标组件
                    }),
                ],
                dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
            }),
            Components({
                resolvers: [
                    ElementPlusResolver(), // 自动导入 Element Plus 组件
                    IconsResolver({
                        enabledCollections: ['ep'], // 自动注册图标组件
                    }),
                ],
                dts: path.resolve(pathSrc, 'components.d.ts'),
            }),
            Icons({
                autoInstall: true,
            }),
        ],
    },
    /**
     * 详情看官网：https://cli.vuejs.org/zh/config/
     * 支持webPack-dev-server的所有选项
     * host: 可以直接写IP地址这样方便真机测试
     * port: 端口号
     * open: 配置自动启动浏览器
     * proxy: 配置多个代理
     */
    devServer: {
        host: "172.16.21.9",
        port: 8003,
        // open: true,
        // https: true,
        proxy: {
            '/api/v2': {
                target: 'http://172.16.21.36:81',
                changeOrigin: true
            },
            '/uploads': {
                target: 'http://172.16.21.36:81',
                changeOrigin: true
            }
        }
    },
})
