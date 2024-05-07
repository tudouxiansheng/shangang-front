<template>
  <div id="source-tree-wrapper">
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane :label="$t('analysisTask.devList')" name="camera"></el-tab-pane>
    </el-tabs>

    <div class="clientBox">
      <div class="cameraTree" v-show="activeName === 'camera'">
        <div style="display: flex; justify-content: space-between; padding-right: 7px">
          <el-input
            v-model="searchName"
            :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
            clearable
          />

          <el-button v-if="!searchName" type="primary" class="searchBtn" @click="searchCamera">
            {{ $t('public.search') }}
          </el-button>

          <el-popover
            v-if="searchName"
            placement="bottom-end"
            trigger="click"
            :width="longNav ? 330 : 305"
          >
            <div v-loading="searchLoading">
              <div v-if="searchCameraList.length == 0" style="text-align: center">
                {{ $t('public.noData') }}
              </div>
              <div v-else-if="searchCameraList.length > 50" style="text-align: center">
                {{ $t('public.searchPrecisely') }}
              </div>

              <ul v-else class="searchedUl">
                <li v-for="(item, index) in searchCameraList" :key="index" class="searchedLi">
                  <i :class="iconSty_search(item)" class="aci" />
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
            <template #reference>
              <el-button type="primary" class="searchBtn" @click="searchCamera">
                {{ $t('public.search') }}
              </el-button>
            </template>
          </el-popover>
        </div>
        <div
          v-loading="zTreeLoading"
          :element-loading-text="$t('public.positioning')"
          
          class="zTreeWrapper"
        >
          <zTree :setting="setting" :nodes="zTreeNodes" @onCreated="treeCreated" class="zTreeNow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LocationFilled as ElIconLocationOutline } from '@element-plus/icons-vue'
import zTree from 'vue-giant-tree'

