<template>
  <div class="screen" style="padding: 44px 100px 36px 100px">
    <div id="announceBase">
      <div class="headtitle">
        <div class="title">宣传公告</div>
        <div class="pDiv" style="position: relative"></div>
      </div>
      <div class="content">
        <div class="left">
          <el-col :span="12">
            <el-menu :default-active="active" class="el-menu-vertical-demo">
              <el-menu-item index="0" @click="index = 0">
                <span slot="title">全部公告</span>
              </el-menu-item>
              <el-menu-item index="1" @click="index = 1">
                <span slot="title">政策宣传</span>
              </el-menu-item>
              <el-menu-item index="2" @click="index = 2">
                <span slot="title">医疗卫生</span>
              </el-menu-item>
              <el-menu-item index="3" @click="index = 3">
                <span slot="title">信息公开</span>
              </el-menu-item>
              <el-menu-item index="4" @click="index = 4">
                <span slot="title">问题整改通告</span>
              </el-menu-item>
              <el-menu-item index="5" @click="index = 5">
                <span slot="title">日常通知</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </div>
        <div class="right" style="width: 90%">
          <community-announce v-show="index === 0"></community-announce>
          <policy-propaganda v-show="index === 1"></policy-propaganda>
          <cmedical-health v-show="index === 2"></cmedical-health>
          <information-disclosure v-show="index === 3"></information-disclosure>
          <problem-rectification v-show="index === 4"></problem-rectification>
          <daily-notice v-show="index === 5"></daily-notice>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { noticeList, getDictionary } from '@/utils/api'
import communityAnnounce from './communityAnnounce'
import policyPropaganda from './policyPropaganda'
import cmedicalHealth from './cmedicalHealth'
import informationDisclosure from './informationDisclosure'
import ProblemRectification from './ProblemRectification'
import DailyNotice from './DailyNotice'

