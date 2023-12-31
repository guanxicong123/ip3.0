<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-03
  @FilePath: src\views\play\add-edit-component\add-edit-play-task.vue
  @Describe: 新建/编辑播放任务
-->
<template>
  <div class="com-add-edit-play-task">
    <el-scrollbar>
      <div class="play-task-basics configure-level">
        <div class="from-alert">
          <span>{{ $t("Basic configuration") }}</span>
        </div>
        <div class="play-task-basics-content configure-level-content">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            label-position="top"
            :rules="rules"
            class="play-task-form-inline"
          >
            <el-row :gutter="80">
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-form-item :label="$t('Task name')" prop="name">
                  <el-input
                    v-model="ruleForm.name"
                    :placeholder="$t('Name placeholder')"
                    maxlength="100"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-form-item :label="$t('Task volume')">
                  <el-input-number
                    v-model="ruleForm.volume"
                    :min="0"
                    :max="100"
                    :value-on-clear="0"
                    controls-position="right"
                  />
                  <el-tooltip
                    effect="dark"
                    :content="$t('Volume prompt description')"
                    placement="right-start"
                  >
                    <i class="iconfont icon-tips theme"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-form-item :label="$t('Priority')" class="custom-form-input">
                  <div
                    class="custom-number red"
                    :title="$t('Task priority') + '-' + $t('Music play')"
                  >
                    <span class="red">{{
                      priorityData.get(typePriority.get(typePriorityNum))
                    }}</span>
                  </div>
                  <el-input-number
                    v-model="ruleForm.priority"
                    :min="1"
                    :max="100"
                    :value-on-clear="1"
                    controls-position="right"
                  />
                  <el-tooltip
                    effect="dark"
                    :content="$t('Priority prompt description')"
                    placement="right-start"
                  >
                    <i class="iconfont icon-tips theme"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-form-item :label="$t('Sound type')">
                  <el-select v-model="ruleForm.type" @change="changeSoundType">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="
                        ($useRoute.query?.type >= 10 && item.type !== 2) ||
                        ($useRoute.query?.type < 10 && item.type !== 1)
                      "
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="play-task-configure configure-level">
        <div class="from-alert">
          <span>{{ $t("Play configuration") }}</span>
          <div class="play-task-configure-music" v-if="ruleForm.type === 10">
            <span
              class="iconfont icon-delete"
              @click="deteleSelectMusic"
            ></span>
            <el-upload
              v-model:file-list="fileList"
              ref="uploadRef"
              class="upload-demo"
              accept="audio/mp3,audio/wav,audio/flac"
              extensions="mpeg,mp3,ogg,wav,aac,flac,amr,opus,adts"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :multiple="true"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="uploadChange"
            >
              <template #trigger>
                <span class="iconfont icon-add"></span>
              </template>
            </el-upload>
          </div>
        </div>
        <div class="play-task-configure-content configure-level-content">
          <sound-source-component
            v-if="ruleForm.type === 4"
            v-model:ruleForm="ruleForm"
            @requestSoundSource="requestSoundSource"
            :selectTaskData="taskDataDetailed"
          >
          </sound-source-component>
          <music-play-component
            v-if="ruleForm.type === 10"
            v-model:fileList="ruleForm.content"
            v-model:musicSelect="musicSelect"
            :requestConfig="requestMusicConfig"
            @requestDispose="requestDispose"
            @deteleOneMusic="deteleOneMusic"
          >
          </music-play-component>
          <remote-play-component
            v-if="ruleForm.type === 1"
            v-model:medias="ruleForm.medias"
            v-model:medias_groups="ruleForm.medias_groups"
            :soundSource="ruleForm.sound_source"
            :responseMedia="responseMedia"
            :responseGroups="responseeMediaGroups"
            @requestDispose="requestRemotePlay"
          >
          </remote-play-component>
          <text-play-component
            v-if="ruleForm.type === 11"
            v-model:tsctFormData="tsctFormData"
            :selectTaskData="requestTaskConfig"
          >
          </text-play-component>
          <source-acquisition-component
            v-if="ruleForm.type === 12"
            @requestDispose="requestSourceAcquisition"
            :selectTaskData="requestTaskConfig"
          >
          </source-acquisition-component>
        </div>
      </div>
      <div class="play-task-region configure-level">
        <div class="from-alert">
          <span>{{ $t("Execution area") }}</span>
        </div>
        <div class="play-task-region-content configure-level-content">
          <el-tabs
            v-model="executionregiontype"
            class="demo-tabs"
            @tab-click="showSearch = executionregiontype != 1"
          >
            <el-tab-pane :label="$t('Fast terminal')" :name="0">
              <el-row :gutter="80">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <p class="selection-title">{{ $t("Fast terminal") }}</p>
                  <div class="quick-terminal-selection">
                    <el-input v-model="quickTerminaName" disabled />
                    <span
                      class="iconfont icon-select-file"
                      @click="dialogVisible = true"
                    ></span>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane :label="$t('Terminal selection')" :name="1">
              <div class="com-data-select-compute">
                <span>{{ $t("Select terminal") }}/{{ $t("Group") }}</span>
                <span>
                  <span class="head-add-color">*</span>
                  {{ $t("Selected terminal") }}:
                  <span class="head-add-color">{{ terminals.length }}</span>
                </span>
                <span>
                  {{ $t("Selected groups") }}:
                  <span class="head-add-color">{{
                    terminals_groups.length
                  }}</span>
                </span>
              </div>
              <terminals-select-components
                :responseTerminals="responseTerminals"
                :responseGroups="responseGroups"
                @requestTerminals="requestTerminals"
                @requestGroups="requestGroups"
                :showSearch="showSearch"
              >
              </terminals-select-components>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-scrollbar>
    <div class="add-edit-bottom-button">
      <div class="button button-cancel" @click="$useRouter.push('/play')">
        {{ $t("Return") }}
      </div>
      <div class="button button-submit" @click="submitTask(ruleFormRef)">
        {{ $t("Save") }}
      </div>
      <div class="button button-submit" @click="submitTaskPlay(ruleFormRef)">
        {{ $t("Save and play") }}
      </div>
    </div>
    <quick-terminal-dialog
      v-model:dialogVisible="dialogVisible"
      @handleSelectedConfigure="handleSelectedConfigure"
    >
    </quick-terminal-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  UploadInstance,
  UploadUserFile,
  UploadProps,
  FormInstance,
} from "element-plus";
import soundSourceComponent from "../components/sound-source-component.vue";
import musicPlayComponent from "../components/music-play-component.vue";
import remotePlayComponent from "../components/remote-play-component.vue";
import textPlayComponent from "../components/text-play-component.vue";
import sourceAcquisitionComponent from "../components/source-acquisition-component.vue";
import quickTerminalDialog from "@/components/quick-terminal-dialog.vue";
import { onBeforeRouteLeave } from "vue-router";
import { getAudioFileTime } from "../components/playUtil";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const $useRouter = useRouter();
const $useRoute: any = useRoute();

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>();
const musicSelect: any = ref([]); //播放配置选中的音频文件
const priorityData = ref(new Map()); //优先级
const ruleForm: any = reactive({
  type: 4, //任务类型；快捷音源&远程播放走非本地http协议；其余本地http协议。
  name: "", //任务名称
  serverIP: localStorage.get("serverIP"), //服务器IP
  userID: localStorage.get("LoginUserID"), //用户ID
  // 优先级：
  // 1. 快捷音源：对应的是当前选中的快捷音源里面的任务类型是什么，其优先级就是根据它的任务类型去选着
  // 2. 音乐播放与远程任务，对应的也是web端的音乐播放的优先级
  // 3. 文本播放就是正常对应web端的文本播放
  // 4. 声源采集是根据其下一级选中的是声卡还是终端采集分别对应web端的声卡采集，终端采集
  priority: 50, //任务优先级
  volume: 70, //任务音量
  fast_sound_id: 0, //快捷音源id
  content: [], //音乐路径集合
  medias: [], //已选择的媒体文件
  medias_groups: [], //已选择的媒体媒体文件夹
  sound_source: {},
});
const showSearch = ref(false); // 是否显示搜索弹窗
const fast_terminals_id = ref(); //快捷终端id
const terminals = ref([]); //终端id集合
const terminals_groups = ref([]); //终端分组id集合
const executionregiontype = ref(0); //执行区域类型 0：快捷终端 1：普通终端
const tsctFormData = ref({
  enabledplayfun: false,
  is_txt: true,
  repeattime: 1,
  ttscontent: "",
  ttsenginename: "",
  ttsspeed: 5,
  txtpath: "",
}); //文本播放表单数据
const quickTerminaName = ref(proxy.$t("Please select a shortcut terminal"));
const soundSourceForm: any = ref({}); //快捷音源表单数据
const musicPlayForm: any = ref({}); //音乐播放表单数据
const remotePlayForm: any = ref({}); //远程播放表单数据
const sourAcquisiFrom: any = ref({}); //音源采集表单数据
const responseTerminals = ref([]); //已选择的终端数据
const responseGroups = ref([]); //已选择的终端数组
const responseMedia = ref([]); //已选择的媒体文件
const responseeMediaGroups = ref([]); //已选择的媒体媒体文件夹
const requestMusicConfig = ref({}); //音乐播放配置
const requestTaskConfig = ref({}); //文本播放配置
const taskDataDetailed = ref({});
const dialogVisible = ref(false);
const typeOptions = [
  { label: proxy.$t("Fast sound source"), value: 4, type: 1 },
  { label: proxy.$t("Music play"), value: 10, type: 2 },
  { label: proxy.$t("Remote play"), value: 1, type: 1 },
  { label: proxy.$t("Text play"), value: 11, type: 2 },
  { label: proxy.$t("Sound source acquisition"), value: 12, type: 2 },
];
const typePriorityNum = ref(1);
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

