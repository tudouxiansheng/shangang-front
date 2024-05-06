<template>
  <div class="personSearch">
    <div class="pannel">
      <div class="title">人员检索</div>
      <div class="btn-tab">
        <div class="contentBtn" :class="{ unactive: !isUnactive }" @click="imgSearch">以图搜人</div>
        <div class="contentBtn" :class="{ unactive: isUnactive }" @click="contentSearch">条件搜索</div>
      </div>
      <!-- 以图搜人 -->
      <div v-if="isUnactive" class="content-wrapper">
        <div class="block" @click="uploadClick" style="justify-content: center">
          <div class="upload">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              accept="image/*"
            >
              <img class="avatar-img" v-if="imageUrl" :src="imageUrl" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="tips" v-if="!imageUrl">点击上传图片</div>
            </el-upload>
          </div>
        </div>
        <el-form label-suffix="：" :model="picturesearchInfo">
          <el-form-item label="检索类型">
            <el-radio-group v-model="searchInfo1.searchType">
              <el-radio label="1">人脸检索</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="算法名称">
            <el-select style="width: 100%" v-model="picturesearchInfo.algorithmAccessId">
              <el-option
                v-for="(item, index) in algorithmAccessList"
                :key="index"
                :label="item.accessName"
                :value="item.accessId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间段">
            <el-radio-group v-model="timeType" size="small" @change="radioChange">
              <el-radio-button label="1">近三天</el-radio-button>
              <el-radio-button label="2">近七天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
              <el-radio-button label="4">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              v-model="picturesearchInfo.beginTime"
              type="datetime"
              placeholder="开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              v-model="picturesearchInfo.endTime"
              type="datetime"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="来源">
            <el-input :placeholder="placeholder" @click.native="handleClickCamera">
              <img slot="suffix" src="../../../../assets/vehicleApp/tree.png" class="tree-img" />
            </el-input>
          </el-form-item>
          <el-form-item label="相似度">
            <el-slider v-model="picturesearchInfo.threshold" show-input> </el-slider>
          </el-form-item>
          <el-form-item label="图片质量">
            <el-slider v-model="picturesearchInfo.picValue" show-input> </el-slider>
          </el-form-item>
          <el-form-item>
            <div class="btn-group">
              <el-button type="primary" class="btnPrimary" @click="getPeopleList1">检索</el-button>
              <el-button type="primary" class="btnPrimary btnReset" @click="resetSearchInfo1">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 条件检索 -->
      <template v-else>
        <condition-search
          @showCamerBox="showCamerBox"
          :camernum="camernum"
          :choseDeviceList="choseDeviceList"
          @result="handleGetResult"
        ></condition-search>
      </template>
    </div>

    <!-- 检索详情 -->
    <search-detail
      class="componentPos"
      v-show="$store.state.searchDetail"
      :facedetail="facedetail"
      @renlianjiasuo="handlejiansuo"
    ></search-detail>
    <!-- 条件检索结果展开 -->
    <result-expansion
      class="componentPos1"
      @open="handleOpenTrack"
      v-show="$store.state.showSearchExpansion"
      :total="total"
      ref="result"
    ></result-expansion>
    <choseCamera
      v-if="choseCamera"
      @choseCameraBtn="choseCameraMethod"
      :choseDeviceList="choseDeviceList"
      :choseDeviceId="choseDeviceId"
      :camernum="camernum"
    ></choseCamera>
    <timeline :visible="timelineVisible" :data="trackInfos" @close="handleCloseTrack"></timeline>
  </div>
</template>
<script>
import searchDetail from './component/searchDetai'
import resultExpansion from './component/resultExpansion'
import timeline from '../../../../components/timeline'
import {
  getUploadUrl,
  facesearchByImage,
  algorithmAccess, //算法名称
} from '@/utils/api.js'
import { getDIYTime1, getFormatDate4, DateDiff } from '@/utils/mutil'
import choseCamera from '../vehicleApplications/choseCamera'
import ConditionSearch from './component/conditionSearch.vue'
import { AllcamMap } from '../../../../utils/map/AllcamMap'
import Dayjs from '../../../../utils/Dayjs'

