<template>
  <div id="juniorDevAssociate" v-if="isRouterAlive" ref="juniorDevAssociate">
    <el-row>
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
          <el-button type="primary" @click="handleAss" v-if="PermissionManage">
            {{ $t('juniorDevAssociate.devAllot') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '184px' : '84px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('juniorDevAssociate.devName') + ':'">
                <el-input
                  v-model="searchForm.name"
                  clearable
                  :placeholder="$t('juniorDevAssociate.inputDevName')"
                />
              </el-form-item>
              <el-form-item :label="$t('juniorDevAssociate.apeID') + ':'">
                <el-input
                  v-model="searchForm.id"
                  clearable
                  :placeholder="$t('juniorDevAssociate.inputApeID')"
                />
              </el-form-item>
              <el-form-item :label="$t('juniorDevAssociate.devStatus') + ':'">
                <el-select v-model="searchForm.status" clearable>
                  <el-option
                    v-for="(item, index) in platformStatusList"
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
              :label="$t('juniorDevAssociate.devId')"
              min-width="110"
              show-overflow-tooltip
              prop="id"
            />

            <el-table-column
              :label="$t('juniorDevAssociate.devName')"
              min-width="110"
              show-overflow-tooltip
              prop="name"
            />

            <el-table-column
              :label="$t('juniorDevAssociate.apeID')"
              min-width="100"
              show-overflow-tooltip
              prop="apeID"
            >
              <template #default="{ row }">
                <span>{{ row.apeID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('juniorDevAssociate.devModel')"
              min-width="60"
              show-overflow-tooltip
              prop="model"
            />

            <el-table-column
              :label="$t('juniorDevAssociate.devStatus')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setStatus(row.isOnline) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('juniorDevAssociate.createTime')"
              min-width="90"
              show-overflow-tooltip
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
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

    <!-- //设备关联弹框 -->
    <device-associate ref="devAss" v-if="showDevAss"></device-associate>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :multipleSelectionMany="multipleSelectionMany"
      :what="what"
      @getList="getViewPlatList"
      :operate="operate"
      :batchApi="batchApi"
      :whatId="whatId"
      :whatName="whatName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
      @searchClear="search_clear"
    />

    <device-detail></device-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { permissions } from "@/utils/common/permissions";
import deviceAssociate from "./component/device-associate"
import batchOperate from "@/components/batchOperate";
import deviceDetail from "../device/component/device-detail"
import breadcrumb from "@/components/breadcrumb"; //面包屑
import { mapState, mapActions } from "vuex";

import tableCopy from "@/mixin/tableCopy.js";
import getLazyTree from "@/mixin/getLazyTree.js";
import judgeWindow from "@/mixin/judgeWindow";

export default {
  name: 'JuniorViewLibraryDeviceAllocate',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {
    'device-associate': deviceAssociate,
    batchOperate,
    deviceDetail,
    breadcrumb
  },
  data() {
    return {
      what: '',
      operate: '',
      batchApi: '',
      whatId: '',
      whatName: '',
      multipleSelectionMany: [],
      batchDialogVisible: false,
      //

      showDevAss: true,

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
        name: '',
        id: '',
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

      pageloading: false,

      addMainDevVisible: false, // 添加对话框

      mainDevDetailVisible: false, // 详情对话框
      mainDevDetailForm: {}, // 详情表单
      operatorForm: {},

      modifyMainForm: {}, // 修改表单

      delShow: true, //批量删除

      viewClassLevel: [], // 级联视图库级别
      algorithmList: [],
      protocolList: [],
      typeList: [],

      platId: '', //平台Id

      maskloading: false,

      operation: true,
      choosedId: '',

      choosedOrgName: '',

      //5.7.4新增
      showSubInfo: false,
      choosedType: '',
      platformStatusList: [],
      dialogvisible_ass: false,
      treeData: [],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      choosedPid: ''
    }
  },

  computed: {
    ...mapState({
      authorityList: state => state.dict['authority_type'],
      statusList: state => state.dict['status_type'],
      placeTypeList: state => state.dict['device_location_lable'],
      capDirectionList: state => state.dict['vehicle_snapshot_direction'],
      functionTypeList: state => state.dict['ape_function_type'],
      monitorDirectionList: state => state.dict['direction_type']
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
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1916)
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(350)
      this.PermissionManage = await permissions(351)
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
          if (this.$refs.treeList) {
            this.$refs.treeList.setCurrentKey(this.treeData[0].id)
          }
          const payload = this.treeData[0].payload
          this.organizationId = payload.organizationId
          this.organizationName = this.treeData[0].payload.parents.split(',')
          this.organizationName.pop()

          this.choosedOrgName = payload.organizationName

          await this.getViewPlatList()
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

      this.choosedOrgName = data.payload.organizationName

      this.choosedPid = data.payload.platformId || ''

      this.search_clear()

      this.getViewPlatList()
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
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci-organization'
      } else if (node.type == 1 && node.payload.type == 2) {
        return 'aci-x006-folder'
      } else if (node.type == 2) {
        return 'aci-tv'
      }
    },
    // 加载设备列表 ！
    getViewPlatList() {
      this.dataText = ''
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },

        apeMatch: {
          organizationId: this.organizationId
        }
      }

      this.$api.getApeList(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      this.loading = true
      if (res.apeInfoList && res.apeInfoList.length != 0) {
        this.tableData = res.apeInfoList

        this.totalNum = res.pageInfo.totalNum

        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0);
        });
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
      this.getSysDictData([
        'authority_type',
        'status_type',
        'device_location_lable',
        'vehicle_snapshot_direction',
        'ape_function_type',
        'direction_type'
      ])
    },

    setmainDevType(val) {
      if (val == 0) {
        return this.$t('public.mainDevName0')
      } else if (val == 1) {
        return this.$t('public.mainDevName1')
      } else if (val == 2) {
        return this.$t('public.mainDevName2')
      } else if (val == 3) {
        return this.$t('public.mainDevName3')
      } else if (val == 4) {
        return this.$t('public.mainDevName4')
      } else {
        return ''
      }
    },
    setFunctionType(val) {
      let name = ''
      this.functionTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setType(val) {
      let name = ''
      this.typeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setAlgorithm(val) {
      let name = ''
      this.authorityList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setProtocol(val) {
      let name = ''
      this.protocolList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setStatus(val) {
      let name = ''
      this.statusList.filter(item => {
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
          name: this.$t('juniorDevAssociate.type1'),
          value: 1
        },
        {
          name: this.$t('juniorDevAssociate.type2'),
          value: 2
        }
      ]
      this.platformStatusList = [
        {
          name: this.$t('juniorDevAssociate.platformStatus0'),
          value: 0
        },
        {
          name: this.$t('juniorDevAssociate.platformStatus1'),
          value: 1
        },
        {
          name: this.$t('juniorDevAssociate.platformStatus2'),
          value: 2
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
          id: '',
          status: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      if (!this.choosedPid) {
        this.$message({
          type: 'warning',
          message: this.$t('juniorDevAssociate.searchPrompt')
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
        id: '',
        status: ''
      }
    },

    handleAss() {
      if (!this.choosedPid) {
        this.$message({
          type: 'warning',
          message: this.$t('juniorDevAssociate.devLinkPrompt')
        })
        return
      }
      this.showDevAss = false
      this.$nextTick(() => {
        this.showDevAss = true
      })
      this.dialogvisible_ass = true
    },

    // 批量取消 ！
    handleDel() {
      let pormpt = ''
      if (this.locale == 'en') {
        pormpt =
          this.$t('juniorDevAssociate.thisSelected') +
          ' ' +
          this.multipleSelection.length +
          ' ' +
          this.$t('juniorDevAssociate.devCancelLinkPrompt') +
          ',' +
          this.$t('public.bulkDelPrompt2')
      } else {
        pormpt = '此操作将选中的' + this.multipleSelection.length + '个设备取消关联, 是否继续?'
      }
      this.$confirm(pormpt, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(async () => {
          this.loading = true

          this.what = this.$t('juniorDevAssociate.dev')
          this.operate = this.$t('public.cancel')
          this.batchApi = 'deleteRelation'
          this.whatId = 'id'
          this.whatName = 'name'
          this.multipleSelectionMany = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.multipleSelectionMany.push({
              pid: this.choosedPid,
              aid: this.multipleSelection[i].id
            })
          }

          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    async batchOperate() {
      this.loading = true

      this.what = this.$t('juniorDevAssociate.dev')
      this.operate = this.$t('distribution.MassDistributionContent')
      this.batchApi = 'relate'
      this.whatId = 'id'
      this.whatName = 'name'
      this.multipleSelectionMany = []
      for (let i = 0; i < this.$refs.devAss.multipleSelection.length; i++) {
        this.multipleSelectionMany.push({
          pid: this.$refs.devAss.choosedDialogPlatId,
          aid: this.$refs.devAss.multipleSelection[i].id
        })
      }

      this.batchDialogVisible = true
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
      let res = await this.$api.getApeDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        organizationId: this.organizationId,
        organizationName: this.choosedOrgName,

        name: res.apeInfo.name,
        alias: res.apeInfo.alias, //
        apeID: res.apeInfo.apeID,
        type: res.apeInfo.type, //
        manufacturer: res.apeInfo.manufacturer, //
        authority: res.apeInfo.authority, //
        model: res.apeInfo.model,
        serviceIp: res.apeInfo.serviceIp, //
        userId: res.apeInfo.userId, //
        ipAddr: res.apeInfo.ipAddr,
        mac: res.apeInfo.mac, //
        place: res.apeInfo.place, //
        longitude: res.apeInfo.longitude,
        placeType: res.apeInfo.placeType, //
        capDirection: res.apeInfo.capDirection,
        police: res.apeInfo.police,
        contact: res.apeInfo.contact,
        password: '******',
        ipv6Addr: res.apeInfo.ipv6Addr,
        port: res.apeInfo.port,
        placeCode: res.apeInfo.placeCode,
        latitude: res.apeInfo.latitude,
        monitorDirection: res.apeInfo.monitorDirection,
        monitorAreaDesc: res.apeInfo.monitorAreaDesc, //
        managementName: res.apeInfo.managementName, //
        installTime: res.apeInfo.installTime,

        functionType: res.apeInfo.functionType
      }

      this.mainDevDetailVisible = true
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
#juniorDevAssociate {
  width: 100%;
  height: 100%;

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
