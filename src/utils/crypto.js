//加密
export function crypto(password, loginPassword) {
    var CryptoJS = require('crypto-js');
    // let abstract = CryptoJS.MD5(loginPassword);
    //把abstract转换成hexString,给key,string再转字节数组
    let key = ""
    // if(sessionStorage.getItem('cuType') == 1){
    key = CryptoJS.enc.Utf8.parse(loginPassword.toString());
    // }else if(sessionStorage.getItem('cuType') == 5){
    //   key = CryptoJS.enc.Utf8.parse(abstract.toString());
    // }

    let encryptedData = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    //生成的encryptedDataStr是一个base64结果数
    // let encryptedDataStr = encryptedData.toString();
    //转换成hex格式的数
    let encryptedStr = encryptedData.ciphertext.toString(); //hex
    return encryptedStr
}

//解密
export function Decrypt(password,loginPassword) {
    var CryptoJS = require('crypto-js');
    // let abstract = CryptoJS.MD5(loginPassword);

    let key = ""
    // if(sessionStorage.getItem('cuType') == 1){
    key = CryptoJS.enc.Utf8.parse(loginPassword.toString());
    // }else if(sessionStorage.getItem('cuType') == 5){
    //   key = CryptoJS.enc.Utf8.parse(abstract.toString());
    // }
    let decrypt = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(password), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr
}
