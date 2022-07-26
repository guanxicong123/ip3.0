<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\views\log\broadcast\index.vue
  @Describe: 广播日志
-->
<template>
  <div class="com-index">
    <div class="com-main">
      <div class="com-table">
        <el-table
          ref="multipleTableRef"
          :data="form.data"
          border
          style="width: 100%"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            label="No."
            show-overflow-tooltip
            width="50"
            :index="typeIndex"
          />
          <el-table-column
            prop="status"
            label="任务操作"
            show-overflow-tooltip
          />
          <el-table-column prop="launch_terminal" label="发起端" show-overflow-tooltip />
          <el-table-column prop="terminal" label="接收端" show-overflow-tooltip>
            <template #default="scope">
              <el-button link type="primary" @click="scope.row">
                <template #icon>
                  <i class="iconfont icon-view-terminal" title="查看终端"></i>
                </template>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="开始时间" show-overflow-tooltip />
          <el-table-column
            prop="terminal"
            label="结束时间(持续时间)"
            show-overflow-tooltip
          >
            <template #default="scope"> ({{ scope.row.life_time }}) </template>
          </el-table-column>
          <el-table-column prop="volume" label="备注" show-overflow-tooltip />
          <el-table-column
            prop="volume"
            label="日志级别"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button link type="danger" @click="scope.row">
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
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";

interface User {
  date: string;
  name: string;
  address: string;
}

const form = reactive<any>({
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
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
  for (let i = 0; i < 20; i++) {
    form.data.push({
      time: "2022-07-22",
      life_time: "00:20:00",
      status: i,
      terminal: [],
    });
  }
  form.total = form.data.length;
});
</script>

<style lang="scss" scoped></style>