// import { message } from '@/utils/resetMessage'
import router from "../router";
import { ElMessage } from "element-plus";
import { Md5 } from "ts-md5";

let loginData: any = ""; //用于储存登录时请求信息
let socket: any;
let reloadInterval: any;
let connected = false;
let connecting = false;
const isLogin = false; //是否在登录页面
const baseParams: any = {
  company: "BL",
  actioncode: "action_code",
  data: {},
};

const registerWebSocket = async () => {
  const socketStatus = !socket || socket.readyState !== 1;
  if (socketStatus && !connected && !connecting) {
    connected = false;
    connecting = true;
    const WbakUrl = sessionStorage.getItem("websocketUrl") || "";
    socket = new WebSocket(WbakUrl);
    //WebSocket连接成功
    socket.onopen = () => {
      connecting = false;
      connected = true;
      getStore.useAppStore().changeWsStatus(true);
      //初始化请求数据
      if (getStore.useAppStore().is_login) {
        send(loginData);
        getStore.useAppStore().changeLoginStatus(false);
        requestTaskInfo();
        requestTerminalInfo();
      } else {
        initRequest();
        requestTaskInfo();
        requestTerminalInfo();
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
    console.log(data);
    if (data.actioncode !== "c2ms_user_login") {
      data["token"] = localStorage.get("userToken");
    }
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
// 登录协议
const socketLogin = (data: any) => {
  sessionStorage.setItem(
    "websocketUrl",
    "ws://" + "172.16.21.119" + ":51330/socket"
  );

  const myDate = new Date();
  const a = myDate.getFullYear();
  const b = myDate.getMonth() + 1;
  const c = myDate.getDate();
  const d = myDate.getHours();
  const e = myDate.getMinutes();
  const f = myDate.getSeconds();
  data.data.LoginTime = a + "-" + b + "-" + c + " " + d + ":" + e + ":" + f;

  loginData = data;
  // return
  registerWebSocket();
};
//获取站点数据
const initRequest = () => {
  login();
};
// 获取所有终端状态
const requestTerminalInfo = () => {
  const data = {
    company: "BL",
    actioncode: "c2ms_get_server_terminals_status",
    token: "",
    data: {},
    result: 0,
    return_message: "",
  };
  send(data);
};
// 获取所有任务信息
const requestTaskInfo = () => {
  const data = {
    company: "BL",
    actioncode: "c2ms_get_task_status",
    token: "",
    data: {},
    result: 0,
    return_message: "",
  };
  send(data);
};
// 登录
const login = () => {
  const data = {
    company: "BL",
    actioncode: "c2ms_user_login",
    token: "",
    data: {
      UserName: localStorage.get("username"),
      Password: Md5.hashStr(localStorage.get("password")),
      Platform: "PC",
      HostIP: localStorage.get("serverIP"),
      ForceLogin: false,
      LoginTime: "",
    },
    result: 0,
    return_message: "",
  };
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
  const msgMap = new Map([
    // ['terminal_status', () => {
    //     getStore.useTerminalStore().getTerminalData(msg.data)
    // }],
    ["refresh_endpoint_status", () => {}],
    [
      "terminals_group_info",
      () => {
        getStore.useTerminalStore().getTerminalGroup(msg.data);
      },
    ],
  ]);
  if (msg.result !== 200) {
    if (msg.actioncode === "ls2c_user_login") {
      //登录失败
      getStore.useAppStore().changeLoginStatus(false);
      socket.close();
    }
    return ElMessage.error(msg.return_message);
  }
  if (msg.actioncode === "ls2c_set_terminal_volume") {
    getStore.useTerminalStore().setTerminalVolume(msg.data);
  }
  if (msg.actioncode === "ls2c_broadcast_task") {
    //
  }
  switch (msg.actioncode) {
    case "ms2c_user_login": //登录返回信息
      return getStore.useAppStore().loginSuccessData(msg);
    case "ms2c_push_msg":
      [...msgMap].forEach(([key, value]) => {
        msg.data.EventID === key ? value.call(msg.data) : "";
      });
      return;
    case "ms2c_get_task_status": //返回执行中的任务
      getStore.useAppStore().ROUTER_TASK(msg.data.TaskInfoArray);
      return;
    case "task_status": //任务数据推送
      getStore.useAppStore().taskDataPush(msg.data.TaskInfoArray);
      return;
    case "task_stop": //任务数据推送
      getStore.useAppStore().taskPushStop(msg.data.TaskID);
      return;
    case "ms2c_get_server_terminals_status": //所有终端状态
      getStore.useTerminalStore().getTerminalData(msg.data);
      return;
  }
};

export {
  // 暴露出去,方便调用
  socket,
  socketLogin,
  registerWebSocket,
  send,
};
