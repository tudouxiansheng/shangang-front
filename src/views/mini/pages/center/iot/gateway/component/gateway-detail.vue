<template>
  <div>
    <el-dialog
      :title="$t('iotGateway.gatewayDetail')"
      v-model="$parent.dialogVisiable1"
      width="710px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      top="10vh"
      draggable
      class="gatewayDetail"
    >
      <el-form
        ref="form"
        :model="form"
        :label-width="$parent.locale == 'en' ? '164px' : '100px'"
        size="small"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('iotGateway.organizationName') + ':'">
              <span>{{ $parent.organizationName }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.deviceSn') + ':'">
              <span>{{ form.deviceSn }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.lngLat') + ':'">
              <span>{{ form.longitude + ',' + form.latitude }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.manufacturer') + ':'">
              <span>{{ manufacturerFormatter }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.fwVersion') + ':'">
              <span>{{ form.fwVersion }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.swVersion') + ':'">
              <span>{{ form.swVersion }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('iotGateway.platName') + ':'">
              <span>{{ platIdFormatter }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.deviceName') + ':'">
              <span>{{ form.deviceName }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.installLocate') + ':'">
              <span>{{ form.installLocate }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.model') + ':'">
              <span>{{ form.model }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotGateway.hwVersion') + ':'">
              <span>{{ form.hwVersion }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  computed: {
    platIdFormatter() {
      return this.selectDictLabel(this.$parent.platList, this.form.platId, {
        key: 'platName',
        value: 'platId'
      })
    },
    manufacturerFormatter() {
      return this.selectDictLabel(this.$parent.iotDeviceManufacture, this.form.manufacturer, {
        key: 'name',
        value: 'value'
      })
    }
  },
  mounted() {},
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.dialogVisiable1 = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.gatewayDetail {
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
