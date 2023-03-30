import { useAppStore } from "./app";
import { useLanguageStore } from "./language";
import { useUserStore } from "./user";
import { useSessionStore } from "./session";
import { useUploadStore } from "./upload_manager";
import { useSystemStore } from "./system_config";
import { useTerminalsStore } from "./terminals";
import { usePlayStore } from "./play_center";
import { useTTSStore } from "./tts";

const getStore = {
  useAppStore,
  useLanguageStore,
  useUserStore,
  useSessionStore,
  useUploadStore,
  useSystemStore,
  useTerminalsStore,
  usePlayStore,
  useTTSStore,
};

export default getStore;
