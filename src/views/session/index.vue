<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\session\index.vue
  @Describe: 会话状态
-->
<template>
  <div class="com-index">
    <div class="com-head set-padding">
      <div class="com-head-content">
        <div class="com-breadcrumb">
          <el-select v-model="form.selectType" @change="handleDefaultGet">
            <el-option
              v-for="item in sessionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="form.search"
            :placeholder="
              $t('Task name') + '/' + $t('Originator') + '/' + $t('Respondent')
            "
            clearable
            @clear="handleDefaultGet"
            @keyup.enter="
              useCommonTable.handleKeyupEnter(form.search, handleDefaultGet)
            "
            @change="
              useCommonTable.handleKeyupDelete(form.search, handleDefaultGet)
            "
          />
          <el-button
            :icon="Search"
            :disabled="form.search == ''"
            @click="handleDefaultGet"
          ></el-button>
          <el-button
            :disabled="form.search == '' && form.selectType == 0"
            @click="handleReset"
          >
            {{ $t("Reset") }}
          </el-button>
        </div>
        <div class="com-button">
          <span class="monitor-speaker">{{ $t("Monitor speaker") }}</span>
          <select-monitoring-speaker />
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg">
      <div class="com-table">
        <el-table
          ref="multipleTableRef"
          :data="form.data"
          border
          style="width: 100%"
          height="100%"
          :cell-class-name="cellClassName"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          :default-sort="{ prop: 'TaskBeginTime', order: 'descending' }"
          v-loading="form.loading"
          element-loading-text="Loading..."
          element-loading-background="rgba(0, 0, 0, 0.7)"
        >
          <el-table-column
            type="index"
            label="No."
            show-overflow-tooltip
            :width="60"
            :index="typeIndex"
          />
          <el-table-column
            prop="TaskName"
            :label="$t('Task name')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="TaskType"
            :label="$t('Session type')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ formatterTaskType(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="TaskIniator"
            :label="$t('Originator')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="EndpointIpListArray"
            :label="$t('Respondent')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-dropdown
                placement="left-start"
                :max-height="234"
                class="custom-dropdown"
                v-if="scope.row.EndPointListArray?.length > 0"
              >
                <span class="theme">
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  {{ scope.row.EndPointListArray?.[0]?.EndPointName }}
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, key) in scope.row.EndPointListArray"
                      :key="key"
                    >
                      {{ item.EndPointName }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            prop="TaskVolume"
            :label="$t('Task volume')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="com-table-task-volume">
                <el-input-number
                  v-model="scope.row.TaskVolume"
                  :min="0"
                  :max="100"
                  controls-position="right"
                  size="small"
                  @change="changeTaskVolume(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="TaskBeginTime"
            :label="$t('Session duration')"
            sortable="custom"
            show-overflow-tooltip
            width="170"
          />
          <el-table-column
            prop="IsMonitor"
            :label="$t('Monitor status')"
            show-overflow-tooltip
            :formatter="handleMonitorTransform"
          />
          <el-table-column :label="$t('Operation')" width="120">
            <template #default="scope">
              <el-button link type="danger" @click="handleStopTask(scope.row)">
                <template #icon>
                  <i class="iconfont icon-end" :title="$t('End task')"></i>
                </template>
              </el-button>
              <template v-if="scope.row.TaskType !== 19">
                <el-button
                  link
                  type="primary"
                  v-if="!scope.row.IsMonitor"
                  @click="handleMonitorTask(scope.row)"
                >
                  <template #icon>
                    <i
                      class="iconfont icon-headset"
                      :title="$t('Click monitor')"
                    ></i>
                  </template>
                </el-button>
                <el-button
                  link
                  type="danger"
                  v-else
                  @click="handleStopMonitorTask(scope.row)"
                >
                  <template #icon>
                    <i
                      class="iconfont icon-headphones-disabled"
                      :title="$t('Stop monitoring')"
                    ></i>
                  </template>
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="com-footer com-m-bg" v-if="form.data.length > 0">
      <el-pagination
        v-model:currentPage="form.currentPage"
        v-model:page-size="form.pageSize"
        :page-sizes="userStore?.pageRule"
        layout="total, sizes, prev, pager, next, jumper"
        :total="form.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { send } from "@/utils/socket";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import useCommonTable from "@/utils/global/common_table_search";
import usePublicMethod from "@/utils/global/index";

// defineAsyncComponent 异步组件-懒加载子组件
const selectMonitoringSpeaker = defineAsyncComponent(
  () => import("./components/select_monitoring_speaker.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const user = getStore.useUserStore();
const session = getStore.useSessionStore();
const terminals = getStore.useTerminalsStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user.user;
});
const sessionStoreAll = computed(() => {
  return session.allSessionObj;
});
const sessionStoreTotal = computed(() => {
  return session.allFilterSession.length;
});
const sessionStoreOnePage = computed(() => {
  return session.onePageSession;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Session_PageSize;
});
const terminalsStoreAll = computed(() => {
  return terminals.allTerminalsObj;
});

interface User {
  id: number;
  name: string;
  TaskType: number;
}

const form = reactive<any>({
  search: "",
  selectType: 0,
  data: [],
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  orderColumn: "TaskBeginTime",
  orderType: "desc",
  loading: false, // 等待加载数据状态
  loadingMonitor: false, // 等待监听状态
});
const sessionOptions = [
  ...[{ value: 0, label: proxy.$t("All type") }],
  ...useFormatMap.taskTypeOptions,
];
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理获取一页数据
const handleGetOnePageData = async () => {
  session.setSessionSearchString(form.search);
  session.setSessionTaskType(form.selectType);
  session.setSessionSort(form.orderType, form.orderColumn);
  session.setSessionPage(form.currentPage, form.pageSize);
  session.setFilterSessionArray();
  session.setFilterSessionArraySort();
  session.setSessionPaginationArray();
  form.total = sessionStoreTotal.value;
  form.data = sessionStoreOnePage.value;
  // 当第二页以上，最后一条任务数据没了后，自动跳转到上一页
  if (form.currentPage > 1 && form.data.length == 0) {
    form.currentPage--;
    session.setSessionPage(form.currentPage, form.pageSize);
    session.setSessionPaginationArray();
  }
};
// 处理默认获取
const handleDefaultGet = () => {
  form.currentPage = 1;
  handleGetOnePageData();
};
// 处理重置
const handleReset = () => {
  form.search = "";
  form.selectType = 0;
  handleDefaultGet();
};
// 处理排序
const handleSortChange = (row: { prop: any; order: string | string[] }) => {
  form.orderColumn = row.order ? row.prop : "TaskBeginTime";
  form.orderType =
    !row.order || row.order?.indexOf("desc") >= 0 ? "desc" : "asc";
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
  // 记住分页
  systemStore.updateSystemSize({
    key: "Session_PageSize",
    val,
  });
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 格式化任务类型
const formatterTaskType = (row: User) => {
  return useFormatMap.taskTypeMap.get(row.TaskType);
};
// 结束任务
const handleStopTask = (row: any) => {
  let title =
    proxy.$t("Stop task prompt") +
    "<br>" +
    proxy.$t("Current task") +
    " : " +
    row.TaskName;
  ElMessageBox.confirm(title, proxy.$t("Tips"), {
    type: "warning",
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
    confirmButtonText: proxy.$t("Determine"),
    cancelButtonText: proxy.$t("Cancel"),
  })
    .then(() => {
      let data = {
        company: "BL",
        actioncode: "c2ms_stop_task",
        token: "",
        data: {
          TaskID: row.TaskID,
        },
        result: 0,
        return_message: "",
      };
      send(data);
    })
    .catch(() => {});
};
// 开启监听
const handleMonitorTask = (row: any) => {
  const currentTableRow =
    JSON.parse(localStorage.get("monitoringSpeaker")) || "";
  if (currentTableRow) {
    let func = () => {
      let data = {
        company: "BL",
        actioncode: "c2ms_monitor_task",
        token: "",
        data: {
          TaskID: usePublicMethod.generateUUID(),
          MonitorTaskID: row.TaskID,
          EndPointList: [currentTableRow.EndPointID],
        },
        result: 0,
        return_message: "",
      };
      send(data);
    };
    usePublicMethod.debounce(func, 500);
  } else {
    ElMessage({
      type: "warning",
      message: proxy.$t("Please select an idle terminal"),
      grouping: true,
    });
  }
};
// 结束监听
const handleStopMonitorTask = (row: any) => {
  if (row.MonitorTaskID) {
    let data = {
      company: "BL",
      actioncode: "c2ms_stop_task",
      token: "",
      data: {
        TaskID: row.MonitorTaskID,
      },
      result: 0,
      return_message: "",
    };
    send(data);
  } else {
    ElMessage({
      type: "warning",
      message: proxy.$t("No task ID"),
      grouping: true,
    });
  }
};
// 改变任务音量
const changeTaskVolume = (row: any) => {
  if (row.TaskVolume === undefined) {
    row.TaskVolume = 0;
  }
  let func = () => {
    let data = {
      company: "BL",
      actioncode: "c2ms_set_task_volume",
      token: "",
      data: {
        TaskID: row.TaskID,
        Volume: row.TaskVolume,
      },
      result: 0,
      return_message: "",
    };
    send(data);
  };
  usePublicMethod.debounce(func, 1000);
};
const cellClassName = (row: any) => {
  if (row.columnIndex === 4 && row.row.EndPointList.length > 0) {
    return "com-table-task-response";
  }
};
// 处理监听状态的展示信息
const handleMonitorTransform = (row: {
  IsMonitor: number;
  TaskType: number;
  MonitorEndPointID: number;
}) => {
  if (row.IsMonitor) {
    return terminalsStoreAll.value[row.MonitorEndPointID] && row.TaskType !== 19
      ? terminalsStoreAll.value[row.MonitorEndPointID].EndPointName
      : proxy.$t("Monitor");
  } else {
    return row.TaskType == 19 ? proxy.$t("Monitor") : proxy.$t("Not monitored");
  }
};

// 监听变化
watch(
  () => sessionStoreAll.value,
  () => {
    handleGetOnePageData();
  },
  {
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped>
.monitor-speaker {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.com-table-task-volume {
  display: flex;
  .volume {
    flex: 1;
  }
  .iconfont {
    width: 16px;
  }
}
</style>
