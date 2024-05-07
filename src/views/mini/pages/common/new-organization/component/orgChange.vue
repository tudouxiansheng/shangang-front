<template>
  <!-- 批量组织变更 -->
  <el-dialog
    :title="$t('public.orgChange')"
    v-model="$parent.orgChangeShow"
    width="820px"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    @closed="dialogClosed"
    draggable
    id="orgChangeDialog"
  >
    <el-scrollbar style="border-radius: 4px">
      <div id="orgTree1">
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
          @node-click="handleNodeChoose"
          v-if="$parent.showOrgTree"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node" :id="spanID(data.id)">
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
        
        if (this.$refs.treeList) {
          let node = this.$refs.treeList.getNode(this.$parent.rootId)
          node.loaded = false
          node.loadData()
        }
      })
    },
    dialogClosed() {
      this.$parent.orgChangeShow = false
      this.$parent.maskloading = false
      this.$nextTick(() => {
        this.$refs.treeList.setCurrentKey(null)
      })
    },
    spanID(id) {
      return 'node' + id
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []

        for (let i = 0; i < list.length; i++) {
          this.$nextTick().then(async () => {
            for (let j = 0; j < this.$parent.cantMoveArr.length; j++) {
              if (this.$refs.treeList.getNode(list[i].id).data.id == this.$parent.cantMoveArr[j]) {
                document.getElementById('node' + list[i].id).parentElement.style.cursor =
                  'not-allowed'
                document
                  .getElementById('node' + list[i].id)
                  .parentElement.classList.add('clickColor')
              }
              if (this.$refs.treeList.getNode(list[i].id).parent.data) {
                if (
                  this.$refs.treeList.getNode(list[i].id).parent.data.id ==
                  this.$parent.cantMoveArr[j]
                ) {
                  document.getElementById('node' + list[i].id).parentElement.style.cursor =
                    'not-allowed'
                  document
                    .getElementById('node' + list[i].id)
                    .parentElement.classList.add('clickColor')
                  this.$parent.cantMoveArr.push(list[i].id)
                }
              }
            }
          })
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
      let changeFlag = false
      for (let i = 0; i < this.$parent.cantMoveArr.length; i++) {
        if (data.id == this.$parent.cantMoveArr[i]) {
          changeFlag = true
          break
        }
      }
      if (!changeFlag) {
        this.orgChangeId = data.payload.organizationId
      } else {
        document.getElementById('node' + data.id).parentElement.classList.add('clickColor')
      }
    },

    // 组织变更表单提交
    async submitOrgChange() {
      if (this.orgChangeId == null) {
        this.$message({
          type: 'info',
          message: this.$t('public.orgPrompt')
        })
      } else {
        let obj = {
          organizationId: this.$parent.dataForm.organizationId,
          parentId: this.orgChangeId
        }
        this.$parent.maskloading = true

        let res = await this.$api.modifyOrganizationInfo(obj)
        if (res.resultCode == 0) {
          this.$parent.movedOrgId = res.organizationId
          this.$parent.appendId = this.orgChangeId
          this.$parent.orgChangeShow = false
          this.$message({
            type: 'success',
            message: this.$t('public.changeSuccess')
          })
          this.$parent.treeChange()
        }
        this.$parent.maskloading = false
        this.orgChangeId = null
      }
    }
  }
}
</script>

<style lang="scss">
#orgChangeDialog {
  .el-dialog__body {
    padding: 15px 125px 5px;
  }

  .clickColor {
    background: #f2f2f2 !important;
    color: #999 !important;
  }
}
</style>
