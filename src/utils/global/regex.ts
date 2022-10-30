const useRegex = {
  // 搜索匹配正则
  replaceRegString(string: string) {
    return string.replace(/[-[\]{}()*+?.,:\\^$|#\s]/g, "\\$&");
  },
  // 名称效验
  validateName(name: { toString: () => string } | null | undefined) {
    if (name === null || name === undefined) {
      return false;
    }

    const zh = /^[\S\s]{1,100}$/;

    return name.toString().match(zh);
  },
  // IP地址效验
  validateIP(ip: { toString: () => string } | null | undefined) {
    if (ip === null || ip === undefined) {
      return false;
    }

    const ipV4 =
      /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

    const ipV6 =
      /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

    return ip.toString().match(ipV4) || ip.toString().match(ipV6);
  },
  // 数字效验
  validateNumber(value: { toString: () => string } | null | undefined) {
    if (value === null || value === undefined) {
      return false;
    }

    const num = /^\d{1,}$/;

    return value.toString().match(num);
  },
  // 空值效验
  validateEmpty(value: string | null | undefined) {
    return value !== "" && value !== undefined && value !== null;
  },
  // 匹配密码替换
  replacePassword(string: string) {
    // 所有统一表意文字无需维护的正则表达式 /\p{Unified_Ideograph}/u
    return string.replace(/\s+/g, "").replace(/\p{Unified_Ideograph}/gu, "");
  },
  // 多个空格(\s+)、前后空格(^\s+|\s+$)替换
  replaceSpaces(string: string) {
    return string.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
  },
  // 匹配所有emoji表情替换
  replaceEmoji(string: string) {
    return string.replace(
      /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g,
      ""
    );
  },
  // 匹配所有表情替换
  replaceAllExpressions(string: string) {
    return string.replace(
      /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g,
      ""
    );
  },
  // 匹配所有emoji表情、多个空格(\s+)、前后空格(^\s+|\s+$)替换
  replaceEmojiSpaces(string: string) {
    return string
      .replace(
        /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g,
        ""
      )
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s+/g, " ");
  },
};

export default useRegex;
