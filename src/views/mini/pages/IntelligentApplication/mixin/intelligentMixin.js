import Dayjs from '../../../../../utils/Dayjs'
import { AllcamMap } from '../../../../../utils/map/AllcamMap'

export default {
  data() {
    return {
      imageUrl: '',
      timeType: 3,
      choseDeviceList: [],
      cameraNum: 0,
      pickerOptions: {
        selectableRange: ((time) => {
          console.log(time)
          let data = new Date()
          let hour = data.getHours()
          let minute = data.getMinutes()
          let second = data.getSeconds()
          return [`00:00:00-${hour}:${minute}:${second}`]
        })(),
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() > Date.now()
        },
      },
      tableData: [],
      total: 0,
      trackInfos: [],
      aggregationInfos: [],
      polyline: null,
      track: null,
      map: null,
      marker: [],
      queryForm: {
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    }
  },
  methods: {
    handleChangeDate() {
      this.timeType = 4
    },
    handleTrackOper(type) {
      if (type == 'remove') {
        if (AllcamMap.map) {
          AllcamMap.map.TrackAnimal.removeAll()
        }
        this.$EventBus.$emit('clear-markers')
      } else {
        if (AllcamMap.map) {
          AllcamMap.map.TrackAnimal.animalPlay()
        }
      }
    },
    handleClearTrack() {
      this.trackInfos = []
      if (AllcamMap.map && this.$store.state.personId) {
        AllcamMap.map.removeTrack(this.$store.state.personId)
      }
      if (this.track && this.polyline && this.map) {
        this.polyline.remove(this.map)
        this.track.remove(this.map)
        this.track.pauseMove()
      }
      for (let i = 0; i < this.marker.length; i++) {
        this.marker[i].remove()
      }
    },
    // 时间按钮发生变化时
    handleChangeQuickDateTime() {
      let s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
      let e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      // 如果是近三天
      if (this.timeType == 1) {
        s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是近七天
      else if (this.timeType == 2) {
        s = Dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是今日
      else if (this.timeType == 3) {
        s = Dayjs().format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else {
        s = ''
        e = ''
      }
      this.queryForm.beginTime = s
      this.queryForm.endTime = e
      this.$forceUpdate()
    },
  },
}
