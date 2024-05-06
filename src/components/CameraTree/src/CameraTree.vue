<template>
  <div class="card-con">
    <!-- 可选摄像机 -->
    <el-card class="box-card" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>{{ $t('public.optionalCamera') }}</span>
        <el-checkbox
          v-show="!options.single"
          :disabled="options.single"
          v-model="isAll"
          style="float: right; padding: 3px 0"
          :label="$t('Role.Title.all')"
          @change="selectAll"
        ></el-checkbox>
      </div>
      <div class="box-card_item">
        <el-tree
          ref="areaTree"
          lazy
          :load="loadNode"
          show-checkbox
          node-key="id"
          v-loading="treeLoading"
          :default-expand-all="options.expandAll"
          :props="defaultProps"
          :default-checked-keys="checkedValue"
          :default-expanded-keys="defaultExpendsId"
          :check-strictly="options.strictly"
          @check="nodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- <el-icon v-if="data.type == 'camera'" class="el-icon-video-camera" style="margin-right:4px"></el-icon> -->
            <i v-if="data.showType == 'camera'" class="aci-camera-gun iconCss"></i>
            <span>{{ data.label }}</span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <!-- 已选摄像机 -->
    <el-card class="box-card right" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>{{ $t('public.selectedCamera') }}</span>
        <span class="clear" @click="removeAllSel">
          <el-icon class="el-icon-delete"></el-icon>
          {{ $t('Role.Title.clear') }}
        </span>
      </div>
      <div class="box-card_item">
        <template v-for="(item, index) in selTreeData">
          <showItem :data="item" @removeSel="removeSel" :key="index"></showItem>
        </template>
      </div>
    </el-card>
    <!-- 摄像机详情回显 -->
    <el-card class="box-card" v-show="!canModify" style="width: 100%">
      <div slot="header" class="clearfix">
        <span>{{ $t('public.selectedCamera') }}</span>
      </div>
      <div class="box-card_box" v-show="selTreeData.length">
        <template v-for="(item, index) in selTreeData">
          <showItem :data="item" :showClose="false" :key="index"></showItem>
        </template>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@import './CameraTree.scss';
