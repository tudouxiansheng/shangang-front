<template>
  <!-- 左侧 资源查询 -->
  <div class="device-resource">
    <div class="title">
      <span>{{ $t('gis.resourceQuery') }}</span>
      <i
        :class="[isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right', 'icon']"
        @click="isShow = !isShow"
      />
    </div>

    <el-tabs v-show="isShow" v-model="activeName">
      <el-tab-pane :label="$t('gis.controlResources')" name="1">
        <el-autocomplete
          v-model="searchcameraName"
          class="searchInput"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          :placeholder="$t('gis.nameSearch')"
          clearable
          @select="cameraTreeSelect"
        />

        <el-select v-model="subType" @change="subTypeChange">
          <el-option :label="$t('gis.all')" value />
          <el-option
            v-for="(item, index) in devTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <div
          v-if="treeShow"
          class="orgHomeTree"
          v-loading="locateLoading || treeLoading"
          :element-loading-text="!treeLoading ? $t('gis.locateLoading') : $t('gis.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.5) !important"
        >
          <zTree :setting="setting" :nodes="deviceTreeData" @onCreated="treeCreated" />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('favorite.favorite')" name="2">
        <div class="favorite-handle">
          <i class="el-icon-plus" @click="favoriteAdd" />
          <i
            class="el-icon-edit-outline"
            :class="[favoriteHandle ? 'disabled' : '']"
            @click="favoriteEdit"
          />
          <i
            class="el-icon-delete"
            :class="[!favoriteHandle || cameraSelected.length > 0 ? 'active' : 'disabled']"
            @click="favoriteDel"
          />
          <i class="el-icon-refresh" @click="favoriteRefresh" />
        </div>
        <div
          class="orgHomeTree orgHomeTree1"
          v-loading="favoriteLoading"
          :element-loading-text="$t('gis.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.5) !important"
        >
          <zTree
            :setting="favoriteSetting"
            :nodes="favoriteTreeData"
            @onCreated="favoriteTreeCreated"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 收藏夹对话框 -->
    <favorite-dialog />
  </div>
</template>

<script>
import devDict from '@/mixin/dev-dict.js'
import devIcon from '@/utils/dev-icon'
const { getDevIcon } = devIcon()

