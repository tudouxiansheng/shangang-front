<template>
  <el-dialog
    :title="isPersonRepo ? $t('repo.targetImport') : $t('repo.vehicleImport')"
    v-model="dialogVisible"
    top="10vh"
    :width="locale === 'en' ? '920px' : '730px'"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale === 'en' ? '172px' : '100px'"
      :rules="rules"
      label-position="left"
    >
      <el-form-item :label="$t('repo.importType') + '：'" prop="importType">
        <el-select v-model="form.importType" @change="handleImportTypeChange">
          <el-option
            v-for="(item, index) in importTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="file-import__tips" v-if="form.importType === 1 || form.importType === 2">
          <div class="tips-icon">
            <el-icon><el-icon-info /></el-icon>
          </div>
          <div class="tips-text">
            <span v-if="isPersonRepo && form.importType === 1">
              <span v-if="locale == 'en'">
                {{ $t('repo.importPrompt1Up') }}
                <br />
                {{ $t('repo.importPrompt1Down') }}
              </span>
              <span v-else>{{ $t('repo.importPrompt1') }}</span>
            </span>
            <span v-if="isPersonRepo && form.importType === 2">{{ $t('repo.importPrompt2') }}</span>
            <span v-if="!isPersonRepo && form.importType === 1">
              <span v-if="locale == 'en'">
                {{ $t('repo.importPrompt3Up') }}
                <br />
                {{ $t('repo.importPrompt3Down') }}
              </span>
              <span v-else>{{ $t('repo.importPrompt3') }}</span>
            </span>
            <span v-if="!isPersonRepo && form.importType === 2">
              {{ $t('repo.importPrompt4') }}
            </span>
            <span>{{ $t('repo.importPrompt5') }}</span>
            <span>{{ $t('repo.importPrompt6') }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('repo.libraryFile') + '：'">
        <ImportFolder
          ref="uploader"
          :import-type="form.importType"
          :repo-type="repoType"
          @success="handleExcel"
          dateFormat="YYYY-MM-DD"
          include-null
        >
          <template v-if="form.importType === 0" #append>
            <el-button type="text" :loading="downLoading" @click="handleDownloadTemplate">
              <svg-icon icon-class="download" style="display: inline-block" />
              {{ $t('repo.templateDownload') }}
            </el-button>
          </template>
        </ImportFolder>
        <div
          v-show="checkResultShow"
          :class="checkValidity ? 'file-check__success' : 'file-check__error'"
        >
          <i :class="checkValidity ? 'el-icon-success' : 'el-icon-error'"></i>
          {{
            checkValidity ? $t('repo.dataVerificationSuccess') : $t('repo.dataVerificationFailed')
          }}
          <span v-if="!checkValidity" @click="exportFailReason">
            {{ $t('repo.viewReasonForFailure') }}
          </span>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button :disabled="!checkValidity" type="primary" :loading="loading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { InfoFilled as ElIconInfo } from '@element-plus/icons-vue'
import {
  headerText,
  imageContentType,
  repositoryType as RepositoryTypeEnum,
  genderList
} from '@views/center/algorithm/repository/constant'
import ImportFolder from './import-folder'
import {
  PhoneRegx,
  NameRegx,
  LpnRegx,
  OccupationRegx,
  CountryRegx,
  IDCardRegx,
  otherIDCardRegx,
  DateRegx,
  AgeRegx,
  YearRegx,
  NationalityRegx
} from '../validator'
import { exportCsv } from '@/utils/common/data2Excel'
import { download } from '@/utils/common/download'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    ImportFolder,
    ElIconInfo
  },
  name: 'import-form',
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
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      loading: false,
      locale: localStorage.getItem('locale'),
      downLoading: false,
      form: {
        importType: 0
      },
      rules: {},
      importTypeOptions: [
        {
          label: this.$t('repo.templateImport'),
          value: 0
        },
        {
          label: this.$t('repo.pictureBatchImport'),
          value: 1
        },
        {
          label: this.$t('repo.quickImport'),
          value: 2
        }
      ],
      excelData: [],
      imageFiles: [],
      checkResult: [],
      checkResultShow: false,
      checkValidity: false
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
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
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
    dialogOpen() {
      this.getDictionaryLists()
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.$refs.uploader.clear()
      this.excelData = []
      this.imageFiles = []
      this.checkResult = []
      this.checkResultShow = false
      this.checkValidity = false
      this.dialogVisible = false
    },
    handleDownloadTemplate() {
      this.downLoading = true
      this.$api[this.isPersonRepo ? 'downloadPersonTemplate' : 'downloadVehicleTemplate']({
        netType: this.$getNetType()
      }).then(res => {
        if (res.templateFileUrl) {
          download(
            res.templateFileUrl,
            this.isPersonRepo
              ? this.$t('repo.targetImportTemplate')
              : this.$t('repo.vehicleImportTemplate')
          )
        }
        this.downLoading = false
      })
    },
    handleImportTypeChange() {
      this.$refs.uploader.clear()
      this.excelData = []
      this.imageFiles = []
      this.checkResult = []
      this.checkResultShow = false
      this.checkValidity = false
    },
    handleExcel(data, imageFiles) {
      this.excelData = data
      this.imageFiles = imageFiles
      this.checkExcelData()
    },
    // 校验excel数据
    async checkExcelData() {
      let checkResult = []
      let data = this.excelData[0].results
      this.check_loading = this.$loading({
        customClass: 'square_loading',
        lock: true,
        text: this.$t('repo.verifyDataLoading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (data.length === 0) {
        this.$message.error(this.$t('repo.excelEmpty'))
        this.check_loading.close()
        return false
      }
      if (data.length > 200000) {
        this.$message.error(this.$t('repo.importCountPrompt'))
        this.check_loading.close()
        return false
      }
      const isNull = val => {
        return val === null || val === undefined || val === ''
      }

      const notInDictionary = (val, dictionary) => {
        const values = dictionary.map(item => item.value)
        let flag = true
        for (let i = 0; i < values.length; i++) {
          if (values[i] == val) {
            flag = false
            break
          }
        }
        return flag
      }
      const flatEnum = dictionary => {
        let str = ''
        dictionary.forEach(item => {
          str += `${item.value}: ${item.name};`
        })
        return str
      }

      for (const item of data) {
        const index = data.indexOf(item)
        let row = JSON.parse(JSON.stringify(item))
        row.errorMessage = []
        // 图片校验
        if (this.form.importType === 0) {
          // excel解析数据对应图片校验
          if (isNull(item.patchPicture)) {
            row.errorMessage.push(this.$t('repo.imagePathEmpty'))
          } else {
            const imagePaths = item.patchPicture.split(';').filter(i => i)
            if (imagePaths.length > 5) {
              row.errorMessage.push(this.$t('repo.imageCountPrompt'))
            }
            let imageSize = 0
            imagePaths.forEach(path => {
              const image = this.imageFiles.find(image => image.name === path)
              if (!image) {
                row.errorMessage.push(`${path}${this.$t('repo.imagePathError')}`)
              } else {
                if (!imageContentType.includes(image.type)) {
                  row.errorMessage.push(`${path}${this.$t('repo.pictureTypeIsNotSupported')}`)
                }
                imageSize += image.size
              }
            })
            if (imageSize / 1024 / 1024 > 15) {
              row.errorMessage.push(this.$t('repo.pictureSizeCannotExceed', { size: '15M' }))
            }
          }
        } else {
          // 直接根据图片file对象校验
          const image = this.imageFiles[index]
          if (!imageContentType.includes(image.type)) {
            row.errorMessage.push(`${image.name}${this.$t('repo.pictureTypeIsNotSupported')}`)
          }
          if (image.size / 1024 / 1024 > 5) {
            row.errorMessage.push(
              `${image.name}${this.$t('repo.pictureSizeCannotExceed', {
                size: '5M'
              })}`
            )
          }
        }

        // 数据校验
        if (this.isPersonRepo) {
          if (isNull(item.name)) {
            row.errorMessage.push(this.$t('repo.inputFullName'))
          }
          if (!isNull(item.name) && !NameRegx.test(item.name)) {
            row.errorMessage.push(this.$t('repo.fullNameRule'))
          }
          if (!isNull(item.age) && !AgeRegx.test(item.age)) {
            row.errorMessage.push(this.$t('repo.agePrompt'))
          }
          if (!isNull(item.phoneNum) && !PhoneRegx.test(item.phoneNum)) {
            row.errorMessage.push(this.$t('repo.phoneNumProp'))
          }
          if (!isNull(item.country) && !CountryRegx.test(item.country)) {
            row.errorMessage.push(this.$t('repo.countryPrompt'))
          }
          if (!isNull(item.nationality) && !NationalityRegx.test(item.nationality)) {
            row.errorMessage.push(this.$t('repo.nationPrompt'))
          }
          if (!isNull(item.occupation) && !OccupationRegx.test(item.occupation)) {
            row.errorMessage.push(this.$t('repo.occupationPrompt'))
          }
          if (!isNull(item.bornTime) && !DateRegx.test(item.bornTime)) {
            row.errorMessage.push(this.$t('repo.birthdayError'))
          }
          if (!isNull(item.credentialType)) {
            if (notInDictionary(item.credentialType, this.credentialTypeList)) {
              row.errorMessage.push(
                this.$t('repo.fieldErrorWithEnum', {
                  field: this.$t('repo.IDType'),
                  enum: flatEnum(this.credentialTypeList)
                })
              )
            } else {
              if (isNull(item.credentialNumber)) {
                row.errorMessage.push(this.$t('repo.iDNumIsRequired'))
              } else {
                if (!IDCardRegx.test(item.credentialNumber)) {
                  row.errorMessage.push(this.$t('repo.idNumFormatProp'))
                }
              }
            }
          } else {
            if (!IDCardRegx.test(item.credentialNumber)) {
              row.errorMessage.push(this.$t('repo.idNumFormatProp'))
            }
          }
          if (!isNull(item.gender) && notInDictionary(item.gender, genderList)) {
            row.errorMessage.push(
              this.$t('repo.fieldErrorWithEnum', {
                field: this.$t('repo.gender'),
                enum: flatEnum(genderList)
              })
            )
          }
        } else {
          if (isNull(item.lpn)) {
            row.errorMessage.push(this.$t('repo.inputLicense'))
          } else {
            if (!LpnRegx.test(item.lpn)) {
              row.errorMessage.push(this.$t('repo.licensePrompt'))
            }
          }
          if (!isNull(item.ownerName) && !NameRegx.test(item.ownerName)) {
            row.errorMessage.push(this.$t('repo.fullNameRule'))
          }
          if (
            !isNull(item.vehicleType) &&
            notInDictionary(item.vehicleType, this.vehicleTypeList)
          ) {
            row.errorMessage.push(
              this.$t('repo.fieldErrorWithEnum', {
                field: this.$t('repo.carType'),
                enum: flatEnum(this.vehicleTypeList)
              })
            )
          }
          if (
            !isNull(item.vehicleColor) &&
            notInDictionary(item.vehicleColor, this.vehicleColorList)
          ) {
            row.errorMessage.push(
              this.$t('repo.fieldErrorWithEnum', {
                field: this.$t('repo.carColor'),
                enum: flatEnum(this.vehicleColorList)
              })
            )
          }
          if (!isNull(item.vehicleBrand)) {
            if (notInDictionary(item.vehicleBrand, this.vehicleBrandList)) {
              row.errorMessage.push(
                this.$t('repo.fieldErrorWithEnum', {
                  field: this.$t('repo.brand'),
                  enum: flatEnum(this.vehicleBrandList)
                })
              )
            } else {
              if (!isNull(item.vehicleSub)) {
                const subBrandList = await this.getSubBrand(item.vehicleBrand)
                if (notInDictionary(item.vehicleSub, subBrandList)) {
                  row.errorMessage.push(
                    this.$t('repo.fieldErrorWithEnum', {
                      field: this.$t('repo.carSub'),
                      enum: flatEnum(subBrandList)
                    })
                  )
                }
              }
            }
          } else {
            if (!isNull(item.vehicleSub)) {
              row.errorMessage.push(
                this.$t('repo.fieldErrorWithEnum', {
                  field: this.$t('repo.brand'),
                  enum: flatEnum(this.vehicleBrandList)
                })
              )
            }
          }
          if (!isNull(item.vehicleYear) && !YearRegx.test(item.vehicleYear)) {
            row.errorMessage.push(this.$t('repo.fieldError', { field: this.$t('repo.yearType') }))
          }
        }

        if (!isNull(item.remark)) {
          if (item.remark.length > 256) {
            row.errorMessage.push(this.$t('repo.remarkPrompt'))
          }
        }

        checkResult.push(row)
      }
      this.check_loading.close()
      this.checkResult = checkResult
      this.checkValidity = checkResult.every(item => item.errorMessage.length === 0)
      this.checkResultShow = true
    },
    async getSubBrand(val) {
      if (val) {
        const res = await this.$api.getDictionary({
          type: `ars-vehicle-sub-brand-${val}`
        })
        return res.dictionaryList || []
      } else {
        return []
      }
    },
    exportFailReason() {
      if (this.checkResult.length === 0) {
        return false
      }
      const excelHeader = this.$loadash.cloneDeep(this.excelData[0].header)
      const excelData = this.$loadash.cloneDeep(this.checkResult)
      let header = {}
      excelHeader.forEach(item => {
        header[item] = headerText[item]
      })
      header.errorMessage = headerText.errorMessage
      let data = excelData
        .filter(item => item.errorMessage.length > 0)
        .map(item => {
          item.errorMessage = item.errorMessage.join(' ')
          return item
        })
      exportCsv(this.$t('repo.errorMessage'), header, data)
    },
    submitForm() {
      this.$emit('submit', this.excelData[0].results, this.imageFiles)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    padding: 15px 40px 25px;
    .el-form-item__content {
      .el-input,
      .el-select {
        width: 400px;
      }
    }

    .file-check__error,
    .file-check__success {
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
      width: 75%;
    }

    .file-check__error {
      color: #ff4e4e;
      width: 400px;
      span {
        cursor: pointer;
        color: #3084c9;
        margin-left: 10px;
        &:hover {
          color: darken(#3084c9, 10%);
        }
      }

      span:last-of-type {
        float: right;
      }
    }

    .file-check__success {
      color: #3084c9;
    }

    .file-import__tips {
      font-size: 12px;
      line-height: 1;
      padding-top: 12px;
      display: flex;
      color: #999999;
      .tips-text {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        span {
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
