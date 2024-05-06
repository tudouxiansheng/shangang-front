<template>
  <!-- 串口参数设置 -->
  <div id="serialInfo">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '150px' : '100px'"
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
            :label="$t('frontParameterConfiguration.serialType') + '：'"
            prop="serialType"
          >
            <el-select
              v-model="ruleForm.serialType"
              :placeholder="$t('frontParameterConfiguration.selectSerialType')"
              disabled
            >
              <el-option label="RS232" :value="0"></el-option>
              <el-option label="RS485" :value="1"></el-option>
              <el-option label="RS422" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.flowControl') + '：'"
            prop="flowControl"
          >
            <el-select
              v-model="ruleForm.flowControl"
              :placeholder="$t('frontParameterConfiguration.selectFlowControl')"
              disabled
            >
              <el-option
                :label="$t('frontParameterConfiguration.flowControlOption0')"
                :value="0"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.flowControlOption1')"
                :value="1"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.flowControlOption2')"
                :value="2"
              ></el-option>
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.baudRate') + '：'" prop="baudRate">
            <el-select
              v-model="ruleForm.baudRate"
              :placeholder="$t('frontParameterConfiguration.selectBaudRate')"
              disabled
            >
              <el-option label="50" :value="50"></el-option>
              <el-option label="75" :value="75"></el-option>
              <el-option label="110" :value="110"></el-option>
              <el-option label="150" :value="150"></el-option>
              <el-option label="300" :value="300"></el-option>
              <el-option label="600" :value="600"></el-option>
              <el-option label="1200" :value="1200"></el-option>
              <el-option label="2400" :value="2400"></el-option>
              <el-option label="4800" :value="4800"></el-option>
              <el-option label="9600" :value="9600"></el-option>
              <el-option label="19200" :value="19200"></el-option>
              <el-option label="38400" :value="38400"></el-option>
              <el-option label="57600" :value="57600"></el-option>
              <el-option label="115200" :value="115200"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="width: 50%; padding-left: 10px">
          <el-form-item :label="$t('frontParameterConfiguration.dataBit') + '：'" prop="dataBit">
            <el-select
              v-model="ruleForm.dataBit"
              :placeholder="$t('frontParameterConfiguration.selectDataBit')"
              disabled
            >
              <el-option label="5" :value="5"></el-option>
              <el-option label="6" :value="6"></el-option>
              <el-option label="7" :value="7"></el-option>
              <el-option label="8" :value="8"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.stopBit') + '：'" prop="stopBit">
            <el-select
              v-model="ruleForm.stopBit"
              :placeholder="$t('frontParameterConfiguration.selectStopBit')"
              disabled
            >
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.parity') + '：'" prop="parity">
            <el-select
              v-model="ruleForm.parity"
              :placeholder="$t('frontParameterConfiguration.selectParity')"
              disabled
            >
              <el-option
                :label="$t('frontParameterConfiguration.parityOption0')"
                :value="0"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.parityOption1')"
                :value="1"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.parityOption2')"
                :value="2"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.parityOption3')"
                :value="3"
              ></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.parityOption4')"
                :value="4"
              ></el-option>
            </el-select>
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
import { validateDeviceName } from '@/utils/common/validator'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //中兴判断
      zteIfShow: true,
      //用户权限判断
      PermissionManage: true,

      ruleForm: {
        serialName: '', //串口名称(云台)
        serialType: '', //串口类型
        flowControl: '', //流控
        baudRate: '', //波特率
        dataBit: '', //数据位
        stopBit: '', //停止位
        parity: '' //校验位
      },

      rules: {
        serialName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSerialName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError')
          }
        ],
        serialType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectSerialType'),
            trigger: 'change'
          }
        ],
        flowControl: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectFlowControl'),
            trigger: 'change'
          }
        ],
        baudRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectBaudRate'),
            trigger: 'change'
          }
        ],
        parity: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectParity'),
            trigger: 'change'
          }
        ],
        dataBit: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectDataBit'),
            trigger: 'change'
          }
        ],
        stopBit: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStopBit'),
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
      this.viewSerialInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(188)
  },

  methods: {
    //前端串口参数查看
    viewSerialInfo() {
      this.$api.cameraBasicInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (!res.serialChannelId) {
          this.$message({
            message: this.$t('frontParameterConfiguration.getSerialFail'),
            type: 'error'
          })
        }
        if (res.resultCode == 0 && res.serialChannelId) {
          let viewSerialInfoObj = {
            cameraId: this.$route.query.cameraId,
            serialChannelId: res.serialChannelId
          }

          this.$api.cameraSerialInfo(viewSerialInfoObj).then(res1 => {
            if (res1.resultCode == 0) {
              this.ruleForm.serialName = res1.serialName
              this.ruleForm.serialType = res1.serialType
              this.ruleForm.flowControl = res1.flowControl
              this.ruleForm.baudRate = res1.baudRate
              this.ruleForm.dataBit = res1.dataBit
              this.ruleForm.stopBit = res1.stopBit
              this.ruleForm.parity = res1.parity
            }
          })
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
          if (!type) {
            this.cancelDialog()
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
