/**
 * @Author target
 * @Date 2022/5/6 10:51
 * @Version 1.0
 */
import { postFetch, getFetch, loginRequest, mockRequest } from '@/api/service'
import { merge } from 'lodash'
import { mockData } from '@/api/mockData'
export default {
  // 智能分析任务
  getCameraTree: (data) =>
    mockRequest(() => postFetch('/uas/v1/api/udc/organization/tree', data), mockData.cameraTree(data)),
  // 搜索
  searchCameraTree: (data) => postFetch('/uas/v1/api/udc/organization/search', data),
  // 定位
  locateCameraTree: (data) => postFetch('/uas/v1/api/udc/organization/locate', data),
  captcha: (data) => postFetch('/uas/v1/api/captcha', data),
  getLoginUserInfo: (data) => postFetch('/uas/v1/api/udc/login/user', data),
  // selectMenus: (data) => postFetch('/uas/v1/api/ais/management/menus', data),
  //获取系统信息
  getSysInfo: (data) => postFetch('/uas/v1/api/scs/system/info/get', data),
  //获取局点信息
  getFlavor: (data) => postFetch('/uas/v1/api/udc/assist/flavor', data),
  showTraffic: (data) => postFetch('/uas/v1/api/scs/traffic/show/info', data),
  disposeInfo: (data) => postFetch('/uas/v1/api/scs/patrol/dispose/info', data),
  cameraInfo: (data) => postFetch('/uas/v1/api/scs/camera/show/info', data),
  workSheetInfo: (data) => postFetch('/uas/v1/api/scs/work_sheet/show/info', data),
  //告警配置
  alarmPropertyInfo: (data) => postFetch('/uas/v1/api/scs/alarm/property/info', data),
  //算法列表
  algorithmList: (data) => postFetch('/uas/v1/uas/v1/api/ars/algorithm/access/list', data),
  // 退出登录
  logout: (data) => postFetch('/uas/v1/api/user/logout', data),
  // 获取token
  refreshToken: (data) => postFetch('/uas/v1/api/user/token', data),
  // 字典查询
  getDictionary: (data) => postFetch('/uas/v1/api/udc/assist/dictionary', data),
  // 模糊查询字典
  getFuzzyDictionary: (data) => postFetch('/uas/v1/api/udc/assist/fuzzy/dictionary', data),
  // 获取局点信息
  getFlavor: (data) => postFetch('/uas/v1/api/udc/assist/flavor', data),
  // 用户隐私协议
  getAgreements: (data) => postFetch('/uas/v1/api/oba/agreement/get', data),
  // 获取验证码
  captcha: (data) => postFetch('/uas/v1/api/captcha', data),
  // 获取当前用户信息
  getLoginUserInfo: (data) => postFetch('/uas/v1/api/udc/login/user', data),
  // 查询菜单
  selectMenus: (data) => mockRequest(() => postFetch('/uas/v1/api/udc/management/menus', data), mockData.menus()),
  // 查询菜单权限
  selectMenuPerms: (data) => postFetch('/uas/v1/api/udc/management/perms', data),
  // 查询用户权限列表
  selectUserPermissions: (data) => postFetch('/uas/v1/api/udc/management/use/perms', data),
  // 首次修改密码
  firstModifyPassword: (data) => postFetch('/uas/v1/api/udc/management/passwd', data),
  // 修改密码
  modifyPassword: (data) => postFetch('/uas/v1/api/udc/management/passwd', data),
  // 版权&备案
  getCopyrightRecord: (data) => postFetch('/uas/v1/api/oba/copyrightrecord/get', data),
  // 实况轨迹
  getTrackList: (data) => postFetch('/uas/v1/api/scs/track/list', data),

  /*
         媒体转码模板
     */
  // 获取转码模板
  queryTemplateList: (data) => postFetch('/uas/v1/api/media/template/list', data),
  // 添加转码模板
  addTemplate: (data) => postFetch('/uas/v1/api/media/template/add', data),
  // 修改转码模板
  modifyTemplate: (data) => postFetch('/uas/v1/api/media/template/modify', data),
  // 删除转码模板
  delTemplate: (data) => postFetch('/uas/v1/api/media/template/delete', data),
  // 单个转码模板信息
  getTranscodeTemplateById: (data) => postFetch('/uas/v1/api/media/template/get', data),

  /*
         媒体转码设置
     */
  // 创建镜头转码任务
  createCameraTranscode: (data) => postFetch('/uas/v1/api/media/camera/transcode/create', data),
  // 获取镜头转码任务列表
  getCameraTranscodeTasks: (data) => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  // 暂停转码任务
  delCameraTranscodeTasks: (data) => postFetch('/uas/v1/api/media/camera/transcode/delete', data),
  // 单个转码任务信息
  getTranscodeTaskInfo: (data) => postFetch('/uas/v1/api/media/camera/transcode/get', data),
  //停止镜头转码任务
  stopTranscodeTask: (data) => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  //删除镜头转码任务
  CameraTranscodeManageService: (data) => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  //删除镜头转码任务
  getCameraTranscodeTask: (data) => postFetch('/uas/v1/api/media/camera/transcode/delete', data),

  /*
         组织管理模块调用接口
     */
  // 添加组织
  addOrganizationInfo: (data) => postFetch('/uas/v1/api/udc/organization/add', data),
  // 修改组织
  modifyOrganizationInfo: (data) => postFetch('/uas/v1/api/udc/organization/modify', data),
  // 删除组织
  deleteOrganizationInfo: (data) => postFetch('/uas/v1/api/udc/organization/delete', data),
  // 获取组织列表
  selectOrganizations: (data) => postFetch('/uas/v1/api/udc/organization/list', data),
  // 获取组织树
  getOrganizationTree: (data) => postFetch('/uas/v1/api/udc/organization/tree', data),
  // 搜索
  searchInOrganizationTree: (data) => postFetch('/uas/v1/api/udc/organization/search', data),
  // 定位
  locateInOrganizationTree: (data) => postFetch('/uas/v1/api/udc/organization/locate', data),
  // 获取单个用户信息
  getOrganizationInfo: (data) => postFetch('/uas/v1/api/udc/organization/info', data),
  /*
       算法平台管理模块调用接口
   */
  // 算法平台列表查询
  getAlgorithmPlatformList: (data) => postFetch('/uas/v1/api/acc/platform/list', data),
  //添加算法平台
  addAlgorithmPlatformInfo: (data) => postFetch('/uas/v1/api/acc/platform/add', data),
  //修改算法平台
  modifyAlgorithmPlatformInfo: (data) => postFetch('/uas/v1/api/acc/platform/modify', data),
  //删除算法平台
  deleteAlgorithmPlatformInfo: (data) => postFetch('/uas/v1/api/acc/platform/delete', data),
  //查询单个算法平台信息
  getAlgorithmPlatformInfo: (data) => postFetch('/uas/v1/api/acc/platform/info', data),

  /*
         监控平台管理模块调用接口
     */
  // 添加监控平台
  addPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/platform/add', data),
  // 监控平台列表查询
  getPlatformList: (data) => postFetch('/uas/v1/api/uvs/platform/list', data),

  // 监控平台信息查询
  getPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/platform/info', data),
  // 修改监控平台
  modifyPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/platform/modify', data),
  // 删除监控平台
  deletePlatformInfo: (data) => postFetch('/uas/v1/api/uvs/platform/delete', data),

  /*
         用户管理模块调用接口
     */
  // 添加用户
  addUserInfo: (data) => postFetch('/uas/v1/api/udc/user/add', data),
  // 修改用户
  modifyUserInfo: (data) => postFetch('/uas/v1/api/udc/user/modify', data),
  // 删除用户
  deleteUserInfo: (data) => postFetch('/uas/v1/api/udc/user/delete', data),
  // 获取用户列表
  getUserList: (data) => postFetch('/uas/v1/api/udc/user/list', data),
  // 导出用户列表
  exportUserList: (data) => postFetch('/uas/v1/api/udc/user/export', data),
  // 获取单个用户信息
  getUserInfo: (data) => postFetch('/uas/v1/api/udc/user/info', data),
  // 下载导入用户模板
  getUserTemplate: (data) => postFetch('/uas/v1/api/udc/user/template', data),
  // 批量导入用户
  importUserInfo: (data) => postFetch('/uas/v1/api/udc/user/import', data),
  // 设置用户Logo和登录背景
  setUserLogo: (data) => postFetch('/uas/v1/api/udc/user/logo/set', data),
  // 查看用户Logo和登录背景
  getUserLogo: (data) => postFetch('/uas/v1/api/udc/user/logo/info', data),
  // 启用/停用用户
  enableUser: (data) => postFetch('/uas/v1/api/udc/user/enable', data),
  // 重置用户密码
  resetUserPasswd: (data) => postFetch('/uas/v1/api/udc/user/passwd/reset', data),
  // 锁定/解锁用户
  lockUser: (data) => postFetch('/uas/v1/api/udc/user/lock', data),
  // 冻结/激活用户
  activeUser: (data) => postFetch('/uas/v1/api/udc/user/active', data),
  // 设置用户角色
  setUserRole: (data) => postFetch('/uas/v1/api/udc/user/role/set', data),

  //用户设备分配
  //用户已分配设备权限查询
  getAllocatedPerms: (data) => postFetch('/uas/v1/api/udc/device/allocate/perm/get', data),
  //用户已分配设备权限设置
  setAllocatedPerms: (data) => postFetch('/uas/v1/api/udc/device/allocate/perm/set', data),
  //用户组织分配详情
  getUserAllocateDetail: (data) => postFetch('/uas/v1/api/udc/device/allocate/detail', data),
  //用户设备分配
  allocateDeviceToUser: (data) => postFetch('/uas/v1/api/udc/device/allocate/do', data),

  /*
         我的共享设备
     */
  //移动共享设备或组
  MoveSharedDevices: (data) => postFetch('/uas/v1/api/udc/device/share/move', data),

  /*
         管理员管理模块调用接口
     */
  // 添加管理员
  addAdminInfo: (data) => postFetch('/uas/v1/api/udc/admin/add', data),
  // 修改管理员
  modifyAdminInfo: (data) => postFetch('/uas/v1/api/udc/admin/modify', data),
  // 删除管理员
  deleteAdminInfo: (data) => postFetch('/uas/v1/api/udc/admin/delete', data),
  // 获取管理员列表
  getAdminList: (data) => postFetch('/uas/v1/api/udc/admin/list', data),
  // 获取单个管理员信息
  getAdminInfo: (data) => postFetch('/uas/v1/api/udc/admin/info', data),
  // 启用/停用管理员
  enableAdmin: (data) => postFetch('/uas/v1/api/udc/admin/enable', data),
  // 重置用户密码
  resetAdminPasswd: (data) => postFetch('/uas/v1/api/udc/admin/passwd/reset', data),
  // 锁定/解锁管理员
  lockAdmin: (data) => postFetch('/uas/v1/api/udc/admin/lock', data),
  // 冻结/激活管理员
  activeAdmin: (data) => postFetch('/uas/v1/api/udc/admin/active', data),
  // 设置管理员角色
  setAdminRole: (data) => postFetch('/uas/v1/api/udc/admin/role/set', data),
  /*
         角色管理模块调用接口
     */
  // 添加角色
  addRoleInfo: (data) => postFetch('/uas/v1/api/udc/role/add', data),
  // 修改角色
  modifyRoleInfo: (data) => postFetch('/uas/v1/api/udc/role/modify', data),
  // 删除角色
  deleteRoleInfo: (data) => postFetch('/uas/v1/api/udc/role/delete', data),
  // 获取角色列表
  selectRoles: (data) => postFetch('/uas/v1/api/udc/role/list', data),
  // 获取单个角色信息
  getRoleInfo: (data) => postFetch('/uas/v1/api/udc/role/info', data),

  /*
         租户管理模块调用接口
     */
  // 添加租户
  addTenantInfo: (data) => postFetch('/uas/v1/api/udc/tenant/add', data),
  // 修改租户
  modifyTenantInfo: (data) => postFetch('/uas/v1/api/udc/tenant/modify', data),
  // 删除租户
  deleteTenantInfo: (data) => postFetch('/uas/v1/api/udc/tenant/delete', data),
  // 获取租户列表
  getTenantList: (data) => postFetch('/uas/v1/api/udc/tenant/list', data),
  // 获取单个租户信息
  getTenantInfo: (data) => postFetch('/uas/v1/api/udc/tenant/info', data),
  // 下载导入租户模板
  getTenantTemplate: (data) => postFetch('/uas/v1/api/udc/tenant/template', data),
  // 批量导入租户
  importTenantInfo: (data) => postFetch('/uas/v1/api/udc/tenant/import', data),
  // 设置租户Logo和登录背景
  setTenantLogo: (data) => postFetch('/uas/v1/api/udc/tenant/logo/set', data),
  // 查询租户Logo和登录背景
  getTenantLogo: (data) => postFetch('/uas/v1/api/udc/tenant/logo/query', data),
  // 查询租户Logo和登录背景 能力接口
  queryTenantLogo: (data) => postFetch('/uas/v1/api/udc/tenant/logo/info', data),
  // 启用/停用租户
  enableTenant: (data) => postFetch('/uas/v1/api/udc/tenant/enable', data),
  // 添加租户esop客户映射关系
  bindEsopClinet: (data) => postFetch('/uas/v1/api/oba/esop/bindEsopClient', data),
  // 修改租户esop客户映射关系
  updateEsopClinetTenantMap: (data) => postFetch('/uas/v1/api/oba/esop/updateEsopClinetTenantMap', data),
  // 获取esop绑定信息
  getEsopClinetTenantMap: (data) => postFetch('/uas/v1/api/oba/esop/getEsopClinetTenantMap', data),
  // 重置用户密码
  resetTenantPasswd: (data) => postFetch('/uas/v1/api/udc/tenant/passwd/reset', data),
  // 锁定/解锁管理员
  lockTenant: (data) => postFetch('/uas/v1/api/udc/tenant/lock', data),
  // 冻结/激活管理员
  activeTenant: (data) => postFetch('/uas/v1/api/udc/tenant/active', data),
  // 管理员角色配置
  setTenantRole: (data) => postFetch('/uas/v1/api/udc/tenant/role/set', data),

  //租户设备分享
  //查询租户设备树
  getTenantTree: (data) => postFetch('/uas/v1/api/udc/tenant/tree', data),
  // 搜索租户树
  searchInTenantTree: (data) => postFetch('/uas/v1/api/udc/tenant/search', data),
  // 定位租户树
  locateInTenantTree: (data) => postFetch('/uas/v1/api/udc/tenant/locate', data),
  //查询共享设备树
  getShareDeviceTree: (data) => postFetch('/uas/v1/api/udc/device/share/tree', data),
  //查询租户共享组织详情
  getTenantShareDetail: (data) => postFetch('/uas/v1/api/udc/device/share/detail', data),
  //共享分配设备
  shareDeviceToTenant: (data) => postFetch('/uas/v1/api/udc/device/share/do', data),
  //模糊查询搜索共享设备
  searchInShareDeviceTree: (data) => postFetch('/uas/v1/api/udc/device/share/search', data),
  //设备共享分配
  addDeviceToUser: (data) => postFetch('/uas/v1/api/udc/device/shared/do', data, 60000),
  //设备共享分配移除
  removeDeviceToUser: (data) => postFetch('/uas/v1/api/udc/device/shared/remove', data),
  //用户组织树模糊查询
  searchUserTree: (data) => postFetch('/uas/v1/api/udc/user/search', data),
  //用户组织树定位
  locateUserTree: (data) => postFetch('/uas/v1/api/udc/user/locate', data),
  //租户共享权限查询
  getSharedPerms: (data) => postFetch('/uas/v1/api/udc/device/share/perm/get', data),
  //设置租户共享设备权限
  setSharedPerms: (data) => postFetch('/uas/v1/api/udc/device/share/perm/set', data),

  /*
         设备管理模块调用接口
     */
  // 添加设备
  addMainDevInfo: (data, timeout) => postFetch('/uas/v1/api/uvs/main-dev/add', data, timeout),
  // 添加设备时设置录像策略
  setRecordPolicyInfoByMainDevId: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy/set-by-mainDev', data),
  // 添加设备时设置录像策略
  getMediaNodeList: (data) => postFetch('/uas/v1/api/uvs/media/nodes/get', data),
  // 修改设备
  modifyMainDevInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/modify', data),
  // 批量删除设备
  deleteMainBatchDeleteInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/batchDelete', data),
  // 删除设备
  deleteMainDevInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/delete', data),
  getMainDevList: (data) => postFetch('/uas/v1/api/uvs/main-dev/list', data),
  //导出设备
  exportMainDevList: (data) => postFetch('/uas/v1/api/uvs/main-dev/list/export', data),
  // 获取单个设备信息
  getMainDevInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/info', data),
  // 获取域编码
  getDomainCode: (data) => postFetch('/uas/v1/api/uvs/domain/query', data),
  // 获取集群编码
  getClusterCode: (data) => postFetch('/uas/v1/api/uvs/cluster/query', data),
  // 获取网关ip,编码
  getTasCode: (data) => postFetch('/uas/v1/api/uvs/gateway/query', data),
  // 设备所属NVR编码
  getnvrCode: (data) => postFetch('/uas/v1/api/uvs/nvr/list', data),
  // 下载模板
  getMainDevTemplate: (data) => postFetch('/uas/v1/api/uvs/main-dev/template', data),
  // 批量导入
  importMainDevInfo: (data, timeout) => postFetch('/uas/v1/api/uvs/main-dev/import', data, timeout),
  // 调拨设备树
  getAllocateDeviceTree: (data) => postFetch('/uas/v1/api/uvs/device/allocate/tree', data),
  // 调拨设备
  allocateDevice: (data) => postFetch('/uas/v1/api/uvs/device/allocate/do', data),
  // 调拨同步下级设备
  syncAllocateDevice: (data) => postFetch('/uas/v1/api/uvs/device/allocate/sync', data),

  //ONVIF设备探测
  getEquipment: (data) => postFetch('/uas/v1/api/uvs/device/probe', data),
  //ONVIF设备验证
  probeValidation: (data) => postFetch('/uas/v1/api/uvs/device/probe/validation', data),

  /*
         录像计划管理
     */
  //录像计划列表查看
  getRecordPlanList: (data) => postFetch('/uas/v1/api/uvs/record-plan/list', data),
  //录像计划添加
  addRecordPlanInfo: (data) => postFetch('/uas/v1/api/uvs/record-plan/add', data),
  //录像计划修改
  modifyRecordPlanInfo: (data) => postFetch('/uas/v1/api/uvs/record-plan/modify', data),
  //录像计划删除
  deleteRecordPlanInfo: (data) => postFetch('/uas/v1/api/uvs/record-plan/delete', data),
  //录像计划查询
  getRecordPlanInfo: (data) => postFetch('/uas/v1/api/uvs/record-plan/info', data),

  // 摄像机录像策略设置
  setCameraRecordPolicyInfo: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy/set', data),

  /*
         镜头管理模块调用接口
     */
  // 添加镜头
  addCameraInfo: (data) => postFetch('/uas/v1/api/uvs/camera/add', data),
  // 修改镜头
  modifyCameraInfo: (data) => postFetch('/uas/v1/api/uvs/camera/modify', data),
  // 移动镜头
  moveCameraInfo: (data) => postFetch('/uas/v1/api/udc/move/camera', data),
  // 删除镜头
  deleteCameraInfo: (data) => postFetch('/uas/v1/api/uvs/camera/delete', data),
  // 获取镜头列表
  getCameraList: (data) => postFetch('/uas/v1/api/uvs/camera/list', data),
  // 导出镜头列表
  getCameraExportList: (data) => postFetch('/uas/v1/api/uvs/camera/list/export', data),
  // 获取单个镜头信息
  getCameraInfo: (data) => postFetch('/uas/v1/api/uvs/camera/info', data),
  // 获取镜头状态
  syncCameraStatus: (data) => postFetch('/uas/v1/api/uvs/camera/status/sync', data),
  // 获取主设备下摄像机列表查询信息
  getCameraListByMainDevId: (data) => postFetch('/uas/v1/api/uvs/camera/list-by-main-dev', data),
  // 停用摄像机
  enableCamera: (data) => postFetch('/uas/v1/api/uvs/camera/enable', data),
  // 停用摄像机录像
  enableCameraRecord: (data) => postFetch('/uas/v1/api/uvs/camera/record/enable', data),
  // 镜头批量录像策略设置
  batchSetCameraRecordPolicyInfo: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy/batch-set', data),
  // 导出摄像机信息
  exportCameraInfo: (data) => postFetch('/uas/v1/api/uvs/camera/export', data),
  // 下载导入摄像机GIS模板
  getCameraGisTemplate: (data) => postFetch('/uas/v1/api/uvs/camera/gis/template', data),
  // 下载导入摄像机GIS模板
  importCameraGisInfo: (data) => postFetch('/uas/v1/api/uvs/camera/gis/import', data),
  // 摄像机抓拍数据订阅
  subscribeCameraDatas: (data) => postFetch('/uas/v1/api/uvs/camera/data/subscribe/', data),
  // NVR800设备同步
  nvrSync: (data) => postFetch('/uas/v1/api/uvs/main-dev/channel-sync', data),

  // onenet配置
  // 获取onenet下的产品信息
  getOnenetProductList: (data) => postFetch('/uas/v1/api/oba/onenet/product/list', data),
  // 获取产品下的设备列表信息
  getOnenetDeviceList: (data) => postFetch('/uas/v1/api/oba/onenet/device/list', data),
  // onenet设备绑定镜头
  addOnetConfig: (data) => postFetch('/uas/v1/api/oba/onenet/config/add', data),
  // 镜头onenet配置查询
  getOnenetConfig: (data) => postFetch('/uas/v1/api/oba/onenet/config/get', data),

  // 零配置 镜头 解绑
  // 摄像机零配置信息查询
  queryCameraOcfgStatus: (data) => postFetch('/uas/v1/api/ocfg/device/status', data),
  // 判断镜头是否配置大喇叭sn号有的话返回sn号
  unbindCameraOcfg: (data) => postFetch('/uas/v1/api/ocfg/device/unbind', data),

  // 摄像机配置生成
  // 配置页查询
  getCameraConfig: (data) => postFetch('/uas/v1/api/oba/camera/config/detail', data),
  //摄像机镜头接入配置
  obtainCameraConfig: (data) => postFetch('/uas/v1/api/uvs/camera/config/detail', data),

  /**
   * 我的镜头管理
   */
  // 获取镜头列表
  getCameraListByUserId: (data) => postFetch('/uas/v1/api/uvs/camera/list-by-userId', data),
  // 获取镜头列表
  exportCameraInfoByUserId: (data) => postFetch('/uas/v1/api/uvs/camera/export-by-userId', data),

  /*
         镜头型号管理
     */
  // 摄像机兼容性列表查询
  listCameraCompatibleInfo: (data) => postFetch('/uas/v1/api/oba/camera/compatible/list', data),
  // 摄像机兼容性详情查询
  getCameraCompatibleInfo: (data) => postFetch('/uas/v1/api/oba/camera/compatible/detail', data),

  /*
         告警类型管理模块调用接口
     */

  // 查询告警类型信息
  getAlarmTypes: (data) => postFetch('/uas/v1/api/alarm/type/list', data),
  // 添加告警类型信息
  addAlarmType: (data) => postFetch('/uas/v1/api/alarm/type/add', data),
  // 修改告警类型信息
  modifyAlarmType: (data) => postFetch('/uas/v1/api/alarm/type/modify', data),
  // 启停用告警类型信息
  enableAlarmType: (data) => postFetch('/uas/v1/api/alarm/type/enable', data),
  //  告警组查询
  getGroups: (data) => postFetch('/uas/v1/api/alarm/group/list', data),
  //  根据告警类型码查询告警信息
  getAlarmType: (data) => postFetch('/uas/v1/api/alarm/type/info', data),

  /*
         密码管理模块调用接口
     */
  // 获取系统密码配置
  getConfiguration: (data) => postFetch('/uas/v1/api/config/password/info', data),
  // 配置系统密码规则
  setConfiguration: (data) => postFetch('/uas/v1/api/config/password/modify', data),
  // 密码复杂度规则获取
  getPasswordComplex: (data) => postFetch('/uas/v1/api/config/password/complex', data),

  /*
         账号管理模块调用接口
     */
  // 获取系统账户配置
  getConfigurationAcc: (data) => postFetch('/uas/v1/api/config/account/info', data),
  // 配置系统账户规则
  setConfigurationAcc: (data) => postFetch('/uas/v1/api/config/account/modify', data),

  /*
         白名单调用接口
     */
  // 查询账户IP白名单列表
  getWhiteIpList: (data) => postFetch('/uas/v1/api/account/whiteIp/list', data),
  // 开启/关闭用户IP白名单
  whiteIpEnbale: (data) => postFetch('/uas/v1/api/account/whiteIp/enable', data),
  // 添加用户IP白名单
  addWhiteIpInfo: (data) => postFetch('/uas/v1/api/account/whiteIp/add', data),
  // 删除用户IP白名单
  deleteWhiteIpInfo: (data) => postFetch('/uas/v1/api/account/whiteIp/delete', data),
  // 白名单配置
  configureWhiteIpList: (data) => postFetch('/uas/v1/api/account/whiteIp/configure', data),
  /*
         告警联动管理模块调用接口
     */
  // 添加告警联动策略
  addLinkagePolicyInfo: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/add', data),
  // 修改告警联动策略
  modifyLinkagePolicyInfo: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/modify', data),
  // 删除告警联动策略
  deleteLinkagePolicyInfo: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/delete', data),
  // 查询告警联动列表
  getLinkagePolicyList: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/list', data),
  // 获取告警联动策略信息
  getLinkagePolicyInfo: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/info', data),
  // 短信模板列表查询
  getSmsTemplateList: (data) => postFetch('/uas/v1/api/mgw/sms/template/list', data),
  // 添加短信模板
  addSmsTemplateInfo: (data) => postFetch('/uas/v1/api/mgw/sms/template/add', data),
  // 修改短信模板
  modifySmsTemplateInfo: (data) => postFetch('/uas/v1/api/mgw/sms/template/modify', data),
  // 删除短信模板
  deleteSmsTemplateInfo: (data) => postFetch('/uas/v1/api/mgw/sms/template/delete', data),
  // 单个短信模板信息查询
  getSmsTemplateInfo: (data) => postFetch('/uas/v1/api/mgw/sms/template/info', data),
  // 查询告警联动动作类型列表
  getLinkageActionTypeList: (data) => postFetch('/uas/v1/api/ecs/alarm/linkage/action-type/list', data),
  // 查询邮件模板列表
  getMailTemplateByType: (data) => postFetch('/uas/v1/api/mgw/mail/template/getMailTemplateByType', data),
  // 查询微信模板列表
  searchWeChatTemplate: (data) => postFetch('/uas/v1/api/mgw/wechat/template/searchWeChatTemplate', data),
  // 平台备份设备树
  getShadowTree: (data) => postFetch('/uas/v1/api/uvs/device/shadow/tree', data),

  /*
         前端参数配置模块调用接口
     */
  // 主设备基础信息查看
  mainDevBasicInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/basic-info', data),
  // 主设备基础信息设置
  mainDevBasicConfig: (data) => postFetch('/uas/v1/api/uvs/main-dev/basic-config', data),
  // 主设备网络参数查看
  mainDevNetworkInfo: (data) => postFetch('/uas/v1/api/uvs/main-dev/network-info', data),
  // 主设备网络参数设置
  mainDevNetworkConfig: (data) => postFetch('/uas/v1/api/uvs/main-dev/network-config', data),
  // 摄像机基础信息查看
  cameraBasicInfo: (data) => postFetch('/uas/v1/api/uvs/camera/basic-info', data),
  // 摄像机基础信息设置
  cameraBasicConfig: (data) => postFetch('/uas/v1/api/uvs/camera/basic-config', data),
  // 视频编码查看
  cameraStreamInfo: (data) => postFetch('/uas/v1/api/uvs/camera/stream-info', data),
  // 视频编码设置
  cameraStreamConfig: (data) => postFetch('/uas/v1/api/uvs/camera/stream-config', data),
  // 图像参数查看
  cameraDisplayInfo: (data) => postFetch('/uas/v1/api/uvs/camera/display-info', data),
  // 图像参数设置
  cameraDisplayConfig: (data) => postFetch('/uas/v1/api/uvs/camera/display-config', data),
  // OSD参数查看
  cameraOSDInfo: (data) => postFetch('/uas/v1/api/uvs/camera/osd-info', data),
  // OSD参数设置
  cameraOSDConfig: (data) => postFetch('/uas/v1/api/uvs/camera/osd-config', data),
  // OSD参数查看(5.4.3)
  cameraMultiOsdInfo: (data) => postFetch('/uas/v1/api/uvs/camera/osd-infolist', data),
  // OSD参数设置(5.4.3)
  cameraMultiOsdConfig: (data) => postFetch('/uas/v1/api/uvs/camera/osd-configlist', data),
  // 前端抓拍参数查看
  cameraSnapInfo: (data) => postFetch('/uas/v1/api/uvs/camera/snap-info', data),
  // 前端抓拍参数设置
  cameraSnapConfig: (data) => postFetch('/uas/v1/api/uvs/camera/snap-config', data),
  // 前端串口参数查看
  cameraSerialInfo: (data) => postFetch('/uas/v1/api/uvs/camera/serial-info', data),
  // 前端串口参数设置
  cameraSerialConfig: (data) => postFetch('/uas/v1/api/uvs/camera/serial-config', data),
  // 前端云台参数查看
  cameraPTZInfo: (data) => postFetch('/uas/v1/api/uvs/camera/ptz-info', data),
  // 前端云台参数设置
  cameraPTZConfig: (data) => postFetch('/uas/v1/api/uvs/camera/ptz-config', data),
  // 前端重启
  resetDevice: (data) => postFetch('/uas/v1/api/uvs/device/reset', data),
  // 前端视频遮挡告警查看
  cameraOcclusionInfo: (data) => postFetch('/uas/v1/api/uvs/camera/occlusion-info', data),
  // 前端视频遮挡告警设置
  cameraOcclusionConfig: (data) => postFetch('/uas/v1/api/uvs/camera/occlusion-config', data),
  // 前端移动侦测查看
  cameraVmdInfo: (data) => postFetch('/uas/v1/api/uvs/camera/vmd-info', data),
  // 前端移动侦测设置
  cameraVmdConfig: (data) => postFetch('/uas/v1/api/uvs/camera/vmd-config', data),
  // 前端音频参数查看
  cameraAudioInfo: (data) => postFetch('/uas/v1/api/uvs/camera/audio-info', data),
  // 前端音频参数设置
  cameraAudioConfig: (data) => postFetch('/uas/v1/api/uvs/camera/audio-config', data),
  // 摄像机录像策略查看
  getCameraRecordPolicyInfo: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy/info', data),
  // 摄像机录像策略删除
  deleteCameraRecordPolicyInfo: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy/delete', data),
  // 获取前端智能参数
  getCameraIntelligentInfo: (data) => postFetch('/uas/v1/api/uvs/pu_config/intelligent/get_info', data),
  // 设置前端智能参数
  setCameraIntelligentInfo: (data) => postFetch('/uas/v1/api/uvs/pu_config/intelligent/set_info', data),
  // 获取前端智能参数 公共参数
  getCameraIntelligentBaseInfo: (data) => postFetch('/uas/v1/api/uvs/pu_config/intelligent/get_base', data),
  // 设置前端智能参数 公共参数
  setCameraIntelligentBaseInfo: (data) => postFetch('/uas/v1/api/uvs/pu_config/intelligent/set_base', data),
  // 服务器录像时间策略查询
  getCameraRecordPolicyByTime: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy-by-time/get', data),
  // 服务器录像时间策略设置
  setCameraRecordPolicyByTime: (data) => postFetch('/uas/v1/api/uvs/camera/record-policy-by-time/set', data),
  // 图片留存期策略查询
  getCameraImgPolicy: (data) => postFetch('/uas/v1/api/uvs/camera/img-policy/get', data),
  // 图片留存期策略设置
  setCameraImgPolicy: (data) => postFetch('/uas/v1/api/uvs/camera/img-policy/set', data),

  /*
         运营管理
     */
  // 域列表
  syncAllPlat: (data) => postFetch('/uas/v1/api/uvs/domain/sync', data),
  // 同步单个平台域列表
  syncSinglePlat: (data) => postFetch('/uas/v1/api/uvs/domain/single/sync', data),
  // 域列表
  getDomainList: (data) => postFetch('/uas/v1/api/uvs/domain/list', data),
  // 域删除
  deleteDomainInfo: (data) => postFetch('/uas/v1/api/uvs/domain/delete', data),
  // 集群删除
  deleteClusterInfo: (data) => postFetch('/uas/v1/api/uvs/cluster/delete', data),
  // 集群列表
  getClusterList: (data) => postFetch('/uas/v1/api/uvs/cluster/list', data),
  // 集群（取消）支持存储
  modifyClusterStorage: (data) => postFetch('/uas/v1/api/uvs/cluster/storage/modify', data),
  // 查看单个集群下网关列表
  getGatewayList: (data) => postFetch('/uas/v1/api/uvs/gateway/list', data),
  // 网关删除
  deleteGatewayInfo: (data) => postFetch('/uas/v1/api/uvs/gateway/delete', data),
  // 配置网关
  modifyGatewayConf: (data) => postFetch('/uas/v1/api/uvs/gateway/configure/modify', data),
  //分配集群列表
  getClusterByOrgId: (data) => postFetch('/uas/v1/api/uvs/cluster/organization/list', data),
  //查询地区平台尚未被分配的集群
  getClusterByOrganizationPlat: (data) => postFetch('/uas/v1/api/uvs/cluster/organizationplat/list', data),
  //查询地区在该集群尚未分配的网关
  getGatewayByOrganizationPlat: (data) => postFetch('/uas/v1/api/uvs/gateway/organizationplat/list', data),
  //分配集群信息
  addOrganizationGateway: (data) => postFetch('/uas/v1/api/uvs/gateway/organization/add', data),
  //取消集群信息
  delOrganizationGateway: (data) => postFetch('/uas/v1/api/uvs/gateway/organization/delete', data),
  //Boss开通（不）使用
  modifyBossTag: (data) => postFetch('/uas/v1/api/uvs/cluster/bosstag/modify', data),
  //平台列表查询
  getPlatListByType: (data) => postFetch('/uas/v1/api/uvs/vps/plat/list', data),
  //域列表查询
  getRegionList: (data) => postFetch('/uas/v1/api/uvs/vps/region/list', data),
  //集群列表查询
  getVpsDomainList: (data) => postFetch('/uas/v1/api/uvs/vps/domain/list', data),
  //集群详情查询
  getVpsDomainInfo: (data) => postFetch('/uas/v1/api/uvs/vps/domain/info', data),
  //同步下级平台，域，集群信息
  syncDomain: (data) => postFetch('/uas/v1/api/uvs/vps/domain/sync', data),
  //已分配集群列表查询
  getAllocatedDomainList: (data) => postFetch('/uas/v1/api/uvs/vps/domain/allocated/list', data),
  //未分配集群列表查询
  getUnAllocatedDomainList: (data) => postFetch('/uas/v1/api/uvs/vps/domain/unAllocated/list', data),
  //分配集群
  AllocateDomain: (data) => postFetch('/uas/v1/api/uvs/vps/domain/allocate', data),
  //取消分配集群
  cancelAllocateDomain: (data) => postFetch('/uas/v1/api/uvs/vps/domain/allocate/cancel', data),
  //Boss开通使用
  modifyVpsBossTag: (data) => postFetch('/uas/v1/api/uvs/vps/bosstag/modify', data),
  //查询单个集群支持的协议
  getProtocolListByDomain: (data) => postFetch('/uas/v1/api/uvs/vps/domain/protocol/list', data),
  //协议接入路数是否达到上限\
  checkUpperLimit: (data) => postFetch('/uas/v1/api/uvs/vps/domain/upperLimit/check', data),
  //添加主设备所选域过滤
  getPlatRegionList: (data) => postFetch('/uas/v1/api/uvs/vps/region/plat/query', data),
  //添加主设备所选集群过滤
  getRegionDomainList: (data) => postFetch('/uas/v1/api/uvs/vps/domain/region/query', data),

  // 设置图片存储天数(uvs新增接口)
  modifyCameraImagTTL: (data) => postFetch('/uas/v1/api/uvs/camera/img-policy/modify-by-maindev', data),

  /*
         日志管理
     */
  // 查询日志操作类型
  getOperationTypeList: (data) => postFetch('/uas/v1/api/udc/log/operation/type', data),
  // 查询日志记录
  getLogList: (data) => postFetch('/uas/v1/api/udc/log/list', data, 60000),
  // 查询日志记录详情
  getLoginfo: (data) => postFetch('/uas/v1/api/udc/log/info', data),
  // 导出日志记录
  exportLogInfo: (data) => postFetch('/uas/v1/api/udc/log/export', data, 300000),

  /*
         告警列表查询模块调用接口
     */
  //获取告警信息列表
  getAlarmList: (data) => postFetch('/uas/v1/api/alarm/list', data, 60000),
  //获取告警抓拍url
  getAlarmSnap: (data) => postFetch('/uas/v1/api/alarm/snap/get', data),

  /*
         告警等级管理模块调用接口
     */
  //查询告警级别列表
  listAlarmLevelByPage: (data) => postFetch('/uas/v1/api/ecs/alarm/level/list/page', data),
  //查询告警级别信息
  getAlarmLevelInfo: (data) => postFetch('/uas/v1/api/ecs/alarm/level/info', data),
  //添加告警级别信息
  addAlarmLevel: (data) => postFetch('/uas/v1/api/ecs/alarm/level/add', data),
  //修改告警级别信息
  modifyAlarmLevel: (data) => postFetch('/uas/v1/api/ecs/alarm/level/modify', data),
  //删除告警级别信息
  deleteAlarmLevel: (data) => postFetch('/uas/v1/api/ecs/alarm/level/delete', data),

  /*
         告警处理模块调用接口
     */
  // 告警消息正误检
  checkAlarmReport: (data) => postFetch('/uas/v1/api/alarm/check', data),
  // 告警消息确认
  confirmAlarm: (data) => postFetch('/uas/v1/api/alarm/confirm', data),
  //查询告警详情
  getAlarmById: (data) => postFetch('/uas/v1/api/alarm/info', data),

  getDeviceInfo: (data) => postFetch('/uas/v1/api/udc/device/info', data),
  getAlarmAzimuth: (data) => postFetch('/uas/v1/api/oba/camera/alarm-position/get', data),

  // 告警用设备树
  getDeviceTree: (data) => postFetch('/uas/v1/api/udc/device/tree', data),
  //设备树的模糊查询
  searchInDeviceTree: (data) => postFetch('/uas/v1/api/udc/device/search', data),
  //用户设备或设备组定位
  locateInDeviceTree: (data) => postFetch('/uas/v1/api/udc/device/locate', data),

  //获取用户树
  getUserTree: (data) => postFetch('/uas/v1/api/udc/user/tree', data),
  // 搜索用户树
  searchInUserTree: (data) => postFetch('/uas/v1/api/udc/user/search', data),
  // 定位用户树
  locateInUserTree: (data) => postFetch('/uas/v1/api/udc/user/locate', data),

  //获取上传地址
  getUploadUrl: (data) => postFetch('/uas/v1/api/media/upload/url', data),

  //获取文件下载url
  getDownloadUrl: (data) => postFetch('/uas/v1/api/media/download/url', data),

  // 上传文件 永久
  uploadFile: (data) => postFetch('/file/fss/upload/permanent', data),

  // 上传文件 临时
  uploadFileTemporary: (data) => postFetch('/file/fss/upload/temporary', data),

  //获取实时浏览地址
  getLiveUrl: (data) => postFetch('/uas/v1/api/media/live', data),

  //获取实时浏览地址
  getMediaLiveUrl: (data) => postFetch('/mss/v1/api/mss/media/live', data),

  // 查询预置位
  getPreset: (data) => postFetch('/uas/v1/api/preset/get', data),
  getPresetId: (data) => postFetch('/uas/v1/api/ecs/alarm/preset-id/get', data),

  // 获取区域列表(一次性获取全部数据)
  getAreaChildAll: (data) => postFetch('/uas/v1/api/dac/area/all-area', data),
  // 获取区域编码
  getAreaCode: (data) => postFetch('/uas/v1/api/udc/organization/info', data),
  /*
         录像丢失与完整性查询
     */
  getVideoRecordList: (data) => postFetch('/uas/v1/api/record/list', data),

  /*
         菜单权限管理
     */
  // 系统菜单查询（仅超级管理员使用）
  selectSystemMenus: (data) => postFetch('/uas/v1/api/udc/management/sys-menus/get', data),
  // 系统菜单设置（仅超级管理员使用）
  updateSystemMenus: (data) => postFetch('/uas/v1/api/udc/management/sys-menus/set', data),
  // 查询系统权限列表（仅超级管理员使用）
  selectSystemPermissions: (data) => postFetch('/uas/v1/api/udc/management/sys-perm/list', data),
  // 添加系统权限（仅超级管理员使用）
  addSystemPermission: (data) => postFetch('/uas/v1/api/udc/management/sys-perm/add', data),
  // 修改系统权限（仅超级管理员使用）
  modifySystemPermission: (data) => postFetch('/uas/v1/api/udc/management/sys-perm/modify', data),
  // 删除系统权限（仅超级管理员使用）
  deleteSystemPermission: (data) => postFetch('/uas/v1/api/udc/management/sys-perm/delete', data),
  // 导入系统权限（仅超级管理员使用）
  resetSystemPermission: (data) => postFetch('/uas/v1/api/udc/management/sys-perm/reset', data),

  /*
         模板文件下载
     */
  // 模板文件下载
  downloadTemplate: (data) => postFetch('/uvs/v1/api/vir/download/template', data),

  /*
         网关/集群管理
      */
  //接入网关/平台类型查询
  getAccessType: (data) => postFetch('/uas/v1/api/udc/gateway/access-type', data),
  //自动添加网关
  autoAddAdapterGateway: (data) => postFetch('/uas/v1/api/oms/adapter-gateway/ivs/group', data),
  //新增网关集群
  addAdapterGatewayInfo: (data) => postFetch('/uas/v1/api/udc/adapter-gateway/add', data),
  //修改网关集群
  modifyAdapterGatewayInfo: (data) => postFetch('/uas/v1/api/udc/adapter-gateway/modify', data),
  //网关集群删除
  deleteAdapterGatewayInfo: (data) => postFetch('/uas/v1/api/udc/adapter-gateway/delete', data),
  //查询网关集群列表
  selectAdapterGateways: (data) => postFetch('/uas/v1/api/udc/adapter-gateway/select', data),
  //查询单个网关集群详情信息
  getAdapterGatewayInfo: (data) => postFetch('/uas/v1/api/udc/adapter-gateway/info', data),
  //关联服务器列表查询
  selectNodeHealths: (data) => postFetch('/uas/v1/api/oms/health/list', data),
  //网关详情状态变更记录
  selectGatewayStatusLogs: (data) => postFetch('/uas/v1/api/oms/node/status/history/list', data),
  //网关启用/停用
  gatewayEnableModify: (data) => postFetch('/uas/v1/api/udc/gateway-enable/modify', data),

  /*
         license
      */
  //校验license是否过期
  checkLicenseExpire: (data) => postFetch('/uas/v1/api/oms/license/check_expire', data),
  //查询license信息
  getLicenseInfo: (data) => postFetch('/uas/v1/api/oms/license/info', data),
  //导入license信息
  importLicenseInfo: (data) => postFetch('/uas/v1/api/oms/license/import', data, 72000),

  /*
         能力新增接口
     */
  // 告警组查询
  getGroupsQuery: (data) => postFetch('/uas/v1/api/alarm/group/query', data),
  // 查询告警类型信息
  getAlarmTypesQuery: (data) => postFetch('/uas/v1/api/alarm/type/query', data),
  // 获取角色列表
  selectRolesQuery: (data) => postFetch('/uas/v1/api/udc/role/query', data),
  // 监控平台列表查询
  getPlatformListQuery: (data) => postFetch('/uas/v1/api/uvs/platform/query', data),
  // 录像计划列表查看
  getRecordPlanListQuery: (data) => postFetch('/uas/v1/api/uvs/record-plan/query', data),
  // 获取单个镜头信息
  getCameraInfoQuery: (data) => postFetch('/uas/v1/api/uvs/camera/query', data),
  // 获取组织信息
  getOrganizationQuery: (data) => postFetch('/uas/v1/api/udc/organization/query', data),
  //导出全部告警
  exportAllAlarm: (data) => postFetch('/uas/v1/api/ecs/alarm/export', data, 3000000),

  // 轮巡管理
  // 轮巡任务列表
  getTurningList: (data) => postFetch('/uas/v1/api/uvs/turning/list', data),
  // 查询单个轮巡任务
  getTurningInfo: (data) => postFetch('/uas/v1/api/uvs/turning/info', data),
  // 轮巡任务添加
  addTurningInfo: (data) => postFetch('/uas/v1/api/uvs/turning/add', data),
  // 轮巡任务修改
  modifyTurningInfo: (data) => postFetch('/uas/v1/api/uvs/turning/modify', data),
  // 轮巡任务删除
  deleteTurningInfo: (data) => postFetch('/uas/v1/api/uvs/turning/delete', data),
  // 轮巡组添加
  addTurningGroupInfo: (data) => postFetch('/uas/v1/api/uvs/turning/group/add', data),
  // 轮巡组修改
  modifyTurningGroupInfo: (data) => postFetch('/uas/v1/api/uvs/turning/group/modify', data),
  // 轮巡组删除
  deleteTurningGroupInfo: (data) => postFetch('/uas/v1/api/uvs/turning/group/delete', data),
  // 轮巡组下摄像机添加
  addTurningCameraInfo: (data) => postFetch('/uas/v1/api/uvs/turning/camera/add', data),
  // 轮巡组下摄像机修改
  modifyTurningCameraInfo: (data) => postFetch('/uas/v1/api/uvs/turning/camera/modify', data),
  // 轮巡组下摄像机删除
  deleteTurningCameraInfo: (data) => postFetch('/uas/v1/api/uvs/turning/camera/delete', data),

  /*
         智能工单
     */
  // 新增任务
  add_ticketInfo: (data) => postFetch('/uas/v1/api/oba/ticket/add', data),
  // 变更任务
  update_ticketInfo: (data) => postFetch('/uas/v1/api/oba/ticket/update', data),
  // 处理&&审核任务
  deal_ticketInfo: (data) => postFetch('/uas/v1/api/oba/ticket/deal', data),
  // 取消任务
  delete_ticketInfo: (data) => postFetch('/uas/v1/api/oba/ticket/del', data),
  // 获取任务列表
  get_ticketList: (data) => postFetch('/uas/v1/api/oba/ticket/list', data),
  // 搜索任务
  select_ticketList: (data) => postFetch('/uas/v1/api/oba/ticket/select', data),
  // 获取操作历史列表
  get_operationList: (data) => postFetch('/uas/v1/api/oba/ticket/operationList', data),
  // 获取人员列表
  get_personList: (data) => postFetch('/uas/v1/api/oba/ticket/personList', data),
  // 获取事件类型
  get_eventTypeList: (data) => postFetch('/uas/v1/api/oba/ticket/eventList', data),
  // 故障上报-------------
  //视频故障列表查询
  getVideoFaultList: (data) => postFetch('/oba/v1/api/oba/video-fault/list', data),
  //视频故障添加 ,
  addVideoFault: (data) => postFetch('/oba/v1/api/oba/video-fault/add', data),
  /*
     抓拍管理
   */
  getSnapList: (data) => postFetch('/uas/v1/api/snap/list', data),

  // 行政区域字典
  getSubArea: (data) => postFetch('/uas/v1/api/udc/sub/area', data),
  // 行政区域字典 能力接口
  querySubArea: (data) => postFetch('/uas/v1/api/udc/sub/area/query', data),
  // 快捷生成国标目录
  quickCreateArea: (data) => postFetch('/uas/v1/api/udc/area/create', data, 300000),
  //区域字典模板导出
  dictionarytemplateExport: (data) => postFetch('/uas/v1/api/udc/area/template/download', data, 60000),
  //区域字典批量导入
  batchAreaImport: (data) => postFetch('/uas/v1/api/udc/area/import', data, 300000),
  //区域字典批量导出
  batchAreaExport: (data) => postFetch('/uas/v1/api/udc/area/export', data, 60000),

  // 查看收藏夹摄像机列表
  getFavoriteCamList: (data) => postFetch('/uas/v1/api/favorite-camera/list', data),

  /**
   * @description 会话管理+重置密码
   * @param {Object} data
   */
  //获取手机验证码
  fetchSmsCode: (data) => postFetch('/uas/v1/api/smscode/fetch', data),
  //通过手机重置密码
  resetPassword: (data) => postFetch('/uas/v1/api/udc/management/passwd/reset', data),
  //获取邮箱验证码
  fetchEmailCode: (data) => postFetch('/uas/v1/api/emailcode/fetch', data),
  //通过邮箱重置密码
  resetPasswordByEmail: (data) => postFetch('/uas/v1/api/udc/management/passwd/reset-by-email', data),
  //查询会话列表
  getSessionList: (data) => postFetch('/uas/v1/api/udc/session/list', data),
  //签退用户会话
  signOutSession: (data) => postFetch('/uas/v1/api/udc/session/sign-out', data),
  //心跳保活接口
  heartbeat: (data) => postFetch('/uas/v1/api/user/heartbeat', data, 300000),
  getAlarmPlanList: (data) => postFetch('/uas/v1/api/ecs/linkageExt/getDisposalPlanList', data),
  // 详情
  getAlarmPlanInfo: (data) => postFetch('/uas/v1/api/ecs/linkageExt/getDisposalPlanById', data),
  // 获取已选择的告警类型
  getAlarmTypeByPlan: (data) => postFetch('/uas/api/ecs/linkageExt/getAlarmTypeByPlan', data),
  /**
   * @description 系统公告
   * @param {Object} data
   */
  //发布公告
  announcePublish: (data) => postFetch('/uas/v1/api/bms/announce/publish', data),
  //审核公告
  announceCheck: (data) => postFetch('/uas/v1/api/bms/announce/check', data),
  //终止公告
  announceTerminate: (data) => postFetch('/uas/v1/api/bms/announce/terminate', data),
  //删除公告
  announceDelete: (data) => postFetch('/uas/v1/api/bms/announce/delete', data),
  //公告列表查询
  announceList: (data) => postFetch('/uas/v1/api/bms/announce/list', data),
  //公告详情查询
  announceInfo: (data) => postFetch('/uas/v1/api/bms/announce/info', data),

  //2021/10/19
  /**
   * @description 静态任务转码+固定任务转码配置信息
   * @param {Object} data
   */
  getCameraConfigInfo: (data) => postFetch('/uas/v1/api/media/camera/config/info', data),
  //启动静态转码任务
  startTranscodesTask: (data) => postFetch('/uas/v1/api/media/camera/transcode/start', data),
  //停止静态转码任务
  stopTranscodesTask: (data) => postFetch('/uas/v1/api/media/camera/transcode/stop', data),
  //删除静态转码任务
  deleteTranscodesTask: (data) => postFetch('/uas/v1/api/media/camera/transcode/delete', data),
  //创建静态转码任务
  createCameraTranscodes: (data) => postFetch('/uas/v1/api/media/camera/transcode/createList', data),
  //修改静态转码任务
  updateCameraTranscode: (data) => postFetch('/uas/v1/uas/v1/api/media/camera/transcode/update', data),
  //获取静态转码任务配置信息（详情）
  getCameraTranscodeTaskInfo: (data) => postFetch('/uas/v1/api/media/camera/transcode/get', data),

  //查询转码节点列表（静态转码）
  getTranscodeNodes: (data) => postFetch('/uas/v1/api/media/transcode/nodeList', data),
  //创建转码任务（静态转码）
  createTranscodeNodes: (data) => postFetch('/uas/v1/api/media/camera/static/transcode/create', data),

  //2022/07/30
  /**
   * @description 主设备参数配置
   * @param {Object} data
   */
  // 获取主设备参数
  getDevConfig: (data) => postFetch('/uas/v1/api/uvs/device/config/get', data),
  // 重启前端
  getReset: (data) => postFetch('/uas/v1/api/uvs/device/reset', data),
  // 设置主设备参数
  setDevConfig: (data) => postFetch('/uas/v1/api/uvs/device/config/set', data),
  //查询主设备密码
  getDevPassword: (data) => postFetch('/uas/v1/api/uvs/dev/password/get', data),
  //设置主设备密码
  setDevPassword: (data) => postFetch('/uas/v1/api/uvs/dev/password/set', data),
  //获取通道信息
  getSubDeviceChannelList: (data) => postFetch('/uas/v1/api/uvs/main-dev/subDeviceChannelList', data),

  /**
   * 用户行为
   * */
  // 同意行为操作
  acceptBehavior: (data) => postFetch('/uas/v1/api/udc/behavior/accept', data),
  // 撤销行为操作
  revokeBehavior: (data) => postFetch('/uas/v1/api/udc/behavior/revoke', data),
  // 用户行为状态查询
  queryBehaviorState: (data) => postFetch('/uas/v1/api/udc/behavior/state', data),
  // 用户行为记录查询
  getBehaviorList: (data) => postFetch('/uas/v1/api/udc/behavior/record/list', data),
  // 获取行为协议
  getBehaviorProtocols: (data) => postFetch('/uas/v1/api/udc/behavior/protocols', data),

  // 水印管理列表
  getWatermarkInfoListByPage: (data) => postFetch('/uas/v1/api/udc/watermark/info/getListByPage', data),
  //删除水印
  deleteWatermarkInfo: (data) => postFetch('/uas/v1/api/udc/watermark/manage/delete', data),
  //水印开启/关闭
  changeWatermarkInfoStatus: (data) => postFetch('/uas/v1/api/udc/watermark/manage/changeStatus', data),
  // 查询国标水印开关
  getGbWatermarkEnable: (data) => postFetch('/uas/v1/api/udc/watermark/gbWatermarkEnable/get', data),
  //水印添加
  addWatermarkInfo: (data) => postFetch('/uas/v1/api/udc/watermark/manage/add', data),
  //水印详情
  getWatermarkInfoDetail: (data) => postFetch('/uas/v1/api/udc/watermark/info/detail', data),
  //水印编辑
  updateWatermarkInfo: (data) => postFetch('/uas/v1/api/udc/watermark/manage/update', data),
  //客户端获取内容水印
  getContentWatermarkInfo: (data) => postFetch('/uas/v1/api/udc/watermark/content/get', data),
  //客户端获取视频水印
  getVideoWatermarkInfo: (data) => postFetch('/uas/v1/api/udc/watermark/video/get', data),
  //租户列表查询(包含admin租户)
  getWatermarkTenantList: (data) => postFetch('/uas/v1/api/udc/tenant/watermark/list', data),
  //国标水印关联
  linkWatermarkCamera: (data) => postFetch('/uas/v1/api/udc/watermark/manage/link', data),
  //国标水印取消关联
  unlinkWatermarkCamera: (data) => postFetch('/uas/v1/api/udc/watermark/manage/unlink', data),

  /* 备份管理 */
  //获取备份域列表
  getBackupList: (data) => postFetch('/uas/v1/api/uvs/domain/backup/list', data),
  //获取录像备份参数
  getBackupConfig: (data) => postFetch('/uas/v1/api/uvs/record/backup/config/get', data),
  //设置录像备份参数
  setBackupConfig: (data) => postFetch('/uas/v1/api/uvs/record/backup/config/set', data),
  //查询录像备份计划
  getBackupPlan: (data) => postFetch('/uas/v1/api/uvs/record/backup/plan/get', data),
  //设置录像备份计划
  setBackupPlan: (data) => postFetch('/uas/v1/api/uvs/record/backup/plan/set', data),
  //删除录像备份计划
  deleteBackupPlan: (data) => postFetch('/uas/v1/api/uvs/record/backup/plan/delete', data),
  //告警级别列表
  getAlarmLevelList: (data) => postFetch('/uas/v1/api/ecs/alarm/level/query-list', data),

  /* 图像信息 */
  //获取图像信息
  getConfig: (data) => postFetch('/uas/v1/api/ars/image-retention/config/get', data),
  //编辑图像信息
  getConfigSet: (data) => postFetch('/uas/v1/api/ars/image-retention/config/set', data),
  // 修改图片存储天数
  modifyMetaDataPolicy: (data) => postFetch('/uas/v1/api/uvs/camera/image-policy/modify', data),
  /*
        算法模型管理
    */
  // 算法模型列表
  getAlgorithmModelList: (data) => postFetch('/uas/v1/api/ars/algorithm/model/list', data),
  // 算法模型信息
  getAlgorithmModel: (data) => postFetch('/uas/v1/api/ars/algorithm/model/info', data),
  // 添加模型信息
  addAlgorithmModel: (data) => postFetch('/uas/v1/api/ars/algorithm/model/add', data),
  // 修改模型信息
  modifyAlgorithmModel: (data) => postFetch('/uas/v1/api/ars/algorithm/model/modify', data),
  // 删除模型信息
  deleteAlgorithmModel: (data) => postFetch('/uas/v1/api/ars/algorithm/model/delete', data),

  /*
        算法分配
    */
  // 查询租户拥有的算法
  getTenantAlgorithmResource: (data) => postFetch('/uas/v1/api/ars/tenant/algorithm/list', data),
  // 查询用户拥有的算法
  getUserAlgorithmList: (data) => postFetch('/uas/v1/api/ars/user/algorithm/list', data),
  // 查询子租户可新增分配的算法资源列表
  getTenantAllocateAvailable: (data) => postFetch('/uas/v1/api/ars/algorithm/tenant-allocate-available', data),
  // 查询用户可新增分配的算法资源列表
  getUserAllocateAvailable: (data) => postFetch('/uas/v1/api/ars/algorithm/user-allocate-available', data),
  // 为租户分配算法资源
  allocateToTenant: (data) => postFetch('/uas/v1/api/ars/algorithm/allocate-to-tenant', data),
  // 为用户分配算法资源
  allocateToUser: (data) => postFetch('/uas/v1/api/ars/algorithm/allocate-to-user', data),
  // 修改租户分配算法
  modifyTenantAllocateInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/tenant-allocated-modify', data),
  // 修改用户分配算法
  modifyUserAllocateInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/user-allocated-modify', data),
  // 取消租户分配算法资源
  cancelTenantAllocate: (data) => postFetch('/uas/v1/api/ars/algorithm/cancel-tenant-allocate', data),
  // 取消用户分配算法资源
  cancelUserAllocate: (data) => postFetch('/uas/v1/api/ars/algorithm/cancel-user-allocate', data),

  /*
        算法接入信息
    */
  // 算法接入信息添加
  addAlgorithmAccessInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/access/add', data),
  // 算法接入信息修改
  modifyAlgorithmAccessInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/access/modify', data),
  // 算法接入信息删除
  deleteAlgorithmAccessInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/access/delete', data),
  // 算法接入信息列表
  getAlgorithmAccessList: (data) => postFetch('/uas/v1/api/ars/algorithm/access/list', data),
  // 算法接入信息详情
  getAlgorithmAccessInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/access/info', data),

  // 算法接入信息添加（新）
  addAlgorithmAccessInfoNew: (data) => postFetch('/uas/v1/api/ars/algorithm/access/add', data),

  // 查平台调用这个接口
  queryAlgorithmPlatList: (data) => postFetch('/uas/v1/api/ars/algorithm/access/query', data),

  /*
        算法管理
    */
  // 算法管理添加
  addNewAlgorithmInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/add', data),
  // 算法管理修改
  modifyNewAlgorithmInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/modify', data),
  // 算法管理删除
  deleteNewAlgorithmInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/delete', data),
  // 算法管理列表
  getNewAlgorithmList: (data) => postFetch('/uas/v1/api/ars/algorithm/list', data),
  // 算法管理列表 能力接口
  queryNewAlgorithmList: (data) => postFetch('/uas/v1/api/ars/algorithm/query', data),
  // 算法管理详情
  getNewAlgorithmInfo: (data) => postFetch('/uas/v1/api/ars/algorithm/info', data),

  /*
        智能分析任务
    */
  // 智能分析任务添加
  addNewTaskInfo: (data) => postFetch('/uas/v1/api/ars/task/add', data),
  // 智能分析任务修改
  modifyNewTaskInfo: (data) => postFetch('/uas/v1/api/ars/task/modify', data),
  // 智能分析任务删除
  deleteNewTaskInfo: (data) => postFetch('/uas/v1/api/ars/task/delete', data),
  // 智能分析任务列表
  getNewTaskList: (data) => postFetch('/uas/v1/api/ars/task/list', data),
  // 智能分析任务详情
  getNewTaskInfo: (data) => postFetch('/uas/v1/api/ars/task/info', data),
  // 智能分析任务重启
  startNewTask: (data) => postFetch('/uas/v1/api/ars/task/restart', data),
  // 智能分析任务停止
  stopNewTask: (data) => postFetch('/uas/v1/api/ars/task/stop', data),
  // 查询任务摄像机预置位是否可能冲突
  mayConflict: (data) => postFetch('/uas/v1/api/ars/task/preset/conflict', data),

  /*
        算法画线
    */
  //查询算法画线列表
  queryAlgorithmRule: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/query/list', data),
  //查询算法画线列表(详情)
  searchAlgorithmRuleById: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/query/id', data),
  //根据算法id查询已绑定算法画线模板
  searchAlgorithmRuleByAlgorithm: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/query/algorithm', data),
  //创建算法画线模板
  addAlgorithmRule: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/add', data),
  //删除算法画线模板
  deleteAlgorithmRule: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/delete', data),
  //启停算法画线模板
  changeAlgorithmRuleStatus: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/change-status', data),
  //修改算法画线模板
  modifyAlgorithmRule: (data) => postFetch('/uas/v1/api/ars/algorithm/rule/modify', data),

  /*
        布控管理
    */
  //查询布控列表
  getNewGuardList: (data) => postFetch('/uas/v1/api/ars/guard/list', data),
  // 查询布控列表 能力接口
  queryNewGuardList: (data) => postFetch('/uas/v1/api/ars/guard/query', data),
  //创建布控任务
  addNewGuardInfo: (data) => postFetch('/uas/v1/api/ars/guard/add', data),
  //修改布控任务
  modifyNewGuardInfo: (data) => postFetch('/uas/v1/api/ars/guard/modify', data),
  //删除布控任务
  deleteNewGuardInfo: (data) => postFetch('/uas/v1/api/ars/guard/delete', data),
  //单个布控任务信息
  getNewGuardInfo: (data) => postFetch('/uas/v1/api/ars/guard/info', data),
  //启用/停用布控
  enableGuard: (data) => postFetch('/uas/v1/api/ars/guard/enable', data),
  //布控执行情况查询
  getGuardExecutionLog: (data) => postFetch('/uas/v1/api/ars/guard/execution/log', data),
  //布控命中查询
  getGuardHitList: (data) => postFetch('/uas/v1/api/ars/guard/hit/list', data),
  // 智能告警详情
  getGuardHitInfo: (data) => postFetch('/uas/v1/api/ars/guard/hit/info', data),
  // 元数据周期统计
  getEdgeProperties: (data) => postFetch('/uas/v1/api/ars/algorithm/model/edge/properties', data),
  // 删除布控源 (多个布控源设备或任务的其中有部分被删除时调用)
  delSource: (data) => postFetch('/uas/v1/api/ars/guard/remove-deleted-source', data),
  /*
        元数据
    */
  //统计任务数
  getTaskTotal: (data) => postFetch('/uas/v1/api/ars/task/total', data),
  //元数据列表
  getMetadataList: (data) => postFetch('/uas/v1/api/ars/metadata/list', data),
  searchMetadataList: (data) => postFetch('/uas/v1/api/ars/metadata/search', data),
  //元数据详情
  getMetadataInfo: (data) => postFetch('/uas/v1/api/ars/metadata/info', data),
  //元数据当日抓拍
  getMetadata: (data) => postFetch('/uas/v1/api/ars/metadata/total', data),
  //告警统计
  getguardHit: (data) => postFetch('/uas/v1/api/ars/guardHit/total', data),
  //元数据周期统计
  getWeekCount: (data) => postFetch('/uas/v1/api/ars/metadata/week-count', data),
  //车辆元数据检索
  getVehData: (data) => postFetch('/uas/v1/api/ars/intelligentapp/search/vehicle', data),
  //目标元数据检索
  getFaceData: (data) => postFetch('/uas/v1/api/ars/intelligentapp/search/person', data),
  // 获取3800平台映射关系
  getCameraPlat: (data) => postFetch('/uas/v1/api/ars/plat/get-camera-plat', data),

  /**
   * 智能应用
   * */
  // 车辆图片检索
  searchVehicleByImage: (data) => postFetch('/uas/v1/api/ars/intelligent-app/vehicle/searchByImage', data),
  // 车辆条件检索
  searchVehicleByCondition: (data) => postFetch('/uas/v1/api/ars/intelligent-app/vehicle/searchByCondition', data),
  // 目标图片检索
  searchFaceByImage: (data) => postFetch('/uas/v1/api/ars/intelligent-app/face/searchByImage', data),
  // 目标条件检索
  searchFaceByCondition: (data) => postFetch('/uas/v1/api/ars/intelligent-app/face/searchByCondition', data),
  // 目标整体图片检索
  searchBodyByImage: (data) => postFetch('/uas/v1/api/ars/intelligent-app/body/searchByImage', data),
  // 目标整体条件检索
  searchBodyByCondition: (data) => postFetch('/uas/v1/api/ars/intelligent-app/body/searchByCondition', data),

  /*
        目标库
    */
  //目标库列表
  getPersonRepositoryList: (data) => postFetch('/uas/v1/api/ars/person/repository/list', data),
  //创建人员库
  addNewRepositoryInfo_people: (data) => postFetch('/uas/v1/api/ars/person/repository/add', data),
  //修改人员库
  modifyNewRepositoryInfo: (data) => postFetch('/uas/v1/api/ars/person/repository/modify', data),
  //删除人员库
  deleteNewRepositoryInfo: (data) => postFetch('/uas/v1/api/ars/person/repository/delete', data),
  //查询单个人员库信息
  getNewRepositoryInfo: (data) => postFetch('/uas/v1/api/ars/person/repository/info', data),

  /*
        人员管理
     */
  //添加人员
  addNewPersonInfo: (data) => postFetch('/uas/v1/api/ars/repository/person/add', data),
  // 批量添加人员
  batchAddNewPerson: (data) => postFetch('/uas/v1/api/ars/repository/person/batch/add', data, 60000),
  //修改人员
  modifyNewPersonInfo: (data) => postFetch('/uas/v1/api/ars/repository/person/modify', data),
  //删除人员
  deleteNewPersonInfo: (data) => postFetch('/uas/v1/api/ars/repository/person/delete', data),
  //查询单个人员信息
  getNewPersonInfo: (data) => postFetch('/uas/v1/api/ars/repository/person/info', data),
  //查询人员列表
  getRepositoryPersonList: (data) => postFetch('/uas/v1/api/ars/repository/person/list', data),
  //人员库批量导入人员模板下载
  downloadPersonTemplate: (data) => postFetch('/uas/v1/api/ars/repository/person/template/download', data),

  /*
        车辆库
    */
  //车辆库列表
  getVehicleRepositoryList: (data) => postFetch('/uas/v1/api/ars/vehicle/repository/list', data),
  //添加车辆库
  addNewCar: (data) => postFetch('/uas/v1/api/ars/vehicle/repository/add', data),
  //修改车辆库
  modifyNewCar: (data) => postFetch('/uas/v1/api/ars/vehicle/repository/modify', data),
  //删除车辆库
  deleteNewCar: (data) => postFetch('/uas/v1/api/ars/vehicle/repository/delete', data),
  //查询单个车辆库信息
  getNewCar: (data) => postFetch('/uas/v1/api/ars/vehicle/repository/info', data),
  downloadVehicleTemplate: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/template/download', data),
  /*
        车辆管理
     */
  //添加车辆
  addNewVehicleInfo: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/add', data),
  // 批量添加车辆
  batchAddNewVehicle: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/batch/add', data, 60000),
  //修改车辆
  modifyNewVehicleInfo: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/modify', data),
  //删除车辆
  deleteNewVehicleInfo: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/delete', data),
  //查询单个车辆信息
  getNewVehicleInfo: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/info', data),
  //查询车辆列表
  getRepositoryVehicleList: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/list', data),
  //车辆库批量添加车辆
  importVehicleInfo: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/import', data),
  //车辆库批量导入车辆模板下载
  importVehicleInfoTemplate: (data) => postFetch('/uas/v1/api/ars/repository/vehicle/template', data),
  // 布控库批量导入配置
  getRepoImportConfig: (data) => postFetch('/uas/v1/api/ars/import-config/get', data),

  /*
        设备模型管理
    */
  //查询包含元数据模型的设备列表
  getDeviceList: (data) => postFetch('/uas/v1/api/ars/model/dev-list', data),
  //查询设备元数据模型关联详情
  getAssociationInfo: (data) => postFetch('/uas/v1/api/ars/model-dev/association', data),
  //单个设备关联元数据模型
  associate: (data) => postFetch('/uas/v1/api/ars/model-dev/associate', data),
  //批量设备关联元数据模型
  batchAssociate: (data) => postFetch('/uas/v1/api/ars/model-dev/batch-associate', data),

  /*
        采集设备管理
    */
  // 获取采集设备列表信息
  getApeList: (data) => postFetch('/uvs/v1/api/vir/ape/list', data),
  // 获取采集设备详情
  getApeDetail: (data) => postFetch('/uvs/v1/api/vir/ape/detail', data),
  // 添加采集设备
  addApe: (data) => postFetch('/uvs/v1/api/vir/ape/add', data),
  // 修改采集设备
  updateApe: (data) => postFetch('/uvs/v1/api/vir/ape/update', data),
  // 删除采集设备
  delApe: (data) => postFetch('/uvs/v1/api/vir/ape/del', data),
  // 区域组织树
  getAreaList: (data) => postFetch('/uvs/v1/api/udc/sub-area/list', data),
  // 判断设备是否为下级划拨的设备
  checkassociateApe: (data) => postFetch('/uvs/v1/api/vir/ape/checkassociate', data),

  /*
        卡口管理
    */
  // 获取卡口列表
  getTollgatesForPage: (data) => postFetch('/uvs/v1/api/vir/tollgate/list', data),
  // 获取卡口详情
  getTollgateDetail: (data) => postFetch('/uvs/v1/api/vir/tollgate/detail', data),
  // 添加卡口
  addTollgate: (data) => postFetch('/uvs/v1/api/vir/tollgate/add', data),
  // 修改卡口
  updateTollgate: (data) => postFetch('/uvs/v1/api/vir/tollgate/update', data),
  // 删除卡口
  delTollgate: (data) => postFetch('/uvs/v1/api/vir/tollgate/del', data),

  /*
        车道管理
    */
  // 获取车道列表
  getLanesForPage: (data) => postFetch('/uvs/v1/api/vir/lane/list', data),
  // 获取车道详情
  getLaneDetail: (data) => postFetch('/uvs/v1/api/vir/lane/detail', data),
  // 添加车道
  addLane: (data) => postFetch('/uvs/v1/api/vir/lane/add', data),
  // 修改车道
  updateLane: (data) => postFetch('/uvs/v1/api/vir/lane/update', data),
  // 删除车道
  delLane: (data) => postFetch('/uvs/v1/api/vir/lane/del', data),
  // 卡口树
  getTollgateTree: (data) => postFetch('/uvs/v1/api/vir/tollgate/tree', data),

  /*
        视图库平台管理
    */
  // 获取视图库平台列表
  getVirPlatformList: (data) => postFetch('/uvs/v1/api/vir/platform/list', data),
  // 获取视图库平台详情
  getVirPlatformInfo: (data) => postFetch('/uvs/v1/api/vir/platform/info', data),
  // 添加视图库平台
  addVirPlatform: (data) => postFetch('/uvs/v1/api/vir/platform/add', data),
  // 修改视图库平台
  modifyVirPlatform: (data) => postFetch('/uvs/v1/api/vir/platform/modify', data),
  // 删除视图库平台
  delVirPlatform: (data) => postFetch('/uvs/v1/api/vir/platform/delete', data),
  //启用/停用视图库平台
  platformEnable: (data) => postFetch('/uvs/v1/api/vir/platform-enable/modify', data),
  /*
        视图库多条件查询
    */
  // 查询图片记录
  queryCapture: (data) => postFetch('/uvs/v1/api/vir/snap/list', data),
  // 查询图片详情
  queryCaptureInfo: (data) => postFetch('/uvs/v1/api/vir/snap/info', data),

  /*
        调拨设备管理
    */
  // 查询可调拨设备
  selectVirApe: (data) => postFetch('/uvs/v1/api/vir/sync/select/ape', data),
  // 下级平台数据同步
  syncWeb: (data) => postFetch('/uvs/v1/api/vir/sync/sync', data),

  /*
        调拨卡口管理
    */
  // 查询可调拨卡口
  selectVirTollgate: (data) => postFetch('/uvs/v1/api/vir/sync/select/tollgate', data),

  /*
        调拨车道管理
    */
  // 查询可调拨车道
  selectVirLane: (data) => postFetch('/uvs/v1/api/vir/sync/select/lane', data),

  /*
        本域视图库
    */
  // 查询本域视图库配置
  getLocalPlatformInfo: (data) => postFetch('/uvs/v1/api/vir/local/platform/info', data),
  // 修改本域视图库配置
  updateLocalPlatformInfo: (data) => postFetch('/uvs/v1/api/vir/local/platform/update', data),
  // 添加vig网关信息
  addVig: (data) => postFetch('/uvs/v1/api/vir/local/vig/add', data),
  // 修改vig网关信息
  updateVig: (data) => postFetch('/uvs/v1/api/vir/local/vig/update', data),
  // 删除本域视图库配置
  delVig: (data) => postFetch('/uvs/v1/api/vir/local/vig/del', data),

  /*
        视图库平台订阅
    */
  // 订阅消息列表查询
  selectSubscribeList: (data) => postFetch('/uvs/v1/api/vir/subscribe/list', data),
  // 下级平台订阅
  sendSubscribe: (data) => postFetch('/uvs/v1/api/vir/subscribe/send', data),
  // 下级平台取消订阅
  sendCancelSubscribe: (data) => postFetch('/uvs/v1/api/vir/unsubscribe/send', data),
  // 平台删除订阅
  delSubscribe: (data) => postFetch('/uvs/v1/api/vir/subscribe/delete', data),

  /*
        上级视图库设备关联
    */
  // 查询平台已关联设备
  getRelateApeList: (data) => postFetch('/uvs/v1/api/vir/relation/apeList', data),
  // 添加上级平台关联设备
  relate: (data) => postFetch('/uvs/v1/api/vir/relation/add', data),
  // 未关联设备列表
  getUnRelateApeList: (data) => postFetch('/uvs/v1/api/vir/relation/unRelateApeList', data),
  // 删除关联设备
  deleteRelation: (data) => postFetch('/uvs/v1/api/vir/relation/del', data),

  /*
        视图库采集系统
    */
  // 查询采集系统列表
  apsList: (data) => postFetch('/uas/v1/api/vir/aps/list', data),
  // 查询单个采集系统信息
  apsDetails: (data) => postFetch('/uas/v1/api/vir/aps/detail', data),
  // 添加采集系统
  addAps: (data) => postFetch('/uas/v1/api/vir/aps/add', data),
  // 修改采集系统
  updateAps: (data) => postFetch('/uas/v1/api/vir/aps/update', data),
  // 删除采集系统
  delAps: (data) => postFetch('/uas/v1/api/vir/aps/del', data),
  // 采集系统树
  apsTree: (data) => postFetch('/uas/v1/api/vir/aps/tree', data),

  /*
        接入摄像机分配
    */
  //同步镜头数据
  synchronizationData: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/sync', data, 1200000),
  //接入摄像机列表查询
  selectAccessCameras: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/list', data),
  //接入摄像机详情
  getAccessCameraDetail: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/detail', data),
  //调拨设备树查询
  getAllocateDeviceTreeAcc: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/tree', data),
  //调拨设备
  allocateDeviceAcc: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/do', data, 7200000),
  //调拨设备设备定位
  getAllocateDeviceTreeLocate: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/locate', data),
  //调拨设备设备搜索
  getAllocateDeviceTreeSearch: (data) => postFetch('/uas/v1/api/uvs/sub-platform-camera/search', data),
  //查询平台树
  getPlatTree: (data) => postFetch('/uas/v1/api/udc/access-platform/tree', data),

  /*
        接入平台管理
    */
  //接入平台新增
  addAccessPlatformInfo: (data) => postFetch('/uas/v1/api/udc/access-platform/add', data),
  //接入平台修改
  modifyAccessPlatformInfo: (data) => postFetch('/uas/v1/api/udc/access-platform/modify', data),
  //接入平台删除
  deleteAccessPlatformInfo: (data) => postFetch('/uas/v1/api/udc/access-platform/delete', data),
  //接入平台列表查询
  selectAccessPlatforms: (data) => postFetch('/uas/v1/api/udc/access-platform/select', data),
  // 接入平台列表查询
  queryAccessPlatformList: (data) => postFetch('/uas/v1/api/udc/access-platform/query-list', data),
  //接入平台详情
  getAccessPlatformInfo: (data) => postFetch('/uas/v1/api/udc/access-platform/info', data),
  //接入平台状态变更记录
  selectPlatformStatusLogInfos: (data) => postFetch('/uas/v1/api/udc/platform-status-log/list', data),
  //接入平台启用/停用
  platformEnableModify: (data) => postFetch('/uas/v1/api/udc/platform-enable/modify', data),
  // avs平台配置查询
  avsConfigSelect: (data) => postFetch('/uas/v1/api/uvs/platform/avs-config/select', data),
  // avs平台配置修改
  avsConfigUpdate: (data) => postFetch('/uas/v1/api/uvs/platform/avs-config/update', data),

  /*
        国标共享管理
     */
  //查询共享目录树
  getGroupTree: (data) => postFetch('/uas/v1/api/uvs/convergence/tree', data),
  //新增目录
  addGroup: (data) => postFetch('/uas/v1/api/uvs/convergence/addGroup', data),
  //修改目录
  modifyGroup: (data) => postFetch('/uas/v1/api/uvs/convergence/modifyGroup', data),
  //删除目录
  deleteGroup: (data) => postFetch('/uas/v1/api/uvs/convergence/deleteGroup', data),
  //导入共享设备
  addConvergenceDevice: (data) => postFetch('/uas/v1/api/uvs/convergence/addConvergenceDevice', data),
  //修改共享设备
  modifyConvergenceDevice: (data) => postFetch('/uas/v1/api/uvs/convergence/modifyConvergenceDevice', data),
  //查询已共享设备
  convergenceDeviceList: (data) => postFetch('/uas/v1/api/uvs/convergence/convergenceDeviceList', data),
  //删除共享设备
  delConvergenceDevice: (data) => postFetch('/uas/v1/api/uvs/convergence/delConvergenceDevice', data),

  // 元数据订阅
  subscribeMetadata: (data) => postFetch('/uas/v1/api/ars/history-metadata/subscribe', data),

  // 取消元数据订阅
  unsubscribeMetadata: (data) => postFetch('/uas/v1/api/ars/history-metadata/unsubscribe', data),

  // 历史元数据订阅列表查询
  searchHisMetadataList: (data) => postFetch('/uas/v1/api/ars/history-metadata/list', data),

  // 客户端订阅历史元数据图片
  clientSubscribeMetadata: (data) => postFetch('/uas/v1/api/uvs/metadata/client/subscribe', data),

  // 客户端取消订阅历史元数据图片
  clientUnsubscribeMetadata: (data) => postFetch('/uas/v1/api/uvs/metadata/client/unsubscribe', data),

  /*
        采集设备树
    */
  //采集设备树
  getApeTree: (data) => postFetch('/oba/v1/api/vir/ape/tree', data),
  /*
        视图库平台树
    */
  //视图库平台树
  getVirPlatTree: (data) => postFetch('/oba/v1/api/vir/platform/tree', data),
  /*
        采集设备树模糊搜索
    */
  //采集设备树模糊搜索
  searchApeTree: (data) => postFetch('/oba/v1/api/vir/ape/tree/select', data),

  /*
        元数据模型映射的设备树
    */
  //查询拥有元数据模型映射的设备树
  getModelTree: (data) => postFetch('/uas/v1/api/ars/model/dev-tree', data),
  //在拥有元数据模型映射的设备树中检索
  searchModelTree: (data) => postFetch('/uas/v1/api/ars/model/dev-tree-search', data),

  /*
        采集设备关联主设备的设备树
    */
  //采集设备关联主设备的设备树
  getDeviceTreeVir: (data) => postFetch('/uas/v1/api/vir/device/tree', data),
  //采集设备关联主设备的设备树搜索
  searchInDeviceTreeVir: (data) => postFetch('/uas/v1/api/vir/device/search', data),

  /*
        涉及视图库的设备添加
    */
  //涉及视图库的设备添加
  addMonitorApe: (data) => postFetch('/uas/v1/api/vir/monitor/ape/add', data),

  /*
        物联网平台管理
    */
  // 获取物联平台列表
  getIotPlatformList: (data) => postFetch('/uas/v1/api/iot/platform/list', data),
  // 查询物联平台信息
  getIotPlatformInfo: (data) => postFetch('/uas/v1/api/iot/platform/info', data),
  // 添加物联平台
  addIotPlatformInfo: (data) => postFetch('/uas/v1/api/iot/platform/add', data),
  // 修改物联平台
  modifyIotPlatformInfo: (data) => postFetch('/uas/v1/api/iot/platform/modify', data),
  // 删除物联平台
  deleteIotPlatformInfo: (data) => postFetch('/uas/v1/api/iot/platform/delete', data),

  /*
        物联（网关）设备管理
    */
  // 获取物联设备列表
  getIotDeviceList: (data) => postFetch('/uas/v1/api/iot/device/list', data),
  // 添加物联设备
  addIotDeviceInfo: (data) => postFetch('/uas/v1/api/iot/device/add', data),
  // 修改物联设备
  modifyIotDeviceInfo: (data) => postFetch('/uas/v1/api/iot/device/modify', data),
  // 获取物联设备信息
  getIotDeviceInfo: (data) => postFetch('/uas/v1/api/iot/device/info', data),
  // 删除物联设备
  deleteIotDeviceInfo: (data) => postFetch('/uas/v1/api/iot/device/delete', data),
  // 导出物联设备列表
  exportIotDeviceInfo: (data) => postFetch('/uas/v1/api/iot/device/export', data),
  // 物联设备软件版本升级
  upgradeDeviceSoftwareVersion: (data) => postFetch('/uas/v1/api/iot/device/software/version/upgrade', data),

  /*
        软件版本管理
     */
  //  软件版本列表查询
  getDeviceSoftwareVersionList: (data) => postFetch('/uas/v1/api/iot/device/software/version/list', data),
  //  发布软件版本
  publishDeviceSoftwareVersion: (data) => postFetch('/uas/v1/api/iot/device/software/version/publish', data),
  //  取消发布软件版本
  cancelDeviceSoftwareVersion: (data) => postFetch('/uas/v1/api/iot/device/software/version/cancel', data),
  //  软件版本详情
  getDeviceSoftwareVersionInfo: (data) => postFetch('/uas/v1/api/iot/device/software/version/info', data),
  //  软件版本检查
  checkDeviceSoftwareVersion: (data) => postFetch('/uas/v1/api/iot/device/software/version/check', data),

  /*
        人员识别记录
    */
  // 人员识别列表
  getPersonRecognitionList: (data) => postFetch('/uas/v1/api/iot/person/recognition/list', data),

  /* 故障工作台 */
  // 故障上报
  addFaultInfo: (data) => postFetch('/uas/v1/api/bms/fault/add', data),
  // 故障概览
  getFaultSummary: (data) => postFetch('/uas/v1/api/bms/fault/summary', data),

  // 获取故障列表
  getFaultList: (data) => postFetch('/uas/v1/api/bms/fault/list', data),
  // 导出故障列表
  getFaultListExport: (data) => postFetch('/uas/v1/api/bms/fault/list/export', data),
  // 故障详情
  getFaultDetail: (data) => postFetch('/uas/v1/api/bms/fault/detail', data),
  // 非故障关闭
  closeFault: (data) => postFetch('/uas/v1/api/bms/fault/close', data),
  // 获取故障流程
  getFaultTechnologicalProcess: (data) => postFetch('/uas/v1/api/bms/fault/process', data),
  // 获取用户故障列表
  getUserFaultList: (data) => postFetch('/uas/v1/api/bms/user/fault/list', data),
  // 用户关闭故障
  userCloseFault: (data) => postFetch('/uas/v1/api/bms/user/fault/close', data),
  // 用户编辑故障
  userModifyFault: (data) => postFetch('/uas/v1/api/bms/user/fault/modify', data),
  // 获取登录人员角色
  getMaintainerRole: (data) => postFetch('/uas/v1/api/bms/maintainer/role', data),
  // 生成工单
  addWorkOrderInfo: (data) => postFetch('/uas/v1/api/bms/work-order/add', data),

  /* 工单工作台 */
  // 获取工单统计概览
  getWorkorderSummaryInfo: (data) => postFetch('/uas/v1/api/bms/work-order/summary', data),
  // 获取工单列表
  getWorkOrderList: (data) => postFetch('/uas/v1/api/bms/work-order/list', data),
  // 导出工单列表
  exportWorkOrderList: (data) => postFetch('/uas/v1/api/bms/work-order/list/export', data),
  // 挂起审核
  suspendAudit: (data) => postFetch('/uas/v1/api/bms/work-order/suspendAudit', data),
  // 验收审核
  acceptanceAudit: (data) => postFetch('/uas/v1/api/bms/work-order/acceptanceAudit', data),
  // 工单重新分配
  reallocateAudit: (data) => postFetch('/uas/v1/api/bms/work-order/reallocateAudit', data),
  // 工单详情
  getWorkOrderInfo: (data) => postFetch('/uas/v1/api/bms/work-order/info', data),
  // 获取工单流程
  getWorkOrderFlow: (data) => postFetch('/uas/v1/api/bms/work-order/flow', data),
  // 区域工单数量统计
  getWorkOrderQuantityDetails: (data) => postFetch('/uas/v1/api/bms/work-order/quantity', data),
  // 区域工单统计导出
  getWorkOrderQuantityDetailsExport: (data) => postFetch('/uas/v1/api/bms/work-order/quantity/export', data),
  // 获取工单闭环统计
  getWoClosedLoopStatDetails: (data) => postFetch('/uas/v1/api/bms/work-order/cl/stat/detail', data),
  // 工单闭环统计导出
  getWoClosedLoopStatDetailsExport: (data) => postFetch('/uas/v1/api/bms/work-order/cl/stat/detail/export', data),

  /* 维修工作台 */
  // 获取维修工作台统计概览
  getRepairSummary: (data) => postFetch('/uas/v1/api/bms/repair/summary', data),
  // 获取维修列表
  getRepairWorkbenchList: (data) => postFetch('/uas/v1/api/bms/repair/list', data),
  // 导出维修列表
  getRepairListExport: (data) => postFetch('/uas/v1/api/bms/repair/list/export', data),
  // 维修处理
  handleWo: (data) => postFetch('/uas/v1/api/bms/work-order/handle', data),
  // 维修重新激活
  activationWo: (data) => postFetch('/uas/v1/api/bms/work-order/activation', data),

  /** 设备在线状态检测 */
  //设备在线状态检测
  OnOfflineCheck: (data) => postFetch('/uas/v1/api/bms/online/check/list', data),
  //设备在线状态重新检测
  OnOfflineCheckAgain: (data) => postFetch('/uas/v1/api/bms/online/check', data),
  //设备在线状态详情
  OnOfflineCheckDetail: (data) => postFetch('/uas/v1/api/bms/online/check/detail', data),
  //设备链路分析
  OnOfflineCheckLink: (data) => postFetch('/uas/v1/api/bms/online/link', data),
  //设备在线状态检测导出
  OnOfflineCheckExport: (data) => postFetch('/uas/v1/api/bms/online/check/list/export', data),

  /* 视频运维管理-设备视频预览成功率 */
  //视频预览概要
  getSummaryInfo: (data) => postFetch('/uas/v1/api/bms/preview/summary', data),
  //视频预览子组织（平台）概览
  getChildPreviewList: (data) => postFetch('/uas/v1/api/bms/child-preview/list', data),
  //查询视频预览列表
  getPreviewList: (data) => postFetch('/uas/v1/api/bms/preview/list', data),
  //视频预览列表详情导出
  fileExport: (data) => postFetch('/uas/v1/api/bms/preview/export', data),

  /* 视频运维管理-录像完整性分析接口 */
  //录像完整性分布
  getRecordPlanDistributionStatTwo: (data) => postFetch('/uas/v1/api/bms/record/integrality/distribution', data),
  //录像完整性统计
  getRecordIntegralityStat: (data) => postFetch('/uas/v1/api/bms/record/integrality/stat', data),
  //录像完整性详情
  getRecordIntegralityDetail: (data) => postFetch('/uas/v1/api/bms/record/integrality/detail', data),
  //手动检测录像完整性
  getRecordIntegralityCheck: (data) => postFetch('/uas/v1/api/bms/record/integrality/check', data),
  //录像完整性详情导出
  getRecordIntegralityExport: (data) => postFetch('/uas/v1/api/bms/record/integrality/export', data),

  /*考核统计  */
  // 经纬度考核统计
  getLonLatStat: (data) => postFetch('/uas/v1/api/bms/lonlat/stat', data),
  // 经纬度考核导出
  getLonLatStatExport: (data) => postFetch('/uas/v1/api/bms/lonlat/stat/export', data),
  // 区域考核统计
  getAreaMaintenanceStat: (data) => postFetch('/uas/v1/api/bms/examine/area/stat', data),
  // 区域考核导出
  getAreaMaintenanceStatExport: (data) => postFetch('/uas/v1/api/bms/examine/area/stat/export', data),

  /* 设备在离线 */
  // new历史在线率查询
  onOfflineNewStat: (data) => postFetch('/uas/v1/api/bms/onoffline/stat-v1.1', data),
  // new历史在线率查询
  onOfflineDetailNewStat: (data) => postFetch('/uas/v1/api/bms/onoffline/stat/detail-v1.1', data),
  // 设备在离线详情
  onOfflineDetailDeviceList: (data) => postFetch('/uas/v1/api/bms/onoffline/device/list', data),
  // 设备在离线详情
  onOfflineDetailDeviceNewDetail: (data) => postFetch('/uas/v1/api/bms/onoffline/device/amount/detail', data),
  // 导出-设备在离线详情
  onOfflineNewStatExport: (data) => postFetch('/uas/v1/api/bms/onoffline/stat/export', data),
  // 导出-设备在离线详情导出
  onOfflineNewDetailExport: (data) => postFetch('/uas/v1/api/bms/onoffline/new/detail/export', data),
  // 导出-设备长期离线数据导出
  onOfflinelongStatExport: (data) => postFetch('/uas/v1/api/bms/onoffline/longoffline/stat/export', data),
  // 设备在离线时间详情
  onOfflineDetailDeviceDateList: (data) => postFetch('/uas/v1/api/bms/onoffline/device/date/detail', data),
  // 长期离线设备明细
  longOnOfflineLongNewDetail: (data) => postFetch('/uas/v1/api/bms/onoffline/longoffline/detail', data),
  // 长期离线设备统计
  onOfflineDetailLongStat: (data) => postFetch('/uas/v1/api/bms/onoffline/longoffline/stat', data),
  // 历史在线率查询
  onOfflineStat: (data) => postFetch('/uas/v1/api/bms/onoffline/stat', data),
  // 历史在线详情
  onOfflineDetailStat: (data) => postFetch('/uas/v1/api/bms/onoffline/stat/detail', data),
  // 长期离线设备查询
  longOnOfflineStat: (data) => postFetch('/uas/v1/api/bms/onoffline/long/detail', data),
  // 长期离线详情导出
  longOnOfflineExport: (data) => postFetch('/uas/v1/api/bms/onoffline/long/export', data),
  // 频繁上下线设备查询
  oftenOnOfflineStat: (data) => postFetch('/uas/v1/api/bms/onoffline/often/detail', data),
  // 频繁下线设备分布
  oftenOnOfflineStatDistribution: (data) => postFetch('/uas/v1/api/bms/onoffline/often/distribution', data),
  // 频繁上下线导出
  oftenOnOfflineExport: (data) => postFetch('/uas/v1/api/bms/onoffline/often/export', data),
  // 历史在线详情
  onOfflineDetail: (data) => postFetch('/uas/v1/api/bms/onoffline/device/detail', data),
  // 历史在线详情导出
  onOfflineDetailExport: (data) => postFetch('/uas/v1/api/bms/onoffline/detail/export', data),
  // 设备在离线明细
  onOfflineDetailInfo: (data) => postFetch('/uas/v1/api/bms/onoffline/detail', data),
  // 设备在离线明细导出
  onOfflineDetailInfoExport: (data) => postFetch('/uas/v1/api/bms/onoffline/detail/specific/export', data),
  /* 运维首页 */
  // 一键运维权限
  getpatrolEnable: (data) => postFetch('/uas/v1/api/bms/patrol/enable', data),
  // 获取设备详情
  getDeviceAccessDistribution: (data) => postFetch('/uas/v1/api/bms/device/access/distribution', data),
  // 获取监控点设备在线率
  getDevStatus: (data) => postFetch('/uas/v1/api/bms/onOffline/status', data),
  // 获取解码设备在线率
  getDecoderSummaryInfo: (data) => postFetch('/uas/v1/api/bms/decoder/summary', data),
  // 获取视频预览正常率
  getPreviewSummaryInfo: (data) => postFetch('/uas/v1/api/bms/preview/summary', data),
  // 获取录像完整性统计
  getRecordIntegralityRealtime: (data) => postFetch('/uas/v1/api/bms/record/integrality/summary', data),
  // 视频质量诊断统计
  getVideoQualitySummaryInfo: (data) => postFetch('/uas/v1/api/bms/video-quality/summary', data),
  // 获取资源运行情况统计
  getAggregateSummaryInfo: (data) => postFetch('/uas/v1/api/bms/summary/aggregate', data),
  // 导出视频概况
  exportPreview: (data) => postFetch('/uas/v1/api/bms/preview/export', data),
  // 导出重点视频诊断
  exportVideoQuality: (data) => postFetch('/uas/v1/api/bms/video-quality/export', data),
  // 获取视频诊断列表
  getQualityList: (data) => postFetch('/uas/v1/api/bms/video-quality/list', data),
  // 导出视频诊断列表
  exportQualityList: (data) => postFetch('/uas/v1/api/bms/video-quality/exportList', data),
  // 获取视频诊断详情
  getVideoQualityInfo: (data) => postFetch('/uas/v1/api/bms/video-quality/info', data),
  // 手动检测视频质量
  checkVideoQuality: (data) => postFetch('/uas/v1/api/bms/video-quality/check', data),

  /* 一键巡检 */
  // 查询用户当前是否有进行中的巡检任务
  getMajorInspectPatrolStatus: (data) => postFetch('/uas/v1/api/bms/majorDevice/patrolStatus', data),
  // 查询巡检中的任务
  getTaskInfo: (data) => postFetch('/uas/v1/api/bms/patrol/getTaskInfo', data),
  // 解码器状态统计
  getDecoderStatus: (data) => postFetch('/uas/v1/api/bms/decoder/status/stat', data),
  // 监控点录像状态统计
  getRecordStatus: (data) => postFetch('/uas/v1/api/bms/record/state', data),
  // 获取所有分组
  getGroupList: (data) => postFetch('/uas/v1/api/bms/inspection-group/list', data),
  // 获取分组下的设备列表
  getDevList: (data) => postFetch('/uas/v1/api/bms/inspection-group/getDevlist', data),
  // 巡检
  majorInspect: (data) => postFetch('/uas/v1/api/bms/majorDevice/patrol', data),
  // 获取巡检任务列表
  getTaskList: (data) => postFetch('/uas/v1/api/bms/patrol/getTaskList', data),
  // 导出巡检结果
  exportMajorResult: (data) => postFetch('/uas/v1/api/bms/majorDevice/patrol/export', data),
  // 巡检任务详情
  getPatrolResult: (data) => postFetch('/uas/v1/api/bms/patrol/getPatrolResult', data),
  // 任务设备详情
  getDevPatrolDetail: (data) => postFetch('/uas/v1/api/bms/patrol/getDevPatrolDetail', data),
  // 添加分组
  addPatrolGroupInfo: (data) => postFetch('/uas/v1/api/bms/inspection-group/add', data),
  // 删除分组
  deletePatrolGroupInfo: (data) => postFetch('/uas/v1/api/bms/inspection-group/delete', data),
  // 编辑分组
  modifyPatrolGroupInfo: (data) => postFetch('/uas/v1/api/bms/inspection-group/modify', data),
  // 分组详情
  getGroupInfo: (data) => postFetch('/uas/v1/api/bms/inspection-group/info', data),
  // 查询单个地区 入参 areaCode
  queryAreaInfo: (data) => postFetch('/uas/v1/api/udc/area/info', data),

  /*  视频质量轮巡*/
  //查看镜头视频质量检测列表
  getCameraQualityNewestPage: (data) => postFetch('/uas/v1/api/bms/quality/camera/newest/page', data),
  //查看镜头基础信息
  getCameraQualityBase: (data) => postFetch('/uas/v1/api/bms/quality/camera/base', data),
  //查看单个镜头某段时间所有检测信息列表
  getCameraQualityList: (data) => postFetch('/uas/v1/api/bms/quality/camera/list', data),
  //查询质量检测任务列表
  getVideoQualityMainTaskPage: (data) => postFetch('/uas/v1/api/bms/quality/main/task/page', data),
  //创建质量检测任务
  createVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/add', data),
  //编辑质量检测任务
  updateVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/update', data),
  //执行质量检测任务
  startUpVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/start', data),
  //启用质量检测任务
  recoveryVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/recovery', data),
  //停用质量检测任务
  stopVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/stop', data),
  //删除质量检测任务
  deleteVideoQualityMainTask: (data) => postFetch('/uas/v1/api/bms/quality/main/task/delete', data),
  //查看质量检测任务基础信息
  getVideoQualityMainTaskDetail: (data) => postFetch('/uas/v1/api/bms/quality/main/task/detail', data),
  //查看质量检测任务历史执行记录列表
  getVideoQualityMainTaskExecutionList: (data) => postFetch('/uas/v1/api/bms/quality/execution/list', data),
  //查看质量检测任务单次执行记录概览信息
  getVideoQualityTaskExecutionSingleOverview: (data) =>
    postFetch('/uas/v1/api/bms/quality/execution/single/overview', data),
  //查看质量检测任务执行记录概览信息列表
  getVideoQualityTaskExecutionOverviewList: (data) =>
    postFetch('/uas/v1/api/bms/quality/execution/overview/list', data),
  // 获取检测任务下的摄像头信息列表
  getVideoQualityMainTaskCameraList: (data) => postFetch('/uas/v1/api/bms/quality/main/task/camera', data),
  // 配置告警信息
  setAlarmConfig: (data) => postFetch('/uas/v1/api/bms/video/quality/alarm/config', data),
  // 获取告警配置信息
  getAlarmConfig: (data) => postFetch('/uas/v1/api/bms/video/quality/alarm/config/detail', data),

  //目标1v1
  getFaceMatch1v1: (data) => postFetch('/uas/v1/api/ars/intelligent-app/facematch/1v1', data),

  /* 云台控制巡航计划 */

  //获取巡航列表
  getCruiseList: (data) => postFetch('/uas/v1/api/cruise/list', data),
  //获取巡航计划
  getCruisePlan: (data) => postFetch('/uas/v1/api/cruise/plan/get', data),
  //设置巡航计划
  setCruisePlan: (data) => postFetch('/uas/v1/api/cruise/plan/set', data),

  /* 预案轮巡 */
  //获取电视墙预案列表
  getTvWallScenarioList: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/list/page', data),
  //新增电视墙预案轮巡
  addTvWallScenarioTurningInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/add', data),
  //编辑电视墙预案轮巡
  modifyTvWallScenarioTurningInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/modify', data),
  //启用/禁用电视墙预案轮巡
  enableTvWallScenarioTurningInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/enable', data),
  //删除电视墙预案轮巡
  deleteTvWallScenarioTurningInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/delete', data),
  //获取电视墙预案轮巡列表
  getTvWallScenarioTurningList: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/turning/list/page', data),
  //新增电视墙预案计划
  addTvWallScenarioPlanInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/add', data),
  //编辑电视墙预案计划
  modifyTvWallScenarioPlanInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/modify', data),
  //启用/禁用电视墙预案计划
  enableTvWallScenarioPlanInfo: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/enable', data),
  //获取电视墙预案计划列表
  getTvWallScenarioPlanList: (data) => postFetch('/uas/v1/api/uvs/tv-wall/scenario/plan/list/page', data),

  /*vpaas外域管理*/
  //按条件查询平台
  selectVpaasPlatformList: (data) => postFetch('/uas/v1/api/uvs/access-platform/select', data),
  //添加平台
  addVpaasPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/access-platform/add', data),
  //编辑平台
  modifyVpaasPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/access-platform/modify', data),
  //删除平台
  deleteVpaasPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/access-platform/delete', data),
  //平台详情
  getVpaasPlatformInfo: (data) => postFetch('/uas/v1/api/uvs/access-platform/info', data),
  //平台启停
  modifyVpaasPlatformEnable: (data) => postFetch('/uas/v1/api/uvs/platform-enable/modify', data),
  //获取域列表接口
  getDomainQueryList: (data) => postFetch('/uas/v1/api/uvs/domain/query', data),
  //获取域规模路数
  getDomainAccessCount: (data) => postFetch('/uas/v1/api/uvs/domain/access/count ', data),
  // 登录
  login: (data = {}, config = {}) => {
    return loginRequest(
      merge(
        {
          url: '/uas/v1/api/user/login',
          method: 'post',
          data,
        },
        config
      )
    )
  },
}
