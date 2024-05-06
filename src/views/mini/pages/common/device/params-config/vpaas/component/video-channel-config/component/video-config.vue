<template>
  <div class="video-config config-form">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.baseInfo') }}</p>
      <el-row v-if="platType != 14">
        <el-form>
          <el-button type="primary" @click="syncCameraStatus">
            {{ $t('mainDevConfiguration.syncCameraStatus') }}
          </el-button>
        </el-form>
      </el-row>
      <el-row :gutter="20" class="mt-6">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.organization')" prop="organizationName">
            <el-input v-model="form.organizationName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.platName')" prop="platName">
            <el-input v-model="form.platName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.mainDevName')" prop="mainDevName">
            <el-input v-model="form.mainDevName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.cameraType')" prop="ptzType">
            <el-select
              clearable
              v-model="form.ptzType"
              :placeholder="$t('mainDevConfiguration.ptzTypePrompt')"
            >
              <el-option
                v-for="(item, index) in ptzTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.cameraName')" prop="cameraName">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputCameraName')"
              v-model="form.cameraName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('primaryDevice.imgType')" prop="aiType">
            <el-select v-model="form.aiType" :placeholder="$t('primaryDevice.pleaseInputImgType')">
              <el-option
                v-for="(item, index) in imgTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.locationType')" prop="locationType">
            <el-select
              clearable
              v-model="form.locationType"
              :placeholder="$t('mainDevConfiguration.selectLocationType')"
            >
              <el-option
                v-for="(item, index) in locationTypeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.applicationType2')" prop="applicationType">
            <el-select
              v-model="form.applicationType"
              :placeholder="$t('mainDevConfiguration.selectedApplicationType2')"
              clearable
            >
              <el-option
                v-for="(item, index) in applicationTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.typeOfMobileProvider')"
            prop="manufacturer"
          >
            <el-select
              clearable
              v-model="form.manufacturer"
              :placeholder="$t('mainDevConfiguration.selectedManufacturer')"
            >
              <el-option
                v-for="(item, index) in manufacturerList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.model')" prop="model">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputModel')"
              v-model="form.model"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.networkType')" prop="networkType">
            <el-select v-model="form.networkType" clearable>
              <el-option
                v-for="(item, index) in networkTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.state')" prop="status">
            <el-select v-model="form.status" disabled>
              <el-option
                v-for="(item, index) in statusTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.installLocate')" prop="installLocate">
            <el-input
              :placeholder="$t('mainDevConfiguration.pleaseInputInstallLocate')"
              v-model="form.installLocate"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.eightyAxis')" prop="eightyAxis">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputEightyAxis')"
              v-model="form.eightyAxis"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.longitudeAndLatitude')"
            prop="longitudeAndLatitude"
          >
            <el-input
              ref="inputBlur"
              :placeholder="$t('mainDevConfiguration.pleaseInputLongitudeAndLatitude')"
              v-model="form.longitudeAndLatitude"
              clearable
              @focus="longlatFocus"
              @clear="shouldExecuteFocus = false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      v-if="
        platType === PLATFORM_TYPE.ADS ||
        drive === DRIVE_TYPE.HWSDK_ACREG ||
        drive === DRIVE_TYPE.ONVIF
      "
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.cameraStreamConfig') }}</p>
      <el-row>
        <el-form-item prop="streamType">
          <el-radio-group v-model="ruleForm.streamType">
            <el-radio-button
              v-for="(item, index) in ruleForm.streamInfoList"
              :label="index"
              :key="index"
            >
              {{
                selectDictLabel(streamTypeList, item.streamType, {
                  key: 'name',
                  value: 'value'
                })
              }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row :gutter="20" v-if="streamIndex != undefined">
        <el-col :span="8">
          <el-form-item
            v-if="platType === PLATFORM_TYPE.ADS"
            :label="$t('mainDevConfiguration.encodeType')"
            :prop="'streamInfoList[' + streamIndex + '].encodeType'"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].encodeType"
              :placeholder="$t('mainDevConfiguration.selectEncodeType')"
              @change="encodeTypeChange"
            >
              <el-option
                v-for="(item, index) in streamEncodeTypeListADS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="platType === PLATFORM_TYPE.VPAAS"
            :label="$t('mainDevConfiguration.encodeType')"
            :prop="'streamInfoList[' + streamIndex + '].encodeType'"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].encodeType"
              :placeholder="$t('mainDevConfiguration.selectEncodeType')"
              @change="encodeTypeChange"
            >
              <el-option
                v-for="(item, index) in streamEncodeTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="platType === PLATFORM_TYPE.ADS">
          <el-form-item
            :label="$t('mainDevConfiguration.transProtocol')"
            :prop="'streamInfoList[' + streamIndex + '].transProtocol'"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].transProtocol"
              :placeholder="$t('mainDevConfiguration.selectTransProtocol')"
              :disabled="DHSDKDis"
            >
              <el-option
                v-for="(item, index) in streamTransProtocolTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.bitRateType')"
            :prop="'streamInfoList[' + streamIndex + '].bitRateType'"
            required
          >
            <el-radio-group
              v-model="ruleForm.streamInfoList[streamIndex].bitRateType"
              :disabled="DHSDKDis && platType === PLATFORM_TYPE.ADS"
            >
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.bitRateType0') }}</el-radio>
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.bitRateType1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="streamIndex != undefined">
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.pktProtocol')"
            :prop="'streamInfoList[' + streamIndex + '].pktProtocol'"
            required
          >
            <el-radio-group
              v-model="ruleForm.streamInfoList[streamIndex].pktProtocol"
              :disabled="T28181Dis && platType === PLATFORM_TYPE.ADS"
            >
              <el-radio label="1" border v-if="platType === PLATFORM_TYPE.VPAAS || !DHSDKDis">
                ES
              </el-radio>
              <el-radio label="2" border>PS</el-radio>
              <el-radio label="3" border v-if="platType === PLATFORM_TYPE.ADS && !DHSDKDis">
                TS
              </el-radio>
              <el-radio label="99" border v-if="platType === PLATFORM_TYPE.ADS && !DHSDKDis">
                {{ $t('public.Else') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="profile" :prop="'streamInfoList[' + streamIndex + '].profile'">
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].profile"
              :placeholder="$t('mainDevConfiguration.selectProfile')"
              :disabled="(T28181Dis || DHSDKDis) && platType === PLATFORM_TYPE.ADS"
            >
              <el-option
                v-for="(item, index) in profileList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.resolution')"
            :prop="'streamInfoList[' + streamIndex + '].resolution'"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].resolution"
              :placeholder="$t('mainDevConfiguration.selectResolution')"
            >
              <el-option
                v-for="(item, index) in streamResolutionTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="streamIndex != undefined">
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.bitRate')"
            :prop="'streamInfoList[' + streamIndex + '].bitRate'"
            v-if="isHik && platType === PLATFORM_TYPE.ADS"
            :rules="rules.bitRate"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].bitRate"
              :placeholder="$t('mainDevConfiguration.selectBitRate')"
            >
              <el-option
                v-for="(item, index) in streamBitRateListADS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('mainDevConfiguration.bitRate')"
            :prop="'streamInfoList[' + streamIndex + '].bitRate'"
            v-if="!isHik && platType === PLATFORM_TYPE.ADS"
            :rules="rules.bitRate"
          >
            <el-input
              v-model="ruleForm.streamInfoList[streamIndex].bitRate"
              :placeholder="$t('frontParameterConfiguration.inputBitRate')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('mainDevConfiguration.bitRate')"
            :prop="'streamInfoList[' + streamIndex + '].bitRate'"
            v-if="platType === PLATFORM_TYPE.VPAAS"
            :rules="rules.bitRate"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].bitRate"
              :placeholder="$t('mainDevConfiguration.selectBitRate')"
            >
              <el-option
                v-for="(item, index) in streamBitRateListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.frameRate')"
            :prop="'streamInfoList[' + streamIndex + '].frameRate'"
            v-if="isHik && platType === PLATFORM_TYPE.ADS"
            :rules="rules.frameRate"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].frameRate"
              :placeholder="$t('mainDevConfiguration.selectFrameRate')"
            >
              <el-option
                v-for="(item, index) in streamFrameRateListADS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('mainDevConfiguration.frameRate')"
            :prop="'streamInfoList[' + streamIndex + '].frameRate'"
            v-if="!isHik && platType === PLATFORM_TYPE.ADS"
            :rules="rules.frameRate"
          >
            <el-input
              v-model="ruleForm.streamInfoList[streamIndex].frameRate"
              :placeholder="$t('frontParameterConfiguration.inputFrameRate')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('mainDevConfiguration.frameRate')"
            :prop="'streamInfoList[' + streamIndex + '].frameRate'"
            v-if="platType === PLATFORM_TYPE.VPAAS"
            :rules="rules.frameRate"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].frameRate"
              :placeholder="$t('mainDevConfiguration.selectFrameRate')"
            >
              <el-option
                v-for="(item, index) in streamFrameRateListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.frameInterval')"
            :prop="'streamInfoList[' + streamIndex + '].frameInterval'"
            :rules="rules.frameInterval"
          >
            <el-input
              :placeholder="$t('mainDevConfiguration.inputFrameInterval')"
              v-model="ruleForm.streamInfoList[streamIndex].frameInterval"
              clearable
              :disabled="T28181Dis"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="streamIndex != undefined">
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.picQuality')"
            :prop="'streamInfoList[' + streamIndex + '].picQuality'"
          >
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].picQuality"
              :placeholder="$t('mainDevConfiguration.selectPicQuality')"
              :disabled="T28181Dis || DHSDKDis"
            >
              <el-option
                v-for="(item, index) in picQualityList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          v-if="
            (platType === PLATFORM_TYPE.VPAAS && drive == 'HWSDK-ACREG') ||
            (platType === PLATFORM_TYPE.ADS &&
              (drive == 'HIKSDK' || drive == 'HWSDK-ACREG' || drive == 'HWSDK'))
          "
        >
          <el-form-item :label="$t('frontParameterConfiguration.smartCode')">
            <el-switch
              :disabled="platType === PLATFORM_TYPE.VPAAS && drive == 'HWSDK-ACREG'"
              v-model="ruleForm.streamInfoList[streamIndex].enableIntellgentCode"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          v-if="
            (platType === PLATFORM_TYPE.VPAAS && drive == 'HWSDK-ACREG') ||
            (platType === PLATFORM_TYPE.ADS && (drive == 'HWSDK-ACREG' || drive == 'HWSDK'))
          "
        >
          <el-form-item :label="$t('frontParameterConfiguration.codingLevels')">
            <el-select
              v-model="ruleForm.streamInfoList[streamIndex].intellgentCode"
              :disabled="platType === PLATFORM_TYPE.VPAAS"
            >
              <el-option :label="1" :value="1" />
              <el-option :label="2" :value="2" />
              <el-option :label="3" :value="3" />
              <el-option :label="4" :value="4" />
              <el-option :label="5" :value="5" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
    <long-lat-map />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
