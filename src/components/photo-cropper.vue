<template>
  <div class="cropper_wrapper">
    <template v-if="multiple">
      <div v-if="imageSrc.length === 0" class="multiple-uploader-content-empty">
        <div class="multiple-uploader-empty" @click="editCropper()">
          <svg-icon icon-class="upload-cloud" />
          <span>{{ $t('photoCropper.import') }}</span>
        </div>
        <p>{{ $t('photoCropper.uploadPrompt', { num: max }) }}</p>
      </div>
      <ul v-else class="grid grid-cols-4 gap-4 upload-list">
        <li class="upload-list__item" v-if="imageSrc.length < max">
          <div class="multiple-uploader-empty" @click="editCropper()">
            <svg-icon icon-class="upload-cloud" />
            <span>{{ $t('photoCropper.import') }}</span>
          </div>
        </li>
        <li class="upload-list__item" v-for="(item, index) in imageSrc" :key="index">
          <img
            v-if="previewSrcMap[index]"
            :src="previewSrcMap[index]"
            alt="上传图片"
            class="upload-list__item-thumbnail"
          />
          <span class="upload-list__item-actions">
            <span class="upload-list__item-delete" @click="removeImage(index)">
              <el-icon><el-icon-delete /></el-icon>
            </span>
          </span>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="image-uploader" @click="editCropper()">
        <img
          v-if="imageSrc && previewSrcMap[0]"
          :src="previewSrcMap[0]"
          class="image-preview"
          alt="上传图片"
        />
        <div class="image-uploader-empty" v-else>
          <img src="@/assets/img/common/image-uploader-empty.png" alt="图片" />
          <el-button type="primary" size="small">{{ $t('photoCropper.selectPicture') }}</el-button>
        </div>
      </div>
    </template>

    <el-dialog
      ref="cropperDialog"
      :title="title"
      v-model="open"
      top="10vh"
      width="800px"
      :close-on-click-modal="false"
      :modal="false"
      @opened="modalOpened"
      @close="closeDialog"
    >
      <div
        v-loading="loading"
        :element-loading-text="$t('photoCropper.uploading')"
        
      >
        <el-row style="padding-bottom: 20px">
          <el-col :span="2">
            <el-upload
              action="#"
              :accept="accept"
              :http-request="requestUpload"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button size="small">
                {{ $t('photoCropper.select') }}
                <el-icon class="el-icon--right"><el-icon-upload /></el-icon>
              </el-button>
            </el-upload>
          </el-col>
          <el-col :span="2" :offset="2">
            <el-button :icon="ElIconPlus" size="small" @click="changeScale(2)"></el-button>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button :icon="ElIconMinus" size="small" @click="changeScale(-2)"></el-button>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button :icon="ElIconRefreshLeft" size="small" @click="rotateLeft()"></el-button>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button :icon="ElIconRefreshRight" size="small" @click="rotateRight()"></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :style="{ height: '350px' }">
            <vue-cropper
              ref="cropper"
              :img="cropperImg"
              :outputSize="option.outputSize"
              :outputType="option.outputType"
              :info="option.info"
              :canScale="option.canScale"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :full="option.full"
              :fixedBox="option.fixedBox"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :centerBox="option.centerBox"
              :high="option.high"
              :infoTrue="option.infoTrue"
              :maxImgSize="option.maxImgSize"
              :enlarge="option.enlarge"
              :mode="option.mode"
            />
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="uploadImg">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Delete as ElIconDelete,
  Upload as ElIconUpload,
  Plus as ElIconPlus,
  Minus as ElIconMinus,
  RefreshLeft as ElIconRefreshLeft,
  RefreshRight as ElIconRefreshRight
} from '@element-plus/icons-vue'
import VueCropper from 'vue-cropper/src/vue-cropper.vue'
import { getBlob, blobToBase64, getBlobByGET } from '@/utils/common/download'

