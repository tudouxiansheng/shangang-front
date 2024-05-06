<template>
  <!-- 全加载树 -->
  <div class="orgTreeOut" :style="sty">
    <template v-if="isShowTree" v-loading="treeLoading">
      <el-autocomplete
        v-model="filterText"
        class="inline-input"
        ref="selectSuggest"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        :debounce="300"
        :placeholder="placeholderTitle"
        clearable
        @select="handleFilterNode"
      ></el-autocomplete>
      <div id="orgTree" ref="orgTree">
        <div>
          <el-tree
            ref="treeList"
            node-key="id"
            :data="userTreeData"
            :props="organizationTreeProps"
            default-expand-all
            :empty-text="treeEmptyText"
            v-loading="treeLoading"
            highlight-current
            :expand-on-click-node="false"
            :check-on-click-node="true"
            @node-click="handleNodeClick"
            :current-node-key="currentKey"
            :show-checkbox="showCheckbox"
            @check-change="handleNodeCheck"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <i :class="iconSty(data)" class="aci" />
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="nodata">
        <img :src="src" alt="" />
        <span>{{ $t('shareDevice.noUser') }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import treeStyle from '@/mixin/tree-style'
import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
import devIcon from '@/utils/common/dev-icon.js'

const { getDevIcon } = devIcon()
export default {
  props: {
    isGroupId: {
      type: Boolean,
      default: true
    },
    planeType: {
      type: Number,
      default: 1
    },
    sty: {
      type: Object,
      default: () => {
        return { backgroundColor: '#052a3f' }
      }
    },
    treeApi: {
      type: String,
      default: 'getUserTree'
    },
    treeParams: {
      type: Object,
      default: () => {}
    },
    searchApi: {
      type: String,
      default: 'searchUserTree'
    },
    searchParams: {
      type: Object,
      default: () => {}
    },
    locateApi: {
      type: String,
      default: 'locateUserTree'
    },
    locateParams: {
      type: Object,
      default: () => {}
    },
    placeholderTitle: {
      type: String,
      default: i18n.t('shareDevice.pleaseEnterName')
    },
    iconColor: {
      type: Boolean,
      default: false
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: '0'
    }
  },
  mixins: [treeStyle],
  data() {
    return {
      src: require('@/assets/img/common/no-user-tree.png'),
      idArr: [], //默认展开的节点的 key 的数组
      isShowTree: true,
      userTreeData: [],
      treeEmptyText: '',
      treeLoading: true,
      // tree配置项
      organizationTreeProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      currentKey: '',
      locateTreeTip: false
    }
  },
  mounted() {
    this.setTreeStyle()
    this.getTree()
  },
  methods: {
    querySearchAsync(queryString, cb) {
      queryString = queryString.trim()
      if (queryString) {
        this.$refs.selectSuggest.activated = true
        const data = {
          planeType: this.planeType,
          searchName: queryString,
          ...this.searchParams
        }
        if (String(this.currentId).length < 10) {
          data.groupId = this.currentId
        } else {
          data.deviceId = this.currentId
        }
        // 后端函数调用返回联想词列表
        this.$api[this.searchApi](data).then(res => {
          const nodeList = res.nodeList || []
          nodeList.forEach(item => {
            item.value = item.nodeName
            item.id = item.nodeId
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
        nodeId: item.id,
        nodeType: this.treeApi == 'getUserTree' ? item.type : null,
        ...this.locateParams
      }
      this.searchFlag = true
      this.idArr = []
      await this.$api[this.locateApi](data).then(res => {
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
    // 加载树
    async getTree() {
      let data = {
        planeType: this.planeType,
        type: 2,
        ...this.treeParams
      }
      if (this.isGroupId) {
        if (String(this.currentId).length < 10) {
          data.groupId = this.currentId
        } else {
          data.deviceId = this.currentId
        }
      }
      await this.$api[this.treeApi](data).then(res => {
        this.treeLoading = false
        if (res.resultCode != 0) return
        this.userTreeData = res.nodeList || []
        this.isShowTree = true
        if (!this.userTreeData.length) {
          this.isShowTree = false
        }
      })
    },
    // 点击树节点
    handleNodeClick(data, node) {
      let obj = {
        data,
        node
      }
      this.$emit('nodeClick', obj)
    },
    handleNodeCheck(data, node) {
      if (!this.showCheckbox) return
      let obj = {
        data,
        node
      }
      this.$emit('nodeCheck', obj)
    },
    iconSty(data) {
      if (this.treeApi == 'getUserTree') {
        if (data.type == 1 && data.payload.type == 1) {
          return 'aci-organization iconCss'
        } else {
          if (data.type == 1) {
            return 'aci-x006-folder iconCss'
          } else {
            return 'aci-person iconCss'
          }
        }
      } else if (this.treeApi == 'getDeviceTree') {
        if (data.type == 1 && data.payload.type == 1) {
          return 'aci-organization iconCss'
        } else if (data.type == 1) {
          return 'aci-x006-folder iconCss'
        } else {
          return getDevIcon(data.payload.status, data.payload.deviceType)
        }
      } else {
        if (!this.iconColor) {
          if (data.payload.type == 1) {
            return 'aci-organization iconCss'
          } else if (data.payload.type == 2) {
            return 'aci-x006-folder iconCss'
          }
        } else {
          if (data.payload.type == 1) {
            return 'aci-organization iconCss1'
          } else if (data.payload.type == 2) {
            return 'aci-x006-folder iconCss1'
          }
        }
      }
    },
    setNode() {
      if (this.searchFlag) {
        this.$nextTick(() => {
          this.$refs.treeList.setCurrentKey(this.currentKey)
          setTimeout(() => {
            let node = ''
            let treeDom = this.$refs.treeList.$el
            if (!this.isDialog) {
              node = treeDom.querySelector('.is-current')
            } else {
              node = treeDom.querySelector('.el-dialog .is-current')
            }
            if (node) {
              this.$refs.orgTree.scrollTop = node.offsetTop
            }
            if (!this.locateTreeTip && this.idArr.length > 1) {
              let i = 0
              for (; i < this.idArr.length - 1; i++) {
                if (
                  !(
                    this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]] &&
                    this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]]
                      .expanded &&
                    this.$refs.treeList.getNode(this.idArr[i + 1])
                  )
                ) {
                  break
                }
              }
              if (i != this.idArr.length - 1) {
                this.locateTreeTip = true
                this.idArr = []
                this.$message({
                  type: 'warning',
                  message: this.$t('public.locateTree')
                })
              }
            }
          }, 500)
          if (
            this.locateApi == 'locateUserTree' &&
            this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]] &&
            this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]].expanded &&
            !this.$refs.treeList.getNode(this.currentKey)
          ) {
            this.idArr = []
            this.$message({
              type: 'warning',
              message: this.$t('public.locateTree')
            })
          }
          if (this.$refs.treeList.getNode(this.currentKey)) {
            this.searchFlag = false //定位之后且存在该节点把搜索的标志还原
            this.handleNodeClick(
              this.$refs.treeList.getNode(this.currentKey).data,
              this.$refs.treeList.getNode(this.currentKey)
            )
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.orgTreeOut {
  background: #082b40 !important;
  margin-top: 10px;
  height: calc(100% - 50px);
  .inline-input {
    padding: 10px 10px 0;
    display: block;
  }
  #orgTree {
    padding: 0 10px;
    margin-top: 20px;
    overflow: auto;
    box-sizing: border-box;
    height: calc(100% - 62px) !important;
  }
  .nodata {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      margin-bottom: 16px;
    }
  }
}
</style>
