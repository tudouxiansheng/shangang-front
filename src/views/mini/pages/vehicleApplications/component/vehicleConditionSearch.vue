<template>
  <div class="wrapper">
    <div class="vehicleconditionSearch">
      <el-form :model="vehicleSearchInfo" label-suffix="：">
        <el-form-item label="车牌号">
          <el-radio-group v-model="vehicleSearchInfo.plateSimilar">
            <el-radio label="0">检索未知</el-radio>
            <el-radio label="1">含相似车辆</el-radio>
          </el-radio-group>
          <el-input v-model="vehicleSearchInfo.lpn" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="时间段">
          <el-radio-group v-model="timeType" size="small" @change="radioChange">
            <el-radio-button label="1">近三天</el-radio-button>
            <el-radio-button label="2">近七天</el-radio-button>
            <el-radio-button label="3">近一月</el-radio-button>
            <el-radio-button label="4">自定义</el-radio-button>
          </el-radio-group>
          <div class="date-picker">自定义时间范围最大为30天</div>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            v-model="vehicleSearchInfo.beginTime"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            v-model="vehicleSearchInfo.endTime"
            type="datetime"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="来源">
          <div class="resource-wrapper">
            <el-select v-model="comefromType" filterable placeholder="来源" @change="changeSelectComeFrom">
              <el-option v-for="item in fileType" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input class="resource" :placeholder="placeholder" @click.native="handleClickCamera">
              <img slot="suffix" class="tree-img" src="../../../../../assets/vehicleApp/tree.png" />
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="算法">
          <el-select v-model="vehicleSearchInfo.algorithmAccessId">
            <el-option
              v-for="(item, index) in algorithmAccessList"
              :key="index"
              :label="item.accessName"
              :value="item.accessId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车身颜色">
          <!--少的-->
          <div class="cheyanse1" v-show="!showAllVehicleColor">
            <el-radio-group v-model="vehicleSearchInfo.vehicleColor" size="mini">
              <el-radio-button v-for="(item, index) in vehicleColorList.slice(0, 8)" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="moreVehicleColor" size="small" plain icon="el-icon-caret-bottom"> 更多</el-button>
              </div>
            </el-radio-group>
          </div>
          <!--多的-->
          <div class="cheyanse" v-show="showAllVehicleColor">
            <el-radio-group v-model="vehicleSearchInfo.vehicleColor" size="mini">
              <el-radio-button v-for="(item, index) in vehicleColorList" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="lessVehicleColorbtn" size="small" plain icon="el-icon-caret-top"> 收起</el-button>
              </div>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="车辆类型">
          <!--少的-->
          <div class="cheyanse1" v-show="!showAllVehicleType">
            <el-radio-group @change="lessVehicleTypebtn" size="mini" v-model="vehicleSearchInfo.vehicleType">
              <el-radio-button v-for="(item, index) in vehicleTypeList.slice(0, 7)" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="moreVehicleType" size="small" plain icon="el-icon-caret-bottom"> 更多</el-button>
              </div>
            </el-radio-group>
          </div>
          <div class="cheyanse" v-show="showAllVehicleType" style="position: relative">
            <el-radio-group v-model="vehicleSearchInfo.vehicleType" size="mini">
              <el-radio-button v-for="(item, index) in vehicleTypeList" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="lessVehicleTypebtn" size="small" plain icon="el-icon-caret-top"> 收起</el-button>
              </div>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="特殊车辆">
          <div class="cheyanse1" v-show="!showAllespecialCar">
            <el-radio-group size="mini" v-model="vehicleSearchInfo.specialVehicle">
              <el-radio-button v-for="(item, index) in especialCar.slice(0, 5)" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="moreVehicleEspecial" size="small" plain icon="el-icon-caret-bottom"> 更多</el-button>
              </div>
            </el-radio-group>
          </div>
          <div class="cheyanse" v-show="showAllespecialCar" style="position: relative">
            <el-radio-group v-model="vehicleSearchInfo.specialVehicle" size="mini">
              <el-radio-button v-for="(item, index) in especialCar" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="lessVehicleEspecial" size="small" plain icon="el-icon-caret-top"> 收起</el-button>
              </div>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="车牌颜色">
          <div class="cheyanse1" v-show="!showAllPlateColor">
            <el-radio-group size="mini" v-model="vehicleSearchInfo.vlpColor">
              <el-radio-button v-for="(item, index) in plateColorList.slice(0, 8)" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="morePlateColor" size="small" plain icon="el-icon-caret-bottom"> 更多</el-button>
              </div>
            </el-radio-group>
          </div>
          <div class="cheyanse" v-show="showAllPlateColor" style="position: relative">
            <el-radio-group v-model="vehicleSearchInfo.vlpColor" size="mini">
              <el-radio-button v-for="(item, index) in plateColorList" :key="index" :label="item.value">{{
                item.name
              }}</el-radio-button>
              <div class="morebtnwrapper">
                <el-button @click="lessPlateColor" size="small" plain icon="el-icon-caret-top"> 收起</el-button>
              </div>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-group">
      <div class="btn checkleft">
        <el-button type="primary" class="btnPrimary" @click="searchvehicleICondition">检索</el-button>
      </div>
      <div class="btn chongzhi">
        <el-button type="primary" class="btnPrimary btnReset" @click="resetVehicleSearch">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { DateDiff } from '@/utils/mutil'
