<template>
  <div>
    <el-dialog
      :title="$t('primaryDevice.batchAccess')"
      v-model="$parent.addMainDevBatchVisible"
      top="10vh"
      :width="locale == 'en' ? '1400px' : '1300px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      id="addDeviceBatchDialog"
    >
      <el-steps :active="addActive" align-center>
        <el-step :title="$t('primaryDevice.retrievalequipment')"></el-step>
        <el-step :title="$t('primaryDevice.batchAccess')"></el-step>
        <el-step :title="$t('primaryDevice.accessComplete')"></el-step>
      </el-steps>
      <el-form
        v-show="addActive == 0"
        ref="form"
        :model="form"
        :label-width="locale == 'en' ? '200px' : '156px'"
        style="margin-top: 50px"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 组织 -->
            <el-form-item
              :label="$t('public.organizationName') + '：'"
              prop="organizationName"
              :rules="rules.organizationName"
            >
              <el-cascader
                class="inputGroup"
                v-model="form.organizationName"
                :props="propsCas"
                :show-all-levels="false"
                :placeholder="this.$parent.organizationName"
                clearable
                @change="changeOrg"
              >
                <template #default="{ data }">
                  <span v-if="data.payload.type == 1">
                    <i class="aci-organization iconCss1 aci" style="color: white"></i>
                    {{ data.label }}
                  </span>
                  <span v-if="data.payload.type == 2">
                    <i class="aci-x006-folder iconCss1 aci" style="color: white"></i>
                    {{ data.label }}
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 平台名称 -->
            <el-form-item :label="$t('public.platName') + '：'" prop="platId" :rules="rules.platId">
              <el-select
                :popper-append-to-body="false"
                v-model="form.platId"
                :placeholder="$t('public.pleaseInputplatName')"
              >
                <el-option
                  v-for="(item, index) in AddplatNameLists"
                  :key="index"
                  :label="item.platName"
                  :value="item.platId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="addIPbutton" @click="addDomain">
          <el-icon><el-icon-plus /></el-icon>
        </div>
        <el-form-item
          v-for="(domain, index) in form.ips"
          :key="domain.key"
          style="margin-bottom: 20px"
        >
          <p
            v-if="index == 0"
            style="
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #c0c4cc;
              margin: 0;
            "
          >
            {{ $t('primaryDevice.sameNetworkSegment') }}
          </p>
          <div class="form-flex ipsstyle">
            <el-form-item
              :prop="'ips.' + index + '.startIP'"
              style="width: 45%; margin-bottom: 0px"
              :rules="rules.ip"
            >
              <ip-address-input v-model="domain.startIP"></ip-address-input>
            </el-form-item>
            <span>——</span>
            <el-form-item
              :prop="'ips.' + index + '.endIP'"
              style="width: 45%; margin-bottom: 0px"
              :rules="rules.ip"
            >
              <ip-address-input v-model="domain.endIP"></ip-address-input>
            </el-form-item>
            <el-icon @click="removeDomain(domain)" style="cursor: pointer"><el-icon-delete /></el-icon>
          </div>
        </el-form-item>
      </el-form>
      <div v-show="addActive == 1" class="equipmentTab">
        <el-form
          ref="equipmentForm"
          :model="equipmentForm"
          :label-width="locale == 'en' ? '100px' : '60px'"
          label-position="left"
        >
          <div class="form-flex inputAccount">
            <!-- 账号密码 -->
            <el-form-item
              :label="$t('public.account') + '：'"
              prop="account"
              style="width: 25%"
              :rules="equipmentRules.account"
            >
              <el-input v-model="equipmentForm.account"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('public.password') + '：'"
              prop="password"
              style="width: 25%; margin-left: 20px !important"
              :rules="equipmentRules.password"
            >
              <el-input v-model="equipmentForm.password"></el-input>
            </el-form-item>
            <el-button
              type="primary"
              style="margin-left: 30px"
              :disabled="verificationShow"
              @click="batchVerificationSubmit()"
              :loading="batchMaskloading"
            >
              {{ $t('primaryDevice.batchVerification') }}
            </el-button>
          </div>
        </el-form>
        <div class="form-flex">
          <span>{{ $t('primaryDevice.loaded') + ':' }} &nbsp;&nbsp;</span>
          <el-progress
            v-if="addActive == 1 || addActive == 2"
            :percentage="equipmentRate"
            :stroke-width="8"
          ></el-progress>
          <span style="margin-left: 10px">
            {{
              $t('primaryDevice.retrievedEquipment', {
                num: contentForm.tableData.length
              })
            }}
          </span>
        </div>
        <!-- 表格 -->
        <div class="devicetable">
          <el-form ref="contentForm" :model="contentForm" class="contentForm">
            <el-table
              v-show="!loading"
              ref="devicetable"
              :data="contentForm.tableData"
              @selection-change="handleSelectionChange"
              border
            >
              <template #empty>
                <span>{{ dataText }}</span>
              </template>
              <el-table-column label width="50" type="selection" />
              <el-table-column
                :label="$t('accessAllocate.ipAddress')"
                min-width="66"
                show-overflow-tooltip
                prop="puIp"
              >
                <template #default="{ row }">
                  <span>{{ row.puIp }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('public.mainDevSn')"
                min-width="80"
                show-overflow-tooltip
                prop="mainDevId"
              >
                <template #default="{ row }">
                  <span>{{ row.mainDevId }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('public.mainDevName')" min-width="90" prop="mainDevName">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.mainDevName'"
                    :rules="row.ischecked ? contentForm.contentRules.mainDevName : {}"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.mainDevName || row.mainDevName == undefined"
                      :content="row.mainDevName"
                      placement="top-start"
                    >
                      <el-input v-model="row.mainDevName"></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.mainDevType')" min-width="90" prop="mainDevType">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.mainDevType'"
                    :rules="
                      row.ischecked ? contentForm.contentRules.mainDevType : { required: false }
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.mainDevType || row.mainDevType == undefined"
                      :content="
                        !row.mainDevType || row.mainDevType == undefined
                          ? ''
                          : $parent.mainDevTypeData.find(item => item.AmainDev == row.mainDevType)
                              .mainDevName
                      "
                      placement="top"
                    >
                      <el-select clearable :popper-append-to-body="false" v-model="row.mainDevType">
                        <el-option
                          v-for="(item, index) in $parent.mainDevTypeData"
                          :key="index"
                          ref="myselect"
                          :label="item.mainDevName"
                          :value="item.AmainDev"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('primaryDevice.channels')"
                min-width="70"
                prop="maxVideoNum"
              >
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.maxVideoNum'"
                    :rules="
                      row.ischecked && row.mainDevType == 1
                        ? contentForm.contentRules.maxVideoNum
                        : { required: false }
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.maxVideoNum || row.maxVideoNum == undefined"
                      :content="
                        !row.maxVideoNum || row.maxVideoNum == undefined
                          ? ''
                          : $parent.maxVideoNumData.find(
                              item => item.maxVideoNum == row.maxVideoNum
                            ).maxVideoName
                      "
                      placement="top"
                    >
                      <el-select
                        clearable
                        :popper-append-to-body="false"
                        v-model="row.maxVideoNum"
                        :disabled="row.mainDevType != 1"
                      >
                        <el-option
                          v-for="(item, index) in $parent.maxVideoNumData"
                          :key="index"
                          :label="item.maxVideoName"
                          :value="item.maxVideoNum"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('public.manufacturer')"
                min-width="94"
                prop="manufacturer"
              >
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.manufacturer'"
                    :rules="row.ischecked ? contentForm.contentRules.manufacturer : {}"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.manufacturer || row.manufacturer == undefined"
                      :content="
                        !row.manufacturer || row.manufacturer == undefined
                          ? ''
                          : $parent.manufacturerData.find(item => item.value == row.manufacturer)
                              .name
                      "
                      placement="top"
                    >
                      <el-select
                        clearable
                        :popper-append-to-body="false"
                        v-model="row.manufacturer"
                      >
                        <el-option
                          v-for="(item, index) in $parent.manufacturerData"
                          :key="index"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="$t('primaryDevice.ptzType')" min-width="86" prop="ptzType">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.ptzType'"
                    :rules="row.ischecked ? contentForm.contentRules.ptzType : {}"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.ptzType || row.ptzType == undefined"
                      :content="
                        !row.ptzType || row.ptzType == undefined
                          ? ''
                          : $parent.ptzTypeData.find(item => item.value == row.ptzType).name
                      "
                      placement="top"
                    >
                      <el-select clearable :popper-append-to-body="false" v-model="row.ptzType">
                        <el-option
                          v-for="(item, index) in $parent.ptzTypeData"
                          :key="index"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column :label="$t('primaryDevice.puPort')" min-width="84" prop="puPort">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.puPort'"
                    :rules="row.ischecked ? contentForm.contentRules.puPort : { required: false }"
                  >
                    <el-input v-model="row.puPort" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.account')" min-width="70" prop="account">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.account'"
                    :rules="row.ischecked ? contentForm.contentRules.account : {}"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.account || row.account == undefined"
                      :content="row.account"
                      placement="top-start"
                    >
                      <el-input
                        v-model="row.account"
                        :disabled="row.status == 'success'"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.password')" min-width="70" prop="password">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="'tableData.' + $index + '.password'"
                    :rules="row.ischecked ? contentForm.contentRules.password : {}"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="!row.password || row.password == undefined"
                      :content="row.password"
                      placement="top-start"
                    >
                      <el-input
                        v-model="row.password"
                        :disabled="row.status == 'success'"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.operating')" min-width="90" show-overflow-tooltip>
                <template #default="{ row }">
                  <span
                    v-if="row.status == 'progress'"
                    class="cell-operate"
                    @click="verificationSubmit(row)"
                  >
                    {{ $t('primaryDevice.verification') }}
                  </span>
                  <span
                    v-if="row.status == 'failed'"
                    class="cell-operate danger"
                    @click="verificationSubmit(row)"
                  >
                    {{ $t('primaryDevice.revalidation') }}
                  </span>
                  <span v-if="row.status == 'success'" style="margin-right: 7px; color: #67c23a">
                    {{ $t('primaryDevice.validationSucceeded') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
      <div v-show="addActive == 2" class="accessTab">
        <p>
          <span>
            {{
              $t('primaryDevice.verificationdEquipment', {
                num: accessTable.length
              })
            }}
            &nbsp;&nbsp;&nbsp;
            {{ $t('primaryDevice.successfulAccess') + ':' }} &nbsp;
            <el-button type="primary">{{ accessSuccess.length }}</el-button>
            &nbsp;&nbsp;{{ $t('primaryDevice.accessFailure') + ':' }}&nbsp;
            <el-button type="danger">{{ accessTable.length - accessSuccess.length }}</el-button>
          </span>
        </p>
        <el-table
          v-show="!loading"
          ref="multipleTable"
          :data="accessTable"
          @selection-change="handleSelectionChange"
          border
        >
          <template #empty>
            <span>{{ dataText }}</span>
          </template>
          <el-table-column
            :label="$t('accessAllocate.ipAddress')"
            min-width="60"
            show-overflow-tooltip
            prop="mainDevId"
          >
            <template #default="{ row }">
              <span>{{ row.puIp }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('public.mainDevSn')"
            min-width="110"
            show-overflow-tooltip
            prop="mainDevId"
          >
            <template #default="{ row }">
              <span>{{ row.mainDevId }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('public.mainDevName')"
            min-width="100"
            show-overflow-tooltip
            prop="mainDevName"
          >
            <template #default="{ row }">
              <span>{{ row.mainDevName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('public.mainDevType')"
            min-width="70"
            show-overflow-tooltip
            prop="mainDevType"
          >
            <template #default="{ row }">
              <span>
                {{
                  $parent.mainDevTypeData.find(item => item.AmainDev == row.mainDevType).mainDevName
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('primaryDevice.channels')" min-width="110" prop="maxVideoNum">
            <template #default="{ row }">
              <span>
                {{
                  !row.maxVideoNum || row.maxVideoNum == undefined
                    ? ''
                    : $parent.maxVideoNumData.find(item => item.maxVideoNum == row.maxVideoNum)
                        .maxVideoName
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('public.manufacturer')"
            min-width="90"
            show-overflow-tooltip
            prop="manufacturer"
          >
            <template #default="{ row }">
              <span>
                {{ $parent.manufacturerData.find(item => item.value == row.manufacturer).name }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('primaryDevice.ptzType')"
            min-width="80"
            show-overflow-tooltip
            prop="ptzType"
          >
            <template #default="{ row }">
              <span>
                {{ $parent.ptzTypeData.find(item => item.value == row.ptzType).name }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('primaryDevice.puPort')"
            min-width="70"
            show-overflow-tooltip
            prop="puPort"
          >
            <template #default="{ row }">
              <span>{{ row.puPort }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('primaryDevice.result')"
            min-width="110"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span style="margin-right: 7px; color: #67c23a" v-if="row.accessStatus == 'success'">
                {{ $t('primaryDevice.success') }}
              </span>
              <span style="margin-right: 7px; color: #f56c6c" v-if="row.accessStatus == 'failed'">
                {{ $t('primaryDevice.fail') }}
                <span v-if="row.failedDec">({{ row.failedDec }})</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed">{{ $t('public.cancel') }}</el-button>

          <el-button
            type="primary"
            @click="previousStep()"
            v-show="addActive == 1 || addActive == 2"
          >
            {{ $t('alarmLinkage.previousStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="nextStep"
            v-show="addActive == 0 || addActive == 1"
            :loading="addActive == 1 && addMaskloading"
          >
            {{ $t('alarmLinkage.nextStep') }}
          </el-button>
          <el-button
            type="primary"
            :loading="$parent.maskloading"
            v-show="addActive == 2"
            @click="sure()"
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <long-lat-map />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Plus as ElIconPlus, Delete as ElIconDelete } from '@element-plus/icons-vue'
import longlatmap from '@/components/long-lat-map'
import ipAddressInput from '@/components/ipAddressInput'
export default {
  components: {
    'long-lat-map': longlatmap,
    'ip-address-input': ipAddressInput,
    ElIconPlus,
    ElIconDelete
  },
  data() {
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      addActive: 0,
      form: {
        organizationName: '',
        platId: '', //平台名称
        ips: [
          {
            startIP: '',
            endIP: '',
            key: Date.now()
          }
        ]
      },
      organizationId: '',
      equipmentForm: {
        account: '',
        password: ''
      },
      AddplatNameLists: [],
      rules: {},
      propsCas: {
        checkStrictly: true,
        lazy: true,
        value: 'id',
        label: 'label',
        lazyLoad(node, resolve) {
          _this.$api
            .getOrganizationTree({
              type: 1,
              parentId: node.level == 0 ? null : node.data.id,
              withTenant: 2
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
      loading: false,
      dataText: this.$t('public.noData'),
      allips: [],
      terminationExecution: false,
      equipmentRate: 0, //存放已加载数量
      multipleSelection: [], //表格选中状态存放数组
      batchMaskloading: false, //批量验证按钮加载状态
      verificationShow: true,
      contentForm: {
        tableData: [], // 表格数据
        contentRules: {}
      },
      accessTable: [], //接入成功表格展示
      accessSuccess: [],
      equipmentRules: {},
      addMaskloading: false, //批量接入按钮加载状态
      isequipmentRate: false //百分比是否清零
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        Object.assign(this.form, {
          organizationName: this.$parent.organizationName
        })
        this.organizationId = this.$parent.organizationId
        this.setFormRules()
        this.AddplatNameLists = this.$parent.AddplatNameLists.filter(item => {
          return item.platType == 3
        })
      })
    },
    // 检索设备
    async platformList() {
      this.terminationExecution = false
      this.allips = []
      this.form.ips.forEach(element => {
        let startArr = element.startIP.split('.')
        let endArr = element.endIP.split('.')
        if (startArr[0] + startArr[1] + startArr[2] != endArr[0] + endArr[1] + endArr[2]) {
          this.$message({
            type: 'error',
            message: this.$t('primaryDevice.needSameNetworkSegment')
          })
          throw new Error()
        } else if (Number(startArr[3]) > Number(endArr[3])) {
          this.$message({
            type: 'error',
            message: this.$t('primaryDevice.lessThanIP')
          })
          throw new Error()
        } else {
          for (var i = Number(startArr[3]); i <= Number(endArr[3]); i++) {
            this.allips.push(startArr[0] + '.' + startArr[1] + '.' + startArr[2] + '.' + i)
          }
        }
      })
      if (new Set(this.allips).size !== this.allips.length) {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.reEnterIP')
        })
        return false
      }
      this.addActive++
      for (let i = 0; i < this.allips.length; i++) {
        if (this.terminationExecution) {
          if (this.isequipmentRate) {
            this.equipmentRate = 0
          }
          throw new Error()
        } else {
          let obj = {
            platId: this.form.platId,
            ipaddr: this.allips[i]
          }
          let res1 = await this.$api.getEquipment(obj)
          if (res1.deviceServerUri !== undefined) {
            res1.status = 'progress'
            res1.mainDevName = res1.puIp
            let obj = {
              puIp: res1.puIp,
              puPort: res1.puPort,
              deviceServerUri: res1.deviceServerUri,
              mainDevName: res1.puIp,
              status: 'progress',
              ptzType: this.$parent.ptzTypeData[0].value
            }
            this.contentForm.tableData.push(obj)
          }
          this.equipmentRate = Math.floor(((i + 1) / this.allips.length) * 100)
        }
      }
    },
    dialogClosed() {
      this.$parent.addMainDevBatchVisible = false
      this.addActive = 0
      this.form = {
        organizationName: '',
        platId: '', //平台名称
        ips: [
          {
            startIP: '',
            endIP: '',
            key: Date.now()
          }
        ]
      }
      this.organizationId = ''
      this.equipmentForm = {
        account: '',
        password: ''
      }
      this.rules = {}
      this.allips = []
      this.equipmentRate = 0
      this.multipleSelection = [] //表格选中状态存放数组
      this.verificationShow = true
      this.contentForm = {
        tableData: [], // 表格数据
        contentRules: {}
      }
      this.accessTable = []
      this.equipmentRules = {}
      this.$parent.getMainDevList()
    },
    closed() {
      this.$parent.addMainDevBatchVisible = false
    },
    setFormRules() {
      this.rules = {
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],
        platId: [
          {
            required: true,
            message: this.$t('public.pleaseInputplatName'),
            trigger: 'change'
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t('primaryDevice.IPNotEmpyt'),
            trigger: 'change'
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t("public.puIpError"),
            trigger: "change",
          },
        ],
      };
      this.equipmentRules = {
        account: [
          {
            required: true,
            message: this.$t('public.accountPrompt'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('public.psdPrompt'),
            trigger: 'change'
          }
        ]
      }
      this.contentForm.contentRules = {
        mainDevName: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevName'),
            trigger: 'change'
          }
        ],
        mainDevType: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevType'),
            trigger: 'change'
          }
        ],
        maxVideoNum: [
          {
            required: true,
            message: this.$t('public.maxVideoNumPrompt'),
            trigger: 'change'
          }
        ],
        ptzType: [
          {
            required: true,
            message: this.$t('public.ptzTypePrompt'),
            trigger: 'change'
          }
        ],
        puPort: [
          {
            required: true,
            message: this.$t('public.puPortPrompt'),
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
            message: this.$t('public.accountPrompt'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('public.psdPrompt'),
            trigger: 'change'
          }
        ]
      }
    },
    changeOrg(val) {
      this.organizationId = JSON.parse(JSON.stringify(val)).pop()
    },
    //移除网段
    removeDomain(item) {
      if (this.form.ips.length !== 1) {
        var index = this.form.ips.indexOf(item)
        if (index !== -1) {
          this.form.ips.splice(index, 1)
        }
      } else {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.oneIP')
        })
      }
    },
    //添加网段
    addDomain() {
      this.form.ips.push({
        startIP: '',
        endIP: '',
        key: Date.now()
      })
    },
    // 上一步
    previousStep() {
      if (this.addActive == 0) return
      if (this.addActive == 1) {
        this.contentForm.tableData = []
        this.equipmentForm = {
          account: '',
          password: ''
        }
        this.accessTable = []
        this.accessSuccess = []
        this.equipmentRate = 0
        this.terminationExecution = true
        this.isequipmentRate = true
      }
      this.addActive--
    },
    // 下一步
    nextStep() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.addActive == 2) return
          if (this.addActive == 0) {
            this.platformList()
          } else {
            this.addMainDevSubmit()
          }
        }
      })
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.accessSuccess = []
      if (this.accessTable.length == 0) {
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'error',
            message: this.$t('primaryDevice.selectOneEquipment')
          })
          return false
        }
      } else {
        if (this.multipleSelection.length == 0) {
          this.accessTable.forEach(element => {
            if (element.accessStatus == 'success') {
              this.accessSuccess.push(element)
            }
          })
          this.addActive++
          return false
        }
      }
      this.terminationExecution = true
      this.multipleSelection.forEach(element => {
        if (element.status !== 'success') {
          this.$message({
            type: 'error',
            message: this.$t('primaryDevice.addSuccessfulVerification')
          })
          throw new Error()
        }
      })
      this.$refs['contentForm'].validate(async valid => {
        if (valid) {
          this.addMaskloading = true
          let needDelete = new Array() //需要删除的设备
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let row = this.multipleSelection[i]
            let obj = {
              mainDevName: row.mainDevName,
              mainDevType: parseInt(row.mainDevType), //设备类型
              mainDevSn: row.mainDevId,
              organizationId: this.organizationId,
              platId: this.form.platId,
              manufacturer: row.manufacturer, //设备提供商类型
              model: row.model, //设备型号
              drive: 'ONVIF',
              mainDevConfigInfo: {
                puAccount: row.account,
                puPasswd: row.password,
                puIp: row.puIp,
                puPort: row.puPort,
                maxVideoNum: row.maxVideoNum //最大视频通道数
              },
              cameraConfigInfo: {
                ptzType: parseInt(row.ptzType) //摄像机类型
              }
            }
            if (row.puPasswd !== '' && row.puPasswd !== null) {
              obj.mainDevConfigInfo.puPasswd = row.password
            }
            await this.$api
              .addMainDevInfo(obj, 120000)
              .then(res => {
                if (res.resultCode == 0) {
                  this.accessTable.forEach((element, m) => {
                    if (element.model == row.model) {
                      this.accessTable.splice(m, 1)
                    }
                  })
                  row.accessStatus = 'success'
                  this.accessTable.push(row)
                  needDelete.push(i)
                } else {
                  this.accessTable.forEach((element, m) => {
                    if (element.model == row.model) {
                      this.accessTable.splice(m, 1)
                    }
                  })
                  if (res.resultCode == 201012) {
                    row.failedDec = this.$t('primaryDevice.alreadyExists')
                  } else {
                    row.failedDec = res.resultDesc
                  }
                  row.accessStatus = 'failed'
                  this.accessTable.push(row)
                }
              })
              .catch(error => {
                this.accessTable.forEach((element, m) => {
                  if (element.model == row.model) {
                    this.accessTable.splice(m, 1)
                  }
                })
                row.failedDec = this.$t('batchOperator.requestTimeOut')
                row.accessStatus = 'failed'
                this.accessTable.push(row)
              })
            if (i + 1 == this.multipleSelection.length) {
              needDelete.forEach(element2 => {
                this.multipleSelection.forEach((va, index) => {
                  this.contentForm.tableData.forEach((v, i) => {
                    if (va.model === v.model) {
                      this.contentForm.tableData.splice(i, 1)
                    }
                  })
                })
                this.$refs.devicetable.clearSelection()
              })
              this.accessTable.forEach(element => {
                if (element.accessStatus == 'success') {
                  this.accessSuccess.push(element)
                }
              })
              this.addMaskloading = false
              this.addActive++
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$t('primaryDevice.redRequired')
          })
        }
      })
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.contentForm.tableData.forEach(element => {
        element.ischecked = false
        this.multipleSelection.forEach(element2 => {
          if (element == element2) {
            element.ischecked = true
          }
        })
      })
      if (this.multipleSelection.length != 0) {
        this.verificationShow = false
      } else {
        this.verificationShow = true
      }
    },
    //单个验证
    async verificationSubmit(row) {
      if (!row.account || !row.password) {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.inputPort')
        })
        return false
      }
      let obj = {
        platId: this.form.platId,
        deviceIp: row.puIp,
        devicePort: row.puPort,
        username: row.account,
        password: row.password,
        deviceServerUri: row.deviceServerUri
      }
      let res1 = await this.$api.probeValidation(obj)
      if (res1.resultCode == 0) {
        row.manufacturer = res1.manufacturer
        row.model = res1.model
        row.firmwareVersion = res1.firmwareVersion
        row.mainDevId = res1.serialNumber
        row.hardwareId = res1.hardwareId
        row.status = 'success'
      } else {
        row.status = 'failed'
      }
    },
    //批量验证
    batchVerificationSubmit() {
      this.$refs['equipmentForm'].validate(async valid => {
        if (valid) {
          this.batchMaskloading = true
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let row = this.multipleSelection[i]
            let obj = {
              platId: this.form.platId,
              deviceIp: row.puIp,
              devicePort: row.puPort,
              username: this.equipmentForm.account,
              password: this.equipmentForm.password,
              deviceServerUri: row.deviceServerUri
            }
            let res1 = await this.$api.probeValidation(obj)
            if (res1.resultCode == 0) {
              row.manufacturer = res1.manufacturer
              row.model = res1.model
              row.firmwareVersion = res1.firmwareVersion
              row.mainDevId = res1.serialNumber
              row.hardwareId = res1.hardwareId
              row.account = this.equipmentForm.account
              row.password = this.equipmentForm.password
              row.status = 'success'
            } else {
              row.status = 'failed'
            }
            if (i + 1 == this.multipleSelection.length) {
              this.batchMaskloading = false
            }
          }
        }
      })
    },
    sure() {
      this.$parent.addMainDevBatchVisible = false
    }
  }
}
</script>

<style lang="scss">
#addDeviceBatchDialog {
  .el-input {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .inputGroup {
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: black;
    }
  }
  .addIPbutton {
    width: 240px;
    height: 50px;
    margin: 30px auto 10px auto;
    border: 1px dashed #64befd;
    color: #64befd;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .ipTips {
    height: 13px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #c0c4cc;
    text-align: center;
    margin-bottom: 30px;
  }
  .ipsstyle {
    [class*=' el-icon-'],
    [class^='el-icon-'] {
      line-height: 34px;
    }
    width: 90%;
    justify-content: space-between;
    padding-left: 0 !important;
  }
  .equipmentTab {
    .inputAccount {
      margin-top: 20px;
    }
    button {
      height: 34px;
    }
    .el-progress {
      width: 20%;
    }
    [class*=' el-icon-'],
    [class^='el-icon-'] {
      font-weight: 600;
      line-height: 20px;
      color: #64befd;
    }
    .devicetable {
      margin: 20px 40px;
      .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-select__tags-text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .el-step.is-center .el-step__line {
    top: 33px;
    left: 60% !important;
    right: -40% !important;
  }
  .contentForm {
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .accessTab {
    margin: 20px 40px;
  }
}
</style>
