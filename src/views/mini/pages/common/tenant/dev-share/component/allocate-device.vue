<template>
  <el-dialog
    :title="$t('tenantManage.devShare')"
    v-model="$parent.dialogVisible"
    width="1200px"
    class="tenantShareDev"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    @closed="dialogClosed"
    draggable
    id="tenant-allocate-device"
  >
    <el-row>
      <el-col :span="4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree1">
            <el-tree
              ref="treeList"
              v-loading="treeLoading"
              :props="organizationTreeProps"
              @node-click="handleNodeClick"
              :load="loadNode"
              node-key="id"
              lazy
              :default-expanded-keys="defaultKeys"
              highlight-current
              :current-node-key="currentDefaultKey"
              :expand-on-click-node="false"
              @node-expand="expandNode"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss1 aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" style="padding-left: 15px">
        <div style="position: relative">
          <div class="chooseAll">
            <el-checkbox v-model="checkedOrganize" @change="chooseOrganize" :disabled="ifDisable2">
              {{ $t('tenantManage.checkedOrganize') }}
            </el-checkbox>
          </div>
          <!-- 查询和其他操作 -->
          <div
            class="filter-container filter-Share"
            style="position: absolute; top: 0px; right: 0px"
          >
            <el-autocomplete
              v-model="searchForm.deviceName"
              :fetch-suggestions="searchDevice"
              :placeholder="$t('tenantManage.equipmentPrompt')"
              @select="handleSelect"
              :trigger-on-focus="false"
              :maxlength="128"
            ></el-autocomplete>
          </div>
        </div>

        <div v-show="ifOpenTips" style="color: #e05757; padding-left: 18px">
          {{ $t('tenantManage.tips') }}
        </div>

        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          :row-class-name="tableRowClassName"
          class="elTable table-Border-color"
          :max-height="455"
          :empty-text="$t('public.noData')"
          border
          scrollbar-always-on
        >
          <el-table-column label width="50">
            <template #header>
              <el-checkbox
                v-model="checkAll"
                @change="handleCheckAllChange"
                :indeterminate="isIndeterminate"
                :disabled="ifDisable"
              ></el-checkbox>
            </template>
            <template #default="{ row }">
              <el-checkbox-group
                v-model="checkedCameras"
                @change="handleCheckedCameraChange"
                class="group"
                :disabled="ifDisable"
              >
                <el-checkbox :label="row.id"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('tenantManage.id')"
            prop="id"
            min-width="110"
            useSlot
          >
            <template #default="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('tenantManage.name')"
            prop="label"
            useSlot
          >
            <template #default="{ row }">
              <span>{{ row.label }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            :label="$t('tenantManage.type')"
            useSlot
          >
            <template #default="{ row }">
              <span>{{ setDevType(row.payload.deviceType) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip :label="$t('public.state')" min-width="60" useSlot>
            <template #default="{ row }">
              <span
                :class="
                  row.payload.status == '1' ? 'success' : row.payload.status == '2' ? 'danger' : ''
                "
              >
                {{
                  row.payload.status == 1 ? $t('tenantManage.online') : $t('tenantManage.offline')
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="cancalShareDevice">
          {{ $t('tenantManage.cancelDistribution') }}
        </el-button>
        <el-button type="primary" @click="shareDevice">{{ $t('tenantManage.preserve') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import devDict from '@/mixin/dev-dict.js'
export default {
  mixins: [devDict],
  data() {
    return {
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
      choosedSelectBySearch: {}, //存放搜索选择的
      tenantId: ''
    }
  },
  watch: {
    tableData() {
      if (this.tableData && this.tableData.length) {
        this.allIds = Array.from(this.tableData, item => item.id)
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        if (this.tenantId != this.$parent.newTenantId && this.$refs.treeList) {
          this.tenantId = this.$parent.newTenantId
          let rootNode = this.$refs.treeList.getNode(this.currentDefaultKey)
          if (rootNode) {
            this.$refs.treeList.setCurrentKey(rootNode.data.id)
            this.handleNodeClick(rootNode.data)
          }
        } else {
          this.tenantId = this.$parent.newTenantId
          if (JSON.stringify(this.currentNode) != '{}') {
            this.getShareDevicesDetail(this.currentNode)
          }
        }
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? 'dialogRow successRow' : 'dialogRow'
    },
    dialogClosed() {
      this.$parent.dialogVisible = false
      this.searchForm.deviceName = ''
      let tableRows = document.getElementsByClassName('dialogRow')
      for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].classList.remove('choose-row')
      }
    },

    // 获取菜单树
    async findTreeData(level, parentId, resolve) {
      this.loading = true
      let list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parentId) : null
      await this.$api.getDeviceTree(data).then(res => {
        list = res.nodeList || []
        this.organizationData = list
        this.zoneList = this.organizationData.filter(item => item.type == 1)
        this.cameras[parentId] = this.organizationData.filter(item => item.type == 2)
        if (level == 0) {
          this.defaultKeys = [list[0].id]
          this.currentDefaultKey = list[0].id
          this.currentNode = list[0]
          this.zones[list[0].id] = list[0]
          this.$nextTick(() => {
            this.$refs.treeList.setCurrentKey(list[0].id)
          })
        } else {
          if (!this.zones[parentId]) {
            this.zones[parentId] = this.currentNode
          }
          this.getShareDevicesDetail(this.currentNode)
          this.getSearchNode()
        }
        this.tableData = this.cameras[this.currentNode.id]
        this.chooseChildByParent(this.currentNode)
        this.loading = false
        return resolve(this.zoneList)
      })
    },
    //懒加载
    async loadNode(node, resolve) {
      if (node.level === 0) {
        await this.findTreeData(node.level, '', resolve)
      } else {
        await this.findTreeData(node.level, node.data.id, resolve)
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
    handleNodeClick(data) {
      this.isIndeterminate = false
      this.searchForm.deviceName = ''
      this.currentNode = data
      this.expandIndex = -1
      this.ifOpenTips = false
      this.loading = true
      this.defaultKeys = [data.id]
      if (this.cameras[data.id]) {
        this.tableData = this.cameras[data.id]
        this.getShareDevicesDetail(data)
        this.chooseChildByParent(data)
      }
      this.loading = false
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
        targetTenantId: this.tenantId,
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
        let defaultNode = JSON.parse(JSON.stringify(this.defaultOrganizeAll[this.currentNode.id]))
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
          tenantId: this.tenantId
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
    cancalShareDevice() {
      if (!this.ifDisable2) {
        let obj = {
          tenantId: this.tenantId,
          cancelList: [{ groupId: this.currentNode.id, deviceIds: [], type: 0 }]
        }
        this.$api.shareDeviceToTenant(obj).then(res => {
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('tenantManage.cancelShareSuccess'),
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
        this.defaultKeys = [this.parentIds[this.expandIndex]]
      }
    },
scrollToTargetRow(index) {
      this.$nextTick(() => {
        const elTable = this.$refs.multipleTable.$el
        if (elTable) {
          const targetRow = elTable.querySelector(`.el-table__row:nth-child(${index + 1})`)
          if (targetRow) {
            this.$refs.multipleTable.setScrollTop(targetRow.offsetTop)
          }
        }
      })
    },
    //选中模糊查询的设备
   highLightDevice() {
      if (this.choosedSelectBySearch.type == 2) {
        setTimeout(() => {
          this.$nextTick(() => {
            let targetRow = this.tableData.find(item => item.id == this.choosedSelectBySearch.id)
            let index2 = this.tableData.indexOf(targetRow)
            let tableRows = document.getElementsByClassName('dialogRow')
            for (let i = 0; i < tableRows.length; i++) {
              tableRows[i].classList.remove('choose-row')
            }
            let row = document.getElementsByClassName('dialogRow')[index2]
            row.className = row.className + ' choose-row'
            if (index2 == 0 || index2) {
              this.scrollToTargetRow(index2)
            }
          })
        }, 500)
      }
    },
    iconSty(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci-organization'
      } else {
        if (node.type == 1) {
          return 'aci-x006-folder'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/color.scss';
.tenantShareDev {
  .filter-Share {
    .el-input .el-input__inner {
      border: 1px solid #f2f2f2;
      background: #f2f2f2;
    }
  }
  .el-dialog__body {
    padding: 10px 15px;
    .el-input--small .el-input__inner {
      width: 430px;
    }
  }
  #orgTree1 {
    height: 525px;
  }

  .chooseAll {
    line-height: 40px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .el-checkbox__label {
    color: $color27;
  }

  .group .el-checkbox__label {
    display: none;
  }

  .el-input__inner {
    width: 245px;
  }

  
}
#tenant-allocate-device .vxe-table .choose-row,
#tenant-allocate-device .el-dialog__body .el-table__body tr.choose-row > td {
    background: $color28 !important;
  }
</style>
