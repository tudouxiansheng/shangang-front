<template>
  <!--我的任务-->
  <div class="myTask">
    <div class="myTask-box1">
      <div class="flexColumn">
        <div class="myTask-box1-flex1 myTask-box1-online">
          <div class="task-title-left">
            <img src="../../../../assets/mytask/online.png" />
          </div>
          <div class="task-title-right">
            <span class="task-title-text">设备在离线/个</span>
            <span class="task-num">{{ jsonObject.getDeviceOffline.onLine }}</span>
          </div>
        </div>
        <div class="progress">
          <el-progress
            :stroke-width="26"
            :percentage="
              GetPercent(
                jsonObject.getDeviceOffline.onLine,
                jsonObject.getDeviceOffline.onLine + jsonObject.getDeviceOffline.offLinel
              )
            "
            :show-text="false"
          ></el-progress>
        </div>
        <div class="onOrOutLine">
          <div class="online">
            在线：{{ jsonObject.getDeviceOffline.onLine ? jsonObject.getDeviceOffline.onLine : '0' }}
          </div>
          <div class="outline">离线：{{ jsonObject.getDeviceOffline.offLinel }}</div>
        </div>
      </div>
      <div class="flexColumn">
        <div class="myTask-box1-flex1 myTask-box1-gongdan">
          <div class="task-title-left">
            <img src="../../../../assets/mytask/workOrder.png" />
          </div>
          <div class="task-title-right">
            <span class="task-title-text">工单待处理/件</span>
            <span class="task-num task-gongdan">{{ jsonObject.getWorkSheetDoubleContrast.curDayNum }}</span>
          </div>
        </div>
        <div class="progress">
          <el-progress
            :stroke-width="26"
            :percentage="
              GetPercent(
                jsonObject.getWorkSheetDoubleContrast.lastDayNum,
                jsonObject.getWorkSheetDoubleContrast.curDayNum + jsonObject.getWorkSheetDoubleContrast.lastDayNum
              )
            "
            :show-text="false"
            color="#0FACD5"
          ></el-progress>
        </div>
        <div class="onOrOutLine">
          <div class="online nodeal">昨日待处理：{{ jsonObject.getWorkSheetDoubleContrast.lastDayNum }}</div>
          <div class="outline">今日待处理： {{ jsonObject.getWorkSheetDoubleContrast.curDayNum }}</div>
        </div>
      </div>
      <div class="flexColumn">
        <div class="myTask-box1-flex1 myTask-box1-visitor">
          <div class="task-title-left">
            <img src="../../../../assets/mytask/visitor.png" />
          </div>
          <div class="task-title-right">
            <span class="task-title-text">访客待审核/人</span>
            <span class="task-num task-visit">{{ jsonObject.getVisitorDoubleContrast.curDayNum }}</span>
          </div>
        </div>
        <div class="progress">
          <el-progress
            :stroke-width="26"
            :percentage="
              GetPercent(
                jsonObject.getVisitorDoubleContrast.lastDayNum,
                jsonObject.getVisitorDoubleContrast.lastDayNum + jsonObject.getVisitorDoubleContrast.curDayNum
              )
            "
            :show-text="false"
            color="#F09A33"
          ></el-progress>
        </div>
        <div class="onOrOutLine">
          <div class="online noshenhe">昨日待审核: {{ jsonObject.getVisitorDoubleContrast.lastDayNum }}</div>
          <div class="outline">今日待审核：{{ jsonObject.getVisitorDoubleContrast.curDayNum }}</div>
        </div>
      </div>
      <div class="flexColumn">
        <div class="myTask-box1-flex1 myTask-box1-visitor">
          <div class="task-title-left">
            <img src="../../../../assets/mytask/patrol.png" />
          </div>
          <div class="task-title-right">
            <span class="task-title-text">巡逻任务/件</span>
            <span class="task-num task-patrol">{{ jsonObject.getPatrolDoubleContrast.curDayNum }}</span>
          </div>
        </div>
        <div class="progress">
          <el-progress
            :stroke-width="26"
            :percentage="
              GetPercent(
                jsonObject.getPatrolDoubleContrast.lastDayNum,
                jsonObject.getPatrolDoubleContrast.lastDayNum + jsonObject.getPatrolDoubleContrast.curDayNum
              )
            "
            :show-text="false"
            color="#36CFC9"
          ></el-progress>
        </div>
        <div class="onOrOutLine">
          <div class="online nopatrol">昨日待巡逻：{{ jsonObject.getPatrolDoubleContrast.lastDayNum }}</div>
          <div class="outline">今日待巡逻： {{ jsonObject.getPatrolDoubleContrast.curDayNum }}</div>
        </div>
      </div>
    </div>
    <div class="myTask-box2">
      <div class="alarmflex1">
        <div class="titlefirst">工单类型占比</div>
        <div id="gongdan"></div>
      </div>
      <div class="alarmflex2">
        <div class="topItem">
          <div class="titleName">工单数量</div>
          <div class="timeSelect">
            <div :class="[timeSelect == '1' ? 'bluebg' : '', 'fx1']" @click="clickTime('1')">天</div>
            <div :class="[timeSelect == '2' ? 'bluebg' : '', 'fx1']" @click="clickTime('2')">周</div>
            <div :class="[timeSelect == '3' ? 'bluebg' : '', 'fx1']" @click="clickTime('3')">月</div>
          </div>
        </div>
        <div id="numWrapper"></div>
      </div>
      <div class="alarmflex1">
        <div class="titlefirst">告警类型排行榜</div>
        <div class="topName">
          <div class="sort"></div>
          <div class="name">类型</div>
          <div class="name">级别</div>
          <div class="name">数量</div>
          <div class="name">趋势</div>
        </div>
        <div class="getAlarmRank" v-for="(item, index) in getAlarmRank" :key="index">
          <div class="sort" v-if="index == 0">
            <img src="../../../../assets/mytask/1.png" />
          </div>
          <div class="sort" v-if="index == 1">
            <img src="../../../../assets/mytask/2.png" />
          </div>
          <div class="sort" v-if="index == 2">
            <img src="../../../../assets/mytask/3.png" />
          </div>
          <div class="sort" v-if="index > 2">{{ index + 1 }}</div>
          <div class="rank">{{ item.alarmTypeName }}</div>
          <div
            :class="[
              item.alarmLevel == '1'
                ? 'danger1'
                : item.alarmLevel == '2'
                ? 'littledanger1'
                : item.alarmLevel == '3'
                ? 'warn1'
                : item.alarmLevel == '4'
                ? 'success1'
                : '',
              ,
            ]"
          >
            {{ countLevel(item.alarmLevel) }}
          </div>
          <div class="rank">{{ item.alarmNum }}</div>
          <div class="rank">
            <img src="../../../../assets/mytask/up.png" v-if="item.alarmTrend == '上升'" />
            <img src="../../../../assets/mytask/down.png" v-if="item.alarmTrend == '下降'" />
          </div>
        </div>
      </div>
    </div>
    <div class="myTask-box3">
      <div class="anpaiflex1 mg20 boxitem">
        <div class="flexColWrapper">
          <div class="anpai">日程安排({{ now }})</div>
          <div class="addRoute" @click="addRoute">
            <img src="../../../../assets/mytask/add.png" class="add" />
            <span class="addcolor">添加日程安排</span>
          </div>
        </div>
        <div class="flexrowWrapper">
          <div class="leftCalc">
            <calendar @taskList="taskList" @noTask="noTask" ref="calendarday" @clickDay="clickMyday"></calendar>
          </div>
          <div class="line"></div>
          <div class="rightCalc" v-if="noricheng">
            <img src="../../../../assets/mytask/noricheng.png" class="noimg" />
            <div class="textWhite">暂无日常安排</div>
          </div>
          <div class="rightCalc" v-else>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.scheduleTime"
                color="#00ccff"
              >
                <div style="display: flex">
                  <input class="timeline-name" v-model="activity.scheduleValue" />
                  <div style="float: right; margin-left: 10px">
                    <i class="el-icon-check" @click="editRoutes(index)"></i>
                    <i class="el-icon-close" @click="closeRoutes(index)"></i>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>

      <!--遮罩层-->
      <div class="masking" v-show="dialogVisible">
        <div class="boxItem">
          <div class="closeItem">
            <div class="newRoute">新建日程</div>
            <i class="el-icon-close" style="color: white; cursor: pointer" @click="closeWrapper"></i>
          </div>
          <el-form class="elform">
            <el-form-item label="日程名称：">
              <el-input v-model="route.name" style="width: 173px" clearable></el-input>
            </el-form-item>
            <el-form-item label="日程时间：" v-if="route.time == ''">
              <el-date-picker
                type="datetime"
                placeholder="请选择日程时间"
                v-model="route.time"
                style="width: 173px"
                default-time="08:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="日程时间：" v-else>
              <el-date-picker
                type="datetime"
                placeholder="请选择日程时间"
                v-model="route.time"
                style="width: 173px"
                default-time="08:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div class="bottomBtn">
            <div class="common cancel" @click="cancelMyROute">取消</div>
            <div class="common" @click="sureAddMyRoute">确定</div>
          </div>
        </div>
      </div>

      <div class="anpaiflex1">
        <div class="titlenotice">宣传公告</div>
        <div class="noticeWrapper">
          <vue-seamless-scroll :data="announceList" class="seamless-warp2" :class-option="classOption">
            <ul class="itemIndex" v-for="(item, index) in announceList" :key="index">
              <li class="itemnotice">
                <div class="noticeContent" v-html="html_decode(item.noticeContent)"></div>
                <div class="updateTime">{{ item.updateTime }}</div>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
        <div class="moreNotice" @click="ToNotice">查看更多 >></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  noticeList,
  getMyTaskList,
  addRoutes,
  /*新增日程 */
  modifyRoutes,
  /*修改日程 */
  getOneDayRoute,
  /*查询某一天任务列表 */
  getRouteListsDate,
  /*获取一个月中有哪些天有任务 */
  getGongdanData,
  /*查询工单柱状图 */
  /*删除日程 */
  deleteRoutes,
  getLoginUserInfo,
} from '@/utils/api'
import { getdays, getShortDay } from '@/utils/mutil'
import calendar from './components/calendar.vue'

