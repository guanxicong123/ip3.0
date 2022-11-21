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
                    <p>{{ selectTaskData.TaskID !== playStatusData.TaskID ? selectTaskData.name : playStatusData.MusicName }}</p>
                    <div class="progress">
                        <el-slider
                            v-model="form.current_duration"
                            :max="form.total_duration"
                            :format-tooltip="formatTooltip"
                            @change="handleSwitchTask(playCenterData, 'progress')"/>
                        <!-- <el-progress :percentage="form.percentage" :format="format" :stroke-width="3" color="#0070EE" /> -->
                        <span class="fl">{{ formatTooltip(form.current_duration) }}</span>
                        <span class="fr">{{ formatTooltip(form.total_duration) }}</span>
                    </div>
                </div>
                <div class="content-bottom theme" v-if="handleTaskButton()">
                    <i class="iconfont icon-list-play" title="播放列表"
                        @click="form.playlist_status = !form.playlist_status" v-if="form.fullscreen_satus"></i>
                    <i class="iconfont"
                        :class="playModeIcon.get(form.play_model)?.icon"
                        :title="playModeIcon.get(form.play_model)?.title"
                        @click="handleSwitchTask(playCenterData, 'pre')">
                    </i>
                    <i class="iconfont icon-prev" title="上一首" @click="handleSwitchTask(playCenterData, 'pre')"></i>
                    <i class="iconfont"
                        :class="playCenterData.TaskID ? 'icon-suspend' : 'icon-play'"
                        :title="playCenterData.TaskID ? '暂停' : '播放'"
                        @click="playCenterData.TaskID ? handleStopTask(playCenterData) : handlePlayTask(playCenterData)">
                    </i>
                    <i class="iconfont icon-next" title="下一首" @click="handleSwitchTask(playCenterData, 'next')"></i>
                    <i class="iconfont icon-end" title="停止" @click="handleStopTask(playCenterData)"></i>
                    <el-popover trigger="click">
                        <template #reference>
                            <i class="iconfont icon-volume2" title="音量"></i>
                        </template>
                        <el-slider
                            v-model="playCenterData.volume"
                            vertical height="200px"
                            @change="handleVolumeTask(playCenterData)">
                        </el-slider>
                    </el-popover>
                </div>
                <div class="content-bottom theme" v-else>
                    <i class="iconfont"
                        :class="playCenterData.TaskID ? 'icon-suspend' : 'icon-play'"
                        :title="playCenterData.TaskID ? '暂停' : '播放'"
                        @click="playCenterData.TaskID ? handleSwitchTask(playCenterData, 'pause') : handlePlayTask(playCenterData)">
                    </i>
                    <el-popover trigger="click">
                        <template #reference>
                            <i class="iconfont icon-volume2" title="音量"></i>
                        </template>
                        <el-slider
                            v-model="playCenterData.volume"
                            vertical height="200px"
                            @change="handleVolumeTask(playCenterData)">
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
                                <el-input v-model="form.search" placeholder="任务名称" />
                                <el-button :icon="Search"></el-button>
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
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="taskTypeMap.get(scope.row.type)"></use>
                                        </svg>
                                        {{ scope.row.name }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="priority" label="优先级">
                                    <template #default="scope">
                                        <span class="red">[{{ priorityData.get(scope.row.type) }}]</span>{{
                                                scope.row.priority
                                        }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="120">
                                    <template #default="scope">
                                        <el-button link type="primary" @click.stop="handleStopTask(scope.row)" v-if="handleDecideStatus(scope.row)">
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
                <task-details-config :selectTaskData="selectTaskData"> </task-details-config>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { send } from '@/utils/socket';
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
    play_model: 0,//播放模式
    fullscreen_satus: false, // 全屏状态
    playlist_status: false, // 播放列表状态
    play_list_data: [], // 播放列表数据
    search: "", // 任务搜索
    data: [], // 任务数据
    currentPage: 1,
    pageSize: 20,
    total: 0,
});
const selectTaskData: any = ref({}); //选中的任务数据
const sessionsData: any = computed(()=> {
    return store.sessionsArray.filter((item: any)=> {
        return [12, 13, 14, 15].includes(item.TaskType)
    })
})
const playStatusData: any = computed(()=> { //当前任务播放状态
    return storePlay.playStatusData
})
watch(playStatusData, (newVal)=> {
    form.current_duration = newVal.CurrentTime
    form.total_duration = newVal.TotalTime
    form.song_name = newVal.MusicName
    form.play_status = newVal.PlayStatus
})
// 获取当前显示任务的执行数据
const playCenterShowData = computed(()=> {
    return sessionsData.value.filter((item: any) => {
        if (selectTaskData.value.type < 10) {
            return item.RemoteTaskID === selectTaskData.value.id
        }
        if (selectTaskData.value.type >= 10) {
            return item.TaskID === selectTaskData.value.taskid
        }
    })[0]
})
// 播放器任务详情
const playCenterData = computed(()=> {
    if (playCenterShowData.value)  {
        return {...selectTaskData.value, ...playCenterShowData.value}
    }else {
        return selectTaskData.value
    }
})
watch(playCenterData, (newVal)=> {
    if (newVal.TaskID) {
        // form.play_model
        let data = {
            "company": "BL",
            "actioncode": "c2ms_get_task_play_status",
            "token": "",
            "data": {
                "TaskID": newVal.TaskID,
            },
            "result": 0,
            "return_message": ""
        }
        send(data)
    }
})
const format = () => "";
const handleFullscreenStatus = () => {
    form.fullscreen_satus = !form.fullscreen_satus;
    form.playlist_status = false;
};
const taskTypeMap = new Map([
    [1, "#icon-remote-playback"],
    [11, "#icon-text"],
    [13, "#icon-terminals"],
    [10, "#icon-music-playback"],
]);
const taskPlayMode = new Map([
    [0, 'normal_play'],
    [1, 'loop_play'],
    [2, 'random_play'],
])
const playModeIcon = new Map([
    [0, {
        icon: 'icon-list-play',
        title: '列表播放'
    }],
    [1, {
        icon: 'icon-loop-play',
        title: '循环播放'
    }],
    [2, {
        icon: 'icon-random',
        title: '随机播放'
    }],
])
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const priorityData = new Map();
const activeName = ref("configure");
const playConfig = ref();

