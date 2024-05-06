import { loginForm, VideoMode } from './config'
import WSClient from './websocketInit'
export default class VideoPlay {
  constructor() {
    this.WSClient = new WSClient()
    this.webUid = null
    this.dialogIds = []
    this.dialogId = 'videoDialog'
    this.WSClient.on('msg', this.onMessage.bind(this))
    this.leftTopX = screen.width * 0.3
    this.leftTopY = screen.height * 0.3
    this.rightBottomX = screen.width * 0.7
    this.rightBottomY = screen.height * 0.7
    this.isPlaying = false
    document.addEventListener('visibilitychange', this.handelVisibilityChange.bind(this))
    this.events = {
      failEvt: [],
    }
  }
  // websocket接受到消息
  onMessage(msg) {
    this.webUid = msg.webUid
    switch (msg.notifyType) {
      case 0:
        // 连接回执
        this.login()
        break
      case 1:
        // 创建窗口
        this.dialogIds.push(this.dialogId)
        break
      case 2:
        // 关闭窗口
        this.dialogIds = this.dialogIds.filter((id) => id !== msg.dialogId)
        // this.isPlaying = false
        if (this.events.failEvt && this.events.failEvt.length) {
          this.events.failEvt.forEach((f) => f())
        }
        break
      case 4:
        // 接收播放状态
        let { statusType, clsoeType, cameraId } = msg.statusInfo
        if (statusType && statusType == 2) {
          if (this.events.failEvt && this.events.failEvt.length) {
            this.events.failEvt.forEach((f) => f())
            // 关闭窗口
            this.closePop('dialogId' + cameraId)
          } else {
            // 播放完毕 重复播放
            this.jumpToPlayTime(this.cameraInfo)
          }
        }
        // 播放中断或者播放失败
        if (statusType == -2 || statusType == -1 || statusType == 3) {
          if (this.events.failEvt && this.events.failEvt.length) {
            this.events.failEvt.forEach((f) => f())
          } else {
            // 播放完毕 重复播放
            this.jumpToPlayTime(this.cameraInfo)
          }
        }
      // if (clsoeType === 0) { //手动关闭

      // } else {
      // 调用接口关闭
      // }
    }
  }
  toNumber(num) {
    return num == null ? null : num === '' ? 0 : Number(num)
  }
  // 登陆sdk
  login() {
    const env = process.env.NODE_ENV
    if (env === 'production') {
      const ip = window.location.hostname
      const port = window.location.port
      loginForm.ip = ip
      loginForm.port = this.toNumber(port)
    }
    // 使用token登录hostSdk
    let request = {
      ...loginForm,
      webUid: String(this.webUid),
      token: sessionStorage.getItem('token'),
      refreshToken: sessionStorage.getItem('refreshToken'),
    }
    if (process.env.NODE_ENV === 'production') {
      let ip = window.location.hostname
      try {
        ip = ip.split('//')[1] || ip
        ip = ip.split(':')[0]
      } catch (error) {}
      request.ip = ip
    }
    this.sendMessage('web_login', request)
  }
  // 浏览器标签切换事件
  handelVisibilityChange() {
    if (this.isPlaying) {
      if (document.hidden) {
        // 播放窗口最小化
        let request = {
          webUid: this.webUid,
          dialogId: this.dialogId,
          operationType: 6, //播放窗口最小化
        }
        this.sendMessage('append_dialog_operation', request)
      } else {
        // 播放窗口还原
        let request = {
          webUid: this.webUid,
          dialogId: this.dialogId,
          operationType: 7, //播放窗口还原
        }
        this.sendMessage('append_dialog_operation', request)
      }
    }
  }
  /**
   * 弹窗 录像回放
   * @param {Object} cameraInfo 摄像机信息
   * @param {number} streamType 1：主码流 2: 子码流
   */
  videoBackPlay(cameraInfo, streamType = 2) {
    this.cameraInfo = cameraInfo
    // this.currentWindowMode = VideoMode.BACKPLAY
    let leftTopX = cameraInfo.leftTopX || this.leftTopX
    let leftTopY = cameraInfo.leftTopY || this.leftTopY
    let rightBottomX = cameraInfo.rightBottomX || this.rightBottomX
    let rightBottomY = cameraInfo.rightBottomY || this.rightBottomY
    this.dialogId = cameraInfo.dialogId
    let request = {
      cameraId: cameraInfo.cameraId,
      cameraName: cameraInfo.cameraName,
      customAppearance: {
        mainWindow: {
          isBorderVisible: true,
          isTitleBarVisible: true,
          isActionBarVisible: true,
        },
        titleBar: {
          title: cameraInfo.cameraName + '（录像回放）',
          isMaxBtnVisible: false,
          isMiniBtnVisible: false,
        },
        screenWindow: {
          isAudioTalkVisible: false,
          isControlBarVisible: true,
          isVolumeAdjustBtnVisible: false,
          isCloseBtnVisible: false,
        },
      },
      dialogId: this.dialogId,
      isDoubleClickedEnLarge: true,
      isDragable: true,
      isPopWindow: true,
      isScalable: false,
      isScreenDragable: false,
      leftTopX,
      leftTopY,
      qualityType: 0, // 画质优先1/实时优先0
      rightBottomX,
      rightBottomY,
      screenWindowIsNoBord: false,
      streamType: streamType,
      webUid: this.webUid,
      reconnectCount: undefined, // 重连次数
      videoSearchType: '0',
      searchBeginTime: cameraInfo.startTime,
      searchEndTime: cameraInfo.endTime,
      playTime: cameraInfo.playTime ? cameraInfo.playTime : cameraInfo.startTime, // 跳转播放时间
    }
    this.isPlaying = true
    this.sendMessage('video_replay', request)
    console.log(request)
  }
  /**
   * 弹窗 实时预览
   * @param {Object} cameraInfo 摄像机信息
   * @param {number} streamType 1：主码流 2: 子码流
   */
  realTimePlay(cameraInfo, streamType = 2) {
    this.cameraInfo = cameraInfo
    // this.currentWindowMode = VideoMode.REALPLAY
    let leftTopX = cameraInfo.leftTopX || this.leftTopX
    let leftTopY = cameraInfo.leftTopY || this.leftTopY
    let rightBottomX = cameraInfo.rightBottomX || this.rightBottomX
    let rightBottomY = cameraInfo.rightBottomY || this.rightBottomY
    this.dialogId = cameraInfo.dialogId
    let request = {
      cameraId: cameraInfo.cameraId,
      cameraName: cameraInfo.cameraName,
      customAppearance: {
        mainWindow: {
          isBorderVisible: true,
          isTitleBarVisible: true,
          isActionBarVisible: false,
        },
        titleBar: {
          title: cameraInfo.cameraName,
          isMaxBtnVisible: false,
          isMiniBtnVisible: false,
        },
        screenWindow: {
          isAudioTalkVisible: true,
          isControlBarVisible: true,
          isVolumeAdjustBtnVisible: false,
          isCloseBtnVisible: false,
        },
      },
      dialogId: this.dialogId,
      isDoubleClickedEnLarge: true,
      isDragable: true,
      isPopWindow: true,
      isScalable: false,
      isScreenDragable: false,
      leftTopX,
      leftTopY,
      qualityType: 0, // 画质优先1/实时优先0
      rightBottomX,
      rightBottomY,
      screenWindowIsNoBord: false,
      streamType: streamType,
      webUid: this.webUid,
    }
    this.isPlaying = true
    this.sendMessage('realtime-play', request)
  }

