import $http from "@/utils/axios/index";

// 封装 Users 用户管理 接口方法
export class UsersService {
  static async getOnePageUsers(params: any): Promise<any> {
    return $http("/users", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneUsers(params: any, id: number): Promise<any> {
    return $http("/users/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllUsers(params: any): Promise<any> {
    return $http("/users/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postUsers(params: any): Promise<any> {
    return $http("/users", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putUsers(params: any, id: number): Promise<any> {
    return $http("/users/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteUsers(params: any): Promise<any> {
    return $http("/users", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }

  static async getUsersTerminals(params: any, id: number): Promise<any> {
    return $http("/users/" + id + "/terminals", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getUsersMe(params: any): Promise<any> {
    return $http("/me", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }
}