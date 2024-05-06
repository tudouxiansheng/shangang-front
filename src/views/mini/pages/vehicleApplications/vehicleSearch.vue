<template>
  <div class="vehicleSearch">
    <div class="pannel">
      <div class="title">车辆检索</div>
      <div class="block">
        <div style="margin-left: 50%; transform: translateX(-50%)">
          <!-- <div
            class="contentBtn"
            :class="{ unactive: !isUnactive }"
            @click="imgSearch"
          >
            图片检索
          </div>
          <div
            class="contentBtn"
            :class="{ unactive: isUnactive }"
            @click="contentSearch"
          >
            条件搜索
          </div> -->
        </div>
      </div>
      <!--图片检索-->
      <div v-if="isUnactive" class="vehicleImgesearch">
        <VehicleImgSearch
          @showCamerBox="showCamerBox"
          :camernum="camernum"
          :choseDeviceList="choseDeviceList"
          @resetcamera="resetcamera"
          @openCheckResult="openCheckResult"
        ></VehicleImgSearch>
      </div>
      <!-- 条件检索 -->
      <div v-else class="condotionsearch">
        <vehicle-condition-search
          @showCamerBox="showCamerBox"
          :choseDeviceList="choseDeviceList"
          @showvehicleConditionSearchResult="showvehicleConditionSearchResult"
          :camernum="camernum"
        >
        </vehicle-condition-search>
      </div>
    </div>
    <!-- 以图搜人查询弹框 -->
    <div class="infoDiv">
      <search-result
        class="componentPos"
        @closeSearchResult="closeSearchResult"
        v-show="searchResultVisiable"
        :vehicleSearchList="vehicleSearchList"
      ></search-result>
    </div>

    <!-- 检索详情 -->
    <search-detail class="componentPos" v-show="searchDetailVisible" :vehicleDetail="vehicleDetail"></search-detail>

    <chose-camera
      v-if="choseCamera"
      @choseCameraBtn="choseCameraMethod"
      :choseDeviceList="choseDeviceList"
      :camernum="camernum"
      :choseDeviceId="choseDeviceId"
    ></chose-camera>
    <search-expansion
      class="componentPos1"
      :vehicleSearchList="vehicleSearchList"
      v-if="resultExpansionVisiable"
      @open="handleOpenTrack"
    ></search-expansion>
    <timeline :visible="timelineVisible" :data="trackInfos" @close="handleCloseTrack"></timeline>
  </div>
</template>
<script>
import choseCamera from './choseCamera'
import SearchResult from './component/searchResult'
import searchDetail from './component/searchDetai'
import VehicleImgSearch from './component/vehicleImgSearch.vue'
import vehicleConditionSearch from './component/vehicleConditionSearch'
import searchExpansion from './component/resultExpansion'
import timeline from '../../../../components/timeline'
import Dayjs from '../../../../utils/Dayjs'

