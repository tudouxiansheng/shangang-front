<template>
  <!-- 系统公告 -->
  <div id="system-announcement" v-if="isRouterAlive" ref="systemAnnouncement">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div class="btnMargin">
          <!-- 创建 -->
          <el-button type="primary" @click="createNotice" v-hasPermi="[1501]">
            {{ $t('systemAnnounce.createAnnounce') }}
          </el-button>
        </div>
        <!-- 搜索条件 -->
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="announceSearchInfo"
            label-position="left"
            :label-width="locale == 'en' ? '100px' : '80px'"
          >
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="22">
                <!-- 公告标题 -->
                <el-form-item :label="$t('systemAnnounce.title') + '：'" prop="title">
                  <el-input
                    v-model="announceSearchInfo.title"
                    clearable
                    :placeholder="$t('systemAnnounce.pleaseTitle')"
                  />
                </el-form-item>
                <!-- 创建时间 -->
                <el-form-item :label="$t('systemAnnounce.createTime') + '：'" prop="createTime">
                  <el-date-picker
                    v-model="announceSearchInfo.createTime"
                    @change="createTimeChange"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    :range-separator="$t('systemAnnounce.to')"
                    :start-placeholder="$t('systemAnnounce.startDate')"
                    :end-placeholder="$t('systemAnnounce.endDate')"
                  ></el-date-picker>
                </el-form-item>
                <!-- 公告状态 -->
                <el-form-item :label="$t('systemAnnounce.status') + '：'" prop="status">
                  <el-select v-model="announceSearchInfo.status" clearable>
                    <el-option :label="$t('systemAnnounce.all')" value="" />
                    <el-option
                      v-for="item of announcementStatusOption"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="2" :xl="2">
                <!-- 搜索 -->
                <div class="search-btn">
                  <el-button type="primary" class="miniBtn" @click="handleFind">
                    {{ $t('public.search') }}
                  </el-button>
                  <el-button type="info" class="miniBtn" @click="handleRest">
                    {{ $t('systemAnnounce.rest') }}
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <no-table :tableLoading="loading" :tableData="tableData">
          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <!-- 公告名称 -->
            <el-table-column
              :label="$t('systemAnnounce.title')"
              prop="title"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 发布人 -->
            <el-table-column
              :label="$t('systemAnnounce.footPublisher')"
              prop="footPublisher"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 收件人 -->
            <el-table-column
              :label="$t('systemAnnounce.receiver')"
              prop="receiver"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 周期时间 -->
            <el-table-column
              :label="$t('systemAnnounce.beginEndDate')"
              prop="beginEndDate"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.beginDate }} — {{ row.endDate }}</span>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column
              :label="$t('systemAnnounce.createTime')"
              prop="createTime"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 任务状态 -->
            <el-table-column
              :label="$t('systemAnnounce.status')"
              min-width="80"
              prop="status"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span
                  :class="{
                    success: row.status == 1,
                    danger: row.status == 2 || row.status == 3,
                    warn: row.status == 0
                  }"
                >
                  {{ announcementStatusFormat(row.status) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="130" fixed="right">
              <template #default="{ row }">
                <!-- 查看 -->
                <span class="cell-operate" @click="handleDetail(row)">
                  {{ $t('systemAnnounce.detail') }}
                </span>
                <span
                  style="margin-right: 7px; cursor: pointer"
                  class="success"
                  v-hasPermi="[1502]"
                  v-if="row.status == 0"
                  @click="handleIsPass(row, 1)"
                >
                  {{ $t('systemAnnounce.pass') }}
                </span>
                <span
                  class="cell-operate danger"
                  v-hasPermi="[1502]"
                  v-if="row.status == 0"
                  @click="handleIsPass(row, 2)"
                >
                  {{ $t('systemAnnounce.noPass') }}
                </span>
                <span
                  class="cell-operate danger"
                  v-hasPermi="[1501, 1502]"
                  v-if="row.status == 1"
                  @click="handleTerminate(row)"
                >
                  {{ $t('systemAnnounce.terminate') }}
                </span>
                <span
                  class="cell-operate danger"
                  v-hasPermi="[1501, 1502]"
                  v-if="row.status == 2 || row.status == 3"
                  @click="handleDelete(row)"
                >
                  {{ $t('systemAnnounce.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          />
        </no-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('systemAnnounce.tips')"
      v-model="dialogVisible"
      top="10vh"
      width="580px"
      class="create_notice"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        :model="ruleReason"
        :rules="rules"
        ref="ruleReason"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item>
          <span style="color: #f56c6c">
            {{ $t('systemAnnounce.isReject') }}【{{ title }}】{{ $t('systemAnnounce.announce') }}？
          </span>
        </el-form-item>
        <el-form-item :label="$t('systemAnnounce.rejectMessage') + '：'" prop="rejectMessage">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 14 }"
            maxlength="1024"
            show-word-limit
            :placeholder="$t('systemAnnounce.pleaseRejectMessage')"
            v-model="ruleReason.rejectMessage"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">
            {{ $t('systemAnnounce.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitForm">
            {{ $t('systemAnnounce.comfirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 创建公告 -->
    <create-announcement v-model:createVisible="createVisible"></create-announcement>
    <!-- 公告详情 -->
    <detail-announcement
      v-model:detailVisible="detailVisible"
      :detaiContent="detaiContent"
    ></detail-announcement>
  </div>
</template>

<script>
import createAnnouncement from './component/create-announcement'
import detailAnnouncement from './component/detail-announcement'
import { mapState } from 'vuex'
export default {
  name: 'SystemAnnouncement',
  components: {
    createAnnouncement,
    detailAnnouncement
  },
  data() {
    return {
      //右上角刷新配置
      isRouterAlive: true,
      //中英文配置
      locale: localStorage.getItem('locale'),
      // 搜索条件
      announceSearchInfo: {
        title: undefined,
        status: '',
        createTime: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      ruleReason: {
        rejectMessage: undefined
      },
      rules: {
        rejectMessage: [
          {
            required: true,
            message: this.$t('systemAnnounce.reason'),
            trigger: 'blur'
          }
        ]
      },
      // 表格信息
      tableData: [],
      dataText: '',
      loading: false,
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      createVisible: false,
      detailVisible: false,
      dialogVisible: false,
      detaiContent: {},
      title: undefined,
      announceId: undefined
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  computed: {
    ...mapState({
      announcementStatusOption: state => state.dict['announcement_status'] // 任务状态
    })
  },
  mounted() {
    this.announceSearch()
  },
  methods: {
    //状态
    announcementStatusFormat(data) {
      return this.selectDictLabel(this.announcementStatusOption, data, {
        key: 'name',
        value: 'code'
      })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    //公告查询列表
    announceSearch() {
      let { beginTime, endTime, title, status } = this.announceSearchInfo
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        title,
        status,
        beginTime,
        endTime
      }
      this.loading = true
      this.$api.announceList(obj).then(res => {
        if (res && res.resultCode == 0) {
          this.tableData = res.announceList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.totalNum = 0
        }
        this.loading = false
      })
    },
    //改变创建时间
    createTimeChange(val) {
      let { createTime } = this.announceSearchInfo
      if (val) {
        this.announceSearchInfo.beginTime = createTime[0]
        this.announceSearchInfo.endTime = createTime[1]
      } else {
        this.announceSearchInfo.beginTime = ''
        this.announceSearchInfo.endTime = ''
      }
    },
    //创建公告
    createNotice() {
      this.createVisible = true
    },
    //查看详情
    handleDetail(row) {
      this.detailVisible = true
      this.detaiContent = row
    },
    //打开弹框
    dialogOpen() {
      this.$nextTick(async () => {
        
      })
    },
    //关闭弹框
    dialogClosed() {
      this.dialogVisible = false
      this.ruleReason.rejectMessage = undefined
    },
    //确认
    submitForm() {
      this.$refs['ruleReason'].validate(valid => {
        if (valid) {
          this.announceCheck(2)
        }
      })
    },
    //公告通过or驳回
    announceCheck(status) {
      let successInfo =
        status == 1
          ? this.$t('systemAnnounce.announcementPass')
          : this.$t('systemAnnounce.announcementReject')
      let errorInfo =
        status == 1
          ? this.$t('systemAnnounce.announcementPassError')
          : this.$t('systemAnnounce.announcementRejectError')
      this.$api
        .announceCheck({
          announceId: this.announceId,
          status,
          rejectMessage: this.ruleReason.rejectMessage
        })
        .then(res => {
          if (res && res.resultCode == 0) {
            this.$message({
              type: 'success',
              message: successInfo
            })
            this.dialogVisible = false
            this.announceSearch()
          } else {
            this.$message({
              type: 'error',
              message: errorInfo
            })
          }
        })
    },
    //通过or驳回
    handleIsPass(row, status) {
      if (this.$refs.ruleReason) {
        this.$refs.ruleReason.resetFields()
      }
      this.announceId = row.announceId
      if (status == 2) {
        this.dialogVisible = true
        this.title = row.title
        return
      }
      this.announceCheck(1)
    },
    //删除
    handleDelete(row) {
      this.$confirm(`${this.$t('systemAnnounce.isDelete')}？`, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api
            .announceDelete({
              announceId: row.announceId
            })
            .then(res => {
              if (res && res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('systemAnnounce.deleteAnnounceSuccess')
                })
                this.announceSearch()
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('systemAnnounce.deleteAnnounceError')
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('systemAnnounce.cancelDeleteAnnounce')
          })
        })
    },
    //终止
    handleTerminate(row) {
      this.$confirm(`${this.$t('systemAnnounce.isTerminate')}？`, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api
            .announceTerminate({
              announceId: row.announceId
            })
            .then(res => {
              if (res && res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('systemAnnounce.terminateAnnounceSuccess')
                })
                this.announceSearch()
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('systemAnnounce.terminateAnnounceError')
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('systemAnnounce.cancelTerminateAnnounce')
          })
        })
    },
    //重置
    handleRest() {
      // 循环置空对象属性（避免重新创建空间或者形成冗余代码（如下））
      Object.keys(this.announceSearchInfo).forEach(key => {
        this.announceSearchInfo[key] = undefined
      })
      this.announceSearchInfo.status = ''
      this.announceSearch()
    },
    //搜索
    handleFind() {
      this.pageNum = 1
      this.announceSearch()
    },
    // 分页
    getListByPage() {
      this.announceSearch()
    },
    handleSelectionChange(val) {}
  }
}
</script>

<style lang="scss" scoped>
#system-announcement {
  .el-form--inline .el-form-item {
    margin-right: 80px;
  }
  :deep(.el-table__body tr.hover-row > td) {
    background-color: #175290;
  }
  //有疑问
  :deep(.el-table__fixed-right::before) {
    background-color: transparent;
  }
  .warn {
    color: #fcc419;
  }
  :deep(.el-table:before) {
    z-index: 5;
  }
}
</style>
