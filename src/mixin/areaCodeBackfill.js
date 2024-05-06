// 行政区域回填相关
export default {
  methods: {
    /** 根据单个areaCode值 反推areaCode数组 */
    getAreaCodeList(code) {
      if (code == '' || code == undefined || code == null) {
        return []
      }
      let codeArr = code.match(/\d{2}/g),
        resultArr = ['000000000000']
      let MakeUpZero = (num, n) => {
        var len = num.toString().length
        while (len < n) {
          num = num + '0'
          len++
        }
        return num
      }
      if (codeArr) {
        for (let i = 0; i < codeArr.length; i++) {
          resultArr.push(MakeUpZero(codeArr.slice(0, i + 1).join(''), 12))
        }
      }
      return [...new Set(resultArr)]
    }
  }
}
