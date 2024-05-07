<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale === 'en' ? '175px' : '100px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <el-form-item
        :label="(isPersonRepo ? $t('repo.personImg') : $t('repo.carImg')) + '：'"
        class="padding40"
      >
        <div class="image-uploader">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(file, index) in initialUploadFiles"
              :key="index"
              class="el-upload-list__item is-success"
            >
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="img-tips" v-if="file.photoState !== undefined">
                  <span :title="formatPhotoState(file.photoState)">
                    {{ formatPhotoState(file.photoState) }}
                  </span>
                </span>
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePicPreview(file, index)">
                    <el-icon><el-icon-zoom-in /></el-icon>
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </el-form-item>
      <!-- 目标布控库表单 -->
      <div class="form-flex" v-if="isPersonRepo">
        <div class="form-left">
          <el-form-item :label="$t('repo.fullName') + '：'" prop="name">
            <span>{{ form.name }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.birthday') + '：'" prop="bornTime">
            <span>{{ form.bornTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.country') + '：'" prop="country">
            <span>{{ form.country }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.nation') + '：'" prop="nationality">
            <span>{{ form.nationality }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.gender') + '：'" prop="gender">
            {{
              selectDictLabel(genderList, form.gender, {
                key: 'name',
                value: 'value'
              })
            }}
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('repo.age') + '：'" prop="age">
            <span>{{ form.age }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.phoneNum') + '：'" prop="phoneNum">
            <span>{{ form.phoneNum }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.occupation') + '：'" prop="occupation">
            <span>{{ form.occupation }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.IDType') + '：'" prop="credentialType">
            <span>
              {{
                selectDictLabel(credentialTypeList, form.credentialType, {
                  key: 'name',
                  value: 'value'
                })
              }}
            </span>
          </el-form-item>
          <el-form-item :label="$t('repo.IDNum') + '：'" prop="credentialNumber">
            <span>{{ form.credentialNumber }}</span>
          </el-form-item>
        </div>
      </div>
      <!-- 车辆布控库字段 -->
      <div v-else class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('repo.carOwnerName') + '：'" prop="ownerName">
            <span>{{ form.ownerName }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.license') + '：'" prop="lpn">
            <span>{{ form.lpn }}</span>
          </el-form-item>
          <el-form-item :label="$t('repo.carType') + '：'" prop="vehicleType">
            {{
              selectDictLabel(vehicleTypeList, form.vehicleType, {
                key: 'name',
                value: 'value'
              })
            }}
          </el-form-item>
          <el-form-item :label="$t('repo.carColor') + '：'" prop="vehicleColor">
            {{
              selectDictLabel(vehicleColorList, form.vehicleColor, {
                key: 'name',
                value: 'value'
              })
            }}
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('repo.brand') + '：'" prop="vehicleBrand">
            {{
              selectDictLabel(vehicleBrandList, form.vehicleBrand, {
                key: 'name',
                value: 'value'
              })
            }}
          </el-form-item>
          <el-form-item :label="$t('repo.carSub') + '：'" prop="vehicleSub">
            {{
              selectDictLabel(vehicleSubList, form.vehicleSub, {
                key: 'name',
                value: 'value'
              })
            }}
          </el-form-item>
          <el-form-item :label="$t('repo.yearType') + '：'" prop="vehicleYear">
            <span>{{ form.vehicleYear }}</span>
          </el-form-item>
        </div>
      </div>
      <el-form-item :label="$t('repo.remark') + '：'" class="padding40">
        <span>{{ form.remark }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.close') }}</el-button>
      </span>
    </template>

    <el-image-viewer
      v-if="showViewer"
      @close="closeViewer"
      :url-list="viewerUrlList"
      :initial-index="viewerIndex"
    ></el-image-viewer>
  </el-dialog>
</template>

<script>
import { ZoomIn as ElIconZoomIn } from '@element-plus/icons-vue'
import {
  genderList,
  repositoryType as RepositoryTypeEnum
} from '@views/center/algorithm/repository/constant'
import { mapActions, mapState } from 'vuex'
import ElImageViewer from 'element-plus'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
export default {
  components: {
    ElImageViewer,
    ElIconZoomIn
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person,
      required: true
    },
    objectId: {
      type: String,
      default: ''
    }
  },
  name: 'repository-item-detail',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      locale: localStorage.getItem('locale'),
      initialUploadFiles: [],
      vehicleSubList: [],
      genderList: genderList,
      showViewer: false,
      viewerIndex: 0
    }
  },
  computed: {
    ...mapState({
      credentialTypeList: state => state.dict['ars_credential_type'], //证件类型
      vehicleTypeList: state => state.dict['ars-vehicle-type'], //车辆类型
      vehicleColorList: state => state.dict['ars-vehicle-color'], //车辆颜色
      vehicleBrandList: state => state.dict['ars-vehicle-brand'], //车辆品牌
      photoStateOption: state => state.dict['ars-repo-picture-photoState'] //特征提取结果
    }),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    },
    dialogTitle() {
      if (this.isPersonRepo) {
        return this.$t('repo.viewPerson')
      } else {
        return this.$t('repo.viewCar')
      }
    },
    viewerUrlList() {
      return this.initialUploadFiles.map(item => item.url)
    }
  },
  methods: {
    //获取证件类型
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryLists() {
      if (this.isPersonRepo) {
        this.getSysDictData(['ars_credential_type', 'ars-repo-picture-photoState'])
      } else {
        this.getSysDictData([
          'ars-vehicle-type',
          'ars-vehicle-color',
          'ars-vehicle-brand',
          'ars-repo-picture-photoState'
        ])
      }
    },
    dialogOpen() {
      this.getDictionaryLists()
      if (this.objectId !== '') {
        this.getRepositoryItemInfo()
      }
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.resetForm()
      this.dialogVisible = false
    },
    async getRepositoryItemInfo() {
      try {
        const params = this.isPersonRepo
          ? { personId: this.objectId, netType: this.$getNetType() }
          : { vehicleId: this.objectId, netType: this.$getNetType() }
        const res =
          await this.$api[this.isPersonRepo ? 'getNewPersonInfo' : 'getNewVehicleInfo'](params)
        if (this.isPersonRepo) {
          let {
            name,
            phoneNum,
            credentialType,
            credentialNumber,
            age,
            gender,
            bornTime,
            country,
            nationality,
            occupation,
            remark,
            faceList = []
          } = res
          this.form = Object.assign({}, this.form, {
            name,
            phoneNum,
            credentialType,
            credentialNumber,
            age,
            gender,
            bornTime,
            country,
            nationality,
            occupation,
            remark
          })
          if (faceList.length > 0) {
            faceList.forEach(item => {
              this.initialUploadFiles.push({
                name: item.pictureId,
                tupleId: item.tupleId,
                photoState: item.photoState,
                url: handleGetPreview(item.photoPath)
              })
            })
          }
        } else {
          let {
            ownerName,
            lpn,
            vehicleColor,
            vehicleType,
            vehicleBrand,
            vehicleSub,
            vehicleYear,
            remark,
            vehiclePhotos = []
          } = res
          this.form = Object.assign({}, this.form, {
            ownerName,
            lpn,
            vehicleColor,
            vehicleType,
            vehicleBrand,
            vehicleSub,
            vehicleYear,
            remark
          })
          if (vehiclePhotos.length > 0) {
            vehiclePhotos.forEach(item => {
              this.initialUploadFiles.push({
                name: item.pictureId,
                tupleId: item.tupleId,
                photoState: item.photoState,
                url: handleGetPreview(item.photoPath)
              })
            })
          }
          if (vehicleBrand !== undefined) {
            const res = await this.$api.getDictionary({
              type: `ars-vehicle-sub-brand-${vehicleBrand}`
            })
            this.vehicleSubList = res.dictionaryList || []
          }
        }
      } catch (e) {
        this.dialogClosed()
      }
    },
    formatPhotoState(val) {
      return this.selectDictLabel(this.photoStateOption, String(val), {
        key: 'name',
        value: 'value'
      })
    },
    resetForm() {
      this.form = {
        name: undefined,
        bornTime: undefined,
        country: undefined,
        credentialType: undefined,
        credentialNumber: undefined,
        gender: undefined,
        nationality: undefined,
        occupation: undefined,
        age: undefined,
        phoneNum: undefined,
        ownerName: undefined,
        lpn: undefined,
        vehicleType: undefined,
        vehicleColor: undefined,
        vehicleBrand: undefined,
        vehicleSub: undefined,
        vehicleYear: undefined,
        remark: undefined
      }
      this.initialUploadFiles = []
      this.$nextTick(() => {
        this.$resetForm('form')
      })
    },
    handlePicPreview(file, index) {
      if (!file.url) {
        return
      }
      this.viewerIndex = index
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    padding: 15px 0 5px;
    .image-uploader {
      .el-upload.el-upload--picture-card {
        border: 1px dashed #d9d9d9;
        background: #ffffff;
        border-radius: 0;
        width: 100px;
        height: 100px;
        line-height: 100px;
        .image-uploader-icon {
          vertical-align: middle;
        }
      }
      .el-upload-list {
        .el-upload-list__item {
          border: 1px solid #d9d9d9;
          border-radius: 0;
          width: 100px;
          height: 100px;
        }
      }

      .img-tips {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 2px 3px;
        color: #fff;
        font-size: 12px;
        display: flex;
        justify-content: space-around;
        span {
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
