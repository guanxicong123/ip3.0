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
// mounted 实例挂载完成后被调用
onMounted(() => {
  window.electronAPI.send("main-window", "");
});
</script>

<style lang="scss">
.broadcast-home-container {
  height: 100%;
  background-color: $c-fff;
  .broadcast-home-aside {
    background-color: #0070ee;
    border-radius: 0px 16px 16px 0px;
    font-size: 12px;
  }
  .broadcast-home-header {
    height: 44px;
    line-height: 44px;
    padding: 0 12px;
    box-shadow: inset 0px -1px 0px 0px #f5f5f5;
  }
  .el-container {
    border: 1px solid #f5f5f5;
    border-left: none;
  }
}
</style>
