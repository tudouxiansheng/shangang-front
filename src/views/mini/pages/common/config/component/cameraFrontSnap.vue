<template>
  <!-- 前端抓拍参数设置 -->
  <div id="cameraFrontSnap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '200px' : '120px'"
      size="small"
      label-position="left"
      style="display: flex; justify-content: center"
    >
      <div style="width: 50%">
        <el-form-item
          :label="$t('frontParameterConfiguration.snapCount') + '：'"
          prop="uiSnapCount"
        >
          <el-input
            v-model="ruleForm.uiSnapCount"
            :placeholder="$t('frontParameterConfiguration.inputSnapCount')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.snapInterval') + '：'"
          prop="uiSnapInterval"
        >
          <el-input
            v-model="ruleForm.uiSnapInterval"
            :placeholder="$t('frontParameterConfiguration.inputSnapInterval')"
            clearable
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
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      //密码显示隐藏
      pwdType: 'password',
      ruleForm: {
        uiSnapCount: '', //单次抓拍次数
        uiSnapInterval: '' //抓拍时间间隔
      },

      rules: {
        uiSnapCount: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSnapCount'),
            trigger: 'change'
          },
          {
            pattern: /^[1-5]$/,
            message: this.$t('frontParameterConfiguration.singleSnapFormat')
          }
        ],
        uiSnapInterval: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSnapInterval'),
            trigger: 'change'
          },
          {
            pattern: /^[1-5]$/,
            message: this.$t('frontParameterConfiguration.snapIntervalFormat')
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    //用户权限判断
    this.PermissionManage = await permissions(192)
    this.viewFrontSnapInfo()
  },

  methods: {
    //前端抓拍参数设置
    viewFrontSnapInfo() {
      this.$api.cameraSnapInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.uiSnapCount = res.snapCount
          this.ruleForm.uiSnapInterval = res.snapInterval
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //抓拍参数设置
          let cameraSnapConfigObj = {
            cameraId: this.$route.query.cameraId,
            snapCount: this.ruleForm.uiSnapCount,
            snapInterval: this.ruleForm.uiSnapInterval
          }
          this.$api.cameraSnapConfig(cameraSnapConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewFrontSnapInfo()
              }
            }
          })
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
