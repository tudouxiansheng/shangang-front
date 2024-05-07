<template>
  <div ref="videoQualityTaskDetail" class="videoQualityTaskDetail" v-if="isRouterAlive">
    <el-page-header @back="goBack" :content="taskName"></el-page-header>
    <collapse-card
      v-loading="loading1"
      :title="$t('videoQualityPatrol.baseInfo')"
      collapse
      hideCollapse
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="task-name-label" :style="{ width: locale === 'en' ? '170px' : '115px' }">
            {{ $t('videoQualityPatrol.taskName') }}：
          </span>
          <span :title="taskName" class="task-name">{{ taskName }}</span>
        </el-col>
        <el-col :span="3">
          <span>{{ $t('videoQualityPatrol.accumulativeTotal') }}：</span>
          <span>{{ total }}</span>
        </el-col>
        <el-col :span="5">
          <span>{{ $t('videoQualityPatrol.createTime') }}：</span>
          <span>{{ createTime }}</span>
        </el-col>
        <el-col :span="5">
          <span>{{ $t('videoQualityPatrol.updateTime') }}：</span>
          <span>{{ updateTime }}</span>
        </el-col>
        <el-col :span="5">
          <span>{{ $t('videoQualityPatrol.taskType') }}：</span>
          <span>{{ taskTypeFormatter(taskType) }}</span>
        </el-col>
      </el-row>
      <el-row class="mt-5" v-if="taskType == 2 || taskType == 3">
        <el-col :span="6">
          <span>{{ $t('videoQualityPatrol.testCycle') }}：</span>
          <span>{{ startDay + '-' + endDay }}</span>
        </el-col>
        <el-col :span="6" v-if="taskType == 2">
          <span>{{ $t('videoQualityPatrol.testTimePlan') }}：</span>
          <span>{{ hourFormatter(hour) }}</span>
        </el-col>
        <el-col :span="6" v-if="taskType == 2">
          <span>{{ $t('videoQualityPatrol.testTimePlan') }}：</span>
          <span class="mr-5">{{ weekFormatter(week) }}</span>
          <span>{{ hourFormatter(hour) }}</span>
        </el-col>
      </el-row>
    </collapse-card>
    <collapse-card
      v-loading="loading1"
      :title="$t('videoQualityPatrol.cameraCount')"
      collapse
      hideCollapse
    >
      <el-row :gutter="20">
        <el-col :span="3">
          <span>{{ $t('videoQualityPatrol.cameraNum') }}：</span>
          <span>{{ cameraNum }}</span>
        </el-col>
        <el-col :span="4">
          <span class="cursor-pointer text-detail" @click="camerasListDetail">
            {{ $t('videoQualityPatrol.viewDetails') }}
          </span>
        </el-col>
      </el-row>
    </collapse-card>
    <collapse-card
      v-loading="loading2"
      :title="$t('videoQualityPatrol.historyTestRecord')"
      collapse
      hideCollapse
    >
      <el-row>
        <p class="tip">
          {{
            $t('videoQualityPatrol.recordTipStart') +
            tableData.length +
            $t('videoQualityPatrol.recordTipStartEnd')
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
            <el-table-column prop="executionStatus" :label="$t('videoQualityPatrol.testStatus')">
              <template #default="{ row }">
                <span>
                  {{
                    row.executionStatus == 1
                      ? $t('videoQualityPatrol.inProgress')
                      : $t('videoQualityPatrol.completed')
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" :label="$t('videoQualityPatrol.executeTime')" />
            <el-table-column prop="endTime" :label="$t('videoQualityPatrol.completeTime')" />
          </el-table>
        </el-col>
        <el-col :span="14" class="test-info" v-if="tableData.length == 0">
          <el-empty
            :image="errorImage"
            :image-size="300"
            :description="$t('public.noData')"
          ></el-empty>
        </el-col>
        <el-col :span="14" class="test-info" v-else-if="executionStatus == 2">
          <el-row :gutter="20" class="test-info-row">
            <el-col :span="12">
              <echart id="echart1" height="400px" :options="getOption1" />
            </el-col>
            <el-col :span="12">
              <echart id="echart2" height="400px" :options="getOption2" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="14" class="test-info" v-else>
          <el-empty
            :image="errorImage"
            :image-size="300"
            :description="$t('videoQualityPatrol.noDataProp')"
          ></el-empty>
        </el-col>
      </el-row>
    </collapse-card>
    <collapse-card :title="$t('videoQualityPatrol.historyPatrolAnalyse')" collapse hideCollapse>
      <el-row :gutter="40">
        <el-col :span="6">
          <el-date-picker
            v-model="times"
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
            <el-radio-button :label="3">{{ $t('videoQualityPatrol.recent7Day') }}</el-radio-button>
            <el-radio-button :label="5">
              {{ $t('videoQualityPatrol.recent1Month') }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row v-if="executionList.length > 0">
        <echart v-loading="loading6" id="echart3" height="230px" :options="getOption3" />
      </el-row>
      <el-row v-else>
        <el-empty
          v-loading="loading6"
          :image="errorImage"
          :image-size="230"
          :description="$t('public.noData')"
        ></el-empty>
      </el-row>
    </collapse-card>
    <camera-list-detail
      v-model:dialogVisible="dialogVisible1"
      :taskId="taskId"
      :taskName="taskName"
    />
  </div>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'
import echart from '@/components/echart'
import { getFormatDate, getRecentDays } from '@/utils/common/mutil.js'
import { mapState } from 'vuex'
import cameraListDetail from './camera-list-detail.vue'
export default {
  name: 'VideoQualityTaskDetails',
  components: {
    CollapseCard,
    echart,
    cameraListDetail
  },
  data() {
    return {
      isRouterAlive: true,
      taskId: undefined,
      taskName: undefined,
      loading1: false,
      total: 0,
      cameraNum: 0,
      createTime: undefined,
      updateTime: undefined,
      startDay: undefined,
      endDay: undefined,
      taskType: undefined,
      week: '',
      hour: '',
      loading2: false,
      tableData: [],
      executionBatch: undefined,
      loading3: false,
      executionStatus: 1,
      taskCameraTotal: 0,
      echartsData1: [],
      echartsData2: [],
      errorImage: require('@/assets/img/common/errorImage.png'),
      times: [],
      selectedTime: 1,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loading6: false,
      xData: [],
      executionList: [],
      echartsData31: [],
      echartsData32: [],
      echartsData33: [],
      echartsData34: [],
      echartsData35: [],
      echartsData36: [],
      dialogVisible1: false,
      hourOptions: [
        {
          label: '00:00',
          value: 0
        },
        {
          label: '01:00',
          value: 1
        },
        {
          label: '02:00',
          value: 2
        },
        {
          label: '03:00',
          value: 3
        },
        {
          label: '04:00',
          value: 4
        },
        {
          label: '05:00',
          value: 5
        },
        {
          label: '06:00',
          value: 6
        },
        {
          label: '07:00',
          value: 7
        },
        {
          label: '08:00',
          value: 8
        },
        {
          label: '09:00',
          value: 9
        },
        {
          label: '10:00',
          value: 10
        },
        {
          label: '11:00',
          value: 11
        },
        {
          label: '12:00',
          value: 12
        },
        {
          label: '13:00',
          value: 13
        },
        {
          label: '14:00',
          value: 14
        },
        {
          label: '15:00',
          value: 15
        },
        {
          label: '16:00',
          value: 16
        },
        {
          label: '17:00',
          value: 17
        },
        {
          label: '18:00',
          value: 18
        },
        {
          label: '19:00',
          value: 19
        },
        {
          label: '20:00',
          value: 20
        },
        {
          label: '21:00',
          value: 21
        },
        {
          label: '22:00',
          value: 22
        },
        {
          label: '23:00',
          value: 23
        }
      ],
      weekOptions: [
        {
          label: this.$t('videoRecord.monday'),
          value: 2
        },
        {
          label: this.$t('videoRecord.tuesday'),
          value: 3
        },
        {
          label: this.$t('videoRecord.wednesday'),
          value: 4
        },
        {
          label: this.$t('videoRecord.thursday'),
          value: 5
        },
        {
          label: this.$t('videoRecord.friday'),
          value: 6
        },
        {
          label: this.$t('videoRecord.saturday'),
          value: 7
        },
        {
          label: this.$t('videoRecord.sunday'),
          value: 1
        }
      ]
    }
  },
  computed: {
    ...mapState({
      taskTypeData: state => state.dict.task_type
    }),
    getOption1() {
      return {
        title: [
          {
            text: this.$t('videoQualityPatrol.videoQualityTest'),
            top: 30,
            textStyle: {
              color: '#3696E5',
              fontSize: 14
            }
          },
          {
            text: this.taskCameraTotal,
            top: 'middle',
            left: 'center',
            textStyle: {
              color: '#fff',
              fontSize: 25,
              fontWeight: 400
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(14, 90, 135, 0.9)',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 25
          },
          formatter(obj) {
            return `${obj.data.name} : ${obj.data.percent}`
          }
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            name: this.$t('videoQualityPatrol.videoQualityTest'),
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: this.echartsData1
          }
        ]
      }
    },
    getOption2() {
      return {
        title: {
          text: this.$t('videoQualityPatrol.videoError'),
          top: 30,
          textStyle: {
            color: '#3696E5',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(14, 90, 135, 0.9)',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 25
          },
          formatter(obj) {
            return `${obj.data.name} : ${obj.data.percent}`
          }
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            name: this.$t('videoQualityPatrol.videoError'),
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: this.echartsData2
          }
        ]
      }
    },
    getOption3() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
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
        dataZoom: [
          {
            type: 'inside',
            startValue: 0,
            endValue: 6
          }
        ],
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
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
            name: this.$t('videoQualityPatrol.success'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData31
          },
          {
            name: this.$t('videoQualityPatrol.fail'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData32
          },
          {
            name: this.$t('videoQualityPatrol.highPacketLossRate'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData33
          },
          {
            name: this.$t('videoQualityPatrol.highFrameLossRate'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData34
          },
          {
            name: this.$t('videoQualityPatrol.firstFrameTimeout'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData35
          },
          {
            name: this.$t('videoQualityPatrol.firstKeyframeTimeout'),
            type: 'bar',
            stack: this.$t('videoQualityPatrol.success'),
            barWidth: 40,
            data: this.echartsData36
          }
        ]
      }
    }
  },
  mounted() {
    this.getRouteParams()
    this.getVideoQualityMainTaskDetail()
    this.getVideoQualityMainTaskExecutionList()
    this.selectedTimeChange()
  },
  methods: {
    getRouteParams() {
      this.taskId = this.$route.params.id
      this.taskName = this.$route.params.name
    },
    goBack() {
      this.$router.back()
    },
    async getVideoQualityMainTaskDetail() {
      this.loading1 = true
      let res = await this.$api.getVideoQualityMainTaskDetail({
        taskId: this.taskId
      })
      if (res.resultCode == 0) {
        this.loading1 = false
        this.total = res.accumulativeTotal
        this.cameraNum = res.numberOfCameras
        this.createTime = res.createTime
        this.updateTime = res.updateTime
        this.startDay = res.startDay
        this.endDay = res.endDay
        this.taskType = res.taskType
        this.week = res.week
        this.hour = res.hour
      }
    },
    camerasListDetail() {
      this.dialogVisible1 = true
    },
    taskTypeFormatter(value) {
      return this.selectDictLabel(this.taskTypeData, value)
    },
    async getVideoQualityMainTaskExecutionList() {
      this.loading2 = true
      let res = await this.$api.getVideoQualityMainTaskExecutionList({
        taskId: this.taskId
      })
      if (res.resultCode == 0) {
        this.loading2 = false
        this.tableData = res.executionList
        if (this.tableData.length > 0) {
          this.rowClickHandle(this.tableData[0])
        }
      }
    },
    rowClickHandle(row) {
      this.executionBatch = row.executionBatch
      this.executionStatus = row.executionStatus
      this.getVideoQualityTaskExecutionSingleOverview()
    },
    async getVideoQualityTaskExecutionSingleOverview() {
      this.loading3 = true
      let res = await this.$api.getVideoQualityTaskExecutionSingleOverview({
        taskId: this.taskId,
        executionBatch: this.executionBatch
      })
      if (res.resultCode == 0) {
        this.loading3 = false
        this.taskCameraTotal = res.total
        this.echartsData1 = [
          {
            name: this.$t('videoQualityPatrol.videoNormal'),
            value: res.normal,
            percent: res.normalRate
          },
          {
            name: this.$t('videoQualityPatrol.videoAbnormal'),
            value: res.abnormal,
            percent: res.abnormalRate
          },
          {
            name: this.$t('videoQualityPatrol.diagnoseFail'),
            value: res.fail,
            percent: res.failRate
          },
          {
            name: this.$t('videoQualityPatrol.notDetecte'),
            value: res.notDetect,
            percent: res.notDetectRate
          }
        ]
        this.echartsData2 = [
          {
            name: this.$t('dictConst.testResultType2'),
            value: res.getUrlFailure,
            percent: res.getUrlFailureRate
          },
          {
            name: this.$t('dictConst.testResultType3'),
            value: res.recvStreamFailure,
            percent: res.recvStreamFailureRate
          },
          {
            name: this.$t('dictConst.testResultType4'),
            value: res.detectFailure,
            percent: res.detectFailureRate
          },
          {
            name: this.$t('dictConst.testResultType5'),
            value: res.otherFailure,
            percent: res.otherFailureRate
          }
        ]
      }
    },

    selectedTimeChange() {
      let times = getRecentDays(this.selectedTime)
      let time1 = getFormatDate(times[0])
      let time2 = getFormatDate(times[1])
      this.times = [time1, time2]
      this.changeTime()
    },
    // 监听时间选择器的变化
    changeTime() {
      this.loading6 = true
      this.getVideoQualityTaskExecutionOverviewList()
    },
    async getVideoQualityTaskExecutionOverviewList() {
      this.loading6 = true
      let res = await this.$api.getVideoQualityTaskExecutionOverviewList({
        taskId: this.taskId,
        startTime: this.times[0],
        endTime: this.times[1]
      })
      if (res.resultCode == 0) {
        this.loading6 = false
        this.executionList = res.executionList
        this.echartsData31 = []
        this.echartsData32 = []
        this.echartsData33 = []
        this.echartsData34 = []
        this.echartsData35 = []
        this.echartsData36 = []
        this.xData = []
        this.executionList.forEach(item => {
          this.xData.push(item.startTime)
          this.echartsData31.push(item.success ? item.success : 0)
          this.echartsData32.push(item.fail ? item.fail : 0)
          this.echartsData33.push(item.highPacketLossRate ? item.highPacketLossRate : 0)
          this.echartsData34.push(item.highFrameLossRate ? item.highFrameLossRate : 0)
          this.echartsData35.push(item.firstFrameTimeout ? item.firstFrameTimeout : 0)
          this.echartsData36.push(item.firstKeyframeTimeout ? item.firstKeyframeTimeout : 0)
        })
      }
    },
    weekFormatter(value) {
      return this.selectDictLabel(this.weekOptions, value, {
        key: 'label',
        value: 'value'
      })
    },
    hourFormatter(value) {
      return this.selectDictLabel(this.hourOptions, value, {
        key: 'label',
        value: 'value'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.videoQualityTaskDetail {
  background: #0a314f;
  @apply m-5 p-5;
  .tip {
    font-size: 12px;
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
    color: #fff !important;
    font-size: 15px;
    .task-name-label {
      display: inline-block;
      width: 170px;
      overflow: hidden;
    }
    .task-name {
      display: inline-block;
      width: calc(100% - 170px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #0e6294;
}
:deep(.el-empty) {
  width: 100%;
}
</style>
