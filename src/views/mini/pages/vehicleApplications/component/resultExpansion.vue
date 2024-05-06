<template>
  <div class="resultExpansion">
    <div class="title">
      <span>检索结果</span>
      <img class="closeImg" src="../../../../../assets/vehicleApp/close.png" alt="" @click="closewrapper" />
    </div>
    <div class="tools" v-if="vehicleSearchList.length > 0">
      <div class="checkTool">
        <el-checkbox v-model="checkedAll" @change="isCheckedAll">全选</el-checkbox>
      </div>
      <div class="otherTools">
        <!-- <div>
          <img src="../../../../../assets/faceSearch/export.png" alt="" /><span
            >导出</span
          >
        </div> -->
        <div class="track-btn" @click="trackFenxi">
          <img src="../../../../../assets/faceSearch/track.png" alt="" /><span>轨迹分析</span>
        </div>
        <!--        <div @click="goBackSearchResult">-->
        <!--          <img src="../../../../../assets/faceSearch/expansion.png" alt="" />-->
        <!--        </div>-->
      </div>
    </div>

    <div class="result">
      <CardList :data="vehicleSearchList" :columns="6">
        <template slot-scope="{ item }">
          <div class="item-wrapper">
            <div class="check">
              <el-checkbox v-model="item.checked" @change="singleCheckMethod(item)"></el-checkbox>
            </div>
            <div class="img-wrapper" @click.stop="toVehicleDetail(item)">
              <img :src="item.picFileUrl" alt="" />
            </div>
            <div class="captureInfo">
              <div>{{ item.cameraName }}</div>
              <div>{{ item.imageTimestamp }}</div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="fenye.pageSize"
      class="fenye"
      layout="total,prev, pager, next, jumper"
      :total="fenye.totalNum">
    </el-pagination> -->
    <div v-if="vehicleSearchList.length == 0" style="color: white">暂无匹配结果</div>
  </div>
</template>
<script>
import { AllcamMap } from '../../../../../utils/map/AllcamMap'
import CardList from '../../../../../components/CardList'
import { vehicleTrack } from '@/utils/api'
export default {
  components: {
    CardList,
  },
  props: {
    vehicleSearchList: {
      type: Array,
      default() {
        return []
      },
    },
    // fenye: {
    //   type: Object,
    // },
  },
  data() {
    return {
      checkedAll: false,
      vehicleTrackInfos: [],
      polyline2: [],
      polyline: '',
      marker: [],
      track: '',
      // fenye: {
      //   pageNum: this.fenye.pageNum,
      //   pageSize: this.fenye.pageSize,
      //   totalNum: this.fenye.totalNum,
      // },
    }
  },
  mounted() {},
  methods: {
    // 返回
    goBackSearchResult() {
      this.$root.$emit('goBackSearchResultFromExp')
    },
    closewrapper() {
      this.$root.$emit('closeExpansion')
    },
    trackFenxi() {
      // let searchInfo2 = sessionStorage.getItem('searchInfo3')
      // this.searchInfo2 = JSON.parse(searchInfo2)
      // let data = {
      //   captureUrl: this.faceTracks.captureUrl,
      //   beginTime: this.searchInfo2.beginTime,
      //   endTime: this.searchInfo2.endTime,
      // }
      vehicleTrack({}).then((res) => {
        if (res.resultCode == 0 && res.vehicleTrackInfos && res.vehicleTrackInfos.length) {
          console.log(res)
          this.$root.$emit('closeExpansion')
          if (!JSON.parse(localStorage.getItem('showimg'))) {
            //没有地图或者未显示地图就显示时间线轨迹
            console.log('res', res.vehicleTrackInfos)
            this.vehicleTrackInfos = res.vehicleTrackInfos
            this.$emit('open', this.vehicleTrackInfos)
          } else {
            if (sessionStorage.getItem('mapState') == 0) {
              //三维
              if (this.$store.state.carEventId) {
                AllcamMap.map.removeTrack(this.$store.state.carEventId)
              }
              this.$store.commit('carEventId', res.eventId)
              AllcamMap.map.createVehicleTrack(
                {
                  id: res.eventId,
                  trackList: res.vehicleTrackInfos,
                },
                1
              )
              // AllcamMap.map.flyToIcon(`${res.eventId}track`)
            } else {
              //二维
              this.polyline2 = []
              if (this.track != '' && this.track != undefined) {
                this.polyline.remove(this.map)
                this.track.remove(this.map)
                this.track.pauseMove()
              }
              res.faceTrackInfos.map((item) => {
                this.marker.push(
                  BM.marker([item.latitude, item.longitude], {
                    icon: BM.icon({
                      iconUrl: require('@/assets/行人.png'),
                      iconSize: [60, 60],
                    }),
                  }).addTo(window.map)
                )
              })
              this.faceTrackInfos = res.faceTrackInfos
              this.polyline2 = this.objToArry(this.faceTrackInfos)

              if (this.polyline2) {
                this.polyline = BM.polyline(this.polyline2).addTo(window.map)
                window.map.fitBounds(this.polyline.getBounds())
                this.track = BM.marker([30, 104], {
                  icon: BM.icon({
                    iconUrl: require('@/assets/行人.png'),
                    iconAnchor: [25, 15],
                  }),
                }).addTo(window.map)
                sessionStorage.setItem('track', this.track)
                this.toSearchDetai()
              }
            }
          }
        }
      })
      console.log('轨迹')
    },
    // 全选与全不选
    isCheckedAll() {
      if (this.checkedAll) {
        this.vehicleSearchList.forEach((item) => {
          item.checked = true
        })
      } else {
        this.vehicleSearchList.forEach((item) => {
          item.checked = false
        })
      }
    },
    singleCheckMethod(index) {
      // if (!this.vehicleSearchList[index].checked) {
      //   this.$set(this.vehicleSearchList, index, { checked: true })
      // } else {
      //   this.$set(this.vehicleSearchList, index, { checked: false })
      // }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // this.$emit('pageNum',val)
    },
    //当前页改变会触发
    currentPage() {},
    toVehicleDetail(item) {
      console.log(item)
      this.$root.$emit('expansionToDetail', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.track-btn {
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
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
    right: 20px;
    top: 15px;
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
    font-size: 14px;
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
  width: 1280px;
  height: 734px;
  background: rgba(20, 47, 72, 0.65);
  border-radius: 8px;
  padding: 20px 27px 8px 20px;
  .title {
    color: #1efffc;
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
      }
    }
  }
  .result {
    margin-top: 7px;
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
.closeImg {
  float: right;
}
</style>
