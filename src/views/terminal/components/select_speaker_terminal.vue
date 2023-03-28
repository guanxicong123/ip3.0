i
<!-- 
  @Author: hmf
  @CreateDate: 2022-12-30
  @FilePath: src\views\session\components\select_speaker_terminal.vue
  @Describe: 选择主讲终端弹窗
-->
<template>
  <div class="com-view-components">
    <el-popover
      ref="popoverRef"
      :virtual-ref="viewRef"
      width="680"
      trigger="click"
      virtual-triggering
      popper-class="view-components-popover"
      @show="handleGetOnePageData"
    >
      <div class="com-index view-components">
        <div class="com-head">
          <div class="com-head-content com-hc-bg">
            <div class="com-title">{{ $t("Terminal") }}</div>
            <div class="com-breadcrumb">
              <el-input
                v-model="form.search"
                :placeholder="$t('Terminal name') + '/' + $t('Terminal IP')"
                clearable
                @clear="handleDefaultGet"
                @keyup.enter="
                  useCommonTable.handleKeyupEnter(form.search, handleDefaultGet)
                "
                @change="
                  useCommonTable.handleKeyupDelete(
                    form.search,
                    handleDefaultGet
                  )
                "
              />
              <el-button
                :icon="Search"
                :disabled="form.search == ''"
                @click="handleDefaultGet"
              ></el-button>
              <el-button :disabled="form.search == ''" @click="handleReset">
                {{ $t("Reset") }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="com-main">
          <div class="com-table">
            <el-table
              ref="multipleTableRef"
              :data="form.data"
              border
              height="100%"
              @sort-change="handleSortChange"
              @row-click="handleRowClick"
              :row-class-name="handleRowClassName"
              :default-sort="{ prop: 'Status', order: 'descending' }"
              v-loading="form.loading"
              element-loading-text="Loading..."
              element-loading-background="rgba(0, 0, 0, 0.7)"
            >
              <el-table-column
                type="index"
                label="No."
                show-overflow-tooltip
                width="60"
                :index="typeIndex"
              />
              <el-table-column
                prop="Status"
                :label="$t('Terminal name')"
                sortable="custom"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <i
                    class="iconfont"
                    :class="terminalsStatusMap.get(4)?.class"
                    :title="terminalsStatusMap.get(4)?.name"
                    v-if="scope.row.Disable"
                  ></i>
                  <i
                    v-else
                    class="iconfont"
                    :class="terminalsStatusMap.get(scope.row.Status)?.class"
                    :title="terminalsStatusMap.get(scope.row.Status)?.name"
                  ></i>
                  {{ scope.row.EndPointName }}
                </template>
              </el-table-column>
              <el-table-column
                prop="EndPointIP"
                :label="$t('Terminal IP')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column
                prop="CallCode"
                :label="$t('Call code')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column
                prop="EndPointType"
                :label="$t('Terminal type')"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ formatterTerminalsType(scope.row) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="com-footer" v-if="form.data.length > 0">
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
    </el-popover>
    <el-button ref="viewRef" v-click-outside="onClickOutside">
      {{ form.currentSelectedName }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import {
  ClickOutside as vClickOutside,
  ElTable,
  ElMessage,
} from "element-plus";
import { Search } from "@element-plus/icons-vue";
import useCommonTable from "@/utils/global/common_table_search";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const user = getStore.useUserStore();
const terminals = getStore.useTerminalsStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user.user;
});
const terminalsStoreAll = computed(() => {
  return terminals.allTerminalsObj;
});
const terminalsStoreTotal = computed(() => {
  return terminals.allFilterTerminals.length;
});
const terminalsStoreOnePage = computed(() => {
  return terminals.onePageTerminals;
});

const form = reactive<any>({
  search: "",
  selectRelayType: -1,
  selectStatusType: -1,
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  orderColumn: "Status",
  orderType: "desc",
  loading: false, // 等待加载数据状态
  currentTableRow: {
    EndPointID: 0,
    EndPointName: "",
  }, // 当前选中表格行数据
  currentSelectedName: proxy.$t("Please select a terminal"),
});
// 获取refs
const viewRef = ref();
const popoverRef = ref();
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 表格类型格式转换
const terminalsStatusMap = useFormatMap.terminalsStatusMap;
// 点击虚拟元素触发 Popover
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
// 处理当前点击表格行
const handleRowClick = (row: any) => {
  form.currentTableRow = row;
  const data = {
    EndPointID: row.EndPointID,
    EndPointName: row.EndPointName,
  };
  form.currentSelectedName = row.EndPointName;
  localStorage.set("speakerTerminal", JSON.stringify(data));
};
// 当前选中高亮
const handleRowClassName = (row: { row: any }) => {
  if (row.row.EndPointID === form.currentTableRow.EndPointID) {
    return "com-select-bg";
  }
};
// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理获取一页数据
const handleGetOnePageData = async () => {
  terminals.setTerminalsSearchString(form.search);
  terminals.setTerminalsServersID(form.selectRelayType);
  terminals.setTerminalsStatus(form.selectStatusType);
  terminals.setTerminalsSort(form.orderType, form.orderColumn);
  terminals.setTerminalsFilterGroups(false, []);
  terminals.setTerminalsPage(form.currentPage, form.pageSize);
  terminals.setFilterTerminalsArray();
  terminals.setFilterTerminalsArraySort();
  terminals.setTerminalsPaginationArray();
  form.total = terminalsStoreTotal.value;
  form.data = terminalsStoreOnePage.value;
};
// 处理默认获取
const handleDefaultGet = () => {
  form.currentPage = 1;
  handleGetOnePageData();
};
// 处理重置
const handleReset = () => {
  form.search = "";
  form.selectRelayType = -1;
  form.selectStatusType = -1;
  handleDefaultGet();
};
// 处理排序
const handleSortChange = (row: { prop: any; order: string | string[] }) => {
  form.orderColumn = row.order ? row.prop : "Status";
  form.orderType =
    !row.order || row.order?.indexOf("desc") >= 0 ? "desc" : "asc";
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 格式化终端类型
const formatterTerminalsType = (row: { EndPointType: number }) => {
  return useFormatMap.terminalsMap.get(row.EndPointType);
};

// 监听变化
watch(
  () => terminalsStoreAll.value,
  () => {
    handleGetOnePageData();
  },
  {
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);
// 暴露方法
defineExpose({
  handleRowClick
});
// mounted 实例挂载完成后被调用
onMounted(() => {
  // 刷新页面时，获取下当前选中表格行
  const currentTableRow = localStorage.get("speakerTerminal") || "";
  if (currentTableRow) {
    form.currentTableRow = JSON.parse(currentTableRow);
    form.currentSelectedName = form.currentTableRow.EndPointName;
  }
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped>
.com-view-components {
  display: inline-flex;
}
.com-view-components + .com-view-components {
  margin-left: 12px;
}
.view-components {
  height: 356px;
  .com-title {
    font-size: 14px;
    font-weight: bold;
    width: calc(100% - 350px);
    padding-left: 10px;
  }
  .com-breadcrumb {
    padding-right: 10px;
  }
  .com-footer {
    padding-bottom: 0;
    :deep(.el-pagination__sizes) {
      display: none;
    }
  }
}
</style>
