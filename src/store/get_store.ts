import { useAppStore } from "./app";
import { useUserStore } from "./user";
import { useUploadStore } from "./upload_manager";
import { useSystemStore } from "./system_config";
import { useTerminalStore } from "./terminal";

const getStore = {
  useAppStore,
  useUserStore,
  useUploadStore,
  useSystemStore,
  useTerminalStore,
};

export default getStore;
