<template>
  <!-- 算法管理 -->
  <div id="new-algorithm-list" v-if="isRouterAlive" ref="newAlgorithmList">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('algoManage.add') }}
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
              style="display: flex; flex-direction: row"
            >
              <el-form-item>
                <el-input
                  v-model="searchForm.algorithmName"
                  auto-complete="off"
                  :placeholder="$t('algoManage.inputSearchAlgo')"
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
            :max-height="tableHeight"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>

            <el-table-column
              :label="$t('algoManage.algoName')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.algorithmName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('algoManage.algoMark')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setAlgorithmKey(row.modelId) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('algoManage.algoType')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setAlgoType(row.algorithmType) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoManage.version')">
              <template #default="{ row }">
                <span>{{ row.version }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoManage.algoAccess')" min-width="90">
              <template #default="{ row }">
                <span>{{ setAccessId(row.accessId) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoManage.algoModel')" min-width="90">
              <template #default="{ row }">
                <span>{{ setModelId(row.modelId) }}</span>
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
          <div class="pagination" v-if="!loading && tableData.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number" @change="numberChange">
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>
            <div>
              <el-pagination
                v-model:current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalNum"
                @current-change="handleCurrentChange"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <algorithm-list-add></algorithm-list-add>
    <algorithm-list-detail></algorithm-list-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { permissions } from '@/utils/common/permissions'
import { defineAsyncComponent } from 'vue'
import algorithmListDetail from './component/algorithm-list-detail'
import algorithmListAdd from './component/algorithm-list-add'

export default {
  name: 'AlgorithmManagement',
  components: {
    'algorithm-list-detail': algorithmListDetail,
    'algorithm-list-add': algorithmListAdd
  },
  data() {
    return {
      isRouterAlive: true,
      PermissionInfo: true, //用户权限判断
      PermissionManage: true, //用户权限判断
      PermissionAllocate: false,

      // 条件搜索
      searchForm: {
        algorithmName: ''
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 616,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      operation: true, // true:添加, false:修改
      dialogFormVisible: false, // 添加或者修改
      algorithmListDetailVisible: false,
      maskloading: false, // 点击提交按钮后蒙版
      // 添加修改框表单
      dataForm: {},
      algorithmAccessList: [], //算法接入列表
      algorithmModelList: [], //算法模型列表

      dateValueFather: [],
      locale: localStorage.getItem('locale')
    }
  },
  computed: {
    ...mapState({
      algorithmTypeList: state => state.dict['algorithm-type'] //算法类型数组
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getAlgorithmAccessList()
    this.getAlgorithmModelList()
    this.getDictionaryList()
    this.getAlgorithmList()
  },
  activated() {
    
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionAllocate = await permissions(36)
    },

    // 获取算法接入列表
    async getAlgorithmAccessList() {
      let res = await this.$api.getAlgorithmAccessList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode != 0) return
      this.algorithmAccessList = res?.algorithmAccessList ? res.algorithmAccessList : []
    },
    setAccessId(val) {
      let name = ''
      this.algorithmAccessList.filter(item => {
        if (val == item.accessId) {
          name = item.accessName
        }
      })
      return name
    },
    setAlgoType(val) {
      let type = ''
      this.algorithmTypeList.filter(item => {
        if (val == item.value) {
          type = item.name
        }
      })
      return type
    },

    // 获取算法模型列表
    async getAlgorithmModelList() {
      let res = await this.$api.getAlgorithmModelList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode != 0) return
      this.algorithmModelList = res.algorithmModelList
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryList() {
      this.getSysDictData(['algorithm-type'])
    },

    setModelId(val) {
      let name = ''
      this.algorithmModelList.filter(item => {
        if (val == item.modelId) {
          name = item.modelName
        }
      })
      return name
    },
    setAlgorithmKey(val) {
      let name = ''
      this.algorithmModelList.filter(item => {
        if (val == item.modelId) {
          name = item.algorithmKey
        }
      })
      return name
    },
    setAlgorithmType(val) {
      let name = '',
        algorithmType = ''
      this.algorithmModelList.filter(item => {
        if (val == item.modelId) {
          algorithmType = item.algorithmType
        }
      })

      if (algorithmType == 1) {
        name = this.$t('algoManage.structedData')
      } else if (algorithmType == 2) {
        name = this.$t('algoManage.alarm')
      } else {
        name = ''
      }
      return name
    },

    //获取算法列表
    getAlgorithmList() {
      this.dataText = ''
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        ...this.searchForm,
        netType: this.$getNetType()
      }
      this.$api.getNewAlgorithmList(obj).then(res => {
        if (res.algorithmList && res.algorithmList.length) {
          this.tableData = res.algorithmList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
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

    // 添加
    async handleAdd() {
      if (this.algorithmAccessList.length == 0) {
        await this.getAlgorithmAccessList()
      }
      if (this.algorithmModelList.length == 0) {
        await this.getAlgorithmModelList()
      }

      this.dataForm = {
        algorithmName: '',
        accessId: '',
        modelId: '',
        enabled: 1,
        version: '',
        maxChannel: 50,
        vendor: '',
        validDateBegin: '',
        validDateEnd: '',
        remark: '',
        ruleId: ''
      }
      this.dateValueFather = []
      this.operation = true
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getAlgorithmList()
    },

    //详情
    async handleInfo(row) {
      await this.getAlgorithmInfo(0, row.algorithmId)
    },
    // 修改
    async handleEdit(row) {
      await this.getAlgorithmInfo(1, row.algorithmId)
    },
    async getAlgorithmInfo(flag, algorithmId) {
      let res = await this.$api.getNewAlgorithmInfo({
        algorithmId,
        netType: this.$getNetType()
      })
      if (res.resultCode != 0) return
      this.dataForm = {
        ...res
      }

      if (this.algorithmAccessList.length == 0) {
        await this.getAlgorithmAccessList()
      }
      if (this.algorithmModelList.length == 0) {
        await this.getAlgorithmModelList()
      }

      if (flag) {
        this.dateValueFather = [
          new Date(this.dataForm.validDateBegin),
          new Date(this.dataForm.validDateEnd)
        ]

        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.algorithmListDetailVisible = true
      }
    },

    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('algoManage.ifDelAlgo'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteNewAlgorithmInfo({ algorithmId: row.algorithmId }).then(response => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getAlgorithmList()
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

    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getAlgorithmList()
    },

    // 分页输入跳转页数
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAlgorithmList()
    }
  }
}
</script>
