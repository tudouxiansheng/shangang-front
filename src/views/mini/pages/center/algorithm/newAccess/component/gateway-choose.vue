<template>
  <div
    id="gateway-choose"
    ref="gatewayChoose"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    
  >
    <!-- 查询和其他操作 -->
    <div class="search-form">
      <el-form
        :inline="true"
        class="demo-form-inline"
        :label-width="locale == 'en' ? '115px' : '84px'"
        ref="form"
        :model="queryParams"
        label-position="left"
      >
        <div class="flexstart">
          <el-form-item :label="$t('newAccess.gatewayName') + ':'">
            <el-input
              v-model="queryParams.gatewayName"
              clearable
              :placeholder="$t('newAccess.inputGatewayName')"
            />
          </el-form-item>
          <el-form-item :label="$t('newAccess.gatewayIP') + ':'">
            <el-input
              v-model="queryParams.gatewayIp"
              clearable
              :placeholder="$t('newAccess.inputGatewayIP')"
            />
          </el-form-item>
          <el-form-item :label="$t('newAccess.gatewayStatus') + ':'">
            <el-select
              v-model="queryParams.gatewayStatus"
              clearable
              :placeholder="$t('newAccess.inputGatewayStatus')"
            >
              <el-option
                v-for="(item, index) in gatewayStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="search-btn">
          <el-button
            type="primary"
            style="display: inline-block"
            @click="handleFind"
            class="lowBtn"
          >
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleRest" class="lowBtn">{{ $t('public.reset') }}</el-button>
        </div>
      </el-form>
    </div>

    <div
      style="max-height: 443px"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
        <p>{{ $t('public.noData') }}</p>
      </div>

      <!-- 表格 -->
      <el-table
        :max-height="tableHeight"
        v-if="!loading && tableData.length"
        :row-class-name="tableRowClassName"
        :header-cell-class-name="cellClass"
        ref="gatewayChooseTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        @select="dialogCheck"
        :span-method="objectSpanMethod"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column label width="50" type="selection" />
        <el-table-column
          :label="$t('newAccess.gatewayGroup')"
          prop="gatewayGroup"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('newAccess.gatewayName')"
          prop="gatewayName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('newAccess.gatewayIP')"
          prop="gatewayIp"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('newAccess.gatewayStatus')"
          prop="areaCode"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span :class="setStatusClass(row.gatewayStatus)">
              {{ setStatus(row.gatewayStatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('newAccess.condition')"
          prop="scale"
          width="215"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.createTime')" prop="createTime" />
      </el-table>

      <pagination
      id="page-Width"
        v-if="!loading && tableData.length"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'gatewayChoose',
  components: {},
  props: {
    operation: {
      type: Boolean,
      default: false
    },
    choosedAccessPlatType: {
      default: undefined
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        gatewayName: '',
        gatewayIp: '',
        gatewayStatus: ''
      },
      pageloading: false,
      loading: false,
      tableData: [], // 表格数据
      ids: [], // 表格选中数据
      multiple: true, // 非多个禁用

      formDialogVisible: false,

      locale: localStorage.getItem('locale'),
      screenFlag: true,
      tableHeight: 400,
      dataText: '',

      //网关集群
      dialogFormVisible: false,
      maskloading: false,
      dataForm: {},
      gatewayClusterDetailVisible: false,
      spanArr: [],
      selectioned: '',
      gatewayStatusList: []
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setData()
      this.locale = localStorage.getItem('locale')
    }
  },
  async created() {
    await this.setData()
    await this.getList()
    await this.getTable()
  },

  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
    }
  },

  methods: {
    cellClass(row) {
        if (row.columnIndex === 0) {
            return 'disabledCheck';
        }
    },
    setData() {
      this.gatewayStatusList = [
        {
          name: this.$t('newAccess.noneDeployed'),
          value: 'NONE'
        },
        {
          name: this.$t('newAccess.online'),
          value: 'OK'
        },
        {
          name: this.$t('newAccess.offline'),
          value: 'DOWN'
        },
        {
          name: this.$t('newAccess.abnormal'),
          value: 'OOS'
        }
      ]
    },
    setStatusClass(val) {
      if (val) {
        if (val.startsWith('OK')) {
          return 'success'
        } else if (val.startsWith('OOS')) {
          return 'warning'
        } else if (val.startsWith('DOWN')) {
          return 'danger'
        }
      }
    },
    setStatus(val) {
      let name = ''
      this.gatewayStatusList.filter(item => {
        if (val) {
          if (val.startsWith(item.value)) {
            name = item.name
          }
        }
      })
      return name
    },

    async getTable() {
      this.spanArr = []
      let contactDot = 0
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.gatewayGroup === this.tableData[index - 1].gatewayGroup) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
    },
    async getList() {
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.queryParams.pageInfo.pageNum,
          pageSize: this.queryParams.pageInfo.pageSize
        },
        searchInfo: {
          gatewayName: this.queryParams.gatewayName,
          gatewayIp: this.queryParams.gatewayIp,
          gatewayStatus:
            this.queryParams.gatewayStatus === '' ? null : this.queryParams.gatewayStatus,
          accessPlatType: this.choosedAccessPlatType
        },
        type: 2
      }

      let res = await this.$api.selectAdapterGateways(obj)
      if (res.resultCode == 0) {
        this.tableData = res.gatewayList
        this.total = res.pageInfo.totalNum

        if (!this.operation) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].gatewayGroup == this.form.gatewayGroup) {
              this.$nextTick(() => {
                this.$refs.gatewayChooseTable.toggleRowSelection(this.tableData[i])

                let selectioned = JSON.parse(JSON.stringify(this.tableData[i]))
                let gatewayIpArr = []
                for (let j = 0; j < this.tableData.length; j++) {
                  if (selectioned.gatewayGroup == this.tableData[j].gatewayGroup) {
                    gatewayIpArr.push(this.tableData[j].gatewayIp)
                  }
                }
                selectioned.gatewayIp = gatewayIpArr

                this.$emit('getChooseGateWay', selectioned)
              })
              break
            }
          }
        }

        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },

    async handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      await this.getList()
      await this.getTable()
    },

    handleRest() {
      this.queryParams.gatewayName = ''
      this.queryParams.gatewayIp = ''
      this.queryParams.gatewayStatus = ''
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 5) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },

    /** 表格多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.thirdDeviceId)
      this.multiple = !selection.length
    },
    dialogCheck(selection, row) {
      this.$refs.gatewayChooseTable.clearSelection()
      if (selection.length === 0) {
        this.$emit('getChooseGateWay', {})
        // 判断selection是否有值存在
        return
      }
      if (row) {
        this.selectioned = JSON.parse(JSON.stringify(row))
        this.$refs.gatewayChooseTable.toggleRowSelection(row, true)

        let gatewayIpArr = []
        for (let i = 0; i < this.tableData.length; i++) {
          if (row.gatewayGroup == this.tableData[i].gatewayGroup) {
            gatewayIpArr.push(this.tableData[i].gatewayIp)
          }
        }

        this.selectioned.gatewayIp = gatewayIpArr

        this.$emit('getChooseGateWay', this.selectioned)
      }
    }
  }
}
</script>

<style lang="scss">
#gateway-choose {
  height: 100%;
   #page-Width{
     .el-input,
    .el-input__wrapper,
    .el-input__inner,
    .el-cascader .el-input__wrapper {
      width: inherit;
    }
   } 
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .has-gutter {
    .el-checkbox {
      display: none;
    }
  }
  .el-pagination .el-input__inner {
    width: 70px;
  }
  .el-pagination .el-pagination__editor.el-input .el-input__inner {
    width: 46px !important;
  }

  .lowBtn {
    min-width: 60px !important;
    height: 36px !important;
  }

  .el-table .disabledCheck .cell .el-checkbox__inner {
      display: none;
  }

  .el-table .disabledCheck .cell::before {
      content: '';
      text-align: center;
      line-height: 37px;
  }
}
</style>
