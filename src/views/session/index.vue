<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\session\index.vue
  @Describe: 会话状态
-->
<template>
    <div class="com-index">
        <div class="com-head set-padding">
            <div class="com-head-content">
                <div class="com-breadcrumb">
                    <el-select v-model="form.selectType">
                        <el-option v-for="item in sessionOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="form.search" placeholder="任务名称/发起方/响应方" clearable />
                    <el-button :icon="Search"></el-button>
                    <el-button>重置</el-button>
                </div>
                <div class="com-button"></div>
            </div>
        </div>
        <div class="com-main com-m-bg">
            <div class="com-table">
                <el-table ref="multipleTableRef" :data="form.data" border style="width: 100%" height="100%"
                    @selection-change="handleSelectionChange"
                    :default-sort="{ prop: 'TaskBeginTime', order: 'descending' }">
                    <el-table-column type="index" label="No." show-overflow-tooltip width="50" :index="typeIndex" />
                    <el-table-column prop="TaskName" label="任务名称" show-overflow-tooltip />
                    <el-table-column prop="TaskType" label="会话类型" />
                    <el-table-column prop="TaskIniator" label="发起方" />
                    <el-table-column prop="EndpointIpListArray" label="响应方">
                        <template #default="scope">
                            {{ scope.row.EndpointIpListArray }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="TaskVolume" label="任务音量" />
                    <el-table-column prop="TaskBeginTime" label="会话进行时间" sortable="custom" />
                    <el-table-column prop="IsMonitor" label="监听状态" />
                    <el-table-column label="操作" width="120">
                        <template #default>
                            <el-button link type="danger">
                                <template #icon>
                                    <i class="iconfont icon-end" title="结束任务"></i>
                                </template>
                            </el-button>
                            <el-button link type="primary">
                                <template #icon>
                                    <i class="iconfont icon-headset" title="点击监听"></i>
                                </template>
                            </el-button>
                            <!-- <el-button link type="danger">
                <template #icon>
                  <i class="iconfont icon-headphones-disabled" title="取消监听"></i>
                </template>
              </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="com-footer com-m-bg" v-if="form.data.length > 0">
            <el-pagination v-model:currentPage="form.currentPage" v-model:page-size="form.pageSize"
                :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="form.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
const sessionOptions = [
    { value: 0, label: "全部类型" },
    { value: 21, label: "火警" },
    { value: 15, label: "报警" },
    { value: 19, label: "对讲" },
    { value: 16, label: "广播" },
    { value: 18, label: "电话广播" },
    { value: 22, label: "定时巡更" },
    { value: 14, label: "定时任务" },
    { value: 13, label: "定时打铃" },
    { value: 12, label: "遥控任务" },
    { value: 11, label: "文本播放" },
    { value: 9, label: "短路输入" },
    { value: 8, label: "防拆报警" },
    { value: 7, label: "音源采集" },
    { value: 5, label: "音乐播放" },
    { value: 4, label: "终端点播" },
    { value: 2, label: "环境监听" },
    { value: 1, label: "任务监听" },
];
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
            TaskVolume: i,
            TaskType: i,
            TaskName: "Tom",
            TaskIniator: "Grove St",
        });
    }
});
</script>

<style lang="scss" scoped>

</style>
