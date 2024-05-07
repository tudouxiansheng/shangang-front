<template>
  <div class="p-7" ref="offline" v-if="isRouterAlive">
    <div class="statistics-box">
      <div class="statistics-item itemLv1">
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.Offline7') }}</div>
          <count-to
            :start-val="0"
            :end-val="offlineCounts1"
            :duration="2600"
            class="item-right-subTitle"
          />
        </div>
      </div>
      <div class="statistics-item itemLv2">
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.Offline730') }}</div>
          <count-to
            :start-val="0"
            :end-val="offlineCounts2"
            :duration="2600"
            class="item-right-subTitle"
          />
        </div>
      </div>
      <div class="statistics-item itemLv3">
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.Offline30') }}</div>
          <count-to
            :start-val="0"
            :end-val="offlineCounts3"
            :duration="2600"
            class="item-right-subTitle"
          />
        </div>
      </div>
    </div>
    <el-form :model="searchForm" ref="searchForm" :inline="true" label-position="left">
      <el-row>
        <el-col :span="6" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + '：'">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :clearable="false"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('deviceInfo.offlineDaysGreaterThan') + '(>):'"
            :label-width="locale === 'en' ? '160px' : '90px'"
          >
            <el-input-number
              style="width: 80px"
              v-model.number="offlineTime"
              :min="1"
              :max="999"
              :controls="false"
              @change="offlineTimeChange"
            ></el-input-number>
            {{ $t('report.day') }}
          </el-form-item>
        </el-col>
        <el-col :span="10" class="text-right">
          <el-button type="primary" @click="getOnOfflineStat" v-hasPermi="[1409]">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            v-hasPermi="[1410]"
            type="success"
            :loading="exportLoading"
            @click="handleExport"
          >
            {{ $t('businessLog.exportExcel') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <myCollapse>
      {{ $t('deviceInfo.deviceOfflineStatistics') }}
      <template v-slot:content>
        <el-row v-loading="echartLoading">
          <echart
            ref="resourceOperateBar"
            id="resourceOperateBar"
            height="400px"
            :options="getOption()"
          ></echart>
        </el-row>
      </template>
    </myCollapse>
    <el-form
      :model="searchForm"
      ref="searchForm1"
      :inline="true"
      :label-width="locale === 'en' ? '120px' : '90px'"
      label-position="left"
    >
      <el-row class="mt-5">
        <el-col>
          <el-form-item :label="$t('devModel.cameraName') + ':'" prop="devName">
            <el-input
              v-model.trim="searchForm.devName"
              :placeholder="$t('devModel.inputCameraName')"
            >
              <el-icon
                class="cursor1 el-icon-search el-input__icon"
                slot="suffix"
                @click="getOnOfflineLongNewDetail"
                v-hasPermi="[1409]"
              ></el-icon>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        :max-height="tableHeght"
        :row-class-name="tableRowClassName"
      >
        <el-table-column :label="$t('devModel.cameraName')" prop="devName" show-overflow-tooltip />
        <el-table-column :label="$t('devModel.cameraId')" prop="devId" show-overflow-tooltip />
        <el-table-column :label="$t('public.AffiliatedOrg')" prop="area" show-overflow-tooltip />
        <el-table-column
          :label="$t('videoOperate.offlineDuration')"
          prop="offlineHours"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.offlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('cascadeDevice.platform')"
          prop="platName"
          show-overflow-tooltip
        />
      </el-table>
    </el-row>
    <el-row>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getOnOfflineStat"
      />
    </el-row>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import echart from '@/components/echart'
import myCollapse from './component/collapse'
import CountTo from 'vue-count-to'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import { getDayHourMinAndSec } from '@/utils/common/mutil'

export default {
  components: { Treeselect, echart, CountTo, myCollapse },
  data() {
    return {
      isShowEchart: true, // 是否显示或隐藏 echart
      tableHeght: 260,
      isRouterAlive: true,
      permissionsStatistics: true,
      permissionsStatisticsDetail: true,
      organizationOption: null,
      organizationId: undefined,
      organizationIdCopy: undefined,
      offlineTime: 7,
      timeType: '2',
      searchForm: {
        devName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      total: 0,
      echartLoading: false,
      echartData: [],
      loading: false,
      tableHeaderList: [],
      tableData: [],
      xData: [],
      offlineList: [],
      offlineCounts1: 0,
      offlineCounts2: 0,
      offlineCounts3: 0,
      exportLoading: false
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      this.permissionsStatistics = await permissions(1409)
      this.permissionsStatisticsDetail = await permissions(1409)
    },
    timeTypeChange() {
      switch (this.timeType) {
        case '1':
          this.offlineTime = 1
          break
        case '2':
          this.offlineTime = 7
          break
        case '3':
          this.offlineTime = 30
          break
        default:
          break
      }
    },
    offlineTimeChange(currentValue, oldValue) {
      switch (currentValue) {
        case 1:
          this.timeType = '1'
          break
        case 7:
          this.timeType = '2'
          break
        case 30:
          this.timeType = '3'
          break
        default:
          this.timeType = ''
          break
      }
    },
    handleShowEchart() {
      this.isShowEchart = !this.isShowEchart
      this.tableHeght = this.isShowEchart ? 260 : 500
      if (this.isShowEchart) {
        this.$refs.resourceOperateBar.resizeEchart()
      }
    },
    handleReset() {
      this.offlineTime = 7
      this.searchForm.pageInfo.pageNum = 1
      this.searchForm.pageInfo.pageSize = 10
      this.searchForm.devName = ''
      this.organizationId = this.organizationIdCopy
      this.$refs['searchForm'].resetFields()
      this.getOnOfflineStat()
    },
    async getOnOfflineStat() {
      this.loading = true
      this.echartLoading = true
      this.searchForm.offlineTime = this.offlineTime
      this.searchForm.organizationId = this.organizationId
      if (this.permissionsStatistics) {
        let res1 = await this.$api.onOfflineDetailLongStat(this.searchForm)
        if (res1.resultCode == 0) {
          this.echartLoading = false
          this.echartData = res1.onOfflineDeviceInfos
          this.xData = []
          this.offlineList = []
          this.echartData.forEach(item => {
            this.xData.push(item.area)
            this.offlineList.push(item.offlineCounts)
          })
          this.offlineCounts1 = res1.offlineCounts1
          this.offlineCounts2 = res1.offlineCounts2
          this.offlineCounts3 = res1.offlineCounts3
        }
      }
      if (this.permissionsStatisticsDetail) {
        let res2 = await this.$api.longOnOfflineLongNewDetail(this.searchForm)
        if (res2.resultCode == 0) {
          this.loading = false
          this.tableData = []
          let list = res2.longOfflineDevices
          if (list.length > 0) {
            this.tableData = list
            this.total = res2.pageInfo.totalNum
          } else {
            this.tableData = []
            this.total = 0
          }
        }
      }
    },
    async getOnOfflineLongNewDetail() {
      if (this.permissionsStatisticsDetail) {
        let res2 = await this.$api.longOnOfflineLongNewDetail(this.searchForm)
        if (res2.resultCode == 0) {
          this.loading = false
          this.tableData = []
          let list = res2.longOfflineDevices
          if (list.length > 0) {
            this.tableData = list
            this.total = res2.pageInfo.totalNum
          } else {
            this.tableData = []
            this.total = 0
          }
        }
      }
    },
    getOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          borderWidth: 1,
          borderColor: '#8DD4FF',
          backgroundColor: 'rgba(9,40,64,0.8)',
          textStyle: {
            color: '#fff'
          }
        },
        axisPointer: {
          label: {
            backgroundColor: 'rgba(4,161,255,0.3)'
          }
        },
        legend: {
          show: false,
          top: '0%',
          right: '0%',
          icon: 'roundRect',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisPointer: {},
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('areaManage.deviceNum'),
            axisLabel: {},
            nameTextStyle: {
              color: '#999999'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#1E3174',
                type: 'dashed'
              }
            },
            axisLine: {
              show: false
            },
            max: Math.max(...this.offlineList) + 20
          }
        ],
        series: [
          {
            name: this.$t('public.longTermOfflineQuantity'),
            type: 'bar',
            barMaxWidth: 12,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#06CCF8' },
                { offset: 1, color: '#0681F8' }
              ])
            },
            data: this.offlineList
          },
          {
            type: 'pictorialBar',
            z: 0,
            barMaxWidth: 30,
            barGap: '-100%',
            symbol: 'rect',
            tooltip: {
              trigger: 'none'
            },
            itemStyle: {
              color: 'rgba(0, 0, 0, 0.15)'
            },
            data: new Array(this.offlineList.length).fill(Math.max(...this.offlineList) + 20)
          }
        ]
      }
    },
    async handleExport() {
      this.exportLoading = true
      try {
        this.searchForm.offlineTime = this.offlineTime
        this.searchForm.organizationId = this.organizationId
        let res = await this.$api.onOfflinelongStatExport(this.searchForm)
        if (res.resultCode == 0) {
          res.fileUrl && download(res.fileUrl, this.$t('public.longOfflineDevice'))
        }
      } finally {
        this.exportLoading = false
      }
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 != 1 ? '' : 'success-row'
    },
    getTimeFormatter(time) {
      return getDayHourMinAndSec(time * 1000)
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationIdCopy = this.organizationId = this.organizationOption[0].id
            this.getOnOfflineStat()
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) return {}
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
</script>
<style lang="scss" scoped>
.el-form-item {
  align-items: center;
}
.el-table th,
.el-table th.el-table__cell,
.el-table tr {
  background: #051a2e !important;
}
.treeselect {
  :deep(.el-form-item--medium .el-form-item__content) {
    width: 202px;
    line-height: 36px;
  }
}

