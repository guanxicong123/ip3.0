<!-- 
  @Author: hmf
  @CreateDate: 2022-07-25
  @FilePath: src\App.vue
  @Describe: 根组件
-->
<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
// 导入 Element Plus 语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import en from "element-plus/es/locale/lang/en";
import fr from "element-plus/es/locale/lang/fr";
import ko from "element-plus/es/locale/lang/ko";
import ru from "element-plus/es/locale/lang/ru";
import pt from "element-plus/es/locale/lang/pt";

const app = getStore.useAppStore();
// 计算属性 computed
const language = computed(() => app.language);
const size: any = computed(() => app.size);

// Element Plus 框架的多语言映射
const languageMap = new Map([
  ["zh-cn", zhCn],
  ["zh-hk", zhTw],
  ["en-us", en],
  ["ru-ru", ru],
  ["fr", fr],
  ["pt", pt],
  ["ko", ko],
]);
const locale = ref();

watch(
  language,
  (newLang) => {
    locale.value = languageMap.get(newLang.language);
  },
  {
    // 初始化立即执行
    immediate: true,
  }
);
</script>
