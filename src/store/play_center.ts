export interface playState {
  playVoiceData: any
  playStatusData: any
}
export const usePlayStore = defineStore({
    id: 'play_center',
    state: (): playState => ({
        playVoiceData: [],
        playStatusData: {},
    }),
    actions: {
        setPlayVoice(data: any) {
            this.playVoiceData = []
            if (Array.isArray(data)) {
                data.forEach((item) => {
                this.playVoiceData.push({
                    id: item.EngineIndex,
                    name: item.EngineName,
                })
                })
            }
        },
        setPlayStatus(data: any) {
            this.playStatusData = data
        },
    },
})
