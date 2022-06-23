<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\components\register.vue
  @Describe: 注册
-->
<template>
    <div class="broadcast-register">
        <div class="broadcast-register-header">
            <el-icon @click="close"><Close /></el-icon>
            <img class="logo-imag" src="@/assets/images/login-logo.png">
            <p>
                请联系厂商注册，软件剩余体验
                <span>{{daysNum}}</span>
                天
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const daysNum = ref(0)
    const data = reactive({
        data: []
    })

    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(data)
    })

    // 关闭
    const close = () => {
        // ipcRenderer.send('close')
    }
</script>

<style lang="scss" scoped>
    .broadcast-register {
        height: 100%;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5), 0px 2px 14px 0px rgba(120, 120, 120, 0.5);
        border-radius: 4px;
        background-color: #FFFFFF;
        text-align: center;
        .el-icon {
            position: absolute;
            top: 12px;
            right: 20px;
            font-size: 20px;
            color: #000000;
        }
        .logo-imag {
            padding-top: 10px;
        }
        p {
            color: #000000;
            font-size: 16px;
        }
    }
</style>