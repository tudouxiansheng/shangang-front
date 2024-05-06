<template>
  <div class="device-tree-container">
    <div class="search-container">
      <el-input
        class="modifyBgTwo"
        v-model="searchName"
        :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
        :maxlength="128"
        clearable
        ref="buttonRef"
      >
        <template #suffix>
          <el-popover v-if="searchName" placement="bottom-end" trigger="click" width="350">
            <div v-loading="searchLoading">
              <div v-if="searchCameraList.length === 0" style="text-align: center">
                {{ $t('public.noData') }}
              </div>
              <div v-else-if="searchCameraList.length > 50" style="text-align: center">
                {{ $t('public.searchPrecisely') }}
              </div>

              <ul v-else class="searchedUl search-result">
                <li v-for="(item, index) in searchCameraList" :key="index" class="searchedLi">
                  <i :class="iconSty_search(item)" />
                  <span class="camera-name" :title="item.label">
                    {{ item.label }}
                  </span>
                  <el-icon
                    class="locateIcon"
                    :title="$t('public.position')"
                    @click="searchParent(item)"
                  >
                    <Location />
                  </el-icon>
                </li>
              </ul>
            </div>
            <template #reference>
              <el-icon class="el-input__icon searchIcon">
                <Search @click="searchCamera" />
              </el-icon>
            </template>
          </el-popover>
        </template>
      </el-input>
    </div>
    <div
      class="tree-container"
      v-loading="zTreeLoading"
      :element-loading-text="$t('public.loading')"
      
    >
      <giant-tree
        v-if="initTree"
        ref="giantTree"
        :nodes="treeData"
        :setting="treeSetting"
        @onCreated="onTreeCreated"
      />
    </div>
  </div>
</template>

