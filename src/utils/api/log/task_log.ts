import $http from "@/utils/axios/index";

// 封装  任务日志 接口方法
export class TaskService {
  static async getOnePageTaskLog(params: any): Promise<any> {
    return $http("/logs/tasks", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTaskLog(params: any, id: number): Promise<any> {
    return $http("/logs/tasks/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTaskLog(params: any): Promise<any> {
    return $http("/logs/tasks/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteTaskLog(params: any): Promise<any> {
    return $http("/logs/tasks", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
