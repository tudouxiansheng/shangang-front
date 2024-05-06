<template>
  <div class="box">
    <div class="filter-wrapper">
      <el-form label-suffix="：" :model="searchInfo" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="告警区域">
              <el-select v-model="searchInfo.deviceId" placeholder="请选择告警区域" class="box_input">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="时间">
              <el-radio-group v-model="searchInfo.timeType" size="medium" @change="radioChange">
                <el-radio-button label="1">近一天</el-radio-button>
                <el-radio-button label="2">近三天</el-radio-button>
                <el-radio-button label="3">近七天</el-radio-button>
              </el-radio-group>
              <el-date-picker
                class="box-date-range"
                v-model="dateValue"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changeDate"
                :picker-options="pickerOptions0"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="告警等级">
              <el-radio-group v-model="searchInfo.alarmLevel">
                <el-radio label="">全部</el-radio>
                <el-radio label="1">非常紧急</el-radio>
                <el-radio label="2">紧急</el-radio>
                <el-radio label="3">一般</el-radio>
                <el-radio label="4">低</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div class="box_btn">
                <el-button type="primary" @click="clickSs">检索</el-button>
                <el-button type="primary" class="box_btn_reset" @click="reset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tables">
      <CustomTable
        :data="tableData"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :list-query="{
          pageSize: searchInfo.pageInfo.pageSize,
          pageNo: searchInfo.pageInfo.pageNum,
        }"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="deviceName" label="告警源名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.deviceName }}
          </template>
        </el-table-column>
        <el-table-column prop="alarmSnapUrl" label="告警抓拍图">
          <template slot-scope="scope">
            <img v-if="scope.row.alarmSnapUrl" :src="scope.row.alarmSnapUrl" class="alarm-img" />

            <img
              v-else
              :src="require('../../../../assets/alarmImg/' + iconSty(scope.row) + '.png')"
              class="alarm-img"
            />
          </template>
        </el-table-column>

        <el-table-column prop="alarmTime" label="告警时间">
          <template slot-scope="scope">
            {{ scope.row.alarmTime }}
          </template>
        </el-table-column>
        <el-table-column prop="alarmLevel" label="告警级别">
          <template slot-scope="scope">
            <div class="alarmLevel" style="color: #ff3333; border: 1px solid #ff3333" v-if="scope.row.alarmLevel == 1">
              非常紧急
            </div>
            <div class="alarmLevel" style="color: #ff4e00; border: 1px solid #ff4e00" v-if="scope.row.alarmLevel == 2">
              紧急
            </div>
            <div class="alarmLevel" style="color: #fa9a3d; border: 1px solid #fa9a3d" v-if="scope.row.alarmLevel == 3">
              一般
            </div>
            <div class="alarmLevel" style="color: #94d73e; border: 1px solid #94d73e" v-if="scope.row.alarmLevel == 4">
              低
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="alarmTypeName" label="告警类型" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="confirmState" label="人工确认状态">
          <template slot-scope="scope">
            <span v-if="scope.row.confirmState == 0">未确认</span>
            <span v-if="scope.row.confirmState == 1">已确认</span>
            <span v-if="scope.row.confirmState == 2">已了结</span>
            <span v-if="scope.row.confirmState == 3">已关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="checkState" label="正误检状态">
          <template slot-scope="scope">
            <span v-if="scope.row.checkState == 0">未检测</span>
            <span v-if="scope.row.checkState == 1">误检</span>
            <span v-if="scope.row.checkState == 2">正检</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="告警确认">
                      <template slot-scope="scope">
                          <el-button v-if="scope.row.confirmState == 0" type="primary" size="small" style="cursor: pointer; background-color: #00ccff" @click="dealAlarm(scope.row)">处理</el-button>
                          <el-button v-else type="warning" @click="detailAlarm(scope.row)">详情</el-button>
                      </template>
                  </el-table-column> -->
      </CustomTable>
    </div>
  </div>
</template>

