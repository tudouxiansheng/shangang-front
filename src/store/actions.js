export default {
  // 设置系统所属盒子类型
  set_global_type({ commit, state }, data) {
    commit('SET_G_TYPE', data)
  },
  // 设置全局平台类型
  set_global_platType({ commit, state }, data) {
    commit('SET_G_PLATTYPE', data)
  },
}