<script>
import { Search, Location } from '@element-plus/icons-vue'
import devIcon from '@/utils/common/dev-icon.js'
import GiantTree from 'vue-giant-tree'
const { getDevIcon } = devIcon()
export default {
  components: {
    GiantTree,
    Search,
    Location
  },
  name: 'device-tree',
  props: {
    max: {
      type: Number,
      default: Infinity
    }
  },
  data() {
    return {
      searchName: '',
      searchLoading: false,
      searchCameraList: [],
      initTree: false,
      zTree: null,
      zTreeLoading: false,
      treeData: [],
      selectedCameras: [],
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          radioType: 'all'
        },
        data: {
          key: {
            isParent: 'isParent',
            name: 'label'
          },
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: -1
          }
        },
        view: {
          fontCss: { color: '#2d2d2d' },
          expandSpeed: '',
          showIcon: true,
          addDiyDom: this.addDiyDom
        },
        callback: {
          beforeCheck: (treeId, treeNode) => {
            return this.beforeCheck(treeNode)
          },
          onCheck: (event, treeId, treeNode) => {
            return this.onNodeCheck(treeNode)
          },
          beforeExpand: (treeId, treeNode) => {
            return this.beforeExpand(treeNode)
          }
        }
      }
    }
  },
  created() {
    this.fetchTreeData() // 获取顶级数据
  },
  methods: {
    addDiyDom(treeId, treeNode) {
      const aObj = document.getElementById(`${treeNode.tId}_a`)
      let camIcon = document.createElement('i')
      const firstDom = aObj.firstChild

      if (treeNode.type == 1 && treeNode.payload.type == 1) {
        camIcon.className = 'aci aci-organization iconCss1'
      } else if (treeNode.type == 1) {
        camIcon.className = 'aci aci-x006-folder iconCss1'
      } else {
        camIcon.className = getDevIcon(treeNode.payload.status, treeNode.payload.deviceType)
      }
      camIcon.style.marginRight = '0px'
      firstDom.appendChild(camIcon)
    },
    searchCamera() {
      if (this.searchName === '') {
        this.$message({
          type: 'warning',
          message: this.$t('alarmList.inputCameraName')
        })
        return
      }
      this.searchLoading = true
      let data = {
        searchName: this.searchName,
        pageInfo: {
          pageNum: 1,
          pageSize: this.$maxPageSize
        },
        deviceType: this.deviceType
      }
      this.$api
        .searchInDeviceTree(data)
        .then(res => {
          if (res.resultCode == 0) {
            this.searchCameraList = res.nodeList
          }
        })
        .finally(() => {
          this.searchLoading = false
        })
    },
    iconSty_search(item) {
      if (item.type == 1) {
        return 'aci-x006-folder iconCss1 aci'
      } else {
        //图标单独的文件，更改方法
        return getDevIcon(item.status, item.subType)
      }
    },
    //搜索父节点定位
    async searchParent(item) {
      try {
        this.zTreeLoading = true
        let res = await this.$api.locateInDeviceTree({
          nodeId: item.id,
          nodeType: item.type
        })

        if (res.resultCode === 0) {
          this.zTreeLoading = false
          for (let i = 0; i < res.parents.length; i++) {
            let exNode = this.zTree.getNodeByParam('id', res.parents[i].parentId, null)
            await this.beforeExpand(exNode)
          }
          await this.$nextTick()
          let exNode_now = this.zTree.getNodeByParam('id', item.id, null)
          this.zTree.selectNode(exNode_now)
        }
      } finally {
        this.zTreeLoading = false
      }
    },
    async fetchTreeData(parentId = '', node) {
      if (this.zTreeLoading) return
      try {
        this.zTreeLoading = true
        const response = await this.$api.getDeviceTree({
          type: 1,
          parentId
        })
        const nodeList = response.nodeList.map(node => {
          node.isParent = !node.leaf
          node.nocheck = !node.leaf
          if (node.type === '1') {
            node.label = `${node.label} (${node.payload.onlineCount}/${node.payload.totalCount})`
          }
          return node
        })
        if (node) {
          // 如果有 node 参数，则为懒加载子节点
          this.zTree.addNodes(node, nodeList)
        } else {
          // 如果没有 node 参数，初始化树数据
          this.treeData = nodeList
          this.initTree = true
        }
      } finally {
        this.zTreeLoading = false
      }
    },
    async onTreeCreated(zTree) {
      this.zTree = zTree
      const nodes = this.zTree.getNodes()
      if (nodes.length > 0 && nodes[0].isParent) {
        // 展开该节点 不触发事件
        await this.fetchTreeData(nodes[0].id, nodes[0])
        this.zTree.expandNode(nodes[0], true, false, true, false)
      }
      await this.$nextTick()
      this.$emit('tree-created', this)
    },
    beforeCheck(treeNode) {
      if (!treeNode.checked) {
        if (this.selectedCameras.length >= this.max) {
          this.$message.warning(`${this.$t('public.maxSelectDevLength', { num: this.max })}`)
          return false
        }
      }
      return true
    },
    onNodeCheck(treeNode) {
      this.$emit('on-check', {
        node: treeNode,
        treeRef: this
      })
      this.selectedCameras = this.zTree.getCheckedNodes(true)
      this.$emit('check-change', this.selectedCameras)
    },
    async beforeExpand(treeNode) {
      if (!treeNode.children || treeNode.children.length === 0) {
        await this.fetchTreeData(treeNode.id, treeNode)
      }
    },
    async checkNode(id, checked, checkTypeFlag = true, callbackFlag = false) {
      let node = this.zTree.getNodeByParam('id', id, null)
      if (!node) {
        // 找不到节点，可能是懒加载的节点，需要先加载
        let res = await this.$api.locateInDeviceTree({
          nodeId: id,
          nodeType: 2
        })
        if (res.resultCode === 0) {
          for (let i = 0; i < res.parents.length; i++) {
            let exNode = this.zTree.getNodeByParam('id', res.parents[i].parentId, null)
            await this.beforeExpand(exNode)
          }
          await this.$nextTick()
          node = this.zTree.getNodeByParam('id', id, null)
        }
        if (!node) return
      }
      this.zTree.checkNode(node, checked, checkTypeFlag, callbackFlag)
    }
  }
}
</script>
<style lang="scss">
.device-tree-container {
  .modifyBg {
    .el-input__wrapper {
      background: #fafafa !important;
      color: #262626;
      border: 1px solid #fafafa !important;
    }
  }
  .modifyBgTwo {
    .el-input__inner {
      border: 1px solid #f2f2f2 !important;
    }
    .searchIcon {
      cursor: pointer;
    }
  }
}
</style>
