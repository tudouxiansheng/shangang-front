//中台(公共)
import { merge } from 'lodash'
export default ({ loginRequest, postFetch }) => ({
  // 登录
  login: (data = {}, config = {}) => {
    return loginRequest(
      merge(
        {
          url: '/uas/v1/api/user/login',
          method: 'post',
          data
        },
        config
      )
    )
  },
  // 退出登录
  logout: data => postFetch('/uas/v1/api/user/logout', data),
  // 获取token
  refreshToken: data => postFetch('/uas/v1/api/user/token', data),
  // 字典查询
  getDictionary: data => postFetch('/uas/v1/api/udc/assist/dictionary', data),
  // 模糊查询字典
  getFuzzyDictionary: data => postFetch('/uas/v1/api/udc/assist/fuzzy/dictionary', data),
  // 获取局点信息
  getFlavor: data => postFetch('/uas/v1/api/udc/assist/flavor', data),
  // 用户隐私协议
  getAgreements: data => postFetch('/uas/v1/api/oba/agreement/get', data),
  // 获取验证码
  captcha: data => postFetch('/uas/v1/api/captcha', data),
  // 获取当前用户信息
  getLoginUserInfo: data => postFetch('/uas/v1/api/udc/login/user', data),
  // 查询菜单
  selectMenus: data => postFetch('/uas/v1/api/udc/management/menus', data),
  // 查询菜单权限
  selectMenuPerms: data => postFetch('/uas/v1/api/udc/management/perms', data),
  // 查询用户权限列表
  selectUserPermissions: data => postFetch('/uas/v1/api/udc/management/use/perms', data),
  // 首次修改密码
  firstModifyPassword: data => postFetch('/uas/v1/api/udc/management/passwd', data),
  // 修改密码
  modifyPassword: data => postFetch('/uas/v1/api/udc/management/passwd', data),
  // 版权&备案
  getCopyrightRecord: data => postFetch('/uas/v1/api/oba/copyrightrecord/get', data),
  // 实况轨迹
  getTrackList: data => postFetch('/uas/v1/api/scs/track/list', data),

  /*
        媒体转码模板
    */
  // 获取转码模板
  queryTemplateList: data => postFetch('/uas/v1/api/media/template/list', data),
  // 添加转码模板
  addTemplate: data => postFetch('/uas/v1/api/media/template/add', data),
  // 修改转码模板
  modifyTemplate: data => postFetch('/uas/v1/api/media/template/modify', data),
  // 删除转码模板
  delTemplate: data => postFetch('/uas/v1/api/media/template/delete', data),
  // 单个转码模板信息
  getTranscodeTemplateById: data => postFetch('/uas/v1/api/media/template/get', data),

  /*
        媒体转码设置
    */
  // 创建镜头转码任务
  createCameraTranscode: data => postFetch('/uas/v1/api/media/camera/transcode/create', data),
  // 获取镜头转码任务列表
  getCameraTranscodeTasks: data => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  // 暂停转码任务
  delCameraTranscodeTasks: data => postFetch('/uas/v1/api/media/camera/transcode/delete', data),
  // 单个转码任务信息
  getTranscodeTaskInfo: data => postFetch('/uas/v1/api/media/camera/transcode/get', data),
  //停止镜头转码任务
  stopTranscodeTask: data => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  //删除镜头转码任务
  CameraTranscodeManageService: data => postFetch('/uas/v1/api/media/camera/transcode/list', data),
  //删除镜头转码任务
  getCameraTranscodeTask: data => postFetch('/uas/v1/api/media/camera/transcode/delete', data),

  /*
        组织管理模块调用接口
    */
  // 添加组织
  addOrganizationInfo: data => postFetch('/uas/v1/api/udc/organization/add', data),
  // 修改组织
  modifyOrganizationInfo: data => postFetch('/uas/v1/api/udc/organization/modify', data),
  // 删除组织
  deleteOrganizationInfo: data => postFetch('/uas/v1/api/udc/organization/delete', data),
  // 获取组织列表
  selectOrganizations: data => postFetch('/uas/v1/api/udc/organization/list', data),
  // 获取组织树
  getOrganizationTree: data => postFetch('/uas/v1/api/udc/organization/tree', data),
  // 搜索
  searchInOrganizationTree: data => postFetch('/uas/v1/api/udc/organization/search', data),
  // 定位
  locateInOrganizationTree: data => postFetch('/uas/v1/api/udc/organization/locate', data),
  // 获取单个用户信息
  getOrganizationInfo: data => postFetch('/uas/v1/api/udc/organization/info', data),
  /*
      算法平台管理模块调用接口
  */
  // 算法平台列表查询
  getAlgorithmPlatformList: data => postFetch('/uas/v1/api/acc/platform/list', data),
  //添加算法平台
  addAlgorithmPlatformInfo: data => postFetch('/uas/v1/api/acc/platform/add', data),
  //修改算法平台
  modifyAlgorithmPlatformInfo: data => postFetch('/uas/v1/api/acc/platform/modify', data),
  //删除算法平台
  deleteAlgorithmPlatformInfo: data => postFetch('/uas/v1/api/acc/platform/delete', data),
  //查询单个算法平台信息
  getAlgorithmPlatformInfo: data => postFetch('/uas/v1/api/acc/platform/info', data),

  /*
        监控平台管理模块调用接口
    */
  // 添加监控平台
  addPlatformInfo: data => postFetch('/uas/v1/api/uvs/platform/add', data),
  // 监控平台列表查询
  getPlatformList: data => postFetch('/uas/v1/api/uvs/platform/list', data),

  // 监控平台信息查询
  getPlatformInfo: data => postFetch('/uas/v1/api/uvs/platform/info', data),
  // 修改监控平台
  modifyPlatformInfo: data => postFetch('/uas/v1/api/uvs/platform/modify', data),
  // 删除监控平台
  deletePlatformInfo: data => postFetch('/uas/v1/api/uvs/platform/delete', data),

  /*
        用户管理模块调用接口
    */
  // 添加用户
  addUserInfo: data => postFetch('/uas/v1/api/udc/user/add', data),
  // 修改用户
  modifyUserInfo: data => postFetch('/uas/v1/api/udc/user/modify', data),
  // 删除用户
  deleteUserInfo: data => postFetch('/uas/v1/api/udc/user/delete', data),
  // 获取用户列表
  getUserList: data => postFetch('/uas/v1/api/udc/user/list', data),
  // 导出用户列表
  exportUserList: data => postFetch('/uas/v1/api/udc/user/export', data),
  // 获取单个用户信息
  getUserInfo: data => postFetch('/uas/v1/api/udc/user/info', data),
  // 下载导入用户模板
  getUserTemplate: data => postFetch('/uas/v1/api/udc/user/template', data),
  // 批量导入用户
  importUserInfo: data => postFetch('/uas/v1/api/udc/user/import', data),
  // 设置用户Logo和登录背景
  setUserLogo: data => postFetch('/uas/v1/api/udc/user/logo/set', data),
  // 查看用户Logo和登录背景
  getUserLogo: data => postFetch('/uas/v1/api/udc/user/logo/info', data),
  // 启用/停用用户
  enableUser: data => postFetch('/uas/v1/api/udc/user/enable', data),
  // 重置用户密码
  resetUserPasswd: data => postFetch('/uas/v1/api/udc/user/passwd/reset', data),
  // 锁定/解锁用户
  lockUser: data => postFetch('/uas/v1/api/udc/user/lock', data),
  // 冻结/激活用户
  activeUser: data => postFetch('/uas/v1/api/udc/user/active', data),
  // 设置用户角色
  setUserRole: data => postFetch('/uas/v1/api/udc/user/role/set', data),

  //用户设备分配
  //用户已分配设备权限查询
  getAllocatedPerms: data => postFetch('/uas/v1/api/udc/device/allocate/perm/get', data),
  //用户已分配设备权限设置
  setAllocatedPerms: data => postFetch('/uas/v1/api/udc/device/allocate/perm/set', data),
  //用户组织分配详情
  getUserAllocateDetail: data => postFetch('/uas/v1/api/udc/device/allocate/detail', data),
  //用户设备分配
  allocateDeviceToUser: data => postFetch('/uas/v1/api/udc/device/allocate/do', data),

  /*
        我的共享设备
    */
  //移动共享设备或组
  MoveSharedDevices: data => postFetch('/uas/v1/api/udc/device/share/move', data),

  /*
        管理员管理模块调用接口
    */
  // 添加管理员
  addAdminInfo: data => postFetch('/uas/v1/api/udc/admin/add', data),
  // 修改管理员
  modifyAdminInfo: data => postFetch('/uas/v1/api/udc/admin/modify', data),
  // 删除管理员
  deleteAdminInfo: data => postFetch('/uas/v1/api/udc/admin/delete', data),
  // 获取管理员列表
  getAdminList: data => postFetch('/uas/v1/api/udc/admin/list', data),
  // 获取单个管理员信息
  getAdminInfo: data => postFetch('/uas/v1/api/udc/admin/info', data),
  // 启用/停用管理员
  enableAdmin: data => postFetch('/uas/v1/api/udc/admin/enable', data),
  // 重置用户密码
  resetAdminPasswd: data => postFetch('/uas/v1/api/udc/admin/passwd/reset', data),
  // 锁定/解锁管理员
  lockAdmin: data => postFetch('/uas/v1/api/udc/admin/lock', data),
  // 冻结/激活管理员
  activeAdmin: data => postFetch('/uas/v1/api/udc/admin/active', data),
  // 设置管理员角色
  setAdminRole: data => postFetch('/uas/v1/api/udc/admin/role/set', data),
  /*
        角色管理模块调用接口
    */
  // 添加角色
  addRoleInfo: data => postFetch('/uas/v1/api/udc/role/add', data),
  // 修改角色
  modifyRoleInfo: data => postFetch('/uas/v1/api/udc/role/modify', data),
  // 删除角色
  deleteRoleInfo: data => postFetch('/uas/v1/api/udc/role/delete', data),
  // 获取角色列表
  selectRoles: data => postFetch('/uas/v1/api/udc/role/list', data),
  // 获取单个角色信息
  getRoleInfo: data => postFetch('/uas/v1/api/udc/role/info', data),

  /*
        租户管理模块调用接口
    */
  // 添加租户
  addTenantInfo: data => postFetch('/uas/v1/api/udc/tenant/add', data),
  // 修改租户
  modifyTenantInfo: data => postFetch('/uas/v1/api/udc/tenant/modify', data),
  // 删除租户
  deleteTenantInfo: data => postFetch('/uas/v1/api/udc/tenant/delete', data),
  // 获取租户列表
  getTenantList: data => postFetch('/uas/v1/api/udc/tenant/list', data),
  // 获取单个租户信息
  getTenantInfo: data => postFetch('/uas/v1/api/udc/tenant/info', data),
  // 下载导入租户模板
  getTenantTemplate: data => postFetch('/uas/v1/api/udc/tenant/template', data),
  // 批量导入租户
  importTenantInfo: data => postFetch('/uas/v1/api/udc/tenant/import', data),
  // 设置租户Logo和登录背景
  setTenantLogo: data => postFetch('/uas/v1/api/udc/tenant/logo/set', data),
  // 查询租户Logo和登录背景
  getTenantLogo: data => postFetch('/uas/v1/api/udc/tenant/logo/query', data),
  // 查询租户Logo和登录背景 能力接口
  queryTenantLogo: data => postFetch('/uas/v1/api/udc/tenant/logo/info', data),
  // 启用/停用租户
  enableTenant: data => postFetch('/uas/v1/api/udc/tenant/enable', data),
  // 添加租户esop客户映射关系
  bindEsopClinet: data => postFetch('/uas/v1/api/oba/esop/bindEsopClient', data),
  // 修改租户esop客户映射关系
  updateEsopClinetTenantMap: data =>
    postFetch('/uas/v1/api/oba/esop/updateEsopClinetTenantMap', data),
  // 获取esop绑定信息
  getEsopClinetTenantMap: data => postFetch('/uas/v1/api/oba/esop/getEsopClinetTenantMap', data),
  // 重置用户密码
  resetTenantPasswd: data => postFetch('/uas/v1/api/udc/tenant/passwd/reset', data),
  // 锁定/解锁管理员
  lockTenant: data => postFetch('/uas/v1/api/udc/tenant/lock', data),
  // 冻结/激活管理员
  activeTenant: data => postFetch('/uas/v1/api/udc/tenant/active', data),
  // 管理员角色配置
  setTenantRole: data => postFetch('/uas/v1/api/udc/tenant/role/set', data),

  //租户设备分享
  //查询租户设备树
  getTenantTree: data => postFetch('/uas/v1/api/udc/tenant/tree', data),
  // 搜索租户树
  searchInTenantTree: data => postFetch('/uas/v1/api/udc/tenant/search', data),
  // 定位租户树
  locateInTenantTree: data => postFetch('/uas/v1/api/udc/tenant/locate', data),
  //查询共享设备树
  getShareDeviceTree: data => postFetch('/uas/v1/api/udc/device/share/tree', data),
  //查询租户共享组织详情
  getTenantShareDetail: data => postFetch('/uas/v1/api/udc/device/share/detail', data),
  //共享分配设备
  shareDeviceToTenant: data => postFetch('/uas/v1/api/udc/device/share/do', data),
  //模糊查询搜索共享设备
  searchInShareDeviceTree: data => postFetch('/uas/v1/api/udc/device/share/search', data),
  //设备共享分配
  addDeviceToUser: data => postFetch('/uas/v1/api/udc/device/shared/do', data, 60000),
  //设备共享分配移除
  removeDeviceToUser: data => postFetch('/uas/v1/api/udc/device/shared/remove', data),
  //用户组织树模糊查询
  searchUserTree: data => postFetch('/uas/v1/api/udc/user/search', data),
  //用户组织树定位
  locateUserTree: data => postFetch('/uas/v1/api/udc/user/locate', data),
  //租户共享权限查询
  getSharedPerms: data => postFetch('/uas/v1/api/udc/device/share/perm/get', data),
  //设置租户共享设备权限
  setSharedPerms: data => postFetch('/uas/v1/api/udc/device/share/perm/set', data),

  /*
        设备管理模块调用接口
    */
  // 添加设备
  addMainDevInfo: (data, timeout) => postFetch('/uas/v1/api/uvs/main-dev/add', data, timeout),
  // 添加设备时设置录像策略
  setRecordPolicyInfoByMainDevId: data =>
    postFetch('/uas/v1/api/uvs/camera/record-policy/set-by-mainDev', data),
  // 添加设备时设置录像策略
  getMediaNodeList: data => postFetch('/uas/v1/api/uvs/media/nodes/get', data),
  // 修改设备
  modifyMainDevInfo: data => postFetch('/uas/v1/api/uvs/main-dev/modify', data),
  // 批量删除设备
  deleteMainBatchDeleteInfo: data => postFetch('/uas/v1/api/uvs/main-dev/batchDelete', data),
  // 删除设备
  deleteMainDevInfo: data => postFetch('/uas/v1/api/uvs/main-dev/delete', data),
  getMainDevList: data => postFetch('/uas/v1/api/uvs/main-dev/list', data),
  //导出设备
  exportMainDevList: data => postFetch('/uas/v1/api/uvs/main-dev/list/export', data),
  // 获取单个设备信息
  getMainDevInfo: data => postFetch('/uas/v1/api/uvs/main-dev/info', data),
  // 获取域编码
  getDomainCode: data => postFetch('/uas/v1/api/uvs/domain/query', data),
  // 获取集群编码
  getClusterCode: data => postFetch('/uas/v1/api/uvs/cluster/query', data),
  // 获取网关ip,编码
  getTasCode: data => postFetch('/uas/v1/api/uvs/gateway/query', data),
  // 设备所属NVR编码
  getnvrCode: data => postFetch('/uas/v1/api/uvs/nvr/list', data),
  // 下载模板
  getMainDevTemplate: data => postFetch('/uas/v1/api/uvs/main-dev/template', data),
  // 批量导入
  importMainDevInfo: (data, timeout) => postFetch('/uas/v1/api/uvs/main-dev/import', data, timeout),
  // 调拨设备树
  getAllocateDeviceTree: data => postFetch('/uas/v1/api/uvs/device/allocate/tree', data),
  // 调拨设备
  allocateDevice: data => postFetch('/uas/v1/api/uvs/device/allocate/do', data),
  // 调拨同步下级设备
  syncAllocateDevice: data => postFetch('/uas/v1/api/uvs/device/allocate/sync', data),

  //ONVIF设备探测
  getEquipment: data => postFetch('/uas/v1/api/uvs/device/probe', data),
  //ONVIF设备验证
  probeValidation: data => postFetch('/uas/v1/api/uvs/device/probe/validation', data),

  /*
        录像计划管理
    */
  //录像计划列表查看
  getRecordPlanList: data => postFetch('/uas/v1/api/uvs/record-plan/list', data),
  //录像计划添加
  addRecordPlanInfo: data => postFetch('/uas/v1/api/uvs/record-plan/add', data),
  //录像计划修改
  modifyRecordPlanInfo: data => postFetch('/uas/v1/api/uvs/record-plan/modify', data),
  //录像计划删除
  deleteRecordPlanInfo: data => postFetch('/uas/v1/api/uvs/record-plan/delete', data),
  //录像计划查询
  getRecordPlanInfo: data => postFetch('/uas/v1/api/uvs/record-plan/info', data),

  // 摄像机录像策略设置
  setCameraRecordPolicyInfo: data => postFetch('/uas/v1/api/uvs/camera/record-policy/set', data),

  /*
        镜头管理模块调用接口
    */
  // 添加镜头
  addCameraInfo: data => postFetch('/uas/v1/api/uvs/camera/add', data),
  // 修改镜头
  modifyCameraInfo: data => postFetch('/uas/v1/api/uvs/camera/modify', data),
  // 移动镜头
  moveCameraInfo: data => postFetch('/uas/v1/api/udc/move/camera', data),
  // 删除镜头
  deleteCameraInfo: data => postFetch('/uas/v1/api/uvs/camera/delete', data),
  // 获取镜头列表
  getCameraList: data => postFetch('/uas/v1/api/uvs/camera/list', data),
  // 导出镜头列表
  getCameraExportList: data => postFetch('/uas/v1/api/uvs/camera/list/export', data),
  // 获取单个镜头信息
  getCameraInfo: data => postFetch('/uas/v1/api/uvs/camera/info', data),
  // 获取镜头状态
  syncCameraStatus: data => postFetch('/uas/v1/api/uvs/camera/status/sync', data),
  // 获取主设备下摄像机列表查询信息
  getCameraListByMainDevId: data => postFetch('/uas/v1/api/uvs/camera/list-by-main-dev', data),
  // 停用摄像机
  enableCamera: data => postFetch('/uas/v1/api/uvs/camera/enable', data),
  // 停用摄像机录像
  enableCameraRecord: data => postFetch('/uas/v1/api/uvs/camera/record/enable', data),
  // 镜头批量录像策略设置
  batchSetCameraRecordPolicyInfo: data =>
    postFetch('/uas/v1/api/uvs/camera/record-policy/batch-set', data),
  // 导出摄像机信息
  exportCameraInfo: data => postFetch('/uas/v1/api/uvs/camera/export', data),
  // 下载导入摄像机GIS模板
  getCameraGisTemplate: data => postFetch('/uas/v1/api/uvs/camera/gis/template', data),
  // 下载导入摄像机GIS模板
  importCameraGisInfo: data => postFetch('/uas/v1/api/uvs/camera/gis/import', data),
  // 摄像机抓拍数据订阅
  subscribeCameraDatas: data => postFetch('/uas/v1/api/uvs/camera/data/subscribe/', data),
  // NVR800设备同步
  nvrSync: data => postFetch('/uas/v1/api/uvs/main-dev/channel-sync', data),

  // onenet配置
  // 获取onenet下的产品信息
  getOnenetProductList: data => postFetch('/uas/v1/api/oba/onenet/product/list', data),
  // 获取产品下的设备列表信息
  getOnenetDeviceList: data => postFetch('/uas/v1/api/oba/onenet/device/list', data),
  // onenet设备绑定镜头
  addOnetConfig: data => postFetch('/uas/v1/api/oba/onenet/config/add', data),
  // 镜头onenet配置查询
  getOnenetConfig: data => postFetch('/uas/v1/api/oba/onenet/config/get', data),

  // 零配置 镜头 解绑
  // 摄像机零配置信息查询
  queryCameraOcfgStatus: data => postFetch('/uas/v1/api/ocfg/device/status', data),
  // 判断镜头是否配置大喇叭sn号有的话返回sn号
  unbindCameraOcfg: data => postFetch('/uas/v1/api/ocfg/device/unbind', data),

  // 摄像机配置生成
  // 配置页查询
  getCameraConfig: data => postFetch('/uas/v1/api/oba/camera/config/detail', data),
  //摄像机镜头接入配置
  obtainCameraConfig: data => postFetch('/uas/v1/api/uvs/camera/config/detail', data),

  /**
   * 我的镜头管理
   */
  // 获取镜头列表
  getCameraListByUserId: data => postFetch('/uas/v1/api/uvs/camera/list-by-userId', data),
  // 获取镜头列表
  exportCameraInfoByUserId: data => postFetch('/uas/v1/api/uvs/camera/export-by-userId', data),

  /*
        镜头型号管理
    */
  // 摄像机兼容性列表查询
  listCameraCompatibleInfo: data => postFetch('/uas/v1/api/oba/camera/compatible/list', data),
  // 摄像机兼容性详情查询
  getCameraCompatibleInfo: data => postFetch('/uas/v1/api/oba/camera/compatible/detail', data),

  /*
        告警类型管理模块调用接口
    */

  // 查询告警类型信息
  getAlarmTypes: data => postFetch('/uas/v1/api/alarm/type/list', data),
  // 添加告警类型信息
  addAlarmType: data => postFetch('/uas/v1/api/alarm/type/add', data),
  // 修改告警类型信息
  modifyAlarmType: data => postFetch('/uas/v1/api/alarm/type/modify', data),
  // 启停用告警类型信息
  enableAlarmType: data => postFetch('/uas/v1/api/alarm/type/enable', data),
  //  告警组查询
  getGroups: data => postFetch('/uas/v1/api/alarm/group/list', data),
  //  根据告警类型码查询告警信息
  getAlarmType: data => postFetch('/uas/v1/api/alarm/type/info', data),

  /*
        密码管理模块调用接口
    */
  // 获取系统密码配置
  getConfiguration: data => postFetch('/uas/v1/api/config/password/info', data),
  // 配置系统密码规则
  setConfiguration: data => postFetch('/uas/v1/api/config/password/modify', data),
  // 密码复杂度规则获取
  getPasswordComplex: data => postFetch('/uas/v1/api/config/password/complex', data),

  /*
        账号管理模块调用接口
    */
  // 获取系统账户配置
  getConfigurationAcc: data => postFetch('/uas/v1/api/config/account/info', data),
  // 配置系统账户规则
  setConfigurationAcc: data => postFetch('/uas/v1/api/config/account/modify', data),

  /*
        白名单调用接口
    */
  // 查询账户IP白名单列表
  getWhiteIpList: data => postFetch('/uas/v1/api/account/whiteIp/list', data),
  // 开启/关闭用户IP白名单
  whiteIpEnbale: data => postFetch('/uas/v1/api/account/whiteIp/enable', data),
  // 添加用户IP白名单
  addWhiteIpInfo: data => postFetch('/uas/v1/api/account/whiteIp/add', data),
  // 删除用户IP白名单
  deleteWhiteIpInfo: data => postFetch('/uas/v1/api/account/whiteIp/delete', data),
  // 白名单配置
  configureWhiteIpList: data => postFetch('/uas/v1/api/account/whiteIp/configure', data),
  /*
        告警联动管理模块调用接口
    */
  // 添加告警联动策略
  addLinkagePolicyInfo: data => postFetch('/uas/v1/api/ecs/alarm/linkage/add', data),
  // 修改告警联动策略
  modifyLinkagePolicyInfo: data => postFetch('/uas/v1/api/ecs/alarm/linkage/modify', data),
  // 删除告警联动策略
  deleteLinkagePolicyInfo: data => postFetch('/uas/v1/api/ecs/alarm/linkage/delete', data),
  // 查询告警联动列表
  getLinkagePolicyList: data => postFetch('/uas/v1/api/ecs/alarm/linkage/list', data),
  // 获取告警联动策略信息
  getLinkagePolicyInfo: data => postFetch('/uas/v1/api/ecs/alarm/linkage/info', data),
  // 短信模板列表查询
  getSmsTemplateList: data => postFetch('/uas/v1/api/mgw/sms/template/list', data),
  // 添加短信模板
  addSmsTemplateInfo: data => postFetch('/uas/v1/api/mgw/sms/template/add', data),
  // 修改短信模板
  modifySmsTemplateInfo: data => postFetch('/uas/v1/api/mgw/sms/template/modify', data),
  // 删除短信模板
  deleteSmsTemplateInfo: data => postFetch('/uas/v1/api/mgw/sms/template/delete', data),
  // 单个短信模板信息查询
  getSmsTemplateInfo: data => postFetch('/uas/v1/api/mgw/sms/template/info', data),
  // 查询告警联动动作类型列表
  getLinkageActionTypeList: data =>
    postFetch('/uas/v1/api/ecs/alarm/linkage/action-type/list', data),
  // 查询邮件模板列表
  getMailTemplateByType: data =>
    postFetch('/uas/v1/api/mgw/mail/template/getMailTemplateByType', data),
  // 查询微信模板列表
  searchWeChatTemplate: data =>
    postFetch('/uas/v1/api/mgw/wechat/template/searchWeChatTemplate', data),
  // 平台备份设备树
  getShadowTree: data => postFetch('/uas/v1/api/uvs/device/shadow/tree', data),

  /*
        前端参数配置模块调用接口
    */
  // 主设备基础信息查看
  mainDevBasicInfo: data => postFetch('/uas/v1/api/uvs/main-dev/basic-info', data),
  // 主设备基础信息设置
  mainDevBasicConfig: data => postFetch('/uas/v1/api/uvs/main-dev/basic-config', data),
  // 主设备网络参数查看
  mainDevNetworkInfo: data => postFetch('/uas/v1/api/uvs/main-dev/network-info', data),
  // 主设备网络参数设置
  mainDevNetworkConfig: data => postFetch('/uas/v1/api/uvs/main-dev/network-config', data),
  // 摄像机基础信息查看
  cameraBasicInfo: data => postFetch('/uas/v1/api/uvs/camera/basic-info', data),
  // 摄像机基础信息设置
  cameraBasicConfig: data => postFetch('/uas/v1/api/uvs/camera/basic-config', data),
  // 视频编码查看
  cameraStreamInfo: data => postFetch('/uas/v1/api/uvs/camera/stream-info', data),
  // 视频编码设置
  cameraStreamConfig: data => postFetch('/uas/v1/api/uvs/camera/stream-config', data),
  // 图像参数查看
  cameraDisplayInfo: data => postFetch('/uas/v1/api/uvs/camera/display-info', data),
  // 图像参数设置
  cameraDisplayConfig: data => postFetch('/uas/v1/api/uvs/camera/display-config', data),
  // OSD参数查看
  cameraOSDInfo: data => postFetch('/uas/v1/api/uvs/camera/osd-info', data),
  // OSD参数设置
  cameraOSDConfig: data => postFetch('/uas/v1/api/uvs/camera/osd-config', data),
  // OSD参数查看(5.4.3)
  cameraMultiOsdInfo: data => postFetch('/uas/v1/api/uvs/camera/osd-infolist', data),
  // OSD参数设置(5.4.3)
  cameraMultiOsdConfig: data => postFetch('/uas/v1/api/uvs/camera/osd-configlist', data),
  // 前端抓拍参数查看
  cameraSnapInfo: data => postFetch('/uas/v1/api/uvs/camera/snap-info', data),
  // 前端抓拍参数设置
  cameraSnapConfig: data => postFetch('/uas/v1/api/uvs/camera/snap-config', data),
  // 前端串口参数查看
  cameraSerialInfo: data => postFetch('/uas/v1/api/uvs/camera/serial-info', data),
  // 前端串口参数设置
  cameraSerialConfig: data => postFetch('/uas/v1/api/uvs/camera/serial-config', data),
  // 前端云台参数查看
  cameraPTZInfo: data => postFetch('/uas/v1/api/uvs/camera/ptz-info', data),
  // 前端云台参数设置
  cameraPTZConfig: data => postFetch('/uas/v1/api/uvs/camera/ptz-config', data),
  // 前端重启
  resetDevice: data => postFetch('/uas/v1/api/uvs/device/reset', data),
  // 前端视频遮挡告警查看
  cameraOcclusionInfo: data => postFetch('/uas/v1/api/uvs/camera/occlusion-info', data),
  // 前端视频遮挡告警设置
  cameraOcclusionConfig: data => postFetch('/uas/v1/api/uvs/camera/occlusion-config', data),
  // 前端移动侦测查看
  cameraVmdInfo: data => postFetch('/uas/v1/api/uvs/camera/vmd-info', data),
  // 前端移动侦测设置
  cameraVmdConfig: data => postFetch('/uas/v1/api/uvs/camera/vmd-config', data),
  // 前端音频参数查看
  cameraAudioInfo: data => postFetch('/uas/v1/api/uvs/camera/audio-info', data),
  // 前端音频参数设置
  cameraAudioConfig: data => postFetch('/uas/v1/api/uvs/camera/audio-config', data),
  // 摄像机录像策略查看
  getCameraRecordPolicyInfo: data => postFetch('/uas/v1/api/uvs/camera/record-policy/info', data),
  // 摄像机录像策略删除
  deleteCameraRecordPolicyInfo: data =>
    postFetch('/uas/v1/api/uvs/camera/record-policy/delete', data),
  // 获取前端智能参数
  getCameraIntelligentInfo: data =>
    postFetch('/uas/v1/api/uvs/pu_config/intelligent/get_info', data),
  // 设置前端智能参数
  setCameraIntelligentInfo: data =>
    postFetch('/uas/v1/api/uvs/pu_config/intelligent/set_info', data),
  // 获取前端智能参数 公共参数
  getCameraIntelligentBaseInfo: data =>
    postFetch('/uas/v1/api/uvs/pu_config/intelligent/get_base', data),
  // 设置前端智能参数 公共参数
  setCameraIntelligentBaseInfo: data =>
    postFetch('/uas/v1/api/uvs/pu_config/intelligent/set_base', data),
  // 服务器录像时间策略查询
  getCameraRecordPolicyByTime: data =>
    postFetch('/uas/v1/api/uvs/camera/record-policy-by-time/get', data),
  // 服务器录像时间策略设置
  setCameraRecordPolicyByTime: data =>
    postFetch('/uas/v1/api/uvs/camera/record-policy-by-time/set', data),
  // 图片留存期策略查询
  getCameraImgPolicy: data => postFetch('/uas/v1/api/uvs/camera/img-policy/get', data),
  // 图片留存期策略设置
  setCameraImgPolicy: data => postFetch('/uas/v1/api/uvs/camera/img-policy/set', data),

  /*
        运营管理
    */
  // 域列表
  syncAllPlat: data => postFetch('/uas/v1/api/uvs/domain/sync', data),
  // 同步单个平台域列表
  syncSinglePlat: data => postFetch('/uas/v1/api/uvs/domain/single/sync', data),
  // 域列表
  getDomainList: data => postFetch('/uas/v1/api/uvs/domain/list', data),
  // 域删除
  deleteDomainInfo: data => postFetch('/uas/v1/api/uvs/domain/delete', data),
  // 集群删除
  deleteClusterInfo: data => postFetch('/uas/v1/api/uvs/cluster/delete', data),
  // 集群列表
  getClusterList: data => postFetch('/uas/v1/api/uvs/cluster/list', data),
  // 集群（取消）支持存储
  modifyClusterStorage: data => postFetch('/uas/v1/api/uvs/cluster/storage/modify', data),
  // 查看单个集群下网关列表
  getGatewayList: data => postFetch('/uas/v1/api/uvs/gateway/list', data),
  // 网关删除
  deleteGatewayInfo: data => postFetch('/uas/v1/api/uvs/gateway/delete', data),
  // 配置网关
  modifyGatewayConf: data => postFetch('/uas/v1/api/uvs/gateway/configure/modify', data),
  //分配集群列表
  getClusterByOrgId: data => postFetch('/uas/v1/api/uvs/cluster/organization/list', data),
  //查询地区平台尚未被分配的集群
  getClusterByOrganizationPlat: data =>
    postFetch('/uas/v1/api/uvs/cluster/organizationplat/list', data),
  //查询地区在该集群尚未分配的网关
  getGatewayByOrganizationPlat: data =>
    postFetch('/uas/v1/api/uvs/gateway/organizationplat/list', data),
  //分配集群信息
  addOrganizationGateway: data => postFetch('/uas/v1/api/uvs/gateway/organization/add', data),
  //取消集群信息
  delOrganizationGateway: data => postFetch('/uas/v1/api/uvs/gateway/organization/delete', data),
  //Boss开通（不）使用
  modifyBossTag: data => postFetch('/uas/v1/api/uvs/cluster/bosstag/modify', data),
  //平台列表查询
  getPlatListByType: data => postFetch('/uas/v1/api/uvs/vps/plat/list', data),
  //域列表查询
  getRegionList: data => postFetch('/uas/v1/api/uvs/vps/region/list', data),
  //集群列表查询
  getVpsDomainList: data => postFetch('/uas/v1/api/uvs/vps/domain/list', data),
  //集群详情查询
  getVpsDomainInfo: data => postFetch('/uas/v1/api/uvs/vps/domain/info', data),
  //同步下级平台，域，集群信息
  syncDomain: data => postFetch('/uas/v1/api/uvs/vps/domain/sync', data),
  //已分配集群列表查询
  getAllocatedDomainList: data => postFetch('/uas/v1/api/uvs/vps/domain/allocated/list', data),
  //未分配集群列表查询
  getUnAllocatedDomainList: data => postFetch('/uas/v1/api/uvs/vps/domain/unAllocated/list', data),
  //分配集群
  AllocateDomain: data => postFetch('/uas/v1/api/uvs/vps/domain/allocate', data),
  //取消分配集群
  cancelAllocateDomain: data => postFetch('/uas/v1/api/uvs/vps/domain/allocate/cancel', data),
  //Boss开通使用
  modifyVpsBossTag: data => postFetch('/uas/v1/api/uvs/vps/bosstag/modify', data),
  //查询单个集群支持的协议
  getProtocolListByDomain: data => postFetch('/uas/v1/api/uvs/vps/domain/protocol/list', data),
  //协议接入路数是否达到上限\
  checkUpperLimit: data => postFetch('/uas/v1/api/uvs/vps/domain/upperLimit/check', data),
  //添加主设备所选域过滤
  getPlatRegionList: data => postFetch('/uas/v1/api/uvs/vps/region/plat/query', data),
  //添加主设备所选集群过滤
  getRegionDomainList: data => postFetch('/uas/v1/api/uvs/vps/domain/region/query', data),

  // 设置图片存储天数(uvs新增接口)
  modifyCameraImagTTL: data =>
    postFetch('/uas/v1/api/uvs/camera/img-policy/modify-by-maindev', data),

  /*
        日志管理
    */
  // 查询日志操作类型
  getOperationTypeList: data => postFetch('/uas/v1/api/udc/log/operation/type', data),
  // 查询日志记录
  getLogList: data => postFetch('/uas/v1/api/udc/log/list', data, 60000),
  // 查询日志记录详情
  getLoginfo: data => postFetch('/uas/v1/api/udc/log/info', data),
  // 导出日志记录
  exportLogInfo: data => postFetch('/uas/v1/api/udc/log/export', data, 300000),

  /*
        告警列表查询模块调用接口
    */
  //获取告警信息列表
  getAlarmList: data => postFetch('/uas/v1/api/alarm/list', data, 60000),
  //获取告警抓拍url
  getAlarmSnap: data => postFetch('/uas/v1/api/alarm/snap/get', data),

  /*
        告警等级管理模块调用接口
    */
  //查询告警级别列表
  listAlarmLevelByPage: data => postFetch('/uas/v1/api/ecs/alarm/level/list/page', data),
  //查询告警级别信息
  getAlarmLevelInfo: data => postFetch('/uas/v1/api/ecs/alarm/level/info', data),
  //添加告警级别信息
  addAlarmLevel: data => postFetch('/uas/v1/api/ecs/alarm/level/add', data),
  //修改告警级别信息
  modifyAlarmLevel: data => postFetch('/uas/v1/api/ecs/alarm/level/modify', data),
  //删除告警级别信息
  deleteAlarmLevel: data => postFetch('/uas/v1/api/ecs/alarm/level/delete', data),

  /*
        告警处理模块调用接口
    */
  // 告警消息正误检
  checkAlarmReport: data => postFetch('/uas/v1/api/alarm/check', data),
  // 告警消息确认
  confirmAlarm: data => postFetch('/uas/v1/api/alarm/confirm', data),
  //查询告警详情
  getAlarmById: data => postFetch('/uas/v1/api/alarm/info', data),

  getDeviceInfo: data => postFetch('/uas/v1/api/udc/device/info', data),
  getAlarmAzimuth: data => postFetch('/uas/v1/api/oba/camera/alarm-position/get', data),

  // 告警用设备树
  getDeviceTree: data => postFetch('/uas/v1/api/udc/device/tree', data),
  //设备树的模糊查询
  searchInDeviceTree: data => postFetch('/uas/v1/api/udc/device/search', data),
  //用户设备或设备组定位
  locateInDeviceTree: data => postFetch('/uas/v1/api/udc/device/locate', data),

  //获取用户树
  getUserTree: data => postFetch('/uas/v1/api/udc/user/tree', data),
  // 搜索用户树
  searchInUserTree: data => postFetch('/uas/v1/api/udc/user/search', data),
  // 定位用户树
  locateInUserTree: data => postFetch('/uas/v1/api/udc/user/locate', data),

  //获取上传地址
  getUploadUrl: data => postFetch('/uas/v1/api/media/upload/url', data),

  //获取文件下载url
  getDownloadUrl: data => postFetch('/uas/v1/api/media/download/url', data),

  // 上传文件 永久
  uploadFile: data => postFetch('/file/fss/upload/permanent', data),

  // 上传文件 临时
  uploadFileTemporary: data => postFetch('/file/fss/upload/temporary', data),

  //获取实时浏览地址
  getLiveUrl: data => postFetch('/uas/v1/api/media/live', data),

  //获取实时浏览地址
  getMediaLiveUrl: data => postFetch('/mss/v1/api/mss/media/live', data),

  // 查询预置位
  getPreset: data => postFetch('/uas/v1/api/preset/get', data),
  getPresetId: data => postFetch('/uas/v1/api/ecs/alarm/preset-id/get', data),

  // 获取区域列表(一次性获取全部数据)
  getAreaChildAll: data => postFetch('/uas/v1/api/dac/area/all-area', data),
  // 获取区域编码
  getAreaCode: data => postFetch('/uas/v1/api/udc/organization/info', data),
  /*
        录像丢失与完整性查询
    */
  getVideoRecordList: data => postFetch('/uas/v1/api/record/list', data),

  /*
        菜单权限管理
    */
  // 系统菜单查询（仅超级管理员使用）
  selectSystemMenus: data => postFetch('/uas/v1/api/udc/management/sys-menus/get', data),
  // 系统菜单设置（仅超级管理员使用）
  updateSystemMenus: data => postFetch('/uas/v1/api/udc/management/sys-menus/set', data),
  // 查询系统权限列表（仅超级管理员使用）
  selectSystemPermissions: data => postFetch('/uas/v1/api/udc/management/sys-perm/list', data),
  // 添加系统权限（仅超级管理员使用）
  addSystemPermission: data => postFetch('/uas/v1/api/udc/management/sys-perm/add', data),
  // 修改系统权限（仅超级管理员使用）
  modifySystemPermission: data => postFetch('/uas/v1/api/udc/management/sys-perm/modify', data),
  // 删除系统权限（仅超级管理员使用）
  deleteSystemPermission: data => postFetch('/uas/v1/api/udc/management/sys-perm/delete', data),
  // 导入系统权限（仅超级管理员使用）
  resetSystemPermission: data => postFetch('/uas/v1/api/udc/management/sys-perm/reset', data),

  /*
        模板文件下载
    */
  // 模板文件下载
  downloadTemplate: data => postFetch('/uvs/v1/api/vir/download/template', data),

  /*
        网关/集群管理
     */
  //接入网关/平台类型查询
  getAccessType: data => postFetch('/uas/v1/api/udc/gateway/access-type', data),
  //自动添加网关
  autoAddAdapterGateway: data => postFetch('/uas/v1/api/oms/adapter-gateway/ivs/group', data),
  //新增网关集群
  addAdapterGatewayInfo: data => postFetch('/uas/v1/api/udc/adapter-gateway/add', data),
  //修改网关集群
  modifyAdapterGatewayInfo: data => postFetch('/uas/v1/api/udc/adapter-gateway/modify', data),
  //网关集群删除
  deleteAdapterGatewayInfo: data => postFetch('/uas/v1/api/udc/adapter-gateway/delete', data),
  //查询网关集群列表
  selectAdapterGateways: data => postFetch('/uas/v1/api/udc/adapter-gateway/select', data),
  //查询单个网关集群详情信息
  getAdapterGatewayInfo: data => postFetch('/uas/v1/api/udc/adapter-gateway/info', data),
  //关联服务器列表查询
  selectNodeHealths: data => postFetch('/uas/v1/api/oms/health/list', data),
  //网关详情状态变更记录
  selectGatewayStatusLogs: data => postFetch('/uas/v1/api/oms/node/status/history/list', data),
  //网关启用/停用
  gatewayEnableModify: data => postFetch('/uas/v1/api/udc/gateway-enable/modify', data),

  /*
        license
     */
  //校验license是否过期
  checkLicenseExpire: data => postFetch('/uas/v1/api/oms/license/check_expire', data),
  //查询license信息
  getLicenseInfo: data => postFetch('/uas/v1/api/oms/license/info', data),
  //导入license信息
  importLicenseInfo: data => postFetch('/uas/v1/api/oms/license/import', data, 72000),

  /*
        能力新增接口
    */
  // 告警组查询
  getGroupsQuery: data => postFetch('/uas/v1/api/alarm/group/query', data),
  // 查询告警类型信息
  getAlarmTypesQuery: data => postFetch('/uas/v1/api/alarm/type/query', data),
  // 获取角色列表
  selectRolesQuery: data => postFetch('/uas/v1/api/udc/role/query', data),
  // 监控平台列表查询
  getPlatformListQuery: data => postFetch('/uas/v1/api/uvs/platform/query', data),
  // 录像计划列表查看
  getRecordPlanListQuery: data => postFetch('/uas/v1/api/uvs/record-plan/query', data),
  // 获取单个镜头信息
  getCameraInfoQuery: data => postFetch('/uas/v1/api/uvs/camera/query', data),
  // 获取组织信息
  getOrganizationQuery: data => postFetch('/uas/v1/api/udc/organization/query', data),
  //导出全部告警
  exportAllAlarm: data => postFetch('/uas/v1/api/ecs/alarm/export', data, 3000000),

  // 轮巡管理
  // 轮巡任务列表
  getTurningList: data => postFetch('/uas/v1/api/uvs/turning/list', data),
  // 查询单个轮巡任务
  getTurningInfo: data => postFetch('/uas/v1/api/uvs/turning/info', data),
  // 轮巡任务添加
  addTurningInfo: data => postFetch('/uas/v1/api/uvs/turning/add', data),
  // 轮巡任务修改
  modifyTurningInfo: data => postFetch('/uas/v1/api/uvs/turning/modify', data),
  // 轮巡任务删除
  deleteTurningInfo: data => postFetch('/uas/v1/api/uvs/turning/delete', data),
  // 轮巡组添加
  addTurningGroupInfo: data => postFetch('/uas/v1/api/uvs/turning/group/add', data),
  // 轮巡组修改
  modifyTurningGroupInfo: data => postFetch('/uas/v1/api/uvs/turning/group/modify', data),
  // 轮巡组删除
  deleteTurningGroupInfo: data => postFetch('/uas/v1/api/uvs/turning/group/delete', data),
  // 轮巡组下摄像机添加
  addTurningCameraInfo: data => postFetch('/uas/v1/api/uvs/turning/camera/add', data),
  // 轮巡组下摄像机修改
  modifyTurningCameraInfo: data => postFetch('/uas/v1/api/uvs/turning/camera/modify', data),
  // 轮巡组下摄像机删除
  deleteTurningCameraInfo: data => postFetch('/uas/v1/api/uvs/turning/camera/delete', data),

  /*
        智能工单
    */
  // 新增任务
  add_ticketInfo: data => postFetch('/uas/v1/api/oba/ticket/add', data),
  // 变更任务
  update_ticketInfo: data => postFetch('/uas/v1/api/oba/ticket/update', data),
  // 处理&&审核任务
  deal_ticketInfo: data => postFetch('/uas/v1/api/oba/ticket/deal', data),
  // 取消任务
  delete_ticketInfo: data => postFetch('/uas/v1/api/oba/ticket/del', data),
  // 获取任务列表
  get_ticketList: data => postFetch('/uas/v1/api/oba/ticket/list', data),
  // 搜索任务
  select_ticketList: data => postFetch('/uas/v1/api/oba/ticket/select', data),
  // 获取操作历史列表
  get_operationList: data => postFetch('/uas/v1/api/oba/ticket/operationList', data),
  // 获取人员列表
  get_personList: data => postFetch('/uas/v1/api/oba/ticket/personList', data),
  // 获取事件类型
  get_eventTypeList: data => postFetch('/uas/v1/api/oba/ticket/eventList', data),
  // 故障上报-------------
  //视频故障列表查询
  getVideoFaultList: data => postFetch('/oba/v1/api/oba/video-fault/list', data),
  //视频故障添加 ,
  addVideoFault: data => postFetch('/oba/v1/api/oba/video-fault/add', data),
  /*
    抓拍管理
  */
  getSnapList: data => postFetch('/uas/v1/api/snap/list', data),

  // 行政区域字典
  getSubArea: data => postFetch('/uas/v1/api/udc/sub/area', data),
  // 行政区域字典 能力接口
  querySubArea: data => postFetch('/uas/v1/api/udc/sub/area/query', data),
  // 快捷生成国标目录
  quickCreateArea: data => postFetch('/uas/v1/api/udc/area/create', data, 300000),
  //区域字典模板导出
  dictionarytemplateExport: data =>
    postFetch('/uas/v1/api/udc/area/template/download', data, 60000),
  //区域字典批量导入
  batchAreaImport: data => postFetch('/uas/v1/api/udc/area/import', data, 300000),
  //区域字典批量导出
  batchAreaExport: data => postFetch('/uas/v1/api/udc/area/export', data, 60000),

  // 查看收藏夹摄像机列表
  getFavoriteCamList: data => postFetch('/uas/v1/api/favorite-camera/list', data),

  /**
   * @description 会话管理+重置密码
   * @param {Object} data
   */
  //获取手机验证码
  fetchSmsCode: data => postFetch('/uas/v1/api/smscode/fetch', data),
  //通过手机重置密码
  resetPassword: data => postFetch('/uas/v1/api/udc/management/passwd/reset', data),
  //获取邮箱验证码
  fetchEmailCode: data => postFetch('/uas/v1/api/emailcode/fetch', data),
  //通过邮箱重置密码
  resetPasswordByEmail: data => postFetch('/uas/v1/api/udc/management/passwd/reset-by-email', data),
  //查询会话列表
  getSessionList: data => postFetch('/uas/v1/api/udc/session/list', data),
  //签退用户会话
  signOutSession: data => postFetch('/uas/v1/api/udc/session/sign-out', data),
  //心跳保活接口
  heartbeat: data => postFetch('/uas/v1/api/user/heartbeat', data, 300000),

  /**
   * @description 系统公告
   * @param {Object} data
   */
  //发布公告
  announcePublish: data => postFetch('/uas/v1/api/bms/announce/publish', data),
  //审核公告
  announceCheck: data => postFetch('/uas/v1/api/bms/announce/check', data),
  //终止公告
  announceTerminate: data => postFetch('/uas/v1/api/bms/announce/terminate', data),
  //删除公告
  announceDelete: data => postFetch('/uas/v1/api/bms/announce/delete', data),
  //公告列表查询
  announceList: data => postFetch('/uas/v1/api/bms/announce/list', data),
  //公告详情查询
  announceInfo: data => postFetch('/uas/v1/api/bms/announce/info', data),

  //2021/10/19
  /**
   * @description 静态任务转码+固定任务转码配置信息
   * @param {Object} data
   */
  getCameraConfigInfo: data => postFetch('/uas/v1/api/media/camera/config/info', data),
  //启动静态转码任务
  startTranscodesTask: data => postFetch('/uas/v1/api/media/camera/transcode/start', data),
  //停止静态转码任务
  stopTranscodesTask: data => postFetch('/uas/v1/api/media/camera/transcode/stop', data),
  //删除静态转码任务
  deleteTranscodesTask: data => postFetch('/uas/v1/api/media/camera/transcode/delete', data),
  //创建静态转码任务
  createCameraTranscodes: data => postFetch('/uas/v1/api/media/camera/transcode/createList', data),
  //修改静态转码任务
  updateCameraTranscode: data =>
    postFetch('/uas/v1/uas/v1/api/media/camera/transcode/update', data),
  //获取静态转码任务配置信息（详情）
  getCameraTranscodeTaskInfo: data => postFetch('/uas/v1/api/media/camera/transcode/get', data),

  //查询转码节点列表（静态转码）
  getTranscodeNodes: data => postFetch('/uas/v1/api/media/transcode/nodeList', data),
  //创建转码任务（静态转码）
  createTranscodeNodes: data => postFetch('/uas/v1/api/media/camera/static/transcode/create', data),

  //2022/07/30
  /**
   * @description 主设备参数配置
   * @param {Object} data
   */
  // 获取主设备参数
  getDevConfig: data => postFetch('/uas/v1/api/uvs/device/config/get', data),
  // 重启前端
  getReset: data => postFetch('/uas/v1/api/uvs/device/reset', data),
  // 设置主设备参数
  setDevConfig: data => postFetch('/uas/v1/api/uvs/device/config/set', data),
  //查询主设备密码
  getDevPassword: data => postFetch('/uas/v1/api/uvs/dev/password/get', data),
  //设置主设备密码
  setDevPassword: data => postFetch('/uas/v1/api/uvs/dev/password/set', data),
  //获取通道信息
  getSubDeviceChannelList: data => postFetch('/uas/v1/api/uvs/main-dev/subDeviceChannelList', data),

  /**
   * 用户行为
   * */
  // 同意行为操作
  acceptBehavior: data => postFetch('/uas/v1/api/udc/behavior/accept', data),
  // 撤销行为操作
  revokeBehavior: data => postFetch('/uas/v1/api/udc/behavior/revoke', data),
  // 用户行为状态查询
  queryBehaviorState: data => postFetch('/uas/v1/api/udc/behavior/state', data),
  // 用户行为记录查询
  getBehaviorList: data => postFetch('/uas/v1/api/udc/behavior/record/list', data),
  // 获取行为协议
  getBehaviorProtocols: data => postFetch('/uas/v1/api/udc/behavior/protocols', data),

  // 水印管理列表
  getWatermarkInfoListByPage: data =>
    postFetch('/uas/v1/api/udc/watermark/info/getListByPage', data),
  //删除水印
  deleteWatermarkInfo: data => postFetch('/uas/v1/api/udc/watermark/manage/delete', data),
  //水印开启/关闭
  changeWatermarkInfoStatus: data =>
    postFetch('/uas/v1/api/udc/watermark/manage/changeStatus', data),
  // 查询国标水印开关
  getGbWatermarkEnable: data =>
    postFetch('/uas/v1/api/udc/watermark/gbWatermarkEnable/get', data),
  //水印添加
  addWatermarkInfo: data => postFetch('/uas/v1/api/udc/watermark/manage/add', data),
  //水印详情
  getWatermarkInfoDetail: data => postFetch('/uas/v1/api/udc/watermark/info/detail', data),
  //水印编辑
  updateWatermarkInfo: data => postFetch('/uas/v1/api/udc/watermark/manage/update', data),
  //客户端获取内容水印
  getContentWatermarkInfo: data => postFetch('/uas/v1/api/udc/watermark/content/get', data),
  //客户端获取视频水印
  getVideoWatermarkInfo: data => postFetch('/uas/v1/api/udc/watermark/video/get', data),
  //租户列表查询(包含admin租户)
  getWatermarkTenantList: data => postFetch('/uas/v1/api/udc/tenant/watermark/list', data),
  //国标水印关联
  linkWatermarkCamera: data => postFetch('/uas/v1/api/udc/watermark/manage/link', data),
  //国标水印取消关联
  unlinkWatermarkCamera: data => postFetch('/uas/v1/api/udc/watermark/manage/unlink', data),

  /* 备份管理 */
  //获取备份域列表
  getBackupList: data => postFetch('/uas/v1/api/uvs/domain/backup/list', data),
  //获取录像备份参数
  getBackupConfig: data => postFetch('/uas/v1/api/uvs/record/backup/config/get', data),
  //设置录像备份参数
  setBackupConfig: data => postFetch('/uas/v1/api/uvs/record/backup/config/set', data),
  //查询录像备份计划
  getBackupPlan: data => postFetch('/uas/v1/api/uvs/record/backup/plan/get', data),
  //设置录像备份计划
  setBackupPlan: data => postFetch('/uas/v1/api/uvs/record/backup/plan/set', data),
  //删除录像备份计划
  deleteBackupPlan: data => postFetch('/uas/v1/api/uvs/record/backup/plan/delete', data),
  //告警级别列表
  getAlarmLevelList: data => postFetch('/uas/v1/api/ecs/alarm/level/query-list', data),

  /* 图像信息 */
  //获取图像信息
  getConfig: data => postFetch('/uas/v1/api/ars/image-retention/config/get', data),
  //编辑图像信息
  getConfigSet: data => postFetch('/uas/v1/api/ars/image-retention/config/set', data),
  // 修改图片存储天数
  modifyMetaDataPolicy: data => postFetch('/uas/v1/api/uvs/camera/image-policy/modify', data)
})
