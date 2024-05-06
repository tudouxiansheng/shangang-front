import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
//不允许输入特殊字符
const validateSpecialWord = async (rule, value, callback) => {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gim,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？【】[\] ]/gim
  if (value && (regEn.test(value) || regCn.test(value))) {
    callback(new Error(i18n.t('public.validate.specialWord')))
  } else {
    callback()
  }
}

const validateSpecialWord1 = async (rule, value, callback) => {
  let reg = /[\\/:*?"<>|]/gim
  if (value && reg.test(value)) {
    callback(new Error(i18n.t('public.validate.specialWord1')))
  } else {
    callback()
  }
}

const validateDeviceName = (rule, value, callback) => {
  const byteLength = getByteLength(value)
  if (byteLength >= 1 && byteLength <= 128) {
    callback()
  } else {
    callback(new Error(i18n.t('public.mainDevError')))
  }
}

const getByteLength = str => {
  let length = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    if (char <= 0x7f) {
      length += 1
    } else if (char <= 0x7ff) {
      length += 2
    } else if (char <= 0xffff) {
      length += 3
    } else {
      length += 4
    }
  }
  return length
}

export { validateSpecialWord, validateSpecialWord1, validateDeviceName }
