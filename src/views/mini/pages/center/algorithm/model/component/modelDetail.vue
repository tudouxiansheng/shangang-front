<template>
  <div id="modelDetailDialog">
    <el-dialog
      :title="$t('algoModel.algoModelInfo')"
      v-model="modelDetailVisible"
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
        :label-width="locale == 'en' ? '160px' : '100px'"
        label-position="left"
        class="form-style"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('algoModel.modelName') + '：'">
              <span>{{ form.modelName }}</span>
            </el-form-item>
            <el-form-item :label="$t('algoModel.algoType') + '：'">
              <span>{{ $parent.setAlgoType(form.algorithmType) }}</span>
            </el-form-item>
            <el-form-item :label="$t('algoModel.alarmType') + '：'" v-if="form.modelType == 2">
              <span>{{ $parent.setAlarmType(form.alarmType) }}</span>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('algoModel.algoKey') + '：'">
              <span>{{ form.algorithmKey }}</span>
            </el-form-item>
            <el-form-item :label="$t('algoModel.modelType') + '：'">
              <span>{{ $parent.setAlgorithmModel(form.modelType) }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div v-show="form.modelType == 1" class="padding40">
        <div style="position: relative; min-height: 32px; display: flex; align-items: center">
          <div>
            <span type="primary">{{ $t('algoModel.structedData1') }}</span>
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

          <el-table-column
            :label="$t('algoModel.propertyName')"
            min-width="90"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.mark')" min-width="90" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.key }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.dataType')" min-width="90" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ $parent.setDataType(row.type) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoModel.dataDefine')" min-width="90" show-overflow-tooltip>
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
                <div>0: {{ row.specs[0] ? row.specs[0].name : '' }}</div>
                <div>1: {{ row.specs[1] ? row.specs[1].name : '' }}</div>
              </div>
              <span v-if="row.type == 'text'">
                {{ $t('algoModel.dataLengthByte') }}：{{ row.length }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElIconArrowDown
  },
  computed: {
    modelDetailVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      propertyTableData: [],
      form: {
        modelName: '',
        algorithmKey: '',
        algorithmType: '',
        modelType: '',
        alarmType: ''
      }
    }
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
        this.form = this.$parent.dataForm
        this.propertyTableData = this.$parent.tableData_property
      })
    },

    dialogClosed() {
      this.modelDetailVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
#addModelDialog,
#modelDetailDialog {
  .el-table .el-table__inner-wrapper::after,
  .el-table .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
}
#modelDetailDialog {
  .el-dialog__body {
    padding: 15px 0px 5px;

    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-table::after {
      background-color: #d9d9d9;
    }
  }
}
</style>
