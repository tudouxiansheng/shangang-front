<template>
  <!-- 添加租户 -->
  <el-dialog
    :title="$t('systemTatermarkManage.addTenant')"
    v-model="$parent.addTenantVisible"
    top="10vh"
    width="1270px"
    :close-on-click-modal="false"
    :modal="false"
    @open="dialogOpen"
    @closed="dialogClosed"
    draggable
    id="tenantDialog"
  >
    <el-row>
      <el-col :span="6" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-tree ref="lazyTree" @nodeClick="treeNodeClick"></lazy-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="18" class="el-row20">
        <!-- 查询和其他操作 -->
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
              <el-form-item :label="$t('tenantManage.tenantName') + ' ：'" prop="tenantName">
                <el-input
                  v-model="searchForm.tenantName"
                  auto-complete="off"
                  :placeholder="$t('tenantManage.namePrompt')"
                />
                <el-icon @click="searchTenantNameClick"><el-icon-search /></el-icon>
              </el-form-item>
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
            max-height="616"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            :row-key="getRowKeys"
            tooltip-effect="dark"
          >
            <template #empty>
              <span style="font-size: 14px">{{ dataText }}</span>
            </template>
            <el-table-column
              :reserve-selection="true"
              :selectable="checkSelectable"
              type="selection"
              width="50"
            ></el-table-column>

            <el-table-column
              :show-overflow-tooltip="true"
              :label="$t('tenantManage.tenantName')"
              min-width="80"
            >
              <template #default="scope">
                <span>{{ scope.row.tenantName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              :label="$t('public.account')"
              min-width="80"
            >
              <template #default="scope">
                <span>{{ scope.row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              :label="$t('tenantManage.industryType')"
              min-width="80"
            >
              <template #default="scope">
                <span>{{ set_industryType(scope.row.industryType) }}</span>
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="tenantdialogClosed()">{{ $t('public.cancel') }}</el-button>
        <el-button v-if="$parent.operation != 2" @click="confirmTenantClicks()" type="primary">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Search as ElIconSearch } from '@element-plus/icons-vue'
import judgeWindow from '@/mixin/judgeWindow'

import pagination from "@/components/pagination"; //分页
import lazyTree from '@/components/lazy-tree' //懒加载树
export default {
  components: {
    pagination,
    'lazy-tree': lazyTree,
    ElIconSearch
  },
  mixins: [judgeWindow],
  props: ['waterTenantList', 'systemTypeInfo', 'watermarkId'],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      searchForm: {
        tenantName: ''
      },
      tableData: [], // 表格数据
      dataText: '',
      loading: false,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      organizationId: 0,
      isSearch: false,
      industryTypeList: [],
      multipleSelection: [],
      selectionKeys: [],
      selectionKeysInfo: [],
      selectionRelateIdList: []
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    // 获取勾选的租户信息
    confirmTenantClicks() {
      this.selectionKeysInfo = this.multipleSelection
      this.$emit('confirmTenant-clicks', this.selectionKeysInfo)
      this.$parent.addTenantVisible = false
    },
    // 筛选出其他水印关联租
    setSelectValRelateIdList(tenantRelateIdInfo) {
      const tenantRelateIdList = []
      if (tenantRelateIdInfo) {
        tenantRelateIdInfo.filter(item => {
          if (item.relateWatermark !== 2) {
            tenantRelateIdList.push(item.tenantId)
          }
        })
      }
      return tenantRelateIdList
    },
    // 获取详情勾选租户信息的ID数组
    setSelectValIdInfoList(tenantIdInfo) {
      const tenantIdList = []
      if (tenantIdInfo) {
        tenantIdInfo.filter(item => {
          tenantIdList.push(item.tenantId)
        })
      }
      return tenantIdList
    },
    // 获取勾选租户信息的ID数组
    setSelectValIdList(tenantIdInfo) {
      const tenantIdList = []
      if (tenantIdInfo) {
        tenantIdInfo.filter(item => {
          if ((item.relateWatermark && item.relateWatermark == 1) || item.relateWatermark == 2) {
            tenantIdList.push(item.tenantId)
          }
        })
      }
      return tenantIdList
    },
    getRowKeys(row) {
      return row.tenantId
    },
    // 置灰禁用
    checkSelectable(row, index) {
      if (this.$parent.operation == 2) {
        return false
      } else {
        if (row.relateWatermark == 2) {
          return false
        } else {
          return true
        }
      }

      // 你的判断条件，条件成立则复选框能选，否则置灰禁用
    },
    //确认租户
    confirmTenantClick() {
      this.$emit('confirmTenantClick', this.multipleSelection)
      this.$parent.addTenantVisible = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm = {
          tenantName: ''
        }
      }
    },
    // 点击树节点
    treeNodeClick(obj) {
      // 点击树联动面包屑
      this.organizationId = obj.data.payload.organizationId
      this.search_clear()
      this.searchTenantNameClick()
    },
    // 搜索!
    searchTenantNameClick() {
      this.pageNum = 1
      this.isSearch = true
      this.tenantList()
    },
    // 加载租户列表!
    tenantList() {
      this.dataText = ''
      this.loading = true
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        organizationId: this.organizationId,
        watermarkId: this.watermarkId,
        systemType: this.systemTypeInfo
      }
      if (this.isSearch) {
        Object.assign(data, this.searchForm)
      }
      this.$api.getWatermarkTenantList(data).then(res => {
        if (res.tenantList && res.tenantList.length) {
          this.tableData = res.tenantList
          this.totalNum = res.pageInfo.totalNum
          const selectionKeys = this.setSelectValIdList(res.tenantList)
          // 勾选高亮
          const { selectionKeysInfo, tableData } = this
          selectionKeys.forEach(key => {
            tableData.forEach(row => {
              if (row.tenantId == key) {
                this.$refs.multipleTable.toggleRowSelection(row, true)
              }
            })
          })
          this.$nextTick(() => {
            selectionKeysInfo.forEach(key => {
              tableData.forEach(row => {
                if (row.tenantId == key) {
                  this.$refs.multipleTable.toggleRowSelection(row, true)
                }
              })
            })
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    getListByPage() {
      this.search_clear()
      this.tenantList()
    },
    set_industryType(val) {
      if (val || val == 0) {
        this.industryTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }

      return val
    },
    // 获取行业类型
    getIndustry_type() {
      let data = { type: 'industry-type' }
      this.$api.getDictionary(data).then(res => {
        if (res.dictionaryList) {
          this.industryTypeList = res.dictionaryList
        }
      })
    },
    dialogOpen() {
      this.tenantList()
      this.getIndustry_type()
      this.selectionKeys = this.setSelectValIdList(this.tableData)
      this.selectionKeysInfo = this.setSelectValIdInfoList(this.waterTenantList)
    },
    tenantdialogClosed() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
      this.$parent.addTenantVisible = false
    },
    dialogClosed() {
      this.pageNum = 1
      this.pageSize = 10
      this.totalNum = 0
    }
  }
}
</script>

<style lang="scss" scoped>
#tenantDialog {
  overflow: hidden;
  z-index: 10000;
  .flexstart {
    i {
      position: absolute;
      font-size: 18px;
      top: 8px;
      right: 12px;
    }
  }
}
</style>
