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
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="form.shortcuts"
            :editable="false"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
          <el-button
            :icon="Search"
            :disabled="form.searchDate?.length == 0"
            @click="handleSearch(form.activeName)"
          ></el-button>
          <el-button
            :disabled="form.searchDate?.length == 0"
            @click="handleRest(form.activeName)"
          >
            重置
          </el-button>
          <el-button @click="form.isAdvancedSearch = !form.isAdvancedSearch">
            高级搜索
          </el-button>
        </div>
        <div class="com-button">
          <i
            class="iconfont icon-refresh"
            title="刷新"
            @click="handleRefresh(form.activeName)"
          ></i>
          <i
            class="iconfont icon-delete"
            title="批量删除"
            :class="{ 'icon-disabled': form.multipleSelection.length == 0 }"
            @click="handleDelete(form.activeName)"
          ></i>
          <!-- <el-button type="primary" plain @click="clearAllLog(form.activeName)">
            清空日志
          </el-button>
          <el-button type="primary" plain @click="form.logDialogVisible = true">
            导出日志
          </el-button> -->
        </div>
      </div>
      <template v-if="form.isAdvancedSearch">
        <div class="com-head-content no-flex com-hc-bg">
          <div class="com-breadcrumb">
            <el-select
              v-model="form.selectLogType"
              @change="handleLevelChange(form.activeName)"
            >
              <el-option
                v-for="item in logTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <template v-if="['1', '3', '6'].includes(form.activeName)">
              <el-select
                v-model="form.selectUserType"
                @change="handleUserChange(form.activeName)"
              >
                <el-option
                  v-for="item in form.userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
            <template v-if="form.activeName == '1'">
              <el-select v-model="form.selectPlatformType" @change="handlePlatformChange">
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
              <el-select
                v-model="form.selectTerminalsType"
                @change="handleTerminalsChange"
              >
                <el-option
                  v-for="item in terminalsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="form.selectTerminalStatusType"
                @change="handleTerminalStatusChange"
              >
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
              <el-select v-model="form.selectTaskType" @change="handleTaskTypeChange">
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
                style="margin-right: 12px"
              />
              <el-input
                v-model="form.search_tasks_name"
                placeholder="任务名称"
                clearable
              />
            </template>
            <template v-if="form.activeName == '4' || form.activeName == '5'">
              <!-- <el-select
                v-model="form.selectTaskOperationType"
                @change="handleStatusChange(form.activeName)"
              >
                <el-option
                  v-for="item in taskOperationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              <el-time-picker
                v-model="form.search_date_time"
                value-format="HH:mm:ss"
                placeholder="持续时间"
                style="margin-right: 12px"
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
          <el-button
            round
            @click="handleAdvancedSearch(form.activeName)"
            :disabled="handleSeatchButton(form.activeName)"
          >
            搜索
          </el-button>
          <el-button
            round
            @click="handleAdvancedReset(form.activeName)"
            :disabled="handleSeatchButton(form.activeName)"
          >
            重置
          </el-button>
          <el-button round @click="form.isAdvancedSearch = !form.isAdvancedSearch">
            关闭
          </el-button>
        </div>
      </template>
    </div>
    <div class="com-main set-padding">
      <div class="com-table">
        <el-tabs v-model="form.activeName" @tab-click="handleClick">
          <el-tab-pane label="系统日志" name="1" lazy>
            <system-log ref="systemRef" @dele="dele"></system-log>
          </el-tab-pane>
          <el-tab-pane label="终端日志" name="2" lazy>
            <terminal-log ref="terminalRef" @dele="dele"></terminal-log>
          </el-tab-pane>
          <el-tab-pane label="任务日志" name="3" lazy>
            <task-log ref="taskRef" @dele="dele"></task-log>
          </el-tab-pane>
          <el-tab-pane label="广播日志" name="4" lazy>
            <broadcast-log ref="broadcastRef" @dele="dele"></broadcast-log>
          </el-tab-pane>
          <el-tab-pane label="对讲日志" name="5" lazy>
            <intercom-log ref="intercomRef" @dele="dele"></intercom-log>
          </el-tab-pane>
          <el-tab-pane label="TTS转换日志" name="6" lazy>
            <tts-log ref="TTSRef" @dele="dele"></tts-log>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 导出日志 -->
    <export-log :isShow="form.logDialogVisible" @show="handleLogDialogVisible" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, TabsPaneContext, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { UsersService } from "@/utils/api/users/index";
