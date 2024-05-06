const state = {
  timestamp: null,
}

const mutations = {
  UPDATE_TIMESTAMP: (state) => {
    state.timestamp = new Date().getTime()
  },
}

const actions = {
  updateTimestamp({ commit }) {
    commit('UPDATE_TIMESTAMP')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
