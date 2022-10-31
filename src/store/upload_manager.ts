interface UploadParams<T = any> {
  showUploadManager: boolean;
  isMinimize: boolean;
  isUploadCompleted: boolean;
  groupData: T;
  currentSelected: T;
}

export const useUploadStore = defineStore({
  id: "upload",
  state: (): UploadParams => {
    return {
      showUploadManager: false, // 上传管理器-是否显示
      isMinimize: false, // 上传管理器-是否最小化
      isUploadCompleted: false, // 上传管理器-是否上传完成
      groupData: [], // 上传管理器-选择上传的媒体文件夹
      currentSelected: {}, // 上传管理器-当前选中项
    };
  },
  actions: {
    // 更新显示上传管理器状态
    updateShowUploadManager(data: boolean) {
      this.showUploadManager = data;
    },
    // 更新显示上传管理器最小化状态
    updateUploadManagerIsMinimize(data: boolean) {
      this.isMinimize = data;
    },
    // 更新显示上传管理器上传完成状态
    updateUploadCompleted(data: boolean) {
      this.isUploadCompleted = data;
    },
    // 上传管理器-添加媒体文件夹
    addGroupData(data: any) {
      const arr = [];
      for (let index = 0; index < this.groupData.length; index++) {
        const item = this.groupData[index];
        arr.push(item.id);
      }
      if (!arr.includes(data.id)) {
        this.groupData.push(data);
      }
    },
    // 上传管理器-移除媒体文件夹
    removeGroupData(id: number) {
      this.groupData = this.groupData.filter((item: { id: number }) => {
        return item.id != id;
      });
    },
    // 上传管理器-清空媒体文件夹
    clearGroupData() {
      this.groupData = [];
    },
    // 更新当前选中项
    updateCurrentSelected(data: any) {
      this.currentSelected = data;
    },
  },
});