export default {
  components: {
    'search-detail': searchDetail,
    'result-expansion': resultExpansion,
    choseCamera,
    timeline,
    'condition-search': ConditionSearch,
  },
  data() {
    return {
      // 控制以图搜人的显示与隐藏
      isUnactive: true,
      // 控制条件检索的显示与隐藏
      searchContent: true,
      //图片上传地址
      uploadUrl: '',
      // 图片服务器地址
      imageUrl: '',
      //时间绑定值
      timeType: '4',
      // 时间选择器选定的值
      dateValue: [],
      // 摄像机来源
      comefromType: [],
      // 检索类型
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
      total: 0,
      cameraList: [],
      choseCamera: null,
      // 静态（以图搜人）查询参数
      searchInfo1: {
        threshold: 80,
        imageId: '',
        district: '',
        courtId: '',
        faceReportPath: '',
        searchType: '1',
        imageQuality: 80,
        camera: '',
      },
      //图片查询参数
      picturesearchInfo: {
        threshold: 90,
        cameraList: [], //摄像机id列表
        beginTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        picValue: 90, //图片质量
        image: {
          url: '',
          fileId: '',
        },
        algorithmAccessId: '',
      },
      choseDeviceList: [],
      camernum: 0,
      // 具体年龄选择器
      dateValue1: [],

      // 检索类型： 1 以图搜人  2条件检索
      searchType: '1',
      // 控制以图搜人结果的显示与隐藏
      searchResultVisiable: false,
      // 控制检索详情的显示与隐藏
      searchDetailVisible: false,
      // 控制条件检索结果展开的显示与隐藏
      resultExpansionVisiable: false,
      timelineVisible: false,
      placeholder: '请选择摄像机',
      //算法列表
      algorithmAccessList: [],
      pictureSearchResult: [], //以图搜人结果
      facedetail: {}, //人员条件检索详情
      picture: true, //从意图搜人跳到详情还是布控调到详情
      choseDeviceId: [], //已选摄像机Id
      trackInfos: [],
    }
  },
  created() {
    this.radioChange()
    this.getAlgorithmAccess()
    if (this.$store.state.faceReportId && this.$store.state.facePath) {
      this.imageUrl = this.$store.state.facePath
      this.picturesearchInfo.image.fileId = this.$store.state.faceReportId
    }
  },
  methods: {
    handleGetResult(res) {
      this.total = res.pageInfo.totalNum
    },
    handleCloseTrack() {
      this.timelineVisible = false
      this.goBack()
    },
    goBack() {
      if (this.$store.state.pTab == 1) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 1)
      } else if (this.$store.state.pTab == 3) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 3)
      } else if (this.$store.state.pTab == 2) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 2)
      }
    },
    handleOpenTrack(infos) {
      console.log(infos)
      infos.map((item) => {
        item.time = Dayjs(item.hitTime).format('YYYY-MM-DD')
      })
      this.trackInfos = infos
      this.timelineVisible = true
    },
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.choseCamera = true
    },
    handlejiansuo(picture) {
      this.isUnactive = true
      this.searchDetailVisible = false
      this.imageUrl = picture
    },
    choseCameraMethod(camernum, cameraList) {
      this.choseCamera = false
      this.camernum = camernum

      this.choseDeviceList = cameraList
      var deviceId = []
      for (let i = 0; i < cameraList.length; i++) {
        deviceId = deviceId.concat(cameraList[i].id)
      }
      this.choseDeviceId = deviceId

      this.placeholder = `已选${camernum}台设备`
      this.choseCamera = false
      let hash = {}
      const data2 = cameraList.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
      //录像机id过滤
      for (let i = 0; i < data2.length; i++) {
        this.picturesearchInfo.cameraList = this.picturesearchInfo.cameraList.concat(data2[i].id)
      }
    },

    // 切换至以图搜人
    imgSearch() {
      this.showStaticResult = false
      this.isUnactive = true
      this.$store.commit('changepTab', 1)
    },
    // 切换至条件搜人
    contentSearch() {
      this.showSearchInfo = false
      this.isUnactive = false
      this.$store.commit('changepTab', 2)
      if (AllcamMap.map) {
        AllcamMap.map.removeTrack('111')
      }
    },

    //更改来源
    changeSelectComeFrom() {
      if (this.comefromType == 1) {
        this.placeholder = `请选择摄像机`
      } else {
        this.placeholder = `请选择视频文件`
      }
    },
    //以图搜人查询按钮
    getPeopleList1() {
      if (DateDiff(this.picturesearchInfo.beginTime, this.picturesearchInfo.endTime) > 30) {
        this.$message.warning('以图搜人时间间隔不能大于30天')
        return
      }
      sessionStorage.setItem('searchInfo3', JSON.stringify(this.picturesearchInfo))
      this.searchType = 1
      this.picturesearchInfo.image.url = this.imageUrl
      let hash = {}
      const data2 = this.choseDeviceList.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
      //data2是过滤之后的cameraid
      this.picturesearchInfo.cameraList = []
      for (let i = 0; i < data2.length; i++) {
        this.picturesearchInfo.cameraList.push(data2[i].id)
      }
      if (this.picturesearchInfo.image.url) {
        if (this.picturesearchInfo.beginTime && this.picturesearchInfo.endTime) {
          if (this.picturesearchInfo.cameraList.length > 0) {
            if (this.picturesearchInfo.algorithmAccessId) {
              facesearchByImage(this.picturesearchInfo).then((res) => {
                if (res.resultCode == 0) {
                  if (res.resultList) {
                    this.total = res.pageInfo.totalNum
                    this.$store.commit('pictureSearchResult', res.resultList)
                  }

                  this.$store.commit('setShowSearchResultVisible', 1)
                }
              })
              // this.$store.commit("pictureSearchResult", [
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-20 15:11:16",
              //     confidence: 99.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717155036775PEnapW7N1RX.jpeg?encrypt=b_FI5c_UeLNPAD07KkAl1Q&expires=1627370669",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717155036727QFO9qTrzkQw.jpeg?encrypt=D7JIV8_O8qvLOkohyWxwkA&expires=1627370457",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-20 14:20:31",
              //     confidence: 97.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717155036780NOwI0vtdrmK.jpeg?encrypt=7a8Vk9EjCwMnNKyEh2Mnww&expires=1627370782",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term202107171550367292AAI6ghLkjv.jpeg?encrypt=__42Hwt54_vVXtoLr57tGw&expires=1627370457",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-20 08:20:30",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717155024024o9OC8iHHGRu.jpeg?encrypt=SNYETmzioi5-9Wx37quP8A&expires=1627370813",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term202107171550240167HA5o6DpSLJ.jpeg?encrypt=6atkgf4t9UsP5VkNUL7LnA&expires=1627370457",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-19 11:46:09",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term202107171549511488JGzdqVxZyg.jpeg?encrypt=ETGy40TbhbDjFizIiKEemQ&expires=1627370884",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154951101icU3243pGAm.jpeg?encrypt=WGCWeM68hDaF22rfZP4j-w&expires=1627370457",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-19 11:46:18",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154951150ic3cSqLrL7L.jpeg?encrypt=FakdvxsjMMiRhXEp0Xve7A&expires=1627370911",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154951101UoTLk4xGGKI.jpeg?encrypt=1cTjddXsA00URIhXo9l5hw&expires=1627370457",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-19 20:48:57",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154812343q3gdEZKSlh1.jpeg?encrypt=DtYjye39vQVxscQG6dfyNQ&expires=1627370953",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154812333ZYO681ZnxZt.jpeg?encrypt=7nSv4_liqryI60A-WGYlfg&expires=1627370928",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-19 21:02:19",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term20210717153152807PGYhFaYjjg1.jpeg?encrypt=kdxIyux7DORUJctopQVHnQ&expires=1627370981",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term20210717153152760sAXUGowQj66.jpeg?encrypt=d5qUbSGNN0CsjAH-OhsO5A&expires=1627370969",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-19 22:19:36",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term20210717153037747QUeOP5iXboW.jpeg?encrypt=ncYp4e8Sxijm1SJhyZJITg&expires=1627371008",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term20210717153037699DPl0g4Qign7.jpeg?encrypt=Sfhwrqk_VR4LE0I2Ktq9Hw&expires=1627370996",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              //   {
              //     cameraId: "00000021071714010301000000000018",
              //     cameraName: "人脸抓拍机-正门",
              //     captureTime: "2021-07-20 09:06:00",
              //     confidence: 96.0,
              //     gender: 2,
              //     ageValue: 0,
              //     eyeGlass: 0,
              //     mouthMask: 0,
              //     hat: 0,
              //     detectUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term20210717153036822P3WuKnTZh7b.jpeg?encrypt=S_-o5i1Vn9OKJn07DbsNWg&expires=1627371041",
              //     captureUrl:
              //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term2021071715303681458IDE2CzXiO.jpeg?encrypt=-XniUlXz43dBfQPrPVh_lg&expires=1627370996",
              //     picValue: 99.0,
              //     age: 25,
              //   },
              // ]);
              this.$store.commit('setShowSearchResultVisible', 1)
            } else {
              this.$alert('请选择算法', '提示')
            }
          } else {
            this.$alert('请选择摄像机', '提示')
          }
        } else {
          this.$alert('请选择开始和结束时间', '提示')
        }
      } else {
        this.$alert('请上传图片', '提示')
      }
    },
    // 以图搜人重置
    resetSearchInfo1() {
      for (let [k, v] of Object.entries(this.picturesearchInfo)) {
        if (this.picturesearchInfo[k] instanceof Array) {
          this.picturesearchInfo[k] = []
        } else if (typeof this.picturesearchInfo[k] == 'object') {
          this.picturesearchInfo.image.url = ''
          this.picturesearchInfo.image.fileId = ''
        } else {
          this.picturesearchInfo[k] = ''
        }
      }
      this.dateValue = []
      this.imageUrl = ''
      this.camernum = 0
      this.cameraList = []
      this.choseDeviceId = []
      this.placeholder = '请选择摄像机'
    },

    //条件检索显示摄像机
    showCamerBox() {
      this.choseCamera = true
    },
    //获取算法
    getAlgorithmAccess() {
      let data = {
        pageInfo: { pageNum: 1, pageSize: 10 },
      }
      algorithmAccess(data).then((res) => {
        if (res.resultCode == 0) {
          this.algorithmAccessList = res.algorithmAccessList
        }
      })
    },
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
        this.picturesearchInfo.image.fileId = res.fileId
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    // 时间按钮发生变化时
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
      this.picturesearchInfo.beginTime = s
      this.picturesearchInfo.endTime = e
    },
  },
}
</script>
<style lang="scss" scoped>
.bottom-btn {
  justify-content: center;
  margin-top: 30px;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 30px 15px 20px 25px;
  box-sizing: border-box;
  .btn-group {
    display: flex;
    width: 300px;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    .btn {
      flex: 1;
    }
    .checkleft {
      margin-right: 20px;
    }
    .btnPrimary {
      width: 100%;
      height: 40px;
      background: #00ccff;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .tree-img {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 5px;
    top: 6px;
  }
  ::v-deep.el-form {
    .el-form-item__label {
      width: 100px;
    }
    .el-form-item__content {
      margin-left: 100px;
    }
  }
}
.upload {
  width: 148px;
  height: 156px;
}
.personSearch {
  font-size: 16px;
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
  .pannel {
    width: 100%;
    height: 100%;
    padding: 10px 30px 10px 10px;
    box-sizing: border-box;
    .btn-tab {
      display: flex;
      margin-top: 20px;
      margin-bottom: 30px;
      height: 40px;
      align-items: center;
      justify-content: center;
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
    }
    .title {
      padding-top: 16px;
      padding-left: 16px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
    }
    .block {
      display: flex;
      align-items: center;
      color: #fff;
      margin-bottom: 15px;
      margin-right: 20px;

      .name {
        display: inline-block;
        width: 80px;
        text-align: right;
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
      .comeformSelect {
        display: inline-block;
      }
      .formItem {
        display: inline-block;
        margin-left: 6px;
        flex: 1;
        .el-radio-group .el-radio-button__inner {
        }
      }
      .formItem-threshold {
        //padding-top: 20px;
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
  }
  // 搜索弹框
  .infoDiv {
    // box-sizing: border-box;
    // padding-left: 25px;
    pointer-events: auto;
    width: 480px;
    //   height: 370px;
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
    }
  }
  .moreProperty {
    height: 150px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .componentPos {
    right: 530px;
    top: 80px;
  }
  .componentPos1 {
    right: 530px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.avatar-uploader .avatar-uploader-icon {
  height: 80px;
  color: white;
  line-height: 106px;
  font-weight: 700;
}
.avatar-uploader {
  width: 100%;
  height: 100%;
}
.avatar-uploader img {
  width: 100%;
  height: 100%;
}
.avatar-uploader .tips {
  height: 70px;
}
</style>
