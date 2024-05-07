<template>
  <!-- 调拨设备树 -->
  <el-dialog
    :title="$t('accessAllocate.allocatingEquipment')"
    v-model="$parent.allcateTreeDialogVisible"
    top="10vh"
    width="1000px"
    class="accessDeviceAllocateDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
    v-loading="maskloading"
    :element-loading-text="$t('accessAllocate.allocating')"
  >
    <p style="color: #f56c6c">{{ $t('accessAllocate.tips1') }}</p>
    <p>
      <el-checkbox v-model="syncGroup">{{ $t('accessAllocate.tips2') }}</el-checkbox>
    </p>
    <div style="display: flex; justify-content: space-around">
      <div
        class="devicetree"
        v-if="$parent.allcateTreeDialogVisible"
        :element-loading-text="$t('public.loading')"
        style="width: 48%"
      >
        <el-autocomplete
          v-model="filterText"
          style="margin: 10px; display: block; width: calc(100% -20px)"
          ref="selectSuggest"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          :debounce="300"
          :placeholder="$t('accessAllocate.enterRetrieveLens')"
          clearable
          @select="handleFilterNode"
        ></el-autocomplete>
        <div align="left" style="margin-left: 10px">
          <el-checkbox v-model="checkedall" @change="checkedallTree" />
          {{ $t('repo.allSelect') }}
        </div>
        <div ref="orgTree" class="orgTree">
          <div>
            <el-tree
              v-if="isFlag"
              ref="tree"
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              @check="changetree"
              node-key="id"
              :current-node-key="currentKey"
              highlight-current
              :default-expanded-keys="idArr"
              :expand-on-click-node="false"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>

      <!-- //组织树 -->
      <div style="width: 48%">
        <lazy-tree
          ref="lazyTree"
          @initList="initData"
          @nodeClick="treeNodeClick"
          style="height: 500px; background: #f2f2f2; overflow-y: auto"
          v-if="showOrgTree"
          :withTenant="true"
          :iconColor="true"
        />
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
import devIcon from '@/utils/common/dev-icon'
import { defineAsyncComponent } from 'vue'
const { getDevIcon } = devIcon()
import lazyTree from '@/components/lazy-tree'
export default {
  components: {
    'lazy-tree': lazyTree
  },
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
      syncGroup: true,
      checkedall: false,
      firstCheakTree: [],
      filterText: '',
      currentKey: '',
      locateTreeTip: false,
      idArr: [], //默认展开的节点的 key 的数组
      searchFlag: false
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      queryString = queryString.trim()
      if (queryString) {
        this.$refs.selectSuggest.activated = true
        const data = {
          searchParam: queryString,
          platId: this.$parent.queryParams.platId
        }
        // 后端函数调用返回联想词列表
        this.$api.getAllocateDeviceTreeSearch(data).then(res => {
          const nodeList = res?.nodeInfo || []
          nodeList.forEach(item => {
            item.value = item.cameraName
            item.id = item.cameraId
          })
          cb(nodeList)
        })
      } else {
        cb([])
      }
    },
    async handleFilterNode(item) {
      // 是否处于搜索状态
      const data = {
        cameraId: item.id,
        platId: this.$parent.queryParams.platId
      }
      this.searchFlag = true
      this.idArr = []
      await this.$api.getAllocateDeviceTreeLocate(data).then(res => {
        if (res.parents) {
          for (let i = 0; i < res.parents.length; i++) {
            this.idArr.push(res.parents[i].parentId.toString())
          }
          this.currentKey = item.id
          this.locateTreeTip = false
          this.setNode()
        } else {
          this.clearSearch()
        }
      })
    },
    clearSearch() {
      if (this.searchFlag) {
        this.searchFlag = false
        this.filterText = ''
      }
    },
    setNode() {
      if (this.searchFlag) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.currentKey)
          setTimeout(() => {
            let node = ''
            this.$nextTick(() => {
              let treeDom = this.$refs.tree.$el
              node = treeDom.querySelector('.el-dialog .is-current')
              setTimeout(() => {
                if (node) {
                  this.$refs.orgTree.scrollTop = node.offsetTop
                }
              }, 100)
            })
            if (!this.locateTreeTip && this.idArr.length) {
              for (let i = 0; i < this.idArr.length; i++) {
                if (
                  this.$refs.tree.getNode(this.idArr[i]) &&
                  this.$refs.tree.getNode(this.idArr[i]).expand() &&
                  this.$refs.tree.store.nodesMap[this.idArr[i]] &&
                  this.$refs.tree.store.nodesMap[this.idArr[i]].expanded
                ) {
                  continue
                } else {
                  break
                }
              }
            }
          }, 500)
        })
      }
    },
    initData(list) {
      this.organizationId = list[0].payload.organizationId
    },
    //全选事件
    async checkedallTree() {
      // el-tree全选事件
      if (this.checkedall) {
        // 全选
        this.$refs.tree.setCheckedNodes(this.firstCheakTree)
        this.chooseDevice = this.$refs.tree.getCheckedNodes()
      } else {
        // 取消选中
        this.$refs.tree.setCheckedKeys([])
        this.chooseDevice = []
      }
    },
    // 点击树节点
    treeNodeClick(obj) {
      this.organizationId = obj.data.payload.organizationId
    },
    async dialogOpen() {
      this.isFlag = false
      this.showOrgTree = false
      this.checkedall = false
      this.$nextTick(() => {
        this.setDialogCss()
        this.isFlag = true
        this.showOrgTree = true
      })
      await this.loadNode()
    },
    // 调拨设备树查询
    async devicetree(parentId, resolve, domainCode) {
      let list
      this.devicetreeloading = true
      let data = {
        platId: this.$parent.queryParams.platId,
        organizationId: this.$parent.organizationId
      }
      parentId ? (data.parentId = parentId) : null
      domainCode ? (data.domainCode = domainCode) : null
      await this.$api.getAllocateDeviceTreeAcc(data).then(res => {
        if (res && res?.nodeList) {
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

      //清空
      this.chooseDevice = []
      this.firstCheakTree = []
      this.$parent.allcateTreeDialogVisible = false
      this.filterText = ''
      this.currentKey = ''
      this.locateTreeTip = false
      this.idArr = [] //默认展开的节点的 key 的数组
      this.searchFlag = false
    },
    dialogClosed1() {
      this.dialogClosed()
    },

    // 调拨设备树懒加载
    async loadNode(node, resolve) {
      let list = []
      if (node) {
        if (node.level === 0) {
          list = await this.devicetree('', resolve)
          list.forEach(element => {
            this.firstCheakTree.push(element)
          })
          return resolve(list)
        } else {
          await this.devicetree(node.data.id, resolve, node.data.payload.domainCode).then(res => {
            list = res
            list.forEach(element => {
              this.firstCheakTree.push(element)
            })
            return resolve(list)
          })
          if (list.length) {
            this.setNode()
            if (this.searchFlag) {
              this.locateTreeTip = true
            }
          }
        }
      }
    },
    changetree(data, checkedNodes) {
      if (checkedNodes.checkedNodes.length != this.firstCheakTree.length) {
        this.checkedall = false
      } else {
        this.checkedall = true
      }
      this.chooseDevice = checkedNodes.checkedNodes
    },
    // 确认调拨设备树
    submitFormtree() {
      if (this.organizationId === '') {
        this.$message({
          type: 'warning',
          message: this.$t('accessAllocate.selectOrg')
        })
        return
      }
      if (!this.chooseDevice.length) {
        this.$message({
          type: 'warning',
          message: this.$t('accessAllocate.selectDev')
        })
        return
      }
      let cameraIds = []
      let groupIds = []
      for (let i = 0; i < this.chooseDevice.length; i++) {
        if (this.chooseDevice[i].type == 1) {
          groupIds.push(this.chooseDevice[i].id)
        } else if (this.chooseDevice[i].type == 2) {
          cameraIds.push(this.chooseDevice[i].id)
        }
      }

      let obj = {
        platId: this.$parent.queryParams.platId,
        organizationId: this.organizationId,
        cameraIds: cameraIds,
        groupIds: groupIds,
        syncGroup: this.syncGroup
      }

      this.maskloading = true
      this.$api
        .allocateDeviceAcc(obj)
        .then(res => {
          if (res.resultCode == 0) {
            this.$message({
              type: 'success',
              message: this.$t('accessAllocate.allocatedSuccess')
            })
            this.$parent.handleFind()
            this.$parent.allcateTreeDialogVisible = false
            this.maskloading = false
          } else {
            this.maskloading = false
            // 全部失败 || 部分成功
            if (res.resultCode === 201105 || res.resultCode === 201106) {
              this.$parent.resultlist = res.resultList.filter(item => item.resultCode != 0)
              this.$parent.allcateErrorDialogVisible = true
            }
          }
        })
        .catch(err => {
          this.maskloading = false
        })
    },
    iconSty(node) {
      if (node.type == 1) {
        return 'aci-x006-folder iconCss1'
      } else {
        return getDevIcon(node.payload.cameraStatus, node.payload.ptzType)
      }
    }
  }
}
</script>

<style lang="scss">
.accessDeviceAllocateDialog {
  .el-dialog__body {
    padding: 0px 20px 5px !important;
    .el-input .el-input__inner {
      background: #f2f2f2;
      border: 0px solid #d2d2d2;
    }
    .devicetree {
      width: 100%;
      height: 500px;
      background-color: #f2f2f2;
      overflow-y: hidden;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: pointer;
      .orgTree {
        height: 420px;
        margin-left: 10px;
        overflow-y: auto;
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
