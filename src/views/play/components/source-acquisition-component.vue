<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-30
  @FilePath: src\views\play\components\source-acquisition-component.vue
  @Describe: 音乐播放组件（选择本地音频）
-->
<template>
    <div class="com-source-acquisition-component">
        <select-sound-source-collection-radio
            @requestSoundSource="requestAcquisitionTerminal"
            @requestType="requestType">
        </select-sound-source-collection-radio>
        <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
            <el-row :gutter="80">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-form-item label="采集音质">
                        <el-select v-model="ruleForm.sound_quality">
                            <el-option
                                v-for="item in audioQualityOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model !== 0">
                    <el-form-item>
                        <el-radio v-model="ruleForm.radioVal" :label="2" style="height: 22px; margin-bottom: 8px;">播放曲目</el-radio>
                        <el-input v-model="ruleForm.play_number" :disabled="ruleForm.radioVal !== 2"/>
                    </el-form-item>
                </el-col> -->
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
    import { ElTable } from 'element-plus';

    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    const props = defineProps({
        fileList: Array
    })
    const emit = defineEmits([
        'update:musicSelect',
        'requestDispose'
    ])
    const ruleForm = reactive({
        play_model: 0, //播放模式
        life_time: '00:00:00', //持续时间
        play_number: 1, //播放曲目
        radioVal: 1,
        sound_quality: 1, //采集音质
    })
    
    const data = reactive({
        tableData: []
    })
    const audioQualityOptions = [
        { label: '初级', value: 1 },
        { label: '中级', value: 2 },
        { label: '高级', value: 3 },
    ]
    const tableData = computed(()=> {
        return props.fileList
    })

    // 采集终端
    const requestAcquisitionTerminal = (data: any) => {

    }
    // 选中的声卡
    const requestType = (data: any) => {

    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
    })

</script>

<style lang="scss" scoped>
    .com-music-play-component {
        // max-height: 260px;
        // overflow: hidden;
    }
</style>