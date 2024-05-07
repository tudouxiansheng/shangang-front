<template>
  <!-- 设备管理 -->
  <div id="mainDevVC" v-if="isRouterAlive" ref="mainDevVC">
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
                  <i :class="iconStyAps(data)" class="iconCss"></i>
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
            {{ $t('deviceManagement.addCollection') }}
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
            :label-width="locale == 'en' ? '200px' : '127px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('deviceManagement.deviceName') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.name"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputDeviceName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('platformManagement.encoding') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.apeID"
                  auto-complete="off"
                  :placeholder="$t('platformManagement.inputInterconnectionCode')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('deviceManagement.deviceStatus') + ':'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.isOnline"
                  :placeholder="$t('deviceManagement.selectDeviceStatus')"
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
                  :label="$t('deviceManagement.deviceStatus') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.isOnline"
                    :placeholder="$t('deviceManagement.selectDeviceStatus')"
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
                  :label="$t('deviceManagement.monitorDirection') + ':'"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                >
                  <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.monitorDirection"
                    :placeholder="$t('deviceManagement.selectMonitorDirection')"
                    @change="search_change"
                  >
                    <el-option :label="$t('public.all')" value></el-option>
                    <el-option
                      v-for="(item, index) in monitorDirectionList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('platformManagement.IPAddress') + ':'"
                  auto-complete="off"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-input
                    v-model="searchForm.ipAddr"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputIPAddress')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>

                <el-form-item
                  :label="$t('deviceManagement.installationLocation') + ':'"
                  auto-complete="off"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="screenFlag"
                >
                  <el-input
                    v-model="searchForm.place"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputInstallationLocation')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
              </div>
              <div class="flexstart">
                <el-form-item
                  :label="$t('platformManagement.IPAddress') + ':'"
                  auto-complete="off"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.ipAddr"
                    auto-complete="off"
                    :placeholder="$t('platformManagement.inputIPAddress')"
                    clearable
                    @change="search_change"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('deviceManagement.installationLocation') + ':'"
                  auto-complete="off"
                  :class="screenFlag ? 'screenthree' : 'flex-item'"
                  v-if="!screenFlag"
                >
                  <el-input
                    v-model="searchForm.place"
                    auto-complete="off"
                    :placeholder="$t('deviceManagement.inputInstallationLocation')"
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
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('deviceManagement.gatherDeviceName')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceEncoding')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.encoding')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.apeID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.model')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.model }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.IPAddress')"
              min-width="60"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.ipAddr }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceStatus')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span :class="setStatusClass(row.isOnline)">
                  {{ setIsOnline(row.isOnline) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.creationTime')"
              min-width="90"
              show-overflow-tooltip
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
    <device-add></device-add>

    <!-- 详情对话框 -->
    <device-detail class="dialogBodyPadding"></device-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="
        operate == $t('public.batchDeletionContent') ? multipleSelection : batchList
      "
      :multipleSelectionMany="multipleSelectionMany"
      :what="what"
      @getList="getVirDevList"
      :operate="operate"
      :batchApi="batchApi"
      :whatId="whatId"
      :whatName="whatName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
      @searchClear="search_clear"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import { mapState, mapActions } from 'vuex'

import deviceAdd from './component/device-add'
import deviceDetail from './component/device-detail'
import breadcrumb from '@/components/breadcrumb' //面包屑
import batchImport from '@/components/batchImport'
import batchOperate from '@/components/batchOperate' //批量删除

import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

import areaCodeBackfill from '@/mixin/areaCodeBackfill'

export default {
  name: 'AcquisitionDeviceManagement',
  mixins: [tableCopy, getLazyTree, judgeWindow, areaCodeBackfill],
  components: {
    'device-add': deviceAdd,
    'device-detail': deviceDetail,
    breadcrumb,
    'batch-import': batchImport,
    'batch-operate': batchOperate
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
      organizationName: [], //组织名称

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      // 条件搜索
      searchForm: {
        name: '',
        apeID: '',
        isOnline: '',
        monitorDirection: '',
        ipAddr: '',
        place: ''
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

      addMainDevVisible: false, // 添加对话框

      mainDevDetailVisible: false, // 详情对话框
      mainDevDetailForm: {}, // 详情表单
      operatorForm: {},

      modifyMainForm: {}, // 修改表单

      delShow: true, //批量删除

      ptzTypeData: [], // 摄像机类型
      serviceIpList: [],

      maskloading: false,

      operation: true,
      areaCodeOptions: [], //组织区号级联列表

      choosedId: '',
      choosedOrgName: '',
      choosedType: '',
      choosedApsId: '',

      //批量导入
      fileList: [],
      file: '',

      uploadWayList: [], //图片上传方式

      batchList: [],

      choosedAps: ''
    }
  },

  computed: {
    ...mapState({
      monitorDirectionList: state => state.dict['direction_type'], // 监视方向
      capDirectionList: state => state.dict['vehicle_snapshot_direction'], // 车辆抓拍方向
      statusList: state => state.dict['status_type'], // 设备状态
      manufacturerData: state => state.dict['camera_manufacturer'], // 设备厂商类型
      authorityList: state => state.dict['authority_type'], // 鉴权方式
      placeTypeList: state => state.dict['device_location_lable'], // 设备位置类型
      functionTypeList: state => state.dict['ape_function_type'],
      accessTypeList: state => state.dict['access_type'],
      typeList: state => state.dict['ape_device_type']
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
      this.PermissionInfo = await permissions(352)
      this.PermissionManage = await permissions(353)
    },
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.apsTree(data).then(res => {
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

          this.choosedOrgName = payload.organizationName
          this.choosedType = list[0].type
          this.choosedApsId = this.choosedType == '2' ? payload.apsId : ''

          await this.getVirDevList()
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

      if (data.type == '1') {
        this.organizationName = data.payload.parents.split(',')
      } else {
        this.organizationName = node.parent.data.payload.parents.split(',')
      }
      this.organizationName.pop()

      this.choosedOrgName = data.payload.organizationName
      this.choosedType = data.type

      this.choosedApsId = this.choosedType == '2' ? data.payload.apsId : ''

      this.search_clear()
      this.getVirDevList()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    iconStyAps(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci aci-organization'
      } else if (node.type == 1 && node.payload.type == 2) {
        return 'aci aci-x006-folder'
      } else if (node.type == 2) {
        return 'iconfont icon-caijixitong'
      }
    },
    // 加载设备列表 ！
    getVirDevList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        apeMatch: {}
      }
      if (this.choosedType == '1') {
        data.apeMatch.organizationId = this.organizationId
      } else {
        data.apeMatch.ownerApsId = this.choosedApsId
      }
      if (this.isSearch) {
        Object.assign(data.apeMatch, this.searchForm)
      }
      this.$api.getApeList(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      if (res.apeInfoList && res.apeInfoList.length != 0) {
        this.tableData = res.apeInfoList
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
        'direction_type',
        'vehicle_snapshot_direction',
        'status_type',
        'camera_manufacturer',
        'authority_type',
        'device_location_lable',
        'ape_function_type',
        'access_type',
        'ape_device_type'
      ])
    },
    //获取省市区数据替换其中的key
    orgChangeKey(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i]['areaName']
        delete arr[i].areaName
        arr[i].value = arr[i]['areaCode']
        delete arr[i].areaCode
      }
      return arr
    },

    //下载导入模板
    getTemplate() {
      this.$api
        .downloadTemplate({
          templateType: 1,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.templateFileUrl) {
            download(res.templateFileUrl, this.$t('deviceManagement.deviceTemplates'))
          }
        })
    },

    //excel 中文转 value
    setTypeEX(val) {
      let value = ''
      this.typeList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setFunctionTypeEX(val) {
      let value = ''
      this.functionTypeList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setManufacturerEX(val) {
      let value = ''
      this.manufacturerData.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setPlaceTypeEX(val) {
      let value = ''
      this.placeTypeList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setCapDirectionEX(val) {
      let value = ''
      this.capDirectionList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setUploadWayEX(val) {
      let value = ''
      this.uploadWayList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setAuthorityEX(val) {
      let value = ''
      this.authorityList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setMonitorDirectionEX(val) {
      let value = ''
      this.monitorDirectionList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },

    setAccessTypeEX(val) {
      let value = ''
      this.accessTypeList.filter(item => {
        if (val == item.name) {
          value = item.value
        }
      })
      return value
    },
    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      }
    },
    setIsOnline(val) {
      let name = ''
      this.statusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
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
    //批量导入
    async batchImport(list) {
      for (let j = 0; j < list.length; j++) {
        list[j].type = this.setTypeEX(list[j].type)
        list[j].functionType = this.setFunctionTypeEX(list[j].functionType)
        list[j].manufacturer = this.setManufacturerEX(list[j].manufacturer)
        list[j].placeType = this.setPlaceTypeEX(list[j].placeType)
        list[j].capDirection = this.setCapDirectionEX(list[j].capDirection)
        list[j].uploadWay = this.setUploadWayEX(list[j].uploadWay)
        list[j].authority = this.setAuthorityEX(list[j].authority)
        list[j].monitorDirection = this.setMonitorDirectionEX(list[j].monitorDirection)

        list[j].accessType = this.setAccessTypeEX(list[j].accessType)
      }

      this.batchList = list

      this.loading = true

      this.what = this.$t('deviceManagement.device')
      this.operate = this.$t('public.batchImportContent')
      this.batchApi = 'addApe'
      this.whatId = 'id'
      this.whatName = 'name'
      this.multipleSelectionMany = []
      for (let i = 0; i < this.batchList.length; i++) {
        let obj = {
          organizationNames: this.batchList[i].organizationNames, //组织名称
          name: this.batchList[i].name, //设备名称
          alias: this.batchList[i].alias, //设备别名
          apeID: this.batchList[i].apeID, //互联编码
          type: this.batchList[i].type, //采集设备类型
          manufacturer: this.batchList[i].manufacturer, //设备厂商
          model: this.batchList[i].model, //设备型号
          authority: this.batchList[i].authority, //鉴权方式
          userId:
            this.batchList[i].authority != '1' && this.batchList[i].authority != ''
              ? this.batchList[i].userId
              : '', //鉴权账号
          ipAddr: this.batchList[i].ipAddr, //Ipv4地址
          ipv6Addr: this.batchList[i].ipv6Addr, //Ipv6地址
          mac: this.batchList[i].mac, //MAC地址
          port: this.batchList[i].port, //端口号
          place: this.batchList[i].place, //安装位置
          placeCode: this.batchList[i].placeCode, //安装地点区域代码
          longitude: this.batchList[i].longitude, //经度
          latitude: this.batchList[i].latitude, //纬度
          placeType: this.batchList[i].placeType, //设备位置类型
          monitorDirection: this.batchList[i].monitorDirection, //监视方向
          capDirection:
            this.batchList[i].capDirection === '' ? null : this.batchList[i].capDirection, //车辆抓拍方向
          monitorAreaDesc: this.batchList[i].monitorAreaDesc, //监视区域说明
          police: this.batchList[i].police, //所属辖区公安机关
          managementName: this.batchList[i].managementName, //管理单位名称
          contact: this.batchList[i].contact, //管理单位联系方式
          installTime: this.batchList[i].installTime, //设备安装时间

          functionType: this.batchList[i].functionType, //采集设备功能类型

          accessType: this.batchList[i].accessType,
          ownerApsID: this.batchList[i].ownerApsID ? String(this.batchList[i].ownerApsID) : null
        }
        if (this.batchList[i].authority != '1' && this.batchList[i].authority != '') {
          if (this.batchList[i].password !== '' && this.batchList[i].password !== null) {
            obj.password = this.batchList[i].password
          }
        } else {
          obj.password = ''
        }
        this.multipleSelectionMany.push(obj)
      }

      this.batchDialogVisible = true
    },

    // 国际化
    setData() {
      this.uploadWayList = [
        {
          name: this.$t('deviceManagement.binary'),
          value: 1
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
          apeID: '',
          isOnline: '',
          monitorDirection: '',
          ipAddr: '',
          place: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getVirDevList()
    },

    // 添加 !
    async handleAdd() {
      this.operation = true
      this.addMainDevVisible = true
    },

    // 批量删除 ！
    async handleDel() {
      const list = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].id)
      }
      const ids = await this.checkAssociateApe(list)
      if (ids === false) return
      const tip =
        ids.length === 0
          ? this.$t('deviceManagement.deleteService', { num: this.multipleSelection.length })
          : this.$t('deviceManagement.deleteService1', { num: this.multipleSelection.length })
      this.$confirm(tip, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(async () => {
          this.loading = true

          this.what = this.$t('deviceManagement.device')
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'delApe'
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
      let res = await this.$api.getApeDetail({ id: row.id })
      if (res.resultCode != 0) return
      this.choosedId = row.id

      this.choosedAps = res.apeInfo.apsName

      let res1 = await this.$api.getOrganizationInfo({
        organizationId: res.apeInfo.organizationId
      })
      let organizationName = res1.organizationInfo.parents.split(',')
      organizationName.pop()
      this.modifyMainForm = {
        organizationId: res.apeInfo.organizationId,
        organizationName: organizationName,

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
        longitude: res.apeInfo.longitude === 0 ? '' : res.apeInfo.longitude,
        placeType: res.apeInfo.placeType, //
        capDirection: res.apeInfo.capDirection,
        police: res.apeInfo.police,
        contact: res.apeInfo.contact,
        password: res.apeInfo.password ? res.apeInfo.password : '',
        ipv6Addr: res.apeInfo.ipv6Addr,
        port: res.apeInfo.port,
        placeCode: res.apeInfo.placeCode ? this.getAreaCodeList(res.apeInfo.placeCode) : '',
        latitude: res.apeInfo.latitude === 0 ? '' : res.apeInfo.latitude,
        monitorDirection: res.apeInfo.monitorDirection,
        monitorAreaDesc: res.apeInfo.monitorAreaDesc, //
        managementName: res.apeInfo.managementName, //
        installTime: res.apeInfo.installTime,

        functionType: res.apeInfo.functionType,

        uploadWay: res.apeInfo.uploadWay,

        ownerApsID: res.apeInfo.ownerApsID,

        accessType: String(res.apeInfo.accessType)
      }

      this.operation = false
      this.addMainDevVisible = true
    },

    // 详情
    async handleInfo(row) {
      let res = await this.$api.getApeDetail({ id: row.id })

      this.choosedAps = res.apeInfo.apsName

      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        organizationId: res.apeInfo.organizationId,
        organizationName: res.apeInfo.organizationName,

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

        functionType: res.apeInfo.functionType,

        uploadWay: res.apeInfo.uploadWay,

        ownerApsID: res.apeInfo.ownerApsID,

        accessType: String(res.apeInfo.accessType)
      }

      this.mainDevDetailVisible = true
    },

    async handleDelete(row) {
      const ids = await this.checkAssociateApe([row.id])
      if (ids === false) return
      const tip =
        ids.length === 0
          ? this.$t('deviceManagement.deleteall')
          : this.$t('deviceManagement.deleteal2')
      this.$confirm(tip, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delApe({ id: row.id }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.search_clear()
              this.getVirDevList()
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
    async checkAssociateApe(ids) {
      const res = await this.$api.checkassociateApe({ ids })
      if (res.resultCode === 0) {
        return res.ids
      }
      return false
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getVirDevList()
    }
  }
}
</script>

<style lang="scss">
@import '../lane/component/iconfont.css';

#mainDevVC {
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
  .dialogBodyPadding {
    .el-dialog__body {
      padding: 15px 0 5px;
      .el-form-item--small.el-form-item {
        margin-bottom: 28px;
      }
    }
  }

  .uploadBtn {
    display: inline-block;
    margin: 0px 10px;
  }
}
</style>
