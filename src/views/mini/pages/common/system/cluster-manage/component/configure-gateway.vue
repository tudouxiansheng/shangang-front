<template>
  <!-- 配置网关 -->
  <el-dialog
    :title="$t('Operations.ModifyGateway')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1500px' : '1200px'"
    class="modifyGatewayDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @open="dialogOpen"
    @closed="dialogClosed"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '440px' : '225px'"
      label-position="left"
      :rules="rules"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('Operations.gatewayCode') + '：'"
            auto-complete="off"
            prop="organizationName"
          >
            <el-input
              v-model="form.gatewayId"
              :placeholder="$t('Operations.pleaseInputgatewayCode')"
              :disabled="true"
            />
          </el-form-item>

          <el-form-item
            :label="$t('Operations.NVRcode') + '：'"
            auto-complete="off"
            prop="DynamicIP"
          >
            <el-input
              v-model="form.nvrCode"
              :placeholder="$t('Operations.NVRcodeContent')"
              :disabled="true"
            />
          </el-form-item>
        </div>
        <!-- 第二行 -->
        <div class="form-right">
          <el-form-item
            :label="$t('Operations.DynamicIP') + '：'"
            auto-complete="off"
            prop="DynamicIP"
          >
            <el-input
              v-model="form.gatewayIp"
              :placeholder="$t('Operations.pleaseInputDynamicIP')"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            :label="$t('Operations.NationalIP') + '：'"
            auto-complete="off"
            prop="gbAccessIp"
          >
            <el-input
              clearable
              v-model="form.gbAccessIp"
              :placeholder="$t('Operations.pleaseInputNationalIP')"
            />
          </el-form-item>
        </div>
      </div>
      <div class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('Operations.hwSDKActiveAccessIP') + '：'"
            auto-complete="off"
            prop="hwSDKActiveAccessIP"
          >
            <el-input
              clearable
              v-model="form.hwSDKActiveAccessIP"
              :placeholder="$t('Operations.pleaseInputHWSdkActiveAccessIP')"
            />
          </el-form-item>

          <el-form-item
            :label="$t('Operations.hwSDKActiveAccessPort') + '：'"
            auto-complete="off"
            prop="hwSDKActiveAccessPort"
          >
            <el-input
              clearable
              v-model="form.hwSDKActiveAccessPort"
              :placeholder="$t('Operations.pleaseInputHWSdkActiveAccessPort')"
            />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item
            :label="$t('Operations.Nationalport') + '：'"
            auto-complete="off"
            prop="gbAccessPort"
          >
            <el-input
              clearable
              v-model="form.gbAccessPort"
              :placeholder="$t('Operations.pleaseInputNationalport')"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        gatewayId: '', //网关编码
        gatewayIp: '', //网关IP
        nvrCode: '', //nvr编码
        count: '', //镜头总数
        gbAccessIp: '', // 国际设备接入IP
        gbAccessPort: '', //国际设备接入端口
        gbAccessVPNIp: '',
        gbAccessVPNPort: '',
        t1400AccessPort: '',
        t1400AccessVPNPort: '',
        hwSDKActiveAccessIP: '',
        hwSDKActiveAccessPort: '',
        hwSDKActiveAccessVPNIP: '',
        hwSDKActiveAccessVPNPort: ''
      }, //修改网关信息
      rules: {
        gbAccessIp: [
          {
            required: true,
            message: this.$t('Operations.pleaseInputNationalIP'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('Operations.NationalIPerror'),
          },
        ],
        count: [
          {
            pattern: /^[1-9]\d*$/,
            message: this.$t('public.countPrompt')
          }
        ],
        gbAccessPort: [
          {
            required: true,
            message: this.$t('Operations.pleaseInputNationalport'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError')
          }
        ],
        t1400AccessPort: [
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        gbAccessVPNIp: [
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('Operations.NationalIPerror'),
            trigger: 'change'
          }
        ],
        gbAccessVPNPort: [
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        t1400AccessVPNPort: [
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        hwSDKActiveAccessIP: [
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('Operations.NationalIPerror'),
            trigger: 'change'
          }
        ],
        hwSDKActiveAccessPort: [
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        hwSDKActiveAccessVPNIP: [
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('Operations.NationalIPerror'),
            trigger: 'change'
          }
        ],
        hwSDKActiveAccessVPNPort: [
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.dataForm = {}
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let data = {
            gbAccessIp: this.form.gbAccessIp,
            gbAccessPort: this.form.gbAccessPort,
            gbAccessVPNIp: this.form.gbAccessVPNIp,
            gbAccessVPNPort: this.form.gbAccessVPNPort,
            t1400AccessPort: this.form.t1400AccessPort,
            t1400AccessVPNPort: this.form.t1400AccessVPNPort,
            count: parseInt(this.form.count),
            gatewayId: this.form.gatewayId,
            hwSDKActiveAccessIP: this.form.hwSDKActiveAccessIP,
            hwSDKActiveAccessPort: this.form.hwSDKActiveAccessPort,
            hwSDKActiveAccessVPNIP: this.form.hwSDKActiveAccessVPNIP,
            hwSDKActiveAccessVPNPort: this.form.hwSDKActiveAccessVPNPort
          }
          this.$api.modifyGatewayConf(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('Operations.configurationgateway')
              })
              this.$parent.dialogFormVisible = false
              this.$parent.wangguan()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.modifyGatewayDialog {
  .el-dialog__body {
    padding: 15px 0 5px;
  }
}
</style>
