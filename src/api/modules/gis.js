export default ({ postFetch }) => ({
  /*
      gis地图
  */
  // 设备方位角
  getPresentAzimuth: data => postFetch('/uas/v1/api/uvs/camera/present-position/get', data),
  // 获取所有带有经纬度的设备
  getDirection: data => postFetch('/uas/v1/api/udc/device/direction', data, 300000),

  // 收藏夹
  // 添加收藏夹信息
  addFavoriteInfo: data => postFetch('/uas/v1/api/favorite/add', data),
  // 修改收藏夹信息
  modifyFavoriteInfo: data => postFetch('/uas/v1/api/favorite/mod', data),
  // 删除收藏夹信息
  deleteFavoriteInfo: data => postFetch('/uas/v1/api/favorite/del', data),
  // 收藏/取消收藏摄像机
  operFavoriteCamera: data => postFetch('/uas/v1/api/favorite/collect', data),
  // 镜头所在收藏夹信息
  queryFavoriteCamera: data => postFetch('/uas/v1/api/favorite-camera/get', data),
  // 查看收藏夹列表
  getFavoriteList: data => postFetch('/uas/v1/api/favorite/get', data),
  // 查看收藏夹摄像机列表
  getFavoriteCamList: data => postFetch('/uas/v1/api/favorite-camera/list', data),

  // 地图网格
  // 添加网格分组
  addGridGroupInfo: data => postFetch('/uas/v1/api/ges/grid/group/add', data),
  // 修改网格分组
  modifyGridGroupInfo: data => postFetch('/uas/v1/api/ges/grid/group/modify', data),
  // 删除网格分组
  deleteGridGroupInfo: data => postFetch('/uas/v1/api/ges/grid/group/delete', data),
  // 网格树
  getGridTree: data => postFetch('/uas/v1/api/ges/grid/tree', data),
  // 添加网格
  addGridInfo: data => postFetch('/uas/v1/api/ges/grid/add', data),
  // 修改网格
  modifyGridInfo: data => postFetch('/uas/v1/api/ges/grid/modify', data),
  // 删除网格
  deleteGridInfo: data => postFetch('/uas/v1/api/ges/grid/delete', data),
  // 网格详情
  queryGridInfo: data => postFetch('/uas/v1/api/ges/grid/info', data),
  // 网格列表
  getGridList: data => postFetch('/uas/v1/api/ges/grid/list', data),

  // 地图中心点以及层级设置
  getCenterPointInfo: data => postFetch('/uas/v1/api/lms/device/location/centerpoint', data),

  // 地图移动设备历史轨迹
  getDeviceHistoryLocationList: data => postFetch('/uas/v1/api/lms/device/location/history', data),
  /**
   * 可视域
   */
  // 添加可视域
  addVisibleRange: data => postFetch('/uas/v1/api/uvs/visible/range/add', data),
  // 修改可视域
  modifyVisibleRange: data => postFetch('/uas/v1/api/uvs/visible/range/modify', data),
  // 可视域详情
  getVisibleRange: data => postFetch('/uas/v1/api/uvs/visible/range/get', data),
  // 删除可视域
  deleteVisibleRange: data => postFetch('/uas/v1/api/uvs/visible/range/delete', data),

  // 电子地图配置
  setGisConfigure: data => postFetch('/uas/v1/api/lms/gis/configure', data),
  // 电子地图配置获取
  getGisConfigure: data => postFetch('/uas/v1/api/lms/gis/configure/get', data),
  // 电子地图初始化配置获取
  getGisConfigureInitial: data => postFetch('/uas/v1/api/lms/gis/initial/get', data),

  /* 图片地图配置 */
  // 获取图片地图列表
  getMapPictureList: data => postFetch('/uas/v1/api/lms/map/picture/list', data),
  // 获取图片地图详情
  getMapPictureInfo: data => postFetch('/uas/v1/api/lms/map/picture/info', data),
  // 添加图片地图
  addMapPicture: data => postFetch('/uas/v1/api/lms/map/picture/add', data),
  // 删除图片地图
  delMapPicture: data => postFetch('/uas/v1/api/lms/map/picture/del', data),
  // 修改图片地图
  modifyMapPicture: data => postFetch('/uas/v1/api/lms/map/picture/modify', data),
  // 获取地图热区列表
  getHostAreaList: data => postFetch('/uas/v1/api/lms/map/hotspot/list', data),
  // 添加热区
  addHostArea: data => postFetch('/uas/v1/api/lms/map/hotspot/add', data),
  // 修改热区
  modifyHostArea: data => postFetch('/uas/v1/api/lms/map/hotspot/modify', data),
  // 删除热区
  delHostArea: data => postFetch('/uas/v1/api/lms/map/hotspot/del', data),
  // 配置图片地图设备位置
  addPictureMapDevice: data => postFetch('/uas/v1/api/lms/map/picture/device/add', data),
  // 删除图片地图设备位置
  delPictureMapDevice: data => postFetch('/uas/v1/api/lms/map/picture/device/del', data),
  // 获取位置关联的图片地图列表
  getPictureDeviceList: data => postFetch('/uas/v1/api/lms/map/picture/device/list', data),
  // 获取地图配置（没有权限限制）
  getGisConfigureQuery: data => postFetch('/uas/v1/api/lms/gis/configure/query', data)
})
