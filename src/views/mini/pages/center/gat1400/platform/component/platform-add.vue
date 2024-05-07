<template>
  <div>
    <el-dialog
      :title="
        $parent.operation
          ? $t('platformManagement.addLibraryPlatform')
          : $t('platformManagement.reviseLibraryPlatform')
      "
      v-model="$parent.addMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1400px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="viewClassAddDialog"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :validate-on-rule-change="false"
        :label-width="locale == 'en' ? '360px' : '140px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 组织 -->
            <el-form-item
              :label="$t('platformManagement.Affiliation') + ':'"
              prop="organizationName"
            >
              <el-cascader
                v-model="form.organizationName"
                :props="propsCas"
                clearable
                @change="changeOrg"
              ></el-cascader>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 平台名称 -->
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
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('platformManagement.viewName') + ':'" prop="platformName">
              <el-input
                v-model="form.platformName"
                :placeholder="$t('platformManagement.inputViewName')"
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 设备协议类型 -->
            <el-form-item :label="$t('platformManagement.encoding') + ':'" prop="resourceUri">
              <el-input
                v-model="form.resourceUri"
                :placeholder="$t('platformManagement.inputInterconnectionCode')"
                clearable
                :disabled="!$parent.operation"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('platformManagement.libraryLevels') + ':'" prop="type">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.type"
                :placeholder="$t('platformManagement.selectLibraryLevels')"
                v-if="$parent.operation"
              >
                <el-option
                  v-for="(item, index) in $parent.typeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                :placeholder="$parent.setType(form.type)"
                clearable
                disabled
                v-if="!$parent.operation"
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item
              :label="$t('platformManagement.connectionProtocol') + ':'"
              prop="protocol"
              class="bigRadio"
            >
              <el-radio-group v-model="form.protocol">
                <el-radio :label="1">http</el-radio>
                <el-radio :label="2">https</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('platformManagement.IPAddress') + ':'" prop="ip">
              <el-input
                v-model="form.ip"
                :placeholder="$t('platformManagement.inputIPAddress')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('platformManagement.portNumber') + ':'" prop="port">
              <el-input
                v-model="form.port"
                :placeholder="$t('platformManagement.inputPortNumber')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('platformManagement.authenticationmethod') + ':'"
              prop="algorithm"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.algorithm"
                @change="accessAuthTypeChange"
                :placeholder="$t('platformManagement.selectAuthenticationmethod')"
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
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('platformManagement.forcePush') + ':'"
              prop="forcePush"
              v-if="form.type == 1"
              class="bigRadio"
            >
              <el-radio-group v-model="form.forcePush">
                <el-radio :label="true">{{ $t('platformManagement.true') }}</el-radio>
                <el-radio :label="false">{{ $t('platformManagement.false') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('platformManagement.authenticationAccount') + ':'"
              prop="ownAccount"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                v-model="form.ownAccount"
                :placeholder="$t('platformManagement.inputAuthenticationAccount')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('platformManagement.peerAccount') + ':'"
              prop="account"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                v-model="form.account"
                :placeholder="$t('platformManagement.inputPeerAccount')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('platformManagement.authenticationPassword') + ':'"
              prop="ownPassword"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                :type="passw"
                v-model="form.ownPassword"
                :placeholder="$t('platformManagement.selectAuthenticationPassword')"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('platformManagement.passwordConfirmation') + ':'"
              prop="ownPasswordConfirm"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                :type="passw"
                v-model="form.ownPasswordConfirm"
                :placeholder="$t('platformManagement.inputPasswordConfirmation')"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('platformManagement.downloadViewURL') + ':'"
              prop="autoDownloadUrl"
              v-if="form.type == 2"
              class="bigRadio"
            >
              <el-radio-group v-model="form.autoDownloadUrl">
                <el-radio :label="true">{{ $t('platformManagement.true') }}</el-radio>
                <el-radio :label="false">{{ $t('platformManagement.false') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('platformManagement.peerPassword') + ':'"
              prop="password"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                :type="passw"
                v-model="form.password"
                :placeholder="$t('platformManagement.inputAuthenticationPassword')"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('platformManagement.peerConfirmation') + ':'"
              prop="passwordConfirm"
              v-if="form.algorithm && form.algorithm != '1'"
            >
              <el-input
                :type="passw"
                v-model="form.passwordConfirm"
                :placeholder="$t('platformManagement.inputPeerConfirmation')"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('platformManagement.transferAutomatically') + ':'"
              prop="autoAllocate"
              v-if="form.type == 2"
              class="bigRadio"
            >
              <el-radio-group v-model="form.autoAllocate">
                <el-radio :label="true">{{ $t('platformManagement.true') }}</el-radio>
                <el-radio :label="false">{{ $t('platformManagement.false') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <el-form-item :label="$t('public.remark') + '：'" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="$t('public.pleaseInputremark')"
            type="textarea"
            maxlength="256"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>

        <!-- //5.7.4新增 -->
        <el-form-item
          :label="$t('platformManagement.configuration') + ':'"
          prop="dataSendList"
          v-if="form.type == 1"
        >
          <el-table
            class="table-Border-color"
            :data="form.dataSendList"
            style="width: 100%; margin: 0px 0 30px"
            :row-class-name="$parent.tableRowClassName"
            border
          >
            <template #empty>
              <span style="font-size: 14px">{{ $t('public.noData') }}</span>
            </template>
            <el-table-column
              :label="$t('platformManagement.dataCategories')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.dataType }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.whetherPush')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-radio-group v-model="row.ifSend">
                  <el-radio :label="true">{{ $t('platformManagement.true') }}</el-radio>
                  <el-radio :label="false">{{ $t('platformManagement.false') }}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.imageConfiguration')"
              width="240"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-radio-group v-model="row.bigImgSet">
                  <el-radio :label="1">{{ $t('platformManagement.pushURL') }}</el-radio>
                  <el-radio :label="0">{{ $t('platformManagement.pushImages') }}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('platformManagement.subgraphConfiguration')"
              min-width="110"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-radio-group v-model="row.smallImgSet">
                  <el-radio :label="1">{{ $t('platformManagement.pushURL') }}</el-radio>
                  <el-radio :label="0">{{ $t('platformManagement.pushImages') }}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">
            {{ $t('public.cancel') }}
          </el-button>

          <el-button
            type="primary"
            v-preventReClick
            @click="addMainDevSubmit"
            :loading="$parent.maskloading"
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,

      organizationId: '',
      organizationName: '',
      isShowTip: false,
      form: {
        organizationId: '',
        organizationName: '',
        platformName: '',
        resourceUri: '',
        type: 1,
        protocol: 2,
        algorithm: '4',
        ownAccount: '',
        ownPassword: '',
        account: '',
        password: '',
        ip: '',
        port: '',
        remark: '',

        //5.7.4新增
        dataSendList: [
          {
            dataType: this.$t('platformManagement.personnelData'),
            ifSend: true,
            bigImgSet: 1,
            smallImgSet: 1
          },
          {
            dataType: this.$t('platformManagement.faceData'),
            ifSend: true,
            bigImgSet: 1,
            smallImgSet: 1
          },
          {
            dataType: this.$t('platformManagement.vehicleData'),
            ifSend: true,
            bigImgSet: 1,
            smallImgSet: 1
          },
          {
            dataType: this.$t('platformManagement.nonVehicleData'),
            ifSend: true,
            bigImgSet: 1,
            smallImgSet: 1
          }
        ],

        autoDownloadUrl: true,
        autoAllocate: true,

        ownPasswordConfirm: '',
        passwordConfirm: '',

        forcePush: true
      },
      dataText: '',

      rules: {},

      longlatMapVisible: false,

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,

      propsCas: {
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
      }
    }
  },
  mounted() {
    this.setFormRules()
  },

  watch: {},

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
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
      })
    },
    dialogClosed() {
      this.$parent.addMainDevVisible = false
      this.organizationId = ''
    },
    accessAuthTypeChange(val) {
      if (['4', ''].indexOf(val) > -1) {
        this.isShowTip = false
      } else {
        this.isShowTip = true
      }
    },
    setFormRules() {
      var validateOwnPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('platformManagement.inputPasswordConfirmation')))
        } else if (value != this.form.ownPassword) {
          callback(new Error(this.$t('platformManagement.confirmPassword')))
        } else {
          callback()
        }
      }
      var validatePwd = (rule, value, callback) => {
        if (this.form.password) {
          if (value === '') {
            callback(new Error(this.$t('platformManagement.inputPeerConfirmation')))
          } else if (value != this.form.password) {
            callback(new Error(this.$t('platformManagement.confirmPeerPassword')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      var regResourceUri = /^[0-9]{20}$/
      var validateResourceUri = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('platformManagement.inputInterconnectionCode')))
        } else if (!regResourceUri.test(value)) {
          callback(new Error(this.$t('platformManagement.encode20Digits')))
        } else {
          callback()
        }
      }
      var regPlatformName = /^[\w\-\u4e00-\u9fa5]{0,64}$/
      var validatePlatformName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('platformManagement.inputViewName')))
        } else if (!regPlatformName.test(value)) {
          callback(new Error(this.$t('platformManagement.inputzhEn')))
        } else {
          callback()
        }
      }
      var testSpecial = (rule, value, callback) => {
        var pattern = new RegExp(
          "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]"
        )
        if (pattern.test(value)) {
          callback(new Error(this.$t('platformManagement.cantContainSpecial')))
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
        organizationName: [
          {
            required: true,
            message: this.$t('platformManagement.organizationNotEmpty'),
            trigger: 'change'
          }
        ],
        platformName: [
          {
            required: true,
            validator: validatePlatformName,
            trigger: 'change'
          }
        ],
        resourceUri: [
          {
            required: true,
            validator: validateResourceUri,
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('platformManagement.selectLibraryLevels'),
            trigger: 'change'
          }
        ],
        protocol: [
          {
            required: true,
            message: this.$t('platformManagement.selectConnectionProtocol'),
            trigger: 'change'
          }
        ],
        algorithm: [
          {
            required: true,
            message: this.$t('platformManagement.selectAuthenticationmethod'),
            trigger: 'change'
          }
        ],
        autoAllocate: [
          {
            required: true,
            message: this.$t('platformManagement.selectAutomatically'),
            trigger: 'change'
          }
        ],
        ownAccount: [
          {
            required: true,
            message: this.$t('platformManagement.inputAuthenticationAccount'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('platformManagement.length32'),
            trigger: 'change'
          },
          {
            required: true,
            validator: testSpecial,
            trigger: 'change'
          }
        ],
        ownPassword: [
          {
            required: true,
            message: this.$t('platformManagement.selectAuthenticationPassword'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('platformManagement.length128'),
            trigger: 'change'
          }
        ],
        account: [
          {
            required: false,
            message: this.$t('platformManagement.inputPeerAccount'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('platformManagement.length32'),
            trigger: 'change'
          },
          {
            required: false,
            validator: testSpecial,
            trigger: 'change'
          }
        ],
        password: [
          {
            required: false,
            message: this.$t('platformManagement.inputAuthenticationPassword'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('platformManagement.length128'),
            trigger: 'change'
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t('platformManagement.inputIPAddress'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('platformManagement.inputTrueIP'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('platformManagement.inputPortNumber'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('platformManagement.port65535'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: false,
            message: this.$t('public.pleaseInputremark'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('platformManagement.length256'),
            trigger: 'change'
          }
        ],
        //5.7.4新增
        dataSendList: [
          {
            required: true,
            message: this.$t('platformManagement.pushConfiguration'),
            trigger: 'change'
          }
        ],
        autoDownloadUrl: [
          {
            required: true,
            message: this.$t('platformManagement.selectDownloadURL'),
            trigger: 'change'
          }
        ],

        ownPasswordConfirm: [
          {
            required: true,
            validator: validateOwnPwd,
            trigger: 'change'
          }
        ],

        passwordConfirm: [
          {
            required: false,
            validator: validatePwd,
            trigger: 'change'
          }
        ],

        forcePush: [
          {
            required: true,
            message: this.$t('platformManagement.selectForcePush'),
            trigger: 'change'
          }
        ]
      }
    },

    changeOrg(val) {
      this.form.organizationId = JSON.parse(JSON.stringify(val)).pop()
    },

    changeRadio(row) {
      if (!row.ifSend) {
        row.bigImgSet = null
        row.smallImgSet = null
      }
    },

    //密码的隐藏和显示
    showPass() {
      this.passw = this.passw == 'password' ? 'text' : 'password'
      this.iconShow = !this.iconShow
    },

    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
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
        organizationId: form.organizationId,
        algorithm: form.algorithm,
        protocol: form.protocol,
        resourceUri: form.resourceUri,
        platformName: form.platformName,
        type: form.type,
        account: form.algorithm != '1' && form.algorithm != '' ? form.account : null,
        ownAccount: form.algorithm != '1' && form.algorithm != '' ? form.ownAccount : null,
        ip: form.ip,
        port: form.port,
        remark: form.remark
      }

      if (form.algorithm != '1' && form.algorithm != '') {
        if (form.password !== '' && form.password !== null) {
          data.password = form.password
        }

        if (form.ownPassword !== '' && form.ownPassword !== null) {
          data.ownPassword = form.ownPassword
        }
      } else {
        data.password = null
        data.ownPassword = null
      }

      if (this.form.type == 1) {
        //数据推送配置
        data.pushPerson = this.form.dataSendList[0].ifSend
        data.personMinPic = this.form.dataSendList[0].smallImgSet
        data.personBigPic = this.form.dataSendList[0].bigImgSet

        data.pushFace = this.form.dataSendList[1].ifSend
        data.faceMinPic = this.form.dataSendList[1].smallImgSet
        data.faceBigPic = this.form.dataSendList[1].bigImgSet

        data.pushVehicle = this.form.dataSendList[2].ifSend
        data.vehicleMinPic = this.form.dataSendList[2].smallImgSet
        data.vehicleBigPic = this.form.dataSendList[2].bigImgSet

        data.pushNonVehicle = this.form.dataSendList[3].ifSend
        data.nonVehicleMinPic = this.form.dataSendList[3].smallImgSet
        data.nonVehicleBigPic = this.form.dataSendList[3].bigImgSet

        //强制推送
        data.forcePush = this.form.forcePush
      } else if (this.form.type == 2) {
        data.autoAllocate = this.form.autoAllocate
        data.autoDownloadUrl = this.form.autoDownloadUrl
      }

      this.$parent.maskloading = true
      if (this.$parent.operation) {
        this.$api.addVirPlatform(data).then(res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      } else {
        data.platformId = this.$parent.choosedId
        this.$api.modifyVirPlatform(data).then(res => {
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
      this.$parent.getViewPlatList()
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.viewClassAddDialog {
  .el-dialog__body .form-flex {
    padding: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #c0c4cc !important;
  }
}
</style>
