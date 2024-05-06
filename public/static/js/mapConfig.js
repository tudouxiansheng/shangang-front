/**
 * 地图相关配置文件
 * @author zdy
 * @type {{}}
 */

/**
 * 配置对象
 * @type {{}}
 */
export const MapConfig = {
  // 图标(icon)地址（相对于项目打包资源路径）
  "images": {
    // 图片缩放 0-1
    "scale": 1,
    // 宾馆
    site_hotel: "./static/images/icon/site_hotel.png",
    // 网吧
    site_netbar: "./static/images/icon/site_netbar.png",
    // 寄递业
    site_express_station: "./static/images/icon/site_express_station.png",
    // 沿街商铺
    site_store: "./static/images/icon/site_store.png",
    // 酒吧/KTV
    site_bar_ktv: "./static/images/icon/site_bar_ktv.png",
    // 中小学
    site_school: "./static/images/icon/site_school.png",
    // 集贸市场
    site_trade_market: "./static/images/icon/site_trade_market.png",
    // 宗教场所
    site_religion_station: "./static/images/icon/site_religion_station.png",
    // 消防重点单位
    site_fire_station: "./static/images/icon/site_fire_station.png",
    // 警务站点
    site_police_station: "./static/images/icon/site_police_station.png",
    // 商场
    site_square_market: "./static/images/icon/site_square_market.png",
    // 不在社会资源所规定类型之列
    site_else: "./static/images/icon/site_else.png",
    // 设备
    // 1:普通摄像机 正常
    device_camera: "./static/images/icon/device_camera.png",
    // 1.1:普通摄像机 故障
    device_camera_fault: "./static/images/icon/device_camera_fault.png",
    // 1.2:普通摄像机 告警
    // device_camera_alarm: "./static/images/icon/device_camera_alarm.png",
    // 2:智能摄像机 正常
    device_aicamera: "./static/images/icon/device_aicamera.png",
    // 2:智能摄像机 故障
    device_aicamera_fault: "./static/images/icon/device_aicamera_fault.png",
    // 2:智能摄像机 告警
    device_aicamera_alarm: "./static/images/icon/device_aicamera_alarm.png",
    // 3:人脸抓拍机 正常
    device_snap: "./static/images/icon/device_snap.png",
    // 3:人脸抓拍机 故障
    device_snap_fault: "./static/images/icon/device_snap_fault.png",
    // 3:人脸抓拍机 告警
    device_snap_alarm: "./static/images/icon/device_snap_alarm.png",
    // 4:烟雾传感器 正常
    device_smog: "./static/images/icon/device_smog.png",
    // 4:烟雾传感器 故障
    device_smog_fault: "./static/images/icon/device_smog_fault.png",
    // 4:烟雾传感器 告警
    device_smog_alarm: "./static/images/icon/device_smog_alarm.png",
    // 5:巡更系统 正常
    device_patrol: "./static/images/icon/device_patrol.png",
    // 5:巡更系统 故障
    device_patrol_fault: "./static/images/icon/device_patrol_fault.png",
    // 5:巡更系统 告警
    device_patrol_alarm: "./static/images/icon/device_patrol_alarm.png",
    // 6:一键报警 正常
    device_onekey: "./static/images/icon/device_onekey.png",
    // 6:一键报警 故障
    device_onekey_fault: "./static/images/icon/device_onekey_fault.png",
    // 6:一键报警 告警
    device_onekey_alarm: "./static/images/icon/device_onekey_alarm.png",
    // 7:燃气报警器正常
    device_gas: "./static/images/icon/device_gas.png",
    // 7:燃气报警器 故障
    device_gas_fault: "./static/images/icon/device_gas_fault.png",
    // 7:燃气报警器 告警
    device_gas_alarm: "./static/images/icon/device_gas_alarm.png",
    // 8: wifi
    device_wifi: "./static/images/icon/device_gas_alarm.png",
    // 7:wifi 故障
    device_wifi_fault: "./static/images/icon/device_wifi_fault.png",
    // 7:wifi 告警
    device_wifi_alarm: "./static/images/icon/device_wifi_alarm.png",
    // 其他/未知设备 正常
    device_else: "./static/images/icon/device_else.png",
    // 其他/未知设备 故障
    device_else_fault: "./static/images/icon/device_else_fault.png",
    // 其他/未知设备 告警
    device_else_alarm: "./static/images/icon/device_else_alarm.png",
    // pad 图标
    device_pad: "./static/images/icon/device_pad.png",
    // pad 图标 故障
    device_pad_fault: "./static/images/icon/device_pad_fault.png",
    // 人车应用
    // 轨迹点
    track: "./static/images/icon/track.png",
    // 人员足迹
    person_track: "./static/images/icon/person_track.png",
    // 车辆足迹
    vehicle_track: "./static/images/icon/vehicle_track.png",
    // 人轨迹路径点
    track_order: "./static/images/icon/track_order.png",
    // 车辆轨迹路径点
    vehicle_track_point: "./static/images/icon/vehicle_track_point.png",
  },
  // 图标样式控制
  "style": {
    // label
    "label": {
      "opacity": 1,
      "color": "#FFFFFF",
      "font_family": "黑体",
      "font_size": 18,
      "font_style": "normal",
      "font_weight": "normal",
      "border": false,
      "border_color": "#ffffff",
      "border_width": 2,
      "background": true,
      "background_color": "rgba(0, 0, 0, .8)"
    },
    // wave
    "wave": {
      "outline": false,
      "color": "#ff0000",
      "duration": 2000,
      "gradient": 0,
      "count": 2,
      "radius": 30,
      "height": 35,
    },
    // line
    "line": {
      "color": "#FF6A00",
      "width": 10,
      "lineType": "solid",
      "outline": false,
      "outlineColor": "#ffffff",
      "outlineWidth": "1.0",
      "opacity": 1,
      "animationDuration": 2000,
      "animationImage": "img/textures/lineClr.png"
    },
    "track_line": {
      "color": "#1CB2FF",
      "width": 15,
      "lineType": "solid",
      "outline": true,
      "outlineColor": "#ffffff",
      "outlineWidth": "2.0",
      "opacity": 1,
      "animationDuration": 20,
      "animationImage": "./static/images/texture/route.png",
      "clampToGround": true,
    }
  },
};
