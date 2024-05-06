<template>
  <div id="communityAnnounce">
    <div class="announceMain" v-if="!dialogShow">
      <div class="searchDiv">
        <div class="block" style="justify-content: flex-start">
          <span class="name" style="margin-left: 29px; margin-right: 2px"
            >时间：</span
          >
          <el-radio-group
            v-model="timeType"
            size="medium"
            @change="radioChange"
          >
            <el-radio-button label="1">近七天</el-radio-button>
            <el-radio-button label="2">近十五天</el-radio-button>
            <el-radio-button label="3">近一月</el-radio-button>
          </el-radio-group>
        </div>

        <div class="block" style="justify-content: flex-start">
          <el-date-picker
            style="width: 352px; margin-left: 3px"
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          ></el-date-picker>
        </div>

        <div class="block">
          <el-input
            v-model="searchForm.noticeTitle"
            style="width: 340px; margin-left: 220px"
            placeholder="搜索公众标题,公众内容"
            clearable
          ></el-input>
        </div>
      </div>

      <div
        class="block"
        style="
          display: flex;
          justify-content: center;
          margin-top: 25px;
          margin-bottom: 30px;
        "
      >
        <el-button
          type="primary"
          class="btnPrimary"
          style="margin-right: 40px"
          @click="searchInfo"
          >查<span style="display: inline-block; width: 12px"></span
          >询</el-button
        >
        <el-button
          type="primary"
          class="btnPrimary btnReset"
          @click="resetSearchForm"
          >重<span style="display: inline-block; width: 12px"></span
          >置</el-button
        >
      </div>

      <ul class="announceUl">
        <li
          v-for="(item, index) in announceList"
          :key="index"
          class="announceLi"
          @click="showInfo(item)"
        >
          <div class="leftDiv" style="width: 100%">
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
              "
            >
              <span style="color: #1efffc">{{ item.noticeTitle }}</span
              ><span>{{ item.updateTime }}</span>
            </div>
            <div v-html="item.noticeContent">{{ item.noticeContent }}</div>
            <div
              style="
                justify-content: space-between;
                margin-bottom: 20px;
                color: #50c7ff;
                width: 100%;
                text-align: right;
              "
            >
              发布人：{{ item.senderUserName }}
            </div>
          </div>
        </li>
      </ul>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageInfo.pageNum"
        :page-size="searchForm.pageInfo.pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        style="text-align: right"
      ></el-pagination>
    </div>
    <div class="announceDialog" v-else>
      <el-button
        style="
          position: absolute;
          left: 20px;
          top: 20px;
          border: 1px solid #b5bdbf;
          border-radius: 4px;
          background: transparent;
          height: 40px;
          width: 100px;
          color: white;
        "
        @click="clickF"
        >返 回</el-button
      >
      <div class="topDiv">
        <div class="titleDiv">公告详情</div>
      </div>
      <div class="mainDiv">
        <li class="announceLiInfo">
          <div class="leftDiv">
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
              "
            >
              <span style="color: #1efffc; font-size: 18px">{{
                infoObj.noticeTitle
              }}</span>
              <span>{{ infoObj.updateTime }}</span>
            </div>
            <div
              style="
                display: flex;
                margin-bottom: 20px;
                color: #50c7ff;
                align-items: center;
                flex-wrap: wrap;
              "
            >
              <!-- <span>发布人：{{ infoObj.senderUserName }}</span> -->
              <div
                v-for="(item1, index2) in infoObj.noticeReceiverInfoList"
                :key="index2"
                style="
                  border: 1px solid #50c7ff;
                  border-radius: 4px;
                  padding: 6px;
                  box-sizing: border-box;
                  font-size: 12px;
                  margin-left: 79px;
                  margin-bottom: 20px;
                  min-width: 60px;
                  text-align: center;
                "
              >
                {{ item1.receiverName }}
              </div>
            </div>

            <div
              v-if="infoObj.noticeFileMapList.length > 0"
              style="height: 240px; overflow-y: auto"
            >
              <div
                class="imgDiv"
                v-for="(item1, index2) in infoObj.noticeFileMapList"
                :key="index2"
              >
                <img
                  v-if="item1.noticeFileType == 1"
                  :src="item1.noticeFileUrl"
                  alt=""
                  class="dialogImg"
                />

                <video
                  controls="controls"
                  style="width:20, height:240"
                  v-if="item1.noticeFileType == 2"
                  :src="item1.noticeFileUrl"
                  class="dialogImg"
                />
              </div>
              <!-- <div class="imgTitle">{{ infoObj.noticeTitle }}</div> -->
            </div>
            <div
              v-if="infoObj.noticeFileMapList.length == 0"
              v-html="infoObj.noticeContentHtml"
              style="height: 480px; overflow-y: auto"
            >
              {{ infoObj.noticeContentHtml }}
            </div>
            <div
              v-else
              v-html="infoObj.noticeContentHtml"
              style="min-height: 63px"
            >
              {{ infoObj.noticeContentHtml }}
            </div>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
