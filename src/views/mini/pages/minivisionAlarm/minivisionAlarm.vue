<template>
  <div class="screen">
    <div id="minivisionAlarm">
      <!-- 右侧告警列表-->
      <div class="right">
        <div class="panel" v-show="!this.btnActive">
          <div class="title" style="color: #1efffc">实时告警事件</div>
          <div class="filter">
            <el-radio-group v-model="radio" @change="changeRadioGroup">
              <el-radio-button v-for="(item, index) in levelList" :key="index" :label="item.value"
                >{{ item.name }}({{ setLength(item.value) }})</el-radio-button
              >
            </el-radio-group>
          </div>
          <!--非常紧急-->
          <div class="scroll" v-show="radio == 1 ? true : false">
            <div
              v-for="(item, index) in deviceList1"
              :key="index"
              class="list"
              @click="clickAlarm(item, index)"
              style="cursor: pointer"
            >
              <div style="display: flex">
                <div class="video myvedio">
                  <img :src="item.alarmSnapUrl" class="alarmImg" v-if="item.alarmSnapUrl" />
                  <img
                    :src="require('../../../../assets/alarmImg/' + iconSty(item) + '.png')"
                    class="alarmImg1"
                    v-else
                  />
                </div>
                <div>
                  <div class="title1" style="display: inline-block">
                    {{ item.alarmTypeName }}
                  </div>
                  <div class="title1 titlex">{{ item.alarmDevName }}</div>
                </div>
              </div>
              <div class="title1 mytitle" v-time="Date.parse(new Date(item.alarmTime))" v-if="showVTime"></div>
            </div>
          </div>
          <!--紧急-->
          <div class="scroll" v-show="radio == 2 ? true : false">
            <div
              v-for="(item, index) in deviceList2"
              :key="index"
              class="list"
              @click="clickAlarm(item, index)"
              style="cursor: pointer"
            >
              <div style="display: flex">
                <div class="video myvedio">
                  <img :src="item.alarmSnapUrl" class="alarmImg" v-if="item.alarmSnapUrl" />
                  <img
                    :src="require('../../../../assets/alarmImg/' + iconSty(item) + '.png')"
                    class="alarmImg1"
                    v-else
                  />
                </div>
                <div>
                  <div class="title1" style="display: inline-block">
                    {{ item.alarmTypeName }}
                  </div>
                  <div class="title1 titlex">{{ item.alarmDevName }}</div>
                </div>
              </div>
              <div class="title1 mytitle" v-time="Date.parse(new Date(item.alarmTime))" v-if="showVTime"></div>
            </div>
          </div>
          <!--一般-->
          <div class="scroll" v-show="radio == 3 ? true : false">
            <div
              v-for="(item, index) in deviceList3"
              :key="index"
              class="list"
              @click="clickAlarm(item, index)"
              style="cursor: pointer"
            >
              <div style="display: flex">
                <div class="video myvedio">
                  <img :src="item.alarmSnapUrl" class="alarmImg" v-if="item.alarmSnapUrl" />
                  <img
                    :src="require('../../../../assets/alarmImg/' + iconSty(item) + '.png')"
                    class="alarmImg1"
                    v-else
                  />
                </div>
                <div>
                  <div class="title1" style="display: inline-block">
                    {{ item.alarmTypeName }}
                  </div>
                  <div class="title1 titlex">{{ item.alarmDevName }}</div>
                </div>
              </div>
              <div class="title1 mytitle" v-time="Date.parse(new Date(item.alarmTime))" v-if="showVTime"></div>
            </div>
          </div>
          <!--低-->
          <div class="scroll" v-show="radio == 4 ? true : false">
            <div
              v-for="(item, index) in deviceList4"
              :key="index"
              class="list"
              @click="clickAlarm(item, index)"
              style="cursor: pointer"
            >
              <div style="display: flex">
                <div class="video myvedio">
                  <img :src="item.alarmSnapUrl" class="alarmImg" v-if="item.alarmSnapUrl" />
                  <img
                    :src="require('../../../../assets/alarmImg/' + iconSty(item) + '.png')"
                    class="alarmImg1"
                    v-else
                  />
                </div>
                <div>
                  <div class="title1" style="display: inline-block">
                    {{ item.alarmTypeName }}
                  </div>
                  <div class="title1 titlex">{{ item.alarmDevName }}</div>
                </div>
              </div>
              <div class="title1 mytitle" v-time="Date.parse(new Date(item.alarmTime))" v-if="showVTime"></div>
            </div>
          </div>
          <!--更多历史告警-->
          <div @click="historyAlarm()" class="title historyAlarm">
            更多历史告警
            <img src="../../../../assets/socialResources/详情离开.png" alt class="infoImg" />
          </div>
        </div>
      </div>
      <div class="dialog">
        <div v-if="infoVisible" class="infoDiv">
          <div class="pDiv" style="position: relative">
            <i class="el-icon-close infoIcon" style="font-size: 18px" @click="Allfalse"></i>
            <div style="margin-top: 23px">
              <div class="video" style="width: 200px; height: 151px">
                <img :src="infoObj.alarmSnapUrl" alt style="width: 100%; height: 100%" v-if="infoObj.alarmSnapUrl" />
                <img
                  :src="require('../../../../assets/alarmImg/' + iconSty(infoObj) + '.png')"
                  class="alarmImg1"
                  v-else
                />
              </div>
              <div class="alarmDevName">
                {{ infoObj.alarmDevName ? infoObj.alarmDevName : '摄像机名称' }}
              </div>
              <div style="font-size: 14px">{{ infoObj.alarmTime }}</div>
            </div>
            <div class="pDiv" style="position: relative; line-height: 14px">
              <span @click="showMoreInfo" style="cursor: pointer">
                <span class="toMoreInfo">详情</span>
                <img src="../../../../assets/socialResources/详情离开.png" alt class="infoImg" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <history-Alarm ref="child" v-show="btnActive" @visiableS="visiableF"></history-Alarm>
    <!--    <alarm-detail v-if="showTab == 1" :infoObj="infoObj"></alarm-detail>-->
    <!-- <eventDetail v-if="showTab == 2"></eventDetail>
        <close-loop v-if="showTab == 3"></close-loop>-->
  </div>
