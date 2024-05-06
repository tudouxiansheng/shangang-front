/**
 * 设备类型
 * */
export const DEVICE_TYPE = {
  OTHER: 0, // 其他
  NVR: 1, // NVR
  DVS: 2, // DVS
  IPC: 3, // IPC
  DVR: 4 // DVR
}
/**
 * 设备协议类型
 * */
export const DRIVE_TYPE = {
  T28181: 'T28181', // T28181
  HIKSDK: 'HIKSDK', // 海康SDK
  HWSDK: 'HWSDK', // 华为SDK
  HWSDK_ACREG: 'HWSDK-ACREG', // 华为SDK主动注册
  DHSDK: 'DHSDK', // 大华SDK
  ONVIF: 'ONVIF', // ONVIF
  EZVIZ: '萤石云', // 萤石云
  HOLO: 'HOLO', // 好望云
  TEYES: 'TEYES' // 千里眼
}

/**
 * 设备状态
 */
export const DEVICE_STATUS = {
  INIT: 0, // 未激活
  ONLINE: 1, // 在线
  OFFLINE: 2, // 离线
  EXCEPTION: 3 // 故障
}
