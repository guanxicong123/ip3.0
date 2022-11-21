import $http from "@/utils/axios/index";

// 封装 Terminals 设备管理 接口方法
export class TerminalsService {
  static async getOnePageTerminals(params: any): Promise<any> {
    return $http("/terminals", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTerminals(params: any, id: number): Promise<any> {
    return $http("/terminals/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTerminals(params: any): Promise<any> {
    return $http("/terminals/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postTerminals(params: any): Promise<any> {
    return $http("/terminals", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async deleteTerminals(params: any): Promise<any> {
    return $http("/terminals", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }

  static async getExportTerminals(): Promise<any> {
    return $http("/terminals/export", {
      method: "get",
      responseType: "json",
    });
  }

  static async putTerminals(params: any, id: number): Promise<any> {
    return $http("/terminals/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async putAllTerminals(params: any): Promise<any> {
    return $http("/terminals/all", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async getHadconfigTerminals(): Promise<any> {
    return $http("/terminals/hadconfig", {
      method: "get",
      responseType: "json",
    });
  }

  static async putTerminalsEq10(params: any): Promise<any> {
    return $http("/terminals/eq5", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }
}
