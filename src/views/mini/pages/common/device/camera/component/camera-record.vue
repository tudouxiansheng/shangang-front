<template>
  <!-- 修改录像策略 -->
  <el-dialog
    :title="$parent.camera_record_name"
    v-model="$parent.cameraRecordVisible"
    width="600px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="locale == 'en' ? '190px' : '120px'"
      label-position="left"
    >
      <el-form-item :label="$t('public.recordPolicy') + '：'" prop="recordPolicyName">
        <el-select
          clearable
          v-model="form.recordPolicyName"
          :placeholder="$t('public.pleaseInputRecordPolicy')"
          @change="recordPolicyName_change"
        >
          <el-option
            v-for="(item, index) in $parent.recordPolicyData"
            :key="index"
            :label="item.planName"
            :value="item.planName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          (form.recordPolicyId && $parent.platType === TYPE_PLAT_VPAAS && isSupported) ||
          recordRemainDaysShow
        "
        :label="$t('mainDevConfiguration.recordStoreDays') + '：'"
        prop="recordStoreDays"
      >
        <el-input
          v-model="form.recordStoreDays"
          :placeholder="$t('public.pleaseInputrecordRemainDays')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.recordPolicyId && $parent.platType === TYPE_PLAT_VPAAS && isSupported"
        :label="$t('mainDevConfiguration.storageNodeId') + ':'"
        prop="storageNodeId"
      >
        <el-cascader
          style="width: 100%"
          v-model="form.storageNodeId"
          :placeholder="$t('mainDevConfiguration.selectStorageNodeId')"
          :options="groupList"
          :props="{
            children: 'mediaNodeList',
            expandTrigger: 'hover'
          }"
        />
      </el-form-item>
      <el-form-item
        v-if="form.recordPolicyId && $parent.platType === TYPE_PLAT_VPAAS && isSupported"
        :label="$t('frontParameterConfiguration.streamType') + '：'"
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
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      rules: {
        recordPolicyName: [
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
        ],
        planStreamType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStreamType'),
            trigger: 'change'
          }
        ]
      },
      groupList: [],
      isSupported: false,
      TYPE_PLAT_VPAAS: PLATFORM_TYPE.VPAAS,
      recordRemainDaysShow: false
    }
  },
  computed: {
    ...mapState({
      streamTypeList: state => state.dict['stream-type']
    })
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    dialogOpen() {
      this.getSysDictData(['stream-type'])
      if (this.$refs.form) {
        this.$nextTick(() => {
          
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.form = this.$parent.VideoDataForm
      })
    },
    dialogClosed() {
      this.$parent.cameraRecordVisible = false
      this.$parent.VideoDataForm = {
        recordPolicyName: null,
        recordPolicyId: null,
        recordStoreDays: undefined,
        storageNodeId: undefined
      }
      this.recordRemainDaysShow = false
    },
    async getMediaNodeList() {
      const params = {
        domainCode: this.$parent.domainCode,
        nodeAbility: 2
      }
      const res = await this.$api.getMediaNodeList(params)
      if (res.resultCode === 0) {
        if (res.groupList && res.groupList.length && res.groupList[0].mediaNodeList) {
          const groupList = res.groupList
          groupList.forEach(item1 => {
            item1.label = item1.groupId
            item1.value = item1.groupId
            item1.mediaNodeList.forEach(item2 => {
              item2.value = item2.nodeId
              item2.label = `${item2.serverIp}(${item2.taskCount}/${item2.maxTask})`
            })
          })
          this.groupList = groupList
          return true
        } else {
          this.$message(this.$t('deviceCamera.unsupportedTip'))
          return false
        }
      }
    },

    async recordPolicyName_change(val) {
      if (val == '') {
        this.form = {
          cameraId: this.form.cameraId,
          recordPolicyName: null,
          recordPolicyId: null,
          recordStoreDays: undefined,
          storageNodeId: undefined
        }
        this.recordRemainDaysShow = false
      } else if (val !== '') {
        if (this.$parent.platType === PLATFORM_TYPE.VPAAS) {
          this.isSupported = await this.getMediaNodeList()
        }
        if (this.isSupported || this.$parent.platType != PLATFORM_TYPE.VPAAS) {
          this.recordRemainDaysShow = true
          this.$parent.recordPolicyData.forEach(item => {
            if (val == item.planName) {
              this.form.recordPolicyId = item.planId
            }
          })
        } else {
          this.form.recordPolicyName = undefined
        }
      }
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.$parent.camera_record_name == this.$t('deviceCamera.CameraRecording')) {
            this.$emit('recordSubmit', this.form)
          } else {
            this.$emit('batchRecordSubmit', this.form)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 15px 40px 5px !important;
}
</style>
