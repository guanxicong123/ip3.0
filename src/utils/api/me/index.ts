import $http from "@/utils/axios/index";

// 封装 Me 用户 接口方法
export class MeService {
  static async putUsersMe(params: any): Promise<any> {
    return $http("/me", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async putUsersConfig(params: any): Promise<any> {
    return $http("/me/users-config", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async putUsersPassword(params: any): Promise<any> {
    return $http("/me/password", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async putUsersUpdate(params: any): Promise<any> {
    return $http("/me/update", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }
}