export default {
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 裁剪图片的地址
      cropperImg: '',
      previews: {},
      currentFile: null,
      currType: '',
      currName: '',
      defaultOptions: {
        img: null,
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        info: true, // 裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: false, // 是否默认生成截图框
        autoCropWidth: '80%', // 默认生成截图框宽度
        autoCropHeight: '80%', // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        fixedBox: false, // 固定截图框大小 不允许改变
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        high: true, // 是否按照设备的dpr 输出等比例图片
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        maxImgSize: 5000, // 限制图片最大宽度和高度 0 ~ max
        enlarge: 1, // 图片根据截图框输出比例倍数 0 ~ max(建议不要太大不然会卡死的呢)
        mode: 'contain' // contain , cover, 100px, 100% auto
      },
      loading: false,
      files: [],
      previewSrcMap: [],
      ElIconPlus,
      ElIconMinus,
      ElIconRefreshLeft,
      ElIconRefreshRight
    }
  },
  components: {
    VueCropper,
    ElIconDelete,
    ElIconUpload
  },
  name: 'PhotoCropper',
  props: {
    // 弹出层标题
    title: {
      type: String,
      default: this.$t('photoCropper.uploadPic')
    },
    // 过滤格式
    accept: {
      type: String,
      default: ''
    },
    // 图片预览地址
    src: {
      type: [String, Array, File]
    },
    disable: {
      type: Boolean,
      default: false
    },
    // 配置项
    options: {
      type: Object,
      default: () => {}
    },
    upload: {
      type: Boolean,
      default: false
    },
    beforeSelected: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    max: {
      type: Number,
      default: 20
    },
    api: {
      type: String,
      default: ''
    }
  },
  computed: {
    imageSrc: {
      get: function () {
        this.getImgUrl()
        return this.src
      },
      set: function (val) {
        this.$emit('update:src', val)
      }
    },
    option() {
      return { ...this.defaultOptions, ...this.options }
    },
    multiple() {
      return Array.isArray(this.src)
    }
  },
  methods: {
    // 打开弹窗
    editCropper() {
      !this.disable && (this.open = true)
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      if (!this.multiple) {
        this.cropperImg = this.imageSrc ? this.previewSrcMap[0] : ''
      }
      this.visible = true
      if (!this.option.autoCrop && this.cropperImg) {
        this.$refs.cropper.startCrop()
      }
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload(file) {
      if (!this.beforeSelected) {
        return this.afterSelected(file)
      }

      const before = this.beforeSelected(file)

      if (before !== false) {
        this.afterSelected(file)
      } else {
        this.currentFile = null
        this.currType = ''
        this.currName = ''
      }
    },
    afterSelected(file) {
      this.currentFile = file
      this.currType = file.type
      this.currName = file.name.substring(0, file.name.lastIndexOf('.'))
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.cropperImg = reader.result
        if (!this.option.autoCrop && this.cropperImg) {
          this.$refs.cropper.startCrop()
        }
      }
    },
    // 确定图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(async data => {
        const cropBox = this.$refs.cropper.$el.querySelector('.cropper-crop-box')
        let file
        if (cropBox.style.display === 'none') {
          file = this.currentFile
        } else {
          file = new File([data], `${this.currName}.png`, { type: data.type })
        }
        if (!this.upload) {
          if (this.multiple) {
            this.imageSrc.push(file)
            this.files.push(file)
          } else {
            this.imageSrc = file
            this.files = [file]
          }
          this.$emit('change', this.files)
          this.open = false
          this.visible = false
        } else {
          this.loading = true
          let formData = new FormData()
          formData.append('file', file)
          formData.append('api', this.api)
          formData.append('netType', this.$getNetType())
          try {
            const res = await this.$api.uploadFileTemporary(formData)
            if (res.resultCode === 0) {
              const res2 = await this.$api.getDownloadUrl({
                fileId: res.fileId,
                netType: this.$getNetType()
              })
              if (res2.resultCode === 0) {
                if (this.multiple) {
                  this.imageSrc.push(res2.downloadUrl)
                  this.files.push({
                    fileId: res.fileId,
                    downloadUrl: res2.downloadUrl
                  })
                } else {
                  this.imageSrc = res2.downloadUrl
                  this.files = [
                    {
                      fileId: res.fileId,
                      downloadUrl: res2.downloadUrl
                    }
                  ]
                }

                this.$emit('change', this.files)
              }
            }
          } catch (e) {
            this.$message({
              showClose: true,
              message: `${this.$t('photoCropper.uploadFail')}`,
              type: 'error'
            })
          } finally {
            this.loading = false
            this.open = false
            this.visible = false
          }
        }
      })
    },
    removeImage(index) {
      this.imageSrc.splice(index, 1)
      this.files.splice(index, 1)
      this.previewSrcMap.splice(index, 1)
      this.$emit('change', this.files)
    },
    // 关闭窗口
    closeDialog() {
      this.open = false
      this.cropperImg = ''
      this.visible = false
    },
    async getImgUrl() {
      if (!this.multiple) {
        if (this.src) {
          let blob
          if (this.src instanceof File) {
            blob = this.src
          } else if (this.src.includes('mp_mcss')) {
            blob = await getBlobByGET(this.src)
          } else {
            blob = await getBlob(this.src)
          }
          this.previewSrcMap = [await blobToBase64(blob)]
        } else {
          this.previewSrcMap = []
        }
      } else {
        if (!this.src.length) {
          this.previewSrcMap = []
          return
        }
        for (const item of this.src) {
          const index = this.src.indexOf(item)
          if (!this.previewSrcMap[index]) {
            let blob
            if (item instanceof File) {
              blob = item
            } else if (item.includes('mp_mcss')) {
              blob = await getBlobByGET(item)
            } else {
              blob = await getBlob(item)
            }
            this.previewSrcMap.push(await blobToBase64(blob))
          }
        }
      }
    },
    reset() {
      this.files = []
      this.imageSrc = this.multiple ? [] : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper_wrapper {
  display: flex;
  max-height: 255px;
  overflow-y: auto;
}

.image-uploader {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.image-uploader:hover {
  border-color: #2c6dd2;
}

.image-uploader-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-uploader-icon {
  font-size: 28px;
  color: #ffffff;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

:deep(.el-dialog__body) {
  max-height: initial;
  padding: 0 20px 20px;
}

.image-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}

.multiple-uploader-content-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .multiple-uploader-empty {
    width: 160px;
    height: 80px;
    background: #174060;
    border: 1px dashed #4396d6;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 50px 0;
    user-select: none;
    &:hover {
      border-color: lighten(#4396d6, 10%);
    }
    &:active {
      border-color: darken(#4396d6, 10%);
    }
  }
  .svg-icon {
    width: 32px;
    height: 32px;
    color: #10a9ff;
    margin-right: 12px;
  }
}

.upload-list {
  flex: 1;
  .upload-list__item {
    position: relative;
    height: 120px;
    img {
      width: 100%;
      height: 100%;
    }
    .multiple-uploader-empty {
      height: 100%;
      background: #174060;
      border: 1px dashed #4396d6;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      &:hover {
        border-color: lighten(#4396d6, 10%);
      }
      &:active {
        border-color: darken(#4396d6, 10%);
      }
    }
    .svg-icon {
      width: 32px;
      height: 32px;
      color: #10a9ff;
    }

    .upload-list__item-actions {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      &:after {
        display: inline-block;
        content: '';
        height: 100%;
        vertical-align: middle;
      }

      & span {
        display: none;
        cursor: pointer;
      }

      & span + span {
        margin-left: 15px;
      }

      &:hover {
        opacity: 1;
      }
      &:hover span {
        display: inline-block;
      }
    }
  }
}
</style>
