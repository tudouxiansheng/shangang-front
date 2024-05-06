<template>
  <!-- 批量导入按钮 -->
  <el-upload
    class="batchImportBtn"
    ref="upload"
    action=""
    :auto-upload="false"
    accept=".xlsx, .xls"
    :on-change="handleChange"
    :show-file-list="false"
  >
    <slot>
      <el-button type="primary">{{ $t('public.batchImport') }}</el-button>
    </slot>
  </el-upload>
</template>

<script>
export default {
  props: {
    ifSplice: Boolean,
    nullValueList: {
      type: Array,
      required: false,
      default: () => ['organizationId']
    },
    max: {
      type: Number,
      default: Infinity
    }
  },

  data() {
    return {
      file: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleChange(file) {
      let typeList = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      this.file = file.raw
      if (!typeList.includes(this.file.type)) {
        this.$message.error(this.$t('public.validate.fileFormatLimit', { format: 'xlsx、xls' }))
        return false
      }
      let reader = new FileReader()
      reader.readAsArrayBuffer(this.file)
      reader.onload = () => {
        let buffer = reader.result
        let bytes = new Uint8Array(buffer)
        let length = bytes.byteLength
        let binary = ''
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        let XLSX = require('xlsx')
        let wb = XLSX.read(binary, {
          type: 'binary'
        })
        var xlsxLth = wb.Sheets[wb.SheetNames[0]]['!ref']
        var stopX = xlsxLth.substr(
          xlsxLth.indexOf(':') + 1,
          wb.Sheets[wb.SheetNames[0]]['!ref'].length
        )
        wb.Sheets[wb.SheetNames[0]]['!ref'] = 'A6:' + stopX
        let filteredData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
          blankrows: false
        })
        // 过滤掉空的单元格
        const outdata = filteredData.filter(row =>
          Object.values(row).some(cellValue => cellValue !== '')
        )
        //取出key的小括号里的值作为key
        if (this.ifSplice) {
          for (let i = outdata.length - 1; i >= 0; i--) {
            let ifSpliceFalse = Object.keys(outdata[i]).some(item => {
              return this.nullValueList.includes(item.match(/\(([^)]*)\)/)[1]) === false
            })
            if (ifSpliceFalse) {
              for (var key in outdata[i]) {
                const matches = JSON.stringify(key).match(/\((.*?)\)/)
                if (matches) {
                  outdata[i][key.match(/\(([^)]*)\)/)[1]] = outdata[i][key]
                } else {
                  outdata[i][key.match(/\(([^)]*)\)/)] = outdata[i][key]
                }
                delete outdata[i][key]
              }
            } else {
              outdata.splice(i, 1)
            }
          }
        } else {
          for (let i = outdata.length - 1; i >= 0; i--) {
            for (let key in outdata[i]) {
              const matches = JSON.stringify(key).match(/\((.*?)\)/)
              if (matches) {
                outdata[i][key.match(/\(([^)]*)\)/)[1]] = outdata[i][key]
              } else {
                outdata[i][key.match(/\(([^)]*)\)/)] = outdata[i][key]
              }
              delete outdata[i][key]
            }
          }
        }
        if (outdata.length <= this.max) {
          this.$emit('batchImport', outdata)
        } else {
          this.$message.warning(this.$t('userManage.importOverMsg', { max: this.max }))
        }
      }
    }
  }
}
</script>

<style lang="scss">
.batchImportBtn {
  display: inline-block;
  margin: 0 10px;
  .el-dialog__body {
    .el-table th,
    .el-table td {
      text-align: left !important;
    }
  }
}
</style>
