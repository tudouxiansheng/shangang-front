<template>
  <!-- 日志管理 -->
  <div id="business-log" v-if="isRouterAlive" ref="systemBusinessLog">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="searchForm"
            label-position="left"
            :label-width="locale == 'en' ? '154px' : '96px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('businessLog.account') + ' ：'"
                prop="account"
                :class="
                  screenFlag ? (!showManyCondition ? 'screenthree' : 'screenthree2') : 'flex-item'
                "
              >
                <el-input
                  v-model="searchForm.account"
                  auto-complete="off"
                  :placeholder="$t('businessLog.accountPrompt')"
                  maxlength="32"
                  clearable
                />
              </el-form-item>

              <el-form-item
                :label="$t('businessLog.operation') + ' ：'"
                prop="operation"
                :class="
                  screenFlag ? (!showManyCondition ? 'screenthree' : 'screenthree') : 'flex-item'
                "
              >
                <el-select
                  clearable
                  filterable
                  :popper-append-to-body="false"
                  v-model="searchForm.operation"
                  :placeholder="$t('businessLog.operationPrompt')"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in operationList"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('businessLog.accessIP') + ' ：'"
                prop="accessIP"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-input
                  v-model="searchForm.accessIP"
                  auto-complete="off"
                  :placeholder="$t('businessLog.accessIPPrompt')"
                  maxlength="64"
                  clearable
                />
              </el-form-item>
            </div>

            <div v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('businessLog.accessIP') + ' ：'"
                  prop="accessIP"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.accessIP"
                    auto-complete="off"
                    :placeholder="$t('businessLog.accessIPPrompt')"
                    maxlength="64"
                    clearable
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('businessLog.operationDate') + ' ：'"
                  prop="operationDate"
                  :class="screenFlag ? 'screenthree2' : 'flex-item'"
                >
                  <el-date-picker
                    :shortcuts="pickerOptions && pickerOptions.shortcuts"
                    :disabled-date="pickerOptions && pickerOptions.disabledDate"
                    :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                    v-model="time"
                    type="date"
                    placeholder=""
                    value-format="YYYY-MM-DD"
                    @change="pickerChange"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item
                  :label="$t('businessLog.result') + ' ：'"
                  prop="result"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-select clearable :popper-append-to-body="false" v-model="searchForm.result">
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in resultList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="flexstart">
                <el-form-item
                  :label="$t('businessLog.result') + ' ：'"
                  prop="result"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select clearable :popper-append-to-body="false" v-model="searchForm.result">
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in resultList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>

              <el-button
                v-if="PermissionExport"
                type="primary"
                :loading="exportLoading"
                @click="export_LogInfo"
                class="miniBtn"
              >
                {{ $t('businessLog.exportExcel') }}
              </el-button>

              <div @click="manyCondition" class="manyCondition inputMiddle">
                <span>{{ $t('public.manyCondition') }}</span>
                <span :class="iconName"></span>
              </div>
            </div>
          </el-form>
        </div>
        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            :max-height="tableHeight"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              show-overflow-tooltip
              :label="$t('businessLog.account')"
              min-width="70"
            >
              <template #default="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('businessLog.operation')"
              min-width="70"
            >
              <template #default="{ row }">
                <span>{{ row.operation }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('businessLog.accessIP')"
              min-width="70"
            >
              <template #default="{ row }">
                <span>{{ row.accessIP }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('businessLog.cuType')" min-width="70">
              <template #default="{ row }">
                <span>{{ set_cuType(row.cuType) }}</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip :label="$t('businessLog.result')" min-width="70">
              <template #default="{ row }">
                <span>{{ set_result(row.result) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('businessLog.operationDate')"
              min-width="70"
            >
              <template #default="{ row }">
                <span>{{ row.operationDate }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="70">
              <template #default="{ row }">
                <span v-if="PermissionInfo" class="cell-operate" @click="handleDetail(row)">
                  {{ $t('public.particulars') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination" v-if="!loading && tableData.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number" @change="numberChange">
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>
            <div>
              <el-pagination
                v-model:current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalNum"
                background
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <log-detail></log-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { getFormatDate } from '@/utils/common/mutil'
import { mapState, mapActions } from 'vuex'

import logDetail from './component/log-detail'
import { permissions } from '@/utils/common/permissions'
import judgeWindow from '@/mixin/judgeWindow'
import { download } from '@/utils/common/download'

export default {
  name: 'LogManagement',
  mixins: [judgeWindow],
  components: {
    'log-detail': logDetail
  },
  data() {
    return {
      isRouterAlive: true,
      screenFlag: true,
      locale: localStorage.getItem('locale'),
      th: window.innerHeight - 70,

      searchForm: {
        account: '',
        operation: '',
        result: '',
        beginTime: '',
        endTime: '',
        cuType: '',
        accessIP: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      operationList: [],
      resultList: [],
      exportLoading: false,

      iconName: 'el-icon-arrow-down',
      showManyCondition: false,

      tableHeight: 630,
      tableData: [], // 表格数据
      loading: true,
      dataText: '',
      time: '', // 时间选择器时间
      pageNum: 1,
      pageSize: 20,
      totalNum: 0, // 总数量

      number: 0,
      numberList: [20, 30, 40, 50, 100, 500], //每页显示数量,

      logDetailVisible: false,
      logDetailForm: false,

      PermissionInfo: false,
      PermissionExport: false,
      exportCsvExcelLoading: false,
      dialogVisible: true,
      process: 500
    }
  },
  computed: {
    ...mapState({
      cuTypeList: state => state.dict['cu-type'] // 客户端类型
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setData()
      this.pageResize()
    }
  },
  created() {
    this.getPermissions()
  },

  mounted() {
    this.pageResize()
    this.setData()
    this.initTime()
    this.getDictionary()
    this.get_log_List()
    this.get_OperationType_List()
  },
  activated() {
    
    this.pageResize()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(81)
      this.PermissionExport = await permissions(89)
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1860)
    },
    initTime() {
      const date = this.dayjs(new Date()).format('YYYY-MM-DD')
      this.time = date
      this.searchForm.beginTime = date + ' 00:00:00'
      this.searchForm.endTime = date + ' 23:59:59'
    },
    // 日期改变联动时间类型
    pickerChange(val) {
      this.searchForm.beginTime = val ? `${val} 00:00:00` : ''
      this.searchForm.endTime = val ? `${val} 23:59:59` : ''
    },
    handleTimeChange(val, time) {
      const dayAttr = time === 'beginTime' ? 'endTime' : 'beginTime'
      if (!val) {
        this.searchForm[dayAttr] = ''
        return
      }
      const currentDay = this.dayjs(val).format('YYYY-MM-DD')
      const targetDay = this.dayjs(this.searchForm[dayAttr] || new Date()).format('YYYY-MM-DD')
      if (!this.searchForm[dayAttr] || currentDay !== targetDay) {
        this.searchForm[dayAttr] = currentDay + (time === 'beginTime' ? ' 23:59:59' : ' 00:00:00')
      }
      if (
        new Date(this.searchForm.beginTime).getTime() > new Date(this.searchForm.endTime).getTime()
      ) {
        this.$message.error(this.$t('businessLog.beginTimeNotGreaterThanEndTime'))
        this.searchForm[time] = ''
      }
    },
    setData() {
      this.resultList = [
        {
          name: this.$t('public.operatingSuccess'),
          value: 0
        },
        {
          name: this.$t('public.operatingFailed'),
          value: 1
        }
      ]
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData(['cu-type'])
    },
    get_OperationType_List() {
      this.$api.getOperationTypeList({}).then(res => {
        if (res.operationList && res.operationList.length) {
          this.operationList = res.operationList
        }
      })
    },
    get_log_List() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchInfo: {
          ...this.searchForm
        }
      }
      this.$api.getLogList(data).then(res => {
        if (res.logList && res.logList.length) {
          this.tableData = res.logList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    handleFind() {
      this.pageNum = 1
      this.get_log_List()
    },
    async export_LogInfo() {
      let data = {
        searchInfo: {
          ...this.searchForm
        },
        netType: this.$getNetType()
      }
      this.exportLoading = true
      try {
        const res = await this.$api.exportLogInfo(data)
        if (res.fileUrl) {
          download(res.fileUrl, this.$t('businessLog.businessLogInfo'))
        }
      } finally {
        this.exportLoading = false
      }
    },
    set_cuType(val) {
      let name = ''
      this.cuTypeList.filter(item => {
        if (val == item.value) name = item.name
      })
      return name
    },
    set_result(val) {
      let name = ''
      this.resultList.filter(item => {
        if (val == item.value) name = item.name
      })
      return name
    },

    async handleDetail(row) {
      let res = await this.$api.getLoginfo({
        logId: row.id,
        operateUserId: row.userId,
        operationDate: this.time
      })
      this.logDetailForm = {
        ...res
      }

      this.logDetailVisible = true
    },
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 556 : 630
    },
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.get_log_List()
    },

    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.get_log_List()
    }
  }
}
</script>

<style lang="scss">
#business-log {
  width: 100%;
  height: 100%;

  .flex-item {
    width: 32%;
    .el-form-item__content {
      width: 30%;
      .el-select {
        width: 100%;
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
  .screenthree {
    width: 25%;
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      width: 40%;
      .el-date-editor.el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .screenthree2 {
    width: 25%;
    .el-form-item__content {
      width: 40%;
      .el-date-editor.el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }

  .el-form-item.time-range-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
      display: flex;
      margin-right: 10px;
    }
    .time-range-separation {
      padding: 0 5px;
    }
  }
}
</style>
