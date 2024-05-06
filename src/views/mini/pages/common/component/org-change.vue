<template>
  <!-- 批量组织变更 -->
  <el-dialog
    :title="$t('public.orgChange')"
    v-model="$parent.orgChangeShow"
    width="820px"
    class="org_change"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-scrollbar style="border-radius: 6px">
      <div id="orgTree1">
        <el-tree
          ref="treeList"
          node-key="id"
          :props="organizationTreeProps"
          :load="loadNode"
          lazy
          :default-expanded-keys="idArr"
          :empty-text="treeEmptyText"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeChoose"
          v-loading="treeLoading"
          :element-loading-text="$t('public.loading')"
          
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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitOrgChange">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import getLazyTree from '@/mixin/getLazyTree.js'
export default {
  mixins: [getLazyTree],
  data() {
    return {
      orgChangeId: null
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.$parent.orgChangeShow = false
      this.$parent.maskloading = false
      this.orgChangeId = null
      this.$nextTick(() => {
        this.$refs.treeList.setCurrentKey(null)
      })
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      this.$route.query.tenantId ? (data.withTenant = 2) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        // 下级租户管理
        const query = this.$route.query
        if (level == 0 && query.tenantName) {
          list = [
            {
              id: query.organizationId.toString(),
              label: query.tenantName,
              leaf: false,
              type: '1',
              payload: {
                organizationId: query.organizationId,
                organizationName: query.tenantName,
                type: 1,
                areaCode: query.areaCode
              }
            }
          ]
        }
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    // 点击组织变更树节点!
    handleNodeChoose(data) {
      this.orgChangeId = data.payload.organizationId
    },

    // 组织变更表单提交
    submitOrgChange() {
      if (this.orgChangeId == null) {
        this.$message({
          type: 'info',
          message: this.$t('public.orgPrompt')
        })
      } else {
        this.$emit('orgChangeSubmit', this.orgChangeId)
      }
    }
  }
}
</script>

<style lang="scss">
.org_change {
  .el-dialog__body {
    padding: 15px 125px 5px;
  }
}
</style>
