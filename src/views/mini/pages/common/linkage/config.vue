<template>
  <!-- 告警联动 -->
  <div id="linkage-config" class='base' v-if="isRouterAlive" ref="linkageConfig">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-search-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            delSearch="linkageConfig"
          />
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div class="btnMargin" style='margin-bottom:18px;'>
          <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
            {{ $t('alarmLinkage.addLinkage') }}
          </el-button>
          <el-button type="danger" @click="handleDel" :disabled="disabled" v-if="PermissionManage">
            {{ $t('public.batchDeletion') }}
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

          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            max-height="640"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            class="elTable"
            :element-loading-text="$t('public.loading')"
            
            border
            v-if="!loading && tableData.length"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('alarmLinkage.devId')"
              min-width="150"
              prop="deviceId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('alarmLinkage.devName')"
              prop="devName"
              show-overflow-tooltip
            />

            <el-table-column :label="$t('alarmLinkage.triggerCondition')" min-width="150">
              <template #default="{ row }">
                <el-dropdown v-if="row.alarmNames.length" class="dropdownTrigger" trigger="hover">
                  <span class="el-dropdown-link">
                    <span>{{ row.alarmNames.length > 0 ? row.alarmNames[0].name : '' }}</span>
                    <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu
                      v-if="row.alarmNames.length > 0"
                      style="max-height: 500px; overflow: auto"
                    >
                      <el-dropdown-item v-for="(item, index) in row.alarmNames" :key="index">
                        {{ item.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarmLinkage.action')" min-width="100">
              <template #default="{ row }">
                <el-dropdown class="dropdownTrigger" trigger="hover">
                  <span class="el-dropdown-link">
                    <span>{{ setActionType(row.actionList[0].actionType) }}</span>
                    <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(item, index) in row.actionList" :key="index">
                        {{ setActionType(item.actionType) }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('alarmLinkage.restrainTime')"
              min-width="80"
            >
              <template #default="{ row }">
                <span>
                  {{ setRestrainTime(row.restrainTime) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="110" prop="createTime" />
            <el-table-column :label="$t('public.updateTime')" min-width="110" prop="updateTime" />

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleEdit(row)" v-if="PermissionManage">
                  {{ $t('public.modify') }}
                </span>
                <span
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                  v-if="PermissionManage"
                >
                  {{ $t('public.delete') }}
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
            @pagination="getLinkageList"
          />
        </div>
      </el-col>
    </el-row>

    <LinkageForm
      v-model:visible="dialogFormVisible"
      :title="policyId ? $t('alarmLinkage.modifyLinkage') : $t('alarmLinkage.addLinkage')"
      :policy-id="policyId"
      :device-id="deviceId"
      @success="handleAfterSubmit"
    />
  </div>
</template>

<script>
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import { permissions } from '@/utils/common/permissions'
import LazySearchTree from '@/components/lazy-search-tree'
import Breadcrumb from '@/components/breadcrumb'
import LinkageForm from './components/linkage-form'
export default {
  components: {
    LazySearchTree,
    Breadcrumb,
    LinkageForm,
    ElIconArrowDown
  },
  name: 'AlarmLinkage',
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      disabled: true, //批量删除
      multipleSelection: [], //表格选中状态存放数组
      // 表格数据
      tableData: [],
      dataText: '',
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      policyId: '', //策略id 编辑
      deviceId: '', //设备id 编辑
      dialogFormVisible: false, // 添加或者编辑
      loading: false,
      //已选择的左侧树的设备id
      currentDeviceId: '',
      //获取的联动动作列表
      actionTypeList: []
    }
  },
  created() {
    this.getPermissions()
    this.getActionList()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(40)
    },
    async getActionList() {
      const res = await this.$api.getLinkageActionTypeList({})
      if (res.resultCode === 0) this.actionTypeList = res.actionTypeList
    },
    initData(list) {
      this.$refs.breadcrumb.initBread(list)
    },
    treeNodeClick(obj) {
      let { data, node } = obj
      if (data.type === '1') {
        return false
      }
      this.$refs.breadcrumb.treeLinkBread(data, node)
      this.currentDeviceId = data.id
      this.handleFind()
    },
    async handleFind() {
      this.pageNum = 1
      await this.getLinkageList()
    },
    //获取表格数据
    getLinkageList() {
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        deviceId: this.currentDeviceId || undefined
      }
      this.dataText = ''
      this.loading = true
      this.$api
        .getLinkagePolicyList(obj)
        .then(res => {
          if (res.policyList && res.policyList.length) {
            this.tableData = res.policyList
            this.totalNum = res.pageInfo.totalNum
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].devName = res.devName
            }
            this.$nextTick(() => {
              this.$refs.multipleTable?.setScrollTop(0)
            })
          } else {
            this.tableData = []
            this.totalNum = 0
            this.dataText = this.$t('public.noData')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    },
    setRestrainTime(val) {
      let restrainTime = ''
      if (val < 3600) {
        restrainTime =
          0 + this.$t('alarmLinkage.hours') + Math.floor(val / 60) + this.$t('alarmLinkage.minutes')
      } else {
        restrainTime =
          Math.floor(val / 3600) +
          this.$t('alarmLinkage.hours') +
          (val % 3600) / 60 +
          this.$t('alarmLinkage.minutes')
      }
      return restrainTime
    },
    setActionType(val) {
      let actionName = ''
      this.actionTypeList.forEach(item => {
        if (val === item.actionType) actionName = item.actionName
      })
      return actionName
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.disabled = this.multipleSelection.length === 0
    },
    // 添加
    handleAdd() {
      this.policyId = ''
      this.deviceId = ''
      this.dialogFormVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.policyId = row.policyId
      this.deviceId = row.deviceId
      this.dialogFormVisible = true
    },
    // 批量删除
    handleDel() {
      if (this.multipleSelection.length === 0) {
        this.$alert(this.$t('alarmLinkage.chooseLinkage'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm')
        })
      } else {
        this.$confirm(
          `${this.$t('alarmLinkage.deletePrompt', {
            num: this.multipleSelection.length
          })}`,
          `${this.$t('public.prompt')}`,
          {
            confirmButtonText: `${this.$t('public.confirm')}`,
            cancelButtonText: `${this.$t('public.cancel')}`,
            type: 'warning',
            closeOnClickModal: false
          }
        )
          .then(() => {
            this.$api
              .deleteLinkagePolicyInfo({
                policyIds: this.multipleSelection.map(item => item.policyId)
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.delSuccess')
                  })
                  this.handleFind()
                }
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          })
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('alarmLinkage.deleteLinkage'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteLinkagePolicyInfo({ policyIds: [row.policyId] }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.handleFind()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    async handleAfterSubmit(deviceId) {
      this.currentDeviceId = deviceId
      let expandKeys = []
      const res = await this.$api.locateInDeviceTree({
        nodeId: deviceId,
        nodeType: 2
      })
      if (res.resultCode === 0) {
        for (let i = 0; i < res.parents.length; i++) {
          if (expandKeys.indexOf(res.parents[i].parentId) === -1) {
            expandKeys.push(String(res.parents[i].parentId))
          }
        }
        this.$refs.lazyTree.searchFlag = true
        this.$refs.lazyTree.idArr = expandKeys
        this.$refs.lazyTree.currentKey = deviceId
        this.$refs.lazyTree.setNode()
      }
    }
  }
}
</script>

<style lang="scss">
#linkage-config {
  .el-dropdown {
    color: #fff;
    cursor: pointer;
    width: 100%;

    .el-dropdown-link {
      margin: auto;
      > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        max-width: calc(100% - 20px);
        vertical-align: middle;
      }

      i {
        vertical-align: middle;
      }
    }
  }
  .elTable {
    .dropdownTrigger {
      width: 100%;
      white-space: nowrap;
      display: inline-block;
    }
  }
}
</style>
