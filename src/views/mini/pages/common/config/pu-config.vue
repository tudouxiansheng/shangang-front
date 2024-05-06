<template>
  <!-- 前端参数配置 -->
  <div id="pu-config" :class="[$route.query.cameraId ? 'baseInfo' : '']">
    <el-menu
      ref="headermenu"
      :unique-opened="true"
      :default-active="activeIndex"
      @select="selectitem"
      @open="open"
      class="el-menu-vertical-demo menuScroll"
      :collapse="iscollapse"
      :style="{ width: locale == 'en' ? '22%' : '200px' }"
    >
      <el-sub-menu index="1" v-if="flag1">
        <template #title>
          <span style="color: #2d2d2d !important">
            {{ $t('frontParameterConfiguration.mainDevInfoConfig') }}
          </span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click="showFlag = 11" v-show="Permission_devInfo">
            {{ $t('frontParameterConfiguration.mainDevBasicInfo') }}
          </el-menu-item>
          <el-menu-item index="1-2" @click="showFlag = 12" v-show="Permission_devNetInfo">
            {{ $t('frontParameterConfiguration.NetInfoConfig') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2" v-if="showOthersMenu != 1">
        <template #title>
          <span style="color: #2d2d2d !important">
            {{ $t('frontParameterConfiguration.cameraBasicConfig') }}
          </span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1" @click="showFlag = 21" v-show="Permission_cameraInfo">
            {{ $t('frontParameterConfiguration.basicInfo') }}
          </el-menu-item>
          <el-menu-item index="2-2" @click="showFlag = 22" v-show="Permission_videoEncode">
            {{ $t('frontParameterConfiguration.cameraStreamConfig') }}
          </el-menu-item>
          <el-menu-item index="2-3" @click="showFlag = 23" v-show="Permission_imageInfo">
            {{ $t('frontParameterConfiguration.cameraDisplayConfig') }}
          </el-menu-item>
          <el-menu-item index="2-4" @click="showFlag = 24" v-show="Permission_cameraOsd">
            {{ $t('frontParameterConfiguration.cameraOSDConfig') }}
          </el-menu-item>
          <el-menu-item index="2-5" @click="showFlag = 25" v-show="Permission_cameraRecordPlan">
            {{ $t('frontParameterConfiguration.cameraVideoPolicyConfig') }}
          </el-menu-item>
          <el-menu-item index="2-6" @click="showFlag = 26" v-show="Permission_frontSnap">
            {{ $t('frontParameterConfiguration.cameraSnapConfig') }}
          </el-menu-item>
          <el-menu-item index="2-7" @click="showFlag = 27" v-show="Permission_cameraVmd">
            {{ $t('frontParameterConfiguration.cameraVmdConfig') }}
          </el-menu-item>
          <el-menu-item index="2-8" @click="showFlag = 28" v-show="Permission_occlusionAlarm">
            {{ $t('frontParameterConfiguration.cameraOcclusionConfig') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-menu-item
        index="3-1"
        @click="showFlag = 31"
        v-show="showOthersMenu != 1 && Permission_audioInfo"
        class="menuItem"
      >
        {{ $t('frontParameterConfiguration.cameraAudioConfig') }}
      </el-menu-item>

      <el-menu-item
        index="4-1"
        @click="showFlag = 41"
        v-show="showOthersMenu != 1 && Permission_serialInfo"
        class="menuItem"
      >
        {{ $t('frontParameterConfiguration.cameraSerialConfig') }}
      </el-menu-item>

      <el-menu-item
        index="5-1"
        @click="showFlag = 51"
        v-show="showOthersMenu != 1 && Permission_holderInfo"
        class="menuItem"
      >
        {{ $t('frontParameterConfiguration.cameraPTZConfig') }}
      </el-menu-item>

      <el-menu-item
        index="6-1"
        @click="showFlag = 61"
        v-show="showOthersMenu != 1 && Permission_webSystem"
        class="menuItem"
      >
        {{ $t('frontParameterConfiguration.frontSystemConfig') }}
      </el-menu-item>
    </el-menu>

    <div
      :style="[cuType == 4 ? '' : { marginTop: '40px' }, locale == 'en' ? { width: '78%' } : '']"
      class="baseMain"
    >
      <dev-info v-if="showFlag == 11" :baseInfoShow="baseInfoShow" />
      <dev-net-info v-if="showFlag == 12" :baseInfoShow="baseInfoShow" />

      <camera-info v-if="showFlag == 21" />
      <video-encode v-if="showFlag == 22" />

      <image-info v-if="showFlag == 23" />
      <camera-osd v-if="showFlag == 24" />
      <camera-record-plan v-if="showFlag == 25" />

      <camera-front-snap v-if="showFlag == 26" />
      <camera-vmd v-if="showFlag == 27" />
      <occlusion-alarm v-if="showFlag == 28" />
      <audio-info v-if="showFlag == 31" />

      <serial-info v-if="showFlag == 41" />
      <holder-info v-if="showFlag == 51" />
      <web-systemo v-if="showFlag == 61" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'

import devInfo from "./component/devInfo"; // 主设备基础信息
import devNetInfo from "./component/devNetInfo"; // 网络参数设置
import cameraInfo from "./component/cameraInfo"; // 摄像机基本信息
import imageInfo from "./component/imageInfo"; // 图像参数设置
import cameraFrontSnap from "./component/cameraFrontSnap";
import serialInfo from "./component/serialInfo"; // 串口参数设置
import holderInfo from "./component/holderInfo"; // 云台参数设置
import videoEncode from "./component/videoEncode"; // 视频编码设置
import cameraOsd from "./component/cameraOsd"; // OSD参数设置
import cameraVmd from "./component/cameraVmd"; // 移动侦测设置
import audioInfo from "./component/audioInfo"; // 音频参数设置
import occlusionAlarm from "./component/cameraOcclusionAlarm"
import cameraRecordPlan from "./component/cameraRecordPlan"
import webSystem from "./component/webSystem"; // 前端系统设置

export default {
  name: 'FrontEndParameterConfiguration',
  props: ['baseInfoShow', 'showOthersMenu'],
  components: {
    'dev-info': devInfo,
    'dev-net-info': devNetInfo,
    'camera-info': cameraInfo,
    'image-info': imageInfo,
    'camera-front-snap': cameraFrontSnap,
    'serial-info': serialInfo,
    'holder-info': holderInfo,
    'video-encode': videoEncode,
    'camera-osd': cameraOsd,
    'occlusion-alarm': occlusionAlarm,
    'camera-vmd': cameraVmd,
    'audio-info': audioInfo,
    'camera-record-plan': cameraRecordPlan,
    'web-systemo': webSystem
  },
  data() {
    return {
      //前端权限判断
      Permission_devInfo: true,
      Permission_devNetInfo: true,
      Permission_cameraInfo: true,
      Permission_imageInfo: true,
      Permission_frontSnap: true,
      Permission_serialInfo: true,
      Permission_holderInfo: true,
      Permission_videoEncode: true,
      Permission_cameraOsd: true,
      Permission_occlusionAlarm: true,
      Permission_cameraVmd: true,
      Permission_audioInfo: true,
      Permission_cameraRecordPlan: true,
      Permission_webSystem: true,
      cuType: sessionStorage.getItem('cuType'),
      locale: localStorage.getItem('locale'),
      //摄像机在线状态
      online: true,
      //协议类型
      devDrive: '',
      //主设备id
      devId: '',
      //菜单组件切换
      showFlag: 11,
      flag_devInfo: true,
      flag_devNetInfo: false,
      iscollapse: false,
      activeIndex: '1-1',
      openmenuidx: -1,

      //菜单动态显示
      flag1: true,
      flag1_1: false,
      flag1_2: false,
      flag2: false,
      flag3: false,
      flag4: false,
      flag5: false,
      flag6: false
    }
  },
  watch: {
    iscollapse(newval) {
      this.$emit('collapse', newval)
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    if (this.$route.query.cameraId) {
      this.$api.getCameraInfoQuery({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          this.devId = res.cameraInfo.mainDevId
          if (res.cameraInfo.status != 1) {
            this.online = false
          } else {
            this.online = true
          }
          //中兴平台设备判断
          this.$store.commit('config/set_frontPlatType', res.cameraInfo.platType)
          this.$store.commit('config/set_frontDrive', res.cameraInfo.drive)
        }
      })
    }

    //菜单动态显示
    let accessArray = JSON.parse(sessionStorage.getItem('accessCode'))
    if (accessArray) {
      for (let i = 0; i < accessArray.length; i++) {
        if (accessArray[i] == '101') {
          this.flag1 = true
          this.flag1_1 = true
          this.flag1_2 = true
        }
      }
    }
  },
  methods: {
    async getPermissions() {
      //前端权限判断
      this.Permission_devInfo = await permissions(161)
      this.Permission_devNetInfo = await permissions(163)
      this.Permission_cameraInfo = await permissions(165)
      this.Permission_imageInfo = await permissions(169)
      this.Permission_frontSnap = await permissions(191)
      this.Permission_serialInfo = await permissions(187)
      this.Permission_holderInfo = await permissions(189)
      this.Permission_videoEncode = await permissions(167)
      this.Permission_cameraOsd = await permissions(171)
      this.Permission_occlusionAlarm = await permissions(175)
      this.Permission_cameraVmd = await permissions(173)
      this.Permission_audioInfo = await permissions(185)
      this.Permission_cameraRecordPlan = await permissions(10)
      this.Permission_webSystem = await permissions(194)
    },

    goToDevInfo() {
      this.flag_devInfo = true
      this.flag_devNetInfo = false
    },
    goToDevNetInfo() {
      this.flag_devInfo = false
      this.flag_devNetInfo = true
    },
    open(index) {
      this.openmenuidx = index
    },
    selectitem(i) {
      if (!i.includes('-')) {
        this.$refs.headermenu.close(this.openmenuidx)
      }
    }
  }
}
</script>

<style lang="scss">
//web 客户端 兼容
#pu-config {
  background: #fff;
  color: #4d4d4d;
  height: calc(100% - 20px);
  width: calc(100% - 10px);
  padding: 10px 0 10px 10px;

  position: relative;
  display: flex;

  .el-menu {
    display: inline-block;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-menu,
  .menus {
    background: #f2f2f2 !important;
  }
  .el-submenu__title {
    background: #f2f2f2 !important;
  }
  .el-menu-item {
    background: #f2f2f2 !important;
    color: #666;
  }
  .el-menu-item.is-active {
    color: #fff !important;
    background: #4488be !important;
  }
  .menuScroll::-webkit-scrollbar {
    width: 5px !important;
    height: 10px !important;
    background-color: #262626;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .menuScroll::-webkit-scrollbar-track {
    background-color: #fff !important;
    height: 70% !important;
  }

  /*定义滑块 内阴影+圆角*/
  .menuScroll::-webkit-scrollbar-thumb {
    background-color: #d2d2d2 !important ;
  }

  .el-form-item__label {
    color: #4d4d4d;
  }
  .el-select {
    width: 100%;
  }
  .baseMain {
    width: calc(100% - 200px);
    display: inline-block;
    overflow-y: hidden;
    background: #fff;
    padding: 0 20px;
    position: relative;
  }
  .el-button--default {
    background: #fff;
    border-color: #bfbfbf;
    color: #666666;
  }
  .el-input__inner {
    background-color: #f2f2f2;
    border-color: #d2d2d2;
    color: #052a3f;
  }
  span.el-radio__label {
    color: #000;
  }
  span.el-checkbox__label {
    color: #000;
  }

  input[type='button'],
  input[type='submit'],
  input[type='search'],
  input[type='reset'] {
    -webkit-appearance: none;
  }

  .el-input__inner::placeholder {
    color: #999;
  }
  .el-input.is-disabled .el-input__inner {
    background: #bfbfbf !important;
    color: #737373 !important;
  }
  .el-input.is-disabled .el-input__inner::placeholder {
    color: #737373;
  }
  .menuItem {
    color: #303133 !important;
  }

  .flex-content .el-form-item__content {
    display: flex;
    .copyBtn {
      height: 34px;
      margin-left: 10px;
    }
  }

  .clientButton {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    margin: auto;
  }
  .button {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .cancelBtn {
    margin-left: 20px;
  }
}
.baseInfo {
  height: 100vh;
  .el-menu-vertical-demo {
    border-right: none;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-menu-vertical-demo .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: #182a46 !important;
  }

  .button {
    width: 100%;
    margin: 20px auto 5px;
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 10px;
    left: 105px;
  }
}
</style>
