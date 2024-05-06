<template>
  <!--选择摄像机-->
  <div class="choseCamera">
    <div class="title2">
      <span>选择摄像机</span>
      <img class="closeImg" src="../../../../assets/vehicleApp/close.png" alt="" @click="sureChoseCamera" />
    </div>
    <div class="content">
      <div class="contentleft">
        <div class="titlebox">设备目录</div>
        <div class="inputSelect">
          <el-input placeholder="请输入设备名称" v-model="filterText"></el-input>
          <img src="../../../../assets/faceSearch/search.png" style="width: 17px; cursor: pointer" class="search" />
          <div class="line"></div>
          <img
            src="../../../../assets/refresh.png"
            style="width: 16px; cursor: pointer"
            class="refresh"
            @click="findTreeData"
          />
        </div>
        <div id="orgTree">
          <el-tree
            :data="treedata"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            @check-change="handleNodeClick"
            :filter-node-method="filterNode"
            :indent="0"
            class="tree-line"
            :default-checked-keys="choseDeviceId"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i :class="iconStyUser(data)" class="iconCss"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="centerRightImg">
        <img src="../../../../assets/faceSearch/rightTo.png" style="height: 18px" />
      </div>
      <div class="contentRight">
        <div class="titlebox">
          已选设备
          <div class="rightclear" @click="clearDevice">
            <img src="../../../../assets/faceSearch/rubbish.png" />
            <span>清空</span>
          </div>
        </div>
        <div class="choseDevice">
          <el-checkbox-group v-model="checkedDevice" @change="handleCheckedDevice">
            <el-checkbox
              v-for="(device, index) in deviceList"
              :label="device.label"
              :key="index"
              :checked="device.checked"
              @change="handleSelectCheckbox(index)"
            >
              <i :class="iconStyUser(device)" class="iconCss" v-if="choseDeviceList.length == 0"></i>
              <img src="./image/camera.png" style="width: 17px; vertical-align: middle" v-else />
              {{ device.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="bottomSure">
      <div class="sure centerItem">
        <div class="btnsure centerItem" @click="sureChoseCamera">确定</div>
      </div>
      <div class="chongzhi centerItem">
        <div class="btnclear centerItem" @click="clearDevice">重置</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceTree } from '../../../../utils/api'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  props: {
    choseDeviceList: {
      type: Array,
      default() {
        return []
      },
    },
    choseDeviceId: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      organizationTreeProps: {
        children: 'children',
        isLeaf: 'leaf',
        label: 'label',
        pageNum: 1,
        pageSize: 10,
      },
      treeEmptyText: '无摄像设备',
      treeLoading: true,
      defaultCheckedKeys: [],
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      filterText: '', //树过滤
      deviceList: [], //设备数组
      checkedDevice: [],
    }
  },
  created() {
    this.findTreeData()
  },
  mounted() {},
  methods: {
    //选中节点
    //共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、
    //节点本身是否被选中、节点的子树中是否有被选中的节点
    handleNodeClick(a, b, c) {
      console.log(a, b, c)
      //c为false表示是最后一级设备 a是该node节点 b表示当前节点被选中
      if (!c && b) {
        if (!a.children) {
          Object.assign(a, { checked: true })
          console.log(a, b, c)

          this.deviceList.push(a)

          //如果是选了再次进入设置默认key会再次触发这个方法，把deviceList数组过滤一下防止选重
          let hash = {}
          const data2 = this.deviceList.reduce((preVal, curVal) => {
            hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
            return preVal
          }, [])
          this.deviceList = data2
        }
      }
      if (!c && !b) {
        //取消选中并且是最后一级
        for (let i = 0; i < this.deviceList.length; i++) {
          if (this.deviceList[i].id == a.id) {
            this.deviceList.splice(i, 1)
          }
        }
      }
    },
    //清空已选设备
    clearDevice() {
      this.deviceList = [] //右边删除所有设备
      this.$refs.tree.setCheckedKeys([]) //左边清除选中状态
    },
    findTreeData() {
      this.deviceList = this.choseDeviceList
      getDeviceTree({ parentId: '0', type: 2, deviceType: 1 }).then((res) => {
        if (res.resultCode == 0) {
          this.treedata = res.nodeList

          // this.$nextTick(() => {
          //   this.$refs.tree.setCheckedKeys(checkKeys); //获取已经设置的资源后渲染
          //   let hash = {};
          //   const data2 = this.deviceList.reduce((preVal, curVal) => {
          //     hash[curVal.id]
          //       ? ""
          //       : (hash[curVal.id] = true && preVal.push(curVal));
          //     return preVal;
          //   }, []);
          // });
        }
      })
    },

    handleSelectCheckbox(index) {
      console.log(index, 'index')
      let hash = {}
      const data2 = this.deviceList.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
      this.deviceList = data2
      if (this.deviceList[index].checked) {
        this.$set(this.deviceList, index, {
          checked: false,
          id: this.deviceList[index].id,
          label: this.deviceList[index].label,
        })
      } else {
        this.$set(this.deviceList, index, {
          checked: true,
          id: this.deviceList[index].id,
          label: this.deviceList[index].label,
        })
      }
    },
    //确定选择摄像机
    sureChoseCamera() {
      this.$emit('choseCameraBtn', this.deviceList.length, this.deviceList)
    },

    handleCheckedDevice() {},
    //树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
  },
  computed: {
    iconStyUser(node) {
      return (node) => {
        if (node.type == 1 || node.payload.type == 2) {
          return 'iconfont icon-tree'
        } else if (node.type == 2 && node.payload.status == 1 && node.payload.deviceType == 1) {
          return 'icon-shexiangtou iconfont'
        } else if (node.type == 2 && node.payload.status != 1 && node.payload.deviceType == 1) {
          return 'icon-shexiangtou-close iconfont'
        } else if (node.type == 2 && node.payload.status == 1 && node.payload.deviceType == 3) {
          return 'icon-qiuji iconfont'
        } else if (node.type == 2 && node.payload.status != 1 && node.payload.deviceType == 3) {
          return 'icon-shexiangtou-close iconfont'
        } else if (
          (node.type == 2 && node.payload.status != 1 && node.payload.deviceType != 1) ||
          node.payload.deviceType != 3
        ) {
          return 'icon-qiangji iconfont'
        }
      }
    },
  },
}
</script>

