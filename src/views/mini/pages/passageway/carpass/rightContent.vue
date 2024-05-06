<template>
  <div class="rightContent">
    <!--搜索条件-->
    <div class="topContent">
      <div class="mytitleName">{{ $t('passageway.carEntrance') }}</div>
      <el-form v-model="searchInfo" label-width="100px">
        <el-form-item :label="$t('application.plateNum')">
          <el-input
            :placeholder="$t('passageway.enterName', { type: $t('application.plateNum') })"
            clearable
            v-model="searchInfo.plateNo"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('public.period')">
          <el-radio-group v-model="searchInfo.timeType" size="mini" @change="radioChange">
            <el-radio-button label="1">{{ $t('public.threeDay') }}</el-radio-button>
            <el-radio-button label="2">{{ $t('public.sevenDay') }}</el-radio-button>
            <el-radio-button label="3">{{ $t('public.nearlyMonth') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('public.startTime')"
            :end-placeholder="$t('public.endTime')"
            @change="changeDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getFaceComeInList">{{ $t('public.search') }}</el-button>
          <el-button @click="resetList">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--列表-->
    <div class="listItem">
      <div class="ul-item">
        <div class="photo1">{{ $t('passageway.photo') }}</div>
        <div class="plate photo">{{ $t('application.plateNum') }}</div>
        <div class="types">{{ $t('passageway.type') }}</div>
        <div class="deviceNameRi photo">{{ $t('passageway.location') }}</div>
        <div class="time">{{ $t('passageway.time') }}</div>
      </div>
      <div class="listContent" v-loading="loading">
        <div class="list" v-for="(item, index) in listContent" :key="index">
          <img v-viewer :src="item.snapPhoto" class="snapPhoto" />
          <div class="flx15">{{ item.plateNo }}</div>
          <div class="flxInOutType">
            {{ item.inOutType == 1 ? $t('passageway.in') : $t('passageway.out') }}
          </div>
          <div class="flx3">
            {{ item.deviceName }}
          </div>
          <div class="flx2">{{ item.eventTime }}</div>
        </div>
        <div class="noListData centerItem" v-if="listContent.length == 0">{{ $t('public.empty') }}</div>
      </div>
    </div>
    <!--查看历史-->
    <div class="lookhistory" @click="lookHostory">{{ $t('passageway.history') }} >></div>

    <div class="searchContent" v-if="showSearchContent">
      <i class="el-icon-close closebtn" @click="closeUserInfo"></i>
      <div class="userInfo">
        <img class="userimg" :src="carInfo.snapPhoto" />
        <div class="rightUserInfo">
          <div class="userName">姓名： {{ carInfo.personName ? carInfo.personName : '未知' }}</div>
          <div class="platNo">车牌号： {{ carInfo.plateNo }}</div>
        </div>
      </div>
      <div class="activityTrack">
        <div class="title">活动轨迹</div>

        <ul class="wrapper" v-if="trackList.length > 0">
          <div v-for="(item, index) in trackList" :key="index" style="margin-top: 10px">
            <li class="itemTrack">
              <div class="timeline-item__tail"></div>
              <img class="time-blue" src="../../../../../assets/passway/time-blue.png" />
              <div class="eventTime">{{ item.eventTime }}</div>
              <div class="numtrack">{{ item.trailNum }}个活动轨迹</div>
              <img class="play" src="../../../../../assets/passway/play.png" @click="playTrackList(item)" />
              <div class="playTrack" @click="playTrackList(item)">播放轨迹</div>
            </li>
            <div class="pointInfo">
              <div
                class="playTrackinfo"
                v-for="(item2, index2) in item.vehicleTrailList"
                :key="index2"
                @click="drawSingleImg(item2)"
              >
                <img src="../../../../../assets/passway/time-white.png" class="time-white" />
                <div class="time">{{ item2.eventTime }}</div>
                <div class="location">
                  {{ item2.inOutType == 1 ? '进' : '出' }}
                </div>
                <div class="installLocate">{{ item2.installLocate }}</div>
              </div>
            </div>
          </div>
        </ul>
        <div v-else style="color: white; margin-top: 10px">暂无活动轨迹</div>
      </div>
    </div>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64
import Dayjs from '../../../../../utils/Dayjs'
import { getDIYTime1 } from '@/utils/mutil'
import { getCarList, getVehicleTrail, playCarTrack, getLoginUserInfo } from '@/utils/api'
import { AllcamMap } from '@/utils/map/AllcamMap'
export default {
  data() {
    return {
      searchInfo: {
        timeType: '1',
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD 23:59:59'),
        inOutType: '',
        plateNo: '',
      },
      dateValue: [],
      loading: false,
      listContent: [], //人员进出列表数据
      showSearchContent: false, //单个人员详细信息
      carInfo: {},
      trackList: [], //轨迹列表
      noListData: false,
      interval: null,
      websock: null,
      timer: null,
    }
  },
  mounted() {
    this.setTimeout()
    this.radioChange()
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
  },
  methods: {
    handleWebSocketMessage(redata) {
      if (redata.type == 'vehicle_check') {
        let data = JSON.parse(Base64.decode(redata.content))
        //  this.listContent.unshift(data);
        console.log(data, '接收告警信息alarm')
        this.getFaceComeInList()
      }
    },
    resetList() {
      //   this.searchInfo.beginTime = "";
      //   this.searchInfo.endTime = "";
      //   this.dateValue = [];
      this.searchInfo.plateNo = ''
    },
    //播放
    playTrackList(item) {
      if (this.$store.state.carOperateId) {
        AllcamMap.map.removeTrack(this.$store.state.carOperateId)
      }
      console.log(item, this.carInfo)
      playCarTrack({
        startEventTime: item.eventDay + ' 00:00:00',
        endEventTime: item.eventDay + ' 23:59:59',
        plateNo: this.carInfo.plateNo,
      }).then((res) => {
        if (res.resultCode == 0) {
          AllcamMap.map.createVehicleTrack({
            id: res.opreateId,
            trackList: res.vehicleTrailList,
          })
          this.$store.commit('carOperateId', res.opreateId)
        }
      })
    },
    // 定时刷新
    setTimeout() {
      this.getFaceComeInList()
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.interval = setInterval(() => {
        this.getFaceComeInList()
      }, 10000)
    },
    getFaceComeInList() {
      this.loading = true
      getCarList(this.searchInfo).then((res) => {
        this.loading = false
        if (res.resultCode == 0) {
          if (res.recognitionList) {
            this.listContent = res.recognitionList
          } else {
            this.listContent = []
          }
        }
      })
      this.$emit('searchTimexx', this.searchInfo)
    },
    drawSingleImg(item) {
      console.log(item, 'item')
      if (item.longitude && item.latitude) {
        AllcamMap.map.plotMarker(
          {
            style: {
              image: `/static/images/icon/vehicle_track.png`,
              scale: 0.8,
            },
            arttr: {
              id: '',
            },
          },
          [item.longitude, item.latitude, 5]
        )
      }
    },

    // 改变开始时间
    changeDate(val) {
      this.searchInfo.timeType = ''
      this.date_format()
    },
    //查看更多历史
    lookHostory() {
      this.$emit('toAllPeopleComeInList', this.searchInfo)
    },
    //搜索单列表
    searchSiglePerson(item) {
      this.carInfo = item
      let data = {
        startEventTime: this.searchInfo.beginTime,
        endEventTime: this.searchInfo.endTime,
        plateNo: item.plateNo,
      }
      getVehicleTrail(data).then((res) => {
        if (res.resultCode == 0) {
          this.trackList = res.vehicleOneDayTrailList
          this.showSearchContent = true
        }
      })
    },
    //关闭单个人列表
    closeUserInfo() {
      this.showSearchContent = false
      if (this.$store.state.carOperateId) {
        AllcamMap.map.removeTrack(this.$store.state.carOperateId)
      }
    },

    /*时间处理 */
    radioChange() {
      // 如果是近三天
      if (this.searchInfo.timeType == '1') {
        // this.dateValue = getDIYTime1(4);
        this.dateValue = getDIYTime1(2)
      }
      // 如果是近七天
      else if (this.searchInfo.timeType == '2') {
        this.dateValue = getDIYTime1(3)
      }
      // 如果是近一个月
      else if (this.searchInfo.timeType == '3') {
        this.dateValue = getDIYTime1(5)
      }

      this.date_format()
    },
    // 日期格式处理
    p(s) {
      return s < 10 ? '0' + s : s
    },
    time(a) {
      const resDate = a.getFullYear() + '-' + this.p(a.getMonth() + 1) + '-' + this.p(a.getDate())
      const resTime = this.p(a.getHours()) + ':' + this.p(a.getMinutes()) + ':' + this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    date_format() {
      this.searchInfo.beginTime = this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'
      this.searchInfo.endTime = this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'
      this.getFaceComeInList()
    },
  },
}
</script>

<style lang="scss" scoped>
.rightContent {
  pointer-events: auto;
  width: 520px;
  height: calc(100% - 40px);
  position: absolute;
  right: 21px;
  font-size: 16px;
  margin-top: 16px;
  padding: 0 20px;
  box-sizing: border-box;
  background: url('../../../../../assets/buildingSeting/background.png') no-repeat;
  background-size: 100% 100%;
  .noListData {
    color: white;
    margin-top: 20px;
  }
  .centerItem {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /*搜索条件 */
  .topContent {
    padding: 20px 0;
    box-sizing: border-box;
    .mytitleName {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
      margin-bottom: 20px;
    }
  }

  /* 列表*/
  .listItem {
    margin-top: 0;
    width: 100%;
    height: calc(100% - 330px);
    padding: 10px;
    box-sizing: border-box;
    .ul-item {
      width: 100%;
      height: 36px;
      line-height: 36px;
      background: rgba(0, 204, 255, 0.2);
      display: flex;
      padding: 0 10px 0 10px;
      box-sizing: border-box;
      margin: 0 auto;
      .photo {
        flex: 1;
        color: white;
        text-align: center;
      }
      .types {
        flex: 1;
        color: white;
        text-align: center;
      }
      .photo1 {
        flex: 0.8;
        color: white;
        text-align: center;
      }
      .time {
        color: white;
        text-align: center;
        flex: 2;
      }
      .deviceNameRi {
        line-height: 36px;
      }
      .plate {
        white-space: nowrap;
        margin-left: 7px;
      }
    }
    .listContent {
      height: calc(100% - 36px);
      overflow-y: scroll;
      .list {
        &:hover {
          background: rgba(32, 75, 116, 0.65);
        }
        display: flex;
        padding: 10px 0 10px 20px;
        box-sizing: border-box;
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        .snapPhoto {
          width: 60px;
          height: 50px;
        }
        .flxInOutType {
          flex: 1;
          color: white;
          text-align: center;
          line-height: 50px;
        }
        .flx15 {
          margin-left: 10px;
          width: 60px;
          color: white;
          text-align: center;
          line-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .flx15:hover {
          overflow: visible;
        }

        .flx2 {
          flex: 2;
          color: white;
          text-align: center;
          line-height: 50px;
        }
        .flx3 {
          width: 80px;
          color: white;
          text-align: center;
          line-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .flx3:hover {
          overflow: visible;
        }
      }
    }
  }
  .lookhistory {
    text-align: right;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1efffc;
    cursor: pointer;
    margin-right: 21px;
  }
  /*单个人员搜索条件 */
  .searchContent {
    width: 400px;
    padding: 30px;
    height: 90%;
    background: rgba(20, 47, 72, 0.6);
    border-radius: 10px;
    position: absolute;
    right: 473px;
    top: 5%;
    .closebtn {
      font-size: 18px;
      color: white;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .userInfo {
      display: flex;
      align-items: center;
      .userimg {
        width: 100px;
        height: 100px;
      }
      .rightUserInfo {
        margin-left: 19px;
        display: flex;
        flex-direction: column;

        .userName {
          color: white;
          font-size: 14px;
        }
        .platNo {
          color: white;
          font-size: 14px;
          margin-top: 12px;
        }
      }
    }
    .activityTrack {
      .title {
        color: #1efffc;
        font-size: 14px;
        margin-top: 31px;
      }
      .wrapper {
        margin-top: 27px;
        list-style: none;
        position: relative;

        .itemTrack {
          display: flex;
          color: white;
          .timeline-item__tail {
            position: absolute;
            left: 7px;
            height: 95%;
            border-left: 2px dashed #1efffc;
            top: 17px;
          }
          .time-blue {
            width: 16px;
            height: 16px;
          }
          .eventTime {
            margin-left: 10px;
          }
          .numtrack {
            margin-left: 11px;
          }
          .play {
            width: 22px;
            height: 16px;
            cursor: pointer;
            margin-left: 38px;
          }
          .playTrack {
            color: #ffffff;
            margin-left: 10px;
            font-size: 12px;
          }
        }
        .pointInfo {
          display: flex;
          flex-direction: column;
          margin-left: 28px;
          .playTrackinfo {
            display: flex;
            color: white;
            margin-top: 11px;
            .time {
              margin-left: 5px;
            }
            .time-white {
              width: 16px;
              height: 16px;
            }
            .location {
              margin-left: 10px;
              margin-right: 5px;
              white-space: nowrap;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
