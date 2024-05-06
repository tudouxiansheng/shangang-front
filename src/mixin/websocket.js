const heartCheck = {
  timeout: 60 * 1000,
  timer: null,
  serverTimer: null,
  reset() {
    this.timer && clearTimeout(this.timer)
    this.serverTimer && clearTimeout(this.serverTimer)
  },
  start(ws) {
    this.reset()
    this.timer = setTimeout(() => {
      // onmessage拿到返回的心跳就说明连接正常
      ws.send(JSON.stringify({ heart: 1 }))
      // 如果超过一定时间还没响应(响应后触发重置)，说明后端断开了
      this.serverTimer = setTimeout(() => {
        ws.close()
      }, this.timeout)
    }, this.timeout)
  },
}
export default {
  name: 'Websocket',
  data() {
    return {
      // wsUri: '172.16.11.87:10000/wsapp/client?token=', // ws wss
      // wsUri: '172.16.11.136:10000/wsapp/client?token=', // ws wss
      wsUri: window.location.host + '/wsapp/client?token=', // ws wss
      lockReconnect: false, // 连接失败不进行重连
      maxReconnect: 5, // 最大重连次数，若连接失败
      websocket: null,
      isConnected: false,
    }
  },
  mounted() {},
  watch: {
    '$route.path': {
      handler(route) {
        if (route === '/login') {
          if (this.websocket) {
            this.websocket.close()
            this.websocket = null
          }
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  },
  methods: {
    reconnect() {
      console.log('尝试重连')
      if (this.lockReconnect || this.maxReconnect <= 0) {
        return
      }
      setTimeout(() => {
        this.maxReconnect-- // 不做限制 连不上一直重连
        this.initWebSocket()
      }, 60 * 1000)
    },
    initWebSocket() {
      try {
        if ('WebSocket' in window) {
          const { protocol } = location
          const wsUri = `${protocol === 'https:' ? 'wss' : 'ws'}://${this.wsUri}${sessionStorage.getItem('token')}`
          this.websocket = new WebSocket(wsUri)
        } else {
          console.log('您的浏览器不支持websocket')
        }
        this.websocket.onopen = this.websocketOnopen
        this.websocket.onerror = this.websocketOnerror
        this.websocket.onmessage = this.websocketOnmessage
        this.websocket.onclose = this.websocketClose
      } catch (e) {
        this.reconnect()
      }
    },
    websocketOnopen() {
      console.log('WebSocket连接成功', this.websocket.readyState)
      this.isConnected = true
      // heartCheck.start(this.websocket)
      let data = {
        time: new Date().getTime(),
      }
      this.websocket.send(JSON.stringify(data))
    },
    websocketOnerror(e) {
      console.log('WebSocket连接发生错误', e)
      this.isConnected = false
      this.reconnect()
    },
    websocketOnmessage(e) {
      const data = JSON.parse(e.data)
      // console.log('得到响应', data, '可以渲染网页数据...')
      // 消息获取成功，重置心跳
      heartCheck.start(this.websocket)
      if (data.type == 'client_logout') {
        // 解决客户端无法主动退出登陆
        // if (window.webkitProc) {
        //   window.webkitProc(
        //     'client_logout',
        //     JSON.stringify({
        //       msg: data.content,
        //     })
        //   )
        // }
      } else {
        this.$EventBus.$emit('websocketMessage', data)
        this.handleWebSocketMessage(data)
      }
    },
    handleWebSocketMessage(msg) {},
    websocketClose(e) {
      console.log('connection closed (' + e.code + ')')
      this.isConnected = false
      this.reconnect()
    },
  },
}
