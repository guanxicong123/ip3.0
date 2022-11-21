import $http from "@/utils/axios/index";

// 封装 TerminalsGroups 分组管理 接口方法
export class GroupsService {
  static async getOnePageGroups(params: any): Promise<any> {
    return $http("/terminals-groups", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneGroups(params: any, id: number): Promise<any> {
    return $http("/terminals-groups/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllGroups(params: any): Promise<any> {
    return $http("/terminals-groups/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postGroups(params: any): Promise<any> {
    return $http("/terminals-groups", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putGroups(params: any, id: number): Promise<any> {
    return $http("/terminals-groups/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteGroups(params: any): Promise<any> {
    return $http("/terminals-groups", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }

  static async getGroupsTerminals(params: any, id: number): Promise<any> {
    return $http("/terminals-groups/" + id + "/terminals", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }
}
