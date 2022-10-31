import $http from "@/utils/axios/index";

// 封装  广播日志 接口方法
export class BroadcastService {
  static async getOnePageBroadcastLog(params: any): Promise<any> {
    return $http("/logs/call", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneBroadcastLog(params: any, id: number): Promise<any> {
    return $http("/logs/call/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllBroadcastLog(params: any): Promise<any> {
    return $http("/logs/call/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteBroadcastLog(params: any): Promise<any> {
    return $http("/logs/call", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
