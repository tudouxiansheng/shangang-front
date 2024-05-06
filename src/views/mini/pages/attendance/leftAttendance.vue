<template>
  <!--左边的-->
  <div id="attendance">
    <div class="leftVisit">
      <div class="topCheck">
        <div
          class="orga"
          :class="[activeIndex == 0 ? 'bgblue' : '']"
          @click="clickActiveIndex(0)"
        >
          组织树检索
        </div>
        <div
          class="orga conditionCheck"
          :class="[activeIndex == 1 ? 'bgblue' : '']"
          @click="clickActiveIndex(1)"
        >
          条件检索
        </div>
      </div>
      <!--active左边的组织树-->
      <div class="activeMenu1" v-if="activeIndex == 0">
        <el-input
          v-model="filterText"
          placeholder="请输入姓名或者部门检索"
          clearable
        ></el-input>
        <!--组织左边得树-->
        <div class="myTree" id="myTree">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            v-loading="dataLoading"
            :element-loading-text="elementLoadingText"
            element-loading-spinner="el-icon-loading"
            @check-change="handleCheckChange"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNodeMethod"
            v-model="filterText"
            ref="tree"
          ></el-tree>
        </div>
      </div>

      <!--点击树的数据-->
      <div class="dataTree"></div>
      <!--active右边的-->
      <div class="activeMenu2" v-if="activeIndex == 1">
        <div class="searchTab">
          <span class="name">部门：</span>
          <el-select v-model="searchInfo.department" clearable>
            <el-option
              v-for="(item, index) in departmentList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="searchTab">
          <span class="name">人员姓名：</span>
          <el-input clearable placeholder="请输入人员姓名">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
        </div>
        <div class="searchTab">
          <span class="name">工号：</span>
          <el-input clearable placeholder="请输入工号">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
        </div>
        <div class="searchTab">
          <span class="name">考勤状态：</span>
          <el-select v-model="searchInfo.visitStatus" clearable>
            <el-option
              v-for="(item, index) in visitStatuslist"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="searchTab">
          <span class="name">时间段：</span>
          <div class="formItem">
            <el-radio-group
              v-model="timeType"
              size="medium"
              @change="radioChange"
            >
              <el-radio-button label="1">近三天</el-radio-button>
              <el-radio-button label="2">近七天</el-radio-button>
              <el-radio-button label="3">近一月</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="searchTab" style="padding-top: 0.625rem">
          <div class="name"></div>
          <div class="formItem">
            <el-date-picker
              style="width: 14.125rem"
              v-model="dateValue"
              type="daterange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
            ></el-date-picker>
          </div>
        </div>

        <div class="caozuo">
          <div class="jiansuo centerItem" @click="getSearch">检索</div>
          <div class="jiansuo centerItem reset" @click="resetCondition">
            重置
          </div>
        </div>
      </div>
    </div>
    <div class="centerContent" v-show="activeIndex == 0">
      <div class="topContent">
        <div class="comeIn">
          <div class="leftImg">
            <img
              src="../../../../assets/attendance/attendance.png"
              class="icon"
            />
          </div>
          <div class="rightData">
            <div class="myconme">应到</div>
            <div class="attendanceData">1286</div>
          </div>
        </div>
        <div class="comeIn">
          <div class="leftImg">
            <img
              src="../../../../assets/attendance/attendance.png"
              class="icon"
            />
          </div>
          <div class="rightData">
            <div class="myconme">实到</div>
            <div class="attendanceData">1286</div>
          </div>
        </div>
      </div>
      <!--考勤统计-->
      <div class="attendanceCount df">
        <div class="attendanceC-1">
          <div class="attendance-1 df">
            <div class="attendance-2">
              <img src="../../../../assets/bigScreen/BigIcon/标题装饰.png" />
            </div>
            <div class="attendance-3">考勤汇总</div>
          </div>
          <div class="rightcontet">
            <div class="tuli">
              <div
                :class="[selected == 1 ? 'color-blue' : '', 'yue']"
                @click="clickTime(1)"
              >
                月
              </div>
              <div
                :class="[selected == 2 ? 'color-blue' : '', 'zhou']"
                @click="clickTime(2)"
              >
                周
              </div>
              <div
                :class="[selected == 3 ? 'color-blue' : '', 'tian']"
                @click="clickTime(3)"
              >
                天
              </div>
            </div>
          </div>
        </div>

        <div class="progress-late">
          <div class="progress">
            <div class="title">迟到</div>
            <el-progress
              type="line"
              stroke-linecap="square"
              :percentage="70"
              :show-text="false"
            >
            </el-progress>
            <span class="pro-text">迟到12人</span>
          </div>
          <div class="progress">
            <div class="title">早退</div>
            <el-progress
              type="line"
              stroke-linecap="square"
              :percentage="70"
              :show-text="false"
            >
            </el-progress>
            <span class="pro-text">早退12人</span>
          </div>
          <div class="progress">
            <div class="title">上班缺卡</div>
            <el-progress
              type="line"
              stroke-linecap="square"
              :percentage="70"
              :show-text="false"
            >
            </el-progress>
            <span class="pro-text">缺卡12人</span>
          </div>
          <div class="progress">
            <div class="title">下班缺卡</div>
            <el-progress
              type="line"
              stroke-linecap="button"
              :percentage="70"
              :show-text="false"
            >
            </el-progress>
            <span class="pro-text">下班缺卡12人</span>
          </div>
        </div>
      </div>

      <!--打卡时间范围-->
      <div class="attendanceCount df dakawrapper">
        <div class="attendanceC-1">
          <div class="attendance-1 df">
            <div class="attendance-2">
              <img src="../../../../assets/bigScreen/BigIcon/标题装饰.png" />
            </div>
            <div class="attendance-3">打卡时间范围</div>
          </div>
          <div class="rightcontet">
            <div class="tuli">
              <div
                :class="[selected == 1 ? 'color-blue' : '', 'yue']"
                @click="clickTime(1)"
              >
                月
              </div>
              <div
                :class="[selected == 2 ? 'color-blue' : '', 'zhou']"
                @click="clickTime(2)"
              >
                周
              </div>
              <div
                :class="[selected == 3 ? 'color-blue' : '', 'tian']"
                @click="clickTime(3)"
              >
                天
              </div>
            </div>
          </div>
        </div>

        <div id="daka"></div>
      </div>

      <!--工时统计-->
      <div class="attendanceCount df gongshiwrapper">
        <div class="attendanceC-1">
          <div class="attendance-1 df">
            <div class="attendance-2">
              <img src="../../../../assets/bigScreen/BigIcon/标题装饰.png" />
            </div>
            <div class="attendance-3">工时统计</div>
          </div>
          <div class="rightcontet">
            <div class="tuli">
              <div
                :class="[selected == 1 ? 'color-blue' : '', 'yue']"
                @click="clickTime(1)"
              >
                月
              </div>
              <div
                :class="[selected == 2 ? 'color-blue' : '', 'zhou']"
                @click="clickTime(2)"
              >
                周
              </div>
            </div>
          </div>
        </div>

        <div id="gongshi"></div>
      </div>
    </div>

    <div class="centerContent-second" v-show="activeIndex == 1">
      <div class="topItem">
        <div class="topInner centerItem">异常天数</div>
        <div class="output">导出</div>
      </div>

      <!-- 表格 -->
      <el-table ref="multipleTable" :data="tableData" class="elTable">
        <el-table-column label="工号" min-width="90"> 00138 </el-table-column>

        <el-table-column label="姓名" min-width="90" show-overflow-tooltip>
          王孟超
        </el-table-column>

        <el-table-column label="手机号" min-width="90">
          17798539223
        </el-table-column>

        <el-table-column label="上班打卡" min-width="90" show-overflow-tooltip>
          正常
        </el-table-column>

        <el-table-column label="上班打卡时间" min-width="90"> </el-table-column>

        <el-table-column label="下班打卡状态" min-width="120">
          异常
        </el-table-column>

        <el-table-column label="下班打卡时间" min-width="120">
          19：00
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination">
        <div class="paging">
          <span class="every-page">每页</span>
          <el-select
            v-model="number"
            @change="numberChange"
            style="width: 4.375rem"
          >
            <el-option
              v-for="(item, index) in numberList"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
          <span class="every-page">条记录</span>
        </div>
        <div>
          <el-pagination
            :current-page.sync="pageInfo.pageNum"
            :page-size="pageInfo.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalNum"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrganizationTreeUdc } from '@/utils/api'
