<template>
  <el-dialog
    draggable
    :close-on-click-modal="false"
    :modal="false"
    :title="$t('logoUpload.logoUploadTitle')"
    v-model="dialogVisible"
    class="logo-upload-dialog"
    top="10vh"
    :width="locale == 'en' ? '825px' : '562px'"
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="uploadForm"
      :model="uploadForm"
      :rules="uploadFormRule"
      label-position="left"
      label-width="106px"
    >
      <div class="form-title">
        {{ $t('logoUpload.logoLabel') }}
        <el-button
          :icon="ElIconPictureOutline"
          type="text"
          @click="handlePreview(fileType.logo, true)"
        >
          {{ $t('logoUpload.logoPreview') }}
        </el-button>
      </div>
      <el-upload
        :before-upload="$event => beforeUpload($event, fileType.logo)"
        :http-request="requestUpload"
        :show-file-list="false"
        action="#"
        class="avatar-uploader"
      >
        <img v-if="logoUrl" :src="logoUrl" class="avatar" />
        <span v-if="logoUrl" class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click.stop.prevent="handlePreview(fileType.logo)"
          >
            <el-icon><el-icon-zoom-in /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click.stop.prevent="handleRemove(fileType.logo)"
          >
            <el-icon><el-icon-delete /></el-icon>
          </span>
        </span>
        <el-icon v-else class="avatar-uploader-icon"><el-icon-plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">
            {{ $t('logoUpload.logoPrompt') }}
          </div>
        </template>
      </el-upload>
      <div class="form-title">
        {{ $t('logoUpload.loginBgLabel') }}
        <el-button
          :icon="ElIconPictureOutline"
          type="text"
          @click="handlePreview(fileType.loginBg, true)"
        >
          {{ $t('logoUpload.loginBgPreview') }}
        </el-button>
      </div>
      <el-upload
        :before-upload="$event => beforeUpload($event, fileType.loginBg)"
        :http-request="requestUpload"
        :show-file-list="false"
        action="#"
        class="avatar-uploader"
      >
        <img v-if="loginBgUrl" :src="loginBgUrl" class="avatar" />
        <span v-if="loginBgUrl" class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click.stop.prevent="handlePreview(fileType.loginBg)"
          >
            <el-icon><el-icon-zoom-in /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click.stop.prevent="handleRemove(fileType.loginBg)"
          >
            <el-icon><el-icon-delete /></el-icon>
          </span>
        </span>
        <el-icon v-else class="avatar-uploader-icon"><el-icon-plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">
            {{ $t('logoUpload.loginBgPrompt') }}
          </div>
        </template>
      </el-upload>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>

    <el-image-viewer
      v-if="showViewer"
      @close="closeViewer"
      :url-list="viewerUrlList"
    ></el-image-viewer>
  </el-dialog>
</template>

