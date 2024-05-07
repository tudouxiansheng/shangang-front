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
    getSysDictData({ commit, dispatch, state }, dictCodes) {
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
