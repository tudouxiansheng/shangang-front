import api from '@/api'
import { getClientNonce } from '@/utils/common/getClientNonce'

// 局点信息
const deviceConfig = {
  namespaced: true,
  state: {
    cameraId: '',
    mainDevId: '',
    mainDevInfo: {},
    platInfo: {},
    cameraInfo: {},
    platRecordInfo: {},
    puRecordInfo: {},
    PermissionMainDevManage: false,
    PermissionCameraManage: false,
    platRecordModifyCopy: {},
    puRecordModifyCopy: {},
  },
  getters: {
    mainDevName: state => {
      return state.mainDevInfo.mainDevName || ''
    },
    drive: state => {
      return state.cameraInfo?.thirdAccessInfo?.drive || state.mainDevInfo?.drive || ''
    },
    mainDevType: state => {
      return (
        state.cameraInfo?.cameraMaintainInfo?.mainTainType || state.mainDevInfo?.mainDevType || ''
      )
    },
    mainDevIsExDomain: state => {
      return state.mainDevInfo.isExDomain || ''
    },
    mainDevStatus: state => {
      return state.mainDevInfo.status || ''
    },
    cameraStatus: state => {
      return state.cameraInfo?.cameraMaintainInfo?.status || ''
    },
    cameraIsExDomain: state => {
      return state.cameraInfo?.thirdAccessInfo?.isExDomain != undefined
        ? state.cameraInfo?.thirdAccessInfo?.isExDomain
        : ''
    },
    platId: state => {
      return (
        state.platInfo?.platId ||
        state.mainDevInfo?.platId ||
        state.cameraInfo?.platInfo?.platId ||
        ''
      )
    },
    platType: state => {
      return state.platInfo?.platType || state.cameraInfo?.platInfo?.platType || ''
    },
    cameraName: state => {
      return state.cameraInfo?.cameraBaseInfo?.cameraName || ''
    },
    domainCode: state => {
      return state.cameraInfo?.domainCode
    },
    PermissionMainDevManage: state => {
      return state.PermissionMainDevManage
    },
    PermissionCameraManage: state => {
      return state.PermissionCameraManage
    }
  },
  mutations: {
   SET_CAMERA_ID(state, cameraId) {
      state.cameraId = cameraId
    },
    SET_MAIN_DEV_ID(state, mainDevId) {
      state.mainDevId = mainDevId
    },
    SET_MAIN_DEV_INFO(state, mainDevInfo) {
      state.mainDevInfo = mainDevInfo
    },
    SET_PLAT_INFO(state, platInfo) {
      state.platInfo = platInfo
    },
    SET_CAMERA_INFO(state, cameraInfo) {
      state.cameraInfo = cameraInfo
    },
    SET_PLAT_RECORD_INFO(state, platRecordInfo) {
      state.platRecordInfo = platRecordInfo
    },
    SET_PU_RECORD_INFO(state, puRecordInfo) {
      state.puRecordInfo = puRecordInfo
    },
    SET_PLAT_RECORD_MODIFY_COPY(state, copy) {
      state.platRecordModifyCopy = copy
    },
    SET_PU_RECORD_MODIFY_COPY(state, Copy) {
      state.puRecordModifyCopy = Copy
    },
    SET_PERMISSION_MANAGE(
      state,
      { PermissionMainDevManage = false, PermissionCameraManage = false }
    ) {
      state.PermissionMainDevManage = PermissionMainDevManage
      state.PermissionCameraManage = PermissionCameraManage
    },
    RESET_DEVICE_CONFIG(state) {
      state.cameraId = ''
      state.mainDevId = ''
      state.mainDevInfo = {}
      state.platInfo = {}
      state.cameraInfo = {}
      state.platRecordInfo = {}
      state.puRecordInfo = {}
      state.platRecordModifyCopy = {}
      state.puRecordModifyCopy = {}
    }
  },
  actions: {
    async setCameraInfo({ commit, state }, cameraId) {
      const res = await api.getCameraInfo({ cameraId })
      if (res.resultCode === 0) {
        if (res?.cameraRecordInfo?.recordRemainDays) {
          let { recordStoreDays, recordRemainDays } = res.cameraRecordInfo
          if (!recordStoreDays && recordRemainDays) {
            res.cameraRecordInfo.recordStoreDays = recordRemainDays
          }
        }
        if (res?.puRecordInfo?.recordRemainDays) {
          let { recordStoreDays: recordDays, recordRemainDays: remainDays } = res.puRecordInfo
          if (!recordDays && remainDays) {
            res.puRecordInfo.recordStoreDays = remainDays
          }
        }
        commit('SET_CAMERA_INFO', res || {})
        commit('SET_PLAT_RECORD_INFO', res.cameraRecordInfo || {})
        commit('SET_PU_RECORD_INFO', res.puRecordInfo || {})
        commit('SET_PLAT_RECORD_MODIFY_COPY', res.cameraRecordInfo || {})
        commit('SET_PU_RECORD_MODIFY_COPY', res.puRecordInfo || {})
        commit('SET_CAMERA_ID', cameraId)
        commit('SET_PLAT_INFO', res.platInfo || {})
      }
    },
    async setMainDevInfo({ commit, state }, mainDevId) {
      const res = await api.getMainDevInfo({ mainDevId })
      if (res.resultCode === 0) {
        commit('SET_MAIN_DEV_INFO', res || {})
        commit('SET_MAIN_DEV_ID', mainDevId)
        await this.dispatch('deviceConfig/setPlatInfo', res.platId)
      }
    },
    async setPlatInfo({ commit, state }, platId) {
      const res = await api.getAccessPlatformInfo({ platformId: platId })
      if (res.resultCode === 0) {
        commit('SET_PLAT_INFO', {
          platId: res.platformId,
          platName: res.platformName,
          platType: res.platformType
        })
      }
    }
  }
}

export default deviceConfig
