<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\views\log\system\index.vue
  @Describe: 系统日志
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
          <el-table-column prop="time" label="时间" show-overflow-tooltip />
          <el-table-column prop="user.name" label="用户" show-overflow-tooltip />
          <el-table-column prop="description" label="用户操作" show-overflow-tooltip />
          <el-table-column prop="platform.platform" label="平台" show-overflow-tooltip />
          <el-table-column prop="ip_address" label="登录IP地址" show-overflow-tooltip />
          <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
          <el-table-column prop="level" label="日志级别" show-overflow-tooltip>
            <template #default="scope">
              {{ formatterLevel(scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <i
                class="iconfont icon-delete"
                title="删除"
                @click="handleDelete('single', scope.row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="44" />
        </el-table>
      </div>
    </div>
    <div class="com-footer" v-if="form.data.length > 0">
      <el-pagination
        v-model:currentPage="form.currentPage"
        v-model:page-size="form.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="form.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElMessage, ElMessageBox } from "element-plus";
import { SystemLogService } from "@/utils/api/log";

// 声明触发事件
const emit = defineEmits(["dele"]);

interface User {
  id: number;
  name: string;
  level: number;
}

const form = reactive<any>({
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  exporting: false, // 等待导出状态
  loading: false, // 等待加载数据状态
  orderColumn: "id",
  searchDate: [],
  search_ip_address: "",
  search_platform: "",
  search_description: "",
  search_users_ids: -1,
  search_level: 0,
  start_date: "",
  end_date: "",
});
const search = computed(() => {
  return form;
});
// 获取refs
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
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
  await SystemLogService.getOnePageLog({
    page: form.currentPage,
    limit: form.pageSize,
    orderColumn: form.orderColumn,
    withTerminalsNums: true,
    withUser: true,
    search_level: form.search_level,
    search_platform: form.search_platform,
    search_ip_address: form.search_ip_address,
    search_users_ids: form.search_users_ids,
    search_description: form.search_description,
    start_date: form.searchDate?.[0],
    end_date: form.searchDate?.[1],
  })
    .then((result) => {
      if (result.data.data) {
        form.data = result.data.data;
        form.total = result.data.total;
      } else {
        ElMessage({
          type: "error",
          message: result.data?.message,
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
};
// 处理重置
const handleReset = () => {
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
// 处理删除
const handleDelete = (type: string, row: any) => {
  //single：单个删除
  if (type != "single" && multipleSelection.value.length == 0) {
    return;
  }
  ElMessageBox.confirm("即将删除, 是否继续？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
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
      SystemLogService.deleteLog({
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
              message: "删除成功",
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.data?.message || "删除失败",
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
//日志级别格式转换
const formatterLevel = (row: User) => {
  return useFormatMap.logLevelTypeMap.get(row?.level);
};
// const search_level = ref(0);
// 暴露方法
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
