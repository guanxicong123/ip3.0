<!-- 
  @Author: yangyq
  @CreateDate: 2023-02-06
  @FilePath: src\components\dialong_warning_message.vue
  @Describe: 警告消息弹框（终端离线、人工报警提醒、火警报警提醒）
-->
<template>
    <el-dialog
        v-model="parentData.dialogVisible"
        title="警告"
        custom-class="com-dialong_warning_message"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <div class="com-warning_message-title">
            <p>{{ parentData.dialogTitle }}</p>
        </div>
        <el-table
            :data="tableData" border
            class="com-warning_message-table"
            @sort-change="handleSortChange"
            :default-sort="{ prop: 'EndPointName', order: 'descending' }">
            <el-table-column property="EndPointName" label="终端" width="150" sortable/>
            <el-table-column property="EndPointIP" label="IP地址" width="200" />
            <el-table-column property="OfflineTime" label="离线时间" sortable/>
        </el-table>
    </el-dialog>
</template>

<script lang="ts" setup>
    const parentData = defineProps({
        dialogVisible: Boolean,
        dialogTitle: String,
        dialogAlertData: Array
    })
    const parentEmit = defineEmits(['update:dialogVisible', 'requestDispose'])

    const tableData: any = ref([])

    watch(()=>parentData.dialogAlertData, ()=> {
        tableData.value = parentData.dialogAlertData
    })
    // 处理排序
    const handleSortChange = (row: { prop: any; order: string | string[] }) => {
        if (row.prop == "name") {
            if (row.order === "descending") {
                tableData.value.sort((a: any, b: any) =>
                    b.name.localeCompare(a.name, "zh")
                );
            } else if (row.order === "ascending") {
                tableData.value.sort((a: any, b: any) =>
                    a.name.localeCompare(b.name, "zh")
                );
            }
        }
    };
    const handleClose = (done: () => void) => {
        parentEmit('requestDispose')
        done()
        parentEmit('update:dialogVisible', false)
    };
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        tableData.value = parentData.dialogAlertData
    })

</script>

<style lang="scss">
    .com-dialong_warning_message {
        .el-dialog__header {
            background-color: #CE6245;
            margin-right: 0px;
            padding: 10px 17px 10px 20px;

            .el-dialog__title {
                color: #fff;
            }

            .el-dialog__headerbtn .el-dialog__close {
                color: #fff;
            }

            .el-dialog__headerbtn {
                top: 0px;
                width: 44px;
                height: 44px;
            }
            
        }
        .el-dialog__body {
            height: 300px;
            padding: 0px 20px 10px 20px;
            overflow: hidden;

            .com-warning_message-title {
                font-size: 16px;
                color: #000000;
                line-height: 24px;
                padding: 26px 0;
            }

            .com-warning_message-table {
                height: calc(100% - 96px);
                overflow: hidden;
                
                td.el-table__cell {
                    border-bottom: var(--el-table-border);
                }

                .el-table__cell {
                    border-right: var(--el-table-border);
                }
            }
        }
    }
</style>