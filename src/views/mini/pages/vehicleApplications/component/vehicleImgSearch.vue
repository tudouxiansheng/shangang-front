<template>
  <div class="vehicleImgSearchbox">
    <div class="block" style="padding-top: 60px" @click="uploadClick">
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        accept="image/*"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
          style="width: 146px; height: 146px"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <div class="block timetap">
      <span class="name">时间段：</span>
      <div class="formItem">
        <el-radio-group v-model="timeType" size="medium" @change="radioChange">
          <el-radio-button label="1">近三天</el-radio-button>
          <el-radio-button label="2">近七天</el-radio-button>
          <el-radio-button label="3">近一月</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="block">
      <div class="name"></div>
      <div class="date-picker">
        <el-date-picker
          style="width: 342px"
          v-model="dateValue"
          type="daterange"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        ></el-date-picker>
      </div>
    </div>
    <div class="block comefrom">
      <span class="name" style="width: 70px">来源：</span>
      <div class="comeformSelect">
        <el-select
          v-model="comefromType"
          filterable
          placeholder="来源"
          style="width: 98px; margin-right: 9px"
          @change="changeSelectComeFrom"
        >
          <el-option
            v-for="item in fileType"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="formItem">
        <el-input
          :placeholder="placeholder"
          @click.native="handleClickCamera"
          style="width: 233px"
        ></el-input>
        <img
          src="../../../../../assets/vehicleApp/tree.png"
          style="width: 18px; height: 18px"
        />
      </div>
    </div>
    <div class="block same">
      <span class="name threshold">相似度：</span>
      <div class="formItem formItem-threshold">
        <el-slider v-model="searchInfo.threshold" show-input> </el-slider>
      </div>
    </div>
    <div class="block" style="margin-top: 100px">
      <div style="text-align: center">
        <el-button type="primary" class="btnPrimary" @click="getVehicleCheck"
          >检<span style="display: inline-block; width: 12px"></span
          >索</el-button
        >
        <el-button
          type="primary"
          class="btnPrimary btnReset"
          @click="resetSearchInfo"
          >重<span style="display: inline-block; width: 12px"></span
          >置</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getUploadUrl, vehiclesearchByImage } from '@/utils/api.js'
import { getFormatDate, getDIYTime1, getFormatDate4 } from '@/utils/mutil'
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
      uploadUrl: '',
      imageUrl: '',
      timeType: '', //时间绑定值
      fileType: [
        {
          value: 1,
          label: '摄像机',
        },
        {
          value: 2,
          label: '视频文件',
        },
      ],
      comefromType: 1, //
      placeholder: '请选择摄像机',
      // 静态查询参数
      searchInfo: {
        threshold: 80,
        imageId: '',
        startTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
        image: {
          url: '',
          fileId: '',
        },
        cameraList: [],
      },
      dateValue: '选择时间',
    }
  },
  methods: {
    // 获取上传地址
    async uploadClick() {
      // 获取图片上传地址
      let res = await getUploadUrl({})
      if (res.resultCode === 0) {
        this.uploadUrl = res.uploadUrl
      }
    },

    // 图片上传成功
    async handleAvatarSuccess(res, file) {
      if (res.resultCode === 0) {
        this.searchInfo.imageId = res.fileId
        this.searchInfo.image.fileId = res.fileId
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    beforeAvatarUpload() {},
    // 以图搜人重置
    resetSearchInfo() {
      this.imageUrl = ''
      this.searchInfo.threshold = ''
      this.searchInfo.imageId = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.cameraList = []
      this.searchInfo.image.url = ''
      this.$emit('resetcamera')
    },
    //更改车辆来源
    changeSelectComeFrom() {
      if (this.comefromType == 1) {
        this.placeholder = `请选择摄像机`
      } else {
        this.placeholder = `请选择视频文件`
      }
    },
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.$emit('showCamerBox')
    },
    //选择时间
    radioChange() {
      // 如果是近三天
      if (this.timeType == '1') {
        this.dateValue = getDIYTime1(4)
      }
      // 如果是近七天
      else if (this.timeType == '2') {
        this.dateValue = getDIYTime1(3)
      }
      // 如果是近一个月
      else if (this.timeType == '3') {
        this.dateValue = getDIYTime1(5)
      }
      this.date_format()
    },
    // 日期格式处理
    date_format() {
      console.log(
        getFormatDate4(this.dateValue[0]),
        getFormatDate4(this.dateValue[1])
      )
      if (this.dateValue) {
        this.searchInfo.startTime = getFormatDate4(this.dateValue[0])
        this.searchInfo.endTime = getFormatDate4(this.dateValue[1])
      }
    },
    changeDate() {
      this.date_format()
    },
    timeChange() {
      this.date_format()
    },
    getVehicleCheck() {
      this.searchInfo.image.url = this.uploadUrl
      if (this.choseDeviceList) {
        for (let i = 0; i < this.choseDeviceList.length; i++) {
          this.searchInfo.cameraList = this.searchInfo.cameraList.concat(
            this.choseDeviceList[i].id
          )
        }
        // vehiclesearchByImage(this.searchInfo).then((res) => {
        //   console.log(res, "检索结果");
        // });
        this.$emit('openCheckResult')
      } else {
        //to
      }
    },
  },
  watch: {
    camernum: function (newValue, oldValue) {
      console.log(newValue, '摄像机')
      if (newValue > 0) {
        this.placeholder = `已选择${newValue}台摄像机`
      } else {
        this.placeholder = `请选择摄像机`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.vehicleImgSearchbox {
  .timeline {
    margin-top: 30px !important;
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
      width: 70px;
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
        border: 1px solid #7ea5c9;
      }
      .el-radio-group .el-radio-button:nth-child(2) .el-radio-button__inner {
        border-radius: 0;
      }
      .el-radio-group .el-radio-button:nth-child(1) .el-radio-button__inner {
        border-radius: 8px 0 0 8px;
      }
      .el-radio-group .el-radio-button:nth-child(3) .el-radio-button__inner {
        border-radius: 0px 8px 8px 0;
      }
      .el-radio-group .el-radio-button {
        margin-right: 0;
      }
      .el-radio-group .el-radio-button:nth-child(2) .el-radio-button__inner {
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
  .condition {
    padding-top: 38px;
    display: flex;
    .formItem1 {
      margin-left: 13px;
      line-height: 34px;
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
  .name {
    width: 70px;
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
.same {
  display: flex;
  margin-top: 40px !important;
}
.same .el-slider .el-slider__input {
  right: -140px !important;
}
</style>
