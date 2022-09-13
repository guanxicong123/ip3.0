<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-16
  @FilePath: src\views\play\components\sound-source-component.vue
  @Describe: 快捷音源组件
-->
<template>
    <div class="com-sound-source-component">
        <el-form :model="ruleForm" :label-position="props.labelPosition" class="play-task-form-inline com-sound-source-component">
            <el-row :gutter="80">
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl"
                >
                    <el-form-item label="快捷音源">
                        <div class="fast-sound-source">
                            <el-input v-model="seleQuickMusic.name" disabled/>
                            <span class="iconfont icon-select-file" @click="isShow = true"></span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl" v-if="!isMusicPlay"
                >
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
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl" v-if="isMusicPlay"
                >
                    <el-form-item label="播放模式">
                        <el-select v-model="ruleForm.play_model">
                            <el-option
                                v-for="item in playmodelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl" v-if="isMusicPlay && ruleForm.play_model === 0"
                >
                    <el-form-item label="持续时间">
                        {{ formatSecondNo(duration) }}
                    </el-form-item>
                </el-col>
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl" v-if="isMusicPlay && ruleForm.play_model !== 0"
                >
                    <el-form-item>
                        <el-radio v-model="ruleForm.radioVal" :label="1" style="height: 22px; margin-bottom: 8px;">持续时间</el-radio>
                        <el-time-picker
                            v-model="ruleForm.life_time"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :disabled="ruleForm.radioVal !== 1"/>
                    </el-form-item>
                </el-col>
                <el-col
                    :xs="props.adaption.xs" :sm="props.adaption.sm"
                    :md="props.adaption.md" :lg="props.adaption.lg"
                    :xl="props.adaption.xl" v-if="isMusicPlay && ruleForm.play_model !== 0"
                >
                    <el-form-item>
                        <el-radio v-model="ruleForm.radioVal" :label="2" style="height: 22px; margin-bottom: 8px;">播放曲目</el-radio>
                        <el-input v-model="ruleForm.play_number" :disabled="ruleForm.radioVal !== 2"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <quick-music-dialog
            v-model:isShow="isShow"
            @handleSelectedConfigure="handleSelectedConfigure"
            :seleQuickMusic="seleQuickMusic"
        />
  </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        selectTaskData: Object,
        labelPosition: {
            type: String,
            default: 'top'
        },
        adaption: {
            type: Object,
            default: {
                xs: 12,
                sm: 8,
                md: 8,
                lg: 8,
                xl: 6
            }
        }
    })
    const emit = defineEmits([
        'requestSoundSource' // 更新传递已选择的快捷音源，用于父组件进行数据交互
    ])
    const ruleForm = reactive({
        id: -1, //快捷音源配置id
        type: 0, //选择的快捷音源类型
        sound_quality: 1, //采集音质
        play_model: 0, //播放模式
        life_time: '00:00:00', //持续时间
        play_number: 1, //播放曲目
        radioVal: 1,
    })
    const audioQualityOptions = [
        { label: '初级', value: 1 },
        { label: '中级', value: 2 },
        { label: '高级', value: 3 },
    ]
    const playmodelOptions = [
        { label: '列表播放', value: 0 },
        { label: '循环播放', value: 1 },
        { label: '随机播放', value: 2 }
    ]
    const duration = ref(0) //持续时间
    const isShow = ref(false)
    const seleQuickMusic: any = ref({
        id: -1,
        name: '',
    }) //选中的快捷音源
    const isMusicPlay = computed(()=> {
        return seleQuickMusic.value.type === 1
    })
    watch(()=> props.selectTaskData, (newVal: any)=> {
        console.log(newVal)
        Object.assign(ruleForm, newVal.sound_source, {
            id: newVal.sound_source
        })
        seleQuickMusic.value = newVal.fast_sound
    })
    watch(seleQuickMusic, (newVal)=> {
        ruleForm.id = newVal.id
    })
    watch(ruleForm, (newVal)=> {
        let data: any = {
            id: newVal.id,
            type: newVal.type,
            sound_quality: newVal.sound_quality,
            play_model: newVal.play_model
        }
        if (newVal.play_model !== 0 && ruleForm.radioVal !== 1) {
            data['play_number'] = newVal.play_number
        }else {
            data['life_time'] = newVal.life_time
        }
        emit('requestSoundSource', data)
    })
    // 处理选中配置
    const handleSelectedConfigure = (item: any) => {
        if (item.type === 1 && item.all_data.length > 0) {
            duration.value = 0
            item.all_data.forEach((item: string | any[])=> {
                duration.value += Number(item.length)
            })
            ruleForm.life_time = formatSecondNo(duration.value)
        }
        ruleForm.type = item.type
        seleQuickMusic.value = item
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

<style lang="scss" scoped>
    .com-sound-source-component {
        .el-input.is-disabled{
            .el-input__inner {
                color: #333;
            }
        }
    }
</style>