<template>
  <div class="searchResult">
    <div class="titleTop">
      <span class="title">检索结果</span>
      <img class="closeImg" src="../../../../../assets/vehicleApp/close.png" alt="" @click="close" />
    </div>
    <div class="tools">
      <div class="checkTool">
        <el-checkbox v-model="checkedAll" @change="isCheckedAll">全选</el-checkbox>
      </div>
      <div class="otherTools">
        <div @click="personTrack()">
          <img src="../../../../../assets/faceSearch/track.png" alt="" style="margin-right: 5px" />
          <span>生成轨迹</span>
        </div>
        <img @click="toExpansion" src="../../../../../assets/faceSearch/expansion.png" alt="" />
      </div>
    </div>
    <div class="dynamicTail">
      <ul>
        <li v-for="item in vehicleSearchList" :key="item.id">
          <div class="captureImg">
            <img :src="item.picFileUrl" alt="" />
          </div>
          <div class="captureInfo">
            <div class="detail">
              <p class="similar">相似度：25%</p>
              <p>设备名称: {{ item.cameraName }}</p>
              <p>发生时间: {{ item.imageTimestamp }}</p>
              <p>发生位置: {{ item.snapLocation }}</p>
            </div>
            <div class="captureTool">
              <div class="checkedTool">
                <el-checkbox v-model="item.checked" @change="isChecked"></el-checkbox>
              </div>
              <div @click="toSearchDetail(item)" style="cursor: pointer">
                <span class="toDetail">详情</span><img src="../../../../../assets/faceSearch/toDetail.png" alt="" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { AllcamMap } from '../../../../../utils/map/AllcamMap'
export default {
  props: ['vehicleSearchList'],
  data() {
    return {
      // 是否全选
      checkedAll: '',
      // 检索结果
      result: [
        {
          imgUrl: '',
          confidence: 0.0069,
          deviceName: 'camera-1',
          eventTime: '2021-03-01 13:02:56',
        },
      ],
    }
  },
  mounted() {},
  methods: {
    // 关闭对话框
    close() {
      this.$emit('closeSearchResult')
    },
    // 全选按钮发生改变时
    isCheckedAll() {
      if (this.checkedAll) {
        this.result.forEach((item) => {
          item.checked = true
        })
      } else {
        this.result.forEach((item) => {
          item.checked = false
        })
      }
    },
    // 判断是否选中全选按钮
    isChecked() {
      let flag = true
      this.result.forEach((item) => {
        if (!item.checked) {
          flag = false
          return
        }
      })
      this.checkedAll = flag
    },
    // 生成轨迹
    personTrack() {
      //判断地图
      if (AllcamMap.map) {
        AllcamMap.map.createVehicleTrack({
          id: '222',
          trackList: [
            {
              eventId: '11',
              longitude: 120.76233393690597,
              latitude: 31.303575297058682,
            },
            {
              eventId: '22',
              longitude: 120.76273159487533,
              latitude: 31.30360026924194,
            },
            {
              eventId: '33',
              longitude: 120.76278333636992,
              latitude: 31.303269322549603,
            },
            {
              eventId: '44',
              longitude: 120.76280596635321,
              latitude: 31.30296597686211,
            },
            {
              eventId: '55',
              longitude: 120.76289846529161,
              latitude: 31.302281422887656,
            },
          ],
        })
      } else {
        this.$message.warning('弹框轨迹')
      }
    },
    handleSelectionChange() {},
    // 跳转至检索详情
    toSearchDetail(item) {
      this.$root.$emit('isSearchDetailVisible', item)
    },
    // 跳转至展开
    toExpansion() {
      this.$root.$emit('isResultExpansionVisiable')
    },
  },
}
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: #f1fefe;
}
.searchResult {
  ::-webkit-scrollbar-track {
    background-color: #1e2c45 !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #2e4c90 !important;
    border-radius: 3px;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    // background-color: #2e4c90 !important;
    background-color: #00ccff !important;
    border-radius: 3px;
  }
  pointer-events: auto;
  position: fixed;
  width: 480px;
  background: rgba(20, 47, 72, 0.65);
  border-radius: 8px;
  padding: 15px;
  .titleTop {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .title {
      color: #1efffc;
    }
    .closeImg {
      cursor: pointer;
      width: 10px;
      height: 10px;
    }
  }
  .tools {
    position: relative;
    margin-top: 30px;

    .checkTool {
      position: absolute;
      left: 0;
    }
    .otherTools {
      position: absolute;
      right: 0;
      div {
        display: inline-block;
      }
      img {
        margin-left: 30px;
        vertical-align: middle;
      }
    }
  }
  .dynamicTail {
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-top: 30px;
    ul {
      height: 78vh;
      overflow-y: auto;
      overflow-x: hidden;
      li {
        display: flex;
        align-items: center;
        padding: 15px;
        width: 450px;
        height: 145px;
        background-color: rgba(32, 75, 116, 0.65);
        margin-bottom: 25px;
        .captureImg {
          display: inline-block;
          width: 100px;
          height: 100px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            vertical-align: top;
          }
        }
        .captureInfo {
          display: flex;
          justify-content: space-between;
          width: 305px;
          height: 100px;
          .detail {
            display: inline-block;
            p {
              line-height: 25px;
            }
            .similar {
              color: #1efffc;
            }
          }
          .captureTool {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: right;
            .toDetail {
              margin-right: 5px;
              color: #1efffc;
            }
          }
        }
      }
    }
  }
}
.el-checkbox__inner {
  width: 20px;
  height: 20px;
}
.el-checkbox__inner::after {
  height: 10px;
  left: 8px;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #edf6f7;
}
</style>
