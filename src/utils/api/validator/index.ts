import $http from "@/utils/axios/index";

// 封装 Validator 验证器 接口方法
export class ValidatorService {
  static async postValidator(params: any): Promise<any> {
    return $http("/validator", {
      method: "post",
      responseType: "json",
      data: params,
    });
  }
}
