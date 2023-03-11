<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\play\index.vue
  @Describe: 播放中心
-->
<template>
  <div class="com-play-index">
    <list-musoc-component
      v-if="form.playlist_status"
      :selectTaskData="selectTaskData"
      :playCenterData="playCenterData"
    />
    <div class="play-center">
      <i
        class="iconfont theme"
        :class="form.fullscreen_satus ? 'icon-narrow' : 'icon-enlarge'"
        :title="form.fullscreen_satus ? $t('Reduce') : $t('Enlarge')"
        @click="handleFullscreenStatus"
      ></i>
      <div class="center-content">
        <div
          class="content-top"
          :class="
            playCenterData?.TaskID &&
            ((playCenterData?.TaskType === 15 &&
              playSubscriptionTask?.PlayStatus === 'play') ||
              playCenterData?.TaskType !== 15)
              ? 'playing'
              : ''
          "
        >
          <img class="record-arm" src="@/assets/images/record-arm.png" alt="" />
          <img
            class="record"
            src="@/assets/images/record.png"
            @dblclick="
              playCenterData?.TaskID
                ? handleTaskButton()
                  ? playSubscriptionTask?.PlayStatus === 'play'
                    ? handlePauseTask(playCenterData)
                    : handlePlayTask(playCenterData)
                  : handleStopTask(playCenterData)
                : handlePlayTask(playCenterData)
            "
          />
        </div>
        <div class="content-center">
          <p>
            {{
              playCenterData.TaskID !== playSubscriptionTask.TaskID
                ? playCenterData.name
                : playSubscriptionTask.MusicName
            }}
          </p>
          <div class="progress" v-if="handleTaskProgress() && playCenterData.TaskID">
            <el-slider
              v-model="form.current_duration"
              :max="form.total_duration"
              :format-tooltip="formatTooltip"
              @change="handleChangeSliderProgressBar(playCenterData, 'progress')"
              :show-tooltip="false"
              @click="form.isChangeProgressBar = false"
            />
            <span class="fl">{{ formatTooltip(form.current_duration) }}</span>
            <span class="fr">{{ formatTooltip(form.total_duration) }}</span>
          </div>
        </div>
        <div
          class="content-bottom theme"
          v-if="handleTaskButton() && playCenterData.TaskID"
        >
          <i
            class="iconfont"
            :class="form.playlist_status ? 'icon-shrink' : 'icon-order'"
            :title="$t('Audio list')"
            @click="form.playlist_status = !form.playlist_status"
            v-if="form.fullscreen_satus"
          ></i>
          <i
            class="iconfont"
            :class="playModeIcon.get(form.play_model)?.icon"
            :title="playModeIcon.get(form.play_model)?.title"
            @click="handleSwitchTask(playCenterData, 'play_mode')"
          >
          </i>
          <i
            class="iconfont icon-prev"
            :title="$t('Prev')"
            @click="handleSwitchTask(playCenterData, 'pre')"
          ></i>
          <i
            class="iconfont"
            :class="
              playCenterData.TaskID && playSubscriptionTask?.PlayStatus === 'play'
                ? 'icon-suspend'
                : 'icon-play'
            "
            :title="
              playCenterData.TaskID && playSubscriptionTask?.PlayStatus === 'play'
                ? $t('Suspend')
                : $t('Play')
            "
            @click="
              playCenterData.TaskID && playSubscriptionTask?.PlayStatus === 'play'
                ? handlePauseTask(playCenterData)
                : handlePlayTask(playCenterData)
            "
          >
          </i>
          <i
            class="iconfont icon-next"
            :title="$t('Next')"
            @click="handleSwitchTask(playCenterData, 'next')"
          ></i>
          <i
            class="iconfont icon-end"
            :title="$t('Stop')"
            @click="handleStopTask(playCenterData)"
          ></i>
          <el-popover trigger="click" popper-class="play-volume-popper">
            <template #reference>
              <i class="iconfont icon-volume2" :title="$t('Volume')"></i>
            </template>
            <span class="play-volume-number">{{ form.volume }}</span>
            <el-slider
              v-model="form.volume"
              vertical
              height="200px"
              @change="handleVolumeTask"
              :show-tooltip="false"
            >
            </el-slider>
          </el-popover>
        </div>
        <div class="content-bottom theme com-show-button" v-else>
          <i
            class="iconfont"
            :class="playCenterData.TaskID ? 'icon-end' : 'icon-play'"
            :title="playCenterData.TaskID ? $t('Suspend') : $t('Play')"
            @click="
              playCenterData.TaskID
                ? handleStopTask(playCenterData)
                : handlePlayTask(playCenterData)
            "
          >
          </i>
          <el-popover trigger="click" popper-class="play-volume-popper">
            <template #reference>
              <i class="iconfont icon-volume2" :title="$t('Volume')"></i>
            </template>
            <span class="play-volume-number">{{ form.volume }}</span>
            <el-slider
              v-model="form.volume"
              vertical
              height="200px"
              @change="handleVolumeTask"
              :show-tooltip="false"
            >
            </el-slider>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="play-right" v-if="!form.fullscreen_satus">
      <div class="right-top">
        <div class="com-index">
          <div class="com-head">
            <div class="com-head-content">
              <div class="com-breadcrumb">
                <div class="play-table-title theme">
                  <span>{{ $t("Task list") }}</span>
                </div>
                <el-input
                  v-model="form.search"
                  :placeholder="$t('Task name')"
                  :prefix-icon="Search"
                  @input="handleSearch"
                />
                <el-button
                  :disabled="form.search == ''"
                  @click="(form.search = ''), handleSearch()"
                  style="margin-left: 12px"
                >
                  {{ $t("Reset") }}
                </el-button>
              </div>
              <div class="com-button">
                <i class="iconfont icon-add" :title="$t('Add')" @click="addPlayTask"></i>
                <i
                  class="iconfont icon-delete"
                  :class="{ 'icon-disabled': multipleSelection.length == 0 }"
                  @click="handleDeleteAll"
                  :title="$t('Batch deletion')"
                ></i>
              </div>
            </div>
          </div>
          <div class="com-main">
            <div class="com-table">
              <el-table
                ref="multipleTableRef"
                :data="form.data"
                style="width: 100%"
                height="100%"
                highlight-current-row
                @selection-change="handleSelectionChange"
                @cell-click="handleSelectionClick"
                @row-dblclick="handleRowDblclick"
              >
                <el-table-column
                  prop="name"
                  :label="$t('Task')"
                  show-overflow-tooltip
                  min-width="280"
                >
                  <template #default="scope">
                    <span
                      class="icon iconfont"
                      :class="taskTypeMap.get(scope.row.type)"
                      style="color: #7ab1f0"
                    ></span>
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="priority" :label="$t('Priority')">
                  <template #default="scope">
                    <span class="red">
                      [{{ priorityData.get(typePriority.get(scope.row.type)) }}]
                    </span>
                    {{ scope.row.priority }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('Operation')" width="120">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      @click.stop="handleStopTask(scope.row)"
                      v-if="handleDecideStatus(scope.row)"
                    >
                      <template #icon>
                        <i class="iconfont icon-end" :title="$t('Stop')"></i>
                      </template>
                    </el-button>
                    <el-button
                      link
                      type="primary"
                      @click.stop="handlePlayTask(scope.row)"
                      v-else
                    >
                      <template #icon>
                        <i class="iconfont icon-play" :title="$t('Play')"></i>
                      </template>
                    </el-button>
                    <el-button link type="danger" @click.stop="handleEditTask(scope.row)">
                      <template #icon>
                        <i class="iconfont icon-edit" :title="$t('Edit')"></i>
                      </template>
                    </el-button>
                    <el-button
                      link
                      type="primary"
                      @click.stop="handleDeleteTask(scope.row)"
                    >
                      <template #icon>
                        <i class="iconfont icon-delete" :title="$t('Delete')"></i>
                      </template>
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column type="selection" width="44" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="right-bottom">
        <task-details-config
          :selectTaskData="selectTaskData"
          :playCenterData="playCenterData"
        >
        </task-details-config>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { send } from "@/utils/socket";
import { ElTable, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

// defineAsyncComponent 异步组件-懒加载子组件
const taskDetailsConfig = defineAsyncComponent(
  () => import("./add-edit-component/task-details-config.vue")
);
const listMusocComponent = defineAsyncComponent(
  () => import("./components/list-musoc-component.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const session = getStore.useSessionStore();
const storePlay = getStore.usePlayStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const sessionStoreAll = computed(() => {
  return session.allSessionObj;
});
// 当前任务播放状态
const playStatusData: any = computed(() => {
  return storePlay.playStatusData;
});
// 订阅模式数据
const playSubscriptionTask: any = computed(() => {
  return storePlay.playSubscriptionTask;
});
// 获取当前显示任务的执行数据
const playCenterShowData = computed(() => {
  return form.sessionsData.filter((item: any) => {
    if (selectTaskData.value?.type < 10) {
      return item.RemoteTaskID === selectTaskData.value.id;
    }
    if (selectTaskData.value?.type >= 10) {
      return item.TaskID === selectTaskData.value.taskid;
    }
  })[0];
});
// 播放器任务详情
const playCenterData = computed(() => {
  if (playCenterShowData.value) {
    return { ...selectTaskData.value, ...playCenterShowData.value };
  } else {
    return selectTaskData.value;
  }
});

interface User {
  date: string;
  name: string;
  address: string;
}

const form = reactive<any>({
  percentage: 50, // 进度
  song_name: "", // 歌曲名称
  total_duration: 0, // 总时长
  current_duration: 0, // 当前时长
  play_status: false, // 播放状态
  play_model: 0, //播放模式
  fullscreen_satus: false, // 全屏状态
  playlist_status: false, // 播放列表状态
  play_list_data: [], // 播放列表数据
  search: "", // 任务搜索
  data: [], // 任务数据
  currentPage: 1,
  pageSize: 20,
  total: 0,
  volume: 0,
  sessionsData: [], // 任务数据
  isChangeProgressBar: true, // 是否正在改变播放进度条
});

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const priorityData = new Map();
const tableDataAll: any = ref([]);
const selectTaskData: any = ref({}); //选中的任务数据(http)
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();
const handleFullscreenStatus = () => {
  form.fullscreen_satus = !form.fullscreen_satus;
  form.playlist_status = false;
};
const taskTypeMap = new Map([
  [1, "icon-remote-playback"],
  [4, "icon-view-collection-terminal"],
  [11, "icon-text"],
  [13, "icon-terminals"],
  [12, "icon-terminals"],
  [10, "icon-music-playback"],
]);
const taskPlayMode = new Map([
  [0, "normal_play"],
  [1, "loop_play"],
  [2, "random_play"],
]);
const playModeNum = new Map([
  ["normal_play", 0],
  ["loop_play", 1],
  ["random_play", 2],
]);
const playModeIcon = new Map([
  [
    0,
    {
      icon: "icon-list-play",
      title: proxy.$t("List play"),
      model: "normal_play",
    },
  ],
  [
    1,
    {
      icon: "icon-loop-play",
      title: proxy.$t("Loop play"),
      model: "loop_play",
    },
  ],
  [
    2,
    {
      icon: "icon-random",
      title: proxy.$t("Shuffle play"),
      model: "random_play",
    },
  ],
]);
// 将任务类型转换为对应优先级类型
const typePriority = new Map([
  [1, 15], //远程任务
  [2, 13], //快捷音源-声卡采集
  [3, 14], ////快捷音源-终端采集
  [4, 15], //远程任务
  [10, 15], //音乐播放
  [11, 12], //文本播放
  [12, 13], //声卡采集
  [13, 14], //终端采集
]);

// 判断是否显示进度条
const handleTaskProgress = () => {
  if (selectTaskData.value.type === 1 || selectTaskData.value.type === 10) {
    return true;
  }
  if (
    selectTaskData.value.type === 4 &&
    selectTaskData.value.fast_sound &&
    selectTaskData.value.fast_sound.type === 1
  ) {
    return true;
  }
  return false;
};
// 判断是否显示按钮
const handleTaskButton = () => {
  if (selectTaskData.value.type === 1) {
    return true;
  }
  if (
    selectTaskData.value.type === 4 &&
    selectTaskData.value.fast_sound &&
    selectTaskData.value.fast_sound.type === 1
  ) {
    return true;
  }
  if (selectTaskData.value.type === 10) {
    return true;
  }
  return false;
};
// 添加播放任务
const addPlayTask = () => {
  $useRouter.push("/play-task/" + 0);
};
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 批量删除任务
const handleDeleteAll = () => {
  if (multipleSelection.value.length === 0) return;
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
  }).then(() => {
    let serverDataID: any[] = [];
    let LocalDataID: any[] = [];
    multipleSelection.value.forEach((item: any) => {
      if (item.type < 10) {
        serverDataID.push(item.id);
      } else {
        LocalDataID.push(item.id);
      }
    });
    Promise.all([handelDelServeRask(serverDataID), handelDelLocalRask(LocalDataID)]).then(
      () => {
        getTaskAll();
      }
    );
  });
};
// 获取选中任务详情信息
const handleSelectionClick = (row: any) => {
  if (selectTaskData.value === row) return;
  if (row.type < 10) {
    selectTaskData.value = row;
  } else {
    getLocalTask(row).then((result: any) => {
      selectTaskData.value = result.data;
    });
  }
};
// 获取本地任务
const getLocalTask = (row: any) => {
  return new Promise((resolve, reject) => {
    proxy.$http1.get("/task/" + row.id).then((result: any) => {
      if (result.result === 200) {
        resolve(result);
      }
    });
  });
};
// 任务被双击
const handleRowDblclick = (row: any) => {
  if (handleDecideStatus(row)) {
    handleStopTask(row);
  } else {
    handlePlayTask(row);
  }
};
// 判断任务是否执行中
const handleDecideStatus = (row: any) => {
  if (row.type < 10) {
    return form.sessionsData.some((item: any) => {
      return item.RemoteTaskID === row.id && item.SubTaskTypeName == "remote_play";
    });
  }
  if (row.type >= 10) {
    return form.sessionsData.some((item: any) => {
      return item.TaskID === row.taskid;
    });
  }
};
// 停止任务
const handleStopTask = (row: any) => {
  let key;
  form.sessionsData.some((item: any) => {
    if (item.RemoteTaskID === row.id) {
      key = item.TaskID;
      return true;
    }
    if (item.TaskID === row.taskid) {
      key = item.TaskID;
      return true;
    }
  });
  let data = {
    company: "BL",
    actioncode: "c2ms_stop_task",
    token: "",
    data: {
      TaskID: key,
    },
    result: 0,
    return_message: "",
  };
  send(data);
};
// 暂停任务
const handlePauseTask = (row: any) => {
  if (row.TaskID) {
    let data = {
      company: "BL",
      actioncode: "c2ms_control_task",
      token: "",
      data: {
        TaskID: row.TaskID,
        ControlCode: "pause",
        ControlValue: "",
      },
      result: 0,
      return_message: "",
    };
    send(data);
  }
};
// 播放任务
const handlePlayTask = (row: any) => {
  if (row.TaskID) {
    let data = {
      company: "BL",
      actioncode: "c2ms_control_task",
      token: "",
      data: {
        TaskID: row.TaskID,
        ControlCode: "resume", //resume
        ControlValue: "",
      },
      result: 0,
      return_message: "",
    };
    send(data);
    return;
  }
  if (row.type < 10) {
    proxy.$http
      .get("/details/" + row.id, {
        params: {
          tag: "BroadcastingStudio",
          withMedias: true,
          withFastSound: true,
          withFastTerminal: true,
          withTerminal: true,
        },
      })
      .then((result: any) => {
        let row = result.data;
        let TaskProp = handleTaskAttribute(row);
        if (row.terminalsIds.length === 0)
          return proxy.$message.warning(proxy.$t("No play terminal"));
        if (TaskProp?.TaskAudioType) {
          let TaskID = usePublicMethod.generateUUID();
          let TaskType = handleTaskTypeMap(row);
          let data = {
            company: "BL",
            actioncode: "c2ms_create_server_task",
            data: {
              EndPointsAdditionalProp: {},
              EndPointList: row.terminalsIds, //终端ID合集
              TaskID: TaskID, //UUID
              TaskName: row.name, //任务名称
              Priority: row.priority, //优先级
              Volume: row.volume, //音量
              TaskType: TaskType, //任务类型
              UserID: localStorage.get("LoginUserID"), // 操作用户id
              TaskProp: TaskProp,
            },
          };
          if (TaskType === 15) {
            storePlay.changePlayTaskStaging({
              key: "add",
              value: TaskID,
            });
          }
          send(data);
        }
      });
  } else {
    let data = {
      company: "BL",
      actioncode: "c2ms_create_local_task",
      data: {
        TaskID: row.taskid,
        FirstIndex: row.type === 10 && row.content.length > 0 ? row.content[0].taskid : 0,
      },
      result: 0,
      return_message: "",
    };
    if (row.type === 11) {
      storePlay.changePlayTaskStaging({
        key: "add",
        value: row.taskid,
      });
    }
    send(data);
  }
};
// 切换任务状态
const handleSwitchTask = (row: any, type: string) => {
  if (row.TaskID) {
    let data = {
      company: "BL",
      actioncode: "c2ms_control_task",
      token: "",
      data: {
        TaskID: row.TaskID,
        ControlCode: type,
        ControlValue: handleControlValuev(type),
      },
      result: 0,
      return_message: "",
    };
    send(data);
  }
};
// 处理改变播放进度条
const handleChangeSliderProgressBar = (row: any, type: string) => {
  console.log(form.isChangeProgressBar);
  handleSwitchTask(row, type),
    setTimeout(() => {
      form.isChangeProgressBar = true;
    }, 1000);
};
const handleControlValuev = (type: string) => {
  if (type === "progress") {
    return form.current_duration.toString();
  }
  if (type === "play_mode") {
    let model = 0;
    form.play_model === 2 ? (model = 0) : (model = form.play_model + 1);
    return taskPlayMode.get(model);
  }
  return "";
};
// 音量调节
const handleVolumeTask = (volume: any) => {
  if (playCenterData.value?.TaskID) {
    let data = {
      company: "BL",
      actioncode: "c2ms_set_task_volume",
      data: {
        TaskID: playCenterData.value.TaskID,
        Volume: volume,
      },
      result: 0,
      return_message: "",
    };
    send(data);
  }
};
// 订阅任务
const subscribeTask = (row: any) => {
  let data = {
    company: "BL",
    actioncode: "c2ms_subscribe_task_progress_bar",
    token: "",
    data: {
      TaskID: row.TaskID,
    },
    result: 0,
    return_message: "",
  };
  send(data);
};
// 取消任务订阅
const unsubscribeTask = (row: any) => {
  let data = {
    company: "BL",
    actioncode: "c2ms_unsubscribe_task_progress_bar",
    token: "",
    data: {
      TaskID: row.TaskID,
    },
    result: 0,
    return_message: "",
  };
  send(data);
};
// 任务类型
const handleTaskTypeMap = (row: any) => {
  if ((row.type === 4 && row.sound_source.type === 1) || row.type === 1) {
    //快捷音源-媒体音乐 && 远程任务（媒体音乐播放）
    return 15;
  }
  if (row.type === 4 && row.sound_source.type === 2) {
    //快捷音源-声卡采集 &&
    return 13;
  }
  if (row.type === 4 && row.sound_source.type === 3) {
    //快捷音源-终端采集 &&
    return 14;
  }
  if (row.type === 10) {
    return 0;
  }
  // return type
};
// 任务属性
const handleTaskAttribute = (row: any) => {
  let data = null;
  if (row.type === 1) {
    //远程任务-音乐播放
    if (row.mediasIds.length === 0)
      return proxy.$message.warning(proxy.$t('"No sound source"'));
    data = {
      TaskAudioType: 6,
      RemoteID: row.id,
      RemoteType: "remote_play",
      RemoteAudioProp: {
        MusicIDs: row.mediasIds,
        LimitTime: row.sound_source.life_time
          ? usePublicMethod.timeToSec(row.sound_source.life_time, 1)
          : 0,
        PlayMode: taskPlayMode.get(row.sound_source.play_model),
        PlayTimes: row.sound_source?.play_number || 0,
      },
    };
  }
  if (row.type === 4) {
    //快捷音源
    if (row.sound_source.type === 1) {
      if (row.mediasIds.length === 0)
        return proxy.$message.warning(proxy.$t('"No sound source"'));
      //音乐播放
      data = {
        TaskAudioType: 6,
        RemoteID: row.id,
        RemoteType: "remote_play",
        RemoteAudioProp: {
          TaskAudioType: 1,
          MusicIDs: row.mediasIds,
          LimitTime: row.sound_source.life_time
            ? usePublicMethod.timeToSec(row.sound_source.life_time, 1)
            : 0,
          PlayMode: taskPlayMode.get(row.sound_source.play_model),
          PlayTimes: row.sound_source?.play_number || 0,
        },
      };
    }
    if (row.sound_source.type === 2) {
      //声卡采集
      if (row.fast_sound.fast_source.sound_card) {
        data = {
          TaskAudioType: 6,
          RemoteID: row.id,
          RemoteType: "remote_play",
          RemoteAudioProp: {
            TaskAudioType: 3,
            AudioCard: row.fast_sound.fast_source.sound_card,
            LimitTime: 0,
          },
        };
      } else {
        proxy.$message.warning(proxy.$t("No sound card"));
      }
    }
    if (row.sound_source.type === 3) {
      //终端采集
      if (row.fast_sound.fast_source.terminals_id) {
        data = {
          TaskAudioType: 6,
          RemoteID: row.id,
          RemoteType: "remote_play",
          RemoteAudioProp: {
            TaskAudioType: 2,
            CollectID: row.fast_sound.fast_source.terminals_id
              ? row.fast_sound.fast_source.terminals_id
              : 0,
            SelfCheck: 0,
          },
        };
      } else {
        proxy.$message.warning(proxy.$t("No acquisition terminal"));
      }
    }
  }
  return data;
};
// 编辑播放任务
const handleEditTask = (row: any) => {
  $useRouter.push({
    path: "/play-task/" + row.id,
    query: {
      id: row.id,
      type: row.type,
    },
  });
};
// 删除播放任务
const handleDeleteTask = (row: any) => {
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
  }).then(() => {
    if (row.type < 10) {
      handelDelServeRask(row).then(() => {
        getTaskAll();
      });
    } else {
      handelDelLocalRask(row).then(() => {
        getTaskAll();
      });
    }
  });
};
// 删除远程任务
const handelDelServeRask = (row: any) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(row) && row.length === 0) return resolve(row);
    proxy.$http
      .delete("/broadcasting/", {
        data: {
          ids: Array.isArray(row) ? row : [row.id],
        },
      })
      .then((result: any) => {
        if (result.result === 200) {
          resolve(result);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};
// 删除本地任务
const handelDelLocalRask = (row: any) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(row) && row.length === 0) return resolve(row);
    proxy.$http1
      .delete("/task", {
        data: {
          ids: Array.isArray(row) ? row : [row.id],
        },
      })
      .then((result: any) => {
        if (result.result === 200) {
          resolve(result);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};
// 获取所有任务
const getTaskAll = () => {
  Promise.all([getBroadcastingAll(), getTaskLocalAll()]).then((data: any) => {
    tableDataAll.value = [...data[0], ...data[1]];
    form.data = filterData();
  });
};
// 获取所有播放任务
const getBroadcastingAll = () => {
  return new Promise((resolve, reject) => {
    if (!systemStore.functional_configs.remoteTaskDisplay) return resolve([]);
    proxy.$http
      .get("/broadcasting/all", {
        params: {
          withFastSound: true,
        },
      })
      .then((restlu: any) => {
        let data = restlu.data.filter((item: { type: number }) => {
          return item.type === 1 || item.type === 4;
        });
        resolve(data);
      });
  });
};
// 获取所有任务(本地)
const getTaskLocalAll = () => {
  return new Promise((resolve, reject) => {
    proxy.$http1
      .get("/task", {
        params: {
          userID: localStorage.get("LoginUserID"),
          serverIP: localStorage.get("serverIP"),
        },
      })
      .then((restlu: any) => {
        if (Array.isArray(restlu.data)) {
          resolve(restlu.data);
        } else {
          resolve([]);
        }
      });
  });
};
// 获取所有系统优先级
const getPrioritySetting = () => {
  return new Promise((resolve, reject) => {
    proxy.$http.get("/priority-setting").then((restlu: any) => {
      restlu.data.forEach((item: { task_type: any; priority: any }) => {
        priorityData.set(item.task_type, item.priority);
      });
      resolve(restlu.data);
    });
  });
};
const formatTooltip = (seconds: number) => {
  if (seconds) {
    let data = seconds;
    let hour =
      Math.floor(data / 3600) >= 10
        ? Math.floor(data / 3600)
        : "0" + Math.floor(data / 3600);
    data -= 3600 * Number(hour);
    let min =
      Math.floor(data / 60) >= 10 ? Math.floor(data / 60) : "0" + Math.floor(data / 60);
    data -= 60 * Number(min);
    let sec = data >= 10 ? data : "0" + data;
    return hour + ":" + min + ":" + sec;
  } else {
    return "00:00:00";
  }
};
const handleSearch = () => {
  form.data = filterData();
};
// 数据过滤
const filterData = () => {
  if (form.search === "") return tableDataAll.value;
  return tableDataAll.value.filter((item: any) => {
    return item.name.indexOf(form.search) !== -1;
  });
};

// 监听变化
watch(
  () => sessionStoreAll.value,
  (newData) => {
    form.sessionsData = Object.values(newData).filter((item: any) => {
      return [12, 13, 14, 15].includes(item.TaskType);
    });
  },
  {
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);
watch(playStatusData, (newVal) => {
  if (form.isChangeProgressBar) {
    form.current_duration = newVal.CurrentTime;
  }
  form.total_duration = newVal.TotalTime;
  form.song_name = newVal.MusicName;
  form.play_status = newVal.PlayStatus;
});
watch(playSubscriptionTask, (newVal) => {
  if (newVal?.TaskID === playCenterData.value?.TaskID) {
    if (form.isChangeProgressBar) {
      form.current_duration = newVal.CurrentTime;
    }
    form.total_duration = newVal.TotalTime;
    form.song_name = newVal.MusicName;
    form.play_status = newVal.PlayStatus;
    form.play_model = playModeNum.get(newVal.PlayModel);
  }
});
watch(playCenterData, (newVal, oldVal) => {
  form.volume = newVal?.TaskVolume ? newVal?.TaskVolume : newVal?.volume;
  if (newVal?.TaskID === oldVal?.TaskID) return;
  const newValType =
    newVal.type === 1 ||
    newVal.type === 10 ||
    (newVal.type === 4 && newVal.sound_source.type === 1);
  const oldValType =
    oldVal.type === 1 ||
    oldVal.type === 10 ||
    (oldVal.type === 4 && oldVal.sound_source.type === 1);
  if (!newValType && oldValType && oldVal?.TaskID) {
    unsubscribeTask(oldVal);
  }
  if (newVal?.TaskID && !oldVal.TaskID) {
    //新任务详情存在任务,旧任务详情无执行任务
    if (newValType) subscribeTask(newVal);
  }
  if (newVal?.TaskID && oldVal?.TaskID && newVal?.TaskID !== oldVal?.TaskID) {
    //新旧任务都存在TaskID,但是任务不相同,判断为切换了任务详情
    if (oldValType) unsubscribeTask(oldVal);
    if (newValType) subscribeTask(newVal);
  }
  if (!newVal?.TaskID && oldVal?.TaskID && newVal?.name !== oldVal?.name) {
    //判断为切换了任务详情,新的任务详情不存在任务
    if (oldValType) unsubscribeTask(oldVal);
  }
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  Promise.all([getBroadcastingAll(), getTaskLocalAll(), getPrioritySetting()]).then(
    (data: any) => {
      tableDataAll.value = [...data[0], ...data[1]];
      form.data = [...data[0], ...data[1]];
      if (form.data.length > 0) {
        handleSelectionClick(form.data[0]);
        multipleTableRef.value?.setCurrentRow(form.data[0]);
      }
    }
  );
  if (JSON.stringify($useRoute.params) != "{}") {
    handlePlayTask($useRoute.params);
  }
});
</script>

<style lang="scss" scoped>
.com-play-index {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .play-left {
    width: 320px;
    background: #f3f9ff;
  }

  .play-center {
    position: relative;
    display: flex;
    flex: 1;

    .iconfont.theme {
      position: absolute;
      top: 30px;
      right: 20px;
      font-size: 20px;
      cursor: pointer;
    }

    .center-content {
      width: 100%;

      .content-top {
        position: relative;
        width: 340px;
        height: 340px;
        margin: 9vh auto 2vh;

        .record {
          width: 100%;
          height: 100%;
        }
      }

      .record-arm {
        position: absolute;
        top: -22px;
        left: 0;
        width: 90px;
        height: 150px;
        transform: rotate(32deg);
        transform-origin: left top;
        z-index: 1;
      }

      .playing {
        .record-arm {
          transform: rotate(0deg);
          transform-origin: left top;
        }

        .record {
          transform: rotate(360deg);
          animation: rotation 3s linear infinite;
        }
      }

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      .content-center {
        p {
          max-width: 380px;
          padding: 2vh 10px;
          margin: auto;
          box-sizing: border-box;
          font-size: 16px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .progress {
          width: 360px;
          margin: 4vh auto 2vh;

          :deep(.el-progress__text) {
            display: none;
          }

          .fl,
          .fr {
            display: inline-block;
            padding: 10px 0;
            font-size: 12px;
            color: $c-999;
          }

          .fr {
            float: right;
          }
        }
      }

      .content-bottom {
        display: flex;
        justify-content: center;
        align-items: center;

        i {
          font-size: 28px;
          cursor: pointer;
          margin: 0 18px;
        }

        .icon-play,
        .icon-suspend {
          font-size: 46px;
        }
      }
      .com-show-button {
        padding-top: calc(64px + 4vh + 2vh);
        .icon-end {
          font-size: 46px;
        }
      }
    }
  }

  .play-right {
    width: 62%;
    border-left: 1px solid #f5f5f5;
    box-sizing: border-box;

    .right-top,
    .right-bottom {
      height: 50%;
      overflow: hidden;
    }

    .com-breadcrumb {
      .el-input {
        width: 200px;
      }
    }

    .play-table-title {
      margin-right: 12px;
      font-weight: bold;
    }
  }
}
</style>
