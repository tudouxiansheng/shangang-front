<template>
  <!-- 前端抓拍参数设置 -->
  <div class="snap-config config-form">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '200px' : '120px'"
      label-position="top"
      :disabled="!PermissionCameraManage"
    >
      <el-row :gutter="20">
        <el-col :span="8" v-if="platType == PLATFORM_TYPE.ADS">
          <el-form-item
            :label="$t('frontParameterConfiguration.snapCount') + '：'"
            prop="uiSnapCount"
          >
            <el-input
              v-model="ruleForm.uiSnapCount"
              :placeholder="$t('frontParameterConfiguration.inputSnapCount')"
              clearable
              :disabled="platType == 5 && drive == 'T28181'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('frontParameterConfiguration.snapInterval') + '：'"
            prop="uiSnapInterval"
          >
            <el-input
              v-model="ruleForm.uiSnapInterval"
              :placeholder="$t('frontParameterConfiguration.inputSnapInterval')"
              clearable
              :disabled="platType == 5 && drive == 'T28181'"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionCameraManage"
        type="primary"
        class="sureBtn"
        @click="submitForm('ruleForm', 0)"
      >
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
export default {
  data() {
    return {
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      //密码显示隐藏
      pwdType: 'password',
      ruleForm: {
        uiSnapCount: undefined, //单次抓拍次数
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
      },
      PLATFORM_TYPE: PLATFORM_TYPE
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'platId', 'PermissionCameraManage'])
  },
  async mounted() {
    this.viewFrontSnapInfo()
  },

  methods: {
    //前端抓拍参数设置
    viewFrontSnapInfo() {
      this.$api.cameraSnapInfo({ cameraId: this.selectedCameraId }).then(res => {
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
            cameraId: this.selectedCameraId,
            snapCount: this.ruleForm.uiSnapCount,
            snapInterval: this.ruleForm.uiSnapInterval
          }
          this.$api.cameraSnapConfig(cameraSnapConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.snap-config {
  padding-right: 10px;
  height: 100%;
  overflow-y: auto;
  .el-form-item {
    padding: 0 20px;
  }
}
</style>
