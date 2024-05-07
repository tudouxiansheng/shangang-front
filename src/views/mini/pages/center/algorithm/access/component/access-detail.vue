<template>
  <el-dialog
    :title="$t('newAccess.accessInfoDetail')"
    v-model="$parent.accessDetailVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1100px' : '1000px'"
    :close-on-click-modal="false"
    class="accessDetailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" label-width="100px" label-position="left">
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessID') + ':'">
            <span>{{ form.accessId }}</span>
          </el-form-item>
          <el-form-item :label="$t('newAccess.accessMode') + ':'">
            <span>{{ $parent.setAccessType(form.accessType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('newAccess.accessType') + ':'" v-if="form.accessType == 30">
            <span>{{ $parent.setAuthType(form.authType) }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('newAccess.accessName') + ':'">
            <span>{{ form.accessName }}</span>
          </el-form-item>

          <el-form-item :label="$t('newAccess.serviceAccessMode') + ':'">
            <span>{{ $parent.setAccessMode(form.accessMode) }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessIP') + ':'">
            <span>{{ form.accessHost }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('newAccess.accPort') + ':'">
            <span>{{ form.accessPort }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('newAccess.accAccount') + ':'"
            v-if="form.accessType != 30 || form.authType == 1 || form.authType == 2"
          >
            <span>{{ form.account }}</span>
          </el-form-item>
        </div>
        <div class="form-right"></div>
      </div>

      <div class="form-flex" v-if="form.accessType != 30">
        <div class="form-left">
          <el-form-item label="appKey：">
            <span>{{ form.appKey }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item label="appSecret：">
            <span>{{ form.appSecret }}</span>
          </el-form-item>
        </div>
      </div>
      <el-form-item
        label="token："
        class="padding40"
        v-if="form.accessType == 30 && form.authType == 3"
      >
        <span>{{ form.token }}</span>
      </el-form-item>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessVersion') + ':'">
            <span>{{ form.version }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('newAccess.manufacturer') + ':'">
            <span>{{ form.vendor }}</span>
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
      form: {}
    }
  },

  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.accessDetailVisible = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.accessDetailDialog {
  .el-dialog__body {
    padding: 15px 0px 5px;
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
