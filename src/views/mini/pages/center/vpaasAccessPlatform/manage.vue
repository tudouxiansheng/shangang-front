<!--接入平台管理-->
<template>
  <div v-if="isRouterAlive" id="vpaas-access-platform" ref="vpaasAccessPlatform">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNode"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="aci iconCss"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <!-- 查询和其他操作 -->
      <el-col :span="20" style="padding: 0px 20px">
        <div class="btnMargin">
          <el-button type="primary" @click="handleAdd">{{ $t('public.add') }}</el-button>
          <el-button type="danger" @click="handleDel" :disabled="delShow">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '184px' : '84px'"
            ref="form"
            :model="queryParams"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('public.platName') + ':'">
                <el-input
                  v-model="queryParams.platformName"
                  clearable
                  :placeholder="$t('public.pleaseInputplatName')"
                />
              </el-form-item>
              <el-form-item :label="$t('accessPlatform.platformStatus') + ':'">
                <el-select v-model="queryParams.platformStatus" clearable>
                  <el-option
                    v-for="(item, index) in platformStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <el-button class="miniBtn" @click="handleRest">{{ $t('public.reset') }}</el-button>
            </div>
          </el-form>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          element-loading-spinner="el-icon-loading"
        >
          <div v-show="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <!-- 表格 -->
          <el-table
            :max-height="tableHeight"
            v-show="!loading && tableData.length"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('accessPlatform.accessPlatformNumber')"
              prop="platId"
              show-overflow-tooltip
              width="180"
            />
            <el-table-column
              :label="$t('accessPlatform.accessPlatformName')"
              prop="platName"
              show-overflow-tooltip
              width="160"
            />
            <el-table-column
              :label="$t('accessPlatform.accessPlatformStatus')"
              show-overflow-tooltip
              :width="locale == 'en' ? 180 : 100"
            >
              <template #default="{ row }">
                <span :class="setStatusClass(row.status)">
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarmTypeManage.whetherToEnable')"
              show-overflow-tooltip
              :width="locale == 'en' ? 180 : 100"
            >
              <template #default="{ row }">
                <span>{{ setEnable(row.enable) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('accessPlatform.platformAddress')"
              show-overflow-tooltip
              width="180"
              prop="platIp"
            />
            <el-table-column
              :label="$t('accessPlatform.organization')"
              prop="organizationName"
              show-overflow-tooltip
              :width="locale == 'en' ? 150 : 100"
            />
            <el-table-column
              :label="$t('accessPlatform.lastEditTime')"
              prop="updateTime"
              show-overflow-tooltip
              :min-width="locale == 'en' ? 120 : 90"
            />

            <el-table-column
              :label="$t('public.operating')"
              :min-width="locale == 'en' ? 170 : 100"
            >
              <template #default="{ row }">
                <span class="cell-operate" @click="handleView(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleUpdate(row)">
                  {{ $t('public.modify') }}
                </span>
                <el-dropdown trigger="click" @command="handleCommand">
                  <span style="color: #10a9ff; cursor: pointer; font-size: 12px">
                    {{ $t('public.moreActions') }}
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'sta')">
                        <span style="color: #10a9ff">{{ $t('accessPlatform.changeRecord') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'ena')">
                        <span :style="{ color: row.enable === 0 ? '#10a9ff' : '#ff6b6b' }">
                          {{ row.enable == 0 ? $t('public.enable') : $t('public.deactivate') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'del')">
                        <span style="color: #ff6b6b">{{ $t('public.delete') }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="!loading && tableData.length"
            :total="total"
            v-model:pageNum="queryParams.pageInfo.pageNum"
            v-model:limit="queryParams.pageInfo.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <access-platform-add></access-platform-add>
    <access-platform-detail></access-platform-detail>
    <status-log></status-log>
    <!-- 批量操作 -->
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="multipleSelection"
      :what="$t('public.batchDeletionContent')"
      :operate="$t('public.batchDeletionContent')"
      batchApi="deleteVpaasPlatformInfo"
      whatId="platId"
      whatName="platName"
      v-model:loading="loading"
      @searchClear="search_clear"
      @getList="getList"
    />
  </div>
</template>

<script>
import accessPlatformAdd from './component/access-platform-add'
import accessPlatformDetail from './component/access-platform-detail'
import statusLog from './component/status-log'
import breadcrumb from '@/components/breadcrumb'
import getLazyTree from '@/mixin/getLazyTree.js'
import batchOperate from '@/components/batchOperate'
export default {
  mixins: [getLazyTree],
  name: 'VpaasAccessPlatformManagement',
  components: {
    accessPlatformAdd,
    accessPlatformDetail,
    statusLog,
    breadcrumb,
    'batch-operate': batchOperate
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      organizationId: '',
      organizationName: '',

      delShow: true,

      tableHeight: 630,
      dataText: '',
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        platformName: undefined,
        platformStatus: undefined
      },
      loading: false,
      multipleSelection: [],
      tableData: [], // 表格数据

      //接入平台
      dialogFormVisible: false,
      operation: true,
      maskloading: false,
      dataForm: {},
      isSearch: false,

      dialogFormVisible_detail: false,
      platformStatusList: [
        {
          name: this.$t('newAccess.online'),
          value: 1
        },
        {
          name: this.$t('newAccess.offline'),
          value: 2
        }
      ],
      accessAuthTypeList: [],
      dialogFormVisible_status: false,
      enableList: [
        {
          name: this.$t('public.deactivate'),
          value: 0
        },
        {
          name: this.$t('public.enable'),
          value: 1
        }
      ],
      platTypeList: [
        {
          value: 1,
          name: this.$t('accessPlatform.superior')
        },
        {
          value: 2,
          name: this.$t('accessPlatform.subordinate')
        }
      ],
      characterSetList: [
        {
          name: 'gb2312',
          value: 'gb2312'
        },
        {
          name: 'utf-8',
          value: 'utf-8'
        }
      ],
      networkTypeList: [
        {
          name: this.$t('accessPlatform.publicNetwork'),
          value: 'public'
        },
        {
          name: this.$t('accessPlatform.privateNetwork'),
          value: 'private'
        }
      ],
      transProtocolList: [
        {
          name: 'TCP',
          value: 1
        },
        {
          name: 'UDP',
          value: 2
        }
      ],
      catalogSizeList: [
        {
          name: 1,
          value: 1
        },
        {
          name: 2,
          value: 2
        },
        {
          name: 4,
          value: 4
        },
        {
          name: 8,
          value: 8
        }
      ],
      vpaasPlatIdList: [],
      batchDialogVisible: false,
      operate: undefined,
      batchApi: undefined,
      choosedPlatformId: undefined
    }
  },
  methods: {
    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        setTimeout(() => {
          this.$refs.breadcrumb.initBread(list)
        }, 100)
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.organizationName = list[0].payload.organizationName
          this.organizationId = list[0].payload.organizationId
          this.queryParams.organizationId = list[0].payload.organizationId
          await this.getList()
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)
      this.organizationName = data.payload.organizationName
      this.organizationId = data.payload.organizationId
      this.queryParams.organizationId = data.payload.organizationId
      this.handleFind()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    search_clear() {
      if (!this.isSearch) {
        this.queryParams.platformName = ''
        this.queryParams.platformStatus = ''
      }
    },
    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      }
    },
    setPlatType(val) {
      return this.selectDictLabel(this.platTypeList, val, {
        key: 'name',
        value: 'value'
      })
    },
    setEnable(val) {
      return this.selectDictLabel(this.enableList, val, {
        key: 'name',
        value: 'value'
      })
    },
    setStatus(val) {
      return this.selectDictLabel(this.platformStatusList, val, {
        key: 'name',
        value: 'value'
      })
    },
    handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      this.isSearch = true
      this.getList()
    },
    handleRest() {
      this.queryParams.platformName = ''
      this.queryParams.platformStatus = ''
    },
    async getList() {
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      let res = await this.$api.selectVpaasPlatformList(queryParams)
      this.loading = true
      if (res.resultCode == 0 && res.platList && res.platList.length > 0) {
        this.tableData = res.platList
        this.total = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /** 表格多选框选中数据 */
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
    },
    handleAdd() {
      this.operation = true
      this.dialogFormVisible = true
    },
    /** 详情按钮操作 */
    async handleView(row) {
      await this.getInfo(row)
      this.dialogFormVisible_detail = true
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      if (row.enable === 1) {
        return this.$message({
          type: 'warning',
          message: this.$t('accessPlatform.stopPlat')
        })
      }
      await this.getInfo(row)
      this.operation = false
      this.dialogFormVisible = true
    },

    async getInfo(row) {
      let res = await this.$api.getVpaasPlatformInfo({ platId: row.platId })
      if (res.resultCode != 0) return
      this.dataForm = {
        accessPassword: undefined,
        ...res
      }
    },
    // 更多操作
    handleCommand(command) {
      switch (command.command) {
        case 'del':
          this.handleDelete(command.row)
          break
        case 'sta':
          this.getStaChange(command.row)
          break
        case 'ena':
          this.enable(command.row)
          break
      }
    },
    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },
    //状态变更记录
    getStaChange(row) {
      this.choosedPlatformId = row.thirdPlatformId
      this.dialogFormVisible_status = true
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.enable === 1) {
        return this.$message({
          type: 'warning',
          message: this.$t('accessPlatform.stopPlat')
        })
      }
      this.$confirm(this.$t('accessPlatform.isContainer'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteVpaasPlatformInfo({ platId: row.platId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getList()
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
    enable(row) {
      let enable = row.enable === 1 ? 0 : 1
      this.$api
        .modifyVpaasPlatformEnable({
          platId: row.platId,
          enable: enable
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.getList()
            this.$message({
              type: 'success',
              message:
                row.enable == 1
                  ? this.$t('accessPlatform.deactivatedSuccessfully')
                  : this.$t('accessPlatform.enabledSuccessfully')
            })
          }
        })
    },
    // 批量删除 ！
    handleDel() {
      this.$confirm(
        this.$t('accessPlatform.deletePrompt', { num: this.multipleSelection.length }),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.loading = true
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    async getVpaasPlatIdList(organizationId, platformStatus = 1) {
      const obj = {
        organizationId: organizationId,
        platAbility: 'SURVEILLANCE',
        platformType: 16,
        platformStatus,
        pageInfo: { pageNum: 1, pageSize: 5000 }
      }
      const res = await this.$api.selectAccessPlatforms(obj)
      if (res.resultCode === 0 && res.platformList) {
        this.vpaasPlatIdList = res.platformList
      } else {
        this.vpaasPlatIdList = []
      }
    }
  }
}
</script>

<style lang="scss">
#vpaas-access-platform {
  width: 100%;
  height: 100%;

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .el-dropdown {
    font-size: 14px;
  }
  .el-table__footer-wrapper,
  .el-table__header-wrapper {
    overflow: hidden;
  }
}
</style>
