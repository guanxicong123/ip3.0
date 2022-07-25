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
          <el-icon>
            <template #default>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-language"></use>
              </svg>
            </template>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="simplified">中文简体</el-dropdown-item>
              <el-dropdown-item command="character">中文繁体</el-dropdown-item>
              <el-dropdown-item command="singGion">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-icon>
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-skin"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="handleMinimize">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-minimize"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="handleMaxMin">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-win"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="close">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close"></use>
            </svg>
          </template>
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const $useRouter = useRouter();

const data = reactive({
  isShowMaximize: false,
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  console.log(data);
});
const handleCommandUser = (command: string | number | object) => {
  if (command === "english") {
    $useRouter.push("/");
  }
};
// 切换语言文本
const handleCommand = (command: string | number | object) => {
  console.log(command);
};
// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
// 最大化、最小化
const handleMaxMin = () => {
  if (data.isShowMaximize) {
    window.electronAPI.send("unmaximize");
    data.isShowMaximize = false;
  } else {
    window.electronAPI.send("maximize");
    data.isShowMaximize = true;
  }
};
// 关闭
const close = () => {
  window.electronAPI.send("close");
};
</script>

<style lang="scss" scoped>
.broadcast-header {
  height: 100%;
  -webkit-app-region: drag;
  h2 {
    float: left;
    color: $c-666;
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
      border-left: 2px solid $c-999;
      > div {
        flex: 1;
      }
      i {
        flex: 1;
        margin-left: 15px;
        font-size: 16px;
        color: $c-666;
        cursor: pointer;
      }
    }
    .broadcast-header-function-user {
      display: inline-block;
      margin-right: 15px;
      .el-dropdown-link {
        line-height: 44px;
        font-size: 12px;
      }
    }
  }
}
</style>
