<!-- 
  @Author: hmf
  @CreateDate: 2022-08-16
  @FilePath: src\components\select_components\select_shortcut_sound_source_radio.vue
  @Describe: 选择快捷音源
-->
<template>
  <div class="com-select-shortcut-sound-source">
    <div class="com-select-left">
      <div class="custom-title">
        <template v-if="!form.searchConfigureVisible">
          <el-icon @click="form.searchConfigureVisible = !form.searchConfigureVisible">
            <Search />
          </el-icon>
          <span> {{ $t("Configuration name") }} </span>
        </template>
        <span v-else :class="{ span: form.searchConfigureVisible }">
          <el-input
            class="title-search-input"
            v-model="form.searchConfigure"
            :placeholder="$t('Configuration name')"
            maxlength="100"
            clearable
            @input="handleConfigureSearch"
          />
          <i
            class="iconfont icon-execution-failed delete"
            @click="handleClickCloSesearchInput"
          ></i>
        </span>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="item in form.allConfigureData" :key="item.id">
              <li
                @click="handleSelectedConfigure(item)"
                :class="{ selected: form.selectedConfigureData.id === item.id }"
                v-show="
                  !form.searchConfigureVisible ||
                  item[config.searchColumnName].match(form.searchConfigureReg)
                "
              >
                {{ item.name }}
                <div
                  class="icon-font-select"
                  v-if="form.selectedConfigureData.id === item.id"
                >
                  <el-icon class="theme"><Select /></el-icon>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right" v-show="form.selectedConfigureData.type === 1">
      <div class="custom-title">
        {{ config.musicTitle }}
      </div>
      <div class="custom-title">
        <div
          v-for="(item, index) in config.showMediaColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchConfigureVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchConfigureVisible = !form.selectedSearchConfigureVisible
              "
              v-if="item.column === config.searchColumnName"
            >
              <Search />
            </el-icon>
            <span>{{ item.text }}</span>
          </template>
          <span v-else>
            <el-input
              class="title-search-input"
              v-model="form.selectedSearchConfigure"
              :placeholder="$t('Media') + '/' + $t('Media folder')"
              maxlength="100"
              clearable
              @input="handleSelectedConfigureSearch"
            />
            <i
              class="iconfont icon-execution-failed delete"
              @click="handleClickCloSelectedSesearch"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template
              v-for="(item, index) in form.selectedConfigureData?.all_data"
              :key="item.id"
            >
              <li
                v-show="
                  !form.selectedSearchConfigureVisible ||
                  item[config.searchColumnName].match(form.selectedSearchConfigureReg)
                "
              >
                <div
                  v-for="(row, key) in config.showMediaColumn"
                  :key="key"
                  :style="row.style"
                  :title="item[row.column]"
                >
                  <span>
                    {{
                      row.column === "key"
                        ? index + 1
                        : row.column === "list" && item.hasOwnProperty("medias_id")
                        ? "-"
                        : item[row.column]
                    }}
                    <view-components-popover
                      v-if="row.column === 'list' && !item.hasOwnProperty('medias_id')"
                      :myConfig="mediaConfig"
                      :url="'/medias'"
                      :mediasGroupsID="item.id"
                    />
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right" v-show="form.selectedConfigureData.type !== 1">
      <div class="custom-title">
        {{ config.soundSourceTitle }}
      </div>
      <div class="custom-content">
        <el-form-item :label="$t('Select sound source')">
          <div class="fast-source">
            {{
              form.selectedConfigureData?.fast_source?.terminals_name ||
              form.selectedConfigureData?.fast_source?.sound_card
            }}
          </div>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { FastSoundService } from "@/utils/api/sound_source";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits([
  "requestConfigure", // 更新传递已选择的配置数据，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseConfigure", // 编辑界面传递回来的配置数据，用于展示组件的已选择状态
  "soundType", // 获取音源类型数据
]);

