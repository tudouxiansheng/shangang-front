<template>
  <!-- 网络参数设置 -->
  <div id="devNetInfo">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '240px' : '170px'"
      size="small"
      label-position="left"
      style="display: flex; justify-content: center"
    >
      <div style="width: 50%">
        <el-form-item
          :label="$t('frontParameterConfiguration.drive') + '：'"
          prop="devNetworkProtocolType"
        >
          <el-input
            v-model="ruleForm.devNetworkProtocolType"
            :placeholder="$t('frontParameterConfiguration.inputDrive')"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.puIp') + '：'" prop="puIp">
          <el-input
            v-model="ruleForm.puIp"
            :placeholder="$t('frontParameterConfiguration.inputPuIp')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.puPort') + '：'" prop="puPort">
          <el-input
            v-model="ruleForm.puPort"
            :placeholder="$t('frontParameterConfiguration.inputPuPort')"
            clearable
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.gateway') + '：'" prop="gateway">
          <el-input
            v-model="ruleForm.gateway"
            :placeholder="$t('frontParameterConfiguration.inputGateway')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.netmask') + '：'" prop="netmask">
          <el-input
            v-model="ruleForm.netmask"
            :placeholder="$t('frontParameterConfiguration.inputNetmask')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="button" :class="[$route.query.cameraId ? 'clientButton' : '']">
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="sureBtn"
        @click="submitForm('ruleForm', 0)"
      >
        {{ $t('public.confirm') }}
      </el-button>
      <el-button class="cancelBtn" @click="dialogCancel">
        {{ $t('public.cancel') }}
      </el-button>
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
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  props: ['baseInfoShow'],
  data() {
    return {
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),

      ruleForm: {
        mainDevId: '',
        devNetworkProtocolType: '', //设备注册协议(网络参数配置)
        puIp: '', //设置IP地址
        puPort: '', //设备登录端口
        gateway: '', //IP网关
        netmask: '', //子网掩码
        rtspEnable: '', //是否启用rtsp
        rtspPort: '' //rtsp端口
      },

      rules: {
        devNetworkProtocolType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputDrive'),
            trigger: 'change'
          }
        ],
        puIp: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputPuIp'),
            trigger: 'change'
          }
        ],
        puPort: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputPuPort'),
            trigger: 'change'
          }
        ],
        rtspEnable: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.rtspEnable'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      frontDevId: state => state.config.frontDevId,
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    //用户权限判断
    this.PermissionManage = await permissions(164)
    this.viewMainDevNetInfo()
  },

  methods: {
    //主设备网络参数查看
    viewMainDevNetInfo() {
      if (this.$route.query.cameraId) {
        this.$api.getCameraInfoQuery({ cameraId: this.$route.query.cameraId }).then(res => {
          this.ruleForm.mainDevId = res.cameraInfo.mainDevId
          this.getFormData()
        })
      } else {
        this.ruleForm.mainDevId = this.frontDevId
        this.getFormData()
      }
    },
    getFormData() {
      let data = {
        mainDevId: this.ruleForm.mainDevId,
        cameraId: this.$route.query.cameraId
      }
      this.$api.mainDevBasicInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.devNetworkProtocolType = res.drive
        }
      })

      this.$api.mainDevNetworkInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.puIp = res.puIp
          this.ruleForm.puPort = res.puPort
          this.ruleForm.gateway = res.gateway
          this.ruleForm.netmask = res.netmask

          this.ruleForm.rtspEnable = res.rtspEnable
          this.ruleForm.rtspPort = res.rtspPort
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let mainDevNetworkConfigObj = JSON.parse(JSON.stringify(this.ruleForm))
          mainDevNetworkConfigObj.cameraId = this.$route.query.cameraId
          delete mainDevNetworkConfigObj.devNetworkProtocolType

          this.$api.mainDevNetworkConfig(mainDevNetworkConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.dialogCancel()
              } else {
                this.viewMainDevNetInfo()
              }
            }
          })
        }
      })
    },
    dialogCancel() {
      if (!this.$route.query.cameraId) {
        //web关闭谈框
        this.$store.commit('config/set_baseInfoShow', false)
      } else {
        //客户端关闭谈框
        let param = {
          url: '/AIV-MP/#/config/pu-config' + this.$route.query.cameraId
        }
        this.$webkitProc('close_dialog', JSON.stringify(param))
      }
    }
  }
}
</script>

<style lang="scss">
#devNetInfo {
  height: 100%;
}
</style>
