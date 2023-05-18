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
                  :key="item.id"
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
              @sort-change="handleSortChange"
              :default-sort="{ prop: 'Status', order: 'descending' }"
              v-loading="form.loading"
              element-loading-text="Loading..."
              element-loading-background="rgba(0, 0, 0, 0.7)"
              @cell-contextmenu="(row,column,cell,event)=>handleContextMenu(row,event)"
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
                prop="Status"
                :label="$t('Status')"
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
                </template>
              </el-table-column>
              <el-table-column
                prop="EndPointName"
                :label="$t('Terminal name')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="Volume" :label="$t('Volume')" />
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
              <el-table-column
                prop="TaskName"
                :label="$t('Task name')"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{
                    scope.row.TaskName?.length > 0
                      ? scope.row.TaskName.toString()
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
            :page-sizes="userStore?.pageRule"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <right-menu :rightclickInfo="rightclickInfo" @changeSpeaker="handleSelectSpeakerTerminal"></right-menu>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElMessage } from "element-plus";
import { GroupsService } from "@/utils/api/groups/inedx";
import rightMenu from "@/components/RightMenu/rightMenu.vue"

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

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
const terminalsStoreTotal = computed(() => {
  return terminals.allFilterTerminals.length;
});
const terminalsStoreSearch = computed(() => {
  return terminals.searchString;
});
const terminalsStoreStatus = computed(() => {
  return terminals.status;
});
const equipmentListChangeNum = computed(() => {
  return terminals.equipmentListChangeNum;
});
const terminalsStoreOnePage = computed(() => {
  return terminals.onePageTerminals;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Terminal_PageSize;
});

interface User {
  id: number;
  name: string;
  EndPointType: number;
  EndPointID:number
}

const form = reactive<any>({
  search: "",
  selectRelayType: -1,
  selectStatusType: -1,
  groupData: [], // 分组数据
  data: [], // 表格数据
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  orderColumn: "Status",
  orderType: "desc",
  currentGroupTitle: proxy.$t("All terminals"),
  isShowNavBar: true, // 是否显示左侧导航栏
  current_group: 0,
  groupOfAllTerminalsIDS: [], // 当前分组下的所有终端ids
  loading: false, // 等待加载数据状态
  loadingGroup: false, // 等待加载数据状态
});
// 表格类型格式转换
const terminalsStatusMap = useFormatMap.terminalsStatusMap;

const { updateCheckedTerminals,handleSelectSpeakerTerminal }: any = inject("checkedAll");
// 获取refs
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

// 右键菜单列表
const rightclickInfo = ref({})

// 处理点击切换分组
const handleClickGroup = (val: any) => {
  let arrayIDS = [];
  for (let index = 0; index < val.terminals?.length; index++) {
    const item = val.terminals[index];
    arrayIDS.push(item.id);
  }
  form.groupOfAllTerminalsIDS = arrayIDS;
  form.currentGroupTitle = val.name;
  form.current_group = val.id;
  handleDefaultGet();
};
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  let ids: number[] = [];
  multipleSelection.value = val;
  multipleSelection.value.forEach((item:{EndPointID:number}) => {
    ids.push(item.EndPointID);
  });
  updateCheckedTerminals(ids);
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
  terminals.setTerminalsFilterGroups(
    form.current_group > 0,
    form.groupOfAllTerminalsIDS
  );
  terminals.setTerminalsPage(form.currentPage, form.pageSize);
  terminals.setFilterTerminalsArray();
  terminals.setFilterTerminalsArraySort();
  terminals.setTerminalsPaginationArray();
  form.total = terminalsStoreTotal.value;
  form.data = terminalsStoreOnePage.value;
  // 当第二页以上，最后一条任务数据没了后，自动跳转到上一页
  if (form.currentPage > 1 && form.data.length == 0) {
    form.currentPage--;
    terminals.setTerminalsPage(form.currentPage, form.pageSize);
    terminals.setTerminalsPaginationArray();
  }
};
// 处理默认获取
const handleDefaultGet = () => {
  form.currentPage = 1;
  handleGetOnePageData();
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
  // 记住分页
  systemStore.updateSystemSize({
    key: "Terminal_PageSize",
    val,
  });
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 格式化终端类型
const formatterTerminalsType = (row: User) => {
  return useFormatMap.terminalsMap.get(row.EndPointType);
};
// 获取所有分组
const getTerminalGroupAll = () => {
  GroupsService.getAllGroups({
    withTerminals: true,
    withTerminalsNums: true,
  })
    .then((result: any) => {
      if (result.data) {
        form.groupData = result.data;
        form.groupData.unshift({
          id: 0,
          name: proxy.$t("All terminals"),
          terminals: [],
        });
        form.current_group = form.groupData[0].id;
        handleGetOnePageData();
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

// 处理右键事件
const handleContextMenu = (row:any,event:any)=>{
  // 采集终端不能作为主讲终端
  if(row.EndPointType === 3) return 
  rightclickInfo.value = {
    position: {
      x: event.clientX,
      y: event.clientY,
    },
    menulists: [
      {
        fnName: "changeSpeaker",
        params: { row, event },
        btnName: "设置为主讲终端",
      },
    ],
  };
  event.preventDefault(); // 阻止默认的鼠标右击事件
}

// 监听变化
watch(
  () => [
    terminalsStoreAll.value,
    terminalsStoreSearch.value,
    terminalsStoreStatus.value,
    equipmentListChangeNum.value,
  ],
  (
    [newAll, newSearch, newStatus, newNum],
    [oldAll, oldSearch, oldStatus, oldNum]
  ) => {
    if (newNum != oldNum) {
      form.selectStatusType = newStatus;
      form.search = newSearch;
    }
    handleGetOnePageData();
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  getTerminalGroupAll();
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
