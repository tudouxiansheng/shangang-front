<template>
  <div id="access-camera-allocate" class="base" ref="accessCameraAllocate">
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
                <span class="custom-tree-node" :id="'node' + data.id">
                  <i :class="iconStyPlat(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <!-- 查询和其他操作 -->
      <el-col :span="20" style="padding: 0px 20px">
        <div class="btnMargin">
          <el-button type="primary" @click="handleAllocate">
            {{ $t('accessAllocate.allocation') }}
          </el-button>
          <el-button
            v-show="platformType != '15'"
            :loading="loadingData"
            type="primary"
            @click="handleData"
          >
            {{ $t('accessAllocate.synchronousData') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '194px' : '94px'"
            ref="form"
            :model="queryParams"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('accessAllocate.cameraName') + ':'">
                <el-input
                  v-model="queryParams.cameraName"
                  clearable
                  :placeholder="$t('accessAllocate.cameraNamePrompt')"
                />
              </el-form-item>
              <el-form-item :label="$t('accessAllocate.cameraStatus') + ':'">
                <el-select v-model="queryParams.cameraStatus" clearable>
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="(item, index) in cameraStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" style="display: inline-block" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <el-button @click="handleRest">{{ $t('public.reset') }}</el-button>
            </div>
          </el-form>
        </div>

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
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              :label="$t('accessAllocate.cameraId')"
              prop="cameraId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('accessAllocate.cameraName')"
              prop="cameraName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('accessAllocate.platName')"
              prop="platName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('accessAllocate.mainDevId')"
              prop="mainDevId"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('accessAllocate.cameraStatus')" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="setStatusClass(row.cameraStatus)">
                  {{ setStatus(row.cameraStatus) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('public.createTime')"
              prop="createTime"
              show-overflow-tooltip
              min-width="90"
            />
            <el-table-column
              :label="$t('public.updateTime')"
              prop="updateTime"
              show-overflow-tooltip
              min-width="90"
            />

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <el-button type="text" class="cell-operate" @click="handleView(row)">
                  {{ $t('public.particulars') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="!loading && tableData.length"
            :total="total"
            v-model:pageNum="queryParams.pageInfo.pageNum"
            v-model:limit="queryParams.pageInfo.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <device-allcate-tree></device-allcate-tree>
    <access-camera-allocate-detail></access-camera-allocate-detail>
    <!-- 调拨设备失败列表 -->
    <device-allcate-error-list></device-allcate-error-list>
  </div>
</template>

<script>
import getLazyTree from '@/mixin/getLazyTree.js'
import devDict from '@/mixin/dev-dict.js'
import deviceAllcateTree from './component/device-allcate-tree'
import accessCameraAllocateDetail from './component/allocate-detail'
import deviceAllcateErrorList from '@/views/mini/pages/common/device/component/device-allcate-error-list'
export default {
  data() {
    return {
      loadingData: false,
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      screenFlag: true,
      treeNodeType: '',
      loading: false,
      // 表格数据
      tableData: [],
      tableHeight: 630,
      dataText: '',
      organizationId: '',
      isSearch: false,
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        cameraName: '',
        cameraStatus: '',
        platId: ''
      },
      cameraStatusList: [],
      dialogFormVisible_detail: false,
      dataForm: {},
      maskloading: false,
      //调拨设备
      allcateTreeDialogVisible: false,
      //调拨失败对话框
      allcateErrorDialogVisible: false,
      platformType: '',
      resultlist: [],
      
    }
  },
  mixins: [getLazyTree, devDict],
  name: 'accessPlatformManage',
  components: {
    deviceAllcateTree,
    accessCameraAllocateDetail,
    deviceAllcateErrorList
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      this.cameraStatusList = [
        {
          name: this.$t('public.statustype1'),
          value: 1
        },
        {
          name: this.$t('public.statustype2'),
          value: 2
        },
        {
          name: this.$t('public.statustype3'),
          value: 3
        },
        {
          name: this.$t('public.statustype0'),
          value: 4
        }
      ]
    },
    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1,
        platformLevelType: 2,
        ability: 'SURVEILLANCE'
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getPlatTree(data).then(res => {
        list = res.nodeList || []

        for (let i = 0; i < list.length; i++) {
          this.$nextTick().then(async () => {
            if (list[i].type != 2) {
              let dom = document.getElementById('node' + list[i].id)
              if (dom) {
                dom.parentElement.style.cursor = 'not-allowed'
                dom.parentElement.classList.add('clickColor')
              }
            }
          })
        }
        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    handleNodeClick(data, node) {
      //platformType ads:15 ivs:5
      this.platformType = data.payload.platformType
      if (data.type == 2) {
        this.treeNodeType = data.type
        this.queryParams.platId = data.id
        this.organizationId = node.parent.data.payload.organizationId
        this.handleFind()
      } else {
        document.getElementById('node' + data.id).parentElement.classList.add('clickColor')
      }
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
    handleFind() {
      if (this.treeNodeType != 2) {
        this.$message({
          type: 'warning',
          message: this.$t('accessAllocate.selectPlatToSearch')
        })
        return
      }
      this.queryParams.pageInfo.pageNum = 1
      this.isSearch = true
      this.getList()
    },

    handleRest() {
      this.queryParams.cameraName = ''
      this.queryParams.cameraStatus = ''
    },

    async getList() {
      this.loading = true
      this.queryParams.cameraStatus === '' ? (this.queryParams.cameraStatus = null) : null
      let res = await this.$api.selectAccessCameras(this.queryParams)
      if (res.resultCode == 0 && res.accessCameraInfoList) {
        this.tableData = res.accessCameraInfoList
        this.total = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },
    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      } else if (val == 3) {
        return 'warning'
      } else if (val == 4) {
        return 'warning'
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    //同步镜头数据
    handleData() {
      if (this.treeNodeType != 2) {
        this.$message({
          type: 'warning',
          message: this.$t('accessAllocate.pleasePlatform')
        })
        return
      } else {
        this.loadingData = true
        this.$api
          .synchronizationData({ platId: this.queryParams.platId })
          .then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('accessAllocate.synchronizeSuccessfully')
              })
              this.loadingData = false
            }
          })
          .catch(() => {
            this.loadingData = false
          })
      }
    },

    handleAllocate() {
      if (this.treeNodeType != 2) {
        this.$message({
          type: 'warning',
          message: this.$t('accessAllocate.selectPlatToAllocate')
        })
        return
      }
      this.allcateTreeDialogVisible = true
    },
    /** 详情按钮操作 */
    async handleView(row) {
      await this.getInfo(row)
      this.dialogFormVisible_detail = true
    },

    async getInfo(row) {
      let res = await this.$api.getAccessCameraDetail({
        cameraId: row.cameraId,
        platId: this.queryParams.platId
      })
      if (res.resultCode == 0) {
        this.dataForm = {
          ...res
        }
      }
    }
  }
}
</script>

<style lang="scss">
#access-camera-allocate {

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .clickColor {
    background: #052a3f !important;
  }
}
</style>
