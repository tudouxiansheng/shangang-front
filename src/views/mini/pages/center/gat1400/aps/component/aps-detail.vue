<template>
  <!-- 采集系统详情 -->
  <el-dialog
    :title="$t('deviceManagement.systemDetails')"
    v-model="$parent.apsDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1050px'"
    :close-on-click-modal="false"
    class="apsDetailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '370px' : '156px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.Affiliation') + ':'">
            <span>{{ form.organizationName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.systemName') + ':'">
            <span>{{ form.apsName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.authenticationMethod') + ':'">
            <span>{{ setAuthority(form.authority) }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('deviceManagement.authenticateAccount') + ':'"
            v-if="form.authority != '1'"
          >
            <span>{{ form.account }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.v4Address') + ':'">
            <span>{{ form.ipAddr }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.portNumber') + ':'">
            <span>{{ form.port }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.organizationCode') + ':'">
            <span>{{ form.organizationId }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.encoding') + ':'">
            <span>{{ form.apsId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.accessType') + ':'">
            <span>{{ setType(form.apsAccessType) }}</span>
          </el-form-item>
          <el-form-item style="height: 24px">
            <span></span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.v6Address') + ':'">
            <span>{{ form.ipv6Addr }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('platformManagement.viewDescription') + ':'">
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
    setAuthority(val) {
      let name = ''
      this.$parent.authorityList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setType(val) {
      let name = ''
      this.$parent.apsAccessTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.apsDetailForm
      })
    },
    dialogClosed() {
      this.$parent.apsDetailVisible = false
      this.$parent.apsDetailForm = {}
    }
  }
}
</script>

<style lang="scss">
.apsDetailDialog {
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
  .laneInfoDiv {
    padding: 0px 22px;
  }
}
</style>
