<template>
  <div
    id="server-choose"
    ref="serverChoose"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
  >
    <!-- 查询和其他操作 -->
    <div class="search-form">
      <el-form
        :inline="true"
        class="demo-form-inline"
        :label-width="locale == 'en' ? '105px' : '84px'"
        ref="form"
        :model="queryParams"
        label-position="left"
      >
        <div class="flexstart">
          <el-form-item :label="$t('gatewayCluster.nodeName') + ':'">
            <el-input
              v-model="queryParams.searchInfo.nodeName"
              clearable
              :placeholder="$t('gatewayCluster.nodeNamePrompt')"
            />
          </el-form-item>
          <el-form-item :label="$t('gatewayCluster.nodeIp') + ':'">
            <el-input
              v-model="queryParams.searchInfo.nodeIp"
              clearable
              :placeholder="$t('gatewayCluster.nodeIpPrompt')"
            />
          </el-form-item>
          <el-form-item :label="$t('gatewayCluster.nodeStatus') + ':'">
            <el-select
              v-model="queryParams.searchInfo.status"
              clearable
              :placeholder="$t('gatewayCluster.nodeStatusPrompt')"
            >
              <el-option
                v-for="(item, index) in serverStatusList"
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
            class="lowBtn"
            @click="handleFind"
          >
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleRest" class="lowBtn">{{ $t('public.reset') }}</el-button>
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
        <el-table-column label width="50" type="selection" :selectable="isSelectable" />
        <el-table-column
          :label="$t('gatewayCluster.nodeGroup')"
          prop="nodeGroup"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('gatewayCluster.nodeName')"
          prop="nodeName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('gatewayCluster.nodeIp')" prop="nodeIp" show-overflow-tooltip />
        <el-table-column
          :label="$t('gatewayCluster.nodePort')"
          prop="nodePort"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('gatewayCluster.nodeStatus')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ setStatus(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('gatewayCluster.version')"
          prop="version"
          show-overflow-tooltip
          min-width="100"
        />
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
export default {
  name: 'gatewayChoose',
  props: {
    operation: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => {}
    },
    gatewayGroup: {
      type: String,
      default: ''
    },
    platGroupName: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      locale: localStorage.getItem('locale'),
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        searchInfo: {
          nodeName: '',
          nodeIp: '',
          status: '',
          platGroupName: ''
        }
      },
      pageloading: false,
      loading: false,
      areaCodeOptions: [], // 行政区域级联列表
      sceneTypeOptions: [], // 场所
      abilityOptions: [], // 设备能力
      manufacturerOptions: [], // 设备厂商
      networkPropertyOptions: [], // 联网属性
      tableData: [], // 表格数据
      ids: [], // 表格选中数据
      multiple: true, // 非多个禁用
      viewProps: {
        // 详情组件传参
        dialogVisible: false, // 控制详情弹窗显隐
        thirdDeviceId: null // 选择的设备id
      },
      editProps: {
        // 编辑组件传参
        dialogVisible: false, // 控制编辑弹窗显隐
        thirdDeviceId: null // 选择的设备id
      },
      formDialogVisible: false,

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

      serverStatusList: [
        {
          name: 'NONE',
          value: 'NONE'
        },
        {
          name: 'OK',
          value: 'OK'
        },
        {
          name: 'DOWN',
          value: 'DOWN'
        },
        {
          name: 'OOS',
          value: 'OOS'
        }
      ]
    }
  },
  async mounted() {
    await this.getList()
  },

  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.nodeGroup))
    }
  },

  methods: {
    async getTable() {
      let contactDot = 0
      this.spanArr = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.nodeGroup === this.tableData[index - 1].nodeGroup) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      // return
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
    },

    setStatus(val) {
      let name = ''
      this.serverStatusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    async getList() {
      this.loading = true
      let obj = JSON.parse(JSON.stringify(this.queryParams))
      obj.searchInfo.status === '' ? (obj.searchInfo.status = null) : null
      obj.searchInfo.searchType = 1
      obj.searchInfo.platGroupName = this.platGroupName
      let res = await this.$api.selectNodeHealths(obj)
      if (res.resultCode == 0) {
        this.tableData = res.nodeHealthInfos
        this.total = res.pageInfo.totalNum
        if (!this.operation) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].nodeGroup == this.gatewayGroup) {
              this.$nextTick(() => {
                this.$refs.gatewayChooseTable.toggleRowSelection(this.tableData[i])
                let selectioned = JSON.parse(JSON.stringify(this.tableData[i]))
                let nodeIpArr = []
                for (let j = 0; j < this.tableData.length; j++) {
                  if (selectioned.nodeGroup == this.tableData[j].nodeGroup) {
                    nodeIpArr.push(this.tableData[j].nodeIp)
                  }
                }
                selectioned.nodeIp = nodeIpArr
                this.$emit('getChooseServer', selectioned)
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
      this.queryParams.searchInfo.nodeName = ''
      this.queryParams.searchInfo.nodeIp = ''
      this.queryParams.searchInfo.status = ''
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
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
        // 判断selection是否有值存在
        this.$emit('getChooseServer', {})
        return
      }
      if (row) {
        this.selectioned = row
        this.$refs.gatewayChooseTable.toggleRowSelection(row, true)

        let serverIpArr = []
        for (let i = 0; i < this.tableData.length; i++) {
          if (row.nodeGroup === this.tableData[i].nodeGroup) {
            serverIpArr.push(this.tableData[i].nodeIp)
          }
        }
        this.selectioned.nodeIp = serverIpArr
        this.$emit('getChooseServer', this.selectioned)
      }
    }
  }
}
</script>

<style lang="scss">
#server-choose {
  height: 100%;
  .el-table--border .el-table__inner-wrapper::after,
  .el-table--border::after,
  .el-table--border::before,
  .el-table__inner-wrapper::before,
  .el-table__border-left-patch {
    background-color: #d9d9d9;
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
  .el-table {
    --el-table-border-color: rgb(229, 231, 235);
  }
}
</style>
