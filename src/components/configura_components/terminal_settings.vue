<!-- 
  @Author: hmf
  @CreateDate: 2022-08-18
  @FilePath: src\components\configura_components\terminal_settings.vue
  @Describe: 终端设置
-->
<template>
  <div class="com-terminal-settings">
    <el-tabs v-model="form.activeName" @tab-click="handleTabClick">
      <el-tab-pane :name="1" lazy>
        <template #label>
          <span class="custom-tabs-label">
            {{ $t("Fast terminal") }}
          </span>
        </template>
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item :label="$t('Fast terminal')" prop="quick_terminal.name">
              <div class="com-add-select-components">
                <el-input
                  v-model="form.quick_terminal.name"
                  :placeholder="$t('Please select')"
                  disabled
                />
                <div class="select-button">
                  <i
                    class="iconfont icon-select-file"
                    :title="$t('Select')"
                    @click="form.quickDialogVisible = true"
                  ></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('Terminal selection')"
        :name="2"
        lazy
        v-if="form.view_mode == 1"
      >
        <el-checkbox
          v-if="config.isSelectOpenTerminalVolume"
          v-model="form.open_terminal_volume"
          :label="$t('Turn on terminal volume')"
          size="large"
          style="margin-bottom: 15px"
          @change="emit('requestOpenVolume', form.open_terminal_volume)"
        />
        <select-terminals-groups
          @requestTerminals="handleRequestTerminals"
          @requestGroups="handleRequestTerminalsGroups"
          @loaded="handleRequestLoaded"
          :responseTerminals="form.terminals"
          :responseGroups="form.terminals_groups"
          :changeTerminalsVolume="parentData?.changeTerminalsVolume"
          :openTerminalsVolume="form.open_terminal_volume"
          :myConfig="myConfigTerminal"
          :showSearch="form.showSearch"
          style="height: 380px; margin: 1px 0"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 选择快捷终端 -->
    <el-dialog
      v-model="form.quickDialogVisible"
      width="1000px"
      destroy-on-close
      draggable
      class="com-default-dialog"
    >
      <template #header="{ titleId, titleClass }">
        <div class="com-dialog-header">
          <span :id="titleId" :class="titleClass">
            {{ $t("Select shortcut terminal") }}
          </span>
        </div>
      </template>
      <select-shortcut-terminal-radios
        style="height: 380px"
        @requestConfigure="handleRequestConfigure"
        :responseConfigure="form.quick_terminal"
      />
      <template #footer>
        <div class="com-dialog-footer">
          <el-button plain @click="form.quickDialogVisible = false">
            {{ $t("Close") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from "element-plus";

// 声明触发事件
const emit = defineEmits([
  "requestOpenVolume", // 更新传递已选择开启改变终端音量，用于父组件进行数据交互
  "requestTerminals", // 更新传递已选择的终端数据，用于父组件进行数据交互
  "requestGroups", // 更新传递已选择的分组数据，用于父组件进行数据交互
  "requestQuickTerminals", // 更新传递已选择的快捷终端数据，用于父组件进行数据交互
  "excludeTerminalsIDS", // 终端id集合 选择终端时可以排除不选这里面的id
  "excludeGroupsIDS", // 分组id集合 选择分组时可以排除不选这里面的id
  "requestType", // 更新传递已选择的终端选择类型，用于父组件进行数据交互
  "loaded", // 更新传递所有数据加载完成，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseOpenVolume", // 配置任务时，是否开启改变终端音量
  "changeTerminalsVolume", // 配置任务时，实时改变终端音量
  "responseTerminals", // 编辑界面传递回来的终端数据，用于展示组件的已选择状态
  "responseGroups", // 编辑界面传递回来的分组数据，用于展示组件的已选择状态
  "responseQuickTerminals", // 编辑界面传递回来的快捷终端数据，用于展示组件的已选择状态
  "showSearch", // 控制显示搜索弹出框-popover
]);

const user = getStore.useUserStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user;
});

