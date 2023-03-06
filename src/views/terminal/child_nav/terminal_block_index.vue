<!-- 
  @Author: hmf
  @CreateDate: 2022-07-29
  @FilePath: src\views\terminal\child_nav\terminal_block_index.vue
  @Describe: 终端状态-终端方块视图
-->
<template>
  <div class="com-index">
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
        :page-sizes="form.pageSizes"
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

const form = reactive<any>({
  data: [],
  currentPage: 1,
  pageSizes: [18], // 一页/x条
  pageSize: 20,
  total: 0,
  multipleSelection: [], // 已选择的分组
  layoutArrange: "3*6", // 布局排列
});

const terminalsStatusMap = useFormatMap.terminalsStatusMap;
const terminalsBGStatusMap = new Map([
  [0, "off-line"],
  [1, "on-line"],
  [2, "be-busy"],
  [3, "frozen"],
  [4, "fault"],
]);
// 注入祖先组件供给的数据
const {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
}: any = inject("checkedAll");

const storage_terminal_data = ref();

const store = getStore.useTerminalStore();

const terminal_data = computed(() => {
  return store.terminal_data;
});

const terminal_status = computed(() => {
  return store.terminal_status;
});

const search_value = computed(() => {
  return store.search_value;
});

const cacheTerminalData: any = [];

watch(
  () => terminal_data.value,
  (newVal) => {
    storage_terminal_data.value = newVal;
    cacheTerminalData.value = store.defaultTerminalSort(filterData());
    form.data = cacheTerminalData.value;
    form.total = form.data.length;
  }
);

watch(
  () => terminal_status.value,
  () => {
    cacheTerminalData.value = store.defaultTerminalSort(filterData());
    form.data = cacheTerminalData.value;
    form.total = form.data.length;
  }
);

watch(
  () => search_value.value,
  () => {
    cacheTerminalData.value = store.defaultTerminalSort(filterData());
    form.data = cacheTerminalData.value;
    form.total = form.data.length;
  }
);

const { select_terminal }: any = inject("select_terminal");

const { updateCheckedTerminals }: any = inject("checkedAll");

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
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
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

const filterData = () => {
  let condition = terminal_status.value === -1 && search_value.value === "";
  if (condition) {
    return storage_terminal_data.value;
  } else {
    let data = storage_terminal_data.value.filter((item: any) => {
      return (
        (item.Status === terminal_status.value || terminal_status.value === -1) &&
        (item.name.match(search_value.value) || search_value.value === "")
      );
    });
    return data;
  }
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

watch(select_terminal, (value) => {
  form.pageSize = value.split("x")[0] * value.split("x")[1];
  handleSizeChange(form.pageSize);
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  form.layoutArrange = select_terminal;
  form.pageSizes = [form.layoutArrange.split("x")[0] * form.layoutArrange.split("x")[1]];
  form.pageSize = form.pageSizes[0];
  storage_terminal_data.value = terminal_data.value;
  cacheTerminalData.value = store.defaultTerminalSort(filterData());
  form.data = cacheTerminalData.value;
  form.total = form.data.length;
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
