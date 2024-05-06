import api from '@/api'
import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
// 局点信息
const flavor = {
  namespaced: true,
  state: {
    flavorFlag: false,
    flavorObj: {
      flavorId: '',
      flavorName: i18n.t('login.loginTitle'),
      mainLogo: '',
      copyright: '',
      registration: '',
      registrationUrl: '',
      usageAgreementUrl: '',
      privacyAgreementUrl: '',
      complaintsHotline: '',
      complaintsEmail: '',
      phoneNumber: ''
    }
  },
  mutations: {
    SET_FLAVOR(state, data) {
      state.flavorObj = data
    },
    SET_FLAVORFLAG(state, data) {
      state.flavorFlag = data
    }
  },
  actions: {
    async getFlavorInfo({ commit, state }) {
      let flag = state.flavorFlag
      let flavorObj = {}
      if (!flag) {
        const res = await api.getFlavor({})
        flavorObj = {
          flavorId: res.flavorId || '',
          flavorName: res.flavorName || i18n.t('login.loginTitle'),
          mainLogo: res.mainLogo || '',
          // 版权&备案
          copyright: res.copyright || '',
          registration: res.registration || '',
          registrationUrl: res.registrationUrl || '',
          // 用户隐私协议
          usageAgreementUrl: res.usageAgreementUrl || '',
          privacyAgreementUrl: res.privacyAgreementUrl || '',
          complaintsHotline: res.complaintsHotline || '', // 举报电话
          complaintsEmail: res.complaintsEmail || '', // 投诉邮箱
          phoneNumber: res.phoneNumber || '' // 联系电话
        }
        commit('SET_FLAVORFLAG', true)
      } else {
        flavorObj = state.flavorObj
      }
      commit('SET_FLAVOR', flavorObj)
      let _createTitle = innerText => {
        let title =
          document.querySelector("title[id*='app-title']") || document.createElement('title')
        title.id = 'app-title'
        title.innerText = innerText
        document.head.appendChild(title)
      }
      _createTitle(state.flavorObj.flavorName)
      if (state.flavorObj.mainLogo) {
        let _createLink = async href => {
          let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
          link.type = 'image/x-icon'
          link.rel = 'shortcut icon'
          link.href = href
          document.head.appendChild(link)
        }
        _createLink(state.flavorObj.mainLogo)
      }
    }
  }
}

export default flavor
