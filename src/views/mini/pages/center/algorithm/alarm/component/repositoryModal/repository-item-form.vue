<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    top="10vh"
    width="1350px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      class="form"
      :model="form"
      :label-width="locale === 'en' ? '175px' : '100px'"
      :rules="rules"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <el-form-item
        :label="(isPersonRepo ? $t('repo.personImg') : $t('repo.carImg')) + '：'"
        class="padding40"
        required
      >
        <img
          class="el-upload-list__item-thumbnail"
          :src="cuType == 4 ? previewImage : image"
          alt=""
        />
      </el-form-item>
      <!-- 目标布控库表单 -->
      <div class="form-flex" v-if="isPersonRepo">
        <div class="form-left">
          <el-form-item
            :label="$t('repo.fullName') + '：'"
            prop="name"
            :class="locale === 'en' && 'popover-error'"
          >
            <el-input
              v-model="form.name"
              :placeholder="$t('repo.inputFullName')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.birthday') + '：'" prop="bornTime">
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="form.bornTime"
              type="date"
              :placeholder="$t('alarmList.selectTime')"
              size="medium"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('repo.country') + '：'" prop="country">
            <el-input
              v-model="form.country"
              :placeholder="$t('repo.inputCountry')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.nation') + '：'" prop="nationality">
            <el-input
              v-model="form.nationality"
              :placeholder="$t('repo.inputNation')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.gender') + '：'" prop="gender">
            <el-select v-model="form.gender" clearable :placeholder="$t('repo.selectGender')">
              <el-option
                v-for="(item, index) in genderList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('repo.age') + '：'" prop="age">
            <el-input
              v-model.number="form.age"
              maxlength="3"
              :placeholder="$t('repo.inputAge')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.phoneNum') + '：'" prop="phoneNum">
            <el-input
              v-model="form.phoneNum"
              :placeholder="$t('repo.inputPhoneNum')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.occupation') + '：'" prop="occupation">
            <el-input
              v-model="form.occupation"
              :placeholder="$t('repo.inputOccupation')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.IDType') + '：'" prop="credentialType">
            <el-select
              v-model="form.credentialType"
              clearable
              :placeholder="$t('repo.selectIDType')"
            >
              <el-option
                v-for="(item, index) in credentialTypeList"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('repo.IDNum') + '：'" prop="credentialNumber">
            <el-input
              v-model="form.credentialNumber"
              :placeholder="$t('repo.inputIDNum')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 车辆布控库字段 -->
      <div v-else class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('repo.carOwnerName') + '：'"
            prop="ownerName"
            :class="locale === 'en' && 'popover-error'"
          >
            <el-input
              v-model="form.ownerName"
              :placeholder="$t('repo.inputCarOwnerName')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.license') + '：'" prop="lpn">
            <el-input
              v-model="form.lpn"
              :placeholder="$t('repo.inputLicense')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('repo.carType') + '：'" prop="vehicleType">
            <el-select v-model="form.vehicleType" clearable :placeholder="$t('repo.selectCarType')">
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('repo.carColor') + '：'" prop="vehicleColor">
            <el-select
              v-model="form.vehicleColor"
              clearable
              :placeholder="$t('repo.selectCarColor')"
            >
              <el-option
                v-for="(item, index) in vehicleColorList"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('repo.brand') + '：'" prop="vehicleBrand">
            <el-select
              v-model="form.vehicleBrand"
              :placeholder="$t('repo.selectBrand')"
              @change="handleBrandChange"
              clearable
            >
              <el-option
                v-for="(item, index) in vehicleBrandList"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('repo.carSub') + '：'" prop="vehicleSub">
            <el-select
              v-model="form.vehicleSub"
              :disabled="!vehicleSubList.length"
              :placeholder="$t('repo.selectCarSub')"
              clearable
            >
              <el-option
                v-for="(item, index) in vehicleSubList"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('repo.yearType') + '：'" prop="vehicleYear">
            <el-input
              v-model="form.vehicleYear"
              :placeholder="$t('repo.inputYearType')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item :label="$t('repo.remark') + '：'" class="padding40">
        <el-input
          v-model="form.remark"
          :placeholder="$t('repo.inputRemark')"
          type="textarea"
          maxlength="256"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
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
import { photoStateOption, repositoryType as RepositoryTypeEnum, genderList } from './constant'
import {
  PhoneRegx,
  NameRegx,
  LpnRegx,
  OccupationRegx,
  CountryRegx,
  IDCardRegx,
  AgeRegx,
  YearRegx,
  NationalityRegx
} from './validator'
import { mapActions, mapState } from 'vuex'
import { ElImageViewer } from 'element-plus'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
export default {
  name: 'repository-item-form',
  components: {
    ElImageViewer
  },
  props: {
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person,
      required: true
    },
    repositoryId: {
      type: String,
      default: ''
    },
    objectId: {
      type: String,
      default: ''
    },
    initialFile: {
      type: File
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    previewImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      cuType: sStorage.get('cuType'),
      form: {
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
      },
      algorithmList: [],
      loading: false,
      RepositoryTypeEnum: RepositoryTypeEnum,
      imageMaxNum: 5,
      initialUploadFiles: [],
      pickerOptions: {
        disabledDate(time) {
          let nowTimestamp = new Date().getTime()
          return time.getTime() > nowTimestamp
        }
      },
      showViewer: false,
      viewerUrlList: [],
      vehicleSubList: [],
      initialFileObjectUrl: undefined,
      genderList: genderList
    }
  },
  computed: {
    ...mapState({
      credentialTypeList: state => state.dict['ars_credential_type'], //证件类型
      vehicleTypeList: state => state.dict['ars-vehicle-type'], //车辆类型
      vehicleColorList: state => state.dict['ars-vehicle-color'], //车辆颜色
      vehicleBrandList: state => state.dict['ars-vehicle-brand'] //车辆品牌
    }),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    rules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('repo.inputFullName'),
            trigger: 'blur'
          },
          {
            pattern: NameRegx,
            message: this.$t('repo.fullNameRule'),
            trigger: 'blur'
          }
        ],
        age: [
          {
            pattern: AgeRegx,
            message: this.$t('repo.agePrompt'),
            trigger: 'blur'
          }
        ],
        phoneNum: [
          {
            pattern: PhoneRegx,
            message: this.$t('repo.phoneNumProp'),
            trigger: 'blur'
          }
        ],
        country: [
          {
            pattern: CountryRegx,
            message: this.$t('repo.countryPrompt'),
            trigger: 'blur'
          }
        ],
        nationality: [
          {
            pattern: NationalityRegx,
            message: this.$t('repo.nationPrompt'),
            trigger: 'blur'
          }
        ],
        occupation: [
          {
            pattern: OccupationRegx,
            message: this.$t('repo.occupationPrompt'),
            trigger: 'blur'
          }
        ],
        credentialNumber: [
          {
            required: this.form.credentialType !== undefined && this.form.credentialType !== '',
            message: this.$t('repo.inputIDNum'),
            trigger: 'blur'
          },
          {
            pattern: IDCardRegx,
            message: this.$t('repo.idNumFormatProp'),
            trigger: 'blur'
          }
        ],
        ownerName: [
          {
            pattern: NameRegx,
            message: this.$t('repo.fullNameRule'),
            trigger: 'blur'
          }
        ],
        lpn: [
          {
            required: true,
            message: this.$t('repo.inputLicense'),
            trigger: 'blur'
          },
          {
            pattern: LpnRegx,
            message: this.$t('repo.licensePrompt'),
            trigger: 'blur'
          }
        ],
        vehicleYear: [
          {
            pattern: YearRegx,
            message: this.$t('repo.vehicleYearPrompt'),
            trigger: 'blur'
          }
        ]
      }
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    },
    dialogTitle() {
      if (this.isPersonRepo) {
        return this.objectId ? this.$t('repo.editPerson') : this.$t('repo.addPerson')
      } else {
        return this.objectId ? this.$t('repo.editCar') : this.$t('repo.addCar')
      }
    }
  },
  methods: {
    //获取证件类型
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryLists() {
      if (this.isPersonRepo) {
        this.getSysDictData(['ars_credential_type'])
      } else {
        this.getSysDictData(['ars-vehicle-type', 'ars-vehicle-color', 'ars-vehicle-brand'])
      }
    },
    async handleBrandChange(val) {
      this.form.vehicleSub = undefined
      if (val) {
        const res = await this.$api.getDictionary({
          type: `ars-vehicle-sub-brand-${val}`
        })
        this.vehicleSubList = res.dictionaryList || []
      } else {
        this.vehicleSubList = []
      }
    },
    dialogOpen() {
      this.getDictionaryLists()
      if (this.objectId !== '') {
        this.getRepositoryItemInfo()
      }
      this.$nextTick(() => {
        this.setDialogCss()
        if (this.initialFile instanceof File) {
          this.initialFileObjectUrl = URL.createObjectURL(this.initialFile)
          this.initialUploadFiles = [
            {
              name: this.initialFile.name,
              percentage: 0,
              raw: this.initialFile,
              size: this.initialFile.size,
              status: 'ready',
              uid: Date.now() + this.$refs.uploader.tempIndex++,
              url: this.initialFileObjectUrl
            }
          ]
        }
      })
    },
    dialogClosed() {
      this.resetForm()
      if (this.initialFileObjectUrl) {
        URL.revokeObjectURL(this.initialFileObjectUrl)
        this.initialFileObjectUrl = undefined
      }
      this.dialogVisible = false
    },
    formatPhotoState(val) {
      return this.selectDictLabel(photoStateOption, String(val), {
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
    handlePicPreview(file) {
      if (!file.url) {
        return
      }
      this.viewerUrlList = [file.url]
      this.showViewer = true
    },
    handleRemove(file) {
      this.$refs.uploader.handleRemove(file)
    },
    closeViewer() {
      this.viewerUrlList = []
      this.showViewer = false
    },
    async getRepositoryItemInfo() {
      try {
        const params = this.isPersonRepo
          ? { personId: this.objectId, netType: this.$getNetType() }
          : { vehicleId: this.objectId, netType: this.$getNetType() }
        const res =
          await this.$api[this.isPersonRepo ? 'getNewPersonInfo' : 'getNewVehicleInfo'](params)
        if (this.isPersonRepo) {
          const {
            name,
            age,
            gender,
            bornTime,
            country,
            nationality,
            occupation,
            phoneNum,
            credentialType,
            credentialNumber,
            remark,
            faceList = []
          } = res
          this.form = Object.assign({}, this.form, {
            name,
            age,
            gender,
            bornTime,
            country,
            nationality,
            occupation,
            phoneNum,
            credentialType,
            credentialNumber,
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
          const {
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
    // 上传预处理
    beforeUpload(file) {
      const testType = /^image\/(jpeg|png)$/.test(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!testType) {
        this.$message.error(this.$t('repo.fileTypeError'))
      }
      if (!isLt5M) {
        this.$message.error(this.$t('repo.pictureSizeCannotExceed', { size: '5MB' }))
      }
      return testType && isLt5M
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    handleExceed() {
      this.$message.info(this.$t('repo.imageCountPrompt'))
    },
    async submitForm() {
      const valid = await this.$refs.form.validate().catch(err => err)
      if (valid !== true) return false
      this.loading = true
      try {
        let formData = {}
        if (this.isPersonRepo) {
          formData = {
            personId: this.objectId || undefined,
            repositoryId: this.repositoryId,
            name: this.form.name,
            bornTime: this.form.bornTime,
            country: this.form.country,
            credentialType: this.form.credentialType,
            credentialNumber: this.form.credentialNumber,
            gender: this.form.gender,
            nationality: this.form.nationality,
            occupation: this.form.occupation,
            age: this.form.age,
            phoneNum: this.form.phoneNum,
            remark: this.form.remark,
            patchPicture: [],
            faceList: [],
            transfer: 1
          }
        } else {
          formData = {
            vehicleId: this.objectId || undefined,
            repositoryId: this.repositoryId,
            ownerName: this.form.ownerName,
            lpn: this.form.lpn,
            vehicleType: this.form.vehicleType,
            vehicleColor: this.form.vehicleColor,
            vehicleBrand: this.form.vehicleBrand,
            vehicleSub: this.form.vehicleSub,
            vehicleYear: this.form.vehicleYear,
            remark: this.form.remark,
            patchPicture: [],
            vehiclePhotos: [],
            transfer: 1
          }
        }
        // 上传图片处理
        if (this.image) formData.patchPicture.push(this.image)

        if (formData.patchPicture.length === 0) {
          delete formData.patchPicture
        }
        if (formData[this.isPersonRepo ? 'faceList' : 'vehiclePhotos'].length === 0) {
          delete formData[this.isPersonRepo ? 'faceList' : 'vehiclePhotos']
        }

        let result
        if (this.objectId === '') {
          // 新增
          result =
            await this.$api[this.isPersonRepo ? 'addNewPersonInfo' : 'addNewVehicleInfo'](formData)
        } else {
          result =
            await this.$api[this.isPersonRepo ? 'modifyNewPersonInfo' : 'modifyNewVehicleInfo'](
              formData
            )
        }
        if (result.resultCode === 0) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message:
              this.objectId === '' ? this.$t('public.addSuccess') : this.$t('public.modifySuccess')
          })
          this.$emit('success')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    padding: 15px 0 5px;
    .form {
      .el-form-item {
        margin-bottom: 18px !important;
      }
    }
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
img {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
</style>
