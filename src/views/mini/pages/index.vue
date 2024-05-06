<template>
  <div class="screen" :class="[cuType == 1 ? 'full' : '']">
    <div class="main">
      <template v-if="isHome">
        <div class="left-wrapper" :class="toggle ? 'hidden-left' : ''" v-if="leftModule.length > 0">
          <div
            :class="toggle ? 'show-collapse' : ''"
            :title="toggle ? $t('public.expand') : $t('public.fold')"
            class="collapse"
            @click="handleToggle()"
          >
            <img v-if="!toggle" src="../../../assets/bigScreen/left@2x.png" alt="" />
            <img v-else src="../../../assets/bigScreen/right@2x.png" alt="" />
          </div>
          <div class="left">
            <div
              v-for="(item, index) in leftModule"
              :key="index"
              :class="[leftModule.length == 4 ? 'name' : 'twoModule']"
            >
              <component
                v-bind:is="item.name"
                @detail="handleAlarmDetail"
                :showProperty="item.showProperty ? item.showProperty : { moduleName: '-' }"
              ></component>
            </div>
          </div>
        </div>
        <div class="right-wrapper" :class="toggle ? 'hidden-right' : ''" v-if="rightModule.length > 0">
          <div
            :class="toggle ? 'show-collapse' : ''"
            :title="toggle ? $t('public.expand') : $t('public.fold')"
            class="collapse"
            @click="handleToggle()"
          >
            <img v-if="!toggle" src="../../../assets/bigScreen/right@2x.png" alt="" />
            <img v-else src="../../../assets/bigScreen/left@2x.png" alt="" />
          </div>
          <div class="right">
            <div
              v-for="(item, index) in rightModule"
              :key="index"
              :class="[rightModule.length == 4 ? 'name' : 'twoModule']"
            >
              <component
                v-bind:is="item.name"
                @detail="handleAlarmDetail"
                :showProperty="item.showProperty ? item.showProperty : { moduleName: '-' }"
              ></component>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <alarmLinkage ref="linkage" :info="alarmInfo" :cameraList="allDevice" @goBack="handleGoBack"></alarmLinkage>
      </template>
    </div>

    <!-- 动态告警详情框 -->
    <!-- <alarmDetail
      :visible.sync="bigCardVisible"
      :infoObj="alarmData"
      @closeIcon="closeIconMethod"
      @handleRight="handleRight"
    ></alarmDetail> -->
  </div>
</template>

<script>
import Header from '@/components/Header'