export default {
  components: {
    zTree,
    ElIconLocationOutline
  },
  data() {
    return {
      activeName: 'camera',
      searchLoading: false,
      searchCameraList: [],
      searchName: '',
      //zTree
      setting: {
        check: {
          enable: true
        },
        data: {
          key: {
            children: 'children',
            isParent: 'isParent',
            isHidden: 'isHidden',
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
          fontCss: { color: '#ffffff' },
          expandSpeed: '',
          showIcon: true,
          addDiyDom: this.addDiyDom
        },
        callback: {
          beforeExpand: this.beforeExpand,
          onExpand: this.zTreeOnExpand,
          onCheck: this.zTreeOnCheck
        }
      },
      zTreeLoading: false,
      zTreeNodes: [],
      treeObj: {},
      checkedNodes: [],
      checkedNodes1: [],
      checkedCameras: []
    }
  },
  watch: {
    activeName: {
      handler(newV) {
        this.$emit('selTypeChange', newV === 'camera' ? 1 : 2)
      },
      immediate: true
    },
    checkedNodes(newV) {
      this.$emit('selectionChange', newV)
    }
  },
  computed: {
    longNav: {
      get() {
        return this.$store.state.menu.longNav
      },
      set(val) {
        this.$store.commit('menu/set_longNav', val)
      }
    },

    iconSty_search(node) {
      return node => {
        if (node.type == 1) {
          return 'aci-x006-folder iconCss1'
        } else {
          if (node.subType == 1 && node.status == 1) {
            return 'aci-camera-gun iconCss1'
          } else if (node.subType == 2 && node.status == 1) {
            return 'aci-camera-ptz iconCss1'
          } else if (node.subType == 3 && node.status == 1) {
            return 'aci-camera-ball iconCss1'
          } else if (node.subType == 5 && node.status == 1) {
            return 'aci-camera1 iconCss1'
          } else if (node.subType == 1 && (node.status == 0 || node.status == 2)) {
            return 'aci-camera-gun iconCss2'
          } else if (node.subType == 2 && (node.status == 0 || node.status == 2)) {
            return 'aci-camera-ptz iconCss2'
          } else if (node.subType == 3 && (node.status == 0 || node.status == 2)) {
            return 'aci-camera-ball iconCss2'
          } else if (node.subType == 5 && (node.status == 0 || node.status == 2)) {
            return 'aci-camera1 iconCss2'
          }
        }
      }
    }
  },
  async mounted() {
    await this.findTreeData()
    await this.getTree()
  },
  methods: {
    getTree() {
      setTimeout(() => {
        let nodes = this.treeObj.getNodes()
        if (!nodes[0].children) {
          nodes[0].isParent = true

          let data = {
            type: 1,
            parentId: nodes[0].id,
            deviceType: 1
          }
          this.$api.getDeviceTree(data).then(res => {
            let nodeList = res.nodeList
            for (let i = 0, len = nodeList.length; i < len; i++) {
              const element = nodeList[i]
              if (element.type == 2) {
                element.isParent = false
              } else {
                element.isParent = true
              }

              if (nodeList[i].type == 1) {
                element.label =
                  nodeList[i].label +
                  ' (' +
                  nodeList[i].payload.onlineCount +
                  '/' +
                  nodeList[i].payload.totalCount +
                  ')'
              }
            }
            this.treeObj.addNodes(nodes[0], nodeList)

            let aObj = document.getElementById(`${nodes[0].tId}_a`)
            aObj.firstChild.firstChild.src = require('@/assets/img/common/tree2.png')
            nodes[0].expanded = true
          })
        }
        if (nodes.length > 0) {
          this.treeObj.expandNode(nodes[0], true, false, true)
        }
      }, 100)
    },
    // 树勾选
    treeCheck() {
      // 选择节点和右侧对应
      let checkedCameras = []
      for (let i = 0; i < this.checkedNodes.length; i++) {
        const item = this.checkedNodes[i]
        checkedCameras.push(item.id)
        this.treeObj.checkNode(this.treeObj.getNodeByParam('id', item.id, null), true, false)
      }

      this.checkedCameras = checkedCameras
      this.checkAll = true
      let checkedTreeNodes = this.treeObj.getChangeCheckedNodes().filter(item => {
        return item.type == 2
      })
      // 判断已经勾选的节点是否被选择，未选中则取消选中
      for (let j = 0; j < checkedTreeNodes.length; j++) {
        let isExist = false
        const item = checkedTreeNodes[j]
        for (let i = 0; i < checkedCameras.length; i++) {
          const item1 = checkedCameras[i]
          if (item1 == item.id) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          this.treeObj.checkNode(this.treeObj.getNodeByParam('id', item.id, null), false, true)
        }
      }
    },
    // 获取菜单树
    async findTreeData(parentId, resolve) {
      let data = {
        type: 1,
        deviceType: 1
      }
      parentId !== '' ? (data.parentId = parentId) : null

      let res = await this.$api.getDeviceTree(data)
      if (res.resultCode == 0) {
        let nodeList = res.nodeList
        if (nodeList.length > 1) {
          for (let i = 0; i < nodeList.length; i++) {
            let myNodes = this.handleNodes(nodeList[i])
            if (myNodes[0].type == 1) {
              myNodes[0].label =
                myNodes[0].label +
                ' (' +
                myNodes[0].payload.onlineCount +
                '/' +
                myNodes[0].payload.totalCount +
                ')'
            }

            this.zTreeNodes = this.zTreeNodes.concat(myNodes)
          }
        } else {
          let myNodes = this.handleNodes(nodeList[0])
          if (myNodes[0].type == 1) {
            myNodes[0].label =
              myNodes[0].label +
              ' (' +
              myNodes[0].payload.onlineCount +
              '/' +
              myNodes[0].payload.totalCount +
              ')'
          }
          this.zTreeNodes = myNodes
        }
      }
    },
    handleNodes(node) {
      let returnNodes = [node]
      if (node.children && node.children.length > 0) {
        for (let index = 0; index < node.children.length; index++) {
          const element = node.children[index]
          if (node.children[index].type == 2) {
            node.children[index].isParent = false
          } else {
            node.children[index].isParent = true
          }
          if (node.children[index].type == 1) {
            node.children[index].label =
              node.children[index].label +
              ' (' +
              node.children[index].payload.onlineCount +
              '/' +
              node.children[index].payload.totalCount +
              ')'
          }
          returnNodes.push(...this.handleNodes(element))
        }
        delete node.children
      }
      return returnNodes
    },
    handleNodes_num(node) {
      let returnNodes = [node]
      if (node.children && node.children.length > 0) {
        for (let index = 0; index < node.children.length; index++) {
          const element1 = node.children[index]
          if (node.children[index].type == 2) {
            node.children[index].isParent = false
          } else {
            node.children[index].isParent = true
          }
          if (node.children[index].type == 1) {
            node.children[index].label =
              node.children[index].label +
              ' (' +
              node.children[index].payload.onlineCount +
              '/' +
              node.children[index].payload.totalCount +
              ')'
          }
          returnNodes.push(...this.handleNodes_num(element1))
        }
      }
      return returnNodes
    },

    //节点展开
    expandNode(node) {
      this.zones[node.id] = node
    },
    //zTree展开节点
    async zTreeOnExpand(event, treeId, treeNode) {
      if ((treeNode.children && treeNode.children.length > 0) || treeNode.type == 2) {
        return
      }

      let data = {
        type: 1,
        parentId: treeNode.id,
        deviceType: 1
      }

      let res = await this.$api.getDeviceTree(data)
      if (res.resultCode == 0) {
        let nodeList = res.nodeList

        for (let i = 0, len = nodeList.length; i < len; i++) {
          if (nodeList[i].children) {
            if (nodeList[i].type == 2) {
              nodeList[i].isParent = false
            } else {
              nodeList[i].isParent = true
            }
            const element = this.handleNodes_num(nodeList[i])
            if (nodeList[i].type == 1) {
              element[0].label =
                nodeList[i].label +
                ' (' +
                nodeList[i].payload.onlineCount +
                '/' +
                nodeList[i].payload.totalCount +
                ')'
            }
          } else {
            const element = nodeList[i]
            if (element.type == 2) {
              element.isParent = false
            } else {
              element.isParent = true
            }
            if (nodeList[i].type == 1) {
              element.label =
                nodeList[i].label +
                ' (' +
                nodeList[i].payload.onlineCount +
                '/' +
                nodeList[i].payload.totalCount +
                ')'
            }
          }
        }
        this.treeObj.addNodes(treeNode, nodeList)

        let aObj = document.getElementById(`${treeNode.tId}_a`)
        aObj.firstChild.firstChild.src = require('@/assets/img/common/tree2.png')
        treeNode.expanded = true
      }
    },
    zTreeOnCheck(event, treeId, treeNode) {
      this.checkedNodes = this.treeObj.getChangeCheckedNodes().filter(item => {
        return item.type == 2
      })
      let checkedCameras = []
      for (let i = 0; i < this.checkedNodes.length; i++) {
        const item = this.checkedNodes[i]
        checkedCameras.push(item.id)
      }
      this.checkedCameras = checkedCameras
      this.checkAll = this.checkedCameras.length != 0 ? true : false
    },
    // 初始化渲染完成后触发，回调参数接收ztree实例
    treeCreated(e) {
      this.treeObj = e
    },
    addDiyDom(treeId, treeNode) {
      var aObj = document.getElementById(`${treeNode.tId}_a`)
      let camIcon = document.createElement('i')
      var firstDom = aObj.firstChild

      if (treeNode.type == 1 && treeNode.payload.type == 1) {
        camIcon.className = 'aci aci-organization iconCss1'
      } else if (treeNode.type == 1) {
        camIcon.className = 'aci aci-x006-folder iconCss1'
      } else {
        camIcon.className = this.getImgUrl(treeNode)
      }
      camIcon.style.marginRight = '0px'
      firstDom.appendChild(camIcon)
    },
    getImgUrl(treeNode) {
      const status = treeNode.payload.status,
        deviceType = treeNode.payload.deviceType
      if (status == 1) {
        if (deviceType == 1) {
          return 'aci aci-camera-gun iconCss1'
        } else if (deviceType == 2) {
          return 'aci aci-camera-ptz iconCss1'
        } else if (deviceType == 3) {
          return 'aci aci-camera-ball iconCss1'
        } else if (deviceType == 4) {
          return 'aci aci-camera-hemisphere iconCss1'
        } else if (deviceType == 5) {
          return 'aci aci-camera1 iconCss1'
        }
      } else if (status == 0 || status == 2) {
        if (deviceType == 1) {
          return 'aci aci-camera-gun iconCss2'
        } else if (deviceType == 2) {
          return 'aci aci-camera-ptz iconCss2'
        } else if (deviceType == 3) {
          return 'aci aci-camera-ball iconCss2'
        } else if (deviceType == 4) {
          return 'aci aci-camera-hemisphere iconCss2'
        } else if (deviceType == 5) {
          return 'aci aci-camera1 iconCss2'
        }
      }
    },
    searchCamera() {
      this.searchLoading = true
      if (this.searchName == '') {
        this.$message({
          type: 'warning',
          message: this.$t('alarmList.inputCameraName')
        })
        this.searchCameraList = []
        this.searchLoading = false
        return
      }

      this.$api
        .searchInDeviceTree({
          searchName: this.searchName,
          pageInfo: { pageNum: 1, pageSize: 200 }
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.searchCameraList = res.nodeList
          }
          this.searchLoading = false
        })
    },
    //搜索父节点定位
    async searchParent(item) {
      this.zTreeLoading = true
      let res = await this.$api.locateInDeviceTree({
        nodeId: item.id,
        nodeType: item.type
      })

      if (res.resultCode == 0) {
        for (let i = 0; i < res.parents.length; i++) {
          let exNode = this.treeObj.getNodeByParam('id', res.parents[i].parentId, null)
          await this.zTreeOnExpand('', '', exNode)
        }
        setTimeout(() => {
          let exNode_now = this.treeObj.getNodeByParam('id', item.id, null)
          this.treeObj.selectNode(exNode_now)
          this.zTreeLoading = false
        }, 200)
      } else {
        this.zTreeLoading = false
      }
    },
    beforeExpand(treeId, treeNode) {
      if (treeNode.children && treeNode.children.length > 1000) {
        let newArr = []
        for (let i = 0; i < treeNode.children.length; i += 500) {
          newArr.push(treeNode.children.slice(i, i + 500))
        }
        treeNode.children = newArr[0]
        let j = 1
        let childInterval = setInterval(() => {
          this.treeObj.addNodes(treeNode, newArr[j])
          if (j < newArr.length - 1) {
            j++
          } else {
            clearInterval(childInterval)
          }
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss">
#source-tree-wrapper {
  color: #fff;
  .el-tabs {
    background: #0a314f;
    .el-tabs__nav-scroll {
      padding-left: 0;
    }
    .el-tabs__item {
      background: #0a314f !important;
      color: #fff;
      &:hover,
      &.is-active {
        color: #409eff;
      }
    }
  }

  .cameraTree {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .zTreeWrapper {
    flex: 1;
    min-height: 0;
  }

  .clientBox {
    padding: 10px 8px 10px 15px;
    background: #0a314f;

    .el-input {
      width: calc(100% - 70px);

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }

    .searchBtn {
      margin-left: 5px;
      min-width: 60px;
      height: 36px;
    }

    .ztree {
      height: 100%;
      padding-top: 10px;
      overflow-y: auto;
      .curSelectedNode .node_name {
        background-color: #389ed8;
      }
      .button.chk {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
