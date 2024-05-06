<template>
  <div class="track-detail">
    <div class="track-title">
      <span>{{ $t('application.trackDetail') }}</span>
      <span @click="handleClose">
        <i class="el-icon-close"></i>
      </span>
    </div>
    <div class="track-content">
      <div class="address">
        <span>{{ $t('application.address') }}：</span>
        <span>{{ cameraName }}</span>
      </div>
      <template v-if="data.length">
        <div class="item-wrapper" ref="listWrapper">
          <div
            class="item"
            v-for="item in data.slice(
              (listQuery.pageNum - 1) * listQuery.pageSize,
              listQuery.pageNum * listQuery.pageSize
            )"
            :key="item.onlyCode"
          >
            <div class="item-content" @click="handleDetail(item)">
              <div class="img-wrapper">
                <img :src="item.detectUrl" alt="" />
              </div>
              <div class="content">
                <div class="confidence" v-if="item.lpn">{{ $t('application.plateNum') }}：{{ item.lpn }}</div>
                <div class="confidence" v-if="item.confidence">
                  {{ $t('public.similarity') }}：{{ (item.confidence * 1).toFixed(2) }}%
                </div>
                <div class="captureTime">{{ item.captureTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ak-pager">
          <el-pagination
            :page-size="listQuery.pageSize"
            :current-page="listQuery.pageNum"
            @size-change="handleSizeChange"
            @current-change="handlePageNumChange"
            class="ak-card-list-pager"
            background
            layout="total,prev, pager, next"
            :total="data.length"
          >
          </el-pagination>
        </div>
      </template>
      <div v-else class="empty-wrapper">
        <div class="empty">{{ $t('public.empty') }}</div>
      </div>
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
import searchDetail from '../../components/search-detail'
import { getGuardHitInfo } from '../../../../../../utils/api'
export default {
  name: 'track-detail',
  props: {
    cameraName: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  watch: {
    cameraName: {
      handler() {
        this.listQuery.pageNum = 1
      },
      deep: true,
    },
  },
  components: {
    searchDetail,
  },
  data() {
    return {
      searchType: 3,
      showDetailDialog: false,
      detailRow: {},
      listQuery: {
        pageNum: 1,
        pageSize: 6,
      },
    }
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleCloseDetailDialog() {
      this.detailRow = {}
      this.showDetailDialog = false
    },
    handleDetail(item) {
      this.$emit('showDetail',item)
      // console.log(item)
      // this.detailRow = { ...item }
      // this.showDetailDialog = true
      // getGuardHitInfo({ alarmId: item.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //
      //   }
      // })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.$refs.listWrapper.scrollTop = 0
    },
    handlePageNumChange(val) {
      this.listQuery.pageNum = val
      this.$refs.listWrapper.scrollTop = 0
    },
  },
}
</script>

<style scoped lang="scss">
.empty-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #fff;
  }
}
.detail-position {
  right: 530px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
}
.ak-pager {
  margin-top: 20px;
  text-align: right;
  ::v-deep.el-pagination {
    position: relative;
    .el-pagination__total {
      color: #fff;
    }

    &.is-background {
      .btn-prev,
      .btn-next,
      .btn-first,
      .btn-last {
        background-color: transparent;
        color: #e6e6e6;
        border: 1px solid #aaa;
        padding: 0 8px;
        box-sizing: border-box;
      }
      ul.el-pager li.number,
      ul.el-pager li.el-icon-more {
        background-color: transparent;
        color: #e6e6e6;
        border: 1px solid #aaa;
        &.active {
          color: #00ccff;
          border: 1px solid #00ccff;
        }
      }
    }

    .slot-default {
      display: inline-block;
      width: 60px;
    }

    .btn-first {
      position: absolute;
      top: 50%;
      left: 0;
      border-radius: 2px;
      margin: -14px 5px 0;
      color: #606266;

      &.disabled {
        color: #c0c4cc;
      }

      &.active {
        background-color: #8398ca;
        color: #fff;
      }
    }

    .btn-last {
      border-radius: 2px;
      margin: 0 5px;
      color: #606266;

      &.disabled {
        color: #c0c4cc;
      }

      &.active {
        background-color: #8398ca;
        color: #fff;
      }
    }
  }
}

.track-detail {
  color: #fff;
  width: 500px;
  height: calc(100% - 34px);
  background: url('../../images/645.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  z-index: 9998;
  top: 10px;
  right: 40px;
  padding: 20px;
  box-sizing: border-box;
  font-size: 14px;
  pointer-events: auto;
  .track-title {
    display: flex;
    justify-content: space-between;
  }
  .track-content {
    padding: 20px 0;
    box-sizing: border-box;
    height: 100%;
    .address {
      margin-bottom: 10px;
    }
    .item-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
      .item {
        width: 50%;
        padding: 10px 20px;
        box-sizing: border-box;
        .item-content {
          width: 100%;
          display: flex;
          font-size: 12px;
          align-content: flex-start;
          justify-content: center;
          flex-direction: column;
          margin-bottom: 10px;
          padding: 10px 15px;
          box-sizing: border-box;
          background-color: #204b74;
          border-radius: 4px;
          .confidence {
            margin-bottom: 5px;
          }
          .img-wrapper {
            width: 160px;
            height: 150px;
            margin-bottom: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
