<template>
  <!-- 懒加载树 -->
  <div id="orgTree">
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
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <i :class="iconSty(data)" class="aci"></i>
          <span>{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    withTenant: {
      type: Boolean,
      default: false
    },
    iconColor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeEmptyText: '', //内容为空的时候展示的文本
      idArr: [], //默认展开的节点的 key 的数组
      treeLoading: true,
      // tree配置项
      organizationTreeProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      }
    }
  },

  methods: {
    loadNode(node, resolve) {
      if (node.level == 0) {
        this.getTree(node.level, '', resolve)
      } else {
        this.getTree(node.level, node.data.id, resolve)
      }
    },
    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      this.withTenant ? (data.withTenant = 2) : null
      this.$route.query.tenantId ? (data.withTenant = 2) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        // 下级租户管理
        const query = this.$route.query
        if (level == 0 && query.tenantName) {
          list = [
            {
              id: query.organizationId.toString(),
              label: query.tenantName,
              leaf: false,
              type: '1',
              payload: {
                organizationId: query.organizationId,
                organizationName: query.tenantName,
                type: 1,
                areaCode: query.areaCode
              }
            }
          ]
        }
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(() => {
          this.idArr = [list[0].id]
          this.$refs?.treeList?.setCurrentKey(list[0].id)
          this.$emit('initList', list)
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    // 点击树节点
    handleNodeClick(data, node) {
      let obj = {
        data,
        node
      }
      this.$emit('nodeClick', obj)
    },
    iconSty(node) {
      if (!this.iconColor) {
        if (node.payload.type == 1) {
          return 'aci-organization iconCss'
        } else if (node.payload.type == 2) {
          return 'aci-x006-folder iconCss'
        }
      } else {
        if (node.payload.type == 1) {
          return 'aci-organization iconCss1'
        } else if (node.payload.type == 2) {
          return 'aci-x006-folder iconCss1'
        }
      }
    }
  }
}
</script>
