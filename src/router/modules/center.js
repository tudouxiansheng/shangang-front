const _import = require('../import.' + process.env.NODE_ENV)
// 中台
// 算法管理
// 算法配置
export const algorithm_management = [
  {
    path: '/algorithm/management',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/algorithm/access/manage',
    name: 'AlgorithmAccessManagement',
    meta: {
      ref: 'algorithmAccess',
      methods: ['setData', 'getDictionaryList', 'getAccessTypeList'],
      keepAlive: true
    },
    component: _import('center/algorithm/newAccess/manage')
  },
  {
    path: '/algorithm/model/manage',
    name: 'AlgorithmModelManagement',
    meta: {
      ref: 'modelManage',
      methods: ['getPermissions', 'getDictionary', 'getGroups', 'getAlgorithmModelList'],
      keepAlive: true
    },
    component: _import('center/algorithm/model/manage')
  },
  {
    path: '/algorithm/manage',
    name: 'AlgorithmManagement',
    meta: {
      ref: 'newAlgorithmList',
      methods: [
        'getPermissions',
        'getAlgorithmAccessList',
        'getAlgorithmModelList',
        'getAlgorithmList'
      ],
      keepAlive: true
    },
    component: _import('center/algorithm/manage')
  },
  {
    path: '/algorithm/allocate/manage',
    name: 'AlgorithmAllocate',
    meta: {
      ref: 'allocateManage',
      methods: ['setData', 'getPermissions', 'setFormRules', 'getTenantAlgoResource'],
      keepAlive: true
    },
    component: _import('center/algorithm/allocate/manage')
  }
]
export const algorithm = [
  {
    path: '/algorithm',
    meta: {
      keepAlive: true
    }
  },
  ...algorithm_management, // 算法配置

  {
    path: '/algorithm/intelligent-task',
    name: 'IntelligentAnalysisTask',
    meta: {
      ref: 'intelligentAnalysisTask',
      methods: ['getQueryFormCount', 'getDictionary', 'getList'],
      keepAlive: true
    },
    component: _import('center/algorithm/intelligent-task/manage')
  },
  {
    path: '/algorithm/intelligent-task-add',
    name: 'CreateIntelligentAnalysisTask',
    meta: {
      ref: 'addIntelligentAnalysisTask',
      keepAlive: false,
      methods: ['initWrapperHeight', 'getTenantAlgorithm']
    },
    component: _import('center/algorithm/intelligent-task/addTask')
  },
  {
    path: '/algorithm/identification-template',
    name: 'AlgorithmIdentificationConfiguration',
    meta: {
      ref: 'identificationTemplate',
      methods: ['getGroupList'],
      keepAlive: true
    },
    component: _import('center/algorithm/identification-template/manage')
  },

  {
    path: '/algorithm/device-guard',
    name: 'DeviceGuardTask',
    meta: {
      ref: 'newControlTask',
      methods: ['setData', 'getGuardLibList', 'getList', 'getAlgorithmModelList'],
      keepAlive: true
    },
    component: _import('center/algorithm/guard/controlTask')
  },
  {
    path: '/algorithm/task-detail/:id',
    name: 'GuardTaskDetail',
    meta: {
      ref: 'taskDetail',
      methods: ['setDate', 'getDictionary', 'getAlarmLevel', 'getGuardInfo'],
      keepAlive: false
    },
    component: _import('center/algorithm/guard/component/taskDetail')
  },
  {
    path: '/algorithm/repository/person',
    name: 'TargetGuardRepository',
    meta: {
      ref: 'newPersonRepo',
      methods: ['initWrapperHeight'],
      keepAlive: true
    },
    component: _import('center/algorithm/repository/person')
  },
  {
    path: '/algorithm/repository/vehicle',
    name: 'VehicleGuardRepository',
    meta: {
      ref: 'newVehicleRepo',
      methods: ['initWrapperHeight', 'getDictionaryLists'],
      keepAlive: true
    },
    component: _import('center/algorithm/repository/vehicle')
  },
  {
    path: '/algorithm/repository'
  },
  {
    path: '/algorithm/task-overview',
    name: 'IntelligentTasksOverview',
    meta: {
      ref: 'taskOverview',
      methods: ['getMetadata', 'getguardHit', 'getEdgeProperties', 'getTaskTotal'],
      keepAlive: true
    },
    component: _import('center/algorithm/taskOverview/manage')
  },
  {
    path: '/algorithm/dev-model',
    name: 'AlgorithmDeviceModelManagement',
    meta: {
      ref: 'deviceModel',
      methods: ['getDictionaryList'],
      keepAlive: true
    },
    component: _import('center/algorithm/dev-model')
  }
]

