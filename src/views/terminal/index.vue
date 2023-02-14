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
          <i class="iconfont icon-set-up" @click="setUp"></i>
          <div class="play-table-title">
            <span
              :class="{ theme: $useRoute.name != 'group' }"
              @click="changeRouter('终端')"
            >
              全部终端
            </span>
            <span class="line"> | </span>
            <span
              :class="{ theme: $useRoute.name == 'group' }"
              @click="changeRouter('分组')"
            >
              分组
            </span>
          </div>
          <el-select
            v-show="$useRoute.name != 'group'"
            v-model="form.terminal_status"
            style="margin-left: 10px"
            @change="handleFilter()"
          >
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
            clearable
          />
          <el-button :icon="Search" @click="handleFilter"></el-button>
          <el-button
            :disabled="form.search == '' && form.terminal_status == -1"
            @click="handleReset"
          >
            重置
          </el-button>
        </div>
        <div class="com-button">
          <span class="monitor-speaker">主讲终端</span>
          <select-monitoring-speaker />
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg">
      <router-view />
    </div>
    <div class="com-footer">
      <div class="footer-button" v-if="$useRoute.name != 'terminal'">
        <el-checkbox
          v-model="checked_all"
          label="全选"
          @change="handleCheckedAll"
          v-if="$useRoute.name != 'terminal_list'"
        />
        <el-button
          type="primary"
          color="#4900EE"
          :loading="startButton.status && startButton.type === 1"
          @click="functronButtonTask(1)"
        >
          {{
            judgeButtonStatus(5) && sessionsData[0]?.TaskName.indexOf("全区广播") !== -1
              ? "结束广播"
              : "全区广播"
          }}
        </el-button>
        <el-button
          type="primary"
          color="#467CF7"
          @click="functronButtonTask(5)"
          :loading="startButton.status && startButton.type === 5"
        >
          {{
            judgeButtonStatus(5) && sessionsData[0]?.TaskName.indexOf("全区广播") === -1
              ? "结束广播"
              : "广播"
          }}
        </el-button>
        <el-button
          type="primary"
          color="#00A1CC"
          v-if="$useRoute.name != 'group'"
          @click="functronButtonTask(4)"
          :loading="startButton.status && startButton.type === 4"
        >
          {{ judgeButtonStatus(4) ? "结束对讲" : "对讲" }}
        </el-button>
        <el-button
          type="primary"
          color="#06BA7D"
          v-if="$useRoute.name != 'group'"
          @click="functronButtonTask(17)"
          :loading="startButton.status && startButton.type === 19"
        >
          {{ judgeButtonStatus(19) ? "结束监听" : "监听" }}
        </el-button>
        <el-button
          v-if="system_configs.EnabledAlarm"
          type="danger"
          color="#D34500"
          @click="alarmTalkTask"
          :loading="startButton.status && startButton.type === 3"
        >
          {{ judgeButtonStatus(3) ? "结束报警" : "报警" }}
        </el-button>
      </div>
      <div class="footer-volume">
        <i
          class="iconfont theme"
          :class="{
            'icon-mute': form.volume == 0,
            'icon-volume-level-1': form.volume > 0 && form.volume < 31,
            'icon-volume-level-2': form.volume > 30 && form.volume < 61,
            'icon-volume-level-3': form.volume > 60 && form.volume < 101,
          }"
        ></i>
        <el-slider v-model="form.volume" />
        <span>{{ form.volume }}</span>
      </div>
    </div>
    <el-dialog v-model="set_dialog" title="终端状态配置" width="450px" class="set-dialog">
      <!-- template -->
      <div class="terminal-config-items">
        <el-radio-group v-model="form.view_value" class="view-config">
          <el-radio label="list" size="large">列表视图</el-radio>
          <el-radio label="square" size="large">方块视图</el-radio>
        </el-radio-group>
        <span class="view-number-config">
          <span>每屏终端数量</span>
          <el-select
            v-model="form.select_terminal"
            :disabled="form.view_value === 'list'"
          >
            <el-option
              v-for="item in terminal_view_options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmTerminalSet"> 确认 </el-button>
          <el-button @click="set_dialog = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { send } from "@/utils/socket";
