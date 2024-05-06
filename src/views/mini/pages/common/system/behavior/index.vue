<template>
  <!-- 用户协议授权管理 -->
  <div id="behaviorManage" v-if="isRouterAlive" ref="behaviorManage">
    <el-form
      class="advanced-query-form"
      :label-width="locale == 'en' ? '120px' : '100px'"
      ref="queryForm"
      :model="queryParams"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="19">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="1 < count">
              <el-form-item :label="$t('behavior.userName') + ':'" prop="userName">
                <el-input
                  v-model="queryParams.userName"
                  clearable
                  :placeholder="$t('behavior.userNamePrompt')"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="2 < count">
              <el-form-item :label="$t('behavior.operateTime') + ':'" prop="operateTime">
                <el-date-picker
                  :shortcuts="pickerOptions && pickerOptions.shortcuts"
                  :disabled-date="pickerOptions && pickerOptions.disabledDate"
                  :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                  v-model="timeRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  clearable
                  value-format="YYYY-MM-DD"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                  @change="dateRangeChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="3 < count">
              <el-form-item :label="$t('behavior.state') + ':'" prop="state">
                <el-select clearable v-model="queryParams.state">
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="item in behaviorState"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="5">
          <el-form-item class="advanced-query-form-btn">
            <el-button type="primary" class="initial-width" @click="handleQuery">
              {{ $t('public.search') }}
            </el-button>
            <el-button class="initial-width" @click="resetQuery">
              {{ $t('public.reset') }}
            </el-button>
            <el-button v-if="queryFormCount <= 3" class="initial-width" @click="advancedSearch">
              {{ $t('public.manyCondition') }}
              <span :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div
      :style="{ height: tableHeight + 'px' }"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>
      <!-- 表格 -->
      <el-table
        v-if="!loading && tableData.length"
        ref="multipleTable"
        :data="tableData"
        :max-height="tableHeight - 42"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        class="elTable"
        border
      >
        <el-table-column width="50" type="selection" />

        <el-table-column
          :label="$t('behavior.userName')"
          min-width="90"
          show-overflow-tooltip
          prop="userName"
        />
        <el-table-column
          :label="$t('behavior.account')"
          min-width="90"
          show-overflow-tooltip
          prop="account"
        />
        <el-table-column
          :label="$t('behavior.roleName')"
          min-width="90"
          show-overflow-tooltip
          prop="roleName"
        />
        <el-table-column
          :label="$t('behavior.loginIp')"
          min-width="90"
          show-overflow-tooltip
          prop="loginIp"
        />
        <el-table-column
          :label="$t('behavior.operateTime')"
          min-width="90"
          show-overflow-tooltip
          prop="operateTime"
        />
        <el-table-column
          :label="$t('behavior.state')"
          min-width="90"
          show-overflow-tooltip
          :formatter="taskStateFormat"
        />
      </el-table>

      <!--分页-->
      <pagination
        v-if="!loading && total > 0"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        userName: undefined,
        operateTimeStart: undefined,
        operateTimeEnd: undefined,
        state: undefined
      },
      timeRange: [],
      expand: false,
      tableHeight: 650,
      queryFormCount: 5,
      loading: false,
      total: 0,
      tableData: [],
      ids: [],
      multiple: true
    }
  },
  created() {
    window.addEventListener('resize', this.getQueryFormCount)
    this.getQueryFormCount()
    this.getList()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getQueryFormCount)
  },
  computed: {
    ...mapState({
      behaviorState: state => state.dict['behavior_state'] // 智能分析任务类型
    }),
    count() {
      return this.expand ? 11 : this.queryFormCount
    },
    pickerOptions() {
      return {
       shortcuts: [
          {
            text: this.$t('public.nearlyThreeDays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearlySevenSays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearly30Days'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      }
    }
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        userName: undefined,
        operateTimeStart: undefined,
        operateTimeEnd: undefined,
        state: undefined
      }
      this.timeRange = []
      this.$resetForm('queryForm')
      this.handleQuery()
    },
    /** 高级搜索按钮操作 */
    advancedSearch() {
      this.expand = !this.expand
    },
    dateRangeChange(val) {
      this.queryParams.operateTimeStart = val != null ? val[0] + ' 00:00:00' : undefined
      this.queryParams.operateTimeEnd = val != null ? val[1] + ' 23:59:59' : undefined
    },
    getQueryFormCount() {
      let winW = window.innerWidth
      switch (true) {
        case winW >= 1920:
          this.queryFormCount = 5
          break
        case winW >= 1200 && winW < 1920:
          this.queryFormCount = 4
          break
        case winW >= 992 && winW < 1200:
          this.queryFormCount = 3
          break
        case winW >= 768 && winW < 992:
          this.queryFormCount = 2
          break
        case winW < 768:
          this.queryFormCount = 2
          break
      }
    },
    // 表格列表选中
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    getList() {
      this.loading = true
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      this.$api
        .getBehaviorList(queryParams)
        .then(res => {
          if (res.behahvirorList && res.behahvirorList.length) {
            this.tableData = res.behahvirorList
            this.total = res.pageInfo.totalNum
            this.$nextTick(() => {
              this.$refs.multipleTable?.setScrollTop(0);
            });
          } else {
            this.tableData = []
            this.total = 0
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    },
    taskStateFormat(row) {
      return this.selectDictLabel(this.behaviorState, row.state, {
        key: 'name',
        value: 'code'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#behaviorManage {
  padding: 20px;
  :deep(.advanced-query-form) {
    .el-select {
      width: 100%;
    }

    .el-date-editor--daterange.el-input__inner {
      width: 100%;
    }

    .advanced-query-form-btn {
      float: right;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    .form-item-flex {
      .el-form-item__content {
        display: flex;

        .el-select {
          width: 40%;
          .el-input__inner {
            border-radius: 6px 0 0 6px !important;
          }
        }

        .el-input {
          .el-input__inner {
            border-radius: 0 6px 6px 0;
          }
        }
      }
    }
  }

  .cell .el-button--text {
    font-size: 12px;
    height: initial;
    padding: 5px 0;
  }
}
</style>
