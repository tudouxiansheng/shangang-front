<template>
  <el-dialog
    :title="$t('videoRecord.addVideoStrategy')"
    v-model="dialogVisible"
    top="10vh"
    width="30%"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @open="dialogOpen"
  >
    <el-form
      class="record-policy-form"
      ref="form"
      :model="form"
      :rules="formRules"
      :label-width="locale == 'en' ? '220px' : '100px'"
      label-position="left"
    >
      <el-form-item :label="$t('mainDevConfiguration.recordPlanId')" prop="recordPlanId">
        <el-select
          v-model="form.recordPlanId"
          :placeholder="$t('public.pleaseInputRecordPolicy')"
          clearable
          class="recordPlanId"
        >
          <el-option
            v-for="(item, index) in recordPlanList"
            :key="index"
            :label="item.planName"
            :value="item.planId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="confirmHandle">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cameraId: {
      type: String,
      default: undefined
    },
    recordMethod: {
      type: Number,
      default: 0 //0-服务器录像  1-前端录像
    }
  },
  data() {
    return {
      form: {
        recordPlanId: undefined,
        recordStoreDays: undefined
      },
      formRules: {
        recordPlanId: [
          {
            required: true,
            message: this.$t('public.pleaseInputRecordPolicy'),
            trigger: 'change'
          }
        ],
        recordStoreDays: [
          {
            required: true,
            message: this.$t('deviceCamera.VideoDays'),
            trigger: 'change'
          },
          {
            pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
            message: this.$t('public.recordRemainDaysError'),
            trigger: 'change'
          }
        ]
      },
      recordPlanList: []
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
  methods: {
    dialogOpen() {
      this.getRecordPlanListQuery()
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    async getRecordPlanListQuery() {
      let res = await this.$api.getRecordPlanListQuery({})
      if (res.resultCode == 0) {
        this.recordPlanList = res.recordPlanList
      }
    },
    confirmHandle() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('getRecordInfo', this.form.recordPlanId)
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px 40px;
  .el-input__inner {
    background: #ffffff !important;
    border-radius: 4px;
    border: 1px solid #e6e6e6 !important;
  }
}
</style>
