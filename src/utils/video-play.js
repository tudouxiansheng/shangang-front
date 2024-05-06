// 客户端播放
export default {
  realtimePlay(params){
    let param = {
     ...params
    }
    if(window.webkitProc){
      window.webkitProc('realtime-play', JSON.stringify(param))
    }
  },
  recordPlayback(params){
    let param = {
      ...params,
      recordMethod: '0'
    }
    if(window.webkitProc){
      window.webkitProc('record-playback', JSON.stringify(param))
    }
  }
}