<style lang="scss">
.custom-tree-node {
  font-size: 14px;
  .iconCss {
    margin-right: 5px;
  }
}
.choseCamera {
  position: fixed;
  top: 50%;
  margin-top: -326px;
  width: 1000px;
  height: 653px;
  background: rgba(20, 47, 72, 0.65);
  border-radius: 8px;
  right: 470px;
  padding: 20px 23px 18px 19px;
  background: url('./image/1000.png');
  background-size: 100% 100%;
  font-size: 14px;
  .title2 {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #1efffc;
    .closeImg {
      float: right;
    }
  }
  .content {
    display: flex;
    .contentleft,
    .contentRight {
      flex: 1;
      padding: 18px 26px 0 17px;
      width: 467px;
      height: 524px;
      background: rgba(32, 75, 116, 0.65);
      border-radius: 8px;
      margin-top: 19px;

      .titlebox {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
      }
      .choseDevice {
        margin-top: 31px;
        margin-left: 7px;
        height: 400px;
        overflow-y: auto;
        .el-checkbox__input {
          display: none;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: white;
        }
      }
      .choseDevice .el-checkbox-group {
        display: flex;
        flex-direction: column;
      }
      .choseDevice .el-checkbox {
        margin-bottom: 24px;
      }
    }
    .inputSelect {
      margin-top: 18px;
      position: relative;
      .search {
        position: absolute;
        top: 10px;
        right: 53px;
        z-index: 1000;
      }
      .line {
        position: absolute;
        right: 39px;
        top: 2px;
        width: 1px;
        height: 36px;
        background: #02253a;
      }
      .refresh {
        position: absolute;
        top: 11px;
        right: 11px;
        z-index: 1000;
      }
    }
    .rightclear {
      right: 40px;
      position: absolute;
      cursor: pointer;
      img {
        width: 18px;
        margin-right: 5px;
        font-size: 0;
        vertical-align: middle;
      }
      span {
        font-size: 14px;
        color: #00ccff;
      }
    }
    .centerRightImg {
      position: relative;
      width: 24px;
      img {
        position: absolute;
        top: 50%;
        margin-top: -50%;
        left: 4px;
      }
    }
    #orgTree {
      margin-top: 18px;
      overflow-x: auto;
      overflow-y: scroll;
      height: 370px;
      .tree-line {
        .el-tree-node {
          position: relative;
          padding-left: 16px; // 缩进量
        }
        .el-tree-node__children {
          padding-left: 16px; // 缩进量
        }

        // 竖线
        .el-tree-node::before {
          content: '';
          height: 100%;
          width: 1px;
          position: absolute;
          left: -3px;
          top: -26px;
          border-width: 1px;
          border-left: 1px dashed #ffffff;
        }
        // 当前层最后一个节点的竖线高度固定
        .el-tree-node:last-child::before {
          height: 38px; // 可以自己调节到合适数值
        }

        // 横线
        .el-tree-node::after {
          content: '';
          width: 24px;
          height: 20px;
          position: absolute;
          left: -3px;
          top: 12px;
          border-width: 1px;
          border-top: 1px dashed #ffffff;
        }

        // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
        & > .el-tree-node::after {
          border-top: none;
        }
        & > .el-tree-node::before {
          border-left: none;
        }

        // 展开关闭的icon
        .el-tree-node__expand-icon {
          font-size: 16px;
          // 叶子节点（无子节点）
          &.is-leaf {
            color: transparent;
            // display: none; // 也可以去掉
          }
        }
        //点击之后树节点内容不显示白色
        .el-tree-node:focus > .el-tree-node__content {
          background-color: transparent;
        }
      }
    }
    #orgTree .el-tree {
      background: transparent;
      color: white;
    }
    #orgTree .el-tree-node__content:hover {
      background-color: #00ccff !important;
    }
    #orgTree .el-tree-node__content:focus {
      background-color: #00ccff;
    }
  }
  .bottomSure {
    position: absolute;
    bottom: 18px;
    display: flex;
    align-items: center;
    left: 50%;
    margin-left: -180px;
    .sure,
    .chongzhi {
      flex: 1;
    }
    .sure {
      margin-right: 40px;
    }
    .btnsure {
      width: 160px;
      height: 40px;
      background: #00ccff;
      border-radius: 4px;
      color: #ffffff;
      cursor: pointer;
    }
    .btnclear {
      width: 160px;
      height: 40px;
      border: 1px solid #b5bdbf;
      border-radius: 4px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
.centerItem {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-camera {
  background-image: url('./image/camera.png');
}
</style>
