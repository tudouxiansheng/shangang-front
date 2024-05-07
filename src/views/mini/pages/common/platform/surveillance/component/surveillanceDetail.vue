<template>
  <el-dialog
    :title="$t('monitorManage.platformDetails')"
    v-model="$parent.platDetailVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1300px' : '1000px'"
    :close-on-click-modal="false"
    class="monitorDetaildialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '280px' : '115px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('monitorManage.platformID') + '：'">
            <span>{{ form.platId }}</span>
          </el-form-item>

          <el-form-item :label="$t('monitorManage.platformType') + '：'">
            <span>{{ setPlatType(form.platType) }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.SVSIntranetIP') + '：'"
            v-if="form.platType == '1'"
          >
            <span>{{ form.serverIntranetIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.SVSPublicNetworkIP') + '：'"
            v-if="form.platType == '1'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.appKey') + '：'"
            v-if="form.platType == '6' || form.platType == '8' || form.platType == '10'"
          >
            <span>{{ form.platAccount }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.WSUServiceAddress') + '：'"
            v-if="form.platType == '2'"
          >
            <span>{{ form.serverAddr }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.SDKSIPIntranetIP') + '：'"
            v-if="form.platType == '2'"
          >
            <span>{{ form.serverIntranetIp }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.eSDKIntranetIP') + '：'"
            v-if="form.platType == '5'"
          >
            <span>{{ form.serverIntranetIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.eSDKPublicNetworkIP') + '：'"
            v-if="form.platType == '5'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.artemisIntranetIP') + '：'"
            v-if="form.platType == '6' || form.platType == '8'"
          >
            <span>{{ form.serverIntranetIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.artemisPublicIP') + '：'"
            v-if="form.platType == '6' || form.platType == '8'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.platformIntranetIP') + '：'"
            v-if="form.platType == '9'"
          >
            <span>{{ form.serverIntranetIp }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.platformPublicNetworkIP') + '：'"
            v-if="form.platType == '9'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.serviceAddress') + '：'"
            v-if="form.platType == '12'"
          >
            <span>{{ form.serverAddr }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.platformUserID') + '：'"
            v-if="form.platType == '12'"
          >
            <span>{{ form.platUserId }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.platformPublicNetworkIP') + '：'"
            v-if="form.platType == '14'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>
          <el-form-item :label="$t('monitorManage.port') + '：'" v-if="form.platType == '14'">
            <span>{{ form.serverPort }}</span>
          </el-form-item>

          <el-form-item :label="$t('monitorManage.deviceAccesProtocol') + '：'">
            <span>{{ setStreamProtocol(form.streamProtocol) }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('public.platName') + '：'">
            <span>{{ form.platName }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.platformPort') + '：'"
            v-if="form.platType == '9'"
          >
            <span>{{ form.serverPort }}</span>
          </el-form-item>
          <el-form-item :label="$t('monitorManage.eSDKPort') + '：'" v-if="form.platType == '5'">
            <span>{{ form.serverPort }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.eSDKAuthenticationAccount') + '：'"
            v-if="form.platType == '5'"
          >
            <span>{{ form.platAccount }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.SDKSIPPublicIP') + '：'"
            v-if="form.platType == '2'"
          >
            <span>{{ form.serverPublicIp }}</span>
          </el-form-item>
          <el-form-item :label="$t('monitorManage.SDKSIPPort') + '：'" v-if="form.platType == '2'">
            <span>{{ form.serverPort }}</span>
          </el-form-item>

          <el-form-item :label="$t('public.account') + '：'" v-if="form.platType == '9'">
            <span>{{ form.platAccount }}</span>
          </el-form-item>

          <el-form-item :label="$t('monitorManage.SVSPort') + '：'" v-if="form.platType == '1'">
            <span>{{ form.serverPort }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.artemisPort') + '：'"
            v-if="form.platType == '6' || form.platType == '8'"
          >
            <span>{{ form.serverPort }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('monitorManage.accessMode') + '：'"
            v-if="form.platType == '12' || form.platType == '14'"
          >
            <span>
              {{
                form.accessMode == 1
                  ? $t('monitorManage.sharedAccess')
                  : $t('monitorManage.exclusiveAccess')
              }}
            </span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.AKAccountNumber') + '：'"
            v-if="form.platType == '12'"
          >
            <span>{{ form.platAccount }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('monitorManage.anAuthenticationAccount') + '：'"
            v-if="form.platType == '14'"
          >
            <span>{{ form.platAccount }}</span>
          </el-form-item>

          <el-form-item :label="$t('monitorManage.platformVersion') + '：'">
            <span>{{ form.platVersion }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('public.remark') + '：'" class="padding40">
        <span>{{ form.remark }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  async mounted() {},
  methods: {
    setPlatType(val) {
      if (val) {
        this.$parent.plaTypesList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setStreamProtocol(val) {
      if (val == 0) {
        return this.$t('monitorManage.streamingProtocol')
      } else if (val == 1) {
        return this.$t('monitorManage.privateProtocol')
      } else if (val == 2) {
        return this.$t('monitorManage.equipmentDirectConnection')
      } else {
        return ''
      }
    },
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.platDetailVisible = false
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.monitorDetaildialog {
  .el-dialog__body {
    padding: 15px 0px 5px;
    color: #4d4d4d;
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
}
</style>
