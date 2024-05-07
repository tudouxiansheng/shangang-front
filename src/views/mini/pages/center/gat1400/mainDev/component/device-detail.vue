<template>
  <!-- 设备详情 -->
  <el-dialog
    :title="$t('primaryDevice.detailsMainDev')"
    v-model="$parent.mainDevDetailVisible"
    top="10vh"
    width="1060px"
    :close-on-click-modal="false"
    class="deviceDetailDialogViewClass"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" label-width="142px" label-position="left">
      <collapse-card :title="$t('primaryDevice.basicInfo')" v-model:collapse="show1">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('public.organizationName') + '：'" prop="organizationName">
              <span>{{ form.organizationName }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.mainDevName') + '：'" prop="mainDevName">
              <span>{{ form.mainDevName }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.manufacturer') + '：'" prop="manufacturer">
              <span>{{ setManufacturer(form.manufacturer) }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.longitude') + '：'" prop="longitude">
              <span>{{ form.longitude }}</span>
            </el-form-item>
            <el-form-item :label="$t('primaryDevice.networkType') + '：'" prop="networkType">
              <span>{{ setNetworkType(form.networkType) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('public.platName') + '：'" prop="platName">
              <span>{{ form.platName }}</span>
            </el-form-item>
            <el-form-item :label="$t('primaryDevice.ptzType') + '：'" prop="ptzType">
              <span>{{ form.ptzType }}</span>
            </el-form-item>

            <el-form-item :label="$t('public.applicationType') + '：'" prop="applicationType">
              <span>{{ setApplicationType(form.applicationType) }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
              <span>{{ form.latitude }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
              <span>{{ form.installLocate }}</span>
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('public.remark') + '：'" prop="remark" style="padding: 0 50px">
          <span>{{ form.remark }}</span>
        </el-form-item>
      </collapse-card>

      <collapse-card :title="$t('primaryDevice.videoAcess')" v-model:collapse="show2">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('Operations.DomaincodeName') + '：'"
              prop="domainCode"
              v-show="platType == 5"
            >
              <span>{{ form.domainCode }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.tasIp') + '：'"
              prop="tasIp"
              v-show="platType == 5"
            >
              <span>{{ form.tasIp }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
              <span>{{ $parent.setmainDevType(form.mainDevType) }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.puAccessPasswd') + '：'"
              prop="puAccessPasswd"
              v-show="(form.drive = 'T28181')"
            >
              <span>******</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.puAccount') + '：'"
              prop="puAccount"
              v-show="platType == 5"
            >
              <span>{{ form.puAccount }}</span>
            </el-form-item>
            <el-form-item :label="$t('primaryDevice.puIp') + '：'" prop="puIp">
              <span>{{ form.puIp }}</span>
            </el-form-item>
            <el-form-item :label="$t('public.recordPolicy') + '：'" prop="recordPolicy">
              <span>{{ form.recordPolicy }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('Operations.clusterName') + '：'"
              prop="clusterCode"
              v-show="platType == 5"
            >
              <span>{{ form.clusterCode }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.tasCode') + '：'"
              prop="tasCode"
              v-show="platType == 5"
            >
              <span>{{ form.tasCode }}</span>
            </el-form-item>
            <el-form-item :label="$t('primaryDevice.drive') + '：'" prop="mainDevName">
              <span>{{ form.drive }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.interconnectCode') + '：'"
              v-show="(form.drive = 'T28181')"
            >
              <span>{{ form.interconnectCode }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.puPasswd') + '：'"
              prop="puPasswd"
              v-show="platType == 5"
            >
              <span>******</span>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.puPort') + '：'"
              prop="puPort"
              v-show="platType == 5"
            >
              <span>{{ form.puPort }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('public.recordRemainDays') + '：'"
              prop="recordRemainDays"
              v-show="form.recordPolicy !== ''"
            >
              <span>{{ form.recordRemainDays }}</span>
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
    'collapse-card': CollapseCard
  },
  data() {
    return {
      show1: true,
      show2: true,
      show3: true,
      form: {},
      platType: ''
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.mainDevDetailForm
        this.$parent.platNameList.forEach(item => {
          if (item.platId == this.form.platId) {
            this.platType = item.platType
          }
        })
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
    },

    setStatus(val) {
      let name = ''
      if (val == 0) {
        name = this.$t('public.statustype0')
      } else if (val == 1) {
        name = this.$t('public.statustype1')
      } else if (val == 2) {
        name = this.$t('public.statustype2')
      } else if (val == 3) {
        name = this.$t('public.statustype3')
      }
      return name
    }
  }
}
</script>

<style lang="scss">
.deviceDetailDialogViewClass {
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
