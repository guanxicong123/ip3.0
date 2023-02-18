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
    <div class="com-select-right" v-show="form.currentGroupsID === 1">
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
            <template
              v-for="(item, index) in form.allSoundCardData"
              :key="item.id"
            >
              <li
                @click="handleSelectedSoundSource(item)"
                :class="{
                  selected: form.selectedSoundSourceData === item,
                }"
              >
                <div
                  class="icon-font-select"
                  v-if="form.selectedSoundSourceData === item"
                >
                  <el-icon class="theme"><Select /></el-icon>
                </div>
                <div
                  v-for="(row, key) in config.showSoundCardColumn"
                  :key="key"
                  :style="row.style"
                  :title="item"
                >
                  <span>
                    {{ row.column === "key" ? index + 1 : item }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right" v-show="form.currentGroupsID === 2">
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
                form.selectedSearchAcquisitionVisible =
                  !form.selectedSearchAcquisitionVisible
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
              class="iconfont icon-clear delete"
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
                  selected: form.selectedSoundSourceData?.id === item.id,
                }"
                v-show="
                  !form.selectedSearchAcquisitionVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchAcquisitionReg
                  ) ||
                  item[config.searchColumnIP].match(
                    form.selectedSearchAcquisitionReg
                  )
                "
              >
                <div
                  class="icon-font-select"
                  v-if="form.selectedSoundSourceData?.id === item.id"
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
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
// 声明触发事件
const emit = defineEmits([
  "requestSoundSource", // 更新传递已选择的音源数据，用于父组件进行数据交互
  "requestType", // 更新传递已选择的音源数据类型，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseSoundSource", // 编辑界面传递回来的音源数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
  allSoundSourceData: [
    { id: 1, name: "声卡" },
    { id: 2, name: "采集终端" },
  ],
  currentGroupsID: 1, // 当前选择的分组id
  selectedSearchAcquisition: "", // 搜索采集终端
  selectedSearchAcquisitionReg: /.*/,
  selectedSearchAcquisitionVisible: false, // 是否显示已选择采集终端的搜索框
  allSoundCardData: [], // 所有声卡数据
  allAcquisitionTerminalData: [], // 所有采集终端数据
  selectedSoundSourceData: {}, // 已选择的音源数据
});

// watch(
//     () => parentData.responseSoundSource,
//     () => {
//         if (!parentData.responseSoundSource) {
//             return;
//         }
//         const isHasID = Object.prototype.hasOwnProperty.call(
//             parentData.responseSoundSource,
//             "id"
//         );
//         form.currentGroupsID = isHasID ? 2 : 1;
//         // form.selectedSoundSourceData = parentData.responseSoundSource;
//     }
// );
// 插件配置
let config = reactive<any>({
  showSoundCardColumn: [
    // 要显示的列(声卡） column列名 text列的别名 style 列的样式
    {
      column: "key",
      text: "序号",
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
      text: "序号",
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
});
// 处理当前已选择的类型
const handleCurrentClickGroups = (item: { id: number }) => {
  form.currentGroupsID = item.id;
  emit("requestType", item.id);
};
// 处理已选择的采集终端/声卡
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
  const isHasID = Object.prototype.hasOwnProperty.call(
    parentData.responseSoundSource,
    "id"
  );
  form.currentGroupsID = isHasID ? 2 : 1;
  form.selectedSoundSourceData = parentData.responseSoundSource;
  emit("requestSoundSource", form.selectedSoundSourceData);
};
// 获取所有终端(采集终端)
const getTerminalsAll = () => {
  return new Promise((resolve, reject) => {
    proxy.$http
      .get("/terminals/all", {
        params: {
          terminals_type: 3,
        },
      })
      .then((result: { result: number; data: any[] }) => {
        if (result.result === 200) {
          form.allAcquisitionTerminalData = result.data;
          resolve(result.data);
        }
      });
  });
};
// 获取本地声卡
const getSoundAll = () => {
  proxy.$http1.get("/sound").then((result: { result: number; data: any[] }) => {
    if (result.result === 200) {
      form.allSoundCardData = result.data;
    }
  });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  getSoundAll();
  setCurrentTabSelectStatus();
  getTerminalsAll().then((data: any) => {
    const isHasID = Object.prototype.hasOwnProperty.call(
      parentData.responseSoundSource,
      "id"
    );
    form.currentGroupsID = isHasID ? 2 : 1;
    if (isHasID) {
      let terimnalsData = data.filter((item: any) => {
        return item.id === parentData.responseSoundSource.id;
      })[0];
      handleSelectedSoundSource(terimnalsData);
    } else {
      handleSelectedSoundSource(parentData.responseSoundSource);
    }
  });
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
    background-color: #f4f9ff;

    .custom-title {
      height: 40px;
      margin: 10px 0px;
      padding: 0;
      justify-content: center;
      // background-color: #0070ee;
      border-radius: 6px;
      color: #333;
      font-weight: bold;
      // color: #ffffff;
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
    background-color: #f4f9ff;

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
        padding: 0 30px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &:hover {
          background-color: #e4f0ff;
          cursor: pointer;
        }
      }
    }

    .selected {
      background-color: #e4f0ff;
    }
  }
}
</style>
