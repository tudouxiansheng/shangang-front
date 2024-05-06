<template>
  <div class="person-search-main">
    <div class="search-form">
      <div class="upload">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          ref="upload"
          :show-file-list="false"
          :limit="1"
          :before-upload="handleBeforeUpload"
          :on-success="handleAvatarSuccess"
          accept="image/*"
        >
          <img class="avatar-img" v-if="imageUrl" :src="imageUrl" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="tips" v-if="!imageUrl">{{ $t('public.upload') }}</div>
        </el-upload>
      </div>
      <el-form :model="queryForm">
        <el-form-item :label="$t('public.period')">
          <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
            <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
            <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
            <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>

            <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :picker-options="pickerOptions"
            @change="handleChangeDate"
            :editable="false"
            v-model="queryForm.beginTime"
            type="datetime"
            :placeholder="$t('public.startTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.endTime')">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            @change="handleChangeDate"
            :editable="false"
            v-model="queryForm.endTime"
            type="datetime"
            :placeholder="$t('public.endTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.camera')">
          <el-radio-group v-model="queryForm.type">
            <el-radio :label="1">{{ $t('public.all') }}</el-radio>
            <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('public.camera')" v-if="queryForm.type == 2">
          <el-input readonly :placeholder="placeholder" @click.native="handleClickCamera">
            <img slot="suffix" src="../../images/tree.png" class="tree-img" />
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('public.similarity')">
          <el-slider :min="60" v-model="queryForm.threshold" show-input> </el-slider>
        </el-form-item>
        <!--        <el-form-item :label="$t('public.quality')">-->
        <!--          <el-slider v-model="queryForm.picValue" show-input> </el-slider>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <div class="btn-group">
      <el-button type="primary" class="btnPrimary" @click="handleSearch">{{ $t('public.search') }}</el-button>
      <el-button type="default" class="btnPrimary btnReset" @click="handleReset">{{ $t('public.reset') }}</el-button>
    </div>
    <choseCamera
      v-if="choseCameraDialog"
      @close="handleCloseChoseCamera"
      :choseDeviceList="choseDeviceList"
    ></choseCamera>
  </div>
</template>

