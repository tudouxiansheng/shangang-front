<template>
  <!-- 租户管理 -->
  <div
    v-if="isRouterAlive"
    ref="tenantManage"
    id="tenantManage"
    v-loading="pageLoading"
    :element-loading-text="$t('public.batchImporting')"
  >
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-search-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :placeholderTitle="placeholderTitle"
            :withTenant="2"
            :treeApi="treeApi"
            :searchApi="searchApi"
            :locateApi="locateApi"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <!-- 查询和其他操作 -->
        <div class="btnMargin">
          <el-button v-if="PermissionManage" type="primary" @click="handleAdd">
            {{ $t('tenantManage.addTenant') }}
          </el-button>

          <el-button
            v-if="PermissionManage"
            type="primary"
            :loading="downLoading"
            @click="getTemplate"
          >
            {{ $t('public.getTemplate') }}
          </el-button>

          <Excel v-if="PermissionManage" date-format="YYYY-MM-DD" @success="batchImport" />

          <el-button
            v-if="PermissionEnable"
            type="primary"
            :disabled="startBtn"
            @click="handelStart"
          >
            {{ $t('public.batchEnable') }}
          </el-button>
          <el-button v-if="PermissionEnable" type="primary" :disabled="stopBtn" @click="handelStop">
            {{ $t('public.batchDeactivation') }}
          </el-button>

          <el-button
            v-if="PermissionManage"
            type="primary"
            :disabled="changeBtn"
            @click="handelChange"
          >
            {{ $t('public.bulkOrgChange') }}
          </el-button>
          <el-button
            v-if="PermissionRoleSet"
            type="primary"
            :disabled="roleBtn"
            @click="handleConfigRole"
          >
            {{ $t('public.batchRoleConfig') }}
          </el-button>
          <el-button v-if="PermissionManage" type="danger" :disabled="delShow" @click="handleDel">
            {{ $t('public.batchDeletion') }}
          </el-button>
          <!-- 查询和其他操作 -->
        </div>
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '184px' : '84px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('tenantManage.tenantName') + ' ：'"
                prop="tenantName"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.tenantName"
                  auto-complete="off"
                  :placeholder="$t('tenantManage.namePrompt')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('tenantManage.account') + ' ：'"
                prop="account"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.account"
                  auto-complete="off"
                  :placeholder="$t('tenantManage.accountPrompt')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
        <no-table :tableLoading="loading" :tableData="tableData">
          <el-table
            v-if="!loading && tableData.length"
            :max-height="tableHeight"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column align="center" type="selection" width="50" />

            <el-table-column show-overflow-tooltip :label="$t('public.account')" min-width="80">
              <template #default="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('tenantManage.tenantName')"
              min-width="80"
            >
              <template #default="{ row }">
                <span>{{ row.tenantName }}</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip :label="$t('public.state')" min-width="110">
              <template #default="{ row }">
                <span
                  v-if="row.isEnabled == 1 && row.isLocked == 0 && row.isFreeze == 1"
                  class="success"
                >
                  {{ $t('public.normal') }}
                </span>
                <span v-if="row.isEnabled == 0" class="danger">
                  {{ $t('public.deactivate') }}
                </span>
                <span v-if="row.isLocked == 1" class="danger">
                  {{ $t('public.ManualLock') }}
                </span>
                <span v-if="row.isLocked == 2" class="danger">
                  {{ $t('public.overdueLock') }}
                </span>
                <span
                  v-if="row.isLocked && row.isLocked != 0 && row.isLocked != 1 && row.isLocked != 2"
                  class="danger"
                >
                  {{ $t('public.attackLock') }}
                </span>
                <span v-if="row.isFreeze == 0" class="danger">
                  {{ $t('public.freeze') }}
                </span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip :label="$t('public.role')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.roleNames || $t('public.notAllocated') }}</span>
              </template>
            </el-table-column>

            <el-table-column
              v-if="industryTypeList.length"
              show-overflow-tooltip
              :label="$t('tenantManage.industryType')"
              min-width="80"
            >
              <template #default="{ row }">
                <span>{{ set_industryType(row.industryType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('public.AffiliatedOrg')"
              min-width="75"
            >
              <template #default="{ row }">
                <span>{{ row.organizationName }}</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip :label="$t('public.createTime')" min-width="110">
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip :label="$t('public.updateTime')" min-width="110">
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span v-if="PermissionInfo" class="cell-operate" @click="handleInfo(row)">
                  {{ $t('public.particulars') }}
                </span>

                <span
                  v-if="PermissionManage && row.adminUserId != current_user"
                  class="cell-operate"
                  @click="handleEdit(row)"
                >
                  {{ $t('public.modify') }}
                </span>

                <span
                  v-if="PermissionRoleSet && row.adminUserId != current_user"
                  class="cell-operate"
                  @click="handleConfigRole(row)"
                >
                  {{ $t('public.roleConfig') }}
                </span>

                <el-dropdown
                  v-if="row.adminUserId != current_user"
                  trigger="click"
                  @command="handleCommand"
                >
                  <span style="cursor: pointer; font-size: 12px" class="blue">
                    {{ $t('public.moreActions') }}
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="PermissionManage"
                        :command="beforeHandleCommand(row, 'a')"
                      >
                        <span class="cell-operate danger">
                          {{ $t('public.delete') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="PermissionLock"
                        :command="beforeHandleCommand(row, 'b')"
                      >
                        <span
                          :class="[
                            {
                              danger: row.isLocked == 0,
                              blue: row.isLocked == 1
                            }
                          ]"
                          :style="row.isLocked == 2 ? 'color: #909399' : ''"
                        >
                          {{ row.isLocked == 0 ? $t('public.locking') : $t('public.Unlock') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="PermissionEnable"
                        :command="beforeHandleCommand(row, 'c')"
                      >
                        <span :class="row.isEnabled == 1 ? 'danger' : 'blue'">
                          {{ row.isEnabled == 0 ? $t('public.enable') : $t('public.deactivate') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="PermissionActive"
                        :command="beforeHandleCommand(row, 'g')"
                      >
                        <span :class="row.isFreeze == 1 ? 'danger' : 'blue'">
                          {{ row.isFreeze == 0 ? $t('public.thaw') : $t('public.freeze') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="PermissionLogoManage"
                        :command="beforeHandleCommand(row, 'd')"
                      >
                        <span class="blue">
                          {{ $t('public.uploadLogo') }}
                        </span>
                      </el-dropdown-item>

                      <el-dropdown-item
                        v-if="PermissionManage"
                        :command="beforeHandleCommand(row, 'e')"
                      >
                        <span class="blue">{{ $t('public.configureWhiteList') }}</span>
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
        </no-table>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <add-info />

    <!-- 批量组织变更 -->
    <org-change @orgChangeSubmit="submitOrgChange" />

    <!-- 批量导入失败 -->
    <import-fail-list />

    <!-- 详情对话框 -->
    <tenant-detail />

    <!-- 上传logo -->
    <logo-upload v-model:visible="uploadVisible" :tenantId="tenantId" />

    <!-- 配置白名单 -->
    <white-list v-model:visible="whiteListVisible" :whiteList_Data="whiteList_Data" />

    <!-- 会话管理 -->
    <session-manage
      v-if="PermissionSessionManage"
      v-model:createVisible="createVisible"
      :sessionDate="sessionDate"
      :sessionFlag="sessionFlag"
    />

    <!-- 批量操作 -->
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="
        operate == $t('public.batchImportContent') ? batchList : multipleSelection
      "
      :what="$t('batchOperator.tenant')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="tenantId"
      whatName="tenantName"
      :multipleSelectionMany="multipleSelectionMany"
      v-model:loading="loading"
      @searchClear="search_clear"
      @getList="getTenantList"
    />

    <reset-pwd
      v-if="PermissionPwdReset"
      v-model:visible="resetPwdVisible"
      :userId="currentTenantId"
      :type="2"
    />

    <role-config
      v-if="PermissionRoleSet"
      v-model:visible="roleConfigVisible"
      :userId="currentTenantId"
      :type="2"
      @success="handleSetRole"
    />
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import { mapState, mapActions } from 'vuex'
import judgeWindow from '@/mixin/judgeWindow'
import logoUpload from '@/views/common/component/logo-upload'
import whiteList from '@/views/common/component/white-list'
import orgChange from '@/views/common/component/org-change'
import importFailList from '@/views/common/component/import-fail-list'
import Excel from '@components/excel/importExcel'
import addInfo from './component/addInfo'
import tenantDetail from './component/tenantDetail'
import batchOperate from '@/components/batchOperate' //批量操作
import breadcrumb from '@/components/breadcrumb' //面包屑
import sessionManage from '@/components/session-manage' //会话管理
import resetPwd from '@/components/reset-pwd'
import roleConfig from '@/components/role-config'
import LazySearchTree from '@/components/lazy-search-tree'

export default {
  name: 'TenantManagement',
  mixins: [judgeWindow],
  components: {
    Excel,
    'logo-upload': logoUpload,
    'white-list': whiteList,
    'org-change': orgChange,
    'session-manage': sessionManage,
    'add-info': addInfo,
    'import-fail-list': importFailList,
    'tenant-detail': tenantDetail,
    'batch-operate': batchOperate,
    LazySearchTree,
    breadcrumb,
    'reset-pwd': resetPwd,
    'role-config': roleConfig
  },
  data() {
    // 验证密码
    return {
      isRouterAlive: true,
      screenFlag: true,
      locale: localStorage.getItem('locale'),
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      PermissionLogoManage: true,
      PermissionSessionManage: false,
      PermissionPwdReset: false,
      PermissionLock: false,
      PermissionEnable: false,
      PermissionActive: false,
      PermissionRoleSet: false,
      PermissionRoleManage: true,
      current_user: sessionStorage.getItem('userId'), //当前账号
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标
      showManyCondition: false, // 高级搜索点击显示与隐藏

      searchForm: {
        tenantName: '',
        account: ''
      },
      isSearch: false,

      startBtn: true, //批量启用
      stopBtn: true, //批量停用
      delShow: true, //批量删除
      changeBtn: true, //批量组织变更
      roleBtn: true,

      orgChangeShow: false, //组织变更

      operate: '',
      batchApi: '',
      multipleSelectionMany: [],
      batchDialogVisible: false, //批量操作对话框
      batchList: [],
      multipleSelection: [], //表格选中状态存放数组
      tableHeight: 616,
      tableData: [], // 表格数据
      dataText: '',
      uploadVisible: false, //上传logo对话框
      tenantId: '',
      loading: true,

      whiteListVisible: false, //配置白名单
      whiteList_Data: {},

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      organizationId: null,

      operation: false, // true:新增, false:修改
      dialogFormVisible: false, // 添加或者修改
      dataForm: {},
      maskLoading: false, // 点击提交按钮后蒙版

      downLoading: false,
      pageLoading: false, // 批量导入
      failDialog: false, //导入失败对话框
      failList: [], //导入失败列表

      tenantDetailVisible: false, //详情

      cuType: sessionStorage.getItem('cuType'),

      createVisible: false,
      sessionDate: null,
      sessionFlag: undefined,

      resetPwdVisible: false,
      currentTenantId: undefined,
      roleConfigVisible: false,
      placeholderTitle: this.$t('public.pleaseEnterOrg'),
      treeApi: 'getOrganizationTree',
      searchApi: 'searchInOrganizationTree',
      locateApi: 'locateInOrganizationTree'
    }
  },
  computed: {
    ...mapState({
      industryTypeList: state => state.dict['industry-type'] //应用类型
    })
  },
  async created() {
    await this.getPermissions()
  },
  mounted() {
    this.pageResize()
    this.getIndustry_type()
  },
  activated() {
    
    this.pageResize()
  },
  methods: {
    async getPermissions() {
      //用户权限判断
      this.PermissionInfo = await permissions(51)
      this.PermissionManage = await permissions(52)
      this.PermissionLogoManage = await permissions(54)
      this.PermissionRoleManage = await permissions(71)
      this.PermissionSessionManage = await permissions(75)
      this.PermissionPwdReset = await permissions(901) // 重置密码
      this.PermissionLock = await permissions(902) // 锁定、解锁
      this.PermissionEnable = await permissions(903) // 启用、停用
      this.PermissionActive = await permissions(904) // 冻结、激活
      this.PermissionRoleSet = await permissions(905) // 冻结、激活
    },
    pageResize() {
      this.judgeWindow(1816)
    },
    set_industryType(val) {
      if (val || val == 0) {
        this.industryTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }

      return val
    },
    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb.initBread(list)
      }, 100)
      this.getTenantList()
    },
    // 点击树节点
    treeNodeClick(obj) {
      // 点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
      this.organizationId = obj.data.payload.organizationId
      this.search_clear()
      this.handleFind()
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },

    // 加载租户列表!
    getTenantList() {
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
      this.$api.getTenantList(data).then(res => {
        if (res.tenantList && res.tenantList.length) {
          this.tableData = res.tenantList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
            let dropdowns = document.querySelectorAll('.operation-dropdown')
            if (dropdowns) {
              dropdowns.forEach(dropdown => {
                let dropdownMenu = dropdown.nextElementSibling
                if (dropdownMenu) {
                  if (!dropdownMenu.hasChildNodes()) {
                    dropdown.remove()
                  }
                }
              })
            }
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 534 : 616
    },
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    ...mapActions('dict', ['getSysDictData']),
    // 获取行业类型
    getIndustry_type() {
      this.getSysDictData(['industry-type'])
    },
    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          tenantName: '',
          account: ''
        }
      }
    },
    // 搜索!
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getTenantList()
    },

    // 添加！
    async handleAdd() {
      if (this.industryTypeList.length == 0) {
        await this.getIndustry_type()
      }
      this.dataForm = {
        organizationId: this.organizationId,
        tenantName: '',
        account: '',
        password: '',
        checkPass: '',
        industryType: '',
        mobile: '',
        remark: '',
        isValidityEnable: 0,
        beginTime: '',
        endTime: '',
        cloudMirrorPriority: 1
      }

      this.operation = true
      this.dialogFormVisible = true
    },

    // 下载模板
    getTemplate() {
      this.downLoading = true
      this.$api
        .getTenantTemplate({
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.templateFileUrl) {
            download(res.templateFileUrl, this.$t('tenantManage.tenantImportTemplate'))
          }
          this.downLoading = false
        })
    },
    batchImport(data) {
      this.batchList = data[0].results
      this.loading = true
      this.operate = this.$t('public.batchImportContent')
      this.batchApi = 'addTenantInfo'
      this.multipleSelectionMany = []
      if (this.batchList.length > 1000) {
        this.$message.warning(this.$t('deviceCamera.batchImportPrompt'))
        this.loading = false
        return
      }
      for (let i = 0; i < this.batchList.length; i++) {
        let obj = {
          organizationNames: this.batchList[i].organizationNames,
          tenantName: this.batchList[i].tenantName,
          account: this.batchList[i].account,
          password: this.batchList[i].password,
          industryType: this.batchList[i].industryType,
          mobile: this.batchList[i].mobile,
          remark: this.batchList[i].remark,
          maxSessionNum: this.batchList[i].maxSessionNum,
          cloudMirrorPriority: parseInt(this.batchList[i].cloudMirrorPriority),
          isValidityEnable:
            this.batchList[i].isValidityEnable === this.$t('dictConst.yes')
              ? 1
              : this.batchList[i].isValidityEnable === this.$t('dictConst.no')
              ? 0
              : undefined,
          beginTime: this.batchList[i].beginTime,
          endTime: this.batchList[i].endTime
        }
        this.multipleSelectionMany.push(obj)
      }
      this.batchDialogVisible = true
    },
    // 批量启用
    handelStart() {
      this.startOrStop(1, this.$t('public.batchEnableSuccess'))
    },
    // 批量停用
    handelStop() {
      this.startOrStop(0, this.$t('public.batchDeactivationSuccess'))
    },
    startOrStop(isEnabled, title) {
      this.loading = true
      let item = this.multipleSelection
      let tenantIds = []
      for (let i = 0; i < item.length; i++) {
        tenantIds.push(item[i].tenantId)
      }
      let data = {
        tenantIds,
        isEnabled
      }
      this.$api.enableTenant(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: title
          })
          this.search_clear()
          this.getTenantList()
          this.loading = false
          this.startBtn = true
          this.stopBtn = true
        }
      })
    },

    // 批量组织变更
    handelChange() {
      this.orgChangeShow = true
    },
    // 组织变更表单提交
    submitOrgChange(organizationId) {
      this.maskLoading = true
      let arr = []
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item = this.multipleSelection[index]
        arr.push({
          tenantId: item.tenantId,
          organizationId
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.bulkOrgChangeContent')
      this.batchApi = 'modifyTenantInfo'
      this.orgChangeShow = false
      this.batchDialogVisible = true
      this.maskLoading = false
    },

    // 批量删除
    handleDel() {
      this.$confirm(
        this.$t('tenantManage.cancelPrompt2', {
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
        .then(async () => {
          this.loading = true
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'deleteTenantInfo'
          this.isHasHandle = false
          this.multipleSelectionMany = []
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 表格列表选中
    handleSelectionChange(val) {
      let found = val.find(item => {
        return this.current_user == item.adminUserId
      })
      if (found) {
        this.startBtn = true
        this.stopBtn = true
        this.changeBtn = true
        this.delShow = true
        this.roleBtn = true
        this.$message.error(this.$t('public.selfOperateError'))
        return
      }
      this.multipleSelection = val

      // 判断选中的数据中isEnabled是否都为true,用于批量启用，批量停用
      var b = val.every(item => {
        return item.isEnabled == true
      })
      var c = val.every(item => {
        return item.isEnabled == false
      })
      // 如果数据不为空
      if (val.length) {
        // 状态都为true，可以批量启用
        if (b == true) {
          this.startBtn = true
          this.stopBtn = false
        }
        // 状态都为false，可以批量停用
        if (c == true) {
          this.startBtn = false
          this.stopBtn = true
        }
        // 状态有不是为false，则都不可以
        else if (b == false) {
          this.startBtn = true
          this.stopBtn = true
        }

        this.roleBtn = false
        this.changeBtn = false
        this.delShow = false
      }
      // 如果数据为空，都禁用状态
      else {
        this.startBtn = true
        this.stopBtn = true
        this.changeBtn = true
        this.delShow = true
        this.roleBtn = true
      }
    },

    //详情
    async handleInfo(row) {
      await this.getTenantInfo(row.tenantId, 0)
    },

    // 修改
    async handleEdit(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfEditError'))
        return
      }
      await this.getTenantInfo(row.tenantId, 1)
    },
    async getTenantInfo(tenantId, flag) {
      let res = await this.$api.getTenantInfo({ tenantId })
      if (res.resultCode != 0) return
      const info = res.tenantInfo
      this.dataForm = {
        organizationId: this.organizationId,
        tenantName: '',
        account: '',
        password: '',
        checkPass: '',
        industryType: '',
        mobile: '',
        remark: '',
        isValidityEnable: 0,
        beginTime: '',
        endTime: '',
        cloudMirrorPriority: 1
      }
      Object.assign(this.dataForm, {
        ...info
      })
      if (info.validityInfo && info.validityInfo.isValidityEnable == 1) {
        Object.assign(this.dataForm, {
          ...info.validityInfo
        })
      } else {
        Object.assign(this.dataForm, {
          isValidityEnable: 0,
          beginTime: '',
          endTime: ''
        })
      }
      // eslint-disable-next-line no-prototype-builtins
      this.dataForm.industryType = info.hasOwnProperty('industryType')
        ? info.industryType.toString()
        : null

      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.tenantDetailVisible = true
      }
    },
    // 删除租户！
    handleDelete(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfDelError'))
        return
      }
      this.$confirm(this.$t('tenantManage.cancelPrompt1'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteTenantInfo({ tenantId: row.tenantId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getTenantList()
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
    sessionManage(row) {
      this.createVisible = true
      this.sessionDate = row
      this.sessionFlag = 'tenant'
    },
    resetPwd(row) {
      this.resetPwdVisible = true
      this.currentTenantId = row.tenantId
    },
    handleConfigRole(row) {
      this.currentTenantId = row.tenantId || ''
      this.roleConfigVisible = true
    },
    // 批量设置角色
    handleSetRole(data) {
      this.loading = true
      let arr = []
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item = this.multipleSelection[index]
        arr.push({
          tenantId: item.tenantId,
          ...data
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.roleConfig')
      this.batchApi = 'setTenantRole'
      this.isHasHandle = false
      this.batchDialogVisible = true
    },
    // 解冻、激活
    thaw(row) {
      if (this.current_user == row.adminUserId) return
      this.$prompt(this.$t('public.pwdVerification'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        inputType: 'password',
        inputPlaceholder: this.$t('public.loginPwdPrompt'),
        inputPattern: /\S/,
        inputErrorMessage: this.$t('public.loginPwdPrompt'),
        closeOnClickModal: false
      })
        .then(({ value }) => {
          let isActive = row.isFreeze == 0 ? 1 : 0
          let data = {
            tenantId: row.tenantId,
            isActive,
            authPassword: value
          }
          this.$api.activeTenant(data).then(res => {
            if (res.resultCode === 0) {
              row.isFreeze = isActive
              this.$message({
                message: this.$t('public.operatingSuccessContent'),
                type: 'success'
              })
              this.$refs.multipleTable.clearSelection()
            }
          })
        })
        .catch(() => {})
    },
    handleCommand(command) {
      switch (command.command) {
        case 'a':
          this.handleDelete(command.row)
          break
        case 'b':
          if (command.row.isLocked == 2) {
            this.$message.warning(`${this.$t('public.editDate')}`)
          } else {
            this.handleLock(command.row)
          }
          break
        case 'c':
          this.handleIsEnabled(command.row)
          break
        case 'd':
          this.uplandLogoShow(command.row)
          break
        case 'e':
          this.whiteListShow(command.row)
          break
        case 'i':
          this.sessionManage(command.row)
          break
        case 'f':
          this.resetPwd(command.row)
          break
        case 'g':
          this.thaw(command.row)
          break
      }
    },
    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },

    // 是否锁定
    handleLock(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfLockError'))
        return
      }
      this.$prompt(this.$t('public.pwdVerification'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        inputType: 'password',
        inputPlaceholder: this.$t('public.loginPwdPrompt'),
        inputPattern: /\S/,
        inputErrorMessage: this.$t('public.loginPwdPrompt'),
        closeOnClickModal: false
      })
        .then(({ value }) => {
          let isLocked = row.isLocked == 0 ? 1 : 0
          let data = {
            tenantId: row.tenantId,
            isLocked,
            authPassword: value
          }
          this.$api.lockTenant(data).then(res => {
            if (res.resultCode === 0) {
              row.isLocked = isLocked
              this.$message({
                message: this.$t('public.operatingSuccessContent'),
                type: 'success'
              })
              this.$refs.multipleTable.clearSelection()
            }
          })
        })
        .catch(() => {})
    },

    // 是否停用
    handleIsEnabled(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfEnabledError'))
        return
      }
      let isEnabled = 0
      if (row.isEnabled == 0) {
        isEnabled = 1
      } else {
        isEnabled = 0
      }
      let data = {
        tenantIds: [row.tenantId],
        isEnabled: isEnabled
      }
      this.$api.enableTenant(data).then(res => {
        if (res.resultCode === 0) {
          row.isEnabled = isEnabled
          this.$message({
            message: this.$t('public.operatingSuccessContent'),
            type: 'success'
          })
          this.$refs.multipleTable.clearSelection()
        }
      })
    },
    // 上传logo
    uplandLogoShow(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfUploadLogoError'))
        return
      }
      this.uploadVisible = true
      this.tenantId = row.adminUserId
    },
    // 配置白名单
    whiteListShow(row) {
      if (this.current_user == row.adminUserId) {
        this.$message.error(this.$t('public.selfWhiteListError'))
        return
      }
      this.whiteList_Data = {
        userType: 1,
        contentId: row.tenantId,
        name: row.tenantName,
        account: row.account,
        labelName: this.$t('tenantManage.tenantName')
      }
      this.whiteListVisible = true
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getTenantList()
    }
  }
}
</script>

<style lang="scss">
#tenantManage {
  width: 100%;
  height: 100%;
  .flex-item {
    width: 42%;
  }
  .operate-btn {
    margin: 20px 0 14px;
    .el-button--small {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
    .batchImportBtn {
      margin: 0;
    }
  }
}
</style>
