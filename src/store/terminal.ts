export interface terminalState {
    terminal_data: any
    terminal_group: Array<any>
    group_terminal: Array<any>
    single_group_data: Array<any>
}

const useTerminalStore = defineStore({
    id: "terminal",
    state: (): terminalState => ({
        //所有终端
        terminal_data: [],
        // 终端分组信息 -> GroupInfo.GroupArray
        terminal_group: [],
        // 终端分组数据 -> GroupInfo.EndpointArray
        group_terminal: [],

        single_group_data: [],
        
    }),
    actions: {
        // 获取终端信息
        getTerminalData(data: any) {
            console.log('terminal_data start', data)
            data.EndPointsArray.forEach((item: any) => {
                item.status = item.Status
                item.name = item.EndpointName
                item.volume = item.Volume
                item.ip_address = item.EndpointIP
                item.code = item.CallCode
                item.type = item.EndpointType
                item.task = {
                    name: item.TaskName,
                    type: item.TaskType
                }
                let index = this.terminal_data.findIndex((idd: any) => idd.EndpointID === item.EndpointID)
                if (index) {
                    this.terminal_data.push(item)
                } else {
                    this.terminal_data[index] = item
                }
            })
            // console.log('terminal_data', this.terminal_data)
            // this.terminal_data = JSON.parse(JSON.stringify(data.EndPointsArray))
        },
        // 更新终端数据
        
        // 获取终端分组信息
        updateTerminalGroup(data: any) {
            console.log('terminal_group start', data)
            this.terminal_group = [{
                GroupID: 0,
                GroupName: "所有终端",
            }].concat(data.GroupInfo.GroupArray)
            this.group_terminal = data.GroupInfo.EndpointArray
        },
        // 清洗分组数据
        cleanseGroupData(id: any) {
            this.terminal_group.forEach((item: any) => {
                item.GroupID === 0 ? item.terminals = this.terminal_data : item.terminals = []
            })
            // console.log('terminal_group', this.terminal_group)
            //遍历分组终端数组 EndpointArray，根据该终端所在的分组添加到 single_group_data 变量中
            this.group_terminal.map((add: {GroupID: number, EndpointID: number} )=> {
                let group_id = add.GroupID
                let point_id = add.EndpointID
                let terminal = this.terminal_data.findIndex((cdd: any) => cdd.EndpointID === point_id)
                let index = this.terminal_group.findIndex(bdd => bdd.GroupID === group_id)
                // console.log('index', group_id, index)
                this.terminal_group[index].terminals.push(this.terminal_data[terminal])
            })
            // console.log('terminal_group cleanse', this.terminal_group)
            let index = this.terminal_group.findIndex(item => item.GroupID === id)
            // console.log('index', index, id)
            return this.single_group_data = this.terminal_group[index].terminals
        },
        // 筛选分组数据
        filterGroupData(data: any) {

        }
    },
});

export default useTerminalStore;
