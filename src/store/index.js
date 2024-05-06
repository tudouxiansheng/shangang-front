import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import map from './modules/map'
import mapSet from './modules/mapSet'
import dict from './modules/dict'
import user from './modules/user'
import init_time from './modules/init_time'
import personApplicationModule from './modules/personApplicationModule'
//   ./就是代表同层级

// vuex-persistedstate默认持久化所有state，指定需要持久化的state
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    mapSet,
    map,
    dict,
    user,
    init_time,
    personApplicationModule,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          ...val,
          // 只储存state中的options
          // options: val.options,
          // activeIndex: val.activeIndex,
          // showName: val.showName,
          // role: val.role,
          // menusList: val.menusList,
          // activeIndex2: val.activeIndex2,
          // activeIndex3: val.activeIndex3,
          // //配置前端参数
          // baseInfoShow: val.baseInfoShow,
          // frontDevId: val.frontDevId,

          // //首次登录
          // firstLogin: val.firstLogin,

          // longNav: val.longNav,
          // thirdMenuShow: val.thirdMenuShow,

          // //正误检
          // radio: val.radio,
          // // 综合安防平台 websocket数据监听
          // totalNumber: val.totalNumber, // 布控告警总数
          // showImg: val.showImg,
        }
      },
    }),
  ],
})

export default store
