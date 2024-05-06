/**
 * @Author target
 * @Date 2022/5/6 10:51
 * @Version 1.0
 */
import { postFetch, getFetch, loginRequest } from '@/api/service'
import { merge } from 'lodash'
export default {
  captcha: (data) => postFetch('/uas/v1/api/captcha', data),
  getLoginUserInfo: (data) => postFetch('/uas/v1/api/udc/login/user', data),
  // selectMenus: (data) => postFetch('/uas/v1/api/ais/management/menus', data),
  //获取系统信息
  getSysInfo: (data) => postFetch('/uas/v1/api/scs/system/info/get', data),
  //获取局点信息
  getFlavor: (data) => postFetch('/uas/v1/api/udc/assist/flavor', data),
  showTraffic: (data) => postFetch('/uas/v1/api/scs/traffic/show/info', data),
  disposeInfo: (data) => postFetch('/uas/v1/api/scs/patrol/dispose/info', data),
  cameraInfo: (data) => postFetch('/uas/v1/api/scs/camera/show/info', data),
  workSheetInfo: (data) => postFetch('/uas/v1/api/scs/work_sheet/show/info', data),
  //告警配置
  alarmPropertyInfo: (data) => postFetch('/uas/v1/api/scs/alarm/property/info', data),
  //算法列表
  algorithmList: (data) => postFetch('/uas/v1/uas/v1/api/ars/algorithm/access/list', data),
  // 登录
  login: (data = {}, config = {}) => {
    return loginRequest(
      merge(
        {
          url: '/uas/v1/api/user/login',
          method: 'post',
          data,
        },
        config
      )
    )
  },
}