// 判断是否显示按钮
const handleTaskButton = () => {
    if (selectTaskData.value.type === 1) {
        return true
    }
    if (selectTaskData.value.type === 4 && selectTaskData.value.fast_sound && selectTaskData.value.fast_sound.type === 1) {
        return
    }
    if (selectTaskData.value.type === 10) {
        return true
    }
    return false
}
// 添加播放任务
const addPlayTask = () => {
    $useRouter.push("/play-task/" + 0);
};
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val;
};
const handleDeleteAll = () => { };
// 编辑
const handleEditButton = () => {
    playConfig.value.handleEditButton();
};
// 获取选中任务详情信息
const handleSelectionClick = (row: any) => {
    selectTaskData.value = row;
};
// 判断任务是否执行中
const handleDecideStatus = (row: any) => {
    if (row.type < 10) {
        return sessionsData.value.some((item: any)=> {
            return item.RemoteTaskID === row.id
        })
    }
    if (row.type >= 10) {
        return sessionsData.value.some((item: any)=> {
            return item.TaskID === row.taskid
        })
    }
}
// 停止任务
const handleStopTask = (row: any) => {
    let key;
    sessionsData.value.some((item: any)=> {
        if (item.RemoteTaskID === row.id) {
            key = item.TaskID
            return true
        }
        if (item.TaskID === row.taskid) {
            key = item.TaskID
            return true
        }
    })
    let data = {
        "company": "BL",
        "actioncode": "c2ms_stop_task",
        "token": "",
        "data": {
            "TaskID": key
        },
        "result": 0,
        "return_message": ""
    }
    send(data)
}
// 播放任务
const handlePlayTask = (row: any) => {
    if (row.type < 10) {
        proxy.$http.get("/details/" + row.id, {
            params: {
                tag: 'BroadcastingStudio',
                withMedias: true,
                withFastSound: true,
                withFastTerminal: true,
                withTerminal: true
            }
        }).then((result: any) => {
            let row = result.data
            let TaskProp = handleTaskAttribute(row)
            if (TaskProp) {
                let data = {
                    company:"BL",
                    actioncode:"c2ms_create_server_task",
                    data: {
                        EndPointsAdditionalProp: {},
                        EndPointList: row.terminalsIds, //终端ID合集
                        TaskID: guid(), //UUID
                        TaskName: row.name, //任务名称
                        Priority: row.priority, //优先级
                        Volume: row.volume, //音量
                        TaskType: handleTaskTypeMap(row), //任务类型
                        UserID: row.users_id,
                        TaskProp: TaskProp
                    }
                }
                send(data)
            }
        })
    }else {
        let data = {
            company:"BL",
            actioncode:"c2ms_create_local_task",
            data: {
                "TaskID": row.taskid,
                "FirstIndex" : row.type === 10 && row.content.length > 0 ? row.content[0].taskid : 0,
            },
            result:0,
            return_message:""
        }
        send(data)
    }
};
// 切换任务状态
const handleSwitchTask = (row: any, type: String) => {
    if (row.TaskID) {
        let data = {
            "company": "BL",
            "actioncode": "c2ms_control_task",
            "token": "",
            "data": {
                "TaskID": row.TaskID,
                "ControlCode" : type,
                "ControlValue" : type === 'progress' ? form.current_duration : ''
            },
            "result": 0,
            "return_message": ""
        }
        send(data)
    }
}
// 音量调节
const handleVolumeTask = (row: any) => {
    if (row.TaskID) {
        let data = {
            company:"BL",
            actioncode:"c2ms_set_task_volume",
            data: {
                TaskID: row.TaskID,
                Volume: row.volume
            },
            result:0,
            return_message:""
        }
        send(data)
    }
}
const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// 任务类型
const handleTaskTypeMap = (row: any) => {
    if ((row.type === 4 && row.sound_source.type === 1) || row.type === 1) { //快捷音源-媒体音乐 && 远程任务（媒体音乐播放）
        return  15
    }
    if ((row.type === 4 && row.sound_source.type === 2)) { //快捷音源-声卡采集 &&
        return  13
    }
    if ((row.type === 4 && row.sound_source.type === 3)) { //快捷音源-终端采集 &&
        return  14
    }
    if (row.type === 10) {
        return 0
    }
    // return type
}
// 任务属性
const handleTaskAttribute = (row: any) => {
    let data = null
    if (row.type === 1) { //远程任务-音乐播放
        data = {
            "TaskAudioType" : 6,
            "RemoteID" : row.id,
            "RemoteType" : "remote_play",
            "RemoteAudioProp" : {
                "MusicIDs" : row.mediasIds,
                "LimitTime" : row.life_time ? timeToSec(row.life_time, 1) : 0,
                "PlayMode" : taskPlayMode.get(row.sound_source.play_model),
                "PlayTimes" : row.sound_source.play_times ? timeToSec(row.sound_source.play_times, 1) : 0
            }
        }
    }
    if (row.type === 4) { //快捷音源
        if (row.sound_source.type === 1) { //音乐播放
            data = {
                "TaskAudioType" : 6,
                "RemoteID" : row.id,
                "RemoteType" : "remote_play",
                "RemoteAudioProp" : {
                    "TaskAudioType" : 1,
                    "MusicIDs" : row.mediasIds,
                    "LimitTime" : row.sound_source.life_time ? timeToSec(row.sound_source.life_time, 1) : 0,
                    "PlayMode" : taskPlayMode.get(row.sound_source.play_model),
                    "PlayTimes" : row.sound_source.play_times ? timeToSec(row.sound_source.play_times, 1) : 0
                }
            }
        }
        if (row.sound_source.type === 2) {//声卡采集
            if (row.fast_sound.fast_source.sound_card) {
                data = {
                    "TaskAudioType" : 6,
                    "RemoteID" : row.id,
                    "RemoteType" : "remote_play",
                    "RemoteAudioProp" : {
                        "TaskAudioType" : 3,
                        "AudioCard" : row.fast_sound.fast_source.sound_card,
                        "LimitTime" : 0,
                    }
                }
            }else {
                proxy.message.warning('未找到采集声卡设备，请重新配置')
            }
        }
        if (row.sound_source.type === 3) {//终端采集
            if (row.fast_sound.fast_source.terminals_id) {
                data = {
                    "TaskAudioType" : 6,
                    "RemoteID" : row.id,
                    "RemoteType" : "remote_play",
                    "RemoteAudioProp" : {
                        "TaskAudioType" : 2,
                        "CollectID" : row.fast_sound.fast_source.terminals_id ? row.fast_sound.fast_source.terminals_id : 0,
                        "SelfCheck" : 0,
                    }
                }
            }else {
                proxy.message.warning('未找到采集终端设备，请重新配置')
            }
        }
    }
    return data
}
// 将时间转换为秒
const timeToSec = (time: any, num = 1) => {
    var hour = time.split(':')[0]
    var min = time.split(':')[1]
    var sec = time.split(':')[2]
    var s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s * num
}
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
    if (row.type < 10) {
        proxy.$http.delete("/broadcasting/" + row.id).then((result: any) => {
            if (result.result === 200) {
                Promise.all([getBroadcastingAll(), getTaskAll()]).then((data: any) => {
                    form.data = [...data[0], ...data[1]];
                });
            }
        });
    } else {
        proxy.$http1
            .delete("/task", {
                data: {
                    ids: [row.id],
                },
            })
            .then((result: any) => {
                if (result.result === 200) {
                    Promise.all([getBroadcastingAll(), getTaskAll()]).then((data: any) => {
                        form.data = [...data[0], ...data[1]];
                    });
                }
            });
    }
};
// 获取所有播放任务
const getBroadcastingAll = () => {
    return new Promise((resolve, reject) => {
        proxy.$http.get("/broadcasting/all").then((restlu: any) => {
            let data = restlu.data.filter((item: { type: number }) => {
                return item.type === 1 || item.type === 4;
            });
            resolve(data);
        });
    });
};
// 获取所有任务(本地)
const getTaskAll = () => {
    return new Promise((resolve, reject) => {
        proxy.$http1
            .get("/task", {
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
    proxy.$http.get("/priority-setting").then((restlu: any) => {
        restlu.data.forEach((item: { task_type: any; priority: any }) => {
            priorityData.set(item.task_type, item.priority);
        });
    });
};
const formatTooltip = (seconds: number) => {
    if (seconds) {
        let data = Math.trunc(seconds / 1000)
        let hour = Math.floor(data / 3600) >= 10 ? Math.floor(data / 3600) : '0' + Math.floor(data / 3600);
        data -= 3600 * Number(hour);
        let min = Math.floor(data / 60) >= 10 ? Math.floor(data / 60) : '0' + Math.floor(data / 60);
        data -= 60 * Number(min);
        let sec = data >= 10 ? data : '0' + data;
        return hour  + ':' + min + ':' + sec
    }else {
        return '00:00:00'
    }
}
// 序号
// const typeIndex = (index: number) => {
//   return index + (form.currentPage - 1) * form.pageSize + 1;
// };

// mounted 实例挂载完成后被调用
onMounted(() => {
    getPrioritySetting();
    Promise.all([getBroadcastingAll(), getTaskAll()]).then((data: any) => {
        form.data = [...data[0], ...data[1]];
        handleSelectionClick(form.data[0]);
        multipleTableRef.value!.setCurrentRow(form.data[0]);
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
