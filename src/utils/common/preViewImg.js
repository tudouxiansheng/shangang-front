/**
 * @param {string} item
 * @returns {string} url
 */
import { sStorage } from '@/utils/common/store'

export function handleGetPreview(item) {
  if (['4','1'].indexOf(sStorage.get('cuType'))==-1 || !item) return item
  let ipa = item.substring(0, item.indexOf('?'))
  let ipPre = ipa.split(':')[ipa.split(':').length - 1]
  let ipPrefix = ipPre.substring(ipPre.indexOf('/'), ipPre.length)
  let http = item.substring(0, ipa.indexOf(ipPrefix))
  let ipP = http.split('/')
  let protocol = window.location.protocol
  return `${protocol}//${window.location.host}/picture/?ip=${ipP[2].split(':')[0]}&port=${
    ipP[2].split(':')[1]
  }&protocol=${ipP[0].split(':')[0]}&path=${ipPrefix}&${item
    .substring(item.indexOf('?'), item.length)
    .substr(1)}`
}
/**
 * @param {string} item
 * @returns {string} url
 */
export function handleGetPreviewWss(item) {
  if (sStorage.get('cuType') != '4' || !item) return item
  let protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  let ipa = item.substring(0, item.indexOf('?'))
  const host = ipa.split('://')[1].split('/')[0]
  let http = ipa.split('://')[1].substring(ipa.split('://')[1].indexOf('/'))
  let ipPre = item.substring(item.indexOf('?'), item.length)
  return process.env.VUE_APP_ENV_NAME === 'VMS'
    ? `${protocol}://${window.location.host}${http}${ipPre}`
    : `${protocol}://${host}${http}${ipPre}`
}
