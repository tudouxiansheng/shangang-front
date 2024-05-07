<!-- 调拨设备区域选择树 -->
<template>
  <el-tree
    v-if="showTree"
    class="areaTree"
    ref="areaTree"
    node-key="id"
    :props="treeProps"
    :load="loadNode"
    lazy
    expand-on-click-node
    :default-expanded-keys="defaultExpendsId"
    v-loading="treeLoading"
    :check-strictly="true"
    @node-click="handleNodeClick">
    <template slot-scope="{ node, data }">
      <span class="custom-tree-node">
        <el-checkbox v-if="data.type == 2 && disableId == data.id" disabled checked></el-checkbox>
        <el-checkbox
          v-if="data.type == 2 && disableId != data.id"
          v-model="data.checked"></el-checkbox>
        <i v-if="data.type == 2" class="aci-camera-gun iconCss"></i>
        <span class="tree-label" :title="data.label">{{ data.label }}</span>
      </span>
    </template>
  </el-tree>
</template>

<script>
export default {
  props: {
    showAreaTree: {
      type: Boolean
    },
    disableId: {
      type: String
    }
  },
  data() {
    return {
      treeProps: {
        label: 'areaName',
        children: [],
        isLeaf: 'leaf'
      },
      curNode: null, //判断是添加子集还是编辑
      treeLoading: false,
      checkedValue: [],
      showTree:true,
      defaultExpendsId: []
    }
  },
  watch: {
    // 存在未分组的，需要回显处理
    checkedValue(val) {
      if (val.length) {
        val.forEach((v) => {
          let node = this.$refs.areaTree.getNode(v)
          node && node.data && (node.data.checked = true)
        })
        this.expandNode(val)
      }
    }
  },
  methods: {
    /****************树操作 */
    expandNode(val) {
      this.$api.getRoleUserCameraOrgRequest({ cameraIdList: val }).then((res) => {
        if (res.resultCode == 0) {
          let ids = []
          res.cameraInfoList?.forEach((item) => {
            var parents = item.parents.split(',').slice(0, -1)
            ids = [...ids, ...parents]
          })
          this.defaultExpendsId = Array.from(new Set(ids))
        }
      })
    },
    // 加载树
    loadNode(node, resolve) {
      let { level } = node
      if (level == 0) {
        this.getTree(level, 0, resolve)
      } else {
        this.getTree(level, node.data.id, resolve)
      }
    },
    // 懒加载加载树
    getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1,
        subType: 2, //区域
        parentId,
        defaultType: 1
      }
      data.parentId = !!parentId ? parentId : 0
      this.$api.getDeviceTree(data).then((res) => {
        list = res.nodeList || []
        list.map((l) => {
          if (l.type == 2) {
            if (this.checkedValue.includes(l.id)) {
              l.checked = true
            } else l.checked = false
          }
        })
        //初始化面包屑
        this.treeLoading = false
        return resolve(list)
      })
    },
    handleNodeClick(data, node) {
      if (data.type == 2) {
        if (data.id != this.disableId) {
          data.checked = !data.checked
          this.$emit('selDevice', data)
        } else {
          this.$message.info('不能选择和告警设备相同的摄像机')
        }
      }
    },
    refresh() {
      this.showTree = false
      this.$nextTick(() => {
        this.showTree = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.areaTree {
  height: calc(100% - 40px) !important;
  background: transparent;
  ::v-deep .custom-tree-node {
    width: 100%;
    .el-checkbox {
      margin-right: 5px !important;
      pointer-events: none;
    }
    // .tree-label{
    //   width: ;
    // }
  }
  ::v-deep .el-tree-node__content,
  .el-tree-node__content:hover {
    background: transparent !important;
  }
}
</style>