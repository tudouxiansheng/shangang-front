import { mapState } from 'vuex'
var getDevIcon = {
  data() {
    return {
      getDevFlag: true,
    }
  },
  computed: {
    ...mapState({
      devTypeList: (state) => state.dict['device-type'], // 摄像机类型
    }),
  },
  mounted() {
    
  },
  methods: {
    // 设备状态
    setStatus(val) {
      let name = ''
      ;[
        {
          name: this.$t('gis.statustype0'),
          value: 0,
        },
        {
          name: this.$t('gis.statustype1'),
          value: 1,
        },
        {
          name: this.$t('gis.statustype2'),
          value: 2,
        },
        {
          name: this.$t('gis.statustype3'),
          value: 3,
        },
      ].filter((item) => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    // 设备类型
    setDevType(val) {
      let name = ''
      this.devTypeList.filter((item) => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
  },
}

export default getDevIcon
