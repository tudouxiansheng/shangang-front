<template>
  <!-- 管理员管理 -->
  <div v-if="isRouterAlive" ref="adminManage" id="admin-manage">
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
        <div class="operate-container">
          <div v-if="PermissionManage" class="operate-btn">
            <el-button type="primary" @click="handleAdd" :disabled="isDisabled">
              {{ $t('adminManage.addAdmin') }}
            </el-button>

            <el-button
              v-if="PermissionEnable"
              type="primary"
              :disabled="startBtn || selectPreSet || isDisabled"
              @click="handelStart"
            >
              {{ $t('public.batchEnable') }}
            </el-button>
            <el-button
              v-if="PermissionEnable"
              type="primary"
              :disabled="stopBtn || selectPreSet || isDisabled"
              @click="handelStop"
            >
              {{ $t('public.batchDeactivation') }}
            </el-button>
            <el-button
              v-if="PermissionRoleSet"
              type="primary"
              :disabled="roleBtn || selectPreSet || isDisabled"
              @click="handleConfigRole"
            >
              {{ $t('public.batchRoleConfig') }}
            </el-button>
            <el-button
              v-if="PermissionManage"
              type="danger"
              :disabled="delShow || selectPreSet || isDisabled"
              @click="handleDel"
            >
              {{ $t('public.batchDeletion') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="searchForm.adminName"
              auto-complete="off"
              :placeholder="$t('adminManage.namePrompt')"
              clearable
              :style="locale == 'en' ? { width: '230px' } : { width: '200px' }"
              maxlength="128"
              class="inputMiddle"
              @change="search_change"
            />

            <el-button type="primary" class="miniBtn" @click="handleFind">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
        <no-table :tableLoading="loading" :tableData="tableData">
          <!-- 表格 -->
          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            ref="multipleTable"
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              align="center"
              label
              :selectable="checkSelectable"
              width="50"
              type="selection"
            />
            <el-table-column show-overflow-tooltip :label="$t('public.account')" min-width="80">
              <template #default="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('adminManage.adminName')"
              min-width="100"
            >
              <template #default="{ row }">
                <span>{{ row.adminName }}</span>
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
              show-overflow-tooltip
              :label="$t('public.AffiliatedOrg')"
              min-width="110"
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
                <template
                  v-if="
                    ((row.organizationId != orgId || createBy == preSetId) && userType === 2) ||
                    userType === 1
                  "
                >
                  <span
                    v-if="
                      PermissionManage && row.userId !== current_user && row.createBy !== preSetId
                    "
                    class="cell-operate"
                    @click="handleEdit(row)"
                  >
                    {{ $t('public.modify') }}
                  </span>

                  <span
                    v-if="
                      PermissionRoleSet && row.userId != current_user && row.createBy !== preSetId
                    "
                    class="cell-operate"
                    @click="handleConfigRole(row)"
                  >
                    {{ $t('public.roleConfig') }}
                  </span>

                  <el-dropdown
                    v-if="
                      row.userId != current_user &&
                      row.createBy !== preSetId &&
                      (PermissionManage ||
                        PermissionLock ||
                        PermissionEnable ||
                        PermissionActive ||
                        PermissionPwdReset ||
                        PermissionSessionManage)
                    "
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
                          <span class="danger">{{ $t('public.delete') }}</span>
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
                          v-if="PermissionManage"
                          :command="beforeHandleCommand(row, 'd')"
                        >
                          <span class="blue">{{ $t('public.configureWhiteList') }}</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
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

    <!-- 详情弹框 -->
    <admin-detail />

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
      :multipleSelection="multipleSelection"
      :what="$t('batchOperator.admin')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="adminId"
      whatName="adminName"
      :multipleSelectionMany="multipleSelectionMany"
      v-model:loading="loading"
      @searchClear="search_clear"
      @getList="getAdminList"
    />

    <reset-pwd
      v-if="PermissionPwdReset"
      v-model:visible="resetPwdVisible"
      :userId="currentAdminId"
      :type="1"
    />

    <role-config
      v-if="PermissionRoleSet"
      v-model:visible="roleConfigVisible"
      :userId="currentAdminId"
      :type="1"
      @success="handleSetRole"
    />
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import whiteList from '../component/white-list'
import orgChange from '@/views/common/component/org-change'
import addInfo from './component/addInfo'
import adminDetail from './component/adminDetail'
import breadcrumb from '@/components/breadcrumb' //面包屑
import batchOperate from '@/components/batchOperate' //批量操作
import sessionManage from '@/components/session-manage' //会话管理
import resetPwd from '@/components/reset-pwd'
import roleConfig from '@/components/role-config'
import LazySearchTree from '@/components/lazy-search-tree'

export default {
  name: 'AdministratorManagement',
  components: {
    'white-list': whiteList,
    'org-change': orgChange,
    'add-info': addInfo,
    'admin-detail': adminDetail,
    LazySearchTree,
    breadcrumb,
    'batch-operate': batchOperate,
    'session-manage': sessionManage,
    'reset-pwd': resetPwd,
    'role-config': roleConfig
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,

      //用户权限判断
      PermissionInfo: false,
      PermissionManage: false,
      PermissionRoleManage: true,
      PermissionSessionManage: false,
      PermissionPwdReset: false,
      PermissionLock: false,
      PermissionEnable: false,
      PermissionActive: false,
      PermissionRoleSet: false,
      current_user: sessionStorage.getItem('userId'), //当前账号userId

      // 条件搜索
      searchForm: {
        adminName: ''
      },
      isSearch: false,

      startBtn: true, //批量启用
      stopBtn: true, //批量停用
      delShow: true, //批量删除
      changeBtn: true, //批量组织变更
      roleBtn: true,

      operate: '',
      batchApi: '',
      multipleSelectionMany: [],
      batchDialogVisible: false, //批量操作对话框

      multipleSelection: [], //表格选中状态存放数组
      loading: true,
      tableData: [], // 表格数据
      dataText: '',

      whiteListVisible: false, //配置白名单
      whiteList_Data: {},

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      organizationId: null,

      operation: false, // true:添加, false:修改
      dialogFormVisible: false, // 添加或者修改
      dataForm: {}, // 添加修改框表单
      adminDetailVisible: false, //详情
      maskLoading: false, // 点击提交按钮后蒙版

      orgChangeShow: false, //组织变更
      orgChangeId: null, //组织变更

      batchDelDialogVisible: false, //批量删除对话框
      batchDelErrorList: [], //批量删除列表
      deletedSuccNum: 0, //删除成功的数量
      choosedNum: 0, //总共要删除的数量
      preSetId: '00000000000000000201009999999999',
      createBy: this.$store.state.user.userInfo.createBy,
      userType: this.$store.state.user.userInfo.userType,
      orgId: this.$store.state.user.userInfo.organizationId,
      createVisible: false,
      sessionDate: null,
      sessionFlag: undefined,
      resetPwdVisible: false,
      currentAdminId: undefined,
      roleConfigVisible: false,
      placeholderTitle: this.$t('public.pleaseEnterOrg'),
      treeApi: 'getOrganizationTree',
      searchApi: 'searchInOrganizationTree',
      locateApi: 'locateInOrganizationTree'
    }
  },

  async created() {
    await this.getPermissions()
  },
  mounted() {
    this.$nextTick(() => {
      const userInfo = this.$store.state.user.userInfo
      this.orgId = userInfo.organizationId
      this.createBy = userInfo.createBy
    })
  },
  computed: {
    selectPreSet() {
      return this.multipleSelection.some(item => item.createBy === this.preSetId)
    },
    isDisabled() {
      let isFlag = false
      const userInfo = this.$store.state.user.userInfo
      let { organizationId, createBy, userType } = userInfo
      if (organizationId != this.organizationId) {
        isFlag = false
      } else if (createBy != this.preSetId && userType == 2) {
        isFlag = true
      } else {
        isFlag = false
      }
      return isFlag
    }
  },
  methods: {
    async getPermissions() {
      //用户权限判断
      this.PermissionInfo = await permissions(65) // 管理员查看
      this.PermissionManage = await permissions(66) // 管理员管理
      this.PermissionRoleManage = await permissions(71) // 角色管理
      this.PermissionSessionManage = await permissions(69) // 会话管理
      this.PermissionPwdReset = await permissions(906) // 重置密码
      this.PermissionLock = await permissions(907) // 锁定、解锁
      this.PermissionEnable = await permissions(908) // 启用、停用
      this.PermissionActive = await permissions(909) // 冻结、激活
      this.PermissionRoleSet = await permissions(910) // 角色设置
    },
    checkSelectable(row) {
      if (row.account == 'secadmin' || row.account == 'secauditor' || row.account == 'sysadmin') {
        return false
      } else {
        return true
      }
    },
    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb.initBread(list)
      }, 100)
      this.getAdminList()
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
    // 加载管理员列表!
    getAdminList() {
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
      this.$api.getAdminList(data).then(res => {
        if (res.adminList && res.adminList.length) {
          this.tableData = res.adminList
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
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm.adminName = ''
      }
    },
    // 搜索!
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getAdminList()
    },

    // 添加!
    async handleAdd() {
      this.dataForm = {
        organizationId: this.organizationId,
        adminName: '',
        account: '',
        password: '',
        checkPass: '',
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
      let adminIds = []
      for (let i = 0; i < item.length; i++) {
        adminIds.push(item[i].adminId)
      }
      let data = {
        adminIds,
        isEnabled
      }
      this.$api.enableAdmin(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: title
          })
          this.search_clear()
          this.getAdminList()
          this.loading = false
          this.startBtn = true
          this.stopBtn = true
        }
      })
    },

    // 表格列表选中
    handleSelectionChange(val) {
      let found = val.find(item => {
        return this.current_user === item.userId
      })
      if (found) {
        this.startBtn = true
        this.stopBtn = true
        this.changeBtn = true
        this.delShow = true
        this.roleBtn = true
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
      if (val.length != 0) {
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

    // 批量组织变更！
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
          adminId: item.adminId,
          organizationId
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.bulkOrgChangeContent')
      this.batchApi = 'modifyAdminInfo'
      this.orgChangeShow = false
      this.batchDialogVisible = true
      this.maskLoading = false
    },

    // 批量删除
    handleDel() {
      this.$confirm(
        this.$t('adminManage.cancelPrompt2', {
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
          this.batchApi = 'deleteAdminInfo'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 详情
    async handleInfo(row) {
      await this.getAdminInfo(row.adminId, 0)
    },

    // 修改
    async handleEdit(row) {
      if (!this.accountJudge(row)) return

      //判断是否有角色权限来修改
      if (!this.PermissionRoleManage) {
        this.$message({
          message:
            this.$t('public.noRolePermission') +
            ',' +
            this.$t('public.cannotModfiy') +
            this.$t('batchOperator.admin'),
          type: 'error'
        })
        return
      }

      await this.getAdminInfo(row.adminId, 1)
    },
    async getAdminInfo(adminId, flag) {
      let res = await this.$api.getAdminInfo({
        adminId,
        netType: this.$getNetType()
      })
      if (res.resultCode != 0) return
      const info = res.adminInfo
      this.dataForm = {
        organizationId: this.organizationId,
        adminName: '',
        account: '',
        password: '',
        checkPass: '',
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
      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.adminDetailVisible = true
      }
    },
    // 删除!
    handleDelete(row) {
      if (!this.accountJudge(row)) return

      this.$confirm(this.$t('adminManage.cancelPrompt1'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteAdminInfo({ adminId: row.adminId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getAdminList()
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
      this.sessionFlag = 'admin'
    },
    resetPwd(row) {
      this.resetPwdVisible = true
      this.currentAdminId = row.adminId
    },
    handleConfigRole(row) {
      this.currentAdminId = row.adminId || ''
      this.roleConfigVisible = true
    },
    // 批量设置角色
    handleSetRole(data) {
      this.loading = true
      let arr = []
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item = this.multipleSelection[index]
        arr.push({
          adminId: item.adminId,
          ...data
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.roleConfigContent')
      this.batchApi = 'setAdminRole'
      this.isHasHandle = false
      this.batchDialogVisible = true
    },
    // 解冻、激活
    thaw(row) {
      if (!this.accountJudge(row)) return
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
            adminId: row.adminId,
            isActive,
            authPassword: value
          }
          this.$api.activeAdmin(data).then(res => {
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
          this.handleEnabled(command.row)
          break
        case 'd':
          this.whiteListShow(command.row)
          break
        case 'e':
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

    // 是否锁定!
    handleLock(row) {
      if (!this.accountJudge(row)) return
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
            adminId: row.adminId,
            isLocked,
            authPassword: value
          }
          this.$api.lockAdmin(data).then(res => {
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
    handleEnabled(row) {
      if (!this.accountJudge(row)) return
      let isEnabled = 0
      isEnabled = row.isEnabled == 0 ? 1 : 0

      let data = {
        adminIds: [row.adminId],
        isEnabled
      }
      this.$api.enableAdmin(data).then(res => {
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

    // 配置白名单
    whiteListShow(row) {
      if (!this.accountJudge(row)) return

      this.whiteList_Data = {
        userType: 2,
        contentId: row.userId,
        name: row.adminName,
        account: row.account,
        labelName: this.$t('adminManage.adminName')
      }
      this.whiteListVisible = true
    },

    // 判断账号是否为自身
    accountJudge(row) {
      if (this.current_user === row.userId) {
        this.$message.error(this.$t('public.selfOperateError'))
        return false
      } else {
        return true
      }
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getAdminList()
    }
  }
}
</script>

<style lang="scss">
#admin-manage {
  width: 100%;
  height: 100%;
  .operate-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 20px 0 14px;
    .operate-btn {
      flex: 1;
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
}
</style>