</template>

<script>
import historyAlarm from './historyAlarm'
import { getFormatDate4, getFormatTime } from '@/utils/mutil'
import {
  getDictionary,
  getAlarmListNew,
  getLoginUserInfo,
  getAlarmConfirmList,
  getAlarmInfo,
  getAlarmPicUrl,
} from '@/utils/api'

import Vue from 'vue'
import { AllcamMap } from '../../../../utils/map/AllcamMap'
// import AlarmDetail from './components/alarmDetail.vue'
let BM = null
Vue.directive('time', {
  bind: function (el, binding) {
    if (binding.value !== null && binding.value !== '') {
      el.innerHTML = getFormatTime(binding.value)
      //每隔一分钟更新一次
      el.__timeout__ = setInterval(function () {
        el.innerHTML = getFormatTime(binding.value)
      }, 60000)
    } else {
      el.innerHTML = '未知'
    }
  },
  unbind: function (el) {
    clearInterval(el.__timeout__)
    delete el.__timeout__
  },
})

export default {
  components: {
    historyAlarm,
    // AlarmDetail,
  },
  data() {
    return {
      showVTime: true,
      alarmList: [],
      confirmList: [],
      infoObj: {},
      levelList: [],
      showInfo: false,
      btnActive: false,
      infoVisible: false,
      moreInfoVisible: false,
      status: '',
      radio: '1',
      //人员 1；车辆 2;其他 3；
      deviceList1: [],
      deviceList2: [],
      deviceList3: [],
      deviceList4: [],
      marker: [],
      mapState: '',
      dialogId: '',
      label: {
        id: '',
        name: '',
      },
      showTab: this.$store.state.alarmpage, //展示哪一个详情页
      currentRow: {},
      websock: null,
      newData: {},
      alarmId: '',
      alarmTime: '',
    }
  },
  computed: {
    iconSty(item) {
      return (item) => {
        if (item.alarmType == 'ALARM_SMOKE_ALARM') {
          return '烟雾'
        } else if (item.alarmType == 'ALARM_GAS_DETECTION') {
          return '燃气'
        } else if (item.alarmType == 'ALARM_PERIMETER_INVASION') {
          return '巡更'
        } else {
          return 'noImg'
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    console.log(to)
    this.$store.commit('alarmPage', 0)
    next()
  },
  watch: {
    '$store.state.alarmpage': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showTab = newVal
      }
    },
    '$store.state.closeMoreAlarm': function (newVal, oldVal) {
      console.log(newVal, 'newVal')
      //关闭更多历史
      if (newVal) {
        this.btnActive = false
        this.infoObj = this.$store.state.alarmItem
      } else {
        this.btnActive = true
      }
    },
  },
  created() {
    if (this.$route.query.type == 0) {
      this.historyAlarm()
    }

    var mapState = sessionStorage.getItem('mapState')
    //2D地图
    this.mapState = mapState

    if (mapState == 1) {
      //to
    } else {
      //AllcamMap.map.displayIotDeviceIcon(null, false);
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
    let closeParm = {
      dialogId: this.dialogId,
    }
    window.webkitProc('player_dialog_close', JSON.stringify(closeParm))
    if (this.websock) {
      this.websock.close()
      this.websock = null
    }

    if (this.mapState == 1) {
      console.log('2d删除图标')
      for (let i = 0; i < this.marker.length; i++) {
        this.marker[i].remove()
      }
    } else {
      // 移除地图点击事件
      if (AllcamMap.map) {
        AllcamMap.map.off('click')
        // 删除图标显示
        AllcamMap.map.removeAlarmIcon(false)
      }
    }
  },

  async mounted() {
    if (window.BM) {
      BM = window.BM
    }

    // AllcamMap.map.displayIotDeviceIcon(null, false)
    await this.getDictionary()
    await this.getAlarmList()
    if (this.$route.query.type) {
      this.historyAlarm()
    }
    // window.map.on("click", function (e) {
    //   console.log(e);
    // });
    this.$store.commit('alarmPage', 0)
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
  },
  methods: {
    Allfalse() {
      this.infoVisible = false
    },

    //radio为告警等级
    changeRadioGroup(radio) {
      console.log(radio)
      if (AllcamMap.map) {
        let entities = AllcamMap.map.plotDrawTool.getEntitys()
        let deviceAlarm = entities.filter((entity) => entity.attribute.attr.wave == true)
      }

      // if (radio == 1) {
      //     AllcamMap.map.displayWave(1, true);
      //     AllcamMap.map.displayWave(2, false);
      //     AllcamMap.map.displayWave(3, false);
      //     AllcamMap.map.displayWave(4, false);
      // } else if (radio == 2) {
      //     AllcamMap.map.displayWave(2, true);
      //     AllcamMap.map.displayWave(1, false);
      //     AllcamMap.map.displayWave(3, false);
      //     AllcamMap.map.displayWave(4, false);
      // } else if (radio == 3) {
      //     AllcamMap.map.displayWave(3, true);
      //     AllcamMap.map.displayWave(1, false);
      //     AllcamMap.map.displayWave(2, false);
      //     AllcamMap.map.displayWave(4, false);
      // } else if (radio == 4) {
      //     AllcamMap.map.displayWave(4, true);
      //     AllcamMap.map.displayWave(1, false);
      //     AllcamMap.map.displayWave(2, false);
      //     AllcamMap.map.displayWave(3, false);
      // }
    },
    setLength(val) {
      switch (val) {
        case '1':
          return this.deviceList1.length //非常紧急
        case '2':
          return this.deviceList2.length //紧急
        case '3':
          return this.deviceList3.length //一般
        case '4':
          return this.deviceList4.length //低
      }
    },

    async getDictionary() {
      let res = await getDictionary({
        type: 'alarm-level',
      })
      console.log(res, 'res', '告警等级')
      if (res.resultCode == 0) {
        res.dictionaryList.forEach((item) => {
          if (item['value'] == '1') {
            item['name'] = '非常紧急'
          } else if (item['value'] == '2') {
            item['name'] = '紧急'
          } else if (item['value'] == '3') {
            item['name'] = '一般'
          } else if (item['value'] == '4') {
            item['name'] = '低'
          }
        })
        this.levelList = res.dictionaryList
      }
    },

    //webSocket
    handleWebSocketMessage(redata) {
      if (redata.type == 'alarm') {
        let data = JSON.parse(Base64.decode(redata.content))
        // console.log(data, "data");
        // if (localStorage.getItem("agencyChecked") == "true") {
        this.$nextTick(() => {
          if (!data.alarmSnapUrl) {
            this.$set(data, 'alarmSnapUrl', '../../../../assets/alarmImg/noImg.png')
            data.alarmSnapUrl = require('../../../../assets/alarmImg/巡更.png')
          }
          this.alarmId = data.alarmId
          this.alarmTime = data.alarmTime
          if (localStorage.getItem('agencyChecked') == 'ture') {
            console.log(data)
            this.alarmList.unshift(data)
          } else if (localStorage.getItem('agencyChecked') == 'false') {
            let data = {
              alarmId: this.alarmId,
              alarmTime: this.alarmTime,
            }
            getAlarmInfo(data).then((res) => {
              if (res.resultCode == 0) {
                this.newData = res.alarmInfo
                this.alarmList.unshift(this.newData)
              }
            })
          }

          this.showVTime = false
          this.$nextTick(() => {
            this.showVTime = true
          })
          this.$set(this.alarmList[0], 'alarmTime', data.alarmTime)

          if (this.alarmList.length > 100) {
            this.alarmList = this.alarmList.slice(0, 100)
          }

          this.deviceList1 = this.alarmList.filter((item) => {
            return item.alarmLevel == 1
          })
          this.deviceList2 = this.alarmList.filter((item) => {
            return item.alarmLevel == 2
          })
          this.deviceList3 = this.alarmList.filter((item) => {
            return item.alarmLevel == 3
          })
          this.deviceList4 = this.alarmList.filter((item) => {
            return item.alarmLevel == 4
          })
        })
      }
    },
    async getAlarmList() {
      let obj = {
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },

        beginTime: getFormatDate4(new Date()).substring(0, 10) + ' 00:00:00',
        endTime: getFormatDate4(new Date()).substring(0, 10) + ' 23:59:59',
      }
      let res = await getAlarmListNew(obj)
      console.log(res)
      this.alarmList = res.alarmList
      if (this.alarmList && this.alarmList.length) {
        console.log(res.alarmList)
        // for (let i = 0; i < this.alarmList.length; i++) {
        //    if(this.alarmList[i].alarmSnapUrl == undefined){
        //     getAlarmPicUrl({
        //         alarmId:this.alarmList[i].alarmId,
        //         platId:this.alarmList[i].platId
        //     }).then((res)=>{
        //         this.alarmList[i].alarmSnapUrl = res.imageUrl
        //     })
        //    }
        // }
        this.deviceList1 = this.alarmList.filter((item) => {
          return item.alarmLevel == 1
        })
        this.deviceList2 = this.alarmList.filter((item) => {
          return item.alarmLevel == 2
        })
        this.deviceList3 = this.alarmList.filter((item) => {
          return item.alarmLevel == 3
        })
        this.deviceList4 = this.alarmList.filter((item) => {
          return item.alarmLevel == 4
        })
      }

      // for (let i = 0; i < this.deviceList1.length; i++) {
      //   var myIcon = BM.divIcon({
      //     className: "my-div-icon",
      //     html: '<span class="pulse-icon"></span>',
      //   });
      //   var marker = BM.marker(
      //     [this.deviceList1[i].latitude, this.deviceList1[i].longitude],
      //     {
      //       icon: myIcon,
      //       deviceId: this.deviceList1[i].deviceId,
      //     }
      //   ).addTo(window.map);
      //   window.map.panTo([
      //     this.deviceList1[i].latitude,
      //     this.deviceList1[i].longitude,
      //   ]);
      //   this.marker.push(marker);
      // }
    },

    showMoreInfo() {
      this.moreInfoVisible = !this.moreInfoVisible
      this.infoVisible = false
    },

    clickAlarm(item, index) {
      //打开详情页
      this.infoObj = item
      //画波动圈
      if (item.alarmLevel !== null) {
        // AllcamMap.map.deviceAlarm(item.alarmDevId, item.alarmLevel);
        //飞到图标
        if (AllcamMap.map) {
          AllcamMap.map.flyToIcon(item.alarmDevId)
        }
      }

      this.moreInfoVisible = false
      this.showInfo = false
      this.$store.commit('alarmPage', 1)
      //没有经纬度打开小窗
      if (item.longitude && item.latitude) {
        //to
      } else {
        // this.infoVisible = true;
      }
      //告警处理item
      this.currentRow = item
      console.log('item', item)
      this.$store.commit('alarmItem', item)
      //人员布控 1;车辆 2；其他 3；
      if (item.alarmType == 'ALARM_KEY_PERSON') {
        this.status = 1
      } else if (item.alarmType == 'ALARM_KEY_VEHICLE') {
        this.status = 2
      } else {
        this.status = 3
      }
    },
    visiableF(data) {
      this.btnActive = data
    },
    historyAlarm() {
      this.btnActive = !this.btnActive
      this.$store.commit('alarmPage', 0)
      this.$store.commit('closeMoreAlarm', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.alarm-wrapper {
  background-color: #fff;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;
  //top: 80px;
}
#minivisionAlarm {
  width: 100%;
  min-height: calc(100vh - 70px);

  .el-card {
    background: transparent;
    color: #fff;
    border: none;
  }

  .el-timeline-item__timestamp {
    color: #1efffc;
  }

  .el-card__body {
    padding: 0px;
  }

  .el-timeline-item__tail {
    border-left: 1px dashed #1efffc;
    margin-left: 19.5px;
  }

  .el-timeline-item__node {
    background-color: #1efffc;
    margin-left: 20px;
    width: 10px;
    height: 10px;
  }

  .el-timeline-item__wrapper {
    padding-left: 34px;
  }

  .el-timeline-item__timestamp.is-top {
    padding-top: 3px;
  }

  .infoDiv {
    pointer-events: auto;
    width: 340px;
    //   height: 370px;
    background: rgba(20, 47, 72, 0.65);
    border-radius: 8px;
    position: absolute;
    right: 473px;
    top: 100px;

    .infoIcon {
      color: #edf6f7;
      font-size: 12px;
      position: absolute;
      right: 12px;
      top: 12px;
      font-size: 18px !important;
      cursor: pointer;
    }

    .btnPrimary {
      width: 76px;
      // height: 30px;
      background: #00ccff;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }

    .title {
      margin-top: 8px;
    }
  }

  .dialog {
    .pDiv {
      color: #edf6f7;
      padding-left: 25px;

      .infoImg {
        width: 11px;
        transform: rotate(270deg);
      }
    }

    .infoImg {
      width: 11px;
      position: absolute;
      right: 10px;
      top: 3px;
    }

    .toMoreInfo {
      position: absolute;
      right: 24px;
      color: #1efffc;
      cursor: pointer;
    }

    .infoDiv {
      pointer-events: auto;
      width: 257px;
      height: 264px;
      background: rgba(20, 47, 72, 0.65);
      box-shadow: 0px 7px 10px 0px rgb(0 255 240 / 32%);
      border-radius: 8px;
      position: absolute;
      // right: 637px;
      // top: 163px;
      left: 50%;
      margin-left: -125px;
      top: 116px;
    }

    .infoIcon {
      color: #edf6f7;
      font-size: 18px;
      position: absolute;
      right: 12px;
      // top: 12px;
      top: -12px;
      cursor: pointer;
    }
  }

  .colSpan {
    // margin-right: 100px;
    margin-left: 20px;
  }

  .el-collapse-item__header.is-active {
    border-bottom-color: #ebeef5;
  }

  .el-collapse-item__content {
    color: #edf6f7;
    padding-bottom: 0px;
  }

  .el-collapse-item__wrap {
    background-color: transparent;
    color: #fff;
    border: none;
  }

  .el-collapse {
    border: none;
  }

  .el-collapse-item {
    margin: 0px 10px 24px;
  }

  .el-collapse-item__arrow {
    display: none;
  }

  .el-radio-group:first-child .el-radio-button__inner {
    border-left: 1px solid #7ea5c9;
    // padding-left: 4px;
    border-radius: 8px 0 0 8px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    font-size: 12px;
  }

  .el-radio-group:last-child .el-radio-button__inner {
    // border-right: 1px solid #dcdfe6;
    border-radius: 0px 8px 8px 0px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }

  .el-radio-group:first-child .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    // background-color: #409EFF;
    background-color: #ff3333;
    border-color: #ff3333;
  }

  .el-radio-group:nth-child(2) .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    // background-color: #409EFF;
    background-color: #ff4e00;
    border-color: #ff4e00;
  }

  .el-radio-group:nth-child(3) .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    // background-color: #409EFF;
    background-color: #fa9a3d;
    border-color: #fa9a3d;
  }

  .el-radio-group:last-child .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    // background-color: #409EFF;
    background-color: #94d73e;
    border-color: #94d73e;
  }

  .el-radio-button__inner {
    width: 90px;
    // height: 32px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fefefe;
    background: transparent;
    border: 1px solid #7ea5c9;
    font-size: 14px;
    // border-radius: 8px 0px 0px 8px;
    white-space: nowrap;
    border-left: 0;
    // border-right: 0;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    position: relative;
    cursor: pointer;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    // padding: 12px 20px;
    border-radius: 2px;
  }

  .el-collapse-item__header {
    height: 36px;
    line-height: 36px;
    background: rgba(0, 204, 255, 0.2);
    color: #edf6f7;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border: none;
    position: relative;
  }

  ::-webkit-scrollbar-track {
    background-color: #1e2c45 !important;
  }

  ::-webkit-scrollbar-thumb {
    // background-color: #2e4c90 !important;
    background-color: #00ccff !important;
    border-radius: 3px;
  }

  ::-webkit-scrollbar {
    // width: 6px;
    width: 4px;
    height: 4px;
  }

  .el-input__inner {
    height: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    background: #192f3f;
    border: 1px solid #00ccff;
    opacity: 0.7;
    border-radius: 4px;
  }

  .active {
    background-color: #2e4c90;
  }

  width: 100%;
  min-height: 900px;
  height: calc(100vh - 70px);
  position: relative;

  .right {
    pointer-events: auto;
    width: 500px;
    min-height: 90%;
    height: 89.8vh;
    position: absolute;
    right: 19px;
    margin-top: 16px;
    .filter {
      //width: 450px;
      margin: 35px auto 0;
    }
    .panel {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      background: url('../../../../assets/buildingSeting/background.png') no-repeat;
      background-size: 100% 100%;

      .title {
        padding-top: 16px;
        padding-left: 16px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #d6e7e7;
      }

      .scroll {
        height: 79%;
        // height: 40.74vh;
        width: 100%;
        margin-top: 24px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;

        // margin: 10px 2px;
        .list {
          position: relative;
          display: flex;
          width: 410px;
          // height: 107px;
          background: rgba(32, 75, 116, 0.65);
          // margin: 24px auto;
          margin: 0px auto 24px;

          .video {
            margin: 14px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #1efffc;
          }

          .title1 {
            margin: 10px 0px;
            // width: 135px;
            height: 17px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #edf6f7 !important;
            line-height: 36px;
          }
        }
      }

      .infoImg {
        width: 11px;
        transform: rotate(270deg);
      }
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #edf6f7;
    }

    .el-radio {
      color: #edf6f7;
    }

    .el-radio__inner {
      background: transparent;
    }

    .el-collapse-item__wrap {
      // transition: none;
      transition: ease-in-out 0.2s;
      transition-delay: 0.1s;
    }
  }

  //等级
  .level1 {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.2);
  }
  .level2 {
    color: #ff4e00;
    background: rgba(255, 78, 0, 0.2);
  }
  .level3 {
    color: #ffa900;
    background: rgba(255, 169, 0, 0.2);
  }
  .level4 {
    color: #00ccff;
    background: rgba(0, 204, 255, 0.2);
  }

  .alarmImg {
    width: 100%;
  }

  .alarmImg1 {
    width: 78px;
    max-height: 78px;
  }

  .doAndJudge .el-card__body {
    margin-bottom: 20px;
  }
}

.pulse-icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: #2f8;
  position: relative;
  box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.75);
}

.pulse-icon:after {
  content: '';
  box-shadow: 0 0 6px 2px #2f8;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  animation-delay: 1.1s;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  height: 300%;
  width: 300%;
  animation: pulsate 2s infinite;
  position: absolute;
  margin: -100% 0 0 -100%;
}

@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: alpha(opacity=0);
  }

  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }

  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: alpha(opacity=0);
  }
}

.historyAlarm {
  font-size: 14px;
  text-align: right;
  margin-right: 20px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  line-height: 13px;
  color: #1efffc !important;
}

.alarmDevName {
  font-size: 16px;
  font-weight: 400;
  color: #1efffc;
  margin: 10px 0px;
}

.myvedio {
  width: 78px;
  height: 78px;
  background: #fff;
  display: flex;
}

.mytitle {
  font-size: 14px;
  font-weight: 400;
  color: #edf6f7;
  text-align: right;
  position: absolute;
  right: 18px;
}

.titlex {
  font-size: 14px;
  font-weight: 400;
  color: #edf6f7 !important;
}

.myvedio .alarmImg {
  width: 78px;
  height: 78px;
}
</style>
