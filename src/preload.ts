import { contextBridge, ipcRenderer } from "electron";
const validChannels = [
  "login-window",
  "main-window",
  "resize",
  "setFullScreen",
  "register-window",
  "open-devtools",
  "close",
  "minimize",
  "maximize",
  "unmaximize",
  "will-download",
  "download",
  "done",
  "updated",
  "download-progress",
  "download-done",
  "download-cancell",
  "download-failed",
  "register-close",
  "register-success"
];
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data?: any) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel: string, callback: (arg0: any) => any) => {
    if (validChannels.includes(channel)) {
      // Filtering the event param from ipcRenderer
      const newCallback = (_: any, data: any) => callback(data);
      ipcRenderer.on(channel, newCallback);
    }
  },
  sendToHost: (channel: string, data?: any) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.sendToHost(channel, data);
    }
  },
  once: (channel: string, callback: (arg0: any) => any) => {
    if (validChannels.includes(channel)) {
      // Filtering the event param from ipcRenderer
      const newCallback = (_: any, data: any) => callback(data);
      ipcRenderer.once(channel, newCallback);
    }
  },
  postMessage: (channel: string, message?: string) => {
    if (validChannels.includes(channel)) {
      if (validChannels.includes(channel)) {
        ipcRenderer.postMessage(channel, message);
      }
    }
  },
  handleRegisterSuccess: (callback: any) => {
    ipcRenderer.removeListener('register-success',callback)
    ipcRenderer.on('register-success', callback)
  }
});
