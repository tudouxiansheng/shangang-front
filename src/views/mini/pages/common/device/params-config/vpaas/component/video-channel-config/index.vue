<template>
  <div class="video-channel-config">
    <div class="video-channel-config_header">
      <el-tabs v-model="activeType" type="card">
        <el-tab-pane
          v-for="item in videoChannelType"
          :key="item.value"
          :label="item.name"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="video-channel-config_content">
      <video-config ref="videoConfig" v-if="activeType === '0'" />

      <image-config v-else-if="activeType === '1' && support" />

      <move-config v-else-if="activeType === '2' && support" />

      <cover-config v-else-if="activeType === '3' && support" />

      <front-snap v-else-if="activeType === '4' && support" />

      <privacy-config v-else-if="activeType === '5' && support" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VideoConfig from './component/video-config.vue'
import ImageConfig from './component/image-config.vue'
import MoveConfig from './component/move-config.vue'
import CoverConfig from './component/cover-config.vue'
import privacyConfig from './component/privacy-config.vue'
import frontSnap from './component/front-snap.vue'
import { getChannelAvailableTabs } from '../../utils'
export default {
  components: { VideoConfig, ImageConfig, frontSnap, MoveConfig, CoverConfig, privacyConfig },
  data() {
    return {
      cuType: sessionStorage.getItem('cuType'),
      emptyImg: require('@/assets/img/common/analyze.png'),
      activeType: '0'
    }
  },
  computed: {
    ...mapGetters('deviceConfig', [
      'platType',
      'drive',
      'cameraStatus',
      'cameraIsExDomain',
      'mainDevType'
    ]),
    support() {
      // 在线、本域
      let flag = false
      flag = this.cameraStatus === 1 && !this.cameraIsExDomain
      return flag
    },
    videoChannelType() {
      let arr = [
        {
          name: this.$t('mainDevConfiguration.videoSettings'),
          value: '0'
        }
      ]
      if (this.support) {
        arr = getChannelAvailableTabs(this.mainDevType, this.drive, this.platType)
      }
      return arr
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss">
.video-channel-config {
  display: flex;
  flex-direction: column;
  flex: 17;
  height: 100%;
  padding-bottom: 20px;
  &_header {
    .el-tabs.el-tabs--card.el-tabs--top {
      width: fit-content;
      .el-tabs__header {
        border-bottom: none;
      }
      .el-tabs__item {
        background: initial !important;
        color: #cccccc;
        border-bottom: none;
        border-color: #0e6294;
      }
      .el-tabs__item.is-active {
        background: #0e6294 !important;
        color: #ffffff;
      }
      .el-tabs__nav {
        border: 1px solid #0b537e;
        border-radius: 4px;
      }
    }
  }
  &_content {
    flex: 1;
    height: calc(100% - 156px);
  }
}
</style>
