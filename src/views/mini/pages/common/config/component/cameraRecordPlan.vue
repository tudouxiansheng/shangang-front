<template>
  <!-- 前端录像策略设置 -->
  <div id="cameraRecordPlan">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ $t('frontParameterConfiguration.IVSPlat') }}{{ frontDrive
      }}{{ $t('frontParameterConfiguration.driveDevNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '170px' : '100px'"
        size="small"
        label-position="left"
        style="display: flex; justify-content: center"
      >
        <div style="width: 50%">
          <el-form-item :label="$t('public.recordPolicy') + '：'" prop="recordPlanId">
            <el-select
              v-model="ruleForm.recordPlanId"
              :placeholder="$t('public.pleaseInputRecordPolicy')"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            >
              <el-option
                v-for="(item, index) in recordPolicyData"
                :key="index"
                :label="item.planName"
                :value="item.planId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('frontParameterConfiguration.videoDays') + '：'"
            prop="daysNum"
            v-if="ruleForm.recordPlanId != ''"
          >
            <el-input
              :placeholder="$t('frontParameterConfiguration.inputVideoDays')"
              v-model="ruleForm.daysNum"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="button">
        <el-button
          v-if="PermissionManage && !(frontPlatType == 5 && frontDrive == 'T28181')"
          type="primary"
          class="sureBtn"
          @click="submitForm('ruleForm', 0)"
        >
          {{ $t('public.confirm') }}
        </el-button>
        <el-button class="cancelBtn" @click="cancelDialog">
          {{ $t('public.cancel') }}
        </el-button>
        <el-button
          v-if="PermissionManage && !(frontPlatType == 5 && frontDrive == 'T28181')"
          type="primary"
          class="cancelBtn"
          @click="submitForm('ruleForm', 1)"
        >
          {{ $t('frontParameterConfiguration.apply') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      zteIfShow: true,
      PermissionManage: true,
      recordPolicyData: [],

      ruleForm: {
        recordPlanId: '', //录像策略
        daysNum: '' //天数
      }
    }
  },
  computed: {
    rules() {
      return {
        daysNum: [
          {
            required: !!this.ruleForm.recordPlanId,
            message: this.$t('frontParameterConfiguration.chooseVideoDays'),
            trigger: 'blur'
          },
          {
            pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
            message: this.$t('public.recordRemainDaysError'),
            trigger: 'blur'
          }
        ]
      }
    },
    //判断是添加还是删除
    editOrDel() {
      return !!this.ruleForm.recordPlanId
    }
  },
  computed: {
    ...mapState({
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    if (this.frontPlatType == 5 && this.frontDrive == 'T28181') {
      this.zteIfShow = false
    } else {
      this.$api.getRecordPlanListQuery({}).then(response => {
        this.recordPolicyData = response.recordPlanList
      })
      this.getPolicyInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(162)
  },
  methods: {
    getPolicyInfo() {
      this.$api
        .getCameraRecordPolicyInfo({
          cameraId: this.$route.query.cameraId,
          recordMethod: 1
        })
        .then(res => {
          if (res.resultCode == 0) {
            if (res.recordPlanId) {
              this.ruleForm.recordPlanId = res.recordPlanId
              this.ruleForm.daysNum = res.recordStoreDays
            }
          }
        })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editOrDel) {
            let data = {
              cameraId: this.$route.query.cameraId,
              recordMethod: 1,
              recordPlanId: this.ruleForm.recordPlanId
            }
            this.$api.setCameraRecordPolicyInfo(data).then(response => {
              if (response.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('frontParameterConfiguration.recordSetSucc')
                })
                if (!type) {
                  this.cancelDialog()
                } else {
                  this.getPolicyInfo()
                }
              }
            })
          } else {
            let deleteCameraRecordPolicyInfoObj = {
              cameraId: this.$route.query.cameraId,
              recordMethod: 1
            }

            this.$api.deleteCameraRecordPolicyInfo(deleteCameraRecordPolicyInfoObj).then(res => {
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('frontParameterConfiguration.recordDelSucc')
                })
                if (!type) {
                  this.cancelDialog()
                } else {
                  this.getPolicyInfo()
                }
              }
            })
          }
        }
      })
    },

    //关闭谈框
    cancelDialog() {
      let param = {
        url: '/AIV-MP/#/config/pu-config' + this.$route.query.cameraId
      }
      this.$webkitProc('close_dialog', JSON.stringify(param))
    }
  }
}
</script>
