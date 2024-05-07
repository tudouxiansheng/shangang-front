<template>
  <el-dialog
    :title="$t('cascadeDevice.deviceAssociation')"
    v-model="$parent.dialogvisible_ass"
    width="1400px"
    class="deviceAssociateDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    @closed="dialogClosed"
    draggable
  >
    <el-row>
      <el-col :span="4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree" style="height: 510px">
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
                  <i :class="$parent.iconStyPlat(data)" class="iconCss1 aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" style="padding-left: 15px">
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '219px' : '89px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('deviceManagement.deviceName') + ':'">
                <el-input
                  v-model="searchForm.name"
                  maxlength="100"
                  auto-complete="off"
                  :placeholder="$t('deviceManagement.inputDeviceName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>

              <el-form-item :label="$t('platformManagement.encoding') + ':'">
                <el-input
                  v-model="searchForm.apeID"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  maxlength="20"
                  auto-complete="off"
                  :placeholder="$t('platformManagement.inputInterconnectionCode')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>

              <el-form-item :label="$t('deviceManagement.deviceStatus') + ':'">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.isOnline"
                  :placeholder="$t('deviceManagement.selectDeviceStatus')"
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

            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div style="height: 409px" v-loading="loading" :element-loading-text="$t('public.loading')">
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
              :label="$t('cascadeDevice.equipmentNumber')"
              min-width="110"
              show-overflow-tooltip
              prop="id"
            >
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceName')"
              min-width="110"
              show-overflow-tooltip
              prop="name"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.encoding')"
              min-width="100"
              show-overflow-tooltip
              prop="apeID"
            >
              <template #default="{ row }">
                <span>{{ row.apeID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceModel')"
              min-width="60"
              show-overflow-tooltip
              prop="model"
            >
              <template #default="{ row }">
                <span>{{ row.model }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceStatus')"
              min-width="65"
              show-overflow-tooltip
              prop="isOnline"
            >
              <template #default="{ row }">
                <span>{{ setIsOnline(row.isOnline) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.creationTime')"
              min-width="90"
              show-overflow-tooltip
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submit" :loading="$parent.maskloading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import tableCopy from '@/mixin/tableCopy.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import judgeWindow from '@/mixin/judgeWindow'

export default {
  mixins: [tableCopy, getLazyTree, judgeWindow],
  components: {},
  data() {
    return {
      locale: localStorage.getItem('locale'),
      treeLoading: false,
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
        isOnline: '',
        apeID: ''
      },
      isSearch: false,

      multipleSelection: [], //表格选中状态存放数组
      loading: false,
      tableData: [], // 表格数据
      dataText: '',
      tableHeight: 409,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

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

      treeProps: {
        label: 'label',
        children: 'children'
      },
      treeData: [],
      choosedDialogPlatId: '',
      choosedDialogPlatName: '',
      choosedOrganizationId: '',
      isOnlineList: []
    }
  },

  computed: {},
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
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },

  methods: {
    setIsOnline(val) {
      let name = ''
      this.isOnlineList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.$parent.dialogvisible_ass = false
    },

    async submit() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning(this.$t('deviceManagement.selectDevice'))
        return
      }
      await this.$parent.batchOperate()
      this.$parent.dialogvisible_ass = false
    },

    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1349)
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
      this.treeLoading = false
      if (this.treeData.length) {
        this.$nextTick().then(async () => {
          this.idArr = [this.treeData[0].id]
          if (this.$refs.treeList) {
            this.$refs.treeList.setCurrentKey(this.treeData[0].id)
          }
          const payload = this.treeData[0].payload

          this.choosedDialogPlatId =
            this.treeData[0].type == '2' ? this.treeData[0].payload.platformId : null
          this.choosedOrganizationId =
            this.treeData[0].type == '1' ? this.treeData[0].payload.organizationId : null
          await this.getViewPlatList()
        })
      } else if (this.treeData.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },

    // 点击树节点 !
    handleNodeClick(data, node, self) {
      //点击树联动面包屑
      this.choosedDialogPlatId = data.type == '2' ? data.payload.platformId : null
      this.choosedOrganizationId = data.type == '1' ? data.payload.organizationId : null
      this.choosedDialogPlatName = data.payload.platformName

      this.search_clear()
      this.getViewPlatList()
    },

    // 加载设备列表 ！
    getViewPlatList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },

        pid: this.$parent.choosedPid,
        subordinateId: this.choosedDialogPlatId ? this.choosedDialogPlatId : null,
        organizationId: this.choosedOrganizationId ? this.choosedOrganizationId : null,

        name: this.searchForm.name,
        apeID: this.searchForm.apeID,
        isOnline: this.searchForm.isOnline ? this.searchForm.isOnline : null
      }

      this.$api.getUnRelateApeList(data).then(res => {
        this.devListBack(res)
      })
    },
    devListBack(res) {
      if (res.apeInfoList && res.apeInfoList.length != 0) {
        this.tableData = res.apeInfoList
        this.totalNum = res.pageInfo.totalNum

        this.$nextTick(() => {
          if (this.$parent.dialogvisible_ass) {
            this.$refs.multipleTable?.setScrollTop(0)
          }
        })
      } else {
        this.tableData = []
        this.totalNum = 0
        this.dataText = this.$t('public.noData')
      }
      this.loading = false
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
    setData() {
      this.isOnlineList = [
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
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          name: '',
          isOnline: '',
          apeID: ''
        }
      }
    },
    // 搜索 ！
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getViewPlatList()
    },

    handleRest() {
      this.searchForm = {
        name: '',
        isOnline: '',
        apeID: ''
      }
    },

    handleCommand(command) {
      switch (command.command) {
      }
    },

    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },

    // 设备同步
    handleAss() {},

    // 批量取消 ！
    handleDel() {
      this.$confirm(
        this.$t('cascadeDevice.deleteServices', {
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
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let item = this.multipleSelection[i]
            this.$api.delVirPlatform({ platformId: item.platformId }).then(res => {
              if (res.resultCode == 0 && i == this.multipleSelection.length - 1) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.bulkDelSuccess')
                })
                this.search_clear()
                this.getViewPlatList()
              }
            })
          }
          this.loading = false
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
      this.tableHeight = this.showManyCondition ? 556 : 409
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
      let res = await this.$api.getVirPlatformInfo({
        platformId: row.platformId
      })
      if (res.resultCode != 0) return
      this.mainDevDetailForm = {
        organizationId: res.organizationId,
        organizationName: this.choosedOrgName,
        platformName: res.platformName,
        resourceUri: res.resourceUri,
        type: res.type,
        protocol: res.protocol,
        algorithm: res.algorithm,
        ownAccount: res.ownAccount,
        ownPassword: '******',
        account: res.account,
        password: '******',
        ip: res.ip,
        port: res.port,
        remark: res.remark,

        //5.7.4新增
        dataSendList: [
          {
            dataType: this.$t('platformManagement.personnelData'),
            ifSend: res.pushPerson,
            bigImgSet: res.personBigPic,
            smallImgSet: res.personMinPic
          },
          {
            dataType: this.$t('platformManagement.faceData'),
            ifSend: res.pushFace,
            bigImgSet: res.faceBigPic,
            smallImgSet: res.faceMinPic
          },
          {
            dataType: this.$t('platformManagement.vehicleData'),
            ifSend: res.pushVehicle,
            bigImgSet: res.vehicleBigPic,
            smallImgSet: res.vehicleMinPic
          },
          {
            dataType: this.$t('platformManagement.nonVehicleData'),
            ifSend: res.pushNonVehicle,
            bigImgSet: res.nonVehicleBigPic,
            smallImgSet: res.nonVehicleMinPic
          }
        ],

        ifDownloadUrl: 1
      }

      this.mainDevDetailVisible = true
    },

    //订阅详情
    subscriptionInfo(row) {
      this.choosedType = row.type
      this.showSubInfo = true
    },

    // 分页每页条数 !
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.search_clear()
      this.getViewPlatList()
    },
    // 分页输入跳转页数 !
    handleCurrentChange(val) {
      this.pageNum = val
      this.search_clear()
      this.getViewPlatList()
    }
  }
}
</script>

<style lang="scss">
.deviceAssociateDialog {
  .search-form {
    position: relative;
    margin-top: 0px !important;
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

  //设备关联
  .el-dialog__body {
    padding: 10px 15px !important;
    max-height: none;
  }
  .manyConditionDialog {
    background: #3085cb !important;
  }
}
</style>
