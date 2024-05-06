export default {
  get3800Support: (state) => {
    if (state.g_type == 0 || state.g_type == 1) {
      return false
    }
    return true
  },
  getShowName: (state) => {
    return state.showName
  },
  getActiveIndex: (state) => {
    return state.activeIndex
  },
  getOptions: (state) => {
    return state.options
  },
  getRole: (state) => {
    return state.role
  },
  getMenus: (state) => {
    return state.menusList
  },
}