export default {
  components: {
    choseCamera,
    SearchResult,
    searchDetail,
    VehicleImgSearch,
    timeline,
    'vehicle-condition-search': vehicleConditionSearch,
    'search-expansion': searchExpansion,
  },
  data() {
    return {
      choseCamera: null, //选择摄像机
      placeholder: '请选择摄像机',
      searchDetailVisible: false,
      searchResultVisiable: false,
      isUnactive: false,
      timelineVisible: false,
      searchContent: true,
      imageUrl: '',
      trackInfos: [],
      district: [],
      // 静态查询参数
      searchInfo: {
        threshold: 80,
        imageId: '',
        district: '',
        courtId: '',
        faceReportPath: '',
        searchType: '1',
        imageQuality: 80,
        camera: '',
      },
      // 摄像机来源
      cameraList: [],
      // 动态查询参数
      getPersonDynamicList: {
        threshold: 80,
        fileId: '',
        district: '',
        courtId: '',
      },
      // 条件检索参数
      contentSearchInfo: {
        personName: '',
        idCardNo: '',
        gender: '',
        beginTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 5000,
        },
      },
      threshold: 80,
      resultStaticList: null,
      dynamicBasicInfo: [
        {
          img: '',
          confidence: '0.95',
          deviceName: '摄像机名称',
          eventTime: '2021-03-29 12:22:22',
          location: '南京市软件谷科创城',
        },
        {
          img: '',
          confidence: '0.95',
          deviceName: '摄像机名称',
          eventTime: '2021-03-29 12:22:22',
          location: '南京市软件谷科创城',
        },
      ],

      timeType: '', //时间绑定值
      comeForm: '', //摄像机来源
      camernum: 0,
      choseDeviceList: [], //已选设备
      choseDeviceId: [],
      resultExpansionVisiable: false,
      vehicleSearchList: [],
      vehicleDetail: {},
    }
  },
  computed: {},
  beforeDestroy() {},
  mounted() {
    this.$root.$on('isSearchDetailVisible', (item) => {
      this.searchResultVisiable = false
      this.searchDetailVisible = true
      console.log(item)
      this.vehicleDetail = item
    })
    this.$root.$on('goBackSearchResult', () => {
      this.searchDetailVisible = false
      this.searchResultVisiable = true
    })
    this.$root.$on('isResultExpansionVisiable', (item) => {
      this.searchResultVisiable = false
      this.searchDetailVisible = false
      this.resultExpansionVisiable = true
    })
    this.$root.$on('goBackSearchResultFromExp', () => {
      this.resultExpansionVisiable = false
      this.searchResultVisiable = true
    })
    this.$root.$on('expansionToDetail', (item) => {
      this.resultExpansionVisiable = false
      this.searchDetailVisible = true
      this.searchResultVisiable = false
      this.vehicleDetail = item
    })
    this.$root.$on('closeExpansion', () => {
      this.resultExpansionVisiable = false
    })
  },
  methods: {
    handleOpenTrack(infos) {
      console.log(infos)
      infos.map((item) => {
        item.time = Dayjs(item.hitTime).format('YYYY-MM-DD')
      })
      this.trackInfos = infos
      this.timelineVisible = true
    },
    handleCloseTrack() {
      this.timelineVisible = false
      this.resultExpansionVisiable = true
    },
    //选好摄像机设备
    choseCameraMethod(camernum, cameraList) {
      console.log(camernum, cameraList, '已选设备')
      this.choseCamera = false
      this.camernum = camernum
      this.choseDeviceList = cameraList
      var deviceId = []
      for (let i = 0; i < cameraList.length; i++) {
        deviceId = deviceId.concat(cameraList[i].id)
      }
      this.choseDeviceId = deviceId
    },
    resetcamera() {
      this.choseDeviceList = []
      this.camernum = 0
    },
    openCheckResult() {
      this.searchResultVisiable = true
    },

    showCamerBox() {
      this.choseCamera = true
    },
    handleClickCamera() {
      this.choseCamera = true
    },
    closeSearchResult() {
      this.searchResultVisiable = false
    },
    isSearchDetailVisible(e) {
      this.searchResultVisiable = false
      this.searchDetailVisible = true
    },

    showvehicleConditionSearchResult(vehicleSearchList) {
      console.log('search', vehicleSearchList)
      this.resultExpansionVisiable = true
      this.vehicleSearchList = vehicleSearchList
    },

    imgSearch() {
      this.isUnactive = true
    },
    contentSearch() {
      this.isUnactive = false
    },

    //查询按钮
    getPeopleList() {
      this.getPersonStaticList()

      this.searchResultVisiable = true
    },
    // 静态查询
    async getPersonStaticList() {
      // 获取以图搜人结果列表
      // let res = await searchByImageStatic(this.searchInfo);
      // // 结果>0，静态查询
      // if (res.resultList) {
      //   this.staticDetailImg = res.resultList;
      //   this.peopleInfo.idCardNo = this.staticDetailImg[
      //     this.imgIndex
      //   ].credentialNumber;
      //   this.getStaticPeopleInfo();
      // } else {
      //   // 结果等于0，则动态查询（查询陌生人员信息）
      //   this.getPersonDynamicLists();
      // }
    },

    changeDate(e) {
      this.dateValue = e.value
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
      }
      this.contentSearchInfo.beginTime = s
      this.contentSearchInfo.endTime = e
    },
  },
}
</script>
<style lang="scss" scoped>
.condotionsearch {
  width: 100%;
  height: calc(100% - 50px);
}
.vehicleSearch {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../../../../assets/buildingSeting/background.png') no-repeat;
  background-size: 100% 100%;
  .pannel {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .title {
      padding-top: 16px;
      padding-left: 16px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
    }
    .block {
      width: 412px;
      margin: 0 auto;
      color: #fff;
      .contentBtn {
        box-sizing: border-box;
        float: left;
        width: 90px;
        height: 32px;
        line-height: 30px;
        color: #fefefe;
        text-align: center;
        background: #00ccff;
        font-size: 14px;
        border-radius: 8px 0 0 8px;
        border: 2px solid #00ccff;
        cursor: pointer;

        &:nth-child(2) {
          border-radius: 0 8px 8px 0;
        }
      }
      .unactive {
        background: none;
        border: 2px solid #7ea5c9;
      }

      .name {
        display: inline-block;
        width: 61px;
        // background-color: pink;
        text-align: right;
        line-height: 34px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #edf6f7;
      }
      .threshold {
        display: inline-block;
        height: 43px;
        line-height: 43px;
      }
      .formItem {
        display: flex;
        position: relative;
        img {
          position: absolute;
          right: 7px;
          top: 11px;
        }
        .el-radio-group {
          display: flex;
        }
        .el-radio-group .el-radio-button__inner {
          border: 2px solid #7ea5c9;
        }
        .el-radio-group .el-radio-button {
          margin-right: 0;
        }
        .el-radio-group :nth-child(2) {
          border-radius: 0;
        }
      }
      .formItem-threshold {
        padding-top: 5px;
      }
      // 检索按钮
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
      // 重置按钮style="margin-left: 25px"
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
    }
    .timetap {
      margin-top: 43px;
      display: flex;
    }
  }
  // 搜索弹框
  .infoDiv {
    pointer-events: auto;
    width: 480px;
    background: rgba(20, 47, 72, 0.65);
    border-radius: 8px;
    position: absolute;
    right: 473px;
    top: 0px;
    .scroll {
      height: 69vh;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .pDiv {
      color: #edf6f7;
      padding-left: 19px;
      color: #ecf7f7;
      .personTitle {
        color: #1efffc;
        font-size: 14px;
      }
      .basicInfo {
        padding-top: 20px;
        padding-left: 18px;
        margin-right: 75px;
        width: 100%;
        #personConcat {
          width: 100%;
          height: 300px;
        }
        .baseInfoRow {
          display: flex;
          margin-bottom: 20px;
          span {
            flex: 1;
            &:nth-child(2) {
              flex: 1.5;
            }
          }
        }
      }
    }
    .dynamicTitle {
      margin-bottom: 10px;
      font-size: 14px;
      color: #00ccff;
      text-align: right;
    }
    .dynamicTail {
      display: flex;
      width: 100%;
      // height: 145px;
      background: rgba(32, 75, 116, 0.65);
      margin-bottom: 25px;
      margin-top: 23px;
      .peopleImg {
        margin-top: 25px;
        width: 100px;
        height: 100px;
        background: #21394a;
      }
      .peopleInfo {
        margin-top: 25px;
        margin-left: 10px;
        flex: 1;
        height: 100px;
        .title {
          font-size: 16px;
          color: #1efffc;
        }
        .detail {
          font-size: 14px;
          color: #f1fefe;
          margin-top: 7px;
        }
      }
      .peopleCheck {
        margin-top: 25px;
        width: 30px;
        height: 100px;
        .el-checkbox__inner {
          width: 20px;
          height: 20px;
          background: none;
          border: 1px solid rgba(30, 255, 252, 1);
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background: url('../../../../assets/faceSearch/checked.png');
          border: none;
        }
        .el-checkbox__inner::after {
          border: none;
        }
      }
      .detailJum {
        color: #1efffc;
        font-size: 12px;
      }
      .location {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  // 动态弹框
  .staticResult {
    width: 555px;
    height: 470px;
    position: absolute;
    right: 460px;
    top: 20vh;
    background: rgba(20, 47, 72, 0.65);
    .title {
      margin-top: 20px;
      margin-left: 15px;
      color: #1efffc;
    }
    .roomDetail {
      display: flex;
      justify-content: center;
      justify-content: space-around;
      margin-top: 10px;
      color: #f1fefe;
      font-size: 14px;
      li {
        flex: 1;
        text-align: center;
      }
    }
    .roomDetailBg {
      height: 80%;
      width: 100%;
      font-size: 14px;
      // overflow: hidden;
      // margin-top: 8px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      // margin: 10px 2px;
      .roomDetail {
        display: flex;
        justify-content: center;
        justify-content: space-around;
        li {
          flex: 1;
          text-align: center;
        }
      }
      .roomDetail:hover {
        background: #0f9694;
        opacity: 0.8;
      }
    }
  }
  // 查看详情弹框
  .left {
    pointer-events: auto;
    width: 480px;
    min-height: 970px;
    height: 89.8vh;
    position: fixed;
    left: 19px;
    top: 80px;
    background: rgba(20, 47, 72, 0.65);

    .generalize {
      width: 100%;
      position: relative;
      height: 1376px;
      height: 89.8vh;
      // background: #142f48;
      // opacity: 0.65;
      background: rgba(20, 47, 72, 0.65);
      border-radius: 8px;
      .title {
        padding-top: 16px;
        padding-left: 16px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #1efffc;
      }
      .personDetail {
        height: 90%;
        // height: 40.74vh;
        width: 98%;
        margin-top: 8px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        // margin: 10px 2px;
        .title2 {
          width: 80px;
          text-align: center;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ecf7f7;
        }
      }
    }
    .buttom {
      margin-top: 16px;
      margin-right: 20px;
      width: 80px;
      height: 36px;
      background: #00ccff;
      border-radius: 4px;
    }
    .person {
      display: flex;
      // justify-content: space-between;
      // width: 400px;
      margin-left: 85px;
    }
    .personInfo {
      font-size: 14px;
      font-weight: 400;
      color: #ecf7f7;
    }
    .title1 {
      padding-top: 16px;
      padding-left: 16px;
    }
    #personConcats {
      width: 90%;
      height: 300px;
    }
  }
  .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 1px solid #3d709d;
  }
  .el-timeline-item__node {
    background: rgba(20, 47, 72, 0.65);
  }
  .el-card__body {
    padding: 8px;
  }
  .el-card {
    border: 1px solid transparent;

    background: transparent;

    color: #c6d0d8;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
}
.jiansuo {
  font-size: 14px;
  margin-right: 18px;
}
.myradio .el-radio {
  color: #ffffff;
}
.mydate {
  .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border-color: #7ea5c9;
    width: 110px;
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
  .el-radio-button {
    margin-right: 0;
  }
  .el-radio-group {
    margin-right: 0;
  }
}
.mydate2 {
  .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border-color: #7ea5c9;
    padding: 9px;
    border-radius: 4px;
  }
  .el-radio-group .el-radio-button {
    margin-right: 7px;
  }
}
.mydate3 {
  .el-radio-group .el-radio-button {
    line-height: 46px;
  }
  .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border-color: #7ea5c9;
    padding: 9px;
    border-radius: 4px;
  }
}
.mydate4 {
  .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border-color: #7ea5c9;
    padding: 9px;
    border-radius: 4px;
    width: 77px;
  }
}
.mydate5 {
  .el-select .el-input {
    width: 100%;
  }
  .el-radio-group :nth-child(2).el-radio-button {
    border-radius: 0;
  }
}
.date-picker .el-range-editor.el-input__inner .el-range-input {
  color: white;
}
.date-picker {
  text-align: right;
}
.date-picker .el-range-editor.el-input__inner .el-range-input {
  color: white;
}
.date-picker .el-date-editor .el-range-separator {
  color: white;
}
.comefrom {
  display: flex;
  margin-top: 38px !important;
}

.searchReaultTitle {
  font-size: 14px;
  color: #1efffc;
  position: absolute;
  top: 23px;
}
.searchTable {
  padding: 24px 21px 21px 21px;
}
.componentPos1 {
  right: 530px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  position: absolute;
}
</style>
