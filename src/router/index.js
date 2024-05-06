import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import smartPark from './smartPark' //智慧园区

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '',
    name: 'AppMain',
    component: () => import('@/components/AppMain'),
    children: [...smartPark],
  },
]
const router = new Router({
  mode: 'history',
  base: '/AIV-MP/',
  routes,
})
export default router

router.beforeEach((to, from, next) => {
  let isLogin = sessionStorage.getItem('token')
  if (isLogin) {
    //如果用户信息存在则往下执行。
    if (to.path === '/login') {
      // window.location.reload(true)
      sessionStorage.clear()
      // window.location.reload()

      setTimeout(() => {
        store.commit('set_options')
      }, 200)
    }
    next()
  } else {
    //如果用户token不存在则跳转到login页面
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
