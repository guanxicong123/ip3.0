import router from "../router";

export interface playState {
    playVoiceData: Array<[]>;
    playStatusData: Object;
}
export const usePlayStore = defineStore({
    id: "play_center",
    state: (): playState => ({
        playVoiceData: [],
        playStatusData: {}
    }),
    actions: {
        setPlayVoice(data: any) {
            this.playVoiceData = data.TTSEngineInfo
        },
        setPlayStatus(data: any) {
            this.playStatusData = data
        }
    },
});
