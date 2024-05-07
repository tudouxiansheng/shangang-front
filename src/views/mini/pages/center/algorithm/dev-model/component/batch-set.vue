<template>
  <div id="batch-set-device-model" ref="batchSetDeviceModel">
    <el-dialog
      :title="$t('devModel.devModelMap')"
      v-model="$parent.dialogFormVisible_batch"
      top="10vh"
      :width="locale == 'en' ? '1500px' : '1200px'"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-row>
        <el-col :span="6">
          <div class="devicetreeBS">
            <p v-if="locale == 'en'">{{ $t('devModel.selectedDev') }}：{{ tableList.length }}</p>
            <p v-if="locale == 'zh'">
              {{ $t('devModel.selectedDev') }}：{{ tableList.length }}
              {{ $t('devModel.platform') }}
            </p>
            <el-autocomplete
              v-model="deviceName"
              :fetch-suggestions="searchDevice"
              :placeholder="$t('devModel.inputDevName')"
              @select="handleSelect"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <pl-table
              ref="plTable"
              :data="tableList"
              :row-class-name="tableRowClassNameDialog"
              class="elTable customer-table"
              :height="maxHeight"
              border
              :show-header="false"
              :row-height="rowHeight"
              :empty-text="$t('public.noData')"
              :row-style="{ height: 0 + 'px' }"
              :cell-style="{ padding: 0 + 'px' }"
              :checkbox-config="{ checkAll: true, checkMethod: checkboxConfig }"
            >
              <pl-table-column label width="50" type="selection"></pl-table-column>
              <pl-table-column show-overflow-tooltip width="200" useSlot>
                <template #default="{ row }">
                  <span>
                    <i :class="iconStyDailog(row)" class="aci" style="margin-right: 5px"></i>
                    {{ row.cameraName }}
                  </span>
                </template>
              </pl-table-column>
            </pl-table>
          </div>
        </el-col>
        <!-- 查询和其他操作 -->
        <el-col :span="18" style="padding: 0px 0px 0px 20px">
          <p>
            <span>{{ $t('devModel.metadataModelList') }}</span>
            <span style="margin-left: 50px">
              <el-icon style="font-size: 16px"><el-icon-warning /></el-icon>
              {{ $t('devModel.batchCover') }}
            </span>
          </p>
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="handleAss">{{ $t('devModel.associate') }}</el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 20px; right: -8px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              label-position="left"
            >
              <el-form-item>
                <el-input
                  v-model="form.name"
                  clearable
                  size="small"
                  class="filter-item inputMiddle"
                  style="width: 200px"
                  :placeholder="$t('devModel.inputModelName')"
                  :style="locale == 'en' ? { width: '260px' } : ''"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div
            style="height: 420px"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            
          >
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>

            <!-- 表格 -->
            <el-table
              :max-height="tableHeight"
              v-if="!loading && tableData.length"
              :row-class-name="tableRowClassName"
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              border
              @select="handleSelectTable"
              @select-all="selectAllTable"
            >
              <template #empty>
                <span>{{ dataText }}</span>
              </template>

              <el-table-column label width="50" type="selection" />

              <el-table-column
                :label="$t('devModel.algoModelName')"
                min-width="120"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.modelName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.algoType')"
                min-width="110"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ setAlgoType(row.algorithmType) }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('devModel.algoMark')" min-width="90">
                <template #default="{ row }">
                  <span>{{ row.algorithmKey }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.modelType')"
                min-width="70"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ setAlgorithmModel(row.modelType) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('devModel.alarmType')"
                min-width="70"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.alarmName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('public.createTime')"
                prop="createTime"
                min-width="70"
                show-overflow-tooltip
              />

              <el-table-column
                :label="$t('public.updateTime')"
                prop="updateTime"
                min-width="70"
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
import { Warning as ElIconWarning } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconWarning
  },
  name: 'accessPlatformManage',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      alarmTypeList: [],
      tableDataCopy: [],
      choosedSelectBySearch: {},
      tableList: [],
      form: {
        name: ''
      },
      deviceName: '',
      maxHeight: 420,
      rowHeight: 30,
      total: 0,

      pageloading: false,
      loading: false,

      tableData: [], // 表格数据

      tableHeight: 401,
      dataText: '',

      maskloading: false,
      multipleSelection: []
    }
  },
  computed: {
    iconStyDailog(node) {
      return node => {
        if (node.ptzType == 1 && node.status == 1) {
          return 'aci-camera-gun iconCss1'
        } else if (node.ptzType == 2 && node.status == 1) {
          return 'aci-camera-ptz iconCss1'
        } else if (node.ptzType == 3 && node.status == 1) {
          return 'aci-camera-ball iconCss1'
        } else if (node.ptzType == 5 && node.status == 1) {
          return 'aci-camera1 iconCss1'
        } else if (node.ptzType == 1 && (node.status == 0 || node.status == 2)) {
          return 'aci-camera-gun iconCss2'
        } else if (node.ptzType == 2 && (node.status == 0 || node.status == 2)) {
          return 'aci-camera-ptz iconCss2'
        } else if (node.ptzType == 3 && (node.status == 0 || node.status == 2)) {
          return 'aci-camera-ball iconCss2'
        } else if (node.ptzType == 5 && (node.status == 0 || node.status == 2)) {
          return 'aci-camera1 iconCss2'
        }
      }
    }
  },
  methods: {
    checkboxConfig() {
      return false
    },
    handleSelectTable(selection, row) {
      row.associated = !row.associated
      for (let i = 0; i < this.tableDataCopy.length; i++) {
        if (row.modelId == this.tableDataCopy[i].modelId) {
          this.tableDataCopy[i]['associated'] = !this.tableDataCopy[i].associated
        }
      }
    },

    selectAllTable(val) {
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
              this.tableDataCopy[i]['associated'] = this.tableData[j].associated

              break
            }
          }
        }
      }
    },

    selectableDev(row, index) {
      return false
    },
    // 获取告警类型
    async getGroups() {
      await this.$api.getGroupsQuery({}).then(res => {
        if (res && res.alarmGroups) {
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            let groupobj = {}
            groupobj.value = res.alarmGroups[i].groupCode
            groupobj.label =
              this.locale == 'en' ? res.alarmGroups[i].groupEnName : res.alarmGroups[i].groupName
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

    handleAss() {
      let modelList = []
      for (let i = 0; i < this.tableDataCopy.length; i++) {
        modelList.push({
          modelId: this.tableDataCopy[i].modelId,
          associated: this.tableDataCopy[i].associated
        })
      }

      let ids = this.tableList.map(item => item.cameraId)
      this.$api.batchAssociate({ deviceIds: ids, modelList: modelList }).then(res => {
        if (res.resultCode == 0) {
          this.$parent.getList()
          this.$message({
            type: 'success',
            message: this.$t('devModel.associateSucc')
          })
          this.$parent.dialogFormVisible_batch = false
        }
      })
    },
    async getModel() {
      let res = await this.$api.getAlgorithmModelList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        modelName: this.form.name
      })
      if (res.resultCode == 0 && res.algorithmModelList) {
        this.tableData = res.algorithmModelList
        this.loading = false
      } else {
        this.tableData = []
        this.loading = false
      }
      this.tableList = JSON.parse(JSON.stringify(this.$parent.multipleSelection))
    },
    async dialogOpen() {
      this.form.name = ''
      await this.getModel()
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].associated = false
      }
      this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
    },
    dialogClosed() {
      this.dialogFormVisible_batch = false
    },
    searchDevice(queryString, cb) {
      if (!this.deviceName) {
        return
      }

      let list = []

      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].cameraName.includes(queryString)) {
          let obj = JSON.parse(JSON.stringify(this.tableList[i]))
          obj.value = obj.cameraName
          list.push(obj)
        }
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(list)
      }, 3000 * Math.random())
    },
    handleSelect(item) {
      this.choosedSelectBySearch = item
      this.$refs.plTable.$refs.vxeTable.setCurrentRow(item)
    },
    highLightDevice() {
      // 废弃
      let search = this.tableList.find(item => item.cameraId == this.choosedSelectBySearch.cameraId)
      let index2 = this.tableList.indexOf(search)
      let dialogRow = document.getElementsByClassName('dialogRow')
      let height = parseInt(dialogRow[0].style.height) || 30

      //show-header 为 true 时 为 children[2]， 为false 时 为children[1]
      this.$refs.plTable.$el.children[0].children[1].scrollTop = index2 * height

      setTimeout(() => {
        let row
        if (index2 <= 3) {
          row = dialogRow[index2]
        } else if (index2 > this.tableList.length - this.maxHeight / this.rowHeight) {
          row = dialogRow[dialogRow.length - (this.tableList.length - index2)]
        } else {
          row = dialogRow[3]
        }
        row.click()
      }, 500)
    },
    // 表格斑马纹
    tableRowClassNameDialog({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'dialogRow'
      } else {
        return 'dialogRow'
      }
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

    handleFind() {
      this.getModel()
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /** 表格多选框选中数据 */
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss">
#batch-set-device-model {
  height: 100%;

  .devicetreeBS {
    .el-input .el-input__inner {
      background: #f2f2f2;
      border: none;
    }
    .vxe-body--row {
      background: #f2f2f2;
      &.row--current {
        background-color: #8eccff;
      }
      &:hover {
        background-color: #8eccff;
      }
    }
    .vxe-body--column {
      height: 30px;
    }
  }
  .el-overlay-dialog {
    .el-table .el-table__inner-wrapper::after,
    .el-table .el-table__inner-wrapper::before {
      background-color: #d9d9d9;
    }
    .el-table__border-left-patch {
      background-color: #d9d9d9;
    }
  }

  & .el-table td.el-table-column--selection {
    height: 30px !important;
    text-align: center;
  }

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .el-dropdown {
    font-size: 14px;
  }
  .devicetreeBS {
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f2f2f2;
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: pointer;
    .el-tree {
      height: 500px;
    }
    .el-autocomplete {
      width: 71.5%;
      margin: 5px;
    }
    .el-table__body-wrapper {
      overflow-y: auto !important;
    }
    .el-table th,
    .el-table tr {
      background: #f2f2f2 !important;
    }
    .el-table-column--selection .cell {
      padding-right: 0px !important;
    }
    // 去掉表格单元格边框
    .customer-table th {
      border: none;
    }
    .customer-table td,
    .customer-table th.is-leaf {
      border: none;
    }
    // 表格最外边框
    .el-table--border,
    .el-table--group {
      border: none;
    }
    // 头部边框
    .customer-table thead tr th.is-leaf {
      border-right: none;
    }
    // 表格最外层边框-底部边框
    .el-table--border::after,
    .el-table--group::after {
      width: 0;
    }
    .customer-table::before {
      width: 0;
    }
    .customer-table .el-table__fixed-right::before,
    .el-table__fixed::before {
      width: 0;
    }
  }
  .el-table-column--selection .cell {
    text-align: center !important;
  }

  .el-dialog__body {
    padding: 15px 20px 15px 20px;
    overflow-y: hidden !important;
  }
  .el-table td {
    height: 30px !important;
    text-align: left;
  }
  .el-checkbox__inner {
    border: 1px solid #3085cb;
  }
  .el-dialog__body .el-table__empty-block {
    background: #f2f2f2 !important;
  }
}
</style>
