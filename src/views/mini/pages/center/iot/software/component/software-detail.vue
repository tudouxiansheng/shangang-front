<template>
  <div id="publish-version-Detail">
    <el-dialog
      :title="$t('iotSoftware.versionDetail')"
      v-model="$parent.dialogVisiable1"
      width="904px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      draggable
      top="10vh"
    >
      <el-form
        ref="form"
        :model="form"
        :label-width="$parent.locale == 'en' ? '164px' : '120px'"
        size="small"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('iotSoftware.deviceType') + ':'">
              <span>{{ deviceTypeFormatter }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.model') + ':'">
              <span>{{ form.model }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.versionId') + ':'">
              <span>{{ form.versionId }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.versionUrl') + ':'">
              <span>{{ form.versionUrl }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('iotSoftware.manufacturer') + ':'">
              <span>{{ manufacturerFormatter }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.compatible') + ':'">
              <span>{{ form.compatible == 0 ? $t('iotSoftware.no') : $t('iotSoftware.yes') }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.versionName') + ':'">
              <span>{{ form.versionName }}</span>
            </el-form-item>
            <el-form-item :label="$t('iotSoftware.versionMD5') + ':'">
              <span>{{ form.versionMD5 }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="remark">
        <span :style="{ width: $parent.locale == 'en' ? '164px' : '120px' }">
          {{ $t('iotSoftware.versionDesc') }}:
        </span>
        <div>
          {{ form.versionDesc }}
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelPublish">{{ $t('public.cancel') }}</el-button>
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
    deviceTypeFormatter() {
      return this.selectDictLabel(this.$parent.iotDeviceTypeListFormatter, this.form.deviceType, {
        key: 'name',
        value: 'value'
      })
    },
    manufacturerFormatter() {
      return this.selectDictLabel(this.$parent.iotDeviceManufacture, this.form.manufacturer, {
        key: 'name',
        value: 'value'
      })
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.form = this.$parent.dataForm
      })
    },
    cancelPublish() {
      this.$parent.dialogVisiable1 = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
#publish-version-Detail {
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
  .remark {
    display: flex;
    span {
      padding: 0 40px;
      padding-right: 5px;
    }
    div {
      flex: 1;
    }
  }
}
</style>
