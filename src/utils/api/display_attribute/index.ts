import $http from "@/utils/axios/index";

// 封装 LED 显示属性 接口方法
export class DisplayAttributeService {
  static async getOnePageDisplayAttribute(params: any): Promise<any> {
    return $http("/led-display-cfg", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneDisplayAttribute(params: any, id: number): Promise<any> {
    return $http("/led-display-cfg/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllDisplayAttribute(params: any): Promise<any> {
    return $http("/led-display-cfg/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postDisplayAttribute(params: any): Promise<any> {
    return $http("/led-display-cfg", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putDisplayAttribute(params: any, id: number): Promise<any> {
    return $http("/led-display-cfg/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteDisplayAttribute(params: any): Promise<any> {
    return $http("/led-display-cfg", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}