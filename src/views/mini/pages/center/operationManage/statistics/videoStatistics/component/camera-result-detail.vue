<template>
  <el-dialog
    :title="$t('operateManage.videoTestDetail')"
    v-model="$parent.cameraResultDetailVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="cameraResultDetailDialog detailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <collapse-card :title="$t('devOps.resultDetail')" v-model:collapse="collapse1">
      <el-form
        ref="form"
        :model="form"
        :label-width="locale == 'en' ? '240px' : '100px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('deviceInfo.deviceName') + ' ：'">
              <span>{{ form.devName }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('deviceInfo.deviceID') + '：'">
              <span>{{ form.devId }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('deviceInfo.deviceIP') + '：'">
              <span>{{ form.ip }}</span>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('platformManagement.onlineStatus') + '：'">
              <span>{{ onlineStatusFormatter(form.devStatus) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.dpi') + '：'">
              <span>{{ form.dpi }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('operateManage.patrolResult') + '：'">
              <span>{{ statusFormatter(form.status) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.diagnosisResult') + '：'">
              <span>{{ resultFormatter(form.result) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('operateManage.errReason') + '：'">
              <span>{{ errorItemsFormatter(form.errorItems) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.motion') + '：'">
              <span>{{ isYesFormatter(form.motion) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('operateManage.freeze') + '：'">
              <span>{{ isYesFormatter(form.freeze) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.shake') + '：'">
              <span>{{ isYesFormatter(form.shake) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('operateManage.lostOrCover') + '：'">
              <span>{{ isYesFormatter(form.lostOrCover) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.color') + '：'">
              <span>{{ isYesFormatter(form.color) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('operateManage.backlight') + '：'">
              <span>{{ isYesFormatter(form.backlight) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.blur') + '：'">
              <span>{{ isYesFormatter(form.blur) }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('devOps.parsingBeginTime') + '：'">
              <span>{{ form.startTime }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('devOps.parsingEndTime') + '：'">
              <span>{{ form.endTime }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('operateManage.videoScreenshot') + '：'">
              <img :src="form.snap" controls style="width: 100%" />
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('devOps.videoDown') + '：'">
              <span
                v-show="form.play"
                class="el-icon-download"
                style="color: #409eff"
                @click="download_video"
              ></span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </collapse-card>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import collapseCard from '@/components/collapse-card'
import { byteConversion } from '@/utils/common/mutil'
import { mapState } from 'vuex'

export default {
  components: { collapseCard },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      collapse1: true,
      form: {},
      activeNames: ['1', '2'],
      month: new Date(),
      pickerOptions: {
        //大于当前月分的日期不可选
        disabledDate: time => {
          let curDate = new Date()
          let sixMonths = new Date(new Date().setMonth(new Date().getMonth() - 5))
          return time > curDate || time < sixMonths
        }
      }
    }
  },
  computed: {
    ...mapState({
      patrolQualityStatusData: state => state.dict.patrol_quality_status
    })
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.cameraResultDetailVisible = false
      this.$parent.dataForm = {}
    },
    download_video() {
      var link = document.createElement('a')
      var body = document.querySelector('body')
      link.href = this.form.play
      link.style.display = 'none'
      body.appendChild(link)
      link.click()
      body.removeChild(link)
    },

    isClass(date, data) {
      let bgClass = ''
      if (new Date(data.day).getTime() < new Date().getTime()) {
        bgClass = 'bgInfo'
      }
      for (let i = 0; i < this.$parent.recordInfos.length; i++) {
        const item = this.$parent.recordInfos[i]
        if (item.date == data.day) {
          bgClass = item.result == 1 ? 'bgSuccess' : item.result == 2 ? 'bgDanger' : 'bgInfo'
        }
      }
      return bgClass
    },
    bytesToSize(byte) {
      return byteConversion(byte)
    },
    getBitRate(data) {
      let bitRate = ''
      if (data.recvStreamDur) {
        bitRate =
          ((data.videoTotalBytes * 8) / 1024 / (data.recvStreamDur / 1000)).toFixed(2) + 'kb/s'
      } else {
        bitRate = '0kb/s'
      }
      return bitRate
    },
    errorItemsFormatter(data) {
      let arr = []
      if (data) {
        data.forEach(item => {
          arr.push(this.selectDictLabel(this.patrolQualityStatusData, item))
        })
      }
      return arr.join('、')
    },
    onlineStatusFormatter(devStatus) {
      return this.selectDictLabel(this.$parent.deviceStatusData, devStatus)
    },
    statusFormatter(status) {
      return this.selectDictLabel(this.$parent.patrolResultData, status)
    },
    resultFormatter(result) {
      return this.selectDictLabel(this.$parent.diagnosisResultData, result)
    },
    dpiFormatter(dpi) {
      return this.selectDictLabel(this.$parent.videoDpiData, dpi)
    },
    isYesFormatter(dpi) {
      return this.selectDictLabel(this.$parent.isYesData, dpi)
    }
  }
}
</script>

<style lang="scss">
.cameraResultDetailDialog {
  .el-dialog__body {
    .form-flex {
      padding: 0px 20px;
    }
    .result {
      span {
        display: inline-block;
        line-height: 34px;
      }
      .span-round {
        border-radius: 50%;
        height: 6px;
        width: 6px;
        margin-left: 8px;
      }
    }

    #calendar {
      margin-top: 10px;
      width: 100%;
      height: 100%;
      .el-calendar__header {
        display: none;
      }
      .el-calendar__body {
        padding: 0px;
      }
      .el-calendar-table thead th {
        padding: 6px 0;
        background-color: #f2f2f2;
      }
      .el-calendar-table .el-calendar-day {
        height: 50px;
        padding: 0;
      }
      .el-calendar-table__row {
        .prev,
        .next {
          cursor: not-allowed;
          pointer-events: none; //禁止点击上下月份的日期
        }
      }
      .calendar-content {
        height: 50px;
        text-align: center;
      }
      .calendar-day {
        line-height: 18px;
        font-size: 12px;
        padding-top: 4px;
      }

      .is-selected {
        font-size: 14px;
      }
      & .el-button-group > .el-button:not(:first-child):not(:last-child):after {
        content: '当月';
      }
      .el-calendar-table td.is-today {
        color: #303133;
      }
    }
    .bgSuccess {
      background: #67c23a;
    }
    .bgDanger {
      background: #f90909;
    }
    .bgInfo {
      background: #a2a2a2;
    }
  }
}
</style>
