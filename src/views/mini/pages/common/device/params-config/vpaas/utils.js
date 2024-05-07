
import { PLATFORM_TYPE } from '@/enums/platformEnum'
// 主设备参数配置tab列表
const mainDevTabs = [
  {
    name: '系统参数',
    value: 'system'
  },
  {
    name: '视频通道',
    value: 'video'
  },
  {
    name: '音频通道编码',
    value: 'audio'
  },
  {
    name: '串口通道',
    value: 'serial'
  },
  {
    name: '云台参数设置',
    value: 'ptz'
  },
  {
    name: '告警通道',
    value: 'alarm'
  }
]
// ads主设备参数配置tab规则
const mainDevTabRuleMap = {
  T28181: {
    1: ['system', 'video', 'audio'],
    3: ['system', 'video', 'audio']
  },
  ONVIF: {
    1: ['system', 'video', 'audio'],
    3: ['system', 'video', 'audio']
  },
  HWSDK: {
    1: ['system', 'video', 'audio', 'serial', 'ptz'],
    3: ['system', 'video', 'audio']
  },
  'HWSDK-ACREG': {
    1: ['system', 'video', 'audio', 'serial', 'ptz'],
    3: ['system', 'video', 'audio']
  },
  HIKSDK: {
    1: ['system', 'video', 'audio'],
    3: ['system', 'video', 'audio']
  },
  DHSDK: {
    1: ['system', 'video'],
    3: ['system', 'video', 'audio']
  }
}

// vpaas主设备参数配置tab规则
const mainDevTabRuleMapVpaas = {
  T28181: {
    1: ['system', 'video'],
    3: ['system', 'video']
  },
  ONVIF: {
    1: ['system', 'video', 'audio', 'serial', 'alarm'],
    3: ['system', 'video', 'audio', 'serial', 'alarm']
  },
  HWSDK: {
    1: ['system', 'video'],
    3: ['system', 'video']
  },
  'HWSDK-ACREG': {
    1: ['system', 'video', 'audio', 'alarm'],
    3: ['system', 'video', 'audio', 'alarm']
  },
  HIKSDK: {
    1: ['system', 'video'],
    3: ['system', 'video']
  },
  DHSDK: {
    1: ['system', 'video'],
    3: ['system', 'video']
  }
}
// 镜头配置菜单tab列表
const cameraTabs = [
  {
    name: '视频通道详情',
    value: 'video'
  },
  {
    name: '服务器录像计划',
    value: 'severRecordPlan'
  }
]
// 镜头配置菜单规则
const cameraTabRuleMap = {
  T28181: {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  },
  ONVIF: {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  },
  HWSDK: {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  },
  'HWSDK-ACREG': {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  },
  HIKSDK: {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  },
  DHSDK: {
    1: ['video', 'severRecordPlan'],
    3: ['video', 'severRecordPlan']
  }
}
// 视频通道菜单tab列表
const channelTabs = [
  {
    name: '视频设置',
    value: '0'
  },
  {
    name:'图像设置',
    value: '1'
  },
  {
    name: '移动侦测设置',
    value: '2'
  },
  {
    name: '视频遮挡设置',
    value: '3'
  },
  {
    name: '前端抓拍参数设置',
    value: '4'
  },
  {
    name: '隐私保护设置',
    value: '5'
  }
]
// 视频通道->设备展示的tab页规则
const channelTabRuleMap = {
  T28181: {
    1: ['0', '1', '4'],
    3: ['0', '1', '4']
  },
  ONVIF: {
    1: ['0', '1', '2', '3', '4'],
    3: ['0', '1', '4']
  },
  HWSDK: {
    1: ['0', '1', '2', '3', '4'],
    3: ['0', '1', '2', '3', '4']
  },
  'HWSDK-ACREG': {
    1: ['0', '1', '2', '3', '4'],
    3: ['0', '1', '2', '3', '4']
  },
  HIKSDK: {
    1: ['0', '1', '2', '3', '4'],
    3: ['0', '1', '2', '3', '4']
  },
  DHSDK: {
    1: ['0', '1', '2', '4'],
    3: ['0', '1', '2', '4']
  }
}

const channelTabRuleMapVpaas = {
  T28181: {
    1: ['0'],
    3: ['0']
  },
  ONVIF: {
    1: ['0', '1'],
    3: ['0', '1']
  },
  HWSDK: {
    1: ['0', '3'],
    3: ['0', '3']
  },
  'HWSDK-ACREG': {
    1: ['0', '1', '2', '3', '5'],
    3: ['0', '1', '2', '3', '5']
  },
  HIKSDK: {
    1: ['0'],
    3: ['0']
  },
  DHSDK: {
    1: ['0'],
    3: ['0']
  }
}

/**
 * 通用函数 获取对应的tab
 * @param {Array} availableTabRules tab value列表
 * @param {Array} tabsArray 完整tab列表
 * @param {Array} defaultTab 默认tab列表
 * @return {Array} - 支持的tab菜单列表
 * */
function getAvailableTabs(availableTabRules, tabsArray, defaultTab) {
  if (!availableTabRules) {
    return defaultTab
  }
  const tabs = availableTabRules.map(tabValue => {
    return tabsArray.find(item => item.value === tabValue)
  })
  return tabs.filter(tab => tab !== undefined)
}

/**
 * 根据主设备类型和设备协议获取对应的镜头配置菜单tab列表
 * @param {number} mainDevType - 主设备类型
 * @param {string} drive - 设备协议
 * @returns {Array} - 支持的tab菜单列表
 */
export function getMainDevAvailableTabs(mainDevType, drive, platType) {
  const defaultTab = [
    {
      name: '系统参数',
      value: 'system'
    },
    {
      name: '视频通道',
      value: 'video'
    }
  ]
  const availableTabRules =
    platType == PLATFORM_TYPE.ADS
      ? mainDevTabRuleMap[drive]?.[mainDevType]
      : mainDevTabRuleMapVpaas[drive]?.[mainDevType]
  return getAvailableTabs(availableTabRules, mainDevTabs, defaultTab)
}

/**
 * 根据主设备类型和设备协议获取对应的镜头配置菜单tab列表
 * @param {number} mainDevType - 主设备类型
 * @param {string} drive - 设备协议
 * @returns {Array} - 支持的tab菜单列表
 */
export function getCameraAvailableTabs(mainDevType, drive) {
  const defaultTab = [
    {
      name:'视频通道',
      value: 'video'
    }
  ]
  const availableTabRules = cameraTabRuleMap[drive]?.[mainDevType]
  return getAvailableTabs(availableTabRules, cameraTabs, defaultTab)
}

/**
 * 根据主设备类型和设备协议获取对应的视频通道菜单tab列表
 * @param {number} mainDevType - 主设备类型
 * @param {string} drive - 设备协议
 * @returns {Array} - 支持的tab菜单列表
 */
export function getChannelAvailableTabs(mainDevType, drive, platType) {
  const defaultTab = [
    {
      name: '视频设置',
      value: '0'
    }
  ]
  const availableTabRules =
    platType == PLATFORM_TYPE.ADS
      ? channelTabRuleMap[drive]?.[mainDevType]
      : channelTabRuleMapVpaas[drive]?.[mainDevType]
  return getAvailableTabs(availableTabRules, channelTabs, defaultTab)
}
