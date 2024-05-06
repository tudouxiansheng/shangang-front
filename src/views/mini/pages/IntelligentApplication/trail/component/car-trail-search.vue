<template>
  <div class="condition-search">
    <el-form class="search-form" :model="queryForm">
      <el-form-item :label="$t('application.plateNum')">
        <el-input v-model="queryForm.prn" maxlength="20" :placeholder="$t('application.plateNum')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('public.period')">
        <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
          <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
          <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
          <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>
          <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('public.startTime')">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          :picker-options="pickerOptions"
          @change="handleChangeDate"
          :editable="false"
          v-model="queryForm.beginTime"
          type="datetime"
          :placeholder="$t('public.startTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('public.endTime')">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          @change="handleChangeDate"
          :editable="false"
          v-model="queryForm.endTime"
          type="datetime"
          :placeholder="$t('public.endTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('public.camera')">
        <el-radio-group v-model="queryForm.type">
          <el-radio :label="1">{{ $t('public.all') }}</el-radio>
          <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('public.camera')" v-if="queryForm.type == 2">
        <el-input :placeholder="placeholder" @click.native="handleClickCamera">
          <img slot="suffix" src="../../images/tree.png" class="tree-img" />
        </el-input>
      </el-form-item>
      <el-form-item v-if="false" :label="$t('public.quality')">
        <el-slider v-model="queryForm.picValue" show-input> </el-slider>
      </el-form-item>
      <el-form-item> </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" class="btnPrimary" @click="handleSearch">{{ $t('public.search') }}</el-button>
      <el-button type="default" class="btnPrimary btnReset" @click="handleReset">{{ $t('public.reset') }}</el-button>
    </div>
    <choseCamera
      v-if="choseCameraDialog"
      @close="handleCloseChoseCamera"
      :choseDeviceList="choseDeviceList"
    ></choseCamera>
    <timeline :visible="timelineVisible" :data="trackInfos" @close="handleCloseTrack"></timeline>
  </div>
</template>

