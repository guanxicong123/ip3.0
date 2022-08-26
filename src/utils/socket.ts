
// import { message } from '@/utils/resetMessage'
// import useAppStore from '../store/app'
import router from '../router'
import { ElMessage } from 'element-plus'
import { Md5 } from 'ts-md5'

let loginData: any = ''; //用于储存登录时请求信息
let socket: any;
let reloadInterval : any;
let connected: boolean = false;
let connecting: boolean = false;
let isLogin: boolean = false; //是否在登录页面
let baseParams: any = {
    company: "BL",
    actioncode: "action_code",
    data: {},
}

const registerWebSocket = async () => {
    const socketStatus = !socket || socket.readyState !== 1
    if (socketStatus && !connected && !connecting) {
        connected = false
        connecting = true
        let WbakUrl = sessionStorage.getItem('websocketUrl') || ''
        socket = new WebSocket(WbakUrl)
        //WebSocket连接成功
        socket.onopen = () => {
            connecting = false
            connected = true
            useAppStore().changeWsStatus(true)
            //初始化　请求数据
            if (useAppStore().is_login) {
                send(loginData)
                useAppStore().changeLoginStatus(false)
            }else {
                initRequest()
            }
        }
        //WebSocket通知
        socket.onmessage = ({data}: any)=>{
            try {
                let msg = JSON.parse(data)
                handlerMsg(msg)
            } catch (e) {
                console.log(e)
            }
        }
        //WebSocket异常
        socket.onerror = ()=>{
            if (useAppStore().is_login) return
            clearInterval(reloadInterval)
            reload()
            connecting = false
            connected = false
            useAppStore().changeWsStatus(false)
        }
        //WebSocket关闭
        socket.onclose = ()=>{
            if (useAppStore().is_login) {
                connecting = false
                connected = false
                useAppStore().changeWsStatus(false)
                useAppStore().changeLoginStatus(false)
                ElMessage.error('服务连接失败')
                return
            }
            clearInterval(reloadInterval)
            connecting = false
            connected = false
            useAppStore().changeWsStatus(false)
            if (router.currentRoute.value.fullPath !=='/') { //登陆页面主动断开不重连
                reload()
            }
        }
    }
}
const send  = (data: any) => {
    let connected = socket && socket.readyState === 1
    if (connected) {
        if (data.actioncode !== 'c2ls_user_login') {
            data['token'] = localStorage.get("userToken")
        }
        socket.send(JSON.stringify(data))
    }
}

const reload = () => {
    reloadInterval = setTimeout(() => {
        let socketStatus = !socket || socket.readyState !== 1
        socketStatus && registerWebSocket()
        // message.error("服务器连接断开")
    }, 3000)
}
// 登录协议
const socketLogin = (data: any) => {
    sessionStorage.setItem('websocketUrl', 'ws://' + '172.16.21.126' + ':51330/socket')
    
    let myDate = new Date();
    let a = myDate.getFullYear()
    let b = myDate.getMonth() + 1
    let c = myDate.getDate()
    let d = myDate.getHours()
    let e = myDate.getMinutes()
    let f = myDate.getSeconds()
    data.data.LoginTime = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f

    loginData = data
    // return
    registerWebSocket()
}
//获取站点数据
const initRequest = () => {
    login()
}
// 获取所有终端状态
const requestTaskInfo = () => {
    let data = {
        company: "BL",
        actioncode: "c2ms_get_server_terminals_status",
        token: "",
        data: {},
        result: 0,
        return_message: ""
    }
    send(data)
}
// 登录
const login = () => {
    let data = {
        company: "BL",
        actioncode: "c2ls_user_login",
        token: "",
        data: {
            "UserName": localStorage.get("username"),
            "Password": Md5.hashStr(localStorage.get("password")),
            "Platform": "PC",
            "HostIP": localStorage.get("serverIp"),
            "ForceLogin": false,
            "LoginTime": ''
        },
        result: 0,
        return_message: ""
    }
    let myDate = new Date();
    let a = myDate.getFullYear()
    let b = myDate.getMonth() + 1
    let c = myDate.getDate()
    let d = myDate.getHours()
    let e = myDate.getMinutes()
    let f = myDate.getSeconds()
    data.data.LoginTime = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f

    send(data)
};
const handlerMsg = (msg:any) => {
    let msgMap = new Map([
        ['terminal_status', () => {
            useTerminalStore().getTerminalData(msg.data)
        }],
        ['refresh_endpoint_status', () => {
            
        }],
        ['terminals_group_info', () => {
            useTerminalStore().getTerminalGroup(msg.data)
        }]
    ])
    if (msg.result !== 200) {
        if (msg.actioncode === 'ls2c_user_login') { //登录失败
            useAppStore().changeLoginStatus(false)
            socket.close()
        }
        return ElMessage.error(msg.return_message)
    }
    if (msg.actioncode === 'ls2c_set_terminal_volume') {
        useTerminalStore().setTerminalVolume(msg.data)
    }
    if (msg.actioncode === 'ls2c_broadcast_task') {

    }
    switch(msg.actioncode) {
        case 'ls2c_user_login': //登录返回信息
            return useAppStore().loginSuccessData(msg.data)
        case 'ls2c_push_msg': 
            [...msgMap].forEach(([key, value]) => {
                msg.data.EventID === key ? value.call(msg.data) : ''
            })
    }
}

export {
    // 暴露出去,方便调用
    socket,
    socketLogin,
    registerWebSocket,
    send
}