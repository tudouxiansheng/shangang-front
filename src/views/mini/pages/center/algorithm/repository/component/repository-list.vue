<template>
  <div class="repository_container">
    <div class="repository_list_control">
      <el-button v-if="managePermission" type="primary" @click="handleAddRepository">
        <el-icon :size="15" class="el-icon--left"><el-icon-folder-add /></el-icon>
        {{ isPersonRepo ? $t('repo.addPersonRepo') : $t('repo.addCarRepo') }}
      </el-button>
    </div>
    <div class="repository_list_wrapper">
      <el-input
        v-model="searchForm.repositoryName"
        :placeholder="isPersonRepo ? $t('repo.inputPersonRepoName') : $t('repo.inputCarRepoName')"
      >
        <template #suffix>
            <el-icon class="el-input__icon">
              <Search @click="getRepositoryList" />
            </el-icon>
        </template>
      </el-input>
      <el-tabs v-model="repositoryType" stretch @tab-change="handleTabClick">
        <el-tab-pane v-if="isPersonRepo" :label="$t('repo.blacklist')" name="2" />
        <el-tab-pane v-if="isPersonRepo" :label="$t('repo.whitelist')" name="3" />
        <el-tab-pane v-if="!isPersonRepo" :label="$t('repo.blacklist')" name="0" />
        <el-tab-pane v-if="!isPersonRepo" :label="$t('repo.whitelist')" name="1" />
      </el-tabs>
      <ul class="repository_list" v-loading="loading">
        <el-scrollbar>
          <li
            v-for="(item, index) in repositoryList"
            :key="index"
            :class="['repository_list_item', currentIndex === index && 'active']"
            @click="chooseRepository(index)"
          >
            <span :title="item.repositoryName">{{ item.repositoryName }}</span>
            <div
              v-if="managePermission"
              v-show="currentIndex === index"
              class="repository_list_item_control"
            >
              <el-icon @click="handleEditRepository(item)"><el-icon-edit /></el-icon>
              <el-icon @click="handleDelRepository(item)"><el-icon-delete /></el-icon>
            </div>
          </li>
        </el-scrollbar>
      </ul>
    </div>
    <repository-form
      v-model:visible="formDialogVisible"
      :repo-type="repoType"
      :repository-id="currentRepositoryId"
      @success="handleAddRepositorySuccess"
    ></repository-form>
  </div>
</template>

<script>
import {
  Search,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  FolderAdd as ElIconFolderAdd
} from '@element-plus/icons-vue'
import { repositoryType as RepositoryTypeEnum, repositoryNatureType } from '../constant'
import RepositoryForm from './repository-form'
import { permissions } from '@/utils/common/permissions'
import { markRaw, shallowRef } from 'vue'
export default {
  data() {
    return {
      searchForm: {
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        repositoryName: '',
        repositoryType: ''
      },
      repositoryType: '',
      currentIndex: 0,
      loading: false,
      repositoryList: [],
      RepositoryTypeEnum: RepositoryTypeEnum,
      formDialogVisible: false,
      currentRepositoryId: '',
      managePermission: false
    }
  },
  components: {
    RepositoryForm,
    Search,
    ElIconEdit,
    ElIconDelete,
    ElIconFolderAdd
  },
  name: 'repository-list',
  props: {
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person
    }
  },
  computed: {
    currentRepository() {
      return this.repositoryList[this.currentIndex] || {}
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    }
  },
  async mounted() {
    let repositoryType = this.isPersonRepo
      ? repositoryNatureType.personBlack
      : repositoryNatureType.vehicleBlack
    this.searchForm.repositoryType = repositoryType
    this.repositoryType = String(repositoryType)
    await this.getPermissions()
    await this.getRepositoryList()
  },
  methods: {
    markRaw,
    shallowRef,
    async getPermissions() {
      this.managePermission = await permissions(this.isPersonRepo ? 44 : 46)
    },
    handleTabClick(val) {
      this.searchForm.repositoryType = Number(val)
      this.getRepositoryList()
    },
    /**
     * @description: 获取布控库列表
     */
    async getRepositoryList(findId) {
      if (this.loading && !findId) return
      this.loading = true
      try {
        const searchParams = JSON.parse(JSON.stringify(this.searchForm))
        const res =
          await this.$api[
            this.isPersonRepo ? 'getPersonRepositoryList' : 'getVehicleRepositoryList'
          ](searchParams)
        if (res.repositoryList && res.repositoryList.length > 0) {
          this.repositoryList = res.repositoryList
        } else {
          this.repositoryList = []
        }
        if (findId) {
          const index = this.repositoryList.findIndex(repo => repo.repositoryId === findId)
          this.currentIndex = index !== -1 ? index : 0
        } else {
          this.currentIndex = 0
        }
        this.$emit('change', this.currentRepository)
      } finally {
        this.loading = false
      }
    },
    chooseRepository(index) {
      if (this.currentIndex === index) return
      this.currentIndex = index
      this.$emit('change', this.currentRepository)
    },
    handleEditRepository(item) {
      this.currentRepositoryId = item.repositoryId
      this.formDialogVisible = true
    },
    handleDelRepository(item) {
      this.$confirm(
        this.isPersonRepo ? this.$t('repo.ifDelPersonRepo') : this.$t('repo.ifDelCarRepo'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$api[this.isPersonRepo ? 'deleteNewRepositoryInfo' : 'deleteNewCar']({
            repositoryId: item.repositoryId
          }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.isPersonRepo
                  ? this.$t('repo.delPersonRepo')
                  : this.$t('repo.delCarRepoSucc')
              })
              this.getRepositoryList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    // 创建人员库
    handleAddRepository() {
      this.currentRepositoryId = ''
      this.formDialogVisible = true
    },

    handleAddRepositorySuccess(type) {
      this.searchForm.repositoryType = type
      this.repositoryType = String(type)
      this.getRepositoryList()
    },
    async loadSpecifyRepo(type, id) {
      this.searchForm.repositoryType = type
      this.repositoryType = String(type)
      await this.getRepositoryList(id)
    }
  }
}
</script>
