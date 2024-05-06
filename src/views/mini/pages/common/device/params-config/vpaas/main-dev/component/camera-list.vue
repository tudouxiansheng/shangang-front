<template>
  <div
    class="camera-list"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
    
  >
    <div
      ref="cameraItem"
      :class="['camera_item', value === item.cameraId && 'selected']"
      v-for="item in cameraList"
      :key="item.cameraId"
      @click="
        ev => {
          handleItemClick(item.cameraId, item, ev)
        }
      "
    >
      <i :class="iconSty(item)" class="aci"></i>
      <el-tooltip effect="dark" :content="item.cameraName" placement="top-start">
        <span>{{ item.cameraName }}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import devIcon from '@/utils/common/dev-icon'
const { getDevIcon } = devIcon()
export default {
  props: {
    mainDevId: {
      type: String,
      default: ''
    },
    value: {},
    filterId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      cameraList: []
    }
  },
  created() {
    this.getCameraList()
  },
  methods: {
    async getCameraList() {
      this.loading = true
      await this.$api
        .getCameraListByMainDevId({
          mainDevId: this.mainDevId
        })
        .then(res => {
          if (res.cameraList && res.cameraList.length) {
            if (this.filterId) {
              res.cameraList = res.cameraList.filter(item => item.cameraId === this.filterId)
            }
            this.cameraList = res.cameraList.map(item => {
              item.ptzType = item.ptzType + ''
              return item
            })
            this.$nextTick(() => {
              let e = document.createEvent('MouseEvents')
              e.initEvent('click', true, true)
              this.$refs.cameraItem[0].dispatchEvent(e)
            })
          } else {
            this.cameraList = []
          }
          this.loading = false
        })
        .catch(error => {
          this.cameraList = []
          this.loading = false
        })
    },
    iconSty(camera) {
      return getDevIcon(camera.status, camera.ptzType)
    },
    handleItemClick(cameraId, camera, event) {
      this.$emit('input', cameraId)
      this.$emit('camera-change', camera, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.camera-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #082b40;
  .camera_item {
    padding: 13px 10px 11px 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s linear;
    cursor: pointer;
    color: #999999;
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
  }
}
</style>
