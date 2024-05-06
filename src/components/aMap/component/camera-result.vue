<template>
  <!-- 筛选结果||地图框选范围结果 -->
  <div class="searchResult">
    <ul class="result-ul">
      <li v-for="(item, index) in resultList" :key="item.deviceId" class="result-li">
        <div class="device-name">
          <span>{{ index + 1 }}、</span>
          <i :class="iconSty(item)" class="aci icons" />
          <span class="item-text" :title="item.deviceName" @click="handleDetail(item)">
            {{ item.deviceName }}
          </span>
        </div>
        <div v-if="cuType == 1 || cuType == 4" class="item-action">
          <svg-icon icon-class="realtime-play" @click.stop="handlePlay(item)" />
          <svg-icon icon-class="record-playback" @click.stop="goToReplay(item)" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import devIcon from '@/utils/dev-icon'
const { getDevIcon } = devIcon()

import videoPlay from '@/utils/video-play.js'
const { goToRealtimePlay, goToRecordPlayback } = videoPlay()
export default {
  props: {
    resultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      cuType: sessionStorage.getItem('cuType')
    }
  },
  computed: {
    ...mapState({
      playDevId: state => state.mapSet.playDevId
    })
  },
  methods: {
    iconSty(item) {
      const status = item.status
      const deviceType = item.deviceType
      return getDevIcon(status, deviceType)
    },
    handlePlay(item) {
      let playDevId = this.playDevId == item.deviceId ? '' : item.deviceId
      this.$store.commit('mapSet/set_playDevId', playDevId)
      goToRealtimePlay(item.deviceId, item.deviceName)
    },
    // 跳转到 录像
    goToReplay(item) {
      goToRecordPlayback(item.deviceId, item.deviceName)
    },
    handleDetail(item) {
      if (item.longitude && item.latitude) {
        this.$emit('getDetail', item)
      } else {
        this.$message.warning(this.$t('gis.CantViewDetails') + '!')
      }
    }
  }
}
</script>

<style lang="scss">
.searchResult {
  position: relative;
  .result-ul {
    overflow-y: auto;
    overflow-x: hidden;

    .result-li {
      padding: 10px 0;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #42526e;
      display: flex;
      justify-content: space-between;
      .item-text {
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        width: 120px;
        display: inline-block;
        vertical-align: bottom;
      }
      .item-action {
        font-size: 16px;
        display: flex;
        align-items: center;
        .svg-icon {
          cursor: pointer;
          margin: 0 4px;
        }
        i {
          // padding: 0 5px;
          cursor: pointer;
        }
      }
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      background-color: #f2f2f2 !important;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      background-color: #b3b3b3 !important;
    }

    // 定义滚动条轨道 边角
    &::-webkit-scrollbar-corner {
      background-color: #f2f2f2 !important;
    }
  }
}
</style>
