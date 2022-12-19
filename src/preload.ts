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
];
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data?: any) => {
    // whitelist channels
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
});