import { getFormatDate2, getFormatDate, getDIYTime1 } from '@/utils/mutil'
import { noticeDetail, noticeList } from '@/utils/api'
export default {
  data() {
    return {
      timeType: '',
      announceList: '',
      searchForm: {
        noticeTitle: '',
        startTime: '',
        endTime: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      dateValue: [],

      pageNum: 1,
      pageSize: 10,
      number: '10',
      numberList: [10, 20, 30, 40, 50], //每页显示数量,
      total: 10,
      dialogShow: false,
      infoObj: {},
    }
  },
  async created() {},
  mounted() {
    this.noticeList()
  },
  methods: {
    noticeList() {
      var data = {
        noticeType: '',
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }
      noticeList(data).then((res) => {
        if (res.resultCode == 0) {
          this.announceList = res.noticeInfoList
          this.total = res.pageInfo.totalNum
          //规避转义字符
          let reg = new RegExp('&amp;nbsp;', 'g')
          for (let i = 0; i < this.announceList.length; i++) {
            let content = this.announceList[i].noticeContent
            this.announceList[i].noticeContent = content.replace(reg, '\u3000')
          }
        }
      })
    },

    clickF() {
      this.dialogShow = false
    },
    showInfo(item) {
      console.log(item)

      noticeDetail({ noticeId: item.noticeId }).then((res) => {
        console.log('res', res)
        this.infoObj = res.noticeInfo
      })

      this.dialogShow = true
    },
    resetSearchForm() {
      this.dateValue = []
      ;(this.timeType = ''),
        (this.searchForm = {
          noticeTitle: '',
          startTime: '',
          endTime: '',
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        })
    },
    searchInfo() {
      console.log()
      noticeList(this.searchForm).then((res) => {
        if (res.resultCode == 0) {
          this.announceList = res.noticeInfoList
          this.total = res.pageInfo.totalNum
          console.log('this.announceListCopy11111', res)
        }
      })
    },
    radioChange() {
      // 如果是近三天
      if (this.timeType == '1') {
        this.dateValue = getDIYTime1(3)
        console.log(' this.dateValue', this.dateValue)
      }
      // 如果是近十五天
      else if (this.timeType == '2') {
        this.dateValue = getDIYTime1(6)
        console.log(' this.dateValue', this.dateValue)
      }
      // 如果是近一个月
      else if (this.timeType == '3') {
        this.dateValue = getDIYTime1(5)
        console.log(' this.dateValue', this.dateValue)
      }

      this.date_format()
    },
    // 改变开始时间
    changeDate(val) {
      console.log(val)
      this.timeType = ''
      this.date_format()
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
      this.searchForm.startTime =
        this.time(this.dateValue[0]).split(' ')[0] + ' ' + '00:00:00'
      this.searchForm.endTime =
        this.time(this.dateValue[1]).split(' ')[0] + ' ' + '23:59:59'

      console.log(this.searchForm.endDate)
    },

    numberChange(data) {
      this.searchForm.pageInfo.pageSize = data
      this.searchInfo()
    },

    handleCurrentChange(val) {
      this.searchForm.pageInfo.pageNum = val

      console.log(this.pageNum)
      this.searchInfo()
    },
  },
}
</script>
<style lang="scss" scoped>
#communityAnnounce {
  //   width: 100%;
  //   min-height: calc(100vh - 70px);
  padding-right: 103px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #e5e9ed;
  .announceMain {
    // width: 1733px;
    // height: 918px;
    // background: rgba(20, 47, 72, 0.8);
    // border-radius: 8px;
    // margin: auto;
    pointer-events: auto;
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

  .el-radio-group .el-radio-button {
    border-radius: 10px;
    margin-right: 0;
  }

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
  .el-radio {
    color: #ccc;
    cursor: pointer;
    margin-right: 30px;
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

  .searchDiv {
    display: flex;
    .inputTitle {
      display: flex;
      justify-content: space-between;
      width: 1300px;
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

    .table {
      .el-input__inner {
        height: 30px;
        color: #fff;
        border: 1px solid #fff !important;
      }
    }
  }
  .announceUl {
    overflow-y: auto;
    // height: 572px;
    height: 600px;
    margin-bottom: 20px;
  }
  .announceLi {
    // width: 1430px;
    height: 150px;
    background: rgba(32, 75, 116, 0.8);
    border-radius: 8px;
    padding: 19px 25px 20px 20px;
    display: flex;
    margin-bottom: 12px;
    box-sizing: border-box;
  }
  .announceLiInfo {
    // width: 1430px;
    background: transparent;
    border-radius: 8px;
    padding: 0px 214px;
    display: flex;
    margin-top: 57px;
    box-sizing: border-box;
  }
  .announceLi:hover {
    cursor: pointer;
  }
  .announceLi:last-child {
    margin-bottom: 0px;
  }

  .el-pagination {
    margin-bottom: 10px;
  }
  .el-pagination .el-input__inner {
    height: 30px;
    background: transparent;
  }
  .announceDialog {
    width: 100%;
    height: 733px;
    background: rgba(32, 75, 116, 0.65);
    border-radius: 8px;
    pointer-events: auto;
    position: relative;
  }
  .topDiv {
    text-align: center;
  }
  .titleDiv {
    padding-top: 33px;
  }
  .dialogImg {
    width: 100%;
    height: 100%;
  }
  .imgDiv {
    width: 700px;
    height: 240px;
    margin-bottom: 39px;
    position: relative;
  }
  .imgTitle {
    position: absolute;
    left: 72px;
    top: 61px;
    width: 313px;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: bold;
  }
  .el-pagination__total {
    color: white !important;
  }
  .el-pagination__jump {
    color: white;
  }
}
</style>