// defineAsyncComponent 异步组件-懒加载子组件
const selectMonitoringSpeaker = defineAsyncComponent(
  () => import("../session/components/select_monitoring_speaker.vue")
);
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
const storeTerminal = getStore.useTerminalStore();
const session = getStore.useSessionStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const basic_configs = computed(() => {
  return systemStore.basic_configs;
});
const priorityData = computed(() => {
  return systemStore.priorityData;
});
const terminal_data = computed(() => {
  return storeTerminal.terminal_data;
});
const sessionsLocalKey = computed(() => {
  //当前客户端发起任务
  return session.sessionsLocalKey;
});
const sessionsData: any = computed(() => {
  return session.allSession.filter((item: any) => {
    if ([4, 5].includes(item.TaskType) && sessionsLocalKey.value.includes(item.TaskID)) {
      return item;
    }
    if (
      item.TaskType === 3 &&
      item.SubTaskTypeName === "manual_alarm" &&
      item.RemoteTaskID === system_configs.value.AlarmID
    ) {
      return item;
    }
  });
});
const system_configs = computed(() => {
  return systemStore.system_configs;
});

const form = reactive<any>({
  terminal_status: -1, // 终端状态
  search: "", // 搜索
  search_placeholder: "", // 搜索 placeholder
  speaker_terminal: "", // 主讲终端
  speakerTerminalOptions: [],
  terminalStatusOptions: [
    { value: -1, label: "全部状态" },
    { value: 1, label: "空闲" },
    { value: 2, label: "忙碌" },
    { value: 3, label: "冻结" },
    { value: 4, label: "故障" },
    { value: 0, label: "离线" },
  ],
  volume: 0, // 音量
  view_value: "list",
  select_terminal: "3x6",
});

const startButton = ref({
  type: 0,
  status: false,
});

const terminal_view_options = [
  {
    value: "4x6",
  },
  {
    value: "3x6",
  },
  {
    value: "3x5",
  },
];

const taskPlayMode = new Map([
  [0, "normal_play"],
  [1, "loop_play"],
  [2, "random_play"],
]);

const terminal_group_data: any = ref([]);
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();
const set_dialog = ref(false);
const select_terminal = ref("3x6");
// 全选
const checked_all = ref(false);

// 是否点击了全选按钮-给子组件做判断处理事件
const is_checked_all = ref(false);

// 处理全选
const handleCheckedAll = (value: any) => {
  is_checked_all.value = true;
};

// 处理是否全选
const handleIsCheckedAll = (value: boolean) => {
  is_checked_all.value = value;
};

// 处理更新全选
const handleUpdateCheckedAll = (value: boolean) => {
  checked_all.value = value;
};

//定义已勾选的终端数据
const checked_terminals: any = ref([]);

// 更新已勾选终端数据
const updateCheckedTerminals = (data: any) => {
  checked_terminals.value = data;
};

const setUp = () => {
  set_dialog.value = true;
};

// 终端 <-> 分组切换
const changeRouter = (name: string) => {
  if (name === "分组") {
    $useRouter.push("/terminal/group");
    form.search_placeholder = "分组名称";
    storeTerminal.changeFilterStatus(false);
  } else {
    $useRouter.push("/terminal/terminal_list");
    form.search_placeholder = "终端名称";
    storeTerminal.changeFilterStatus(true);
  }
};

// 切换终端状态或者点击搜索
const handleFilter = () => {
  let conditions = {
    status: form.terminal_status,
    search: form.search,
  };
  storeTerminal.updateFiltrateCondition(conditions);
};
const handleReset = () => {
  form.search = "";
  form.terminal_status = -1;
  handleFilter();
};

// 过滤出在线终端
const cleanOnLineTerminal = () => {
  form.speakerTerminalOptions = terminal_data.value.filter((item: { status: number }) => {
    return item.status === 1 || item.status === 2;
  });
};

