import { InternalAxiosRequestConfig, AxiosResponse } from "axios";
// import { AxiosCanceler } from "./axios_cancel";
// import qs from "qs"; // qs是axios自带的序列化参数方式
import { ElMessage } from "element-plus";
import { isString } from "@/utils/is";
import i18n from "@/utils/language";

const $t: any = i18n.global;

// const axiosCancel = new AxiosCanceler();
// 处理请求状态码
const showStatus = (status: number) => {
  let message = "";
  switch (status) {
    case 400:
      message = $t.t("Request error");
      break;
    case 401:
      message = $t.t("Unauthorized, please login again");
      break;
    case 403:
      message = $t.t("Access denied");
      break;
    case 404:
      message = $t.t("Request page error");
      break;
    case 408:
      message = $t.t("Request timeout");
      break;
    case 500:
      message = $t.t("Server internal error");
      break;
    case 501:
      message = $t.t("Service not implemented");
      break;
    case 502:
      message = $t.t("Bad gateway");
      break;
    case 503:
      message = $t.t("Service not available");
      break;
    case 504:
      message = $t.t("Gateway timeout");
      break;
    case 505:
      message = $t.t("HTTP version is not supported");
      break;
    default:
      message = `${$t.t("Link error")}(${status})!`;
  }
  return `${message}, ${$t.t(
    "Please check the network or contact the administrator"
  )}`;
};
// 创建 axios
const $http = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "/api/v1/"
      : "http://127.0.0.1:9999/api/v1/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    // 'Access-Control-Allow-Origin' : '*',
    // 'Access-Control-Allow-Headers': 'content-type',
    // 'Access-Control-Request-Method': 'GET,POST'
  },
  withCredentials: true, // 是否跨站点访问控制请求
  timeout: 5 * 1000, // 5s超时
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  // 允许在向服务器发送 ‘PUT’, ‘POST’ 和 ‘PATCH’ 这几个请求方法前，修改请求数据
  // transformRequest: [
  //   (data, headers) => {
  //     data = qs.stringify(data);
  //     return data;
  //   },
  // ],
  // 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    (data) => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    },
  ],
});
// 请求拦截器
$http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // // 在请求开始前，对之前的请求做检查，重复就取消操作
    // axiosCancel.removePending(config)
    // // 将当前请求添加到 pending 中
    // axiosCancel.addPending(config)
    const token = localStorage.get("userToken");
    // 每次请求带上token
    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // 请求还没有到达服务器，但是报错了,抛到弹窗提示
    ElMessage({
      type: "error",
      message:
        $t.t("Server exception") +
        ", " +
        $t.t("Please check the network or contact the administrator"),
      grouping: true,
    });
    return Promise.reject(error);
  }
);
// 响应拦截器
$http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 在请求结束后，移除本次请求
    // axiosCancel.removePending(response)
    const status = response.status;
    if (status < 200 || status >= 300) {
      const message = showStatus(status);
      // 处理http错误，抛到业务代码
      if (isString(response.data)) {
        // 组装成后端返回一样的数据结构
        response.data = {
          result: {
            message,
          },
        };
      } else {
        // 判断后端有返回 message
        const isMsg = Object.prototype.hasOwnProperty.call(
          response.data,
          "return_message"
        );
        // 没有就添加上自定义 message
        if (!isMsg) {
          response.data.return_message = message;
        } else {
          ElMessage({
            type: "error",
            message: response.data.return_message,
            grouping: true,
          });
        }
      }
    }
    if (status === 200 && response.data.result !== 200) {
      ElMessage({
        type: "error",
        message: response.data.return_message,
        grouping: true,
      });
    }
    if (status === 401) {
      usePublicMethod.signOut();
      ElMessage({
        type: "error",
        message: response.data.data.message,
        grouping: true,
      });
      return Promise.reject(response.data.data.message);
    }
    return response.data;
  },
  (error) => {
    // 判断该异常是否是由取消请求导致
    if (axios.isCancel(error)) {
      console.log("Cancel request reason: " + error.message);
    } else {
      // 请求无响应时（超时或服务器挂了）
      ElMessage({
        type: "error",
        message:
          $t.t("Request timeout or server exception") +
          ", " +
          $t.t("Please check the network or contact the administrator"),
        grouping: true,
      });
    }
    return Promise.reject(error);
  }
);

export default $http;
