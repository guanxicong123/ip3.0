import $http from "@/utils/axios/index";

// 封装  终端日志 接口方法
export class TerminalService {
  static async getOnePageTerminalLog(params: any): Promise<any> {
    return $http("/logs/terminals", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTerminalLog(params: any, id: number): Promise<any> {
    return $http("/logs/terminals/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTerminalLog(params: any): Promise<any> {
    return $http("/logs/terminals/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteTerminalLog(params: any): Promise<any> {
    return $http("/logs/terminals", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
