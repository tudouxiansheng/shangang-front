<template>
  <!-- 批量设备移动 -->
  <el-dialog
    :title="$t('public.devicechange')"
    v-model="$parent.orgChangeShow"
    width="820px"
    :close-on-click-modal="false"
    :modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    draggable
  >
    <p style="color: #f56c6c; margin-top: -12px">*{{ $t('deviceCamera.moveCameraTip') }}</p>
    <el-scrollbar style="border-radius: 6px">
      <lazy-tree
        ref="lazyTree"
        :iconColor="true"
        @initList="initData"
        @nodeClick="treeNodeClick"
        :withTenant="false"
      />
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
import { defineAsyncComponent } from 'vue'
import lazyTree from '@/components/lazy-tree'
export default {
  components: {
    'lazy-tree': lazyTree
  },
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
        this.$refs.lazyTree.$refs.treeList.setCurrentKey(null)
      })
    },
    // 树加载完初始化表格
    initData(list) {},
    // 点击树节点
    treeNodeClick(obj) {
      this.orgChangeId = obj.data.payload.organizationId
    },

    // 批量设备移动确定按钮
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
