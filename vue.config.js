const { defineConfig } = require('@vue/cli-service')

const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')
const path = require('path')
const pathSrc = path.resolve(__dirname, 'src')

module.exports = defineConfig({
    lintOnSave: false,
    pluginOptions: {
        electronBuilder: {
            preload: "src/preload.ts",
            builderOptions: {
                "extraResources": [
                    {
                        "from": "../public/renderer/*", // 项目资源
                        "to": "../renderer" // 打包后输出到resources目录下
                    }
                ],
                // options placed here will be merged with default configuration and passed to electron-builder
                "productName": 'ip-broadcast', //项目名，也是生成的安装文件名，即ip-broadcast.exe
                "appId": 'com.example.ip-broadcast',
                "copyright": "Copyright © 2021",//版权信息
                // 设置用户可选择安装目录
                "nsis": {
                    // "oneClick" : false,// 是否一键安装
                    // "allowToChangeInstallationDirectory" : true, // 允许修改安装目录
                    // "installerIcon": "./icon/icon.ico",// 安装图标
                    // "uninstallerIcon": "./icon/icon.ico",//卸载图标
                    // "installerHeaderIcon": "./icon/icon.ico", // 安装时头部图标
                    "createDesktopShortcut": true, // 创建桌面图标
                    "createStartMenuShortcut": true,// 创建开始菜单图标
                    "shortcutName": "ip-broadcast", // 图标名称
                    "deleteAppDataOnUninstall": true, // 卸载时删除 localStorage 数据
                    // "include": "./installer.nsh", // 配置 nsn 如修改默认安装目录
                    // "license": "./public/license_zh_CN.txt", // 用户协议-指定语言路径
                    // "displayLanguageSelector": true, // 语言选择配置
                },
                // "directories": {//输出文件夹
                //   "buildResources": "./public", // 用户协议-支持多语言
                // },
                "win": {//win相关配置
                    // "requestedExecutionLevel": "highestAvailable", // requireAdministrator: 管理员权限, highestAvailable: 可用的最高权限, asInvoker: 默认配置
                    "icon": "./icon/icon.ico",//图标，当前图标在icon目录下，注意这里有两个坑
                    "target": [
                        {
                            "target": "nsis",// 使用nsis打成安装包，打包成免安装版
                            "arch": [
                                "x64",//64位
                                // "ia32"//32位
                            ]
                        }
                    ]
                },
                "dmg": { // macOSdmg 
                    "contents": [
                        {
                            "x": 410,
                            "y": 150,
                            "type": "link",
                            "path": "/Applications"
                        },
                        {
                            "x": 130,
                            "y": 150,
                            "type": "file"
                        }
                    ]
                },
                "mac": {  // mac
                    "icon": "./icon/icon.icns"
                },
                "linux": { // linux
                    "icon": "./icon/icon",
                    "target": "deb"
                }
            }
        }
    },
    transpileDependencies: true,
    /**
     * webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
     */
    chainWebpack(config) {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
    },
    configureWebpack: {
        // 路径别名配置
        resolve: {
            alias: {
                '@': pathSrc,
            },
        },
        /**
         * 向全局自动导入插件配置，配置详情：
         * unplugin-auto-import: https://github.com/antfu/unplugin-auto-import
         * unplugin-vue-components: https://github.com/antfu/unplugin-vue-components
         */
        plugins: [
            AutoImport({
                // 目标文件
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/, /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],
                // 全局注册导入，详情看 auto-imports.d.ts 文件
                imports: [
                    'vue',
                    'pinia',
                    'vue-router',
                    {
                        '@/utils/storage': [
                            // 命名导入 import { localStorage } from '@/utils/storage'
                            'localStorage',
                        ],
                        '@/store/app': [
                            ['default', 'useAppStore'],
                            // 别名 import { useFetch as useMyFetch } from '@/store'
                            // ['useFetch', 'useMyFetch'],
                        ],
                        '@/store/terminal': [
                            ['default', 'useTerminalStore'],
                            // 别名 import { useFetch as useMyFetch } from '@/store'
                            // ['useFetch', 'useMyFetch'],
                        ],
                        '@/store/system_config': [
                            ['default', 'useSystemStore']
                        ],
                        'axios': [
                            // 默认导入 import { default as axios } from 'axios'
                            ['default', 'axios'],
                        ],
                    }
                ],
                // 声明文件生成位置和文件名称
                dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
                // 解析器来进行组件声明
                resolvers: [
                    // Element Plus 组件相关函数(带样式)
                    ElementPlusResolver(),
                    // 图标组件
                    IconsResolver({
                        prefix: 'Icon',
                    }),
                ],
                // eslint报错解决
                eslintrc: {
                    enabled: false, // Default `false`
                    filepath: './.eslintrc-auto-import.json',
                    globalsPropValue: true,
                },
            }),
            Components({
                // 自定义组件的解析器
                resolvers: [
                    // Element Plus 组件
                    ElementPlusResolver(),
                    // 图标库组件
                    IconsResolver({
                        enabledCollections: ['ep'],
                    }),
                ],
                // 声明文件生成位置和文件名称
                dts: path.resolve(pathSrc, 'components.d.ts'),
            }),
            Icons({
                autoInstall: true,
            }),
        ],
    },
    /**
     * 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
     * 配置详情: https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
     */
    css: {
        loaderOptions: {
            scss: {
                additionalData: `
          @import "@/assets/css/color.scss";
        `
            }
        }
    },
    /**
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
     * 打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
     * map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
     * 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
     */
    productionSourceMap: false,
    /**
     * 详情看官网：https://cli.vuejs.org/zh/config/
     * 支持webPack-dev-server的所有选项
     * host: 可以直接写IP地址这样方便真机测试
     * port: 端口号
     * open: 配置自动启动浏览器
     * proxy: 配置多个代理
     */
    devServer: {
        host: "172.16.21.10",
        port: 8003,
        // open: true,
        // https: true,
        proxy: {
            '/api/v29+': {
                target: 'http://172.16.21.126:81',
                changeOrigin: true
            },
            '/uploads': {
                target: 'http://172.16.21.126:81',
                changeOrigin: true
            }
        }
    },
})