// 确认终端视图模式
const confirmTerminalSet = () => {
  proxy.$http1
    .put("/config/" + basic_configs.value.ID, {
      DisplayType: form.view_value === "list" ? 1 : 0,
      ListDisplaySize:
        form.select_terminal === "3x5" ? 0 : form.select_terminal === "3x6" ? 1 : 2,
    })
    .then((result: any) => {
      if (result.result === 200) {
        select_terminal.value = form.select_terminal;
        let data = {
          DisplayType: form.view_value === "list" ? 1 : 0,
          ListDisplaySize:
            form.select_terminal === "3x5" ? 0 : form.select_terminal === "3x6" ? 1 : 2,
        };
        systemStore.updateTerminalStatusConfig(data);
        if (form.view_value === "list") {
          getTerminalGroupAll();
        } else {
          $useRouter.push({
            path: "/terminal/terminal_block",
            query: {
              layoutArrange: select_terminal.value,
            },
          });
        }
        set_dialog.value = false;
        storeTerminal.changeFilterStatus(true);
      }
    });
};

// 已勾选终端筛选出在线终端数据
const filterCheckedTerminals = () => {
  let checked_online_terminals = form.speakerTerminalOptions
    .filter((item: { EndPointID: any; Status: number }) => {
      return checked_terminals.value.includes(item.EndPointID) && item.Status !== 0;
    })
    .map((two: { EndPointID: any }) => {
      return two.EndPointID;
    });
  return checked_online_terminals;
};

// 功能按钮
const functronButtonTask = (type: number) => {
  startButton.value.type = type;
  startButton.value.status = true;
  let taskType = type === 1 ? 5 : type;
  if (judgeButtonStatus(taskType)) {
    //存在任务且点击是当前任务按钮，结束任务
    let data = {
      company: "BL",
      actioncode: "c2ms_stop_task",
      token: "",
      data: {
        TaskID: sessionsData.value[0].TaskID,
      },
      result: 0,
      return_message: "",
    };
    send(data);
    return;
  }
  // 存在任务时
  if (sessionsData.value.length > 0) {
    startButton.value.status = false;
    return proxy.$message.warning("主讲终端忙碌中");
  }
  const currentTableRow = JSON.parse(localStorage.get("monitoringSpeaker")) || "";
  if (!currentTableRow) {
    startButton.value.status = false;
    return proxy.$message.error("未选择主讲终端或主讲终端未在线");
  }
  if (type === 1) {
    regionalBroadcasting(currentTableRow);
    return;
  }
  let filter_initiator_terminals = filterCheckedTerminals().filter((item: number) => {
    return item !== currentTableRow.EndPointID;
  });
  if (checked_terminals.value.length === 0) {
    startButton.value.status = false;
    return proxy.$message.error("请选择终端");
  }
  if (filter_initiator_terminals.length === 0 && checked_terminals.value.length > 0) {
    startButton.value.status = false;
    return proxy.$message.error("选中终端中不存在可执行任务终端");
  }
  if (type === 5) {
    originateBroadcast(filter_initiator_terminals, currentTableRow.EndPointID);
  }
  if (type === 4) {
    startButton.value.status = false;
    if (filter_initiator_terminals.length > 1) {
      return proxy.$message.error("对讲接收终端只能选一个");
    }
    initiatedTalkTask(filter_initiator_terminals, currentTableRow.EndPointID);
  }
  if (type === 17) {
    monitorTalkTask(filter_initiator_terminals, currentTableRow.EndPointID);
  }
};
// 全区广播任务
const regionalBroadcasting = (currentTableRow: any) => {
  let data = terminal_data.value
    .filter((item: any) => {
      return item.Status !== 0 && item.EndPointID !== currentTableRow.EndPointID;
    })
    .map((item: { EndPointID: any }) => {
      return item.EndPointID;
    });
  if (data.length) {
    let send_data = {
      company: "BL",
      actioncode: "c2ms_create_server_task",
      data: {
        EndPointsAdditionalProp: {},
        EndPointList: data,
        TaskID: usePublicMethod.generateUUID(),
        TaskName: "客户端全区广播任务（" + localStorage.get("username") + "）",
        Priority: priorityData.value.get(5),
        Volume: form.volume,
        TaskType: 5,
        UserID: Number(localStorage.get("LoginUserID")),
        TaskProp: {
          TaskAudioType: 2,
          CollectID: currentTableRow.EndPointID,
          SelfCheck: 0,
        },
      },
      result: 0,
      return_message: "",
    };
    send(send_data);
  } else {
    proxy.$message.error("不存在可执行任务终端");
  }
};
// 发起广播任务
const originateBroadcast = (EndPointList: any[], EndPointID: number) => {
  let send_data = {
    company: "BL",
    actioncode: "c2ms_create_server_task",
    data: {
      EndPointsAdditionalProp: {},
      EndPointList: EndPointList,
      TaskID: usePublicMethod.generateUUID(),
      TaskName: "客户端广播任务（" + localStorage.get("username") + "）",
      Priority: priorityData.value.get(5),
      Volume: form.volume,
      TaskType: 5,
      UserID: Number(localStorage.get("LoginUserID")),
      TaskProp: {
        TaskAudioType: 2,
        CollectID: EndPointID,
        SelfCheck: 0,
      },
    },
    result: 0,
    return_message: "",
  };
  send(send_data);
};

