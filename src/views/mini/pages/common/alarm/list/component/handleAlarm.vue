<template>
  <!-- 处理意见弹框 -->
  <el-dialog
    :title="handleAlarmInfoObj.title"
    v-model="dialogVisible"
    top="10vh"
    width="600px"
    class="handle-alarm"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="confirmDesc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 14 }"
          maxlength="512"
          show-word-limit
          :placeholder="$t('newAlarm.inputAdvise') + ' . . .'"
          v-model="ruleForm.confirmDesc"
        ></el-input>
      </el-form-item>
      <div style="margin-bottom: 20px; font-weight: bold">
        {{ $t('newAlarm.quickInput') }}
      </div>
      <el-form-item>
        <!-- 组件 -->
        <info
          @changeInfo="changeInfo"
          v-model="ruleForm.confirmDesc"
          :adviseList="adviseList"
        ></info>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('newAlarm.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('newAlarm.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import info from './info'
export default {
  components: {
    info
  },
  props: {
    createVisible: {
      type: Boolean,
      default: false
    },
    handleAlarmInfoObj: {
      type: Object
    },
    data: {
      type: Object
    },
    search: {
      type: Function
    }
  },
  data() {
    return {
      ruleForm: {
        confirmDesc: ''
      },
      adviseList: [],
      rules: {
        confirmDesc: [
          {
            required: true,
            message: this.$t('newAlarm.inputAdvise'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.createVisible
      },
      set(val) {
        this.$emit('update:createVisible', val)
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //打开弹框
    dialogOpen() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      if (this.handleAlarmInfoObj.index == 'delete') {
        this.adviseList = [
          `${this.$t('newAlarm.mis1')};`,
          `${this.$t('newAlarm.mis2')};`,
          `${this.$t('newAlarm.mis3')};`,
          `${this.$t('newAlarm.mis4')};`,
          `${this.$t('newAlarm.mis5')};`,
          `${this.$t('newAlarm.mis6')};`
        ]
      } else {
        this.adviseList = [
          `${this.$t('newAlarm.correct1')};`,
          `${this.$t('newAlarm.correct2')};`,
          `${this.$t('newAlarm.correct3')};`,
          `${this.$t('newAlarm.correct4')};`,
          `${this.$t('newAlarm.correct5')};`,
          `${this.$t('newAlarm.correct6')};`
        ]
      }
      this.$nextTick(async () => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          let obj = {
            alarmId: this.data.alarmId,
            alarmGroupType: this.data.alarmGroup,
            cameraId: this.data.alarmDevId,
            alarmTime: this.data.alarmTime,
            checkResult: this.handleAlarmInfoObj.index == 'delete' ? 1 : 2,
            confirmDesc: this.ruleForm.confirmDesc
          }
          this.dialogVisible = false
          this.$emit('content', {
            confirmDesc: this.ruleForm.confirmDesc,
            alarmId: this.data.alarmId
          })
          const res = await this.$api.checkAlarmReport(obj)
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('newAlarm.adviseSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
            this.search()
          } else {
            this.$message({
              message: this.$t('newAlarm.adviseError'),
              type: 'error'
            })
          }
        }
      })
    },
    changeInfo(val) {
      this.ruleForm.confirmDesc = val
    }
  }
}
</script>

<style lang="scss">
.handle-alarm {
  .el-dialog__body {
    padding: 15px 40px 5px 40px;
    min-height: 400px;
    .el-textarea .el-input__count {
      background: transparent;
      height: 22px;
      pointer-events: none;
    }
  }
}
</style>
