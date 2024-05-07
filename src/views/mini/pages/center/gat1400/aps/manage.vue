<template>
  <!-- 卡口管理 -->
  <div id="apsManage" v-if="isRouterAlive" ref="apsManage">
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
        <div style="margin: 20px 0 20px">
          <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
            {{ $t('deviceManagement.addCollectionSystem') }}
          </el-button>

          <el-button type="danger" @click="handleDel" :disabled="delShow" v-if="PermissionManage">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '180px' : '127px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('deviceManagement.systemName') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.apsName"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputSystemName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('platformManagement.encoding') + ':'"
                prop="cameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.apsId"
                  auto-complete="off"
                  :placeholder="$t('platformManagement.inputInterconnectionCode')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('platformManagement.onlineStatus') + ':'"
                prop="thirdCameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.isOnline"
                  :placeholder="$t('deviceManagement.selectOnlineStatus')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in isOnlineList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('platformManagement.onlineStatus') + ':'"
                  prop="thirdCameraId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.isOnline"
                    :placeholder="$t('deviceManagement.selectOnlineStatus')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in isOnlineList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('platformManagement.IPAddress') + ':'"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.ipAddr"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputIPAddress')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
              <div class="flexstart"></div>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <div @click="manyCondition" class="manyCondition inputMiddle">
                <span>{{ $t('public.manyCondition') }}</span>
                <span :class="iconName"></span>
              </div>
            </div>
          </el-form>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <!-- 表格 -->
          <el-table
            :max-height="tableHeight"
            v-if="!loading && tableData.length"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            @row-contextmenu="rowContextmenu"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('deviceManagement.systemName')"
              min-width="110"
              show-overflow-tooltip
              prop="apsName"
            />

            <el-table-column
              :label="$t('platformManagement.encoding')"
              min-width="110"
              show-overflow-tooltip
              prop="apsId"
            />

            <el-table-column
              :label="$t('platformManagement.account')"
              min-width="100"
              show-overflow-tooltip
              prop="account"
            />

            <el-table-column
              :label="$t('platformManagement.IPAddress')"
              min-width="65"
              show-overflow-tooltip
              prop="ipAddr"
            />

            <el-table-column
              :label="$t('platformManagement.port')"
              min-width="60"
              show-overflow-tooltip
              prop="port"
            />

            <el-table-column
              :label="$t('platformManagement.onlineStatus')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="setIsOnlineClass(row.isOnline)">
                  {{ setIsOnline(row.isOnline) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.creationTime')"
              min-width="65"
              show-overflow-tooltip
              prop="createTime"
            />

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)" v-if="PermissionManage">
                  {{ $t('public.modify') }}
                </span>
                <span
                  style="color: #f56c6c; cursor: pointer"
                  v-if="PermissionManage"
                  @click="handleDelete(row)"
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

    <!-- 添加对话框 -->
    <aps-add></aps-add>

    <!-- 详情对话框 -->
    <aps-detail></aps-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :what="$t('deviceManagement.acquisitionSystem')"
      @getList="getApsList"
      :operate="operate"
      :batchApi="batchApi"
      whatId="apsId"
      whatName="apsName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
      @searchClear="search_clear"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { mapState, mapActions } from 'vuex'

import apsAdd from './component/aps-add'
import apsDetail from './component/aps-detail'
import breadcrumb from '@/components/breadcrumb' //面包屑
import batchOperate from '@/components/batchOperate' //批量操作

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  name: 'ApsSystemManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {
    'aps-add': apsAdd,
    'aps-detail': apsDetail,
    batchOperate,
    breadcrumb
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,

      organizationId: null,
      organizationName: '', //组织名称

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      // 条件搜索
      searchForm: {
        apsName: '',
        apsId: '',
        isOnline: '',
        ipAddr: ''
      },
      isSearch: false,

      operate: '',
      batchApi: '',
      batchDialogVisible: false, //批量操作对话框
      multipleSelection: [], //表格选中状态存放数组
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 630,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      addApsVisible: false, // 添加对话框

      apsDetailVisible: false, // 详情对话框
      apsDetailForm: {}, // 详情表单
      operatorForm: {},

      modifyApsForm: {}, // 修改表单

      delShow: true, //批量删除

      platId: '', //平台Id

      maskloading: false,

      //1400参数
      operation: true,

      choosedId: '',
      treeProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },

      spliceFirstBread: true,
      choosedOrgType: '',
      tollgateID: '',
      tollgateName: '',
      laneCheckedNodes: [],
      camerasArray: [],

      tollgatesList: [],

      batchList: [],
      batchImportErrorList: [],
      importSuccNum: 0,
      choosedNum: 0,
      batchImportDialogVisible: false,

      //采集系统
      isOnlineList: []
    }
  },
  computed: {
    ...mapState({
      authorityList: state => state.dict['authority_type'],
      apsAccessTypeList: state => state.dict['aps_access_type']
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.pageResize()
      this.setData()
    }
  },
  async created() {},
  mounted() {
    this.pageResize()
    this.setData()
    this.getDictionary()
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },

  methods: {
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1916)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(356)
      this.PermissionManage = await permissions(357)
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        withTenant: 2,
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        setTimeout(() => {
          this.$refs.breadcrumb.initBread(list)
        }, 100)

        if (level == 0 && list.length) {
          this.$nextTick().then(async () => {
            this.idArr = [list[0].id]

            const payload = list[0].payload
            this.organizationId = payload.organizationId
            this.tollgateID = payload.tollgateID
            this.organizationName = payload.parents.split(',')
            this.organizationName.pop()
            this.$refs.treeList.setCurrentKey(list[0].id)
            await this.getApsList()
          })
        } else if (level == 0 && list.length == 0) {
          this.treeEmptyText = this.$t('public.noData')
        }

        this.treeLoading = false
        return resolve(list)
      })
    },

    // 点击树节点 !
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)

      this.organizationId = data.id
      this.tollgateID = data.payload.tollgateID
      this.tollgateName = data.payload.tollgateName
      this.organizationName = data.payload.parents.split(',')
      this.organizationName.pop()

      this.choosedOrgType = data.type

      this.search_clear()
      this.getApsList()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    getApsList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId
      }

      if (this.isSearch) {
        Object.assign(data, this.searchForm)
      }
      this.$api.apsList(data).then(res => {
        this.apsListBack(res)
      })
    },
    apsListBack(res) {
      if (res.apsInfoList && res.apsInfoList.length != 0) {
        this.tableData = res.apsInfoList
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
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['authority_type', 'aps_access_type'])
    },

    setIsOnlineClass(val) {
      if (val == '1') {
        return 'success'
      } else if (val == '2') {
        return 'danger'
      }
    },
    setIsOnline(val) {
      let name = ''
      this.isOnlineList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    // 国际化
    setData() {
      this.isOnlineList = [
        {
          name: this.$t('public.statustype1'),
          value: '1'
        },
        {
          name: this.$t('public.statustype2'),
          value: '2'
        },
        {
          name: this.$t('public.Else'),
          value: '9'
        }
      ]
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          apsName: '',
          apsId: '',
          isOnline: '',
          ipAddr: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getApsList()
    },

    // 添加 !
    async handleAdd() {
      this.operation = true
      this.addApsVisible = true
    },

    // 批量删除 ！
    handleDel() {
      this.$confirm(
        this.$t('deviceManagement.deleteLanes', {
          num: this.multipleSelection.length
        }),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.loading = true
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'delAps'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 556 : 630
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
    },

    // 修改
    async handleEdit(row) {
      let res = await this.$api.apsDetails({ apsId: row.apsId })
      if (res.resultCode != 0) return
      this.choosedId = row.id
      let res1 = await this.$api.getOrganizationInfo({
        organizationId: res.apsInfo.organizationId
      })
      let organizationName = res1.organizationInfo.parents.split(',')
      organizationName.pop()
      this.modifyApsForm = {
        organizationId: res.apsInfo.organizationId,
        organizationName: organizationName,
        apsName: res.apsInfo.apsName,
        apsId: res.apsInfo.apsId,
        authority: res.apsInfo.authority,
        apsAccessType: res.apsInfo.apsAccessType + '',
        account: res.apsInfo.account,
        password: res.apsInfo.password ? res.apsInfo.password : '',
        confirmPwd: res.apsInfo.password ? res.apsInfo.password : '',
        ipAddr: res.apsInfo.ipAddr,
        ipv6Addr: res.apsInfo.ipv6Addr,
        port: res.apsInfo.port,
        remark: res.apsInfo.remark
      }

      this.operation = false
      this.addApsVisible = true
    },

    // 详情
    async handleInfo(row) {
      let res = await this.$api.apsDetails({ apsId: row.apsId })
      if (res.resultCode != 0) return
      this.apsDetailForm = {
        organizationId: res.apsInfo.organizationId,
        organizationName: res.apsInfo.organizationName,
        apsName: res.apsInfo.apsName,
        apsId: res.apsInfo.apsId,
        authority: res.apsInfo.authority,
        apsAccessType: res.apsInfo.apsAccessType,
        account: res.apsInfo.account,
        password: '******',
        ipAddr: res.apsInfo.ipAddr,
        ipv6Addr: res.apsInfo.ipv6Addr,
        port: res.apsInfo.port,
        remark: res.apsInfo.remark
      }

      this.apsDetailVisible = true
    },

    handleDelete(row) {
      this.$confirm(this.$t('deviceManagement.deleteSystem'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delAps({ apsId: row.apsId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getApsList()
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
      this.search_clear()
      this.getApsList()
    }
  }
}
</script>

<style lang="scss">
#apsManage {
  width: 100%;
  height: 100%;

  .flex-item {
    width: 42%;
  }

  //一排三表单
  .screenthree {
    width: 25% !important;
  }
  .el-select {
    width: 100%;
  }

  .el-dialog__body {
    padding: 15px 40px 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
}
</style>
