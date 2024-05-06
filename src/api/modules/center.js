//center 中台

export default ({ postFetch }) => ({
  /*
        算法模型管理
    */
  // 算法模型列表
  getAlgorithmModelList: data => postFetch('/uas/v1/api/ars/algorithm/model/list', data),
  // 算法模型信息
  getAlgorithmModel: data => postFetch('/uas/v1/api/ars/algorithm/model/info', data),
  // 添加模型信息
  addAlgorithmModel: data => postFetch('/uas/v1/api/ars/algorithm/model/add', data),
  // 修改模型信息
  modifyAlgorithmModel: data => postFetch('/uas/v1/api/ars/algorithm/model/modify', data),
  // 删除模型信息
  deleteAlgorithmModel: data => postFetch('/uas/v1/api/ars/algorithm/model/delete', data),

  /*
        算法分配
    */
  // 查询租户拥有的算法
  getTenantAlgorithmResource: data => postFetch('/uas/v1/api/ars/tenant/algorithm/list', data),
  // 查询用户拥有的算法
  getUserAlgorithmList: data => postFetch('/uas/v1/api/ars/user/algorithm/list', data),
  // 查询子租户可新增分配的算法资源列表
  getTenantAllocateAvailable: data =>
    postFetch('/uas/v1/api/ars/algorithm/tenant-allocate-available', data),
  // 查询用户可新增分配的算法资源列表
  getUserAllocateAvailable: data =>
    postFetch('/uas/v1/api/ars/algorithm/user-allocate-available', data),
  // 为租户分配算法资源
  allocateToTenant: data => postFetch('/uas/v1/api/ars/algorithm/allocate-to-tenant', data),
  // 为用户分配算法资源
  allocateToUser: data => postFetch('/uas/v1/api/ars/algorithm/allocate-to-user', data),
  // 修改租户分配算法
  modifyTenantAllocateInfo: data =>
    postFetch('/uas/v1/api/ars/algorithm/tenant-allocated-modify', data),
  // 修改用户分配算法
  modifyUserAllocateInfo: data =>
    postFetch('/uas/v1/api/ars/algorithm/user-allocated-modify', data),
  // 取消租户分配算法资源
  cancelTenantAllocate: data => postFetch('/uas/v1/api/ars/algorithm/cancel-tenant-allocate', data),
  // 取消用户分配算法资源
  cancelUserAllocate: data => postFetch('/uas/v1/api/ars/algorithm/cancel-user-allocate', data),

  /*
        算法接入信息
    */
  // 算法接入信息添加
  addAlgorithmAccessInfo: data => postFetch('/uas/v1/api/ars/algorithm/access/add', data),
  // 算法接入信息修改
  modifyAlgorithmAccessInfo: data => postFetch('/uas/v1/api/ars/algorithm/access/modify', data),
  // 算法接入信息删除
  deleteAlgorithmAccessInfo: data => postFetch('/uas/v1/api/ars/algorithm/access/delete', data),
  // 算法接入信息列表
  getAlgorithmAccessList: data => postFetch('/uas/v1/api/ars/algorithm/access/list', data),
  // 算法接入信息详情
  getAlgorithmAccessInfo: data => postFetch('/uas/v1/api/ars/algorithm/access/info', data),

  // 算法接入信息添加（新）
  addAlgorithmAccessInfoNew: data => postFetch('/uas/v1/api/ars/algorithm/access/add', data),

  // 查平台调用这个接口
  queryAlgorithmPlatList: data => postFetch('/uas/v1/api/ars/algorithm/access/query', data),

  /*
        算法管理
    */
  // 算法管理添加
  addNewAlgorithmInfo: data => postFetch('/uas/v1/api/ars/algorithm/add', data),
  // 算法管理修改
  modifyNewAlgorithmInfo: data => postFetch('/uas/v1/api/ars/algorithm/modify', data),
  // 算法管理删除
  deleteNewAlgorithmInfo: data => postFetch('/uas/v1/api/ars/algorithm/delete', data),
  // 算法管理列表
  getNewAlgorithmList: data => postFetch('/uas/v1/api/ars/algorithm/list', data),
  // 算法管理列表 能力接口
  queryNewAlgorithmList: data => postFetch('/uas/v1/api/ars/algorithm/query', data),
  // 算法管理详情
  getNewAlgorithmInfo: data => postFetch('/uas/v1/api/ars/algorithm/info', data),

  /*
        智能分析任务
    */
  // 智能分析任务添加
  addNewTaskInfo: data => postFetch('/uas/v1/api/ars/task/add', data),
  // 智能分析任务修改
  modifyNewTaskInfo: data => postFetch('/uas/v1/api/ars/task/modify', data),
  // 智能分析任务删除
  deleteNewTaskInfo: data => postFetch('/uas/v1/api/ars/task/delete', data),
  // 智能分析任务列表
  getNewTaskList: data => postFetch('/uas/v1/api/ars/task/list', data),
  // 智能分析任务详情
  getNewTaskInfo: data => postFetch('/uas/v1/api/ars/task/info', data),
  // 智能分析任务重启
  startNewTask: data => postFetch('/uas/v1/api/ars/task/restart', data),
  // 智能分析任务停止
  stopNewTask: data => postFetch('/uas/v1/api/ars/task/stop', data),
  // 查询任务摄像机预置位是否可能冲突
  mayConflict: data => postFetch('/uas/v1/api/ars/task/preset/conflict', data),

  /*
        算法画线
    */
  //查询算法画线列表
  queryAlgorithmRule: data => postFetch('/uas/v1/api/ars/algorithm/rule/query/list', data),
  //查询算法画线列表(详情)
  searchAlgorithmRuleById: data => postFetch('/uas/v1/api/ars/algorithm/rule/query/id', data),
  //根据算法id查询已绑定算法画线模板
  searchAlgorithmRuleByAlgorithm: data =>
    postFetch('/uas/v1/api/ars/algorithm/rule/query/algorithm', data),
  //创建算法画线模板
  addAlgorithmRule: data => postFetch('/uas/v1/api/ars/algorithm/rule/add', data),
  //删除算法画线模板
  deleteAlgorithmRule: data => postFetch('/uas/v1/api/ars/algorithm/rule/delete', data),
  //启停算法画线模板
  changeAlgorithmRuleStatus: data =>
    postFetch('/uas/v1/api/ars/algorithm/rule/change-status', data),
  //修改算法画线模板
  modifyAlgorithmRule: data => postFetch('/uas/v1/api/ars/algorithm/rule/modify', data),

  /*
        布控管理
    */
  //查询布控列表
  getNewGuardList: data => postFetch('/uas/v1/api/ars/guard/list', data),
  // 查询布控列表 能力接口
  queryNewGuardList: data => postFetch('/uas/v1/api/ars/guard/query', data),
  //创建布控任务
  addNewGuardInfo: data => postFetch('/uas/v1/api/ars/guard/add', data),
  //修改布控任务
  modifyNewGuardInfo: data => postFetch('/uas/v1/api/ars/guard/modify', data),
  //删除布控任务
  deleteNewGuardInfo: data => postFetch('/uas/v1/api/ars/guard/delete', data),
  //单个布控任务信息
  getNewGuardInfo: data => postFetch('/uas/v1/api/ars/guard/info', data),
  //启用/停用布控
  enableGuard: data => postFetch('/uas/v1/api/ars/guard/enable', data),
  //布控执行情况查询
  getGuardExecutionLog: data => postFetch('/uas/v1/api/ars/guard/execution/log', data),
  //布控命中查询
  getGuardHitList: data => postFetch('/uas/v1/api/ars/guard/hit/list', data),
  // 智能告警详情
  getGuardHitInfo: data => postFetch('/uas/v1/api/ars/guard/hit/info', data),
  // 元数据周期统计
  getEdgeProperties: data => postFetch('/uas/v1/api/ars/algorithm/model/edge/properties', data),
  // 删除布控源 (多个布控源设备或任务的其中有部分被删除时调用)
  delSource: data => postFetch('/uas/v1/api/ars/guard/remove-deleted-source', data),
  /*
        元数据
    */
  //统计任务数
  getTaskTotal: data => postFetch('/uas/v1/api/ars/task/total', data),
  //元数据列表
  getMetadataList: data => postFetch('/uas/v1/api/ars/metadata/list', data),
  searchMetadataList: data => postFetch('/uas/v1/api/ars/metadata/search', data),
  //元数据详情
  getMetadataInfo: data => postFetch('/uas/v1/api/ars/metadata/info', data),
  //元数据当日抓拍
  getMetadata: data => postFetch('/uas/v1/api/ars/metadata/total', data),
  //告警统计
  getguardHit: data => postFetch('/uas/v1/api/ars/guardHit/total', data),
  //元数据周期统计
  getWeekCount: data => postFetch('/uas/v1/api/ars/metadata/week-count', data),
  //车辆元数据检索
  getVehData: data => postFetch('/uas/v1/api/ars/intelligentapp/search/vehicle', data),
  //目标元数据检索
  getFaceData: data => postFetch('/uas/v1/api/ars/intelligentapp/search/person', data),
  // 获取3800平台映射关系
  getCameraPlat: data => postFetch('/uas/v1/api/ars/plat/get-camera-plat', data),

  /**
   * 智能应用
   * */
  // 车辆图片检索
  searchVehicleByImage: data =>
    postFetch('/uas/v1/api/ars/intelligent-app/vehicle/searchByImage', data),
  // 车辆条件检索
  searchVehicleByCondition: data =>
    postFetch('/uas/v1/api/ars/intelligent-app/vehicle/searchByCondition', data),
  // 目标图片检索
  searchFaceByImage: data => postFetch('/uas/v1/api/ars/intelligent-app/face/searchByImage', data),
  // 目标条件检索
  searchFaceByCondition: data =>
    postFetch('/uas/v1/api/ars/intelligent-app/face/searchByCondition', data),
  // 目标整体图片检索
  searchBodyByImage: data => postFetch('/uas/v1/api/ars/intelligent-app/body/searchByImage', data),
  // 目标整体条件检索
  searchBodyByCondition: data =>
    postFetch('/uas/v1/api/ars/intelligent-app/body/searchByCondition', data),

  /*
        目标库
    */
  //目标库列表
  getPersonRepositoryList: data => postFetch('/uas/v1/api/ars/person/repository/list', data),
  //创建人员库
  addNewRepositoryInfo_people: data => postFetch('/uas/v1/api/ars/person/repository/add', data),
  //修改人员库
  modifyNewRepositoryInfo: data => postFetch('/uas/v1/api/ars/person/repository/modify', data),
  //删除人员库
  deleteNewRepositoryInfo: data => postFetch('/uas/v1/api/ars/person/repository/delete', data),
  //查询单个人员库信息
  getNewRepositoryInfo: data => postFetch('/uas/v1/api/ars/person/repository/info', data),

  /*
        人员管理
     */
  //添加人员
  addNewPersonInfo: data => postFetch('/uas/v1/api/ars/repository/person/add', data),
  // 批量添加人员
  batchAddNewPerson: data => postFetch('/uas/v1/api/ars/repository/person/batch/add', data, 60000),
  //修改人员
  modifyNewPersonInfo: data => postFetch('/uas/v1/api/ars/repository/person/modify', data),
  //删除人员
  deleteNewPersonInfo: data => postFetch('/uas/v1/api/ars/repository/person/delete', data),
  //查询单个人员信息
  getNewPersonInfo: data => postFetch('/uas/v1/api/ars/repository/person/info', data),
  //查询人员列表
  getRepositoryPersonList: data => postFetch('/uas/v1/api/ars/repository/person/list', data),
  //人员库批量导入人员模板下载
  downloadPersonTemplate: data =>
    postFetch('/uas/v1/api/ars/repository/person/template/download', data),

  /*
        车辆库
    */
  //车辆库列表
  getVehicleRepositoryList: data => postFetch('/uas/v1/api/ars/vehicle/repository/list', data),
  //添加车辆库
  addNewCar: data => postFetch('/uas/v1/api/ars/vehicle/repository/add', data),
  //修改车辆库
  modifyNewCar: data => postFetch('/uas/v1/api/ars/vehicle/repository/modify', data),
  //删除车辆库
  deleteNewCar: data => postFetch('/uas/v1/api/ars/vehicle/repository/delete', data),
  //查询单个车辆库信息
  getNewCar: data => postFetch('/uas/v1/api/ars/vehicle/repository/info', data),
  downloadVehicleTemplate: data =>
    postFetch('/uas/v1/api/ars/repository/vehicle/template/download', data),
  /*
        车辆管理
     */
  //添加车辆
  addNewVehicleInfo: data => postFetch('/uas/v1/api/ars/repository/vehicle/add', data),
  // 批量添加车辆
  batchAddNewVehicle: data =>
    postFetch('/uas/v1/api/ars/repository/vehicle/batch/add', data, 60000),
  //修改车辆
  modifyNewVehicleInfo: data => postFetch('/uas/v1/api/ars/repository/vehicle/modify', data),
  //删除车辆
  deleteNewVehicleInfo: data => postFetch('/uas/v1/api/ars/repository/vehicle/delete', data),
  //查询单个车辆信息
  getNewVehicleInfo: data => postFetch('/uas/v1/api/ars/repository/vehicle/info', data),
  //查询车辆列表
  getRepositoryVehicleList: data => postFetch('/uas/v1/api/ars/repository/vehicle/list', data),
  //车辆库批量添加车辆
  importVehicleInfo: data => postFetch('/uas/v1/api/ars/repository/vehicle/import', data),
  //车辆库批量导入车辆模板下载
  importVehicleInfoTemplate: data => postFetch('/uas/v1/api/ars/repository/vehicle/template', data),
  // 布控库批量导入配置
  getRepoImportConfig: data => postFetch('/uas/v1/api/ars/import-config/get', data),

  /*
        设备模型管理
    */
  //查询包含元数据模型的设备列表
  getDeviceList: data => postFetch('/uas/v1/api/ars/model/dev-list', data),
  //查询设备元数据模型关联详情
  getAssociationInfo: data => postFetch('/uas/v1/api/ars/model-dev/association', data),
  //单个设备关联元数据模型
  associate: data => postFetch('/uas/v1/api/ars/model-dev/associate', data),
  //批量设备关联元数据模型
  batchAssociate: data => postFetch('/uas/v1/api/ars/model-dev/batch-associate', data),

  /*
        采集设备管理
    */
  // 获取采集设备列表信息
  getApeList: data => postFetch('/uvs/v1/api/vir/ape/list', data),
  // 获取采集设备详情
  getApeDetail: data => postFetch('/uvs/v1/api/vir/ape/detail', data),
  // 添加采集设备
  addApe: data => postFetch('/uvs/v1/api/vir/ape/add', data),
  // 修改采集设备
  updateApe: data => postFetch('/uvs/v1/api/vir/ape/update', data),
  // 删除采集设备
  delApe: data => postFetch('/uvs/v1/api/vir/ape/del', data),
  // 区域组织树
  getAreaList: data => postFetch('/uvs/v1/api/udc/sub-area/list', data),
  // 判断设备是否为下级划拨的设备
  checkassociateApe: data => postFetch('/uvs/v1/api/vir/ape/checkassociate', data),

  /*
        卡口管理
    */
  // 获取卡口列表
  getTollgatesForPage: data => postFetch('/uvs/v1/api/vir/tollgate/list', data),
  // 获取卡口详情
  getTollgateDetail: data => postFetch('/uvs/v1/api/vir/tollgate/detail', data),
  // 添加卡口
  addTollgate: data => postFetch('/uvs/v1/api/vir/tollgate/add', data),
  // 修改卡口
  updateTollgate: data => postFetch('/uvs/v1/api/vir/tollgate/update', data),
  // 删除卡口
  delTollgate: data => postFetch('/uvs/v1/api/vir/tollgate/del', data),

  /*
        车道管理
    */
  // 获取车道列表
  getLanesForPage: data => postFetch('/uvs/v1/api/vir/lane/list', data),
  // 获取车道详情
  getLaneDetail: data => postFetch('/uvs/v1/api/vir/lane/detail', data),
  // 添加车道
  addLane: data => postFetch('/uvs/v1/api/vir/lane/add', data),
  // 修改车道
  updateLane: data => postFetch('/uvs/v1/api/vir/lane/update', data),
  // 删除车道
  delLane: data => postFetch('/uvs/v1/api/vir/lane/del', data),
  // 卡口树
  getTollgateTree: data => postFetch('/uvs/v1/api/vir/tollgate/tree', data),

  /*
        视图库平台管理
    */
  // 获取视图库平台列表
  getVirPlatformList: data => postFetch('/uvs/v1/api/vir/platform/list', data),
  // 获取视图库平台详情
  getVirPlatformInfo: data => postFetch('/uvs/v1/api/vir/platform/info', data),
  // 添加视图库平台
  addVirPlatform: data => postFetch('/uvs/v1/api/vir/platform/add', data),
  // 修改视图库平台
  modifyVirPlatform: data => postFetch('/uvs/v1/api/vir/platform/modify', data),
  // 删除视图库平台
  delVirPlatform: data => postFetch('/uvs/v1/api/vir/platform/delete', data),
  //启用/停用视图库平台
  platformEnable: data => postFetch('/uvs/v1/api/vir/platform-enable/modify', data),
  /*
        视图库多条件查询
    */
  // 查询图片记录
  queryCapture: data => postFetch('/uvs/v1/api/vir/snap/list', data),
  // 查询图片详情
  queryCaptureInfo: data => postFetch('/uvs/v1/api/vir/snap/info', data),

  /*
        调拨设备管理
    */
  // 查询可调拨设备
  selectVirApe: data => postFetch('/uvs/v1/api/vir/sync/select/ape', data),
  // 下级平台数据同步
  syncWeb: data => postFetch('/uvs/v1/api/vir/sync/sync', data),

  /*
        调拨卡口管理
    */
  // 查询可调拨卡口
  selectVirTollgate: data => postFetch('/uvs/v1/api/vir/sync/select/tollgate', data),

  /*
        调拨车道管理
    */
  // 查询可调拨车道
  selectVirLane: data => postFetch('/uvs/v1/api/vir/sync/select/lane', data),

  /*
        本域视图库
    */
  // 查询本域视图库配置
  getLocalPlatformInfo: data => postFetch('/uvs/v1/api/vir/local/platform/info', data),
  // 修改本域视图库配置
  updateLocalPlatformInfo: data => postFetch('/uvs/v1/api/vir/local/platform/update', data),
  // 添加vig网关信息
  addVig: data => postFetch('/uvs/v1/api/vir/local/vig/add', data),
  // 修改vig网关信息
  updateVig: data => postFetch('/uvs/v1/api/vir/local/vig/update', data),
  // 删除本域视图库配置
  delVig: data => postFetch('/uvs/v1/api/vir/local/vig/del', data),

  /*
        视图库平台订阅
    */
  // 订阅消息列表查询
  selectSubscribeList: data => postFetch('/uvs/v1/api/vir/subscribe/list', data),
  // 下级平台订阅
  sendSubscribe: data => postFetch('/uvs/v1/api/vir/subscribe/send', data),
  // 下级平台取消订阅
  sendCancelSubscribe: data => postFetch('/uvs/v1/api/vir/unsubscribe/send', data),
  // 平台删除订阅
  delSubscribe: data => postFetch('/uvs/v1/api/vir/subscribe/delete', data),

  /*
        上级视图库设备关联
    */
  // 查询平台已关联设备
  getRelateApeList: data => postFetch('/uvs/v1/api/vir/relation/apeList', data),
  // 添加上级平台关联设备
  relate: data => postFetch('/uvs/v1/api/vir/relation/add', data),
  // 未关联设备列表
  getUnRelateApeList: data => postFetch('/uvs/v1/api/vir/relation/unRelateApeList', data),
  // 删除关联设备
  deleteRelation: data => postFetch('/uvs/v1/api/vir/relation/del', data),

  /*
        视图库采集系统
    */
  // 查询采集系统列表
  apsList: data => postFetch('/uas/v1/api/vir/aps/list', data),
  // 查询单个采集系统信息
  apsDetails: data => postFetch('/uas/v1/api/vir/aps/detail', data),
  // 添加采集系统
  addAps: data => postFetch('/uas/v1/api/vir/aps/add', data),
  // 修改采集系统
  updateAps: data => postFetch('/uas/v1/api/vir/aps/update', data),
  // 删除采集系统
  delAps: data => postFetch('/uas/v1/api/vir/aps/del', data),
  // 采集系统树
  apsTree: data => postFetch('/uas/v1/api/vir/aps/tree', data),

  /*
        接入摄像机分配
    */
  //同步镜头数据
  synchronizationData: data => postFetch('/uas/v1/api/uvs/sub-platform-camera/sync', data, 1200000),
  //接入摄像机列表查询
  selectAccessCameras: data => postFetch('/uas/v1/api/uvs/sub-platform-camera/list', data),
  //接入摄像机详情
  getAccessCameraDetail: data => postFetch('/uas/v1/api/uvs/sub-platform-camera/detail', data),
  //调拨设备树查询
  getAllocateDeviceTreeAcc: data => postFetch('/uas/v1/api/uvs/sub-platform-camera/tree', data),
  //调拨设备
  allocateDeviceAcc: data => postFetch('/uas/v1/api/uvs/sub-platform-camera/do', data, 7200000),
   //调拨设备设备定位
   getAllocateDeviceTreeLocate: data =>
   postFetch('/uas/v1/api/uvs/sub-platform-camera/locate', data),
  //调拨设备设备搜索
    getAllocateDeviceTreeSearch: data =>
    postFetch('/uas/v1/api/uvs/sub-platform-camera/search', data),
  //查询平台树
  getPlatTree: data => postFetch('/uas/v1/api/udc/access-platform/tree', data),

  /*
        接入平台管理
    */
  //接入平台新增
  addAccessPlatformInfo: data => postFetch('/uas/v1/api/udc/access-platform/add', data),
  //接入平台修改
  modifyAccessPlatformInfo: data => postFetch('/uas/v1/api/udc/access-platform/modify', data),
  //接入平台删除
  deleteAccessPlatformInfo: data => postFetch('/uas/v1/api/udc/access-platform/delete', data),
  //接入平台列表查询
  selectAccessPlatforms: data => postFetch('/uas/v1/api/udc/access-platform/select', data),
  // 接入平台列表查询
  queryAccessPlatformList: data => postFetch('/uas/v1/api/udc/access-platform/query-list', data),
  //接入平台详情
  getAccessPlatformInfo: data => postFetch('/uas/v1/api/udc/access-platform/info', data),
  //接入平台状态变更记录
  selectPlatformStatusLogInfos: data => postFetch('/uas/v1/api/udc/platform-status-log/list', data),
  //接入平台启用/停用
  platformEnableModify: data => postFetch('/uas/v1/api/udc/platform-enable/modify', data),
  // avs平台配置查询
  avsConfigSelect: data => postFetch('/uas/v1/api/uvs/platform/avs-config/select', data),
  // avs平台配置修改
  avsConfigUpdate: data => postFetch('/uas/v1/api/uvs/platform/avs-config/update', data),

  /*
        国标共享管理
     */
  //查询共享目录树
  getGroupTree: data => postFetch('/uas/v1/api/uvs/convergence/tree', data),
  //新增目录
  addGroup: data => postFetch('/uas/v1/api/uvs/convergence/addGroup', data),
  //修改目录
  modifyGroup: data => postFetch('/uas/v1/api/uvs/convergence/modifyGroup', data),
  //删除目录
  deleteGroup: data => postFetch('/uas/v1/api/uvs/convergence/deleteGroup', data),
  //导入共享设备
  addConvergenceDevice: data => postFetch('/uas/v1/api/uvs/convergence/addConvergenceDevice', data),
  //修改共享设备
  modifyConvergenceDevice: data =>
    postFetch('/uas/v1/api/uvs/convergence/modifyConvergenceDevice', data),
  //查询已共享设备
  convergenceDeviceList: data =>
    postFetch('/uas/v1/api/uvs/convergence/convergenceDeviceList', data),
  //删除共享设备
  delConvergenceDevice: data => postFetch('/uas/v1/api/uvs/convergence/delConvergenceDevice', data),

  // 元数据订阅
  subscribeMetadata: data => postFetch('/uas/v1/api/ars/history-metadata/subscribe', data),

  // 取消元数据订阅
  unsubscribeMetadata: data => postFetch('/uas/v1/api/ars/history-metadata/unsubscribe', data),

  // 历史元数据订阅列表查询
  searchHisMetadataList: data => postFetch('/uas/v1/api/ars/history-metadata/list', data),

  // 客户端订阅历史元数据图片
  clientSubscribeMetadata: data => postFetch('/uas/v1/api/uvs/metadata/client/subscribe', data),

  // 客户端取消订阅历史元数据图片
  clientUnsubscribeMetadata: data => postFetch('/uas/v1/api/uvs/metadata/client/unsubscribe', data),

  /*
        采集设备树
    */
  //采集设备树
  getApeTree: data => postFetch('/oba/v1/api/vir/ape/tree', data),
  /*
        视图库平台树
    */
  //视图库平台树
  getVirPlatTree: data => postFetch('/oba/v1/api/vir/platform/tree', data),
  /*
        采集设备树模糊搜索
    */
  //采集设备树模糊搜索
  searchApeTree: data => postFetch('/oba/v1/api/vir/ape/tree/select', data),

  /*
        元数据模型映射的设备树
    */
  //查询拥有元数据模型映射的设备树
  getModelTree: data => postFetch('/uas/v1/api/ars/model/dev-tree', data),
  //在拥有元数据模型映射的设备树中检索
  searchModelTree: data => postFetch('/uas/v1/api/ars/model/dev-tree-search', data),

  /*
        采集设备关联主设备的设备树
    */
  //采集设备关联主设备的设备树
  getDeviceTreeVir: data => postFetch('/uas/v1/api/vir/device/tree', data),
  //采集设备关联主设备的设备树搜索
  searchInDeviceTreeVir: data => postFetch('/uas/v1/api/vir/device/search', data),

  /*
        涉及视图库的设备添加
    */
  //涉及视图库的设备添加
  addMonitorApe: data => postFetch('/uas/v1/api/vir/monitor/ape/add', data),

  /*
        物联网平台管理
    */
  // 获取物联平台列表
  getIotPlatformList: data => postFetch('/uas/v1/api/iot/platform/list', data),
  // 查询物联平台信息
  getIotPlatformInfo: data => postFetch('/uas/v1/api/iot/platform/info', data),
  // 添加物联平台
  addIotPlatformInfo: data => postFetch('/uas/v1/api/iot/platform/add', data),
  // 修改物联平台
  modifyIotPlatformInfo: data => postFetch('/uas/v1/api/iot/platform/modify', data),
  // 删除物联平台
  deleteIotPlatformInfo: data => postFetch('/uas/v1/api/iot/platform/delete', data),

  /*
        物联（网关）设备管理
    */
  // 获取物联设备列表
  getIotDeviceList: data => postFetch('/uas/v1/api/iot/device/list', data),
  // 添加物联设备
  addIotDeviceInfo: data => postFetch('/uas/v1/api/iot/device/add', data),
  // 修改物联设备
  modifyIotDeviceInfo: data => postFetch('/uas/v1/api/iot/device/modify', data),
  // 获取物联设备信息
  getIotDeviceInfo: data => postFetch('/uas/v1/api/iot/device/info', data),
  // 删除物联设备
  deleteIotDeviceInfo: data => postFetch('/uas/v1/api/iot/device/delete', data),
  // 导出物联设备列表
  exportIotDeviceInfo: data => postFetch('/uas/v1/api/iot/device/export', data),
  // 物联设备软件版本升级
  upgradeDeviceSoftwareVersion: data =>
    postFetch('/uas/v1/api/iot/device/software/version/upgrade', data),

  /*
        软件版本管理
     */
  //  软件版本列表查询
  getDeviceSoftwareVersionList: data =>
    postFetch('/uas/v1/api/iot/device/software/version/list', data),
  //  发布软件版本
  publishDeviceSoftwareVersion: data =>
    postFetch('/uas/v1/api/iot/device/software/version/publish', data),
  //  取消发布软件版本
  cancelDeviceSoftwareVersion: data =>
    postFetch('/uas/v1/api/iot/device/software/version/cancel', data),
  //  软件版本详情
  getDeviceSoftwareVersionInfo: data =>
    postFetch('/uas/v1/api/iot/device/software/version/info', data),
  //  软件版本检查
  checkDeviceSoftwareVersion: data =>
    postFetch('/uas/v1/api/iot/device/software/version/check', data),

  /*
        人员识别记录
    */
  // 人员识别列表
  getPersonRecognitionList: data => postFetch('/uas/v1/api/iot/person/recognition/list', data),

  /* 故障工作台 */
  // 故障上报
  addFaultInfo: data => postFetch('/uas/v1/api/bms/fault/add', data),
  // 故障概览
  getFaultSummary: data => postFetch('/uas/v1/api/bms/fault/summary', data),

  // 获取故障列表
  getFaultList: data => postFetch('/uas/v1/api/bms/fault/list', data),
  // 导出故障列表
  getFaultListExport: data => postFetch('/uas/v1/api/bms/fault/list/export', data),
  // 故障详情
  getFaultDetail: data => postFetch('/uas/v1/api/bms/fault/detail', data),
  // 非故障关闭
  closeFault: data => postFetch('/uas/v1/api/bms/fault/close', data),
  // 获取故障流程
  getFaultTechnologicalProcess: data => postFetch('/uas/v1/api/bms/fault/process', data),
  // 获取用户故障列表
  getUserFaultList: data => postFetch('/uas/v1/api/bms/user/fault/list', data),
  // 用户关闭故障
  userCloseFault: data => postFetch('/uas/v1/api/bms/user/fault/close', data),
  // 用户编辑故障
  userModifyFault: data => postFetch('/uas/v1/api/bms/user/fault/modify', data),
  // 获取登录人员角色
  getMaintainerRole: data => postFetch('/uas/v1/api/bms/maintainer/role', data),
  // 生成工单
  addWorkOrderInfo: data => postFetch('/uas/v1/api/bms/work-order/add', data),

  /* 工单工作台 */
  // 获取工单统计概览
  getWorkorderSummaryInfo: data => postFetch('/uas/v1/api/bms/work-order/summary', data),
  // 获取工单列表
  getWorkOrderList: data => postFetch('/uas/v1/api/bms/work-order/list', data),
  // 导出工单列表
  exportWorkOrderList: data => postFetch('/uas/v1/api/bms/work-order/list/export', data),
  // 挂起审核
  suspendAudit: data => postFetch('/uas/v1/api/bms/work-order/suspendAudit', data),
  // 验收审核
  acceptanceAudit: data => postFetch('/uas/v1/api/bms/work-order/acceptanceAudit', data),
  // 工单重新分配
  reallocateAudit: data => postFetch('/uas/v1/api/bms/work-order/reallocateAudit', data),
  // 工单详情
  getWorkOrderInfo: data => postFetch('/uas/v1/api/bms/work-order/info', data),
  // 获取工单流程
  getWorkOrderFlow: data => postFetch('/uas/v1/api/bms/work-order/flow', data),
  // 区域工单数量统计
  getWorkOrderQuantityDetails: data => postFetch('/uas/v1/api/bms/work-order/quantity', data),
  // 区域工单统计导出
  getWorkOrderQuantityDetailsExport: data =>
    postFetch('/uas/v1/api/bms/work-order/quantity/export', data),
  // 获取工单闭环统计
  getWoClosedLoopStatDetails: data => postFetch('/uas/v1/api/bms/work-order/cl/stat/detail', data),
  // 工单闭环统计导出
  getWoClosedLoopStatDetailsExport: data =>
    postFetch('/uas/v1/api/bms/work-order/cl/stat/detail/export', data),

  /* 维修工作台 */
  // 获取维修工作台统计概览
  getRepairSummary: data => postFetch('/uas/v1/api/bms/repair/summary', data),
  // 获取维修列表
  getRepairWorkbenchList: data => postFetch('/uas/v1/api/bms/repair/list', data),
  // 导出维修列表
  getRepairListExport: data => postFetch('/uas/v1/api/bms/repair/list/export', data),
  // 维修处理
  handleWo: data => postFetch('/uas/v1/api/bms/work-order/handle', data),
  // 维修重新激活
  activationWo: data => postFetch('/uas/v1/api/bms/work-order/activation', data),

  /** 设备在线状态检测 */
  //设备在线状态检测
  OnOfflineCheck: data => postFetch('/uas/v1/api/bms/online/check/list', data),
  //设备在线状态重新检测
  OnOfflineCheckAgain: data => postFetch('/uas/v1/api/bms/online/check', data),
  //设备在线状态详情
  OnOfflineCheckDetail: data => postFetch('/uas/v1/api/bms/online/check/detail', data),
  //设备链路分析
  OnOfflineCheckLink: data => postFetch('/uas/v1/api/bms/online/link', data),
  //设备在线状态检测导出
  OnOfflineCheckExport: data => postFetch('/uas/v1/api/bms/online/check/list/export', data),

  /* 视频运维管理-设备视频预览成功率 */
  //视频预览概要
  getSummaryInfo: data => postFetch('/uas/v1/api/bms/preview/summary', data),
  //视频预览子组织（平台）概览
  getChildPreviewList: data => postFetch('/uas/v1/api/bms/child-preview/list', data),
  //查询视频预览列表
  getPreviewList: data => postFetch('/uas/v1/api/bms/preview/list', data),
  //视频预览列表详情导出
  fileExport: data => postFetch('/uas/v1/api/bms/preview/export', data),

  /* 视频运维管理-录像完整性分析接口 */
  //录像完整性分布
  getRecordPlanDistributionStatTwo: data =>
    postFetch('/uas/v1/api/bms/record/integrality/distribution', data),
  //录像完整性统计
  getRecordIntegralityStat: data => postFetch('/uas/v1/api/bms/record/integrality/stat', data),
  //录像完整性详情
  getRecordIntegralityDetail: data => postFetch('/uas/v1/api/bms/record/integrality/detail', data),
  //手动检测录像完整性
  getRecordIntegralityCheck: data => postFetch('/uas/v1/api/bms/record/integrality/check', data),
  //录像完整性详情导出
  getRecordIntegralityExport: data => postFetch('/uas/v1/api/bms/record/integrality/export', data),

  /*考核统计  */
  // 经纬度考核统计
  getLonLatStat: data => postFetch('/uas/v1/api/bms/lonlat/stat', data),
  // 经纬度考核导出
  getLonLatStatExport: data => postFetch('/uas/v1/api/bms/lonlat/stat/export', data),
  // 区域考核统计
  getAreaMaintenanceStat: data => postFetch('/uas/v1/api/bms/examine/area/stat', data),
  // 区域考核导出
  getAreaMaintenanceStatExport: data => postFetch('/uas/v1/api/bms/examine/area/stat/export', data),

  /* 设备在离线 */
  // new历史在线率查询
  onOfflineNewStat: data => postFetch('/uas/v1/api/bms/onoffline/stat-v1.1', data),
  // new历史在线率查询
  onOfflineDetailNewStat: data => postFetch('/uas/v1/api/bms/onoffline/stat/detail-v1.1', data),
  // 设备在离线详情
  onOfflineDetailDeviceList: data => postFetch('/uas/v1/api/bms/onoffline/device/list', data),
  // 设备在离线详情
  onOfflineDetailDeviceNewDetail: data =>
    postFetch('/uas/v1/api/bms/onoffline/device/amount/detail', data),
  // 导出-设备在离线详情
  onOfflineNewStatExport: data => postFetch('/uas/v1/api/bms/onoffline/stat/export', data),
  // 导出-设备在离线详情导出
  onOfflineNewDetailExport: data => postFetch('/uas/v1/api/bms/onoffline/new/detail/export', data),
  // 导出-设备长期离线数据导出
  onOfflinelongStatExport: data =>
    postFetch('/uas/v1/api/bms/onoffline/longoffline/stat/export', data),
  // 设备在离线时间详情
  onOfflineDetailDeviceDateList: data =>
    postFetch('/uas/v1/api/bms/onoffline/device/date/detail', data),
  // 长期离线设备明细
  longOnOfflineLongNewDetail: data =>
    postFetch('/uas/v1/api/bms/onoffline/longoffline/detail', data),
  // 长期离线设备统计
  onOfflineDetailLongStat: data => postFetch('/uas/v1/api/bms/onoffline/longoffline/stat', data),
  // 历史在线率查询
  onOfflineStat: data => postFetch('/uas/v1/api/bms/onoffline/stat', data),
  // 历史在线详情
  onOfflineDetailStat: data => postFetch('/uas/v1/api/bms/onoffline/stat/detail', data),
  // 长期离线设备查询
  longOnOfflineStat: data => postFetch('/uas/v1/api/bms/onoffline/long/detail', data),
  // 长期离线详情导出
  longOnOfflineExport: data => postFetch('/uas/v1/api/bms/onoffline/long/export', data),
  // 频繁上下线设备查询
  oftenOnOfflineStat: data => postFetch('/uas/v1/api/bms/onoffline/often/detail', data),
  // 频繁下线设备分布
  oftenOnOfflineStatDistribution: data =>
    postFetch('/uas/v1/api/bms/onoffline/often/distribution', data),
  // 频繁上下线导出
  oftenOnOfflineExport: data => postFetch('/uas/v1/api/bms/onoffline/often/export', data),
  // 历史在线详情
  onOfflineDetail: data => postFetch('/uas/v1/api/bms/onoffline/device/detail', data),
  // 历史在线详情导出
  onOfflineDetailExport: data => postFetch('/uas/v1/api/bms/onoffline/detail/export', data),
  // 设备在离线明细
  onOfflineDetailInfo: data => postFetch('/uas/v1/api/bms/onoffline/detail', data),
  // 设备在离线明细导出
  onOfflineDetailInfoExport: data =>
    postFetch('/uas/v1/api/bms/onoffline/detail/specific/export', data),
  /* 运维首页 */
  // 一键运维权限
  getpatrolEnable: data => postFetch('/uas/v1/api/bms/patrol/enable', data),
  // 获取设备详情
  getDeviceAccessDistribution: data =>
    postFetch('/uas/v1/api/bms/device/access/distribution', data),
  // 获取监控点设备在线率
  getDevStatus: data => postFetch('/uas/v1/api/bms/onOffline/status', data),
  // 获取解码设备在线率
  getDecoderSummaryInfo: data => postFetch('/uas/v1/api/bms/decoder/summary', data),
  // 获取视频预览正常率
  getPreviewSummaryInfo: data => postFetch('/uas/v1/api/bms/preview/summary', data),
  // 获取录像完整性统计
  getRecordIntegralityRealtime: data =>
    postFetch('/uas/v1/api/bms/record/integrality/summary', data),
  // 视频质量诊断统计
  getVideoQualitySummaryInfo: data => postFetch('/uas/v1/api/bms/video-quality/summary', data),
  // 获取资源运行情况统计
  getAggregateSummaryInfo: data => postFetch('/uas/v1/api/bms/summary/aggregate', data),
  // 导出视频概况
  exportPreview: data => postFetch('/uas/v1/api/bms/preview/export', data),
  // 导出重点视频诊断
  exportVideoQuality: data => postFetch('/uas/v1/api/bms/video-quality/export', data),
  // 获取视频诊断列表
  getQualityList: data => postFetch('/uas/v1/api/bms/video-quality/list', data),
  // 导出视频诊断列表
  exportQualityList: data => postFetch('/uas/v1/api/bms/video-quality/exportList', data),
  // 获取视频诊断详情
  getVideoQualityInfo: data => postFetch('/uas/v1/api/bms/video-quality/info', data),
  // 手动检测视频质量
  checkVideoQuality: data => postFetch('/uas/v1/api/bms/video-quality/check', data),

  /* 一键巡检 */
  // 查询用户当前是否有进行中的巡检任务
  getMajorInspectPatrolStatus: data => postFetch('/uas/v1/api/bms/majorDevice/patrolStatus', data),
  // 查询巡检中的任务
  getTaskInfo: data => postFetch('/uas/v1/api/bms/patrol/getTaskInfo', data),
  // 解码器状态统计
  getDecoderStatus: data => postFetch('/uas/v1/api/bms/decoder/status/stat', data),
  // 监控点录像状态统计
  getRecordStatus: data => postFetch('/uas/v1/api/bms/record/state', data),
  // 获取所有分组
  getGroupList: data => postFetch('/uas/v1/api/bms/inspection-group/list', data),
  // 获取分组下的设备列表
  getDevList: data => postFetch('/uas/v1/api/bms/inspection-group/getDevlist', data),
  // 巡检
  majorInspect: data => postFetch('/uas/v1/api/bms/majorDevice/patrol', data),
  // 获取巡检任务列表
  getTaskList: data => postFetch('/uas/v1/api/bms/patrol/getTaskList', data),
  // 导出巡检结果
  exportMajorResult: data => postFetch('/uas/v1/api/bms/majorDevice/patrol/export', data),
  // 巡检任务详情
  getPatrolResult: data => postFetch('/uas/v1/api/bms/patrol/getPatrolResult', data),
  // 任务设备详情
  getDevPatrolDetail: data => postFetch('/uas/v1/api/bms/patrol/getDevPatrolDetail', data),
  // 添加分组
  addPatrolGroupInfo: data => postFetch('/uas/v1/api/bms/inspection-group/add', data),
  // 删除分组
  deletePatrolGroupInfo: data => postFetch('/uas/v1/api/bms/inspection-group/delete', data),
  // 编辑分组
  modifyPatrolGroupInfo: data => postFetch('/uas/v1/api/bms/inspection-group/modify', data),
  // 分组详情
  getGroupInfo: data => postFetch('/uas/v1/api/bms/inspection-group/info', data),
  // 查询单个地区 入参 areaCode
  queryAreaInfo: data => postFetch('/uas/v1/api/udc/area/info', data),

  /*  视频质量轮巡*/
  //查看镜头视频质量检测列表
  getCameraQualityNewestPage: data => postFetch('/uas/v1/api/bms/quality/camera/newest/page', data),
  //查看镜头基础信息
  getCameraQualityBase: data => postFetch('/uas/v1/api/bms/quality/camera/base', data),
  //查看单个镜头某段时间所有检测信息列表
  getCameraQualityList: data => postFetch('/uas/v1/api/bms/quality/camera/list', data),
  //查询质量检测任务列表
  getVideoQualityMainTaskPage: data => postFetch('/uas/v1/api/bms/quality/main/task/page', data),
  //创建质量检测任务
  createVideoQualityMainTask: data => postFetch('/uas/v1/api/bms/quality/main/task/add', data),
  //编辑质量检测任务
  updateVideoQualityMainTask: data => postFetch('/uas/v1/api/bms/quality/main/task/update', data),
  //执行质量检测任务
  startUpVideoQualityMainTask: data => postFetch('/uas/v1/api/bms/quality/main/task/start', data),
  //启用质量检测任务
  recoveryVideoQualityMainTask: data =>
    postFetch('/uas/v1/api/bms/quality/main/task/recovery', data),
  //停用质量检测任务
  stopVideoQualityMainTask: data => postFetch('/uas/v1/api/bms/quality/main/task/stop', data),
  //删除质量检测任务
  deleteVideoQualityMainTask: data => postFetch('/uas/v1/api/bms/quality/main/task/delete', data),
  //查看质量检测任务基础信息
  getVideoQualityMainTaskDetail: data =>
    postFetch('/uas/v1/api/bms/quality/main/task/detail', data),
  //查看质量检测任务历史执行记录列表
  getVideoQualityMainTaskExecutionList: data =>
    postFetch('/uas/v1/api/bms/quality/execution/list', data),
  //查看质量检测任务单次执行记录概览信息
  getVideoQualityTaskExecutionSingleOverview: data =>
    postFetch('/uas/v1/api/bms/quality/execution/single/overview', data),
  //查看质量检测任务执行记录概览信息列表
  getVideoQualityTaskExecutionOverviewList: data =>
    postFetch('/uas/v1/api/bms/quality/execution/overview/list', data),
  // 获取检测任务下的摄像头信息列表
  getVideoQualityMainTaskCameraList: data =>
    postFetch('/uas/v1/api/bms/quality/main/task/camera', data),
  // 配置告警信息
  setAlarmConfig: data => postFetch('/uas/v1/api/bms/video/quality/alarm/config', data),
  // 获取告警配置信息
  getAlarmConfig: data => postFetch('/uas/v1/api/bms/video/quality/alarm/config/detail', data),

  //目标1v1
  getFaceMatch1v1: data => postFetch('/uas/v1/api/ars/intelligent-app/facematch/1v1', data),

  /* 云台控制巡航计划 */

  //获取巡航列表
  getCruiseList: data => postFetch('/uas/v1/api/cruise/list', data),
  //获取巡航计划
  getCruisePlan: data => postFetch('/uas/v1/api/cruise/plan/get', data),
  //设置巡航计划
  setCruisePlan: data => postFetch('/uas/v1/api/cruise/plan/set', data),

  /* 预案轮巡 */
  //获取电视墙预案列表
  getTvWallScenarioList: data => postFetch('/uas/v1/api/uvs/tv-wall/scenario/list/page', data),
  //新增电视墙预案轮巡
  addTvWallScenarioTurningInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/add', data),
  //编辑电视墙预案轮巡
  modifyTvWallScenarioTurningInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/modify', data),
  //启用/禁用电视墙预案轮巡
  enableTvWallScenarioTurningInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/enable', data),
  //删除电视墙预案轮巡
  deleteTvWallScenarioTurningInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/delete', data),
  //获取电视墙预案轮巡列表
  getTvWallScenarioTurningList: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/list/page', data),
  //新增电视墙预案计划
  addTvWallScenarioPlanInfo: data => postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/add', data),
  //编辑电视墙预案计划
  modifyTvWallScenarioPlanInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/modify', data),
  //启用/禁用电视墙预案计划
  enableTvWallScenarioPlanInfo: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/enable', data),
  //获取电视墙预案计划列表
  getTvWallScenarioPlanList: data =>
    postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/list/page', data),

  /*vpaas外域管理*/
  //按条件查询平台
  selectVpaasPlatformList: data => postFetch('/uas/v1/api/uvs/access-platform/select', data),
  //添加平台
  addVpaasPlatformInfo: data => postFetch('/uas/v1/api/uvs/access-platform/add', data),
  //编辑平台
  modifyVpaasPlatformInfo: data => postFetch('/uas/v1/api/uvs/access-platform/modify', data),
  //删除平台
  deleteVpaasPlatformInfo: data => postFetch('/uas/v1/api/uvs/access-platform/delete', data),
  //平台详情
  getVpaasPlatformInfo: data => postFetch('/uas/v1/api/uvs/access-platform/info', data),
  //平台启停
  modifyVpaasPlatformEnable: data => postFetch('/uas/v1/api/uvs/platform-enable/modify', data),
  //获取域列表接口
  getDomainQueryList: data => postFetch('/uas/v1/api/uvs/domain/query', data),
  //获取域规模路数
  getDomainAccessCount: data => postFetch('/uas/v1/api/uvs/domain/access/count ', data)
})
