<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-19
  @FilePath: src\views\play\dialogComponents\select-source-acquisition-dialog.vue
  @Describe: 
-->
<template>
  <el-dialog
    v-model="props.dialogVisible"
    class="select-source-acquisition-dialog"
    :title="$t('Please select a sound source')"
    width="70%"
    :before-close="handleClose"
  >
    <select-sound-source-collection-radio
      :responseSoundSource="responseSoundSource"
      @requestSoundSource="requestAcquisitionTerminal"
    >
    </select-sound-source-collection-radio>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t("Determine") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
  dialogVisible: Boolean,
  type: Number,
  data: Object,
});
const emit = defineEmits(["update:dialogVisible", "requestSoundSource"]);

const responseSoundSource = ref("");
const selectSoundSource: any = ref();
// 选中的采集终端/声卡
const requestAcquisitionTerminal = (data: any) => {
  selectSoundSource.value = data;
  console.log(data);
};
const handleClose = () => {
  emit("update:dialogVisible", false);
};
const handleSubmit = () => {
  emit("requestSoundSource", selectSoundSource.value);
  emit("update:dialogVisible", false);
};
// 获取所有终端(采集终端)
const getTerminalsAll = () => {
  proxy.$http
    .get("/terminals/all", {
      params: {
        terminals_type: 3,
      },
    })
    .then((result: { result: number; data: any[] }) => {
      if (result.result === 200) {
        responseSoundSource.value = result.data.filter((item) => {
          return item.id === props.data.terminalID;
        })[0];
      }
    });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  if (props.data.soundcard) {
    responseSoundSource.value = props.data.soundcard;
  } else {
    getTerminalsAll();
  }
});
</script>

<style lang="scss" scoped></style>
