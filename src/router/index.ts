import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/login/index.vue";
import Register from "@/components/register.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "@/components/register.vue"),
  },
  {
    path: "/",
    name: "container",
    component: () =>
      import(/* webpackChunkName: "container" */ "@/components/container.vue"),
    children: [
      // 终端状态
      {
        path: "terminal",
        name: "terminal",
        component: () =>
          import(
            /* webpackChunkName: "terminal" */ "@/views/terminal/index.vue"
          ),
        children: [
          // 终端-列表
          {
            path: "terminal_list/:id?",
            name: "terminal_list",
            component: () =>
              import(
                /* webpackChunkName: "terminal_list" */ "@/views/terminal/child_nav/terminal_list_index.vue"
              ),
          },
          // 终端-方块
          {
            path: "terminal_block/:id?",
            name: "terminal_block",
            component: () =>
              import(
                /* webpackChunkName: "terminal_block" */ "@/views/terminal/child_nav/terminal_block_index.vue"
              ),
          },
          // 分组
          {
            path: "group",
            name: "group",
            component: () =>
              import(
                /* webpackChunkName: "group" */ "@/views/terminal/child_nav/group_index.vue"
              ),
          },
        ],
      },
      // 播放中心
      {
        path: "play",
        name: "play",
        component: () =>
          import(/* webpackChunkName: "play" */ "@/views/play/index.vue"),
      },
      // 播放中心
      {
        path: "play-task/:id?",
        name: "play-task",
        component: () =>
          import(
            /* webpackChunkName: "play" */ "@/views/play/add-edit-component/add-edit-play-task.vue"
          ),
      },
      // 会话状态
      {
        path: "session",
        name: "session",
        component: () =>
          import(/* webpackChunkName: "session" */ "@/views/session/index.vue"),
      },
      // 定时任务
      {
        path: "timing",
        name: "timing",
        component: () =>
          import(/* webpackChunkName: "timing" */ "@/views/timing/index.vue"),
      },
      {
        path: "timing/new_edit/:id?",
        name: "new_edit_timing",
        component: () =>
          import(
            /* webpackChunkName: "new_edit_timing" */ "@/views/timing/new_edit_index.vue"
          ),
      },
      // 媒体库
      {
        path: "media",
        name: "media",
        component: () =>
          import(/* webpackChunkName: "media" */ "@/views/media/index.vue"),
      },
      // 系统配置
      {
        path: "system/configure",
        name: "system_configure",
        component: () =>
          import(
            /* webpackChunkName: "configure" */ "@/views/system/index.vue"
          ),
      },
      // 日志管理
      {
        path: "system/log",
        name: "system_log",
        component: () =>
          import(/* webpackChunkName: "log" */ "@/views/log/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
