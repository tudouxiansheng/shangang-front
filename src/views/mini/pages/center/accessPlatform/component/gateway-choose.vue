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
        :label-width="locale == 'en' ? '162px' : '84px'"
        ref="form"
        :model="queryParams"
        label-position="left"
      >
        <div class="flexstart">
          <el-form-item :label="$t('accessPlatform.gatewayPacket') + ':'">
            <el-input
              v-model="queryParams.multipleIvsGroupName"
              clearable
              :placeholder="$t('accessPlatform.inputGatewayPacket')"
            />
          </el-form-item>
          <el-form-item :label="$t('gatewayCluster.allocationStatus') + ':'">
            <el-select
              v-model="queryParams.allocationStatus"
              clearable
              :placeholder="$t('accessPlatform.selectGatewayStatus')"
            >
              <el-option
                v-for="(item, index) in allocationStatusList"
                :key="index"
                :label="item.name"
                :value="item.code"
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
          <el-button @click="handleRest" class="lowBtn">{{ $t('login.reset') }}</el-button>
        </div>
      </el-form>
    </div>
    <div style="max-height: 443px" v-loading="loading" :element-loading-text="$t('public.loading')">
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
        <p>{{ $t('public.noData') }}</p>
      </div>

      <!-- 表格 -->
      <el-table
        :max-height="tableHeight"
        v-if="!loading && tableData.length"
        :row-class-name="tableRowClassName"
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
        <el-table-column label-width="50" type="selection" :selectable="isSelectable" />
        <el-table-column
          :label="$t('accessPlatform.gatewayPacket')"
          prop="multipleIvsGroupName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('gatewayCluster.allocationStatus')"
          prop="allocationStatus"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>
              {{ setAllocationStatus(row.allocationStatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('accessPlatform.gatewayName')"
          prop="gatewayName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('distribution.gatewayIp')"
          prop="gatewayIp"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('gatewayCluster.gatewayPort')"
          prop="gatewayPort"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('distribution.gatewayState')"
          prop="areaCode"
          show-overflow-tooltip
          :min-width="locale == 'en' ? '60px' : '84px'"
        >
          <template #default="{ row }">
            <span :class="setStatusClass(row.gatewayStatus)">
              {{ setStatus(row.gatewayStatus) }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
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
import { mapState } from 'vuex'

export default {
  name: 'gatewayChoose',
  components: {},
  props: {
    choosedAccessPlatType: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Boolean,
      default: false
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
        multipleIvsGroupName: undefined,
        allocationStatus: undefined
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
      gatewayStatusList: [
        {
          name: this.$t('accessPlatform.notDeployed'),
          value: 'NONE'
        },
        {
          name: this.$t('tenantManage.online'),
          value: 'OK'
        },
        {
          name: this.$t('tenantManage.offline'),
          value: 'DOWN'
        },
        {
          name: this.$t('primaryDevice.Abnormal'),
          value: 'OOS'
        }
      ]
    }
  },
  async created() {
    await this.getList()
  },

  computed: {
    ...mapState({
      allocationStatusList: state => state.dict['allocation_status'] // 智能分析任务状态
    }),
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
    }
  },

  methods: {
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
      let contactDot = 0
      this.spanArr = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.multipleIvsGroupName === this.tableData[index - 1].multipleIvsGroupName) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
      if (!this.tableData[0] || this.tableData[0].allocationStatus === 1) return
      this.$refs.gatewayChooseTable.toggleRowSelection(this.tableData[0], true)
      this.dialogCheck([this.tableData[0]], this.tableData[0])
    },
    async getList() {
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.queryParams.pageInfo.pageNum,
          pageSize: this.queryParams.pageInfo.pageSize
        },
        searchInfo: {
          multipleIvsGroupName: this.queryParams.multipleIvsGroupName,
          allocationStatus: this.queryParams.allocationStatus,
          accessPlatType: this.choosedAccessPlatType[1]
        },
        type: 2
      }
      this.tableData = []
      let res = await this.$api.selectAdapterGateways(obj)
      if (res.resultCode == 0) {
        this.tableData = res.gatewayList
        this.total = res.pageInfo.totalNum
        this.loading = false
        if (this.operation) {
          for (let i = 0; i < this.tableData.length; i++) {
            const gatewayGroup = this.form.gatewayGroup.split('(')
            if (this.tableData[i].gatewayGroup == gatewayGroup[0]) {
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
      } else {
        this.tableData = []
        this.total = 0
      }
      await this.getTable()
      this.loading = false
    },

    handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      this.getList()
    },

    handleRest() {
      this.queryParams.multipleIvsGroupName = undefined
      this.queryParams.allocationStatus = undefined
      this.handleFind()
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    objectSpanMethod({ rowIndex, columnIndex }) {
      if ([0, 1, 2].includes(columnIndex)) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    isSelectable(row) {
      return row.allocationStatus === 0
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
    },
    setAllocationStatus(val) {
      return this.selectDictLabel(this.allocationStatusList, val, {
        key: 'name',
        value: 'code'
      })
    }
  }
}
</script>

<style lang="scss">
#gateway-choose {
  height: 100%;
  .el-table--border .el-table__inner-wrapper::after,
  .el-table--border::after,
  .el-table--border::before,
  .el-table__inner-wrapper::before,
  .el-table__border-left-patch {
    background-color: #d9d9d9 !important;
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
  .el-input__inner {
    width: 215px;
  }
  .lowBtn {
    min-width: 60px !important;
    height: 36px !important;
  }
  .el-table {
    --el-table-border-color: rgb(229, 231, 235);
  }
}
</style>
