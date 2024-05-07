<template>
  <el-dialog
    :title="$t('analysisTask.taskInfo')"
    v-model="dialogVisible"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1100px'"
    class="taskDetailDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="data"
      :label-width="locale == 'en' ? '205px' : '120px'"
      label-position="left"
    >
      <div style="display: flex; padding: 0px 20px" class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('analysisTask.sourceType') + '：'">
            <span>{{ setSourceType(data.sourceType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('analysisTask.streamType') + '：'" v-if="data.sourceType == 1">
            <span>{{ setStreamType(data.streamType) }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('analysisTask.videoStartTiem') + '：'"
            class="inputInnerWidth"
            v-if="data.streamType == 2"
          >
            <span>{{ data.recordStartTime }}</span>
          </el-form-item>

          <el-form-item :label="$t('analysisTask.taskName') + '：'">
            <span>{{ data.taskName }}</span>
          </el-form-item>
          <el-form-item :label="$t('analysisTask.speedAnalysis') + '：'">
            <span>{{ setSpeed(data.amazingSpeed) }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('analysisTask.cameraName') + '：'" v-if="data.sourceType == 1">
            <span>{{ data.contentName }}</span>
          </el-form-item>
          <el-form-item :label="$t('analysisTask.rtmp') + '：'" v-if="data.sourceType == 2">
            <span>{{ data.content }}</span>
          </el-form-item>

          <el-form-item :label="$t('analysisTask.analysisMode') + '：'" v-if="data.sourceType == 1">
            <span>{{ setAnalyzeMode(data.analyzeMode) }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('analysisTask.videoStopTime') + '：'"
            class="inputInnerWidth"
            v-if="data.streamType == 2"
          >
            <span>{{ data.recordEndTime }}</span>
          </el-form-item>

          <el-form-item :label="$t('analysisTask.algo') + '：'" class="algoItem">
            <span>{{ algorithmName }}</span>
          </el-form-item>
        </div>
      </div>
      <el-form-item :label="$t('analysisTask.taskRemark') + '：'" style="padding: 0px 20px">
        <span>{{ data.stateDesc }}</span>
      </el-form-item>
      <el-form-item :label="$t('public.remark') + '：'" style="padding: 0px 20px">
        <span>{{ data.remark }}</span>
      </el-form-item>
    </el-form>

    <div class="redAsterisk" @click="showPeriodFlag = !showPeriodFlag">
      <div class="clickIfShow">
        {{ $t('analysisTask.periodSet') }}
        <el-icon v-if="showPeriodFlag"><el-icon-arrow-down /></el-icon>
        <el-icon v-else><el-icon-arrow-up /></el-icon>
      </div>
    </div>
    <el-collapse-transition>
      <div class="periodSetBox" v-show="showPeriodFlag">
        <el-radio-group v-model="planType" disabled>
          <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
          <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
        </el-radio-group>
        <!-- 网格时间选择控件 -->
        <time-grid-control ref="timeGridControl1" id="time_grid_control1"></time-grid-control>
      </div>
    </el-collapse-transition>

    <div v-if="data.presetList && data.presetList.length">
      <div class="redAsterisk">
        <div class="clickIfShow" @click="ifShowPreset = !ifShowPreset">
          {{ $t('analysisTask.persetSet') }}
          <el-icon v-if="ifShowPreset"><el-icon-arrow-down /></el-icon>
          <el-icon v-else><el-icon-arrow-up /></el-icon>
        </div>
      </div>
      <el-collapse-transition>
        <div class="presetSetBox" v-show="ifShowPreset">
          <!-- 表格 -->
          <el-table
            ref="dialogTable"
            :data="data.presetList"
            :row-class-name="$parent.tableRowClassName"
            border
            :highlight-current-row="true"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>

            <el-table-column :label="$t('analysisTask.preset')" min-width="90">
              <template #default="{ row }">
                <div style="width: 100%; height: 100%">
                  <span>{{ setPresetIndex(row.presetIndex) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('analysisTask.dwellTime')" min-width="90">
              <template #default="{ row }">
                <div style="width: 100%; height: 100%">
                  <span>{{ row.dwellTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('analysisTask.speed')" min-width="90">
              <template #default="{ row }">
                <div style="width: 100%; height: 100%">
                  <span>{{ row.speed }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ArrowDown as ElIconArrowDown, ArrowUp as ElIconArrowUp } from '@element-plus/icons-vue'
import { defineAsyncComponent } from 'vue'
import timeGridControl from '@/components/time-grid-control.vue'

export default {
  components: {
    'time-grid-control': timeGridControl,
    ElIconArrowDown,
    ElIconArrowUp
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: false
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      showPeriodFlag: true,
      ifShowPreset: true,
      dataText: this.$t('public.noData'),
      cameraPresetList: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    algorithmName() {
      if (this.data.algorithms) {
        return this.data.algorithms[0].algorithmName
      } else {
        return ''
      }
    },
    planType() {
      if (this.data.periodList) {
        return this.data.periodList[0].dayType === 0 ? 1 : 0
      } else {
        return 0
      }
    },
    timeSpanList() {
      if (this.data.periodList) {
        return this.data.periodList.map(item => {
          return {
            dayType: item.dayType,
            startTime: item.startTime,
            stopTime: item.endTime
          }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    'data.presetList'(newV) {
      if (newV.length) {
        this.getPresetList()
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.$refs.timeGridControl1.time_initialize(this.planType, 1, this.timeSpanList)
      })
    },

    dialogClosed() {
      this.dialogVisible = false
      this.showPeriodFlag = true
      this.ifShowPreset = true
      this.$refs.timeGridControl1.closeControl()
    },
    getPresetList() {
      this.$api.getPreset({ cameraId: this.data.content }).then(res => {
        if (res.resultCode == 0) {
          this.cameraPresetList = res.presetList
        }
      })
    },
    setPresetIndex(val) {
      if (val) {
        this.cameraPresetList.map(item => {
          if (val == item.presetIndex) {
            val = item.presetName
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setSourceType(val) {
      if (val) {
        this.$parent.sourceTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setAnalyzeMode(val) {
      if (val == 1) {
        return this.$t('analysisTask.video')
      } else if (val == 2) {
        return this.$t('analysisTask.img')
      }
    },
    setStreamType(val) {
      if (val == 1) {
        return this.$t('analysisTask.live')
      } else if (val == 2) {
        return this.$t('analysisTask.record')
      }
    },
    setSpeed(val) {
      if (val == 0) {
        return this.$t('workOrder.no')
      } else if (val == 1) {
        return this.$t('workOrder.yes')
      }
    }
  }
}
</script>

<style lang="scss">
.taskDetailDialog {
  .el-dialog__body {
    padding: 15px 20px 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
      word-break: break-all;
    }

    .el-dropdown {
      color: #4d4d4d;
      cursor: pointer;
    }
  }

  .algoItem {
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
  }

  .tableOperateBox {
    display: flex;
    margin-bottom: 10px;
  }
  .operateIcon {
    font-size: 14px;
    cursor: pointer;
    margin-right: 20px;
  }
  .operateIcon:hover {
    color: #409eff;
  }
  .mycell .el-checkbox {
    display: none;
  }

  .inputInnerWidth .el-input__inner {
    width: 397px;
  }
  .el-cascader__search-input {
    background: #f2f2f2;
  }
  .el-cascader__search-input::placeholder {
    color: #999;
  }
  .redAsterisk {
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .clickIfShow {
    display: inline-block;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
