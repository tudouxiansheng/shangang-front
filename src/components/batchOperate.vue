<template>
  <el-dialog
    ref="batchOperateDialog"
    :title="$t('public.batchOperations')"
    v-model="batchVisible"
    top="10vh"
    width="800px"
    class="batchOperateDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    draggable
    :showClose="false"
  >
    <div>
      <label>{{ $t('batchOperator.progress') }}</label>
      <el-progress :percentage="percentage" :format="format"></el-progress>
    </div>

    <div
      v-show="
        !batchErrorList.length &&
        !loading &&
        !operating &&
        (multipleSelectionMany.length != 0 || multipleSelection.length != 0)
      "
      class="boldMess"
    >
      <h2>
        <el-icon><el-icon-success /></el-icon>
        {{ operate }}{{ locale === 'en' ? '. ' : '' }}{{ $t('batchOperator.allSuccess') }}！
      </h2>
    </div>
    <div
      v-show="
        !loading && !operating && multipleSelectionMany.length == 0 && multipleSelection.length == 0
      "
      class="boldMess"
    >
      <h2>
        {{ $t('batchOperator.dataEmpty') }}
      </h2>
    </div>
    <div
      v-show="batchErrorList && batchErrorList.length && operatedSuccNum && !operating"
      class="boldMess"
    >
      <h2>
        <el-icon><el-icon-warning /></el-icon>
        {{ operate }}{{ locale === 'en' ? '. ' : '' }}{{ $t('batchOperator.partialSuccess')
        }}{{ locale === 'en' ? '. ' : ',' }}
        {{ $t('batchOperator.failPrompt') }}
      </h2>
    </div>

    <div
      v-show="batchErrorList && batchErrorList.length && !operatedSuccNum && !operating"
      class="boldMess"
    >
      <h2>
        <el-icon><el-icon-warning /></el-icon>
        {{ operate }}{{ locale === 'en' ? '. ' : '' }}{{ $t('batchOperator.allFail')
        }}{{ locale === 'en' ? '. ' : ',' }}{{ $t('batchOperator.failPrompt') }}
      </h2>
    </div>

    <div v-if="batchErrorList && batchErrorList.length" class="errorList">
      <p>{{ $t('batchOperator.failList') }}</p>
      <el-table
        max-height="200"
        :data="batchErrorList"
        style="width: 100%; margin: 0px 0 30px"
        :row-class-name="tableRowClassNameDialog"
        border
      >
        <el-table-column :label="what + 'ID'" prop="whatId" mix-width="130" show-overflow-tooltip />

        <el-table-column
          :label="what + $t('batchOperator.name')"
          prop="whatName"
          max-width="100"
          show-overflow-tooltip
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
        <el-button
          v-if="choosedNum === operatedSuccNum + batchErrorList.length"
          type="primary"
          @click="confirm"
          :disabled="loading"
        >
          {{ $t('public.confirm') }}
        </el-button>
        <el-button v-else type="info" @click="confirm">
          {{ $t('public.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { SuccessFilled as ElIconSuccess, Warning as ElIconWarning } from '@element-plus/icons-vue'
import { generateUuid } from '@/utils/common/utils'

export default {
  components: {
    ElIconSuccess,
    ElIconWarning
  },
  props: {
    // 批量操作选中的表格数据
    multipleSelection: {
      type: Array,
      default() {
        return []
      }
    },
    // 操作的是什么(比如操作的是 设备,则 "what" 传入 "设备")
    what: {
      type: String,
      default: ''
    },
    //获取列表接口的加载loading
    loading: {
      type: Boolean,
      default: false
    },
    // 弹框打开关闭
    visible: {
      type: Boolean,
      default: false
    },
    // 进行的是哪种批量操作（如 操作，取消...）
    operate: {
      type: String,
      default: ''
    },
    // 批量操作的接口
    batchApi: {
      type: String,
      default: ''
    },
    // 批量操作需要传的第一个参数||错误表格的id
    whatId: {
      type: String,
      default: ''
    },
    // 错误表格的name
    whatName: {
      type: String,
      default: ''
    },
    // 批量操作的传参是否较多时的传参数组
    multipleSelectionMany: {
      type: Array,
      default() {
        return []
      }
    },
    // 传参的对象比较特殊,对象里面再套一个命名的对象
    objNeedSetName: {
      type: String,
      default: ''
    },
    // 循环调接口后是否有其他操作
    isHasHandle: {
      type: Boolean,
      default: false
    },
    beforeBatchOperate: {
      type: Function
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      PLATFORM_TYPE: PLATFORM_TYPE,
      locale: localStorage.getItem('locale'),
      batchErrorList: [], //批量操作失败列表
      batchSuccessList: [], //批量操作成功列表
      operatedSuccNum: 0, //操作成功的数量
      choosedNum: 0, //总共要操作的数量,
      afterBatchResList: [], //收集调用批量接口后的成功res数据
      operating: false //是否正在操作
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
    },

    batchLoading: {
      get() {
        return this.loading
      },
      set(val) {
        this.$emit('update:loading', val)
      }
    }
  },
  methods: {
    async dialogOpen() {
      if (!this.fullScreen) {
        this.$nextTick(() => {
          this.setDialogCss()
        })
      } else {
      }
      this.taskUUID = generateUuid()
      this.$store.dispatch('app/addBatchTaskID', this.taskUUID)
      this.choosedNum = JSON.parse(JSON.stringify(this.multipleSelection.length))
      this.batchErrorList = []
      this.batchSuccessList = []
      this.afterBatchResList = []
      this.operatedSuccNum = 0
      let i = 0
      await this.batchOperate(i)
    },
    // 表格斑马纹
    tableRowClassNameDialog({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    format() {
      return this.operatedSuccNum + '/' + this.choosedNum
    },

    async batchOperate(i) {
      this.operating = true
      if (i < this.multipleSelection.length) {
        let newObj = {}
        if (this.multipleSelectionMany && this.multipleSelectionMany.length) {
          //批量操作的传参较多时
          if (this.objNeedSetName) {
            //传参的对象比较特殊,对象里面再套一个命名的对象
            let obj = {
              batchKey: this.multipleSelectionMany[i]
            }
            newObj = JSON.parse(JSON.stringify(obj).replace(/batchKey/g, this.objNeedSetName))
          } else {
            newObj = this.multipleSelectionMany[i]
          }
          if (this.beforeBatchOperate && typeof this.beforeBatchOperate === 'function') {
            newObj = await this.beforeBatchOperate(newObj)
          }
        } else {
          let obj = {
            //批量操作的传参只有一个id时
            batchKey: this.multipleSelection[i][this.whatId]
          }
          newObj = JSON.parse(JSON.stringify(obj).replace(/batchKey/g, this.whatId))
        }
        try {
          if (this.batchVisible === false) {
            throw new Error('User cancel operation')
          }
          let res
          if (this.batchApi == 'sendCancelSubscribe') {
            res = await this.$api[this.batchApi]({ subscribeInfo: newObj })
          } else {
            res = await this.$api[this.batchApi](newObj)
          }

          if (res) {
            if (res.resultCode == 0) {
              this.batchSuccessList.push(this.multipleSelection[i])
              this.afterBatchResList.push(res)
              if (
                this.batchApi == 'addMainDevInfo' &&
                this.multipleSelection[i]['recordPolicyId']
              ) {
                let obj1 = {
                  mainDevId: res.mainDevId,
                  recordPolicyId: this.multipleSelection[i]['recordPolicyId'],
                  recordStoreDays:
                    this.multipleSelection[i]['platType'] == PLATFORM_TYPE.VPAAS &&
                    this.multipleSelection[i]['recordPolicyId']
                      ? parseInt(this.multipleSelection[i]['recordStoreDays'])
                      : undefined
                }
                let res1 = await this.$api.setRecordPolicyInfoByMainDevId(obj1)
                if (res1.resultCode != 0) {
                  this.batchErrorList.push({
                    whatId: this.multipleSelection[i][this.whatId],
                    whatName: this.multipleSelection[i][this.whatName],
                    resultCode: res1.resultCode,
                    resultDesc: res1.resultDesc
                  })
                } else {
                  this.operatedSuccNum += 1
                }
              } else {
                this.operatedSuccNum += 1
              }
            } else {
              this.batchErrorList.push({
                whatId: this.multipleSelection[i][this.whatId],
                whatName: this.multipleSelection[i][this.whatName],
                resultCode: res.resultCode,
                resultDesc: res.resultDesc
              })
            }
          } else {
            this.batchErrorList.push({
              whatId: this.multipleSelection[i][this.whatId],
              whatName: this.multipleSelection[i][this.whatName],
              resultCode: '',
              resultDesc: this.$t('batchOperator.requestTimeOut')
            })
          }
          i += 1
          this.batchOperate(i)
        } catch (e) {
          if (this.taskUUID) {
            this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
          }
          this.operating = true
        }
      } else {
        if (this.isHasHandle)
          this.$emit('afterSuccessHandle', {
            batchSuccessList: this.batchSuccessList,
            afterBatchResList: this.afterBatchResList
          })
        if (this.taskUUID) {
          this.$store.dispatch('app/removeBatchTaskID', this.taskUUID)
        }
        this.batchLoading = false
        this.operating = false
        this.$emit('searchClear')
      }
    },
    closeBatchOperate() {
      this.batchVisible = false
      this.batchLoading = true
    },

    confirm() {
      this.$emit('getList')
      this.closeBatchOperate()
    }
  }
}
</script>

<style lang="scss">
.batchOperateDialog {
  .el-dialog__body {
    padding: 15px 20px 5px 20px !important;
    .el-table th,
    .el-table td {
      text-align: left !important;
    }
  }
  .el-progress-bar {
    padding-right: 70px;
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

.errorList {
  .el-table__border-left-patch,
  .el-table--border .el-table__inner-wrapper::after,
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9 !important;
  }
}
</style>
