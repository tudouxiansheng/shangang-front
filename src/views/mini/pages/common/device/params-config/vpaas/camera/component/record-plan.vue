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
            <template v-if="platType === PLATFORM_TYPE.VPAAS && recordMethod === 0">
              <span class="ml-10">{{ $t('mainDevConfiguration.storageNodeId') }}：</span>
              <span>
                {{
                  formatteredStorageNodeId(
                    cameraRecordInfo.storageNodeId
                      ? cameraRecordInfo.storageNodeId
                      : cameraRecordInfo.cameraMediaConfigInfo.storageNodeId
                  )
                }}
              </span>
            </template>
            <span class="ml-10">{{ $t('mainDevConfiguration.recordStoreDays') }}：</span>
            <span>{{ cameraRecordInfo.recordStoreDays }}</span>
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
      :platType="platType"
    />
    <camera-selector
      ref="cameraSelector"
      :title="$t('mainDevConfiguration.selectCameras')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      @closed="handleCameraSelectorClosed"
      :device-type="1"
      :platform-type="platType"
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
import { mapState, mapMutations, mapGetters } from 'vuex'
import TimeGridControl from '@/components/time-grid-control'
import CameraSelector from '@components/cameraSelector'
import BatchOperate from '@/components/batchOperate'
import AddRecordPolicy from './add-record-policy'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
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
      recordInfo: {},
      isSupported: false,
      groupList: [],
      PLATFORM_TYPE: PLATFORM_TYPE
    }
  },
  computed: {
    ...mapState({
      recordTypeList: state => state.dict['record_type'],
      cameraId: state => state.deviceConfig.cameraId,
      platRecordModifyCopy: state => state.deviceConfig.platRecordModifyCopy,
      puRecordModifyCopy: state => state.deviceConfig.puRecordModifyCopy
    }),
    ...mapGetters('deviceConfig', ['platType', 'PermissionCameraManage', 'domainCode'])
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
    this.platType == PLATFORM_TYPE.VPAAS ? await this.getMediaNodeList() : ''
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
    async getRecordPlanInfo(obj) {
      const res = await this.$api.getRecordPlanInfo({
        planId: obj.recordPlanId
      })
      if (res.resultCode == 0) {
        this.recordInfo = {
          recordPolicyId: res.planId,
          recordStoreDays: Number(obj.recordStoreDays),
          recordPolicyName: res.planName,
          recordPlanType: res.planType,
          timeSpanList: res.timeSpanList,
          storageNodeId:
            this.recordMethod === 0 && this.platType == PLATFORM_TYPE.VPAAS
              ? obj.storageNodeId[1]
              : undefined
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
    async getMediaNodeList() {
      if (this.recordMethod !== 0) return
      const params = {
        domainCode: this.domainCode,
        nodeAbility: 2
      }
      const res = await this.$api.getMediaNodeList(params)
      if (res.resultCode === 0) {
        if (res.groupList && res.groupList.length && res.groupList[0].mediaNodeList) {
          const groupList = res.groupList
          groupList.forEach(item1 => {
            item1.label = item1.groupId
            item1.value = item1.groupId
            item1.mediaNodeList.forEach(item2 => {
              item2.value = item2.nodeId
              item2.label = `${item2.serverIp}(${item2.taskCount}/${item2.maxTask})`
            })
          })
          this.groupList = groupList
          this.isSupported = true
        } else {
          this.isSupported = false
        }
      }
    },
    async submitForm() {
      let storageNodeId = undefined
      if (this.recordMethod === 0) {
        if (this.cameraRecordInfo.storageNodeId) {
          storageNodeId = this.cameraRecordInfo.storageNodeId
        } else if (
          this.cameraRecordInfo.cameraMediaConfigInfo &&
          this.cameraRecordInfo.cameraMediaConfigInfo.storageNodeId
        ) {
          storageNodeId = this.cameraRecordInfo.cameraMediaConfigInfo.storageNodeId
        }
      }

      const obj = {
        cameraId: this.cameraId,
        recordMethod: this.recordMethod,
        recordPlanId: this.cameraRecordInfo.recordPolicyId,
        recordStoreDays: this.cameraRecordInfo.recordStoreDays,
        storageNodeId: this.platType == PLATFORM_TYPE.VPAAS ? storageNodeId : undefined
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
        let storageNodeId = undefined
        if (this.recordMethod === 0) {
          if (this.cameraRecordInfo.storageNodeId) {
            storageNodeId = this.cameraRecordInfo.storageNodeId
          } else if (
            this.cameraRecordInfo.cameraMediaConfigInfo &&
            this.cameraRecordInfo.cameraMediaConfigInfo.storageNodeId
          ) {
            storageNodeId = this.cameraRecordInfo.cameraMediaConfigInfo.storageNodeId
          }
        }
        const obj = {
          cameraId: item.id,
          recordMethod: this.recordMethod,
          recordPlanId: this.cameraRecordInfo.recordPolicyId,
          storageNodeId: this.platType == PLATFORM_TYPE.VPAAS ? storageNodeId : undefined,
          recordStoreDays: this.cameraRecordInfo.recordStoreDays
        }
        this.multipleSelectionMany.push(obj)
      })
      this.batchDialogVisible = true
    },
    formatteredStorageNodeId(storageNodeId) {
      let name = undefined

      this.groupList.forEach(item1 => {
        const list = item1.mediaNodeList.filter(item2 => item2.nodeId === storageNodeId)
        if (list.length > 0) name = list[0].serverIp
      })
      return name
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
