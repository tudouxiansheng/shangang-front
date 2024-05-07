<template>
  <div>
    <el-dialog
      :title="
        $parent.operation
          ? $t('deviceManagement.addCollection')
          : $t('deviceManagement.modifyDevice')
      "
      v-model="$parent.addMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1400px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addDeviceDialogVC"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '330px' : '172px'"
        label-position="left"
      >
        <!-- 基本信息 -->
        <collapse-card :title="$t('newAccess.basicInfo')" v-model:collapse="show1">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.belongOrg') + ':'" prop="organizationName">
                <el-cascader
                  ref="orgCascader"
                  :key="areaCascaderKey"
                  v-model="form.organizationName"
                  :props="propsCasOrg"
                  clearable
                  @change="changeOrg"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('platformManagement.organizationCode') + ':'"
                prop="organizationId"
              >
                <el-input
                  v-model="form.organizationId"
                  :placeholder="$t('platformManagement.selectOrganizationCode')"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.associativeSystems') + ':'">
                <el-input
                  ref="alogAps"
                  @focus="openDialogAps"
                  v-model="choosedAps"
                  :placeholder="$t('deviceManagement.selectAssociativeSystems')"
                  class="newCameras"
                ></el-input>
                <img src="@/assets/img/common/add.png" class="addIcon" @click="openDialogAps" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.accessMode') + ':'" prop="accessType">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.accessType"
                  :placeholder="$t('deviceManagement.selectAccessMode')"
                  @change="changeAccType"
                >
                  <el-option
                    v-for="(item, index) in $parent.accessTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12" v-if="$parent.operation">
              <el-form-item :label="$t('deviceManagement.associateDevice') + ':'">
                <el-input
                  ref="cameraSelect"
                  @focus="openDialog"
                  v-model="choosedCameras"
                  :placeholder="$t('deviceManagement.selectAssociateDevice')"
                  class="newCameras"
                ></el-input>
                <img src="@/assets/img/common/add.png" class="addIcon" @click="openDialog" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.deviceName') + ':'" prop="name">
                <el-input
                  v-model="form.name"
                  :placeholder="$t('deviceManagement.inputDeviceName')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.deviceType') + ':'" prop="type">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.type"
                  :placeholder="$t('deviceManagement.selectDeviceType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.typeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.acquisitionType') + ':'"
                prop="functionType"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.functionType"
                  :placeholder="$t('deviceManagement.selectAcquisitionType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.functionTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.equipmentManufacturers') + ':'"
                prop="manufacturer"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.manufacturer"
                  :placeholder="$t('deviceManagement.selectEquipmentManufacturers')"
                >
                  <el-option
                    v-for="(item, index) in $parent.manufacturerData"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.deviceModel') + ':'" prop="model">
                <el-input
                  v-model="form.model"
                  :placeholder="$t('deviceManagement.inputDeviceModel')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.installationLocation') + ':'" prop="place">
                <el-input
                  v-model="form.place"
                  :placeholder="$t('deviceManagement.townshipStreet')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.administrativeArea') + ':'"
                prop="placeCode"
              >
                <el-cascader
                  v-model="form.placeCode"
                  :props="propsCas"
                  clearable
                  :key="placeCodeCascaderKey"
                  :placeholder="$t('deviceManagement.selectAdministrativeArea')"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.longitude') + ':'" prop="longitude">
                <el-input
                  ref="inputBlurLog"
                  @focus="longlatFocus"
                  v-model="form.longitude"
                  :placeholder="$t('deviceManagement.selectLongitude')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.latitude') + ':'" prop="latitude">
                <el-input
                  ref="inputBlurLat"
                  @focus="longlatFocus"
                  v-model="form.latitude"
                  :placeholder="$t('deviceManagement.selectLatitude')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.locationType') + ':'" prop="placeType">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.placeType"
                  :placeholder="$t('deviceManagement.selectLocationType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.placeTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.monitorDirection') + ':'"
                prop="monitorDirection"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.monitorDirection"
                  :placeholder="$t('deviceManagement.selectMonitorDirection')"
                >
                  <el-option
                    v-for="(item, index) in $parent.monitorDirectionList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.captureDirection') + ':'"
                prop="capDirection"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.capDirection"
                  :placeholder="$t('deviceManagement.selectVaptureDirection')"
                >
                  <el-option
                    v-for="(item, index) in $parent.capDirectionList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.areaDescription') + ':'"
                prop="monitorAreaDesc"
              >
                <el-input
                  v-model="form.monitorAreaDesc"
                  :placeholder="$t('deviceManagement.inputAreaDescription')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.publicSecurity') + ':'" prop="police">
                <el-input
                  v-model="form.police"
                  :placeholder="$t('deviceManagement.selectPublicSecurity')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.organizationName') + ':'"
                prop="managementName"
              >
                <el-input
                  v-model="form.managementName"
                  :placeholder="$t('deviceManagement.inputOrganizationName')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.informationUnit') + ':'" prop="contact">
                <el-input
                  v-model="form.contact"
                  :placeholder="$t('deviceManagement.inputInformationUnit')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.installationTime') + ':'"
                prop="installTime"
              >
                <el-date-picker
                  v-model="form.installTime"
                  type="datetime"
                  :placeholder="$t('deviceManagement.selectInstallationTime')"
                  size="medium"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 联网信息 -->
        <collapse-card
          :title="$t('deviceManagement.networkingInformation')"
          v-model:collapse="show2"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('platformManagement.encoding') + ':'" prop="apeID">
                <el-input
                  v-model="form.apeID"
                  :placeholder="$t('platformManagement.inputInterconnectionCode')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.uploadMethod') + ':'" prop="uploadWay">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.uploadWay"
                  :placeholder="$t('deviceManagement.selectUploadMethod')"
                >
                  <el-option
                    v-for="(item, index) in $parent.uploadWayList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.v4Address') + ':'" prop="ipAddr">
                <el-input
                  v-model="form.ipAddr"
                  :placeholder="$t('deviceManagement.inputV4Address')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.v6Address') + ':'" prop="ipv6Addr">
                <el-input
                  v-model="form.ipv6Addr"
                  :placeholder="$t('deviceManagement.inputV6Address')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.MACAddress') + ':'" prop="mac">
                <el-input
                  v-model="form.mac"
                  :placeholder="$t('deviceManagement.inputMACAddress')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.portNumber') + ':'" prop="port">
                <el-input
                  v-model="form.port"
                  :placeholder="$t('deviceManagement.inputPortNumber')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.authenticationMethod') + ':'"
                prop="authority"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.authority"
                  :placeholder="$t('deviceManagement.selectAuthenticationMethod')"
                  @change="accessAuthTypeChange"
                >
                  <el-option
                    v-for="(item, index) in $parent.authorityList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <p class="safe" v-if="isShowTip">{{ $t('accessPlatform.anthModeTip') }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.authenticateAccount') + ':'"
                prop="userId"
                v-if="form.authority && form.authority != '1'"
              >
                <el-input
                  v-model="form.userId"
                  :placeholder="$t('deviceManagement.inputAuthenticateAccount')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('deviceManagement.authenticationPassword') + ':'"
                prop="password"
                v-if="form.authority && form.authority != '1'"
              >
                <el-input
                  :type="passw"
                  v-model="form.password"
                  :placeholder="$t('deviceManagement.inputAuthenticationPassword')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">
            {{ $t('public.cancel') }}
          </el-button>

          <el-button type="primary" @click="addMainDevSubmit" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <long-lat-map />

    <device-tools
      @getChooseCameras="getCameras"
      :currentChooseCameras="currentChooseCameras"
      :title="$t('deviceManagement.associateDevice')"
      :titleDialog="$t('deviceManagement.masterDevice')"
      type="2"
      :ifSearchParents="true"
      ifSendDeviceTypeApi="1"
      v-if="showDevTools"
    ></device-tools>

    <aps-tools
      @getChooseCameras="getAps"
      :currentChooseCameras="apsInfo"
      :title="$t('deviceManagement.selectAssociativeSystems')"
      :titleDialog="$t('deviceManagement.acquisitionSystem')"
      type="2"
      :showApsTree="true"
      :checkedApeId="form.ownerApsID"
      v-if="showApsTools"
    ></aps-tools>
  </div>
