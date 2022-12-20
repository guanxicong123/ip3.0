<!-- 
  @Author: hmf
  @CreateDate: 2022-08-26
  @FilePath: src\components\select_components\select_media_radio.vue
  @Describe: 选择媒体-单选
-->
<template>
  <div class="com-select-media-radio">
    <div class="com-select-left">
      <div class="custom-title">
        <template v-if="!form.selectedSearchGroupsVisible">
          <el-icon
            @click="
              form.selectedSearchGroupsVisible =
                !form.selectedSearchGroupsVisible
            "
          >
            <Search />
          </el-icon>
          <span> 媒体文件夹 </span>
        </template>
        <span v-else :class="{ span: form.selectedSearchGroupsVisible }">
          <el-input
            class="title-search-input"
            v-model="form.selectedSearchGroups"
            placeholder="媒体文件夹"
            maxlength="100"
            clearable
            @input="handleGourpsSearch"
          />
          <i
            class="iconfont icon-clear delete"
            @click="handleClickCloGroupSearch"
          ></i>
        </span>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="item in form.allGroupsData" :key="item.id">
              <li
                @click="handleCurrentClickGroups(item)"
                :class="{ selected: form.currentGroupsID === item.id }"
                v-show="
                  !form.selectedSearchGroupsVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchGroupsReg
                  )
                "
              >
                {{ item.name }}
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right">
      <div class="custom-title">
        <div
          v-for="(item, index) in config.showMediaColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchMediaVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchMediaVisible =
                  !form.selectedSearchMediaVisible
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
              v-model="form.selectedSearchMedia"
              placeholder="媒体名称"
              maxlength="100"
              clearable
              @input="handleSelectedMediaSearch"
            />
            <i
              class="iconfont icon-clear delete"
              @click="handleClickCloSearchTerminals"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="(item, index) in form.allMediaData" :key="item.id">
              <li
                @click="handleSelectedMedia(item)"
                :class="{
                  selected: form.selectedMediaData?.id === item.id,
                }"
                v-show="
                  !form.selectedSearchMediaVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchMediaReg
                  )
                "
              >
                <div
                  class="icon-font-select"
                  v-if="form.selectedMediaData?.id === item.id"
                >
                  <el-icon class="theme"><Select /></el-icon>
                </div>
                <div
                  v-for="(row, key) in config.showMediaColumn"
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
import { MeidaService } from "@/utils/api/media";
import { isArray } from "@/utils/is";

// 声明触发事件
const emit = defineEmits([
  "requestMedia", // 更新传递已选择的媒体数据，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseMedia", // 编辑界面传递回来的媒体数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
  allGroupsData: [], // 所有分组数据
  currentGroupsID: 0, // 当前选择的分组id
  selectedSearchGroups: "", // 搜索分组
  selectedSearchGroupsReg: /.*/,
  selectedSearchGroupsVisible: false, // 是否显示已选择分组的搜索框
  selectedSearchMedia: "", // 搜索媒体
  selectedSearchMediaReg: /.*/,
  selectedSearchMediaVisible: false, // 是否显示已选择媒体的搜索框
  allMediaData: [], // 所有媒体数据
  oldAllMediaData: [], // 所有旧的媒体数据
  selectedMediaData: {}, // 已选择的媒体数据
});
// 插件配置
let config = reactive<any>({
  showMediaColumn: [
    // 要显示的列(媒体文件夹) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: "媒体文件夹",
      style: { width: "85%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
});
// 处理当前点击选择分组
const handleCurrentClickGroups = (item: { id: number; medias: any[] }) => {
  form.currentGroupsID = item.id;
  form.allMediaData = item.id > 0 ? item.medias : form.oldAllMediaData;
};
// 处理分组名称搜索
const handleGourpsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchGroups);
  form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理点击关闭分组的搜索框
const handleClickCloGroupSearch = () => {
  // form.selectedSearchGroups = "";
  form.selectedSearchGroupsVisible = false;
};
// 处理已选择的媒体数据
const handleSelectedMedia = (item: any) => {
  form.selectedMediaData = item;
  emit("requestMedia", item);
};
// 处理已选媒体搜索
const handleSelectedMediaSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchMedia);
  form.selectedSearchMediaReg = new RegExp(string, "gmi");
};
// 处理点击关闭已选择媒体的搜索框
const handleClickCloSearchTerminals = () => {
  // form.selectedSearchMedia = "";
  form.selectedSearchMediaVisible = false;
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
  if (!parentData.responseMedia) {
    return;
  }
  form.selectedMediaData = parentData.responseMedia;
};
// 处理获取全部媒体
const handleGetAllMeida = async () => {
  await MeidaService.getAllMeida({
    withGroup: true,
  })
    .then((result) => {
      if (result.data) {
        if (isArray(result.data)) {
          form.allMediaData = result.data;
          form.oldAllMediaData = result.data;
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
// 处理获取全部分组
const handleGetAllGroups = async () => {
  await MeidaService.getAllMeidaGroup({
    withMedias: true,
  })
    .then((result) => {
      if (result.data) {
        if (isArray(result.data)) {
          form.allGroupsData = [
            ...[{ id: 0, name: "所有媒体文件" }],
            ...result.data,
          ];
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

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(
    config,
    parentData.myConfig ? parentData.myConfig : {}
  );
  handleGetAllGroups();
  handleGetAllMeida();
  setCurrentTabSelectStatus();
});
</script>

<style lang="scss" scoped>
.com-select-media-radio {
  position: relative;
  display: flex;
  align-items: center;
  height: 380px;
  .com-select-left {
    width: 300px;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #ddd;
    .custom-title {
      padding: 0 20px;
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
