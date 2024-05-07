<template>
  <div>
    <el-dialog
      :title="$t('retrieval.selectRepository')"
      v-model="dialogVisible"
      top="10vh"
      width="500px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        :label-width="locale == 'en' ? '180px' : '80px'"
        :validate-on-rule-change="false"
      >
        <el-form-item
          style="white-space: nowrap"
          :label="$t('retrieval.repository') + '：'"
          prop="repositoryId"
        >
          <el-select
            v-model="form.repositoryId"
            filterable
            popper-class="longOptionStyle"
            :placeholder="$t('retrieval.repositoryPrompt')"
          >
            <el-option-group
              v-for="group in repositoryList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.repositoryId"
                :label="item.repositoryName"
                :value="item.repositoryId"
                :title="item.repositoryName"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="loading" @click="handleConfirm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <repository-item-form
      v-model:visible="objectFormDialogVisible"
      :repo-type="pageType"
      :repository-id="currentRepositoryId"
      :initial-file="initialFile"
      @success="onRepoItemEditSuccess"
    ></repository-item-form>
  </div>
</template>

<script>
import routeJump from '@/mixin/route-jump.js' //路由跳转
import { ApplicationType } from '../../constant'
import { repositoryType as RepositoryTypeEnum } from './constant'
import RepositoryItemForm from './repository-item-form'
import { getBlobByGET } from '@/utils/common/download'
export default {
  mixins: [routeJump],
  components: {
    RepositoryItemForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataType: {
      type: Number,
      default: ApplicationType.vehicle
    },
    image: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        repositoryId: ''
      },
      loading: false,
      repositoryList: [],
      objectFormDialogVisible: false,
      currentRepositoryId: undefined,
      initialFile: undefined
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
    formRules() {
      return {
        repositoryId: [
          {
            required: true,
            message: this.$t('retrieval.repositoryPrompt'),
            trigger: 'change'
          }
        ]
      }
    },
    pageType() {
      return this.dataType === ApplicationType.vehicle
        ? RepositoryTypeEnum.vehicle
        : RepositoryTypeEnum.person
    }
  },
  methods: {
    dialogOpen() {
      this.resetForm()
      this.getRepositoryList()
      this.$nextTick(() => {
        
      })
    },
    resetForm() {
      this.form = {
        repositoryId: ''
      }
      this.$resetForm('form')
    },
    async getRepositoryList() {
      this.loading = true
      this.repositoryList = []
      try {
        let blackRes, whiteRes
        if (this.dataType === ApplicationType.vehicle) {
          blackRes = await this.$api.getVehicleRepositoryList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            repositoryType: 0
          })
          whiteRes = await this.$api.getVehicleRepositoryList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            repositoryType: 1
          })
        } else {
          blackRes = await this.$api.getPersonRepositoryList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            repositoryType: 2
          })
          whiteRes = await this.$api.getPersonRepositoryList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            repositoryType: 3
          })
        }
        const { repositoryList: blackList } = blackRes
        const { repositoryList: whiteList } = whiteRes
        if (blackList && blackList.length > 0) {
          this.repositoryList.push({
            label: this.$t('retrieval.blacklistLibrary'),
            options: blackList
          })
        }
        if (whiteList && whiteList.length > 0) {
          this.repositoryList.push({
            label: this.$t('retrieval.whitelistLibrary'),
            options: whiteList
          })
        }
      } finally {
        this.loading = false
      }
    },
    handleConfirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const blob = await getBlobByGET(this.image)
            const file = new File(
              [blob],
              `${new Date().getTime() + Math.round(Math.random() * 10)}.${blob.type.split('/')[1]}`,
              {
                type: blob.type
              }
            )
            this.dialogVisible = false
            this.currentRepositoryId = this.form.repositoryId
            this.initialFile = file
            this.objectFormDialogVisible = true
          } finally {
            this.loading = false
          }
        }
      })
    },
    onRepoItemEditSuccess() {
      if (this.initialFile instanceof File) {
        this.initialFile = undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
