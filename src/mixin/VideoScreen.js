import { getVideoRecord } from '@/utils/api'
import Dayjs from '@/utils/Dayjs'
export default {
  data() {
    return {
      cuType: sessionStorage.getItem('cuType'),
    }
  },
  methods: {
    //弹窗实时视频
    goToLive(obj) {
      let cameraInfo = {
        deviceId: obj.deviceId || obj.cameraId,
        deviceName: obj.deviceName || obj.cameraName,
      }
      // 字体超长处理
      // if(cameraInfo.deviceName && cameraInfo.deviceName.length > 30){
      //     cameraInfo.deviceName = cameraInfo.deviceName.slice(0,30) + '...'
      // }
      let param = {
        dialogId: 'dialogId' + cameraInfo.deviceId,
        cameraId: cameraInfo.deviceId,
        cameraName: cameraInfo.deviceName,
      }
      if (this.cuType == 1) {
        // QT
        if (window.webkitProc) {
          window.webkitProc('realtime-play', JSON.stringify(param))
        }
      } else {
        // WEB HOSTSDK
        if (this.$VideoPlay) {
          this.$VideoPlay.realTimePlay(param)
        }
      }
    },
    //弹窗视频回放
    goToVideo(obj) {
      let cameraInfo = {
        hitTime: obj.hitTime || obj.captureTime,
        deviceId: obj.deviceId || obj.cameraId,
        deviceName: obj.deviceName || obj.cameraName,
      }
      // 字体超长处理
      // if(cameraInfo.deviceName && cameraInfo.deviceName.length > 30){
      //     cameraInfo.deviceName = cameraInfo.deviceName.slice(0,30) + '...'
      // }
      let startTime, endTime
      if (!!cameraInfo.hitTime) {
        let alarmTime = new Date(cameraInfo.hitTime).getTime()
        let recordTime = sessionStorage.getItem('recordTime') * 1
        startTime = alarmTime - recordTime * 1000
        endTime = alarmTime + recordTime * 1000
      } else {
        startTime = Dayjs().format('YYYY-MM-DD 00:00:00')
        endTime = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      let p = {
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        cameraList: [
          {
            cameraId: cameraInfo.deviceId,
          },
        ],
        searchInfo: {
          from: 'PLATFORM',
          recordMarkSearchTag: 0,
          beginTime: Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
          eventList: [
            {
              event: 'ALL',
            },
          ],
        },
      }
      getVideoRecord(p).then((res) => {
        if (res.resultCode == 0) {
          if (res.recordList && res.recordList.length) {
            let param = {
              dialogId: 'dialogId' + cameraInfo.deviceId,
              cameraId: cameraInfo.deviceId,
              cameraName: cameraInfo.deviceName,
              startTime: Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
              recordMethod: 0,
            }
            console.log(param)
            if (this.cuType == 1) {
              // QT
              if (window.webkitProc) {
                window.webkitProc('record-playback', JSON.stringify(param))
              }
            } else {
              // WEB HOSTSDK
              if (this.$VideoPlay) {
                this.$VideoPlay.videoBackPlay(param)
              }
            }
          } else {
            this.$alert(`${this.$t('public.noVideo')}`, `${this.$t('public.prompt')}`, {
              confirmButtonText: `${this.$t('public.confirm')}`,
              type: 'warning',
            })
          }
        }
      })
    },
    // 在屏幕上根据点位播放实时视频
    goToLiveWithPos(obj) {
      let cameraInfo = {
        deviceId: obj.deviceId || obj.cameraId,
        deviceName: obj.deviceName || obj.cameraName,
      }
      let param = {
        dialogId: 'dialogId' + cameraInfo.deviceId,
        cameraId: cameraInfo.deviceId,
        cameraName: cameraInfo.deviceName,
        leftTopX: obj.leftTopX,
        leftTopY: obj.leftTopY,
        rightBottomX: obj.rightBottomX,
        rightBottomY: obj.rightBottomY,
        // isDragable: false,
        // isTitleBarVisible: false,
        // isActionBarVisible: false,
      }
      if (this.$VideoPlay) {
        this.$VideoPlay.realTimePlayByPos(param)
      }
      // if (this.cuType == 1) {
      //     // QT
      //     if (window.webkitProc) {
      //         window.webkitProc('realtime-play', JSON.stringify(param))
      //     }
      // } else {
      //     // WEB HOSTSDK
      //     if (this.$VideoPlay) {
      //         this.$VideoPlay.realTimePlayByPos(param)
      //     }
      // }
    },
    // 在屏幕上根据点位回放视频
    goToVideoWithPos(obj) {
      let cameraInfo = {
        hitTime: obj.hitTime || obj.captureTime,
        deviceId: obj.deviceId || obj.cameraId,
        deviceName: obj.deviceName || obj.cameraName,
      }
      // 字体超长处理
      // if(cameraInfo.deviceName && cameraInfo.deviceName.length > 30){
      //     cameraInfo.deviceName = cameraInfo.deviceName.slice(0,30) + '...'
      // }
      let startTime, endTime
      if (!!cameraInfo.hitTime) {
        let alarmTime = new Date(cameraInfo.hitTime).getTime()
        let recordTime = sessionStorage.getItem('recordTime') * 1
        startTime = alarmTime - recordTime * 1000
        endTime = alarmTime + recordTime * 1000
      } else {
        startTime = Dayjs().format('YYYY-MM-DD 00:00:00')
        endTime = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // if(new Date().getTime() < endTime){
      //     return this.$message.warning('告警录像正在录制中，请稍后查看……')
      // }
      let p = {
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        cameraList: [
          {
            cameraId: cameraInfo.deviceId,
          },
        ],
        searchInfo: {
          from: 'PLATFORM',
          recordMarkSearchTag: 0,
          beginTime: Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
          eventList: [
            {
              event: 'ALL',
            },
          ],
        },
      }
      getVideoRecord(p).then((res) => {
        if (res.resultCode == 0) {
          if (res.recordList && res.recordList.length) {
            let param = {
              dialogId: 'dialogId' + cameraInfo.deviceId,
              cameraId: cameraInfo.deviceId,
              cameraName: cameraInfo.deviceName,
              startTime: Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
              recordMethod: 0,
              leftTopX: obj.leftTopX,
              leftTopY: obj.leftTopY,
              rightBottomX: obj.rightBottomX,
              rightBottomY: obj.rightBottomY,
            }
            console.log(param)
            // WEB HOSTSDK
            if (this.$VideoPlay) {
              this.$VideoPlay.videoPlayByPos(param)
            }
            // if (this.cuType == 1) {
            //     // QT
            //     if (window.webkitProc) {
            //         window.webkitProc('record-playback', JSON.stringify(param))
            //     }
            // } else {
            //     // WEB HOSTSDK
            //     if (this.$VideoPlay) {
            //         this.$VideoPlay.videoPlayByPos(param)
            //     }
            // }
          } else {
            this.$alert(`${this.$t('public.noVideo')}`, `${this.$t('public.prompt')}`, {
              confirmButtonText: `${this.$t('public.confirm')}`,
              type: 'warning',
            })
            // 如果是QT端，主动让QT关闭播放窗口，并让录像回放按钮显示
            if (window.webkitProc) {
              window.webkitProc('close-play-ts', JSON.stringify({}))
              this.playAgain = true
            }
          }
        } else {
          if (window.webkitProc) {
            window.webkitProc('close-play-ts', JSON.stringify({}))
            this.playAgain = true
          }
        }
      })
    },
    // 关闭视频窗体
    close_sdk_video(cameraId) {
      this.$VideoPlay.closePop('dialogId' + cameraId)
    },
    updateWindowLocation(obj) {
      this.$VideoPlay.updatePos({
        dialogId: 'dialogId' + obj.dialogId,
        leftTopX: obj.leftTopX,
        leftTopY: obj.leftTopY,
        rightBottomX: obj.rightBottomX,
        rightBottomY: obj.rightBottomY,
      })
    },
    // videoFailBack(){
    //     this.
    //     this.events.failEvt
    // }
  },
  beforeDestroy() {
    if (this.cuType != 1) {
      this.$VideoPlay.destory()
    }
  },
}
