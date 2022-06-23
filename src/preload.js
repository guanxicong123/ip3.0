import { contextBridge, ipcRenderer, BrowserWindow } from "electron";
console.log(__dirname)
contextBridge.exposeInMainWorld("electronAPI", {
    ipcRenderer,
})