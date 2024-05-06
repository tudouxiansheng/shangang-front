<template>
  <el-dialog
    :title="$t('Operations.clusterDetails')"
    v-model="dialogVisible"
    top="10vh"
    :width="locale == 'en' ? '1450px' : '1200px'"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    class="domainDetailDialogClass"
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="dataForm"
      :label-width="locale == 'en' ? '500px' : '250px'"
      label-position="left"
    >
      <collapse-card :title="$t('primaryDevice.basicInfo')" v-model:collapse="show1">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.clusterCode') + '：'">
              <span>{{ dataForm.baseInfo.domainCode }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.clusterName') + '：'">
              <span>{{ dataForm.baseInfo.domainName }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.clusterEnable') + '：'">
              <span :class="dataForm.baseInfo.enableDomain == 1 ? 'success' : 'danger'">
                {{
                  dataForm.baseInfo.enableDomain == '1'
                    ? $t('Operations.enable')
                    : $t('Operations.notEnabled')
                }}
              </span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.T28181Information')" v-model:collapse="show2">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.protocolSupported') + '：'">
              <span :class="dataForm.gbAccessInfo.enableAccess == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.gbAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.T28181Devices') + '：'">
              <span>{{ dataForm.gbAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.T28181Currently') + '：'">
              <span>{{ dataForm.gbAccessInfo.devicesCurrNumber }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.T28181IPv4') + '：'">
              <span>{{ dataForm.gbAccessInfo.accessPrivateIpv4 }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.T28181Port') + '：'">
              <span>{{ dataForm.gbAccessInfo.accessPrivatePort }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.T28181IPv4Pblic') + '：'">
              <span>{{ dataForm.gbAccessInfo.accessPublicIpv4 }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.T28181PortPublic') + '：'">
              <span>{{ dataForm.gbAccessInfo.accessPublicPort }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.T28181IPv6Pblic') + '：'">
              <span>{{ dataForm.gbAccessInfo.accessPublicIpv6 }}</span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.onvifAccessInformation')" v-model:collapse="show3">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.onvifSupported') + '：'">
              <span :class="dataForm.onvifAccessInfo.enableAccess == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.onvifAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.onvifMaximum') + '：'">
              <span>{{ dataForm.onvifAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.onvifDevice') + '：'">
              <span>{{ dataForm.onvifAccessInfo.devicesCurrNumber }}</span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.hwsdkPassively')" v-model:collapse="show4">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.HWSDKSupported') + '：'">
              <span
                :class="dataForm.hwsdkPassiveAccessInfo.enableAccess == 1 ? 'success' : 'danger'"
              >
                {{ $parent.setApprove(dataForm.hwsdkPassiveAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkMaximum') + '：'">
              <span>{{ dataForm.hwsdkPassiveAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkDevice') + '：'">
              <span>{{ dataForm.hwsdkPassiveAccessInfo.devicesCurrNumber }}</span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.hwsdkActively')" v-model:collapse="show5">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.HWSDKProtocolSupported') + '：'">
              <span
                :class="dataForm.hwsdkActiveAccessInfo.enableAccess == 1 ? 'success' : 'danger'"
              >
                {{ $parent.setApprove(dataForm.hwsdkActiveAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkMaximumDevice') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkDeviceCurrent') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.devicesCurrNumber }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkIPv4') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.accessPrivateIpv4 }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkPort') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.accessPrivatePort }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkIPv4Actively') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.accessPublicIpv4 }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkPortActively') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.accessPublicPort }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkIPv6Actively') + '：'">
              <span>{{ dataForm.hwsdkActiveAccessInfo.accessPublicIpv6 }}</span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.hwsdkInformation')" v-model:collapse="show6">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkSupported') + '：'">
              <span :class="dataForm.hiksdkAccessInfo.enableAccess == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.hiksdkAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.hwsdkAccessed') + '：'">
              <span>{{ dataForm.hiksdkAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.hwsdkConnected') + '：'">
              <span>
                {{ dataForm.hiksdkAccessInfo.devicesCurrNumber }}
              </span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.dhsdkInformation')" v-model:collapse="show7">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.dhsdkSupported2') + '：'">
              <span :class="dataForm.dhsdkAccessInfo.enableAccess == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.dhsdkAccessInfo.enableAccess) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.dhsdkMaximum') + '：'">
              <span>{{ dataForm.dhsdkAccessInfo.devicesUpperLimit }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.dhsdkNumber') + '：'">
              <span>
                {{ dataForm.dhsdkAccessInfo.devicesCurrNumber }}
              </span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
      <collapse-card :title="$t('Operations.additionalInformation')" v-model:collapse="show8">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('Operations.streamDistribution') + '：'">
              <span :class="dataForm.extraInfo.enableDistribution == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.extraInfo.enableDistribution) }}
              </span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('Operations.recordingSupported') + '：'">
              <span :class="dataForm.extraInfo.enableStorage == 1 ? 'success' : 'danger'">
                {{ $parent.setApprove(dataForm.extraInfo.enableStorage) }}
              </span>
            </el-form-item>
          </div>
        </div>
      </collapse-card>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'
export default {
  components: {
    CollapseCard
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataForm: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true,
      show7: true,
      show8: true
    }
  },
  methods: {
    dialogOpen() {},
    dialogClosed() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.domainDetailDialogClass {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
