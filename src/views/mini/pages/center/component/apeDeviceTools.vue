<template>
  <!-- 摄像机选择组件 -->
  <el-dialog
    :title="title"
    v-model="$parent.dialogDeviceVisibleAp"
    top="10vh"
    width="850px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    id="deviceTools"
    draggable
  >
    <!-- //取消模型的关联设备 -->
    <model-device-cancel v-if="ifShowModelDevCancel"></model-device-cancel>
    <div class="subtitle" v-show="type == 3 && step == 1">
      {{ $t('deviceManagement.selectDevices') }}{{ titleKeyword }}
      <i style="color: red">*</i>
    </div>
    <div class="tools" v-show="(type == 3 && step == 1) || type != 3">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="tabBox">
            <div class="title">{{ titleKeyword }}{{ $t('deviceManagement.resource') }}</div>
            <div class="clientBox">
              <div
                style="display: flex; justify-content: space-between; padding-right: 7px"
                v-if="!showApsTree"
              >
                <el-input
                  v-model="searchName"
                  :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
                  clearable
                />

                <el-button
                  v-if="!searchName"
                  type="primary"
                  class="searchBtn"
                  @click="searchCamera"
                >
                  {{ $t('public.search') }}
                </el-button>

                <el-popover
                  v-if="searchName"
                  placement="bottom-end"
                  trigger="click"
                  :width="longNav ? 330 : 305"
                >
                  <div v-loading="searhLoading">
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
              <div v-loading="zTreeLoading" :element-loading-text="$t('public.positioning')">
                <zTree :setting="setting" :nodes="zTreeNodes" @onCreated="treeCreated" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cameraBox">
            <div class="checkTitle">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                {{ $t('deviceManagement.selectedDevice') }}{{ titleKeyword }}({{
                  checkedCameras.length
                }}
                {{ $t('deviceManagement.stand') }})
              </el-checkbox>
            </div>
            <div class="checkList">
              <el-checkbox-group v-model="checkedCameras" @change="handleCheckedCamerasChange">
                <el-checkbox :label="item.id" v-for="item in checkedNodes" :key="item.id">
                  <span class="checkbox-item-text" :title="item.label">{{ item.label }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tools2" v-show="type == 3 && step == 2">
      <add-fault
        :cameras="checkedNodes"
        ref="faultCondition"
        @successSubmit="successFun"
      ></add-fault>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="addAllCameras" v-if="type == '1' || type == '2'">
          {{ $t('public.confirm') }}
        </el-button>

        <el-button type="primary" @click="checkedfault" v-if="type == '3' && step == 1">
          {{ $t('alarmList.theNextStep') }}
        </el-button>
        <el-button type="primary" @click="backTo" v-show="step == 2">
          {{ $t('alarmList.thePreviousStep') }}
        </el-button>
        <el-button type="primary" @click="submitFault" v-show="step == 2">
          {{ $t('public.confirm') }}
        </el-button>

        <el-button type="danger" @click="deleteNodes" v-show="step == 1">
          {{ $t('public.delete') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { LocationFilled as ElIconLocationOutline } from '@element-plus/icons-vue'
import AddFault from '@/components/AddFault'
import zTree from 'vue-giant-tree'

const modelDeviceCancel = () => import('@/views/center/algorithm/model/component/device-cancel')

export default {
  components: {
    AddFault,
    zTree,
    modelDeviceCancel,
    ElIconLocationOutline
  },
  props: {
    currentChooseCameras: {
      //确定选择的设备
      type: Array,
      default() {
        return []
      }
    },
    title: {
      //标题
      type: String
    },
    type: {
      //1：多选；2：单选；3：故障上报
      type: String
    },
    ifJudgeAiType: {
      //是否智能摄像机
      type: Boolean
    },
    guardType: {
      //算法仓布控类型
      type: String
    },
    ifSendDeviceType: {
      //车道界面
      type: String
    },
    ifSendDeviceTypeApi: {
      //设备树接口是否传deviceType
      type: String
    },
    checkedApeId: {
      //修改时用来回显的采集设备id
      type: String
    },
    showApsTree: {
      //采集设备系统树
      type: Boolean
    },
    showApeTree: {
      //采集设备树
      type: Boolean
    },
    ifSendPlatformId: {
      //设备树接口是否传PlatformId
      type: Boolean
    },
    ifSearchParents: {
      //是否查询节点的parents
      type: Boolean
    },
    ifShowModelDevCancel: {
      //是否展示取消模型关联设备的表格
      type: Boolean
    },
    showModelTree: {
      //是否展示取消模型关联设备的表格
      type: Boolean
    },
    modelId: {
      //模型Id
      type: String
    },
    showVirDevTree: {
      //展示vir的接口的设备树
      type: String
    },
    maxSelect: {
      type: Number
    },
    titleDialog: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searhLoading: false,
      searchCameraList: [],
      searchName: '',
      titleKeyword:'',
      //zTree
      setting: {
        check: {
          enable: true
        },
        keep: {},
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
          fontCss: { color: '#2d2d2d' },
          expandSpeed: '',
          showIcon: true,
          addDiyDom: this.addDiyDom
        },
        callback: {
          beforeExpand: this.beforeExpand,
          onExpand: this.zTreeOnExpand,
          beforeCheck: this.zTreeBeforeCheck,
          onCheck: this.zTreeOnCheck
        }
      },
      zTreeLoading: false,
      zTreeNodes: [],
      treeObj: {},

      checkedNodes: [],
      checkedNodes1: [],
      checkedCameras: [],
      checkAll: false,
      isIndeterminate: false,

      ifClose: true,
      step: 1,

      parents: [] //节点所有父级组织id数组
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
  mounted() {
    if (this.showApeTree) {
      this.getApeTree()
    } else if (this.showApsTree) {
      this.getApsTree()
    }
    this.$nextTick(() => {
      if (this.titleDialog == '') {
        this.titleKeyword = this.$t('deviceManagement.cameraTool')
      }else{
        this.titleKeyword=this.titleDialog
      }
      if (this.type == 2) {
        this.setting.check.chkStyle = 'radio'
        this.setting.check.radioType = 'all'
      } else {
        this.setting.check.chkStyle = 'checkbox'
      }
    })
  },
  methods: {
    getApeTree() {
      this.$api.getApeTree({}).then(res => {
        if (res.resultCode == 0) {
          this.zTreeNodes = res.nodeList
        }
      })
    },
    getApsTree() {
      this.$api.apsTree({ type: 2 }).then(res => {
        if (res.resultCode == 0) {
          this.zTreeNodes = res.nodeList
        }
      })
    },
    // 打开弹框
    dialogOpen() {
      this.$nextTick(() => {
        let path = this.$route.path
        if (path.indexOf('/turning') == -1) {
          
        } else {
          let el_dialog_wrapper = document.getElementsByClassName('el-dialog__wrapper')[0]
          el_dialog_wrapper.style.width = '100%'
          el_dialog_wrapper.style.height = '100%'
          el_dialog_wrapper.style.background = 'rgba(0,0,0,0.5)'
        }
        this.ifClose = true
      })
    },
    getTree() {
      setTimeout(() => {
        let nodes = this.treeObj.getNodes()
        if (!nodes[0].children) {
          nodes[0].isParent = true

          let data = {
            type: 1,
            parentId: nodes[0].id
          }

          if (this.ifSendDeviceTypeApi == '5') {
            data.deviceType = 5
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

        if (this.ifSendDeviceType == '5' && !this.$parent.$parent.operation) {
          this.checkedNodes = this.$parent.laneCheckedNodes
          this.checkedCameras = []
          this.checkedCameras.push(this.$parent.laneCheckedNodes[0].id)
        }
      }, 100)

      if (this.$parent.cameraList) {
        if (this.$parent.cameraList.length != 0) {
          let checkedNodes = []

          for (let i = 0; i < this.$parent.cameraList.length; i++) {
            const item = this.$parent.cameraList[i]
            checkedNodes.push({
              id: item.cameraId,
              label: item.cameraName
            })
          }
          this.checkedNodes = checkedNodes
          this.checkedNodes1 = checkedNodes
          this.treeCheck()
        } else {
          this.checkedNodes = []
          this.checkedNodes1 = []
        }
      }
    },
    // 关闭弹框
    dialogClosed() {
      if (this.ifClose) {
        this.checkedNodes = JSON.parse(JSON.stringify(this.currentChooseCameras))
      }
      if (this.checkedNodes.length == 0) {
        this.checkedCameras = []
        this.checkAll = false
        this.treeObj.checkAllNodes(false)
      } else {
        if (this.ifSendDeviceTypeApi != '5') {
          this.treeCheck()
        }
      }
      if (this.$route.path.indexOf('/turning') != -1) {
        if (JSON.stringify(this.checkedNodes) == JSON.stringify(this.$parent.cameraList)) {
          this.treeObj.checkAllNodes(false)
        }
      }
      this.$parent.dialogDeviceVisibleAp = false
      if (this.type == '3') {
        this.checkedNodes = []
        this.step = 1
      }
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
        type: 1
      }
      parentId !== '' ? (data.parentId = parentId) : null

      if (this.ifSendDeviceTypeApi == '5') {
        data.deviceType = 5
      }

      await this.$api.getDeviceTree(data).then(res => {
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
      })
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

    //zTree展开节点
    async zTreeOnExpand(event, treeId, treeNode) {
      if ((treeNode.children && treeNode.children.length > 0) || treeNode.type == 2) {
        return
      }
      let data = {
        type: 1,
        parentId: treeNode.id
      }

      if (this.ifSendDeviceTypeApi == '5') {
        data.deviceType = 5
      }

      await this.$api.getDeviceTree(data).then(res => {
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
      })
    },
    zTreeBeforeCheck(treeId, treeNode) {
      if (this.type == 2) {
        return !treeNode.isParent
      }
    },
    zTreeOnCheck(event, treeId, treeNode) {
      if (this.type == '2') {
        var status = treeNode.checked
        this.treeObj.checkAllNodes(false)
        this.treeObj.checkNode(treeNode, status, false)
      }
      if (this.type == '1' || this.type == '3') {
        this.checkedNodes = this.treeObj.getChangeCheckedNodes().filter(item => {
          return item.type == 2
        })
        // cd修改
        let path = this.$route.path
        if (path.indexOf('/turning') != -1) {
          // 数组添加已有的以及去重
          if (treeNode.children) {
            for (let i = 0; i < treeNode.children.length; i++) {
              const item = treeNode.children[i]
              if (!item.checked) {
                let index = this.checkedNodes1.findIndex(item1 => {
                  return item1.id == item.id
                })
                if (index != -1) this.checkedNodes1.splice(index, 1)
              }
            }
          } else {
            if (!treeNode.checked) {
              let index = this.checkedNodes1.findIndex(item => {
                return item.id == treeNode.id
              })
              if (index != -1) this.checkedNodes1.splice(index, 1)
            }
          }
          this.checkedNodes1 = this.checkedNodes1.concat(this.checkedNodes)
          var obj = {}
          this.checkedNodes1 = this.checkedNodes1.reduce(function (item, next) {
            obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
            return item
          }, [])
          let checkedNodes = [],
            checkedCameras = []
          for (let i = 0; i < this.checkedNodes1.length; i++) {
            const item = this.checkedNodes1[i]
            checkedNodes.push(item)
            checkedCameras.push(item.id)
          }
          this.checkedNodes = checkedNodes
          this.checkedCameras = checkedCameras
        } else {
          let checkedCameras = []
          for (let i = 0; i < this.checkedNodes.length; i++) {
            const item = this.checkedNodes[i]
            checkedCameras.push(item.id)
          }
          this.checkedCameras = checkedCameras
        }
        this.checkAll = this.checkedCameras.length != 0 ? true : false
      } else {
        if (treeNode.type == 2) {
          if (
            this.checkedNodes.length &&
            this.checkedNodes[0].id == treeNode.id &&
            !treeNode.checked
          ) {
            this.checkedNodes = []
            this.checkedCameras = []
          } else {
            if (treeNode.checked) {
              this.checkedNodes = [treeNode]
              this.checkedCameras = [treeNode.id]
            }
          }
        } else {
          if (!this.checkedNodes.length) {
            this.checkedNodes = []
            this.checkedCameras = []
          }
        }
        this.checkAll = this.checkedCameras.length != 0 ? true : false
      }
    },
    treeCreated(e) {
      this.treeObj = e
      this.treeObj.expandAll(true)
      if (this.checkedApeId) {
        this.checkedNodes = [this.treeObj.getNodeByParam('id', this.checkedApeId, null)]
        this.checkedCameras = [this.checkedApeId]
        this.$emit('getChooseCameras', this.checkedNodes)
        this.treeObj.selectNode(this.treeObj.getNodeByParam('id', this.checkedApeId, null))
        this.treeObj.checkNode(
          this.treeObj.getNodeByParam('id', this.checkedApeId, null),
          true,
          false
        )
      }
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
        deviceType = treeNode.payload.deviceType,
        type = treeNode.payload.type,
        isOnline = treeNode.payload.isOnline
      if (isOnline == '1') {
        return this.showApsTree ? 'iconfont icon-caijixitong iconCss1' : 'aci aci-camera1 iconCss1'
      } else {
        return this.showApsTree ? 'iconfont icon-caijixitong iconCss2' : 'aci aci-camera1 iconCss2'
      }
    },
    searchCamera() {
      this.searhLoading = true
      if (this.searchName == '') {
        this.$message({
          type: 'warning',
          message: this.$t('deviceManagement.selectInput') + this.titleKeyword
        })
        this.searchCameraList = []
        this.searhLoading = false
        return
      }

      this.$api.searchApeTree({ searchName: this.searchName }).then(res => {
        if (res.resultCode == 0) {
          this.searchCameraList = res.nodeList
        }
        this.searhLoading = false
      })
    },

    //搜索父节点定位
    async searchParent(item) {
      this.zTreeLoading = true
      //前端联动
      let exNode_now = this.treeObj.getNodeByParam('id', item.id, null)
      this.treeObj.selectNode(exNode_now)
      this.zTreeLoading = false
    },

    beforeExpand(treeId, treeNode) {
      let aObj = document.getElementById(`${treeNode.tId}_a`)
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

      if (!treeNode.zAsync && !treeNode.expanded) {
        aObj.firstChild.firstChild.src = require('@/assets/img/common/loading.gif')
      }
    },
    ajaxGetNodes(treeNode, reloadType) {
      if (reloadType == 'refresh') {
        treeNode.icon = '@/assets/img/common/loading.gif'
        this.treeObj.updateNode(treeNode)
      }
      this.treeObj.reAsyncChildNodes(treeNode, reloadType, true)
    },

    getNodeParents(id) {
      this.parents.unshift(id)
      if (
        this.treeObj.getNodeByParam('id', id, null) &&
        this.treeObj.getNodeByParam('id', id, null).parentTId
      ) {
        this.getNodeParents(this.treeObj.getNodeByParam('id', id, null).parentId)
      }
    },

    handleCheckAllChange(val) {
      let checkedIds = []
      for (let j = 0; j < this.checkedNodes.length; j++) {
        checkedIds.push(this.checkedNodes[j].id)
      }
      this.checkedCameras = val ? checkedIds : []
      this.isIndeterminate = false
    },
    handleCheckedCamerasChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkedNodes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedNodes.length
    },

    // 确定添加
    async addAllCameras() {
      if (this.ifSearchParents) {
        if (this.checkedNodes[0]) {
          this.parents = []
          this.getNodeParents(this.checkedNodes[0].parentId)
          this.checkedNodes[0].parents = this.parents
        }
      }

      if (this.ifJudgeAiType && this.checkedNodes.length != 0) {
        let judgeFlag = false
        let res = await this.$api.getCameraInfo({
          cameraId: this.checkedNodes[0].id
        })
        let message
        if (res.resultCode == 0) {
          if (this.guardType == 1 && res.cameraBaseInfo.aiType != 1) {
            message = this.$t('public.selectPersonDev')
            judgeFlag = true
          } else if (this.guardType == 2 && res.cameraBaseInfo.aiType != 2) {
            message = this.$t('public.selectVehicleDev')
            judgeFlag = true
          } else if (this.guardType == 3) {
            if (res.cameraBaseInfo.aiType != 1 && res.cameraBaseInfo.aiType != 2) {
              message = this.$t('public.selectPersonOrVehicleDev')
              judgeFlag = true
            } else {
              this.$store.state.aiType = res.cameraBaseInfo.aiType
            }
          }
        }
        if (judgeFlag) {
          this.$message.warning(message)
          return
        }
      }
      if (this.$route.path.indexOf('/turning') != -1) {
        if (this.checkedNodes.length > 1024) {
          this.$message.warning(this.$t('public.most1024Devs') + this.titleKeyword)
          return
        }
      }
      this.ifClose = false
      this.$parent.dialogDeviceVisibleAp = false
      this.$emit('getChooseCameras', this.checkedNodes)
    },
    // 删除已选择的镜头
    deleteNodes() {
      if (this.checkedCameras.length == 0) {
        this.$message.warning(`${this.$t('deviceManagement.selectDelDevice')}${this.titleKeyword}`)
        return
      }
      let checkedTreeNodes = this.treeObj.getChangeCheckedNodes().filter(item => {
        return item.type == 2
      })

      for (let k = 0; k < this.checkedCameras.length; k++) {
        for (let i = 0; i < this.checkedNodes.length; i++) {
          if (this.checkedCameras[k] == this.checkedNodes[i].id) {
            this.checkedNodes.splice(i, 1)
          }
        }

        for (let j = 0; j < checkedTreeNodes.length; j++) {
          if (this.checkedCameras[k] == checkedTreeNodes[j].id) {
            this.treeObj.checkNode(
              this.treeObj.getNodeByParam('id', this.checkedCameras[k], null),
              false,
              true
            )
          }
        }
      }
      this.checkedCameras = []
      this.isIndeterminate = false
      this.checkAll = false
    },

    // type为3时，故障上报===========
    checkedfault() {
      if (this.checkedNodes.length) {
        this.ifClose = true
        this.step = 2
        this.$refs.faultCondition.resetValid()
      } else {
        this.$alert(
          this.$t('alarmList.selectLeastOneCamera') + this.titleKeyword,
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('public.confirm')
          }
        )
      }
    },
    backTo() {
      this.step = 1
      this.$refs.faultCondition.resetValid()
    },
    submitFault() {
      this.$refs.faultCondition.handleSubmit()
    },
    successFun() {
      this.$parent.dialogDeviceVisibleAp = false
      this.$parent.getFaultList()
    }
    // type为3时，故障上报===========
  }
}
</script>

<style lang="scss">
@import '@/assets/style/device-tools.scss';
</style>
