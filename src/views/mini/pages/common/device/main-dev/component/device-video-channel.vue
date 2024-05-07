<template>
  <div>
    <!-- 设备视频通道信息 -->
    <el-dialog
      :title="$t('primaryDevice.dialogVEquipmentChannel')"
      v-model="$parent.videoChannelDialogVisible"
      width="1200px"
      id="cameraInfo"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <div style="height: 40px" v-if="$parent.PermissionCameraManage">
        <el-button type="primary" :icon="ElIconCheck" :disabled="startBtn" @click="handelStart">
          {{ $t('public.batchEnable') }}
        </el-button>
        <el-button type="primary" :icon="ElIconClose" :disabled="stopBtn" @click="handelStop">
          {{ $t('public.batchDeactivation') }}
        </el-button>
      </div>

      <el-table
        class="elTable"
        :data="cameraList"
        v-loading="loading"
        :element-loading-text="$t('public.loading')"
        
        style="width: 100%; margin-top: 20px"
        @selection-change="handleSelectionChange"
        @row-contextmenu="rowContextmenu"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column label width="40" type="selection" v-if="$parent.PermissionCameraManage" />
        <el-table-column
          :label="$t('primaryDevice.cameraName')"
          min-width="100"
          show-overflow-tooltip
          prop="cameraName"
        >
          <template #default="{ row }">
            <el-input v-if="isOk" v-model="row.cameraName"></el-input>
            <span v-else>{{ row.cameraName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('primaryDevice.cameraId')"
          min-width="100"
          ref="status"
          show-overflow-tooltip
          prop="cameraId"
        >
          <template #default="{ row }">
            <span>{{ row.cameraId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.thirdMainDevId')"
          min-width="100"
          show-overflow-tooltip
          prop="thirdCameraId"
        >
          <template #default="{ row }">
            <span>{{ row.thirdCameraId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('primaryDevice.interconnectCode')"
          min-width="60"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.interconnectCode }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('primaryDevice.channelNo')"
          min-width="50"
          show-overflow-tooltip
          prop="channelNo"
        >
          <template #default="{ row }">
            <span>{{ row.channelNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.isEnabled')"
          min-width="50"
          show-overflow-tooltip
          prop="isEnabled"
        >
          <template #default="{ row }">
            <span :class="row.isEnabled == '0' ? 'danger' : 'success'">
              {{ setIsEnabled(row.isEnabled) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('primaryDevice.ptzType')"
          min-width="70"
          show-overflow-tooltip
          prop="ptzType"
        >
          <template #default="{ row }">
            <el-select v-if="isOk" v-model="row.ptzType">
              <el-option
                v-for="item in devTypeList"
                :key="item.index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span v-else>{{ setDevType(row.ptzType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('public.state')"
          min-width="45"
          show-overflow-tooltip
          prop="status"
        >
          <template #default="{ row }">
            <span
              :class="
                row.status == '0'
                  ? 'warning'
                  : row.status == '1'
                  ? 'success'
                  : row.status == '2'
                  ? 'danger'
                  : ''
              "
            >
              {{ setStatus(row.status) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('public.operating')"
          min-width="60"
          v-if="$parent.PermissionCameraManage"
        >
          <template #default="{ row }">
            <span class="cell-operate" @click="handleEdit(row)">
              {{ isOk ? $t('primaryDevice.preserve') : $t('public.modify') }}
            </span>
            <span
              style="margin-right: 7px; cursor: pointer"
              :class="row.isEnabled == '0' ? 'blue' : 'danger'"
              @click="camera_enable(row)"
            >
              {{ row.isEnabled == 0 ? $t('public.enable') : $t('public.deactivate') }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="dialogClosed">{{ $t('public.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <batch-operate
      v-model:visible="batchDialogVisible"
      :multipleSelection="multipleSelection"
      :what="$t('batchOperator.videoChannel')"
      whatId="cameraId"
      whatName="cameraName"
      :multipleSelectionMany="multipleSelectionMany"
      :operate="operate"
      :batchApi="batchApi"
      @getList="getCameraList"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Check as ElIconCheck, Close as ElIconClose } from '@element-plus/icons-vue'
import tableCopy from '@/mixin/tableCopy.js'
import devDict from '@/mixin/dev-dict.js'
import batchOperate from '@/components/batchOperate' //批量操作

export default {
  data() {
    return {
      isOk: false,
      //批量操作对话框
      batchApi: '',
      operate: '',
      multipleSelectionMany: [],
      batchDialogVisible: false,
      multipleSelection: [],
      //批量启用
      startBtn: true,
      //批量停用
      stopBtn: true,
      loading: true,
      cameraList: [],
      dataText: '',
      ElIconCheck,
      ElIconClose
    }
  },
  mixins: [tableCopy, devDict],
  components: { 'batch-operate': batchOperate },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.getCameraList()
      })
    },
    async getCameraList() {
      this.dataText = ''
      this.loading = true
      let data = {
        mainDevId: this.$parent.mainDevId
      }
      await this.$api.getCameraListByMainDevId(data).then(res => {
        if (res.cameraList && res.cameraList.length) {
          this.cameraList = res.cameraList.map(item => {
            item.ptzType = item.ptzType + ''
            return item
          })
        } else {
          this.cameraList = []
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    dialogClosed() {
      this.$parent.videoChannelDialogVisible = false
      this.dataText = ''
      this.cameraList = []
    },
    handleEdit(row) {
      this.isOk = !this.isOk
      if (this.isOk == false) {
        let data = {
          cameraId: row.cameraId,
          cameraName: row.cameraName,
          ptzType: row.ptzType
        }
        this.$api.modifyCameraInfo(data).then(res => {
          if (res.resultCode === 0) {
            this.$message({
              message: this.$t('public.modifySuccess'),
              type: 'success'
            })
          }
        })
      }
    },
    // 停启用视频通道
    camera_enable(row) {
      this.$api.getCameraInfoQuery({ cameraId: row.cameraId }).then(res => {
        if (res.resultCode === 0) {
          let isEnabled = 0
          if (res.cameraInfo.isEnabled == 0) {
            isEnabled = 1
            this.enable_Camera(row, isEnabled)
          } else {
            isEnabled = 0
            this.$confirm(this.$t('public.StopUsingChannel'), this.$t('public.StopChannel'), {
              confirmButtonText: this.$t('public.confirm'),
              cancelButtonText: this.$t('public.cancel'),
              type: 'warning',
              closeOnClickModal: false
            })
              .then(() => {
                this.enable_Camera(row, isEnabled)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('public.canceleddelete')
                })
              })
          }
        }
      })
    },
    enable_Camera(row, isEnabled) {
      let data = {
        cameraId: row.cameraId,
        isEnabled
      }
      this.$api.enableCamera(data).then(res => {
        if (res.resultCode === 0) {
          this.$message({
            message: this.$t('public.operatingSuccessContent'),
            type: 'success'
          })
          row.isEnabled = isEnabled
        }
      })
    },

    setIsEnabled(val) {
      if (val == 0) {
        return this.$t('public.deactivate')
      } else if (val == 1) {
        return this.$t('public.enable')
      } else {
        return this.$t('primaryDevice.Abnormal')
      }
    },

    // 批量启用
    handelStart() {
      this.startOrStop(1, this.$t('public.batchEnable'))
    },
    // 批量停用
    handelStop() {
      this.$confirm(this.$t('public.StopUsingChannel'), this.$t('public.StopChannel'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.startOrStop(0, this.$t('public.batchDeactivation'))
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceleddelete')
          })
        })
    },
    startOrStop(isEnabled, title) {
      this.operate = title
      this.batchApi = 'enableCamera'
      let arr = []
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const item = this.multipleSelection[index]
        arr.push({
          cameraId: item.cameraId,
          isEnabled
        })
      }
      this.multipleSelectionMany = arr
      this.batchDialogVisible = true
    },

    handleSelectionChange(val) {
      this.multipleSelection = val

      // 判断选中的数据中isEnabled是否都为true,用于批量启用，批量停用
      var b = val.every(item => {
        return item.isEnabled == true
      })
      var c = val.every(item => {
        return item.isEnabled == false
      })
      // 如果数据不为空
      if (val.length != 0) {
        // 状态都为true，可以批量启用
        if (b == true) {
          this.startBtn = true
          this.stopBtn = false
        }

        // 状态都为false，可以批量停用
        if (c == true) {
          this.startBtn = false
          this.stopBtn = true
        }

        // 状态有不是为false，则都不可以
        else if (b == false) {
          this.startBtn = true
          this.stopBtn = true
        }
      }
      // 如果数据为空，都禁用状态
      else {
        this.startBtn = true
        this.stopBtn = true
      }
    }
  }
}
</script>

<style lang="scss">
#cameraInfo {
  .el-dialog {
    position: relative;
  }
  .el-dialog__body {
    padding: 15px 30px 5px !important;
  }
  .el-icon-check:before {
    font-size: 12px;
  }
}
</style>
