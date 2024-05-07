<template>
  <div
    id="software-version-manage"
    v-if="isRouterAlive"
    ref="softwareVersionManage"
    
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <!-- 查询和其他操作 -->
    <div class="btnMargin">
      <el-button v-hasPermi="[312]" type="primary" @click="publishVersion">
        {{ $t('iotSoftware.publishNewVersion') }}
      </el-button>
    </div>

    <div class="search-form">
      <el-form
        :inline="true"
        class="demo-form-inline"
        :label-width="locale == 'en' ? '219px' : '80px'"
        ref="form"
        :model="searchForm"
        label-position="left"
      >
        <div class="flexstart">
          <el-form-item :label="$t('iotSoftware.deviceType') + ':'" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              :placeholder="$t('iotSoftware.deviceTypePrompt')"
              clearable
            >
              <el-option
                v-for="item in iotDeviceTypeListFormatter"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('iotSoftware.manufacturer') + ':'" prop="manufacturer">
            <el-select
              v-model="searchForm.manufacturer"
              :placeholder="$t('iotSoftware.manufacturerPrompt')"
              clearable
            >
              <el-option
                v-for="item in iotDeviceManufacture"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('iotSoftware.model') + ':'" prop="model">
            <el-input
              v-model="searchForm.model"
              auto-complete="off"
              :placeholder="$t('iotSoftware.modelPrompt')"
              clearable
            />
          </el-form-item>
        </div>

        <div class="search-btn">
          <el-button type="primary" @click="getDeviceSoftwareVersionList" class="miniBtn">
            {{ $t('public.search') }}
          </el-button>
          <el-button type="primary" @click="handleReset" class="miniBtn">
            {{ $t('public.reset') }}
          </el-button>
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

      <!-- 表格 -->

      <el-table
        :max-height="tableHeight"
        v-if="!loading && tableData.length"
        :row-class-name="tableRowClassName"
        ref="multipleTable"
        :data="tableData"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column
          :label="$t('iotSoftware.versionId')"
          show-overflow-tooltip
          prop="versionId"
        />
        <el-table-column
          :label="$t('iotSoftware.versionName')"
          show-overflow-tooltip
          prop="versionName"
        />
        <el-table-column
          :label="$t('iotSoftware.versionMD5')"
          show-overflow-tooltip
          prop="versionMD5"
        />
        <el-table-column
          :label="$t('iotSoftware.deviceType')"
          show-overflow-tooltip
          :formatter="deviceTypeFormatter"
        />
        <el-table-column
          :label="$t('iotSoftware.manufacturer')"
          show-overflow-tooltip
          :formatter="manufacturerFormatter"
        />
        <el-table-column :label="$t('iotSoftware.model')" show-overflow-tooltip prop="model" />
        <el-table-column
          :label="$t('iotSoftware.publishStatus')"
          show-overflow-tooltip
          prop="publish"
          :formatter="publishFormatter"
        />
        <el-table-column
          :label="$t('iotSoftware.publishTime')"
          show-overflow-tooltip
          prop="publishTime"
        />

        <el-table-column :label="$t('public.operating')" min-width="90">
          <template #default="{ row }">
            <span class="cell-operate" v-hasPermi="[311]" @click="handleDetail(row)">
              {{ $t('public.particulars') }}
            </span>
            <span
              class="cell-operate"
              v-hasPermi="[312]"
              v-if="row.publish == 1"
              @click="handleRemovePublish(row)"
            >
              {{ $t('iotSoftware.unPublish') }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <pagination
        v-if="!loading && tableData.length"
        :total="totalNum"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getDeviceSoftwareVersionList"
      ></pagination>
    </div>
    <publish-software></publish-software>
    <software-detail></software-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import publishSoftware from './component/publish-software.vue'
import softwareDetail from './component/software-detail.vue'
export default {
  components: { publishSoftware, softwareDetail },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      tableHeight: 630,

      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      totalNum: 0,

      option: [],
      loading: false,
      dataText: '',

      tableData: [],
      versionId: '',
      dataForm: {},
      dialogVisiable: false,
      dialogVisiable1: false
    }
  },
  computed: {
    ...mapState({
      publishStatusList: state => state.dict['publish_status'],
      iotDeviceTypeList: state => state.dict['iot-device-type'],
      iotDeviceManufacture: state => state.dict['iot-device-manufacture']
    }),
    iotDeviceTypeListFormatter() {
      let obj = []
      this.iotDeviceTypeList.map(item => {
        obj.push({
          name: item.name,
          value: parseInt(item.value)
        })
      })
      return obj
    }
  },
  mounted() {
    this.getDictData()
    this.getDeviceSoftwareVersionList()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    // 获取字典表
    getDictData() {
      this.getSysDictData(['publish_status', 'iot-device-type', 'iot-device-manufacture'])
    },
    async getDeviceSoftwareVersionList() {
      this.loading = true
      let res = await this.$api.getDeviceSoftwareVersionList(this.searchForm)
      if (res.resultCode == 0 && res.versionList) {
        this.loading = false
        this.tableData = res.versionList
        this.totalNum = res.pageInfo.totalNum
      } else {
        this.loading = false
        this.tableData = []
        this.totalNum = 0
      }
    },
    publishVersion() {
      this.dialogVisiable = true
    },
    handleReset() {
      this.$refs['form'].resetFields()
      this.getDeviceSoftwareVersionList()
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    deviceTypeFormatter(row) {
      return this.selectDictLabel(this.iotDeviceTypeListFormatter, row.deviceType, {
        key: 'name',
        value: 'value'
      })
    },
    manufacturerFormatter(row) {
      return this.selectDictLabel(this.iotDeviceManufacture, row.manufacturer, {
        key: 'name',
        value: 'value'
      })
    },
    publishFormatter(row) {
      return this.selectDictLabel(this.publishStatusList, row.publish, {
        key: 'name',
        value: 'code'
      })
    },
    async handleDetail(row) {
      this.versionId = row.versionId
      let res = await this.$api.getDeviceSoftwareVersionInfo({
        versionId: this.versionId
      })
      if (res.resultCode == 0) {
        this.dataForm = {
          deviceType: res.deviceType,
          manufacturer: res.manufacturer,
          model: res.model,
          compatible: res.compatible,
          versionId: res.versionId,
          versionName: res.versionName,
          versionUrl: res.versionUrl,
          versionMD5: res.versionMD5,
          versionDesc: res.versionDesc
        }
      }
      this.dialogVisiable1 = true
    },
    handleRemovePublish(row) {
      this.$confirm(`${this.$t('iotSoftware.cancelPrompt')}`, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.cancelDeviceSoftwareVersion({ versionId: row.versionId }).then(response => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: `${this.$t('iotSoftware.cancelSuccess')}`
              })
              this.getDeviceSoftwareVersionList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `${this.$t('iotSoftware.operationCanceled')}`
          })
        })
    }
  }
}
</script>

<style lang="scss">
#software-version-manage {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
