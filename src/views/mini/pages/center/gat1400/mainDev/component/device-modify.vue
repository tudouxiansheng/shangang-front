<template>
  <!-- 设备修改 -->
  <el-dialog
    :title="$t('primaryDevice.modifyMainDev')"
    v-model="$parent.modifyMainDevVisible"
    top="10vh"
    width="1060px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    class="deviceModifyDialogViewClass"
    draggable
  >
    <el-form
      v-show="active == 0"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('public.organizationName') + '：'"
            auto-complete="off"
            prop="organizationName"
          >
            <el-input
              v-model="form.organizationName"
              :placeholder="$t('public.pleaseInputorganizationName')"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('public.mainDevName') + '：'" prop="mainDevName">
            <el-input
              v-model="form.mainDevName"
              :placeholder="$t('public.pleaseInputMainDevName')"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('public.manufacturer') + '：'"
            auto-complete="off"
            prop="manufacturer"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.manufacturer"
              :placeholder="$t('public.pleaseInputmanufacturer')"
            >
              <el-option
                v-for="(item, index) in $parent.manufacturerData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 网络接入类型 -->
          <el-form-item :label="$t('primaryDevice.networkType') + '：'" prop="networkType">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.networkType"
              :placeholder="$t('primaryDevice.pleaseInputnetworkType')"
            >
              <el-option
                v-for="(item, index) in $parent.networkTypeData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 第二行 -->
        <div class="form-right">
          <el-form-item :label="$t('public.platName') + '：'" auto-complete="off" prop="platType">
            <el-select
              disabled
              :popper-append-to-body="false"
              v-model="form.platId"
              :placeholder="$t('public.pleaseInputplatName')"
            >
              <el-option
                v-for="(item, index) in $parent.platNameList"
                :key="index"
                :label="item.platName"
                :value="item.platId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
            <el-select
              disabled
              :popper-append-to-body="false"
              v-model="form.mainDevType"
              :placeholder="$t('public.pleaseInputMainDevType')"
            >
              <el-option
                v-for="(item, index) in $parent.mainDevTypeData"
                :key="index"
                :label="item.mainDevName"
                :value="item.AmainDev"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('public.applicationType') + '：'" prop="applicationType">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.applicationType"
              :placeholder="$t('public.pleaseInputApplicationType')"
            >
              <el-option
                v-for="(item, index) in $parent.applicationData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
            <el-input
              v-model="form.installLocate"
              :placeholder="$t('public.pleaseInputinstallLocate')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding40">
        <el-input
          v-model="form.remark"
          :placeholder="$t('public.pleaseInputremark')"
          clearable
          type="textarea"
          maxlength="256"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="modifyMainDevSubmit">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { validateDeviceName } from '@/utils/common/validator'

export default {
  data() {
    return {
      dialogClose: false,
      preForm_operator: {},
      dialogClose_operator: false,
      form: {},
      rules: {},
      operator_modify_form: {
        maintainType: '',
        billingNumber: '',
        maintainPersonName: ''
      },
      operator_modify_rules: {},
      active: 0
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      if (this.$refs.operator_modify_form) {
        this.$nextTick(() => {
          this.$refs.operator_modify_form.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.form = this.$parent.modifyMainForm
        //弹框取消前提示
        this.operator_modify_form = this.$parent.modifyMainOperatorForm
      })
    },
    dialogClosed() {
      this.$parent.modifyMainDevVisible = false
      this.$parent.modifyMainForm = {}
      this.$parent.modifyMainOperatorForm = {}
      this.active = 0
    },

    // 修改确认按钮事件
    modifyMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.modifySubmit()
        }
      })
    },
    modifySubmit() {
      let data = {
        mainDevId: this.form.mainDevId,
        mainDevName: this.form.mainDevName,
        organizationId: this.form.organizationId,
        organizationName: this.form.organizationName,
        drive: this.form.drive,
        installLocate: this.form.installLocate,
        mainDevType: this.form.mainDevType,
        manufacturer: this.form.manufacturer,
        interconnectCode: this.form.drive == 'T28181' ? this.form.interconnectCode : null,
        remark: this.form.remark
      }
      this.$parent.maskloading = true
      // 修改设备
      this.$api.modifyMainDevInfo(data).then(response => {
        this.successBack(response)
      })
    },
    successBack(response) {
      if (response.resultCode === 0) {
        this.$message({
          type: 'success',
          message: this.$t('public.modifySuccess')
        })
        this.dialogClosed()
        this.$parent.search_clear()
        this.$parent.getMainDevList()
      }
      this.$parent.maskloading = false
    },
    setFormRules() {
      this.rules = {
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],

        mainDevName: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],

        drive: [
          {
            required: true,
            message: this.$t('public.drivePrompt'),
            trigger: 'change'
          }
        ],

        installLocate: [
          {
            max: 512,
            message: this.$t('public.installLocateError'),
            trigger: 'blur'
          }
        ],

        platName: [
          {
            required: true,
            message: this.$t('public.platNamePrompt'),
            trigger: 'change'
          }
        ],
        mainDevType: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevType'),
            trigger: 'change'
          }
        ],
        manufacturer: [
          {
            required: true,
            message: this.$t('public.manufacturerPrompt'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 512,
            message: this.$t('public.installLocateError'),
            trigger: 'blur'
          }
        ]
      }

      this.operator_modify_rules = {
        maintainType: [
          {
            required: false,
            message: this.$t('primaryDevice.pleaseInputmaintenanceRole'),
            trigger: 'change'
          }
        ],
        billingNumber: [
          {
            max: 32,
            message: this.$t('primaryDevice.BillingNumberError'),
            trigger: 'blur'
          }
        ]
      }
    },

    maintainType_change(val) {
      this.operator_modify_form.mainDevType = val
      this.$forceUpdate()
    },
    number_input(val) {
      this.$forceUpdate()
    },
    personName_input(val) {
      this.$forceUpdate()
    }
  }
}
</script>
