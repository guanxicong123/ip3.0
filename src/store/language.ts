export const useLanguageStore = defineStore({
  id: "language",
  state: () => {
    return {
      language: {
        languagesMap: {},
        language: "zh-cn",
        version: "",
        theme: 1,
      },
    };
  },
  actions: {
    // 更新语言信息
    updateLanguage(data: any) {
      this.language = data;
    },
  },
});
