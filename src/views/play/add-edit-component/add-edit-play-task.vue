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
                                    <el-input v-model="ruleForm.taskname" clearable/>
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
                             <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.type === 2">
                                <el-form-item label="播放模式">
                                    <el-select v-model="ruleForm.playmodel">
                                        <el-option
                                            v-for="item in playmodelOptions"
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
                    <div class="play-task-configure-music" v-if="ruleForm.type === 2">
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
                        v-if="ruleForm.type === 1"
                        v-model:ruleForm="ruleForm">
                    </sound-source-component>
                    <music-play-component
                        v-if="ruleForm.type === 2"
                        v-model:fileList="fileList"
                        v-model:musicSelect="musicSelect">
                    </music-play-component>
                    <select-media-group v-if="ruleForm.type === 5">
                    </select-media-group>
                    <text-play-component v-if="ruleForm.type === 4">
                    </text-play-component>
                    <select-sound-source-collection-radio v-if="ruleForm.type === 3">
                    </select-sound-source-collection-radio>
                </div>
            </div>
            <div class="play-task-region configure-level">
                <div class="from-alert">
                    <span>执行区域</span>
                </div>
                <div class="play-task-region-content configure-level-content">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane label="快捷终端" name="first">
                            <el-row :gutter="80">
                                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                    <p class="selection-title">快捷终端</p>
                                    <div class="quick-terminal-selection">
                                        <el-input v-model="ruleForm.taskname" disabled/>
                                        <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="终端选择" name="second">
                            <terminals-select-components>
                            </terminals-select-components>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-scrollbar>
        <div class="add-edit-bottom-button">
            <div class="button button-cancel">返回</div>
            <div class="button button-submit">保存</div>
            <div class="button button-submit">保存并播放</div>
        </div>
        <quick-terminal-dialog v-model:dialogVisible="dialogVisible">
        </quick-terminal-dialog>
    </div>
</template>

<script lang="ts" setup>
    import type { TabsPaneContext, UploadInstance, UploadUserFile, UploadProps } from 'element-plus'
    import soundSourceComponent from '../components/sound-source-component.vue'
    import musicPlayComponent from '../components/music-play-component.vue'
    import textPlayComponent from '../components/text-play-component.vue'
    import selectMediaGroup from '@/components/select_media_group.vue'
    import quickTerminalDialog from '@/components/quick-terminal-dialog.vue'

    const uploadRef = ref<UploadInstance>()
    const fileList = ref<UploadUserFile[]>()
    const activeName = ref('first')
    const musicSelect = ref([]) //播放配置选中的音频文件
    const ruleForm = reactive({
        type: 1,
        taskname: '',
        volume: '',
        priority: '',
        playmodel: 1,
        AudioQuality: 0
    })
    const dialogVisible = ref(false)
    const typeOptions = [
        { label: '快捷音源', value: 1 },
        { label: '音乐播放', value: 2 },
        { label: '音源采集', value: 3 },
        { label: '文本播放', value: 4 },
        { label: '远程播放', value: 5 }
    ]
    const playmodelOptions = [
        { label: '顺序播放', value: 1 },
        { label: '列表循环', value: 2 },
        { label: '随机播放', value: 3 },
    ]

    const handleClick = (tab: TabsPaneContext, event: Event) => {

    }
    // 获取所有终端
    const getTerminalsAll = () => {
        
    }
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
        console.log(uploadFile, fileList.value)
    }
    // 获取文件时长
    const getTimes = (file: any) => {
        var content = file.raw
        //获取录音时长
        var url = URL.createObjectURL(content);
            //经测试，发现audio也可获取视频的时长
        var audioElement = new Audio(url);

        let duration = audioElement.addEventListener("loadedmetadata", () => {
            let data = audioElement.duration;
            file['time'] = formatSecondNo(data)
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