<template>
  <div>
    <el-dialog
      :title="$t('deviceCamera.cameraInfo')"
      v-model="$parent.dialogVisible"
      top="20vh"
      width="1100px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-descriptions class="descriptions">
        <el-descriptions-item :label="$t('devModel.cameraName')">
          {{ deviceInfo.devName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.onlineTotalTime')">
          {{ getTimeFormatter(deviceInfo.onlineHours) }}
        </el-descriptions-item>
        <el-descripions-item :label="$t('report.offlineTotalTime')">
          {{ getTimeFormatter(deviceInfo.offlineHours) }}
        </el-descripions-item>
      </el-descriptions>

      <div class="mt-5" style="padding: 0 20px">
        <el-table border v-loading="loading" :data="tableData" stripe>
          <el-table-column :label="$t('public.startTime')" prop="occurTime" show-overflow-tooltip />
          <el-table-column prop="status" :label="$t('public.state')">
            <template #default="{ row }">
              <el-tag
                :type="row.status == deviceStatusData[0].code ? 'primary' : 'danger'"
                disable-transitions
              >
                {{ onlineStatusFormatter(row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="duration"
            :label="$t('report.duration')"
            :formatter="timeFormatter"
          />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getDayHourMinAndSec } from '@/utils/common/mutil.js'
export default {
  props: ['deviceInfo'],
  data() {
    return {
      searchForm: {},
      loading: false,
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
      this.searchForm.beginDate = this.deviceInfo.statTime
      this.searchForm.endDate = this.deviceInfo.statTime
      let res = await this.$api.onOfflineDetailDeviceNewDetail(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.tableData = res.onOfflineDeviceDetails
      } else {
        this.tableData = []
      }
    },
    onlineStatusFormatter(row) {
      return this.selectDictLabel(this.deviceStatusData, row.status)
    },
    dialogClosed() {},
    timeFormatter(row) {
      if (!row?.duration) {
        return '-'
      }
      return getDayHourMinAndSec(row.duration * 1000)
    },
    getTimeFormatter(time) {
      return getDayHourMinAndSec(time * 1000)
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 0;
  padding-bottom: 20px;
}
:deep(.el-descriptions--small) {
  font-size: 14px;
}
.descriptions {
  padding: 10px 20px;
}
</style>