  /**
   * 点位实时预览
   * @param {Object} cameraInfo 摄像机信息
   * @param {number} streamType 1：主码流 2: 子码流
   */
  realTimePlayByPos(cameraInfo, streamType = 2) {
    this.cameraInfo = cameraInfo
    let leftTopX = cameraInfo.leftTopX || this.leftTopX
    let leftTopY = cameraInfo.leftTopY || this.leftTopY
    let rightBottomX = cameraInfo.rightBottomX || this.rightBottomX
    let rightBottomY = cameraInfo.rightBottomY || this.rightBottomY
    this.dialogId = cameraInfo.dialogId
    let request = {
      cameraId: cameraInfo.cameraId,
      cameraName: cameraInfo.cameraName,
      customAppearance: {
        mainWindow: {
          isBorderVisible: false,
          isTitleBarVisible: false,
          isActionBarVisible: false,
        },
        titleBar: {
          title: cameraInfo.cameraName,
          isMaxBtnVisible: false,
          isMiniBtnVisible: false,
          isCloseBtnVisible: false,
        },
        screenWindow: {
          isAudioTalkVisible: true,
          isControlBarVisible: true,
          isVolumeAdjustBtnVisible: false,
          isCloseBtnVisible: false,
        },
      },
      dialogId: this.dialogId,
      isDoubleClickedEnLarge: true,
      isDragable: false,
      isPopWindow: false,
      isScalable: false,
      isScreenDragable: false,
      leftTopX,
      leftTopY,
      qualityType: 0, // 画质优先1/实时优先0
      rightBottomX,
      rightBottomY,
      screenWindowIsNoBord: false,
      streamType: streamType,
      webUid: this.webUid,
    }
    this.isPlaying = true
    if (sessionStorage.getItem('cuType') == 1) {
      request.WinWidth = Math.floor(Math.abs(Number(rightBottomX - leftTopX)))
      request.WinHeight = Math.floor(Math.abs(Number(rightBottomY - leftTopY)))
      window.webkitProc('realtime-play-ts', JSON.stringify(request))
    } else {
      this.sendMessage('realtime-play', request)
    }
  }

