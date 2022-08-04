<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-03
  @FilePath: src\views\play\add-edit-component\add-edit-play-task.vue
  @Describe: 新建/编辑播放任务
-->
<template>
    <div class="com-add-edit-play-task">

    </div>
</template>

<script lang="ts" setup>

    const data = reactive({
        data: []
    })
    const ruleForm = reactive({
        name: '',
        task_volume: '',
        priority: '',
    })

    // mounted 实例挂载完成后被调用
    onMounted(() => {
            console.log(data)
    })

</script>

<style lang="scss" scoped>
    
</style>