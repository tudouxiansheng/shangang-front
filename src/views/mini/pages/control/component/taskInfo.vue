<template>
  <div class="guard-detail">
    <div class="guard-card">
      <div class="title">{{ $t('application.taskBaseInfo') }}</div>
      <div class="content">
        <el-row>
          <el-col class="item" :span="8">
            <div class="label">{{ $t('application.taskName') }}：</div>
            <div class="value" :title="info.guardName">{{ info.guardName }}</div>
          </el-col>
          <el-col class="item" :span="8">
            <div class="label">{{ $t('application.taskType') }}：</div>
            <div class="value">{{ info.guardType | formatGuardType(that) }}</div>
          </el-col>
          <el-col v-if="info.guardType == 1" class="item" :span="8">
            <div class="label">{{ $t('application.libraryType') }}：</div>
            <div class="value">{{ setRepType(info.repositoryType) }}</div>
          </el-col>
          <el-col v-if="info.guardType == 2" class="item" :span="8">
            <div class="label">{{ $t('application.libraryType') }}：</div>
            <div class="value">{{ setRepType(info.repositoryType) }}</div>
          </el-col>
          <el-col v-if="info.guardType == 1" class="item" :span="8">
            <div class="label">{{ $t('application.library') }}：</div>
            <div class="value" :title="info.repositoryNames.join(',')">{{ info.repositoryNames.join(',') }}</div>
          </el-col>
          <el-col v-if="info.guardType == 2" class="item" :span="8">
            <div class="label">{{ $t('application.library') }}：</div>
            <div class="value" :title="info.repositoryNames.join(',')">{{ info.repositoryNames.join(',') }}</div>
          </el-col>
          <el-col class="item" :span="8">
            <div class="label">{{ $t('alarm.alarmName') }}：</div>
            <div class="value">{{ isZh ? info.alarmName : info.alarmType }}</div>
          </el-col>
          <el-col class="item" :span="8" v-if="info.guardType != 2">
            <div class="label">{{ $t('alarm.threshold') }}：</div>
            <div class="value" v-if="info.threshold">{{ info.threshold }}%</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="guard-card">
      <div class="title">{{ $t('alarm.controlRange') }}</div>
      <div class="content">
        <el-col class="item" :span="24">
          <div class="label">{{ $t('alarm.controlSource') }}：</div>
          <div class="value">{{ setSourceType(info.sourceType) }}</div>
        </el-col>
        <el-col class="item" :span="24">
          <div class="label">{{ $t('alarm.cameraRange') }}：</div>
          <div class="value" style="flex: 1">
            <CameraTree style="width: 50%" :canModify="false" :replayIdArr="cameraIds"></CameraTree>
            <div class="tips" style="margin-left: 20px" v-if="false">
              说明：
              <br />
              1、回显摄像机所在的区域分组
            </div>
          </div>
        </el-col>
      </div>
    </div>
    <div class="guard-card">
      <div class="title">{{ $t('alarm.controlTime') }}</div>
      <div class="content">
        <el-row>
          <el-col class="item" :span="8">
            <div class="label">{{ $t('public.startTime') }}：</div>
            <div class="value">{{ info.beginTime }}</div>
          </el-col>
          <el-col class="item" :span="8">
            <div class="label">{{ $t('public.endTime') }}：</div>
            <div class="value">{{ info.endTime }}</div>
          </el-col>
          <el-col class="item" :span="8"></el-col>
          <el-col class="item" :span="24">
            <div class="label">{{ $t('alarm.taskPlan') }}：</div>
            <div class="value">
              <time-grid-control ref="timeGridControl" id="time_grid_control1"></time-grid-control>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import timeGridControl from '../../../../../components/time-grid-control'
import CameraTree from '../../../../../components/CameraTree'
import { getGuardInfo, getTaskInfo } from '../../../../../utils/api'
export default {
  name: 'taskInfo',
  components: {
    timeGridControl,
    CameraTree,
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      },
    },
    guardId: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatGuardType(val, that) {
      let guardType = {
        1: that.$t('application.faceControl'),
        2: that.$t('application.vehicleControl'),
      }
      return guardType[val]
    },
  },
  data() {
    return {
      that: this,
      planType: 0,
      operation: 0,
      cameraIds: [],
      timeSpanList: [],
      sourceTypeList: [
        {
          name: this.$t('public.camera'),
          value: 1,
        },
        {
          name: this.$t('public.analysisTask'),
          value: 2,
        },
      ],
      repositoryTypeList: [
        {
          name: this.$t('application.blacklist'),
          value: 1,
        },
        {
          name: this.$t('application.blacklist'),
          value: 2,
        },
        {
          name: this.$t('application.whitelist'),
          value: 3,
        },
      ],
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  watch: {
    visible() {
      this.timeSpanList = []
      this.planType = 0
      this.operation = 0
    },
  },
  mounted() {
    // {"resultCode":0,"resultDesc":"SUCCESS","guardId":"1534869199346802689","guardName":"车辆布控","guardType":2,"sourceType":1,"alarmType":"VEHICLE_MONITOR_ALARM","alarmName":"车辆布控告警","alarmGroup":"2","beginTime":"2022-06-01 00:00:00","endTime":"2022-07-31 23:59:59","enabled":1,"status":1,"periods":[{"dayType":1,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":2,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":3,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":4,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":5,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":6,"startTime":"00:00:00","stopTime":"23:59:59"},{"dayType":7,"startTime":"00:00:00","stopTime":"23:59:59"}],"rules":[],"repositoryList":[],"sourceList":[{"sourceId":"00000022060805010301000000017321","sourceName":"10.0.3.131"}],"tenantId":"00000000000000000100000000000000","createTime":"2022-06-09 20:05:08","updateTime":"2022-06-09 20:05:08"}
    // console.log(1111, JSON.stringify(this.info))
    console.log(this.guardId)
    if (this.info && this.info.periods && this.info.periods.length) {
      if (this.info.periods[0].dayType == 0) {
        this.planType = 1
      } else {
        this.planType = 0
      }
      let periodList = []
      for (let i = 0; i < this.info.periods.length; i++) {
        let item = this.info.periods[i]
        periodList.push({
          dayType: item.dayType,
          startTime: item.startTime,
          stopTime: item.stopTime,
        })
      }
      this.timeSpanList = periodList
      console.log(this.timeSpanList)
      let operation = 1
      this.$refs.timeGridControl.time_initialize(this.planType, operation, this.timeSpanList)
      if (this.info.sourceType == 1) {
        //摄像机
        this.cameraIds = this.info.sourceList.map((s) => {
          return {
            type: 2,
            id: s.sourceId,
          }
        })
      } else {
        //智能分析任务
        this.info.sourceList.forEach(async (l) => {
          await getTaskInfo({
            taskId: l.sourceId,
          })
          if (res.resultCode == 0) {
            this.cameraIds.push({
              type: 2,
              id: res.content,
            })
          }
        })
      }
    }
  },
  methods: {
    setSourceType(val) {
      if (val) {
        this.sourceTypeList.map((item) => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setRepType(val) {
      if (val) {
        this.repositoryTypeList.map((item) => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    // handleGetGuardInfo(){}
  },
}
</script>

<style scoped lang="scss">
.guard-detail {
  height: calc(100% - 30px);
  //overflow-y: auto;
  .guard-card {
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .content {
      padding: 0 0 0 20px;
      box-sizing: border-box;
      .item {
        margin-bottom: 15px;
        display: flex;
        .label {
          white-space: nowrap;
        }
        .value {
          flex: 1;
          color: #ccc;
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
