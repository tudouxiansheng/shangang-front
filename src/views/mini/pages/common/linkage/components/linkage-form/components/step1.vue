<template>
  <div class="linkage-form-item step1">
    <div :class="['flex', operation === 'edit' && 'justify-center']">
      <div v-if="operation === 'add'" class="select-camera flex-1">
        <div class="title" style="color: #64befd">
          <el-icon><el-icon-warning-outline /></el-icon>
          {{ $t('alarmLinkage.addTips') }}
        </div>
        <div class="device-tree">
          <DeviceTree ref="deviceTree" @check-change="handleCheckChange" />
        </div>
      </div>
      <div
        :class="[
          'select-camera',
          'flex-1',
          operation === 'add' && 'ml-5',
          operation === 'edit' && 'edit'
        ]"
      >
        <div :class="['title', operation === 'edit' && 'title_p']">
          <div v-if="operation === 'add'" class="title-content">
            <div>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              />
              {{ $t('alarmLinkage.selectedCamera') }}({{ $t('alarmLinkage.total') }}
              {{ selectedCameras.length }} {{ locale == 'zh' ? '个' : '' }})
            </div>
            <div class="title-btn" @click="handleDeleteCamera">
              <el-icon><el-icon-delete /></el-icon>
              <span style="margin-left: 5px">{{ $t('public.batchDeletion') }}</span>
            </div>
          </div>
          <template v-else>&nbsp;{{ $t('alarmLinkage.selectedCamera') }}</template>
        </div>
        <div v-if="operation === 'add'" class="selection-list">
          <el-checkbox-group v-model="checkedCameraIds" @change="handleCheckedCameraIdsChange">
            <el-checkbox
              :label="item.id"
              class="selection-list-item"
              v-for="(item, index) in selectedCameras"
              :key="index"
            >
              <i :class="iconSty_blue(item)" class="aci" />
              <span>{{ item.label }}</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="sticky-icon">
            <div v-for="(item, index) in selectedCameras" :key="index">
              <el-icon @click="handleDeleteCamera(index)"><el-icon-close /></el-icon>
            </div>
          </div>
        </div>
        <div v-else class="selection-list flex-col edit">
          <div class="selection-list-item">
            <span>{{ devName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="nextStep">
        {{ $t('alarmLinkage.nextStep') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  Warning as ElIconWarningOutline,
  Delete as ElIconDelete,
  Close as ElIconClose
} from '@element-plus/icons-vue'
import DeviceTree from './device-tree'
import devIcon from '@/utils/common/dev-icon.js'
const { getDevIcon } = devIcon()
export default {
  components: {
    DeviceTree,
    ElIconWarningOutline,
    ElIconDelete,
    ElIconClose
  },
  name: 'step1',
  props: {
    operation: {
      type: String,
      default: 'add'
    },
    devName: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      checkAll: false, //是否全选
      isIndeterminate: false,
      selectedCameras: [], //已选设备
      checkedCameraIds: [] //已选设备id
    }
  },
  created() {
    if (this.operation === 'edit') {
      this.selectedCameras.push({
        id: this.deviceId,
        label: this.devName,
        type: 2,
        payload: {
          deviceId: this.deviceId
        }
      })
    }
  },
  methods: {
    async nextStep() {
      if (!this.selectedCameras.length) {
        this.$message({
          type: 'warning',
          message: this.$t('alarmLinkage.chooseAlarmDevContent')
        })
        return
      }

      if (this.selectedCameras.length > 100) {
        this.$message({
          type: 'warning',
          message: `${this.$t('alarmLinkage.deviceMaxLength')}`
        })
        return
      }
      this.$emit('next', {
        step: 1,
        data: this.selectedCameras
      })
    },
    iconSty_blue(node) {
      if (node.type == 1 && node.payload.type == 1) {
        return 'aci-organization iconCss1'
      } else if (node.type == 1) {
        return 'aci-x006-folder iconCss1'
      } else {
        return getDevIcon(node.payload.status, node.payload.deviceType)
      }
    },
    handleCheckChange(cameras) {
      this.selectedCameras = cameras
    },
    handleCheckAllChange(val) {
      let checkedIds = []
      for (let j = 0; j < this.selectedCameras.length; j++) {
        checkedIds.push(this.selectedCameras[j].id)
      }
      this.checkedCameraIds = val ? checkedIds : []
      this.isIndeterminate = false
    },
    handleCheckedCameraIdsChange(val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.selectedCameras.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectedCameras.length
    },
    handleDeleteCamera(index) {
      if (typeof index === 'number') {
        let delId = this.selectedCameras[index].id
        let delIndex = this.checkedCameraIds.indexOf(delId)
        this.$refs.deviceTree.checkNode(this.selectedCameras[index].id, false)
        this.selectedCameras.splice(index, 1)
        this.checkedCameraIds.splice(delIndex, 1)
      } else {
        this.selectedCameras = this.selectedCameras.filter(
          item => !this.checkedCameraIds.includes(item.id)
        )
        this.checkedCameraIds.forEach(id => {
          this.$refs.deviceTree.checkNode(id, false)
        })
        this.checkedCameraIds = []
      }
      this.checkAll =
        this.checkedCameraIds.length > 0 &&
        this.checkedCameraIds.length === this.selectedCameras.length
      this.isIndeterminate =
        this.checkedCameraIds.length > 0 &&
        this.checkedCameraIds.length < this.selectedCameras.length
    }
  }
}
</script>
