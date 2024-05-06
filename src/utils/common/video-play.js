// 客户端播放
import dayjs from 'dayjs'
import store from '@/store'
export default function () {
  // 跳转到 实时视频
  function goToRealtimePlay(cameraId, cameraName, streamType = 1, isTurn = false) {
    let param = {
      cameraId,
      cameraName,
      streamType,
      isTurn
    }
    window.webkitProc('realtime-play', JSON.stringify(param))
    store.commit('mapSet/set_opType', 0)
  }
  // 跳转到 录像(过去一小时)
  function goToRecordPlayback(cameraId, cameraName) {
    let startTime = dayjs(new Date(Date.now() - 3600 * 1000)).format('YYYY-MM-DD HH:mm:ss')
    let endTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let param = {
      cameraId,
      cameraName,
      startTime,
      endTime,
      recordMethod: '0'
    }
    window.webkitProc('record-playback', JSON.stringify(param))
  }
  // 跳转到 告警录像
  function goToAlarmPlayback(cameraId, cameraName, alarmTime) {
    let param = {
      cameraId,
      cameraName,
      alarmTime
    }
    window.webkitProc('alarm-playback', JSON.stringify(param))
  }
  // 关闭播放窗口
  function closeRealtimePlay(cameraId, type = 0) {
    let param = {
      cameraId,
      type
    }
    window.webkitProc('play-close', JSON.stringify(param))
  }
  // 暂停、继续播放窗口
  function pausePlayRealtimePlay(cameraId, type = 0) {
    let param = {
      cameraId,
      type
    }
    window.webkitProc('play-notify', JSON.stringify(param))
  }

  return {
    goToRealtimePlay,
    goToRecordPlayback,
    goToAlarmPlayback,
    closeRealtimePlay,
    pausePlayRealtimePlay
  }
}
