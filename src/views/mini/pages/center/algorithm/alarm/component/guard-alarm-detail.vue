<template>
  <div>
    <el-dialog
      :title="$t('alarmList.alarmDetails')"
      v-model="dialogVisible"
      top="10vh"
      width="1200px"
      class="guardAlarmDetailDialog"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      @closed="dialogClosed"
      @open="dialogOpen"
    >
      <div class="mainBox">
        <div class="leftBox">
          <div class="imgBox">
            <el-image
              v-if="dialogVisible"
              ref="captureImage"
              style="height: 100%"
              :src="form.previewCaptureImage"
              :preview-src-list="[form.previewCaptureImage]"
              @load="onCaptureImageLoad"
            ></el-image>
            <div class="capture_image_box" :style="captureImageBoxStyle"></div>
          </div>
        </div>
        <div class="rightBox">
          <div class="rightImg">
            <div class="rightImgItem">
              <el-image
                fit="fill"
                style="height: 120px; width: 100%"
                :src="form.previewDetectImage"
                :preview-src-list="[form.previewDetectImage]"
              ></el-image>
              <p>{{ $t('metadata.snapImg') }}</p>
            </div>
            <div v-if="form.hited == 1" class="rightImgItem">
              <el-popover
                popper-class="hitInfo"
                placement="bottom"
                :width="locale == 'en' ? 250 : 210"
                trigger="hover"
              >
                <el-descriptions
                  v-if="form.hitType === '1'"
                  :column="1"
                  :labelStyle="{ 'flex-shrink': 0 }"
                >
                  <el-descriptions-item v-if="form.hited == 1" :label="$t('repo.guardObject')">
                    {{
                      `${
                        form.repositoryType === 2
                          ? this.$t('repo.blacklist')
                          : this.$t('repo.whitelist')
                      }-${form.repositoryName}`
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.fullName')">
                    {{ form.name }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.gender')">
                    {{
                      form.gender === 1
                        ? $t('repo.man')
                        : form.gender === 2
                        ? $t('repo.woman')
                        : $t('repo.unknown')
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.age')">
                    {{ form.age }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.IDType')">
                    {{
                      selectDictLabel(credentialTypeList, form.credentialType, {
                        key: 'name',
                        value: 'value'
                      })
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.IDNum')">
                    {{ form.credentialNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.remark')">
                    {{ form.remark }}
                  </el-descriptions-item>
                </el-descriptions>
                <el-descriptions v-else :column="1" :labelStyle="{ 'flex-shrink': 0 }">
                  <el-descriptions-item v-if="form.hited == 1" :label="$t('repo.guardObject')">
                    {{ `${this.$t('repo.blacklist')}-${form.repositoryName}` }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.license')">
                    {{ form.lpn }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.carOwnerName')">
                    {{ form.ownerName }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.brand')">
                    {{
                      selectDictLabel(vehicleBrandList, form.vehicleBrand, {
                        key: 'name',
                        value: 'value'
                      })
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.carType')">
                    {{
                      selectDictLabel(vehicleTypeList, form.vehicleType, {
                        key: 'name',
                        value: 'value'
                      })
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('repo.carColor')">
                    {{
                      selectDictLabel(vehicleColorList, form.vehicleColor, {
                        key: 'name',
                        value: 'value'
                      })
                    }}
                  </el-descriptions-item>
                </el-descriptions>
                <template #reference>
                  <el-image
                    fit="fill"
                    style="height: 120px; width: 100%"
                    :src="form.hitType === '1' ? form.previewFacePhoto : form.previewVehiclePhoto"
                    :preview-src-list="[
                      form.hitType === '1' ? form.previewFacePhoto : form.previewVehiclePhoto
                    ]"
                  ></el-image>
                </template>
              </el-popover>
              <p v-if="form.hited == 1">
                {{ form.repositoryName || $t('metadata.idPhoto') }}
              </p>
            </div>
            <div v-else class="rightImgItem">
              <el-image
                slot="reference"
                fit="fill"
                style="height: 120px; width: 100%"
                :src="form.hitType === '1' ? noHitImg.person : noHitImg.vehicle"
              ></el-image>
            </div>
          </div>
          <ul>
            <li v-if="form.hitType === '1'" class="content-item">
              <span class="content-item-left">{{ $t('metadata.similarity') }}：</span>
              <span class="content-item-right">
                {{ form.similarity }}{{ form.similarity != undefined ? '%' : '' }}
              </span>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('algoGuard.alarmLevel') }}：</span>
              <span class="content-item-right">
                <el-tag :style="$parent.styleObj(form.alarmLevel, 'background')" effect="dark">
                  {{
                    selectDictLabel($parent.alarmLevelList, form.alarmLevel, {
                      key: $parent.locale == 'en' ? 'alarmLevelEnName' : 'alarmLevelName',
                      value: 'alarmLevelId'
                    })
                  }}
                </el-tag>
              </span>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('alarmList.alarmContent') }}：</span>
              <span class="content-item-right">
                {{ form.guardName }}
                {{
                  form.hited == 1
                    ? $t('alarmList.hitType1')
                    : form.hited == 2
                    ? $t('alarmList.hitType2')
                    : ''
                }}
              </span>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('algoGuard.alarmTime') }}：</span>
              <span class="content-item-right">{{ form.hitTime }}</span>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('algoGuard.devName') }}：</span>
              <span class="content-item-right">{{ form.deviceName }}</span>
            </li>
            <li v-if="form.deviceId" class="content-item">
              <div style="display: flex">
                <span class="content-item-left">{{ $t('metadata.cameraID') }}：</span>
                <el-tooltip
                  effect="light"
                  :content="form.deviceId"
                  placement="top-start"
                  :disabled="form.deviceId == ''"
                >
                  <span class="content-item-right" style="display: inline-block; width: 72%">
                    {{ form.deviceId }}
                  </span>
                </el-tooltip>
              </div>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('algoGuard.alarmName') }}：</span>
              <span class="content-item-right">{{ form.alarmName }}</span>
            </li>
            <li v-if="form.algorithmName" class="content-item">
              <span class="content-item-left">{{ $t('metadata.algoName') }}：</span>
              <span class="content-item-right">{{ form.algorithmName }}</span>
            </li>

            <div class="ulListGuard">
              <li v-for="(item, index) in form.properties" :key="index" class="content-item">
                <span class="content-item-left">{{ item.name }}：</span>
                <span class="content-item-right">{{ setProperties(item) }}</span>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <ul class="camera-operator">
        <li v-if="cuType == 1" @click="goToRealtime">
          {{ $t('guradAlarm.realtime') }}
        </li>
        <li v-if="cuType == 1" @click="goToReplay">
          {{ $t('guradAlarm.replay') }}
        </li>
        <li v-if="cuType == 1 && gisType" @click="goToGis">
          {{ $t('guradAlarm.location') }}
        </li>
        <li v-if="cuType == 1 && form.hitType === '1'" @click="goToPersonApplication('1')">
          {{ $t('guradAlarm.personApplication') }}
        </li>
        <li v-if="cuType == 1 && form.hitType === '2'" @click="goToPersonApplication('2')">
          {{ $t('guradAlarm.vehicleApplication') }}
        </li>
        <li @click="goToRepository">
          {{ $t('guradAlarm.addToGurad') }}
        </li>
        <li v-if="cuType == 1">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ $t('guradAlarm.downImage') }}
              <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">{{ $t('guradAlarm.detectImage') }}</el-dropdown-item>
                <el-dropdown-item command="b">{{ $t('guradAlarm.alarmImage') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>
    </el-dialog>
    <RepositoryModal
      v-model:visible="repositoryModalVisible"
      :data-type="pageType"
      :image="imageForRepository"
      :preview-image="previewImageForRepository"
    />
    <select-image-map
      v-model:visible="imageMapDialogVisible"
      :data="currDeviceMapList"
      @submit="handleSelectMap"
    />
  </div>
</template>

<script>
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import routeJump from '@/mixin/route-jump.js' //路由跳转
import videoPlay from '@/utils/common/video-play.js'
const { goToRealtimePlay, goToRecordPlayback } = videoPlay()
import { mapActions, mapState } from 'vuex'
import RepositoryModal from './repositoryModal'
import { saveAs } from 'file-saver'
import { getBlobByGET } from '@/utils/common/download'
import SelectImageMap from '@views/common/alarm/list/component/selectImageMap'
import { sStorage } from '@/utils/common/store'
export default {
  components: {
    RepositoryModal,
    SelectImageMap,
    ElIconArrowDown
  },
  mixins: [routeJump],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      cuType: sessionStorage.getItem('cuType'),
      form: {
        captureImage: '',
        detectImage: '',
        deviceName: '',
        deviceId: '',
        algorithmName: '',
        taskName: '',
        hitTime: '',
        properties: [],
        metadata: []
      },
      captureImageBoxStyle: {},
      repositoryModalVisible: false,
      imageForRepository: '',
      previewImageForRepository: '',
      gisType: undefined,
      noHitImg: {
        person: require('@/assets/img/common/noHits_person.png'),
        vehicle: require('@/assets/img/common/noHits_vehicle.png')
      },
      currDeviceMapList: [],
      imageMapDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      credentialTypeList: state => state.dict['ars_credential_type'], //证件类型
      vehicleTypeList: state => state.dict['ars-vehicle-type'], //车辆类型
      vehicleColorList: state => state.dict['ars-vehicle-color'], //车辆颜色
      vehicleBrandList: state => state.dict['ars-vehicle-brand'] //车辆品牌
    }),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    pageType() {
      return this.form.hitType === '1' ? 0 : 1
    }
  },
  created() {
    this.get_gis_config()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    async get_gis_config(data = { enable: true }) {
      this.loading = true
      await this.$store.dispatch('mapConfig/get_gis_config_initial')
      const res = await this.$store.dispatch('mapConfig/get_gis_config', data)
      const { form } = res
      if (form) this.gisType = form.type
      this.loading = false
    },
    getDictionaryLists() {
      this.getSysDictData([
        'ars_credential_type',
        'ars-vehicle-type',
        'ars-vehicle-color',
        'ars-vehicle-brand'
      ]) //获取证件类型
    },
    // 获取命中目标详情
    async getHitTargetInfo() {
      let res
      if (this.form.hited == 1) {
        // 命中告警
        if (this.form.hitType === '1') {
          let _params = {
            personId: this.form.personId
          }
          // 人员
          res = await this.$api.getNewPersonInfo(_params)
        } else {
          // 车辆
          let _params = {
            vehicleId: this.form.vehicleId,
            netType: this.$getNetType()
          }
          res = await this.$api.getNewVehicleInfo(_params)
        }
        if (res.resultCode === 0) {
          this.form = Object.assign({}, this.form, res)
        }
      }
    },
    onCaptureImageLoad() {
      let captureImage = this.$refs.captureImage
      let { imageWidth, imageHeight } = captureImage
      let LeftTopX, LeftTopY, RightBtmX, RightBtmY
      if (this.form.hitType === '1') {
        LeftTopX = this.form.metadata.LeftTopX
        LeftTopY = this.form.metadata.LeftTopY
        RightBtmX = this.form.metadata.RightBtmX
        RightBtmY = this.form.metadata.RightBtmY
      } else {
        LeftTopX = this.form.metadata['metaData.pos.left']
        LeftTopY = this.form.metadata['metaData.pos.top']
        RightBtmX = this.form.metadata['metaData.pos.right']
        RightBtmY = this.form.metadata['metaData.pos.bottom']
      }
      let { clientWidth, clientHeight } = captureImage.$el
      if (
        LeftTopX !== undefined &&
        LeftTopY !== undefined &&
        RightBtmX !== undefined &&
        RightBtmY !== undefined
      ) {
        let widthRatio = imageWidth / clientWidth
        let heightRatio = imageHeight / clientHeight
        let left = LeftTopX / widthRatio
        let top = LeftTopY / heightRatio
        let width = (RightBtmX - LeftTopX) / widthRatio
        let height = (RightBtmY - LeftTopY) / heightRatio
        this.captureImageBoxStyle = {
          opacity: 1,
          left: left + 'px',
          top: top + 'px',
          width: width + 'px',
          height: height + 'px'
        }
      }
    },
    dialogOpen() {
      this.form = Object.assign({}, this.form, this.$parent.dataForm)
      let attr = []
      for (let i = 0; i < this.form.properties.length; i++) {
        for (let key in this.form.metadata) {
          if (this.form.properties[i].key == key) {
            attr.push(this.form.properties[i])
            break
          }
        }
      }
      this.form.properties = attr
      this.getDictionaryLists()
      this.getHitTargetInfo()
      this.$nextTick(() => {
        
      })
    },

    dialogClosed() {
      this.form = {
        captureImage: '',
        detectImage: '',
        deviceName: '',
        deviceId: '',
        algorithmName: '',
        taskName: '',
        hitTime: '',
        properties: [],
        metadata: []
      }
      this.dialogVisible = false
      this.$parent.dataForm = {}
      this.captureImageBoxStyle = {}
    },
    setProperties(item) {
      let name = ''
      if (item.type == 'int') {
        name = this.form.metadata[item.key]
      } else if (item.type == 'enum' || item.type == 'bool') {
        item.specs.forEach(item1 => {
          if (item1.value == this.form.metadata[item.key]) name = item1.name
        })
      }
      return name
    },
    // 实时浏览
    goToRealtime() {
      const { deviceId, deviceName } = this.form
      goToRealtimePlay(deviceId, deviceName)
    },
    // 录像回放
    goToReplay() {
      const { deviceId, deviceName, hitTime } = this.form
      let param = {
        cameraId: deviceId,
        cameraName: deviceName,
        alarmTime: hitTime
      }
      window.webkitProc('alarm-playback', JSON.stringify(param))
    },
    async getDevMapList(deviceId) {
      const res = await this.$api.getPictureDeviceList({
        deviceId
      })
      if (res.resultCode == 0) {
        this.currDeviceMapList = res.pictureDeviceMapList
      }
    },
    handleSelectMap(mapId) {
      let path = '/gis/index',
        routerPush = {
          name: 'gis',
          params: {
            type: 2,
            cameraId: this.form.deviceId,
            cameraName: this.form.deviceName,
            mapId: mapId
          }
        }
      this.routeJump(path, routerPush)
    },
    // 地图定位
    async goToGis() {
      if (!this.gisType) return
      if (this.gisType == 1 || this.gisType == 2) {
        const { deviceId, deviceName } = this.form
        const res = await this.$api.getCameraInfoQuery({ cameraId: deviceId })
        if (res.cameraInfo) {
          const { longitude, latitude } = res.cameraInfo
          if (longitude && latitude) {
            let path = '/gis/index',
              routerPush = {
                name: 'gis',
                params: {
                  cameraId: deviceId,
                  cameraName: deviceName
                }
              }
            this.routeJump(path, routerPush)
          } else {
            this.$message.warning(this.$t('guradAlarm.noLnglat'))
          }
        }
      } else if (this.gisType == 3) {
        const { deviceId } = this.form
        await this.getDevMapList(deviceId)
        if (this.currDeviceMapList.length == 0) {
          this.$message.warning(this.$t('gis.unassociatedMap'))
          return
        } else if (this.currDeviceMapList.length == 1) {
          this.handleSelectMap(this.currDeviceMapList[0].mapId)
        } else {
          this.imageMapDialogVisible = true
        }
      }
    },
    // 目标检索
    async goToPersonApplication(hitType) {
      if (hitType === '2' && this.locale == 'en') {
        if (!this.form.lpn) {
          this.$message.warning(this.$t('retrieval.noPlateNumber'))
          return
        }
        const routerPush = {
          name: 'VehicleApplication',
          params: {
            lpn: this.form.lpn,
            type: 1
          }
        }
        this.routeJump('/algorithm/application/vehicle', routerPush)
      } else {
        const { detectImage } = this.form
        const blob = await getBlobByGET(detectImage)
        const file = new File(
          [blob],
          `${new Date().getTime() + Math.round(Math.random() * 10)}.${blob.type.split('/')[1]}`,
          {
            type: blob.type
          }
        )
        let formData = new FormData()
        formData.append('file', file)
        formData.append(
          'api',
          hitType === '2'
            ? '/api/ars/intelligent-app/vehicle/searchByImage'
            : '/api/ars/intelligent-app/face/searchByImage'
        )
        formData.append('netType', this.$getNetType())

        const res = await this.$api.uploadFileTemporary(formData)
        if (res.resultCode === 0) {
          let path, routerPush
          if (hitType === '1') {
            path = '/algorithm/application/person'
            routerPush = {
              name: 'TargetApplication',
              params: {
                fileId: res.fileId,
                type: 1
              }
            }
          } else if (hitType === '2') {
            path = '/algorithm/application/vehicle'
            routerPush = {
              name: 'VehicleApplication',
              params: {
                fileId: res.fileId,
                type: 1
              }
            }
          }
          this.routeJump(path, routerPush)
        }
      }
    },
    // 添加至布控库
    goToRepository() {
      this.imageForRepository = this.form.detectImage
      if (this.cuType == 4) {
        this.previewImageForRepository = this.form.previewDetectImage
      }
      this.repositoryModalVisible = true
    },
    // 下载图片
    handleCommand(cmditem) {
      switch (cmditem) {
        case 'a':
          this.downloadImage(this.form.detectImage)
          break
        case 'b':
          this.downloadImage(this.form.captureImage)
          break
      }
    },
    async downloadImage(url) {
      const blob = await getBlobByGET(url)
      if (blob) {
        saveAs(
          blob,
          `${new Date().getTime() + Math.round(Math.random() * 10)}.${blob.type.split('/')[1]}`,
          blob.type
        )
      }
    }
  }
}
</script>

<style lang="scss">
.guardAlarmDetailDialog {
  .el-dialog__body {
    padding: 10px 20px 0px;

    .mainBox {
      max-height: 550px;
      display: flex;
      justify-content: space-around;

      .leftBox {
        width: 68%;

        .imgBox {
          height: 100%;
          margin-bottom: 10px;
          text-align: center;
          position: relative;

          .capture_image_box {
            position: absolute;
            border: 2px solid #ff5756;
            opacity: 0;
          }
        }
      }

      .rightBox {
        width: 30%;

        .rightImg {
          display: flex;
          justify-content: space-between;

          .rightImgItem {
            width: 48%;
          }

          p {
            margin: 0 0 20px 0;
            text-align: center;
          }
        }

        .content-item {
          line-height: 24px;
          font-size: 16px;

          .content-item-left {
            display: inline-block;
            max-width: 230px;
          }

          .content-item-right {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .ulListGuard {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 240px;
        }
      }
    }

    .camera-operator {
      display: flex;
      justify-content: flex-start;
      padding: 10px 20px;

      li {
        margin-right: 40px;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }
}

.hitInfo {
  .el-descriptions__body {
    background: #595959;
    color: #fff;
  }
  .el-descriptions__label,
  .el-descriptions__content {
    color: #fff !important;
  }
}
</style>
