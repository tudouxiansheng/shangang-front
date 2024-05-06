import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global

// 最大视频通道树列表
export const videoChannels = [
  { maxVideoNum: 1, maxVideoName: i18n.t('public.maxVideoName1') },
  { maxVideoNum: 4, maxVideoName: i18n.t('public.maxVideoName4') },
  { maxVideoNum: 8, maxVideoName: i18n.t('public.maxVideoName8') },
  { maxVideoNum: 16, maxVideoName: i18n.t('public.maxVideoName16') },
  { maxVideoNum: 32, maxVideoName: i18n.t('public.maxVideoName32') },
  { maxVideoNum: 64, maxVideoName: i18n.t('public.maxVideoName64') },
  { maxVideoNum: 128, maxVideoName: i18n.t('public.maxVideoName128') },
  { maxVideoNum: 256, maxVideoName: i18n.t('public.maxVideoName256') },
  { maxVideoNum: 512, maxVideoName: i18n.t('public.maxVideoName512') }
]

/**
 * @description 获取视频通道列表
 * @param {number} maxVideoNum 最大视频通道数 默认为512
 * @returns {array} 视频通道列表
 * */
export const getMaxVideoChannels = (maxVideoNum = 512) => {
  return videoChannels.filter(item => item.maxVideoNum <= maxVideoNum)
}
