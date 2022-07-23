export interface IElectronAPI {
  send: (channel, data?) => Promise<void>;
  on: (channel, callback?) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
