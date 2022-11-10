import { useAppStore } from "./app";
import { useUserStore } from "./user";
import { useUploadStore } from "./upload_manager";
import { useSystemStore } from "./system_config";
import { useTerminalStore } from "./terminal";
import { usePlayStore } from "./play_center";

const getStore = {
  useAppStore,
  useUserStore,
  useUploadStore,
  useSystemStore,
  useTerminalStore,
  usePlayStore
};

export default getStore;
