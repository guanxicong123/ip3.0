export interface playState {
  playVoiceData: any;
  playStatusData: any;
  allPlaySubscriptionTaskMap: any;
  playTaskStaging: Array<any>;
  isLatestTaskStatus: boolean;
  isLatestTaskDetail: boolean;
  changeTaskVolume: boolean;
}
export const usePlayStore = defineStore({
  id: "play_center",
  state: (): playState => ({
    playVoiceData: [],
    playStatusData: {},
    allPlaySubscriptionTaskMap: {},
    playTaskStaging: [], //用于储存
    isLatestTaskStatus: true, // 当前是否为最新的任务列表
    isLatestTaskDetail: true, // 当前是否为最新的任务详情
    changeTaskVolume: true, // 改变任务音量
  }),
  actions: {
    setPlayVoice(data: any) {
      this.playVoiceData = data || [];
    },
    setPlayStatus(data: any) {
      this.playStatusData = data;
    },
    setPlayTaskStatus(data: any) {
      // 把所有的订阅任务 的进度条信息存储
      data.forEach((task: any) => {
        this.allPlaySubscriptionTaskMap[task.TaskID] = task;
      });
    },
    removeSubscriptionTask(data: any) {
      delete this.allPlaySubscriptionTaskMap[data.TaskID];
    },
    changePlayTaskStaging(data: any) {
      if (data.key === "add") {
        this.playTaskStaging.push(data.value);
      } else {
        this.playTaskStaging = this.playTaskStaging.filter((item: string) => {
          return item !== data.value;
        });
      }
    },
    setIsLatestTaskStatus(flog: boolean) {
      this.isLatestTaskStatus = flog;
    },
    setIsLatestTaskDetail(flog: boolean) {
      this.isLatestTaskDetail = flog;
    },
    setChangeTaskVolume(flog: boolean) {
      this.changeTaskVolume = flog;
    },
  },
});
