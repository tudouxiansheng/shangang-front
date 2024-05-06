<template>
  <div class="screen">
    <div id="carAlarm22">
      <div class="main">
        <div class="bg">
          <i class="el-icon-close closeItem" @click="toList"></i>
          <el-form v-model="searchInfo" inline>
            <el-form-item :label="$t('public.period')">
              <el-radio-group v-model="searchInfo.timeType" size="small" @change="radioChange">
                <el-radio-button label="1">{{ $t('public.threeDay') }}</el-radio-button>
                <el-radio-button label="2">{{ $t('public.sevenDay') }}</el-radio-button>
                <el-radio-button label="3">{{ $t('public.nearlyMonth') }}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="dateValue"
                type="datetimerange"
                class="date-time-range"
                range-separator="-"
                size="small"
                :start-placeholder="$t('public.startTime')"
                :end-placeholder="$t('public.endTime')"
                @change="changeDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('passageway.location')">
              <el-select
                v-model="searchInfo.installLocate"
                :placeholder="$t('passageway.enterName', { type: $t('passageway.location') })"
              >
                <el-option v-for="item in installLocateList" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('application.plateNum')">
              <el-input
                :placeholder="$t('passageway.enterName', { type: $t('application.plateNum') })"
                v-model="searchInfo.personName"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('passageway.type')">
              <el-select
                v-model="searchInfo.inOutType"
                :placeholder="$t('passageway.enterName', { type: $t('passageway.type') })"
              >
                <el-option :label="$t('passageway.in')" value="1"></el-option>
                <el-option :label="$t('passageway.out')" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('application.deviceName')">
              <el-select
                v-model="searchInfo.deviceName"
                :placeholder="$t('passageway.enterName', { type: $t('application.deviceName') })"
              >
                <el-option v-for="item in deviceNameList" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <div class="btn-search">
            <el-button type="primary" class="btnPrimary" @click="searchInfoList">{{ $t('public.search') }}</el-button>
            <el-button type="primary" class="btnPrimary btnReset" @click="resetcls">{{ $t('public.reset') }}</el-button>
          </div>

          <div class="tables">
            <CustomTable
              :data="tableData"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :listQuery="{
                pageNo: searchInfo.pageInfo.pageNum,
                pageSize: searchInfo.pageInfo.pageSize,
              }"
              background
              :total="total"
            >
              <el-table-column prop="personName" :label="$t('passageway.name')"> </el-table-column>

              <el-table-column prop="plateNo" :label="$t('application.plateNum')"> </el-table-column>
              <el-table-column prop="snapPhoto" :label="$t('passageway.photo')">
                <template slot-scope="scope">
                  <img
                    v-viewer
                    v-if="scope.row.snapPhoto"
                    :src="scope.row.snapPhoto"
                    class="snap-photo"
                    style="background: #313131"
                  />
                </template>
              </el-table-column>
              <!--              <el-table-column prop="parkingAreaName" label="车场区域" min-width="45"> </el-table-column>-->
              <el-table-column prop="deviceName" :label="$t('application.deviceName')" min-width="45">
              </el-table-column>
              <el-table-column prop="installLocate" :label="$t('application.devicePos')" min-width="45">
              </el-table-column>
              <el-table-column prop="inOutType" :label="$t('passageway.inOrOutStatus')">
                <template slot-scope="scope">
                  <div v-if="scope.row.inOutType == 1">{{ $t('passageway.in') }}</div>
                  <div v-if="scope.row.inOutType == 2">{{ $t('passageway.out') }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="eventTime" :label="$t('passageway.alarmTime')"> </el-table-column>
            </CustomTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDIYTime1, formatDateTime } from '@/utils/mutil'
