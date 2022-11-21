import $http from "@/utils/axios/index";

// 封装 FastTerminals 快捷终端 接口方法
export class FastTerminalsService {
  static async getOnePageFastTerminals(params: any): Promise<any> {
    return $http("/fast-terminals", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneFastTerminals(params: any, id: number): Promise<any> {
    return $http("/fast-terminals/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllFastTerminals(params: any): Promise<any> {
    return $http("/fast-terminals/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postFastTerminals(params: any): Promise<any> {
    return $http("/fast-terminals", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putFastTerminals(params: any, id: number): Promise<any> {
    return $http("/fast-terminals/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteFastTerminals(params: any): Promise<any> {
    return $http("/fast-terminals", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}