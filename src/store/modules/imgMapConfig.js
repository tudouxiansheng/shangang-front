import api from '@/api'
import { sStorage } from '@/utils/common/store'

const imgMapConfig = {
  namespaced: true,
  state: {
    mapList: [],
    currentIndex: 0,
    mapInfo: {},
    mapInfoLoading: false
  },
  getters: {
    mapId: state => {
      return state.mapInfo?.mapId || ''
    },
    currentMapDeviceList: state => {
      return state.mapInfo?.deviceList || []
    },
    hotAreaList: state => {
      return state.mapInfo?.hotSpotList || []
    },
    mapListOption: state => {
      let arr = []
      if (Object.keys(state.mapInfo).length > 0 && state.mapList.length > 1) {
        arr = state.mapList.filter(item => item.mapId != state.mapInfo.mapId)
      }
      return arr
    }
  },
  mutations: {
    SET_MAP_LIST(state, mapList) {
      state.mapList = mapList
    },
    SET_MAP_INFO(state, mapInfo) {
      state.mapInfo = mapInfo
    },
    SET_MAP_DEVICE_LIST(state, list) {
      state.mapInfo.deviceList = list
    },
    SET_MAP_LOADING(state, mapInfoLoading) {
      state.mapInfoLoading = mapInfoLoading
    },
    SET_CURRENT_INDEX(state, currentIndex) {
      state.currentIndex = currentIndex
    }
  },
  actions: {
    async getMapList({ commit }) {
      const res = await api.getMapPictureList({
        netType: sStorage.get('netType')
      })
      if (res.resultCode === 0) {
        commit('SET_MAP_LIST', res.mapList || [])
      }
    },
    async getMapInfo({ commit }, mapId) {
      commit('SET_MAP_LOADING', true)
      const res = await api.getMapPictureInfo({ 
        mapId,
        netType: sStorage.get('netType')
      })
      if (res.resultCode === 0) {
        commit('SET_MAP_INFO', res)
      }
      commit('SET_MAP_LOADING', false)
    }
  }
}

export default imgMapConfig
