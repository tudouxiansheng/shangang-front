import dayjs from 'dayjs'
import { getRandomValues } from './utils'
// 登录clientNonce
export const getClientNonce = len => {
  len = len || 32
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const maxPos = chars.length
  let str = 'wcs05' + dayjs(Date.now()).format('YYYYMMDDHHmmss') + (Date.now() % 1000)
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(getRandomValues() * maxPos))
  }
  return str
}
