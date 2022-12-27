export interface playState {
  playVoiceData: any
  playStatusData: any
  playSubscriptionTask: any
}
export const usePlayStore = defineStore({
    id: 'play_center',
    state: (): playState => ({
        playVoiceData: [],
        playStatusData: {},
        playSubscriptionTask: {}
    }),
    actions: {
        setPlayVoice(data: any) {
            this.playVoiceData = data || []
            console.log(this.playVoiceData)
        },
        setPlayStatus(data: any) {
            this.playStatusData = data
        },
        setPlayTaskStatus(data: any) {
            this.playSubscriptionTask = data
        }
    },
})
