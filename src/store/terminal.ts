export interface terminalState {
    terminal_data: any
    terminal_group: Array<any>
    group_terminal: Array<any>
    single_group_data: Array<any>
    terminal_status: number
    search_value: string
    filter_status: Boolean
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
        // 筛选框终端状态
        terminal_status: -1,
        search_value: '',
        // 是否过滤终端状态
        filter_status: true
        
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
                if (index < 0) {
                    this.terminal_data.push(item)
                } else {
                    this.terminal_data[index] = item
                }
            })
            console.log('this.terminal_data', this.terminal_data)
        },

        // 终端数据、分组数据更新时清洗数据
        updateTerminalGroup() {
            console.log('updateTerminalGroup')
            if (this.terminal_data.length < 1 || this.terminal_group.length < 1) return
            console.log('拿到终端状态和分组数据数据了')
            // 给分组添加属于它的终端数据
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
                this.terminal_group[index].terminals.push(this.terminal_data[terminal])
            })
        },
        
        // 获取终端分组信息
        getTerminalGroup(data: any) {
            console.log('terminal_group start', data)
            this.terminal_group = [{
                GroupID: 0,
                GroupName: "所有终端",
            }].concat(data.GroupInfo.GroupArray)
            this.group_terminal = data.GroupInfo.EndpointArray
            // this.updateTerminalGroup()
            // // 给分组添加属于它的终端数据
            // this.terminal_group.forEach((item: any) => {
            //     item.GroupID === 0 ? item.terminals = this.terminal_data : item.terminals = []
            // })
            // // console.log('terminal_group', this.terminal_group)
            // //遍历分组终端数组 EndpointArray，根据该终端所在的分组添加到 single_group_data 变量中
            // this.group_terminal.map((add: {GroupID: number, EndpointID: number} )=> {
            //     let group_id = add.GroupID
            //     let point_id = add.EndpointID
            //     let terminal = this.terminal_data.findIndex((cdd: any) => cdd.EndpointID === point_id)
            //     let index = this.terminal_group.findIndex(bdd => bdd.GroupID === group_id)
            //     this.terminal_group[index].terminals.push(this.terminal_data[terminal])
            // })
        },

        // 更新过滤条件
        updateFiltrateCondition(data: {status: number, search: string}) {
            // console.log('filter data', data)
            this.terminal_status = data.status
            this.search_value = data.search
        },

        changeFilterStatus(data: any) {
            this.filter_status = data
        },

        // 清洗数据逻辑放在更新分组函数中，过滤某个分组数据
        // cleanseGroupData(id: any) {
        //     this.updateTerminalGroup()
        //     let index = this.terminal_group.findIndex(item => item.GroupID === id)
        //     return this.single_group_data = this.terminal_group[index].terminals
        // },

        // 筛选分组数据
        filterGroupData(data: any) {
            // console.log('filter group data', data)
            let filter_data = JSON.parse(JSON.stringify(data))
            let search = new RegExp(this.search_value, "gmi")
            // 需要过滤终端状态
            if (this.filter_status) {
                if (this.terminal_status !== -1) {
                    // console.log('filter data 非-1', filter_data, this.terminal_status)
                    filter_data = filter_data.filter((item: any) => {
                        // console.log('filter loop', item.status)
                        return item.status === this.terminal_status
                    })
                    // console.log('filter data 非-1 after', filter_data)
                }
                if (search) {
                    filter_data = filter_data.filter((item: { name: string}) => {
                        return item.name.match(search)
                    })
                }
                // return filter_data
            } else {
                if (search) {
                    filter_data = filter_data.filter((item: { GroupName: string}) => {
                        return item.GroupName.match(search)
                    })
                }
                // console.log('搜索分组名称匹配项', filter_data)
                // return filter_data
            }
            // console.log('loop end data', filter_data)
            return filter_data
        },

        // 按默认字段排序
        

        setTerminalVolume(data: any) {
            console.log('set terminal volume', data)
        }
    },
});

export default useTerminalStore;
