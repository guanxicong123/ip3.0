import $http from "@/utils/axios/index";

// 封装 LED配置 接口方法
export class LEDService {
  static async getOnePageLED(params: any): Promise<any> {
    return $http("/led-config", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneLED(params: any, id: number): Promise<any> {
    return $http("/led-config/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllLED(params: any): Promise<any> {
    return $http("/led-config/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postLED(params: any): Promise<any> {
    return $http("/led-config", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putLED(params: any, id: number): Promise<any> {
    return $http("/led-config/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteLED(params: any): Promise<any> {
    return $http("/led-config", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
