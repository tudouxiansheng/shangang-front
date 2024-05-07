<template>
  <!-- 镜头转码配置 -->
  <div id="device-transcode" v-if="isRouterAlive" ref="deviceTranscode">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :withTenant="true"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <div style="position: relative">
          <div style="margin: 20px 0 20px" v-if="PermissionManage">
            <el-button type="primary" @click="goToTemplate">
              {{ $t('lens.TranscodingConfiguration') }}
            </el-button>
            <el-button type="primary" @click="VolumeSet" :disabled="batchShow">
              {{ $t('lens.BatchTranscoding') }}
            </el-button>
          </div>
        </div>

        <div class="search-form" style="position: relative; margin-top: 20px">
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
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('deviceCamera.cameraStatus') + ' ：'"
                prop="status"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="screenFlag"
              >
                <el-select v-model="searchForm.status" @change="search_change">
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.statusname"
                    :value="item.statustype"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flexstart" v-show="showManyCondition">
              <el-form-item
                :label="$t('deviceCamera.cameraStatus') + ' ：'"
                prop="status"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="!screenFlag"
              >
                <el-select v-model="searchForm.status" @change="search_change">
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.statusname"
                    :value="item.statustype"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <div @click="manyCondition" class="manyCondition inputMiddle" v-if="!screenFlag">
                <span>{{ $t('public.manyCondition') }}</span>
                <span :class="iconName"></span>
              </div>
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
          <el-table
            v-if="!loading && tableData.length"
            :row-class-name="tableRowClassName"
            class="elTable"
            max-height="630"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('deviceCamera.cameraId')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.cameraId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceCamera.cameraName')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.cameraName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.state')" min-width="90" show-overflow-tooltip>
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
                  {{ setstatus(row.cameraStatus) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('lens.BroadcastState')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setStreamStatus(row.streamStatus) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('lens.transcoding')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.templetName || 'N/A' }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.updateTime')" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="100">
              <template #default="{ row }">
                <span class="cell-operate" @click="configuration(row)" v-if="PermissionManage">
                  {{ $t('lens.configuration') }}
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
        </div>
      </el-col>
    </el-row>
    <!-- 设备分发转码配置 -->
    <configure-transcoding></configure-transcoding>
    <!-- 批量设置转码模板 -->
    <batch-configure-transcoding></batch-configure-transcoding>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'

import judgeWindow from '@/mixin/judgeWindow'

import configureTranscoding from './component/configure-transcoding'
import batchConfigureTranscoding from './component/batch-configure-transcoding'
import breadcrumb from '@/components/breadcrumb' //面包屑
import lazyTree from '@/components/lazy-tree' //懒加载树

export default {
  mixins: [judgeWindow],
  components: {
    'configure-transcoding': configureTranscoding,
    'batch-configure-transcoding': batchConfigureTranscoding,
    breadcrumb,
    'lazy-tree': lazyTree
  },
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),

      // 组织树
      organizationId: 0,

      isSearch: false,
      searchForm: {
        cameraName: '',
        streamStatus: '',
        status: ''
      },
      streamTypeData: [], //码流类型
      streamStatusData: [], //转码状态
      statusList: [],

      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标

      pageNumPlat: 1,
      pageSizePlat: 100,
      totalNumPlat: 0,
      templateList: [], //转码模板

      batchShow: true,
      multipleSelection: [],

      tableData: [],
      dataText: '',
      loading: false,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      // 转码
      lensConfiguration: false,
      dataForm: {},

      //批量转码
      batchConfiguration: false,
      batchDataForm: {},
      ifHaveTransed: false,
      ifHavePauseTransed: false,

      maskloading: false
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setData()
      this.locale = localStorage.getItem('locale')
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.setData()
    this.getTemplateList()
  },
  activated() {
    
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

    setstatus(val) {
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
    // 国际化
    setData() {
      this.streamStatusData = [
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
        },
        {
          statusType: 'notConfig',
          statusName: this.$t('lens.statusNameNo')
        }
      ]
      this.streamTypeData = [
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
      ]
      this.statusList = [
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
      ]
    },
    // 树加载完初始化表格
    initData(list) {
      this.organizationId = list[0].payload.organizationId
      //初始化面包屑
      this.$refs.breadcrumb.initBread(list)
      this.getTranscodeTasks()
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
    },

    getTranscodeTasks() {
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

    goToTemplate() {
      this.$router.push('/transcodeTempList')
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.batchShow = false
      } else {
        this.batchShow = true
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

    // 配置转码
    async configuration(row) {
      const res = await this.$api.getTranscodeTaskInfo({
        cameraId: row.cameraId
      })
      if (res.resultCode != 0) return
      let cameraTranscodeTaskInfo = res.cameraTranscodeTaskInfo
      if (cameraTranscodeTaskInfo) {
        this.dataForm = {
          streamType: cameraTranscodeTaskInfo.streamType,
          templateId: cameraTranscodeTaskInfo.templateId,
          streamStatus: cameraTranscodeTaskInfo.streamStatus
        }
      } else {
        this.dataForm = {
          streamType: '',
          templateId: '',
          streamStatus: 'notConfig'
        }
      }
      this.dataForm.cameraName = row.cameraName
      this.dataForm.cameraId = row.cameraId

      this.lensConfiguration = true
    },

    //批量转码
    VolumeSet() {
      this.ifHaveTransed = false
      this.ifHavePauseTransed = false
      let cameraNameArr = []
      let statusTypeArr = []
      this.batchDataForm.transcodeType = ''
      this.batchDataForm.recordPolicyName = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let item = this.multipleSelection[i]
        if (item.cameraStatus == '2') {
          this.$message({
            type: 'warning',
            message: this.$t('lens.chooseDevHaveOffline')
          })
          return
        }
        if (item.streamStatus || item.streamStatus == 0) {
          this.ifHaveTransed = true
        }
        if (
          item.streamStatus != 0 &&
          item.streamStatus != 1 &&
          item.streamStatus != 2 &&
          item.streamStatus != 3 &&
          item.streamStatus != 4
        ) {
          this.ifHavePauseTransed = true
        }
        for (let j = 0; j < this.streamStatusData.length; j++) {
          if (item.streamStatus == this.streamStatusData[j].statusType) {
            statusTypeArr.push(this.streamStatusData[j].statusName)
          } else if (!item.streamStatus) {
            statusTypeArr.push(this.$t('lens.statusNameNo'))
            break
          }
        }
        cameraNameArr.push(item.cameraName)
      }

      this.batchDataForm.streamStatus = statusTypeArr.join(',')
      this.batchDataForm.cameraName = cameraNameArr.join(',')

      this.batchConfiguration = true
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
