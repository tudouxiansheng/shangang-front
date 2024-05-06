<template>
  <div
    class="config-form"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
    
  >
    <div style="height: calc(100% - 50px); overflow-y: auto">
      <p class="form-title">{{ $t('mainDevConfiguration.severRecordConfig') }}</p>
      <el-form
        ref="serverRecordConfigForm"
        :model="serverRecordConfigForm"
        :rules="serverRecordConfigFormRules"
        label-position="top"
        :validate-on-rule-change="false"
        :disabled="!PermissionCameraManage"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.recordMode')" prop="recordMode">
              <el-select
                v-model="serverRecordConfigForm.recordMode"
                :placeholder="$t('mainDevConfiguration.selectRecordMode')"
              >
                <el-option
                  v-for="(item, index) in recordModeList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="time">
              <slot name="label">
                <div class="label" ref="label">
                  <el-tooltip
                    style="line-height: 2"
                    effect="dark"
                    :content="$t('mainDevConfiguration.time')"
                    placement="top-start"
                    :disabled="disabled"
                  >
                    <span @mouseenter="changeDisabled($event)">
                      {{ $t('mainDevConfiguration.time') }}
                    </span>
                  </el-tooltip>
                </div>
              </slot>
              <el-input
                :placeholder="$t('mainDevConfiguration.inputTime')"
                v-model.number="serverRecordConfigForm.time"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="alarmRecordTTL">
              <slot name="label">
                <div class="label" ref="label">
                  <el-tooltip
                    style="line-height: 2"
                    effect="dark"
                    :content="$t('mainDevConfiguration.alarmRecordTTL')"
                    placement="top-start"
                    :disabled="disabled"
                  >
                    <span @mouseenter="changeDisabled($event)">
                      {{ $t('mainDevConfiguration.alarmRecordTTL') }}
                    </span>
                  </el-tooltip>
                </div>
              </slot>
              <el-input
                :placeholder="$t('mainDevConfiguration.inputAlarmRecordTTL')"
                v-model.number="serverRecordConfigForm.alarmRecordTTL"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="manualRecordTTL">
              <slot name="label">
                <div class="label" ref="label">
                  <el-tooltip
                    style="line-height: 2"
                    effect="dark"
                    :content="$t('mainDevConfiguration.manualRecordTTL')"
                    placement="top-start"
                    :disabled="disabled"
                  >
                    <span @mouseenter="changeDisabled($event)">
                      {{ $t('mainDevConfiguration.manualRecordTTL') }}
                    </span>
                  </el-tooltip>
                </div>
              </slot>
              <el-input
                :placeholder="$t('mainDevConfiguration.inputManualRecordTTL')"
                v-model.number="serverRecordConfigForm.manualRecordTTL"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.planStreamType')" prop="planStreamType">
              <el-select
                v-model="serverRecordConfigForm.planStreamType"
                :placeholder="$t('mainDevConfiguration.inputPlanStreamType')"
              >
                <el-option
                  v-for="(item, index) in streamTypeListFormattered"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="$t('mainDevConfiguration.alarmStreamType')"
              prop="alarmStreamType"
            >
              <el-select
                v-model="serverRecordConfigForm.alarmStreamType"
                :placeholder="$t('mainDevConfiguration.inputAlarmStreamType')"
              >
                <el-option
                  v-for="(item, index) in streamTypeListFormattered"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.preRecord')" prop="preRecord">
              <el-select v-model="serverRecordConfigForm.preRecord">
                <el-option
                  v-for="(item, index) in preRecordList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="serverRecordConfigForm.preRecord === 1">
            <el-form-item :label="$t('mainDevConfiguration.preRecordTime')" prop="preRecordTime">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputPreRecordTime')"
                v-model.number="serverRecordConfigForm.preRecordTime"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.compress')" prop="compress">
              <el-radio-group v-model="serverRecordConfigForm.compress">
                <el-radio :label="1" border>{{ $t('mainDevConfiguration.open') }}</el-radio>
                <el-radio :label="0" border>{{ $t('mainDevConfiguration.close') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="PermissionCameraManage">
          <el-button type="primary" @click="saveServerRecordConfig">
            {{ $t('public.save') }}
          </el-button>
          <el-button type="primary" @click="saveToOthers(1)">
            {{ $t('mainDevConfiguration.applyToOthers') }}
          </el-button>
        </el-row>
      </el-form>
      <p class="form-title">{{ $t('mainDevConfiguration.saveImagePolicy') }}</p>
      <el-form
        ref="imageSavePolicyForm"
        :model="imageSavePolicyForm"
        :rules="imageSavePolicyFormRules"
        label-position="top"
        :validate-on-rule-change="false"
        :disabled="!PermissionCameraManage"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.saveImage')" prop="saveImage" required>
              <el-radio-group v-model="imageSavePolicyForm.saveImage">
                <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
                <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="platType != 14">
            <el-form-item :label="$t('mainDevConfiguration.bigPicTTL')" prop="bigPicTTL">
              <el-select v-model="imageSavePolicyForm.bigPicTTL" filterable clearable allow-create>
                <el-option
                  v-for="(item, index) in picTTLList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.metadataTTL')" prop="metadataTTL">
              <el-select
                v-model="imageSavePolicyForm.metadataTTL"
                filterable
                clearable
                allow-create
              >
                <el-option
                  v-for="(item, index) in picTTLList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="platType != 14">
            <el-form-item :label="$t('mainDevConfiguration.illegalPicTTL')" prop="illegalPicTTL">
              <el-select
                v-model="imageSavePolicyForm.illegalPicTTL"
                filterable
                clearable
                allow-create
              >
                <el-option
                  v-for="(item, index) in picTTLList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="PermissionCameraManage">
          <el-button type="primary" @click="saveImageSavePolicy">{{ $t('public.save') }}</el-button>
          <el-button type="primary" @click="saveToOthers(2)">
            {{ $t('mainDevConfiguration.applyToOthers') }}
          </el-button>
        </el-row>
      </el-form>

      <p v-if="platType == 5 && cameraStatus == 1" class="form-title">
        {{ $t('mainDevConfiguration.puRecordConfig') }}
      </p>
      <el-form
        v-if="platType == 5 && cameraStatus == 1"
        ref="puStreamForm"
        :model="puStreamForm"
        :rules="puStreamFormRules"
        label-position="top"
        :validate-on-rule-change="false"
        :disabled="!PermissionCameraManage"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.streamType')" prop="streamType">
              <el-select
                v-model="puStreamForm.streamType"
                :placeholder="$t('mainDevConfiguration.selectedStreamType')"
              >
                <el-option
                  v-for="(item, index) in streamTypeListFormattered"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="PermissionCameraManage">
          <el-button type="primary" @click="savePuBitStream">{{ $t('public.save') }}</el-button>
          <el-button type="primary" @click="saveToOthers(3)">
            {{ $t('mainDevConfiguration.applyToOthers') }}
          </el-button>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
    </div>
    <camera-selector
      ref="cameraSelector"
      :title="$t('mainDevConfiguration.selectCameras')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      @closed="handleCameraSelectorClosed"
      :device-type="1"
      :max="2000"
    />

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="batchList"
      :what="$t('mainDevConfiguration.lens')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="id"
      whatName="name"
      v-model:visible="batchDialogVisible"
      :multipleSelectionMany="multipleSelectionMany"
      full-screen
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CameraSelector from '@components/cameraSelector'
import BatchOperate from '@/components/batchOperate'

export default {
  components: { CameraSelector, BatchOperate },
  data() {
    return {
      loading: false,
      serverRecordConfigForm: {
        preRecord: 1,
        resource: 0
      },
      serverRecordConfigFormCopy: {
        preRecord: 1,
        resource: 0
      },
      serverRecordConfigFormRules: {
        recordMode: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectRecordMode'),
            trigger: 'change'
          }
        ],
        time: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputTime'),
            trigger: 'change'
          },
          {
            pattern: /^((0)|([1-9]{1}[0-9]{0,3}))$/,
            message: this.$t('mainDevConfiguration.timeRange'),
            trigger: 'change'
          }
        ],
        alarmRecordTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputAlarmRecordTTL'),
            trigger: 'change'
          },
          {
            pattern: /^((0)|([1-9]{1}[0-9]{0,3}))$/,
            message: this.$t('mainDevConfiguration.alarmRecordTTLRange'),
            trigger: 'change'
          }
        ],
        manualRecordTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputManualRecordTTL'),
            trigger: 'change'
          },
          {
            pattern: /^((0)|([1-9]{1}[0-9]{0,3}))$/,
            message: this.$t('mainDevConfiguration.manualRecordTTLRange'),
            trigger: 'change'
          }
        ],
        planStreamType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputPlanStreamType'),
            trigger: 'change'
          }
        ],
        alarmStreamType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputAlarmStreamType'),
            trigger: 'change'
          }
        ],
        preRecordTime: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputPreRecordTime'),
            trigger: 'change'
          },
          {
            pattern: /^([1-9]|([1-2][0-9]){1}|30)$/,
            message: this.$t('mainDevConfiguration.inputPreRecordTimeProp'),
            trigger: 'change'
          }
        ]
      },
      imageSavePolicyForm: {},
      imageSavePolicyFormCopy: {},
      imageSavePolicyFormRules: {
        bigPicTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.bigPicTTLProp'),
            trigger: 'change'
          },
          {
            pattern: /^[1-9]{1}[0-9]{0,3}$/,
            message: this.$t('mainDevConfiguration.bigPicTTLProp'),
            trigger: 'change'
          }
        ],
        metadataTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.metadataTTLProp'),
            trigger: 'change'
          },
          {
            pattern: /^[1-9]{1}[0-9]{0,3}$/,
            message: this.$t('mainDevConfiguration.metadataTTLProp'),
            trigger: 'change'
          }
        ],
        illegalPicTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.illegalPicTTLProp'),
            trigger: 'change'
          },
          {
            pattern: /^[1-9]{1}[0-9]{0,3}$/,
            message: this.$t('mainDevConfiguration.illegalPicTTLProp'),
            trigger: 'change'
          }
        ]
      },
      dialogDeviceVisible: false,
      type: 1,
      batchDialogVisible: false,
      operate: undefined,
      batchApi: undefined,
      batchList: [],
      multipleSelectionMany: [],
      timeTipShow: false,
      puStreamForm: {
        streamType: undefined
      },
      puStreamFormCopy: {
        streamType: undefined
      },
      puStreamFormRules: {
        streamType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectedStreamType'),
            trigger: 'change'
          }
        ]
      },
      disabled: false
    }
  },
  computed: {
    ...mapState({
      recordModeList: state => state.dict['record_mode'],
      streamTypeList: state => state.dict['stream-type'],
      preRecordList: state => state.dict['pre_record'],
      picTTLList: state => state.dict['pic_TTL'],
      cameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['platType', 'cameraStatus', 'PermissionCameraManage']),
    streamTypeListFormattered() {
      let arr = []
      this.streamTypeList.forEach(item => {
        const obj = {
          name: item.name,
          value: parseInt(item.value)
        }
        arr.push(obj)
      })
      return arr
    }
  },
  watch: {
    cameraStatus: {
      handler() {
        this.setSettingMenus()
      }
    }
  },
  async created() {
    this.getSysDictData(['stream-type'])
    this.getCameraConfig()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    async getCameraConfig() {
      this.loading = true
      const res = await Promise.all([
        this.$api.getCameraRecordPolicyByTime({ cameraId: this.cameraId }),
        this.$api.getCameraImgPolicy({ cameraId: this.cameraId })
      ])
      if (this.cameraStatus === 1) {
        const res1 = await this.$api.getDevConfig({ deviceCode: this.cameraId, configType: 19 })
        if (res1.resultCode === 0) {
          this.puStreamForm = {
            streamType: res1.configItem?.streamType
          }
          this.puStreamFormCopy = JSON.parse(JSON.stringify(this.puStreamForm))
        }
      }
      this.loading = false
      if (res[0].resultCode === 0) {
        this.serverRecordConfigForm = res[0].recordPolicyInfo
        this.serverRecordConfigFormCopy = JSON.parse(JSON.stringify(this.serverRecordConfigForm))
      }
      if (res[1].resultCode === 0) {
        this.imageSavePolicyForm = {
          saveImage: res[1].saveImage,
          bigPicTTL: res[1].bigPicTTL,
          metadataTTL: res[1].metadataTTL,
          illegalPicTTL: res[1].illegalPicTTL,
          supportIgt: res[1].supportIgt
        }
        this.imageSavePolicyFormCopy = JSON.parse(JSON.stringify(this.imageSavePolicyForm))
      }
    },
    saveServerRecordConfig() {
      this.$refs['serverRecordConfigForm'].validate(async valid => {
        if (valid) {
          let { manualRecordTTL, alarmRecordTTL, time } = this.serverRecordConfigForm
          if (this.serverRecordConfigForm.manualRecordTTL !== 0) {
            if (
              this.serverRecordConfigForm.alarmRecordTTL === 0 ||
              !(manualRecordTTL >= alarmRecordTTL && alarmRecordTTL >= time)
            ) {
              return this.$alert(
                this.$t('mainDevConfiguration.recordWarn'),
                this.$t('mainDevConfiguration.warn'),
                {
                  confirmButtonText: this.$t('public.confirm')
                }
              )
            }
          }
          const obj = {
            cameraId: this.cameraId,
            recordPolicyInfo: this.serverRecordConfigForm
          }
          if (obj.recordPolicyInfo.preRecordTime == '')
            obj.recordPolicyInfo.preRecordTime = undefined
          const res = await this.$api.setCameraRecordPolicyByTime(obj)
          if (res.resultCode == 0) {
            this.serverRecordConfigFormCopy = JSON.parse(
              JSON.stringify(this.serverRecordConfigForm)
            )
            this.$message({
              message: this.$t('mainDevConfiguration.serverReocrdSetSuccess'),
              type: 'success'
            })
          }
        }
      })
    },
    saveImageSavePolicy() {
      this.$refs['imageSavePolicyForm'].validate(async valid => {
        if (valid) {
          const res = await this.$api.setCameraImgPolicy({
            cameraId: this.cameraId,
            ...this.imageSavePolicyForm
          })

          if (res.resultCode == 0) {
            this.imageSavePolicyFormCopy = JSON.parse(JSON.stringify(this.imageSavePolicyForm))
            this.$message({
              message: this.$t('mainDevConfiguration.imageSaveSetSuccess'),
              type: 'success'
            })
          }
        }
      })
    },
    savePuBitStream() {
      this.$refs['puStreamForm'].validate(async valid => {
        if (valid) {
          const res = await this.$api.setDevConfig({
            deviceCode: this.cameraId,
            configType: 19,
            configItem: this.puStreamForm
          })
          if (res.resultCode == 0) {
            this.puStreamFormCopy = JSON.parse(JSON.stringify(this.puStreamForm))

            this.$message({
              message: this.$t('mainDevConfiguration.puRecordConfigSuccess'),
              type: 'success'
            })
          }
        }
      })
    },
    saveToOthers(type) {
      this.type = type
      switch (type) {
        case 1:
          if (
            JSON.stringify(this.serverRecordConfigForm) ==
            JSON.stringify(this.serverRecordConfigFormCopy)
          ) {
            this.$refs['serverRecordConfigForm'].validate(valid => {
              if (valid) {
                let { manualRecordTTL, alarmRecordTTL, time } = this.serverRecordConfigForm
                if (this.serverRecordConfigForm.manualRecordTTL !== 0) {
                  if (
                    this.serverRecordConfigForm.alarmRecordTTL === 0 ||
                    !(manualRecordTTL >= alarmRecordTTL && alarmRecordTTL >= time)
                  ) {
                    return this.$alert(
                      this.$t('mainDevConfiguration.recordWarn'),
                      this.$t('mainDevConfiguration.warn'),
                      {
                        confirmButtonText: this.$t('public.confirm')
                      }
                    )
                  }
                }
                this.dialogDeviceVisible = true
              }
            })
          } else {
            this.$message({
              message: this.$t('mainDevConfiguration.saveServerReocrdConfig'),
              type: 'warning'
            })
          }

          break
        case 2:
          if (
            JSON.stringify(this.imageSavePolicyForm) == JSON.stringify(this.imageSavePolicyFormCopy)
          ) {
            this.$refs['imageSavePolicyForm'].validate(valid => {
              if (valid) this.dialogDeviceVisible = true
            })
          } else {
            this.$message({
              message: this.$t('mainDevConfiguration.saveImageReocrdConfig'),
              type: 'warning'
            })
          }

          break
        case 3:
          if (JSON.stringify(this.puStreamForm) == JSON.stringify(this.puStreamFormCopy)) {
            this.$refs['puStreamForm'].validate(valid => {
              if (valid) this.dialogDeviceVisible = true
            })
          } else {
            this.$message({
              message: this.$t('mainDevConfiguration.savePuReocrdConfig'),
              type: 'warning'
            })
          }

          break
        default:
          break
      }
    },
    getCameras(cameras) {
      this.batchList = cameras
      this.batchOperateHandle()
    },
    handleCameraSelectorClosed() {
      this.$refs['cameraSelector'].refreshTree()
    },
    batchOperateHandle() {
      this.multipleSelectionMany = []

      switch (this.type) {
        case 1:
          this.batchApi = 'setCameraRecordPolicyByTime'
          this.operate = this.$t('mainDevConfiguration.batchSetRecordSuccess')
          this.batchList.forEach(item => {
            const obj = {
              cameraId: item.id,
              recordPolicyInfo: this.serverRecordConfigForm
            }
            this.multipleSelectionMany.push(obj)
          })
          break
        case 2:
          this.batchApi = 'setCameraImgPolicy'
          this.operate = this.$t('mainDevConfiguration.batchSetImageSaveSuccess')
          this.batchList.forEach(item => {
            const obj = {
              cameraId: item.id,
              ...this.imageSavePolicyForm
            }
            this.multipleSelectionMany.push(obj)
          })
          break
        case 3:
          this.batchApi = 'setDevConfig'
          this.operate = this.$t('mainDevConfiguration.batchPuRecordConfig')
          this.batchList.forEach(item => {
            const obj = {
              deviceCode: item.id,
              configType: 19,
              configItem: this.puStreamForm
            }
            this.multipleSelectionMany.push(obj)
          })
          break
        default:
          break
      }
      this.batchDialogVisible = true
    },
    changeDisabled(e) {
      const contentWidth = e.target.offsetWidth
      const tooltipWidth = this.$refs['label'].offsetWidth
      this.disabled = contentWidth > tooltipWidth ? false : true
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-form) {
  height: auto !important;
  overflow-y: visible !important;
}
.config-form {
  overflow-y: auto !important;
}
.label {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  line-height: 32px;
  padding: 0 0 10px;
  &:before {
    content: '*';
    color: #f56c6c;
  }
}
</style>
