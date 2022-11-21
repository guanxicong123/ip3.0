interface UserParams<T = any> {
  defaultSchemeID: number;
  user: T;
}

export const useUserStore = defineStore({
  id: "user", // id必填，且需要唯一
  state: (): UserParams => {
    return {
      user: {
        config: {
          ipAddress: "",
          alarm: [],
          alarmPort: [],
          amplifier: [],
          power: [],
          pageRule: [],
          defaultCallMusic: {
            id: 0,
            name: "ring.mp3",
          },
          defaultWaitingMusic: {
            id: 0,
            name: "wait.mp3",
          },
        },
        token: "",
        user: {
          id: 0,
          name: "",
          theme: "0",
          priority: 0,
          type: 0,
          roles: [],
          rules: [{ switch: 0 }],
          ensembles: [],
          home_config_json: [],
          users_config: {
            view_mode: 1,
            default_timing_bells_groups_id: 0,
          },
        },
      },
      defaultSchemeID: 0, // 默认打铃方案
    };
  },
  actions: {
    // 更新用户信息
    updateUser(data: any) {
      this.user = data;
      this.defaultSchemeID =
        data.user.users_config?.default_timing_bells_groups_id;
    },
    // 更新设默认打铃方案
    updateDefalutBellScheme(data: number) {
      this.defaultSchemeID = data;
    },
  },
});
