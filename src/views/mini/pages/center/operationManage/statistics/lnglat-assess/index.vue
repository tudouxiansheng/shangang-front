<template>
  <div ref="lnglatAssess" v-if="isRouterAlive">
    <div class="form">
      <el-form
        :model="searchForm"
        ref="searchForm"
        :inline="true"
        label-width="80px"
        label-position="left"
      >
        <el-row>
          <el-col :span="20" class="treeselect">
            <el-form-item :label="$t('organizationManage.area') + ':'">
              <treeselect
                :options="organizationOption"
                :load-options="loadOptions"
                :clearable="false"
                :placeholder="$t('organizationManage.chooseArea')"
                v-model="searchForm.organizationId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button v-hasPermi="[1415]" type="primary" @click="getLonLatStat">
              {{ $t('public.search') }}
            </el-button>
            <el-button v-hasPermi="[1416]" type="success" @click="handleExport">
              {{ $t('businessLog.exportExcel') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <collapse-card :title="$t('operateManage.lngLatTest')" hideCollapse>
      <div class="statistics-container" v-loading="loading">
        <echart id="lngLatStatisticsBar" height="300px" :options="getOption()"></echart>
      </div>
      <el-row class="pb-5">
        <el-table
          border
          v-loading="loading"
          :data="tableData"
          max-height="365"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            :label="$t('operateManage.ranking')"
            prop="ranking"
            width="80"
            sortable
          />
          <el-table-column :label="$t('report.area')" prop="contentName" show-overflow-tooltip />
          <el-table-column
            :label="$t('operateManage.missLngAndLatRateProportion')"
            prop="lngAndLat"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('operateManage.noLngLat')"
            prop="noLngAndLat"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('operateManage.lackLngLat')"
            prop="missLngAndLat"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('operateManage.deviceTotal')"
            prop="total"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('operateManage.score')"
            prop="fraction"
            show-overflow-tooltip
          />
        </el-table>
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
            :title="$t('operateManage.lngLatScoreTitle') + ':'"
            width="550"
            trigger="hover"
          >
            <p>{{ $t('operateManage.lngLatScore') }}</p>
            <p>{{ $t('operateManage.lngLatFullScore') }}</p>
            <p class="text-gray-500">
              {{ $t('operateManage.lngLatNum') }}
            </p>
            <template #reference>
              <svg-icon iconClass="question-mark" className="iconClassName"></svg-icon>
            </template>
          </el-popover>
        </div>
      </template>

      <el-form ref="testForm" :model="searchForm" label-width="150px" label-position="left">
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.noLngAndLatRateProportion') + ':'"
          prop="noLngAndLatRateProportion"
        >
          <el-input v-model.number="searchForm.noLngAndLatRateProportion">
            <template #append><span style="padding-left: 5px">%</span></template>
          </el-input>
        </el-form-item>
        <el-form-item
          class="appendIpt"
          :label="$t('operateManage.missLngAndLatRateProportion') + ':'"
          prop="missLngAndLatRateProportion"
        >
          <el-input v-model.number="searchForm.missLngAndLatRateProportion">
            <template #append>
              <span style="padding-left: 5px">%</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <span>({{ $t('operateManage.remain') + remainData }}%)</span>
      <template #footer>
        <span class="text-center">
          <el-button @click="resetForm">{{ $t('public.reset') }}</el-button>
          <el-button type="primary" @click="saveForm">{{ $t('public.save') }}</el-button>
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
import { download } from '@/utils/common/download'
import { permissions } from '@/utils/common/permissions'

export default {
  name: 'LnglatAssess',
  components: { Treeselect, collapseCard, echart },
  data() {
    return {
      isRouterAlive: true,
      permissionStatistics: true,
      organizationOption: null,
      searchForm: {
        organizationId: undefined,
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
      noLngAndLatList: [],
      missLngAndLatList: [],
      searchFormRules: {
        noLngAndLatRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.noLngAndLatRateProportionProp'),
            trigger: 'change'
          }
        ],
        missLngAndLatRateProportion: [
          {
            required: true,
            message: this.$t('operateManage.missLngAndLatRateProportionProp'),
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
        this.searchForm.noLngAndLatRateProportion -
        this.searchForm.missLngAndLatRateProportion
      )
    }
  },
  created() {},

  methods: {
    async getPermissions() {
      this.permissionStatistics = await permissions(1415)
    },
    async getLonLatStat() {
      if (this.permissionStatistics) {
        this.loading = true
        let res = await this.$api.getLonLatStat(this.searchForm)
        if (res.resultCode == 0) {
          this.loading = false
          this.tableData = res.lonLats
          this.xData = []
          this.noLngAndLatList = []
          this.missLngAndLatList = []
          this.tableData.forEach(item => {
            this.xData.push(item.contentName)
            this.noLngAndLatList.push(item.noLngAndLat)
            this.missLngAndLatList.push(item.missLngAndLat)
          })
        }
      }
    },
    getOption() {
      return {
        title: {
          text: this.$t('operateManage.lngLatScoreRemark'),
          right: 0,
          textStyle: {
            color: '#FF6B6B',
            fontSize: 14,
            fontWeight: 400,
            fontFamily: 'MicrosoftYaHei'
          }
        },
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
              color: '#999999'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              color: '#999999'
            },
            axisTick: {
              show: false
            },
            splitLine: {
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
          top: '10%',
          right: '0%',
          itemWidth: 14
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
            name: this.$t('operateManage.noLngLat'),
            type: 'bar',
            data: this.noLngAndLatList,
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: '#478EFE',
                opacity: 1
              }
            }
          },
          {
            name: this.$t('operateManage.lackLngLat'),
            type: 'bar',
            data: this.missLngAndLatList,
            barWidth: 10,
            barGap: 1,
            itemStyle: {
              normal: {
                color: '#4CDBFF'
              }
            }
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
        this.getLonLatStat()
      }
    },
    resetForm() {
      this.searchForm.noLngAndLatRateProportio = 50
      this.searchForm.missLngAndLatRateProportion = 50
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    async handleExport() {
      let { organizationId } = this.searchForm
      let obj = {
        organizationId,
        netType: this.$getNetType()
      }
      let res = await this.$api.getLonLatStatExport(obj)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('operateManage.lngLatTest'))
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
            this.getLonLatStat()
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
  padding: 20px;
  padding-bottom: 0;
  border-bottom: 1px solid #ebecf0;
}
.operation {
  padding: 20px;
  padding-bottom: 0;
}
.statistics-container {
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
        margin-left: 30px;
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
</style>
