<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-15
  @FilePath: src\views\play\add-edit-component\task-details-config.vue
  @Describe: 播放中心-任务配置
-->
<template>
    <div class="com-index com-task-details-config">
        <div class="com-head">
            <div class="com-head-content">
                <div class="com-tabs">
                    <div :class="{ select: activeName === 'configure' }" @click="handleSwitchTabs('configure')">
                        播放配置
                        {{musicsNumber !=='' ? '(' + musicsNumber + ')' : ''}}
                    </div>
                    <div :class="{ select: activeName === 'region' }" @click="handleSwitchTabs('region')">
                        播放区域
                        {{terminasNumber !== '' ? '(' + terminasNumber + ')' : ''}}
                    </div>
                </div>
                <div class="com-button">
                    <i class="iconfont icon-edit1" @click="handleEditButton" v-if="!editStatus"></i>
                    <i class="iconfont icon-save" @click="handleEditSava" v-else></i>
                </div>
            </div>
        </div>
        <div class="com-main" v-if="isConfigure">
            <sound-source-component v-if="ruleForm.type === 4" v-model:ruleForm="ruleForm"
                :selectTaskData="taskDataDetailed" :isEdit="editStatus" labelPosition="left" :adaption="{
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24,
                    xl: 24,
                }" @requestSoundSource="requestSoundSource">
            </sound-source-component>
            <text-play-component v-if="ruleForm.type === 11" v-model:tsctFormData="tsctFormData"
                :selectTaskData="taskDataDetailed" :isEdit="editStatus" labelPosition="left" :adaption="{
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24,
                    xl: 24,
                }">
            </text-play-component>
            <acquisition-device-component v-if="ruleForm.type === 12 || ruleForm.type === 13"
                v-model:sourAcquisiFrom="sourAcquisiFrom" :isEdit="editStatus" :selectTaskData="taskDataDetailed">
            </acquisition-device-component>
            <div class="com-table" v-if="ruleForm.type === 10">
                <el-table :data="ruleForm.data" height="100%" @row-dblclick="handelRowDblclick">
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="path" label="名称" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="tabel-data-popover">
                                <div class="tabel-data-popover-content">
                                    <span>
                                        {{ scope.row.name }}
                                    </span>
                                    <!-- <view-components-popover v-if="!scope.row.medias_id"
                                        :url="'/medias-groups/' + scope.row.id + '/medias'"
                                    /> -->
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="120">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleMoveUp(scope.row, scope.$index)" :disabled="scope.$index === 0">
                                <template #icon>
                                    <i class="iconfont icon-move-up" title="上移"></i>
                                </template>
                            </el-button>
                            <el-button link type="primary" @click="handleMoveDown(scope.row, scope.$index)" :disabled="scope.$index + 1 === ruleForm.data.length">
                                <template #icon>
                                    <i class="iconfont icon-move-down" title="下移"></i>
                                </template>
                            </el-button>
                            <el-button link type="primary" @click="handleDelete(scope.row)">
                                <template #icon>
                                    <i class="iconfont icon-delete" title="删除"></i>
                                </template>
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="时长" width="100">
                        <template #default="scope">
                            {{ formatSecondNo(scope.row.time) }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="com-table" v-if="ruleForm.type === 1">
                <el-table :data="ruleForm.data" style="width: 100%" height="100%">
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="name" label="名称" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="tabel-data-popover">
                                <div class="tabel-data-popover-content">
                                    <span>
                                        {{ scope.row.name }}
                                    </span>
                                    <!-- <view-components-popover v-if="!scope.row.medias_id"
                                        :url="'/medias'"
                                        :mediaGroupsID="scope.row.id"
                                    /> -->
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleDelete(scope.row)">
                                <template #icon>
                                    <i class="iconfont icon-delete" title="删除"></i>
                                </template>
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="length" label="时长" width="100">
                        <template #default="scope">
                            {{ formatSecondNo(scope.row.length) }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="com-main" v-else>
            <div class="com-table" v-if="taskDataDetailed.fast_terminals_id === 0">
                <el-table :data="taskTerminalAll" height="100%">
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="name" label="名称" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="tabel-data-popover">
                                <div class="tabel-data-popover-content">
                                    <span>
                                        {{ scope.row.name }}
                                    </span>
                                    <view-components-popover
                                        v-if="scope.row.terminals_groups_id"
                                        :url="'/terminals-groups/' + scope.row.id + '/terminals'"
                                    />
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ip_address" label="IP地址" show-overflow-tooltip>
                        <template #default="scope">
                            {{ scope.row.hasOwnProperty("ip_address") ? scope.row.ip_address : "-" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="volume" label="音量" show-overflow-tooltip>
                        <template #default="scope">
                            {{ scope.row.hasOwnProperty("terminals_id") ? scope.row.volume : "-" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="100">
                        <template #default="scope">
                            {{ scope.row.hasOwnProperty("terminals_id") ? formatterTerminalsType(scope.row) : "分组" }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else>
                <el-form :model="ruleForm" :label-position="props.labelPosition"
                    class="play-task-form-inline com-sound-source-component">
                    <el-row :gutter="80">
                        <el-col>
                            <el-form-item label="快捷终端">
                                <div class="fast-sound-source">
                                    <div class="fast-sound-source-name">
                                        {{
                                            taskDataDetailed.fast_terminal
                                                ? taskDataDetailed.fast_terminal.name
                                                : ""
                                        }}
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <el-upload
            v-model:file-list="fileList" ref="uploadRef"
            class="upload-demo" accept=".mp3"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :multiple="true" :auto-upload="false"
            :show-file-list="false" :on-change="uploadChange">
            <template #trigger>
                <span class="iconfont icon-add" ref="iconAdd" style="display: none"></span>
            </template>
        </el-upload>
        <select-media-dialog
            v-if="mediaDialogVisible"
            v-model:dialogVisible="mediaDialogVisible"
            :responseMedia="responseMedia"
            :responseeMediaGroups="responseeMediaGroups"
            @uploadMedia="uploadMedia"
        >
        </select-media-dialog>
        <quick-terminal-dialog 
            v-model:dialogVisible="terminaDialogVisible"
            :seleQuickTerminal="taskDataDetailed.fast_terminal"
            @handleSelectedConfigure="handleSelectedConfigure"
        >
        </quick-terminal-dialog>
        <terminals-select-dialog
            v-if="terminaSelectVisible"
            v-model:dialogVisible="terminaSelectVisible"
            :taskDataDetailed="taskDataDetailed"
            @handleSelectedTerminals="handleSelectedTerminals"
        >
        </terminals-select-dialog>
    </div>
</template>

<script lang="ts" setup>
import quickTerminalDialog from "@/components/quick-terminal-dialog.vue";
import soundSourceComponent from "../components/sound-source-component.vue";
import textPlayComponent from "../components/text-play-component.vue";
import selectMediaDialog from "../dialogComponents/select-media-dialog.vue";
import terminalsSelectDialog from "../dialogComponents/terminals-select-dialog.vue";
import { UploadProps } from "element-plus";
import { send } from "@/utils/socket";
import usePublicMethod from "@/utils/global/index";

// defineAsyncComponent 异步组件-懒加载子组件
const acquisitionDeviceComponent = defineAsyncComponent(
    () => import("../components/acquisition-device-component.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
    selectTaskData: Object,
    playCenterData: Object,
});
const ruleForm: any = reactive({
    type: 1,
    medias: [],
    medias_groups: [],
    fast_sound_id: [],
    data: [],
});
const activeName = ref("configure");
const editStatus = ref(false); //是否在编辑状态
const uploadRef = ref();
const iconAdd = ref();
const fileList = ref([]); //选中的文件
const responseMedia = ref([]); //媒体音频
const responseeMediaGroups = ref([]); //媒体音频分组
const soundSourceForm: any = ref({}); //快捷音源配置
const sourAcquisiFrom: any = ref({}); //音源采集配置
const tsctFormData = ref({});
const taskDataDetailed: any = ref({}); //任务详情数据
const mediaDialogVisible = ref(false); //选择媒体对话框
const taskTerminalAll: any = ref([]); //任务终端
const terminaDialogVisible = ref(false); //快捷终端弹框
const terminaSelectVisible = ref(false); //终端选择弹框

const isConfigure = computed(() => {
    return activeName.value === "configure";
});

const terminasNumber = computed(()=> {
    return taskDataDetailed.value.fast_terminals_id ? '' : taskTerminalAll.value.length
})

const musicsNumber = computed(()=> {
    return [1, 10].includes(taskDataDetailed.value.type) ? ruleForm.data.length : ''
})

watch(
    () => props.selectTaskData,
    (newVal: any) => {
        handleSelectionData(newVal)
    },
    {
        deep: true,
    }
);
watch(taskDataDetailed, (newVal: any) => {
    editStatus.value = false;
    ruleForm.type = newVal.type;
    if (newVal.type === 1) {
        ruleForm.data = [...newVal.medias_groups, ...newVal.medias];
    }
    if (newVal.type === 10 || newVal.type === 12 || newVal.type === 13) {
        ruleForm.data = newVal.content;
    }
});

const handelRowDblclick = (row: any, column, event) => {
    console.log(row, column, event, props.playCenterData)
}

// 切换tabs
const handleSwitchTabs = (tabsName: string) => {
    if (editStatus.value) return;
    activeName.value = tabsName;
};
// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
    soundSourceForm.value = data;
    ruleForm.fast_sound_id = data.id;
    delete soundSourceForm.value.id
};
// 选择快捷终端配置
const handleSelectedConfigure = (data: any) => {
    taskDataDetailed.value.fast_terminals_id = data.id
    if (ruleForm.type < 10) {
        handleRemoteTasks().then(()=> {
            handleChangeTaskTerminals()
        })
    }else {
        handleLocalTaskTermina().then(()=> {
            handleChangeTaskTerminals()
        })
    }
};
//  选择的终端/终端分组
const handleSelectedTerminals = (data: any) => {
    let putData = {
        terminals:  data.terminals,
        terminals_groups: data.terminals_groups.map((item: any) => {
            return {
                name: item.name,
                terminals_groups_id: item.terminals_groups_id
            }
        })
    }
    if (ruleForm.type >= 10) {
        if (activeName.value === "region" && taskDataDetailed.value.fast_terminals_id === 0) {
            proxy.$http1.put("/task/terminal/" + props.selectTaskData.id, {
                terminals: putData.terminals,
                terminals_groups: putData.terminals_groups,
            })
            .then((result: any) => {
                if (result.result === 200) {
                    handleChangeTaskTerminals()
                }
            });
            return;
        }
    } else {
        proxy.$http.put("/broadcasting/" + taskDataDetailed.value.id, {
            name: taskDataDetailed.value.name,
            priority: taskDataDetailed.value.priority,
            volume: taskDataDetailed.value.volume,
            play_model: taskDataDetailed.value.play_model,
            type: taskDataDetailed.value.type,
            fast_sound_id: taskDataDetailed.value.fast_sound_id,
            fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
            terminals: putData.terminals,
            terminals_groups: putData.terminals_groups,
            sound_source: taskDataDetailed.value.sound_source,
            medias: taskDataDetailed.value.medias,
            medias_groups: taskDataDetailed.value.medias_groups,
        }).then((result: any) => {
            if (result.result === 200) {
                editStatus.value = false;
                handleChangeTaskTerminals()
            }
        });
    }
};
// 改变任务终端
const handleChangeTaskTerminals = () => {
    handleSelectionData(props.selectTaskData).then((result: any)=> {
        if (props.playCenterData.TaskID) {
            let newTerminals = result?.terminalsIds
            handleAllTerminals(newTerminals, props.playCenterData)
        }
    })
}
const handleAllTerminals = (newVal: any, oldVal: any) => {
    let oldValData = oldVal.EndPointList.map((item: any) => {
        return item.EndPointID
    })
    // 新增数据
    let addData = newVal.filter((item: any)=> {
        return !oldValData.includes(item)
    })
    // 删除数据
    let delData = oldValData.filter((item: any)=> {
        return !newVal.includes(item)
    })
    if (addData.length > 0) {
        let data = {
            company: "BL",
            actioncode: "ms2cs_notify_add_endpoint_to_task",
            token: "",
            data: {
                TaskID: props.playCenterData.TaskID,
                EndPoints: addData
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
    if (delData.length > 0) {
        let data = {
            company: "BL",
            actioncode: "ms2cs_notify_remove_endpoint_to_task",
            token: "",
            data: {
                TaskID: props.playCenterData.TaskID,
                EndPoints: delData
            },
            result: 0,
            return_message: "",
        };
        send(data);
    }
}
// 触发编辑
const handleEditButton = () => {
    if (activeName.value === "region" && taskDataDetailed.value.fast_terminals_id !== 0) {
        terminaDialogVisible.value = true;
        return;
    }
    if (activeName.value === "region" && taskDataDetailed.value.fast_terminals_id === 0) {
        terminaSelectVisible.value = true;
        return
    }
    if (props.playCenterData.TaskID) return proxy.$message.warning('任务正在执行中')
    if (ruleForm.type === 10) {
        iconAdd.value.click();
    }
    if (ruleForm.type === 1) {
        responseMedia.value = taskDataDetailed.value.medias;
        responseeMediaGroups.value = taskDataDetailed.value.medias_groups;
        mediaDialogVisible.value = true;
    }
    if (
        ruleForm.type === 4 ||
        ruleForm.type === 11 ||
        ruleForm.type === 12 ||
        ruleForm.type === 13
    ) {
        editStatus.value = true;
    }
};
// 触发保存
const handleEditSava = () => {
    if (ruleForm.type === 4) {
        handleRemoteTasks().then(()=> {
            editStatus.value = false;
            handleSelectionData(props.selectTaskData);
        })
        return
    }
    if (ruleForm.type >= 10) {
        let data;
        if (ruleForm.type === 11) {
            data = tsctFormData.value;
        }
        if (ruleForm.type === 12 || ruleForm.type === 13) {
            ruleForm.type = sourAcquisiFrom.value.type
            if (sourAcquisiFrom.value.type === 12) {
                data = {
                    audioQuality: sourAcquisiFrom.value.audioQuality,
                    record: sourAcquisiFrom.value.record,
                    recordpath: sourAcquisiFrom.value.recordpath,
                    soundcard: sourAcquisiFrom.value.soundcard
                };
            } else {
                data = {
                    audioQuality: sourAcquisiFrom.value.audioQuality,
                    terminalID: sourAcquisiFrom.value.terminalID,
                };
            }
        }
        proxy.$http1.put("/task",
            Object.assign(props.selectTaskData, {
                content: data,
                type: ruleForm.type,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                editStatus.value = false;
                handleSelectionData(props.selectTaskData);
            }
        });
    }
};
// 更新远程任务
const handleRemoteTasks = () => {
    return new Promise((resolve: any, reject: any)=> {
        proxy.$http.put("/broadcasting/" + props.selectTaskData.id, {
            name: props.selectTaskData.name,
            priority: props.selectTaskData.priority,
            volume: props.selectTaskData.volume,
            play_model: props.selectTaskData.play_model,
            type: props.selectTaskData.type,
            fast_sound_id: props.selectTaskData.fast_sound_id,
            fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
            terminals: props.selectTaskData.terminals,
            terminals_groups: props.selectTaskData.terminals_groups,
            sound_source: props.selectTaskData.type === 4 ? soundSourceForm.value : '',
            medias: props.selectTaskData.medias,
            medias_groups: props.selectTaskData.medias_groups,
        }).then((result: any) => {
            if (result.result === 200) {
                resolve()
            }
        });
    })
}
// 更新本地任务（快捷终端修改）
const handleLocalTaskTermina = () => {
    return new Promise((resolve: any, reject: any)=> {
        proxy.$http1.put(
            "/task",
            Object.assign(props.selectTaskData, {
                fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                handleSelectionData(props.selectTaskData)
            }
        });
    })
}
// 更新本地任务（本地音频添加）
const handleLocalTaskMusic = () => {
    if (fileList.value.length > 0) {
        let data = fileList.value.map((item: any) => {
            return {
                name: item.name,
                path: item.raw.path,
                time: item.time,
            };
        });
        let newArrPath: any = []
        let newArrData: any = []
        ruleForm.data.concat(data).forEach((item: any)=> {
            if (!newArrPath.includes(item.path)) {
                newArrPath.push(item.path)
                newArrData.push(item)
            }
        })
        proxy.$http1.put(
            "/task",
            Object.assign(props.selectTaskData, {
                content: newArrData,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                fileList.value = []
                handleSelectionData(props.selectTaskData)
            }
        });
    }
}
// 媒体弹框更新保存
const uploadMedia = (data: any) => {
    proxy.$http
        .put("/broadcasting/" + props.selectTaskData.id, {
            name: props.selectTaskData.name,
            priority: props.selectTaskData.priority,
            volume: props.selectTaskData.volume,
            play_model: props.selectTaskData.play_model,
            type: props.selectTaskData.type,
            fast_sound_id: props.selectTaskData.fast_sound_id,
            fast_terminals_id: props.selectTaskData.fast_terminals_id,
            terminals: props.selectTaskData.terminals,
            terminals_groups: props.selectTaskData.terminals_groups,
            sound_source: props.selectTaskData.sound_source,
            medias: data.medias,
            medias_groups: data.medias_groups,
        })
        .then((result: any) => {
            if (result.result === 200) {
                responseMedia.value = []
                responseeMediaGroups.value = []
                mediaDialogVisible.value = false;
                handleSelectionData(props.selectTaskData);
            }
        });
};
// 选中文件时触发
const uploadChange: UploadProps["onChange"] = (uploadFile: any, uploadFiles: any) => {
    getTimes(uploadFile);
    usePublicMethod.debounce(handleLocalTaskMusic, 500)
};
// 获取文件时长
const getTimes = (file: any) => {
    var content = file.raw;
    //获取录音时长
    var url = URL.createObjectURL(content);
    //经测试，发现audio也可获取视频的时长
    var audioElement = new Audio(url);
    file["time"] = 0;
    audioElement.addEventListener("loadedmetadata", () => {
        let data = audioElement.duration;
        file["time"] = parseInt(data);
    });
};
// 上移
const handleMoveUp = (row: any, index: number) => {
    if (index === 0) return;
    ruleForm.data[index] = ruleForm.data.splice(index - 1, 1, ruleForm.data[index])[0];
    proxy.$http1
        .put("/task/detail/" + props.selectTaskData.id, {
            content: ruleForm.data,
        })
        .then((result: any) => {
            if (result.result === 200) {
            }
        });
};
// 下移
const handleMoveDown = (row: any, index: number) => {
    if (index + 1 === ruleForm.data.length) return;
    ruleForm.data[index] = ruleForm.data.splice(index + 1, 1, ruleForm.data[index])[0];
    proxy.$http1
        .put("/task/detail/" + props.selectTaskData.id, {
            content: ruleForm.data,
        })
        .then((result: any) => {
            if (result.result === 200) {
            }
        });
};
// 删除音频
const handleDelete = (row: any) => {
    if (ruleForm.type === 10) {
        proxy.$http1
            .delete("/task/localmusic", {
                data: {
                    id: props.selectTaskData.id,
                    path: row.path,
                },
            })
            .then((result: any) => {
                if (result.result === 200) {
                    ruleForm.data = ruleForm.data.filter((item: any) => {
                        return item !== row;
                    });
                }
            });
        return;
    }
    proxy.$http
        .delete("/broadcasting/del-groups-medias", {
            data: {
                id: props.selectTaskData.id,
                medias_groups: row.medias_id ? "" : row.medias_groups_id,
                medias: row.medias_id ? row.medias_id : "",
            },
        })
        .then((result: any) => {
            if (result.result === 200) {
                handleSelectionData(props.selectTaskData)
            }
        });
};
// 获取选中任务详情信息
const handleSelectionData = (row: any) => {
    return new Promise((resolve: any, reject: any)=> {
        if (row.type < 10) {
            proxy.$http.get("/details/" + row.id, {
                params: {
                    tag: "BroadcastingStudio",
                    withMedias: true,
                    withGroups: true,
                    withFastSound: true,
                    withTerminals: true,
                    withFastTerminal: true,
                },
            }).then((restlu: any) => {
                taskDataDetailed.value = restlu.data;
                const terminals = restlu.data.terminals ? restlu.data.terminals : [];
                const terminals_groups = restlu.data.terminals_groups
                    ? restlu.data.terminals_groups
                    : [];
                taskTerminalAll.value = [...terminals_groups, ...terminals];
                if (restlu.data.fast_terminals_id) {
                    getFastTerminals().then((data: any) => {
                        taskDataDetailed.value["fast_terminal"] = data.filter((item: { id: any }) => {
                            return item.id === restlu.data.fast_terminals_id;
                        })[0];
                    });
                }
                resolve(restlu.data)
            });
        } else {
            proxy.$http1.get("/task/" + row.id).then((restlu: any) => {
                taskDataDetailed.value = restlu.data;
                if (restlu.data.fast_terminals_id) {
                    getFastTerminals().then((data: any) => {
                        taskDataDetailed.value["fast_terminal"] = data.filter((item: { id: any }) => {
                            return item.id === restlu.data.fast_terminals_id;
                        })[0];
                    });
                }
                const terminals = restlu.data.terminals ? restlu.data.terminals : [];
                const terminals_groups = restlu.data.terminals_groups
                    ? restlu.data.terminals_groups
                    : [];
                taskTerminalAll.value = [...terminals_groups, ...terminals];
                resolve(restlu.data)
            });
        }
    })
};

// 获取快捷终端
const getFastTerminals = () => {
    return new Promise<void>((resolve, reject) => {
        proxy.$http.get("/fast-terminals/all").then((result: any) => {
            if (result.result === 200) {
                resolve(result.data);
            }
        });
    });
};
// 时长转换
const formatSecondNo = (seconds: any) => {
    let hour: any =
        Math.floor(seconds / 3600) >= 10
            ? Math.floor(seconds / 3600)
            : "0" + Math.floor(seconds / 3600);
    seconds -= 3600 * hour;
    let min: any =
        Math.floor(seconds / 60) >= 10
            ? Math.floor(seconds / 60)
            : "0" + Math.floor(seconds / 60);
    seconds -= 60 * min;
    let sec = seconds >= 10 ? Math.trunc(seconds) : "0" + Math.trunc(seconds);
    return hour + ":" + min + ":" + sec;
};

// 格式化终端类型
const formatterTerminalsType = (row: User) => {
  return useFormatMap.terminalsMap.get(row.type);
};
// mounted 实例挂载完成后被调用
onMounted(() => { });
defineExpose({ handleEditButton });
</script>

<style lang="scss">
.com-task-details-config {
    width: 100%;

    .com-tabs {
        margin-left: 10px;

        >div {
            // width: 110px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #84a2c4;
            display: inline-block;
            cursor: pointer;

            &:last-child {
                border-left: 1px solid #c5d6e8;
                padding-left: 20px;
            }
            &:first-child {
                padding-right: 20px;
            }
        }

        .select {
            font-size: 14px;
            font-weight: bold;
            color: #6f95c1;
        }
    }

    .el-input {
        width: 214px;
    }

    .com-main {
        margin: 0px 10px;
        width: calc(100% - 20px);

        .fast-sound-source {
            position: relative;

            .fast-sound-source-name {
                display: inline-block;
                width: 192px;
                height: 30px;
                padding: 1px 11px;
                color: var(--el-disabled-text-color);
                box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
                cursor: not-allowed;
                border-radius: 3px;
            }

            .el-input.is-disabled .el-input__wrapper {
                background-color: #fff;
            }

            .iconfont {
                position: absolute;
                right: -22px;
                color: #0070ee;
                cursor: pointer;
            }
        }
    }

    .recording-evt {
        display: flex;
        height: 30px;
        overflow: hidden;

        .recording-evt-select {
            font-size: 14px;
            color: #ffffff;
            padding: 0px 16px;
            background-color: #0070ee;
            border-radius: 4px;
            cursor: pointer;
        }

        .recording-evt-path {
            color: #666666;
            font-size: 12px;
            line-height: 40px;
            flex: 1;
            margin-left: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
