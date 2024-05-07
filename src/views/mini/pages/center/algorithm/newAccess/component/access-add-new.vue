<template>
  <div id="accessAlgorithmAddDialog">
    <el-dialog
      :title="title"
      v-model="dialogFormVisible"
      top="10vh"
      :width="locale == 'en' ? '1200px' : '1000px'"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @close="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        class="archivesForm"
        :inline="true"
        :label-width="locale == 'en' ? '264px' : '140px'"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <!-- 基本信息 -->
        <collapse-card :title="$t('newAccess.basicInfo')" v-model:collapse="show1">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.belongOrg') + ':'" prop="organizationName">
                <el-input
                  v-model="form.organizationName"
                  :placeholder="$t('newAccess.selectBelongOrg')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPlatType') + ':'" prop="platformType">
                <el-input v-model="$parent.platformTypeHolder" disabled v-if="!$parent.operation" />

                <el-cascader
                  :options="$parent.options"
                  :props="{ expandTrigger: 'hover' }"
                  clearable
                  :show-all-levels="false"
                  v-model="form.platformType"
                  :popper-append-to-body="false"
                  @change="changePlatType"
                  v-if="$parent.operation"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accName') + ':'" prop="accessName">
                <el-input v-model="form.accessName" :placeholder="$t('newAccess.inputAccName')" />
              </el-form-item>
            </el-col>

            <el-col v-if="gatewayGroupJudge" :span="12" class="platformScaleCol">
              <el-form-item :label="$t('newAccess.association')" prop="ivsPlatId">
                <el-select
                  v-model="form.ivsPlatId"
                  :placeholder="$t('newAccess.pleaseAssociation')"
                >
                  <el-option
                    v-for="item in gatewayList"
                    :key="item.platformId"
                    :label="item.platformName"
                    :value="item.platformId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="platformScaleCol">
              <el-form-item :label="$t('newAccess.selectGateway') + ':'" prop="gatewayGroup">
                <el-input
                  ref="gateWay"
                  v-model="form.gatewayGroup"
                  @focus="foucsGateWay"
                  :placeholder="$t('newAccess.clickToSelect')"
                  :disabled="!$parent.operation && $parent.choosedEnableStatus == 1"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('newAccess.remak') + ':'" class="single-line" prop="remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  maxlength="1024"
                  show-word-limit
                  :placeholder="$t('newAccess.inputRemark')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 接入信息 -->
        <collapse-card :title="$t('newAccess.accInfo')" v-model:collapse="show2">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockNetType') + ':'" prop="networkType">
                <el-select
                  v-model="form.networkType"
                  clearable
                  :placeholder="$t('newAccess.selectDockNetType')"
                  @change="changeAccNetType"
                >
                  <el-option
                    v-for="item in $parent.accessNetworkTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.auth') + ':'" prop="authType">
                <el-select
                  v-model="form.authType"
                  clearable
                  :placeholder="$t('newAccess.selectAuth')"
                  @focus="focusAuthType"
                >
                  <el-option
                    v-for="item in $parent.accessAuthTypeListFilter"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.authType == 1">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accAccount') + ':'" prop="account" key="account">
                <el-input v-model="form.account" :placeholder="$t('newAccess.inputAccAccount')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPwd') + ':'" prop="password" key="password">
                <el-input
                  type="password"
                  v-model="form.password"
                  :placeholder="$t('newAccess.inputAccPwd')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.authType == 2">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockAK') + ':'" prop="accessKey" key="accessKey">
                <el-input v-model="form.accessKey" :placeholder="$t('newAccess.inputDockAK')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('newAccess.dockSK') + ':'"
                prop="accessSecret"
                key="accessSecret"
              >
                <el-input v-model="form.accessSecret" :placeholder="$t('newAccess.inputDockSK')" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.networkType == 1">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPublicNetIP') + ':'" prop="accessHost">
                <el-input
                  v-model="form.accessHost"
                  :placeholder="$t('newAccess.inputAccPublicNetIP')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPublicNetPort') + ':'" prop="accessPort">
                <el-input
                  v-model="form.accessPort"
                  :placeholder="$t('newAccess.inputAccPublicNetPort')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.networkType == 2">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accNetIP') + ':'" prop="accessHost">
                <el-input v-model="form.accessHost" :placeholder="$t('newAccess.inputAccNetIP')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accNetPort') + ':'" prop="accessPort">
                <el-input
                  v-model="form.accessPort"
                  :placeholder="$t('newAccess.inputAccNetPort')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accVersion') + ':'" prop="version">
                <el-input v-model="form.version" :placeholder="$t('newAccess.inputAccVersion')" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accManufacturer') + ':'" prop="vendor">
                <el-input
                  v-model="form.vendor"
                  :placeholder="$t('newAccess.inputAccManufacturer')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.authType == 2">
            <el-col :span="12">
              <el-form-item
                :label="$t('newAccess.dockAccountNo') + ':'"
                prop="accessUserId"
                key="accessUserId"
              >
                <el-input
                  v-model="form.accessUserId"
                  :placeholder="$t('newAccess.inputDockUserNo')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.authType == 3">
            <el-col :span="12">
              <el-form-item
                :label="$t('newAccess.dockToken') + ':'"
                prop="accessToken"
                key="accessToken"
              >
                <el-input
                  v-model="form.accessToken"
                  :placeholder="$t('newAccess.inputDockToken')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 媒体播放配置 -->
        <collapse-card
          :title="$t('newAccess.mediaPlaySet')"
          v-model:collapse="show3"
          v-if="ifShowMedia"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.mediaDockWay') + ':'" prop="mediaAccessType">
                <el-select
                  v-model="form.mediaAccessType"
                  clearable
                  :placeholder="$t('newAccess.selectMediaDockWay')"
                >
                  <el-option
                    v-for="item in $parent.mediaAccessTypeListFilter"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ifShowMediaItem">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.SDKAccPublicNetIp') + ':'" prop="sdkNetworkIp">
                <el-input
                  v-model="form.sdkNetworkIp"
                  :placeholder="$t('newAccess.inputSDKAccPublicNetIp')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('newAccess.SDKAccPublicNetPort') + ':'"
                prop="sdkNetworkPort"
              >
                <el-input
                  v-model="form.sdkNetworkPort"
                  :placeholder="$t('newAccess.inputSDKAccPublicNetPort')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="ifShowMediaItem">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.SDKAccNetIP') + ':'" prop="sdkIntranetIp">
                <el-input
                  v-model="form.sdkIntranetIp"
                  :placeholder="$t('newAccess.inputSDKAccNetIP')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.SDKAccNetPort') + ':'" prop="sdkIntranetPort">
                <el-input
                  v-model="form.sdkIntranetPort"
                  :placeholder="$t('newAccess.inputSDKAccNetPort')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 平台配置 -->
        <collapse-card
          :title="$t('newAccess.platSet')"
          v-model:collapse="show4"
          v-if="ifShowHttpApi"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.protocol') + ':'" prop="platformConfig.schema">
                <el-select
                  v-model="form.platformConfig.schema"
                  clearable
                  :placeholder="$t('newAccess.selectProtocol')"
                >
                  <el-option
                    v-for="item in $parent.schemaList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('newAccess.apiPrefix') + ':'"
                prop="platformConfig.apiPrefix"
              >
                <el-input
                  v-model="form.platformConfig.apiPrefix"
                  :placeholder="$t('newAccess.inputApiPrefix')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitHandler" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- //网关选择 -->
    <el-dialog
      :title="$t('newAccess.selectGateway2')"
      v-model="showGateWay"
      top="10vh"
      width="1260px"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      class="gateway-choose"
      @close="dialogClosed1"
    >
      <gateway-choose
        @getChooseGateWay="getGateWay"
        ref="gateWayChoose"
        v-if="showGateWayChoose"
        :operation="operation"
        :choosedAccessPlatType="choosedAccessPlatType"
        :form="form"
      ></gateway-choose>
      <template #footer>
        <span class="dialog-footer" style="text-align: center">
          <el-button @click="dialogClosed1">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm1">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'