const form = reactive({
  activeName: 1,
  view_mode: 1, // 1:经典模式，2:简约模式
  quickDialogVisible: false, // 选择快捷终端弹窗
  quick_terminal: {
    id: 0,
    name: "",
  }, // 快捷终端
  open_terminal_volume: false, // 是否开启终端音量
  terminals: [], // 编辑时传递到子组件的终端数据
  terminals_groups: [], // 编辑时传递到子组件的终端分组数据
  selectedTerminals: [], // 已选择的终端，传递到父组件
  selectedTerminalsGroups: [], // 已选择的终端分组，传递到父组件
  showSearch: false, // 是否显示搜索弹窗
});
// 插件配置
let config = reactive<any>({
  isSelectOpenTerminalVolume: true, // 是否可以选择开启终端音量
  selectAmplifier: true, // 是否可以选择功率分区
});
// 终端插件配置
let myConfigTerminal = reactive<any>({
  selectAmplifier: true, // 是否可以选择功率分区
});
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
  form.showSearch = form.activeName != 2;
  emit("requestType", tab.paneName);
  if (tab.paneName === 1) {
    emit("requestQuickTerminals", form.quick_terminal.id);
  } else {
    emit("requestTerminals", form.selectedTerminals);
    emit("requestGroups", form.selectedTerminalsGroups);
  }
};
// 处理选择终端/分组组件的数据
const handleRequestTerminals = (data: any) => {
  form.selectedTerminals = data;
  emit("requestTerminals", data);
};
const handleRequestTerminalsGroups = (data: any) => {
  form.selectedTerminalsGroups = data;
  emit("requestGroups", data);
};
// 处理选择终端/分组组件的数据加载完成
const handleRequestLoaded = (data: number) => {
  if (data > 1) {
    emit("loaded", data);
  }
};
// 处理选择快捷终端组件的数据
const handleRequestConfigure = (data: any) => {
  form.quick_terminal.id = data?.id;
  form.quick_terminal.name = data?.name;
  emit("requestQuickTerminals", data?.id);
};
// 处理设置编辑数据
const handleSetEditData = () => {
  if (
    (!parentData?.responseTerminals && !parentData?.responseGroups) ||
    (parentData?.responseTerminals?.length < 1 && parentData?.responseGroups?.length < 1)
  ) {
    form.activeName = 1;
    handleRequestConfigure(parentData?.responseQuickTerminals);
  } else {
    form.activeName = 2;
    form.terminals = parentData?.responseTerminals;
    form.terminals_groups = parentData?.responseGroups;
  }
  if (parentData?.responseOpenVolume) {
    form.open_terminal_volume = true;
  }
  emit("requestType", form.activeName);
};

// 监听变化
watch(
  () => [
    parentData?.responseTerminals,
    parentData?.responseGroups,
    parentData?.responseQuickTerminals,
    parentData?.showSearch,
    userStore.value?.user?.users_config,
  ],
  (
    [newTerminals, newGroups, newQuickTerminals, newSearch, newMode],
    [oldTerminals, oldGroups, oldQuickTerminals, oldSearch, oldMode]
  ) => {
    if (
      newTerminals != oldTerminals ||
      newGroups != oldGroups ||
      newQuickTerminals != oldQuickTerminals
    ) {
      handleSetEditData();
    }
    // 界面模式
    if (newMode != oldMode) {
      form.view_mode = newMode.view_mode;
      if (form.activeName == 2 && form.view_mode == 2) {
        form.activeName = 1;
        emit("requestType", form.activeName);
        emit("requestQuickTerminals", 0);
      }
    }
    if (newSearch != oldSearch) {
      form.showSearch = !form.showSearch;
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
  myConfigTerminal.selectAmplifier = config.selectAmplifier;
  form.view_mode = userStore.value?.user?.users_config?.view_mode;
  handleSetEditData();
});
</script>

<style lang="scss" scoped>
.com-terminal-settings {
  .custom-tabs-label {
    i {
      font-size: 12px;
      margin-right: 5px;
    }
    i,
    span {
      vertical-align: middle;
    }
  }
}
</style>
