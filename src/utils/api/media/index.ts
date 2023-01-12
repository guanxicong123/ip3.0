import $http from "@/utils/axios/index";

// 封装 MediasGroups 媒体库 接口方法
export class MeidaService {
  static async getOnePageMeida(params: any): Promise<any> {
    return $http("/medias", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getOneMeida(params: any, id: number): Promise<any> {
    return $http("/medias/" + id, {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async getAllMeida(params: any): Promise<any> {
    return $http("/medias/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async deleteMeida(params: any): Promise<any> {
    return $http("/medias", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }

  static async getDownloadOneMeida(id: number): Promise<any> {
    return $http("/medias/client-download/" + id, {
      method: "get",
      responseType: "json",
    });
  }

  static async postDownloadAllMeida(params: any): Promise<any> {
    return $http("/medias/zip/download", {
      method: "post",
      responseType: "json",
      data: params,
      timeout: 0, // 默认值是 `0` (永不超时)
    });
  }

  static async postMeidaUpload(params: any, id: number): Promise<any> {
    return $http("/medias/md5-upload/" + id, {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  // 往下都是媒体文件夹
  static async getAllMeidaGroup(params: any): Promise<any> {
    return $http("/medias-groups/all", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async postMeidaGroup(params: any): Promise<any> {
    return $http("/medias-groups", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }

  static async putMeidaGroup(params: any, id: number): Promise<any> {
    return $http("/medias-groups/" + id, {
      method: "put",
      responseType: "json",
      data: params,
    });
  }

  static async deleteMeidaGroup(params: any): Promise<any> {
    return $http("/medias-groups", {
      method: "delete",
      responseType: "json",
      data: params,
    });
  }
}
