//!  递归各个节点所需要的数据
function getNode(groupList, group) {
  let node = {}
  node.id = group.groupId
  node.label = group.groupName
  node.children = []
  node.type = group.type
  node.groupType = group.groupType
  let childrens = groupList.filter(item => item.parentId == group.groupId)
  for (let i in childrens) {
    node.children.push(getNode(groupList, childrens[i]))
  }
  return node
}
//! 将从后台获取到的数据转换成树形控件所需要的数据
export const getTreeData = (groupList, parentId) => {
  let treeData = []
  let roots = groupList.filter(item => item.parentId == parentId)
  for (let i in roots) {
    treeData.push(getNode(groupList, roots[i]))
  }
  return treeData
}
