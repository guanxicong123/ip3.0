<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-09
  @FilePath: src\components\quick-terminal-dialog.vue
  @Describe: 快捷终端选择弹框
-->
<template>
    <div class="com-quick-terminal-dialog">
        <el-dialog class="com-default-dialog" v-model="props.dialogVisible" width="800px" :close-on-click-modal="false"
            :close-on-press-escape="false" :before-close="handleClose">
            <template #header="{ close, titleId, titleClass }">
                <div class="com-dialog-header">
                    <span :id="titleId" :class="titleClass">快捷终端</span>
                </div>
            </template>
            <div class="com-dialog-components">
                <select-shortcut-terminal-radio
                    :responseConfigure="props.seleQuickTerminal"
                    @requestConfigure="handleRequestTerminals"
                />
            </div>
            <template #footer>
                <div class="com-dialog-footer">
                    <el-button type="primary" @click="submit"> 保存 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props = defineProps(["dialogVisible", "seleQuickTerminal"]);
const emit = defineEmits(["update:dialogVisible", "handleSelectedConfigure"]);

const selectConfigure: any = ref({}); //用于接收选中配置

const handleClose = () => {
    emit("update:dialogVisible", false);
};
// 处理选择终端/分组组件的数据
const handleRequestTerminals = (data: any) => {
    selectConfigure.value = data;
};
// 保存
const submit = () => {
    emit("update:dialogVisible", false);
    emit("handleSelectedConfigure", selectConfigure.value);
};
// mounted 实例挂载完成后被调用
onMounted(() => { });
</script>

<style lang="scss">
.com-dialog-components {
    height: 380px;
}
</style>
