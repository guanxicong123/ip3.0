<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\components\header.vue
  @Describe: 首页头部
-->
<template>
    <div class="broadcast-header">
        <h2>IP网络广播系统</h2>
        <div class="broadcast-header-function">
            <div class="broadcast-header-function-user">
                <el-dropdown @command="handleCommandUser">
                    <span class="el-dropdown-link">
                        admin
                        <el-icon><ArrowDownBold /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="simplified">修改账号</el-dropdown-item>
                            <el-dropdown-item command="character">修改密码</el-dropdown-item>
                            <el-dropdown-item command="english">关于</el-dropdown-item>
                            <el-dropdown-item command="english">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="broadcast-header-function-window">
                <el-dropdown @command="handleCommand">
                    <el-icon><Tools /></el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="simplified">中文简体</el-dropdown-item>
                            <el-dropdown-item command="character">中文繁体</el-dropdown-item>
                            <el-dropdown-item command="singGion">English</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-icon><Stamp /></el-icon>
                <el-icon @click="handleMinimize"><Minus /></el-icon>
                <el-icon @click="handleMaxMin"><FullScreen /></el-icon>
                <el-icon @click="close"><Close /></el-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const $useRouter = useRouter();
    const ipcRenderer = window.electronAPI.ipcRenderer

    const data = reactive({
        isShowMaximize: false
    })
    
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(data)
    })
    const handleCommandUser = (command: string | number | object) => {
        if (command === 'english') {
            $useRouter.push('/')
        }
    }
    // 切换语言文本
    const handleCommand = (command: string | number | object) => {
        console.log(command)
    }
    // 隐藏
    const handleMinimize = () => {
        ipcRenderer.send("minimize")
    }
    // 最大化、最小化
    const handleMaxMin = () => {
        if (data.isShowMaximize) {
            ipcRenderer.send('unmaximize')
            data.isShowMaximize = false
        } else {
            ipcRenderer.send('maximize')
            data.isShowMaximize = true
        }
    }
     // 关闭
    const close = () => {
        ipcRenderer.send('close')
    }

</script>

<style lang="scss" scoped>
    .broadcast-header {
        height: 100%;
        -webkit-app-region: drag;
        h2 {
            float: left;
            color: #666666;
            font-size: 18px;
            line-height: 44px;
            font-weight: bold;
        }
        .broadcast-header-function {
            -webkit-app-region: no-drag;
            float: right;
            display: flex;
            align-items: center;
            .broadcast-header-function-window {
                width: 155px;
                height: 100%;
                display: flex;
                align-items: center;
                border-left: 2px solid #666666;
                >div {
                    flex: 1;
                }
                i {
                    flex: 1;
                    font-size: 16px;
                    color: #666666;
                }
            }
            .broadcast-header-function-user {
                display: inline-block;
                margin-right: 8px;
                .el-dropdown-link {
                    line-height: 44px;
                    font-size: 12px;
                }
            }
        }
    }
</style>