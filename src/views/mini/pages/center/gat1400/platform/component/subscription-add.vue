<template>
  <el-dialog
    :title="
      $parent.$parent.choosedType == 2
        ? $t('platformManagement.addSubscription')
        : $t('platformManagement.manualOrdering')
    "
    v-model="$parent.dialogVisible_add"
    top="10vh"
    :width="locale == 'en' ? '1500px' : '1050px'"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    :close-on-click-modal="false"
    draggable
    class="subscription-add"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      :label-width="locale == 'en' ? '250px' : '167px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.subscriptionTitle') + ':'" prop="title">
            <el-input
              v-model="form.title"
              :placeholder="$t('platformManagement.inputSubscriptionTitle')"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('platformManagement.platInterfaceType') + ':'"
            prop="platInterfaceType"
          >
            <el-radio-group v-model="form.platInterfaceType" @change="platInterfaceTypeChange">
              <el-radio :label="2">{{ $t('platformManagement.trialType') }}</el-radio>
              <el-radio :label="1">{{ $t('platformManagement.standardType') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="$t('platformManagement.subscriptionCategory') + ':'"
            prop="subscribeDetail"
          >
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.subscribeDetail"
              :placeholder="$t('platformManagement.selectSubscriptionCategory')"
              multiple
              collapse-tags
            >
              <el-option
                v-for="(item, index) in $parent.subscribeDetailList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('platformManagement.resultFeatureDeclare') + ':'"
            prop="resultFeatureDeclare"
          >
            <el-select
              v-model="form.resultFeatureDeclare"
              :popper-append-to-body="false"
              :placeholder="$t('platformManagement.selectResultFeatureDeclare')"
            >
              <el-option :label="$t('platformManagement.true')" :value="1" />
              <el-option :label="$t('platformManagement.false')" :value="-1" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.subscriptionTime') + ':'" prop="dateVal">
            <el-date-picker
              v-model="dateVal"
              type="datetimerange"
              :range-separator="$t('platformManagement.to')"
              :start-placeholder="$t('platformManagement.startDate')"
              :end-placeholder="$t('platformManagement.endDate')"
              @change="changeDate"
            ></el-date-picker>
          </el-form-item>

          <el-form-item
            :label="$t('platformManagement.betweenInformation') + ':'"
            prop="reportInterval"
          >
            <el-input
              v-model="form.reportInterval"
              :placeholder="$t('platformManagement.inputBetweenInformation')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.nodeGrouping') + ':'" prop="gatewayGroup">
            <el-input
              v-model="form.gatewayGroup"
              :placeholder="$t('platformManagement.inputNodeGrouping')"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('platformManagement.resourcePath') + ':'" prop="resourceUri">
            <el-input
              v-model="form.resourceUri"
              :placeholder="$t('platformManagement.inputResourcePath')"
              readonly
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.resourceClass') + ':'" prop="resourceClass">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.resourceClass"
              :placeholder="$t('platformManagement.selectResourceClass')"
            >
              <el-option
                v-for="(item, index) in $parent.subscribeResourcesList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.resultImageDeclare') + ':'"
            prop="resultImageDeclare"
          >
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.resultImageDeclare"
              :placeholder="$t('platformManagement.selectResultImageDeclare')"
              multiple
              collapse-tags
            >
              <el-option
                v-for="(item, index) in $parent.subscribeResultPicList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.informationAddress') + ':'"
            prop="receiveAddr"
          >
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.receiveAddr"
              :placeholder="$t('platformManagement.seelctInformationAddress')"
              v-if="$parent.$parent.choosedType == 2"
            >
              <el-option
                v-for="(item, index) in $parent.resourceUriList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.receiveAddr"
              :placeholder="$t('platformManagement.seelctInformationAddress')"
              v-if="$parent.$parent.choosedType == 1"
            >
              <el-option
                v-for="(item, index) in $parent.$parent.resourceHandList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('platformManagement.applicantUnit') + ':'" prop="applicantOrg">
            <el-input
              v-model="form.applicantOrg"
              :placeholder="$t('platformManagement.inputApplicantUnit')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.applicant') + ':'" prop="applicantName">
            <el-input
              v-model="form.applicantName"
              :placeholder="$t('platformManagement.inputApplicant')"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('platformManagement.subscriptionReason') + ':'" prop="reason">
        <el-input
          v-model="form.reason"
          :placeholder="$t('platformManagement.inputSubscriptionReason')"
          type="textarea"
          maxlength="256"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>

        <el-button
          type="primary"
          v-preventReClick
          @click="addMainDevSubmit"
          :loading="$parent.maskloading"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getFormatDate } from '@/utils/common/mutil'

export default {
  data() {
    return {
      dialogClose: false,
      locale: localStorage.getItem('locale'),
      organizationId: '',

      form: {
        title: '',
        resourceUri: '',
        subscribeDetail: [],
        receiveAddr: '',
        beginTime: '',
        endTime: '',
        reportInterval: '',
        applicantOrg: '',
        applicantName: '',
        reason: '',
        platInterfaceType: 2, //对接平台接口类型：1 标准1400  2 试用版1400
        resultFeatureDeclare: '', //返回结果特征值约定:  -1 不要特征值  1 需要返回特征值
        resourceClass: '', //资源类别
        resultImageDeclare: [], //返回图片约定
        gatewayGroup: ''
      },

      rules: {},

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,

      dialogDeviceVisible: false,
      userType: '2',
      token: '',

      cameraList: [],

      dateVal: ''
    }
  },
  mounted() {
    this.setFormRules()
  },

  methods: {
    // 改变开始时间
    changeDate(val) {
      if (val) {
        this.form.beginTime = getFormatDate(val[0])
        this.form.endTime = getFormatDate(val[1])
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
    },

    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }

      this.$nextTick(() => {
        
        if (this.$parent.$parent.choosedType == 1) {
          //手动订阅
          this.form.resourceUri = this.$parent.choosedInternetCode
        } else if (this.$parent.$parent.choosedType == 2) {
          this.form['resourceUri'] = this.$parent.$parent.choosedResourceUri
        }

        this.dateVal = ''
        this.form.beginTime = ''
        this.form.endTime = ''
        this.organizationId = this.$parent.organizationId
      })
    },
    dialogClosed() {
      this.$parent.dialogVisible_add = false
      this.organizationId = ''
    },

    setFormRules() {
      var regInt = /^\d+$/
      var validateDateVal = (rule, value, callback) => {
        if (this.form.beginTime == '' || this.form.endTime == '') {
          callback(new Error(this.$t('platformManagement.timesNotEmpty')))
        } else {
          callback()
        }
      }
      var validateReportInterval = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('platformManagement.intervalNotEmpty')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('platformManagement.timeInteger')))
        } else {
          callback()
        }
      }
      this.rules = {
        title: [
          {
            required: true,
            message: this.$t('platformManagement.titlesNotEmpty'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ],
        resourceUri: [
          {
            required: true,
            message: this.$t('platformManagement.pathNotEmpty'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ],
        subscribeDetail: [
          {
            required: true,
            message: this.$t('platformManagement.categoriesNotEmpty'),
            trigger: 'change'
          }
        ],
        receiveAddr: [
          {
            required: true,
            message: this.$t('platformManagement.addressNotEmpty'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ],
        dateVal: [
          {
            required: true,
            validator: validateDateVal,
            trigger: 'change'
          }
        ],
        reportInterval: [
          {
            required: true,
            validator: validateReportInterval,
            trigger: 'change'
          }
        ],
        applicantOrg: [
          {
            required: true,
            message: this.$t('platformManagement.unitsNotEmpty'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ],
        applicantName: [
          {
            required: true,
            message: this.$t('platformManagement.applicantsNotEmpty'),
            trigger: 'change'
          },
          {
            max: 64,
            message: this.$t('platformManagement.length64'),
            trigger: 'change'
          }
        ],
        resultFeatureDeclare: [
          {
            required: true,
            message: this.$t('platformManagement.resultFeatureDeclareNotEmpty'),
            trigger: 'change'
          }
        ],
        resourceClass: [
          {
            required: true,
            message: this.$t('platformManagement.resourceClassNotEmpty'),
            trigger: 'change'
          }
        ],
        resultImageDeclare: [
          {
            required: true,
            message: this.$t('platformManagement.resultImageDeclareNotEmpty'),
            trigger: 'change'
          }
        ],
        platInterfaceType: [
          {
            required: true,
            message: this.$t('platformManagement.platInterfaceTypeNotEmpty'),
            trigger: 'change'
          }
        ]
      }
    },

    changeTol(val) {
      this.form.tollgateID = val
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.addSubmit()
        }
      })
    },
    addSubmit() {
      let form = JSON.parse(JSON.stringify(this.form))
      form.resourceClass = form.resourceClass ? Number(form.resourceClass) : form.resourceClass //传参类型需要改
      form.subscribeDetail = form.subscribeDetail.join(',')
      form.resultImageDeclare = form.resultImageDeclare.join(',')
      this.$parent.maskloading = true

      let obj = {
        subscribeInfo: form
      }

      if (this.$parent.$parent.choosedType == 1) {
        obj.sendType = 1
        obj.subscribeInfo.subscribePlatId = this.$parent.$parent.choosedResourceUri
      }

      this.$api.sendSubscribe(obj).then(res => {
        if (res.resultCode == 0) {
          this.successBack(this.$t('public.addSuccess'))
        } else {
          this.$parent.maskloading = false
        }
      })
    },
    successBack(title) {
      this.$message({
        type: 'success',
        message: title
      })
      this.$parent.dialogVisible_add = false
      this.$parent.getList()
      this.$parent.maskloading = false
    },
    platInterfaceTypeChange(val) {
      if (val === 1) {
        this.rules.resultFeatureDeclare[0].required = false
        this.rules.resourceClass[0].required = false
        this.rules.resultImageDeclare[0].required = false
      } else {
        this.rules.resultFeatureDeclare[0].required = true
        this.rules.resourceClass[0].required = true
        this.rules.resultImageDeclare[0].required = true
      }
    }
  }
}
</script>

<style lang="scss">
.subscription-add {
  .el-dialog__body .form-flex {
    padding: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .newCameras {
    height: 38px;
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }
  .el-input-number--small {
    width: 253px;
  }
  .el-range-editor--small .el-range-input {
    color: #262626;
  }
  .el-range-separator,
  .el-range__icon,
  .el-range-input::placeholder {
    color: #999;
  }
}
</style>
