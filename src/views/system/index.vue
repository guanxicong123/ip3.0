<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\views\system\index.vue
  @Describe: 系统配置
-->
<template>
  <div class="com-index">系统配置</div>
</template>

<script lang="ts" setup>
const data = reactive({
  data: [],
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  console.log(data);
});
</script>

<style lang="scss" scoped></style>
