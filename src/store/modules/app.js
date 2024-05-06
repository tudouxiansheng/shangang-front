import pkg from '../../../package.json'
const app = {
  namespaced: true,
  state: {
    // 版本信息
    aboutInfo: {
      version: `V${pkg.version}`,
      publishTime: `${pkg.lastBuildTime}`
    },
    // 密码过期强制改密码
    modifyPasswordInfo: {
      isAppendToBody: true,
      changePwdClosable: true,
      changePsdDialogVisible: false
    },
    batchTaskIDs: [] //批量循环调接口时不弹出提示框
  },
  getters: {
    getBatchTaskIDs: state => {
      return state.batchTaskIDs
    }
  },
  mutations: {
    SET_MODIFYPASSWORD(state, { changePwdClosable, changePsdDialogVisible, isAppendToBody }) {
      state.modifyPasswordInfo.isAppendToBody = isAppendToBody
      state.modifyPasswordInfo.changePwdClosable = changePwdClosable
      state.modifyPasswordInfo.changePsdDialogVisible = changePsdDialogVisible
    },
    ADD_BATCHTASKID(state, id) {
      state.batchTaskIDs.push(id)
    },
    REMOVE_BATCHTASKID(state, id) {
      state.batchTaskIDs.splice(state.batchTaskIDs.indexOf(id), 1)
    },
    CLEAR_BATCHTASKID(state) {
      state.batchTaskIDs = []
    }
  },
  actions: {
    addBatchTaskID({ commit, state }, id) {
      // 没有该id的时候才添加
      if (state.batchTaskIDs.indexOf(id) === -1) {
        commit('ADD_BATCHTASKID', id)
      }
    },
    removeBatchTaskID({ commit, state }, id) {
      const index = state.batchTaskIDs.indexOf(id)
      if (index !== -1) {
        commit('REMOVE_BATCHTASKID', id)
      }
    },
    clearBatchTaskID({ commit }) {
      commit('CLEAR_BATCHTASKID')
    }
  }
}

export default app
