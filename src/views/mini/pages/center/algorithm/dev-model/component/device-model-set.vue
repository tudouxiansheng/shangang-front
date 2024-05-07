<template>
  <div id="device-model-set" ref="deviceModelSet">
    <el-dialog
      :title="$t('devModel.devModelMap')"
      v-model="$parent.dialogFormVisible_detail"
      top="10vh"
      :width="$parent.locale == 'en' ? '1200px' : '1000px'"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div style="position: relative; min-height: 38px" class="btnMargin">
            <div>
              <el-button type="primary" @click="handleAss" v-if="$parent.operation == 'update'">
                {{ $t('devModel.save') }}
              </el-button>
            </div>
            <!-- 查询和其他操作 -->
            <div class="filter-container" style="position: absolute; top: 0px; right: -8px">
              <el-form
                :inline="true"
                class="demo-form-inline"
                label-width="100px"
                ref="form"
                :model="searchForm"
                label-position="left"
                style="display: flex; flex-direction: row"
              >
                <el-form-item prop="adminLName">
                  <el-input
                    v-model="searchForm.modelName"
                    auto-complete="off"
                    :placeholder="$t('devModel.inputModelName')"
                    clearable
                    class="inputMiddle"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleFind" class="miniBtn">
                    {{ $t('public.search') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div
            style="max-height: 420px"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            
          >
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <!-- 表格 -->
            <el-table
              v-if="!loading && tableData.length"
              :max-height="tableHeight"
              ref="multipleTable"
              :data="tableData"
              :row-class-name="tableRowClassName"
              class="elTable table-Border-color"
              border
              @selection-change="handleSelectionChange"
              @select="handleSelect"
              @select-all="selectAll"
              :header-cell-class-name="$parent.operation == 'info' ? cellClass : ''"
            >
              <el-table-column label width="50" type="selection" :selectable="selectable" />

              <template #empty>
                <span>{{ dataText }}</span>
              </template>

              <el-table-column
                :label="$t('devModel.algoModelName')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.modelName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.algoType')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ setAlgoType(row.algorithmType) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.algoMark')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.algorithmKey }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.modelType')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ setAlgorithmModel(row.modelType) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.alarmType')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.alarmName }}</span>
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
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableDataCopy: [],
      tableHeight: 401,
      isRouterAlive: true,
      maskloading: false, // 点击提交按钮后蒙版
      // 条件搜索
      searchForm: {
        modelName: ''
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      alarmTypeList: []
    }
  },

  created() {},
  activated() {
    this.setDialogCss()
  },
  methods: {
    /** 判断是否禁用行勾选 */
    selectable(row, index) {
      if (this.$parent.operation == 'info') {
        return false
      } else {
        return true
      }
    },

    handleSelectionChange(val) {},
    handleSelect(selection, row) {
      row.associated = !row.associated
      for (let i = 0; i < this.tableDataCopy.length; i++) {
        if (row.modelId == this.tableDataCopy[i].modelId) {
          this.tableDataCopy[i].associated = !this.tableDataCopy[i].associated
        }
      }
    },

    selectAll(val) {
      let bool = Boolean(val.length)
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].associated = bool
      }
      if (this.tableDataCopy.length == this.tableData.length) {
        for (let j = 0; j < this.tableDataCopy.length; j++) {
          this.tableDataCopy[j].associated = bool
        }
      } else {
        for (let i = 0; i < this.tableDataCopy.length; i++) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (this.tableDataCopy[i].modelId == this.tableData[j].modelId) {
              this.tableDataCopy[i].associated = this.tableData[j].associated
              break
            }
          }
        }
      }
    },

    async dialogOpen() {
      this.searchForm.modelName = ''
      await this.handleFind()
      this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
    },
    dialogClosed() {
      this.$parent.dialogFormVisible_detail = false
    },
    // 获取告警类型
    async getGroups() {
      await this.$api.getGroupsQuery({}).then(res => {
        if (res.alarmGroups) {
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            let groupobj = {}
            groupobj.value = res.alarmGroups[i].groupCode
            groupobj.label =
              this.$parent.locale == 'en'
                ? res.alarmGroups[i].groupEnName
                : res.alarmGroups[i].groupName
            options.push(groupobj)
          }
          for (let i = 0; i < options.length; i++) {
            options[i].children = []
            let searchTypeObj = {
              alarmGroup: options[i].value
            }

            this.$api.getAlarmTypesQuery(searchTypeObj).then(res1 => {
              if (res1.alarmTypeList) {
                for (let j = 0; j < res1.alarmTypeList.length; j++) {
                  let childrenObj = {}
                  childrenObj.value = res1.alarmTypeList[j].alarmType
                  childrenObj.label = res1.alarmTypeList[j].alarmName
                  options[i].children.push(childrenObj)
                }
              }
            })
          }

          this.alarmTypeList = options
        } else {
          this.alarmTypeList = []
        }
      })
    },
    // 模型类型
    setAlgorithmModel(val) {
      if (val == 1) {
        return this.$t('devModel.structedData')
      } else if (val == 2) {
        return this.$t('devModel.alarm')
      } else {
        return ''
      }
    },

    // 算法类型
    setAlgoType(val) {
      if (val) {
        this.$parent.algorithmTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    // 告警类型
    setAlarmType(val) {
      if (val) {
        this.alarmTypeList.map(item => {
          if (item.children) {
            item.children.map(item1 => {
              if (val == item1.value) {
                val = item1.label
              }
            })
          }
        })
      } else {
        val = ''
      }
      return val
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'DisableSelection'
      }
    },

    // 添加
    async handleAss() {
      let modelList = []
      for (let i = 0; i < this.tableDataCopy.length; i++) {
        modelList.push({
          modelId: this.tableDataCopy[i].modelId,
          associated: this.tableDataCopy[i].associated
        })
      }

      this.$api
        .associate({
          deviceId: this.$parent.choosedCameraId,
          modelList: modelList
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.$message({
              type: 'success',
              message: this.$t('devModel.saveSucc')
            })

            this.$parent.handleFind()
            this.$parent.dialogFormVisible_detail = false
          }
        })
    },

    // 搜索
    async handleFind() {
      this.loading = true
      let res = await this.$api.getAssociationInfo({
        deviceId: this.$parent.choosedCameraId,
        modelName: this.searchForm.modelName
      })
      if (res.resultCode != 0) return

      this.tableData = res.associatedList || []

      this.tableData.forEach(item => {
        if (item.associated == 1) {
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          }, 200)
        }
      })

      this.loading = false
    }
  }
}
</script>

<style lang="scss">
#device-model-set {
  .el-dialog__body {
    padding: 0px 20px 20px 20px;
    overflow-y: hidden !important;
    // 隐藏全选框
    .DisableSelection .cell {
      display: none !important;
    }
  }
}
</style>
