<template>
  <div class="config-form">
    <div
      class="config-info"
      v-if="cameraRecordInfo != undefined && cameraRecordInfo.timeSpanList != undefined"
    >
      <div class="el-form">
        <p class="form-title">{{ $t('mainDevConfiguration.recordConfig') }}</p>
        <div class="record-info">
          <div>
            <span>{{ $t('mainDevConfiguration.recordPolicyName') }}：</span>
            <span>{{ cameraRecordInfo.recordPolicyName }}</span>
            <span class="ml-10">{{ $t('mainDevConfiguration.recordPlanType') }}：</span>
            <span>{{ selectDictLabel(recordTypeList, cameraRecordInfo.recordPlanType) }}</span>
          </div>
          <div v-if="PermissionCameraManage" class="cursor-pointer" @click="closeRecordPolicy">
            <svg-icon iconClass="close-record-plan" className="iconClass" />
            {{ $t('mainDevConfiguration.closeRecordPolicy') }}
          </div>
        </div>
        <!-- 网格时间选择控件 -->
        <time-grid-control ref="timeGridControl" id="time_grid_control1" />
      </div>
    </div>

    <div v-else class="no-data">
      <el-empty :image="noData">
        <template #description>
          {{ $t('mainDevConfiguration.noRecordPolicy') }}
          <span
            v-if="PermissionCameraManage"
            class="ml-5 text-blue-500 cursor-pointer"
            @click="addRecordPolicy"
          >
            {{ $t('mainDevConfiguration.goAdd') }}
          </span>
        </template>
      </el-empty>
    </div>
    <div class="footer">
      <el-button v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="applyToOthers">
        {{ $t('mainDevConfiguration.applyToOthers') }}
      </el-button>
    </div>
    <add-record-policy
      ref="addRecordPolicyForm"
      v-model:visible="dialogVisible"
      :recordMethod="recordMethod"
      :cameraId="cameraId"
      @getRecordInfo="getRecordPlanInfo"
    />
    <camera-selector
      ref="cameraSelector"
      :title="$t('mainDevConfiguration.selectCameras')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      @closed="handleCameraSelectorClosed"
      :device-type="1"
      :max="2000"
    />
    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="batchList"
      :what="$t('mainDevConfiguration.lens')"
      :operate="operate"
      :batchApi="batchApi"
      whatId="id"
      whatName="name"
      v-model:visible="batchDialogVisible"
      :multipleSelectionMany="multipleSelectionMany"
      full-screen
    />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import TimeGridControl from '@/components/time-grid-control'
