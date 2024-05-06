<template>
  <div
    id="camera-params-config"
    v-if="isRouterAlive"
    ref="cameraParamsConfig"
    v-loading="pageLoading"
    :element-loading-text="$t('public.loading')"
    
  >
    <el-page-header v-if="cuType !== '1'" @back="goBack" :content="cameraName"></el-page-header>
    <div :class="['center_container', cuType === '1' && 'full_height']">
      <el-tabs v-model="activeMenuName">
        <el-tab-pane
          :key="item.value"
          v-for="item in settingMenus"
          :label="item.name"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="form_component">
        <video-channel-config v-if="activeMenuName === 'video' && !pageLoading" />
        <record-plan
          v-else-if="activeMenuName === 'severRecordPlan' && !pageLoading"
          :recordMethod="0"
          :cameraRecordInfo="platRecordInfo"
        />
        <record-plan
          v-else-if="activeMenuName === 'frontRecordPlan' && !pageLoading"
          :recordMethod="1"
          :cameraRecordInfo="puRecordInfo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VideoChannelConfig from '../component/video-channel-config'
import RecordPlan from './component/record-plan.vue'
import { mapState, mapGetters } from 'vuex'
import { getCameraAvailableTabs } from '../utils'
export default {
  name: 'CameraParameterConfiguration',
  components: {
    VideoChannelConfig,
    RecordPlan
  },
  data() {
    return {
      img: require('@/assets/img/common/xingzhuang.png'),
      cuType: sessionStorage.getItem('cuType'),
      isRouterAlive: true,
      pageLoading: false,
      activeMenuName: 'video',
      settingMenus: []
    }
  },
  mounted() {
    this.setSettingMenus()
  },
  computed: {
    ...mapState('deviceConfig', ['cameraInfo', 'platRecordInfo', 'puRecordInfo']),
    ...mapGetters('deviceConfig', [
      'cameraName',
      'cameraStatus',
      'platType',
      'drive',
      'cameraIsExDomain',
      'mainDevType'
    ])
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    setSettingMenus() {
      this.settingMenus = getCameraAvailableTabs(this.mainDevType, this.drive)
    }
  }
}
</script>

<style lang="scss">
#camera-params-config {
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  .el-page-header {
    line-height: 32px;
    padding-bottom: 10px;
    .el-page-header__content {
      color: #fff;
    }
  }

  .center_container {
    width: 100%;
    height: calc(100% - 42px);
    background-color: #052132;
    box-sizing: border-box;
    padding: 5px 20px;
    position: relative;
    &.full_height {
      height: 100%;
    }
    .el-tabs.el-tabs--top:not(.el-tabs--card) {
      .el-tabs__nav-wrap:after {
        height: 1px;
        background-color: #666666;
      }

      .el-tabs__nav {
        width: 100%;
      }

      .el-tabs__header .el-tabs__item {
        background-color: initial !important;
        text-align: center;
        color: #cccccc;
        &.is-active {
          color: #04a1ff;
          font-weight: bold;
        }
      }
    }
    .el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top:last-child {
      padding-right: 0 !important;
    }
    .el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top:nth-child(2) {
      padding-left: 0 !important;
    }
    .el-tabs__nav-scroll {
      padding-left: 0;
    }
    .form_component {
      height: calc(100% - 54px);
      overflow: hidden;
    }
    .footer {
      margin-top: 10px;
      text-align: center;
      .el-button {
        min-width: 100px;
      }
      .el-button + .el-button {
        margin-left: 40px;
      }
    }
    .empty-wrapper,
    .el-empty {
      height: 100%;
    }
  }
  .config-form {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-right: 20px;
    .form-title {
      position: relative;
      margin: 20px 0 20px 10px;
      font-size: 16px;
      font-weight: bold;
      &:before {
        content: '';
        width: 4px;
        height: 16px;
        position: absolute;
        left: -10px;
        top: 2.5px;
        bottom: 0;
        background-color: #00a1ff;
      }
    }
    .el-form {
      height: calc(100% - 50px);
      overflow-y: auto;
      overflow-x: hidden;
      .el-row {
        margin-right: 0 !important;
      }
    }
  }
  .el-input__inner,
  .el-textarea__inner {
    background: #08334d;
    border-radius: 4px;
    border: 1px solid #08334d;
  }
  .el-select {
    width: 100%;
  }
  .el-slider__bar {
    background: #4488be;
  }
  .el-slider__button {
    background: #4488be;
    border: none;
  }
  .el-slider__runway {
    background: #0a314f;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    background: #08334d;
  }
  .el-input-number__decrease {
    border-right: 1px solid #131720;
  }
  .el-input-number__increase {
    border-left: 1px solid #131720;
  }
  .el-radio.is-bordered.is-checked {
    border: 1px solid #409eff;
  }
  .el-radio.is-bordered {
    border: none;
  }
}
</style>
<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 20px !important;
}
</style>