// 发起对讲
const initiatedTalkTask = (EndPointList: any[], EndPointID: number) => {
  let send_data = {
    company: "BL",
    actioncode: "c2ms_create_server_task",
    data: {
      EndPointsAdditionalProp: {},
      EndPointList: EndPointList,
      TaskID: usePublicMethod.generateUUID(),
      TaskName: "客户端对讲任务（" + localStorage.get("username") + "）",
      Priority: priorityData.value.get(4),
      Volume: form.volume,
      TaskType: 4,
      UserID: Number(localStorage.get("LoginUserID")),
      TaskProp: {
        TaskAudioType: 2,
        CollectID: EndPointID,
        SelfCheck: 0,
      },
    },
    result: 0,
    return_message: "",
  };
  send(send_data);
};

// 发起监听任务
const monitorTalkTask = (EndPointList: any[], EndPointID: number) => {
  let send_data = {
    company: "BL",
    actioncode: "c2ms_create_server_task",
    data: {
      EndPointsAdditionalProp: {},
      EndPointList: EndPointList,
      TaskID: usePublicMethod.generateUUID(),
      TaskName: "客户端监听任务（" + localStorage.get("username") + "）",
      Priority: priorityData.value.get(17),
      Volume: form.volume,
      TaskType: 17,
      UserID: Number(localStorage.get("LoginUserID")),
      TaskProp: {
        TaskAudioType: 0,
        CollectID: EndPointID,
        SelfCheck: 0,
      },
    },
    result: 0,
    return_message: "",
  };
  send(send_data);
};

// 发起报警任务
const alarmTalkTask = () => {
  startButton.value.type = 3;
  startButton.value.status = true;
  if (judgeButtonStatus(3)) {
    //存在任务且点击是当前任务按钮，结束任务
    let data = {
      company: "BL",
      actioncode: "c2ms_stop_task",
      token: "",
      data: {
        TaskID: sessionsData.value[0].TaskID,
      },
      result: 0,
      return_message: "",
    };
    send(data);
    return;
  }
  proxy.$http
    .get("/details/" + system_configs.value.AlarmID, {
      params: {
        tag: "OneButtonAlarm",
        withMedias: true,
        withFastSound: true,
        withFastTerminal: true,
        withTerminal: true,
      },
    })
    .then((result: any) => {
      if (result.result === 200) {
        let row = result.data;
        let send_data = {
          company: "BL",
          actioncode: "c2ms_create_server_task",
          data: {
            EndPointsAdditionalProp: {},
            EndPointList: row.terminalsIds,
            TaskID: usePublicMethod.generateUUID(),
            TaskName: row.name,
            Priority: row.priority,
            Volume: row.volume,
            TaskType: 15,
            UserID: Number(localStorage.get("LoginUserID")),
            TaskProp: {
              TaskAudioType: 6,
              RemoteID: system_configs.value.AlarmID,
              RemoteType: "manual_alarm",
              RemoteAudioProp: {
                MusicIDs: row.mediasIds,
                LimitTime: row.sound_source.life_time
                  ? timeToSec(row.sound_source.life_time, 1)
                  : 0,
                PlayMode: taskPlayMode.get(row.sound_source.play_model),
                PlayTimes: row.sound_source.play_times
                  ? timeToSec(row.sound_source.play_times, 1)
                  : 0,
              },
            },
          },
          result: 0,
          return_message: "",
        };
        send(send_data);
      } else {
        startButton.value.status = false;
      }
    })
    .catch(() => {
      startButton.value.status = false;
    });
};