import GatewayChoose from './gateway-choose'
import { validateSpecialWord } from '@/utils/common/validator'

export default {
  name: 'accessPlatformAdd',
  components: {
    CollapseCard,
    GatewayChoose
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    thirdDeviceId: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: 'add',
      require: true
    },
    operation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      gatewayList: [],
      gatewayGroupJudge: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      loading: false,
      form: {
        // 基本信息
        organizationId: '',
        organizationName: '',
        platformType: '',
        accessName: '',
        platformScale: '',
        gatewayGroup: '',
        remark: '',
        ivsPlatId: '',
        accessHost: '',
        accessPort: '',
        platformNetworkPort: '',
        platformIntranetIp: '',
        platformIntranetPort: '',
        // 平台对接信息
        networkType: 1,
        authType: '',
        accessProtocolType: '',
        version: '',
        account: '',
        password: '',
        accessKey: '',
        accessSecret: '',
        accessUserId: '',
        accessToken: '',
        platformGbId: '',
        accessGbId: '',
        mediaAccessType: '',
        vendor: '',
        //平台配置
        platformConfig: {
          schema: '',
          apiPrefix: ''
        }
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },

      //接入平台
      showGateWay: false,
      choosedGateWay: '',
      showGateWayChoose: true,
      sendGatewayGroup: '',
      ifShowMedia: false,
      ifShowMediaItem: true,
      choosedAccessPlatType: undefined,

      ifShowHttpApi: false
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    formRules() {
      var zhengshu = /^\d+$/
      var validateScale = (rule, value, callback) => {
        if (value !== '') {
          if (!zhengshu.test(value)) {
            callback(new Error(this.$t('newAccess.scaleRule')))
          } else if (Number(value) > 200000) {
            callback(new Error(this.$t('newAccess.scaleRule')))
          }
        }
        callback()
      }

      var regGbId = /^[0-9a-zA-Z]{20}$/
      var validatePlatformGbId = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('newAccess.inputDockPlatNo')))
        } else if (!regGbId.test(value)) {
          callback(new Error(this.$t('newAccess.dockPlatNoRule')))
        } else if (value == this.form.accessGbId) {
          callback(new Error(this.$t('newAccess.PlatNoNotEqual')))
        }
        callback()
      }
      var validateAccessGbId = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('newAccess.inputAccGbId')))
        } else if (!regGbId.test(value)) {
          callback(new Error(this.$t('newAccess.accGbIdRule')))
        } else if (value == this.form.platformGbId) {
          callback(new Error(this.$t('newAccess.PlatNoNotEqual')))
        }
        callback()
      }
      return {
        //基本信息
        organizationName: [
          {
            required: true,
            message: this.$t('newAccess.selectBelongOrg'),
            trigger: 'change'
          }
        ],
        platformType: [
          {
            required: true,
            message: this.$t('newAccess.selectAccPlatType'),
            trigger: 'change'
          }
        ],
        accessName: [
          {
            required: true,
            message: this.$t('newAccess.inputAccName'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          },
          {
            validator: validateSpecialWord,
            trigger: 'blur'
          }
        ],
        ivsPlatId: [
          {
            required: true,
            message: this.$t('newAccess.pleaseAssociation'),
            trigger: 'change'
          }
        ],
        platformScale: [{ required: false, validator: validateScale, trigger: 'change' }],
        gatewayGroup: [
          {
            required: true,
            message: this.$t('newAccess.selectGateway1'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: false,
            message: this.$t('newAccess.inputRemark'),
            trigger: 'change'
          }
        ],
        //平台对接信息
        networkType: [
          {
            required: true,
            message: this.$t('newAccess.selectDockNetType'),
            trigger: 'change'
          }
        ],
        authType: [
          {
            required: true,
            message: this.$t('newAccess.selectAuth'),
            trigger: 'change'
          }
        ],
        accessProtocolType: [
          {
            required: true,
            message: this.$t('newAccess.selectDockProtocolType'),
            trigger: 'change'
          }
        ],
        version: [
          {
            max: 128,
            message: this.$t('newAccess.length128'),
            trigger: 'change'
          }
        ],
        accessHost: [
          {
            required: true,
            message: this.$t('newAccess.inputAccIP'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.inputTrueAccIP'),
            trigger: 'change'
          }
        ],
        accessPort: [
          {
            required: true,
            message: this.$t('newAccess.inputAccPort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        platformNetworkIp: [
          {
            required: true,
            message: this.$t('newAccess.inputAccPlatPublicNetIP'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.inputTrueIP'),
            trigger: 'change'
          }
        ],
        platformNetworkPort: [
          {
            required: true,
            message: this.$t('newAccess.inputAccPlatPublicNetPort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        platformIntranetIp: [
          {
            required: true,
            message: this.$t('newAccess.inputAccPlatNetIP'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.inputTrueIP'),
            trigger: 'change'
          }
        ],
        platformIntranetPort: [
          {
            required: true,
            message: this.$t('newAccess.accPlatNetPort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: this.$t('newAccess.inputDockAccount'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('newAccess.length128'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: this.form.authType == 1 ? true : false,
            message: this.$t('newAccess.inputDockPwd'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('newAccess.length32'),
            trigger: 'change'
          }
        ],
        accessKey: [
          {
            required: true,
            message: this.$t('newAccess.inputDockAK'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('newAccess.length128'),
            trigger: 'change'
          }
        ],
        accessSecret: [
          {
            required: true,
            message: this.$t('newAccess.inputDockSK'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('newAccess.length32'),
            trigger: 'change'
          }
        ],
        accessUserId: [
          {
            required: true,
            message: this.$t('newAccess.inputDockUserNo'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('newAccess.length128'),
            trigger: 'change'
          }
        ],
        accessToken: [
          {
            required: true,
            message: this.$t('newAccess.inputDockToken'),
            trigger: 'change'
          },
          {
            max: 1024,
            message: this.$t('newAccess.length1024'),
            trigger: 'change'
          }
        ],
        platformGbId: [
          {
            required: true,
            validator: validatePlatformGbId,
            trigger: 'change'
          }
        ],
        accessGbId: [{ required: true, validator: validateAccessGbId, trigger: 'change' }],
        //媒体播放配置
        mediaAccessType: [
          {
            required: true,
            message: this.$t('newAccess.selectMediaDockWay'),
            trigger: 'change'
          }
        ],
        sdkNetworkIp: [
          {
            required: false,
            message: this.$t('newAccess.inputSDKAccPublicNetIp'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.inputTrueIP'),
            trigger: 'change'
          }
        ],
        sdkNetworkPort: [
          {
            required: false,
            message: this.$t('newAccess.inputSDKAccPublicNetPort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        sdkIntranetIp: [
          {
            required: false,
            message: this.$t('newAccess.inputSDKAccNetIP'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.inputTrueIP'),
            trigger: 'change'
          }
        ],
        sdkIntranetPort: [
          {
            required: false,
            message: this.$t('newAccess.inputSDKAccNetPort'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],

        //平台配置
        'platformConfig.schema': [
          {
            required: false,
            message: this.$t('newAccess.selectProtocol'),
            trigger: 'change'
          }
        ],
        'platformConfig.apiPrefix': [
          {
            required: false,
            message: this.$t('newAccess.inputApiPrefix'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {},
  methods: {
    changeAccNetType() {
      this.form.accessHost = ''
      this.form.accessPort = ''
    },
    foucsGateWay() {
      if (!(this.form.platformType && this.form.platformType[1])) {
        this.$message({
          type: 'warning',
          message: this.$t('newAccess.selectAccPlatTypeFirst')
        })
        return
      }
      this.showGateWay = true
      this.$refs.gateWay.blur()
    },
    focusAuthType() {
      if (
        this.form.platformType === '' ||
        !(Array.isArray(this.form.platformType) && this.form.platformType.length)
      ) {
        this.$message({
          type: 'warning',
          message: this.$t('newAccess.selectAccPlatTypeFirst')
        })
        return
      }
    },
    dialogOpen() {
      this.ifShowMedia = false
      if (this.$refs.form) {
        this.showGateWayChoose = false
        this.$nextTick(() => {
          this.choosedGateWay = ''
          this.gatewayGroup = ''
          if (this.$parent.operation) {
            this.$parent.accessAuthTypeListFilter = []
          }

          this.showGateWayChoose = true
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        if (!this.$parent.operation) {
          this.form = { ...this.form, ...this.$parent.dataForm }
          this.choosedAccessPlatType =
            this.form.platformType === undefined ? undefined : this.form.platformType[1]
          this.sendGatewayGroup = this.$parent.dataForm.gatewayGroup
          //平台配置

          if (
            this.$parent.dataForm.platformType[1] == 15 ||
            this.$parent.dataForm.platformType == 15
          ) {
            this.ifShowHttpApi = true
          } else {
            this.ifShowHttpApi = false
          }
        }

        if (
          this.form.platformConfig.platformConfig != '' &&
          this.form.platformConfig.platformConfig != undefined
        ) {
          this.form.ivsPlatId = this.form.platformConfig.platformConfig
          this.gatewayGroupJudge = true
          this.selectAccessPlatforms()
        } else {
          this.gatewayGroupJudge = false
        }

        Object.assign(this.form, {
          organizationName: this.$parent.organizationName,
          organizationId: this.$parent.organizationId
        })
      })
    },

    getGateWay(gateway) {
      this.choosedGateWay = gateway
    },

    dialogClosed1() {
      this.showGateWay = false
    },

    selectAccessPlatforms() {
      let data = {
        pageInfo: { pageNum: 1, pageSize: 10 },
        platAbility: 'SURVEILLANCE',
        platformName: '',
        platformStatus: null,
        platformType: 5
      }
      this.gatewayList = []
      this.$api.selectAccessPlatforms(data).then(res => {
        if (res.resultCode == 0) {
          this.gatewayList = res.platformList
        }
      })
    },

    async changePlatType(val) {
      this.form.platformConfig.schema = ''
      this.form.platformConfig.apiPrefix = ''
      this.gatewayGroupJudge = false
      if (val && val[1] == 15) {
        this.ifShowHttpApi = true
      } else {
        this.gatewayGroupJudge = true
        this.ifShowHttpApi = false
        this.selectAccessPlatforms()
      }

      this.choosedAccessPlatType = Array.isArray(val) ? val[1] : undefined

      this.showGateWayChoose = false
      this.$nextTick(() => {
        this.showGateWayChoose = true
      })

      this.choosedGateWay = ''
      this.form.gatewayGroup = ''

      for (let i = 0; i < this.$parent.accessPlatTypeList.length; i++) {
        for (let j = 0; j < this.$parent.accessPlatTypeList[i].platTypeList.length; j++) {
          if (val && val[1] == this.$parent.accessPlatTypeList[i].platTypeList[j].platTypeCode) {
            //鉴权方式(切换类型时清空)
            this.form.authType = ''
            this.form.account = ''
            this.form.password = ''

            this.form.accessKey = ''
            this.form.accessSecret = ''
            this.form.accessUserId = ''

            this.form.accessToken = ''

            //平台编号清空
            this.form.platformGbId = ''
            this.form.accessGbId = ''

            if (val.length) {
              this.$parent.accessAuthTypeListFilter = this.$parent.accessAuthTypeList.filter(
                item => {
                  return (
                    this.$parent.accessPlatTypeList[i].platTypeList[j].authenticationTypes.indexOf(
                      item.value
                    ) != -1
                  )
                }
              )
            } else {
              this.$parent.accessAuthTypeListFilter = []
            }

            if (val.length) {
              this.$parent.mediaAccessTypeListFilter = this.$parent.mediaAccessTypeList.filter(
                item => {
                  return (
                    this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes.indexOf(
                      item.value + ''
                    ) != -1
                  )
                }
              )
            } else {
              this.$parent.mediaAccessTypeListFilter = []
            }

            //媒体配置判断
            if (
              this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes.indexOf('1') != -1
            ) {
              this.form.mediaAccessType = Number(
                this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes[0]
              )

              this.ifShowMedia = true
              this.ifShowMediaItem = true
            } else {
              if (this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes.length < 2) {
                this.ifShowMedia = false
                this.ifShowMediaItem = false
                this.form.mediaAccessType = Number(
                  this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes[0]
                )
              } else {
                this.form.mediaAccessType = Number(
                  this.$parent.accessPlatTypeList[i].platTypeList[j].mediaAccessTypes[0]
                )
                this.ifShowMedia = true
                this.ifShowMediaItem = false
              }
            }

            //对接协议
            this.form.accessProtocolType =
              this.$parent.accessPlatTypeList[i].platTypeList[j].protocolType
            return
          }
        }
      }

      this.showGateWayChoose = false
      this.$nextTick(() => {
        this.showGateWayChoose = true
      })
    },

    submitForm1() {
      if (!this.choosedGateWay.gatewayGroup || !this.choosedGateWay.gatewayIp) {
        this.form.gatewayGroup = ''
      } else {
        let gatewayIpArr = []
        for (let i = 0; i < this.choosedGateWay.gatewayIp.length; i++) {
          gatewayIpArr.push(' ' + this.choosedGateWay.gatewayIp[i])
        }
        this.form.gatewayGroup =
          this.choosedGateWay.gatewayGroup + '(' + gatewayIpArr.join(',') + ')'
      }

      this.sendGatewayGroup = this.choosedGateWay.gatewayGroup

      this.showGateWay = false
    },

    changeAuthType() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate(['accessUserId'])
        this.$refs['form'].clearValidate(['accessToken'])
      })
    },

    submitHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          //新的接入传参
          let obj = {
            ivsPlatId: this.form.ivsPlatId,
            organizationId: this.$parent.organizationId,
            gatewayGroup: this.sendGatewayGroup,
            accessName: this.form.accessName,
            accessHost: this.form.accessHost,
            accessPort: this.form.accessPort,
            authType: this.form.authType,
            account: this.form.account,
            password: this.form.password,
            appKey: this.form.accessKey,
            appSecret: this.form.accessSecret,
            version: this.form.version,
            vendor: this.form.vendor,
            remark: this.form.remark,

            networkType: this.form.networkType,

            accessProtocolType: this.form.accessProtocolType,

            mediaAccessType: this.form.mediaAccessType
          }

          obj.platformType =
            typeof this.form.platformType == 'object'
              ? this.form.platformType[1]
              : this.form.platformType

          obj.authType = Number(obj.authType)

          //平台配置
          if (obj.platformType == 15) {
            obj.platformConfig = this.form.platformConfig
          }
          if (!this.$parent.operation) {
            obj.platformConfig = {
              platformConfig: this.form.ivsPlatId,
              apiPrefix: this.form.platformConfig.apiPrefix,
              schema: this.form.platformConfig.schema
            }
          }

          if (this.$parent.operation) {
            if (obj.platformId) {
              delete obj.platformId
            }

            this.$api
              .addAlgorithmAccessInfoNew(obj)
              .then(res => {
                if (res.resultCode == 0) {
                  this.successBack()
                }
              })
              .finally(() => {
                this.$parent.maskloading = false
              })
          } else {
            Object.assign(obj, {
              accessId: this.$parent.choosedAccessId
            })
            if (obj.password === '') {
              delete obj.password
            }
            this.$api
              .modifyAlgorithmAccessInfo(obj)
              .then(res => {
                if (res.resultCode == 0) {
                  this.successBack()
                }
              })
              .finally(() => {
                this.$parent.maskloading = false
              })
          }
        }
      })
    },

    successBack() {
      this.$message({
        type: 'success',
        message: this.$parent.operation
          ? this.$t('public.addSuccess')
          : this.$t('public.modifySuccess')
      })
      this.dialogFormVisible = false
      this.$parent.getList()
      this.$parent.maskloading = false
    },
    dialogClosed() {
      const form = {
        // 基本信息
        organizationId: '',
        organizationName: '',
        platformType: '',
        accessName: '',
        platformScale: '',
        gatewayGroup: '',
        remark: '',
        ivsPlatId: '',
        accessHost: '',
        accessPort: '',
        platformNetworkPort: '',
        platformIntranetIp: '',
        platformIntranetPort: '',
        // 平台对接信息
        networkType: 1,
        authType: '',
        accessProtocolType: '',
        version: '',
        account: '',
        password: '',
        accessKey: '',
        accessSecret: '',
        accessUserId: '',
        accessToken: '',
        platformGbId: '',
        accessGbId: '',
        mediaAccessType: '',
        vendor: '',
        //平台配置
        platformConfig: {
          schema: '',
          apiPrefix: ''
        }
      }
      this.form = JSON.parse(JSON.stringify(form))
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss">
#accessAlgorithmAddDialog {
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item__error {
    position: absolute !important;
  }

  .appendIpt {
    .el-input .el-input__inner {
      width: 180px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .el-input .el-input-group__append {
      color: #000;
      background-color: transparent;
      padding: 0 8px;
      border: none;
    }
  }
  .el-input,
  .el-input__wrapper,
  .el-input__inner,
  .el-cascader .el-input__wrapper {
    width: 282px;
    height: 36px;
    border-radius: 4px;
    background: transparent;
    color: #232c3b;
  }

  & .gateway-choose {
    .el-input,
    .el-input__wrapper,
    .el-input__inner,
    .el-cascader .el-input__wrapper {
      width: 215px;
    }
  }

  .el-form-item {
    display: flex;
    align-items: center;
  }
  .el-form-item__label {
    color: #333;
    padding: 0 5px 0 0;
  }

  .single-line {
    width: 100%;
    box-sizing: border-box;

    .el-form-item__content {
      width: calc(100% - 133px);
    }

    .el-textarea__inner {
      background: transparent;
      border-radius: 4px;
      height: 100px;
      border: 1px solid #c1c7d0;
      color: #232c3b;
    }
  }
  .platformScaleCol {
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
