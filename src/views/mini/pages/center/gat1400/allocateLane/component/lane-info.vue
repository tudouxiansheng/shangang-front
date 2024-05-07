<template>
  <el-dialog
    :title="$t('platformManagement.laneDetails')"
    v-model="$parent.dialogvisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1060px'"
    :close-on-click-modal="false"
    class="laneDetailDialogAll"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '225px' : '156px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('deviceManagement.belongBayonet') + ':'">
            <span>{{ form.tollgateName }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.laneName') + ':'">
            <span>{{ form.name }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.laneDirection') + ':'">
            <span>{{ $parent.setDirection(form.direction) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.speedLimit') + ':'">
            <span>{{ form.maxSpeed }}{{ $t('deviceManagement.kmHour') }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.leavingTheCity') + ':'">
            <span>{{ $parent.setCityPass(form.cityPass) }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('cascadeDevice.bayonetID') + ':'">
            <span>{{ form.tollgateID }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.laneID') + ':'">
            <span>{{ form.laneId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.laneCoding') + ':'">
            <span>{{ form.laneNo }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.deviceID') + ':'">
            <span>{{ form.apeID }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('deviceManagement.laneDescription') + ':'" prop="desc">
        <span>{{ form.desc }}</span>
      </el-form-item>
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
        
        this.form = this.$parent.detailForm

        Object.assign(this.form, {
          tollgateName: this.$parent.organizationName
        })
      })
    },
    dialogClosed() {
      this.$parent.dialogvisible_detail = false
      this.$parent.detailForm = {}
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
.laneDetailDialogAll {
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
