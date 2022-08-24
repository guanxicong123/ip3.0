<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-15
  @FilePath: src\views\play\components\music-play-component.vue
  @Describe: 音乐播放组件（选择本地音频）
-->
<template>
    <div class="com-music-play-component">
        <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="index" width="50"/>
            <el-table-column prop="name" label="文件名称"/>
            <el-table-column prop="time" label="时长">
            </el-table-column>
            <el-table-column type="selection" width="55"/>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
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
    watch(()=> props.fileList, (newVal)=> {
        console.log(newVal)
    })

    // 
    const handleSelectionChange = (val: any) => {
        val.forEach((item: { name: any; })=> {
            return item.name
        })
        emit('update:musicSelect', val)
    }
    // 获取文件时长
    const getTimes = (file: any) => {
        var content = file
        //获取录音时长
        var url = URL.createObjectURL(content);
            //经测试，发现audio也可获取视频的时长
        var audioElement = new Audio(url);

        let duration = audioElement.addEventListener("loadedmetadata", () => {
            let data = audioElement.duration;
            return formatSecondNo(data)
        })
        return duration
    }
    // 时长转换
    const formatSecondNo = (seconds: any) => {
        let hour: any = Math.floor(seconds / 3600) >= 10 ? Math.floor(seconds / 3600) : '0' + Math.floor(seconds / 3600);
        seconds -= 3600 * hour;
        let min: any = Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60);
        seconds -= 60 * min;
        let sec = seconds >= 10 ? Math.trunc(seconds) : '0' +  Math.trunc(seconds);
        return  hour  + ':' + min + ':' +  sec;
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