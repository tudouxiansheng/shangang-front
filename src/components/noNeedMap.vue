<template>
  <div class="noNeedMap">
    <div id="mycanvas" ref="mycanvas" v-show="showIndex == 1"></div>
    <img :src="base64" v-if="componentProp" style="width: 100%; height: 100%" />
    <div v-if="alarmArray.length">
      <!--这个空标签防止控制台报key重复的错 -->
      <div
        class="imgGroup shengjiang"
        v-for="(item, index) in alarmArray"
        :key="index + '-only2'"
        v-show="showIndex == 1"
      >
        <img
          :src="alarmUrl"
          :style="{
            left: item.x + 'px',
            top: item.y + 'px',
          }"
        />
        <span
          :style="{
            left: item.x + 50 + 'px',
            top: item.y + 'px',
            color: 'red',
            position: 'absolute',
          }"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <div v-if="electricArray.length">
      <div
        class="imgGroup shengjiang"
        v-for="(item, index) in electricArray"
        :key="index + '-only3'"
        v-show="showIndex == 1"
      >
        <img
          :src="electricUrl"
          :style="{
            left: item.x + 'px',
            top: item.y + 'px',
          }"
        />
        <span
          :style="{
            left: item.x + 35 + 'px',
            top: item.y + 'px',
            color: 'red',
            position: 'absolute',
          }"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <div v-if="defenceArrNo.length">
      <div
        class="imgGroup shengjiang"
        v-for="(item, index) in defenceArrNo"
        :key="index + '-only4'"
        v-show="showIndex == 1"
      >
        <span
          :style="{
            left: item.x + 35 + 'px',
            top: item.y + 'px',
            color: 'red',
            position: 'absolute',
          }"
          >{{ item.num }}</span
        >
        <div
          class="number"
          :style="{
            left: item.x + 'px',
            top: item.y + 'px',
            position: 'absolute',
          }"
        >
          {{ item.num }}
        </div>
      </div>
    </div>

    <!---->
    <div v-if="camerList.length" class="wrapper-device">
      <div
        class="imgGroup shengjiang"
        v-for="(item, index) in camerList"
        :key="index + '-only5'"
        v-show="showIndex == 1"
      >
        <img
          :src="cameraUrl"
          :style="{
            left: item.x + 'px',
            top: item.y + 'px',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDefenceAreaList,
  getAlarmCamera,
  getIotDevList,
  getElectricFenceList,
  searchWulian,
  getIotDeviceList,
} from '@/utils/api'