import LongLatMap from '@/components/long-lat-map'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'
export default {
  components: { LongLatMap },

  data() {
    var checkEightyAxis = (rule, value, callback) => {
      const reg = /,/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error(this.$t('mainDevConfiguration.eightyAxisProp')))
        } else {
          const arr = value.split(',')
          const reg1 = /^([1-9]\d*(\.[0-9]*[1-9])?)|(0\.[0-9]*[1-9])|0$/
          if (arr.length == 2 && arr[0].length > 0 && arr[1].length > 0) {
            if (
              arr[0].length < 32 &&
              arr[1].length < 32 &&
              reg1.test(arr[0]) &&
              reg1.test(arr[1])
            ) {
              callback()
            } else {
              if (arr[0].length > 32 || arr[1].length > 32) {
                callback(new Error(this.$t('mainDevConfiguration.eightyAxis32Prop')))
              }
              if (reg1.test(arr[0]) || reg1.test(arr[1])) {
                callback(new Error(this.$t('mainDevConfiguration.eightyAxisNumProp')))
              }
            }
          } else {
            callback(new Error(this.$t('mainDevConfiguration.eightyAxisProp')))
          }
        }
      } else {
        callback()
      }
    }
    return {
      shouldExecuteFocus: true,
      form: {},
      profileList: [],
      longlatMapVisible: false,
      formRules: {
        ptzType: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.ptzTypePrompt'),
            trigger: 'change'
          }
        ],
        cameraName: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputCameraName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        aiType: [
          {
            required: true,
            message: this.$t('primaryDevice.pleaseInputImgType'),
            trigger: 'change'
          }
        ],
        model: [
          {
            min: 1,
            max: 128,
            message: this.$t('mainDevConfiguration.moreModel'),
            trigger: 'change'
          }
        ],
        installLocate: [
          {
            min: 1,
            max: 512,
            message: this.$t('mainDevConfiguration.moreInstallLocate'),
            trigger: 'change'
          }
        ],
        eightyAxis: [
          {
            validator: checkEightyAxis,
            trigger: 'change'
          }
        ]
      },
      ruleForm: {
        streamType: undefined,
        streamInfoList: []
      },
      cameraStreamList: [],
      rules: {
        "'streamInfoList[' + streamIndex + '].encodeType'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectEncodeType'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].transProtocol'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectTransProtocol'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].profile'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectProfile'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].resolution'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectResolution'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].bitRate'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectBitRate'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].frameRate'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectFrameRate'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].frameInterval'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputFrameInterval'),
            trigger: 'change'
          },
          {
            pattern: /^([1-9][0-9]{0,1}|100)$/,
            message: this.$t('mainDevConfiguration.inputFrameIntervalRange'),
            trigger: 'change'
          }
        ],
        "'streamInfoList[' + streamIndex + '].picQuality'": [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectPicQuality'),
            trigger: 'change'
          }
        ]
      },
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE,
      streamFrameRateListADS: [
        {
          name: this.$t('public.all'),
          value: 0
        },
        {
          name: '1/16',
          value: 1
        },
        {
          name: '1/8',
          value: 2
        },
        {
          name: '1/4',
          value: 3
        },
        {
          name: '1/2',
          value: 4
        },
        {
          name: '1',
          value: 5
        },
        {
          name: '2',
          value: 6
        },
        {
          name: '3',
          value: 25
        },
        {
          name: '4',
          value: 7
        },
        {
          name: '5',
          value: 26
        },
        {
          name: '6',
          value: 8
        },
        {
          name: '7',
          value: 27
        },
        {
          name: '8',
          value: 9
        },
        {
          name: '8.3',
          value: 33
        },
        {
          name: '9',
          value: 28
        },
        {
          name: '10',
          value: 10
        },
        {
          name: '12',
          value: 11
        },
        {
          name: '16',
          value: 12
        },
        {
          name: '15',
          value: 14
        },
        {
          name: '18',
          value: 15
        },
        {
          name: '20',
          value: 13
        },
        {
          name: '22',
          value: 16
        },
        {
          name: '24',
          value: 31
        },
        {
          name: '25',
          value: 17
        },
        {
          name: '30',
          value: 18
        },
        {
          name: '35',
          value: 19
        },
        {
          name: '40',
          value: 20
        },
        {
          name: '45',
          value: 21
        },
        {
          name: '48',
          value: 32
        },
        {
          name: '50',
          value: 22
        },
        {
          name: '55',
          value: 23
        },
        {
          name: '60',
          value: 24
        },
        {
          name: '100',
          value: 29
        },
        {
          name: '120',
          value: 30
        }
      ],
      streamBitRateListADS: [
        {
          name: '16K',
          value: 1
        },
        {
          name: '32K',
          value: 2
        },
        {
          name: '48K',
          value: 3
        },
        {
          name: '64K',
          value: 4
        },
        {
          name: '80K',
          value: 5
        },
        {
          name: '96K',
          value: 6
        },
        {
          name: '128K',
          value: 7
        },
        {
          name: '160K',
          value: 8
        },
        {
          name: '192K',
          value: 9
        },
        {
          name: '224K',
          value: 10
        },
        {
          name: '256K',
          value: 11
        },
        {
          name: '320K',
          value: 12
        },
        {
          name: '384K',
          value: 13
        },
        {
          name: '448K',
          value: 14
        },
        {
          name: '512K',
          value: 15
        },
        {
          name: '640K',
          value: 16
        },
        {
          name: '768K',
          value: 17
        },
        {
          name: '896K',
          value: 18
        },
        {
          name: '1024K',
          value: 19
        },
        {
          name: '1280K',
          value: 20
        },
        {
          name: '1536K',
          value: 21
        },
        {
          name: '1792K',
          value: 22
        },
        {
          name: '2048K',
          value: 23
        },
        {
          name: '3072K',
          value: 24
        },
        {
          name: '4096K',
          value: 25
        },
        {
          name: '8192K',
          value: 26
        },
        {
          name: '16384K',
          value: 27
        }
      ],
      streamEncodeTypeListADS: [
        {
          name: 'H264',
          value: '1'
        },
        {
          name: 'H265',
          value: '6'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      applicationTypeList: state => state.dict['application-type'], //应用类型
      ptzTypeList: state => state.dict['device-type'], // 摄像机类型
      imgTypeList: state => state.dict['camera-img-type'], // 智能属性
      networkTypeList: state => state.dict['dev-access-mode'], // 网络类型
      manufacturerList: state => state.dict['camera_manufacturer'], // 设备厂商类型
      statusTypeList: state => state.dict['status_type'], // 设备厂商类型
      cameraIntelligentTypeList: state => state.dict['camera_intelligent_type'], // 设备智能分析类型
      locationTypeList: state => state.dict['location_type'], // 设备智能分析类型
      streamTypeList: state => state.dict['stream-type'], // 码流类型
      streamEncodeTypeList: state => state.dict['stream-encode-type'], // 编码格式
      streamTransProtocolTypeList: state => state.dict['stream-trans-protocol'], // 传输协议
      streamResolutionTypeList: state => state.dict['stream-resolution-type'], // 分辨率
      streamBitRateList: state => state.dict['stream-bit-rate'], // 码率
      streamFrameRateList: state => state.dict['stream-frame-rate'], // 帧率
      picQualityList: state => state.dict['pic_quality'], // 图像质量
      intellgentCodeList: state => state.dict['intellgent_code'], // 图像质量
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', [
      'drive',
      'platType',
      'PermissionCameraManage',
      'cameraIsExDomain'
    ]),
    streamIndex() {
      let i = undefined
      if (this.ruleForm.streamType != undefined) i = this.ruleForm.streamType
      return i
    },
    applicationTypeListFormattered() {
      let arr = []
      this.applicationTypeList.forEach(item => {
        let obj = { name: item.name, value: item.value }
        arr.push(obj)
      })
      return arr
    },
    ptzTypeListFormattered() {
      let arr = []
      this.ptzTypeList.forEach(item => {
        let obj = { name: item.name, value: item.value }
        arr.push(obj)
      })
      return arr
    },
    networkTypeListFormattered() {
      let arr = []
      this.networkTypeList.forEach(item => {
        let obj = { name: item.name, value: item.value }
        arr.push(obj)
      })
      return arr
    },
    statusTypeListFormattered() {
      let arr = []
      this.statusTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    cameraIntelligentTypeListFormattered() {
      let arr = []
      this.cameraIntelligentTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    streamBitRateListFormattered() {
      let arr = []
      this.streamBitRateList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    streamFrameRateListFormattered() {
      let arr = []
      this.streamFrameRateList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    streamTypeListFormattered() {
      let arr = []
      this.streamTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    streamEncodeTypeListFormattered() {
      let arr = []
      this.streamEncodeTypeList.forEach(item => {
        let obj = { name: item.name, value: item.value }
        arr.push(obj)
      })
      return arr
    },
    streamTransProtocolTypeListFormattered() {
      let arr = []
      this.streamTransProtocolTypeList.forEach(item => {
        let obj = { name: item.name, value: item.value }
        arr.push(obj)
      })
      return arr
    },
    imgTypeListFormattered() {
      let arr = []
      this.imgTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    isHik() {
      return this.drive === DRIVE_TYPE.HIKSDK
    },
    pktProtocolDis() {
      return this.drive == DRIVE_TYPE.T28181
    },
    T28181Dis() {
      return this.drive == DRIVE_TYPE.T28181
    },
    DHSDKDis() {
      return this.drive == DRIVE_TYPE.DHSDK
    }
  },
  watch: {
    selectedCameraId: {
      handler(newVal) {
        if (newVal) {
          this.getCameraInfo()
          this.viewVideoEncode()
        }
      },
      immediate: true
    },
    streamIndex: {
      handler(val) {
        if (
          this.ruleForm.streamInfoList &&
          this.ruleForm.streamInfoList.length &&
          val != undefined
        ) {
          this.encodeTypeChange(this.ruleForm.streamInfoList[val].encodeType)
        }
      }
    },
    'form.longitude'(newVal) {
      if (newVal) this.form['longitudeAndLatitude'] = newVal + ',' + this.form.latitude
    },
    'form.latitude'(newVal) {
      if (newVal) this.form['longitudeAndLatitude'] = this.form.longitude + ',' + newVal
    },
    'form.longitudeAndLatitude'(newVal) {
      if (newVal === '') {
        this.form.latitude = 0
        this.form.longitude = 0
      }
    },
    'form.eightyAxis'(newVal) {
      if (newVal == undefined) {
        this.form.xEightyAxis = ''
        this.form.yEightyAxis = ''
      } else {
        const arr = newVal.split(',')
        this.form.xEightyAxis = arr[0]
        this.form.yEightyAxis = arr[1]
      }
    },
    drive: {
      handler(newVal) {
        if (newVal == DRIVE_TYPE.DHSDK) {
          this.rules.bitRate = [
            {
              required: true,
              message: this.$t('mainDevConfiguration.selectBitRate'),
              trigger: 'change'
            },
            {
              pattern: /^(0|[1-9]\d{0,4}|99999)$/,
              message: this.$t('mainDevConfiguration.codeRateRange'),
              trigger: 'change'
            }
          ]
        }
      },
      immediate: true
    },
    platType: {
      handler(newVal) {
        if (newVal == PLATFORM_TYPE.VPAAS) {
          this.rules.frameInterval = [
            {
              pattern: /^([1-9][0-9]{0,1}|100)$/,
              message: this.$t('mainDevConfiguration.inputFrameIntervalRange'),
              trigger: 'change'
            }
          ]
        } else if (newVal == PLATFORM_TYPE.ADS) {
          if (this.drive == DRIVE_TYPE.HWSDK) {
            this.rules.frameInterval = [
              {
                pattern: /^([1-9]|[1-9]\d|100|200|300|400|500)$/,
                message: this.$t('mainDevConfiguration.adsFrameIntervalHW'),
                trigger: 'change'
              }
            ]
            this.rules.frameRate =[
              {
                pattern: /^([1-9]|[1-5]\d|60)$/,
                message: this.$t('mainDevConfiguration.adsFrameRateHW'),
                trigger: 'change'
              }
            ]
          } else if (this.drive == DRIVE_TYPE.HIKSDK) {
            this.rules.frameInterval = [
              {
                pattern: /^([1-9]|[1-9]\d|[1-3]\d{2}|400)$/,
                message: this.$t('mainDevConfiguration.adsFrameIntervalHIK'),
                trigger: 'change'
              }
            ]
          } else if (this.drive == DRIVE_TYPE.DHSDK) {
            this.rules.frameInterval = [
              {
                pattern: /^(?:[1-9]|[1-9][0-9]|1[0-4][0-9]|150)$/,
                message: this.$t('mainDevConfiguration.adsFrameIntervalDH'),
                trigger: 'change'
              }
            ]
             this.rules.frameRate =[
              {
                pattern: /^([1-9]|1\d|2[0-5])$/,
                message: this.$t('mainDevConfiguration.adsFrameRateDH'),
                trigger: 'change'
              }
            ]
          } else {
            this.rules.frameInterval = [
              {
                pattern: /^([1-9]|[1-9]\d{1,2})$/,
                message: this.$t('mainDevConfiguration.adsFrameInterval'),
                trigger: 'change'
              }
            ]
          }
        }
      },
      immediate: true,
      deep:true
    }
  },
  created() {
    this.getSysDictData([
      'stream-encode-type',
      'application-type',
      'device-type',
      'dev-access-mode',
      'camera_manufacturer',
      'status_type',
      'camera_intelligent_type',
      'stream-type',
      'stream-bit-rate',
      'stream-resolution-type',
      'stream-frame-rate',
      'stream-trans-protocol',
      'camera-img-type'
    ])
  },

  methods: {
    ...mapActions('dict', ['getSysDictData']),

    async getCameraInfo() {
      if (this.selectedCameraId == '') return
      let res1 = await this.$api.getCameraInfo({
        cameraId: this.selectedCameraId
      })
      if (res1.resultCode === 0) {
        let cameraBaseInfo = res1.cameraBaseInfo
        let cameraMaintainInfo = res1.cameraMaintainInfo
        let cameraDirectionInfo = res1.cameraDirectionInfo
        let platInfo = res1.platInfo
        this.form = {
          organizationName: cameraBaseInfo.organizationName,
          organizationId: cameraBaseInfo.organizationId,
          mainDevName: cameraBaseInfo.mainDevName,
          cameraName: cameraBaseInfo.cameraName,
          locationType: cameraBaseInfo.locationType,
          manufacturer: cameraBaseInfo.manufacturer,
          networkType:
            cameraMaintainInfo.networkType != undefined
              ? cameraMaintainInfo.networkType.toString()
              : '',
          aiType: cameraBaseInfo.aiType,
          status: cameraMaintainInfo.status,
          model: cameraBaseInfo.model,
          platName: platInfo.platName,
          ptzType: cameraBaseInfo.ptzType ? cameraBaseInfo.ptzType.toString() : '',
          applicationType: cameraMaintainInfo.applicationType,

          installLocate: cameraDirectionInfo.installLocate,
          longitude: cameraDirectionInfo.longitude,
          latitude: cameraDirectionInfo.latitude,
          xEightyAxis: cameraDirectionInfo.xEightyAxis,
          yEightyAxis: cameraDirectionInfo.yEightyAxis,
          longitudeAndLatitude:
            cameraDirectionInfo.longitude && cameraDirectionInfo.latitude
              ? cameraDirectionInfo.longitude + ',' + cameraDirectionInfo.latitude
              : '',
          eightyAxis:
            cameraDirectionInfo.xEightyAxis && cameraDirectionInfo.yEightyAxis
              ? cameraDirectionInfo.xEightyAxis + ',' + cameraDirectionInfo.yEightyAxis
              : ''
        }
      }
    },
    //视频编码查看
    viewVideoEncode() {
      if (this.selectedCameraId == '') return
      if (
        this.platType === PLATFORM_TYPE.ADS ||
        this.drive === DRIVE_TYPE.HWSDK_ACREG ||
        this.drive === DRIVE_TYPE.ONVIF
      ) {
        this.$api.cameraStreamInfo({ cameraId: this.selectedCameraId }).then(res => {
          if (res.resultCode == 0) {
            res.cameraStreamList.forEach((element) => {
              if (this.drive == 'HIKSDK' || this.drive == 'HWSDK-ACREG' || this.drive == 'HWSDK') {
                element.enableIntellgentCode = element.enableIntellgentCode
                  ? true
                  : false
              }
            })
            this.ruleForm.streamInfoList = res.cameraStreamList
            if (this.ruleForm.streamInfoList.length > 0) {
              this.ruleForm.streamType = 0
            }
          }
        })
      }
    },
    encodeTypeChange(val) {
      switch (val) {
        case '1':
          if (this.platType == PLATFORM_TYPE.ADS) {
            this.profileList = [
              {
                name: 'BP',
                code: 1
              },
              {
                name: 'EP',
                code: 2
              },
              {
                name: 'HP',
                code: 3
              },
              {
                name: 'MP',
                code: 4
              }
            ]
          } else {
            this.profileList = [
              {
                name: 'BP',
                code: 1
              },
              {
                name: 'EP',
                code: 2
              },
              {
                name: 'MP',
                code: 3
              },
              {
                name: 'HP',
                code: 4
              }
            ]
          }

          break
        case '2':
          this.profileList = [
            {
              name: 'SP',
              code: 1
            },
            {
              name: 'ASP',
              code: 2
            }
          ]
          break
        case '6':
          this.profileList = [
            {
              name: 'MAIN',
              code: 1
            }
          ]
          break
        default:
          this.profileList = [
            {
              name: 'BP',
              code: 1
            }
          ]
          break
      }
      const i = this.ruleForm.streamInfoList[this.streamIndex].profile
      if (i > this.profileList?.length) {
        this.ruleForm.streamInfoList[this.streamIndex].profile = 1
      }
    },
    longlatFocus() {
      if (this.shouldExecuteFocus) {
        this.longlatMapVisible = true
      } else {
        this.shouldExecuteFocus = true
      }
      this.$refs.inputBlur.blur()
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let data = {
            cameraId: this.selectedCameraId,
            ...this.form
          }
          if (
            this.platType === PLATFORM_TYPE.ADS ||
            this.drive === DRIVE_TYPE.HWSDK_ACREG ||
            this.drive === DRIVE_TYPE.ONVIF
          ) {
            this.$refs['ruleForm'].validate(async valid => {
              if (valid) {
                this.ruleForm.streamInfoList.forEach(element => {
                  if (this.platType == 15 && (this.drive == 'HIKSDK' || this.drive == 'HWSDK-ACREG' || this.drive == 'HWSDK')) {
                     element.enableIntellgentCode = element.enableIntellgentCode ? true : false
                  } else if (
                    this.platType == 15 &&
                    (this.drive == 'HWSDK-ACREG' || this.drive == 'HWSDK')
                  ) {
                    element.intellgentCode = element.intellgentCode
                      ? element.intellgentCode
                      : undefined
                  }
                })
                let cameraStreamConfigObj = {
                  cameraId: this.selectedCameraId,
                  cameraStreamList: [this.ruleForm.streamInfoList[this.streamIndex]]
                }
                let res = await Promise.all([
                  this.$api.modifyCameraInfo(data),
                  this.$api.cameraStreamConfig(cameraStreamConfigObj)
                ])
                if (res[0].resultCode === 0 && res[1].resultCode === 0) {
                  this.$message({
                    message: this.$t('mainDevConfiguration.parametersSuccessfully'),
                    type: 'success'
                  })
                  if (this.$route.name == 'MainDeviceFrontEndParameterConfiguration') {
                    this.$parent.$parent.$refs['configContainerLeft'].getCameraListByMainDevId()
                  }
                }
              }
            })
          } else {
            let res = await this.$api.modifyCameraInfo(data)
            if (res.resultCode === 0) {
              this.$message({
                message: this.$t('mainDevConfiguration.parametersSuccessfully'),
                type: 'success'
              })
              if (this.$route.name == 'MainDeviceFrontEndParameterConfiguration') {
                this.$parent.$parent.$refs['configContainerLeft'].getCameraListByMainDevId()
              }
            }
          }
        }
      })
    },
    async syncCameraStatus() {
      let res = await this.$api.syncCameraStatus({
        cameraId: this.selectedCameraId
      })
      if (res.resultCode == 0) {
        await this.getCameraInfo()
        await this.viewVideoEncode()
        this.$message({
          message: this.$t('mainDevConfiguration.syncCameraStatusSuccess'),
          type: 'success'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.video-config {
  padding-right: 10px;
  height: 100%;
  overflow-y: auto;
  .el-radio-button__inner {
    background: transparent;
    color: #fffefe;
    border: 1px solid #0b537e;
    border-right: 0;
    height: auto;
  }
  .el-radio-button:first-child {
    .el-radio-button__inner {
      border-left: 1px solid #0b537e;
    }
  }
  .el-radio-button:last-child {
    .el-radio-button__inner {
      border-right: 1px solid #0b537e;
    }
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #0e6294;
    border-color: #0e6294;
    -webkit-box-shadow: -1px 0 0 0 #0e6294;
    box-shadow: -1px 0 0 0 #0e6294;
  }
}
</style>
