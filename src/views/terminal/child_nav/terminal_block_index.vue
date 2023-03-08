<!-- 
  @Author: hmf
  @CreateDate: 2022-07-29
  @FilePath: src\views\terminal\child_nav\terminal_block_index.vue
  @Describe: 终端状态-终端方块视图
-->
<template>
  <div
    class="com-index"
    v-loading="form.loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <div class="com-main">
      <div class="com-table">
        <ul class="group-ul">
          <li
            v-for="item in form.data"
            :key="item.EndPointID"
            :class="{
              selected: form.multipleSelection.includes(item.EndPointID),
              'four-six': form.layoutArrange == '4x6',
              'three-five': form.layoutArrange == '3x5',
              'three-six': form.layoutArrange == '3x6',
            }"
            @click="handleSelected(item)"
          >
            <div class="li-top">
              <span class="i-span">
                <span
                  class="iconfont"
                  :class="terminalsStatusMap.get(item.status)?.class"
                  :title="terminalsStatusMap.get(item.status)?.name"
                ></span>
              </span>
              <el-popover
                placement="left"
                trigger="click"
                popper-class="terminal-volume-popper"
                :disabled="item.status !== 1 && item.status !== 2"
                :persistent="false"
              >
                <el-slider v-model="item.volume" @change="changeVolume(item)" />
                <template #reference>
                  <div class="i-volume" @click.stop>
                    <span class="iconfont icon-volume"></span>
                    <span>{{ item.volume }}</span>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="li-center">
              <p class="name" :title="item.name">{{ item.name }}</p>
              <p :title="item.ip_address">{{ item.ip_address }}</p>
            </div>
            <div class="li-bottom">
              <span>{{ $t("Code") }} : {{ item.code }}</span>
              <div class="status">
                <div class="span" :class="terminalsBGStatusMap.get(item.status)">
                  <span>{{ terminalsStatusMap.get(item.status)?.name }}</span>
                  <!-- <span v-else>{{ item.sound_source_type }}</span> -->
                </div>
              </div>
            </div>
          </li>
        </ul>
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
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from "vue-router";
import { send } from "@/utils/socket";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const terminals = getStore.useTerminalsStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const basic_configs = computed(() => {
  return systemStore.basic_configs;
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

// 注入祖先组件供给的数据
const {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
}: any = inject("checkedAll");

const { select_terminal }: any = inject("select_terminal");
const { updateCheckedTerminals }: any = inject("checkedAll");

const form = reactive<any>({
  loading: false, // 等待加载数据状态
  search: "",
  selectRelayType: -1,
  selectStatusType: -1,
  data: [],
  currentPage: 1,
  pageSize: 18,
  total: 0,
  orderColumn: "Status",
  orderType: "desc",
  multipleSelection: [], // 已选择的分组
  layoutArrange: "3*6", // 布局排列
});
// 表格类型格式转换
const terminalsStatusMap = useFormatMap.terminalsStatusMap;
const terminalsBGStatusMap = new Map([
  [0, "off-line"],
  [1, "on-line"],
  [2, "be-busy"],
  [3, "frozen"],
  [4, "fault"],
]);
// 方块视图每页显示规格 0: 3x5 1:3x6 2:4x6
const pageSizeStatusMap = new Map([
  [0, { num: 15, string: "3x5" }],
  [1, { num: 18, string: "3x6" }],
  [2, { num: 24, string: "4x6" }],
]);
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
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  handleDefaultGet();
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
};
// 处理点击选择终端
const handleSelected = (item: { EndPointID: number }) => {
  if (form.multipleSelection.includes(item.EndPointID)) {
    form.multipleSelection = form.multipleSelection.filter(
      (row: number) => row !== item.EndPointID
    );
  } else {
    form.multipleSelection.push(item.EndPointID);
  }
  // 设置全选 - 使用provide/inject
  handleUpdateCheckedAll(form.multipleSelection.length === form.data.length);
  handleIsCheckedAll(false);
  updateCheckedTerminals(form.multipleSelection);
};
// 处理全选
const handleCheckedAll = () => {
  form.multipleSelection = [];
  for (let i = 0; i < form.data.length; i++) {
    form.multipleSelection.push(form.data[i].EndPointID);
  }
  updateCheckedTerminals(form.multipleSelection);
};
// 修改终端音量
const changeVolume = (data: any) => {
  let send_data = {
    company: "BL",
    actioncode: "c2ls_set_terminal_volume",
    token: "",
    data: {
      TerminalID: String(data.EndPointID),
      Volume: String(data.volume),
    },
    result: 0,
    return_message: "",
  };
  console.log("send_data", send_data);
  send(send_data);
};
// 处理设置默认获取条件
const handleGetDefaultCondition = () => {
  form.layoutArrange = pageSizeStatusMap.get(basic_configs.value.ListDisplaySize)?.string;
  form.pageSize = pageSizeStatusMap.get(basic_configs.value.ListDisplaySize)?.num;
};

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
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);