const form = reactive<any>({
  allConfigureData: [], // 所有配置名称
  searchConfigure: "", // 搜索配置名称
  searchConfigureReg: /.*/,
  searchConfigureVisible: false, // 是否显示选择配置名称的搜索框
  selectedSearchConfigure: "", // 已选择配置名称-终端/分组名称
  selectedSearchConfigureReg: /.*/,
  selectedSearchConfigureVisible: false, // 是否显示已选择配置名称-终端/分组的搜索框
  selectedConfigureData: {
    id: 0,
    type: 1,
    medias: [],
    medias_groups: [],
    fast_source: {},
  }, // 已选择的配置数据
});
// 插件配置
let config = reactive<any>({
  showMediaColumn: [
    // 要显示的列(媒体/媒体文件夹) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Media") + "/" + proxy.$t("Media folder"),
      style: { width: "55%" },
    },
    {
      column: "list",
      text: proxy.$t("Media list"),
      style: { width: "30%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  musicTitle: proxy.$t("Music play"), // 标题名
  soundSourceTitle: proxy.$t("Sound source acquisition"), // 标题名
});
// 处理已选择的配置数据
const handleSelectedConfigure = (item: any) => {
  form.selectedConfigureData = item;
  emit("requestConfigure", item);
};
// 处理配置名称搜索
const handleConfigureSearch = () => {
  let string = useRegex.replaceRegString(form.searchConfigure);
  form.searchConfigureReg = new RegExp(string, "gmi");
};
// 处理已选择配置名称-媒体/媒体文件夹搜索
const handleSelectedConfigureSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchConfigure);
  form.selectedSearchConfigureReg = new RegExp(string, "gmi");
};
// 处理点击关闭已选择终端的搜索框
const handleClickCloSesearchInput = () => {
  // form.searchConfigure = "";
  form.searchConfigureVisible = false;
};
// 处理点击关闭已选择配置名称-媒体/媒体文件夹搜索框
const handleClickCloSelectedSesearch = () => {
  // form.selectedSearchConfigure = "";
  form.selectedSearchConfigureVisible = false;
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = (data: any) => {
  if (!data) {
    return handleSelectedConfigure(form.allConfigureData?.[0]);
  }
  form.allConfigureData.some((item: { id: number }) => {
    if (item.id == data.id) {
      return handleSelectedConfigure(item);
    }
  });
};
// 处理获取所有快捷音源数据
const handleGetAllFastSound = async () => {
  form.loading = true;
  await FastSoundService.getAllFastSound({
    withMedias: true,
    type: parentData.soundType || 0,
  })
    .then((result) => {
      if (result.data) {
        // type: 1:音乐播放，2：声卡采集，3：终端采集
        result.data?.forEach(
          (item: { all_data: any[]; medias: any; medias_groups: any }) => {
            item.all_data = [...item.medias, ...item.medias_groups];
          }
        );
        form.allConfigureData = result.data;
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
      form.loading = false;
    })
    .catch((error) => {
      form.loading = false;
      console.log(error);
    });
  setCurrentTabSelectStatus(parentData.responseConfigure);
};
// 查看组件插件配置
const mediaConfig = useConfig.mediaConfig;

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
  handleGetAllFastSound();
});
</script>

<style lang="scss" scoped>
.com-select-shortcut-sound-source {
  position: relative;
  display: flex;
  align-items: center;
  height: 300px;
  .com-select-left {
    width: 300px;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .custom-title {
      justify-content: center;
      .title-search-input {
        width: 90%;
      }
      .el-icon {
        margin-right: 5px;
      }
      .span {
        width: 100%;
      }
    }
    .custom-content {
      .scroll-ul {
        li {
          padding-right: 40px;
          cursor: pointer;
        }
        .icon-font-select {
          position: absolute;
          top: 0;
          right: 15px;
        }
      }
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
    box-sizing: border-box;
    .custom-content {
      height: calc(100% - 80px);
      .scroll-ul {
        li {
          display: flex;
          align-items: center;
          > div {
            overflow: hidden;
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
        }
      }
    }
  }
  .custom-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 15px;
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
      cursor: pointer;
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
        position: relative;
        line-height: 40px;
        padding: 0 15px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          background-color: #eee;
        }
      }
    }
    .selected {
      background-color: #eee;
    }
  }
  .el-form-item {
    padding: 20px 15px 0;
  }
  .fast-source {
    min-width: 220px;
    padding: 0 10px;
    background-color: var(--el-disabled-bg-color);
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  }
}
</style>
