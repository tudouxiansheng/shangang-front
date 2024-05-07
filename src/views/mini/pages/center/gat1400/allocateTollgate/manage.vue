<template>
  <div id="allocateTollgateManage" v-if="isRouterAlive" ref="allocateTollgateManage">
    <el-row v-if="!showSubInfo">
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :data="treeData"
              :props="treeProps"
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconStyPlat(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div style="margin: 20px 0 20px">
          <el-button type="primary" @click="handleSync" v-if="PermissionManage" :disabled="isFlag">
            {{ $t('cascadeDevice.dataSynchronization') }}
          </el-button>
          <el-button
            type="primary"
            @click="handleAllocate"
            v-if="PermissionManage"
            :disabled="isFlag"
          >
            {{ $t('cascadeDevice.bayonetAllocation') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '200px' : '84px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('deviceManagement.bayoneNname') + ':'">
                <el-input
                  v-model="searchForm.name"
                  clearable
                  :placeholder="$t('deviceManagement.inputBayoneNname')"
                />
              </el-form-item>
              <el-form-item :label="$t('cascadeDevice.bayonetID') + ':'">
                <el-input
                  v-model="searchForm.tollgateID"
                  clearable
                  :placeholder="$t('cascadeDevice.inputBayonetID')"
                />
              </el-form-item>
              <el-form-item :label="$t('deviceManagement.bayonetStatus') + ':'">
                <el-select v-model="searchForm.status" clearable>
                  <el-option
                    v-for="(item, index) in isOnlineList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <el-button @click="handleRest" class="miniBtn">{{ $t('public.reset') }}</el-button>
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
              :label="$t('deviceManagement.bayoneNname')"
              min-width="110"
              show-overflow-tooltip
              prop="name"
            />

            <el-table-column
              :label="$t('cascadeDevice.bayonetID')"
              min-width="100"
              show-overflow-tooltip
              prop="tollgateID"
            />

            <el-table-column
              :label="$t('deviceManagement.bayonetType')"
              min-width="70"
              show-overflow-tooltip
              prop="model"
            >
              <template #default="{ row }">
                <span>{{ setTollgateCat(row.tollgateCat) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.bayonetStatus')"
              min-width="70"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setIsOnline(row.status) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
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

    <!-- //卡口分配弹框 -->
    <tollgate-allocate></tollgate-allocate>
    <!-- //卡口详情弹框 -->
    <tollgate-info></tollgate-info>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { mapState, mapActions } from 'vuex'

import tollgateAllocate from './component/tollgate-allocate'
import tollgateInfo from './component/tollgate-info'
import breadcrumb from '@/components/breadcrumb' //面包屑

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  name: 'AllocateTollgateManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {
    'tollgate-allocate': tollgateAllocate,
    'tollgate-info': tollgateInfo,
    breadcrumb
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isFlag: false,
      isRouterAlive: true,
      chooseAutoAllocate: false,
      screenFlag: true,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      treeData: [],

      organizationId: null,
      organizationName: '', //组织名称

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      // 条件搜索
      searchForm: {
        name: '',
        tollgateID: '',
        status: ''
      },
      isSearch: false,

      multipleSelection: [], //表格选中状态存放数组
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 630,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      dialogvisible_detail: false,
      detailForm: {}, // 详情表单

      delShow: true, //批量删除

      viewClassLevel: [], // 级联视图库级别
      algorithmList: [],
      protocolList: [],
      typeList: [],

      platId: '', //平台Id

      maskloading: false,

      operation: true,
      tollgateStatusList: [], //卡口状态
      choosedId: '',

      choosedOrgName: '',

      //5.7.4新增
      showSubInfo: false,
      choosedType: '',
      platformStatusList: [],
      dialogvisible_allocate: false,

      dialogTableData: [],

      choosedPlatId: '',
      choosedPlatName: '',

      isOnlineList: [],
      treeProps: {
        label: 'label',
        children: 'children'
      }
    }
  },

  computed: {
    ...mapState({
      tollgateCatList: state => state.dict['tollgate_type'],
      tollgateCat2List: state => state.dict['tollgate_application'],
      cityPassList: state => state.dict['city_pass_type']
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.pageResize()
      this.setData()
    }
  },
  created() {
    this.getTree()
  },
  mounted() {
    this.pageResize()
    this.setData()
    this.getDictionary()
  },
  activated() {
    
    this.pageResize()
  },

  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(350)
      this.PermissionManage = await permissions(351)
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1916)
    },

    async getTree() {
      let res = await this.$api.getVirPlatTree({ platformType: 2 })
      this.treeData = res.nodeList || []
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb.initBread(this.treeData)
      }, 100)

      this.treeLoading = false
      if (this.treeData.length) {
        this.$nextTick().then(async () => {
          this.idArr = [this.treeData[0].id]
          this.$refs.treeList.setCurrentKey(this.treeData[0].id)
          const payload = this.treeData[0].payload
          this.organizationId = payload.organizationId
          this.organizationName = payload.organizationName

          this.choosedOrgName = payload.organizationName
        })
      } else if (this.treeData.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },

    // 点击树节点 !
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread_lane(data, node)

      this.organizationId = data.payload.organizationId
      this.organizationName = data.payload.organizationName

      this.search_clear()

      if (data.type == '2') {
        this.choosedPlatId = data.payload.resourceUri
        this.choosedPlatName = data.payload.platformName
        this.chooseAutoAllocate = data.payload.autoAllocate
        this.getViewPlatList()
      } else {
        this.choosedPlatId = ''
        this.tableData = []
      }
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    iconStyPlat(node) {
      if (node.type == 1) {
        return 'aci-organization'
      } else if (node.type == 2) {
        return 'aci-tv'
      }
    },
    // 加载卡口列表 ！
    getViewPlatList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },

        platId: this.choosedPlatId,
        name: this.searchForm.name,
        tollgateID: this.searchForm.tollgateID,
        status: this.searchForm.status ? this.searchForm.status : null
      }
      if (this.chooseAutoAllocate) {
        this.isFlag = true
      } else {
        this.isFlag = false
      }
      this.$api.selectVirTollgate(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      if (res.tollgateInfoList && res.tollgateInfoList.length != 0) {
        this.tableData = res.tollgateInfoList
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
      this.dialogTableData = JSON.parse(JSON.stringify(this.tableData))
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['tollgate_type', 'tollgate_application', 'city_pass_type'])
    },

    setTollgateCat(val) {
      let name = ''
      this.tollgateCatList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setTollgateCat2(val) {
      let name = ''
      this.tollgateCat2List.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setCityPass(val) {
      let name = ''
      this.cityPassList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setStatus(val) {
      let name = ''
      this.tollgateStatusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
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
      this.viewClassLevel = [
        {
          AmainDev: 0,
          mainDevName: this.$t('public.mainDevName3')
        },
        {
          AmainDev: 1,
          mainDevName: this.$t('public.mainDevName1')
        }
      ]
      this.algorithmList = [
        {
          network: '1',
          networkName: this.$t('public.WireLess4g')
        },
        {
          network: '2',
          networkName: this.$t('public.FixedNetwork')
        },
        {
          network: '3',
          networkName: this.$t('public.HomeBroad')
        },
        {
          network: '0',
          networkName: this.$t('public.Else')
        }
      ]
      this.protocolList = [
        {
          name: 'http',
          value: 1
        },
        {
          name: 'https',
          value: 2
        }
      ]
      this.typeList = [
        {
          name: this.$t('newAccess.superior'),
          value: 1
        },
        {
          name: this.$t('newAccess.subordinate'),
          value: 2
        }
      ]
      this.platformStatusList = [
        {
          name: this.$t('newAccess.unLink'),
          value: 0
        },
        {
          name: this.$t('newAccess.online'),
          value: 1
        },
        {
          name: this.$t('newAccess.offline'),
          value: 2
        }
      ]
      this.isOnlineList = [
        {
          name: this.$t('public.normal'),
          value: '1'
        },
        {
          name: this.$t('public.deactivate'),
          value: '2'
        },
        {
          name: this.$t('deviceManagement.other'),
          value: '9'
        }
      ]
      this.tollgateStatusList = [
        {
          name: this.$t('newAccess.online'),
          value: 1
        },
        {
          name: this.$t('newAccess.offline'),
          value: 2
        },
        {
          name: this.$t('deviceManagement.other'),
          value: 9
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
          name: '',
          tollgateID: '',
          status: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      if (!this.choosedPlatId) {
        this.$message({
          message: this.$t('cascadeDevice.selectPlatformFirst'),
          type: 'warning'
        })
        return
      }
      this.pageNum = 1
      this.isSearch = true
      this.getViewPlatList()
    },

    handleRest() {
      this.searchForm = {
        name: '',
        apeID: '',
        status: ''
      }
    },

    // 卡口同步
    handleSync() {
      if (!this.choosedPlatId) {
        this.$message({
          message: this.$t('cascadeDevice.selectPlatformFirst'),
          type: 'warning'
        })
        return
      }
      this.$api.syncWeb({ platId: this.choosedPlatId }).then(res => {
        if (res.resultCode == 0) {
          this.getViewPlatList()
          this.$message({
            message: this.$t('cascadeDevice.dataSynchronizationSucess'),
            type: 'success'
          })
        }
      })
    },

    // 卡口分配
    async handleAllocate() {
      if (!this.choosedPlatId) {
        this.$message({
          message: this.$t('cascadeDevice.selectPlatformFirst'),
          type: 'warning'
        })
        return
      }
      this.dialogTableData = JSON.parse(JSON.stringify(this.tableData))

      this.dialogvisible_allocate = true
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

    // 详情
    async handleInfo(row) {
      this.detailForm = row
      this.dialogvisible_detail = true
    },

    //订阅详情
    subscriptionInfo(row) {
      this.choosedType = row.type
      this.showSubInfo = true
    },

    // 分页
    getListByPage() {
      this.search_clear()
      this.getViewPlatList()
    }
  }
}
</script>

<style lang="scss">
#allocateTollgateManage {
  width: 100%;
  height: 100%;
.search-form .el-form-item--small.el-form-item{
   width: 27%;
}
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .flex-item {
    width: 42%;
  }

  .el-dialog__body {
    padding: 15px 40px 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
}
</style>
