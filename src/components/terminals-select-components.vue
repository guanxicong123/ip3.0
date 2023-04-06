<!-- 
  @Author: hmf
  @CreateDate: 2022-08-10
  @FilePath: src\components\select_components\select_terminals_groups.vue
  @Describe: 选择终端和分组
-->
<template>
  <div class="com-select-terminals-groups">
    <div class="com-select-left">
      <el-tabs
        type="border-card"
        class="select-left-tabs"
        :class="{ width: !config.isSelectGroups }"
        v-model="form.activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane name="first" v-if="config.isSelectTerminals">
          <template #label>
            <div class="custom-tabs-label">
              <el-popover
                :visible="form.searchTerminalsVisible"
                placement="top-start"
                :width="260"
              >
                <template #reference>
                  <el-icon @click="handleClickTerminalsVisible">
                    <Search />
                  </el-icon>
                </template>
                <div class="custom-popover">
                  <el-input
                    v-model="form.searchTerminals"
                    :placeholder="$t('Terminal name') + '/' + $t('Terminal IP')"
                    maxlength="100"
                    clearable
                    @input="handleTerminalsSearch"
                  />
                  <i
                    class="iconfont icon-execution-failed delete"
                    @click="handleClickClosePopover"
                  ></i>
                </div>
              </el-popover>
              <span>{{ config.terminalsTitle }}</span>
            </div>
          </template>
          <div class="custom-scroll-bar">
            <div class="scroll-select">
              <el-select v-model="form.currentGroupsID" fit-input-width>
                <el-option :key="-1" :label="$t('All terminals')" :value="-1">
                  <span style="float: left">{{ $t("All terminals") }}</span>
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
                <el-option :key="0" :label="$t('Ungrouped')" :value="0">
                  <span style="float: left">{{ $t("Ungrouped") }}</span>
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
                  <template
                    v-for="item in form.allTerminalsData"
                    :key="item.id"
                  >
                    <li
                      @click="selectTerminal(item)"
                      v-if="
                        form.currentGroupsID === -1 ||
                        item.with_groups_ids.includes(form.currentGroupsID)
                      "
                      v-show="
                        !form.searchTerminalsVisible ||
                        item[config.searchColumnName].match(
                          form.searchTerminalsReg
                        ) ||
                        item[config.searchColumnIP].match(
                          form.searchTerminalsReg
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
                    :placeholder="$t('Group name')"
                    maxlength="100"
                    clearable
                    @input="handleGroupsSearch"
                  />
                  <i
                    class="iconfont icon-execution-failed delete"
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
      <span
        :title="$t('Move all right')"
        @click="selectAll"
        class="iconfont icon-shift-right"
      >
      </span>
      <span
        :title="$t('Move all left')"
        @click="deselectAll"
        class="iconfont icon-shift-left"
      >
      </span>
    </div>
    <!-- 已选终端 -->
    <div
      class="com-select-right"
      v-show="form.activeName === 'first'"
      v-if="config.isSelectTerminals"
    >
      <div class="custom-right-title">
        <div
          v-for="(item, index) in config.showTerminalsColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchTerminalsVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchTerminalsVisible =
                  !form.selectedSearchTerminalsVisible
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
              v-model="form.selectedSearchTerminals"
              :placeholder="$t('Terminal name') + '/' + $t('Terminal IP')"
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
      <div class="custom-right-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template
              v-for="(item, index) in form.selectedTerminalsData"
              :key="item.id"
            >
              <li
                v-show="
                  !form.selectedSearchTerminalsVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchTerminalsReg
                  ) ||
                  item[config.searchColumnIP].match(
                    form.selectedSearchTerminalsReg
                  )
                "
              >
                <div class="item-terminals">
                  <el-icon
                    class="icon-font-arrow theme"
                    @click="item.isShowAmplifier = !item.isShowAmplifier"
                    v-if="config.selectAmplifier"
                  >
                    <ArrowDown v-if="item.isShowAmplifier" />
                    <ArrowRight v-else />
                  </el-icon>
                  <div
                    v-for="(row, key) in config.showTerminalsColumn"
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
                <div
                  class="item-amplifier"
                  v-if="config.selectAmplifier && item.isShowAmplifier"
                >
                  <div class="amplifier-checkbox">
                    <span>{{ config.amplifierTitle }}</span>
                    <el-checkbox
                      v-model="item.checkAll_amplifier"
                      :indeterminate="item.isIndeterminate"
                      @change="handleCheckAllAmplifierChange(item)"
                    >
                      {{ $t("Select all") }}
                    </el-checkbox>
                    <el-checkbox-group
                      v-model="item[config.amplifierColumnName]"
                      @change="handleSelectAmplifierChange(item)"
                    >
                      <el-checkbox
                        v-for="row in config.amplifierValue"
                        :key="row"
                        :label="row"
                      >
                        {{ row }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <!-- 已选分组 -->
    <div
      class="com-select-right"
      v-show="form.activeName === 'second'"
      v-if="config.isSelectGroups"
    >
      <div class="custom-right-title group">
        <div
          v-for="(item, index) in config.showTerminalsGroupsColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchGroupsVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchGroupsVisible =
                  !form.selectedSearchGroupsVisible
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
              :placeholder="$t('Group name')"
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
            <template
              v-for="(item, index) in form.selectedGroupsData"
              :key="item.id"
            >
              <li
                v-show="
                  !form.selectedSearchGroupsVisible ||
                  item[config.searchColumnName].match(
                    form.selectedSearchGroupsReg
                  )
                "
              >
                <div class="item-terminals group">
                  <div
                    v-for="(row, key) in config.showTerminalsGroupsColumn"
                    :key="key"
                    :style="row.style"
                    :title="
                      row.column !== config.terminalsColumnVolume
                        ? item[row.column]
                        : ''
                    "
                  >
                    <el-input-number
                      v-if="row.column === config.terminalsColumnVolume"
                      v-model="item[row.column]"
                      :min="0"
                      :max="100"
                      :value-on-clear="item[row.column]"
                      controls-position="right"
                    />
                    <span v-else>
                      {{ row.column === "key" ? index + 1 : item[row.column] }}
                      <view-components-popover
                        v-if="row.column === 'list'"
                        :url="'/terminals-groups/' + item.id + '/terminals'"
                      />
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
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from "element-plus";

const systemStore = getStore.useSystemStore();

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
// 声明触发事件
const emit = defineEmits([
  "requestTerminals", // 更新传递已选择的终端数据，用于父组件进行数据交互
  "requestGroups", // 更新传递已选择的分组数据，用于父组件进行数据交互
  "selectedTerminalsName", // 更新传递已选择的终端数据名称，用于父组件进行数据交互
  "selectedGroupsName", // 更新传递已选择的分组数据名称，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseTerminals", // 编辑界面传递回来的终端数据，用于展示组件的已选择状态
  "responseGroups", // 编辑界面传递回来的分组数据，用于展示组件的已选择状态
  "excludeTerminalsIDS", // 终端id集合 选择终端时可以排除不选这里面的id
  "excludeGroupsIDS", // 分组id集合 选择分组时可以排除不选这里面的id
  "isTerminalGroups", //是否需要分组终端ID
  "showSearch", // 控制显示搜索弹出框-popover
]);

const form = reactive<any>({
  activeName: "first",
  searchTerminals: "", // 搜索终端
  searchTerminalsReg: /.*/,
  searchGroups: "", // 搜索分组a
  searchGroupsReg: /.*/,
  selectedSearchTerminals: "", // 已选择的搜索终端
  selectedSearchTerminalsReg: /.*/,
  selectedSearchGroups: "", // 已选择的搜索分组
  selectedSearchGroupsReg: /.*/,
  searchTerminalsVisible: false, // 是否显示搜索终端popover弹窗
  searchGroupsVisible: false, // 是否显示搜索分组popover弹窗
  selectedSearchTerminalsVisible: false, // 是否显示已选择终端的搜索框
  selectedSearchGroupsVisible: false, // 是否显示已选择分组的搜索框
  currentGroupsID: -1, // 当前选择的分组id
  currentSelectStatus: "first", // 当前选择tab的状态，用于编辑界面时处理数据展示
  allGroupsOptions: [], // 所有分组-选择框
  allTerminalsData: [], // 所有终端数据
  allGroupsData: [], // 所有分组数据
  selectedTerminalsData: [], // 已选择的终端数据
  selectedGroupsData: [], // 已选择的分组数据
  selectedTerminalsID: [], // 已选择的终端ID数组
  selectedGroupsID: [], // 已选择的分组ID数组
});

// 插件配置
let config = reactive<any>({
  terminalsTitle: proxy.$t("Terminal"), // 终端选项开的标题
  groupsTitle: proxy.$t("Group"), // 分组选项卡的标题
  showTerminalsColumn: [
    // 要显示的列(终端） column列名 text列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Terminal name"),
      style: { width: "55%" },
    },
    {
      column: "ip_address",
      text: proxy.$t("Terminal IP"),
      style: { width: "30%" },
    },
  ],
  showTerminalsGroupsColumn: [
    // 要显示的列(分组) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Group name"),
      style: { width: "55%" },
    },
    {
      column: "list",
      text: proxy.$t("Terminal list"),
      style: { width: "30%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  searchColumnIP: "ip_address", // 搜索的列名
  terminalsColumnName: "id", // 注入selectedTerminalsData中的终端的列名
  groupsColumnName: "id", // 注入selectedGroupsData中的分组的列名
  amplifierColumnName: "amplifier", // 注入selectedTerminalsData中的终端的 功率分区 列名
  terminalsRequestColumnName: "terminals_id", // requestTerminals中的终端列名 （即是选择后的数据，用于请求）
  groupsRequestColumnName: "terminals_groups_id", // requestGroups中的终端列名 （即是选择后的数据，用于请求）
  amplifierRequestColumnName: "amplifier", // requestTerminals中的终端的 功率分区 列名 （即是选择后的数据，用于请求）
  terminalsOtherData: {}, // 关联终端的其他数据
  groupsOtherData: {}, // 关联分组的其他数据
  amplifierTitle: "功率分区", // 八分区的标题
  amplifierValue: [1, 2, 3, 4, 5, 6, 7, 8], // 功率分区数据
  isSelectTerminals: true, // 是否可以选择终端
  isSelectGroups: systemStore.functional_configs.GroupDisplay, // 是否可以选择分组
  selectAmplifier: false, // 是否可以选择功率分区
});
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
  if (
    (tab.paneName === "first" && form.searchGroupsVisible) ||
    (tab.paneName === "second" && form.searchTerminalsVisible)
  ) {
    handleClickClosePopover();
  }
};
// 处理点击搜索终端popover弹窗
const handleClickTerminalsVisible = () => {
  form.searchGroups = "";
  form.searchGroupsVisible = false;
  form.searchTerminalsVisible = !form.searchTerminalsVisible;
};
// 处理点击搜索分组popover弹窗
const handleClickGroupsVisible = () => {
  form.searchTerminals = "";
  form.searchTerminalsVisible = false;
  form.searchGroupsVisible = !form.searchGroupsVisible;
};
// 处理点击关闭popover弹窗
const handleClickClosePopover = () => {
  form.searchTerminals = "";
  form.searchTerminalsVisible = false;
  form.searchGroups = "";
  form.searchGroupsVisible = false;
  handleTerminalsSearch()
  handleGroupsSearch()
};
// 处理点击关闭已选择终端/分组的搜索框
const handleClickCloSesearchInput = () => {
  form.selectedSearchTerminals = "";
  form.selectedSearchTerminalsVisible = false;
  form.selectedSearchGroups = "";
  form.selectedSearchGroupsVisible = false;
  handleSelectedTerminalsSearch()
  handleSelectedGroupsSearch()
};
// 处理终端搜索
const handleTerminalsSearch = () => {
  let string = useRegex.replaceRegString(form.searchTerminals);
  form.searchTerminalsReg = new RegExp(string, "gmi");
};
// 处理已选终端搜索
const handleSelectedTerminalsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchTerminals);
  form.selectedSearchTerminalsReg = new RegExp(string, "gmi");
};
// 处理终端搜索
const handleGroupsSearch = () => {
  let string = useRegex.replaceRegString(form.searchGroups);
  form.searchGroupsReg = new RegExp(string, "gmi");
};
// 处理已选终端搜索
const handleSelectedGroupsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchGroups);
  form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理更新选择分组
