<template>
  <div>
    <el-dialog
      :title="$t('videoOperate.devStausChangeDetail')"
      v-model="$parent.dialogVisible"
      top="10vh"
      width="900px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <collapse-card :title="$t('videoOperate.devBaseInfo')" hideCollapse titleColor="#000">
        <template #operate>
          <el-button
            v-hasPermi="[1424]"
            type="success"
            @click="handleExport"
            :disabled="tableData.length == 0"
          >
            {{ $t('businessLog.exportExcel') }}
          </el-button>
        </template>
        <el-form
          :model="deviceInfo"
          ref="searchForm"
          :inline="true"
          label-width="110px"
          label-position="left"
          class="mt-3"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('deviceInfo.deviceName') + ':'">
                <el-input v-model="deviceInfo.devName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceInfo.deviceID') + ':'">
                <el-input v-model="deviceInfo.devId" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('deviceInfo.deviceIP') + ':'">
                <el-input v-model="deviceInfo.ipAddress" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceInfo.deviceInterconnectedCoding') + ':'">
                <el-input v-model="deviceInfo.interconnectCode" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </collapse-card>
      <collapse-card
        :title="$t('videoOperate.devStausChangeDetail')"
        hideCollapse
        titleColor="#000"
      >
        <div class="mt-5">
          <el-table border v-loading="loading" :data="tableData" stripe>
            <el-table-column prop="occurTime" :label="$t('workOrder.time')" />
            <el-table-column
              prop="status"
              :formatter="onlineStatusFormatter"
              :label="$t('deviceInfo.deviceStatus')"
            />
            <el-table-column
              prop="duration"
              :label="$t('videoOperate.durationTime')"
              :formatter="timeFormatter"
            />
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:pageNum="searchForm.pageInfo.pageNum"
          v-model:limit="searchForm.pageInfo.pageSize"
          @pagination="dialogOpen"
        />
      </collapse-card>
    </el-dialog>
  </div>
</template>

<script>
import collapseCard from '../../../component/collapse-card.vue'
import { download } from '@/utils/common/download'
import { mapState } from 'vuex'
import { getDayHourMinAndSec } from '@/utils/common/mutil.js'
export default {
  components: { collapseCard },
  props: ['deviceInfo'],
  data() {
    return {
      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      total: 0,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      deviceStatusData: state => state.dict.device_online_status
    })
  },
  methods: {
    async dialogOpen() {
      this.loading = true
      this.searchForm.devId = this.deviceInfo.devId
      this.searchForm.retrievalStartDay = this.$parent.searchForm.retrievalStartDay
      this.searchForm.retrievalEndDay = this.$parent.searchForm.retrievalEndDay
      let res = await this.$api.onOfflineDetailInfo(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.onOfflineDeviceDetails
      }
    },
    async handleExport() {
      let { devId, retrievalStartDay, retrievalEndDay } = this.searchForm
      let res = await this.$api.onOfflineDetailInfoExport({
        devId,
        retrievalStartDay,
        retrievalEndDay,
        netType: this.$getNetType()
      })
      if (res.resultCode == 0) {
        if (res.resultCode == 0) {
          res.fileUrl && download(res.fileUrl, this.$t('videoOperate.devStausChangeDetail'))
        }
      }
    },
    onlineStatusFormatter(row) {
      return this.selectDictLabel(this.deviceStatusData, row.status)
    },
    dialogClosed() {
      this.searchForm.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
    },
    timeFormatter(row) {
      return getDayHourMinAndSec(row.duration * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 0;
  padding-bottom: 20px;
}
</style>
