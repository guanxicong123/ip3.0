import i18n from "@/utils/language";

const $t: any = i18n.global;

const useConfig = {
  shortcuts: [
    {
      text: $t.t("Today"),
      value: () => {
        const end = new Date();
        const start = new Date(new Date().toLocaleDateString()); //获取当前时间戳（精确到秒）
        start.setTime(start.getTime());
        return [start, end];
      },
    },
    {
      text: $t.t("Last day"),
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        return [start, end];
      },
    },
    {
      text: $t.t("Last three days"),
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        return [start, end];
      },
    },
    {
      text: $t.t("Last week"),
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: $t.t("Last month"),
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
    {
      text: $t.t("Last three month"),
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ],
  groupConfig: {
    iconfont: "icon-grade", // 字体图标
    iconTitle: $t.t("View group"), // icon title
    tableTitle: $t.t("Group"), // 表格顶部 title
    searchPlaceholder: $t.t("Group name"), // 搜索框 placeholder
    showTableColumn: [
      { prop: "name", label: $t.t("Group name") },
      { prop: "call_code", label: $t.t("Call code") },
    ], // 显示的表格列
  },
  mediaConfig: {
    iconfont: "icon-music", // 字体图标
    iconTitle: $t.t("View media files"), // icon title
    tableTitle: $t.t("Media files"), // 表格顶部 title
    searchPlaceholder: $t.t("Name"), // 搜索框 placeholder
    showTableColumn: [{ prop: "name", label: $t.t("Name") }], // 显示的表格列
  },
  mediaFolderConfig: {
    iconfont: "icon-media-folder", // 字体图标
    iconTitle: $t.t("View media folder"), // icon title
    tableTitle: $t.t("Media folder"), // 表格顶部 title
    searchPlaceholder: $t.t("Name"), // 搜索框 placeholder
    showTableColumn: [{ prop: "name", label: $t.t("Name") }], // 显示的表格列
  },
  webSocketIDMap: {
    // 注册结果
    c2ms_get_register_result: "c2ms_get_register_result",
    ms2c_get_register_result: "ms2c_get_register_result",
    // 机器码
    c2ms_get_machine_code: "c2ms_get_machine_code",
    ms2c_get_machine_code: "ms2c_get_machine_code",
    // 服务器网卡IP地址
    c2ms_get_server_network_ip: "c2ms_get_server_network_ip",
    ms2c_get_server_network_ip: "ms2c_get_server_network_ip",
    // 软件注册
    c2ms_register_platform: "c2ms_register_platform",
    ms2c_register_platform: "ms2c_register_platform",
    // 心跳
    c2ms_websocket_heart: "c2ms_websocket_heart",
    ms2c_websocket_heart: "ms2c_websocket_heart",
    // ws重连
    c2ms_net_reconnect: "c2ms_net_reconnect",
    ms2c_net_reconnect: "ms2c_net_reconnect",
    // 退出登陆
    c2ms_user_logout: "c2ms_user_logout",
    // 终端信息
    c2ms_get_server_terminals_status: "c2ms_get_server_terminals_status",
    ms2c_get_server_terminals_status: "ms2c_get_server_terminals_status",
    // 任务信息
    c2ms_get_task_status: "c2ms_get_task_status",
    ms2c_get_task_status: "ms2c_get_task_status",
    // TTS引擎信息
    c2ms_get_tts_engine_info: "c2ms_get_tts_engine_info",
    ms2c_get_tts_engine_info: "ms2c_get_tts_engine_info",
    // 声卡信息
    c2ms_get_server_audiocard_info: "c2ms_get_server_audiocard_info",
    ms2c_get_server_audiocard_info: "ms2c_get_server_audiocard_info",
    // 任务播放状态
    c2ms_get_task_play_status: "c2ms_get_task_play_status",
    ms2c_get_task_play_status: "ms2c_get_task_play_status",
    // 服务器状态
    c2ms_get_service_status: "c2ms_get_service_status",
    ms2c_get_service_status: "ms2c_get_service_status",
    // 创建服务器任务
    c2ms_create_server_task: "c2ms_create_server_task",
    ms2c_create_server_task: "ms2c_create_server_task",
    // 控制任务功能
    c2ms_control_task: "c2ms_control_task",
    ms2c_control_task: "ms2c_control_task",
    // 执行快捷任务
    c2ms_execute_shortcut_task: "c2ms_execute_shortcut_task",
    ms2c_execute_shortcut_task: "ms2c_execute_shortcut_task",
    // 任务中移除终端
    c2ms_remove_terminals_from_task: "c2ms_remove_terminals_from_task",
    ms2c_remove_terminals_from_task: "ms2c_remove_terminals_from_task",
    // 设置任务音量
    c2ms_set_task_volume: "c2ms_set_task_volume",
    ms2c_set_task_volume: "ms2c_set_task_volume",
    // 设置终端EQ
    c2ms_set_endpoint_eq: "c2ms_set_endpoint_eq",
    ms2c_set_endpoint_eq: "ms2c_set_endpoint_eq",
    // 设置终端音量
    c2ms_set_terminal_volume: "c2ms_set_terminal_volume",
    ms2c_set_terminal_volume: "ms2c_set_terminal_volume",
    // 任务监听
    c2ms_monitor_task: "c2ms_monitor_task",
    ms2c_monitor_task: "ms2c_monitor_task",
    // 停止任务
    c2ms_stop_task: "c2ms_stop_task",
    ms2c_stop_task: "ms2c_stop_task",
    // 订阅播放进度
    c2ms_subscribe_task_progress_bar: "c2ms_subscribe_task_progress_bar",
    ms2c_subscribe_task_progress_bar: "ms2c_subscribe_task_progress_bar",
    // 取消订阅播放进度
    c2ms_unsubscribe_task_progress_bar: "c2ms_unsubscribe_task_progress_bar",
    ms2c_unsubscribe_task_progress_bar: "ms2c_unsubscribe_task_progress_bar",
    // 结束所有考试模式
    c2ms_stop_endpoints_exam_mode: "c2ms_stop_endpoints_exam_mode",
    // 任务提醒
    c2ms_get_pending_task_info: "c2ms_get_pending_task_info",
    ms2c_get_pending_task_info: "ms2c_get_pending_task_info",
    // 服务器主动推送-消息ID为 ms2c_push_msg
    // 注册信息
    register_info: "register_info",
    // 停止任务通知
    task_stop: "task_stop",
    // 任务实时状态
    task_status: "task_status",
    // 终端实时状态
    terminal_status: "terminal_status",
    // 终端删除通知
    terminal_delete: "terminal_delete",
    // 用户删除通知
    user_delete: "user_delete",
    // 用户强制下线通知
    user_force_logout: "user_force_logout",
    // 服务器声卡信息
    soundcard_info: "soundcard_info",
    // 7770采集分区实时状态
    terminal_7770led_status: "terminal_7770led_status",
    // 分区功放任务运行状态
    zone_task_status: "zone_task_status	",
    // 终端固件升级实时状态
    terminal_firmware_update_status: "terminal_firmware_update_status	",
    // 响应订阅播放进度信息
    task_progress_bar_info: "task_progress_bar_info",
  },
};

export default useConfig;
