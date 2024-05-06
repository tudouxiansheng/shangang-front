// import router from '@router'
import { sStorage } from '@/utils/common/store'
import Router from 'vue-router'
// 菜单
const menu = {
  namespaced: true,
  state: {
    options: [],
    activeIndex: '',
    showName: 'show',
    role: '',
    menuList: [],

    longNav: true, //左侧菜单显影
    thirdMenuShow: true, //三级菜单显影

    cachedViews: []
  },
  getters: {
    getShowName: state => {
      return state.showName
    },
    getActiveIndex: state => {
      return state.activeIndex
    },
    getOptions: state => {
      return state.options
    },
    getRole: state => {
      return state.role
    },
    getMenus: state => {
      return state.menuList
    }
  },
  mutations: {
    // 添加tabs
    add_tabs(state, data) {
      // 默认展示菜单列表第一个
      state.options.push(data)
    },
    set_options(state, data = []) {
      state.options = data
    },
    // 删除tabs
    delete_tabs(state, id) {
      let index = 0
      for (let option of state.options) {
        if (option.id === id) {
          break
        }
        index++
      }
      state.options.splice(index, 1) //删除options里面下标为Index的一个数
    },
    // 添加菜单
    add_menus(state, data) {
      state.menuList = data
    },
    // 设置当前激活的tab
    set_active_index(state, index) {
      state.activeIndex = index
    },
    //设置tab页显示标题
    set_showName(state, name) {
      state.showName = name
    },
    set_role(state, role) {
      state.role = role
    },
    set_longNav(state, longNav) {
      state.longNav = longNav
    },
    // 三级菜单
    set_thirdMenuShow(state, data) {
      state.thirdMenuShow = data
    },
    add_cached_view: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (view.meta && view.meta.keepAlive) {
        state.cachedViews.push(view.name)
      }
    },
    del_cached_view: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      index > -1 && state.cachedViews.splice(index, 1)
    },
    clear_cached_views: state => {
      state.cachedViews = []
    }
  },
  actions: {
    addView({ commit, state }, tabData) {
      return new Promise(resolve => {
        const menuId = tabData.id
        const menus = JSON.parse(sStorage.get('menuList'))
        const menu = findMenuItem(menuId, menus)
        const addCachedView = view => {
          const resolveRoute = Router.resolve(view.path)
          if (!resolveRoute) return
          commit('add_cached_view', resolveRoute)
        }

        // 添加tabs
        commit('add_tabs', tabData)
        // 设置当前激活的tab
        commit('set_active_index', tabData.id)

        // 添加缓存
        if (menu.children && menu.children.length) {
          // 三级菜单，添加所有子菜单的缓存
          for (let i = 0; i < menu.children.length; i++) {
            addCachedView(menu.children[i])
          }
        } else {
          // 二级菜单，添加自己的缓存
          addCachedView(menu)
        }
        resolve({
          visitedViews: [...state.options],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delView({ commit, state }, menuId) {
      return new Promise(resolve => {
        const menus = JSON.parse(sStorage.get('menuList'))
        const menu = findMenuItem(menuId, menus)
        const delCachedView = view => {
          const resolveRoute = Router.resolve(view.path)
          if (!resolveRoute) return
          commit('del_cached_view', resolveRoute)
        }

        // 删除tabs
        commit('delete_tabs', menuId)
        // 删除缓存
        if (menu.children && menu.children.length) {
          // 三级菜单，删除所有子菜单的缓存
          for (let i = 0; i < menu.children.length; i++) {
            delCachedView(menu.children[i])
          }
        } else {
          // 二级菜单，删除自己的缓存
          delCachedView(menu)
        }
        resolve({
          visitedViews: [...state.options],
          cachedViews: [...state.cachedViews]
        })
      })
    }
  }
}

function findMenuItem(menuId, menuList) {
  function search(menuList) {
    if (!menuList || !menuList.length) {
      return null
    }

    const [first, ...rest] = menuList

    if (first.menuId == menuId) {
      return first
    }

    if (first.children && first.children.length) {
      const found = findMenuItem(menuId, first.children)
      if (found) {
        return found
      }
    }

    return search(rest)
  }

  return search(menuList)
}

export default menu
