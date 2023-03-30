<!-- 
  @Author: hmf
  @CreateDate: 2022-07-29
  @FilePath: src\views\terminal\child_nav\group_index.vue
  @Describe: 终端状态-分组视图
-->
<template>
  <div class="com-index">
    <div class="com-main">
      <div class="com-table">
        <el-scrollbar>
          <ul class="group-ul">
            <li
              v-for="item in form.data"
              :key="item.id"
              :class="{
                selected: form.multipleSelection.includes(item.id),
              }"
              @click="handleSelected(item)"
              @dblclick="viewGroupInfo(item)"
            >
              <span class="li-span">
                <span
                  class="iconfont"
                  :class="terminalsStatusMap.get(item.status)?.class"
                  :title="terminalsStatusMap.get(item.status)?.name"
                ></span>
              </span>
              <div class="li-text">
                <span :title="item.name">{{ item.name }}</span>
              </div>
              <div class="li-text code">
                <span :title="item.call_code">
                  {{ $t("Code") }} : {{ item.call_code }}
                </span>
              </div>
            </li>
          </ul>
        </el-scrollbar>
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
    <el-dialog
      v-model="show_group_info"
      :title="group_title"
      class="group-info-class"
    >
      <el-table
        ref="multipleTableRef"
        :data="form.table_data"
        style="width: 100%"
        max-height="60vh"
      >
        <el-table-column
          type="index"
          label="No."
          show-overflow-tooltip
          width="60"
          :index="typeIndex"
        />
        <el-table-column
          prop="name"
          :label="$t('Terminal name')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ip_address"
          :label="$t('Terminal IP')"
          show-overflow-tooltip
        />
        <el-table-column prop="call_code" :label="$t('Call code')" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from "vue-router";
import { ElTable, ElMessage } from "element-plus";
import { GroupsService } from "@/utils/api/groups/inedx";

const user = getStore.useUserStore();
const terminals = getStore.useTerminalsStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user.user;
});
const terminalsStoreAll = computed(() => {
  return terminals.allTerminalsObj;
});
const groupStoreSearch = computed(() => {
  return terminals.searchGroupString;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Group_PageSize || 20;
});

const form = reactive<any>({
  search: "",
  data: [],
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  orderColumn: "id",
  orderType: "desc",
  multipleSelection: [], // 已选择的分组
  table_data: [],
});

const show_group_info = ref(false);
const group_title = ref("");
// 表格类型格式转换
const terminalsStatusMap = useFormatMap.terminalsStatusMap;
// 注入祖先组件供给的数据
const {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
  updateCheckedTerminals,
}: any = inject("checkedAll");
// 获取refs
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 处理点击选择分组
const handleSelected = (item: { id: number }) => {
  if (form.multipleSelection.includes(item.id)) {
    form.multipleSelection = form.multipleSelection.filter(
      (row: number) => row !== item.id
    );
  } else {
    form.multipleSelection.push(item.id);
  }
  cleanCheckedTerminalIds();
  // 设置全选 - 使用provide/inject
  handleUpdateCheckedAll(form.multipleSelection.length === form.data.length);
  handleIsCheckedAll(false);
};
// 处理勾选分组数据
const cleanCheckedTerminalIds = () => {
  let terminals_arr: any = [];
  let checked_terminals_ids: any = [];
  form.multipleSelection.forEach((item: any) => {
    let index = form.data.findIndex((add: { id: number }) => {
      return add.id === item;
    });
    if (index > -1) {
      terminals_arr = terminals_arr.concat(form.data[index]?.terminals);
    }
  });
  terminals_arr.map((item: any) => {
    checked_terminals_ids.push(item.EndpointID);
  });
  updateCheckedTerminals(checked_terminals_ids);
};
// 分组终端详情显示
const viewGroupInfo = (item: { name: string; terminals: Array<any>; call_code: string }) => {
  show_group_info.value = true;
  group_title.value = item.name;
  form.table_data = item.terminals.map((terminal:any)=>{
    terminal.call_code = item.call_code
    return terminal
  })
};
// 处理全选
const handleCheckedAll = () => {
  form.multipleSelection = [];
  for (let i = 0; i < form.data.length; i++) {
    form.multipleSelection.push(form.data[i].id);
  }
  cleanCheckedTerminalIds();
};
// 序号
const typeIndex = (index: number) => {
  return index + 1;
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
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
  // 记住分页
  systemStore.updateSystemSize({
    key: "Group_PageSize",
    val,
  });
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理获取一页数据
const handleGetOnePageData = () => {
  GroupsService.getOnePageGroups({
    likeName: form.search,
    page: form.currentPage,
    limit: form.pageSize,
    orderColumn: form.orderColumn,
    orderType: form.orderType,
    withTerminalsNums: true,
    withTerminals: true,
  })
    .then((result: any) => {
      if (result.data?.data) {
        form.data = result.data.data;
        form.total = result.data.total;
        // 给分组手动添加默认状态，然后根据终端状态来更新
        // 遵循“忙碌>空闲>冻结>故障>离线”的排序规则，分组状态为当前终端状态排序最前者。
        form.data.map((item: any) => {
          item.status = 1;
        });
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

// 监听路由
onBeforeRouteLeave((to, from) => {
  handleIsCheckedAll(false);
  handleUpdateCheckedAll(false);
});

// 监听变化
watch(
  () => [terminalsStoreAll.value, groupStoreSearch.value, checked_all.value],
  ([newAll, newSearch, newCheck], [oldAll, oldSearch, oldCheck]) => {
    // 设备状态数据
    if (newAll != oldAll) {
      console.log(newAll);
    }
    // 搜索数据
    if (newSearch != oldSearch) {
      form.search = newSearch;
      handleGetOnePageData();
    }
    // 全选
    if (newCheck != oldCheck) {
      newCheck
        ? handleCheckedAll()
        : setTimeout(() => {
            is_checked_all.value ? (form.multipleSelection = []) : "";
          }, 200);
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
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped>
.group-ul {
  li {
    display: inline-block;
    width: 200px;
    height: 120px;
    margin: 10px 10px 10px 0;
    cursor: pointer;
    background: url("@/assets/images/file.png") no-repeat;

    .li-span {
      display: block;
      font-size: 20px;
      margin: 12px 20px;
    }

    .li-text {
      font-size: 18px;
      padding: 16px 12px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      color: #b17f05;
    }

    .code {
      font-size: 14px;
    }
  }

  .selected {
    background: url("@/assets/images/fileed.png") no-repeat;
    background-size: contain;
  }
}

:deep(.group-info-class) {
  .el-dialog__header {
    padding: 15px 0;
    margin: 0 20px;
    font-size: 14px;
    border-bottom: 1px solid #f0f1f2;

    .el-dialog__headerbtn {
      top: 0;
    }
  }

  .el-dialog__body {
    padding: 0 20px 16px;
  }
}
</style>
