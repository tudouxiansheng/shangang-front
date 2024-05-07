<template>
  <!-- 设备详情 -->
  <el-dialog
    :title="$t('platformManagement.viewDetails')"
    v-model="$parent.mainDevDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1050px'"
    :close-on-click-modal="false"
    class="viewClassDetailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '370px' : '156px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.Affiliation') + '：'">
            <span>{{ form.organizationName }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.viewName') + '：'">
            <el-tooltip :content="form.platformName" placement="top">
              <span class="ellipsis">{{ form.platformName }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.libraryLevels') + '：'">
            <span>{{ $parent.setType(form.type) }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.IPAddress') + '：'">
            <span>{{ form.ip }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.authenticationmethod') + '：'">
            <span>{{ $parent.setAlgorithm(form.algorithm) }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.authenticationAccount') + '：'"
            v-if="form.algorithm != '1'"
          >
            <span>{{ form.ownAccount }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.downloadViewURL') + '：'"
            prop="autoDownloadUrl"
            v-if="form.type == 2"
            class="bigRadio"
          >
            <el-radio-group v-model="form.autoDownloadUrl">
              <el-radio :label="true" v-if="form.autoDownloadUrl == true">
                {{ $t('platformManagement.true') }}
              </el-radio>
              <el-radio :label="false" v-if="form.autoDownloadUrl == false">
                {{ $t('platformManagement.false') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.organizationCode') + '：'">
            <span>{{ form.organizationId }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.encoding') + '：'">
            <span>{{ form.resourceUri }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.connectionProtocol') + '：'">
            <span>{{ $parent.setProtocol(form.protocol) }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.portNumber') + '：'">
            <span>{{ form.port }}</span>
          </el-form-item>
          <el-form-item :label="$t('platformManagement.forcePush') + '：'" v-if="form.type != 2">
            <el-radio-group v-model="form.forcePush">
              <el-radio :label="true" v-if="form.forcePush">
                {{ $t('platformManagement.true') }}
              </el-radio>
              <el-radio :label="false" v-if="form.forcePush === false">
                {{ $t('platformManagement.false') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.peerAccount') + '：'"
            v-if="form.algorithm != '1'"
          >
            <span>{{ form.account }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('platformManagement.transferAutomatically') + '：'"
            prop="autoAllocate"
            v-if="form.type == 2"
            class="bigRadio"
          >
            <el-radio-group v-model="form.autoAllocate">
              <el-radio :label="true" v-if="form.autoAllocate == true">
                {{ $t('platformManagement.true') }}
              </el-radio>
              <el-radio :label="false" v-if="form.autoAllocate == false">
                {{ $t('platformManagement.false') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('platformManagement.viewDescription') + '：'">
        <span>{{ form.remark }}</span>
      </el-form-item>

      <el-form-item :label="$t('platformManagement.configuration') + '：'" v-if="form.type == 1">
        <el-table
          :data="form.dataSendList"
          style="width: 100%; margin: 0px 0 30px"
          :row-class-name="$parent.tableRowClassName"
          border
        >
          <template #empty>
            <span>{{ dataText }}</span>
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
                <el-radio :label="true" v-if="row.ifSend">
                  {{ $t('platformManagement.true') }}
                </el-radio>
                <el-radio :label="false" v-if="!row.ifSend">
                  {{ $t('platformManagement.false') }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('platformManagement.imageConfiguration')"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-radio-group v-model="row.bigImgSet">
                <el-radio :label="1" v-if="row.bigImgSet == 1">
                  {{ $t('platformManagement.pushURL') }}
                </el-radio>
                <el-radio :label="0" v-if="row.bigImgSet == 0">
                  {{ $t('platformManagement.pushImages') }}
                </el-radio>
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
                <el-radio :label="1" v-if="row.smallImgSet == 1">
                  {{ $t('platformManagement.pushURL') }}
                </el-radio>
                <el-radio :label="0" v-if="row.smallImgSet == 0">
                  {{ $t('platformManagement.pushImages') }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      dataText: this.$t('public.noData')
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.mainDevDetailForm
      })
    },
    dialogClosed() {
      this.$parent.mainDevDetailVisible = false
      this.$parent.mainDevDetailForm = {}
    }
  }
}
</script>

<style lang="scss">
.viewClassDetailDialog {
  .el-dialog__body {
    .form-flex {
      padding: 0;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
  .laneInfoDiv {
    padding: 0px 22px;
  }
  .el-table--border .el-table__inner-wrapper::after,
  .el-table--border::after,
  .el-table--border::before,
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
