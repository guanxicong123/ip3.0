<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\play\index.vue
  @Describe: 播放中心
-->
<template>
  <div class="com-index">播放中心</div>
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