import $http from "@/utils/axios/index";

// defineAsyncComponent 异步组件-懒加载子组件
const systemLog = defineAsyncComponent(() => import("./system/index.vue"));
const terminalLog = defineAsyncComponent(() => import("./terminal/index.vue"));
const taskLog = defineAsyncComponent(() => import("./task/index.vue"));
const broadcastLog = defineAsyncComponent(() => import("./broadcast/index.vue"));
const intercomLog = defineAsyncComponent(() => import("./intercom/index.vue"));
const ttsLog = defineAsyncComponent(() => import("./tts/index.vue"));
const exportLog = defineAsyncComponent(() => import("./components/export_log.vue"));

// refs
const systemRef = ref();
const intercomRef = ref();
const TTSRef = ref();
const broadcastRef = ref();
const taskRef = ref();
const terminalRef = ref();

const form = reactive<any>({
  isAdvancedSearch: false,
  activeName: "1",
  searchDate: [],
  selectLogType: 0, // 日志级别
  multipleSelection: [],
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

  userOptions: [], // 用户数据
  logDialogVisible: false, // 是否显示导出日志弹窗
  shortcuts: [
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
  ],
});
// 下拉框选择数据
const logTypeOptions = [
  { value: 0, label: "全部日志级别" },
  { value: 1, label: "信息" },
  { value: 2, label: "警告" },
  { value: 3, label: "错误" },
  { value: 4, label: "致命" },
];
const terminalsOptions = [
  ...[{ value: 0, label: "全部类型" }],
  ...useFormatMap.terminalsOptions,
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
  ...[{ value: 0, label: "全部类型" }],
  ...useFormatMap.taskTypeOptions,
];
// const taskOperationOptions = [
//   { value: -1, label: "全部状态" },
//   { value: 0, label: "发起广播" },
//   { value: 2, label: "结束广播" },
// ];
// 处理导出日志弹窗的响应展示/关闭
const handleLogDialogVisible = (value: boolean, src: any) => {
  form.logDialogVisible = value;
  const url = "http:/" + src;
  const index = src.lastIndexOf("/");
  const fileName = src.substring(index + 1, url.length);
  window.electronAPI.send("download", {
    downloadPath: url, // 下载链接
    fileName: fileName, // 下载文件名，需要包含后缀名
  });
};
// 处理点击tabs选项
const handleClick = (tab: TabsPaneContext) => {
  form.activeName = tab.props.name;
  //切换任务类型时恢复搜索初始条件
  form.selectLogType = 0;
  form.selectUserType = -1;
  form.selectPlatformType = "";
  form.search_ip_address = "";
  form.search_description = "";
  form.selectTerminalsType = 0;
  form.selectTerminalStatusType = -1;
  form.search_terminals = "";
  form.search_tasks_name = "";
  form.search_date_time = "";
  form.selectTaskOperationType = -1;
  form.search_launch_terminal = "";
  form.search_join_terminal = "";
  form.search_txt = "";
  form.search_execution_terminal = "";
};
// 处理刷新
const handleRefresh = (name: string) => {
  switch (name) {
    case "1":
      systemRef.value.handleGetOnePageData();
      break;
    case "2":
      terminalRef.value.handleGetOnePageData();
      break;
    case "3":
      taskRef.value.handleGetOnePageData();
      break;
    case "4":
      broadcastRef.value.handleGetOnePageData();
      break;
    case "5":
      intercomRef.value.handleGetOnePageData();
      break;
    case "6":
      TTSRef.value.handleGetOnePageData();
      break;
  }
};
// 处理批量删除
const handleDelete = (name: string) => {
  switch (name) {
    case "1":
      systemRef.value.handleDelete();
      break;
    case "2":
      terminalRef.value.handleDelete();
      break;
    case "3":
      taskRef.value.handleDelete();
      break;
    case "4":
      broadcastRef.value.handleDelete();
      break;
    case "5":
      intercomRef.value.handleDelete();
      break;
    case "6":
      TTSRef.value.handleDelete();
      break;
  }
};
// 处理重置
const handleRest = (name: string) => {
  switch (name) {
    case "1":
      form.searchDate = systemRef.value.search.searchDate = [];
      systemRef.value.handleReset();
      break;
    case "2":
      form.searchDate = terminalRef.value.search.searchDate = [];
      terminalRef.value.handleReset();
      break;
    case "3":
      form.searchDate = taskRef.value.search.searchDate = [];
      taskRef.value.handleReset();
      break;
    case "4":
      form.searchDate = broadcastRef.value.search.searchDate = [];
      broadcastRef.value.handleReset();
      break;
    case "5":
      form.searchDate = intercomRef.value.search.searchDate = [];
      intercomRef.value.handleReset();
      break;
    case "6":
      form.searchDate = TTSRef.value.search.searchDate = [];
      TTSRef.value.handleReset();
      break;
  }
};
// 处理搜索
const handleSearch = (name: string) => {
  switch (name) {
    case "1":
      systemRef.value.search.searchDate = form.searchDate;
      systemRef.value.handleDefaultGet();
      break;
    case "2":
      terminalRef.value.search.searchDate = form.searchDate;
      terminalRef.value.handleDefaultGet();
      break;
    case "3":
      taskRef.value.search.searchDate = form.searchDate;
      taskRef.value.handleDefaultGet();
      break;
    case "4":
      broadcastRef.value.search.searchDate = form.searchDate;
      broadcastRef.value.handleDefaultGet();
      break;
    case "5":
      intercomRef.value.search.searchDate = form.searchDate;
      intercomRef.value.handleDefaultGet();
      break;
    case "6":
      TTSRef.value.search.searchDate = form.searchDate;
      TTSRef.value.handleDefaultGet();
      break;
  }
};
// 处理高级搜索
const handleAdvancedSearch = (name: string) => {
  if (name == "1") {
    systemRef.value.search.search_level = form.selectLogType;
    systemRef.value.search.search_users_ids = form.selectUserType;
    systemRef.value.search.search_ip_address = form.search_ip_address;
    systemRef.value.search.search_description = form.search_description;
    systemRef.value.search.search_platform = form.selectPlatformType;
    systemRef.value.handleDefaultGet();
  }
  if (name == "2") {
    terminalRef.value.search.search_level = form.selectLogType;
    terminalRef.value.search.search_terminals_type = form.selectTerminalsType;
    terminalRef.value.search.status = form.selectTerminalStatusType;
    terminalRef.value.search.search_terminals = form.search_terminals;
    terminalRef.value.handleDefaultGet();
  }
  if (name == "3") {
    taskRef.value.search.search_level = form.selectLogType;
    taskRef.value.search.search_tasks_name = form.search_tasks_name;
    taskRef.value.search.search_users_ids = form.selectUserType;
    taskRef.value.search.search_life_time = form.search_date_time;
    taskRef.value.search.type = form.selectTaskType;
    taskRef.value.handleDefaultGet();
  }
  if (name == "4") {
    broadcastRef.value.search.search_level = form.selectLogType;
    broadcastRef.value.search.search_life_time = form.search_date_time;
    broadcastRef.value.search.status = form.selectTaskOperationType;
    broadcastRef.value.search.search_launch_terminal = form.search_launch_terminal;
    broadcastRef.value.search.search_join_terminal = form.search_join_terminal;
    broadcastRef.value.handleDefaultGet();
  }
  if (name == "5") {
    intercomRef.value.search.search_level = form.selectLogType;
    intercomRef.value.search.search_life_time = form.search_date_time;
    intercomRef.value.search.status = form.selectTaskOperationType;
    intercomRef.value.search.search_launch_terminal = form.search_launch_terminal;
    intercomRef.value.search.search_join_terminal = form.search_join_terminal;
    intercomRef.value.handleDefaultGet();
  }
  if (name == "6") {
    TTSRef.value.search.search_level = form.selectLogType;
    TTSRef.value.search.context = form.search_txt;
    TTSRef.value.search.terminals = form.search_execution_terminal;
    TTSRef.value.search.search_users_ids = form.selectUserType;
    TTSRef.value.handleDefaultGet();
  }
};
// 处理高级重置
const handleAdvancedReset = (name: string) => {
  if (name == "1") {
    form.selectUserType = systemRef.value.search.search_users_ids = -1;
    form.selectLogType = systemRef.value.search.search_level = 0;
    form.selectPlatformType = form.search_ip_address = form.search_description = systemRef.value.search.search_platform = systemRef.value.search.search_ip_address = systemRef.value.search.search_description =
      "";
    systemRef.value.handleReset();
  }
  if (name == "2") {
    form.selectLogType = form.selectTerminalsType = terminalRef.value.search.search_level = terminalRef.value.search.search_terminals_type = 0;
    form.selectTerminalStatusType = terminalRef.value.search.search_terminals_type = -1;
    form.search_terminals = terminalRef.value.search.search_terminals = "";
    terminalRef.value.handleDefaultGet();
  }
  if (name == "3") {
    form.selectLogType = form.selectTaskType = taskRef.value.search.search_level = taskRef.value.search.type = 0;
    form.selectUserType = taskRef.value.search.search_users_ids = -1;
    form.search_tasks_name = form.search_date_time = taskRef.value.search.search_tasks_name = taskRef.value.search.search_life_time =
      "";
    taskRef.value.handleDefaultGet();
  }
  if (name == "4") {
    form.selectLogType = broadcastRef.value.search.search_level = 0;
    form.selectTaskOperationType = broadcastRef.value.search.status = -1;
    form.search_launch_terminal = form.search_date_time = form.search_join_terminal = broadcastRef.value.search.search_life_time = broadcastRef.value.search.search_join_terminal = broadcastRef.value.search.search_launch_terminal =
      "";
    broadcastRef.value.handleDefaultGet();
  }
  if (name == "5") {
    form.selectLogType = intercomRef.value.search.search_level = 0;
    form.selectTaskOperationType = intercomRef.value.search.status = -1;
    form.search_launch_terminal = form.search_date_time = form.search_join_terminal = intercomRef.value.search.search_life_time = intercomRef.value.search.search_join_terminal = intercomRef.value.search.search_launch_terminal =
      "";
    intercomRef.value.handleDefaultGet();
  }
  if (name == "6") {
    form.selectLogType = TTSRef.value.search.search_level = 0;
    form.selectUserType = form.search_execution_terminal = -1;
    form.search_txt = form.search_execution_terminal = "";
    TTSRef.value.handleDefaultGet();
  }
};
// 处理级别选择器改变时请求数据
const handleLevelChange = (name: string) => {
  switch (name) {
    case "1":
      systemRef.value.search.search_level = form.selectLogType;
      systemRef.value.handleDefaultGet();
      break;
    case "2":
      terminalRef.value.search.search_level = form.selectLogType;
      terminalRef.value.handleDefaultGet();
      break;
    case "3":
      taskRef.value.search.search_level = form.selectLogType;
      taskRef.value.handleDefaultGet();
      break;
    case "4":
      broadcastRef.value.search.search_level = form.selectLogType;
      broadcastRef.value.handleDefaultGet();
      break;
    case "5":
      intercomRef.value.search.search_level = form.selectLogType;
      intercomRef.value.handleDefaultGet();
      break;
    case "6":
      TTSRef.value.search.search_level = form.selectLogType;
      TTSRef.value.handleDefaultGet();
      break;
  }
};
// 处理终端类型选择器改变时
const handleTerminalsChange = () => {
  terminalRef.value.search.search_terminals_type = form.selectTerminalsType;
  terminalRef.value.handleDefaultGet();
};
// 处理终端状态选择器改变时
const handleTerminalStatusChange = () => {
  terminalRef.value.search.status = form.selectTerminalStatusType;
  terminalRef.value.handleDefaultGet();
};
// 处理平台选择器改变时
const handlePlatformChange = () => {
  systemRef.value.search.search_platform = form.selectPlatformType;
  systemRef.value.handleDefaultGet();
};
// 处理任务类型选择器改变时
const handleTaskTypeChange = () => {
  taskRef.value.search.type = form.selectTaskType;
  taskRef.value.handleDefaultGet();
};
// 处理广播/对讲状态选择器
// const handleStatusChange = (name: string) => {
//   if (name == "4") {
//     broadcastRef.value.search.status = form.selectTaskOperationType;
//     broadcastRef.value.handleDefaultGet();
//   }
//   if (name == "5") {
//     intercomRef.value.search.status = form.selectTaskOperationType;
//     intercomRef.value.handleDefaultGet();
//   }
// };
// 处理用户选择器改变时
const handleUserChange = (name: string) => {
  if (name == "1") {
    systemRef.value.search.search_users_ids = form.selectUserType;
    systemRef.value.handleDefaultGet();
  }
  if (name == "3") {
    taskRef.value.search.search_users_ids = form.selectUserType;
    taskRef.value.handleDefaultGet();
  }
  if (name == "6") {
    TTSRef.value.search.search_users_ids = form.selectUserType;
    TTSRef.value.handleDefaultGet();
  }
};
// 清空日志
const clearAllLog = (name: string) => {
  let dataLength = 0;
  let id = "";
  let path = "";
  switch (name) {
    case "1":
      path = "/logs/system/";
      dataLength = systemRef.value.search.data.length;
      id = "first";
      break;
    case "2":
      path = "/logs/terminals/";
      dataLength = terminalRef.value.search.data.length;
      id = "second";
      break;
    case "3":
      path = "/logs/tasks/";
      dataLength = taskRef.value.search.data.length;
      id = "third";
      break;
    case "4":
      path = "/logs/call/";
      dataLength = broadcastRef.value.search.data.length;
      id = "fourth";
      break;
    case "5":
      path = "/logs/talk-back/";
      dataLength = intercomRef.value?.search.data.length;
      id = "five";
      break;
    case "6":
      path = "/logs/tts/";
      dataLength = TTSRef.value.search.data.length;
      id = "six";
      break;
  }
  if (dataLength < 1) {
    return ElMessage({
      type: "warning",
      message: "暂无数据",
      grouping: true,
    });
  }
  ElMessageBox.confirm("即将删除当前选择模块的所有日志数据，是否继续？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  }).then(() => {
    $http
      .delete(path + id, {
        params: {
          id: id,
          start_date: "2000-01-01 00:00:00",
          end_date: "2037-12-31 23:59:59",
        },
      })
      .then((result: any) => {
        if (result.result > 0) {
          ElMessage({
            type: "success",
            message: "清除日志成功",
            grouping: true,
          });
          handleRefresh(form.activeName);
        } else {
          ElMessage({
            type: "error",
            message: "清除失败",
            grouping: true,
          });
        }
      });
  });
};
// 处理高级搜索/重置按钮禁止状态
const handleSeatchButton = (name: string) => {
  let disable;
  switch (name) {
    case "1":
      if (
        form.selectLogType == 0 &&
        form.selectUserType == -1 &&
        form.selectPlatformType == "" &&
        form.search_ip_address == "" &&
        form.search_description == ""
      ) {
        disable = true;
      }
      break;
    case "2":
      if (
        form.selectLogType == 0 &&
        form.selectTerminalsType == 0 &&
        form.selectTerminalStatusType == -1 &&
        form.search_terminals == ""
      ) {
        disable = true;
      }
      break;
    case "3":
      if (
        form.selectLogType == 0 &&
        form.selectUserType == -1 &&
        form.selectTaskType == 0 &&
        form.search_tasks_name == "" &&
        form.search_date_time == ""
      ) {
        disable = true;
      }
      break;
    case "4":
      if (
        form.selectLogType == 0 &&
        form.selectTaskOperationType == -1 &&
        form.search_launch_terminal == "" &&
        form.search_join_terminal == "" &&
        form.search_date_time == ""
      ) {
        disable = true;
      }
      break;
    case "5":
      if (
        form.selectLogType == 0 &&
        form.selectTaskOperationType == -1 &&
        form.search_launch_terminal == "" &&
        form.search_join_terminal == "" &&
        form.search_date_time == ""
      ) {
        disable = true;
      }
      break;
    case "6":
      if (
        form.selectLogType == 0 &&
        form.selectUserType == -1 &&
        form.search_txt == "" &&
        form.search_execution_terminal == ""
      ) {
        disable = true;
      }
      break;
  }
  return disable;
};
// 处理获取全部用户数据
const handleAllUsersData = async () => {
  form.loading = true;
  await UsersService.getAllUsers({})
    .then((result) => {
      if (result.data) {
        form.userOptions = [...[{ id: -1, name: "全部用户" }], ...result.data];
      } else {
        ElMessage({
          type: "error",
          message: result.data?.message,
          grouping: true,
        });
      }
      form.loading = false;
    })
    .catch((error) => {
      form.loading = false;
      console.log(error);
    });
};
// 处理接受子组件回传数据
const dele = (val: []) => {
  form.multipleSelection = val;
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleAllUsersData();
});
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
