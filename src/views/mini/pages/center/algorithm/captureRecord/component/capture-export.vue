<template>
  <el-dialog
    :title="$t('public.batchExport')"
    v-model="batchVisible"
    top="10vh"
    width="800px"
    class="batchCopyDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
    :showClose="false"
  >
    <div v-if="exportType == 3">
      <el-slider v-model="process" disabled :max="totalNum || 0"></el-slider>
      <div class="text-center">
        {{ $t('retrieval.downloadsNum') }}({{ process }}/{{ totalNum || 0 }})
      </div>
    </div>
    <div v-else>
      <el-slider v-model="process" disabled :max="choosedNum"></el-slider>
      <div class="text-center">
        {{ $t('retrieval.downloadsNum') }}({{ process }}/{{ choosedNum }})
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="dialogClosed">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { asyncPool, generateUuid } from '@/utils/common/utils'
import { getBlobByGET, fileToBase64Chunks } from '@/utils/common/download'
import { CaptureType } from '../constant'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    exportType: {
      type: Number,
      default: undefined
    },
    api: {
      type: String,
      default: undefined
    },
    queryParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      batchErrorList: [], //批量操作列表
      choosedNum: 0, //总共要操作的数量
      multipleSelection: [], //批量操作选中的数据
      loading: false, //获取列表接口的加载loading
      zip: undefined,
      process: 0,
      totalNum: null,
      currOperationId: '',
      currFilePath: '',
      firstFileId: undefined,
      lastFileId: undefined,
      taskEndFlag: false
    }
  },
  computed: {
    batchVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
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
    // 表格斑马纹
    tableRowClassNameDialog({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
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
        if (fileName.includes(this.lastFileId)) {
          this.$alert(`${this.$t('public.exportLocation')}:${filePath}`, this.$t('public.prompt'), {
            confirmButtonText: this.$t('public.confirm')
          })
        }
      }
    },
    async dialogOpen() {
      this.process = 0
      this.$nextTick(() => {
        
      })
      this.batchErrorList = []
      this.multipleSelection = this.$parent.checkedCopyDate
      this.choosedNum = JSON.parse(JSON.stringify(this.multipleSelection.length))
      let i = 0
      this.zip = new JSZip()
      this.loading = true

      if (this.exportType == 3) {
        this.currOperationId = generateUuid()
        await this.fetchAllDataAndExport()
        if (this.taskEndFlag && this.currFilePath) {
          this.$alert(
            `${this.$t('public.exportLocation')}:${this.currFilePath}`,
            this.$t('public.prompt'),
            {
              confirmButtonText: this.$t('public.confirm')
            }
          )
        }
        this.$parent.exportLoading = false
        this.$parent.loading = false
        this.$emit('searchClear')
        this.batchVisible = false
      } else {
        if (this.$parent.searchMode === String(CaptureType.vehicle)) {
          await this.batchVOperate(i)
        } else {
          await this.batchOperate(i)
        }
      }
    },

    handleCancel() {
      if (this.currOperationId) {
        //  正在进行导出任务
        this.taskEndFlag = true
      } else {
        this.batchVisible = false
      }
    },

    async batchVOperate(i) {
      if (i < this.multipleSelection.length) {
        if (this.multipleSelection[i].pictureInfo.thumPicUrl != undefined) {
          const blob = await getBlobByGET(this.multipleSelection[i].pictureInfo.thumPicUrl)
          if (blob) {
            this.zip.file(`${this.multipleSelection[i].deviceInfo.cameraName}_${i + 1}.jpeg`, blob)
          }
          this.process += 1
          i += 1
          this.batchVOperate(i)
        } else {
          this.batchErrorList.push({
            firstParameter: this.multipleSelection[i][this.firstParameter],
            secondParameter: this.multipleSelection[i][this.secondParameter]
          })
          i += 1
          this.batchVOperate(i)
        }
      } else {
        this.loading = false
        const blobZip = await this.zip.generateAsync({
          type: 'blob'
        })
        saveAs(
          blobZip,
          `${this.$t('repo.vehicleCapture')}${this.dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}.zip`
        )
        this.$emit('searchClear')
        this.dialogClosed()
      }
    },
    async batchOperate(i) {
      if (i < this.multipleSelection.length) {
        if (this.multipleSelection[i].pictureInfo.thumPicUrl != undefined) {
          const blob = await getBlobByGET(this.multipleSelection[i].pictureInfo.thumPicUrl)
          if (blob) {
            this.zip.file(`${this.multipleSelection[i].deviceInfo.cameraName}_${i + 1}.jpeg`, blob)
          }
          this.process += 1
          i += 1
          this.batchOperate(i)
        } else {
          this.batchErrorList.push({
            firstParameter: this.multipleSelection[i][this.firstParameter],
            secondParameter: this.multipleSelection[i][this.secondParameter]
          })
          i += 1
          this.batchOperate(i)
        }
      } else {
        this.loading = false
        const blobZip = await this.zip.generateAsync({
          type: 'blob'
        })
        saveAs(
          blobZip,
          `${this.$t('repo.faceCapture')}${this.dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}.zip`
        )
        this.$emit('searchClear')
        this.dialogClosed()
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
        const fileName = `${info.pictureInfo.thirdFileId}.${this.getBase64Ext(chunk)}`
        this.fileLocalStorage({
          operationId: this.currOperationId,
          fileId: info.pictureInfo.thirdFileId,
          fileName: fileName,
          fileContent: chunk,
          filePath: this.currFilePath ? this.currFilePath : '',
          endFlag: chunksIndex === chunks.length - 1,
          replyStoragePathFlag:
            (info.pictureInfo.thirdFileId === this.firstFileId &&
              chunksIndex === chunks.length - 1) ||
            (info.pictureInfo.thirdFileId === this.lastFileId && chunksIndex === chunks.length - 1)
        })
      })
    },
    async fetchAllDataAndExport() {
      const maxExportNum = 10000 // 设置最大导出数量为1万条
      const exportPageSize = 500 // 设置每次导出的数量为500条
      let lastRecordTime = null
      this.totalNum = null
      let fetchedNum = 0
      let successData = []
      let failedData = []
      // 用于存储已经获取到的ThirdFileId，用于去重
      const uniqueThirdFileIds = new Set()
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      queryParams.pageInfo.pageSize = exportPageSize
      queryParams.pageInfo.pageNum = 1
      while (this.totalNum === null || fetchedNum < this.totalNum) {
        if (!this.batchVisible || this.taskEndFlag) break
        // 如果不是第一次获取数据，则需要传入上一次获取到的最后一条数据的recordTime
        if (lastRecordTime) {
          queryParams.precisionTime = lastRecordTime
        }
        // 如果不是第一次获取数据，则需要将pageSize设置为pageSize+1，因为会去掉重复的一条
        queryParams.pageInfo.pageSize = lastRecordTime ? exportPageSize + 1 : exportPageSize
        let result = await this.fetchListData(queryParams)
        // 如果获取数据失败，则直接导出当前已经获取到的数据
        if (result === null) {
          console.error('Error occurred while fetching data, exporting current data...')
          break
        }
        // 如果是第一次获取数据，则获取总数
        if (this.totalNum === null) {
          this.totalNum =
            result.pageInfo.totalNum > maxExportNum ? maxExportNum : result.pageInfo.totalNum
          this.firstFileId = result.data[0].pictureInfo.thirdFileId
        }

        let dataToAppend = []
        // 去重
        for (const item of result.data) {
          const thirdFileId = item.pictureInfo.thirdFileId
          if (!uniqueThirdFileIds.has(thirdFileId)) {
            uniqueThirdFileIds.add(thirdFileId)
            dataToAppend.push(item)
          }
        }
        if (dataToAppend.length === 0) {
          break
        }
        const downloadImageAndSave = async item => {
          // 如果任务已经结束，则直接返回
          if (this.taskEndFlag) {
            return { successData, failedData }
          }
          // 下载图片
          const imageBlob = await this.downloadImage(item.pictureInfo.thumPicUrl)
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

        // 检查是否超过最大导出数量
        if (fetchedNum + dataToAppend.length > maxExportNum) {
          const remainingNum = maxExportNum - fetchedNum
          dataToAppend = dataToAppend.slice(0, remainingNum)
          this.lastFileId = dataToAppend[dataToAppend.length - 1].pictureInfo.thirdFileId
          await asyncPool.call(this, 6, dataToAppend, downloadImageAndSave)
          break
        } else {
          // 最后一组数据
          if (fetchedNum + dataToAppend.length === this.totalNum) {
            this.lastFileId = dataToAppend[dataToAppend.length - 1].pictureInfo.thirdFileId
          }
          fetchedNum += dataToAppend.length
          lastRecordTime = result.data[result.data.length - 1].deviceInfo.recordTime
          await asyncPool.call(this, 6, dataToAppend, downloadImageAndSave)
        }
      }
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
    },

    closeBatchOperate() {
      this.batchVisible = false
    },

    dialogClosed() {
      this.closeBatchOperate()
      this.process = 0
      this.currOperationId = ''
      this.currFilePath = ''
      this.taskEndFlag = false
      this.firstFileId = undefined
      this.lastFileId = undefined
      this.zip = undefined
    },
    confirm() {
      this.$emit('getList')
      this.closeBatchOperate()
    }
  }
}
</script>

<style lang="scss">
.batchCopyDialog {
  .el-dialog__body {
    padding: 15px 20px 5px 20px !important;
    .el-table th,
    .el-table td {
      text-align: left !important;
    }
  }
  .el-progress-bar {
    padding-right: 60px;
    margin-right: -69px;
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
