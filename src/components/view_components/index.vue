<!-- 
  @Author: hmf
  @CreateDate: 2022-09-03
  @FilePath: src\components\view_components\index.vue
  @Describe: popover 查看组件-终端/分组、媒体/媒体文件夹等等
-->
<template>
  <div class="com-view-components">
    <!-- 默认不渲染 element popover 组件-->
    <template v-if="form.init">
      <el-popover
        ref="popoverRef"
        :virtual-ref="viewRef"
        :width="config.width"
        :placement="config.placement"
        trigger="click"
        virtual-triggering
        popper-class="view-components-popover"
        @show="handleGetOnePageData"
      >
        <div class="com-index view-components" :style="'height:' + config.height + 'px'">
          <div class="com-head">
            <div class="com-head-content com-hc-bg">
              <div class="com-title">{{ config.tableTitle }}</div>
              <div class="com-breadcrumb">
                <el-input
                  v-model="paramsConfig.likeName"
                  :placeholder="config.searchPlaceholder"
                  clearable
                  @clear="handleDefaultGet"
                />
                <el-button
                  :icon="Search"
                  :disabled="paramsConfig.likeName == ''"
                  @click="handleDefaultGet"
                ></el-button>
                <el-button :disabled="paramsConfig.likeName == ''" @click="handleReset">
                  {{ $t("Reset") }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="com-main">
            <div class="com-table">
              <el-table
                :data="form.data"
                border
                height="100%"
                @sort-change="handleSortChange"
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
                <el-table-column
                  v-for="item in config.showTableColumn"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                />
              </el-table>
            </div>
          </div>
          <div class="com-footer" v-if="form.data.length > 0">
            <el-pagination
              v-model:currentPage="paramsConfig.page"
              v-model:page-size="paramsConfig.limit"
              :page-sizes="proxy.$user?.config?.pageRule"
              layout="total, sizes, prev, pager, next, jumper"
              :total="form.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-popover>
      <i
        ref="viewRef"
        :id="form.popover"
        class="iconfont"
        :class="config.iconfont"
        :title="config.iconTitle"
        v-click-outside="onClickOutside"
      ></i>
    </template>
    <!-- 默认渲染图标 -->
    <i
      v-else
      class="iconfont"
      :class="config.iconfont"
      @click.stop="initLoad"
      :title="config.iconTitle"
    ></i>
  </div>
</template>

<script lang="ts" setup>
import { ClickOutside as vClickOutside, ElTable, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import $http from "@/utils/axios/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "paramsConfig", // 请求参数配置
  "url", // 请求接口的url
  "fastTerminalsID", // 快捷终端id
  "fastSoundID", // 快捷音源id
  "zone", // 采集分区
  "mediasGroupsID", //媒体分组
  "pressKey", // 功能按键
]);

// 插件配置
let config = reactive<any>({
  iconfont: "icon-terminals1", // 字体图标
  iconTitle: proxy.$t("View terminal"), // icon title
  tableTitle: proxy.$t("Terminal"), // 表格顶部 title
  width: 540, // 宽度
  height: 265, // 高度
  placement: "bottom", // 出现位置
  searchPlaceholder: proxy.$t("Terminal name") + "/" + proxy.$t("Terminal IP"), // 搜索框 placeholder
  showTableColumn: [
    { prop: "name", label: proxy.$t("Terminal name") },
    { prop: "ip_address", label: proxy.$t("Terminal IP") },
    { prop: "call_code", label: proxy.$t("Call code") },
  ], // 显示的表格列
});
// 分页参数配置
let paramsConfig = reactive<any>({
  orderColumn: "id",
  orderType: "asc",
  page: 1, // 前往 1 页
  limit: 20, // 20条/页
  likeName: "", // 搜索
  fastTerminalsId: parentData.fastTerminalsID, // 快捷终端id
  fastSoundId: parentData.fastSoundID, // 快捷音源id
  zone: parentData.zone, // 采集分区
  medias_groups_id: parentData.mediasGroupsID, // 媒体分组
  press_key: parentData.pressKey, // 功能按键
});

const form = reactive<any>({
  init: false,
  popover: Math.random().toString(), // 随机生成小数点
  data: [],
  total: 0,
  loading: false, // 等待加载数据状态
});
// 获取refs
const viewRef = ref();
const popoverRef = ref();
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 点击虚拟元素触发 Popover
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
// 处理点击初始化加载
const initLoad = () => {
  form.init = true;
  nextTick(() => {
    return document.getElementById(form.popover)?.click();
  });
};
// 序号
const typeIndex = (index: number) => {
  return index + (paramsConfig.page - 1) * paramsConfig.limit + 1;
};
// 处理获取一页数据
const handleGetOnePageData = async () => {
  form.loading = true;
  $http(parentData.url, {
    method: "get",
    responseType: "json",
    params: {
      ...paramsConfig,
    },
  })
    .then((result: any) => {
      if (result?.data) {
        form.data = result.data.data;
        form.total = result.data.total;
      } else {
        ElMessage({
          type: "error",
          message: result?.return_message,
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
  paramsConfig.page = 1;
  handleGetOnePageData();
};
// 处理重置
const handleReset = () => {
  paramsConfig.likeName = "";
  handleDefaultGet();
};
// 处理排序
const handleSortChange = (row: { prop: any; order: string | string[] }) => {
  paramsConfig.orderColumn = row.prop;
  paramsConfig.orderType = !row.order || row.order?.indexOf("desc") >= 0 ? "desc" : "asc";
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  paramsConfig.limit = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  paramsConfig.page = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
  paramsConfig = Object.assign(
    paramsConfig,
    parentData.paramsConfig ? parentData.paramsConfig : {}
  );
});
</script>

<style lang="scss" scoped>
.com-view-components {
  display: inline-flex;
}

.com-view-components + .com-view-components {
  margin-left: 12px;
}

.view-components {
  .com-title {
    font-size: 14px;
    font-weight: bold;
    width: calc(100% - 350px);
    padding-left: 10px;
  }

  .com-breadcrumb {
    padding-right: 10px;
  }

  .com-footer {
    padding-bottom: 0;

    :deep(.el-pagination__sizes) {
      display: none;
    }
  }

  .com-main .com-table {
    padding: 10px 0;
  }
}
</style>