// 将时间转换为秒
const timeToSec = (time: any, num = 1) => {
  var hour = time.split(":")[0];
  var min = time.split(":")[1];
  var sec = time.split(":")[2];
  var s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s * num;
};
// 获取所有终端
const getTerminalAll = () => {
  return new Promise((resolve, reject) => {
    proxy.$http.get("/terminals/all").then((result: any) => {
      if (result.result === 200) {
        resolve(result.data);
      }
    });
  });
};
// 获取所有分组
const getTerminalGroupAll = () => {
  proxy.$http
    .get("/terminals-groups/all", {
      params: {
        withTerminals: true,
        withTerminalsNums: true,
      },
    })
    .then((result: any) => {
      if (result.result === 200) {
        terminal_group_data.value = result.data;
        terminal_group_data.value.unshift({
          id: 0,
          GroupID: 0,
          name: "所有终端",
          terminals: JSON.parse(JSON.stringify(terminal_data.value)),
        });
        $useRouter.push("/terminal/terminal_list");
      }
    });
};

const judgeButtonStatus = (type: number) => {
  let status = sessionsData.value.some((item: any) => {
    return (
      item.TaskType === type &&
      Number(localStorage.get("LoginUserID")) === item.TaskIniatorID
    );
  });
  if (sessionsData.value.length > 0 && status) {
    return true;
  }
  return false;
};

// 供给数据
provide("checkedAll", {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
  checked_terminals,
  updateCheckedTerminals,
});

// 传给方块视图页面
provide("select_terminal", {
  select_terminal,
});

// 终端分组数据
provide("terminal_group", {
  terminal_group_data,
});

watch(sessionsData, () => {
  startButton.value.status = false;
});
watch(
  () => terminal_data.value,
  () => {
    cleanOnLineTerminal();
  },
  {
    deep: true,
  }
);

watch(
  () => basic_configs.value,
  (newVal) => {
    form.select_terminal =
      basic_configs.value.ListDisplaySize === 0
        ? "3x5"
        : basic_configs.value.ListDisplaySize === 1
        ? "3x6"
        : "4x6";
    form.view_value = basic_configs.value.DisplayType === 1 ? "list" : "square";
  },
  {
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  form.search_placeholder = "终端名称";
  form.select_terminal =
    basic_configs.value.ListDisplaySize === 0
      ? "3x5"
      : basic_configs.value.ListDisplaySize === 1
      ? "3x6"
      : "4x6";
  form.view_value = basic_configs.value.DisplayType === 1 ? "list" : "square";
  if (form.view_value === "list") {
    getTerminalGroupAll();
  } else {
    $useRouter.push({
      path: "/terminal/terminal_block",
      query: {
        layoutArrange: select_terminal.value,
      },
    });
  }
});
</script>

<style lang="scss" scoped>
.monitor-speaker {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.com-head-content {
  .el-input,
  .el-select {
    width: 160px;
  }

  .icon-set-up {
    margin-left: 10px;
    margin-right: 20px;
    cursor: pointer;
  }

  .play-table-title {
    margin-left: 10px;
    margin-right: 14px;

    span {
      cursor: pointer;
    }

    .line {
      margin: 0 15px;
      color: $c-999;
      cursor: default;
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
    padding-right: 10px;

    .el-slider {
      width: 140px;
      margin-left: 20px;
      margin-right: 12px;
    }

    > span {
      display: inline-block;
      width: 26px;
      margin-left: 5px;
    }
  }
}

.set-dialog {
  .view-number-config {
    span {
      margin-right: 30px;
    }
  }
}

:deep(.set-dialog) {
  .el-dialog__header {
    height: 40px;
    padding: 10px 20px;
    margin: 0;
    background: #0070ee;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;

    .el-dialog__title {
      color: #ffffff;
      font-size: 14px;
    }

    .el-dialog__headerbtn {
      height: 40px;
      line-height: 40px;

      .el-dialog__close {
        color: #ffffff;
      }
    }
  }

  .el-dialog__body {
    padding: 21px 40px 14px;

    .el-radio-group {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: flex-start;

      .el-radio__inner {
        width: 16px;
        height: 16px;
        background: #ffffff;
        border: 1px solid #c1c1c1;
      }

      .el-radio__inner::after {
        width: 12px;
        height: 12px;
        background: #0070ee;
        // box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5000)
      }

      .el-radio__label {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #000000;
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 40px;
    text-align: center;
  }
}
</style>
