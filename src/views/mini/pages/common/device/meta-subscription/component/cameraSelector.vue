<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :top="showFavorites ? '2vh' : '10vh'"
    :width="locale === 'en' ? '1120px' : '900px'"
    :close-on-click-modal="false"
    @open="dialogOpen"
    @closed="dialogClosed"
    :modal="false"
    draggable
    id="camera-selector"
  >
    <div class="">
      <el-row class="mb-3">
        <span style="line-height: 34px">{{ $t('platformManagement.subscriptionTime') }} ：</span>
        <el-radio-group v-model="timeType">
          <el-radio-button :label="1" @click="setDIYTime(1)">
            {{ $t('public.nearlyThreeDays') }}
          </el-radio-button>
          <el-radio-button :label="2" @click="setDIYTime(2)">
            {{ $t('public.nearlySevenSays') }}
          </el-radio-button>
          <el-radio-button :label="3" @click="setDIYTime(3)">
            {{ $t('public.nearly30Days') }}
          </el-radio-button>
        </el-radio-group>

        <el-date-picker
          :shortcuts="pickerOptions && pickerOptions.shortcuts"
          :disabled-date="pickerOptions && pickerOptions.disabledDate"
          :cell-class-name="pickerOptions && pickerOptions.cellClassName"
          class="ml-2"
          v-model="time"
          type="datetimerange"
          :prefix-icon="ElIconDate"
          :range-separator="$t('public.to')"
          :start-placeholder="$t('public.startTimePrompt')"
          :end-placeholder="$t('public.endTimePrompt')"
          @change="getFormatDate"
        ></el-date-picker>
      </el-row>

      <el-row class="mb-3">
        <span style="line-height: 34px">{{ $t('metadata.selectPlat') }}：</span>
        <el-select
          style="display: inline-block; width: 200px"
          clearable
          value-key="accessId"
          v-model="searchForm.platForm"
          @change="platSelectChange()"
          class="clearBg"
        >
          <el-option
            v-for="item in algorithmPlatList"
            :key="item.accessId"
            :label="
              item.accessName +
              `(${item.status === 1 ? $t('public.statustype1') : $t('public.statustype2')})`
            "
            :value="item"
          ></el-option>
        </el-select>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-tabs v-if="showFavorites" v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('alarmList.cameraResources')" name="1">
              <div class="resources-container">
                <div class="search-container">
                  <el-input
                    v-model="searchName"
                    :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
                    :maxlength="128"
                    clearable
                  />
                  <div class="search-btns">
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
                      width="350"
                    >
                      <div v-loading="searchLoading">
                        <div v-if="searchCameraList.length == 0" style="text-align: center">
                          {{ $t('public.noData') }}
                        </div>
                        <div v-else-if="searchCameraList.length > 50" style="text-align: center">
                          {{ $t('public.searchPrecisely') }}
                        </div>

                        <ul v-else class="searchedUl">
                          <li
                            v-for="(item, index) in searchCameraList"
                            :key="index"
                            class="searchedLi"
                          >
                            <i :class="iconSty_search(item)" />
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
                    <el-button type="primary" class="searchBtn" @click="refreshTree">
                      {{ $t('public.refresh') }}
                    </el-button>
                  </div>
                </div>
                <div
                  class="tree-container"
                  v-loading="zTreeLoading"
                  :element-loading-text="$t('public.loading')"
                >
                  <giant-tree
                    ref="giantTree"
                    :nodes="treeData"
                    :setting="treeSetting"
                    @onCreated="onTreeCreated"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('favorite.favorite1')" name="2">
              <div class="resources-container">
                <div
                  class="tree-container"
                  style="height: 456px"
                  v-loading="favoriteTreeLoading"
                  :element-loading-text="$t('public.loading')"
                >
                  <giant-tree
                    ref="giantTree"
                    :nodes="favoriteTreeData"
                    :setting="favoriteTreeSetting"
                    @onCreated="onFavoriteTreeCreated"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div v-else class="resources-container">
            <div class="title">{{ $t('alarmList.cameraResources') }}</div>
            <div class="search-container">
              <el-input
                v-model="searchName"
                :placeholder="$t('alarmList.inputCameraNameOrOrgName')"
                :maxlength="128"
                clearable
              />
              <div class="search-btns">
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
                  <div v-loading="searchLoading">
                    <div v-if="searchCameraList.length == 0" style="text-align: center">
                      {{ $t('public.noData') }}
                    </div>
                    <div v-else-if="searchCameraList.length > 50" style="text-align: center">
                      {{ $t('public.searchPrecisely') }}
                    </div>

                    <ul v-else class="searchedUl">
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
                <el-button type="primary" class="searchBtn" @click="refreshTree">
                  {{ $t('public.refresh') }}
                </el-button>
              </div>
            </div>
            <div
              class="tree-container"
              v-loading="zTreeLoading"
              :element-loading-text="$t('public.loading')"
            >
              <giant-tree
                ref="giantTree"
                :nodes="treeData"
                :setting="treeSetting"
                @onCreated="onTreeCreated"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="selected-container">
            <div class="title">
              <label :class="['el-checkbox', checkAll && 'is-checked']">
                <span
                  :class="[
                    'el-checkbox__input',
                    checkAll && 'is-checked',
                    isIndeterminate && 'is-indeterminate'
                  ]"
                >
                  <span class="el-checkbox__inner"></span>
                  <input
                    aria-hidden="false"
                    class="el-checkbox__original"
                    ref="checkAll"
                    type="checkbox"
                    @change="handleCheckAll"
                  />
                </span>
                <span class="el-checkbox__label">
                  {{ $t('alarmList.selectedCamera') }}({{ checkedCameras.length
                  }}{{ locale == 'en' ? '' : '台' }})
                </span>
              </label>
            </div>
            <div
              class="selected-cameras"
              :style="{
                height: showFavorites ? '471px' : '456px'
              }"
            >
              <label
                :class="['el-checkbox', checkedCameras.includes(camera.id) && 'is-checked']"
                v-for="camera in selectedCameras"
                :key="camera.id"
              >
                <span
                  :class="[
                    'el-checkbox__input',
                    checkedCameras.includes(camera.id) && 'is-checked'
                  ]"
                >
                  <span class="el-checkbox__inner"></span>
                  <input
                    aria-hidden="false"
                    class="el-checkbox__original"
                    type="checkbox"
                    ref="checkbox"
                    :value="camera.id"
                    @change="handleCheckedCamerasChange"
                  />
                </span>
                <span class="el-checkbox__label">
                  <span class="checkbox-item-text" :title="camera.name">{{ camera.name }}</span>
                </span>
              </label>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="cancel">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('public.confirm') }}
        </el-button>
        <el-button type="danger" @click="removeCamera">
          {{ $t('public.delete') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  LocationFilled as ElIconLocationOutline,
  Calendar as ElIconDate
} from '@element-plus/icons-vue'
import GiantTree from 'vue-giant-tree'
import devIcon from '@/utils/common/dev-icon'
const { getDevIcon } = devIcon()
import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
import { getDIYTime4, getFormatDate } from '@/utils/common/mutil'
const checkType = {
  multiple: 'checkbox',
  single: 'radio'
}
export default {
  data() {
    return {
      dialogVisible: false,
      locale: localStorage.getItem('locale'),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 60 * 60 * 1000
        }
      },
      treeData: [],
      treeSetting: {
        check: {
          enable: true,
          chkStyle: checkType[this.mode],
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
          onCheck: (treeId, treeNode) => {
            return this.onNodeCheck(treeNode)
          },
          beforeExpand: (treeId, treeNode) => {
            return this.beforeExpand(treeNode)
          }
        }
      },
      selectedCameras: [],
      zTree: null,
      zTreeLoading: false,
      searchName: '',
      searchLoading: false,
      searchCameraList: [],
      checkAll: false,
      isIndeterminate: false,
      checkedCameras: [],
      updateSelectedCameras: this.$loadash.debounce(async () => {
        const selectedNodes = this.zTree.getCheckedNodes(true)
        // 过滤非设备节点
        this.selectedCameras = selectedNodes
          .filter(node => node.type !== 1 && !node.isParent)
          .map(node => ({
            id: node.id,
            name: node.label
          }))
        // 同步右侧选择数据
        this.checkedCameras = this.selectedCameras.map(camera => camera.id)
        // 设置选中状态
        if (this.$refs.checkbox?.length) {
          this.$refs.checkbox.forEach(checkbox => {
            checkbox.checked = true
          })
        }
        this.checkAll = this.checkedCameras.length > 0
        this.$refs.checkAll.checked = this.checkedCameras.length > 0
        this.isIndeterminate = false
      }, 200),
      activeName: '1',
      favoriteTreeLoading: false,
      favoriteTreeData: [],
      favoriteTreeSetting: {
        data: {
          key: {
            name: 'label'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentId',
            idKey: 'id',
            rootPId: -1
          }
        },
        check: {
          enable: true,
          chkStyle: checkType[this.mode],
          radioType: 'all'
        },
        view: {
          fontCss: {
            color: '#2d2d2d'
          },
          expandSpeed: '',
          showIcon: true,
          showLine: false,
          addDiyDom: this.favoriteTreeDiyDom
        },
        callback: {
          onCheck: this.favoriteTreeCheck
        }
      },
      favoriteTree: null,
      timeType: 1,
      time: [],
      searchForm: {
        beginTime: null,
        endTime: null,
        platForm: null
      },
      ElIconDate
    }
  },
  components: {
    GiantTree,
    ElIconLocationOutline
  },
  name: 'cameraSelector',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: i18n.t('public.cameraChoosePrompt')
    },
    api: {
      type: String,
      default: 'getDeviceTree'
    },
    // 是否懒加载
    lazyLoad: {
      type: Boolean,
      default: true
    },
    // 设备类型 1：镜头 其他根据业务字典定义 不填或填0为查询全部
    deviceType: {
      type: Number,
      default: 0
    },
    // 平台id
    platformId: {
      type: String,
      default: ''
    },
    // 选择模式 单选 single，多选 multiple
    mode: {
      type: String,
      default: 'multiple'
    },
    max: {
      type: Number,
      default: Infinity
    },
    // 是否显示收藏夹
    showFavorites: {
      type: Boolean,
      default: false
    },
    algorithmPlatList: {
      type: Array,
      default: () => []
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
    }
  },
  watch: {
    visible: {
      handler(nv, ov) {
        this.dialogVisible = nv
      },
      immediate: true
    }
  },
  mounted() {
    this.setDIYTime(1)
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        if (this.algorithmPlatList.length) {
          this.searchForm.platForm = this.algorithmPlatList[0]
          this.fetchTreeData()
        }
      })
    },
    dialogClosed() {
      this.$emit('closeDialog')
      this.$emit('closed')
    },
    // 1:近三天 2：近七天 3：近一个月
    setDIYTime(data = 1) {
      console.log(data)
      this.time = getDIYTime4(data)
      this.getFormatDate()
    },
    async platSelectChange() {
      await this.fetchTreeData()
      await this.onTreeCreated()
    },

    getFormatDate() {
      this.searchForm.beginTime = getFormatDate(this.time[0])
      this.searchForm.endTime = getFormatDate(this.time[1])
    },
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
    async fetchTreeData(parentId = '', node) {
      if (this.zTreeLoading) return
      try {
        this.zTreeLoading = true
        const response = await this.$api[this.api]({
          type: this.lazyLoad ? 1 : 0,
          platformId: this.searchForm.platForm.platformConfig.platformConfig,
          parentId
        })
        const nodeList = response.nodeList.map(node => {
          node.isParent = !node.leaf
          if (node.type == 1) {
            node.label = `${node.label} (${node.payload.onlineCount}/${node.payload.totalCount})`
          }
          if (this.mode === 'single') {
            node.nocheck = node.type == 1
          }
          return node
        })
        if (node) {
          // 如果有 node 参数，则为懒加载子节点
          this.zTree.addNodes(node, nodeList)
        } else {
          // 如果没有 node 参数，初始化树数据
          this.treeData = nodeList
        }
      } finally {
        this.zTreeLoading = false
      }
    },
    async onTreeCreated(zTree) {
      this.zTree = zTree
      const nodes = this.zTree.getNodes()
      if (nodes.length > 0 && nodes[0].isParent) {
        if (!nodes[0].length) {
          // 加载第一个子节点数据
          await this.fetchTreeData(nodes[0].id, nodes[0])
        }
        // 展开该节点 不触发事件
        this.zTree.expandNode(nodes[0], true, false, true)
      }
    },
    beforeCheck(treeNode) {
      if (!treeNode.checked) {
        if (this.selectedCameras.length >= this.max) {
          this.$message.warning(`${this.$t('public.maxSelectDevLength', { num: this.max })}`)
          return false
        }
      }
      if (this.mode === 'single') {
        return treeNode.type != 1
      } else {
        return true
      }
    },
    onNodeCheck(treeNode) {
      // 更新右侧的已选择镜头列表
      this.updateSelectedCameras()
    },
    async beforeExpand(treeNode) {
      if (!treeNode.children || treeNode.children.length === 0) {
        await this.fetchTreeData(treeNode.id, treeNode)
      }
    },
    removeCamera() {
      if (!this.checkedCameras.length) {
        this.$message.warning(`${this.$t('public.selectDelDev')}`)
        return
      }
      const TreeName = this.showFavorites && this.activeName === '2' ? 'favoriteTree' : 'zTree'
      if (this.checkedCameras.length === this.selectedCameras.length) {
        // 全部删除
        this.selectedCameras = []
        if (this.mode === 'single') {
          this[TreeName].checkNode(
            this[TreeName].getNodeByParam('id', this.checkedCameras[0]),
            false,
            true,
            false
          )
        } else {
          this[TreeName].checkAllNodes(false)
        }
      } else {
        // 部分删除
        for (let i = 0; i < this.checkedCameras.length; i++) {
          let cameraId = this.checkedCameras[i]
          let index = this.selectedCameras.findIndex(camera => camera.id === cameraId)
          this.selectedCameras.splice(index, 1)
          this[TreeName].checkNode(
            this[TreeName].getNodeByParam('id', cameraId),
            false,
            true,
            false
          )
        }
      }
      this.checkedCameras = []
      this.checkAll = false
      this.$refs.checkAll.checked = false
      this.isIndeterminate = false
    },
    handleCheckAll(event) {
      const isChecked = event.target.checked
      this.checkAll = isChecked
      this.$refs.checkAll.checked = isChecked
      this.checkedCameras = isChecked ? this.selectedCameras.map(item => item.id) : []
      this.$refs.checkbox.forEach(checkbox => {
        checkbox.checked = isChecked // 设置选中状态
      })
      this.isIndeterminate = false
    },
    handleCheckedCamerasChange(event) {
      const isChecked = event.target.checked
      const cameraId = event.target.value
      let checkboxIndex = this.$refs.checkbox.findIndex(item => item.value === cameraId)
      if (isChecked) {
        this.checkedCameras.push(cameraId)
        if (checkboxIndex > -1) {
          this.$refs.checkbox[checkboxIndex].checked = true
        }
      } else {
        const index = this.checkedCameras.indexOf(cameraId)
        if (index > -1) {
          this.checkedCameras.splice(index, 1)
        }
        if (checkboxIndex > -1) {
          this.$refs.checkbox[checkboxIndex].checked = false
        }
      }
      const checkedCount = this.checkedCameras.length
      this.checkAll = checkedCount === this.selectedCameras.length
      this.$refs.checkAll.checked = checkedCount === this.selectedCameras.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectedCameras.length
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
    async refreshTree() {
      await this.fetchTreeData()
      this.checkedCameras = []
      this.selectedCameras = []
      this.checkAll = false
      this.$refs.checkAll.checked = false
      this.isIndeterminate = false
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
    confirm() {
      if (Number(new Date()) < Number(new Date(this.searchForm.endTime))) {
        this.$message.warning(this.$t('recordReport.chooseCurrentTime'))
        return
      }
      if (this.selectedCameras.length > this.max) {
        this.$message.warning(`${this.$t('public.maxSelectDevLength', { num: this.max })}`)
        return
      }
      if (!this.time || !this.time.length) {
        this.$message.warning(this.$t('recordReport.chooseOperationDate'))
        return
      }

      if (!this.searchForm.platForm) {
        this.$message.warning(this.$t('accessAllocate.pleasePlatform'))
        return
      }

      if (!this.selectedCameras.length) {
        this.$message.warning(this.$t('recordReport.chooseCamera'))
        return
      }

      const params = {
        cameraIdList: this.selectedCameras.map(item => item.id),
        startTime: this.searchForm.beginTime,
        endTime: this.searchForm.endTime,
        accessPlatId: this.searchForm.platForm.accessId
      }

      this.$api.subscribeMetadata(params).then(res => {
        if (res.resultCode === 0) {
          this.dialogVisible = false
          this.$emit('subscribe-success')
        }
      })
    },
    cancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    async handleTabClick() {
      if (this.activeName === '1') {
        await this.refreshTree()
      } else {
        await this.fetchFavoriteTreeData()
        this.checkedCameras = []
        this.selectedCameras = []
        this.checkAll = false
        this.$refs.checkAll.checked = false
        this.isIndeterminate = false
      }
    },
    async fetchFavoriteTreeData() {
      try {
        this.favoriteTreeLoading = true
        const response = await this.$api.getFavoriteCamList()
        const nodeList = [
          {
            id: sessionStorage.getItem('account'),
            parentId: -1,
            label: this.$t('favorite.favorite'),
            type: 1,
            children: [],
            nocheck: true,
            highlight: true
          }
        ]
        const arr = response.nodeList
        this.favoriteTreeRecursion(arr)
        nodeList[0].children = arr
        this.favoriteTreeData = nodeList
      } finally {
        this.favoriteTreeLoading = false
      }
    },
    // 收藏夹树处理
    favoriteTreeRecursion(data) {
      data.forEach(item => {
        if (item.type == 1) {
          item.nocheck = true
          item.label =
            item.label + ' (' + item.payload.onlineCount + '/' + item.payload.totalCount + ')'
        }
        if (item.children) {
          this.favoriteTreeRecursion(item.children)
        }
      })
    },
    // 收藏夹
    onFavoriteTreeCreated(e) {
      this.favoriteTree = e
      this.favoriteTree.expandAll(true)
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
    // 设备节点选中
    async favoriteTreeCheck(event, treeId, treeNode) {
      if (treeNode.checked) {
        // 选中
        let index = this.selectedCameras.findIndex(item => item.id === treeNode.id)
        if (index === -1) {
          this.selectedCameras.push({
            id: treeNode.id,
            name: treeNode.label
          })
        }
      } else {
        let index = this.selectedCameras.findIndex(item => item.id === treeNode.id)
        if (index !== -1) {
          this.selectedCameras.splice(index, 1)
        }
      }
      // 同步右侧选择数据
      this.checkedCameras = this.selectedCameras.map(camera => camera.id)
      await this.$nextTick()
      // 设置选中状态
      if (this.$refs.checkbox?.length) {
        this.$refs.checkbox.forEach(checkbox => {
          checkbox.checked = true
        })
      }
      this.checkAll = this.checkedCameras.length > 0
      this.$refs.checkAll.checked = this.checkedCameras.length > 0
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang="scss">
#camera-selector {
  .el-dialog__body {
    padding: 5px 15px;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    background-color: #e5e5e5;
  }
  .resources-container {
    display: flex;
    flex-direction: column;
    background: #f2f2f2;
    .search-container {
      padding: 10px 8px 10px 15px;
      display: flex;
      justify-content: space-between;
      .el-input {
        width: calc(100% - 70px);
        .el-input__inner {
          height: 36px;
          line-height: 36px;
          background: #f2f2f2 !important;
          border: none;
        }
      }
      .search-btns {
        margin-left: 5px;
        display: flex;
        .searchBtn {
          margin-left: 5px;
          height: 36px;
        }
      }
    }
    .tree-container {
      padding: 10px 8px 10px 15px;
      flex: 1 0 auto;
      height: 400px;
      overflow: auto;
      .ztree {
        height: 100%;
        .button.radio_true_full:after,
        .chk.radio_true_full_focus:after,
        .chk.radio_true_part:after,
        .chk.radio_true_part_focus:after {
          top: 2px;
          left: 2px;
        }
        .button.checkbox_true_part:after,
        .button.checkbox_true_part_focus:after {
          left: 1px;
        }
      }
    }
  }
  .selected-container {
    background: #f2f2f2;
    overflow: auto;
    .el-checkbox__label {
      color: #2d2d2d;
    }
    .selected-cameras {
      padding: 10px 8px 10px 15px;
      height: 456px;
      overflow-x: hidden;
      overflow-y: auto;
      .el-checkbox {
        display: block;
        padding-bottom: 20px;
        &:last-child {
          padding-bottom: 0;
        }
      }
      .el-checkbox__label {
        vertical-align: middle;
      }
      .checkbox-item-text {
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        width: 190px;
      }
    }
  }
  .dialog-footer {
    .el-button {
      min-width: 100px;
      margin: 0 90px;
    }
  }
  .el-tabs__header .el-tabs__item {
    background: transparent !important;
  }
  .el-input__inner {
    background: #fff;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 440px;
    background: #d2d2d2;
    color: #333333 !important;
  }
  .el-range-editor--small .el-range-input,
  .el-date-editor .el-range-separator {
    background: transparent;
    color: #333333;
    font-family: Microsoft YaHei;
  }
  .el-icon-date:before {
    color: #333333;
    font-size: 16px;
  }
  .el-radio-button__inner {
    background: #fff;
    border: 1px solid #dcdfe6;
    border-left: 0;
    color: #606266;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding: auto;
    font-size: 14px;
    border-radius: 0;
  }

  .el-radio-button:first-child {
    .el-radio-button__inner {
      border-left: 1px solid #dcdfe6;
      border-radius: 4px 0 0 4px;
      box-shadow: none !important;
    }
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner,
  .el-radio-button.is-active,
  .el-radio-group .is-active .el-radio-button__inner {
    background-color: #3085cb;
    border-color: #3085cb;
    -webkit-box-shadow: -1px 0 0 0 #3085cb;
    box-shadow: -1px 0 0 0 #3085cb;
    color: #fff;
  }
}
//定位
.searchedLi {
  cursor: pointer;
  padding: 5px 5px;
  border-radius: 5px;
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    background: #175290;
    color: #fff;
  }
  .camera-name {
    display: inline-block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.locateIcon {
  position: absolute;
  right: 0;
}
.clearBg {
  .el-input__wrapper {
    background: #fff !important;
  }
}
</style>
