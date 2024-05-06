<template>
  <!-- 调拨设备树 -->
  <el-dialog
    :title="$t('primaryDevice.AllocatingEquipment')"
    v-model="$parent.allcateTreeDialogVisible"
    top="10vh"
    width="1000px"
    class="deviceDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-scrollbar style="border-radius: 6px">
      <div
        class="devicetree"
        v-if="$parent.allcateTreeDialogVisible"
        v-loading="devicetreeloading"
        :element-loading-text="$t('public.loading')"
        
      >
        <el-tree
          v-if="isFlag"
          ref="tree"
          :props="props"
          :load="loadNode"
          lazy
          show-checkbox
          @check="changetree"
          node-key="id"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconSty(data)" class="aci"></i>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="synchronization" class="left-footer">
          {{ $t('primaryDevice.synchronization') }}
        </el-button>
        <el-button @click="dialogClosed1">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitFormtree">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
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
      chooseDevice: []
    }
  },
  methods: {
    async dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
      await this.loadNode()
    },
    // 调拨设备树查询
    async devicetree(parentId, resolve) {
      let list
      this.devicetreeloading = true
      let data = {
        platId: this.$parent.platId,
        organizationId: this.$parent.allcateDeviceForm.organizationId
      }
      parentId ? (data.parentId = parentId) : null
      if (this.$parent.platType == 5) {
        Object.assign(data, {
          domainCode: this.$parent.allcateDeviceForm.domainCode
        })
      } else if (this.$parent.platType == 2 || this.$parent.platType == 10) {
        Object.assign(data, {
          account: this.$parent.allcateDeviceForm.PlatformAccount
        })
      }
      await this.$api.getAllocateDeviceTree(data).then(res => {
        if (res.nodeList) {
          list = res.nodeList
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
      this.$parent.allcateTreeDialogVisible = false
    },
    dialogClosed1() {
      this.dialogClosed()
      this.$parent.allcateDeviceForm.devicelist = ''
      this.$parent.devicelistgroupIds = []
      this.$parent.devicelistcameraIds = []
      this.chooseDevice = []
      this.$parent.allcateTreeDialogVisible = false
    },

    // 调拨设备树懒加载
    async loadNode(node, resolve) {
      if (node) {
        if (node.level === 0) {
          let list = await this.devicetree('', resolve)
          return resolve(list)
        } else {
          let list = await this.devicetree(node.data.id, resolve)
          return resolve(list)
        }
      }
    },
    changetree(data, checkedNodes) {
      this.chooseDevice = checkedNodes.checkedNodes
    },
    // 确认调拨设备树
    submitFormtree() {
      this.$parent.allcateDeviceForm.devicelist = ''
      this.$parent.devicelistgroupIds = []
      this.$parent.devicelistcameraIds = []
      if (this.chooseDevice.length) {
        this.chooseDevice.forEach(item => {
          this.$parent.allcateDeviceForm.devicelist += item.label + ';'
          if (item.type == 1) {
            this.$parent.devicelistgroupIds.push(item.id)
          } else if (item.type == 2) {
            this.$parent.devicelistcameraIds.push(item.id)
          }
        })
      }
      this.$parent.allcateTreeDialogVisible = false
    },

    // 同步设备
    synchronization() {
      let data = {
        platId: this.$parent.platId
      }
      let form = this.$parent.allcateDeviceForm
      if (form.PlatformPassword !== undefined) {
        Object.assign(data, {
          password: form.PlatformPassword
        })
      }
      if (this.$parent.platType == 5) {
        Object.assign(data, {
          domainCode: form.domainCode,
          account: form.PlatformAccount
        })
      } else if (this.$parent.platType == 2) {
        Object.assign(data, {
          account: form.PlatformAccount
        })
      } else if (this.$parent.platType == 10) {
        data = {
          platId: this.$parent.platId
        }
      }
      this.isFlag = false
      this.devicetreeloading = true
      this.$api.syncAllocateDevice(data).then(res => {
        this.isFlag = true
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('primaryDevice.synchronousRegime')
          })
          this.devicetree()
        }
        this.devicetreeloading = false
      })
    }
  },
  computed: {
    iconSty(node) {
      return node => {
        if (node.type == 1) {
          return 'aci-x006-folder iconCss1'
        } else {
          if (node.payload.ptzType == 1 && node.payload.cameraStatus == 1) {
            return 'aci-camera-gun iconCss1'
          } else if (node.payload.ptzType == 2 && node.payload.cameraStatus == 1) {
            return 'aci-camera-ptz iconCss1'
          } else if (node.payload.ptzType == 3 && node.payload.cameraStatus == 1) {
            return 'aci-camera-ball iconCss1'
          } else if (
            node.payload.ptzType == 1 &&
            (node.payload.cameraStatus == 0 || node.payload.cameraStatus == 2)
          ) {
            return 'aci-camera-gun iconCss2'
          } else if (
            node.payload.ptzType == 2 &&
            (node.payload.cameraStatus == 0 || node.payload.cameraStatus == 2)
          ) {
            return 'aci-camera-ptz iconCss2'
          } else if (
            node.payload.ptzType == 3 &&
            (node.payload.cameraStatus == 0 || node.payload.cameraStatus == 2)
          ) {
            return 'aci-camera-ball iconCss2'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.deviceDialog {
  .el-dialog__body {
    padding: 15px 60px 5px !important;
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
