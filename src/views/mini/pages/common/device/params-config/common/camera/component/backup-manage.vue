<template>
  <div
    class="backupManage config-form"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
    
  >
    <div v-if="commonForm.domainCode" class="config-info">
      <el-form
        ref="commonForm"
        :model="commonForm"
        :rules="commonFormRules"
        label-position="top"
        :validate-on-rule-change="false"
        :disabled="!PermissionCameraManage"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.domainCode')" prop="domainCode">
              <el-select v-model="commonForm.domainCode">
                <el-option
                  v-for="item in domainList"
                  :key="item.domainCode"
                  :label="item.domainName"
                  :value="item.domainCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="$t('mainDevConfiguration.master')" prop="master" required>
              <el-radio-group v-model="commonForm.master">
                <el-radio :label="1" border>{{ $t('mainDevConfiguration.yes') }}</el-radio>
                <el-radio :label="0" border>{{ $t('mainDevConfiguration.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-radio-group class="mb-5" v-model="type" @change="typeChange">
        <el-radio-button v-for="item in configTypeList" :label="item.value" :key="item.value">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
      <el-form
        class="paramsForm"
        v-if="type == 2"
        ref="paramsForm"
        :model="paramsForm"
        :rules="paramsFormRules"
        label-position="top"
        :validate-on-rule-change="false"
        :disabled="!PermissionCameraManage"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="backupTTL" :error="backupTTLProp">
              <template #label>
                <span>
                  <span>{{ $t('mainDevConfiguration.backupTTLProp') }}</span>
                  <el-tooltip
                    effect="dark"
                    :content="$t('mainDevConfiguration.backupTTLProp0')"
                    placement="top-start"
                  >
                    <svg-icon icon-class="prompt" class-name="prompt" />
                  </el-tooltip>
                </span>
              </template>
              <el-input
                v-model.number="paramsForm.backupTTL"
                @focus="backupTTLProp = $t('mainDevConfiguration.domainCodeProp1')"
                @blur="backupTTLProp = ''"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.platScale')" prop="platScale">
              <el-select v-model="paramsForm.platScale">
                <el-option
                  v-for="item in platScaleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.puScale')" prop="puScale">
              <el-select v-model="paramsForm.puScale">
                <el-option
                  v-for="item in puScaleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="$t('mainDevConfiguration.bcompress')" prop="bcompress" required>
              <el-switch
                v-model="paramsForm.bcompress"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <PuBackupPlan
        ref="puBackupPlan"
        v-else-if="type == 1"
        :planInfo="planForm.planType === 1 ? planForm : puBackupForm"
        :isDisabled="!PermissionCameraManage"
      />
      <PlatBackupPlan
        ref="platBackupPlan"
        v-else-if="type == 0"
        :type="type"
        :planInfo="planForm.planType === 0 ? planForm : platBackupForm"
        :isDisabled="!PermissionCameraManage"
      />
    </div>
    <div v-if="commonForm.domainCode" class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
      <el-button v-if="PermissionCameraManage && type == 2" type="primary" @click="applyToOthers">
        {{ $t('mainDevConfiguration.applyToOthers') }}
      </el-button>
      <el-button
        type="primary"
        v-if="PermissionCameraManage && type == 0 && !planForm.noSetFlag"
        @click="applyToOthers"
      >
        {{ $t('mainDevConfiguration.applyToOthers') }}
      </el-button>
      <el-button
        type="primary"
        v-if="PermissionCameraManage && type == 1 && !planForm.noSetFlag"
        @click="applyToOthers"
      >
        {{ $t('mainDevConfiguration.applyToOthers') }}
      </el-button>
      <el-button
        v-if="PermissionCameraManage && type == 0 && !planForm.noSetFlag"
        type="primary"
        @click="deletePlan"
      >
        {{ $t('mainDevConfiguration.deletePlan') }}
      </el-button>
      <el-button
        v-if="PermissionCameraManage && type == 1 && !planForm.noSetFlag"
        type="primary"
        @click="deletePlan"
      >
        {{ $t('mainDevConfiguration.deletePlan') }}
      </el-button>
    </div>
    <el-empty
      v-if="!commonForm.domainCode"
      :description="$t('mainDevConfiguration.noDomain')"
    ></el-empty>
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
      v-model:loading="batchSubmitLoading"
      v-model:visible="batchDialogVisible"
      :multipleSelectionMany="multipleSelectionMany"
      full-screen
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import PuBackupPlan from './pu-backup-plan.vue'
import PlatBackupPlan from './plat-backup-plan.vue'
import CameraSelector from '@components/cameraSelector'
import BatchOperate from '@/components/batchOperate'
export default {
  components: { PuBackupPlan, PlatBackupPlan, CameraSelector, BatchOperate },
  data() {
    return {
      loading: false,
      batchSubmitLoading: true,
      backupTTLProp: '',
      domainList: [],
      commonForm: {
        domainCode: undefined,
        master: 0
      },
      type: 2,
      configTypeList: [
        {
          label: this.$t('mainDevConfiguration.configTypeList2'),
          value: 2
        },
        {
          label: this.$t('mainDevConfiguration.configTypeList1'),
          value: 1
        },
        {
          label: this.$t('mainDevConfiguration.configTypeList0'),
          value: 0
        }
      ],
      platScaleList: [
        {
          label: this.$t('mainDevConfiguration.scaleList1'),
          value: 1
        },
        {
          label: this.$t('mainDevConfiguration.scaleList2'),
          value: 2
        },
        {
          label: this.$t('mainDevConfiguration.scaleList4'),
          value: 4
        },
        {
          label: this.$t('mainDevConfiguration.scaleList8'),
          value: 8
        }
      ],
      puScaleList: [
        {
          label: this.$t('mainDevConfiguration.scaleList1'),
          value: '1'
        },
        {
          label: this.$t('mainDevConfiguration.scaleList2'),
          value: '2'
        },
        {
          label: this.$t('mainDevConfiguration.scaleList4'),
          value: '4'
        },
        {
          label: this.$t('mainDevConfiguration.scaleList8'),
          value: '8'
        }
      ],
      paramsForm: {
        backupTTL: 0,
        puScale: '1',
        platScale: 1,
        bigPicTTL: 1,
        metadataTTL: 1,
        illegalPicTTL: 1,
        bcompress: undefined,
        hasMaster: undefined
      },
      planForm: {},
      puBackupForm: {
        planType: 1,
        isEnable: 0,
        backupMethod: 0,
        streamType: 0,
        backupType: 0,
        onlyIFrame: 0,
        eventBookmark: 1,
        scheduleType: 0,
        scheduleStartTime: this.dayjs().format('YYYYMMDD'),
        executePlanList: [],
        backupPlanList: [],
        noSetFlag: true
      },
      platBackupForm: {
        planType: 0,
        isEnable: 0,
        streamType: 1,
        backupMethod: 0,
        backupType: 0,
        onlyIFrame: 0,
        eventBookmark: 1,
        scheduleType: 0,
        executePlanList: [],
        scheduleStartTime: this.dayjs().format('YYYYMMDD'),
        alarmTypeList: '',
        noSetFlag: true
      },
      commonFormRules: {
        domainCode: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.domainCodeProp'),
            trigger: 'change'
          }
        ],
        master: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.masterProp'),
            trigger: 'change'
          }
        ]
      },
      paramsFormRules: {
        backupTTL: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.backupTTL2'),
            trigger: 'change'
          },
          {
            pattern: /^(0|\+?[1-9][0-9]{0,3})$/,
            message: this.$t('mainDevConfiguration.domainCodeProp1'),
            trigger: 'change'
          }
        ],
        platScale: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.platScaleProp'),
            trigger: 'change'
          }
        ],
        puScale: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.puScaleProp'),
            trigger: 'change'
          }
        ],
        bcompress: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.bcompressCodeProp'),
            trigger: 'change'
          }
        ]
      },
      dialogDeviceVisible: false,
      batchDialogVisible: false,
      operate: undefined,
      batchApi: undefined,
      batchList: [],
      multipleSelectionMany: [],
      neverConfig: false
    }
  },
  computed: {
    ...mapState({
      cameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['PermissionCameraManage'])
  },
  watch: {
    cameraId: {
      handler(val) {
        if (val) this.getBackupList()
      },
      immediate: true
    },
    'commonForm.domainCode': {
      handler(val) {
        if (val) {
          switch (this.type) {
            case 2:
              this.getBackupConfig()
              break
            default:
              this.getBackupPlan(this.type)
          }
        }
      },
      immediate: true
    },
    'paramsForm.hasMaster': {
      handler(val) {
        if (val === 0 && this.neverConfig) {
          this.commonForm.master = 1
        }
      }
    },
    neverConfig(val) {
      if (this.paramsForm.hasMaster === 0 && val) {
        this.commonForm.master = 1
      }
    }
  },
  methods: {
    async getBackupList() {
      this.loading = true
      const res = await this.$api.getBackupList({ cameraId: this.cameraId })
      if (res.resultCode == 0) {
        this.loading = false
        this.domainList = res.domainList
        this.commonForm.domainCode = res.domainList[0]?.domainCode
      }
    },
    async getBackupConfig() {
      this.loading = true
      const obj = {
        cameraId: this.cameraId,
        domainCode: this.commonForm.domainCode
      }
      const res = await this.$api.getBackupConfig(obj)
      if (res.resultCode == 0) {
        this.loading = false
        this.neverConfig = res.backupTTL == undefined
        if (res.backupTTL != undefined) {
          this.commonForm.master = res.master
          this.paramsForm = {
            backupTTL: res.backupTTL,
            platScale: res.platScale,
            puScale: res.puScale,
            bcompress: res.bcompress,
            bigPicTTL: res.bigPicTTL,
            metadataTTL: res.metadataTTL,
            illegalPicTTL: res.illegalPicTTL,
            hasMaster: res.hasMaster
          }
        } else {
          this.paramsForm.hasMaster = res.hasMaster
        }
      }
    },
    async getBackupPlan(type, flag = false) {
      this.loading = true
      const obj = {
        cameraId: this.cameraId,
        domainCode: this.commonForm.domainCode,
        planType: type
      }
      const res = await this.$api.getBackupPlan(obj)
      if (res.resultCode == 0) {
        this.loading = false
        if (flag) return res?.planInfo ? true : false
        if (type == 1 && !flag) {
          this.planForm = res?.planInfo
            ? res.planInfo
            : JSON.parse(JSON.stringify(this.puBackupForm))
        } else if (type == 0 && !flag) {
          this.planForm = res?.planInfo
            ? res.planInfo
            : JSON.parse(JSON.stringify(this.platBackupForm))
        }
      }
    },
    async submitForm() {
      let obj = {
        cameraId: this.cameraId,
        domainCode: this.commonForm.domainCode,
        master: this.commonForm.master
      }
      let res
      this.$refs.commonForm.validate(valid => {
        if (valid) {
          if (this.type == 2) {
            this.$refs.paramsForm.validate(async valid2 => {
              if (valid2) {
                obj = { ...obj, ...this.paramsForm }
                res = await this.$api.setBackupConfig(obj)
                if (res.resultCode == 0) {
                  this.getBackupConfig()
                  this.$message({
                    message: this.$t('mainDevConfiguration.setBackupConfigSuccess'),
                    type: 'success'
                  })
                }
              }
            })
          } else if (this.type == 1) {
            this.$refs.puBackupPlan.$refs.form.validate(async valid2 => {
              if (valid2) {
                const executePlanListFlag =
                  this.$refs.puBackupPlan.form?.executePlanList &&
                  this.$refs.puBackupPlan.form.executePlanList.length > 0 &&
                  this.$refs.puBackupPlan.form.executePlanList[0].timeInfoNum > 0
                const backupPlanListFlag =
                  this.$refs.puBackupPlan.form?.backupPlanList &&
                  this.$refs.puBackupPlan.form.backupPlanList.length > 0 &&
                  this.$refs.puBackupPlan.form.backupPlanList[0].timeInfoNum > 0
                const flag = await this.getBackupPlan(0, true)
                if (flag) {
                  if (executePlanListFlag && backupPlanListFlag) {
                    this.$confirm(
                      this.$t('mainDevConfiguration.setServerBackupConfigProp'),
                      this.$t('public.prompt'),
                      {
                        confirmButtonText: this.$t('public.confirm'),
                        cancelButtonText: this.$t('public.cancel'),
                        type: 'warning'
                      }
                    )
                      .then(async () => {
                        obj.planInfo = this.$refs.puBackupPlan.form
                        res = await this.$api.setBackupPlan(obj)
                        if (res.resultCode == 0) {
                          this.getBackupPlan(this.type)
                          this.$message({
                            message: this.$t('mainDevConfiguration.setPuBackupConfigSuccess'),
                            type: 'success'
                          })
                        }
                      })
                      .catch(() => {
                        this.$message({
                          type: 'info',
                          message: this.$t('mainDevConfiguration.cancelSetPuBackupConfig')
                        })
                      })
                  } else {
                    return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                  }
                } else {
                  if (executePlanListFlag && backupPlanListFlag) {
                    obj.planInfo = this.$refs.puBackupPlan.form
                    res = await this.$api.setBackupPlan(obj)
                    if (res.resultCode == 0) {
                      this.getBackupPlan(this.type)
                      this.$message({
                        message: this.$t('mainDevConfiguration.setPuBackupConfigSuccess'),
                        type: 'success'
                      })
                    }
                  } else {
                    return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                  }
                }
              }
            })
          } else if (this.type == 0) {
            this.$refs.platBackupPlan.$refs.form.validate(async valid2 => {
              if (valid2) {
                const executePlanListFlag =
                  this.$refs.platBackupPlan.form?.executePlanList &&
                  this.$refs.platBackupPlan.form.executePlanList.length > 0 &&
                  this.$refs.platBackupPlan.form.executePlanList[0].timeInfoNum > 0
                const backupPlanListFlag =
                  this.$refs.platBackupPlan.form?.backupPlanList &&
                  this.$refs.platBackupPlan.form.backupPlanList.length > 0 &&
                  this.$refs.platBackupPlan.form.backupPlanList[0].timeInfoNum > 0
                const flag = await this.getBackupPlan(1, true)
                if (flag) {
                  if (this.$refs.platBackupPlan.form.backupMethod == 0) {
                    if (executePlanListFlag && backupPlanListFlag) {
                      this.$confirm(
                        this.$t('mainDevConfiguration.setPuBackupConfigProp'),
                        this.$t('public.prompt'),
                        {
                          confirmButtonText: this.$t('public.confirm'),
                          cancelButtonText: this.$t('public.cancel'),
                          type: 'warning'
                        }
                      )
                        .then(async () => {
                          obj.planInfo = this.$refs.platBackupPlan.form
                          obj.planInfo.planType = this.type
                          res = await this.$api.setBackupPlan(obj)
                          if (res.resultCode == 0) {
                            this.getBackupPlan(this.type)
                            this.$message({
                              message: this.$t('mainDevConfiguration.setServerBackupConfigSuccess'),
                              type: 'success'
                            })
                          }
                        })
                        .catch(() => {
                          this.$message({
                            type: 'info',
                            message: this.$t('mainDevConfiguration.cancelSetServerBackupConfig')
                          })
                        })
                    } else {
                      return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                    }
                  }
                  if (this.$refs.platBackupPlan.form.backupMethod == 1) {
                    if (executePlanListFlag) {
                      this.$confirm(
                        this.$t('mainDevConfiguration.setPuBackupConfigProp'),
                        this.$t('public.prompt'),
                        {
                          confirmButtonText: this.$t('public.confirm'),
                          cancelButtonText: this.$t('public.cancel'),
                          type: 'warning'
                        }
                      )
                        .then(async () => {
                          obj.planInfo = this.$refs.platBackupPlan.form
                          obj.planInfo.planType = this.type
                          obj.planInfo.streamType = 1
                          if (obj.planInfo?.backupPlanList) delete obj.planInfo.backupPlanList
                          res = await this.$api.setBackupPlan(obj)
                          if (res.resultCode == 0) {
                            this.getBackupPlan(this.type)
                            this.$message({
                              message: this.$t('mainDevConfiguration.setServerBackupConfigSuccess'),
                              type: 'success'
                            })
                          }
                        })
                        .catch(() => {
                          this.$message({
                            type: 'info',
                            message: this.$t('mainDevConfiguration.cancelSetServerBackupConfig')
                          })
                        })
                    } else {
                      return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty1'))
                    }
                  }
                } else {
                  if (this.$refs.platBackupPlan.form.backupMethod == 0) {
                    if (executePlanListFlag && backupPlanListFlag) {
                      obj.planInfo = this.$refs.platBackupPlan.form
                      obj.planInfo.planType = this.type
                      res = await this.$api.setBackupPlan(obj)
                      if (res.resultCode == 0) {
                        this.getBackupPlan(this.type)
                        this.$message({
                          message: this.$t('mainDevConfiguration.setServerBackupConfigSuccess'),
                          type: 'success'
                        })
                      }
                    } else {
                      return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                    }
                  }
                  if (this.$refs.platBackupPlan.form.backupMethod == 1) {
                    if (executePlanListFlag) {
                      obj.planInfo = this.$refs.platBackupPlan.form
                      obj.planInfo.planType = this.type
                      obj.planInfo.streamType = 1
                      if (obj.planInfo?.backupPlanList) delete obj.planInfo.backupPlanList
                      res = await this.$api.setBackupPlan(obj)
                      if (res.resultCode == 0) {
                        this.getBackupPlan(this.type)
                        this.$message({
                          message: this.$t('mainDevConfiguration.setServerBackupConfigSuccess'),
                          type: 'success'
                        })
                      }
                    } else {
                      return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty1'))
                    }
                  }
                }
              }
            })
          }
        }
      })
    },
    applyToOthers() {
      this.dialogDeviceVisible = true
    },
    async deletePlan() {
      this.$confirm(
        this.type == 1
          ? this.$t('mainDevConfiguration.deletePuBackupConfigProp')
          : this.$t('mainDevConfiguration.deleteServerBackupConfigProp'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(async () => {
          const obj = {
            cameraId: this.cameraId,
            domainCode: this.commonForm.domainCode,
            planType: this.type
          }
          let res = await this.$api.deleteBackupPlan(obj)
          if (res.resultCode == 0) {
            this.getBackupPlan(this.type)
            if (this.type == 1) {
              this.$message({
                message: this.$t('mainDevConfiguration.deletePuBackupConfigSuccess'),
                type: 'success'
              })
              this.$refs.puBackupPlan.clearTime()
            } else {
              this.$message({
                message: this.$t('mainDevConfiguration.deleteServerBackupConfigSuccess'),
                type: 'success'
              })
              this.$refs.platBackupPlan.clearTime()
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message:
              this.type == 1
                ? this.$t('mainDevConfiguration.cancelDeletePuBackupConfig')
                : this.$t('mainDevConfiguration.cancelDeleteServerBackupConfig')
          })
        })
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
        case 2:
          this.operate = this.$t('mainDevConfiguration.setBackupConfig')
          this.batchApi = 'setBackupConfig'
          break
        case 1:
          this.operate = this.$t('mainDevConfiguration.setPuBackupPlan')
          this.batchApi = 'setBackupPlan'
          break
        case 0:
          this.operate = this.$t('mainDevConfiguration.setServerBackupPlan')
          this.batchApi = 'setBackupPlan'
          break
        default:
          break
      }
      this.$refs.commonForm.validate(valid => {
        if (valid) {
          if (this.type == 2) {
            this.$refs.paramsForm.validate(async valid2 => {
              if (valid2) {
                this.batchList.forEach(item => {
                  const obj = {
                    cameraId: item.id,
                    ...this.commonForm,
                    ...this.paramsForm
                  }
                  this.multipleSelectionMany.push(obj)
                })
                this.batchDialogVisible = true
              }
            })
          } else if (this.type == 1) {
            this.$refs.puBackupPlan.$refs.form.validate(valid2 => {
              if (valid2) {
                const executePlanListFlag =
                  this.$refs.puBackupPlan.form?.executePlanList &&
                  this.$refs.puBackupPlan.form.executePlanList.length > 0 &&
                  this.$refs.puBackupPlan.form.executePlanList[0].timeInfoNum > 0
                const backupPlanListFlag =
                  this.$refs.puBackupPlan.form?.backupPlanList &&
                  this.$refs.puBackupPlan.form.backupPlanList.length > 0 &&
                  this.$refs.puBackupPlan.form.backupPlanList[0].timeInfoNum > 0
                if (executePlanListFlag && backupPlanListFlag) {
                  this.batchList.forEach(item => {
                    const obj = {
                      cameraId: item.id,
                      domainCode: this.commonForm.domainCode,
                      planInfo: this.$refs.puBackupPlan.form
                    }
                    this.multipleSelectionMany.push(obj)
                  })
                  this.batchDialogVisible = true
                } else {
                  return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                }
              }
            })
          } else if (this.type == 0) {
            this.$refs.platBackupPlan.$refs.form.validate(valid2 => {
              if (valid2) {
                const executePlanListFlag =
                  this.$refs.platBackupPlan.form?.executePlanList &&
                  this.$refs.platBackupPlan.form.executePlanList.length > 0 &&
                  this.$refs.platBackupPlan.form.executePlanList[0].timeInfoNum > 0
                const backupPlanListFlag =
                  this.$refs.platBackupPlan.form?.backupPlanList &&
                  this.$refs.platBackupPlan.form.backupPlanList.length > 0 &&
                  this.$refs.platBackupPlan.form.backupPlanList[0].timeInfoNum > 0

                if (this.$refs.platBackupPlan.form.backupMethod == 0) {
                  if (executePlanListFlag && backupPlanListFlag) {
                    this.batchList.forEach(item => {
                      const obj = {
                        cameraId: item.id,
                        domainCode: this.commonForm.domainCode,
                        planInfo: this.$refs.platBackupPlan.form
                      }
                      this.multipleSelectionMany.push(obj)
                    })
                    this.batchDialogVisible = true
                  } else {
                    return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty2'))
                  }
                }
                if (this.$refs.platBackupPlan.form.backupMethod == 1) {
                  if (executePlanListFlag) {
                    this.batchList.forEach(item => {
                      const obj = {
                        cameraId: item.id,
                        domainCode: this.commonForm.domainCode,
                        planInfo: this.$refs.platBackupPlan.form
                      }
                      obj.planInfo.streamType = 1
                      if (obj.planInfo?.backupPlanList) delete obj.planInfo.backupPlanList
                      this.multipleSelectionMany.push(obj)
                    })
                    this.batchDialogVisible = true
                  } else {
                    return this.$message.error(this.$t('mainDevConfiguration.timeSpanEmpty1'))
                  }
                }
              }
            })
          }
        }
      })
    },
    typeChange(val) {
      val == 2 ? this.getBackupConfig() : this.getBackupPlan(this.type)
    }
  }
}
</script>
<style lang="scss">
.backupManage {
  padding-right: 10px;
  height: 100%;
  .config-info {
    height: calc(100% - 60px);
    overflow-y: auto;
    .el-form {
      height: auto !important;
      .prompt {
        margin-left: 10px;
        display: inline;
      }
    }
    .el-radio-button__inner {
      background: transparent;
      color: #fffefe;
      border: 1px solid #0b537e;
      border-right: 0;
      height: auto;
    }
    .el-radio-button:first-child {
      .el-radio-button__inner {
        border-left: 1px solid #0b537e;
      }
    }
    .el-radio-button:last-child {
      .el-radio-button__inner {
        border-right: 1px solid #0b537e;
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #0e6294;
      border-color: #0e6294;
      -webkit-box-shadow: -1px 0 0 0 #0e6294;
      box-shadow: -1px 0 0 0 #0e6294;
    }
  }
  .record-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .iconClass {
    display: inline;
    font-size: 14px;
  }
  .no-data {
    height: calc(100% - 60px);
  }
  .el-empty {
    height: 100%;
  }
}
</style>
