<template>
  <!-- 卡口管理 -->
  <div
    id="bayonetManage"
    v-if="isRouterAlive"
    ref="bayonetManage"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
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
            {{ $t('deviceManagement.addBayonet') }}
          </el-button>

          <el-button v-if="PermissionManage" type="primary" @click="getTemplate">
            {{ $t('public.getTemplate') }}
          </el-button>

          <batch-import
            ref="batchImport"
            @batchImport="batchImport"
            :ifSplice="true"
            v-if="PermissionManage"
          ></batch-import>

          <el-button type="danger" @click="handleDel" :disabled="delShow" v-if="PermissionManage">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '210px' : '127px'"
            ref="form"
            :model="searchForm"
            label-position="left"
            :rules="rules"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('deviceManagement.bayoneNname') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.name"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputBayoneNname')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('deviceManagement.bayonetType') + ':'"
                prop="cameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.tollgateCat"
                  :placeholder="$t('deviceManagement.selectBayonetType')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in tollgateCatList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('deviceManagement.bayonetStatus') + ':'"
                prop="thirdCameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.status"
                  :placeholder="$t('deviceManagement.selectBayonetStatus')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in statusList"
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
                  :label="$t('deviceManagement.bayonetStatus') + ':'"
                  prop="thirdCameraId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.status"
                    :placeholder="$t('deviceManagement.selectBayonetStatus')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in statusList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.bayonetPurpose') + ':'"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.tollgateCat2"
                    :placeholder="$t('deviceManagement.selectBayonetPurpose')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in tollgateCat2List"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.bayonetPosition') + ':'"
                  auto-complete="off"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-input
                    v-model="searchForm.place"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputBayonetPosition')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.bayonetLanes') + ':'"
                  auto-complete="off"
                  prop="laneNum"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-input
                    v-model="searchForm.laneNum"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputBayonetLanes')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
              <div class="flexstart">
                <el-form-item
                  :label="$t('deviceManagement.bayonetPosition') + ':'"
                  auto-complete="off"
                  prop="platId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.place"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputBayonetPosition')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('deviceManagement.bayonetLanes') + ':'"
                  auto-complete="off"
                  prop="laneNum"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.laneNum"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputBayonetLanes')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
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
            style="width: 100%"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('deviceManagement.bayonetName')"
              width="220"
              show-overflow-tooltip
              prop="name"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.bayonetCcoding')"
              width="220"
              show-overflow-tooltip
              prop="id"
            >
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.encoding')"
              width="160"
              show-overflow-tooltip
              prop="tollgateID"
            >
              <template #default="{ row }">
                <span>{{ row.tollgateID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.bayonetType')"
              width="180"
              show-overflow-tooltip
              prop="tollgateCat"
            >
              <template #default="{ row }">
                <span>{{ setTollgateCat(row.tollgateCat) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.bayonetPurpose')"
              width="200"
              show-overflow-tooltip
              prop="tollgateCat2"
            >
              <template #default="{ row }">
                <span>{{ setTollgateCat2(row.tollgateCat2) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.bayonetStatus')"
              width="220"
              show-overflow-tooltip
              prop="status"
            >
              <template #default="{ row }">
                <span :class="setStatusClass(row.status)">
                  {{ setStatus(row.status) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.enableTime')"
              width="250"
              show-overflow-tooltip
              prop="activeTime"
            >
              <template #default="{ row }">
                <span>{{ row.activeTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" width="150" fixed="right">
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
    <tollgate-add></tollgate-add>

    <!-- 详情对话框 -->
    <tollgate-detail></tollgate-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="
        operate == $t('public.batchDeletionContent') ? multipleSelection : batchList
      "
      :multipleSelectionMany="multipleSelectionMany"
      :what="what"
      @getList="getBayonetList"
      :operate="operate"
      :batchApi="batchApi"
      :whatId="whatId"
      :whatName="whatName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'

import { mapState, mapActions } from 'vuex'

import tollgateAdd from './component/tollgate-add'
import tollgateDetail from './component/tollgate-detail'
import batchImport from '@/components/batchImport'
import batchOperate from '@/components/batchOperate'
import breadcrumb from '@/components/breadcrumb' //面包屑

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

import areaCodeBackfill from '@/mixin/areaCodeBackfill'

export default {
  name: 'TollgateManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow, areaCodeBackfill],
  components: {
    'tollgate-add': tollgateAdd,
    'tollgate-detail': tollgateDetail,
    'batch-import': batchImport,
    batchOperate,
    breadcrumb
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      what: '',
      operate: '',
      batchApi: '',
      whatId: '',
      whatName: '',
      multipleSelectionMany: [],
      batchDialogVisible: false,
      //
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
        tollgateCat: '',
        status: '',
        tollgateCat2: '',
        place: '',
        laneNum: ''
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

      mainDevTypeData: [], // 设备类型
      ptzTypeData: [], // 摄像机类型
      manufacturerData: [],

      platId: '', //平台Id

      maskloading: false,

      operation: true,
      statusList: [], //卡口状态

      areaCodeOptions: [], //组织区号级联列表

      choosedId: '',
      choosedTollgateID: '',
      choosedTollgateName: '',

      batchList: [],

      rules: {}
    }
  },

  computed: {
    ...mapState({
      tollgateCatList: state => state.dict['tollgate_type'], //卡口类型
      tollgateCat2List: state => state.dict['tollgate_application'], //卡口用途
      directionList: state => state.dict['direction_type'],
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
      this.PermissionInfo = await permissions(354)
      this.PermissionManage = await permissions(355)
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1,
        withTenant: 2
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        setTimeout(() => {
          this.$refs.breadcrumb.initBread(list)
        }, 100)

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          const payload = list[0].payload
          this.organizationId = payload.organizationId
          this.organizationName = list[0].payload.parents.split(',')
          this.organizationName.pop()
          await this.getBayonetList()
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    // 点击树节点 !
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)

      this.organizationId = data.payload.organizationId
      this.organizationName = data.payload.parents.split(',')
      this.organizationName.pop()
      this.search_clear()
      this.getBayonetList()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    // 加载设备列表 ！
    getBayonetList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        tollgateMatch: {
          organizationId: this.organizationId
        }
      }
      if (this.isSearch) {
        Object.assign(data.tollgateMatch, this.searchForm)
        data.tollgateMatch.laneNum = data.tollgateMatch.laneNum
          ? Number(data.tollgateMatch.laneNum)
          : ''
      }
      this.$api.getTollgatesForPage(data).then(res => {
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
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData([
        'tollgate_type',
        'tollgate_application',
        'direction_type',
        'city_pass_type'
      ])
    },

    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      }
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
    setStatus(val) {
      let name = ''
      this.statusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setDirection(val) {
      let name = ''
      this.directionList.filter(item => {
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
    setTollgateCat2EX(val) {
      let value = ''
      this.tollgateCat2List.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setTollgateCatEX(val) {
      let value = ''
      this.tollgateCatList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setStatusEX(val) {
      let value = ''
      let statusList = [
        {
          name: this.$t('public.normal'),
          value: 1
        },
        {
          name: this.$t('public.deactivate'),
          value: 2
        },
        {
          name: this.$t('public.Else'),
          value: 9
        }
      ]
      statusList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    // 国际化
    setData() {
      var regInt = /^\d+$/
      var validateLaneNum = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else if (!regInt.test(value) || value > 2147483647 || value < 0) {
          callback(new Error(this.$t('deviceManagement.bayonetLength')))
        } else {
          callback()
        }
      }
      this.mainDevTypeData = [
        {
          AmainDev: 3,
          mainDevName: this.$t('public.mainDevName3')
        },
        {
          AmainDev: 1,
          mainDevName: this.$t('public.mainDevName1')
        }
      ]

      this.statusList = [
        {
          name: this.$t('public.normal'),
          value: 1
        },
        {
          name: this.$t('public.deactivate'),
          value: 2
        },
        {
          name: this.$t('public.Else'),
          value: 9
        }
      ]

      this.rules = {
        laneNum: [
          {
            required: false,
            validator: validateLaneNum,
            trigger: 'change'
          }
        ]
      }
    },
    //下载导入模板
    getTemplate() {
      this.$api
        .downloadTemplate({
          templateType: 2,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.templateFileUrl) {
            download(res.templateFileUrl, this.$t('deviceManagement.bayonetTemplate'))
          }
        })
    },
    //批量导入
    async batchImport(list) {
      for (let j = 0; j < list.length; j++) {
        list[j].tollgateCat2 = this.setTollgateCat2EX(list[j].tollgateCat2)
        list[j].tollgateCat = this.setTollgateCatEX(list[j].tollgateCat)
        list[j].status = this.setStatusEX(list[j].status)
      }

      this.batchList = list

      this.loading = true

      this.what = this.$t('deviceManagement.bayonet')
      this.operate = this.$t('public.batchImportContent')
      this.batchApi = 'addTollgate'
      this.whatId = 'tollgateID'
      this.whatName = 'name'

      this.multipleSelectionMany = []
      for (let i = 0; i < this.batchList.length; i++) {
        this.multipleSelectionMany.push({
          organizationNames: this.batchList[i].organizationNames, //组织名称
          name: this.batchList[i].name, //卡口名称
          tollgateID: this.batchList[i].tollgateID, //卡口ID
          place: this.batchList[i].place, //安装位置
          placeCode: this.batchList[i].placeCode, //安装地点行政区域代码
          longitude: this.batchList[i].longitude, //经度
          latitude: this.batchList[i].latitude, //纬度
          tollgateCat2: this.batchList[i].tollgateCat2, //卡口用途
          status: this.batchList[i].status || null, //卡口状态
          tollgateCat: this.batchList[i].tollgateCat, //卡口类型
          activeTime: this.batchList[i].activeTime, //卡口启用时间
          managementName: this.batchList[i].managementName, //管理单位名称
          orgCode: this.batchList[i].orgCode //管理单位代码
        })
      }

      this.batchDialogVisible = true
    },
    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          name: '',
          tollgateCat: '',
          status: '',
          tollgateCat2: '',
          place: '',
          laneNum: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.pageNum = 1
          this.isSearch = true
          this.getBayonetList()
        }
      })
    },

    // 添加 !
    async handleAdd() {
      this.operation = true
      this.addMainDevVisible = true
    },

    // 批量删除 ！
    handleDel() {
      let ifCanDel = true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].laneNum > 0) {
          ifCanDel = false
          break
        }
      }
      if (ifCanDel) {
        this.$confirm(
          this.$t('deviceManagement.deleteBayonet', {
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

            this.what = this.$t('deviceManagement.bayonet')
            this.operate = this.$t('public.batchDeletionContent')
            this.batchApi = 'delTollgate'
            this.whatId = 'id'
            this.whatName = 'name'
            this.multipleSelectionMany = []
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.multipleSelectionMany.push({
                id: this.multipleSelection[i].id
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
      } else {
        this.$alert(this.$t('deviceManagement.pleaseReSelectBayonet'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.cancel'),
          callback: action => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          }
        })
      }
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
      let res = await this.$api.getTollgateDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.choosedId = row.id
      let res1 = await this.$api.getOrganizationInfo({
        organizationId: res.tollgateInfo.organizationId
      })
      let organizationName = res1.organizationInfo.parents.split(',')
      organizationName.pop()
      this.modifyMainForm = {
        organizationId: res.tollgateInfo.organizationId,
        organizationName: organizationName,
        tollgateID: res.tollgateInfo.tollgateID,
        name: res.tollgateInfo.name,
        place: res.tollgateInfo.place,
        placeCode: this.getAreaCodeList(res.tollgateInfo.placeCode),
        longitude: res.tollgateInfo.longitude,
        latitude: res.tollgateInfo.latitude,
        tollgateCat2: String(res.tollgateInfo.tollgateCat2),
        status: Number(res.tollgateInfo.status),
        tollgateCat: res.tollgateInfo.tollgateCat,
        activeTime: res.tollgateInfo.activeTime,
        managementName: res.tollgateInfo.managementName,
        orgCode: res.tollgateInfo.orgCode,
        laneNum: res.tollgateInfo.laneNum
      }

      this.operation = false
      this.addMainDevVisible = true
    },

    // 详情
    async handleInfo(row) {
      let res = await this.$api.getTollgateDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        id: res.tollgateInfo.id,
        organizationId: res.tollgateInfo.organizationId,
        organizationName: res.tollgateInfo.organizationName,
        tollgateID: res.tollgateInfo.tollgateID,
        name: res.tollgateInfo.name,
        place: res.tollgateInfo.place,
        placeCode: res.tollgateInfo.placeCode,
        longitude: res.tollgateInfo.longitude,
        latitude: res.tollgateInfo.latitude,
        tollgateCat2: String(res.tollgateInfo.tollgateCat2),
        status: Number(res.tollgateInfo.status),
        tollgateCat: res.tollgateInfo.tollgateCat,
        activeTime: res.tollgateInfo.activeTime,
        managementName: res.tollgateInfo.managementName,
        orgCode: res.tollgateInfo.orgCode,
        laneNum: res.tollgateInfo.laneNum
      }

      this.choosedTollgateID = row.tollgateID
      this.choosedTollgateName = row.name

      this.mainDevDetailVisible = true
    },

    handleDelete(row) {
      // 卡口下存在车道、采集设备，请先删除卡口下的车道和采集设备
      if (row.laneNum > 0) {
        this.$alert(this.$t('deviceManagement.deleteLane'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.cancel'),
          callback: action => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          }
        })
      } else {
        this.$confirm(this.$t('deviceManagement.operateWithCaution'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api.delTollgate({ id: row.id }).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })
                this.search_clear()
                this.getBayonetList()
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
    },

    // 分页
    getListByPage() {
      this.search_clear()
      this.getBayonetList()
    }
  }
}
</script>

<style lang="scss">
#bayonetManage {
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
    padding: 15px 0 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
  .el-table {
    --el-table-header-bg-color: transparent;
  }
}
</style>
