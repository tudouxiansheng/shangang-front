<template>
  <!--右边访客等级-->
  <div class="right-Visit">
    <div class="visit-title">访客应用</div>
    <div class="topCheck">
      <div class="orga" :class="[activeIndex == 0 ? 'bgblue' : '']" @click="clickActiveIndex(0)">访客登记</div>
      <div class="orga conditionCheck" :class="[activeIndex == 1 ? 'bgblue' : '']" @click="clickActiveIndex(1)">
        条件检索
      </div>
    </div>
    <div class="rigist" v-show="activeIndex == 0">
      <div class="registBtn" @click="registVisit">访客登记</div>
      <div class="listTap">
        <div class="item-v">照片</div>
        <div class="item-v">访客姓名</div>
        <div class="item-v">事由</div>
        <div class="item-v">状态</div>
      </div>
      <div class="list-wrapper">
        <div class="visitPeople" v-for="(item, index) in visitList" :key="index" @click="clickVisitDetail(item)">
          <div class="photo">
            <img :src="item.facePhoto" style="width: 50px; height: 50px" />
          </div>
          <div class="visitName">{{ item.visitorName }}</div>
          <div class="visitType">
            <!-- //1.外卖；2.保洁；3.快递配送；4.维修施工；5.面试；6.其他 -->
            <span v-if="item.visitType == 1">外卖</span>
            <span v-if="item.visitType == 2">保洁</span>
            <span v-if="item.visitType == 3">快递配送</span>
            <span v-if="item.visitType == 4">维修施工</span>
            <span v-if="item.visitType == 5">面试</span>
            <span v-if="item.visitType == 6">其他</span>
          </div>
          <div class="visitStatus">
            <!-- 1.待入园；2.已入园；3.已出园 -->
            <span v-if="item.visitStatus == 1">待入园</span>
            <span v-if="item.visitStatus == 2">已入园</span>
            <span v-if="item.visitStatus == 3">已出园</span>
          </div>
        </div>
      </div>
    </div>
    <div class="condition" v-show="activeIndex == 1">
      <div class="searchTab">
        <span class="name">访客姓名：</span>
        <el-input clearable placeholder="请输入访客姓名" v-model="searchInfo.visitorName">
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <div class="searchTab">
        <span class="name">联系方式：</span>
        <el-input clearable placeholder="请输入访客联系方式" v-model="searchInfo.visitorMobile">
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <div class="searchTab">
        <span class="name">车牌号：</span>
        <el-input clearable placeholder="请输入访客车牌号" v-model="searchInfo.carPlate">
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <div class="searchTab">
        <span class="name">访客状态：</span>
        <el-select v-model="searchInfo.visitStatus" style="width: 100%" clearable>
          <el-option
            v-for="(item, index) in visitStatuslist"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="searchTab">
        <span class="name">被访人：</span>
        <el-input clearable placeholder="请输入被访人姓名" v-model="searchInfo.intervieweeName">
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>

      <div class="caozuo">
        <div class="jiansuo centerItem" @click="getSearch">检索</div>
        <div class="jiansuo centerItem reset" @click="resetCondition">重置</div>
      </div>
      <div class="listTap">
        <div class="item-v">照片</div>
        <div class="item-v">访客姓名</div>
        <div class="item-v">事由</div>
        <div class="item-v">状态</div>
      </div>
      <div class="list-wrapper list-wrapper2" v-if="!nodata">
        <div class="visitPeople" v-for="(item, index) in cvisitList" :key="index" @click="clickVisitDetail(item)">
          <div class="photo">
            <img :src="item.facePhoto" style="width: 50px; height: 50px" />
          </div>
          <div class="visitName">{{ item.visitorName }}</div>
          <div class="visitType">
            <!-- //1.外卖；2.保洁；3.快递配送；4.维修施工；5.面试；6.其他 -->
            <span v-if="item.visitType == 1">外卖</span>
            <span v-if="item.visitType == 2">保洁</span>
            <span v-if="item.visitType == 3">快递配送</span>
            <span v-if="item.visitType == 4">维修施工</span>
            <span v-if="item.visitType == 5">面试</span>
            <span v-if="item.visitType == 6">其他</span>
          </div>
          <div class="visitStatus">
            <!-- 1.待入园；2.已入园；3.已出园 -->
            <span v-if="item.visitStatus == 1">待入园</span>
            <span v-if="item.visitStatus == 2">已入园</span>
            <span v-if="item.visitStatus == 3">已出园</span>
          </div>
        </div>
      </div>
      <div class="nodata" v-else>
        <div class="">暂无检索结果</div>
      </div>
    </div>
    <addVisitor></addVisitor>
  </div>
</template>

