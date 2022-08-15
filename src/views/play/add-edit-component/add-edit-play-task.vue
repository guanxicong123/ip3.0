<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-03
  @FilePath: src\views\play\add-edit-component\add-edit-play-task.vue
  @Describe: 新建/编辑播放任务
-->
<template>
    <div class="com-add-edit-play-task">
        <el-scrollbar>
            <div class="play-task-basics configure-level">
                <div class="from-alert">
                    <span>基础配置</span>
                </div>
                <div class="play-task-basics-content configure-level-content">
                    <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
                        <el-row :gutter="80">
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务名称">
                                    <el-input v-model="ruleForm.taskname" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务音量">
                                    <el-input v-model.number="ruleForm.volume" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="优先级">
                                    <el-input v-model.number="ruleForm.priority" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="音源类型">
                                    <el-select v-model="ruleForm.type">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="play-task-configure configure-level">
                <div class="from-alert">
                    <span>播放配置</span>
                </div>
                <div class="play-task-configure-content configure-level-content">
                    <p class="selection-title">快捷音源</p>
                    <div class="quick-terminal-selection">
                        <el-input v-model="ruleForm.taskname" disabled/>
                        <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                    </div>
                </div>
            </div>
            <div class="play-task-region configure-level">
                <div class="from-alert">
                    <span>执行区域</span>
                </div>
                <div class="play-task-configure-content configure-level-content">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane label="快捷终端" name="first">
                            <el-row :gutter="80">
                                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                    <p class="selection-title">快捷终端</p>
                                    <div class="quick-terminal-selection">
                                        <el-input v-model="ruleForm.taskname" disabled/>
                                        <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="终端选择" name="second">
                            <terminals-select-components>
                            </terminals-select-components>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-scrollbar>
        <quick-terminal-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
        >
        </quick-terminal-dialog>
    </div>
</template>

<script lang="ts" setup>
    import type { TabsPaneContext } from 'element-plus'
    import quickTerminalDialog from '../../../components/quick-terminal-dialog.vue'
    const activeName = ref('first')
    const data = reactive({
        data: []
    })
    const ruleForm = reactive({
        taskname: '',
        volume: '',
        priority: '',
        type: 1
    })
    const dialogVisible = ref(false)
    const options = [
        { label: '快捷音源', value: 1 },
        { label: '音乐播放', value: 2 },
        { label: '音源采集', value: 3 },
        { label: '文本播放', value: 4 },
        { label: '远程播放', value: 5 }
        
    ]

    const handleClick = (tab: TabsPaneContext, event: Event) => {

    }
    // 获取所有终端
    const getTerminalsAll = () => {
        
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(data)
    })

</script>

<style lang="scss">
    .from-alert {
        padding: 14px 0;
        border-bottom: 1px solid #E0E2E3;
        span {
            font-size: 14px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #6F95C1;
        }
    }
    .configure-level {
        padding-top: 8px;
        padding-bottom: 20px;
        .configure-level-content {
            padding-top: 22px;
        }
        .el-tabs__nav-wrap::after {
            height: 0;
        }
        .selection-title {
            padding: 8px 0;
            color: #666666;
        }
        .quick-terminal-selection {
            .el-input {
                width: 90%;
            }
            .el-input.is-disabled .el-input__wrapper {
                background-color: #fff;
            }
            .iconfont {
                padding-left: 4px;
                font-size: 16px;
                color: #0070EE;
            }

        }
    }
    .com-add-edit-play-task {
        padding: 0 40px;
    }
    .play-task-form-inline {
        overflow: hidden;
        .el-form-item {
            .el-form-item__content {
                .el-select {
                    width: 100%;
                }
            }
        }
    }
</style>