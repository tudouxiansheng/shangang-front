<template>
  <!-- 算法接入信息 -->
  <div id="algorithm-access" v-if="isRouterAlive" ref="algorithmAccess">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNode"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('public.add') }}
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
                  v-model="searchForm.accessName"
                  auto-complete="off"
                  :placeholder="$t('newAccess.inputSearchAccName')"
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

            <el-table-column :label="$t('newAccess.accName')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.accessName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('newAccess.accessMode')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setAccessType(row.accessType) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.accessIP')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.accessHost }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('newAccess.accPort')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.accessPort }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.version')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.version }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.manufacturer')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.vendor }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.status')" min-width="90">
              <template #default="{ row }">
                <span :class="row.status == 1 ? 'success' : 'danger'">
                  {{ row.status == 1 ? $t('newAccess.online') : $t('newAccess.offline') }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.creationTime')" min-width="120">
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('newAccess.updateTime')" min-width="120">
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
    <access-add></access-add>
    <access-detail></access-detail>
  </div>
</template>

<script>
import getLazyTree from '@/mixin/getLazyTree.js'
import { mapState, mapActions } from 'vuex'
import { defineAsyncComponent } from 'vue'

import accessDetail from './component/access-detail'
import accessAdd from './component/access-add'

export default {
  mixins: [getLazyTree],
  components: {
    'access-detail': accessDetail,
    'access-add': accessAdd
  },
  data() {
    return {
      isRouterAlive: true,
      maskloading: false, // 点击提交按钮后蒙版
      PermissionInfo: true, //用户权限判断
      PermissionManage: true, //用户权限判断

      // 条件搜索
      searchForm: {
        accessName: ''
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
      accessDetailVisible: false, //详情
      // 添加修改框表单
      dataForm: {},
      authTypeList: [
        {
          name: this.$t('newAccess.authType1'),
          value: 1
        },
        {
          name: this.$t('newAccess.authType2'),
          value: 2
        },
        {
          name: this.$t('newAccess.authType3'),
          value: 3
        }
      ], //认证类型
      accessModeList: [
        {
          name: this.$t('newAccess.exclusiveAccess'),
          value: 0
        },
        {
          name: this.$t('newAccess.sharedAccess'),
          value: 1
        }
      ]
    }
  },
  computed: {
    ...mapState({
      accessTypeList: state => state.dict['ars-access-type'] //接入方式
    })
  },
  async mounted() {
    await this.getDictionary()
    await this.getAlgorithmAccessList()
  },
  activated() {
    
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData(['ars-access-type'])
    },

    setAccessType(val) {
      let name = ''
      this.accessTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    setAccessMode(val) {
      let name = ''
      this.accessModeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    //获取算法列表
    getAlgorithmAccessList() {
      this.dataText = ''
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        ...this.searchForm
      }
      this.$api.getAlgorithmAccessList(obj).then(res => {
        if (res.algorithmAccessList && res.algorithmAccessList.length) {
          this.tableData = res.algorithmAccessList
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

    setAuthType(val) {
      let name = ''
      this.authTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.organizationName = list[0].payload.organizationName
          this.organizationId = list[0].payload.organizationId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },

    // 点击树节点 !
    handleNodeClick(data, node, self) {
      //点击树联动面包屑
      this.organizationName = data.payload.organizationName
      this.organizationId = data.payload.organizationId
      this.handleFind()
    },

    // 添加
    async handleAdd() {
      if (this.accessTypeList.length == 0) {
        await this.getDictionary()
      }
      this.dataForm = {
        accessName: '',
        accessMode: [0],
        accessType: '',
        accessHost: '',
        accessPort: '',
        authType: '',
        account: '',
        password: '',
        appKey: '',
        appSecret: '',

        whiteIPs: '',
        version: '',
        vendor: '',
        remark: ''
      }
      this.operation = true
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getAlgorithmAccessList()
    },

    //详情
    async handleInfo(row) {
      await this.getAlgorithmAccessInfo(0, row.accessId)
    },
    // 修改
    async handleEdit(row) {
      await this.getAlgorithmAccessInfo(1, row.accessId)
    },
    async getAlgorithmAccessInfo(flag, accessId) {
      let res = await this.$api.getAlgorithmAccessInfo({ accessId })
      if (res.resultCode != 0) return
      res.whiteIPs = res.whiteIPs ? res.whiteIPs.toString() : ''
      res.accessType = String(res.accessType)
      this.dataForm = {
        ...res
      }

      if (this.accessTypeList.length == 0) {
        await this.getDictionary()
      }

      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.accessDetailVisible = true
      }
    },

    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('newAccess.deleteAlgorithmPrompt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteAlgorithmAccessInfo({ accessId: row.accessId }).then(response => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getAlgorithmAccessList()
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
      this.getAlgorithmAccessList()
    },

    // 分页输入跳转页数
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAlgorithmAccessList()
    }
  }
}
</script>
