<template>
  <div class="screen" style="padding: 44px 100px 36px 100px">
    <div id="publicSentiment">
      <div class="headtitle">
        <div class="title">报事管理</div>
      </div>
      <div class="searchDiv" style="margin-top: 5px; margin-bottom: 18px">
        <div class="block" style="justify-content: flex-start">
          <span class="name" style="margin-left: 88px; margin-right: 2px"
            >时间：</span
          >
          <el-radio-group
            v-model="searchForm.timeType2"
            size="medium"
            @change="radioChange2"
          >
            <el-radio-button label="1">近七天</el-radio-button>
            <el-radio-button label="2">近十五天</el-radio-button>
            <el-radio-button label="3">近一月</el-radio-button>
          </el-radio-group>
        </div>

        <div class="block" style="justify-content: flex-start">
          <el-date-picker
            style="width: 352px; margin-left: 3px"
            v-model="dateValue2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          ></el-date-picker>
        </div>

        <div class="block" style="margin-left: 94px; margin-right: 111px">
          <span class="name">区域范围：</span>
          <el-select
            v-model="searchForm.streetId"
            filterable
            clearable
            placeholder="请选择街道"
            style="width: 150px"
            v-if="subType < 2"
            @change="changeStr"
          >
            <el-option
              v-for="(item, index) in streetList"
              :key="index"
              :label="item.organizationName"
              :value="item.areaCode"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchForm.shequ"
            filterable
            clearable
            placeholder="请选择社区"
            style="width: 150px"
            v-if="subType < 3"
            @change="changeCom"
          >
            <el-option
              v-for="item in communityList"
              :key="item.areaCode"
              :label="item.organizationName"
              :value="item.areaCode"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchForm.xiaoqu"
            clearable
            filterable
            placeholder="请选择小区"
            style="width: 150px"
          >
            <el-option
              v-for="item in plotList"
              :key="item.belongTenantId"
              :label="item.organizationName"
              :value="item.belongTenantId"
            ></el-option>
          </el-select>
        </div>

        <div class="block">
          <el-button
            type="primary"
            class="btnPrimary"
            style="margin-right: 29px; width: 100px"
            >查<span style="display: inline-block; width: 12px"></span
            >询</el-button
          >
          <el-button
            type="primary"
            class="btnPrimary btnReset"
            style="width: 100px; margin-left: 0px"
            >重<span style="display: inline-block; width: 12px"></span
            >置</el-button
          >
        </div>
      </div>
      <div class="chartBox">
        <div class="leftChartDiv">
          <div class="headtitle">
            <div class="title" style="font-size: 14px">报事类型统计</div>
            <!-- <el-radio-group
              v-model="searchForm.timeType"
              size="medium"
              @change="radioChange"
            >
              <el-radio-button label="1">近七天</el-radio-button>
              <el-radio-button label="2">近十五天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
            </el-radio-group> -->
          </div>
          <div id="barChart"></div>
        </div>
        <div class="rightChartDiv">
          <div class="headtitle" style="margin-bottom: 20px">
            <div class="title" style="font-size: 14px">报事处理分布统计</div>
            <!-- <el-radio-group
              v-model="searchForm.timeType1"
              size="medium"
              @change="radioChange1"
            >
              <el-radio-button label="1">近七天</el-radio-button>
              <el-radio-button label="2">近十五天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
            </el-radio-group> -->
          </div>
          <div id="pieChart"></div>
        </div>
      </div>

      <div class="tables">
        <el-table
          row-class-name="table-cell"
          header-row-class-name="table-cell"
          :data="tableData"
          style="width: 100%"
          max-height="380px"
        >
          <el-table-column label="报事类型">
            <template slot-scope="scope">
              {{ scope.row.repairType }}
            </template>
          </el-table-column>
          <el-table-column label="报事标题">
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="报事人">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="联系方式">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column label="报事时间">
            <template slot-scope="scope">
              {{ scope.row.time }}
            </template>
          </el-table-column>
          <el-table-column label="处理进度">
            <template slot-scope="scope">
              <span :style="{ color: colorConfirm(scope.row.deal) }">{{
                setDeal(scope.row.deal)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="报事小区" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.add }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small">下载</el-button> -->
              <!-- @click.native.prevent="getDetail(scope.row.courtId)" -->
              <el-button
                type="text"
                size="small"
                @click="getDetail(scope.row)"
                style="color: #00ccff"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table">
        <div class="pagination" style="margin-top: 30px">
          <div class="paging">
            <!-- <span>每页显示</span>
              <el-select
                v-model="number"
                @change="numberChange"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <span>条告警记录</span> -->
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="报事详情"
      :visible.sync="showInfoDialog"
      top="10vh"
      width="700px"
      :close-on-click-modal="false"
      class="reportManageDialog"
      @closed="dialogClosed"
      :modal="false"
      style="pointer-events: auto; margin-left: -570px; margin-top: 140px"
      v-dialogDrag
      :modal-append-to-body="false"
    >
      <div style="display: flex; justify-content: space-around">
        <div>
          <img :src="infoObj.url" alt="" style="width: 213px; height: 284px" />
        </div>
        <div>
          <div class="pDiv" style="margin-bottom: 44px; line-height: 14px">
            <span class="blueSpan">锦联社区/网格-/1/1101</span>
            <!-- <span class="whiteSpan">{{ setType(infoObj.type) }}</span> -->
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">类型：</span>
            <span class="whiteSpan">入室维修-家电</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">报事人：</span>
            <span class="whiteSpan">{{ infoObj.name }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">报事人电话：</span>
            <span class="whiteSpan">{{ infoObj.phone }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">报事进度：</span>
            <span class="whiteSpan">{{ setDeal(infoObj.deal) }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">报事备注：</span>
            <span class="whiteSpan">{{ infoObj.remark }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span class="blueSpan">网格长：</span>
            <span class="whiteSpan">{{ infoObj.wangge }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 24px; line-height: 14px">
            <span class="blueSpan">联系方式：</span>
            <span class="whiteSpan">{{ infoObj.phone }}</span>
          </div>
          <div class="pDiv" style="margin-bottom: 15px; line-height: 14px">
            <span
              class="blueSpan"
              @click="showInfoOrPro"
              style="cursor: pointer; color: #00ccff"
              >查看处理详情</span
            >
            <!-- <span class="whiteSpan viewProgress" @click="showInfoOrPro"
              >请点击查看</span
            > -->
          </div>
        </div>
        <div class="whiteSpan">
          {{ infoObj.time }}
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="progressShow"
      top="10vh"
      width="700px"
      :close-on-click-modal="false"
      class="reportManageDialog1"
      @closed="dialogClosed1"
      :modal="false"
      style="pointer-events: auto; margin-left: 1030px; margin-top: 140px"
      v-dialogDrag
      :modal-append-to-body="false"
    >
      <div style="display: flex">
        <div>
          <img :src="infoObj.url" alt="" style="width: 213px; height: 284px" />
        </div>
        <el-timeline>
          <el-timeline-item timestamp="" placement="top" color="#1EFFFC">
            <el-card>
              <div
                style="margin-left: 10px; margin-bottom: 10px"
                class="whiteSpan"
              >
                <span :class="setDealClass(infoObj.deal)">
                  {{ setDeal(infoObj.deal) }}
                </span>
                <span>{{ infoObj.time }}</span>
              </div>
              <div style="margin-left: 10px">
                <div
                  class="pDiv"
                  style="margin-bottom: 15px; line-height: 14px"
                >
                  <span class="blueSpan">进度：</span>
                  <span class="whiteSpan">100%</span>
                </div>
                <div
                  class="pDiv"
                  style="margin-bottom: 15px; line-height: 14px"
                >
                  <span class="blueSpan">处理人：</span>
                  <span class="whiteSpan">{{ setDeal(infoObj.wangge) }}</span>
                </div>
                <div
                  class="pDiv"
                  style="margin-bottom: 15px; line-height: 14px"
                >
                  <span class="blueSpan">联系方式：</span>
                  <span class="whiteSpan">{{ infoObj.phone }}</span>
                </div>
                <div
                  class="pDiv"
                  style="margin-bottom: 15px; line-height: 14px"
                >
                  <span class="blueSpan">处理备注：</span>
                  <span class="whiteSpan">{{ infoObj.remark }}</span>
                </div>
                <div
                  class="pDiv"
                  style="margin-bottom: 15px; line-height: 14px"
                >
                  <span class="blueSpan">滞后原因：</span>
                  <span class="whiteSpan">无</span>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            timestamp=""
            placement="top"
            color="#1EFFFC"
            class="timeLineItemNone"
          >
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFormatDate2, getFormatDate, getDIYTime1 } from '@/utils/mutil'
import { getOrganizationTree } from '@/utils/api'

export default {
  data() {
    return {
      streetList: [],
      streetListCopy: [],
      communityList: [],
      communityListCopy: [],
      plotList: [],
      plotListCopy: [],
      infoObj: {},
      searchForm: {
        timeType: '',
        timeType1: '',
        timeType2: '',
        startDate: '',
        endDate: '',
        startDate1: '',
        endDate1: '',
        startDate2: '',
        endDate2: '',
        peopleType: '',
        streetId: '',
        shequ: '',
        xiaoqu: '',
      },
      dateValue: [],
      dateValue1: [],
      dateValue2: [],
      peoplePieList: [
        {
          name: '未处理',
          value: 20,
        },
        {
          name: '处理中',
          value: 30,
        },
        {
          name: '已处理',
          value: 10,
        },
        {
          name: '已关闭',
          value: 25,
        },
        {
          name: '其他',
          value: 5,
        },
      ],
      dataJiangning: [
        '20210405',
        '20210406',
        '20210407',
        '20210408',
        '20210409',
        '20210410',
        '20210411',
        '20210412',
        '20210413',
      ],
      dataJiangning1: [50, 110, 180, 220, 210, 200, 220, 210, 200],
      dataJiangning2: [110, 50, 200, 40, 210, 70, 220, 210, 110],
      dataJiangning3: [80, 110, 90, 80, 210, 200, 60, 210, 200],
      dataJiangning4: [20, 110, 200, 220, 210, 30, 220, 70, 60],

      peopleTypeList: [
        {
          name: '全部',
          value: '0',
        },
        {
          name: '求助',
          value: '1',
        },
        {
          name: '投诉',
          value: '2',
        },
        {
          name: '建议',
          value: '3',
        },
        {
          name: '其他',
          value: '4',
        },
      ],
      dealList: [
        {
          name: '已处理',
          value: 1,
        },
        {
          name: '未处理',
          value: 0,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 3,
      tableData: [
        {
          repairType: '社区管理',
          title: '垃圾清理',
          deal: 1,
          name: '李**',
          phone: '188****8475',
          time: '2021-03-02 16:44:51',
          add: '光明一街济川小区',
          remark: '处理完成',
          wangge: '张鹏',
          url: require('../../../../assets/announce/weixiu.jpg'),
        },
        {
          repairType: '社区管理',
          title: '消防通道被占用',
          deal: 0,
          name: '李**',
          phone: '188****8475',
          time: '2021-03-02 16:44:51',
          add: '新城花园',
          remark: '处理完成',
          wangge: '张鹏',
          url: require('../../../../assets/announce/weixiu.jpg'),
        },
        {
          repairType: '社区管理',
          title: '垃圾清理',
          deal: 1,
          name: '李**',
          phone: '188****8475',
          time: '2021-03-02 16:44:51',
          add: '积善新寓',
          remark: '处理完成',
          wangge: '张鹏',
          url: require('../../../../assets/announce/weixiu.jpg'),
        },
      ],

      showInfoDialog: false,
      progressShow: false,
      subType: sessionStorage.getItem('subType'),
    }
  },
  async created() {
    this.total = this.tableData.length
    this.searchForm.timeType = '1'
    this.searchForm.timeType1 = '1'
    this.searchForm.timeType2 = '1'
    this.dateValue = getDIYTime1(4)
    this.dateValue1 = getDIYTime1(4)
    this.dateValue2 = getDIYTime1(4)
    this.date_format()
    this.date_format1()
    this.date_format2()

    await this.getCommunityCourt()
  },
  mounted() {
    this.getGraphOne(this.peoplePieList)
    this.getGraphOne1()
  },
  methods: {
    changeStr(val) {
      this.searchForm.shequ = ''
      this.searchForm.xiaoqu = ''
      if (!val) {
        this.communityList = []
        this.plotList = []
      } else {
        for (let i = 0; i < this.streetList.length; i++) {
          for (let j = 0; j < this.communityListCopy.length; j++) {
            if (val == this.streetList[i].areaCode) {
              if (
                this.streetList[i].organizationId ==
                this.communityListCopy[j].parentId
              ) {
                this.communityList = this.communityListCopy.filter((item) => {
                  return item.parentId == this.streetList[i].organizationId
                })
                break
              }
            }
          }
        }
      }
    },
    changeCom(val) {
      this.searchForm.xiaoqu = ''
      if (!val) {
        this.plotList = []
      } else {
        this.plotList = this.plotListCopy.filter((item) => {
          return item.areaCode == val
        })
      }
    },
    colorConfirm(val) {
      console.log(val)
      if (val == 1) {
        return '#0bcf1d'
      } else if (val == 0) {
        return '#fe6b6b'
      }
    },
    showInfoOrPro() {
      this.progressShow = true
    },
    async getCommunityCourt() {
      let res = await getOrganizationTree({ type: 2, withTenant: 1 })
      if (res.resultCode == 0) {
        //社区
        this.communityList = []
        for (let i = 0; i < res.nodeList.length; i++) {
          if (res.nodeList[i].payload.subType == 2) {
            this.streetList.push(res.nodeList[i].payload)
          }

          if (res.nodeList[i].payload.subType == 3) {
            this.communityList.push(res.nodeList[i].payload)
          }

          if (res.nodeList[i].payload.subType == 4) {
            this.plotList.push(res.nodeList[i].payload)
          }

          if (res.nodeList[i].children) {
            this.getMoreStr(res.nodeList[i].children)
            this.getMoreCom(res.nodeList[i].children)
            this.getMorePio(res.nodeList[i].children)
          }
        }
        console.log(this.communityList)
        this.streetListCopy = JSON.parse(JSON.stringify(this.streetList))
        this.communityListCopy = JSON.parse(JSON.stringify(this.communityList))
        this.plotListCopy = JSON.parse(JSON.stringify(this.plotList))

        if (this.subType < 2) {
          this.communityList = this.communityListCopy.filter((item) => {
            return item.parentId == this.streetList[0].organizationId
          })
          this.searchForm.streetId = this.streetList[0].areaCode
        } else {
          //to
        }

        if (this.subType < 3) {
          this.plotList = this.plotListCopy.filter((item) => {
            return item.areaCode == this.communityList[0].areaCode
          })

          this.searchForm.shequ = this.communityList[0].areaCode
        } else {
          this.searchForm.shequ = this.communityList[0].areaCode
          this.searchForm.xiaoqu = this.plotList[0].belongTenantId
        }
        console.log(this.plotList)
      }
    },

    getMoreStr(children) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].payload.subType == 2) {
          this.streetList.push(children[i].payload)
        }
        if (children[i].children) {
          console.log(children[i].children)
          this.getMoreStr(children[i].children)
        }
      }
    },
    getMoreCom(children) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].payload.subType == 3) {
          this.communityList.push(children[i].payload)
        }
        if (children[i].children) {
          console.log(children[i].children)
          this.getMoreCom(children[i].children)
        }
      }
    },
    getMorePio(children) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].payload.subType == 4) {
          this.plotList.push(children[i].payload)
        }
        if (children[i].children) {
          console.log(children[i].children)
          this.getMorePio(children[i].children)
        }
      }
    },
    setDeal(val) {
      this.dealList.map((item) => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    setDealClass(val) {
      if (val == 1) {
        return 'dealed'
      } else if (val == 0) {
        return 'notDeal'
      }
    },
    setType(val) {
      this.peopleTypeList.map((item) => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    dialogClosed() {
      this.showInfoDialog = false
    },
    dialogClosed1() {
      this.progressShow = false
    },
    handleCurrentChange() {},
    getDetail(row) {
      this.infoObj = row
      this.showInfoDialog = true
    },
    radioChange() {
      // 如果是近三天
      if (this.searchForm.timeType == '1') {
        this.dateValue = getDIYTime1(4)
      }
      // 如果是近十五天
      else if (this.searchForm.timeType == '2') {
        this.dateValue = getDIYTime1(6)
      }
      // 如果是近一个月
      else if (this.searchForm.timeType == '3') {
        this.dateValue = getDIYTime1(5)
      }

      this.date_format()
    },
    radioChange1() {
      // 如果是近三天
      if (this.searchForm.timeType1 == '1') {
        this.dateValue1 = getDIYTime1(4)
      }
      // 如果是近十五天
      else if (this.searchForm.timeType1 == '2') {
        this.dateValue1 = getDIYTime1(6)
      }
      // 如果是近一个月
      else if (this.searchForm.timeType1 == '3') {
        this.dateValue1 = getDIYTime1(5)
      }

      this.date_format1()
    },
    radioChange2() {
      // 如果是近三天
      if (this.searchForm.timeType2 == '1') {
        this.dateValue2 = getDIYTime1(4)
      }
      // 如果是近十五天
      else if (this.searchForm.timeType2 == '2') {
        this.dateValue2 = getDIYTime1(6)
      }
      // 如果是近一个月
      else if (this.searchForm.timeType2 == '3') {
        this.dateValue2 = getDIYTime1(5)
      }

      this.date_format2()
    },
    // 类型占比图1
    getGraphOne(data) {
      let pieChart = this.$echarts.init(document.getElementById('pieChart'))
      let resizeFn = () => {
        pieChart.resize()
      }
      window.addEventListener('resize', resizeFn)
      this.$once('beforeDestroy', () => {
        window.removeEventListener('resize', resizeFn)
      })
      // 指定图表的配置项和数据
      let pieOption = {
        color: ['#00B7EE', '#A031FF', '#FFCD6A', '#5F5BFC', '#D88416'],
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          icon: 'circle',
          itemGap: 30, //图标间距
          right: '7%',
          top: '15%',
          formatter: function (name) {
            // 获取legend显示内容
            let data = pieOption.series[0].data
            let total = 0
            let tarValue = 0
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name == name) {
                tarValue = data[i].value
              }
            }
            console.log(tarValue, total)
            let arr =
              total == 0
                ? ['{a|' + name + '}', '{b|' + 0 + '%}']
                : [
                    '{a|' + name + '}',
                    '{b|' + ((tarValue / total) * 100).toFixed(2) + '%}',
                  ]
            return arr.join('  ')
          },
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
            fontWeight: 400,
            rich: {
              a: {
                fontSize: 14,
                color: '#ccc',
              },
              b: {
                fontSize: 12,
                color: '#ccc',
              },
              // c: {
              //   fontSize: 14,
              //   color: "#303133",
              // },
            },
          },
        },
        series: [
          {
            // name: "男女比例",
            type: 'pie',
            radius: ['50%', '70%'], //饼图的半径大小
            center: ['32%', '50%'], //饼图的位置
            // avoidLabelOverlap: false,
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
                formatter: '{d}%\n{b}',
              },
            },
            label: {
              show: false,
              position: 'center',
              fontSize: '16',
              color: '#ccc',
              fontWeight: 'bold',
              formatter: '{a}',
              normal: {
                textStyle: {
                  fontSize: 14,
                },
                formatter: '{b} {d}%',
              },
              x: 0,
            },
            data: data,
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表。
      pieChart.setOption(pieOption)
      this.$nextTick(() => {
        pieChart.resize()
      })
    },
    getGraphOne1() {
      let barChart = this.$echarts.init(document.getElementById('barChart'))
      // 指定图表的配置项和数据
      let barOption = {
        xAxis: {
          type: 'category',
          data: [
            '社区管理',
            '社区部件',
            '社区治安',
            '环境保护',
            '安全生产',
            '公共咨询',
            '其他',
          ],

          axisLine: {
            lineStyle: {
              color: '#5EA2E3',
            },
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#D2D8DD',
              fontSize: '10',
              itemSize: '',
            },
          },
        },

        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5EA2E3',
            },
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#D2D8DD',
              fontSize: '12',
              itemSize: '',
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: 'dashed',
              color: '#4D81B3',
            },
          },
        },
        series: [
          {
            barWidth: 12,
            data: [9, 11, 6, 9, 3, 5, 5, 1],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: '#EDF2F5',
                    fontSize: 14,
                  },
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#9871FB', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#7D4CFB', // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
          },
        ],
      }

      // 使用刚指定的配置项和数据显示图表。
      barChart.setOption(barOption)
    },
    changeDate(val) {
      console.log(val)
      this.searchForm.timeType = ''
      this.date_format()
    },
    // 日期格式处理
    date_format() {
      this.searchForm.startDate = getFormatDate2(this.dateValue[0]).substring(
        0,
        8
      )

      this.searchForm.endDate = getFormatDate2(this.dateValue[1]).substring(
        0,
        8
      )
    },
    date_format1() {
      this.searchForm.startDate1 = getFormatDate2(this.dateValue1[0]).substring(
        0,
        8
      )

      this.searchForm.endDate1 = getFormatDate2(this.dateValue1[1]).substring(
        0,
        8
      )
    },
    date_format2() {
      this.searchForm.startDate2 = getFormatDate2(this.dateValue2[0]).substring(
        0,
        8
      )

      this.searchForm.endDate2 = getFormatDate2(this.dateValue2[1]).substring(
        0,
        8
      )
    },
  },
}
</script>
<style lang="scss" scoped>
#publicSentiment {
  //   width: 100%;
  min-height: calc(100vh - 145px);
  width: 1733px;
  background: rgba(20, 47, 72, 0.8);
  border-radius: 8px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #e5e9ed;
  pointer-events: auto;
  padding: 22px;
  box-sizing: border-box;
  .el-dialog__body {
    padding: 20px;
  }
  .headtitle {
    display: flex;
    justify-content: space-between;

    .title {
      //   padding-top: 16px;
      //   padding-left: 16px;
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

  // .el-cascader-menu {
  //   min-width: 180px;
  //   -webkit-box-sizing: border-box;
  //   box-sizing: border-box;
  //   color: #fff !important;
  //   border-right: solid 1px #e4e7ed;
  // }

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
  //table
  .el-table {
    background: transparent;
  }
  .el-table td,
  .el-table th,
  .el-table tr {
    border-collapse: collapse;
    border-bottom: none;
    border-left: none;
    border-right: 0px solid #156c9e !important;
    border-top: 0px solid #156c9e !important;
  }
  .el-table tr {
    background: transparent;
    height: 36px;
    color: #fff;
    padding: 0;
  }
  .el-table td {
    background: transparent;
    border-bottom: 1px solid #4a79a5 !important;
    height: 80px;
    color: #fff;
    font-size: 14px;
    padding: 0;
  }
  .el-table th {
    background: rgba(0, 204, 255, 0.2);
    color: #fff;
    font-size: 14px;
    padding: 0;
    border: none !important;
  }
  .el-table::before {
    background: none;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  .el-table__empty-block {
    background: transparent;
    border: 1px solid #156c9e;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-tabs__header .el-tabs__item {
    background: transparent !important;
  }
  .el-tabs__item {
    color: #fefefe;
  }
  .el-tabs__item.is-active {
    color: #1efffc;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__active-bar {
    background-color: #1efffc;
  }
  .el-tabs__nav-scroll {
    padding-left: 0px;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
  .el-card {
    background: transparent;
    color: #fff;
    border: none;
  }
  .el-timeline-item__timestamp {
    color: #1efffc;
  }
  .el-card__body {
    padding: 0px;
  }
  .el-timeline-item__tail {
    border-left: 1px dashed #1efffc;
    margin-left: 19.5px;
  }
  .el-timeline-item__node {
    background-color: #1efffc;
    margin-left: 20px;
    width: 10px;
    height: 10px;
  }
  .el-timeline-item__wrapper {
    padding-left: 34px;
  }
  .el-timeline-item__timestamp.is-top {
    padding-top: 1px;
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

  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background: #00ccff !important;
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

  .el-pagination {
    margin-bottom: 10px;
  }
  .el-pagination .el-input__inner {
    height: 30px;
    background: transparent;
  }
  .chartBox {
    display: flex;
    justify-content: space-between;
    padding: 0px 87px;
    margin-bottom: 40px;
  }
  #pieChart {
    height: 300px;
  }
  #barChart {
    height: 300px;
  }
  .leftChartDiv,
  .rightChartDiv {
    width: 48%;
    height: 400px;
    background: rgba(32, 75, 116, 0.8);
    border-radius: 8px;
    padding: 16px;
    box-sizing: border-box;
  }
  .blueSpan {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1efffc;
  }
  .whiteSpan {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #edf6f7;
  }
}
.blueSpan {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #1efffc;
}
.whiteSpan {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #edf6f7;
}
.reportManageDialog {
  // margin-left: 200px;
}
.el-dialog__wrapper.reportManageDialog1 {
  width: 700px;
}
.reportManageDialog1 {
  margin-top: 120px;
  // margin-left: 670px;

  .el-timeline-item__timestamp {
    color: #1efffc;
  }
  .el-card__body {
    padding: 0px;
  }
  .el-timeline-item__tail {
    border-left: 1px solid #1efffc;
    margin-left: 19.5px;
  }
  .el-timeline-item__node {
    background-color: #1efffc;
    margin-left: 20px;
    margin-top: 16px;
    width: 10px;
    height: 10px;
  }
  .timeLineItemNone {
    .el-timeline-item__node {
      display: none;
    }
  }
  .el-card {
    background: transparent;
    // color: #fff;
    border: none;
  }
  .dealed {
    border: 1px solid #0bcf1d;
    border-radius: 4px;
    color: #0bcf1d;
    display: inline-block;
    padding: 3px;
    margin-right: 19px;
  }
  .notDeal {
    border: 1px solid #fe6b6b;
    border-radius: 4px;
    color: #fe6b6b;
    display: inline-block;
    padding: 2px 3px;
    margin-right: 19px;
  }
  .el-dialog__header {
    padding-top: 37px;
  }
}
</style>
