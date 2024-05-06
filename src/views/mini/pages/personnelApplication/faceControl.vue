<template>
  <div class="faceControl">
    <div class="pannel">
      <div class="title">人脸布控</div>
      <el-form label-suffix="：" :model="searchInfo">
        <el-form-item label="布控名称">
          <el-input clearable placeholder="请输入布控名称搜索" v-model="searchInfo.guardName" style="width: 410px">
            <i class="el-icon-search el-input__icon" slot="suffix"> </i>
          </el-input>
        </el-form-item>
        <el-form-item label="布控库">
          <el-select v-model="searchInfo.repositoryId" clearable filterable placeholder="请选择布控库" class="select">
            <el-option
              v-for="item in repositoryList"
              :key="item.repositoryId"
              :label="item.repositoryName"
              :value="item.repositoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段">
          <div class="date-time-wrapper">
            <el-radio-group v-model="timeType" size="small" @change="radioChange">
              <el-radio-button label="1">近三天</el-radio-button>
              <el-radio-button label="2">近七天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
              <el-radio-button label="4">自定义</el-radio-button>
            </el-radio-group>
            <div class="time-quick">自定义时间范围最大为30天</div>
          </div>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            v-model="searchInfo.startTime"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            v-model="searchInfo.endTime"
            type="datetime"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="告警等级">
          <el-radio-group v-model="searchInfo.alarmLevel">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">非常紧急</el-radio>
            <el-radio :label="2">紧急</el-radio>
            <el-radio :label="3">一般</el-radio>
            <el-radio :label="4">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-search" @click="searchControl">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="block" style="justify-content: center; margin-top: 31px; margin-bottom: 0px"></div>
      <div class="result" style="padding-top: 15px">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span class="name">查询结果</span>
          <div @click="refresh" class="refresh">
            <img src="../../../../assets/faceSearch/refresh.png" alt="" />
            <span class="name" style="color: #00ccff" @click="refresh">刷新</span>
          </div>
        </div>
        <!-- 查询结果table -->
        <div class="guardList" style="height: 490px">
          <div v-for="(item, index) in guardList" :key="index">
            <div class="detail" @click="controlDetail(item.guardId)" style="cursor: pointer">
              <div class="detailTitle">
                <div class="left">
                  <img src="../../../../assets/faceSearch/person.png" alt="" style="vertical-align: middle" />
                  <span>{{ item.guardName }}</span>
                </div>
                <span v-if="item.guardPeriod == 2">7*24小时布控</span>
                <span v-if="item.guardPeriod == 1">24小时布控</span>
              </div>
              <div class="detailTitle controlTime">
                <div style="line-height: 28px">
                  <span style="color: #1efffc">布控剩余时间：</span>
                  <span>{{ item.leftDays }}天</span>
                </div>
                <div class="alarmLevel jinji" v-if="item.alarmLevel == 1">非常紧急</div>
                <div class="alarmLevel morejin" v-if="item.alarmLevel == 2">紧急</div>
                <div class="alarmLevel yiban" v-if="item.alarmLevel == 3">一般</div>
                <div class="alarmLevel di" v-if="item.alarmLevel == 4">低</div>
              </div>
              <div class="detailTitle" style="margin-top: 15px; display: flex">
                <div style="flex: 1">
                  <span style="color: #1efffc">创建人：</span>
                  <span>{{ item.createUser }}</span>
                </div>
                <div class="alarmLevel jinji">
                  <span style="color: #1efffc">创建时间：</span>
                  <span>{{ item.createTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 布控详情弹框 -->
    <div v-if="showControlDetail" class="controlDetail">
      <div class="titleTop">
        <span class="title">任务详情</span>
        <img class="closeImg" @click="closeControlDetail" src="../../../../assets/vehicleApp/close.png" alt="" />
      </div>
      <div class="title" style="color: #ffffff; margin-top: 10px">
        {{ controlDetails.guardName }}
      </div>
      <div class="pDiv">
        <div class="basicInfo">
          <div class="baseInfoRow">
            <span
              >告警总数：<span style="color: #ffd200">{{ controlDetails.allAlarm }}</span></span
            >
            <span
              >今日告警：<span style="color: #ffd200">{{ controlDetails.curAlarm }}</span></span
            >
          </div>
          <div class="baseInfoRow">
            <span
              >时间范围：<span></span>{{ controlDetails.beginTime.slice(0, 10) }}至
              {{ controlDetails.endTime.slice(0, 10) }}</span
            >
            <span
              >已布控天数：<span>{{ controlDetails.guardDays }}天</span></span
            >
          </div>
          <div class="baseInfoRow">
            <div style="flex: 1; display: flex">
              布控范围：
              <div v-for="(ele, index) in controlDetails.repositoryList" :key="index">
                {{ ele.repositoryName + ';' }}
              </div>
            </div>
            <!-- <div style="flex:1">
              <div
                >布控对象：<div
                  v-for="ele in controlDetails.sourceList"
                  :key="ele.deviceId"
                  >{{ ele.sourceName ? ele.sourceName : "无" + ";" }}</div
                ></div
              >
            </div> -->
          </div>
          <div class="baseInfoRow">
            <span
              >创建人：<span>{{ controlDetails.createUser }}</span></span
            >
            <span
              >创建时间：<span>{{ controlDetails.createTime }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="pDiv">
        <ul class="alarmDetail" style="background: rgba(0, 204, 255, 0.2); padding: 10px 0px">
          <li>告警内容</li>
          <li>相似度</li>
          <li>布控设备</li>
          <li>命中库</li>
          <li>告警时间</li>
        </ul>
      </div>
      <div class="pDiv">
        <div class="alarmDetailBg">
          <div
            v-for="(item, index) in guardHitList"
            :key="index"
            class="roomDetail"
            @click="alarmDetailClick(index)"
            style="
              margin: 10px 0px;
              padding: 4px 0px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #ecf7f7;
              cursor: pointer;
            "
          >
            <li title="详情" class="centerItem">
              <img :src="item.captureImage" alt="" style="height: 68px; width: 68px" />
            </li>

            <li title="详情" class="centerItem">{{ item.similarity }}%</li>
            <li title="详情" class="centerItem">{{ item.deviceName }}</li>
            <li title="详情" class="centerItem">{{ item.repositoryName }}</li>
            <li title="详情" class="centerItem">{{ item.hitTime }}</li>
          </div>
        </div>
      </div>
      <div class="pDiv" style="display: flex; flex-direction: row-reverse" @click="moreAlrmClick">
        <!-- <span style="color: #00ccff; cursor: pointer">查看更多></span> -->
      </div>
    </div>

    <!-- 警告详情/检索详情 -->
    <div v-if="showAlrmDetail" class="controlAlarmDetail">
      <div style="flex: 1">
        <div class="title">
          <span>检索详情</span>
        </div>
        <div class="pDiv">
          <div class="vedio" @click="toImgeSearch">
            <img
              :src="alarmDetail.captureImage"
              alt=""
              style="width: 100%; height: 100%; margin-left: 50%; transform: translateX(-50%)"
            />
          </div>
        </div>
        <div class="pDiv">
          <div class="vedioBtn">
            <div @click="shikuang" style="cursor: pointer">
              <img src="../../../../assets/faceSearch/shikuang.png" alt="" style="vertical-align: middle" />
              <span style="padding-left: 5px">实况</span>
            </div>
            <div style="cursor: pointer" @click="huifang">
              <img src="../../../../assets/faceSearch/huifang.png" alt="" style="vertical-align: middle" />
              <span style="padding-left: 5px">回放</span>
            </div>
            <!-- <div @click="toFaceSearch" style="cursor: pointer">
              <img
                src="../../../../assets/faceSearch/jiansuo.png"
                alt=""
                style="vertical-align: middle"
              />
              <span style="padding-left: 5px">人脸检索</span>
            </div> -->
            <div @click="toFaceSearch">
              <img
                src="../../../../assets/faceSearch/renlian.png"
                alt=""
                style="vertical-align: middle; width: 21px; height: 21px; margin-left: 35px"
              />
              <span style="padding-left: 5px">人脸检索</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 分割 -->
      <div style="flex: 1; position: relative">
        <div class="pDiv">
          <div class="imgs">
            <!-- 抓拍 -->
            <div style="width: 110px; text-align: center">
              <img :src="alarmDetail.captureSmallImage" alt="" style="width: 110px; height: 83px" />
              <div style="width: 100%; text-align: center">抓拍</div>
            </div>
            <!-- 布控库 -->
            <div style="width: 110px; margin-left: 25px">
              <img :src="alarmDetail.facePhoto" alt="" style="width: 110px; height: 83px" />
              <div style="width: 110px; text-align: center">布控库</div>
            </div>
          </div>
        </div>
        <el-button type="primary" class="btnprimaryback" calarmDetailslass="btnPrimary" @click="goBack"
          >返<span style="display: inline-block; width: 12px"></span>回</el-button
        >
        <div class="pDiv" style="margin-top: 5px">
          <div style="margin-top: 17px; display: flex">
            <div class="alarmDetails gaojing">告警等级:&nbsp;</div>
            <div class="alarmLevel jinji" v-if="alarmDetail.alarmLevel == 1">非常紧急</div>
            <div class="alarmLevel morejin" v-if="alarmDetail.alarmLevel == 2">紧急</div>
            <div class="alarmLevel yiban" v-if="alarmDetail.alarmLevel == 3">一般</div>
            <div class="alarmLevel di" v-if="alarmDetail.alarmLevel == 4">低</div>
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >告警时间: <span class="white">{{ alarmDetail.hitTime }}</span></span
            >
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >告警源名称：<span class="white">{{ alarmDetail.deviceName }}</span></span
            >
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >告警源编码：<span class="white">{{ alarmDetail.deviceId }}</span></span
            >
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >告警类型：<span class="white">{{ alarmDetail.alarmName }}</span></span
            >
          </div>
          <!-- <div style="margin-top: 15px">
            <span class="alarmDetails"
              >告警事件：<span class="white">相似度超过阈值</span></span
            >
          </div> -->
          <div style="margin-top: 15px">
            <span class="alarmDetails" v-if="alarmDetail.gender"
              >性别：<span class="white">{{ alarmDetail.gender == 1 ? '男' : '女' }}</span>
            </span>
            <span class="alarmDetails" v-else>性别：<span class="white">未知</span></span>
          </div>
          <div style="margin-top: 15px">
            <span class="alarmDetails"
              >年龄：<span class="white" v-if="alarmDetail.age">{{ alarmDetail.age }}</span>
              <span v-else class="white"> 暂无</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Dayjs from '../../../../utils/Dayjs'
import {
  getGuardList,
  queryFaceList,
  getGuardInfo,
  getGuardHitList,
  getUploadUrl,
  getDownloadUrl,
  getScsGuardList,
} from '../../../../utils/api'

import { AllcamMap } from '@/utils/map/AllcamMap'
export default {
  data() {
    return {
      // 布控库列表信息
      repositoryList: [],
      // 时间绑定值
      timeType: '4',
      dateValue: [],
      // 查询参数
      searchInfo: {
        // 布控名称
        guardName: '',
        // 布控库id
        repositoryId: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 告警等级
        alarmLevel: 0,
        pageInfo: {
          pageNum: 1,
          pageSize: 5000,
        },
        guardType: 1,
      },

      // 查询结果
      guardList: [],
      guardHitList: [], //布控命中
      // 控制布控详情弹框的显示与隐藏
      showControlDetail: false,
      // 布控详情信息
      controlDetails: [],
      // 布控详情结果信息列表
      listAlarm: [
        {
          id: 111,
          captureUrl: '',
          similarity: 0.00566,
          cameraName: 'camera-1',
          repositoryName: '布控库1',
          hitTime: '2021-5-1 12:22:56',
        },
      ],
      // 控制检索详情弹框的显示与隐藏
      showAlrmDetail: false,

      // 告警总数
      alarmTotal: 0,
      // 今日告警总数
      todayAlarmTotal: 0,
      // 文件上传地址
      uploadUrl: '',
      // 告警详情
      alarmDetail: { faceUrl: '', idPhotoUrl: '', hitTime: '' },
    }
  },
  created() {
    if (AllcamMap.map) {
      AllcamMap.map.clearAllPlots()
    }
  },
  mounted() {
    this.radioChange()
    //人员布控库
    this.getQueryFaceList()
    //布控列表
    this.searchControl()
  },
  methods: {
    //查询人脸布控列表
    async searchControl() {
      let res = await getScsGuardList(this.searchInfo)
      if (res.resultCode === 0) {
        if (res.guardList) {
          var guardList = res.guardList.filter(function (item) {
            // return item.guardType == 1
            return item.guardType == 1 && item.leftDays > 0
          })
          this.guardList = guardList
        } else {
          this.guardList = []
        }
      }
    },
    refresh() {
      this.searchControl()
    },
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
      this.searchInfo.startTime = s
      this.searchInfo.endTime = e
    },
    // 布控详情
    async controlDetail(guardId) {
      let res1 = await getGuardInfo({ guardId: guardId })
      if (res1.resultCode === 0) {
        this.controlDetails = res1
        let guardId = this.controlDetails.guardId
        let res2 = await getGuardHitList({
          guardId: guardId,
          pageInfo: { pageNum: 1, pageSize: 500 },
        })

        if (res2.resultCode === 0) {
          if (res2.guardHitList) {
            this.guardHitList = res2.guardHitList
          }

          // console.log(res2.guardHitList, 'res,hiot')

          //详情没打开再打开，打开了就关闭当前点击的详情
          if (this.showAlrmDetail == false) {
            this.showControlDetail = true
          } else {
            this.$nextTick(() => {
              this.showAlrmDetail = false
            })
          }
        }
      }
    },
    // 关闭布控详情对话框
    closeControlDetail() {
      this.showControlDetail = false
    },
    // 告警详情
    alarmDetailClick(index) {
      this.showControlDetail = false
      this.showAlrmDetail = true
      this.alarmDetail = this.guardHitList[index]
    },
    // 更多历史告警记录
    moreAlrmClick() {
      // this.$router.push({ path: "/minivisionAlarm", query: { type: 2 } });
    },
    // 返回布控详情
    goBack() {
      this.showAlrmDetail = false
      this.showControlDetail = true
    },
    // 实况
    shikuang() {
      let param = {
        dialogId: 'faceControlShikuang',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
      }
      window.webkitProc('realtime-play', JSON.stringify(param))
    },
    huifang() {
      let param = {
        dialogId: 'faceControlDetailRecord',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
        startTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        recordMethod: 0,
      }
      window.webkitProc('record-playback', JSON.stringify(param))
    },
    // 跳转至人脸检索
    toFaceSearch() {
      this.imageDeal()
    },
    // 图片处理
    imageDeal() {
      let that = this
      let img = this.alarmDetail.captureSmallImage
      let image = new Image()
      image.crossOrigin = ''
      image.src = img
      image.onload = function () {
        // 将图片绝对路径转换为base64
        let base64 = that.getBase64Image(image)
        // 将base64换为blob类型
        let img2 = that.convertBase64UrlToBlob(base64)
        // 将blob转换为file对象
        let myfile = new File([img2], img)
        // 获取文件上传地址
        that.getUploadUrl(myfile)
      }
    },
    // 获取文件上传地址
    async getUploadUrl(myfile) {
      let res1 = await getUploadUrl({})
      if (res1.resultCode === 0) {
        this.uploadUrl = res1.uploadUrl
        // 文件上传
        let myformData = new FormData()
        myformData.append('file', myfile, new Date().getTime())
        let res2 = await this.$postFetch(this.uploadUrl, myformData)
        if (res2.data.resultCode == 0) {
          this.$store.commit('set_faceReportId', res2.data.fileId)
          let res3 = await getDownloadUrl({
            fileId: this.$store.state.faceReportId,
          })
          if (res3.resultCode == 0) {
            this.$store.commit('set_facePath', res3.downloadUrl)
            // 触发人脸检索的点击事件
            this.$emit('activeSearch')
          }
        }
      }
    },
    convertBase64UrlToBlob(base64) {
      var urlData = base64.dataURL
      var type = base64.type
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: type })
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return {
        dataURL: dataURL,
        type: 'image/' + ext,
      }
    },
    fileChange() {
      let file = document.getElementById('file').files[0]
    },

    async getQueryFaceList() {
      let res = await queryFaceList({
        pageInfo: {
          pageNum: 1,
          pageSize: 5000,
        },
      })
      if (res.resultCode === 0) {
        this.repositoryList = res.repositoryList
      }
    },

    // toImgeSearch() {
    //   this.$emit("personSearch", "perm20210402114306569XsVu4L91Gvx");
    // },
  },
}
</script>
<style lang="scss" scoped>
.date-time-wrapper {
  .time-quick {
    color: #d6dcdd;
  }
}
.btn-search {
  width: 200px;
  height: 40px;
  background-color: #00ccff;
  margin: 0 auto;
}
.faceControl {
  ::-webkit-scrollbar-track {
    background-color: #1e2c45 !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #2e4c90 !important;
    border-radius: 3px;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    // background-color: #2e4c90 !important;
    background-color: #00ccff !important;
    border-radius: 3px;
  }
  width: 100%;
  height: 100%;
  background: url('../../../../assets/buildingSeting/background.png') no-repeat;
  background-size: 100% 100%;
  padding: 20px;
  .pannel {
    width: 100%;
    height: 100%;
    .select {
    }
    ::v-deep.el-form {
      .el-form-item__label {
        width: 100px;
      }
      .el-form-item__content {
        margin-left: 100px;
      }
    }
    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
      margin-bottom: 30px;
    }

    .result {
      width: 100%;
      .refresh {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          margin-left: 5px;
        }
      }
      .guardList {
        height: 284px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        font-size: 14px;
        -ms-overflow-style: none;
      }
      .name {
        text-align: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #edf6f7;
        line-height: 36px;
      }
      .detail {
        box-sizing: border-box;
        width: 100%;
        background-color: rgba(20, 47, 72, 0.65);
        margin-bottom: 25px;
        padding: 10px;
        .detailTitle {
          display: flex;
          justify-content: space-between;
          width: 100%;
          color: #ffffff;
          align-items: center;
          .left {
            flex: 1;
            display: flex;
            align-items: center;
            img {
              margin-right: 5px;
            }
          }
        }
        .controlTime {
          margin-top: 20px;
          .alarmLevel {
            text-align: center;
            padding: 6px 10px;
            font-size: 14px;
            border-radius: 4px;
          }
          .jinji {
            border: 1px solid #ff0000;
            color: #ff0000;
          }
          .morejinji {
            border: 1px solid #ff4e00;
            color: #ff4e00;
          }
          .yiban {
            border: 1px solid #fa9a3d;
            color: #fa9a3d;
          }
          .di {
            border: 1px solid #94d73e;
            color: #94d73e;
          }
        }
      }
    }
  }
  .controlDetail {
    width: 645px;
    position: fixed;
    right: 540px;
    top: 100px;
    padding: 20px;
    // background: rgba(20, 47, 72, 0.65);
    background: url('./images/645.png');
    background-size: 100% 100%;
    .titleTop {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .title {
        color: #1efffc;
      }
      .closeImg {
        cursor: pointer;
        width: 10px;
        height: 10px;
      }
    }
    .title {
      color: #1efffc;
    }

    .pDiv {
      box-sizing: border-box;
      width: 100%;
      color: #ffffff;
      font-size: 14px;
      .basicInfo {
        padding-top: 20px;
        width: 100%;
        .baseInfoRow {
          display: flex;
          margin-bottom: 20px;
          span:nth-child(1) {
            flex: 1;
          }
          span:nth-child(2) {
            flex: 0.8;
          }
          .ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
      }
      .alarmDetail {
        display: flex;
        justify-content: center;
        justify-content: space-around;
        margin-top: 10px;
        color: #f1fefe;
        font-size: 14px;
        li {
          flex: 1;
          text-align: center;
          &:last-child {
            flex: 1.5;
          }
        }
      }
      .alarmDetailBg {
        width: 100%;
        font-size: 14px;
        overflow-y: auto;
        height: 344px;
        .roomDetail {
          display: flex;
          justify-content: center;
          justify-content: space-around;
          li {
            flex: 1;
            text-align: center;
            &:last-child {
              flex: 1.5;
            }
          }
        }
        .roomDetail:hover {
          background: #00ccff;
          opacity: 0.8;
        }
      }
    }
  }
  .controlAlarmDetail {
    display: flex;
    width: 880px;
    height: 450px;
    position: fixed;
    right: 520px;
    top: 50%;
    transform: translateY(-50%);
    background: url('./images/800.png');
    background-size: 100% 100%;
    .title {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-left: 15px;
      margin-right: 20px;
      height: 34px;
      color: #1efffc;
    }
    .pDiv {
      margin-top: 10px;
      box-sizing: border-box;
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
      color: #ffffff;
      font-size: 14px;
      .vedio {
        width: 400px;
        height: 300px;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .vedioBtn {
        display: flex;
        width: 380px;
        height: 20px;
        margin-left: 50%;
        transform: translateX(-50%);
        div {
          flex: 1;
        }
      }
      .imgs {
        display: flex;
        width: 300px;
        margin-left: 50%;
        margin-top: 60px;
        justify-content: space-between;
        transform: translateX(-50%);
        div {
          flex: 1;
        }
      }
      .alarmDetails {
        color: #1efffc;
        font-size: 14px;
      }
      .gaojing {
        line-height: 26px;
      }
      .jinji {
        border: 1px solid #ff0000;
        color: #ff0000;
      }
      .alarmLevel {
        text-align: center;
        padding: 3px;
        font-size: 14px;
        border-radius: 4px;
      }
      .white {
        color: #edf6f7;
      }
      .morejinji {
        border: 1px solid #ff4e00;
        color: #ff4e00;
      }
      .yiban {
        border: 1px solid #fa9a3d;
        color: #fa9a3d;
      }
      .di {
        border: 1px solid #94d73e;
        color: #94d73e;
      }
    }
  }
}
.centerItem {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btnprimaryback {
  position: absolute;
  top: 16px;
  right: 15px;
  background-color: #00ccff !important;
}
.time44 {
  .el-radio-group .el-radio-button__inner {
    background: transparent;
    color: #fefefe;
    border: 1.5px solid #7ea5c9;
    height: 32px;
    line-height: 10px;
  }
}
</style>