import peopleRec from '@/components/homecomponents/personComeIn'
import cardPass from '@/components/homecomponents/carReacrd'
import traffic from '@/components/homecomponents/traffic.vue'
import patrolTask from '@/components/homecomponents/patrol-task.vue'
import camera from '@/components/homecomponents/camera'
import attendance from '@/components/homecomponents/attendance'
import generalize from '@/components/homecomponents/generalize'
import safety from '@/components/homecomponents/safety'
import alarmHandle from '@/components/homecomponents/alarmHandle'
import patrolHandle from '@/components/homecomponents/patrolHandle.vue'
import visitor from '@/components/homecomponents/visitor.vue'
import keyMonitor from '@/components/homecomponents/keyMonitor.vue'
import workOrder from '@/components/homecomponents/workOrder.vue'
import weather from '@/components/homecomponents/weather'
import AlarmQuantity from '@/components/homecomponents/alarmQuantity.vue'
import DynamicAlarm from '@/components/homecomponents/DynamicAlarm.vue'
import EpidemicSituation from '@/components/homecomponents/EpidemicSituation.vue'
// import alarmDetail from './alarm/component/alarmDetail'
import IotDeviceStatictis from '../../../components/homecomponents/IotDeviceStatictis'
import alarmLinkage from '../../../components/homecomponents/AlarmLinkage'
import { AllcamMap } from '@/utils/map/AllcamMap'
import {
  getDefenceAreaList,
  getIotDeviceList,
  searchWulian,
  getHomePageModulePosition,
  getCameraList,
  getAlarmCamera,
  getIotDevList,
  getMyAreaList,
  getGuardHitInfo,
  getLoginUserInfo,
} from '@/utils/api'
export default {
  components: {
    alarmLinkage,
    // alarmDetail,
    Header /*头部*/,
    generalize /*园区概览*/,
    safety /*安全态势*/,
    peopleRec /*人员应用*/,
    cardPass /*车辆应用*/,
    alarmHandle /*告警状态*/,
    weather /*天气*/,
    keyMonitor /*关键监控点位*/,
    AlarmQuantity /*告警数量*/,
    camera /*设备总览*/,
    patrolHandle, //巡逻
    patrolTask, //巡逻
    visitor, //访客
    workOrder, //工单统计
    traffic, //进出流量统计
    attendance, //考勤模块
    DynamicAlarm, //实时告警
    EpidemicSituation, //疫情统计
    IotDeviceStatictis, //物联设备总览
  },
  data() {
    return {
      isHome: true,
      alarmInfo: {},
      toggle: false,
      radio1: '天',
      map: '',
      bigCardVisible: false,
      alarmData: {},
      timer2: '',
      getElectricFenceList: {
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
        list: [],
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 50,
      },
      defenceAreaList: [],
      moduleSet: [],
      rightModule: [],
      leftModule: [],
      marker: [],
      polylineMarker: [],
      lineItem: '',
      scsDeviceInfoList: [],
      allDevice: [],
      popupList: [],
      cuType: sessionStorage.getItem('cuType'),
    }
  },
  computed: {
    mapState() {
      return this.$store.state.mapState
    },

    mapType() {
      return this.$store.state.mapType
    },
    isShowImg() {
      console.log(localStorage.getItem('showimg'))
      return localStorage.getItem('showimg') == 'false'
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  beforeDestroy() {
    if (this.timer2) {
      clearInterval(this.timer2)
    }

    if (AllcamMap.map) {
      wutu3d.point.windingPoint.stop()
      AllcamMap.map.deletePlot(this.lineItem)
    }
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$off('linkage', this.handleGoLinkage)
  },
  created() {
    this.$EventBus.$on('linkage', this.handleGoLinkage)
    // 处理从轨迹返回告警处理
    if (sessionStorage.getItem('cuType') == 1) {
    } else {
      let params = this.$route.params
      if (params && params.replayAlarm) {
        this.isHome = false
        this.alarmInfo = params.extra
        setTimeout(() => {
          if (AllcamMap.map) AllcamMap.map.flyToIcon(params.extra.deviceId)
        }, 1500)
        // 触发地图告警
      }
    }
    this.$EventBus.$on('setLinkageParam', (param) => {
      if (param && param.replayAlarm) {
        this.isHome = false
        this.alarmInfo = param.extra
      }
    })
  },
  mounted() {
    this.getModule()
    this.getAllIotDevice()
    this.getAreaList()
    if (AllcamMap.map) {
      AllcamMap.map.flyHome()
    }
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    // setInterval(() => {
    //   this.$EventBus.$emit('websocketMessage', {
    //     type: 'alarm',
    //     content:
    //       'eyJhbGFybUlkIjoiMDAwMDAwMjMwOTA1MTQwMTEyNDExOTAxOVFEOXFYc04iLCJwcm9jZXNzTW9kZSI6bnVsbCwidGhpcmRBbGFybUlkIjpudWxsLCJhbGFybUV2ZW50SWQiOm51bGwsImRldmljZUlkIjoiMDAwMDAwMjMwOTE2MTQwMTAzMDEwMDAwMDAwMDAwMzkiLCJtYWluRGV2SWQiOiIwMDAwMDAyMzA5MTYxNDAxMDMwMzAwMDAwMDAwMDAzOCIsInRoaXJkRGV2aWNlSWQiOiIwOTcyMjYxMTM0MzEyMzY3MDEwMSIsInRoaXJkTWFpbkRldklkIjpudWxsLCJhbGFybURldk5hbWUiOiIyMzBvbnZpZiIsInBsYXRJZCI6IjAwMDAwMDAwMDAwMDE0MDEiLCJwZXJzb25OYW1lIjpudWxsLCJscG4iOm51bGwsImluc3RhbGxMb2NhdGlvbiI6bnVsbCwiYWxhcm1TbmFwVXJsIjpudWxsLCJhbGFybVRodW1JbWdVcmwiOm51bGwsImFsYXJtR3JvdXAiOiI1IiwiYWxhcm1Hcm91cE5hbWUiOiLop4bpopHotKjph4/mo4DmtYvlkYroraYiLCJhbGFybUdyb3VwTmFtZUVuIjpudWxsLCJhbGFybVR5cGUiOiJBTEFSTV9WSURFT19CUklHSFQiLCJhbGFybVR5cGVOYW1lIjoi6KeG6aKR5Lqu5bqm5byC5bi45ZGK6K2mIiwiYWxhcm1MZXZlbCI6MiwiYWxhcm1MZXZlbE5hbWUiOiLntKfmgKUiLCJzb3VyY2VUeXBlIjoxLCJhbGFybVRpbWUiOiIyMDIzLTA5LTE4IDEyOjQxOjE5IiwiY2xlYXJUaW1lIjpudWxsLCJhbGFybVN0YXRlIjoxLCJjaGVja1N0YXRlIjowLCJjb25maXJtU3RhdGUiOjAsImNvbmZpcm1Vc2VySWQiOm51bGwsImNvbmZpcm1Vc2VyTmFtZSI6bnVsbCwiYWxhcm1Mb2NhdGUiOiIyMzBvbnZpZi3lronoo4XkvY3nva4iLCJsb25naXR1ZGUiOjExNi4zOTIyMjg1MjA2MDAxNiwibGF0aXR1ZGUiOjM5LjkwNzI1NTYxNTk4MzMsInBhcmVudHMiOiIwLDYsIiwicmVtYXJrIjpudWxsLCJ0ZW5hbnRJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAwMDAwMDAwIiwiZmlsZUxpc3QiOm51bGwsImFsYXJtQ29uZmlybUluZm8iOm51bGwsImFkZGl0aW9uIjpudWxsLCJwcmVzZXRJZCI6bnVsbCwicHJlc2V0TmFtZSI6bnVsbCwiZGVmZW5jZUFyZWFObyI6bnVsbCwiZmFjZVBob3RvIjpudWxsLCJzaW1pbGFyaXR5IjpudWxsLCJhbGFybUxldmVsQ29sb3IiOiIjZWYwNDA0IiwidGltZXN0YW1wIjoiMTY5NTAxMjA3OTAzOCIsInNob3dTdGF0dXMiOiIxIiwic2NlbmVOYW1lIjpudWxsLCJzY2VuZSI6bnVsbCwiZGlzYXBwZWFyVGltZSI6IjMwIiwicGVyc29uSWQiOm51bGwsInNpdHVhdGlvbkFuYWx5c2lzIjpudWxsLCJzeXN0ZW1Wb2ljZVVybCI6bnVsbH0=',
    //   })
    // }, 10000)
  },
  methods: {
    handleGoBack() {
      this.isHome = true
      this.$EventBus.$emit('reset')
    },
    handleGoLinkage(alarmInfo) {
      this.alarmInfo = { ...alarmInfo }
      this.$nextTick(() => {
        if (this.$refs.linkage) {
          this.$refs.linkage.resetAll()
        }
        this.isHome = false
      })
      // getGuardHitInfo({ alarmId: alarmInfo.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //     if (res.guardHitInfo && Object.keys(res.guardHitInfo).length) {
      //       this.alarmInfo = { ...alarmInfo, ...res.guardHitInfo, alarmId: alarmInfo.alarmId }
      //       this.isHome = false
      //     } else {
      //       this.$message.warning(this.$t('public.empty'))
      //     }
      //     // console.log(item)
      //   }
      // })
    },
    handleAlarmDetail(detail) {
      this.bigCardVisible = true
      this.alarmData = { ...detail }
    },
    closeIconMethod() {
      this.bigCardVisible = false
      this.alarmData = {}
    },
    // 处理成功
    handleRight() {
      this.$EventBus.$emit('updateData')
      // this.handleCheckData(this.checkData)
    },
    handleToggle() {
      this.toggle = !this.toggle
    },
    //获取所有物联设备
    getAllIotDevice() {
      getAlarmCamera({
        deviceType: 1,
        mapType: 2,
      }).then((res) => {
        if (res.resultCode == 0) {
          this.scsDeviceInfoList = res.resultList.filter((item) => {
            item.deviceType = 1
            return item.latitude && item.longitude
          })
          this.allDevice = res.resultList
          //   console.log('scsDeviceInfoList', this.scsDeviceInfoList)
          getIotDevList({}).then((res2) => {
            if (res2.resultCode == 0) {
              res2.deviceList = res2.deviceList.filter((d) => {
                return d.latitude && d.longitude
              })
              this.scsDeviceInfoList = this.scsDeviceInfoList.concat(
                res2.deviceList.map((d) => {
                  return {
                    latitude: d.latitude,
                    longitude: d.longitude,
                    altitude: d.altitude,
                    deviceId: d.deviceId,
                    deviceName: d.name,
                    status: d.platType == 63 && d.module == 2 ? 1 : d.connect, //在离线
                    subStatus: d.status, //设备开关
                    deviceType: d.module == 1 ? 2 : 3, //门禁或者道闸
                    platType: d.platType,
                    platId: d.platId,
                    productId: d.productId,
                  }
                })
              )
            }
            // console.log('scsDeviceInfoList', this.scsDeviceInfoList)
            if (this.mapType == 1 && !this.isShowImg) {
              if (AllcamMap.map) {
                AllcamMap.map.loadIotDeviceIcon(this.scsDeviceInfoList, true)
                this.addLine(AllcamMap.map)
              }
            }
          })
        }
      })
    },
    //获取区域列表
    getAreaList() {
      getMyAreaList({}).then((res) => {
        if (res.resultCode == 0) {
          let areaList = res.resultList
          if (res.resultList.length > 0) {
            areaList.forEach((item) => {
              item.coordinates = JSON.parse(item.coordinates)
            })
            console.log(this.mapType == 1, !this.isShowImg, AllcamMap.map)
            if (this.mapType == 1 && !this.isShowImg) {
              if (AllcamMap.map) {
                AllcamMap.map.loadplotRetangle(areaList, true)
                this.addLine(AllcamMap.map)
              }
            }
          }
        }
      })
    },
    //获取首页需要模块
    getModule() {
      getHomePageModulePosition({}).then((res) => {
        // this.moduleSet = res.indexModuleInfos
        const leftModule = []
        const rightModule = []
        if (res.indexModuleInfos && res.indexModuleInfos.length) {
          let indexModule = res.indexModuleInfos.filter((item) => item.name !== 'keyMonitor')
          for (let i = 0; i < indexModule.length; i++) {
            if (indexModule[i].position && indexModule[i].position.slice(0, 1) == '1') {
              leftModule.push(indexModule[i])
            }
            if (indexModule[i].position && indexModule[i].position.slice(0, 1) == '2') {
              rightModule.push(indexModule[i])
            }
          }
          this.leftModule = leftModule
          this.rightModule = rightModule
          // console.log('leftModule', leftModule)
          // console.log('rightModule', rightModule)
        }
      })
    },
    //首页的电子围栏
    addLine(map) {
      let locations2 = []
      let resdata = {
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
      }
      //绘制防区
      getDefenceAreaList(resdata).then((res) => {
        if (res.resultCode == 0) {
          this.defenceAreaList = res.defenceAreaList
          let array = res.defenceAreaList
          for (let l = 0; l < array.length; l++) {
            let locationArg3 = [
              (array[l].locationArgs[0].longitude + array[l].locationArgs[1].longitude) / 2,
              (array[l].locationArgs[0].latitude + array[l].locationArgs[1].latitude) / 2,
              5,
            ]
            //画防区号
            if (AllcamMap.map) {
              AllcamMap.map.plotMarker(
                {
                  style: {
                    image: `/static/images/number${array[l].defenceAreaNo}.png`,
                    scale: 0.15,
                  },
                  arttr: {
                    id: '',
                  },
                },
                locationArg3
              )
            }
          }
          //画防区线，要两个经纬度，locationArgs长度为2
          for (let k = 0; k < array.length; k++) {
            for (let i in array[k].locationArgs) {
              let locationArgsArray2 = [array[k].locationArgs[i].longitude, array[k].locationArgs[i].latitude, 5]
              locations2.push(locationArgsArray2)
            }
            if (AllcamMap.map) {
              AllcamMap.map.plotLine(
                {
                  style: {
                    color: '#66ff00', // 颜色，默认红色
                    width: 3, // 线条宽度 默认5
                    lineType: 'solid', // 线条类型 默认 solid
                    outline: false, // 线条描边 默认无
                    outlineColor: '#ffffff', // 线条描边颜色 默认白色
                    outlineWidth: '1.0', // 描边宽度 默认 1
                    opacity: 1, // 透明度 // 默认不透明
                  },
                  // attr 为线条自定义属性， 可以不写
                  attr: {
                    id: array[k].defenceAreaId, // 线条ID  ：update线条用
                    // name："线条" // 线条名称，
                  },
                  // 线段两端坐标，如果填写多个，则为折线
                },
                locations2
              )
              locations2 = [] //一条一条画，画完清空
            }
          }
        }
      })
    },
    handleWebSocketMessage(redata) {
      //数据接收
      if (redata.type == 'alarm') {
        let data = JSON.parse(Base64.decode(redata.content))
        console.log(data, '接收告警信息alarm')

        if (data.alarmType == 'ALARM_PERIMETER_INVASION') {
          console.log(data.defenceAreaNo, '闪动的防区号')
          for (let i = 0; i < this.defenceAreaList.length; i++) {
            if (
              this.defenceAreaList[i].defenceAreaNo == data.defenceAreaNo &&
              this.defenceAreaList[i].deviceId == data.deviceId
            ) {
              let label = true
              this.timer2 = setInterval(() => {
                if (AllcamMap.map) {
                  if (label) {
                    AllcamMap.map.updatePlotStyle(this.defenceAreaList[i].defenceAreaId, {
                      color: '#FF0000',
                    })
                  } else {
                    AllcamMap.map.updatePlotStyle(this.defenceAreaList[i].defenceAreaId, {
                      color: '#00FF00',
                    })
                  }
                }

                label = !label
                console.log(label, 'label')
              }, 500)
              this.lineItem = this.defenceAreaList[i].defenceAreaId
            }
          }
        }
      }
      if (redata.type == 'person_check') {
        let data = JSON.parse(Base64.decode(redata.content))
        console.log(data)
        this.$store.commit('person_inout', data)
      }
      if (redata.type == 'vehicle_check') {
        let data = JSON.parse(Base64.decode(redata.content))
        console.log(data)
        this.$store.commit('vehicle_inout', data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.index_detail {
  max-height: 100vh;
  top: 45%;
  transform: translateY(0, -50%);
  z-index: 9998;
  pointer-events: auto;
  background: transparent;
  ::v-deep.infoDiv {
    width: 960px;
  }
}
.show-collapse {
  display: block !important;
}
.hidden-left {
  left: -480px !important;
}
.hidden-right {
  right: -480px !important;
}
.flex-column {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.screen {
  // width: 100%;
  // height: 100%;
  // height: calc(100vh - 65px);
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  // z-index: 10;
  .main {
    width: 100%;
    //min-height: 998px;
    height: 100%;
    position: relative;

    .title {
      width: 100%;
      height: 20px;
      position: relative;

      .title-info {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
        position: absolute;
        left: 15px;
        top: 10px;
      }

      img {
        position: absolute;
        left: 80px;
        top: 10px;
      }
    }
  }
  .left-wrapper {
    height: calc(100% - 13px);
    position: absolute;
    padding-right: 50px;
    left: 18px;
    top: 13px;
    z-index: 99;
    transition: all 0.5s;
    pointer-events: auto;
    &:hover {
      .collapse {
        display: block;
      }
    }
    .collapse {
      display: none;
      pointer-events: auto;
      position: absolute;
      right: 0;
      top: 50%;
      width: 40px;
      transform: translateY(-50%);
      z-index: 9900;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .left {
      width: 480px;
      display: flex;
      flex-direction: column;
      height: 100%;
      pointer-events: auto;

      .name {
        flex: 1;
        min-height: 210px;
        margin-bottom: 10px;
      }

      .twoModule {
        min-height: 280px;
        max-height: 320px;
        margin-bottom: 10px;
      }

      .el-table {
        background: transparent;
      }

      .el-table tr {
        background: transparent;
        color: #f4f5fe;
        padding: 0;
        font-size: 12px;
        border: none !important;
      }

      .el-table .cell {
        color: #f4f5fe;
        font-size: 12px;
      }

      .el-table td {
        background: transparent;
        color: #f4f5fe;
        font-size: 12px;
        padding: 0;
        border: none !important;
      }

      .el-table th {
        background: transparent;
        color: #f4f5fe;
        font-size: 12px;
        padding: 0;
        border: none !important;
      }

      .el-table::before {
        background: none;
      }

      // .safety {
      //   width: 100%;
      //   height: 260px;
      //   margin-top: 11px;
      //   position: relative;
      //   border-radius: 8px;
      //   #barGraph {
      //     width: 100%;
      //     height: 240px;
      //     color: #e5e5e5;
      //   }
      // }
    }
  }

  .right-wrapper {
    height: calc(100% - 13px);
    position: absolute;
    right: 19px;
    padding-left: 60px;
    z-index: 89;
    top: 13px;
    transition: all 0.5s;
    pointer-events: auto;
    &:hover {
      .collapse {
        display: block;
      }
    }
    .collapse {
      display: none;
      pointer-events: auto;
      position: absolute;
      left: 0;
      top: 50%;
      width: 40px;
      transform: translateY(-50%);
      z-index: 9900;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .right {
      width: 480px;
      height: 100%;
      display: flex;
      flex-direction: column;

      pointer-events: auto;

      // .patrol {
      //   width: 480px;
      //   height: 242px;
      //   border-radius: 8px;
      //   position: relative;
      //   margin-top: 13px;
      //   #patrolGragh {
      //     width: 100%;
      //     height: 200px;
      //   }
      // }
      .name {
        flex: 1;
        min-height: 210px;
        margin-bottom: 10px;
      }

      .twoModule {
        min-height: 280px;
        max-height: 320px;
        margin-bottom: 20px;
      }

      .visitor {
        width: 480px;
        height: 253px;
        margin-top: 12px;
        border-radius: 8px;
        position: relative;

        #visterGragh {
          width: 100%;
          height: 240px;
        }

        .el-radio-group {
          position: absolute;
          right: 3%;
          top: 16px;
          z-index: 99;
        }

        .el-radio-button__inner {
          padding: 5px 15px;
          font-size: 12px;
          border-radius: 0;
          background: #202d3e;
          border: 1px #202d3e solid;
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: #9913ff;
          border-color: #9913ff;
        }
      }
    }
  }
}

#map {
  height: 100%;
}

#map {
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.popup-wrapper {
  background-image: url('/AISW/static/images/popup_bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center center;
  width: 691px;
  height: 413px;
  padding: 50px 60px;
  color: white;
}

.cesium-viewer-toolbar {
  display: none !important;
}
</style>
