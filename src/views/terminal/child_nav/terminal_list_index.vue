<!-- 
  @Author: hmf
  @CreateDate: 2022-07-29
  @FilePath: src\views\terminal\child_nav\terminal_list_index.vue
  @Describe: 终端状态-终端列表视图
-->
<template>
  <div class="com-index tree-index">
    <div class="com-index-left com-il-bg" v-if="form.isShowNavBar">
      <div class="com-two-index">
        <div class="com-main">
          <div class="com-two-main">
            <el-scrollbar>
              <ul class="folder-ul">
                <li
                  v-for="item in form.groupData"
                  :key="item.GroupID"
                  @click="handleClickGroup(item)"
                  :class="form.current_group === item.id ? 'theme' : ''"
                >
                  <span :title="item.name">{{ item.name }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <div class="com-index-right com-ir-bg">
      <div class="com-index">
        <div class="com-head">
          <div class="com-head-content">
            <div class="com-breadcrumb">
              <i
                class="iconfont theme"
                :class="form.isShowNavBar ? 'icon-shrink' : 'icon-order'"
                :title="form.isShowNavBar ? $t('Put away') : $t('Open')"
                @click="form.isShowNavBar = !form.isShowNavBar"
              ></i>
              <span class="title">{{ form.currentGroupTitle }}</span>
              <template v-if="multipleSelection.length > 0">
                &nbsp;(
                <span class="theme">{{ multipleSelection.length }}</span> )
              </template>
            </div>
            <div class="com-button"></div>
          </div>
        </div>
        <div class="com-main">
          <div class="com-table">
            <el-table
              ref="multipleTableRef"
              :data="form.data"
              style="width: 100%"
              height="100%"
              @selection-change="handleSelectionChange"
              :default-sort="sort_condition"
              @sort-change="sortChange"
            >
              <el-table-column type="selection" width="44" />
              <el-table-column
                type="index"
                label="No."
                show-overflow-tooltip
                width="60"
                :index="typeIndex"
              />
              <el-table-column
                prop="status"
                :label="$t('Status')"
                sortable="custom"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <span
                    class="iconfont"
                    :title="terminalsStatusMap.get(scope.row.Status)?.name"
                    :class="terminalsStatusMap.get(scope.row.Status)?.class"
                  >
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                :label="$t('Terminal name')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="volume" :label="$t('Volume')" />
              <el-table-column
                prop="ip_address"
                :label="$t('Terminal IP')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="code" :label="$t('Call code')" sortable="custom" />
              <el-table-column
                prop="type"
                :label="$t('Terminal type')"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ formatterTerminalsType(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TaskName"
                :label="$t('Task name')"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{
                    scope.row.TaskName && scope.row.TaskName.length
                      ? scope.row.TaskName
                      : "-"
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="com-footer" v-if="form.data.length > 0">
          <el-pagination
            v-model:currentPage="form.currentPage"
            v-model:page-size="form.pageSize"
            :page-sizes="proxy.$user?.config?.pageRule"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

interface User {
  date: string;
  name: string;
  type: number;
  EndPointType: number;
}
const systemStore = getStore.useSystemStore();

const system_configs = computed(() => {
  return systemStore.system_configs;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Terminal_PageSize;
});
const form = reactive<any>({
  search: "",
  groupData: [],
  data: [],
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  currentGroupTitle: proxy.$t("All terminals"),
  isShowNavBar: true, // 是否显示左侧导航栏
  current_group: 0,
});
const terminalsStatusMap = useFormatMap.terminalsStatusMap;

const { terminal_group_data }: any = inject("terminal_group");
const { updateCheckedTerminals }: any = inject("checkedAll");

const store = getStore.useTerminalStore();

const terminal_data = computed(() => {
  // 终端状态数据
  return store.terminal_data;
});
const terminal_status = computed(() => {
  //筛选状态
  return store.terminal_status;
});
const search_value = computed(() => {
  //搜索字段
  return store.search_value;
});

const sort_condition: any = ref({
  prop: "ip_address",
  order: "descending",
});
const storage_terminal_data = ref(); //当前分组下的设备信息
const cacheTerminalData: any = ref([]); //过滤后得数据

// 格式化终端类型
const formatterTerminalsType = (row: User) => {
  return useFormatMap.terminalsMap.get(row.type ? row.type : row.EndPointType);
};

watch([terminal_data, storage_terminal_data], () => {
  storage_terminal_data.value.forEach((one: any) => {
    terminal_data.value.some((two: any) => {
      if (one.id === two.EndPointID) {
        Object.assign(one, two);
        return true;
      }
      return false;
    });
  });
  cacheTerminalData.value = filterData();
  sortChange(sort_condition.value, sort_condition.value.prop, sort_condition.value.order);
  form.data = cacheTerminalData.value.slice(
    form.pageSize * (form.currentPage - 1),
    form.pageSize * form.currentPage
  );
});

watch(
  () => terminal_group_data.value,
  (newVal) => {
    if (!form.current_group && newVal.length > 0) {
      form.current_group = newVal[0].id;
    }
    getCurGroupData();
  },
  {
    deep: true,
  }
);

watch(
  () => cacheTerminalData.value,
  (newVal) => {
    form.data = newVal.slice(
      form.pageSize * (form.currentPage - 1),
      form.pageSize * form.currentPage
    );
    form.total = form.data.length;
  }
);

watch([terminal_status, search_value], () => {
  cacheTerminalData.value = filterData();
  sortChange(sort_condition.value, sort_condition.value.prop, sort_condition.value.order);
});

const sort_map = new Map([
  [0, "status"],
  [1, "ip_address"],
  [2, "name"],
  [3, "code"],
]);

// 处理点击切换分组
const handleClickGroup = (val: any) => {
  form.currentGroupTitle = val.GroupName;
  form.current_group = val.id;
  getCurGroupData();
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  let terminal_ids = val.map((item: any) => {
    return item.id || item.EndPointID;
  });
  updateCheckedTerminals(terminal_ids);
};

const filterData = () => {
  let condition = terminal_status.value === -1 && search_value.value === "";
  if (condition) {
    return storage_terminal_data.value;
  } else {
    let filterData = storage_terminal_data.value.filter((item: any) => {
      return (
        (item.Status === terminal_status.value || terminal_status.value === -1) &&
        (item.name.match(search_value.value) || search_value.value === "")
      );
    });
    return filterData;
  }
};
// 排序处理
const sortChange = (column: any, prop: any, order: any) => {
  sort_condition.value = {
    prop: column.prop,
    order: column.order,
  };
  if (column.prop == "status") {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) => b.status - a.status);
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) => a.status - b.status);
    }
  } else if (column.prop == "name") {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        b.name.localeCompare(a.name, "zh")
      );
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        a.name.localeCompare(b.name, "zh")
      );
    }
  } else if (column.prop == "ip_address") {
    if (column.order === "descending") {
      cacheTerminalData.value = store.sortChangeData(1, cacheTerminalData.value);
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) => {
        let ip1 = a.ip_address
          .split(".")
          .map((e: any) => e.padStart(3, "0"))
          .join("");
        let ip2 = b.ip_address
          .split(".")
          .map((e: any) => e.padStart(3, "0"))
          .join("");
        return ip1 - ip2;
      });
    }
  } else {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) => {
        return b.code - a.code;
      });
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) => a.code - b.code);
    }
  }
  handlefilterData(form.pageSize);
};

// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理XXX条/页更改
const handlefilterData = (val: number) => {
  form.currentPage = 1;
  form.data = cacheTerminalData.value.slice(0, form.pageSize * form.currentPage);
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  systemStore.updateSystemSize({
    key: "Terminal_PageSize",
    val,
  });
  form.pageSize = val;
  form.currentPage = 1;
  form.data = cacheTerminalData.value.slice(0, form.pageSize * form.currentPage);
};

// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  form.data = cacheTerminalData.value.slice(
    form.pageSize * (form.currentPage - 1),
    form.pageSize * form.currentPage
  );
};

const getCurGroupData = () => {
  form.groupData = terminal_group_data.value;
  if (terminal_group_data.value) {
    let index = terminal_group_data.value.findIndex(
      (item: any) => item.id === form.current_group
    );
    storage_terminal_data.value = terminal_group_data.value[index]?.terminals;
  }
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  sort_condition.value = {
    prop: String(sort_map.get(system_configs.value.TerminalOrderbyType)),
    order: "descending",
  };
  if (terminal_group_data.value.length > 0) {
    form.current_group = terminal_group_data.value[0].id;
  }
  getCurGroupData();
});
</script>

<style lang="scss" scoped>
.tree-index {
  flex-direction: row;
}

.com-index-left {
  width: 216px;
}

.com-index-right {
  .iconfont {
    margin: 0 14px;
    cursor: pointer;
  }

  .com-table {
    padding-top: 0;
  }
}

.com-two-main {
  .folder-ul {
    padding: 10px 0;

    li {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        background-color: #bbe0ff;

        .icon-btn {
          display: block;
        }

        .num {
          display: none;
        }
      }
    }

    .theme {
      background-color: #bbe0ff;
    }
  }
}
</style>
