import router from "../router";

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
}

const sidebarData = [
  {
    name: "终端状态",
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
    name: "会话状态",
    path: "/session",
    icon: "icon-session-state",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: "定时任务",
    path: "/timing",
    icon: "icon-task",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: "媒体库",
    path: "/media",
    icon: "icon-meitiku",
    hover: false,
    permission: true,
    children: [],
  },
  {
    name: "系统",
    path: "/system",
    icon: "icon-system",
    hover: false,
    permission: true,
    children: [
      { name: "系统配置", path: "/system/configure" },
      { name: "日志管理", path: "/system/log" },
    ],
  },
];

const permission_map = new Map([
  [0, "终端状态"],
  [1, "播放中心"],
  [2, "会话状态"],
  [3, "定时任务"],
  [4, "媒体库"],
]);

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
    router_data: [],
    opcodes: "",
  }),

  actions: {
    // 获取所有的系统配置数据
    getConfigInfo() {
      axios.get("/api/v1/config", {
          params: {
            username: localStorage.get("username"),
            serverip: localStorage.get("serverIP"),
          },
        })
        .then((result: any) => {
          if (result.data.result === 200) {
            // 功能管理相关数据
            const {
              FolderDisplay,
              GroupDisplay,
              remoteTaskDisplay,
              TerminalStateEnabled,
              PlayCenterEnabled,
              SessionEnabled,
              TimingEnabled,
              MediasEnabled,
            } = result.data.data;
            this.functional_configs = {
              FolderDisplay,
              GroupDisplay,
              remoteTaskDisplay,
              TerminalStateEnabled,
              PlayCenterEnabled,
              SessionEnabled,
              TimingEnabled,
              MediasEnabled,
            };
            // 系统配置数据
            const {
              EnabledAlarm,
              AlarmID,
              TerminalOrderbyType,
              TerminalStateDefaultType,
              DefaultDisplayView,
              EnabledFireAlert,
              EnabledPersonAlert,
              EnabledTerminalOffAlert,
              EnabledTerminalOffRingfAlert,
            } = result.data.data;
            this.system_configs = {
              EnabledAlarm,
              AlarmID,
              TerminalOrderbyType,
              TerminalStateDefaultType,
              DefaultDisplayView,
              EnabledFireAlert,
              EnabledPersonAlert,
              EnabledTerminalOffAlert,
              EnabledTerminalOffRingfAlert,
            };
            // 基本配置：如主讲终端、主题等
            const {
              MainEndpointID,
              Theme,
              Language,
              DisplayType,
              ListDisplaySize,
              ID,
            } = result.data.data;
            this.basic_configs = {
              MainEndpointID,
              Theme,
              Language,
              DisplayType,
              ListDisplaySize,
              ID,
            };
            this.setRouterPermission();
          }
        })
        .catch((error) => {
          // console.log('error', error)
        });
    },

    // 获取机器码
    getProductKey() {
      axios
        .get("http://172.16.21.119:9999/api/v1/register")
        .then((result: any) => {
          if (result.data.result === 200) {
            this.opcodes = result.data.data.ProductKey;
            this.opcodes = "14827-67853-39229-50676-09802-52491-53438";
          }
        });
    },

    // 处理登录成功后，路由权限数据
    setRouterPermission() {
      this.router_data = [];
      sidebarData.forEach((item) => {
        if (item.name === "终端状态") {
          item.permission = this.functional_configs.TerminalStateEnabled;
        } else if (item.name === "播放中心") {
          item.permission = this.functional_configs.PlayCenterEnabled;
        } else if (item.name === "会话状态") {
          item.permission = this.functional_configs.SessionEnabled;
        } else if (item.name === "定时任务") {
          item.permission = this.functional_configs.TimingEnabled;
        } else if (item.name === "媒体库") {
          item.permission = this.functional_configs.MediasEnabled;
        } else {
          item.permission = true;
        }
        this.router_data.push(item);
      });
      const default_view = permission_map.get(
        this.system_configs.DefaultDisplayView
      );
      const index = this.router_data.findIndex((item: any) => {
        return item.name === default_view;
      });
      const next_path = this.router_data[index].permission
        ? this.router_data[index].path
        : this.router_data[0].path;
      console.log(next_path);
      const time_id = setInterval(() => {
        // if (getStore.getStore.useTerminalStore().terminal_data.length > 0 && getStore.getStore.useTerminalStore().terminal_group.length > 0) {
        router.push("/play");
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
  },
});