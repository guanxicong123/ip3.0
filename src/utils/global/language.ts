import { App } from "vue";
import { SystemService } from "@/utils/api/language";

const language = {
  install: (app: App<Element>) => {
    app.config.globalProperties.$getLanguages = () => {
      return new Promise((resolve, reject) => {
        SystemService.language()
          .then((result) => {
            const data = result.data;
            app.config.globalProperties.$languages = data;
            // 当本地存有语言时
            const lang = localStorage.get("lang");
            if (lang) {
              data.language = lang;
            }
            // localStorage.set("lang", data.language);
            getStore.useLanguageStore().updateLanguage(data);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
  },
};

export default language;
