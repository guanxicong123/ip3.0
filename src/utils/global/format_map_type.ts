const useFormatMap = {
  terminalsOptions: [
    { value: 1, label: "普通终端" },
    { value: 2, label: "对讲终端" },
    { value: 3, label: "采集终端" },
    { value: 4, label: "备份终端" },
    { value: 5, label: "定时任务备份终端" },
    { value: 6, label: "服务器终端" },
    { value: 7, label: "灯光终端" },
    { value: 8, label: "时间终端" },
    { value: 9, label: "转换终端" },
    { value: 10, label: "分区终端" },
    { value: 11, label: "虚拟终端" },
    { value: 12, label: "LED终端" },
    { value: 13, label: "监控终端" },
  ],
  terminalsMap: new Map([
    [1, "普通终端"],
    [2, "对讲终端"],
    [3, "采集终端"],
    [4, "备份终端"],
    [5, "定时任务备份终端"],
    [6, "服务器终端"],
    [7, "灯光终端"],
    [8, "时间终端"],
    [9, "转换终端"],
    [10, "分区终端"],
    [11, "虚拟终端"],
    [12, "LED终端"],
    [13, "监控终端"],
  ]),
  taskTypeOptions: [
    { value: 1, label: "火警" },
    { value: 3, label: "报警" },
    { value: 4, label: "对讲" },
    { value: 5, label: "广播" },
    { value: 6, label: "电话广播" },
    { value: 2, label: "紧急对讲" },
    { value: 18, label: "定时巡更" },
    { value: 7, label: "定时任务" },
    { value: 8, label: "定时打铃" },
    { value: 11, label: "遥控任务" },
    { value: 12, label: "文本播放" },
    { value: 9, label: "短路输入" },
    { value: 10, label: "防拆报警" },
    { value: 13, label: "声卡采集" },
    { value: 14, label: "终端采集" },
    { value: 15, label: "音乐播放" },
    { value: 16, label: "终端点播" },
    { value: 17, label: "环境监听" },
    { value: 19, label: "任务监听" },
  ],
  taskTypeMap: new Map([
    [1, "火警"],
    [2, "紧急对讲"],
    [3, "报警"],
    [4, "对讲"],
    [5, "广播"],
    [6, "电话广播"],
    [7, "定时任务"],
    [8, "定时打铃"],
    [9, "短路输入"],
    [10, "防拆报警"],
    [11, "遥控任务"],
    [12, "文本播放"],
    [13, "声卡采集"],
    [14, "终端采集"],
    [15, "音乐播放"],
    [16, "终端点播"],
    [17, "环境监听"],
    [18, "定时巡更"],
    [19, "任务监听"],
  ]),
  serversTypeOptions: [
    { value: "0X00", label: "管控服务" },
    { value: "0X01", label: "中继服务" },
    { value: "0X02", label: "抢占服务" },
    { value: "0X04", label: "媒体分发服务" },
    { value: "0X08", label: "业务服务" },
    { value: "0X10", label: "定时服务" },
    { value: "0X20", label: "语音服务" },
    { value: "0X40", label: "客户端服务" },
  ],
  serversTypeMap: new Map([
    ["0X00", "管控服务"],
    ["0X01", "中继服务"],
    ["0X02", "抢占服务"],
    ["0X04", "媒体分发服务"],
    ["0X08", "业务服务"],
    ["0X10", "定时服务"],
    ["0X20", "语音服务"],
    ["0X40", "客户端服务"],
  ]),
  playModelOption: [
    { value: 0, label: "列表播放" },
    { value: 1, label: "循环播放" },
    { value: 2, label: "随机播放" },
  ],
  playModelMap: new Map([
    [0, "列表播放"],
    [1, "循环播放"],
    [2, "随机播放"],
  ]),
  qualityOption: [
    { value: 1, label: "初级" },
    { value: 2, label: "中级" },
    { value: 3, label: "高级" },
  ],
  soundQualityMap: new Map([
    [1, "初级"],
    [2, "中级"],
    [3, "高级"],
  ]),
  usersTypeMap: new Map([
    [0, "系统管理员"],
    [1, "超级管理员"],
    [2, "管理员"],
    [3, "普通用户"],
  ]),
  audioSourceTypeMap: new Map([
    [1, "音乐播放"],
    [2, "声卡采集"],
    [3, "终端采集"],
    [4, "快捷音源"],
    [5, "文本播放"],
  ]),
  weeksTypeMap: new Map([
    [1, "周一"],
    [2, "周二"],
    [3, "周三"],
    [4, "周四"],
    [5, "周五"],
    [6, "周六"],
    [7, "周日"],
  ]),
  logLevelTypeMap: new Map([
    [1, "信息"],
    [2, "警告"],
    [3, "错误"],
    [4, "致命"],
  ]),
};

export default useFormatMap;