</style>
>
<script>
import showItem from './showItem.vue'
import { getDeviceTree, getRoleUserCameraOrgRequest } from '../../../utils/api'
export default {
  name: 'CameraTree',
  components: {
    showItem,
  },
  props: {
    canModify: {
      // true 表示添加和修改 false 标识详情
      type: Boolean,
    },
    // 回显参数 [{type,id}] type  区域：1 ，摄像机：2
    replayIdArr: {
      type: Array,
      default: () => [],
    },
    // 额外参数
    dataOption: {
      type: Object,
      // default: function () {
      //   return {
      //     dataType: 'all', //选择的类型 ，可选 ‘all’ 、'camera'
      //     single: false, //单选
      //     expandAll: false, //懒加载树是否全部展开
      //     strictly: true //是否父子关联
      //   }
      // }
    },
  },
  data() {
    return {
      treeLoading: false,
      // 摄像机分组
      selectedOptions: [], //勾选的树节点 一维数组
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
      },
      isAll: false, //是否全选
      defaultExpendsId: [], //需要展开的节点
      checkedValue: [],
      selTreeData: [], //回显使用的节点集合
      cameraId: [], //要保存的摄像机id
      options: null, //参数副本
    }
  },
  created() {
    // 参数默认值
    this.options = Object.assign(
      {
        dataType: 'all', //选择的类型 ，可选 ‘all’ 、'camera'
        single: false, //单选
        expandAll: false, //懒加载树是否全部展开
        strictly: true, //是否父子关联
      },
      this.dataOption
    )
  },
  mounted() {
    // this.replayCamera()
  },
  watch: {
    selectedOptions: function () {
      this.resetRightTree()
    },
    replayIdArr: {
      handler() {
        console.log(123123123);
        this.replayCamera()
      },
    },
  },
  methods: {
    // 懒加载树
    loadNode(node, resolve) {
      let { level } = node
      if (level == 0) {
        this.getTree(level, 0, resolve)
      } else {
        this.getTree(level, node.data.id, resolve)
      }
    },
    // 获取懒加载数据接口
    getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1,
        subType: 2, //区域
        parentId,
        defaultType: 1,
      }
      getDeviceTree(data).then((res) => {
        if (res.resultCode == 0) {
          list = res.nodeList || []
          list.forEach((l) => {
            if (l.type == 2) {
              l.showType = 'camera'
              l.payload.parentId = parentId
            } else {
              if (this.options.dataType == 'camera') l.disabled = true
            }
          })
          //初始化面包屑
          this.treeLoading = false
          if (list.length && this.isAll) this.isAll = false
          return resolve(list)
        } else {
          return resolve([])
        }
      })
    },
    // 复选框选中时
    nodeClick(node, checkedNode) {
      if (this.options.single) {
        // 单选
        if (checkedNode.checkedKeys.includes(node.id)) {
          this.$refs.areaTree.setCheckedKeys([node.id])
          this.checkedValue = [node.id]
          this.selectedOptions = [node]
        } else {
          this.selectedOptions = []
        }
      } else {
        if (!checkedNode.checkedKeys.includes(node.id)) {
          this.isAll = false
        } else {
          let nodesAllKey = Object.keys(this.$refs.areaTree.store.nodesMap)
          let arr = nodesAllKey.map((n) => this.$refs.areaTree.store.nodesMap[n])
          if (!arr.find((n) => n.checked == false)) {
            this.isAll = true
          }
        }
        let { checkedKeys, checkedNodes } = checkedNode
        this.checkedValue = checkedKeys
        // this.selectedOptions = []
        this.selectedOptions = [].concat([...checkedNodes])
      }
    },
    // 组织树形结构渲染右侧树
    resetRightTree() {
      let dataList = JSON.parse(JSON.stringify(this.selectedOptions))
      this.selTreeData = []
      // let pIds = []
      dataList.forEach((data) => {
        // pIds.push(data.id)
        // if (!pIds.includes(data.payload.parentId + '')) {
        //   this.selTreeData.push(data)
        // }
        // 只显示摄像机
        if (this.options.dataType == 'camera' && data.showType == 'camera') {
          this.selTreeData.push(data)
        } else if (this.options.dataType == 'all') {
          this.selTreeData.push(data)
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
      this.checkedValue = this.checkedValue.filter((c) => c != id)
      this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      this.selectedOptions = this.$refs.areaTree.getCheckedNodes()
      // this.selectedOptions = [...arr]
    },

    // 全选
    selectAll() {
      this.checkedValue = []
      if (this.isAll) {
        this.checkedValue = Object.keys(this.$refs.areaTree.store.nodesMap)
      }
      this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      this.selectedOptions = this.$refs.areaTree.getCheckedNodes()
      // let arr2 = this.$refs.areaTree.getHalfCheckedNodes()
      // this.selectedOptions = [...arr, ...arr2]
    },
    // 清空操作
    removeAllSel() {
      this.selectedOptions = []
      // 操作左侧树
      this.$refs.areaTree.setCheckedKeys([])
      this.isAll = false
    },
    // 保存时所需要的参数处理 按照部分接口使用
    // getSaveData() {
    //   this.resetRightTree() //同步
    //   this.cameraId = Array.from(new Set(this.cameraId))
    //   let saveData = []
    //   this.selTreeData.forEach((data) => {
    //     if (data.showType == 'camera') {
    //       saveData.push({
    //         cameraId: data.id,
    //         type: 2,
    //         label: data.label
    //       })
    //     } else {
    //       saveData.push({
    //         orgId: Number(data.id),
    //         type: 1,
    //         label: data.label
    //       })
    //     }
    //   })
    //   return saveData
    // },
    // 保存时所需要的参数处理 按照部分接口使用
    getSaveData() {
      this.resetRightTree() //同步
      this.cameraId = Array.from(new Set(this.cameraId))
      let saveData = []
      this.selTreeData.forEach((data) => {
        if (data.showType == 'camera') {
          saveData.push({
            label: data.label,
            id: data.id,
            type: 2,
          })
        } else {
          saveData.push({
            label: data.label,
            id: Number(data.id),
            type: 1,
          })
        }
      })
      return saveData
    },
    // 根据参数id集合请求回显的值
    replayCamera() {
      var _this = this
      this.checkedValue = []
      this.selTreeData = []
      this.defaultExpendsId = []
      let areaIdList = this.replayIdArr.filter((r) => r.type == 1).map((r) => r.id)
      let cameraIdList = this.replayIdArr.filter((r) => r.type == 2).map((r) => r.id)
      if (!areaIdList.length && !cameraIdList.length) {
        this.selTreeData = []
        this.selectedOptions = []
        this.$refs.areaTree.setCheckedKeys(this.checkedValue)
        return
      }
      getRoleUserCameraOrgRequest({ areaIdList, cameraIdList }).then((res) => {
        this.selTreeData = []
        if (res.resultCode == 0) {
          res.areaInfoList?.forEach((org) => {
            this.selTreeData.push({
              label: org.orgName,
              id: org.orgId,
            })
            this.checkedValue.push(org.orgId + '')
            org.parents = org.parents.slice(0, -1)
            var _ps = org.parents.split(',')
            if (_ps.length >= 2) {
              this.defaultExpendsId = [...new Set([..._ps, ...this.defaultExpendsId])]
            }
          })
          res.cameraInfoList?.forEach((car) => {
            this.selTreeData.push({
              label: car.cameraName,
              id: car.cameraId,
              showType: 'camera',
            })
            this.checkedValue.push(car.cameraId)
            car.parents = car.parents.slice(0, -1)
            var _ps = car.parents.split(',')
            if (_ps.length >= 2) {
              this.defaultExpendsId = [...new Set([..._ps, ...this.defaultExpendsId])]
            }
          })
        }
        this.$refs.areaTree.setCheckedKeys(_this.checkedValue)
        this.selectedOptions = JSON.parse(JSON.stringify(this.selTreeData))
      })
    },
    // 新增时重置
    reset() {
      this.checkedValue = []
      this.selectedOptions = []
      this.selTreeData = []
      this.$refs.areaTree.setCheckedKeys([])
    },
  },
}
</script>