import { vehiclesearchByCondition, algorithmAccess, vehicleDictionary } from '@/utils/api.js'
import Dayjs from '../../../../../utils/Dayjs'
export default {
  props: {
    choseDeviceList: {
      type: Array,
      default() {
        return []
      },
    },
    camernum: {
      type: Number,
    },
  },
  data() {
    return {
      timeType: '4', //时间绑定值
      fileType: [
        {
          value: 1,
          label: '摄像机',
        },
        // {
        //   value: 2,
        //   label: "视频文件",
        // },
      ],
      comefromType: '', //
      placeholder: '请选择摄像机',
      vehicleSearchInfo: {
        cameraList: [],
        beginTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        algorithmAccessId: '',
        vehicleColor: '', //车身颜色
        specialVehicle: '', //特殊车辆
        vlpColor: '', //车牌颜色
        vehicleType: '', //车辆类型
        plateSimilar: '0',
        notInSystem: 1,
        similarLP: 2,
      },
      dateValue: [],
      algorithmAccessList: [],
      //车身颜色
      vehicleColorList: [], //车颜色长的

      showAllVehicleColor: false, //展示更多还是收起
      //车辆类型
      vehicleTypeList: [], //车辆类型
      showAllVehicleType: false,
      //特殊车辆
      especialCar: [],
      showAllespecialCar: false,
      //车牌颜色
      plateColorList: [],
      showAllPlateColor: false, //更对车颜色
    }
  },
  created() {
    this.radioChange()
    this.getAlgorithmAccess()
    this.getVehicleContent()
    this.especialCarList()
    this.getAllPlateColor()
  },
  methods: {
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.$emit('showCamerBox')
    },
    //选择时间
    // 时间段按钮选择发生变化时
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
      this.vehicleSearchInfo.beginTime = s
      this.vehicleSearchInfo.endTime = e
    },
    searchvehicleICondition() {
      if (!this.vehicleSearchInfo.beginTime || !this.vehicleSearchInfo.endTime) {
        this.$alert('请选择开始和结束时间', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        })
        return
      }
      if (DateDiff(this.vehicleSearchInfo.beginTime, this.vehicleSearchInfo.endTime) > 30) {
        this.$message.warning('时间间隔不能大于30天')
        return
      }
      this.vehicleSearchInfo.cameraList = []
      let hash = {}
      const data2 = this.choseDeviceList.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
      for (let i = 0; i < data2.length; i++) {
        this.vehicleSearchInfo.cameraList.push(data2[i].id)
      }
      if (this.vehicleSearchInfo.cameraList.length) {
        if (this.vehicleSearchInfo.algorithmAccessId) {
          vehiclesearchByCondition(this.vehicleSearchInfo).then((res) => {
            if (res.resultCode == 0) {
              this.$emit('showvehicleConditionSearchResult', res.resultList)
            }
          })
        } else {
          this.$alert('请选择算法名称', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
          })
        }
      } else {
        this.$alert('请选择摄像机', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        })
      }
    },
    resetVehicleSearch() {
      for (let key of Object.keys(this.vehicleSearchInfo)) {
        this.vehicleSearchInfo[key] = null
      }
      this.placeholder = '请选择摄像机'
      this.dateValue = []
    },
    //获取算法
    getAlgorithmAccess() {
      let data = {
        pageInfo: { pageNum: 1, pageSize: 10 },
      }
      algorithmAccess(data).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'suanfa')
          this.algorithmAccessList = res.algorithmAccessList
        }
      })
    },
    changeSelectComeFrom() {},
    getVehicleContent() {
      vehicleDictionary({ type: 'acc-vehicle-color' }).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleColorList = res.dictionaryList
        }
      })
      this.getVehicleType()
    },
    getVehicleType() {
      let vehicleType = {
        type: 'acc-vehicle-type',
      }
      vehicleDictionary(vehicleType).then((res) => {
        if (res.resultCode == 0) {
          this.vehicleTypeList = res.dictionaryList
        }
      })
    },
    //获取特殊车辆的字典树类型
    especialCarList() {
      let especialCars = {
        type: 'acc-plate-use',
      }
      vehicleDictionary(especialCars).then((res) => {
        if (res.resultCode == 0) {
          this.especialCar = res.dictionaryList
        }
      })
    },
    //点击更多车颜色按钮
    moreVehicleColor() {
      this.showAllVehicleColor = true
    },

    //收起
    lessVehicleColorbtn() {
      this.showAllVehicleColor = false
    },
    //车辆类型点击更多
    moreVehicleType() {
      this.showAllVehicleType = true
    },
    lessVehicleTypebtn() {
      this.showAllVehicleType = false
    },

    //更多特殊车辆展开
    moreVehicleEspecial() {
      this.showAllespecialCar = true
    },
    //更多特殊车收起
    lessVehicleEspecial() {
      this.showAllespecialCar = false
    },
    //点击更多车品牌
    moreVehicleBrand() {
      this.showAllCarBrand = true
    },
    //点击多的品牌
    clickbrandLong() {},
    //更少车品牌
    lessVehicleBrand() {
      this.showAllCarBrand = false
    },
    //获取车牌颜色
    getAllPlateColor() {
      vehicleDictionary({ type: 'acc-plate-color' }).then((res) => {
        if (res.resultCode == 0) {
          this.plateColorList = res.dictionaryList
        }
      })
    },

    //更多车牌颜色
    morePlateColor() {
      this.showAllPlateColor = true
    },

    //
    lessPlateColor() {
      this.showAllPlateColor = false
    },
  },
  watch: {
    camernum: function (newValue, oldValue) {
      this.placeholder = `已选择${newValue}台摄像机`
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  .btn-group {
    display: flex;
    width: 300px;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    margin-left: 120px;
    .btn {
      flex: 1;
    }
    .checkleft {
      margin-right: 20px;
    }
    .btnPrimary {
      width: 100%;
    }
  }
  .bottomcheck {
    position: absolute;
    bottom: 30px;
    display: flex;
    width: 360px;
    margin-left: 48px;
    .el-button {
      width: 160px;
      height: 40px;
      background-color: #00ccff !important;
    }
    .checkleft {
      flex: 1;
      text-align: center;
    }
    .chongzhi {
      flex: 1;
      text-align: center;
    }
  }
}
.vehicleconditionSearch {
  padding-left: 10px;
  padding-right: 30px;
  box-sizing: border-box;
  height: 90%;
  overflow: auto;
  .resource-wrapper {
    display: flex;
    align-items: center;
    .resource {
      margin-left: 10px;
    }
  }
  ::v-deep.el-form {
    margin-top: 20px;
    .el-form-item {
      .tree-img {
        width: 18px;
        height: 18px;
        position: absolute;
        right: 6px;
        top: 10px;
      }
    }
    .el-form-item__label {
      width: 100px;
    }
    .el-form-item__content {
      margin-left: 100px;
    }
  }
  .timeline {
    margin-top: 30px !important;
  }
  .condition {
    display: flex;

    .name {
      color: white;
      font-size: 14px;
      line-height: 34px;
      text-align: right;
      width: 70px;
    }
  }

  .timetap {
    margin-top: 43px;
    display: flex;
  }
}
.comefrom {
  display: flex;
  margin-top: 38px !important;
}
.date-picker {
  color: #d6dcdd;
}
.same {
  display: flex;
  margin-top: 40px !important;
}
.same .el-slider .el-slider__input {
  right: -140px !important;
}
.vehicleContent {
  display: flex;
}

.cheyanse {
  width: 100%;
  .el-radio-group .el-radio-button__inner {
    width: 100%;
    line-height: 14px;
    margin-top: 8px;
    border: 1px solid #7ea5c9;
  }
  ::v-deep.el-radio-group .el-radio-button {
    margin-right: 5px;
    margin-bottom: 5px;
    &:first-child .el-radio-button__inner {
      border-radius: 0;
    }
  }
}
.cheyanse1 {
  display: flex;
  position: relative;
  .rightbtn {
    position: absolute;
    margin-top: 10px;
    right: 34px;
    bottom: 0;
    .el-button {
      width: 56px;
      height: 32px;
      background: transparent;
      color: white;
      border: 1px solid #7ea5c9;
    }
  }
  .el-radio-group {
    margin-right: 0;
  }
  ::v-deep.el-radio-group .el-radio-button {
    margin-right: 5px;
    margin-bottom: 5px;
    &:first-child .el-radio-button__inner {
      border-radius: 0;
    }
  }
}
.cheyanse1 .el-radio-group .el-radio-button__inner {
  width: 100%;
  line-height: 14px;
  margin-top: 10px;
  border: 1px solid #7ea5c9;
}
.morebtnwrapper {
  display: inline-block;
  vertical-align: middle;
  background: transparent;
  .el-button {
    background: transparent;
    color: white;
    border: 1px solid #7ea5c9;
    border-radius: 0;
    font-size: 14px;
  }
  .el-button [class*='el-icon-'] + span {
    margin-right: 0;
  }
  .el-button [class*='el-icon-'] + span {
    margin-left: 0;
  }
}
.el-radio-button--mini .el-radio-button__inner {
  font-size: 14px;
}
</style>
