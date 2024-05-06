export default {
  data() {
    return {
      polyline: null,
      passedPolyline: null,
      beginMarker: null, //起点
      endMarker: null, //终点
      runMarker: null, //终点
      actualList: [], //轨迹点位信息
    }
  },
  created() {
    this.$EventBus.$on('initPathSimplifier', this.handleInitPolyline)
    this.$EventBus.$on('trail-play', this.handlePlayTrail)
  },
  methods: {
    //初始化轨迹
    handleInitPolyline(data) {
      let lineArr = []
      data.map((item) => {
        lineArr.push({ extraData: item, lnglat: [item.longitude * 1, item.latitude * 1] })
      })
      this.actualList = lineArr
      this.$AMap.plugin('AMap.MoveAnimation', () => {
        // 绘制轨迹
        this.polyline = new this.$AMap.Polyline({
          map: this.map,
          path: this.actualList.map((item) => item.lnglat),
          showDir: true,
          strokeColor: '#28F', //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6, //线宽
          // strokeStyle: "solid"  //线样式
        })
        //绘制起点icon
        let startIcon = new this.$AMap.Icon({
          // 图标尺寸
          size: new this.$AMap.Size(25, 34),
          // 图标的取图地址
          image: require('../images/dir-marker.png'),
          // 图标所用图片大小
          imageSize: new this.$AMap.Size(135, 40),
          // 图标取图偏移量
          imageOffset: new this.$AMap.Pixel(-9, -3),
        })
        //绘制终点icon
        let endIcon = new this.$AMap.Icon({
          size: new this.$AMap.Size(25, 34),
          image: require('../images/dir-marker.png'),
          imageSize: new this.$AMap.Size(135, 40),
          imageOffset: new this.$AMap.Pixel(-95, -3),
        })
        // 途经点
        let viaMarker = new this.$AMap.Icon({
          size: new this.$AMap.Size(25, 34),
          image: require('../images/dir-marker.png'),
          imageSize: new this.$AMap.Size(135, 40),
          imageOffset: new this.$AMap.Pixel(-50, -3),
        })

        //绘制起点
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

        this.map.setFitView()
      })
    },
    markerClick(e) {
      console.log(e.target.getExtData())
    },
    //轨迹播放
    handlePlayTrail() {
      console.log(123123)
      // this.map.clearMarks([this.runMarker])
      //行动路线
      this.passedPolyline = new this.$AMap.Polyline({
        map: this.map,
        strokeColor: '#AF5', //线颜色
        strokeWeight: 6, //线宽
      })
      //运动对象
      this.runMarker = new this.$AMap.Marker({
        map: this.map,
        position: this.actualList[0].lnglat,
        content: `<img src="${require('../images/track-staff.png')}"/>`,
        offset: new this.$AMap.Pixel(-26, -30),
      })
      this.runMarker.on('moving', (e) => {
        this.passedPolyline.setPath(e.passedPath)
        // this.map.setCenter(e.target.getPosition(), true)
      })
      let speed = parseInt(10000 / this.actualList.length)
      this.runMarker.moveAlong(
        this.actualList.map((item) => item.lnglat),
        {
          // 每一段的时长
          duration: 100, //可根据实际采集时间间隔设置
          // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
          autoRotation: false,
        }
      )
    },
  },
}
