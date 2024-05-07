<template>
  <div
    id="viewClass"
    v-if="isRouterAlive"
    ref="viewClass"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <el-row v-if="!showSubInfo">
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
            {{ $t('platformManagement.addView') }}
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
                :label="$t('platformManagement.viewName') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.name"
                  auto-complete="off"
                  :placeholder="$t('platformManagement.inputViewName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('platformManagement.viewType') + ':'"
                auto-complete="off"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.type"
                  :placeholder="$t('platformManagement.selectViewType')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('platformManagement.viewStatus') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.status"
                  :placeholder="$t('platformManagement.selectViewStatus')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('platformManagement.viewStatus') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.status"
                    :placeholder="$t('platformManagement.selectViewStatus')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in statusList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('platformManagement.IPAddress') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.ipAddress"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputIPAddress')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('platformManagement.viewEncoding') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-input
                    v-model="searchForm.resourceUri"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputViewEncoding')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
              <div class="flexstart">
                <el-form-item
                  :label="$t('platformManagement.viewEncoding') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.resourceUri"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputViewEncoding')"
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
        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
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
              :label="$t('platformManagement.viewName')"
              min-width="110"
              show-overflow-tooltip
              prop="platformName"
            >
              <template #default="{ row }">
                <span>{{ row.platformName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.viewType')"
              min-width="110"
              show-overflow-tooltip
              prop="type"
            >
              <template #default="{ row }">
                <span>{{ setType(row.type) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.encoding')"
              min-width="110"
              show-overflow-tooltip
              prop="resourceUri"
            >
              <template #default="{ row }">
                <span>{{ row.resourceUri }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.account')"
              min-width="80"
              show-overflow-tooltip
              prop="account"
            >
              <template #default="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.IPAddress')"
              min-width="60"
              show-overflow-tooltip
              prop="ip"
            >
              <template #default="{ row }">
                <span>{{ row.ip }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.port')"
              min-width="65"
              show-overflow-tooltip
              prop="port"
            >
              <template #default="{ row }">
                <span>{{ row.port }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.onlineStatus')"
              min-width="80"
              show-overflow-tooltip
              prop="status"
            >
              <template #default="{ row }">
                <span :class="setStatusClass(row.status)">
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('public.state')"
              min-width="65"
              prop="enable"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setEnable(row.enable) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('platformManagement.creationTime')"
              min-width="90"
              show-overflow-tooltip
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="150">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <el-dropdown trigger="click" @command="handleCommand" v-if="PermissionManage">
                  <span style="margin-right: 7px; cursor: pointer; font-size: 12px" class="blue">
                    {{ $t('public.moreActions') }}
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'edit')">
                        <span class="blue">{{ $t('public.modify') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'ena')">
                        <span :style="row.enable == '0' ? 'color:#10a9ff;' : 'color:#ff6b6b;'">
                          {{ row.enable == 0 ? $t('public.enable') : $t('public.deactivate') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(row, 'del')">
                        <span class="danger">{{ $t('public.delete') }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <span class="cell-operate" @click="subscriptionInfo(row)" v-if="PermissionManage">
                  {{ $t('platformManagement.subscriptionDetails') }}
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
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加对话框 -->
    <platform-add></platform-add>

    <!-- 详情对话框 -->
    <platform-detail></platform-detail>

    <!-- 订阅详情页面 -->
    <subscription-list v-if="showSubInfo"></subscription-list>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { mapState, mapActions } from 'vuex'

import platformAdd from './component/platform-add'
import platformDetail from './component/platform-detail'
import subscriptionList from './component/subscription-list'
import breadcrumb from '@/components/breadcrumb' //面包屑

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  name: 'ViewLibraryPlatformManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {
    'platform-add': platformAdd,
    'platform-detail': platformDetail,
    'subscription-list': subscriptionList,
    breadcrumb
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      choosedResourceUri: '',
      choosedPlatId: '',
      isRouterAlive: true,
      screenFlag: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,

      organizationId: null,
      organizationName: '', //组织名称

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      // 条件搜索
      searchForm: {
        name: '',
        resourceUri: '',
        status: '',
        ipAddress: '',
        type: ''
      },
      isSearch: false,

      multipleSelection: [], //表格选中状态存放数组
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 630,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      pageloading: false,

      addMainDevVisible: false, // 添加对话框

      mainDevDetailVisible: false, // 详情对话框
      mainDevDetailForm: {}, // 详情表单
      operatorForm: {},

      modifyMainForm: {}, // 修改表单

      delShow: true, //批量删除

      viewClassLevel: [], // 级联视图库级别
      algorithmList: [],
      protocolList: [],
      typeList: [],

      platId: '', //平台Id

      maskloading: false,

      operation: true,
      choosedId: '',

      choosedOrgName: '',

      //5.7.4新增
      showSubInfo: false,
      choosedType: '',
      choosedForcePush: '',
      resourceHandList: []
    }
  },

  computed: {
    ...mapState({
      authorityList: state => state.dict['authority_type'],
      statusList: state => state.dict['status_type']
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.pageResize()
      this.setData()
    }
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
    setEnable(val) {
      let name = ''
      this.enableList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(350)
      this.PermissionManage = await permissions(351)
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
          this.organizationName = list[0].payload.parents.split(',')
          this.organizationName.pop()

          this.choosedOrgName = payload.organizationName

          await this.getViewPlatList()
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

      this.choosedOrgName = data.payload.organizationName

      this.search_clear()
      this.getViewPlatList()
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
    getViewPlatList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },

        searchInfo: {
          organizationId: this.organizationId
        }
      }
      if (this.isSearch) {
        Object.assign(data.searchInfo, this.searchForm)
      }

      this.$api
        .getVirPlatformList(data)
        .then(res => {
          this.devListBack(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    devListBack(res) {
      if (res.platformList && res.platformList.length != 0) {
        this.tableData = res.platformList
        this.totalNum = res.pageInfo.totalNum

        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0)
        })
      } else {
        this.tableData = []
        this.totalNum = 0
        this.dataText = this.$t('public.noData')
      }
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['authority_type', 'status_type'])
    },

    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      }
    },
    setType(val) {
      let name = ''
      this.typeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setAlgorithm(val) {
      let name = ''
      this.authorityList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setProtocol(val) {
      let name = ''
      this.protocolList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setStatus(val) {
      let name = ''
      this.statusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
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
      this.viewClassLevel = [
        {
          AmainDev: 0,
          mainDevName: this.$t('public.mainDevName3')
        },
        {
          AmainDev: 1,
          mainDevName: this.$t('public.mainDevName1')
        }
      ]
      this.algorithmList = [
        {
          network: '1',
          networkName: this.$t('public.WireLess4g')
        },
        {
          network: '2',
          networkName: this.$t('public.FixedNetwork')
        },
        {
          network: '3',
          networkName: this.$t('public.HomeBroad')
        },
        {
          network: '0',
          networkName: this.$t('public.Else')
        }
      ]
      this.protocolList = [
        {
          name: 'http',
          value: 1
        },
        {
          name: 'https',
          value: 2
        }
      ]
      this.typeList = [
        {
          name: this.$t('newAccess.superior'),
          value: 1
        },
        {
          name: this.$t('newAccess.subordinate'),
          value: 2
        }
      ]
      this.enableList = [
        {
          name: this.$t('public.deactivate'),
          value: 0
        },
        {
          name: this.$t('public.enable'),
          value: 1
        }
      ]
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          name: '',
          resourceUri: '',
          status: '',
          ipAddress: '',
          type: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getViewPlatList()
    },

    handleCommand(command) {
      switch (command.command) {
        case 'edit':
          this.handleEdit(command.row)
          break
        case 'del':
          this.handleDelete(command.row)
          break
        case 'ena':
          this.enable(command.row)
          break
      }
    },

    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },

    //启用停用
    enable(row) {
      let enable = row.enable == 1 ? 0 : 1
      this.$api
        .platformEnable({
          platformId: row.resourceUri,
          enableStatus: enable
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.getViewPlatList()
            this.$message({
              type: 'success',
              message:
                row.enable == 1
                  ? this.$t('accessPlatform.deactivatedSuccessfully')
                  : this.$t('accessPlatform.enabledSuccessfully')
            })
          }
        })
    },
    // 添加 !
    handleAdd() {
      this.operation = true
      this.addMainDevVisible = true
    },

    // 批量删除 ！
    handleDel() {
      this.$confirm(
        this.$t('platformManagement.deletePlatform', {
          num: this.multipleSelection.length
        }),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.loading = true
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let item = this.multipleSelection[i]
            this.$api.delVirPlatform({ platformId: item.platformId }).then(res => {
              if (res.resultCode == 0 && i == this.multipleSelection.length - 1) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.bulkDelSuccess')
                })
                this.search_clear()
                this.getViewPlatList()
              }
            })
          }
          this.loading = false
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
      let res = await this.$api.getVirPlatformInfo({
        platformId: row.platformId
      })
      if (res.resultCode != 0) return
      this.choosedId = row.platformId
      let res1 = await this.$api.getOrganizationInfo({
        organizationId: res.organizationId
      })
      let organizationName = res1.organizationInfo.parents.split(',')
      organizationName.pop()
      this.modifyMainForm = {
        organizationId: res.organizationId,
        organizationName: organizationName,
        platformName: res.platformName,
        resourceUri: res.resourceUri,
        type: res.type,
        protocol: res.protocol,
        algorithm: res.algorithm,
        ownAccount: res.ownAccount,
        ownPassword: res.ownPassword ? res.ownPassword : '',
        account: res.account,
        password: res.password ? res.password : '',
        ip: res.ip,
        port: res.port,
        remark: res.remark,

        //5.7.4新增
        dataSendList: [
          {
            dataType: this.$t('platformManagement.personnelData'),
            ifSend: res.pushPerson,
            bigImgSet: res.personBigPic,
            smallImgSet: res.personMinPic
          },
          {
            dataType: this.$t('platformManagement.faceData'),
            ifSend: res.pushFace,
            bigImgSet: res.faceBigPic,
            smallImgSet: res.faceMinPic
          },
          {
            dataType: this.$t('platformManagement.vehicleData'),
            ifSend: res.pushVehicle,
            bigImgSet: res.vehicleBigPic,
            smallImgSet: res.vehicleMinPic
          },
          {
            dataType: this.$t('platformManagement.nonVehicleData'),
            ifSend: res.pushNonVehicle,
            bigImgSet: res.nonVehicleBigPic,
            smallImgSet: res.nonVehicleMinPic
          }
        ],

        autoDownloadUrl: res.autoDownloadUrl,
        autoAllocate: res.autoAllocate,

        ownPasswordConfirm: res.ownPassword ? res.ownPassword : '',
        passwordConfirm: res.password ? res.password : '',

        forcePush: res.forcePush ? true : res.forcePush === false ? false : null
      }

      this.operation = false
      this.addMainDevVisible = true
    },

    // 详情
    async handleInfo(row) {
      let res = await this.$api.getVirPlatformInfo({
        platformId: row.platformId
      })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        organizationId: res.organizationId,
        organizationName: res.organizationName,
        platformName: res.platformName,
        resourceUri: res.resourceUri,
        type: res.type,
        protocol: res.protocol,
        algorithm: res.algorithm,
        ownAccount: res.ownAccount,
        ownPassword: '******',
        account: res.account,
        password: '******',
        ip: res.ip,
        port: res.port,
        remark: res.remark,

        //5.7.4新增
        dataSendList: [
          {
            dataType: this.$t('platformManagement.personnelData'),
            ifSend: res.pushPerson,
            bigImgSet: res.personBigPic,
            smallImgSet: res.personMinPic
          },
          {
            dataType: this.$t('platformManagement.faceData'),
            ifSend: res.pushFace,
            bigImgSet: res.faceBigPic,
            smallImgSet: res.faceMinPic
          },
          {
            dataType: this.$t('platformManagement.vehicleData'),
            ifSend: res.pushVehicle,
            bigImgSet: res.vehicleBigPic,
            smallImgSet: res.vehicleMinPic
          },
          {
            dataType: this.$t('platformManagement.nonVehicleData'),
            ifSend: res.pushNonVehicle,
            bigImgSet: res.nonVehicleBigPic,
            smallImgSet: res.nonVehicleMinPic
          }
        ],

        autoDownloadUrl: res.autoDownloadUrl,
        autoAllocate: res.autoAllocate,

        forcePush: res.forcePush ? true : res.forcePush === false ? false : null
      }

      this.mainDevDetailVisible = true
    },

    handleDelete(row) {
      this.$confirm(this.$t('platformManagement.deleteView'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delVirPlatform({ platformId: row.platformId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getViewPlatList()
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

    async getSuperList(row) {
      this.resourceHandList = []
      let res = await this.$api.getVirPlatformInfo({
        platformId: row.platformId
      })
      if (res.resultCode != 0) return
      const protocol = res.protocol == 1 ? 'http' : 'https'
      let obj = {
        name: protocol + '://' + res.ip + ':' + res.port + '/VIID/SubscribeNotifications',
        value: protocol + '://' + res.ip + ':' + res.port + '/VIID/SubscribeNotifications'
      }
      this.resourceHandList.push(obj)
    },
    //订阅详情
    subscriptionInfo(row) {
      if (row.type == 1) {
        this.getSuperList(row)
      }
      this.choosedType = row.type
      this.choosedPlatId = row.platformId
      this.choosedResourceUri = row.resourceUri

      this.choosedForcePush = row.forcePush

      this.showSubInfo = true
    },

    // 分页
    getListByPage() {
      this.search_clear()
      this.getViewPlatList()
    }
  }
}
</script>

<style lang="scss">
#viewClass {
  width: 100%;
  height: 100%;
  .flex-item {
    width: 42%;
  }

  //一排三表单
  .screenthree {
    width: 25% !important;
  }
  .el-select {
    width: 100%;
  }

  .el-dialog__body {
    padding: 15px 40px 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
}
</style>
