<!-- 
  @Author: yangyq
  @CreateDate: 2022-09-14
  @FilePath: src\views\play\dialogComponents\select-media-dialog.vue
  @Describe: 选择媒体对话框
-->
<template>
  <el-dialog
    v-model="props.dialogVisible"
    class="select-media-dialog"
    :title="$t('Select media')"
    width="70%"
    :before-close="handleClose"
  >
    <select-media-group
      :responseMedia="props.responseMedia"
      :responseGroups="props.responseeMediaGroups"
      @requestMedia="requestMedia"
      @requestGroups="requestMediaGroups"
    >
    </select-media-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t("Determine") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import selectMediaGroup from "@/components/select_media_group.vue";

const props = defineProps({
  dialogVisible: Boolean,
  responseMedia: Array,
  responseeMediaGroups: Array,
});
const emit = defineEmits(["update:dialogVisible", "uploadMedia"]);

const medias = ref([]);
const medias_groups = ref([]);

// 选择的媒体文件
const requestMedia = (data: any) => {
  medias.value = data;
};
// 选择的媒体文件夹
const requestMediaGroups = (data: any) => {
  medias_groups.value = data;
};
const handleClose = () => {
  emit("update:dialogVisible", false);
};
const handleSubmit = () => {
  emit("uploadMedia", {
    medias: medias.value,
    medias_groups: medias_groups.value,
  });
};
// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
