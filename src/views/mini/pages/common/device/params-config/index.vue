<template>
  <div id="paramsConfig" class='base' style=margin-top:60px;>
    <template v-if="isMainDevPage">
      <template v-if="isRouterAlive && !loading">
        <VPaasMainDevParamsConfig
          v-if="platType === PLATFORM_TYPE.ADS || platType === PLATFORM_TYPE.VPAAS"
        />
        <MainDevParamsConfig v-else />
      </template>
    </template>
    <template v-else>
      <template v-if="isRouterAlive && !loading">
        <VPaasCameraParamsConfig
          v-if="platType === PLATFORM_TYPE.ADS || platType === PLATFORM_TYPE.VPAAS"
        />
        <CameraParamsConfig v-else />
      </template>
    </template>
  </div>
</template>
<script>
import MainDevParamsConfig from './common/main-dev'
import CameraParamsConfig from './common/camera'
import VPaasMainDevParamsConfig from './vpaas/main-dev'
import VPaasCameraParamsConfig from './vpaas/camera'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { permissions } from '@/utils/common/permissions'
export default {
  name: 'DeviceParamsConfig',
  components: {
    MainDevParamsConfig,
    CameraParamsConfig,
    VPaasMainDevParamsConfig,
    VPaasCameraParamsConfig
  },
  data() {
    return {
      PLATFORM_TYPE,
      isRouterAlive: true,
      platType: null,
      loading: true
    }
  },
  async created() {
    await this.initialFunction()
  },
  watch: {
    async $route(to, from) {
      if (
        ['CameraParameterConfiguration', 'MainDeviceFrontEndParameterConfiguration'].indexOf(
          to.name
        ) > -1
      ) {
        this.getPlatType()
        await this.initStoreData()
      }
    }
  },
  computed: {
    ...mapGetters('deviceConfig', ['platId']),
    isMainDevPage() {
      return this.$route.name === 'MainDeviceFrontEndParameterConfiguration'
    }
  },
  methods: {
    ...mapActions('deviceConfig', ['setMainDevInfo', 'setCameraInfo']),
    ...mapMutations('deviceConfig', {
      resetDeviceConfig: 'RESET_DEVICE_CONFIG',
      setMainDevId: 'SET_MAIN_DEV_ID',
      setCameraId: 'SET_CAMERA_ID'
    }),
    getPlatType() {
      const { params } = this.$route
      this.platType = this.getPlatTypeByCameraId(
        this.isMainDevPage ? params.mainDevId : params.cameraId
      )
    },
    /**
     * @desc 通过镜头id截取13、14位获取平台类型platType
     * @param {String} id
     * @return {Number} platType
     * */
    getPlatTypeByCameraId(id) {
      const platType = id.substring(12, 14)
      return parseInt(platType)
    },
    // 初始化vuex数据
    async initStoreData() {
      const { params } = this.$route
      try {
        this.loading = true
        this.resetDeviceConfig()
        if (this.isMainDevPage) {
          await this.setMainDevInfo(params.mainDevId)
        } else {
          await this.setCameraInfo(params.cameraId)
        }
      } finally {
        this.loading = false
      }
    },
    async getPermissions() {
      const PermissionMainDevManage = await permissions(18) // 主设备管理
      const PermissionCameraManage = await permissions(22) //镜头管理
      this.$store.commit('deviceConfig/SET_PERMISSION_MANAGE', {
        PermissionMainDevManage,
        PermissionCameraManage
      })
    },
    async initialFunction() {
      this.getPlatType()
      await this.getPermissions()
      await this.initStoreData()
    }
  }
}
</script>
<style lang="scss">
#paramsConfig {
  .bt-defult {
    background: #626262;
    border-color: #626262;
    color: #ffffff;
  }
  .el-input .el-input__wrapper {
    background: #08334d;
  }
  .el-dialog {
    .el-input .el-input__wrapper {
      background: none;
    }
    .el-input__inner {
      background: none;
      border: none;
    }
  }
  .recordPlanId .el-input__wrapper {
    background: #fff;
  }
  .recordPlanId .el-input__inner {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #fff;
  }
}
</style>
