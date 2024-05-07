<template>
  <!-- 角色添加修改 -->
  <el-dialog
    :title="$parent.operation ? $t('roleManage.addRole') : $t('roleManage.editRole')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="dialog"
    @open="dialogOpen"
    :modal="false"
    draggable
    @closed="dialogClosed"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="$parent.locale == 'en' ? '160px' : '120px'"
      label-position="left"
    >
      <el-form-item :label="$t('roleManage.roleName') + '：'" prop="roleName">
        <el-input
          v-model="form.roleName"
          auto-complete="off"
          :placeholder="$t('roleManage.namePrompt')"
          clearable
          :disabled="$parent.canModify == 0"
        />
      </el-form-item>

      <el-form-item :label="$t('roleManage.roleDesc') + '：'">
        <el-input
          v-model="form.roleDesc"
          auto-complete="off"
          :placeholder="$t('roleManage.roleDescPrompt')"
          clearable
          maxlength="512"
          :disabled="$parent.canModify == 0"
        />
      </el-form-item>
      <el-form-item :label="$t('roleManage.roleType') + '：'" prop="roleType">
        <el-select
          :disabled="!$parent.operation"
          v-model="form.roleType"
          :placeholder="$t('roleManage.roleTypePrompt')"
          @change="roleTypeChange"
        >
          <el-option
            v-for="item in roleTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('roleManage.rolePerm') + '：'">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            v-for="item in cuTypeList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
          <div v-show="$parent.dialogFormVisible && activeName == '4'" id="orgTree1">
            <div
              class="check-all"
              v-if="$parent.canModify == 1 && this.$parent.permList4.length > 0"
            >
              <el-checkbox
                :indeterminate="isIndeterminate4"
                v-model="checkedAll4"
                @change="checkChange('4')"
              >
                {{ $t('roleManage.checkAll') }}
              </el-checkbox>
            </div>
            <el-tree
              v-if="$parent.canModify == 1"
              ref="menuTree4"
              node-key="code"
              :data="$parent.permList4"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList4"
              @check="handleMenuCheckChange"
            />
            <el-tree
              v-if="$parent.canModify == 0"
              ref="menuTree44"
              node-key="code"
              :data="$parent.permDisableList4"
              show-checkbox
              :props="defaultProps1"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList4"
            />
          </div>
          <div v-show="$parent.dialogFormVisible && activeName == '1'" id="orgTree1">
            <div
              class="check-all"
              v-if="$parent.canModify == 1 && this.$parent.permList1.length > 0"
            >
              <el-checkbox
                :indeterminate="isIndeterminate1"
                v-model="checkedAll1"
                @change="checkChange('1')"
              >
                {{ $t('roleManage.checkAll') }}
              </el-checkbox>
            </div>
            <el-tree
              v-if="$parent.canModify == 1"
              ref="menuTree1"
              node-key="code"
              :data="$parent.permList1"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList1"
              @check="handleMenuCheckChange"
            />
            <el-tree
              v-if="$parent.canModify == 0"
              ref="menuTree1"
              node-key="code"
              :data="$parent.permDisableList1"
              show-checkbox
              :props="defaultProps1"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList1"
            />
          </div>
          <div v-show="$parent.dialogFormVisible && activeName == '7'" id="orgTree1">
            <div
              class="check-all"
              v-if="$parent.canModify == 1 && this.$parent.permList7.length > 0"
            >
              <el-checkbox
                :indeterminate="isIndeterminate7"
                v-model="checkedAll7"
                @change="checkChange('7')"
              >
                {{ $t('roleManage.checkAll') }}
              </el-checkbox>
            </div>
            <el-tree
              v-if="$parent.canModify == 1"
              ref="menuTree7"
              node-key="code"
              :data="$parent.permList7"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList7"
              @check="handleMenuCheckChange"
            />
            <el-tree
              v-if="$parent.canModify == 0"
              ref="menuTree77"
              node-key="code"
              :data="$parent.permDisableList7"
              show-checkbox
              :props="defaultProps1"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList7"
            />
          </div>
        </el-tabs>
      </el-form-item>

      <!-- 提示信息 -->
      <div
        v-if="$parent.canModify == 0"
        style="text-align: center; color: #f56c6c; font-size: 14px"
      >
        {{ $t('roleManage.errorPrompt') }}
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button
          :loading="maskloading"
          :type="$parent.canModify == 0 ? '' : 'primary'"
          :disabled="$parent.canModify == 0"
          @click="submitForm"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { flapTree } from '@/utils/common/utils.js'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      codeArr: [],
      permCheckNodes: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultProps1: {
        children: 'children',
        label: 'name',
        disabled: () => {
          return true
        }
      },
      form: {
        roleName: '', // 角色名称
        roleDesc: '', // 角色描述
        roleType: 1, // 角色类型
        permList: [] //权限码列表
      },
      roleTypeList: [
        {
          label: this.$t('dictConst.businessManagement'),
          value: 1
        },
        {
          label: this.$t('dictConst.businessUse'),
          value: 2
        }
      ],
      activeName: '4',
      permCheckNodes4: [],
      permCheckNodes1: [],
      permCheckNodes7: [],
      permListChecked4: false, //菜单权限提示显影
      permListChecked1: false, //菜单权限提示显影
      permListChecked7: false, //菜单权限提示显影
      checkedAll4: false,
      checkedAll1: false,
      checkedAll7: false,
      isIndeterminate4: false,
      isIndeterminate1: false,
      isIndeterminate7: false,
      permHalfCheckNodes4: [],
      permHalfCheckNodes1: [],
      permHalfCheckNodes7: [],
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t('roleManage.namePrompt'),
            trigger: 'blur'
          },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: this.$t('public.nameError3')
          },
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        roleType: [
          {
            required: true,
            message: this.$t('roleManage.roleTypePrompt'),
            trigger: 'blur'
          }
        ]
      },
      maskloading: false // 点击提交按钮后蒙版
    }
  },
  computed: {
    cuTypeList() {
      if (this.$projectEnv.includes('SIOP')) {
        if (this.form.roleType == 1 || this.form.roleType == 9) {
          return [
            {
              label: this.$t('roleManage.bgManage'),
              value: '4'
            },
            {
              label: this.$t('roleManage.pc'),
              value: '1'
            }
          ]
        } else {
          return [
            {
              label: this.$t('roleManage.pc'),
              value: '1'
            }
          ]
        }
      } else {
        if (this.form.roleType == 1 || this.form.roleType == 9) {
          return [
            {
              label: this.$t('roleManage.bgManage'),
              value: '4'
            },
            {
              label: this.$t('roleManage.pc'),
              value: '1'
            },
            {
              label: this.$t('roleManage.web'),
              value: '7'
            }
          ]
        } else {
          return [
            {
              label: this.$t('roleManage.pc'),
              value: '1'
            },
            {
              label: this.$t('roleManage.web'),
              value: '7'
            }
          ]
        }
      }
    },
    menuIdList() {
      if (this.$projectEnv.includes('SIOP')) {
        if (this.form.roleType == 1 || this.form.roleType == 9) {
          return ['4', '1']
        } else {
          return ['1']
        }
      } else {
        if (this.form.roleType == 1 || this.form.roleType == 9) {
          return ['4', '1', '7']
        } else {
          return ['1', '7']
        }
      }
    }
  },

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.form.permList = []
          this.form.menuList = []
        })
      }
      this.$nextTick(async () => {
        
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
        switch (this.form.roleType) {
          case 1:
            await this.$parent.getPermList({
              permTypes: [1, 2],
              tenantId: this.$parent.belongTenantId
            })
            break
          case 2:
            await this.$parent.getPermList({
              permTypes: [2],
              tenantId: this.$parent.belongTenantId
            })
            break
          case 9:
            await this.$parent.getPermList({
              permTypes: [1, 2, 9],
              tenantId: this.$parent.belongTenantId
            })
            break
          default:
            break
        }
        this.menuIdList.forEach(item => {
          if (this.$refs['menuTree' + item]) {
            if (this.$refs['menuTree' + item])
              this.$refs['menuTree' + item].setCheckedKeys(this.$parent['permCheckList' + item])
            const checkedKeys = this.$refs['menuTree' + item].getCheckedKeys()
            if (checkedKeys.length >= this.$parent['codeArr' + item].length) {
              this['checkedAll' + item] = true
              this['isIndeterminate' + item] = false
            } else if (checkedKeys.length == 0) {
              this['checkedAll' + item] = false
              this['isIndeterminate' + item] = false
            } else {
              this['checkedAll' + item] = false
              this['isIndeterminate' + item] = true
            }
          }
        })
        switch (this.form.roleType) {
          case 1:
            this.activeName = '4'
            break
          case 2:
            this.activeName = '1'
            break
          case 9:
            this.activeName = '4'
            break
          default:
            break
        }
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.activeName = '4'
      // 恢复节点选中传递的数据
      this.permCheckNodes = []
      this.$parent.permCheckList = []
      if (this.$refs.menuTree4) this.$refs.menuTree4.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree1) this.$refs.menuTree1.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree7) this.$refs.menuTree7.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree44) this.$refs.menuTree44.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree11) this.$refs.menuTree11.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree77) this.$refs.menuTree77.setCheckedKeys([]) //清空树的选中
      this.maskloading = false
      this.$parent.permCheckList4 = []
      this.$parent.permCheckList1 = []
      this.$parent.permCheckList7 = []
    },

    //! 树节点选择监听
    handleMenuCheckChange(data, checkedNodes) {
      let checkedKeys = this.$loadash.cloneDeep(checkedNodes.checkedKeys)
      let permCheckNodes = this.$loadash.cloneDeep(checkedNodes.checkedNodes)
      // 如果选择了高级云台控制，则勾选基础云台控制
      if (
        checkedKeys.findIndex(item => item == 120) != -1 &&
        checkedKeys.findIndex(item => item == 118) == -1
      ) {
        checkedKeys.unshift(118)
        permCheckNodes.unshift({
          code: 118,
          name: '基础云台控制'
        })
      }
      this.$refs['menuTree' + this.activeName].setCheckedKeys(checkedKeys)
      this['permCheckNodes' + this.activeName] = permCheckNodes
      this['permListChecked' + this.activeName] = permCheckNodes.length !== 0 ? true : false
      if (checkedKeys.length >= this.$parent['codeArr' + this.activeName].length) {
        this['checkedAll' + this.activeName] = true
        this['isIndeterminate' + this.activeName] = false
      } else if (checkedKeys.length == 0) {
        this['checkedAll' + this.activeName] = false
        this['isIndeterminate' + this.activeName] = false
      } else {
        this['checkedAll' + this.activeName] = false
        this['isIndeterminate' + this.activeName] = true
      }
    },
    async roleTypeChange() {
      this.activeName = this.cuTypeList[0].value
      if (this.$refs.menuTree4) this.$refs.menuTree4.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree1) this.$refs.menuTree1.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree7) this.$refs.menuTree7.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree44) this.$refs.menuTree44.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree11) this.$refs.menuTree11.setCheckedKeys([]) //清空树的选中
      if (this.$refs.menuTree77) this.$refs.menuTree77.setCheckedKeys([]) //清空树的选中
      this.checkedAll4 = false
      this.checkedAll1 = false
      this.checkedAll7 = false
      this.isIndeterminate4 = false
      this.isIndeterminate1 = false
      this.isIndeterminate7 = false
      switch (this.form.roleType) {
        case 1:
          await this.$parent.getPermList({
            permTypes: [1, 2],
            tenantId: this.$parent.belongTenantId
          })
          break
        case 2:
          await this.$parent.getPermList({
            permTypes: [2],
            tenantId: this.$parent.belongTenantId
          })
          break
        case 9:
          await this.$parent.getPermList({
            permTypes: [1, 2, 9],
            tenantId: this.$parent.belongTenantId
          })
          break
        default:
          break
      }
    },
    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.maskloading = true
          const form = this.form
          let data = {
            roleName: form.roleName,
            roleDesc: form.roleDesc,
            roleType: form.roleType,
            tenantId: this.$route.query.tenantId
          }
          if (this.$refs.menuTree4) {
            this.permCheckNodes4 = this.$refs.menuTree4.getCheckedNodes()
            this.permHalfCheckNodes4 = this.$refs.menuTree4.getHalfCheckedKeys()
          }
          if (this.$refs.menuTree1) {
            this.permCheckNodes1 = this.$refs.menuTree1.getCheckedNodes()
            this.permHalfCheckNodes1 = this.$refs.menuTree1.getHalfCheckedKeys()
          }
          if (this.$refs.menuTree7) {
            this.permCheckNodes7 = this.$refs.menuTree7.getCheckedNodes()
            this.permHalfCheckNodes7 = this.$refs.menuTree7.getHalfCheckedKeys()
          }

          this.handelPermCheckNodes()
          if (this.form.permList.length == 0) {
            this.maskloading = false
            this.$message.error(this.$t('roleManage.roleTypeErr'))
            return
          }
          Object.assign(data, {
            roleId: this.form.roleId,
            permList: this.form.permList,
            menuList: this.form.menuList
          })
          if (!this.$parent.operation) {
            // 修改使用角色
            this.$api.modifyRoleInfo(data).then(res => {
              this.successBack(res, this.$t('public.modifySuccess'))
            })
          } else {
            // 添加使用角色
            this.$api.addRoleInfo(data).then(res => {
              this.successBack(res, this.$t('public.addSuccess'))
            })
          }
        }
      })
    },

    handelPermCheckNodes() {
      let arr = []
      let arr1 = []
      this.permCheckNodes4.forEach(item => {
        item.cuType !== undefined ? arr1.push(item.code) : arr.push(item.code)
      })
      this.permCheckNodes1.forEach(item => {
        item.cuType !== undefined ? arr1.push(item.code) : arr.push(item.code)
      })
      this.permCheckNodes7.forEach(item => {
        item.cuType !== undefined ? arr1.push(item.code) : arr.push(item.code)
      })
      this.form.permList = arr
      this.form.menuList = [
        ...arr1,
        ...this.permHalfCheckNodes4,
        ...this.permHalfCheckNodes1,
        ...this.permHalfCheckNodes7
      ]
    },
    successBack(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      } else {
        this.form.permList = [] //清空表单提交数组数据
      }
      this.maskloading = false
    },
    checkChange(type) {
      if (this['checkedAll' + type]) {
        this.$refs['menuTree' + type].setCheckedKeys(this.$parent['codeArr' + type])
        this['isIndeterminate' + type] = false
      } else {
        this.$refs['menuTree' + type].setCheckedKeys([])
        this['isIndeterminate' + type] = false
        this['menuListList' + this.activeName] = []
        this['permList' + this.activeName] = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__item) {
  background: none !important;
  border-bottom: 1px solid #e4e7ed !important;
}
:deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none;
}
.check-all {
  padding-left: 8px;
}
.el-form-item {
  margin-bottom: 28px;
}
</style>
