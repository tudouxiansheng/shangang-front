<template>
  <div class="screen">
    <div id="personAlarm">
      <div class="main">
        <div class="bg">
          <div class="inputTitle">
            <div class="block" style="justify-content: flex-start; flex: 1">
              <span class="name" style="margin-left: 29px; margin-right: 2px"
                >时间：</span
              >
              <el-radio-group
                v-model="searchInfo.timeType"
                size="medium"
                @change="radioChange"
              >
                <el-radio-button label="1">近三天</el-radio-button>
                <el-radio-button label="2">近七天</el-radio-button>
                <el-radio-button label="3">近一月</el-radio-button>
              </el-radio-group>
            </div>
            <div class="block" style="justify-content: flex-start; flex: 1">
              <el-date-picker
                style="width: 352px; margin-left: 22px"
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate"
              ></el-date-picker>
            </div>
            <div class="kong" style="flex: 1"></div>
          </div>
          <div style="display: flex; margin-top: 33px">
            <div class="block">
              <span class="name">告警类型：</span>
              <el-select
                v-model="searchInfo.searchInfo.value"
                clearable
                filterable
                placeholder="请选择告警类型"
                style="width: 340px"
                @change="changeSelectOptions"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div style="margin-left: 100px">
              <span class="name">告警等级：</span>
              <el-radio v-model="searchInfo.alarmLevels1" label="0">
                全部
              </el-radio>
              <el-radio v-model="searchInfo.alarmLevels1" label="1"
                >非常紧急</el-radio
              >
              <el-radio v-model="searchInfo.alarmLevels1" label="2"
                >紧急</el-radio
              >
              <el-radio v-model="searchInfo.alarmLevels1" label="3"
                >一般</el-radio
              >
              <el-radio v-model="searchInfo.alarmLevels1" label="4"
                >低</el-radio
              >
            </div>
          </div>

          <div class="block" style="margin: 40px auto; width: 400px">
            <el-button
              type="primary"
              class="btnPrimary"
              style="margin-right: 40px"
              @click="clickSs"
              >搜<span style="display: inline-block; width: 12px"></span
              >索</el-button
            >
            <el-button type="primary" class="btnPrimary btnReset"
              >重<span style="display: inline-block; width: 12px"></span
              >置</el-button
            >
          </div>
          <div class="tables" style="width: 90%">
            <el-table
              row-class-name="table-cell"
              header-row-class-name="table-cell"
              :data="tableData"
              style="width: 100%"
              max-height="320px"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="alarmDevName"
                label="告警源名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.alarmDevName }}
                </template>
              </el-table-column>
              <el-table-column
                prop="alarmDevName"
                label="告警类型"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.alarmTypeName }}
                </template>
              </el-table-column>

              <el-table-column prop="address" label="告警内容">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.alarmSnapUrl"
                    :src="scope.row.alarmSnapUrl"
                    style="width: 60px; height: 60px; background: #313131"
                  />
                  <img
                    v-else
                    style="width: 60px; height: 60px; background: #313131"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="alarmTime" label="告警时间">
                <template slot-scope="scope">
                  {{ scope.row.alarmTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="alarmLevel"
                label="告警级别"
                min-width="45"
              >
                <template slot-scope="scope">
                  <div
                    class="alarmLevel"
                    style="color: #ff3333; border: 1px solid #ff3333"
                    v-if="scope.row.alarmLevel == 1"
                  >
                    非常紧急
                  </div>
                  <div
                    class="alarmLevel"
                    style="color: #ff4e00; border: 1px solid #ff4e00"
                    v-if="scope.row.alarmLevel == 2"
                  >
                    紧急
                  </div>
                  <div
                    class="alarmLevel"
                    style="color: #fa9a3d; border: 1px solid #fa9a3d"
                    v-if="scope.row.alarmLevel == 3"
                  >
                    一般
                  </div>
                  <div
                    class="alarmLevel"
                    style="color: #94d73e; border: 1px solid #94d73e"
                    v-if="scope.row.alarmLevel == 4"
                  >
                    低
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="propertyCompany" label="告警状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.confirmState == 0">未处理</div>
                  <div v-if="scope.row.confirmState == 1">已处理</div>
                  <div v-if="scope.row.confirmState == 2">已清除</div>
                  <div v-if="scope.row.confirmState == 3">已恢复</div>
                </template>
              </el-table-column>
              <el-table-column label="告警确认">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.confirmState == 0"
                    type="primary"
                    size="small"
                    style="cursor: pointer; background-color: #00ccff"
                    @click="dealAlarm(scope.row)"
                    >处理</el-button
                  >
                  <el-button
                    v-else
                    type="warning"
                    @click="detailAlarm(scope.row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table">
            <div class="pagination" style="margin-top: 30px">
              <div class="paging"></div>
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="searchInfo.pageInfo.pageNum"
                :page-size="searchInfo.pageInfo.pageSize"
                background
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDIYTime1, formatDateTime } from '@/utils/mutil'
import {
  queryAlarmTypes, //告警类型查询（下拉列表）
  getAlarmList1, //查询
  getCameraList,
} from '@/utils/api'

export default {
  data() {
    return {
      levelObj: {},
      alarmTypeObj: {},
      alarmTypeList: [],
      guardList: [],
      options: [
        {
          label: '越线检测',
          value: 'ALARM_CROSS_LINE_DETECTION',
        },
        {
          label: '物品移走检测',
          value: 'ALARM_ARTICLE_REMOVAL_DETECTION',
        },
        {
          label: '方向检测',
          value: 'ALARM_DIRECTION_DETECTION',
        },
        {
          label: '路径检测',
          value: 'ALARM_PATH_DETECTION',
        },
        {
          label: '速度异常检测',
          value: 'ALARM_ABNORMAL_SPEED_DETECTION',
        },
        {
          label: '区域闯入预警',
          value: 'ALARM_REGION_INVASION',
        },
        {
          label: '区域徘徊/滞留',
          value: 'ALARM_REGION_WANDERING',
        },
        {
          label: '物品遗留',
          value: 'ALARM_COMMODITY_LEFT',
        },
      ],
      data1: false,
      socialResourcesList: [],
      socialResourcesListCopy: [],

      searchInfo: {
        timeType: '1',
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        searchInfo: {
          beginTime: formatDateTime(new Date()).substring(0, 10) + ' 00:00:00',
          endTime: formatDateTime(new Date()).substring(0, 10) + ' 23:59:59',
          typeList: [
            'ALARM_CROSS_LINE_DETECTION',
            'ALARM_ARTICLE_REMOVAL_DETECTION',
            'ALARM_DIRECTION_DETECTION',
            'ALARM_PATH_DETECTION',
            'ALARM_ABNORMAL_SPEED_DETECTION',
            'ALARM_REGION_INVASION',
            'ALARM_REGION_WANDERING',
            'ALARM_COMMODITY_LEFT',
          ],
          value: '',
        },
      },
      judgeList: [],
      dateValue: [],
      tableData: [],

      checkAll: true,
      isIndeterminate: false,
      number: '10',
      numberList: [10, 20, 30, 40, 50], //每页显示数量,
      total: 0,
    }
  },
  async created() {
    this.searchInfo.timeType = '1'
    this.dateValue = getDIYTime1(4)
    this.date_format()
    this.getCameraList()
    await this.queryAlarmTypes()
    await this.getAlarmList1()
  },
  mounted() {
    this.getAlarmList1()
  },
  methods: {
    getCameraList() {
      let data = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
        organizationId: 0,
      }
    },

    async queryAlarmTypes() {
      let res = await queryAlarmTypes({})
      console.log('queryAlarmTypes', res)
      res.alarmTypeList.forEach((item) => {
        this.alarmTypeList.push({
          typeCodes: item.alarmType,
          alarmName: item.alarmName,
        })
      })
      this.alarmTypeObj = {}
      if (this.alarmTypeList && this.alarmTypeList.length > 0) {
        this.alarmTypeList.forEach((item) => {
          this.alarmTypeObj[item.typeCodes] = item.alarmName
        })
      }
      console.log('this.alarmTypeList', this.alarmTypeList)
    },

    async getAlarmList1() {
      let res = await getAlarmList1(this.searchInfo)
      if (res.resultCode == 0) {
        this.tableData = res.alarmList
        this.total = res.pageInfo.totalNum
      }
    },
    //搜索接口查询
    clickSs() {
      this.getAlarmList1()
    },
    getDetail() {},
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    numberChange(data) {
      this.searchInfo.pageInfo.pageSize = data
      this.getAlarmList1()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageInfo.pageNum = val
      this.getAlarmList1()
    },
    handleCheckAllChange(val) {
      console.log('val12345', val)
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      console.log('12221', value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
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
      this.searchInfo.searchInfo.beginTime =
        this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'
      this.searchInfo.searchInfo.endTime =
        this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'
      //this.date_format();
    },
    // 日期格式处理
    p(s) {
      return s < 10 ? '0' + s : s
    },
    time(a) {
      const resDate =
        a.getFullYear() +
        '-' +
        this.p(a.getMonth() + 1) +
        '-' +
        this.p(a.getDate())
      const resTime =
        this.p(a.getHours()) +
        ':' +
        this.p(a.getMinutes()) +
        ':' +
        this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    date_format() {
      this.searchInfo.searchInfo.beginTime =
        this.time(this.dateValue[1]).split(' ')[0] + ' ' + '00:00:00'
      this.searchInfo.searchInfo.endTime =
        this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'
    },

    // 改变开始时间
    changeDate(val) {
      console.log(val)
      this.searchInfo.timeType = ''
      this.date_format()
    },
    changeSelectOptions() {
      this.searchInfo.searchInfo.typeList = [this.searchInfo.searchInfo.value]
    },
    //处理告警
    dealAlarm(item) {
      //关闭更多
      this.$store.commit('closeMoreAlarm', true)
      //告警处理item
      this.$store.commit('alarmItem', item)
      //打开处理
      this.$store.commit('alarmPage', 1)
    },
  },
}
</script>
<style lang="scss" scoped>
#personAlarm {
  width: 100%;
  min-height: calc(100vh - 70px);
  .el-table {
    background: transparent;
  }
  .alarmLevel {
    height: 26px;
    border-radius: 4px;
    text-align: center;
    // color: #ff3333;
    // border: 1px solid #ff3333;
  }
  ::-webkit-scrollbar-track {
    background-color: #1e2c45 !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #1efffc !important;
    border-radius: 2px;
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
  .el-table tr {
    background: transparent;
    height: 36px;
    color: #fff;
    padding: 0;
  }
  .el-table td {
    background: transparent;
    border-bottom: 1px solid #4a79a5 !important;
    height: 80px;
    color: #fff;
    font-size: 14px;
    padding: 0;
  }
  .el-table th {
    background: rgba(0, 204, 255, 0.2);
    color: #fff;
    font-size: 14px;
    padding: 0;
    border: none !important;
  }

  //新增研判
  .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border-color: #7ea5c9;
    width: 113px;
    height: 32px;
    line-height: 10px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #00ccff;
    border-color: #00ccff;
  }
  .el-range-input {
    background: transparent;
    color: #fefefe;
  }
  .el-range-editor--small .el-range-separator {
    line-height: 32px;
    font-size: 13px;
  }
  .el-date-editor .el-range-separator {
    color: #fefefe;
  }
  .el-radio {
    color: #ccc;
    cursor: pointer;
    margin-right: 20px;
  }
  .el-radio__inner {
    background: transparent;
  }

  .el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #edf6f7;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #00ccff;
    border-color: #00ccff;
  }
  //table
  .el-table {
    background: transparent;
  }
  .el-table td,
  .el-table th,
  .el-table tr {
    border-collapse: collapse;
    border-bottom: none;
    border-left: none;
    border-right: 0px solid #156c9e !important;
    border-top: 0px solid #156c9e !important;
  }
  .el-table tr {
    background: transparent;
    height: 36px;
    color: #fff;
    padding: 0;
  }
  .el-table td {
    background: transparent;
    border-bottom: 1px solid #4a79a5 !important;
    height: 80px;
    color: #fff;
    font-size: 14px;
    padding: 0;
  }
  .el-table th {
    background: rgba(0, 204, 255, 0.2);
    color: #fff;
    font-size: 14px;
    padding: 0;
    border: none !important;
  }
  .el-table::before {
    background: none;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  .el-table__empty-block {
    background: transparent;
    border: 1px solid #156c9e;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-tabs__header .el-tabs__item {
    background: transparent !important;
  }
  .el-tabs__item {
    color: #fefefe;
  }
  .el-tabs__item.is-active {
    color: #1efffc;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__active-bar {
    background-color: #1efffc;
  }
  .el-tabs__nav-scroll {
    padding-left: 0px;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
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
    padding-top: 1px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    // background-color: #409EFF;
    background-color: #00ccff !important;
    border-color: #00ccff !important;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 8px 0 0 8px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 8px 8px 0;
  }

  .main {
    width: 100%;
    min-height: 700px;
    height: 700px;
    //   height: calc(100vh - 70px);
    position: relative;

    .bg {
      pointer-events: auto;
      position: absolute;
      width: 1480px;
      height: 100%;
      margin-top: 55px;
      .inputTitle {
        display: flex;
        margin-top: 74px;
      }
      .name {
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #edf6f7;
        line-height: 36px;
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
      .btnReset {
        width: 160px;
        height: 40px;
        background: transparent;
        border: 1px solid #b5bdbf;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
      .table {
        .el-input__inner {
          height: 30px;
          color: #fff;
          border: 1px solid #fff !important;
        }
      }
    }
  }
}
.el-pagination__total {
  color: white !important;
}
.el-pagination__jump {
  color: white !important;
}
</style>
