<template>
  <!-- 故障上报 -->
  <el-form
    ref="form"
    label-width="158px"
    :model="ruleForm"
    :rules="rules"
    label-position="left"
    class="addFault"
  >
    <el-form-item :label="$t('public.selectedCamera') + ':'" required>
      <div class="cameras">
        <div class="cameraList" v-for="(item, index) in cameras" :key="index">
          {{ item.label }}
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="$t('public.faultTypeProp') + ':'" prop="faultTypeList">
      <el-checkbox-group v-model="ruleForm.faultTypeList">
        <el-checkbox label="1">{{ $t('public.cameraisoffline') }}</el-checkbox>
        <el-checkbox label="2">{{ $t('public.liveException') }}</el-checkbox>
        <el-checkbox label="3">{{ $t('public.lostvideo') }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('public.chooseFaultStartTime') + ':'" prop="startTime">
      <el-date-picker
        :shortcuts="pickerOptions && pickerOptions.shortcuts"
        :disabled-date="pickerOptions && pickerOptions.disabledDate"
        :cell-class-name="pickerOptions && pickerOptions.cellClassName"
        v-model="ruleForm.startTime"
        :placeholder="$t('public.startTime')"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('public.chooseFaultEndTime') + ':'">
      <el-date-picker
        v-model="ruleForm.endTime"
        :placeholder="$t('public.endTime')"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
      <label class="tips2">
        <span style="color: red">*</span>
        {{ $t('public.faultEndTimeProp') }}
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['cameras'],
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('public.chooseFaultStartTimeContent')))
      } else if (value > this.ruleForm.endTime && this.ruleForm.endTime) {
        callback(new Error(this.$t('public.startTimeLessEndTimeProp')))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        startTime: '',
        endTime: '',
        faultTypeList: []
      },
      rules: {
        faultTypeList: [
          {
            type: 'array',
            required: true,
            message: this.$t('public.chooseFaultTypeProp'),
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            validator: validatePass1,
            trigger: 'change'
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime()
          return time.getTime() > curDate
        }
      }
    }
  },

  methods: {
    handleSubmit() {
      if (this.cameras.length == 0) {
        this.$message.warning(this.$t('public.cameraChoosePromptContent'))
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.sumitFault()
        }
      })
    },
    async sumitFault() {
      let cameraIdList = []
      this.$loadash.each(this.cameras, cameraItem => {
        cameraIdList.push(cameraItem.id)
      })
      let obj = {
        cameraIdList,
        ...this.ruleForm
      }
      const faults = await this.$api.addVideoFault(obj)
      this.$emit('successSubmit')

      this.resetValid()
      if (faults.resultCode == '00000000') {
        this.$message({
          message: this.$t('public.faultReportSuccess'),
          type: 'success'
        })
      } else {
        this.$message({
          message: this.$t('public.faultReportFail'),
          type: 'error'
        })
      }
    },
    resetValid() {
      this.ruleForm = {
        startTime: '',
        endTime: '',
        faultTypeList: []
      }
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.addFault {
  margin: 0 80px;
  .cameras {
    height: 100px;
    border: 1px solid #c0c0c0;
    overflow: auto;
  }
  .cameraList {
    padding: 0 20px;
  }
  .tips2 {
    display: inline-block;
    font-size: 12px;
    color: #000;
  }
}
</style>
