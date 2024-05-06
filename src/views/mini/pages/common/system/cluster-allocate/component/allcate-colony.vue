<template>
  <div class="allcote-cnlony-doalog">
    <!-- 网关列表框 -->
    <el-dialog
      draggable
      :title="$t('distribution.gateways')"
      v-model="dialogVisible"
      top="10vh"
      :width="'1200px'"
      :close-on-click-modal="false"
      :modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
    >
      <el-button
        type="primary"
        :disabled="changeBtn"
        style="margin-bottom: 20px"
        @click="batchAllocation"
      >
        {{ $t('distribution.MassDistribution') }}
      </el-button>
      <div class="search-form">
        <el-form
          :inline="true"
          class="demo-form-inline"
          ref="domainForm"
          :model="domainSearch"
          label-position="left"
          :label-width="locale == 'en' ? '126px' : '90px'"
        >
          <div class="flexstart">
            <el-form-item
              :label="$t('Operations.clusterCode') + ' ：'"
              clusterCodeprop="domainCode"
              class="flex-item"
            >
              <el-input
                v-model="domainSearch.domainCode"
                auto-complete="off"
                :placeholder="$t('Operations.pleaseInputclusterCode')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('Operations.clusterName') + ' ：'"
              prop="domainName"
              class="flex-item"
            >
              <el-input
                v-model="domainSearch.domainName"
                auto-complete="off"
                :placeholder="$t('Operations.pleaseInputclusterName')"
                clearable
              />
            </el-form-item>
          </div>

          <div class="search-btn">
            <el-button type="primary" class="miniBtn" @click="getDomainList">
              {{ $t('public.search') }}
            </el-button>
            <el-button @click="handleReset" class="miniBtn">
              {{ $t('public.reset') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <!-- 集群列表 -->
      <div
        v-loading="domainLoading"
        :element-loading-text="$t('public.loading')"
        
      >
        <div v-show="!domainLoading && !domainList.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt />
          <p>{{ $t('public.noData') }}</p>
        </div>
        <el-table
          v-show="!domainLoading && domainList.length"
          class="elTable"
          max-height="700"
          ref="domainList"
          :data="domainList"
          :element-loading-text="$t('public.loading')"
          
          :row-class-name="tableRowClassName"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column label width="40" type="selection" />
          <el-table-column
            :label="$t('Operations.clusterCode')"
            min-width="80"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.domainCode }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('Operations.clusterName')"
            min-width="90"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.domainName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.clusterEnable')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableDomain == 1 ? 'success' : 'danger'">
                {{
                  row.enableDomain == '1' ? $t('Operations.enable') : $t('Operations.notEnabled')
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.protocolSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableGb == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableGb) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.onvifSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableOnvif == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableOnvif) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.HWSDKSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enablePassiveHwsdk == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enablePassiveHwsdk) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.HWSDKProtocolSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableActiveHwsdk == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableActiveHwsdk) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.HIKSDKAccess')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableHiksdk == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableHiksdk) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.dhsdkSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableDhsdk == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableDhsdk) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.streamDistribution')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableDistribution == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableDistribution) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Operations.recordingSupported')"
            min-width="100"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="row.enableStorage == 1 ? 'success' : 'danger'">
                {{ setApprove(row.enableStorage) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operating')" min-width="100">
            <template #default="{ row }">
              <span class="cell-operate" @click="allocation(row)">
                {{ $t('distribution.allocation') }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="!domainLoading && domainList.length"
          :total="domainTotalNum"
          v-model:pageNum="domainPageNum"
          v-model:limit="domainPageSize"
          @pagination="getDomainList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      multipleSelection: [], //表格选中状态存放数组
      changeBtn: true, //批量分配按钮
      domainLoading: false, //集群列表加载
      domainSearch: {
        domainCode: '',
        domainName: ''
      },
      domainPageNum: 1,
      domainPageSize: 10,
      domainTotalNum: 0, // 集群列表总数量
      domainList: [] //集群列表表格
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    setApprove(val) {
      if (val == 0) {
        return this.$t('Operations.notSupport')
      } else if (val == 1) {
        return this.$t('Operations.support')
      } else {
        return ''
      }
    },
    dialogOpen() {
      this.getDomainList()
    },
    dialogClosed() {
      this.dialogVisible = false
      this.changeBtn = true
      this.domainSearch = {
        domainCode: '',
        domainName: ''
      }
      this.domainPageNum = 1
      this.domainPageSize = 10
      this.domainTotalNum = 0
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
    //重置
    handleReset() {
      this.domainSearch = {
        domainCode: '',
        domainName: ''
      }
      this.domainPageNum = 1
      this.domainPageSize = 10
      this.getDomainList()
    },
    //获取集群列表
    getDomainList() {
      this.domainLoading = true
      let data = {
        pageInfo: {
          pageNum: this.domainPageNum,
          pageSize: this.domainPageSize
        },
        organizationId: this.$parent.organizationId,
        ...this.domainSearch
      }
      this.$api.getUnAllocatedDomainList(data).then(res => {
        if (res.unAllocatedDomainList && res.unAllocatedDomainList.length) {
          this.domainList = res.unAllocatedDomainList
          this.domainTotalNum = res.pageInfo.totalNum
        } else {
          this.domainList = []
          this.domainTotalNum = 0
        }
        this.domainLoading = false
      })
    },
    // 分配
    allocation(row) {
      let data = {
        organizationId: this.$parent.organizationId,
        domainCodeList: [{ domainCode: row.domainCode, regionCode: row.regionCode }]
      }
      this.$api.AllocateDomain(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccess')
          })
          this.dialogVisible = false
          this.$parent.getAllocatedDomainList()
        }
      })
    },
    //批量分配
    batchAllocation() {
      let domainCodeList = []
      this.multipleSelection.forEach(item => {
        domainCodeList.push({
          domainCode: item.domainCode,
          regionCode: item.regionCode
        })
      })
      let data = {
        organizationId: this.$parent.organizationId,
        domainCodeList: domainCodeList
      }
      this.$api.AllocateDomain(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccess')
          })
          this.dialogVisible = false
          this.$parent.getAllocatedDomainList()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.allcote-cnlony-doalog {
  .el-dialog__body {
    padding: 15px;
  }
}
</style>
