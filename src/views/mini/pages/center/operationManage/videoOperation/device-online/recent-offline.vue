<template>
  <div class="p-5" ref="recentOffline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      :rules="searchFormRules"
      label-width="110px"
      label-position="left"
      class="border-b border-gray-500"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('videoOperate.searchType') + ':'">
            <el-radio-group v-model="searchType">
              <el-radio label="1">{{ $t('organizationManage.area') }}</el-radio>
              <el-radio label="2">{{ $t('videoOperate.platForm1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="searchType == 1" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + ':'">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :clearable="false"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="searchType == 2">
          <el-form-item :label="$t('videoOperate.platForm') + ':'" prop="platId">
            <el-select v-model="platId" :placeholder="$t('videoOperate.platFormProp')" clearable>
              <el-option
                v-for="item in platOption"
                :key="item.platId"
                :label="item.platName"
                :value="item.platId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceName') + ':'" prop="devName">
            <el-input
              v-model="searchForm.devName"
              clearable
              :placeholder="$t('public.pleaseInputMainDevName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button v-hasPermi="[1412]" type="primary" @click="getOftenOnOfflineStat">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceID') + ':'" prop="devId">
            <el-input
              v-model="searchForm.devId"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevId')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceIP') + ':'" prop="ipAddress">
            <el-input
              v-model="searchForm.ipAddress"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevIp')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="$t('deviceInfo.deviceInterconnectedCoding') + ':'"
            prop="interconnectCode"
          >
            <el-input
              v-model="searchForm.interconnectCode"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevInterCoding')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.reportState') + ':'" prop="handleState">
            <el-select
              v-model="searchForm.handleState"
              :placeholder="$t('videoOperate.reportStateProp')"
              clearable
            >
              <el-option
                v-for="item in faultHandleStateData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('report.date') + ':'" prop="retrievalDay">
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="searchForm.retrievalDay"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYYMMDD"
              :placeholder="$t('deviceApply.pleaseSelsectDeadLine')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item
            class="appendIpt"
            :label="$t('videoOperate.oftenOfflinesMin') + ':'"
            prop="oftenOfflinesMin"
          >
            <el-input
              v-model.number="searchForm.oftenOfflinesMin"
              clearable
              :placeholder="$t('videoOperate.oftenOfflinesMinProp')"
            >
              <template #append>
                <div>
                  <span>{{ $t('videoSquare.time') }}</span>
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <echart
      v-loading="loading1"
      id="ofenOnlineOfflinePie"
      height="300px"
      :options="getOption()"
    ></echart>
    <el-row class="pt-5 border-t">
      <el-button
        v-hasPermi="[1413]"
        type="success"
        @click="handleExport"
        :disabled="tableData.length == 0"
      >
        {{ $t('businessLog.exportExcel') }}
      </el-button>
      <el-button type="primary" @click="mutiFaultReport" :disabled="devIds.length == 0">
        {{ $t('dictConst.reportFailure') }}
      </el-button>
    </el-row>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading2"
        :data="tableData"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          :label="$t('deviceInfo.deviceName')"
          prop="devName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
        <el-table-column
          :label="$t('deviceInfo.deviceIP')"
          prop="ipAddress"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('deviceInfo.deviceInterconnectedCoding')"
          prop="interconnectCode"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('dictConst.area')" prop="area" show-overflow-tooltip />
        <el-table-column
          :label="$t('dictConst.monitoringPlatform')"
          :formatter="platIdFormatter"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('public.state')"
          prop="status"
          :formatter="statusFormatter"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('report.offlineTimes')"
          prop="offlineCounts"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.offlineCounts + $t('videoSquare.time') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="170"
          :label="$t('operateManage.recentOfflineTime')"
          prop="recentOfflineTime"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('operateManage.recentOfflineDuration')"
          width="150"
          prop="status"
          :formatter="recentOfflineDurationFormatter"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('videoIntegrity.statisticsDate')"
          prop="stateAbnormalTime"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('deviceInfo.reportState')"
          :formatter="faultHandleStateFormatter"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="cursor-pointer text-detail" @click="faultReport(row)">
              {{ $t('operateManage.faultReport') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getOftenOnOfflineStat"
      />
    </el-row>
    <report-fault @refreshTable="getOftenOnOfflineStat" />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import echart from '@/components/echart'
import { download } from '@/utils/common/download'
import { getDIYTime3, getFormatDate5, getDayHourMinAndSec } from '@/utils/common/mutil.js'
import { mapState } from 'vuex'
import { permissions } from '@/utils/common/permissions'
import reportFault from '../../component/report-fault.vue'

export default {
  name: 'DeviceRecentOfflineStatistics',
  components: { echart, Treeselect, reportFault },
  data() {
    return {
      isRouterAlive: true,
      permissionsStatistics: true,
      permissionsDevList: true,
      searchType: '1',
      organizationOption: null,
      organizationId: undefined,
      organizationIdCopy: undefined,
      platOption: [],
      platId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() - 24 * 60 * 60 * 1000
        }
      },
      searchForm: {
        devName: undefined,
        devId: undefined,
        ipAddress: undefined,
        interconnectCode: undefined,
        handleState: undefined,
        oftenOfflinesMin: 7,
        retrievalDay: '',
        netType: this.$getNetType(),
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading1: false,
      loading2: false,
      tableData: [],
      total: 0,
      echartData: [],
      devIdList: [],
      searchFormRules: {
        oftenOfflinesMin: [
          {
            required: true,
            message: this.$t('videoOperate.oftenOfflinesMinProp'),
            trigger: 'change'
          },
          { validator: checkOftenOfflinesMin, trigger: 'change' }
        ],
        retrievalDay: [
          {
            required: true,
            message: this.$t('deviceApply.pleaseSelsectDeadLine'),
            trigger: 'change'
          }
        ]
      },
      devIds: [],
      devNames: [],
      devId: '',
      devName: '',
      reportFaultType: 1, //1.单个设备故障上报  2.多个设备故障上报
      dialogVisible: false
    }
  },

  computed: {
    ...mapState({
      faultHandleStateData: state => state.dict.fault_handle_state,
      deviceStatusData: state => state.dict.device_status
    })
  },
  async created() {
    await this.getPermissions()
    this.timesForamtter()
    this.getPlatformList()
    this.getOftenOnOfflineStatDistribution()
  },
  methods: {
    async getPermissions() {
      this.permissionsStatistics = await permissions(1411)
      this.permissionsDevList = await permissions(1412)
    },
    async getPlatformList() {
      let organizationId = sessionStorage.getItem('organizationId')
      let res = await this.$api.queryAccessPlatformList({
        organizationId
      })
      if (res.platformList && res.platformList.length) {
        res.platformList = res.platformList.map(item => {
          return {
            enableStatus: item.enableStatus,
            platId: item.platformId,
            platName: item.platformName,
            platType: item.platformType,
            platStatus: item.platformStatus
          }
        })
        this.platOption = res.platformList
      }
    },
    timesForamtter() {
      let dayList = getDIYTime3(1)
      this.searchForm.retrievalDay = getFormatDate5(dayList[0])
    },
    getOption() {
      let colorList = ['#478EFE', '#4CDBFF', '#9E87FF', '#FF73A1', '#FF9832', '#FF552D', '#478EFE']
      this.echartData.forEach((item, index) => {
        item.label = {}
        item.label.color = colorList[index]
      })
      return {
        title: {
          text: '{val|' + this.total + '}\n{name|' + this.$t('operateManage.sets') + '}',
          top: '37%',
          textAlign: 'center',
          left: '41.5%',
          textStyle: {
            rich: {
              name: {
                fontSize: 18,
                fontWeight: 'bold',
                padding: [5, 0]
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: '26%',
          left: '57%',
          icon: 'circle',
          itemGap: 20
        },
        dataset: {
          source: this.echartData
        },
        series: [
          {
            type: 'pie',
            name: this.$t('operateManage.recentOfflineDistribution'),
            center: ['42%', '50%'],
            radius: ['50%', '70%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: true,
              formatter(params) {
                let label =
                  params.name +
                  ':' +
                  '{a|' +
                  params.data.oftenOfflineCount +
                  '}' +
                  params.data.oftenOfflineRate
                return label
              },
              rich: {
                a: {
                  padding: [0, 10, 0, 10]
                }
              }
            }
          }
        ]
      }
    },
    async getOftenOnOfflineStatDistribution() {
      if (this.permissionsStatistics) {
        this.loading1 = true
        let res = await this.$api.oftenOnOfflineStatDistribution({
          retrievalDay: this.searchForm.retrievalDay
        })
        if (res.resultCode == 0) {
          this.loading1 = false
          this.echartData = res.oftenOfflineDistribution
          this.getOption()
        }
      }
    },
    async getOftenOnOfflineStat() {
      this.loading2 = true
      if (this.searchType == 1) {
        this.searchForm.organizationId = this.organizationId
        delete this.searchForm.platId
      } else {
        this.searchForm.platId = this.platId
        delete this.searchForm.organizationId
      }
      if (this.permissionsDevList) {
        let res = await this.$api.oftenOnOfflineStat(this.searchForm)
        if (res.resultCode == 0) {
          this.loading2 = false
          this.total = res.pageInfo.totalNum
          this.tableData = res.oftenOnOfflineDevices
        }
      }
      this.getOftenOnOfflineStatDistribution()
    },

    handleReset() {
      this.searchType = '1'
      this.organizationId = this.organizationIdCopy
      this.platId = ''
      this.$refs['searchForm'].resetFields()
      this.timesForamtter()
      this.getOftenOnOfflineStat()
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    handleSelectionChange(selection) {
      this.devIds = selection.map(item => item.devId)
      this.devNames = selection.map(item => item.devName)
    },
    async handleExport() {
      if (this.devIdList.length > 0) {
        this.searchForm.customExportInfo.devIds = this.devIdList
      }
      let res = await this.$api.oftenOnOfflineExport(this.searchForm)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('videoOperate.offlineDevList'))
      }
    },
    faultReport(row) {
      this.devId = row.devId
      this.devName = row.devName
      this.reportFaultType = 1
      this.dialogVisible = true
    },
    mutiFaultReport() {
      this.reportFaultType = 2
      this.dialogVisible = true
    },
    platIdFormatter(row) {
      return this.selectDictLabel(this.platOption, row.platId, {
        key: 'platName',
        value: 'platId'
      })
    },
    statusFormatter(row) {
      return this.selectDictLabel(this.deviceStatusData, row.status)
    },
    recentOfflineDurationFormatter(row) {
      if (row.recentOfflineDuration) {
        return getDayHourMinAndSec(row.recentOfflineDuration * 1000)
      }
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
            this.getOftenOnOfflineStat()
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
var checkOftenOfflinesMin = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error(this.$t('operateManage.offlineTimesLessWarn')))
  }
}
</script>

<style lang="scss" scoped>
.treeselect {
  :deep(.el-form-item--medium .el-form-item__content) {
    width: 202px;
    height: 0px;
    .vue-treeselect__control {
      border: 1px solid #c1c7d0;
    }
  }
}
.appendIpt {
  :deep(.el-input) {
    .el-input__inner {
      width: 180px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .el-input-group__append {
      color: #000;
      background-color: transparent;
      padding: 0 8px;
      border: none;
    }
  }
}
:deep(.el-date-editor.el-input, .el-date-editor.el-input__inner) {
  width: 202px;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.border-gray-500) {
  border-color: #48535a;
}
:deep(.border-t) {
  border-top-color: #48535a;
}
</style>
