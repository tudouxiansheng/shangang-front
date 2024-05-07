<template>
  <div class="p-5">
    <el-page-header @back="goBack" :content="$t('operateManage.patrol')" />
    <el-form
      class="mt-5 border-b"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="80px"
      label-position="left"
    >
      <el-row>
        <el-col :span="18">
          <el-form-item :label="$t('deviceInfo.deviceName') + ':'" prop="devName">
            <el-input
              v-model="searchForm.devName"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" @click="getDeviceList">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      class="mt-5"
      border
      v-loading="loading"
      :data="tableData"
      max-height="490"
      :row-class-name="tableRowClassName"
    >
      <el-table-column :label="$t('operateManage.index')" type="index" width="50" />
      <el-table-column :label="$t('deviceInfo.deviceName')" prop="devName" show-overflow-tooltip />
      <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
      <el-table-column :label="$t('deviceInfo.deviceIP')" prop="ip" show-overflow-tooltip />
      <el-table-column
        v-show="items.includes(1)"
        :label="$t('operateManage.patrolItem1')"
        prop="devStatus"
        show-overflow-tooltip
        :formatter="devStatusFormatter"
      />
      <el-table-column
        v-show="items.includes(2)"
        :label="$t('operateManage.patrolItem2')"
        prop="preview"
        show-overflow-tooltip
        :formatter="previewFormatter"
      />
      <el-table-column
        v-show="items.includes(3)"
        :label="$t('operateManage.patrolItem3')"
        prop="recordStatus"
        show-overflow-tooltip
        :formatter="recordStatusFormatter"
      />
      <el-table-column
        v-show="items.includes(4)"
        :label="$t('operateManage.patrolItem4')"
        prop="integrity"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>{{ row.integrity ? row.integrity : '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-show="items.includes(5)"
        :label="$t('operateManage.patrolItem5')"
        prop="quality"
        show-overflow-tooltip
        :formatter="qualityFormatter"
      />
      <el-table-column :label="$t('operateManage.endTime')" prop="endTime" show-overflow-tooltip />
      <el-table-column :label="$t('public.operating')">
        <template #default="{ row }">
          <span class="cursor-pointer text-detail" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0 && !loading"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getDeviceList"
    />
    <patrol-detail />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import patrolDetail from './component/patrol-detail.vue'
export default {
  name: 'PatrolDetail',
  components: { patrolDetail },
  data() {
    return {
      searchForm: {
        taskId: '',
        devName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      time: [],
      total: 0,
      loading: false,
      tableData: [],
      dialogVisible: false,
      formData: {},
      taskId: '',
      items: [],
      devId: ''
    }
  },
  computed: {
    ...mapState({
      patrolDevStatusData: state => state.dict.patrol_dev_status,
      patrolPreviewStatusData: state => state.dict.patrol_preview_status,
      patrolRecordStatusData: state => state.dict.patrol_record_status,
      patrolQualityStatusData: state => state.dict.patrol_quality_status
    })
  },
  mounted() {
    this.getRouteParams()
    this.getDeviceList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    getRouteParams() {
      this.items = []
      this.taskId = this.$route.params.id
      let items = this.$route.params.items.split('-')
      items.forEach(item => {
        this.items.push(parseInt(item))
      })
    },
    async getDeviceList() {
      this.loading = true
      this.searchForm.taskId = this.taskId
      let res = await this.$api.getPatrolResult(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.resultList
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getDeviceList()
    },
    async handleDetail(row) {
      this.devId = row.devId

      this.dialogVisible = true
    },
    devStatusFormatter(row) {
      let name
      row.devStatus || row.devStatus == 0
        ? (name = this.selectDictLabel(this.patrolDevStatusData, row.devStatus))
        : (name = '—')
      return name
    },
    previewFormatter(row) {
      let name
      row.preview || row.preview == 0
        ? (name = this.selectDictLabel(this.patrolPreviewStatusData, row.preview))
        : (name = '—')
      return name
    },
    recordStatusFormatter(row) {
      let name
      row.recordStatus || row.recordStatus == 0
        ? (name = this.selectDictLabel(this.patrolRecordStatusData, row.recordStatus))
        : (name = '—')
      return name
    },
    qualityFormatter(row) {
      if (row.quality && row.quality.length == 0 && row.endTime) {
        return this.$t('public.normal')
      } else if (row.quality && row.quality.length > 0) {
        let arr = []
        row.quality.forEach(item => {
          arr.push(this.selectDictLabel(this.patrolQualityStatusData, item))
        })
        return arr.join('、')
      } else {
        return '—'
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-page-header__content) {
  color: #fff;
}
</style>
