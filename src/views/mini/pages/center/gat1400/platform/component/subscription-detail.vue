<template>
  <el-dialog
    :title="$t('platformManagement.subscriptionDetails')"
    v-model="$parent.dialogVisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1500px' : '1160px'"
    :close-on-click-modal="false"
    class="subscription-detail"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :label-width="locale == 'en' ? '310px' : '156px'" label-position="left">
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.subscriptionIdentifier') + ':'">
            <span>{{ form.subscribeId }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.platInterfaceType') + ':'">
            <span>
              {{
                form.platInterfaceType
                  ? form.platInterfaceType == 1
                    ? $t('platformManagement.standardType')
                    : $t('platformManagement.trialType')
                  : ''
              }}
            </span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.resourceClass') + ':'">
            <span>{{ form.resourceClass_zh }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.resultImageDeclare') + ':'">
            <span>{{ form.resultImageDeclare_zh }}</span>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.subscriptionTime') + ':'">
            <span>{{ form.beginTime }} {{ $t('platformManagement.to') }} {{ form.endTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.betweenInformation') + ':'">
            <span>{{ form.reportInterval }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.applicant') + ':'">
            <span>{{ form.applicantName }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.nodeGrouping') + ':'">
            <span>{{ form.gatewayGroup }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.subscriptionTitle') + ':'">
            <span>{{ form.title }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.resourcePath') + ':'">
            <span>{{ form.resourceUri }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.subscriptionCategory') + ':'">
            <span>{{ form.subscribeDetail_zh }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.resultFeatureDeclare') + ':'">
            <span>
              {{
                form.resultFeatureDeclare
                  ? form.resultFeatureDeclare == -1
                    ? $t('platformManagement.false')
                    : $t('platformManagement.true')
                  : ''
              }}
            </span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.informationAddress') + ':'">
            <span>{{ form.receiveAddr }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.applicantUnit') + ':'">
            <span>{{ form.applicantOrg }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item
        :label="$t('platformManagement.subscriptionReason') + ':'"
        prop="reason"
      >
        <span>{{ form.reason }}</span>
      </el-form-item>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.executionStatus') + ':'">
            <span>{{ $parent.setSubStatus(form.subscribeStatus) }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.cancellationTime') + ':'">
            <span>{{ form.cancelTime }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.subscriptionCanceler') + ':'">
            <span>{{ form.subscribeCancelPerson }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.cancelCancellation') + ':'">
            <span>{{ form.cancelReason }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>

    <!-- //车道详情 -->
    <el-dialog
      :title="$t('platformManagement.laneDetails')"
      v-model="laneInfoVisible"
      top="10vh"
      width="1060px"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    ></el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      //1400参数
      laneInfoVisible: false
    }
  },
  methods: {
    showLaneInfo() {
      this.laneInfoVisible = true
    },
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.choosedSubInfo
      })
    },
    dialogClosed() {
      this.$parent.dialogVisible_detail = false
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
.subscription-detail {
  .el-dialog__body {
    .form-flex {
      padding: 0;
    }
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
