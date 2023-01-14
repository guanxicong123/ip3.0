<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\play\index.vue
  @Describe: 播放中心
-->
<template>
    <div class="com-play-index">
        <div class="play-left" v-if="form.playlist_status">
            <h2 class="theme">播放列表 (22)</h2>
            <ul class="left-ul">
                <li>
                    <span class="order">序号</span>
                    <span class="name">名称</span>
                </li>
            </ul>
            <div class="left-list">
                <el-scrollbar>
                    <ul class="left-ul">
                        <li v-for="(item, index) in form.play_list_data" :key="item.id">
                            <span class="order">
                                <template v-if="item.name == form.song_name">
                                    <i class="iconfont icon-playing theme"></i>
                                </template>
                                <template v-else>{{ index + 1 }}</template>
                            </span>
                            <span class="name">{{ item.name }}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <div class="play-center">
            <i class="iconfont theme" :class="form.fullscreen_satus ? 'icon-narrow' : 'icon-enlarge'"
                :title="form.fullscreen_satus ? '缩小' : '放大'" @click="handleFullscreenStatus"></i>
            <div class="center-content">
                <div class="content-top" :class="playCenterData.TaskID ? 'playing' : ''">
                    <img class="record-arm" src="@/assets/images/record-arm.png" alt="" />
                    <img class="record" src="@/assets/images/record.png" alt="" />
                </div>
                <div class="content-center">
                    <p>
                        {{
                            playCenterData.TaskID !== playSubscriptionTask.TaskID
                                ? playCenterData.name
                                : playSubscriptionTask.MusicName
                        }}
                    </p>
                    <div class="progress" v-if="handleTaskProgress() && playCenterData.TaskID">
                        <el-slider v-model="form.current_duration" :max="form.total_duration"
                            :format-tooltip="formatTooltip" @change="handleSwitchTask(playCenterData, 'progress')" />
                        <span class="fl">{{ formatTooltip(form.current_duration) }}</span>
                        <span class="fr">{{ formatTooltip(form.total_duration) }}</span>
                    </div>
                </div>
                <div class="content-bottom theme" v-if="handleTaskButton() && playCenterData.TaskID">
                    <i class="iconfont" :class="form.playlist_status ? 'icon-shrink' : 'icon-order' " title="音频列表"
                        @click="form.playlist_status = !form.playlist_status" v-if="form.fullscreen_satus"></i>
                    <i class="iconfont" :class="playModeIcon.get(form.play_model)?.icon"
                        :title="playModeIcon.get(form.play_model)?.title"
                        @click="handleSwitchTask(playCenterData, 'PlayMode')">
                    </i>
                    <i class="iconfont icon-prev" title="上一首" @click="handleSwitchTask(playCenterData, 'pre')"></i>
                    <i class="iconfont" :class="playCenterData.TaskID ? 'icon-suspend' : 'icon-play'"
                        :title="playCenterData.TaskID ? '暂停' : '播放'" @click="
                            playCenterData.TaskID
                                ? handlePauseTask(playCenterData)
                                : handlePlayTask(playCenterData)
                        ">
                    </i>
                    <i class="iconfont icon-next" title="下一首" @click="handleSwitchTask(playCenterData, 'next')"></i>
                    <i class="iconfont icon-end" title="停止" @click="handleStopTask(playCenterData)"></i>
                    <el-popover trigger="click" popper-class="play-volume-popper">
                        <template #reference>
                            <i class="iconfont icon-volume2" title="音量"></i>
                        </template>
                        <span class="play-volume-number">{{ form.volume }}</span>
                        <el-slider v-model="form.volume" vertical height="200px"
                            @change="handleVolumeTask" :show-tooltip="false">
                        </el-slider>
                    </el-popover>
                </div>
                <div class="content-bottom theme com-show-button" v-else>
                    <i class="iconfont" :class="playCenterData.TaskID ? 'icon-end' : 'icon-play'"
                        :title="playCenterData.TaskID ? '停止' : '播放'" @click="
                            playCenterData.TaskID
                                ? handleStopTask(playCenterData)
                                : handlePlayTask(playCenterData)
                        ">
                    </i>
                    <el-popover trigger="click" popper-class="play-volume-popper">
                        <template #reference>
                            <i class="iconfont icon-volume2" title="音量"></i>
                        </template>
                        <span class="play-volume-number">{{ form.volume }}</span>
                        <el-slider v-model="form.volume" vertical height="200px"
                            @change="handleVolumeTask" :show-tooltip="false">
                        </el-slider>
                    </el-popover>
                </div>
            </div>
        </div>
        <div class="play-right" v-if="!form.fullscreen_satus">
            <div class="right-top">
                <div class="com-index">
                    <div class="com-head">
                        <div class="com-head-content">
                            <div class="com-breadcrumb">
                                <div class="play-table-title theme">
                                    <span>任务列表</span>
                                </div>
                                <el-input v-model="form.search" placeholder="任务名称" :prefix-icon="Search" @input="handleSearch"/>
                                <el-button
                                    :disabled="form.search == ''"
                                    @click="form.search = '', handleSearch()"
                                    style="margin-left: 12px;"
                                >
                                    重置
                                </el-button>
                            </div>
                            <div class="com-button">
                                <i class="iconfont icon-add" title="添加" @click="addPlayTask"></i>
                                <i class="iconfont icon-delete" @click="handleDeleteAll" title="批量删除"></i>
                            </div>
                        </div>
                    </div>
                    <div class="com-main">
                        <div class="com-table">
                            <el-table ref="multipleTableRef" :data="form.data" style="width: 100%" height="100%"
                                highlight-current-row @selection-change="handleSelectionChange"
                                @cell-click="handleSelectionClick">
                                <el-table-column prop="name" label="任务" show-overflow-tooltip min-width="280">
                                    <template #default="scope">
                                        <!-- <span class="icon iconfont" :class=""></span> -->
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="taskTypeMap.get(scope.row.type)"></use>
                                        </svg>
                                        {{ scope.row.name }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="priority" label="优先级">
                                    <template #default="scope">
                                        <span class="red">[{{ priorityData.get(scope.row.type) }}]</span>
                                        {{scope.row.priority}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="120">
                                    <template #default="scope">
                                        <el-button link type="primary" @click.stop="handleStopTask(scope.row)"
                                            v-if="handleDecideStatus(scope.row)">
                                            <template #icon>
                                                <i class="iconfont icon-end" title="结束"></i>
                                            </template>
                                        </el-button>
                                        <el-button link type="primary" @click.stop="handlePlayTask(scope.row)" v-else>
                                            <template #icon>
                                                <i class="iconfont icon-play" title="播放"></i>
                                            </template>
                                        </el-button>
                                        <el-button link type="danger" @click.stop="handleEditTask(scope.row)">
                                            <template #icon>
                                                <i class="iconfont icon-edit" title="编辑"></i>
                                            </template>
                                        </el-button>
                                        <el-button link type="primary" @click.stop="handleDeleteTask(scope.row)">
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
                </div>
            </div>
            <div class="right-bottom">
                <task-details-config :selectTaskData="selectTaskData" :playCenterData="playCenterData">
                </task-details-config>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { send } from "@/utils/socket";
import { ElTable } from "element-plus";
import { Search } from "@element-plus/icons-vue";

// defineAsyncComponent 异步组件-懒加载子组件
const taskDetailsConfig = defineAsyncComponent(
    () => import("./add-edit-component/task-details-config.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
// 路由
const $useRouter = useRouter();
const store = getStore.useAppStore();
const storePlay = getStore.usePlayStore();

interface User {
    date: string;
    name: string;
    address: string;
}

const form = reactive<any>({
    percentage: 50, // 进度
    song_name: "音乐播放2.mp3", // 歌曲名称
    total_duration: 0, // 总时长
    current_duration: 0, // 当前时长
    play_status: false, // 播放状态
    play_model: 0, //播放模式
    fullscreen_satus: false, // 全屏状态
    playlist_status: false, // 播放列表状态
    play_list_data: [], // 播放列表数据
    search: "", // 任务搜索
    data: [], // 任务数据
    currentPage: 1,
    pageSize: 20,
    total: 0,
    volume: 0,
});
const tableDataAll: any = ref([])
const selectTaskData: any = ref({}); //选中的任务数据(http)

const sessionsData: any = computed(() => {
    return store.sessionsArray.filter((item: any) => {
        return [12, 13, 14, 15].includes(item.TaskType);
    });
});
//当前任务播放状态
const playStatusData: any = computed(() => {
    return storePlay.playStatusData;
});
//订阅模式数据
const playSubscriptionTask: any = computed(() => {
    return storePlay.playSubscriptionTask;
});

watch(playStatusData, (newVal) => {
    form.current_duration = newVal.CurrentTime;
    form.total_duration = newVal.TotalTime;
    form.song_name = newVal.MusicName;
    form.play_status = newVal.PlayStatus;
});
watch(playSubscriptionTask, (newVal)=> {
    if (newVal.TaskID === playCenterData.value?.TaskID) {
        form.current_duration = newVal.CurrentTime;
        form.total_duration = newVal.TotalTime;
        form.song_name = newVal.MusicName;
        form.play_status = newVal.PlayStatus;
    }
});


// 获取当前显示任务的执行数据
const playCenterShowData = computed(() => {
    return sessionsData.value.filter((item: any) => {
        if (selectTaskData.value?.type < 10) {
            return item.RemoteTaskID === selectTaskData.value.id;
        }
        if (selectTaskData.value?.type >= 10) {
            return item.TaskID === selectTaskData.value.taskid;
        }
    })[0];
});
// 播放器任务详情
const playCenterData = computed(() => {
    if (playCenterShowData.value) {
        return { ...selectTaskData.value, ...playCenterShowData.value };
    } else {
        return selectTaskData.value;
    }
});

watch(playCenterData, (newVal, oldVal) => {
    form.volume = newVal?.TaskVolume ? newVal?.TaskVolume : newVal?.volume
    if (newVal?.TaskID === oldVal?.TaskID) return
    const newValType = newVal.type === 1 || newVal.type === 10 || (newVal.type === 4 && newVal.sound_source.type === 1)
    const oldValType = oldVal.type === 1 || oldVal.type === 10 || (oldVal.type === 4 && oldVal.sound_source.type === 1)
    if (!newValType && oldValType && oldVal?.TaskID) {
        unsubscribeTask(oldVal)
    }
    if (newVal?.TaskID && !oldVal.TaskID) { //新任务详情存在任务,旧任务详情无执行任务
        if (newValType) subscribeTask(newVal)
    }
    if (newVal?.TaskID && oldVal?.TaskID && newVal?.TaskID !== oldVal?.TaskID) { //新旧任务都存在TaskID,但是任务不相同,判断为切换了任务详情
        if (oldValType) unsubscribeTask(oldVal)
        if (newValType) subscribeTask(newVal)
    }
    if (!newVal?.TaskID && oldVal?.TaskID && newVal?.name !== oldVal?.name) { //判断为切换了任务详情,新的任务详情不存在任务
        if (oldValType) unsubscribeTask(oldVal)
    }
});
const handleFullscreenStatus = () => {
    form.fullscreen_satus = !form.fullscreen_satus;
    form.playlist_status = false;
};
const taskTypeMap = new Map([
    [1, "#icon-remote-playback"],
    [4, "#icon-view-collection-terminal"],
    [11, "#icon-text"],
    [13, "#icon-terminals"],
    [12, "#icon-terminals"],
    [10, "#icon-music-playback"],
]);
const taskPlayMode = new Map([
    [0, "normal_play"],
    [1, "loop_play"],
    [2, "random_play"],
]);
const playModeIcon = new Map([
    [
        0,
        {
            icon: "icon-list-play",
            title: "列表播放",
            model: 'normal_play',
        },
    ],
    [
        1,
        {
            icon: "icon-loop-play",
            title: "循环播放",
            model: 'loop_play',
        },
    ],
    [
        2,
        {
            icon: "icon-random",
            title: "随机播放",
            model: 'random_play',
        },
    ],
]);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const priorityData = new Map();
const playConfig = ref();

// 判断是否显示进度条
const handleTaskProgress = () => {
    if (selectTaskData.value.type === 1 || selectTaskData.value.type === 10) {
        return true;
    }
    if (
        selectTaskData.value.type === 4 &&
        selectTaskData.value.fast_sound &&
        selectTaskData.value.fast_sound.type === 1
    ) {
        return true;
    }
    return false
}
// 判断是否显示按钮
const handleTaskButton = () => {
    if (selectTaskData.value.type === 1) {
        return true;
    }
    if (
        selectTaskData.value.type === 4 &&
        selectTaskData.value.fast_sound &&
        selectTaskData.value.fast_sound.type === 1
    ) {
        return true;
    }
    if (selectTaskData.value.type === 10) {
        return true;
    }
    return false;
};
// 添加播放任务
const addPlayTask = () => {
    $useRouter.push("/play-task/" + 0);
};
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val;
};
// 批量删除任务
const handleDeleteAll = () => {
    if (multipleSelection.value.length === 0) 
        return proxy.$message.warning('请选择任务')
    ElMessageBox.confirm(
        '即将删除选中任务,是否继续?',
        '警告',
        {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        }
    ).then(() => {
        let serverDataID: any[] = []
        let LocalDataID: any[] = []
        multipleSelection.value.forEach((item: any)=> {
            if (item.type < 10) {
                serverDataID.push(item.id)
            }else {
                LocalDataID.push(item.id)
            }
        })
        Promise.all([
            handelDelServeRask(serverDataID),
            handelDelLocalRask(LocalDataID)
        ]).then(()=> {
            getTaskAll()
        })
    })
};
// 编辑
const handleEditButton = () => {
    playConfig.value.handleEditButton();
};
// 获取选中任务详情信息
const handleSelectionClick = (row: any) => {
    if (selectTaskData.value === row) return
    if (row.type < 10) {
        selectTaskData.value = row;
    }else {
        getLocalTask(row).then((result: any)=> {
            selectTaskData.value = result.data
        })
    }
};
const getLocalTask = (row: any) => {
    return new Promise((resolve, reject)=> {
        proxy.$http1.get("/task/" + row.id).then((result: any) => {
            if (result.result === 200) {
                resolve(result)
            }
        });
    })
};
// 判断任务是否执行中
const handleDecideStatus = (row: any) => {
    if (row.type < 10) {
        return sessionsData.value.some((item: any) => {
            return item.RemoteTaskID === row.id;
        });
    }
    if (row.type >= 10) {
        return sessionsData.value.some((item: any) => {
            return item.TaskID === row.taskid;
        });
    }
};
// 停止任务
const handleStopTask = (row: any) => {
    let key;
    sessionsData.value.some((item: any) => {
        if (item.RemoteTaskID === row.id) {
            key = item.TaskID;
            return true;
        }
        if (item.TaskID === row.taskid) {
            key = item.TaskID;
            return true;
        }
    });
    let data = {
        company: "BL",
        actioncode: "c2ms_stop_task",
        token: "",
        data: {
            TaskID: key,
        },
        result: 0,
        return_message: "",
    };
    send(data);
};
// 暂停任务
const handlePauseTask = (row: any) => {
    if (row.TaskID) {
        let data = {
            company: "BL",
            actioncode: "c2ms_control_task",
            token: "",
            data: {
                TaskID: row.TaskID,
                ControlCode: "pause",
                ControlValue: "",
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
}
// 播放任务
const handlePlayTask = (row: any) => {
    if (row.type < 10) {
        proxy.$http
            .get("/details/" + row.id, {
                params: {
                    tag: "BroadcastingStudio",
                    withMedias: true,
                    withFastSound: true,
                    withFastTerminal: true,
                    withTerminal: true,
                },
            })
            .then((result: any) => {
                let row = result.data;
                let TaskProp = handleTaskAttribute(row);
                console.log(row.terminalsIds)
                if (row.terminalsIds.length === 0) return proxy.$message.warning("未找到播放终端，请重新配置")
                if (TaskProp?.TaskAudioType) {
                    let data = {
                        company: "BL",
                        actioncode: "c2ms_create_server_task",
                        data: {
                            EndPointsAdditionalProp: {},
                            EndPointList: row.terminalsIds, //终端ID合集
                            TaskID: guid(), //UUID
                            TaskName: row.name, //任务名称
                            Priority: row.priority, //优先级
                            Volume: row.volume, //音量
                            TaskType: handleTaskTypeMap(row), //任务类型
                            UserID: row.users_id,
                            TaskProp: TaskProp,
                        },
                    };
                    send(data);
                }
            });
    } else {
        let data = {
            company: "BL",
            actioncode: "c2ms_create_local_task",
            data: {
                TaskID: row.taskid,
                FirstIndex: row.type === 10 && row.content.length > 0 ? row.content[0].taskid : 0,
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
};
// 切换任务状态
const handleSwitchTask = (row: any, type: string) => {
    if (row.TaskID) {
        let data = {
            company: "BL",
            actioncode: "c2ms_control_task",
            token: "",
            data: {
                TaskID: row.TaskID,
                ControlCode: type,
                ControlValue: handleControlValuev(type),
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
};
const handleControlValuev = (type: string) => {
    if (type === "progress") {
        return form.current_duration
    }
    if (type === 'PlayMode') {
        let model = 0
        form.play_model === 2 ? model = 0 : model = form.play_model + 1 
        return playModeIcon.get(model)?.model
    }
    return ''
}
// 音量调节
const handleVolumeTask = (volume: any) => {
    if (playCenterData.value?.TaskID) {
        let data = {
            company: "BL",
            actioncode: "c2ms_set_task_volume",
            data: {
                TaskID: playCenterData.value.TaskID,
                Volume: volume,
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
};
// 订阅任务
const subscribeTask = (row: any) => {
    let data = {
        company: "BL",
        actioncode: "c2ms_subscribe_task_progress_bar",
        token: "",
        data: {
            TaskID: row.TaskID,
        },
        result: 0,
        return_message: "",
    };
    send(data);
};
// 取消任务订阅
const unsubscribeTask = (row: any) => {
    let data = {
        company: "BL",
        actioncode: "c2ms_unsubscribe_task_progress_bar",
        token: "",
        data: {
            TaskID: row.TaskID,
        },
        result: 0,
        return_message: "",
    };
    send(data);
};
// 生成UUID
const guid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
// 任务类型
const handleTaskTypeMap = (row: any) => {
    if ((row.type === 4 && row.sound_source.type === 1) || row.type === 1) {
        //快捷音源-媒体音乐 && 远程任务（媒体音乐播放）
        return 15;
    }
    if (row.type === 4 && row.sound_source.type === 2) {
        //快捷音源-声卡采集 &&
        return 13;
    }
    if (row.type === 4 && row.sound_source.type === 3) {
        //快捷音源-终端采集 &&
        return 14;
    }
    if (row.type === 10) {
        return 0;
    }
    // return type
};
// 任务属性
const handleTaskAttribute = (row: any) => {
    let data = null;
    if (row.type === 1) {
        //远程任务-音乐播放
        if (row.mediasIds.length === 0) return proxy.$message.warning("未找到媒体信息，请重新配置")
        data = {
            TaskAudioType: 6,
            RemoteID: row.id,
            RemoteType: "remote_play",
            RemoteAudioProp: {
                MusicIDs: row.mediasIds,
                LimitTime: row.sound_source.life_time ? timeToSec(row.sound_source.life_time, 1) : 0,
                PlayMode: taskPlayMode.get(row.sound_source.play_model),
                PlayTimes: row.sound_source?.play_number || 0,
            },
        };
    }
    if (row.type === 4) {
        //快捷音源
        if (row.sound_source.type === 1) {
            if (row.mediasIds.length === 0) return proxy.$message.warning("未找到媒体信息，请重新配置")
            //音乐播放
            data = {
                TaskAudioType: 6,
                RemoteID: row.id,
                RemoteType: "remote_play",
                RemoteAudioProp: {
                    TaskAudioType: 1,
                    MusicIDs: row.mediasIds,
                    LimitTime: row.sound_source.life_time
                        ? timeToSec(row.sound_source.life_time, 1)
                        : 0,
                    PlayMode: taskPlayMode.get(row.sound_source.play_model),
                    PlayTimes: row.sound_source?.play_number || 0,
                },
            };
        }
        if (row.sound_source.type === 2) {
            //声卡采集
            if (row.fast_sound.fast_source.sound_card) {
                data = {
                    TaskAudioType: 6,
                    RemoteID: row.id,
                    RemoteType: "remote_play",
                    RemoteAudioProp: {
                        TaskAudioType: 3,
                        AudioCard: row.fast_sound.fast_source.sound_card,
                        LimitTime: 0,
                    },
                };
            } else {
                proxy.$message.warning("未找到采集声卡设备，请重新配置");
            }
        }
        if (row.sound_source.type === 3) {
            //终端采集
            if (row.fast_sound.fast_source.terminals_id) {
                data = {
                    TaskAudioType: 6,
                    RemoteID: row.id,
                    RemoteType: "remote_play",
                    RemoteAudioProp: {
                        TaskAudioType: 2,
                        CollectID: row.fast_sound.fast_source.terminals_id
                            ? row.fast_sound.fast_source.terminals_id
                            : 0,
                        SelfCheck: 0,
                    },
                };
            } else {
                proxy.$message.warning("未找到采集终端设备，请重新配置");
            }
        }
    }
    return data;
};
// 将时间转换为秒
const timeToSec = (time: any, num = 1) => {
    var hour = time.split(":")[0];
    var min = time.split(":")[1];
    var sec = time.split(":")[2];
    var s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s * num;
};
// 编辑播放任务
const handleEditTask = (row: any) => {
    $useRouter.push({
        path: "/play-task/" + row.id,
        query: {
            id: row.id,
            type: row.type,
        },
    });
};
// 删除播放任务
const handleDeleteTask = (row: any) => {
    ElMessageBox.confirm(
        '即将删除任务,是否继续?',
        '警告',
        {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        }
    ).then(() => {
        if (row.type < 10) {
            handelDelServeRask(row).then(()=> {
                getTaskAll()
            })
        } else {
            handelDelLocalRask(row).then(()=> {
                getTaskAll()
            })
        }
    })
};
// 删除远程任务
const handelDelServeRask = (row: any) => {
    return new Promise((resolve, reject)=> {
        if (Array.isArray(row) && row.length === 0) return resolve()
        proxy.$http.delete("/broadcasting/", {
            data: {
                ids: Array.isArray(row) ? row : [row.id],
            }
        }).then((result: any) => {
            if (result.result === 200) {
                resolve()
            }else {
                reject()
            }
        }).catch(()=> {
            reject()
        })
    })
}
// 删除本地任务
const handelDelLocalRask = (row: any) => {
    return new Promise((resolve, reject)=> {
        if (Array.isArray(row) && row.length === 0) return resolve()
        proxy.$http1.delete("/task", {
            data: {
                ids: Array.isArray(row) ? row : [row.id],
            },
        }).then((result: any) => {
            if (result.result === 200) {
                resolve()
            }else {
                reject()
            }
        }).catch(()=> {
            reject()
        })
    })
}
// 获取所有任务
const getTaskAll = () => {
    Promise.all([getBroadcastingAll(), getTaskLocalAll()]).then((data: any) => {
        tableDataAll.value = [...data[0], ...data[1]];
        form.data = filterData()
    });
}
// 获取所有播放任务
const getBroadcastingAll = () => {
    return new Promise((resolve, reject) => {
        proxy.$http.get("/broadcasting/all", {
            params: {
                withFastSound: true
            }
        }).then((restlu: any) => {
            let data = restlu.data.filter((item: { type: number }) => {
                return item.type === 1 || item.type === 4;
            });
            resolve(data);
        });
    });
};
// 获取所有任务(本地)
const getTaskLocalAll = () => {
    return new Promise((resolve, reject) => {
        proxy.$http1.get("/task", {
            params: {
                userID: localStorage.get("LoginUserID"),
                serverIP: localStorage.get("serverIP"),
            },
        })
        .then((restlu: any) => {
            if (Array.isArray(restlu.data)) {
                resolve(restlu.data);
            } else {
                resolve([]);
            }
        });
    });
};
// 获取所有系统优先级
const getPrioritySetting = () => {
    return new Promise((resolve, reject) => {
        proxy.$http.get("/priority-setting").then((restlu: any) => {
            restlu.data.forEach((item: { task_type: any; priority: any }) => {
                priorityData.set(item.task_type, item.priority);
            });
            resolve(restlu.data)
        });
    })
};
const formatTooltip = (seconds: number) => {
    if (seconds) {
        let data = Math.trunc(seconds / 1000);
        let hour =
            Math.floor(data / 3600) >= 10
                ? Math.floor(data / 3600)
                : "0" + Math.floor(data / 3600);
        data -= 3600 * Number(hour);
        let min =
            Math.floor(data / 60) >= 10 ? Math.floor(data / 60) : "0" + Math.floor(data / 60);
        data -= 60 * Number(min);
        let sec = data >= 10 ? data : "0" + data;
        return hour + ":" + min + ":" + sec;
    } else {
        return "00:00:00";
    }
};
const handleSearch = () => {
    form.data = filterData()
}
// 数据过滤
const filterData = () => {
    if (form.search === '') return tableDataAll.value
    return tableDataAll.value.filter((item: any)=> {
        return item.name.indexOf(form.search) !== -1
    })
}

// mounted 实例挂载完成后被调用
onMounted(() => {
    Promise.all([getBroadcastingAll(), getTaskLocalAll(), getPrioritySetting()]).then((data: any) => {
        tableDataAll.value = [...data[0], ...data[1]]
        form.data = [...data[0], ...data[1]];
        if (form.data.length > 0) {
            handleSelectionClick(form.data[0]);
            multipleTableRef.value!.setCurrentRow(form.data[0]);
        }
    });
});
</script>

<style lang="scss" scoped>
.com-play-index {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    .play-left {
        width: 320px;
        background: #f3f9ff;

        h2 {
            padding: 18px 0;
            margin: 0 30px;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #e7f1fb;
        }

        .left-ul {
            margin: 0 30px;

            li {
                border-bottom: 1px solid #e7f1fb;

                span {
                    display: inline-block;
                    line-height: 40px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .order {
                    width: 30%;
                }

                .name {
                    width: 70%;
                }
            }
        }

        .left-list {
            height: calc(100% - 94px);

            .left-ul {
                padding-bottom: 10px;

                li {
                    cursor: pointer;

                    &:hover {
                        background: #e4f0ff;
                    }
                }
            }
        }
    }

    .play-center {
        position: relative;
        display: flex;
        flex: 1;

        .iconfont.theme {
            position: absolute;
            top: 30px;
            right: 20px;
            font-size: 20px;
            cursor: pointer;
        }

        .center-content {
            width: 100%;

            .content-top {
                position: relative;
                width: 340px;
                height: 340px;
                margin: 9vh auto 2vh;

                .record {
                    width: 100%;
                    height: 100%;
                }
            }

            .record-arm {
                position: absolute;
                top: -22px;
                left: 0;
                width: 90px;
                height: 150px;
                transform: rotate(32deg);
                transform-origin: left top;
                z-index: 1;
            }

            .playing {
                .record-arm {
                    transform: rotate(0deg);
                    transform-origin: left top;
                }

                .record {
                    transform: rotate(360deg);
                    animation: rotation 3s linear infinite;
                }
            }

            @keyframes rotation {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }

            .content-center {
                p {
                    max-width: 380px;
                    padding: 2vh 10px;
                    margin: auto;
                    box-sizing: border-box;
                    font-size: 16px;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .progress {
                    width: 360px;
                    margin: 4vh auto 2vh;

                    :deep(.el-progress__text) {
                        display: none;
                    }

                    .fl,
                    .fr {
                        display: inline-block;
                        padding: 10px 0;
                        font-size: 12px;
                        color: $c-999;
                    }

                    .fr {
                        float: right;
                    }
                }
            }

            .content-bottom {
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    font-size: 28px;
                    cursor: pointer;
                    margin: 0 18px;
                }

                .icon-play,
                .icon-suspend {
                    font-size: 46px;
                }
            }
            .com-show-button {
                padding-top: calc(64px + 4vh + 2vh);
            }
        }
    }

    .play-right {
        width: 62%;
        border-left: 1px solid #f5f5f5;
        box-sizing: border-box;

        .right-top,
        .right-bottom {
            height: 50%;
            overflow: hidden;
        }

        .com-breadcrumb {
            .el-input {
                width: 200px;
            }
        }

        .play-table-title {
            margin-right: 12px;
            font-weight: bold;
        }
    }
}
</style>
