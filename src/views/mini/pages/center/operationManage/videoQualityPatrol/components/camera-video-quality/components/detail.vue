<template>
  <div ref="cameraVideoQualityDetail" class="cameraVideoQualityDetail" v-if="isRouterAlive">
    <el-page-header
      @back="goBack"
      :content="cameraName + $t('public.particulars')"
    ></el-page-header>
    <collapse-card
      v-loading="loading1"
      :title="$t('videoQualityPatrol.baseInfo')"
      collapse
      hideCollapse
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <span>{{ $t('videoQualityPatrol.cameraName') }}：</span>
          <span>{{ cameraName }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ $t('videoQualityPatrol.cameraId') }}：</span>
          <span>{{ cameraId }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ $t('videoQualityPatrol.isExists') }}：</span>
          <span>{{ connectFormatter(exists, 1) }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ $t('videoQualityPatrol.searchCount') }}：</span>
          <span>{{ total }}</span>
        </el-col>
      </el-row>
    </collapse-card>
    <collapse-card :title="$t('videoQualityPatrol.testResult')" collapse hideCollapse>
      <el-row>
        <el-date-picker
          v-model="times1"
          type="datetimerange"
          :range-separator="$t('public.to')"
          :start-placeholder="$t('public.startTimePrompt')"
          :end-placeholder="$t('public.endTimePrompt')"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        ></el-date-picker>
        <el-button type="primary" class="ml-10" @click="getCameraQualityList(times1, 1)">
          {{ $t('videoQualityPatrol.search') }}
        </el-button>
      </el-row>
      <el-row>
        <p v-if="locale === 'zh'" class="tip">
          {{
            $t('videoQualityPatrol.ResultTipStart') +
            times1[0] +
            $t('public.to') +
            times1[1] +
            $t('videoQualityPatrol.ResultTipEnd1') +
            tableData.length +
            $t('videoQualityPatrol.ResultTipEnd2')
          }}
        </p>
        <p v-else class="tip">
          {{
            $t('videoQualityPatrol.ResultTipStart') +
            ' ' +
            times1[0] +
            ' ' +
            $t('public.to') +
            ' ' +
            times1[1] +
            ' ' +
            $t('videoQualityPatrol.ResultTipEnd1') +
            ' ' +
            tableData.length +
            ' ' +
            $t('videoQualityPatrol.ResultTipEnd2')
          }}
        </p>
      </el-row>
      <el-row :gutter="60" class="mt-7">
        <el-col :span="10">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="400"
            @row-click="rowClickHandle"
          >
            <el-table-column type="index" :label="$t('videoQualityPatrol.index')" width="50" />
            <el-table-column prop="startTime" :label="$t('videoQualityPatrol.startTime')" />
            <el-table-column prop="endTime" :label="$t('videoQualityPatrol.endTime')" />
            <el-table-column
              prop="result"
              :label="$t('videoQualityPatrol.result')"
              :formatter="resultNewestFormatter"
            />
          </el-table>
        </el-col>
        <el-col
          :span="14"
          class="test-info"
          v-if="tableData.length == 0 || resultNewestFormatter(itemData) == ''"
        >
          <el-empty
            :image="errorImage"
            :image-size="300"
            :description="$t('public.noData')"
          ></el-empty>
        </el-col>
        <el-col :span="14" class="test-info" v-else>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.getUrlDur') }}：</span>
              <span>
                {{ itemData.getUrlDur || itemData.getUrlDur == 0 ? itemData.getUrlDur + 'ms' : '' }}
              </span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.recvStreamDur') }}：</span>
              <span>
                {{
                  itemData.recvStreamDur || itemData.recvStreamDur == 0
                    ? itemData.recvStreamDur + 'ms'
                    : ''
                }}
              </span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.detectDur') }}：</span>
              <span>
                {{ itemData.detectDur || itemData.detectDur == 0 ? itemData.detectDur + 'ms' : '' }}
              </span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.protocolType') }}：</span>
              <span>{{ itemData.protocolType }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.isConnect') }}：</span>
              <span>
                {{ connectFormatter(itemData.connect, 2) }}
              </span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.rtspIsConnect') }}：</span>
              <span>{{ connectFormatter(itemData.handshake, 2) }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.firstFrame') }}：</span>
              <span>
                {{
                  itemData.firstFrame || itemData.firstFrame == 0 ? itemData.firstFrame + 'ms' : ''
                }}
              </span>
            </el-col>
            <el-col :span="10">
              <span>{{ $t('videoQualityPatrol.firstKeyFrame') }}：</span>
              <span>
                {{
                  itemData.firstKeyFrame || itemData.firstKeyFrame == 0
                    ? itemData.firstKeyFrame + 'ms'
                    : ''
                }}
              </span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.totalBytes') }}：</span>
              <span>{{ itemData.totalBytes }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.totalPacket') }}：</span>
              <span>{{ itemData.totalPacket }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.lostPacket') }}：</span>
              <span>{{ itemData.lostPacket }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.disorderPacket') }}：</span>
              <span>{{ itemData.disorderPacket }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.totalFrame') }}：</span>
              <span>{{ itemData.totalFrame }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.lostFrame') }}：</span>
              <span>{{ itemData.lostFrame }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.keyFrame') }}：</span>
              <span>{{ itemData.keyFrame }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.audioType') }}：</span>
              <span>{{ itemData.audioType }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.audioTotalBytes') }}：</span>
              <span>{{ itemData.audioTotalBytes }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.audioTotalPacket') }}：</span>
              <span>{{ itemData.audioTotalPacket }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.blur') }}：</span>
              <span>{{ connectFormatter(itemData.blur, 3) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.motion') }}：</span>
              <span>{{ connectFormatter(itemData.motion, 3) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.freeze') }}：</span>
              <span>{{ connectFormatter(itemData.freeze, 3) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.shake') }}：</span>
              <span>{{ connectFormatter(itemData.shake, 3) }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.lostOrCover') }}：</span>
              <span>{{ connectFormatter(itemData.lostOrCover, 3) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.color') }}：</span>
              <span>{{ connectFormatter(itemData.color, 3) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ $t('videoQualityPatrol.backlight') }}：</span>
              <span>{{ connectFormatter(itemData.backlight, 3) }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </collapse-card>
    <collapse-card :title="$t('videoQualityPatrol.historyQualityTitle')" collapse hideCollapse>
      <el-row :gutter="60">
        <el-col :span="3" class="quality-left">
          <el-radio-group v-model="selectedType">
            <el-radio-button :label="1">
              {{ $t('videoQualityPatrol.recvStreamAnalyse') }}
            </el-radio-button>
            <el-radio-button :label="2">
              {{ $t('videoQualityPatrol.KeyFrameAnalyse') }}
            </el-radio-button>
            <el-radio-button :label="3">
              {{ $t('videoQualityPatrol.videoPacketAnalyse') }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="21" class="quality-right">
          <el-row>
            <el-col :span="7">
              <el-date-picker
                :shortcuts="pickerOptions && pickerOptions.shortcuts"
                :disabled-date="pickerOptions && pickerOptions.disabledDate"
                :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                v-model="times2"
                type="datetimerange"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTimePrompt')"
                :end-placeholder="$t('public.endTimePrompt')"
                @change="changeTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              ></el-date-picker>
            </el-col>
            <el-col :span="10">
              <el-radio-group v-model="selectedTime" @change="selectedTimeChange">
                <el-radio-button :label="1">
                  {{ $t('videoQualityPatrol.recent24Hour') }}
                </el-radio-button>
                <el-radio-button :label="3">
                  {{ $t('videoQualityPatrol.recent7Day') }}
                </el-radio-button>
                <el-radio-button :label="5">
                  {{ $t('videoQualityPatrol.recent1Month') }}
                </el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row v-if="echartsData.length > 0">
            <echart
              v-loading="loading3"
              v-if="selectedType == 1"
              id="echart1"
              height="285px"
              :options="getOption1"
            />
            <echart
              v-loading="loading3"
              v-if="selectedType == 2"
              id="echart2"
              height="285px"
              :options="getOption2"
            />
            <echart
              v-loading="loading3"
              v-if="selectedType == 3"
              id="echart3"
              height="285px"
              :options="getOption3"
            />
          </el-row>
          <el-row style="height: 285px" v-else>
            <el-empty
              :image="errorImage"
              :image-size="200"
              :description="$t('public.noData')"
            ></el-empty>
          </el-row>
        </el-col>
      </el-row>
    </collapse-card>
  </div>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'
import { getDIYTime1, getFormatDate, getRecentDays } from '@/utils/common/mutil.js'
import { mapState } from 'vuex'
import echart from '@/components/echart'

export default {
  name: 'CameraQualityDetail',
  components: {
    CollapseCard,
    echart
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      cameraId: undefined,
      cameraName: undefined,
      loading1: false,
      total: 23,
      exists: undefined,
      loading2: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      times1: [],
      tableData: [],
      itemData: {},
      errorImage: require('@/assets/img/common/errorImage.png'),
      loading3: false,
      selectedType: 1,
      times2: [],
      selectedTime: 1,
      echartsData: [],
      xData: [],
      echartsData11: [],
      echartsData12: [],
      echartsData13: [],
      echartsData21: [],
      echartsData22: [],
      echartsData31: [],
      echartsData32: [],
      echartsData33: [],
      cuType: sessionStorage.getItem('cuType'),
      key: sessionStorage.getItem('key'),
      language: sessionStorage.getItem('language')
    }
  },
  computed: {
    ...mapState({
      testResultTypeData: state => state.dict.test_result_type,
      clientNonce: state => state.auth.clientNonce,
      token: state => state.auth.accessToken,
    }),
    getOption1() {
      return {
        title: {
          text: this.$t('videoQualityPatrol.recvStreamTitle'),
          top: 20,
          textStyle: {
            color: '#3696E5',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(14, 90, 135, 0.9)',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 25
          }
        },
        legend: {
          top: 20,
          right: 0,
          icon: 'roundRect',
          itemWidth: 14,
          itemGap: 20,
          borderRadius: 4
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xData,
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0B537E'
            }
          }
        },
        series: [
          {
            name: this.$t('videoQualityPatrol.getUrlDur'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData11
          },
          {
            name: this.$t('videoQualityPatrol.recvStreamDur'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData12
          },
          {
            name: this.$t('videoQualityPatrol.detectDur'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData13
          }
        ]
      }
    },
    getOption2() {
      return {
        title: {
          text: this.$t('videoQualityPatrol.KeyFrameTitle'),
          top: 20,
          textStyle: {
            color: '#3696E5',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(14, 90, 135, 0.9)',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 25
          }
        },
        legend: {
          top: 20,
          right: 0,
          icon: 'roundRect',
          itemWidth: 14,
          itemGap: 20,
          borderRadius: 4
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xData,
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0B537E'
            }
          }
        },
        series: [
          {
            name: this.$t('videoQualityPatrol.firstFrameTime'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData21
          },
          {
            name: this.$t('videoQualityPatrol.KeyFrameTime'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData22
          }
        ]
      }
    },
    getOption3() {
      return {
        title: {
          text: this.$t('videoQualityPatrol.videoPackeTitle'),
          top: 20,
          textStyle: {
            color: '#3696E5',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(14, 90, 135, 0.9)',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 25
          }
        },
        legend: {
          top: 20,
          right: 0,
          icon: 'roundRect',
          itemWidth: 14,
          itemGap: 20,
          borderRadius: 4
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xData,
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0B537E'
            }
          }
        },
        series: [
          {
            name: this.$t('videoQualityPatrol.totalPacket'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData31
          },
          {
            name: this.$t('videoQualityPatrol.lostPacket'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData32
          },
          {
            name: this.$t('videoQualityPatrol.disorderPacket'),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.echartsData33
          }
        ]
      }
    }
  },
  mounted() {
    this.getRouteParams()
    this.getCameraQualityBase()
    this.timesFormatter()
    this.selectedTimeChange()
  },
  methods: {
    getRouteParams() {
      this.cameraId = this.$route.params.id
      this.cameraName = this.$route.params.name
    },
    goBack() {
      this.$router.push({
        path: '/bms/video-quality-check'
      })
    },
    async getCameraQualityBase() {
      this.loading1 = true
      let res = await this.$api.getCameraQualityBase({
        cameraId: this.cameraId
      })
      if (res.resultCode == 0) {
        this.loading1 = false
        this.total = res.total
        this.exists = res.exists
      }
    },
    async timesFormatter() {
      let times = getDIYTime1(1)
      let time = getFormatDate(times[0]).slice(0, 11)
      this.times1 = [time + '00:00:00', time + '23:59:59']
      this.loading2 = true
      this.tableData = await this.getCameraQualityList(this.times1, 1)
    },
    async getCameraQualityList(times, type) {
      let res = await this.$api.getCameraQualityList({
        cameraId: this.cameraId,
        startTime: times[0],
        endTime: times[1]
      })
      if (res.resultCode == 0) {
        if (type == 1) {
          this.loading2 = false
          this.tableData = res.cameraQualityList
          this.tableData.length > 0 ? (this.itemData = this.tableData[0]) : ''
        } else {
          this.loading3 = false
        }
        return res.cameraQualityList
      }
    },
    rowClickHandle(row) {
      this.itemData = row
    },
    connectFormatter(value, type) {
      let name = undefined
      switch (value) {
        case true:
          switch (type) {
            case 1:
              name = this.$t('videoQualityPatrol.exists')
              break
            case 2:
              name = this.$t('videoQualityPatrol.success')
              break
            case 3:
              name = this.$t('videoQualityPatrol.yes')
              break
            default:
              break
          }
          break
        case false:
          switch (type) {
            case 1:
              name = this.$t('videoQualityPatrol.noExists')
              break
            case 2:
              name = this.$t('videoQualityPatrol.fail')
              break
            case 3:
              name = this.$t('videoQualityPatrol.no')
              break
            default:
              break
          }
          break
        default:
          break
      }
      return name
    },
    resultNewestFormatter(row) {
      return this.selectDictLabel(this.testResultTypeData, row.result)
    },
    // 监听时间按钮组的变化
    selectedTimeChange() {
      let times = getRecentDays(this.selectedTime)
      let time1 = getFormatDate(times[0])
      let time2 = getFormatDate(times[1])
      this.times2 = [time1, time2]
      this.changeTime()
    },
    // 监听时间选择器的变化
    async changeTime() {
      this.loading3 = true
      this.echartsData = await this.getCameraQualityList(this.times2, 2)
      this.xData = []
      this.echartsData11 = []
      this.echartsData12 = []
      this.echartsData13 = []
      this.echartsData21 = []
      this.echartsData22 = []
      this.echartsData31 = []
      this.echartsData32 = []
      this.echartsData33 = []
      this.xData = []
      this.echartsData.forEach(item => {
        this.xData.push(item.startTime)
        this.echartsData11.push(item.getUrlDur)
        this.echartsData12.push(item.recvStreamDur)
        this.echartsData13.push(item.detectDur)
        this.echartsData21.push(item.firstFrame)
        this.echartsData22.push(item.firstKeyFrame)
        this.echartsData31.push(item.totalPacket)
        this.echartsData32.push(item.lostPacket)
        this.echartsData33.push(item.disorderPacket)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cameraVideoQualityDetail {
  background: #0a314f;
  @apply m-5 p-5;
  .tip {
    font-size: 12px;
    @apply mt-5;
  }
  .test-info {
    background: #093b5c;
    color: #ccc;
    height: 400px;
    padding: 0 20px;
    .test-info-row {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #156c9e;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .quality-left {
    :deep(.el-radio-button) {
      display: block;
      .el-radio-button__inner {
        width: 150px;
        height: 50px;
        line-height: 35px;
      }
      &:first-child {
        .el-radio-button__inner {
          border-bottom: none;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      }
      &:last-child {
        .el-radio-button__inner {
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
  .quality-right {
    height: 340px;
    background: #093b5c;
    border-radius: 4px;
    padding: 10px !important;
    :deep(.el-radio-button) {
      &:first-child {
        .el-radio-button__inner {
          border-right: none;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
      }
      &:last-child {
        .el-radio-button__inner {
          border-left: none;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
:deep(.el-page-header__content) {
  color: #fff;
}
:deep(.collapse-card) {
  background: transparent !important;
  border-bottom: none;
  margin-bottom: 0;
  .card-header {
    color: #fff !important;
    .card-header-title::before {
      bottom: 3px;
    }
  }
  .card-body {
    padding: 0px 35px 0px;
    color: #fff;
    font-size: 15px;
  }
}
:deep(.el-range-separator) {
  padding: 1px 5px 0 0 !important;
}
:deep(.el-table) {
  tr,
  th {
    background: transparent !important;
  }
}
:deep(.el-table__empty-block) {
  background: #0a314f;
}
:deep(.el-radio-button) {
  --el-radio-button-checked-border-color: transparent;
  .el-radio-button__inner {
    background: transparent;
    color: #cccccc;
    font-size: 14px;
    border: 1px solid #0b537e;
    border-radius: 0;
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    background-color: #0e6294;
    -webkit-box-shadow: -1px 0 0 0 #0e6294;
    box-shadow: -1px 0 0 0 #0e6294;
  }
}
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #0e6294;
}
:deep(.el-input__wrapper) {
  flex-grow: 0;
}
:deep(.el-empty) {
  width: 100%;
}
</style>
