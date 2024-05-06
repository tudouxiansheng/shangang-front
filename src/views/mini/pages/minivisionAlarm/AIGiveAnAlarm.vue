<template>
  <div class="box">
    <div class="filter-wrapper">
      <el-form label-suffix="：" :inline="true">
        <el-form-item label="告警类型">
          <el-select v-model="algorithmType" placeholder="请选择告警类型" class="box_input">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in algorithmOptionList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警区域">
          <el-select v-model="alarmArea" placeholder="请选择告警区域" class="box_input">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in alarmAreaOptionList" :key="item.id" :label="item.areaName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-radio-group v-model="radio" @change="radioChange" class="box_time_btn">
            <el-radio-button label="近一天"></el-radio-button>
            <el-radio-button label="近三天"></el-radio-button>
            <el-radio-button label="近七天"></el-radio-button>
          </el-radio-group>
          <el-date-picker
            class="box-date-range"
            v-model="timeHorizon"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timeChange"
            :picker-options="pickerOptions0"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="box_btn">
            <el-button type="primary" @click="serchFn">检索</el-button>
            <el-button type="primary" class="box_btn_reset" @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="box_tab">
      <CustomTable
        :data="tableData"
        :total="total"
        layout="total, prev, pager, next, jumper"
        :listQuery="{
          pageSize: pageSize,
          pageNo: currentPage,
        }"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="deviceName" label="告警设备"> </el-table-column>
        <el-table-column prop="alarmSnapUrl" label="告警内容">
          <template slot-scope="scope">
            <img class="alarm-img" :src="scope.row.alarmSnapUrl" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="alarmTime" label="告警时间"> </el-table-column>
        <el-table-column prop="areaName" label="告警区域"> </el-table-column>
        <el-table-column prop="alarmTypeName" label="告警类型"> </el-table-column>
        <el-table-column label="告警处理">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-show="scope.row.confirmState == 0"
              >处理</el-button
            >
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-show="scope.row.confirmState == 1"
              >进行中</el-button
            >
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.confirmState == 2 || scope.row.confirmState == 3"
              >已处理</el-button
            >
          </template>
        </el-table-column>
      </CustomTable>
    </div>
  </div>
</template>

