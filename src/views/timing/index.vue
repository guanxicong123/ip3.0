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
          <el-select v-model="form.selectType">
            <el-option
              v-for="item in sourceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="form.search" placeholder="任务名称" clearable />
          <el-button :icon="Search"></el-button>
          <el-button>重置</el-button>
        </div>
        <div class="com-button">
          <i class="iconfont icon-refresh" title="刷新"></i>
          <i class="iconfont icon-add" title="新建"></i>
          <i class="iconfont icon-clone" title="克隆"></i>
          <i class="iconfont icon-delete" title="批量删除"></i>
          <!-- <el-button type="primary" plain>导出任务</el-button> -->
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg">
      <div class="com-table">
        <el-table
          ref="multipleTableRef"
          :data="form.data"
          border
          style="width: 100%"
          height="100%"
          @selection-change="handleSelectionChange"
          :default-sort="{ prop: 'execute_time', order: 'ascending' }"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="com-card">
                <el-card> 开始日期: {{ props.row.start_date }} </el-card>
                <el-card> 结束日期: {{ props.row.end_date }} </el-card>
                <el-card> 任务音量: {{ props.row.volume }} </el-card>
                <el-card> 优先级: {{ props.row.priority }} </el-card>
                <el-card>
                  灯光模式:
                  {{ props.row.light ? props.row.light.name : "全关" }}
                </el-card>
                <el-card>
                  播放模式:
                  {{
                    props.row.type == 1
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
            width="50"
            :index="typeIndex"
          />
          <el-table-column prop="name" label="任务名称" show-overflow-tooltip />
          <el-table-column
            prop="execute_time"
            label="执行时间"
            sortable="custom"
            show-overflow-tooltip
          >
            <template #default="scope">
              <select class="custom-select" v-model="scope.row.execute_time">
                <option
                  v-for="(item, key) in scope.row.execute_time?.split(',')"
                  :key="key"
                  :disabled="true"
                >
                  {{ item }}
                </option>
              </select>
            </template>
          </el-table-column>
          <el-table-column prop="repeat_weeks" label="重复日期" />
          <el-table-column
            prop="life_time"
            label="播放时间/曲目"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span v-if="scope.row.task.sound_source">
                <template v-if="scope.row.task.sound_source?.life_time">
                  {{ scope.row.task.sound_source.life_time }}
                </template>
                <template v-if="scope.row.task.sound_source?.play_number">
                  {{ scope.row.task.sound_source.play_number }} 首
                </template>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="音源类型" />
          <el-table-column prop="task" label="音源">
            <template #default="scope">
              <template v-if="scope.row.task.type === 1">
                <el-button link type="primary">
                  <template #icon>
                    <i
                      class="iconfont icon-view-media"
                      title="查看媒体文件"
                    ></i>
                  </template>
                </el-button>
                <el-button link type="primary">
                  <template #icon>
                    <i
                      class="iconfont icon-view-media-folder"
                      title="查看媒体文件夹"
                    ></i>
                  </template>
                </el-button>
              </template>
              <template v-if="scope.row.task.type === 2">
                {{ scope.row.task.sound_source?.sound_card }}
              </template>
              <template v-if="scope.row.task.type === 3">
                <span
                  v-if="
                    scope.row.task &&
                    scope.row.task?.sound_source &&
                    scope.row.task?.sound_source?.terminals_name
                  "
                >
                  {{ scope.row.task.sound_source.terminals_name }}
                </span>
                <span v-else class="red"> 没有采集终端 </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="执行区域">
            <template #default>
              <el-button link type="primary">
                <template #icon>
                  <i class="iconfont icon-view-terminal" title="查看终端"></i>
                </template>
              </el-button>
              <el-button link type="primary">
                <template #icon>
                  <i class="iconfont icon-view-grouping" title="查看分组"></i>
                </template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button link type="primary" v-if="scope.row.disable === 1">
                <template #icon>
                  <i class="iconfont icon-enable-task" title="启用"></i>
                </template>
              </el-button>
              <el-button link type="danger" v-else>
                <template #icon>
                  <i class="iconfont icon-disable-task" title="禁用"></i>
                </template>
              </el-button>
              <el-button link type="primary">
                <template #icon>
                  <i class="iconfont icon-edit1" title="编辑"></i>
                </template>
              </el-button>
              <el-button link type="danger">
                <template #icon>
                  <i class="iconfont icon-delete" title="删除"></i>
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
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="form.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";
import { Search } from "@element-plus/icons-vue";

interface User {
  date: string;
  name: string;
  address: string;
}
const form = reactive({
  search: "",
  selectType: 0,
  data: [{}],
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const sourceTypeOptions = [
  { value: 0, label: "全部音源" },
  { value: 1, label: "音乐播放" },
  { value: 2, label: "声卡采集" },
  { value: 3, label: "终端采集" },
];
const playModelMap = new Map([
  [0, "列表播放"],
  [1, "循环播放"],
  [2, "随机播放"],
]);
const soundQualityMap = new Map([
  [1, "初级"],
  [2, "中级"],
  [3, "高级"],
]);
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

// mounted 实例挂载完成后被调用
onMounted(() => {
  form.data = [];
  for (let i = 0; i < 20; i++) {
    form.data.push({
      status: i,
      disable: i,
      priority: i,
      start_date: "2022-07-30",
      end_date: "2022-07-30",
      volume: i,
      type: 1,
      sound_source: {
        play_model: i,
      },
      name: "Tom",
      task: {
        type: i,
        name: "Tom",
      },
      address: "No. 189, Grove St, Los Angeles",
    });
  }
  form.total = form.data.length;
});
</script>

<style lang="scss" scoped></style>
