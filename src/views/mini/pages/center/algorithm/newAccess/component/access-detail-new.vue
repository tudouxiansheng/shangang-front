<template>
  <div id="accessPlatformDetailDialog">
    <el-dialog
      :title="title_detail"
      v-model="dialogFormVisible_detail"
      top="10vh"
      :width="locale == 'en' ? '1120px' : '850px'"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      draggable
    >
      <el-form
        ref="archivesForm"
        :model="form"
        :rules="formRules"
        class="archivesForm"
        :inline="true"
        :label-width="locale == 'en' ? '260px' : '140px'"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <!-- 基本信息 -->
        <collapse-card :title="$t('newAccess.basicInfo')" v-model:collapse="show1">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.belongOrg') + ': '">
                <span>{{ form.organizationName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPlatType') + ': '">
                <span>{{ $parent.setPlatformType(form.platformType) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accName') + ': '">
                <span>{{ form.accessName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.association') + ': '">
                <span>{{ $parent.setAssociation(form.platformConfig.platformConfig) }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('newAccess.remak') + ': '" class="single-line">
                <span>{{ form.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 负载网关信息 -->
        <collapse-card :title="$t('newAccess.gatewayInfo')" v-model:collapse="show4">
          <div
            style="max-height: 150px"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            
          >
            <div v-show="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px; width: 14%" />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <el-table
              v-if="!loading && tableData.length"
              :row-class-name="$parent.tableRowClassName"
              ref="gatewayInfoTable"
              :data="tableData"
              :span-method="objectSpanMethod"
              border
            >
              <template #empty>
                <span>{{ dataText }}</span>
              </template>
              <el-table-column
                :label="$t('newAccess.gatewayGroup')"
                prop="gatewayGroup"
                show-overflow-tooltip
              />
              <el-table-column
                :label="$t('newAccess.gatewayName')"
                prop="gatewayName"
                show-overflow-tooltip
              />
              <el-table-column
                :label="$t('newAccess.gatewayNodeIP')"
                prop="gatewayIp"
                show-overflow-tooltip
              />
              <el-table-column :label="$t('newAccess.gatewayNodeStatus')" prop="gatewayStatus">
                <template #default="{ row }">
                  <span :class="setStatusClass(row.gatewayStatus)">
                    {{ $parent.setGateWayStatus(row.gatewayStatus) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('public.createTime')"
                prop="createTime"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </collapse-card>

        <!-- 平台对接信息 -->
        <collapse-card :title="$t('newAccess.accInfo')" v-model:collapse="show2">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockNetType') + ':'">
                <span>
                  {{ $parent.setAccessNetworkType(form.networkType) }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.auth') + ':'">
                <span>
                  {{ $parent.setAccessAuthType(form.authType) }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accManufacturer') + ':'">
                <span>
                  {{ form.vendor }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accVersion') + ':'">
                <span>
                  {{ form.version }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.networkType == 1">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPublicNetIP') + ':'">
                <span>{{ form.accessHost }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accPublicNetPort') + ':'">
                <span>{{ form.accessPort }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.networkType == 2">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accNetIP') + ':'">
                <span>{{ form.accessHost }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.accNetPort') + ':'">
                <span>
                  {{ form.accessPort }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.authType == 1">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockAccount') + ':'">
                <span>{{ form.account }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockPwd') + ':'">
                <span>******</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.authType == 2">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockAK') + ':'">
                <span>{{ form.accessKey }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockSK') + ':'">
                <span>******</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.authType == 2">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockAccountNo') + ':'">
                <span>{{ form.accessUserId }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.authType == 3">
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.dockToken') + ':'">
                <span>{{ form.accessToken }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- 平台配置 -->
        <collapse-card
          :title="$t('newAccess.platSet')"
          v-model:collapse="show5"
          v-if="
            $parent.dataForm.platformConfig &&
            $parent.dataForm.platformConfig.schema &&
            $parent.dataForm.platformConfig.apiPrefix
          "
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.protocol') + ':'">
                <span>{{ form.platformConfig.schema }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('newAccess.apiPrefix') + ':'">
                <span>{{ form.platformConfig.apiPrefix }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible_detail = false">{{ $t('public.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <long-lat-map />

    <!-- //网关选择 -->
    <el-dialog
      :title="$t('newAccess.selectGateway2')"
      v-model="showGateWay"
      top="10vh"
      width="1060px"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    >
      <gateway-choose></gateway-choose>
    </el-dialog>
  </div>
</template>

<script>
import LongLatMap from '@/components/long-lat-map'
import CollapseCard from '@/components/collapse-card.vue'
import GatewayChoose from './gateway-choose'

export default {
  name: 'accessPlatformAdd',
  components: {
    LongLatMap,
    CollapseCard,
    GatewayChoose
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title_detail: {
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
    }
  },
  data() {
    return {
      locale: localStorage.getItem("locale"),
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      loading: false,
      form: {
        // 基本信息
        organizationId: '',
        organizationName: '',
        platformType: '',
        platformName: '',
        platformScale: '',
        gatewayGroup: '',
        remark: '',

        platformNetworkIp: '',
        platformNetworkPort: '',
        platformIntranetIp: '',
        platformIntranetPort: '',
        // 平台对接信息
        platformProtocolInfo: {
          accessNetworkType: '',
          accessAuthType: '',
          accessProtocolType: '',
          accessProtocolVersion: '',

          accessAccount: '',
          accessPassword: '',
          accessKey: '',
          accessSecret: '',
          accessUserId: '',
          accessToken: '',
          platformGbId: '',
          accessGbId: ''
        },
        // 媒体播放配置
        platformMediaInfo: {
          mediaAccessType: 0,
          sdkNetworkIp: '',
          sdkNetworkPort: '',
          sdkIntranetIp: '',
          sdkIntranetPort: ''
        },

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
      tableData: [],
      dataText: '',
      spanArr: []
    }
  },
  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
    },

    dialogFormVisible_detail: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    formRules() {
      return {
        'archivesInfo.thirdDeviceId': [
          {
            required: true,
            message: this.$t('newAccess.inputDevNo'),
            trigger: 'blur'
          }
        ],
        'archivesInfo.deviceName': [
          {
            required: true,
            message: this.$t('newAccess.inputDevName'),
            trigger: 'blur'
          }
        ],
        'archivesInfo.deviceType': [
          {
            required: true,
            message: this.$t('newAccess.selectDevType'),
            trigger: 'change'
          }
        ],
        'archivesInfo.address': [
          {
            required: true,
            message: this.$t('newAccess.inputAddress'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    setStatusClass(val) {
      if (val.startsWith('OK')) {
        return 'success'
      } else if (val.startsWith('DOWN')) {
        return 'danger'
      } else if (val.startsWith('OOS')) {
        return 'warning'
      }
    },
    async getTableData() {
      let res = await this.$api.selectPlatformStatusLogInfos({
        pageInfo: {
          pageNum: 1,
          pageSize: this.$maxPageSize
        },
        searchInfo: {
          platformId: this.$parent.choosedPlatformId
        }
      })
      if (res.resultCode == 0) {
      }
    },
    async dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })

      this.loading = true

      let res = await this.$api.selectAdapterGateways({
        pageInfo: {
          pageNum: 1,
          pageSize: this.$maxPageSize
        },
        searchInfo: {
          gatewayGroup: this.$parent.choosedGateWayGroup
        }
      })
      if (res.resultCode == 0) {
        this.tableData = res.gatewayList
        this.total = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },

    getTable() {
      let contactDot = 0
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.gatewayGroup === this.tableData[index - 1].gatewayGroup) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
    },

    objectSpanMethod(data) {
      const { row, column, rowIndex, columnIndex } = data
      if (columnIndex === 0) {
        const len = this.classGroup(row.gatewayGroup)
        const lenName = this.classNameLen(row.gatewayGroup)

        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    classGroup(name) {
      return this.tableData.filter(o => o.gatewayGroup == name).length
    },
    classNameLen(name) {
      const tmp = Array.from(this.groupNum)
      const index = tmp.indexOf(name)
      let len = 0
      for (let i = 0; i < index; i++) {
        len += this.classGroup(tmp[i])
      }
      return len
    }
  }
}
</script>

<style lang="scss">
#accessPlatformDetailDialog {
  .el-dialog__body {
    padding: 20px;
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

  .el-input__inner {
    width: 215px;
    height: 36px;
    border: 1px solid #c1c7d0;
    border-radius: 4px;
    background: transparent;
    color: #232c3b;
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
}
</style>