const changeSoundType = (soundType: number) => {
  typePriorityNum.value = soundType;
  getPrioritySetting();
};
const ruleFormRef = ref<FormInstance>();
// 验证
const validateName = (rule: any, value: any, callback: any) => {
  ruleForm.name = value = useRegex.replaceEmojiSpaces(value);
  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateName(value)) {
    return callback(
      new Error(proxy.$t("The name does not conform to the rule"))
    );
  }
  return callback();
};
const rules = reactive({
  name: [{ validator: validateName, trigger: "blur" }],
});

// 删除选中音频
const deteleSelectMusic = () => {
  let dataPatch: any[] = musicSelect.value.map((item: any) => {
    return item.path;
  });
  ruleForm.content = ruleForm.content?.filter((item: any) => {
    return dataPatch.includes(item.path) === false;
  });
  fileList.value = fileList.value?.filter((item: any) => {
    return dataPatch.includes(item.raw.path) === false;
  });
};
// 删除单个音频
const deteleOneMusic = (row: any) => {
  ruleForm.content = ruleForm.content?.filter((item: any) => {
    return item.path !== row.path;
  });
  fileList.value = fileList.value?.filter((item: any) => {
    return item.raw.path !== row.path;
  });
};
// 时长返回后，再次触发
const getTime = ref(0);
// 选中文件时触发
const uploadChange: UploadProps["onChange"] = (uploadFile: any) => {
  uploadFile = getAudioFileTime(uploadFile, () => {
    getTime.value++;
  });
};

