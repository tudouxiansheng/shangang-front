export let loginForm = {
  loginType: 0,
  ip: '172.16.11.136',
  // ip: '172.16.11.119',
  // ip: '121.37.136.149',
  port: 10000,
  agentType: 1,
  token: sessionStorage.getItem('token'),
}

// 播放模式
export const VideoMode = {
  REALPLAY: 1, // 实时预览模式
  BACKPLAY: 2, // 回放模式
}
