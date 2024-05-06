// 登录会话过期间隔+保活周期存储
const init_time = {
  namespaced: true,
  state: {
    expireTime: '',
    heartBeatInterval: '',
  },
  mutations: {
    SET_EXPIRETIME: (state, expireTime) => {
      state.expireTime = expireTime
    },
    SET_HEARTBEATINT: (state, heartBeatInterval) => {
      state.heartBeatInterval = heartBeatInterval
    },
  },
}

export default init_time
