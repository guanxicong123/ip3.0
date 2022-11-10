import router from "../router";

export interface playState {
    playVoiceData: Array<[]>;
}
export const usePlayStore = defineStore({
    id: "play_center",
    state: (): playState => ({
        playVoiceData: []
    }),
    actions: {
        setPlayVoice(data: any) {
            console.log(data)
            this.playVoiceData = data.TTSEngineInfo
        }
    },
});
