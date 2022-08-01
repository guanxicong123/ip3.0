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
                  :class="$useRoute.params.id == item.id ? 'theme' : ''"
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
              border
              style="width: 100%"
              height="100%"
              @selection-change="handleSelectionChange"
              :default-sort="{ prop: 'status', order: 'ascending' }"
            >
              <el-table-column type="selection" width="44" />
              <el-table-column
                type="index"
                label="No."
                show-overflow-tooltip
                width="50"
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
  groupData: [
    {
      id: 0,
      name: "所有终端",
    },
    {
      id: 1,
      name: "分组1",
    },
    {
      id: 2,
      name: "分组2",
    },
    {
      id: 9,
      name: "分组3",
    },
  ],
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  currentGroupTitle: "全部",
  isShowNavBar: true, // 是否显示左侧导航栏
});
const terminalsStatusMap = new Map([
  [0, { class: "#icon-off-line", name: "离线" }],
  [1, { class: "#icon-on-line", name: "空闲" }],
  [2, { class: "#icon-executing", name: "忙碌" }],
  [3, { class: "#icon-freeze", name: "冻结" }],
  [4, { class: "#icon-fault", name: "故障" }],
]);
// 路由
let $useRouter = useRouter();
let $useRoute = useRoute();
const { checked_all }: any = inject("checkedAll");
// 处理点击切换分组
const handleClickGroup = (val: any) => {
  form.currentGroupTitle = val.name;
  $useRouter.push("/terminal/terminal_list/" + val.id);
};
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
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  form.currentPage = 1;
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
};
// 处理全选
const handleCheckedAll = () => {
  multipleSelection.value = [];
  multipleTableRef.value?.toggleAllSelection();
  for (let i = 0; i < form.data.length; i++) {
    multipleSelection.value.push(form.data[i]);
  }
};
// 处理取消全选
const handleCancelCheckedAll = () => {
  multipleSelection.value = [];
  multipleTableRef.value?.clearSelection();
};

watch(
  checked_all,
  (value) => {
    value ? handleCheckedAll() : handleCancelCheckedAll();
  },
  {
    // 初始化立即执行
    immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  for (let i = 0; i < 20; i++) {
    form.data.push({
      status: i < 5 ? i : 0,
      name: "终端" + i,
      volume: i,
      task: {
        type: i,
        name: "Tom",
      },
      ip_address: "No. 189, Grove St, Los Angeles",
    });
  }
  form.total = form.data.length;
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
