<template>
  <!-- 智能工单 -->
  <div id="work-order" v-if="isRouterAlive" ref="alarmWorkOrder">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '153px' : '84px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                prop="ticketName"
                :label="$t('workOrder.workOrderName') + ' ：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.ticketName"
                  auto-complete="off"
                  :placeholder="$t('workOrder.workOrderNamePrompt')"
                  clearable
                  maxlength="10"
                />
              </el-form-item>

              <el-form-item
                prop="time"
                :label="$t('workOrder.time') + ' ：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-date-picker
                  popper-class="data-picker"
                  v-model="time"
                  type="daterange"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                ></el-date-picker>
              </el-form-item>

              <el-form-item
                :label="$t('workOrder.workOrderLevel') + ' ：'"
                prop="level"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.level"
                  :placeholder="$t('workOrder.workOrderLevelPrompt')"
                >
                  <el-option
                    v-for="item in levelOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('workOrder.workOrderLevel') + ' ：'"
                  prop="level"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.level"
                    :placeholder="$t('workOrder.workOrderLevelPrompt')"
                  >
                    <el-option
                      v-for="item in levelOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('workOrder.workOrderState') + ' ：'"
                  prop="status"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.status"
                    :placeholder="$t('workOrder.workOrderStatePrompt')"
                  >
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('public.eventType') + ' ：'"
                  prop="eventType"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.eventType"
                    :placeholder="$t('public.eventTypePrompt')"
                  >
                    <el-option
                      v-for="(item, index) in eventTypeData"
                      :key="index"
                      :label="item.name"
                      :value="item.type"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('workOrder.creatorId') + '：'"
                  prop="creatorId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.creatorId"
                    :placeholder="$t('workOrder.creatorPrompt')"
                  >
                    <el-option
                      v-for="(item, index) in personData"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="flexstart">
                <el-form-item
                  :label="$t('public.eventType') + ' ：'"
                  prop="eventType"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.eventType"
                    :placeholder="$t('public.eventTypePrompt')"
                  >
                    <el-option
                      v-for="(item, index) in eventTypeData"
                      :key="index"
                      :label="item.name"
                      :value="item.type"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('workOrder.creatorId') + ' ：'"
                  prop="creatorId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.creatorId"
                    :placeholder="$t('workOrder.creatorPrompt')"
                  >
                    <el-option
                      v-for="(item, index) in personData"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flexstart">
                <el-form-item
                  :label="$t('workOrder.builderId') + ' ：'"
                  prop="builderId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.builderId"
                    :placeholder="$t('workOrder.builderPrompt')"
                  >
                    <el-option
                      v-for="(item, index) in personData"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('workOrder.checkerId') + ' ：'"
                  prop="checkerId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.checkerId"
                    :placeholder="$t('workOrder.checkerPrompt')"
                  >
                    <el-option
                      v-for="(item, index) in personData"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <div @click="manyCondition" class="manyCondition inputMiddle">
                <span>{{ $t('public.manyCondition') }}</span>
                <span :class="iconName"></span>
              </div>
            </div>
          </el-form>
        </div>
        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            max-height="613"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              show-overflow-tooltip
              :label="$t('workOrder.workOrderId')"
              min-width="200"
              align="center"
            >
              <template #default="{ row }">
                <span>{{ row.ticketId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('workOrder.workOrderName')"
              min-width="250"
              align="center"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('public.createTime')"
              min-width="200"
              align="center"
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('workOrder.workOrderLevel')"
              min-width="100"
            >
              <template #default="{ row }">
                <span :class="row.level == 1 ? 'danger' : row.level == 2 ? 'warning' : 'success'">
                  {{ setLevel(row.level) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('workOrder.workOrderState')"
              min-width="100"
            >
              <template #default="{ row }">
                <span
                  :class="
                    row.status == 1 ? 'disposeColor' : row.status == 2 ? 'auditColor' : 'closeColor'
                  "
                >
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="150">
              <template #default="{ row }">
                <span class="cell-btn" @click="handledetail(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-btn" v-if="row.updateBtn" @click="handleUpdate(row)">
                  {{ $t('workOrder.update') }}
                </span>
                <span class="cell-btn" v-if="row.disposeBtn" @click="handleDispose(row)">
                  {{ $t('workOrder.dispose') }}
                </span>
                <span class="cell-btn" v-if="row.auditBtn" @click="handleAudit(row)">
                  {{ $t('workOrder.audit') }}
                </span>
                <span class="cell-btn del-btn" v-if="row.delBtn" @click="handleCancel(row)">
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
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
                @current-change="handleCurrentChange"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 详情对话框 -->
    <work-order-detail></work-order-detail>

    <!-- 变更对话框 -->
    <work-order-update></work-order-update>

    <!-- 处理对话框 -->
    <work-order-dispose></work-order-dispose>

    <!-- 审核对话框 -->
    <work-order-audit></work-order-audit>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'

import { getFormatDate } from '@/utils/common/mutil'

import workOrderDetail from './component/workOrderDetail'
import workOrderUpdate from './component/workOrderUpdate'
import workOrderDispose from './component/workOrderDispose'
import workOrderAudit from './component/workOrderAudit'

import judgeWindow from '@/mixin/judgeWindow'

export default {
  name: 'IntelligentWorkOrder',
  mixins: [judgeWindow],
  components: {
    'work-order-detail': workOrderDetail,
    'work-order-update': workOrderUpdate,
    'work-order-dispose': workOrderDispose,
    'work-order-audit': workOrderAudit
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      PermissionCheck: true,
      th: window.innerHeight - 70,
      // 条件搜索
      searchForm: {
        ticketName: '',
        level: '',
        status: '',
        creatorId: '',
        builderId: '',
        checkerId: '',
        beginTime: '',
        endTime: '',
        eventType: ''
      },
      time: '',
      levelOption: [],
      statusOption: [],

      // iconClass 高级搜索的字体图标
      iconName: 'el-icon-arrow-down',
      // 高级搜索点击显示与隐藏
      showManyCondition: false,

      loading: true,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      disposeBtn: false, //处理按钮
      updateBtn: false, //变更按钮
      auditBtn: false, //审核按钮
      delBtn: false, //取消按钮

      detailTicketVisible: false, // 详情
      disposeTicketVisible: false, // 处理
      updateTicketVisible: false, // 变更
      auditTicketVisible: false, // 审核

      updateForm: {}, // 变更框表单

      stepStatus: null, //详情头部颜色
      detailData: {}, //详情内容
      detailList: [], //详情操作历史
      disposeOpinionShow: false, //处理反馈显示
      disposeOpinion: {}, //处理反馈

      auditOpinionShow: false, //审核意见显示
      auditOpinion: {}, //审核意见

      disposeData: {}, //处理内容

      auditData: {}, //审核内容

      personData: [], //变更里处理审核人列表
      eventTypeData: [], //处理中事件类型

      maskloading: false
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.pageResize()
    this.setFormRules()
    this.ticketList() // 获取任务列表
    this.personList() // 获取人员列表
    this.EventTypeList() // 获取事件类型
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
      this.pageResize()
    }
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(231)
      this.PermissionManage = await permissions(234)
      this.PermissionCheck = await permissions(236)
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1807)
    },
    // 中英文处理 =========================
    setFormRules() {
      this.levelOption = [
        {
          value: 2,
          label: this.$t('public.urgent')
        },
        {
          value: 1,
          label: this.$t('public.important')
        },
        {
          value: 0,
          label: this.$t('public.general')
        }
      ]
      this.statusOption = [
        {
          value: 1,
          label: this.$t('workOrder.processing')
        },
        {
          value: 2,
          label: this.$t('public.audit')
        },
        {
          value: 3,
          label: this.$t('workOrder.close')
        }
      ]
    },
    setLevel(val) {
      if (val == 2) {
        return this.$t('public.urgent')
      } else if (val == 1) {
        return this.$t('public.important')
      } else if (val == 0) {
        return this.$t('public.general')
      }
    },
    setStatus(val) {
      if (val == 1) {
        return this.$t('workOrder.processing')
      } else if (val == 2) {
        return this.$t('public.audit')
      } else if (val == 3) {
        return this.$t('workOrder.close')
      }
    },

    setOperation(val) {
      if (val == 1) {
        return this.$t('workOrder.createContent')
      } else if (val == 2) {
        return this.$t('workOrder.updateContent')
      } else if (val == 3) {
        return this.$t('public.deleteContent')
      } else if (val == 4) {
        return this.$t('public.cancelContent')
      } else if (val == 5) {
        return this.$t('workOrder.disposeContent')
      } else if (val == 6) {
        return this.$t('workOrder.auditContent')
      }
    },
    // 获取任务列表！
    ticketList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        },
        ...this.searchForm
      }

      this.$api.select_ticketList(data).then(res => {
        if (res.ticketList && res.ticketList.length) {
          this.tableData = res.ticketList
          this.getHandle()
          if (res.total) {
            this.totalNum = res.total
          } else {
            this.totalNum = 0
          }
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0);
          });
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }

        this.loading = false
      })
    },

    // 用于判断操作框里面的功能选项！
    getHandle() {
      this.tableData.forEach(item => {
        item.disposeBtn = false
        item.updateBtn = false
        item.auditBtn = false
        item.delBtn = false

        if (item.status == 1) {
          if (item.type == 1 || item.type == 5) {
            item.delBtn = true
            item.updateBtn = true
          } else if (item.type == 2 || item.type == 6) {
            item.disposeBtn = true
          } else if (item.type == 4 || item.type == 7) {
            item.disposeBtn = true
            item.delBtn = true
            item.updateBtn = true
          }
        } else if (item.status == 2) {
          if (item.type == 3 || item.type == 6 || item.type == 5 || item.type == 7) {
            item.auditBtn = true
          }
        }
      })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 获取人员列表，用于处理审核创建人！
    personList() {
      this.$api.get_personList({}).then(res => {
        this.personData = res.personList
      })
    },
    // 获取事件类型
    EventTypeList() {
      this.$api.get_eventTypeList({}).then(res => {
        this.eventTypeData = res.eventTypeList
      })
    },

    // 搜索！
    handleFind() {
      if (this.time == '' || this.time == null) {
        this.searchForm.beginTime = ''
        this.searchForm.endTime = ''
      } else {
        this.searchForm.beginTime = getFormatDate(this.time[0]).substr(0, 10) + ' 00:00:00'
        this.searchForm.endTime = getFormatDate(this.time[1]).substr(0, 10) + ' 23:59:59'
      }
      this.pageNum = 1

      this.ticketList()
    },

    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },

    // 详情
    async handledetail(row) {
      // 获取操作历史列表
      const list = await this.$api.get_operationList({
        ticketId: row.ticketId
      })

      if (list.ticketInfo) {
        this.detailData = Object.assign({}, list.ticketInfo)
      } else {
        this.detailData = {
          name: row.name,
          content: row.content,
          checkerId: row.checkerId,
          builderId: row.builderId,
          level: row.level,
          ticketId: row.ticketId,
          createTime: row.createTime,
          status: row.status,
          builderName: row.builderName,
          checkerName: row.checkerName,
          eventName: row.eventName
        }
        if (row.pic) {
          let pic = []
          for (let i = 0; i < row.pic.length; i++) {
            let item = row.pic[i]
            await this.$api
              .getDownloadUrl({
                fileId: item,
                netType: this.$getNetType()
              })
              .then(res => {
                pic.push(res.downloadUrl)
              })
          }
          Object.assign(this.detailData, {
            pic
          })
        }
      }
      if (list.operationHistoryList && list.operationHistoryList.length != 0) {
        this.detailList = list.operationHistoryList
        this.detailListJudge(this.detailList)
      }

      this.stepStatus = this.detailData.status
      this.detailTicketVisible = true
    },

    // 变更
    async handleUpdate(row) {
      const list = await this.$api.get_operationList({
        ticketId: row.ticketId
      })
      if (list.ticketInfo) {
        this.updateForm = Object.assign({}, list.ticketInfo)
      } else {
        this.updateForm = {
          name: row.name,
          content: row.content,
          checkerId: row.checkerId,
          builderId: row.builderId,
          level: row.level,
          ticketId: row.ticketId
        }
        if (row.pic) {
          let pic = []
          for (let i = 0; i < row.pic.length; i++) {
            let item = row.pic[i]
            await this.$api
              .getDownloadUrl({
                fileId: item,
                netType: this.$getNetType()
              })
              .then(res => {
                pic.push(res.downloadUrl)
              })
          }
          Object.assign(this.updateForm, {
            pic
          })
        }
      }

      this.updateTicketVisible = true
    },

    // 处理
    async handleDispose(row) {
      const list = await this.$api.get_operationList({
        ticketId: row.ticketId
      })
      if (list.ticketInfo) {
        this.disposeData = Object.assign({}, list.ticketInfo)
      } else {
        this.disposeData = {
          name: row.name,
          content: row.content,
          checkerId: row.checkerId,
          builderId: row.builderId,
          level: row.level,
          ticketId: row.ticketId,
          createTime: row.createTime,
          status: row.status,
          builderName: row.builderName,
          checkerName: row.checkerName
        }
        if (row.pic) {
          let pic = []
          for (let i = 0; i < row.pic.length; i++) {
            let item = row.pic[i]
            await this.$api
              .getDownloadUrl({
                fileId: item,
                netType: this.$getNetType()
              })
              .then(res => {
                pic.push(res.downloadUrl)
              })
          }
          Object.assign(this.disposeData, {
            pic
          })
        }
      }

      this.disposeTicketVisible = true
    },

    // 审核
    async handleAudit(row) {
      const list = await this.$api.get_operationList({
        ticketId: row.ticketId
      })
      if (list.ticketInfo) {
        this.auditData = Object.assign({}, list.ticketInfo)
      } else {
        this.auditData = {
          name: row.name,
          content: row.content,
          checkerId: row.checkerId,
          builderId: row.builderId,
          level: row.level,
          ticketId: row.ticketId,
          createTime: row.createTime,
          status: row.status,
          builderName: row.builderName,
          checkerName: row.checkerName,
          eventName: row.eventName
        }
        if (row.pic) {
          let pic = []
          for (let i = 0; i < row.pic.length; i++) {
            let item = row.pic[i]
            await this.$api
              .getDownloadUrl({
                fileId: item,
                netType: this.$getNetType()
              })
              .then(res => {
                pic.push(res.downloadUrl)
              })
          }
          Object.assign(this.auditData, {
            pic
          })
        }
      }

      if (list.operationHistoryList && list.operationHistoryList.length != 0) {
        this.detailList = list.operationHistoryList
        this.detailListJudge(this.detailList)
      }

      this.auditTicketVisible = true
    },

    // 数组处理判断
    detailListJudge(data) {
      data.forEach(item => {
        if (item.operation == 5) {
          // 处理反馈
          this.disposeOpinion = item
          this.disposeOpinionShow = true
        }
        if (item.operation == 6) {
          // 审核意见
          this.auditOpinion = item
          this.auditOpinionShow = true
        }
      })
    },
    // 取消！
    handleCancel(row) {
      this.$confirm(this.$t('workOrder.workOrderCancelPrompt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delete_ticketInfo({ ticketId: row.ticketId, operation: '4' }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })

              this.ticketList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 分页每页条数！
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.ticketList()
    },
    // 分页！
    handleCurrentChange(val) {
      this.pageNum = val
      this.ticketList()
    }
  }
}
</script>

<style lang="scss">
@import './workOrder.scss';
</style>
