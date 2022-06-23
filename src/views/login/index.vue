<!-- 
  @Author: hmf
  @CreateDate: 2022-06-20
  @FilePath: src\views\login\index.vue
  @Describe: 登陆页面
-->
<template>
    <div class="broadcast-login">
        <div class="broadcast-login-header">
            <div class="login-header-functron">
                <el-icon @click="handleMinimize"><Minus /></el-icon>
                <el-icon @click="register"><FullScreen /></el-icon>
                <el-icon @click="close"><Close /></el-icon>
            </div>
            <div class="login-header-logo">
                <img class="logo-imag" src="@/assets/images/login-logo.png">
                <h2>IP广播</h2>
            </div>
        </div>
        <div class="broadcast-login-from">
            <div class="login-from-name">
                <el-input
                    v-model="modelRef.username"
                    placeholder="账号"
                    :prefix-icon="Avatar"
                />
            </div>
            <div class="login-from-password">
                <el-input
                    v-model="modelRef.password"
                    placeholder="密码"
                    :prefix-icon="Briefcase"
                />
            </div>
            <div class="login-from-remember_password">
                <el-checkbox v-model="is_checked" label="记住密码"/>
            </div>
            <div class="login-from-server">
                <el-input
                    v-model="modelRef.server_ip_address"
                    placeholder="服务器地址"
                    :prefix-icon="Briefcase"
                />
            </div>
        </div>
        <div class="broadcast-login-sign">
            <el-button type="primary" @click="submit">登录</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Avatar, Briefcase } from '@element-plus/icons-vue'
    const ipcRenderer = window.electronAPI.ipcRenderer

    const $useRouter = useRouter();

    // 表单值
    const modelRef = reactive({
        username: '',
        password: '',
        server_ip_address: '',
    })
    // 记住密码
    const is_checked = ref(false)

    // mounted 实例挂载完成后被调用
    onMounted(() => {
        ipcRenderer.send('login-window')
    })

     // 隐藏
    const handleMinimize = () => {
        ipcRenderer.send("minimize")
    }
    const register = () => {
        ipcRenderer.send('register-window')
    }
    // 关闭
    const close = () => {
        ipcRenderer.send('close')
    }
    // 提交
    const submit = () => {
        $useRouter.push('/terminal')
    }
</script>

<style lang="scss">
    .broadcast-login {
        width: 320px;
        height: 530px;
        background-color: #FFFFFF;
        border-radius: 9px;
        .broadcast-login-header {
            -webkit-app-region: drag;
            height: 230px;
            background: url('@/assets/images/login-bg.png')
        }
        .login-header-functron {
            -webkit-app-region: no-drag;
            width: 80px;
            height: 44px;
            display: flex;
            align-items: center;
            float: right;
            font-size: 16px;
            color: #fff;
            i {
                flex: 1;
            }
        }
        .login-header-logo {
            padding-top: 60px;
            h2 {
                font-size: 20px;
                line-height: 40px;
                font-weight: bold;
                color: #FFFFFF;
            }
        }
        .broadcast-login-from {
            padding-top: 22px;
            text-align: center;
            .el-input {
                padding-top: 8px;
                width: 240px;
                .el-input__wrapper {
                    height: 36px;
                    border-bottom: 1px solid #DDDDDD;
                    box-shadow: 0 0 0 0 var(--el-input-border-color,var(--el-border-color)) inset;
                }
            }
            .login-from-remember_password {
                margin: 0 auto;
                width: 240px;
                text-align: right;
            }
        }
        .broadcast-login-sign {
            padding-top: 26px;
            .el-button {
                width: 240px;
                height: 36px;
                background-color: #0070EE;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
</style>