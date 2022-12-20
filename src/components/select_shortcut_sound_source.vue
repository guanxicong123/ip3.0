<!-- 
  @Author: hmf
  @CreateDate: 2022-08-17
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
          <span> 配置名称 </span>
        </template>
        <span v-else :class="{ span: form.searchConfigureVisible }">
          <el-input
            class="title-search-input"
            v-model="form.searchConfigure"
            placeholder="配置名称"
            maxlength="100"
            clearable
            @input="handleConfigureSearch"
          />
          <i
            class="iconfont icon-clear delete"
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
              placeholder="媒体/媒体文件夹"
              maxlength="100"
              clearable
              @input="handleSelectedConfigureSearch"
            />
            <i
              class="iconfont icon-clear delete"
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
                  <span
                    :class="{
                      'iconfont icon-terminals1':
                        row.column === 'list' && !item.hasOwnProperty('medias_id'),
                    }"
                    :title="
                      row.column === 'list' && !item.hasOwnProperty('medias_id')
                        ? '点击查看'
                        : ''
                    "
                  >
                    {{
                      row.column === "key"
                        ? index + 1
                        : row.column === "list" && item.hasOwnProperty("medias_id")
                        ? "-"
                        : item[row.column]
                    }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div
      class="com-select-right"
      v-show="[2, 3].includes(form.selectedConfigureData.type)"
    >
      <div class="custom-title">
        {{ form.selectedConfigureData.type === 2 ? "音源采集" : "终端采集" }}
      </div>
      <div class="custom-content">
        <el-form-item
          :label="form.selectedConfigureData.type === 2 ? '选择音源' : '选择终端'"
        >
          <div class="fast-source">
            {{
              form.selectedConfigureData.type === 2
                ? form.selectedConfigureData?.fast_source?.sound_card
                : form.selectedConfigureData?.fast_source?.terminals_name
            }}
          </div>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
    id: 1,
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
      text: "序号",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: "媒体/媒体文件夹",
      style: { width: "55%" },
    },
    {
      column: "list",
      text: "媒体列表",
      style: { width: "30%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  musicTitle: "音乐播放", // 标题名
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
const setCurrentTabSelectStatus = () => {
  if (!parentData.responseConfigure) {
    form.selectedConfigureData = form.allConfigureData?.[0];
    return;
  }
  form.selectedConfigureData = parentData.responseConfigure;
  form.selectedConfigureData.all_data =
    form.selectedConfigureData.type != 2 && form.selectedConfigureData.type != 3
      ? [
          ...form.selectedConfigureData.medias,
          ...form.selectedConfigureData.medias_groups,
        ]
      : [];
};
const getSoundSource = () => {
  return new Promise<void>((resolve, reject) => {
    proxy.$http
      .get("/fast-sound/all", {
        params: {
          withUser: true,
          withMedias: true,
        },
      })
      .then((result: any) => {
        if (result.result === 200) {
          form.allConfigureData = result.data.map((item: any) => {
            item.all_data =
              item.type != 2 && item.type != 3
                ? [...item.medias, ...item.medias_groups]
                : [];
            return item;
          });
          resolve();
        }
      });
  });
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  getSoundSource().then(() => {
    setCurrentTabSelectStatus();
  });
  config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
});
</script>

<style lang="scss" scoped>
.com-select-shortcut-sound-source {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%; //高度由引入组件模块设置

  .com-select-left {
    width: 260px;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #e7e7e7;
    background-color: #f4f9ff;
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
    border: 1px solid #e7e7e7;
    background-color: #f4f9ff;
    .custom-content {
      height: calc(100% - 80px);

      .scroll-ul {
        li {
          display: flex;
          align-items: center;

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
    border-bottom: 1px solid #e7e7e7;

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
        position: relative;
        line-height: 40px;
        padding: 0 15px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &:hover {
          background-color: #e4f0ff;
        }
      }
    }

    .selected {
      background-color: #e4f0ff;
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
