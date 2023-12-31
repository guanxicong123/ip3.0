<!-- 
  @Author: hmf
  @CreateDate: 2022-08-13
  @FilePath: src\components\select_components\select_media_group.vue
  @Describe: 选择媒体和媒体文件夹
-->
<template>
  <div class="com-select-media-group">
    <div class="com-select-left">
      <el-tabs
        type="border-card"
        class="select-left-tabs"
        :class="{ width: !config.isSelectGroups }"
        v-model="form.activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane name="first" v-if="config.isSelectMedia">
          <template #label>
            <div class="custom-tabs-label">
              <el-popover
                :visible="form.searchMediaVisible"
                placement="top-start"
                :width="260"
              >
                <template #reference>
                  <el-icon @click="handleClickMediaVisible">
                    <Search />
                  </el-icon>
                </template>
                <div class="custom-popover">
                  <el-input
                    v-model="form.searchMedia"
                    :placeholder="$t('Media')"
                    maxlength="100"
                    clearable
                    @input="handleMediaSearch"
                  />
                  <i
                    class="iconfont icon-execution-failed"
                    @click="handleClickClosePopover"
                  ></i>
                </div>
              </el-popover>
              <span>{{ config.mediaTitle }}</span>
            </div>
          </template>
          <div class="custom-scroll-bar">
            <div class="scroll-select">
              <el-select v-model="form.currentGroupsID" fit-input-width>
                <el-option :key="0" :label="$t('All files')" :value="0">
                  <span style="float: left">{{ $t("All files") }}</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >
                    {{ $t("Default") }}
                  </span>
                </el-option>
                <el-option
                  v-for="item in form.allGroupsOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="scroll-bar">
              <el-scrollbar>
                <ul class="scroll-ul">
                  <template v-for="item in form.allMediaData" :key="item.id">
                    <li
                      @click="selectTerminal(item)"
                      v-if="
                        form.currentGroupsID === 0 ||
                        item.medias_groups_id === form.currentGroupsID
                      "
                      v-show="
                        !form.searchMediaVisible ||
                        item[config.searchColumnName].match(form.searchMediaReg)
                      "
                    >
                      {{ item.name }}
                    </li>
                  </template>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second" v-if="config.isSelectGroups">
          <template #label>
            <div class="custom-tabs-label">
              <el-popover
                :visible="form.searchGroupsVisible"
                placement="top-start"
                :width="260"
              >
                <template #reference>
                  <el-icon @click="handleClickGroupsVisible">
                    <Search />
                  </el-icon>
                </template>
                <div class="custom-popover">
                  <el-input
                    v-model="form.searchGroups"
                    :placeholder="$t('Media folder')"
                    maxlength="100"
                    clearable
                    @input="handleGroupsSearch"
                  />
                  <i
                    class="iconfont icon-execution-failed"
                    @click="handleClickClosePopover"
                  ></i>
                </div>
              </el-popover>
              <span>{{ config.groupsTitle }}</span>
            </div>
          </template>
          <el-scrollbar>
            <ul class="scroll-ul">
              <template v-for="item in form.allGroupsData" :key="item.id">
                <li
                  @click="selectGroup(item)"
                  v-show="
                    !form.searchGroupsVisible ||
                    item[config.searchColumnName].match(form.searchGroupsReg)
                  "
                >
                  {{ item.name }}
                </li>
              </template>
            </ul>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="com-select-center">
      <span :title="$t('Move all right')" @click="selectAll">
        <el-icon><ArrowRight /></el-icon>
      </span>
      <span :title="$t('Move all left')" @click="deselectAll">
        <el-icon><ArrowLeft /></el-icon>
      </span>
    </div>
    <!-- 已选媒体 -->
    <div
      class="com-select-right"
      v-show="form.activeName === 'first'"
      v-if="config.isSelectMedia"
    >
      <div class="custom-right-title">
        <div
          v-for="(item, index) in config.showMediaColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName || !form.selectedSearchMediaVisible
            "
          >
            <el-icon
              @click="form.selectedSearchMediaVisible = !form.selectedSearchMediaVisible"
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
              :placeholder="$t('Media')"
              maxlength="100"
              clearable
              @input="handleSelectedMediaSearch"
            />
            <i
              class="iconfont icon-execution-failed delete"
              @click="handleClickCloSesearchInput"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-right-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="(item, index) in form.selectedMediaData" :key="item.id">
              <li
                v-show="
                  !form.selectedSearchMediaVisible ||
                  item[config.searchColumnName].match(form.selectedSearchMediaReg)
                "
                class="drag"
                draggable="true"
                @dragstart.stop="handleMediasDragStart($event, item)"
                @dragover.prevent="handleMediasDragOver($event)"
                @dragenter="handleMediasDragEnter($event, item)"
                @dragend="handleMediasDragEnd()"
              >
                <div class="item-media">
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
                  <div class="icon-font-delete">
                    <i
                      class="iconfont icon-execution-failed delete"
                      @click="deleteTerminal(item)"
                    ></i>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <!-- 已选媒体文件夹 -->
    <div
      class="com-select-right"
      v-show="form.activeName === 'second'"
      v-if="config.isSelectGroups"
    >
      <div class="custom-right-title">
        <div
          v-for="(item, index) in config.showMediaGroupsColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName || !form.selectedSearchGroupsVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchGroupsVisible = !form.selectedSearchGroupsVisible
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
              v-model="form.selectedSearchGroups"
              :placeholder="$t('Media folder')"
              maxlength="100"
              clearable
              @input="handleSelectedGroupsSearch"
            />
            <i
              class="iconfont icon-execution-failed delete"
              @click="handleClickCloSesearchInput"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-right-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="(item, index) in form.selectedGroupsData" :key="item.id">
              <li
                v-show="
                  !form.selectedSearchGroupsVisible ||
                  item[config.searchColumnName].match(form.selectedSearchGroupsReg)
                "
              >
                <div class="item-media">
                  <div
                    v-for="(row, key) in config.showMediaGroupsColumn"
                    :key="key"
                    :style="row.style"
                    :title="item[row.column]"
                  >
                    <span>
                      {{ row.column === "key" ? index + 1 : item[row.column] }}
                    </span>
                  </div>
                  <div class="icon-font-delete">
                    <i
                      class="iconfont icon-execution-failed delete"
                      @click="deleteGroup(item)"
                    ></i>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <p class="com-second-tip">
      {{ $t("Play time is about") }}:
      {{ usePublicMethod.convertSongDuration(form.mediaSecond + form.groupsSecond) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, TabsPaneContext } from "element-plus";
import usePublicMethod from "@/utils/global/index";
import { MeidaService } from "@/utils/api/media";
import { isArray } from "@/utils/is";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const systemStore = getStore.useSystemStore();

// 声明触发事件
const emit = defineEmits([
  "requestMedia", // 更新传递已选择的媒体数据，用于父组件进行数据交互
  "requestGroups", // 更新传递已选择的媒体文件夹数据，用于父组件进行数据交互
  "selectedMediaName", // 更新传递已选择的媒体数据名称，用于父组件进行数据交互
  "selectedGroupsName", // 更新传递已选择的媒体文件夹数据名称，用于父组件进行数据交互
  "totalSecond", // 已选择的媒体总时长-秒
  "loaded", // 更新传递所有数据加载完成，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseMedia", // 编辑界面传递回来的媒体数据，用于展示组件的已选择状态
  "responseGroups", // 编辑界面传递回来的媒体文件夹数据，用于展示组件的已选择状态
  "showSearch", // 控制显示搜索弹出框-popover
]);

const form = reactive<any>({
  activeName: "first",
  searchMedia: "", // 搜索媒体
  searchMediaReg: /.*/,
  searchGroups: "", // 搜索媒体文件夹
  searchGroupsReg: /.*/,
  selectedSearchMedia: "", // 已选择的搜索媒体
  selectedSearchMediaReg: /.*/,
  selectedSearchGroups: "", // 已选择的搜索媒体文件夹
  selectedSearchGroupsReg: /.*/,
  searchMediaVisible: false, // 是否显示搜索媒体popover弹窗
  searchGroupsVisible: false, // 是否显示搜索媒体文件夹popover弹窗
  selectedSearchMediaVisible: false, // 是否显示已选择媒体的搜索框
  selectedSearchGroupsVisible: false, // 是否显示已选择媒体文件夹的搜索框
  currentGroupsID: 0, // 当前选择的媒体文件夹id
  currentSelectStatus: "first", // 当前选择tab的状态，用于编辑界面时处理数据展示
  allGroupsOptions: [], // 所有媒体文件夹-选择框
  allMediaData: [], // 所有媒体数据
  allGroupsData: [], // 所有媒体文件夹数据
  selectedMediaData: [], // 已选择的媒体数据
  selectedGroupsData: [], // 已选择的媒体文件夹数据
  selectedMediaID: [], // 已选择的媒体ID数组
  selectedGroupsID: [], // 已选择的媒体文件夹ID数组
  dragging: null, // 拖拽中
  mediaSecond: 0, // 媒体统计时长-秒
  groupsSecond: 0, // 媒体文件夹下的媒体统计时长-秒
  loaded: 0, // 完成加载次数
});
// 插件配置
let config = reactive<any>({
  mediaTitle: proxy.$t("Media"), // 媒体选项开的标题
  groupsTitle: proxy.$t("Media folder"), // 媒体文件夹选项卡的标题
  showMediaColumn: [
    // 要显示的列(媒体） column列名 text列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Media"),
      style: { width: "85%" },
    },
  ],
  showMediaGroupsColumn: [
    // 要显示的列(媒体文件夹) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Media folder"),
      style: { width: "85%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  mediaColumnName: "id", // 注入selectedMediaData中的媒体的列名
  groupsColumnName: "id", // 注入selectedGroupsData中的媒体文件夹的列名
  mediaRequestColumnName: "medias_id", // requestMedia中的媒体列名 （即是选择后的数据，用于请求）
  groupsRequestColumnName: "medias_groups_id", // requestGroups中的媒体列名 （即是选择后的数据，用于请求）
  mediaOtherData: {}, // 关联媒体的其他数据
  groupsOtherData: {}, // 关联媒体文件夹的其他数据
  isSelectMedia: true, // 是否可以选择媒体
  isSelectGroups: systemStore.functional_configs.FolderDisplay, // 是否可以选择媒体文件夹
});
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
  if (
    (tab.paneName === "first" && form.searchGroupsVisible) ||
    (tab.paneName === "second" && form.searchMediaVisible)
  ) {
    handleClickClosePopover();
  }
};
// 处理点击搜索媒体popover弹窗
const handleClickMediaVisible = () => {
  // form.searchGroups = "";
  form.searchGroupsVisible = false;
  form.searchMediaVisible = !form.searchMediaVisible;
};
// 处理点击搜索媒体文件夹popover弹窗
const handleClickGroupsVisible = () => {
  // form.searchMedia = "";
  form.searchMediaVisible = false;
  form.searchGroupsVisible = !form.searchGroupsVisible;
};
// 处理点击关闭popover弹窗
const handleClickClosePopover = () => {
  // form.searchMedia = "";
  form.searchMediaVisible = false;
  // form.searchGroups = "";
  form.searchGroupsVisible = false;
};
// 处理点击关闭已选择媒体/媒体文件夹的搜索框
const handleClickCloSesearchInput = () => {
  // form.selectedSearchMedia = "";
  form.selectedSearchMediaVisible = false;
  // form.selectedSearchGroups = "";
  form.selectedSearchGroupsVisible = false;
};
// 处理媒体搜索
const handleMediaSearch = () => {
  let string = useRegex.replaceRegString(form.searchMedia);
  form.searchMediaReg = new RegExp(string, "gmi");
};
// 处理已选媒体搜索
const handleSelectedMediaSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchMedia);
  form.selectedSearchMediaReg = new RegExp(string, "gmi");
};
// 处理媒体搜索
const handleGroupsSearch = () => {
  let string = useRegex.replaceRegString(form.searchGroups);
  form.searchGroupsReg = new RegExp(string, "gmi");
};
// 处理已选媒体搜索
const handleSelectedGroupsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchGroups);
  form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理更新选择媒体文件夹
