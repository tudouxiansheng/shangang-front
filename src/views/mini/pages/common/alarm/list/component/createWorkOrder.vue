<template>
  <!-- 添加对话框 -->
  <div class="cerate">
    <el-dialog
      :title="$t('workOrder.workOrderCreate')"
      v-model="$parent.createTicketVisible"
      top="10vh"
      width="1000px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      :modal="false"
      @closed="createClose"
      draggable
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRule"
        :label-width="$parent.locale == 'en' ? '126px' : '100px'"
        label-position="left"
      >
        <el-form-item :label="$t('workOrder.workOrderName') + '：'" prop="name">
          <el-input
            v-model="addForm.name"
            auto-complete="off"
            :placeholder="$t('workOrder.workOrderNamePrompt')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('workOrder.workOrderContent') + '：'" prop="content">
          <el-input
            type="textarea"
            v-model="addForm.content"
            :placeholder="$t('workOrder.workOrderContentPrompt')"
            maxlength="255"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item prop="pic" class="pic">
          <div style="display: flex">
            <div class="alarmBox el-upload-list--picture-card" v-show="url">
              <img :src="url" style="width: 100%; height: 100%" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="openBigImage('00')">
                  <el-icon><el-icon-zoom-in /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="deleteImage">
                  <el-icon><el-icon-delete /></el-icon>
                </span>
              </span>
            </div>

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
              <li v-if="imgUrlList.length >= uploadLen ? false : true">
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
          </div>

          <div class="help-block">{{ $t('workOrder.uploadUrlPrompt4') }}</div>
        </el-form-item>

        <el-form-item :label="$t('public.workLevel') + '：'" prop="level">
          <el-radio-group v-model="addForm.level">
            <el-radio :label="2">{{ $t('public.urgent') }}</el-radio>
            <el-radio :label="1">{{ $t('public.important') }}</el-radio>
            <el-radio :label="0">{{ $t('public.general') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('workOrder.builderId') + '：'" prop="builderId">
          <el-select
            clearable
            v-model="addForm.builderId"
            :placeholder="$t('workOrder.builderPrompt')"
          >
            <el-option
              v-for="(item, index) in personData"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('workOrder.checkerId') + '：'" prop="checkerId">
          <el-select
            clearable
            v-model="addForm.checkerId"
            :placeholder="$t('workOrder.checkerPrompt')"
          >
            <el-option
              v-for="(item, index) in personData"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createClose">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="maskloading" @click="createTicketSubmit">
            {{ $t('workOrder.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      width="80%"
      v-model="innerVisible"
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
      addForm: {
        name: '', //任务名称
        content: '', //任务内容
        pic: '',
        picList: [], //图片集合
        checkerId: '', //审核人Id
        builderId: '', //处理人Id
        level: 1 //1.紧急 2.严重 3.一般
      },
      addRule: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.workOrderNamePrompt')
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.workOrderContentPrompt')
          }
        ],
        level: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('public.workLevelPrompt')
          }
        ],
        builderId: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('workOrder.builderPrompt')
          }
        ],
        checkerId: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('workOrder.checkerPrompt')
          }
        ]
      },

      personData: [], //处理审核人列表

      fileList: [],
      hideUpload: false,
      innerVisible: false,
      url: '',
      base64Url: '',
      fileIds: [],
      imgUrlList: [],
      imgs: {},
      imgLen: 0,
      bigUrl: '',
      uploadLen: 2,

      maskloading: false,
      alarmData: {}
    }
  },
  methods: {
    async dialogOpen() {
      if (this.$refs.addForm) {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.alarmData = this.$parent.currentRowData
        this.url = this.alarmData.alarmUrl
        this.url ? (this.uploadLen = 2) : (this.uploadLen = 3)
        this.addForm.name =
          this.alarmData.alarmDevName +
          ' ' +
          this.alarmData.alarmTypeName +
          ' ' +
          this.alarmData.alarmTime
        this.addForm.level = this.alarmData.alarmLevel
      })
      await this.personList()
    },
    // 关闭窗口
    createClose() {
      this.$parent.createTicketVisible = false
      this.fileIds = []
      this.fileList = []
      this.imgUrlList = []
      this.imgLen = 0
      this.url = ''
      this.addForm = {
        name: '', //任务名称
        content: '', //任务内容
        pic: '',
        picList: [], //图片集合
        checkerId: '', //审核人Id
        builderId: '', //处理人Id
        level: 1
      }
    },
    // 获取人员列表，用于处理审核创建人！
    async personList() {
      await this.$api.get_personList({}).then(res => {
        this.personData = res.personList
      })
    },
    // 添加表单提交！
    createTicketSubmit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.url) {
            this.getBase64(this.url)
          } else {
            this.upload()
          }
        }
      })
    },
    async upload() {
      //循环上传图片
      for (let k = 0; k < this.fileList.length; k++) {
        let formData = new FormData()
        formData.append('file', this.fileList[k])
        formData.append('api', '/api/oba/ticket/add')
        formData.append('netType', this.$getNetType())
        const res = await this.$api.uploadFile(formData)
        this.fileIds.push(res.fileId)
      }
      this.submitData()
    },
    submitData() {
      this.maskloading = true
      let data = {
        name: this.addForm.name,
        content: this.addForm.content,
        pic: this.fileIds,
        builderId: this.addForm.builderId,
        checkerId: this.addForm.checkerId,
        level: parseInt(this.addForm.level),
        alarmId: this.alarmData.alarmId,
        devId: this.alarmData.alarmDevId
      }
      this.$api.add_ticketInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('workOrder.createWorkOrderSuccess')
          })
          this.$parent.createTicketVisible = false
        }
        this.maskloading = false
      })
    },

    changeFile(file, fileList) {
      this.fileList = fileList
      if (this.url) {
        this.hideUpload = fileList.length == 2
      } else {
        this.hideUpload = fileList.length == 3
      }
    },
    changeRemoveFile(file, fileList) {
      this.hideUpload = false
      this.fileList = fileList
    },
    openBigImage(index) {
      if (index === '00') {
        this.bigUrl = this.alarmData.alarmUrl
      } else {
        this.bigUrl = this.imgUrlList[index]
      }
      this.innerVisible = true
    },
    deleteImage() {
      this.url = ''
      this.uploadLen = 3
    },
    getBase64(imgUrl) {
      let _this = this
      window.URL = window.URL || window.webkitURL
      var xhr = new XMLHttpRequest()
      xhr.open('get', imgUrl, true)
      // 至关重要
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response
          // 至关重要
          let oFileReader = new FileReader()
          oFileReader.onloadend = function (e) {
            // 此处拿到的已经是 base64的图片了
            let base64 = e.target.result
            let file = _this.dataURLtoFile(base64, 'file')
            let formData = new FormData()
            formData.append('file', file)
            formData.append('api', '/api/oba/ticket/add')
            formData.append('netType', this.$getNetType())
            _this.$api.uploadFile(formData).then(res => {
              _this.fileIds.push(res.fileId)
              _this.upload()
            })
          }
          oFileReader.readAsDataURL(blob)
        }
      }
      xhr.send()
    },
    //将base64图片转为文件流，用于图片上传
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      //转换成file对象
      return new File([u8arr], filename + '.jpg', { type: mime })
    },
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

    delImg(key) {
      this.fileList.splice(key, 1)
      this.$delete(this.imgUrlList, key)
      this.imgLen--
    }
  }
}
</script>

<style lang="scss">
.cerate {
  .el-dialog__body {
    padding: 15px 155px 5px 125px !important;
  }
  .el-input {
    width: 100% !important;
  }
  span.el-radio__label {
    color: #4d4d4d;
  }
  .el-textarea__inner {
    height: 103px;
  }
  // 上传图片
  .upload-imgs li {
    position: relative;
    width: 122px;
    height: 122px;
    display: inline-block;
    margin-right: 20px;
  }
  .upload-imgs li .upload {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 122px;
    height: 122px;
    opacity: 0;
  }
  .upload-imgs .imgs img {
    width: 120px;
    height: 120px;
    border: 1px solid #b5b5b5;
    border-radius: 6px;
  }

  .add img {
    width: 122px;
    height: 122px;
  }

  .help-block {
    color: #f56c6c;
    font-size: 12px;
  }
}
</style>
