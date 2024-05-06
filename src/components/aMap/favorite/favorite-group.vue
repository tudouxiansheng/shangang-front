<template>
  <!-- 摄像机收藏 -->
  <el-dialog
    :title="$t('favorite.selectGroup')"
    :visible.sync="$parent.favoriteGroupVisible"
    top="10vh"
    width="500px"
    :close-on-click-modal="false"
    class="favorite-dialog"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    v-dialogDrag
  >
    <el-input :placeholder="$t('favorite.filterText')" v-model="filterText" style="margin-bottom: 10px" />

    <el-scrollbar style="border-radius: 6px">
      <div id="orgTree1">
        <el-tree
          ref="favoriteTree"
          node-key="id"
          :data="favoriteTreeData"
          :props="favoriteTreeProps"
          highlight-current
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeChoose"
          v-loading="favoriteLoading"
          :element-loading-text="$t('gis.loading')"
          element-loading-spinner="el-icon-loading"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <i class="aci-x006-folder iconCss1 aci" />
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('gis.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="maskloading">
          {{ $t('gis.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getFavoriteCamList, operFavoriteCamera } from '../../../utils/api'

export default {
  data() {
    return {
      favoriteTreeData: [],
      favoriteTreeProps: {
        label: 'label',
        children: 'children',
      },
      favoriteLoading: false,
      filterText: '',
      maskloading: false,
      favoriteId: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.favoriteTree.filter(val)
    },
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.getFavoriteTree()
      })
    },

    dialogClosed() {
      this.$parent.favoriteGroupVisible = false
      this.maskloading = false
      this.filterText = ''
    },
    async getFavoriteTree() {
      this.favoriteLoading = true
      const res = await getFavoriteCamList({})
      this.favoriteLoading = false
      const arr = res.nodeList || []
      this.favoriteTreeRecursion(arr)
      this.favoriteTreeData = arr
    },
    // 收藏夹树处理
    favoriteTreeRecursion(arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].type == 2) {
          arr.splice(i, 1)
        } else if (arr[i].children) {
          this.favoriteTreeRecursion(arr[i].children)
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击组织变更树节点!
    handleNodeChoose(data) {
      this.favoriteId = data.payload.favoriteId
    },

    // 表单提交
    async submitForm() {
      if (!this.favoriteId) {
        this.$message({
          type: 'warning',
          message: this.$t('favorite.selectGroupPrompt'),
        })
        return
      }

      this.maskloading = true
      let data = {
        favoriteId: this.favoriteId,
        cameraId: this.$parent.cameraInfo.deviceId,
        operType: '1',
      }
      // 添加收藏夹
      const res = await operFavoriteCamera(data)
      if (res.resultCode == 0) {
        this.$message({
          type: 'success',
          message: this.$t('favorite.favoriteSuccess'),
        })
        this.$parent.favoriteGroupVisible = false
        this.$emit('favoriteSuccess')
        this.filterText = ''
      }
      this.maskloading = false
    },
  },
}
</script>

<style lang="scss">
.favorite-dialog {
  .el-dialog__body {
    padding: 15px 40px 5px;
  }
}
</style>
