// import { message } from '@/utils/resetMessage'

import router from "../router";
import { ElMessage } from "element-plus";

let loginData: any = ""; //用于储存登录时请求信息
let socket: any;
let reloadInterval: any;
let connected = false;
let connecting = false;
let remotePlayTaskKey: any[] = [];
let is_login = true;

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
            // getStore.useSystemStore().getConfigInfo()
            //初始化请求数据
            if (is_login) {
                // send(loginData);
                // getStore.useAppStore().changeLoginStatus(false);
                requestTaskInfo();
                requestTerminalInfo();
                getTtsEngine();
            } else {
                initRequest();
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
        if (data.data.TaskType === 15 && !remotePlayTaskKey.includes(data.data.TaskID)) { //远程播放任务（截取TaskID，返回连接成功后发起播放）
            remotePlayTaskKey.push(data.data.TaskID)
        }
        getStore.useAppStore().taskLocalKeyRecord(data.data.TaskID)
        socket.send(JSON.stringify(data));
    };
}
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
    // return
    is_login = false;
    registerWebSocket();
};

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
const getTtsEngine = () => {
    const data = {
        company: "BL",
        actioncode: "c2ms_get_tts_engine_info",
        data: {},
        result: 0,
        return_message: "",
    };
    send(data);
};
// 发起远程音乐播放任务
const startRemotePlay = (row: any) => {
    console.log(remotePlayTaskKey, row.TaskID);
    if (remotePlayTaskKey.includes(row.TaskID)) {
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
    const msgMap = new Map([
        [
            'terminal_status', () => {
            getStore.useTerminalStore().getTerminalData(msg.data)
        }],
        [
            "terminals_group_info",
            () => {
                getStore.useTerminalStore().getTerminalGroup(msg.data);
            },
        ],
        [
            'task_stop',
            ()=> {
                getStore.useAppStore().taskPushStop(msg.data);
            }
        ],
        [
            'task_status',
            ()=> {
                getStore.useAppStore().taskDataPush(msg.data.TaskInfoArray);
            }
        ]
    ]);
    if (msg.result !== 200) {
        if (msg.actioncode === "ms2c_user_login") {
            //登录失败
            getStore.useAppStore().changeLoginStatus(false);
            socket.close();
        }
        return ElMessage.error(msg.return_message);
    }
    if (msg.actioncode === 'cs2ms_net_disconnect') {
        return ElMessage.error('服务器连接失败');
    }
    if (msg.actioncode === "ls2c_set_terminal_volume") {
        getStore.useTerminalStore().setTerminalVolume(msg.data);
    }
    if (msg.actioncode === "ls2c_broadcast_task") {
        //
    }
    switch (msg.actioncode) {
        case "ms2c_user_login": //登录返回信息
            is_login = true
            localStorage.set("userToken", msg.token)
            requestTaskInfo()
            requestTerminalInfo()
            return getStore.useAppStore().loginSuccessData(msg);
        case "ms2c_push_msg":
            [...msgMap].forEach(([key, value]) => {
                msg.data.EventID === key ? value.call(msg.data) : "";
            });
            return;
        case "ms2c_get_task_status": //返回执行中的任务
            getStore.useAppStore().ROUTER_TASK(msg.data.TaskInfoArray);
            return;
        case "ms2c_get_server_terminals_status": //所有终端状态
            getStore.useTerminalStore().getTerminalData(msg.data);
            return;
        case "ms2c_get_tts_engine_info": //播放语音(TTS引擎)
            getStore.usePlayStore().setPlayVoice(msg.data.TTSEngineInfo)
            return
        case 'ms2c_get_task_play_status': //客户端任务播放状态
            getStore.usePlayStore().setPlayStatus(msg.data)
            return
        case 'ms2c_create_server_task':
            startRemotePlay(msg.data)
            return
    }
};

export {
  // 暴露出去,方便调用
  socket,
  socketLogin,
  registerWebSocket,
  send,
};
