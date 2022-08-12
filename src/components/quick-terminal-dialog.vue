<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-09
  @FilePath: src\components\quick-terminal-dialog.vue
  @Describe: 快捷终端选择弹框
-->
<template>
    <div class="com-quick-terminal-dialog">
        <el-dialog
            custom-class="quick-terminal-dialog"
            v-model="props.dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
        >
            <template #header="{ close, titleId, titleClass }">
                <div class="dialog-header">
                    <h4 :id="titleId" :class="titleClass">选择快捷终端</h4>
                </div>
            </template>
            <div class="dialog-content">
                <div class="dialog-content-box-left">
                    <div class="box-left-top">
                        <el-popover v-model:visible="visible" placement="top" :width="160">
                            <el-input v-model="searchName" placeholder="请输入配置名称" :suffix-icon="Search"/>
                            <template #reference>
                                <!-- <el-button @click="visible = true">Delete</el-button> -->
                                <div class="quick-terminal-search" @click="visible = true">
                                    <span>配置名称</span>
                                    <span class="iconfont icon-search"></span>
                                </div>
                            </template>
                        </el-popover>
                    </div>
                    <div class="box-left-list">
                        <div class="quick-terminal-data" v-infinite-scroll="load" :infinite-scroll-immediate="false">
                            <div
                                v-for="item in configureData"
                                :key="item.id"
                                :class="{'select-config' :item.id === selectConfigId}"
                                @click="getTerminalDetailed(item.id)">
                                <span>{{item.name}}</span>
                                <span class="iconfont icon-drop-down" v-if="item.id === selectConfigId"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialog-content-box-right">
                    <el-table ref="multipleTableRef" :data="terminalData" style="width: 100%" height="100%">
                        <el-table-column type="index" label="序号" width="80">
                        </el-table-column>
                        <el-table-column prop="name" label="终端/终端分组" show-overflow-tooltip>
                            <template #default="scope">
                                <span>{{scope.row.name}}</span>
                                <span class="iconfont icon-view-terminlas" v-if="scope.row.terminals_groups_id"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ip_address" label="IP地址" show-overflow-tooltip>
                            <template #default="scope">
                                <span>{{scope.row.ip_address ? scope.row.ip_address : '-'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="confirm">确认</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    import { Search } from '@element-plus/icons-vue'
    const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

    const props = defineProps({
        dialogVisible: Boolean
    })
    const emit = defineEmits(['update:dialogVisible'])

    const searchName = ref('')
    const visible = ref(false)
    const configureData: any = ref([])
    const terminalData: any = ref([])
    const selectConfigId = ref(-1)
    const current_page = ref(1)
    const per_page = ref(30)
    const total = ref(0)

    const handleClose = () => {
        emit('update:dialogVisible', false)
    }

    const confirm = () => {
        emit('update:dialogVisible', false)
    }
    // 获取快捷终端
    const getFastTerminals = (current: number, page: number) => {
        global.$http.get('/fast-terminals', {
            params: {
                current_page: current,
                per_page: page
            }
        }).then((result: { result: number; data: { data: any; }; })=> {
            if (result.result === 200) {
                configureData.value = [...result.data.data, ...configureData.value]
            } 
        })
    }
    // 获取终端详细
    const getTerminalDetailed = (id: any) => {
        selectConfigId.value = id
        global.$http.get('/fast-terminals/' + id, {
            params: {
                withTerminals: true
            }
        }).then((result: { result: number; data: any })=> {
            if (result.result === 200) {
                terminalData.value = [...result.data.terminals, ...result.data.terminals_groups]
                console.log(terminalData.value)
            }
        })
    }
    // 滚动到底部触发
    const load = () => {
        current_page.value += 1
        getFastTerminals(current_page.value, per_page.value)
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        getFastTerminals(current_page.value, per_page.value)
    })

</script>

<style lang="scss">
.quick-terminal-dialog {
    .el-dialog__header {
        padding: 0 20px;
        margin-right: 0;
        background-color: #0070EE;
        .el-dialog__title {
            color: #FFFFFF;
            font-size: 14px;
            line-height: 40px;
        }
        .el-dialog__headerbtn {
            top: 0;
            height: 40px;
            width: 40px;
            .el-dialog__close {
                color: #fff;
            }
        }
    }
    .dialog-content {
        height: 380px;
        border: 1px solid #E7E7E7;
        display: flex;
        >div {
            height: 100%;
            background-color: #F4F9FF;
        }
        .dialog-content-box-left {
            flex: 2;
            .box-left-top{
                text-align: center;
                .quick-terminal-search {
                    display: inline-block;
                    margin-top: 10px;
                    width: 199px;
                    height: 30px;
                    line-height: 30px;
                    background-color: #0070EE;
                    color: #FFFFFF;
                    >span {
                        font-size: 14px;
                        &:nth-child(2) {
                            padding-left: 8px;
                        }
                    }
                }
            }
            .box-left-list {
                margin-top: 10px;
                height: calc(100% - 50px);
                .quick-terminal-data {
                    overflow-y: auto;
                    height: 100%;
                    >div {
                        padding: 0 30px;
                        height: 28px;
                        line-height: 28px;
                        display: flex;
                        &:hover {
                            background-color: #E4F0FF;
                        }
                        >span {
                            &:nth-child(1) {
                                flex: 1;
                            }
                            &:nth-child(2) {
                                color: #0070EE;
                                text-align: right;
                                width: 30px;
                                font-size: 6px;
                                padding-left: 8px;
                            }
                        }
                    }
                    .select-config {
                        background-color: #E4F0FF;
                    }
                }
            }
        }
        .dialog-content-box-right {
            margin-left: 18px;
            padding: 0 20px;
            flex: 3;
            .el-table {
                background-color: #F4F9FF;
                th.el-table__cell {
                    background-color: #F4F9FF;
                    color: #333333;
                }
                tr {
                    background-color: #F4F9FF;
                }
                td.el-table__cell {
                    border: 0;
                    box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.05);
                }
                .icon-view-terminlas {
                    color: #0070EE;
                    padding-left: 8px;
                }
            }
        }
    }
}
</style>