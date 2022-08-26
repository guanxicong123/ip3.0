<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-15
  @FilePath: src\views\play\components\music-play-component.vue
  @Describe: 音乐播放组件（选择本地音频）
-->
<template>
    <div class="com-music-play-component">
        <div class="com-main">
            <div class="com-table">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    height="100%"
                    ref="multipleTableRef"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="index" width="50"/>
                    <el-table-column prop="name" label="文件名称"/>
                    <el-table-column prop="time" label="时长">
                    </el-table-column>
                    <el-table-column type="selection" width="55"/>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ElTable } from 'element-plus';

    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    const props = defineProps({
        fileList: Array
    })
    const emit = defineEmits([
        'update:musicSelect'
    ])
    const data = reactive({
        tableData: []
    })
    const tableData = computed(()=> {
        return props.fileList
    })

    watch(tableData, (newVal)=> {
        console.log(newVal)
    })

    const handleSelectionChange = (val: any) => {
        val.forEach((item: { name: any; })=> {
            return item.name
        })
        emit('update:musicSelect', val)
    }
    
    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(data)
    })

</script>

<style lang="scss" scoped>
    .com-music-play-component {
        max-height: 260px;
        overflow: hidden;
    }
</style>