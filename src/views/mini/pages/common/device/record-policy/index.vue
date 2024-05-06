<template>
  <!-- 录像策略 -->
  <div id="record-policy" v-if="isRouterAlive" ref="recordPolicy">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div class="btnMargin">
          <div>
            <el-button type="primary" size="small" @click="handleAdd" v-if="PermissionManage">
              {{ $t('videoRecord.addVideoStrategy') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="searchForm.planName"
              maxlength="20"
              auto-complete="off"
              :placeholder="$t('videoRecord.enterPolicyName')"
              clearable
              :style="locale == 'en' ? { width: '230px' } : { width: '200px' }"
              class="inputMiddle"
            />

            <el-button type="primary" @click="handleFind" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
          </div>
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
            max-height="630"
            class="elTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            ref="multipleTable"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              prop="planId"
              :label="$t('videoRecord.videoPolicyID')"
              min-width="90"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planName"
              :label="$t('videoRecord.videoPolicyName')"
              min-width="90"
              ref="status"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('videoRecord.videoPolicyType')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setAlarmLevel(row.planType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('public.createTime')"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="updateTime"
              :label="$t('public.updateTime')"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-show="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span
                  class="cell-operate"
                  @click="handleEdit(row)"
                  v-show="row.planType != 2 && PermissionManage"
                >
                  {{ $t('public.modify') }}
                </span>
                <span
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                  v-show="row.planType != 2 && PermissionManage"
                >
                  {{ $t('public.delete') }}
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
        </div>
      </el-col>
    </el-row>

    <video-strategy></video-strategy>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import videoStrategy from './component/video-strategy'
export default {
  name: 'VideoRecordingPolicy',
  components: {
    'video-strategy': videoStrategy
  },
  data() {
    return {
      isRouterAlive: true,
      timeSpanList: [],
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      th: window.innerHeight - 70,

      searchForm: {
        planName: ''
      },

      // 列表
      tableData: [], // 表格数据
      dataText: '',
      loading: true,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: 0, // 0:新增, 1:详情, 2:编辑
      dialogFormVisible: false, // 添加或者编辑
      dataForm: { planName: '', planType: '' },
      maskloading: false // 点击提交按钮后蒙版
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getRecordList()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(25)
      this.PermissionManage = await permissions(26)
    },
    setAlarmLevel(val) {
      if (val == 0) {
        return this.$t('videoRecord.weekPlan')
      } else if (val == 1) {
        return this.$t('videoRecord.dayPlan')
      } else if (val == 2) {
        return this.$t('frontParameterConfiguration.entireVideo')
      } else {
        return ''
      }
    },
    //获取列表
    getRecordList() {
      this.dataText = ''
      this.loading = true
      //查看录像策略列表
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      if (this.searchForm.planName != '') {
        obj.searchInfo = { planName: this.searchForm.planName }
      }
      this.$api.getRecordPlanList(obj).then(res => {
        if (res.recordPlanList && res.recordPlanList.length) {
          this.tableData = res.recordPlanList
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
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getRecordList()
    },

    // 添加
    handleAdd() {
      this.dataForm = {
        planName: '',
        planType: 0
      }
      this.operation = 0
      this.dialogFormVisible = true
    },

    //详情
    async handleInfo(row) {
      await this.getRecordPlanInfo(row.planId, 1)
    },

    // 编辑
    async handleEdit(row) {
      await this.getRecordPlanInfo(row.planId, 2)
    },

    async getRecordPlanInfo(planId, operation) {
      let res = await this.$api.getRecordPlanInfo({ planId })
      if (res.resultCode == 0) {
        this.dataForm = {
          planId,
          planName: res.planName,
          planType: res.planType,
          timeSpanList: res.timeSpanList
        }
        this.timeSpanList = res.timeSpanList
        this.operation = operation
        this.dialogFormVisible = true
      }
    },

    // 删除策略
    handleDelete(row) {
      this.$confirm(this.$t('videoRecord.ifDeleteRecord'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let delObj = { planId: row.planId }
          this.$api.deleteRecordPlanInfo(delObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.operatingSuccessContent')
              })
              this.getRecordList()
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

    // 分页
    getListByPage() {
      this.getRecordList()
    }
  }
}
</script>

<style lang="scss">
#record-policy {
  height: 100%;
  .btnMargin {
    display: flex;
    justify-content: space-between;
  }
}
</style>
