<!-- 
  @Author: hmf
  @CreateDate: 2022-07-25
  @FilePath: src\App.vue
  @Describe: 
-->
<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
// 导入 Element Plus 语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const app = useAppStore();
console.log(app.$state, app.language, app.size);
const language = computed(() => app.language);
const size: any = computed(() => app.size);

const locale = ref();

watch(
  language,
  (value) => {
    console.log(value);
    locale.value = value == "en" ? en : zhCn;
  },
  {
    // 初始化立即执行
    immediate: true,
  }
);
</script>
