<template>
  <div class="Excel">
    <input
      ref="inputRef"
      type="file"
      v-show="false"
      webkitdirectory
      accept=".xlsx, .xls"
      @change="handleInputClick"
    />
    <div>
      <slot>
        <div @click="handleUpload">
          <el-input v-model="excelName" readonly>
            <template #suffix>
              <svg-icon icon-class="select" style="display: inline-block" />
            </template>
          </el-input>
        </div>
      </slot>
      <div class="import_excel_append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import ExcelJs from 'exceljs'
import { repositoryType as RepositoryTypeEnum } from '../constant'
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
  name: 'ImportFolder',
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
    },
    importType: {
      type: Number,
      default: 0
    },
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      excelName: '',
      imageFiles: []
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
              if (cell.value) {
                const matches = cell.value.match(/\((.*?)\)/)
                if (matches) {
                  header.push(matches[1])
                }
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
                  value = dayjs(value).format(dateFormat)
                }
                cellValue = value || null
              } else if (Enums.ValueType.Formula === cell.model.type) {
                cellValue = cell.result ? cell.result : null
              } else {
                cellValue = cell.value !== null ? String(cell.value).trim() : null
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
            const excelData = this.getExcelData(wb)
            this.$emit('success', excelData, this.imageFiles)
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
    normalizeImages() {
      let data = [{}]
      if (this.repoType === RepositoryTypeEnum.person) {
        if (this.importType === 1) {
          data[0].header = [
            'name',
            'credentialNumber',
            'credentialType',
            'gender',
            'bornTime',
            'country',
            'occupation',
            'remark'
          ]
        } else if (this.importType === 2) {
          data[0].header = ['name']
        }
      } else {
        if (this.importType === 1) {
          data[0].header = [
            'lpn',
            'vehicleColor',
            'vehicleType',
            'vehicleBrand',
            'vehicleSub',
            'vehicleYear',
            'ownerName',
            'remark'
          ]
        } else if (this.importType === 2) {
          data[0].header = ['lpn']
        }
      }
      let results = []
      this.imageFiles.forEach((file, index) => {
        let imageData = file.name.substring(0, file.name.lastIndexOf('.'))
        if (this.importType === 1) {
          imageData = imageData.split('_')
        } else if (this.importType === 2) {
          imageData = [imageData]
        }
        results[index] = {}
        if (this.includeNull) {
          data[0].header.forEach((headerKey, i) => {
            results[index][headerKey] = imageData[i] || null
          })
        } else {
          imageData.forEach((item, i) => {
            let headerKey = data[0].header[i]
            results[index][headerKey] = item
          })
        }
      })
      data[0].results = results
      this.$emit('success', data, this.imageFiles)
    },

    /**
     * @description: 触发选择文件管理器
     */
    handleInputClick(e) {
      const files = e && e.target.files
      let excel = []
      if (this.importType === 0) {
        for (const filesKey in files) {
          if (
            files[filesKey].type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ) {
            // 是excel
            excel.push(files[filesKey])
          }
        }
        if (excel.length === 0) {
          this.$message.error(this.$t('repo.noExcel'))
          return false
        }
        if (excel.length === 2) {
          this.$message.error(this.$t('repo.checkExcel'))
          return false
        }
        if (excel.length > 2) {
          this.$message.error(this.$t('repo.onlyOneExcel'))
          return false
        }
      }
      this.imageFiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file.type.indexOf('image') !== -1) {
          // 是图片类型
          this.imageFiles.push(file)
        }
      }
      if (this.importType !== 0) {
        if (this.imageFiles.length === 0) {
          this.$message.error(this.$t('repo.noImage'))
          return false
        }
        this.excelName = this.imageFiles[0].webkitRelativePath.split('/')[0]
        this.normalizeImages()
      } else {
        this.excelName = excel[0].name
        this.upload(excel[0])
      }
    },
    /**
     * @description: 点击上传按钮
     */
    handleUpload() {
      const inputRefDom = this.$refs.inputRef
      inputRefDom && inputRefDom.click()
    },
    clear() {
      this.$refs.inputRef.value = ''
      this.imageFiles = []
      this.excelName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.Excel {
  display: inline-block;
  width: 100%;
  > div {
    display: flex;
  }
  .import_excel_append {
    margin-left: 20px;
  }
}
</style>

<style lang="scss">
.el-loading-mask.square_loading {
  .el-loading-spinner {
    box-sizing: border-box;
    padding: 12px 0 10px;
    width: 220px;
    left: 50%;
    margin-left: -110px;
    background: #fff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  }
}
</style>
