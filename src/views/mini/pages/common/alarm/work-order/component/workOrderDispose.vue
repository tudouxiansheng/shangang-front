<template>
  <!-- 处理对话框 -->
  <div class="dispose">
    <el-dialog
      :title="$t('workOrder.workOrderDispose')"
      v-model="$parent.disposeTicketVisible"
      top="10vh"
      width="1000px"
      :modal="false"
      :close-on-click-modal="false"
      @closed="disposeClose"
      @open="disposeOpen"
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
        <div class="step">
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
              <span class="ticketContent title">{{ disposeData.name }}</span>
            </div>
            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">{{ $t('public.createTime') + '：' }}</span>
              <span class="ticketContent">{{ disposeData.createTime }}</span>
            </div>
          </div>

          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderId') + '：' }}</span>
              <span class="ticketContent">{{ disposeData.ticketId }}</span>
            </div>
            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderState') + '：' }}</span>
              <span
                :class="
                  disposeData.status == 1
                    ? 'disposeColor'
                    : disposeData.status == 2
                    ? 'auditColor'
                    : 'closeColor'
                "
                class="ticketContent"
              >
                {{ $parent.setStatus(disposeData.status) }}
              </span>
            </div>
          </div>

          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">
                &#12288;{{ $t('workOrder.builderId') + '：' }}
              </span>
              <span class="ticketContent">{{ disposeData.builderName }}</span>
            </div>

            <div class="ticket-content-item" style="width: 35%">
              <span class="ticket-content-title">
                &#12288;{{ $t('workOrder.checkerId') + '：' }}
              </span>
              <span class="ticketContent">{{ disposeData.checkerName }}</span>
            </div>
          </div>
          <div class="ticket-content">
            <div class="ticket-content-item">
              <span class="ticket-content-title">{{ $t('workOrder.workOrderLevel') + '：' }}</span>
              <span
                class="ticketContent"
                :class="
                  disposeData.level == 1 ? 'danger' : disposeData.level == 2 ? 'warning' : 'success'
                "
              >
                {{ $parent.setLevel(disposeData.level) }}
              </span>
            </div>
          </div>
          <div class="work-order">
            <div class="ticket-content-item">
              <span class="ticket-content-title">
                {{ $t('workOrder.workOrderContent') + '：' }}
              </span>
              <span class="ticketContent">{{ disposeData.content }}</span>
            </div>
            <div class="workImage">
              <img
                :src="item"
                alt
                class="image"
                v-for="(item, index) in disposeData.pic"
                :key="index"
              />
            </div>
          </div>
        </div>

        <el-form
          ref="disposeForm"
          :model="disposeForm"
          :rules="disposeRule"
          :label-width="$parent.locale == 'en' ? '120px' : '98px'"
          size="small"
          style="margin-top: 25px"
          label-position="left"
        >
          <el-form-item :label="$t('public.eventType') + '：'" prop="eventType">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="disposeForm.eventType"
              :placeholder="$t('public.eventTypePrompt')"
            >
              <el-option
                v-for="(item, index) in $parent.eventTypeData"
                :key="index"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('workOrder.operationContent') + '：'" prop="operationContent">
            <el-input
              type="textarea"
              v-model="disposeForm.operationContent"
              :placeholder="$t('workOrder.operationContentPrompt')"
              maxlength="255"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="pic">
            <ul class="upload-imgs el-upload-list--picture-card">
              <li class="imgs" v-for="(value, index) in imgUrlList" :key="index">
                <img :src="value" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="openBigImage(index)">
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
                  <img src="@/assets/img/common/file-upload.png" @click="$refs.inputer.click()" />
                </a>
              </li>
            </ul>
            <div class="help-block">{{ $t('workOrder.uploadUrlPrompt4') }}</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="disposeClose">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="$parent.maskloading" @click="disposeTicketSubmit">
            {{ $t('workOrder.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      width="80%"
      v-model="disposeinnerVisible"
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
      locale: localStorage.getItem('locale'),
      disposeData: {},
      disposeForm: {
        eventType: '',
        operationContent: '', //反馈内容
        pic: []
      },
      disposeRule: {},
      // 上传图片
      imgUrlList: [],
      fileList: [],
      fileIds: [],
      formData: new FormData(),
      imgs: {},
      imgLen: 0,
      bigUrl: '',

      disposeinnerVisible: false
    }
  },
  methods: {
    // 打开窗口
    disposeOpen() {
      if (this.$refs.disposeForm) {
        this.$nextTick(() => {
          this.$refs.disposeForm.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.disposeData = this.$parent.disposeData
        this.disposeForm = {
          eventType: '',
          operationContent: '', //反馈内容
          pic: []
        }
      })
      this.disposeRule = {
        eventType: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('public.eventTypePrompt')
          }
        ],
        operationContent: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.operationContentPrompt')
          }
        ]
      }
    },
    // 关闭窗口
    disposeClose() {
      this.$parent.disposeTicketVisible = false
      this.$parent.maskloading = false
      this.$parent.disposeData = {}
      this.fileIds = []
      this.fileList = []
      this.imgUrlList = []
      this.imgLen = 0
    },
    // 处理表单提交
    disposeTicketSubmit() {
      this.$refs['disposeForm'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          if (!this.fileList) {
            this.upload()
          } else {
            this.submitDisposeTicket()
          }
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
      this.submitDisposeTicket()
    },

    submitDisposeTicket() {
      let data = {
        ticketId: this.disposeData.ticketId,
        eventType: this.disposeForm.eventType,
        operationContent: this.disposeForm.operationContent,
        pic: this.fileIds,
        operation: '5'
      }

      this.$api.deal_ticketInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('workOrder.processSuccess')
          })
          this.$parent.disposeTicketVisible = false
          this.$parent.handleFind()
        }
        this.$parent.maskloading = false
      })
    },
    uploadImg() {},
    // 图片上传判断格式大小
    addImg() {
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
