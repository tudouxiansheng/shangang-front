<template>
  <!-- 显示图层 -->
  <div class="layer-show" :style="locale == 'en' ? 'width:440px' : ''">
    <div class="title">{{ $t('gis.displayLayer') }}</div>
    <i class="el-icon-close closeIcon" @click="closeBox" />

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template #title>
          <div class="content-title">
            <span>{{ $t('gis.equipmentResource') }}</span>
          </div>
        </template>
        <el-checkbox-group class="content-operator" v-model="checkedType" :min="1">
          <div
            v-for="(item, index) in devTypeList"
            :key="index"
            class="operator-item operator-item1"
          >
            <el-checkbox :label="item.value">
              <span class="checkbox-item-text">{{ item.name }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <div class="content-title">
            <span>{{ $t('gis.mapMark') }}</span>
          </div>
        </template>
        <div class="content-operator">
          <div class="operator-item2">
            <span :style="locale == 'en' ? 'width:130px' : ''">
              {{ $t('gis.mapResourceName') }}
            </span>
            <el-switch
              class="item-text"
              v-model="markerLabelShow"
              active-color="#2C6DD2"
              inactive-color="#C1C7D0"
            />
          </div>
          <div class="operator-item2">
            <span :style="locale == 'en' ? 'width:147px' : ''">
              {{ $t('gis.deviceAlarmAnimation') }}
            </span>
            <el-switch
              class="item-text"
              v-model="alarmAnimationShow"
              active-color="#2C6DD2"
              inactive-color="#C1C7D0"
            />
          </div>
          <div class="operator-item2">
            <span :style="locale == 'en' ? 'width:130px' : ''">
              {{ $t('gis.mapCenterPoint') }}
            </span>
            <el-switch
              class="item-text"
              v-model="mapCenterShow"
              active-color="#2C6DD2"
              inactive-color="#C1C7D0"
            />
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <div class="content-title">
            <span>{{ $t('gis.mapLevel') }}</span>
          </div>
        </template>
        <el-checkbox-group class="content-operator" v-model="layerType">
          <div v-for="(item, index) in layerList" :key="index" class="operator-item operator-item2">
            <el-checkbox :label="item.value">
              <span class="checkbox-item-text">{{ item.name }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: '1',
      locale: localStorage.getItem('locale'),
      layerList: [
        // {
        //   value: '1',
        //   name: this.$t('gis.griddedLayer')
        // },
        {
          value: '2',
          name: this.$t('gis.imageLayer')
        },
        {
          value: '3',
          name: this.$t('gis.trafficLayer')
        }
      ]
    }
  },
  computed: {
    // 设备展示类型
    checkedType: {
      get() {
        return this.$store.state.mapSet.checkedType
      },
      set(val) {
        this.$store.commit('mapSet/set_checkedType', val)
        this.$parent.cameraIfVisible(val)
      }
    },
    // 地图资源名称
    markerLabelShow: {
      get() {
        return this.$store.state.mapSet.markerLabelShow
      },
      set(val) {
        this.$store.commit('mapSet/set_markerLabelShow', val)
        this.$parent.showMarkerLabel(val)
      }
    },
    // 设备告警动画
    alarmAnimationShow: {
      get() {
        return this.$store.state.mapSet.alarmAnimationShow
      },
      set(val) {
        if (!val) this.$parent.alarm_Intreval()
        this.$store.commit('mapSet/set_alarmAnimationShow', val)
      }
    },
    // 地图中心点
    mapCenterShow: {
      get() {
        return this.$store.state.mapSet.mapCenterShow
      },
      set(val) {
        this.$store.commit('mapSet/set_mapCenterShow', val)
        this.$parent.centerMarkerShow(val)
      }
    },
    // 地图层级展示
    layerType: {
      get() {
        return this.$store.state.mapSet.layerType
      },
      set(val) {
        this.$store.commit('mapSet/set_layerType', val)
        this.$parent.openTileLayer(val, true)
      }
    },
    ...mapState({
      devTypeList: state => state.dict['device-type'] // 摄像机类型
    })
  },

  methods: {
    closeBox() {
      this.$store.commit('mapSet/set_toolbarIndex', -1)
    }
  }
}
</script>

<style lang="scss">
.layer-show {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  width: 350px;
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
  .el-collapse {
    margin: 0 20px 20px;
    border: none;
    .el-collapse-item__header {
      padding: 20px 0;
      height: 16px;
      line-height: 16px;
      border-bottom: 1px dashed #ebecf0;
      box-sizing: content-box;
      .el-icon-arrow-right:before {
        color: #c1c7d0;
      }
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .content-title {
      font-size: 16px;
      font-weight: 400;
      color: #232c3b;
      line-height: 16px;
      position: relative;
      span {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        margin-left: 10px;
      }
      &::before {
        content: ' ';
        position: absolute;
        width: 4px;
        height: 16px;
        left: 0;
        bottom: 0;
        background-color: #2c6dd2;
      }
    }
    .el-collapse-item__wrap {
      .content-operator {
        padding: 10px 0;
        .operator-item {
          .el-checkbox__input.is-checked .el-checkbox__inner,
          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background: #2c6dd2;
          }
          .el-checkbox__input.is-disabled .el-checkbox__inner {
            background-color: #edf2fc;
            border-color: #dcdfe6;
          }
          .checkbox-item-text,
          .el-checkbox__input.is-checked + .el-checkbox__label {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #232c3b;
          }
        }
        .operator-item1 {
          width: 33%;
          display: inline-block;
          padding: 10px 0;
        }
        .operator-item2 {
          width: 50%;
          display: inline-block;
          padding: 10px 0;
          & > span {
            display: inline-block;
            width: 80px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
