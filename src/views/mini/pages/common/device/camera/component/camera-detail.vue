<template>
  <el-dialog
    :title="$t('deviceCamera.cameraInfo')"
    :visible.sync="$parent.cameraDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1480px' : '1200px'"
    :close-on-click-modal="false"
    class="cameraDetailDialog"
    :modal="false"

    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '240px' : '126px'"
      label-position="left"
      class="ellipsis"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('public.organizationName') + '：'" auto-complete="off">
            <span>{{ form.organizationName }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.mainDevName') + '：'" auto-complete="off">
            <span>{{ form.mainDevName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.cameraId') + '：'" auto-complete="off">
            <span>{{ form.cameraId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.cameraName') + '：'" auto-complete="off">
            <span>{{ form.cameraName }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.imgType') + '：'" auto-complete="off">
            <span>{{ setImgType(form.imgType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.recordPolicy') + '：'" auto-complete="off">
            <span>{{ form.recordPolicyName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.locationType') + '：'" auto-complete="off">
            <span>{{ $parent.setLocationType(form.locationType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.manufacturer') + '：'" auto-complete="off">
            <span>{{ setManufacturer(form.manufacturer) }}</span>
          </el-form-item>
          <el-form-item
            v-if="!$projectEnv.includes('SIOP')"
            :label="$t('primaryDevice.accessIP') + '：'"
            prop="puIP"
          >
            <span>{{ form.puIp }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('public.platName') + '：'" auto-complete="off">
            <span>{{ form.platName }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.thirdCameraId') + '：'" auto-complete="off">
            <span>{{ form.thirdCameraId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.puIp') + '：'" auto-complete="off">
            <span>{{ form.puIp }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.ptzType') + '：'" auto-complete="off">
            <span>{{ $parent.setPtzType(form.ptzType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.applicationType') + '：'">
            <span>{{ $parent.setApplicationType(form.applicationType) }}</span>
          </el-form-item>
          <el-form-item
            v-if="!$projectEnv.includes('SIOP')"
            :label="$t('primaryDevice.serverPort') + '：'"
            prop="puPort"
          >
            <span>{{ form.puPort }}</span>
          </el-form-item>
          <el-form-item
            v-if="!$projectEnv.includes('SIOP')"
            :label="$t('frontParameterConfiguration.platformIPv6') + '：'"
            prop="gbAccessIpv6"
          >
            <span>{{ form.gbAccessIpv6 }}</span>
          </el-form-item>
          <el-form-item
            v-if="!$projectEnv.includes('SIOP')"
            :label="$t('primaryDevice.interconnectCode') + '：'"
          >
            <span>{{ form.interconnectCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.installLocate') + '：'">
            <span>{{ form.installLocate }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.state') + '：'" auto-complete="off">
            <span>{{ $parent.setStatus(form.status) }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.networkType') + '：'" auto-complete="off">
            <span>{{ $parent.setNetworkType(form.networkType) }}</span>
          </el-form-item>
        </div>
      </div>
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('deviceCamera.xEightyAxis') + '：'">
            <span>{{ form.xEightyAxis }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.longitude') + '：'" auto-complete="off">
            <span>{{ form.longitude }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('deviceCamera.azimuth') + '：'"
            auto-complete="off"
            prop="azimuth"
          >
            <span>{{ form.azimuth }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('deviceCamera.yEightyAxis') + '：'">
            <span>{{ form.yEightyAxis }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.latitude') + '：'">
            <span>{{ form.latitude }}</span>
          </el-form-item>
        </div>
      </div>
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('public.createTime') + '：'">
            <span>{{ form.createTime }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('public.updateTime') + '：'">
            <span>{{ form.updateTime }}</span>
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
      locale: localStorage.getItem('locale'),
      form: {}
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },
    dialogClosed() {
      this.$parent.cameraDetailVisible = false
      this.$parent.dataForm = {}
    },
    setManufacturer(val) {
      let name = ''
      this.$parent.manufacturerData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setImgType(val) {
      let name = ''
      this.$parent.imgTypeAll?.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    }
  }
}
</script>

<style lang="scss">
.cameraDetailDialog {
  .el-dialog__body {
    word-break: break-all;
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
