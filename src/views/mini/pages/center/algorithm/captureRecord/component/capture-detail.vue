<template>
  <div>
    <el-dialog
      :title="$t('metadata.metadataInfo')"
      v-model="dialogVisible"
      top="10vh"
      width="1200px"
      class="faceDetailDialog"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      @open="dialogOpen"
    >
      <div class="mainBox">
        <div class="leftBox">
          <div class="imgBox">
            <el-image
              style="height: 100%"
              :src="form.picUrl"
              :preview-src-list="[form.picUrl]"
            ></el-image>
          </div>
        </div>
        <div class="rightBox">
          <div class="rightImgItem">
            <el-image
              fit="fill"
              style="height: 200px; width: 200px; margin-left: 80px"
              :src="form.thumPicUrl"
              :preview-src-list="[form.thumPicUrl]"
            ></el-image>
          </div>
          <ul style="max-height: 300px; overflow-y: auto">
            <li class="content-item">
              <span class="content-item-left">{{ $t('metadata.snapTime') }}：</span>
              <span class="content-item-right">
                {{ $parent.formatTime(form.recordTime) }}
              </span>
            </li>
            <li class="content-item">
              <span class="content-item-left">{{ $t('metadata.cameraName') }}：</span>
              <span class="content-item-right">
                {{ form.cameraName || $t('metadata.cameraNotExist') }}
              </span>
            </li>
            <li class="content-item" v-for="(item, index) in attributeList" :key="index">
              <span class="content-item-left">{{ item.title }}：</span>
              <span class="content-item-right">{{ item.value }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 操作按钮 -->
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
        <li
          v-if="cuType == 1 && repositoryType === RepositoryTypeEnum.person"
          :loading="uploadLoading"
          @click="goToPersonApplication('1')"
        >
          {{ $t('guradAlarm.personApplication') }}
        </li>
        <li
          v-if="cuType == 1 && repositoryType === RepositoryTypeEnum.vehicle"
          :loading="uploadLoading"
          @click="goToPersonApplication('2')"
        >
          {{ $t('guradAlarm.vehicleApplication') }}
        </li>
        <li @click="goToRepository">
          {{ $t('guradAlarm.addToGurad') }}
        </li>
        <li>
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
      :data-type="repositoryType === RepositoryTypeEnum.person ? 0 : 1"
      :image="imageForRepository"
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
import videoPlay from '@/utils/common/video-play.js'
const { goToRealtimePlay, goToRecordPlayback } = videoPlay()
import routeJump from '@/mixin/route-jump.js' //路由跳转import RepositoryItemForm from './repositoryModal/repository-item-form'
import RepositoryModal from './repositoryModal'
import { repositoryType as RepositoryTypeEnum } from './repositoryModal/constant'
import { AttributesDictMap, AttributesTitleMap } from '../constant'
import { mapActions, mapState } from 'vuex'
import { saveAs } from 'file-saver'
import { getBlobByGET } from '@/utils/common/download'
import SelectImageMap from '@views/common/alarm/list/component/selectImageMap'
export default {
  components: {
    RepositoryModal,
    SelectImageMap,
    ElIconArrowDown
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    repositoryType: {
      type: Number,
      default: RepositoryTypeEnum.vehicle
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [routeJump],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      cuType: sessionStorage.getItem('cuType'),
      RepositoryTypeEnum: RepositoryTypeEnum,
      attributeList: [],
      repositoryModalVisible: false,
      imageForRepository: '',
      uploadLoading: false,
      gisType: undefined,
      currDeviceMapList: [],
      imageMapDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      sexOption: state => state.dict['ars-retrieval-sex'],
      ageOption: state => state.dict['ars-retrieval-age'],
      existOption: state => state.dict['ars-retrieval-exist'],
      oTypeOption: state => state.dict['ars-retrieval-otype'],
      hairOption: state => state.dict['ars-retrieval-hair'],
      shapeOption: state => state.dict['ars-retrieval-shape'],
      upperStyleOption: state => state.dict['ars-retrieval-upperStyle'],
      colorOption: state => state.dict['ars-retrieval-color'],
      textureOption: state => state.dict['ars-retrieval-upperTexture'],
      lowerStyleOption: state => state.dict['ars-retrieval-lowerStyle'],
      headLightShapeOption: state => state.dict['ars-retrieval-headLightShape'],
      bicycleTricycleOption: state => state.dict['ars-retrieval-bicycleTricycle'],
      subBicycleTricycleOption: state => state.dict['ars-retrieval-subBicycleTricycle'],
      expressionOption: state => state.dict['ars-retrieval-expression'],
      viewOption: state => state.dict['ars-retrieval-view'],
      vcolorOption: state => state.dict['ars-retrieval-vcolor'],
      cartypeOption: state => state.dict['ars-retrieval-cartype'],
      specialVehicleTypeIdxOption: state => state.dict['ars-retrieval-specialVehicleType'],
      ptypeOption: state => state.dict['ars-retrieval-ptype'],
      pcolorOption: state => state.dict['ars-retrieval-pcolor'],
      direcOption: state => state.dict['ars-retrieval-direc'],
      vehicleExistOption: state => state.dict['ars-retrieval-vehicle-exist']
    }),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    this.getDictionary()
    this.get_gis_config()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    dialogOpen() {
      this.$nextTick(() => {
        
        this.attributeList = this.generateAttributeList()
      })
    },
    async get_gis_config(data = { enable: true }) {
      this.loading = true
      await this.$store.dispatch('mapConfig/get_gis_config_initial')
      const res = await this.$store.dispatch('mapConfig/get_gis_config', data)
      const { form } = res
      if (form) this.gisType = form.type
      this.loading = false
    },
    getDictionary() {
      this.getSysDictData([
        'ars-retrieval-sex',
        'ars-retrieval-age',
        'ars-retrieval-exist',
        'ars-retrieval-otype',
        'ars-retrieval-hair',
        'ars-retrieval-shape',
        'ars-retrieval-upperStyle',
        'ars-retrieval-color',
        'ars-retrieval-upperTexture',
        'ars-retrieval-lowerStyle',
        'ars-retrieval-headLightShape',
        'ars-retrieval-bicycleTricycle',
        'ars-retrieval-subBicycleTricycle',
        'ars-retrieval-expression',
        'ars-retrieval-view',
        'ars-retrieval-vcolor',
        'ars-retrieval-cartype',
        'ars-retrieval-specialVehicleType',
        'ars-retrieval-ptype',
        'ars-retrieval-pcolor',
        'ars-retrieval-vehicle-exist',
        'ars-retrieval-direc',
        'ars-retrieval-vehicle-exist'
      ])
    },
    generateAttributeList() {
      let attributeList = []
      for (let key in this.form) {
        if (!AttributesDictMap[key]) {
          continue
        }
        if (AttributesDictMap[key] === 'text') {
          attributeList.push({
            title: AttributesTitleMap[key],
            value: this.form[key]
          })
        } else {
          const dict = this[AttributesDictMap[key]]
          let value = ''
          if (Array.isArray(this.form[key])) {
            value = this.selectDictLabels(dict, this.form[key].join(','), ',', {
              key: 'name',
              value: 'value'
            })
          } else {
            value = this.selectDictLabel(dict, this.form[key], {
              key: 'name',
              value: 'value'
            })
          }
          const title = AttributesTitleMap[key]
          if (value && title) {
            attributeList.push({
              title,
              value
            })
          }
        }
      }
      return attributeList
    },
    // 实时浏览
    goToRealtime() {
      const { cameraId, cameraName } = this.form
      if (!cameraId) {
        this.$message.warning(this.$t('metadata.cameraNotExist'))
        return
      }
      goToRealtimePlay(cameraId, cameraName)
    },
    // 录像回放
    goToReplay() {
      const { cameraId, cameraName, recordTime } = this.form
      if (!cameraId) {
        this.$message.warning(this.$t('metadata.cameraNotExist'))
        return
      }
      let param = {
        cameraId,
        cameraName,
        alarmTime: this.$parent.formatTime(recordTime)
      }
      window.webkitProc('alarm-playback', JSON.stringify(param))
    },
    // 添加至布控库
    goToRepository() {
      this.imageForRepository = this.form.thumPicUrl
      this.repositoryModalVisible = true
    },
    // 目标检索
    async goToPersonApplication(hitType) {
      if (hitType === '2' && this.locale == 'en') {
        if (!this.form?.lprInfo?.plateNumber) {
          this.$message.warning(this.$t('retrieval.noPlateNumber'))
          return
        }
        const routerPush = {
          name: 'VehicleApplication',
          params: {
            lpn: this.form.lprInfo.plateNumber,
            type: 1
          }
        }
        this.routeJump('/algorithm/application/vehicle', routerPush)
      } else {
        const { thumPicUrl } = this.form
        try {
          this.uploadLoading = true
          const blob = await getBlobByGET(thumPicUrl)
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
        } finally {
          this.uploadLoading = false
        }
      }
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
            cameraId: this.form.cameraId,
            cameraName: this.form.cameraName,
            mapId: mapId
          }
        }
      this.routeJump(path, routerPush)
    },
    // 地图定位
    async goToGis() {
      if (!this.gisType) return
      if (this.gisType == 1 || this.gisType == 2) {
        const { cameraId, cameraName } = this.form
        if (!cameraId) {
          this.$message.warning(this.$t('metadata.cameraNotExist'))
          return
        }
        const res = await this.$api.getCameraInfoQuery({ cameraId: cameraId })
        if (res.cameraInfo) {
          const { longitude, latitude } = res.cameraInfo
          if (longitude && latitude) {
            let path = '/gis/index',
              routerPush = {
                name: 'gis',
                params: {
                  cameraId: cameraId,
                  cameraName: cameraName
                }
              }
            this.routeJump(path, routerPush)
          } else {
            this.$message.warning(this.$t('guradAlarm.noLnglat'))
          }
        }
      } else {
        const { cameraId } = this.form
        await this.getDevMapList(cameraId)
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
    // 下载图片
    handleCommand(cmditem) {
      switch (cmditem) {
        case 'a':
          this.downloadImage(this.form.picUrl)
          break
        case 'b':
          this.downloadImage(this.form.thumPicUrl)
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
.faceDetailDialog {
  .el-dialog__body {
    padding: 10px 20px 20px !important;
    overflow-y: hidden;

    .imgBox {
      height: 100%;
      margin-bottom: 10px;
      text-align: center;
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
  }

  .mainBox {
    height: auto;
    display: flex;
    justify-content: space-around;
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

  .leftBox {
    width: 68%;
  }

  .rightBox {
    width: 30%;
  }

  .ulListGuard {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 352px;
  }

  .ulListDev {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 323px;
  }

  .ulListTask {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 277px;
  }
}
</style>
