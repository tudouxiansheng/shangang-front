<template>
  <el-dialog
    :title="title"
    v-model="modalVisible"
    top="10vh"
    width="800px"
    class="batchExportDialog"
    @open="dialogOpen"
    :modal="false"
    :close-on-click-modal="false"
    draggable
    :showClose="false"
  >
    <div>
      <label>{{ $t('batchOperator.progress') }}</label>
      <el-progress :percentage="percentage" :format="format"></el-progress>
    </div>
    <div v-show="!errorList.length && !loading" class="boldMess">
      <h2>
        <el-icon><el-icon-success /></el-icon>
        {{ $t('batchOperator.exportAllSuccess') }}！
      </h2>
    </div>
    <div v-show="errorList.length" class="boldMess">
      <h2>
        <el-icon><el-icon-warning /></el-icon>
        {{
          $t('public.export') + successNum !== 0
            ? $t('batchOperator.partialSuccess')
            : $t('batchOperator.failPrompt')
        }}, {{ $t('batchOperator.failPrompt') }}
      </h2>
    </div>
    <div v-show="errorList.length">
      <p>{{ $t('batchOperator.failList') }}</p>
      <el-table
        max-height="200"
        :data="errorList"
        style="width: 100%; margin: 0 0 30px"
        :row-class-name="tableRowClassNameDialog"
        border
      >
        <el-table-column
          v-for="item in customErrorColumn"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.showOverflowTooltip"
        />

        <el-table-column
          :label="$t('primaryDevice.resultCode')"
          prop="resultCode"
          max-width="100"
          show-overflow-tooltip
        />

        <el-table-column
          :label="$t('primaryDevice.resultDesc')"
          prop="resultDesc"
          max-width="100"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleCancel">
          {{ loading ? $t('public.cancel') : $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { SuccessFilled as ElIconSuccess, Warning as ElIconWarning } from '@element-plus/icons-vue'
import { jsonToSheetXlsx } from './export2Excel'
import { asyncPool, generateUuid } from '@/utils/common/utils'
export default {
  components: {
    ElIconSuccess,
    ElIconWarning
  },
  name: 'exportModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loadOption: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    customErrorColumn: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      totalNum: 0,
      successNum: 0,
      errorList: []
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    percentage() {
      return this.successNum ? (this.successNum / this.totalNum) * 100 : 0
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
      this.taskEndFlag = false
      this.totalNum = 0
      this.successNum = 0
      this.errorList = []
      this.startExport()
    },
    handleCancel() {
      this.taskEndFlag = true
      this.modalVisible = false
    },
    format() {
      return this.successNum + '/' + this.totalNum
    },
    async startExport() {
      this.loading = true
      this.taskUUID = generateUuid()
      this.$store.dispatch('app/addBatchTaskID', this.taskUUID)
      const {
        data,
        listFn,
        listFnParam,
        listFnResAttrName = 'list',
        infoFn,
        infoFnParamKey,
        filename,
        bookType = 'xlsx',
        header,
        dataNormalizeFn
      } = this.loadOption()

      let exportData = [],
        listData = []
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('public.noData')
          })
          this.modalVisible = false
          return
        }
        // 直接传入导出数据
        exportData = data
        this.totalNum = exportData.length
        // todo: 假进度
        this.successNum = exportData.length
      } else {
        // 请求list接口方式获取导出数据
        // 先请求第一页 获取总数
        const res = await listFn(listFnParam)
        if (res?.resultCode !== 0) {
          this.$message({
            type: 'error',
            message: res.resultDesc || res.statusText
          })
          this.modalVisible = false
          return
        }
        this.totalNum = res.pageInfo.totalNum
        exportData = res[listFnResAttrName] || []
        listData = JSON.parse(JSON.stringify(exportData))
        if (exportData.length === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('public.noData')
          })
          this.modalVisible = false
          return
        }
        if (!infoFn) {
          this.successNum += res[listFnResAttrName].length
        }
        // 计算总页数
        const totalPage = Math.ceil(this.totalNum / listFnParam.pageInfo.pageSize)
        if (totalPage > 1) {
          // 剩余请求参数数组
          let paramsArr = []
          for (let i = 2; i <= totalPage; i++) {
            let params = JSON.parse(JSON.stringify(listFnParam))
            params.pageInfo.pageNum = i
            paramsArr.push(params)
          }

          // 剩余请求处理
          const getListData = params =>
            new Promise(resolve => {
              listFn(params).then(res => {
                if (res.resultCode === 0) {
                  // 如果没有配置详情接口 则直接导出list数据 这里直接计算成功数
                  if (!infoFn) {
                    this.successNum += res[listFnResAttrName].length
                  }
                  resolve(res[listFnResAttrName])
                }
              })
            })
          // 请求列表接口 控制并发数为6
          const results = await asyncPool.call(this, 6, paramsArr, getListData)
          if (this.taskUUID) {
            this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
          }
          exportData = exportData.concat(...results)
          listData = JSON.parse(JSON.stringify(exportData))
        }
      }

      // 若配置了详情接口 则请求详情接口获取数据拼装后作为导出数据
      if (infoFn && infoFnParamKey) {
        // 获取详情接口
        const getDetailData = async data => {
          try {
            let param = {}
            param[infoFnParamKey] = data[infoFnParamKey]
            const res = await infoFn(param)
            if (res.resultCode === 0) {
              this.successNum++
              return res
            } else {
              this.errorList.push({
                ...data,
                ...res
              })
              return res
            }
          } catch (error) {
            this.errorList.push({
              ...data,
              ...{
                resultDesc: error.message
              }
            })
            return {
              ...data,
              ...{
                resultDesc: error.message
              }
            }
          }
        }
        // 请求详情接口 控制并发数为6
        exportData = await asyncPool.call(this, 6, exportData, getDetailData)
        exportData = exportData.filter(item => item.resultCode === 0)
      }
      // 若配置了数据格式化方法 则执行
      if (dataNormalizeFn) {
        exportData = dataNormalizeFn(exportData, listData)
      }
      // 处理导出数据中的公式 防注入攻击
      exportData.forEach(item => {
        for (const key in item) {
          if (Object.hasOwn(item, key)) {
            const element = item[key]
            // CSV_FORMULA_PATTERN
            if (/^[@=\-+<>＠＝＼／－＋＜＞"'`＂＇\s].*$/.test(element)) {
              item[key] = ' ' + element
            }
          }
        }
      })

      this.loading = false
      if (exportData.length === 0) {
        return
      }
      // 默认Object.keys(data[0])作为header
      jsonToSheetXlsx({
        data: exportData,
        header: header ? header : undefined,
        filename: `${filename}_${this.dayjs().format('YYYYMMDDHHmmss')}.${bookType}`,
        write2excelOpts: {
          bookType: bookType
        }
      })
    },
    // 表格斑马纹
    tableRowClassNameDialog({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss">
.batchExportDialog {
  .el-dialog__body {
    padding: 15px 20px 5px 20px !important;
    overflow-y: unset;
    .el-table th,
    .el-table td {
      text-align: left !important;
    }
  }
  .el-progress-bar {
    padding-right: 120px;
    margin-right: -120px;
  }
  .el-icon-success:before {
    color: #67c23a;
    margin-right: 5px;
  }
  .el-icon-warning:before {
    color: #e6a23c;
    margin-right: 5px;
  }
  .boldMess h2 {
    text-align: center;
  }
  .el-dialog__headerbtn {
    display: none;
  }
}
</style>
