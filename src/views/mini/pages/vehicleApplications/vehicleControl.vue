<template>
  <div class="faceControl">
    <div class="pannel">
      <div class="title">车辆布控</div>
      <el-form label-suffix="：" :model="searchInfo">
        <el-form-item label="布控名称">
          <el-input clearable placeholder="请输入布控名称搜索" v-model="searchInfo.guardName">
            <i class="el-icon-search el-input__icon" slot="suffix"> </i
          ></el-input>
        </el-form-item>
        <el-form-item label="布控库">
          <el-select v-model="searchInfo.repositoryId" clearable filterable placeholder="请选择布控库" class="select">
            <el-option
              v-for="item in repositoryList"
              :key="item.repositoryName"
              :label="item.repositoryName"
              :value="item.repositoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段">
          <div class="date-time-wrapper">
            <el-radio-group v-model="timeType" size="small" @change="radioChange">
              <el-radio-button label="1">近三天</el-radio-button>
              <el-radio-button label="2">近七天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
              <el-radio-button label="4">自定义</el-radio-button>
            </el-radio-group>
            <div class="time-quick">自定义时间范围最大为30天</div>
          </div>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            v-model="searchInfo.startTime"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            v-model="searchInfo.endTime"
            type="datetime"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="布控等级">
          <el-radio-group v-model="searchInfo.alarmLevel">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">非常紧急</el-radio>
            <el-radio :label="2">紧急</el-radio>
            <el-radio :label="3">一般</el-radio>
            <el-radio :label="4">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-search" @click="searchControl">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="result" style="padding-top: 15px">
        <div style="display: flex; justify-content: space-between">
          <span class="name">查询结果</span>
          <div @click="refresh" class="refresh">
            <!-- <img
              src="../../../../assets/faceSearch/refresh.png"
              alt=""
              class="refresh-icon"
            /> -->
            <i :class="[animation ? 'animation' : '', 'refresh-icon']"></i>
            <span class="name" style="color: #00ccff">刷新</span>
          </div>
        </div>
        <!-- 查询结果table -->
        <div class="guardList">
          <div v-for="item in guardList" :key="item.guardId">
            <div class="detail" @click="controlDetail(item.guardId)" style="cursor: pointer">
              <div class="detailTitle">
                <div class="left">
                  <img src="../../../../assets/vehicleApp/car.png" alt="" style="vertical-align: middle" />
                  <span>{{ item.guardName }}</span>
                </div>
                <span v-if="item.guardPeriod == 2">7*24小时布控</span>
                <span v-if="item.guardPeriod == 1">24小时布控</span>
              </div>
              <div class="detailTitle controlTime">
                <div style="line-height: 28px">
                  <span style="color: #1efffc">布控剩余时间：</span>
                  <span>{{ item.leftDays }} 天</span>
                </div>
                <div class="alarmLevel jinji" v-if="item.alarmLevel == 1">非常紧急</div>
                <div class="alarmLevel morejin" v-if="item.alarmLevel == 2">紧急</div>
                <div class="alarmLevel yiban" v-if="item.alarmLevel == 3">一般</div>
                <div class="alarmLevel di" v-if="item.alarmLevel == 4">低</div>
              </div>
              <div class="detailTitle" style="margin-top: 15px; display: flex; justify-content: space-between">
                <div style="flex: 1">
                  <span style="color: #1efffc">创建人：</span>
                  <span>{{ item.createUser }}</span>
                </div>
                <div class="alarmLevel jinji" style="flex: 1; text-align: right">
                  <span style="color: #1efffc">创建时间：</span>
                  <span>{{ item.createTime.slice(0, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 布控详情弹框 -->
    <div v-if="showControlDetail" class="controlDetail">
      <div class="title main-title">
        <span>任务详情</span>

        <img style="cursor: pointer" @click="closeControlDetail" src="../../../../assets/vehicleApp/close.png" alt="" />
      </div>
      <div class="title cus-title">
        {{ controlDetails.guardName }}
      </div>
      <div class="pDiv">
        <div class="basicInfo">
          <div class="baseInfoRow">
            <span>
              告警总数：<span class="num">{{ controlDetails.allAlarm }}</span>
            </span>
            <span>
              今日告警：<span class="num">{{ controlDetails.curAlarm }}</span>
            </span>
          </div>
          <div class="baseInfoRow">
            <span
              >时间范围：{{ controlDetails.beginTime.slice(0, 10) }} 至 {{ controlDetails.endTime.slice(0, 10) }}</span
            >
            <span
              >已布控天数：<span>{{ controlDetails.guardDays ? controlDetails.guardDays : 0 }}天</span></span
            >
          </div>
          <div class="baseInfoRow">
            <span
              >布控范围：<span v-for="ele in controlDetails.repositoryList" :key="ele.repositoryId">{{
                ele.repositoryName ? ele.repositoryName : '无' + ';'
              }}</span></span
            >
            <!-- <span
              >布控对象：<span
                v-for="ele in controlDetails.sourceList"
                :key="ele.deviceId"
                >{{ ele.sourceName ? ele.sourceName : "无" + ";" }}</span
              ></span
            > -->
          </div>
          <div class="baseInfoRow">
            <span
              >创建人：<span> {{ controlDetails.createUser }}</span></span
            >
            <span
              >创建时间：<span>{{ controlDetails.createTime }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="pDiv">
        <ul class="alarmDetail">
          <li>告警内容</li>
          <li>车牌号</li>
          <li>布控设备</li>
          <li>命中库</li>
          <li>告警时间</li>
        </ul>
      </div>
      <div class="pDiv">
        <div class="alarmDetailBg">
          <div v-for="(item, index) in guardHitList" :key="index" class="roomDetail" @click="alarmDetailClick(index)">
            <li title="详情" class="centerItem">
              <img :src="item.vehiclePhoto" alt="" />
            </li>

            <li title="详情" class="centerItem">{{ item.lpn }}</li>
            <li title="详情" class="centerItem">{{ item.deviceName }}</li>
            <li title="详情" class="centerItem">{{ item.repositoryName }}</li>
            <li title="详情" class="centerItem">{{ item.hitTime }}</li>
          </div>
        </div>
      </div>
      <div class="pDiv" style="display: flex; flex-direction: row-reverse" @click="moreAlrmClick">
        <!-- <span
          style="
            color: #00ccff;
            cursor: pointer;
            position: absolute;
            right: 36px;
            bottom: 9px;
          "
          >查看更多></span
        > -->
      </div>
    </div>

    <!-- 警告详情/检索详情 -->
    <div v-if="showAlrmDetail" class="controlAlarmDetail">
      <div style="flex: 1">
        <div class="title">
          <span>检索详情</span>
        </div>
        <div class="pDiv">
          <div class="vedio">
            <img :src="alarmDetail.vehiclePhoto" alt="" />
          </div>
        </div>
        <div class="pDiv">
          <div class="vedioBtn">
            <div @click="shikuang" style="cursor: pointer">
              <img src="../../../../assets/faceSearch/shikuang.png" alt="" style="vertical-align: middle" />
              <span style="padding-left: 5px">实况</span>
            </div>
            <div style="cursor: pointer" class="huifang">
              <img src="../../../../assets/faceSearch/huifang.png" alt="" style="vertical-align: middle" />
              <span style="padding-left: 5px">回放</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 分割 -->
      <div style="flex: 1">
        <el-button type="primary" calarmDetailslass="btnPrimary" @click="goBack" class="goback"
          >返<span style="display: inline-block"></span>回</el-button
        >
        <div class="pDiv">
          <div class="imgs">
            <div class="btn-change">
              <div>
                <img :src="alarmDetail.captureImage" alt="" />
                <div class="text">抓拍</div>
              </div>

              <div class="btn-change">
                <img :src="alarmDetail.vehiclePhoto" alt="" />
                <div class="text">布控库</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pDiv" style="margin-top: 21px">
          <div style="margin-top: 15px">
            <span class="alarmDetails">
              抓拍时间: <span class="white">{{ alarmDetail.hitTime }}</span>
            </span>
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >抓拍摄像机:
              <span class="white">{{ alarmDetail.deviceName }}</span>
            </span>
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails">抓拍图片质量：<span class="white">68分</span> </span>
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >抓拍车辆：
              <span class="white">{{ alarmDetail.lpn }}</span>
            </span>
          </div>
        </div>
        <div class="tag">
          <div class="tagname" v-for="(item, index) in tagArray" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getRepositoryInfo,
  getGuardList,
  getGuardInfo,
  getVehicleHitList,
  getVehicleHitLists,
  getGuardHitList,
} from '@/utils/api.js'
import { DateDiff } from '@/utils/mutil'
import { getScsGuardList } from '../../../../utils/api'
import Dayjs from '../../../../utils/Dayjs'

export default {
  data() {
    return {
      searchInfo: {
        // 布控名称
        guardName: '',
        // 布控库id
        repositoryId: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 告警等级
        alarmLevel: 0,
        pageInfo: {
          pageNum: 1,
          pageSize: 5000,
        },
        guardType: 2,
      },
      animation: false,
      // 时间btns
      timeType: '4',
      // 时间选择器
      dateValue: '',

      showControlDetail: false,
      showAlrmDetail: false,
      guardHitList: [], //布控命中列表
      repositoryList: [],
      // 车辆布控查询结果
      guardList: [],
      //  车辆布控详细信息
      controlDetails: {},
      // 告警信息列表
      alarmList: [],
      selectValue: '',
      alarmDetail: {},
      alarmTotal: 0,
      todayAlarmTotal: 0,
      tagArray: ['轿车', '压线', '车辆超速', '来源城：中移动分析平台', '车牌：无'],
    }
  },
  mounted() {
    this.radioChange()
    //获取车辆布控库列表
    this.getRepositoryList()
    this.searchControl()
  },
  methods: {
    shikuang() {
      let param = {
        dialogId: 'vehicleApplications',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
      }
      window.webkitProc('realtime-play', JSON.stringify(param))
    },
    huifang() {
      let param = {
        dialogId: 'vehicleControlDetailRecord',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
        startTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        recordMethod: 0,
      }
      console.log(param, '回放参数')
      window.webkitProc('record-playback', JSON.stringify(param))
    },
    //获取车辆布控库列表
    async getRepositoryList() {
      let res = await getRepositoryInfo({
        pageInfo: { pageNum: 1, pageSize: 5000 },
      })
      if (res.resultCode === 0) {
        this.repositoryList = res.repositoryList
      }
    },
    radioChange() {
      let s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
      let e = Dayjs().format('YYYY-MM-DD 23:59:59')
      // 如果是近三天
      if (this.timeType == '1') {
        s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      }
      // 如果是近七天
      else if (this.timeType == '2') {
        s = Dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      }
      // 如果是近一个月
      else if (this.timeType == '3') {
        s = Dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      } else {
        s = ''
        e = ''
      }
      this.searchInfo.startTime = s
      this.searchInfo.endTime = e
    },
    // 查询布控任务
    async searchControl() {
      if (DateDiff(this.searchInfo.startTime, this.searchInfo.endTime) > 30) {
        this.$message.warning('时间间隔不能大于30天')
        return
      }
      let res = await getScsGuardList(this.searchInfo)
      if (res.resultCode === 0) {
        console.log(res, 'res555')
        if (res.guardList) {
          var guardList = res.guardList.filter(function (item) {
            return item.guardType == 2 && item.leftDays > 0
          })
          this.guardList = guardList
        } else {
          this.guardList = []
        }
      }
    },
    changeDate() {
      this.date_format()
    },
    //刷新
    refresh() {
      this.searchControl()
      this.animation = true
      setTimeout(() => {
        this.animation = false
      }, 1000)
    },
    async controlDetail(guardId) {
      // 获取基本信息
      console.log(guardId)
      let res1 = await getGuardInfo({ guardId: guardId })
      if (res1.resultCode === 0) {
        this.controlDetails = res1
        let guardId = this.controlDetails.guardId
        let res2 = await getGuardHitList({
          guardId: guardId,
          pageInfo: { pageNum: 1, pageSize: 500 },
        })
        console.log(res2, 'res2')
        if (res2.resultCode === 0) {
          if (res2.guardHitList) {
            this.guardHitList = res2.guardHitList
          }
          if (this.showAlrmDetail == false) {
            this.showControlDetail = true //命中
          } else {
            this.$nextTick(() => {
              this.showAlrmDetail = false
            })
          }
        }
      }
    },
    async alarmDetailClick(index) {
      this.alarmDetail = this.guardHitList[index]
      this.showControlDetail = false
      this.showAlrmDetail = true
    },
    goBack() {
      this.showAlrmDetail = false
      this.showControlDetail = true
    },
    closeControlDetail() {
      this.showControlDetail = false
    },
    // 更多历史告警记录
    moreAlrmClick() {
      this.$router.push({ path: '/minivisionAlarm', query: { type: 1 } })
    },
  },
}
</script>
<style lang="scss" scoped>
.date-time-wrapper {
  .time-quick {
    color: #d6dcdd;
  }
}
.btn-search {
  width: 200px;
  height: 40px;
  background-color: #00ccff;
  margin: 0 auto;
}
.faceControl {
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
  width: 100%;
  height: 100%;
  background: url('../../../../assets/buildingSeting/background.png') no-repeat;
  background-size: 100% 100%;
  .pannel {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    ::v-deep.el-form {
      .el-form-item__label {
        width: 100px;
      }
      .el-form-item__content {
        margin-left: 100px;
      }
    }
    .title {
      padding-top: 16px;
      padding-left: 16px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
      margin-bottom: 30px;
    }
    .block {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 30px;
      .content {
        flex: 1;
      }
      .name {
        text-align: right;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #edf6f7;
        .el-select .el-input {
          width: 100%;
        }
      }
      .btnPrimary {
        width: 160px;
        height: 40px;
        background: #00ccff;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
      .el-radio-group .el-radio-button {
        border-radius: 10px;
        margin-right: 0;
      }

      .el-radio-button__inner {
        background: transparent;
        color: #fefefe;
        border-color: #7ea5c9;
        width: 114px;
        height: 32px;
        line-height: 10px;
        border-radius: none;
      }
      .el-radio-group .el-radio-button:nth-child(2) .el-radio-button__inner {
        border-radius: 0;
      }
      .el-radio-group .el-radio-button:nth-child(1) .el-radio-button__inner {
        border-radius: 8px 0 0 8px;
      }
      .el-radio-group .el-radio-button:nth-child(3) .el-radio-button__inner {
        border-radius: 0px 8px 8px 0;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #00ccff;
        border-color: #00ccff;
      }
      .el-range-input {
        background: transparent;
        color: #fefefe;
      }
    }
    .radio {
      .el-radio__input.is-checked + .el-radio__label {
        color: #edf6f7;
      }
      .el-radio {
        color: #edf6f7;
      }
      .el-radio__inner {
        background: transparent;
        margin-right: 5px;
      }
      .el-radio__label {
        font-size: 14px;
        padding-left: 0px;
      }
    }
    .result {
      width: 100%;
      margin: auto 16px;
      .name {
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #edf6f7;
        line-height: 36px;
      }
      .refresh {
        margin-right: 41px;
        .refresh-icon {
          background-image: url('../../../../assets/faceSearch/refresh.png');
          background-size: 100% 100%;
          display: inline-block;
          height: 14px;
          width: 14px;
          vertical-align: middle;
          transition: transform 1s;
        }
        .animation {
          transform: rotate(180deg);
        }
      }
      .guardList {
        height: 384px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        width: 417px;
      }

      .detail {
        box-sizing: border-box;
        width: 100%;
        background-color: rgba(20, 47, 72, 0.65);
        margin-bottom: 25px;
        padding: 10px;
        .detailTitle {
          display: flex;
          justify-content: space-between;
          width: 100%;
          color: #ffffff;
          align-items: center;
          font-size: 14px;
          .left {
            flex: 1;
            display: flex;
            align-items: center;
            img {
              margin-right: 5px;
            }
          }
        }
        .controlTime {
          margin-top: 15px;
          .alarmLevel {
            text-align: center;
            padding: 6px 10px;
            font-size: 14px;
            border-radius: 4px;
          }
          .jinji {
            border: 1px solid #ff0000;
            color: #ff0000;
          }
          .morejinji {
            border: 1px solid #ff4e00;
            color: #ff4e00;
          }
          .yiban {
            border: 1px solid #fa9a3d;
            color: #fa9a3d;
          }
          .di {
            border: 1px solid #94d73e;
            color: #94d73e;
          }
        }
      }
    }
  }
  .controlDetail {
    width: 680px;
    height: 680px;
    position: absolute;
    right: 530px;
    margin-top: -90vh;
    padding: 15px;

    background: rgba(20, 47, 72, 0.65);
    background: url('./image/800.png');
    background-size: 100% 100%;
    .main-title {
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      img {
        width: 10px;
        height: 10px;
      }
    }

    .title {
      color: #1efffc;
      font-size: 16px !important;
      &.cus-title {
        color: #ffffff;
        font-size: 16px;
        margin-top: 10px;
      }
    }
    .pDiv {
      box-sizing: border-box;
      width: 100%;
      color: #ffffff;
      .basicInfo {
        padding-top: 20px;
        width: 100%;
        font-size: 14px;
        .baseInfoRow {
          display: flex;
          margin-bottom: 20px;
          .num {
            color: #ffd200;
            font-size: 20px;
          }
          span:nth-child(1) {
            flex: 1;
          }
          span:nth-child(2) {
            flex: 0.8;
          }
        }
      }
      .alarmDetail {
        display: flex;
        justify-content: space-around;
        background: rgba(0, 204, 255, 0.2);
        padding: 10px 0px;
        margin-top: 10px;
        color: #f1fefe;
        font-size: 14px;
        li {
          flex: 1;
          text-align: center;
          &:last-child {
            flex: 1.5;
          }
        }
      }
      .alarmDetailBg {
        width: 100%;
        font-size: 14px;
        overflow-y: auto;
        height: 344px;
        .roomDetail {
          display: flex;
          justify-content: space-around;
          margin: 10px 0px;
          padding: 4px 0px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ecf7f7;
          cursor: pointer;
          li {
            flex: 1;
            text-align: center;
            &:last-child {
              flex: 1.5;
            }
          }
        }
        .roomDetail:hover {
          background: #00ccff;
          opacity: 0.8;
        }
      }
    }
  }
  .controlAlarmDetail {
    display: flex;
    width: 880px;
    height: 450px;
    position: absolute;
    right: 460px;
    // margin-top: -90vh;
    background: rgba(20, 47, 72, 0.65);
    top: 50%;
    margin-top: -225px;
    border-radius: 8px;
    background: url('./image/1000.png');
    background-size: 100% 100%;
    .title {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-left: 15px;
      margin-right: 20px;
      color: #1efffc;
      .btnPrimary {
        width: 80px;
        height: 35px;
        background: #00ccff;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .pDiv {
      margin-top: 10px;
      box-sizing: border-box;
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
      color: #ffffff;
      .vedio {
        background-color: #242f32;
        width: 100%;
        height: 100%;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .vedioBtn {
        display: flex;
        width: 380px;
        height: 20px;
        margin-left: 50%;
        transform: translateX(-50%);
        div {
          flex: 1;
        }
      }
      .imgs {
        display: flex;

        margin-top: 50px;
        justify-content: center;
        .btn-change {
          width: 110px;
          padding-right: 20px;
          text-align: center;
          display: flex;
          img {
            height: 83px;
            width: 110px;
          }
          .text {
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
          }
        }
        div {
          flex: 1;
        }
      }
      .alarmDetails {
        color: #1efffc;
        .jinji {
          display: inline-block;
          width: 48px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border: 1px solid #ff0000;
          color: #ff0000;
        }
        .white {
          color: #edf6f7;
        }
      }
    }
    .tag {
      margin-top: 25px;
      display: flex;
      flex-wrap: wrap;
      .tagname {
        border: 1px solid #00ccff;
        border-radius: 4px;
        color: #00ccff;
        padding: 5px;
        margin-right: 8px;
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
    .goback {
      position: absolute;
      top: 17px;
      right: 17px;
    }
  }
}
.timetap {
  margin-top: 15px;
}
.timetap .el-radio-group {
  margin-right: 0;
  .el-radio-group .el-radio-button .el-radio-button__inner {
    border-radius: 0;
  }
}
.centerItem {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 68px;
    width: 68px;
  }
}
</style>
