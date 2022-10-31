import router from '../router'
import useSystemStore from './system_config'

export interface AppState {
    language: string;
    size: string;
    is_websocekt: boolean;
    is_login: boolean;
    is_login_status: Number;
    sessionsArray: Array<[]>;
}

const useAppStore: any = defineStore({
    id: "app",
    state: (): AppState => ({
        // language: getLanguage(),
        language: "zh-cn",
        size: localStorage.get("size") || "default",
        is_websocekt: false, //是否连接
        is_login: false, //是否登录中
        is_login_status: 0,
        sessionsArray: [] //会话数据（时实任务）
    }),
    actions: {
        setSize(size: string) {
            this.size = size;
            localStorage.set("size", size);
        },
        setLanguage(language: string) {
            this.language = language;
            localStorage.set("language", language);
        },
        // 改变webscoet连接状态
        changeWsStatus(is_websocekt: boolean) {
            this.is_websocekt = is_websocekt;
        },
        // 改变登录状态
        changeLoginStatus(status: boolean) {
            this.is_login = status;
        },
        // 登录成功返回信息
        loginSuccessData(data: any) {
            this.is_login = false
            localStorage.set("userToken", data.token)
            localStorage.set("LoginUserID", data.data.UserID)
            // if (router.options.history.location === '/') {
            //     router.push("/terminal")
            // }
            // 登录成功获取路由权限数据
            // router.push("/terminal")
            useSystemStore().getConfigInfo()
        },
        // 会话状态
        ROUTER_TASK(data: any) {
            if (data) {
                this.sessionsArray = data
            }else {
                this.sessionsArray = []
            }
        },
        // 会话数据推送
        taskDataPush(data: any) {
            console.log(data)
            if (this.sessionsArray.length === 0) {
                this.sessionsArray = data
            }else {
                data.forEach((one: any)=> {
                    let result = this.sessionsArray.some((two: any)=> {
                        if (one.TaskID === two.TaskID) {
                            Object.assign(two, one)
                            return true
                        } else {
                            return false
                        }
                    })
                    if (!result) {
                        this.sessionsArray.push(one)
                    }
                })
            }
        },
        // 会话停止推送
        taskPushStop(row: any) {
            this.sessionsArray = this.sessionsArray.filter((item: any)=> {
                return item.TaskID !== row
            })
        }
    },
});

export default useAppStore;
