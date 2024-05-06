import LazySearchTree from '../component/lazy-search-tree'
import searchTree from '../component/search-tree'
import deviceShare from '../component/device-share'
import cancelShare from '../component/cancel-share'
import sharePermission from '../component/share-permission'
import { sStorage } from '@/utils/common/store'
export default {
  components: {
    LazySearchTree,
    searchTree,
    deviceShare,
    cancelShare,
    sharePermission
  },
  data() {
    return {
      shareDeviceDialogVisible: false,
      cancelShareDialogVisible: false,
      shareDialogVisible: false,
      currentId: '0',
      currentType: '1',
      checkedNodes: [],
      currentDeviceNode: {}
    }
  },
  created() {
    this.currentId = sStorage.get('organizationId')
  },
  methods: {
    initList() {
      this.$refs.shareUserTree.getTree()
    },
    nodeCheck() {},
    nodeClick(obj, type) {
      const { data } = obj
      switch (type) {
        case '01':
          this.currentId = String(data.id)
          this.currentType = String(data.type)
          this.$nextTick(() => {
            this.initList()
          })
          break
        case '02':
          break
      }
    },
    handleShareDevice() {
      this.shareDeviceDialogVisible = true
    },
    handleCancelShare() {
      const checkedNodes =
        this.$refs.shareUserTree.$refs.treeList
          .getCheckedKeys()
          .filter(item => String(item).length > 10) || []
      this.checkedNodes = checkedNodes
      if (!checkedNodes.length) {
        this.$message.warning(this.$t('shareDevice.pleaseCheckedCancelUser'))
        return false
      } else if (checkedNodes.length > 20) {
        this.$message.warning(this.$t('shareDevice.max20CheckedShareUser'))
        return false
      } else {
        this.cancelShareDialogVisible = true
      }
    },
    optioncb() {
      this.$refs.shareUserTree.$refs.treeList.setCheckedKeys([])
      this.initList()
    },
    handleshareAuth() {
      const checkedNodes =
        this.$refs.shareUserTree.$refs.treeList
          .getCheckedNodes()
          .filter(item => String(item.id).length > 10)
          .map(i => i.id) || []
      if (!checkedNodes.length) {
        this.$message.warning(this.$t('shareDevice.pleaseCheckedShareUser'))
        return false
      } else {
        this.currentDeviceNode = { userIds: checkedNodes, groupId: this.currentId }
        this.shareDialogVisible = true
      }
    }
  }
}
