<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-22
  @FilePath: src\views\play\components\text-playback-component.vue
  @Describe: 文本播放组件
-->
<template>
    <div class="com-text-playback-component">
        <div class="com-text-playback-tabs">
            <el-form label-position="top">
                <el-row :gutter="80">
                    <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80">
                        <el-form-item label="文本类型">
                            <el-radio-group v-model="textType">
                                <el-radio :label="0">文件</el-radio>
                                <el-radio :label="1">内容</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="80" :md="80" :lg="80" :xl="80" v-show="textType === 0">
                        <el-form-item label="文本路径">
                             <el-upload
                                ref="uploadRef"
                                class="upload-demo"
                                accept=".txt"
                                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="uploadChange"
                            >
                                <template #trigger>
                                    <el-button type="primary">浏览</el-button>
                                </template>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80" v-show="textType === 1">
                        <el-form-item label="文本内容">
                            <el-input
                                v-model="ruleForm.textarea"
                                :rows="5"
                                type="textarea"
                                placeholder="请输入内容（不超过1000字）"
                                show-word-limit
                                maxlength="1000"
                            />
                        </el-form-item>
                    </el-col>
                     <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80" v-show="textType === 1">
                        <el-form-item>
                            <el-checkbox v-model="ruleForm.checked1" label="开启播放功能(未启用时，终端默认静音)"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-show="textType === 1">
                        <el-form-item label="显示属性">
                           <el-select v-model="ruleForm.EngineIndex">
                                <el-option
                                    label="无"
                                    :value="0"
                                />
                                <el-option
                                    v-for="item in dispProperOption"
                                    :key="item.EngineIndex"
                                    :label="item.EngineName"
                                    :value="item.EngineIndex"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                        <el-form-item label="播放语音">
                           <el-select v-model="ruleForm.EngineIndex">
                                <el-option
                                    v-for="item in playVoiceOptions"
                                    :key="item.EngineIndex"
                                    :label="item.EngineName"
                                    :value="item.EngineIndex"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                        <el-form-item label="播放语速">
                            <el-select v-model="ruleForm.play_speed" class="custom-el-select">
                                <el-option
                                    v-for="item in playSpeedOption"
                                    :key="item"
                                    :label="formatterSpeed(item)"
                                    :value="item"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                        <el-form-item label="播报次数">
                             <el-input-number
                                v-model="ruleForm.num"
                                :min="1"
                                controls-position="right"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { send } from '@/utils/socket'
    const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()
    import type { TabsPaneContext, UploadInstance, UploadUserFile, UploadProps } from 'element-plus'

    const ruleForm: any = reactive({
        playmodel: 1,
        num: 1,
        EngineIndex: 0,
        play_speed: 5, // 播放语速
        textarea: '',
        checked1: false,
    })
    const textType = ref(0)
    const playVoiceOptions = [
        {
            EngineIndex: 0,
            EngineName: "Microsoft Huihui Desktop - Chinese (Simplified)"
        }
    ]
    // 显示属性
    const dispProperOption = ref<any[]>([])
    // 播放语速
    const playSpeedOption = ref<any[]>([])
    const uploadRef = ref<UploadInstance>()

    // 选中文件时触发
    const uploadChange: UploadProps['onChange'] = (uploadFile: any, uploadFiles) => {
        // getTimes(uploadFile)
    }
    // 格式化显示播放语速
    const formatterSpeed = (row: number) => {
        switch (row) {
            case 1:
            return row + " ( 最快 )";
            case 5:
            return row + " ( 推荐 )";
            case 8:
            return row + " ( 最慢 )";
            default:
            return row;
        }
    };
    const getTtsEngine  = () => {
        let data = {
            company: "BL",
            actioncode: "c2ms_get_tts_engine_info",
            data: {},
            result: 0,
            return_message: ""
        }
        send(data)
    }
    const getLedDisplay = () => {
        global.$http.get('/led-display-cfg/all').then((result: any)=> {
            if (result.result === 200) {
                console.log(result)
                dispProperOption.value = result.data
            }
        })
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        getTtsEngine()
        getLedDisplay()
        for (let i = 1; i < 9; i++) {
            playSpeedOption.value.push(i);
        }
    })

</script>

<style lang="scss" scoped>
    .com-text-playback-component {
        .el-select {
            width: 100%;
        }
        .el-input-number {
            width: 100%;
        }
    }
</style>