<template>
  <el-dialog
    :title="$t('accessPlatform.accessPlatformDetails')"
    :visible.sync="$parent.dialogFormVisible_detail"
    top="10vh"
    width="1200px"
    id="accessPlatformDetailDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :draggable="false"
  >
    <el-form
      ref="archivesForm"
      :model="form"
      class="archivesForm"
      :inline="true"
      :label-width="locale == 'en' ? '285px' : '142px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <!-- 基本信息 -->
      <collapse-card :title="$t('accessPlatform.essentialInformation')" v-model:collapse="show1">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.organization') + '：'">
              <span>{{ form.organizationName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.accessPlatformNumber') + '：'">
              <span>{{ form.platformId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.accessPlatformType') + '：'">
              <span>{{ $parent.setPlatformType(form.platformType) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.accessPlatformName') + '：'">
              <span>{{ form.platformName }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.platformScale') + '：'">
              <span>{{ form.platformScale }} {{ $t('accessPlatform.road') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.connectionStatus') + '：'">
              <span>{{ $parent.setStatus(form.platformStatus) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-if="form.regionCode" :span="12">
            <el-form-item :label="$t('accessPlatform.domainCode') + '：'">
              <span>{{ form.regionCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('accessPlatform.remarkInformation') + '：'"
              class="single-line"
            >
              <span>{{ form.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </collapse-card>

      <!-- 负载网关信息 -->
      <collapse-card :title="$t('accessPlatform.gatewayInformation')" v-model:collapse="show4">
        <div style="height: 150px" v-loading="loading" :element-loading-text="$t('public.loading')">
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
              :label="$t('accessPlatform.gatewayPacket')"
              prop="gatewayGroup"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('accessPlatform.gatewayName')"
              prop="gatewayName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('accessPlatform.gatewayNodeIP')"
              prop="gatewayIp"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('accessPlatform.nodestatus')" prop="gatewayStatus">
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
      <collapse-card :title="$t('accessPlatform.dockinginformation')" v-model:collapse="show2">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.networkType') + '：'">
              <span>
                {{ $parent.setAccessNetworkType(form.platformProtocolInfo.accessNetworkType) }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="isShowAuthType"
              :label="$t('accessPlatform.authenticationMode') + '：'"
            >
              <span style="white-space: nowrap">
                {{ $parent.setAccessAuthType(form.platformProtocolInfo.accessAuthType) }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="isShowAuthType"
              :label="$t('accessPlatform.protocolVersion') + '：'"
            >
              <span>
                {{ form.platformProtocolInfo.accessProtocolVersion }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            form.platformProtocolInfo.accessNetworkType == 1 &&
            form.platformType[1] != PLATFORM_TYPE.AVS
          "
        >
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.platformPublicNetworkIP') + '：'">
              <span>{{ form.platformNetworkIp }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.publicNetworkPort') + '：'">
              <span>{{ form.platformNetworkPort }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.platformProtocolInfo.accessNetworkType == 2">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.privateNetworkIP') + '：'">
              <span>{{ form.platformIntranetIp }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.privateNetworkPort') + '：'">
              <span>
                {{ form.platformIntranetPort }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.platformProtocolInfo.accessAuthType == 1">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.dockingAccount') + '：'">
              <span>{{ form.platformProtocolInfo.accessAccount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.dockingPassword') + '：'">
              <span>******</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.platformProtocolInfo.accessAuthType == 2">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.dockingAK') + '：'">
              <span>{{ form.platformProtocolInfo.accessKey }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.dockingSk') + '：'">
              <span>******</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.platformProtocolInfo.accessAuthType == 2">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.userNumber') + '：'">
              <span>{{ form.platformProtocolInfo.accessUserId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.platformProtocolInfo.accessAuthType == 3">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.dockingToken') + '：'">
              <span>{{ form.platformProtocolInfo.accessToken }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form.platformProtocolInfo.accessProtocolType == 3">
          <el-col :span="12">
            <el-form-item :label="$t('deviceCamera.platId') + '：'">
              <span>{{ $parent.setPlatType(form.platformLevelType) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form.platformProtocolInfo.accessProtocolType == 3">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.platformNo') + '：'">
              <span>{{ form.platformProtocolInfo.platformGbId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.numberOfThisLevel') + '：'">
              <span>{{ form.platformProtocolInfo.accessGbId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </collapse-card>

      <!-- 媒体播放配置 -->
      <collapse-card
        :title="$t('accessPlatform.playbackConfiguration')"
        v-model:collapse="show3"
        v-if="form.platformType[1] != PLATFORM_TYPE.AVS"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.mediaDocking') + '：'" class="nowrap">
              <span>
                {{ $parent.setMediaAccessType(form.platformMediaInfo.mediaAccessType) }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="$parent.showMediaItem">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.accessPublicIP') + '：'">
              <span>{{ form.platformMediaInfo.sdkNetworkIp }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.SDKpublicNetworkPort') + '：'">
              <span>{{ form.platformMediaInfo.sdkNetworkPort }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="$parent.showMediaItem">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.SDKaccess') + '：'">
              <span>{{ form.platformMediaInfo.sdkIntranetIp }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.SDKaccessPort') + '：'">
              <span>{{ form.platformMediaInfo.sdkIntranetPort }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </collapse-card>

      <!-- 平台配置 -->
      <collapse-card
        :title="$t('accessPlatform.platformConfiguration')"
        v-model:collapse="show5"
        v-if="
          $parent.dataForm.platformConfig &&
          $parent.dataForm.platformConfig.schema &&
          $parent.dataForm.platformConfig.apiPrefix
        "
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.agreement')">
              <span>{{ form.platformConfig.schema }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.prefixPath')">
              <span>{{ form.platformConfig.apiPrefix }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </collapse-card>

      <!-- 平台参数配置 -->
      <collapse-card
        v-if="isShowConfig"
        :title="$t('accessPlatform.avsConfig.title')"
        v-model:collapse="show5"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.avsConfig.storageEnable') + '：'">
              <el-switch
                v-model="form.avsConfig.storageEnable"
                active-color="#0085d0"
                inactive-color="#dee2e6"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.avsConfig.storageServerAddr') + '：'">
              <span>{{ form.avsConfig.storageServerAddr }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.avsConfig.mediaServerAddr') + '：'">
              <span>{{ form.avsConfig.mediaServerAddr }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('accessPlatform.avsConfig.accessGatewayConfig') + '：'">
              <el-switch
                v-model="form.avsConfig.accessGatewayConfig"
                active-color="#0085d0"
                inactive-color="#dee2e6"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="form.avsConfig.accessGatewayConfig" class="accessGatewayConfig">
          <el-radio-group v-model="form.avsConfig.driveRadio">
            <el-radio-button :label="1">
              {{ $t('accessPlatform.avsConfig.T28181Dev') }}
            </el-radio-button>
            <el-radio-button :label="2">
              {{ $t('accessPlatform.avsConfig.HWSDKDev') }}
            </el-radio-button>
          </el-radio-group>

          <el-row v-show="form.avsConfig.driveRadio == 1" :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.serverDomain') + '：'">
                <span>{{ form.avsConfig.serverDomain }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.sipServerIp') + '：'">
                <span>{{ form.avsConfig.sipServerIp }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.sipServerPort') + '：'">
                <span>{{ form.avsConfig.sipServerPort }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.syncChannelNameEnable') + '：'">
                <el-switch
                  v-model="form.avsConfig.syncChannelNameEnable"
                  active-color="#0085d0"
                  inactive-color="#dee2e6"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="form.avsConfig.driveRadio == 2" :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.accessServerIp') + '：'">
                <span>{{ form.avsConfig.accessServerIp }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('accessPlatform.avsConfig.accessServerPort') + '：'">
                <span>{{ form.avsConfig.accessServerPort }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </collapse-card>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible_detail = false">
          {{ $t('public.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
export default {
  name: 'accessPlatformAdd',
  components: {
    CollapseCard
  },
  props: {
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
      locale: localStorage.getItem('locale'),
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
        regionCode: '',
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
        },
        avsConfig: {
          storageEnable: false,
          storageServerAddr: '',
          mediaServerAddr: '',
          serverDomain: '',
          sipServerIp: '',
          sipServerPort: null,
          syncChannelNameEnable: false,
          accessServerIp: '',
          accessServerPort: null,
          accessGatewayConfig: true,
          driveRadio: 1
        }
      },

      tableData: [],
      dataText: '',

      spanArr: [],
      isShowConfig: false,
      isShowAuthType: true,
      PLATFORM_TYPE: PLATFORM_TYPE
    }
  },
  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
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
    async dialogOpen() {
      this.$nextTick(async () => {
        
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
        this.isShowConfig = this.form.platformType[1] == PLATFORM_TYPE.AVS ? true : false
        this.isShowAuthType =
          this.form.platformType[1] == PLATFORM_TYPE.ADS ||
          this.form.platformType[1] == PLATFORM_TYPE.VPAAS
            ? false
            : true
        this.tableData = this.$parent.gatewayList
        if (this.tableData.length != 0)
          this.getAvsConfig(this.form.gatewayGroup, this.tableData[0].gatewayIp)
      })
    },
    async getAvsConfig(gatewayGroup, gatewayIp) {
      if (!this.isShowConfig) return
      const res = await this.$api.avsConfigSelect({
        gatewayGroup,
        gatewayIp
      })
      if (res.resultCode != 0) return
      const {
        storageEnable,
        storageServerAddr,
        mediaServerAddr,
        serverDomain,
        sipServerIp,
        sipServerPort,
        syncChannelNameEnable,
        accessServerIp,
        accessServerPort
      } = res
      this.form.avsConfig = {
        storageEnable,
        storageServerAddr,
        mediaServerAddr,
        serverDomain,
        sipServerIp,
        sipServerPort,
        syncChannelNameEnable,
        accessServerIp,
        accessServerPort,
        accessGatewayConfig: true,
        driveRadio: 1
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
  .nowrap {
    white-space: nowrap;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::after {
    background-color: #d9d9d9;
  }
  .el-dialog__body {
    padding: 20px;

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

      .el-textarea__inner {
        background: transparent;
        border-radius: 4px;
        height: 100px;
        border: 1px solid #c1c7d0;
        color: #232c3b;
      }
    }

    .accessGatewayConfig {
      padding: 20px;
      background: #f8f8f9;
      border-radius: 4px;
      .el-radio-group {
        margin-bottom: 25px;
        .el-radio-button__inner {
          margin-right: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #595959;
          background: transparent;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          border-radius: 100px;
          background: rgba(44, 109, 210, 0.1);
          color: #2c6dd2;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
