<!-- 
  @Author: hmf
  @CreateDate: 2022-08-19
  @FilePath: src\views\manage\device\child_nav\quick_terminal\new_edit_index.vue
  @Describe: 快捷音源对话框
-->
<template>
    <el-dialog
        v-model="parentData.isShow"
        width="700px" 
        destroy-on-close
        @close="emit('isShow', false)"
        custom-class="com-default-dialog"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="com-dialog-header">
                <span :id="titleId" :class="titleClass">{{ form.title }}</span>
            </div>
        </template>
        <div>
            <el-form ref="ruleFormRef" label-position="top" :model="form" status-icon scroll-to-error>
                <div class="com-dialog-components">
                    <select-shortcut-sound-source
                    @requestConfigure="handleRequestTerminals"/>
                </div>
            </el-form>
        </div>
        <template #footer>
            <div class="com-dialog-footer">
                <el-button type="primary" @click="emit('isShow', false)">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import selectShortcutSoundSource from './select_shortcut_sound_source.vue'

// 声明触发事件
const emit = defineEmits(["isShow"]);
// 声明父组件传值
const parentData = defineProps(["isShow"]);

const form = reactive({
    title: "选择快捷音源",
    dialogVisible: false,
});
// 表单ref
const ruleFormRef = ref<FormInstance>();

// 处理选择终端/分组组件的数据
const handleRequestTerminals = (data: any) => {
    console.log(data);
};
const handleRequestGroups = (data: any) => {
    console.log(data);
};


// mounted 实例挂载完成后被调用
onMounted(() => { });
</script>

<style lang="scss" scoped>
.com-dialog-components {
    height: 380px;
}
</style>