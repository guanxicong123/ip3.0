// import { message } from '@/utils/resetMessage'

import router from "../router";
import { ElMessage, ElNotification } from "element-plus";

let loginData: any = ""; //用于储存登录时请求信息
let socket: any;
let reloadInterval: any;
let connected = false;
let connecting = false;
let remotePlayTaskKey: any[] = [];
let is_login = true; //是否处于登录状态
const baseParams = {
  company: "BL",
  actioncode: "c2ms_net_reconnect",
  token: "",
  data: {},
  result: 0,
  return_message: "",
};

const registerWebSocket = async () => {
  const socketStatus = !socket || socket.readyState !== 1;
  if (socketStatus && !connected && !connecting) {
    connected = false;
    connecting = true;
    const WbakUrl = "ws://127.0.0.1:9999/socket";
    // const WbakUrl = "ws://172.16.21.124:9999/socket";
    socket = new WebSocket(WbakUrl);
    //WebSocket连接成功
    socket.onopen = () => {
      connecting = false;
      connected = true;
      getStore.useAppStore().changeWsStatus(true);
      //初始化请求数据
      if (is_login) {
        initRequest();
        getStore.useSystemStore().getConfigInfo(); //获取系统配置
        getStore.useSystemStore().getPrioritySetting(); //获取系统优先级3333
      } else {
        login();
      }
    };
    //WebSocket通知
    socket.onmessage = ({ data }: any) => {
      try {
        const msg = JSON.parse(data);
        handlerMsg(msg);
      } catch (e) {
        console.log(e);
      }
    };
    //WebSocket异常
    socket.onerror = () => {
      if (getStore.useAppStore().is_login) return;
      clearInterval(reloadInterval);
      reload();
      connecting = false;
      connected = false;
      getStore.useAppStore().changeWsStatus(false);
    };
    //WebSocket关闭
    socket.onclose = () => {
      if (getStore.useAppStore().is_login) {
        connecting = false;
        connected = false;
        getStore.useAppStore().changeWsStatus(false);
        getStore.useAppStore().changeLoginStatus(false);
        ElMessage.error("服务连接失败");
        return;
      }
      clearInterval(reloadInterval);
      connecting = false;
      connected = false;
      getStore.useAppStore().changeWsStatus(false);
      if (router.currentRoute.value.fullPath !== "/") {
        //登陆页面主动断开不重连
        reload();
      }
    };
  }
};
const send = (data: any) => {
  const connected = socket && socket.readyState === 1;
  if (connected) {
    if (data.actioncode !== "c2ms_user_login") {
      data["token"] = localStorage.get("userToken");
    }
    if (
      data.data.TaskType === 15 &&
      !remotePlayTaskKey.includes(data.data.TaskID)
    ) {
      //远程播放任务（截取TaskID，返回连接成功后发起播放）
      remotePlayTaskKey.push(data.data.TaskID);
    }
    getStore.useSessionStore().taskLocalKeyRecord(data.data.TaskID);
    socket.send(JSON.stringify(data));
  }
};
const reload = () => {
  reloadInterval = setTimeout(() => {
    const socketStatus = !socket || socket.readyState !== 1;
    socketStatus && registerWebSocket();
    // message.error("服务器连接断开")
  }, 3000);
};
// 初始化ws连接
const socketLogin = (data: any) => {
  const myDate = new Date();
  const a = myDate.getFullYear();
  const b = myDate.getMonth() + 1;
  const c = myDate.getDate();
  const d = myDate.getHours();
  const e = myDate.getMinutes();
  const f = myDate.getSeconds();
  data.data.LoginTime = a + "-" + b + "-" + c + " " + d + ":" + e + ":" + f;

  loginData = data;
  is_login = false;
  registerWebSocket();
};

