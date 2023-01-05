<!-- 
  @Author: yangyq
  @CreateDate: 2022-10-12
  @FilePath: src\views\play\dialogComponents\terminals-select-dialog.vue
  @Describe: 终端选择弹框
-->
<template>
    <el-dialog v-model="props.dialogVisible" class="terminals-select-dialog" title="请选择终端" width="70%"
        :before-close="handleClose">
        <terminals-select-components :responseTerminals="responseTerminals" :responseGroups="responseGroups"
            @requestTerminals="requestTerminals" @requestGroups="requestGroups" :isTerminalGroups="true">
        </terminals-select-components>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
const props: any = defineProps({
    dialogVisible: Boolean,
    taskDataDetailed: Object,
});
const emit = defineEmits(["update:dialogVisible", "handleSelectedTerminals"]);

const terminals = ref([]);
const terminals_groups = ref([]);

const responseTerminals = ref([]); //已选择的终端数据
const responseGroups = ref([]); //已选择的终端数组

// 选择的终端
const requestTerminals = (data: any) => {
    terminals.value = data;
};
// 选择的终端分组
const requestGroups = (data: any) => {
    terminals_groups.value = data;
};

const handleSubmit = () => {
    emit("handleSelectedTerminals", {
        terminals: terminals.value,
        terminals_groups: terminals_groups.value,
    });
    emit("update:dialogVisible", false);
};

const handleClose = () => {
    emit("update:dialogVisible", false);
};

// mounted 实例挂载完成后被调用
onMounted(() => {
    responseTerminals.value = props.taskDataDetailed.terminals;
    responseGroups.value = props.taskDataDetailed.terminals_groups;
});
</script>

<style lang="scss" scoped>

</style>
