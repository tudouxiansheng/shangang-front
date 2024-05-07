<template>
  <!-- 调拨设备树 -->
  <el-dialog
    :title="$t('GBShare.importDevice')"
    v-model="$parent.importTreeDialogVisible"
    top="10vh"
    width="1000px"
    class="GBShareImportDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <p style="color: #f56c6c">{{ $t('GBShare.selectcameraLens') }}</p>
    <p>
      <el-checkbox v-model="synOrganization">{{ $t('GBShare.organizationStructure') }}</el-checkbox>
    </p>
    <div style="display: flex; justify-content: space-around">
      <div
        class="devicetree"
        v-if="$parent.importTreeDialogVisible"
        v-loading="devicetreeloading"
        :element-loading-text="$t('public.loading')"
        
        style="width: 48%"
      >
        <el-tree
          v-if="isFlag"
          ref="tree"
          :props="props"
          :load="loadNodeDev"
          lazy
          show-checkbox
          @check="changetree"
          node-key="id"
          :default-expanded-keys="idArrDev"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconStyPlat(data)" class="aci"></i>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 组织树 -->
      <div style="width: 48%; background: #f2f2f2">
        <el-tree
          ref="treeListDialog"
          node-key="id"
          :props="organizationTreeProps"
          :load="loadNodePlatDialog"
          lazy
          v-loading="treeLoadingDialog"
          :default-expanded-keys="idArrDialog"
          :empty-text="treeEmptyText"
          highlight-current
          :expand-on-click-node="false"
          @node-click="treeNodeClick"
          v-if="showOrgTree"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconSty(data)" class="aci" style="margin-right: 0px !important"></i>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed1">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitFormtree" :loading="maskloading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { PLATFORM_TYPE } from '@/enums/platformEnum'
