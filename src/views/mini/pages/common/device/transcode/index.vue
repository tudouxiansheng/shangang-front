<template>
  <!-- 镜头转码任务 -->
  <div v-if="isRouterAlive" ref="deviceTranscode" id="device-transcode">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <LazyTree
            ref="lazyTree"
            :withTenant="true"
            @initList="initData"
            @nodeClick="treeNodeClick"
          ></LazyTree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <div v-if="PermissionManage" class="btnMargin">
          <el-button type="primary" @click="createTask">
            {{ $t('lensTranscodingTask.create') }}
          </el-button>
          <el-button
            type="primary"
            :icon="ElIconCheck"
            :disabled="startBtnShow"
            @click="handleStart"
          >
            {{ $t('lensTranscodingTask.batchStart') }}
          </el-button>
          <el-button type="primary" :icon="ElIconClose" :disabled="stopBtnShow" @click="handleStop">
            {{ $t('lensTranscodingTask.batchStop') }}
          </el-button>
          <el-button type="danger" :disabled="batchBtnShow" @click="handleDelete">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="searchForm"
            label-position="left"
            :label-width="locale == 'en' ? '132px' : '84px'"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('deviceCamera.cameraName') + ' ：'"
                prop="cameraName"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-input
                  v-model="searchForm.cameraName"
                  auto-complete="off"
                  :placeholder="$t('lens.pleaseInputlensName')"
                  clearable
                  @change="search_change"
                />
              </el-form-item>
              <el-form-item
                :label="$t('lens.BroadcastState') + ' ：'"
                prop="streamStatus"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-select
                  v-model="searchForm.streamStatus"
                  :placeholder="$t('public.all')"
                  clearable
                  @change="search_change"
                >
                  <el-option
                    v-for="(item, index) in streamStatusData"
                    :key="index"
                    :label="item.statusName"
                    :value="item.statusType"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('deviceCamera.cameraStatus') + ' ：'"
                prop="status"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select v-model="searchForm.status" @change="search_change" clearable>
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.statusname"
                    :value="item.statustype"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div v-show="showManyCondition" class="flexstart">
              <el-form-item
                :label="$t('deviceCamera.cameraStatus') + ' ：'"
                prop="status"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="!screenFlag"
              >
                <el-select v-model="searchForm.status" @change="search_change" clearable>
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.statusname"
                    :value="item.statustype"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" class="miniBtn" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <div class="manyCondition inputMiddle" @click="manyCondition" v-if="!screenFlag">
                <span>{{ $t('public.manyCondition') }}</span>
                <i :class="iconName" />
              </div>
            </div>
          </el-form>
        </div>
        <!-- //面包屑 -->
        <BreadCrumb ref="breadcrumb" @changeTree="tree_change" />

        <no-table :tableLoading="loading" :tableData="tableData">
          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :row-class-name="tableRowClassName"
            class="elTable"
            max-height="630"
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('deviceCamera.cameraName')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.cameraName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('lensTranscodingTask.taskID')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.taskId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('deviceCamera.cameraId')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.cameraId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('lensTranscodingTask.cameraStatus')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span
                  :class="
                    row.cameraStatus == '0'
                      ? 'warning'
                      : row.cameraStatus == '1'
                      ? 'success'
                      : row.cameraStatus == '2'
                      ? 'danger'
                      : ''
                  "
                >
                  {{ setStatus(row.cameraStatus) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('lensTranscodingTask.streamType')"
              min-width="90"
              show-overflow-tooltip
            >
              <!-- streamType -->
              <template #default="{ row }">
                <span>{{ setStreamType(Number(row.streamType)) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('lens.transcoding')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.templetName || 'N/A' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('lensTranscodingTask.transcodingNodes')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.transcodeNode }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('lensTranscodingTask.streamStatus')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setStreamStatus(row.streamStatus) }}</span>
              </template>
            </el-table-column>
            <!-- 失败原因 -->
            <el-table-column
              :label="$t('lensTranscodingTask.reason')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.taskFailMsg ? row.taskFailMsg : '--' }}</span>
                <el-tooltip
                  v-if="row.taskFailMsg"
                  :content="$t('lensTranscodingTask.tips')"
                  placement="top"
                  effect="light"
                >
                  <el-icon
                    class="warning"
                    style="margin-left: 10px; font-size: 16px; cursor: pointer"
                  >
                    <el-icon-warning-outline />
                  </el-icon>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="140">
              <template #default="{ row }">
                <span class="cell-operate" @click="transcodingDetail(row, 1)">
                  {{ $t('public.particulars') }}
                </span>
                <span
                  v-if="PermissionManage"
                  class="cell-operate"
                  v-show="row.streamStatus == 3 || row.streamStatus == 4"
                  @click="transcodingDetail(row, 2)"
                >
                  {{ $t('public.modify') }}
                </span>
                <span
                  v-if="PermissionManage && (row.streamStatus == 3 || row.streamStatus == 4)"
                  style="margin-right: 6px; cursor: pointer"
                  class="success"
                  @click="handleStart(row)"
                >
                  {{ $t('lensTranscodingTask.start') }}
                </span>
                <span
                  v-if="
                    PermissionManage &&
                    (row.streamStatus == 0 || row.streamStatus == 1 || row.streamStatus == 2)
                  "
                  class="danger cell-operate"
                  @click="handleStop(row)"
                >
                  {{ $t('lensTranscodingTask.stop') }}
                </span>
                <span
                  v-if="PermissionManage && (row.streamStatus == 3 || row.streamStatus == 4)"
                  class="danger cell-operate"
                  @click="handleDelete(row)"
                >
                  {{ $t('lensTranscodingTask.delete') }}
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
          />
        </no-table>
      </el-col>
    </el-row>
    <!-- 创建静态转码任务 Create a static transcoding task-->
    <CreateTranscodingTask :payload="payload" :payloadFirst="payloadFirst" />
    <!-- 静态转码详情/修改 -->
    <TranscodingDetailEdit
      :title="title"
      :modifyOrDetailType="modifyOrDetailType"
      :transDetail="transDetail"
    />
    <!-- 批量操作 -->
    <BatchOperate
      :multipleSelection="multipleSelection"
      :what="$t('lensTranscodingTask.task')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="taskId"
      whatName="cameraName"
      v-model:visible="batchDialogVisible"
      @getList="getTranscodeTasks"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import {
  Warning as ElIconWarningOutline,
  Check as ElIconCheck,
  Close as ElIconClose
} from '@element-plus/icons-vue'
import { permissions } from '@/utils/common/permissions'

import judgeWindow from '@/mixin/judgeWindow'

import BreadCrumb from '@/components/breadcrumb' //面包屑
import lazyTree from '@/components/lazy-tree' //懒加载树

const CreateTranscodingTask = () => import('./component/create-transcoding-task')
const TranscodingDetailEdit = () => import('./component/transcoding-detail-edit')
import BatchOperate from '@/components/batchOperate' //批量操作

export default {
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      // 组织树
      organizationId: 0,
      //组织树传id和parentId
      payload: {},
      payloadFirst: {},
      isSearch: false,
      searchForm: {
        cameraName: '',
        streamStatus: '',
        status: ''
      },
      //码流类型
      streamTypeList: [
        {
          streamType: 1,
          streamName: this.$t('public.streamType1')
        },
        {
          streamType: 2,
          streamName: this.$t('public.streamType2')
        },
        {
          streamType: 3,
          streamName: this.$t('public.streamType3')
        }
      ],
      //转码状态 0.初创建，1.正在开启，2.运行中，3.已停止，4.错误
      streamStatusData: [
        {
          statusType: '',
          statusName: this.$t('public.all')
        },
        {
          statusType: 0,
          statusName: this.$t('lens.statusName0')
        },
        {
          statusType: 1,
          statusName: this.$t('lens.statusName1')
        },
        {
          statusType: 2,
          statusName: this.$t('lens.statusName2')
        },
        {
          statusType: 3,
          statusName: this.$t('lens.statusName3')
        },
        {
          statusType: 4,
          statusName: this.$t('lens.statusName4')
        }
      ],
      statusList: [
        {
          statustype: '',
          statusname: this.$t('public.all')
        },
        {
          statustype: 1,
          statusname: this.$t('public.statustype1')
        },
        {
          statustype: 2,
          statusname: this.$t('public.statustype2')
        }
      ],
      // 高级搜索点击显示与隐藏
      showManyCondition: false,
      // iconClass 高级搜索的字体图标
      iconName: 'el-icon-arrow-down',
      pageNumPlat: 1,
      pageSizePlat: 100,
      totalNumPlat: 0,
      //转码模板
      templateList: [],
      //转码模板对象
      templateListObj: {},
      //批量操作
      batchApi: '',
      operate: '',
      startBtnShow: true,
      stopBtnShow: true,
      batchBtnShow: true,
      //批量操作对话框
      batchDialogVisible: false,
      //表格选中状态存放数组
      multipleSelection: [],
      tableData: [],
      dataText: '',
      loading: false,
      pageNum: 1,
      pageSize: 10,
      // 总数量
      totalNum: 0,
      // 转码
      title: '',
      transDetail: null,
      modifyOrDetailType: undefined,
      //创建转码任务显隐
      createDialogVisible: false,
      //详情/修改 面板显隐
      dialogFormVisible: false,
      // 点击提交按钮后蒙版
      maskloading: false,
      ElIconCheck,
      ElIconClose
    }
  },
  components: {
    BreadCrumb,
    LazyTree,
    CreateTranscodingTask,
    TranscodingDetailEdit,
    BatchOperate,
    ElIconWarningOutline
  },
  name: 'CameraTranscode',
  mixins: [judgeWindow],
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getTemplateList()
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(30)
    },
    pageResize() {
      this.locale = localStorage.getItem('locale')
      this.judgeWindow(1882)
    },
    setStreamType(val) {
      let streamName = ''
      switch (val) {
        case 1:
          streamName = this.$t('public.streamType1')
          break
        case 2:
          streamName = this.$t('public.streamType2')
          break
        case 3:
          streamName = this.$t('public.streamType3')
          break
      }
      return streamName
    },
    // 1-H264 2-MJPEG 3-MPEG4 4-MPEG2 5-AVS 6-H265 7-SVAC
    setEncodeType(val) {
      let encodeName = ''
      switch (val) {
        case '1':
          encodeName = 'H264'
          break
        case '2':
          encodeName = 'MJPEG'
          break
        case '3':
          encodeName = 'MPEG4'
          break
        case '4':
          encodeName = 'MPEG2'
          break
        case '5':
          encodeName = 'AVS'
          break
        case '6':
          encodeName = 'H265'
          break
        case '7':
          encodeName = 'SVAC'
          break
      }
      return encodeName
    },
    //码流状态
    setStreamStatus(val) {
      if (val == 0) {
        return this.$t('lens.statusName0')
      } else if (val == 1) {
        return this.$t('lens.statusName1')
      } else if (val == 2) {
        return this.$t('lens.statusName2')
      } else if (val == 3) {
        return this.$t('lens.statusName3')
      } else if (val == 4) {
        return this.$t('lens.statusName4')
      } else {
        return this.$t('lens.statusNameNo')
      }
    },
    // 镜头状态
    setStatus(val) {
      let name = ''
      if (val == 0) {
        name = this.$t('public.statustype0')
      } else if (val == 1) {
        name = this.$t('public.statustype1')
      } else if (val == 2) {
        name = this.$t('public.statustype2')
      } else if (val == 3) {
        name = this.$t('public.statustype3')
      }
      return name
    },
    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      this.payload = list[0].payload
      //树的最外层节点
      this.payloadFirst = list[0].payload
      //初始化面包屑
      this.$refs.breadcrumb.initBread(list)
      //加载转码任务列表
      this.getTranscodeTasks()
    },
    // 点击树节点
    treeNodeClick(obj) {
      // 点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
      //组织id
      this.organizationId = obj.data.payload.organizationId
      this.payload = obj.data.payload
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
    //转码模板
    async getTemplateList() {
      let obj = {
        pageInfo: {
          pageNum: this.pageNumPlat,
          pageSize: this.pageSizePlat
        },
        searchInfo: {
          transcodeType: 1
        }
      }
      await this.$api.queryTemplateList(obj).then(res => {
        if (res.templateList) {
          this.templateList = this.templateList.concat(res.templateList)
          this.totalNumPlat = res.pageInfo.totalNum
        }
      })

      if (this.totalNumPlat > this.pageNumPlat * this.pageSizePlat) {
        this.pageNumPlat++
        this.getTemplateList()
      }
      //转码模板对象
      this.templateList.forEach(item => {
        this.templateListObj[item.templateId] = item.templateName
      })
    },
    //创建转码任务
    createTask() {
      this.createDialogVisible = true
    },
    //启动
    async handleStart(row) {
      this.$confirm(
        row.cameraId
          ? this.$t('public.isStart')
          : this.$t('public.choose') +
              this.multipleSelection.length +
              this.$t('public.isBatchStart'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          if (row.cameraId) {
            this.$api
              .startTranscodesTask({
                cameraId: row.cameraId,
                taskId: row.taskId
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('algoGuard.startTaskSucc')
                  })
                  this.getTranscodeTasks({ pageNum: 1 })
                }
              })
            return
          }
          this.operate = this.$t('lensTranscodingTask.start')
          this.batchApi = 'startTranscodesTask'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledStart')
          })
        })
    },

    //停止
    async handleStop(row) {
      this.$confirm(
        row.cameraId
          ? this.$t('public.isStop')
          : this.$t('public.choose') +
              this.multipleSelection.length +
              this.$t('public.isBatchStop'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          if (row.cameraId) {
            this.$api
              .stopTranscodesTask({
                cameraId: row.cameraId,
                taskId: row.taskId
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('algoGuard.stopTaskSucc')
                  })
                  this.getTranscodeTasks({ pageNum: 1 })
                }
              })
            return
          }
          this.operate = this.$t('lensTranscodingTask.batchStopContent')
          this.batchApi = 'stopTranscodesTask'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledStop')
          })
        })
    },

    //删除
    async handleDelete(row) {
      this.$confirm(
        row.cameraId
          ? this.$t('systemAnnounce.isDelete')
          : this.$t('public.choose') +
              this.multipleSelection.length +
              this.$t('public.isBatchDelete'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(() => {
          if (row.cameraId) {
            this.$api
              .deleteTranscodesTask({
                cameraId: row.cameraId,
                taskId: row.taskId
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.delSuccess')
                  })
                  this.getTranscodeTasks({ pageNum: 1 })
                }
              })
            return
          }
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'deleteTranscodesTask'
          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    //静态转码任务详情
    transcodingDetail(row, type) {
      this.modifyOrDetailType = type
      this.title =
        type === 1 ? this.$t('lensTranscodingTask.detail') : this.$t('lensTranscodingTask.modify')
      this.transDetail = row
      this.dialogFormVisible = true
    },
    getTranscodeTasks(obj) {
      if (obj) {
        this.pageNum = obj.pageNum
      }
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchInfo: {
          organizationId: this.organizationId,
          cameraName: '',
          streamStatus: '',
          status: ''
        }
      }
      if (this.isSearch) {
        Object.assign(data.searchInfo, this.searchForm)
      }
      this.$api.getCameraTranscodeTasks(data).then(res => {
        if (res.resultCode == 0) {
          if (res.pageInfo) {
            this.totalNum = res.pageInfo.totalNum
          } else {
            this.totalNum = 0
          }
          if (res.cameraTranscodeTasks) {
            this.tableData = res.cameraTranscodeTasks
          } else {
            this.tableData = []
            this.dataText = this.$t('public.noData')
          }
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

    handleSelectionChange(val) {
      // 多选控制不同功能按钮
      this.multipleSelection = val
      if (val.length) {
        this.startBtnShow = !this.multipleSelection.every(
          item => item.streamStatus == 3 || item.streamStatus == 4
        )
        this.stopBtnShow = !this.multipleSelection.every(
          item => item.streamStatus == 0 || item.streamStatus == 1 || item.streamStatus == 2
        )
        this.batchBtnShow = false
      } else {
        this.startBtnShow = true
        this.stopBtnShow = true
        this.batchBtnShow = true
      }
    },
    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
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
        this.searchForm.cameraName = ''
        this.searchForm.streamStatus = ''
        this.searchForm.status = ''
      }
    },
    handleFind() {
      this.pageNum = 1
      this.isSearch = true
      this.getTranscodeTasks()
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.getTranscodeTasks()
    }
  }
}
</script>

<style lang="scss">
#device-transcode {
  .flex-item {
    width: 42%;
  }
}
</style>
