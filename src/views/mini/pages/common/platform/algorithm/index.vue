<template>
  <!-- 算法平台管理 -->
  <div id="platform-algorithm" v-if="isRouterAlive" ref="platformAlgorithm">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div class="btnMargin">
          <div>
            <el-button v-if="PermissionManage" type="primary" @click="handleAdd">
              {{ $t('public.add') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="searchForm.platformName"
              auto-complete="off"
              :placeholder="$t('algorithmPlat.enterSearchPlatName')"
              clearable
              style="width: 200px"
              class="inputMiddle"
            />

            <el-button type="primary" @click="handleFind" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>
        <div
          style="height: 600px"
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
            <el-table-column :label="$t('algorithmPlat.platformName')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.platformName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algorithmPlat.platformType')" min-width="90">
              <template #default="{ row }">
                <span>{{ setPlatformType(row.platformType) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algorithmPlat.version')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.version }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="120">
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.updateTime')" min-width="120">
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)" v-if="PermissionManage">
                  {{ $t('public.modify') }}
                </span>
                <span
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                  v-if="PermissionManage"
                >
                  {{ $t('public.delete') }}
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
            @pagination="getListByPage"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <algorithm-add></algorithm-add>
    <algorithm-detail></algorithm-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { mapState, mapActions } from 'vuex'

import algorithmDetail from './component/algorithm-detail'
import addAlgorithm from './component/algorithm-add'
export default {
  name: 'AlgorithmPlatformManagement',
  components: {
    'algorithm-detail': algorithmDetail,
    'algorithm-add': addAlgorithm
  },
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,

      // 条件搜索
      searchForm: {
        platformName: ''
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: true, // true:添加, false:修改
      dialogFormVisible: false, // 添加或者修改
      algorithmDetailVisible: false, //详情
      openDialog: false,
      // 添加修改框表单
      dataForm: {
        platformName: '',
        platformType: '',
        version: '',
        vendor: '',
        accessIP: '',
        accessPort: '',
        accessAccount: '',
        accessPassword: '',
        platformDesc: ''
      },

      maskloading: false // 点击提交按钮后蒙版
    }
  },
  computed: {
    ...mapState({
      platformTypeList: state => state.dict['alg-platform-type'] // 算法平台类型
    })
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getDictionary()
    this.algorithmList()
  },
  activated() {
    this.setDialogCss()
  },

  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(15)
      this.PermissionManage = await permissions(16)
    },

    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['alg-platform-type'])
    },

    setPlatformType(val) {
      let name = ''
      this.platformTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
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

    // 添加
    async handleAdd() {
      if (this.platformTypeList.length == 0) {
        await this.getDictionary()
      }
      this.dataForm = {
        platformName: '',
        platformType: '',
        version: '',
        vendor: '',
        accessIP: '',
        accessPort: '',
        accessAccount: '',
        accessPassword: '',
        platformDesc: ''
      }

      this.operation = true
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.algorithmList()
    },

    async getAlgorithmPlatformInfo(flag, platformId) {
      let res = await this.$api.getAlgorithmPlatformInfo({ platformId })
      if (res.resultCode != 0) return

      this.dataForm = {
        platformId,
        platformName: res.platformName,
        platformType: res.platformType.toString(),
        version: res.version,
        vendor: res.vendor,
        accessIP: res.accessIP,
        accessPort: res.accessPort,
        accessAccount: res.accessAccount,
        accessPassword: '',
        platformDesc: res.platformDesc
      }
      if (this.platformTypeList.length == 0) {
        await this.getDictionary()
      }
      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.algorithmDetailVisible = true
      }
    },

    //详情
    async handleInfo(row) {
      await this.getAlgorithmPlatformInfo(0, row.platformId)
    },
    // 修改
    async handleEdit(row) {
      await this.getAlgorithmPlatformInfo(1, row.platformId)
    },

    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('algorithmPlat.ifDelThisPlat'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteAlgorithmPlatformInfo({ platformId: row.platformId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.bulkDelSuccess')
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
    },

    // 分页
    getListByPage() {
      this.algorithmList()
    }
  }
}
</script>

<style lang="scss">
#platform-algorithm {
  width: 100%;
  height: 100%;
  .btnMargin {
    display: flex;
    justify-content: space-between;
  }
}
</style>
