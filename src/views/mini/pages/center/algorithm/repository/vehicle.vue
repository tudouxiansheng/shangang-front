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
          <div v-has-permi="[46]" style="margin: 0 0 20px">
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
          </div>
          <el-row>
            <el-form
              :inline="true"
              class="queryForm"
              :label-width="locale == 'en' ? '200px' : '80px'"
              ref="queryForm"
              :model="queryParams"
              label-position="left"
            >
              <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="19">
                <el-form-item :label="$t('repo.license') + ' ：'" prop="lpn">
                  <el-input
                    v-model="queryParams.lpn"
                    :placeholder="$t('repo.inputLicense')"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="5">
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
                      checkedData.find(data => data.vehicleId === item.vehicleId) && 'is-checked'
                    ]"
                  >
                    <div class="card-header">
                      <el-checkbox class="no-label" :label="item" :key="item.vehicleId" />
                      <div class="card-header-control">
                        <el-icon><el-icon-edit @click="handleEditObject(item)" /></el-icon>
                        <el-icon><el-icon-delete @click="handleDelObject(item)" /></el-icon>
                      </div>
                    </div>
                    <div class="img-content" @click="handleView(item)">
                      <el-image
                        v-if="item.vehiclePhotos && item.vehiclePhotos.length"
                        fit="fill"
                        :src="getPhotoPath(item.vehiclePhotos[0].previewPhotoPath)"
                        lazy
                        scroll-container=".table-cards-wrapper"
                      ></el-image>
                      <span
                        class="img-tips"
                        v-if="
                          item.vehiclePhotos &&
                          item.vehiclePhotos.length &&
                          item.vehiclePhotos[0].photoState !== undefined
                        "
                      >
                        <span :title="formatPhotoState(item.vehiclePhotos[0].photoState)">
                          {{ formatPhotoState(item.vehiclePhotos[0].photoState) }}
                        </span>
                      </span>
                    </div>
                    <div class="guard-info">
                      <div class="guard-info-item">
                        <span :style="{ minWidth: locale == 'en' ? '155px' : '' }">
                          {{ $t('repo.license') }}：
                        </span>
                        <span :title="item.lpn">{{ item.lpn }}</span>
                      </div>
                      <div class="guard-info-item">
                        <span>{{ $t('repo.carColor') }}：</span>
                        <span :title="item.vehicleColor">
                          {{ formatColor(item.vehicleColor) }}
                        </span>
                      </div>
                      <div class="guard-info-item">
                        <span>{{ $t('repo.carOwnerName') }}：</span>
                        <span :title="item.ownerName">
                          {{ item.ownerName }}
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

    <Form
      v-model:visible="importFormDialogVisible"
      :repo-type="pageType"
      :repository-id="currentRepositoryId"
      @submit="handleImportObject"
    ></Form>

    <!-- 批量操作 -->
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="batchData"
      :what="$t('repo.controlTarget')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="vehicleId"
      whatName="lpn"
      :multipleSelectionMany="multipleSelectionMany"
      v-model:loading="loading"
      @getList="getRepositoryItemList"
      :beforeBatchOperate="beforeBatchOperate"
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
import { Edit as ElIconEdit, Delete as ElIconDelete } from '@element-plus/icons-vue'
import RepoMixin from './mixin/repository'
import RepositoryList from './component/repository-list'
import RepositoryItemForm from './component/repository-item-form'
import RepositoryItemDetail from './component/repository-item-detail'
import Form from './component/import-form'
import BatchOperate from '@/components/batchOperate' //批量操作
import BatchImport from './component/batch-import'
import { repositoryType as RepositoryTypeEnum } from '@views/center/algorithm/repository/constant'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    RepositoryList,
    RepositoryItemForm,
    RepositoryItemDetail,
    Form,
    BatchOperate,
    BatchImport,
    ElIconEdit,
    ElIconDelete
  },
  name: 'VehicleGuardRepository',
  mixins: [RepoMixin],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      pageType: RepositoryTypeEnum.vehicle,
      currentRepositoryId: undefined,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        lpn: undefined
      }
    }
  },
  computed: {
    ...mapState({
      vehicleColorList: state => state.dict['ars-vehicle-color'] //车辆颜色
    })
  },
  mounted() {
    this.getDictionaryLists()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryLists() {
      this.getSysDictData(['ars-vehicle-color'])
    },
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
    formatColor(val) {
      return this.selectDictLabel(this.vehicleColorList, String(val), {
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
