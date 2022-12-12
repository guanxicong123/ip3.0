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
            this.playVoiceData = data || []
            console.log(this.playVoiceData)
        },
        setPlayStatus(data: any) {
            this.playStatusData = data
        },
    },
})
