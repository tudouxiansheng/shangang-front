<template>
  <div class="car-application">
    <div class="filter-wrapper">
      <el-form :model="queryForm" :inline="true">
        <!-- 时间范围 -->
        <el-form-item :label="$t('public.period')">
          <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
            <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
            <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
            <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>
            <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :editable="false"
            @change="handleChangeDate"
            :picker-options="pickerOptions"
            v-model="queryForm.beginTime"
            type="datetime"
            :placeholder="$t('public.startTime')"
          ></el-date-picker>
        </el-form-item>
        <!-- 结束时间 -->
        <el-form-item :label="$t('public.endTime')">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            @change="handleChangeDate"
            :picker-options="pickerOptions"
            v-model="queryForm.endTime"
            type="datetime"
            :placeholder="$t('public.endTime')"
          ></el-date-picker>
        </el-form-item>
        <!-- 车牌号 -->
        <el-form-item :label="$t('application.plateNum')">
          <el-input :placeholder="$t('application.plateNum')" v-model="queryForm.prn"></el-input>
        </el-form-item>
        <!-- 车身颜色 -->
        <el-form-item :label="$t('application.carColor')">
          <el-select
            class="custom-select"
            :popper-append-to-body="false"
            v-model="queryForm.carColor"
            :placeholder="$t('application.carColor')"
          >
            <el-option value="-1" :label="$t('public.all')"></el-option>
            <el-option
              v-for="item in vehicleColorList"
              :value="item.value"
              :label="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 车辆类型 -->
        <el-form-item :label="$t('application.carType')">
          <el-select
            class="custom-select"
            :placeholder="$t('application.carType')"
            :popper-append-to-body="false"
            v-model="queryForm.carType"
          >
            <el-option value="-1" :label="$t('public.all')"></el-option>
            <el-option
              v-for="item in vehicleTypeList"
              :value="item.value"
              :label="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 车牌颜色 -->
        <el-form-item :label="$t('application.plateColor')">
          <el-select
            class="custom-select"
            :placeholder="$t('application.plateColor')"
            :popper-append-to-body="false"
            v-model="queryForm.plateColor"
          >
            <el-option value="-1" :label="$t('public.all')"></el-option>
            <el-option
              v-for="item in plateColorList"
              :value="item.value"
              :label="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 摄像机 -->
        <el-form-item :label="$t('public.camera')">
          <div class="camera-resource">
            <div class="camera-radio">
              <el-radio-group v-model="queryForm.type">
                <el-radio :label="1">{{ $t('public.all') }}</el-radio>
                <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
              </el-radio-group>
            </div>
            <div class="camera">
              <el-input v-if="queryForm.type == 2" :placeholder="placeholder" @click.native="handleClickCamera">
                <img slot="suffix" class="tree-img" src="../images/tree.png" />
              </el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
        <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
      </div>
    </div>
    <div class="card-wrapper">
      <CardList
        :data="tableData"
        pager
        :total="total"
        :page-size="listQuery.pageSize"
        :page-no="listQuery.pageNum"
        :page-sizes="[12, 30, 50, 100]"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        :columns="6"
      >
        <template slot-scope="{ item, index }">
          <div class="item-wrapper">
            <div class="img-wrapper">
              <img :src="item.captureUrl" alt="" @click="handleDetail(item, index)" />
            </div>
            <div class="captureInfo">
              <div class="address-confidence">
                <div class="address" :title="item.cameraName">{{ item.cameraName }}</div>
                <div class="track" title="动态轨迹" @click="handleGoTrack(item)">
                  <img src="../images/track.png" alt="" />
                </div>
              </div>
              <div>{{ item.captureTime }}</div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <searchDetail
      @close="handleCloseDetailDialog"
      @guiji="handleGoTrack"
      :detail.sync="detailRow"
      :searchType="searchType"
      v-if="showDetailDialog"
    ></searchDetail>
    <choseCamera
      v-if="choseCameraDialog"
      @close="handleCloseChoseCamera"
      :choseDeviceList="choseDeviceList"
    ></choseCamera>
  </div>
</template>

<script>
import Dayjs from '../../../../../utils/Dayjs'
import { vehicleDictionary, vehiclesearchByCondition } from '@/utils/api'
import CardList from '../../../../../components/CardList'
import searchDetail from './search-detail'
import choseCamera from '../components/chose-camera'
import { DateDiff } from '../../../../../utils/mutil'
import { getGuardHitInfo } from '../../../../../utils/api'

