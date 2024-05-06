<template>
  <!-- 集群分配VPAAS -->
  <div id="vpaasAllocation">
    <div v-if="PermissionManage" class="btnMargin">
      <el-button type="primary" @click="handleAdd">{{ $t('Operations.assignClusters') }}</el-button>
    </div>
    <!-- //面包屑 -->
    <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
    <no-table :tableLoading="loading" :tableData="tableData">
      <!-- 表格 -->
      <el-table
        v-if="!loading && tableData.length"
        :max-height="tableHeight"
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
            <span>{{ row.domainCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('distribution.clusterName')"
          min-width="120"
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
              {{ row.enableDomain == '1' ? $t('Operations.enable') : $t('Operations.notEnabled') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('Operations.DomaincodeName')"
          min-width="120"
        >
          <template #default="{ row }">
            <span>{{ row.regionName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('Operations.platformName')"
          min-width="120"
        >
          <template #default="{ row }">
            <span>{{ row.platName }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="PermissionManage" :label="$t('public.operating')" min-width="120">
          <template #default="{ row }">
            <span class="danger cell-operate" @click="handleDelete(row)">
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
    </no-table>
    <allcate-colony v-model:visible="dialogVisible"></allcate-colony>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import judgeWindow from '@/mixin/judgeWindow'
import { defineAsyncComponent } from 'vue'
import breadcrumb from '@/components/breadcrumb' //面包屑
import allocateColony from './component/allcate-colony' //配置网关
export default {
  mixins: [judgeWindow],
  components: {
    breadcrumb,
    'allcate-colony': allocateColony
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //用户权限判断
      PermissionManage: true,
      searchForm: {
        domainCode: '',
        domainName: '',
        regionName: '',
        platName: ''
      },
      isSearch: false,
      screenFlag: true,
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标
      showManyCondition: false, // 高级搜索点击显示与隐藏
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      organizationId: '',
      tableHeight: window.innerHeight - 290,
      dialogVisible: false
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.pageResize()
    this.changeHeight()
  },
  methods: {
    changeHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - 290
      }, 100)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(91)
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1816)
    },
    search_change() {
      this.isSearch = false
    },
    // 搜索!
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getAllocatedDomainList()
    },
    //重置
    handleReset() {
      this.searchForm = {
        domainCode: '',
        domainName: '',
        regionName: '',
        platName: ''
      }
      this.pageNum = 1
      this.pageSize = 10
      this.getAllocatedDomainList()
    },
    //分配集群
    handleAdd() {
      this.dialogVisible = true
    },
    getAllocatedDomainList() {
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
      } else {
        this.search_clear()
      }
      this.$api.getAllocatedDomainList(data).then(res => {
        if (res?.allocatedDomainList && res?.allocatedDomainList.length) {
          this.tableData = res.allocatedDomainList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight =
        this.showManyCondition && !this.screenFlag
          ? window.innerHeight - 340
          : window.innerHeight - 290
    },
    // 面包屑联动树
    tree_change(data) {
      this.$emit('setTreeRefresh', data)
    },
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          domainCode: '',
          domainName: '',
          regionName: '',
          platName: ''
        }
      }
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getAllocatedDomainList()
    },
    // 取消分配
    handleDelete(row) {
      this.$confirm(this.$t('accessPlatform.cancelAllocation'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            organizationId: this.organizationId,
            domainCode: row.domainCode,
            regionCode: row.regionCode
          }

          this.$api.cancelAllocateDomain(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.operatingSuccess')
              })
              this.getAllocatedDomainList()
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
        domainCode: row.domainCode,
        regionCode: row.regionCode
      }
      this.$api.modifyVpsBossTag(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccess')
          })
          this.getAllocatedDomainList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#vpaasAllocation {
  .search-form .flexstart {
    width: calc(100% - 250px);
  }
}
</style>
