<template>
  <!-- 设置地图信息 -->
  <div class="set-map-info">
    <div class="title">{{ $t('gis.mapInfo') }}</div>
    <i class="el-icon-close closeIcon" @click="closeBox" />

    <div class="map-form">
      <el-form
        ref="form"
        :model="mapCenterInfo"
        :rules="rules"
        :label-width="locale == 'en' ? '140px' : '100px'"
        label-position="right"
      >
        <el-form-item :label="$t('gis.mapZoom') + '：'" prop="mapZoom">
          <el-select v-model="mapCenterInfo.level">
            <el-option
              v-for="(item, index) in levelList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('gis.mapCenter') + '：'" prop="centerLngLat">
          <el-input
            v-model="mapCenterInfo.centerLngLat"
            auto-complete="off"
            :placeholder="$t('gis.mapCenterPrompt')"
            clearable
          />
        </el-form-item>
      </el-form>

      <div class="footer">
        <el-button type="primary" class="reset" @click="formReset">
          {{ $t('gis.reset') }}
        </el-button>
        <el-button type="primary" :loading="maskloading" @click="submitForm">
          {{ $t('gis.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    var reg = /^-?((([1-9]\d?|1[0-7]\d)(\.\d{1,8})?)|180)$/
    var reg1 = /^-?(([1-8]\d?(\.\d{1,8})?)|90)$/
    var validateCenterLngLat = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!value.split(',')[1]) {
          callback(new Error(this.$t('gis.mapCenterPrompt1')))
        } else {
          if (value.split(',')[0] == 0) {
            callback(new Error(this.$t('gis.longitudeError')))
          } else if (!reg.test(value.split(',')[0])) {
            callback(new Error(this.$t('gis.longitudeError1')))
          } else if (value.split(',')[1] == 0) {
            callback(new Error(this.$t('gis.latitudeError')))
          } else if (!reg1.test(value.split(',')[1])) {
            callback(new Error(this.$t('gis.latitudeError1')))
          }
        }
        callback()
      }
    }
    return {
      levelList: ['11', '12', '13', '14', '15', '16', '17', '18'],
      rules: {
        centerLngLat: [{ validator: validateCenterLngLat, trigger: 'blur' }]
      },
      maskloading: false,
      locale: localStorage.getItem('locale')
    }
  },
  computed: {
    ...mapState({
      mapCenterInfo: state => state.mapSet.mapCenterInfo
    })
  },
  methods: {
    closeBox() {
      this.$store.commit('mapSet/set_toolbarIndex', -1)
    },
    formReset() {
      this.$store.commit('mapSet/set_mapCenterInfo', {
        level: '',
        centerLngLat: ''
      })
      this.$refs.form.clearValidate()
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.maskloading = true
          let data = {
            level: this.mapCenterInfo.level,
            open: 0,
            userId: sessionStorage.getItem('userId')
          }
          let centerLngLat = this.mapCenterInfo.centerLngLat.split(',')
          if (centerLngLat[1]) {
            Object.assign(data, {
              longitude: centerLngLat[0],
              latitude: centerLngLat[1]
            })
          } else {
            Object.assign(data, {
              longitude: '0',
              latitude: '0'
            })
          }
          const res = await this.$api.getCenterPointInfo(data)
          if (res.resultCode == 0) {
            this.$message.success(this.$t('gis.setSucc'))
            this.$store.commit('mapSet/set_mapCenterInfo', {
              level: this.mapCenterInfo.level,
              centerLngLat: centerLngLat[1] ? centerLngLat[0] + ',' + centerLngLat[1] : ''
            })
            // 设置成功后定位地图
            this.mapCenterInfo.level && this.$parent.map.setZoom(this.mapCenterInfo.level)
            centerLngLat[1] &&
              this.$parent.map.setCenter(new this.$AMap.LngLat(centerLngLat[0], centerLngLat[1]))
          }
          this.maskloading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.set-map-info {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  z-index: 999;
  .title {
    height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #232c3b;
    padding: 16px 20px 20px;
    border-bottom: 1px solid #ebecf0;
    box-sizing: content-box;
  }
  .closeIcon {
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 16px;
    font-size: 16px;
  }
  .map-form {
    padding: 20px;
    .el-form-item__label {
      color: #333;
    }
    .el-input__inner {
      background: transparent;
      border: 1px solid #c1c7d0;
      color: #7a869a;
    }
    .el-form-item__error {
      color: #fff;
      font-size: 12px;
      line-height: 1;
      position: absolute;
      top: 78%;
      left: 20px;
      padding: 4px 5px;
      border-radius: 5px;
      background: #ea5200;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      &:before {
        border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #ea5200;
        border-style: solid;
        border-width: 6px;
        content: '';
        height: 0;
        left: 15px;
        position: absolute;
        top: -11px;
      }
    }
    .footer {
      text-align: center;

      .el-button {
        width: 100px;
        height: 36px;
      }
      .reset {
        border: 1px solid #2c6dd2;
        background: transparent;
        color: #2c6dd2;
      }
    }
  }
}
</style>
