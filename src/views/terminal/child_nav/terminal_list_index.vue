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
                  :class="form.current_group === item.GroupID ? 'theme' : ''"
                >
                  <span :title="item.GroupName">{{ item.GroupName }}</span>
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
                :title="form.isShowNavBar ? '收起' : '展开'"
                @click="form.isShowNavBar = !form.isShowNavBar"
              ></i>
              <span class="title">{{ form.currentGroupTitle }}</span>
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
                label="状态"
                sortable="custom"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <span :title="terminalsStatusMap.get(scope.row.status)?.name">
                    <svg class="icon" aria-hidden="true">
                      <use
                        :xlink:href="
                          terminalsStatusMap.get(scope.row.status)?.class
                        "
                      ></use>
                    </svg>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="终端名称"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="volume" label="音量" />
              <el-table-column
                prop="ip_address"
                label="终端IP"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="code" label="呼叫编码" sortable="custom" />
              <el-table-column
                prop="type"
                label="终端类型"
                show-overflow-tooltip
              />
              <el-table-column
                prop="task.name"
                label="任务名称"
                show-overflow-tooltip
              />
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";

interface User {
  date: string;
  name: string;
  address: string;
}
const form = reactive<any>({
  search: "",
  groupData: [],
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  currentGroupTitle: "所有终端",
  isShowNavBar: true, // 是否显示左侧导航栏
  current_group: 0
});
const terminalsStatusMap = new Map([
  [0, { class: "#icon-off-line", name: "离线" }],
  [1, { class: "#icon-on-line", name: "空闲" }],
  [2, { class: "#icon-executing", name: "忙碌" }],
  [3, { class: "#icon-freeze", name: "冻结" }],
  [4, { class: "#icon-fault", name: "故障" }],
]);

const {
  terminal_group_data,
}:any = inject('terminal_group')

const {
  updateCheckedTerminals
}: any = inject("checkedAll")

const storage_terminal_data = ref()

const store = useTerminalStore()

const systemStore = useSystemStore()

const system_configs = computed(() => {
  return systemStore.system_configs
})

const terminal_data = computed(() => {
  return store.terminal_data
})

const terminal_status = computed(() => {
  return store.terminal_status
})

const search_value = computed(() => {
  return store.search_value
})

const sort_condition: any = ref({
  prop: 'ip_address',
  order: 'descending'
})

const cacheTerminalData: any = []

watch(()=> terminal_group_data.value, (newVal)=> {
  getCurGroupData()
},{
  deep: true
})


watch(() => terminal_status.value, () => {
  // store.filterGroupData(form.data)
  cacheTerminalData.value = JSON.parse(JSON.stringify(store.filterGroupData(storage_terminal_data.value)))
  sortChange(sort_condition.value, sort_condition.value.prop, sort_condition.value.order)
  form.data = cacheTerminalData.value
  form.total = form.data.length
})

watch(() => search_value.value, () => {
  // store.filterGroupData(form.data)
  cacheTerminalData.value = JSON.parse(JSON.stringify(store.filterGroupData(storage_terminal_data.value)))
  sortChange(sort_condition.value, sort_condition.value.prop, sort_condition.value.order)
  form.data = cacheTerminalData.value
  form.total = form.data.length
})

// 路由
let $useRouter = useRouter();
let $useRoute = useRoute();

const sort_map = new Map([
  [0, 'status'],
  [1, 'ip_address'],
  [2, 'name'],
  [3, 'code']
])

// 处理点击切换分组
const handleClickGroup = (val: any) => {
  form.currentGroupTitle = val.GroupName;
  form.current_group = val.GroupID
  getCurGroupData()
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const multipleSelection = ref<User[]>([]);

// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
  let terminal_ids = multipleSelection.value.map((item: any) => {
    return item.EndpointID
  })
  updateCheckedTerminals(terminal_ids)
};

const sortByIPDesc = (a: any, b: any) => {
  let ip1 = Number(a.ip_address.split('.').map((e: any) => e.padStart(3, '0')).join(''))
  let ip2 = Number(b.ip_address.split('.').map((e: any) => e.padStart(3, '0')).join(''))
  if (ip2 - ip1 > 0) {
    return 1
  } else {
    return -1
  }
}

// 排序处理
const sortChange = (column: any, prop: any, order: any) => {
  sort_condition.value = {
    prop: column.prop,
    order: column.order
  }
  if (column.prop == "status") {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        b.status - a.status
      )
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        a.status - b.status
      )
    }
  } else if (column.prop == "name") {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        b.name.localeCompare(a.name, "zh")
      )
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        a.name.localeCompare(b.name, "zh")
      )
    }
  } else if (column.prop == "ip_address") {
    if (column.order === "descending") {
      cacheTerminalData.value = store.sortChangeData(1, cacheTerminalData.value)
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) => {
        let ip1 = a.ip_address.split('.').map((e: any) => e.padStart(3, '0')).join('')
        let ip2 = b.ip_address.split('.').map((e: any) => e.padStart(3, '0')).join('')
        return ip1 - ip2
      })
    }
  } else {
    if (column.order === "descending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        b.code - a.code
      )
    } else if (column.order === "ascending") {
      cacheTerminalData.value.sort((a: any, b: any) =>
        a.code - b.code
      )
    }
  }
  handleSizeChange(form.pageSize)
}

// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};

// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  form.currentPage = 1;
  form.data = cacheTerminalData.value.slice(0, form.pageSize * form.currentPage)
};

// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  form.data = cacheTerminalData.value.slice(form.pageSize * (form.currentPage - 1), form.pageSize * form.currentPage)
};

const getCurGroupData = () => {
  form.groupData = terminal_group_data.value
  let index = terminal_group_data.value.findIndex((item: any) => item.GroupID === form.current_group)
  storage_terminal_data.value = terminal_group_data.value[index].terminals
  cacheTerminalData.value = JSON.parse(JSON.stringify(store.filterGroupData(storage_terminal_data.value)))
  sortChange(sort_condition.value, sort_condition.value.prop, sort_condition.value.order)
  form.data = cacheTerminalData.value
  form.total = form.data.length
}

const getGroupList = () => {
  getCurGroupData()
}

// mounted 实例挂载完成后被调用
onMounted(() => {
  sort_condition.value = {
    prop: String(sort_map.get(system_configs.value.TerminalOrderbyType)),
    order: 'descending'
  }
  getGroupList()
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
