<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-15
  @FilePath: src\views\play\add-edit-component\task-details-config.vue
  @Describe: 播放中心-任务配置
-->
<template>
  <div class="com-index com-task-details-config">
    <div class="com-head">
      <div class="com-head-content">
        <div class="com-tabs">
          <div
            :class="{ select: activeName === 'configure' }"
            @click="handleSwitchTabs('configure')"
          >
            {{ $t("Play configuration") }}
            {{ musicsNumber !== "" ? "(" + musicsNumber + ")" : "" }}
          </div>
          <div
            :class="{ select: activeName === 'region' }"
            @click="handleSwitchTabs('region')"
          >
            {{ $t("Play area") }}
            {{ terminasNumber !== "" ? "(" + terminasNumber + ")" : "" }}
          </div>
        </div>
        <div class="com-button">
          <i
            class="iconfont icon-edit1"
            :class="{'icon-disabled': activeName === 'configure' && isExecuted}"
            @click="handleEditButton(!(activeName === 'configure' && isExecuted))"
            v-if="!editStatus"
          ></i>
          <i class="iconfont icon-save" @click="handleEditSava" v-else></i>
        </div>
      </div>
    </div>
    <div class="com-main" v-if="isConfigure">
      <sound-source-component
        v-if="ruleForm.type === 4"
        v-model:ruleForm="ruleForm"
        :selectTaskData="taskDataDetailed"
        :isEdit="editStatus"
        labelPosition="left"
        :adaption="{
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
        }"
        @requestSoundSource="requestSoundSource"
      >
      </sound-source-component>
      <text-play-component
        v-if="ruleForm.type === 11"
        v-model:tsctFormData="tsctFormData"
        :selectTaskData="taskDataDetailed"
        :isEdit="editStatus"
        labelPosition="left"
        :adaption="{
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
        }"
      >
      </text-play-component>
      <acquisition-device-component
        v-if="ruleForm.type === 12 || ruleForm.type === 13"
        v-model:sourAcquisiFrom="sourAcquisiFrom"
        :isEdit="editStatus"
        :selectTaskData="taskDataDetailed"
      >
      </acquisition-device-component>
      <div class="com-table" v-if="ruleForm.type === 10">
        <el-table
          :data="ruleForm.data"
          height="100%"
          @row-dblclick="handelRowDblclick"
        >
          <el-table-column type="index" label="No." width="80" >
            <template #default="scope">
              {{ scope.row.index + 1 }}
              <span link title="文件不存在" class="textNoExist" v-if="!scope.row.isexist" >
                  <el-icon><WarnTriangleFilled /></el-icon>
              </span>
              
            </template>
            </el-table-column>
          <el-table-column
            prop="path"
            :label="$t('Name')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="tabel-data-popover">
                <div class="tabel-data-popover-content">
                  <span>
                    {{ scope.row.name }}
                  </span>
                  <!-- <view-components-popover
                    v-if="!scope.row.medias_id"
                    :url="'/medias-groups/' + scope.row.id + '/medias'"
                  /> -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" v-if="!isExecuted" >
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="handleMoveUp(scope.row, scope.$index)"
                :disabled="scope.$index === 0"
              >
                <template #icon>
                  <i class="iconfont icon-move-up" :title="$t('Move up')"></i>
                </template>
              </el-button>
              <el-button
                link
                type="primary"
                @click="handleMoveDown(scope.row, scope.$index)"
                :disabled="scope.$index + 1 === ruleForm.data.length "
              >
                <template #icon>
                  <i
                    class="iconfont icon-move-down"
                    :title="$t('Move down')"
                  ></i>
                </template>
              </el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">
                <template #icon>
                  <i class="iconfont icon-delete" :title="$t('Delete')"></i>
                </template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="time" :label="$t('File duration')" width="100">
            <template #default="scope">
              {{ usePublicMethod.convertSongDuration(scope.row.time) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="com-table" v-if="ruleForm.type === 1">
        <el-table
          :data="ruleForm.data"
          style="width: 100%"
          height="100%"
          @row-dblclick="handelRowDblclick"
        >
          <el-table-column type="index" label="No." width="80" />
          <el-table-column
            prop="name"
            :label="$t('Name')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="tabel-data-popover">
                <div class="tabel-data-popover-content">
                  <span>
                    {{ scope.row.name }}
                  </span>
                  <!-- <view-components-popover
                    v-if="!scope.row.medias_id"
                    :url="'/medias'"
                    :mediasGroupsID="scope.row.id"
                  /> -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="80">
            <template #default="scope">
              <el-button link type="primary" @click="handleDelete(scope.row)">
                <template #icon>
                  <i class="iconfont icon-delete" :title="$t('Delete')"></i>
                </template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="length"
            :label="$t('File duration')"
            width="100"
          >
            <template #default="scope">
              {{ usePublicMethod.convertSongDuration(scope.row.length) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="com-main" v-else>
      <div class="com-table" v-if="taskDataDetailed.fast_terminals_id === 0">
        <el-table
          :data="taskTerminalAll"
          height="100%"
          @row-dblclick="handelRowDblclick"
        >
          <el-table-column type="index" label="No." width="80" />
          <el-table-column
            prop="name"
            :label="$t('Name')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="tabel-data-popover">
                <div class="tabel-data-popover-content">
                  <span>
                    {{ scope.row.name }}
                  </span>
                  <view-components-popover
                    v-if="scope.row.terminals_groups_id"
                    :url="'/terminals-groups/' + scope.row.id + '/terminals'"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ip_address"
            :label="$t('IP address')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{
                scope.row.hasOwnProperty("ip_address")
                  ? scope.row.ip_address
                  : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="default_volume"
            :label="$t('Volume')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{
                scope.row.hasOwnProperty("terminals_id")
                  ? allTerminalsObj[scope.row.terminals_id]?.Volume
                  : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('Type')" width="100">
            <template #default="scope">
              {{
                scope.row.hasOwnProperty("terminals_id")
                  ? formatterTerminalsType(scope.row)
                  : $t("Group")
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-form
          :model="ruleForm"
          :label-position="props.labelPosition"
          class="play-task-form-inline com-sound-source-component"
        >
          <el-row :gutter="80">
            <el-col>
              <el-form-item :label="$t('Fast terminal')">
                <div class="fast-sound-source">
                  <div class="fast-sound-source-name">
                    {{
                      taskDataDetailed.fast_terminal
                        ? taskDataDetailed.fast_terminal.name
                        : ""
                    }}
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-upload
      v-model:file-list="fileList"
      ref="uploadRef"
      class="upload-demo"
      accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/aac,audio/flac,audio/amr,audio/opus,audio/vnd.dlna.adts"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :multiple="true"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="uploadChange"
    >
      <template #trigger>
        <span
          class="iconfont icon-add"
          ref="iconAdd"
          style="display: none"
        ></span>
      </template>
    </el-upload>
    <select-media-dialog
      v-if="mediaDialogVisible"
      v-model:dialogVisible="mediaDialogVisible"
      :responseMedia="responseMedia"
      :responseeMediaGroups="responseeMediaGroups"
      @uploadMedia="uploadMedia"
    >
    </select-media-dialog>
    <quick-terminal-dialog
      v-if="terminaDialogVisible"
      v-model:dialogVisible="terminaDialogVisible"
      :seleQuickTerminal="taskDataDetailed.fast_terminal"
      @handleSelectedConfigure="handleSelectedTerminals"
    >
    </quick-terminal-dialog>
    <terminals-select-dialog
      v-if="terminaSelectVisible"
      v-model:dialogVisible="terminaSelectVisible"
      :taskDataDetailed="taskDataDetailed"
      @handleSelectedTerminals="handleSelectedTerminals"
    >
    </terminals-select-dialog>
  </div>
</template>

<script lang="ts" setup>
import quickTerminalDialog from "@/components/quick-terminal-dialog.vue";
import soundSourceComponent from "../components/sound-source-component.vue";
import textPlayComponent from "../components/text-play-component.vue";
import selectMediaDialog from "../dialogComponents/select-media-dialog.vue";
import terminalsSelectDialog from "../dialogComponents/terminals-select-dialog.vue";
import { UploadProps } from "element-plus";
import { send } from "@/utils/socket";
import usePublicMethod from "@/utils/global/index";
import {handleExecuteTaskTerminalsChange} from "../components/playUtil"
// defineAsyncComponent 异步组件-懒加载子组件
const acquisitionDeviceComponent = defineAsyncComponent(
  () => import("../components/acquisition-device-component.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
const emit = defineEmits(['changeTaskVolume'])
const props: any = defineProps({
  selectTaskData: Object,
  playCenterData: Object,
  currentVolume: Number,
});
const ruleForm: any = reactive({
  type: 1,
  medias: [],
  medias_groups: [],
  fast_sound_id: [],
  data: [],
});
const activeName = ref("configure");
const editStatus = ref(false); //是否在编辑状态
const uploadRef = ref();
const iconAdd = ref();
const fileList = ref([]); //选中的文件
const responseMedia = ref([]); //媒体音频
const responseeMediaGroups = ref([]); //媒体音频分组
const soundSourceForm: any = ref({}); //快捷音源配置
const sourAcquisiFrom: any = ref({}); //音源采集配置
const tsctFormData = ref({});
const taskDataDetailed: any = ref({}); //任务详情数据
const mediaDialogVisible = ref(false); //选择媒体对话框
const taskTerminalAll: any = ref([]); //任务终端
const terminaDialogVisible = ref(false); //快捷终端弹框
const terminaSelectVisible = ref(false); //终端选择弹框
const storePlay = getStore.usePlayStore();
const session = getStore.useSessionStore();
const sessionStoreAll = computed(() => {
  return session.allSessionObj;
});

// 播放模式
const taskPlayMode = new Map([
  [0, "normal_play"],
  [1, "loop_play"],
  [2, "random_play"],
]);
const isConfigure = computed(() => {
  return activeName.value === "configure";
});

const terminasNumber = computed(() => {
  return taskDataDetailed.value.fast_terminals_id
    ? ""
    : taskTerminalAll.value.length;
});

const musicsNumber = computed(() => {
  return [1, 10].includes(taskDataDetailed.value.type)
    ? ruleForm.data.length
    : "";
});
// 当前是否为最新的任务详情，若不是，重新请求当前任务详情
const isLatestTaskDetail: any = computed(() => {
  return storePlay.isLatestTaskDetail;
});
// 改变任务音量
const changeTaskVolume: any = computed(() => {
  return storePlay.changeTaskVolume;
});
const allTerminalsObj: any = computed(() => {
  return getStore.useTerminalsStore().allTerminalsObj;
});

/**
 * 编辑任务
 *  1. 编辑本地任务
 *  2. 编辑远程播放任务
 */
// 编辑本地播放任务
const editLocalAudio = (data: any) => {
  proxy.$http1.put("/task", data).then((result: any) => {
    if (result.result === 200) {
      handleSelectionData(props.selectTaskData);
    }
  });
};
// 编辑远程播放任务
const editRemteTask = (data: any) => {
  proxy.$http.put("/broadcasting/" + data.id, data).then((result: any) => {
    if (result.result === 200) {
      handleSelectionData(props.selectTaskData);
    }
  });
};
// 修改终端音量
const changeTerminalVolume = (data: any) => {
  let send_data = {
    company: "BL",
    actioncode: "c2ms_set_terminal_volume",
    token: "",
    data: {
      EndPointList: [...data.EndPointID],
      Volume: data.volume,
    },
    result: 0,
    return_message: "",
  };
  send(send_data);
};
// 处理改变当前任务任务音量
const handleChangeTaskVolume = (taskDetail: any) => {
  // 1. 发一个改变任务音量，c2ms_set_task_volume ；在/play/index.vue 音量条改变就发送，
  // 2. 发一个改变终端音量，c2ms_set_terminal_volume(只是修改任务音量，既能修改终端音量，这个在分控端做了)
  let changeTerminalVolumeData = {
    EndPointID: taskTerminalAll.value.map((item: any) => {
      return item.id;
    }),
    volume: props.currentVolume,
  };
  changeTerminalVolume(changeTerminalVolumeData);
  // 3. 发起修改任务详情中的声音
  const localmusic = [10, 11, 12];
  taskDetail.volume = props.currentVolume || 0;
  if (localmusic.includes(taskDetail.type)) {
    editLocalAudio(taskDetail);
  } else {
    editRemteTask(taskDetail);
  }
};
watch(changeTaskVolume, (newVal: any) => {
  if (!newVal) {
    handleChangeTaskVolume(taskDataDetailed.value);
  }
});
watch(
  () => props.selectTaskData,
  (newVal: any) => {
    handleSelectionData(newVal);
  }
);
watch(taskDataDetailed, (newVal: any) => {
  editStatus.value = false;
  ruleForm.type = newVal.type;
  if (newVal.type === 1) {
    ruleForm.data = [...newVal.medias, ...newVal.medias_groups];
  }
  if (newVal.type === 10) {
    ruleForm.data = newVal.content.map((item: any, index: number) => {
      item.index = index;
      return item;
    });
  }
});

// 当前任务是否正在执行
const isExecuted = computed(() => {
  return (
    Object.keys(sessionStoreAll.value).findIndex((taskId: any) => {
      if (
        sessionStoreAll.value[taskId].RemoteTaskID === taskDataDetailed.value.id
      ) {
        // 添加当前正在执行的任务的【播放媒体名称】 与 【执行任务ID】
        taskDataDetailed.value.TaskShowInfo =
          sessionStoreAll.value[taskId].TaskShowInfo;
        taskDataDetailed.value.TaskID = taskId;
        return true;
      } else {
        if (taskDataDetailed.value.type >= 10) {
          return taskId === taskDataDetailed.value.taskid;
        }
        return false;
      }
    }) !== -1
  );
});
// 任务属性
const handleTaskAttribute = (row: any) => {
  let data = null;
  if (row.type === 1) {
    //远程任务-音乐播放
    if (row.mediasIds.length === 0)
      return proxy.$message({
        type: "warning",
        message: proxy.$t("No sound source"),
        grouping: true,
      });
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
        return proxy.$message({
          type: "warning",
          message: proxy.$t("No sound source"),
          grouping: true,
        });
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
        proxy.$message({
          type: "warning",
          message: proxy.$t("No sound card"),
          grouping: true,
        });
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
        proxy.$message({
          type: "warning",
          message: proxy.$t("No acquisition terminal"),
          grouping: true,
        });
      }
    }
  }
  return data;
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
// 订阅任务 触发媒体进度条信息获取
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
// 创建一个远程媒体任务
const createExecutedTask = (row: any, playMediaName: string) => {
  let TaskProp: any = handleTaskAttribute(row);
  if (row.terminalsIds.length === 0)
    return proxy.$message({
      type: "warning",
      message: proxy.$t("No play terminal"),
      grouping: true,
    });
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
    // 创建成功后，订阅任务
    session.addWaitExecutionEvent(TaskID, () => {
      // 创建成功后，播放的媒体名称
      switchMedia(TaskID, playMediaName);
      // 订阅任务
      subscribeTask({ TaskID });
    });
  }
};
// 创建一个本地媒体任务
const createLocalExecutedTask = (row: any, playMediaName: string) => {
  let data = {
    company: "BL",
    actioncode: "c2ms_create_local_task",
    data: {
      TaskID: row.taskid,
      FirstIndex: playMediaName,
    },
    result: 0,
    return_message: "",
  };
  if (row.type === 10) {
    storePlay.changePlayTaskStaging({
      key: "add",
      value: row.taskid,
    });
  }
  send(data);
  session.addWaitExecutionEvent(row.taskid, () => {
    switchMedia(row.taskid, playMediaName);
  });
};
// 播放任务
const handlePlayTask = (row: any) => {
  // 判断当前选中任务是否是已执行任务
  // 本地任务 10,本地任务是传index，远程任务传name
  const mediaName = taskDataDetailed.value.type === 10 ? row.index : row.name;
  if (isExecuted.value) {
    // 判断当前播放媒体是不是就是选中媒体
    if (row.name !== taskDataDetailed.value.TaskShowInfo) {
      const taskid =
        taskDataDetailed.value.type === 10
          ? taskDataDetailed.value.taskid
          : taskDataDetailed.value.TaskID;
      switchMedia(taskid, mediaName);
      return;
    }
  } else {
    // 先判断任务类型
    if (taskDataDetailed.value.type < 10) {
      createExecutedTask(taskDataDetailed.value, mediaName);
    } else {
      createLocalExecutedTask(taskDataDetailed.value, mediaName);
    }
  }
};
// 切换到某个媒体进行播放
const switchMedia = (TaskID: any, MusicNameOrMusicIndex: string) => {
  let data = {
    company: "BL",
    actioncode: "c2ms_control_task",
    token: "",
    data: {
      TaskID: TaskID,
      ControlCode: "play",
      ControlValue: String(MusicNameOrMusicIndex),
    },
    result: 0,
    return_message: "",
  };
  send(data);
};

const handelRowDblclick = (row: any, column:any) => {
  // 双击非操作列，才发起任务
  if(column.label){
    handlePlayTask(row);
  }
};

// 切换tabs
const handleSwitchTabs = (tabsName: string) => {
  if (editStatus.value) return;
  activeName.value = tabsName;
};
// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
  soundSourceForm.value = data;
  ruleForm.fast_sound_id = data.id;
  delete soundSourceForm.value.id;
};
// 选择之前的终端、当前任务就的终端
let oldTerminals:any[]
//  选择的终端/终端分组、快捷终端
const handleSelectedTerminals = (data: any) => {
  oldTerminals = taskDataDetailed.value.terminals
  let putData = {
    terminals: data.terminals,
    terminals_groups: data.terminals_groups.map((item: any) => {
      return {
        name: item.name,
        terminals_groups_id: item.terminals_groups_id,
      };
    }),
  };
  // 当选择终端
  if(activeName.value === "region"){
    taskDataDetailed.value.fast_terminals_id = data.id || 0;
    taskDataDetailed.value.terminals = putData.terminals;
    taskDataDetailed.value.terminals_groups = putData.terminals_groups;
    taskDataDetailed.value.terminalsIds = putData.terminals.map((item: any) => {
      return item.terminals_id
    });
    // 当为本地任务的快捷终端
    if(ruleForm.type >= 10){
      handleLocalTaskFastTermina().then((res:any) => {
        if(res.result === 200){
          // 处理终端的增减
          handleChangeTaskTerminals();
        }
        });
      return;
    }
  }
  proxy.$http
    .put("/broadcasting/" + taskDataDetailed.value.id, {
      name: taskDataDetailed.value.name,
      priority: taskDataDetailed.value.priority,
      volume: taskDataDetailed.value.volume,
      play_model: taskDataDetailed.value.play_model,
      type: taskDataDetailed.value.type,
      fast_sound_id: taskDataDetailed.value.fast_sound_id,
      fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
      terminals: putData.terminals,
      terminals_groups: putData.terminals_groups,
      sound_source: taskDataDetailed.value.sound_source,
      medias: taskDataDetailed.value.medias,
      medias_groups: taskDataDetailed.value.medias_groups,
    })
    .then((result: any) => {
      if (result.result === 200) {
        editStatus.value = false;
        handleChangeTaskTerminals();
      }
    });
};
// 更新本地任务（快捷终端修改）
const handleLocalTaskFastTermina = () => {
   return proxy.$http1
      .put(
        "/task",
        Object.assign(props.selectTaskData, {
          fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
          terminalsIds: taskDataDetailed.value.terminalsIds,
          terminals: taskDataDetailed.value.terminals,
          terminals_groups: taskDataDetailed.value.terminals_groups,
        })
      )
};
// 改变任务终端
const handleChangeTaskTerminals = () => {
  // 旧的终端信息，获取新数据前
  const oldTerminalsIds = oldTerminals.map(item => item.id);
  handleSelectionData(props.selectTaskData).then((result: any) => {
    if (props.playCenterData.TaskID) {
      // 新的终端信息
      let newTerminals = result?.terminalsIds;
      const {addTerminals} = handleExecuteTaskTerminalsChange(props.playCenterData.TaskID, result.volume, newTerminals, oldTerminalsIds);
      if(addTerminals){
        emit('changeTaskVolume',props.currentVolume)
      }
    }
  });
};
// 触发编辑
const handleEditButton = (isCanEdit = true) => {
  if(!isCanEdit){
    return
  }
  if (
    activeName.value === "region" &&
    taskDataDetailed.value.fast_terminals_id !== 0
  ) {
    terminaDialogVisible.value = true;
    return;
  }
  if (
    activeName.value === "region" &&
    taskDataDetailed.value.fast_terminals_id === 0
  ) {
    terminaSelectVisible.value = true;
    return;
  }
  if (ruleForm.type === 10) {
    iconAdd.value.click();
  }
  if (ruleForm.type === 1) {
    responseMedia.value = taskDataDetailed.value.medias;
    responseeMediaGroups.value = taskDataDetailed.value.medias_groups;
    mediaDialogVisible.value = true;
  }
  if (
    ruleForm.type === 4 ||
    ruleForm.type === 11 ||
    ruleForm.type === 12 ||
    ruleForm.type === 13
  ) {
    editStatus.value = true;
  }
};
// 触发保存
const handleEditSava = () => {
  if (ruleForm.type === 4) {
    handleRemoteTasks().then(() => {
      editStatus.value = false;
      handleSelectionData(props.selectTaskData);
    });
    return;
  }
  if (ruleForm.type >= 10) {
    let data;
    if (ruleForm.type === 11) {
      data = tsctFormData.value;
    }
    if (ruleForm.type === 12 || ruleForm.type === 13) {
      ruleForm.type = sourAcquisiFrom.value.type;
      if (sourAcquisiFrom.value.type === 12) {
        data = {
          audioQuality: sourAcquisiFrom.value.audioQuality,
          record: sourAcquisiFrom.value.record,
          recordpath: sourAcquisiFrom.value.recordpath,
          soundcard: sourAcquisiFrom.value.soundcard,
        };
      } else {
        data = {
          audioQuality: sourAcquisiFrom.value.audioQuality,
          terminalID: sourAcquisiFrom.value.terminalID,
        };
      }
    }
    proxy.$http1
      .put(
        "/task",
        Object.assign(props.selectTaskData, {
          content: data,
          type: ruleForm.type,
        })
      )
      .then((result: any) => {
        if (result.result === 200) {
          editStatus.value = false;
          handleSelectionData(props.selectTaskData);
        }
      });
  }
};

// 更新远程任务
const handleRemoteTasks = () => {
  return new Promise((resolve: any, reject: any) => {
    proxy.$http
      .put("/broadcasting/" + props.selectTaskData.id, {
        name: props.selectTaskData.name,
        priority: props.selectTaskData.priority,
        volume: props.selectTaskData.volume,
        play_model: props.selectTaskData.play_model,
        type: props.selectTaskData.type,
        fast_sound_id: props.selectTaskData.fast_sound_id,
        fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
        terminals: props.selectTaskData.terminals,
        terminals_groups: props.selectTaskData.terminals_groups,
        sound_source:
          props.selectTaskData.type === 4 ? soundSourceForm.value : "",
        medias: props.selectTaskData.medias,
        medias_groups: props.selectTaskData.medias_groups,
      })
      .then((result: any) => {
        if (result.result === 200) {
          resolve();
        }
      });
  });
};
// 更新本地任务（本地音频添加）
const handleLocalTaskMusic = () => {
  if (fileList.value.length > 0) {
    let data = fileList.value.map((item: any) => {
      return {
        name: item.name,
        path: item.raw.path,
        time: item.time,
      };
    });
    let newArrPath: any = [];
    let newArrData: any = [];
    ruleForm.data.concat(data).forEach((item: any) => {
      if (!newArrPath.includes(item.path)) {
        newArrPath.push(item.path);
        newArrData.push(item);
      }
    });
    proxy.$http1
      .put(
        "/task",
        Object.assign(props.selectTaskData, {
          content: newArrData,
        })
      )
      .then((result: any) => {
        if (result.result === 200) {
          fileList.value = [];
          handleSelectionData(props.selectTaskData);
        }
      });
  }
};
// 媒体弹框更新保存
const uploadMedia = (data: any) => {
  proxy.$http
    .put("/broadcasting/" + props.selectTaskData.id, {
      name: props.selectTaskData.name,
      priority: props.selectTaskData.priority,
      volume: props.selectTaskData.volume,
      play_model: props.selectTaskData.play_model,
      type: props.selectTaskData.type,
      fast_sound_id: props.selectTaskData.fast_sound_id,
      fast_terminals_id: props.selectTaskData.fast_terminals_id,
      terminals: props.selectTaskData.terminals,
      terminals_groups: props.selectTaskData.terminals_groups,
      sound_source: props.selectTaskData.sound_source,
      medias: data.medias,
      medias_groups: data.medias_groups,
    })
    .then((result: any) => {
      if (result.result === 200) {
        responseMedia.value = [];
        responseeMediaGroups.value = [];
        mediaDialogVisible.value = false;
        handleSelectionData(props.selectTaskData);
      }
    });
};
// 选中文件时触发
const uploadChange: UploadProps["onChange"] = (
  uploadFile: any,
  uploadFiles: any
) => {
  getTimes(uploadFile);
  usePublicMethod.debounce(handleLocalTaskMusic, 500);
};
// 获取文件时长
const getTimes = (file: any) => {
  var content = file.raw;
  //获取录音时长
  var url = URL.createObjectURL(content);
  //经测试，发现audio也可获取视频的时长
  var audioElement = new Audio(url);
  file["time"] = 0;
  audioElement.addEventListener("loadedmetadata", () => {
    let data = audioElement.duration;
    file["time"] = parseInt(data.toString());
  });
};
// 上移
const handleMoveUp = (row: any, index: number) => {
  if (index === 0) return;
  row.index--
  ruleForm.data[index-1].index++
  ruleForm.data[index] = ruleForm.data.splice(
    index - 1,
    1,
    ruleForm.data[index]
  )[0];
  proxy.$http1
    .put("/task/detail/" + props.selectTaskData.id, {
      content: ruleForm.data,
    })
    .then((result: any) => {
      if (result.result === 200) {
        //  
      }
    });
};
// 下移
const handleMoveDown = (row: any, index: number) => {
  if (index + 1 === ruleForm.data.length) return;
  row.index++
  ruleForm.data[index+1].index--
  ruleForm.data[index] = ruleForm.data.splice(
    index + 1,
    1,
    ruleForm.data[index]
  )[0];
  proxy.$http1
    .put("/task/detail/" + props.selectTaskData.id, {
      content: ruleForm.data,
    })
    .then((result: any) => {
      if (result.result === 200) {
        //
      }
    });
};
// 删除音频
const handleDelete = (row: any) => {
  if (ruleForm.type === 10) {
    proxy.$http1
      .delete("/task/localmusic", {
        data: {
          id: props.selectTaskData.id,
          path: row.path,
        },
      })
      .then((result: any) => {
        if (result.result === 200) {
          ruleForm.data = ruleForm.data.filter((item: any) => {
            return item !== row;
          });
          ruleForm.data.map((item:any,index:number)=>{
            item.index = index
          })
          // 触发重新请求任务列表
          storePlay.setIsLatestTaskStatus(false);
        }
      });
    return;
  }
  proxy.$http
    .delete("/broadcasting/del-groups-medias", {
      data: {
        id: props.selectTaskData.id,
        medias_groups: row.medias_id ? "" : row.medias_groups_id,
        medias: row.medias_id ? row.medias_id : "",
      },
    })
    .then((result: any) => {
      if (result.result === 200) {
        handleSelectionData(props.selectTaskData);
      }
    });
};
// 获取选中任务详情信息
const handleSelectionData = (row: any) => {
  return new Promise((resolve: any, reject: any) => {
    // 更新完任务详情，设置当前为最新任务详情版本
    storePlay.setIsLatestTaskDetail(true);
    if (row.type < 10) {
      proxy.$http
        .get("/details/" + row.id, {
          params: {
            tag: "BroadcastingStudio",
            withMedias: true,
            withGroups: true,
            withFastSound: true,
            withTerminals: true,
            withFastTerminal: true,
          },
        })
        .then((result: any) => {
          taskDataDetailed.value = result.data
          const terminals = result.data.terminals ? result.data.terminals : [];
          const terminals_groups = result.data.terminals_groups
            ? result.data.terminals_groups
            : [];
          taskTerminalAll.value = [...terminals_groups, ...terminals];
          if (result.data.fast_terminals_id) {
            getFastTerminals().then((data: any) => {
              taskDataDetailed.value["fast_terminal"] = data.filter(
                (item: { id: any }) => {
                  return item.id === result.data.fast_terminals_id;
                }
              )[0];
            });
          }
          resolve(result.data);
        });
    } else {
      proxy.$http1.get("/task/" + row.id).then((result: any) => {
        result.data.content = result.data.content || []
        taskDataDetailed.value = result.data
        if (result.data.fast_terminals_id) {
          getFastTerminals().then((data: any) => {
            taskDataDetailed.value["fast_terminal"] = data.filter(
              (item: { id: any }) => {
                return item.id === result.data.fast_terminals_id;
              }
            )[0];
          });
        }
        const terminals = result.data.terminals ? result.data.terminals : [];
        const terminals_groups = result.data.terminals_groups
          ? result.data.terminals_groups
          : [];
        taskTerminalAll.value = [...terminals_groups, ...terminals];
        resolve(result.data);
      });
    }
  });
};

// 获取快捷终端
const getFastTerminals = () => {
  return new Promise<void>((resolve, reject) => {
    proxy.$http.get("/fast-terminals/all").then((result: any) => {
      if (result.result === 200) {
        resolve(result.data);
      }
    });
  });
};

// 格式化终端类型
const formatterTerminalsType = (row: { type: number }) => {
  return useFormatMap.terminalsMap.get(row.type);
};
// mounted 实例挂载完成后被调用
onMounted(() => {});
defineExpose({ handleEditButton });
</script>

<style lang="scss">
.com-task-details-config {
  width: 100%;

  .com-tabs {
    margin-left: 10px;

    > div {
      // width: 110px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #84a2c4;
      display: inline-block;
      cursor: pointer;

      &:last-child {
        border-left: 1px solid #c5d6e8;
        padding-left: 20px;
      }
      &:first-child {
        padding-right: 20px;
      }
    }

    .select {
      font-size: 14px;
      font-weight: bold;
      color: #6f95c1;
    }
  }

  .el-input {
    width: 214px;
  }

  .com-main {
    margin: 0px 10px;
    width: calc(100% - 20px);

    .fast-sound-source {
      position: relative;

      .fast-sound-source-name {
        display: inline-block;
        width: 192px;
        height: 30px;
        padding: 1px 11px;
        color: var(--el-disabled-text-color);
        box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
        cursor: not-allowed;
        border-radius: 3px;
      }

      .el-input.is-disabled .el-input__wrapper {
        background-color: #fff;
      }

      .iconfont {
        position: absolute;
        right: -22px;
        color: #0070ee;
        cursor: pointer;
      }
    }
    .textNoExist{
      color: red; 
      margin-left: 12px; 
      font-size: 18px; 
      vertical-align: middle;
    }
  }

  .recording-evt {
    display: flex;
    height: 30px;
    overflow: hidden;

    .recording-evt-select {
      font-size: 14px;
      color: #ffffff;
      padding: 0px 16px;
      background-color: #0070ee;
      border-radius: 4px;
      cursor: pointer;
    }

    .recording-evt-path {
      color: #666666;
      font-size: 12px;
      line-height: 40px;
      flex: 1;
      margin-left: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
