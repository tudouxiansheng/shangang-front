<template>
  <!-- 卡口管理 -->
  <div
    id="laneManage"
    v-if="isRouterAlive"
    ref="laneManage"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              :data="treeData"
              ref="treeList"
              node-key="id"
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
                  <i :class="iconStyTollgate(data)" class="iconCss"></i>
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
            {{ $t('deviceManagement.addVehicleLane') }}
          </el-button>

          <el-button v-if="PermissionManage" type="primary" @click="getTemplate">
            {{ $t('public.getTemplate') }}
          </el-button>

          <batch-import
            ref="batchImport"
            @batchImport="batchImport"
            :ifSplice="true"
            v-if="PermissionManage"
            :nullValueList="['tollgateID']"
          ></batch-import>

          <el-button type="danger" @click="handleDel" :disabled="delShow" v-if="PermissionManage">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '150px' : '127px'"
            ref="form"
            :rules="rules"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('deviceManagement.laneName') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.name"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputLaneName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('deviceManagement.laneID') + ':'"
                prop="laneId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.laneId"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputLaneID')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('deviceManagement.laneDirection') + ':'"
                prop="thirdCameraId"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.direction"
                  :placeholder="$t('deviceManagement.inputLaneDirection')"
                  @change="search_change"
                >
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in directionList"
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
                  :label="$t('deviceManagement.laneDirection') + ':'"
                  prop="thirdCameraId"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.direction"
                    :placeholder="$t('deviceManagement.inputLaneDirection')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in directionList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.laneNumber') + ':'"
                  prop="laneNo"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.laneNo"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputLaneNumber')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.deviceID') + ':'"
                  prop="apeID"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-input
                    v-model="searchForm.apeID"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputDeviceID')"
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
              :label="$t('deviceManagement.laneName')"
              width="110"
              show-overflow-tooltip
              prop="name"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneID')"
              width="110"
              show-overflow-tooltip
              prop="laneId"
            >
              <template #default="{ row }">
                <span>{{ row.laneId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.belongBayonet')"
              width="180"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.tollgateName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneNumber')"
              width="180"
              show-overflow-tooltip
              prop="laneNo"
            >
              <template #default="{ row }">
                <span>{{ row.laneNo }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneDirection')"
              width="180"
              show-overflow-tooltip
              prop="direction"
            >
              <template #default="{ row }">
                <span>{{ setDirection(row.direction) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.leavingTheCity')"
              width="180"
              show-overflow-tooltip
              prop="cityPass"
            >
              <template #default="{ row }">
                <span>{{ setCityPass(row.cityPass) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceID')"
              width="180"
              show-overflow-tooltip
              prop="mainDevConfigInfo"
            >
              <template #default="{ row }">
                <span>{{ row.apeID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.modificationTime')"
              width="210"
              show-overflow-tooltip
              prop="updateTime"
            >
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
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
    <lane-add></lane-add>

    <!-- 详情对话框 -->
    <lane-detail></lane-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="
        operate == $t('public.batchDeletionContent') ? multipleSelection : batchList
      "
      :multipleSelectionMany="multipleSelectionMany"
      :what="what"
      @getList="getLaneList"
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

import laneAdd from './component/lane-add'
import laneDetail from './component/lane-detail'
import batchImport from '@/components/batchImport'
import batchOperate from '@/components/batchOperate'
import breadcrumb from '@/components/breadcrumb' //面包屑

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  name: 'LaneManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {
    'lane-add': laneAdd,
    'lane-detail': laneDetail,
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
        laneId: '',
        direction: '',
        laneNo: '',
        apeID: ''
      },
      rules: {},
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

      platId: '', //平台Id

      maskloading: false,

      //1400参数
      operation: true,

      choosedId: '',
      treeData: [],
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

      batchList: []
    }
  },
  computed: {
    ...mapState({
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
  async created() {
    await this.getTree()
  },
  mounted() {
    this.pageResize()
    this.setData()
    this.getDictionary()
    this.getTollgate()
    this.setFormRules()
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },

  methods: {
    setFormRules() {
      let regInt = /^\d+$/
      let validateLaneId = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('deviceManagement.laneID2147483647')))
        } else {
          callback()
        }
      }
      let validateLaneNo = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('deviceManagement.laneCode2147483647')))
        } else {
          callback()
        }
      }
      this.rules = {
        laneId: [
          {
            required: false,
            validator: validateLaneId,
            trigger: 'change'
          }
        ],
        laneNo: [
          {
            required: false,
            validator: validateLaneNo,
            trigger: 'change'
          }
        ]
      }
    },
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
      let data = {}
      await this.$api.getTollgateTree(data).then(res => {
        list = res.nodeList || []

        this.treeData = list
        setTimeout(() => {
          this.$refs.breadcrumb.initBread(this.treeData)
        }, 100)
        if (list.length) {
          this.idArr = [list[0].id]

          const payload = list[0].payload
          this.organizationId = payload.organizationId
          this.tollgateID = payload.tollgateID
          this.organizationName = payload.organizationName
          this.$nextTick().then(async () => {
            this.$refs.treeList.setCurrentKey(list[0].id)
            await this.getLaneList()
          })
        } else if (level == 0 && list.length == 0) {
          this.treeEmptyText = this.$t('public.noData')
        }

        this.treeLoading = false
      })
    },
    // 点击树节点 !
    handleNodeClick(data, node) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread_lane(data, node)

      this.organizationId = data.id
      this.tollgateID = data.payload.tollgateID
      this.tollgateName = data.payload.tollgateName
      this.organizationName = data.label

      this.choosedOrgType = data.type

      this.search_clear()
      this.getLaneList()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    iconStyTollgate(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci aci-organization'
      } else if (node.type == 1 && node.payload.type == 2) {
        return 'aci aci-x006-folder'
      } else if (node.type == 2) {
        return 'iconfont icon-kakou'
      }
    },

    // 加载设备列表 ！
    getLaneList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        laneMatch: {}
      }
      this.choosedOrgType == '2'
        ? (data.laneMatch.tollgateID = this.tollgateID)
        : (data.laneMatch.organizationId = this.organizationId)
      if (this.isSearch) {
        Object.assign(data.laneMatch, this.searchForm)
      }
      this.$api.getLanesForPage(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      if (res.laneInfoList && res.laneInfoList.length != 0) {
        this.tableData = res.laneInfoList
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
      this.getSysDictData(['direction_type', 'city_pass_type'])
    },

    //下载导入模板
    getTemplate() {
      this.$api
        .downloadTemplate({
          templateType: 3,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.templateFileUrl) {
            download(res.templateFileUrl, this.$t('deviceManagement.vehicleTemplate'))
          }
        })
    },
    //批量导入
    async batchImport(list) {
      for (let j = 0; j < list.length; j++) {
        list[j].tollgateName = this.setTollgateNameEX(list[j].tollgateName)
        list[j].direction = Number(this.setDirectionEX(list[j].direction))
        list[j].cityPass = this.setCityPassEX(list[j].cityPass)
      }

      this.batchList = list

      this.loading = true

      this.what = this.$t('deviceManagement.vehicleTemplate')
      this.operate = this.$t('public.batchImportContent')
      this.batchApi = 'addLane'
      this.whatId = 'laneId'
      this.whatName = 'name'

      this.multipleSelectionMany = []
      for (let i = 0; i < this.batchList.length; i++) {
        this.multipleSelectionMany.push({
          tollgateID: this.batchList[i].tollgateID,
          laneId: Number(this.batchList[i].laneId),
          laneNo: Number(this.batchList[i].laneNo),
          name: this.batchList[i].name,
          direction: this.batchList[i].direction,
          maxSpeed: this.batchList[i].maxSpeed,
          apeID: this.batchList[i].apeID, //apeID在excel直接输入
          cityPass: this.batchList[i].cityPass,
          desc: this.batchList[i].desc
        })
      }

      this.batchDialogVisible = true
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
    setDirection(val) {
      let name = ''
      this.directionList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setTollgateNameEX(val) {
      let value = ''
      this.tollgatesList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },
    setDirectionEX(val) {
      let value = ''
      this.directionList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },
    setCityPassEX(val) {
      let value = ''
      this.cityPassList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    getTollgate() {
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      this.$api.getTollgatesForPage(data).then(res => {
        this.tollgatesList = res.tollgateInfoList || []
      })
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

    // 国际化
    setData() {},

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          name: '',
          laneId: '',
          direction: '',
          laneNo: '',
          apeID: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.pageNum = 1
          this.isSearch = true
          this.getLaneList()
        }
      })
    },

    // 添加 !
    async handleAdd() {
      if (this.choosedOrgType != '2') {
        this.$message({
          type: 'warning',
          message: this.$t('deviceManagement.selectBayonet')
        })
        return
      }

      this.operation = true
      this.addMainDevVisible = true
    },

    // 批量删除 ！
    handleDel() {
      let ifCanDel = true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].apeID) {
          ifCanDel = false
          break
        }
      }
      if (ifCanDel) {
        this.$confirm(
          this.$t('deviceManagement.isDeleteVehicleLane', {
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

            this.what = this.$t('deviceManagement.vehicleLane')
            this.operate = this.$t('public.batchDeletionContent')
            this.batchApi = 'delLane'
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
        this.$alert(this.$t('deviceManagement.reselectVehicleLane'), this.$t('public.prompt'), {
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
      let res = await this.$api.getLaneDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.choosedId = row.id
      this.modifyMainForm = {
        mainDevId: res.laneInfo.mainDevId,
        name: res.laneInfo.name,
        direction: res.laneInfo.direction,
        maxSpeed: res.laneInfo.maxSpeed,
        tollgateID: res.laneInfo.tollgateID,
        laneId: res.laneInfo.laneId,
        laneNo: res.laneInfo.laneNo,
        apeID: res.laneInfo.apeID,
        apeName: res.laneInfo.apeName,
        cityPass: res.laneInfo.cityPass ? String(res.laneInfo.cityPass) : '',
        desc: res.laneInfo.desc,

        tollgateName: res.laneInfo.tollgateID
      }

      if (res.laneInfo.apeID) {
        this.laneCheckedNodes = [
          {
            id: res.laneInfo.deviceId,
            label: res.laneInfo.apeName
          }
        ]
        this.camerasArray = [res.laneInfo.apeID]
      } else {
        this.laneCheckedNodes = []
        this.camerasArray = []
      }

      this.tollgateID = res.laneInfo.tollgateID

      this.operation = false
      this.addMainDevVisible = true
    },

    // 详情
    async handleInfo(row) {
      let res = await this.$api.getLaneDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        mainDevId: res.laneInfo.mainDevId,
        name: res.laneInfo.name,
        direction: res.laneInfo.direction,
        maxSpeed: res.laneInfo.maxSpeed,
        tollgateID: res.laneInfo.tollgateID,
        laneId: res.laneInfo.laneId,
        laneNo: res.laneInfo.laneNo,
        apeID: res.laneInfo.apeID,
        cityPass: res.laneInfo.cityPass ? res.laneInfo.cityPass : '',
        desc: res.laneInfo.desc,

        tollgateName: res.laneInfo.tollgateName
      }

      this.tollgateID = res.laneInfo.tollgateID

      this.mainDevDetailVisible = true
    },

    handleDelete(row) {
      // 车道下存在采集设备，请先删除车道下的采集设备
      if (row.apeID) {
        this.$alert(this.$t('deviceManagement.deleteVehicleDevice'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.cancel'),
          callback: action => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          }
        })
      } else {
        this.$confirm(
          this.$t('deviceManagement.carefulOperationVehicle'),
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning',
            closeOnClickModal: false
          }
        )
          .then(() => {
            this.$api.delLane({ id: row.id }).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })
                this.search_clear()
                this.getLaneList()
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
      this.getLaneList()
    }
  }
}
</script>

<style lang="scss">
@import './component/iconfont.css';
#laneManage {
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
  .el-table {
    --el-table-header-bg-color: transparent;
  }
}
</style>
