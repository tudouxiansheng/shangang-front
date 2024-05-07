<template>
  <el-dialog
    :title="$parent.operation ? $t('iotPlatform.addPlat') : $t('iotPlatform.editPlat')"
    v-model="$parent.dialogFormVisible"
    :width="locale == 'en' ? '1200px' : '800px'"
    top="10vh"
    :close-on-click-modal="false"
    draggable
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="$parent.locale == 'en' ? '164px' : '86px'"
      size="small"
      label-position="left"
    >
      <el-form-item :label="$t('iotPlatform.platName') + ':'" prop="platName">
        <el-input
          v-model="form.platName"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platNamePrompt')"
          clearable
        />
      </el-form-item>

      <el-row :gutter="10" class="row">
        <el-col :span="12">
          <el-form-item :label="$t('iotPlatform.platType') + ':'" prop="category">
            <el-select
              v-model="form.category"
              :placeholder="$t('iotPlatform.platTypePrompt')"
              clearable
            >
              <el-option
                v-for="item in $parent.iotPlatCategoryListFormatter"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0px" prop="platType">
            <el-select
              v-model="form.platType"
              :placeholder="$t('iotPlatform.platTypePrompt')"
              clearable
            >
              <el-option
                v-for="item in $parent.iotPlatTypeListFormatter"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="$t('iotPlatform.platAccount') + ':'" prop="platAccount">
        <el-input
          v-model="form.platAccount"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platAccountPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.platPasswd') + ':'" prop="platPasswd">
        <el-input
          type="password"
          v-model="form.platPasswd"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platPasswdPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.platIntranetIp') + ':'" prop="serverIntranetIp">
        <el-input
          v-model="form.serverIntranetIp"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platIntranetIpPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.platPublicIp') + ':'" prop="serverPublicIp">
        <el-input
          v-model="form.serverPublicIp"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platPublicIpPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.platPort') + ':'" prop="serverPort">
        <el-input
          v-model.number="form.serverPort"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platPortPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.platVersion') + ':'" prop="platVersion">
        <el-input
          v-model="form.platVersion"
          auto-complete="off"
          :placeholder="$t('iotPlatform.platVersionPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('iotPlatform.serverAddress') + ':'" prop="serverAddr">
        <el-input
          v-model="form.serverAddr"
          auto-complete="off"
          :placeholder="$t('iotPlatform.serverAddressPrompt')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('public.remark') + ':'" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          auto-complete="off"
          :placeholder="$t('public.pleaseInputremark')"
          rows="2"
          maxlength="512"
          show-word-limit
          clearable
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
      locale: localStorage.getItem('locale'),
      form: {},
      rules: {},
      organizationId: sessionStorage.getItem('organizationId')
    }
  },
  mounted() {
    this.setRules()
  },
  methods: {
    setRules() {
      this.rules = {
        platName: [
          {
            required: true,
            message: this.$t('iotPlatform.platNamePrompt'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        platType: [
          {
            required: true,
            message: this.$t('iotPlatform.platTypePrompt'),
            trigger: 'change'
          }
        ],
        category: [
          {
            required: true,
            message: this.$t('iotPlatform.platTypePrompt'),
            trigger: 'change'
          }
        ],
        platAccount: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'change'
          }
        ],
        platPasswd: [
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        serverIntranetIp: [
          {
            required: false,
            message: this.$t('public.puIpPrompt'),
            trigger: 'change'
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t("public.puIpError"),
            trigger: "blur",
          },
        ],
        serverPublicIp: [
          {
            required: false,
            message: this.$t('public.puIpPrompt'),
            trigger: 'change'
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t("public.puIpError"),
            trigger: "blur",
          },
        ],
        serverAddr: [
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ]
      }
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.form = this.$parent.dataForm
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          this.form.organizationId = parseInt(this.organizationId)
          if (this.$parent.operation) {
            // 添加
            this.$api.addIotPlatformInfo(this.form).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: this.$t('public.addSuccess')
                })
                this.$parent.getIotPlatformList()
              }
            })
          } else {
            this.form.platId = this.$parent.platId
            this.$api.modifyIotPlatformInfo(this.form).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: this.$t('public.modifySuccess')
                })
                this.$parent.getIotPlatformList()
              }
            })
          }
          this.$parent.maskloading = false
        }
      })
    },
    dialogClosed() {
      this.$refs.form.resetFields()
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
