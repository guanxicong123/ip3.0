
// import store from '@/store';
// import { message } from '@/utils/resetMessage'
const router = useRouter()

let loginData: any = '';
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
        console.log('初始化')
        let WbakUrl = sessionStorage.getItem('websocketUrl') || ''
        socket = new WebSocket(WbakUrl)
        //WebSocket连接成功
        socket.onopen = () => {
            console.log('成功了')
            connecting = false
            connected = true
            // store.commit('CHANGE_WEBSCOET', true)
            //初始化　请求数据
            if (isLogin) {
                console.log(loginData)
                send(loginData)
            }
            initRequest()
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
            console.log('失败了')
            if (isLogin) {
                return
            }
            clearInterval(reloadInterval)
            reload()
            connecting = false
            connected = false
            // store.commit('CHANGE_WEBSCOET', false)
        }
        //WebSocket关闭
        socket.onclose = ()=>{
            console.log('失败了')
            if (isLogin) {
                return
            }
            clearInterval(reloadInterval)
            reload()
            connecting = false
            connected = false
            // store.commit('CHANGE_WEBSCOET', false)
        }
    }
}
const socketLogin = (data: any) => {
    console.log(data)
    sessionStorage.setItem('websocketUrl', 'ws://' + data.data.HostIP + ':51330/ws')
    isLogin = true
    
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

// 心跳
const heartbeat = () => {
    let data = {
        "company":"BL",//公司缩写，固定不变
        "actioncode":"w2d_heartbeat",//关键字
        "data":{},//具体信息，json，内容不能为空
        "token": sessionStorage.getItem('userToken') || ''
    }
    send(data)
}
const reload = () => {
    reloadInterval = setTimeout(() => {
        let socketStatus = !socket || socket.readyState !== 1
        socketStatus && registerWebSocket()
        // message.error("服务器连接断开")
    }, 3000)
}

// 获取故障信息
const requestFaultStatus = () => {
    baseParams.actioncode = "w2d_status_fault_data"
    let data = baseParams
    send(data)
    return this
}
// 获取所有终端状态
const requestTerminalStatus = () => {
    baseParams.actioncode = "w2d_web_all_terminal_status"
    let data = baseParams
    send(data)
    return this
}
// 获取站点数据
const requestSizeStatus = () => {
    baseParams.actioncode = "w2d_status_area_data"
    let data = baseParams
    send(data)
    return this
}
// 获取分区数据
const requestAreaStatus = () => {
    baseParams.actioncode = "w2d_status_node_data"
    let data = baseParams
    send(data)
    return this
}

const initRequest = ()=> {
    // heartbeat()
    // requestFaultStatus()
    // requestTerminalStatus()
    // requestSizeStatus()
    // requestAreaStatus()
}

const  handlerMsg = (msg:any) => {
    // switch(msg.actioncode) {
    //     case 'd2w_status_task_data': //会话状态
    //         return store.commit('ROUTER_TASK', msg.data)
    // }
}

export {
    // 暴露出去,方便调用
    socketLogin,
    registerWebSocket,
    send
}