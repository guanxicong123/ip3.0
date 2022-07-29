<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\views\log\index.vue
  @Describe: 日志管理
-->
<template>
  <div class="com-index">
    <div class="com-head set-padding">
      <div class="com-head-content set-height">
        <div class="com-breadcrumb">
          <el-date-picker
            v-model="form.searchDate"
            type="datetimerange"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            :editable="false"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
          <el-button :icon="Search"></el-button>
          <el-button>重置</el-button>
          <el-button
            type="primary"
            @click="form.isAdvancedSearch = !form.isAdvancedSearch"
          >
            高级搜索
          </el-button>
        </div>
        <div class="com-button">
          <i class="iconfont icon-refresh" title="刷新"></i>
          <i class="iconfont icon-delete" title="批量删除"></i>
          <!-- <el-button type="primary">清空日志</el-button>
          <el-button type="primary">导出日志</el-button> -->
        </div>
      </div>
      <template v-if="form.isAdvancedSearch">
        <div class="com-head-content no-flex com-hc-bg">
          <div class="com-breadcrumb">
            <el-select v-model="form.selectLogType">
              <el-option
                v-for="item in logTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <template v-if="['1', '3', '6'].includes(form.activeName)">
              <el-select v-model="form.selectUserType">
                <el-option
                  v-for="item in form.userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template v-if="form.activeName == '1'">
              <el-select v-model="form.selectPlatformType">
                <el-option
                  v-for="item in platformTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="form.search_description"
                placeholder="用户操作"
                clearable
                style="margin-right: 12px"
              />
              <el-input
                v-model="form.search_ip_address"
                placeholder="登录IP地址"
                clearable
              />
            </template>
            <template v-if="form.activeName == '2'">
              <el-select v-model="form.selectTerminalsType">
                <el-option
                  v-for="item in terminalsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="form.selectTerminalStatusType">
                <el-option
                  v-for="item in terminalStatusTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="form.search_terminals"
                placeholder="终端名称/终端IP"
                clearable
              />
            </template>
            <template v-if="form.activeName == '3'">
              <el-select v-model="form.selectTaskType">
                <el-option
                  v-for="item in taskTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-time-picker
                v-model="form.search_date_time"
                value-format="HH:mm:ss"
                placeholder="持续时间"
              />
              <el-input
                v-model="form.search_tasks_name"
                placeholder="任务名称"
                clearable
              />
            </template>
            <template v-if="form.activeName == '4' || form.activeName == '5'">
              <el-select v-model="form.selectTaskOperationType">
                <el-option
                  v-for="item in taskOperationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-time-picker
                v-model="form.search_date_time"
                value-format="HH:mm:ss"
                placeholder="持续时间"
              />
              <el-input
                v-model="form.search_launch_terminal"
                placeholder="发起端"
                clearable
                style="margin-right: 12px"
              />
              <el-input
                v-model="form.search_join_terminal"
                placeholder="接收端"
                clearable
              />
            </template>
            <template v-if="form.activeName == '6'">
              <el-input
                v-model="form.search_txt"
                placeholder="文本内容"
                clearable
                style="margin-right: 12px"
              />
              <el-input
                v-model="form.search_execution_terminal"
                placeholder="执行终端"
                clearable
              />
            </template>
          </div>
        </div>
        <div class="com-head-content com-hc-bg">
          <el-button @click="form.isAdvancedSearch = !form.isAdvancedSearch">
            关闭
          </el-button>
          <el-button>重置</el-button>
          <el-button type="primary">搜索</el-button>
        </div>
      </template>
    </div>
    <div class="com-main set-padding">
      <div class="com-table">
        <el-tabs v-model="form.activeName" @tab-click="handleClick">
          <el-tab-pane label="系统日志" name="1" lazy>
            <system-log></system-log>
          </el-tab-pane>
          <el-tab-pane label="终端日志" name="2" lazy>
            <terminal-log></terminal-log>
          </el-tab-pane>
          <el-tab-pane label="任务日志" name="3" lazy>
            <task-log></task-log>
          </el-tab-pane>
          <el-tab-pane label="广播日志" name="4" lazy>
            <broadcast-log></broadcast-log>
          </el-tab-pane>
          <el-tab-pane label="对讲日志" name="5" lazy>
            <intercom-log></intercom-log>
          </el-tab-pane>
          <el-tab-pane label="TTS转换日志" name="6" lazy>
            <tts-log></tts-log>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from "element-plus";
