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
                    <el-select v-model="form.selectType" @change="handleSearch">
                        <el-option
                            v-for="item in sessionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                    <el-input v-model="form.search" placeholder="任务名称/发起方/响应方" clearable />
                    <el-button :icon="Search" @click="handleSearch"></el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </div>
                <div class="com-button">
                    <span>监听音响</span>
                    <el-popover
                            placement="bottom"
                            :width="400"
                            trigger="click"
                            popper-class="select-monitor-terminal"
                        >
                        <template #reference>
                            <el-button style="margin-right: 16px">{{selectTerminalMac.EndPointIP ? selectTerminalMac.EndPointIP : '请选择监听终端'}}</el-button>
                        </template>
                        <div>
                            <div class="monitor-terminal-header">
                                <span class="monitor-terminal-number">{{`终端(共 ` + terminal_data.length + ' 条)'}}</span>
                                <el-input v-model="form.search" placeholder="终端名称/终端IP" clearable />
                            </div>
                            <el-table
                                class="monitor-terminal-table"
                                :data="terminal_data"
                                :max-height="300"
                                size="small"
                                @row-click="handelSelectRow"
                                :row-class-name="tableRowClassName">
                                <el-table-column label="名称">
                                    <template #default="scope">
                                        <div class="monitor-terminal-name">
                                            <span class="iconfont" :class="terminalStatus.get(scope.row.Status)"></span>
                                            <span class="terminal-name">{{scope.row.EndPointName}}</span>
                                            <span class="iconfont" :class="{'icon-selected': selectTerminalMac.EndPointMac === scope.row.EndPointMac}"></span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column property="EndPointIP" label="IP地址" />
                            </el-table>
                        </div>
                    </el-popover>
                </div>
            </div>
        </div>
        <div class="com-main com-m-bg">
            <div class="com-table">
                <el-table
                    ref="multipleTableRef"
                    :data="form.data" border
                    style="width: 100%" height="100%"
                    @selection-change="handleSelectionChange"
                    :default-sort="{ prop: 'TaskBeginTime', order: 'descending' }">
                    <el-table-column type="index" label="序号" show-overflow-tooltip :width="60" :index="typeIndex" />
                    <el-table-column prop="TaskName" label="任务名称" show-overflow-tooltip />
                    <el-table-column prop="TaskType" label="会话类型">
                        <template #default="scope">
                            {{formatterTaskType(scope.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="TaskIniator" label="发起方" />
                    <el-table-column label="响应方">
                        <template #default="scope">
                            <el-dropdown
                                v-if="scope.row.EndPointList && scope.row.EndPointList.length > 1"
                                placement="bottom-start"
                                class="dropdown-link-tabel"
                            >
                                <span class="el-dropdown-link">
                                    <span class="dropdown-link-defalut">
                                        {{scope.row.EndPointList[0].EndPointName}}
                                    </span>
                                    <el-icon class="el-icon--right">
                                        <arrow-down />
                                    </el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu class="EndpointIpListArray">
                                        <el-dropdown-item v-for="item in scope.row.EndPointList">
                                            {{item.EndPointName}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                             </el-dropdown>
                            <span v-if="scope.row.EndPointList && scope.row.EndPointList.length === 1" class="dropdown-link-defalut">
                                {{ scope.row.EndPointList[0].EndPointName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TaskVolume" label="任务音量">
                        <template #default="scope">
                            <!-- <div class="com-table-task-volume" v-if="selectTerminaVolume?.TaskID !== scope.row.TaskID">
                                <span class="volume">{{scope.row.TaskVolume}}</span>
                                <span class="iconfont icon-edit1" @click="handelSelectVolume(scope.row)"></span>
                            </div> -->
                            <div class="com-table-task-volume">
                                <el-input-number
                                    v-model="scope.row.TaskVolume"
                                    :min="1"
                                    :max="100"
                                    controls-position="right"
                                    size="small"
                                    @change="changeTaskVolume(scope.row)"
                                />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TaskBeginTime" label="会话进行时间" sortable="custom" width="160"/>
                    <el-table-column prop="IsMonitor" label="监听状态" />
                    <el-table-column label="操作" width="120">
                        <template #default="scope">
                            <el-button link type="danger" @click="handleStopTask(scope.row)">
                                <template #icon>
                                    <i class="iconfont icon-end" title="结束任务"></i>
                                </template>
                            </el-button>
                            <el-button link type="primary"  v-if="scope.row.IsMonitor < 1" @click="setMonitorTerminal(scope.row)">
                                <template #icon>
                                    <i class="iconfont icon-headset" title="点击监听"></i>
                                </template>
                            </el-button>
                            <el-button link type="danger" v-else>
                                <template #icon>
                                <i class="iconfont icon-headphones-disabled" title="取消监听"></i>
                                </template>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="com-footer com-m-bg" v-if="form.data.length > 0">
            <el-pagination
                v-model:currentPage="form.currentPage"
                v-model:page-size="form.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableDataAll.length"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { send } from '@/utils/socket'
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import usePublicMethod from "@/utils/global/index";
interface User {
    date: string;
    name: string;
    address: string;
}

// const store = useAppStore()
// const terminalStore = useTerminalStore()
const store = getStore.useAppStore();
const terminalStore = getStore.useTerminalStore();
const { proxy } = useCurrentInstance.useCurrentInstance();

const form: any = reactive({
    search: "",
    selectType: 0,
    data: [],
    currentPage: 1,
    pageSize: 20,
});
const loading = ref(false)
const monitorTerminal: any = ref({})
const tableDataAll = ref<any[]>([]) //过滤后的数据
const sessionOptions = [
  ...[{ value: 0, label: "全部类型" }],
  ...useFormatMap.terminalsOptions,
];
const terminalStatus = new Map([
    [ 1, "icon-on-line" ], //空闲
    [ 2, "icon-executing" ], //忙碌
    [ 3, "icon-freeze" ], //冻结
    [ 4, "icon-fault" ], //故障
    [ 0, "icon-off-line" ], //离线
])
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const selectTerminalMac: any = ref({
    EndPointIP: '',
    EndPointMac: ''
}) //选中表格设备的mac地址
const selectTerminaVolume = ref({
    TaskVolume: 0,
    TaskID: ''
})

const sessionsData = computed(()=> {
    return store.sessionsArray
}) //store.sessionsArray
const terminal_data = computed(() => {
    return terminalStore.terminal_data
})

watch(() => sessionsData.value, ()=> {
    tableDataAll.value = filterData()
    console.log(tableDataAll.value)
    form.data = tableDataAll.value.slice(
        form.pageSize * (form.currentPage-1),
        form.pageSize * form.currentPage
    )
})

// 搜索
const handleSearch = () => {
    form.currentPage = 1
    tableDataAll.value = filterData()
    form.data = tableDataAll.value.slice(0,  form.pageSize)
}
// 重置搜索
const resetSearch = () => {
    form.search = ''
    form.selectType = 0
    form.currentPage = 1
    tableDataAll.value = sessionsData.value
    form.data = tableDataAll.value.slice(0, form.pageSize)
}
// 获取触发选项
const getTriggerOptions = () => {
    form.currentPage = 1
    tableDataAll.value = filterData()
    form.data = tableDataAll.value.slice(0,  form.pageSize)
}
// 选中表格行
const handelSelectRow = (row: any) => {
    if (row.Status === 1) {
        selectTerminalMac.value = row
    }else {
        ElMessage.warning('监听终端必须是空闲状态')
    }
}
const tableRowClassName = (row: any) => {
    if (row.row.Status === 0) {
        return 'Offline'
    }
    return ''
}
// 结束任务
const handleStopTask = (row: any) => {
    ElMessageBox.confirm(
        '即将停止此任务，是否继续？',
        '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(() => {
        let data = {
            company: "BL",
            actioncode: "c2ms_stop_task",
            token: "",
            data: {
                'TaskID': row.TaskID
            },
            result: 0,
            return_message: ""
        }
        send(data)
    }).catch(() => {
        
    })
}
// 开启监听
const setMonitorTerminal = (row: any) => {
    console.log(row, selectTerminalMac)
    if (!selectTerminalMac.value?.EndPointID) {
        return ElMessage.warning('请选择监听音响')
    }
    // if (loading.value)return
    // loading.value = true
    let func = ()=> {
        let data = {
            "company": "BL",
            "actioncode": "ms2c_monitor_task",
            "token": "",
            "data": {
                "TaskID": usePublicMethod.guid(),
                "MonitorTaskID": row.TaskID,
                "EndPointList": [selectTerminalMac.value?.EndPointID]
            },
            "result": 0,
            "return_message": ""
        }
        send(data)
    }
    usePublicMethod.debounce(func, 500)
}
// 选中音量
const handelSelectVolume = (row: any) => {
    selectTerminaVolume.value = row
}
// 改变任务音量
const changeTaskVolume = (row: any) => {
    if (row.TaskVolume === undefined) {
        row.TaskVolume = 0
    }
    let func = ()=> {
        let data = {
            "company": "BL",
            "actioncode": "c2ls_set_task_volume",
            "token": "",
            "data": {
                "TaskID": row.TaskID,
                "Volume": row.TaskVolume
            },
            "result": 0,
            "return_message": ""
        }
        send(data)
    }
    usePublicMethod.debounce(func, 1000)
}
const filterData = () => {
    let objIsEmpty = form.selectType === 0 && form.search === ''
    if (objIsEmpty) {
        return sessionsData.value
    }else {
        let data = sessionsData.value.filter((item: any)=> {
            let respondent = item.EndPointList.map((row: any)=> {
                return row.EndPointName
            }).toString()
            let searchFiletr = item.TaskName.toLowerCase().indexOf(form.search.toLowerCase()) !== -1 ||
                            item.TaskIniator.toLowerCase().indexOf(form.search.toLowerCase()) !== -1 ||
                            respondent.toLowerCase().indexOf(form.search.toLowerCase()) !== -1
            if (form.selectType !== 0) {
                return item.TaskType === form.selectType && searchFiletr
            } else {
                return searchFiletr
            }
        })
        return data
    }
}
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val;
};
// 任务类型格式转换
const formatterTaskType = (row: any) => {
  return useFormatMap.taskTypeMap.get(row.TaskType);
};

// 序号
const typeIndex = (index: number) => {
    return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
    form.pageSize = val;
    form.currentPage = 1;
    form.data = tableDataAll.value.slice((form.currentPage - 1) * form.pageSize,  form.currentPage * form.pageSize)
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
    form.currentPage = val;
    form.data = tableDataAll.value.slice((form.currentPage - 1) * form.pageSize,  form.currentPage * form.pageSize)
};

// mounted 实例挂载完成后被调用
onMounted(() => {
    if (sessionsData.value.length > 0) {
        tableDataAll.value = sessionsData.value
        form.data = tableDataAll.value.slice(0,  form.pageSize)
    }
});
</script>

<style lang="scss">
    .com-table-task-volume {
        display: flex;
        .volume {
            flex: 1;
        }
        .iconfont {
            width: 16px;
        }
    }
    .select-monitor-terminal {
        .monitor-terminal-header {
            display: flex;
            .monitor-terminal-number {
                flex: 1;
                line-height: 32px;
            }
            .el-input {
                width: 235px;
            }
        }
    }
    .monitor-terminal-table {
        .monitor-terminal-name {
            display: flex;
            .iconfont {
                width: 16px;
                &:nth-child(1) {
                    padding-right: 8px;
                }
                &:nth-child(2) {
                    padding-left: 6px;
                }
            }
            .terminal-name {
                width: auto;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .Offline {
            color: #92959b;
        }
    }
</style>
