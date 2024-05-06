<template>
  <!-- 监控平台管理 -->
  <div id="surveillance" v-if="isRouterAlive" ref="platformSurveillance">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <lazy-tree
              ref="lazyTree"
              @initList="initData"
              @nodeClick="treeNodeClick"
              :withTenant="true"
            />
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <div class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" style v-if="PermissionManage">
              {{ $t('public.add') }}
            </el-button>
          </div>

          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="keyword"
              clearable
              size="small"
              class="filter-item inputMiddle"
              :placeholder="$t('monitorManage.inputPlatformName')"
              @change="search_change"
              maxlength="128"
              :style="locale == 'en' ? { width: '260px' } : { width: '200px' }"
            />

            <el-button type="primary" @click="handleFind" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>

        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            max-height="441"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
            ref="multipleTable"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              prop="platId"
              :label="$t('monitorManage.platformID')"
              min-width="100"
              show-overflow-tooltip
            />
            <el-table-column
              prop="platName"
              :label="$t('public.platName')"
              ref="status"
              min-width="70"
              show-overflow-tooltip
            />
            <el-table-column
              prop="platType"
              :label="$t('monitorManage.platformType')"
              min-width="60"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setPlatType(row.platType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="serverIntranetIp"
              :label="$t('monitorManage.platformIntranetIP')"
              show-overflow-tooltip
            />
            <el-table-column
              prop="serverPublicIp"
              :label="$t('monitorManage.platformPublicNetworkIP')"
              show-overflow-tooltip
            />
            <el-table-column
              prop="serverPort"
              :label="$t('monitorManage.platformPort')"
              min-width="60"
              show-overflow-tooltip
            />
            <el-table-column
              prop="platVersion"
              :label="$t('monitorManage.version')"
              min-width="60"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('public.state')" min-width="60" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="row.status == 1 ? 'success' : 'danger'">
                  {{ set_status(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('public.createTime')"
              min-width="90"
              show-overflow-tooltip
            />
            <el-table-column
              prop="updateTime"
              :label="$t('public.updateTime')"
              min-width="90"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('public.operating')" min-width="100">
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

    <surveillance-detail></surveillance-detail>
    <add-surveillance></add-surveillance>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'

import { mapState, mapActions } from 'vuex'

import addSurveillance from './component/addSurveillance'
import surveillanceDetail from './component/surveillanceDetail'
import lazyTree from '@/components/lazy-tree'//懒加载树
import breadcrumb from '@/components/breadcrumb' // 面包屑
export default {
  name: 'MonitorPlatformManagement',
  components: {
    'surveillance-detail': surveillanceDetail,
    'add-surveillance': addSurveillance,
    'lazy-tree': lazyTree,
    breadcrumb
  },

  data() {
    return {
      isRouterAlive: true,
      PermissionInfo: true, //用户权限判断
      PermissionManage: true, //用户权限判断

      locale: localStorage.getItem('locale'),

      organizationId: 0,

      keyword: '', // 用户名称搜素
      isSearch: false,

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      // 分页
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: false, // true:添加, false:编辑
      dialogFormVisible: false, // 添加或者编辑
      platDetailVisible: false, //平台详情
      dataForm: {
        platName: '', //平台名称
        platType: '', //平台类型
        platAccount: '', //鉴权账号
        password: '', //鉴权密码
        serverPort: '', //端口
        serverIntranetIp: '', //内网IP
        serverPublicIp: '', //公网IP
        serverAddr: '', //服务地址
        platVersion: '', //平台版本
        remark: '' //备注
      },

      statusList: [],
      maskloading: false // 点击提交按钮后蒙版
    }
  },
  computed: {
    ...mapState({
      plaTypesList: state => state.dict['plat-type'] // 平台类型
    })
  },
  watch: {
    '$i18n.locale': function () {
      this.getStatusList()
      this.locale = localStorage.getItem('locale')
    }
  },

  async created() {
    await this.getPermissions()
    await this.getStatusList()
  },
  activated() {
    this.setDialogCss()
  },

  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(11)
      this.PermissionManage = await permissions(12)
    },
    getStatusList() {
      this.statusList = [
        {
          value: 0,
          name: this.$t('public.toBeAdded')
        },
        {
          value: 1,
          name: this.$t('public.normal')
        },
        {
          value: 2,
          name: this.$t('public.connectionAbnormal')
        },
        {
          value: 3,
          name: this.$t('public.platformAbnormal')
        }
      ]
    },
    // 树加载完初始化表格
    async initData(list) {
      const payload = list[0].payload
      this.organizationId = payload.organizationId

      //初始化面包屑
      this.$refs.breadcrumb.initBread(list)
      await this.getPlatTypes()
      await this.showTable()
    },
    // 点击树节点
    treeNodeClick(obj) {
      // 点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)

      this.organizationId = obj.data.payload.organizationId
      this.search_clear()
      this.handleFind()
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },

    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getPlatTypes() {
      this.getSysDictData(['plat-type'])
    },

    //展示表格
    showTable() {
      this.dataText = ''
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId
      }
      if (this.isSearch && this.keyword !== '') {
        obj.platName = this.keyword
      }
      this.$api.getPlatformList(obj).then(res => {
        if (res.platList && res.platList.length != 0) {
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

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.keyword = ''
      }
    },
    // 查找
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.showTable()
    },

    // 添加
    handleAdd() {
      this.dataForm = {
        platName: '',
        platType: '',
        platAccount: '',
        password: '',
        serverPort: '',
        serverIntranetIp: '',
        serverPublicIp: '',
        serverAddr: '',
        platVersion: '',
        remark: '',
        platUserId: '',
        accessMode: '',
        streamProtocol: ''
      }
      this.operation = true
      this.dialogFormVisible = true
    },

    async getPlatformInfo(flag, platId) {
      let res = await this.$api.getPlatformInfo({ platId })
      if (res.resultCode != 0) return
      this.dataForm = { ...res }
      this.dataForm.platType = String(res.platType)
      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.platDetailVisible = true
      }
    },
    // 详情
    async handleInfo(row) {
      await this.getPlatformInfo(0, row.platId)
    },

    // 编辑
    async handleEdit(row) {
      await this.getPlatformInfo(1, row.platId)
    },

    // 删除用户
    handleDelete(row) {
      this.$confirm(
        this.$t('monitorManage.thisOperationDeletesThePlatform'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          let obj = {}
          obj.platId = row.platId
          this.$api.deletePlatformInfo(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.showTable()
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
    setPlatType(val) {
      let name = ''
      this.plaTypesList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    set_status(val) {
      let name = ''
      this.statusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
      // 0-待添加（暂未使用）1-正常 2-连接异常 3-平台异常
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.showTable()
    }
  }
}
</script>

<style lang="scss">
#surveillance {
  width: 100%;
  height: 100%;
  .btnMargin {
    display: flex;
    justify-content: space-between;
  }
}
</style>
