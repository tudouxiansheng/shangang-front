// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('../import.' + process.env.NODE_ENV)
// 公共
// 组织管理
export const organization = [
  {
    path: '/organization',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/organization/manage',
    name: 'OrganizationManagement',
    meta: {
      ref: 'organizationManage',
      methods: ['setFormRules', 'getPermissions'],
      keepAlive: true
    },
    component: _import('common/new-organization/manage.vue')
  }
]
// 用户管理
export const user = [
  {
    path: '/user',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/user/manage',
    name: 'UserManagement',
    meta: {
      ref: 'userManage',
      methods: ['getPermissions'],
      keepAlive: true
    },
    component: _import('common/user/manage')
  },
  {
    path: '/user/dev-allocate',
    name: 'UserDeviceAllocation',
    meta: {
      ref: 'userDevAllocate',
      methods: ['getPermissions'],
      keepAlive: true
    },
    component: _import('common/user/dev-allocate')
  }
]
// 租户管理
export const tenant = [
  {
    path: '/tenant',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/tenant/manage',
    name: 'TenantManagement',
    meta: {
      ref: 'tenantManage',
      methods: ['getPermissions', 'pageResize', 'getIndustry_type'],
      keepAlive: true
    },
    component: _import('common/tenant/manage')
  },
  {
    path: '/tenant/dev-share',
    name: 'TenantDeviceShare',
    meta: {
      ref: 'tenantDevShare',
      methods: ['getPermissions'],
      keepAlive: true
    },
    component: _import('common/tenant/dev-share')
  }
]
// 管理员管理
export const admin = [
  {
    path: '/admin',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/admin/manage',
    name: 'AdministratorManagement',
    meta: {
      ref: 'adminManage',
      methods: ['getPermissions'],
      keepAlive: true
    },
    component: _import('common/admin/manage')
  }
]
// 角色管理
export const role = [
  {
    path: '/role',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/role/manager',
    name: 'RoleManagement',
    meta: {
      ref: 'roleManager',
      methods: ['getPermissions', 'getRoleList', 'findTreeData'],
      keepAlive: true
    },
    component: _import('common/role/manage')
  }
]
// 设备管理
export const device = [
  {
    path: '/device',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/device/main-dev',
    name: 'MainDeviceManagement',
    meta: {
      ref: 'deviceMainDev',
      methods: ['getPermissions', 'pageResize', 'setData', 'applicationTypeData'],
      keepAlive: true
    },
    component: _import('common/device/main-dev')
  },
  {
    path: '/device/main-dev-params-config/:mainDevId',
    name: 'MainDeviceFrontEndParameterConfiguration',
    meta: {
      ref: 'deviceParamsConfig',
      methods: ['initialFunction'],
      keepAlive: false
    },
    component: _import('common/device/params-config')
  },
  {
    path: '/device/camera',
    name: 'CameraManagement',
    meta: {
      ref: 'deviceCamera',
      methods: ['getPermissions', 'pageResize', 'setData', 'applicationTypeData'],
      keepAlive: true
    },
    component: _import('common/device/camera')
  },
  {
    path: '/device/camera-params-config/:cameraId',
    name: 'CameraParameterConfiguration',
    meta: {
      ref: 'deviceParamsConfig',
      methods: ['initialFunction'],
      keepAlive: false
    },
    component: _import('common/device/params-config')
  },
  {
    path: '/device/record-policy',
    name: 'VideoRecordingPolicy',
    meta: {
      ref: 'recordPolicy',
      methods: ['getPermissions', 'getRecordList'],
      keepAlive: true
    },
    component: _import('common/device/record-policy')
  },
  {
    path: '/device/record-policy-params-config',
    name: 'VideoRecordPolicyParamsConfig',
    meta: {
      ref: 'recordPolicyParamsConfig',
      methods: ['getBarChart'],
      keepAlive: true
    },
    component: _import('common/device/record-policy-params-config')
  },
  {
    path: '/device/record-policy-config',
    name: 'VideoRecordPolicyConfig',
    meta: {
      ref: 'recordPolicyConfig',
      methods: [],
      keepAlive: true
    },
    component: _import('common/device/record-policy-config')
  },
  {
    path: '/device/record-policy-manage',
    name: 'VideoRecordPolicyManage',
    meta: {
      ref: 'recordPolicyManage',
      methods: [],
      keepAlive: true
    },
    component: _import('common/device/record-policy-manage')
  },

  {
    path: '/device/information',
    name: 'ImageInformationBase',
    meta: {
      ref: 'deviceInformation',
      methods: ['selectAdapterGateways'],
      keepAlive: true
    },
    component: _import('common/device/imageInformation')
  },

  {
    path: '/device/history-data-sub',
    name: 'CameraHistoryMetadataSubscription',
    meta: {
      ref: 'metaSubscription',
      methods: ['queryAlgorithmPlatList'],
      keepAlive: true
    },
    component: _import('common/device/meta-subscription')
  },
  {
    path: '/device/share-management',
    name: 'DeviceShareManagement',
    meta: {
      ref: 'shareManagement',
      keepAlive: true
    },
    component: _import('common/device/share-management/shareManagement')
  }
]

