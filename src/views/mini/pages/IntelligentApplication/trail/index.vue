<template>
  <div class="screen">
    <el-button type="primary" class="back-btn" v-if="item.showBackBtn" @click="backToLinkage">返回</el-button>
    <customCard :title="$t('public.track')" :collapse="showSearchExpansion" :isShow="isShow">
      <div class="person-search">
        <div class="search-type">
          <el-radio-group v-model="trackType" @change="handleChangeType">
            <el-radio-button :label="1">{{ $t('public.personnel') }}{{ $t('public.track') }}</el-radio-button>
            <el-radio-button :label="2">{{ $t('public.vehicle') }}{{ $t('public.track') }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="person-main">
          <personByImage
            @change-type="handleChangeType"
            :item="item"
            @open-track="handleOpenTrack"
            @showTimeLine="handleOpenTimeLine"
            @reset="handleRest"
            v-if="trackType == 1"
          ></personByImage>
          <carTrailSearch
            @change-type="handleChangeType"
            :item="item"
            @showTimeLine="handleOpenTimeLine"
            @open-track="handleOpenTrack"
            @reset="handleRest"
            v-else
          ></carTrailSearch>
        </div>
      </div>
    </customCard>
    <div class="left" v-if="!timelineVisible && trackListInfo.length">
      <!--    <div class="left">-->
      <div class="track-wrapper">
        <div class="total" @click="handleSelectDialog">
          {{ $t('application.trackTotal', { num: trackListInfo.length }) }}
        </div>
        <el-button
          v-if="(mapType == 1 && !isShowImg) || (mapType == 0 && !isShowImg)"
          class="btn"
          @click="handleBack"
          :disabled="trackListInfo.length < 2 || !!playState"
          >{{ playState == 0 ? $t('public.play') : $t('public.playing') }}</el-button
        >
      </div>
    </div>
    <track-detail
      :data="trackDetail"
      :camera-name="currentName"
      @close="handleCloseTrackDialog"
      @showDetail="handleDetail"
      v-if="trackDetailListDialog && trackDetail.length"
    ></track-detail>
    <resultExpansion
      class="componentPos1"
      :data="trackListInfo"
      :searchType="searchType"
      @showDetail="handleDetail"
      @close="handleCloseResult"
      @track="handleReplayTrack"
      v-if="showSearchExpansion && !trackDetailListDialog"
    ></resultExpansion>
    <timeline :visible="timelineVisible" @detail="handleDetail" :data="trackInfos" @close="handleCloseTrack">
    </timeline>
    <CusDialog
      :title="$t('public.detail')"
      isDetail
      appendToBody
      :visible="showDetailDialog"
      @close="handleCloseDetailDialog"
    >
      <div class="mainBox" slot="body">
        <!-- 左侧 -->
        <div class="left">
          <!-- <div class="video">
              <img v-if="detailRow.detectUrl" v-viewer :src="detailRow.detectUrl" alt="" />
            </div> -->
          <div class="video">
            <div class="capture">
              <p>{{ $t('alarm.panorama') }}</p>
              <img class="captureImg" v-viewer :src="detailRow.captureUrl" alt="" />
              <p>
                <a :href="detailRow.captureUrl" target="blank">{{ $t('login.download') }}</a>
              </p>
            </div>
            <div class="detect">
              <p>{{ $t('alarm.snapshot') }}</p>
              <img v-viewer :src="detailRow.detectUrl" alt="" />
              <p>
                <a :href="detailRow.detectUrl" target="blank">{{ $t('login.download') }}</a>
              </p>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="right">
          <!-- 图片对比部分 -->
          <div class="item-wrapper">
            <div class="title">{{ $t('public.capture') }}</div>
            <div class="item-content">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">
                  {{ $t('application.deviceName') }}
                </div>
                <div class="item-value" :title="detailRow.cameraName">{{ detailRow.cameraName }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">
                  {{ $t('application.devicePos') }}
                </div>
                <div
                  class="item-value"
                  :title="detailRow.snapLocation ? detailRow.snapLocation : detailRow.installLocate"
                >
                  {{
                    detailRow.snapLocation
                      ? detailRow.snapLocation
                      : detailRow.installLocate
                      ? detailRow.installLocate
                      : '未知'
                  }}
                </div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">
                  {{ $t('application.captureTime') }}
                </div>
                <div class="item-value">{{ detailRow.captureTime }}</div>
              </div>
            </div>
          </div>
          <!-- 人 -->
          <div class="item-wrapper" v-if="trackType == 1">
            <div class="title">{{ $t('application.faceInfo') }}</div>
            <div class="item-content">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.sex') }}</div>
                <div class="item-value">{{ getSex(detailRow.gender) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.age') }}</div>
                <div class="item-value">{{ getAge(detailRow.age) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.withHat') }}</div>
                <div class="item-value">{{ getHat(detailRow.hat) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">
                  {{ $t('application.withGlass') }}
                </div>
                <div class="item-value">
                  {{ getGlass(detailRow.eyeGlass) }}
                </div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.withMask') }}</div>
                <div class="item-value">{{ getMask(detailRow.mouthMask) }}</div>
              </div>
            </div>
          </div>
          <!-- 车 -->
          <div class="item-wrapper" v-if="trackType == 2">
            <div class="title">{{ $t('application.carInfo') }}</div>
            <div class="item-content">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.plateNum') }}</div>
                <div class="item-value">{{ detailRow.plateNumber }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.carType') }}</div>
                <div class="item-value">{{ getCarTypr(detailRow.carType) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.carColor') }}</div>
                <div class="item-value">{{ getCarColor(detailRow.carColor) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">
                  {{ $t('application.plateColor') }}
                </div>
                <div class="item-value">{{ getPlateColor(detailRow.plateColor) }}</div>
              </div>
            </div>
          </div>
          <div class="video-btn-group">
            <!-- <div @click="toGuiji(detailRow)" class="btn" v-if="trackType == 1">
                <img src="../../../../../assets/faceSearch/jiansuo.png" alt="" />
                <span>{{ $t('application.personnelTrack') }}</span>
              </div>
              <div @click="toGuiji(detailRow)" class="btn" v-if="trackType == 2">
                <img src="../../../../../assets/faceSearch/jiansuo.png" alt="" />
                <span>{{ $t('application.vehicleTrack') }}</span>
              </div> -->
            <div @click="goToVideo(detailRow)" class="btn">
              <img src="../../../../../assets/faceSearch/jiansuo.png" alt="" />
              <span>{{ $t('application.captureRecord') }}</span>
            </div>
          </div>
        </div>
      </div>
    </CusDialog>
  </div>
</template>

<script>
import customCard from '../components/custom-card'
import personByImage from './component/person-by-image'
import carTrailSearch from './component/car-trail-search'
import trackDetail from './component/track-detail'
import resultExpansion from '../components/resultExpansion'
import intelligentMixin from '../mixin/intelligentMixin'
import timeline from '../../../../../components/timeline'
import { getGuardHitInfo, vehicleDictionary } from '../../../../../utils/api'
import { AllcamMap } from '../../../../../utils/map/AllcamMap'
import Dayjs from '../../../../../utils/Dayjs'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  name: 'index',
  components: {
    customCard,
    personByImage,
    carTrailSearch,
    trackDetail,
    resultExpansion,
    timeline,
  },
  mixins: [intelligentMixin, VideoScreen],
  data() {
    return {
      trackType: 1, //人员轨迹，车辆轨迹
      searchType: 0,
      isTrackDetail: false,
      timelineVisible: false,
      showDetailDialog: false,
      showSearchExpansion: false,
      trackDetailListDialog: true,
      currentName: '',
      trackDetail: [],
      trackInfos: [],
      item: {},
      detailRow: {},
      trackListInfo: [],
      playState: 0,
      ageList: [
        {
          label: this.$t('public.child'),
          value: 1,
        },
        {
          label: this.$t('public.juvenile'),
          value: 2,
        },
        {
          label: this.$t('public.youth'),
          value: 3,
        },
        {
          label: this.$t('public.middleAged'),
          value: 4,
        },
        {
          label: this.$t('public.elderly'),
          value: 5,
        },
      ],
      vehicleTypeList: [],
      vehicleColorList: [],
      plateColorList: [],
      systemType: '',
    }
  },
  beforeDestroy() {
    this.handleTrackOper('remove')
    this.$EventBus.$off('trackInfo')
    this.$EventBus.$off('getStatus')
    this.$EventBus.$off('setTrailItem')
  },
  computed: {
    isShowImg() {
      console.log(localStorage.getItem('showimg'))
      return localStorage.getItem('showimg') == 'false'
    },
    mapType() {
      return this.$store.state.mapType
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    isShow() {
      return this.showSearchExpansion || (this.showSearchExpansion && !this.trackDetailListDialog)
    },
  },
  created() {
    // 判断系统类型
    let type = this.$store.state.g_platType
    if (type == 5 || type == 16) {
      // 3800
      this.systemType = '-3800'
    } else if (type == 14) {
      // 1800
      this.systemType = '-1800'
    } else {
      // nvr800
      this.systemType = '-nvr800'
    }
    this.$EventBus.$on('renlianjiasuo', (item) => {
      console.log(this.$route.path)
      this.item = {
        ...item,
      }
      console.log(item)
      this.handleClearTrack()
      this.trackDetailListDialog = false
      this.showSearchExpansion = false
      this.isTrackDetail = false
      this.trackDetail = []
    })
    this.$EventBus.$on('trackInfo', (info) => {
      console.log(info, '1')
      console.log(this.aggregationInfos, '2')
      if (!this.aggregationInfos) {
        this.$message.warning(this.$t('application.trackFailed'))
        return
      }
      if (AllcamMap.map) {
        if (info.type == 'cartrackPoint') {
          this.aggregationInfos.map((item) => {
            item.cameraId = item.cameraId ? item.cameraId : item.cameraIds
            if (item.cameraId === info.trackListInfo.cameraId) {
              this.trackDetail = item.results
              console.log(this.trackDetail)
              if (this.trackDetail.length) {
                this.trackDetailListDialog = true
                this.showSearchExpansion = true

                this.currentName = info.trackListInfo.snapLocation
                  ? info.trackListInfo.snapLocation
                  : info.trackListInfo.installLocate
                  ? info.trackListInfo.installLocate
                  : this.$t('public.unknown')
              } else {
                this.currentName = ''
                this.$message.warning(this.$t('public.checkEmpty'))
              }
            }
          })
        } else {
          this.aggregationInfos.map((item) => {
            if (item.cameraIds === info.trackListInfo.cameraId) {
              this.trackDetail = item.results
              if (this.trackDetail.length) {
                this.trackDetailListDialog = true
                this.showSearchExpansion = true
                this.currentName = info.trackListInfo.snapLocation
                  ? info.trackListInfo.snapLocation
                  : info.trackListInfo.installLocate
                  ? info.trackListInfo.installLocate
                  : this.$t('public.unknown')
              } else {
                this.currentName = ''
                this.$message.warning(this.$t('public.checkEmpty'))
              }
            }
          })
        }
      } else {
        console.log(info)
        this.aggregationInfos.map((item) => {
          // if (item.cameraId) item.cameraIds = item.cameraId
          if (item.cameraIds === info.cameraId) {
            this.trackDetail = item.results
            if (this.trackDetail.length) {
              this.trackDetailListDialog = true
              this.showSearchExpansion = true
              this.currentName = info.snapLocation
                ? info.snapLocation
                : info.installLocate
                ? info.installLocate
                : this.$t('public.unknown')
            } else {
              this.currentName = ''
              this.$message.warning(this.$t('public.checkEmpty'))
            }
          }
        })
      }
    })
    this.$EventBus.$on('getStatus', this.setPlayState)
    this.getVehicleDictionary()
    if (sessionStorage.getItem('cuType') == 1) {
      // qt端
      this.$EventBus.$on('setTrailItem', (item) => {
        this.trackType = item.trackType
        this.item = item
        this.handleRest()
      })
      let trailItem = JSON.parse(sessionStorage.getItem('trailItem'))
      if (trailItem) {
        this.trackType = trailItem.trackType
        this.item = trailItem
        this.handleRest()
        sessionStorage.removeItem('trailItem')
      }
    } else {
      // web端
      if (this.$route.params && this.$route.params.trackType) {
        this.trackType = this.$route.params.trackType
        this.item = { ...this.$route.params }
      } else {
        this.item = {}
      }
    }
  },
  methods: {
    backToLinkage() {
      if (sessionStorage.getItem('cuType') == 1) {
        this.item.alarmId
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/homepage',
            menuName: this.isZh ? '综合态势' : '综合态势',
            params: JSON.stringify({
              alarmId: this.item.alarmId,
              alarmTime: this.item.alarmId,
              extra: this.item.extra,
              replayAlarm: true,
              optType: 'toLinkage',
            }),
          })
        )
      } else {
        this.$router.push({
          name: 'homepage',
          params: {
            alarmId: this.item.alarmId,
            alarmTime: this.item.alarmId,
            extra: this.item.extra,
            replayAlarm: true,
          },
        })
      }
    },
    handleCloseDetailDialog() {
      this.showDetailDialog = false
      this.$nextTick(() => {
        this.detailRow = {}
      })
    },
    handleDetail(item) {
      console.log(item)
      this.detailRow = { ...item }
      this.showDetailDialog = true
      // getGuardHitInfo({ alarmId: item.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //     this.detailRow = { ...item, ...res.guardHitInfo }
      //     this.showDetailDialog = true
      //   }
      // })
    },
    handleOpenTimeLine(info) {
      this.trackInfos = info
      this.timelineVisible = true
    },
    handleCloseTrack() {
      this.timelineVisible = false
      this.trackInfos = []
    },
    handleCloseTrackDialog() {
      this.trackDetailListDialog = false
      this.showSearchExpansion = false
      this.trackDetail = []
    },
    handleSelectDialog() {
      this.searchType = 3
      this.trackDetailListDialog = false
      this.showSearchExpansion = true
    },
    handleCloseResult() {
      this.searchType = 1
      this.showSearchExpansion = false
    },
    handleRest() {
      this.trackListInfo = []
      this.isTrackDetail = false
      this.showSearchExpansion = false
      this.handleTrackOper('remove')
    },
    handleChangeType(type) {
      this.trackType = type
      this.item = {}
      this.handleRest()
    },
    handleBack() {
      if (AllcamMap.map) {
        this.handleTrackOper()
      } else {
        this.$EventBus.$emit('trail-play')
      }
    },
    handleReplayTrack(data, type) {
      if (data.length) {
        console.log(123123, data, type)
        this.handleCloseResult()
        //生成轨迹
        let result = []
        let temp = []
        let tempIds = []
        this.aggregationInfos.map((i) => {
          let p = {}
          data.map((j) => {
            if (i.cameraIds == j.cameraId) {
              i.results.map((item) => {
                if (item.captureTime == j.captureTime) {
                  if (tempIds.indexOf(item.cameraId) == -1) {
                    tempIds.push(i.cameraIds)
                    p.cameraIds = i.cameraIds
                    p.results = [j]
                  } else {
                    p.results.push(j)
                  }
                }
              })
            }
          })
          if (Object.keys(p).length) {
            temp.push(p)
          }
        })
        data.map((item) => {
          result.push(item)
        })
        console.log('temp', temp)
        this.aggregationInfos = temp
        this.trackListInfo = result
        this.searchType = 0
        if (this.mapType == 1 && !this.isShowImg) {
          if (AllcamMap.map) {
            this.handleTrackOper('remove')
            // 注册检测动画状态函数
            AllcamMap.map.TrackAnimal.on('getState', this.setPlayState)
            AllcamMap.map.TrackAnimal.init(type, this.trackListInfo)
            this.$message.success(this.$t('application.trackSuccess'))
          }
        } else if (this.mapType == 0 && !this.isShowImg) {
          //2D地图
          this.$EventBus.$emit('clear-markers')
          this.$EventBus.$emit('initPathSimplifier', this.trackListInfo, type)
        } else {
          //图片
          console.log(123123123)
          //   this.trackListInfo.map((item) => {
          //     item.time = Dayjs(item.captureTime).format('YYYY-MM-DD')
          //   })
          //   this.trackInfos = this.trackListInfo
          //   this.timelineVisible = true
          //   this.showResultDialog = false

          //   ----上面代码为之前图片模式展示方式----

          this.$EventBus.$emit('drawLine', type, this.trackListInfo)
        }
      } else {
        this.$message.warning(this.$t('application.noSelect'))
      }
    },
    /**
     * data 点位集合
     * aggregationInfos 聚合点位
     */
    handleOpenTrack(data, aggregationInfos, type) {
      console.log(aggregationInfos, data)
      if (!data.length || !aggregationInfos.length) {
        this.handleTrackOper('remove')
        return
      }
      this.trackListInfo = data
      this.aggregationInfos = aggregationInfos
      console.log(aggregationInfos, '点位集合')
      //判断是否图片
      if (!JSON.parse(localStorage.getItem('showimg'))) {
        //没有地图或者未显示地图就显示时间线轨迹
        this.trackListInfo.map((item) => {
          item.time = Dayjs(item.captureTime).format('YYYY-MM-DD')
        })
        this.trackInfos = this.trackListInfo
        this.timelineVisible = true
        this.showResultDialog = false
      } else {
        //判断地图类型
        if (this.mapType == 1) {
          //3D地图
          this.aggregationInfos = aggregationInfos
          //3绘制轨迹
          if (AllcamMap.map) {
            this.handleTrackOper('remove')
            // 注册检测动画状态函数
            AllcamMap.map.TrackAnimal.on('getState', this.setPlayState)
            AllcamMap.map.TrackAnimal.init(type, this.trackListInfo)
            this.$message.success(this.$t('application.trackSuccess'))
          }
        } else if (this.mapType == 2) {
          //2.5D地图
        } else if (this.mapType == 0) {
          //2D地图
          this.$EventBus.$emit('initPathSimplifier', this.trackListInfo, type)
        } else {
          //图片
          //   this.trackListInfo.map((item) => {
          //     item.time = Dayjs(item.captureTime).format('YYYY-MM-DD')
          //   })
          //   this.trackInfos = this.trackListInfo
          //   this.aggregationInfos = aggregationInfos
          //   this.timelineVisible = true
          //   this.showResultDialog = false
          //
          //   ----上面代码为之前图片模式展示方式----

          this.$EventBus.$emit('drawLine', type, this.trackListInfo)
        }
      }
      this.searchType = 0
      this.isTrackDetail = true
    },
    setPlayState(val) {
      this.playState = val
    },
    // 回显年龄段
    getAge(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      return this.ageList.find((a) => a.value == val)?.label
    },
    getSex(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.man') : this.$t('public.woman')
    },
    getHat(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.wearHat') : this.$t('public.noHat')
    },
    getGlass(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.glasses') : this.$t('public.withoutGlasses')
    },
    getMask(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.wearmask') : this.$t('public.withoutMask')
    },
    getCarTypr(val) {
      if (typeof val === 'undefined') return
      return this.vehicleTypeList.find((up) => up.value == val)?.name
    },
    getCarColor(val) {
      if (typeof val === 'undefined') return
      return this.vehicleColorList.find((up) => up.value == val)?.name
    },
    getPlateColor(val) {
      if (typeof val === 'undefined') return
      return this.plateColorList.find((up) => up.value == val)?.name
    },
    getVehicleDictionary() {
      vehicleDictionary({ type: 'acc-vehicle-color' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleColorList = res.dictionaryList
        }
      })
      vehicleDictionary({ type: 'acc-vehicle-type' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleTypeList = res.dictionaryList
        }
      })
      vehicleDictionary({ type: 'acc-plate-color' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.plateColorList = res.dictionaryList
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.back-btn {
  pointer-events: auto;
  position: absolute;
  top: 20px;
  left: 20px;
}
.mainBox {
  display: flex;
  background-color: #2a4a6b;
  .left {
    width: 400px;
    height: 400px;
    .video {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      color: #fff;
      .capture,
      .detect {
        width: 49%;
        img {
          width: 100%;
          height: 200px;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
      }
    }
  }
  .right {
    flex: 1;
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .item-wrapper {
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        color: #fff;
        margin-bottom: 15px;
      }
      .item {
        display: flex;
        margin-bottom: 10px;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        color: #d1d5db;
        .item-label {
          width: 90px;
          &.en {
            width: 120px;
          }
          &:after {
            content: '：';
          }
        }
        .item-value {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
    }
  }
  .video-btn-group {
    margin-top: 15px;
    box-sizing: border-box;
    width: 100%;
    color: #ffffff;
    display: flex;
    .btn {
      width: 33%;
      display: flex;
      align-items: center;
      background-color: #0cd8fa;
      margin-left: 10px;
      padding: 8px 5px;
      box-sizing: border-box;
      border-radius: 4px;
      justify-content: center;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      span {
        font-size: 18px;
      }
    }
  }
}
.detail-dialog {
  ::v-deep.el-dialog {
    background: url('../images/800.png') no-repeat;
    background-size: 100% 100%;
    box-shadow: none;
    .el-dialog__header {
      .el-dialog__title {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
.detail-position {
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.screen {
  .componentPos1 {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  .left {
    position: absolute;
    bottom: 50px;
    right: 600px;
    pointer-events: auto;
    color: #fff;
    .track-wrapper {
      display: flex;
      align-items: center;
      .total {
        font-size: 14px;
        cursor: pointer;
        margin-right: 30px;
        color: #00ccff;
      }
    }
    .btn {
      background-color: #00ccff;
      color: #fff;
      font-size: 14px;
      padding: 6px 15px;
      border-radius: 4px;
      cursor: pointer;
      &.is-disabled {
        cursor: no-drop;
        background: #ccc;
      }
    }
  }
}
.person-search {
  margin-top: 10px;
  width: 100%;
  height: 100%;
  .search-type {
    text-align: center;
    padding-bottom: 20px;
  }
  .person-main {
    width: 100%;
    height: calc(100% - 30px);
  }
  ::v-deep.el-radio-group {
    .el-radio-button__inner {
      width: 100%;
      line-height: 14px;
    }
    .el-radio-button {
      &:first-child .el-radio-button__inner {
        border-radius: 0;
      }
      &:last-child .el-radio-button__inner {
        border-radius: 0;
      }
    }
  }
  ::v-deep.el-form {
    .el-form-item__label {
      width: 100px;
    }
    .el-form-item__content {
      margin-left: 100px;
    }
  }
}
</style>
