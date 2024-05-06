<template>
  <!-- license -->
  <el-dialog
    width="500px"
    :title="$t('license.prompt')"
    v-model="$parent.dialogVisible_license"
    class="licenseDialog"
    :close-on-click-modal="false"
    :append-to-body="isAppendBody"
    :modal="isAppendBody"
    :show-close="!isAppendBody"
    draggable
    @open="dialogOpen"
    @closed="dialogClosed"
  >
    <p class="firstLoginPrompt" v-if="leftDays <= 0">
      {{ licensePrompt }}
    </p>
    <el-form ref="form" :model="form" label-width="113px" :rules="rules">
      <el-form-item label="Service ID：" prop="serviceId">
        <el-input v-model="form.serviceId" auto-complete="off" clearable readonly />
      </el-form-item>

      <el-form-item label="License：" class="uploadFile" prop="context">
        <el-input type="textarea" v-model="form.context"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm('form')">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    licenseData: {
      type: Object,
      default: () => ({})
    },
    isAppendBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rules: {},
      uploading: false,
      form: {
        serviceId: '',
        context: ''
      },
      leftDays: 0,
      licensePrompt: '',
      loading: false
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        if (this.isAppendBody) {
          sessionStorage.setItem('leftTop', true) //用于弹框拖拽判断
        } else {
          this.setDialogCss()
        }
        this.licenseData.serviceId ? (this.form.serviceId = this.licenseData.serviceId) : null

        this.leftDays = this.licenseData.leftDays || 0

        this.licensePrompt = this.licenseData.generateTime
          ? this.$t('license.reimportPlz')
          : this.$t('license.reimportPlz')
      })
    },
    dialogClosed() {
      this.$parent.dialogVisible_license = false
      this.$refs.form.resetFields()
      sessionStorage.removeItem('leftTop')
    },

    setFormRules() {
      this.rules = {
        serviceId: [
          {
            required: true,
            message: this.$t('license.inputServiceId'),
            trigger: 'change'
          }
        ],
        context: [
          {
            required: true,
            message: this.$t('license.inputLicense'),
            trigger: 'change'
          }
        ]
      }
    },

    handleReset() {
      this.form.context = ''
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          this.$api
            .importLicenseInfo({
              context: this.form.context,
              netType: this.$getNetType()
            })
            .then(res1 => {
              if (res1.resultCode == 0) {
                this.$emit('getLicense')
                this.$message({
                  type: 'success',
                  message: this.$t('public.importSuccess')
                })
                this.$parent.dialogVisible_license = false
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.licenseDialog {
  .el-dialog__body {
    padding: 15px 40px 5px 40px;
  }
  .uploadFile {
    .el-form-item__content {
      display: flex;
    }
    span {
      width: 100%;
    }
  }
  .firstLoginPrompt {
    margin-top: -10px;
    color: #f56c6c;
    text-align: center;
  }
}
</style>
