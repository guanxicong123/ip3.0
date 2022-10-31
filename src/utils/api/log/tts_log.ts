import $http from "@/utils/axios/index";
// 封装  tts日志 接口方法
export class TTSService {
  static async getOnePageTTSLog(params: any): Promise<any> {
    return $http("/logs/tts", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneTTSLog(params: any, id: number): Promise<any> {
    return $http("/logs/tts/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllTTSLog(params: any): Promise<any> {
    return $http("/logs/tts/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteTTSLog(params: any): Promise<any> {
    return $http("/logs/tts", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
