<template>
  <!-- 集群管理 -->
  <div id="cluster-manage" v-if="isRouterAlive" ref="systemClusterManage">
    <el-row class="el-row20">
      <div class="btnMargin">
        <el-button type="primary" @click="synchronization" v-if="PermissionManage">
          {{ $t('Operations.synchronization') }}
        </el-button>
      </div>
    </el-row>
    <el-row>
      <el-col :span="24" class="el-row20">
        <span class="plat-form">{{ $t('Operations.platId') }} ：</span>
        <el-select
          @change="platChange"
          v-model="platId"
          :placeholder="$t('Operations.pleaseSelectplatId')"
          clearable
        >
          <el-option
            v-for="item in platList"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          ></el-option>
        </el-select>

        <div class="pageTitle">
          <span class="span-line"></span>
          {{ $t('Operations.domainList') }}
        </div>
        <!-- 域表格 -->
        <div v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !domainList.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-table
            class="elTable"
            max-height="700"
            ref="domainList"
            :data="domainList"
            @row-click="checkcluster"
            :element-loading-text="$t('public.loading')"
            :row-class-name="tableRowClassName"
            :highlight-current-row="true"
            border
            v-if="!loading && domainList.length"
          >
            <el-table-column :label="$t('Operations.Domaincode')" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.domainCode }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Operations.DomaincodeName')" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.domainName }}</span>
              </template>
            </el-table-column>

            <el-table-column :min-width="locale === 'en' ? 130 : 90" show-overflow-tooltip>
              <template #header>
                <span style="word-break: break-word">{{ $t('Operations.WithinOutland') }}</span>
              </template>
              <template #default="{ row }">
                <span>{{ WithinOutland(row.isExDomain) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Operations.DomainState')" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" v-if="PermissionManage">
              <template #default="{ row }">
                <span class="cell-operate danger" @click="Domaindelete(row)">
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="!loading && domainList.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          />
        </div>

        <div>
          <div class="pageTitle" style="margin-top: 40px">
            <span class="span-line"></span>
            {{ $t('Operations.clusterList') }}
          </div>
          <!-- 集群表格 -->
          <div v-loading="clusterLoading" :element-loading-text="$t('public.loading')">
            <div v-show="!clusterLoading && !clusterList.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <el-table
              v-show="!clusterLoading && clusterList.length"
              class="elTable"
              max-height="700"
              ref="clusterList"
              :data="clusterList"
              @row-click="checkgateway"
              :element-loading-text="$t('public.loading')"
              :row-class-name="tableRowClassName"
              :highlight-current-row="true"
              border
            >
              <el-table-column
                :label="$t('Operations.clusterCode')"
                min-width="120"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.clusterCode }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('Operations.clusterName')"
                min-width="120"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.clusterName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('Operations.storage')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span :class="row.storage == '0' ? 'success' : row.storage == 1 ? 'danger' : ''">
                    {{ setStorage(row.storage) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('Operations.state')" min-width="70" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
                    {{ setStatus(row.status) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('public.operating')"
                min-width="100"
                v-if="PermissionManage"
              >
                <template #default="{ row }">
                  <span
                    style="margin-right: 7px; cursor: pointer"
                    @click="clusterDetails(row)"
                    :class="row.storage == '0' ? 'danger' : 'blue'"
                  >
                    {{
                      row.storage == 0
                        ? $t('Operations.CancelTheStorage')
                        : $t('Operations.Storage')
                    }}
                  </span>
                  <span class="cell-operate danger" @click="clusterDelete(row)">
                    {{ $t('public.delete') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="!clusterLoading && clusterList.length"
              :total="clusterNum"
              v-model:pageNum="cluster_pageNum"
              v-model:limit="cluster_pageSize"
              @pagination="getListByPage_cluster"
            />
          </div>
        </div>

        <div>
          <div class="pageTitle" style="margin-top: 40px">
            <span class="span-line"></span>
            {{ $t('Operations.gatewayList') }}
          </div>
          <!-- 网关表格 -->
          <div v-loading="gatewayLoading" :element-loading-text="$t('public.loading')">
            <div v-show="!gatewayLoading && !gatewayList.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <el-table
              v-show="!gatewayLoading && gatewayList.length"
              class="elTable"
              max-height="700"
              ref="gatewayList"
              :data="gatewayList"
              v-loading="gatewayLoading"
              :element-loading-text="$t('public.loading')"
              :row-class-name="tableRowClassName"
              :highlight-current-row="true"
              border
            >
              <el-table-column
                :label="$t('Operations.gatewayCode')"
                min-width="120"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.gatewayId }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('Operations.DynamicIP')" show-overflow-tooltip>
                <template #default="{ row }">
                  <span>{{ row.gatewayIp }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('Operations.NVRcode')" show-overflow-tooltip>
                <template #default="{ row }">
                  <span>{{ row.nvrCode }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Operations.NationalIP')"
                min-width="100"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.gbAccessIp }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Operations.Nationalport')"
                width="170"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.gbAccessPort }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Operations.lensTotal')"
                width="200"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.count }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('Operations.gatewayState')" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="row.status == '0' ? 'success' : row.status == '1' ? 'danger' : ''">
                    {{ setStatus(row.status) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('public.operating')"
                min-width="100"
                v-if="PermissionManage"
              >
                <template #default="{ row }">
                  <span class="cell-operate" @click="configuration(row)">
                    {{ $t('Operations.configuration') }}
                  </span>
                  <span class="cell-operate danger" @click="gatewayDelete(row)">
                    {{ $t('public.delete') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="!gatewayLoading && gatewayList.length"
              :total="gatewayNum"
              v-model:pageNum="gateway_pageNum"
              v-model:limit="gateway_pageSize"
              @pagination="getListByPage_gateway"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 配置网关 -->
    <configure-gateway></configure-gateway>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'

import configureGateway from './component/configure-gateway' //配置网关

export default {
  name: 'ClusterManagement',
  components: {
    'configure-gateway': configureGateway
  },
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,

      locale: localStorage.getItem('locale'),
      platList: [],
      platId: undefined,
      loading: false, //域列表加载
      domainList: [], //域列表
      domainCode: '',
      domainsearch: {}, //域编码模糊搜索
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 域列表总数量

      clusterLoading: false, //集群列表加载
      clusterList: [], // 集群列表
      clusterCode: '',
      clustersearch: {}, //集群编码模糊搜索
      cluster_pageNum: 1,
      cluster_pageSize: 10,
      clusterNum: 0, //集群列表总数量

      gatewayLoading: false, //网关列表加载
      gatewayList: [], // 网关列表
      gatewaysearch: {}, //网关列表模糊搜索
      gateway_pageNum: 1,
      gateway_pageSize: 10,
      gatewayNum: 0, //网关列表总数量

      dialogFormVisible: false, //配置网关
      dataForm: {} //修改网关信息
    }
  },
  created() {
    this.getPermissions()
  },
  async mounted() {
    await this.getPlatformList()
  },
  activated() {
    
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.locale = localStorage.getItem('locale')
      this.PermissionManage = await permissions(90)
    },
    platChange(val) {
      this.getDomainLists()
    },
    // 监控平台 !
    getPlatformList() {
      let data = {
        organizationId: this.organizationId,
        platAbility: 'SURVEILLANCE'
      }
      this.$api.queryAccessPlatformList(data).then(res => {
        if (res.platformList && res.platformList.length) {
          this.platList = res.platformList.filter(item => item.platformType == 5)
          this.platId = this.platList[0]?.platformId
        }
        this.getDomainLists()
      })
    },
    setStorage(val) {
      if (val == 0) {
        return this.$t('Operations.Storage')
      } else if (val == 1) {
        return this.$t('Operations.CancelTheStorage')
      } else {
        return ''
      }
    },
    WithinOutland(val) {
      if (val == 0) {
        return this.$t('Operations.inland')
      } else if (val == 1) {
        return this.$t('Operations.Outland')
      } else {
        return ''
      }
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

    // 域列表
    getDomainLists() {
      this.loading = true
      let data = {
        platId: this.platId ? this.platId : undefined,
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      if (this.domainsearch.domainCode != '') {
        data.domainCode = this.domainsearch.domainCode
      }
      if (this.domainsearch.domainName != '') {
        data.domainName = this.domainsearch.domainName
      }
      this.$api
        .getDomainList(data)
        .then(res => {
          if (res.domainList && res.domainList.length) {
            this.domainList = res.domainList
            this.domainCode = this.domainList[0].domainCode
            this.jiqun()
            this.$refs.domainList.setCurrentRow(this.domainList[0], true)
            this.totalNum = res.pageInfo.totalNum
            this.$nextTick(() => {
              this.$refs.domainList.setScrollTop(0)
            })
          } else {
            this.domainList = []
            this.totalNum = 0
            this.domainCode = ''

            this.clusterList = []
            this.clusterNum = 0
            this.clusterCode = ''

            this.gatewayList = []
            this.gatewayNum = 0
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除域信息
    Domaindelete(row) {
      this.$api.deleteDomainInfo({ domainCode: row.domainCode }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.delSuccess')
          })
          this.getDomainLists()
        }
      })
    },
    // 域列表搜索
    handleFind() {
      this.pageNum = 1
      this.getDomainLists()
    },
    getListByPage() {
      this.getDomainLists()
    },

    // 获取集群列表
    checkcluster(row) {
      this.domainCode = row.domainCode
      this.jiqun()
    },
    // 获取集群列表
    jiqun() {
      this.clusterLoading = true
      let data = {
        pageInfo: {
          pageNum: this.cluster_pageNum,
          pageSize: this.cluster_pageSize
        },
        domainCode: this.domainCode
      }
      if (this.clustersearch.clusterCode != '') {
        data.clusterCode = this.clustersearch.clusterCode
      }
      if (this.clustersearch.clusterName != '') {
        data.clusterName = this.clustersearch.clusterName
      }
      this.$api
        .getClusterList(data)
        .then(res => {
          if (res.clusterList && res.clusterList.length) {
            this.clusterList = res.clusterList
            this.clusterCode = this.clusterList[0].clusterCode
            this.wangguan()
            this.$refs.clusterList.setCurrentRow(this.clusterList[0], true)
            this.clusterNum = res.pageInfo.totalNum
            this.$nextTick(() => {
              this.$refs.clusterList?.setScrollTop(0)
            })
          } else {
            this.clusterList = []
            this.clusterNum = 0

            this.gatewayList = []
            this.gatewayNum = 0
          }
          this.clusterLoading = false
        })
        .finally(() => {
          this.clusterLoading = false
        })
    },
    // 删除集群信息
    clusterDelete(row) {
      this.$api.deleteClusterInfo({ clusterCode: row.clusterCode }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.delSuccess')
          })
          this.jiqun()
        }
      })
    },
    // 集群（取消）支持存储
    clusterDetails(row) {
      let data = {
        clusterCode: row.clusterCode,
        storage: row.storage == 0 ? 1 : 0
      }
      this.$api.modifyClusterStorage(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccessContent')
          })
          row.storage = row.storage == 0 ? 1 : 0
        }
      })
    },

    // 获取集群列表
    jiqun() {
      this.clusterLoading = true
      let data = {
        pageInfo: {
          pageNum: this.cluster_pageNum,
          pageSize: this.cluster_pageSize
        },
        domainCode: this.domainCode
      }
      if (this.clustersearch.clusterCode != '') {
        data.clusterCode = this.clustersearch.clusterCode
      }
      if (this.clustersearch.clusterName != '') {
        data.clusterName = this.clustersearch.clusterName
      }
      this.$api
        .getClusterList(data)
        .then(res => {
          if (res.clusterList && res.clusterList.length) {
            this.clusterList = res.clusterList
            this.clusterCode = this.clusterList[0].clusterCode
            this.$refs.clusterList.setCurrentRow(this.clusterList[0], true)
            this.clusterNum = res.pageInfo.totalNum
            this.wangguan()
            this.$nextTick(() => {
              this.$refs.clusterList.setScrollTop(0)
            })
          } else {
            this.clusterList = []
            this.clusterNum = 0

            this.gatewayList = []
            this.gatewayNum = 0
          }
          this.clusterLoading = false
        })
        .finally(() => {
          this.clusterLoading = false
        })
    },
    // 删除集群信息
    clusterDelete(row) {
      this.$api.deleteClusterInfo({ clusterCode: row.clusterCode }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.delSuccess')
          })
          this.jiqun()
        }
      })
    },
    // 集群（取消）支持存储
    clusterDetails(row) {
      let data = {
        clusterCode: row.clusterCode,
        storage: row.storage == 0 ? 1 : 0
      }
      this.$api.modifyClusterStorage(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.operatingSuccessContent')
          })
          row.storage = row.storage == 0 ? 1 : 0
        }
      })
    },

    // 集群列表搜索
    handcluster() {
      this.cluster_pageNum = 1
      this.jiqun()
    },

    getListByPage_cluster() {
      this.jiqun()
    },
    //  获取网关列表
    checkgateway(row) {
      this.clusterCode = row.clusterCode
      this.wangguan()
    },
    // 获取网关
    wangguan() {
      this.gatewayLoading = true
      let data = {
        pageInfo: {
          pageNum: this.gateway_pageNum,
          pageSize: this.gateway_pageSize
        },
        clusterCode: this.clusterCode
      }
      if (this.gatewaysearch.gatewayId != '') {
        data.gatewayId = this.gatewaysearch.gatewayId
      }
      if (this.gatewaysearch.gatewayIp != '') {
        data.gatewayIp = this.gatewaysearch.gatewayIp
      }
      this.$api.getGatewayList(data).then(res => {
        if (res.gatewayList && res.gatewayList.length) {
          this.gatewayList = res.gatewayList
          this.$refs.gatewayList.setCurrentRow(this.gatewayList[0], true)
          this.gatewayNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.gatewayList?.setScrollTop(0)
          })
        } else {
          this.gatewayList = []
          this.gatewayNum = 0
        }
        this.gatewayLoading = false
      })
    },
    // 删除网关信息
    gatewayDelete(row) {
      this.$api.deleteGatewayInfo({ gatewayId: row.gatewayId }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.delSuccess')
          })

          this.wangguan()
        }
      })
    },
    // 网关列表搜索
    handgateway() {
      this.gateway_pageNum = 1
      this.wangguan()
    },

    // 获取网关
    wangguan() {
      this.gatewayLoading = true
      let data = {
        pageInfo: {
          pageNum: this.gateway_pageNum,
          pageSize: this.gateway_pageSize
        },
        clusterCode: this.clusterCode
      }
      if (this.gatewaysearch.gatewayId != '') {
        data.gatewayId = this.gatewaysearch.gatewayId
      }
      if (this.gatewaysearch.gatewayIp != '') {
        data.gatewayIp = this.gatewaysearch.gatewayIp
      }
      this.$api.getGatewayList(data).then(res => {
        if (res.gatewayList && res.gatewayList.length) {
          this.gatewayList = res.gatewayList
          this.$refs.gatewayList.setCurrentRow(this.gatewayList[0], true)
          this.gatewayNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.gatewayList.setScrollTop(0)
          })
        } else {
          this.gatewayList = []
          this.gatewayNum = 0
        }
        this.gatewayLoading = false
      })
    },
    // 删除网关信息
    gatewayDelete(row) {
      this.$api.deleteGatewayInfo({ gatewayId: row.gatewayId }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('public.delSuccess')
          })

          this.wangguan()
        }
      })
    },
    // 网关列表搜索
    handgateway() {
      this.gateway_pageNum = 1
      this.wangguan()
    },

    getListByPage_gateway() {
      this.wangguan()
    },

    // 同步
    synchronization() {
      this.loading = true
      this.clusterLoading = true
      this.gatewayLoading = true

      this.$api.syncAllPlat({}).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('primaryDevice.synchronousRegime')
          })
          this.getDomainLists()
        }
        this.loading = false
        this.clusterLoading = false
        this.gatewayLoading = false
      })
    },

    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSethsilection = val
      if (this.multipleSethsilection.length != 0) {
        this.changeBtn = false
      } else {
        this.changeBtn = true
      }
    },

    configuration(row) {
      this.dataForm = row
      this.dataForm.count = row.count ? String(row.count) : ''
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss">
#cluster-manage {
  .pageTitle {
    font-size: 18px;
    margin-top: 20px;
  }
  .plat-form {
    font-size: 14px;
    margin-top: 20px;
  }
  .flex-item {
    width: 42%;
  }

  //缺省页
  .tableNOdata img {
    margin-top: 0;
  }

  .el-loading-spinner {
    margin-top: -6px;
  }
}
</style>
