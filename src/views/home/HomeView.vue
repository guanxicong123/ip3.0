<template>
    <el-container class="broadcast-home-container">
        <div class="broadcast-home-aside">
            <Menu></Menu>
        </div>
        <el-container>
            <el-header class="broadcast-home-header">
                <Header></Header>
            </el-header>
            <el-main class="broadcast-home-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
    const ipcRenderer = window.electronAPI.ipcRenderer
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        ipcRenderer.send('main-window', '')
    })
</script>

<style lang="scss">
.broadcast-home-container {
    height: 100%;
    background-color: #FFF;
    .broadcast-home-aside {
        background-color: #0070EE;
        border-radius: 0px 16px 16px 0px;
        font-size: 12px;
    }
    .broadcast-home-header {
        height: 44px;
        line-height: 44px;
        padding: 0 12px;
        box-shadow: inset 0px -1px 0px 0px #F5F5F5;
    }
}
</style>