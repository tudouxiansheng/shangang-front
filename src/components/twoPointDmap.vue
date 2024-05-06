<template>
  <div ref="map" id="mapindex"></div>
</template>

<script>
import Map from '../utils/tmap/map'
import Spline from '../utils/tmap/Spline'

export default {
  name: 'twoPointDmap',
  props: {
    mapIp: '',
    latitude: '',
    longitude: '',
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    accessToken: String,
  },
  watch: {
    options() {
      console.warn('目前不支持修改options，请使用map直接操作！')
    },
  },
  data() {
    return {
      clientHeight: '',
    }
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight
    const map = new Map({
      container: this.$refs.map,
      ...this.options,
    })
    console.log(map, 'map222')
    // this.$emit("init", map);
    this.handlerMapInit(map)
  },
  methods: {
    handlerMapInit(map) {
      map.loadMap(this.mapIp + '/map-source')
      console.log(this.mapIp + '/map-source')
      // map.loadMap('http://172.16.21.41:10000/map')
      map.on('click', (e) => {
        console.log(e.lngLat.toArray())
      })
      map.once('load', () => {
        this.loadBillboard(map) //添加图标
        this.loadCircle(map) //添加波动圈
        this.loadLine(map) //添加线
        this.loadPoint(map) //添加点
      })
    },
    loadBillboard(map) {
      const billboard = map.createLayer({
        type: 'billboard',
        style: {
          //通用样式
          image: `${location.origin}/static/images/icon/2.png`, //图片地址
          scale: 0.5, //原始图片缩放尺寸
        },
      })
      billboard.setData([
        {
          position: [103.94060438603685, 30.778833333763274],
        },
        {
          position: [103.94112361644011, 30.7787484737769],
          style: {
            //自定义样式
            scale: 0.2,
          },
          attr: {
            id: 1,
          },
        },
      ])
      billboard.on('click', (e) => {
        console.log('billboard click', e)
      })
      window.billboard = billboard
    },
    loadCircle(map) {
      const circle = map.createLayer({
        type: 'circle',
        style: {
          //通用样式
          color: '#3388ff', //颜色
          size: 50, //尺寸
          duration: 1000, //持续时间
        },
      })
      circle.setData([
        {
          position: [103.94047369027714, 30.778354237082638],
          attr: {
            id: 1,
          },
        }, //不支持自定义样式
      ])
      circle.on('click', (e) => {
        console.log('circle click', e)
      })
    },
    loadLine(map) {
      const line = map.createLayer({
        type: 'line',
        style: {
          //通用样式
          color: '#3388ff',
          width: 1,
        },
      })
      // delay（大于获取数据的频率）
      const spline = new Spline({ delay: 5000 })

      const arr = [
        [103.94047369027714, 30.778354237082638],
        [103.940192777378, 30.778719187402643],
        [103.94090008335434, 30.77913796911703],
        [103.94114756503569, 30.778869890215603],
        [103.94069219946596, 30.7784631912685],
        [103.9411662658789, 30.7782773972107],
      ]
      spline.start((positions) => {
        line.setData([{ position: positions }])
      })

      spline.update(arr.shift())
      setInterval(() => {
        spline.update(arr.shift()) //从接口更新人员位置
      }, 3000)
      line.on('click', (e) => {
        console.log('line click', e)
      })
    },
    loadPoint(map) {
      const point = map.createLayer({
        type: 'point',
        style: {
          color: 'red',
          radius: 10,
          //通用样式
        },
      })
      point.setData([
        {
          position: [103.94105566751989, 30.779028858727315],
        },
        {
          position: [103.94079386985442, 30.778265380608914],
          style: {
            radius: 5,
            //自定义样式
          },
          attr: {
            id: 1,
          },
        },
      ])
      point.on('click', (e) => {
        console.log('point click', e)
      })
    },
  },
}
</script>

<style>
.mapboxgl-ctrl {
  display: none !important;
}
#mapindex {
  width: 100%;
  height: 1000px;
}
</style>