export default {
  components: {
    communityAnnounce,
    policyPropaganda,
    cmedicalHealth,
    informationDisclosure,
    ProblemRectification,
    DailyNotice,
  },
  data() {
    return {
      index: 0,

      pageInfo: {},
      noticeType: '',
      pageNum: 1,
      pageSize: 10,
      dictionaryList: '',
      announceList: [],
      announceListCopy: [
        {
          title: '校园门禁系统人脸采集通知',
          content:
            '校园全体师生：为加强新冠肺炎疫情防控工作，做好校园安全防范管理，校园正在加快建设各小区门禁管理系统。为保证居民能够正常进出小区，需要准确采集各居民的人脸数据，请广大居民积极配合，及时按照要求采集个人数据。本数据仅用于方便校园居民进出入小区，加强校园安全工作所用，不会泄露或者用于其他用途。',
          people: '全体校园师生',
          publisher: '发布人：校园管理员',
          time: '2021-04-06 16:25:24',
          menuFlag: '4',
        },
        {
          title: '关于开展2021年度校园工作人员考核相关工作的通知',
          content:
            '各校园党组织、居委会：根据《校园工作人员考核暂行规定》，现就2020年度街道工作人员考核相关工作通知如下务员、机关工勤人员（行政附编人员）、事业人员、街道自用人员（机关自用人员和校园主官）分别填写《公务员年度考核登记表》、《机关工勤人员年度考核登记表》、《事业单位工作人员年度考核登记表》、《街道自用人员年度考核登记表》，以上表格请从街道网站-通知公告里下载，并于2021年2月5日前将表格电子档和纸质版（正反打印）报至党群工作局。',
          people: '校园内部',
          publisher: '发布人：校园管理员',
          time: '2021-03-31 12:17:24',
          menuFlag: '6',
        },
        {
          title: '春季开学期间新冠肺炎疫情防控检查指导',
          content:
            '为切实做好春季开学期间学校（园）疫情防控工作，督促学校（园）进一步落实疫情防控主体责任，抓实抓细各项防控措施，区卫健委从2月22日起抽调区疾控中心、基层卫生机构专业技术人员，强化一校（园）一医、分片包干，在开学第一周每天进校（园）开展现场指导。',
          people: '全体校园师生',
          publisher: '发布人：校园管理员',
          time: '2021-03-29 09:00:05',
          menuFlag: '3',
        },
        {
          title: '智慧校园为居民生活保驾护航',
          content:
            '全面贯彻党的十八大和十八届三中、四中、五中、六中全会精神，坚持以邓小平理论、“三个代表”重要思想、科学发展观为指导，深入贯彻习近平总书记系列重要讲话精神和治国理政新理念新思想新战略，紧紧围绕统筹推进“五位一体”总体布局和协调推进“四个全面”战略布局，坚持以基层党组织建设为关键、政府治理为主导、居民需求为导向、改革创新为动力，健全体系、整合资源、增强能力，完善城乡校园治理体制，努力把城乡校园建设成为和谐有序、绿色文明、创新包容、共建共享的幸福家园，为实现“两个一百年”奋斗目标和中华民族伟大复兴的中国梦提供可靠保证。',
          people: '全体校园师生',
          publisher: '发布人：校园管理员',
          time: '2021-03-28 08:20:05',
          menuFlag: '2',
        },
        {
          title: '部署加强校园疫情防控工作',
          content:
            '近期，境外疫情持续扩散蔓延，我国多地接连发生局部聚集性疫情，甚至在同一省份或城市出现多个源头导致的多条传播链。为贯彻党中央、国务院决策部署，进一步压实“四方责任”，落实“四早”要求，毫不放松抓好“外防输入、内防反弹”各项工作，巩固来之不易的防控成果。',
          people: '全体校园师生',
          publisher: '发布人：校园管理员',
          time: '2021-03-27 15:40:11',
          menuFlag: '3',
        },
        {
          title: '校园针对督导督查通报问题进行整改情况',
          content:
            '管理监督员佩戴标识情况整改。根据督查组对我校园工作人员、网格工作人员、区巩卫办人员、包点责任人佩戴袖章和督导工作卡佩戴率较低情况通报批评。我校园针对此问题进行认真检讨与整改。日前我校园工作人员上班后严厉要求每个工作人员红袖章进行巩卫工作。',
          people: '全体校园师生',
          publisher: '发布人：校园管理员',
          time: '2021-03-27 09:40:34',
          menuFlag: '5',
        },
      ],
      data1: false,
      flag: '1',
      active: '0',
      total: 10,
    }
  },
  async created() {},
  mounted() {
    this.getDictionary()
  },
  methods: {
    getDictionary() {
      getDictionary({
        type: 'scs-notice-type',
      }).then((res) => {
        if (res.resultCode == 0) {
          this.dictionaryList = res.dictionaryList
        }
        console.log('res', res)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#announceBase {
  width: 1733px;
  background: rgba(20, 47, 72, 0.8);
  border-radius: 8px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #e5e9ed;
  pointer-events: auto;
  padding: 22px;
  box-sizing: border-box;

  .el-col-12 {
    width: 120px;
  }

  .el-menu,
  .menus {
    background: transparent !important;
  }

  .el-menu {
    border-right: 0px;
  }

  .el-menu-item.is-active {
    width: 120px;
    //   height: 60px;
    background: #00aeff !important;
    border-radius: 8px;
  }

  .el-menu-item,
  .el-submenu__title {
    height: 60px;
    line-height: 60px;
  }

  .el-submenu__title,
  .el-menu-item {
    background: transparent !important;
    color: #fff;
  }

  .el-menu-item {
    padding: 0px;
    border-radius: 8px;
    //   margin-left: 32%;
  }

  // .main {
  //   width: 100%;
  //   min-height: 800px;
  //   height: 800px;
  //   //   height: calc(100vh - 70px);
  //   position: relative;

  // .bg {
  //   position: absolute;
  //   pointer-events: auto;
  //   width: 1733px;
  //   height: 100%;
  //   background: rgba(20, 47, 72, 0.8);
  //   border-radius: 8px;
  //   left: 50%;
  //   margin: -350px 0 0 -870px;

  // margin: 0 auto;
  // align-items: center;
  .headtitle {
    display: flex;
    justify-content: space-between;

    .title {
      // padding-top: 16px;
      // padding-left: 16px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #1efffc;
    }

    .pDiv {
      color: #edf6f7;
      cursor: pointer;
      // margin-top: 15px;
      margin-right: 10px;
      padding: 10px 10px;
    }
  }
  .content {
    display: flex;
    height: 100%;
    .left {
      margin-left: 20px;
      margin-top: 27px;
      margin-right: 20px;
    }
  }
  //   }
  // }
}
</style>
