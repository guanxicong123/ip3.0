<!-- 
  @Author: hmf
  @CreateDate: 2022-08-15
  @FilePath: src\components\select_components\select_sound_source_collection_radio.vue
  @Describe: 选择音源采集
-->
<template>
  <div class="com-select-sound-source-collection">
    <div class="com-select-left">
      <div class="custom-title">音源</div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="item in form.allSoundSourceData" :key="item.id">
              <li
                @click="handleCurrentClickGroups(item)"
                :class="{ selected: form.currentGroupsID === item.id }"
              >
                {{ item.name }}
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right" v-show="form.currentGroupsID === 2">
      <div class="custom-title">
        <div
          v-for="(item, index) in config.showSoundCardColumn"
          :key="index"
          :style="item.style"
        >
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="(item, index) in form.allSoundCardData" :key="index">
              <li
                @click="handleSelectedSoundSource(item)"
                :class="{
                  selected: form.selectedSoundSourceData?.name === item.name,
                }"
              >
                <div
                  class="icon-font-select"
                  v-if="form.selectedSoundSourceData?.name === item.name"
                >
                  <el-icon class="theme"><Select /></el-icon>
                </div>
                <div
                  v-for="(row, key) in config.showSoundCardColumn"
                  :key="key"
                  :style="row.style"
                  :title="item[row.column]"
                >
                  <span>
                    {{ row.column === "key" ? index + 1 : item[row.column] }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right" v-show="form.currentGroupsID === 3">
      <div class="custom-title">
        <div
          v-for="(item, index) in config.showAcquisitionColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchAcquisitionVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchAcquisitionVisible = !form.selectedSearchAcquisitionVisible
              "
              v-if="item.column === config.searchColumnName"
            >
              <Search />
            </el-icon>
            <span>
              {{ item.text }}
            </span>
          </template>
          <span v-else>
            <el-input
              class="title-search-input"
              v-model="form.selectedSearchAcquisition"
              placeholder="终端名称/终端IP"
              maxlength="100"
              clearable
              @input="handleSelectedTerminalsSearch"
            />
            <i
              class="iconfont icon-execution-failed delete"
              @click="handleClickCloSesearchInput"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template
              v-for="(item, index) in form.allAcquisitionTerminalData"
              :key="item.id"
            >
              <li
                @click="handleSelectedSoundSource(item)"
                :class="{
                  selected: form.selectedSoundSourceData?.name === item.name,
                }"
                v-show="
                  !form.selectedSearchAcquisitionVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchAcquisitionReg
                  ) ||
                  item[config.searchColumnIP].match(form.selectedSearchAcquisitionReg)
                "
              >
                <div
                  class="icon-font-select"
                  v-if="form.selectedSoundSourceData?.name === item.name"
                >
                  <el-icon class="theme"><Select /></el-icon>
                </div>
                <div
                  v-for="(row, key) in config.showAcquisitionColumn"
                  :key="key"
                  :style="row.style"
                  :title="item[row.column]"
                >
                  <span>
                    {{ row.column === "key" ? index + 1 : item[row.column] }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { TerminalsService } from "@/utils/api/device/index";
import { isArray } from "@/utils/is";

// 声明触发事件
const emit = defineEmits([
  "requestSoundSource", // 更新传递已选择的音源数据，用于父组件进行数据交互
  "requestType", // 更新传递已选择的音源数据类型，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseSoundSource", // 编辑界面传递回来的音源数据，用于展示组件的已选择状态
  "responseType", // 编辑界面传递回来的音源类型，用于展示组件的已选择状态
]);

const TTS = getStore.useTTSStore();
// 计算属性 computed
const TTSStore = computed(() => {
  return TTS.allAudioCard;
});

const form = reactive<any>({
  allSoundSourceData: [
    { id: 2, name: "声卡" },
    { id: 3, name: "采集终端" },
  ],
  currentGroupsID: 2, // 当前选择的分组id
  selectedSearchAcquisition: "", // 搜索采集终端
  selectedSearchAcquisitionReg: /.*/,
  selectedSearchAcquisitionVisible: false, // 是否显示已选择采集终端的搜索框
  allSoundCardData: [], // 所有声卡数据
  allAcquisitionTerminalData: [], // 所有采集终端数据
  selectedSoundSourceData: {}, // 已选择的音源数据
});
// 插件配置
let config = reactive<any>({
  showSoundCardColumn: [
    // 要显示的列(声卡） column列名 text列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: "声卡",
      style: { width: "85%" },
    },
  ],
  showAcquisitionColumn: [
    // 要显示的列(采集终端) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: "终端名称",
      style: { width: "55%" },
    },
    {
      column: "ip_address",
      text: "终端IP",
      style: { width: "30%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  searchColumnIP: "ip_address", // 搜索的列名
  soundSourceSoundCard: true, // 是否可以选择音源采集-声卡
});
// 处理当前点击选择分组
const handleCurrentClickGroups = (item: { id: number }) => {
  form.currentGroupsID = item.id;
  emit("requestType", item.id);
};
// 处理已选择的音源数据
const handleSelectedSoundSource = (item: any) => {
  form.selectedSoundSourceData = item;
  emit("requestSoundSource", item);
};
// 处理已选终端搜索
const handleSelectedTerminalsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchAcquisition);
  form.selectedSearchAcquisitionReg = new RegExp(string, "gmi");
};
// 处理点击关闭已选择终端的搜索框
const handleClickCloSesearchInput = () => {
  // form.selectedSearchAcquisition = "";
  form.selectedSearchAcquisitionVisible = false;
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
  if (!parentData.responseSoundSource) {
    return;
  }
  if (parentData.responseType > 1) {
    form.currentGroupsID = parentData.responseType;
    const data = parentData?.responseSoundSource;
    form.selectedSoundSourceData = {
      id: data.terminals_id,
      name: parentData?.responseType === 2 ? data.sound_card : data.terminals_name,
      type: form.currentGroupsID,
    };
    emit("requestType", form.currentGroupsID);
    emit("requestSoundSource", form.selectedSoundSourceData);
  }
};
// 处理获取全部终端
const handleGetAllTerminals = async () => {
  await TerminalsService.getAllTerminals({
    withGroups: true,
    terminals_type: 3, // 3：采集终端
  })
    .then((result) => {
      if (result.data) {
        if (isArray(result.data)) {
          form.allAcquisitionTerminalData = result.data;
        }
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// 监听变化
watch(
  () => [parentData, TTSStore.value],
  ([newData, newTTS]) => {
    if (newTTS) {
      return (form.allSoundCardData = newTTS);
    }
    if (newData.myConfig?.soundSourceSoundCard == false) {
      form.allSoundSourceData = form.allSoundSourceData.filter((item: { id: number }) => {
        return item.id !== 2;
      });
      form.currentGroupsID = 3;
    }
    setCurrentTabSelectStatus();
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
  form.allSoundCardData = TTSStore.value;
  handleGetAllTerminals();
  setCurrentTabSelectStatus();
});
</script>

<style lang="scss" scoped>
.com-select-sound-source-collection {
  position: relative;
  display: flex;
  align-items: center;
  height: 300px;
  .com-select-left {
    width: 300px;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #ddd;
    .custom-title {
      padding: 0 20px;
      justify-content: center;
    }
  }
  .com-select-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 312px);
    height: 100%;
    margin-left: 12px;
    border-radius: 2px;
    border: 1px solid #ddd;
    .custom-content {
      .scroll-ul {
        li {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 20px 0 40px;
          > div {
            span {
              display: block;
              width: 100%;
              padding: 0 5px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .icon-font-select {
            position: absolute;
            top: 0;
            left: 12px;
          }
        }
      }
    }
  }
  .custom-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px 0 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    > div {
      span {
        display: inline-block;
        width: 90%;
        padding: 0 5px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    i {
      font-size: 16px;
    }
    .el-icon:hover {
      color: $c-theme;
    }
    .title-search-input {
      width: 80%;
      margin-right: 10px;
    }
  }
  .custom-content {
    flex: 1;
    height: calc(100% - 40px);
    .scroll-ul {
      li {
        line-height: 40px;
        padding: 0 15px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          background-color: #eee;
          cursor: pointer;
        }
      }
    }
    .selected {
      background-color: #eee;
    }
  }
}
</style>
