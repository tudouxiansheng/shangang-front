<template>
  <div class="screen">
    <div class="bgimg">
      <!--左边banner-->
      <div class="banner left-banner">
        <!--态势统计-->
        <taishi :callalarm="callalarm"></taishi>
        <!--设备运行统计-->
        <equipmentOperation :callalarm="callalarm"></equipmentOperation>
      </div>
      <div class="banner center-banner">
        <div class="zq-wrapper">
          <div class="center-banner-text">
            <img src="./images/1-1.png" class="imgab ab-1" />
            <img src="./images/1-2.png" class="imgab ab-2" />
            <img src="./images/1-4.png" class="imgab ab-4" />
            <div class="alarm-wrapper">
              <div class="alarmall">今日告警总数</div>
              <div class="alarmall alarm-num">{{ alarmTotal }}</div>
            </div>
          </div>

          <div class="zhuanquan">
            <div class="ball ball1" @click="alarmMsgFn(0)">
              <span class="ball-name">{{ alarmNumList[0] && alarmNumList[0].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[0] && alarmNumList[0].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball2" @click="alarmMsgFn(1)">
              <span class="ball-name">{{ alarmNumList[1] && alarmNumList[1].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[1] && alarmNumList[1].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball3" @click="alarmMsgFn(2)">
              <span class="ball-name">{{ alarmNumList[2] && alarmNumList[2].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[2] && alarmNumList[2].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball4" @click="alarmMsgFn(3)">
              <span class="ball-name">{{ alarmNumList[3] && alarmNumList[3].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[3] && alarmNumList[3].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball5" @click="alarmMsgFn(4)">
              <span class="ball-name">
                {{ alarmNumList[4] && alarmNumList[4].alarmName }}
              </span>
              <div class="alarm-num">
                {{ alarmNumList[4] && alarmNumList[4].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball6" @click="alarmMsgFn(5)">
              <span class="ball-name">{{ alarmNumList[5] && alarmNumList[5].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[5] && alarmNumList[5].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball7" @click="alarmMsgFn(6)">
              <span class="ball-name">{{ alarmNumList[6] && alarmNumList[6].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[6] && alarmNumList[6].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
            <div class="ball ball8" @click="alarmMsgFn(7)">
              <span class="ball-name">{{ alarmNumList[7] && alarmNumList[7].alarmName }}</span>
              <div class="alarm-num">
                {{ alarmNumList[7] && alarmNumList[7].alarmNum }}
              </div>
              <img src="./images/alarm-type.png" style="position: absolute" />
            </div>
          </div>
        </div>

        <alarmTrend :callalarm="callalarm"></alarmTrend>
      </div>
      <div class="banner left-banner right-banner">
        <div class="left-banner-first">
          <img src="./images/wrapperxy.png" class="wrapper-img" />
          <!-- <div class="title-ai">
            <div class="line"></div>
          </div> -->
          <div class="box_center left-banner-first_item">
            <div class="box_center_header">今日告警区域top5</div>
            <ul class="box_center_header_list">
              <li class="box_center_header_list_item">
                <span class="common_inblock">TOP5</span>
                <span>区域名称</span>
                <span>数量</span>
              </li>
              <li v-for="item in areaList" :key="item.alarmRanking" class="box_center_header_list_item">
                <span>
                  <img src="@/assets/mytask/1.png" alt="" v-if="item.alarmRanking == 1" />
                  <img
                    src="@/assets/mytask/2.png"
                    alt=""
                    v-else-if="item.alarmRanking == 2"
                    style="width: 20px; height: 20px"
                  />
                  <img
                    src="@/assets/mytask/3.png"
                    alt=""
                    v-else-if="item.alarmRanking == 3"
                    style="width: 20px; height: 20px"
                  />
                  <span v-else class="common_inblock">{{ item.alarmRanking }}</span>
                </span>
                <span style="text-align: left">{{ item.alarmArea }}</span
                ><span>{{ item.alarmNum }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="left-banner-first banner-second">
          <img src="./images/wrapperxy.png" class="wrapper-img" />
          <div class="title-ai">
            <div class="line"></div>
            <div class="titlename-ai">今日告警情况处理</div>

            <ul class="box_list">
              <li class="box_list_item">
                <div class="box_list_item_header">
                  <span>告警总数</span><span>{{ allAlarm.alarmTotal }}个</span>
                </div>
                <div class="box_list_item_chart">
                  <div class="box_list_item_chart_content" :style="changeDataFn(allAlarm.alarmTotal)">
                    <div class="box_list_item_header_flash"></div>
                  </div>
                </div>
              </li>
              <li class="box_list_item">
                <div class="box_list_item_header">
                  <span>已处理</span><span>{{ allAlarm.processedNum }}个</span>
                </div>
                <div class="box_list_item_chart">
                  <div class="box_list_item_chart_content" :style="changeDataFn(allAlarm.processedNum)">
                    <div class="box_list_item_header_flash"></div>
                  </div>
                </div>
              </li>
              <li class="box_list_item">
                <div class="box_list_item_header">
                  <span>进行中</span><span>{{ allAlarm.inProgressNum }}个</span>
                </div>
                <div class="box_list_item_chart">
                  <div class="box_list_item_chart_content" :style="changeDataFn(allAlarm.inProgressNum)">
                    <div class="box_list_item_header_flash"></div>
                  </div>
                </div>
              </li>
              <li class="box_list_item">
                <div class="box_list_item_header">
                  <span>未处理</span><span>{{ allAlarm.untreatedNum }}个</span>
                </div>
                <div class="box_list_item_chart">
                  <div class="box_list_item_chart_content" :style="changeDataFn(allAlarm.untreatedNum)">
                    <div class="box_list_item_header_flash"></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import taishi from './components/taishi.vue'
import equipmentOperation from './components/equipment-operation.vue'
import alarmTrend from './components/alarmTrend.vue'
import { ALLalarm, allAlarmSituation, getAlarmArea, GetalarmClassification, AlarmTrendChart } from '@/utils/api.js'
const Base64 = require('js-base64').Base64
export default {
  components: {
    taishi,
    equipmentOperation,
    alarmTrend,
  },

  data() {
    return {
      areaList: [], //区域数组
      allAlarm: {
        alarmTotal: '',
        inProgressNum: '',
        processedNum: '',
        untreatedNum: '',
      }, //总告警处理情况
      alarmNumList: [], //告警分类
      alarmTotal: '', //总数
      alarmTendencyInfoList: [], //告警趋势图
      callalarm: false,
    }
  },
  created() {
    this.initWebscoket()
  },
  methods: {
    webpackPull() {},
    changeDataFn(num) {
      return {
        width: this.alarmTotal == 0 ? '0px' : Math.floor((num / this.alarmTotal) * 386) + 'px',
      }
    },
    initWebscoket() {
      /* 页面首次加载进行HTTP请求 */
      /* 总告警处理情况 */
      allAlarmSituation({
        alarmTypeCodes: [
          'ALARM_STAFF_LEAVE',
          'ALARM_STAFF_SLEEP',
          'ALARM_SMOKE',
          'ALARM_HELMET_DETECT',
          'ALARM_USE_PHONE_WHILE_WALKING',
          'ALARM_YELLOW_SMOKE',
          'ALARM_WATER_DETECT',
          'ALARM_WEAR_LABOR_CLOTH',
        ],
      }).then((res) => {
        console.log('总告警处理情况', res)
        this.allAlarm.alarmTotal = res.alarmTotal
        this.allAlarm.inProgressNum = res.inProgressNum
        this.allAlarm.processedNum = res.processedNum
        this.allAlarm.untreatedNum = res.untreatedNum
      })
      // 总告警区域TOP5
      getAlarmArea({
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
      }).then((res) => {
        console.log('总告警区域TOP5', res)
        this.areaList = res.alarmRankingList
      })
      // 告警分类及总数
      GetalarmClassification({
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
      }).then((res) => {
        console.log('告警总数及分类', res)
        this.alarmTotal = res.alarmTotal
        this.alarmNumList = res.alarmNumList
      })
      // const url = 'ws://121.37.187.55:10000/wsapp/client?token='
      let url = 'ws://' + window.location.host + '/wsapp/client?token='
      const wsuri = url + sessionStorage.getItem('token')
      const websocket = new WebSocket(wsuri)
      websocket.onmessage = (res) => {
        /* 判断是否为AI告警模块的推送 */
        if (JSON.parse(res.data).type == 'big_screen_alarm_statistics') {
          let base64 = JSON.parse(res.data).content
          /* 总告警处理情况推送 */
          this.allAlarm = JSON.parse(Base64.decode(base64)).alarmTreatmentResponse
          /* top5推送 */
          this.areaList = JSON.parse(Base64.decode(base64)).alarmAreaRankingResponse.alarmRankingList
          /* 告警总数及分类 */
          this.alarmNumList = JSON.parse(Base64.decode(base64)).alarmStatisticsResponse.alarmNumList
          this.alarmTotal = JSON.parse(Base64.decode(base64)).alarmStatisticsResponse.alarmTotal
          /* 告警趋势图 */
          console.log(JSON.parse(Base64.decode(base64)))
          this.callalarm = true

          setTimeout(() => {
            this.callalarm = false
          }, 2000)
        }
        // console.log(res);
      }
    },
    alarmMsgFn(num) {
      console.log('JSON对象', this.alarmNumList[num].codeType)
      this.$router.push({
        path: '/artificial',
        query: {
          codeType: this.alarmNumList[num].codeType,
        },
      })
    },
  },

  mounted() {},
}
</script>

<style lang="scss" scoped>
.common_inblock {
  display: inline-block;
  height: 20px;
  width: 20px;
  text-align: center;
}

.left-banner-first_item {
  position: absolute;
  top: 5px;
  left: 28px;
}

.box_center {
  width: 400px;
  // border-bottom: 1px solid #2a95fc;
  padding-bottom: 20px;

  .box_center_header {
    margin-top: 23px;
    border-left: 4px solid #00fff0;
    font-size: 16px;
    color: #ffffff;
    padding-left: 9px;
  }

  .box_center_header_list {
    margin-top: 14px;
    font-size: 14px;

    .box_center_header_list_item {
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
      color: #c6defd;
      margin-bottom: 10px;
      border-bottom: 1px dashed rgba(42, 149, 252, 0.3);

      > span {
        display: inline-block;
        width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}

.bgimg {
  background: url('../../../../assets/aiScreen/mybg.png') no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  padding: 40px;
  display: flex;
  pointer-events: auto;

  .banner {
    width: 460px;
    height: 100vh;
  }

  .left-banner {
    .left-banner-first {
      width: 456px;
      height: 356px;
      position: relative;

      .wrapper-img {
        width: 456px;
        height: 356px;
      }

      .title-ai {
        position: absolute;
        left: 27px;
        top: 27px;
        display: flex;
        width: 100%;

        .box_list {
          position: absolute;
          top: 25px;
          left: 0px;

          .box_list_item {
            .box_list_item_header {
              padding: 10px 0;
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              color: #ffffff;
            }

            .box_list_item_chart {
              padding: 5px;
              width: 398px;
              height: 24px;
              border: 1px solid #27f7e1;
              background-color: rgba(39, 247, 225, 0.1);

              .box_list_item_chart_content {
                position: relative;
                overflow: hidden;
                width: 386px;
                height: 12px;
                background: linear-gradient(90deg, #1a80ff 0%, #28f7e1 100%);
                @keyframes flash {
                  from {
                    left: 0;
                  }

                  to {
                    left: 100%;
                  }
                }
                .box_list_item_header_flash {
                  position: absolute;
                  width: 0px;
                  height: calc(100% + 5px);
                  background-color: #fff;
                  transform: rotate(30deg);
                  box-shadow: 0px 0px 14px 5px rgba(255, 255, 255, 0.7);
                  animation: flash 2s linear 0s infinite;
                }
              }
            }
          }
        }

        .line {
          width: 4px;
          height: 22px;
          background: #00fff0;
        }

        .titlename-ai {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #ffffff;
          position: absolute;
          left: 9px;
        }
      }
    }

    .banner-second {
      margin-top: 56px;
    }
  }

  .center-banner {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
    min-width: 900px;

    .zq-wrapper {
      position: relative;
      width: 100%;
      height: calc(100% - 440px);
      //padding-top: 5.625rem;
    }

    .center-banner-text {
      position: absolute;
      top: 96px;
      left: 50%;
      transform: translateX(-50%);
      width: 276px;
      height: 300px;

      .alarm-wrapper {
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .alarmall {
        font-size: 22px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
      }
    }

    @keyframes animX {
      0% {
        left: 0;
      }

      100% {
        left: 566px;
      }
    }

    @keyframes animY {
      0% {
        top: 0;
      }

      100% {
        top: 452px;
      }
    }

    .ball {
      width: 194px;
      border-radius: 50%;
      position: absolute;
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        cursor: pointer;
        width: 100%;
      }

      .ball-name {
        font-size: 18px;
      }

      .alarm-num {
        font-weight: bold;
        color: #04d5fa;
        font-size: 24px;
      }
    }

    .ball1 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -15s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
    }

    .ball2 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -22.5s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -7.5s infinite alternate;
    }

    .ball3 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -30s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -15s infinite alternate;
    }

    .ball4 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -37.5s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -22.5s infinite alternate;
    }

    .ball5 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -45s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -30s infinite alternate;
    }

    .ball6 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -52.5s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -37.5s infinite alternate;
    }

    .ball7 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -60s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -45s infinite alternate;
    }
    .ball8 {
      animation: animX 30s cubic-bezier(0.36, 0, 0.64, 1) -67.5s infinite alternate,
        animY 30s cubic-bezier(0.36, 0, 0.64, 1) -52.5s infinite alternate;
    }

    .zhuanquan {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 768px;
      height: 480px;
    }

    .bottom-banner {
      position: fixed;
      bottom: 30px;
      width: 810px;
      height: 326px;
    }
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.imgab {
  position: absolute;
  top: 0;
  left: 0;
  &.ab-1 {
    width: 183px;
    height: 183px;
    top: 54px;
    left: 48px;
    animation: rotateIn 5.5s ease 0s infinite both;
  }
  &.ab-2 {
    width: 338px;
    height: 338px;
    top: -21px;
    left: -29px;
    animation: rotateIn 12s ease 0s infinite both;
  }
  &.ab-4 {
    width: 276px;
    height: 276px;
    padding: 9px;
    top: 10px;
    animation: rotateIn 8.5s ease 0s infinite both;
  }
}
</style>
