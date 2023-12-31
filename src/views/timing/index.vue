<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\terminal\index.vue
  @Describe: 定时任务
-->
<template>
  <div class="com-index">
    <div class="com-head set-padding">
      <div class="com-head-content">
        <div class="com-breadcrumb">
          <el-select v-model="form.selectType" @change="handleDefaultGet">
            <template v-for="item in sourceTypeOptions" :key="item.value">
              <el-option
                v-if="item.value != 5"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
          <el-input
            v-model="form.search"
            :placeholder="$t('Task name')"
            clearable
            @clear="handleDefaultGet"
            @keyup.enter="
              useCommonTable.handleKeyupEnter(form.search, handleDefaultGet)
            "
            @change="
              useCommonTable.handleKeyupDelete(form.search, handleDefaultGet)
            "
          />
          <el-button
            :icon="Search"
            :disabled="form.search == ''"
            @click="handleDefaultGet"
          ></el-button>
          <el-button
            :disabled="form.search == '' && form.selectType == 0"
            @click="handleReset"
          >
            {{ $t("Reset") }}
          </el-button>
        </div>
        <div class="com-button">
          <i
            class="iconfont icon-refresh"
            :title="$t('Refresh')"
            @click="handleGetOnePageData"
          ></i>
          <i
            class="iconfont icon-add"
            :title="$t('Newly build')"
            @click="usePublicMethod.clickJump($useRoute.path, 0)"
          ></i>
          <i
            class="iconfont icon-clone"
            :class="{ 'icon-disabled': multipleSelection.length == 0 }"
            :title="$t('Clone')"
            @click="handleCloneTask"
          ></i>
          <i
            class="iconfont icon-delete"
            :class="{ 'icon-disabled': multipleSelection.length == 0 }"
            :title="$t('Batch deletion')"
            @click="handleDelete('batch', 0)"
          ></i>
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg">
      <div class="com-table">
        <el-table
          ref="multipleTableRef"
          :data="form.data"
          border
          height="100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          :default-sort="{ prop: 'execute_time', order: 'ascending' }"
          v-loading="form.loading"
          element-loading-text="Loading..."
          element-loading-background="rgba(0, 0, 0, 0.7)"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="com-card">
                <el-card>
                  {{ $t("Start date") }}: {{ props.row.start_date }}
                </el-card>
                <el-card>
                  {{ $t("End date") }}: {{ props.row.end_date }}
                </el-card>
                <el-card>
                  {{ $t("Task volume") }}: {{ props.row.volume }}
                </el-card>
                <el-card>
                  {{ $t("Priority") }}: {{ props.row.priority }}
                </el-card>
                <el-card>
                  {{ $t("Light mode") }}:
                  {{
                    props.row.light ? props.row.light.name : $t("Full close")
                  }}
                </el-card>
                <el-card>
                  {{
                    props.row.type == 1 || props.row.type == 4
                      ? $t("Play mode")
                      : $t("Tone quality")
                  }}
                  :
                  {{
                    props.row.type == 1 || props.row.type == 4
                      ? playModelMap.get(props.row.sound_source?.play_model)
                      : soundQualityMap.get(
                          props.row.sound_source?.sound_quality
                        )
                  }}
                </el-card>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="No."
            show-overflow-tooltip
            width="60"
            :index="typeIndex"
          />
          <el-table-column
            prop="name"
            :label="$t('Task name')"
            show-overflow-tooltip
          />
          <el-table-column
            prop="execute_time"
            :label="$t('Execution time')"
            sortable="custom"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-dropdown
                placement="left-start"
                :max-height="234"
                class="custom-dropdown"
              >
                <span class="theme">
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  {{ scope.row.execute_time?.split(",")?.[0] }}
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, key) in scope.row.execute_time?.split(',')"
                      :key="key"
                    >
                      {{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            prop="repeat_weeks"
            :label="$t('Repeat date')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <!-- 显示周/日期 -->
              <el-dropdown
                placement="left-start"
                :max-height="234"
                class="custom-dropdown"
              >
                <span class="theme">
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  {{
                    scope.row.time_type === 0 ? $t("By week") : $t("By date")
                  }}
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, key) in scope.row.time_type === 0
                        ? scope.row.repeat_weeks
                        : scope.row.assign_dates"
                      :key="key"
                    >
                      {{
                        scope.row.time_type === 0
                          ? weeksMap.get(item.repeat_weeks)
                          : item.dates
                      }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            prop="life_time"
            :label="$t('Play time') + '/' + $t('Song')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <template v-if="scope.row.sound_source?.life_time">
                {{ scope.row.sound_source.life_time }}
              </template>
              <template v-if="scope.row.sound_source?.play_number">
                {{ scope.row.sound_source.play_number }} {{ $t("Songs") }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('Sound type')"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ audioSourceMap.get(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sound_source"
            :label="$t('Sound source')"
            show-overflow-tooltip
          >
            <template #default="scope">
              <template
                v-if="
                  scope.row.type === 1 ||
                  (scope.row.type === 4 && scope.row.sound_source.type === 1)
                "
              >
                <view-components-popover
                  :myConfig="mediaConfig"
                  :url="'/timing-tasks/' + scope.row.id + '/medias'"
                  :fastSoundID="scope.row.fast_sound_id"
                />
                <view-components-popover
                  :myConfig="folderConfig"
                  :url="'/timing-tasks/' + scope.row.id + '/medias-groups'"
                  :fastSoundID="scope.row.fast_sound_id"
                />
              </template>
              <!-- 音源采集 -->
              <template v-if="scope.row.type === 23">
                <!-- 声卡采集 or 终端采集 -->
                <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="curstom-el-popper"
                  :content="
                    scope.row.sound_source?.sound_card ||
                    scope.row.sound_source?.terminals_name
                  "
                  v-if="
                    scope.row.sound_source?.sound_card ||
                    scope.row.sound_source?.terminals_name
                  "
                >
                  <template #reference>
                    <i class="iconfont icon-view-collection-terminal"></i>
                  </template>
                </el-popover>
                <span
                  class="red"
                  v-if="
                    !scope.row.sound_source?.sound_card &&
                    !scope.row.sound_source?.terminals_name
                  "
                >
                  {{ $t("No sound source") }}
                </span>
              </template>
              <!-- 快捷音源 -->
              <template v-if="scope.row.type === 4">
                <!-- 声卡采集 or 终端采集 -->
                <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="curstom-el-popper"
                  :content="
                    scope.row.fast_sound?.fast_source?.sound_card ||
                    scope.row.fast_sound?.fast_source?.terminals_name
                  "
                  v-if="
                    scope.row.fast_sound?.type != 1 &&
                    (scope.row.fast_sound?.fast_source?.sound_card ||
                      scope.row.fast_sound?.fast_source?.terminals_name)
                  "
                >
                  <template #reference>
                    <i class="iconfont icon-view-collection-terminal"></i>
                  </template>
                </el-popover>
                <span
                  class="red"
                  v-if="
                    scope.row.sound_source?.type != 1 &&
                    !scope.row.fast_sound?.fast_source?.sound_card &&
                    !scope.row.fast_sound?.fast_source?.terminals_name
                  "
                >
                  {{ $t("No sound source") }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="area" :label="$t('Execution area')">
            <template #default="scope">
              <view-components-popover
                :url="'/timing-tasks/' + scope.row.id + '/terminals'"
                :fastTerminalsID="scope.row.fast_terminals_id"
              />
              <view-components-popover
                :myConfig="groupConfig"
                :url="'/timing-tasks/' + scope.row.id + '/terminals-groups'"
                :fastTerminalsID="scope.row.fast_terminals_id"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('Operation')" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                v-if="scope.row.is_done === 0"
                @click="handleEnableOrDisable(scope.row)"
              >
                <template #icon>
                  <i
                    class="iconfont icon-enable-task"
                    :title="$t('Enable')"
                  ></i>
                </template>
              </el-button>
              <el-button
                link
                type="danger"
                v-else
                @click="handleEnableOrDisable(scope.row)"
              >
                <template #icon>
                  <i
                    class="iconfont icon-disable-task"
                    :title="$t('Disable')"
                  ></i>
                </template>
              </el-button>
              <el-button link type="primary">
                <template #icon>
                  <i
                    class="iconfont icon-edit"
                    :title="$t('Edit')"
                    @click="
                      usePublicMethod.clickJump($useRoute.path, scope.row.id)
                    "
                  ></i>
                </template>
              </el-button>
              <el-button link type="danger">
                <template #icon>
                  <i
                    class="iconfont icon-delete"
                    :title="$t('Delete')"
                    @click="handleDelete('single', scope.row)"
                  ></i>
                </template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="44" />
        </el-table>
      </div>
    </div>
    <div class="com-footer com-m-bg" v-if="form.data.length > 0">
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
    <!-- 克隆任务 -->
    <clone-timing-task
      :isShow="form.cloneDialogVisible"
      :editInfor="multipleSelection"
      @show="handleCloneDialogVisible"
      @success="handleCloneSuccessCallback"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElMessage, ElMessageBox } from "element-plus";
import { Search, ArrowDown } from "@element-plus/icons-vue";
import usePublicMethod from "@/utils/global/index";
import useCommonTable from "@/utils/global/common_table_search";
import { TasksService } from "@/utils/api/task/index";

// defineAsyncComponent 异步组件-懒加载子组件
const cloneTimingTask = defineAsyncComponent(
  () => import("./components/clone_timing_task.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

interface User {
  id: number;
  name: string;
  repeat_weeks: number;
}

const user = getStore.useUserStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const userStore = computed(() => {
  return user.user.user;
});
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Timer_PageSize;
});

const form = reactive({
  search: "",
  selectType: 0,
  data: [],
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  orderColumn: "execute_time",
  orderType: "asc",
  loading: false, // 等待加载数据状态
  cloneDialogVisible: false, // 是否显示克隆任务弹窗
});
const sourceTypeOptions = useFormatMap.audioSourceTypeOptions;
// 表格类型格式转换
const playModelMap = useFormatMap.playModelMap;
const soundQualityMap = useFormatMap.soundQualityMap;
const audioSourceMap = useFormatMap.audioSourceTypeMap;
const weeksMap = useFormatMap.weeksTypeMap;
// 路由
const $useRoute = useRoute();
// 获取refs
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
// 处理获取一页数据
const handleGetOnePageData = async () => {
  form.loading = true;
  await TasksService.getOnePageTasks({
    type: form.selectType,
    likeName: form.search,
    page: form.currentPage,
    limit: form.pageSize,
    orderColumn: form.orderColumn,
    orderType: form.orderType,
    withLight: true,
    withFastSound: true,
  })
    .then((result) => {
      if (result.data.data) {
        form.data = result.data.data;
        form.total = result.data.total;
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
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
  form.currentPage = 1;
  handleGetOnePageData();
};
// 处理重置
const handleReset = () => {
  form.search = "";
  form.selectType = 0;
  handleDefaultGet();
};
// 处理排序
const handleSortChange = (row: { prop: any; order: string | string[] }) => {
  form.orderColumn = row.prop;
  form.orderType =
    !row.order || row.order?.indexOf("desc") >= 0 ? "desc" : "asc";
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  systemStore.updateSystemSize({
    key: "Timer_PageSize",
    val,
  });
  form.pageSize = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理删除
const handleDelete = (type: string, row: any) => {
  // batch: 批量删除，single：单个删除
  if (type === "batch" && multipleSelection.value.length == 0) {
    return;
  }
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let ids = [];
      type === "batch"
        ? multipleSelection.value.map((item) => {
            ids.push(item.id);
          })
        : ids.push(row.id);
      TasksService.deleteTasks({
        ids: ids,
      })
        .then((result) => {
          if (result.data) {
            // 假如删除完本页数据，form.currentPage减去一页再更新数据
            if (form.data.length <= ids.length && form.currentPage > 1) {
              form.currentPage--;
            }
            handleGetOnePageData();
            ElMessage({
              type: "success",
              message: proxy.$t("Delete succeeded"),
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.return_message || proxy.$t("Delete failed"),
              grouping: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {});
};
// 处理启用or停用任务
const handleEnableOrDisable = (row: any) => {
  const status = row.is_done === 0 ? 1 : 0;
  TasksService.putTasks(
    {
      type: row.true_type,
      is_done: status,
    },
    row.id
  )
    .then((result) => {
      if (Object.prototype.hasOwnProperty.call(result.data, "id")) {
        row.is_done = status;
        ElMessage({
          type: "success",
          message:
            status === 1
              ? proxy.$t("Enabled succeeded")
              : proxy.$t("Disable succeeded"),
          grouping: true,
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
// 处理点击克隆任务
const handleCloneTask = () => {
  if (multipleSelection.value.length < 1) {
    return;
  }
  form.cloneDialogVisible = true;
};
// 处理新建-编辑克隆任务弹窗的响应展示/关闭
const handleCloneDialogVisible = (value: boolean) => {
  form.cloneDialogVisible = value;
};
// 处理编辑克隆任务弹窗的成功回调
const handleCloneSuccessCallback = () => {
  handleDefaultGet();
};
// 查看组件插件配置
const groupConfig = useConfig.groupConfig;
const mediaConfig = useConfig.mediaConfig;
const folderConfig = useConfig.mediaFolderConfig;

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleGetOnePageData();
});
</script>

<style lang="scss" scoped></style>
