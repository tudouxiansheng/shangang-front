<template>
  <div ref="areaOperationAssess" v-if="isRouterAlive">
    <div class="form">
      <el-form
        :model="searchForm"
        ref="searchForm"
        :inline="true"
        label-width="80px"
        label-position="left"
      >
        <el-row>
          <el-col :span="5" class="treeselect">
            <el-form-item :label="$t('organizationManage.area') + ':'">
              <treeselect
                :options="organizationOption"
                :load-options="loadOptions"
                :clearable="false"
                :placeholder="$t('organizationManage.chooseArea')"
                @select="treeselectChange"
                v-model="searchForm.organizationId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="$t('videoOperate.timeRange') + ':'" label-width="80px">
              <el-radio-group v-model="timeType" class="mr-5" @change="timeTypeChange">
                <el-radio-button label="1">{{ $t('videoOperate.today') }}</el-radio-button>
                <el-radio-button label="2">{{ $t('videoOperate.week') }}</el-radio-button>
                <el-radio-button label="3">{{ $t('videoOperate.month') }}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                :shortcuts="pickerOptions && pickerOptions.shortcuts"
                :disabled-date="pickerOptions && pickerOptions.disabledDate"
                :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                v-model="times"
                type="daterange"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTimePrompt')"
                :end-placeholder="$t('public.endTimePrompt')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :clearable="false"
                @change="timesChange"
              >
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button v-hasPermi="[1406]" type="primary" @click="getAreaMaintenanceStat">
              {{ $t('public.search') }}
            </el-button>
            <el-button v-hasPermi="[1407]" type="success" @click="handleExport">
              {{ $t('businessLog.exportExcel') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <collapse-card :title="$t('operateManage.areaTest')" hideCollapse background>
      <template #operate>
        <el-button type="primary" @click="openDialog">
          {{ $t('operateManage.testSetting') }}
        </el-button>
      </template>
      <el-row class="statistics-container" v-loading="loading">
        <el-col :span="4" class="top5-container">
          <span style="color: #ffffff">
            【{{ organizationName }}】{{ $t('operateManage.topN') }}
          </span>
          <span v-if="tableData.length < 2" style="color: #ffffff">
            <span class="area-name">{{ $t('operateManage.noRanking') }}</span>
          </span>
          <span v-if="tableData.length > 1" style="color: #ffffff">
            <span class="top top1">1</span>
            <el-tooltip
              class="item"
              effect="light"
              :content="tableData[1].contentName"
              placement="top-start"
            >
              <span class="area-name">{{ tableData[1].contentName }}</span>
            </el-tooltip>
            <span class="count">{{ tableData[1].fraction }}</span>
          </span>
          <span v-if="tableData.length > 2" style="color: #ffffff">
            <span class="top top2">2</span>
            <el-tooltip
              class="item"
              effect="light"
              :content="tableData[2].contentName"
              placement="top-start"
            >
              <span class="area-name">{{ tableData[2].contentName }}</span>
            </el-tooltip>
            <span class="count">{{ tableData[2].fraction }}</span>
          </span>
          <span v-if="tableData.length > 3" style="color: #ffffff">
            <span class="top top3">3</span>
            <el-tooltip
              class="item"
              effect="light"
              :content="tableData[3].contentName"
              placement="top-start"
            >
              <span class="area-name">{{ tableData[3].contentName }}</span>
            </el-tooltip>
            <span class="count">{{ tableData[3].fraction }}</span>
          </span>
          <span v-if="tableData.length > 4" style="color: #ffffff">
            <span class="top top4">4</span>
            <el-tooltip
              class="item"
              effect="light"
              :content="tableData[4].contentName"
              placement="top-start"
            >
              <span class="area-name">{{ tableData[4].contentName }}</span>
            </el-tooltip>
            <span class="count">{{ tableData[4].fraction }}</span>
          </span>
          <span v-if="tableData.length > 5" style="color: #ffffff">
            <span class="top top4">5</span>
            <el-tooltip
              class="item"
              effect="light"
              :content="tableData[5].contentName"
              placement="top-start"
            >
              <span class="area-name">{{ tableData[5].contentName }}</span>
            </el-tooltip>
            <span class="count">{{ tableData[5].fraction }}</span>
          </span>
        </el-col>
        <el-col :span="20">
          <echart id="areaStatisticsBar" height="300px" :options="getOption()"></echart>
        </el-col>
      </el-row>
      <el-row>
        <el-table border v-loading="loading" :data="tableData" :row-class-name="tableRowClassName">
          <el-table-column
            :label="$t('operateManage.ranking')"
            prop="ranking"
            width="80"
            sortable
          />
          <el-table-column :label="$t('report.area')" prop="contentName" show-overflow-tooltip />
          <el-table-column
            :label="$t('report.onlineRate')"
            prop="onOfflineRate"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.onOfflineRate != undefined">{{ row.onOfflineRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('report.recordingCompleteRate')"
            prop="recordCompleteRate"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.recordCompleteRate != undefined">{{ row.recordCompleteRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('operateManage.repairRate')"
            prop="repairRate"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.repairRate != undefined">{{ row.repairRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('operateManage.videoIntactRate')"
            prop="videoIntactRate"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.videoIntactRate != undefined">{{ row.videoIntactRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('operateManage.score')"
            prop="fraction"
            show-overflow-tooltip
          />
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          v-model:pageNum="searchForm.pageInfo.pageNum"
          v-model:limit="searchForm.pageInfo.pageSize"
          :pageSizes="[5, 10, 15, 20]"
          @pagination="getAreaMaintenanceStat"
        />
      </el-row>
    </collapse-card>
    <el-dialog
      v-model="dialogVisible"
      class="dialogWithCard"
      top="10vh"
      width="370px"
      :close-on-click-modal="false"
      :modal="false"
      @closed="dialogClosed"
      draggable
    >
      <template #title>
        <div>
          <span class="dialog-title">{{ $t('operateManage.custormTest') }}</span>
          <el-popover
            placement="top-start"
            :title="$t('operateManage.areatotalScore') + ':'"
            width="400"
            trigger="hover"
          >
            <p>{{ $t('operateManage.areaScoreItem1') }}</p>
            <p>{{ $t('operateManage.areaScoreItem2') }}</p>
            <p>{{ $t('operateManage.areaScoreItem3') }}</p>
            <p>{{ $t('operateManage.areaScoreItem4') }}</p>
            <template #reference>
              <svg-icon iconClass="question-mark" className="iconClassName"></svg-icon>
            </template>
          </el-popover>
        </div>
      </template>

      <el-form
        ref="testForm"
        :model="searchForm"
        :rules="searchFormRules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.onOfflineRateProportion') + ':'"
          prop="onOfflineRateProportion"
        >
          <el-input v-model.number="searchForm.onOfflineRateProportion">
            <template #append><span style="padding-left: 5px">%</span></template>
          </el-input>
        </el-form-item>
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.recordCompleteRateProportion') + ':'"
          prop="recordCompleteRateProportion"
        >
          <el-input v-model.number="searchForm.recordCompleteRateProportion">
            <template #append><span style="padding-left: 5px">%</span></template>
          </el-input>
        </el-form-item>
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.repairRateProportion') + ':'"
          prop="repairRateProportion"
        >
          <el-input v-model.number="searchForm.repairRateProportion">
            <template #append><span style="padding-left: 5px">%</span></template>
          </el-input>
        </el-form-item>
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.videoIntactRateProportion') + ':'"
          prop="videoIntactRateProportion"
        >
          <el-input v-model.number="searchForm.videoIntactRateProportion">
            <template #append><span style="padding-left: 5px">%</span></template>
          </el-input>
        </el-form-item>
      </el-form>
      <span>({{ $t('operateManage.remain') + remainData }}%)</span>
      <template #footer>
        <span class="text-center">
          <el-button @click="resetForm">{{ $t('public.reset') }}</el-button>
          <el-button type="primary" @click="saveForm">{{ $t('tenantManage.preserve') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import collapseCard from '../../component/collapse-card.vue'
import echart from '@/components/echart'
import { getDIYTime, getFormatDate6, getDIYTime1 } from '@/utils/common/mutil.js'
import { download } from '@/utils/common/download'
import { permissions } from '@/utils/common/permissions'

export default {
  name: 'AreaOperationAssess',
  components: { Treeselect, collapseCard, echart },
  data() {
    return {
      isRouterAlive: true,
      permissionStatistics: true,
      organizationOption: null,
      organizationName: '',
      timeType: '1',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      times: [],
      dayList: [],
      weekList: [],
      mounthList: [],
      searchForm: {
        onOfflineRateProportion: 25,
        recordCompleteRateProportion: 25,
        repairRateProportion: 25,
        videoIntactRateProportion: 25,
        pageInfo: {
          pageNum: 1,
          pageSize: 5
        }
      },

      loading: true,
      tableData: [],
      total: 0,
      dialogVisible: false,
      xData: [],
      onOfflineList: [],
      recordCompleteList: [],
      repairList: [],
      videoIntactList: [],
      searchFormRules: {
        onOfflineRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.onOfflineRateProportionProp'),
            trigger: 'change'
          }
        ],
        recordCompleteRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.recordCompleteRateProportionProp'),
            trigger: 'change'
          }
        ],
        repairRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.repairRateProp'),
            trigger: 'change'
          }
        ],
        videoIntactRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.videoIntactRateProp'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    remainData() {
      return (
        100 -
        this.searchForm.onOfflineRateProportion -
        this.searchForm.recordCompleteRateProportion -
        this.searchForm.repairRateProportion -
        this.searchForm.videoIntactRateProportion
      )
    }
  },
  created() {
    this.getPermissions()
    this.timesForamtter()
  },
  methods: {
    async getPermissions() {
      this.permissionStatistics = await permissions(1406)
    },
    treeselectChange(node) {
      this.organizationName = node.label
    },
    timeTypeChange() {
      switch (this.timeType) {
        case '1':
          this.times = this.dayList
          break
        case '2':
          this.times = this.weekList
          break
        case '3':
          this.times = this.mounthList
          break
        default:
          break
      }
    },
    timesChange() {
      this.timeType = ''
    },
    timesForamtter() {
      let date = new Date()
      let dayFormattered = getFormatDate6(date)
      let weekList = getDIYTime1(3)
      let { time } = getDIYTime(3)
      let weekFormattered = getFormatDate6(weekList[0])
      let mounthFormattered = getFormatDate6(time[0])
      this.dayList = [dayFormattered, dayFormattered]
      this.times = this.dayList
      this.weekList = [weekFormattered, dayFormattered]
      this.mounthList = [mounthFormattered, dayFormattered]
    },
    async getAreaMaintenanceStat() {
      this.loading = true
      this.searchForm.retrievalStartDay = this.times[0]
      this.searchForm.retrievalEndDay = this.times[1]
      if (this.permissionStatistics) {
        let res = await this.$api.getAreaMaintenanceStat(this.searchForm)
        if (res.resultCode == 0) {
          this.loading = false
          this.total = res.pageInfo.totalNum
          this.tableData = res.areaMaintenanceList
          this.xData = []
          this.onOfflineList = []
          this.recordCompleteList = []
          this.repairList = []
          this.videoIntactList = []
          this.tableData.forEach(item => {
            this.xData.push(item.contentName)
            this.onOfflineList.push(item.onOfflineRate)
            this.recordCompleteList.push(item.recordCompleteRate)
            this.repairList.push(item.repairRate)
            this.videoIntactList.push(item.videoIntactRate)
          })
        }
      }
    },
    getOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '3%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,

            axisLine: {
              show: true,
              lineStyle: {
                color: '#E5E9ED'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              color: '#FFFFFF'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%',
              color: '#FFFFFF'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E5E9ED'
              }
            }
          }
        ],
        legend: {
          top: '6%',
          right: '3%',
          itemWidth: 14,
          textStyle: {
            color: '#FFFFFF'
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 40
          }
        ],
        series: [
          {
            name: this.$t('report.onlineRate'),
            type: 'bar',
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: '#478EFE',
                opacity: 1
              }
            },
            data: this.onOfflineList
          },
          {
            name: this.$t('report.recordingCompleteRate'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            itemStyle: {
              normal: {
                color: '#4CDBFF'
              }
            },
            data: this.recordCompleteList
          },
          {
            name: this.$t('operateManage.repairRate'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            itemStyle: {
              normal: {
                color: '#9E87FF'
              }
            },
            data: this.repairList
          },
          {
            name: this.$t('operateManage.videoIntactRate'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            itemStyle: {
              normal: {
                color: '#FF73A1'
              }
            },
            data: this.videoIntactList
          }
        ]
      }
    },

    openDialog() {
      this.dialogVisible = true
    },
    saveForm() {
      if (this.remainData != 0) {
        this.$message({
          message: this.$t('operateManage.testSaveWarn'),
          type: 'warning'
        })
      } else {
        this.dialogVisible = false
        this.getAreaMaintenanceStat()
      }
    },
    resetForm() {
      this.searchForm.onOfflineRateProportion = 25
      this.searchForm.recordCompleteRateProportion = 25
      this.searchForm.repairRateProportion = 25
      this.searchForm.videoIntactRateProportion = 25
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    async handleExport() {
      let {
        organizationId,
        retrievalStartDay,
        retrievalEndDay,
        onOfflineRateProportion,
        recordCompleteRateProportion,
        repairRateProportion,
        videoIntactRateProportion
      } = this.searchForm
      let obj = {
        organizationId,
        retrievalStartDay,
        retrievalEndDay,
        onOfflineRateProportion,
        recordCompleteRateProportion,
        repairRateProportion,
        videoIntactRateProportion,
        netType: this.$getNetType()
      }
      let res = await this.$api.getAreaMaintenanceStatExport(obj)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('operateManage.areaTest'))
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.searchForm.organizationId = this.organizationOption[0].id
            this.organizationName = res.nodeList[0].label
            this.getAreaMaintenanceStat()
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
.treeselect {
  :deep(.el-form-item--medium .el-form-item__content) {
    width: 202px;
    line-height: 36px;
  }
}
.form {
  margin: 20px;
  margin-bottom: 0;
  border-bottom: 1px solid #48535a;
}
.operation {
  padding: 20px;
  padding-bottom: 0;
}
.statistics-container {
  border-top: 1px solid #48535a;
  .top5-container {
    display: flex;
    flex-direction: column;
    height: 300px;
    padding: 30px 10px;
    color: #232c3b;
    font-size: 14px;
    span {
      flex: 1;
      .area-name {
        display: inline-block;
        width: 100px;
        margin-left: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .count {
        margin-left: 42px;
      }
      .top {
        display: inline-block;
        margin-left: 5px;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 20px;
      }
      .top1 {
        color: #ffa801;
        background: rgba(255, 209, 69, 0.3);
      }
      .top2 {
        color: #20c997;
        background: rgba(32, 201, 151, 0.15);
      }
      .top3 {
        color: #2c6dd2;
        background: rgba(44, 109, 210, 0.15);
      }
      .top4 {
        color: #a8aeb6;
        background: rgba(235, 236, 240, 1);
      }
    }
  }
}
.table-container {
  padding: 20px;
}
:deep(.el-dialog__body .appendIpt .el-input .el-input__inner) {
  width: 100px;
}
:deep(.dialogWithCard .el-dialog__body) {
  padding-left: 30px;
  padding-right: 60px;
}
.dialog-title {
  margin-right: 5px;
  color: #232c3b;
  font-size: 16px;
  font-weight: 800;
}
.iconClassName {
  display: inline-block;
  width: 16px;
  height: 16px;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.collapse-card[data-v-24acfc9b]) {
  background: #051b2c;
}
</style>
