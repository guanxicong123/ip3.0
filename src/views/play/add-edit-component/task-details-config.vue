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
                    <div
                        :class="{'select': activeName === 'configure' }"
                        @click="handleSwitchTabs('configure')"
                    >
                        播放配置（4）
                    </div>
                    <div
                        :class="{'select': activeName === 'region' }"
                        @click="handleSwitchTabs('region')"
                    >
                        播放区域（4）
                    </div>
                </div>
                <div class="com-button">
                    <i class="iconfont icon-edit1" @click="handleEditButton" v-if="!editStatus"></i>
                    <i class="iconfont icon-save" @click="handleEditSava" v-else></i>
                </div>
            </div>
        </div>
        <div class="com-main" v-if="isConfigure">
            <sound-source-component
                v-if="ruleForm.type === 4"
                v-model:ruleForm="ruleForm"
                :selectTaskData="taskDataDetailed"
                :isEdit="editStatus"
                labelPosition="left"
                :adaption="{
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24,
                    xl: 24
                }"
                @requestSoundSource="requestSoundSource">
            </sound-source-component>
            <text-play-component
                v-if="ruleForm.type === 11"
                v-model:tsctFormData="tsctFormData"
                :selectTaskData="taskDataDetailed"
                :isEdit="editStatus"
                labelPosition="left"
                :adaption="{
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24,
                    xl: 24
                }">
            </text-play-component>
            <acquisition-device-component
                v-if="ruleForm.type === 12 || ruleForm.type === 13"
                v-model:sourAcquisiFrom="sourAcquisiFrom"
                :isEdit="editStatus"
                :selectTaskData="taskDataDetailed"
            >
            </acquisition-device-component>
            <div class="com-table" v-if="ruleForm.type === 10">
                <el-table :data="ruleForm.data"  height="100%">
                    <el-table-column type="index" label="序号" width="80"/>
                    <el-table-column prop="path" label="名称" show-overflow-tooltip></el-table-column>
                    <el-table-column width="120">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleMoveUp(scope.row, scope.$index)">
                                <template #icon>
                                    <i class="iconfont icon-move-up" title="上移"></i>
                                </template>
                            </el-button>
                            <el-button link type="primary" @click="handleMoveDown(scope.row, scope.$index)">
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
                    <el-table-column type="index" label="序号" width="80"/>
                    <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
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
                <el-table :data="taskTerminalAll"  height="100%">
                    <el-table-column type="index" label="序号" width="80"/>
                    <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ip_address" label="IP地址" show-overflow-tooltip>
                        <template #default="scope">
                            {{scope.row.hasOwnProperty('ip_address') ? scope.row.ip_address : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="volume" label="音量" show-overflow-tooltip>
                        <template #default="scope">
                            {{scope.row.hasOwnProperty('terminals_id') ? scope.row.volume : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="100">
                        <template #default="scope">
                            {{scope.row.hasOwnProperty('terminals_id') ? scope.row.type : '分组'}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else>
                <el-form
                    :model="ruleForm"
                    :label-position="props.labelPosition"
                    class="play-task-form-inline com-sound-source-component"
                >
                    <el-row :gutter="80">
                        <el-col>
                            <el-form-item label="快捷终端">
                                <div class="fast-sound-source">
                                    <div class="fast-sound-source-name">
                                        {{taskDataDetailed.fast_terminal ? taskDataDetailed.fast_terminal.name : '' }}
                                    </div>
                                    <span v-if="editStatus" class="iconfont icon-select-file" @click="handleShowDialog"></span>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <el-upload
            v-model:file-list="fileList"
            ref="uploadRef"
            class="upload-demo"
            accept=".mp3"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :multiple="true"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="uploadChange"
        >
            <template #trigger>
                <span class="iconfont icon-add" ref="iconAdd" style="display: none"></span>
            </template>
        </el-upload>
        <select-media-dialog
            v-if="mediaDialogVisible"
            v-model:dialogVisible="mediaDialogVisible"
            :responseMedia="responseMedia"
            :responseeMediaGroups="responseeMediaGroups"
            @uploadMedia="uploadMedia">
        </select-media-dialog>
        <quick-terminal-dialog
            v-model:dialogVisible="terminaDialogVisible"
            @handleSelectedConfigure="handleSelectedConfigure">
        </quick-terminal-dialog>
        <terminals-select-dialog
            v-if="terminaSelectVisible"
            v-model:dialogVisible="terminaSelectVisible"
            :taskDataDetailed="taskDataDetailed"
            @handleSelectedTerminals="handleSelectedTerminals">
        </terminals-select-dialog>
    </div>
</template>

<script lang="ts" setup>
import quickTerminalDialog from '@/components/quick-terminal-dialog.vue'
import soundSourceComponent from '../components/sound-source-component.vue'
import textPlayComponent from '../components/text-play-component.vue'
import selectMediaDialog from '../dialogComponents/select-media-dialog.vue'
import terminalsSelectDialog from '../dialogComponents/terminals-select-dialog.vue'
import { UploadProps } from 'element-plus'
const acquisitionDeviceComponent = defineAsyncComponent(() => import("../components/acquisition-device-component.vue"))

const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

const props: any = defineProps({
    selectTaskData: Object,
})
const ruleForm: any = reactive({
    type: 1,
    medias: [],
    medias_groups: [],
    fast_sound_id: [],
    data: []
})
const activeName = ref('configure')
const editStatus = ref(false) //是否在编辑状态
const uploadRef = ref()
const iconAdd = ref()
const fileList = ref([]) //选中的文件
const responseMedia = ref([]) //媒体音频
const responseeMediaGroups = ref([]) //媒体音频分组
const soundSourceForm = ref({}) //快捷音源配置
const sourAcquisiFrom: any = ref({}) //音源采集配置
const tsctFormData = ref({})
const taskDataDetailed: any = ref({}) //任务详情数据
const mediaDialogVisible = ref(false) //选择媒体对话框
const taskTerminalAll: any = ref([]) //任务终端
const terminaDialogVisible = ref(false) //快捷终端弹框
const terminaSelectVisible = ref(false) //终端选择弹框

const isConfigure = computed(()=> {
    return activeName.value === 'configure'
})
watch(()=> props.selectTaskData, (newVal: any)=> {
    handleSelectionData(newVal)
}, {
    deep: true
})
watch(taskDataDetailed, (newVal: any)=> {
    editStatus.value = false
    ruleForm.type = newVal.type
    if (newVal.type === 1) {
        ruleForm.data = [...newVal.medias, ...newVal.medias_groups]
    }
    if (newVal.type === 10 || newVal.type === 12 || newVal.type === 13) {
        ruleForm.data = newVal.content
    }
})
watch(fileList, (newVal: any)=> {
    setTimeout(()=> {
        let data = newVal.map((item: any)=> {
            return {
                name: item.name,
                path: item.raw.path,
                time: item.time
            }
        })
        ruleForm.data.concat(data)
    }, 300)
})

// 切换tabs
const handleSwitchTabs = (tabsName: string) => {
    if (editStatus.value) return 
    activeName.value = tabsName
}
// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
    soundSourceForm.value = data
    ruleForm.fast_sound_id = data.id
    delete soundSourceForm.value.id
}
// 选择快捷终端配置
const handleSelectedConfigure = (data: any) => {
    taskDataDetailed.value.fast_terminals_id = data.id
    taskDataDetailed.value.fast_terminal = data
}
//  选择的终端/终端分组
const handleSelectedTerminals = (data: any) => {
    if (ruleForm.type >= 10) {
        if (activeName.value === 'region' && taskDataDetailed.value.fast_terminals_id !== 0) {
            global.$http1.put('/task/terminal/' + props.selectTaskData.id, {
                terminals: data.terminals,
                terminals_groups: data.terminals_groups
            }).then((result: any) => {
                if (result.result === 200) {
                    handleSelectionData(props.selectTaskData)
                }
            })
            return
        }
    }else {
        global.$http.put('/broadcasting/' + taskDataDetailed.value.id, {
            name: taskDataDetailed.value.name,
            priority: taskDataDetailed.value.priority,
            volume: taskDataDetailed.value.volume,
            play_model: taskDataDetailed.value.play_model,
            type: taskDataDetailed.value.type,
            fast_sound_id: taskDataDetailed.value.fast_sound_id,
            fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
            terminals: data.terminals,
            terminals_groups: data.terminals_groups,
            sound_source: taskDataDetailed.value.sound_source,
            medias: taskDataDetailed.value.medias,
            medias_groups: taskDataDetailed.value.medias_groups,
        }).then((result: any) => {
            if (result.result === 200) {
                editStatus.value = false
                handleSelectionData(props.selectTaskData)
            }
        })
    }
}
// 触发编辑
const handleEditButton = () => {
    if (activeName.value === 'region' && taskDataDetailed.value.fast_terminals_id !== 0) {
        editStatus.value = true
        return
    }
    if (activeName.value === 'region' && taskDataDetailed.value.fast_terminals_id === 0) {
        terminaSelectVisible.value = true
        return
    }
    if (ruleForm.type === 10) {
        iconAdd.value.click()
    }
    if (ruleForm.type === 1) {
        mediaDialogVisible.value = true
        responseMedia.value = taskDataDetailed.value.medias
        responseeMediaGroups.value = taskDataDetailed.value.medias_groups
    }
    if (ruleForm.type === 4 || ruleForm.type === 11 || ruleForm.type === 12 || ruleForm.type === 13) {
        editStatus.value = true
    }
}
// 触发保存
const handleEditSava = () => {
    console.log(props.selectTaskData, taskDataDetailed.value)
    if (ruleForm.type === 4) {
        global.$http.put('/broadcasting/' + props.selectTaskData.id, {
            name: props.selectTaskData.name,
            priority: props.selectTaskData.priority,
            volume: props.selectTaskData.volume,
            play_model: props.selectTaskData.play_model,
            type: props.selectTaskData.type,
            fast_sound_id: ruleForm.fast_sound_id,
            fast_terminals_id: props.selectTaskData.fast_terminals_id,
            terminals: props.selectTaskData.terminals,
            terminals_groups: props.selectTaskData.terminals_groups,
            sound_source: soundSourceForm.value,
            medias: props.selectTaskData.medias,
            medias_groups: props.selectTaskData.medias_groups,
        }).then((result: any) => {
            if (result.result === 200) {
                editStatus.value = false
                handleSelectionData(props.selectTaskData)
            }
        })
    }
    if (ruleForm.type >= 10) {
        if (activeName.value === 'region' && taskDataDetailed.value.fast_terminals_id !== 0) {
            console.log(props.selectTaskData, taskDataDetailed.value)
            global.$http1.put('/task', Object.assign(props.selectTaskData, {
                fast_terminals_id: taskDataDetailed.value.fast_terminals_id,
            })).then((result: any) => {
                if (result.result === 200) {
                    editStatus.value = false
                    handleSelectionData(props.selectTaskData)
                }
            })
            return
        }
        let data;
        if (ruleForm.type === 11) {
            data = tsctFormData.value
        }
        if (ruleForm.type === 12 || ruleForm.type === 13) {
            if (ruleForm.type === 12) {
                data = {
                    audioQuality: sourAcquisiFrom.value.audioQuality,
                    record: sourAcquisiFrom.value.record,
                    recordpath: sourAcquisiFrom.value.recordpath
                }
            }else {
                data = {
                    audioQuality: sourAcquisiFrom.value.audioQuality,
                    terminalID: sourAcquisiFrom.value.terminalID,
                }
            }
            global.$http1.put('/task', Object.assign(props.selectTaskData, {
                content: data,
                type: ruleForm.type
            })).then((result: any) => {
                if (result.result === 200) {
                    editStatus.value = false
                    handleSelectionData(props.selectTaskData)
                }
            })
            return
        }
    }
}
const uploadMedia = (data: any) => {
    global.$http.put('/broadcasting/' + props.selectTaskData.id, {
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
    }).then((result: any) => {
        if (result.result === 200) {
            mediaDialogVisible.value = false
            handleSelectionData(props.selectTaskData)
        }
    })
}
// 弹出快捷终端选择
const handleShowDialog = () => {
    terminaDialogVisible.value = true
}
// 选中文件时触发
const uploadChange: UploadProps['onChange'] = (uploadFile: any) => {
    getTimes(uploadFile)
}
 // 获取文件时长
const getTimes = (file: any) => {
    var content = file.raw
    //获取录音时长
    var url = URL.createObjectURL(content);
        //经测试，发现audio也可获取视频的时长
    var audioElement = new Audio(url);
    file['time'] = 0
    audioElement.addEventListener("loadedmetadata", () => {
        let data = audioElement.duration;
        file['time'] = parseInt(data)
    })
}
// 上移
const handleMoveUp = (row: any, index: number) => {
    if (index === 0) return
    ruleForm.data[index] = ruleForm.data.splice(index-1, 1, ruleForm.data[index])[0]
    global.$http1.put('/task/detail/' + props.selectTaskData.id, {
        content: ruleForm.data
    }).then((result: any) => {
        if (result.result === 200) {
           
        }
    })
}
// 下移
const handleMoveDown = (row: any, index: number) => {
    if (index + 1 === ruleForm.data.length) return
    ruleForm.data[index] = ruleForm.data.splice(index + 1, 1, ruleForm.data[index])[0]
    global.$http1.put('/task/detail/' + props.selectTaskData.id, {
        content: ruleForm.data
    }).then((result: any) => {
        if (result.result === 200) {
           
        }
    })
}
// 删除音频
const handleDelete = (row: any) => {
    if (ruleForm.type === 10) {
        global.$http1.delete('/task/localmusic', {
            data: {
                id: props.selectTaskData.id,
                path: row.path
            }
        }).then((result: any) => {
            if (result.result === 200) {
                ruleForm.data = ruleForm.data.filter((item: any)=> {
                    return item !== row
                })
            }
        })
        return
    }
    global.$http.delete('/broadcasting/del-groups-medias', {
        data: {
            id: props.selectTaskData.id,
            medias_groups: row.medias_id ? '' : row.medias_groups_id,
            medias: row.medias_id ? row.medias_id : ''
        }
    }).then((result: any) => {
        if (result.result === 200) {
            ruleForm.data = ruleForm.data.filter((item: any)=> {
                return item !== row
            })
        }
    })
}
// 获取选中任务详情信息
const handleSelectionData = (row: any) => {
    if (row.type < 10) {
        global.$http.get('/broadcasting/' + row.id, {
            params: {
                withMedias: true,
                withGroups: true,
                withFastSound: true,
                withTerminals: true,
                withFastTerminal: true
            }
        }).then((restlu: any)=> {
            taskDataDetailed.value = restlu.data
            const terminals = restlu.data.terminals ? restlu.data.terminals : []
            const terminals_groups = restlu.data.terminals_groups ? restlu.data.terminals_groups : []
            taskTerminalAll.value = [...terminals, ...terminals_groups]
            console.log(taskDataDetailed.value)
        })
    }else {
        global.$http1.get('/task/' + row.id).then((restlu: any)=> {
            taskDataDetailed.value = restlu.data
            if (restlu.data.fast_terminals_id) {
                getFastTerminals().then((data: any)=> {
                    taskDataDetailed.value['fast_terminal'] = data.filter((item: { id: any })=> {
                        return item.id === restlu.data.fast_terminals_id
                    })[0]
                })
            }
        })
    }
}
// 获取快捷终端
const getFastTerminals = () => {
    return new Promise<void>((resolve, reject)=> {
        global.$http.get('/fast-terminals/all').then((result: any)=> {
            if (result.result === 200) {
                resolve(result.data)
            } 
        })
    })
}
// 时长转换
const formatSecondNo = (seconds: any) => {
    let hour: any = Math.floor(seconds / 3600) >= 10 ? Math.floor(seconds / 3600) : '0' + Math.floor(seconds / 3600);
    seconds -= 3600 * hour;
    let min: any = Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60);
    seconds -= 60 * min;
    let sec = seconds >= 10 ? Math.trunc(seconds) : '0' +  Math.trunc(seconds);
    return  hour  + ':' + min + ':' +  sec;
}
// mounted 实例挂载完成后被调用
onMounted(() => {
})
defineExpose({ handleEditButton })
</script>

<style lang="scss">
.com-task-details-config {
    width: 100%;
    .com-tabs {
        margin-left: 10px;
        >div {
            width: 110px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #84A2C4;
            display: inline-block;
            cursor: pointer;
            &:last-child {
                border-left: 1px solid #C5D6E8;
                padding-left: 18px;
            }
        }
        .select {
            font-size: 14px;
            font-weight: bold;
            color: #6F95C1;
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
                color: #0070EE;
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
            color: #FFFFFF;
            padding: 0px 16px;
            background-color: #0070EE;
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