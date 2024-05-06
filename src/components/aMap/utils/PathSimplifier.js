export default {
  data() {
    return {
      beginMarker: null, // 点标记（起点）
      endMarker: null, // 点标记（终点）
      PathSimplifier: '',
      pathSimplifierIns: null, // 轨迹
      navgtr: null, // 巡航器
      navgtrSpeed: 100, // 巡航速度

      actualList: [], // 巡航经纬度数据
      isCursorAtPathEnd: false,
      palyStayus: 0, //0->未开始  1->行驶中  2->暂停
      currentPoint: null, // 当前定位点

      nowLocus: 1, //播放时间
      totalLocus: 1, //总播放时长

      beforeInit: true,
      isPlay: true,

      times: 1, // 倍速
      timesOptions: [{
          value: 0.5,
          label: '0.5X',
        },
        {
          value: 1,
          label: '1X',
        },
        {
          value: 2,
          label: '2X',
        },
      ],
    }
  },
  created() {
    this.$EventBus.$on('initPathSimplifier', this.initPathSimplifier)
    this.$EventBus.$on('trail-play', this.handlePlayTrail)
    this.$EventBus.$on('clear-markers', this.handleDestroyNavigators)
  },
  beforeDestroy() {
    this.$EventBus.$off('initPathSimplifier')
    this.$EventBus.$off('trail-play')
    this.$EventBus.$off('clear-markers')
  },
  methods: {
    handleDestroyNavigators() {
      if (this.pathSimplifierIns) {
        this.pathSimplifierIns.setData([])
        // this.pathSimplifierIns.createPathNavigator()
      }
      if (document.querySelectorAll('.amap-layer.amap-e').length) document.querySelector('.amap-layer.amap-e').remove()
      console.log(this.map)
      this.map && this.map.clearMap && this.map.clearMap()
      this.initPlayBox()
    },
    handlePlayTrail() {
      this.navigationControl('start')
    },
    // 初始化巡航组件实例
    initPathSimplifier(locusList, type) {
      this.handleClearMarkers()
      if (locusList.length == 0) {
        this.clearTrajectory(false)
        return
      }
      let lineArr = []
      locusList.map((item) => {
        lineArr.push({
          extraData: item,
          lnglat: [item.longitude * 1, item.latitude * 1]
        })
      })
      this.actualList = lineArr

      this.nowLocus = 1
      this.totalLocus = this.actualList.length // 历史轨迹取长度，实时取1
      if (this.PathSimplifier) {
        this.initPathSimplifierNext(type)
      } else {
        this.$AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
          this.PathSimplifier = PathSimplifier
          this.initPathSimplifierNext(type)
        })
      }
    },
    initPathSimplifierNext(type) {
      if (!this.PathSimplifier.supportCanvas) {
        return
      }
      this.map && this.map.clearMap()
      // 如果已存在巡航轨迹，则删除
      if (window.pathSimplifierIns && this.pathSimplifierIns) {
        //通过该方法清空上次传入的轨迹
        this.pathSimplifierIns.setData([])
      }
      //绘制起点icon
      let startIcon = new this.$AMap.Icon({
        // 图标尺寸
        offset: new this.$AMap.Pixel(-17, -45),
        // 图标的取图地址
        image: require('../images/location_begin.png'),
        zIndex: 998,
      })
      //绘制终点icon
      let endIcon = new this.$AMap.Icon({
        image: require('../images/location_end.png'),
        offset: new this.$AMap.Pixel(-17, -45),
        zIndex: 999,
      })
      // 途经点
      let viaMarker = new this.$AMap.Icon({
        size: new this.$AMap.Size(25, 34),
        image: require('../images/dir-marker.png'),
        imageSize: new this.$AMap.Size(135, 40),
        imageOffset: new this.$AMap.Pixel(-50, -3),
        zIndex: 888,
      })

      //绘制marker
      this.actualList.map((item, index) => {
        let marker = new this.$AMap.Marker({
          map: this.map,
          position: item.lnglat,
          icon: index == 0 ? startIcon : index == this.actualList.length - 1 ? endIcon : viaMarker,
          offset: new this.$AMap.Pixel(-17, -40),
          extData: item.extraData,
        })
        marker.on('click', this.markerClick)
      })

      this.initPage()

      this.navgtrFun(type)

      // 加载完成
      this.beforeInit = false
    },
    markerClick(e) {
      console.log(123, e.target.getExtData())
      this.$EventBus.$emit('trackInfo', e.target.getExtData())
    },
    navgtrFun(type) {
      let that = this

      function onload() {
        that.pathSimplifierIns.renderLater()
      }
      // 图片加载失败！
      function onerror() {}
      //对第一条线路（即索引 0）创建一个巡航器
      let image = this.PathSimplifier.Render.Canvas.getImageContent(
        type == 0 ? require('../images/personnel.png') : require('../images/track-car.png'),
        onload,
        onerror
      )
      this.navgtr = this.pathSimplifierIns.createPathNavigator(0, {
        loop: false, // 循环播放
        speed: this.navgtrSpeed, // 巡航速度，单位千米/小时
        pathNavigatorStyle: {
          width: 26,
          height: 30,
          content: image,
          autoRotate: false, // 禁止调整方向
          strokeStyle: null,
          fillStyle: null,
          // 经过路径的样式
          pathLinePassedStyle: {
            lineWidth: 4,
            strokeStyle: '#2C6DD2',
            // strokeStyle: "#20C997",
          },
        },
      })
      this.navgtr.on('start resume', () => {
        this.navgtr._startTime = Date.now()
      })
      this.navgtr.on('stop pause', () => {
        this.navgtr._movedTime = Date.now() - this.navgtr._startTime
      })
      this.navgtr.on('move', (data, position) => {
        this.isCursorAtPathEnd = false
        this.$EventBus.$emit('getStatus', !this.isCursorAtPathEnd)
        let idx = position.dataItem.pointIndex //走到了第几个点
        let len = position.dataItem.pathData.path.length
        // 设置当前点位
        this.currentPoint = this.actualList[idx]
        if (idx < len - 1) {
          this.navgtr.setSpeed(this.navgtrSpeed * this.times)
        }
        // 如果到头了，回到初始状态,播放完成
        if (this.navgtr.isCursorAtPathEnd()) {
          this.isCursorAtPathEnd = true
          this.$EventBus.$emit('getStatus', !this.isCursorAtPathEnd)
          this.initPlayBox()
        }
      })
    },
    initPlayBox() {
      this.navigationControl('pause') // 暂停
      this.playIcon = 'start'
      this.isPlay = true // 播放图标
      this.$EventBus.$emit('getStatus', !this.isPlay)
      this.palyStayus = 0 // 继续状态
    },
    initPage() {
      //创建一个巡航轨迹路线
      this.pathSimplifierIns = new this.PathSimplifier({
        zIndex: 100, //地图层级，
        map: this.map, //所属的地图实例
        //巡航路线轨迹列表
        getPath: (pathData) => {
          return pathData.path
        },
        //hover每一个轨迹点，展示内容
        getHoverTitle: (pathData, pathIndex, pointIndex) => {
          // if (pointIndex >= 0) {
          //   return pathData.name + this.$t('trajectory.getHoverTitle1') + (pointIndex + 1) + '/' + pathData.path.length
          // }
          // return pathData.name + this.$t('trajectory.getHoverTitle2') + pathData.path.length
          return null
        },
        //自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
        //绘制路线节点
        renderOptions: {
          dirArrowStyle: false,
          pathLineStyle: {
            lineWidth: 4,
            strokeStyle: '#E4E7ED',
            dirArrowStyle: false,
          },
          pathLineSelectedStyle: {
            lineWidth: 4,
            strokeStyle: '#E4E7ED',
          },

          renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
        },
      })
      window.pathSimplifierIns = this.pathSimplifierIns
      //设置数据
      this.pathSimplifierIns.setData([{
        name: this.$t('trajectory.trajectoryRoute'),
        path: this.actualList.map((item) => item.lnglat),
      }])
      this.pathSimplifierIns.setSelectedPathIndex(0)
    },
    // 控制播放按钮
    navigationControl(type) {
      if (!this.navgtr || !type) {
        return
      }
      if (type === 'start' || type === 'resume') {
        this.isPlay = false
        this.palyStayus = 2
        // 如果已经到了终点，重新定位坐标
        if (this.isCursorAtPathEnd && this.actualList.length > 0) {
          // this.map.setCenter(this.actualList[0]);
        }
      } else if (type === 'pause') {
        this.isPlay = true
        this.palyStayus = 1
      }
      this.navgtr[type]()
    },
  },
}