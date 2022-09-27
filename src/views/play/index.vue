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
                <div class="content-top" :class="form.play_status ? 'playing' : ''">
                    <img class="record-arm" src="@/assets/images/record-arm.png" alt="" />
                    <img class="record" src="@/assets/images/record.png" alt="" />
                </div>
                <div class="content-center">
                    <p>{{ form.song_name }}</p>
                    <div class="progress">
                        <el-progress :percentage="form.percentage" :format="format" :stroke-width="3" color="#0070EE" />
                        <span class="fl">{{ form.current_duration }}</span>
                        <span class="fr">{{ form.total_duration }}</span>
                    </div>
                </div>
                <div class="content-bottom theme">
                    <i class="iconfont icon-list-play" title="播放列表"
                        @click="form.playlist_status = !form.playlist_status" v-if="form.fullscreen_satus"></i>
                    <i class="iconfont icon-loop-play" title="循环播放"></i>
                    <i class="iconfont icon-prev" title="上一首"></i>
                    <i class="iconfont" :class="form.play_status ? 'icon-suspend' : 'icon-play'"
                        :title="form.play_status ? '暂停' : '播放'" @click="form.play_status = !form.play_status"></i>
                    <i class="iconfont icon-next" title="下一首"></i>
                    <i class="iconfont icon-end" title="停止"></i>
                    <i class="iconfont icon-volume2" title="音量"></i>
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
                                highlight-current-row
                                @selection-change="handleSelectionChange"
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
                                        <span class="red">[{{ priorityData.get(scope.row.type) }}]</span>{{ scope.row.priority
                                        }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="120">
                                    <template #default="scope">
                                        <el-button link type="primary">
                                            <template #icon>
                                                <i class="iconfont icon-play" title="播放"></i>
                                            </template>
                                        </el-button>
                                        <el-button link type="danger">
                                            <template #icon>
                                                <i class="iconfont icon-edit" title="编辑"></i>
                                            </template>
                                        </el-button>
                                        <el-button link type="primary" @click.stop="handleDelete(scope.row)">
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
                <task-details-config
                    :selectTaskData="selectTaskData">
                </task-details-config>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus"
import { Search } from "@element-plus/icons-vue"
const taskDetailsConfig = defineAsyncComponent(() => import("./add-edit-component/task-details-config.vue"))
const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();

interface User {
    date: string;
    name: string;
    address: string;
}

const form = reactive<any>({
    percentage: 50, // 进度
    song_name: "音乐播放2.mp3", // 歌曲名称
    total_duration: "05:25", // 总时长
    current_duration: "00:25", // 当前时长
    play_status: false, // 播放状态
    fullscreen_satus: false, // 全屏状态
    playlist_status: false, // 播放列表状态
    play_list_data: [], // 播放列表数据
    search: "", // 任务搜索
    data: [], // 任务数据
    currentPage: 1,
    pageSize: 20,
    total: 0,
});
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
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const selectTaskData: any = ref({}); //选中的任务数据
const priorityData = new Map()
const activeName = ref('configure')
const playConfig = ref()

// 添加播放任务
const addPlayTask = () => {
    $useRouter.push('/play-task/' + 0)
}
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val;
};
const handleDeleteAll = () => {

}
// 编辑
const handleEditButton = () => {
    playConfig.value.handleEditButton()
}
// 获取选中任务详情信息
const handleSelectionClick = (row: any) => {
    selectTaskData.value = row
}
// 删除播放任务
const handleDelete = (row: any) => {
    if (row.type < 10) {
        global.$http.delete('/broadcasting/' + row.id).then((result: any)=> {
            if (result.result === 200) {
                Promise.all([
                    getBroadcastingAll(),
                    getTaskAll()
                ]).then((data: any) => {
                    form.data = [...data[0], ...data[1]]
                })
            }
        })
    }else {
        global.$http1.delete('/task', {
            data: {
                ids: [row.id]
            }
        }).then((result: any)=> {
            if (result.result === 200) {
                Promise.all([
                    getBroadcastingAll(),
                    getTaskAll()
                ]).then((data: any) => {
                    form.data = [...data[0], ...data[1]]
                })
            }
        })
    }
}
// 获取所有播放任务
const getBroadcastingAll = () => {
    return new Promise((resolve, reject) => {
        global.$http.get('/broadcasting/all').then((restlu: any)=> {
            let data = restlu.data.filter((item: { type: number; })=> {
                return item.type === 1 || item.type === 4
            })
            resolve(data)
        })
    })
}
// 获取所有任务(本地)
const getTaskAll = () => {
    return new Promise((resolve, reject) => {
        global.$http1.get('/task', {
            params: {
                userID: localStorage.get("LoginUserID"),
                serverIP: localStorage.get("serverIP")
            }
        }).then((restlu: any)=> {
            if (Array.isArray(restlu.data)) {
                resolve(restlu.data)
            }else {
                resolve([])
            }
        })
    })
}
// 获取所有系统优先级
const getPrioritySetting = () => {
    global.$http.get('/priority-setting').then((restlu: any)=> {
        restlu.data.forEach((item: { task_type: any; priority: any; })=> {
            priorityData.set(item.task_type, item.priority)
        })
    })
}
// 序号
// const typeIndex = (index: number) => {
//   return index + (form.currentPage - 1) * form.pageSize + 1;
// };

// mounted 实例挂载完成后被调用
onMounted(() => {
    getPrioritySetting()
    Promise.all([
        getBroadcastingAll(),
        getTaskAll()
    ]).then((data: any) => {
        console.log(data)
        form.data = [...data[0], ...data[1]]
        handleSelectionClick(form.data[0])
        multipleTableRef.value!.setCurrentRow(form.data[0])
    })
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
