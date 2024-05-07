<template>
  <!-- 左侧 资源查询 -->
  <div class="snapshot-resource">
    <el-page-header @back="goBack" content="" />
    <div class="resource-container">
      <div class="pl-5 mt-7">
        <span class="mr-5">{{ $t('retrieval.trajectoryRoute') }}</span>
        <el-radio-group v-model="trackDrection" @change="trackDrectionChange">
          <el-radio :label="1">{{ $t('retrieval.forwardTrajectory') }}</el-radio>
          <el-radio :label="2">{{ $t('retrieval.reverseTrajectory') }}</el-radio>
        </el-radio-group>
      </div>
      <div class="mt-7" v-for="(item, index) in deviceListGroup" :key="index">
        <div class="resource-container-title">
          <span class="view-today-track">{{ item.recordTimeDate }}</span>
          <el-button
            v-if="!item.isMoving"
            class="view-today-track"
            type="primary"
            size="small"
            @click="viewTrack(1, item.deviceList, index)"
          >
            {{ $t('retrieval.viewTodayTrack') }}
          </el-button>
          <el-button
            v-else
            class="view-today-track"
            type="primary"
            size="small"
            @click="cancelViewTrack(1, index)"
          >
            {{ $t('retrieval.cancelViewTodayTrack') }}
          </el-button>
        </div>
        <div class="resource-container-content">
          <img v-for="(item1, index1) in item.deviceList" :key="index1" :src="item1.thumPicUrl" />
        </div>
      </div>
    </div>
    <el-button v-if="!isMoving" class="view-track" type="primary" @click="viewTrack(2, [], -1)">
      {{ $t('retrieval.viewTrack') }}
    </el-button>
    <el-button v-else class="view-track" type="primary" @click="cancelViewTrack(2)">
      {{ $t('retrieval.cancelViewTrack') }}
    </el-button>
  </div>
</template>

<script>
export default {
  props: ['deviceListGroup', 'isMarkerMoving', 'deviceList'],
  data() {
    return {
      isMoving: false,
      isNewTrack: true,
      oldIndex: -1,
      trackList: [],
      trackDrection: 1
    }
  },

  mounted() {},
  methods: {
    goBack() {
      this.$router.back()
    },
    trackDrectionChange() {
      if (this.isMoving) {
        if (this.isMarkerMoving) {
          this.$confirm(this.$t('retrieval.trajectoryPrompt'), this.$t('public.prompt'), {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning'
          })
            .then(() => {
              this.$emit('trackDrectionChange', this.trackDrection)
            })
            .catch(() => {})
        }
      } else {
        this.$emit('trackDrectionChange', this.trackDrection)
      }
    },
    viewTrack(type, list, index) {
      if (this.isMarkerMoving) {
        return this.$alert(this.$t('retrieval.isDrawTrack'), this.$t('public.prompt'))
      }
      const isOnlyOne = type == 1 ? this.judgeCanMove(list) : this.judgeCanMove(this.deviceList)
      if (isOnlyOne) {
        return this.$alert(this.$t('retrieval.onlyOneCamera'), this.$t('public.prompt'))
      }
      if (index != this.oldIndex) {
        this.oldIndex = index
        let arr = []
        if (type === 2) {
          for (let i = 0; i < this.deviceListGroup.length; i++) {
            for (let j = 0; j < this.deviceListGroup[i].deviceList.length; j++) {
              if (
                this.deviceListGroup[i].deviceList[j]?.longitude &&
                this.deviceListGroup[i].deviceList[j]?.latitude
              ) {
                arr.push([
                  this.deviceListGroup[i].deviceList[j].longitude,
                  this.deviceListGroup[i].deviceList[j].latitude
                ])
              }
            }
          }
          this.trackList = arr

          this.$emit('startAnimation', { trackList: this.trackList })
        } else {
          list.forEach(item => {
            if (item?.longitude && item?.latitude) arr.push([item.longitude, item.latitude])
          })
          this.trackList = arr

          this.$emit('startAnimation', { trackList: this.trackList, index })
        }
      } else {
        this.$emit('resumeAnimation')
      }
    },
    judgeCanMove(list) {
      // 经纬度去重
      let obj = {}
      let arr = list.reduce((pre, cur) => {
        obj[(cur.cameraId, cur.longitude + cur.latitude)]
          ? ''
          : (obj[cur.longitude + cur.latitude] = true && pre.push(cur))
        return pre
      }, [])
      return arr.length > 1 ? false : true
    },
    cancelViewTrack(type, index) {
      if (type === 2) {
        this.$emit('pauseAnimation')
      } else {
        this.$emit('pauseAnimation', index)
      }
    }
  }
}
</script>

<style lang="scss">
.snapshot-resource {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  padding-left: 0;
  background: #0a314f;
  width: 23%;
  z-index: 999;
  height: calc(100% - 40px);

  .el-page-header {
    margin-left: 10px;
    color: #10a9ff;

    .el-page-header__left::after {
      width: 0;
    }
  }

  .resource-container {
    height: calc(100% - 30px);
    overflow-y: auto;

    .el-radio-group {
      .el-radio__label {
        font-size: 12px !important;
      }
    }

    &-title {
      display: flex;
      justify-content: space-between;
      margin-left: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.24);
      font-size: 14px;

      .view-today-track {
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
      }
    }

    &-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px;
      grid-auto-rows: 120px;
      padding: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .view-track {
    position: absolute;
    bottom: 10px;
    width: calc(100% - 20px);
    margin-left: 10px;
  }
}
</style>
