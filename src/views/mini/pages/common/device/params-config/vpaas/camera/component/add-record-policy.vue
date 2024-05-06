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
      ref="form"
      :model="form"
      :rules="formRules"
      :label-width="locale == 'en' ? '220px' : '120px'"
      label-position="left"
    >
      <el-form-item :label="$t('mainDevConfiguration.recordPlanId') + ':'" prop="recordPlanId">
        <el-select
          class="recordPlanId"
          v-model="form.recordPlanId"
          :placeholder="$t('public.pleaseInputRecordPolicy')"
          clearable
          @change="recordPlanIdChange"
        >
          <el-option
            v-for="(item, index) in recordPlanList"
            :key="index"
            :label="item.planName"
            :value="item.planId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="
          recordMethod === 0 &&
          form.recordPlanId &&
          $parent.isSupported &&
          platType === PLATFORM_TYPE.VPAAS
        "
        :label="$t('mainDevConfiguration.storageNodeId') + ':'"
        prop="storageNodeId"
      >
        <el-cascader
          style="width: 100%"
          v-model="form.storageNodeId"
          :placeholder="$t('mainDevConfiguration.selectStorageNodeId')"
          :options="$parent.groupList"
          :props="{
            children: 'mediaNodeList',
            expandTrigger: 'hover'
          }"
        />
      </el-form-item>
      <el-form-item
        :label="$t('mainDevConfiguration.recordStoreDays') + ':'"
        prop="recordStoreDays"
        v-if="
          (platType === PLATFORM_TYPE.ADS && form.recordPlanId) ||
          (platType === PLATFORM_TYPE.VPAAS &&
            form.recordPlanId &&
            ((recordMethod === 0 && $parent.isSupported) || recordMethod !== 0))
        "
      >
        <el-input
          class="recordPlanId"
          v-model="form.recordStoreDays"
          :placeholder="$t('public.pleaseInputrecordRemainDays')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="recordMethod === 0 && form.recordPlanId && platType === PLATFORM_TYPE.VPAAS"
        :label="$t('frontParameterConfiguration.streamType')"
        prop="planStreamType"
      >
        <el-select
          v-model="form.planStreamType"
          :placeholder="$t('frontParameterConfiguration.selectStreamType')"
        >
          <el-option
            v-for="(item, index) in streamTypeList"
            :key="index"
            :label="item.name"
            :value="parseInt(item.value)"
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
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'
import { mapState, mapGetters } from 'vuex'
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
    },
    platType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      //判断是添加还是删除
      editOrDel: true,
      form: {
        recordPlanId: undefined,
        recordStoreDays: undefined,
        storageNodeId: undefined,
        planStreamType: undefined
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
            pattern: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/,
            message: this.$t('public.recordRemainDaysError2'),
            trigger: 'change'
          }
        ],
        storageNodeId: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectStorageNodeId'),
            trigger: 'change'
          }
        ],
        planStreamType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStreamType'),
            trigger: 'change'
          }
        ]
      },
      recordPlanList: [],
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE
    }
  },
  computed: {
    ...mapState({
      streamTypeList: state => state.dict['stream-type']
    }),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    ...mapGetters('deviceConfig', ['domainCode'])
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
    recordPlanIdChange(val) {
      if (
        val &&
        this.recordMethod === 0 &&
        !this.$parent.isSupported &&
        this.platType === PLATFORM_TYPE.VPAAS
      ) {
        this.dialogVisible = false
        return this.$message(this.$t('mainDevConfiguration.unsupportedTip'))
      }
    },
    confirmHandle() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('getRecordInfo', this.form)
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
