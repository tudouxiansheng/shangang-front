<template>
  <!-- 设备修改 -->
  <div>
    <el-dialog
      :title="$t('primaryDevice.modifyMainDev')"
      v-model="$parent.modifyMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1200px' : '1050px'"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      class="modify_main_dev"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale === 'en' ? '220px' : '140px'"
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

            <el-form-item
              :label="$t('primaryDevice.mainDevId') + '：'"
              auto-complete="off"
              prop="mainDevId"
            >
              <el-input
                v-model="form.mainDevId"
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
              :label="$t('primaryDevice.drive') + '：'"
              auto-complete="off"
              prop="pleaseInputDrive"
            >
              <el-input
                :disabled="true"
                v-model="form.drive"
                :placeholder="$t('primaryDevice.pleaseInputDrive')"
              ></el-input>
            </el-form-item>

            <!-- 经度 -->
            <el-form-item :label="$t('public.longitude') + '：'" prop="longitude">
              <el-input
                ref="inputBlurLog"
                @focus="longlatFocus"
                v-model="form.longitude"
                :placeholder="$t('public.pleaseInputlongitude')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
              <el-input
                v-model="form.installLocate"
                :placeholder="$t('public.pleaseInputinstallLocate')"
                clearable
              ></el-input>
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

            <el-form-item
              :label="$t('public.thirdMainDevId') + '：'"
              auto-complete="off"
              prop="thirdMainDevId"
            >
              <el-input
                v-model="form.thirdMainDevId"
                :placeholder="$t('public.pleaseInputplatName')"
                :disabled="true"
              ></el-input>
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

            <el-form-item
              :label="$t('public.manufacturer') + '：'"
              auto-complete="off"
              prop="manufacturer"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.manufacturer"
                :placeholder="$t('public.pleaseInputmanufacturer')"
                :disabled="$parent.choosedPlatType == 90"
              >
                <el-option
                  v-for="(item, index) in $parent.manufacturerData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
              <el-input
                ref="inputBlurLat"
                @focus="longlatFocus"
                v-model="form.latitude"
                :placeholder="$t('public.pleaseInputlatitude')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('primaryDevice.accessInterconnectCode') + '：'"
              prop="accessInterconnectCode"
              v-show="form.drive == 'T28181'"
            >
              <el-input
                v-model="form.accessInterconnectCode"
                :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding40">
          <el-input
            v-model="form.remark"
            :placeholder="$t('public.pleaseInputremark')"
            clearable
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
    <long-lat-map />
  </div>
</template>

<script>
import LongLatMap from '@/components/long-lat-map'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  components: {
    LongLatMap
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,
      preForm_operator: {},
      dialogClose_operator: false,
      form: {},
      rules: {},
      longlatMapVisible: false,
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
        
        this.form = {
          ...this.$parent.modifyMainForm
        }
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
    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
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
        longitude: this.form.longitude,
        latitude: this.form.latitude,
        remark: this.form.remark
      }
      if (this.form.accessInterconnectCode !== '' && this.form.accessInterconnectCode != null) {
        data.mainDevAccessInfo = {
          accessInterconnectCode: this.form.accessInterconnectCode
        }
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
        remark: [
          {
            max: 512,
            message: this.$t('public.installLocateError'),
            trigger: 'blur'
          }
        ],
        longitude: [
          {
            pattern:
              /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.longitudeError'),
            trigger: 'change'
          }
        ],
        latitude: [
          {
            pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.latitudeError'),
            trigger: 'change'
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

<style lang="scss">
.modify_main_dev {
  max-height: 100vh;
  .el-step.is-center .el-step__line {
    width: 465px;
    left: 56%;
    top: 33px;
  }
}
</style>
