<template>
  <!-- 租户设备共享 -->
  <div id="dev-share" v-if="isRouterAlive" ref="tenantDevShare">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-search-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :treeApi="treeApi"
            :searchApi="searchApi"
            :locateApi="locateApi"
          />
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('tenantManage.devShare') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container"></div>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator=">" separator-class="el-icon-arrow-right" style="cursor: pointer">
            <el-breadcrumb-item @click.native="getShareDevices(currentTreeNode)">
              {{ $t('public.all') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in chooseGroups"
              :key="index"
              @click.native="seeLower(item)"
            >
              {{ item.label }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-table
          max-height="695"
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          :row-class-name="tableRowClassName"
          class="elTable"
          :element-loading-text="$t('public.loading')"
          
          :empty-text="$t('public.noData')"
          border
        >
          <el-table-column label width="50" type="selection" />
          <el-table-column :label="$t('tenantManage.id')">
            <template #default="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tenantManage.name')" min-width="70">
            <template #default="{ row }">
              <span :class="{ zoneName: row.type == 1 }" @click="seeLower(row)">
                {{ row.label }}
              </span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('tenantManage.type')" min-width="80">
            <template #default="{ row }">
              <span>{{ getMapType(row) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('tenantManage.belongTenant')" min-width="70">
            <template #default="{ row }">
              <span>{{ row.payload.belongTenantName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('public.state')" min-width="40">
            <template #default="{ row }">
              <span>
                {{
                  row.type == 1
                    ? ''
                    : row.payload.status == 1
                    ? $t('tenantManage.online')
                    : $t('tenantManage.offline')
                }}
              </span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('tenantManage.shareTime')" min-width="70">
            <template #default="{ row }">
              <span>{{ row.payload.shareTime }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('public.operating')" min-width="120">
            <template #default="{ row }">
              <span
                style="color: #10a9ff; cursor: pointer; margin-right: 10px"
                @click="seeLower(row)"
                v-show="row.type == 1"
              >
                {{ $t('tenantManage.subordinate') }}
              </span>
              <span
                style="color: #e4bd83; cursor: pointer"
                @click="sharePerms(row)"
                v-if="
                  ((row.type == 1 && row.payload.mapType == 2) || row.type == 2) && PermissionManage
                "
              >
                {{ $t('tenantManage.authorization') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <allocate-device></allocate-device>
    <share-permission :node="currentDeviceNode"></share-permission>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import allocateDevice from './component/allocate-device'
import sharePermission from './component/share-permission.vue'
import LazySearchTree from '@/components/lazy-search-tree'

export default {
  name: 'TenantDeviceShare',
  components: {
    allocateDevice,
    sharePermission,
    LazySearchTree
  },
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      choosedShareTime: '',
      // 条件搜索
      searchForm: {
        userName: ''
      },
      multipleSelection: [], //表格选中状态存放数组
      tableData: [], // 表格数
      loading: false,
      dialogVisible: false,
      shareDialogVisible: false,
      currentTreeNode: {}, //选中树节点
      chooseGroups: [],
      currentDeviceNode: {}, //当前选中的表格和租户用来查询共享
      newTenantId: '',
      treeApi: 'getTenantTree',
      searchApi: 'searchInTenantTree',
      locateApi: 'locateInTenantTree'
    }
  },
  created() {
    this.getPermissions()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(56)
    },
    // 加载树
    initData(list) {
      if (list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      } else {
        this.$nextTick().then(() => {
          this.idArr = [list[0].id]
          this.$refs.lazyTree.$refs.treeList.setCurrentKey(list[0].id)
        })
      }
    },

    // 点击组织树树节点
    treeNodeClick(data) {
      this.currentTreeNode = data.data
      this.getShareDevices(data.data)
    },
    // 设备类表查询
    searchtable() {
      this.getShareDevices(this.currentTreeNode)
    },
    //查询共享设备
    getShareDevices(data) {
      if (data.type == 1) {
        this.$message({
          message: this.$t('tenantManage.checkTenant'),
          type: 'warning'
        })
        return
      }
      this.chooseGroups = []
      this.loading = true
      let obj = {
        type: 1,
        tenantId: data.id
      }
      this.$api.getShareDeviceTree(obj).then(res => {
        this.loading = false
        this.tableData = res.nodeList
        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0)
        })
      })
    },

    //获取映射类型
    getMapType(row) {
      if (row.type == 1) {
        return row.payload.mapType == 1
          ? this.$t('tenantManage.nonMappingGroup')
          : this.$t('tenantManage.fullMappingGroup')
      } else {
        return row.payload.mapType == 1
          ? this.$t('tenantManage.independentAssociation')
          : this.$t('tenantManage.MappingAssociation')
      }
    },

    //设备分配
    handleAdd() {
      if (this.currentTreeNode.type != 2) {
        this.$message({
          message: this.$t('tenantManage.checkTenant'),
          type: 'warning'
        })
        return
      }
      this.newTenantId = this.currentTreeNode.id
      this.dialogVisible = true
    },

    //查看下级
    seeLower(row) {
      if (row.type == 2) {
        return
      }
      this.choosedShareTime = row.payload.shareTime
      this.loading = true
      let node = this.chooseGroups.find(item => item.id == row.id)
      if (node) {
        let index = this.chooseGroups.indexOf(node)
        this.chooseGroups = this.chooseGroups.slice(0, index + 1)
      } else {
        this.chooseGroups.push(row)
      }
      let obj = {
        type: 1,
        tenantId: this.currentTreeNode.id,
        parentId: row.id
      }
      this.$api.getShareDeviceTree(obj).then(res => {
        this.loading = false
        this.tableData = res.nodeList

        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].payload.shareTime) {
            this.tableData[i].payload.shareTime = this.choosedShareTime
          }
        }
      })
    },

    //共享分配
    sharePerms(row) {
      this.currentDeviceNode = { tenantId: this.currentTreeNode.id }
      row.type == 1
        ? (this.currentDeviceNode.groupId = row.id)
        : (this.currentDeviceNode.deviceId = row.id)
      this.currentDeviceNode.type = row.type
      this.shareDialogVisible = true
    },

    //模糊搜索共享设备
    searchShareDevice() {},
    // 表格斑马纹
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    }
  },
  computed: {
    iconSty(node) {
      return node => {
        if (node.type == 1 && node.payload.type == 1) {
          return 'aci-organization'
        } else {
          if (node.type == 1 && node.payload.type == 2) {
            return 'aci-x006-folder'
          } else if (node.type == 2) {
            return 'aci-organization'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/color.scss';
#dev-share {
  .btnMargin {
    display: flex;
    justify-content: space-between;
  }
  .breadcrumb {
    margin: 20px 0;
    cursor: pointer;
  }
  .el-breadcrumb__inner {
    color: $color25 !important;
    cursor: pointer !important;
  }

  .userName .el-form-item__content {
    width: 245px;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: $color24 !important;
  }
  .zoneName {
    cursor: pointer;
    color: $color26;
    padding-bottom: 1px solid $color23;
    border-bottom: 1px solid $color26;
    padding: 0 5px;
  }
}
</style>
