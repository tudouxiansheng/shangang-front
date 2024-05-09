<template>
  <div class="card-con">
    <el-card class="box-card" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>可选摄像机</span>
        <el-checkbox
          v-model="isAll"
          style="float: right; padding: 3px 0"
          label="全选"
          @change="selectAll"></el-checkbox>
      </div>
      <div class="box-card_item">
        <el-tree
          :data="cameraArray"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="checkedValue"
          ref="areaTree"
          @check="nodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- <el-icon v-if="data.type == 'camera'" class="el-icon-video-camera" style="margin-right:4px"></el-icon> -->
            <i v-if="data.type == 'camera'" class="aci-camera-gun"></i>
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <el-card class="box-card right" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>已选摄像机</span>
        <span class="clear" @click="removeAllSel">
          <el-icon class="el-icon-delete"></el-icon>
          清空
        </span>
      </div>
      <div class="box-card_item">
        <template v-for="item in selTreeData">
          <showItem :data="item" @removeSel="removeSel"></showItem>
        </template>
      </div>
    </el-card>
    <div class="box-card" v-show="!canModify && selTreeData.length">
      <div class="box-card_box">
        <template v-for="item in selTreeData">
          <showItem :data="item" :showClose="false"></showItem>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import showItem from './showItem.vue'
