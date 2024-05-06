<template>
  <div class="rightContent">
    <!--搜索条件-->
    <div class="topContent">
      <div class="mytitleName">{{ $t('passageway.entrance') }}</div>
      <el-form v-model="searchInfo" label-width="100px">
        <el-form-item :label="$t('passageway.name')">
          <el-input
            :placeholder="$t('passageway.enterName', { type: $t('passageway.name') })"
            clearable
            v-model="searchInfo.personName"
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
            style="width: 100%"
            type="daterange"
            range-separator="——"
            :start-placeholder="$t('public.startTime')"
            :end-placeholder="$t('public.endTime')"
            @change="changeDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getFaceComeInList">{{ $t('public.search') }}</el-button>
          <el-button class="reset" @click="resetCondition">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--列表-->
    <div class="listItem">
      <div class="ul-item">
        <div class="photoMytitle">{{ $t('passageway.photo') }}</div>
        <div class="name photoMytitle">{{ $t('passageway.name') }}</div>
        <div class="photoMytitle1">{{ $t('passageway.type') }}</div>
        <!--        <div class="temperature photoMytitle2">体温</div>-->
        <div class="deviceName photoMytitle">{{ $t('passageway.location') }}</div>
        <div class="photoMytitle time">{{ $t('passageway.time') }}</div>
      </div>
      <div class="listContent">
        <div class="list" v-for="(item, index) in listContent" :key="index">
          <img :src="item.snapPhoto" class="snapPhoto" />
          <div class="flxName">{{ item.personName }}</div>
          <div class="flx1">{{ item.inOutType == 1 ? $t('passageway.in') : $t('passageway.out') }}</div>
          <!--          <div class="flx1">-->
          <!--            {{ item.temperature ? item.temperature : '无' }}-->
          <!--          </div>-->
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
        <img class="userimg" :src="userInfo.userAvatarUrl" />
        <div class="rightUserInfo">
          <div class="userName">姓名： {{ userInfo.userName }}</div>
          <div class="sex">性别：{{ userInfo.sex == 1 ? '男' : '女' }}</div>
        </div>
      </div>
      <div class="activityTrack">
        <div class="title">活动轨迹</div>

        <ul class="wrapper" v-if="trackList.length > 0">
          <div v-for="(item, index) in trackList" :key="index" style="margin-top: 10px">
            <li class="itemTrack">
              <!-- <div class="timeline-item__tail"></div> -->
              <img class="time-blue" src="../../../../../assets/passway/time-blue.png" />
              <div class="eventTime">{{ item.eventTime }}</div>
              <div class="numtrack">{{ item.personTrajectoryInfoList.length }}个活动轨迹</div>
              <img
                class="play"
                src="../../../../../assets/passway/play.png"
                @click="playTrackList(item.personTrajectoryInfoList)"
              />
              <div class="playTrack" @click="playTrackList(item.personTrajectoryInfoList)">播放轨迹</div>
            </li>
            <div class="pointInfo">
              <div
                class="playTrackinfo"
                v-for="(item2, index2) in item.personTrajectoryInfoList"
                :key="index2"
                @click="drawSingleImg(item2)"
              >
                <img src="../../../../../assets/passway/time-white.png" class="time-white" />
                <div class="time">{{ item2.eventTime }}</div>
                <div class="location">{{ item2.location }}</div>
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
import { getDIYTime1, formatDateTime } from '@/utils/mutil'
import { getPeopleRecognize, getLoginUserInfo, getUserInfo, trajectoryLIst, playFaceTrack } from '@/utils/api'
import { AllcamMap } from '@/utils/map/AllcamMap'
export default {
  data() {
    return {
      searchInfo: {
        timeType: '1',
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        beginTime: formatDateTime(new Date()).substring(0, 10) + ' 00:00:00',
        endTime: formatDateTime(new Date()).substring(0, 10) + ' 23:59:59',
        personName: '',
      },
      dateValue: [],
      listContent: [], //人员进出列表数据
      showSearchContent: false, //单个人员详细信息
      userInfo: {},
      trackList: [], //轨迹列表
      noListData: false, //是否有车辆数据
      timer: null,
    }
  },
  mounted() {
    this.setTimeout()
    this.radioChange()
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
  },
  methods: {
    handleWebSocketMessage(redata) {
      if (redata.type == 'person_check') {
        let data = JSON.parse(Base64.decode(redata.content))
        // this.listContent.unshift(data);
        // console.log(data, "接收告警信息alarm");
        this.getFaceComeInList()
      }
    },
    resetCondition() {
      this.searchInfo.beginTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.personName = ''
      this.dateValue = []
    },
    drawSingleImg(item) {
      console.log(item, 'item')
      if (item.longitude && item.latitude) {
        AllcamMap.map.plotMarker(
          {
            style: {
              image: `/static/images/icon/track.png`,
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

    //播放
    playTrackList(list) {
      let trackListInfo = []
      let trackList = []
      if (this.$store.state.faceOperateId) {
        AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
      }
      playFaceTrack({ trajectoryList: list }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res)
          if (res.trackList) {
            for (let i = 0; i < res.trackList.length; i++) {
              trackList.push([res.trackList[i].longitude, res.trackList[i].latitude, 5])
              trackListInfo.push({
                trackInfo: res.trackList[i],
                position: [res.trackList[i].longitude, res.trackList[i].latitude, 5],
              })
            }
            AllcamMap.map.showHistoryPersonTrack(res.operateId, trackList, trackListInfo)
            this.$store.commit('faceOperateId', res.operateId)
          }
        }
      })
    },
    // 定时刷新
    setTimeout() {
      this.getFaceComeInList()
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setTimeout()
      }, 10000)
    },
    getFaceComeInList() {
      getPeopleRecognize(this.searchInfo).then((res) => {
        if (res.resultCode == 0) {
          if (res.recognitionList) {
            this.listContent = res.recognitionList
          } else {
            this.noListData = []
          }
        }
      })
      this.$emit('searchTime', this.searchInfo)
    },

    // 改变开始时间
    changeDate(val) {
      this.searchInfo.timeType = ''
      this.date_format()
    },
    //查看更多历史
    lookHostory() {
      this.$emit('toAllPeopleComeInList')
    },
    //搜索单个人列表
    searchSiglePerson(item) {
      console.log(item)

      getUserInfo({ userId: item.personId }).then((res) => {
        if (res.resultCode == 0) {
          this.userInfo = res.userInfo
          this.showSearchContent = true
        }
      })
      let data = {
        startTime: this.searchInfo.beginTime,
        endTime: this.searchInfo.endTime,
        personId: item.personId,
        personPhotoUrl: item.backPhoto,
      }
      trajectoryLIst(data).then((res) => {
        if (res.resultCode == 0) {
          console.log(res)
          this.trackList = res.trajectoryList
        }
      })
    },
    //关闭单个人列表
    closeUserInfo() {
      this.showSearchContent = false
      if (this.$store.state.faceOperateId) {
        AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
      }
      AllcamMap.map.clearAllPlots()
    },

    /*时间处理 */
    radioChange() {
      // 如果是近三天
      if (this.searchInfo.timeType == '1') {
        this.dateValue = getDIYTime1(4)
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
    time(a) {
      const resDate = a.getFullYear() + '-' + this.p(a.getMonth() + 1) + '-' + this.p(a.getDate())
      const resTime = this.p(a.getHours()) + ':' + this.p(a.getMinutes()) + ':' + this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    date_format() {
      this.searchInfo.beginTime = this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'
      this.searchInfo.endTime = this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'
      console.log(this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00')
    },
    // 日期格式处理
    p(s) {
      return s < 10 ? '0' + s : s
    },
  },
}
</script>

<style lang="scss">
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
    margin-top: 20px;
    overflow-y: scroll;
    height: calc(100% - 360px);
    .ul-item {
      width: 100%;
      height: 36px;
      line-height: 36px;
      background: rgba(0, 204, 255, 0.2);
      display: flex;
      padding: 0 22px 0 37px;
      margin: 0 auto;
      .photoMytitle {
        flex: 0.8;
        color: white;
        text-align: center;
      }
      .photoMytitle1 {
        padding-left: 5px;
        flex: 0.7;
        color: white;
      }
      .photoMytitle2 {
        flex: 0.8;
        color: white;
      }
      .time {
        flex: 2;
      }
      .deviceName {
        line-height: 36px;
      }
    }
    .listContent {
      max-height: 566px;
      .list {
        &:hover {
          background: rgba(32, 75, 116, 0.65);
        }
        display: flex;
        padding: 10px 22px 10px 37px;
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        .snapPhoto {
          width: 60px;
          height: 50px;
        }
        .flxName {
          margin-left: 3px;
          width: 42px;
          color: white;
          text-align: center;
          line-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .flxName:hover {
          overflow: visible;
        }
        .flx1 {
          flex: 0.7 !important;
          // width: 40px;
          color: white;
          text-align: center;
          line-height: 50px;
        }
        .flx2 {
          color: white;
          text-align: center;
          line-height: 50px;
          flex: 2;
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
      cursor: pointer;
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
        .sex {
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
        max-height: 600px;
        overflow-y: scroll;

        .itemTrack {
          display: flex;
          color: white;
          pointer-events: auto;
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
            margin-left: 20px;
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
            cursor: pointer;
            .time {
              margin-left: 5px;
            }
            .time-white {
              width: 16px;
              height: 16px;
            }
            .location {
              margin-left: 10px;
              margin-right: 10px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
