<template>
  <!-- 地图轨迹控制条 -->
  <div v-show="trajectoryControlShow" class="trajectory-control">
    <div class="control">
      <div class="playIcon" v-if="isPlay">
        <i v-if="palyStayus === 0" :disabled="beforeInit" class="el-icon-video-play" @click="navgControl('start')" />
        <i v-if="palyStayus === 1" :disabled="beforeInit" class="el-icon-video-play" @click="navgControl('resume')" />
      </div>
      <div class="playIcon" v-if="!isPlay">
        <i :disabled="beforeInit" class="el-icon-video-pause" @click="navgControl('pause')" />
      </div>
      <span>{{ nowLocus }}/{{ totalLocus }}</span>
      <!--进度条-->
      <el-slider
        v-model="sliderVal"
        :disabled="beforeInit"
        :step="1"
        :max="silderMax"
        :format-tooltip="formatTooltip"
        @change="carReLocate"
        @input="sliderInput"
      />

      <el-select v-model="times">
        <el-option v-for="item in timesOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 地图轨迹
      trajectoryControlShow: false,

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

      sliderVal: 0, // 进度条初始化
      silderMax: 10,
      isOnSlider: false,

      times: 1, // 倍速
      timesOptions: [
        {
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
  mounted() {
    this.$EventBus.$on('initPathSimplifier', this.initPathSimplifier)
    this.$EventBus.$on('realTimeLocus', this.realTimeLocus)
  },
  methods: {
    // 初始化巡航组件实例
    initPathSimplifier(data) {
      const { locusList, flag } = data
      console.log(locusList)
      if (locusList.length == 0) {
        this.clearTrajectory(false)
        return
      }

      let linArray = []

      for (let i = 0; i < locusList.length; i++) {
        const ele = locusList[i]
        linArray.push([ele.longitude, ele.latitude])
      }
      this.sliderVal = 0
      this.silderMax = (locusList.length - 1) * 10
      this.actualList = linArray

      this.nowLocus = 1
      this.totalLocus = flag ? locusList.length : 1 // 历史轨迹取长度，实时取1

      flag ? this.exhibitTrajectoryControl() : (this.trajectoryControlShow = false)

      this.$AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        this.PathSimplifier = PathSimplifier
        if (!PathSimplifier.supportCanvas) {
          return
        }

        // 如果已存在巡航轨迹，则删除
        if (window.pathSimplifierIns && this.pathSimplifierIns) {
          //通过该方法清空上次传入的轨迹
          this.pathSimplifierIns.setData([])
        }
        if (!this.beginMarker) {
          // 初始化起点
          console.log(11111, this.actualList)
          this.beginMarker = new this.$AMap.Marker({
            map: this.map,
            offset: new this.$AMap.Pixel(-17, -40),
            position: this.actualList[0],
            content: `<img src="${require('../images/location_begin.png')}"/>`,
          })
          console.log(this.beginMarker)
          this.beginMarker.setMap(this.map)
        } else {
          console.log(222)
          this.beginMarker.setPosition(this.actualList[0])
        }

        if (flag) {
          if (!this.endMarker) {
            // 初始化终点
            this.endMarker = new this.$AMap.Marker({
              map: this.map,
              offset: new this.$AMap.Pixel(-17, -40),
              position: this.actualList[this.actualList.length - 1],
              content: `<img src="${require('../images/location_end.png')}"/>`,
            })
            this.endMarker.setMap(this.map)
          } else {
            this.endMarker.show()
            this.endMarker.setPosition(this.actualList[this.actualList.length - 1])
          }
        } else {
          this.endMarker && this.endMarker.hide()
        }

        this.initPage()

        this.navgtrFun()

        // 加载完成
        this.beforeInit = false
      })
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
          if (pointIndex >= 0) {
            return pathData.name + this.$t('trajectory.getHoverTitle1') + (pointIndex + 1) + '/' + pathData.path.length
          }
          return pathData.name + this.$t('trajectory.getHoverTitle2') + pathData.path.length
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
      this.pathSimplifierIns.setData([
        {
          name: this.$t('trajectory.trajectoryRoute'),
          path: this.actualList,
        },
      ])
      this.pathSimplifierIns.setSelectedPathIndex(0)
    },
    navgtrFun() {
      let that = this
      function onload() {
        that.pathSimplifierIns.renderLater()
      }
      // 图片加载失败！
      function onerror() {}
      //对第一条线路（即索引 0）创建一个巡航器
      let image = this.PathSimplifier.Render.Canvas.getImageContent(require('../images/personnel.png'), onload, onerror)
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
        let idx = position.dataItem.pointIndex //走到了第几个点
        let tail = position.tail //至下一个节点的比例位置
        let totalIdx = idx + tail
        let len = position.dataItem.pathData.path.length
        // 设置当前点位
        this.currentPoint = this.actualList[idx]
        if (idx < len - 1) {
          this.navgtr.setSpeed(this.navgtrSpeed * this.times)
        }
        // 进度条实时展示tail
        !this.isOnSlider && (this.sliderVal = totalIdx * 10)

        // 如果到头了，回到初始状态
        if (this.navgtr.isCursorAtPathEnd()) {
          this.isCursorAtPathEnd = true
          this.initPlayBox()
        }
      })
    },
    // 实时轨迹
    realTimeLocus(data) {
      this.actualList.push([data.longitude, data.latitude])

      var cursor = this.navgtr.getCursor().clone(), //保存巡航器的位置
        status = this.navgtr.getNaviStatus()

      let actualList = [
        {
          name: this.$t('trajectory.trajectoryRoute'),
          path: this.actualList,
        },
      ]
      this.pathSimplifierIns.setData(actualList)

      //重新建立一个巡航器
      this.navgtrFun()

      this.navgtr.start()

      //恢复巡航器的位置
      if (cursor.idx >= 0) {
        this.navgtr.moveToPoint(cursor.idx, cursor.tail)
      }
      if (status !== 'stop') {
        this.navgtr.resume() // 恢复巡航
      }
      this.pathSimplifierIns.render()
    },

    // 控制播放按钮
    navgControl(type) {
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
    // 展示对应轨迹控制条
    exhibitTrajectoryControl() {
      this.trajectoryControlShow = true
      // 为滑动条版绑定监听事件
      let that = this
      let el = document.getElementsByClassName('el-slider__button-wrapper')[0]
      let el2 = document.getElementsByClassName('el-slider__runway')[0]
      el2.addEventListener('click', that.sliderClick, false)
      el.addEventListener('mousedown', that.openSlider, false)
      // 此处用document是因为，滑动较为随意时，mouseup可能不是作用在el上
      document.addEventListener('mouseup', that.closeSlider, false)
    },
    openSlider() {
      this.isOnSlider = true
    },
    closeSlider() {
      this.isOnSlider = false
    },

    sliderInput(val) {
      this.nowLocus = parseInt(Math.round(val) / 10) + 1
      if (!this.isOnSlider) {
        return false
      }
      this.sliderChange(val)
    },
    sliderClick() {
      this.isOnSlider = true
      this.sliderChange(this.sliderVal)
    },
    // 滑块改变位置
    sliderChange(val) {
      if (this.beforeInit) {
        return
      }
      // 先改为播放状态
      if (this.palyStayus === 0) {
        this.navgControl('start')
        this.navgControl('pause')
      }
      // 移动巡航器
      let newVal = typeof val === 'number' ? val : this.sliderVal
      let num = parseInt(Math.round(newVal) / 10) // 节点索引
      let decimal = parseInt(newVal % 10) / 10 || 0 // 至下一个节点的比例位置
      this.navgtr.moveToPoint(num, decimal) // 将巡航器移动到指定的节点索引位置
      this.pathSimplifierIns.renderLater()
    },
    // 轨迹回放重新定位
    carReLocate() {
      // 鼠标从滑动条抬起时，重新定位
      if (this.currentPoint) {
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          this.map.setCenter(this.currentPoint)
        }, 0)
      }
    },
    formatTooltip(val) {
      return parseInt(Math.round(val) / 10) + 1
    },
    // 初始化播放器状态
    initPlayBox() {
      this.navgControl('pause') // 暂停
      this.playIcon = 'start'
      this.isPlay = true // 播放图标
      this.palyStayus = 0 // 继续状态
      // this.sliderVal = 0; // 进度条清0
      // this.nowLocus = 1; // 播放时间置空
    },
    // 清除轨迹
    clearTrajectory(flag = true) {
      this.beginMarker && this.map.remove(this.beginMarker)
      this.endMarker && this.map.remove(this.endMarker)
      this.pathSimplifierIns && this.pathSimplifierIns.hide()
      Object.assign(this.$data, this.$options.data())
      flag && this.$bus.$emit('closeRealTimeTrajectory') // 关闭实时轨迹
    },
  },
}
</script>

<style lang="scss">
.trajectory-control {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 40px;
  margin: auto;
  border-radius: 4px;
  width: 45%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  .control {
    display: flex;
    justify-content: space-between;
    height: 20px;
    line-height: 20px;
    padding: 20px;
    .playIcon {
      margin-right: 5px;
      font-size: 18px;
    }
    .el-slider {
      display: inline-block;
      width: 80%;
      padding: 0 10px;
      .el-slider__runway {
        height: 4px;
        margin: 8px 0;
        background: rgba(255, 255, 255, 0.5);
      }
      .el-slider__bar {
        width: 4px;
        background: #fff;
      }
      .el-slider__button-wrapper {
        width: 16px;
        height: 16px;
        top: -7px;
        .el-slider__button {
          bottom: none;
        }
      }
    }
    .el-select {
      width: 50px;
      margin-left: 10px;
      .el-input__inner {
        background: transparent;
        border: none;
        height: 20px;
        line-height: 20px;
        // text-align: right;
        padding: 0;
      }
      .el-input__icon {
        width: 16px;
        line-height: 20px;
      }
    }
  }
}
</style>
