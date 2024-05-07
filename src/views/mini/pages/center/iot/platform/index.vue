<template>
  <!-- 物联网平台 -->
  <div id="iotPlatformManage" v-if="isRouterAlive" ref="iotPlatformManage">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button v-hasPermi="[14]" type="primary" @click="handleAdd">
              {{ $t('iotPlatform.addPlat') }}
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
              style="display: flex"
            >
              <el-form-item prop="platName">
                <el-input
                  v-model="searchForm.platName"
                  auto-complete="off"
                  :placeholder="$t('iotPlatform.platNamePrompt')"
                  clearable
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getIotPlatformList" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
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
            style="width: 100%; margin-top: 20px"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <el-table-column prop="platId" :label="$t('iotPlatform.platId')" />
            <el-table-column prop="platName" :label="$t('iotPlatform.platName')" />
            <el-table-column :label="$t('iotPlatform.platType')" :formatter="platTypeFormatter" />
            <el-table-column prop="serverIntranetIp" :label="$t('iotPlatform.platIntranetIp')" />
            <el-table-column prop="serverPublicIp" :label="$t('iotPlatform.platPublicIp')" />
            <el-table-column prop="serverPort" :label="$t('iotPlatform.platPort')" />
            <el-table-column prop="platVersion" :label="$t('iotPlatform.platVersion')" />
            <el-table-column prop="serverAddr" :label="$t('iotPlatform.serverAddress')" />
            <el-table-column prop="remark" :label="$t('public.remark')" />
            <el-table-column prop="createTime" :label="$t('public.createTime')" />
            <el-table-column prop="updateTime" :label="$t('public.updateTime')" />
            <el-table-column :label="$t('public.operating')">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleEdit(row)" v-hasPermi="[14]">
                  {{ $t('public.modify') }}
                </span>
                <span class="cell-operate danger" @click="handleDelete(row)" v-hasPermi="[14]">
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="searchForm.pageInfo.pageNum"
            v-model:limit="searchForm.pageInfo.pageSize"
            @pagination="getIotPlatformList"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <add-platform></add-platform>
  </div>
</template>

<script>
import addPlatform from './component/add-platform.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'IotPlatformManagement',
  components: { addPlatform },
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,

      // 条件搜索
      searchForm: {
        organizationId: sessionStorage.getItem('organizationId'),
        pageInfo: { pageNum: 1, pageSize: 10 }
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      totalNum: 0, // 总数量
      maskloading: false,
      platId: '',

      operation: 1, // true:添加, false:修改

      dialogFormVisible: false, // 添加或者修改

      // 添加修改框表单
      dataForm: {}
    }
  },
  computed: {
    ...mapState({
      iotPlatTypeList: state => state.dict['iot-plat-type'],
      iotPlatCategoryList: state => state.dict['iot-plat-category']
    }),
    iotPlatTypeListFormatter() {
      let obj = []
      this.iotPlatTypeList.map(item => {
        obj.push({
          name: item.name,
          value: parseInt(item.value)
        })
      })
      return obj
    },
    iotPlatCategoryListFormatter() {
      let obj = []
      this.iotPlatCategoryList.map(item => {
        obj.push({
          name: item.name,
          value: parseInt(item.value)
        })
      })
      return obj
    }
  },

  mounted() {
    this.getDictData()
    // 获取平台列表
    this.getIotPlatformList()
  },
  activated() {
    
  },
  methods: {
    // 字典表查询
    ...mapActions('dict', ['getSysDictData']),
    // 获取字典表
    getDictData() {
      // 获取iot平台类型
      this.getSysDictData(['iot-plat-type', 'iot-plat-category'])
    },
    getIotPlatformList() {
      this.dataText = ''
      this.loading = true
      this.$api.getIotPlatformList(this.searchForm).then(res => {
        if (res.platList && res.platList.length) {
          this.tableData = res.platList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    platTypeFormatter(row) {
      return this.selectDictLabel(this.iotPlatTypeListFormatter, row.platType, {
        key: 'name',
        value: 'value'
      })
    },

    // 添加
    handleAdd() {
      this.dataForm = {
        platName: '',
        platType: '',
        category: ''
      }
      this.operation = true
      this.dialogFormVisible = true
    },

    // 表格列表选中
    // 修改
    async handleEdit(row) {
      this.platId = row.platId
      // 获取平台信息
      let res = await this.$api.getIotPlatformInfo({ platId: this.platId })
      if (res.resultCode == 0) {
        this.dataForm = {
          platName: res.platName,
          platType: res.platType,
          category: res.category,
          platAccount: res.platAccount,
          platPasswd: res.platPasswd,
          serverIntranetIp: res.serverIntranetIp,
          serverPublicIp: res.serverPublicIp,
          serverPort: res.serverPort,
          platVersion: res.platVersion,
          serverAddr: res.serverAddr,
          remark: res.remark
        }
        this.operation = false
        this.dialogFormVisible = true
      }
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`${this.$t('iotPlatform.deletePrompt')}`, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteIotPlatformInfo({ platId: row.platId }).then(response => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: `${this.$t('iotPlatform.deleteSuccess')}`
              })
              this.getIotPlatformList()
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
#iotPlatformManage {
  .el-table {
    .el-dropdown {
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
