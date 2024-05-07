<template>
  <el-dialog
    :title="$t('retrieval.retrievalDetails')"
    v-model="dialogVisible"
    top="10vh"
    width="1240px"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    draggable
    class="result_dialog"
  >
    <div class="result_container" v-if="dialogVisible">
      <el-row :gutter="20" class="picture_container">
        <el-col :span="16">
          <el-image class="capture_image" fit="fill" :src="data.pictureInfo.picUrl"></el-image>
        </el-col>
        <el-col :span="8">
          <div class="result_info_wrapper">
            <div class="result_info__header">
              <div class="result_info__title">
                {{ $t('retrieval.resultPicture') }}
              </div>
            </div>
            <div class="result_info__body">
              <div class="result_pic_wrapper">
                <div class="result_pic_item" v-if="searchMode === 'picture' && searchImageSrc">
                  <el-image
                    fit="fill"
                    :src="searchImageSrc"
                    :preview-src-list="[searchImageSrc]"
                  ></el-image>
                  <span>{{ $t('retrieval.retrievalPicture') }}</span>
                </div>
                <div class="result_pic_item">
                  <el-image
                    fit="fill"
                    :src="data.pictureInfo.thumPicUrl"
                    :preview-src-list="[data.pictureInfo.thumPicUrl]"
                  ></el-image>
                  <span>{{ $t('retrieval.resultPicture') }}</span>
                </div>
                <span class="dconfidence" v-if="searchMode === 'picture'">
                  {{ parseFloat(data.pictureInfo.dconfidence).toFixed(2) + '%' }}
                </span>
              </div>
              <div class="result_btn_wrapper">
                <el-button type="primary" @click="goToRepository">
                  {{ $t('retrieval.addToRepository') }}
                </el-button>
                <el-button type="primary" @click="handleSearchImage">
                  {{
                    dataType === applicationType.vehicle
                      ? $t('retrieval.vehicleRetrieval')
                      : $t('retrieval.faceRetrieval')
                  }}
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="result_info_wrapper">
        <div class="result_info__header">
          <div class="result_info__title">
            {{ $t('retrieval.captureInfo') }}
          </div>
        </div>
        <div class="result_info__body">
          <el-row>
            <el-col :span="12">
              <div :class="['result_info__item', locale === 'en' ? 'isEng' : '']">
                <label>{{ $t('retrieval.captureTime') }}:</label>
                <span>{{ formatTime(data.deviceInfo.recordTime) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div :class="['result_info__item', locale === 'en' ? 'isEng' : '']">
                <label>{{ $t('retrieval.cameraName') }}:</label>
                <span>{{ data.deviceInfo.cameraName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="dataType === applicationType.vehicle" :span="12">
              <div :class="['result_info__item', locale === 'en' ? 'isEng' : '']">
                <label>{{ $t('retrieval.capturePnr') }}:</label>
                <span>{{ data.attributes.lprInfo.plateNumber }}</span>
              </div>
            </el-col>
            <el-col v-if="dataType === applicationType.person" :span="12">
              <div :class="['result_info__item', locale === 'en' ? 'isEng' : '']">
                <label>{{ $t('retrieval.quality1') }}:</label>
                <span>{{ data.pictureInfo.quality }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div
        class="result_info_wrapper"
        v-if="!(dataType === applicationType.person && locale === 'en')"
      >
        <div class="result_info__header">
          <div class="result_info__title">
            {{
              dataType === applicationType.vehicle
                ? $t('retrieval.vehicleAttribute')
                : $t('retrieval.portraitAttribute')
            }}
          </div>
        </div>
        <div class="result_info__body">
          <div class="result_tag_wrapper" v-if="attributeTags.length > 0">
            <el-tag v-for="(item, index) in attributeTags" :key="index">
              {{ `${item.title}-${item.value}` }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ApplicationType, AttributesDictMap, AttributesTitleMap } from '../../constant'
import { blobToBase64, getBlob } from '@/utils/common/download'

export default {
  name: 'RetrievalDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    // picture condition
    searchMode: {
      type: String
    },
    searchImage: {
      type: [String, File]
    },
    dataType: {
      type: Number,
      default: ApplicationType.vehicle
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      attributeTags: [],
      applicationType: ApplicationType,
      searchImageSrc: ''
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
    async dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
      this.attributeTags = this.generateAttributeTag()
      if (this.searchMode === 'picture' && this.searchImage) {
        try {
          let blob
          if (this.searchImage instanceof File) {
            blob = this.searchImage
          } else {
            blob = await getBlob(this.searchImage)
          }
          this.searchImageSrc = await blobToBase64(blob)
        } catch (error) {
          this.searchImageSrc = ''
        }
      }
    },
    formatTime(timeStamp) {
      return this.dayjs(parseInt(timeStamp)).format('YYYY-MM-DD HH:mm:ss')
    },
    generateAttributeTag() {
      const { attributes } = this.data
      if (this.locale === 'en') {
        attributes.carColor = attributes?.lprInfo?.carColor || '-1'
      }
      let attributeTags = []
      for (let key in attributes) {
        if (!AttributesDictMap[key]) {
          continue
        }
        const dict = this.$parent[AttributesDictMap[key]]
        let value = ''
        if (Array.isArray(attributes[key])) {
          value = this.selectDictLabels(dict, attributes[key].join(','), ',', {
            key: 'name',
            value: 'value'
          })
        } else {
          value = this.selectDictLabel(dict, attributes[key], {
            key: 'name',
            value: 'value'
          })
        }

        const title = AttributesTitleMap[key]
        if (value && title) {
          attributeTags.push({
            title,
            value
          })
        }
      }
      return attributeTags
    },
    handleSearchImage() {
      if (
        this.dataType === this.applicationType.vehicle &&
        this.locale == 'en' &&
        !this?.data?.attributes?.lprInfo?.plateNumber
      ) {
        this.$message.warning(this.$t('retrieval.noPlateNumber'))
        return
      }
      this.$emit('search', this.data)
      this.dialogVisible = false
    },
    // 添加至布控库
    goToRepository() {
      this.$emit('toRepository', this.data)
      this.dialogVisible = false
    }
  }
}
</script>
