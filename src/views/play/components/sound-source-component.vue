<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-16
  @FilePath: src\views\play\components\sound-source-component.vue
  @Describe: 快捷音源组件
-->
<template>
    <div class="com-sound-source-component">
        <el-form :model="ruleForm" label-position="top" class="play-task-form-inline com-sound-source-component">
            <el-row :gutter="80">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-form-item label="快捷音源">
                        <div class="fast-sound-source">
                            <el-input v-model="ruleForm.taskname" disabled/>
                            <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-form-item label="采集音质">
                        <el-select v-model="ruleForm.AudioQuality">
                            <el-option
                                v-for="item in audioQualityOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <quick-music-dialog v-model:isShow="dialogVisible"/>
        <!-- <quick-terminal-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
        >
        </quick-terminal-dialog> -->
  </div>
</template>

<script lang="ts" setup>
    import quickTerminalDialog from '../../../components/quick-terminal-dialog.vue'
    const props = defineProps({
        ruleForm: Object
    })
    const ruleForm = reactive({
        taskname: '',
        AudioQuality: 0
    })
    const audioQualityOptions = [
        { label: '初级', value: 0 },
        { label: '中级', value: 1 },
    ]
    const dialogVisible = ref(false)

  // mounted 实例挂载完成后被调用
  onMounted(() => {
  })

</script>

<style lang="scss" scoped>
    
</style>