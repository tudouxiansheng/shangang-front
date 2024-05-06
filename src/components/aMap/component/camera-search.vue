<template>
  <!-- 框选设备 -->
  <div class="camera-search" :style="locale == 'en' ? 'width: 405px;' : ''">
    <div class="title">
      <el-input
        v-model="cameraName"
        clearable
        :placeholder="$t('gis.cameraNameSearch')"
        :style="locale == 'en' ? 'width: 325px;' : ''"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="cameraSearch" />
        </template>
      </el-input>
      <div class="closeSearch" @click="closeSearch">
        <i class="el-icon-d-arrow-left arrow-left" />
      </div>
    </div>
    <ul v-show="resultList.length != 0" class="search-result">
      <li v-for="(item, index) in resultList" :key="index">
        <div class="devName">
          <i :class="iconSty(item)" class="aci icons" />
          <span>{{ item.deviceName }}</span>
        </div>
        <i class="el-icon-top" @click="locateMap(item)" />
        <div class="status">
          <span>{{ setStatus(item.status) }}</span>
          <span>{{ item.longitude }}, {{ item.latitude }}</span>
        </div>
      </li>
    </ul>
    <div v-show="searchFlag && resultList.length == 0" class="noData">
      {{ $t('gis.noData') }}
    </div>
  </div>
</template>

<script>
import devIcon from '@/utils/dev-icon.js'
const { getDevIcon } = devIcon()
export default {
  props: {
    map: {
      type: Object,
      default: () => {}
    },
    cameraList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      cameraName: '',
      resultList: [],
      searchFlag: false,
      locale: localStorage.getItem('locale')
    }
  },
  methods: {
    closeSearch() {
      this.$parent.searchShow = false
      this.cameraName = ''
      this.resultList = []
      this.searchFlag = false
    },
    cameraSearch() {
      this.searchFlag = true
      if (this.cameraName == '') {
        this.resultList = []
        return
      }
      let arr = []
      this.cameraList.forEach(item => {
        if (item.deviceName.indexOf(this.cameraName) != -1 && item.visible) arr.push(item)
      })
      this.resultList = arr
      //   this.logMapBounds(val);
    },
    // 获取当前可视范围设备含有关键字
    logMapBounds(cameraName) {
      const bounds = this.map.getBounds()
      const NorthEast = bounds.getNorthEast()
      const SouthWest = bounds.getSouthWest()
      const SouthEast = [NorthEast.lng, SouthWest.lat]
      const NorthWest = [SouthWest.lng, NorthEast.lat]
      const path = [
        [NorthEast.lng, NorthEast.lat],
        SouthEast,
        [SouthWest.lng, SouthWest.lat],
        NorthWest
      ] // 将地图可视区域四个角位置按照顺序放入path，用于判断point是否在可视区域
      let arr = []
      this.cameraList.forEach(item => {
        if (item.deviceName.indexOf(cameraName) != -1 && item.visible) {
          const isPointInRing = this.$AMap.GeometryUtil.isPointInRing(
            new this.$AMap.LngLat(item.longitude, item.latitude),
            path
          ) // 判断point是否在可视区域

          if (isPointInRing) arr.push(item)
        }
      })
      this.resultList = arr
    },
    setStatus(val) {
      let name = ''
      if (val == 0) {
        name = this.$t('gis.statustype0')
      } else if (val == 1) {
        name = this.$t('gis.statustype1')
      } else if (val == 2) {
        name = this.$t('gis.statustype2')
      } else if (val == 3) {
        name = this.$t('gis.statustype3')
      }
      return name
    },
    iconSty(item) {
      const status = item.status
      const deviceType = item.deviceType
      return getDevIcon(status, deviceType)
    },
    locateMap(item) {
      this.$emit('cameraLocation', item)
    }
  }
}
</script>

<style lang="scss">
.camera-search {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  width: 360px;
  z-index: 990;
  .title {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 280px;
      .el-input__inner {
        background-color: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
      }
      .el-button {
        min-width: 30px;
      }
    }

    .closeSearch {
      padding: 2px;
      border: 2px solid #7a869a;
      border-radius: 50%;
      cursor: pointer;
      width: 16px;
      height: 16px;
      margin-top: 6px;
      box-sizing: content-box;
      .el-icon-d-arrow-left:before {
        color: #7a869a;
      }
      .arrow-left {
        text-align: center;
        transform: rotate(90deg);
        color: #7a869a;
        font-size: 16px;
        font-weight: 900;
      }
    }
  }

  .search-result {
    border-top: 1px solid #ebecf0;
    max-height: 370px;
    overflow: auto;
    li {
      padding: 20px 0;
      margin: 0 20px;
      border-bottom: 1px solid #ebecf0;
      position: relative;
      .devName,
      .status,
      .el-icon-top {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #7a869a;
      }
      .devName {
        color: #232c3b;
      }
      .el-icon-top {
        position: absolute;
        right: 0px;
        top: 20px;
        cursor: pointer;
        &:hover {
          color: #2c6dd2;
        }
      }
      .status {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      background-color: #f2f2f2 !important;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      background-color: #b3b3b3 !important;
    }

    // 定义滚动条轨道 边角
    &::-webkit-scrollbar-corner {
      background-color: #f2f2f2 !important;
    }
  }
  .noData {
    text-align: center;
    padding: 20px 0;
    color: #7a869a;
    border-top: 1px solid #ebecf0;
  }
}
</style>
