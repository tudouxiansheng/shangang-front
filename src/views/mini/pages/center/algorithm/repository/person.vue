<template>
  <div
    class="control_repository"
    v-if="isRouterAlive"
    ref="controlRepository"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
  >
    <el-row class="full_height" :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" :lg="5" :xl="5" class="full_height">
        <RepositoryList
          ref="repositoryList"
          :repo-type="pageType"
          @change="handleRepoChange"
        ></RepositoryList>
      </el-col>
      <el-col :xs="24" :sm="12" :md="18" :lg="19" :xl="19" class="full_height">
        <div class="repository_item_container">
          <div v-has-permi="[44]" style="margin: 0 0 20px">
            <el-button :disabled="!currentRepositoryId" type="primary" @click="handleAddObject">
              {{ $t('public.add') }}
            </el-button>
            <el-button
              :disabled="!currentRepositoryId"
              type="primary"
              @click="importFormDialogVisible = true"
            >
              {{ $t('public.batchImport') }}
            </el-button>
            <el-button type="danger" :disabled="!checkedData.length" @click="handleDelObject">
              {{ $t('public.batchDeletion') }}
            </el-button>
            <el-button type="primary" :disabled="!checkedData.length" @click="handleCopyObject">
              {{ $t('repo.batchCopy') }}
            </el-button>
          </div>
          <el-row>
            <el-form
              :inline="true"
              class="queryForm"
              :label-width="'80PX'"
              ref="queryForm"
              :model="queryParams"
              label-position="left"
            >
              <el-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="17"
                :xl="locale == 'en' ? 20 : 19"
                class="full-col"
              >
                <el-col :span="locale == 'en' ? 7 : 8">
                  <el-form-item :label="$t('repo.fullName') + ' ：'" prop="name">
                    <el-input
                      v-model="queryParams.name"
                      :placeholder="$t('repo.inputFullName')"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="locale == 'en' ? 8 : 8">
                  <el-form-item :label-width="locale == 'en' ? '160px' : '80px'" :label="$t('repo.IDNum') + ' ：'" prop="credentialNumber">
                    <el-input
                      v-model="queryParams.credentialNumber"
                      :placeholder="$t('repo.inputIDNum')"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="locale == 'en' ? 11 : 8">
                  <el-form-item :label="$t('repo.gender') + ' ：'" prop="gender">
                    <el-radio-group v-model="queryParams.gender">
                      <el-radio :label="undefined">{{ $t('public.all') }}</el-radio>
                      <el-radio
                        v-for="(item, index) in genderList"
                        :key="index"
                        :label="item.value"
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="locale == 'en' ? 4 : 5">
                <el-form-item style="float: right; margin: 0">
                  <el-button
                    :disabled="!currentRepositoryId"
                    type="primary"
                    @click="handleQuery"
                    class="miniBtn"
                  >
                    {{ $t('public.search') }}
                  </el-button>
                  <el-button type="info" @click="resetQuery" class="miniBtn">
                    {{ $t('public.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <div class="check_all">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                {{ $t('repo.allSelect') }}
              </el-checkbox>
              <span>{{ $t('retrieval.selected') }}：{{ checkedData.length }}</span>
            </div>
          </el-row>
          <div class="flex flex-col flex-1 overflow-hidden">
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <div class="table-cards-wrapper" ref="tableCards" v-show="!loading && tableData.length">
              <el-checkbox-group v-model="checkedData" @change="handleCheckedDataChange">
                <div class="table-cards">
                  <el-card
                    v-for="(item, index) in tableData"
                    :key="index"
                    :class="[
                      checkedData.find(data => data.personId === item.personId) && 'is-checked'
                    ]"
                  >
                    <div class="card-header">
                      <el-checkbox class="no-label" :label="item" :key="item.personId" />
                      <div class="card-header-control">
                        <el-icon @click="handleEditObject(item)"><el-icon-edit /></el-icon>
                        <el-icon @click="handleDelObject(item)"><el-icon-delete /></el-icon>
                        <el-icon @click="handleCopyObject(item)"><el-icon-document-copy /></el-icon>
                      </div>
                    </div>
                    <div class="img-content" @click="handleView(item)">
                      <el-image
                        v-if="item.faceList && item.faceList.length"
                        fit="fill"
                        :src="getPhotoPath(item.faceList[0].previewPhotoPath)"
                        :lazy="tableData.length > 8"
                        scroll-container=".table-cards-wrapper"
                      ></el-image>
                      <span
                        class="img-tips"
                        v-if="
                          item.faceList &&
                          item.faceList.length &&
                          item.faceList[0].photoState !== undefined
                        "
                      >
                        <span :title="formatPhotoState(item.faceList[0].photoState)">
                          {{ formatPhotoState(item.faceList[0].photoState) }}
                        </span>
                      </span>
                    </div>
                    <div class="guard-info">
                      <div class="guard-info-item">
                        <span>{{ $t('repo.fullName') }}：</span>
                        <span :title="item.name">{{ item.name }}</span>
                      </div>
                      <div class="guard-info-item">
                        <span>{{ $t('repo.gender') }}：</span>
                        <span :title="item.gender">
                          {{ formatGender(item.gender) }}
                        </span>
                      </div>
                      <div class="guard-info-item">
                        <span>{{ $t('repo.IDNum') }}：</span>
                        <span :title="item.credentialNumber">
                          {{ item.credentialNumber }}
                        </span>
                      </div>
                      <div class="guard-info-item">
                        <span :style="{ minWidth: locale == 'en' ? '65px' : '' }">
                          {{ $t('repo.remark') }}：
                        </span>
                        <span :title="item.remark">
                          {{ item.remark }}
                        </span>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-checkbox-group>
            </div>
            <pagination
              v-if="!loading && total > 0"
              :total="total"
              v-model:pageNum="queryParams.pageInfo.pageNum"
              v-model:limit="queryParams.pageInfo.pageSize"
              @pagination="getRepositoryItemList"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <repository-item-form
      v-model:visible="objectFormDialogVisible"
      :repo-type="pageType"
      :repository-id="currentRepositoryId"
      :object-id="currentObjectId"
      :initial-file="initialFile"
      @success="onRepoItemEditSuccess"
    ></repository-item-form>

    <repository-item-detail
      v-model:visible="objectViewDialogVisible"
      :repo-type="pageType"
      :repository-id="currentRepositoryId"
      :object-id="currentObjectId"
      :initial-file="initialFile"
      @success="onRepoItemEditSuccess"
    />

    <import-form
      v-model:visible="importFormDialogVisible"
      :repo-type="pageType"
      :repository-id="currentRepositoryId"
      @submit="handleImportObject"
    ></import-form>

    <!-- 批量操作 -->
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="batchData"
      :what="$t('repo.controlTarget')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="personId"
      whatName="name"
      :multipleSelectionMany="multipleSelectionMany"
      v-model:loading="loading"
      @getList="getRepositoryItemList"
      :beforeBatchOperate="beforeBatchOperate"
    />

    <batch-copy
      v-model:visible="batchCopyDialogVisible"
      :repository-nature-type="currentRepositoryType"
      @selected="handleCopy"
    />

    <batch-import
      ref="batchOperation"
      :repo-type="pageType"
      :title="batchOperationDialogTitle"
      :operations="operations"
      :api="doBatchOperation"
      :customErrorColumn="customErrorColumn"
      @close="getRepositoryItemList"
    />
  </div>
</template>

<script>
import {
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  DocumentCopy as ElIconDocumentCopy
} from '@element-plus/icons-vue'
import RepoMixin from './mixin/repository'
import RepositoryList from './component/repository-list'
import RepositoryItemForm from './component/repository-item-form'
import RepositoryItemDetail from './component/repository-item-detail'
import ImportForm from './component/import-form'
import BatchOperate from '@/components/batchOperate' //批量操作
import BatchCopy from './component/batch-copy'
import BatchImport from './component/batch-import'
import {
  repositoryType as RepositoryTypeEnum,
  genderList
} from '@views/center/algorithm/repository/constant'
export default {
  components: {
    RepositoryList,
    RepositoryItemForm,
    RepositoryItemDetail,
    ImportForm,
    BatchOperate,
    BatchCopy,
    BatchImport,
    ElIconEdit,
    ElIconDelete,
    ElIconDocumentCopy
  },
  name: 'TargetGuardRepository',
  mixins: [RepoMixin],
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      pageType: RepositoryTypeEnum.person,
      currentRepositoryId: undefined,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        name: undefined,
        credentialNumber: undefined,
        gender: undefined
      },
      batchCopyDialogVisible: false,
      currentRepositoryType: undefined,
      awaitCopyData: [],
      genderList: genderList
    }
  },
  methods: {
    handleRepoChange(repo) {
      if (repo.repositoryId) {
        this.currentRepositoryId = repo.repositoryId
        this.currentRepositoryType = repo.repositoryType
        this.handleQuery()
      } else {
        this.currentRepositoryId = undefined
        this.tableData = []
        this.total = 0
        this.checkedData = []
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      this.getRepositoryItemList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        name: undefined,
        credentialNumber: undefined,
        gender: undefined
      }
      this.$resetForm('queryForm')
    },
    handleCopyObject(row) {
      this.batchCopyDialogVisible = true
      this.awaitCopyData = row.personId ? [row] : this.checkedData
    },
    handleCopy(targetRepoId) {
      let copyData = []
      this.awaitCopyData.forEach(item => {
        const obj = {
          repositoryId: targetRepoId,
          personId: item.personId,
          transfer: 1
        }
        copyData.push(obj)
      })

      this.operate = this.$t('repo.batchCopy')
      this.batchApi = 'addNewPersonInfo'
      this.isHasHandle = false
      this.batchData = copyData
      this.multipleSelectionMany = copyData
      this.batchDialogVisible = true
    },
    formatGender(val) {
      return this.selectDictLabel(genderList, val, {
        key: 'name',
        value: 'value'
      })
    }
  }
}
</script>

<style lang="scss">
@import './repository.scss';
</style>
