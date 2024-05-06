<template>
  <!-- 配置白名单 -->
  <div class="white-list">
    <el-dialog
      :title="$t('whiteList.whiteListTitle')"
      v-model="whiteListVisible"
      top="10vh"
      width="1000px"
      :close-on-click-modal="false"
      :before-close="whiteListClosed"
      @open="whiteListOpen"
      :modal="false"
      draggable
    >
      <div class="switch">
        <span>{{ $t('whiteList.whiteListTitle') }}</span>
        <span>{{ $t('whiteList.switchRemark') }}：</span>
        <el-switch
          v-model="isEnable"
          active-color="#0085d0"
          :active-value="1"
          inactive-color="#dee2e6"
          :inactive-value="0"
          @change="switchEnbale"
        />

        <span class="tip">
          <el-icon><el-icon-warning-outline /></el-icon>
          {{ $t('whiteList.tip') }}
        </span>
      </div>

      <el-form
        v-show="isEnable"
        ref="dataForm"
        :model="dataForm"
        :label-width="$parent.locale == 'en' ? '170px' : '100px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="whiteList_Data.labelName + '：'" prop="name" required>
              <el-input v-model="dataForm.name" auto-complete="off" disabled />
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('public.account') + '：'" prop="account" required>
              <el-input v-model="dataForm.account" auto-complete="off" disabled />
            </el-form-item>
          </div>
        </div>
        <div class="form-flex" v-for="(item, index) in dataForm.configureList" :key="index">
          <div class="form-left">
            <el-form-item
              :label="$t('whiteList.ip') + (index + 1) + '：'"
              :prop="`configureList[${index}].ip`"
              :rules="configureList.ip"
            >
              <el-input
                v-model="item.ip"
                auto-complete="off"
                :placeholder="$t('whiteList.inputIp')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('whiteList.mac') + (index + 1) + '：'"
              :prop="`configureList[${index}].mac`"
              :rules="configureList.mac"
            >
              <el-input
                v-model="item.mac"
                @input="
                  e => {
                    handleChange(index, e)
                  }
                "
                auto-complete="off"
                :placeholder="$t('whiteList.inputMAC')"
                clearable
              />
            </el-form-item>
          </div>
        </div>

        <el-form-item :label="$t('whiteList.remark') + '：'" prop="remark" class="padding40">
          <el-input
            type="textarea"
            v-model="dataForm.remark"
            auto-complete="off"
            :placeholder="$t('public.addressPrompt')"
            maxlength="256"
            clearable
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="whiteListClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="maskloading" @click="submitForm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconWarningOutline
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    whiteList_Data: {
      type: Object
    }
  },
  data() {
    var ipReg =
      /^\s*(((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?)|(^(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$)\s*$/
    var macReg = /^[a-fA-F0-9]{2}([:][a-fA-F0-9]{2}){5}$/
    var validateIp = (rule, value, callback) => {
      if (value !== '') {
        if (!ipReg.test(value)) {
          callback(new Error(this.$t('whiteList.inputTureIp')))
        } else {
          const ips = []
          this.dataForm.configureList.forEach(item => {
            if (item.ip) ips.push(item.ip)
          })
          const ipSet = new Set(ips)
          if (ipSet.size != ips.length) {
            callback(new Error(this.$t('whiteList.inputSomeIp')))
          }
          callback()
        }
      }
      callback()
    }
    var validateMac = (rule, value, callback) => {
      if (value !== '') {
        if (!macReg.test(value)) {
          callback(new Error(this.$t('whiteList.inputTureMAC')))
        } else {
          const macs = []
          this.dataForm.configureList.forEach(item => {
            if (item.mac) macs.push(item.mac)
          })
          const macSet = new Set(macs)
          if (macSet.size != macs.length) {
            callback(new Error(this.$t('whiteList.inputSomeMAC')))
          }
        }
      }
      callback()
    }
    return {
      clickVonfirm: false,
      oldIsEnable: 0,
      isEnable: 0,
      dataForm: {
        name: '',
        account: '',
        configureList: [
          {
            ip: '',
            mac: ''
          },
          {
            ip: '',
            mac: ''
          },
          {
            ip: '',
            mac: ''
          },
          {
            ip: '',
            mac: ''
          }
        ],
        remark: ''
      },

      configureList: {
        ip: {
          validator: validateIp,
          trigger: ['change', 'blur']
        },
        mac: {
          validator: validateMac,
          trigger: ['change', 'blur']
        }
      },

      maskloading: false
    }
  },
  computed: {
    whiteListVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 打开白名单窗口
    whiteListOpen() {
      if (this.$refs.dataForm) {
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
         this.getwhiteForm('open')
        this.clickVonfirm =false
      })
    },
    // 关闭白名单窗口
    whiteListClosed() {
      this.whiteListVisible = false
       if (!this.clickVonfirm) {
        this.isEnableSwitch(this.oldIsEnable)
      }else{
        this.clickVonfirm = false
      }
    },
    // 监听复制的mac地址
    handleChange(i, e) {
      const reg = /^[a-fA-F0-9]{2}([-][a-fA-F0-9]{2}){5}$/
      if (reg.test(e)) {
        const re = new RegExp('-', 'g')
        this.dataForm.configureList[i].mac = e.replace(re, ':')
      }
    },
    async getwhiteForm(val) {
      const { userType, contentId, name, account } = this.whiteList_Data
      let data = {
        userType,
        contentId
      }
      const res = await this.$api.getWhiteIpList(data)
      if (res.resultCode == 0) {
        const { enable, configureList, remark } = res
        this.isEnable = enable ? 1 : 0
        if(val=='open'){
         this.oldIsEnable = enable ? 1 : 0
        }
        this.dataForm = Object.assign(this.dataForm, {
          name,
          account,
          configureList,
          remark
        })
      }
    },
    // 白名单开启关闭
    async switchEnbale(val) {
      let isEnable = 0
      if (val) isEnable = 1
      const { userType, contentId } = this.whiteList_Data
      let data = {
        userType,
        contentId,
        isEnable
      }
      const res = await this.$api.whiteIpEnbale(data)
      if (res.resultCode == 0) {
        this.isEnable = isEnable
        if (this.isEnable) this.getwhiteForm()
      }
    },
    // 添加提交
    submitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.maskloading = true
          const { userType, contentId } = this.whiteList_Data
          const { configureList, remark } = this.dataForm
          let conList = []
          configureList.forEach(item => {
            if (item.ip || item.mac) {
              conList.push(item)
            }
          })
          if (this.isEnable) {
            if (conList.length == 0) {
              this.$message.warning(this.$t('whiteList.inputipMAC'))
              this.maskloading = false
              return
            }
            let data = {
              userType,
              contentId,
              remark
            }
            if (conList.length > 0) {
              data.configureList = conList
            }
            this.$api.configureWhiteIpList(data).then(res => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('whiteList.addSuccess'))
                this.whiteListVisible = false
                this.clickVonfirm = true
              }
              this.maskloading = false
            })
          } else {
            this.$message.success(this.$t('whiteList.addSuccess'))
            this.clickVonfirm = true
            this.whiteListVisible = false
            this.clickVonfirm = true
            this.maskloading = false
          }
        }
      })
    },
    isEnableSwitch(val) {
      const { userType, contentId } = this.whiteList_Data
      let data1 = {
        userType,
        contentId,
        isEnable: val
      }
      this.$api.whiteIpEnbale(data1).then(res => {
        if (res.resultCode == 0) {
        }
      })
    }
  }
}
</script>

<style lang="scss">
.white-list {
  .el-dialog__body {
    padding: 15px 0px 5px;
    .switch {
      padding: 0 0 20px 40px;
      .tip {
        margin-left: 30px;
        color: #3085cb;
        word-break: break-word;
      }
    }
  }
}
</style>
