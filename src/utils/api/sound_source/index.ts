import $http from "@/utils/axios/index";

// 封装 FastSound 快捷音源 接口方法
export class FastSoundService {
  static async getOnePageFastSound(params: any): Promise<any> {
    return $http("/fast-sound", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneFastSound(params: any, id: number): Promise<any> {
    return $http("/fast-sound/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllFastSound(params: any): Promise<any> {
    return $http("/fast-sound/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postFastSound(params: any): Promise<any> {
    return $http("/fast-sound", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putFastSound(params: any, id: number): Promise<any> {
    return $http("/fast-sound/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteFastSound(params: any): Promise<any> {
    return $http("/fast-sound", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
