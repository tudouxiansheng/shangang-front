import { common, baseInfoArr, turning, retrievePassword, client } from './modules/common' //中台

import { center, cruisePlan, scenarioTurining, scenarioPlan } from './modules/center' //中台

import { gisIndex } from './modules/gis'
const siop = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../login.vue'),
    alias: ''
  },
  ...turning,
  ...baseInfoArr,
  ...cruisePlan,
  ...scenarioTurining,
  ...scenarioPlan,
  ...(process.env.VUE_APP_ENV_NAME !== 'SIOP' ? retrievePassword : []),
  {
    path: '',
    name: 'appMain',
    component: () => import('@/components/app-main'),
    children: [
      ...common, // 公共
      ...center, // 中台
      ...gisIndex, // 地图
      ...client //客户端菜单页面
    ]
  }
]
const siop_web = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../login'),
    alias: ''
  },
  ...retrievePassword,
  {
    path: '',
    name: 'appMain',
    component: () => import('@/components/app-main'),
    children: [
      ...common, // 公共
      ...center, // 中台
      ...gisIndex // 地图
    ]
  }
]
const siop_client = [
  ...turning,
  ...baseInfoArr,
  ...cruisePlan,
  ...scenarioTurining,
  ...scenarioPlan,
  {
    path: '',
    name: 'appMain',
    component: () => import('@/components/app-main'),
    children: [
      ...client, // 客户端
      ...gisIndex // 地图
    ]
  }
]

// 重新组织后导出
export default process.env.VUE_APP_CLIENT_TYPE === 'CLIENT'
  ? siop_client
  : process.env.VUE_APP_CLIENT_TYPE === 'WEB'
  ? siop_web
  : siop