<script>
import {
  ZoomIn as ElIconZoomIn,
  Delete as ElIconDelete,
  Plus as ElIconPlus,
  Picture as ElIconPictureOutline
} from '@element-plus/icons-vue'
import { sStorage } from '@/utils/common/store'
import { getBlob, blobToBase64 } from '@/utils/common/download'
const FileType = {
  logo: 'logo',
  loginBg: 'loginBg'
}
import { ElImageViewer } from 'element-plus'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      uploadForm: {
        logo: '',
        loginBg: ''
      },
      uploadFormRule: {},
      logoUrl: '',
      loginBgUrl: '',
      fileType: FileType,
      showViewer: false,
      previewLogo: require('@/assets/img/common/default-logo.png'),
      previewLoginBg: require('@/assets/img/common/default-login-bg.png'),
      viewerUrlList: [],
      loading: false,
      tempLogoFileId: '',
      tempLoginBgFileId: '',
      ElIconPictureOutline
    }
  },
  components: {
    ElImageViewer,
    ElIconZoomIn,
    ElIconDelete,
    ElIconPlus
  },
  name: 'logo-upload',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tenantId: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handlePreview(type, isDefault = false) {
      if (type === FileType.logo) {
        this.viewerUrlList = [isDefault ? this.previewLogo : this.logoUrl]
      } else if (type === FileType.loginBg) {
        this.viewerUrlList = [isDefault ? this.previewLoginBg : this.loginBgUrl]
      }
      this.showViewer = true
    },
    handleRemove(type) {
      if (type === FileType.logo) {
        this.uploadForm.logo = ''
        this.logoUrl = ''
      } else if (type === FileType.loginBg) {
        this.uploadForm.loginBg = ''
        this.loginBgUrl = ''
      }
    },
    closeViewer() {
      this.viewerUrlList = []
      this.showViewer = false
    },
    dialogOpen() {
      this.getLogoInfo()
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.dialogVisible = false
      this.uploadForm = {
        logo: '',
        loginBg: ''
      }
      this.loginBgUrl = ''
      this.logoUrl = ''
      this.tempLogoFileId = ''
      this.tempLoginBgFileId = ''
    },
    async getLogoInfo() {
      const res = await this.$api.getUserLogo({
        userId: this.tenantId,
        netType: this.$getNetType()
      })
      if (res.resultCode === 0) {
        if (res.logoFileId) {
          this.uploadForm.logo = res.logoFileId
          this.tempLogoFileId = res.logoFileId
        }
        if (res.logo) {
          const logoBlob = await getBlob(res.logo)
          this.logoUrl = [await blobToBase64(logoBlob)]
        }
        if (res.loginBgFileId) {
          this.uploadForm.loginBg = res.loginBgFileId
          this.tempLoginBgFileId = res.loginBgFileId
        }
        if (res.loginBg) {
          const loginBgBlob = await getBlob(res.loginBg)
          this.loginBgUrl = [await blobToBase64(loginBgBlob)]
        }
      }
    },
    // 上传预处理
    beforeUpload(file, type) {
      let testType, testTypeMsg
      if (type === FileType.logo) {
        testType = /^image\/(png)$/.test(file.type)
        testTypeMsg = this.$t('logoUpload.imgFormatPrompt', { format: 'png' })
      } else if (type === FileType.loginBg) {
        testType = /^image\/(png)$/.test(file.type)
        testTypeMsg = this.$t('logoUpload.imgFormatPrompt', { format: 'png' })
      }
      let isLt4M = file.size / 1024 / 1024 < 4
      if (!testType) {
        this.$message.error(testTypeMsg)
      }
      if (!isLt4M) {
        this.$message.error(this.$t('logoUpload.imgSizePrompt') + ' 4MB')
      }
      if (testType && isLt4M) {
        this.uploadForm[type] = file
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          if (type === FileType.logo) {
            this.logoUrl = reader.result
          } else if (type === FileType.loginBg) {
            this.loginBgUrl = reader.result
          }
        }
      }
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    async handleSubmit() {
      const valid = await this.$refs.uploadForm.validate()
      if (!valid) return
      this.loading = true
      try {
        if (this.uploadForm.logo instanceof File) {
          const formData = new FormData()
          formData.append('file', this.uploadForm.logo)
          formData.append('api', '/api/udc/user/logo/set')
          formData.append('netType', this.$getNetType())
          const res = await this.$api.uploadFile(formData)
          if (res.resultCode === 0) {
            this.uploadForm.logo = res.fileId
          } else {
            return false
          }
        }
        if (this.uploadForm.loginBg instanceof File) {
          const formData = new FormData()
          formData.append('file', this.uploadForm.loginBg)
          formData.append('api', '/api/udc/user/logo/set')
          formData.append('netType', this.$getNetType())
          const res = await this.$api.uploadFile(formData)
          if (res.resultCode === 0) {
            this.uploadForm.loginBg = res.fileId
          } else {
            return false
          }
        }

        let formData = {
          userId: this.tenantId
        }
        if (this.tempLogoFileId === '') {
          // 未上传过
          if (this.uploadForm.logo !== '') {
            formData.logo = this.uploadForm.logo
          }
        } else {
          // 上传过
          if (this.uploadForm.logo === '') {
            formData.logo = ''
          } else if (this.uploadForm.logo !== this.tempLogoFileId) {
            formData.logo = this.uploadForm.logo
          }
        }
        if (this.tempLoginBgFileId === '') {
          // 未上传过
          if (this.uploadForm.loginBg !== '') {
            formData.loginBg = this.uploadForm.loginBg
          }
        } else {
          // 上传过
          if (this.uploadForm.loginBg === '') {
            formData.loginBg = ''
          } else if (this.uploadForm.loginBg !== this.tempLoginBgFileId) {
            formData.loginBg = this.uploadForm.loginBg
          }
        }

        const res = await this.$api.setUserLogo(formData)
        if (res.resultCode === 0) {
          this.$message.success(this.$t('public.uploadSuccess'))
          this.dialogClosed()
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
