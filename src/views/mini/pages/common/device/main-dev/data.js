
import i18n from '@/i18n/'
// const { t } = i18n();
// 最大视频通道树列表
export const videoChannels = [
  // { maxVideoNum: 1, maxVideoName: t('public.maxVideoName1') },
  // { maxVideoNum: 4, maxVideoName:  $t('public.maxVideoName4') },
  // { maxVideoNum: 8, maxVideoName:  $t('public.maxVideoName8') },
  // { maxVideoNum: 16, maxVideoName:  $t('public.maxVideoName16') },
  // { maxVideoNum: 32, maxVideoName:  $t('public.maxVideoName32') },
  // { maxVideoNum: 64, maxVideoName:  $t('public.maxVideoName64') },
  // { maxVideoNum: 128, maxVideoName:  $t('public.maxVideoName128') },
  // { maxVideoNum: 256, maxVideoName: $t('public.maxVideoName256') },
  // { maxVideoNum: 512, maxVideoName:  $t('public.maxVideoName512') }
]

/**
 * @description 获取视频通道列表
 * @param {number} maxVideoNum 最大视频通道数 默认为512
 * @returns {array} 视频通道列表
 * */
export const getMaxVideoChannels = (maxVideoNum = 512) => {
  return videoChannels.filter(item => item.maxVideoNum <= maxVideoNum)
}
