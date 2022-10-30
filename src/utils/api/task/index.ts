import $http from "@/utils/axios/index";

// 封装 TimingTasks 定时任务 接口方法
export class TasksService {
  static async getOnePageTasks(params: any): Promise<any> {
    return $http("/timing-tasks", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTasks(params: any, id: number): Promise<any> {
    return $http("/timing-tasks/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTasks(params: any): Promise<any> {
    return $http("/timing-tasks/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postTasks(params: any): Promise<any> {
    return $http("/timing-tasks", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putTasks(params: any, id: number): Promise<any> {
    return $http("/timing-tasks/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteTasks(params: any): Promise<any> {
    return $http("/timing-tasks", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }

  static async getExportTasks(): Promise<any> {
    return $http("/timing-tasks/export", {
      method: "get",
      responseType: "json",
    });
  }

  static async putCopyTasks(params: any): Promise<any> {
    return $http("/timing-tasks/copy", {
      method: "put",
      responseType: "json",
      data: params,
    });
  }
}