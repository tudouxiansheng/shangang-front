<template>
  <div class="parmas-config config-form">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.extendedSettings') }}</p>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.enableCache')" prop="enableCache" required>
            <el-radio-group v-model="form.enableCache">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {},
      formRules: {}
    }
  },
  computed: {
    ...mapState({
      decoderTypeList: state => state.dict['decoder-type'], //云台协议
      reliableTransmissionProtocolList: state => state.dict['reliable-transmission-protocol'], // 可靠传输
      fecMatrixPercentList: state => state.dict['fec-matrix-percent'], // 抗丢包率
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['PermissionCameraManage'])
  },
  watch: {
    selectedCameraId: {
      handler() {
        this.getCameraInfo()
      },
      immediate: true
    }
  },
  created() {
    this.getSysDictData(['decoder-type', 'reliable-transmission-protocol', 'fec-matrix-percent'])
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    async getCameraInfo() {
      let res = await this.$api.getDevConfig({ deviceCode: this.selectedCameraId, configType: 17 })
      if (res.resultCode === 0) this.form = res.configItem
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { enableCache } = this.form
          const CameraExtendConfig = {
            deviceCode: this.selectedCameraId,
            configType: 17,
            configItem: {
              enableCache
            }
          }
          let res = await this.$api.setDevConfig(CameraExtendConfig)
          if (res.resultCode === 0) {
            this.$message({
              message: this.$t('mainDevConfiguration.editParamsSuccess'),
              type: 'success'
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.parmas-config {
  padding-right: 10px;
  height: 100%;
  overflow-y: auto;
  .el-radio-button__inner {
    background: transparent;
    color: #fffefe;
    border: 1px solid #0b537e;
    border-right: 0;
    height: auto;
  }
  .el-radio-button:first-child {
    .el-radio-button__inner {
      border-left: 1px solid #0b537e;
    }
  }
  .el-radio-button:last-child {
    .el-radio-button__inner {
      border-right: 1px solid #0b537e;
    }
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #0e6294;
    border-color: #0e6294;
    -webkit-box-shadow: -1px 0 0 0 #0e6294;
    box-shadow: -1px 0 0 0 #0e6294;
  }
}
</style>