<script>
import { getDIYTime1, getAllDate } from '@/utils/mutil'
import {
  getGuardList2, //布控任务
  getCameraList,
  getAlarmListNew, //告警列表
  checkAlarmReport, //告警状态确认
  AItablistSearch,
} from '@/utils/api'
import CustomTable from '../../../../components/CustomTable'
export default {
  components: {
    CustomTable,
  },
  data() {
    return {
      levelObj: {},
      alarmTypeObj: {},
      alarmTypeList: [],
      guardList: [],
      options: [],
      data1: false,
      searchInfo: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
        guardId: '',
        timeType: '1',
        beginTime: '',
        endTime: '',
        deviceId: '',
        alarmLevel: '',
      },
      judgeList: [],
      dateValue: [],
      tableData: [],

      checkAll: true,
      isIndeterminate: false,

      number: '10',
      numberList: [10, 20, 30, 40, 50], //每页显示数量,
      total: 0,
      guardHitListInfo: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
        guardName: '',
        guardType: 1,
        repositoryId: '',
        startTime: '',
        endTime: '',
        alarmLevel: '',
        // typeList: ["PERSONNEL_MONITOR_ALARM"]
      },
      dayArray: [],
      pickerOptions0: {
        //时间限制
        disabledDate(time) {
          return time.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000 || time.getTime() > Date.now()
        },
        cellClassName(data) {
          console.log()
          if (!(data.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && data.getTime() < Date.now())) {
            console.log('日期', data.getDate())
            return 'el_bgc'
          }
        },
      },
    }
  },
  async created() {
    this.getNowTime()
    this.searchInfo.timeType = '1'
    this.dateValue = getDIYTime1(2)
    this.date_format()
    this.getCameraTree() //告警区域
    await this.getGuardHitList()
  },
  mounted() {
    this.getGuardHitList()
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
  methods: {
    // 查询当天时间
    getNowTime() {
      const nowTime = new Date()
      const year = nowTime.getFullYear()
      const mounth = nowTime.getMonth() + 1
      const day = nowTime.getDate()
      this.searchInfo.beginTime = `${year}-${mounth}-${day} 00:00:00`
      this.searchInfo.endTime = `${year}-${mounth}-${day} 23:59:59`
    },
    reset() {
      this.searchInfo.guardId = ''
      this.searchInfo.timeType = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.dateValue = []
      this.searchInfo.deviceId = ''
      this.searchInfo.alarmLevel = ''
    },
    getCameraTree() {
      let data = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
        organizationId: 0,
      }
      getCameraList(data).then((res) => {
        if (res.resultCode == 0) {
          var camerList = res.cameraList.map((item, index) => {
            return {
              label: item.cameraName,
              value: item.cameraId,
            }
          })
          this.options = camerList
        }
      })
    },

    async getGuardList1() {
      this.guardHitListInfo.startTime = this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'
      this.guardHitListInfo.endTime = this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'

      let res = await getGuardList2(this.guardHitListInfo)
      if (res.guardList) {
        res.guardList.forEach((item) => {
          this.guardList.push({
            name: item.guardName,
            value: item.guardId,
          })
        })
      }
    },
    //处理告警
    dealAlarm(item) {
      //关闭更多
      this.$store.commit('closeMoreAlarm', true)
      //告警处理item
      this.$store.commit('alarmItem', item)
      //打开处理
      this.$store.commit('alarmPage', 1)
      //告警状态确认
    },
    detailAlarm(item) {
      //关闭更多
      this.$store.commit('closeMoreAlarm', true)
      //打开处理
      this.$store.commit('alarmPage', 3)
    },
    async getGuardHitList() {
      AItablistSearch({
        pageInfo: this.searchInfo.pageInfo,
        areaId: this.searchInfo.deviceId,
        startTime: this.searchInfo.beginTime,
        endTime: this.searchInfo.endTime,
        alarmTypeList: ['PERSONNEL_MONITOR_ALARM'],
        alarmLevel: Number(this.searchInfo.alarmLevel),
      }).then((res) => {
        this.tableData = res.resultList
        this.total = res.pageInfo.totalNum
      })
      // this.tableData = []

      // console.log(this.time(this.dateValue[0]).split(" ")[0], this.time(this.dateValue[1]).split(" ")[0]);
      // let dayArray = getAllDate(this.time(this.dateValue[0]).split(" ")[0], this.time(this.dateValue[1]).split(" ")[0])
      // this.dayArray = dayArray

      // if (dayArray.length < 32) {
      //     for (let i = 0; i < dayArray.length; i++) {
      //         let obj = {
      //             pageInfo: {
      //                 pageNum: this.searchInfo.pageInfo.pageNum,
      //                 pageSize: this.searchInfo.pageInfo.pageSize,
      //             },
      //             searchInfo: {
      //                 beginTime: dayArray[i] + ' 00:00:00',
      //                 endTime: dayArray[i] + ' 23:59:59',
      //                 alarmLevel: this.searchInfo.alarmLevel,
      //                 typeList: ["PERSONNEL_MONITOR_ALARM"],
      //                 devList: []
      //             },
      //         };
      //         if (this.searchInfo.deviceId) {
      //             obj.searchInfo.devList = [{
      //                 devId: this.searchInfo.deviceId
      //             }];
      //         }
      //         console.log(obj,'obj');
      //         let res = await getAlarmListNew(obj);
      //         if (res.resultCode == 0) {
      //             this.tableData = this.tableData.concat(res.alarmList)
      //         }
      //         this.total = this.tableData.length
      //     }

      // } else {
      //     this.$alert('最多只能查询30天的告警')
      //     this.total = 0

      // }

      // if (res.resultCode == 0) {
      //     this.tableData = res.alarmList;
      //     this.total = res.pageInfo.totalNum;
      // }
    },
    // 改变开始时间
    changeDate(val) {
      this.searchForm.timeType = ''
      this.date_format()
    },
    //搜索接口查询
    clickSs() {
      this.getGuardHitList()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      this.getGuardHitList()
    },
    numberChange(data) {
      this.searchInfo.pageInfo.pageSize = data
      this.getGuardHitList()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageInfo.pageNum = val
      this.getGuardHitList()
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    radioChange() {
      // 如果是近1天
      if (this.searchInfo.timeType == '1') {
        this.dateValue = getDIYTime1(2)
      }
      // 如果是近3天
      else if (this.searchInfo.timeType == '2') {
        this.dateValue = getDIYTime1(4)
      }
      // 如果是近7天
      else if (this.searchInfo.timeType == '3') {
        this.dateValue = getDIYTime1(3)
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
      this.guardHitListInfo.startTime = this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'

      this.guardHitListInfo.endTime = this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'
    },
  },
}
</script>

<style lang="scss" scoped>
.alarm-img {
  width: 60px;
  height: 60px;
}
.box-date-range {
  width: 280px;
  margin-left: 20px;
}
.box_time_btn {
  margin-right: 15px;
}
.box_input {
  width: 200px;
}
.box_btn {
  margin-left: 50px;
}
.box {
  //margin-top: 27px;
  //margin-right: 36px;
  height: 100%;
  padding-right: 20px;
  .tables {
    height: calc(100% - 130px);
  }
}
</style>
