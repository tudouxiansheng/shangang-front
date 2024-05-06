export default {
  g_type: '', // 0：ivs200 1:ivs50,2:spc系列  系统所属盒子类型，由后台告知 ，如果是ivs200/ivs50，只能对接ivs1800
  g_platType: '', // 全局平台类型，存储后不再修改
  options: [],
  activeIndex: '',
  showName: {
    name: 'show',
    nameEn: 'show',
  },
  role: '',
  menusList: [],
  activeIndex2: false,
  activeIndex3: false,

  //配置前端参数
  baseInfoShow: false,
  frontDevId: '',

  //首次登录
  firstLogin: false,

  longNav: true,
  thirdMenuShow: true,
  //正误检
  radio: '',
  // 综合安防平台 websocket数据监听
  totalNumber: 0, // 布控告警总数
  showImg: true,
  // map: '',
  marker: '',

  //修改密码
  modifyToken: '',

  //前端权限判断
  PermissionManage: true,

  //中兴平台设备 前端参数配置 判断
  frontPlatType: '',
  frontDrive: '',
  searchInfo2: {
    pageInfo: {
      pageNum: 1,
    },
  }, //人员检索条件检索
  bodysearchByConditionArray: [], //人体条件检索结果
  facesearchByConditionArray: [],
  pictureSearchResult: [], //以图搜人
  pictureSearchDetail: {}, //以图搜人详情
  pTab: 1, //1表示以图搜人 2表示人脸检索 3表示人体检索
  showSearchResult: false, //展示搜索结果竖形
  SearchResultArray: [],
  SearchExpanArray: [], //展开的数组
  showSearchExpansion: false, //展开的
  searchDetail: false,
  mapState: '', //地图类型 1是2d,0是3d
  mapType: '',

  //巡逻应用
  detailPtrolTab: 0, //1表示第一个巡查动态，2表示处理页面，3表示查看处理详情页面
  person_inout: [], //人员实时推送
  vehicle_inout: [], //车辆实时推送
  patrolEventId: '', //提交工单的时候实时id
  parentInfo: {}, //查询父工单详情的时候
  alarmpage: 0, //告警页面数据共享
  alarmEventId: '', //告警事件id
  alarmParentInfo: {}, //告警查询父工单详情的时候
  personId: '', //人员轨迹id
  patrolId: '', //巡逻轨迹id
  closeMoreAlarm: false, //关闭更多历史告警
  alarmItem: {}, //单个告警信息
  faceOperateId: '', //出入口单个人脸信息
  carOperateId: '', //单个车辆轨迹id
  areaID: '', //区域ID
  facilityID: '', //设备ID
  aiAlarm: '', //ai告警详情
  aiEventId: '', //ai处理事件单条告警id
  carEventId: '',
  // map
  map_img: localStorage.getItem('showimg') === 'true' ? true : false,
}
