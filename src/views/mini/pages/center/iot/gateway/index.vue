<template>
  <!-- 设备管理 -->
  <div
    id="gateway-manage"
    v-if="isRouterAlive"
    ref="gatewayManage"
    
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :withTenant="true"
          />
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div style="margin: 20px 0 20px">
          <el-button v-hasPermi="[28]" type="primary" @click="handleAdd">
            {{ $t('GBShare.addDevice') }}
          </el-button>
          <el-button v-hasPermi="[28]" type="primary" @click="exportExcel">
            {{ $t('iotGateway.export') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '219px' : '127px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('iotGateway.deviceName') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                prop="deviceName"
              >
                <el-input
                  v-model="searchForm.deviceName"
                  auto-complete="off"
                  :placeholder="$t('public.pleaseInputMainDevName')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                :label="$t('iotGateway.onlineStatus') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                prop="status"
              >
                <el-select
                  v-model="searchForm.status"
                  :placeholder="$t('iotGateway.onlineStatusPrompt')"
                  clearable
                >
                  <el-option
                    v-for="item in deviceRegisterStatusListFormatter"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('iotGateway.deviceStatus') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                prop="deviceStatus"
              >
                <el-select
                  v-model="searchForm.deviceStatus"
                  :placeholder="$t('iotGateway.deviceStatusPrompt')"
                  clearable
                >
                  <el-option
                    v-for="item in deviceBusinessStatusListFormatter"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="getDeviceList" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <el-button type="primary" @click="handleReset" class="miniBtn">
                {{ $t('public.reset') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

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
              :label="$t('iotGateway.deviceSn')"
              show-overflow-tooltip
              prop="deviceSn"
            />
            <el-table-column
              :label="$t('iotGateway.deviceName')"
              show-overflow-tooltip
              prop="deviceName"
            />
            <el-table-column
              :label="$t('iotGateway.platName')"
              show-overflow-tooltip
              prop="platId"
              :formatter="platIdFormatter"
            />
            <el-table-column
              :label="$t('iotGateway.onlineStatus')"
              show-overflow-tooltip
              :formatter="statusFormatter"
            />
            <el-table-column
              :label="$t('iotGateway.deviceStatus')"
              show-overflow-tooltip
              prop="deviceStatus"
              :formatter="deviceStatusFormatter"
            />
            <el-table-column
              :label="$t('iotGateway.fwVersion')"
              show-overflow-tooltip
              prop="fwVersion"
            />
            <el-table-column
              :label="$t('iotGateway.hwVersion')"
              show-overflow-tooltip
              prop="hwVersion"
            />
            <el-table-column
              :label="$t('iotGateway.swVersion')"
              show-overflow-tooltip
              prop="swVersion"
            />

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" v-hasPermi="[27]" @click="handleDetail(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" v-hasPermi="[28]" @click="handleEdit(row)">
                  {{ $t('public.modify') }}
                </span>
                <!--  <span
                   class="cell-operate"
                    @click="handleDelete(row)"
                    >{{ $t("public.delete") }}</span
                  > -->
                <el-dropdown trigger="click" @command="handleCommand">
                  <span v-hasPermi="[28]" style="color: #10a9ff; cursor: pointer; font-size: 12px">
                    {{ $t('public.moreActions') }}
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'a')">
                        <span style="color: #10a9ff">{{ $t('iotGateway.upgrade') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'b')">
                        <span style="color: #f56c6c">{{ $t('public.delete') }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="searchForm.pageInfo.pageNum"
            v-model:limit="searchForm.pageInfo.pageSize"
            @pagination="getDeviceList"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <add-gateway></add-gateway>
    <gateway-detail></gateway-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { download } from "@/utils/common/download";
import { mapState, mapActions } from "vuex";
import breadcrumb from "@/components/breadcrumb"; //面包屑
import addGateway from "./component/add-gateway.vue";
import gatewayDetail from "./component/gateway-detail.vue";
import lazyTree from '@/components/lazy-tree'
export default {
  name: 'GatewayDeviceManagement',
  components: {
    'lazy-tree': lazyTree,
    breadcrumb,
    addGateway,
    gatewayDetail
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,

      organizationId: sessionStorage.getItem('organizationId'),
      organizationName: '', //组织名称

      // 条件搜索
      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      totalNum: 0, // 总数量
      multipleSelection: [], //表格选中状态存放数组
      loading: true,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 630,
      maskloading: false,
      operation: true, //true:添加 false:修改
      dialogVisiable: false,
      deviceId: '',
      dataForm: {
        longitude: '', //经度
        latitude: '' //纬度
      },
      platList: [],
      dialogVisiable1: false
    }
  },

  computed: {
    ...mapState({
      deviceRegisterStatusList: state => state.dict['device-register-status'],
      deviceBusinessStatusList: state => state.dict['device-business-status'],
      iotDeviceManufacture: state => state.dict['iot-device-manufacture']
    }),
    deviceRegisterStatusListFormatter() {
      let obj = []
      this.deviceRegisterStatusList.map(item => {
        obj.push({
          name: item.name,
          value: parseInt(item.value)
        })
      })
      return obj
    },
    deviceBusinessStatusListFormatter() {
      let obj = []
      this.deviceBusinessStatusList.map(item => {
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
    this.getIotPlatList()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    // 获取字典表
    getDictData() {
      this.getSysDictData([
        'device-register-status',
        'device-business-status',
        'iot-device-manufacture'
      ])
    },
    getIotPlatList() {
      let obj = {
        organizationId: parseInt(this.organizationId),
        pageInfo: {
          pageNum: 1,
          pageSize: 50
        }
      }
      this.$api.getIotPlatformList(obj).then(res => {
        if (res.platList && res.platList.length) {
          this.platList = res.platList
        }
      })
    },
    getDeviceList() {
      this.loading = true
      this.dataText = ''
      this.searchForm.organizationId = parseInt(this.organizationId)

      this.$api.getIotDeviceList(this.searchForm).then(res => {
        if (res.resultCode == 0 && res.deviceList) {
          this.tableData = res.deviceList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
        }
        this.loading = false
      })
    },
    // 树加载完初始化表格
    async initData(list) {
      const payload = list[0].payload
      this.organizationId = payload.organizationId
      this.organizationName = payload.organizationName
      await this.getDeviceList()
    },
    // 点击树节点
    async treeNodeClick(obj) {
      // 点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
      this.organizationId = obj.data.payload.organizationId
      this.organizationName = obj.data.payload.organizationName
      this.handleReset()
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },
    search_clear() {
      this.searchForm = {
        deviceName: '',
        status: '',
        deviceStatus: ''
      }
    },
    handleReset() {
      this.$refs['form'].resetFields()
      this.getDeviceList()
    },
    // 添加 !
    handleAdd() {
      this.dataForm = {
        deviceSn: '',
        deviceName: '',
        installLocate: '',
        model: '',
        longitude: '',
        latitude: '',
        platId: '',
        manufacturer: '',
        fwVersion: '',
        hwVersion: '',
        swVersion: ''
      }
      this.operation = true
      this.dialogVisiable = true
    },

    async exportExcel() {
      let { deviceName, status, deviceStatus } = this.searchForm
      let obj = { deviceName, status, deviceStatus }
      let res = await this.$api.exportIotDeviceInfo({
        ...obj,
        organizationId: this.organizationId,
        netType: this.$getNetType()
      })
      if (res.resultCode == 0) {
        download(res.fileUrl, this.$t('iotGateway.exportFileName'))
      }
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    platIdFormatter(row) {
      return this.selectDictLabel(this.platList, row.platId, {
        key: 'platName',
        value: 'platId'
      })
    },
    deviceStatusFormatter(row) {
      return this.selectDictLabel(this.deviceBusinessStatusListFormatter, row.deviceStatus, {
        key: 'name',
        value: 'value'
      })
    },
    statusFormatter(row) {
      return this.selectDictLabel(this.deviceRegisterStatusListFormatter, row.status, {
        key: 'name',
        value: 'value'
      })
    },
    async getIotDeviceInfo() {
      let res = await this.$api.getIotDeviceInfo({ deviceId: this.deviceId })
      this.organizationName = res.organizationName
      if (res.resultCode == 0) {
        this.dataForm = {
          deviceSn: res.deviceSn,
          deviceName: res.deviceName,
          installLocate: res.installLocate,
          model: res.model,
          longitude: res.longitude,
          latitude: res.latitude,
          platId: res.platId,
          manufacturer: res.manufacturer,
          fwVersion: res.fwVersion,
          hwVersion: res.hwVersion,
          swVersion: res.swVersion
        }
      }
    },

    // 修改
    async handleEdit(row) {
      this.operation = false
      this.deviceId = row.deviceId
      await this.getIotDeviceInfo(row.deviceId)
      this.dialogVisiable = true
    },

    // 详情
    async handleDetail(row) {
      this.deviceId = row.deviceId
      await this.getIotDeviceInfo(row.deviceId)
      this.dialogVisiable1 = true
    },
    // 更多操作
    handleCommand(command) {
      switch (command.command) {
        case 'a':
          this.updateVersion(command.row)
          break
        case 'b':
          this.handleDelete(command.row)
          break
      }
    },
    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },
    async updateVersion(row) {
      // 版本检查
      let res1 = await this.$api.checkDeviceSoftwareVersion({
        deviceId: row.deviceId
      })
      if (res1.resultCode == 0 && res1.versionId) {
        if (res1.versionId == row.versionId) {
          this.$message({
            type: 'success',
            message: `${this.$t('iotGateway.latestVersion')}`
          })
        } else {
          let res2 = await this.$api.upgradeDeviceSoftwareVersion({
            deviceId: row.deviceId
          })
          if (res2.resultCode == 0) {
            this.$message({
              type: 'success',
              message: `${this.$t('iotGateway.upgradeSuccess')}`
            })
          }
        }
      }
    },

    handleDelete(row) {
      this.$confirm(this.$t('public.deletedev'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteIotDeviceInfo({ deviceId: row.deviceId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getDeviceList()
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

    dialogOpen() {
      this.$nextTick(() => {
        
      })
    }
  }
}
</script>

<style lang="scss">
#gateway-manage {
  width: 100%;
  height: 100%;

  .flex-item {
    width: 42%;
  }

  .el-dialog__body {
    padding: 15px 0 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
}
</style>