<script>
import intelligentMixin from '../../mixin/intelligentMixin'
import { getUploadUrl, facesearchByImage, faceTrack } from '../../../../../../utils/api'
import { DateDiff } from '@/utils/mutil'
import choseCamera from '../../components/chose-camera'
export default {
  name: 'person-by-image',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mixins: [intelligentMixin],
  components: { choseCamera },
  watch: {
    item: {
      handler(val) {
        console.log(val)
        if (val.detectUrl) {
          this.imageUrl = val.detectUrl
          // this.queryForm.image.fileId = this.imageUrl
          //   .slice(0, this.imageUrl.indexOf('?'))
          //   .slice(
          //     this.imageUrl.slice(0, this.imageUrl.indexOf('?')).lastIndexOf('/') + 1,
          //     this.imageUrl.slice(0, this.imageUrl.indexOf('?')).lastIndexOf('.')
          //   )
          this.queryForm.image.url = this.imageUrl
        } else {
          this.$set(this.queryForm, 'image', {
            url: '',
            fileId: '',
          })

          this.imageUrl = ''
          this.placeholder = this.$t('public.selectCamera')
          this.uploadUrl = ''
          this.choseDeviceList = []
          this.cameraNum = 0
          this.timeType = 3
          this.handleChangeQuickDateTime()
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      showLeftBox: false,
      choseCameraDialog: false,
      queryForm: {
        type: 1,
        threshold: 90,
        image: {
          url: '',
          fileId: '',
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 500,
        },
      },
      listQuery: {
        pageNum: 1,
        pageSize: 12,
      },
      placeholder: this.$t('public.selectCamera'),
      uploadUrl: '',
      choseDeviceList: [],
      cameraNum: 0,
      tableData: [],
      total: 0,
      trackInfos: [],
      aggregationInfos: [],
      polyline: null,
      track: null,
      map: null,
      marker: [],
    }
  },
  beforeDestroy() {
    this.$route.params = {}
  },
  mounted() {},
  methods: {
    handleOpenTrack(data) {
      this.handleClearTrack()
      let params = {
        ...data,
        pageInfo: { pageNum: 1, pageSize: 500 },
      }
      delete params.type
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      faceTrack(params)
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            if (res.resultList && res.resultList.length) {
              let result = res.resultList
              let aggregationInfos = res.aggregationInfos
              this.$emit('open-track', result, aggregationInfos, 0)
            } else {
              this.$emit('open-track', [], [])
              this.$message.warning(this.$t('public.noData'))
            }
          } else {
            this.$emit('open-track', [], [])
          }
        })
        .catch(() => {
          this.$emit('open-track', [], [])
          loading.close()
        })
    },
    handleCloseChoseCamera(cameraNum, cameraList) {
      // console.log(cameraNum, cameraList)
      this.cameraNum = cameraNum
      this.placeholder = this.$t('public.placeholder', { num: cameraNum })
      this.choseDeviceList = cameraList

      this.choseCameraDialog = false
    },
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.choseCameraDialog = true
    },
    // 检查文件名称长度是否小于64,
    checkFileLength(name, n = 64) {
      let inLength = false
      if (name) {
        // 处理文件名中存在多个点
        let nameArr = name.split('.')
        nameArr.pop()
        let nameStr = nameArr.join('')
        if (nameStr.length <= 64) {
          inLength = true
        } else {
          this.$message.warning(this.$t('tips.fileName'))
        }
      }
      return inLength
    },
    async handleBeforeUpload(file) {
      let types = ['jpg', 'jpeg', 'png']
      let size = file.size / 1024 / 1024 <= 5
      if (types.indexOf(file.type.split('/')[1]) == -1) {
        this.$message.warning(this.$t('tips.format'))
        return false
      }
      if (!size) {
        this.$message.warning(this.$t('tips.max', { size: 5 }))
        return false
      }
      if (!this.checkFileLength(file.name)) return
      // 获取图片上传地址
      let res = await getUploadUrl({})
      if (res.resultCode === 0) {
        this.uploadUrl = res.uploadUrl
      }
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      if (res.resultCode === 0) {
        this.queryForm.image.fileId = res.fileId
        this.imageUrl = URL.createObjectURL(file.raw)
        this.queryForm.image.url = this.imageUrl
        this.$refs.upload.clearFiles()
      }
    },

    handleSearch() {
      if (!this.queryForm.beginTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (!this.queryForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (new Date(this.queryForm.endTime).getTime() > new Date().getTime()) {
        this.$message.warning(this.$t('public.endGtCur'))
        return
      }
      if (new Date(this.queryForm.beginTime).getTime() > new Date(this.queryForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      if (DateDiff(this.queryForm.beginTime, this.queryForm.endTime) > 6) {
        this.$message.warning(this.$t('public.gt7'))
        return
      }
      if (this.queryForm.type == 2) {
        this.queryForm.cameraList = this.choseDeviceList.map((item) => item.id)
        if (!this.queryForm.cameraList.length) {
          this.$message.warning(`${this.$t('public.please')}${this.$t('public.camera')}`)
          return
        }
      } else {
        this.queryForm.cameraList = []
      }

      if (!this.queryForm.image.url) {
        this.$message.warning(this.$t('public.pleaseUpload'))
        return
      }
      this.handleOpenTrack(this.queryForm)
    },
    handleReset() {
      this.queryForm = {
        type: 1,
        threshold: 90,
        beginTime: '',
        endTime: '',
        image: {
          url: '',
          fileId: '',
        },
      }
      this.imageUrl = ''
      this.placeholder = this.$t('public.selectCamera')
      this.uploadUrl = ''
      this.choseDeviceList = []
      this.cameraNum = 0
      this.timeType = 3
      this.handleChangeQuickDateTime()
      this.handleClearTrack()
      this.showResultDialog = false
      this.timelineVisible = false
      this.$emit('reset')
    },
    getPlayState(val) {
      this.$emit('setPlayState', val)
    },
  },
}
</script>

<style scoped lang="scss">
.person-search-main {
  width: 100%;
  height: calc(100% - 30px);
  position: relative;
  .search-form {
    padding: 0 20px;
    box-sizing: border-box;
    height: calc(100% - 80px);
    overflow: auto;
  }
  .upload {
    width: 146px;
    height: 146px;
    margin: 30px auto;
    .avatar-uploader .avatar-uploader-icon {
      height: 80px;
      color: white;
      line-height: 106px;
      font-weight: 700;
    }
    .avatar-uploader {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader img {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader .tips {
      height: 70px;
      font-size: 14px;
    }
  }
  .btn-group {
    display: flex;
    width: 300px;
    margin: 0 auto;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    .btn {
      flex: 1;
    }
    .checkleft {
      margin-right: 20px;
    }
    .btnPrimary {
      width: 100%;
      height: 40px;
      //background: #00ccff;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      &.btnReset {
        color: #333;
        //background-color: #ccc;
      }
    }
  }
  .tree-img {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 5px;
    top: 6px;
  }
}
</style>
