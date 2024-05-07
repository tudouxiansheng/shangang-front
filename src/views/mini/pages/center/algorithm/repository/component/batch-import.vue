<template>
  <div>
    <el-dialog
      :title="title"
      v-model="showBatchDialog"
      top="10vh"
      width="800px"
      class="batchImportDialog"
      @open="dialogOpen"
      @closed="dialogClose"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      :showClose="false"
    >
      <div v-if="showProgress" style="width: 715px">
        <label>{{ $t('batchOperator.progress') }}</label>
        <el-progress :percentage="progress" :format="format" />
      </div>
      <div v-if="successList.length === operationTotalNum" class="boldMess">
        <h2>
          <el-icon><el-icon-success /></el-icon>
          {{ title + $t('batchOperator.allSuccess') }}！
        </h2>
      </div>
      <template v-if="isFlag">
        <p class="fail mt10">{{ $t('batchOperator.successList') }}</p>
        <el-table
          max-height="200"
          :data="successList"
          style="width: 100%; margin: 0 0 30px"
          :row-class-name="tableRowClassNameDialog"
          @selection-change="handleSelectionChange"
          v-loading="operating"
          border
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="ID" prop="id" show-overflow-tooltip />
          <el-table-column :label="$t('public.operating')" width="100" align="center">
            <template #default="scope">
              <span
                style="margin-right: 7px; color: #f56c6c; cursor: pointer; word-break: break-word"
                @click="handleDelete(scope.row, scope.$index)"
              >
                {{ $t('public.delete') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-else>
        <div v-if="errorList.length" class="boldMess">
          <h2>
            <el-icon><el-icon-warning /></el-icon>
            {{
              title + (successList.length !== 0)
                ? $t('batchOperator.partialSuccess')
                : $t('batchOperator.failPrompt')
            }}, {{ $t('batchOperator.failPrompt') }}
          </h2>
        </div>
      </template>

      <div v-if="errorList.length">
        <p class="fail">{{ $t('batchOperator.failList') }}</p>
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
          <el-button type="primary" @click="handleCancel(operating)" :loading="closeLoading">
            {{ operating ? $t('algoGuard.stop') : $t('public.close') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { SuccessFilled as ElIconSuccess, Warning as ElIconWarning } from '@element-plus/icons-vue'
import { asyncPool, generateUuid } from '@/utils/common/utils'
import { repositoryType as RepositoryTypeEnum } from '@views/center/algorithm/repository/constant'
import { blobToBase64 } from '@/utils/common/download'
const IMPORT_TYPE = 0 // 0: fss  1: base64&fss
const BATCH_UPLOAD_SIZE = 10 // 上传接口多个文件上传最大数量
const MAX_FILE_SIZE_PERSON = 1024 * 1024 * 2.5 // 2.5MB  IMPORT_TYPE===1 时才生效
const MAX_PARAM_NUM_PERSON = 80
const MAX_FILE_SIZE_VEHICLE = 1024 * 1024 * 1.25 // 1.25MB IMPORT_TYPE===1 时才生效
const MAX_PARAM_NUM_VEHICLE = 10
export default {
  components: {
    ElIconSuccess,
    ElIconWarning
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    operations: {
      type: Array,
      required: true,
      default: () => []
    },
    api: {
      type: Function,
      required: true,
      default: () => {}
    },
    customErrorColumn: {
      type: Array,
      default: () => []
    },
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person,
      required: true
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      checkedData: [],
      isFlag: false,
      showBatchDialog: false,
      showProgress: false,
      progress: 0,
      successList: [],
      errorList: [],
      operating: false,
      taskEndFlag: false,
      closeLoading: false,
      puBatchImportThreads: 3,
      batchImportImageSize: 25,
      repositoryId: ''
    }
  },
  computed: {
    operationTotalNum() {
      return this.operations.length
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getRepositoryList() {
      this.batchDialogVisible = false
    },
    async getConfig() {
      const res = await this.$api.getRepoImportConfig({
        netType: this.$getNetType()
      })
      if (res.resultCode === 0) {
        this.puBatchImportThreads = res.puBatchImportThreads // 并发数
        this.batchImportImageSize = res.batchImportImageSize // 单次请求最大图片数
      }
    },
    handleDelete(row, index) {
      const fieldKey = this.isPersonRepo ? 'personId' : 'vehicleId'
      let formData
      formData = {
        fieldKey: row.id,
        repositoryId: this.repositoryId
      }
      formData = JSON.parse(JSON.stringify(formData).replace(/fieldKey/g, fieldKey))
      this.$api[this.isPersonRepo ? 'deleteNewPersonInfo' : 'deleteNewVehicleInfo'](formData).then(
        res => {
          if (res.resultCode === 0) {
            this.$message({
              type: 'success',
              message: this.isPersonRepo
                ? this.$t('repo.delPersonSucc')
                : this.$t('repo.delCarSucc')
            })
            this.successList.splice(index, 1)
          }
        }
      )
    },
    handleSelectionChange(val) {
      this.checkedData = val
    },
    async batchOperation() {
      this.taskUUID = generateUuid()
      this.$store.dispatch('app/addBatchTaskID', this.taskUUID)
      this.showBatchDialog = true
      this.showProgress = true
      this.operating = true
      this.progress = 0
      this.successList = []
      this.errorList = []
      this.taskEndFlag = false
      const uploadImages = async file => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append(
            'api',
            this.isPersonRepo
              ? '/api/ars/repository/person/batch/add'
              : '/api/ars/repository/vehicle/batch/add'
          )
          formData.append('netType', this.$getNetType())
          const res = await this.$api.uploadFileTemporary(formData)
          if (res.resultCode === 0) {
            return res.fileId
          }
        } catch (e) {
          throw new Error(e.message ?? this.$t('photoCropper.uploadFail'))
        }
      }

      const doRequest = async item => {
        try {
          if (IMPORT_TYPE === 0) {
            let files = [] // 用于存储当前批次的文件
            let fileIds = [] // 用于存储当前批次的文件 id
            for (let i = 0; i < item.params.length; i++) {
              const param = item.params[i]
              const patchPicture = param.patchPicture
              for (let j = 0; j < patchPicture.length; j++) {
                const file = patchPicture[j]
                files.push(file)
                if (
                  files.length === BATCH_UPLOAD_SIZE ||
                  (i === item.params.length - 1 && j === patchPicture.length - 1)
                ) {
                  // 当文件数达到 BATCH_UPLOAD_SIZE 或处理到 params 数组的最后一个元素时，调用上传接口
                  const formData = new FormData()
                  files.forEach((file, index) => {
                    formData.append(`file${index}`, file)
                  })
                  formData.append(
                    'api',
                    this.isPersonRepo
                      ? '/api/ars/repository/person/batch/add'
                      : '/api/ars/repository/vehicle/batch/add'
                  )
                  formData.append('netType', this.$getNetType())
                  const res = await this.$api.uploadFileTemporary(formData)
                  if (res === undefined) {
                    throw new Error(this.$t('repo.uploadFail'))
                  }

                  if (res.resultCode === 0) {
                    fileIds = fileIds.concat(res.fileStorageInfos.map(item => item.fileId))
                  }
                  files = []
                }
              }
            }
            // 将 fileIds 按照 params 的顺序赋值给 params
            item.params.forEach(param => {
              for (let i = 0; i < param.patchPicture.length; i++) {
                param.patchPicture[i] = fileIds[0]
                fileIds.shift()
              }
            })
          } else {
            for (const [index, row] of item.params.entries()) {
              if (row.transferType === 0) {
                row.patchPicture = await asyncPool(5, row.patchPicture, blobToBase64)
              } else if (row.transferType === 1) {
                row.patchPicture = await asyncPool(5, row.patchPicture, uploadImages)
              }
            }
          }
          if (item.params.length > 0) {
            this.repositoryId = item.params[0].repositoryId
          }
          const res = await this.api(item)
          if (res === undefined) {
            throw new Error(this.$t('repo.uploadFail'))
          }
          if (res.resultCode === 0) {
            // 全部成功
            this.successList = this.successList.concat(res.successList)
            return item
          } else if (res.resultCode === 1023124 || res.resultCode === 1023125) {
            // 部分成功 全部失败
            if (res.successList.length) {
              this.successList = this.successList.concat(res.successList)
            }
            if (res.failList.length) {
              this.errorList = this.errorList.concat(
                res.failList.map(item => {
                  return {
                    ...item,
                    ...{
                      name: item.id,
                      lpn: item.id
                    }
                  }
                })
              )
            }
            return item
          } else {
            this.errorList = this.errorList.concat(
              item.params.map(item => {
                return {
                  ...item,
                  ...{
                    resultCode: res.resultCode,
                    resultDesc: res.resultDesc
                  }
                }
              })
            )
            return item
          }
        } catch (e) {
          let errorArr = item.params.map(item => {
            return {
              ...item,
              ...{
                resultDesc: e.message,
                resultCode: e.message === this.$t('repo.uploadFail') ? -1 : item.resultCode
              }
            }
          })
          this.errorList = this.errorList.concat(errorArr)
          return item
        } finally {
          this.progress =
            ((this.successList.length + this.errorList.length) / this.operationTotalNum) * 100
        }
      }
      const formDataArr =
        IMPORT_TYPE === 0
          ? this.generateFormDataByFileNum(this.operations)
          : this.generateFormData(this.operations)
      await asyncPool.call(this, this.puBatchImportThreads, formDataArr, doRequest)
      if (this.taskEndFlag) {
        this.closeLoading = false
      }
      this.operating = false
      if (this.taskUUID) {
        this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
      }
    },
    generateFormData(batchData) {
      const formData = {}
      let currentBytes = 0
      let index = 0
      for (let data of batchData) {
        const imageFiles = data.patchPicture
        const pictureSizes = imageFiles.map(file => file.size)
        const pictureTotalSize = pictureSizes.reduce((sum, size) => sum + size, 0)
        const currentGroup = formData[index]?.params || []

        // 单组目标超出最大值，重新分组
        if (
          currentGroup.length >= (this.isPersonRepo ? MAX_PARAM_NUM_PERSON : MAX_PARAM_NUM_VEHICLE)
        ) {
          index++
          currentBytes = 0
        }

        // 单个目标的文件超出最大值，单独为一组 标记transferType 为1
        if (
          pictureTotalSize >= (this.isPersonRepo ? MAX_FILE_SIZE_PERSON : MAX_FILE_SIZE_VEHICLE)
        ) {
          data.transferType = 1
          currentBytes = 0
          const group = formData[index] || {}
          if (group.params && group.params.length > 0) {
            index++
          }
          formData[index] = { params: [data] }
          index++
          continue
        }

        // 超出最大值，重新分组
        if (
          currentBytes + pictureTotalSize >=
          (this.isPersonRepo ? MAX_FILE_SIZE_PERSON : MAX_FILE_SIZE_VEHICLE)
        ) {
          index++
          currentBytes = 0
        }
        currentBytes += pictureTotalSize

        data.transferType = 0
        const group = formData[index] || {}
        group.params = [...(group.params || []), data]
        formData[index] = group
      }
      return Object.values(formData)
    },
    generateFormDataByFileNum(batchData) {
      const formData = {}
      let index = 0
      let num = 0
      for (let data of batchData) {
        const imageFileNums = data.patchPicture.length
        // 超出最大值，重新分组
        if (num + imageFileNums > this.batchImportImageSize) {
          index++
          num = 0
        }
        num += imageFileNums

        data.transferType = 1
        const group = formData[index] || {}
        group.params = [...(group.params || []), data]
        formData[index] = group
      }
      return Object.values(formData)
    },
    format() {
      return this.successList.length + this.errorList.length + '/' + this.operationTotalNum
    },
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    dialogClose() {
      this.$emit('close')
    },
    handleCancel(val) {
      if (val) {
        //停止
        this.taskEndFlag = true
        this.isFlag = true
      } else {
        //关闭
        this.showBatchDialog = false
        this.isFlag = false
      }
    },
    // 表格斑马纹
    tableRowClassNameDialog({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss">
.batchImportDialog {
  .el-dialog__body {
    padding: 15px 20px 5px 20px !important;
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
  .mt10 {
    margin-top: 10px;
  }
  .fail {
    margin-bottom: 10px;
  }
}
</style>
