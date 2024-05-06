<template>
  <div class="screen">
    <div class="alarm-linkage">
      <!-- 告警左边信息 -->
      <div class="linkage-left">
        <!-- 告警信息 -->
        <div class="linkage-card alarm-info">
          <div class="linkage-card-title">{{ $t('application.alarmInfo') }}</div>
          <div class="linkage-card-content">
            <!-- 告警基本信息 -->
            <div class="alarm-base-info">
              <el-form label-suffix=":">
                <!-- 告警类型 -->
                <el-form-item>
                  <div class="alarm-title-wrapper">
                    <div class="alarm-type">
                      {{ isZh ? info.alarmTypeName : info.alarmType || info.alarmTypeName }}
                    </div>
                    <div :class="setLevelClass(info.alarmLevel)">
                      {{ setAlarmLevel(info.alarmLevel) }}
                    </div>
                  </div>
                </el-form-item>
                <!-- 设备名称 -->
                <el-form-item :label="$t('application.deviceName')">
                  <div class="ellipsis" :title="info.alarmDevName">{{ info.alarmDevName }}</div>
                </el-form-item>
                <!-- 设备位置 -->
                <el-form-item :label="$t('linkage.alarmPos')">
                  <div class="ellipsis" :title="alarmLocate">{{ alarmLocate }}</div>
                </el-form-item>
                <!-- 告警时间 -->
                <el-form-item :label="$t('alarm.alarmTime')">
                  <div>{{ info.alarmTime }}</div>
                </el-form-item>
                <!-- 告警图片或者视频等 -->
                <template>
                  <div class="alarm-img">
                    <img
                      v-if="!!info.alarmSnapUrl && mediaType == 1"
                      v-viewer
                      :src="info.alarmSnapUrl ? info.alarmSnapUrl : emptyImg"
                      alt=""
                    />
                    <div ref="videoBox" v-else class="video-box">
                      <img src="./images/video.png" alt="" />
                      <span class="times" v-if="mediaType == 3 && seconds > 0"
                        >录像生成中，大约需要{{ seconds }}秒</span
                      >
                      <span
                        class="replayIcon"
                        v-else-if="playAgain"
                        @click="
                          playAgain = false
                          mediaType = 0
                          setVideo(3)
                        "
                      >
                        <i class="el-icon-video-play"></i
                      ></span>
                    </div>
                  </div>
                  <div class="alarmViewBtn">
                    <div
                      class="item"
                      v-if="!!info.alarmSnapUrl"
                      @click="setVideo(1)"
                      :class="mediaType == 1 ? 'active' : ''"
                    >
                      告警图片
                    </div>
                    <div class="item" @click="setVideo(2)" :class="mediaType == 2 ? 'active' : ''">实时视频</div>
                    <!-- 设备质量告警得不需要录像按钮 -->
                    <div
                      class="item"
                      @click="setVideo(3)"
                      :class="mediaType == 3 ? 'active' : ''"
                      v-if="sceneType !== 'video_quality_alarm'"
                    >
                      告警录像
                    </div>
                  </div>
                  <!-- <el-form-item :label="$t('linkage.live')">
                    <el-button type="primary" @click="handleRealTimePlay(info.deviceId, info.alarmDevName)">{{
                      $t('linkage.play')
                    }}</el-button>
                  </el-form-item> -->
                </template>
                <!-- 跳转安防日志 -->
                <el-form-item>
                  <div>
                    {{ $t('linkage.more') }}，
                    <span class="go-alarm" @click="handleGoToAlarm">
                      {{ $t('linkage.goAlarm') }}
                      <img src="./images/accessIn.png" alt="" />
                    </span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <!-- 告警处理信息 -->
            <div class="alarm-worksheet">
              <el-form
                ref="handleForm"
                :rules="handleFormRules"
                :model="handleForm"
                label-suffix=":"
                :label-width="isZh ? '100px' : '150px'"
              >
                <el-form-item :label="$t('alarm.handleType')">
                  <el-radio-group @change="handleChangeProcessMode" v-model="handleForm.processMode">
                    <el-radio :label="0" :disabled="workSheetInfoStatus">{{ $t('alarm.handle') }}</el-radio>
                    <el-radio :label="1" :disabled="workSheetInfoStatus">{{ $t('alarm.workOrder') }}</el-radio>
                    <el-radio :label="-1" :disabled="workSheetInfoStatus">{{ $t('alarm.mistake') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('alarm.proDesc')" prop="remark" v-if="handleForm.processMode == -1">
                  <el-input
                    type="textarea"
                    v-model="handleForm.remark"
                    :disabled="modifyEdit"
                    :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.proDesc') }) : ''"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('alarm.handleContent')" prop="description" v-if="handleForm.processMode == 0">
                  <el-input
                    type="textarea"
                    :disabled="modifyEdit"
                    v-model="handleForm.description"
                    :placeholder="!modifyEdit ? $t('alarm.handleContent') : ''"
                  ></el-input>
                </el-form-item>
                <template v-if="handleForm.processMode == 1">
                  <el-form-item :label="$t('alarm.workOrderName')" prop="workSheetName">
                    <el-input
                      :disabled="modifyEdit"
                      v-model="handleForm.workSheetName"
                      :placeholder="$t('alarm.workOrderName')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('alarm.workOrderLevel')" prop="workSheetLevel">
                    <el-select
                      v-model="handleForm.workSheetLevel"
                      :disabled="modifyEdit"
                      :placeholder="$t('public.placeholderSelect', { type: $t('alarm.workOrderLevel') })"
                    >
                      <el-option
                        v-for="(item, index) in alarmLevel"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('alarm.proDesc')" prop="description">
                    <el-input
                      type="textarea"
                      :disabled="modifyEdit"
                      v-model="handleForm.description"
                      :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.proDesc') }) : ''"
                    ></el-input>
                  </el-form-item>
                </template>
                <el-form-item>
                  <el-button type="primary" v-if="!modifyEdit" @click="submitEventDetail">{{
                    $t('public.submit')
                  }}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 告警右边信息 -->
      <div class="linkage-right">
        <!-- 告警预案联动 -->
        <div class="linkage-card linkage-info">
          <div class="linkage-card-title">{{ $t('linkage.linkage') }}</div>
          <div class="linkage-card-content">
            <template v-if="linkageAction.length || iotDeviceInfoList.length">
              <ul class="video-type-wrapper">
                <li v-if="linkageAction.length" @click="showType = 1" :class="[showType == 1 ? 'active' : '']">
                  {{ $t('linkage.livePlay') }}
                </li>
                <li v-if="iotDeviceInfoList.length" @click="showType = 2" :class="[showType == 2 ? 'active' : '']">
                  {{ $t('linkage.door') }}
                </li>
              </ul>
              <!-- 摄像机 -->
              <div class="linkbox-wrapper" v-show="showType == 1">
                <ul class="video-list-wrapper" v-if="linkageAction.length">
                  <li
                    class="video-item"
                    :class="item.status != 1 ? 'offline' : ''"
                    v-for="(item, index) in linkageAction"
                    :key="index"
                  >
                    <div class="device-name" :title="item.cameraName">
                      <img
                        class="icon"
                        :src="item.status != 1 ? require('./images/c_offline.png') : require('./images/c_online.png')"
                        alt=""
                      />
                      <span class="name">{{ item.cameraName }}</span>
                    </div>
                    <div class="device-status">
                      {{ item.status == 1 ? $t('application.online') : $t('application.offline') }}
                    </div>
                    <div class="device-opt">
                      <span
                        v-if="item.status == 1"
                        class="el-icon-video-play"
                        @click="handleRealTimePlay(item.cameraId, item.cameraName, index + 1)"
                      ></span>
                    </div>
                  </li>
                </ul>
                <div class="no-data-wrapper" v-else>
                  <div class="empty">
                    <img class="empty-img" src="./images/no-data.png" alt="" />
                    <span>{{ $t('linkage.noLink') }}</span>
                  </div>
                </div>
              </div>
              <!-- 门禁 -->
              <div class="linkbox-wrapper" v-show="showType == 2">
                <template v-if="iotDeviceInfoList.length">
                  <ul class="video-list-wrapper wrapper2">
                    <li
                      class="video-item"
                      :class="item.connect != 1 ? 'offline' : ''"
                      v-for="(item, index) in iotDeviceInfoList"
                      :key="index"
                    >
                      <div class="device-name" :title="item.name">
                        <img
                          class="icon"
                          :src="item.connect != 1 ? require('./images/access-off.png') : require('./images/access.png')"
                          alt=""
                        />
                        <span class="name">{{ item.name }}</span>
                      </div>
                      <div class="device-opt">
                        <el-select v-model="item.workMode2" @change="doorCtrl(item)" :disabled="item.connect != 1">
                          <el-option label="常开" :value="2"></el-option>
                          <el-option label="常关" :value="1"></el-option>
                          <el-option label="正常" :value="0"></el-option>
                        </el-select>
                      </div>
                    </li>
                  </ul>
                  <template v-if="iotDeviceInfoList.length > 1">
                    <div class="opt-row">
                      <span style="flex: 0.4">门禁操作</span>
                      <el-button type="primary" @click="operateAll('open')">全部常开</el-button>
                      <el-button type="primary" @click="operateAll('close')">全部常关</el-button>
                      <el-button type="primary" @click="operateAll('normal')">全部正常</el-button>
                    </div>
                  </template>
                </template>

                <div class="no-data-wrapper" v-else>
                  <div class="empty">
                    <img class="empty-img" src="./images/no-data.png" alt="" />
                    <span>{{ $t('linkage.noLink') }}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-data-wrapper">
                <div class="empty">
                  <img class="empty-img" src="./images/no-data.png" alt="" />
                  <span>{{ $t('linkage.noLink') }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- 告警预案 -->
        <div class="linkage-card plan-info">
          <div class="linkage-card-title">{{ $t('linkage.plan') }}</div>
          <div class="linkage-card-content">
            <div class="linkage-step-wrapper" v-if="planStepInfoList.length">
              <el-timeline class="custom-timeline">
                <el-timeline-item
                  v-for="(activity, index) in planStepInfoList"
                  :key="index"
                  color="#3399ff"
                  hide-timestamp
                  :timestamp="activity.planStepName"
                >
                  <div class="step-wrapper">
                    <div class="step-name">{{ activity.planStepName }}</div>
                    <div class="step-desc" v-html="activity.planStepDesc"></div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div class="no-data-wrapper" v-else>
              <div class="empty">
                <img class="empty-img" src="./images/no-data.png" alt="" />
                <span>{{ $t('linkage.noPlan') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="go-back">
        <el-button @click="handleGoBack" size="small" type="primary">{{ $t('error.back') }}</el-button>
        <!-- 人或车 -->
        <el-button @click="handleTrack" v-if="!!info.alarmSnapUrl" size="small" type="primary">{{
          $t('application.analysis')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addWorkSheet,
  confirmEcsAlarm,
  getLinkagePlanByDeviceId,
  getWorkSheetInfo,
  controlIotDev,
  batchControlIotDev,
  getAlarmType,
} from '../../../utils/api'
// import QTPlayer from '../../../utils/video-play'
// import { mapState, mapActions } from 'vuex'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  name: 'index',
  mixins: [VideoScreen],
  props: {
    info: {
      type: Object,
      default() {
        return {}
      },
    },
    cameraList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mediaType: 1,
      alarmLocate: '', //告警位置
      emptyImg: require('./images/empty.png'),
      workSheetInfoStatus: false,
      modifyEdit: false,
      // videoType: 'live',
      handleForm: {
        workSheetName: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
      },
      playList: [],
      handleFormRules: {
        workSheetName: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('public.placeholderEnter', { type: this.$t('alarm.workOrderName') }),
          },
          {
            max: 30,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.workOrderName'), size: 30 }),
          },
        ],
        workSheetType: [
          {
            required: true,
            trigger: 'change',
            message: '工单类型必选',
          },
        ],
        workSheetLevel: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('public.placeholderSelect', { type: this.$t('alarm.workOrderLevel') }),
          },
        ],
        description: [
          {
            max: 100,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.proDesc'), size: 100 }),
          },
        ],
        remark: [
          {
            max: 100,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.proDesc'), size: 100 }),
          },
        ],
      },
      alarmLevel: [
        {
          value: 1,
          label: this.$t('home.level1'),
        },
        {
          value: 2,
          label: this.$t('home.level2'),
        },
        {
          value: 3,
          label: this.$t('home.level3'),
        },
        {
          value: 4,
          label: this.$t('home.level4'),
        },
      ],
      linkageAction: [],
      iotDeviceInfoList: [],
      planStepInfoList: [],
      cuType: sessionStorage.getItem('cuType'),
      seconds: 0,
      showType: 1,
      playAgain: false,
      requestId: null,
      videoPos: {
        leftTopX: 0,
        leftTopY: 0,
        rightBottomX: 0,
        rightBottomY: 0,
      },
      isCar: '',
      sceneType: '',
    }
  },
  watch: {
    videoPos: {
      handler() {
        this.updateWindowLocation({
          dialogId: this.info.deviceId,
          ...this.videoPos,
        })
      },
      deep: true,
    },
  },
  created() {
    // this.getSysDictData(['alarm-video-type'])
    this.alarmLocate = this.info.alarmLocate || this.info.installLocation || '未知'
    this.isCar = !!this.info.lpn
    this.getAlarmTypeScene()
  },
  mounted() {
    this.playList = []
    this.handleGetLinkagePlanByDeviceId()
    if (!this.info.alarmSnapUrl) {
      // 没有图片自动播放
      setTimeout(() => {
        this.setVideo(2)
      }, 1000)
    }
    window.addEventListener('beforeunload', () => {
      if (sessionStorage.getItem('cuType') == 1) {
        window.webkitProc('close-play-ts', JSON.stringify({}))
      }
    })
  },
  beforeDestroy() {
    this.handleClosePlayer()
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    // ...mapState({
    //   videoTypeList: (state) => state.dict['alarm-video-type'],
    // }),
  },
  methods: {
    // ...mapActions('dict', ['getSysDictData']),
    // 关闭视频窗口
    handleClosePlayer() {
      this.playList.forEach((cameraId) => {
        if (this.cuType == 1) {
          if (window.webkitProc) {
            window.webkitProc(
              'player_dialog_close',
              JSON.stringify({
                dialogId: 'dialogId' + cameraId,
              })
            )
          }
        } else {
          this.close_sdk_video(cameraId)
        }
      })
      this.playList = []
    },
    // 带参 跳转告警页面
    handleGoToAlarm() {
      this.handleClosePlayer()
      // 根据cutype 区分路由跳转或者发送指令qt跳转
      if (this.cuType == 1) {
        // qt
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/alarmpage',
            menuName: this.isZh ? '告警信息' : 'Alarm information',
            params: JSON.stringify({
              optType: 'alarmpage',
              deviceId: this.info.deviceId,
              deviceName: this.info.alarmDevName,
              devType: this.info.type,
            }),
          })
        )
      } else {
        this.$router.push({
          name: 'alarmpage',
          params: {
            deviceId: this.info.deviceId,
            deviceName: this.info.alarmDevName,
            devType: this.info.type,
          },
        })
      }
    },
    // 返回综合态势页面
    handleGoBack() {
      // 去掉播放框
      if (sessionStorage.getItem('cuType') == 1) {
        window.webkitProc('close-play-ts', JSON.stringify({}))
      }
      this.handleClosePlayer()
      this.$emit('goBack')
    },
    // 轨迹分析 需要判断是人还是车的告警
    handleTrack() {
      // 携带图片跳转轨迹页面
      if (this.cuType == 1) {
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/trail',
            menuName: this.isZh ? '动态轨迹' : 'Dynamic trajectory',
            params: JSON.stringify({
              trackType: this.isCar ? 2 : 1, //人员轨迹，车辆轨迹
              optType: 'trail',
              showBackBtn: true,
              detectUrl: this.info.alarmSnapUrl, //抓拍图
              alarmId: this.info.alarmId,
              alarmTime: this.info.alarmTime,
              extra: this.info,
            }),
          })
        )
      } else {
        this.handleClosePlayer()
        this.$emit('goBack')
        this.$router.push({
          name: 'trail',
          params: {
            trackType: this.isCar ? 2 : 1, //人员轨迹，车辆轨迹
            showBackBtn: true,
            detectUrl: this.info.alarmSnapUrl, //抓拍图
            alarmId: this.info.alarmId,
            alarmTime: this.info.alarmTime,
            extra: this.info,
          },
        })
      }
    },
    // 播放告警设备录像或者实时视频
    setVideo(type) {
      // if (this.cuType == 1) {
      //   this.mediaType = 1
      //   if (type == 2) {
      //     // 播放实时
      //     this.goToLive({
      //       cameraId: this.info.deviceId,
      //       cameraName: this.info.alarmDevName,
      //     })
      //   } else if (type == 3) {
      //     // 播放录像
      //     let alarmTime = new Date(this.info.alarmTime).getTime()
      //     let recordTime = sessionStorage.getItem('recordTime') * 1
      //     let endTime = alarmTime + recordTime * 1000
      //     if (Date.now() < endTime) {
      //       this.seconds = Math.ceil((endTime - Date.now()) / 1000)
      //       this.recordTimer = setInterval(() => {
      //         if (this.seconds > 0) {
      //           this.seconds--
      //         } else {
      //           clearInterval(this.recordTimer)
      //           this.goToVideo({
      //             cameraId: this.info.deviceId,
      //             cameraName: this.info.alarmDevName,
      //             hitTime: this.info.alarmTime,
      //           })
      //         }
      //       }, 1000)
      //     } else {
      //       this.goToVideo({
      //         cameraId: this.info.deviceId,
      //         cameraName: this.info.alarmDevName,
      //         hitTime: this.info.alarmTime,
      //       })
      //     }
      //   }
      // } else {
      // }
      clearInterval(this.recordTimer)
      window.removeEventListener('resize', this.updatePos)
      window.cancelAnimationFrame(this.requestId)

      this.videoPlay.off('failEvt', this.showPlayAgain)
      if (type === this.mediaType) return
      if (sessionStorage.getItem('cuType') == 1 && type == 1) {
        window.webkitProc('close-play-ts', JSON.stringify({}))
      }
      this.mediaType = type
      // 销毁播放弹窗
      this.close_sdk_video(this.info.deviceId)
      // 重新打开视频窗口
      this.$nextTick(() => {
        if (type !== 1) {
          let _dom = this.$refs.videoBox
          this.getPosToPlay(_dom)
          window.addEventListener('resize', this.updatePos)
          this.requestId = window.requestAnimationFrame(this.windowPosChg)
          if (type == 3) this.videoFail()
        }
      })
    },
    getPosToPlay(_dom) {
      // 拿到 dom在浏览器的坐标位置
      const _domPos = _dom.getBoundingClientRect()
      // window.screenLeft/window.screenTop 需要加上浏览器左边与屏幕间距
      // document.documentElement.clientHeight  窗口页面高度
      let tabHeight =
        window.outerHeight * window.devicePixelRatio - document.documentElement.clientHeight * window.devicePixelRatio //浏览器标签栏高度
      let postion = {
        topX: _domPos.left * window.devicePixelRatio + window.screenLeft * window.devicePixelRatio,
        topY: _domPos.top * window.devicePixelRatio + window.screenTop * window.devicePixelRatio + tabHeight,
        botX:
          _domPos.left * window.devicePixelRatio +
          _domPos.width * window.devicePixelRatio +
          window.screenLeft * window.devicePixelRatio,
        botY:
          _domPos.top * window.devicePixelRatio +
          _domPos.height * window.devicePixelRatio +
          window.screenTop * window.devicePixelRatio +
          tabHeight,
      }
      // // 判断窗口宽度和屏幕宽度 相等就不用管，不等的话需要加上浏览器左边与屏幕间距
      // window.outerWidth screen.availWidth
      // 判断是否全屏
      if (this.mediaType == 2) {
        // 设置坐标点位 播放实时视频
        this.goToLiveWithPos({
          deviceId: this.info.deviceId,
          deviceName: this.info.alarmDevName,
          leftTopX: Math.floor(postion.topX),
          leftTopY: Math.floor(postion.topY),
          rightBottomX: Math.floor(postion.botX),
          rightBottomY: Math.floor(postion.botY),
        })
      } else if (this.mediaType == 3) {
        // 设置坐标点位 播放告警录像
        // 根据录像策略来判断录像是否已完成，完成之后方可播放
        let alarmTime = new Date(this.info.alarmTime).getTime()
        let recordTime = sessionStorage.getItem('recordTime') * 1
        let endTime = alarmTime + recordTime * 1000
        if (Date.now() < endTime) {
          this.seconds = Math.ceil((endTime - Date.now()) / 1000)
          this.recordTimer = setInterval(() => {
            if (this.seconds > 0) {
              this.seconds--
            } else {
              clearInterval(this.recordTimer)
              this.getPosToPlay(this.$refs.videoBox)
            }
          }, 1000)
        }
        this.goToVideoWithPos({
          deviceId: this.info.deviceId,
          deviceName: this.info.alarmDevName,
          hitTime: this.info.alarmTime,
          leftTopX: Math.floor(postion.topX),
          leftTopY: Math.floor(postion.topY),
          rightBottomX: Math.floor(postion.botX),
          rightBottomY: Math.floor(postion.botY),
        })
      }
    },
    windowPosChg() {
      this.updatePos()
      this.requestId = window.requestAnimationFrame(this.windowPosChg)
    },
    updatePos() {
      if (!this.$refs.videoBox) return
      // 拿到 dom在浏览器的坐标位置
      const _domPos = this.$refs.videoBox.getBoundingClientRect()
      // window.screenLeft/window.screenTop 需要加上浏览器左边与屏幕间距
      // document.documentElement.clientHeight  窗口页面高度
      let tabHeight =
        window.outerHeight * window.devicePixelRatio - document.documentElement.clientHeight * window.devicePixelRatio //浏览器标签栏高度
      let postion = {
        topX: _domPos.left * window.devicePixelRatio + window.screenLeft * window.devicePixelRatio,
        topY: _domPos.top * window.devicePixelRatio + window.screenTop * window.devicePixelRatio + tabHeight,
        botX:
          _domPos.left * window.devicePixelRatio +
          _domPos.width * window.devicePixelRatio +
          window.screenLeft * window.devicePixelRatio,
        botY:
          _domPos.top * window.devicePixelRatio +
          _domPos.height * window.devicePixelRatio +
          window.screenTop * window.devicePixelRatio +
          tabHeight,
      }
      this.videoPos.leftTopX = Math.floor(postion.topX)
      this.videoPos.leftTopY = Math.floor(postion.topY)
      this.videoPos.rightBottomX = Math.floor(postion.botX)
      this.videoPos.rightBottomY = Math.floor(postion.botY)
      // this.updateWindowLocation({
      //   dialogId: this.info.deviceId,
      //   leftTopX:Math.floor(postion.topX),
      //   leftTopY:Math.floor(postion.topY),
      //   rightBottomX:Math.floor(postion.botX),
      //   rightBottomY:Math.floor(postion.botY),
      // })
    },
    videoFail() {
      // mixin 的视频对象
      if (this.videoPlay) {
        this.videoPlay.on('failEvt', this.showPlayAgain)
      }
    },
    showPlayAgain() {
      if (this.mediaType == 3) {
        this.playAgain = true
      }
    },
    // 判断权限 联动设备实时视频查看
    handleRealTimePlay(cameraId, cameraName) {
      if (this.playList.indexOf(cameraId) == -1) {
        this.playList.push(cameraId)
      }

      let cameraIds = this.cameraList.map((item) => item.deviceId)
      console.log(cameraIds.indexOf(cameraId) !== -1)
      if (cameraIds.indexOf(cameraId) !== -1) {
        this.goToLive({
          cameraId,
          cameraName,
        })
      } else {
        this.$alert(`${this.$t('public.noAuthVideo')}`, `${this.$t('public.prompt')}`, {
          confirmButtonText: `${this.$t('public.confirm')}`,
          type: 'warning',
        })
      }
    },
    // 获取告警类型所属场景
    getAlarmTypeScene() {
      this.sceneType = ''
      getAlarmType({ alarmTypeCode: this.info.alarmType }).then((res) => {
        if (res.resultCode === 0) {
          this.sceneType = res.alarmTypeInfo.scene
        }
      })
    },
    // 获取联动设备
    handleGetLinkagePlanByDeviceId() {
      let params = {
        deviceId: this.info.deviceId,
        alarmType: this.info.alarmType,
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      this.linkageAction = []
      this.iotDeviceInfoList = []
      this.planStepInfoList = []
      getLinkagePlanByDeviceId(params)
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            // 预案动作
            if (res.planStepInfoList) this.planStepInfoList = res.planStepInfoList
            // 联动
            if (res.linkageAction) {
              res.cameraInfoList = res.cameraInfoList || []
              res.iotDeviceInfoList =
                res.iotDeviceInfoList?.map((io) => {
                  return {
                    ...io,
                    workMode2: io.workMode,
                  }
                }) || []
              // 联动动作所有设备列表
              let actRule = JSON.parse(res.linkageAction)
              if (actRule && actRule['2']) {
                // 实况设备
                let idList = actRule['2'].idList
                this.linkageAction = res.cameraInfoList.filter((c) => {
                  return idList.includes(c.cameraId)
                })
                // 包含事件源摄像机
                if (actRule['2'].withOrigin) {
                  this.linkageAction.unshift({
                    cameraId: this.info.deviceId,
                    cameraName: this.info.alarmDevName,
                    status: 1,
                  })
                }
              } else {
                // 处理异常情况，应该不会发生
                this.linkageAction = []
              }
              this.iotDeviceInfoList = res.iotDeviceInfoList
              if (this.linkageAction.length) {
                this.showType = 1
              } else if (this.iotDeviceInfoList.length) {
                this.showType = 2
              }
            }
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    //获取复工单详情
    fetchWorkSheetInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      getWorkSheetInfo({
        eventId: this.info.alarmId,
      })
        .then((res) => {
          loading.close()
          if (res.workSheetInfo) {
            this.workSheetInfoStatus = true
            this.handleForm = { ...res.workSheetInfo }
            this.handleForm.processMode = res.workSheetInfo.processMode
            this.modifyEdit = true
            this.$refs.handleForm.resetFields()
          } else {
            this.$refs.handleForm.clearValidate()
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    // 提交工单处理或误报
    submitEventDetail() {
      console.log(this.info)
      //误报
      if (this.handleForm.processMode == -1) {
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            let params = {
              alarmId: this.info.alarmId,
              alarmTime: this.info.alarmTime,
              confirmState: 3,
              remark: this.handleForm.remark,
            }
            confirmEcsAlarm(params).then((res) => {
              if (res.resultCode == 0) {
                this.$EventBus.$emit('closeAlarmPopup', { id: this.info.alarmId }) //图片模式-关闭告警弹框

                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.modifyEdit = true
                this.$set(this.handleForm, 'processMode', -1)
                console.log(params.remark)
                if (params.remark) {
                  this.$set(this.handleForm, 'remark', params.remark)
                }

                this.$refs.handleForm.clearValidate()
              }
            })
          }
        })

        return
      }
      //转工单
      if (Number(this.handleForm.processMode) == 1) {
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            let params = {
              processMode: 1,
              resource: 1,
              eventId: this.info.alarmId,
              eventTime: this.info.alarmTime,
              workSheetName: this.handleForm.workSheetName,
              workSheetType: 1,
              workSheetLevel: this.handleForm.workSheetLevel,
              description: this.handleForm.description,
              site: this.alarmLocate,
            }
            addWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$EventBus.$emit('closeAlarmPopup', { id: this.info.alarmId }) //图片模式-关闭告警弹框

                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.fetchWorkSheetInfo()
              }
            })
          }
        })
      }

      //直接处理
      if (Number(this.handleForm.processMode) == 0) {
        this.handleForm.processMode = Number(this.handleForm.processMode)
        this.handleForm.eventId = this.info.alarmId
        this.handleForm.workSheetType = 1
        this.handleForm.eventTime = this.info.alarmTime
        this.$refs.handleForm.validate((valid) => {
          if (valid) {
            addWorkSheet({
              resource: 1,
              ...this.handleForm,
            }).then((res) => {
              if (res.resultCode == 0) {
                this.$EventBus.$emit('closeAlarmPopup', { id: this.info.alarmId }) //图片模式-关闭告警弹框

                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.fetchWorkSheetInfo()
              }
            })
          }
        })
      }
    },
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
    },
    setAlarmLevel(val) {
      switch (val) {
        case 1:
          return this.$t('home.level1')
        case 2:
          return this.$t('home.level2')
        case 3:
          return this.$t('home.level3')
        case 4:
          return this.$t('home.level4')
      }
    },
    handleChangeProcessMode() {
      this.$set(this.handleForm, 'workSheetName', '')
      this.$set(this.handleForm, 'workSheetLevel', '')
      this.$set(this.handleForm, 'description', '')
      this.$nextTick(() => {
        this.$refs.handleForm.clearValidate()
      })
    },
    // 门禁操作
    doorCtrl(item) {
      let operateType
      if (item.workMode2 === 0) {
        operateType = 5
      } else if (item.workMode2 === 1) {
        operateType = 4
      } else if (item.workMode2 === 2) {
        operateType = 3
      }
      const loading = this.$loading({
        lock: true,
        text: '设备操作中，请等待……',
        spinner: 'el-icon-loading',
      })
      // 禁止选择远程操作
      controlIotDev({
        platId: item.platId,
        productId: item.productId,
        operateType,
        module: 1, //门禁为1
      }).then((res) => {
        loading.close()
        if (res.resultCode == 0) {
          item.workMode = item.workMode2
          this.$message.success('操作成功！')
        } else {
          item.workMode2 = item.workMode
        }
      })
    },
    // 门禁操作 全部
    operateAll(type) {
      let operateType
      switch (type) {
        case 'open':
          operateType = 3
          break
        case 'close':
          operateType = 4
          break
        case 'normal':
          operateType = 5
          break
      }
      let deviceControlInfoList = this.iotDeviceInfoList.map((i) => {
        return {
          productId: i.productId,
          operateType,
          module: 1,
          platId: i.platId,
        }
      })
      const loading = this.$loading({
        lock: true,
        text: '设备操作中，请等待……',
        spinner: 'el-icon-loading',
      })
      batchControlIotDev({
        deviceControlInfoList,
      }).then((res) => {
        loading.close()
        if (res.deviceControlResultList && res.deviceControlResultList.length) {
          let seccList = res.deviceControlResultList.filter((d) => d.status == 'success')
          if (seccList.length === deviceControlInfoList.length || seccList.lengt > 0) {
            if (seccList.length === deviceControlInfoList.length) {
              // 全部成功
              this.$message.success('批量操作成功！')
            } else {
              // 部分成功
              this.$message.info('批量操作部分失败，请检查原因！')
            }
            // 修改状态
            seccList.forEach((s) => {
              let item = this.iotDeviceInfoList.find((d) => d.deviceId == s.productId)
              if (item) {
                if (operateType == 3) {
                  item.workMode = 2
                  item.workMode2 = 2
                } else if (operateType == 4) {
                  item.workMode = 1
                  item.workMode2 = 1
                } else if (operateType == 5) {
                  item.workMode = 0
                  item.workMode2 = 0
                }
              }
            })
          } else {
            // 全部失败
            this.$message.error('批量操作失败，请检查原因！')
          }
        }
      })
    },
    // 重置所有
    resetAll() {
      this.handleClosePlayer()
      this.setVideo(1)
      if (!this.info.alarmSnapUrl) {
        setTimeout(() => {
          this.setVideo(2)
        }, 1000)
      }
      this.getAlarmTypeScene()
      this.handleGetLinkagePlanByDeviceId()
      this.workSheetInfoStatus = false
      this.modifyEdit = false
      this.handleForm = {
        workSheetName: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
      }
    },
  },
  beforeDestroy() {
    this.$EventBus.$off('setLinkageParam')
  },
}
</script>