import { getFormatDate4, getDIYTime1 } from '@/utils/mutil'
export default {
  data() {
    return {
      activeIndex: 0, //0代表点击组织树 1代表条件检索
      activeMenu1: {
        name: '',
      },

      defaultProps: {
        children: 'children',
        label: 'label',
      },
      dataLoading: true,
      elementLoadingText: '组织努力加载中',
      filterText: '',
      treeData: [],
      selected: 2, //考情统计
      departmentList: [
        {
          label: '销售部',
          value: 1,
        },
      ],
      searchInfo: {
        visitStatus: '',
      },
      visitStatuslist: [
        {
          label: '已到',
          value: 1,
        },
      ],
      timeType: '1',
      dateValue: '',
      tableData: [],
      totalNum: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      numberList: [10, 20, 30],
      number: '10',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  mounted() {
    this.getOrganizationTree()
    //打卡时间范围
    this.getDakaTime()
    //工时
    this.getWorkTime()
  },
  methods: {
    //左边组织树
    getOrganizationTree() {
      getOrganizationTreeUdc({
        type: 2,
      }).then((res) => {
        if (res.resultCode == 0) {
          this.treeData = res.nodeList
          this.dataLoading = false
        }
      })
    },
    getDakaTime() {
      let barChart = this.$echarts.init(document.getElementById('daka'))
      barChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['上班打卡', '下班打卡'],
          textStyle: {
            color: '#ffffff',
          },
        },
        color: ['#3E79FF', '#B048FF'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['9:00', '10:00', '11:00', '12:00', '13:00'],
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 人',
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            },
          },
          minInterval: 1,
        },
        // x轴拖动
        dataZoom: [
          {
            type: 'slider',
            height: 15, //滚动条高度
            start: 8, //滚动条开始位置（共100等份）
            end: 65, //结束位置（共100等份）
          },
        ],
        series: [
          {
            name: '上班打卡',
            type: 'line',
            data: [2, 3.2, 13, 2, 7],
            color: '#B048FF',
            //线条样式
            lineStyle: {
              color: '#B048FF',
            },
            smooth: 0.3,
          },
          {
            name: '下班打卡',
            type: 'line',
            data: [3, 4, 6, 7, 4],
            color: '#3E79FF',
            //线条样式
            lineStyle: {
              color: '#3E79FF',
            },
            smooth: 0.3,
          },
        ],
      }
      barChart.setOption(option)
    },
    getWorkTime() {
      let barChart = this.$echarts.init(document.getElementById('gongshi'))
      barChart.clear()
      let option = {
        legend: {
          textStyle: {
            //图例文字的样式
            color: '#ffffff',
          },
        },
        tooltip: {},
        color: ['#51C7FF', '#5686FF'],
        dataset: {
          dimensions: ['time', 'eligible', 'average'],
          source: [
            {
              time: '10/1',
              eligible: 8,
              average: 8.4,
            },
            {
              time: '10/2',
              eligible: 8,
              average: 6,
            },
            {
              time: '10/3',
              eligible: 6,
              average: 6,
            },
            {
              time: '10/4',
              eligible: 6,
              average: 8,
            },
            {
              time: '10/5',
              eligible: 6,
              average: 8,
            },
            {
              time: '10/6',
              eligible: 6,
              average: 8,
            },
            {
              time: '10/7',
              eligible: 6,
              average: 8,
            },
          ],
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#ffffff',
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff',
                width: '2',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} 人',
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff',
                width: '2',
              },
            },
          },
        ],
        series: [
          {
            type: 'bar',
            name: '合格工时',
          },
          {
            type: 'bar',
            name: '平均工时',
          },
        ],
      }
      barChart.setOption(option)
    },

    clickActiveIndex(val) {
      this.activeIndex = val
    },
    filterNodeMethod(value, data) {
      console.log(value)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange() {},
    clickTime(time) {
      this.selected = time
    },
    format(percent) {
      return '早退21人'
    },
    //检索
    getSearch() {},
    resetCondition() {},
    // 时间按钮发生变化时
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
    // 时间选择器发生改变时
    changeDate() {
      this.date_format()
    },
    // 修改时间格式
    date_format() {
      if (this.dateValue) {
        this.searchInfo.beginTime = getFormatDate4(this.dateValue[0])
        this.searchInfo.endTime = getFormatDate4(this.dateValue[1])
      }
    },
    handleCurrentChange() {},
    numberChange() {},
  },
}
</script>

