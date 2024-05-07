<template>
  <div>
    <el-dialog
      :title="$t('faultAndWorkorder.editeFault')"
      v-model="$parent.dialogVisible"
      top="10vh"
      width="600px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="110px"
        label-position="left"
      >
        <el-form-item :label="$t('faultAndWorkorder.faultDevName') + ':'" prop="devName">
          <el-input
            v-model="form.devName"
            clearable=""
            :placeholder="$t('faultAndWorkorder.faultDevNameProp')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.faultType') + ':'" prop="faultType">
          <el-select v-model="form.faultType" :placeholder="$t('faultAndWorkorder.faultTypeProp')">
            <el-option
              v-for="item in userReportFaultTypeData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('faultAndWorkorder.faultDiscoveryTime') + ':'"
          prop="faultDiscoveryTime"
        >
          <el-date-picker
            :shortcuts="pickerOptions && pickerOptions.shortcuts"
            :disabled-date="pickerOptions && pickerOptions.disabledDate"
            :cell-class-name="pickerOptions && pickerOptions.cellClassName"
            v-model="form.faultDiscoveryTime"
            type="datetime"
            :placeholder="$t('faultAndWorkorder.faultDiscoveryTimeProp')"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.faultRemark') + ':'" prop="faultRemark">
          <el-input
            v-model="form.faultRemark"
            type="textarea"
            maxlength="256"
            :placeholder="$t('faultAndWorkorder.faultRemarkProp')"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('faultAndWorkorder.attachment') + ':'"
          prop="filePath"
          class="upload-file-item"
        >
          <div v-for="(item, index) in fileLists" :key="index">
            {{ item.filename }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.level') + ':'" prop="level">
          <el-radio-group v-model="form.level">
            <el-radio :label="3">{{ $t('public.general') }}</el-radio>
            <el-radio :label="2">{{ $t('faultAndWorkorder.instancy') }}</el-radio>
            <el-radio :label="1">{{ $t('public.urgent') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="text-center">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('workOrder.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      cuType: sessionStorage.getItem('cuType'),
      faultId: undefined,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      form: {
        devName: undefined,
        faultType: undefined,
        faultDiscoveryTime: undefined,
        faultRemark: undefined,
        fileIds: undefined,
        level: 3
      },
      fileList: [],
      fileLists: [],
      uploadFile: [],
      formRules: {
        devName: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.faultDevNameProp'),
            trigger: 'change'
          }
        ],
        faultType: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.statusProp'),
            trigger: 'change'
          }
        ],
        faultRemark: [
          {
            max: 256,
            message: this.$t('faultAndWorkorder.faultRemark256Prop'),
            trigger: 'change'
          }
        ],
        level: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.levelProp'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userReportFaultTypeData: state => state.dict.user_report_fault_type
    })
  },
  methods: {
    dialogOpen() {
      this.faultId = this.$parent.faultId
      this.getFaultDetail()
    },
    async getFaultDetail() {
      let res = await this.$api.getFaultDetail({ faultId: this.faultId })
      if (res.resultCode == 0) {
        this.form = {
          faultId: res.faultId,
          faultType: res.faultType,
          devName: res.devName,
          faultDiscoveryTime: res.faultDiscoveryTime,
          faultRemark: res.faultRemark,
          level: res.level
        }
      }
      this.fileLists = res.fileList
    },
    convertBase64UrlToBlob(base64) {
      var urlData = base64.dataURL
      var type = base64.type
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: type })
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src
        .substring(img.src.lastIndexOf('.') + 1, img.src.lastIndexOf('?'))
        .toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return {
        dataURL: dataURL,
        type: 'image/' + ext
      }
    },

    // 覆盖默认的上传行为
    requestUpload() {},
    beforeFileUpload(file) {
      let typeList = ['jpg', 'png', 'bmp', 'mp4']
      const isLt5M = file.size / 1024 / 1024 < 50

      if (!typeList.includes(file.type)) {
        this.$message.error(this.$t('faultAndWorkorder.fileTypeProp'))
        return false
      }
      if (!isLt5M) {
        this.$message.error(this.$t('faultAndWorkorder.fileSizeProp'))
        return false
      }
      return this.afterFileSelected(file)
    },
    afterFileSelected(file) {
      this.uploadFile.push(file)
    },
    handleRemove(file, fileList) {
      this.uploadFile = fileList
    },
    handleSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.uploadFile.length) {
            this.form.fileIds = []
            for (let i = 0; i < this.uploadFile.length; i++) {
              const formData = new FormData()
              formData.append('file', this.uploadFile[i])
              formData.append('api', '/api/bms/user/fault/modify')
              formData.append('netType', this.$getNetType())
              await this.$api.uploadFile(formData).then(res1 => {
                if (res1.resultCode == 0) {
                  this.form.fileIds.push(res1.fileId)
                  if (i == this.uploadFile.length - 1) {
                    this.editFaultInfo()
                  }
                }
              })
            }
          } else {
            this.editFaultInfo()
          }
        }
      })
    },
    async editFaultInfo() {
      let formCopy = JSON.parse(JSON.stringify(this.form))
      delete formCopy.devName
      let res2 = await this.$api.userModifyFault(formCopy)
      if (res2.resultCode == 0) {
        this.$message({
          message: this.$t('faultAndWorkorder.faultEditSuccess'),
          type: 'success'
        })
        this.$refs['form'].resetFields()
        this.uploadFile = []
        this.form.fileIds = []
        this.$parent.getUserFaultList()
        this.$parent.dialogVisible = false
      }
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.$parent.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  width: 100%;
  .upload-wrapper {
    width: 80px;
    height: 60px;
    @apply flex flex-col items-center border border-gray-400 rounded;
    .upload-icon {
      width: 24px;
      height: 16px;
    }
  }

  .image-uploader-preview {
    position: relative;
    width: 80px;
    height: 60px;
    .image-uploader-preview-actions {
      @apply rounded;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &:hover .image-uploader-preview-actions {
      opacity: 1;
    }
    .image-uploader-preview-actions-item {
      margin: 0 10px;
    }
  }
  .image {
    @apply rounded;
    width: 100%;
    height: 100%;
    display: block;
  }
}
:deep(.el-upload) {
  display: inline;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
