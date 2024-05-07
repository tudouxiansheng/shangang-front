<template>
  <!-- 设备详情 -->
  <el-dialog
    :title="$t('deviceManagement.deviceDetails')"
    v-model="$parent.mainDevDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1300px' : '1050px'"
    :close-on-click-modal="false"
    class="deviceDetailDialogVC"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '360px' : '184px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.Affiliation') + '：'">
            <span>{{ form.organizationName }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.associativeSystems') + '：'">
            <span>{{ $parent.choosedAps }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.deviceName') + '：'">
            <span>{{ form.name }}</span>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.encoding') + '：'">
            <span>{{ form.apeID }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.equipmentManufacturers') + '：'">
            <span>{{ form.manufacturer }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.authenticationMethod') + '：'">
            <span>{{ setAuthority(form.authority) }}</span>
          </el-form-item>

          <el-form-item
            :label="$t('deviceManagement.authenticateAccount') + '：'"
            v-if="form.authority != '1' && form.authority != ''"
          >
            <span>{{ form.userId }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.v4Address') + '：'">
            <span>{{ form.ipAddr }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.MACAddress') + '：'">
            <span>{{ form.mac }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.installationLocation') + '：'">
            <span>{{ form.place }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.longitude') + '：'">
            <span>{{ form.longitude }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.locationType') + '：'">
            <span>{{ setPlaceType(form.placeType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.captureDirection') + '：'">
            <span>{{ setCapDirection(form.capDirection) }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.publicSecurity') + '：'">
            <span>{{ form.police }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.informationUnit') + '：'">
            <span>{{ form.contact }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.organizationCode') + '：'">
            <span>{{ form.organizationId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.accessMode') + '：'">
            <span>{{ setAccessType(form.accessType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.deviceType') + '：'">
            <span>{{ setType(form.type) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.deviceModel') + '：'">
            <span>{{ form.model }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.acquisitionType') + '：'">
            <span>{{ $parent.setFunctionType(form.functionType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.v6Address') + '：'">
            <span>{{ form.ipv6Addr }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.portNumber') + '：'">
            <span>{{ form.port }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.installationLocationRegion') + '：'">
            <span>{{ form.placeCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.latitude') + '：'">
            <span>{{ form.latitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.monitorDirection') + '：'">
            <span>{{ setMonitorDirection(form.monitorDirection) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.areaDescription') + '：'">
            <span>{{ form.monitorAreaDesc }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.organizationName') + '：'">
            <span>{{ form.managementName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.installationTime') + '：'">
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
        this.form = this.$parent.mainDevDetailForm
      })
    },
    dialogClosed() {
      this.$parent.mainDevDetailVisible = false
      this.$parent.mainDevDetailForm = {}
    },

    setType(val) {
      let name = ''
      this.$parent.typeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setAccessType(val) {
      let name = ''
      this.$parent.accessTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setAuthority(val) {
      let name = ''
      this.$parent.authorityList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setPlaceType(val) {
      let name = ''
      this.$parent.placeTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
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
    setServiceIp(val) {
      let name = ''
      this.$parent.serviceIpList.filter(item => {
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
.deviceDetailDialogVC {
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
