<template>
  <el-dialog
    :title="$t('cascadeDevice.distributionBayonet')"
    v-model="$parent.dialogvisible_allocate"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1000px'"
    class="tollgateAllocateDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <p style="color: #f56c6c">
      {{ $t('cascadeDevice.selectDistributionBayonet') }}
    </p>
    <div style="display: flex; justify-content: space-around">
      <div
        class="devicetreeTAD"
        v-if="$parent.dialogvisible_allocate"
        v-loading="devicetreeloading"
        :element-loading-text="$t('public.loading')"
        style="width: 48%"
      >
        <el-autocomplete
          v-model="deviceName"
          :fetch-suggestions="searchDevice"
          :placeholder="$t('cascadeDevice.inputBayonetName')"
          @select="handleSelect"
          :debounce="300"
          :trigger-on-focus="false"
        ></el-autocomplete>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="$parent.dialogTableData"
          :row-class-name="tableRowClassNameDialog"
          class="elTable customer-table tableWidth"
          :max-height="maxHeight"
          border
          :empty-text="$t('public.noData')"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column :label="$t('deviceManagement.bayoneNname')" show-overflow-tooltip>
            <template #default="{ row }">
              <span>
                <i class="iconCss1 iconfont icon-kakou" style="margin-right: 5px"></i>
                {{ row.name }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- //组织树 -->
      <div style="width: 48%; background: #f2f2f2">
        <lazy-tree
          ref="lazyTree"
          @initList="initData"
          @nodeClick="treeNodeClick"
          :withTenant="2"
          style="height: 500px; background: #f2f2f2; overflow-y: auto"
          v-if="showOrgTree"
          :iconColor="true"
        />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed1">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitFormtree" :loading="maskloading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :multipleSelectionMany="multipleSelectionMany"
      :what="$t('deviceManagement.bayonet')"
      @getList="getList"
      :operate="$t('cascadeDevice.distribution')"
      :batchApi="batchApi"
      whatId="tollgateID"
      whatName="name"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
    />
  </el-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import batchOperate from '@/components/batchOperate' //懒加载树
import lazyTree from '@/components/lazy-tree'

export default {
  components: {
    'lazy-tree': lazyTree,
    batchOperate
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
      organizationName: '',

      batchAllocateVisible: false,
      props: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      devicetreeloading: false,
      chooseDevice: [],
      organizationId: '',
      maskloading: false,
      showOrgTree: true,
      treeLoadingDialog: false,
      idArrDialog: [],
      organizationTreeProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      treeEmptyText: '',
      importType: '',
      allocatePlatId: '',

      loading: false,
      tableData: [],

      deviceName: '',
      choosedSelectBySearch: {},

      maxHeight: 420,
      rowHeight: 30,
      multipleSelection: []
    }
  },
  methods: {
    async getList() {
      this.multipleSelection = []
      await this.$parent.getViewPlatList()
      this.loading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 表格斑马纹
    tableRowClassNameDialog({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'dialogRow'
      } else {
        return 'dialogRow'
      }
    },
    searchDevice(queryString, cb) {
      queryString = queryString.trim()
      if (queryString) {
        let nodeList = this.$parent.dialogTableData || []
        nodeList = nodeList.filter(item => {
          if (item.name.indexOf(queryString) > -1) {
            item.value = item.name
            return item
          }
        })
        if (nodeList) {
          cb(nodeList)
        } else {
          cb([])
        }
      } else {
        cb([])
      }
    },
    scrollToTargetRow(index) {
      this.$nextTick(() => {
        const elTable = this.$refs.multipleTable.$el
        if (elTable) {
          const targetRow = elTable.querySelector(`.el-table__row:nth-child(${index + 1})`)
          if (targetRow) {
            this.$refs.multipleTable.setScrollTop(targetRow.offsetTop)
          }
        }
      })
    },
    handleSelect(item) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.choosedSelectBySearch = item
          let index2 = this.$parent.dialogTableData.findIndex(i => i == item)
          let tableRows = document.getElementsByClassName('dialogRow')
          for (let i = 0; i < tableRows.length; i++) {
            tableRows[i].classList.remove('choose-row')
          }
          let row = document.getElementsByClassName('dialogRow')[index2]
          row.className = row.className + ' choose-row'
          if (index2 == 0 || index2) {
            this.scrollToTargetRow(index2)
          }
        })
      }, 500)
    },
    highLightDevice() {
      let search = this.$parent.dialogTableData.find(
        item => item.platformId == this.choosedSelectBySearch.platformId
      )
      let index2 = this.$parent.dialogTableData.indexOf(search)
      let dialogRow = document.getElementsByClassName('dialogRow')
      let height = parseInt(dialogRow[0].style.height) || 30

      //show-header 为 true 时 为 children[2]， 为false 时 为children[1]
      this.$refs.multipleTable.$el.children[0].children[1].scrollTop = index2 * height

      setTimeout(() => {
        let row
        if (index2 <= 3) {
          row = dialogRow[index2]
        } else if (index2 > this.$parent.dialogTableData.length - this.maxHeight / this.rowHeight) {
          row = dialogRow[dialogRow.length - (this.$parent.dialogTableData.length - index2)]
        } else {
          row = dialogRow[3]
        }
        row.click()
      }, 500)
    },
    loadNodePlatDialog(node, resolve) {
      if (node.level == 0) {
        this.getTreeDialog(node.level, '', '', resolve)
      } else {
        this.getTreeDialog(
          node.level,
          node.data.type == '1' ? 0 : node.data.payload.organizationId,
          node.data.type == '1' ? node.data.payload.platformId : node.data.payload.platId,
          resolve
        )
      }
    },
    async getTreeDialog(level, parentId, platformId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId !== '' ? (data.parentId = parentId) : null
      platformId ? (data.platId = platformId) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        this.treeLoadingDialog = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArrDialog = [list[0].id]
          this.$refs.treeListDialog.setCurrentKey(list[0].id)
          this.organizationName = list[0].payload.organizationName
          this.organizationId = list[0].payload.organizationId

          this.importType = list[0].type

          this.allocatePlatId =
            list[0].type == '1' ? list[0].payload.platformId : list[0].payload.platId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('platformManagement.noData')
      }
    },
    initData(list) {
      this.organizationId = list[0].payload.organizationId
    },
    // 点击树节点
    treeNodeClick(obj) {
      this.organizationName = obj.data.payload.organizationName
      this.organizationId = obj.data.payload.organizationId
    },
    async dialogOpen() {
      this.showOrgTree = false
      this.$nextTick(() => {
        
        this.showOrgTree = true
      })
    },

    dialogClosed() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }

      //清空
      this.chooseDevice = []

      this.$parent.dialogvisible_allocate = false
      let tableRows = document.getElementsByClassName('dialogRow')
      for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].classList.remove('choose-row')
      }
    },
    dialogClosed1() {
      this.dialogClosed()
    },

    // 确认调拨设备树
    async submitFormtree() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: this.$t('cascadeDevice.pleaseSelectBayonet'),
          type: 'warning'
        })
        return
      }
      this.loading = true

      this.batchApi = 'addTollgate'

      this.multipleSelectionMany = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelectionMany.push({
          ...this.multipleSelection[i],
          organizationName: this.organizationName,
          organizationId: this.organizationId
        })
      }

      this.batchDialogVisible = true
    }
  },

  computed: {
    iconSty(node) {
      return node => {
        if (node.type == 1) {
          return 'aci-tv iconCss1'
        } else if (node.type == 2) {
          return 'aci-x006-folder iconCss1'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../lane/component/iconfont.css';

.tollgateAllocateDialog {
  .el-dialog__body {
    padding: 0px 20px 5px !important;
    .el-input .el-input__inner {
      background: none;
      border: none;
    }
    .devicetreeTAD {
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f2f2f2;
      width: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: pointer;
      .el-tree {
        height: 500px;
      }
      .el-autocomplete {
        width: 70%;
        margin: 5px;
      }
      // 去掉表格单元格边框
      .customer-table th {
        border: none;
      }
      .customer-table td,
      .customer-table th.is-leaf {
        border: none;
      }
      // 表格最外边框
      .el-table--border,
      .el-table--group {
        border-right: 1px solid #d9d9d9;
      }
      // 头部边框
      .customer-table thead tr th.is-leaf {
        border-right: none;
      }
      // 表格最外层边框-底部边框
      .el-table--border::after,
      .el-table--group::after {
        width: 0;
      }
      .customer-table::before {
        width: 0;
      }
      .customer-table .el-table__fixed-right::before,
      .el-table__fixed::before {
        width: 0;
      }
      // 表格有滚动时表格头边框
      .el-table--border th.gutter:last-of-type {
        border-left: none;
      }
    }
    .devicetreeTAD:hover {
      overflow-y: auto;
    }

    .el-loading-mask {
      background: #fafafa !important;
    }

    .el-table__empty-block {
      background: transparent;
    }
  }
  .left-footer {
    position: absolute;
    left: 60px;
  }
  .el-table td {
    height: 30px !important;
    text-align: left;
  }
  .el-table__body-wrapper {
    overflow-y: auto;
  }
  .dialogRow {
    background: transparent !important;
  }

  .plTableBox {
    width: 69.1%;
  }

  .el-table:before {
    background-color: none !important;
  }
  .el-table-column--selection .cell {
    padding: 0;
  }
  .el-table .cell.el-tooltip {
    width: 282px !important;
  }
  .tableWidth {
    width: 75% !important;
  }
}
.tollgateAllocateDialog .el-table .choose-row,
.tollgateAllocateDialog .el-dialog__body .el-table__body tr.choose-row > td {
  background: #b7894f !important;
}
</style>
