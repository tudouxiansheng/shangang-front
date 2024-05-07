<template>
  <div id="model-device-cancel" ref="modelDeviceCancel">
    <el-row>
      <el-col :span="24">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="danger" @click="batchCancel" v-if="PermissionManage">
              {{ $t('algoModel.batchCancel') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: -8px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              :model="searchForm"
              label-position="left"
            >
              <el-form-item prop="platformName">
                <el-input
                  v-model="searchForm.platformName"
                  auto-complete="off"
                  :placeholder="$t('algoModel.inputDevName')"
                  clearable
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div
          style="height: 248px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <!-- 表格 -->
          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column :label="$t('algoModel.modelName')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.platformName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoModel.devName')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.platformName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span
                  class="cell-operate danger"
                  @click="handleCancel(row)"
                  v-if="PermissionManage"
                >
                  {{ $t('public.cancel') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="algorithmList"
          ></pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'

export default {
  data() {
    return {
      //用户权限判断
      PermissionManage: true,

      //算法平台类型列表
      platformTypeList: [],

      // 条件搜索
      searchForm: {
        platformName: ''
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: this.$t('public.noData'),

      pageNum: 1,
      pageSize: 10,
      totalNum: 0 // 总数量
    }
  },

  created() {
    this.getPermissions()
  },
  mounted() {
    this.algorithmList()
  },
  activated() {
    this.setDialogCss()
  },

  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(16)
    },

    //获取算法平台列表
    algorithmList() {
      this.dataText = ''
      this.loading = true
      let algorithmListObj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        platformName: this.searchForm.platformName
      }
      this.$api.getAlgorithmPlatformList(algorithmListObj).then(res => {
        if (res.platList && res.platList.length) {
          this.totalNum = res.pageInfo.totalNum
          this.tableData = res.platList
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
        } else {
          this.totalNum = 0
          this.tableData = []
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.algorithmList()
    },

    batchCancel() {},

    // 删除
    handleCancel(row) {
      this.$confirm(this.$t('algoModel.deletePlatPrompt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteAlgorithmPlatformInfo({ platformId: row.platformId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.algorithmList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    }
  }
}
</script>

<style lang="scss">
#model-device-cancel {
  width: 100%;
  height: 100%;
}
</style>