import { getCarList } from '@/utils/api'
import CustomTable from '../../../../../components/CustomTable'
export default {
  props: {
    params: {},
  },
  components: {
    CustomTable,
  },
  data() {
    return {
      deviceNameList: [],
      installLocateList: [],
      options: [],
      searchInfo: {
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
        beginTime: formatDateTime(new Date()).substring(0, 19),
        endTime: formatDateTime(new Date()).substring(0, 19),
        inOutType: '',
        plateNo: '',
        timeType: '1',
        deviceName: '',
        installLocate: '',
      },
      dateValue: [],
      tableData: [],

      checkAll: true,
      number: '10',
      numberList: [10, 20, 30, 40, 50], //每页显示数量,
      total: 0,
    }
  },
  created() {},
  mounted() {
    this.searchInfo = Object.assign(this.searchInfo, this.params)
    this.radioChange()
    this.searchInfoList()
    this.deviceNameLists()
    this.installLocateLists()
  },
  methods: {
    // 设备名称
    deviceNameLists() {
      this.$fetch('/uas/v1/api/scs/person/vehicle/devName/list', { type: 2 }).then((res) => {
        if (res.resultCode === 0) {
          this.deviceNameList = res.resultList
        } else {
          this.deviceNameList = []
        }
      })
    },
    // 位置
    installLocateLists() {
      this.$fetch('/uas/v1/api/scs/person/vehicle/installLocation/list', { type: 2 }).then((res) => {
        if (res.resultCode === 0) {
          this.installLocateList = res.resultList
        } else {
          this.installLocateList = []
        }
      })
    },
    searchInfoList() {
      this.searchInfo.beginTime = this.searchInfo.beginTime.slice(0, 10) + ' ' + '00:00:00'
      getCarList(this.searchInfo).then((res) => {
        if (res.resultCode == 0) {
          this.tableData = res.recognitionList
          this.total = res.pageInfo.totalNum
        }
      })
    },
    resetcls() {
      this.searchInfo.beginTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.inOutType = ''
      this.searchInfo.plateNo = ''
      this.dateValue = []
      this.searchInfo.deviceName = ''
      this.searchInfo.installLocate = ''
    },
    numberChange(data) {
      this.searchInfo.pageInfo.pageSize = data
      this.searchInfoList()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageInfo.pageNum = val
      this.searchInfoList()
    },
    handleSizeChange(val) {
      this.searchInfo.pageInfo.pageNum = 1
      this.searchInfo.pageInfo.pageSize = val
      this.searchInfoList()
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

      this.date_format()
      this.searchInfoList()
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
      this.searchInfo.beginTime = this.time(this.dateValue[0])
      this.searchInfo.endTime = this.time(this.dateValue[1])
    },

    // 改变开始时间
    changeDate(val) {
      this.searchInfo.timeType = ''
      this.date_format()
    },
    toList() {
      this.$emit('toCarComeInList')
    },
  },
}
</script>

<style lang="scss" scoped>
.snap-photo {
  width: 60px;
  height: 60px;
}
.btn-search {
  margin: 0 auto 20px;
  width: 400px;
}
.date-time-range {
  margin-left: 20px;
}
.custom-pager {
  .el-pagination__total {
    color: #fff;
  }
}
.tables {
  width: 100%;
  height: calc(100% - 140px);
}
.dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
.custom-pager {
  .el-pagination__total {
    color: #fff;
  }
}

#carAlarm22 {
  width: 100%;
  min-height: calc(100vh - 70px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .alarmLevel {
    height: 26px;
    border-radius: 4px;
    text-align: center;
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
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    background: #192f3f;
    border: 1px solid #00ccff;
    opacity: 0.7;
    border-radius: 4px;
  }

  .main {
    width: 100%;
    min-height: 700px;
    height: 700px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .bg {
      pointer-events: auto;
      width: 80% !important;
      background: rgba(20, 47, 72, 0.8);
      border-radius: 8px;
      margin-top: 200px;
      position: relative;
      padding: 50px;
      min-height: 700px;
      height: 700px;

      .closeItem {
        font-size: 18px;
        color: white;
        position: absolute;
        cursor: pointer;
        right: 50px;
        top: 20px;
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
      .carNo {
        display: flex;
      }
    }
  }
}
</style>
