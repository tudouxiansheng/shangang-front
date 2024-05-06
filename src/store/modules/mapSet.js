// 电子地图
const mapSet = {
  namespaced: true,
  state: {
    checkedType: ['1', '2', '3', '4', '5', '6', '7', '8'], // 设备展示类型

    markerLabelShow: false, // 地图资源名称
    alarmAnimationShow: false, // 设备告警动画
    mapCenterShow: false, // 地图中心点

    layerType: [], // 地图层级

    toolbarIndex: -1, // 工具条

    // 地图信息设置
    mapCenterInfo: {
      level: '12', // 层级
      centerLngLat: '120.585294, 31.299758' // 中心点经纬度
      // centerLngLat: '118.742063,31.937959' // 中心点经纬度
      // centerLngLat: "55.686759,24.20816" // 阿联酋
    },

    playDevId: '' // 正在播放设备
  },
  mutations: {
    set_checkedType(state, data) {
      state.checkedType = data
    },
    set_markerLabelShow(state, flag) {
      state.markerLabelShow = flag
    },
    set_alarmAnimationShow(state, flag) {
      state.alarmAnimationShow = flag
    },
    set_mapCenterShow(state, flag) {
      state.mapCenterShow = flag
    },
    set_mapCenterInfo(state, info) {
      state.mapCenterInfo = info
    },
    set_layerType(state, data) {
      state.layerType = data
    },
    set_toolbarIndex(state, data) {
      state.toolbarIndex = data
    },
    set_playDevId: (state, cameraId) => {
      state.playDevId = cameraId
    }
  },
  actions: {
    get_checkedType({ commit, state }, devTypeList) {
      let checkedType = JSON.parse(JSON.stringify(state.checkedType))
      let newCheckedType = []
      for (let i = 0; i < checkedType.length; i++) {
        const item = checkedType[i]
        let index = devTypeList.findIndex(item1 => item1.value == item)
        if (index != -1) newCheckedType.push(item)
      }
      commit('set_checkedType', newCheckedType)
    }
  }
}

export default mapSet
