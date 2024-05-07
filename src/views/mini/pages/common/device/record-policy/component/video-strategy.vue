<template>
  <el-dialog
    :title="
      $parent.operation == 0
        ? $t('videoRecord.addVideoStrategy')
        : $parent.operation == 1
        ? $t('videoRecord.videoStrategyInfo')
        : $t('videoRecord.editingVideoStrategy')
    "
   :visible.sync="$parent.dialogFormVisible"
    top="10vh"
    width="1040px"
    class="videoPlanDialog"
    :close-on-click-modal="false"
    :modal="false"
    :draggable='false'
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="124px" label-position="left">
      <div class="form-flex" v-show="$parent.operation == 1">
        <div class="form-left">
          <el-form-item :label="$t('videoRecord.videoPolicyName') + '：'">
            <span>{{ form.planName }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('videoRecord.videoPolicyType') + '：'">
            <span>
              {{ form.planType == 0 ? $t('videoRecord.weekPlan') : $t('videoRecord.dayPlan') }}
            </span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-show="$parent.operation != 1">
        <div class="form-left">
          <el-form-item prop="planName" :label="$t('videoRecord.videoPolicyName') + '：'">
            <el-input
              v-model="form.planName"
              auto-complete="off"
              :placeholder="$t('videoRecord.enterPolicyName')"
              maxlength="128"
              clearable
            />
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('videoRecord.videoPolicyType') + '：'" prop="planType">
            <el-select
              :popper-append-to-body="false"
              v-model="form.planType"
              @change="planTypeChange"
            >
              <el-option :value="0" :label="$t('videoRecord.weekPlan')"></el-option>
              <el-option :value="1" :label="$t('videoRecord.dayPlan')"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!-- 网格时间选择控件 -->
    <time-grid-control
      ref="timeGridControl"
      :id="$parent.operation != 1 ? 'time_grid_control' : 'time_grid_control1'"
    ></time-grid-control>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clearAll" v-if="$parent.operation != 1">
          {{ $t('videoRecord.removeAll') }}
        </el-button>

        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>

        <el-button
          type="primary"
          @click="submitForm"
          v-if="$parent.operation != 1"
          :loading="$parent.maskloading"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import timeGridControl from '@/components/time-grid-control.vue'
export default {
  components: {
    'time-grid-control': timeGridControl
  },
  data() {
    return {
      form: {
        planName: '',
        planType: 0
      },
      rules: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm

        let planType = this.$parent.dataForm.planType
        let operation = this.$parent.operation
        let timeSpanList = this.$parent.timeSpanList

        this.$refs.timeGridControl.time_initialize(planType, operation, timeSpanList)
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.$refs.timeGridControl.closeControl()
    },

    setFormRules() {
      this.rules = {
        planName: [
          {
            required: true,
            message: this.$t('videoRecord.addPolicyName'),
            trigger: 'blur'
          }
        ],
        planType: [
          {
            required: true,
            message: this.$t('videoRecord.planTypePrompt'),
            trigger: 'blur'
          }
        ]
      }
    },

    //选择周计划或日计划
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },

    // 清除全部
    clearAll() {
      this.$refs.timeGridControl.clearAll()
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
          if (timeSpanList.length == 0) {
            this.$message({
              message: this.$t('videoRecord.setRecordingTime'),
              type: 'error',
              duration: 5 * 1000
            })
            return
          }

          let obj = {
            planName: this.form.planName,
            planType: this.form.planType,
            timeSpanList
          }
          this.$parent.maskloading = true
          if (this.$parent.operation == 0) {
            this.$api.addRecordPlanInfo(obj).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else if (this.$parent.operation == 2) {
            Object.assign(obj, {
              planId: this.form.planId
            })
            this.$api.modifyRecordPlanInfo(obj).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.videoPlanDialog {
  .el-dialog__body {
    padding: 15px 20px 5px;
  }
}
</style>
