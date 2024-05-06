<template>
  <div id="backupPlan">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :inline="true"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="isDisabled"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item
            :label="$t('mainDevConfiguration.backupMethod')"
            prop="backupMethod"
            required
          >
            <el-radio-group v-model="form.backupMethod">
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.backupMethod0') }}</el-radio>
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.backupMethod1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.backupType')" prop="backupType" required>
            <el-radio-group v-model="form.backupType">
              <el-radio :label="0" border>{{ $t('public.all') }}</el-radio>
              <el-radio v-show="form.backupMethod == 0" :label="1" border>
                {{ $t('mainDevConfiguration.backupType1') }}
              </el-radio>
            </el-radio-group>
            {{ form.backupMethod == 0 ? $t('mainDevConfiguration.backupType1Prop') : '' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-row class="form-label">{{ $t('mainDevConfiguration.backupSpanTime') }}</el-row>
        <div class="excuteTime">
          <div class="excuteTimeOperate">
            <el-form-item prop="isEnable">
              <el-checkbox v-model="form.isEnable" :true-label="1" :false-label="0">
                {{ $t('mainDevConfiguration.isEnable') }}
              </el-checkbox>
            </el-form-item>
            <el-form-item prop="scheduleType" class="ml-20">
              <el-radio-group v-model="form.scheduleType" @change="scheduleTypeChange">
                <el-radio :label="0" border>
                  {{ $t('mainDevConfiguration.scheduleType0') }}
                </el-radio>
                <el-radio :label="1" border>
                  {{ $t('mainDevConfiguration.scheduleType1') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <span
            :style="{ cursor: isDisabled ? 'not-allowed' : 'pointer' }"
            class="clear"
            @click="clearTime"
          >
            <el-icon><el-icon-delete /></el-icon>
            {{ $t('mainDevConfiguration.clear') }}
          </span>
        </div>
        <plan-time
          v-if="timeList1.length"
          :weekList="timeList1"
          :clearIsShow="false"
          ref="planTime1"
          :planType="form.scheduleType"
          @planListChange="timeListChange1"
          :disabled="isDisabled"
        />
      </el-row>
      <el-row class="mt-10" v-show="form.backupMethod == 0">
        <el-row class="form-label">
          {{ $t('mainDevConfiguration.recordSpanTime') }}
          <span>
            {{ $t('mainDevConfiguration.recordSpanTimeProp') }}
          </span>
        </el-row>
        <el-row :gutter="20" class="mt-5">
          <el-col :span="6">
            <el-form-item
              :label="$t('mainDevConfiguration.scheduleStartTime')"
              prop="scheduleStartTime"
            >
              <el-date-picker
                type="date"
                :placeholder="$t('mainDevConfiguration.scheduleStartTimeProp')"
                value-format="YYYYMMdd"
                :picker-options="pickerOptions"
                v-model="form.scheduleStartTime"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <plan-time
          v-if="timeList2.length"
          :weekList="timeList2"
          :clearIsShow="false"
          ref="planTime2"
          :planType="form.scheduleType"
          @planListChange="timeListChange2"
          :disabled="isDisabled"
        />
      </el-row>
    </el-form>
  </div>
</template>
<script>
import PlanTime from './plan-time.vue'
import { Delete as ElIconDelete } from '@element-plus/icons-vue'
export default {
  components: {
    PlanTime,
    ElIconDelete
  },
  props: ['type', 'planInfo', 'isDisabled'],

  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      form: {},
      timeList1: [],
      timeList1Copy: [],
      timeList2: [],
      timeList2Copy: [],
      formRules: {
        backupMethod: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.backupMethodProp'),
            trigger: 'change'
          }
        ],
        backupType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.backupTypeProp'),
            trigger: 'change'
          }
        ],
        scheduleType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.scheduleTypeProp'),
            trigger: 'change'
          }
        ]
      },
      weekList: [
        {
          label: this.$t('public.Monday'),
          dayType: 1,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Tuesday'),
          dayType: 2,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Wednesday'),
          dayType: 3,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Thursday'),
          dayType: 4,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Friday'),
          dayType: 5,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Saturday'),
          active: false,
          dayType: 6,
          timeList: []
        },
        {
          label: this.$t('public.Sunday'),
          active: false,
          dayType: 7,
          timeList: []
        }
      ],
      dayList: [
        {
          label: this.$t('public.everyDay'),
          dayType: 0,
          active: false,
          timeList: []
        }
      ],
      weekListCopy1: [
        {
          label: this.$t('public.Monday'),
          dayType: 1,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Tuesday'),
          dayType: 2,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Wednesday'),
          dayType: 3,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Thursday'),
          dayType: 4,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Friday'),
          dayType: 5,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Saturday'),
          active: false,
          dayType: 6,
          timeList: []
        },
        {
          label: this.$t('public.Sunday'),
          active: false,
          dayType: 7,
          timeList: []
        }
      ],
      dayListCopy1: [
        {
          label: this.$t('public.everyDay'),
          dayType: 0,
          active: false,
          timeList: []
        }
      ],
      weekListCopy2: [
        {
          label: this.$t('public.Monday'),
          dayType: 1,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Tuesday'),
          dayType: 2,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Wednesday'),
          dayType: 3,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Thursday'),
          dayType: 4,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Friday'),
          dayType: 5,
          active: false,
          timeList: []
        },
        {
          label: this.$t('public.Saturday'),
          active: false,
          dayType: 6,
          timeList: []
        },
        {
          label: this.$t('public.Sunday'),
          active: false,
          dayType: 7,
          timeList: []
        }
      ],
      dayListCopy2: [
        {
          label: this.$t('public.everyDay'),
          dayType: 0,
          active: false,
          timeList: []
        }
      ]
    }
  },
  watch: {
    planInfo: {
      handler(obj) {
        this.weekList1 = []
        this.weekList2 = []
        this.form = JSON.parse(JSON.stringify(obj))
        this.form.alarmTypeList = ''
        this.formatterTimeList()
      },
      immediate: true
    }
  },
  methods: {
    scheduleTypeChange(val) {
      if (val == 0) {
        this.timeList1 = JSON.parse(JSON.stringify(this.weekListCopy1))
        this.timeList2 = JSON.parse(JSON.stringify(this.weekListCopy2))
      } else {
        this.timeList1 = JSON.parse(JSON.stringify(this.dayListCopy1))
        this.timeList2 = JSON.parse(JSON.stringify(this.dayListCopy2))
      }
    },
    formatterTimeList() {
      const executePlanList = this.form.executePlanList
      let backupPlanList = this.form.backupPlanList
      let arr = []
      if (this.form.scheduleType == 1) {
        arr = [
          {
            label: this.$t('public.everyDay'),
            dayType: 0,
            active: false,
            timeList: []
          }
        ]
      } else {
        arr = [
          {
            label: this.$t('public.Monday'),
            dayType: 1,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Tuesday'),
            dayType: 2,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Wednesday'),
            dayType: 3,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Thursday'),
            dayType: 4,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Friday'),
            dayType: 5,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Saturday'),
            active: false,
            dayType: 6,
            timeList: []
          },
          {
            label: this.$t('public.Sunday'),
            active: false,
            dayType: 7,
            timeList: []
          }
        ]
      }
      if (executePlanList && executePlanList.length > 0) {
        this.timeList1 = this.timeSpanListFormatter(arr, executePlanList)
        if (this.form.scheduleType == 0) {
          this.weekListCopy1 = JSON.parse(JSON.stringify(this.timeList1))
        } else if (this.form.scheduleType == 1) {
          this.dayListCopy1 = JSON.parse(JSON.stringify(this.timeList1))
        }
      } else {
        this.timeList1 = JSON.parse(JSON.stringify(arr))
      }
      this.timeList1Copy = JSON.parse(JSON.stringify(this.timeList1))
      if (backupPlanList && backupPlanList.length > 0) {
        this.timeList2 = this.timeSpanListFormatter(arr, backupPlanList)
        if (this.form.scheduleType == 0) {
          this.weekListCopy2 = JSON.parse(JSON.stringify(this.timeList2))
        } else if (this.form.scheduleType == 1) {
          this.dayListCopy2 = JSON.parse(JSON.stringify(this.timeList2))
        }
      } else {
        this.timeList2 = JSON.parse(JSON.stringify(arr))
      }
      this.timeList2Copy = JSON.parse(JSON.stringify(this.timeList2))
    },
    timeSpanListFormatter(initArr, spanList) {
      let arr = JSON.parse(JSON.stringify(initArr))
      let list = JSON.parse(JSON.stringify(spanList))
      list.forEach(item => {
        const timeList = item.timeList
        timeList.forEach(item1 => {
          let startTime = item1.startTime.split('')
          startTime.splice(2, 0, ':')
          startTime.splice(5, 0, ':')
          item1.startTime = startTime.join('')
          let endTime = item1.endTime.split('')
          endTime.splice(2, 0, ':')
          endTime.splice(5, 0, ':')
          item1.endTime = endTime.join('')
        })
      })
      list.forEach(item => {
        if (this.form.scheduleType == 1) {
          arr[item.dayType].timeList = item.timeList
        } else {
          arr[item.dayType - 1].timeList = item.timeList
        }
      })
      return JSON.parse(JSON.stringify(arr))
    },
    timeListChange1(list, list1) {
      if (this.form.scheduleType == 0) {
        this.weekListCopy1 = JSON.parse(JSON.stringify(list1))
      } else if (this.form.scheduleType == 1) {
        this.dayListCopy1 = JSON.parse(JSON.stringify(list1))
      }
      this.form.executePlanList = this.formatterTimeList1(list)
    },
    timeListChange2(list, list1) {
      if (this.form.scheduleType == 0) {
        this.weekListCopy2 = JSON.parse(JSON.stringify(list1))
      } else if (this.form.scheduleType == 1) {
        this.dayListCopy2 = JSON.parse(JSON.stringify(list1))
      }
      this.form.backupPlanList = this.formatterTimeList1(list)
    },
    formatterTimeList1(arr) {
      let list = []
      if (arr.length == 0) return []
      arr.forEach(item => {
        if (item?.timeSpanList && item.timeSpanList.length > 0) {
          item.timeInfoNum = item.timeSpanList.length
          item.timeSpanList.forEach(item1 => {
            item1.startTime = item1.startTime.split(':').join('')
            item1.endTime = item1.endTime.split(':').join('')
          })
          item.timeList = JSON.parse(JSON.stringify(item.timeSpanList))
          delete item.timeSpanList
          list.push(item)
        }
      })
      return JSON.parse(JSON.stringify(list))
    },
    clearTime() {
      if (this.isDisabled) return
      if (this.form.scheduleType == 0) {
        this.timeList1 = JSON.parse(JSON.stringify(this.weekList))
        this.timeList2 = JSON.parse(JSON.stringify(this.weekList))
        this.weekListCopy1 = JSON.parse(JSON.stringify(this.weekList))
        this.weekListCopy2 = JSON.parse(JSON.stringify(this.weekList))
      } else {
        this.timeList1 = JSON.parse(JSON.stringify(this.dayList))
        this.timeList2 = JSON.parse(JSON.stringify(this.dayList))
        this.dayListCopy1 = JSON.parse(JSON.stringify(this.dayList))
        this.dayListCopy1 = JSON.parse(JSON.stringify(this.dayList))
      }
    }
  }
}
</script>
<style lang="scss">
#backupPlan {
  .form-label {
    font-size: 16px;
    font-weight: 800;
    span {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .el-checkbox {
    color: #fff;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    width: 100%;
  }
  .excuteTime {
    width: 840px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .clear {
      font-size: 14px;
      padding-top: 15px;
      cursor: pointer;
    }
    .excuteTimeOperate {
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        width: auto;
      }
    }
  }
}
</style>
