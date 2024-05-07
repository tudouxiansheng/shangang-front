<template>
  <div id="face-match-1v1" v-if="isRouterAlive" ref="faceMatch1v1">
    <el-form :model="searchForm" :rules="formRules" ref="searchForm">
      <el-row>
        <el-col :span="4">
          <el-form-item prop="algorithmCode">
            <el-select
              v-model="searchForm.algorithmCode"
              :placeholder="$t('retrieval.chooseAlgorithmCode')"
            >
              <el-option
                v-for="item in algorithmList"
                :key="item.algorithmId"
                :label="item.algorithmName"
                :value="item.algorithmId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="upload-image">
        <el-form-item prop="image1.file">
          <photo-cropper
            ref="photoCropper1"
            v-model:src="uploadImageSrc1"
            accept=".jpeg,.png,.jpg,.bmp"
            :options="cropperOptions"
            :before-selected="beforeSelected"
            @change="getFileInfo1"
            api="/api/ars/intelligent-app/facematch/1v1"
          />
        </el-form-item>
        <echart id="match-result" :options="getOption()">1</echart>
        <el-form-item prop="image2.file">
          <photo-cropper
            ref="photoCropper2"
            v-model:src="uploadImageSrc2"
            accept=".jpeg,.png,.jpg,.bmp"
            :options="cropperOptions"
            :before-selected="beforeSelected"
            @change="getFileInfo2"
            api="/api/ars/intelligent-app/facematch/1v1"
          />
        </el-form-item>
      </div>
      <div class="text-center">
        <el-button type="info" @click="resetHandle" :disabled="loading">
          {{ $t('public.reset') }}
        </el-button>
        <el-button class="confirm-button" type="primary" :loading="loading" @click="confirmHandle">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import PhotoCropper from '@/components/photo-cropper'
import echart from '@/components/echart'

export default {
  name: 'TargetMatch1v1',
  components: {
    PhotoCropper,
    echart
  },
  data() {
    return {
      isRouterAlive: true,
      paramsObj: {
        algorithmType: 'FACE_RECOGNIZE',
        pageInfo: { pageNum: 1, pageSize: 500 },
        netType: this.$getNetType()
      },
      algorithmList: [],
      searchForm: {
        algorithmCode: undefined,
        image1: {
          file: undefined
        },
        image2: {
          file: undefined
        }
      },
      uploadImageSrc1: '',
      uploadImageSrc2: '',
      cropperOptions: { canMove: false, centerBox: true },
      similarity: 0,
      formRules: {
        algorithmCode: {
          required: true,
          message: this.$t('retrieval.chooseAlgorithmCode'),
          trigger: 'change'
        }
      },
      loading: false
    }
  },

  created() {
    this.getNewAlgorithmList()
  },

  methods: {
    async getNewAlgorithmList() {
      let res = await this.$api.queryNewAlgorithmList(this.paramsObj)
      if (res.resultCode === 0) this.algorithmList = res.algorithmList
      if (this.algorithmList.length > 0)
        this.searchForm.algorithmCode = this.algorithmList[0].algorithmId
    },
    beforeSelected(file) {
      const testType = /^image\/(jpeg|png|jpg|bmp)$/.test(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!testType) {
        this.$message.error(this.$t('logoUpload.imgFormatPrompt', { format: 'jpg/png/bmp' }))
      }
      if (!isLt5M) {
        this.$message.error(this.$t('retrieval.imgSizePrompt') + ' 5MB')
      }
      return testType && isLt5M
    },
    getFileInfo1(arr) {
      this.searchForm.image1.file = arr[0]
    },
    getFileInfo2(arr) {
      this.searchForm.image2.file = arr[0]
    },
    getOption() {
      let colorList = ['#3085CB', '#1F3046']
      return {
        title: {
          text: '{val|' + this.similarity + '}{percent|' + ' %}',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#3085CB',
            rich: {
              val: {
                fontSize: 40
              },
              percent: {
                fontSize: 20
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '60%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            data: [
              {
                name: this.$t('retrieval.similarity1'),
                value: this.similarity
              },
              {
                name: this.$t('retrieval.differences'),
                value: 100 - this.similarity
              }
            ]
          }
        ]
      }
    },
    confirmHandle() {
      this.$refs['searchForm'].validate(async valid => {
        if (valid) {
          let queryParams = this.$loadash.cloneDeep(this.searchForm)
          if (queryParams.image1.file && queryParams.image2.file) {
            const handleImage = async item => {
              let formData = new FormData()
              formData.append('file', item)
              formData.append('api', '/api/ars/intelligent-app/facematch/1v1')
              formData.append('netType', this.$getNetType())
              try {
                let res = await this.$api.uploadFileTemporary(formData)
                if (res.resultCode === 0) {
                  return res.fileId
                }
              } catch (error) {
                throw new Error(error)
              }
            }
            this.loading = true
            try {
              queryParams.image1.fileId = await handleImage(queryParams.image1.file)
              delete queryParams.image1.file
              queryParams.image2.fileId = await handleImage(queryParams.image2.file)
              delete queryParams.image2.file
              let res = await this.$api.getFaceMatch1v1(queryParams)
              if (res.resultCode === 0) this.similarity = res.similarity
            } catch (e) {
              this.$message.error(this.$t('photoCropper.uploadFail'))
            } finally {
              this.loading = false
            }
          } else {
            this.$alert(this.$t('retrieval.chooseImage'), this.$t('public.prompt'), {
              confirmButtonText: this.$t('public.confirm'),
              type: 'warning'
            })
          }
        }
      })
    },

    resetHandle() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.image1.file = undefined
      this.searchForm.image2.file = undefined
      this.$refs.photoCropper1.reset()
      this.$refs.photoCropper2.reset()
      this.similarity = 0
    }
  }
}
</script>

<style lang="scss">
#face-match-1v1 {
  padding: 20px;
  .el-select {
    width: 100%;
  }
  .upload-image {
    display: flex;
    margin: 10% auto;
    height: 350px;
    photo-cropper {
      height: 100%;
    }
    div {
      flex: 1.6;
    }
    .cropper_wrapper {
      height: 100%;
      max-height: 500px;
      .image-uploader {
        height: 100%;
      }
    }
    #match-result {
      flex: 1;
      margin: auto 20px;
      height: 100%;
    }
  }
  .el-form-item__content {
    height: 100%;
  }
  .confirm-button {
    margin-left: 40px;
  }
}
</style>
