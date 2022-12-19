interface TTSParams<T = any> {
  allTTS: T;
  allAudioCard: T;
}

export const useTTSStore = defineStore({
  id: "TTS",
  state: (): TTSParams => {
    return {
      allTTS: [], // 所有TTS数据
      allAudioCard: [], // 所有服务器声卡数据
    };
  },
  actions: {
    // 更新TTS数据
    updateTTS(data: any[]) {
      this.allTTS = [];
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.allTTS.push({
            id: item.EngineIndex,
            name: item.EngineName,
          });
        });
      }
    },
    // 更新服务器声卡数据
    updateAudioCard(data: any[]) {
      this.allAudioCard = [];
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.allAudioCard.push({
            id: item,
            name: item,
          });
        });
      }
    },
    // 清除TTS数据
    clearTTS() {
      this.allTTS = [];
      this.allAudioCard = [];
    },
  },
});
