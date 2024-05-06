import api from '@/api'
import { getClientNonce } from '@/utils/common/getClientNonce'

const auth = {
  namespaced: true,
  state: {
    refreshToken: '',
    accessToken: '',
    clientNonce: getClientNonce(4)
  },
  mutations: {
    SET_REFRESHTOKEN(state, refreshToken) {
      state.refreshToken = refreshToken
    },
    SET_ACCESSTOKEN(state, accessToken) {
      state.accessToken = accessToken
    },
    SET_CLIENTNONCE(state, clientNonce) {
      state.clientNonce = clientNonce
    }
  },
  actions: {
    setClientNonce({ commit }, data) {
      commit('SET_CLIENTNONCE', data)
    },
    setRefreshToken({ commit }, data) {
      commit('SET_REFRESHTOKEN', data)
    },
    setAccessToken({ commit }, data) {
      commit('SET_ACCESSTOKEN', data)
    }
  }
}
export default auth
