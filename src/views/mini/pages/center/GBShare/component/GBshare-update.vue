<template>
  <el-dialog
    :title="$t('GBShare.modifySharedDevice')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1000px"
    class="GBShareUpdateDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="116px" label-position="left">
      <el-form-item :label="$t('GBShare.cameraNumber') + ':'" prop="cameraId">
        <el-input
          v-model="form.cameraId"
          auto-complete="off"
          :placeholder="$t('GBShare.enterTheCameraNumber')"
          clearable
          disabled
        />
      </el-form-item>

      <el-form-item :label="$t('GBShare.platForm') + ':'" prop="platID">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.platID"
          :placeholder="$t('GBShare.selectPlatForm')"
          disabled
        >
          <el-option
            v-for="(item, index) in $parent.accessPlatList"
            :key="index"
            :label="item.platformName"
            :value="item.platformId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('alarmList.cameraName') + ':'" prop="cameraName">
        <el-input
          v-model="form.cameraName"
          auto-complete="off"
          :placeholder="$t('alarmList.inputCameraName')"
          clearable
          v-if="resetItem"
        />
      </el-form-item>

      <el-form-item :label="$t('GBShare.interconnectionCoding') + ':'" prop="interconnectCode">
        <el-input
          v-model="form.interconnectCode"
          auto-complete="off"
          :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
          clearable
          v-if="resetItem"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cameraId: '',
        platID: '',
        cameraName: '',
        interconnectCode: ''
      },

      rules: {},

      //视频云
      upLoadFile: '',
      choosedServer: '',
      resetItem: true,

      platGroupName: ''
    }
  },

  mounted() {
    this.setFormRules()
  },

  computed: {
    itemDisabled() {
      return this.form.associateServer != ''
    }
  },

  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
      })
      this.form = JSON.parse(JSON.stringify(this.$parent.choosedCameraInfo))
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
    },

    setFormRules() {
      this.rules = {
        cameraId: [
          {
            required: true,
            message: this.$t('GBShare.enterTheCameraNumber'),
            trigger: 'change'
          }
        ],
        platID: [
          {
            required: true,
            message: this.$t('GBShare.selectPlatForm'),
            trigger: 'change'
          }
        ],
        cameraName: [
          {
            required: true,
            message: this.$t('alarmList.inputCameraName'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 128,
            message: this.$t('public.puPasswdError'),
            trigger: 'change'
          }
        ],
        interconnectCode: [
          {
            required: true,
            message: this.$t('primaryDevice.pleaseInputinterconnectCode'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9]{20}$/,
            message: this.$t('primaryDevice.interconnectCodeError')
          }
        ]
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let form = this.form
          let data = {
            cameraId: form.cameraId,
            platId: form.platID,
            cameraName: form.cameraName,
            interconnectCode: form.interconnectCode
          }
          // 编辑
          this.$api.modifyConvergenceDevice(data).then(res => {
            this.successResult(res, this.$t('public.modifySuccess'))
          })
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
.GBShareUpdateDialog {
  .el-dialog__body {
    .el-date-editor {
      .el-range-input,
      .el-range-separator {
        color: #262626;
      }
    }
  }
  .avatar-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
    cursor: pointer;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .serverDialog {
    .el-dialog__body {
      padding: 20px;
    }
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
