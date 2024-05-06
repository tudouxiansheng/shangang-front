import { getFormatDate2 } from './mutil'
import { lStorage } from '@/utils/common/store'
import { request } from '@/api/service'
//  下载文件，并自定义文件名
export const download = async (url, filename = '', fileType = '', timestamp = 1) => {
  if (!filename) {
    filename = GetPageName(url)
  }
  // 如果未传值，则截取url获取后缀格式
  if (!fileType) {
    const index = GetPageName(url).lastIndexOf('.')
    fileType = GetPageName(url).substring(index, url.length).split('?')[0]
  }
  filename = filename.substring(0, filename.lastIndexOf('.')) || filename
  const blob = await getBlob(url)
  if (blob) {
    const time = timestamp === 1 ? getFormatDate2(new Date()) : getFormatDate2(new Date()).slice(8)
    saveAs(blob, filename + '_' + time, fileType)
  }
}

function GetPageName(url) {
  var tmp = [] //临时变量，保存分割字符串
  tmp = url.split('/') //按照"/"分割
  var pp = tmp[tmp.length - 1] //获取最后一部分，即文件名和参数
  tmp = pp.split('?') //把参数和文件名分割开
  return tmp[0]
}

export const getBlob = async url => {
  let typeList = [
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv',
    'application/vnd.ms-excel',
    'image/jpeg'
  ]
  const res = await request(false, {
    url: url,
    method: 'post',
    data: new FormData(),
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9'
    }
  })
  if (typeList.indexOf(res?.type) !== -1) {
    return res
  }
}

function saveAs(blob, filename, fileType) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    var body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename + fileType
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

// 下载图片到本地
export const downFile = (data, fileName) => {
  const save_link = document.createElement('a')
  const blob = base64ToBlob(data)
  save_link.href = URL.createObjectURL(blob)
  save_link.download = fileName
  const event = document.createEvent('MouseEvents')
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  )
  save_link.dispatchEvent(event)
}

function base64ToBlob(code) {
  const parts = code.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], {
    type: contentType
  })
}

export const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function () {
      reject()
    }
    reader.readAsDataURL(blob)
  })
}

export const getBlobByGET = url => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error('Network Error'))
      }
    }
    xhr.onerror = () => reject(new Error('Network Error'))
    xhr.send()
  })
}

export function fileToBase64Chunks(file, chunkSize, withMetadata = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      const buffer = reader.result
      const totalChunks = Math.ceil(buffer.byteLength / chunkSize)

      const base64Chunks = []
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = (i + 1) * chunkSize
        const chunk = buffer.slice(start, end)
        const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(chunk)))
        base64Chunks.push(withMetadata ? `data:${file.type};base64,` + base64 : base64)
      }

      resolve(base64Chunks)
    }
    reader.onerror = function () {
      reject(reader.error)
    }
  })
}
export function downLoadExeFile(url) {
  var link = document.createElement('a')
  var body = document.querySelector('body')
  link.href = url
  link.target = '_self'
  link.style.display = 'none'
  body.appendChild(link)
  link.click()
  body.removeChild(link)
}
