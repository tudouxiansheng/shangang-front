<template>
  <el-dialog
    :title="$t('userManage.setPermissions')"
    v-model="$parent.shareDialogVisible"
    width="820px"
    class="share-permission"
    @open="dialogOpen"
    @closed="dialogClosed"
    draggable
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
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <i :class="iconSty(data)" class="iconCss1 aci"></i>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </el-scrollbar>

    <div style="width: 80%; margin: 20px auto" v-if="node.type == 1">
      <el-checkbox v-model="ifRecursive">{{ $t('userManage.ifApplay') }}</el-checkbox>
    </div>

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
      ifRecursive: false,
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
      delete obj.type
      this.$api.getAllocatedPerms(obj).then(res => {
        this.loading = false
        this.permScope = res?.permScope || []
        this.defaultKeys = res.getAllocatedPermsUser[0].perms
      })
    },
    //共享权限
    sharePermission() {
      let obj = { ...this.node }
      delete obj.type
      this.ifRecursive ? (obj.recursive = 1) : (obj.recursive = 0)
      obj.perms = []
      let nodes = this.$refs.tree.getCheckedNodes()
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].children) {
          obj.perms.push(nodes[i].code)
        }
      }
      if (!obj.perms.length) {
        this.$message({
          message: this.$t('userManage.setPermissionsFirst'),
          type: 'warning'
        })
        return
      }
      this.$api.setAllocatedPerms(obj).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            message: this.$t('userManage.setPermissionsSucc'),
            type: 'success'
          })
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