import { Search } from "@element-plus/icons-vue";

// defineAsyncComponent 异步组件-懒加载子组件
const systemLog = defineAsyncComponent(() => import("./system/index.vue"));
const terminalLog = defineAsyncComponent(() => import("./terminal/index.vue"));
const taskLog = defineAsyncComponent(() => import("./task/index.vue"));
const broadcastLog = defineAsyncComponent(
  () => import("./broadcast/index.vue")
);
const intercomLog = defineAsyncComponent(() => import("./intercom/index.vue"));
const ttsLog = defineAsyncComponent(() => import("./tts/index.vue"));

const form = reactive<any>({
  isAdvancedSearch: false,
  activeName: "1",
  searchDate: "",
  selectLogType: 0,
  // 系统日志
  selectUserType: -1,
  selectPlatformType: "",
  search_ip_address: "",
  search_description: "",
  // 终端日志
  selectTerminalsType: 0,
  selectTerminalStatusType: -1,
  search_terminals: "",
  // 任务日志
  selectTaskType: 0,
  search_tasks_name: "",
  search_date_time: "",
  // 广播日志、对讲日志
  selectTaskOperationType: -1,
  search_launch_terminal: "",
  search_join_terminal: "",
  // TTS日志
  search_txt: "",
  search_execution_terminal: "",

  userOptions: [{ value: -1, label: "全部用户" }],
});

const logTypeOptions = [
  { value: 0, label: "全部日志级别" },
  { value: 1, label: "致命" },
  { value: 2, label: "错误" },
  { value: 3, label: "警告" },
  { value: 5, label: "信息" },
];
const terminalsOptions = [
  { value: 0, label: "全部终端类型" },
  { value: 1, label: "普通终端" },
  { value: 2, label: "对讲终端" },
  { value: 3, label: "采集终端" },
  { value: 4, label: "备份终端" },
  { value: 5, label: "定时任务备份终端" },
  { value: 6, label: "服务器终端" },
  { value: 7, label: "灯光终端" },
  { value: 8, label: "时间终端" },
  { value: 9, label: "转换终端" },
  { value: 10, label: "分区终端" },
  { value: 11, label: "虚拟终端" },
  { value: 12, label: "LED终端" },
  { value: 13, label: "监控终端" },
];
const terminalStatusTypeOptions = [
  { value: -1, label: "全部状态" },
  { value: 0, label: "掉线" },
  { value: 1, label: "上线" },
  { value: 2, label: "故障" },
];
const platformTypeOptions = [
  { value: "", label: "全部平台" },
  { value: "web", label: "web" },
  { value: "PC", label: "PC" },
  { value: "Android", label: "Android" },
  { value: "IOS", label: "IOS" },
  // { value: "TIMING", label: "TIMING" },
  // { value: "SDK", label: "SDK" },
  // { value: "HTTP", label: "HTTP" },
  // { value: "WebPhone", label: "WebPhone" },
];
const taskTypeOptions = [
  { value: 0, label: "全部类型" },
  { value: 21, label: "火警" },
  { value: 15, label: "报警" },
  { value: 19, label: "对讲" },
  { value: 16, label: "广播" },
  { value: 18, label: "电话广播" },
  { value: 22, label: "定时巡更" },
  { value: 14, label: "定时任务" },
  { value: 13, label: "定时打铃" },
  { value: 12, label: "遥控任务" },
  { value: 11, label: "文本播放" },
  { value: 9, label: "短路输入" },
  { value: 8, label: "防拆报警" },
  { value: 7, label: "音源采集" },
  { value: 5, label: "音乐播放" },
  { value: 4, label: "终端点播" },
  { value: 2, label: "环境监听" },
  { value: 1, label: "任务监听" },
];
const taskOperationOptions = [
  { value: -1, label: "全部状态" },
  { value: 0, label: "发起广播" },
  { value: 2, label: "结束广播" },
];
const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "最近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped>
.set-height {
  height: 76px;
}
.no-flex {
  display: block;
  height: auto;
  .com-breadcrumb {
    display: block;
    > div,
    :deep(.el-date-editor) {
      margin: 10px 0;
      vertical-align: middle;
    }
    .el-input {
      width: 200px;
    }
  }
}
:deep(.el-tabs) {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 55px);
    .el-tab-pane {
      height: 100%;
    }
  }
  .com-footer {
    padding-bottom: 0;
  }
}
</style>