watch(getTime, () => {
  const dataPatch: any = {};
  ruleForm.content.map((item: any, index: number) => {
    dataPatch[item.path] = index + 1; // 消除0的可能
  });
  fileList.value?.forEach((item: any) => {
    if (!dataPatch[item.raw.path]) {
      ruleForm.content.push({
        name: item.name,
        path: item.raw.path,
        time: item.time,
      });
    } else {
      ruleForm.content[dataPatch[item.raw.path] - 1].time = item.time;
    }
  });
});
// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
  typePriorityNum.value = data.type;
  soundSourceForm.value = JSON.parse(JSON.stringify(data));
  ruleForm.fast_sound_id = data.id;
  delete soundSourceForm.value?.id;
};
// 选择的音乐播放配置
const requestDispose = (data: any) => {
  musicPlayForm.value = data;
};
// 选择的远程播放表单配置
const requestRemotePlay = (data: any) => {
  remotePlayForm.value = data;
};
// 选择音源采集配置
const requestSourceAcquisition = (data: any) => {
  sourAcquisiFrom.value = data;
  // typePriority中，1是远程播放，2是声卡采集，3是终端采集，
  typePriorityNum.value = data.type === 1 ? 2 : 3;
};
// 选中的快捷终端
const handleSelectedConfigure = (data: any) => {
  fast_terminals_id.value = data.id;
  quickTerminaName.value = data.name;
};
// 选择的终端
const requestTerminals = (data: any) => {
  terminals.value = data;
};
// 选择的终端分组
const requestGroups = (data: any) => {
  terminals_groups.value = data;
};
// 提交任务并播放
const submitTaskPlay = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (!executionregiontype.value && !fast_terminals_id.value)
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select a shortcut terminal"),
          grouping: true,
        });
      if (
        executionregiontype.value &&
        terminals.value.length === 0 &&
        terminals_groups.value.length === 0
      ) {
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select a terminal or group"),
          grouping: true,
        });
      }

      let data = getBasicData();
      if (ruleForm.type === 10) {
        createLocalAudio(data, true);
      } else if (ruleForm.type === 11) {
        createTxstPlay(data, true);
      } else if (ruleForm.type === 1) {
        createRemteTask(data, true);
      } else if (ruleForm.type === 12) {
        createSoundSourceCollection(data, true);
      } else {
        createQuickSou(data, true);
      }
    }
  });
};
// 提交任务
const submitTask = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (!executionregiontype.value && !fast_terminals_id.value)
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select a shortcut terminal"),
          grouping: true,
        });
      if (
        executionregiontype.value &&
        terminals.value.length === 0 &&
        terminals_groups.value.length === 0
      ) {
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select a terminal or group"),
          grouping: true,
        });
      }
      let data = getBasicData();

      if (ruleForm.type === 10) {
        createLocalAudio(data);
      } else if (ruleForm.type === 11) {
        createTxstPlay(data);
      } else if (ruleForm.type === 1) {
        createRemteTask(data);
      } else if (ruleForm.type === 12) {
        createSoundSourceCollection(data);
      } else {
        createQuickSou(data);
      }
    }
  });
};
const getBasicData = () => {
  let data = Object.assign(ruleForm, {
    fast_terminals_id:
      executionregiontype.value !== 0 ? 0 : fast_terminals_id.value,
    terminals: executionregiontype.value ? terminals.value : [],
    terminals_groups: executionregiontype.value ? terminals_groups.value : [],
  });
  return data;
};
// 快捷音源任务
const createQuickSou = (data: any, isPlay?: boolean) => {
  return new Promise((resolve, reject) => {
    if (!ruleForm.fast_sound_id)
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select a shortcut sound source"),
        grouping: true,
      });
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
      proxy.$http
        .put(
          "/broadcasting/" + $useRoute.query.id,
          Object.assign(data, {
            sound_source: soundSourceForm.value,
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    } else {
      proxy.$http
        .post(
          "/broadcasting",
          Object.assign(data, {
            sound_source: soundSourceForm.value,
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    }
  });
};
// 音乐播放任务
const createLocalAudio = (data: any, isPlay?: boolean) => {
  return new Promise((resolve, reject) => {
    if (ruleForm.content.length === 0)
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select a media file"),
        grouping: true,
      });
    if (
      musicPlayForm.value?.play_model !== 0 &&
      musicPlayForm.value?.life_time === "00:00:00"
    )
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select the duration"),
        grouping: true,
      });
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
      proxy.$http1
        .put(
          "/task",
          Object.assign(data, musicPlayForm.value, {
            id: Number($useRoute.query.id),
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    } else {
      proxy.$http1
        .post("/task", Object.assign(data, musicPlayForm.value))
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    }
  });
};
// 远程播放
const createRemteTask = (data: any, isPlay?: boolean) => {
  return new Promise((resolve, reject) => {
    if (ruleForm.medias.length === 0 && ruleForm.medias_groups.length === 0)
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select a media file"),
        grouping: true,
      });
    if (
      remotePlayForm.value?.play_model !== 0 &&
      remotePlayForm.value?.life_time === "00:00:00"
    )
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select the duration"),
        grouping: true,
      });

    if ($useRoute.query.id && $useRoute.query.id !== "0") {
      proxy.$http
        .put(
          "/broadcasting/" + $useRoute.query.id,
          Object.assign(data, {
            sound_source: remotePlayForm.value,
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    } else {
      proxy.$http
        .post(
          "/broadcasting",
          Object.assign(data, {
            sound_source: remotePlayForm.value,
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    }
  });
};
// 文本播放
const createTxstPlay = (data: any, isPlay?: boolean) => {
  return new Promise((resolve, reject) => {
    if (tsctFormData.value.is_txt && tsctFormData.value.txtpath === "")
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select a path"),
        grouping: true,
      });
    if (!tsctFormData.value.is_txt && tsctFormData.value.ttscontent === "")
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please enter the text content"),
        grouping: true,
      });
    if (!tsctFormData.value.ttsenginename)
      return proxy.$message({
        type: "warning",
        message: proxy.$t("Please select to play voice"),
        grouping: true,
      });

    if ($useRoute.query.id && $useRoute.query.id !== "0") {
      proxy.$http1
        .put(
          "/task",
          Object.assign(data, {
            content: tsctFormData.value,
            id: Number($useRoute.query.id),
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    } else {
      proxy.$http1
        .post(
          "/task",
          Object.assign(data, {
            content: tsctFormData.value,
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    }
  });
};
// 音源采集
const createSoundSourceCollection = (data: any, isPlay?: boolean) => {
  return new Promise((resolve, reject) => {
    let fromData: any = {
      audioQuality: sourAcquisiFrom.value.audioQuality,
    };

    if (sourAcquisiFrom.value.type === 1) {
      if (
        sourAcquisiFrom.value.selectVal === "" ||
        sourAcquisiFrom.value.selectVal.id ||
        JSON.stringify(sourAcquisiFrom.value.selectVal) === "{}"
      )
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select a sound card"),
          grouping: true,
        });
      if (
        sourAcquisiFrom.value.record &&
        sourAcquisiFrom.value.recordpath === ""
      )
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select the recording saving path"),
          grouping: true,
        });
      fromData["soundcard"] = sourAcquisiFrom.value.selectVal;
      fromData["record"] = sourAcquisiFrom.value.record;
      fromData["recordpath"] = sourAcquisiFrom.value.recordpath;
    } else {
      if (
        sourAcquisiFrom.value.selectVal === "" ||
        !sourAcquisiFrom.value.selectVal.id
      )
        return proxy.$message({
          type: "warning",
          message: proxy.$t("Please select the acquisition terminal"),
          grouping: true,
        });
      fromData["terminalID"] = sourAcquisiFrom.value.selectVal.id;
    }

    let submitFrom = Object.assign(
      {},
      data,
      {
        content: fromData,
      },
      {
        type: sourAcquisiFrom.value.type === 1 ? 12 : 13,
      }
    );
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
      proxy.$http1
        .put(
          "/task",
          Object.assign(submitFrom, {
            id: Number($useRoute.query.id),
          })
        )
        .then((result: any) => {
          if (result.result === 200) {
            resolve(result.data);
            if (isPlay) {
              $useRouter.push({
                name: "play",
                query: result.data,
              });
            } else {
              $useRouter.push("/play");
            }
          } else {
            proxy.$message({
              type: "error",
              message:
                result.data.message === "任务名称已存在."
                  ? proxy.$t("Name already exists")
                  : proxy.$t(result.data.message),
              grouping: true,
            });
          }
        });
    } else {
      proxy.$http1.post("/task", submitFrom).then((result: any) => {
        if (result.result === 200) {
          resolve(result.data);
          if (isPlay) {
            $useRouter.push({
              name: "play",
              query: result.data,
            });
          } else {
            $useRouter.push("/play");
          }
        } else {
          proxy.$message({
            type: "error",
            message:
              result.data.message === "任务名称已存在."
                ? proxy.$t("Name already exists")
                : proxy.$t(result.data.message),
            grouping: true,
          });
        }
      });
    }
  });
};
// 请求本地任务
const getLocalTask = (row: any) => {
  proxy.$http1.get("/task/" + row).then((result: any) => {
    requestTaskConfig.value = result.data;
    ruleForm.type = result.data.type;
    ruleForm.name = result.data.name;
    ruleForm.volume = result.data.volume;
    ruleForm.priority = result.data.priority;
    typePriorityNum.value = result.data.type;
    if (ruleForm.type === 13) {
      ruleForm.type = 12;
    }
    if (ruleForm.type === 10) {
      ruleForm.content = result.data.content || [];
      requestMusicConfig.value = {
        life_time: result.data.life_time,
        play_model: result.data.play_model,
        play_number: result.data.play_number,
      };
    }
    if (result.data.fast_terminals_id === 0) {
      executionregiontype.value = 1;
    } else {
      fast_terminals_id.value = result.data.fast_terminals?.id;
      quickTerminaName.value = result.data.fast_terminals?.name;
    }
    if (result.data.terminals && result.data.fast_terminals_id === 0) {
      responseTerminals.value = result.data.terminals;
    }
    if (result.data.terminals_groups && result.data.fast_terminals_id === 0) {
      responseGroups.value = result.data.terminals_groups;
    }
  });
};
// 请求服务器任务
const getServeTask = (row: any) => {
  proxy.$http
    .get("/broadcasting/" + row, {
      params: {
        withMedias: true,
        withGroups: true,
        withFastSound: true,
        withTerminals: true,
        withFastTerminal: true,
      },
    })
    .then((result: any) => {
      taskDataDetailed.value = result.data;
      ruleForm.type = result.data.type;
      ruleForm.name = result.data.name;
      ruleForm.volume = result.data.volume;
      ruleForm.priority = result.data.priority;
      ruleForm.sound_source = result.data.sound_source;
      if (result.data.fast_terminals_id === 0) {
        executionregiontype.value = 1;
      } else {
        fast_terminals_id.value = result.data.fast_terminals?.id;
        quickTerminaName.value = result.data.fast_terminals?.name;
      }
      if (ruleForm.type === 1) {
        responseMedia.value = result.data.medias;
        responseeMediaGroups.value = result.data.medias_groups;
      }
      responseTerminals.value = result.data.terminals;
      responseGroups.value = result.data.terminals_groups;
    });
};
// 获取所有系统优先级
const getPrioritySetting = () => {
  return new Promise((resolve, reject) => {
    proxy.$http.get("/priority-setting").then((res: any) => {
      if (res.result === 200) {
        let mapData = new Map();
        res.data.forEach((item: { task_type: number; priority: number }) => {
          mapData.set(item.task_type, item.priority);
        });
        priorityData.value = mapData;
        resolve(res.data);
      } else {
        reject();
      }
    });
  });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  if ($useRoute.query.id && $useRoute.query.id !== "0") {
    getPrioritySetting().then(() => {
      if ($useRoute.query.type < 10) {
        getServeTask($useRoute.query.id);
      } else {
        getLocalTask($useRoute.query.id);
      }
    });
  } else {
    getPrioritySetting();
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (to.path === "/play" || to.path === "/") {
    next();
  } else {
    ElMessageBox.confirm(proxy.$t("Exit page prompt"), proxy.$t("Tips"), {
      confirmButtonText: proxy.$t("Determine"),
      cancelButtonText: proxy.$t("Cancel"),
      type: "warning",
    }).then(() => {
      next();
    });
  }
});
</script>

