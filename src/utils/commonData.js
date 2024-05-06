// 报表统计 -- cd --2020-05-28
// 添加导出任务类型
export const exportTask = {
  taskType: {
    "0": "在离线详情",
    "1": "长期离线统计",
    "2": "频繁上下线统计",
    "3": "实时在线统计",
    "10": "设备开通区域统计",
    "11": "设备开通应用统计",
    "12": "设备开销户详情",
    "20": "镜头详情",
    "30": "录像完整性详情",
    "40": "用户业务使用详情",
    "41": "第三方业务使用详情",
    "50": "用户开通区域统计",
    "51": "用户开通行业统计",
    "52": "用户开销户详情",
    "60": "专线开通区域统计",
    "61": "专线开销户详情",
    "70": "告警监控点分布详情",
    onOfflineDetail: 0,
    longOfflineStat: 1,
    oftenOnOfflineStat: 2,
    realOnlineStat: 3,
    deviceOpenAreaStat: 10,
    deviceOpenAppStat: 11,
    deviceInDecreaseDetail: 12,
    cameraDetail: 20,
    recordintegralityStatDetail: 30,
    usageDetail: 40,
    thirdUsageDetail: 41,
    userOpenAreaStat: 50,
    userOpenIndustryStat: 51,
    userInDecreaseDetail: 52,
    splnOpenAreaStat: 60,
    splnInDecreaseDetail: 61,
    alarmDeviceDetail: 70
  },
  taskStatus: {
    "0": "未开始",
    "1": "运行中",
    "2": "已暂停",
    "3": "成功",
    "4": "已删除",
    "-1": "失败",
    running: "1",
    success: "3",
    failed: "-1"
  }
}
export const Device = {
  OriginType: {
    "0": "正向开通",
    "1": "调拨",
    "2": "报表系统导入",
    "3": "ESOP开通",
    "4": "CRM开通"
  },
  PtzType: {
    "0": "固定摄像机",
    "1": "固定摄像机",
    "2": "带云台枪机",
    "3": "球机",
    "4": "半球机"
  },
  IgnoreFlag: {
    "0": "是",
    "1": "否"
  },
  NmcFlag: {
    "0": "否",
    "1": "是"
  },
  ServiceStatus: {
    "1": "启用",
    "2": '停用'
  },
  CameraStatus: {
    "1": "在线",
    "2": '离线'
  },
  Dpi: {
    "0": "其他",
    "1": "标清",
    "2": "高清",
    "3": "超清"
  },
  DevAccessMode: {
    "1": "无线4G",
    "2": "固网专线",
    "3": "小微宽带",
    "4": "网络托管",
    "5": "IOT-MPLSVPN",
    "6": "互联网专线",
    "0": "其他"
  },
  DevType: {
    "1": "NVR接入",
    "3": "IPC直连"
  },
  maintainType: {
    "1": "网络维护",
    "2": "政企维护",
    "3": "客户自维",
    "4": "ICT维护",
    "5": "合作方维护",
    "0": "其他"
  },
  BitStreamType: {
    "0": "不指定码流",
    "1": "主码流",
    "2": "辅码流1",
    "3": "辅码流2"
  },
  EncodeType: {
    "1": "H264",
    "2": "MJPEG",
    "3": "MPEG4",
    "4": "MPEG2",
    "5": "AVS",
    "6": "H265",
    "7": "SVAC"
  },
  BitRateType: {
    "0": "定码率",
    "1": "变码率"
  }
};
export const MapJson = {
  "jsqly": "jiangsu.json",
  "zjdsp": "zhejiang.json",
  "sdqly": "shandong.json",
  "gdqly": "guangdong.json",
  "hljqly": "heilongjiang.json",
  "gzqly": "guizhou.json",
  "ttqly": "henan.json",
  "hndsp": "hunan.json"
};
export const cuType = [
  [1, 2, 3],
  ["PC客户端", "APP-iOS", "APP-Android"]
];
export const userType = [
  [1, 2, 3, 4, 5],
  ["普通用户", "接警员", "客户管理员", "区域管理员", "垂直应用用户"]
];
export const spLnUseStatus = [
  [1, 2],
  ["使用", "停用"]
];
export const usageStat = function () {};
usageStat.actionResult = [
  [0, 1],
  ["成功", "失败"]
];
export const platform = function () {};
platform.platType = {
  "jsqly": [
    [2, 5],
    ["NVS", "IVS"]
  ],
  "zjdsp": [
    [5],
    ["IVS"]
  ],
  "sdqly": [
    [5],
    ["IVS"]
  ],
  "gdqly": [
    [5],
    ["IVS"]
  ],
  "hljqly": [
    [5],
    ["IVS"]
  ],
  "gzqly": [
    [5],
    ["IVS"]
  ],
  "ttqly": [
    [5],
    ["IVS"]
  ]
};
export const deviceParam = function () {};
deviceParam.accessProtocol = [
  ["T28181", "HWSDK", "HIKSDK", "DHSDK", "ONVIF", "EHOME"],
  ["T28181", "HWSDK", "HIKSDK", "DHSDK", "ONVIF", "EHOME"]
];
deviceParam.devAccessMode = [
  [1, 2, 3, 4, 5, 6, 0],
  ["无线4G", "固网专线", "小微宽带", "网络托管", "IOT-MPLSVPN", "互联网专线", "其他"]
];
deviceParam.originType = {
  "jsqly": [
    [0, 1, 2, 4],
    ['正向开通', '调拨', '报表系统导入', 'CRM开通']
  ],
  "zjdsp": [
    [0, 1, 2, 3],
    ['正向开通', '调拨', '报表系统导入', 'ESOP开通']
  ],
  "sdqly": [
    [0, 1, 2],
    ['正向开通', '调拨', '报表系统导入']
  ],
  "gdqly": [
    [0, 1, 2],
    ['正向开通', '调拨', '报表系统导入']
  ],
  "hljqly": [
    [0, 1, 2, 3, 4],
    ['正向开通', '调拨', '报表系统导入', 'ESOP开通', 'CRM开通']
  ],
  "gzqly": [
    [0, 1, 2, 3, 4],
    ['正向开通', '调拨', '报表系统导入', 'ESOP开通', 'CRM开通']
  ],
  "ttqly": [
    [0, 1, 2],
    ['正向开通', '调拨', '报表系统导入']
  ],
  "hndsp": [
    [0, 1, 2, 3, 4],
    ['正向开通', '调拨', '报表系统导入', 'ESOP开通', 'CRM开通']
  ]
};
deviceParam.serviceStatus = [
  [1, 2],
  ["启用", "停用"]
];
deviceParam.maintainType = [
  [1, 2, 3, 4, 5, 0],
  ["网络维护", "政企维护", "客户自维", "ICT维护", "合作方维护", "其他"]
];
export const User = {
  userType: {
    "1": "普通用户",
    "2": "接警员",
    "3": "客户管理员",
    "4": "区域管理员",
    "5": "垂直应用用户"
  },
  isLocked: {
    "0": "未锁定",
    "1": "手动锁定",
    "2": "过期锁定",
    "3": "攻击锁定"
  }
};

export const esopSpLn = {
  spLnUseStatus: {
    "1": "使用",
    "2": "停用"
  }
};

export const echartCodeName = {
  "320000": "江苏",
  "330000": "浙江",
  "370000": "山东",
  "440000": "广东",
  "430000": "湖南",
  "230000": "黑龙江",
  "520000": "贵州",
  "000000": "全国"
}
