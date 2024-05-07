<template>
  <el-dialog
    :title="
      $parent.propertyOperation == 1 ? $t('algoModel.addProperty') : $t('algoModel.editProperty')
    "
    v-model="$parent.propertyDialogVisible"
    top="10vh"
    width="930px"
    class="propertyAdd"
    :close-on-click-modal="false"
    @closed="propertyDialogClosed"
    @open="propertyDialogOpen"
    draggable
  >
    <el-form
      v-if="$parent.propertyDialogVisible"
      ref="propertyForm"
      :model="propertyForm"
      :rules="propertyRules"
      :label-width="locale == 'en' ? '220px' : '130px'"
      size="small"
      label-position="left"
    >
      <el-form-item
        :label="$t('algoModel.propertyName') + '：'"
        prop="name"
        class="propertyNameItem"
      >
        <el-input
          v-model="propertyForm.name"
          auto-complete="off"
          :placeholder="$t('algoModel.inputPropertyName')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('algoModel.mark') + '：'" prop="key">
        <el-input
          v-model="propertyForm.key"
          auto-complete="off"
          :placeholder="$t('algoModel.inputMark')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('algoModel.dataType') + '：'" prop="type">
        <el-select
          :popper-append-to-body="false"
          v-model="propertyForm.type"
          :placeholder="$t('algoModel.selectDataType')"
          @change="typeChange"
        >
          <el-option
            v-for="(item, index) in propertyTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        class="enumItems"
        :label="$t('algoModel.enumItems') + '：'"
        prop="enumList"
        v-show="propertyForm.type == 'enum'"
      >
        <div>
          <span>{{ $t('algoModel.parameterValues') }}</span>
          <span style="margin-left: 29%">{{ $t('algoModel.parameterRemark') }}</span>
        </div>
        <div
          v-for="(item, index) in propertyForm.enumList"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="display: flex">
            <el-input
              v-model="item.value"
              :placeholder="$t('algoModel.inputValue')"
              style="width: 167px"
            ></el-input>
            <span style="margin: 0px 10px">~</span>
            <el-input
              v-model="item.name"
              :placeholder="$t('algoModel.inputRemark')"
              style="width: 167px"
            ></el-input>
            <span
              @click="delEnum(index)"
              class="spanCursor"
              style="color: #f56c6c; margin-left: 10px"
            >
              {{ $t('public.delete') }}
            </span>
          </div>
        </div>
        <span @click="addEnum" style="color: #10a9ff" class="spanCursor">
          +{{ $t('algoModel.addEnumItem') }}
        </span>
      </el-form-item>

      <el-form-item
        :label="$t('algoModel.bool') + '：'"
        prop="boolList"
        v-show="propertyForm.type == 'bool'"
      >
        <div style="display: flex; margin-bottom: 10px">
          <span style="display: block; width: 30px">0 -</span>
          <el-input
            v-model="propertyForm.boolList[0].name"
            :placeholder="$t('algoModel.likeClose')"
          ></el-input>
        </div>
        <div style="display: flex; margin-bottom: 10px">
          <span style="display: block; width: 30px">1 -</span>
          <el-input
            v-model="propertyForm.boolList[1].name"
            :placeholder="$t('algoModel.likeOpen')"
          ></el-input>
        </div>
      </el-form-item>

      <el-form-item
        :label="$t('algoModel.dataLengthByte') + '：'"
        prop="length"
        v-show="propertyForm.type == 'text'"
      >
        <el-input
          v-model="propertyForm.length"
          :placeholder="$t('algoModel.inputDataLength')"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('algoModel.propertyRemark') + '：'" prop="description">
        <el-input
          v-model="propertyForm.description"
          :placeholder="$t('algoModel.inputPropertyRemark')"
          maxlength="256"
          show-word-limit
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="propertyDialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitProperty">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      propertyForm: {
        name: '',
        key: '',
        type: '',
        enumList: [
          {
            name: '',
            value: ''
          }
        ], //枚举
        boolList: [
          {
            name: '',
            value: '0'
          },
          {
            name: '',
            value: '1'
          }
        ], //布尔
        length: '',
        description: ''
      },
      propertyRules: {},
      propertyTypeList: []
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.propertyTypeList = [
        {
          name: this.$t('algoModel.int'),
          value: 'int'
        },
        {
          name: this.$t('algoModel.float'),
          value: 'float'
        },
        {
          name: this.$t('algoModel.double'),
          value: 'double'
        },
        {
          name: this.$t('algoModel.text'),
          value: 'text'
        },
        {
          name: this.$t('algoModel.boolean'),
          value: 'bool'
        },
        {
          name: this.$t('algoModel.enum'),
          value: 'enum'
        }
      ]

      var regPName = /^[A-Za-z0-9\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5-_/.]{0,29}$/
      var regPKey = /^[A-Za-z0-9_.#]{0,50}$/
      var regPEnumName = /^[A-Za-z0-9\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5-_\\(\\)]{0,19}$/
      var regPDataLength = /^\d+(\.\d+)?$/
      var regInt = /^\d+$/

      var validatePName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoModel.inputPropertyName')))
        } else if (!regPName.test(value)) {
          callback(new Error(this.$t('algoModel.propertyNameRule')))
        } else {
          callback()
        }
      }
      var validatePKey = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoModel.inputMark')))
        } else if (!regPKey.test(value)) {
          callback(new Error(this.$t('algoModel.markRule')))
        } else {
          callback()
        }
      }
      var validateEnum = (rule, value, callback) => {
        if (rule.required) {
          for (let i = 0; i < this.propertyForm.enumList.length; i++) {
            if (
              this.propertyForm.enumList[i].name == '' ||
              this.propertyForm.enumList[i].value == ''
            ) {
              callback(new Error(this.$t('algoModel.inputFullEnum')))
            }
            if (!regPEnumName.test(this.propertyForm.enumList[i].name)) {
              callback(new Error(this.$t('algoModel.enumItemsRule')))
            }
            if (!regInt.test(this.propertyForm.enumList[i].value)) {
              callback(new Error(this.$t('algoModel.enumValueRule')))
            }
          }
          callback()
        }
        callback()
      }
      var validateBool = (rule, value, callback) => {
        if (rule.required) {
          if (
            this.propertyForm.boolList[0].name == '' ||
            this.propertyForm.boolList[1].name == ''
          ) {
            callback(new Error(this.$t('algoModel.inputFullBoolInfo')))
          }
          callback()
        }
        callback()
      }
      var validateDataLength = (rule, value, callback) => {
        if (rule.required) {
          if (value == '') {
            callback(new Error(this.$t('algoModel.inputDataLength')))
          } else if (!regPDataLength.test(value)) {
            callback(new Error(this.$t('algoModel.dataLengthRule')))
          } else if (!regInt.test(value)) {
            callback(new Error('algoModel.dataLengthRule1'))
          } else {
            callback()
          }
        }
        callback()
      }

      this.propertyRules = {
        name: [{ required: true, validator: validatePName, trigger: 'change' }],
        key: [{ required: true, validator: validatePKey, trigger: 'change' }],
        type: [
          {
            required: true,
            message: this.$t('algoModel.dataTypeCantEmpty'),
            trigger: 'change'
          }
        ],
        enumList: [{ required: true, validator: validateEnum, trigger: 'change' }],
        boolList: [{ required: true, validator: validateBool, trigger: 'change' }],
        length: [{ required: true, validator: validateDataLength, trigger: 'change' }],
        description: [
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ]
      }
    },
    //结构化属性弹框打开
    propertyDialogOpen() {
      if (this.$refs.propertyForm) {
        this.$nextTick(() => {
          this.$refs.propertyForm.resetFields()
        })
      }
      this.$nextTick(() => {
        if (this.$parent.propertyOperation == 2) {
          let propertyRow = this.$parent.propertyRow
          this.propertyForm.name = propertyRow.name
          this.propertyForm.key = propertyRow.key
          this.propertyForm.type = propertyRow.type
          if (propertyRow.type == 'enum') {
            this.propertyForm.enumList = propertyRow.specs
          } else if (propertyRow.type == 'bool') {
            this.propertyForm.boolList = propertyRow.specs
          } else if (propertyRow.type == 'text') {
            this.propertyForm.length = propertyRow.length
          }
          this.propertyForm.description = propertyRow.description

          this.typeChange(this.propertyForm.type)
        }
      })
    },

    propertyDialogClosed() {
      this.$parent.propertyDialogVisible = false
      Object.assign(this.$data.propertyForm, this.$options.data().propertyForm)
    },

    typeChange(val) {
      if (val == 'enum') {
        this.propertyRules.enumList[0].required = true
        this.propertyRules.boolList[0].required = false
        this.propertyRules.length[0].required = false
      } else if (val == 'bool') {
        this.propertyRules.enumList[0].required = false
        this.propertyRules.boolList[0].required = true
        this.propertyRules.length[0].required = false
      } else if (val == 'text') {
        this.propertyRules.enumList[0].required = false
        this.propertyRules.boolList[0].required = false
        this.propertyRules.length[0].required = true
      } else {
        this.propertyRules.enumList[0].required = false
        this.propertyRules.boolList[0].required = false
        this.propertyRules.length[0].required = false
      }
    },

    //提交属性信息
    submitProperty() {
      this.$refs['propertyForm'].validate(valid => {
        if (valid) {
          this.$emit('updatePropertyTable', this.propertyForm)
          this.$parent.propertyDialogVisible = false
        }
      })
    },

    //添加枚举
    addEnum() {
      this.propertyForm.enumList.push({
        name: '',
        value: ''
      })
    },

    //删除枚举
    delEnum(index) {
      this.propertyForm.enumList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.propertyAdd {
  .spanCursor {
    cursor: pointer;
  }
  .propertyNameItem .el-form-item__error {
    width: 430px;
  }
  .el-form-item__error {
    width: 430px;
  }
}
.enumItems{
  .el-form-item__content{
    display: block;
  }
}
</style>
