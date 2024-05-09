<template>
  <div class="card-con-1">
    <!-- 可选摄像机 -->
    <el-card class="box-card" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>可选摄像机</span>
        <!-- 单选或者非单选下不显示全选时隐藏全选 -->
        <el-checkbox
          v-show="!options.single && options.showAllSel"
          :disabled="options.single"
          v-model="isAll"
          style="float: right"
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
            <template v-if="data.showType == 'camera'">
              <i
                v-if="data.payload.ptzType == 1"
                class="aci-camera-gun"
                :class="data.payload.status == 1 ? 'iconCss' : 'iconCss2'"
              ></i>
              <i
                v-if="data.payload.ptzType == 2"
                class="aci-camera-ptz"
                :class="data.payload.status == 1 ? 'iconCss' : 'iconCss2'"
              ></i>
              <i
                v-if="data.payload.ptzType == 3"
                class="aci-camera-ball"
                :class="data.payload.status == 1 ? 'iconCss' : 'iconCss2'"
              ></i>
              <i
                v-if="data.payload.ptzType == 4"
                class="aci-camera-hemisphere"
                :class="data.payload.status == 1 ? 'iconCss' : 'iconCss2'"
              ></i>
              <i
                v-if="data.payload.ptzType == 5"
                class="aci-camera-collect"
                :class="data.payload.status == 1 ? 'iconCss' : 'iconCss2'"
              ></i>
              <span :class="data.payload.status == 1 ? 'online' : 'offline'">{{ data.label }}</span>
            </template>
            <template v-else>
              <span>{{ data.label }}</span>
            </template>
            <!-- <i
              v-if="data.showType == 'camera' && options.AIShow && data.payload.aiType == 1"
              style="margin-left: 1rem"
              class="aci-person iconCss"></i>
            <i
              v-if="data.showType == 'camera' && options.AIShow && data.payload.aiType == 2"
              style="margin-left: 1rem"
              class="aci-car iconCss"></i> -->
          </span>
        </el-tree>
      </div>
    </el-card>
    <!-- 已选摄像机 -->
    <el-card class="box-card right" v-show="canModify">
      <div slot="header" class="clearfix">
        <span>已选摄像机</span>
        <span class="clear" @click="removeAllSel">
          <el-icon class="el-icon-delete"></el-icon>
          清空
        </span>
      </div>
      <div class="box-card_item">
        <template v-for="item in selectedOptions">
          <showItem
            style="cursor: pointer"
            :data="item"
            @removeSel="removeSel"
            :key="item.id"
            :highlight="item.id === focusedItem?.id"
            @click.native="focusItem(item)"
          ></showItem>
        </template>
      </div>
    </el-card>
    <!-- 摄像机详情回显 -->
    <el-card class="box-card" v-show="!canModify" style="width: 100%">
      <div slot="header" class="clearfix">
        <span>已选摄像机</span>
      </div>
      <div class="box-card_box" v-show="selectedOptions.length">
        <template v-for="item in selectedOptions">
          <showItem
            :data="item"
            :showClose="false"
            :key="item.id"
            :highlight="item.id === focusedItem?.id"
            @click.native="focusItem(item)"
          ></showItem>
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
export default {
  name: 'CameraTree',
  components: {
    showItem,
  },
  props: {
    selectedOptions: {
      type: Array,
      default: () => [],
    },
    focusedItem: {},
    canModify: {
      // true 表示添加和修改 false 标识详情
      type: Boolean,
    },
    // 回显参数 [{type,id}] type  区域：1 ，摄像机：2
    repalyIdArr: {
      type: Array,
      default: () => [],
    },
    // 额外参数
    dataOption: {
      type: Object,
    },
    disableIds: {
      type: Array,
      default: () => [],
    },
    // 需要过滤的平台摄像机
    platType: {
      type: Number,
    },
  },
  data() {
    return {
      treeLoading: false,
      // 摄像机分组
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
      },
      isAll: false, //是否全选
      defaultExpendsId: [], //需要展开的节点
      checkedValue: [],
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
        AIShow: false, //展示智能摄像机人车图标
        showAllSel: true, //非单选情况下默认显示全选
      },
      this.dataOption
    )
  },
  watch: {
    repalyIdArr: function () {
      this.replayCamera()
    },
    // disableIds: {
    //     handler(){

    //     },
    //     immediate:true
    // }
    // 'options.showAItype':()=>{

    // }
  },
  methods: {
    updateOption(record) {
      const found = this.selectedOptions.find((a) => a.id === record.id)
      Object.keys(found)
        .filter((a) => !Object.keys(record).includes(a))
        .forEach((a) => delete found[a])
      Object.assign(found, record)
    },
    focusItem(item) {
      this.$emit('update:focusedItem', item)
    },
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
        platType: this.platType,
      }
      this.$api.getDeviceTree(data).then((res) => {
        if (res.resultCode == 0) {
          list = res.nodeList || []
          list.forEach((l) => {
            if (l.type == 2) {
              l.showType = 'camera'
              l.payload.parentId = parentId
              if (this.disableIds.includes(l.id)) {
                l.disabled = true
              }
            } else {
              if (this.options.dataType == 'camera') l.disabled = true
            }
          })
          // 根据传入的showAItype 只显示匹配的摄像机
          if (this.options.showAItype) {
            list = list.filter(
              (l) => l.type == 1 || (l.type == 2 && l.payload.aiType == this.options.showAItype)
              // l.type == 2 && l.aiType == this.options.showAItype
            )
          }

          //初始化面包屑
          this.treeLoading = false
          if (list.length && this.isAll) this.isAll = false
          return resolve(list)
        } else {
          return resolve([])
        }
      })
    },
    //
    refreshTree() {
      // this.$refs.areaTree.root.setData([])
    },
    // 复选框选中时
    nodeClick(node, checkedNode) {
      let platType
      if (node.type == 2) {
        platType = node.payload.platId.slice(-4, -2)
        this.$emit('getDevPlatType', platType, node)
      }
      let isCheck = false
      if (this.options.single) {
        // 单选
        if (checkedNode.checkedKeys.includes(node.id)) {
          this.$refs.areaTree.setCheckedKeys([node.id])
          this.checkedValue = [node.id]
          this.$emit('update:selectedOptions', [node])
          isCheck = true
        } else {
          this.$emit('update:selectedOptions', [])
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
          isCheck = true
        }
        let { checkedKeys, checkedNodes } = checkedNode
        this.checkedValue = checkedKeys
        this.$emit('update:selectedOptions', [...checkedNodes])
        // this.selectedOptions = []
      }
      this.$emit('nodeCheck', node, isCheck) //触发选中事件 ，咱是用于告警联动设置请求告警类型
    },
    // 组织树形结构渲染右侧树
    /**
     * 通过右侧点击x 删除后取消右侧树的勾选
     * @param {Number} id 节点id
     */
    removeSel(id) {
      if (this.focusedItem?.id === id) {
        this.$emit('update:focusedItem', null)
      }
      if (!this.options.strictly) {
        // 清楚全选状态
        // 去掉所有子级的
        this.$refs.areaTree.setChecked(id, false, true)
      } else {
        this.$refs.areaTree.setChecked(id, false)
      }
      this.isAll = false
      // this.checkedValue = this.checkedValue.filter((c) => c != id)
      // this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      this.$emit('update:selectedOptions', this.$refs.areaTree.getCheckedNodes())
      // this.selectedOptions = [...arr]
    },

    // 全选
    selectAll() {
      this.checkedValue = []
      if (this.isAll) {
        this.checkedValue = Object.keys(this.$refs.areaTree.store.nodesMap)
        this.checkedValue = this.checkedValue.filter((val) => !this.$refs.areaTree.store.nodesMap[val].data.disabled)
      }
      this.$refs.areaTree.setCheckedKeys(this.checkedValue)
      this.$emit('update:selectedOptions', this.$refs.areaTree.getCheckedNodes())
      // let arr2 = this.$refs.areaTree.getHalfCheckedNodes()
      // this.selectedOptions = [...arr, ...arr2]
    },
    // 清空操作
    removeAllSel() {
      this.$emit('update:focusedItem', null)
      this.$emit('update:selectedOptions', [])
      // 操作左侧树
      this.$refs.areaTree.setCheckedKeys([])
      this.isAll = false
    },
    // 新增时重置
    reset() {
      this.checkedValue = []
      this.$emit('update:selectedOptions', [])
      this.$refs.areaTree.setCheckedKeys([])
    },
  },
}
</script>