export default {
  data() {
    return {
      timeSelect: '2',
      announceList: [],
      classOption: {
        step: 0.5, //滚动快慢
      },
      dialogVisible: false,
      route: {
        name: '',
        time: '',
      },
      jsonObject: {
        getDeviceOffline: {
          onLine: 0,
          offLinel: 0,
        },
        getWorkSheetDoubleContrast: {
          curDayNum: 0,
          lastDayNum: 0,
        },
        getVisitorDoubleContrast: {
          curDayNum: 0,
          lastDayNum: 0,
        },
        getPatrolDoubleContrast: {
          curDayNum: 0,
          lastDayNum: 0,
        },
      },
      gongdanTime: {
        startTime: '',
        endTime: '',
      },
      noricheng: true, //是否有日程安排
      activities: [],
      getAlarmRank: [], //告警级别
      getWorkOrderProportion: [], //饼图
    }
  },
  components: {
    calendar,
  },
  mounted() {
    this.getMyTaskList()
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    this.getGnum()
    this.getNounceList()
  },
  beforeDestroy() {
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
  },
  computed: {
    now: function () {
      return getShortDay(new Date().valueOf())
    },
  },
  methods: {
    countLevel(level) {
      switch (level) {
        case 1:
          return '非常紧急'
        case 2:
          return '紧急'
        case 3:
          return '一般'
        case 4:
          return '低'
        default:
          return '未知'
      }
    },
    //webSocket
    handleWebSocketMessage(redata) {
      if (redata.type == 'ws_mytask') {
        console.log(redata)
        // let myTaskData = JSON.parse(Base64.decode(redata.content));
        this.getMyTaskList()
      }
    },
    html_decode(str) {
      var s = ''
      //console.log(str)
      if (str.length == 0) return ''
      s = str.replace(/&amp;/g, '&')
      s = s.replace(/&lt;/g, '<')
      s = s.replace(/&gt;/g, '>')
      s = s.replace(/&nbsp;/g, ' ')
      s = s.replace(/&#39;/g, "'")
      s = s.replace(/&quot;/g, '"')
      s = s.replace(/<br\/>/g, '\n')
      return s
    },

    //到宣传公道
    ToNotice() {
      this.$router.push({
        path: '/enivpage',
      })
    },
    //任务列表
    taskList(taskList) {
      this.noricheng = false
      this.activities = taskList
    },
    noTask() {
      this.noricheng = true
    },
    //确定添加我的任务
    sureAddMyRoute() {
      addRoutes({
        scheduleTime: this.route.time,
        scheduleValue: this.route.name,
        userId: sessionStorage.getItem('account'),
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          this.dialogVisible = false
          this.$success('添加成功')
          this.$refs.calendarday.selectDayfunc(this.route.time)
        }
      })
    },
    //百分比
    GetPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.0
    },
    getMyTaskList() {
      getMyTaskList({
        oneDay: getdays(0),
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          this.jsonObject = res.jsonObject
          if (res.jsonObject.getAlarmRank.length > 0) {
            this.getAlarmRank = res.jsonObject.getAlarmRank
          }
          if (res.jsonObject.getWorkOrderProportion.length > 0) {
            this.getWorkOrderProportion = res.jsonObject.getWorkOrderProportion
            this.getGongdan()
          }
        }
      })
    },
    //工单类型
    getGongdan() {
      let barChart = this.$echarts.init(document.getElementById('gongdan'))
      let data = this.getWorkOrderProportion
      console.log(data, 'datadssadsa')
      let dataName = data.map((item) => {
        return item.name
      })
      console.log(dataName, data, 'data')
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: (e) => {
            return `${e.data.name}: ${e.data.value}%`
          },
        },
        legend: {
          top: 'bottom',
          orient: 'vertical',
          left: '75%',
          y: 'center',
          data: dataName,
          textStyle: {
            color: '#ffffff',
          },
          formatter: function (name) {
            return name
          },
        },
        color: ['#2691ff', '#FF625B', '#14C2C3 ', '#FEC400 ', '#fff100'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: [50, 90],
            center: ['40%', '45%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            data: data,
          },
        ],
      }
      barChart.setOption(option)
    },
    //工单日期
    clickTime(time) {
      this.timeSelect = time
      if (time == 1) {
        this.gongdanTime.startTime = getdays(0) + ' 00:00:00'
        this.gongdanTime.endTime = getdays(0) + ' 23:59:59'
      } else if (time == 2) {
        this.gongdanTime.startTime = getdays(-7) + ' 00:00:00'
        this.gongdanTime.endTime = getdays(0) + ' 23:59:59'
      } else {
        this.gongdanTime.startTime = getdays(-31) + ' 00:00:00'
        this.gongdanTime.endTime = getdays(0) + ' 23:59:59'
      }
      this.getGnum()
    },
    //工单数量
    getGnum() {
      let barChart = this.$echarts.init(document.getElementById('numWrapper'))
      barChart.clear()
      let data = {
        statType: this.timeSelect == '1' ? 'H' : 'D',
        startTime: this.gongdanTime.startTime ? this.gongdanTime.startTime : getdays(-7) + ' 00:00:00',
        endTime: this.gongdanTime.endTime ? this.gongdanTime.endTime : getdays(0) + ' 23:59:59',
      }
      getGongdanData(data).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          let xdata = res.workOrderHistogramList.map((item) => {
            return item.name
          })
          let ydata = res.workOrderHistogramList.map((item) => {
            return item.value
          })

          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            grid: {
              left: '3%',
              right: '6%',
              bottom: '3%',
              containLabel: true,
            },
            // dataZoom: {
            //     start: 80,
            //     type: "inside"
            // },
            xAxis: [
              {
                type: 'category',
                data: xdata,
                name: '日期',
                nameTextStyle: {
                  color: '#A6B6C6 ',
                },
                axisLine: {
                  //这是y轴文字颜色
                  lineStyle: {
                    color: '#A6B6C6 ',
                  },
                },
                axisTick: {
                  //隐藏刻度
                  alignWithLabel: true,
                  show: false,
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
                // minInterval: 1,

                name: '个',
                nameTextStyle: {
                  color: '#A6B6C6 ',
                },
                axisLine: {
                  //这是y轴文字颜色
                  lineStyle: {
                    color: '#A6B6C6 ',
                  },
                },
                axisTick: {
                  show: false,
                },
              },
            ],
            series: [
              {
                type: 'bar',
                showBackground: false,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 1,
                      color: '#158DFD',
                    },
                    {
                      offset: 0,
                      color: '#69C5FF',
                    },
                  ]),
                },
                barMaxWidth: 20, //最大宽度

                data: ydata,
              },
            ],
            dateZoom: [
              {
                type: 'inside',
                start: 0,
                // 最大的放大是图形的2%
                maxSpan: 2,
              },
            ],
          }
          barChart.setOption(option)
          window.addEventListener('resize', function () {
            barChart.resize() //barChart指自己定义的echartsDom对象
          })
        }
      })
    },
    //宣传
    getNounceList() {
      let data = {
        noticeTitle: '',
        startTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
      }

      noticeList(data).then((res) => {
        if (res.resultCode == 0) {
          this.announceList = res.noticeInfoList
        }
      })
    },
    //添加日程
    addRoute() {
      console.log('添加日程')
      this.dialogVisible = true
      console.log(this.dialogVisible)
    },
    closeWrapper() {
      console.log('关闭')
      this.dialogVisible = false
      this.route.name = ''
      this.route.time = ''
    },
    cancelMyROute() {
      this.dialogVisible = false
      this.route.name = ''
      this.route.time = ''
    },
    clickMyday(time) {
      this.route.time = time
    },
    //编辑日程
    editRoutes(index) {
      modifyRoutes(this.activities[index]).then((res) => {
        if (res.resultCode == 0) {
          this.$success('修改成功')
        }
      })
      console.log(index, this.activities[index])
    },
    //删除日程
    closeRoutes(index) {
      console.log(index, 'index', this.activities[index])
      deleteRoutes({
        id: this.activities[index].id,
      }).then((res) => {
        if (res.resultCode == 0) {
          this.$success('删除成功')
          if (this.activities.length > 0) {
            getOneDayRoute({
              scheduleDay: this.activities[index].scheduleTime.slice(0, 10),
            }).then((res) => {
              if (res.resultCode == 0) {
                console.log(res, 'res')
                if (res.schedulesInfoList.length > 0) {
                  this.activities = res.schedulesInfoList
                } else {
                  this.activities = []
                }
              }
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
.myTask {
  width: 80%;
  height: 860px;
  display: flex;
  align-items: center;
  transform: translate(-50%, -50%);
  margin-left: 50%;
  position: absolute;
  top: 55%;
  background: rgba(12, 25, 44, 0.4);
  border-radius: 8px;
  flex-direction: column;
  padding-top: 20px;
  z-index: 9999;
  font-size: 16px;
  .el-input__inner {
    border: 1px solid #ffffff;
  }

  /*第一列 */
  .myTask-box1 {
    display: flex;
    width: 100%;
    padding-left: 20px;

    .flexColumn {
      display: flex;
      flex-direction: column;
      flex: 1;
      background: rgba(12, 25, 44, 0.8);
      margin-right: 20px;
      display: flex;
      padding: 20px;
      border-radius: 8px;

      .myTask-box1-flex1 {
        display: flex;

        .task-title-right {
          display: flex;
          flex-direction: column;
          margin-left: 20px;

          .task-title-text {
            color: #ffffff;
          }

          .task-num {
            font-size: 24px;
            font-weight: bold;
            color: #3a8fea;
          }

          .task-patrol {
            color: #36cfc9;
          }

          .task-visit {
            color: #f09a33;
          }

          .task-gongdan {
            color: #0facd5;
          }
        }
      }

      .progress {
        width: 100%;
        height: 10px;
        margin-top: 20px;

        .el-progress-bar__outer {
          height: 10px !important;
        }
      }

      .onOrOutLine {
        display: flex;
        justify-content: space-between;
        margin-top: 11px;

        .online {
          color: #3a8fea;
          font-size: 14px;
        }

        .outline {
          font-size: 14px;
          color: #778ca2;
        }

        .nodeal {
          color: #0facd5;
        }

        .noshenhe {
          color: #f09a33;
        }

        .nopatrol {
          color: #36cfc9;
        }
      }
    }
  }

  .myTask-box2 {
    display: flex;
    width: 100%;
    margin-top: 20px;
    padding-left: 20px;

    .alarmflex1 {
      width: 358px;
      background: rgba(12, 25, 44, 0.7);
      margin-right: 20px;
      height: 300px;
      border-radius: 8px;
      padding: 20px;

      .titlefirst {
        color: #ffffff;
      }

      .topName {
        width: 100%;
        height: 30px;
        margin-top: 21px;
        background: #26394e;
        display: flex;
        line-height: 30px;

        .name {
          color: #ffffff;
          flex: 1;
          text-align: center;
        }
      }

      .getAlarmRank {
        display: flex;
        line-height: 42px;
        font-size: 14px;
      }

      .sort {
        display: flex;
        align-items: center;
        color: white;
        justify-content: center;
        width: 20px;
      }

      .rank {
        color: #ffffff;
        flex: 1;
        text-align: center;
        overflow: hidden;
      }

      .danger1 {
        color: #ff2f2f;
        font-size: 14px;
        flex: 1;
        text-align: center;
      }

      .littledanger1 {
        color: #ff602f;
        font-size: 14px;
      }

      .warn1 {
        color: #ffda2f;
        font-size: 14px;
        flex: 1;
        text-align: center;
      }

      .success1 {
        color: #ff872f;
        font-size: 14px;
        flex: 1;
        text-align: center;
      }
    }
  }

  .alarmflex2 {
    flex: 2;
    background: rgba(12, 25, 44, 0.7);
    margin-right: 20px;
    height: 300px;
    border-radius: 8px;
    padding: 20px;

    .topItem {
      display: flex;
      justify-content: space-between;

      .titleName {
        color: white;
      }

      .timeSelect {
        width: 180px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        border: 1px solid #3e5670;
        color: white;
        display: flex;

        .fx1 {
          flex: 1;
          text-align: center;
          cursor: pointer;
        }

        .bluebg {
          background: #3a8fea;
        }
      }
    }

    #numWrapper {
      height: calc(100% - 30px);
      width: 100%;
      margin-top: 2px;
    }
  }

  #gongdan {
    width: 320px;
    height: 255px;
  }
}

.myTask-box3 {
  display: flex;
  width: 100%;
  padding: 20px;
  height: 350px;
  font-size: 16px;
  .anpai {
    color: #ffffff;
  }

  .masking {
    width: calc(50% - 25px);
    height: 311px;
    position: absolute;
    background: rgba(12, 25, 44, 0.8);
    padding: 20px;
    z-index: 1000;

    i {
      font-size: 18px;
    }

    .boxItem {
      width: 300px;
      height: 200px;
      border-radius: 8px;
      background: #3e577c;
      position: absolute;
      left: 50%;
      margin-left: -150px;
      top: 50px;
      padding: 10px;
    }

    .closeItem {
      display: flex;
      justify-content: space-between;

      .newRoute {
        color: white;
        font-size: 16px;
      }
    }

    .elform {
      margin-top: 10px;
    }

    .bottomBtn {
      display: flex;
      justify-content: center;
      align-items: center;

      .common {
        width: 60px;
        height: 30px;
        background: #00ccff;
        color: white;
        line-height: 30px;
        border-radius: 8px;
        text-align: center;
        cursor: pointer;
      }

      .cancel {
        background: #b3b3b3;
        margin-right: 15px;
      }
    }
  }

  .anpaiflex1 {
    flex: 1;
    padding: 20px;
    background: rgba(12, 25, 44, 0.8);
    border-radius: 8px;
    position: relative;

    .addRoute {
      position: absolute;
      right: 19px;
      top: 20px;
      cursor: pointer;

      .add {
        vertical-align: middle;
        width: 14px;
      }

      .addcolor {
        color: #00ccff;
        margin-left: 5px;
      }
    }

    .titlenotice {
      color: white;
    }

    .noticeWrapper {
      margin-top: 20px;

      .itemnotice {
        display: flex;
        justify-content: space-between;
        color: white;
        cursor: pointer;

        .noticeContent {
          max-width: 350px;
          white-space: nowrap;
          /*文本不会换行，在同一行显示*/
          overflow: hidden;
          /*超出隐藏 */
          text-overflow: ellipsis;
          /*省略号显示*/
        }
      }

      .seamless-warp2 {
        height: 220px;
        overflow: hidden;

        .itemIndex {
          margin-bottom: 20px;
        }
      }
    }

    .moreNotice {
      margin-top: 5px;
      color: #00ccff;
      cursor: pointer;
      text-align: right;
    }
  }

  .boxitem {
    margin-right: 20px;
    display: flex;
    flex-direction: column;

    .flexrowWrapper {
      display: flex;
      height: calc(100% - 20px);
      margin-top: 10px;
      position: relative;

      .el-timeline-item__content {
        color: #ffffff;
      }

      .el-timeline-item__timestamp {
        color: #ffffff;
      }

      .leftCalc {
        flex: 1;
      }

      .line {
        margin-left: 30px;
        width: 1px;
        background: #3e5670;
        height: 230px;
        position: absolute;
        bottom: 0;
        left: 50%;
      }

      .rightCalc {
        flex: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .textWhite {
          color: #a6b6c6;
          margin-top: 5px;
        }

        .noimg {
          width: 110px;
          height: 98px;
        }

        .addRoute {
          .addcolor {
            color: #ffffff;
          }
        }

        .timeline-name {
          max-width: 150px;
          overflow-x: hidden;
        }
      }
    }
  }
}
</style>
