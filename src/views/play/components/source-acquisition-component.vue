<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-30
  @FilePath: src\views\play\components\source-acquisition-component.vue
  @Describe: 音源采集组件
-->
<template>
    <div class="com-source-acquisition-component">
        <select-sound-source-collection-radio
            :responseSoundSource="responseSoundSource"
            @requestSoundSource="requestAcquisitionTerminal"
            @requestType="requestType">
        </select-sound-source-collection-radio>
        <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
            <el-row :gutter="80">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-form-item label="采集音质">
                        <el-select v-model="ruleForm.audioQuality">
                            <el-option
                                v-for="item in audioQualityOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-show="ruleForm.type === 1">
                    <el-form-item label="录音开关">
                        <el-switch v-model="ruleForm.record" />
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-show="ruleForm.type === 1 && ruleForm.record">
                    <el-form-item label="录音路径">
                        <div class="recording-evt">
                            <div @click="handleSelectedfolder" class="recording-evt-select">浏览</div>
                            <p class="recording-evt-path" :title="ruleForm.recordpath">{{ruleForm.recordpath}}</p>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 选择文件夹路径 -->
        <el-dialog
            v-model="folderDialogVisible"
            width="800px"
            destroy-on-close
            draggable
            append-to-body
            :show-close="false"
            @close="folderDialogVisible = false"
        >
            <template #header="{ close, titleId, titleClass }">
                <div class="com-dialog-header">
                    <span :id="titleId" :class="titleClass">选择文件夹</span>
                    <span class="dialog-icon">
                        <el-icon @click="close"><Close /></el-icon>
                    </span>
                </div>
                </template>
                <select-folder @selectedPath="handleSelectedPath" />
                <template #footer>
                <div class="com-dialog-footer">
                    <el-button plain @click="folderDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    // defineAsyncComponent 异步组件-懒加载子组件
    const selectFolder = defineAsyncComponent(() => import("./select_folder.vue"))

    const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

    const props: any = defineProps({
        fileList: Array,
        selectTaskData: Object
    })
    const emit = defineEmits([
        'update:musicSelect',
        'requestDispose'
    ])

    watch(()=> props.selectTaskData, (newVal)=> {
        console.log(newVal)
    })

    const responseSoundSource: any = ref({})
    const folderDialogVisible = ref(false)
    const ruleForm = reactive({
        type: 1, //1:声卡、2：采集终端
        audioQuality: 1, //采集音质
        selectVal: '', //终端ID
        record: false, //是否录音
        recordpath: '', //录音文件存放地址
    })
    const audioQualityOptions = [
        { label: '初级', value: 1 },
        { label: '中级', value: 2 },
        { label: '高级', value: 3 },
    ]
    const selectPath = ref('')

    watch(ruleForm, ()=> {
        emit('requestDispose', ruleForm)
    })

    // 选择文本路径
    const handleSelectedfolder = () => {
        folderDialogVisible.value = true
    }
    // 选中的采集终端/声卡
    const requestAcquisitionTerminal = (data: any) => {
        ruleForm.selectVal = data
    }
    // 选中的音源类型
    const requestType = (data: any) => {
        ruleForm.type = data
    }
    const handleSelectedPath = (data: any) => {
        selectPath.value = data
    }
    const handleConfirm = () => {
        if (selectPath.value === '') return global.$message.warning('请选择路径')
        ruleForm.recordpath = selectPath.value
        folderDialogVisible.value = false
    }
    // 获取所有终端(采集终端)
    const getTerminalsAll = () => {
        global.$http.get('/terminals/all', {
            params: {
                terminals_type: 3
            }
        }).then((result: { result: number; data: any[]; }) => {
            if (result.result === 200) {
                let data = result.data.filter((item: any)=> {
                    return item.id === props.selectTaskData.content.terminalID
                })
                if (data.length > 0) {
                    responseSoundSource.value = data[0]
                }
                console.log(data)
            }
        })
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(props.selectTaskData)
        if (props.selectTaskData.hasOwnProperty('type')) {
            ruleForm.type = props.selectTaskData.type === 12 ? 1 : 2
            ruleForm.audioQuality = props.selectTaskData.content.audioQuality
            if (props.selectTaskData.content.hasOwnProperty('terminalID')) {
                getTerminalsAll()
            }
        }
    })

</script>

<style lang="scss" scoped>
    .com-source-acquisition-component {
        .play-task-form-inline {
            margin-top: 10px;
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
                flex: 1;
                padding: 0 10px;
                margin-left: 14px;
                border: 1px solid #DDDDDD;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
</style>