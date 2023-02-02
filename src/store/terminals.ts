interface TerminalsParams<T = any> {
  allTerminals: Array<T>;
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
}

export const useTerminalsStore = defineStore({
  id: "terminals",
  state: (): TerminalsParams => {
    return {
      allTerminals: [], // 所有终端数据
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
    };
  },
  actions: {
    // 更新终端数据
    updateTerminals(data: any[], isPut?: boolean) {
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
        // isPut：是否服务器主动推送更新数据
        if (isPut) {
          const ids = [];
          for (let index = 0; index < this.allTerminals.length; index++) {
            let row = this.allTerminals[index];
            ids.push(row.EndPointID);
            // 当含有相同的终端数据，就更新
            if (item.EndPointID == row.EndPointID) {
              // 深拷贝 JSON.parse(JSON.stringify(item)
              row = Object.assign(row, item);
            }
          }
          // 主要为了防止服务器推送重复数据的问题
          if (!ids.includes(item.EndPointID)) {
            this.allTerminals.push(item);
          }
        }
      }
      if (!isPut) {
        this.allTerminals = data;
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
    // 从allTerminals设置过滤后的数据到allFilterTerminals
    setFilterTerminalsArray() {
      const terminals = [];
      const string = useRegex.replaceRegString(this.searchString);
      const reg = new RegExp(string, "gmi");
      for (let index = 0; index < this.allTerminals.length; index++) {
        const item = this.allTerminals[index];
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

      this.allTerminals.forEach((row) => {
        if (row.EndPointID === EndPointID) {
          row = newValue;
        }
      });
    },
    // 移除已删除的终端数据
    removeTerminals(data: number[]) {
      this.allTerminals = this.allTerminals.filter((item) => {
        return !data.includes(item.EndPointID);
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
      this.allTerminals = [];
      this.onePageTerminals = [];
      this.allFilterTerminals = [];
    },
  },
});
