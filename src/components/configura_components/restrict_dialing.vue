<!-- 
  @Author: hmf
  @CreateDate: 2022-08-24
  @FilePath: src\components\configura_components\restrict_dialing.vue
  @Describe: 限制拨号终端
-->
<template>
  <div class="com-restrict-dialing">
    <el-tabs v-model="form.activeName">
      <el-tab-pane :label="$t('Intercom limit')" name="first" lazy>
        <span> {{ $t("Selected terminal") }} : </span>
        <span class="theme">{{ form.intercomTerminals.length }}</span>
        <select-terminals-groups
          ref="intercomRef"
          style="height: 380px; margin: 15px 0 1px"
          @requestTerminals="handleRequestIntercomTerminals"
          @loaded="handleRequestLoaded"
          :responseTerminals="form.intercom_terminals"
          :myConfig="myConfig"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('Broadcasting restrictions')" name="second" lazy>
        <span> {{ $t("Selected terminal") }} : </span>
        <span class="theme">{{ form.broadcastTerminals.length }}</span>
        <template v-if="systemStore.functional_configs.GroupDisplay">
          <span>&nbsp;&nbsp;{{ $t("Selected groups") }} : </span>
          <span class="theme">{{ form.broadcastTerminalsGroups.length }}</span>
        </template>
        <select-terminals-groups
          ref="broadcastRef"
          style="height: 380px; margin: 15px 0 1px"
          @requestTerminals="handleRequestBroadcastTerminals"
          @requestGroups="handleRequestBroadcastGroups"
          @loaded="handleRequestLoaded"
          :responseTerminals="form.broadcast_terminals"
          :responseGroups="form.broadcast_terminals_groups"
          :myConfig="myConfigBroadcast"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('Monitoring limit')" name="three" lazy>
        <span> {{ $t("Selected terminal") }} : </span>
        <span class="theme">{{ form.monitorTerminals.length }}</span>
        <select-terminals-groups
          ref="monitorRef"
          style="height: 380px; margin: 15px 0 1px"
          @requestTerminals="handleRequestMonitorTerminals"
          @loaded="handleRequestLoaded"
          :responseTerminals="form.monitor_terminals"
          :myConfig="myConfig"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
const systemStore = getStore.useSystemStore();

// 声明触发事件
const emit = defineEmits([
  "requestIntercomTerminals", // 更新传递已选择的对讲限制终端数据，用于父组件进行数据交互
  "requestBroadcastTerminals", // 更新传递已选择的广播限制终端数据，用于父组件进行数据交互
  "requestBroadcastGroups", // 更新传递已选择的广播限制分组数据，用于父组件进行数据交互
  "requestMonitorTerminals", // 更新传递已选择的监听限制终端数据，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "id", // 任务id
  "responseIntercomTerminals", // 编辑界面传递回来的对讲限制终端数据，用于展示组件的已选择状态
  "responseBroadcastTerminals", // 编辑界面传递回来的广播限制终端数据，用于展示组件的已选择状态
  "responseBroadcastGroups", // 编辑界面传递回来的广播限制分组数据，用于展示组件的已选择状态
  "responseMonitorTerminals", // 编辑界面传递回来的监听限制终端数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
  activeName: "first",
  intercomTerminals: [],
  intercom_terminals: [],
  broadcastTerminals: [],
  broadcast_terminals: [],
  broadcastTerminalsGroups: [],
  broadcast_terminals_groups: [],
  monitorTerminals: [],
  monitor_terminals: [],
});
// 选择终端/分组组件插件配置
const myConfig = {
  isSelectGroups: false, // 是否可以选择分组
  selectAmplifier: false, // 是否可以选择功率分区
};
const myConfigBroadcast = {
  selectAmplifier: false, // 是否可以选择功率分区
};
// 处理选择终端/分组组件的数据
const handleRequestIntercomTerminals = (data: any[]) => {
  form.intercomTerminals = data;
  emit("requestIntercomTerminals", data);
};
const handleRequestBroadcastTerminals = (data: any[]) => {
  form.broadcastTerminals = data;
  emit("requestBroadcastTerminals", data);
};
const handleRequestBroadcastGroups = (data: any[]) => {
  form.broadcastTerminalsGroups = data;
  emit("requestBroadcastGroups", data);
};
const handleRequestMonitorTerminals = (data: any[]) => {
  form.monitorTerminals = data;
  emit("requestMonitorTerminals", data);
};
// 处理终端选择组件的数据加载完成
const handleRequestLoaded = (data: number) => {
  if (parentData?.id > 0 && data > 0) {
    handleEditData(parentData);
  }
};
// 处理编辑数据
const handleEditData = (data: any) => {
  if (data?.responseIntercomTerminals.length > 0) {
    form.intercom_terminals = data?.responseIntercomTerminals;
  }
  if (data?.responseBroadcastTerminals.length > 0) {
    form.broadcast_terminals = data?.responseBroadcastTerminals;
  }
  if (data?.responseBroadcastGroups?.length > 0) {
    form.broadcast_terminals_groups = data?.responseBroadcastGroups;
  }
  if (data?.responseMonitorTerminals.length > 0) {
    form.monitor_terminals = data?.responseMonitorTerminals;
  }
};

// 监听变化
watch(
  parentData,
  (newData) => {
    handleEditData(newData);
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
