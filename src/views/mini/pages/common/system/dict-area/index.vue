<template>
  <!-- 行政区域字典 -->
  <div id="areaDivision" v-if="isRouterAlive" ref="areaDivision">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div class="btnMargin">
          <el-button
            v-if="PermissionManage"
            type="primary"
            :loading="downloadTemplateLoading"
            @click="dictionarytemplateExport"
          >
            {{ $t('public.getTemplate') }}
          </el-button>
          <el-button
            v-if="PermissionManage"
            type="primary"
            class="upload"
            :loading="importBtnLoading"
          >
            <input
              ref="importInfo"
              type="file"
              class="importInfo"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
              @change="importInfo"
            />
            <a class="add">{{ $t('public.batchImport') }}</a>
          </el-button>
          <el-button
            v-if="PermissionManage"
            :loading="exportLoading"
            type="primary"
            @click="batchExport"
          >
            {{ $t('public.batchExport') }}
          </el-button>
        </div>

        <div
          style="height: 600px; margin-top: 20px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            row-key="areaCode"
            lazy
            :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @select="select"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
            :key="tableKey"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              :label="$t('areaDivision.dictionaryName')"
              min-width="130"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.areaName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('areaDivision.regionCode')"
              min-width="130"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.areaCode }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('areaDivision.administrativeHierarchy')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.areaLevel }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.state')" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="row.isEnabled == 1 ? 'success' : 'danger'">
                  {{ row.isEnabled == 1 ? $t('public.enable') : $t('public.deactivate') }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
export default {
  name: 'AreaDictionary',
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,

      startBtn: true, //批量启用
      stopBtn: true, //批量停用
      multipleSelection: [], //表格选中状态存放数组

      // 表格数据
      tableData: [],
      dataText: '',
      loading: true,
      downloadTemplateLoading: false,
      importBtnLoading: false, // 批量导入
      exportLoading: false, // 批量导出
      tableKey: 0
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    // 获取列表
    this.getAreaChildAll()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(1002)
    },
    async getAreaChildAll() {
      this.dataText = ''
      this.loading = true
      const subAreaList = await this.getArea('')
      const nodes = subAreaList.map(item => ({
        ...item,
        isEnabled: true,
        hasChildren: true
      }))
      this.tableData = nodes
      this.loading = false
    },
    async load(tree, treeNode, resolve) {
      const subAreaList = await this.getArea(tree.areaCode)
      const nodes = subAreaList.map(item => ({
        ...item,
        parentCode: tree.areaCode,
        isEnabled: true,
        hasChildren: tree.areaLevel < 4
      }))

      tree.children = nodes
      resolve(nodes)
    },
    async getArea(parentCode) {
      const res = await this.$api.getSubArea({
        parentCode,
        includeParent: false
      })
      return res.subAreaList || []
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      // 判断选中的数据中isEnabled是否都为true,用于批量启用，批量停用
      var b = val.every(item => {
        return item.isEnabled == true
      })
      var c = val.every(item => {
        return item.isEnabled == false
      })
      // 如果数据不为空
      if (val.length != 0) {
        // 状态都为true，可以批量启用
        if (b == true) {
          this.startBtn = true
          this.stopBtn = false
        }
        // 状态都为false，可以批量停用
        if (c == true) {
          this.startBtn = false
          this.stopBtn = true
        }

        // 状态有不是为false，则都不可以
        else if (b == false) {
          this.startBtn = true
          this.stopBtn = true
        }
      }
      // 如果数据为空，都禁用状态
      else {
        this.startBtn = true
        this.stopBtn = true
      }
    },

    setChildren(children, type) {
      // 编辑多个子层级
      children.map(j => {
        this.toggleSelection(j, type)
        if (j.children) {
          this.setChildren(j.children, type)
        }
      })
    },
    // 选中父节点时，子节点一起选中取消
    select(selection, row) {
      if (
        selection.some(el => {
          return row.areaCode === el.areaCode
        })
      ) {
        if (row.children) {
          // 解决子组件没有被勾选到
          this.setChildren(row.children, true)
        }
      } else {
        if (row.children) {
          this.setChildren(row.children, false)
        }
      }
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row, select)
        })
      }
    },
    // 选择全部
    selectAll(selection) {
      // tabledata第一层只要有在selection里面就是全选
      const isSelect = selection.some(el => {
        const tableDataIds = this.tableData.map(j => j.areaCode)
        return tableDataIds.includes(el.areaCode)
      })
      // tableDate第一层只要有不在selection里面就是全不选
      const isCancel = !this.tableData.every(el => {
        const selectIds = selection.map(j => j.areaCode)
        return selectIds.includes(el.areaCode)
      })
      if (isSelect) {
        selection.map(el => {
          if (el.children) {
            // 解决子组件没有被勾选到
            this.setChildren(el.children, true)
          }
        })
      }
      if (isCancel) {
        this.tableData.map(el => {
          if (el.children) {
            // 解决子组件没有被勾选到
            this.setChildren(el.children, false)
          }
        })
      }
    },

    // 批量启用
    handelStart() {
      this.startOrStop(1, this.$t('public.batchEnableSuccess'))
    },
    // 批量停用
    handelStop() {
      this.startOrStop(0, this.$t('public.batchDeactivationSuccess'))
    },
    startOrStop(isEnabled, title) {
      let item = this.multipleSelection
      let areaCodes = []
      for (let i = 0; i < item.length; i++) {
        areaCodes.push(item[i].areaCode)
      }
      return
    },

    //下载模板
    async dictionarytemplateExport() {
      const res1 = await this.$confirm(
        this.$t('areaDivision.downloadTip'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          closeOnClickModal: false,
          type: 'warning'
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('areaDivision.cancelOperate')
        })
      })
      if (res1 === 'confirm') {
        this.downloadTemplateLoading = true
        try {
          this.$api
            .dictionarytemplateExport({
              netType: this.$getNetType()
            })
            .then(res2 => {
              if (res2.resultCode == 0) {
                res2.templateFileUrl &&
                  download(res2.templateFileUrl, this.$t('dictArea.importTemplate'))
              }
            })
        } finally {
          this.downloadTemplateLoading = false
        }
      }
    },
    // 批量导入
    importInfo() {
      let inputDOM = this.$refs.importInfo
      let fil = inputDOM.files
      let isTypeTrue = /\.(xls|xlsx|csv)$/.test(fil[0].name.toLowerCase())
      const isLtLimitSize = fil[0].size / 1024 / 1024 < 5
      if (!isTypeTrue) {
        this.$message.error(this.$t('public.uploadError'))
        return
      }
      if (!isLtLimitSize) {
        this.$message.error(this.$t('public.validate.fileSizeLimit', { size: 5 }))
        return
      }
      let formData = new FormData()
      formData.append('file', fil[0])
      formData.append('api', '/api/udc/area/import')
      formData.append('netType', this.$getNetType())

      this.importBtnLoading = true
      this.upload_loading = this.$loading({
        customClass: 'square_loading',
        lock: true,
        text: this.$t('dictArea.loadingText'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$api
        .uploadFileTemporary(formData)
        .then(res => {
          let data = {
            importFileId: res.fileId,
            netType: this.$getNetType()
          }
          this.$api
            .batchAreaImport(data)
            .then(res1 => {
              this.importBtnLoading = false
              this.$refs.importInfo.value = ''
              if (res1.resultCode == 0) {
                if (res1.failFileUrl) {
                  this.$message.error(this.$t('dictArea.importError'))
                } else {
                  this.$message.success(this.$t('public.importSuccess'))
                  this.tableKey++
                  this.getAreaChildAll()
                }
              }
            })
            .catch(() => {
              this.$message.error(this.$t('dictArea.importError'))
            })
            .finally(() => {
              this.importBtnLoading = false
              this.upload_loading.close()
            })
        })
        .catch(() => {
          this.importBtnLoading = false
          this.upload_loading.close()
          this.$message.error(this.$t('dictArea.importError'))
        })
    },
    //批量导出
    async batchExport() {
      const res = await this.$confirm(this.$t('areaDivision.exportTip'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        closeOnClickModal: false,
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('areaDivision.cancelOperate')
        })
      })
      if (res === 'confirm') {
        this.exportLoading = true
        this.$api
          .batchAreaExport({ netType: this.$getNetType() })
          .then(res => {
            if (res.resultCode == 0) {
              res.templateFileUrl && download(res.templateFileUrl, this.$t('dictArea.title'))
            }
          })
          .finally(() => {
            this.exportLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss">
#areaDivision {
  width: 100%;
  height: 100%;
  .upload {
    position: relative;
    .importInfo {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      width: 100%;
      height: 40px;
    }
  }
}
</style>