const handleUpdateSelectedGroups = () => {
  let requestGroups: any[] = [];
  let selectedName = "";
  form.groupsSecond = 0;
  form.selectedGroupsID = [];

  form.selectedGroupsData.forEach(
    (item: { [x: string]: any; id: number; name: string }) => {
      let request: any = {};
      form.selectedGroupsID.push(item.id);
      form.groupsSecond += Number.parseInt(item.length);

      request.name = item.name;
      selectedName += item.name + ",";
      request[config.groupsRequestColumnName] = item[config.groupsColumnName];
      request.length = Number(item.length);
      request = Object.assign(request, config.groupsOtherData);
      requestGroups.push(request);
    }
  );

  emit("selectedGroupsName", selectedName);
  emit("requestGroups", requestGroups);
  emit("totalSecond", form.mediaSecond + form.groupsSecond);
};
// 处理更新选择媒体
const handleUpdateSelectedMedia = () => {
  let requestMedia: any[] = [];
  let selectedName = "";
  form.mediaSecond = 0;
  form.selectedMediaID = [];

  form.selectedMediaData.forEach(
    (item: { [x: string]: any; id: number; name: string }) => {
      let request: any = {};
      form.selectedMediaID.push(item.id);
      form.mediaSecond += Number.parseInt(item.length) + 2;

      request.name = item.name;
      selectedName += item.name + ",";
      request[config.mediaRequestColumnName] = item[config.mediaColumnName];
      request.length = Number(item.length) + 2;
      request = Object.assign(request, config.mediaOtherData);
      requestMedia.push(request);
    }
  );

  emit("selectedMediaName", selectedName);
  emit("requestMedia", requestMedia);
  emit("totalSecond", form.mediaSecond + form.groupsSecond);
};
// 取消全选
const deselectAll = () => {
  if (form.activeName === "first") {
    let selected: any[] = [];
    let noSelect: any[] = [];
    form.selectedMediaData.forEach((item: { [x: string]: string }) => {
      item[config.searchColumnName].match(
        form.selectedSearchMediaVisible ? form.selectedSearchMediaReg : ""
      )
        ? selected.push(item)
        : noSelect.push(item);
    });
    form.allMediaData = Array.from(selected.concat(form.allMediaData));
    form.selectedMediaData = Array.from(noSelect);
    handleUpdateSelectedMedia();
  }

  if (form.activeName === "second") {
    let selected: any[] = [];
    let noSelected: any[] = [];
    form.selectedGroupsData.forEach((item: { [x: string]: string }) => {
      item[config.searchColumnName].match(
        form.selectedSearchGroupsVisible ? form.selectedSearchGroupsReg : ""
      )
        ? selected.push(item)
        : noSelected.push(item);
    });
    form.allGroupsData = Array.from(selected.concat(form.allGroupsData));
    form.selectedGroupsData = Array.from(noSelected);
    handleUpdateSelectedGroups();
  }
};
// 全选
const selectAll = () => {
  if (form.activeName === "first") {
    let selected: any[] = [];
    let noSelect: any[] = [];
    form.allMediaData.forEach((item: { [x: string]: string; medias_groups_id: any }) => {
      (form.currentGroupsID <= 0 || item.medias_groups_id == form.currentGroupsID) &&
      item[config.searchColumnName].match(
        form.searchMediaVisible ? form.searchMediaReg : ""
      )
        ? selected.push(item)
        : noSelect.push(item);
    });
    form.selectedMediaData = Array.from(selected.concat(form.selectedMediaData));
    form.allMediaData = Array.from(noSelect);
    handleUpdateSelectedMedia();
  }

  if (form.activeName === "second") {
    let selected: any[] = [];
    let noSelect: any[] = [];
    form.allGroupsData.forEach((item: { [x: string]: string }) => {
      item[config.searchColumnName].match(
        form.searchGroupsVisible ? form.searchGroupsReg : ""
      )
        ? selected.push(item)
        : noSelect.push(item);
    });
    form.selectedGroupsData = Array.from(selected.concat(form.selectedGroupsData));
    form.allGroupsData = Array.from(noSelect);
    handleUpdateSelectedGroups();
  }
};
// 选择媒体
const selectTerminal = (row: { id: number }) => {
  if (form.selectedMediaID.indexOf(row.id) < 0) {
    form.selectedMediaData.push(Object.assign({}, row));
    form.allMediaData = form.allMediaData.filter((item: { id: number }) => {
      return row.id !== item.id;
    });
    handleUpdateSelectedMedia();
  }
};
// 删除媒体
const deleteTerminal = (row: { id: number }) => {
  if (form.selectedMediaID.indexOf(row.id) >= 0) {
    form.allMediaData.unshift(Object.assign({}, row));
    form.selectedMediaData = form.selectedMediaData.filter((item: { id: number }) => {
      return row.id !== item.id;
    });
    handleUpdateSelectedMedia();
  }
};
// 选择媒体文件夹
const selectGroup = (row: { id: number }) => {
  if (form.selectedGroupsID.indexOf(row.id) < 0) {
    form.selectedGroupsData.push(Object.assign({}, row));
    form.allGroupsData = form.allGroupsData.filter((item: { id: number }) => {
      return row.id !== item.id;
    });
    handleUpdateSelectedGroups();
  }
};
// 删除媒体文件夹
const deleteGroup = (row: { id: number }) => {
  if (form.selectedGroupsID.indexOf(row.id) >= 0) {
    form.allGroupsData.unshift(Object.assign({}, row));
    form.selectedGroupsData = form.selectedGroupsData.filter((item: { id: number }) => {
      return row.id !== item.id;
    });
    handleUpdateSelectedGroups();
  }
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
  if (config.isSelectGroups && !config.isSelectMedia) {
    form.activeName = "second";
  } else {
    if (
      parentData.responseMedia?.length > 0 &&
      config.isSelectGroups &&
      parentData.responseMedia?.length < 1
    ) {
      form.activeName = "second";
    }
  }
};
// 拖拽开始
const handleMediasDragStart = (e: any, item: { id: any }) => {
  form.dragging = item;
  // 如果不设置内容 火狐 拖不了
  e.dataTransfer.setData("Text", item.id);
};
// 拖拽结束
const handleMediasDragEnd = () => {
  form.dragging = null;
};
// 首先把div变成可以放置的元素，即重写dragenter/dragover
const handleMediasDragOver = (e: any) => {
  // 在dragenter中针对放置目标来设置!
  e.dataTransfer.dropEffect = "move";
};
// 拖拽确认
const handleMediasDragEnter = (e: any, item: any) => {
  // 为需要移动的元素设置dragstart事件
  e.dataTransfer.effectAllowed = "move";

  if (item === form.dragging) {
    return;
  }

  const newMedias = [...form.selectedMediaData];
  const src = newMedias.indexOf(form.dragging);
  const dst = newMedias.indexOf(item);

  newMedias.splice(dst, 0, ...newMedias.splice(src, 1));

  form.selectedMediaData = newMedias;
  handleUpdateSelectedMedia();
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
          // 数据加载完成，抛出去组件
          emit("loaded", ++form.loaded);
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
  // 处理弹窗界面的编辑数据
  handleEditMediaData();
};
// 处理获取全部分组
const handleGetAllGroups = async () => {
  await MeidaService.getAllMeidaGroup({})
    .then((result) => {
      if (result.data) {
        // 组装数据结构
        if (isArray(result.data)) {
          form.allGroupsData = result.data;
          form.allGroupsOptions = [...form.allGroupsOptions, ...result.data];
          // 数据加载完成，抛出去组件
          emit("loaded", ++form.loaded);
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
  // 处理弹窗界面的编辑数据
  handleEditGroupsData();
};
// 设置编辑界面传递回来的ids
const setEditDataIDS = (data: any[]) => {
  let ids = [];
  if (data?.length > 0) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      ids.push(item.id);
    }
  }
  return ids;
};
// 处理编辑界面传递回来的已选择媒体数据
const handleEditMediaData = () => {
  form.selectedMediaID = setEditDataIDS(parentData.responseMedia);
  let allData = [];
  for (let index = 0; index < form.allMediaData.length; index++) {
    const item = form.allMediaData[index];
    // 根据编辑界面返回的媒体ids，直接做对应处理
    if (!form.selectedMediaID.includes(item.id)) {
      allData.push(item);
    }
  }
  form.allMediaData = allData;
  // 按返回的顺序展示
  form.selectedMediaData = parentData.responseMedia || [];
  handleUpdateSelectedMedia();
};
// 处理编辑界面传递回来的已选择分组数据
const handleEditGroupsData = () => {
  form.selectedGroupsID = setEditDataIDS(parentData.responseGroups);
  let allData = [];
  for (let index = 0; index < form.allGroupsData.length; index++) {
    const item = form.allGroupsData[index];
    // 根据编辑界面返回的分组ids，直接做对应处理
    if (!form.selectedGroupsID.includes(item.id)) {
      allData.push(item);
    }
  }
  form.allGroupsData = allData;
  // 按返回的顺序展示
  form.selectedGroupsData = parentData.responseGroups || [];
  handleUpdateSelectedGroups();
};

// 监听变化
watch(
  () => [parentData.responseMedia, parentData.responseGroups, parentData.showSearch],
  ([newMedia, newGroups, newSearch], [oldMedia, oldGroups, oldSearch]) => {
    if (config.isSelectMedia && newMedia != oldMedia) {
      handleEditMediaData();
    }
    if (config.isSelectGroups && newGroups != oldGroups) {
      handleEditGroupsData();
    }
    if (newSearch != oldSearch) {
      form.searchMediaVisible = false;
      form.searchGroupsVisible = false;
    }
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
  setCurrentTabSelectStatus();
  config.isSelectMedia && handleGetAllMeida();
  handleGetAllGroups();
});
</script>

<style lang="scss" scoped>
.com-select-media-group {
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
    :deep(.select-left-tabs) {
      height: 100%;
      border: none;
      .el-tabs__content {
        height: calc(100% - 40px);
        padding: 0;
        .el-tab-pane {
          height: 100%;
        }
      }
      .el-tabs__nav {
        width: 100%;
        > .el-tabs__item {
          width: 50%;
          padding: 0 10px;
          text-align: center;
          margin-top: 0;
          .custom-tabs-label {
            height: 100%;
            i {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              font-size: 16px;
              margin-right: 5px;
              vertical-align: top;
            }
            span {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              max-width: 80%;
              height: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: top;
            }
          }
          &:first-child {
            margin-left: 0;
            border-left: none;
          }
          &:last-child {
            border-right: none;
          }
        }
        .is-active {
          border-bottom: 1px solid #ddd;
        }
      }
      .custom-scroll-bar {
        display: flex;
        flex-direction: column;
        height: 100%;
        .scroll-select {
          .el-select {
            width: 100%;
            border-bottom: 1px solid #ddd;
            .el-input__wrapper {
              box-shadow: none !important;
            }
          }
        }
        .scroll-bar {
          flex: 1;
          height: calc(100% - 40px);
        }
      }
    }
    :deep(.width) {
      .el-tabs__nav {
        > .el-tabs__item {
          width: 100%;
        }
      }
    }
    .scroll-ul {
      li {
        cursor: pointer;
      }
    }
  }
  .com-select-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 36px;
    height: 100%;
    text-align: center;
    > span {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;
      margin: 2vh 0;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background-color: $c-f2;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
    }
  }
  .com-select-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 336px);
    height: 100%;
    border-radius: 2px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .com-right-content {
      width: 100%;
      height: 100%;
    }
    .custom-right-title {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 40px 0 20px;
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
    .custom-right-content {
      flex: 1;
      height: calc(100% - 40px);
      .scroll-ul {
        li {
          padding: 0;
          .item-media {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 40px 0 20px;
            box-sizing: border-box;
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
    .icon-font-delete {
      position: absolute;
      top: 0;
      right: 15px;
    }
  }
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
      }
    }
    .drag {
      cursor: grab;
    }
  }
}
.com-second-tip {
  position: absolute;
  right: 0;
  bottom: -26px;
  line-height: 26px;
  text-align: right;
}
.custom-popover {
  .el-input {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
