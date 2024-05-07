<template>
  <el-dialog
    :title="$t('retrieval.exportOptions')"
    v-model="dialogVisible"
    top="10vh"
    width="800px"
    :close-on-click-modal="false"
    :show-close="false"
    @open="dialogOpen"
    @close="dialogClose"
    :modal="false"
    draggable
  >
    <el-form
      v-if="isShow"
      ref="form"
      :model="form"
      :rules="formRules"
      inline
      :validate-on-rule-change="false"
    >
      <el-form-item :label="$t('retrieval.selectExportAttribute')">
        <el-checkbox
          class="checkbox-all"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          {{ $t('retrieval.allSelect') }}
        </el-checkbox>
      </el-form-item>
      <el-checkbox-group
        class="grid grid-cols-4 gap-4"
        v-model="form.attrs"
        @change="handleCheckedCitiesChange"
      >
        <TooltipCheckbox
          :button-type="0"
          v-for="(item, index) in attributes"
          :key="index"
          :label="item.label"
          :value="item"
          width="100%"
        />
      </el-checkbox-group>
    </el-form>
    <div v-else>
      <el-slider v-model="process" disabled :max="totalNum || 0"></el-slider>
      <div class="text-center">
        {{ $t('retrieval.downloadsNum') }}({{ process }}/{{ totalNum || 0 }})
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import TooltipCheckbox from '../algorithmSelect/tooltipCheckbox'
import {
  ApplicationType,
  AttributesDictMap,
  VehicleExportAttrs,
  VehicleExportAttrsENG,
  PersonExportAttrs,
  PersonExportAttrsENG,
  AttributesTitleMap
} from '../../constant'
import { asyncPool, generateUuid } from '@/utils/common/utils'
import ExcelJs from 'exceljs'
import { saveAs } from 'file-saver'
import { fileToBase64Chunks } from '@/utils/common/download'
const EXPORT_PAGE_SIZE_IMAGE = 1000
const EXPORT_PAGE_SIZE_CONDITION = 500
export default {
  name: 'ExportModal',
  components: {
    TooltipCheckbox
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    exportDataType: {
      type: Number,
      default: ApplicationType.vehicle
    },
    data: {
      type: Array,
      default: () => []
    },
    exportType: {
      type: [String, undefined],
      default: undefined
    },
    api: {
      type: String,
      default: undefined
    },
    queryParams: {
      type: Object,
      default: () => {}
    },
    searchMode: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isShow: true,
      form: {
        enableEncrypt: true,
        password: '',
        passwordSure: '',
        attrs: []
      },
      loading: false,
      checkAll: false,
      isIndeterminate: true,
      totalNum: null,
      process: 0,
      currOperationId: '',
      currFilePath: '',
      taskEndFlag: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    formRules() {
      const validatePsw = (rule, value, callback) => {
        const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/
        if (!this.form.enableEncrypt) {
          callback()
        }
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (!regExp.test(value)) {
          callback(new Error('密码必须包含大小写字母,特殊字符和数字，且长度在8-16位之间'))
        } else {
          callback()
        }
      }
      const validatePsw2 = (rule, value, callback) => {
        if (!this.form.enableEncrypt) {
          callback()
        }
        if (value == '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
      return {
        password: [
          {
            required: this.form.enableEncrypt,
            validator: validatePsw,
            trigger: 'change'
          }
        ],
        passwordSure: [
          {
            required: this.form.enableEncrypt,
            validator: validatePsw2,
            trigger: 'change'
          }
        ]
      }
    },
    attributes() {
      let arr = []
      if (this.exportDataType === ApplicationType.vehicle) {
        arr = this.locale === 'en' ? VehicleExportAttrsENG : VehicleExportAttrs
        return arr
      } else {
        arr = this.locale === 'en' ? PersonExportAttrsENG : PersonExportAttrs
        if (this.searchMode === 'condition') {
          return arr.filter(item => item.label !== AttributesTitleMap.dconfidence)
        } else {
          return arr
        }
      }
    }
  },
  created() {
    this.bindEvent()
  },
  beforeDestroy() {
    this.unBindEvent()
  },
  methods: {
    bindEvent() {
      this.$bus.$on('webkit_notify', this.webkitNotify)
    },
    unBindEvent() {
      this.$bus.$off('webkit_notify')
    },
    webkitNotify(e) {
      let { func, message } = e
      if (func === 'file_local_storage_reply') {
        let { fileName, result, filePath } = JSON.parse(message)
        // 任务开始，第一张图保存成功
        if (fileName.includes(this.firstFileId)) {
          if (result == 0) {
            this.currFilePath = filePath
            this.taskEndFlag = false
          } else {
            this.taskEndFlag = true
          }
        }
        if (fileName.indexOf('fail') !== -1) {
          this.$alert(
            `${this.$t('retrieval.exportPosition')}:${filePath}`,
            this.$t('public.prompt'),
            {
              confirmButtonText: this.$t('public.confirm')
            }
          )
        }
      }
    },
    dialogOpen() {
      this.reset()
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    reset() {
      this.form = {
        enableEncrypt: true,
        password: '',
        passwordSure: '',
        attrs: this.attributes
      }
      this.checkAll = true
      this.isIndeterminate = false
      this.process = 0
      this.isShow = true

      this.$resetForm('form')
    },
    handleCheckAllChange(val) {
      this.form.attrs = val ? this.attributes : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.attributes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.attributes.length
    },
    handleEnableEncryptChange() {
      this.$refs.form.clearValidate()
    },
    handleConfirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            if (this.exportType != '3') {
              const { attrs } = JSON.parse(JSON.stringify(this.form))
              if (attrs.length === 0) {
                this.$message.warning(this.$t('retrieval.selectExportAttributePrompt'))
                return
              }
              attrs.unshift({
                label: this.$t('retrieval.capturePicture'),
                value: 'thumPicUrl'
              })
              const header = attrs.map(item => {
                return {
                  header: item.label,
                  key: item.value,
                  width: item.value === 'thumPicUrl' ? 12 : 24,
                  style: {
                    alignment: {
                      vertical: 'middle',
                      horizontal: 'center'
                    }
                  }
                }
              })
              // 创建工作簿
              const workbook = new ExcelJs.Workbook()
              // 添加sheet
              const worksheet = workbook.addWorksheet('Sheet1')
              // 设置 sheet 的默认行高
              worksheet.properties.defaultRowHeight = 30
              // 设置列
              worksheet.columns = header

              // 创建工作簿
              const workbook1 = new ExcelJs.Workbook()
              // 添加sheet
              const worksheet1 = workbook1.addWorksheet('Sheet1')
              // 设置 sheet 的默认行高
              worksheet1.properties.defaultRowHeight = 30
              // 设置列
              worksheet1.columns = header

              const data = this.getRowsData(this.data, header)
              // 添加行
              worksheet.addRows(data)
              const headerRow = worksheet.getRow(1)
              headerRow.height = 30
              for (const item of data) {
                const index = data.indexOf(item)
                try {
                  const res = await fetch(item.thumPicUrl, {
                    headers: {
                      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    }
                  })
                  const imageId = workbook.addImage({
                    buffer: res.arrayBuffer(),
                    extension: 'jpeg'
                  })
                  worksheet.addImage(imageId, `A${index + 2}:A${index + 2}`)
                  const row = worksheet.getRow(index + 2)
                  row.height = 60
                  row.getCell(1).value = ''
                } catch (error) {
                  // 处理其他异常情况，可以输出错误信息或采取其他操作
                  console.error(`Error for item at index ${index}: ${error.message}`)
                }
              }
              let bufferData = await workbook.xlsx.writeBuffer()
              const blob = new Blob([bufferData], { type: '' })
              saveAs(
                blob,
                `${
                  this.exportDataType === ApplicationType.vehicle
                    ? this.$t('retrieval.vehicle')
                    : this.$t('retrieval.portrait')
                }${this.$t('retrieval.retrieveExportedData')}${this.dayjs().format(
                  'YYYY-MM-DDTHH:mm:ssZ'
                )}.xlsx`
              )
            } else {
              this.isShow = false
              this.currOperationId = generateUuid()
              this.firstFileId = undefined
              await this.fetchAllDataAndExport()
            }
          } finally {
            this.isShow = true
            this.loading = false
            this.dialogVisible = false
            this.taskEndFlag = false
            this.currOperationId = ''
            this.currFilePath = ''
          }
        }
      })
    },
    async generateExcelToChunks(header, data) {
      // 创建工作簿
      const workbook = new ExcelJs.Workbook()
      // 添加sheet
      const worksheet = workbook.addWorksheet('Sheet1')
      // 设置 sheet 的默认行高
      worksheet.properties.defaultRowHeight = 30
      // 设置列
      worksheet.columns = header

      worksheet.addRows(data)

      const headerRow = worksheet.getRow(1)

      headerRow.height = 30

      let bufferData = await workbook.xlsx.writeBuffer()
      const blob = new Blob([bufferData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      return await fileToBase64Chunks(blob, 1024 * 30)
    },
    async saveExcelByCef(header, data, fileName, lastOne = false) {
      const batchSize = 10000
      const numBatches = data.length === 0 ? 1 : Math.ceil(data.length / batchSize)
      for (let i = 0; i < numBatches; i++) {
        const startIndex = i * batchSize
        const endIndex = Math.min(startIndex + batchSize, data.length)
        const batchData = data.slice(startIndex, endIndex)
        const chunks = await this.generateExcelToChunks(header, batchData)
        chunks.forEach((item, index) => {
          this.fileLocalStorage({
            operationId: this.currOperationId,
            fileId: `${fileName}(${i + 1})${index}`,
            fileName: `${fileName}(${i + 1}).xlsx`,
            fileContent: item,
            filePath: this.currFilePath ? this.currFilePath : '',
            endFlag: index === chunks.length - 1,
            replyStoragePathFlag: !lastOne
              ? false
              : i === numBatches - 1 && index === chunks.length - 1
          })
        })
      }
    },
    handleCancel() {
      if (this.currOperationId) {
        //  正在进行导出任务
        this.taskEndFlag = true
      } else {
        this.dialogVisible = false
      }
    },
    async fetchListData(queryParams) {
      try {
        const res = await this.$api[this.api](queryParams)
        if (!res?.resultList[0]?.datas) {
          throw new Error(res?.resultDesc || res?.statusText || `Error fetching data`)
        }
        return {
          pageInfo: res.pageInfo,
          data: res.resultList[0].datas
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        return null
      }
    },
    async downloadImage(url) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        const blob = await response.blob()
        return blob
      } catch (error) {
        console.error('Error downloading image:', error)
        return null
      }
    },
    async saveImage(imageBlob, info) {
      // 图片blob转为base64Chunks
      const chunks = await fileToBase64Chunks(imageBlob, 1024 * 30)
      chunks.forEach((chunk, chunksIndex) => {
        const fileName = `${info.thirdFileId}.${this.getBase64Ext(chunk)}`
        this.fileLocalStorage({
          operationId: this.currOperationId,
          fileId: info.thirdFileId,
          fileName: fileName,
          fileContent: chunk,
          filePath: this.currFilePath ? this.currFilePath : '',
          endFlag: chunksIndex === chunks.length - 1,
          replyStoragePathFlag:
            info.thirdFileId === this.firstFileId && chunksIndex === chunks.length - 1
        })
      })
    },
    async fetchAllDataAndExport() {
      let lastRecordTime = null
      this.totalNum = null
      let fetchedNum = 0
      let successData = []
      let failedData = []
      // 用于存储已经获取到的ThirdFileId，用于去重
      const uniqueThirdFileIds = new Set()
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      queryParams.pageInfo.pageSize =
        this.searchMode === 'condition' ? EXPORT_PAGE_SIZE_CONDITION : EXPORT_PAGE_SIZE_IMAGE
      queryParams.pageInfo.pageNum = 1
      while (this.totalNum === null || fetchedNum < this.totalNum) {
        if (!this.dialogVisible || this.taskEndFlag) break
        // 如果不是第一次获取数据，则需要传入上一次获取到的最后一条数据的recordTime
        if (lastRecordTime) {
          queryParams.precisionTime = lastRecordTime
        }
        let result = await this.fetchListData(queryParams)
        // 如果获取数据失败，则直接导出当前已经获取到的数据
        if (result === null) {
          console.error('Error occurred while fetching data, exporting current data...')
          break
        }
        // 如果是第一次获取数据，则获取总数
        if (this.totalNum === null) {
          this.totalNum = result.pageInfo.totalNum
          this.firstFileId = result.data[0].thirdFileId
        }
        // 格式化数据
        result.data = this.$parent.normalizeExportData(result.data)
        const dataToAppend = []
        // 去重
        for (const item of result.data) {
          const thirdFileId = item.thirdFileId
          if (!uniqueThirdFileIds.has(thirdFileId)) {
            uniqueThirdFileIds.add(thirdFileId)
            dataToAppend.push(item)
          }
        }
        if (dataToAppend.length === 0) {
          break
        }
        fetchedNum += dataToAppend.length
        lastRecordTime = dataToAppend[dataToAppend.length - 1].recordTime
        const downloadImageAndSave = async item => {
          // 如果任务已经结束，则直接返回
          if (this.taskEndFlag) {
            return { successData, failedData }
          }
          // 下载图片
          const imageBlob = await this.downloadImage(item.thumPicUrl)
          if (imageBlob) {
            await this.saveImage(imageBlob, item)
            successData.push(item)
          } else {
            item.failReason = this.$t('retrieval.downloadFailed')
            failedData.push(item)
          }
          ++this.process
          return { successData, failedData }
        }
        await asyncPool.call(this, 6, dataToAppend, downloadImageAndSave)
      }
      const { attrs: headerAttr } = JSON.parse(JSON.stringify(this.form))
      const header = headerAttr.map(item => {
        return {
          header: item.label,
          key: item.value,
          width: item.value === 'index' ? 12 : 24,
          style: {
            alignment: {
              vertical: 'middle',
              horizontal: 'center'
            }
          }
        }
      })
      const successExcelHeader = [
        ...[
          {
            header: 'fileId',
            key: 'thirdFileId',
            width: 24,
            style: {
              alignment: {
                vertical: 'middle',
                horizontal: 'center'
              }
            }
          }
        ],
        ...header
      ]
      const failExcelHeader = [
        ...successExcelHeader,
        ...[
          {
            header: this.$t('retrieval.failReason'),
            key: 'failReason',
            width: 24,
            style: {
              alignment: {
                vertical: 'middle',
                horizontal: 'center'
              }
            }
          }
        ]
      ]
      successData = this.getRowsData(successData, successExcelHeader)
      failedData = this.getRowsData(failedData, failExcelHeader)
      await this.saveExcelByCef(successExcelHeader, successData, 'success')
      await this.saveExcelByCef(failExcelHeader, failedData, 'fail', true)
    },
    getRowsData(data, attrs) {
      const attrKeys = attrs.map(item => item.key)
      return data.map(item => {
        let obj = {}
        for (const itemKey in item) {
          if (attrKeys.includes(itemKey)) {
            if (!AttributesDictMap[itemKey]) {
              obj[itemKey] = item[itemKey]
              continue
            }
            if (AttributesDictMap[itemKey] === 'time') {
              obj[itemKey] = this.dayjs(Number(item[itemKey])).format('YYYY-MM-DD HH:mm:ss')
              continue
            }
            const dict = this.$parent[AttributesDictMap[itemKey]]
            let value = ''
            if (Array.isArray(item[itemKey])) {
              value = this.selectDictLabels(dict, item[itemKey].join(','), ',', {
                key: 'name',
                value: 'value'
              })
            } else {
              value = this.selectDictLabel(dict, item[itemKey], {
                key: 'name',
                value: 'value'
              })
            }

            obj[itemKey] = value
          }
        }
        return obj
      })
    },
    dialogClose() {
      this.isShow = true
      this.process = 0
      this.$parent.queryParamsFormattered.pageInfo.pageNum = 1
      this.currOperationId = ''
      this.currFilePath = ''
    },
    getBase64Ext(base64) {
      const arr = base64.split(',')
      const type = arr[0].match(/:(.*?);/)[1]
      return type.split('/')[1]
    },
    /**
     * @description: 通知客户端进行文件存储
     * @param {{replyStoragePathFlag: boolean, fileName: string, filePath: (string), operationId: string, endFlag: boolean, fileContent: unknown, fileId: *}} options 参数
     * @param {String} options.operationId 操作唯一标识 区分同一个批次的操作
     * @param {String} options.fileId 文件唯一标识
     * @param {String} options.fileName 含后缀的文件名
     * @param {String} options.fileContent base64编码的文件内容
     * @param {String} options.filePath 文件存储路径（默认由客户端侧自行指定）
     * @param {Boolean} options.endFlag 文件是否已传输完毕（例如：一个文件分三段传输，前两段传false，最后传true）
     * @param {Boolean} options.replyStoragePathFlag 是否需要回传文件存储路径（批次操作时，最后一个下载处理时该字段传true，前端可获取该批次文件的存储位置）
     * @return {boolean} Promise对象
     * */
    async fileLocalStorage(options) {
      let { operationId, fileId, fileName, fileContent, filePath, endFlag, replyStoragePathFlag } =
        options
      try {
        let param = {
          operationId,
          fileId,
          fileName,
          fileContent,
          endFlag,
          replyStoragePathFlag
        }
        if (filePath) {
          param.filePath = filePath
        }
        this.$webkitProc('file_local_storage', JSON.stringify(param))
        return true
      } catch (error) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
:deep(.tooltip-checkbox) .el-checkbox__label {
  color: #606266;
}
.checkbox-all {
  margin-left: 15px;
}
</style>
