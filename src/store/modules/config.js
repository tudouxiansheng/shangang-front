// 前端参数配置
const config = {
  namespaced: true,
  state: {
    baseInfoShow: false,
    frontDevId: '',
    //中兴平台设备 前端参数配置 判断
    frontPlatType: '',
    frontDrive: ''
  },
  mutations: {
    set_baseInfoShow(state, data) {
      state.baseInfoShow = data
    },
    set_frontDevId(state, data) {
      state.frontDevId = data
    },
    set_frontPlatType(state, data) {
      state.frontPlatType = data
    },
    set_frontDrive(state, data) {
      state.frontDrive = data
    }
  }
}

export default config
