import $http from "@/utils/axios/index";

// 封装  对讲日志 接口方法
export class IntercomService {
  static async getOnePageIntercomLog(params: any): Promise<any> {
    return $http("/logs/talk-back", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneIntercomLog(params: any, id: number): Promise<any> {
    return $http("/logs/talk-back/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllIntercomLog(params: any): Promise<any> {
    return $http("/logs/talk-back/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteIntercomLog(params: any): Promise<any> {
    return $http("/logs/talk-back", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