export default {
  props: ['componentProp'],
  data() {
    return {
      shengjiangUrl: require('@/assets/mapIcon/shengjiang.png'),
      alarmUrl: require('@/assets/mapIcon/gaojing.png'),
      electricUrl: require('@/assets/mapIcon/weilan.png'),
      cameraUrl: require('@/assets/mapIcon/cameraNomap.png'),
      shengjiangArray: [],
      alarmArray: [],
      electricArray: [],
      showIndex: 1,
      defenceArrNo: [],
      scsDeviceInfoList: [],
      camerList: [],
      myCanvas: null,
      base64: this.componentProp,
    }
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/homepage') {
        this.showIndex = 1
        this.getAllIotDevice()
      } else {
        this.camerList = []
        this.scsDeviceInfoList = []
        this.base64 = this.componentProp
      }
      if (newVal === '/alarmpage') {
        console.log('告警')
        this.showIndex = 3
      }
      if (newVal == '/eneragepage') {
        console.log('物联应用图标渲染')
        this.showIndex = 7
      }
    },
  },
  computed: {
    fullPath() {
      return this.$route.path
    },
  },
  mounted() {
    console.log('mounted')
    if (this.fullPath == '/homepage') {
      // this.myCanvas = document.createElement('canvas')
      // this.myCanvas.setAttribute('width', document.documentElement.clientWidth)
      // this.myCanvas.setAttribute('height', document.documentElement.clientHeight)
      // this.myCanvas.setAttribute('id', 'myCanvas')
      // this.$refs.mycanvas.appendChild(this.myCanvas)
      this.getAllIotDevice()
    }
  },
  methods: {
    getAllIotDevice() {
      const s_w = window.innerWidth
      const s_h = window.innerHeight
      const that = this
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let cameraImg = new Image()
      let cameraImg2 = new Image()
      cameraImg2.setAttribute('crossorigin', 'anonymous')
      cameraImg2.setAttribute('crossorigin', 'anonymous')
      cameraImg.src = require('../assets/gis/camera.png')
      cameraImg2.src = require('../assets/gis/camera-offline.png')
      let doorImg = new Image()
      let doorImg2 = new Image()
      doorImg.setAttribute('crossorigin', 'anonymous')
      doorImg2.setAttribute('crossorigin', 'anonymous')
      doorImg.src = require('../assets/gis/door-online.png')
      doorImg2.src = require('../assets/gis/door-offline.png')
      let gateImg = new Image()
      let gateImg2 = new Image()
      gateImg.setAttribute('crossorigin', 'anonymous')
      gateImg.src = require('../assets/gis/gate-online.png')
      gateImg2.setAttribute('crossorigin', 'anonymous')
      gateImg2.src = require('../assets/gis/gate-offline.png')
      let img = new Image()
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = function (e) {
        let ratioX = this.width / s_w
        let ratioY = this.height / s_h
        console.log(ratioX, ratioY, '系数')
        canvas.setAttribute('width', this.width)
        canvas.setAttribute('height', this.height)
        ctx.drawImage(img, 0, 0, this.width, this.height)
        getAlarmCamera({
          deviceType: 1,
          mapType: 2,
        }).then((res) => {
          if (res.resultCode == 0) {
            console.log(res, 'res')
            this.scsDeviceInfoList = res.resultList.filter((item) => {
              item.deviceType = 1
              return item.xeightyAxis && item.yeightyAxis
            })
            console.log(this.scsDeviceInfoList)
            getIotDevList({}).then((res2) => {
              let icon_w = (cameraImg.width / 2) * ratioX
              let icon_h = (cameraImg.height / 2) * ratioY
              if (res2.resultCode == 0) {
                res2.deviceList = res2.deviceList.filter((d) => {
                  return d.xEightyAxis && d.yEightyAxis
                })
                this.scsDeviceInfoList = this.scsDeviceInfoList.concat(
                  res2.deviceList.map((d) => {
                    return {
                      xeightyAxis: d.xEightyAxis,
                      yeightyAxis: d.yEightyAxis,
                      deviceId: d.deviceId,
                      deviceName: d.name,
                      status: d.connect, //在离线
                      subStatus: d.status, //设备开关
                      deviceType: d.module == 1 ? 2 : 3, //门禁或者道闸
                      platType: d.platType,
                      platId: d.platId,
                      productId: d.productId,
                    }
                  })
                )
              }
              this.scsDeviceInfoList.map((i, index) => {
                // if (i.xeightyAxis * 1 < icon_w) i.xeightyAxis = icon_w
                // if (i.yeightyAxis * 1 < icon_h) i.yeightyAxis = icon_h
                if (i.deviceType == 1)
                  if (i.status == 1) {
                    ctx.drawImage(cameraImg, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //摄像机
                  } else {
                    ctx.drawImage(cameraImg2, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //摄像机
                  }
                if (i.deviceType == 2) {
                  if (i.status == 1) {
                    ctx.drawImage(doorImg, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //门禁
                  } else {
                    ctx.drawImage(doorImg2, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //门禁
                  }
                }
                // 中控的道闸没有在离线状态
                if (i.deviceType == 3) {
                  if (i.status == 1 || i.platType == 63) {
                    ctx.drawImage(gateImg, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //道闸
                  } else {
                    ctx.drawImage(gateImg2, i.xeightyAxis * 1, i.yeightyAxis * 1, icon_w, icon_h) //门禁
                  }
                }
              })
              that.base64 = canvas.toDataURL('image/jpeg', 1)
            })
          }
        })
      }

      img.src = this.componentProp
    },
    getIndexLogo() {
      // getIotDeviceList({
      //   pageInfo: { pageNum: 1, pageSize: 100 },
      //   organizationId: 0,
      // }).then((res) => {
      //   console.log(res)
      //   if (res.resultCode == 0) {
      //     this.scsDeviceInfoList = res.scsDeviceInfoList
      //
      //     for (let i = 0; i < this.scsDeviceInfoList.length; i++) {
      //       if (this.scsDeviceInfoList[i].deviceType == 0) {
      //         let result = this.scsDeviceInfoList[i].scsSubDeviceInfoList
      //         for (let i = 0; i < result.length; i++) {
      //           this.camerList.push({
      //             name: result[i].deviceName,
      //             x: result[i].longitude,
      //             y: result[i].latitude,
      //           })
      //         }
      //       }
      //     }
      //     console.log('camerList', this.camerList)
      //   }
      // })
    },
    measurePath() {
      var locations2 = []
      let resdata = {
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
      }

      var canvas = document.getElementById('myCanvas')

      //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误

      if (canvas.getContext) {
        //获取对应的CanvasRenderingContext2D对象(画笔)
        var ctx = canvas.getContext('2d')
        //线条的颜色

        ctx.strokeStyle = 'green'

        //线条的宽度像素

        ctx.lineWidth = 5

        //线条的两关形状

        ctx.lineCap = 'round'

        //注意，Canvas的坐标系是：Canvas画布的左上角为原点(0,0)，向右为横坐标，向下为纵坐标，单位是像素(px)。

        //开始一个新的绘制路径

        setInterval(function () {
          ctx.strokeStyle = '#71ff2b'
          //第二条线
          ctx.beginPath()
          ctx.moveTo(467, 783)
          ctx.lineTo(1443, 845)

          ctx.stroke()
          //第二次延迟
        }, 500)
        setInterval(function () {
          ctx.strokeStyle = 'red'

          //第三条线
          ctx.beginPath()
          ctx.moveTo(467, 783)
          ctx.lineTo(1443, 845)

          ctx.stroke()
        }, 1000)
        //绘制防区
        ctx.beginPath()
        ctx.strokeStyle = '#71ff2b'
        getDefenceAreaList(resdata).then((res) => {
          if (res.resultCode == 0) {
            let array = res.defenceAreaList
            for (let l = 0; l < array.length; l++) {
              var locationArg3 = [
                (array[l].locationArgs[0].longitude + array[l].locationArgs[1].longitude) / 2,
                (array[l].locationArgs[0].latitude + array[l].locationArgs[1].latitude) / 2,
              ]
              this.defenceArrNo.push({
                num: array[l].defenceAreaNo,
                x: locationArg3[0],
                y: locationArg3[1],
              })
            }
            console.log(locationArg3, 'locationArg3')
            //画防区线，要两个经纬度，locationArgs长度为2
            for (let k = 0; k < array.length; k++) {
              for (let i in array[k].locationArgs) {
                var locationArgsArray2 = [array[k].locationArgs[i].longitude, array[k].locationArgs[i].latitude]
                locations2.push(locationArgsArray2)
              }
              console.log(locations2, 'locations2', locations2[0][0], locations2[0][1])
              ctx.moveTo(locations2[0][0], locations2[0][1])
              ctx.lineTo(locations2[1][0], locations2[1][1])
              ctx.stroke()
              locations2 = [] //一条一条画，画完清空
            }
          }
        })

        // ctx.moveTo(466, 861);

        // ctx.lineTo(1446, 897);

        // ctx.stroke();

        // ctx.moveTo(1446, 897);

        // ctx.lineTo(1443, 168);

        // ctx.moveTo(1458, 170);
        // ctx.lineTo(416, 136);

        // //沿着坐标点顺序的路径绘制直线

        // ctx.stroke();

        // //关闭当前的绘制路径

        ctx.closePath()
      }
    },
  },
}
</script>

<style lang="scss">
.noNeedMap {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
  .wrapper-device {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .imgGroup {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    img {
      position: absolute;
    }
  }
  .shengjiang {
    span {
      background-color: #fff;
      padding: 5px 8px;
      display: inline-block;
      border-radius: 4px;
      margin: 10px 0 10px 10px;
      position: relative;
    }
    span::after {
      content: '';
      border: 8px solid #ffffff00;
      border-right: 8px solid #fff;
      position: absolute;
      top: 6px;
      left: -16px;
    }
  }
  .number {
    display: block;
    border-radius: 15px;
    background-color: #137fbf;
    width: 30px;
    height: 30px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    line-height: 30px;
  }

  #mycanvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