// 视图库
export const gat1400 = [
  {
    path: '/gat1400',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gat1400/device',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gat1400/cascadeDevice',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gat1400/device/manage',
    name: 'AcquisitionDeviceManagement',
    meta: {
      ref: 'gat1400Device',
      methods: ['pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/device/manage')
  },
  {
    path: '/gat1400/tollgate/manage',
    name: 'TollgateManagement',
    meta: {
      ref: 'tollgateManage',
      methods: ['pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/tollgate/manage')
  },
  {
    path: '/gat1400/lane/manage',
    name: 'LaneManagement',
    meta: {
      ref: 'laneManage',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary', 'getTollgate'],
      keepAlive: true
    },
    component: _import('center/gat1400/lane/manage')
  },
  {
    path: '/gat1400/platform/manage',
    name: 'ViewLibraryPlatformManagement',
    meta: {
      ref: 'gat1400Platform',
      methods: ['pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/platform/manage')
  },
  {
    path: '/gat1400/snap/manage',
    name: 'ViewLibrarySnap',
    meta: {
      ref: 'gat1400Snap',
      methods: ['getSearchTypeList'],
      keepAlive: true
    },
    component: _import('center/gat1400/snap/manage')
  },
  {
    path: '/gat1400/mainDev/manage',
    name: 'ViewLibraryMainDeviceManagement',
    meta: {
      ref: 'gat1400MainDevManage',
      keepAlive: true
    },
    component: _import('center/gat1400/mainDev/manage')
  },
  {
    path: '/gat1400/ownDomainViewClass',
    name: 'LocalDomainViewLibrary',
    meta: {
      ref: 'gat1400OwnDomainViewClass',
      methods: ['setFormRules', 'getLocalPlatInfo'],
      keepAlive: true
    },
    component: _import('center/gat1400/ownDomainViewClass')
  },
  {
    path: '/gat1400/superiorDevAssociate',
    name: 'SuperiorViewLibraryDeviceAssociate',
    meta: {
      ref: 'gat1400SuperiorDevAssociate',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/superiorDevAssociate/manage')
  },
  {
    path: '/gat1400/juniorDevAssociate',
    name: 'JuniorViewLibraryDeviceAllocate',
    meta: {
      ref: 'gat1400JuniorDevAssociate',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/juniorDevAssociate/manage')
  },
  {
    path: '/gat1400/allocateDevice/manage',
    name: 'AllocateDeviceManagement',
    meta: {
      ref: 'gat1400AllocateDeviceManage',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/allocateDevice/manage')
  },
  {
    path: '/gat1400/allocateTollgate/manage',
    name: 'AllocateTollgateManagement',
    meta: {
      ref: 'gat1400AllocateTollgateManage',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/allocateTollgate/manage')
  },
  {
    path: '/gat1400/allocateLane/manage',
    name: 'AllocateLaneManagement',
    meta: {
      ref: 'gat1400AllocateLaneManage',
      methods: ['getTree', 'pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/allocateLane/manage')
  },
  {
    path: '/gat1400/aps/manage',
    name: 'ApsSystemManagement',
    meta: {
      ref: 'gat1400ApsManage',
      methods: ['pageResize', 'setData', 'getDictionary'],
      keepAlive: true
    },
    component: _import('center/gat1400/aps/manage')
  }
]

// 接入平台管理
export const accessPlatform = [
  {
    path: '/accessPlatform',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/accessPlatform/manage',
    name: 'AccessPlatformManagement',
    meta: {
      ref: 'accessPlatformrManage',
      methods: ['setDate', 'getDictionaryList', 'getAccessTypeList'],
      keepAlive: true
    },
    component: _import('center/accessPlatform/manage')
  }
]
// vpaas外域管理
export const vpaasAccessPlatform = [
  {
    path: '/vPaasAccessPlatform',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/vPaasAccessPlatform/manage',
    name: 'VpaasAccessPlatformManagement',
    meta: {
      ref: 'vpaasAccessPlatform',
      methods: [],
      keepAlive: true
    },
    component: _import('center/vpaasAccessPlatform/manage')
  }
]
// 国标共享管理
export const GBShare = [
  {
    path: 'GBShare',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/GBShare/manage',
    name: 'GBShareManagement',
    meta: {
      ref: 'accessCameraAllocate',
      methods: ['getAccessPlatList', 'setData'],
      keepAlive: true
    },
    component: _import('center/GBShare/manage')
  }
]
// 接入摄像机分配
export const accessCamera = [
  {
    path: 'accessCamera',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/accessCamera/allocate',
    name: 'AccessCameraAllocate',
    meta: {
      ref: 'accessCameraAllocate',
      methods: ['setData'],
      keepAlive: true
    },
    component: _import('center/accessCamera/allocate')
  }
]
/* 运维统计 */
export const operationStatistics = [
  // 设备在线离线统计
  {
    path: '/statistics/device-online',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/statistics/device-online/newOffline',
    name: 'newOffline',
    meta: {
      keepAlive: false,
      methods: ['getPermissions', 'timesForamtter'],
      ref: 'offline'
    },
    component: () =>
      import('@/views/center/operationManage/videoOperation/device-online/newOffline')
  },
  {
    path: '/statistics/device-online/newLong-offline',
    name: 'newLongOffline',
    meta: {
      keepAlive: false,
      methods: ['getPermissions'],
      ref: 'longOffline'
    },
    component: () =>
      import('@/views/center/operationManage/videoOperation/device-online/newLong-offline')
  },
  {
    path: '/statistics/device-online/newOfflineDetails',
    name: 'newOfflineDetails',
    meta: {
      keepAlive: false,
      methods: ['timesForamtter', 'getPermissions'],
      ref: 'longOffline'
    },
    component: () =>
      import('@/views/center/operationManage/videoOperation/device-online/newOfflineDetails')
  },
  {
    path: '/bms/video-quality-check',
    name: 'VideoQualityRoundTour',
    meta: {
      keepAlive: true,
      methods: [],
      ref: 'videoQualityPatrol'
    },
    component: () => import('@/views/center/operationManage/videoQualityPatrol')
  },
  {
    path: '/bms/video-quality-check/camera-quality-detail/:id/:name/:type',
    name: 'CameraQualityDetail',
    meta: {
      keepAlive: false,
      methods: ['getRouteParams', 'getCameraQualityBase', 'timesFormatter', 'selectedTimeChange'],
      ref: 'cameraVideoQualityDetail'
    },
    component: () =>
      import(
        '@/views/center/operationManage/videoQualityPatrol/components/camera-video-quality/components/detail'
      )
  },
  {
    path: '/bms/video-quality-check/task-detail/:id/:name',
    name: 'VideoQualityTaskDetails',
    meta: {
      keepAlive: false,
      methods: [
        'getRouteParams',
        'getVideoQualityMainTaskDetail',
        'getVideoQualityMainTaskExecutionList',
        'selectedTimeChange'
      ],
      ref: 'videoQualityTaskDetail'
    },
    component: () =>
      import(
        '@/views/center/operationManage/videoQualityPatrol/components/video-quality-task/components/detail'
      )
  }
]

export const center = [
  ...algorithm, // 算法管理
  ...gat1400, // 视图库
  ...accessPlatform, // 接入平台管理
  ...vpaasAccessPlatform, // vpaas外域平台管理
  ...GBShare, // 国标共享管理
  ...accessCamera, // 接入摄像机分配
  ...operationStatistics //运维统计
]

export const cruisePlan = [
  {
    path: '/cruise-plan/:cameraId',
    name: 'CruisePlan',
    component: () => import('@/views/center/cruise'),
    meta: {
      ref: 'cruisePlan',
      keepAlive: true
    }
  }
]

export const scenarioTurining = [
  {
    path: '/scenario-turining/:tvWallId',
    name: 'PrePlanRoundTour',
    component: () => import('@/views/center/scenarioMange/scenarioTurining.vue'),
    meta: {
      ref: 'scenarioTurining',
      keepAlive: true
    }
  }
]
export const scenarioPlan = [
  {
    path: '/scenario-plan/:tvWallId',
    name: 'ScenarioPlan',
    component: () => import('@/views/center/scenarioMange/scenarioPlan.vue'),
    meta: {
      ref: 'scenarioPlan',
      keepAlive: true
    }
  }
]
