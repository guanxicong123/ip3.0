<!-- 
  @Author: hmf
  @CreateDate: 2022-08-19
  @FilePath: src\views\manage\device\child_nav\quick_terminal\new_edit_index.vue
  @Describe: 快捷音源对话框
-->
<template>
    <el-dialog
        width="700px"
        v-model="parentData.isShow"
        destroy-on-close
        @close="emit('update:isShow', false)"
        class="com-default-dialog">
        <template #header="{ close, titleId, titleClass }">
            <div class="com-dialog-header">
                <span :id="titleId" :class="titleClass">{{ form.title }}</span>
            </div>
        </template>
        <div class="com-dialog-components">
            <select-shortcut-sound-source
                @requestConfigure="handleRequestTerminals"
                :responseConfigure="parentData.seleQuickMusic"/>
        </div>
        <template #footer>
            <div class="com-dialog-footer">
                <el-button type="primary" @click="submit"> 保存 </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import selectShortcutSoundSource from "./select_shortcut_sound_source.vue";

// 声明触发事件
const emit = defineEmits(["update:isShow", "handleSelectedConfigure"]);
// 声明父组件传值
const parentData = defineProps([
    "isShow", //对话框显示隐藏
    "seleQuickMusic", //选中的快捷音源
]);

const selectConfigure: any = ref({}); //用于接收选中配置
const form = reactive({
    title: "选择快捷音源",
    dialogVisible: false,
});
// 表单ref
const ruleFormRef = ref<FormInstance>();

// 处理选择终端/分组组件的数据
const handleRequestTerminals = (data: any) => {
    console.log(data)
    selectConfigure.value = data;
};
// 保存
const submit = () => {
    emit("update:isShow", false);
    emit("handleSelectedConfigure", selectConfigure.value);
};

// mounted 实例挂载完成后被调用
onMounted(() => { });
</script>

<style lang="scss" scoped>
.com-dialog-components {
    height: 380px;
}
</style>
