<template>
  <!-- 角色详情 -->
  <el-dialog
    :title="$t('roleManage.roleDetail')"
    :visible.sync="$parent.detailVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="roleManageDetail detailDialog"
    :draggable='false'
    @open="dialogOpen"
    @closed="dialogClosed"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      :label-width="$parent.locale == 'en' ? '140px' : '82px'"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('roleManage.roleName') + '：'">
            <span>{{ form.roleName }}</span>
          </el-form-item>
          <el-form-item :label="$t('roleManage.roleType') + '：'">
            <span>{{ this.roleTypeFormat(form.roleType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('public.createTime') + '：'">
            <span>{{ form.createTime }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('public.updateTime') + '：'">
            <span>{{ form.updateTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('roleManage.roleDesc') + '：'">
            <span>{{ form.roleDesc }}</span>
          </el-form-item>
        </div>
      </div>
      <el-form-item :label="$t('roleManage.rolePerm') + '：'" class="padding40 itemSty">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in cuTypeList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
          <div id="orgTree1" v-show="activeName == '4'">
            <el-tree
              ref="menuTree4"
              node-key="code"
              :data="$parent.permList4"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList4"
            />
          </div>
          <div id="orgTree1" v-show="activeName == '1'">
            <el-tree
              ref="menuTree1"
              node-key="code"
              :data="$parent.permList1"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList1"
            />
          </div>
          <div id="orgTree1" v-show="activeName == '7'">
            <el-tree
              ref="menuTree7"
              node-key="code"
              :data="$parent.permList7"
              show-checkbox
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-checked-keys="$parent.permCheckList7"
            />
          </div>
        </el-tabs>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: () => {
          return true
        }
      },
      form: {
        roleId: '',
        roleName: '',
        createTime: '',
        updateTime: '',
        roleDesc: ''
      },
      roleTypeList: [
        {
          label: this.$t('dictConst.businessManagement'),
          value: 1
        },
        {
          label: this.$t('dictConst.businessUse'),
          value: 2
        },
        {
          label: this.$t('dictConst.systemManagement'),
          value: 9
        }
      ],
      activeName: '4'
    }
  },
  computed: {
    cuTypeList() {

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
      
    },
    menuIdList() {

        if (this.form.roleType == 1 || this.form.roleType == 9) {
          return ['4', '1']
        } else {
          return ['1', '7']
        }
      
    }
  },
  methods: {
    dialogOpen() {
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
    roleTypeFormat(val) {
      return this.roleTypeList.find((t) => t.value == val)?.key
    },
    handleClick() {},
    dialogClosed() {
      this.$parent.detailVisible = false
      this.activeName = '4'
      this.$parent.permCheckList4 = [] // 恢复节点选中传递的数据
      this.$parent.permCheckList1 = [] // 恢复节点选中传递的数据
      this.$parent.permCheckList7 = [] // 恢复节点选中传递的数据
      if (this.$refs?.menuTree4) this.$refs.menuTree4.setCheckedKeys([]) //清空树的选中
      if (this.$refs?.menuTree1) this.$refs.menuTree1.setCheckedKeys([]) //清空树的选中
      if (this.$refs?.menuTree7) this.$refs.menuTree7.setCheckedKeys([]) //清空树的选中
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
.itemSty {
  position: relative;
  display: flex;
  align-items: flex-start;
}
.itemSty :deep(.el-form-item__label) {
  position: relative;
  top: 50px;
}
</style>
