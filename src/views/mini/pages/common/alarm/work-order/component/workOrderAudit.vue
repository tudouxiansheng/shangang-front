<template>
  <!-- 审核对话框 -->
  <div class="audit">
    <el-dialog
      :title="$t('workOrder.workOrderAudit')"
      v-model="$parent.auditTicketVisible"
      top="10vh"
      width="1000px"
      class="audit-dialog"
      :modal="false"
      :close-on-click-modal="false"
      @closed="auditClose"
      @open="auditOpen"
      draggable
    >
      <div class="ticket-content">
        <div class="step step-blue">
          <div class="step-text">{{ $t('workOrder.create') }}</div>
        </div>
        <div class="line"></div>
        <div class="step step-blue">
          <div class="step-text">{{ $t('workOrder.dispose') }}</div>
        </div>
        <div class="line"></div>
        <div class="step step-blue">
          <div class="step-text">{{ $t('workOrder.audit') }}</div>
        </div>
        <div class="line"></div>
        <div class="step">
          <div class="step-text">{{ $t('workOrder.close') }}</div>
        </div>
      </div>
      <div class="overflow">
        <div style="padding: 10px 0 10px 20px; background: #f2f2f2">
          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderTitle') + '：' }}</span>
              <span class="ticketContent title">{{ auditData.name }}</span>
            </div>
            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">{{ $t('public.createTime') + '：' }}</span>
              <span class="ticketContent">{{ auditData.createTime }}</span>
            </div>
          </div>

          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderId') + '：' }}</span>
              <span class="ticketContent">{{ auditData.ticketId }}</span>
            </div>
            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderState') + '：' }}</span>

              <span
                class="ticketContent"
                :class="
                  auditData.status == 1
                    ? 'disposeColor'
                    : auditData.status == 2
                    ? 'auditColor'
                    : 'closeColor'
                "
              >
                {{ $parent.setStatus(auditData.status) }}
              </span>
            </div>
          </div>
          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">
                &#12288;{{ $t('workOrder.builderId') + '：' }}
              </span>
              <span class="ticketContent">{{ auditData.builderName }}</span>
            </div>

            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">
                &#12288;{{ $t('workOrder.checkerId') + '：' }}
              </span>
              <span class="ticketContent">{{ auditData.checkerName }}</span>
            </div>
          </div>
          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderLevel') + '：' }}</span>
              <span
                class="ticketContent"
                :class="
                  auditData.level == 1 ? 'danger' : auditData.level == 2 ? 'warning' : 'success'
                "
              >
                {{ $parent.setLevel(auditData.level) }}
              </span>
            </div>

            <div class="ticket-content-item" style="width: 35%" v-if="auditData.eventName">
              <span class="ticket-content-title">{{ $t('public.eventType') + '：' }}</span>
              <span class="ticketContent">{{ auditData.eventName }}</span>
            </div>
          </div>

          <div class="work-order">
            <div class="ticket-content-item">
              <span class="ticket-content-title">
                {{ $t('workOrder.workOrderContent') + '：' }}
              </span>
              <span class="ticketContent">{{ auditData.content }}</span>
            </div>
            <div class="workImage">
              <img
                :src="item"
                alt
                class="image"
                v-for="(item, index) in auditData.pic"
                :key="index"
              />
            </div>
          </div>

          <div class="work-order" v-if="disposeOpinionShow">
            <div class="ticket-content-item">
              <span class="ticket-content-title">
                {{ $t('workOrder.operationContent') + '：' }}
              </span>
              <span class="ticketContent">{{ disposeOpinion.result }}</span>
            </div>

            <div class="workImage">
              <img
                :src="item"
                alt
                class="image"
                v-for="(item, index) in disposeOpinion.resultPic"
                :key="index"
              />
            </div>
          </div>
        </div>

        <el-form
          class="audit"
          ref="auditForm"
          :model="auditForm"
          :rules="auditRule"
          label-width="130px"
          style="margin-top: 25px"
          label-position="left"
        >
          <el-form-item :label="$t('workOrder.isPass') + '：'" prop="isPass">
            <el-radio-group v-model="auditForm.isPass">
              <el-radio :label="1">{{ $t('workOrder.yes') }}</el-radio>
              <el-radio :label="0">{{ $t('workOrder.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="$t('workOrder.auditOpinion') + '：'" prop="operationContent">
            <el-input
              type="textarea"
              v-model="auditForm.operationContent"
              :placeholder="$t('workOrder.auditOpinionPrompt')"
              maxlength="255"
              clearable
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item prop="pic">
            <ul class="upload-imgs el-upload-list--picture-card">
              <li class="imgs" v-for="(value, index) in imgUrlList" :key="index">
                <img :src="value" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="openBigImage1(index)">
                    <el-icon><el-icon-zoom-in /></el-icon>
                  </span>
                  <span class="el-upload-list__item-delete" @click="delImg(index)">
                    <el-icon><el-icon-delete /></el-icon>
                  </span>
                </span>
              </li>
              <li v-if="imgUrlList.length >= 3 ? false : true">
                <input
                  type="file"
                  class="upload"
                  @change="addImg"
                  ref="inputer"
                  multiple
                  title
                  accept="image/png, image/jpeg, image/bmp, image/jpg"
                />
                <a class="add">
                  <img src="@/assets/img/common/file-upload.png" alt />
                </a>
              </li>
            </ul>
            <div class="help-block">{{ $t('workOrder.uploadUrlPrompt4') }}</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditClose">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="$parent.maskloading" @click="auditTicketSubmit">
            {{ $t('workOrder.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      width="80%"
      v-model="auditinnerVisible"
      append-to-body
      :close-on-click-modal="false"
      draggable
    >
      <img :src="bigUrl" alt style="width: 100%; max-height: 600px" />
    </el-dialog>
  </div>
</template>

<script>
import { ZoomIn as ElIconZoomIn, Delete as ElIconDelete } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconZoomIn,
    ElIconDelete
  },
  data() {
    return {
      auditData: {},
      auditForm: {},
      auditRule: {},
      // 上传图片
      imgUrlList: [],
      fileList: [],
      fileIds: [],
      formData: new FormData(),
      imgs: {},
      imgLen: 0,
      bigUrl: '',

      auditinnerVisible: false,
      disposeOpinionShow: false,
      disposeOpinion: {}
    }
  },
  methods: {
    // 打开窗口
    auditOpen() {
      if (this.$refs.auditForm) {
        this.$nextTick(() => {
          this.$refs.auditForm.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.auditData = this.$parent.auditData
        this.auditForm = {
          isPass: 1,
          operationContent: '', //反馈内容
          pic: []
        }
        this.disposeOpinion = this.$parent.disposeOpinion
        this.disposeOpinionShow = this.$parent.disposeOpinionShow
      })
      this.auditRule = {
        isPass: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.checkerPrompt')
          }
        ],
        operationContent: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.auditOpinionPrompt')
          }
        ]
      }
    },
    // 关闭窗口
    auditClose() {
      this.$parent.auditTicketVisible = false
      this.$parent.maskloading = false
      this.$parent.auditData = {}
      this.$parent.disposeOpinionShow = false
      this.$parent.disposeOpinion = {}
      this.fileIds = []
      this.fileList = []
      this.imgUrlList = []
      this.imgLen = 0
    },
    // 审核表单提交
    auditTicketSubmit() {
      this.$refs['auditForm'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          this.upload()
        }
      })
    },
    async upload() {
      //循环上传图片
      for (let k = 0; k < this.fileList.length; k++) {
        let formData = new FormData()
        formData.append('file', this.fileList[k])
        formData.append('api', '/api/oba/ticket/deal')
        formData.append('netType', this.$getNetType())
        const res = await this.$api.uploadFile(formData)
        this.fileIds.push(res.fileId)
      }
      this.submitAuditTicket()
    },

    submitAuditTicket() {
      let data = {
        ticketId: this.auditData.ticketId,
        operationContent: this.auditForm.operationContent,
        pic: this.fileIds,
        operation: '6',
        isPass: this.auditForm.isPass
      }

      this.$api.deal_ticketInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('workOrder.auditSuccess')
          })

          this.$parent.auditTicketVisible = false
          this.$parent.handleFind()
        }

        this.$parent.maskloading = false
      })
    },

    // 图片上传判断格式大小
    addImg(event) {
      let inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      this.fil = inputDOM.files
      let isTypeTrue = /^image\/(jpeg|png|jpg|bmp)$/.test(this.fil[0].type)
      const isLt2M = Math.floor(this.fil[0].size / (1024 * 1024)) < 2
      let oldLen = this.imgLen
      let len = this.fil.length + oldLen
      if (!isTypeTrue) {
        this.$message.error(this.$t('workOrder.uploadUrlPrompt1'))
        return
      }
      if (!isLt2M) {
        this.$message.error(this.$t('workOrder.uploadUrlPrompt2'))
        return
      }
      if (len > 3) {
        this.$message.info(
          this.$t('workOrder.uploadUrlPrompt3') +
            (3 - oldLen) +
            this.$t('workOrder.uploadUrlPrompt5')
        )
        return false
      }
      for (let i = 0; i < this.fil.length; i++) {
        // 图片回显
        var reader = new FileReader()
        //使用该对象读取file文件
        reader.readAsDataURL(this.fil[i])
        //读取文件成功后执行的方法函数
        reader.onload = e => {
          //读取成功后返回的一个参数e，整个的一个进度事件
          //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
          //的base64编码格式的地址
          this.imgUrlList.push(e.target.result)
          this.fileList.push(this.fil[i])
        }
        this.imgLen++

        this.imgs[this.fil[i].name + '?' + new Date().getTime() + i] = this.fil[i]
      }
    },
    // 图片放大
    openBigImage(index) {
      this.bigUrl = this.imgUrlList[index]
      this.disposeinnerVisible = true
    },
    openBigImage1(index) {
      this.bigUrl = this.imgUrlList[index]
      this.auditinnerVisible = true
    },
    delImg(key) {
      this.fileList.splice(key, 1)
      this.$delete(this.imgUrlList, key)
      this.imgLen--
    }
  }
}
</script>

<style lang="scss">
.audit-dialog {
  .el-dialog__body {
    padding: 0px 85px 5px;
  }
}
</style>
