<template>
  <!-- 云台参数设置 -->
  <div id="holderInfo">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '200px' : '145px'"
        size="small"
        label-position="left"
        style="display: flex"
      >
        <div style="width: 50%; padding-right: 10px">
          <el-form-item
            :label="$t('frontParameterConfiguration.serialName') + '：'"
            prop="serialName"
          >
            <el-input
              v-model="ruleForm.serialName"
              :placeholder="$t('frontParameterConfiguration.inputSerialName')"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.decoderAddress') + '：'"
            prop="decoderAddress"
          >
            <el-input
              v-model="ruleForm.decoderAddress"
              :placeholder="$t('frontParameterConfiguration.inputDecoderAddress')"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 50%; padding-left: 10px">
          <el-form-item
            :label="$t('frontParameterConfiguration.serialCode') + '：'"
            prop="serialCode"
            class="flex-content"
          >
            <el-input
              v-model="ruleForm.serialCode"
              :placeholder="$t('frontParameterConfiguration.inputSerialCode')"
              disabled
            ></el-input>
            <el-button class="copyBtn" type="primary" @click="copyValue(ruleForm.serialCode)">
              {{ $t('frontParameterConfiguration.copy') }}
            </el-button>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.posNegDirectControl') + '：'"
            style="margin-right: 0px !important"
            prop="posNegDirectControl"
          >
            <el-radio-group v-model="ruleForm.posNegDirectControl">
              <el-radio
                v-model="ruleForm.posNegDirectControl"
                :label="1"
                text-color="#333"
                disabled
              >
                {{ $t('frontParameterConfiguration.holderOpen') }}
              </el-radio>
              <el-radio
                v-model="ruleForm.posNegDirectControl"
                :label="0"
                text-color="#333"
                disabled
              >
                {{ $t('frontParameterConfiguration.holderClose') }}
              </el-radio>
            </el-radio-group>
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
import Clipboard from 'vue-clipboard3'
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      //中兴判断
      zteIfShow: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      //密码显示隐藏
      pwdType: 'password',
      ruleForm: {
        posNegDirectControl: 0, //启动云台反向控制
        decoderAddress: '', //云台地址
        serialName: '', //串口名称(云台)
        serialCode: '' //串口编码
      },

      rules: {
        serialName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSerialName'),
            trigger: 'change'
          }
        ],
        decoderAddress: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputDecoderAddress'),
            trigger: 'change'
          },
          {
            pattern: /^[1-4]\d*$/,
            message: this.$t('frontParameterConfiguration.holderAddreFormat')
          }
        ],
        serialCode: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSerialCode'),
            trigger: 'change'
          }
        ],
        posNegDirectControl: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectPosNegDirectControl'),
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
    if (this.frontPlatType == 9) {
      this.zteIfShow = false
    } else {
      this.viewHolderInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(190)
  },

  methods: {
    //前端云台参数查看
    async viewHolderInfo() {
      await this.$api.cameraBasicInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          if (res.serialChannelId) {
            let viewSerialInfoObj = {
              cameraId: this.$route.query.cameraId,
              serialChannelId: res.serialChannelId
            }
            this.$api.cameraSerialInfo(viewSerialInfoObj).then(res1 => {
              if (res1.resultCode == 0) {
                this.ruleForm.serialName = res1.serialName
              }
            })
          }
        }
      })

      await this.$api.cameraPTZInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.decoderAddress = res.decoderAddress
          this.ruleForm.serialCode = res.serialCode
          this.ruleForm.posNegDirectControl = res.posNegDirectControl
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: this.$t('public.modifySuccess')
          })
          if (type == 0) {
            this.cancelDialog()
          }
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
