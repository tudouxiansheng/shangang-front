<template>
  <!-- 录像策略 -->
  <div id="record-policy" v-if="isRouterAlive" ref="recordPolicy">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div class="btnMargin">
          <div>
            <span>{{ $t('cascadeDevice.platform') }}:</span>
            <el-select
              class="ml-3"
              clearable
              :popper-append-to-body="false"
              :placeholder="$t('algoTemplate.pleaseSelectplatform')"
              v-model="searchForm.platId"
            >
              <el-option
                v-for="item in algorithmPlatList"
                :key="item.accessId"
                :label="
                  item.accessName +
                  `(${item.status === 1 ? $t('public.statustype1') : $t('public.statustype2')})`
                "
                :value="item.accessId"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button size="small" @click="reset">{{ $t('public.reset') }}</el-button>
            <el-button size="small" type="primary" @click="getRecordList">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>
        <div class="mb-2">
          <el-button type="primary" @click="createMetaData">
            {{ $t('metadata.createHisMetaSubscription') }}
          </el-button>
          <el-button type="danger" @click="cancelSubscription" :disabled="!selections.length">
            {{ $t('platformManagement.cancelSubscription') }}
          </el-button>
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
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              prop="platformName"
              :label="$t('cascadeDevice.platform')"
              show-overflow-tooltip
              width="150"
            />
            <el-table-column
              prop="cameraName"
              :label="$t('metadata.cameraName')"
              show-overflow-tooltip
            />
            <el-table-column
              prop="thirdCameraId"
              :label="$t('deviceManagement.deviceEncoding')"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('metadata.hisMetaBeginAndEndTime')"
              ref="status"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.startTime }} {{ $t('public.to') }} {{ row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('metadata.subscriptionExecutionTime')"
              show-overflow-tooltip
              width="240"
            >
              <template #default="{ row }">
                <span>{{ row.costTime ? (row.costTime / 1000 / 60).toFixed(2) : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="progress"
              :label="$t('metadata.subscriptionProgress')"
              width="160"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-progress :percentage="Number(row.progress)"></el-progress>
              </template>
            </el-table-column>
            <el-table-column :label="$t('metadata.subscriptionStatus')" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.status == 0">{{ $t('platformManagement.isSubscribe') }}</span>
                <span v-if="row.status == 1">{{ $t('platformManagement.subscribed') }}</span>
                <span v-if="row.status == 2">{{ $t('platformManagement.notSubscribed') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span
                  class="cell-operate primary"
                  @click="subscribe(row)"
                  v-show="row.status == 2 && PermissionManage"
                >
                  {{ $t('platformManagement.subscribe') }}
                </span>
                <span
                  class="cell-operate primary"
                  @click="cancelSubscribe([row.thirdCameraId])"
                  v-show="(row.status == 0 || row.status == 1) && PermissionManage"
                >
                  {{ $t('platformManagement.cancelSubscription') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <pagination
            v-show="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            :pageSizes="[10, 20, 30, 40, 50, 100]"
            @pagination="getListByPage"
          />
        </div>
      </el-col>
    </el-row>
    <camera-selector
      :visible="dialogDeviceVisible"
      :device-type="1"
      :algorithmPlatList="algorithmPlatList"
      @subscribe-success="getListByPage"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import CameraSelector from './component/cameraSelector.vue'

export default {
  name: 'CameraHistoryMetadataSubscription',
  components: {
    CameraSelector
  },
  data() {
    return {
      isRouterAlive: true,
      timeSpanList: [],
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      showTools: false,
      dialogDeviceVisible: false,
      locale: localStorage.getItem('locale'),
      th: window.innerHeight - 70,
      currentChooseCameras: [],
      searchForm: {
        planName: '',
        platId: ''
      },
      // 列表
      tableData: [], // 表格数据
      dataText: '',
      loading: false,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: 0, // 0:新增, 1:详情, 2:编辑
      dialogFormVisible: false, // 添加或者编辑
      dataForm: { planName: '', planType: '' },
      algorithmPlatList: [],
      selections: [],
      maskloading: false // 点击提交按钮后蒙版
    }
  },
  created() {
    this.getPermissions()
    this.queryAlgorithmPlatList()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    closeDialog() {
      this.dialogDeviceVisible = false
    },
    // 获取算法平台列表
    async queryAlgorithmPlatList() {
      let res = await this.$api.queryAlgorithmPlatList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res && res.resultCode == 0) {
        this.algorithmPlatList = res.algorithmAccessList

        if (Array.isArray(this.algorithmPlatList) && this.algorithmPlatList.length) {
          this.searchForm.platId = this.algorithmPlatList[0].accessId
        }

        this.getListByPage()
      }
    },
    handleSelectionChange(selections) {
      this.selections = selections
    },
    createMetaData() {
      this.dialogDeviceVisible = true
    },
    subscribe(item) {
      let thirdCameraIdList = [item.thirdCameraId]
      const params = {
        thirdCameraIdList,
        startTime: item.startTime,
        endTime: item.endTime,
        accessPlatId: this.searchForm.platId
      }
      this.$api.subscribeMetadata(params).then(res => {
        if (res && res.resultCode == 0) {
          this.$message.success(this.$t('deviceCamera.metadataSuccess'))
          this.getRecordList()
        }
      })
    },
    // 取消订阅
    cancelSubscribe(thirdCameraIdList) {
      const params = {
        thirdCameraIdList,
        accessPlatId: this.searchForm.platId
      }
      this.$api.unsubscribeMetadata(params).then(res => {
        if (res && res.resultCode == 0) {
          this.$message.success(this.$t('platformManagement.unsubscribeSuccessfully'))
          this.getRecordList()
        }
      })
    },
    // 批量取消订阅
    cancelSubscription() {
      if (!this.selections.length) {
        this.$message.warning(this.$t('algoTemplate.select'))
      }
      let cameraList = this.selections.map(item => item.thirdCameraId)
      this.cancelSubscribe(cameraList)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(2009)
      this.PermissionManage = await permissions(2008)
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
    reset() {
      this.searchForm.platId = ''
      this.totalNum = 0
      this.tableData = []
    },
    //获取列表
    getRecordList() {
      this.dataText = ''

      if (!this.searchForm.platId) {
        this.$message.warning(this.$t('retrieval.selectPlatformPrompt'))
        return
      }

      //查看录像策略列表
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        accessPlatId: this.searchForm.platId
      }

      this.$api.searchHisMetadataList(obj).then(res => {
        if (res && res.resultCode == 0) {
          this.totalNum = res.pageInfo.totalNum
          this.tableData = res.historyMetadataList
          if (this.tableData.length == 0 && this.pageNum > 1) {
            this.pageNum = 1
            this.getRecordList()
          }
        }
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
