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
            :key="item.id"
            :class="{
              selected: form.multipleSelection.includes(item.id),
              'four-six': form.layoutArrange == '4*6',
              'three-five': form.layoutArrange == '3*5',
            }"
            @click="handleSelected(item)"
          >
            <div class="li-top">
              <span
                class="i-span"
                :title="terminalsStatusMap.get(item.status)?.name"
              >
                <svg class="icon" aria-hidden="true">
                  <use
                    :xlink:href="terminalsStatusMap.get(item.status)?.icon"
                  ></use>
                </svg>
              </span>
              <div class="i-volume">
                <span class="iconfont icon-volume"></span>
                <span>{{ item.volume }}</span>
              </div>
            </div>
            <div class="li-center">
              <p class="name" :title="item.name">{{ item.name }}</p>
              <p :title="item.ip_address">{{ item.ip_address }}</p>
            </div>
            <div class="li-bottom">
              <span>编码 : {{ item.code }}</span>
              <div class="status">
                <div
                  class="span"
                  :class="terminalsStatusMap.get(item.status)?.class"
                >
                  <span v-if="item.status != 2">{{
                    terminalsStatusMap.get(item.status)?.name
                  }}</span>
                  <span v-else>{{ item.sound_source_type }}</span>
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

const form = reactive<any>({
  data: [],
  currentPage: 1,
  pageSizes: [18], // 一页/x条
  pageSize: 20,
  total: 0,
  multipleSelection: [], // 已选择的分组
  layoutArrange: "4*6", // 布局排列
});
const terminalsStatusMap = new Map([
  [0, { icon: "#icon-off-line", name: "离线", class: "off-line" }],
  [1, { icon: "#icon-on-line", name: "空闲", class: "on-line" }],
  [2, { icon: "#icon-executing", name: "忙碌", class: "be-busy" }],
  [3, { icon: "#icon-freeze", name: "冻结", class: "frozen" }],
  [4, { icon: "#icon-fault", name: "故障", class: "fault" }],
]);
// 注入祖先组件供给的数据
const {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
}: any = inject("checkedAll");
// 处理点击选择分组
const handleSelected = (item: { id: number }) => {
  if (form.multipleSelection.includes(item.id)) {
    form.multipleSelection = form.multipleSelection.filter(
      (row: number) => row != item.id
    );
  } else {
    form.multipleSelection.push(item.id);
  }
  // 设置全选 - 使用provide/inject
  handleUpdateCheckedAll(form.multipleSelection.length == form.data.length);
  handleIsCheckedAll(false);
};
// 处理全选
const handleCheckedAll = () => {
  form.multipleSelection = [];
  for (let i = 0; i < form.data.length; i++) {
    form.multipleSelection.push(form.data[i].id);
  }
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

// mounted 实例挂载完成后被调用
onMounted(() => {
  for (let i = 0; i < 24; i++) {
    form.data.push({
      id: i,
      status: i < 5 ? i : 0,
      volume: i,
      name: "终端 + 终端" + i,
      ip_address: "172.161.121." + i,
      code: "172" + i,
      sound_source_type: "音乐播放",
    });
  }
  form.total = form.data.length;
});
</script>

<style lang="scss" scoped>
:deep(.el-pagination .el-pagination__sizes) {
  display: none;
}
.group-ul {
  height: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  border-radius: 6px;
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
        font-size: 20px;
      }
      .i-volume {
        flex: 1;
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
    width: calc(100% / 5);
  }
  .selected {
    background-color: #bbe0ff;
  }
}
</style>
