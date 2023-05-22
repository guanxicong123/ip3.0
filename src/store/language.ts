import { SystemService } from "@/utils/api/language";
export const useLanguageStore = defineStore({
  id: "language",
  state: () => {
    return {
      language: {
        languagesMap: {},
        language: localStorage.get("lang") || "zh-cn",
        version: "",
        theme: 0,
      },
    };
  },
  actions: {
    // 更新语言信息
    updateLanguage(data: any) {
      this.language.languagesMap = data.languagesMap;
      this.language.version = data.version;
      this.language.theme = data.theme;
    },
    // 单独更新当前选中语言
    updateCurrentLanguage(language: string) {
      this.language.language = language;
      SystemService.putLanguage({ lang: language });
      localStorage.set("lang", language);
    },
  },
});
