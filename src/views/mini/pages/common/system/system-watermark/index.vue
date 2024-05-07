<template>
  <!-- 系统水印 -->
  <div id="system-watermark" v-if="isRouterAlive" ref="systemWatermark">
    <el-row>
      <el-col :span="24" style="padding: 20px">
        <div class="btnMargin">
          <el-button type="primary" @click="handleAdd">
            {{ $t('systemTatermarkManage.addWatermark') }}
          </el-button>
          <el-button type="danger" :disabled="batchDeletionBtn" @click="batchDeletionClick">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="searchForm"
            label-position="left"
            style="position: relative"
            :label-width="locale == 'en' ? '144px' : '84px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('systemTatermarkManage.watermarkName') + ' ：'"
                class="flex-item"
              >
                <el-input class="flexstart-input" v-model="searchForm.content" auto-complete="off" :placeholder="$t('systemTatermarkManage.content')" />
              </el-form-item>
              <el-form-item
                :label="$t('systemTatermarkManage.systemType') + ' ：'"
                class="flex-item"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="searchForm.systemType"
                  :placeholder="$t('systemTatermarkManage.selectSystemType')"
                  class="flexstart-input"
                >
                  <el-option
                    v-for="item in systemTypeArray"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('systemTatermarkManage.usageStatus') + ' ：'"
                auto-complete="off"
                class="flex-item"
              >
                <el-select
                  clearable
                  v-model="searchForm.status"
                  :placeholder="$t('systemTatermarkManage.pleaseSelectUsageStatus')"
                  class="flexstart-input"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="handleQuery" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <el-button @click="handleReset" class="miniBtn">
                {{ $t('public.reset') }}
              </el-button>
            </div>
          </el-form>
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

          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            max-height="613"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <el-table-column label width="50" type="selection"></el-table-column>
            <el-table-column
              :label="$t('systemTatermarkManage.systemType')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>{{ setWaterMark(scope.row.systemType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('systemTatermarkManage.watermarkName')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>
                  {{ scope.row.watermarkType == 2 ? waterNameFilters(scope.row.content) : scope.row.content }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('systemTatermarkManage.watermarkType')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>{{ descriptionFormat(scope.row.watermarkType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('systemTatermarkManage.watermarkStatus')"
              show-overflow-tooltip
              min-width="80"
            >
              <template #default="scope">
                <el-switch
                  style="rgb(255, 73, 73)"
                  v-model="scope.row.enableStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleUsing(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('systemTatermarkManage.creationTime')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('systemTatermarkManage.updateTime')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>{{ scope.row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="140">
              <template #default="scope">
                <span
                    style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                    @click="handleDevInfo(scope.row)"
                    v-if="PermissionInfo && scope.row.systemType == 3"
                >
                  {{ $t('systemTatermarkManage.relatedDetails') }}
                </span>
                <span
                  style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                  @click="handleInfo(scope.row)"
                  v-if="PermissionInfo"
                >
                  {{ $t('public.particulars') }}
                </span>
                <span
                  style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                  @click="handleEdit(scope.row)"
                >
                  {{ $t('public.edit') }}
                </span>
                <span
                  :class="'danger'"
                  style="margin-right: 7px; cursor: pointer"
                  @click="handleDelete(scope.row)"
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
    <watermark-operation
      @systemTypeChange="systemTypeChange"
      @sysDialogClosed="sysDialogClosed"
      ref="watermarkOperation"
    ></watermark-operation>
    <watermark-table ref="watermarkTable"></watermark-table>
    <watermark-tenant-add
      ref="watermarkTenantAdd"
      @confirmTenant-clicks="confirmTenantClick"
      :waterTenantList="waterTenantList"
      :systemTypeInfo="systemTypeInfo"
      :watermarkId="watermarkId"
    ></watermark-tenant-add>
  </div>
</template>

<script>
import { getFormatDate } from '@/utils/common/mutil'
import { permissions } from '@/utils/common/permissions'
import { genWaterMark, removerWaterMark } from '@/utils/common/watermark'
import { mapState } from 'vuex'
import watermarkTenantAdd from './component/watermark-tenant-add'
import watermarkOperation from './component/watermark-operation'
import watermarkTable from './component/watermark-table'
import pagination from '@/components/pagination'

export default {
  name: 'SystemWatermark',
  components: {
    'watermark-table': watermarkTable,
    'watermark-operation': watermarkOperation,
    'watermark-tenant-add': watermarkTenantAdd,
    pagination
  },

  data() {
    return {
      addTenantVisible: false,
      isRouterAlive: true,
      watermarkDetailVisible: false,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      watermarkTypeArray: [],
      watermarkRuleArray: [],
      multipleSelection: [],
      contentWatermarkPlatform: [], // 内容水印平台类型
      videoWatermarkPlatform: [], // 视频水印平台类型
      // 条件搜索
      searchForm: {
        systemType: '',
        content: '',
        rule: '',
        tenantName: '',
        status: ''
      },
      batchDeletionBtn: true, //批量删除
      // 表格数据
      tableData: [],
      loading: true,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      operation: null,
      dialogFormVisible: false, // 添加或者编辑
      // 添加修改框表单
      dataForm: {},
      maskloading: false,
      newData: getFormatDate(new Date()).substr(0, 10),
      watermarkId: '',
      systemTypeInfo: '',
      keys: sessionStorage.getItem('account'),
      waterMarkInfo: {},
      contentWatermarkInfo: {},
      videoWatermarkInfo: {},
      waterTenantList: [],

      dialogTableFormVisible: false,
      platNameList: [],

      gbWatermarkEnable: false
    }
  },
  computed: {
    ...mapState({
      statusList: state => state.dict.channel_status,
      systemTypeArray: state => state.dict.system_type,
      directionList: state => state.dict.waterdirection_type
    })
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getGbWatermarkEnable()
    this.platformList()
    this.getWatermarkList()
    this.watermarkTypeData()
  },
  activated() {
    
  },
  methods: {
    getGbWatermarkEnable () {
      this.$api.getGbWatermarkEnable().then(res => {
        if (res.resultCode == 0) {
          this.gbWatermarkEnable = res.gbWatermarkEnable
        }
      })
    },
    descriptionFormat(val) {
      if (val == 1) {
        val = this.$t('systemTatermarkManage.writtenWords')
      } else if (val == 2) {
        val = this.$t('systemTatermarkManage.customRules')
      }
      return val
    },
    // 关闭添加租户弹框
    sysDialogClosed() {
      this.$refs['watermarkTenantAdd'].tenantdialogClosed()
    },
    systemTypeChange(typeInfo) {
      this.systemTypeInfo = typeInfo
      this.$refs['watermarkTenantAdd'].tenantList()
    },
    confirmTenantClick(relateIdTenantInfo) {
      this.$refs['watermarkOperation'].getconfirmTenantClick(relateIdTenantInfo)
    },
    //用户权限判断
    waterNameFilters(value) {
      let array = value.split(',')
      for (let i = 0; i < array.length; i++) {
        switch (array[i]) {
          case '1':
            array[i] = this.$t('systemTatermarkManage.affiliatedOrganization')
            break
          case '2':
            array[i] = this.$t('systemTatermarkManage.userName')
            break
          case '3':
            array[i] = this.$t('systemTatermarkManage.phone')
            break
          case '4':
            array[i] = this.$t('systemTatermarkManage.id')
            break
        }
      }
      let waterChineseName = array.join(',')
      return waterChineseName
    },
    async getPermissions() {
      this.PermissionInfo = await permissions(85)
      this.PermissionManage = await permissions(86)
    },
    getWatermarkList() {
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchParam: {
          systemType: this.searchForm.systemType,
          tenantName: this.searchForm.tenantName,
          content: this.searchForm.content,
          status: this.searchForm.status
        }
      }
      const regex1 = new RegExp(this.$t('systemTatermarkManage.affiliatedOrganization'), "g")
      const regex2 = new RegExp(this.$t('systemTatermarkManage.userName'), "g")
      const regex3 = new RegExp(this.$t('systemTatermarkManage.phone'), "g")
      const regex4 = new RegExp(this.$t('systemTatermarkManage.id'), "g")
      const matches1 = data.searchParam.content.match(regex1)
      const matches2 = data.searchParam.content.match(regex2)
      const matches3 = data.searchParam.content.match(regex3)
      const matches4 = data.searchParam.content.match(regex4)
      let arr = []
      if (matches1) {
        arr.push('1')
      }
      if (matches2) {
        arr.push('2')
      }
      if (matches3) {
        arr.push('3')
      }
      if (matches4) {
        arr.push('4')
      }
      data.searchParam.rule = arr.join(',')

      console.log(data.searchParam.rule)
      this.loading = true
      this.$api.getWatermarkInfoListByPage(data).then(res => {
        if (res.watermarkInfoList && res.watermarkInfoList.length) {
          this.tableData = res.watermarkInfoList
          this.tableData.forEach(item => {
            item['enableStatus'] = false
            if (item.status == 0) {
              item['enableStatus'] = true
            }
          })
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
        }
        this.loading = false
      })
    },
    setWaterMark(val) {
      switch (val) {
        case 1:
          return this.$t('systemTatermarkManage.contentWatermark')
        case 2:
          return this.$t('systemTatermarkManage.videoWatermark')
        case 3:
          return this.$t('systemTatermarkManage.nationalWatermark')
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    // 分页
    getListByPage() {
      this.getWatermarkList()
    },

    // 添加水印
    handleAdd() {
      this.waterTenantList = []
      this.watermarkId = ''
      this.dataForm = {}
      this.operation = 0
      this.dialogFormVisible = true
    },

    getCanvasInfo(canvasInfo) {
      //调用解密方法
      let contentDess = canvasInfo.content
      let textAlign = 'left'
      let options = {
        className: 'water-mark',
        width: 1920,
        height: 1080,
        fontSize: canvasInfo.size,
        content: contentDess,
        font: canvasInfo.size + 'px' + ' ' + 'Vedana',
        color: canvasInfo.colour,
        opacity: canvasInfo.clarityLevel * 100,
        rotateDegree: canvasInfo.angle + '',
        zIndex: 10000,
        textAlign: textAlign
      }
      sessionStorage.setItem('waterMark', JSON.stringify(options))
      return genWaterMark(options)
    },
    // 应用详情
    handleDevInfo(row) {
      this.watermarkId = row.watermarkId
      this.dialogTableFormVisible = true
    },

    // 详情
    handleInfo(row) {
      this.operation = 2
      this.watermarkId = row.watermarkId
      this.waterMarkInfo = {
        watermarkId: row.watermarkId
      }
      this.systemTypeInfo = row.systemType
      this.dialogFormVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.operation = 1
      this.watermarkId = row.watermarkId
      this.waterMarkInfo = {
        watermarkId: row.watermarkId
      }
      this.systemTypeInfo = row.systemType
      this.dialogFormVisible = true
    },

    // 详情信息
    async getWatermarkSelectService(watermarkCode) {
      let res = await this.$api.getWatermarkInfoDetail(watermarkCode)
      if (res.resultCode != 0) return
      this.waterTenantList = res.tenantList
    },

    // 搜索
    handleQuery() {
      this.pageNum = 1
      this.getWatermarkList()
    },
    //重置
    handleReset() {
      this.searchForm = {
        systemType: '',
        platType: '',
        status: '',
        content: '',
        rule: '',
      }
    },

    // 客户端获取视频水印
    async getVideoWatermarkHandle() {
      let res = await this.$api.getVideoWatermarkInfo({})
      if (res.resultCode != 0 || !res.watermarkInfo) return
      this.videoWatermarkInfo = res.watermarkInfo
    },

    // 是否启用
    handleUsing(row) {
      if (row.status == 1) {
        this.$confirm(this.$t('systemTatermarkManage.thisOperationWillOn'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(() => {
            let data = {
              watermarkId: row.watermarkId,
              status: 0
            }

            this.$api.changeWatermarkInfoStatus(data).then(res => {
              if (res.resultCode === 0) {
                row.enableStatus = true
                // 内容水印开启
                if (row.systemType == 1) {
                  this.$api.getContentWatermarkInfo({}).then(res => {
                    if (res.resultCode != 0 || !res.watermarkInfo) return
                    if (res.watermarkInfo) {
                      this.getCanvasInfo(res.watermarkInfo)
                      this.getWatermarkList()
                    } else {
                      this.getWatermarkList()
                    }
                  })

                  // 视频水印开启
                } else {
                  this.getVideoWatermarkHandle()
                  this.getWatermarkList()
                }
                this.$message({
                  type: 'success',
                  message: this.$t('systemTatermarkManage.openSuccessfully')
                })
              }
            })
          })
          .catch(() => {
            row.enableStatus = false
            this.$message({
              type: 'info',
              message: this.$t('systemTatermarkManage.canceledOpen')
            })
          })
      } else if (row.status == 0) {
        this.$confirm(this.$t('systemTatermarkManage.thisOperationWillOff'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(() => {
            let data = {
              watermarkId: row.watermarkId,
              status: 1
            }
            this.$api.changeWatermarkInfoStatus(data).then(res => {
              if (res.resultCode === 0) {
                row.enableStatus = false
                // 内容水印关闭
                if (row.systemType == 1) {
                  if (sessionStorage.getItem('waterMark')) {
                    sessionStorage.removeItem('waterMark')
                    removerWaterMark()
                    this.getWatermarkList()
                  } else {
                    this.getWatermarkList()
                  }

                  //视频水印关闭
                } else {
                  this.getWatermarkList()
                }
                this.$message({
                  type: 'success',
                  message: this.$t('systemTatermarkManage.closedSuccessfully')
                })
              }
            })
          })
          .catch(() => {
            row.enableStatus = true
            this.$message({
              type: 'info',
              message: this.$t('systemTatermarkManage.canceledClosed')
            })
          })
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('systemTatermarkManage.thisOperationWillDelete'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteWatermarkInfo({ watermarkId: row.watermarkId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              if (row.systemType === 1 && row.status === 0) {
                if (sessionStorage.getItem('waterMark')) {
                  sessionStorage.removeItem('waterMark')
                  removerWaterMark()
                }
              }
              this.getWatermarkList()
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
    //批量删除
    batchDeletionClick() {
      this.$confirm(
        this.$t('systemTatermarkManage.watermark', {
          num: this.multipleSelection.length
        }),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.loading = true
          this.$api.getContentWatermarkInfo({}).then(res => {
            const watermarkId = res?.watermarkInfo?.watermarkId || ''
            for (let i = 0; i < this.multipleSelection.length; i++) {
              let item = this.multipleSelection[i]
              this.$api.deleteWatermarkInfo({ watermarkId: item.watermarkId }).then(res => {
                if (res.resultCode == 0 && i == this.multipleSelection.length - 1) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.bulkDelSuccess')
                  })
                  this.getWatermarkList()
                } else if (res.resultCode == 0 && item.watermarkId == watermarkId) {
                  sessionStorage.removeItem('waterMark')
                  removerWaterMark()
                }
              })
            }
            this.loading = false
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length != 0) {
        this.batchDeletionBtn = false
      } else {
        this.batchDeletionBtn = true
      }
    },
    setwatermarkGroup(platTypeInfo) {
      if (platTypeInfo) {
        this.watermarkTypeArray.map(item => {
          if (platTypeInfo == item.dictItemValue) {
            platTypeInfo = item.dictItemName
          }
        })
      } else {
        platTypeInfo = ''
      }
      return platTypeInfo
    },

    watermarkTypeData() {
      this.getDictionary({ type: 'watermark-rule' }).then(res => {
        this.watermarkRuleArray = res.dictionaryList
      })
    },
    async platformList() {
      let data = {
        type: 1
      }
      await this.$api.getGroupTree(data).then(res => {
        this.platNameList = res.nodeList || []
      })
    },
  },
  watch: {
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    },
    'searchForm.systemType' (newVal, oldVal) {
      if (newVal == 3 && !this.gbWatermarkEnable) {
        this.$message({
          type: 'error',
          message: this.$t('systemTatermarkManage.needWatermark')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#system-watermark {
  height: 100%;

  .filter-container {
    position: relative;
    margin: 20px 0 2px;

  }
  .btnMargin {
    margin: 0;
  }
  .flexstart {
    display: flex;
    justify-content: flex-start;
    margin-right: 140px;
    .flexstart-input {
      width: 100%;
      max-width: 300px !important;
    }

  }
  .flex-item {
    width: 30%;
  }
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
