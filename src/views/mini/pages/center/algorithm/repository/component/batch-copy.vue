<template>
  <el-dialog
    :title="$t('repo.copyListTo')"
    v-model="dialogVisible"
    top="10vh"
    width="510px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-tree
      ref="repositoryTree"
      :data="repositoryList"
      :props="defaultProps"
      highlight-current
      default-expand-all
      node-key="repositoryId"
    ></el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm()">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  repositoryType as RepositoryTypeEnum,
  repositoryNatureType
} from '@views/center/algorithm/repository/constant'
export default {
  name: 'batch-copy',
  props: {
    repositoryNatureType: {
      type: Number,
      default: repositoryNatureType.personBlack,
      required: true
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      searchForm: {
        pageInfo: { pageNum: 1 },
        repositoryType: 2 // 2- 黑名单 3-白名单
      },
      repositoryList: [],
      defaultProps: {
        children: 'children',
        label: 'repositoryName'
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    }
  },
  methods: {
    dialogOpen() {
      this.getRepositoryList()
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.repositoryList = []
      this.dialogVisible = false
    },
    /**
     * @description: 获取布控库列表
     */
    async getRepositoryList() {
      if (this.loading) return
      this.loading = true
      try {
        const res = await this.$api.getPersonRepositoryList({
          pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
          repositoryType:
            this.repositoryNatureType === repositoryNatureType.personBlack
              ? repositoryNatureType.personWhite
              : repositoryNatureType.personBlack
        })
        if (res.repositoryList && res.repositoryList.length > 0) {
          this.repositoryList = [
            {
              repositoryName:
                repositoryNatureType.personBlack === this.repositoryNatureType
                  ? this.$t('repo.whitelist')
                  : this.$t('repo.blacklist'),
              repositoryId: -1,
              children: res.repositoryList
            }
          ]
        } else {
          this.repositoryList = []
        }
      } finally {
        this.loading = false
      }
    },
    submitForm() {
      const node = this.$refs.repositoryTree.getCurrentNode()
      if (!node || node.repositoryId === -1) {
        this.$message(this.$t('repo.repositoryPrompt'))
        return false
      }
      this.$emit('selected', node.repositoryId)
      this.dialogClosed()
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    padding: 15px 40px 5px;
  }
}
</style>
