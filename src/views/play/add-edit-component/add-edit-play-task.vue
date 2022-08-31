<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-03
  @FilePath: src\views\play\add-edit-component\add-edit-play-task.vue
  @Describe: 新建/编辑播放任务
-->
<template>
    <div class="com-add-edit-play-task">
        <el-scrollbar>
            <div class="play-task-basics configure-level">
                <div class="from-alert">
                    <span>基础配置</span>
                </div>
                <div class="play-task-basics-content configure-level-content">
                    <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
                        <el-row :gutter="80">
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务名称">
                                    <el-input v-model="ruleForm.name" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务音量">
                                    <el-input v-model.number="ruleForm.volume" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="优先级">
                                    <el-input v-model.number="ruleForm.priority" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="音源类型">
                                    <el-select v-model="ruleForm.type">
                                        <el-option
                                            v-for="item in typeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="play-task-configure configure-level">
                <div class="from-alert">
                    <span>播放配置</span>
                    <div class="play-task-configure-music" v-if="ruleForm.type === 10">
                        <span class="iconfont icon-delete" @click="deteleSelectMusic"></span>
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
                                <span class="iconfont icon-add"></span>
                            </template>
                        </el-upload>
                    </div>
                </div>
                <div class="play-task-configure-content configure-level-content">
                    <sound-source-component
                        v-if="ruleForm.type === 4"
                        v-model:ruleForm="ruleForm"
                        @requestSoundSource="requestSoundSource">
                    </sound-source-component>
                    <music-play-component
                        v-if="ruleForm.type === 10"
                        v-model:fileList="ruleForm.content"
                        v-model:musicSelect="musicSelect"
                        @requestDispose="requestDispose">
                    </music-play-component>
                    <remote-play-component
                        v-if="ruleForm.type === 1"
                        v-model:medias="ruleForm.medias"
                        v-model:medias_groups="ruleForm.medias_groups"
                        :responseMedia="responseMedia"
                        :responseGroups="responseeMediaGroups"
                        @requestDispose="requestRemotePlay">
                    </remote-play-component>
                    <text-play-component
                        v-if="ruleForm.type === 11"
                        v-model:tsctFormData="tsctFormData">
                    </text-play-component>
                    <source-acquisition-component
                        v-if="ruleForm.type === 12">
                    </source-acquisition-component>
                    <!-- <select-sound-source-collection-radio
                        v-if="ruleForm.type === 12"
                        @requestSoundSource="requestAcquisitionTerminal"
                        @requestType="requestType">
                    </select-sound-source-collection-radio> -->
                </div>
            </div>
            <div class="play-task-region configure-level">
                <div class="from-alert">
                    <span>执行区域</span>
                </div>
                <div class="play-task-region-content configure-level-content">
                    <el-tabs v-model="executionregiontype" class="demo-tabs">
                        <el-tab-pane label="快捷终端" :name="0">
                            <el-row :gutter="80">
                                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                    <p class="selection-title">快捷终端</p>
                                    <div class="quick-terminal-selection">
                                        <el-input v-model="quickTerminaName" disabled/>
                                        <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="终端选择" :name="1">
                            <terminals-select-components
                                :responseTerminals="responseTerminals"
                                :responseGroups="responseGroups"
                                @requestTerminals="requestTerminals"
                                @requestGroups="requestGroups">
                            </terminals-select-components>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-scrollbar>
        <div class="add-edit-bottom-button">
            <div class="button button-cancel">返回</div>
            <div class="button button-submit" @click="submitTask">保存</div>
            <div class="button button-submit">保存并播放</div>
        </div>
        <quick-terminal-dialog
            v-model:dialogVisible="dialogVisible"
            @handleSelectedConfigure="handleSelectedConfigure">
        </quick-terminal-dialog>
    </div>
</template>

