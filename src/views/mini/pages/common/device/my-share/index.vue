<template>
  <!-- 我的共享设备 -->
  <div id="myShareDev" v-if="allDivShow && isRouterAlive" ref="myShareDev">
    <el-row style="height: 560px">
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              v-loading="treeLoading"
              :props="organizationTreeProps"
              @node-click="handleNodeClick"
              :load="loadNode"
              node-key="id"
              lazy
              :default-expanded-keys="defaultKeys"
              highlight-current
              :current-node-key="currentDefaultKey"
              ref="treeList"
              @node-expand="expandNode"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" style="padding: 20px 30px 0">
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

        <div class="orgTable">
          <p style="color: #fff">{{ $t('myShare.needManualMove') }}</p>
          <el-table
            ref="multipleTable_org"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            
            :data="tableData_org"
            row-class-name="success-row"
            class="elTable"
            max-height="500"
            border
          >
            <el-table-column show-overflow-tooltip :label="$t('myShare.orgID')" prop="label">
              <template #default="{ row }">
                <span>{{ row.payload.organizationId }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('myShare.orgName')" prop="label">
              <template #default="{ row }">
                <span>{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('myShare.belongsTenant')"
              prop="label"
            >
              <template #default="{ row }">
                <span>{{ row.payload.belongTenantName }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('myShare.type')" prop="label">
              <template #default="{ row }">
                <span>{{ getMapType(row) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('myShare.shareTime')" prop="label">
              <template #default="{ row }">
                <span>{{ row.payload.shareTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" prop="label" v-if="PermissionManage">
              <template #default="{ row }">
                <span class="cell-operate" @click="moveToOrg(row)">
                  {{ $t('myShare.MoveToOrg') }}
                </span>
                <span class="cell-operate danger" @click="cancalShareDevice(row)">
                  {{ $t('myShare.shareCsncel') }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="position: relative; height: 54px">
          <div class="chooseAll">
            <el-button type="primary" @click="chooseDevMoveOrg" v-if="PermissionManage">
              {{ $t('myShare.batchDevMove') }}
            </el-button>
            <el-button type="danger" @click="chooseCancelShare" v-if="PermissionManage">
              {{ $t('myShare.shareCsncel') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: 0px">
            <el-autocomplete
              v-model="searchForm.deviceName"
              :fetch-suggestions="searchDevice"
              :placeholder="$t('tenantManage.equipmentPrompt')"
              @select="handleSelect"
              class="inputMiddle"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </div>
        </div>

        <div
          style="height: 595px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <pl-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            max-height="500"
            @selection-change="handleSelectionChange"
            border
          >
            <pl-table-column label width="50" type="selection"></pl-table-column>
            <pl-table-column
              show-overflow-tooltip
              :label="$t('deviceCamera.cameraId')"
              prop="id"
              useSlot
            >
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </pl-table-column>
            <pl-table-column
              show-overflow-tooltip
              :label="$t('deviceCamera.cameraName')"
              prop="label"
              useSlot
            >
              <template #default="{ row }">
                <span>{{ row.label }}</span>
              </template>
            </pl-table-column>

            <pl-table-column show-overflow-tooltip :label="$t('myShare.belongsTenant')" useSlot>
              <template #default="{ row }">
                <span>{{ row.payload.belongTenantName }}</span>
              </template>
            </pl-table-column>
            <pl-table-column show-overflow-tooltip :label="$t('myShare.type')" useSlot>
              <template #default="{ row }">
                <span>{{ setDevType(row.payload.deviceType) }}</span>
              </template>
            </pl-table-column>
            <pl-table-column show-overflow-tooltip :label="$t('public.state')" useSlot>
              <template #default="{ row }">
                <span :class="row.payload.status == 1 ? 'success' : 'danger'">
                  {{
                    row.payload.status == 1 ? $t('tenantManage.online') : $t('tenantManage.offline')
                  }}
                </span>
              </template>
            </pl-table-column>
            <pl-table-column
              show-overflow-tooltip
              :label="$t('myShare.ifAllocateOrgAgain')"
              useSlot
            >
              <template #default="{ row }">
                <span>{{ row.label }}</span>
              </template>
            </pl-table-column>
            <pl-table-column show-overflow-tooltip :label="$t('myShare.shareTime')" useSlot>
              <template #default="{ row }">
                <span>{{ row.payload.shareTime }}</span>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </el-col>
    </el-row>

    <!-- 组织变更弹框 -->
    <el-dialog
      draggable
      :title="$t('myShare.allocateAgain')"
      v-model="orgChangeShow"
      width="820px"
      :close-on-click-modal="false"
      class="org_change"
    >
      <div id="orgTree1">
        <el-tree
          ref="treeList_org"
          node-key="id"
          v-loading="treeLoading"
          highlight-current
          :props="organizationTreeProps"
          :expand-on-click-node="false"
          @node-click="handleNodeMove"
          :load="loadNode_org"
          lazy
          :default-expanded-keys="idArr_org"
          :empty-text="treeEmptyText"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconSty(data)" class="iconCss1 aci"></i>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orgChangeShow = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitOrgChange">{{ $t('public.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import devDict from '@/mixin/dev-dict.js'

import breadcrumb from '@/components/breadcrumb' //面包屑

export default {
  name: 'MySharedDevice',
  mixins: [devDict],
  components: {
    breadcrumb
  },
  data() {
    return {
      PermissionManage: true,
      choosedParentId: '',
      treeEmptyText: '',
      rootId: null, //根组织id
      idArr_org: [],
      isRouterAlive: true,
      moveDevOrOrg: 1,
      movingOrgId: '',
      checkedDevicesIds: [],
      allDivShow: true,
      loginBelongTenantId: '',
      targetParent: '',
      moveTenantId: '',
      orgChangeShow: false,
      orgTreeData: [],
      ifShowCancelShare: true,
      choosedShareTime: '',
      choosedMapType: 1,
      tableData_org: [],
      organizationData: [], // 组织树
      treeLoading: false,
      // tree配置项
      organizationTreeProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      defaultKeys: [],
      currentDefaultKey: '',
      // 条件搜索
      searchForm: {
        deviceName: ''
      },
      treeData: [], //树节点data
      multipleSelection: [], //表格选中状态存放数组
      tableData: [], // 表格数据
      loading: false,
      checkedOrganize: false,
      checkedCameras: [],
      checkAll: false,
      isIndeterminate: false,
      ifDisable: false,
      ifDisable2: false,
      allIds: [],
      dialogVisible2: this.dialogVisible,
      zoneList: [], //存放组织
      cameras: {}, //存放镜头
      chooseOrganizeAll: {}, //存放手动选中的镜头
      currentNode: {},
      zones: {}, //存放所有组织
      hasParentChoose: false,
      defaultOrganizeAll: {},
      ifOpenTips: false,
      expandIndex: -1,
      parentIds: [], //存放所有搜索出来的父亲
      allParentIds: [],
      choosedSelectBySearch: {} //存放搜索选择的
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setData()
    },
    dialogVisible() {
      this.dialogVisible2 = this.dialogVisible
      this.setData()
    },
    tableData() {
      if (this.tableData && this.tableData.length) {
        this.allIds = Array.from(this.tableData, item => item.id)
      }
    },
    node() {
      this.findTreeData('')
    }
  },
  created() {
    this.getPermissions()
    this.getLoginTenantId()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(56)
    },

    getLoginTenantId() {
      this.$api.getLoginUserInfo({}).then(res => {
        if (res.resultCode == 0) {
          this.loginBelongTenantId = res.userInfo.belongTenantId
        }
      })
    },
    handleSelectionChange(val) {
      this.checkedDevicesIds = val
    },

    //搜索共享树
    searchShareDevTree() {},
    //移动到组织
    moveToOrg(row) {
      this.moveDevOrOrg = 1
      this.orgChangeShow = true
      this.fromParent = row.payload.parentId
      this.moveTenantId = row.payload.id
      this.movingOrgId = row.payload.organizationId
    },
    // 点击组织变更树节点
    handleNodeMove(data) {
      this.targetParent = data.payload.organizationId
    },
    //移动组织
    submitOrgChange() {
      let obj = {}
      obj.fromParent = this.fromParent
      obj.targetParent = this.targetParent
      obj.tenantId = this.loginBelongTenantId
      if (this.moveDevOrOrg == 1) {
        obj.groupId = this.movingOrgId
      } else if (this.moveDevOrOrg == 2) {
        let deviceIds = []
        for (let i = 0; i < this.checkedDevicesIds.length; i++) {
          deviceIds.push(this.checkedDevicesIds[i].payload.deviceId)
        }
        obj.deviceIds = deviceIds
      }
      this.$api.MoveSharedDevices(obj).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('myShare.moveSucc')
          })

          this.getTableList()
          this.orgChangeShow = false
        }
      })
    },
    getTableList() {
      this.loading = true
      this.$api.getShareDeviceTree({ type: 1, parentId: this.choosedParentId }).then(res => {
        if (res.resultCode == 0) {
          let cameras = []
          cameras = res.nodeList.filter(item => item.type == 2)
          this.tableData = cameras
          if (this.tableData) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (!this.tableData[i].payload.shareTime) {
                this.tableData[i].payload.shareTime = this.choosedShareTime
              }
            }
          }
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    //取消共享按钮
    chooseCancelShare() {
      if (this.choosedMapType == 2) {
        this.$message({
          message: this.$t('tenantManage.shareWarning'),
          type: 'warning'
        })
        return
      }
      if (this.checkedDevicesIds.length == 0) {
        this.$message({
          message: this.$t('myShare.chooseDevFirst'),
          type: 'warning'
        })
        return
      }
      let deviceIds = []
      for (let i = 0; i < this.checkedDevicesIds.length; i++) {
        deviceIds.push(this.checkedDevicesIds[i].payload.deviceId)
      }
      let obj = {
        tenantId: this.loginBelongTenantId,
        cancelList: [
          {
            groupId: this.tableData_org[0].payload.organizationId,
            deviceIds: deviceIds
          }
        ]
      }
      this.$confirm(this.$t('myShare.ifCancelChoosedAllocate'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.shareDeviceToTenant(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                message: this.$t('tenantManage.cancelShareSuccess'),
                type: 'success'
              })
              this.allDivShow = false
              this.$nextTick(() => {
                this.allDivShow = true
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('myShare.operationCanceled')
          })
        })
    },
    //批量设备移动
    chooseDevMoveOrg() {
      this.moveDevOrOrg = 2
      if (this.checkedDevicesIds.length == 0) {
        this.$message({
          message: this.$t('myShare.chooseDevFirst'),
          type: 'warning'
        })
        return
      }
      this.orgChangeShow = true
      this.fromParent = this.tableData_org[0].payload.parentId
      this.movingOrgId = this.tableData_org[0].payload.organizationId
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
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? 'dialogRow' : 'success-row dialogRow'
    },
    iconSty(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci-organization'
      } else {
        if (node.type == 1) {
          return 'aci-x006-folder'
        } else {
          return 'aci-x006-folder'
        }
      }
    },
    closeFun() {
      this.$parent.dialogVisible = false
    },
    // 获取菜单树
    async findTreeData(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parentId) : null
      await this.$api.getShareDeviceTree(data).then(res => {
        list = res.nodeList || []

        this.organizationData = list
        this.zoneList = this.organizationData.filter(item => item.type == 1)
        if (parentId) {
          this.cameras[parentId] = this.organizationData.filter(item => item.type == 2)
        } else {
          if (list[0]) {
            this.cameras[list[0].id] = this.organizationData.filter(item => item.type == 2)
          }
        }

        if (!parentId) {
          if (list[0]) {
            //初始化面包屑
            setTimeout(() => {
              this.$refs.breadcrumb.initBread(list)
            }, 100)
            this.defaultKeys = [list[0].id]
            this.currentDefaultKey = list[0].id
            this.currentNode = list[0]
            this.zones[list[0].id] = list[0]

            this.choosedParentId = list[0].id
          }
        } else {
          if (!this.zones[parentId]) {
            this.zones[parentId] = this.currentNode
          }
        }

        if (this.currentNode.id) {
          this.chooseChildByParent(this.currentNode)
        }
      })
      if (list) {
        if (level == 0 && list.length) {
          this.$nextTick(async () => {
            this.$refs.treeList.setCurrentKey(list[0].id)
            await this.getTableList_init()
          })
        }
      }
    },
    getTableList_init() {
      this.loading = true
      this.tableData = this.cameras[this.currentNode.id]
      if (this.tableData) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].payload.shareTime) {
            this.tableData[i].payload.shareTime = this.choosedShareTime
          }
        }
      }
      if (this.tableData_org) {
        if (this.tableData_org.length == 0) {
          if (this.organizationData[0]) {
            this.tableData_org = [this.organizationData[0]]
          }
          if (this.tableData_org[0]) {
            if (this.tableData_org[0].payload.mapType == 2) {
              this.ifShowCancelShare = false
            }
          }
        }
      }
      this.loading = false
    },
    //懒加载
    async loadNode(node, resolve) {
      if (node.level === 0) {
        await this.findTreeData(node.level, '', resolve)
        return resolve(this.zoneList)
      } else {
        await this.findTreeData(node.level, node.data.id, resolve)
        resolve(this.zoneList)
      }
    },

    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick(() => {
          this.idArr_org = [list[0].id]
          this.rootId = list[0].payload.organizationId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    async loadNode_org(node, resolve) {
      if (node.level == 0) {
        this.getTree(node.level, '', resolve)
      } else {
        this.getTree(node.level, node.data.id, resolve)
      }
    },

    //默认选中模糊搜索选中的
    getSearchNode() {
      if (this.expandIndex != -1 && this.expandIndex < this.parentIds.length - 1) {
        this.expandIndex++
        let index = this.allParentIds.indexOf(this.parentIds[this.expandIndex])
        this.currentNode = {
          id: this.parentIds[this.expandIndex],
          payload: { parentId: this.allParentIds[index - 1] }
        }
        this.defaultKeys = [this.parentIds[this.expandIndex]]
      } else {
        if (this.expandIndex != -1) {
          if (this.choosedSelectBySearch.type == 1) {
            this.currentNode = {
              id: this.choosedSelectBySearch.id,
              payload: { parentId: this.allParentIds[this.expandIndex] }
            }
            this.defaultKeys = [this.choosedSelectBySearch.id]
            this.$refs.treeList.setCurrentKey(this.choosedSelectBySearch.id)
          } else {
            this.$refs.treeList.setCurrentKey(this.parentIds[this.expandIndex])
            this.$nextTick(() => {
              this.highLightDevice()
            })
          }
        }
      }
    },

    // 点击组织树树节点
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)

      this.choosedParentId = data.id
      if (node.parent.data) {
        if (node.parent.data.payload.mapType == 1) {
          this.ifShowCancelShare = true
        } else if (node.parent.data.payload.mapType == 2) {
          this.ifShowCancelShare = false
        }
      }

      this.choosedShareTime = data.payload.shareTime
      this.choosedMapType = data.payload.mapType
      this.tableData_org = [data]
      this.isIndeterminate = false
      this.searchForm.deviceName = ''
      this.currentNode = data
      this.expandIndex = -1
      this.ifOpenTips = false
      this.defaultKeys = [data.id]

      this.getTableList()
      if (this.cameras[data.id]) {
        this.chooseChildByParent(data)
      }
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    //判断父节点是否选中
    async getTreeNode(nodeId) {
      this.hasParentChoose = false
      let hasParentChoose = false
      let node = {}
      let count = 0
      for (var zone in this.zones) {
        if (zone == nodeId) {
          count++
          node = this.zones[zone]
          if (this.chooseOrganizeAll[zone]) {
            hasParentChoose = true
            this.hasParentChoose = true
          }
        }
      }
      if (count > 0) {
        if (!hasParentChoose) {
          this.getTreeNode(node.payload.parentId)
        }
      }
    },

    //刪除子节点默认选中的
    deleteChildren(nodeId) {
      let count = 0
      let node = {}
      for (var zone in this.zones) {
        if (this.zones[zone].payload.parentId == nodeId) {
          count++
          node = this.zones[zone]
          if (this.chooseOrganizeAll[zone]) {
            delete this.chooseOrganizeAll[zone]
          }
        }
      }
      if (count > 0) {
        this.deleteChildren(node.id)
      }
    },
    //节点展开
    expandNode(node) {
      this.zones[node.id] = node
    },
    //父节点选中，默认选中子节点
    chooseChildByParent(data) {
      //当前手动选中，则不置灰
      if (this.chooseOrganizeAll[data.id]) {
        this.ifDisable2 = false
        this.checkedOrganize = true
        this.checkedCameras = this.chooseOrganizeAll[data.id]
        this.ifDisable = true
        this.checkAll = true
      } else {
        //父亲有选中的，则当前选中，并置灰
        this.getTreeNode(data.payload.parentId)
        if (this.hasParentChoose) {
          this.ifDisable2 = true
          this.checkedOrganize = true
          this.ifDisable = true
          this.cameras[data.id]
            ? (this.checkedCameras = Array.from(this.cameras[data.id], item => item.id))
            : null
          this.checkAll = true
        } else {
          this.ifDisable2 = false
          this.checkedOrganize = false
          this.checkedCameras = []
          this.ifDisable = false
          this.checkAll = false
        }
      }
    },
    handleCheckAllChange(val) {
      this.ifOpenTips = true
      this.checkedCameras = val ? this.allIds : []
      this.isIndeterminate = false
    },
    handleCheckedCameraChange() {
      this.ifOpenTips = true
      let checkedCount = this.checkedCameras.length
      this.checkAll = checkedCount === this.tableData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length
    },
    //选中子组织置灰选中
    chooseOrganize(val) {
      this.ifOpenTips = true
      let node = this.$refs.treeList.getCurrentNode()
      if (val) {
        this.checkedCameras = this.allIds
        this.checkAll = true
        this.ifDisable = true
        if (!this.ifOpenTips) {
          this.chooseOrganizeAll[node.id] = this.allIds
        }
      } else {
        this.checkedCameras = []
        this.checkAll = false
        this.ifDisable = false
        if (!this.ifOpenTips) {
          delete this.chooseOrganizeAll[node.id]
        }
      }
    },
    //查询租户共享设备详情，用来默认选中
    async getShareDevicesDetail(data) {
      let obj = {
        targetTenantId: this.node.id,
        organizationId: data.id
      }
      await this.$api.getTenantShareDetail(obj).then(res => {
        let mapType = res.mapType
        if (mapType == 2) {
          //全映射
          this.checkedCameras = this.cameras[data.id]
            ? Array.from(this.cameras[data.id], item => item.id)
            : null
          this.checkedOrganize = true
          this.ifDisable = true
          this.checkAll = true
          this.chooseOrganizeAll[data.id] = this.cameras[data.id]
            ? Array.from(this.cameras[data.id], item => item.id)
            : null
          this.getTreeNode(data.payload.parentId)
          if (this.hasParentChoose) {
            this.ifDisable2 = true
          }
        } else if (mapType == 1) {
          //设备映射
          this.ifDisable = false
          this.checkedOrganize = false
          this.checkedCameras = res.deviceIds ? res.deviceIds : []
          delete this.chooseOrganizeAll[data.id]
          this.deleteChildren(data.id)
        } else {
          //没有映射，还原
          this.getTreeNode(data.payload.parentId)
          if (!this.hasParentChoose) {
            this.ifDisable = false
            this.checkedOrganize = false
            this.ifDisable2 = false
            this.checkedCameras = []
            this.checkAll = false
          }
          delete this.chooseOrganizeAll[data.id]
          this.deleteChildren(data.id)
        }
        this.defaultOrganizeAll[data.id] = {
          mapType,
          checkedCameras: this.checkedCameras
        }
      })
    },

    //分配设备
    shareDevice() {
      if (!this.ifDisable2) {
        this.ifOpenTips = false
        let defaultNode = this.defaultOrganizeAll[this.currentNode.id]
        let cancelList = { groupId: this.currentNode.id }
        let allocateList = { groupId: this.currentNode.id }
        //原先有映射关系
        if (defaultNode.mapType != 0) {
          if (defaultNode.mapType == 2) {
            //证明取消了原先的全映射
            if (!this.checkedOrganize) {
              cancelList.type = 1
              if (this.checkedCameras.length) {
                allocateList.type = 0
                allocateList.deviceIds = this.checkedCameras
              }
            }
          } else if (defaultNode.mapType == 1) {
            if (this.checkedOrganize) {
              allocateList.type = 1
              cancelList.type = 0
              cancelList.deviceIds = defaultNode.checkedCameras
            } else {
              let a = defaultNode.checkedCameras
              let b = this.checkedCameras
              let c = []
              b.forEach(item => {
                if (!a.find(cameraId => item == cameraId)) {
                  c.push(item)
                } else {
                  a.splice(a.indexOf(item), 1)
                }
              })
              if (a.length) {
                cancelList.type = 0
                cancelList.deviceIds = a
              }
              if (c.length) {
                allocateList.type = 0
                allocateList.deviceIds = c
              }
            }
          }
        } else {
          allocateList.type = this.checkedOrganize ? 1 : 0
          if (!this.checkedOrganize) {
            if (this.checkedCameras.length) {
              allocateList.deviceIds = this.checkedCameras
            } else {
              allocateList.type = undefined
            }
          }
        }
        let obj = {
          tenantId: this.node.id
        }
        if (allocateList.type != undefined) {
          obj.allocateList = []
          obj.allocateList.push(allocateList)
        } else {
          obj.allocateList = []
        }
        if (cancelList.type != undefined) {
          obj.cancelList = []
          obj.cancelList.push(cancelList)
        } else {
          obj.cancelList = []
        }
        this.$api.shareDeviceToTenant(obj).then(res => {
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('tenantManage.shareSuccess'),
              type: 'success'
            })
            this.getShareDevicesDetail(this.currentNode)
            this.$parent.dialogVisible = false
            this.treeData = this.$parent.currentTreeNode
            this.$parent.getShareDevices(this.treeData)
          }
        })
      } else {
        this.$message({
          message: this.$t('tenantManage.shareWarning'),
          type: 'warning'
        })
      }
    },

    //取消分配
    cancalShareDevice(row) {
      if (this.ifShowCancelShare) {
        let obj = {
          tenantId: this.loginBelongTenantId,
          cancelList: [{ groupId: row.payload.organizationId, deviceIds: [] }]
        }

        this.$confirm(this.$t('myShare.ifCancelThisAllocate'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api.shareDeviceToTenant(obj).then(res => {
              if (res.resultCode == 0) {
                this.$message({
                  message: this.$t('tenantManage.cancelShareSuccess'),
                  type: 'success'
                })
                this.allDivShow = false
                this.$nextTick(() => {
                  this.allDivShow = true
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('tenantManage.operationCanceled')
            })
          })
      } else {
        this.$message({
          message: this.$t('tenantManage.shareWarning'),
          type: 'warning'
        })
      }
    },

    //模糊搜索设备
    searchDevice(queryString, cb) {
      if (!this.searchForm.deviceName) {
        this.expandIndex = -1
        return
      }
      let obj = {
        searchName: queryString
      }
      this.$api.searchInDeviceTree(obj).then(res => {
        let nodeList = res.nodeList || []
        nodeList.forEach(item => {
          item.value = item.label
        })
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(nodeList)
        }, 3000 * Math.random())
      })
    },
    //选择定位设备
    handleSelect(item) {
      this.choosedSelectBySearch = item
      this.expandIndex = -1
      let parents = item.parents
      this.parentIds = []
      this.allParentIds = []
      parents.forEach(item1 => {
        this.allParentIds.push(item1.parentId)
        if (!this.zones[item1.parentId]) {
          this.parentIds.push(item1.parentId)
        }
      })
      let expandKeys = []
      for (let i = 1; i < item.parents.length; i++) {
        expandKeys.push(String(item.parents[i].parentId))
      }
      this.defaultKeys = expandKeys
      setTimeout(() => {
        this.$refs.treeList.setCurrentKey(item.id)
        this.handleNodeClick(
          this.$refs.treeList.getNode(item.id).data,
          this.$refs.treeList.getNode(item.id)
        )
      }, 1000)
      if (this.cameras[this.allParentIds[this.allParentIds.length - 1]]) {
        if (this.choosedSelectBySearch.type == 1) {
          this.currentNode = {
            id: this.choosedSelectBySearch.id,
            payload: {
              parentId: this.allParentIds[this.allParentIds.length - 1]
            }
          }
        } else {
          this.currentNode = {
            id: this.allParentIds[this.allParentIds.length - 1],
            payload: {
              parentId: this.allParentIds[this.allParentIds.length - 2]
                ? this.allParentIds[this.allParentIds.length - 2]
                : -1
            }
          }
        }
        this.tableData = this.cameras[this.currentNode.id]
        this.$nextTick(() => {
          this.highLightDevice()
        })
        this.$refs.treeList.setCurrentKey(this.currentNode.id)

        this.getShareDevicesDetail(this.currentNode)
        this.chooseChildByParent(this.currentNode)
      } else {
        this.expandIndex++
        let index = this.allParentIds.indexOf(this.parentIds[this.expandIndex])
        this.currentNode = {
          id: this.parentIds[this.expandIndex],
          payload: { parentId: this.allParentIds[index - 1] }
        }
      }
    },

    //选中模糊查询的设备
    highLightDevice() {
      if (this.choosedSelectBySearch.type == 2) {
        let search = this.tableData.find(item => item.id == this.choosedSelectBySearch.id)
        let index2 = this.tableData.indexOf(search)
        let tableRows = document.getElementsByClassName('dialogRow')
        for (let i = 0; i < tableRows.length; i++) {
          tableRows[i].classList.remove('choose-row')
        }
        let row = document.getElementsByClassName('dialogRow')[index2]
        row.className = row.className + ' choose-row'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/color.scss';
#myShareDev {
  .userName .el-form-item__content {
    width: 200px;
  }
  .chooseAll {
    cursor: pointer;
    height: 54px;
  }
  .el-checkbox__label {
    color: $color27;
  }
  .group .el-checkbox__label {
    display: none;
  }
  .el-dialog__body .el-input__inner {
    width: 245px !important;
  }

  .el-table .choose-row {
    background: $color28 !important;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: transparent;
  }

  .el-autocomplete {
    width: 200px;
  }
}
.tenantShareDev #orgTree {
  height: 510px;
  background: #f2f2f2;
}
.orgTable {
  margin-top: 20px;
  margin-bottom: 50px;
}
.org_change .el-dialog__body {
  padding: 15px 125px 5px;
}
</style>
