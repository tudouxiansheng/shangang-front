<template>
  <!-- 镜头经纬度选择 -->
  <el-dialog
    :title="$t('deviceCamera.mapTitle')"
    v-model="$parent.longlatMapVisible"
    top="10vh"
    width="1070px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
    class="modify-map"
  >
    <div v-if="gisType == 3 || !gisType" class="no-map-service">
      <img :src="locale == 'zh' ? noServerImg.zh : noServerImg.en" alt />
    </div>
    <div v-if="gisType != 3" id="lngLatMap"></div>
    <div v-if="gisType == 2" class="search">
      <el-input
        v-model="address"
        :placeholder="$t('deviceManagement.inputSearchAddress')"
        clearable
        id="tipinput"
      ></el-input>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="locale == 'zh' ? '58px' : '98px'"
      label-position="left"
    >
      <div style="display: flex; padding: 10px 250px 30px">
        <div style="width: 50%; padding-right: 15px">
          <el-form-item :label="$t('public.longitude') + '：'" auto-complete="off" prop="longitude">
            <el-input
              @change="lnglatChange"
              v-model="form.longitude"
              :placeholder="$t('public.pleaseInputlongitude')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 50%; padding-left: 15px">
          <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
            <el-input
              @change="lnglatChange"
              v-model="form.latitude"
              :placeholder="$t('public.pleaseInputlatitude')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import loadMap from '@/utils/common/amap'