// 监听变化
watch(
  () => [
    terminalsStoreAll.value,
    terminalsStoreSearch.value,
    terminalsStoreStatus.value,
    equipmentListChangeNum.value,
    basic_configs.value,
  ],
  (
    [newAll, newSearch, newStatus, newNum, newBasic],
    [oldAll, oldSearch, oldStatus, oldNum, oldBasic]
  ) => {
    if (newBasic != oldBasic) {
      handleGetDefaultCondition();
      handleDefaultGet();
    }
    if (newNum != oldNum) {
      form.selectStatusType = newStatus;
      form.search = newSearch;
      handleGetOnePageData();
    }
    if (newAll != oldAll) {
      handleGetOnePageData();
    }
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

watch(select_terminal, (value) => {
  form.layoutArrange = value;
  form.pageSize = value.split("x")[0] * value.split("x")[1];
  handleDefaultGet();
});

// 监听路由
onBeforeRouteLeave((to, from) => {
  handleIsCheckedAll(false);
  handleUpdateCheckedAll(false);
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleGetDefaultCondition();
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped>
:deep(.el-pagination .el-pagination__sizes) {
  display: none;
}

.group-ul {
  height: 100%;
  // margin-top: 10px;
  box-sizing: border-box;
  border-radius: 6px;
  overflow: hidden;

  li {
    display: inline-block;
    width: calc(100% / 6);
    height: calc(100% / 3);
    border-bottom: 2px solid #ebf5ff;
    border-right: 2px solid #ebf5ff;
    box-sizing: border-box;
    background: $c-fff;
    cursor: pointer;

    .li-top {
      display: flex;
      align-items: center;
      height: calc(100% / 3 - 10px);
      margin: 0 12px 0 18px;

      .i-span {
        flex: 1;
        font-size: 20px;
      }

      .i-volume {
        text-align: right;
        color: $c-999;

        span {
          display: inline-block;
          margin-left: 6px;
        }
      }
    }

    .li-center {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      height: calc(100% / 3 + 10px);
      margin: 0 12px 0 18px;

      p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .name {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .li-bottom {
      display: flex;
      align-items: center;
      height: calc(100% / 3);
      margin-left: 18px;
      font-size: 12px;
      color: $c-666;

      > span {
        width: 50%;
      }

      .status {
        width: 50%;
        text-align: right;

        .span {
          float: right;
          max-width: 100%;
          min-width: 60px;
          height: 26px;
          line-height: 26px;
          padding: 0 10%;
          text-align: center;
          color: $c-fff;
          box-sizing: border-box;
          border-radius: 15px 0px 0px 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .four-six {
    height: calc(100% / 4);
  }

  .three-five {
    height: calc(100% / 3);
    width: calc(100% / 5);
  }

  .selected {
    background-color: #bbe0ff;
  }
}
</style>
