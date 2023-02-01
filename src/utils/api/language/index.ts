import $http from "@/utils/axios/index";

// 封装 System 语言 接口方法
export class SystemService {
  static async language(): Promise<any> {
    return $http("/language", {
      method: "get",
      responseType: "json",
    });
  }

  static async putLanguage(params: any): Promise<any> {
    return $http("/language/default", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }
}
