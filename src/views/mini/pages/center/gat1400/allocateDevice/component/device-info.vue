<template>
  <!-- 设备详情 -->
  <el-dialog
    :title="$t('deviceManagement.deviceDetails')"
    v-model="$parent.dialogvisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1050px'"
    :close-on-click-modal="false"
    class="deviceDetailDialogAllocate"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '370px' : '184px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('cascadeDevice.platform') + ':'">
            <span>{{ form.platName }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.deviceName') + ':'">
            <span>{{ form.name }}</span>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.encoding') + ':'">
            <span>{{ form.apeID }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.v4Address') + ':'">
            <span>{{ form.ipAddr }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.longitude') + ':'">
            <span>{{ form.longitude }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.captureDirection') + ':'">
            <span>{{ setCapDirection(form.capDirection) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.monitorDirection') + ':'">
            <span>{{ setMonitorDirection(form.monitorDirection) }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('cascadeDevice.platformID') + ':'">
            <span>{{ form.platId }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.deviceModel') + ':'">
            <span>{{ form.model }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.v6Address') + ':'">
            <span>{{ form.ipv6Addr }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.portNumber') + ':'">
            <span>{{ form.port }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.latitude') + ':'">
            <span>{{ form.latitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.installationLocationRegion') + ':'">
            <span>{{ form.placeCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.installationTime') + ':'">
            <span>{{ form.installTime }}</span>
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
        this.setDialogCss()
        this.form = this.$parent.detailForm
      })
    },
    dialogClosed() {
      this.$parent.dialogvisible_detail = false
      this.$parent.detailForm = {}
    },

    setCapDirection(val) {
      let name = ''
      this.$parent.capDirectionList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    setMonitorDirection(val) {
      let name = ''
      this.$parent.monitorDirectionList.filter(item => {
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
.deviceDetailDialogAllocate {
  .el-dialog__body {
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