<script>
import intelligentMixin from '../../mixin/intelligentMixin'
import choseCamera from '../../components/chose-camera'
import timeline from '../../../../../../components/timeline'
import { AllcamMap } from '../../../../../../utils/map/AllcamMap'
import { facesearchByImage, getVehicleRecognitionList, vehicleTrack } from '../../../../../../utils/api'
import { DateDiff } from '@/utils/mutil'
export default {
  name: 'condition-search',
  mixins: [intelligentMixin],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val.plateNumber) this.$set(this.queryForm, 'prn', val.plateNumber)
        if (val && val.extra && val.extra.lpn) this.$set(this.queryForm, 'prn', val.extra.lpn)
      },
      immediate: true,
    },
  },
  components: { choseCamera, timeline },
  data() {
    return {
      choseCameraDialog: false,
      timelineVisible: false,
      queryForm: {
        type: 1,
        prn: '',
      },
      placeholder: this.$t('public.selectCamera'),
    }
  },
  beforeDestroy() {
    this.$route.params = {}
  },
  created() {
    // if (this.$route.params && this.$route.params.plateNumber) {
    //   this.$set(this.queryForm, 'prn', this.$route.params.plateNumber)
    // }
  },
  mounted() {},
  methods: {
    handleChangeDate() {
      this.timeType = 4
    },
    // handleClearTrack() {
    // AllcamMap.map.TrackAnimal.removeAll()
    // this.trackInfos = []
    // if (AllcamMap.map && this.$store.state.carEventId) {
    //   AllcamMap.map.removeTrack(this.$store.state.carEventId)
    // }
    // if (this.track && this.polyline && this.map) {
    //   this.polyline.remove(this.map)
    //   this.track.remove(this.map)
    //   this.track.pauseMove()
    // }
    // for (let i = 0; i < this.marker.length; i++) {
    //   this.marker[i].remove()
    // }
    // },
    mockData() {
      const res = {
        resultList: [
          {
            cameraId: '00000023092605010301000000000056',
            cameraName: '北卡口入境摄像头出场-2号通道',
            longitude: '1670.37',
            latitude: '2684.38',
            captureTime: '2023-10-26 19:33:50',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231026/09908836/term20231026193352096ULUx8r3RwSV.jpg?encrypt=4eot1V6TJT0LVcdfxQkj1Q&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231026/09908836/term20231026193352100A8JVrMtU4ZA.jpg?encrypt=9FRUebK6wCgz7qF-Dv9htw&expires=1698320796',
            plateNumber: '云G53089',
            carColor: 9,
            onlyCode: 'LLRtQSqdIuAy',
          },
          {
            cameraId: '00000023092605010301000000000064',
            cameraName: '中方国门AI算法细节',
            longitude: '1673.94',
            latitude: '1831.25',
            captureTime: '2023-10-25 15:12:19',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151230694Jxkdo7TMwGe.jpg?encrypt=Q1Ua1y0SjTcE_gJ5s_vW2Q&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151230700shiVHmNQb17.jpg?encrypt=cC7_0y4ILKIhXEzKYpEHCg&expires=1698320796',
            plateNumber: '云G53089',
            plateColor: 2,
            carColor: 5,
            onlyCode: 'gfqR61y0b2pW',
          },
          {
            cameraId: '00000023092605010301000000000029',
            cameraName: '中方国门出境1',
            longitude: '2113.89',
            latitude: '2325',
            captureTime: '2023-10-25 15:11:22',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151123231heAMO9dC1SG.jpg?encrypt=jNFYMD-l5IhydY5qxy6sAA&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151123237PMmQKGARoZz.jpg?encrypt=MWn5lbg-PJ52FdmfXijAoQ&expires=1698320796',
            plateNumber: '云G53089',
            plateColor: 2,
            carColor: 5,
            onlyCode: 'L31HNWKlaoLV',
          },
          {
            cameraId: '00000023092605010301000000000069',
            cameraName: '大贸查验场（出口）出境摄像头出场1',
            longitude: '2296.31',
            latitude: '3221.88',
            captureTime: '2023-10-25 14:27:48',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025142749832uyvzPUzFacW.jpg?encrypt=V02agbA1QXdrg_ArQMJikw&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025142749839S7HEWNa3e8h.jpg?encrypt=s3MFgXgfZAMbshp16WcqHw&expires=1698320796',
            plateNumber: '云G53089',
            plateColor: 2,
            carColor: 5,
            onlyCode: 'JGtQWlK2FNJ7',
          },
          {
            cameraId: '00000023092605010301000000000056',
            cameraName: '北卡口入境摄像头出场-2号通道',
            longitude: '1405.68',
            latitude: '3153.13',
            captureTime: '2023-10-23 15:51:06',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231023/09908836/term20231023155107564gheV2yk6b8V.jpg?encrypt=eiuZLzh93y4iUZNK2r1OCQ&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231023/09908836/term20231023155107570oSfJCkjP4BQ.jpg?encrypt=rC41X8bBgDrDj20OLXoefA&expires=1698320796',
            plateNumber: '云G53089',
            carColor: 5,
            onlyCode: 'S4NuYFi6MJ5M',
          },
          {
            cameraId: '00000023092605010301000000000064',
            cameraName: '中方国门AI算法细节',
            longitude: '2729.1',
            latitude: '3621.88',
            captureTime: '2023-10-22 13:09:53',
            detectUrl:
              'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022131000838E5tZT5oMfBz.jpg?encrypt=f6ph6RFxJ2Oq2rIW1wBL3g&expires=1698320796',
            captureUrl:
              'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022131000845k74onKokpj9.jpg?encrypt=ek74geJk7TIrbj2C45VeeQ&expires=1698320796',
            plateNumber: '云G53089',
            plateColor: 2,
            carColor: 1,
            onlyCode: 'YbxI8kA9jmaC',
          },
        ],
        aggregationInfos: [
          {
            cameraIds: '00000023092605010301000000000019',
            results: [
              {
                cameraId: '00000023092605010301000000000019',
                cameraName: '大贸查验场（出口）出境摄像头出场2',
                longitude: '103.95037808212268',
                latitude: '22.52930819660643',
                captureTime: '2023-10-22 11:10:36',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022111038248nhbMKdZ8rBs.jpg?encrypt=VOt3gyBd5JXO0ZPM5ii6Sw&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022111038256JFcOHPZ5Aae.jpg?encrypt=5F2MivUP7Tvr8Xb5RodWjw&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: 'odNPzZDAfc8B',
              },
            ],
          },
          {
            cameraIds: '00000023092605010301000000000064',
            results: [
              {
                cameraId: '00000023092605010301000000000064',
                cameraName: '中方国门AI算法细节',
                longitude: '103.9412642232409',
                latitude: '22.52814156515113',
                captureTime: '2023-10-25 15:12:19',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151230694Jxkdo7TMwGe.jpg?encrypt=Q1Ua1y0SjTcE_gJ5s_vW2Q&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151230700shiVHmNQb17.jpg?encrypt=cC7_0y4ILKIhXEzKYpEHCg&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: 'gfqR61y0b2pW',
              },
              {
                cameraId: '00000023092605010301000000000064',
                cameraName: '中方国门AI算法细节',
                longitude: '103.9412642232409',
                latitude: '22.52814156515113',
                captureTime: '2023-10-22 13:09:53',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022131000838E5tZT5oMfBz.jpg?encrypt=f6ph6RFxJ2Oq2rIW1wBL3g&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022131000845k74onKokpj9.jpg?encrypt=ek74geJk7TIrbj2C45VeeQ&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 1,
                onlyCode: 'YbxI8kA9jmaC',
              },
              {
                cameraId: '00000023092605010301000000000064',
                cameraName: '中方国门AI算法细节',
                longitude: '103.9412642232409',
                latitude: '22.52814156515113',
                captureTime: '2023-10-20 12:36:07',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231020/09908836/term20231020123620217KJBRpwjpIj8.jpg?encrypt=2nIxoUUXF0ODTvAe-dF0ww&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231020/09908836/term20231020123620223vOYuFA5us7n.jpg?encrypt=oxoo0m2Vu2jMyPI0obS0pQ&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: 'QtSZul32OGhp',
              },
            ],
          },
          {
            cameraIds: '00000023092605010301000000000069',
            results: [
              {
                cameraId: '00000023092605010301000000000069',
                cameraName: '大贸查验场（出口）出境摄像头出场1',
                longitude: '103.9501555786536',
                latitude: '22.52933204464954',
                captureTime: '2023-10-25 14:27:48',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025142749832uyvzPUzFacW.jpg?encrypt=V02agbA1QXdrg_ArQMJikw&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025142749839S7HEWNa3e8h.jpg?encrypt=s3MFgXgfZAMbshp16WcqHw&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: 'JGtQWlK2FNJ7',
              },
            ],
          },
          {
            cameraIds: '00000023092605010301000000000056',
            results: [
              {
                cameraId: '00000023092605010301000000000056',
                cameraName: '北卡口入境摄像头出场-2号通道',
                longitude: '103.95080872670954',
                latitude: '22.53142244107072',
                captureTime: '2023-10-26 19:33:50',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231026/09908836/term20231026193352096ULUx8r3RwSV.jpg?encrypt=4eot1V6TJT0LVcdfxQkj1Q&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231026/09908836/term20231026193352100A8JVrMtU4ZA.jpg?encrypt=9FRUebK6wCgz7qF-Dv9htw&expires=1698320796',
                plateNumber: '云G53089',
                carColor: 9,
                onlyCode: 'LLRtQSqdIuAy',
              },
              {
                cameraId: '00000023092605010301000000000056',
                cameraName: '北卡口入境摄像头出场-2号通道',
                longitude: '103.95080872670954',
                latitude: '22.53142244107072',
                captureTime: '2023-10-23 15:51:06',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231023/09908836/term20231023155107564gheV2yk6b8V.jpg?encrypt=eiuZLzh93y4iUZNK2r1OCQ&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231023/09908836/term20231023155107570oSfJCkjP4BQ.jpg?encrypt=rC41X8bBgDrDj20OLXoefA&expires=1698320796',
                plateNumber: '云G53089',
                carColor: 5,
                onlyCode: 'S4NuYFi6MJ5M',
              },
            ],
          },
          {
            cameraIds: '00000023092605010301000000000029',
            results: [
              {
                cameraId: '00000023092605010301000000000029',
                cameraName: '中方国门出境1',
                longitude: '103.94126189614165',
                latitude: '22.52808177731936',
                captureTime: '2023-10-25 15:11:22',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151123231heAMO9dC1SG.jpg?encrypt=jNFYMD-l5IhydY5qxy6sAA&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231025/09908836/term20231025151123237PMmQKGARoZz.jpg?encrypt=MWn5lbg-PJ52FdmfXijAoQ&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: 'L31HNWKlaoLV',
              },
              {
                cameraId: '00000023092605010301000000000029',
                cameraName: '中方国门出境1',
                longitude: '103.94126189614165',
                latitude: '22.52808177731936',
                captureTime: '2023-10-22 13:08:40',
                detectUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022130841802dH8c8fbXuCt.jpg?encrypt=6WbhyeuhpqVXRIfxODicNg&expires=1698320796',
                captureUrl:
                  'http://192.168.53.210:10000/file/term/20231022/09908836/term20231022130841808r8RcUOCJ1iL.jpg?encrypt=lNdaoQ8LUJY5tluGc0pvFQ&expires=1698320796',
                plateNumber: '云G53089',
                plateColor: 2,
                carColor: 5,
                onlyCode: '0s2KpPxWtcIQ',
              },
            ],
          },
        ],
      }
      return res
    },
    handleOpenTrack(data) {
      // this.handleClearTrack()
      this.handleTrackOper('remove')
      let params = {
        ...data,
      }
      delete params.type
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (this.$store.state.personId) {
        if (AllcamMap.map) {
          AllcamMap.map.removeTrack(this.$store.state.personId)
        }
      }
      if (this.$store.state.carEventId) {
        if (AllcamMap.map) {
          AllcamMap.map.removeTrack(this.$store.state.carEventId)
        }
      }
      this.trackInfos = []
      this.aggregationInfos = []
      vehicleTrack(params)
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            console.log(res, 'res')
            // res = this.mockData()
            if (res.resultList && res.resultList.length) {
              let result = res.resultList
              let aggregationInfos = res.aggregationInfos
              this.$emit('open-track', result, aggregationInfos, 1)
            } else {
              this.$emit('open-track', [], [])
              this.$message.warning(this.$t('public.noData'))
            }
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    handleCloseTrack(flag = true) {
      this.timelineVisible = false
      this.trackInfos = []
      if (flag) {
        console.log(222222)
        this.$EventBus.$emit('track-back')
      }
    },
    handleCloseChoseCamera(cameraNum, cameraList) {
      // console.log(cameraNum, cameraList)
      this.cameraNum = cameraNum
      this.placeholder = this.$t('public.placeholder', { num: cameraNum })
      this.choseDeviceList = cameraList

      this.choseCameraDialog = false
    },
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.choseCameraDialog = true
    },
    handleSearch() {
      if (!this.queryForm.prn) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('application.plateNum')}`)
        return
      }
      if (!this.queryForm.beginTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (!this.queryForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (new Date(this.queryForm.endTime).getTime() > new Date().getTime()) {
        this.$message.warning(this.$t('public.endGtCur'))
        return
      }
      if (new Date(this.queryForm.beginTime).getTime() > new Date(this.queryForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      if (DateDiff(this.queryForm.beginTime, this.queryForm.endTime) > 6) {
        this.$message.warning(this.$t('public.gt7'))
        return
      }
      if (this.queryForm.type == 2) {
        this.queryForm.cameraList = this.choseDeviceList.map((item) => item.id)
        if (!this.queryForm.cameraList.length) {
          this.$message.warning(`${this.$t('public.please')}${this.$t('public.camera')}`)
          return
        }
      } else {
        this.queryForm.cameraList = []
      }

      this.handleOpenTrack(this.queryForm)
    },
    handleReset() {
      this.queryForm = {
        type: 1,
        prn: '',
        beginTime: '',
        endTime: '',
      }
      this.placeholder = this.$t('public.selectCamera')
      this.choseDeviceList = []
      this.cameraNum = 0
      this.timeType = 3
      this.handleChangeQuickDateTime()
      this.showResultDialog = false
      this.timelineVisible = false
      this.$emit('reset')
    },
    getPlayState(val) {
      this.$emit('setPlayState', val)
    },
  },
}
</script>

<style scoped lang="scss">
.condition-search {
  width: 100%;
  height: calc(100% - 50px);
  margin-top: 20px;
  .search-form {
    padding: 0 20px;
    box-sizing: border-box;
    height: calc(100% - 80px);
    overflow: auto;
  }
  .btn-group {
    display: flex;
    width: 300px;
    margin: 0 auto;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    .btn {
      flex: 1;
    }
    .checkleft {
      margin-right: 30px;
    }
    .btnPrimary {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      &.btnReset {
        color: #333;
        //background-color: #ccc;
      }
    }
  }
  .tree-img {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 5px;
    top: 6px;
  }
}
</style>
