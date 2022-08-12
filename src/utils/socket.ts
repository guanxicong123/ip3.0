
// import { message } from '@/utils/resetMessage'
// import useAppStore from '../store/app'
import router from '../router'
import { ElMessage } from 'element-plus'

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
    console.log(socketStatus, connected, connecting)
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
            console.log('关闭了')
            console.log(useAppStore().is_login)
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
// 登录协议
const socketLogin = (data: any) => {
    sessionStorage.setItem('websocketUrl', 'ws://' + data.data.HostIP + ':51330/ws')
    
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
const send  = (data: any) => {
    let connected = socket && socket.readyState === 1
    if (connected) {
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

const handlerMsg = (msg:any) => {
    let msgMap = new Map([
        ['terminal_status', () => {
            useTerminalStore().getTerminalData(msg.data)
        }],
        ['refresh_endpoint_status', () => {
            
        }],
        ['terminals_group_info', () => {
            useTerminalStore().updateTerminalGroup(msg.data)
        }]
    ])
    // console.log('msg', msg)
    if (msg.result !== 200) {
        if (msg.actioncode === 'ls2c_user_login') { //登录失败
            useAppStore().changeLoginStatus(false)
            socket.close()
        }
        return ElMessage.error(msg.return_message)
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