export const watermark = [
  {
    path: '/watermark',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/system/watermark',
    name: 'SystemWatermark',
    meta: {
      keepAlive: true,
      ref: 'systemWatermark',
      methods: ['getGbWatermarkEnable', 'handleQuery', 'watermarkTypeData']
    },
    component: _import('common/system/system-watermark')
  }
]
// 系统管理
export const system = [
  {
    path: '/system',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/system/cluster-manage',
    name: 'ClusterManagement',
    meta: {
      ref: 'systemClusterManage',
      methods: ['getPermissions', 'getPlatformList'],
      keepAlive: true
    },
    component: _import('common/system/cluster-manage/manage')
  },
  {
    path: '/system/cluster-allocate',
    name: 'ClusterAllocate',
    meta: {
      ref: 'systemClusterAllocate',
      methods: ['getPermissions', 'pageResize'],
      keepAlive: true
    },
    component: _import('common/system/cluster-allocate')
  },
  {
    path: '/system/alarm-type',
    name: 'AlarmTypeManagement',
    meta: {
      ref: 'systemAlarmType',
      methods: ['getPermissions', 'getAlarmTypeList', 'getGroups'],
      keepAlive: true
    },
    component: _import('common/system/alarm-type')
  },
  {
    path: '/system/security',
    name: 'SecurityManagement',
    component:
      process.env.VUE_APP_ENV_NAME !== 'SIOP'
        ? _import('common/system/security')
        : _import('common/system/security/index_vms'),
    meta: {
      ref: 'systemSecurity',
      methods: ['getPermissions', 'getAccountRules', 'getPwdRules', 'setFormRules'],
      keepAlive: true
    }
  },
  {
    path: '/system/business-log',
    name: 'LogManagement',
    component: _import('common/system/business-log'),
    meta: {
      ref: 'systemBusinessLog',
      methods: [
        'getPermissions',
        'pageResize',
        'setData',
        'get_log_List',
        'get_OperationType_List',
        'setData',
        'initTime'
      ],
      keepAlive: true
    }
  },
  {
    path: '/system/dict-area',
    name: 'AreaDictionary',
    meta: {
      keepAlive: true,
      ref: 'areaDivision',
      methods: ['getPermissions', 'getAreaChildAll']
    },
    component: _import('common/system/dict-area')
  },
  {
    path: '/system/licenseInfo',
    name: 'LicenseInfo',
    meta: {
      ref: 'licenseInfo',
      methods: ['getPermissions', 'initLicense', 'getLicense'],
      keepAlive: true
    },
    component: _import('common/system/licenseInfo')
  }
]

// 告警管理
export const alarmManagement = [
  {
    path: '/alarm/management',
    name: 'AlarmLevelManagement',
    meta: {
      ref: 'alarmManagement',
      methods: ['getTemplateList'],
      keepAlive: true
    },
    component: _import('common/alarm/management/index')
  }
]

// 联动管理
export const linkage = [
  {
    path: '/linkage',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/linkage/config',
    name: 'AlarmLinkage',
    meta: {
      ref: 'linkageConfig',
      methods: ['getPermissions', 'getActionList'],
      keepAlive: true
    },
    component: _import('common/linkage/config')
  }
]
// 网关集群管理
export const gatewayCluster = [
  {
    path: '/gatewayCluster',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gatewayCluster/manage',
    name: 'GatewayClusterManagement',
    meta: {
      ref: 'gatewayClusterManage',
      methods: ['getAccessTypeList', 'getList'],
      keepAlive: true
    },
    component: _import('common/gatewayCluster/manage')
  }
]

export const smartSubscriptionSnap = [
  {
    path: 'history-metadata',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/history-metadata/subscribe',
    name: 'SmartSubscriptionCapture',
    meta: {
      ref: 'smartSubscriptionSnap',
      methods: ['cancelSeach', 'getAccessPlatList', 'initialization_Date', 'getAccessPlatList'],
      keepAlive: false
    },
    component: _import('common/smartSubscriptionSnap')
  }
]
export const surveillanceSnap = [
  {
    path: 'surveillance',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/surveillance/snap-list',
    name: 'CaptureManagement',
    component: _import('common/surveillance/snap-list'),
    meta: {
      ref: 'snapList',
      methods: ['getPermissions', 'dateChange', 'pageResize'],
      keepAlive: true
    }
  }
]