import CameraSelector from '@components/cameraSelector'
import BatchOperate from '@/components/batchOperate'
import AddRecordPolicy from './add-record-policy'
export default {
  components: {
    TimeGridControl,
    CameraSelector,
    BatchOperate,
    AddRecordPolicy
  },
  props: ['cameraRecordInfo', 'recordMethod'],
  data() {
    return {
      noData: require('@/assets/img/common/no-data.png'),
      recordPlanList: [],
      dialogVisible: false,
      dialogDeviceVisible: false,
      batchDialogVisible: false,
      operate: undefined,
      batchApi: undefined,
      batchList: [],
      multipleSelectionMany: [],
      recordInfo: {}
    }
  },
  computed: {
    ...mapState({
      recordTypeList: state => state.dict['record_type'],
      cameraId: state => state.deviceConfig.cameraId,
      platRecordModifyCopy: state => state.deviceConfig.platRecordModifyCopy,
      puRecordModifyCopy: state => state.deviceConfig.puRecordModifyCopy
    }),
    ...mapGetters('deviceConfig', ['PermissionCameraManage'])
  },
  watch: {
    cameraRecordInfo: {
      handler: function (newVal) {
        if (newVal?.timeSpanList) this.initTimeGridControl()
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await this.getRecordPlanList()
  },
  methods: {
    ...mapMutations('deviceConfig', [
      'SET_PLAT_RECORD_INFO',
      'SET_PU_RECORD_INFO',
      'SET_PLAT_RECORD_MODIFY_COPY',
      'SET_PU_RECORD_MODIFY_COPY'
    ]),

    initTimeGridControl() {
      setTimeout(() => {
        this.$refs.timeGridControl.time_initialize(
          this.cameraRecordInfo.recordPlanType,
          1,
          this.cameraRecordInfo.timeSpanList
        )
      }, 1000)
    },
    addRecordPolicy() {
      this.dialogVisible = true
    },
    closeRecordPolicy() {
      this.$confirm(
        this.$t('mainDevConfiguration.closeRecordPolicyWarn'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          if (this.recordMethod === 0) {
            this.SET_PLAT_RECORD_INFO({})
          } else {
            this.SET_PU_RECORD_INFO({})
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('mainDevConfiguration.cancelCloseRecordPolicy')
          })
        })
    },
    async getRecordPlanInfo(planId) {
      const res = await this.$api.getRecordPlanInfo({ planId })
      if (res.resultCode == 0) {
        this.recordInfo = {
          recordPolicyId: res.planId,
          recordPolicyName: res.planName,
          recordPlanType: res.planType,
          timeSpanList: res.timeSpanList
        }
        if (this.recordMethod === 0) {
          this.SET_PLAT_RECORD_INFO(this.recordInfo)
        } else {
          this.SET_PU_RECORD_INFO(this.recordInfo)
        }
      }
      this.initTimeGridControl()
    },
    async getRecordPlanList() {
      const res = await this.$api.getRecordPlanList({ pageInfo: { pageNum: 1, pageSize: 500 } })
      if (res.resultCode == 0) {
        this.recordPlanList = res.recordPlanList
      }
    },
    async submitForm() {
      const obj = {
        cameraId: this.cameraId,
        recordMethod: this.recordMethod,
        recordPlanId: this.cameraRecordInfo.recordPolicyId
      }
      if (obj.recordPlanId) {
        const res = await this.$api.setCameraRecordPolicyInfo(obj)
        if (res.resultCode == 0) {
          this.recordMethod == 0
            ? this.SET_PLAT_RECORD_MODIFY_COPY(this.cameraRecordInfo)
            : this.SET_PU_RECORD_MODIFY_COPY(this.cameraRecordInfo)
          this.$message({
            message: this.$t('mainDevConfiguration.setCameraRecordPolicyInfoSuccess'),
            type: 'success'
          })
        }
      } else {
        const res = await this.$api.deleteCameraRecordPolicyInfo(obj)
        this.recordMethod == 0
          ? this.SET_PLAT_RECORD_MODIFY_COPY(this.cameraRecordInfo)
          : this.SET_PU_RECORD_MODIFY_COPY(this.cameraRecordInfo)
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('mainDevConfiguration.deleteCameraRecordPolicyInfoSuccess')
          })
        }
      }
    },
    applyToOthers() {
      if (
        (this.recordMethod == 0 &&
          JSON.stringify(this.cameraRecordInfo) == JSON.stringify(this.platRecordModifyCopy)) ||
        (this.recordMethod == 1 &&
          JSON.stringify(this.cameraRecordInfo) == JSON.stringify(this.puRecordModifyCopy))
      ) {
        this.dialogDeviceVisible = true
      } else {
        this.recordMethod == 0
          ? this.$message({
              message: this.$t('mainDevConfiguration.saveServerReocrdPlan'),
              type: 'warning'
            })
          : this.$message({
              message: this.$t('mainDevConfiguration.savePuReocrdPlan'),
              type: 'warning'
            })
      }
    },
    getCameras(cameras) {
      this.batchList = cameras
      this.batchOperateHandle()
    },
    handleCameraSelectorClosed() {
      this.$refs['cameraSelector'].refreshTree()
    },
    batchOperateHandle() {
      this.multipleSelectionMany = []
      this.operate =
        this.recordMethod == 0
          ? this.$t('mainDevConfiguration.batchSetServerRecordPlan')
          : this.$t('mainDevConfiguration.batchSetPuRecordPlan')
      this.cameraRecordInfo.recordPolicyId
        ? (this.batchApi = 'setCameraRecordPolicyInfo')
        : (this.batchApi = 'deleteCameraRecordPolicyInfo')

      this.batchList.forEach(item => {
        const obj = {
          cameraId: item.id,
          recordMethod: this.recordMethod,
          recordPlanId: this.cameraRecordInfo.recordPolicyId
        }
        this.multipleSelectionMany.push(obj)
      })
      this.batchDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.config-info {
  height: calc(100% - 60px);
}
.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.iconClass {
  display: inline;
  font-size: 14px;
}
.no-data {
  height: calc(100% - 60px);
}
:deep(.el-empty) {
  height: 100%;
}
</style>
