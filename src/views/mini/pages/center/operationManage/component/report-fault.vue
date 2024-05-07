<template>
  <div ref="userReportFault">
    <el-dialog
      :title="$t('operateManage.faultReport')"
      v-model="$parent.dialogVisible"
      top="10vh"
      width="645px"
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
              v-for="item in faultTypeData"
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
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="$parent.reportFaultType == 1"
          :label="$t('faultAndWorkorder.addAttachment') + ':'"
          prop="filePath"
          class="upload-file-item"
        >
          <el-upload
            class="image-uploader"
            action="#"
            :file-list="uploadFile"
            :http-request="requestUpload"
            :before-upload="beforeFileUpload"
            :on-remove="handleRemove"
          >
            <div v-if="uploadFile.length < 5" class="upload-wrapper">
              <svg-icon icon-class="upload" class-name="upload-icon mt-3"></svg-icon>
              <span class="mt-2 text-sm text-gray-400">
                {{ $t('faultAndWorkorder.uploadAttachment') }}
              </span>
            </div>
            <template #tip>
              <div v-if="uploadFile.length < 5" class="el-upload__tip text-delete">
                {{ $t('faultAndWorkorder.uploadAttachmentProp') }}
              </div>
            </template>
          </el-upload>
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
            message: this.$t('faultAndWorkorder.faultTypeProp'),
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
      userReportFaultTypeData: state => state.dict.user_report_fault_type,
      patrolFaultTypeData: state => state.dict.patrol_fault_type
    }),
    faultTypeData() {
      let arr = []
      switch (this.cuType) {
        case '4':
          arr = this.patrolFaultTypeData
          break
        case '1':
          arr = this.userReportFaultTypeData
          break
        default:
          break
      }
      return arr
    }
  },
  methods: {
    dialogOpen() {
      if (this.$parent.reportFaultType == 1) {
        this.form.devName = this.$parent.devName
      } else {
        this.form.devName = this.$parent.devNames.join('、')
      }
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    beforeFileUpload(file) {
      let type = file.name.slice(file.name.lastIndexOf('.') + 1)
      let regObj = /^jpg|png|bmp|mp4$/
      if (!regObj.test(type)) {
        this.$message.error(this.$t('faultAndWorkorder.fileTypeProp'))
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 50
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
              formData.append('api', '/api/bms/fault/add')
              formData.append('netType', this.$getNetType())
              await this.$api.uploadFile(formData).then(res1 => {
                if (res1.resultCode == 0) {
                  this.form.fileIds.push(res1.fileId)
                }
              })
            }
          }
          this.addFaultInfo()
        }
      })
    },
    async addFaultInfo() {
      let formCopy = JSON.parse(JSON.stringify(this.form))
      delete formCopy.devName
      formCopy.devIds = []
      if (this.$parent.reportFaultType == 1) {
        formCopy.devIds.push(this.$parent.devId)
      } else {
        formCopy.devIds = this.$parent.devIds
      }
      formCopy.faultSource = 2
      let res2 = await this.$api.addFaultInfo(formCopy)
      if (res2.resultCode == 0) {
        if (res2.failedList) {
          this.$alert(
            this.$t('faultAndWorkorder.faultReportPropStart') +
              res2.failedList.join('、') +
              this.$t('faultAndWorkorder.faultReportPropEnd'),
            this.$t('public.prompt'),
            {
              confirmButtonText: this.$t('public.confirm'),
              callback: () => {}
            }
          )
        } else {
          this.$message({
            message: this.$t('faultAndWorkorder.faultReportSuccess'),
            type: 'success'
          })
        }
        this.$emit('refreshTable')
        this.$refs['form'].resetFields()
        this.uploadFile = []
        this.form.fileIds = []
        this.$parent.dialogVisible = false
      }
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.uploadFile = []
      this.form.fileIds = []
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
  padding: 0 35px;
}
</style>
