import router from "../router";
export interface AppState {
  is_websocekt: boolean;
  is_login: boolean;
  is_login_status: number;
  sessionsArray: Array<[]>;
  sessionsLocalKey: Array<[]>;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    is_websocekt: false, //是否连接
    is_login: false, //是否登录中
    is_login_status: 0,
    sessionsArray: [], //会话数据（时实任务）
    sessionsLocalKey: [], //基本本机发起任务key
  }),
  actions: {
    // 改变webscoet连接状态
    changeWsStatus(is_websocekt: boolean) {
      this.is_websocekt = is_websocekt;
    },
    // 改变登录状态
    changeLoginStatus(status: boolean) {
      this.is_login = status;
    },
    // 登录成功返回信息
    loginSuccessData(data: any) {
      this.is_login = false;
      localStorage.set("LoginUserID", data.data.UserID);
      // 登录成功获取路由权限数据
      getStore
        .useSystemStore()
        .getConfigInfo()
        .then((result: any) => {
          const data = new Map([
            [
              0,
              {
                isShow: result?.functional_configs?.TerminalStateEnabled,
                path: "/terminal",
              },
            ],
            [
              1,
              {
                isShow: result?.functional_configs?.PlayCenterEnabled,
                path: "/play",
              },
            ],
            [
              2,
              {
                isShow: result?.functional_configs?.SessionEnabled,
                path: "/session",
              },
            ],
            [
              3,
              {
                isShow: result?.functional_configs?.TimingEnabled,
                path: "/timing",
              },
            ],
            [
              4,
              {
                isShow: result?.functional_configs?.MediasEnabled,
                path: "/media",
              },
            ],
          ]);
          const defaultModule = data.get(
            result.system_configs.DefaultDisplayView
          );
          if (defaultModule?.isShow) {
            router.push(defaultModule?.path);
          } else {
            [0, 1, 2, 3, 4].some((item: number) => {
              const defaultData = data.get(item);
              if (defaultData?.isShow) {
                router.push(defaultData?.path);
                return true;
              }
              return false;
            });
          }

          // router.push("/terminal")
        });
      // 获取系统优先级
      getStore.useSystemStore().getPrioritySetting();
    },
    // 会话状态
    ROUTER_TASK(data: any) {
      if (data) {
        this.sessionsArray = data;
      } else {
        this.sessionsArray = [];
      }
    },
    // 本地任务key记录
    taskLocalKeyRecord(row: any) {
      this.sessionsLocalKey.push(row);
    },
    // 会话数据推送
    taskDataPush(data: any) {
      if (this.sessionsArray.length === 0) {
        this.sessionsArray = data;
      } else {
        data.forEach((one: any) => {
          const result = this.sessionsArray.some((two: any) => {
            if (one.TaskID === two.TaskID) {
              Object.assign(two, one);
              return true;
            } else {
              return false;
            }
          });
          if (!result) {
            this.sessionsArray.push(one);
          }
        });
      }
    },
    // 会话停止推送
    taskPushStop(row: any) {
      this.sessionsArray = this.sessionsArray.filter((item: any) => {
        return item.TaskID !== row.TaskID;
      });
      this.sessionsLocalKey = this.sessionsLocalKey.filter((item: any) => {
        return item !== row.TaskID;
      });
    },
  },
});
