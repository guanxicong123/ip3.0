export interface playState {
  playVoiceData: any;
  playStatusData: any;
  playSubscriptionTask: any;
  playTaskStaging: Array<any>;
  switchPlayMediaNameMap:any;
  isLatestTaskStatus:boolean;
}
export const usePlayStore = defineStore({
  id: "play_center",
  state: (): playState => ({
    playVoiceData: [],
    playStatusData: {},
    playSubscriptionTask: {},
    playTaskStaging: [], //用于储存
    switchPlayMediaNameMap:{}, // 创建任务后时候，用于切换到某个媒体播放
    isLatestTaskStatus:true, // 当前是否为最新的任务列表
  }),
  actions: {
    setPlayVoice(data: any) {
      this.playVoiceData = data || [];
    },
    setPlayStatus(data: any) {
      this.playStatusData = data;
    },
    setPlayTaskStatus(data: any) {
      this.playSubscriptionTask = data[0];
    },
    changePlayTaskStaging(data: any) {
      if (data.key === "add") {
        this.playTaskStaging.push(data.value)
      }else {
        this.playTaskStaging = this.playTaskStaging.filter((item: string)=> {
          return item !== data.value
        })
      }
    },
    setSwitchPlayMediaNameMap(TaskID : string, playName : string){
      this.switchPlayMediaNameMap[TaskID] = playName
    },
    setIsLatestTaskStatus(flog:boolean){
      this.isLatestTaskStatus = flog
    }
  },
});
