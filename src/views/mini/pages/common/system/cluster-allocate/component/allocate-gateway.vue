<template>
  <!-- 分配集群网关 -->
  <div class="allcote-gateway-dialog">
    <!-- 集群列表框 -->
    <el-dialog
      draggable
      :title="$t('distribution.ClusterAllocation')"
      v-model="$parent.dialogFormVisible"
      top="10vh"
      :width="'1300px'"
      :close-on-click-modal="false"
      @open="clusterOpen"
      :modal="false"
      @closed="clusterClose"
    >
      <el-table
        max-height="441"
        :row-class-name="$parent.tableRowClassName"
        class="elTable"
        v-loading="clusterloading"
        :element-loading-text="$t('public.loading')"
        
        :data="clusterData"
        border
        ref="dialogTable1"
      >
        <el-table-column
          :label="$t('distribution.clusterCode')"
          min-width="130"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.clusterCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.clusterName')"
          min-width="80"
          ref="status"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.clusterName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.storage')"
          :min-width="$parent.locale == 'en' ? 120 : 60"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span :class="row.storage == '0' ? 'success' : row.storage == '1' ? 'danger' : ''">
              {{ $parent.setStorage(row.storage) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.state')"
          :min-width="$parent.locale == 'en' ? 60 : 45"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
              {{ $parent.setStatus(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('public.createTime')" min-width="70" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('public.updateTime')" min-width="70" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.operating')"
          :min-width="$parent.locale == 'en' ? 80 : 50"
          v-if="$parent.PermissionManage"
        >
          <template #default="{ row }">
            <span style="margin-right: 7px; cursor: pointer; color: #10a9ff" @click="Disable(row)">
              {{ $t('distribution.gateway') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination" v-if="$parent.dialogFormVisible">
        <div class="paging">
          <span>{{ $t('public.everyPageShows') }}</span>
          <el-select v-model="cluster_pageSize" @change="clusterChange">
            <el-option
              v-for="(item, index) in cluster_numberList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span>{{ $t('public.records') }}</span>
        </div>
        <div>
          <el-pagination
            v-model:current-page="cluster_pageNum"
            :page-size="cluster_pageSize"
            layout="total, prev, pager, next, jumper"
            :total="clusterNum"
            @current-change="handleClusterChange"
            background
          />
        </div>
      </div>
    </el-dialog>

    <!-- 网关列表框 -->
    <el-dialog
      draggable
      :title="$t('distribution.gateways')"
      v-model="gatewayFormVisible"
      top="10vh"
      :width="'1550px'"
      :close-on-click-modal="false"
      @open="gatewayOpen"
      :modal="false"
      @closed="gatewayClose"
    >
      <el-button
        type="primary"
        :disabled="changeBtn"
        @click="determine"
        style="margin-bottom: 20px"
      >
        {{ $t('distribution.MassDistribution') }}
      </el-button>
      <el-table
        max-height="441"
        :row-class-name="$parent.tableRowClassName"
        class="elTable"
        v-loading="gatewayloading"
        :element-loading-text="$t('public.loading')"
        
        :data="gatewayData"
        @selection-change="handleSelectionChange"
        border
        ref="dialogTable2"
      >
        <el-table-column label width="40" type="selection" />
        <el-table-column
          :label="$t('distribution.gatewayCode')"
          min-width="90"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.gatewayId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.DynamicIP')"
          min-width="85"
          ref="status"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.gatewayIp }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('distribution.NVRcode')" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.nvrCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.NationalIP')"
          :min-width="$parent.locale == 'en' ? 120 : 60"
          ref="status"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.gbAccessIp }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('distribution.Nationalport')"
          :min-width="$parent.locale == 'en' ? 130 : 90"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.gbAccessPort }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('distribution.lensTotal')"
          :min-width="$parent.locale == 'en' ? 160 : 70"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('distribution.gatewayState')"
          :min-width="$parent.locale == 'en' ? 100 : 55"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
              {{ $parent.setStatus(row.status) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('public.createTime')"
          :min-width="$parent.locale == 'en' ? 80 : 65"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.updateTime')"
          :min-width="$parent.locale == 'en' ? 80 : 55"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.operating')"
          min-width="70"
          v-if="$parent.PermissionManage"
        >
          <template #default="{ row }">
            <span
              style="margin-right: 7px; cursor: pointer; color: #10a9ff"
              @click="allocation(row)"
            >
              {{ $t('distribution.allocation') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination" v-if="gatewayFormVisible">
        <div class="paging">
          <span>{{ $t('public.everyPageShows') }}</span>
          <el-select v-model="gateway_pageSize" @change="gatewayChange">
            <el-option
              v-for="(item, index) in gateway_numberList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span>{{ $t('public.records') }}</span>
        </div>
        <div>
          <el-pagination
            v-model:current-page="gateway_pageNum"
            :page-size="gateway_pageSize"
            layout="total, prev, pager, next, jumper"
            :total="gatewayNum"
            @current-change="handlegatewayChange"
            background
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clusterloading: false,
      clusterData: [],
      cluster_pageNum: 1,
      cluster_pageSize: 10,
      clusterNum: 0, //集群总数量
      cluster_numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      gatewayFormVisible: false, //网关分配
      clusterCode: '',
      changeBtn: true, //设备批量分配
      multipleSelection: [], //表格选中状态存放数组

      gatewayloading: false,
      gatewayData: [],
      gateway_pageNum: 1,
      gateway_pageSize: 10,
      gatewayNum: 0, //网关总数量
      gateway_numberList: [10, 20, 30, 40, 50, 100, 500] //每页显示数量,
    }
  },
  methods: {
    clusterOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.getClusterList()
      })
    },
    clusterClose() {
      this.$parent.dialogFormVisible = false
      this.cluster_pageNum = 1
      this.cluster_pageSize = 10
      this.clusterNum = 0
      this.clusterData = []
    },
    async getClusterList() {
      this.clusterloading = true
      let data = {
        pageInfo: {
          pageNum: this.cluster_pageNum,
          pageSize: this.cluster_pageSize
        },
        organizationId: this.$parent.organizationId
      }
      this.$api.getClusterByOrganizationPlat(data).then(res => {
        if (res.resultCode == 0) {
          this.clusterData = res.clusterList
          this.clusterNum = res.pageInfo.totalNum
        } else {
          this.clusterData = []
          this.clusterNum = 0
        }

        this.clusterloading = false
      })
    },

    handleClusterChange(val) {
      this.cluster_pageNum = val
      this.getClusterList()
    },
    clusterChange() {
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.clusterNum < this.cluster_pageSize * this.cluster_pageNum) {
        this.cluster_pageNum = 1
      }
      this.getClusterList()
    },

    // 分配网关
    Disable(row) {
      this.clusterCode = row.clusterCode
      this.gatewayFormVisible = true
    },

    gatewayOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.getGatewayList()
      })
    },
    async getGatewayList() {
      this.gatewayloading = true
      let data = {
        pageInfo: {
          pageNum: this.gateway_pageNum,
          pageSize: this.gateway_pageSize
        },
        organizationId: this.$parent.organizationId,
        clusterCode: this.clusterCode
      }
      await this.$api.getGatewayByOrganizationPlat(data).then(res => {
        if (res.resultCode == 0) {
          this.gatewayData = res.gatewayList
          this.gatewayNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.dialogTable2.bodyWrapper.scrollTop = 0
          })
        } else {
          this.gatewayData = []
          this.gatewayNum = 0
        }

        this.gatewayloading = false
      })
    },
    gatewayClose() {
      this.gatewayFormVisible = false
      this.gateway_pageNum = 1
      this.gateway_pageSize = 10
      this.gatewayNum = 0
      this.gatewayData = []
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.changeBtn = false
      } else {
        this.changeBtn = true
      }
    },
    // 分配
    allocation(row) {
      let data = {
        organizationId: this.$parent.organizationId,
        clusterCode: row.clusterCode,
        gatewayIds: [row.gatewayId]
      }
      this.$api.addOrganizationGateway(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccessContent')
          })
          this.gatewayClose()
          this.clusterClose()
          this.$parent.getClusterGatewayList()
        }
      })
    },
    // 批量分配
    determine() {
      let gatewayIds = []
      this.multipleSelection.forEach(item => {
        gatewayIds.push(item.gatewayId)
      })
      let data = {
        organizationId: this.$parent.organizationId,
        clusterCode: this.multipleSelection[0].clusterCode,
        gatewayIds
      }
      this.$api.addOrganizationGateway(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccessContent')
          })
          this.gatewayClose()
          this.clusterClose()
          this.$parent.getClusterGatewayList()
        }
      })
    },

    handlegatewayChange(val) {
      this.gateway_pageNum = val
      this.getGatewayList()
    },
    gatewayChange() {
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.gatewayNum < this.gateway_pageSize * this.gateway_pageNum) {
        this.gateway_pageNum = 1
      }
      this.getGatewayList()
    }
  }
}
</script>

<style lang="scss">
.allcote-gateway-dialog {
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::after {
    background-color: #d9d9d9 !important;
  }
  .el-dialog__body {
    padding: 15px;
    .pagination .el-select {
      width: 90px;
      padding: 0 10px;
    }
    .pagination .paging .el-input__inner {
      width: 38px !important;
    }
  }
}
</style>
