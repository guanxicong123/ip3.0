interface UserParams<T = any> {
  defaultSchemeID: number;
  user: T;
}

export const useUserStore = defineStore({
  id: "user", // id必填，且需要唯一
  state: (): UserParams => {
    return {
      user: {
        id: 0,
        pageRule: [],
        type: 0,
        name: "",
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
    // 清除用户数据
    clearUser() {
      this.user = {};
    },
  },
});
