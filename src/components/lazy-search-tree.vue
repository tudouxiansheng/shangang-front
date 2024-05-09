<template>
  <!-- 懒加载树 -->
  <div class="orgTreeOut" style="background-color: #052a3f">
    <el-autocomplete
      v-if="delSearch != 'linkageConfig'"
      v-model="filterText"
      class="inline-input"
      ref="selectSuggest"
      :fetch-suggestions="querySearchAsync"
      :trigger-on-focus="false"
      :debounce="300"
      :placeholder="placeholder === undefined ? $t('public.pleaseEnterOrgOrDev') : placeholder"
      clearable
      @select="handleFilterNode"
    ></el-autocomplete>
    <div id="orgTree" ref="orgTree">
      <div>
        <el-tree
          ref="treeList"
          node-key="id"
          :props="organizationTreeProps"
          :load="loadNode"
          lazy
          v-loading="treeLoading"
          :default-expanded-keys="idArr"
          :empty-text="treeEmptyText"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :current-node-key="currentKey"
          :show-checkbox="showCheckbox"
          @check="handleNodeCheck"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconSty(data)" class="aci" />
              <img style="height: 0.1rem; margin-right: 0.01rem" v-if="data.icon" :src="data.icon" />
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import treeStyle from '@/mixin/tree-style'
import devIcon from '@/utils/common/dev-icon.js'

const { getDevIcon } = devIcon()
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    delSearch: {
      type: String,
      default: '',
    },
    withTenant: {
      type: Number,
    },
    treeApi: {
      type: String,
      default: 'getDeviceTree',
    },
    treeParams: {
      type: Object,
      default: () => {},
    },
    searchApi: {
      type: String,
      default: 'searchInDeviceTree',
    },
    searchParams: {
      type: Object,
      default: () => {},
    },
    locateApi: {
      type: String,
      default: 'locateInDeviceTree',
    },
    locateParams: {
      type: Object,
      default: () => {},
    },
    placeholderTitle: {
      type: String,
      default: '',
    },
    iconColor: {
      type: Boolean,
      default: false,
    },
    isDialog: {
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [treeStyle],
  data() {
    return {
      treeEmptyText: '', //内容为空的时候展示的文本
      idArr: [], //默认展开的节点的 key 的数组
      treeLoading: true,
      // tree配置项
      organizationTreeProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf',
      },
      filterText: '',
      currentKey: '',
      locateTreeTip: false,
    }
  },
  mounted() {
    this.setTreeStyle()
  },
  methods: {
    querySearchAsync(queryString, cb) {
      queryString = queryString.trim()
      if (queryString) {
        this.$refs.selectSuggest.activated = true
        const data = {
          searchName: queryString,
          ...this.searchParams,
        }
        // 后端函数调用返回联想词列表
        this.$api[this.searchApi](data).then((res) => {
          if (res && res.nodeList && res.nodeList.length > 0) {
            const nodeList = res.nodeList || []
            if (this.treeApi === 'getDeviceTree') {
              nodeList.forEach((item) => {
                item.value = item.label
              })
            } else {
              nodeList.forEach((item) => {
                item.value = item.nodeName
                item.id = item.nodeId
              })
            }
            cb(nodeList)
          } else {
            cb([])
          }
        })
      } else {
        cb([])
      }
    },
    async handleFilterNode(item) {
      // 是否处于搜索状态
      const data = {
        nodeId: item.id,
        nodeType: this.treeApi == 'getDeviceTree' ? item.type : null,
        ...this.locateParams,
      }
      this.searchFlag = true
      this.idArr = []
      await this.$api[this.locateApi](data).then((res) => {
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
    async loadNode(node, resolve) {
      if (node.level == 0) {
        await this.getTree(node.level, '', resolve)
      } else {
        await this.getTree(node.level, node.data.id, resolve)
      }
    },
    // 加载树
    async getTree(level, parentId, resolve) {
      let list = []
      let data = {
        type: 1,
        parentId: parentId ? parseInt(parentId) : null,
        ...this.treeParams,
      }
      this.withTenant ? (data.withTenant = this.withTenant) : undefined
      await this.$api[this.treeApi](data).then((res) => {
        if (res) {
          list = res.nodeList || []
          this.treeLoading = false
          return resolve(list)
        }
      })
      if (level == 0 && list.length) {
        this.$nextTick(() => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.$emit('initList', list)
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      } else if (level >= 1) {
        if (level == 1) {
          // 组织管理树特有的
          this.$emit('autoDev', list)
        }
        if (list.length) {
          this.setNode()
          if (this.searchFlag) {
            this.locateTreeTip = true
            let index1 = this.idArr.indexOf(parentId.toString())
            if (
              this.idArr.length > 1 &&
              this.locateApi == 'locateInDeviceTree' &&
              index1 + 1 < this.idArr.length - 1 &&
              list.findIndex((item) => item.id === this.idArr[index1 + 1]) < 0
            ) {
              this.idArr = []
              this.$message({
                type: 'warning',
                message: this.$t('public.locateTree'),
              })
            }
          }
        }
      }
    },
    // 点击树节点
    handleNodeClick(data, node) {
      let obj = {
        data,
        node,
      }
      this.$emit('nodeClick', obj)
    },
    handleNodeCheck(data, node) {
      if (!this.showCheckbox) return
      let obj = {
        data,
        node,
      }
      this.$emit('nodeCheck', obj)
    },
    iconSty(data) {
      if (this.treeApi == 'getTenantTree') {
        if (data.type == 1 && data.payload.type == 1) {
          return 'aci-organization iconCss'
        } else {
          if (data.type == 1 && data.payload.type == 2) {
            return 'aci-x006-folder iconCss'
          } else if (data.type == 2) {
            return 'aci-organization iconCss'
          }
        }
      } else if (this.treeApi == 'getUserTree') {
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
              for (let i = 0; i < this.idArr.length - 1; i++) {
                if (
                  this.$refs.treeList.store.nodesMap[this.idArr[i]] &&
                  this.$refs.treeList.store.nodesMap[this.idArr[i]].expanded &&
                  this.$refs.treeList.getNode(this.idArr[i + 1]) &&
                  this.$refs.treeList.getNode(this.idArr[i + 1]).expand()
                ) {
                  continue
                } else {
                  break
                }
              }
            }
          }, 500)
          if (
            this.locateApi == 'locateInDeviceTree' &&
            this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]] &&
            this.$refs.treeList.store.nodesMap[this.idArr[this.idArr.length - 1]].expanded &&
            !this.$refs.treeList.getNode(this.currentKey)
          ) {
            this.idArr = []
            this.$message({
              type: 'warning',
              message: this.$t('public.locateTree'),
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
    },
  },
}
</script>

<style lang="scss" scoped>
.orgTreeOut {
  background-color: rgb(5, 42, 63);
  :deep(.inline-input) {
    display: block;
    padding: 10px;
  }
}
</style>
