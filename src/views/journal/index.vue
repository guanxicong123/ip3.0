<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\views\journal\index.vue
  @Describe: 终端日志
-->
<template>
    <div class="com-index">
        终端日志
    </div>
</template>

<script lang="ts" setup>

    const data = reactive({
        data: []
    })

    // mounted 实例挂载完成后被调用
    onMounted(() => {
        console.log(data)
    })

</script>

<style lang="scss" scoped>
    
</style>