<script>
import { getVistorList, visitorInfo } from '@/utils/api'
import addVisitor from './addVisitor.vue'
export default {
  components: {
    addVisitor,
  },
  data() {
    return {
      activeIndex: 0,
      visitList: [],
      addVisitorVisiable: false,
      addVistorOrDetail: 0, //1为新增 2为详情
      searchInfo: {
        carPlate: '',
        endTime: '',
        intervieweeName: '',
        startTime: '',
        visitStatus: '',
        visitorMobile: '',
        visitorName: '',
        pageInfo: {
          pageSize: 100,
          pageNum: 1,
        },
      },
      searchList: {
        pageInfo: {
          pageSize: 100,
          pageNum: 1,
        },
      },
      //1.待入园；2.已入园；3.已出园
      visitStatuslist: [
        {
          label: '待入园',
          value: 1,
        },
        {
          label: '已入园',
          value: 2,
        },
        {
          label: '已出园',
          value: 3,
        },
      ],
      cvisitList: [],
      nodata: false,
      recordId: '',
      ruleForm: {},
    }
  },
  mounted() {
    this.fetchVisitList()
  },
  methods: {
    clickActiveIndex(val) {
      this.activeIndex = val
    },
    //访客列表
    fetchVisitList() {
      getVistorList(this.searchList).then((res) => {
        if (res.resultCode == 0) {
          this.visitList = res.resultList
        }
      })
    },
    getSearch() {
      getVistorList(this.searchInfo).then((res) => {
        if (res.resultCode == 0) {
          if (res.resultList.length == 0) {
            this.nodata = true
          } else {
            this.cvisitList = res.resultList
          }
        }
      })
    },
    registVisit() {
      this.addVisitorVisiable = true
      this.addVistorOrDetail = 1
    },
    //重置检索条件
    resetCondition() {
      this.searchInfo.carPlate = ''
      this.searchInfo.endTime = ''
      this.searchInfo.intervieweeName = ''
      this.searchInfo.startTime = ''
      ;(this.searchInfo.visitStatus = ''), (this.searchInfo.visitorMobile = '')
      this.searchInfo.visitorName = ''
    },
    //访客详情
    clickVisitDetail(row) {
      visitorInfo({
        recordId: row.recordId,
      }).then((res) => {
        console.log(res, 'res')
        if (res.resultCode == 0) {
          this.ruleForm = res.info
          this.addVisitorVisiable = true
          this.addVistorOrDetail = 2
        }
      })

      this.recordId = row.recordId
    },
  },
}
</script>

<style lang="scss">
.right-Visit {
  padding: 30px 20px 20px 20px;
  box-sizing: border-box;
  font-size: 16px;
  .visit-title {
    font-size: 16px;
    font-weight: bold;
    color: #1efffc;
  }

  .topCheck {
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .orga {
      width: 90px;
      border: 1px solid #7ea5c9;
      border-radius: 8px 0px 0px 8px;
      color: #fefefe;
      cursor: pointer;
      line-height: 32px;
      text-align: center;
    }

    .conditionCheck {
      border-radius: 0px 8px 8px 0;
      border-left: 0;
    }

    .bgblue {
      background: #00ccff;
    }
  }

  .listTap {
    height: 36px;
    line-height: 36px;
    background: rgba(0, 204, 255, 0.2);
    width: 100%;
    margin-top: 61px;
    display: flex;

    .item-v {
      color: #ffffff;
      flex: auto;
      text-align: center;
    }
  }

  .list-wrapper {
    padding: 20px 0;
    color: #ffffff;
    width: 100%;
    height: 500px;
    overflow-y: scroll;

    .visitPeople {
      display: flex;

      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }
    }
  }

  .list-wrapper2 {
    height: 220px;
    overflow-y: scroll;
  }

  .nodata {
    display: flex;
    align-items: center;
    color: #ffffff;
    width: 100%;
    text-align: center;
    justify-content: center;
    margin-top: 20px;
  }

  .rigist {
    display: flex;
    flex-direction: column;
    align-items: center;

    .registBtn {
      margin-top: 60px;
      width: 160px;
      height: 40px;
      background: #00ccff;
      border-radius: 4px;
      color: #fefefe;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
  }

  .condition {
    margin-top: 31px;

    .searchTab {
      color: #ffffff;
      display: flex;
      line-height: 36px;
      margin-bottom: 18px;

      .name {
        width: 120px;
        text-align: right;
      }
    }

    .caozuo {
      display: flex;
      justify-content: center;

      .jiansuo {
        width: 160px;
        background: #00ccff;
        border-radius: 4px;
        height: 40px;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        line-height: 40px;
        font-size: 16px;
      }

      .reset {
        margin-left: 21px;
        background: none;
        border: 1px solid #b5bdbf;
        cursor: pointer;
      }
    }
  }
}
</style>