import ArcGIS from './utils/map'
import devIcon from '@/utils/common/dev-icon'
const { setDevImg } = devIcon()
import { markRaw } from 'vue'
let reg = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
let reg1 = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
export default {
  data() {
    let validateLongitude = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('public.pleaseInputlongitude')))
      } else if (value == 0) {
        callback(new Error(this.$t('public.longitudeError')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('public.longitudeError1')))
        }
        callback()
      }
    }
    let validateLatitude = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('public.pleaseInputlatitude')))
      } else if (value == 0) {
        callback(new Error(this.$t('public.latitudeError')))
      } else {
        if (!reg1.test(value)) {
          callback(new Error(this.$t('public.latitudeError1')))
        }
        callback()
      }
    }
    return {
      locale: localStorage.getItem('locale'),
      gisType: undefined,
      loading: false,
      address: '',
      form: {
        longitude: '',
        latitude: ''
      },
      rules: {
        longitude: [
          {
            required: true,
            validator: validateLongitude,
            trigger: 'blur'
          }
        ],
        latitude: [
          {
            required: true,
            validator: validateLatitude,
            trigger: 'blur'
          }
        ]
      },
      gdMap: null,
      ArcGISMap: null,
      ArcMap: null,
      placeSearch: null,
      marker: null,
      status: 1,
      ptzType: '1',
      noServerImg: {
        zh: require('@/assets/img/amap/noMapService.png'),
        en: require('@/assets/img/amap/noMapService-en.png')
      }
    }
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.get_gis_config()
        let form1 = this.$parent.form
        this.status = form1.status || 1
        this.ptzType = form1.ptzType || ''
        this.form.longitude = form1.longitude || ''
        this.form.latitude = form1.latitude || ''
      })
    },
    dialogClosed() {
      this.$parent.longlatMapVisible = false
      this.address = ''
    },
    async get_gis_config(data = { enable: true }) {
      await this.$store.dispatch('mapConfig/get_gis_config_initial')
      const res = await this.$store.dispatch('mapConfig/get_gis_config', data)
      const { form } = res
      this.gisType = form?.type
      if (this.gisType == 1) {
        this.initArcMap()
      } else if (this.gisType == 2) {
        this.initAMap()
      }
    },
    // 高德地图
    async initAMap() {
      if (!this.gdMap) {
        await loadMap()
        this.gdMap = new this.$AMap.Map('lngLatMap', {
          zoom: 10,
          resizeEnable: true
        })
      } else {
        this.gdMap.clearMap()
      }

      const auto = new this.$AMap.Autocomplete({ input: 'tipinput' }) // 输入提示
      this.placeSearch = new this.$AMap.PlaceSearch({
        gdMap: this.gdMap
      }) // 构造地点查询类
      this.$AMap.event.addListener(auto, 'select', this.select) // 注册监听，当选中某条记录时会触发

      if (this.form.longitude && this.form.latitude) {
        this.markerShow()
      }

      //点击事件
      this.gdMap.on('click', e => {
        this.form.longitude = e.lnglat.getLng()
        this.form.latitude = e.lnglat.getLat()
        this.markerShow()
      })
    },
    select(e) {
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name) // 关键字查询查询
      // if (e.poi.location) {
      //   this.longitude = e.poi.location.lng;
      //   this.latitude = e.poi.location.lat;
      //   this.markerShow();
      // }
    },
    // arcgis
    async initArcMap() {
      if (this.gdMap) {
        this.gdMap.destroy()
        this.ArcMap = null
      }
      if (!this.ArcMap) {
        this.ArcGISMap = markRaw(new ArcGIS({
          mapId: 'lngLatMap'
        }))
        this.ArcGISMap.init().then(async res => {
          this.ArcMap = markRaw(res.map)
          this.mainView = markRaw(res.mainView)
          this.ArcMap.basemap = this.ArcGISMap.baseLayer
          if (this.form.longitude && this.form.latitude) {
            this.arcMarkerShow()
          }
          this.mainView.on('click', evt => {
            let longitude = evt.mapPoint.longitude
            let latitude = evt.mapPoint.latitude
            this.form.longitude = String(longitude.toFixed(6))
            this.form.latitude = String(latitude.toFixed(6))
            this.arcMarkerShow()
          })
        })
      } else {
        this.ArcGISMap.clearMarker()
        if (this.form.longitude && this.form.latitude) {
          this.arcMarkerShow()
        }
      }
    },
    lnglatChange() {
      if (this.form.longitude == '' || this.form.latitude == '') return
      if (reg.test(this.form.longitude) && reg1.test(this.form.latitude)) {
        this.gisType == 1 ? this.arcMarkerShow() : this.markerShow()
      }
    },
    markerShow() {
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = null
      }
      let center = [Number(this.form.longitude), Number(this.form.latitude)]
      this.gdMap.setCenter(center) //设置地图中心点
      let icon = ''
      if (this.ptzType) {
        icon = new this.$AMap.Icon({
          size: new this.$AMap.Size(32, 32), // 图标尺寸
          image: setDevImg(this.ptzType, this.status) // Icon的图像
        })
      }
      // 将 Icon 实例添加到 marker 上:
      this.marker = new this.$AMap.Marker({
        position: [Number(this.form.longitude), Number(this.form.latitude)],
        icon: icon, // 添加 Icon 实例
        offset: new this.$AMap.Pixel(-16, -16),
        zoom: 13,
        clickable: true,
        zIndex: 10000
      })
      this.gdMap.add(this.marker)
    },
    arcMarkerShow() {
      let data = {
        longitude: parseFloat(this.form.longitude),
        latitude: parseFloat(this.form.latitude),
        deviceType: this.ptzType,
        status: this.status
      }
      this.ArcGISMap.clearMarker()
      this.ArcGISMap.createMarker(data)
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.form.longitude = this.form.longitude
          this.$parent.form.latitude = this.form.latitude

          this.$parent.longlatMapVisible = false
        } else {
          if (this.gisType == 1 || this.gisType == 2) {
            this.$message.warning(this.$t('deviceCamera.longlatClick'))
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.modify-map {
  .el-dialog__body {
    position: relative;
    padding: 15px 0 5px !important;
    .search {
      position: absolute;
      width: 160px;
      right: 35px;
      top: 25px;
      z-index: 99;
    }
    #lngLatMap {
      width: 1020px;
      margin: 0 auto;
    }
    .long-lat {
      margin-top: 10px;
      text-align: center;
      font-size: 16px;
      .long {
        display: inline-block;
      }
      .lat {
        display: inline-block;
        margin-left: 15px;
      }
    }
    .esriControlsBR {
      display: none;
    }
  }
  .el-input__inner,
  .el-input__wrapper {
    background: #ffffff !important;
    border-radius: 4px;
    border: 1px solid #fff !important;
  }
  .el-input__wrapper {
    border: 1px solid #e6e6e6 !important;
  }
  .no-map-service {
    width: 100%;
    overflow: auto;
    text-align: center;
    img {
      margin: 100px auto;
    }
  }
}
.amap-sug-result {
  z-index: 2099;
}
</style>
