<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-19
  @FilePath: src\views\play\dialogComponents\select-source-acquisition-dialog.vue
  @Describe: 
-->
<template>
    <el-dialog
        v-model="props.dialogVisible"
        custom-class="select-source-acquisition-dialog"
        title="请选择音源"
        width="70%"
        :before-close="handleClose"
    >
        <select-sound-source-collection-radio
            :responseSoundSource="responseSoundSource"
            @requestSoundSource="requestAcquisitionTerminal">
        </select-sound-source-collection-radio>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
const selectFolder = defineAsyncComponent(() => import("../components/select_folder.vue"))

const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

const props: any = defineProps({
    dialogVisible: Boolean,
    type: Number,
    data: Object
})
const emit = defineEmits([
    'update:dialogVisible',
    'requestSoundSource'
])

const responseSoundSource = ref('')
const selectSoundSource: any = ref()
// 选中的采集终端/声卡
const requestAcquisitionTerminal = (data: any) => {
    selectSoundSource.value = data
}
const handleClose = () => {
    emit('update:dialogVisible', false)
}
const handleSubmit = () => {
    emit('requestSoundSource', selectSoundSource.value)
    emit('update:dialogVisible', false)
}
// 获取所有终端(采集终端)
const getTerminalsAll = () => {
    global.$http.get('/terminals/all', {
        params: {
            terminals_type: 3
        }
    }).then((result: { result: number; data: any[]; }) => {
        if (result.result === 200) {
            responseSoundSource.value = result.data.filter(item=> {
                return item.id === props.data.terminalID
            })[0]
        }
    })
}
// mounted 实例挂载完成后被调用
onMounted(() => {
    if (props.data.soundcard) {
        responseSoundSource.value = props.data.soundcard
    }else {
        getTerminalsAll()
    }
})

</script>

<style lang="scss" scoped>
    
</style>