export default {
  name: 'index',
  components: {
    CardList,
    choseCamera,
    searchDetail,
  },
  data() {
    return {
      pickerOptions: {
        // selectableRange: (() => {
        //   let data = new Date()
        //   let hour = data.getHours()
        //   let minute = data.getMinutes()
        //   let second = data.getSeconds()
        //   return [`00:00:00-${hour}:${minute}:${second}`]
        // })(),
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() > Date.now()
        },
      },
      choseCameraDialog: false,
      showDetailDialog: false,
      detailRow: {},
      searchType: 5,
      queryForm: {
        type: 1,
        prn: '',
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        carColor: '-1',
        carType: '-1',
        plateColor: '-1',
      },
      timeType: 3,
      placeholder: this.$t('public.selectCamera'),
      vehicleColorList: [],
      vehicleTypeList: [],
      plateColorList: [],
      choseDeviceList: [],
      tableData: [
        // {
        //   cameraId: '00000022030105010301000000000016',
        //   cameraName: '51.32.2.13',
        //   latitude: 39.90663154412291,
        //   longitude: 116.39242629475761,
        //   altitude: 79.94790925794794,
        //   imageTimestamp: '2022-02-22 11:39:46',
        //   detectUrl:
        //     'http://121.37.187.55:10000/file/perm/20220222/00000000000000000201000000000000/perm20220222105202667RAmXqJjDiPa.jpg?encrypt=3IOjfv056bSFkwAtr_DOYA&expires=1656491434',
        //   plateNumber: 'A12888',
        //   captureUrl:
        //     'http://121.37.187.55:10000/file/perm/20220222/00000000000000000201000000000000/perm20220222105202667RAmXqJjDiPa.jpg?encrypt=3IOjfv056bSFkwAtr_DOYA&expires=1656491434',
        //   captureTime: '2022-02-22 11:39:46',
        //   carDirection: '',
        //   plateType: '',
        //   plateColor: '',
        //   carType: '',
        //   vehicleBrand: '',
        //   vehicleSub: '',
        // },
      ],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 12,
      },
      systemType: '',
    }
  },
  created() {
    // 判断系统类型
    let type = this.$store.state.g_platType
    if (type == 5 || type == 16) {
      // 3800
      this.systemType = '-3800'
    } else if (type == 14) {
      // 1800
      this.systemType = '-1800'
    } else {
      // nvr800
      this.systemType = '-nvr800'
    }
    this.getVehicleDictionary()
  },
  methods: {
    handleChangeDate() {
      this.timeType = 4
    },
    handleGoTrack(item) {
      if (sessionStorage.getItem('cuType') == 1) {
        // sessionStorage.setItem(
        //   'trailSearchBy',
        //   JSON.stringify({
        //     trackType: 2, //人员轨迹，车辆轨迹
        //     ...item,
        //   })
        // )
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/trail',
            menuName: localStorage.getItem('locale') != 'en' ? '动态轨迹' : 'Dynamic trajectory',
            params: JSON.stringify({
              trackType: 2, //人员轨迹，车辆轨迹
              ...item,
              optType: 'trail',
            }),
          })
        )
        // qt
      } else {
        this.$router.push({
          name: 'trail',
          params: {
            trackType: 2, //人员轨迹，车辆轨迹
            ...item,
          },
        })
      }
    },
    handleDetail(item, index) {
      console.log(item)
      this.detailRow = { ...item, index }
      this.showDetailDialog = true
      // getGuardHitInfo({ alarmId: item.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //
      //   }
      // })
    },
    handleCloseDetailDialog() {
      this.detailRow = {}
      this.showDetailDialog = false
    },
    handleSearch() {
      // this.defaultTime = Dayjs().format('HH:mm:ss')
      this.listQuery.pageNum = 1
      this.handleGetList()
    },
    handleReset() {
      this.queryForm = {
        type: 1,
        prn: '',
        beginTime: Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        carColor: '-1',
        carType: '-1',
        plateColor: '-1',
      }
      this.choseDeviceList = []
      this.timeType = 3
      this.handleChangeQuickDateTime()
      this.listQuery.pageNum = 1
      this.total = 0
      this.tableData = []
      // this.handleGetList()
    },
    handleGetList() {
      if (!this.queryForm.beginTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (!this.queryForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (new Date(this.queryForm.endTime).getTime() > new Date().getTime()) {
        this.$message.warning(this.$t('public.endGtCur'))
        return
      }
      if (new Date(this.queryForm.beginTime).getTime() > new Date(this.queryForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      if (DateDiff(this.queryForm.beginTime, this.queryForm.endTime) > 6) {
        this.$message.warning(this.$t('public.gt7'))
        return
      }
      if (this.queryForm.type == 2) {
        this.queryForm.cameraList = this.choseDeviceList.map((item) => item.id)
        if (!this.queryForm.cameraList.length) {
          this.$message.warning(`${this.$t('public.please')}${this.$t('public.camera')}`)
          return
        }
      } else {
        this.queryForm.cameraList = []
      }
      // NVR800参数处理
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
        },
        ...this.queryForm,
      }
      params.carColor = JSON.parse(params.carColor)
      params.carType = JSON.parse(params.carType)
      params.plateColor = JSON.parse(params.plateColor)
      if (this.systemType == '-nvr800') {
        if (params.carColor instanceof Array) {
          params.carColorArray = params.carColor
          delete params.carColor
        }
        if (params.carType instanceof Array) {
          params.carTypeArray = params.carType
          delete params.carType
        }
        if (params.plateColor instanceof Array) {
          params.plateColorArray = params.plateColor
          delete params.plateColor
        }
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      vehiclesearchByCondition(params)
        .then((res) => {
          this.tableData = []
          this.total = 0
          loading.close()
          if (res.resultCode == 0) {
            if (res.resultList && res.resultList.length) {
              this.tableData = res.resultList
              this.total = res.pageInfo.totalNum
            } else {
              this.$message.warning(this.$t('public.noData'))
              this.tableData = []
              this.total = 0
            }
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    handleCloseChoseCamera(cameraNum, cameraList) {
      // console.log(cameraNum, cameraList)
      this.cameraNum = cameraNum
      this.placeholder = this.$t('public.placeholder', { num: cameraNum })
      this.choseDeviceList = cameraList

      this.choseCameraDialog = false
    },
    getVehicleDictionary() {
      vehicleDictionary({ type: 'acc-vehicle-color' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleColorList = res.dictionaryList
        }
      })
      vehicleDictionary({ type: 'acc-vehicle-type' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleTypeList = res.dictionaryList
        }
      })
      vehicleDictionary({ type: 'acc-plate-color' + this.systemType }).then((res) => {
        if (res.resultCode == 0) {
          this.plateColorList = res.dictionaryList
        }
      })
    },

    //点击弹窗摄像机列表
    handleClickCamera() {
      this.choseCameraDialog = true
    },
    // 时间按钮发生变化时
    handleChangeQuickDateTime() {
      let s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
      let e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      // 如果是近三天
      if (this.timeType == 1) {
        s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是近七天
      else if (this.timeType == 2) {
        s = Dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是今日
      else if (this.timeType == 3) {
        s = Dayjs().format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else {
        s = ''
        e = ''
      }
      this.queryForm.beginTime = s
      this.queryForm.endTime = e
      this.$forceUpdate()
    },
    handlePageChange(pageNo) {
      this.listQuery.pageNum = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = size
      this.handleGetList()
    },
  },
}
</script>

<style scoped lang="scss">
.detail-position {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
.car-application {
  width: 1750px;
  height: calc(100% - 80px);
  margin: 50px auto 0;
  color: #fff;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 190px;
  }
  .card-wrapper {
    height: calc(100% - 80px);
    .item-wrapper {
      position: relative;
      color: #fff;
      background-color: #204b74;
      border-radius: 4px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      .check {
        position: absolute;
        right: 20px;
        top: 15px;
      }
      .img-wrapper {
        width: 100%;
        height: 180px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .captureInfo {
        margin-top: 15px;
        .address-confidence {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .track {
            padding: 4px;
            box-sizing: border-box;
            cursor: pointer;
            img {
              width: 14px;
              height: 14px;
            }
          }
          .confidence {
            white-space: nowrap;
            color: #00ccff;
          }
          .address {
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
            padding-right: 15px;
          }
        }
      }
    }
  }

  .filter-wrapper {
    display: flex;
    //justify-content: space-between;
    position: relative;

    .btn-search {
      position: absolute;
      right: 100px;
      top: 50px;
    }
  }

  .custom-slider {
    width: 300px;
  }

  .custom-select {
    width: 200px;
  }

  .camera-resource {
    display: flex;
    min-width: 450px;

    .camera-radio {
      flex: 1;
      white-space: nowrap;
    }

    .camera {
      flex: 1;
      width: 100%;
    }

    .tree-img {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 5px;
      top: 6px;
    }
  }
}
</style>
