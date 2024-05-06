<template>
  <div class="user-tree-container">
    <div v-if="showSearch" class="search-container">
      <el-input
        v-model="searchName"
        :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
        :maxlength="128"
        clearable
      >
        <el-icon class="el-input__icon"  @click="searchCamera"><el-icon-search /></el-icon>
      </el-input>
      <el-popover ref="reference" placement="bottom-end" trigger="click" width="350">
        <div v-loading="searchLoading">
          <div v-if="searchCameraList.length == 0" style="text-align: center">
            {{ $t('public.noData') }}
          </div>
          <div v-else-if="searchCameraList.length > 50" style="text-align: center">
            {{ $t('public.searchPrecisely') }}
          </div>

          <ul v-else class="searchedUl search-result">
            <li v-for="(item, index) in searchCameraList" :key="index" class="searchedLi">
              <i :class="iconStyUser(item)" />
              <span class="camera-name" :title="item.label">
                {{ item.label }}
              </span>
              <el-icon
                class="locateIcon"
                :title="$t('public.position')"
                @click="searchParent(item)"
              >
                <el-icon-location-outline />
              </el-icon>
            </li>
          </ul>
        </div>
      </el-popover>
    </div>
    <div
      class="tree-container"
      v-loading="zTreeLoading"
      :element-loading-text="$t('public.loading')"
      
      :style="{
        marginTop: showSearch ? '10px' : '0',
        height: showSearch ? 'calc(100% - 46px)' : '100%'
      }"
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
import {
  Search as ElIconSearch,
  LocationFilled as ElIconLocationOutline
} from '@element-plus/icons-vue'
import GiantTree from 'vue-giant-tree'
export default {
  components: {
    GiantTree,
    ElIconSearch,
    ElIconLocationOutline
  },
  name: 'device-tree',
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    showSearch: {
      type: Boolean,
      default: false
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
      camIcon.className = this.iconStyUser(treeNode)
      camIcon.style.marginRight = '0px'
      firstDom.appendChild(camIcon)
    },
    iconStyUser(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci aci-organization iconCss1'
      } else if (node.type == 1) {
        return 'aci aci-x006-folder iconCss1'
      } else if (node.type == 2) {
        return 'aci aci-person iconCss1'
      }
    },
    async searchCamera() {
      if (this.searchName === '') {
        this.$message({
          type: 'warning',
          message: this.$t('alarmList.inputCameraName')
        })
        return
      }
      try {
        this.searchLoading = true
        let data = {
          searchName: this.searchName,
          pageInfo: {
            pageNum: 1,
            pageSize: this.$maxPageSize
          },
          deviceType: this.deviceType
        }
        const res = await this.$api.searchInDeviceTree(data)
        if (res.resultCode == 0) {
          this.searchCameraList = res.nodeList
        }
      } finally {
        this.searchLoading = false
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

        if (res.resultCode == 0) {
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
        const response = await this.$api.getUserTree({
          type: 2,
          parentId
        })
        const nodeList = this.normalizeTreeData(response.nodeList)
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
    normalizeTreeData(data) {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          data[i] = this.normalizeTreeData(data[i])
        }
      } else if (typeof data === 'object') {
        data.isParent = data.type === '1'
        data.nocheck = data.type === '1'
        if (data.children) {
          data.children = this.normalizeTreeData(data.children)
        }
      }
      return data
    },
    onTreeCreated(zTree) {
      this.zTree = zTree
      const nodes = this.zTree.getNodes()
      if (nodes.length > 0 && nodes[0].isParent) {
        // 展开该节点 触发事件
        this.zTree.expandNode(nodes[0], true, false, true, true)
      }
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
      this.selectedCameras = this.zTree.getCheckedNodes(true)
      this.$emit('check-change', this.selectedCameras)
    },
    async beforeExpand(treeNode) {},
    checkNode(id, checked, checkTypeFlag = true, callbackFlag = false) {
      const node = this.zTree.getNodeByParam('id', id, null)
      if (!node) return
      this.zTree.checkNode(node, checked, checkTypeFlag, callbackFlag)
    }
  }
}
</script>
