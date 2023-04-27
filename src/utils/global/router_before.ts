import { App } from "vue";
import router from "@/router";

const routerBeforeEach = {
  install: (app: App<Element>) => {
    // 全局路由守卫
    router.beforeEach((to, from, next) => {
      // 当全局对象没有 $languages 时，需要请求下获取语言接口方法
      if (!app.config.globalProperties.$languages) {
        app.config.globalProperties
          .$getLanguages()
          .then((result: any) => {
            document.title = app.config.globalProperties.$t(
              "IP network broadcasting"
            );
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
      next();
    });
  },
};

export default routerBeforeEach;
