export interface terminalState {
    terminal_data: any
    terminal_group: Array<any>
    group_terminal: Array<any>
    single_group_data: Array<any>
    terminal_status: number
    search_value: string
    filter_status: boolean
}

export const useTerminalStore = defineStore({
    id: 'terminal',
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
        filter_status: true,
    }),
    actions: {
        // 获取终端信息
        getTerminalData(data: any) {
            data.EndPointsArray.forEach((item: any) => {
                item.status = item.Status
                item.name = item.EndPointName
                item.volume = item.Volume
                item.ip_address = item.EndPointIP
                item.code = item.CallCode
                // item.type = item.EndPointType
                item.task = {
                    name: item.TaskName,
                    type: item.TaskType,
                }
                const index = this.terminal_data.findIndex((idd: any) => {
                    return idd.EndPointID === item.EndPointID
                })
                if (index < 0) {
                    this.terminal_data.push(item)
                } else {
                    this.terminal_data[index] = item
                }
            })
        },

        // 获取终端分组信息
        getTerminalGroup(data: any) {
        this.terminal_group = [
            {
            GroupID: 0,
            GroupName: '所有终端',
            },
        ].concat(data.GroupInfo.GroupArray)
        this.group_terminal = data.GroupInfo.EndpointArray
        },

        // 更新过滤条件
        updateFiltrateCondition(data: { status: number; search: string }) {
            this.terminal_status = data.status
            this.search_value = data.search
        },

        changeFilterStatus(data: any) {
            this.filter_status = data
        },

        // 筛选分组数据
        filterGroupData(data: any) {
            if (data) {
                return data
            }
            return []
        },

        // 排序函数
        sortChangeData(prop: any, data: any) {
            const init_data = JSON.parse(JSON.stringify(data))
            if (prop === 1) {
                init_data.sort((a: any, b: any) => {
                const ip1 = a.ip_address
                    .split('.')
                    .map((e: any) => e.padStart(3, '0'))
                    .join('')
                const ip2 = b.ip_address
                    .split('.')
                    .map((e: any) => e.padStart(3, '0'))
                    .join('')
                return ip2 - ip1
                })
            } else if (prop === 0) {
                init_data.sort((a: any, b: any) => b.status - a.status)
            } else if (prop === 2) {
                init_data.sort((a: any, b: any) => b.name.localeCompare(a.name, 'zh'))
            } else {
                init_data.sort((a: any, b: any) => b.code - a.code)
            }
            return init_data
        },

        // 终端状态按默认字段排序
        defaultTerminalSort(data: any) {
            let init_data = JSON.parse(JSON.stringify(data))
            const sort_prop = getStore.useSystemStore().system_configs.TerminalOrderbyType
            return (init_data = this.sortChangeData(sort_prop, init_data))
        },

        setTerminalVolume(data: any) {
            console.log('set terminal volume', data)
        },
    },
})