export const alarmCenter = [
  {
    path: 'alarm',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/alarm/list',
    name: 'HistoryAlarm',
    meta: {
      ref: 'alarmList',
      methods: [
        'getDatePickerTime',
        'getPermissions',
        'pageResize',
        'getGroups',
        'getAlarmLevel',
        'get_gis_config'
      ],
      keepAlive: true
    },
    component: _import('common/alarm/list')
  },
  {
    path: '/alarm/new-list',
    name: 'LatestAlarm',
    meta: {
      ref: 'newAlarmList',
      methods: ['getGroups', 'bindEvent', 'getAlarmLevel'],
      keepAlive: true
    },
    component: _import('common/alarm/new-alarm')
  },
  {
    path: '/algorithm/guard-alarm',
    name: 'GuardAlarm',
    meta: {
      ref: 'guardAlarm',
      methods: ['getQueryFormCount', 'getAlarmLevel', 'initTime', 'getList'],
      keepAlive: true
    },
    component: _import('center/algorithm/alarm/guard-alarm')
  },
  {
    path: '/algorithm/intelligent-metadata',
    name: 'IntelligentMetadata',
    meta: {
      ref: 'newAlgorithmMetadata',
      methods: [
        'getPermissions',
        'setFormRules',
        'getModelList',
        'getAlgorithmList',
        'getMetadataList'
      ],
      keepAlive: true
    },
    component: _import('center/algorithm/intelligent-metadata')
  }
]

export const intelligentApplication = [
  {
    path: '/algorithm/application',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/algorithm/application/person',
    name: 'TargetApplication',
    meta: {
      ref: 'portraitApplication',
      methods: ['getAccessPlatList', 'getDictionary', 'setDIYTime', 'initWrapperHeight'],
      keepAlive: true
    },
    component: _import('center/algorithm/application/person')
  },
  {
    path: '/algorithm/application/vehicle',
    name: 'VehicleApplication',
    meta: {
      ref: 'vehicleApplication',
      methods: ['getAccessPlatList', 'getDictionary', 'setDIYTime', 'initWrapperHeight'],
      keepAlive: true
    },
    component: _import('center/algorithm/application/vehicle')
  },
  {
    path: '/algorithm/application/track/:deviceList/:type',
    name: 'TrajectoryAnalysis',
    meta: {
      ref: 'track',
      methods: ['deviceListFormattered', 'initMap'],
      keepAlive: false
    },
    component: _import('center/algorithm/application/components/track')
  },
  {
    path: '/algorithm/application/1v1',
    name: 'TargetMatch1v1',
    meta: {
      ref: 'faceMatch1v1',
      methods: ['getNewAlgorithmList'],
      keepAlive: true
    },
    component: _import('center/algorithm/application/face-match-1v1')
  },
  {
    path: '/algorithm/capture-record',
    name: 'CaptureRecord',
    meta: {
      ref: 'captureRecord',
      methods: ['initialization'],
      keepAlive: true
    },
    component: _import('center/algorithm/captureRecord/manage')
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
  }
]

export const common = [
  ...organization, // 组织管理
  ...admin, // 管理员管理
  ...user, // 用户管理
  ...tenant, // 租户管理
  ...role, // 角色管理
  ...device, // 设备管理
  ...watermark, //水印
  ...system, // 系统管理
  ...linkage, // 联动管理
  ...gatewayCluster, // 网关集群管理
  ...alarmManagement // 告警管理
]
export const baseInfoArr = [
  {
    path: '/config/pu-config',
    name: 'FrontEndParameterConfiguration',
    component: _import('common/config/pu-config'),
    meta: {
      ref: 'configPuConfig',
      keepAlive: true
    }
  }
]
// 轮巡管理
export const turning = [
  {
    path: '/turning/addTurning',
    name: 'AddTurningGroup',
    component: _import('common/turning/addTurning'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/turning/modifyTurning',
    name: 'ModifyTurningGroup',
    component: _import('common/turning/addTurning'),
    meta: {
      keepAlive: true
    }
  }
]

// 忘记密码
export const retrievePassword = [
  {
    path: '/retrieve_password',
    name: 'ForgotPassword',
    component: _import('common/retrieve_password')
  }
]
export const client = [
  ...smartSubscriptionSnap,
  ...surveillanceSnap,
  ...alarmCenter,
  ...intelligentApplication
]
