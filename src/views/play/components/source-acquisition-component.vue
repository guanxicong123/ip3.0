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
      @requestType="requestType"
    >
    </select-sound-source-collection-radio>
    <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
      <el-row :gutter="80">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
          <el-form-item :label="$t('Acquisition sound quality')">
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
          <el-form-item :label="$t('Recording switch')">
            <el-switch v-model="ruleForm.record" />
          </el-form-item>
        </el-col>
        <el-col
          :xs="12"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="6"
          v-show="ruleForm.type === 1 && ruleForm.record"
        >
          <el-form-item :label="$t('Recording path')" class="record-path">
            <div class="recording-evt">
              <div @click="handleSelectedfolder" class="recording-evt-select">
                {{ $t("Browse") }}
              </div>
              <p class="recording-evt-path" :title="ruleForm.recordpath">
                {{ ruleForm.recordpath }}
              </p>
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
      class="com-default-dialog"
    >
      <template #header="{ titleId, titleClass }">
        <div class="com-dialog-header">
          <span :id="titleId" :class="titleClass">{{ $t("Select folder") }}</span>
        </div>
      </template>
      <select-folder @selectedPath="handleSelectedPath" />
      <template #footer>
        <div class="com-dialog-footer">
          <el-button plain @click="folderDialogVisible = false">
            {{ $t("Cancel") }}
          </el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t("Confirm") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// defineAsyncComponent 异步组件-懒加载子组件
const selectFolder = defineAsyncComponent(() => import("./select_folder.vue"));

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
  fileList: Array,
  selectTaskData: Object,
});
const emit = defineEmits(["update:musicSelect", "requestDispose"]);

const responseSoundSource: any = ref({});
const folderDialogVisible = ref(false);
const ruleForm = reactive({
  type: 1, //1:声卡、2：采集终端
  audioQuality: 1, //采集音质
  selectVal: "", //终端ID
  record: false, //是否录音
  recordpath: "", //录音文件存放地址
});
const audioQualityOptions = useFormatMap.qualityOption;
const selectPath = ref("");

watch(ruleForm, () => {
  emit("requestDispose", ruleForm);
});

// 选择文本路径
const handleSelectedfolder = () => {
  folderDialogVisible.value = true;
};
// 选中的采集终端/声卡
const requestAcquisitionTerminal = (data: any) => {
  ruleForm.selectVal = data;
};
// 选中的音源类型
const requestType = (type: any) => {
  ruleForm.type = type;
};
const handleSelectedPath = (data: any) => {
  selectPath.value = data;
};
const handleConfirm = () => {
  if (selectPath.value === "")
    return proxy.$message({
      type:'warning',
      message:proxy.$t("Please select a path"),
      grouping:true
    });
  ruleForm.recordpath = selectPath.value;
  folderDialogVisible.value = false;
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  if (Object.prototype.hasOwnProperty.call(props.selectTaskData, "type")) {
    ruleForm.type = props.selectTaskData.type === 12 ? 1 : 2;
    ruleForm.audioQuality = props.selectTaskData.content.audioQuality;
    if (
      Object.prototype.hasOwnProperty.call(props.selectTaskData?.content, "terminalID")
    ) {
      responseSoundSource.value = {
        id: props.selectTaskData.content.terminalID,
      };
    } else {
      responseSoundSource.value = props.selectTaskData.content?.soundcard;
    }
  }
});
</script>

<style lang="scss" scoped>
.com-source-acquisition-component {
  .record-path {
    :deep(.el-form-item__content) {
      display: block;
    }
  }
  .play-task-form-inline {
    margin-top: 10px;
  }

  .recording-evt {
    display: flex;
    flex-direction: row;
    height: 30px;
    overflow: hidden;

    .recording-evt-select {
      font-size: 14px;
      color: #ffffff;
      padding: 0px 16px;
      background-color: #0070ee;
      border-radius: 4px;
      cursor: pointer;
    }

    .recording-evt-path {
      flex: 1;
      padding: 0 10px;
      margin-left: 14px;
      border: 1px solid #dddddd;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
