import { App } from "vue";

import selectTerminalsGroups from "@/components/select_components/select_terminals_groups.vue";
import selectMediaGroup from "@/components/select_components/select_media_group.vue";
import selectSoundSourceCollectionRadio from "@/components/select_components/select_sound_source_collection_radio.vue";
import selectShortcutSoundSourceRadio from "@/components/select_components/select_shortcut_sound_source_radio.vue";
import selectShortcutTerminalRadio from "@/components/select_components/select_shortcut_terminal_radio.vue";
import selectTerminalsRadio from "@/components/select_components/select_terminals_radio.vue";
import selectGroupRadio from "@/components/select_components/select_group_radio.vue";
import selectMediaRadio from "@/components/select_components/select_media_radio.vue";

import soundSourceSettings from "@/components/configura_components/sound_source_settings.vue";
import terminalSettings from "@/components/configura_components/terminal_settings.vue";
import dateSettings from "@/components/configura_components/date_setting.vue";
import restrictDialing from "@/components/configura_components/restrict_dialing.vue";

import viewComponentsPopover from "@/components/view_components/index.vue";

const registerComponents = {
  install: (app: App<Element>) => {
    app.component("select-terminals-groups", selectTerminalsGroups); // 选择终端/分组组件
    app.component("select-media-group", selectMediaGroup); // 选择媒体/分组组件
    app.component(
      "select-sound-source-collection-radios",
      selectSoundSourceCollectionRadio
    ); // 选择音源采集
    app.component(
      "select-shortcut-sound-source-radio",
      selectShortcutSoundSourceRadio
    ); // 选择快捷音源
    app.component(
      "select-shortcut-terminal-radios",
      selectShortcutTerminalRadio
    ); // 选择快捷终端
    app.component("select-terminals-radio", selectTerminalsRadio); // 选择单个终端
    app.component("select-group-radio", selectGroupRadio); // 选择单个分组
    app.component("select-media-radio", selectMediaRadio); // 选择单个媒体
    app.component("sound-source-settings", soundSourceSettings); // 音源设置
    app.component("terminal-settings", terminalSettings); // 终端设置
    app.component("date-settings", dateSettings); // 日期设置
    app.component("restrict-dialing", restrictDialing); // 限制拨号终端
    app.component("view-components-popover", viewComponentsPopover); // 查看popover组件
  },
};

export default registerComponents;
