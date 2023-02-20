interface SessionParams<T = any> {
  allSessionObj: T;
  onePageSession: Array<T>;
  allFilterSession: Array<T>;
  sessionsLocalKey: Array<T>;
  sortType: string;
  sortField: string;
  currentPage: number;
  pageSize: number;
  taskType: number;
  searchString: string;
}

export const useSessionStore = defineStore({
  id: "session",
  state: (): SessionParams => {
    return {
      allSessionObj: {}, // 所有会话数据-Obj
      onePageSession: [], // 一页会话数据
      allFilterSession: [], // 过滤后的所有会话数据
      sessionsLocalKey: [], // 基本本机发起任务key
      sortType: "desc", // 默认倒序
      sortField: "TaskBeginTime", // 默认排序字段
      currentPage: 1, // 当前页
      pageSize: 20, // 每页/条
      taskType: 0, // 任务类型
      searchString: "", // 搜索字段
    };
  },
  actions: {
    // 更新会话数据
    updateSession(data: any[]) {
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        item.searchString = "";
        if (Array.isArray(item.EndPointList)) {
          item.EndPointListArray = item.EndPointList;
          item.searchString += item.TaskName;
          item.searchString += " " + item.TaskIniator;
          item.EndPointListArray.forEach((row: { EndPointName: string }) => {
            item.searchString += " " + row.EndPointName;
          });
        } else {
          item.EndPointListArray = [];
        }
        this.allSessionObj[item.TaskID] = item;
      }
    },
    // 设置任务类型
    setSessionTaskType(taskType: number) {
      this.taskType = taskType;
    },
    // 设置排序条件
    setSessionSort(sortType: string, sortField: string) {
      this.sortType = sortType;
      this.sortField = sortField;
    },
    // 设置搜索字符串
    setSessionSearchString(string: string) {
      this.searchString = string;
    },
    // 设置分页
    setSessionPage(currentPage: number, pageSize: number) {
      this.currentPage = currentPage;
      this.pageSize = pageSize > 0 ? pageSize : this.pageSize;
    },
    // 设置更新一页数据
    setSessionPaginationArray() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end =
        start + this.pageSize <= this.allFilterSession.length
          ? start + this.pageSize
          : this.allFilterSession.length;
      this.onePageSession = this.allFilterSession.slice(start, end);
    },
    // 从allSessionObj设置过滤后的数据到allFilterSession
    setFilterSessionArray() {
      const session = [];
      const string = useRegex.replaceRegString(this.searchString);
      const reg = new RegExp(string, "gmi");
      const allSession: any[] = Object.values(this.allSessionObj);
      const length = allSession.length;
      for (let index = 0; index < length; index++) {
        const item = allSession[index];
        // 根据会话类型为筛选条件
        const taskType = this.taskType === 0 || item.TaskType === this.taskType;
        // 根据搜索任务名称，发起方，响应方为筛选条件
        const search =
          this.searchString.length < 1 || item.searchString.match(reg);
        // 添加符合条件的数据到数组
        if (taskType && search) {
          session.push(item);
        }
      }
      this.allFilterSession = session;
    },
    // 设置allFilterSession会话数据排序
    setFilterSessionArraySort() {
      this.allFilterSession.sort((a, b) => {
        let _a = a[this.sortField];
        let _b = b[this.sortField];

        if (this.sortField === "TaskBeginTime") {
          _a = new Date(_a).getTime();
          _b = new Date(_b).getTime();
        }

        if (this.sortType === "desc") {
          return _b - _a;
        }

        return _a - _b;
      });
    },
    // 设置更新会话数组数据
    setSessionArray(EndPointID: number, newValue: any) {
      this.allFilterSession.forEach((row) => {
        if (row.EndPointID === EndPointID) {
          row = newValue;
        }
      });

      this.onePageSession.forEach((row) => {
        if (row.EndPointID === EndPointID) {
          row = newValue;
        }
      });
    },
    // 本地任务key记录
    taskLocalKeyRecord(row: any) {
      this.sessionsLocalKey.push(row);
    },
    // 移除已结束的会话数据
    removeSession(data: { TaskID: string }) {
      if (Object.prototype.hasOwnProperty.call(data, "TaskID")) {
        delete this.allSessionObj[data.TaskID];
      }
      this.onePageSession = this.onePageSession.filter((item) => {
        if (Object.prototype.hasOwnProperty.call(item, "TaskID")) {
          return data.TaskID !== item.TaskID;
        }
      });
      this.allFilterSession = this.allFilterSession.filter((item) => {
        if (Object.prototype.hasOwnProperty.call(item, "TaskID")) {
          return data.TaskID !== item.TaskID;
        }
      });
      this.sessionsLocalKey = this.sessionsLocalKey.filter((item: any) => {
        return data.TaskID !== item;
      });
    },
    // 清除会话数据
    clearSession() {
      this.allSessionObj = [];
      this.onePageSession = [];
      this.allFilterSession = [];
      this.sessionsLocalKey = [];
    },
  },
});
