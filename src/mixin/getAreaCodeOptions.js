// 报表--所属区域
import { getAreaChildAll } from '../utils/api'

var getAreaCodeOptions = {
  data() {
    return {
      areaCodeOptions: [],
    }
  },

  methods: {
    async getAreaOptions(areaCode) {
      let areaCodeOptions = JSON.parse(
        sessionStorage.getItem('areaCodeOptions')
      )
      if (areaCodeOptions) {
        this.areaCodeOptions = areaCodeOptions
        return
      }
      let res = await getAreaChildAll({
        areaCode,
      })
      if (res.resultCode == 0) {
        let arr_area = res.children
        this.areaCodeOptions = this.orgChangeKey(arr_area)
        sessionStorage.setItem(
          'areaCodeOptions',
          JSON.stringify(this.areaCodeOptions)
        )
      }
    },
    orgChangeKey(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i]['areaName']
        delete arr[i].areaName
        arr[i].value = arr[i]['areaCode']
        delete arr[i].areaCode

        if (arr[i].children) {
          arr[i].children = this.orgChangeKey(arr[i].children)
        }
      }
      return arr
    },

    async getAreaOptions_noDistrict(areaCode) {
      let areaCodeOptions = JSON.parse(
        sessionStorage.getItem('areaCodeOptions')
      )
      if (areaCodeOptions) {
        this.areaCodeOptions = areaCodeOptions
        return
      }
      let res = await getAreaChildAll({
        areaCode,
      })
      if (res.resultCode == 0) {
        let arr_noArea = res.children
        this.areaCodeOptions = this.orgChangeKey_noDistrict(arr_noArea)
        sessionStorage.setItem(
          'areaCodeOptions',
          JSON.stringify(this.areaCodeOptions)
        )
      }
    },
    orgChangeKey_noDistrict(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i]['areaName']
        delete arr[i].areaName
        arr[i].value = arr[i]['areaCode']
        delete arr[i].areaCode

        if (arr[i].children && arr[i].areaLevel < 2) {
          arr[i].children = this.orgChangeKey_noDistrict(arr[i].children)
        } else {
          delete arr[i].children
        }
      }
      return arr
    },
  },
}

export default getAreaCodeOptions
