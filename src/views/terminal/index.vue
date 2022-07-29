<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\terminal\index.vue
  @Describe: 终端状态
-->
<template>
  <div class="com-index">
    <div class="com-head">
      <div class="com-head-content">
        <div class="com-breadcrumb">
          <i class="iconfont icon-set-up"></i>
          <div class="play-table-title">
            <span class="theme">全部终端</span>
            <span class="line"> | </span>
            <span>分组</span>
          </div>
          <el-select v-model="form.terminal_status" style="margin-left: 10px">
            <el-option
              v-for="(item, keys) in form.terminalStatusOptions"
              :key="keys"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="form.search"
            :placeholder="form.search_placeholder"
          />
          <el-button :icon="Search"></el-button>
        </div>
        <div class="com-button">
          <span>主讲终端</span>
          <el-select v-model="form.speaker_terminal" style="margin-left: 10px">
            <el-option
              v-for="(item, keys) in form.speakerTerminalOptions"
              :key="keys"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg"></div>
    <div class="com-footer">
      <div class="footer-button">
        <el-checkbox v-model="form.checked_all" label="全选" />
        <el-button type="primary" color="#4900EE"> 全区广播 </el-button>
        <el-button type="primary" color="#467CF7">广播</el-button>
        <el-button type="primary" color="#00A1CC">对讲</el-button>
        <el-button type="primary" color="#06BA7D">监听</el-button>
        <el-button type="danger" color="#D34500">报警</el-button>
      </div>
      <div class="footer-volume">
        <i class="iconfont icon-volume1 theme"></i>
        <el-slider v-model="form.volume" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";

const form = reactive<any>({
  terminal_status: -1, // 终端状态
  search: "", // 搜索
  search_placeholder: "终端名称", // 搜索 placeholder
  speaker_terminal: 1, // 主讲终端
  speakerTerminalOptions: [
    {
      value: 1,
      label: "终端1",
    },
  ],
  terminalStatusOptions: [
    { value: -1, label: "全部状态" },
    { value: 1, label: "空闲" },
    { value: 2, label: "忙碌" },
    { value: 3, label: "冻结" },
    { value: 0, label: "离线" },
  ],
  checked_all: false, // 全选
  volume: 0, // 音量
});

// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped>
.com-head-content {
  .el-input,
  .el-select {
    width: 160px;
  }
  .icon-set-up {
    margin-left: 10px;
    margin-right: 20px;
  }
  .play-table-title {
    margin-left: 10px;
    margin-right: 14px;
    .line {
      margin: 0 15px;
      color: $c-999;
    }
    .theme {
      font-weight: bold;
    }
  }
}
.com-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: unset;
  padding: 25px 0;
  .footer-button {
    display: flex;
    align-items: center;
    padding-left: 30px;
    .el-checkbox {
      margin-right: 50px;
    }
  }
  .footer-volume {
    display: flex;
    align-items: center;
    justify-content: right;
    flex: 1;
    padding-right: 60px;
    .el-slider {
      width: 140px;
      margin-left: 20px;
    }
  }
}
</style>