const handleUpdateSelectedGroups = () => {
  let requestGroups: any[] = [];
  let selectedName = "";
  form.selectedGroupsID = [];
  form.selectedGroupsData.forEach(
    (item: { [x: string]: any; id: number; name: string }) => {
      let request: any = {};
      form.selectedGroupsID.push(item.id);
      request.name = item.name;
      selectedName += item.name + ",";
      if (parentData.isTerminalGroups) {
        request.terminalIds = item.terminals.map((one: any) => {
          return one.terminals_id;
        });
      }
      request[config.groupsRequestColumnName] = item[config.groupsColumnName];
      request = Object.assign(request, config.groupsOtherData);
      requestGroups.push(request);
    }
  );

  emit("selectedGroupsName", selectedName);
  emit("requestGroups", requestGroups);
};
// 处理更新选择终端
const handleUpdateSelectedTerminals = () => {
  let requestTerminals: any[] = [];
  let selectedName = "";
  form.selectedTerminalsID = [];

  form.selectedTerminalsData.forEach(
    (item: { [x: string]: any; id: number; name: string }) => {
      let request: any = {};
      form.selectedTerminalsID.push(item.id);
      request.name = item.name;
      selectedName += item.name + ",";
      request[config.terminalsRequestColumnName] =
        item[config.terminalsColumnName];

      if (config.selectAmplifier) {
        request[config.amplifierRequestColumnName] =
          item[config.amplifierColumnName];
      }

      request = Object.assign(request, config.terminalsOtherData);
      requestTerminals.push(request);
    }
  );
  emit("selectedTerminalsName", selectedName);
  emit("requestTerminals", requestTerminals);
};
// 取消全选
const deselectAll = () => {
  if (form.activeName === "first") {
    let selected: any[] = [];
    let noSelect: any[] = [];
    form.selectedTerminalsData.forEach((item: { [x: string]: string }) => {
      const search = form.selectedSearchTerminalsVisible
        ? form.selectedSearchTerminalsReg
        : "";
      item[config.searchColumnName].match(search) ||
      item[config.searchColumnIP].match(search)
        ? selected.push(item)
        : noSelect.push(item);
    });
    form.allTerminalsData = Array.from(selected.concat(form.allTerminalsData));
    form.selectedTerminalsData = Array.from(noSelect);
    handleUpdateSelectedTerminals();
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
    form.allTerminalsData.forEach(
      (item: { [x: string]: string; with_groups_ids: any }) => {
        const search = form.searchTerminalsVisible
          ? form.searchTerminalsReg
          : "";
        (form.currentGroupsID == -1 ||
          item.with_groups_ids.indexOf(form.currentGroupsID) >= 0) &&
        (item[config.searchColumnName].match(search) ||
          item[config.searchColumnIP].match(search))
          ? selected.push(item)
          : noSelect.push(item);
      }
    );
    form.selectedTerminalsData = Array.from(
      selected.concat(form.selectedTerminalsData)
    );
    form.allTerminalsData = Array.from(noSelect);
    handleUpdateSelectedTerminals();
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
    form.selectedGroupsData = Array.from(
      selected.concat(form.selectedGroupsData)
    );
    form.allGroupsData = Array.from(noSelect);
    handleUpdateSelectedGroups();
  }
};
// 选择终端
const selectTerminal = (row: { id: number }) => {
  if (form.selectedTerminalsID.indexOf(row.id) < 0) {
    form.selectedTerminalsData.push(Object.assign({}, row));
    form.allTerminalsData = form.allTerminalsData.filter(
      (item: { id: number }) => {
        return row.id !== item.id;
      }
    );
    handleUpdateSelectedTerminals();
  }
};
// 删除终端
const deleteTerminal = (row: { id: number }) => {
  if (form.selectedTerminalsID.indexOf(row.id) >= 0) {
    form.allTerminalsData.unshift(Object.assign({}, row));
    form.selectedTerminalsData = form.selectedTerminalsData.filter(
      (item: { id: number }) => {
        return row.id !== item.id;
      }
    );
    handleUpdateSelectedTerminals();
  }
};
// 选择分组
const selectGroup = (row: { id: number }) => {
  if (form.selectedGroupsID.indexOf(row.id) < 0) {
    form.selectedGroupsData.push(Object.assign({}, row));
    form.allGroupsData = form.allGroupsData.filter((item: { id: number }) => {
      return row.id !== item.id;
    });
    handleUpdateSelectedGroups();
  }
};
// 删除分组
const deleteGroup = (row: { id: number }) => {
  if (form.selectedGroupsID.indexOf(row.id) >= 0) {
    form.allGroupsData.unshift(Object.assign({}, row));
    form.selectedGroupsData = form.selectedGroupsData.filter(
      (item: { id: number }) => {
        return row.id !== item.id;
      }
    );
    handleUpdateSelectedGroups();
  }
};
// 全选功率分区
const handleCheckAllAmplifierChange = (item: any) => {
  item[config.amplifierColumnName] =
    item.checkAll_amplifier === true ? config.amplifierValue : [];
  handleUpdateSelectedTerminals();
};
// 单选功率分区
const handleSelectAmplifierChange = (item: any) => {
  const checkedCount = item[config.amplifierColumnName].length;
  item.checkAll_amplifier = checkedCount === config.amplifierValue.length;
  item.isIndeterminate =
    checkedCount > 0 && checkedCount < config.amplifierValue.length;
  handleUpdateSelectedTerminals();
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
  if (config.isSelectGroups && !config.isSelectTerminals) {
    form.activeName = "second";
  } else {
    if (
      parentData.responseTerminals?.length > 0 &&
      config.isSelectGroups &&
      parentData.responseTerminals?.length < 1
    ) {
      form.activeName = "second";
    }
  }
};
// 处理获取全部分组
const handleGetAllGroups = () => {
  proxy.$http
    .get("terminals-groups/all", {
      params: {
        withTerminals: true,
      },
    })
    .then((result: { result: number; data: any[] }) => {
      if (result.result === 200) {
        form.allGroupsData = form.allGroupsOptions = result.data.map(
          (item: any) => {
            return {
              id: item.id,
              name: item.name,
              terminals: item.terminals,
            };
          }
        );
        handleEditGroupsData();
      }
    });
};
// 处理获取全部终端
const handleGetAllTerminals = () => {
  proxy.$http
    .get("/terminals/all", {
      params: {
        relayServers: true,
        withGroups: true,
        terminals_type: 0,
      },
    })
    .then((result: { result: number; data: any[] }) => {
      if (result.result === 200) {
        handleAssemblyDataStructureTerminals(result.data);
        form.allTerminalsData = result.data;
        handleEditTerminalsData();
      }
    });
};
// 处理终端组装数据结构
const handleAssemblyDataStructureTerminals = (data: any[]) => {
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    item.isShowAmplifier = false;
    item.checkAll_amplifier = false;
    item.isIndeterminate = false;
    item.with_groups_ids = [];
    // 当含有分组数据时,添加到with_groups_ids字段，进行分组筛选时使用
    if (item.with_groups?.length > 0) {
      for (let key = 0; key < item.with_groups.length; key++) {
        const groups = item.with_groups[key];
        item.with_groups_ids.push(groups.terminals_groups_id);
      }
    } else {
      item.with_groups_ids.push(0);
    }
    // 当含有八分区数据时
    if (
      item.other_config &&
      Object.prototype.hasOwnProperty.call(item.other_config, "amplifier")
    ) {
      const checkedCount = item.other_config.amplifier.length;
      item[config.amplifierColumnName] = item.other_config.amplifier;
      item.checkAll_amplifier = checkedCount == config.amplifierValue.length;
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < config.amplifierValue.length;
    }
  }
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
// 处理编辑界面传递回来的已选择终端数据
const handleEditTerminalsData = () => {
  form.selectedTerminalsID = setEditDataIDS(parentData.responseTerminals);
  let allData = [];
  let selectedData = [];
  for (let index = 0; index < form.allTerminalsData.length; index++) {
    const item = form.allTerminalsData[index];
    // 根据编辑界面返回的终端ids，直接做对应处理
    if (form.selectedTerminalsID.includes(item.id)) {
      selectedData.push(item);
    } else {
      allData.push(item);
    }
  }
  form.allTerminalsData = allData;
  form.selectedTerminalsData = selectedData;
  handleUpdateSelectedTerminals();
};
// 处理编辑界面传递回来的已选择分组数据
const handleEditGroupsData = () => {
  form.selectedGroupsID = setEditDataIDS(parentData.responseGroups);
  let allData = [];
  let selectedData = [];
  for (let index = 0; index < form.allGroupsData.length; index++) {
    const item = form.allGroupsData[index];
    // 根据编辑界面返回的分组ids，直接做对应处理
    if (form.selectedGroupsID.includes(item.id)) {
      selectedData.push(item);
    } else {
      allData.push(item);
    }
  }
  form.allGroupsData = allData;
  form.selectedGroupsData = selectedData;
  handleUpdateSelectedGroups();
};
// 处理excludeTerminalsIDS传递回来需过滤终端
const handleExcludeTerminals = (data: any) => {
  const arrayIDS: number[] = [];
  form.selectedTerminalsData.map((item: { id: number }) => {
    arrayIDS.push(item.id);
  });
  if (parentData.excludeTerminalsIDS?.length > 0) {
    form.allTerminalsData = data.filter((item: { id: number }) => {
      return (
        !parentData.excludeTerminalsIDS.includes(item.id) &&
        !arrayIDS.includes(item.id)
      );
    });
  } else {
    form.allTerminalsData = data.filter((item: { id: number }) => {
      return !arrayIDS.includes(item.id);
    });
  }
};