export default {
  data() {
    return {
      props: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      isFlag: true,
      devicetreeloading: false,
      chooseDevice: [],
      organizationId: '',
      maskloading: false,
      showOrgTree: true,
      idArrDev: [],
      treeLoadingDialog: false,
      idArrDialog: [],
      organizationTreeProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      treeEmptyText: '',
      importType: '',
      allocatePlatId: '',
      synOrganization: true
    }
  },
  methods: {
    loadNodePlatDialog(node, resolve) {
      if (node.level == 0) {
        this.getTreeDialog(node.level, '', '', resolve)
      } else {
        this.getTreeDialog(
          node.level,
          node.data.type == '1' ? 0 : node.data.payload.organizationId,
          node.data.type == '1' ? node.data.payload.platformId : node.data.payload.platId,
          resolve
        )
      }
    },
    async getTreeDialog(level, parentId, platformId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId !== '' ? (data.parentId = parentId) : null
      platformId ? (data.platId = platformId) : null
      await this.$api.getGroupTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑

        this.treeLoadingDialog = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArrDialog = [list[0].id]
          this.$refs.treeListDialog.setCurrentKey(list[0].id)
          this.organizationId = list[0].id

          this.importType = list[0].type

          this.allocatePlatId =
            list[0].type == '1' ? list[0].payload.platformId : list[0].payload.platId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    initData(list) {
      this.organizationId = list[0].payload.organizationId
    },
    // 点击树节点
    treeNodeClick(obj) {
      this.allocatePlatId = obj.type == '1' ? obj.payload.platformId : obj.payload.platId
      this.organizationId = obj.id
      this.importType = obj.type
    },
    async dialogOpen() {
      this.isFlag = false
      this.showOrgTree = false
      this.$nextTick(() => {
        this.setDialogCss()
        this.isFlag = true
        this.showOrgTree = true
      })
    },
    // 调拨设备树查询
    async devicetree(level, parentId, resolve) {
      let list
      this.devicetreeloading = true
      let data = {
        shareType: this.$parent.choosedShareType,
        deviceType: 1,
        platformType: PLATFORM_TYPE.VPAAS
      }
      parentId ? (data.parentId = parentId) : null
      await this.$api.getDeviceTree(data).then(res => {
        if (res.nodeList) {
          list = res.nodeList
          if (level == 0 && list.length) {
            this.idArrDev = [list[0].id]
          }
        } else {
          list = []
        }
        this.devicetreeloading = false
      })
      return list
    },

    dialogClosed() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }

      //清空
      this.chooseDevice = []

      this.$parent.importTreeDialogVisible = false
    },
    dialogClosed1() {
      this.dialogClosed()
    },

    // 调拨设备树懒加载
    async loadNodeDev(node, resolve) {
      if (node) {
        if (node.level === 0) {
          let list = await this.devicetree(node.level, '', resolve)
          return resolve(list)
        } else {
          let list = await this.devicetree(node.level, node.data.id, resolve)
          return resolve(list)
        }
      }
    },
    changetree(data, checkedNodes) {
      this.chooseDevice = checkedNodes.checkedNodes
    },
    // 确认调拨设备树
    submitFormtree() {
      if (this.importType == '1') {
        this.$message({
          type: 'warning',
          message: this.$t('GBShare.directoryToImport')
        })
        return
      }
      if (this.organizationId === '') {
        this.$message({
          type: 'warning',
          message: this.$t('GBShare.directoryToImportInto')
        })
        return
      }
      if (!this.chooseDevice.length) {
        this.$message({
          type: 'warning',
          message: this.$t('GBShare.groupOrDeviceToImport')
        })
        return
      }

      let cameraArr = []
      let groupArr = []

      let groupIds = []

      for (let x = 0; x < this.chooseDevice.length; x++) {
        if (this.chooseDevice[x].type == '1') {
          groupIds.push(this.chooseDevice[x].payload.organizationId)
        }
      }

      for (let i = 0; i < this.chooseDevice.length; i++) {
        if (this.chooseDevice[i].type == '1') {
          groupArr.push({
            organizationId: this.chooseDevice[i].payload.organizationId,
            organizationName: this.chooseDevice[i].payload.organizationName,
            parentId: this.chooseDevice[i].payload.parentId
          })
        } else if (this.chooseDevice[i].type == '2') {
          cameraArr.push({
            deviceId: this.chooseDevice[i].payload.deviceId,
            cameraName: this.chooseDevice[i].payload.deviceName,
            organizationId: this.chooseDevice[i].payload.organizationId
          })
        }
      }

      let obj = {
        platId: this.allocatePlatId,
        groupId: this.organizationId,
        convergenceDeviceInfoList: cameraArr,
        convergenceGroupList: groupArr,
        synOrganization: this.synOrganization,
        netType: this.$getNetType()
      }

      this.maskloading = true
      this.$api.addConvergenceDevice(obj).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.importSuccess')
          })
          const node = this.$parent.$refs.treeList.getNode(this.organizationId)
          if (node) {
            const parent = node.parent
            const childNodes = parent.childNodes
            const index = childNodes.findIndex(
              d => d.data.payload.organizationId === this.organizationId
            )
            childNodes.splice(index, 1)
            parent.loaded = false
            parent.loadData()
          }
          this.$parent.handleFind()
          this.$parent.importTreeDialogVisible = false
          this.maskloading = false
        } else {
          this.maskloading = false
        }
      })
    }
  },
  computed: {
    iconSty(node) {
      return node => {
        if (node.type == 1) {
          return 'aci-tv iconCss1'
        } else if (node.type == 2) {
          return 'aci-x006-folder iconCss1'
        }
      }
    },
    iconStyPlat(node) {
      return node => {
        if (node.type == 1 && node.payload.type == 1) {
          return 'aci-organization iconCss1'
        } else if (node.type == 1) {
          return 'aci-x006-folder iconCss1'
        } else {
          if (node.payload.deviceType == 1 && node.payload.status == 1) {
            return 'aci-camera-gun iconCss1'
          } else if (node.payload.deviceType == 2 && node.payload.status == 1) {
            return 'aci-camera-ptz iconCss1'
          } else if (node.payload.deviceType == 3 && node.payload.status == 1) {
            return 'aci-camera-ball iconCss1'
          } else if (node.payload.deviceType == 4 && node.payload.status == 1) {
            return 'aci-camera-hemisphere iconCss1'
          } else if (
            node.payload.deviceType == 1 &&
            (node.payload.status == 0 || node.payload.status == 2)
          ) {
            return 'aci-camera-gun iconCss2'
          } else if (
            node.payload.deviceType == 2 &&
            (node.payload.status == 0 || node.payload.status == 2)
          ) {
            return 'aci-camera-ptz iconCss2'
          } else if (
            node.payload.deviceType == 3 &&
            (node.payload.status == 0 || node.payload.status == 2)
          ) {
            return 'aci-camera-ball iconCss2'
          } else if (
            node.payload.deviceType == 4 &&
            (node.payload.status == 0 || node.payload.status == 2)
          ) {
            return 'aci-camera-hemisphere iconCss2'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.GBShareImportDialog {
  .el-dialog__body {
    padding: 0px 20px 5px !important;
    .devicetree {
      width: 100%;
      height: 500px;
      overflow-y: hidden;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: pointer;
      .el-tree {
        height: 500px;
      }
    }
    .devicetree:hover {
      overflow-y: auto;
    }

    .el-loading-mask {
      background: #fafafa !important;
    }
  }
  .left-footer {
    position: absolute;
    left: 60px;
  }
}
</style>
