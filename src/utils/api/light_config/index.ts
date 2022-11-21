import $http from "@/utils/axios/index";

// 封装 灯光配置 接口方法
export class TerminalsLightService {
  static async getOnePageTerminalsLight(params: any): Promise<any> {
    return $http("/terminals-light", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTerminalsLight(params: any, id: number): Promise<any> {
    return $http("/terminals-light/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTerminalsLight(params: any): Promise<any> {
    return $http("/terminals-light/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postTerminalsLight(params: any): Promise<any> {
    return $http("/terminals-light", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putTerminalsLight(params: any, id: number): Promise<any> {
    return $http("/terminals-light/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteTerminalsLight(params: any): Promise<any> {
    return $http("/terminals-light", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
