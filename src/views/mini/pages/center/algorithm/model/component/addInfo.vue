<template>
  <div id="addModelDialog">
    <el-dialog
      :title="$parent.operation ? $t('algoModel.addAlgoModel') : $t('algoModel.editAlgoModel')"
      v-model="dialogFormVisible"
      top="10vh"
      width="1000px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules2"
        :validate-on-rule-change="false"
        :label-width="$parent.locale == 'en' ? '164px' : '86px'"
        size="small"
        label-position="left"
      >
        <el-form-item :label="$t('algoModel.modelName') + '：'" prop="modelName">
          <el-input
            v-model="form.modelName"
            auto-complete="off"
            :placeholder="$t('algoModel.inputModelName')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('algoModel.algoKey') + '：'" prop="algorithmKey">
          <el-input
            v-model="form.algorithmKey"
            auto-complete="off"
            :placeholder="$t('algoModel.inputAlgoMark')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('algoModel.algoType') + '：'" prop="algorithmType">
          <el-select
            clearable
            :popper-append-to-body="false"
            v-model="form.algorithmType"
            :placeholder="$t('algoModel.selectAlgoType')"
            :disabled="!$parent.operation"
            @change="changeAlgoType"
          >
            <el-option
              v-for="(item, index) in $parent.algorithmTypeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('algoModel.modelType') + '：'" prop="modelType">
          <el-select
            :popper-append-to-body="false"
            v-model="form.modelType"
            :placeholder="$t('algoModel.selectModelType')"
            :disabled="!$parent.operation"
            @change="modelTypeChange"
            @focus="focusModelType"
          >
            <el-option
              v-for="(item, index) in modelTypeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('algoModel.alarmType') + '：'"
          prop="alarmType"
          v-show="form.modelType == 2"
        >
          <el-cascader
            :options="$parent.alarmTypeList"
            :props="{ expandTrigger: 'hover' }"
            clearable
            :show-all-levels="false"
            v-model="form.alarmType"
            :popper-append-to-body="false"
            filterable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div v-show="form.modelType == 1">
        <div
          style="position: relative; min-height: 32px; display: flex; align-items: center"
          class="btnMargin"
        >
          <div>
            <span type="primary">{{ $t('algoModel.structedData1') }}</span>
          </div>
          <div class="filter-container" style="position: absolute; top: 0px; right: 0px">
            <el-button type="primary" class="miniBtn" @click="addProperty">
              {{ $t('algoModel.addProperty') }}
            </el-button>
          </div>
        </div>
        <el-table
          :max-height="$parent.tableHeight"
          ref="propertyTable"
          :data="propertyTableData"
          :row-class-name="$parent.tableRowClassName"
          class="elTable"
          border
        >
          <template #empty>
            <span style="font-size: 14px">{{ $t('public.noData') }}</span>
          </template>

          <el-table-column :label="$t('algoModel.propertyName')" min-width="90">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.mark')" min-width="90" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.key }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.dataType')" min-width="90">
            <template #default="{ row }">
              <span>{{ $parent.setDataType(row.type) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.dataDefine')" min-width="90">
            <template #default="{ row }">
              <div v-if="row.type == 'enum'">
                <el-dropdown trigger="hover">
                  <span class="el-dropdown-link">
                    {{ $parent.setDataType1(row.type) }}
                    <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(item, index) in row.specs" :key="index">
                        {{ item.value }}：{{ item.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-if="row.type == 'bool'">
                <div>{{ $t('algoModel.bool') }}：</div>
                <div>0: {{ row.specs[0].name }}</div>
                <div>1: {{ row.specs[1].name }}</div>
              </div>
              <span v-if="row.type == 'text'">
                {{ $t('algoModel.dataLengthByte') }}：{{ row.length }}
              </span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('public.operating')" min-width="120">
            <template #default="{ row, $index }">
              <span class="cell-operate" @click="handleEdit($index, row)">
                {{ $t('public.modify') }}
              </span>
              <span class="cell-operate danger" @click="handleDelete($index, row)">
                {{ $t('public.delete') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <property-add @updatePropertyTable="propertyTable_update"></property-add>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import propertyAdd from './property-add'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'property-add': propertyAdd,
    ElIconArrowDown
  },
  data() {
    return {
      form: {
        modelName: '',
        algorithmKey: '',
        algorithmType: '',
        modelType: '',
        alarmType: ''
      },
      modelTypeList: [],
      rules2: {},

      //结构化属性
      propertyDialogVisible: false,
      propertyTableData: [], //结构化属性表格数据
      propertyOperation: 1,
      propertyIndex: '',
      propertyRow: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      var testSpecial = (rule, value, callback) => {
        var pattern = new RegExp(
          "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]"
        )
        if (pattern.test(value)) {
          callback(new Error(this.$t('repo.cantContainSpecial')))
        } else {
          callback()
        }
      }
      var regPKey = /^[A-Za-z0-9_.#]{0,32}$/
       var validatePKey = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoModel.algoMarkCantEmpty')))
        } else if (!regPKey.test(value)) {
          callback(new Error(this.$t('algoModel.algoriMarkRule')))
        } else {
          callback()
        }
      }
      this.rules2 = {
        modelName: [
          {
            required: true,
            message: this.$t('algoModel.modelNameCantEmpty'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 128,
            message: this.$t('public.puPasswdError'),
            trigger: 'blur'
          },
          {
            required: true,
            validator: testSpecial,
            trigger: 'change'
          }
        ],
        algorithmKey: [
          {
            required: true,
            validator: validatePKey,
            trigger: 'change'
          }
        ],
        algorithmType: [
          {
            required: true,
            message: this.$t('algoModel.algoTypeCantEmpty'),
            trigger: 'change'
          }
        ],
        alarmType: [
          {
            required: true,
            message: this.$t('algoModel.alarmTypeCantEmpty'),
            trigger: 'change'
          }
        ],
        modelType: [
          {
            required: true,
            message: this.$t('algoModel.modelCantEmpty'),
            trigger: 'change'
          }
        ],
        description: [
          {
            required: false
          }
        ]
      }
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm || {}
        if (this.$parent.operation) {
          this.modelTypeList = []
        } else {
          if (
            this.form.algorithmType == 'FACE_RECOGNIZE' ||
            this.form.algorithmType == 'VEHICLE_RECOGNIZE'
          ) {
            this.modelTypeList = [
              {
                name: this.$t('algoModel.structedData'),
                value: 1
              }
            ]
          } else if (this.form.algorithmType == 'OTHER') {
            this.modelTypeList = [
              {
                name: this.$t('algoModel.structedData'),
                value: 1
              },
              {
                name: this.$t('algoModel.alarm'),
                value: 2
              }
            ]
          } else {
            this.modelTypeList = []
          }
        }

        this.form.modelType = this.form.modelType

        this.propertyTableData = this.$parent.tableData_property
        this.modelTypeChange(this.modelType)
      })
    },

    dialogClosed() {
      this.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.propertyTableData = []
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    },
    // 模型类型
    modelTypeChange(val) {
      if (val == 2) {
        this.rules2.alarmType[0].required = true
      } else {
        this.rules2.alarmType[0].required = false
      }
    },

    focusModelType() {
      if (!this.form.algorithmType) {
        this.$message({
          type: 'warning',
          message: this.$t('algoModel.selectAlgoTypeFirst')
        })
      }
    },

    changeAlgoType(val) {
      if (
        val == 'FACE_RECOGNIZE' ||
        val == 'VEHICLE_RECOGNIZE' ||
        val == 'BEHAVIOR_RECOGNIZE' ||
        val == 'PERSON_RECOGNIZE'
      ) {
        this.modelTypeList = [
          {
            name: this.$t('algoModel.structedData'),
            value: 1
          }
        ]
      } else if (val == 'OTHER') {
        this.modelTypeList = [
          {
            name: this.$t('algoModel.structedData'),
            value: 1
          },
          {
            name: this.$t('algoModel.alarm'),
            value: 2
          }
        ]
      } else {
        this.modelTypeList = []
      }
    },

    //添加属性
    addProperty() {
      this.propertyOperation = 1
      this.propertyDialogVisible = true
    },
    //修改属性
    handleEdit(index, row) {
      this.propertyIndex = index
      this.propertyRow = row

      this.propertyOperation = 2
      this.propertyDialogVisible = true
    },
    //删除属性
    handleDelete(index, row) {
      this.propertyTableData.splice(index, 1)
    },

    propertyTable_update(obj) {
      let obj1 = {
        name: obj.name,
        key: obj.key,
        type: obj.type,
        description: obj.description
      }
      if (obj.type == 'enum') {
        obj1.specs = obj.enumList
      } else if (obj.type == 'bool') {
        obj1.specs = obj.boolList
      } else if (obj.type == 'text') {
        obj1.length = obj.length
      }
      let arr = this.propertyTableData
      if (this.propertyOperation == 1) {
        arr.push(obj1)
      } else if (this.propertyOperation == 2) {
        arr.splice(this.propertyIndex, 1, obj1)
      }
      this.propertyTableData = arr
    },
    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let data = {
            modelName: this.form.modelName,
            modelType: this.form.modelType,
            algorithmType: this.form.algorithmType,
            algorithmKey: this.form.algorithmKey
          }
          if (this.form.modelType == 1) {
            data.properties = JSON.parse(JSON.stringify(this.propertyTableData))
            for (let i = 0; i < data.properties.length; i++) {
              if (!data.properties[i].specs || !data.properties[i].specs.length) {
                data.properties[i].specs = null
              }
            }
          } else if (this.form.modelType == 2) {
            data.alarmType = this.form.alarmType[1]
          }

          // 添加
          if (this.$parent.operation) {
            this.$api.addAlgorithmModel(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else {
            data.modelId = this.$parent.modelId
            // 编辑
            this.$api.modifyAlgorithmModel(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.dialogFormVisible = false
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
.el-form-item__error {
  position: relative;
}
</style>