<style scoped lang="scss">
.no-data-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #e9e9e9;
    display: flex;
    flex-direction: column;
    align-items: center;
    .empty-img {
      width: 118px;
      height: 63px;
      margin-bottom: 10px;
    }
  }
}
.linkage-step-wrapper {
  height: 100%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
  .custom-timeline {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .step-wrapper {
      color: #fff;

      .step-name {
        color: #0affff;
        display: flex;
        font-size: 14px;
      }
      .step-desc {
        margin-top: 10px;
        font-size: 14px;
        color: #fff;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}

.linkbox-wrapper {
  box-sizing: border-box;
  font-size: 16px;
  height: calc(100% - 40px);
  .video-list-wrapper {
    height: 100%;
    overflow: auto;
    &.wrapper2 {
      height: calc(100% - 40px);
    }
    .video-item {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      align-items: center;
      &.offline {
        color: #aaa !important;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .device-name {
        flex: 4;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        .icon {
          width: 22px;
          height: 16px;
          display: block;
          margin-right: 8px;
        }
        .name {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
      .device-status {
        flex: 1;
        text-align: center;
      }
      .device-opt {
        flex: 1;
        text-align: center;
        font-size: 18px;
        color: #00ccff;
        cursor: pointer;
      }
    }
  }
  .opt-row {
    display: flex;
    align-items: center;
  }
}

.video-type-wrapper {
  display: flex;
  font-size: 14px;
  margin-top: 10px;
  padding-bottom: 10px;
  box-sizing: border-box;
  li {
    margin-right: 20px;
    color: #ccc;
    cursor: pointer;
    &.active {
      color: #fff;
      font-weight: bold;
    }
  }
}
.go-alarm {
  color: #00ccff;
  cursor: pointer;
}
.el-textarea {
  ::v-deep.el-textarea__inner {
    background-color: transparent;
    border-color: #1f60a3;
    color: #fff;
    resize: none;
  }
}
.alarm-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .alarm-type {
    font-size: 14px;
    font-weight: bold;
  }
}
.linkage-card-content {
  height: calc(100% - 40px);
  overflow: hidden;
  .alarm-item-wrapper {
    font-size: 14px;
    .alarm-item {
      display: flex;
    }
  }
}
.alarm-img {
  height: 180px;
  padding: 0 20px;
  > img {
    width: 100%;
    height: 100%;
  }
  .video-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #18242c;
    img {
      width: 50px;
      height: 50px;
      margin: auto;
    }
    .replayIcon {
      position: absolute;
      top: 85%;
      left: 2%;
      font-size: 20px;
      cursor: pointer;
    }
    .times {
      position: absolute;
    }
  }
}
.alarmViewBtn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 15px 20px;
  font-size: 14px;
  .item {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #1bedb9;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    margin-left: 30px;
    &:first-child {
      margin-left: 0px;
    }
    &.active {
      background: #00cbff;
    }
  }
}
.linkage-card {
  padding: 15px;
  box-sizing: border-box;
  background-color: #2a4a6b;
  margin-bottom: 20px;
  border-radius: 4px;
  .linkage-card-title {
    font-size: 16px;
    padding-bottom: 15px;
    border-bottom: 1px solid #00ccff;
  }
}
.plan-info {
  height: calc(48% - 20px);
}
.linkage-info {
  height: 52%;
}
.alarm-info {
  height: 100%;
  .alarm-base-info {
    border-bottom: 1px solid #00ccff;
  }
  .alarm-worksheet {
    padding-top: 20px;
  }
  ::v-deep .el-form {
    .el-form-item {
      margin-bottom: 12px;
    }
  }
}
.alarm-linkage {
  color: #fff;
  height: 100%;
  position: relative;
  .go-back {
    position: absolute;
    bottom: 10px;
    right: 530px;
    pointer-events: auto;
  }
  .linkage-left {
    width: 420px;
    height: calc(100% - 20px);
    position: absolute;
    left: 18px;
    top: 10px;
    z-index: 99;
    transition: all 0.5s;
    pointer-events: auto;
  }
  .linkage-right {
    width: 480px;
    height: calc(100% - 20px);
    position: absolute;
    right: 19px;
    z-index: 89;
    top: 10px;
    transition: all 0.5s;
    pointer-events: auto;
  }
}
</style>
