export default {
  // 设置系统所属盒子类型，由后台告知
  SET_G_TYPE(state, data) {
    state.g_type = data
  },
  // 设置全局平台类型
  SET_G_PLATTYPE(state, data) {
    state.g_platType = data
  },
  set_active_index2(state, data) {
    this.state.activeIndex2 = data
  },

  // 添加tabs
  add_tabs(state, data) {
    // 默认展示菜单列表第一个
    this.state.options.push(data)
  },
  set_options(state, data) {
    this.state.options = []
  },
  // 删除tabs
  delete_tabs(state, id) {
    let index = 0
    for (let option of state.options) {
      if (option.id === id) {
        break
      }
      index++
    }
    this.state.options.splice(index, 1) //删除options里面下标为Index的一个数
  },
  // 添加菜单
  add_menus(state, data) {
    this.state.menusList = data
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    this.state.activeIndex = index
  },
  //设置tab页显示标题
  set_showName(state, name) {
    this.state.showName = name
  },
  set_role(state, role) {
    this.state.role = role
  },
  set_longNav(state, longNav) {
    this.state.longNav = longNav
  },
  add_totalNumber(state, totalNumber) {
    this.state.totalNumber += totalNumber
  },

  del_totalNumber(state) {
    this.state.totalNumber = 0
  },
  set_showImg_true(state) {
    this.state.showImg = true
  },
  set_showImg_false(state) {
    this.state.showImg = false
  },
  set_Map(state, data) {
    this.state.map = data
  },
  set_marker(state, data) {
    this.state.marker = data
  },
  set_thirdMenuShow(state, data) {
    this.state.thirdMenuShow = data
  },
  set_faceImage(state, data) {
    this.state.faceImage = data
  },
  set_faceReportPath(state, data) {
    this.state.faceReportPath = data
  },
  set_faceReportId(state, data) {
    this.state.faceReportId = data
  },
  set_facePath(state, data) {
    this.state.facePath = data
  },

  /*人车应用 */
  //人体条件检索请求信息
  personConditionSearch(state, data) {
    this.state.searchInfo2 = data
  },
  //人体条件检索改变当前页面
  changeFaceSearchBodyPage(state, data) {
    state.searchInfo2.pageInfo.pageNum = data
  },
  //人体条件检索数组
  bodysearchByCondition(state, data) {
    state.bodysearchByConditionArray = data
  },
  //人脸检索结果数组
  facesearchByCondition(state, data) {
    state.facesearchByConditionArray = data
  },
  //以图搜人结果
  pictureSearchResult(state, data) {
    state.pictureSearchResult = data
  },
  //详情
  pictureSearchDetail(state, data) {
    state.pictureSearchDetail = data
    //详情打开，其它关闭
    state.searchDetail = true
    state.showSearchResult = false
    state.showSearchExpansion = false
  },
  //改变切换的tab
  changepTab(state, data) {
    state.pTab = data //1表示以图搜人 2表示人脸检索 3表示人体检索
  },
  //以图搜人搜索结果
  setShowSearchResultVisible(state, data) {
    state.showSearchResult = false
    state.showSearchExpansion = true
    state.searchDetail = false
    if (state.pTab == 1) {
      state.SearchResultArray = state.pictureSearchResult
    } else if (state.pTab == 3) {
      //人体检索之后点详情，详情点到以图搜人
      state.SearchResultArray = state.pictureSearchResult
    } else {
      state.SearchResultArray = state.pictureSearchResult
    }
  },
  //从展开切换到列表
  exPictureToExpan(state, data) {
    state.showSearchResult = false
    state.showSearchResult = false
    state.showSearchExpansion = true
    if (data == 1) {
      state.SearchExpanArray = state.pictureSearchResult
    } else if (data == 3) {
      state.SearchExpanArray = state.bodysearchByConditionArray
    } else if (data == 2) {
      state.SearchExpanArray = state.facesearchByConditionArray
    }
  },
  //从expan到result
  exPictureToResult(state, data) {
    console.log(state, data)
    if (data == 1) {
      state.SearchResultArray = state.pictureSearchResult
    } else if (data == 3) {
      state.SearchResultArray = state.bodysearchByConditionArray
    } else if (data == 2) {
      state.SearchResultArray = state.facesearchByConditionArray
    }
    state.showSearchExpansion = true
    state.showSearchResult = false
  },
  //关闭展开
  closeExpan(state, data) {
    state.showSearchExpansion = false
  },
  //关闭竖形结果
  closeResult(state, data) {
    state.showSearchResult = false
  },
  //关闭详情
  closeDetail(state, data) {
    state.searchDetail = false
  },
  mapState(state, data) {
    state.mapState = data
  },
  mapType(state, data) {
    state.mapType = data
  },
  //巡逻应用
  commitPtrolTab(state, data) {
    state.detailPtrolTab = data
  },
  //首页实时推送的人员数据
  person_inout(state, data) {
    state.person_inout = data
  },
  //首页实时推送的车辆数据
  vehicle_inout(state, data) {
    state.vehicle_inout = data
  },
  //巡逻点事件id
  patrolEventId(state, data) {
    state.patrolEventId = data
  },
  //巡逻父工单id
  parentInfo(state, data) {
    state.parentInfo = data
  },
  //告警页面共享
  alarmPage(state, data) {
    state.alarmpage = data //1表示第一下页面 2表示处理页面 3表示闭环页面
  },
  //告警事件id
  alarmEventId(state, data) {
    state.alarmEventId = data
  },
  //告警父工单详情
  alarmparentInfo(state, data) {
    state.alarmParentInfo = data
  },
  personId(state, data) {
    state.personId = data
  },
  patrolId(state, data) {
    state.patrolId = data
  },
  closeMoreAlarm(state, data) {
    state.closeMoreAlarm = data
  },
  //单条告警信息
  alarmItem(state, data) {
    state.alarmItem = data
  },
  faceOperateId(state, data) {
    state.faceOperateId = data
  },
  //单个车辆轨迹id
  carOperateId(state, data) {
    state.carOperateId = data
  },
  carEventId(state, data) {
    state.carEventId = data
  },
  // 区域ID变化
  areaIdChange(state, data) {
    state.areaID = data
  },
  // 设备Id发生变化
  facilityIdChange(state, data) {
    state.facilityID = data
  },
  dealAialarm(state, data) {
    state.aiAlarm = data
  },
  dealAiEventId(state, data) {
    state.aiEventId = data
  },
  changeMapImg(state, data) {
    state.map_img = data
  },
}
