<template>
  <el-dialog
    :title="$t('accessAllocate.accessCameraDetail')"
    v-model="$parent.dialogFormVisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1000px'"
    :close-on-click-modal="false"
    class="accessCameraDetail detailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '180px' : '140px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('accessAllocate.platId') + '：'">
            <span>{{ form.platId }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.cameraId') + '：'">
            <span>{{ form.cameraId }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.channelNo') + '：'">
            <span>{{ form.channelNo }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.model') + '：'">
            <span>{{ form.model }}</span>
          </el-form-item>

          <el-form-item :label="$t('primaryDevice.mainDevId') + '：'">
            <span>{{ form.mainDevId }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessAllocate.groupId') + '：'">
            <span>{{ form.groupId }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessAllocate.ipAddress') + '：'">
            <span>{{ form.ipAddress }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.longitude') + '：'">
            <span>{{ form.longitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.installLocate') + '：'">
            <span>{{ form.address }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('accessAllocate.platName') + '：'">
            <span>{{ form.platName }}</span>
          </el-form-item>
          <el-form-item :label="$t('primaryDevice.cameraName') + '：'">
            <span>{{ form.cameraName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.ptzType') + '：'">
            <span>{{ $parent.setDevType(form.ptzType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceCamera.cameraStatus') + '：'">
            <span>{{ $parent.setStatus(form.cameraStatus) }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessAllocate.groupName') + '：'">
            <span>{{ form.groupName }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessAllocate.port') + '：'">
            <span>{{ form.port }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.latitude') + '：'">
            <span>{{ form.latitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.updateTime') + '：'">
            <span>{{ form.updateTime }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
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
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible_detail = false
      this.$parent.dataForm = {}
    }
  }
}
</script>