  /**
   * 点位录像回放
   * @param {Object} cameraInfo 摄像机信息
   * @param {number} streamType 1：主码流 2: 子码流
   */
  videoPlayByPos(cameraInfo, streamType = 2) {
    this.cameraInfo = cameraInfo
    let leftTopX = cameraInfo.leftTopX || this.leftTopX
    let leftTopY = cameraInfo.leftTopY || this.leftTopY
    let rightBottomX = cameraInfo.rightBottomX || this.rightBottomX
    let rightBottomY = cameraInfo.rightBottomY || this.rightBottomY
    this.dialogId = cameraInfo.dialogId
    let request = {
      cameraId: cameraInfo.cameraId,
      cameraName: cameraInfo.cameraName,
      customAppearance: {
        mainWindow: {
          isBorderVisible: false,
          isTitleBarVisible: false,
          isActionBarVisible: false,
        },
        titleBar: {
          title: cameraInfo.cameraName,
          isMaxBtnVisible: false,
          isMiniBtnVisible: false,
          isCloseBtnVisible: false,
        },
        screenWindow: {
          isAudioTalkVisible: false,
          isControlBarVisible: false,
          isVolumeAdjustBtnVisible: false,
          isCloseBtnVisible: false,
        },
      },
      dialogId: this.dialogId,
      isDoubleClickedEnLarge: true,
      isDragable: false,
      isPopWindow: false,
      isScalable: false,
      isScreenDragable: false,
      leftTopX,
      leftTopY,
      qualityType: 0, // 画质优先1/实时优先0
      rightBottomX,
      rightBottomY,
      screenWindowIsNoBord: false,
      streamType: streamType,
      webUid: this.webUid,
      reconnectCount: undefined, // 重连次数
      videoSearchType: '0',
      searchBeginTime: cameraInfo.startTime,
      searchEndTime: cameraInfo.endTime,
      playTime: cameraInfo.playTime ? cameraInfo.playTime : cameraInfo.startTime, // 跳转播放时间
    }
    this.isPlaying = true
    if (sessionStorage.getItem('cuType') == 1) {
      request.WinWidth = Math.floor(Math.abs(Number(rightBottomX - leftTopX)))
      request.WinHeight = Math.floor(Math.abs(Number(rightBottomY - leftTopY)))
      window.webkitProc('record-playback-ts', JSON.stringify(request))
    } else {
      this.sendMessage('video_replay', request)
    }
  }
  // 关闭视频窗体
  closePop(dialogId) {
    let request = {
      webUid: this.webUid,
      dialogId: dialogId,
    }
    this.sendMessage('player_dialog_close', request)
    // let request = {
    //   webUid: this.webUid,
    //   dialogId: dialogId,
    //   isCloseAllNotifyWindow: true
    // }
    // this.sendMessage('web_notifyWindow_close', request)
  }

  /**
   * 显示隐藏播放窗口
   * @param dialogId 窗口ID
   * @param type 7:还原，6:隐藏
   */
  togglePlayer(dialogId, type) {
    let request = {
      webUid: this.webUid,
      dialogId: `dialogId${dialogId}`,
      operationType: type, //播放窗口还原
    }
    this.sendMessage('append_dialog_operation', request)
  }
  // 更新视频窗体
  updatePos(obj) {
    let request = {
      dialogId: obj.dialogId,
      webUid: this.webUid,
      operationType: 1,
      geometryInfo: {
        leftTopX: obj.leftTopX,
        leftTopY: obj.leftTopY,
        rightBottomX: obj.rightBottomX,
        rightBottomY: obj.rightBottomY,
      },
    }
    this.sendMessage('append_dialog_operation', request)
  }

  // 更新速度
  // updateSpeed() {
  //     let request = {
  //         dialogId: this.dialogId,
  //         webUid: this.webUid,
  //         operationType: 5,
  //         playbackSpeedPlay: {
  //             cameraId: this.cameraInfo.cameraId,
  //             speedType: this.curSpeed
  //         }
  //     };
  //     this.sendMessage("append_dialog_operation", request);
  // }
  // 跳转播放时间
  jumpToPlayTime(cameraInfo) {
    let request = {
      dialogId: this.dialogId,
      webUid: this.webUid,
      operationType: 9,
      RecordVCRControl: {
        StartTime: cameraInfo.startTime,
        PlayTime: cameraInfo.playTime ? cameraInfo.playTime : cameraInfo.startTime,
        EndTime: cameraInfo.endTime,
        cameraId: cameraInfo.cameraId,
        screenIndex: 0,
        Operation: 6,
      },
    }
    this.sendMessage('append_dialog_operation', request)
  }
  // 发送消息
  sendMessage(method, body) {
    if (this.WSClient.wsClient) {
      this.WSClient.wsClient.send(
        JSON.stringify({
          func: method,
          msg: body,
        })
      )
    }
  }
  // 销毁
  destory() {
    document.removeEventListener('visibilitychange', this.handelVisibilityChange)
    // this.WSClient.release()
  }
  on(type, fn) {
    if (!this.events[type]) this.events[type] = []
    if (this.events[type].indexOf(fn) === -1) {
      this.events[type].push(fn)
    }
  }
  off(type, fn) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter((f) => f === fn)
    }
  }
}
