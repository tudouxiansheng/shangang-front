<template>
  <div class="importExcel">
    <input
      ref="inputRef"
      type="file"
      v-show="false"
      accept=".xlsx, .xls"
      @change="handleInputClick"
    />
    <div @click="handleUpload">
      <slot>
        <el-button type="primary" :loading="loading">
          {{ $t('public.batchImport') }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script>
import ExcelJs from 'exceljs'
const Enums = {
  ValueType: {
    Null: 0,
    Merge: 1,
    Number: 2,
    String: 3,
    Date: 4,
    Hyperlink: 5,
    Formula: 6,
    SharedString: 7,
    RichText: 8,
    Boolean: 9,
    Error: 10
  }
}
export default {
  name: 'ImportExcel',
  props: {
    /**
     * 要提取的excel的表头行索引
     * */
    headerRowIndex: {
      type: Number,
      default: 5
    },
    /**
     * 要提取的excel的表内容行开始索引
     * */
    startBodyRowIndex: {
      type: Number,
      default: 6
    },
    /**
     * 日期时间格式。如果不提供或者提供空值，将返回原始Date对象
     * */
    dateFormat: {
      type: String
    },
    /**
     * 上传表格需要读取的sheet 数量,默认为1
     */
    sheetNum: {
      type: Number,
      default: 1
    },
    /**
     * 输出结果是否包含null
     * */
    includeNull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    /**
     * @description: 获得excel数据
     */
    getExcelData(workbook) {
      const excelData = []
      const { dateFormat, sheetNum, includeNull } = this
      for (let i = 0; i < sheetNum; i++) {
        const currentSheet = workbook.worksheets[i]
        let header = []
        let results = []
        currentSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          let rowObj = {}
          row.eachCell({ includeEmpty: includeNull }, (cell, cellNumber) => {
            if (rowNumber === this.headerRowIndex + 1) {
              const matches = JSON.stringify(cell.value).match(/\((.*?)\)/)
              if (matches) {
                header.push(matches[1])
              } else {
                header.push(cell.value)
              }
            } else if (rowNumber > this.startBodyRowIndex) {
              let cellValue = ''
              if (Enums.ValueType.RichText === cell.model.type) {
                // If it is of the RichText type
                const value = cell.value.richText
                  .map(richText => (richText.text || '').trim())
                  .join('')
                cellValue = value || null
              } else if (Enums.ValueType.Date === cell.model.type) {
                let value = cell.value
                if (dateFormat) {
                  value = this.dayjs(value).format(dateFormat)
                }
                cellValue = value || null
              } else if (Enums.ValueType.Formula === cell.model.type) {
                cellValue = cell.result ? cell.result : null
              } else if (Enums.ValueType.Hyperlink === cell.model.type) {
                cellValue = cell.value.text ? cell.value.text : null
              } else {
                cellValue = cell.value ? String(cell.value).trim() : null
              }
              if (!includeNull) {
                if (cellValue !== null) {
                  rowObj[header[cellNumber - 1]] = cellValue
                }
              } else {
                rowObj[header[cellNumber - 1]] = cellValue
              }
            }
          })
          if (rowNumber > this.startBodyRowIndex && Object.keys(rowObj).length > 0) {
            results.push(rowObj)
          }
        })
        excelData.push({
          header,
          results,
          meta: {
            sheetName: currentSheet.name
          }
        })
      }
      return excelData
    },
    /**
     * @description: 读取excel数据
     */
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        const workbook = new ExcelJs.Workbook()
        reader.onload = async e => {
          try {
            const data = e.target && e.target.result
            const wb = await workbook.xlsx.load(data)
            /* DO SOMETHING WITH workbook HERE */
            const currentSheet = workbook.worksheets[0]
            if (
              currentSheet._rows.length > 0 &&
              currentSheet._rows.length < this.startBodyRowIndex
            ) {
              this.$message.warning(this.$t('public.errorManage'))
            } else {
              const excelData = this.getExcelData(wb)
              this.$emit('success', excelData)
            }
            resolve('')
          } catch (error) {
            reject(error)
            this.$emit('error')
          } finally {
            this.loading = false
          }
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    async upload(rawFile) {
      const inputRefDom = this.$refs.inputRef
      if (inputRefDom) {
        // fix can't select the same excel
        inputRefDom.value = ''
      }
      await this.readerData(rawFile)
    },
    /**
     * @description: 触发选择文件管理器
     */
    handleInputClick(e) {
      const files = e && e.target.files
      const rawFile = files && files[0] // only setting files[0]
      if (!rawFile) return
      let typeList = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      if (!typeList.includes(rawFile.type)) {
        this.$message.error(this.$t('public.validate.fileFormatLimit', { format: 'xlsx、xls' }))
        return false
      }
      this.upload(rawFile)
    },
    /**
     * @description: 点击上传按钮
     */
    handleUpload() {
      const inputRefDom = this.$refs.inputRef
      inputRefDom && inputRefDom.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.importExcel {
  display: inline-block;
  margin: 0 10px;
}
</style>
