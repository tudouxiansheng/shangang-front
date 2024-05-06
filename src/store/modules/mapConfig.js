// 地图配置
import api from '@/api'
import { GISType } from '@views/gis/constant'
const mapSet = {
  namespaced: true,
  state: {
    gisType: GISType.None,
    arcgisForm: {
      pattern: 1,
      serverAddress: '',
      mapServiceAddress: '',
      imageMapServiceAddress: '',
      lucLongitude: '',
      trcLongitude: '',
      llcLatitude: '',
      urqLatitude: '',
      ilucLongitude: '',
      itrcLongitude: '',
      illcLatitude: '',
      iurqLatitude: '',
      maximumScale: '',
      minimumScale: '',
      quickScale1: '',
      quickScale2: '',
      quickScale3: '',
      quickScale4: ''
    },
    gdMapForm: {
      level: 12,
      longitude: '',
      latitude: ''
    },
    arcgisInitialForm: {
      pattern: 1,
      serverAddress: '',
      mapServiceAddress: '',
      imageMapServiceAddress: '',
      lucLongitude: '',
      trcLongitude: '',
      llcLatitude: '',
      urqLatitude: '',
      ilucLongitude: '',
      itrcLongitude: '',
      illcLatitude: '',
      iurqLatitude: '',
      maximumScale: '',
      minimumScale: '',
      quickScale1: '',
      quickScale2: '',
      quickScale3: '',
      quickScale4: ''
    },
    gdMapInitialForm: {
      jsApi: '',
      uiLibraryAddress: '',
      keyProxyAddress: '',
      level: 12,
      longitude: '',
      latitude: ''
    }
  },
  mutations: {
    set_gisType: (state, gisType) => {
      state.gisType = gisType
    },
    set_arcgisForm: (state, arcgisForm) => {
      state.arcgisForm = arcgisForm
    },
    set_gdMapForm: (state, gdMapForm) => {
      state.gdMapForm = gdMapForm
    },
    set_arcgisInitialForm: (state, arcgisInitialForm) => {
      state.arcgisInitialForm = arcgisInitialForm
    },
    set_gdMapInitialForm: (state, gdMapInitialForm) => {
      state.gdMapInitialForm = gdMapInitialForm
    }
  },
  actions: {
    // 获取地图配置
    async get_gis_config({ commit, state }, data) {
      const res = await api.getGisConfigure(data)
      let form = null
      const { gisConfigs } = res
      if (gisConfigs) form = gisConfigs.find(item => item.enable == data.enable)
      if (!form) {
        commit('set_gisType', GISType.None)
        return false
      }
      commit('set_gisType', form.type)
      let arcgisForm = {},
        gdMapForm = {}
      if (form.type == GISType.ArcGIS) {
        arcgisForm = Object.assign(state.arcgisForm, form || {})
        commit('set_arcgisForm', arcgisForm)
        commit('set_gdMapForm', {
          level: 12,
          longitude: '',
          latitude: ''
        })
      } else {
        if (!form.longitude) form.longitude = ''
        if (!form.latitude) form.latitude = ''
        form.centerLngLat =
          form.longitude == '' || form.latitude == ''
            ? ''
            : form.longitude.toString() + ',' + form.latitude.toString()
        gdMapForm = Object.assign(state.gdMapForm, form || {})
        commit('set_gdMapForm', gdMapForm)
        commit('set_arcgisForm', {
          pattern: 1,
          serverAddress: '',
          mapServiceAddress: '',
          imageMapServiceAddress: '',
          lucLongitude: '',
          trcLongitude: '',
          llcLatitude: '',
          urqLatitude: '',
          ilucLongitude: '',
          itrcLongitude: '',
          illcLatitude: '',
          iurqLatitude: '',
          maximumScale: '',
          minimumScale: '',
          quickScale1: '',
          quickScale2: '',
          quickScale3: '',
          quickScale4: ''
        })
      }
      return { form }
    },
    // 获取地图初始配置
    async get_gis_config_initial({ commit, state }, resetFlag = false) {
      const res = await api.getGisConfigureInitial({})
      if (res) {
        const { resultCode, gisConfigs } = res
        let arcgisInitialForm = {},
          gdMapInitialForm = {}
        if (gisConfigs) {
          arcgisInitialForm = gisConfigs.find(item => item.type == GISType.ArcGIS)
          gdMapInitialForm = gisConfigs.find(item => item.type == GISType.AMap)
          if (!gdMapInitialForm.longitude) gdMapInitialForm.longitude = ''
          if (!gdMapInitialForm.latitude) gdMapInitialForm.latitude = ''
          gdMapInitialForm.centerLngLat =
            gdMapInitialForm.longitude == '' || gdMapInitialForm.latitude == ''
              ? ''
              : gdMapInitialForm.longitude.toString() + ',' + gdMapInitialForm.latitude.toString()
          commit('set_arcgisInitialForm', arcgisInitialForm)
          commit('set_gdMapInitialForm', gdMapInitialForm)
          if (resetFlag) {
            let arcgisForm = Object.assign(state.arcgisForm, arcgisInitialForm)
            let gdMapForm = Object.assign(state.gdMapForm, gdMapInitialForm)
            commit('set_arcgisForm', arcgisForm)
            commit('set_gdMapForm', gdMapForm)
          }
        }
        return {
          resultCode,
          arcgisForm: arcgisInitialForm,
          gdMapForm: gdMapInitialForm
        }
      }
    }
  }
}

export default mapSet
