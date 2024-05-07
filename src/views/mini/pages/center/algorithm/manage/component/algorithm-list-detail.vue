<template>
  <el-dialog
    :title="$t('algoManage.algoInfo')"
    v-model="$parent.algorithmListDetailVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="newAlgorithmDetailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '185px' : '130px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('algoManage.algoID') + '：'">
            <span>{{ form.algorithmId }}</span>
          </el-form-item>

          <el-form-item :label="$t('algoManage.algoAccess') + '：'">
            <span>{{ $parent.setAccessId(form.accessId) }}</span>
          </el-form-item>

          <el-form-item :label="$t('algoManage.algoVersion') + '：'">
            <span>{{ form.version }}</span>
          </el-form-item>
          <el-form-item :label="$t('algoManage.enableOrStop') + '：'">
            <span :class="form.enabled == 1 ? 'success' : 'danger'">
              {{ form.enabled == 1 ? $t('public.enable') : $t('public.deactivate') }}
            </span>
          </el-form-item>
          <el-form-item :label="$t('algoManage.effectiveDate') + '：'">
            <span>{{ form.validDateBegin }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('algoManage.algoName') + '：'">
            <span>{{ form.algorithmName }}</span>
          </el-form-item>

          <el-form-item :label="$t('algoManage.algoModel') + '：'">
            <span>{{ $parent.setModelId(form.modelId) }}</span>
          </el-form-item>

          <el-form-item :label="$t('algoManage.manufacturer') + '：'">
            <span>{{ form.vendor }}</span>
          </el-form-item>
          <el-form-item v-hasPermi="[36]" :label="$t('algoManage.maxChannel') + '：'">
            <span>{{ form.maxChannel }}</span>
          </el-form-item>
          <el-form-item :label="$t('algoManage.extractFeature') + '：'">
            <span>{{ form.extractFeature?$t('algoManage.available'):$t('algoManage.notAvailable') }}</span>
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
      form: {},
      locale: localStorage.getItem("locale"),
    }
  },

  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.algorithmListDetailVisible = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.newAlgorithmDetailDialog {
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