// 监听变化
watch(
  () => [
    parentData.excludeTerminalsIDS,
    parentData.responseTerminals,
    parentData.responseGroups,
    parentData.showSearch,
  ],
  (
    [newExcludeTerminals, newTerminals, newGroups, newSearch],
    [oldExcludeTerminals, oldTerminals, oldGroups, oldSearch]
  ) => {
    if (config.isSelectTerminals && newTerminals != oldTerminals) {
      handleEditTerminalsData();
    }
    if (config.isSelectGroups && newGroups != oldGroups) {
      handleEditGroupsData();
    }
    if (newExcludeTerminals != oldExcludeTerminals) {
      handleExcludeTerminals(form.allTerminalsData);
    }
    if (newSearch != oldSearch) {
      form.searchTerminalsVisible = false;
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
  config = Object.assign(
    config,
    parentData.myConfig ? parentData.myConfig : {}
  );
  setCurrentTabSelectStatus();
  config.isSelectTerminals && handleGetAllTerminals();
  handleGetAllGroups();
});
</script>

<style lang="scss" scoped>
.com-select-terminals-groups {
  display: flex;
  align-items: center;
  height: 300px;
  border: 1px solid #e7e7e7;

  .com-select-left {
    width: 300px;
    height: 100%;
    border-radius: 2px;
    border-right: 1px solid #e7e7e7;
    box-sizing: border-box;

    :deep(.select-left-tabs) {
      height: 100%;
      border: none;
      background-color: #f4f9ff;
      padding: 0 30px;

      .el-tabs__header {
        padding: 10px 0;
      }

      .el-tabs__content {
        height: calc(100% - 60px);
        padding: 0;

        .el-tab-pane {
          height: 100%;
        }
      }

      .el-tabs__nav {
        width: 100%;
        background-color: #f4f9ff;

        > .el-tabs__item {
          width: 50%;
          padding: 0 10px;
          text-align: center;
          margin-top: 0;
          color: #5ea2e2;

          .custom-tabs-label {
            height: 100%;

            i {
              height: 100%;
              font-size: 16px;
              margin-right: 5px;
              vertical-align: top;
            }

            span {
              display: inline-block;
              max-width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: top;
            }
          }

          &:first-child {
            margin-left: 0;
            border: 1px solid #8fc4ff;
            border-radius: 6px 0px 0px 6px;
          }

          &:last-child {
            border: 1px solid #8fc4ff;
            border-radius: 0px 6px 6px 0px;
          }
        }

        .is-active {
          background-color: #0070ee;
          color: #ffffff;
        }
      }

      .custom-scroll-bar {
        display: flex;
        flex-direction: column;
        height: 100%;

        .scroll-select {
          .el-select {
            width: 100%;
            // margin-bottom: 18px;

            .el-input__wrapper {
              box-shadow: none !important;
            }
          }
        }

        .scroll-bar {
          flex: 1;
          height: calc(100% - 50px);
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
  }

  .com-select-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60px;
    height: 100%;
    text-align: center;

    > span {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;
      margin: 2vh 0;
      cursor: pointer;
      color: #9cbad4;

      &:hover {
        color: #0070ee;
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
    border-left: 1px solid #ddd;
    background-color: #f4f9ff;
    box-sizing: border-box;

    .com-right-content {
      width: 100%;
      height: 100%;
    }

    .custom-right-title {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #e2edfb;

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

          .item-terminals {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 20px;
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

              .delete {
                font-size: 10px;
                padding: 10px;

                &:hover {
                  color: #0070ee;
                }
              }
            }
          }

          .item-amplifier {
            width: 100%;
            background: #f0f0f0;

            .amplifier-checkbox {
              display: flex;
              align-items: center;
              line-height: 22px;
              margin-left: 45px;

              .el-checkbox {
                height: 22px;
              }

              > label {
                margin: 0 30px;
              }

              .el-checkbox-group {
                white-space: normal;
              }

              > span {
                padding-left: 10px;
                margin: 9px 0;
                border-left: 2px solid $c-theme;
              }
            }
          }
        }
      }
    }

    .icon-font-arrow {
      position: absolute;
      top: 0;
      left: 12px;
      height: 100%;
      font-size: 16px;
    }

    .icon-font-delete {
      position: absolute;
      top: 0;
      right: 15px;
    }

    .group {
      padding: 0 40px 0 20px !important;
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
        background-color: #e4f0ff;
        cursor: pointer;
      }
    }
  }
}

.custom-popover {
  .el-input {
    width: 200px;
    margin-right: 10px;
  }

  .iconfont {
    cursor: pointer;
  }
}
</style>
