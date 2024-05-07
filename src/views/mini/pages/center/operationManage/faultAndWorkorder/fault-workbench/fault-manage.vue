<template>
  <div class="p-5" ref="faultManage" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="110px"
      label-position="left"
      class="mb-3 border-b border-gray-300"
    >
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
          <el-form-item :label="$t('faultAndWorkorder.faultType') + ':'" prop="faultType">
            <el-select
              v-model="searchForm.faultType"
              clearable
              :placeholder="$t('faultAndWorkorder.faultTypeProp')"
            >
              <el-option
                v-for="item in faultTypeData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('faultAndWorkorder.faultStatus') + ':'" prop="faultStatus">
            <el-select
              v-model="searchForm.faultStatus"
              clearable
              :placeholder="$t('faultAndWorkorder.statusProp')"
            >
              <el-option
                v-for="item in faultStatusData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="text-right">
          <el-button v-hasPermi="[1451]" type="primary" @click="getUserFaultList">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table border v-loading="loading" :data="tableData" :row-class-name="tableRowClassName">
      <el-table-column :label="$t('operateManage.index')" type="index" width="55" />
      <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
      <el-table-column :label="$t('deviceInfo.deviceName')" prop="devName" show-overflow-tooltip />
      <el-table-column
        :label="$t('faultAndWorkorder.faultType')"
        prop="faultType"
        :formatter="faultTypeFormatter"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultDes')"
        prop="faultRemark"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultStartTime')"
        prop="faultDiscoveryTime"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultReportTime')"
        prop="createTime"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultStatus')"
        prop="faultStatus"
        :formatter="faultStatusFormatter"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('public.operating')">
        <template #default="{ row }">
          <span
            class="mr-5 text-detail cursor-pointer"
            v-hasPermi="[1451]"
            @click="handleDetail(row)"
          >
            {{ $t('public.particulars') }}
          </span>
          <span
            v-show="row.faultStatus == 1"
            class="mr-5 text-detail cursor-pointer"
            v-hasPermi="[1452]"
            @click="handleEdite(row)"
          >
            {{ $t('public.edit') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getUserFaultList"
      />
    </div>
    <edit-workoder />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import editWorkoder from './component/edit-workoder.vue'
export default {
  name: 'FaultManagement',
  components: { editWorkoder },
  data() {
    return {
      isRouterAlive: true,
      searchForm: {
        devId: undefined,
        faultType: undefined,
        faultStatus: undefined,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      total: 0,
      tableData: [],
      faultId: undefined,
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      faultTypeData: state => state.dict.user_report_fault_type,
      faultStatusData: state => state.dict.fault_status
    })
  },
  created() {
    this.getUserFaultList()
  },
  methods: {
    async getUserFaultList() {
      this.loading = true
      let res = await this.$api.getUserFaultList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.faultList
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getUserFaultList()
    },
    handleDetail(row) {
      this.$router.push({
        name: 'FaultDetail',
        params: {
          id: row.faultId
        }
      })
    },
    handleEdite(row) {
      this.faultId = row.faultId
      this.dialogVisible = true
    },
    faultTypeFormatter(row) {
      return this.selectDictLabel(this.faultTypeData, row.faultType)
    },
    faultStatusFormatter(row) {
      return this.selectDictLabel(this.faultStatusData, row.faultStatus)
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>