<style lang="scss">
.com-add-edit-play-task {
  height: calc(100% - 68px);

  .from-alert {
    padding: 14px 0;
    border-bottom: 1px solid #e0e2e3;

    span {
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #6f95c1;
    }
  }

  .configure-level {
    padding: 8px 40px 20px 40px;

    .configure-level-content {
      padding-top: 22px;
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }

    .selection-title {
      padding: 8px 0;
      color: #666666;
    }

    .quick-terminal-selection {
      position: relative;

      .el-input {
        width: 100%;
      }

      .el-input.is-disabled .el-input__wrapper {
        background-color: #fff;
      }

      .iconfont {
        position: absolute;
        right: -20px;
        color: #0070ee;
        line-height: 32px;
        cursor: pointer;
      }
    }
  }

  .play-task-form-inline {
    overflow: hidden;

    .el-form-item {
      .el-form-item__content {
        .el-select,
        .el-input-number {
          width: 100%;
        }
      }
    }
    .custom-form-input {
      .el-input-number {
        width: calc(100% - 50px) !important;
      }
    }

    .fast-sound-source {
      width: 100%;
      position: relative;

      .el-input.is-disabled .el-input__wrapper {
        background-color: #fff;
      }

      .iconfont {
        position: absolute;
        right: -20px;
        color: #0070ee;
        cursor: pointer;
      }
    }

    .icon-tips {
      position: absolute;
      top: -35px;
      left: -20px;
    }
  }

  .play-task-configure-music {
    float: right;

    span {
      font-size: 20px;
      color: #9cbad4;
      margin-left: 22px;
      cursor: pointer;

      &:hover {
        color: #0070ee;
      }
    }

    .upload-demo {
      display: inline-block;
    }
  }

  .add-edit-bottom-button {
    position: fixed;
    bottom: 0;
    left: 136px;
    width: calc(100% - 136px);
    height: 68px;
    border-top: 1px solid #e0e2e3;
    text-align: right;

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 6px 20px;
      border-radius: 4px;
      margin-right: 10px;
      color: #ffffff;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      cursor: pointer;

      &:last-child {
        margin-right: 40px;
      }
    }

    .button-cancel {
      color: #7992d5;
      background-color: #e1eafd;
    }

    .button-submit {
      background-color: #0070ee;
    }
  }
}
</style>
