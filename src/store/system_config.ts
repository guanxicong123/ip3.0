import router from "../router";
import $http from "@/utils/axios/index";
import $http1 from "@/utils/axios/local_index";
import i18n from "@/utils/language";

const $t: any = i18n.global;

export interface systemState {
  media_options: any;
  regional_options: any;
  router_permission_config: any;
  remind_config: any;
  default_config: any;
  alarm_config: any;
  functional_configs: any;
  system_configs: any;
  basic_configs: any;
  router_data: any;
  opcodes: string;
  pageSize: any;
  priorityData: any;
}

const sidebarData = [
  {
    name: $t.t("Equipment status"),
    path: "/terminal",
    icon: "icon-terminal-status",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: "播放中心",
    path: "/play",
    icon: "icon-playback-center",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: $t.t("Session status"),
    path: "/session",
    icon: "icon-session-state",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: $t.t("Timing task"),
    path: "/timing",
    icon: "icon-task",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: $t.t("Media library"),
    path: "/media",
    icon: "icon-meitiku",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: $t.t("System"),
    path: "/system",
    icon: "icon-system",
    hover: false,
    permission: true,
    children: [
      { name: $t.t("System configuration"), path: "/system/configure" },
      { name: $t.t("Log management"), path: "/system/log" },
    ],
  },
];

// const permission_map = new Map([
//   [0, "终端状态"],
//   [1, "播放中心"],
//   [2, "会话状态"],
//   [3, "定时任务"],
//   [4, "媒体库"],
// ]);

export const useSystemStore = defineStore({
  id: "system_config",
  state: (): systemState => ({
    // 媒体选项
    media_options: {},
    // 区域选项
    regional_options: {},
    // 路由权限配置
    router_permission_config: {},

    // 提醒配置：火警、人工、终端离线登
    remind_config: {},
    // 默认配置:终端状态默认项、默认展示模块、终端排序
    default_config: {},
    // 一键报警配置：一键报警启用、报警曲目
    alarm_config: {},
    // 功能管理
    functional_configs: {},
    // 系统配置
    system_configs: {},
    // 基本设置
    basic_configs: {},
    // 分页
    pageSize: {
      Terminal_PageSize: 20,
      Session_PageSize: 20,
      Timer_PageSize: 20,
      Medias_PageSize: 20,
      Log_PageSize: 20,
    },
    router_data: [],
    opcodes: "",
    priorityData: new Map(), //
  }),

  actions: {
    // 获取所有的系统配置数据
    getConfigInfo() {
      return new Promise((resolve, reject) => {
        $http1
          .get("/config", {
            params: {
              username: localStorage.get("username"),
              serverip: localStorage.get("serverIP"),
            },
          })
          .then((result: any) => {
            if (result.result === 200) {
              const data = result.data;
              // 功能管理相关数据
              this.functional_configs = {
                FolderDisplay: data.FolderDisplay,
                GroupDisplay: data.GroupDisplay,
                remoteTaskDisplay: data.remoteTaskDisplay,
                TerminalStateEnabled: data.TerminalStateEnabled,
                PlayCenterEnabled: data.PlayCenterEnabled,
                SessionEnabled: data.SessionEnabled,
                TimingEnabled: data.TimingEnabled,
                MediasEnabled: data.MediasEnabled,
              };
              // 系统配置数据
              this.system_configs = {
                EnabledAlarm: data.EnabledAlarm,
                AlarmID: data.AlarmID,
                TerminalOrderbyType: data.TerminalOrderbyType,
                TerminalStateDefaultType: data.TerminalStateDefaultType,
                DefaultDisplayView: data.DefaultDisplayView,
                EnabledFireAlert: data.EnabledFireAlert,
                EnabledPersonAlert: data.EnabledPersonAlert,
                EnabledTerminalOffAlert: data.EnabledTerminalOffAlert,
                EnabledTerminalOffRingfAlert: data.EnabledTerminalOffRingfAlert,
              };
              // 基本配置：如主讲终端、主题等
              this.basic_configs = {
                MainEndpointID: data.MainEndpointID,
                Theme: data.Theme,
                Language: data.Language,
                DisplayType: data.DisplayType,
                ListDisplaySize: data.ListDisplaySize,
                ID: data.ID,
              };
              // 模块分页
              this.pageSize = {
                Terminal_PageSize: data.Terminal_PageSize
                  ? data.Terminal_PageSize
                  : 20,
                Session_PageSize: data.Session_PageSize
                  ? data.Session_PageSize
                  : 20,
                Timer_PageSize: data.Timer_PageSize ? data.Timer_PageSize : 20,
                Medias_PageSize: data.Medias_PageSize
                  ? data.Medias_PageSize
                  : 20,
                Log_PageSize: data.Log_PageSize ? data.Log_PageSize : 20,
              };
              this.setRouterPermission();
            }
            resolve({
              functional_configs: this.functional_configs,
              system_configs: this.system_configs,
            });
          });
      });
    },
    // 获取机器码
    getProductKey() {
      $http1.get("/register").then((result: any) => {
        if (result.result === 200) {
          this.opcodes = result.data.ProductKey;
          this.opcodes = "14827-67853-39229-50676-09802-52491-53438";
        }
      });
    },

    // 获取所有系统优先级
    getPrioritySetting() {
      return new Promise((resolve, reject) => {
        $http.get("/priority-setting").then((restlu: any) => {
          restlu.data.forEach((item: { task_type: any; priority: any }) => {
            this.priorityData.set(item.task_type, item.priority);
          });
          resolve(restlu.data);
        });
      });
    },

    // 处理登录成功后，路由权限数据
    setRouterPermission() {
      this.router_data = [];
      sidebarData.forEach((item) => {
        if (item.name === $t.t("Equipment status")) {
          item.permission = this.functional_configs.TerminalStateEnabled;
        } else if (item.name === "播放中心") {
          item.permission = this.functional_configs.PlayCenterEnabled;
        } else if (item.name === $t.t("Session status")) {
          item.permission = this.functional_configs.SessionEnabled;
        } else if (item.name === $t.t("Timing task")) {
          item.permission = this.functional_configs.TimingEnabled;
        } else if (item.name === $t.t("Media library")) {
          item.permission = this.functional_configs.MediasEnabled;
        } else {
          item.permission = true;
        }
        this.router_data.push(item);
      });
      // const default_view = permission_map.get(
      //   this.system_configs.DefaultDisplayView
      // );
      // const index = this.router_data.findIndex((item: any) => {
      //   return item.name === default_view;
      // });
      // const next_path = this.router_data[index].permission
      //   ? this.router_data[index].path
      //   : this.router_data[0].path;
      const time_id = setInterval(() => {
        // if (getStore.getStore.useTerminalStore().terminal_data.length > 0 && getStore.getStore.useTerminalStore().terminal_group.length > 0) {
        // router.push('/terminal')
        clearInterval(time_id);
        // }
      }, 100);
    },

    // 更新终端状态模块基础配置
    updateTerminalStatusConfig(data: any) {
      this.basic_configs.ListDisplaySize = data.ListDisplaySize;
      this.basic_configs.DisplayType = data.DisplayType;
    },
    // 更新系统配置数据
    updateSystemConfig(data: any) {
      for (const [key, value] of Object.entries(data)) {
        this.system_configs[key] = value;
      }
    },
    // 更新系统配置数据
    updateSystemSize(data: any) {
      const key = data.key;
      const val = data.val;
      $http1
        .put("/config/" + this.basic_configs.ID, {
          [key]: val,
        })
        .then((result: any) => {
          if (result.result === 200) {
            this.pageSize[key] = val;
          }
        });
    },
  },
});
