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
    <div>
      <label>{{ $t('capture.progress') }}</label>
      <el-progress :percentage="percentage" :format="format"></el-progress>
    </div>

    <div v-show="!batchErrorList.length && !loading" class="boldMess">
      <h2>
        <el-icon><el-icon-success /></el-icon>
        {{ $t('capture.exportSucceed') }}
      </h2>
    </div>

    <div v-show="batchErrorList && batchErrorList.length && operatedSuccNum" class="boldMess">
      <h2>
        <el-icon><el-icon-warning /></el-icon>
        {{ $t('capture.exportPartialSuccess') }}
      </h2>
    </div>

    <div v-show="batchErrorList && batchErrorList.length && !operatedSuccNum" class="boldMess">
      <h2>
        <el-icon><el-icon-warning /></el-icon>
        {{ $t('capture.exportFiled') }}
      </h2>
    </div>

    <div v-show="batchErrorList && batchErrorList.length">
      <p>{{ $t('capture.lisErrors') }}</p>
      <el-table
        max-height="200"
        :data="batchErrorList"
        style="width: 100%; margin: 0px 0 30px"
        :row-class-name="tableRowClassNameDialog"
        border
      >
        <el-table-column show-overflow-tooltip :label="$t('alarmLinkage.devName')" max-width="100">
          <template #default="{ row }">
            <span>{{ row.cameraName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('primaryDevice.resultCode')"
          max-width="100"
        >
          <template #default="{ row }">
            <span>{{ row.resultCode }}</span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('primaryDevice.resultDesc')"
          max-width="100"
        >
          <template #default="{ row }">
            <span>{{ row.resultDesc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm" :disabled="loading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { SuccessFilled as ElIconSuccess, Warning as ElIconWarning } from '@element-plus/icons-vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getBlob } from '@/utils/common/download'
import { generateUuid } from '@/utils/common/utils'

export default {
  components: {
    ElIconSuccess,
    ElIconWarning
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      batchErrorList: [], //批量操作列表
      operatedSuccNum: 0, //操作成功的数量
      choosedNum: 0, //总共要操作的数量
      multipleSelection: [], //批量操作选中的数据
      loading: false, //获取列表接口的加载loading
      zip: undefined
    }
  },
  computed: {
    percentage() {
      return this.operatedSuccNum ? (this.operatedSuccNum / this.choosedNum) * 100 : 0
    },
    batchVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 表格斑马纹
    tableRowClassNameDialog({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    async dialogOpen() {
      this.$nextTick(() => {
        
      })
      this.taskUUID = generateUuid()
      this.$store.dispatch('app/addBatchTaskID', this.taskUUID)
      this.batchErrorList = []
      this.operatedSuccNum = 0
      this.multipleSelection = this.$parent.checkedCopyDate
      this.choosedNum = JSON.parse(JSON.stringify(this.multipleSelection.length))
      let i = 0
      this.zip = new JSZip()
      this.loading = true
      await this.batchVOperate(i)
    },
    async batchVOperate(i) {
      if (i < this.multipleSelection.length) {
        if (this.multipleSelection[i].metadataContent.detectUrl != undefined) {
          const blob = await getBlob(this.multipleSelection[i].metadataContent.detectUrl)
          if (blob) {
            this.zip.file(`${this.multipleSelection[i].cameraName}_${i + 1}.jpeg`, blob)
          }
          this.operatedSuccNum += 1
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
        if (this.taskUUID) {
          this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
        }
        this.loading = false
        const blobZip = await this.zip.generateAsync({
          type: 'blob'
        })
        saveAs(blobZip, `${this.dayjs().format('YYYY-MM-DDTHH:mm:ssZ')}.zip`)
        this.$emit('searchClear')
      }
    },

    closeBatchOperate() {
      this.batchVisible = false
    },

    dialogClosed() {
      this.closeBatchOperate()
      this.zip = undefined
    },
    format() {
      return this.operatedSuccNum + '/' + this.choosedNum
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
