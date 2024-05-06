import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
export default {
  data() {
    return {
      txt: {
        tips: i18n.t('shareDevice.tips'),
        tips1: i18n.t('shareDevice.tips1'),
        deviceShare: i18n.t('shareDevice.deviceShare'),
        cancelShare: i18n.t('shareDevice.cancelShare'),
        setShareAuth: i18n.t('shareDevice.setShareAuth'),
        share: i18n.t('shareDevice.share'),
        chooseDevShare: i18n.t('shareDevice.chooseDevShare'),
        chooseUserShare: i18n.t('shareDevice.chooseUserShare'),
        preShare: i18n.t('shareDevice.preShare'),
        title: i18n.t('shareDevice.title'),
        isCancelShareDev: i18n.t('shareDevice.isCancelShareDev')
      }
    }
  }
}
