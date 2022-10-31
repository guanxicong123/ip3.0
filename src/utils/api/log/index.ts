import $http from "@/utils/axios/index";

// 封装 系统日志管理 接口方法
export class SystemLogService {
  static async getOnePageLog(params: any): Promise<any> {
    return $http("/logs/system", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }
  static async deleteLog(params: any): Promise<any> {
    return $http("/logs/system", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}

// 封装 导出日志接口
export class ExportLogService {
  static async exprtLog(params: any): Promise<any> {
    return $http("/export-logs", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }
}
