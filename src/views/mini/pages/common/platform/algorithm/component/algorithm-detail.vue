<template>
  <el-dialog
    :title="$t('algorithmPlat.algorithmPlatformDetail')"
    v-model="$parent.algorithmDetailVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="algorithmDetailDialog detailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '116px' : '70px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('monitorManage.platformID') + '：'">
            <span>{{ form.platformId }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.platName') + '：'">
            <span>{{ form.platformName }}</span>
          </el-form-item>
          <el-form-item :label="$t('monitorManage.platformType') + '：'">
            <span>{{ $parent.setPlatformType(form.platformType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('monitorManage.version') + '：'">
            <span>{{ form.version }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('algorithmPlat.vendor') + '：'">
            <span>{{ form.vendor }}</span>
          </el-form-item>
          <el-form-item :label="$t('algorithmPlat.accessIP') + '：'">
            <span>{{ form.accessIP }}</span>
          </el-form-item>
          <el-form-item :label="$t('algorithmPlat.accessPort') + '：'">
            <span>{{ form.accessPort }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.account') + '：'">
            <span>{{ form.accessAccount }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('public.remark') + '：'" class="padding40">
        <span>{{ form.platformDesc }}</span>
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
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.algorithmDetailVisible = false
      this.$parent.dataForm = {}
    }
  }
}
</script>
