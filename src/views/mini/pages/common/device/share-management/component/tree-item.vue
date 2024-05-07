<template>
  <div>
    <div class="tree-header">
      <img :src="src" alt="" />
      <span>{{ chooseLabel }}</span>
    </div>
    <div class="tree-checked">
      <el-checkbox :title="checkedLabel" ref="shareOrgRef" v-model="checked" v-if="isShowChecked">
        {{ checkedLabel }}
      </el-checkbox>
    </div>
    <lazy-search-tree
      v-if="lazy"
      class="shareDialogTree"
      ref="shareDialogTree"
      :sty="sty"
      :iconColor="true"
      :treeApi="treeApi"
      :showCheckbox="true"
      @nodeClick="nodeClick"
      @nodeCheck="nodeCheck"
      :planeType="1"
    />
    <search-tree
      v-else
      class="shareDialogTree"
      ref="shareUserTree"
      treeApi="getUserTree"
      :showCheckbox="true"
      :planeType="1"
      :isGroupId="isGroupId"
    />
  </div>
</template>
<script>
import LazySearchTree from './lazy-search-tree'
import searchTree from './search-tree'
export default {
  components: {
    LazySearchTree,
    searchTree
  },
  props: {
    isGroupId: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: true
    },
    isShowChecked: {
      type: Boolean,
      default: false
    },
    myChecked: {
      type: Boolean,
      default: true
    },
    chooseLabel: {
      type: String,
      default: '选择共享设备'
    },
    checkedLabel: {
      type: String,
      default: '共享组织，自动关联后续新增的所有子组和设备'
    },
    treeApi: {
      type: String,
      default: 'getDeviceTree'
    }
  },
  computed: {
    checked: {
      get() {
        return this.myChecked
      },
      set(val) {
        this.$emit('update:myChecked', val)
      }
    },
    checkedNodes() {
      return this.$refs.shareUserTree.$refs.treeList
        .getCheckedNodes()
        .filter(item => String(item.id).length > 10)
    }
  },
  data() {
    return {
      src: require('@/assets/img/common/share-title-item.png'),
      sty: {
        background: '#F8F8F8'
      }
    }
  },
  methods: {
    nodeClick() {},
    nodeCheck(data) {
      this.$emit('cb', data)
    }
  }
}
</script>
<style lang="scss">
.shareDialogTree.orgTreeOut {
  margin-top: unset;
  background-color: transparent !important;
  height: calc(100% - 70px);
  max-height: calc(100% - 70px);
  overflow: hidden;
  .el-input__inner {
    width: 100%;
    height: 36px;
    background: #ffffff;
    border: 1px solid #e8f1ff;
  }
  #orgTree {
    padding: 0 10px;
    margin-top: 20px;
    height: calc(100% - 80px) !important;
  }
  #orgTree,
  .el-tree,
  .el-tree-node__content,
  .el-tree-node__content:hover {
    background-color: transparent;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #3085cb;
  }
  i.aci.iconCss {
    color: #a5a5a5;
  }
}
</style>
