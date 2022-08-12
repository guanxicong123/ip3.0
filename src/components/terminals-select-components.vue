<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-11
  @FilePath: src\components\terminals-select-components.vue
  @Describe: 终端选择组件
-->
<template>
    <div class="com-terminals-select-components">
        <div class="terminals-select-list">
            <div class="list-top">
                <el-popover v-model:visible="visible" placement="top" :width="100">
                    <el-input v-model="searchTerminalName" placeholder="请输入终端名称" :suffix-icon="Search"/>
                    <template #reference>
                        <!-- <el-button @click="visible = true">Delete</el-button> -->
                        <div class="terminals-select-search" @click="visible = true">
                            <span>终端</span>
                            <span class="iconfont icon-search"></span>
                        </div>
                    </template>
                </el-popover>
                <el-popover v-model:visible="visible" placement="top" :width="100">
                    <el-input v-model="searchGroupName" placeholder="请输入分组名称" :suffix-icon="Search"/>
                    <template #reference>
                        <div class="terminals-select-search" @click="visible = true">
                            <span>分组</span>
                            <span class="iconfont icon-search"></span>
                        </div>
                    </template>
                </el-popover>
            </div>
            <el-select v-model="groupId" class="m-2" placeholder="Select">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                />
            </el-select>
        </div>
        <div class="terminals-select-content">
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
</template>

<script lang="ts" setup>
    import { Search } from '@element-plus/icons-vue'
    const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()

    const data = reactive({
        data: []
    })
    const visible = ref(false)
    const searchTerminalName = ref('')
    const searchGroupName = ref('')
    const groupId = ref(0)
    const options: any = ref([])
    const terminalData = ref([])

    const getGroupsAll = () => {
        global.$http.get('/terminals-groups/all').then(result=> {
            if (result.result === 200) {
                let data = [{
                    id: 0,
                    name: '全部分组'
                }]
                options.value = [...data, ...result.data]
            }
        })
    }
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        getGroupsAll()
    })

</script>

<style lang="scss" scoped>
    .com-terminals-select-components {
        display: flex;
        height: 260px;
        .terminals-select-list {
            flex: 1;
            background-color: #F4F9FF;
            .list-top {
                margin: 10px 30px;
                overflow: hidden;
                .terminals-select-search {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 50%;
                    height: 30px;
                    background-color: #F4F9FF;
                    text-align: center;
                    border: 1px solid #8FC4FF;
                    span {
                        color: #5EA2E2;
                        line-height: 30px;
                    }
                    .iconfont {
                        font-size: 10px;
                        padding-left: 8px;
                    }
                    &:first-child {
                        border-radius: 6px 0px 0px 6px;
                    }
                    &:last-child{
                        border-radius: 0px 6px 6px 0px;
                    }
                    
                }
            }
            .el-select {
                margin: 0 30px;
            }
        }
        .terminals-select-content {
            margin-left: 28px;
            flex: 3;
            background-color: #F4F9FF;
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
</style>