<script>
import { getDIYTime1, formatDateTime } from '@/utils/mutil'
import { AItablistSearch, searchArea } from '@/utils/api'
import CustomTable from '../../../../components/CustomTable'
export default {
  name: 'AIGiveAnAlarm',
  components: {
    CustomTable,
  },
  data() {
    return {
      algorithmOptionList: [
        { label: '人员离岗', value: 'ALARM_STAFF_LEAVE' },
        { label: '人员睡岗', value: 'ALARM_STAFF_SLEEP' },
        { label: '吸烟检测', value: 'ALARM_SMOKE' },
        { label: '安全帽检测', value: 'ALARM_HELMET_DETECT' },
        { label: '走路使用手机检测', value: 'ALARM_USE_PHONE_WHILE_WALKING' },
        { label: '黄烟检测', value: 'ALARM_YELLOW_SMOKE' },
        { label: '水渍检测', value: 'ALARM_WATER_DETECT ' },
        { label: '劳保服穿着检测', value: 'ALARM_WEAR_LABOR_CLOTH ' },
      ], //告警类型下拉菜单数组
      algorithmType: '', //告警类型菜单选中的值
      alarmAreaOptionList: [], //告警区域下拉菜单数组
      alarmArea: '', //告警区域下拉菜单选中的值
      radio: '近一天', //时间按钮选中的值默认为三天
      timeHorizon: [], //选中的时间范围数组
      beginTime: '', //时间数组中的起始时间
      endTime: '', //时间数组中的结束时间
      tableData: [], //表格数据数组
      currentPage: 1, //分页器当前页数
      pageSize: 5, //分页器当前页数
      total: 0, //总条数
      pickerOptions0: {
        //时间限制
        disabledDate(time) {
          return time.getTime() <= Date.now() - 7 * 24 * 60 * 60 * 1000 || time.getTime() >= Date.now()
        },
        cellClassName(data) {
          console.log()
          if (!(data.getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000 && data.getTime() <= Date.now())) {
            console.log('日期', data.getDate())
            return 'el_bgc'
          }
        },
      },
      // defaultTimeArr:["00:00:00", "23:59:59"],//选中的默认时刻
      infoObj: {}, //点击处理获取点击行的数据
    }
  },
  methods: {
    handleGetAIList() {
      this.$api.algorithmList().then((res) => {
        console.log('算法类别', res)
      })
    },
    p(s) {
      return s < 10 ? '0' + s : s
    },
    /* 切换时间按钮点击时触发的函数 */
    radioChange() {
      /* 近三天 */
      if (this.radio == '近一天') {
        this.timeHorizon = getDIYTime1(2)
      } else if (this.radio == '近三天') {
        /* 如果是近三天 */
        this.timeHorizon = getDIYTime1(4)
      } else if (this.radio == '近七天') {
        /*  如果是近七天 */
        this.timeHorizon = getDIYTime1(3)
      }
      this.beginTime = this.time(this.timeHorizon[0]).split(' ')[0] + ' ' + '00:00:00'
      this.endTime = this.time(this.timeHorizon[1]).split(' ')[0] + ' ' + '23:59:59'

      // this.tabListRequest(areaId="",this.beginTime,this.endTime,alarmTypeList=["ALARM_STAFF_LEAVE","ALARM_STAFF_SELEEP","ALARM_SMOKE","ALARM_HELMET_DETECT","ALARM_USE_PHONE_WHILE_WALKING","ALARM_YELLOW_SMOKE","ALARM_WATER_DETECT"])
    },
    /* 时间选择器发生变化时执行 */
    timeChange() {
      this.beginTime = this.timeHorizon[0].split(' ')[0] + ' ' + '00:00:00'
      this.endTime = this.timeHorizon[1].split(' ')[0] + ' ' + '23:59:59'
    },
    /* 时间转换工具函数 */
    time(a) {
      const resDate = a.getFullYear() + '-' + this.p(a.getMonth() + 1) + '-' + this.p(a.getDate())
      const resTime = this.p(a.getHours()) + ':' + this.p(a.getMinutes()) + ':' + this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    /* 切换页数时触发 */
    handleCurrentChange(value) {
      this.currentPage = value
      this.serchFn()
    },
    /* 点击处理 */
    handleClick(value) {
      console.log(value)
      this.$emit('tabfn', value)
      this.$store.commit('closeMoreAlarm', true)
      //告警处理item
      this.$store.commit('alarmItem', value)
      // //打开处理
      this.$store.commit('alarmPage', 1)
    },
    // 表格列表请求
    async tabListRequest(
      areaId = '',
      startTime = '',
      endTime = '',
      alarmTypeList = [
        'ALARM_STAFF_LEAVE',
        'ALARM_STAFF_SELEEP',
        'ALARM_SMOKE',
        'ALARM_HELMET_DETECT',
        'ALARM_USE_PHONE_WHILE_WALKING',
        'ALARM_YELLOW_SMOKE',
        'ALARM_WATER_DETECT',
        'ALARM_WEAR_LABOR_CLOTH',
      ]
    ) {
      await AItablistSearch({
        pageInfo: {
          pageNum: Number(this.currentPage),
          pageSize: this.pageSize,
        },
        areaId,
        startTime,
        endTime,
        alarmTypeList,
      }).then((res) => {
        console.log('请求', res)
        this.tableData = res.resultList
        this.total = res.pageInfo.totalNum
      })
    },
    // 查询当天时间
    getNowTime() {
      const nowTime = new Date()
      const year = nowTime.getFullYear()
      const mounth = nowTime.getMonth() + 1
      const day = nowTime.getDate()
      // this.beginTime = `${year}-${mounth}-${day} 00:00:00`;
      // this.endTime = `${year}-${mounth}-${day} 23:59:59`;
      this.beginTime = this.time(new Date()).split(' ')[0] + ' ' + '00:00:00'
      this.endTime = this.time(new Date()).split(' ')[0] + ' ' + '23:59:59'
    },
    // 检索按钮触发
    serchFn() {
      let alarmTypeList = []
      if (this.algorithmType != '') {
        alarmTypeList.push(this.algorithmType)
      }
      this.tabListRequest(this.alarmArea, this.beginTime, this.endTime, alarmTypeList)
    },
    // 查询区域列表请求
    async searchAreaRequest() {
      const res = await searchArea({})
      console.log('列表', res)
      this.alarmAreaOptionList = res.resultList
    },
    // 重置
    reset() {
      ;(this.algorithmType = ''),
        (this.alarmArea = ''),
        (this.radio = ''),
        (this.timeHorizon = []),
        (this.beginTime = ''),
        (this.endTime = '')
    },
  },
  created() {
    this.getNowTime()
    this.searchAreaRequest()
    this.tabListRequest()
    this.timeHorizon = getDIYTime1(2) //设置默认范围为当天
  },
  watch: {
    // timeHorizon: {后续可优化
    //   handler(newName, oldName) {
    //       let a  = indexOf(  )
    // //    const newTime1 = new Date(newName[0])
    // //    console.log(newTime1);
    //   },
    // },
  },
}
</script>

<style scoped lang="scss">
.alarm-img {
  width: 60px;
  height: 60px;
}
.box-date-range {
  width: 280px;
}
.box_time_btn {
  margin-right: 15px;
}
.box_input {
  width: 200px;
}
.box {
  //margin-top: 27px;
  //margin-right: 36px;
  height: 100%;
  padding-right: 20px;
  .box_tab {
    height: calc(100% - 130px);
  }
}
</style>
