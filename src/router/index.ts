import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/login/index.vue";
import Register from "../components/register.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/home/index.vue"),
    children: [
      // 终端状态
      {
        path: "/terminal",
        name: "terminal",
        component: () =>
          import(
            /* webpackChunkName: "terminal" */ "../views/terminal/index.vue"
          ),
      },
      // 播放中心
      {
        path: "/play",
        name: "play",
        component: () =>
          import(/* webpackChunkName: "play" */ "../views/play/index.vue"),
      },
      // 会话状态
      {
        path: "/session",
        name: "session",
        component: () =>
          import(
            /* webpackChunkName: "session" */ "../views/session/index.vue"
          ),
      },
      // 定时任务
      {
        path: "/timing",
        name: "timing",
        component: () =>
          import(/* webpackChunkName: "timing" */ "../views/timing/index.vue"),
      },
      // 媒体库
      {
        path: "/medium",
        name: "medium",
        component: () =>
          import(/* webpackChunkName: "medium" */ "../views/medium/index.vue"),
      },
      // 系统配置
      {
        path: "system/configure",
        name: "system_configure",
        component: () =>
          import(
            /* webpackChunkName: "configure" */ "../views/system/index.vue"
          ),
      },
      // 日志管理
      {
        path: "system/log",
        name: "system_log",
        component: () =>
          import(/* webpackChunkName: "log" */ "../views/log/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;