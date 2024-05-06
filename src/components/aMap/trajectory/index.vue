<template>
  <!-- 轨迹 -->
  <div class="trajectory">
    <div class="title">{{ $t('trajectory.trajectory') }}</div>
    <i class="el-icon-close closeIcon" @click="closeBox" />

    <div class="operator">
      <div class="operator-item">
        <el-radio-group v-model="searchRadio" @change="radioChange">
          <el-radio :label="1">{{ $t('gis.areaSearch') }}</el-radio>
          <el-radio :label="0">{{ $t('gis.lnglatSearch') }}</el-radio>
        </el-radio-group>
      </div>
      <div class="flex operator-item">
        <el-input
          v-model="searchText"
          clearable
          :placeholder="searchRadio ? $t('gis.areaSearch') : $t('gis.mapCenterPrompt')"
        />
        <el-button type="primary" @click="searchOfMap">
          {{ $t('gis.search') }}
        </el-button>
      </div>

      <div class="operator-item">
        <el-date-picker
          v-model="timeDate"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="-"
          align="right"
          :start-placeholder="$t('gis.startTimePrompt')"
          :end-placeholder="$t('gis.endTimePrompt')"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="operator-item">
        <el-button type="primary" @click="realTimeTrajectory">
          {{ realTimeTrajectoryDisplay ? $t('trajectory.realTimeTrajectory') : $t('trajectory.closeTrajectory') }}
        </el-button>
        <el-button type="primary" @click="searchTrajectory">
          {{ $t('trajectory.searchTrajectory') }}
        </el-button>
      </div>
    </div>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template #title>
          <div class="content-title">
            <span>{{ $t('gis.devDetail') }}</span>
          </div>
        </template>
        <ul class="camera-info">
          <li>
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''"> {{ $t('gis.devName') }}： </span>
            <span class="item-text" :style="locale == 'en' ? '' : 'width: 215px;'" :title="cameraInfo.deviceName">
              {{ cameraInfo.deviceName }}
            </span>
          </li>
          <li>
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''"> {{ $t('gis.devStatus') }}： </span>
            <span
              class="item-text"
              :style="locale == 'en' ? '' : 'width: 215px;'"
              :title="setStatus(cameraInfo.status)"
            >
              {{ setStatus(cameraInfo.status) }}
            </span>
          </li>
          <li>
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''"> {{ $t('gis.devType') }}： </span>
            <span
              class="item-text"
              :style="locale == 'en' ? '' : 'width: 215px;'"
              :title="setDevType(cameraInfo.deviceType)"
            >
              {{ setDevType(cameraInfo.deviceType) }}
            </span>
          </li>
          <li>
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''"> {{ $t('gis.devLngLat') }}： </span>
            <span
              class="item-text"
              :style="locale == 'en' ? '' : 'width: 215px;'"
              :title="cameraInfo.longitude ? cameraInfo.longitude + ',' + cameraInfo.latitude : ''"
            >
              {{ cameraInfo.longitude ? cameraInfo.longitude + ',' + cameraInfo.latitude : '' }}
            </span>
          </li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <div class="content-title">
            <span>{{ $t('trajectory.historyTrajectory') }}</span>
          </div>
        </template>
        <el-table :data="tableData" max-height="200">
          <el-table-column :label="$t('trajectory.trajectoryDate')" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.reportTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('gis.operating')" min-width="70">
            <template #default="{ row }">
              <span
                :id="'span-play-' + row.index"
                type="primary"
                style="color: #2c6dd2; cursor: pointer"
                @click="beginAmove(row)"
              >
                {{ $t('trajectory.play') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import devDict from '@/mixin/dev-dict.js'
export default {
  props: {
    map: {
      type: Object,
      default: () => {},
    },
    cameraInfo: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [devDict],
  data() {
    return {
      activeName: '',

      searchRadio: 1,
      searchText: '',
      locale: localStorage.getItem('locale'),
      timeDate: null,
      pickerOptions: {
        disabledDate(time) {
          let curDate = Date.now()
          return time.getTime() > curDate
        },
      },
      // 历史轨迹
      tableData: [],
      locusList: [],
      locusList1: [],

      realTimeTrajectoryDisplay: true,
      trajectoryTimers: null, // 定时器
      millisecond: null,

      getDevFlag: false,
    }
  },
  mounted() {
    this.$EventBus.$on('closeRealTimeTrajectory', this.closeRealTimeTrajectory)
  },
  beforeDestroy() {
    this.closeRealTimeTrajectory()
  },
  methods: {
    closeBox() {
      this.$store.commit('mapSet/set_toolbarIndex', -1)
    },
    radioChange() {
      this.searchText = ''
    },
    searchOfMap() {
      if (!this.searchText) {
        this.$message({
          message: this.searchRadio ? this.$t('gis.areaSearchPrompt') : this.$t('gis.lnglatSearchPrompt2'),
          type: 'warning',
        })
      } else {
        this.searchRadio ? this.searchArea() : this.searchLnglat()
      }
    },
    searchArea() {
      if (!this.district) {
        // 实例化DistrictSearch
        var opts = {
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: 'all', // 返回行政区边界坐标组等具体信息
          level: 'district', // 查询行政级别为 市
        }
        this.district = new this.$AMap.DistrictSearch(opts)
      }
      this.district.search(this.searchText, (status, result) => {
        const districtList = result.districtList
        if (districtList) {
          let center = {
            longitude: districtList[0].center.lng,
            latitude: districtList[0].center.lat,
          }
          this.$parent.setMapCenterAndZoom(center, 14)
        } else {
          this.$message({
            message: this.$t('gis.areaSearchPrompt1'),
            type: 'warning',
          })
        }
      })
    },
    searchLnglat() {
      if (this.searchText.split(',')[1]) {
        let reg = /^-?((([1-9]\d?|1[0-7]\d)(\.\d{1,8})?)|180)$/
        let reg1 = /^-?(([1-8]\d?(\.\d{1,8})?)|90)$/
        let latlng = this.searchText.split(',')
        if (latlng[0] == 0) {
          this.$message.warning(this.$t('gis.longitudeError'))
        } else if (!reg.test(latlng[0])) {
          this.$message.warning(this.$t('gis.longitudeError1'))
        } else if (latlng[1] == 0) {
          this.$message.warning(this.$t('gis.latitudeError'))
        } else if (!reg1.test(latlng[1])) {
          this.$message.warning(this.$t('gis.latitudeError1'))
        } else {
          let center = {
            longitude: this.searchText.split(',')[0],
            latitude: this.searchText.split(',')[1],
          }
          this.$parent.setMapCenterAndZoom(center, 14)
        }
      } else {
        this.$message({
          message: this.$t('gis.mapCenterPrompt1'),
          type: 'warning',
        })
      }
    },

    // 实时轨迹
    realTimeTrajectory() {
      if (this.cameraInfo.deviceId && this.cameraInfo.deviceType == 5) {
        if (this.cameraInfo.status == 1) {
          this.realTimeTrajectoryDisplay ? this.openRealTimeTrajectory() : this.closeRealTimeTrajectory()
        } else {
          this.$message.warning(this.$t('trajectory.trajectoryDevChoosePrompt2'))
        }
      } else {
        this.$message.warning(this.$t('trajectory.trajectoryDevChoosePrompt1'))
      }
    },
    // 打开实时轨迹
    async openRealTimeTrajectory() {
      this.realTimeTrajectoryDisplay = false
      this.millisecond = Date.now()
      const locusList = await this.getLocusList(
        this.dayjs(new Date(this.millisecond)).format('YYYY-MM-DD HH:mm:ss'),
        this.dayjs(new Date(this.millisecond + 10 * 1000)).format('YYYY-MM-DD HH:mm:ss')
      )
      this.locusList1 = locusList.length > 1 ? locusList.slice(0, 1) : locusList
      this.$bus.$emit('initPathSimplifier', { locusList: this.locusList1, flag: false })
      this.trajectoryTimers = setInterval(async () => {
        this.millisecond += 10 * 1000
        const locusList1 = await this.getLocusList(
          this.dayjs(new Date(this.millisecond)).format('YYYY-MM-DD HH:mm:ss'),
          this.dayjs(new Date(this.millisecond + 10 * 1000)).format('YYYY-MM-DD HH:mm:ss')
        )
        if (locusList1.length == 0) return
        this.locusList1 = this.locusList1.concat(locusList1)
        this.$bus.$emit('realTimeLocus', locusList1[0])
      }, 10000)
    },
    // 关闭实时轨迹
    closeRealTimeTrajectory() {
      this.trajectoryTimers && clearInterval(this.trajectoryTimers)
      this.trajectoryTimers = null
      this.locusList1 = []
      this.realTimeTrajectoryDisplay = true
    },

    // 获取历史轨迹
    async searchTrajectory() {
      if (this.cameraInfo.deviceId && this.cameraInfo.deviceType == 5) {
        if (this.timeDate) {
          let startTime = new Date(this.timeDate[0]) // 开始时间
          let endTime = new Date(this.timeDate[1]) // 结束时间
          let usedTime = (endTime - startTime) / (24 * 60 * 60 * 1000)
          if (usedTime > 1) {
            this.$message.warning(this.$t('trajectory.trajectoryDateChoosePrompt2'))
            return
          }

          this.locusList = await this.getLocusList(this.timeDate[0], this.timeDate[1])

          if (this.locusList.length != 0) {
            this.tableData = [
              {
                reportTime: this.timeDate[0] + '-' + this.timeDate[1],
              },
            ]
          } else {
            this.tableData = []
          }
          this.activeName = '2'
        } else {
          this.$message.warning(this.$t('trajectory.trajectoryDateChoosePrompt1'))
        }
      } else {
        this.$message.warning(this.$t('trajectory.trajectoryDevChoosePrompt1'))
      }
    },

    async getLocusList(beginTime, endTime) {
      let data = {
        deviceId: this.cameraInfo.deviceId,
        beginTime,
        endTime,
      }
      const res = await this.$api.getDeviceHistoryLocationList(data)
      return res.deviceLocationReportInfoList || []
    },

    // 播放
    beginAmove() {
      this.closeRealTimeTrajectory() // 关闭实时轨迹
      this.$bus.$emit('initPathSimplifier', { locusList: this.locusList, flag: true })
    },
  },
}
</script>

<style lang="scss" scoped>
.trajectory {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  width: 380px;
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
  .operator {
    padding: 20px 0 0;
    margin: 0 20px;
    border-bottom: 1px dashed #ebecf0;
    .flex {
      display: flex;
    }
    .operator-item {
      margin-bottom: 20px;
      .el-radio {
        line-height: 24px;
      }
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #2c6dd2;
        background: #fff;
      }
      .el-radio__inner::after {
        width: 8px;
        height: 8px;
        background: #2c6dd2;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #2c6dd2;
      }
      .el-radio__label {
        font-size: 14px;
        font-weight: 400;
        color: #7a869a;
      }
      .el-input {
        margin-right: 10px;
      }
      .el-date-editor {
        width: 340px;
        .el-range-input,
        .el-range-separator {
          color: #232c3b;
        }
      }
      .el-input__inner {
        height: 32px;
        border: 1px solid #c1c7d0;
        border-radius: 4px;
        background: transparent;
        color: #232c3b;
      }
      .el-button {
        height: 32px;
        background: #2c6dd2;
        border: 1px solid #2c6dd2;
        border-radius: 4px;
      }
    }
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
      border: none;
      .camera-info {
        li {
          padding: 10px 0;
          font-size: 14px;
          font-weight: 400;
          color: #232c3b;
          .item-label {
            display: inline-block;
            width: 90px;
          }
          .item-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            overflow: hidden;
            width: 115px;
            display: inline-block;
            vertical-align: bottom;
          }
        }
      }
      .el-table {
        color: #232c3b;
        margin: 20px 0;
        font-size: 14px;
        thead {
          color: #232c3b;
        }
        th,
        tr {
          background: transparent;
          text-align: left;
        }
        .cell {
          text-align: left;
        }
        td,
        th.is-leaf {
          border: none;
        }
        .el-table--border:after,
        .el-table--group:after,
        &:before {
          background: transparent;
        }
        .el-table__fixed-right::before,
        .el-table__fixed::before {
          background: transparent;
        }
        .el-table__empty-block {
          background: transparent;
        }
        .el-table__empty-text {
          color: #232c3b;
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      background-color: #f2f2f2 !important;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      background-color: #b3b3b3 !important;
    }

    // 定义滚动条轨道 边角
    ::-webkit-scrollbar-corner {
      background-color: #f2f2f2 !important;
    }
  }
}
</style>
