<template>
  <div class="p-5" ref="successRate" v-if="isRouterAlive">
    <div class="outclass">
      <div class="mokuaione">
        <div>
          <span class="yulanzongshu">{{ $t('successRate.totalNumberOfPreviews') }}</span>
          <br />
          <span class="yulanzongshushuzi">{{ total }}</span>
        </div>
        <div>
          <img src="@/assets/img/common/yulanzongshu.png" />
        </div>
      </div>
      <div class="mokuaitwo">
        <div>
          <span class="yulanzongshu">{{ $t('successRate.numberOfFailedPreviews') }}</span>
          <br />
          <span class="yulanzongshushuzi">{{ failure }}</span>
        </div>
        <div>
          <img src="@/assets/img/common/yulanshibaicishu.png" />
        </div>
      </div>
      <div class="mokuaithree">
        <div>
          <span class="yulanzongshu">{{ $t('successRate.numberOfSuccessfulPreviews') }}</span>
          <br />
          <span class="yulanzongshushuzi">{{ successNum }}</span>
        </div>
        <div>
          <img src="@/assets/img/common/yulanchenggongcishu.png" />
        </div>
      </div>
      <div class="mokuaifore">
        <div>
          <span class="yulanzongshu">{{ $t('successRate.notDetected') }}</span>
          <br />
          <span class="yulanzongshushuzi">{{ unchecked }}</span>
        </div>
        <div>
          <img src="@/assets/img/common/weijiance.png" />
        </div>
      </div>
      <div class="mokuaifive">
        <div>
          <span class="yulanzongshu">{{ $t('successRate.previewSuccessRate') }}</span>
          <br />
          <span class="yulanzongshushuzi">{{ rate }}</span>
        </div>
        <div>
          <img src="@/assets/img/common/yulanchenggonglv.png" />
        </div>
      </div>
    </div>
    <div class="outclasstwo">
      <el-form
        :model="formInline"
        ref="formInline"
        :label-width="locale == 'en' ? '200px' : '80px'"
        label-position="left"
        class="border-b queryForm"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="20">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item
                  :label="$t('successRate.deviceRetrievalLatitude') + '：'"
                  label-width="110px"
                >
                  <el-radio-group v-model="formInline.retrievalType">
                    <el-radio :label="0">{{ $t('successRate.area') }}</el-radio>
                    <el-radio :label="1">{{ $t('successRate.monitoringPlatform') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" class="treeselect">
                <el-form-item :label="$t('successRate.area') + '：'">
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
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item :label="$t('successRate.equipmentName') + '：'">
                  <el-input
                    v-model="formInline.devName"
                    :placeholder="$t('successRate.pleaseEnterTheDeviceName')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item :label="$t('successRate.deviceIP') + '：'">
                  <el-input
                    v-model="formInline.ipAddress"
                    :placeholder="$t('successRate.pleaseEnterTheDeviceIP')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item
                  :label="$t('successRate.deviceInterconnectionCode') + '：'"
                  class="inputstyle"
                  label-width="110px"
                >
                  <el-input
                    v-model="formInline.interconnectCode"
                    :placeholder="$t('successRate.pleaseEnterTheDeviceInterconnectionCode')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item :label="$t('successRate.deviceID') + '：'">
                  <el-input
                    v-model="formInline.devId"
                    :placeholder="$t('successRate.pleaseEnterTheDeviceID')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-form-item :label="$t('successRate.date') + '：'">
                  <el-date-picker
                    style="width: 260px"
                    v-model="formInline.date"
                    type="daterange"
                    :range-separator="$t('successRate.to')"
                    :start-placeholder="$t('successRate.startDate')"
                    :end-placeholder="$t('successRate.endDate')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4">
            <el-button type="primary" @click="getListSearch" style="min-width: 33%">
              {{ $t('public.search') }}
            </el-button>
            <el-button @click="resetForm('formInline')" style="min-width: 33%">
              {{ $t('public.reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="outclassthree">
      <div id="mainecharts" class="outclassthree11"></div>
      <div>
        <el-button
          type="success"
          style="margin: 10px 0px 10px 0px"
          :disabled="tableData.length == 0"
          @click="downfile"
          v-hasPermi="[1431]"
        >
          {{ $t('successRate.export') }}
        </el-button>
        <el-table
          border
          :row-class-name="tableRowClassName"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 99%; border: 1px solid #156c9e"
          v-loading="loading1"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :label="$t('successRate.equipmentName')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.devName }}</template>
          </el-table-column>
          <el-table-column :label="$t('successRate.deviceID')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.devId }}</template>
          </el-table-column>
          <el-table-column :label="$t('successRate.deviceIP')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.ip }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('successRate.deviceInterconnectionCode')"
            show-overflow-tooltip
          >
            <template #default="{ row }">{{ row.interconnectCode }}</template>
          </el-table-column>
          <el-table-column :label="$t('successRate.area')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.orgName }}</template>
          </el-table-column>
          <el-table-column :label="$t('successRate.belongingToThePlatform')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.platName }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('successRate.keyFrameDelay')"
            :formatter="timeFormatter1"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :label="$t('successRate.streamAddressSignalingDelay')"
            :formatter="timeFormatter2"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :label="$t('successRate.videoStreamDelay')"
            :formatter="timeFormatter3"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column :label="$t('successRate.totalNumberOfFetches')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.totalCounts }}</template>
          </el-table-column>
          <el-table-column :label="$t('successRate.successRateOfFetching')" show-overflow-tooltip>
            <template #default="{ row }">{{ row.rate }}</template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <pagination
          v-show="tableData.length"
          :total="totalNum"
          v-model:pageNum="pageNum"
          v-model:limit="pageSize"
          @pagination="getList"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { download } from '@/utils/common/download'
import api from '@/api'
import { getDayHourMinAndSecAndMilli } from '@/utils/common/mutil'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
export default {
  components: {
    Treeselect
  },
  name: 'VideoPreviewStatistics',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      organizationOption: null,
      isRouterAlive: true,
      loading1: false,
      totalNum: 0, // 总数量
      formInline: {
        interconnectCode: '',
        devName: '',
        ipAddress: '',
        devId: '',
        retrievalType: 0,
        region: Number(sessionStorage.getItem('organizationId')),
        date: []
      },
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
                  areaName: this.$t('successRate.entireCountry'),
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
      tableData: [],
      multipleSelection: [],
      loading: true,
      pageNum: 1,
      pageSize: 10,
      /*以下是视频预览概要数据*/
      total: 0,
      successNum: 0,
      failure: 0,
      unchecked: 0,
      rate: '0%',
      //横坐标数据
      hengzuobiao: [],
      //折线图所需数组
      chenggongcishu: [],
      shibaicishu: [],
      chenggonglv: []
    }
  },
  created() {
    this.getSummaryInfo()
    this.getPreviewList()
  },
  mounted() {
    this.getEchartsOption()
    this.initWrapperHeight()
  },
  methods: {
    /** 视频预览概要 */
    getSummaryInfo() {
      this.$api.getSummaryInfo().then(res => {
        this.total = res.total
        this.successNum = res.successNum
        this.failure = res.failure
        this.unchecked = res.unchecked
        this.rate = res.successRate
      })
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /** 查询视频预览列表 */
    getPreviewList() {
      var start = ''
      var end = ''
      this.loading1 = true
      if (this.formInline.date != null && this.formInline.date[0]) {
        var done = new Date(this.formInline.date[0])
        start =
          done.getFullYear() +
          '-' +
          (done.getMonth() > 9 ? done.getMonth() + 1 : '0' + (done.getMonth() + 1)) +
          '-' +
          (done.getDate() > 9 ? done.getDate() : '0' + done.getDate())
      } else {
        var time = new Date().getTime() - 6 * 24 * 60 * 60 * 1000
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
        var myDate = new Date()
        this.formInline.date.push(myDate)
        end =
          myDate.getFullYear() +
          '-' +
          (myDate.getMonth() > 9 ? myDate.getMonth() + 1 : '0' + (myDate.getMonth() + 1)) +
          '-' +
          (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate())
      }
      //查询视频预览列表
      this.$api
        .getPreviewList({
          organizationId: this.formInline.region,
          retrievalType: this.formInline.retrievalType,
          interconnectCode: this.formInline.interconnectCode,
          devName: this.formInline.devName,
          ipAddress: this.formInline.ipAddress,
          devId: this.formInline.devId,
          startDate: start,
          endDate: end,
          pageInfo: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.totalNum = res.pageInfo.totalNum
          this.pageSize = res.pageInfo.pageSize
          this.pageNum = res.pageInfo.pageNum
          this.tableData = res.previewList
          this.loading1 = false
        })

      //视频预览子组织（平台）概览
      this.$api
        .getChildPreviewList({
          organizationId: this.formInline.region,
          retrievalType: this.formInline.retrievalType,
          startDate: start,
          endDate: end
        })
        .then(res => {
          this.hengzuobiao = []
          this.chenggongcishu = []
          this.shibaicishu = []
          this.chenggonglv = []
          if (res.childStat) {
            res.childStat.forEach(item => {
              this.hengzuobiao.push(item.name)
              this.chenggongcishu.push(item.success)
              this.shibaicishu.push(item.failure)
              this.chenggonglv.push(item.successRate.slice(0, -1))
            })
          }
          this.getEchartsOption()
        })
    },
    /*文件导出*/
    downfile() {
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
        var time = new Date().getTime() - 6 * 24 * 60 * 60 * 1000
        var tragetTime = new Date(time)
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
        var myDate = new Date()
        end =
          myDate.getFullYear() +
          '-' +
          (myDate.getMonth() > 9 ? myDate.getMonth() + 1 : '0' + (myDate.getMonth() + 1)) +
          '-' +
          (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate())
      }
      this.$api
        .fileExport({
          organizationId: this.formInline.region,
          retrievalType: this.formInline.retrievalType,
          interconnectCode: this.formInline.interconnectCode,
          devName: this.formInline.devName,
          ipAddress: this.formInline.ipAddress,
          devId: this.formInline.devId,
          startDate: start,
          endDate: end,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.fileUrl) {
            download(res.fileUrl, this.$t('successRate.listExport'))
          }
        })
    },
    timeFormatter1(row) {
      return getDayHourMinAndSecAndMilli(row.avgKeyFrameDelay)
    },
    timeFormatter2(row) {
      return getDayHourMinAndSecAndMilli(row.avgGetUrlDelay)
    },
    timeFormatter3(row) {
      return getDayHourMinAndSecAndMilli(row.avgStreamDelay)
    },
    /*重置按钮*/
    async resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline = {
        interconnectCode: '',
        devName: '',
        ipAddress: '',
        devId: '',
        retrievalType: 0,
        region: Number(sessionStorage.getItem('organizationId')),
        date: []
      }
      this.getPreviewList()
    },
    onSubmit() {},
    getEchartsOption() {
      var chartDom = document.getElementById('mainecharts')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter(params) {
            let v =
              params[0].axisValueLabel +
              '<br/>' +
              params[0].seriesName +
              '：' +
              params[0].data +
              '<br/>' +
              params[1].seriesName +
              '：' +
              params[1].data +
              '<br/>' +
              params[2].seriesName +
              '：' +
              params[2].data +
              '%'
            return v
          }
        },
        legend: {
          top: 'bottom',
          textStyle: {
            color: '#FFFFFF'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.hengzuobiao,
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          }
        },
        series: [
          {
            name: this.$t('successRate.numberOfSuccessfulPreviews'),
            type: 'bar',
            stack: 'Ad',
            barWidth: 30, //柱子宽度
            barGap: 1, //柱子之间间距
            emphasis: {
              focus: 'series'
            },
            data: this.chenggongcishu
          },
          {
            name: this.$t('successRate.numberOfFailedPreviews'),
            type: 'bar',
            stack: 'Ad',
            barWidth: 30, //柱子宽度
            barGap: 1, //柱子之间间距
            emphasis: {
              focus: 'series'
            },
            data: this.shibaicishu
          },
          {
            name: this.$t('successRate.successRate'),
            type: 'bar',
            stack: 'Ad',
            barWidth: 30, //柱子宽度
            barGap: 1, //柱子之间间距
            emphasis: {
              focus: 'series'
            },
            data: this.chenggonglv
          }
        ]
      }
      option && myChart.setOption(option, true)
      window.onresize = function () {
        myChart.resize()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /** 初始化容器高度 背景色问题 */
    initWrapperHeight() {
      this.$nextTick(function () {
        let mainCenter = document.getElementById('main-center')
        this.$refs.successRate.style.minHeight = mainCenter.clientHeight - 30 + 'px'
      })
    },
    // 分页
    getList() {
      this.getPreviewList()
    },
    /*查询*/
    getListSearch() {
      this.pageNum = 1
      this.pageSize = 10
      this.getPreviewList()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.outclass {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.outclasstwo {
  height: 25%;
  border-bottom: 1px solid;
  border-top: 1px solid;
  margin-top: 20px;
  padding-top: 10px;
  padding-left: 10px;
  border-top-color: #48535a;
  border-bottom-color: #48535a;
}
.outclassthree {
  margin-top: 20px;
  border-radius: 4px;
}
.outclassthree11 {
  height: 540px;
  width: 90%;
  padding-bottom: 3px;
  padding-left: 4%;
}
.mokuaione {
  width: 316px;
  height: 148px;
  background: #4e94f8;
  border-radius: 8px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}
.mokuaitwo {
  width: 316px;
  height: 148px;
  background: linear-gradient(0deg, #ff6b6b, #ff9292);
  border-radius: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}
.mokuaithree {
  width: 316px;
  height: 148px;
  background: linear-gradient(0deg, #968ce4, #afa6f7);
  border-radius: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}
.mokuaifore {
  width: 316px;
  height: 148px;
  background: linear-gradient(0deg, #ffd145, #ffdf7f);
  border-radius: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}
.mokuaifive {
  width: 316px;
  height: 148px;
  background: linear-gradient(0deg, #3de0bf, #77f6dc);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}
.yulanzongshu {
  width: 72px;
  height: 19px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}
.yulanzongshushuzi {
  width: 48px;
  height: 23px;
  font-size: 28px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #ffffff;
}
.searchForm {
  display: flex;
  justify-content: space-between;
}
.el-cascader--medium {
  width: 100%;
}
:deep(.el-range-editor--medium .el-range-separator) {
  width: 25px;
}
/*解决el-col下面出现的空白问题*/
.el-row {
  display: flex;
  flex-wrap: wrap;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.border-b) {
  border-bottom-width: 0px;
}
</style>
