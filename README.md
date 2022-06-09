<p align="center">
    <img src="https://img.shields.io/badge/Vue-3.2.13-brightgreen.svg"/>
    <img src="https://img.shields.io/badge/Pinia-2.0.14-yellow.svg"/>
    <img src="https://img.shields.io/badge/Electron-17.4.7-brightgreen.svg"/>
    <img src="https://img.shields.io/badge/TypeScript-4.5.5-blue.svg"/>
    <img src="https://img.shields.io/badge/Webpack-5.54.0-green.svg"/>
    <img src="https://img.shields.io/badge/Element Plus-2.2.4-blue.svg"/>
    <img src="https://img.shields.io/badge/Author-HuangMaoFeng-purple.svg"/>
    <img src="https://img.shields.io/badge/Organization-保伦-red.svg"/>
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
    IP网络广播服务平台3.0-分控端
</p>


## 项目介绍
基于IP网络广播服务平台2.0的分控端-使用跨平台的 **Electron** 桌面应用程序重新开发。



## 开发规范
* 参考公司规范文档
* 参考官方 [Vue风格指南](https://v3.cn.vuejs.org/style-guide/)


## 技术栈

| 技术栈 | 描述 | 官网 |
| --- | --- | --- |
| Vue3 | 渐进式 JavaScript 框架 | https://staging-cn.vuejs.org/ |
| Vue CLI | Vue.js 开发的标准构建工具 | https://cli.vuejs.org/zh/guide/ |
| Vue Router | Vue.js 生态的核心库-路由 | https://router.vuejs.org/zh/ |
| Pinia | Vue.js 生态的核心库-状态管理 | https://pinia.vuejs.org/ |
| TypeScript | JavaScript 的超集 | https://www.tslang.cn/ |
| Element Plus | 基于 Vue 3，面向设计师和开发者的组件库 | https://element-plus.gitee.io/zh-CN/ |
| Axios | 基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中 | http://www.axios-js.com/zh-cn/docs/ |
| Webpack | 现代 JavaScript 应用程序的静态模块打包器 | https://www.webpackjs.com/ |
| Electron | 使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序  | https://www.electronjs.org/ |
| 更多插件 | 在 package.json 中查看 | …… |


## 项目预览

项目原型地址：https://lanhuapp.com/url/gI3FJ

## 启动部署

#### 环境准备

- **安装 Node** 
    版本：v16 +

- **安装 Yarn** 
    版本：v1.22 +

- **开发工具**
    推荐 VS Code

- **Vue CLI**
    版本：v5 +

- **必装插件**
    VSCode 插件市场搜索并安装 Volar, 且一定要禁用 Vetur，不然代码会出现组件使用了但编译器还报组件未使用的警告信息，另外Vue作者尤雨溪也在 Vue3 生态话题说过 Volar 将会替代 Vetur 作为 Vue 的官方插件。

#### 下载依赖

```
yarn install
```

#### 使用 vue-cli-plugin-electron-builder 安装 Electron
```
vue add electron-builder@alpha
```

#### 启动项目
```
yarn electron:serve
```

#### 编译打包
```
yarn electron:build
```
## 提交规范

* **feat** - 该提交含有新的特性
* **style** - 通常是代码格式的修改
* **chore** - 与src无关，通常是CI、依赖项等
* **fix** - 修复Bug
* **remove** - 删除文件
* **docs** - 文档修改
* **test** - 单元测试改动
* **refactor** - 代码重构
* **perf** - 性能优化、体验
* **revert** - 回滚版本
* **merge** -  代码合并

#### 实例

```
# 含有新特性
git commit -m "feat: 新增功能"

# 代码格式化
git commit -m "style: 规范Eslint"

# 修改依赖项
git commit -m "chore: 修改依赖项"

# 修复Bug, 描述清晰, 日后方便查找, #520 是修复某个id的编号
git commit -m "fix: 干掉了你(#520)"

# 删除文件
git commit -m "remove: 删除文件"

# 修改了 README.md 文档
git commit -m "docs: 新增提交规范"

# 单元测试改动
git commit -m "test: 测试登录"

# 项目代码重构
git commit -m "refactor: 重构项目"

# 项目性能优化、体验
git commit -m "perf: 性能优化、体验"

# 回滚版本
git commit -m "revert: 版本回滚到上次"

# 代码合并
git commit -m "merge: 合并了代码"

```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).