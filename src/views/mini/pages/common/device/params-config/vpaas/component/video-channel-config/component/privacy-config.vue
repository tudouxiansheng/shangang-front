<template>
  <div class="privacy-config config-form">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.areaConfig') }}</p>
      <videoDrawboard
        ref="drawboard"
        :controls="drawboardControls"
        :vpaas-video-url="videoUrl"
        :before-control-exec="handleBeforeControlExec"
        @board-mounted="handleBoardMounted"
      >
        <template #tips>
          <div class="mb-4" v-show="!(platType == 3 && drive == 'ONVIF')">
            <span class="text-blue-400">{{ $t('mainDevConfiguration.mostTenArea') }}</span>
          </div>
        </template>
      </videoDrawboard>

      <p class="form-title">{{ $t('mainDevConfiguration.otherParam') }}</p>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.enableVideoMask')" prop="enableVideoMask">
            <el-radio-group v-model="form.enableVideoMask">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
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
import { mapState, mapGetters } from 'vuex'
import videoDrawboard from '@/components/videoDrawboard'
import { ControlMethods } from '@components/videoDrawboard/constant'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
export default {
  components: {
    videoDrawboard
  },
  data() {
    return {
      form: {},
      formRules: {},
      videoUrl: ''
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'PermissionCameraManage']),
    drawboardControls() {
      return this.platType == 3 && this.drive == 'ONVIF'
        ? []
        : [
            {
              text: this.$t('mainDevConfiguration.rect'),
              icon: 'rect',
              disabled: false,
              method: ControlMethods.RECT
            },
            {
              text: this.$t('mainDevConfiguration.delete'),
              icon: 'delete',
              disabled: false,
              method: ControlMethods.DELETE
            }
          ]
    }
  },
  watch: {
    selectedCameraId: {
      handler() {
        this.getCameraInfo()
      },
      immediate: true
    }
  },
  methods: {
    async getCameraInfo() {
      let res = await this.$api.getDevConfig({ deviceCode: this.selectedCameraId, configType: 11 })
      if (res.resultCode === 0) {
        this.form = res.configItem
        await this.initDrawboard()
      }
    },
    // 获取实时浏览url
    async getLiveUrl() {
      try {
        const res = await this.$api.getLiveUrl({
          cameraId: this.selectedCameraId,
          streamType: 1,
          urlType: 6,
          withSSL: window.location.protocol == 'https:' ? 1 : 0
        })
        return handleGetPreviewWss(res.url)
      } catch (e) {
        this.$message.error(this.$t('mainDevConfiguration.getLiveUrlFailed'))
      }
    },
    // 初始化画板
    async initDrawboard() {
      const url = await this.getLiveUrl()
      if (url && this.$refs.drawboard) {
        this.videoUrl = url
      }
    },
    // 画板已初始化
    handleBoardMounted() {
      if (this.form.rectInfos) {
        this.$refs.drawboard.render(this.form.rectInfos)
      }
    },
    // 按钮事件控制
    handleBeforeControlExec(method, drawboard) {
      if (
        [ControlMethods.DELETE, ControlMethods.REVOCATION, ControlMethods.CLEAR_SCREEN].includes(
          method
        )
      ) {
        return true
      }
      const length = drawboard.get_objects().length
      if (length >= 5) {
        this.$message.error(this.$t('mainDevConfiguration.mostTenAreaError', { num: 5 }))
        return false
      } else {
        return true
      }
    },
    submitForm() {
      // 获取画板数据
      let rectInfos = this.$refs.drawboard.normalizeData()
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { enableVideoMask } = this.form
          const privacyData = {
            deviceCode: this.selectedCameraId,
            configType: 11,
            configItem: {
              enableVideoMask,
              rectInfos
            }
          }

          let res = await this.$api.setDevConfig(privacyData)
          if (res.resultCode === 0) {
            this.$message({
              message: this.$t('mainDevConfiguration.privacySettingsSuccess'),
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
.privacy-config {
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
