<template>
  <!-- 设备管理 -->
  <div
    id="mainDevViewClass"
    v-if="isRouterAlive"
    ref="mainDevViewClass"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNode"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div style="margin: 20px 0 20px">
          <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
            {{ $t('primaryDevice.addDevice') }}
          </el-button>

          <el-dropdown trigger="click" @command="getTemplate" style="margin-left: 10px">
            <el-button v-if="PermissionManage" type="primary">
              {{ $t('public.getTemplate') }}
              <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">
                  {{ $t('primaryDevice.DownloadIVS') }}
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  {{ $t('primaryDevice.DownloadSVS') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click" style="margin: 0 10px">
            <el-button v-if="PermissionManage" type="primary">
              {{ $t('public.batchImport') }}
              <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="upload">
                    <input
                      type="file"
                      @change="importInfoIVS"
                      ref="importIVS"
                      class="importInfoIVS"
                      style="
                        position: absolute;
                        top: 6px;
                        left: 0;
                        right: 0;
                        opacity: 0;
                        width: 100%;
                      "
                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <a class="add">{{ $t('primaryDevice.importIVS') }}</a>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div class="uploadSVS">
                    <input
                      type="file"
                      @change="importInfoSVS"
                      ref="importSVS"
                      class="importInfoSVS"
                      style="
                        position: absolute;
                        left: 0;
                        right: 0;
                        opacity: 0;
                        width: 100%;
                        bottom: 6px;
                      "
                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <a class="add">{{ $t('primaryDevice.importSVS') }}</a>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button type="primary" @click="Allocating" v-if="PermissionAllot">
            {{ $t('primaryDevice.AllocatingEquipment') }}
          </el-button>
          <el-button type="danger" @click="handleDel" :disabled="delShow" v-if="PermissionManage">
            {{ $t('public.batchDeletion') }}
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
                :label="$t('public.mainDevName') + ' ：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.mainDevName"
                  auto-complete="off"
                  :placeholder="$t('public.pleaseInputMainDevName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('primaryDevice.mainDevId') + ' ：'"
                prop="cameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.mainDevId"
                  auto-complete="off"
                  :placeholder="$t('primaryDevice.pleaseInputmainDevId')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('public.thirdMainDevId') + ' ：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-input
                  v-model="searchForm.thirdMainDevId"
                  auto-complete="off"
                  :placeholder="$t('public.inputThirdMainDevId')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
            </div>

            <div v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('public.thirdMainDevId') + ' ：'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.thirdMainDevId"
                    auto-complete="off"
                    :placeholder="$t('public.inputThirdMainDevId')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('primaryDevice.puIp') + ' ：'"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.puIp"
                    auto-complete="off"
                    :placeholder="$t('primaryDevice.pleaseInputpuIp')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('deviceCamera.platId') + ' ：'"
                  auto-complete="off"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.platId"
                    :placeholder="$t('deviceCamera.pleaseInputPlatId')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in platNameList"
                      :key="index"
                      :label="item.platName"
                      :value="item.platId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="screenFlag"
                  :label="$t('primaryDevice.billingNumber') + ' ：'"
                  auto-complete="off"
                  prop="billingNumber"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.billingNumber"
                    auto-complete="off"
                    :placeholder="$t('primaryDevice.pleaseInputBillingNumber')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
              <div class="flexstart">
                <el-form-item
                  :label="$t('deviceCamera.platId') + ' ：'"
                  auto-complete="off"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.platId"
                    :placeholder="$t('deviceCamera.pleaseInputPlatId')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in platNameList"
                      :key="index"
                      :label="item.platName"
                      :value="item.platId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="!screenFlag"
                  :label="$t('primaryDevice.billingNumber') + ' ：'"
                  auto-complete="off"
                  prop="billingNumber"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.billingNumber"
                    auto-complete="off"
                    :placeholder="$t('primaryDevice.pleaseInputBillingNumber')"
                    clearable
                    @change="search_change"
                  />
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
            @selection-change="handleSelectionChange"
            @row-contextmenu="rowContextmenu"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('primaryDevice.mainDevId')"
              min-width="110"
              show-overflow-tooltip
              prop="mainDevId"
            >
              <template #default="{ row }">
                <span>{{ row.mainDevId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.thirdMainDevId')"
              min-width="110"
              show-overflow-tooltip
              prop="thirdMainDevId"
            >
              <template #default="{ row }">
                <span>{{ row.thirdMainDevId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.mainDevName')"
              min-width="100"
              show-overflow-tooltip
              prop="mainDevName"
            >
              <template #default="{ row }">
                <span>{{ row.mainDevName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('primaryDevice.drive')"
              min-width="65"
              show-overflow-tooltip
              prop="drive"
            >
              <template #default="{ row }">
                <span>{{ row.drive }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.mainDevType')"
              min-width="60"
              show-overflow-tooltip
              prop="mainDevType"
            >
              <template #default="{ row }">
                <span>{{ setmainDevType(row.mainDevType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('primaryDevice.puIp')"
              min-width="65"
              show-overflow-tooltip
              prop="mainDevConfigInfo"
            >
              <template #default="{ row }">
                <span>{{ row.mainDevConfigInfo.puIp }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.createTime')"
              min-width="90"
              show-overflow-tooltip
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.updateTime')"
              min-width="90"
              show-overflow-tooltip
              prop="updateTime"
            >
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleEdits(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)" v-if="PermissionManage">
                  {{ $t('public.modify') }}
                </span>
                <el-dropdown trigger="click" @command="handleCommand">
                  <span
                    style="color: #10a9ff; cursor: pointer; font-size: 12px"
                    v-if="PermissionManage || PermissionInfoView"
                  >
                    {{ $t('public.moreActions') }}
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'a')">
                        <span style="color: #10a9ff" v-if="PermissionCameraView">
                          {{ $t('primaryDevice.Video') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        :command="beforeHandleCommand(row, 'b')"
                        v-show="row.platType == 5 || row.platType == 9"
                      >
                        <span style="color: #10a9ff" v-if="PermissionInfoView">
                          {{ $t('public.editFrontInfo') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'c')">
                        <span style="color: #f56c6c" v-if="PermissionManage">
                          {{ $t('public.delete') }}
                        </span>
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
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加对话框 -->
    <device-add></device-add>
    <!-- 修改对话框 -->
    <device-modify></device-modify>
    <!-- 详情对话框 -->
    <device-detail></device-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      what="设备"
      @getList="mainDevList"
      :operate="operate"
      :batchApi="batchApi"
      whatId="mainDevId"
      whatName="mainDevName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
      @searchClear="search_clear"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import { mapState, mapActions } from 'vuex'

import deviceAdd from './component/device-add'
import deviceModify from './component/device-modify'
import deviceDetail from './component/device-detail'
import batchOperate from '@/components/batchOperate' //批量操作
import breadcrumb from '@/components/breadcrumb' //面包屑

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  components: {
    'device-add': deviceAdd,
    'device-modify': deviceModify,
    'device-detail': deviceDetail,
    'batch-operate': batchOperate,
    breadcrumb,
    ElIconArrowDown
  },
  name: 'ViewLibraryMainDeviceManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      PermissionAllot: true,
      PermissionInfoView: true,
      PermissionInfoSet: true,

      organizationId: null,
      organizationName: '', //组织名称

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      // 条件搜索
      searchForm: {
        mainDevName: '',
        mainDevId: '',
        puIp: '',
        thirdMainDevId: '',
        platId: '',
        billingNumber: ''
      },
      isSearch: false,

      operate: '',
      batchApi: '',
      batchDialogVisible: false, //批量操作对话框
      multipleSelection: [], //表格选中状态存放数组
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 630,

      deivcoData: [], //视频通道信息
      pageSizeplat: 5000,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      domainResultCode: '', //集群列表接口返回码
      rowmainDevId: [],
      PlatformAccountShow: true,
      PlatformPasswordShow: true,

      showOthersMenu: 1, //是否显示其他前端参数配置菜单
      failDialog: false, //导入失败对话框
      failList: [], //导入失败列表

      modifyRoleDialogVisible: false, // 批量修改维护角色

      pageloading: false,

      infoDialogVisible: false, //前端参数弹框
      videoChannelDialogVisible: false, //视频通道
      mainDevId: '',

      addMainDevVisible: false, // 添加对话框

      recordPolicyDialogVisible: false, //添加设备录像策略失败弹框
      recordPolicyFailList: [],

      mainDevDetailVisible: false, // 详情对话框
      mainDevDetailForm: {}, // 详情表单
      operatorForm: {},

      modifyMainDevVisible: false, // 修改对话框
      modifyMainForm: {}, // 修改表单
      modifyMainOperatorForm: {},

      delShow: true, //批量删除

      recordPolicyData: [], // 录像策略

      allcateForm: {}, // 调拨主设备
      allcateDialogVisible: false, //调拨设备
      allcateErrorDialogVisible: false, //调拨失败对话框
      resultlist: [], //调拨失败列表

      mainDevTypeData: [], // 设备类型
      maxVideoNumData: [], // 最大视频通道数
      driveData: [], // 设备协议类型

      platNameList: [], //平台
      platNameLists: [], //调拨平台
      AddplatNameLists: [], //添加设备平台
      platType: '', //平台类型
      platId: '', //平台Id

      maskloading: false,

      //5.7.4新增
      accessWayList: [], //视图接入方式
      typeList: []
    }
  },
  computed: {
    ...mapState({
      applicationData: state => state.dict['application-type'],
      ptzTypeData: state => state.dict['device-type'],
      manufacturerData: state => state.dict['camera_manufacturer'],
      functionTypeList: state => state.dict['ape_function_type'],
      networkTypeData: state => state.dict['dev-access-mode'], // 网络类型
      baseInfoShow: state => state.config.baseInfoShow
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.pageResize()
      this.setData()
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.pageResize()
    this.setData()
    this.getDictionary()
  },
  activated() {
    
    this.pageResize()
  },
  methods: {
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1916)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(17)
      this.PermissionManage = await permissions(18)
      this.PermissionAllot = await permissions(20)
      this.PermissionInfoView = await permissions(161)
      this.PermissionInfoSet = await permissions(162)

      this.PermissionCameraView = await permissions(21) //镜头查看
      this.PermissionCameraManage = await permissions(22) //镜头管理
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1,
        withTenant: 2
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        setTimeout(() => {
          this.$refs.breadcrumb.initBread(list)
        }, 100)
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          const payload = list[0].payload
          this.organizationId = payload.organizationId
          this.organizationName = payload.parents.split(',')
          this.organizationName.pop()
          await this.platformList() // 监控平台
          await this.getMainDevList()
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },

    // 点击树节点 !
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)

      this.organizationId = data.payload.organizationId
      this.organizationName = data.payload.parents.split(',')
      this.organizationName.pop()
      this.search_clear()
      this.getMainDevList()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    // 加载设备列表 ！
    getMainDevList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId
      }
      if (this.isSearch) {
        Object.assign(data, this.searchForm)
      }

      this.$api.getMainDevList(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      if (res.mainDevList && res.mainDevList.length != 0) {
        this.tableData = res.mainDevList
        this.totalNum = res.pageInfo.totalNum

        this.tableData.forEach(tableDataItem => {
          this.platNameList.forEach(platNameListItem => {
            if (platNameListItem.platId == tableDataItem.platId) {
              tableDataItem.platType = platNameListItem.platType
            }
          })
        })
        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0);
        });
      } else {
        this.tableData = []
        this.totalNum = 0
        this.dataText = this.$t('public.noData')
      }
      this.loading = false
    },

    // 监控平台 !
    async platformList() {
      await this.$api
        .queryAccessPlatformList({
          organizationId: this.organizationId
        })
        .then(res => {
          if (res.platformList && res.platformList.length) {
            res.platformList = res.platformList.map(item => {
              return {
                enableStatus: item.enableStatus,
                platId: item.platformId,
                platName: item.platformName,
                platType: item.platformType,
                platStatus: item.platformStatus
              }
            })
            this.platNameList = res.platformList
          }
        })
      await this.$api
        .getPlatformListQuery({
          organizationId: this.organizationId,
          pageInfo: {
            pageNum: 1,
            pageSize: 100
          }
        })
        .then(res => {
          this.platNameLists = []
          this.AddplatNameLists = []
          if (res.platList && res.platList.length) {
            res.platList.forEach(item => {
              if (item.platType == 2) {
                this.platNameLists.push(item)
              } else if (item.platType == 5 || item.platType == 9 || item.platType == 10) {
                this.platNameLists.push(item)
                this.AddplatNameLists.push(item)
              } else if (item.platType == 1) {
                this.AddplatNameLists.push(item)
              }
            })
          }
        })
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData([
        'application-type',
        'device-type',
        'camera_manufacturer',
        'ape_function_type',
        'dev-access-mode'
      ])
    },

    setmainDevType(val) {
      if (val == 0) {
        return this.$t('public.mainDevName0')
      } else if (val == 1) {
        return this.$t('public.mainDevName1')
      } else if (val == 2) {
        return this.$t('public.mainDevName2')
      } else if (val == 3) {
        return this.$t('public.mainDevName3')
      } else if (val == 4) {
        return this.$t('public.mainDevName4')
      } else {
        return ''
      }
    },

    // 国际化
    setData() {
      this.mainDevTypeData = [
        {
          AmainDev: 3,
          mainDevName: this.$t('public.mainDevName3')
        },
        {
          AmainDev: 1,
          mainDevName: this.$t('public.mainDevName1')
        }
      ]

      this.maxVideoNumData = [
        { maxVideoNum: 1, maxVideoName: this.$t('public.maxVideoName1') },
        { maxVideoNum: 4, maxVideoName: this.$t('public.maxVideoName4') },
        { maxVideoNum: 8, maxVideoName: this.$t('public.maxVideoName8') },
        { maxVideoNum: 16, maxVideoName: this.$t('public.maxVideoName16') },
        { maxVideoNum: 32, maxVideoName: this.$t('public.maxVideoName32') },
        { maxVideoNum: 64, maxVideoName: this.$t('public.maxVideoName64') }
      ]

      this.accessWayList = [
        {
          name: this.$t('primaryDevice.accessWay1'),
          value: 1
        },
        {
          name: this.$t('primaryDevice.accessWay2'),
          value: 2
        }
      ]
      this.typeList = [
        {
          name: this.$t('primaryDevice.type'),
          value: '独立采集设备'
        }
      ]
      this.uploadWayList = [
        {
          name: this.$t('primaryDevice.uploadWay1'),
          value: 1
        }
      ] //图片上传方式
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          mainDevName: '',
          mainDevId: '',
          puIp: '',
          thirdMainDevId: '',
          platId: '',
          billingNumber: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getMainDevList()
    },

    getTemplateCommand(command) {
      switch (command) {
        case 1:
          this.getTemplate(1) // 下载模板IVS
          break
        case 2:
          this.getTemplate(2) // 下载模板SVS
          break
        case 3:
          this.getTemplate(3) // 下载模板VSS
          break
      }
    },
    getTemplate(templateType) {
      let data = {
        templateType,
        netType: this.$getNetType()
      }

      this.$api.getMainDevTemplate(data).then(res => {
        if (res.templateFileUrl) {
          let name = ''
          name = templateType == 1 ? 'IVS' : templateType == 2 ? 'SVS' : 'VSS'
          download(res.templateFileUrl, name + '-' + this.$t('public.importTemplate'))
        }
      })
    },

    // 批量导入
    importInfoIVS() {
      this.$refs.importIVS.click()
      this.importInfo('importIVS', 1)
    },
    importInfoSVS() {
      this.$refs.importSVS.click()
      this.importInfo('importSVS', 2)
    },
    importInfoVSS() {
      this.$refs.importVSS.click()
      this.importInfo('importVSS', 3)
    },
    importInfo(refName, templateType) {
      let inputDOM = this.$refs[refName]
      let fil = inputDOM.files
      let isTypeTrue = /\.(xls|xlsx)$/.test(fil[0].name.toLowerCase())
      if (!isTypeTrue) {
        this.$message.error(this.$t('public.uploadError'))
        return
      }

      let formData = new FormData()
      formData.append('file', fil[0])
      formData.append('api', '/api/uvs/main-dev/import')
      formData.append('netType', this.$getNetType())
      this.pageloading = true
      this.$api.uploadFileTemporary(formData).then(res => {
        let data = {
          importFileId: res.fileId,
          templateType,
          netType: this.$getNetType()
        }
        this.$api.importMainDevInfo(data, 60000).then(res1 => {
          this.pageloading = false
          this.$refs[refName].value = ''
          if (res1.resultCode == 0) {
            this.$message.success(this.$t('public.importSuccess'))
            this.search_clear()
            this.getMainDevList()
          } else if (res1.resultCode != 10 && res1.resultCode != 2) {
            this.failList = res1.failList
            this.failList.forEach(item => {
              if (item.errorMsg === 'error:104012') {
                item.errorMsg = this.$t('primaryDevice.deviceInfoCannotSame')
              }
              if (item.errorMsg === 'error:201006') {
                item.errorMsg = this.$t('primaryDevice.recordingDaysCannotEmpty')
              }
            })
            this.failDialog = true
          }
        })
      })
    },

    // 获取录像策略
    getRecordPlanList() {
      if (this.recordPolicyData.length) return
      this.$api.getRecordPlanListQuery({}).then(res => {
        if (res.recordPlanList) {
          this.recordPolicyData = res.recordPlanList
        }
      })
    },

    // 添加 !
    async handleAdd() {
      if (!this.applicationData.length) {
        this.getSysDictData(['application-type'])
      }
      await this.getRecordPlanList()
      this.addMainDevVisible = true
    },

    // 调拨设备
    Allocating() {
      this.allcateForm = {
        organizationId: this.organizationId,
        organizationName: this.organizationName,
        platform: '',
        domainCode: '',
        PlatformAccount: '',
        PlatformPassword: '',
        devicelist: ''
      }
      this.allcateDialogVisible = true
    },

    // 批量删除 ！
    handleDel() {
      let pormpt = ''
      if (this.locale == 'en') {
        pormpt =
          this.$t('public.thisSelected') +
          ' ' +
          this.multipleSelection.length +
          ' ' +
          this.$t('primaryDevice.deleteDev') +
          ',' +
          this.$t('public.bulkDelPrompt2')
      } else {
        pormpt = '此操作将选中的' + this.multipleSelection.length + '个设备删除, 是否继续?'
      }
      this.$confirm(pormpt, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(async () => {
          this.loading = true

          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'deleteMainDevInfo'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 556 : 630
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
    },

    // 修改
    async handleEdit(row) {
      let res = await this.$api.getMainDevInfo({ mainDevId: row.mainDevId })
      if (res.resultCode != 0) return
      this.modifyMainForm = {
        organizationId: res.organizationId,
        organizationName: res.organizationName,
        mainDevId: res.mainDevId,
        mainDevName: res.mainDevName,
        drive: res.drive,
        installLocate: res.installLocate,
        thirdMainDevId: res.thirdMainDevId,
        mainDevType: res.mainDevType,
        manufacturer: res.manufacturer,
        remark: res.remark,
        platId: res.platId,
        interconnectCode: res.interconnectCode
      }
      this.modifyMainDevVisible = true
    },

    // 详情
    async handleEdits(row) {
      let res = await this.$api.getMainDevInfo({ mainDevId: row.mainDevId })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        organizationName: res.organizationName,
        mainDevId: res.mainDevId,
        mainDevName: res.mainDevName,
        applicationType: res.applicationType,
        drive: res.drive,
        installLocate: res.installLocate,
        thirdMainDevId: res.thirdMainDevId,
        mainDevType: res.mainDevType,
        manufacturer: res.manufacturer,
        status: res.status,
        networkType: res.mainDevNetworkInfo ? res.mainDevNetworkInfo.networkType : '',
        longitude: res.longitude,
        latitude: res.latitude,
        createTime: res.createTime,
        updateTime: res.updateTime,
        remark: res.remark,
        interconnectCode: res.interconnectCode
      }
      if (res.mainDevAccessInfo) {
        Object.assign(this.mainDevDetailForm, {
          accessServerId: res.mainDevAccessInfo.accessServerId,
          accessServerDomain: res.mainDevAccessInfo.accessServerDomain,
          accessServerHost: res.mainDevAccessInfo.accessServerHost,
          accessServerPort: res.mainDevAccessInfo.accessServerPort,
          accessServerIpv6Host: res.mainDevAccessInfo?.accessServerIpv6Host
        })
      }
      this.platNameList.filter(item => {
        if (item.platId == res.platId) {
          this.mainDevDetailForm.platName = item.platName
        }
      })

      this.mainDevDetailVisible = true
    },

    // 更多操作
    handleCommand(command) {
      switch (command.command) {
        case 'a':
          this.mainDevCameraList(command.row)
          break
        case 'b':
          this.handleFrontInfo(command.row)
          break
        case 'c':
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
    // 视频通道
    mainDevCameraList(row) {
      this.mainDevId = row.mainDevId
      this.videoChannelDialogVisible = true
    },

    handleDelete(row) {
      this.$confirm(this.$t('public.deletedev'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteMainDevInfo({ mainDevId: row.mainDevId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getMainDevList()
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

    // 配置前端参数
    handleFrontInfo(row) {
      this.$store.commit('config/set_frontDevId', row.mainDevId)
      this.$store.commit('config/set_frontPlatType', row.platType)
      this.$store.commit('config/set_frontDrive', row.drive)
      this.$store.commit('config/set_baseInfoShow', true)
    },
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },

    // 分页
    getListByPage() {
      this.search_clear()
      this.getMainDevList()
    }
  }
}
</script>

<style lang="scss">
#mainDevViewClass {
  width: 100%;
  height: 100%;

  .flex-item {
    width: 42%;
  }

  .el-dialog__body {
    padding: 15px 20px 5px;

    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }

  .el-step__icon.is-text {
    width: 68px;
    height: 68px;
    background: transparent;
  }

  .el-step__head.is-process .el-step__icon.is-text {
    border-color: #64befd !important;
    color: #64befd;
  }

  .el-step__title.is-process {
    color: #64befd;
  }

  .el-step__title.is-success {
    color: #ccc;
  }

  .el-icon-check:before {
    font-size: 25px;
    color: #fff;
  }

  .el-step__head.is-success .el-step__icon.is-text {
    border-color: #64befd !important;
    background: #64befd;
  }

  .el-step__head.is-success {
    border-color: #bfbfbf;
  }
}
</style>
