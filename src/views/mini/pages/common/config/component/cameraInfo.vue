<template>
  <!-- 摄像机基本信息 -->
  <div id="cameraInfo">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '270px' : '160px'"
      size="small"
      label-position="left"
      style="display: flex"
    >
      <div style="width: 50%; padding-right: 10px">
        <el-form-item :label="$t('primaryDevice.cameraName') + '：'" prop="cameraName">
          <el-input
            v-model="ruleForm.cameraName"
            :placeholder="$t('frontParameterConfiguration.inputCameraName')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.ptzType') + '：'" prop="ptzType">
          <el-select
            v-model="ruleForm.ptzType"
            :placeholder="$t('frontParameterConfiguration.selectPtzType')"
            style="width: 100%"
          >
            <el-option
              v-for="item in devTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.longitude') + '：'" prop="longitude">
          <el-input
            v-model="ruleForm.longitude"
            :placeholder="$t('frontParameterConfiguration.inputLongitude')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>
      </div>
      <div style="width: 50%; padding-left: 10px">
        <el-form-item
          :label="$t('frontParameterConfiguration.cameraId') + '：'"
          prop="cameraId"
          class="flex-content"
        >
          <el-input
            v-model="ruleForm.cameraId"
            :placeholder="$t('frontParameterConfiguration.inputCameraId')"
            clearable
            disabled
          ></el-input>
          <el-button type="primary" class="copyBtn" @click="copyValue(ruleForm.cameraId)">
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.thirdCameraId') + '：'"
          prop="thirdCameraId"
          class="flex-content"
        >
          <el-input
            v-model="ruleForm.thirdCameraId"
            :placeholder="$t('frontParameterConfiguration.inputThirdCameraId')"
            clearable
            disabled
          ></el-input>
          <el-button type="primary" class="copyBtn" @click="copyValue(ruleForm.thirdCameraId)">
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.latitude') + '：'" prop="latitude">
          <el-input
            v-model="ruleForm.latitude"
            :placeholder="$t('frontParameterConfiguration.inputLatitude')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="button">
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="sureBtn"
        @click="submitForm('ruleForm', 0)"
      >
        {{ $t('public.confirm') }}
      </el-button>
      <el-button class="cancelBtn" @click="cancelDialog">{{ $t('public.cancel') }}</el-button>
      <el-button
        v-if="PermissionManage"
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
import Clipboard from 'vue-clipboard3'
import { permissions } from '@/utils/common/permissions'
import devDict from '@/mixin/dev-dict.js'
import { mapState } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  mixins: [devDict],
  data() {
    var reg =
      /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
    var reg1 = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
    var validateLongitude = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (value == 0) {
        callback(new Error(this.$t('public.longitudeError')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('public.longitudeError1')))
        }
        callback()
      }
    }
    var validateLatitude = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (value == 0) {
        callback(new Error(this.$t('public.latitudeError')))
      } else {
        if (!reg1.test(value)) {
          callback(new Error(this.$t('public.latitudeError1')))
        }
        callback()
      }
    }
    return {
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),

      ruleForm: {
        mainDevId: '', //主设备id
        cameraName: '', //摄像机名称
        ptzType: '', //设备云台类型
        longitude: '', //安装经度
        latitude: '', //安装纬度
        cameraId: '', //摄像机编码
        thirdCameraId: '' //监控平台摄像机编码
      },

      rules: {
        cameraName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputCameraName'),
            trigger: 'blur'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        ptzType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectPtzType'),
            trigger: 'blur'
          }
        ],
        longitude: [
          {
            required: false,
            validator: validateLongitude,
            trigger: 'blur'
          }
        ],
        latitude: [
          {
            required: false,
            validator: validateLatitude,
            trigger: 'blur'
          }
        ],
        cameraId: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputCameraId'),
            trigger: 'blur'
          }
        ],
        thirdCameraId: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputThirdCameraId'),
            trigger: 'blur'
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
    this.PermissionManage = await permissions(166)
    this.viewCameraInfo()
  },

  methods: {
    //摄像机基础信息查看
    viewCameraInfo() {
      this.$api.cameraBasicInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.cameraName = res.cameraName
          this.ruleForm.ptzType = res.ptzType + ''
          this.ruleForm.longitude = res.longitude || ''
          this.ruleForm.latitude = res.latitude || ''
          this.ruleForm.thirdCameraId = res.thirdCameraId
          this.ruleForm.mainDevId = res.mainDevId
          this.ruleForm.cameraId = this.$route.query.cameraId
        }
      })
    },

    //摄像机基础信息设置
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            cameraId: this.$route.query.cameraId,
            cameraName: this.ruleForm.cameraName,
            ptzType: this.ruleForm.ptzType,
            longitude: Number(this.ruleForm.longitude),
            latitude: Number(this.ruleForm.latitude),
            mainDevId: this.ruleForm.mainDevId
          }
          this.$api.cameraBasicConfig(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewCameraInfo()
              }
            }
          })
        } else {
          return false
        }
      })
    },

    //复制
    async copyValue(info) {
      const { toClipboard } = Clipboard()
      try {
        await toClipboard(info)
        this.$message({
          type: 'success',
          message: this.$t('frontParameterConfiguration.copySucc')
        })
      } catch (e) {}
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
