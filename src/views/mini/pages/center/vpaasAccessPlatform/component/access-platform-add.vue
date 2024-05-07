<template>
  <div id="vpaasAccessPlatformAddDialog">
    <el-dialog
      :title="$parent.operation ? $t('accessPlatform.addVpaas') : $t('accessPlatform.editVpaas')"
      :visible.sync="$parent.dialogFormVisible"
      top="10vh"
      :width="locale == 'en' ? '1575px' : '1150px'"
      :close-on-click-modal="false"
      @open="dialogOpen"
      :draggable="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        :label-width="locale == 'en' ? '270px' : '175px'"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <!-- 基本信息 -->
        <collapse-card :title="$t('accessPlatform.essentialInformation')" v-model:collapse="show1">
          <div class="grid-container">
            <el-form-item :label="$t('accessPlatform.organization') + '：'" prop="organizationName">
              <el-input
                v-model="form.organizationName"
                :placeholder="$t('accessPlatform.selectYourOrganization')"
                disabled
              />
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.accessPlatformName') + '：'" prop="platName">
              <el-input
                v-model="form.platName"
                :placeholder="$t('accessPlatform.inputAccessPlatformName')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.vpaasPlatform') + '：'" prop="vpaasPlatId">
              <el-select
                v-model="form.vpaasPlatId"
                clearable
                :placeholder="$t('accessPlatform.selectVpaasPlatform')"
                @change="vpaasPlatIdChange"
                :disabled="!$parent.operation"
                :no-data-text="$t('accessPlatform.noVpaasPlatform')"
              >
                <el-option
                  v-for="item in $parent.vpaasPlatIdList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.accessPlatformLevel') + '：'" prop="platType">
              <el-select
                v-model="form.platType"
                clearable
                :placeholder="$t('accessPlatform.selectAccessPlatformLevel')"
                @change="platTypeChange"
                :disabled="platTypeDisabled || !$parent.operation"
              >
                <el-option
                  v-for="item in $parent.platTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.domainList') + '：'" prop="domainCode">
              <el-select
                v-model="form.domainCode"
                clearable
                :placeholder="$t('accessPlatform.selectDomainList')"
                :disabled="domainCodeDisabled || !$parent.operation"
                @change="domainCodeChange"
                :no-data-text="$t('accessPlatform.noDomain')"
              >
                <el-option
                  v-for="item in domainList"
                  :key="item.domainCode"
                  :label="item.domainName"
                  :value="item.domainCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.accessScale') + '：'" prop="accessScale">
              <el-input
                class="access-scale"
                v-model.number="form.accessScale"
                type="number"
                :placeholder="$t('accessPlatform.inputAccessScale')"
                :disabled="!$parent.operation ? true : accessScaleDisabled"
                clearable
              />
              <span>{{ accessScale }}/20W</span>
            </el-form-item>
          </div>
        </collapse-card>

        <!-- 平台对接信息 -->
        <collapse-card :title="$t('accessPlatform.platAccessInfo')" v-model:collapse="show2">
          <div class="grid-container">
            <el-form-item :label="$t('accessPlatform.ownerCode') + '：'" prop="ownerCode">
              <el-input
                v-model="form.ownerCode"
                :placeholder="$t('accessPlatform.inputOwnerCode')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.accessCode') + '：'" prop="accessCode">
              <el-input
                v-model="form.accessCode"
                :placeholder="$t('accessPlatform.inputAccessCode')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('accessPlatform.platformIp') + '：'"
              prop="platIp"
              :required="!(form.platType === 2 && $parent.operation)"
            >
              <el-input
                v-model="form.platIp"
                :placeholder="$t('accessPlatform.inputPlatformIp')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('accessPlatform.platformPort') + '：'"
              prop="platPort"
              :required="!(form.platType === 2 && $parent.operation)"
            >
              <el-input
                v-model.number="form.platPort"
                type="number"
                :placeholder="$t('accessPlatform.inputPlatformPort')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('accessPlatform.authenticationMode') + '：'"
              prop="accessAuthType"
            >
              <el-select
                v-model="form.accessAuthType"
                clearable
                :placeholder="$t('accessPlatform.selectAuthenticationMode')"
                @change="accessAuthTypeChange"
              >
                <el-option
                  v-for="item in accessAuthTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <p class="safe" v-if="isShowTip">{{ $t('accessPlatform.anthModeTip') }}</p>
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.accessPassword') + '：'" prop="accessPassword">
              <el-input
                v-model="form.accessPassword"
                :placeholder="$t('accessPlatform.inputAccessPassword')"
                type="password"
                clearable
              />
            </el-form-item>
          </div>
        </collapse-card>

        <!-- 平台配置 -->
        <collapse-card
          :title="$t('accessPlatform.platformConfigurationInfo')"
          v-model:collapse="show3"
        >
          <div class="grid-container">
            <el-form-item
              v-if="form.platType === 1"
              :label="$t('accessPlatform.keepaliveTime') + '：'"
              prop="keepaliveTime"
            >
              <el-input
                v-model.number="form.keepaliveTime"
                type="number"
                :placeholder="$t('accessPlatform.inputKeepaliveTime')"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="form.platType === 2"
              :label="$t('accessPlatform.keepaliveTime') + '：'"
              prop="catalogInterval"
            >
              <el-input
                v-model.number="form.catalogInterval"
                type="number"
                :placeholder="$t('accessPlatform.inputKeepaliveTime')"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="form.platType === 2"
              :label="$t('accessPlatform.subscribeCycleForCatalog') + '：'"
              prop="subscribeCycleForCatalog"
            >
              <el-input
                v-model.number="form.subscribeCycleForCatalog"
                type="number"
                :placeholder="$t('accessPlatform.inputSubscribeCycleForCatalog')"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="form.platType === 1"
              :label="$t('accessPlatform.registerValidity') + '：'"
              prop="registerValidity"
            >
              <el-input
                v-model.number="form.registerValidity"
                type="number"
                :placeholder="$t('accessPlatform.inputRegisterValidity')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="
                form.platType === 1
                  ? $t('accessPlatform.transProtocol1') + '：'
                  : $t('accessPlatform.transProtocol') + '：'
              "
              prop="transProtocol"
            >
              <el-select
                v-model="form.transProtocol"
                clearable
                :placeholder="
                  form.platType === 1
                    ? $t('accessPlatform.selectTransProtocol1')
                    : $t('accessPlatform.selectTransProtocol')
                "
              >
                <el-option
                  v-for="item in $parent.transProtocolList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('accessPlatform.characterSet') + '：'" prop="characterSet">
              <el-select
                v-model="form.characterSet"
                clearable
                :placeholder="$t('accessPlatform.selectCharacterSet')"
              >
                <el-option
                  v-for="item in $parent.characterSetList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.platType === 1"
              :label="$t('accessPlatform.catalogSize') + '：'"
              prop="catalogSize"
            >
              <el-select
                v-model.number="form.catalogSize"
                clearable
                :placeholder="$t('accessPlatform.inputCatalogSize')"
              >
                <el-option
                  v-for="item in $parent.catalogSizeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.platType === 1"
              :label="$t('accessPlatform.streamNet') + '：'"
              prop="streamNet"
            >
              <el-select
                v-model="form.streamNet"
                clearable
                :placeholder="$t('accessPlatform.inputStreamNet')"
              >
                <el-option
                  v-for="item in $parent.networkTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.platType === 1"
              :label="$t('accessPlatform.platRecordFromCenter') + '：'"
              prop="platRecordFromCenter"
            >
              <el-switch v-model="form.platRecordFromCenter"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="form.platType === 2"
              :label="$t('accessPlatform.networkName') + '：'"
              prop="networkName"
            >
              <el-select
                v-model="form.networkName"
                clearable
                :placeholder="$t('accessPlatform.selectNetworkName')"
              >
                <el-option
                  v-for="item in $parent.networkTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </collapse-card>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$parent.dialogFormVisible = false">
            {{ $t('public.cancel') }}
          </el-button>
          <el-button type="primary" :loading="$parent.maskloading" @click="submitHandler">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'

