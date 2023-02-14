import router from "@/router";

let $timer: any = null;
const usePublicMethod = {
  // 设置一小时刷新一次token
  setTokenMonitorTime() {
    return new Date().getTime() + 3600 * 1000;
  },
  // 是否到了刷新token的时间
  isRefreshToken() {
    const time = Number(localStorage.get("tokenExpireMonitor")) || 0;
    return time < 1 || time <= new Date().getTime();
  },
  // 跳转新建/编辑界面
  clickJump(path: string, id: number, scheme?: number) {
    const scheme_id = scheme ? "/" + scheme : "";
    router.push(path + "/new_edit/" + id + scheme_id);
  },
  // 后退
  clickBack() {
    router.go(-1);
  },
  // 统计歌曲时长
  convertSongDuration(second: number, isLimit?: boolean) {
    const h =
      Math.floor(second / 3600) < 10
        ? "0" + Math.floor(second / 3600)
        : Math.floor(second / 3600);
    let m =
      Math.floor((second / 60) % 60) < 10
        ? "0" + Math.floor((second / 60) % 60)
        : Math.floor((second / 60) % 60);
    let s =
      Math.floor(second % 60) < 10
        ? "0" + Math.floor(second % 60)
        : Math.floor(second % 60);

    if (isLimit && h > 23) return "23:59:59";

    if (m > 59) m = 59;

    if (s > 59) s = 59;

    return h + ":" + m + ":" + s;
  },
  // 00:00:00 时间格式转换为秒
  timeToSec(time: any, num = 1) {
    const hour = time.split(":")[0];
    const min = time.split(":")[1];
    const sec = time.split(":")[2];
    const s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s * num;
  },
  // 数据容量单位转换
  bytesConversionToSize(bytes: number) {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024,
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  },
  // 日期转换到时间戳
  dateConversionToTimestamp(value: any) {
    if (!value) {
      return 0;
    }

    if (value.indexOf("-")) {
      const arr = value.split("-");
      return new Date(arr[0], Number.parseInt(arr[1]) - 1, arr[2]).getTime();
    }

    return 0;
  },
  // 获取当前时间（年月日时分秒）格式化
  formatDate(str: string, type: string) {
    const date = new Date(str);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1 + "").padStart(2, "0");
    const d = (date.getDate() + "").padStart(2, "0");
    const hh = (date.getHours() + "").padStart(2, "0");
    const mm = (date.getMinutes() + "").padStart(2, "0");
    const ss = (date.getSeconds() + "").padStart(2, "0");
    let time;

    switch (type) {
      case "YYYY-MM":
        time = `${y}-${m}`;
        break;
      case "YYYY-MM-DD":
        time = `${y}-${m}-${d}`;
        break;
      case "YYYY-MM-DD HH:mm:ss":
        time = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM-DD HH:mm:ss":
        time = `${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM-DD":
        time = `${m}-${d}`;
        break;
      case "YYYY/MM":
        time = `${y}/${m}`;
        break;
      case "YYYY/MM/DD":
        time = `${y}/${m}/${d}`;
        break;
      case "YYYY/MM/DD HH:mm:ss":
        time = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM/DD HH:mm:ss":
        time = `${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM/DD":
        time = `${m}/${d}`;
        break;
    }

    return time;
  },
  // 获取当前日期指定天数后得日期
  specifyDate(num: number) {
    const date = new Date()
    date.setDate(date.getDate() + num)
    return date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate()
  },
  // 二进制选择
  binarySelection(decimal: number, number: number) {
    const array = [];
    for (let i = 0; i < number; i++) {
      const dec = Math.pow(2, i);
      if ((decimal & dec) === dec) {
        array.push(i + 1);
      }
    }

    return array;
  },
  // base64 转二进制
  dataURLtoFile(dataurl: string, filename: string) {
    // 将base64转换为文件
    const arr: any[] = dataurl.split(",");
    const mime = arr?.[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime,
    });
  },
  // 随机数
  randomNum() {
    let Num = "";
    for (let i = 0; i < 13; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },
  /**
   * 压缩图片
   * @param img 被压缩的img对象
   * @param type 压缩后转换的文件类型
   * @param mx 触发压缩的图片最大宽度限制
   * @param mh 触发压缩的图片最大高度限制
   */
  compressImg(img: any, type: any, mx: any, mh: any) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const { width: originWidth, height: originHeight } = img;
    // 最大尺寸限制
    const maxWidth = mx;
    const maxHeight = mh;
    // 目标尺寸
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > 1) {
        // 图片宽
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        // 图片高
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    if (context) {
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片绘制
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
    }
    return canvas.toDataURL(type || "image/jpeg", 0.5);
  },
  // 生成UUID
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  debounce(fn: () => void, wait: number | undefined) {
    // 清除上一次延时器
    clearTimeout($timer);
    $timer = setTimeout(function () {
      fn();
    }, wait);
  },
};

export default usePublicMethod;
