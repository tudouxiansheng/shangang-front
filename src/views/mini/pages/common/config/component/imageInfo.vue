<template>
  <!-- 图像参数设置 -->
  <div id="imageInfo">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '120px' : '100px'"
        size="small"
        label-position="left"
        style="display: flex; justify-content: center"
      >
        <div style="width: 50%">
          <el-form-item
            :label="$t('frontParameterConfiguration.brightness') + '：'"
            prop="brightness"
          >
            <el-slider
              v-model="ruleForm.brightness"
              :max="255"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-slider>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.contrast') + '：'" prop="contrast">
            <el-slider
              v-model="ruleForm.contrast"
              :max="255"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-slider>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.hue') + '：'" prop="hue">
            <el-slider
              v-model="ruleForm.hue"
              :max="255"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-slider>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.saturation') + '：'"
            prop="saturation"
          >
            <el-slider
              v-model="ruleForm.saturation"
              :max="255"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-slider>
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
      //中兴判断
      zteIfShow: true,
      //用户权限判断
      PermissionManage: true,
      ruleForm: {
        //摄像机图像参数
        brightness: 0, //亮度
        contrast: 0, //对比度
        hue: 0, //色度
        saturation: 0 //饱和度
      },

      rules: {
        brightness: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.adjustbrightness'),
            trigger: 'change'
          }
        ],
        contrast: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.adjustcontrast'),
            trigger: 'change'
          }
        ],
        hue: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.adjusthue'),
            trigger: 'change'
          }
        ],
        saturation: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.adjustsaturation'),
            trigger: 'change'
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
    //中兴判断
    if (this.frontPlatType == 9 && this.frontDrive == 'T28181') {
      this.zteIfShow = false
    } else {
      this.viewImageInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(170)
  },

  methods: {
    //圖像參數查看
    viewImageInfo() {
      this.$api.cameraDisplayInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          Object.assign(this.ruleForm, res)
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //图像参数设置
          let cameraDisplayConfigObj = {
            cameraId: this.$route.query.cameraId,
            ...this.ruleForm
          }
          this.$api.cameraDisplayConfig(cameraDisplayConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewImageInfo()
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

<style lang="scss">
#imageInfo {
  height: 100%;
  //滑块
  .el-tooltip__popper.is-dark {
    background: white !important;
  }
  .el-tooltip__popper[x-placement^='top'] {
    background: white !important;
  }
  .el-tooltip__popper {
    background: white !important;
  }
  .el-slider__button {
    background: rgba(54, 150, 229, 1);
  }
}
</style>