const initRequest = () => {
  const token = localStorage.get("userToken");
  const requestData = [
    "c2ms_net_reconnect",
    "c2ms_get_register_status",
    "c2ms_get_service_status",
    "c2ms_get_server_terminals_status",
    "c2ms_get_task_status",
    "c2ms_get_tts_engine_info",
    "c2ms_get_server_audiocard_info",
  ];
  if (token) {
    requestData.forEach((item) => {
      requestFunction(item);
    });
  }
};
// webSocket请求获取XX信息状态
const requestFunction = (actionCode: string) => {
  baseParams.actioncode = actionCode;
  baseParams.data = {};
  return send(baseParams);
};
// 发起远程音乐播放任务
const startRemotePlay = (row: any) => {
  if (
    remotePlayTaskKey.includes(row.TaskID) &&
    row.RemoteType !== "manual_alarm"
  ) {
    const data = {
      company: "BL",
      actioncode: "c2ms_control_task",
      token: "",
      data: {
        TaskID: row.TaskID,
        ControlCode: "play",
        ControlValue: "",
      },
      result: 0,
      return_message: "",
    };
    send(data);
    remotePlayTaskKey = remotePlayTaskKey.filter((item: any) => {
      return item !== row.TaskID;
    });
  }
};
// 登录
const login = () => {
  const data = loginData;
  const myDate = new Date();
  const a = myDate.getFullYear();
  const b = myDate.getMonth() + 1;
  const c = myDate.getDate();
  const d = myDate.getHours();
  const e = myDate.getMinutes();
  const f = myDate.getSeconds();
  data.data.LoginTime = a + "-" + b + "-" + c + " " + d + ":" + e + ":" + f;
  send(data);
};
const handlerMsg = (msg: any) => {
  // 服务器主动推送的更新数据
  const msgMap = new Map([
    [
      "task_progress_bar_info", //播放中心订阅模式
      () => {
        getStore.usePlayStore().setPlayTaskStatus(msg.data.report);
      },
    ],
    [
      "terminal_status",
      () => {
        getStore.useTerminalStore().getTerminalData(msg.data);
        getStore.useTerminalsStore().updateTerminals(msg.data.EndPointsArray);
      },
    ],
    [
      "terminal_delete",
      () => {
        getStore.useTerminalsStore().removeTerminals(msg.data.EndPointsArray);
      },
    ],
    [
      "terminals_group_info",
      () => {
        getStore.useTerminalStore().getTerminalGroup(msg.data);
      },
    ],
    [
      "task_stop",
      () => {
        getStore.useSessionStore().removeSession(msg.data);
      },
    ],
    [
      "task_status",
      () => {
        getStore.useSessionStore().updateSession(msg.data.TaskInfoArray);
      },
    ],
  ]);
  if (msg.result !== 200) {
    // 登录失败
    if (msg.actioncode === "ms2c_user_login") {
      getStore.useAppStore().changeLoginStatus(false);
      socket.close();
    }
    return ElMessage.error(msg.return_message);
  }
  if (msg.actioncode === "cs2ms_net_disconnect") {
    return ElNotification({
      title: "",
      message: "正在尝试重新连接逻辑服务器",
      type: "error",
      position: "bottom-right",
    });
  }
  if (msg.actioncode === "ls2c_set_terminal_volume") {
    getStore.useTerminalStore().setTerminalVolume(msg.data);
  }
  // 前端主动发起请求，响应后的返回数据
  switch (msg.actioncode) {
    case "ms2c_user_login": // 登录返回信息
      is_login = true;
      localStorage.set("userToken", msg.token);
      requestFunction("c2ms_get_task_status");
      requestFunction("c2ms_get_server_terminals_status");
      initRequest();
      getStore.useAppStore().loginSuccessData(msg);
      break;
    case "ms2c_push_msg":
      [...msgMap].forEach(([key, value]) => {
        msg.data.EventID === key ? value.call(msg.data) : "";
      });
      break;
    case "ms2c_get_task_status": // 返回执行中的任务
      getStore.useSessionStore().updateSession(msg.data.TaskInfoArray);
      break;
    case "ms2c_get_server_terminals_status": // 所有终端状态
      getStore.useTerminalStore().getTerminalData(msg.data);
      getStore.useTerminalsStore().updateTerminals(msg.data.EndPointsArray);
      break;
    case "ms2c_get_tts_engine_info": // 播放语音(TTS引擎)
      getStore.usePlayStore().setPlayVoice(msg.data.TTSEngineInfo);
      getStore.useTTSStore().updateTTS(msg.data.TTSEngineInfo);
      break;
    case "ms2c_get_server_audiocard_info":
      getStore.useTTSStore().updateAudioCard(msg.data.AudioCard);
      break;
    case "ms2c_get_task_play_status": // 客户端任务播放状态
      getStore.usePlayStore().setPlayStatus(msg.data);
      break;
    case "ms2c_create_server_task":
      startRemotePlay(msg.data);
      break;
    case "ms2c_control_task": // 播放中心任务状态改变
      break;
    case "cs2ms_net_reconnect": // 服务器重连
      initRequest();
      break;
    case "ms2c_stop_task":
      getStore.useSessionStore().removeSession(msg.data);
      break;
  }
};

export {
  // 暴露出去,方便调用
  socket,
  socketLogin,
  registerWebSocket,
  send,
};
