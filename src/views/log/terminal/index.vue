<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\views\log\terminal\index.vue
  @Describe: 终端日志
-->
<template>
  <div class="com-index">
    <div class="com-main">
      <div class="com-table">
        <el-table
          ref="multipleTableRef"
          :data="form.data"
          border
          height="100%"
          @selection-change="handleSelectionChange"
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
            prop="time"
            :label="$t('Time')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="terminal.name"
            :label="$t('Terminal name')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="terminal.ip_address"
            :label="$t('Terminal IP')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="terminal.type"
            :label="$t('Terminal type')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ formatterTerminalsType(scope.row?.terminal?.type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('Status')"
            show-overflow-tooltip
            :formatter="formatterStatus"
          />
          <el-table-column
            prop="remarks"
            :label="$t('Remarks')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="level"
            :label="$t('Log level')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ formatterLevel(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operation')"
            width="120"
            v-if="userStore?.type == 0"
          >
            <template #default="scope">
              <i
                class="iconfont icon-delete"
                :title="$t('Delete')"
                @click="handleDelete('single', scope.row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="44"
            v-if="userStore?.type == 0"
          />
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
</template>

<script lang="ts" setup>
import { ElTable, ElMessageBox, ElMessage } from "element-plus";
import { TerminalService } from "@/utils/api/log/terminal_log";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["dele"]);

interface User {
  id: number;
  name: string;
  status: number;
  level: number;
  terminals: { type: 1 };
}

const user = getStore.useUserStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user.user;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Log_PageSize;
});
watch(
  () => systemPageSize.value,
  () => {
    form.pageSize = systemPageSize.value;
  }
);

const form = reactive<any>({
  data: [],
  orderColumn: "id",
  orderType: "desc",
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  search_level: 0,
  searchDate: [],
  search_terminals: "", //终端IP/名称
  status: -1,
  search_terminals_type: -1, //终端类型
});
const search = computed(() => {
  return form;
});
// 获取refs
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
  emit("dele", multipleSelection.value);
};
// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理获取一页数据
const handleGetOnePageData = async () => {
  form.loading = true;
  await TerminalService.getOnePageTerminalLog({
    page: form.currentPage,
    limit: form.pageSize,
    orderColumn: form.orderColumn,
    orderType: form.orderType,
    withTerminal: true,
    start_date: form.searchDate?.[0],
    end_date: form.searchDate?.[1],
    search_terminals: form.search_terminals,
    status: form.status,
    search_terminals_type: form.search_terminals_type,
    search_level: form.search_level,
  })
    .then((result) => {
      if (result.data.data) {
        form.data = result.data.data;
        form.total = result.data.total;
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
};
// 处理默认获取
const handleDefaultGet = () => {
  form.currentPage = 1;
  handleGetOnePageData();
  console.log(form);
};
// 处理重置
const handleReset = () => {
  form.search = "";
  form.search_terminals_type = 0;
  form.search_level = 0;
  form.status = -1;
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  systemStore.updateSystemSize({
    key: "Log_PageSize",
    val,
  });
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
// 处理删除
const handleDelete = (type: string, row: any) => {
  //single：单个删除
  if (type != "single" && multipleSelection.value.length == 0) {
    return;
  }
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let ids = [];
      type === "single"
        ? ids.push(row.id)
        : multipleSelection.value.map((item) => {
            ids.push(item.id);
          });
      TerminalService.deleteTerminalLog({
        ids: ids,
      })
        .then((result) => {
          if (result.data > 0) {
            // 假如删除完本页数据，form.currentPage减去一页再更新数据
            if (form.data.length <= ids.length && form.currentPage > 1) {
              form.currentPage--;
            }
            handleGetOnePageData();
            ElMessage({
              type: "success",
              message: proxy.$t("Delete succeeded"),
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.return_message || proxy.$t("Delete failed"),
              grouping: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {});
};
// 状态格式转换
const formatterStatus = (row: User) => {
  switch (row.status) {
    case 0:
      return proxy.$t("Disconnection");
    case 1:
      return proxy.$t("Go online");
    case 2:
      return proxy.$t("Fault");
    default:
      return "";
  }
};
// 终端类型格式转换
const formatterTerminalsType = (type: number) => {
  return useFormatMap.terminalsMap.get(type);
};
// 日志级别格式转换
const formatterLevel = (row: User) => {
  return useFormatMap.logLevelTypeMap.get(row?.level);
};

// 暴露属性方法
defineExpose({
  handleGetOnePageData,
  handleDelete,
  handleReset,
  handleDefaultGet,
  search,
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped></style>
