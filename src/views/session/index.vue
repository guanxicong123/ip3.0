<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\session\index.vue
  @Describe: 会话状态
-->
<template>
  <div class="com-index">会话状态</div>
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
