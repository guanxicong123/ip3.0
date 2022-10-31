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
              :key="item.GroupID"
              :class="{
                selected: form.multipleSelection.includes(item.GroupID),
              }"
              @click="handleSelected(item)"
              @dblclick="viewGroupInfo(item)"
            >
              <span
                class="li-span"
                :title="terminalsStatusMap.get(item.status)?.name"
              >
                <svg class="icon" aria-hidden="true">
                  <use
                    :xlink:href="terminalsStatusMap.get(item.status)?.class"
                  ></use>
                </svg>
              </span>
              <div class="li-text">
                <span :title="item.GroupName">{{ item.GroupName }}</span>
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
        :page-sizes="[10, 20, 50, 100]"
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
        height="195px"
      >
        <el-table-column
          type="index"
          label="序号"
          show-overflow-tooltip
          width="60"
          :index="typeIndex"
        />
        <el-table-column prop="name" label="终端名称" show-overflow-tooltip />
        <el-table-column
          prop="ip_address"
          label="终端IP"
          show-overflow-tooltip
        />
        <el-table-column prop="code" label="呼叫编码" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from "vue-router";
import { ElTable } from "element-plus";

const form = reactive<any>({
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  multipleSelection: [], // 已选择的分组
  table_data: [],
});

const show_group_info = ref(false);

const group_title = ref("");

const terminalsStatusMap = new Map([
  [0, { class: "#icon-off-line", name: "离线" }],
  [1, { class: "#icon-on-line", name: "空闲" }],
  [2, { class: "#icon-executing", name: "忙碌" }],
  [3, { class: "#icon-freeze", name: "冻结" }],
  [4, { class: "#icon-fault", name: "故障" }],
]);
// 注入祖先组件供给的数据
const {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
  updateCheckedTerminals,
}: any = inject("checkedAll");

const { terminal_group_data }: any = inject("terminal_group");

const store = getStore.useTerminalStore();

const search_value = computed(() => {
  return store.search_value;
});

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

// 处理点击选择分组
const handleSelected = (item: { GroupID: number }) => {
  if (form.multipleSelection.includes(item.GroupID)) {
    form.multipleSelection = form.multipleSelection.filter(
      (row: number) => row !== item.GroupID
    );
  } else {
    form.multipleSelection.push(item.GroupID);
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
    let index = form.data.findIndex((add: { GroupID: number }) => {
      return add.GroupID === item;
    });
    if (index > -1) {
      terminals_arr = terminals_arr.concat(form.data[index].terminals);
    }
  });
  terminals_arr.map((item: any) => {
    checked_terminals_ids.push(item.EndpointID);
  });
  updateCheckedTerminals(checked_terminals_ids);
};

// 分组终端详情显示
const viewGroupInfo = (item: { GroupName: string; terminals: object }) => {
  show_group_info.value = true;
  group_title.value = item.GroupName;
  form.table_data = item.terminals;
};

const typeIndex = (index: number) => {
  return index + 1;
};

// 处理全选
const handleCheckedAll = () => {
  form.multipleSelection = [];
  for (let i = 0; i < form.data.length; i++) {
    form.multipleSelection.push(form.data[i].GroupID);
  }
  cleanCheckedTerminalIds();
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

// 监听路由
onBeforeRouteLeave((to, from) => {
  handleIsCheckedAll(false);
  handleUpdateCheckedAll(false);
});

// 监听
watch(
  checked_all,
  (value) => {
    value
      ? handleCheckedAll()
      : setTimeout(() => {
          is_checked_all.value ? (form.multipleSelection = []) : "";
        }, 200);
  },
  {
    // 初始化立即执行
    immediate: true,
    deep: true,
  }
);

watch(
  () => search_value.value,
  () => {
    getGroupList();
  }
);

const getGroupList = () => {
  form.data = store
    .filterGroupData(terminal_group_data.value)
    .filter((item: any) => {
      return item.GroupID !== 0;
    });
  form.total = form.data.length;
  // 给分组手动添加状态，等后续增加分组状态字段再去除
  form.data.map((item: any) => {
    item.status = 1;
  });
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  getGroupList();
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
      padding: 18px 12px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      color: #b17f05;
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
