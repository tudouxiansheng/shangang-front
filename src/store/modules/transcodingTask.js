// 静态转码任务设置
const transcodingTask = {
  namespaced: true,
  state: {
    errorInfo: ''
  },
  mutations: {
    update_errorInfo: (state, errorInfo) => {
      state.errorInfo = errorInfo
    }
  },
  actions: {}
}

export default transcodingTask
