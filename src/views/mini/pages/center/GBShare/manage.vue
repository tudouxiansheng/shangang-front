<template>
  <div
    id="GBShare"
    ref="GBShare"
    v-if="isRouterAlive"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    
  >
    <div v-show="showRightMenu">
      <ul id="menu" class="right-menu">
        <li class="menu-item" @click="addDevHandle">
          {{ $t('GBShare.addChildNode') }}
        </li>
        <li class="menu-item" @click="editDevHandle">
          {{ $t('GBShare.editNode') }}
        </li>
        <li
          class="menu-item"
          :class="rightClickData.type == '1' || parentOrgId === 0 ? 'notClick' : ''"
          @click="delDevHandle"
        >
          {{ $t('GBShare.deleteNode') }}
        </li>
      </ul>
    </div>
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNodePlat"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              @node-contextmenu="rightClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconStyPlat(data)" class="aci iconCss"></i>
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
          <el-button type="primary" @click="showImprtDialog(null)" style="margin-left: 10px">
            {{ $t('GBShare.addDevice') }}
          </el-button>
          <el-button type="danger" @click="handleDel" style="margin-left: 10px" :disabled="delShow">
            {{ $t('GBShare.batchDelete') }}
          </el-button>
          <el-button
              v-if="PermissionWatermarkInfo && PermissionWatermarkManage"
              type="primary"
              @click="batchCorrelation"
              :disabled="delShow"
              style="margin-left: 10px"
          >
            {{ $t('GBShare.batchCorrelation') }}
          </el-button>
          <el-button
              v-if="PermissionWatermarkInfo && PermissionWatermarkManage"
              type="danger"
              @click="batchCancelCorrelation"
              :disabled="delShow"
              style="margin-left: 10px"
          >
            {{ $t('GBShare.batchCancelCorrelation') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '120px' : '84px'"
            ref="form"
            :model="queryParams"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('alarmList.cameraName') + ':'">
                <el-input
                  v-model="queryParams.cameraName"
                  clearable
                  :placeholder="$t('alarmList.inputCameraName')"
                />
              </el-form-item>
              <el-form-item :label="$t('GBShare.cameraNumber') + ':'">
                <el-input
                  v-model="queryParams.cameraId"
                  clearable
                  :placeholder="$t('GBShare.enterTheCameraNumber')"
                />
              </el-form-item>
              <el-form-item
                  :label="$t('systemTatermarkManage.watermarkName') + ' ：'"
                  class="flex-item"
              >
                <el-input v-model="queryParams.watermarkContent" auto-complete="off" :placeholder="$t('systemTatermarkManage.content')" />
              </el-form-item>
              <el-form-item :label="$t('GBShare.cameraStatus') + ':'">
                <el-select v-model="queryParams.cameraStatus" clearable>
                  <el-option
                    v-for="(item, index) in cameraStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" style="display: inline-block" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <el-button @click="handleRest">{{ $t('public.reset') }}</el-button>
            </div>
          </el-form>
        </div>

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
            :max-height="tableHeight"
            v-if="!loading && tableData.length"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('GBShare.cameraNumber')"
              prop="cameraId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('alarmList.cameraName')"
              prop="cameraName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('GBShare.platformName')"
              prop="platName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('GBShare.interconnectionCoding')"
              prop="interconnectCode"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('systemTatermarkManage.watermarkName')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>
                  {{ scope.row.watermarkType == 2 ? waterNameFilters(scope.row.watermarkContent) : scope.row.watermarkContent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('GBShare.cameraStatus')" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="setStatusClass(row.cameraStatus)">
                  {{ setStatus(row.cameraStatus) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.createTime')"
              prop="createTime"
              show-overflow-tooltip
              min-width="90"
            />
            <el-table-column
              :label="$t('GBShare.lastEditTime')"
              prop="updateTime"
              show-overflow-tooltip
              min-width="90"
            />

            <el-table-column :label="$t('GBShare.operation')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleUpdate(row)">
                  {{ $t('public.edit') }}
                </span>
                <span class="cell-operate danger" @click="handleDelete(row)">
                  {{ $t('public.delete') }}
                </span>
                <span class="cell-operate" @click="handleCorrelation(row)" v-if="!row.watermarkType">
                  {{ $t('GBShare.associatedWatermark') }}
                </span>
                <span class="cell-operate danger" @click="handleDisassociate(row)" v-else>
                  {{ $t('GBShare.disassociate') }}
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
      </el-col>
    </el-row>

    <gBShare-update></gBShare-update>
    <tree-node-add></tree-node-add>
    <device-import-tree></device-import-tree>
    <associated-watermark
      :watermarkDataForm="watermarkDataForm"
      :correlationOperate="correlationOperate"
    ></associated-watermark>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AssociatedWatermark from './component/associated-watermark'
import gBShareUpdate from './component/GBshare-update.vue'
import TreeNodeAdd from './component/tree-node-add'
import deviceImportTree from './component/device-import-tree'
import getLazyTree from '@/mixin/getLazyTree.js'
import { h } from 'vue'
export default {
  mixins: [getLazyTree],
  name: 'GBShareManagement',
  components: {
    gBShareUpdate,
    TreeNodeAdd,
    deviceImportTree,
    AssociatedWatermark
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      treeNodeType: '',
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        platId: '',
        groupId: '',
        cameraName: '',
        cameraStatus: '',
        cameraId: '',
        watermarkContent: '',
        watermarkRule: ''
      },
      pageloading: false,
      loading: false,
      sceneTypeOptions: [], // 场所
      abilityOptions: [], // 设备能力
      manufacturerOptions: [], // 设备厂商
      networkPropertyOptions: [], // 联网属性
      tableData: [], // 表格数据

      formDialogVisible: false,
      screenFlag: true,
      tableHeight: 630,
      dataText: '',

      //接入平台
      dialogFormVisible: false,
      operation: true,
      maskloading: false,
      dataForm: {},
      gatewayClusterDetailVisible: false,
      organizationId: '',
      organizationName: '',
      isSearch: false,
      title: '',
      title_detail: '',
      dialogFormVisible_add: false,
      dialogFormVisible_allocate: false,
      delShow: true,
      multipleSelection: [],
      choosedPlatformId: '',
      cameraStatusList: [],
      gateWayStatusList: [],
      mediaAccessTypeList: [],
      platTypeList: [],
      accessPlatTypeList: [],
      accessNetworkTypeList: [],
      choosedGateWayGroup: '',
      //调拨设备
      importTreeDialogVisible: false,
      showRightMenu: false,
      accessPlatList: [],
      nodeOperation: 1,
      rightClickData: {},
      rightClickNode: {},
      choosedCameraInfo: {},

      choosedPlatId: '',
      choosedParentId: '',
      parentOrgId: '',
      choosedShareType: '',
      appendId: '',
      batchAssociatedVisible: false,
      PermissionWatermarkInfo: true,
      PermissionWatermarkManage: true,
      watermarkDataForm: [],
      showManyCondition: true,
      correlationOperate: null //0 单个关联 1 批量关联
    }
  },
  async created() {
    await this.getAccessPlatList()
  },

  computed: {
    ...mapState({
      accessAuthTypeList: state => state.dict['access-plat-auth-type'],
      accessProtocolTypeList: state => state.dict['access-plat-protocol-type']
    })
  },
  mounted() {
    this.setData()
  },
  methods: {
    waterNameFilters(value) {
      let array = value.split(',')
      for (let i = 0; i < array.length; i++) {
        switch (array[i]) {
          case '1':
            array[i] = this.$t('systemTatermarkManage.affiliatedOrganization')
            break
          case '2':
            array[i] = this.$t('systemTatermarkManage.userName')
            break
          case '3':
            array[i] = this.$t('systemTatermarkManage.phone')
            break
          case '4':
            array[i] = this.$t('systemTatermarkManage.id')
            break
        }
      }
      let waterChineseName = array.join(',')
      return waterChineseName
    },
    setData() {
      this.cameraStatusList = [
        {
          name: this.$t('GBShare.all'),
          value: ''
        },
        {
          name: this.$t('public.statustype0'),
          value: 0
        },
        {
          name: this.$t('public.statustype1'),
          value: 1
        },
        {
          name: this.$t('public.statustype2'),
          value: 2
        },
        {
          name: this.$t('public.statustype3'),
          value: 3
        }
      ]
      this.gateWayStatusList = [
        {
          name: this.$t('accessPlatform.notConnected'),
          value: 0
        },
        {
          name: this.$t('public.statustype1'),
          value: 1
        },
        {
          name: this.$t('public.statustype2'),
          value: 2
        }
      ]
      this.mediaAccessTypeList = [
        {
          name: this.$t('monitorManage.streamingProtocol'),
          value: 0
        },
        {
          name: this.$t('monitorManage.privateProtocol'),
          value: 1
        },
        {
          name: this.$t('GBShare.connectViaDeviceSDK'),
          value: 2
        }
      ]
      this.platTypeList = [
        {
          name: this.$t('accessPlatform.superior'),
          value: 1
        },
        {
          name: this.$t('accessPlatform.subordinate'),
          value: 2
        }
      ]
      this.accessPlatTypeList = []
      this.accessNetworkTypeList = [
        {
          name: this.$t('GBShare.publicNetwork'),
          value: 1
        },
        {
          name: this.$t('GBShare.privateNetwork'),
          value: 2
        }
      ]
    },
    setStatusClass(val) {
      if (val == 0) {
        return 'warning'
      } else if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      } else if (val == 3) {
        return 'warning'
      }
    },

    setStatus(val) {
      let name = ''
      this.cameraStatusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    iconStyPlat(node) {
      if (node.type == 1) {
        return 'aci-tv'
      } else if (node.type == 2) {
        return 'aci-x006-folder'
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.delShow = this.multipleSelection.length ? false : true
    },

    async getAccessPlatList() {
      let res = await this.$api.queryAccessPlatformList({})
      this.accessPlatList = res.platformList
    },

    rightClick(event, data, node, obj) {
      if (data.type == '1') {
        this.showRightMenu = false
        return
      }
      this.showRightMenu = false // 先把模态框关死，目的是：第二次或者第n次右键鼠标的时候 它默认的是true
      this.showRightMenu = true
      let menu = document.querySelector('#menu')
      menu.style.left =
        event.clientX - document.getElementsByClassName('openBtn')[0].clientWidth + 10 + 'px'
      menu.style.top = event.clientY - 30 + 'px'
      // 给整个document添加监听鼠标事件，点击任何位置执行closeRightMenu方法，及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)

      this.rightClickData = data
      this.rightClickNode = node

      if (!node.parent.data) {
        this.parentOrgId = 0
      } else {
        this.parentOrgId = node.parent.data.payload.organizationId
      }

      this.choosedPlatId = data.type == '1' ? data.payload.platformId : data.payload.platId
      this.choosedParentId = data.payload.organizationId
    },

    closeRightMenu() {
      this.showRightMenu = false
      // 及时关掉鼠标监听事件
      document.removeEventListener('click', this.closeRightMenu)
    },

    addDevHandle() {
      this.dialogFormVisible_add = true
      this.nodeOperation = 1
    },
    editDevHandle() {
      this.dialogFormVisible_add = true
      this.nodeOperation = 2
    },
    delDevHandle() {
      if (this.rightClickData.type == '1' || this.parentOrgId === 0) {
        return
      }
      this.$confirm(this.$t('GBShare.deleteNodeIsConfirm') + '？', this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api
            .deleteGroup({
              platId: this.choosedPlatId,
              groupId: this.rightClickData.id
            })
            .then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })
                this.$nextTick(() => {
                  const node = this.$refs.treeList.getNode(
                    this.rightClickData.payload.organizationId
                  )
                  const parent = node.parent
                  const childNodes = parent.childNodes
                  const index = childNodes.findIndex(
                    d =>
                      d.data.payload.organizationId === this.rightClickData.payload.organizationId
                  )
                  childNodes.splice(index, 1)
                  this.appendId = node.parent.data.payload.organizationId.toString()
                  parent.loaded = false
                  parent.loadData()

                  //更新面包屑
                  this.handleNodeClick(parent.data, parent)
                })
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

    getTemplateCommand(command) {
      switch (command) {
        case 1:
          this.showImprtDialog(1)
          break
        case 2:
          this.showImprtDialog(2)
          break
        case null:
          this.showImprtDialog(null)
          break
      }
    },

    showImprtDialog(val) {
      this.choosedShareType = val
      this.importTreeDialogVisible = true
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryList() {
      this.getSysDictData(['access-plat-auth-type', 'access-plat-protocol-type'])
    },

    loadNodePlat(node, resolve) {
      if (node.level == 0) {
        this.getTree(node.level, '', '', resolve)
      } else {
        this.getTree(
          node.level,
          node.data.type == '1' ? 0 : node.data.payload.organizationId,
          node.data.type == '1' ? node.data.payload.platformId : node.data.payload.platId,
          resolve
        )
      }
    },

    // 加载树
    async getTree(level, parentId, platformId, resolve) {
      let list = []
      let data = {
        type: 1
      }
      parentId !== '' ? (data.parentId = parentId) : null
      platformId ? (data.platId = platformId) : null
      await this.$api.getGroupTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)

          this.treeNodeType = list[0].type
          this.queryParams.platId =
            list[0].type == '1' ? list[0].payload.platformId : list[0].payload.platId
          this.queryParams.groupId = list[0].id
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
      if (this.appendId) {
        this.$refs.treeList.setCurrentKey(this.appendId)
        this.handleFind()
        this.appendId = null
      }
    },
    handleNodeClick(data, node, self) {
      this.treeNodeType = data.type
      //点击树联动面包屑
      this.queryParams.platId = data.type == '1' ? data.payload.platformId : data.payload.platId
      this.queryParams.groupId = data.id

      this.handleFind()
    },
    handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      this.isSearch = true
      this.getList()
    },

    handleRest() {
      this.queryParams.watermarkContent = ''
      this.queryParams.cameraName = ''
      this.queryParams.cameraStatus = ''
      this.queryParams.cameraId = ''
      this.handleFind()
    },

    async getList() {
      this.delShow = true
      if (this.treeNodeType == 2) {
        this.loading = true
        let res = await this.$api.convergenceDeviceList(this.queryParams)
        if (res.resultCode == 0 && res.convergenceDeviceInfoList) {
          this.tableData = res.convergenceDeviceInfoList
          this.total = res.pageInfo.totalNum
          this.loading = false
        } else {
          this.tableData = []
          this.total = 0
          this.loading = false
        }
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

    handleImport() {
      if (this.treeNodeType != 2) {
        this.$message({
          type: 'warning',
          message: this.$t('GBShare.platformToTransfer')
        })
        return
      }
      this.importTreeDialogVisible = true
    },

    handleDel() {
      this.$confirm(
        this.$t('GBShare.deleteEquipment', {
          num: this.multipleSelection.length
        }),
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

          for (let i = 0; i < this.multipleSelection.length; i++) {
            let item = this.multipleSelection[i]
            this.$api
              .delConvergenceDevice({
                cameraId: item.cameraId,
                platId: this.queryParams.platId
              })
              .then(res => {
                if (res.resultCode == 0 && i == this.multipleSelection.length - 1) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.bulkDelSuccess')
                  })
                  this.getList()
                }
              })
          }
          this.loading = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    /** 详情按钮操作 */
    async handleUpdate(row) {
      this.choosedCameraInfo = row
      this.dialogFormVisible = true
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(this.$t('GBShare.deleteIsConfirm') + '？', this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api
            .delConvergenceDevice({
              cameraId: row.cameraId,
              platId: this.queryParams.platId
            })
            .then(res => {
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

    async getInfo(row) {
      let res = await this.$api.getAccessCameraDetail({
        cameraId: row.cameraId,
        platId: this.queryParams.platId
      })
      if (res.resultCode == 0) {
        this.dataForm = {
          ...res
        }
      }
    },
    batchCorrelation() {
      this.watermarkDataForm = this.multipleSelection
      this.correlationOperate = 1
      this.batchAssociatedVisible = true
    },
    batchCancelCorrelation() {
      const h = this.$createElement
      this.$confirm(this.$t('GBShare.cancelTitle'), {
        title: this.$t('GBShare.cancelTitle'),
        message:`<div>
                    <p style="font-size: 18px;margin-bottom:10px;color:#fff">${this.$t('GBShare.sureToCancel')}</p>
                    <p>${this.$t('GBShare.cancelTips')}</p>
                  </div>`,
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
      })
          .then(() => {
            let cameraIds = []
            this.multipleSelection.forEach(item => {
              cameraIds.push(item.cameraId)
            })
            let data = {
              cameraIds,
              platId: this.queryParams.platId
            }
            this.loading = true
            this.$api.unlinkWatermarkCamera(data).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('GBShare.cancelCorrelationSuccess')
                })
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('GBShare.cancelOperation')
            })
          })
    },
    handleCorrelation(row) {
      this.watermarkDataForm = [JSON.parse(JSON.stringify(row))]
      this.correlationOperate = 1
      this.batchAssociatedVisible = true
    },
    handleDisassociate(row) {
      const h = this.$createElement
      this.$confirm(this.$t('GBShare.cancelTitle'), {
        title: this.$t('GBShare.cancelTitle'),
        message:`<div>
                    <p style="font-size: 18px;margin-bottom:10px;color:#fff">${this.$t('GBShare.sureToCancel')}</p>
                    <p>${this.$t('GBShare.cancelTips')}</p>
                  </div>`,
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
      })
          .then(() => {
            let data = {
              cameraIds: [row.cameraId],
              platId: this.queryParams.platId
            }
            this.loading = true
            this.$api.unlinkWatermarkCamera(data).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('GBShare.cancelCorrelationSuccess')
                })
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('GBShare.cancelOperation')
            })
          })
    },
  }
}
</script>

<style lang="scss">
#GBShare {
  height: 100%;

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .right-menu {
    z-index: 2;
    position: absolute;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #3085cb;
    background-color: white;
    .menu-item {
      line-height: 20px;
      text-align: left;
      font-size: 14px;
      color: #4d4d4d;
      cursor: pointer;
      padding: 10px 10px;
    }
    .menu-item:last-child {
      margin-bottom: 0px;
    }
    li:hover {
      background-color: #3085cb;
      color: #fff;
    }
  }
  .notClick {
    cursor: not-allowed !important;
    color: grey !important;
  }
}
</style>
