<template>
  <div>
    <el-dialog
      :title="$t('operateManage.patrolInfo')"
      v-model="$parent.dialogVisible"
      class="dialogWithCard"
      top="10vh"
      width="1200px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <div class="patrol-detail">
        <el-row>
          <el-col :span="8">
            <label>{{ $t('deviceInfo.deviceName') }}：</label>
            <span>{{ searchForm.devName }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('deviceInfo.deviceID') }}：</label>
            <span>{{ searchForm.devId }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.ipAndPort') }}：</label>
            <span>{{ searchForm.ip }}{{ searchForm.port ? ':' + searchForm.port : '' }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('deviceInfo.deviceInterconnectedCoding') }}：</label>
            <span>{{ searchForm.interconnectCode }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.accessDrive') }}：</label>
            <span>{{ searchForm.drive }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.channelNo') }}：</label>
            <span>{{ searchForm.channelNo }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('deviceInfo.manufacturer') }}：</label>
            <span>{{ searchForm.manufacturer }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('frontParameterConfiguration.model') }}：</label>
            <span>{{ searchForm.model }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('deviceInfo.deviceType') }}：</label>
            <span>{{ devTypeFormatter(searchForm.ptzType) }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('operateManage.deviceOwner') }}：</label>
            <span>{{ searchForm.organizationName }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.area') }}：</label>
            <span>{{ searchForm.areaName }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.installationAddress') }}：</label>
            <span>{{ searchForm.installLocation }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('operateManage.platform') }}：</label>
            <span>{{ searchForm.platName }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.deviceOwnerStatus') }}：</label>
            <span>{{ deviceStatusDataFormatter(searchForm.mainDevStatus) }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('deviceCamera.state') }}：</label>
            <span>{{ devStatusFormatter(searchForm.devStatus) }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('operateManage.recordStatus') }}：</label>
            <span>{{ recordStatusFormatter(searchForm.recordStatus) }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('dictConst.videoPreviewStatus') }}：</label>
            <span>{{ previewFormatter(searchForm.preview) }}</span>
          </el-col>

          <el-col :span="8">
            <label>{{ $t('operateManage.videoIntegralityRatio') }}：</label>
            <span>{{ searchForm.integrity }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>{{ $t('operateManage.patrolItem5') }}：</label>
            <span>{{ qualityFormatter(searchForm.quality) }}</span>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('operateManage.imageQuality') }}：</label>
            <el-tooltip
              class="item"
              effect="dark"
              :content="imageQualityDataFormatter(searchForm.errorItems)"
              placement="top-start"
            >
              <span>
                {{ imageQualityDataFormatter(searchForm.errorItems) }}
              </span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <label>{{ $t('deviceCamera.dpi') }}：</label>
            <span>{{ videoDpiFormatter(searchForm.dpi) }}</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      searchForm: {}
    }
  },
  computed: {
    ...mapState({
      patrolDevStatusData: state => state.dict.patrol_dev_status,
      patrolPreviewStatusData: state => state.dict.patrol_preview_status,
      patrolRecordStatusData: state => state.dict.patrol_record_status,
      patrolQualityStatusData: state => state.dict.patrol_result,
      videoDpiData: state => state.dict.video_dpi,
      deviceStatusData: state => state.dict.device_status,
      imageQualityData: state => state.dict.patrol_quality_status,
      ptzTypeData: state => state.dict['device-type']
    })
  },
  methods: {
    dialogOpen() {
      this.getDictionaryList()
      this.getDevDetail()
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryList() {
      this.getSysDictData(['device-type'])
    },
    async getDevDetail() {
      let obj = {
        taskId: this.$parent.taskId,
        devId: this.$parent.devId
      }
      let res = await this.$api.getDevPatrolDetail(obj)
      if (res.resultCode == 0) {
        this.searchForm = {
          devName: res.devName,
          ip: res.ip,
          port: res.port,
          devId: res.devId,
          interconnectCode: res.interconnectCode,
          organizationName: res.organizationName,
          areaCode: res.areaCode,
          installLocation: res.installLocation,
          drive: res.drive,
          channelNo: res.channelNo,
          devStatus: res.devStatus,
          preview: res.preview,
          integrity: res.integrity,
          recordStatus: res.recordStatus, //实时录制
          quality: res.quality,
          model: res.model,
          ptzType: res.ptzType,
          dpi: res.dpi,
          platName: res.platName,
          manufacturer: res.manufacturer,
          mainDevStatus: res.mainDevStatus,
          errorItems: res.errorItems
        }
      }
      await this.areaCodeFormatter(this.searchForm.areaCode)
    },
    dialogClosed() {
      this.$parent.dialogVisible = false
    },
    devTypeFormatter(data) {
      return this.selectDictLabel(this.ptzTypeData, data)
    },
    devStatusFormatter(data) {
      return this.selectDictLabel(this.patrolDevStatusData, data)
    },
    deviceStatusDataFormatter(data) {
      return this.selectDictLabel(this.deviceStatusData, data)
    },
    previewFormatter(data) {
      return this.selectDictLabel(this.patrolPreviewStatusData, data)
    },
    recordStatusFormatter(data) {
      return this.selectDictLabel(this.patrolRecordStatusData, data)
    },
    qualityFormatter(data) {
      return this.selectDictLabel(this.patrolQualityStatusData, data)
    },
    videoDpiFormatter(data) {
      return this.selectDictLabel(this.videoDpiData, data)
    },
    async areaCodeFormatter(data) {
      if (data) {
        let res = await this.$api.queryAreaInfo({ areaCode: data })
        if (res.resultCode == 0) {
          this.searchForm.areaName = res.areaInfo.areaName
        }
      }
    },
    imageQualityDataFormatter(data) {
      let arr = []
      if (data) {
        data.forEach(item => {
          arr.push(this.selectDictLabel(this.imageQualityData, item))
        })
      }
      return arr.join('、')
    }
  }
}
</script>

<style lang="scss" scoped>
.patrol-detail {
  background: #f5f7fa;
  padding: 20px;
}
.el-row {
  margin-bottom: 20px;
}

.el-col {
  height: 36px;
  line-height: 36px;

  label {
    width: 126px;
    text-align: left;
    float: left;
  }

  span {
    display: inline-block;
    box-sizing: border-box;
    width: 215px;
    height: 100%;
    border: 1px solid #c1c7d0;
    border-radius: 4px;
    color: #232c3b;
    font-size: 14px;
    padding: 0 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