<script lang="ts" setup>
    import type { TabsPaneContext, UploadInstance, UploadUserFile, UploadProps } from 'element-plus'
    import soundSourceComponent from '../components/sound-source-component.vue'
    import musicPlayComponent from '../components/music-play-component.vue'
    import remotePlayComponent from '../components/remote-play-component.vue'
    import textPlayComponent from '../components/text-play-component.vue'
    import sourceAcquisitionComponent from '../components/source-acquisition-component.vue'
    import quickTerminalDialog from '@/components/quick-terminal-dialog.vue'

    const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

    const uploadRef = ref<UploadInstance>()
    const fileList = ref<UploadUserFile[]>()
    const activeName = ref('first')
    const musicSelect = ref([]) //播放配置选中的音频文件
    const ruleForm = reactive({
        type: 4, //任务类型；快捷音源&远程播放走非本地http协议；其余本地http协议。
        name: '', //任务名称
        serverIP: localStorage.get("serverIP"), //服务器IP
        userID: localStorage.get("LoginUserID"), //用户ID
        priority: '', //任务优先级
        volume: '', //任务音量
        fast_terminals_id: -1, //快捷终端id
        fast_sound_id: -1, //快捷音源id
        content: [], //音乐路径集合
        medias: [], //已选择的媒体文件
        medias_groups: [], //已选择的媒体媒体文件夹
        terminals: [], //终端id集合
        terminals_groups: [], //终端分组id集合
    })
    const executionregiontype = ref(0) //执行区域类型 0：快捷终端 1：普通终端
    const tsctFormData = ref({})
    const quickTerminaName = ref('')
    const content = ref({}) //接收不同任务类型的字段数据
    const soundSourceForm = ref({}) //快捷音源表单数据
    const musicPlayForm = ref({}) //音乐播放表单数据
    const remotePlayForm = ref({}) //远程播放表单数据
    const responseTerminals = ref([]) //已选择的终端数据
    const responseGroups = ref([])  //已选择的终端数组
    const responseMedia = ref([]) //已选择的媒体文件
    const responseeMediaGroups = ref([]) //已选择的媒体媒体文件夹
    const dialogVisible = ref(false)
    // 4 快捷音源
    // 1 远程播放
    const typeOptions = [
        { label: '快捷音源', value: 4 },
        { label: '音乐播放', value: 10 },
        { label: '远程播放', value: 1 },
        { label: '文本播放', value: 11 },
        { label: '音源采集', value: 12 }
    ]

    watch(()=> fileList.value, (newVal: any)=> {
        setTimeout(()=> {
            ruleForm.content = newVal.map((item: any)=> {
                return {
                    name: item.name,
                    path: item.raw.path,
                    time: item.time
                }
            })
        }, 300)
    })
    // 删除选中音频
    const deteleSelectMusic = () => {
        console.log(uploadRef.value)
        // fileList.value = fileList.value?.filter(item=> {
        //     return !musicSelect.value.includes(item.name)
        // })
        // musicSelect.value.forEach(item=> {
        //     uploadRef.handleRemove(item)
        // })
    }
    // 选中文件时触发
    const uploadChange: UploadProps['onChange'] = (uploadFile: any, uploadFiles) => {
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
    // 选中的快捷终端
    const handleSelectedConfigure = (data: any) => {
        ruleForm.fast_terminals_id = data.id
        quickTerminaName.value = data.name
    }
    // 选择的终端
    const requestTerminals = (data: any) => {
        ruleForm.terminals = data.map((item: { terminals_id: Number })=> {
            return item.terminals_id
        })
    }
    // 选择的终端分组
    const requestGroups = (data: any) => {
        ruleForm.terminals_groups = data.map((item: { terminals_groups_id: Number })=> {
            return item.terminals_groups_id
        })
    }
    // 提交任务
    const submitTask = () => {
        if (ruleForm.type === 10) {
            createLocalAudio()
        }else if (ruleForm.type === 11) {
            createTxstPlay()
        }else if (ruleForm.type === 1 ) {
            createRemteTask()
        }else {
            createQuickSou()
        }
    }
    // 快捷音源任务
    const createQuickSou = () => {
        global.$http.post('/broadcasting', Object.assign(ruleForm, {
            sound_source: soundSourceForm.value
        })).then((result: any) => {
            if (result)
            console.log(result)
        })
    }
    // 音乐播放任务
    const createLocalAudio = () => {
        global.$http1.post('/task', Object.assign(ruleForm, musicPlayForm.value)).then((result: any) => {
            if (result)
            console.log(result)
        })
    }
    // 远程任务
    const createRemteTask = () => {
        global.$http.post('/broadcasting', Object.assign(ruleForm, {
            sound_source: remotePlayForm.value
        })).then((result: any) => {
            if (result)
            console.log(result)
        })
    }
     // 文本播放
    const createTxstPlay = () => {
        global.$http1.post('/task', Object.assign(ruleForm, {
            content: tsctFormData.value
        })).then((result: any) => {
            if (result)
            console.log(result)
        })
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
    })

</script>

<style lang="scss">
    .com-add-edit-play-task {
        height: calc(100% - 68px);
        .from-alert {
            padding: 14px 0;
            border-bottom: 1px solid #E0E2E3;
            span {
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #6F95C1;
            }
        }
        .configure-level {
            padding: 8px 40px 20px 40px;
            .configure-level-content {
                padding-top: 22px;
            }
            .el-tabs__nav-wrap::after {
                height: 0;
            }
            .selection-title {
                padding: 8px 0;
                color: #666666;
            }
            .quick-terminal-selection {
                position: relative;
                .el-input {
                    width: 100%;
                }
                .el-input.is-disabled .el-input__wrapper {
                    background-color: #fff;
                }
                .iconfont {
                    position: absolute;
                    right: -20px;
                    color: #0070EE;
                    line-height: 32px;
                    cursor: pointer;
                }
    
            }
        }
        .play-task-form-inline {
            overflow: hidden;
            .el-form-item {
                .el-form-item__content {
                    .el-select {
                        width: 100%;
                    }
                }
            }
            .fast-sound-source {
                width: 100%;
                position: relative;
                .el-input.is-disabled .el-input__wrapper {
                    background-color: #fff;
                }
                .iconfont {
                    position: absolute;
                    right: -20px;
                    color: #0070EE;
                    cursor: pointer;
                }
            }
        }
        .play-task-configure-music {
            float: right;
            span {
                font-size: 20px;
                color: #9CBAD4;
                margin-left: 22px;
                cursor: pointer;
                &:hover {
                    color: #0070EE;
                }
            }
            .upload-demo {
                display: inline-block;
            }
        }
        .add-edit-bottom-button {
            position: fixed;
            bottom: 0;
            left: 136px;
            width: calc(100% - 136px);
            height: 68px;
            border-top: 1px solid #E0E2E3;
            text-align: right;
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 6px 20px;
                border-radius: 4px;
                margin-right: 10px;
                color: #FFFFFF;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                cursor: pointer;
                &:last-child {
                    margin-right: 40px;
                }
            }
            .button-cancel {
                color: #7992D5;
                background-color: #E1EAFD;
            }
            .button-submit {
                background-color: #0070EE;
            }
        }
    }
</style>