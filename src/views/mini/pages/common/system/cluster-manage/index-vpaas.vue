<template>
  <!-- 集群管理VPAAS -->
  <div>
    <el-row>
      <el-col :span="24" class="el-row20">
        <div v-if="PermissionManage" class="btnMargin">
          <el-button type="primary" @click="synchronization">
            {{ $t('Operations.synchronization') }}
          </el-button>
        </div>
        <div class="pageTitle">{{ $t('Operations.platformsList') }}</div>
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="platForm"
            :model="platSearch"
            label-position="left"
            :label-width="locale == 'en' ? '140px' : '90px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('Operations.platformCoding') + ' ：'"
                prop="platId"
                class="flex-item"
              >
                <el-input
                  v-model="platSearch.platId"
                  auto-complete="off"
                  :placeholder="$t('Operations.inputPlatformCoding')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                :label="$t('Operations.platformName') + ' ：'"
                prop="platName"
                class="flex-item"
              >
                <el-input
                  v-model="platSearch.platName"
                  auto-complete="off"
                  :placeholder="$t('Operations.inputPlatformName')"
                  clearable
                />
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handlePlatFind">
                {{ $t('public.search') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- 平台列表表格 -->
        <div
          v-loading="platLoading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-show="!platLoading && !platList.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-table
            v-show="!platLoading && platList.length"
            class="elTable"
            max-height="700"
            ref="platList"
            :data="platList"
            :element-loading-text="$t('public.loading')"
            
            :row-class-name="tableRowClassName"
            highlight-current-row
            border
            @row-click="checkPlat"
          >
            <el-table-column
              :label="$t('Operations.platformCoding')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.platId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Operations.platformName')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.platName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Operations.intranetIP')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.platPrivateIp }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.platformStatus')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.status == 1 ? 'success' : 'danger'">
                  {{ set_status(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.createTime')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="!platLoading && platList.length"
            :total="platTotalNum"
            v-model:pageNum="platPageNum"
            v-model:limit="platPageSize"
            @pagination="getPlatLists"
          />
        </div>
        <div class="pageTitle">{{ $t('Operations.domainList') }}</div>
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="regionForm"
            :model="regionSearch"
            label-position="left"
            :label-width="locale == 'en' ? '126px' : '90px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('Operations.Domaincode') + ' ：'"
                prop="regionCode"
                class="flex-item"
              >
                <el-input
                  v-model="regionSearch.regionCode"
                  auto-complete="off"
                  :placeholder="$t('Operations.pleaseInputDomaincode')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                :label="$t('Operations.DomaincodeName') + ' ：'"
                prop="regionName"
                class="flex-item"
              >
                <el-input
                  v-model="regionSearch.regionName"
                  auto-complete="off"
                  :placeholder="$t('Operations.pleaseInputDomaincodeName')"
                  clearable
                />
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleRegionFind">
                {{ $t('public.search') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- 域列表 -->
        <div
          v-loading="regionLoading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-show="!regionLoading && !regionList.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-table
            v-show="!regionLoading && regionList.length"
            class="elTable"
            max-height="700"
            ref="regionList"
            :data="regionList"
            :element-loading-text="$t('public.loading')"
            
            :row-class-name="tableRowClassName"
            highlight-current-row
            border
            @row-click="checkRegion"
          >
            <el-table-column
              :label="$t('Operations.Domaincode')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.regionCode }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Operations.DomaincodeName')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.regionName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Operations.DomainState')"
              min-width="70"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>
                  {{ row.updateTime }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="!regionLoading && regionList.length"
            :total="platTotalNum"
            v-model:pageNum="platPageNum"
            v-model:limit="platPageSize"
            @pagination="getPlatLists"
          />
        </div>
        <div class="pageTitle">{{ $t('Operations.clusterList') }}</div>
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="domainForm"
            :model="domainSearch"
            label-position="left"
            :label-width="locale == 'en' ? '126px' : '90px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('Operations.clusterCode') + ' ：'"
                clusterCodeprop="domainCode"
                class="flex-item"
              >
                <el-input
                  v-model="domainSearch.domainCode"
                  auto-complete="off"
                  :placeholder="$t('Operations.pleaseInputclusterCode')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                :label="$t('Operations.clusterName') + ' ：'"
                prop="domainName"
                class="flex-item"
              >
                <el-input
                  v-model="domainSearch.domainName"
                  auto-complete="off"
                  :placeholder="$t('Operations.pleaseInputclusterName')"
                  clearable
                />
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleDomainFind">
                {{ $t('public.search') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- 集群列表 -->
        <div
          v-loading="domainLoading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-show="!domainLoading && !domainList.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-table
            v-show="!domainLoading && domainList.length"
            class="elTable"
            max-height="700"
            ref="domainList"
            :data="domainList"
            :element-loading-text="$t('public.loading')"
            
            :row-class-name="tableRowClassName"
            highlight-current-row
            border
          >
            <el-table-column
              :label="$t('Operations.clusterCode')"
              min-width="80"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.domainCode }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Operations.clusterName')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.domainName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.clusterEnable')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableDomain == 1 ? 'success' : 'danger'">
                  {{
                    row.enableDomain == '1' ? $t('Operations.enable') : $t('Operations.notEnabled')
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.protocolSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableGb == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableGb) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.onvifSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableOnvif == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableOnvif) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.HWSDKSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enablePassiveHwsdk == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enablePassiveHwsdk) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.HWSDKProtocolSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableActiveHwsdk == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableActiveHwsdk) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.HIKSDKAccess')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableHiksdk == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableHiksdk) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.dhsdkSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableDhsdk == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableDhsdk) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.streamDistribution')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableDistribution == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableDistribution) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operations.recordingSupported')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="row.enableStorage == 1 ? 'success' : 'danger'">
                  {{ setApprove(row.enableStorage) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" min-width="100">
              <template #default="{ row }">
                <span class="cell-operate" @click="getDomainDetail(row)">
                  {{ $t('public.particulars') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="!domainLoading && domainList.length"
            :total="platTotalNum"
            v-model:pageNum="platPageNum"
            v-model:limit="platPageSize"
            @pagination="getPlatLists"
          />
        </div>
      </el-col>
    </el-row>
    <domain-detail v-model:visible="dialogVisible" :dataForm="dataForm"></domain-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import domainDetail from './component/domain-detail' //配置网关
export default {
  components: {
    'domain-detail': domainDetail
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //用户权限判断
      PermissionManage: true,
      platLoading: false, //平台表加载
      regionLoading: false, //域列表加载
      domainLoading: false, //集群列表加载
      platSearch: {
        platId: '',
        platName: ''
      }, //平台列表搜索
      platPageNum: 1,
      platPageSize: 10,
      platTotalNum: 0, // 平台列表总数量
      platList: [], //平台列表表格
      platIdCurrent: '', //当前选中的平台编码
      regionSearch: {
        regionCode: '',
        regionName: ''
      },
      regionPageNum: 1,
      regionPageSize: 10,
      regionTotalNum: 0, // 域列表总数量
      regionList: [], //域列表表格
      regionCurrent: '', //当前选中的域编码
      domainSearch: {
        domainCode: '',
        domainName: ''
      },
      domainPageNum: 1,
      domainPageSize: 10,
      domainTotalNum: 0, // 集群列表总数量
      domainList: [], //集群列表表格
      statusList: [
        {
          value: 0,
          name: this.$t('public.toBeAdded')
        },
        {
          value: 1,
          name: this.$t('public.normal')
        },
        {
          value: 2,
          name: this.$t('public.connectionAbnormal')
        },
        {
          value: 3,
          name: this.$t('public.platformAbnormal')
        }
      ],
      dataForm: {
        baseInfo: {},
        gbAccessInfo: {},
        onvifAccessInfo: {},
        hwsdkPassiveAccessInfo: {},
        hwsdkActiveAccessInfo: {},
        hiksdkAccessInfo: {},
        dhsdkAccessInfo: {},
        extraInfo: {}
      }, //集群详情
      dialogVisible: false
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getPlatLists()
  },
  methods: {
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(90)
    },
    set_status(val) {
      if (val == undefined) {
        return ''
      } else {
        return this.statusList[val].name
      }
      // 0-待添加（暂未使用）1-正常 2-连接异常 3-平台异常
    },
    setStatus(val) {
      if (val == 0) {
        return this.$t('public.normal')
      } else if (val == 1) {
        return this.$t('public.delete')
      } else {
        return ''
      }
    },
    setApprove(val) {
      if (val == 0) {
        return this.$t('Operations.notSupport')
      } else if (val == 1) {
        return this.$t('Operations.support')
      } else {
        return ''
      }
    },
    // 同步
    synchronization() {
      this.platLoading = true
      this.regionLoading = true
      this.domainLoading = true

      this.$api.syncDomain({}).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('primaryDevice.synchronousRegime')
          })
          this.getPlatLists()
        }
        this.platLoading = false
        this.regionLoading = false
        this.domainLoading = false
      })
    },
    // 平台列表搜索
    handlePlatFind() {
      this.platPageNum = 1
      this.getPlatLists()
    },
    //平台列表
    getPlatLists() {
      this.platLoading = true
      let data = {
        pageInfo: {
          pageNum: this.platPageNum,
          pageSize: this.platPageSize
        },
        ...this.platSearch,
        platType: 15
      }
      this.$api.getPlatListByType(data).then(res => {
        if (res.platList && res.platList.length) {
          this.platList = res.platList
          this.platIdCurrent = this.platList[0].platId
          this.$refs.platList.setCurrentRow(this.platList[0], true)
          this.platTotalNum = res.pageInfo.totalNum
          this.getRegionList()
          this.$nextTick(() => {
            this.$refs.platList?.setScrollTop(0);
          });
        } else {
          this.platList = []
          this.platTotalNum = 0
          this.platIdCurrent = ''
          this.regionList = []
          this.regionTotalNum = 0
          this.regionCurrent = ''
          this.domainList = []
          this.domainTotalNum = 0
        }
        this.platLoading = false
      })
    },
    //点击平台数据刷新域列表
    checkPlat(row) {
      this.platIdCurrent = row.platId
      this.getRegionList()
    },
    // 域搜索
    handleRegionFind() {
      this.regionPageNum = 1
      this.getRegionList()
    },
    //获取域列表
    getRegionList() {
      this.regionLoading = true
      let data = {
        pageInfo: {
          pageNum: this.regionPageNum,
          pageSize: this.regionPageSize
        },
        platId: this.platIdCurrent,
        ...this.regionSearch
      }
      this.$api.getRegionList(data).then(res => {
        if (res.regionList && res.regionList.length) {
          this.regionList = res.regionList
          this.regionCurrent = this.regionList[0].regionCode
          this.$refs.regionList.setCurrentRow(this.regionList[0], true)
          this.regionTotalNum = res.pageInfo.totalNum
          this.getDomainList()
          this.$nextTick(() => {
            this.$refs.regionList?.setScrollTop(0);
          });
        } else {
          this.regionList = []
          this.regionTotalNum = 0
          this.regionCurrent = ''

          this.domainList = []
          this.domainTotalNum = 0
        }
        this.regionLoading = false
      })
    },
    //点击域数据刷新集群列表
    checkRegion(row) {
      this.regionCurrent = row.regionCode
      this.getDomainList()
    },
    //集群搜索
    handleDomainFind() {
      this.domainPageNum = 1
      this.getDomainList()
    },
    //获取集群列表
    getDomainList() {
      this.domainLoading = true
      let data = {
        pageInfo: {
          pageNum: this.domainPageNum,
          pageSize: this.domainPageSize
        },
        regionCode: this.regionCurrent,
        ...this.domainSearch
      }
      this.$api.getVpsDomainList(data).then(res => {
        if (res.domainList && res.domainList.length) {
          this.domainList = res.domainList;
          this.$refs.domainList?.setCurrentRow(this.domainList[0], true);
          this.domainTotalNum = res.pageInfo.totalNum;
          this.$nextTick(() => {
            this.$refs.domainList?.bodyWrapper &&  (this.$refs.domainList.bodyWrapper.scrollTop = 0)
          });
        } else {
          this.domainList = []
          this.domainTotalNum = 0
        }
        this.domainLoading = false
      })
    },
    //集群详情
    async getDomainDetail(row) {
      const res = await this.$api.getVpsDomainInfo({
        domainCode: row.domainCode,
        regionCode: row.regionCode
      })
      if (res.resultCode != 0) return
      this.dataForm = res
      this.dialogVisible = true
    }
  }
}
</script>
