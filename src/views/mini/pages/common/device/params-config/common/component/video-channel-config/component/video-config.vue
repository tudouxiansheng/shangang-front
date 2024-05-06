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
      <el-row v-if="platType !== PLATFORM_TYPE.IVS_1800">
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
          <el-form-item :label="$t('mainDevConfiguration.platName')" prop="platInfo.platName">
            <el-input v-model="form.platInfo.platName" disabled></el-input>
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
          <el-form-item :label="$t('mainDevConfiguration.cameraId')" prop="cameraId" required>
            <el-input v-model="form.cameraId" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.thirdCameraId')" prop="thirdCameraId">
            <el-tooltip effect="dark" :content="form.thirdCameraId" placement="top-start">
              <el-input v-model="form.thirdCameraId" disabled></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.channelNo')" prop="channelNo">
            <el-input v-model="form.channelNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('primaryDevice.imgType')" prop="imgType">
            <el-select v-model="form.imgType" :placeholder="$t('primaryDevice.pleaseInputImgType')">
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
              :placeholder="$t('mainDevConfiguration.pleaseInputLongitudeAndLatitude')"
              v-model="form.longitudeAndLatitude"
              clearable
              ref="inputBlur"
              @focus="longlatFocus"
              @clear="shouldExecuteFocus = false"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.azimuth')" prop="azimuth">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputAzimuth')"
              v-model="form.azimuth"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.isEnabled')" prop="isEnable">
            <el-radio-group v-model="form.isEnable">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>

              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col
          :span="8"
          v-if="
            drive !== DRIVE_TYPE.T28181 &&
            (form.ptzType === 2 || form.ptzType === 3 || form.ptzType === 4)
          "
        >
          <el-form-item :label="$t('mainDevConfiguration.superposition')" prop="superposition">
            <el-radio-group v-model="form.superposition">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>

              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        v-if="
          !cameraIsExDomain &&
          form.status === 1 &&
          !(
            platType === PLATFORM_TYPE.GBT28181 ||
            (platType === PLATFORM_TYPE.AVS && drive === DRIVE_TYPE.HIKSDK) ||
            (platType === PLATFORM_TYPE.AVS && drive === DRIVE_TYPE.DHSDK)
          )
        "
      >
        <p class="form-title">{{ $t('mainDevConfiguration.cameraStreamConfig') }}</p>
        <el-row>
          <el-form-item prop="streamType">
            <el-radio-group v-model="form.streamType">
              <el-radio-button
                v-for="(item, index) in form.streamInfoList"
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
              :label="$t('mainDevConfiguration.encodeType')"
              :prop="'streamInfoList[' + streamIndex + '].encodeType'"
            >
              <el-select
                v-model="form.streamInfoList[streamIndex].encodeType"
                :placeholder="$t('mainDevConfiguration.selectEncodeType')"
                :disabled="drive === DRIVE_TYPE.T28181"
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
          <el-col :span="8">
            <el-form-item
              :label="$t('mainDevConfiguration.transProtocol')"
              :prop="'streamInfoList[' + streamIndex + '].transProtocol'"
            >
              <el-select
                v-model="form.streamInfoList[streamIndex].transProtocol"
                :placeholder="$t('mainDevConfiguration.selectTransProtocol')"
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
                v-model="form.streamInfoList[streamIndex].bitRateType"
                :disabled="platType == 3 && drive == 'ONVIF'"
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
                v-model="form.streamInfoList[streamIndex].pktProtocol"
                :disabled="
                  (platType === PLATFORM_TYPE.AVS && drive === DRIVE_TYPE.ONVIF) ||
                  drive === DRIVE_TYPE.T28181
                "
              >
                <el-radio :label="1" border>ES</el-radio>
                <el-radio :label="2" border>PS</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="profile" :prop="'streamInfoList[' + streamIndex + '].profile'">
              <el-select
                v-model="form.streamInfoList[streamIndex].profile"
                :placeholder="$t('mainDevConfiguration.selectProfile')"
                :disabled="drive === DRIVE_TYPE.T28181"
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
                v-model="form.streamInfoList[streamIndex].resolution"
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
            >
              <el-select
                v-model="form.streamInfoList[streamIndex].bitRate"
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
            >
              <el-select
                v-model="form.streamInfoList[streamIndex].frameRate"
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
            >
              <el-input
                :placeholder="$t('mainDevConfiguration.inputFrameInterval')"
                v-model="form.streamInfoList[streamIndex].frameInterval"
                clearable
                :disabled="drive === DRIVE_TYPE.T28181"
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
                v-model="form.streamInfoList[streamIndex].picQuality"
                :placeholder="$t('mainDevConfiguration.selectPicQuality')"
                :disabled="
                  (platType === PLATFORM_TYPE.AVS && drive === DRIVE_TYPE.ONVIF) ||
                  drive === DRIVE_TYPE.T28181
                "
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
          <el-col :span="8" v-if="platType !== PLATFORM_TYPE.AVS">
            <el-form-item
              :label="$t('mainDevConfiguration.intellgentCode')"
              :prop="'streamInfoList[' + streamIndex + '].intellgentCode'"
            >
              <el-select
                v-model="form.streamInfoList[streamIndex].intellgentCode"
                clearable
                :placeholder="$t('mainDevConfiguration.selectIntellgentCode')"
                disabled
              >
                <el-option
                  v-for="(item, index) in intellgentCodeList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
      form: {
        streamType: undefined,
        transProtocol: undefined,
        bitRateType: undefined,
        pktProtocol: undefined,
        profile: undefined,
        resolution: undefined,
        bitRate: undefined,
        frameRate: undefined,
        frameInterval: undefined,
        picQuality: undefined,
        intellgentCode: undefined,
        enableRecordAlarmConfig: undefined,
        recordAlarmBitRate: undefined,
        recordAlarmFrameRate: undefined,
        status: undefined,
        platInfo: {},
        streamInfoList: []
      },
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
        imgType: [
          {
            required: true,
            message: this.$t('primaryDevice.pleaseInputImgType'),
            trigger: 'change'
          }
        ],
        eightyAxis: [
          {
            validator: checkEightyAxis,
            trigger: 'change'
          }
        ],
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
      DRIVE_TYPE: DRIVE_TYPE
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
      if (this.form.streamType != undefined) i = this.form.streamType
      return i
    },
    applicationTypeListFormattered() {
      let arr = []
      this.applicationTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    ptzTypeListFormattered() {
      let arr = []
      this.ptzTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    networkTypeListFormattered() {
      let arr = []
      this.networkTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
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
        let obj = { name: item.name, value: parseInt(item.value) }
        arr.push(obj)
      })
      return arr
    },
    streamTransProtocolTypeListFormattered() {
      let arr = []
      this.streamTransProtocolTypeList.forEach(item => {
        let obj = { name: item.name, value: parseInt(item.value) }
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
    }
  },
  watch: {
    selectedCameraId: {
      handler(newVal) {
        if (newVal) this.getCameraInfo()
      },
      immediate: true
    },
    streamIndex: {
      handler(val) {
        if (this.form.streamInfoList && this.form.streamInfoList.length && val != undefined) {
          this.encodeTypeChange(this.form.streamInfoList[val].encodeType)
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
      let res1 = await this.$api.getDevConfig({
        deviceCode: this.selectedCameraId,
        configType: 4
      })
      if (res1.resultCode === 0) {
        this.form = res1.configItem
        if (this.form.longitude == undefined) {
          this.form.longitude = 0
          this.form.latitude = 0
        }
        if (this.form.xEightyAxis == undefined) {
          this.form.xEightyAxis = ''
        } else if (this.form.yEightyAxis == undefined) {
          this.form.yEightyAxis = ''
        }
        if (this.form.xEightyAxis && this.form.yEightyAxis) {
          this.form['eightyAxis'] = this.form.xEightyAxis + ',' + this.form.yEightyAxis
        } else {
          this.form.eightyAxis = undefined
        }
        if (this.form.applicationType != undefined && this.form.applicationType != '') {
          this.form['applicationType'] = parseInt(this.form.applicationType)
        }
      }
      if (
        !this.cameraIsExDomain &&
        this.form.status == 1 &&
        !(
          this.form.platInfo.platType == PLATFORM_TYPE.GBT28181 ||
          (this.form.platInfo.platType == PLATFORM_TYPE.AVS && this.drive == 'HIKSDK') ||
          (this.form.platInfo.platType == PLATFORM_TYPE.AVS && this.drive == 'DHSDK')
        )
      ) {
        let res2 = await this.$api.getDevConfig({
          deviceCode: this.selectedCameraId,
          configType: 5
        })
        if (res1.resultCode === 0) {
          if (
            res2?.configItem?.streamInfoList != undefined &&
            res2.configItem.streamInfoList.length > 0
          ) {
            this.form.streamType = 0
            res2.configItem.streamInfoList.filter(i => {
              if (i.profile !== 1 && i.encodeType === 7) {
                i.profile = 1
              }
            })
          }
          this.form = { ...this.form, ...res2.configItem }
          if (this.form?.streamInfoList)
            this.encodeTypeChange(this.form.streamInfoList[0].encodeType)
        }
      }
      if (this.form.longitude && this.form.latitude) {
        this.form.longitudeAndLatitude = this.form.longitude + ',' + this.form.latitude
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
    encodeTypeChange(val) {
      switch (val) {
        case 1:
          if (this.platType === PLATFORM_TYPE.AVS && this.drive === DRIVE_TYPE.HWSDK_ACREG) {
            this.profileList = [
              {
                name: 'BP',
                code: 1
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
                name: 'HP',
                code: 3
              },
              {
                name: 'MP',
                code: 4
              }
            ]
          }

          break
        case 2:
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
        case 6:
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
      const i = this.form.streamInfoList[this.streamIndex].profile
      if (i > this.profileList?.length) {
        this.form.streamInfoList[this.streamIndex].profile = 1
      }
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const {
            cameraId,
            platInfo,
            mainDevId,
            mainDevName,
            organizationId,
            organizationName,
            status,
            isEnable,
            cameraName,
            ptzType,
            longitude,
            latitude,
            altitude,
            thirdCameraId,
            installLocate,
            xEightyAxis,
            yEightyAxis,
            azimuth,
            locationType,
            networkType,
            imgType,
            applicationType,
            manufacturer,
            model,
            remark,
            superposition,
            channelNo
          } = this.form
          const cameraConfig = {
            deviceCode: this.selectedCameraId,
            configType: 4,
            configItem: {
              cameraId,
              platInfo,
              mainDevId,
              mainDevName,
              organizationId,
              organizationName,
              status,
              isEnable,
              cameraName,
              ptzType,
              longitude,
              latitude,
              altitude,
              thirdCameraId,
              installLocate,
              xEightyAxis,
              yEightyAxis,
              azimuth,
              locationType,
              networkType,
              imgType,
              applicationType: applicationType === '' ? undefined : applicationType,
              manufacturer,
              model,
              remark,
              superposition,
              channelNo
            }
          }
          if (
            this.form.status == 1 &&
            !this.cameraIsExDomain &&
            !(
              this.form.platInfo.platType == PLATFORM_TYPE.GBT28181 ||
              (this.form.platInfo.platType == PLATFORM_TYPE.AVS && this.drive == 'HIKSDK') ||
              (this.form.platInfo.platType == PLATFORM_TYPE.AVS && this.drive == 'DHSDK')
            )
          ) {
            const {
              streamInfoNum,
              streamInfoList,
              enableDynamicBitRate,
              dynamicBitRate,
              dynamicframeRate,
              enableDynamicframeRate,
              enableFullFrameRate,
              fullFrameRate
            } = this.form
            const cameraStreamConfig = {
              deviceCode: this.selectedCameraId,
              configType: 5,
              configItem: {
                streamInfoNum,
                streamInfoList,
                enableDynamicBitRate,
                dynamicBitRate,
                dynamicframeRate,
                enableDynamicframeRate,
                enableFullFrameRate,
                fullFrameRate
              }
            }

            let res = await Promise.all([
              this.$api.setDevConfig(cameraConfig),
              this.$api.setDevConfig(cameraStreamConfig)
            ])
            if (
              this.$route.name == 'MainDeviceFrontEndParameterConfiguration' &&
              res[0].resultCode === 0
            ) {
              this.$parent.$parent.$refs['configContainerLeft'].getCameraListByMainDevId()
            }
            if (res[0].resultCode === 0 && res[1].resultCode === 0) {
              this.$message({
                message: this.$t('mainDevConfiguration.parametersSuccessfully'),
                type: 'success'
              })
            }
          } else {
            let res = await this.$api.setDevConfig(cameraConfig)
            if (res.resultCode == 0) {
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
        let res1 = await this.$api.getDevConfig({
          deviceCode: this.selectedCameraId,
          configType: 4
        })
        if (res1.resultCode === 0) this.form = res1.configItem
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
