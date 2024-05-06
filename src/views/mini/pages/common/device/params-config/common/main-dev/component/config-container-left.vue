<template>
  <div id="config-container-left">
    <div class="container-title">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        {{ $t('mainDevConfiguration.selectAll') }}
      </el-checkbox>
      <div v-has-permi="[2012]">
        <el-tag type="danger" class="mr-3 cursor-pointer" @click="enableCamera(0)">
          {{ $t('mainDevConfiguration.stop') }}
        </el-tag>
        <el-tag type="success" class="cursor-pointer" @click="enableCamera(1)">
          {{ $t('mainDevConfiguration.start') }}
        </el-tag>
      </div>
    </div>
    <el-checkbox-group
      class="label-hide"
      v-model="checkedCameras"
      @change="handleCheckedCamerasChange"
    >
      <div
        v-for="item in cameraList"
        :key="item.cameraId"
        :class="['container-content', cameraId === item.cameraId && 'selected']"
      >
        <el-checkbox :label="item.cameraId"><br /></el-checkbox>
        <div class="container-content-right" @click="handleItemClick(item)">
          <div class="container-content-right-left">
            <i :class="iconSty(item)" class="ml-5 aci"></i>
            <el-tooltip effect="dark" :content="item.cameraName" placement="top-start">
              <span>{{ item.cameraName }}</span>
            </el-tooltip>
          </div>
          <svg-icon v-if="item.isEnabled === 0" iconClass="stop" className="iconClass" />
        </div>
      </div>
    </el-checkbox-group>
    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="batchList"
      :what="$t('mainDevConfiguration.camera')"
      :operate="$t('mainDevConfiguration.batchStartStopCameras')"
      batchApi="enableCamera"
      whatId="cameraId"
      whatName="cameraName"
      v-model:visible="batchDialogVisible"
      :multipleSelectionMany="multipleSelectionMany"
      :isHasHandle="true"
      @afterSuccessHandle="getCameraListByMainDevId"
    />
  </div>
</template>
<script>
import devIcon from '@/utils/common/dev-icon'
import BatchOperate from '@/components/batchOperate'
import { mapState } from 'vuex'

const { getDevIcon } = devIcon()
export default {
  components: { BatchOperate },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkedCameras: [],
      cameraList: [],
      batchList: [],
      batchDialogVisible: false,
      multipleSelectionMany: []
    }
  },
  computed: {
    ...mapState({
      cameraId: state => state.deviceConfig.cameraId,
      mainDevId: state => state.deviceConfig.mainDevId
    }),
    cameraIdList() {
      let ids = []
      this.cameraList.forEach(item => {
        ids.push(item.cameraId)
      })
      return ids
    }
  },
  created() {
    this.getCameraListByMainDevId()
  },
  methods: {
    async getCameraListByMainDevId() {
      let res = await this.$api.getCameraListByMainDevId({ mainDevId: this.mainDevId })
      if (res.resultCode == 0) {
        this.cameraList = res.cameraList
        if (
          this.$route.name == 'MainDeviceFrontEndParameterConfiguration' &&
          this.$parent.$refs['videoChannelConfig']
        ) {
          if (this.$parent.$refs['videoChannelConfig'].$children) {
            this.$parent.$refs['videoChannelConfig']?.$children[1].getCameraInfo()
          }
        }
      }

      if (this.cameraList.length > 0) this.handleItemClick(this.cameraList[0])
    },
    handleCheckAllChange(val) {
      this.checkedCameras = val ? this.cameraIdList : []
      this.isIndeterminate = false
    },
    handleCheckedCamerasChange(val) {
      this.checkedCameras = val
      this.checkAll = val.length === this.cameraList.length
      this.isIndeterminate = val.length > 0 && val.length < this.cameraList.length
    },
    handleItemClick(item) {
      if (item.cameraId === this.cameraId) return
      this.$emit('cameraChange', item.cameraId)
    },
    iconSty(camera) {
      return getDevIcon(camera.status, camera.ptzType)
    },
    enableCamera(isEnabled) {
      this.multipleSelectionMany = []
      if (this.checkedCameras.length > 0) {
        this.checkedCameras.forEach(item1 => {
          let obj = {
            cameraId: item1,
            isEnabled: isEnabled
          }
          this.multipleSelectionMany.push(obj)
        })
        this.batchList = this.cameraList.filter(item => {
          return this.checkedCameras.includes(item.cameraId)
        })
        this.batchDialogVisible = true
      } else {
        this.$message({
          message: this.$t('mainDevConfiguration.pleaseSelectTheCamera'),
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="scss">
#config-container-left {
  height: 100%;
  .container-title {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #0e5a87;
  }
  .container-content {
    display: flex;
    padding: 13px 10px 11px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s linear;
    cursor: pointer;
    font-size: 14px;
    &.selected,
    &:hover {
      background-color: #1499e7;
      color: #fff;
      i {
        color: #fff;
      }
    }
    i {
      color: #999999;
    }
    &-right {
      display: flex;
      flex: 1;
      .container-content-right-left {
        flex: 1;
        vertical-align: middle;
        line-height: 24px;
      }
    }
  }
  .el-tag.el-tag--danger {
    background-color: rgba(242, 88, 88, 0.18);
    border-color: transparent;
    color: #f25858;
  }
  .el-tag.el-tag--success {
    background-color: rgba(0, 228, 152, 0.12);
    border-color: transparent;
    color: #00e498;
  }
  .iconClass {
    display: inline;
    text-align: right;
  }
  .svg-icon {
    margin-top: 5px;
  }
  .el-checkbox__label {
    color: #fff;
  }
  .label-hide .el-checkbox__label {
    display: none;
  }
}
</style>
