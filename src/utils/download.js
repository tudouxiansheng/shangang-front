//  下载文件，并自定义文件名
import {
    getFormatDate2
} from "./mutil"
// export const download = (url, filename, fileType = "") => {
//     if (sessionStorage.getItem("cuType") == 5) {
//         getBlob(url, function(blob) {
//             saveAs(blob, filename);
//         });
//     } else {
//         // 如果未传值，则截取url获取后缀格式
//         if (!fileType) {
//             const index = url.lastIndexOf(".");
//             fileType = url.substring(index, url.length).split("?")[0];
//         }
//         // 客户端下载
//         let param = {
//             fileName: filename + fileType,
//             downloadUrl: url
//         };
//         window.webkitProc("snap_download", JSON.stringify(param));
//     }
// };

//  下载文件，并自定义文件名
export const download = (url, filename, fileType = "") => {
    // 如果未传值，则截取url获取后缀格式
    if (!fileType) {
        const index = GetPageName(url).lastIndexOf(".");
        fileType = GetPageName(url).substring(index, url.length).split("?")[0];
    }
    filename = filename.substring(0, filename.lastIndexOf(".")) || filename
    getBlob(url, function (blob) {
        saveAs(blob, filename + '_' + getFormatDate2(new Date()), fileType);
    });
};

function GetPageName(url) {
    var tmp = new Array(); //临时变量，保存分割字符串
    tmp = url.split("/"); //按照"/"分割
    var pp = tmp[tmp.length - 1]; //获取最后一部分，即文件名和参数
    tmp = pp.split("?"); //把参数和文件名分割开
    return tmp[0];
}

function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}

function saveAs(blob, filename, fileType) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement('a');
      var body = document.querySelector('body');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename + fileType;
      link.style.display = 'none';
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }
  }

// 下载图片到本地
export const downFile = (data, fileName) => {
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') // 有效的内部空间URI
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