<template>
  <div id="ownDomainViewClass" ref="ownDomainViewClass">
    <h2 style="margin: 20px 0 0 40px;font-size:16px;">{{ $t('cascadeDevice.localLibrary') }}</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="locale == 'en' ? '280px' : '180px'"
      label-position="left"
      class="ownDomainViewClassForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('platformManagement.encoding') + ':'" prop="internetCode">
            <el-input
              v-model="form.internetCode"
              :placeholder="$t('platformManagement.inputInterconnectionCode')"
              clearable
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('cascadeDevice.securityCode') + ':'"
            prop="publicSecurityOrgCode"
          >
            <el-input
              v-model="form.publicSecurityOrgCode"
              :placeholder="$t('cascadeDevice.inputSecurityCode')"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.libraryIP') + ':'" prop="ip">
            <el-input
              v-model="form.ip"
              :placeholder="$t('cascadeDevice.inputLibraryIP')"
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.libraryPort') + ':'" prop="port">
            <el-input
              v-model="form.port"
              :placeholder="$t('cascadeDevice.inputLibraryPort')"
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.storageTime') + ':'" prop="storeTime">
            <el-input
              v-model="form.storeTime"
              :placeholder="$t('cascadeDevice.inputStorageTime')"
              clearable
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.heartbeatInterval') + ':'" prop="interval">
            <el-input
              v-model="form.interval"
              :placeholder="$t('cascadeDevice.inputHeartbeatInterval')"
              clearable
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.publicIP') + ':'" prop="natIp">
            <el-input
              v-model="form.natIp"
              :placeholder="$t('cascadeDevice.inputPublicIP')"
              clearable
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.publicPort') + ':'" prop="natPort">
            <el-input
              v-model="form.natPort"
              :placeholder="$t('cascadeDevice.inputPublicPort')"
              clearable
              :readonly="!editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('cascadeDevice.natMapping') + ':'" prop="natMapping">
            <el-radio-group v-model="form.natMapping">
              <el-radio :label="true" v-if="form.natMapping || editFlag">
                {{ $t('workOrder.yes') }}
              </el-radio>
              <el-radio :label="false" v-if="form.natMapping === false || editFlag">
                {{ $t('workOrder.no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- //5.7.4新增 -->
      <div class="addDiv">
        <el-icon class="addIcon" @click="addVig" v-if="editFlag">
          <el-icon-circle-plus-outline />
        </el-icon>
      </div>

      <el-form-item :label="$t('cascadeDevice.accessGateway') + ':'">
        <el-table
          :data="form.vigInfoList"
          style="width: 100%; margin: 0px 0 30px"
          :row-class-name="tableRowClassName"
          border
          class="tableFormItem"
        >
          <template #empty>
            <span>{{ dataText }}</span>
          </template>
          <el-table-column :label="$t('newAccess.gatewayIP')" min-width="110" show-overflow-tooltip>
            <template #default="{ row, $index }">
              <div @dblclick="IPDbclick(row)" style="width: 100%; height: 100%">
                <el-form-item
                  :prop="'vigInfoList.' + $index + '.ip'"
                  :rules="rules.netIp"
                  :class="!row.isIPOK && !row.isPortOK ? 'showBottom' : ''"
                  v-if="row.isIPOK"
                >
                  <el-input
                    v-model="row.ip"
                    @blur="IPInputBlur(row)"
                    :placeholder="$t('newAccess.inputGatewayIP')"
                    ref="IPInput"
                  ></el-input>
                </el-form-item>
                <span v-else>{{ row.ip }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('cascadeDevice.gatewayPort')"
            min-width="110"
            show-overflow-tooltip
          >
            <template #default="{ row, $index }">
              <div @dblclick="portDbclick(row)" style="width: 100%; height: 100%">
                <el-form-item
                  :prop="'vigInfoList.' + $index + '.port'"
                  :rules="rules.netPort"
                  :class="!row.isIPOK && !row.isPortOK ? 'showBottom' : ''"
                  v-if="row.isPortOK"
                >
                  <el-input
                    v-model="row.port"
                    @blur="portInputBlur(row)"
                    :placeholder="$t('cascadeDevice.inputGatewayPort')"
                    ref="portInput"
                  ></el-input>
                </el-form-item>
                <span v-else>{{ row.port }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cascadeDevice.protocol')"
            min-width="110"
            show-overflow-tooltip
          >
            <template #default="{ row, $index }">
              <div @dblclick="protocolDbclick(row)" style="width: 100%; height: 100%">
                <el-form-item
                  :prop="'vigInfoList.' + $index + '.protocol'"
                  :rules="rules.protocol"
                  :class="!row.isProtocolOK && !row.isProtocolOK ? 'showBottom' : ''"
                  v-if="row.isProtocolOK"
                >
                  <el-select v-model="row.protocol">
                    <el-option label="http" value="http"></el-option>
                    <el-option label="https" value="https"></el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ row.protocol }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('public.operating')" min-width="90">
            <template #default="scope">
              <span
                class="cell-operate"
                @click="handleEdit(scope.row)"
                v-if="PermissionManage && editFlag && !scope.row.operation && !scope.row.editting"
              >
                {{ $t('public.modify') }}
              </span>
              <span
                style="margin-right: 7px; color: #10a9ff"
                v-if="PermissionManage && editFlag && !scope.row.operation && scope.row.editting"
              >
                {{ $t('cascadeDevice.modification') }}
              </span>
              <span
                style="color: #f56c6c; cursor: pointer"
                @click="handleCancel(scope.$index)"
                v-if="PermissionManage && editFlag && scope.row.operation"
              >
                {{ $t('algoAllocate.cancelAdd') }}
              </span>

              <span
                style="color: #f56c6c; cursor: pointer"
                @click="handleDel(scope.row)"
                v-if="PermissionManage && editFlag && !scope.row.operation"
              >
                {{ $t('public.delete') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="edit">{{ $t('public.edit') }}</el-button>

      <el-button type="primary" @click="save" :loading="maskloading">
        {{ $t('tenantManage.preserve') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { CirclePlus as ElIconCirclePlusOutline } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconCirclePlusOutline
  },
  name: 'LocalDomainViewLibrary',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      PermissionManage: true,
      form: {
        internetCode: '',
        publicSecurityOrgCode: '',
        ip: '',
        port: '',
        storeTime: '',
        interval: '',
        natMapping: '',
        natIp: '',
        natPort: '',
        protocol: '',
        vigInfoList: []
      },
      rules: {},
      dataText: '',
      maskloading: false,
      editFlag: false
    }
  },
  created() {
    this.setFormRules()
    this.setData()
    this.getLocalPlatInfo()
  },
  methods: {
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    setData() {
      this.dataText = this.$t('public.noData')
    },
    setFormRules() {
      let regInt = /^\d+$/
      let validateInterval = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('cascadeDevice.heartbeatNotEmpty')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('cascadeDevice.heartbeatInteger')))
        } else {
          callback()
        }
      }
      let validateStoreTime = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('cascadeDevice.storageNotEmpty')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('cascadeDevice.storageInteger')))
        } else {
          callback()
        }
      }
      this.rules = {
        netIp: [
          {
            required: true,
            message: this.$t('cascadeDevice.gatewayNotEmpty'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('public.puIpError'),
            trigger: 'change'
          }
        ],
        netPort: [
          {
            required: true,
            message: this.$t('cascadeDevice.portNotEmpty'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        protocol: [
          {
            required: true,
            message: this.$t('cascadeDevice.protocolNotEmpty'),
            trigger: 'change'
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t('cascadeDevice.addressNotEmpty'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('public.puIpError'),
            trigger: 'change'
          }
        ],
        publicSecurityOrgCode: [
          {
            required: true,
            message: this.$t('cascadeDevice.codeNotEmpty'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('cascadeDevice.ViePortNotEmpty'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'change'
          }
        ],
        natMapping: [
          {
            required: true,
            message: this.$t('cascadeDevice.whetherNATMapping'),
            trigger: 'change'
          }
        ],
        interval: [
          {
            required: true,
            validator: validateInterval,
            trigger: 'change'
          }
        ],
        internetCode: [
          {
            required: true,
            message: this.$t('cascadeDevice.interconnectionNotEmpty'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9]{20}$/,
            message: this.$t('primaryDevice.interconnectCodeError')
          }
        ],
        storeTime: [
          {
            required: true,
            validator: validateStoreTime,
            trigger: 'change'
          }
        ]
      }
    },

    getLocalPlatInfo() {
      this.$api.getLocalPlatformInfo({}).then(res => {
        this.form = JSON.parse(JSON.stringify(res))
      })
    },

    IPDbclick(row) {
      if (!row.operation && !row.editting) {
        this.$message({
          type: 'info',
          message: this.$t('cascadeDevice.operationFirst')
        })
        return
      }
      row.isIPOK = true
      this.IPFocus()
    },
    IPFocus() {
      this.$nextTick(() => {
        this.$refs.IPInput.focus()
      })
    },
    IPInputBlur(row) {
      let regIP =
        /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
      if (row.ip == '' || row.ip == this.$t('newAccess.inputGatewayIP') || !regIP.test(row.ip)) {
        row.isIPOK = true
      } else {
        row.isIPOK = false
      }
    },

    portDbclick(row) {
      if (!row.operation && !row.editting) {
        this.$message({
          type: 'info',
          message: this.$t('cascadeDevice.operationFirst')
        })
        return
      }
      row.isPortOK = true
      this.portFocus()
    },
    protocolDbclick(row) {
      if (!row.operation && !row.editting) {
        this.$message({
          type: 'info',
          message: this.$t('cascadeDevice.operationFirst')
        })
        return
      }
      row.isProtocolOK = true
    },
    portFocus() {
      this.$nextTick(() => {
        this.$refs.portInput.focus()
      })
    },
    portInputBlur(row) {
      let regPort =
        /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (
        row.port == '' ||
        row.port == this.$t('cascadeDevice.inputGatewayPort') ||
        !regPort.test(row.port)
      ) {
        row.isPortOK = true
      } else {
        row.isPortOK = false
      }
    },
    handleEdit(row) {
      row.editting = true
      row.isIPOK = true
      row.isPortOK = true
      row.isProtocolOK = true
    },
    handleCancel(index) {
      this.form.vigInfoList.splice(index, 1)
    },
    handleDel(row) {
      this.$confirm(this.$t('cascadeDevice.isDeleteGateway'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.delVig({ id: row.id }).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getLocalPlatInfo()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    edit() {
      this.editFlag = true
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let addFlag = false
          for (let i = 0; i < this.form.vigInfoList.length; i++) {
            if (this.form.vigInfoList[i].operation || this.form.vigInfoList[i].editting) {
              addFlag = true
              if (!this.form.vigInfoList[i].ip || !this.form.vigInfoList[i].port) {
                this.$message({
                  type: 'warning',
                  message: this.$t('cascadeDevice.gatewayInformationFirst')
                })
                return
              }
            }
          }

          let forArr = []
          if (addFlag) {
            for (let i = 0; i < this.form.vigInfoList.length; i++) {
              if (this.form.vigInfoList[i].operation || this.form.vigInfoList[i].editting) {
                forArr.push(this.form.vigInfoList[i])
              }
            }
          }

          let formobj = JSON.parse(JSON.stringify(this.form))

          this.$api.updateLocalPlatformInfo(formobj).then(res => {
            if (res.resultCode == 0) {
              if (addFlag) {
                this.batchOperate(forArr)
              } else {
                this.successResult()
              }
            }
          })
        }
      })
    },

    batchOperate(forArr) {
      for (let a = 0; a < forArr.length; a++) {
        if (forArr[a].operation) {
          this.$api.addVig({ vigInfo: forArr[a] }).then(res1 => {
            if (res1.resultCode == 0) {
              if (a == forArr.length - 1) {
                this.successResult()
              }
            }
          })
        } else if (forArr[a].editting) {
          this.$api.updateVig({ vigInfo: forArr[a] }).then(res1 => {
            if (res1.resultCode == 0) {
              if (a == forArr.length - 1) {
                this.successResult()
              }
            }

            for (let i = 0; i < this.form.vigInfoList.length; i++) {
              if (this.form.vigInfoList[i].id == forArr[a].id) {
                this.form.vigInfoList[a].editting = false
                this.form.vigInfoList[a].isIPOK = false
                this.form.vigInfoList[a].isPortOK = false
                break
              }
            }
          })
        }
      }
    },

    successResult() {
      this.getLocalPlatInfo()
      this.$message({
        type: 'success',
        message: this.$t('devModel.saveSucc')
      })
      this.editFlag = false
    },

    addVig() {
      let obj = {
        ip: '',
        port: '',
        protocol: '',
        isProtocolOK: true,
        isIPOK: true,
        isPortOK: true,
        operation: true
      }
      this.form.vigInfoList.push(obj)
    }
  }
}
</script>

<style lang="scss">
#ownDomainViewClass {
  .dialog-footer {
    text-align: center;
  }
  .ownDomainViewClassForm {
    padding: 50px 15% 0px;
    .el-tooltip {
      width: 100% !important;
    }
  }
  .addDiv {
    text-align: right;
    margin-bottom: 5px;
    .addIcon {
      font-size: 17px;
      cursor: pointer;
    }
  }
  .tableFormItem {
    .showBottom {
      margin-bottom: 0px !important;
    }
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>
