<template>
  <div class="leftart">
    <div class="searchTab">
      <!-- <el-select
        v-model="areaType"
        clearable
        placeholder="请选择区域类型"
        style="width: 294px"
        @change="changeArea"
      >
        <el-option
          v-for="(item, index) in area"
          :key="index"
          :label="item.areaName"
          :value="item"
        ></el-option>
      </el-select> -->
    </div>
    <div class="searchTab">
      <el-input clearable placeholder="请输入设备名称搜索" v-model="filterText">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
    </div>
    <div class="myTree2" id="myTree2">
      <!-- <ul class="infinite-list" v-infinite-scroll="load" style="overflow: auto;height:100%" :infinite-scroll-distance="10">
        <li

          v-for="item,index in count"
          :key="index"
          class="infinite-list-item"
          style="margin:5px 0;cursor:pointer"
          @click="handleNodeClick(item)"

        >
          <span class="iconfont icon" :class="{'icon-shexiangtou':item.status==1,'icon-shexiangtou-close':item.status!=1}" ></span
          ><span class="infinite_text">{{ item.deviceName }}</span>
        </li>
      </ul> -->
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        v-loading="dataLoading"
        :element-loading-text="elementLoadingText"
        element-loading-spinner="el-icon-loading"
        @check-change="handleCheckChange"
        :expand-on-click-node="false"
        :filter-node-method="filterNodeMethod"
        v-model="filterText"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            :class="{
              iconfont: data.type == 2,
              icon: data.type == 2,
              'icon-shexiangtou': data.type == 2,
            }"
          ></span>
          <span style="color: #ffff">{{ node.label }}</span>
        </span>
      </el-tree>
      <!-- <el-tree
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="[1,2]"
        :filter-node-method="filterNodeMethod"
        ref="tree"
        node-key="type"
      ></el-tree> -->
    </div>
  </div>
</template>

<script>
import {
  getDeviceTree,
  getDeviceTree2,
  getMyAreaList,
  getDeviceListInArea,
} from '@/utils/api'
import { AllcamMap } from '@/utils/map/AllcamMap'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      count: [], //左侧列表
      area: [],
      areaType: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      dataLoading: true,
      filterText: '',
      elementLoadingText: '设备努力加载中',
      pageNum: 1,
      alarmTypeList: [
        'ALARM_STAFF_LEAVE',
        'ALARM_STAFF_SLEEP',
        'ALARM_SMOKE',
        'ALARM_HELMET_DETECT',
        'ALARM_USE_PHONE_WHILE_WALKING',
        'ALARM_YELLOW_SMOKE',
        'ALARM_WATER_DETECT',
        'ALARM_WEAR_LABOR_CLOTH',
      ],
    }
  },
  mounted() {
    this.getOrganizationTree()
    this.getAreaList()
    this.getList()
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    // searchListFn(value) {
    //   getDeviceListInArea({
    //     pageInfo: {
    //       pageNum: 1,
    //       pageSize: 5000,
    //     },
    //     deviceType: 1,
    //     deviceName: value,
    //   }).then((res) => {
    //     this.count = res.resultList;
    //   });
    // },
    print(node) {
      console.log('print node', node)
    },
    load() {
      this.pageNum++
      this.getList()
      // this.count += 2
    },
    changeArea(obj) {
      getDeviceListInArea({
        pageInfo: {
          pageNum: 1,
          pageSize: 5000,
        },
        deviceType: 1,
        areaId: obj.id,
      }).then((res) => {
        this.count = res.resultList
      })
      console.log(obj, 'obj')
      this.$store.commit('areaIdChange', obj.id)
      this.areaType = obj.areaName
      // console.log(areaId, "areaId");
      console.log(AllcamMap.map.getPlotById(obj.areaId))
      console.log(
        AllcamMap.map.plotDrawTool.getEntitys().filter((item) => {
          return item.attribute.type == 'rectangle'
        })
      )
      const entity = AllcamMap.map.getPlotById(obj.areaId)
      if (entity) {
        AllcamMap.map.viewer.flyTo(entity, {
          duration: 1,
        })
      }
    },
    getAreaList() {
      getMyAreaList({}).then((res) => {
        if (res.resultCode == 0) {
          this.area = res.resultList
        }
      })
    },
    //左边组织树
    //左边列表
    getList(deviceName = '', areaId = '') {
      getDeviceListInArea({
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: 10,
        },
        deviceType: 1,
        deviceName,
        areaId,
      }).then((res) => {
        this.count.push(...res.resultList)
        console.log(res, '数据列表')
      })
    },
    getOrganizationTree() {
      // console.log("路路由",this.$route.query.codeType);
      getDeviceTree2({
        alarmType: this.$route.query.codeType,
        deviceName: '',
      }).then((res) => {
        if (res.resultCode == 0) {
          this.dataLoading = false
          if (res.nodeList) {
            this.treeData = this.traverse(res.nodeList)
          }
        }
      })
    },
    traverse(nodes) {
      let list = []
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        node.label = node.type === 1 ? node.organizationName : node.deviceName
        if (node.children && node.children.length) {
          node.children = this.traverse(node.children)
        }
        list.push(node)
      }
      return list
    },
    handleCheckChange(val) {
      console.log(val, 'val')
    },
    filterNodeMethod(value, data) {
      console.log('过滤函数', value, data)
      if (!value) return true
      let name = data.type === 1 ? data.organizationName : data.deviceName
      return name.includes(value)
    },
    handleNodeClick(obj) {
      if (AllcamMap.map) {
        this.$store.commit('facilityIdChange', obj.deviceId)
        const entity = AllcamMap.map.getPlotById(obj.deviceId)
        if (entity) {
          AllcamMap.map.viewer.flyTo(entity, {
            duration: 1,
          })
        }
      }
    },
  },
}
</script>

<style lang="scss">
.infinite_text {
  font-size: 14px;
  color: #fff;
}
.icon {
  margin-right: 10px;
}
.red {
  background-color: #e80000;
}
.green {
  background-color: #85ce61;
}
.leftart {
  width: 354px;
  height: 906px;
  position: absolute;
  padding: 30px;
  pointer-events: auto;
  background: url('../../../../../assets/buildingSeting/background.png');

  .searchTab {
    margin-bottom: 20px;
  }

  #myTree2 {
    margin-top: 1.875rem;
    height: 600px;
    overflow-y: scroll;

    .el-tree {
      background: none;
    }

    .el-tree-node__label {
      color: #c1c7d0;
    }
  }

  #myTree2 .el-tree-node__content:hover {
    background-color: rgba(31, 96, 163, 0.5);
  }

  #myTree2 .el-tree-node__content:focus {
    background-color: rgba(31, 96, 163, 0.5);
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba(31, 96, 163, 0.5);
  }
}
</style>