:deep(.el-date-editor--daterange.el-input__inner) {
  width: 275px;
}
:deep(.el-range-editor--medium .el-range-separator) {
  width: 25px;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.el-table__body tr.hover-row > td) {
  background-color: #175290;
}
.el-divider__text {
  padding: 0;
  border-radius: 10px;
  background-color: #175290;
  color: #fff;
  cursor: pointer;
  span {
    padding: 0 20px;
  }
}
:deep(.el-collapse-item__header) {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  color: #fff;
  background-color: rgba(15, 64, 93, 0.5) !important;
  border: 0;
}
.statistics-box {
  margin: 0 100px;
  padding-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .statistics-item {
    width: 240px;
    height: 72px;
    .statistics-item-right {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      margin-left: 114px;
      .item-right-title {
        white-space: nowrap;
      }
      .item-right-subTitle {
        font-size: 28px;
        font-weight: 400;
        color: #9fffdd;
        text-shadow: 0px 4px 4px rgba(159, 255, 221, 0.25);
      }
    }
  }
  .itemLv1 {
    background: url('~@/assets/img/common/offlineLv1.png') no-repeat !important;
    background-size: 100% 100%;
  }
  .itemLv2 {
    background: url('~@/assets/img/common/offlineLv2.png') no-repeat !important;
    background-size: 100% 100%;
  }
  .itemLv3 {
    background: url('~@/assets/img/common/offlineLv3.png') no-repeat !important;
    background-size: 100% 100%;
  }
}
.collapse-box {
  .collapse-box-title {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    color: #fff;
    background-color: rgba(15, 64, 93, 0.5);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collapse-box-content {
  }
}
</style>
