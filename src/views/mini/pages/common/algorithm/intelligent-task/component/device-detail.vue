<template>
  <!-- 设备详情 -->
  <el-dialog
    :title="$t('primaryDevice.detailsMainDev')"
    :visible.sync="$parent.mainDevDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1300px' : '1200px'"
    :close-on-click-modal="false"
    class="deviceDetailDialog"
    :modal="false"
    :draggable="false"
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '240px' : '150px'"
      label-position="left"
      class="ellipsis"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('public.organizationName') + '：'" prop="organizationName">
            <el-tooltip effect="dark" :content="form.organizationName" placement="top">
              <span>{{ form.organizationName }}</span>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('primaryDevice.mainDevId') + '：'" prop="mainDevId">
            <el-tooltip effect="dark" :content="form.mainDevId" placement="top">
              <span>{{ form.mainDevId }}</span>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('public.mainDevName') + '：'" prop="mainDevName">
            <span>{{ form.mainDevName }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('Operations.clusterName') + '：'"
            v-if="form.platType == PLATFORM_TYPE.ADS || form.platType == PLATFORM_TYPE.IVS"
          >
            <span>{{ form.clusterName }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('primaryDevice.tasIp') + '：'"
            v-if="form.platType == PLATFORM_TYPE.IVS"
          >
            <span>{{ form.tasIp }}</span>
          </el-form-item>
          <el-form-item :label="$t('tenantManage.belongTenant') + '：'">
            <span>{{ form.tenantName }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.puIp') + '：'" prop="puIP">
            <span>{{ form.puIp }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType == 15 && form.drive == 'HWSDK-ACREG'"
            :label="$t('primaryDevice.privateIp') + '：'"
          >
            <span>{{ form.accessServerVPNHost }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
            <span>{{ $parent.setmainDevType(form.mainDevType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('public.applicationType') + '：'" prop="applicationType">
            <span>{{ setApplicationType(form.applicationType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('primaryDevice.accessInterconnectCode') + '：'">
            <span>{{ form.accessInterconnectCode }}</span>
          </el-form-item>

          <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
            <span>{{ form.installLocate }}</span>
          </el-form-item>
          <el-form-item
            v-show="form.drive == 'HWSDK-ACREG'"
            :label="$t('primaryDevice.accessInterconnectCode3') + '：'"
            prop="installLocate"
          >
            <span>{{ form.accessInterconnectCode }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('public.platName') + '：'" prop="platName">
            <span>{{ form.platName }}</span>
          </el-form-item>

          <el-form-item :label="$t('public.thirdMainDevId') + '：'" prop="thirdMainDevId">
            <el-tooltip effect="dark" :content="form.thirdMainDevId" placement="top">
              <span>{{ form.thirdMainDevId }}</span>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('primaryDevice.drive') + '：'" prop="mainDevName">
            <span>{{ form.drive }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('Operations.DomaincodeName') + '：'"
            v-if="form.platType == PLATFORM_TYPE.ADS || form.platType == PLATFORM_TYPE.IVS"
          >
            <span>{{ form.domainName }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('primaryDevice.tasCode') + '：'"
            v-if="form.platType == PLATFORM_TYPE.IVS"
          >
            <span>{{ form.tasCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.port') + '：'">
            <span>{{ form.puPort }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType == 15 && form.drive == 'HWSDK-ACREG'"
            :label="$t('primaryDevice.privatePort') + '：'"
          >
            <span>{{ form.accessServerVPNPort }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.state') + '：'" prop="status">
            <span>
              {{setAllocationStatus(form.status)}}
            </span>
          </el-form-item>

          <el-form-item :label="$t('primaryDevice.networkType') + '：'" prop="networkType">
            <span>{{ setNetworkType(form.networkType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.manufacturer') + '：'" prop="manufacturer">
            <span>{{ setManufacturer(form.manufacturer) }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-show="form.drive === 'T28181' && form.platType != 5">
        <div class="form-left">
          <el-form-item :label="$t('primaryDevice.accessServerId') + '：'">
            <span>{{ form.accessServerId }}</span>
          </el-form-item>
        </div>
        <div class="form-right" v-show="form.platType != 5">
          <el-form-item :label="$t('primaryDevice.accessServerDomain') + '：'">
            <span>{{ form.accessServerDomain }}</span>
          </el-form-item>
        </div>
      </div>
      <div class="form-flex" v-show="form.drive == 'HWSDK-ACREG'">
        <div class="form-left">
          <el-form-item :label="$t('primaryDevice.accessServerHost') + '：'">
            <span>{{ form.accessServerHost }}</span>
          </el-form-item>
        </div>
        <div class="form-right" v-show="form.platType != 5">
          <el-form-item :label="$t('primaryDevice.accessServerPort') + '：'">
            <span>{{ form.accessServerPort }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('public.longitude') + '：'" prop="longitude">
            <span>{{ form.longitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.createTime') + '：'">
            <span>{{ form.createTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.remark') + '：'" prop="remark">
            <span>{{ form.remark }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
            <span>{{ form.latitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.updateTime') + '：'">
            <span>{{ form.updateTime }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-show="form.drive == 'HWSDK-ACREG'">
        <div class="form-left">
          <el-form-item :label="$t('primaryDevice.accessServerIpv6Host') + '：'">
            <span>{{ form.accessServerIpv6Host }}</span>
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
import { PLATFORM_TYPE } from '@/enums/platformEnum'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      PLATFORM_TYPE: PLATFORM_TYPE
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.mainDevDetailForm
      })
    },
    dialogClosed() {
      this.$parent.mainDevDetailVisible = false
      this.$parent.mainDevDetailForm = {}
    },
    setApplicationType(val) {
      let name = ''
      this.$parent.applicationData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    setAllocationStatus(val) {
      return this.$parent.deviceRegisterStatusListFormattered.find((t) => t.value == val)?.name
    },
    setNetworkType(val) {
      let name = ''
      this.$parent.networkTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setManufacturer(val) {
      let name = ''
      this.$parent.manufacturerData.filter(item => {
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
.deviceDetailDialog {
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
  .ellipsis {
    .el-form-item__content {
      span {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
