<template>
  <div
    id="main-dev-front-params-config"
    v-if="isRouterAlive"
    ref="mainDevParamsConfig"
    v-loading="pageLoading"
    :element-loading-text="$t('public.loading')"
    
  >
    <el-page-header v-if="cuType !== '1'" @back="goBack" :content="mainDevName"></el-page-header>
    <div :class="['center_container', cuType === '1' && 'full_height']">
      <el-button
        v-has-permi="[194, 2006]"
        v-if="drive !== DRIVE_TYPE.T28181 || platType == PLATFORM_TYPE.ADS"
        style="position: absolute; right: 20px; top: 5px; z-index: 9"
        :loading="loadingRestart"
        @click="restartClick"
        class="miniBtn"
        type="primary"
      >
        {{ $t('mainDevConfiguration.restart') }}
      </el-button>
      <el-tabs v-model="activeMenuName">
        <el-tab-pane
          v-for="item in settingMenus"
          :key="item.value"
          :label="item.name"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="form_component">
        <system-params v-if="activeMenuName === 'system' && !pageLoading" />
        <video-channel v-if="activeMenuName === 'video' && !pageLoading" />
        <audio-channel v-if="activeMenuName === 'audio' && !pageLoading" />
        <serial-channel v-if="activeMenuName === 'serial' && !pageLoading" />
        <alarm-channel v-if="activeMenuName === 'alarm' && !pageLoading" />
        <ptz-config v-if="activeMenuName === 'ptz' && !pageLoading" />
      </div>
    </div>
    <el-dialog
      :title="$t('public.prompt')"
      draggable
      v-model="dialogVisible"
      width="300px"
      class="licenseDialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div style="display: flex">
        <img style="width: 18px; height: 18px" :src="img" />

        <div style="margin-left: 8px">{{ $t('mainDevConfiguration.restartingRestart') }}</div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="restartClick2">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import SystemParams from './component/system-params.vue'
import VideoChannel from './component/video-channel.vue'
import AudioChannel from './component/audio-channel.vue'
import SerialChannel from './component/serial-channel.vue'
import AlarmChannel from './component/alarm-channel.vue'
import PtzConfig from './component/ptz-config.vue' // 云台参数设置
import { mapState, mapGetters } from 'vuex'
import { getMainDevAvailableTabs } from '../utils'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'

export default {
  name: 'MainDeviceFrontEndParameterConfiguration',
  components: {
    SystemParams,
    VideoChannel,
    AudioChannel,
    SerialChannel,
    AlarmChannel,
    PtzConfig
  },
  data() {
    return {
      img: require('@/assets/img/common/xingzhuang.png'),
      dialogVisible: false,
      loadingRestart: false,
      cuType: sessionStorage.getItem('cuType'),
      isRouterAlive: true,
      pageLoading: false,
      settingMenus: [],
      activeMenuName: 'system',
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE
    }
  },
  computed: {
    ...mapState({
      mainDevId: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['platType', 'mainDevName', 'drive', 'mainDevType'])
  },
  async mounted() {
    if (this.cuType === '1') {
      document.querySelector('.pageRefresh').style.display = 'none'
    }
    this.setSettingMenus()
  },
  methods: {
    setSettingMenus() {
      this.settingMenus = getMainDevAvailableTabs(this.mainDevType, this.drive, this.platType)
    },
    //启动前端
    restartClick() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    restartClick2() {
      this.loadingRestart = true
      this.dialogVisible = false
      this.$api.getReset({ mainDevId: this.mainDevId }).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            message: this.$t('mainDevConfiguration.deviceSucceeded'),
            type: 'success'
          })
        }
        this.dialogVisible = false
        this.loadingRestart = false
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
#main-dev-front-params-config {
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  .el-textarea__inner:focus,.el-textarea__inner:hover,.el-textarea__inner{
    box-shadow: 0 0 0;
  }
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
      height: calc(100% - 150px);
      overflow-y: auto;
      .el-row {
        margin-right: 0 !important;
      }
    }
  }
  .form-title {
    color:#eee;
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
  .el-textarea__inner {
    color: #e6e6e6;
  }
}
</style>
<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 20px !important;
}
</style>
