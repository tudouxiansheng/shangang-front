import api from '@/api'

const dict = {
  namespaced: true,
  state: {
    // 系统字典表 调用getSysDictData获取
    'device-type': [], // 摄像机类型
    'alarm-video-type': [], //联动动作名称
    'ecs-alarm-type-scene': [], //场景分类
    'access-plat-auth-type': [],
    'access-plat-protocol-type': [],
    'stream-type': [], //码流类型
    'application-type': [], //应用类型
    'camera-img-type': [], // 智能属性
    'main-dev-type': [], // 主设备类型
    'dev-access-mode': [], // 网络类型
    'ecs-alarm-type-scene':[],
    uvs_puconfig_intelligent_type: [], // 设备配置智能分析类型
    subscribe_type: [], // 订阅类型
    'decoder-type': [], // 云台协议
    'reliable-transmission-protocol': [], // 可靠传输
    'fec-matrix-percent': [], // 抗丢包率
    'stream-type': [], //码流类型
    'network-type': [], //网络类型
    'device-timezone-type': [], //时区
    subscribe_resources_type: [], //资源类别
    subscribe_result_pic_type: [], //返回图片约定
    camera_manufacturer: [], // 设备厂商类型
    'stream-encode-type': [], //编码格式
    'stream-trans-protocol': [], //传输协议
    status_type: [], // 设备状态
    'stream-resolution-type': [], //分辨率
    'stream-bit-rate': [], //码率
    'stream-frame-rate': [], //帧率
    'license-code': [], //控制项
    'license-describe': [], //描述
        // ipcProtocol网络协议类型
        ipc_protocol_type: [
          {
            name: 'HTTP',
            code: 0
          },
          {
            name: 'HTTPS',
            code: 1
          }
        ],
    //所有平台的设备协议类型
    drive_type_all: [
      {
        name:'T28181',
        code: 'T28181'
      },
      {
        name: 'EHOME',
        code: 'EHOME'
      },
      {
        name: 'ONVIF',
        code: 'ONVIF'
      },
      {
        name: 'HIKSDK',
        code: 'HIKSDK'
      },
      {
        name: 'HWSDK',
        code: 'HWSDK'
      },
      {
        name: 'HWSDK-ACREG',
        code: 'HWSDK-ACREG'
      },
      {
        name: 'DHSDK',
        code: 'DHSDK'
      },
      {
        name:'ABSDK',
        code: 'ABSDK'
      },
      {
        name: 'ONVIF1',
        code: 'ONVIF1'
      }
    ],
    'device-register-status': [],
    

    allocation_status: [
      {
        name: '未分配',
        code: 0
      },
      {
        name: '已分配',
        code: 1
      }
    ]
  },
  mutations: {
    SET_DICT_DATA(state, data) {
      state[data.dictCodes] = data.res
    },
  },
  actions: {
    // 系统字典表
   async getSysDictData({ commit, dispatch, state }, dictCodes) {
      for (let i = 0; i < dictCodes.length; i++) {
        if (state[dictCodes[i]].length == 0) {
          api.API.getDictionary({
            type: dictCodes[i],
          }).then((res) => {
            if (dictCodes == 'device-type') {
              dispatch('mapSet/get_checkedType', res.dictionaryList, {
                root: true,
              })
            }
            commit('SET_DICT_DATA', {
              dictCodes: dictCodes[i],
              res: res.dictionaryList || [],
            })
          })
        }
      }
    },
  },
}

export default dict