<style lang="scss">
#attendance {
  .leftVisit {
    display: flex;
    flex-direction: column;
    padding: 0 1.375rem;

    .topCheck {
      display: flex;
      justify-content: center;
      margin-top: 1.875rem;

      .orga {
        width: 5.625rem;
        border: 0.0625rem solid #7ea5c9;
        border-radius: 0.5rem 0rem 0rem 0.5rem;
        color: #fefefe;
        cursor: pointer;
        line-height: 2rem;
        text-align: center;
      }

      .conditionCheck {
        border-radius: 0rem 0.5rem 0.5rem 0;
        border-left: 0;
      }

      .bgblue {
        background: #00ccff;
      }
    }

    .activeMenu1 {
      margin-top: 1.8125rem;

      .myTree {
        margin-top: 1.875rem;

        .el-tree {
          background: none;
        }

        .el-tree-node__label {
          color: #c1c7d0;
        }
      }

      #myTree .el-tree-node__content:hover {
        background-color: rgba(0, 204, 255, 0.5);
      }

      #myTree .el-tree-node__content:focus {
        background-color: rgba(0, 204, 255, 0.5);
      }

      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(0, 204, 255, 0.5);
      }
    }

    .activeMenu2 {
      margin-top: 1.8125rem;

      .searchTab {
        color: #ffffff;
        display: flex;
        line-height: 2.25rem;
        margin-bottom: 1.125rem;

        .formItem {
          width: 18.9375rem;

          .el-radio-group .el-radio-button__inner {
          }
        }

        .el-select {
          width: 18.9375rem !important;
        }

        .name {
          width: 6.25rem;
          text-align: right;
        }
      }

      .caozuo {
        display: flex;
        justify-content: center;
        margin-top: 2.5rem;

        .jiansuo {
          width: 10rem;
          background: #00ccff;
          border-radius: 0.25rem;
          height: 2.5rem;
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: center;
          line-height: 2.5rem;
          font-size: 0.9375rem;
        }

        .reset {
          margin-left: 1.3125rem;
          background: none;
          border: 0.0625rem solid #b5bdbf;
          cursor: pointer;
        }
      }
    }
  }

  .centerContent {
    pointer-events: auto;
    width: 26.25rem;
    min-height: 90%;
    height: 89.8vh;
    position: absolute;
    left: 23.3125rem;
    margin-top: 1rem;
    top: 0rem;
    background: rgba(12, 25, 44, 0.5);
    padding: 1.0625rem;

    .topContent {
      display: flex;

      .comeIn {
        display: flex;
        justify-content: center;
        flex: 1;

        .icon {
          width: 3.75rem;
          height: 3.75rem;
        }

        .rightData {
          display: flex;
          flex-direction: column;
          margin-left: 1.0625rem;

          .myconme {
            color: #ffffff;
            flex: 1;
            text-align: center;
          }

          .attendanceData {
            font-weight: bold;
            color: #00c9fe;
            font-size: 1.5rem;
            flex: 1;
          }
        }
      }
    }

    .attendanceCount {
      margin-top: 1.875rem;
      line-height: 1.875rem;
      display: flex;
      flex-direction: column;

      .attendanceC-1 {
        display: flex;
        justify-content: space-between;
      }

      .attendance-3 {
        color: #ffffff;
      }

      .rightcontet {
        width: 6.25rem;

        .tuli {
          z-index: 10000;
          //width: 6.25rem;
          display: flex;
          position: absolute;
          color: white;
          line-height: 1.75rem;
          border-radius: 0.25rem;
          border: 0.0625rem solid #00ccff;
          cursor: pointer;

          .yue {
            flex: 1;
            text-align: center;
          }

          .zhou {
            flex: 1;

            text-align: center;
          }

          .tian {
            flex: 1;
            text-align: center;
          }

          .color-blue {
            background: #3696e5;
          }
        }
      }

      .progress-late {
        margin-top: 1.5625rem;

        .progress {
          display: flex;

          .el-progress {
            margin-left: 1.25rem;
            width: 13.25rem !important;
            display: flex;
          }

          .pro-text {
            color: #ffffff;
            margin-left: 0.625rem;
          }
        }

        .title {
          width: 4.0625rem;
          text-align: right;
          color: #ffffff;
        }

        .el-progress-bar__inner {
          background: linear-gradient(90deg, #00a5f0, #00e6ff);
        }

        .el-progress-bar__outer {
          height: 0.875rem !important;
          margin-top: 0.4375rem;
          border-radius: 0 !important;
        }

        .el-progress-bar__inner {
          border-radius: 0 !important;
        }
      }
    }

    .dakawrapper {
      #daka {
        width: 100%;
        height: 15.625rem;
      }
    }

    .gongshiwrapper {
      #gongshi {
        width: 100%;
        height: 15.625rem;
      }
    }
  }

  .centerContent-second {
    width: 46.25rem;
    height: 54.3125rem;
    position: absolute;
    pointer-events: auto;
    left: 23.3125rem;
    top: 0rem;
    background: rgba(12, 25, 44, 0.5);
    padding: 1.0625rem;

    .topItem {
      display: flex;
      margin-top: 2.5rem;
    }

    .elTable {
      margin-top: 3rem !important;
    }

    .el-table th {
      background: rgba(0, 204, 255, 0.3) !important;
    }
    .el-table thead {
      color: #ffffff;
    }

    .pagination {
      display: flex;
      position: absolute;
      right: 0.625rem;
      bottom: 1.25rem;

      .paging {
        .every-page {
          color: #ffffff;
        }
      }

      .el-pagination__jump {
        color: #ffffff !important;
      }
    }

    .topInner {
      font-weight: bold;
      color: #1efffc;
      font-size: 1rem;
      // margin-top: 2.625rem;
      font-family: Microsoft YaHei;
      vertical-align: middle;
      margin-left: 17.0625rem;
    }

    .output {
      width: 6.25rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background: #00ccff;
      border-radius: 0.25rem;
      color: #ffffff;
      text-align: center;
      margin-left: 16.125rem;
    }
  }

  .df {
    display: flex;
  }

  .centerItem {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