</template>

<script>
import longlatmap from '@/components/long-lat-map'
import CollapseCard from '@/components/collapse-card.vue'
import apsTools from '@/views/center/component/apeDeviceTools'
import devieTools from '@/components/device-tools'
export default {
  components: {
    'long-lat-map': longlatmap,
    'collapse-card': CollapseCard,
    'device-tools': devieTools,
    'aps-tools': apsTools
  },
  data() {
    // 设备状态
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,

      organizationId: '',
      organizationName: '',
      isShowTip: false,
      form: {
        organizationId: '',
        organizationName: [],
        name: '',
        alias: '',
        apeID: '',
        type: '',
        manufacturer: '',
        model: '',
        authority: '4',
        serviceIp: '',
        userId: '',
        password: '',
        ipAddr: '',
        ipv6Addr: '',
        mac: '',
        port: '',
        place: '',
        placeCode: '',
        longitude: '',
        latitude: '',
        placeType: '',
        monitorDirection: '',
        capDirection: '',
        monitorAreaDesc: '',
        police: '',
        managementName: '',
        contact: '',
        installTime: '',

        functionType: '',

        uploadWay: 1,

        //5.7.6
        ownerApsID: '',
        accessType: '0'
      },

      rules: {},

      longlatMapVisible: false,

      driveData: [], // 设备协议类型
      puAccountShow: true, //前端账户显示
      puPasswdShow: true, //前端密码显示

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,
      placeCodeCascaderKey: 0,
      propsCas: {
        checkStrictly: true,
        lazy: true,
        value: 'areaCode',
        label: 'areaName',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level == 0) {
            setTimeout(function () {
              resolve([
                {
                  areaCode: '000000000000',
                  areaLevel: 0,
                  areaName: '全国',
                  leaf: false
                }
              ])
            })
          } else {
            _this.$api.getAreaList({ areaCode: node.value }).then(res => {
              if (res.resultCode == 0) {
                const nodes = res.subAreaList.map(item => ({
                  ...item,
                  leaf: node.level >= 3
                }))
                resolve(nodes)
              }
            })
          }
        }
      },

      //5.7.4新增
      propsCasOrg: {
        checkStrictly: true,
        lazy: true,
        value: 'id',
        label: 'label',
        lazyLoad(node, resolve) {
          _this.$api
            .getOrganizationTree({
              withTenant: 2,
              type: 1,
              parentId: node.level == 0 ? null : node.data.id
            })
            .then(res => {
              if (res.resultCode == 0) {
                const nodes = res.nodeList.map(item => ({
                  ...item
                }))
                resolve(nodes)
              }
            })
        }
      },

      show1: true,
      show2: true,

      currentChooseCameras: [],
      choosedCameras: '',
      camerasArray: [],
      dialogDeviceVisible: false,

      areaCascaderKey: 0,
      showDevTools: true,
      choosedCameraFlag: false,

      apsInfo: [],
      choosedAps: '',
      apsArray: [],
      showApsTools: true,
      dialogDeviceVisibleAp: false
    }
  },
  mounted() {
    this.setFormRules()
  },

  watch: {},

  methods: {
    accessAuthTypeChange(val) {
      if (['4', ''].indexOf(val) > -1) {
        this.isShowTip = false
      } else {
        this.isShowTip = true
      }
    },
    async getCameras(cameras) {
      let currentCameras = []
      this.choosedCameras = ''
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        currentCameras.push(cameras[i].label)
        this.camerasArray.push(cameras[i].id)
      }
      this.currentChooseCameras = JSON.parse(JSON.stringify(cameras))
      this.choosedCameras = currentCameras.join(',')

      if (cameras[0]) {
        this.areaCascaderKey++
        await this.getCompleteCamraInfo(cameras[0].id)

        this.choosedCameraFlag = true
      } else {
        if (this.choosedCameraFlag) {
          this.form.name = ''
          this.form.apeID = ''
          this.form.ipAddr = ''
          this.form.port = ''
          this.form.place = ''
          this.form.longitude = ''
          this.form.latitude = ''
          this.form.manufacturer = ''
          this.choosedCameraFlag = false
        }
      }
    },

    async getAps(aps) {
      if (aps && aps.length) {
        this.apsInfo = JSON.parse(JSON.stringify(aps))
        this.form.ownerApsID = aps[0].id
        this.choosedAps = aps[0].label
      } else {
        this.apsInfo = []
        this.form.ownerApsID = ''
        this.choosedAps = ''
      }
    },

    async getCompleteCamraInfo(cameraId) {
      let res = await this.$api.getCameraInfo({ cameraId: cameraId })
      this.form.name = res.cameraBaseInfo.cameraName
      if (res.thirdAccessInfo.accessInterconnectCode) {
        this.form['apeID'] = res.thirdAccessInfo.accessInterconnectCode
      }
      this.form.ipAddr = res.thirdAccessInfo.puIp
      this.form.port = res.thirdAccessInfo.puPort
      this.form.place = res.cameraDirectionInfo.installLocate
      this.form.longitude = res.cameraDirectionInfo.longitude
      this.form.latitude = res.cameraDirectionInfo.latitude
      this.form.manufacturer = res.cameraBaseInfo.manufacturer
    },

    changeAccType(val) {
      if (val == '1') {
        //海康SDK
        this.form.port = '8000'
      } else if (val == '3') {
        //华为SDK
        this.form.port = '6060'
      } else {
        this.form.port = ''
      }
    },

    dialogOpen() {
      if (this.$refs.form) {
        this.choosedCameras = ''
        this.choosedAps = ''
        this.currentChooseCameras = []
        this.camerasArray = []
        this.showDevTools = false
        this.showApsTools = false
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.showDevTools = true
          this.showApsTools = true
          this.form.uploadWay = 1
        })
      }

      if (this.$parent.operation) {
        //下拉框默认第一条
        this.form.type = this.$parent.typeList[0].value
        this.form.functionType = this.$parent.functionTypeList[0].value
        this.form.manufacturer = this.$parent.manufacturerData[0].value
        this.form.capDirection = this.$parent.capDirectionList[0].value
        this.form.authority = this.$parent.authorityList[0].value
        this.form.placeType = this.$parent.placeTypeList[0].value
        this.form.monitorDirection = this.$parent.monitorDirectionList[0].value
      } else {
        this.choosedAps = this.$parent.choosedAps
      }

      this.$nextTick(() => {
        this.setDialogCss()
        if (!this.$parent.operation) {
          this.form = this.$parent.modifyMainForm
        } else {
          Object.assign(this.form, {
            organizationName: this.$parent.organizationName,
            organizationId: this.$parent.organizationId
          })
        }

        this.organizationId = this.$parent.organizationId
        this.organizationName = this.$parent.organizationName
        if (this.form.placeCode.length) {
          this.placeCodeCascaderKey++
        }
      })
    },
    dialogClosed() {
      this.$parent.addMainDevVisible = false
      this.organizationId = ''
    },

    setFormRules() {
      var regApeID = /^[0-9]{20}$/
      var validateApeID = (rule, value, callback) => {
        if (value == '') {
          callback()
        } else if (!regApeID.test(value)) {
          callback(new Error(this.$t('platformManagement.encode20Digits')))
        } else {
          callback()
        }
      }
      this.rules = {
        organizationId: [
          {
            required: true,
            message: this.$t('platformManagement.organizationEncodeNotEmpty'),
            trigger: 'change'
          }
        ],
        accessType: [
          {
            required: true,
            message: this.$t('platformManagement.accessTypeNotEmpty'),
            trigger: 'change'
          }
        ],
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],
        apeID: [
          {
            required: false,
            validator: validateApeID,
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('deviceManagement.inputDeviceName'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          }
        ],
        alias: [
          {
            required: false,
            message: this.$t('deviceManagement.inputDeviceAlias'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.namePattern'),
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('primaryDevice.selectType'),
            trigger: 'change'
          }
        ],
        manufacturer: [
          {
            required: false,
            message: this.$t('deviceManagement.selectEquipmentManufacturers'),
            trigger: 'change'
          }
        ],
        authority: [
          {
            required: false,
            message: this.$t('deviceManagement.selectAuthenticationMethod'),
            trigger: 'change'
          }
        ],
        model: [
          {
            required: false,
            message: this.$t('deviceManagement.inputDeviceModel'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          }
        ],
        functionType: [
          {
            required: true,
            message: this.$t('deviceManagement.selectAcquisitionType'),
            trigger: 'change'
          }
        ],
        userId: [
          {
            required: true,
            message: this.$t('deviceManagement.inputAuthenticateAccount'),
            trigger: 'change'
          }
        ],
        ipAddr: [
          {
            required: true,
            message: this.$t('deviceManagement.inputV4Address'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('deviceManagement.inputTurev4Address'),
            trigger: 'change'
          }
        ],
        mac: [
          {
            required: false,
            message: this.$t('deviceManagement.inputMACAddress'),
            trigger: 'change'
          },
          {
            pattern:
              /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
            message: this.$t('deviceManagement.inputTurevMACddress'),
            trigger: 'change'
          }
        ],
        place: [
          {
            required: false,
            message: this.$t('deviceManagement.townshipStreet'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('deviceManagement.length256'),
            trigger: 'change'
          }
        ],
        longitude: [
          {
            required: false,
            message: this.$t('deviceManagement.selectLongitude'),
            trigger: 'change'
          },
          {
            pattern:
              /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('deviceManagement.longitudeFormat'),
            trigger: 'change'
          }
        ],
        latitude: [
          {
            required: false,
            message: this.$t('deviceManagement.selectLatitude'),
            trigger: 'change'
          },
          {
            pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('deviceManagement.latitudeFormat'),
            trigger: 'change'
          }
        ],
        placeType: [
          {
            required: false,
            message: this.$t('deviceManagement.selectLocationType'),
            trigger: 'change'
          }
        ],
        capDirection: [
          {
            required: false,
            message: this.$t('deviceManagement.selectVaptureDirection'),
            trigger: 'change'
          }
        ],
        police: [
          {
            required: false,
            message: this.$t('deviceManagement.selectPublicSecurity'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.namePattern'),
            trigger: 'change'
          }
        ],
        contact: [
          {
            required: false,
            message: this.$t('deviceManagement.inputInformationUnit'),
            trigger: 'change'
          },
          {
            max: 20,
            message: this.$t('deviceManagement.length20'),
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.codePattern'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('deviceManagement.inputAuthenticationPassword'),
            trigger: 'change'
          }
        ],
        ipv6Addr: [
          {
            required: false,
            message: this.$t('deviceManagement.inputV6Address'),
            trigger: 'change'
          },
          {
            pattern:
              /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('deviceManagement.inputTurev6Address'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('deviceManagement.inputPortNumber'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('deviceManagement.portNumberFormat'),
            trigger: 'change'
          }
        ],
        placeCode: [
          {
            required: true,
            message: this.$t('deviceManagement.selectAdministrativeArea'),
            trigger: 'change'
          }
        ],
        monitorDirection: [
          {
            required: false,
            message: this.$t('deviceManagement.selectMonitorDirection'),
            trigger: 'change'
          }
        ],
        monitorAreaDesc: [
          {
            required: false,
            message: this.$t('deviceManagement.inputAreaDescription'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('deviceManagement.length256'),
            trigger: 'change'
          }
        ],
        managementName: [
          {
            required: false,
            message: this.$t('deviceManagement.inputOrganizationName'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.namePattern'),
            trigger: 'change'
          }
        ],
        installTime: [
          {
            required: false,
            message: this.$t('deviceManagement.selectInstallationTime'),
            trigger: 'change'
          }
        ]
      }
    },

    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.cameraSelect.blur()
    },
    openDialogAps() {
      this.dialogDeviceVisibleAp = true
      this.$refs.alogAps.blur()
    },

    changeOrg(val) {
      this.form.organizationId = JSON.parse(JSON.stringify(val)).pop()
    },

    //密码的隐藏和显示
    showPass() {
      this.passw = this.passw == 'password' ? 'text' : 'password'
      this.iconShow = !this.iconShow
    },

    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.addSubmit()
        }
      })
    },
    addSubmit() {
      let form = this.form
      let data = {
        organizationId: this.form.organizationId, //组织Id
        organizationName: this.$refs['orgCascader'].getCheckedNodes()[0].label, //组织名称
        name: form.name, //设备名称
        alias: form.alias, //设备别名
        apeID: form.apeID, //互联编码
        type: form.type, //采集设备类型
        manufacturer: form.manufacturer, //设备厂商
        model: form.model, //设备型号
        authority: form.authority, //鉴权方式
        userId: form.authority != '1' && form.authority != '' ? this.form.userId : '', //鉴权账号
        ipAddr: form.ipAddr, //Ipv4地址
        ipv6Addr: form.ipv6Addr, //Ipv6地址
        mac: form.mac, //MAC地址
        port: form.port, //端口号
        place: form.place, //安装位置
        placeCode:
          typeof form.placeCode == 'string'
            ? form.placeCode
            : form.placeCode[form.placeCode.length - 1].substring(0, 6), //安装地点区域代码
        longitude: form.longitude, //经度
        latitude: form.latitude, //纬度
        placeType: form.placeType, //设备位置类型
        monitorDirection: form.monitorDirection, //监视方向
        capDirection: form.capDirection === '' ? null : form.capDirection, //车辆抓拍方向
        monitorAreaDesc: form.monitorAreaDesc, //监视区域说明
        police: form.police, //所属辖区公安机关
        managementName: form.managementName, //管理单位名称
        contact: form.contact, //管理单位联系方式
        installTime: form.installTime, //设备安装时间

        functionType: form.functionType, //采集设备功能类型

        uploadWay: form.uploadWay, //图片上传方式

        ownerApsID: form.ownerApsID, //关联采集系统

        accessType: form.accessType //接入方式
      }

      if (form.authority != '1' && form.authority != '') {
        if (form.password !== '' && form.password !== null) {
          data.password = form.password
        }
      } else {
        data.password = ''
      }

      this.$parent.maskloading = true

      if (this.$parent.operation) {
        if (this.camerasArray.length) {
          data.id = this.camerasArray.join('')
        }
        this.$api.addApe(data).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      } else {
        data.id = this.$parent.choosedId
        this.$api.updateApe(data).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      }
    },
    successBack() {
      this.$message({
        type: 'success',
        message: this.$parent.operation
          ? this.$t('public.addSuccess')
          : this.$t('public.modifySuccess')
      })
      this.$parent.addMainDevVisible = false
      this.$parent.search_clear()
      this.$parent.getVirDevList()
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.addDeviceDialogVC {
  .el-dialog__body {
    padding: 15px 0 5px;
    .el-form-item--small.el-form-item {
      margin: 0 20px 28px 20px !important;
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-cascader--small {
    width: 100%;
  }

  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }
  .newCameras {
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
