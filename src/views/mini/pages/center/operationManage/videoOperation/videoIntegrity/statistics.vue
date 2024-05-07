<template>
  <div class="app-container" ref="videostatistics" v-if="isRouterAlive">
    <div>
      <span
        style="
          color: #ff6b6b;
          fontsize: 14;
          fontweight: 400;
          fontfamily: MicrosoftYaHei;
          float: right;
        "
      >
        {{ $t('videoIntegrity.note') }}
      </span>
    </div>
    <div id="mainecharts" class="echartstyle" v-loading="loading"></div>
    <el-divider></el-divider>
    <div>
      <el-form
        :model="formInline"
        ref="formInline"
        :label-width="locale == 'en' ? '200px' : '80px'"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="20">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="7">
                <el-form-item
                  :label="$t('videoIntegrity.deviceRetrievalLatitude') + '：'"
                  label-width="120px"
                >
                  <el-radio-group v-model="formInline.retrievalType">
                    <el-radio :label="0">{{ $t('videoIntegrity.area') }}</el-radio>
                    <el-radio :label="1">{{ $t('videoIntegrity.monitoringPlatform1') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="7" class="treeselect">
                <el-form-item :label="$t('videoIntegrity.area') + '：'" prop="region">
                  <treeselect
                    :options="organizationOption"
                    :load-options="loadOptions"
                    :clearable="false"
                    :placeholder="$t('organizationManage.chooseArea')"
                    v-model="formInline.region"
                  >
                    <template #option-label="{ node, labelClassName }">
                      <div :class="labelClassName">
                        <span :title="node.label">{{ node.label }}</span>
                      </div>
                    </template>
                  </treeselect>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="7">
                <el-form-item :label="$t('videoIntegrity.timeLimit') + '：'" label-width="110px">
                  <el-date-picker
                    style="width: 260px"
                    v-model="formInline.date"
                    type="daterange"
                    :range-separator="$t('videoIntegrity.to')"
                    :start-placeholder="$t('videoIntegrity.startDate')"
                    :end-placeholder="$t('videoIntegrity.endDate')"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4">
            <el-button type="primary" @click="search" style="min-width: 33%">
              {{ $t('public.search') }}
            </el-button>
            <el-button @click="resetForm('formInline')" style="min-width: 33%">
              {{ $t('public.reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success" style="margin: 10px 0px 10px 21px" @click="downLieBiaofile">
        {{ $t('videoIntegrity.export') }}
      </el-button>
      <div id="mainechart" class="echartstyleZhu" v-loading="loading1"></div>
    </div>
    <el-divider></el-divider>
    <el-button type="primary" @click="detailedview">
      {{ $t('videoIntegrity.detailedview') }}
    </el-button>
    <el-button
      type="success"
      style="margin: 0px 0px 15px 21px"
      :disabled="tableData.length == 0"
      @click="downLieBiaofile"
    >
      {{ $t('videoIntegrity.exportExecel') }}
    </el-button>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-loading="loading2"
    >
      <el-table-column
        :label="
          retrievalType === 0 ? $t('videoIntegrity.area') : $t('videoIntegrity.monitoringPlatform')
        "
        show-overflow-tooltip
      >
        <template #default="{ row }">{{ row.contentName }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.videoIntegrity')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.avgRate }}</template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in liebiaoDate"
        :key="index"
        :label="item.statDay"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.recordIntegralityDayStat[index] ? row.recordIntegralityDayStat[index].rate : '-' }}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="tableDatashow && tableData.length"
      :total="totalNum"
      v-model:pageNum="pageNum"
      v-model:limit="pageSize"
      @pagination="getListByPage"
      style="padding-left: 21px"
    ></pagination>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '@/api'
import { exportExcel } from '@/utils/common/excelOperate'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
export default {
  name: 'VideoIntegrityStatistics',
  components: { Treeselect },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      tableDatashow: true,
      organizationOption: null,
      isRouterAlive: true,
      loading: false,
      loading1: false,
      loading2: false,
      retrievalType: 0,
      formInline: {
        retrievalType: 0,
        region: Number(sessionStorage.getItem('organizationId')),
        date: []
      },
      //列表页面动态数据
      liebiaoDate: [],
      pieDate: [], //饼状图数据
      /*所属区域懒加载*/
      propsCas: {
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        value: 'areaCode',
        label: 'areaName',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level == 0) {
            setTimeout(() => {
              resolve([
                {
                  areaCode: '000000000000',
                  areaLevel: 0,
                  areaName: this.$t('videoIntegrity.entireCountry'),
                  leaf: false
                }
              ])
            })
          } else {
            api.getAreaList({ areaCode: node.value }).then(res => {
              if (res.resultCode == 0) {
                const nodes = res.subAreaList.map(item => ({
                  ...item,
                  leaf: node.level >= 3
                }))
                resolve(nodes)
              }
            })
          }
        }
      },
      /*数据*/
      tableData: [],
      /*分页*/
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      //折线图数据
      quyu: [],
      riqi: [],
      serie: [],
      //列表导出数据
      liebiaoexportDate: [],
      assetTotal: 0
    }
  },
  created() {
    this.getPieDate()
    this.getRecordIntegralityStat()
  },
  methods: {
    /*获取饼状图数据*/
    getPieDate() {
      this.loading = true
      this.$api.getRecordPlanDistributionStatTwo().then(res => {
        this.assetTotal = 0
        this.pieDate = []
        res.recordIntegralityDis.forEach(item => {
          this.assetTotal = this.assetTotal + item.count
          var a = ''
          if (item.range == '0%') {
            a = this.$t('videoIntegrity.notrecordedatall')
          } else {
            a = this.$t('videoIntegrity.recordingCompleterate') + item.range
          }
          this.pieDate.push({
            value: item.count,
            name: a,
            rate: item.rate
          })
        })
        this.getEchartsOption()
        this.loading = false
      })
    },
    /*查询折线图和列表数据*/
    getRecordIntegralityStat() {
      this.loading1 = true
      this.loading2 = true
      this.retrievalType = this.formInline.retrievalType
      var start = ''
      var end = ''
      if (this.formInline.date != null && this.formInline.date[0]) {
        var done = new Date(this.formInline.date[0])
        start =
          done.getFullYear() +
          '-' +
          (done.getMonth() > 9 ? done.getMonth() + 1 : '0' + (done.getMonth() + 1)) +
          '-' +
          (done.getDate() > 9 ? done.getDate() : '0' + done.getDate())
      } else {
        var time = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        var tragetTime = new Date(time)
        /*解决日期回显问题*/
        this.formInline.date = []
        this.formInline.date.push(tragetTime)
        start =
          tragetTime.getFullYear() +
          '-' +
          (tragetTime.getMonth() > 9
            ? tragetTime.getMonth() + 1
            : '0' + (tragetTime.getMonth() + 1)) +
          '-' +
          (tragetTime.getDate() > 9 ? tragetTime.getDate() : '0' + tragetTime.getDate())
      }
      if (this.formInline.date != null && this.formInline.date[1]) {
        var dtwo = new Date(this.formInline.date[1])
        end =
          dtwo.getFullYear() +
          '-' +
          (dtwo.getMonth() > 9 ? dtwo.getMonth() + 1 : '0' + (dtwo.getMonth() + 1)) +
          '-' +
          (dtwo.getDate() > 9 ? dtwo.getDate() : '0' + dtwo.getDate())
      } else {
        var time1 = new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        var myDate = new Date(time1)
        this.formInline.date.push(myDate)
        end =
          myDate.getFullYear() +
          '-' +
          (myDate.getMonth() > 9 ? myDate.getMonth() + 1 : '0' + (myDate.getMonth() + 1)) +
          '-' +
          (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate())
      }
      this.$api
        .getRecordIntegralityStat({
          organizationId: this.formInline.region,
          retrievalType: this.formInline.retrievalType,
          retrievalStartDay: start,
          retrievalEndDay: end,
          pageInfo: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.riqi = []
          this.liebiaoexportDate = []
          this.quyu = []
          this.serie = []
          this.tableData = []
          this.liebiaoDate = []
          if (res.recordIntegralityStat) {
            if (this.formInline.retrievalType === 0) {
              this.tableDatashow = true
              this.totalNum = res.pageInfo.totalNum
            } else if (this.formInline.retrievalType === 1) {
              this.tableDatashow = false
            }
            this.tableData = res.recordIntegralityStat
            this.liebiaoDate = res.recordIntegralityStat[0].recordIntegralityDayStat
            res.recordIntegralityStat[0].recordIntegralityDayStat.forEach(itteem => {
              this.riqi.push(itteem.statDay)
            })
            res.recordIntegralityStat.forEach(item => {
              var duixiang = {}
              duixiang[this.$t('videoIntegrity.contentName')] = item.contentName
              duixiang[this.$t('videoIntegrity.videoIntegrity1')] = item.avgRate
              item.recordIntegralityDayStat.forEach(item1 => {
                duixiang[item1.statDay] = item1.rate
              })
              this.liebiaoexportDate.push(duixiang)
            })
            res.recordIntegralityStat.forEach(item => {
              this.quyu.push(item.contentName)
            })
            //折线图展示数据
            this.tableData.forEach(item => {
              var data = []
              item.recordIntegralityDayStat.forEach(iteem => {
                var rate = iteem.rate.slice(0, -1)
                data.push(rate)
              })
              var item1 = {
                name: item.contentName,
                type: 'line',
                data: data
              }
              this.serie.push(item1)
            })
          }
          this.getEchartsOptionZhu()
          this.loading1 = false
          this.loading2 = false
        })
    },
    //明细查看
    detailedview() {
      this.$router.push({
        path: '/devOps/video-monitor'
      })
    },
    /*查询*/
    search() {
      this.pageNum = 1
      this.pageSize = 10
      this.getRecordIntegralityStat()
    },
    handleClick() {},
    /*饼状图*/
    getEchartsOption() {
      var chartDom = document.getElementById('mainecharts')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: this.assetTotal + '\n' + this.$t('videoIntegrity.numberofequipment'), //图形标题，配置在中间对应效果图的80%
          left: 'center',
          top: '45%',
          textStyle: {
            color: 'rgb(14,17,17)',
            fontSize: 16,
            align: 'center'
          }
        },
        legend: {
          top: 'bottom',
          icon: 'circle'
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '60%'],
            data: this.pieDate,
            label: {
              formatter: params => {
                let weizhi
                this.pieDate.forEach((item, index) => {
                  if (item.name === params.name) {
                    weizhi = index
                  }
                })
                return (
                  this.pieDate[weizhi].name +
                  ': ' +
                  this.pieDate[weizhi].value +
                  '  ' +
                  this.pieDate[weizhi].rate
                )
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      window.onresize = function () {
        myChart.resize()
      }
      option && myChart.setOption(option, true)
    },
    /*折线图*/
    getEchartsOptionZhu() {
      var chartDom = document.getElementById('mainechart')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.quyu,
          top: 'bottom'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.riqi
        },
        yAxis: {
          type: 'value'
        },
        series: this.serie
      }
      option && myChart.setOption(option, true)
      window.onresize = function () {
        myChart.resize()
      }
    },
    /*重置按钮*/
    async resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline = {
        retrievalType: 0,
        region: 0,
        date: []
      }
      this.search()
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.formInline.region = this.organizationOption[0].id
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) {
        return {}
      } else {
        return data.map(item => {
          let obj = {
            id: item.payload.organizationId,
            label: item.label,
            children: null
          }
          if (item.leaf === true) {
            delete obj.children
          }
          return obj
        })
      }
    },
    /*列表数据excel导出*/
    downLieBiaofile() {
      exportExcel(
        [this.liebiaoexportDate],
        [this.$t('videoIntegrity.videoIntegrity1')],
        this.$t('videoIntegrity.videoIntegrityExcel')
      )
    },
    // 分页
    getListByPage() {
      this.getRecordIntegralityStat()
    }
  }
}
</script>

<style lang="scss" scoped>
.echartstyle {
  height: 300px;
  width: 100%;
  padding-bottom: 3px;
}
.echartstyleZhu {
  height: 300px;
  width: 90%;
  padding-bottom: 3px;
  padding-left: 4%;
}
.searchForm {
  display: flex;
  justify-content: space-between;
}
.yuandian1 {
  width: 5px;
  height: 5px;
  background-color: #969eab;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}
.yuandian2 {
  width: 5px;
  height: 5px;
  background-color: #76b21c;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}
.vue-treeselect {
  width: 262px;
}
:deep(.el-range-editor--medium .el-range-separator) {
  width: 25px;
}
</style>
