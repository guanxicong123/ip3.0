import { createApp } from "vue";
import App from "./App.vue";
import i18n from "@/utils/language";
import router from "./router";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import language from "@/utils/global/language";
import routerBefore from "@/utils/global/router_before";
import "@/assets/font/iconfont.js";
// 引入全局样式
import "element-plus/dist/index.css";
import "@/assets/css/theme.scss";
// 导入全局通用组件
import terminalsSelectComponents from "@/components/terminals-select-components.vue";
import quickMusicDialog from "@/components/quick-music-dialog.vue";
import selectSoundSourceCollectionRadio from "@/components/select_sound_source_collection_radio.vue";
import selectShortcutTerminalRadio from "@/components/select_shortcut_terminal_radio.vue";
import { ElMessage } from "element-plus";
// 注册全局通用组件
import registerComponents from "@/utils/global/register_components";
import $http from "@/utils/axios/index";
import $http1 from "@/utils/axios/local_index";

const app = createApp(App);
// 注册全局通用组件
app.component("terminals-select-components", terminalsSelectComponents);
app.component("quick-music-dialog", quickMusicDialog);
app.component(
  "select-sound-source-collection-radio",
  selectSoundSourceCollectionRadio
);
app.component("select-shortcut-terminal-radio", selectShortcutTerminalRadio);
// ElementPlusIcons图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const global = app.config.globalProperties; //原型链
global.$message = ElMessage;

global.$http = reactive($http);
global.$http1 = reactive($http1);
// axios.defaults.withCredentials = true

app
  .use(store)
  .use(i18n)
  .use(router as any)
  .use(language)
  .use(routerBefore)
  .use(registerComponents)
  .mount("#app");
