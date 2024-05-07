<template>
  <div class="camera-video-quality">
    <el-form
      class="mt-8"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-position="left"
      :label-width="locale === 'en' ? '160px' : '120px'"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="21">
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" class="treeselect">
              <el-form-item :label="$t('organizationManage.area') + '：'" prop="organizationId">
                <treeselect
                  :options="organizationOption"
                  :load-options="loadOptions"
                  :clearable="false"
                  :placeholder="$t('organizationManage.chooseArea')"
                  v-model="searchForm.organizationId"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoQualityPatrol.platName') + '：'" prop="platId">
                <el-select
                  clearable
                  v-model="searchForm.platId"
                  :placeholder="$t('videoQualityPatrol.platNameProp')"
                >
                  <el-option
                    v-for="item in platOption"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoQualityPatrol.cameraName') + '：'" prop="cameraName">
                <el-input
                  v-model="searchForm.cameraName"
                  clearable
                  :placeholder="$t('videoQualityPatrol.cameraNameProp')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoQualityPatrol.cameraId') + '：'" prop="cameraId">
                <el-input
                  v-model="searchForm.cameraId"
                  clearable
                  :placeholder="$t('videoQualityPatrol.cameraIdProp')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoQualityPatrol.resultNewest') + '：'" prop="result">
                <el-select clearable v-model="searchForm.result">
                  <el-option
                    v-for="item in testResultTypeData"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="3">
          <el-button class="float-right ml-5" v-hasPermi="[9003]" @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            type="primary"
            class="float-right"
            v-hasPermi="[9003]"
            @click="getCameraQualityNewestPage"
          >
            {{ $t('public.search') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      class="mt-5"
      border
      v-loading="loading"
      :data="tableData"
      max-height="510"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        :label="$t('videoQualityPatrol.cameraName')"
        prop="cameraName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.cameraId')"
        prop="cameraId"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.areaName')"
        prop="organizationName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.platName')"
        prop="platName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.testTotal')"
        prop="total"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.startTimeNewest')"
        prop="startTimeNewest"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.resultNewest')"
        :formatter="resultNewestFormatter"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('public.operating')" v-hasPermi="[9004]">
        <template #default="{ row }">
          <span class="cursor-pointer text-detail" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getCameraQualityNewestPage(false)"
    />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { mapState } from 'vuex'

export default {
  components: { Treeselect },
  data() {
    return {
      organizationIdCopy: undefined,
      organizationOption: null,
      platOption: [],
      searchForm: {
        organizationId: undefined,
        platId: undefined,
        cameraName: undefined,
        cameraId: undefined,
        result: undefined,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      total: 0,
      tableData: [],
      cuType: sessionStorage.getItem('cuType'),
      key: sessionStorage.getItem('key'),
      locale: sessionStorage.getItem('language')
    }
  },
  computed: {
    ...mapState({
      testResultTypeData: state => state.dict.test_result_type,
      clientNonce: state => state.auth.clientNonce,
      token: state => state.auth.accessToken,
    })
  },
  mounted() {
    this.getPlatformList()
  },
  methods: {
    async getPlatformList() {
      let organizationId = sessionStorage.getItem('organizationId')
      let res = await this.$api.queryAccessPlatformList({
        organizationId,
        platAbility: 'SURVEILLANCE'
      })
      if (res.platformList && res.platformList.length) {
        res.platformList = res.platformList.map(item => {
          return {
            enableStatus: item.enableStatus,
            platId: item.platformId,
            platName: item.platformName,
            platType: item.platformType,
            platStatus: item.platformStatus
          }
        })
        this.platOption = res.platformList
      }
    },
    async getCameraQualityNewestPage(isSearch = true) {
      this.loading = true
      if (isSearch) {
        this.searchForm.pageInfo.pageNum = 1
      } else {
        this.$refs['searchForm'].resetFields()
      }
      let res = await this.$api.getCameraQualityNewestPage(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.cameraQualityNewestList
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.organizationId = this.organizationIdCopy
      this.getCameraQualityNewestPage()
    },
    handleDetail(row) {
      this.$router.push({
        name: 'CameraQualityDetail',
        params: {
          id: row.cameraId,
          name: row.cameraName,
          type: 1
        }
      })
    },
    resultNewestFormatter(row) {
      return this.selectDictLabel(this.testResultTypeData, row.resultNewest)
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode == 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.searchForm.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
            this.getCameraQualityNewestPage()
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) return {}
      return data.map(item => {
        let obj = {
          id: item.payload.organizationId,
          label: item.label,
          children: null
        }
        if (item.leaf === true) {
          delete obj.children
        }
        return obj
      })
    }
  }
}
</script>

<style lang="scss">
.camera-video-quality {
  .vue-treeselect__control {
    height: 32px;
  }
  .el-form-item {
    align-items: center;
  }
  .treeselect .vue-treeselect {
    width: 191px;
  }
}
</style>
