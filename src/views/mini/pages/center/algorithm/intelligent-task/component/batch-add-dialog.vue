<template>
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
    <div v-if="showProgress">
      <label>{{ $t('batchOperator.progress') }}</label>
      <el-progress :percentage="progress" :format="format" />
    </div>
    <div v-if="successList.length === operationTotalNum" class="boldMess">
      <h2>
        <el-icon><el-icon-success /></el-icon>
        {{ title + $t('batchOperator.allSuccess') }}！
      </h2>
    </div>
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
    <div v-if="errorList.length">
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
        <el-button type="primary" @click="handleCancel" :loading="closeLoading">
          {{ operating ? $t('public.cancel') : $t('public.close') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { SuccessFilled as ElIconSuccess, Warning as ElIconWarning } from '@element-plus/icons-vue'
import { asyncPool, generateUuid } from '@/utils/common/utils'
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
    }
  },
  data() {
    return {
      showBatchDialog: false,
      showProgress: false,
      progress: 0,
      successList: [],
      errorList: [],
      operating: false,
      taskEndFlag: false,
      closeLoading: false
    }
  },
  computed: {
    operationTotalNum() {
      return this.operations.length
    }
  },
  methods: {
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
      const doRequest = async item => {
        try {
          const res = await this.api(item)
          if (res.resultCode === 0) {
            // 成功
            this.successList.push(item)
            return item
          } else {
            // 失败
            this.errorList.push({
              ...item,
              ...{
                resultCode: res?.resultCode,
                resultDesc: res?.resultDesc
              }
            })
            return item
          }
        } catch (e) {
          this.errorList.push({
            ...item,
            ...{
              resultDesc: e.message
            }
          })
          return item
        } finally {
          this.progress =
            ((this.successList.length + this.errorList.length) / this.operationTotalNum) * 100
        }
      }
      await asyncPool.call(this, 6, this.operations, doRequest)
      if (this.taskEndFlag) {
        this.closeLoading = false
        this.showBatchDialog = false
      }
      this.operating = false
      if (this.taskUUID) {
        this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
      }
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
    handleCancel() {
      if (this.operating) {
        this.taskEndFlag = true
        this.closeLoading = true
      } else {
        this.showBatchDialog = false
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
}
</style>
