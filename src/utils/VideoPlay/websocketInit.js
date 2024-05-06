//  连接 hostSDK websocket通讯
export default class WSClient {
    constructor() {
        this.ws_url = "localhost:50015" //ws地址
        this.wsClient = null //ws对象
        this.sendHeartInterval = null // 发送心跳
        this.recvHeartInterval = null // 接受心跳
        this.lastestRecvtime = null
        this.timeout = null
        this.webUid = null
        this.initWebsocket()
        this._event = {}
    }
    initWebsocket() {
        if (!("WebSocket" in window)) return; //不支持WebSocket
        if (this.wsClient === null) {
            this.wsClient = new WebSocket("ws://" + this.ws_url);

            this.wsClient.onopen = this.wsOnOpen()
            this.wsClient.onerror = this.wsOnError

            this.wsClient.onmessage = (event) => {
                this.lastestRecvtime = new Date().getTime()
                let msg = JSON.parse(event.data).msg;
                this.webUid = msg.webUid;
                this.msgHandler(msg);
            };
        } else {
            this.release();
            if (this.timeout) {
                clearTimeout(this.timeout)
                this.timeout = null
            }
            this.timeout = setTimeout(this.initClient(), 1000);
        }
    }
    initClient() {
        this.initWebsocket();
    }
    wsOnOpen() {
        this.sendHeart()
        this.recvHeart()
    }
    wsOnError() {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
        this.timeout = setTimeout(this.initClient(), 1000);
    }
    // 发送心跳
    sendHeart() {
        if (this.sendHeartInterval) {
            clearInterval(this.sendHeartInterval)
            this.sendHeartInterval = null
        }
        this.sendHeartInterval = setInterval(() => {
            let request = {
                webUid: this.webUid
            }
            this.sendMessage('web_notifyWindow_ping', request)
        }, 8000)
    }
    recvHeart() {
        if (this.recvHeartInterval) {
            clearInterval(this.recvHeartInterval)
            this.recvHeartInterval = null
        }
        this.recvHeartInterval = setInterval(() => {
            let currentTime = new Date().getTime()
            if (currentTime - this.lastestRecvtime > 10000) {
                // 超过10秒, 没有接受到消息, 重新建立连接
                this.release()
                if (this.timeout) {
                    clearTimeout(this.timeout)
                    this.timeout = null
                }
                this.timeout = setTimeout(this.initClient(), 1000);
            }
        }, 10000)
    }
    // 发送信息 sdk
    sendMessage(method, body) {
        if (this.wsClient) {
            this.wsClient.send(
                JSON.stringify({
                    func: method,
                    msg: body,
                })
            );
        }
    }
    // 接收到消息
    msgHandler(msg) {
        // 分发事件
        this._event['msg'] && this._event['msg'].forEach((f) => f && f(msg))
    }
    on(type, fn) {
        if (!this._event[type]) this._event[type] = []
        if (this._event[type].indexOf(fn) === -1) {
            this._event[type].push(fn)
        }
    }
    /**
     * ws关闭释放资源 或者重新打开之前存在
     */
    release() {
        if (this.sendHeartInterval) {
            clearInterval(this.sendHeartInterval)
            this.sendHeartInterval = null
        }
        if (this.recvHeartInterval) {
            clearInterval(this.recvHeartInterval)
            this.recvHeartInterval = null
        }

        if (this.wsClient) {
            this.wsClient.close();
            this.wsClient = null;
            this.webUid = null;
            this._event = {}
        }
    }
}