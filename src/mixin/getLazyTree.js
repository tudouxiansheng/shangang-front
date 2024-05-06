// 懒加载树，默认展开两层
var getLazyTree = {
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
      // currentNode: null
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level == 0) {
        // this.currentNode = node;
        this.getTree(node.level, '', resolve)
      } else {
        this.getTree(node.level, node.data.id, resolve)
      }
    },
    // handleNodeExpand() {
    //   let nodedata = this.currentNode.childNodes[0];
    //   nodedata.expanded = true;
    //   nodedata.loadData();
    // },
  },
  computed: {
    iconSty(node) {
      return (node) => {
        if (node.type == 1) {
          return 'aci-organization'
        } else if (node.type == 2) {
          return 'aci-x006-folder'
        }
      }
    },
  },
}

export default getLazyTree
