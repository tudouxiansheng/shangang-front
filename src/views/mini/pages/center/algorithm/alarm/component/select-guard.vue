<template>
  <div class="select-guard">
    <el-input
      ref="selectGuardRef"
      readonly
      :disabled="disabled"
      :placeholder="placeholder"
      v-model="guardName"
      @focus="handleDialogOpen"
    >
      <template #suffix>
        <svg-icon icon-class="add-input" class-name="el-input__icon" />
      </template>
    </el-input>

    <el-dialog
      v-model="visible"
      width="1200px"
      top="10vh"
      :title="$t('algoGuard.chooseTask')"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
      class="select-guard-dialog"
    >
      <div class="dialog-content">
        <el-form
          :inline="true"
          class="demo-form-inline"
          label-width="100px"
          ref="form"
          :model="queryParams"
          label-position="left"
          style="float: right"
          @submit.native.prevent
        >
          <el-form-item prop="adminLName">
            <el-input
              v-model="queryParams.guardName"
              auto-complete="off"
              :placeholder="$t('algoGuard.inputSearchGuard')"
              class="inputMiddle"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
          </el-form-item>
        </el-form>
        <div
          :style="{ height: tableHeight + 36 + 'px' }"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <!-- 表格 -->
          <div class="dev_table">
            <el-table
              :max-height="tableHeight"
              v-if="!loading && tableData.length"
              :row-class-name="tableRowClassName"
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              border
              highlight-current-row
            >
              <el-table-column width="50" type="selection" />
              <el-table-column
                :label="$t('algoGuard.guardName')"
                prop="guardName"
                min-width="90"
                show-overflow-tooltip
              />

              <el-table-column
                :label="$t('algoGuard.guardType')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ setGuardType(row.guardType) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('algoGuard.threshold')"
                prop="threshold"
                min-width="90"
                show-overflow-tooltip
              />

              <el-table-column
                :label="$t('algoGuard.alarmName')"
                prop="alarmName"
                min-width="90"
                show-overflow-tooltip
              />

              <el-table-column :label="$t('public.state')" min-width="90">
                <template #default="{ row }">
                  <span :class="row.enabled == 1 ? 'success' : 'danger'">
                    {{ setEnabled(row.enabled) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('public.createTime')"
                prop="createTime"
                min-width="120"
                show-overflow-tooltip
              />

              <el-table-column
                :label="$t('public.updateTime')"
                prop="updateTime"
                min-width="120"
                show-overflow-tooltip
              />
            </el-table>
          </div>

          <pagination
            v-if="!loading && tableData.length > 0"
            :total="total"
            v-model:pageNum="queryParams.pageInfo.pageNum"
            v-model:limit="queryParams.pageInfo.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
      <template #footer>
        <div>
          <el-button @click="handleDialogClose">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="handleDataSave">{{ $t('public.submit') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onSelectChange: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      selected: [],
      loading: false,
      visible: false,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        guardName: undefined
      },
      tableHeight: 400,
      tableData: [],
      total: 0,
      ids: []
    }
  },
  computed: {
    guardName() {
      if (this.ids.length) {
        return `${this.$t('algoGuard.choosedTaskNum')}：${this.ids.length}`
      } else {
        return ''
      }
    },
    guardTypeList() {
      return [
        {
          name: this.$t('algoGuard.manListGuard'),
          value: 1
        },
        {
          name: this.$t('algoGuard.carListGuard'),
          value: 2
        },
        {
          name: this.$t('algoGuard.customGuard'),
          value: 3
        }
      ]
    }
  },
  watch: {
    selected(val) {
      this.ids = this.selected.length ? this.selected : []
      if (this.tableData.length) {
        this.setChecked(this.ids.length ? this.ids : [])
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 获取布控任务列表 */
    getList() {
      this.loading = true
      let formData = JSON.parse(JSON.stringify(this.queryParams))
      this.$api.queryNewGuardList(formData).then(res => {
        if (res.guardList && res.guardList.length) {
          this.tableData = res.guardList
          this.total = res.pageInfo.totalNum
          this.tableData.forEach(item => {
            if (this.ids.includes(item.guardId)) {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              })
            }
          })
        } else {
          this.tableData = []
          this.totalNum = 0
        }
        this.loading = false
      })
    },
    setChecked(ids) {
      this.tableData.forEach(item => {
        if (ids.includes(item.guardId)) {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          })
        } else {
          this.$refs.multipleTable.toggleRowSelection(item, false)
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        guardName: undefined
      }
      this.$resetForm('queryForm')
      this.handleQuery()
    },
    setGuardType(val) {
      if (val) {
        this.guardTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setEnabled(val) {
      if (val == 0) {
        val = this.$t('public.deactivate')
      } else if (val == 1) {
        val = this.$t('public.enable')
      } else {
        val = ''
      }
      return val
    },
    /** 表格多选框选中数据 */
    handleSelectionChange(selection) {
      if (this.onSelectChange && !this.onSelectChange(selection)) {
        this.selected = []
      } else {
        this.selected = selection.map(item => item.guardId)
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    handleDialogOpen() {
      this.ids = this.selected.length ? this.selected : []
      this.toggleDialog(true)
      this.$refs.selectGuardRef.blur()
    },
    handleDialogClose() {
      this.ids = this.selected.length ? this.selected : []
      this.toggleDialog(false)
    },
    toggleDialog(visible) {
      this.visible = visible
      if (!visible) {
        this.$emit('dialogClose')
      } else {
        this.$emit('dialogOpen')
      }
    },
    handleDataSave() {
      this.$emit('change', this.ids)
      this.toggleDialog(false)
    },
    handleClear() {
      this.$emit('change', [])
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        if (this.tableData.length) {
          this.setChecked(this.ids.length ? this.ids : [])
        }
      })
    },
    dialogClosed() {}
  }
}
</script>

<style lang="scss">
.select-guard {
  .el-dialog__wrapper.select-guard-dialog {
    .el-dialog__body {
      padding: 0 20px 20px;
    }
  }

  .tableNOdata {
    img {
      margin: 5% 0 0;
    }
  }
}
</style>
