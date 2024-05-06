
import store from '@/store'
var url = 'ws://' + window.location.host + '/wsapp/client'
var url1 = 'wss://' + window.location.host + '/wsapp/client'
var ws
var tt
var limitConnect = 10 // 断线重连次数
var Base64 = require('js-base64').Base64
import { sStorage } from '@/utils/common/store'
var websocket = {
  lockReconnect: false, //避免重复连接
  Init: function (token) {
    if ('WebSocket' in window) {
      ws = new WebSocket(document.location.protocol == 'https:' ? url1 : url, [
        token,
        store.state.auth.clientNonce,
        sStorage.get('cuType')
      ])
    } else {
      return
    }

    ws.onmessage = function (e) {
      heartCheck.start(token)
      let redata = JSON.parse(e.data)
      let content = JSON.stringify(JSON.parse(Base64.decode(redata.content)))

      // 如果是告警消息
      if (redata.type == 'alarm') {
        resetSetItem('alarmData', content)
      }
      // 如果是签退消息
      if (redata.type == 'client_logout') {
        resetSetItem('clientLogout', content)
      }

      // 平台推送历史元数据至客户端
      if (redata.type == 'history_metadata') {
        resetSetItem('history_metadata', content)
      }
    }

    ws.onclose = function () {
      reconnect(token)
    }

    ws.onopen = function () {
      heartCheck.start(token)
    }

    ws.onerror = function () {
      reconnect(token)
    }
  },
  Send: function (sender, reception, body, flag) {
    let data = {
      sender: sender,
      reception: reception,
      body: body,
      flag: flag
    }
    let msg = JSON.stringify(data)
    ws.send(msg)
  },
  getWebSocket() {
    return ws
  },
  closeWebSocket() {
    if (ws != null) {
      ws.close()
    }
    if (tt) {
      window.clearInterval(tt)
    }
  },
  getStatus() {
    if (ws.readyState == 0) {
      return $t('public.unconnected')
    } else if (ws.readyState == 1) {
      return $t('public.connected')
    } else if (ws.readyState == 2) {
      return $t('public.connectClosing')
    } else if (ws.readyState == 3) {
      return $t('public.connectClosed')
    }
  }
}

export default websocket

function reconnect(token) {
  if (websocket.lockReconnect) {
    return
  }
  websocket.lockReconnect = true
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt)
  tt = setTimeout(function () {
    websocket.Init(token)
    limitConnect--
    if (limitConnect <= 0) {
      let timeout = setTimeout(
        function () {
          limitConnect = 10
          websocket.lockReconnect = false
          reconnect(token)
          clearTimeout(timeout)
        },
        20 * 60 * 1000
      )
    } else {
      websocket.lockReconnect = false
    }
  }, 4000)
}

//心跳检测
var heartCheck = {
  timeout: 1000 * 60 * 3,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function (token) {
    var self = this
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send('HeartBeat:' + token)
      self.serverTimeoutObj = setTimeout(function () {
        if (ws.readyState != 1) {
          ws.close()
        }
      }, self.timeout)
    }, this.timeout)
  }
}
var newStorageEvent = '',
  storage = ''

function resetSetItem(key, newVal) {
  if (key === 'alarmData') {
    // 创建一个StorageEvent事件
    newStorageEvent = document.createEvent('StorageEvent')
    storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setAlarmData', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }

    return storage.setItem(key, newVal)
  }
  if (key === 'clientLogout') {
    // 创建一个StorageEvent事件
    newStorageEvent = document.createEvent('StorageEvent')
    storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('onClientLogout', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }

    return storage.setItem(key, newVal)
  }

  newStorageEvent = document.createEvent('StorageEvent')
  storage = {
    setItem: function (k, val) {
      sessionStorage.setItem(k, val)
      // 初始化创建的事件
      newStorageEvent.initStorageEvent(key, false, false, k, null, val, null, null)
      // 派发对象
      window.dispatchEvent(newStorageEvent)
    }
  }

  return storage.setItem(key, newVal)
}
