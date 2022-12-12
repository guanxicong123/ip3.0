<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-20
  @FilePath: src\views\play\components\acquisition-device-component.vue
  @Describe: 采集设备
-->
<template>
    <div class="com-acquisition-device-component">
        <el-form :model="ruleForm" class="play-task-form-inline com-sound-source-component">
            <el-form-item label="选择音源">
                <div class="fast-sound-source">
                    <el-input v-model="acquisitionTerminalName" disabled />
                    <span class="iconfont icon-select-file" @click="handleShowDialog" v-if="props.isEdit"></span>
                </div>
            </el-form-item>
            <el-form-item label="采集音质">
                <el-select v-model="ruleForm.audioQuality" :disabled="!props.isEdit">
                    <el-option v-for="item in audioQualityOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="录音开关" v-if="ruleForm.type === 12">
                <el-switch v-model="ruleForm.record" :disabled="!props.isEdit" />
            </el-form-item>
            <el-form-item label="录音路径" v-if="ruleForm.record && ruleForm.type === 12">
                <div class="recording-evt">
                    <div @click="handleSelectedfolder" class="recording-evt-select">浏览</div>
                    <p class="recording-evt-path" :title="ruleForm.recordpath">
                        {{ ruleForm.recordpath }}
                    </p>
                </div>
            </el-form-item>
        </el-form>
        <!-- 选择音源采集设备 -->
        <select-source-acquisition-dialog v-if="sourceAcquisitionDialog" v-model:dialogVisible="sourceAcquisitionDialog"
            :type="ruleForm.type" :data="ruleForm.data" @requestSoundSource="requestSourceAcquisition">
        </select-source-acquisition-dialog>
        <!-- 选择文件夹路径 -->
        <el-dialog v-model="folderDialogVisible" width="800px" destroy-on-close draggable class="com-default-dialog">
            <template #header="{ titleId, titleClass }">
                <div class="com-dialog-header">
                    <span :id="titleId" :class="titleClass">选择文件夹</span>
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
const selectFolder = defineAsyncComponent(() => import("./select_folder.vue"));
const selectSourceAcquisitionDialog = defineAsyncComponent(
    () => import("../dialogComponents/select-source-acquisition-dialog.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
    },
    selectTaskData: Object,
});
const emit = defineEmits(["update:sourAcquisiFrom"]);

const sourceAcquisitionDialog = ref(false); //音源采集对话框
const folderDialogVisible = ref(false); // 选择文件存放路径对话框
const acquisitionTerminalName = ref("");
const selectPath = ref(""); //临时记录录音路径
const ruleForm: any = reactive({
    type: 12,
    data: [],
    recordpath: "",
    record: false,
    audioQuality: 1,
    terminalID: 0,
});
const audioQualityOptions = [
    { label: "初级", value: 1 },
    { label: "中级", value: 2 },
    { label: "高级", value: 3 },
];

watch(
    () => props.selectTaskData,
    (newVal) => {
        console.log(props.selectTaskData)
        ruleForm.type = newVal.type;
        ruleForm.data = newVal.content;
        ruleForm.audioQuality = newVal.content.audioQuality;
        if (ruleForm.type === 12) {
            ruleForm.recordpath = newVal.content.recordpath;
            ruleForm.record = newVal.content.record;
            acquisitionTerminalName.value = newVal.content.soundcard;
        } else {
            ruleForm.terminalID = newVal.content.terminalID;
            getTerminalsAll(newVal.content.terminalID);
        }
    }
);
watch(ruleForm, (newVal) => {
    let data = {
        type: newVal.type,
        recordpath: newVal.recordpath,
        record: newVal.record,
        audioQuality: newVal.audioQuality,
        terminalID: newVal.terminalID,
    };
    emit("update:sourAcquisiFrom", data);
});
// 选择音源采集配置
const requestSourceAcquisition = (data: any) => {
    const isHasID = Object.prototype.hasOwnProperty.call(data, "id");
    ruleForm.type = isHasID ? 13 : 12;
    if (isHasID) {
        ruleForm.terminalID = data.id;
        getTerminalsAll(data.id);
    } else {
        acquisitionTerminalName.value = data;
    }
};
// 选择采集设备
const handleShowDialog = () => {
    if (!props.isEdit) return;
    sourceAcquisitionDialog.value = true;
};
const handleSelectedPath = (data: any) => {
    selectPath.value = data;
};
const handleSelectedfolder = () => {
    if (!props.isEdit) return;
    folderDialogVisible.value = true;
};
const handleConfirm = () => {
    if (selectPath.value === "") return proxy.$message.warning("请选择路径");
    ruleForm.data.recordpath = selectPath.value;
    folderDialogVisible.value = false;
};
const getTerminalsAll = (TerminalsId: number) => {
    proxy.$http
        .get("/terminals/all", {
            params: {
                terminals_type: 3,
            },
        })
        .then((result: { result: number; data: any[] }) => {
            if (result.result === 200) {
                result.data.forEach((item) => {
                    if (TerminalsId === item.id) {
                        acquisitionTerminalName.value = item.name;
                    }
                });
            }
        });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
    ruleForm.type = props.selectTaskData.type;
    ruleForm.data = props.selectTaskData.content;
    ruleForm.audioQuality = props.selectTaskData.content.audioQuality;
    if (ruleForm.type === 12) {
        ruleForm.recordpath = props.selectTaskData.content.recordpath;
        ruleForm.record = props.selectTaskData.content.record;
        acquisitionTerminalName.value = props.selectTaskData.content.soundcard;
    } else {
        ruleForm.terminalID = props.selectTaskData.content.terminalID;
        getTerminalsAll(props.selectTaskData.content.terminalID);
    }
});
</script>

<style lang="scss" scoped>

</style>
