<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-02
  @FilePath: src\views\play\components\play-config-component.vue
  @Describe: 播放配置
-->
<template>
    <div class="com-play-config-component">
        <sound-source-component
            v-if="ruleForm.type === 4"
            v-model:ruleForm="ruleForm"
            :selectTaskData="taskDataDetailed"
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
            v-model:tsctFormData="tsctFormData">
        </text-play-component>
        <source-acquisition-component
            v-if="ruleForm.type === 12"
            @requestDispose="requestSourceAcquisition">
        </source-acquisition-component>
        <div class="com-table" v-if="ruleForm.type === 10">
            <el-table :data="ruleForm.data" style="width: 100%" height="100%">
                <el-table-column type="index" label="序号" width="80"/>
                <el-table-column prop="path" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column width="160" v-if="props.editStatus">
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
                <el-table-column width="80" v-if="props.editStatus">
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
</template>

<script lang="ts" setup>
import soundSourceComponent from '../components/sound-source-component.vue'
import musicPlayComponent from '../components/music-play-component.vue'
import remotePlayComponent from '../components/remote-play-component.vue'
import textPlayComponent from '../components/text-play-component.vue'
import sourceAcquisitionComponent from '../components/source-acquisition-component.vue'
import { UploadProps } from 'element-plus'
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
watch(()=> props.selectTaskData, (newVal: any)=> {
    handleSelectionData(newVal)
}, {
    deep: true
})
const uploadRef = ref()
const iconAdd = ref()
const fileList = ref([]) //选中的文件
const responseMedia = ref([])
const responseeMediaGroups = ref([])
const soundSourceForm = ref({})
const musicPlayForm = ref({})
const remotePlayForm = ref({})
const sourAcquisiFrom = ref({})
const tsctFormData = ref({})
const taskDataDetailed = ref({})

watch(taskDataDetailed, (newVal: any)=> {
    ruleForm.type = newVal.type
    if (newVal.type === 1) {
        ruleForm.data = [...newVal.medias, ...newVal.medias_groups]
    }
    if (newVal.type === 10) {
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

// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
    soundSourceForm.value = data
    ruleForm.fast_sound_id = data.id
    delete soundSourceForm.value.id
}
// 选择的音乐播放配置
const requestDispose = (data: any) => {
    musicPlayForm.value = data
}
// 选择的远程播放表单配置
const requestRemotePlay = (data: any) => {
    remotePlayForm.value = data
}
// 选择音源采集配置
const requestSourceAcquisition = (data: any) => {
    sourAcquisiFrom.value = data
}
// 触发编辑
const handleEditButton = () => {
    if (ruleForm.type === 10) {
        iconAdd.value.click()
    }
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
// 获取选中音频数据
// 获取选中任务详情信息
const handleSelectionData = (row: any) => {
    if (row.type < 10) {
        global.$http.get('/broadcasting/' + row.id, {
            params: {
                withMedias: true,
                withGroups: true,
                withFastSound: true,
                withFastTerminal: true
            }
        }).then((restlu: any)=> {
            taskDataDetailed.value = restlu.data
        })
    }else {
        global.$http1.get('/task/' + row.id).then((restlu: any)=> {
            taskDataDetailed.value = restlu.data
        })
    }
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
    .com-play-config-component {
        width: 100%;
        padding: 10px;
        .el-input {
            width: 214px;
        }
        .fast-sound-source {
            position: relative;
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
</style>