export default {
  name: 'VpaasAccessPlatformAdd',
  components: {
    CollapseCard
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isShowTip: false,
      show1: true,
      show2: true,
      show3: true,
      loading: false,
      form: {
        organizationId: undefined,
        organizationName: undefined,
        platName: undefined,
        vpaasPlatId: undefined,
        platType: undefined,
        domainCode: undefined,
        accessScale: undefined,
        ownerCode: undefined,
        accessCode: undefined,
        platIp: undefined,
        platPort: undefined,
        accessPassword: undefined,
        accessAuthType: undefined,
        keepaliveTime: undefined,
        registerValidity: 3600,
        transProtocol: 2,
        characterSet: 'gb2312',
        catalogSize: 1,
        streamNet: 'private',
        platRecordFromCenter: false,
        networkName: undefined,
        subscribeCycleForCatalog: 600,
        catalogInterval: 3600,
        thirdPlatformId: undefined
      },
      platTypeDisabled: true,
      domainCodeDisabled: true,
      domainList: [],
      accessScale: 0,
      accessScaleDisabled: true,
      accessAuthTypeList: [],
      formRules: {}
    }
  },
  computed: {
    accessAuthType() {
      return this.form.accessAuthType
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(async () => {
        
        if (!this.$parent.operation) {
          this.form = Object.assign({}, this.form, this.$parent.dataForm)
          await this.$parent.getVpaasPlatIdList(this.form.organizationId)
          const vpaasType = this.form.platType === 1 ? 3 : 2
          this.getAccessAuthTypeList()
          this.domainList = await this.getDomainQueryList(vpaasType)
          await this.getDomainAccessCount(this.form.domainCode)
        } else {
          this.form.organizationName = this.$parent.organizationName
          this.form.organizationId = this.$parent.organizationId
          await this.$parent.getVpaasPlatIdList(this.form.organizationId)
        }
      })
    },
    setFormRules() {
      const regex = /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9.·\-_\s]*$/u
      // 验证名称
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('accessPlatform.inputAccessPlatformName')))
        } else {
          if (!regex.test(value)) {
            callback(new Error(this.$t('public.nameError4')))
          }
          callback()
        }
      }
      this.formRules = {
        organizationName: [
          {
            required: true,
            message: this.$t('accessPlatform.selectYourOrganization'),
            trigger: 'change'
          }
        ],
        platName: [
          {
            required: true,
            validator: validateUsername,
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('public.validate.charLimit', { num: 256 }),
            trigger: 'change'
          }
        ],
        vpaasPlatId: [
          {
            required: true,
            message: this.$t('accessPlatform.selectVpaasPlatform'),
            trigger: 'change'
          }
        ],
        platType: [
          {
            required: true,
            message: this.$t('accessPlatform.selectAccessPlatformLevel'),
            trigger: 'change'
          }
        ],
        domainCode: [
          {
            required: true,
            message: this.$t('accessPlatform.selectDomainList'),
            trigger: 'change'
          }
        ],
        accessScale: [
          {
            required: true,
            message: this.$t('accessPlatform.inputAccessScale'),
            trigger: 'change'
          },
          {
            validator: this.accessScaleValidator,
            trigger: 'change'
          }
        ],
        ownerCode: [
          {
            required: true,
            message: this.$t('accessPlatform.inputOwnerCode'),
            trigger: 'change'
          },
          {
            validator: this.ownerCodeValidator,
            trigger: 'blur'
          }
        ],
        accessCode: [
          {
            required: true,
            message: this.$t('accessPlatform.inputAccessCode'),
            trigger: 'change'
          },
          {
            validator: this.accessCodeValidator,
            trigger: 'blur'
          }
        ],
        platIp: [
          {
            validator: this.platIpValidator,
            trigger: 'change'
          },
          {
            validator: this.platIpValidator,
            trigger: 'blur'
          }
        ],
        platPort: [
          {
            validator: this.platPortValidator,
            trigger: 'change'
          },
          {
            validator: this.platPortValidator,
            trigger: 'blur'
          }
        ],
        accessPassword: [
          {
            required: this.form.accessAuthType !== 0,
            validator: this.accessPasswordValidator,
            trigger: 'change'
          }
        ],
        accessAuthType: [
          {
            required: true,
            message: this.$t('accessPlatform.selectAuthenticationMode'),
            trigger: 'change'
          }
        ],
        keepaliveTime: [
          {
            required: true,
            message: this.$t('accessPlatform.inputKeepaliveTime'),
            trigger: 'change'
          },
          {
            pattern: /^[5-9]$|^[1-9]\d{1,2}$|^[1-2]\d{3}$|^25[0-5]$/,
            message: this.$t('accessPlatform.inputKeepaliveTimeValidate'),
            trigger: 'change'
          }
        ],
        catalogInterval: [
          {
            required: true,
            message: this.$t('accessPlatform.inputKeepaliveTime'),
            trigger: 'change'
          }
        ],
        registerValidity: [
          {
            required: true,
            message: this.$t('accessPlatform.inputRegisterValidity'),
            trigger: 'change'
          },
          {
            pattern: /^(?:[1-9][0-9]{3,4}|100000)$/,
            message: this.$t('accessPlatform.inputRegisterValidityValidate'),
            trigger: 'change'
          }
        ],

        transProtocol: [
          {
            required: true,
            validator: this.transProtocolValidator,
            trigger: 'change'
          }
        ],
        characterSet: [
          {
            required: true,
            message: this.$t('accessPlatform.selectCharacterSet'),
            trigger: 'change'
          }
        ],
        catalogSize: [
          {
            required: true,
            message: this.$t('accessPlatform.inputCatalogSize'),
            trigger: 'change'
          }
        ],
        streamNet: [
          {
            required: true,
            message: this.$t('accessPlatform.inputStreamNet'),
            trigger: 'change'
          }
        ],
        platRecordFromCenter: [
          {
            required: true,
            message: this.$t('accessPlatform.inputCatalogSize'),
            trigger: 'change'
          }
        ],
        networkName: [
          {
            required: true,
            message: this.$t('accessPlatform.selectNetworkName'),
            trigger: 'change'
          }
        ],
        subscribeCycleForCatalog: [
          {
            required: true,
            message: this.$t('accessPlatform.inputSubscribeCycleForCatalog'),
            trigger: 'change'
          }
        ]
      }
    },
    vpaasPlatIdChange(val) {
      this.platTypeDisabled = val ? false : true
    },
    async platTypeChange(val) {
      let vType = undefined
      this.isShowTip = false
      this.form.domainCode = undefined
      this.getAccessAuthTypeList()
      if (val === 1) {
        vType = 3
        this.form.keepaliveTime = 60
        this.form.accessAuthType = 3
        this.form.registerValidity = 3600
      } else if (val === 2) {
        vType = 2
        this.form.accessAuthType = 2
        this.form.catalogInterval = 3600
      } else {
        this.form.keepaliveTime = undefined
        this.form.catalogInterval = undefined
        this.form.accessAuthType = undefined
        return
      }

      this.domainList = await this.getDomainQueryList(vType)
      this.domainCodeDisabled = false
    },
    getAccessAuthTypeList() {
      if (this.form.platType === 1) {
        this.accessAuthTypeList = [
          {
            name: 'MD5',
            value: 1
          },
          {
            name: 'SHA-1',
            value: 2
          },
          {
            name: 'SHA-256',
            value: 3
          }
        ]
      } else if (this.form.platType === 2) {
        this.accessAuthTypeList = [
          {
            name: this.$t('accessPlatform.accessAuthType0'),
            value: 0
          },
          {
            name: 'MD5',
            value: 1
          },
          {
            name: 'SHA-256',
            value: 2
          }
        ]
      } else {
        this.accessAuthTypeList = []
      }
    },
    async getDomainQueryList(vpaasType) {
      const res = await this.$api.getDomainQueryList({
        vpaasType,
        organizationId: this.form.organizationId,
        platId: this.form.vpaasPlatId,
        pageInfo: { pageNum: 1, pageSize: 5000 }
      })
      if (res.resultCode === 0 && res.domainList) {
        return res.domainList
      } else {
        return []
      }
    },
    async domainCodeChange(val) {
      if (val) {
        await this.getDomainAccessCount(val)
      }
    },
    async getDomainAccessCount(domainCode) {
      const res = await this.$api.getDomainAccessCount({
        domainCode
      })
      if (res.resultCode === 0) {
        this.accessScale = res.count
        this.accessScaleDisabled = false
      } else {
        this.accessScale = 0
        this.accessScaleDisabled = true
      }
    },
    accessAuthTypeChange(val) {
      this.formRules.accessPassword[0].required = val !== 0
      if (
        (this.form.platType == 1 && [1, 2].indexOf(val) > -1) ||
        (this.form.platType == 2 && [1, 0].indexOf(val) > -1)
      ) {
        this.isShowTip = true
      } else {
        this.isShowTip = false
      }
    },
    submitHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.platType === 2) {
            const accessCodeValidation = this.form.accessCode.startsWith(this.form.domainCode)
            if (!accessCodeValidation) {
              return this.$alert(
                this.$t('accessPlatform.accessCodeTip', { domainCode: this.form.domainCode }),
                this.$t('public.prompt'),
                {
                  confirmButtonText: this.$t('public.confirm'),
                  type: 'warning'
                }
              )
            }
          }

          this.$parent.maskloading = true
          let form = JSON.parse(JSON.stringify(this.form))
          form.organizationName && delete form.organizationName
          if (form.platType === 1) {
            form.catalogInterval && delete form.catalogInterval
            form.subscribeCycleForCatalog && delete form.subscribeCycleForCatalog
            form.networkName && delete form.networkName
          } else {
            form.keepaliveTime && delete form.keepaliveTime
            form.registerValidity && delete form.registerValidity
            form.catalogSize && delete form.catalogSize
            form.streamNet && delete form.streamNet
            form.platRecordFromCenter && delete form.platRecordFromCenter
          }
          if (this.$parent.operation) {
            this.$api.addVpaasPlatformInfo(form).then(res => {
              this.successBack(res)
            })
          } else {
            form.createBy && delete form.createBy
            form.createTime && delete form.createTime
            form.enable && delete form.enable
            form.resultCode && delete form.resultCode
            form.resultDesc && delete form.resultDesc
            form.status && delete form.status
            form.updateBy && delete form.updateBy
            form.updateTime && delete form.updateTime
            this.$api.modifyVpaasPlatformInfo(form).then(res => {
              this.successBack(res)
            })
          }
        }
      })
    },
    successBack(res) {
      if (res.resultCode == 0) {
        this.$message({
          type: 'success',
          message: this.$parent.operation
            ? this.$t('public.addSuccess')
            : this.$t('public.modifySuccess')
        })
        this.$parent.dialogFormVisible = false
        this.$parent.getList()
      }
      this.$parent.maskloading = false
    },
    accessScaleValidator(rule, value, callback) {
      const scale = 200000 - this.accessScale
      if (scale > 0) {
        if (value > scale) {
          callback(new Error(this.$t('accessPlatform.accessScaleWarn1')))
        } else if (value <= 0) {
          callback(new Error(this.$t('accessPlatform.accessScaleWarn2')))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('accessPlatform.accessScaleWarn3')))
      }
    },
    ownerCodeValidator(rule, value, callback) {
      const reg = /^[0-9]{20}$/
      if (reg.test(value)) {
        const code = parseInt(value.slice(10, 13))
        if (code < 200 || code > 299) {
          callback(new Error(this.$t('accessPlatform.codeValidator')))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('accessPlatform.inputOwnerCodeValidate')))
      }
    },
    accessCodeValidator(rule, value, callback) {
      const reg = /^[0-9]{20}$/
      if (reg.test(value)) {
        const code = parseInt(value.slice(10, 13))
        if (code < 200 || code > 299) {
          callback(new Error(this.$t('accessPlatform.codeValidator')))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('accessPlatform.inputAccessCodeValidate')))
      }
    },
    platIpValidator(rule, value, callback) {
      const reg = /^-?((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/
      if (!(this.form.platType === 2 && this.$parent.operation)) {
        if (!value) {
          callback(new Error(this.$t('accessPlatform.inputPlatformIp')))
        } else if (!reg.test(value)) {
          callback(new Error(this.$t('public.puIpError')))
        } else {
          callback()
        }
      } else {
        if (value) {
          if (!reg.test(value)) {
            return callback(new Error(this.$t('public.puIpError')))
          } else {
            return callback()
          }
        } else {
          callback()
        }
      }
    },
    platPortValidator(rule, value, callback) {
      const reg =
        /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (!(this.form.platType === 2 && this.$parent.operation)) {
        if (!value) {
          callback(new Error(this.$t('accessPlatform.inputPlatformPort')))
        } else if (!reg.test(value)) {
          callback(new Error(this.$t('public.puPortError')))
        } else {
          callback()
        }
      } else {
        if (value) {
          if (!reg.test(value)) {
            callback(new Error(this.$t('public.puPortError')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    accessPasswordValidator(rule, value, callback) {
      const reg = /^[A-Za-z0-9!#$%&*.\-_@]{5,64}$/
      if (this.form.accessAuthType !== 0) {
        if (!value) {
          callback(this.$t('accessPlatform.inputAccessPassword'))
        } else if (!reg.test(value)) {
          callback(this.$t('accessPlatform.accessPasswordValidate'))
        } else {
          callback()
        }
      } else {
        if (value) {
          if (!reg.test(value)) {
            callback(this.$t('accessPlatform.accessPasswordValidate'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    transProtocolValidator(rule, value, callback) {
      if (this.form.platType === 1) {
        if (!value) {
          callback(new Error(this.$t('accessPlatform.selectTransProtocol1')))
        } else {
          callback()
        }
      } else if (this.form.platType === 2) {
        if (!value) {
          callback(new Error(this.$t('accessPlatform.selectTransProtocol')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    dialogClose() {
      this.accessScale = 0
    }
  }
}
</script>

<style lang="scss">
#vpaasAccessPlatformAddDialog {
  .el-dialog__body {
    padding: 20px;
  }
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 20px;
    .access-scale {
      width: 70%;
    }
  }
  .el-input__wrapper {
    height: 36px;
    border: 1px solid #c1c7d0;
    border-radius: 4px;
    background: transparent;
  }
  .el-input__inner {
    background: transparent;
    color: #262626;
  }

  .el-form-item__label {
    color: #333;
    padding: 0 5px 0 0;
  }
}
.safe {
  font-size: 12px;
  color: #d00;
}
</style>
