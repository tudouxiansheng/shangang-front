<template>
  <!-- 云台参数设置 -->
  <div id="holderInfo">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ drive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '200px' : '145px'"
        label-position="top"
      >
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item
              :label="$t('frontParameterConfiguration.serialName') + '：'"
              prop="serialName"
            >
              <el-input
                v-model="ruleForm.serialName"
                :placeholder="$t('frontParameterConfiguration.inputSerialName')"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item
              :label="$t('frontParameterConfiguration.serialCode') + '：'"
              prop="serialCode"
              class="flex-content"
            >
              <el-input
                v-model="ruleForm.serialCode"
                :placeholder="$t('frontParameterConfiguration.inputSerialCode')"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item
              :label="$t('frontParameterConfiguration.decoderAddress') + '：'"
              prop="decoderAddress"
            >
              <el-input
                v-model="ruleForm.decoderAddress"
                :placeholder="$t('frontParameterConfiguration.inputDecoderAddress')"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
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
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <el-button
          v-if="PermissionMainDevManage && !(platType == 5 && drive == DRIVE_TYPE.T28181)"
          type="primary"
          class="sureBtn"
          @click="submitForm('ruleForm')"
        >
          {{ $t('public.confirm') }}
        </el-button>
        <el-button class="cancelBtn" @click="$parent.goBack">
          {{ $t('public.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { DRIVE_TYPE } from '@/enums/deviceEnum'
export default {
  data() {
    return {
      DRIVE_TYPE: DRIVE_TYPE,
      //中兴判断
      zteIfShow: true,
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
      mainDevId: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'PermissionMainDevManage'])
  },
  async mounted() {
    //中兴判断
    if (this.platType == 9) {
      this.zteIfShow = false
    } else {
      this.viewHolderInfo()
    }
  },

  methods: {
    //前端云台参数查看
    async viewHolderInfo() {
      await this.$api.cameraPTZInfo({ mainDevId: this.mainDevId }).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.decoderAddress = res.decoderAddress
          this.ruleForm.serialCode = res.serialCode
          this.ruleForm.posNegDirectControl = res.posNegDirectControl
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: this.$t('public.modifySuccess')
          })
        }
      })
    },

    //复制
    copy() {
      this.$message({
        type: 'success',
        message: this.$t('frontParameterConfiguration.copySucc')
      })
    }
  }
}
</script>

<style lang="scss">
#holderInfo {
  .el-form-item {
    padding: 0 20px;
  }
}
</style>
