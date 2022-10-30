import type { AxiosRequestConfig, Canceler } from "axios";
import qs from "qs"; // qs是axios自带的序列化参数方式
import { isFunction } from "@/utils/is";

// 用于存储每个请求的标识和取消功能
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) =>
  [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data),
  ].join("&");

export class AxiosCanceler {
  // 添加请求
  addPending(config: AxiosRequestConfig) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果当前没有挂起的请求，则添加
          pendingMap.set(url, cancel);
        }
      });
  }
  // 清除 pendingMap 所有请求
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }
  // 清除请求
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // 如果当前请求标识符处于未决状态，当前请求需要取消并删除
      const cancel = pendingMap.get(url);
      cancel && cancel(url);
      pendingMap.delete(url);
    }
  }
  // 重置
  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
