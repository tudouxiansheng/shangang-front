<template>
  <div
    id="device-model"
    ref="deviceModel"
    v-if="isRouterAlive"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    
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
                  <i :class="iconSty(data)" class="aci iconCss"></i>
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
          <el-button type="primary" @click="handleBatch" :disabled="batchShow">
            {{ $t('devModel.batchSet') }}
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '130px' : '84px'"
            ref="form"
            :model="queryParams"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('devModel.cameraId') + ':'">
                <el-input
                  v-model="queryParams.cameraId"
                  clearable
                  :placeholder="$t('devModel.inputCameraID')"
                />
              </el-form-item>
              <el-form-item :label="$t('devModel.cameraName') + ':'">
                <el-input
                  v-model="queryParams.cameraName"
                  clearable
                  :placeholder="$t('devModel.inputCameraName')"
                />
              </el-form-item>
              <el-form-item :label="$t('devModel.cameraType') + ':'">
                <el-select v-model="queryParams.ptzType" clearable>
                  <el-option
                    v-for="(item, index) in ptzTypeData"
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
        <!-- //面包屑 -->
        <el-breadcrumb separator=">" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, index) in getBreadcrumbList"
            :key="index"
            @click="
              item.label == '>>' || item.label == '<<' ? clickBreadPoint(item) : clickBread(item)
            "
            @mouseover="item.label == '· · ·' ? overBread(index) : ''"
            @mouseleave="item.label == '>>' || item.label == '<<' ? outBread(index) : ''"
          >
            <template #default>
              <span
                v-if="item.label?.length < 10 || item.label?.length == 10"
                :style="item.label == '· · ·' ? 'fontSize:12px' : ''"
              >
                {{ item.label }}
              </span>
              <el-tooltip effect="dark" :content="item.label" placement="top">
                <span v-if="item.label?.length > 10">
                  {{ item.label.substring(0, 10) + '...' }}
                </span>
              </el-tooltip>
            </template>
          </el-breadcrumb-item>
        </el-breadcrumb>
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
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('devModel.cameraId')"
              prop="cameraId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('devModel.cameraName')"
              prop="cameraName"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('devModel.metadataType')" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ setModel(row.modelList) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleView(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleUpdate(row)">
                  {{ $t('devModel.manageMap') }}
                </span>
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

    <device-model-set></device-model-set>
    <batch-set></batch-set>
  </div>
</template>

<script>
import deviceModelSet from './component/device-model-set'
import batchSet from './component/batch-set'
import treeBread from '@/mixin/treeBread.js'
import getLazyTree from '@/mixin/getLazyTree.js'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [getLazyTree, treeBread],
  name: 'AlgorithmDeviceModelManagement',
  components: {
    deviceModelSet,
    batchSet
  },
  data() {
    return {
      dialogFormVisible_batch: false,
      choosedSelectBySearch: {},
      isRouterAlive: true,
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        cameraId: '',
        cameraName: '',
        ptzType: '',
        organizationId: ''
      },
      pageloading: false,
      loading: false,
      tableData: [], // 表格数据

      locale: localStorage.getItem('locale'),
      tableHeight: 630,
      dataText: '',

      operation: true,
      maskloading: false,
      organizationId: '',
      organizationName: '',
      isSearch: false,

      dialogFormVisible_detail: false,
      batchShow: true,
      multipleSelection: [],
      choosedCameraId: '',

      options: []
    }
  },
  computed: {
    ...mapState({
      ptzTypeData: state => state.dict['device-type'], // 摄像机类型
      algorithmTypeList: state => state.dict['algorithm-type'] // 算法类型
    }),
    getBreadcrumbList() {
      return this.breadcrumbList.filter(item => item.label)
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  async created() {
    await this.getDictionaryList()
  },
  methods: {
    setModel(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].modelName)
        }
        return arr.join(', ')
      } else {
        return ''
      }
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryList() {
      this.getSysDictData(['device-type', 'algorithm-type'])
    },

    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        this.initBread(res)

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.organizationName = list[0].payload.organizationName
          this.organizationId = list[0].payload.organizationId
          this.queryParams.organizationId = list[0].payload.organizationId
          await this.getList()
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    handleNodeClick(data, node, self) {
      //点击树联动面包屑
      this.treeLinkBread(data, node, self)
      this.organizationName = data.payload.organizationName
      this.organizationId = data.payload.organizationId
      this.queryParams.organizationId = data.payload.organizationId
      this.handleFind()
    },
    handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      this.isSearch = true
      this.getList()
    },

    handleRest() {
      this.queryParams.cameraId = ''
      this.queryParams.cameraName = ''
      this.queryParams.ptzType = ''
    },

    async getList() {
      this.loading = true
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      queryParams.ptzType === '' ? (queryParams.ptzType = null) : null
      let res = await this.$api.getDeviceList(queryParams)
      if (res.resultCode == 0 && res.cameraList) {
        this.tableData = res.cameraList
        this.total = res.pageInfo.totalNum || 0
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    /** 表格多选框选中数据 */
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length != 0) {
        this.batchShow = false
      } else {
        this.batchShow = true
      }
    },

    /** 详情按钮操作 */
    async handleView(row) {
      this.choosedCameraId = row.cameraId
      this.operation = 'info'
      this.dialogFormVisible_detail = true
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.choosedCameraId = row.cameraId
      this.operation = 'update'
      this.dialogFormVisible_detail = true
    },

    // 批量设置 ！
    handleBatch() {
      this.dialogFormVisible_batch = true
    }
  }
}
</script>

<style lang="scss">
#device-model {
  height: 100%;

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .el-dropdown {
    font-size: 14px;
  }
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .search-form .flexstart {
    width: calc(100% - 160px);
  }
}
</style>
