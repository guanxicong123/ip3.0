import $http from "@/utils/axios/index";

// 封装 优先级配置 接口方法
export class PriorityService {
  static async getOnePriority(id: number): Promise<any> {
    return $http("/priority-setting/" + id, {
      method: "get",
      responseType: "json",
    });
  }

  static async getAllPriority(): Promise<any> {
    return $http("/priority-setting", {
      method: "get",
      responseType: "json",
    });
  }

  static async putPriority(params: any): Promise<any> {
    return $http("/priority-setting", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }
}
