<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    top="10vh"
    width="1400px"
    :close-on-click-modal="false"
    :modal="false"
    class="linkage-form-dialog"
    draggable
    v-loading="submitLoading"
    @open="dialogOpen"
    @closed="dialogClosed"
  >
    <div class="flex flex-col w-full">
      <div class="w-full linkage-form-step">
        <el-steps :active="active" align-center finish-status="success">
          <el-step :title="$t('alarmLinkage.chooseAlarmDev')"></el-step>
          <el-step :title="$t('public.alarmTypePrompt')"></el-step>
          <el-step :title="$t('alarmLinkage.chooseAlarmAction')"></el-step>
          <el-step :title="$t('alarmLinkage.complete')"></el-step>
        </el-steps>
      </div>
      <div class="mt-5">
        <Step1
          v-if="initStep1"
          v-show="active === 0"
          :operation="operation"
          :dev-name="devName"
          :device-id="deviceId"
          @next="handleStepNext"
          @cancel="handleCancel"
        />
        <Step2
          v-if="initStep2"
          v-show="active === 1"
          :operation="operation"
          :policy-info="policyInfo"
          @cancel="handleCancel"
          @prev="handleStepPrev"
          @next="handleStepNext"
        />
        <Step3
          v-if="initStep3"
          v-show="active === 2"
          :operation="operation"
          :alarmGroups="alarmGroups"
          :policy-info="policyInfo"
          @cancel="handleCancel"
          @prev="handleStepPrev"
          @next="handleStepNext"
        />
        <Step4
          v-if="initStep4"
          ref="step4"
          v-show="active === 3"
          :cameras="selectedCameras"
          :alarmGroups="alarmGroups"
          :actions="checkedActions"
          @cancel="handleCancel"
          @prev="handleStepPrev"
          @next="handleStepNext"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
import Step1 from './components/step1'
import Step2 from './components/step2'
import Step3 from './components/step3'
import Step4 from './components/step4'
import CryptoJS from 'crypto-js'
export default {
  name: 'LinkageForm',
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  props: {
    title: {
      type: String,
      default: i18n.t('alarmLinkage.addLinkage')
    },
    visible: {
      type: Boolean,
      default: false
    },
    policyId: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitLoading: false,
      active: 0,
      initStep1: false,
      initStep2: false,
      initStep3: false,
      initStep4: false,
      selectedCameras: [], // 第一步 选择的摄像机
      alarmTypes: [], // 第二步 选择的告警类型
      alarmGroups: [], // 第二步 选择的告警类型分组 第四步提交前展示用
      actionList: [], // 第三步 告警动作表单数据
      checkedActions: [], // 第三步 选择的告警动作
      restrainTime: 0, // 第三步 抑制时间
      devName: '', // 编辑用 设备名称
      policyInfo: {} // 编辑用 策略信息
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
    },
    operation() {
      return this.policyId ? 'edit' : 'add'
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
      })
      this.$emit('open')
      if (this.policyId) {
        this.getPolicyInfo()
      } else {
        this.initStep1 = true
      }
    },
    dialogClosed() {
      this.active = 0
      this.initStep1 = false
      this.initStep2 = false
      this.initStep3 = false
      this.initStep4 = false
      this.selectedCameras = []
      this.devName = ''
      this.alarmTypes = []
      this.alarmGroups = []
      this.actionList = []
      this.checkedActions = []
      this.restrainTime = 0
      this.$emit('closed')
    },
    handleCancel() {
      this.dialogVisible = false
    },
    handleStepPrev() {
      this.active--
    },
    handleStepNext(info) {
      const { step, data } = info
      if (step < 4) {
        this.active++
        this[`initStep${step + 1}`] = true
      }
      switch (step) {
        case 1:
          this.selectedCameras = data
          break
        case 2:
          this.alarmTypes = data.alarmTypes
          this.alarmGroups = data.alarmGroups
          break
        case 3:
          this.actionList = data.actionList
          this.restrainTime = data.restrainTime
          this.checkedActions = data.checkedActions
          break
        case 4:
          this.handleSubmit()
          break
        default:
          break
      }
    },
    async getPolicyInfo() {
      const res = await this.$api.getLinkagePolicyInfo({
        policyId: this.policyId,
        deviceId: this.deviceId
      })
      if (res.resultCode === 0) {
        this.initStep1 = true
        this.devName = res.devName
        this.policyInfo = res.policyInfo
      }
    },
    async handleSubmit() {
      this.submitLoading = true
      try {
        for (let i = 0; i < this.selectedCameras.length; i++) {
          const camera = this.selectedCameras[i].payload
          const actionList = this.$loadash.cloneDeep(this.actionList)
          actionList.forEach(item => {
            const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(item.actionParam))
            item.actionParam = CryptoJS.enc.Base64.stringify(wordArray)
          })
          let res
          if (!this.policyId) {
            res = await this.$api.addLinkagePolicyInfo({
              deviceId: camera.deviceId,
              alarmTypes: this.alarmTypes,
              restrainTime: this.restrainTime,
              actionList: actionList
            })
          } else {
            res = await this.$api.modifyLinkagePolicyInfo({
              policyId: this.policyId,
              deviceId: camera.deviceId,
              alarmTypes: this.alarmTypes,
              restrainTime: this.restrainTime,
              actionList: actionList
            })
          }

          if (res.resultCode === 0) {
            if (i === this.selectedCameras.length - 1) {
              this.$message({
                type: 'success',
                message: this.policyId
                  ? this.$t('public.modifySuccess')
                  : this.$t('public.addSuccess')
              })
              this.$emit('success', this.selectedCameras[0].payload.deviceId)
              this.dialogVisible = false
            }
          }
        }
      } finally {
        this.submitLoading = false
        this.$refs.step4.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
