<template>
  <!-- 用户管理 -->
  <div
    v-if="isRouterAlive"
    ref="userManage"
    id="user-manage"
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
        <div class="btnMargin">
          <div>
            <el-button v-if="PermissionManage" type="primary" @click="handleAdd">
              {{ $t('userManage.addUser') }}
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
              v-if="PermissionManage"
              type="primary"
              @click="exportExcelModalVisible = true"
            >
              {{ $t('public.batchExport') }}
            </el-button>

            <el-button
              v-if="PermissionEnable"
              type="primary"
              :disabled="startBtn"
              @click="handelStart"
            >
              {{ $t('public.batchEnable') }}
            </el-button>
            <el-button
              v-if="PermissionEnable"
              type="primary"
              :disabled="stopBtn"
              @click="handelStop"
            >
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
          </div>
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
                :label="$t('userManage.userName') + ' ：'"
                prop="userName"
                class="flex-item"
              >
                <el-input
                  v-model="searchForm.userName"
                  auto-complete="off"
                  :placeholder="$t('userManage.namePrompt')"
                  clearable
                  class="inputMiddle inputAuto"
                  @change="search_change"
                />
              </el-form-item>

              <el-form-item
                :label="$t('userManage.accountLabel') + ' ：'"
                prop="account"
                class="flex-item"
              >
                <el-input
                  v-model="searchForm.account"
                  auto-complete="off"
                  :placeholder="$t('userManage.accountPrompt')"
                  class="inputAuto"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <div class="search-btn">
                <el-button type="primary" class="miniBtn" @click="handleFind">
                  {{ $t('public.search') }}
                </el-button>
              </div>
            </div>
          </el-form>
        </div>

        <div class="btnMargin1">
          <!-- //面包屑 -->
          <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
        </div>

        <no-table :tableLoading="loading" :tableData="tableData">
          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column align="center" label width="50" type="selection" />
            <el-table-column show-overflow-tooltip :label="$t('public.account')" min-width="80">
              <template #default="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('userManage.userName')"
              min-width="80"
            >
              <template #default="{ row }">
                <span>{{ row.userName }}</span>
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

            <el-table-column show-overflow-tooltip :label="$t('public.role')" min-width="110">
              <template #default="{ row }">
                <span>{{ row.roleNames || $t('public.notAllocated') }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('public.AffiliatedOrg')"
              :min-width="locale == 'en' ? 140 : 80"
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

            <el-table-column
              :label="$t('public.operating')"
              :min-width="locale == 'en' ? 200 : 120"
            >
              <template #default="{ row }">
                <span v-if="PermissionInfo" class="cell-operate" @click="handleInfo(row)">
                  {{ $t('public.particulars') }}
                </span>

                <span
                  v-if="PermissionManage && row.userId != current_user"
                  class="cell-operate"
                  @click="handleEdit(row)"
                >
                  {{ $t('public.modify') }}
                </span>

                <span
                  @click="handleConfigRole(row)"
                  class="cell-operate"
                  v-if="PermissionRoleSet && row.userId != current_user"
                >
                  {{ $t('public.roleConfig') }}
                </span>

                <el-dropdown
                  v-if="row.userId != current_user"
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

    <!-- 详情对话框 -->
    <user-detail />

    <!-- 上传logo -->
    <logo-upload v-model:visible="uploadVisible" :tenantId="userId" />

    <!-- 批量组织变更 -->
    <org-change @orgChangeSubmit="submitOrgChange" />

    <!-- 批量导入失败 -->
    <import-fail-list />

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
      :what="$t('userManage.user')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="userId"
      whatName="userName"
      :multipleSelectionMany="multipleSelectionMany"
      v-model:loading="loading"
      @searchClear="search_clear"
      @getList="userList"
    />

    <reset-pwd
      v-if="PermissionPwdReset"
      v-model:visible="resetPwdVisible"
      :userId="currentUserId"
      :type="0"
    />

    <role-config
      v-if="PermissionRoleSet"
      v-model:visible="roleConfigVisible"
      :userId="currentUserId"
      :type="0"
      @success="handleSetRole"
    />

    <ExportExcelModal
      :title="$t('userManage.exportUserInfo')"
      v-model:visible="exportExcelModalVisible"
      :loadOption="exportExcelLoadFunc"
      :customErrorColumn="exportExcelErrorColumns"
    ></ExportExcelModal>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import logoUpload from '@/views/common/component/userLogo-upload'
import whiteList from '@/views/common/component/white-list'
import orgChange from '@/views/common/component/org-change'
import importFailList from '@/views/common/component/import-fail-list'
import addInfo from './component/addInfo'
import userDetail from './component/userDetail'
import breadcrumb from '@/components/breadcrumb' //面包屑
import batchOperate from '@/components/batchOperate' //批量操作
import sessionManage from '@/components/session-manage' //会话管理
import resetPwd from '@/components/reset-pwd'
import roleConfig from '@/components/role-config.vue'
import Excel from '@/components/excel/importExcel'
import { Desensitized } from '@/utils/common/desensitization'
import { ExportExcelModal } from '@/components/batch'
import LazySearchTree from '@/components/lazy-search-tree'

export default {
  name: 'UserManagement',
  components: {
    'logo-upload': logoUpload,
    'white-list': whiteList,
    'org-change': orgChange,
    'add-info': addInfo,
    'session-manage': sessionManage,
    'import-fail-list': importFailList,
    'user-detail': userDetail,
    LazySearchTree,
    breadcrumb,
    'batch-operate': batchOperate,
    Excel,
    'reset-pwd': resetPwd,
    'role-config': roleConfig,
    ExportExcelModal
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      userDetailVisible: false,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      PermissionLogoManage: true,
      PermissionRoleManage: true,
      PermissionSessionManage: false,
      PermissionPwdReset: false,
      PermissionLock: false,
      PermissionEnable: false,
      PermissionActive: false,
      PermissionRoleSet: false,

      current_user: sessionStorage.getItem('userId'), //当前账号

      // 条件搜索
      searchForm: {
        userName: '',
        account: ''
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
      batchList: [],
      multipleSelection: [], //表格选中状态存放数组
      loading: true,
      tableData: [], // 表格数据
      dataText: '',
      uploadVisible: false, //上传logo对话框

      whiteListVisible: false, //配置白名单
      whiteList_Data: {},
      userId: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      organizationId: null, //默认查询组织为0

      operation: false, // true:新增, false:编辑
      dialogFormVisible: false, // 添加或者编辑
      dataForm: {}, // 添加修改框表单
      maskLoading: false, // 点击提交按钮后蒙版

      orgChangeShow: false, //组织变更

      downLoading: false,
      pageLoading: false, // 批量导入
      failDialog: false, //导入失败对话框
      failList: [], //导入失败列表

      createVisible: false,
      sessionDate: null,
      sessionFlag: undefined,

      resetPwdVisible: false,
      currentUserId: undefined,
      roleConfigVisible: false,
      desensitized: Desensitized,
      exportExcelModalVisible: false,
      exportExcelErrorColumns: [
        {
          prop: 'userId',
          label: this.$t('userManage.userId'),
          minWidth: '130'
        },
        {
          prop: 'userName',
          label: this.$t('userManage.userName'),
          minWidth: '100'
        }
      ],
      placeholderTitle: this.$t('public.pleaseEnterOrg'),
      treeApi: 'getOrganizationTree',
      searchApi: 'searchInOrganizationTree',
      locateApi: 'locateInOrganizationTree'
    }
  },

  async created() {
    await this.getPermissions()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(61)
      this.PermissionManage = await permissions(62)
      this.PermissionLogoManage = await permissions(60)
      this.PermissionRoleManage = await permissions(71)
      this.PermissionSessionManage = await permissions(67)
      this.PermissionPwdReset = await permissions(911) // 重置密码
      this.PermissionLock = await permissions(912) // 锁定、解锁
      this.PermissionEnable = await permissions(913) // 启用、停用
      this.PermissionActive = await permissions(914) // 冻结、激活
      this.PermissionRoleSet = await permissions(915) // 角色设置
    },

    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb.initBread(list)
      }, 100)
      this.userList()
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

    // 加载用户列表!
    userList() {
      this.dataText = ''
      this.loading = true
      const data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId
      }
      if (this.isSearch) {
        data.userName = this.searchForm.userName ? this.searchForm.userName : undefined
        data.account = this.searchForm.account ? this.searchForm.account : undefined
      }
      this.$api.getUserList(data).then(res => {
        if (res.userList && res.userList.length) {
          this.tableData = res.userList
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

    // 添加!
    async handleAdd() {
      this.dataForm = {
        organizationId: this.organizationId,
        userName: '',
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

    // 下载模板
    getTemplate() {
      this.downLoading = true
      this.$api
        .getUserTemplate({
          tenantId: this.$route.query.tenantId,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.templateFileUrl) {
            download(res.templateFileUrl, this.$t('userManage.userImportTemplate'))
          }
          this.downLoading = false
        })
    },
    batchImport(data) {
      this.batchList = data[0].results
      this.loading = true
      this.operate = this.$t('public.batchImportContent')
      this.batchApi = 'addUserInfo'
      this.multipleSelectionMany = []
      if (this.batchList.length > 1000) {
        this.$message.warning(this.$t('deviceCamera.batchImportPrompt'))
        this.loading = false
        return
      }
      for (let i = 0; i < this.batchList.length; i++) {
        let obj = {
          userName: this.batchList[i].userName,
          organizationNames: this.batchList[i].organizationNames,
          account: this.batchList[i].account,
          password: this.batchList[i].password,
          mobile: this.batchList[i].mobile,
          remark: this.batchList[i].remark,
          maxSessionNum: this.batchList[i].maxSessionNum,
          isValidityEnable:
            ['是', 'yes'].indexOf(this.batchList[i].isValidityEnable) > -1
              ? 1
              : ['否', 'no'].indexOf(this.batchList[i].isValidityEnable) > -1
              ? 0
              : undefined,
          beginTime: this.batchList[i].beginTime,
          endTime: this.batchList[i].endTime,
          cloudMirrorPriority: parseInt(this.batchList[i].cloudMirrorPriority)
        }
        this.multipleSelectionMany.push(obj)
      }
      this.batchDialogVisible = true
    },
    exportExcelLoadFunc() {
      const normalizeExportData = (data, listData) => {
        return data.map(item => {
          let {
            userId,
            userName,
            account,
            mobile,
            isEnabled,
            isLocked,
            isFreeze,
            remark,
            cloudMirrorPriority,
            maxSessionNum,
            createTime,
            updateTime,
            organizationName,
            roleNames: roleName
          } = item
          let { isValidityEnable, beginTime, endTime } = item.validityInfo
          isValidityEnable = isValidityEnable
            ? this.$t('alarmTypeManage.yes')
            : this.$t('alarmTypeManage.no')
          let stateArr = []
          if (isEnabled == 1 && isLocked == 0 && isFreeze == 1) {
            stateArr.push(this.$t('public.normal'))
          }
          if (isEnabled == 0) {
            stateArr.push(this.$t('public.deactivate'))
          }
          if (isLocked == 1) {
            stateArr.push(this.$t('public.ManualLock'))
          } else if (isLocked == 2) {
            stateArr.push(this.$t('public.overdueLock'))
          } else if (isLocked == 3) {
            stateArr.push(this.$t('public.attackLock'))
          }
          if (isFreeze == 0) {
            stateArr.push(this.$t('public.freeze'))
          }

          remark = remark == undefined ? '' : remark
          createTime = createTime == undefined ? '' : createTime
          updateTime = updateTime == undefined ? '' : updateTime
          return {
            userId,
            userName,
            organizationName,
            roleName,
            account,
            mobile: this.desensitized.desensitizedPhone(mobile),
            state: stateArr.join(' '),
            remark,
            createTime,
            updateTime,
            cloudMirrorPriority,
            maxSessionNum,
            isValidityEnable,
            beginTime,
            endTime
          }
        })
      }
      return {
        listFn: this.$api.exportUserList,
        listFnParam: {
          pageInfo: {
            pageNum: 1,
            pageSize: 500
          },
          organizationId: this.organizationId
        },
        listFnResAttrName: 'userList',
        filename: this.$t('userManage.userInfo'),
        bookType: 'xlsx',
        header: {
          userId: this.$t('userManage.userId'),
          userName: this.$t('userManage.userName'),
          account: this.$t('public.account'),
          state: this.$t('public.state'),
          roleName: this.$t('public.role'),
          organizationName: this.$t('public.AffiliatedOrg'),
          cloudMirrorPriority: this.$t('userManage.PTZControlPriority'),
          mobile: this.$t('public.phone'),
          remark: this.$t('public.remark'),
          maxSessionNum: this.$t('session.maxSessionNum'),
          isValidityEnable: this.$t('public.enableAccountValidity'),
          beginTime: this.$t('public.validityBeginTime'),
          endTime: this.$t('public.validityEndTime'),
          createTime: this.$t('public.createTime'),
          updateTime: this.$t('public.updateTime')
        },
        dataNormalizeFn: normalizeExportData
      }
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
      let userIds = []
      for (let i = 0; i < item.length; i++) {
        userIds.push(item[i].userId)
      }
      let data = {
        userIds,
        isEnabled
      }
      this.$api.enableUser(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: title
          })

          this.search_clear()
          this.userList()
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
          userId: item.userId,
          organizationId
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.bulkOrgChangeContent')
      this.batchApi = 'modifyUserInfo'
      this.orgChangeShow = false
      this.batchDialogVisible = true
      this.maskLoading = false
    },

    // 批量删除!
    handleDel() {
      this.$confirm(
        this.$t('userManage.cancelPrompt2', {
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
          this.batchApi = 'deleteUserInfo'
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

    // 表格列表选中!
    handleSelectionChange(val) {
      let found = val.find(item => {
        return this.current_user == item.userId
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
    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm.userName = ''
        this.searchForm.account = ''
      }
    },
    // 搜索!
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.userList()
    },

    // 详情!
    async handleInfo(row) {
      await this.getUserInfo(row.userId, 0)
    },

    // 修改!
    async handleEdit(row) {
      if (!this.accountJudge(row)) return
      await this.getUserInfo(row.userId, 1)
    },
    async getUserInfo(userId, flag) {
      let res = await this.$api.getUserInfo({
        userId,
        netType: this.$getNetType()
      })
      if (res.resultCode != 0) return
      const info = res.userInfo
      this.dataForm = {
        organizationId: this.organizationId,
        userName: '',
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
        this.userDetailVisible = true
      }
    },
    // 删除用户
    handleDelete(row) {
      if (!this.accountJudge(row)) return
      this.$confirm(this.$t('userManage.cancelPrompt1'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteUserInfo({ userId: row.userId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.userList()
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
      this.sessionFlag = 'user'
    },
    resetPwd(row) {
      this.resetPwdVisible = true
      this.currentUserId = row.userId
    },
    handleConfigRole(row) {
      this.currentUserId = row.userId || ''
      this.roleConfigVisible = true
    },
    // 批量设置角色
    handleSetRole(data) {
      this.loading = true
      let arr = []
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item = this.multipleSelection[index]
        arr.push({
          userId: item.userId,
          ...data
        })
      }
      this.multipleSelectionMany = arr
      this.operate = this.$t('public.roleConfig')
      this.batchApi = 'setUserRole'
      this.batchDialogVisible = true
    },
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
            userId: row.userId,
            isActive,
            authPassword: value
          }
          this.$api.activeUser(data).then(res => {
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
        case 'i':
          this.uplandLogoShow(command.row)
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
            userId: row.userId,
            isLocked,
            authPassword: value
          }
          this.$api.lockUser(data).then(res => {
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
      if (!this.accountJudge(row)) return

      let isEnabled = 0
      isEnabled = row.isEnabled == 0 ? 1 : 0

      let data = {
        userIds: [row.userId],
        isEnabled: isEnabled
      }
      this.$api.enableUser(data).then(res => {
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
      if (this.current_user == row.userId) {
        this.$message.error(this.$t('public.selfUploadLogoError'))
        return
      }
      this.uploadVisible = true
      this.userId = row.userId
    },
    // 配置白名单
    whiteListShow(row) {
      if (!this.accountJudge(row)) return

      this.whiteList_Data = {
        userType: 3,
        contentId: row.userId,
        name: row.userName,
        account: row.account,
        labelName: this.$t('userManage.userName')
      }
      this.whiteListVisible = true
    },
    // 判断账号是否为自身
    accountJudge(row) {
      if (this.current_user == row.userId) {
        this.$message.error(this.$t('public.selfEnabledError'))
        return false
      } else {
        return true
      }
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.userList()
    }
  }
}
</script>

<style lang="scss">
#user-manage {
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
  .btnMargin1 {
    display: flex;
    justify-content: space-between;
    .el-icon-setting {
      font-size: 16px;
    }
  }
  .search-form {
    .el-input__wrapper {
      position: relative;

      .el-input__inner {
        padding-right: 18px;
      }
      .el-input__suffix {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
