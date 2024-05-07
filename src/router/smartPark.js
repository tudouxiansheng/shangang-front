export default [
  {
    //首页
    path: '/homepage',
    name: 'homepage',
    component: () => import('@/views/mini/pages/index'),
    meta: {
      activeIndex: 0,
    },
  },
  //智能应用
  {
    path: '/algorithm/intelligent-task',
    name: '智能分析任务',
    component: () => import('@/views/mini/pages/common/algorithm/intelligent-task/index.vue'),
  },
  {
    //智能监控
    path: '/device',
    // redirect:"/video/videoSurveillance",
    component: () => import('@/views/mini/pages/intelligentVedio/videoSurveillance'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    //微应用测试
    path: '/avs/*',
    component: () => import('@/views/mini/pages/videoApplication/index'),
  },
  {
    //实时浏览
    path: '/realtime-play',
    component: () => import('@/views/mini/pages/intelligentVedio/videoSurveillance'),
  },
  {
    //录像回放
    path: '/record-playback',
    // redirect:"/video/videoSurveillance",
    component: () => import('@/views/mini/pages/intelligentVedio/videoSurveillance'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    //大屏配置
    path: '/tvwall-setting',
    name: '大屏配置',
    component: () => import('@/views/mini/pages/clientSide/tvwall-setting'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    //大屏配置
    path: '/tvwall-play',
    name: '大屏管控',
    component: () => import('@/views/mini/pages/clientSide/tvwall-play'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    path: '/download-center',
    name: 'download-center',
    component: () => import('@/views/mini/pages/clientSide/download-center'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    //告警中心
    path: '/alarmpage',
    name: 'alarmpage',
    component: () => import('@/views/mini/pages/alarm/info'),
    meta: {
      activeIndex: 1,
    },
  },
  {
    path: '/orderApproval',
    name: '工单审核',
    component: () => import('@/views/mini/pages/orderApproval/orderApproval'),
    meta: {
      keepAlive: true,
    },
  },
  {
    //告警信息
    path: '/alarm/info',
    name: '告警信息',
    component: () => import('@/views/mini/pages/alarm/info'),
    meta: {
      activeIndex: 2,
    },
  },
  {
    //告警统计
    path: '/alarm/statistics',
    name: '告警统计',
    component: () => import('@/views/mini/pages/alarm/statistics'),
    meta: {
      activeIndex: 2,
    },
  },

  {
    //车俩进出统计
    path: '/carpass',
    component: () => import('@/views/mini/pages/passageway/carpass/CarPass'),
  },
  {
    path: '/passageway',
    component: () => import('@/views/mini/pages/passageway/passageway'),
  },
  {
    //人员进出统计
    path: '/facepass',
    component: () => import('@/views/mini/pages/passageway/facepass/FacePass'),
  },
  //人通行统计
  {
    path: '/traffic-statistics',
    component: () => import('@/views/mini/pages/passageway/TrafficStatistics'),
  },
  //巡逻应用
  {
    //巡逻问题
    path: '/requirepage',
    component: () => import('@/views/mini/pages/patrolTask/problem/index'),
    meta: {
      activeIndex: 5,
    },
  },
  {
    //巡逻任务
    path: '/patrol/history',
    component: () => import('@/views/mini/pages/patrolTask/task/index'),
    meta: {
      activeIndex: 5,
    },
  },
  {
    //物联设备
    path: '/eneragepage',
    component: () => import('@/views/mini/pages/equipment/index'),
    meta: {
      activeIndex: 6,
    },
  },
  //人员应用
  {
    path: '/personpage', //personpage
    component: () => import('@/views/mini/pages/IntelligentApplication/person'),
    meta: {
      activeIndex: 3,
    },
  },
  // {
  //   path: '/personpage', //personpage
  //   component: () => import('@/views/mini/pages/personnelApplication/personApplication'),
  //   meta: {
  //     activeIndex: 3,
  //   },
  // },
  //布控任务
  {
    path: '/guard', //guard
    component: () => import('@/views/mini/pages/control'),
    meta: {
      activeIndex: 3,
    },
  },
  // {
  //   //车辆应用
  //   path: '/carpage',
  //   component: () => import('@/views/mini/pages/vehicleApplications/vehicleApplications'),
  // },
  {
    //车辆应用
    path: '/carpage',
    component: () => import('@/views/mini/pages/IntelligentApplication/car'),
  },
  {
    //车辆应用
    path: '/trail',
    name: 'trail',
    component: () => import('@/views/mini/pages/IntelligentApplication/trail'),
  },
  {
    //公告
    path: '/enivpage',
    component: () => import('@/views/mini/pages/residentService/base'),
    meta: {
      activeIndex: 7,
    },
  },
  {
    //考勤
    path: '/attendance',
    component: () => import('@/views/mini/pages/attendance/index'),
    meta: {
      activeIndex: 8,
    },
  },
  {
    //
    path: '/visitor',
    component: () => import('@/views/mini/pages/visitor/index'),
    meta: {
      activeIndex: 9,
    },
  },
  {
    path: '/algorithm',
    component: () => import('@/views/mini/pages/algorithm/index'),
  },
  {
    path: '/myTask',
    name: '我的任务',
    component: () => import('@/views/mini/pages/myTask/index'),
  },
  {
    path: '/artificial',
    name: 'AI算法',
    component: () => import('@/views/mini/pages/artificial/index'),
  },
  {
    path: '/aiScreen',
    name: 'AI算法大屏',
    component: () => import('@/views/mini/pages/aiScreen/index'),
  },
  {
    path: '/ProductCenter',
    name: '算法应用',
    component: () => import('@/views/mini/pages/productCenter/ProductCenter'),
    children: [
      {
        path: '/ProductCenter',
        component: () => import('@/views/mini/pages/productCenter/components/productCenterContent'),
      },

      {
        path: '/ProductCenter/detail',
        component: () => import('@/views/mini/pages/productCenter/components/detail'),
      },
      {
        path: '/ProductCenter/detailTwo',
        component: () => import('@/views/mini/pages/productCenter/components/detailTwo'),
      },
    ],
  },

  //新增
  {
    path: '/gatewayCluster/manage',
    name: 'GatewayClusterManagement',
    meta: {
      ref: 'gatewayClusterManage',
      methods: ['getAccessTypeList', 'getList'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/gatewayCluster/manage'),
  },
  {
    path: '/accessPlatform/manage',
    name: 'AccessPlatformManagement',
    meta: {
      ref: 'accessPlatformrManage',
      methods: ['setDate', 'getDictionaryList', 'getAccessTypeList'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/center/accessPlatform/manage'),
  },
  {
    path: '/vPaasAccessPlatform/manage',
    name: 'VpaasAccessPlatformManagement',
    meta: {
      ref: 'vpaasAccessPlatform',
      methods: [],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/center/vpaasAccessPlatform/manage'),
  },
  {
    path: '/accessCamera/allocate',
    name: 'AccessCameraAllocate',
    meta: {
      ref: 'accessCameraAllocate',
      methods: ['setData'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/center/accessCamera/allocate'),
  },
  {
    path: '/device/main-dev',
    name: 'MainDeviceManagement',
    meta: {
      ref: 'deviceMainDev',
      methods: ['getPermissions', 'pageResize', 'setData', 'applicationTypeData'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/device/main-dev'),
  },
  {
    path: '/device/main-dev-params-config/:mainDevId',
    name: 'MainDeviceFrontEndParameterConfiguration',
    meta: {
      ref: 'deviceParamsConfig',
      methods: ['initialFunction'],
      keepAlive: false,
    },
    component: () => import('@/views/mini/pages/common/device/params-config'),
  },
  {
    path: '/device/camera',
    name: 'CameraManagement',
    meta: {
      ref: 'deviceCamera',
      methods: ['getPermissions', 'pageResize', 'setData', 'applicationTypeData'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/device/camera'),
  },
  {
    path: '/device/camera-params-config/:cameraId',
    name: 'CameraParameterConfiguration',
    meta: {
      ref: 'deviceParamsConfig',
      methods: ['initialFunction'],
      keepAlive: false,
    },
    component: () => import('@/views/mini/pages/common/device/params-config'),
  },
  {
    path: '/device/record-policy',
    name: 'VideoRecordingPolicy',
    meta: {
      ref: 'recordPolicy',
      methods: ['getPermissions', 'getRecordList'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/device/record-policy'),
  },
  {
    path: '/device/share-management',
    name: 'DeviceShareManagement',
    meta: {
      ref: 'shareManagement',
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/device/share-management/shareManagement'),
  },
  {
    path: '/organization/manage',
    name: 'OrganizationManagement',
    meta: {
      ref: 'organizationManage',
      methods: ['setFormRules', 'getPermissions'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/new-organization/manage.vue'),
  },
  {
    path: '/role/manager',
    name: 'RoleManagement',
    meta: {
      ref: 'roleManager',
      methods: ['getPermissions', 'getRoleList', 'findTreeData'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/role/manage'),
  },
  {
    path: '/admin/manage',
    name: 'AdministratorManagement',
    meta: {
      ref: 'adminManage',
      methods: ['getPermissions'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/admin/manage'),
  },
  {
    path: '/alarm/handlePlan',
    name: '告警处置预案',
    meta: {
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/AlarmManage/AlarmHandlingPlan/AlarmHandlingPlan'),
  },
  {
    path: '/alarm/management',
    name: 'AlarmLevelManagement',
    meta: {
      ref: 'alarmManagement',
      methods: ['getTemplateList'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/alarm/management/index'),
  },
  {
    path: '/system/alarm-type',
    name: 'AlarmTypeManagement',
    meta: {
      ref: 'systemAlarmType',
      methods: ['getPermissions', 'getAlarmTypeList', 'getGroups'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/system/alarm-type'),
  },
  {
    path: '/linkage/config',
    name: 'AlarmLinkage',
    meta: {
      ref: 'linkageConfig',
      methods: ['getPermissions', 'getActionList'],
      keepAlive: true,
    },
    component: () => import('@/views/mini/pages/common/linkage/config'),
  },
]
