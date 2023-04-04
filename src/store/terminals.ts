interface TerminalsParams<T = any> {
  allTerminalsObj: T;
  onePageTerminals: Array<T>;
  allFilterTerminals: Array<T>;
  sortType: string;
  sortField: string;
  currentPage: number;
  pageSize: number;
  serverID: number;
  serverType: string;
  searchString: string;
  status: number;
  filterGroups: boolean;
  groupsIDArray: Array<number>;
  terminalType: number;
  searchGroupString: string;
  equipmentListChangeNum: number;
  terminalAlertdata: Array<any>;
  allWarningTerminalData: Array<any>;
  alarmTerminalData: Array<any>;
  fireTerminalData: Array<any>;
  alarmTerminalShow: boolean;
  manualAlarmTerminal: Array<any>;
}
import $http from "@/utils/axios/local_index";
export const useTerminalsStore = defineStore({
  id: "terminals",
  state: (): TerminalsParams => {
    return {
      allTerminalsObj: {}, // 所有终端数据-Obj
      onePageTerminals: [], // 一页终端数据
      allFilterTerminals: [], // 过滤后的所有终端数据
      sortType: "desc", // 默认倒序
      sortField: "EndPointIP", // 默认排序字段
      currentPage: 1, // 当前页
      pageSize: 20, // 每页/条
      serverID: 0, // 服务器id
      serverType: "0X01", // 中继服务器类型
      searchString: "", // 搜索字段
      status: -1, // 状态
      filterGroups: false, // 是否过滤分组
      groupsIDArray: [], // 分组id数组
      terminalType: 0, // 终端类型
      searchGroupString: "", // 搜索分组字段-区别searchString
      equipmentListChangeNum: 0, // 设备列表改变状态次数-避免设备状态-主讲终端组件交互干扰到数据
      terminalAlertdata: [], // 离线终端警告信息
      allWarningTerminalData: [], // 当前展示的所有报警信息
      alarmTerminalData: [], // 终端报警信息
      fireTerminalData: [], // 火警 报警信息
      manualAlarmTerminal: [], // 人工报警信息
      alarmTerminalShow: false, // 报警终端弹窗显示
    };
  },
  actions: {
    // 更新终端数据
    updateTerminals(data: any[]) {
      const alertMessage = JSON.parse(localStorage.get("alertMessage")); //警告消息（离线提醒是否开启）
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const ipArr = item.EndPointIP.split(".");
        item.ipV4Sort = "";
        ipArr.forEach((row: { toString: () => string }) => {
          item.ipV4Sort += row.toString().padStart(3, "0"); // ip前面补零-排序用
        });
        item.ipV4Sort = Number.parseInt(item.ipV4Sort + item.RelayServerID);
        item.ipSort = Number.parseInt(
          (item.EndPointIP.toString() + item.RelayServerID).replace(/\./gim, "")
        ); // ip前面不补零-排序用
        // 设置终端配置-转换二进制(原有的0表示关闭,1表示开启)
        item.EndPointConfig = {
          // 分区开关
          amplifier: usePublicMethod.binarySelection(
            item.EndPointProp.ZoneStatus,
            item.EndPointProp.ZoneStatus.length
          ),
          // 电源控制
          power: usePublicMethod.binarySelection(
            item.EndPointProp.PowerControl,
            item.EndPointProp.PowerControl.length
          ),
        };
        // 数据状态由非离线状态转换为离线状态触发
        if (
          this.allTerminalsObj[item.EndPointID]?.Status !== 0 &&
          item.Status === 0
        ) {
          // 启用终端离线提醒
          if (alertMessage?.EnabledTerminalOffAlert) {
            const Alertdata = {
              EndPointName: item.EndPointName,
              EndPointIP: item.EndPointIP,
              OfflineTime: usePublicMethod.formatDate(
                new Date().toLocaleString(),
                "YYYY-MM-DD HH:mm:ss"
              ),
            };
            this.terminalAlertdata.push(Alertdata)
          }
          // 启用终端离线铃声提醒
          if (alertMessage?.EnabledTerminalOffRingfAlert) {
            $http.get("/tools/palyring");
          }
        }
        this.allTerminalsObj[item.EndPointID] = item;
      }
    },
    // 设置服务器id
    setTerminalsServersID(id: number) {
      this.serverID = id;
    },
    // 设置服务器类型
    setTerminalsServersType(type: string) {
      this.serverType = type;
    },
    // 设置终端类型
    setTerminalsType(type: number) {
      this.terminalType = type;
    },
    // 设置排序条件
    setTerminalsSort(sortType: string, sortField: string) {
      this.sortType = sortType;
      this.sortField = sortField;
    },
    // 设置搜索字符串
    setTerminalsSearchString(string: string) {
      this.searchString = string;
    },
    // 设置搜索状态
    setTerminalsStatus(status: number) {
      this.status = status;
    },
    // 设置是否按分组搜索
    setTerminalsFilterGroups(filter: boolean, groupsIDArray: number[]) {
      this.groupsIDArray = groupsIDArray;
      this.filterGroups = filter;
    },
    // 设置分页
    setTerminalsPage(currentPage: number, pageSize: number) {
      this.currentPage = currentPage;
      this.pageSize = pageSize > 0 ? pageSize : this.pageSize;
    },
    // 设置更新一页数据
    setTerminalsPaginationArray() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end =
        start + this.pageSize <= this.allFilterTerminals.length
          ? start + this.pageSize
          : this.allFilterTerminals.length;
      this.onePageTerminals = this.allFilterTerminals.slice(start, end);
    },
    // 从allTerminalsObj设置过滤后的数据到allFilterTerminals
    setFilterTerminalsArray() {
      const terminals = [];
      const string = useRegex.replaceRegString(this.searchString);
      const reg = new RegExp(string, "gmi");
      const allTerminals: any[] = Object.values(this.allTerminalsObj);
      const length = allTerminals.length;
      for (let index = 0; index < length; index++) {
        const item = allTerminals[index];
        // 根据中继服务器id为筛选条件
        const relayServerID =
          this.serverID === -1 || item.RelayServerID === this.serverID;
        // 根据中继服务器类型为筛选条件
        const relayServerType = item.RelayServerType === this.serverType;
        // 根据终端状态为筛选条件
        const status =
          this.status === -1 ||
          (item.Status === this.status && !item.Disable) ||
          (this.status === 4 && item.Disable);
        // 终端状态-树状 根据终端分组为筛选条件
        const group =
          !this.filterGroups || this.groupsIDArray.includes(item.EndPointID);
        // 根据搜索终端名称，IP为筛选条件
        const search =
          this.searchString.length < 1 ||
          item.EndPointName.match(reg) ||
          item.EndPointIP.match(reg);
        // 根据终端类型为筛选条件
        const terminalType =
          this.terminalType === 0 || this.terminalType === item.EndPointType;
        // 添加符合条件的数据到数组
        if (
          relayServerID &&
          relayServerType &&
          status &&
          group &&
          search &&
          terminalType
        ) {
          terminals.push(item);
        }
      }
      this.allFilterTerminals = terminals;
    },
    // 设置allFilterTerminals终端数据排序
    setFilterTerminalsArraySort() {
      this.allFilterTerminals.sort((a, b) => {
        const isIPV4Sort =
          this.sortField === "EndPointIP" && typeof b.ipSort === "number";
        const isIPSort = typeof b[this.sortField] === "string";
        // 加上ip排序 防止其他数据改变 导致重新排序位置变化的问题
        if (this.sortType === "desc") {
          // IPV4排序
          if (isIPV4Sort) {
            return b.ipV4Sort - a.ipV4Sort;
          }
          // 搜索框 兼容IPV6排序
          if (isIPSort) {
            return (
              b[this.sortField]
                .toString()
                .localeCompare(a[this.sortField].toString()) ||
              (a.Disable === false ? 1 : -1) ||
              b.ipSort.toString().localeCompare(a.ipSort.toString())
            );
          } else {
            return (
              b[this.sortField] - a[this.sortField] ||
              (a.Disable === false ? 1 : -1) ||
              b.ipSort - a.ipSort
            );
          }
        } else {
          // IPV4排序
          if (isIPV4Sort) {
            return a.ipV4Sort - b.ipV4Sort;
          }
          // 搜索框 兼容IPV6排序
          if (isIPSort) {
            return (
              a[this.sortField]
                .toString()
                .localeCompare(b[this.sortField].toString()) ||
              (b.Disable === false ? 1 : -1) ||
              a.ipSort.toString().localeCompare(b.ipSort.toString())
            );
          } else {
            return (
              a[this.sortField] - b[this.sortField] ||
              (b.Disable === false ? 1 : -1) ||
              a.ipSort - b.ipSort
            );
          }
        }
      });
    },
    // 设置更新终端数组数据
    setTerminalsArray(EndPointID: number, newValue: any) {
      this.allFilterTerminals.forEach((row) => {
        if (row.EndPointID === EndPointID) {
          row = newValue;
        }
      });

      this.onePageTerminals.forEach((row) => {
        if (row.EndPointID === EndPointID) {
          row = newValue;
        }
      });
    },
    // 移除已删除的终端数据
    removeTerminals(data: number[]) {
      data.forEach((EndPointID) => {
        delete this.allTerminalsObj[EndPointID];
      });
      this.onePageTerminals = this.onePageTerminals.filter((item) => {
        return !data.includes(item.EndPointID);
      });
      this.allFilterTerminals = this.allFilterTerminals.filter((item) => {
        return !data.includes(item.EndPointID);
      });
    },
    // 清除终端数据
    clearTerminals() {
      this.allTerminalsObj = {};
      this.onePageTerminals = [];
      this.allFilterTerminals = [];
    },
    // 设置搜索分组字符串
    setGroupSearchString(string: string) {
      this.searchGroupString = string;
    },
    // 设置设备列表改变次数
    setEquipmentListChangeNum(num: number) {
      this.equipmentListChangeNum += num;
    },
    // 清楚离线终端数据
    clearAlertData() {
      this.terminalAlertdata = [];
    },
    // 重新设置报警 警告弹窗
    resetAlarmTerminalWarning(flog:boolean){
      const alertMessage = JSON.parse(localStorage.get("alertMessage")); //警告消息（人工报警提醒是否开启）
      // 报警与火警提示都没有打开
      if(!alertMessage.EnabledPersonAlert && !alertMessage.EnabledFireAlert){
        return 
      }
      // 关闭弹窗后，删除里面的数据
      if(!flog){
        this.allWarningTerminalData = []
      }
      this.alarmTerminalShow = flog
      // 报警与火警提示都打开
      if(alertMessage.EnabledPersonAlert && alertMessage.EnabledFireAlert){
        this.allWarningTerminalData = [...this.alarmTerminalData,...this.manualAlarmTerminal]
        this.fireTerminalData?.map(item=>{
          const flog:boolean = this.allWarningTerminalData.some(allItem=>{
            return allItem.EndPointIP === item.EndPointIP
          })
          if(!flog){
            this.allWarningTerminalData.push(item)
          }
        })
        return 
      }
      // 只打开报警提示
      if(alertMessage.EnabledPersonAlert){
        this.allWarningTerminalData = [...this.alarmTerminalData,...this.manualAlarmTerminal]
        return
      }
      // 只打开火警提示
      if(alertMessage.EnabledFireAlert){
        this.allWarningTerminalData = [...this.fireTerminalData]
      }
    },
    // 设置人工报警任务
    setManualAlarmTerminal(data:any) {
      this.manualAlarmTerminal = data
    },
    // 设置火警 报警任务
    setFireTerminalData(data:any) {
      this.fireTerminalData = data
    },
    // 设置终端报警 任务 
    setAlarmTerminalList(terminals:any) {
      this.alarmTerminalData = terminals
    }
  },
});
