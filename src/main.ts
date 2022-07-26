import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "element-plus/dist/index.css";
import "@/assets/css/theme.scss";
import "@/assets/font/iconfont.js";
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(createPinia() as any)
  .use(router as any)
  .mount("#app");
