<template>
  <el-dialog
    :title="$t('systemAnnounce.createAnnounce')"
    v-model="dialogVisible"
    top="10vh"
    width="680px"
    class="create_notice"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('systemAnnounce.receiver') + '：'" prop="receiver">
        <el-select v-model="ruleForm.receiver" disabled>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systemAnnounce.title') + '：'" prop="title">
        <el-input
          v-model="ruleForm.title"
          clearable
          :placeholder="$t('systemAnnounce.pleaseTitle')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('systemAnnounce.content') + '：'" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          maxlength="1024"
          show-word-limit
          :placeholder="$t('systemAnnounce.pleaseContent')"
          v-model="ruleForm.content"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('systemAnnounce.noticeTime') + '：'" prop="noticeTime">
        <el-date-picker
          :shortcuts="pickerOptions && pickerOptions.shortcuts"
          :disabled-date="pickerOptions && pickerOptions.disabledDate"
          :cell-class-name="pickerOptions && pickerOptions.cellClassName"
          v-model="ruleForm.noticeTime"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :range-separator="$t('systemAnnounce.to')"
          :start-placeholder="$t('systemAnnounce.startDate')"
          :end-placeholder="$t('systemAnnounce.endDate')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('systemAnnounce.footPublisherName') + '：'" prop="footPublisher">
        <el-input
          v-model="ruleForm.footPublisher"
          clearable
          :placeholder="$t('systemAnnounce.pleaseFootPublisherName')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('systemAnnounce.footPublishDate') + '：'" prop="footPublishDate">
        <el-date-picker
          v-model="ruleForm.footPublishDate"
          type="date"
          format="YYYY-MM-DD"
          disabled
          :placeholder="$t('systemAnnounce.pleaseFootPublishDate')"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">
          {{ $t('systemAnnounce.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitForm">{{ $t('systemAnnounce.comfirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    createVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 可以选择今天得日期
        }
      },
      ruleForm: {
        receiver: this.$t('systemAnnounce.people'),
        title: '',
        noticeTime: '',
        beginDate: '',
        endDate: '',
        content: '',
        footPublisher: '',
        footPublishDate: this.dayjs(Date.now()).format('YYYY-MM-DD')
      },
      options: [
        {
          name: this.$t('systemAnnounce.people'),
          value: this.$t('systemAnnounce.people')
        }
      ],
      rules: {
        title: [
          {
            required: true,
            message: this.$t('systemAnnounce.titleContent'),
            trigger: 'blur'
          },
          {
            max: 20,
            message: this.$t('systemAnnounce.titleMax20'),
            trigger: 'change'
          }
        ],
        receiver: [
          {
            required: true,
            message: this.$t('systemAnnounce.pleaseReceiver'),
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: this.$t('systemAnnounce.pleaseContent'),
            trigger: 'blur'
          }
        ],
        noticeTime: [
          {
            required: true,
            message: this.$t('systemAnnounce.pleaseNoticeTime'),
            trigger: 'change'
          }
        ],
        footPublisher: [
          {
            required: true,
            message: this.$t('systemAnnounce.pleaseFootPublisher'),
            trigger: 'blur'
          }
        ],
        footPublishDate: [
          {
            required: true,
            message: this.$t('systemAnnounce.pleaseFootPublishDate2'),
            trigger: 'change'
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
      this.$nextTick(async () => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    submitForm() {
      let { title, receiver, noticeTime, content, footPublisher, footPublishDate } = this.ruleForm
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let obj = {
            title,
            receiver,
            beginDate: noticeTime[0],
            endDate: noticeTime[1],
            content,
            footPublisher,
            footPublishDate
          }
          this.$api.announcePublish(obj).then(res => {
            if (res && res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('systemAnnounce.createNoticeSuccess')
              })
              this.dialogVisible = false
              this.$parent.announceSearch()
            } else {
              this.$message({
                type: 'error',
                message: this.$t('systemAnnounce.createNoticeError')
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.create_notice {
  .el-dialog__body {
    padding: 15px 40px 5px 40px;
    .el-textarea .el-input__count {
      background: transparent;
      height: 22px;
      pointer-events: none;
    }
  }
  .el-date-editor .el-range-separator {
    padding: 1px 5px 0 0 !important;
    color: #666;
  }
  .el-range-editor--small .el-range-input {
    background: transparent;
    color: #262626;
  }
  .el-range-editor--small.el-input__inner {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
