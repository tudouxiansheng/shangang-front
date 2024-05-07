<template>
  <!-- 业务管理角色 -->
  <div id="roleManager" v-if="isRouterAlive" ref="roleManager">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div class="btnMargin">
          <div v-if="PermissionManage">
            <el-button type="primary" @click="handleAdd">
              {{ $t('roleManage.addRole') }}
            </el-button>
            <el-button
              v-if="PermissionManage"
              type="danger"
              :disabled="delShow || selectPreSet"
              @click="handleDel"
            >
              {{ $t('public.batchDeletion') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="searchForm.roleName"
              auto-complete="off"
              :placeholder="$t('roleManage.namePrompt')"
              clearable
              :style="locale == 'en' ? { width: '215px' } : { width: '200px' }"
              maxlength="128"
              class="inputMiddle"
            />

            <el-button type="primary" class="miniBtn" @click="handleFind">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>
        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />

            <el-table-column
              :label="$t('roleManage.roleName')"
              prop="roleName"
              min-width="80"
              show-overflow-tooltip
            />

            <el-table-column
              :label="$t('roleManage.roleDesc')"
              prop="roleDesc"
              min-width="110"
              show-overflow-tooltip
            />

            <el-table-column
              :label="$t('public.createTime')"
              prop="createTime"
              min-width="110"
              show-overflow-tooltip
            />

            <el-table-column
              :label="$t('public.updateTime')"
              prop="updateTime"
              min-width="110"
              show-overflow-tooltip
            />

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span v-if="PermissionInfo" class="cell-operate" @click="handleDetail(row)">
                  {{ $t('public.particulars') }}
                </span>

                <span
                  v-if="PermissionManage && row.createBy != preSetId"
                  class="cell-operate"
                  @click="handleEdit(row)"
                >
                  {{ $t('public.modify') }}
                </span>
                <span
                  v-if="PermissionManage && row.createBy != preSetId"
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                >
                  {{ $t('public.delete') }}
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

    <!-- 添加修改对话框 -->
    <role-add />
    <!-- 详情对话框 -->
    <role-detail />

    <!-- 批量操作 -->
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="multipleSelection"
      :what="$t('batchOperator.role')"
      whatId="roleId"
      whatName="roleName"
      :operate="operate"
      :batchApi="batchApi"
      v-model:loading="loading"
      @getList="handleFind"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { lStorage, sStorage } from '@/utils/common/store'
import { flapTree } from '@/utils/common/utils.js'
import roleAdd from './component/role-add' //添加修改对话框
import roleDetail from './component/role-detail' //详情
import batchOperate from '@/components/batchOperate' //批量操作
export default {
  name: 'RoleManagement',
  components: {
    'role-add': roleAdd,
    'role-detail': roleDetail,
    'batch-operate': batchOperate
  },
  data() {
    return {
      locale: lStorage.get('locale') || 'zh',
      isRouterAlive: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      // 条件搜索
      searchForm: {
        roleName: ''
      },
      delShow: true, //批量删除
      operate: '',
      batchApi: '',
      batchDialogVisible: false, //批量操作对话框
      multipleSelection: [], //表格选中状态存放数组

      // 表格数据
      tableData: [],
      dataText: '',
      loading: true,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: false, // true:新增, false:修改
      dialogFormVisible: false, // 添加或者修改
      dataForm: {},
      detailVisible: false, //详情
      canModify: 1, //角色是否可以修改
      permCheckList4: [], // 权限码选中列表
      permCheckList1: [], // 权限码选中列表
      permCheckList7: [], // 权限码选中列表
      permDisableList4: [], // 权限码选中列表
      permDisableList1: [], // 权限码选中列表
      permDisableList7: [], // 权限码选中列表
      menuList: [],
      permList4: [],
      permList1: [],
      permList7: [],
      codeArr4: [],
      codeArr1: [],
      codeArr7: [],
      preSetId: '00000000000000000201009999999999',
      belongTenantId: sStorage.get('belongTenantId')
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    // 获取角色列表
    this.getRoleList()
  },
  activated() {
    
  },
  computed: {
    selectPreSet() {
      return this.multipleSelection.some(item => item.createBy == this.preSetId)
    }
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(71)
      this.PermissionManage = await permissions(72)
    },
    // 获取角色列表
    getRoleList() {
      this.dataText = ''
      this.loading = true
      // 请求
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        roleName: this.searchForm.roleName,
        tenantId: this.$route.query.tenantId // 如果是下级租户
      }

      this.$api.selectRoles(data).then(res => {
        if (res && res.roleList) {
          this.tableData = res.roleList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            // this.$refs.multipleTable?.setScrollTop(0)
            this.$refs.multipleTable?.setScrollTop(0)
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 添加使用角色
    handleAdd() {
      // 还原表单内容
      this.dataForm = {
        roleName: '',
        roleDesc: '',
        roleType: 1,
        permList: []
      }
      this.canModify = 1
      this.operation = true
      this.dialogFormVisible = true
    },

    // 批量删除
    handleDel() {
      this.$confirm(
        this.$t('roleManage.cancelPrompt2', {
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

          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'deleteRoleInfo'
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
      this.multipleSelection = val

      if (this.multipleSelection.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getRoleList()
    },

    // 详情
    async handleDetail(row) {
      this.getRoleDetail(row.roleId, 1)
    },

    // 修改
    async handleEdit(row) {
      this.getRoleDetail(row.roleId, 2)
    },
    handleCopy(row) {
      this.getRoleDetail(row.roleId, 3)
    },
    async getRoleDetail(roleId, flag) {
      const res = await this.$api.getRoleInfo({ roleId })
      if (res.resultCode != 0) return
      this.dataForm = {
        roleName: '',
        roleDesc: '',
        roleType: 1,
        permList: []
      }
      Object.assign(this.dataForm, {
        ...res.roleInfo
      })
      this.canModify = res.roleInfo ? res.roleInfo.canModify : 1
      let permList = res.roleInfo?.permList || [] //选中的权限菜单
      this.menuList = res.roleInfo?.menuList || [] //选中的菜单
      // 设置该角色菜单权限勾选状态数组
      this.getCuTypeCode(permList)
      this.permListFormatter(permList)
      if (flag == 1) {
        this.detailVisible = true
      } else if (flag == 2) {
        this.operation = false
        this.dialogFormVisible = true
      } else if (flag == 3) {
        this.$delete(this.dataForm, 'roleName')
        this.$delete(this.dataForm, 'roleDesc')
        this.operation = true
        this.dialogFormVisible = true
      }
    },
    // 递归
    getCuTypeCode(node) {
      for (let i = 0; i < node.length; i++) {
        const item = node[i]

        switch (item.cuType) {
          case 4:
            item.children
              ? this.permListCode(item.children, 4)
              : this.permCheckList4.push(item.code)
            break
          case 1:
            item.children
              ? this.permListCode(item.children, 1)
              : this.permCheckList1.push(item.code)
            break
          case 7:
            item.children
              ? this.permListCode(item.children, 7)
              : this.permCheckList7.push(item.code)
            break
          default:
            break
        }
      }
    },
    permListCode(node, type) {
      for (let i = 0; i < node.length; i++) {
        const item = node[i]
        if (item.children && item.children.length) {
          this.permListCode(item.children, type)
        } else {
          this['permCheckList' + type].push(item.code)
        }
      }
    },
    // 递归
    permListFormatter(node) {
      for (let i = 0; i < node.length; i++) {
        const item = node[i]
        switch (item.cuType) {
          case 4:
            this.permDisableList4.push(item)
            break
          case 1:
            this.permDisableList1.push(item)
            break
          case 7:
            this.permDisableList7.push(item)
            break
          default:
            break
        }
      }
    },
    // 删除角色
    handleDelete(row) {
      this.$confirm(this.$t('roleManage.cancelPrompt1'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.deleteRoleInfo({ roleId: row.roleId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.handleFind()
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
    async getPermList(obj) {
      this.permList4 = []
      this.permList1 = []
      this.permList7 = []
      const res = await this.$api.selectMenuPerms(obj)
      if (res.permList && res.permList.length) {
        const permList = res.permList
        permList.forEach(item => {
          switch (item.cuType) {
            case 4:
              this.permList4.push(item)
              break
            case 1:
              this.permList1.push(item)
              break
            case 7:
              this.permList7.push(item)
              break
            default:
              break
          }
        })
        this.codeArr4 = flapTree(this.permList4).map(item => item.code)
        this.codeArr1 = flapTree(this.permList1).map(item => item.code)
        this.codeArr7 = flapTree(this.permList7).map(item => item.code)
      }
    },
    // 分页
    getListByPage() {
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss">
#roleManager {
  width: 100%;
  height: 100%;
}
</style>
