<template>
  <el-dialog
    :title="$t('userManage.setPermissions')"
    :visible.sync="$parent.shareDialogVisible"
    width="820px"
    class="share-permission"
    @open="dialogOpen"
    @closed="dialogClosed"
    dialogDrag
  >
    <el-scrollbar style="border-radius: 6px">
      <div id="orgTree1" v-loading="loading">
        <el-tree
          :data="permScope"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          node-key="code"
          :default-checked-keys="defaultKeys"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i :class="iconSty(data)" class="iconCss1 aci"></i>
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </el-scrollbar>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="sharePermission">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ['node'],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permScope: [],
      defaultKeys: [],
      loading: false
    }
  },
  watch: {
    node() {
      if (this.node.userIds.length) {
        this.getSharePermission()
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.$parent.shareDialogVisible = false
    },
    //获取共享权限
    getSharePermission() {
      this.loading = true
      let obj = { ...this.node }
      this.$api.getAllocatedPerms(obj).then(res => {
        this.loading = false
        this.permScope = res.permScope
        if (this.node.userIds.length == 1) {
          this.defaultKeys = res.getAllocatedPermsUser[0].perms
        } else {
          this.defaultKeys = []
        }
      })
    },
    //共享权限
    sharePermission() {
      let obj = { ...this.node, recursive: 0 }
      obj.perms = []
      let nodes = this.$refs.tree.getCheckedNodes()
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].children) {
          obj.perms.push(nodes[i].code)
        }
      }

      this.$api.setAllocatedPerms(obj).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            message: this.$t('userManage.setPermissionsSucc'),
            type: 'success'
          })
          this.$emit('optioncb')
          this.dialogClosed()
        }
      })
    },
    iconSty(node) {
      if (node.children) {
        return 'aci-x006-folder'
      } else {
        return 'aci-key1'
      }
    }
  }
}
</script>

<style lang="scss">
.share-permission {
  .el-dialog__body {
    padding: 15px 125px 5px;
  }
}
</style>
