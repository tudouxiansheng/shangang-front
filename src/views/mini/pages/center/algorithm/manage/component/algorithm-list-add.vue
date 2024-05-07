<template>
  <div>
    <el-dialog
      :title="$parent.operation ? $t('algoManage.addAlgo') : $t('algoManage.editAlgo')"
      v-model="$parent.dialogFormVisible"
      top="10vh"
      width="1000px"
      class="addAlgorithmDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="$parent.locale == 'en' ? '255px' : '150px'"
        label-position="left"
      >
        <el-form-item
          :label="$t('algoManage.algoName') + '：'"
          prop="algorithmName"
          class="long-error"
        >
          <el-input
            v-model="form.algorithmName"
            auto-complete="off"
            :placeholder="$t('algoManage.inputAlgoName')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('algoManage.algoAccess') + '：'" prop="accessId">
          <el-select
            clearable
            :popper-append-to-body="false"
            v-model="form.accessId"
            :placeholder="$t('algoManage.selectAlgoAccess')"
            :disabled="!$parent.operation"
          >
            <el-option
              v-for="(item, index) in $parent.algorithmAccessList"
              :key="index"
              :label="item.accessName"
              :value="item.accessId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('algoManage.algoModel') + '：'" prop="modelId">
          <el-select
            clearable
            :popper-append-to-body="false"
            v-model="form.modelId"
            :placeholder="$t('algoManage.selectAlgoModel')"
            :disabled="!$parent.operation"
          >
            <el-option
              v-for="(item, index) in $parent.algorithmModelList"
              :key="index"
              :label="item.modelName"
              :value="item.modelId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('algoManage.algoVersion') + '：'" prop="version">
          <el-input
            v-model="form.version"
            auto-complete="off"
            :placeholder="$t('algoManage.inputAlgoVersion')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('algoManage.manufacturer') + '：'" prop="vendor">
          <el-input
            v-model="form.vendor"
            auto-complete="off"
            :placeholder="$t('algoManage.inputManufacturer')"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-hasPermi="[36]"
          :label="$t('algoManage.maxChannel') + '：'"
          prop="maxChannel"
        >
          <el-input-number v-model="form.maxChannel" :min="1" :max="999999"></el-input-number>
          <span>&nbsp;&nbsp;{{ $t('algoManage.concurrence') }}</span>
        </el-form-item>

        <el-form-item :label="$t('algoManage.effectiveDate') + '：'" prop="dateValue">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            :range-separator="$t('public.to')"
            :start-placeholder="$t('public.startTimePrompt')"
            :end-placeholder="$t('public.endTimePrompt')"
            @change="dateChange"
          ></el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('algoManage.enableOrStop') + '：'" prop="enabled">
          <el-switch
            v-model="form.enabled"
            active-color="#67c23a"
            inactive-color="#f56c6c"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>

        <el-form-item :label="$t('algoManage.remark') + '：'" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('algoManage.inputRemark')"
            maxlength="256"
            show-word-limit
            v-model="form.remark"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('algoTemplate.selectTemplate') + '：'" prop="ruleId">
          <div style="display: flex; justify-content: space-between; width: 100%">
            <el-input
              style="width: 70%; height: 32px"
              :rows="2"
              :placeholder="$t('algoTemplate.clickRightButton')"
              show-word-limit
              v-model="form.ruleId"
              clearable
              disabled
            ></el-input>
            <el-button type="primary" @click="openTemplate">
              {{ $t('algoTemplate.choice') }}
            </el-button>
            <el-button type="primary" @click="addTemplate">
              {{ $t('algoTemplate.newTemplate') }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('algoManage.extractFeature') + '：'"
          prop="extractFeature"
          class="flex-item"
        >
          <div class="mr-2">
            <el-tooltip
              :content="$t('algoManage.extractFeatureTips')"
              placement="bottom"
              effect="light"
              popper-class="algo-manage-tooltip"
            >
              <el-icon style="color: #4488be; font-size: 16px; cursor: pointer; margin-top: 5px">
                <ElIconInfo />
              </el-icon>
            </el-tooltip>
          </div>

          <el-radio-group v-model="form.extractFeature">
            <el-radio :label="1">{{ $t('algoManage.available') }}</el-radio>
            <el-radio :label="0">
              {{ $t('algoManage.notAvailable') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <select-template></select-template>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { getFormatDate } from '@/utils/common/mutil'
import selectTemplate from './select-template'
import routeJump from '@/mixin/route-jump.js' //路由跳转
import { permissions } from '@/utils/common/permissions'
import { InfoFilled as ElIconInfo } from '@element-plus/icons-vue'
export default {
  components: {
    'select-template': selectTemplate,
    ElIconInfo
  },
  mixins: [routeJump],
  data() {
    return {
      form: {
        algorithmName: '',
        accessId: '',
        modelId: '',
        enabled: 1,
        version: '',
        maxChannel: 50,
        vendor: '',
        validDateBegin: '',
        validDateEnd: '',
        remark: '',
        ruleId: '',
        extractFeature: 1
      },

      rules: {},

      dateValue: [new Date(), new Date(2099, 11, 31)],
      selectTemplateVisible: false,
      selectRow: {}
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
      this.$nextTick(() => {
        this.setDialogCss()
        this.$parent.dataForm.ruleConfigInfo
          ? (this.selectRow = this.$parent.dataForm.ruleConfigInfo)
          : (this.selectRow = {})
        Object.assign(this.form, this.$parent.dataForm)

        if (!this.$parent.operation) {
          this.dateValue = this.$parent.dateValueFather
          this.form.ruleId = this.selectRow.name
        } else {
          this.dateValue = [new Date(), new Date(2099, 11, 31)]
          this.dateChange(this.dateValue)
        }
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.selectRow = {}
    },

    setFormRules() {
      var regName = /^[A-Za-z0-9\u4e00-\u9fa5_-]{0,128}$/
      var validateName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoManage.inputAlgoName')))
        } else if (!regName.test(value)) {
          callback(new Error(this.$t('algoManage.algoNameRule')))
        } else {
          callback()
        }
      }
      var validateDateValue = (rule, value, callback) => {
        if (!this.dateValue) {
          callback(new Error(this.$t('algoManage.selectData')))
        } else {
          callback()
        }
      }
      this.rules = {
        algorithmName: [{ required: true, validator: validateName, trigger: 'change' }],
        modelId: [
          {
            required: true,
            message: this.$t('algoManage.inputAlgoModel'),
            trigger: 'change'
          }
        ],
        accessId: [
          {
            required: true,
            message: this.$t('algoManage.inputAccess'),
            trigger: 'change'
          }
        ],
        maxChannel: [
          {
            required: true,
            message: this.$t('algoManage.maxConcurrency'),
            trigger: 'change'
          }
        ],
        enabled: [
          {
            required: true,
            message: this.$t('algoManage.enableStop'),
            trigger: 'change'
          }
        ],
        dateValue: [{ required: true, validator: validateDateValue, trigger: 'change' }],
        version: [
          {
            required: false,
            message: this.$t('algoManage.inputAlgoVersion'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('monitorManage.lessThanThirtyTwo'),
            trigger: 'change'
          }
        ],
        vendor: [
          {
            required: false,
            message: this.$t('algoManage.inputManufacturer'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'change'
          }
        ],
        ruleId: [
          { required: true, message: this.$t('algoTemplate.templateRequired'), trigger: 'change' }
        ],
        extractFeature: [
          { required: true, message: this.$t('algoManage.extractFeaturePrompt'), trigger: 'change' }
        ]
      }
    },

    dateChange(val) {
      if (val) {
        this.form.validDateBegin = getFormatDate(val[0]).substring(0, 10)
        this.form.validDateEnd = getFormatDate(val[1]).substring(0, 10)
      } else {
        this.form.validDateBegin = ''
        this.form.validDateEnd = ''
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.$parent.maskloading = true
          let form = this.form
          let data = {
            algorithmName: form.algorithmName,
            version: form.version,
            vendor: form.vendor,
            enabled: form.enabled,
            maxChannel: form.maxChannel,
            validDateBegin: form.validDateBegin,
            validDateEnd: form.validDateEnd,
            remark: form.remark,
            ruleId: this.selectRow.ruleId,
            accessId: form.accessId,
            modelId: form.modelId,
            extractFeature: form.extractFeature
          }
          const maxChannelHasPermi = await permissions(36)
          if (!maxChannelHasPermi) delete data.maxChannel

          if (this.$parent.operation) {
            // 添加
            this.$api.addNewAlgorithmInfo(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else if (!this.$parent.operation) {
            Object.assign(data, {
              algorithmId: form.algorithmId
            })
            // 编辑
            this.$api.modifyNewAlgorithmInfo(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },
    //跳转到模板界面
    addTemplate() {
      let routerPush = {
        path: '/algorithm/identification-template'
      }
      this.routeJump('/algorithm/identification-template', routerPush)
    },
    //跳转到模板选择
    openTemplate() {
      this.selectTemplateVisible = true
    },
    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.addAlgorithmDialog {
  .el-dialog__body {
    .el-date-editor {
      .el-range-input,
      .el-range-separator {
        color: #262626;
      }
    }
    .el-date-editor {
      width: 100%;
    }
    .el-button {
      height: 32px;
    }
    .el-form-item.long-error {
      margin-bottom: 28px;
    }
  }
}
</style>