export default {
  props: {
    canModify: {
      type: Boolean
    },
    cameraIds: {
      type: Object
    }
  },
  components: {
    showItem
  },
  data() {
    return {
      // 摄像机分组
      cameraArray: [],
      selectedOptions: [], //勾选的树节点 一维数组
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isAll: false,
      checkedValue: [],
      selTreeData: [],
      allIdArr: [],
      cameraId: [], //要保存的摄像机id
      cameraParentInfoList: [],
      // 保存摄像机接口信息
      /*********************************************** */

      halfCheckedKeys: [],
      curNode: null
    }
  },
  created() {
    this.getAreaList()
  },
  watch: {
    selectedOptions: function () {
      this.resetRightTree()
    },
    cameraIds: function () {
      this.replayCamera()
    },
  },
  methods: {
    /**
     * 获取区域和摄像机树
     */
    getAreaList() {
      this.$api.getRoleAreaTree({}).then((res) => {
        if(res.resultCode == 0){
          if (res.areaCameraInfoList && res.areaCameraInfoList.length) {
            this.cameraArray = res.areaCameraInfoList[0].children
            // 根据接口数据关联pid
            res.cameraParentInfoList.forEach((c) => (c.type = 'camera'))
            this.cameraParentInfoList = res.cameraParentInfoList
            this.setParentId(res.areaParentInfoList, this.cameraArray)
            this.setParentId(res.cameraParentInfoList, this.cameraArray)
            this.$nextTick().then(()=>{
              if (this.cameraIds?.treeId) {
                this.replayCamera()
              }
            })
          }
        }
      })
    },
    // 根据接口关联摄像机和区域
    setParentId(parentList, cameraArray) {
      cameraArray.forEach((ca) => {
        this.allIdArr.push(ca.code)
        ca.id = ca.code
        if (typeof ca.parentId == 'undefined') var p = parentList.find((p) => p.code == ca.code)
        if (p) {
          ca.parents = p.parents
          ca.parentId = p.parentId
          if (p.type) ca.type = p.type
        }
        // ca.parentId = parentList.find((p) => p.code == ca.code)?.parentId;
        if (ca?.children?.length) {
          this.setParentId(parentList, ca.children)
        }
      })
    },
    // 复选框选中时
    nodeClick(node, checkedNode) {
      let { checkedKeys, checkedNodes, halfCheckedNodes, halfCheckedKeys } = checkedNode
      this.halfCheckedKeys = halfCheckedKeys
      this.checkedValue = checkedKeys
      // let flag = checkedKeys.includes(node.id); //选中或取消状态
      this.selectedOptions = []
      // 找到当前选中节点的所有子节点和递归父辈节点
      // this.getAllParents(halfCheckedKeys,this.cameraArray);
      this.selectedOptions = this.selectedOptions.concat([...halfCheckedNodes, ...checkedNodes])
    },
    // 组织树形结构渲染右侧树
    resetRightTree() {
      let dataList = JSON.parse(JSON.stringify(this.selectedOptions))
      this.selTreeData = []
      this.cameraId = []
      dataList.forEach((data) => {
        if (data.parentId == 0) {
          //一级
          delete data.children
          this.selTreeData.push(data)
          if (data.type == 'camera') this.cameraId.push(data.id)
        }
        delete data.children
      })
      this.selTreeData.forEach((td) => {
        this.setChildren(td, dataList)
      })
    },
    // 根据所有节点组织节点子集 递归
    setChildren(node, array) {
      array.forEach((arr) => {
        if (arr.type == 'camera') this.cameraId.push(arr.id)
        if (arr.parentId == node.id) {
          if (!node.children) node.children = []
          node.children.push(arr)
          this.setChildren(arr, array)
        }
      })
    },

    /**
     * 通过右侧点击x 删除后取消右侧树的勾选
     * @param {Number} id 节点id
     */
    removeSel(id) {
      // 清楚全选状态
      this.isAll = false

      let nodes = []
      // 根据id寻找节点
      this.getNodeById(id, this.selTreeData, nodes)
      if (nodes[0]) {
        // 寻找子节点
        let arr = [id]
        this.getChildId(nodes[0], arr)
      };
      this.checkedValue = this.checkedValue.filter((c) => c != id)
      // 找父节点
      let halfKeys = this.$refs.areaTree.getHalfCheckedKeys();
      let ids,ids2=[];
      // 如果是摄像机 通过摄像机父级去找
      if(nodes[0].type == 'camera'){
        var n = []
        this.getNodeById(nodes[0].parentId, this.selTreeData, n);
        ids = n[0].parents.split(',');
      }else{// 通过节点去找
        ids = nodes[0].parents.split(',');
      }
      ids.forEach(_id=>{
        if(_id && !halfKeys.includes(_id))ids2.push(_id)
      })
      ids2.forEach(_id=>{
        this.checkedValue = this.checkedValue.filter((c) => c != _id)
      })
      this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      let arr = this.$refs.areaTree.getCheckedNodes()
      let arr2 = this.$refs.areaTree.getHalfCheckedNodes()
      this.selectedOptions = [...arr, ...arr2]
    },
    getChildId(node, arr) {
      if (node.children) {
        node.children.forEach((n) => {
          // arr.push(n.id);
          this.checkedValue = this.checkedValue.filter((c) => c != n.id)
          if (n.children) {
            this.getChildId(n, arr)
          }
        })
      }
    },
    // 根据id寻找节点
    getNodeById(id, array, nodes) {
      array.some((a) => {
        if (a.id == id) {
          nodes.push(a)
        } else if (a.children) {
          return this.getNodeById(id, a.children, nodes)
        }
      })
    },

    // 全选
    selectAll() {
      this.checkedValue = []
      if (this.isAll) this.checkedValue = this.allIdArr
      this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      let arr = this.$refs.areaTree.getCheckedNodes()
      let arr2 = this.$refs.areaTree.getHalfCheckedNodes()
      this.selectedOptions = [...arr, ...arr2]
    },
    // 清空操作
    removeAllSel() {
      this.selectedOptions = []
      // 操作左侧树
      this.$refs.areaTree.setCheckedKeys([])
      this.isAll = false
    },
    // 保存时所需要的参数处理
    getSaveData() {
      this.cameraId = Array.from(new Set(this.cameraId))
      // var obj = {};
      var info = []
      this.cameraId.forEach((c) => {
        var aId = this.cameraParentInfoList.find((ca) => ca.code == c)?.parentId
        // if(!obj[aId])obj[aId] = [];
        // obj[aId].push(c)
        info.push({
          roleId: null,
          areaId: aId + '',
          cameraId: c + ''
        })
      })
      // Object.keys(obj).forEach(k=>{
      //   obj[k].forEach(id=>{
      //     info.push({
      //       roleId:null,
      //       areaId:k,
      //       cameraId:id + '',
      //     })
      //   })
      //   // info.push({
      //   //   areaId:k,
      //   //   cameraId:obj[k],
      //   //   roleId:null,
      //   // })
      // })
      return info
    },
    // 回显的摄像机数据
    replayCamera() {
      this.selectedOptions = []
      if(this.cameraIds?.cameras){
        this.$refs.areaTree.setCheckedKeys(this.cameraIds?.cameras?.map((c) => c.code));
      }else{
        this.$refs.areaTree.setCheckedKeys([]);
      }
      let checkedNodes = this.$refs.areaTree.getCheckedNodes();
      let halfCheckedNodes = this.$refs.areaTree.getHalfCheckedNodes();
      this.selectedOptions = this.selectedOptions.concat([...halfCheckedNodes, ...checkedNodes]);
      this.checkedValue = this.$refs.areaTree.getCheckedKeys()
    },
    // 新增时重置
    reset(){
      this.checkedValue = [];
      this.selectedOptions = [];
      this.selTreeData = [];
      this.$refs.areaTree.setCheckedKeys([]);
    }

    /************************************************************************************************** */
  }
}
</script>

<style lang="scss" scoped>
.card-con {
  display: flex;
  justify-content: flex-start;
  .right {
    margin-left: 20px;
  }
  ::v-deep .el-checkbox {
    color: #fff;
  }
  ::v-deep .el-card__header {
    border-bottom: 1px solid #156c9e;
    .clear {
      cursor: pointer;
      float: right;
      padding: 3px 0;
    }
  }
  .el-tree {
    background: #134b71;
  }
  ::v-deep .el-tree-node__content {
    background: #134b71;
  }

  .el-card {
    border: none;
  }
}
.box-card {
  width: 320px;
  // height: 320px;
  max-height: 320px;
  background: #134b71;
  color: #ffffff;
  &_item {
    font-size: 14px;
    margin-bottom: 18px;
    height: 200px;
    overflow: auto;
    // .el-tree{
    //   background: #134b71;
    // }
    // .el-tree-node__content:hover{
    //   background: #134b71;
    // }
    .selectItem {
      display: flex;
      justify-content: space-between;
      &-del {
        cursor: pointer;
      }
    }
  }
  &_box {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
.camera {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('~@/assets/images/common/camera.png');
  background-size: 100% 100%;
  vertical-align: text-bottom;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>>