import zTree from 'vue-giant-tree'
const favoriteDialog = () => import('../favorite/favorite-dialog.vue')
export default {
  mixins: [devDict],
  components: {
    zTree,
    'favorite-dialog': favoriteDialog
  },

  data() {
    return {
      isShow: true,

      activeName: '1',
      // 设备树
      searchcameraName: '', // 树模糊搜索
      subType: '',
      treeShow: true,
      treeObj: {},
      deviceTreeData: [],
      setting: {
        data: {
          key: {
            name: 'label'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentId',
            idKey: 'id',
            rootPId: 0
          }
        },
        view: {
          fontCss: {
            color: '#42526E',
            fontsize: '14px',
            fontFamily: 'PingFang SC',
            fontWeight: 400
          },
          expandSpeed: '',
          showIcon: true,
          showLine: false,
          addDiyDom: this.addDiyDom
        },
        callback: {
          onExpand: this.zTreeOnExpand,
          onClick: this.zTreeOnClick
        }
      },
      locateLoading: false,
      treeLoading: true,

      clickFlag: null,

      // 收藏夹
      favoriteTreeObj: {},
      favoriteTreeData: [],
      favoriteSetting: {
        data: {
          key: {
            name: 'label'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentId',
            idKey: 'id',
            rootPId: 0
          }
        },
        check: {
          enable: true
        },
        view: {
          fontCss: {
            color: '#42526E',
            fontsize: '14px',
            fontFamily: 'PingFang SC',
            fontWeight: 400
          },
          expandSpeed: '',
          showIcon: true,
          showLine: false,
          addDiyDom: this.favoriteTreeDiyDom
        },
        callback: {
          onCheck: this.favoriteTreeCheck,
          onClick: this.favoriteTreeClick
        }
      },
      favoriteHandle: true,
      favoriteLoading: false,
      favoriteId: '',
      favoriteName: '',
      cameraSelected: [],
      // 添加修改
      dialogFormVisible: false,
      maskloading: false,
      operation: false,
      dataForm: {},

      getDevFlag: false
    }
  },
  mounted() {
    this.findTreeData()
    this.getFavoriteTree()
  },
  methods: {
    openTabs(isShow) {
      this.isShow = isShow
    },
    // 树模糊查询
    querySearchAsync(searchName, cb) {
      if (searchName == '') {
        cb([])
        return
      }
      let data = {
        searchName,
        deviceSubType: this.subType
      }
      this.subType != '' ? (data.deviceType = 1) : null
      this.$api.searchInDeviceTree(data).then(res => {
        const nodeList = res.nodeList || []
        nodeList.forEach(item => (item.value = item.label))
        cb(nodeList)
      })
    },
    subTypeChange() {
      this.searchcameraName = ''
      this.treeShow = false
      this.$nextTick(() => {
        this.treeShow = true
        this.findTreeData()
      })
    },

    createStateFilter(queryString) {
      return searchcameraName => {
        return searchcameraName.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 高亮树节点
    async setCurrentKey(cameraId, searchName, reLocation = true) {
      this.searchcameraName = ''
      if (!searchName) return
      const res = await this.$api.searchInDeviceTree({ searchName })
      const nodeList = res.nodeList ? res.nodeList.filter(item => item.id == cameraId) : null
      nodeList && this.cameraTreeSelect(nodeList[0], reLocation)
    },

    async cameraTreeSelect(item, reLocation = true) {
      this.locateLoading = true
      if (item.parents) {
        for (let i = 0; i < item.parents.length; i++) {
          const exNode = this.treeObj.getNodeByParam('id', item.parents[i].parentId, null)
          await this.zTreeOnExpand('', '', exNode)
          if (i == item.parents.length - 1) {
            const exNode_now = this.treeObj.getNodeByParam('id', item.id, null)
            this.treeObj.selectNode(exNode_now)
            this.locateLoading = false
          }
        }
      } else {
        this.locateLoading = false
      }
      if (item.type == 2) {
        this.getCameraInfo(item.id, reLocation) // 详情
      }
    },

    treeCreated(e) {
      this.treeObj = e
    },
    // 获取菜单树
    async findTreeData() {
      this.treeLoading = true
      const data = { type: 1, deviceSubType: this.subType }
      this.subType != '' ? (data.deviceType = 1) : null
      const res = await this.$api.getDeviceTree(data)
      const nodeList = res.nodeList || []
      if (nodeList.length >= 1) {
        let myNodes = this.cameraTreeNodes(nodeList)
        this.deviceTreeData = myNodes
      }
      this.treeLoading = false
      // 加载第二级
      let timeOut = setTimeout(() => {
        const nodes = this.treeObj.getNodes()
        if (nodes.length && !nodes[0].children) {
          nodes[0].isParent = true
          this.getTree(nodes[0])
        }
        clearTimeout(timeOut)
      }, 100)
    },
    cameraTreeNodes(nodeList) {
      for (let index = 0; index < nodeList.length; index++) {
        const item = nodeList[index]
        if (item.type == 2) {
          item.isParent = false
        } else {
          item.isParent = true
          item.label =
            item.label + ' (' + item.payload.onlineCount + '/' + item.payload.totalCount + ')'
        }
        if (item.children) this.cameraTreeNodes(item.children)
      }
      return nodeList
    },

    async getTree(treeNode) {
      const data = {
        type: 1,
        parentId: treeNode.id,
        deviceSubType: this.subType
      }
      this.subType != '' ? (data.deviceType = 1) : null
      const res = await this.$api.getDeviceTree(data)
      const nodeList = res.nodeList || []
      let myNodes = this.cameraTreeNodes(nodeList)
      this.treeObj.addNodes(treeNode, myNodes)
    },

    // zTree展开节点
    async zTreeOnExpand(event, treeId, treeNode) {
      if (treeNode) {
        if ((treeNode.children && treeNode.children.length > 0) || treeNode.type == 2) {
          return
        } else {
          await this.getTree(treeNode)
          treeNode.expanded = true
        }
      }
    },
    // 单击定位地图
    zTreeOnClick(event, treeId, treeNode) {
      if (this.clickFlag) this.clickFlag = clearTimeout(this.clickFlag) // 取消上次延时未执行的方法
      this.clickFlag = setTimeout(() => {
        if (treeNode.type == 2) this.getCameraInfo(treeNode.id) // 详情
      }, 300)
    },

    addDiyDom(treeId, treeNode) {
      var aObj = document.getElementById(`${treeNode.tId}_a`)
      const camIcon = document.createElement('i')
      if (treeNode.type == 1 && treeNode.payload.type == 1) {
        camIcon.className = 'aci aci-organization iconCss1'
      } else if (treeNode.type == 1) {
        camIcon.className = 'aci aci-x006-folder iconCss1'
      } else {
        const status = treeNode.payload.status
        const deviceType = treeNode.payload.deviceType
        camIcon.className = getDevIcon(status, deviceType)
      }
      camIcon.style.marginRight = '0px'
      aObj.firstChild.appendChild(camIcon)
    },

    async getCameraInfo(cameraId, reLocation = true) {
      const res = await this.$api.getCameraInfoQuery({ cameraId })
      if (res.resultCode == 0) {
        let cameraInfo = {
          deviceId: res.cameraInfo?.cameraId || '',
          deviceName: res.cameraInfo?.cameraName || '',
          deviceType: res.cameraInfo?.ptzType || '',
          status: res.cameraInfo?.status || '',
          longitude: res.cameraInfo?.longitude || '',
          latitude: res.cameraInfo?.latitude || '',
          resolution: res.cameraInfo?.resolution || ''
        }
        this.$emit('deviceToMap', {
          cameraInfo,
          reLocation
        })
      }
    },

    // 收藏夹
    favoriteTreeCreated(e) {
      this.favoriteTreeObj = e
      this.favoriteTreeObj.expandAll(true)
    },
    async getFavoriteTree() {
      this.favoriteHandle = true
      this.favoriteId = ''
      this.favoriteName = ''

      this.favoriteLoading = true
      const res = await this.$api.getFavoriteCamList({})
      this.favoriteLoading = false
      if (res.resultCode != 0) return

      const rootId = sessionStorage.getItem('account')
      this.favoriteParentId = rootId
      this.favoriteTreeData = [
        {
          id: rootId,
          parentId: -1,
          label: this.$t('favorite.favorite'),
          type: 1,
          children: [],
          nocheck: true,
          highlight: true
        }
      ]
      const arr = res.nodeList || []
      this.favoriteTreeRecursion(arr)
      this.favoriteTreeData[0].children = arr
      let exNode_now = this.favoriteTreeObj.getNodeByParam('id', rootId, null)
      this.favoriteTreeObj.selectNode(exNode_now)
    },
    // 收藏夹树处理
    favoriteTreeRecursion(data) {
      data.forEach(item => {
        if (item.type == 1) {
          item.nocheck = true
          item.label =
            item.label + ' (' + item.payload.onlineCount + '/' + item.payload.totalCount + ')'
        }
        if (item.children) this.favoriteTreeRecursion(item.children)
      })
    },
    favoriteTreeDiyDom(treeId, treeNode) {
      var aObj = document.getElementById(`${treeNode.tId}_a`)
      const camIcon = document.createElement('i')
      if (treeNode.type == 1) {
        camIcon.className = 'aci aci-x006-folder iconCss1'
      } else {
        const status = treeNode.payload.status
        const deviceType = treeNode.payload.ptzType
        camIcon.className = getDevIcon(status, deviceType)
      }
      camIcon.style.marginRight = '0px'
      aObj.firstChild.appendChild(camIcon)
    },
    favoriteTreeClick(event, treeId, treeNode) {
      if (this.clickFlag) this.clickFlag = clearTimeout(this.clickFlag) // 取消上次延时未执行的方法
      this.clickFlag = setTimeout(() => {
        if (treeNode.type == 2) this.getCameraInfo(treeNode.id) // 详情
      }, 300)

      if (treeNode.type == 1 && treeNode.id != sessionStorage.getItem('account')) {
        this.favoriteHandle = false
        this.favoriteId = treeNode.id
        this.favoriteName = treeNode.payload.favoriteName
      } else {
        this.favoriteHandle = true
        this.favoriteId = ''
        this.favoriteName = ''
      }
    },
    // 设备节点选中
    favoriteTreeCheck() {
      this.cameraSelected = this.favoriteTreeObj.getChangeCheckedNodes()
    },
    // 添加收藏夹节点
    async favoriteAdd() {
      this.dataForm = {
        favoriteName: '',
        favoriteId: this.favoriteId
      }
      this.operation = true
      this.dialogFormVisible = true
    },
    // 修改收藏夹节点
    async favoriteEdit() {
      if (this.favoriteHandle) return
      this.dataForm = {
        favoriteName: this.favoriteName,
        favoriteId: this.favoriteId
      }
      this.operation = false
      this.dialogFormVisible = true
    },
    // 删除
    async favoriteDel() {
      if (!(!this.favoriteHandle || this.cameraSelected.length > 0)) return
      if (this.cameraSelected.length > 0) {
        // 设备取消收藏
        for (let i = 0; i < this.cameraSelected.length; i++) {
          const ele = this.cameraSelected[i]
          await this.$api.operFavoriteCamera({
            cameraId: ele.payload.cameraId,
            operType: '0'
          })
        }
      } else {
        // 收藏夹删除
        await this.$api.deleteFavoriteInfo({
          favoriteId: this.favoriteId
        })
      }
      this.favoriteRefresh()
    },
    // 刷新
    favoriteRefresh() {
      this.getFavoriteTree()
    }
  }
}
</script>

<style lang="scss">
.device-resource {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #fff;
  width: 300px;
  border-radius: 4px;
  z-index: 999;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  .title {
    position: relative;
    height: 18px;
    line-height: 18px;
    padding: 16px 20px;
    font-size: 16px;
    color: #232c3b;
    box-sizing: content-box;
    span {
      font-family: Microsoft YaHei;
      font-weight: bold;
    }

    .icon {
      position: absolute;
      right: 20px;
      cursor: pointer;
      color: #c1c7d0;
    }
    .el-icon-arrow-right:before {
      color: #c1c7d0;
    }
  }

  .el-tabs {
    padding: 20px;
    height: 100%;
    border-top: 1px solid #ebecf0;

    .el-tabs__content {
      height: 92%;
      overflow: visible;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__item {
      padding: 0;
      width: 50%;
      text-align: center;
      border-bottom: 1px solid #ebecf0;
    }
    .el-tabs__nav-wrap::after {
      width: 0;
    }

    .el-menu .el-tabs__item,
    .el-tabs__header .el-tabs__item {
      background: transparent !important;
    }
  }
  .el-select {
    width: 100%;
    margin-top: 10px;
    border-bottom: 1px solid #ebecf0;
    padding-bottom: 20px;
  }
  .el-input__inner {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
  .searchInput {
    width: 100%;

    .el-input__inner {
      height: 32px;
    }
  }
  .orgHomeTree {
    height: 54vh;
    margin-top: 20px;
    .ztree {
      height: 54vh;
      overflow: auto;
      i,
      span {
        font-size: 14px !important;
      }
      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        background-color: #f2f2f2 !important;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        background-color: #b3b3b3 !important;
      }

      // 定义滚动条轨道 边角
      &::-webkit-scrollbar-corner {
        background-color: #f2f2f2 !important;
      }
    }
  }
  .orgHomeTree1 {
    height: 60vh;
    .ztree {
      height: 60vh;
    }
  }
  .favorite-handle {
    display: flex;
    justify-content: flex-end;
    i {
      font-size: 20px;
      margin: 10px 0 0px 10px;
      cursor: pointer;
      color: #7a869a;
      &:hover {
        color: #2c6dd2;
      }
    }
    .disabled {
      cursor: not-allowed;
      pointer-events: none;
      color: #c1c7d0;
    }
  }
}
</style>
