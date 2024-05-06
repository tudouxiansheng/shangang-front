<template>
  <div class="resultExpansion componentPos1">
    <div class="title2">
      <span> {{ $t('application.result') }}</span>
      <img class="closeImg2" src="../images/close.png" alt="" @click="closewrapper" />
    </div>
    <!-- 工具栏 -->
    <div class="tools">
      <div class="checkTool">
        <el-checkbox v-model="selectAll" @change="isCheckedAll">{{ $t('public.selectAll') }}</el-checkbox>
      </div>
      <div class="otherTools">
        <div @click="handleTrack()" class="track-btn">
          <img src="../images/track.png" alt="" /><span>{{ $t('application.analysis') }}</span>
        </div>
      </div>
    </div>
    <!-- table -->
    <div class="result">
      <CardList
        :data="data.slice((listQuery.pageNum - 1) * listQuery.pageSize, listQuery.pageNum * listQuery.pageSize)"
        :pager="true"
        :total="total"
        :columns="6"
        :page-no="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[30, 60, 100]"
        @page-change="handlePageNumChange"
        @size-change="handlePageSizeChange"
      >
        <template slot-scope="{ item, index }">
          <div class="item-wrapper">
            <div class="check">
              <div
                class="checkbox"
                :class="checkedIds.indexOf(item.onlyCode) !== -1 ? 'is-checked' : ''"
                @click.stop="SingleCheck(item)"
              ></div>
            </div>
            <div class="img-wrapper">
              <img :src="item.detectUrl" alt="" @click="handleDetail(item, index)" />
            </div>
            <div class="captureInfo">
              <div class="address-confidence">
                <div class="address">{{ item.cameraName }}</div>
                <div class="confidence" v-if="item.confidence">{{ (item.confidence * 1).toFixed(2) }}%</div>
              </div>
              <div>{{ item.captureTime }}</div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <!-- <searchDetail
      :searchType="searchType"
      @close="handleCloseDetailDialog"
      class="detail-position"
      :detail="detailRow"
      v-if="showDetailDialog"
    ></searchDetail> -->
  </div>
</template>
<script>
import CardList from '../../../../../components/CardList'
// import searchDetail from './search-detail'

export default {
  props: {
    searchType: {
      type: Number,
      default: 1,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  components: {
    CardList,
    // searchDetail,
  },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 30,
      },
      selectAll: false,
      // showDetailDialog: false,
      // detailRow: {},
      faceTracks: [],
      checkedIds: [],
    }
  },
  computed: {
    total() {
      return this.data.length
    },
  },
  methods: {
    // 全选按钮发生改变时
    isCheckedAll() {
      if (this.selectAll) {
        this.checkedIds = this.data.map((item) => item.onlyCode)
      } else {
        this.checkedIds = []
      }
    },
    SingleCheck(item) {
      // console.log(JSON.stringify(this.data))
      // console.log(item)
      let index = this.checkedIds.indexOf(item.onlyCode)
      if (index == -1) {
        this.checkedIds.push(item.onlyCode)
      } else {
        this.checkedIds.splice(index, 1)
      }
    },

    // 生成轨迹
    handleTrack() {
      this.faceTracks = this.data.filter((item) => this.checkedIds.indexOf(item.onlyCode) !== -1)
      console.log(this.faceTracks)
      let type = 0 //人员
      if (this.faceTracks && this.faceTracks.length) {
        if (this.faceTracks[0].plateNumber) {
          type = 1
        } else {
          type = 0
        }
      }
      this.checkedIds = []
      this.$emit('track', this.faceTracks, type)
    },

    handlePageNumChange(val) {
      // let queryPage = {
      //   pageNum: val,
      //   pageSize: this.listQuery.pageSize,
      // }
      this.listQuery.pageNum = val
    },
    handlePageSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
    },
    // handleCloseDetailDialog() {
    // this.detailRow = {}
    // this.showDetailDialog = false
    // },
    handleDetail(item, index) {
      this.$emit('showDetail', item)
      // this.detailRow = { ...item,index }
      // this.showDetailDialog = true
    },
    closewrapper() {
      this.selectAll = false
      if (this.polyline) {
        this.polyline.remove(this.map)
      }
      if (this.track) {
        this.track.remove(this.map)
        this.track.pauseMove()
      }
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.detail-position {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.item-wrapper {
  position: relative;
  color: #fff;
  background-color: #204b74;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  .check {
    position: absolute;
    right: 14px;
    top: 15px;
    .checkbox {
      width: 22px;
      height: 22px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      border-radius: 4px;
      &.is-checked {
        background-color: #409eff;
        border-color: #409eff;
        &::after {
          transform: rotate(45deg) scaleY(1);
        }
      }
      &::after {
        box-sizing: content-box;
        content: '';
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 10px;
        left: 7px;
        position: absolute;
        top: 3px;
        transform: rotate(45deg) scaleY(0);
        width: 5px;
        transition: transform 0.15s ease-in 0.05s;
        transform-origin: center;
      }
    }
  }
  .img-wrapper {
    width: 100%;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .captureInfo {
    margin-top: 15px;
    .address-confidence {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .confidence {
        white-space: nowrap;
        color: #00ccff;
      }
      .address {
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
        padding-right: 15px;
      }
    }
  }
}
.resultExpansion {
  font-size: 14px;
  pointer-events: auto;
  position: fixed;
  width: 1400px;
  height: 734px;
  background: rgba(20, 47, 72, 0.9);
  border-radius: 8px;
  padding: 20px 27px 8px 20px;
  &.componentPos1 {
    right: 530px;
    top: 50%;
    transform: translateY(-50%);
  }
  .title2 {
    color: #1efffc;
    .closeImg2 {
      float: right !important;
      cursor: pointer;
    }
  }
  .tools {
    position: relative;
    margin-top: 20px;
    margin-right: 20px;
    .otherTools {
      position: absolute;
      right: 0;
      top: 0;
      color: #00ccff;
      div {
        display: inline-block;
        margin-left: 30px;
        img {
          margin-right: 5px;
        }
        &.track-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .result {
    margin-top: 7px;
    height: calc(100% - 60px);
    ul {
      li {
        display: inline-block;
        width: 230px;
        height: 275px;
        background-color: rgba(32, 75, 116, 0.65);
        margin-right: 20px;
        margin-top: 20px;
        padding: 10px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        .captureInfo {
          width: 100%;
          text-align: center;
          margin-top: 5px;
          color: #f1fefe;
          img {
            width: 180px;
            height: 180px;
          }
        }
      }
    }
  }
  .fenye {
    position: absolute;
    bottom: 8px;
    right: 27px;
    .el-pager li {
      margin-right: 27px;
    }
    .el-pager {
      margin-left: 27px;
    }
    .el-dialog,
    .el-pager li {
      background: transparent;
      color: #aaaaaa;
    }
  }
  .el-pagination__jump {
    color: #e6e6e6;
  }
  .el-pagination__total {
    color: #aaaaaa;
  }
  .el-pager li {
    border: 1px solid #ffffff;
    border-radius: 4px;
  }
  .el-pager li.btn-quicknext,
  .el-pager li.btn-quickprev {
    color: #aaaaaa;
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
