<template>
  <!-- 集群分配 -->
  <div id="cluster-allocate" v-if="isRouterAlive" ref="systemClusterAllocate">
    <el-row>
      <el-col :span="4" style="padding: 20px 0px 0px 20px">
        <el-scrollbar style="border-radius: 6px">
          <lazy-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :withTenant="true"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <el-tabs
          v-model="tableSizes"
          type="card"
          style="margin: 20px 20px -10px 0px"
          @tab-change="handleClick"
        >
          <el-tab-pane :label="'IVS'" name="IVS"></el-tab-pane>
          <el-tab-pane :label="'ADS'" name="ADS"></el-tab-pane>
        </el-tabs>
        <div v-show="tableSizes == 'IVS'">
          <div v-if="PermissionManage" class="btnMargin">
            <el-button type="primary" @click="handleAdd">
              {{ $t('distribution.ClusterAllocation') }}
            </el-button>
          </div>
          <!-- //面包屑 -->
          <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

          <div
            style="height: 600px"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
          >
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <!-- 表格 -->
            <el-table
              v-if="!loading && tableData.length"
              max-height="630"
              ref="multipleTable"
              :data="tableData"
              :row-class-name="tableRowClassName"
              class="elTable"
              border
            >
              <template #empty>
                <span>{{ dataText }}</span>
              </template>
              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.clusterCode')"
                min-width="120"
              >
                <template #default="{ row }">
                  <span>{{ row.clusterCode }}</span>
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.clusterName')"
                min-width="90"
              >
                <template #default="{ row }">
                  <span>{{ row.clusterName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.storage')"
                :min-width="$parent.locale == 'en' ? 120 : 60"
              >
                <template #default="{ row }">
                  <span :class="row.storage == '0' ? 'success' : row.storage == 1 ? 'danger' : ''">
                    {{ setStorage(row.storage) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.state')"
                min-width="60"
              >
                <template #default="{ row }">
                  <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
                    {{ setStatus(row.status) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.gatewayCode')"
                min-width="100"
              >
                <template #default="{ row }">
                  <span>{{ row.gatewayId }}</span>
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                :label="$t('distribution.gatewayIp')"
                min-width="80"
              >
                <template #default="{ row }">
                  <span>{{ row.gatewayIp }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('public.operating')"
                min-width="120"
                v-if="PermissionManage"
              >
                <template #default="{ row }">
                  <span class="cell-operate danger" @click="handleDelete(row)">
                    {{ $t('distribution.cancelgateway') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination
              v-if="!loading && tableData.length"
              :total="totalNum"
              v-model:pageNum="pageNum"
              v-model:limit="pageSize"
              @pagination="getListByPage"
            />
          </div>
        </div>
        <table2
          ref="vpaasAllocate"
          @setTreeRefresh="setTreeRefresh"
          v-show="tableSizes == 'ADS'"
        ></table2>
      </el-col>
    </el-row>
    <!-- 分配集群网关 -->
    <allocate-gateway></allocate-gateway>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import judgeWindow from '@/mixin/judgeWindow'
import allocateGateway from './component/allocate-gateway' //分配集群网关
import lazyTree from '@/components/lazy-tree' //懒加载树
import breadcrumb from '@/components/breadcrumb' //面包屑
import table2 from './index-vpaas'

export default {
  name: 'ClusterAllocate',
  mixins: [judgeWindow],
  components: {
    'allocate-gateway': allocateGateway,
    'lazy-tree': lazyTree,
    breadcrumb,
    table2
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,

      //用户权限判断
      PermissionManage: true,

      organizationId: null,

      searchForm: {
        clusterCode: '',
        clusterName: '',
        gatewayIp: ''
      },
      isSearch: false,

      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标
      showManyCondition: false, // 高级搜索点击显示与隐藏

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      dialogFormVisible: false, // 集群分配
      tableSizes: 'IVS'
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.pageResize()
  },
  activated() {
    
    this.pageResize()
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.pageResize()
    }
  },
  methods: {
    handleClick(val) {
      if (val == 'IVS') {
        this.search_clear()
        this.handleFind()
      } else {
        this.$refs.vpaasAllocate.search_clear()
        this.$refs.vpaasAllocate.handleFind()
      }
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1816)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(91)
    },
    setStorage(val) {
      if (val == 0) {
        return this.$t('Operations.Storage')
      } else if (val == 1) {
        return this.$t('Operations.CancelTheStorage')
      } else {
        return ''
      }
    },
    setStatus(val) {
      if (val == 0) {
        return this.$t('public.normal')
      } else if (val == 1) {
        return this.$t('public.delete')
      } else {
        return ''
      }
    },
    setbossTag(val) {
      if (val == 0) {
        return this.$t('Operations.Noemploy')
      } else if (val == 1) {
        return this.$t('Operations.employ')
      } else {
        return ''
      }
    },
    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      this.$refs.vpaasAllocate.organizationId = this.organizationId
      //初始化面包屑
      this.$refs.breadcrumb.initBread(list)
      this.$refs.vpaasAllocate.$refs.breadcrumb.initBread(list)
      this.getClusterGatewayList()
      this.$refs.vpaasAllocate.getAllocatedDomainList()
    },
    // 点击树节点
    treeNodeClick(obj) {
      // 点击树联动面包屑
      this.organizationId = obj.data.payload.organizationId
      this.$refs.vpaasAllocate.organizationId = this.organizationId
      // 点击树联动面包屑
      if (this.tableSizes == 'IVS') {
        this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
        this.search_clear()
        this.handleFind()
      } else {
        this.$refs.vpaasAllocate.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
        this.$refs.vpaasAllocate.search_clear()
        this.$refs.vpaasAllocate.handleFind()
      }
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },
    setTreeRefresh(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },

    // 加载分配集群列表!
    getClusterGatewayList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId
      }
      if (this.isSearch) {
        Object.assign(data, this.searchForm)
      }
      this.$api.getClusterByOrgId(data).then(res => {
        if (res.clusterGatewayList && res.clusterGatewayList.length) {
          this.tableData = res.clusterGatewayList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          clusterCode: '',
          clusterName: '',
          gatewayIp: ''
        }
      }
    },
    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 分配集群网关
    handleAdd() {
      this.dialogFormVisible = true
    },

    // 取消分配
    handleDelete(row) {
      let data = {
        organizationId: this.organizationId,
        clusterCodes: [row.clusterCode],
        gatewayId: row.gatewayId
      }

      this.$confirm(this.$t('accessPlatform.cancelAllocation'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delOrganizationGateway(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.operatingSuccessContent')
              })
              this.getClusterGatewayList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledAllocation')
          })
        })
    },

    // boos开通使用
    handleEdit(row) {
      let data = {
        organizationId: this.organizationId,
        gatewayId: row.gatewayId
      }
      this.$api.modifyBossTag(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccessContent')
          })
          row.bossTag = row.bossTag == 0 ? 1 : 0
        }
      })
    },

    // 搜索!
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getClusterGatewayList()
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getClusterGatewayList()
    }
  }
}
</script>

<style lang="scss">
#cluster-allocate {
  .flex-item {
    width: 42%;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid transparent;
    .el-tabs__nav {
      border-bottom: 1px solid #409eff;
      border-color: #409eff;
    }
    .el-tabs__item.is-active {
      color: #fff;
      background: #409eff !important;
    }
    .el-tabs__item {
      color: #409eff;
      border-bottom: none;
      border-left: 1px solid #409eff;
      background: none !important;
    }
    .el-tabs__item:first-child {
      border-left: none;
    }
  }
}
</style>
