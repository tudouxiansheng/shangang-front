<template>
  <div id="new-alarm" v-if="isRouterAlive" ref="newAlarmList">
    <el-row>
      <el-col :span="24" class="el-row24">
        <!-- 搜索条件 -->
        <div class="search-form">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <!-- 告警类型 -->
                  <el-form-item :label="$t('public.alarmType') + ' ：'" prop="alarmType">
                    <el-cascader
                      :options="options"
                      :props="{ expandTrigger: 'hover' }"
                      clearable
                      :show-all-levels="false"
                      v-model="searchAlarmInfo.alarmType"
                      :popper-append-to-body="false"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <!-- 告警级别 -->
                  <el-form-item :label="$t('newAlarm.alarmLevel') + ' ：'" prop="alarmLevel">
                    <el-select
                      v-model="searchAlarmInfo.alarmLevel"
                      :placeholder="$t('newAlarm.pleaseSelect')"
                      clearable
                    >
                      <el-option :label="$t('newAlarm.all')" value="" />
                      <el-option
                        v-for="item in alarmLevelList"
                        :key="item.alarmLevelId"
                        :label="locale == 'en' ? item.alarmLevelEnName : item.alarmLevelName"
                        :value="item.alarmLevelId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <!-- 告警状态 -->
                  <el-form-item :label="$t('newAlarm.checkState') + '：'" prop="checkState">
                    <el-radio-group v-model="searchAlarmInfo.checkState">
                      <el-radio label="">{{ $t('public.all') }}</el-radio>
                      <el-radio label="0" text-color="#333">
                        {{ $t('alarmList.notChecked') }}
                      </el-radio>
                      <el-radio label="1" text-color="#333">
                        {{ $t('alarmList.falseDetection') }}
                      </el-radio>
                      <el-radio label="2" text-color="#333">
                        {{ $t('alarmList.correctCheck') }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
              <div class="search-btn">
                <el-button type="primary" class="miniBtn" @click="handleFind">
                  {{ $t('public.search') }}
                </el-button>
                <el-button type="info" class="miniBtn" @click="handleRest">
                  {{ $t('newAlarm.rest') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="alarmTitle" v-if="!loading && alarmLists.length">
          <div>
            {{ alarmLists.length > 100 ? '100+' : alarmLists.length }}{{ $t('newAlarm.alarmSum') }}
          </div>
          <div style="cursor: pointer" @click="pageRefresh">
            <el-icon><el-icon-refresh /></el-icon>
            <span>{{ refershFlag ? $t('newAlarm.stopRefresh') : $t('newAlarm.refresh') }}</span>
          </div>
        </div>
        <!-- 暂无数据 -->
        <no-table :tableLoading="loading" :tableData="alarmLists">
          <div v-if="!loading && alarmLists.length" class="snapBox">
            <el-row>
              <el-col :span="24">
                <div class="MainCenter">
                  <div class="centerTop" v-for="(item, index) in alarmLists" :key="index">
                    <div class="MainCenter-top">
                      <img
                        v-if="item.snapUrlType == 2 || item.snapUrlType == 0"
                        class="imgCor"
                        :src="item.alarmSnapUrl"
                        ref="smallBoxs"
                        alt
                        style="width: 100%; height: 100%; border-radius: 4px"
                        @dblclick="biggerImage(item, true)"
                        @click="handleInfo(item)"
                      />
                      <video
                        v-if="item.snapUrlType == 1"
                        ref="videosmallBox1"
                        class="imgCor"
                        :class="[videoDbShow ? 'video-showbig' : '']"
                        style="height: auto; width: 100%; height: 100%"
                        :src="item.alarmSnapUrl"
                        :controls="true"
                        controlslist="nodownload"
                        @dblclick.prevent="biggerVideo"
                      >
                        {{ $t('alarmList.notSupportH5video') }}
                      </video>
                    </div>
                    <div class="MainCenter-center">
                      <span :title="item.alarmTypeName">
                        <svg-icon icon-class="alarm-warn" style="display: inline-block"></svg-icon>
                        {{ item.alarmTypeName }}
                      </span>
                      <span class="bgColor" :style="styleObj(item.alarmLevel, 'background')">
                        {{
                          selectDictLabel(alarmLevelList, item.alarmLevel, {
                            key: locale == 'en' ? 'alarmLevelEnName' : 'alarmLevelName',
                            value: 'alarmLevelId'
                          })
                        }}
                      </span>
                    </div>
                    <div class="MainCenter-center">
                      <span :title="item.groupName">
                        {{ item.groupName }}
                      </span>
                      <span :title="item.alarmTime">{{ item.alarmTime }}</span>
                    </div>
                    <div class="MainCenter-center">
                      <span class="alarmDevName-title" :title="item.alarmDevName">
                        {{ item.alarmDevName }}
                      </span>
                      <span style="text-align: end" v-show="!item.confirmDesc">
                        <div @click="handleAlarm('delete', item)" class="delete-buttom">
                          <svg-icon
                            icon-class="alarm-close"
                            style="display: inline-block"
                          ></svg-icon>
                          {{ $t('newAlarm.delete') }}
                        </div>
                        <div @click="handleAlarm('dispose', item)" class="dispose-buttom">
                          <svg-icon
                            icon-class="alarm-confirm"
                            style="display: inline-block"
                          ></svg-icon>
                          {{ $t('newAlarm.dispose') }}
                        </div>
                      </span>
                      <span
                        v-show="item.confirmDesc"
                        class="content-info"
                        :title="item.confirmDesc"
                      >
                        {{ item.confirmDesc }}
                      </span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </no-table>
      </el-col>
    </el-row>

    <div v-show="ifshowImg" ref="bigImg" class="bigimg" @mousewheel="wheelFun">
      <img :src="bigInfo.alarmSnapUrl" alt style="width: 100%; height: 100%" />
      <div class="nunu" v-show="bigInfoShow">
        <span>{{ $t('alarmList.alarmTime') }}：{{ bigInfo.alarmTime }}</span>
        <span>{{ $t('alarmList.alarmDeviceName') }}：{{ bigInfo.alarmDevName }}</span>
        <span>{{ $t('public.alarmType') }}：{{ bigInfo.alarmTypeName }}</span>
      </div>
    </div>
    <div class="mask" v-show="ifshowImg" @click="maskClick">
      <el-icon><el-icon-close /></el-icon>
    </div>

    <div id="rvc" v-show="videoShow">
      <!-- 视频 -->
      <div id="video" class="videoBox"></div>

      <div class="close" @click="closeRVC">
        <el-icon class="closeRVC"><el-icon-close /></el-icon>
      </div>
    </div>

    <div class="mask" v-show="videoDbShow" @click="videoDbShow = false">
      <el-icon><el-icon-close /></el-icon>
    </div>

    <handle-alarm
      v-model:createVisible="createVisible"
      :handleAlarmInfoObj="handleAlarmInfoObj"
      :data="currentRowData"
      @content="contentText"
    />

    <guard-alarm-detail v-model:visible="detailDialogVisible" />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Refresh as ElIconRefresh, Close as ElIconClose } from '@element-plus/icons-vue'
import handleAlarm from '../list/component/handleAlarm'
import GuardAlarmDetail from '@/views/center/algorithm/alarm/component/guard-alarm-detail'
import { handleGetPreview } from '@/utils/common/preViewImg'
export default {
  components: {
    'handle-alarm': handleAlarm,
    GuardAlarmDetail,
    ElIconRefresh,
    ElIconClose
  },
  name: 'LatestAlarm',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      locale: localStorage.getItem('locale'),

      loading: false,
      tableData: [],

      searchAlarmInfo: {
        alarmType: [],
        alarmLevel: '',
        checkState: ''
      },
      rules: {},
      // 告警类型
      options: [],
      // 报警数据列表
      alarmLists: [],
      currentRowData: {},

      // 放大图片
      ifshowImg: false,
      bigInfoShow: false,
      bigInfo: {
        alarmSnapUrl: '',
        alarmTime: '',
        alarmTypeName: '',
        alarmDevName: ''
      },

      //播放判断
      cuType: sessionStorage.getItem('cuType'),
      videoShow: false,
      player: null,
      ifDownLoad: false,
      videoDbShow: false,

      createVisible: false,
      handleAlarmInfoObj: {
        title: '',
        index: ''
      },

      alarmGroupsList: null,

      refershFlag: true,

      url: require('@/assets/img/common/background.png'),

      //告警级别列表
      alarmLevelList: [],
      detailDialogVisible: false,
      dataForm: {},
      infoLoading: false
    }
  },
  created() {
    this.getGroups()
    this.getAlarmLevel()
  },
  mounted() {
    this.bindEvent()
  },
  beforeDestroy() {
    this.unBindEvent()
  },
  mounted() {},
  activated() {},
  methods: {
    styleObj(alarmLevelId, property) {
      let currLevel = this.alarmLevelList.find(item => item.alarmLevelId === alarmLevelId)
      if (property === 'background') {
        return {
          background: currLevel?.color || 'initial',
          borderColor: currLevel?.color || 'initial'
        }
      } else {
        return {
          color: currLevel?.color || 'initial'
        }
      }
    },
    bindEvent() {
      this.$bus.$off('webkit_notify')
      this.$bus.$on('webkit_notify', this.handlePcNotify)
    },
    unBindEvent() {
      this.$bus.$off('webkit_notify')
    },
    handlePcNotify(e) {
      let { func, message } = e
      if (func != 'AlarmPush') return
      if (this.loading === true) return
      if (this.refershFlag) {
        const res = JSON.parse(message)
        const { alarmType, alarmLevel, checkState } = this.searchAlarmInfo
        let alarmGroupFlag = true
        if (alarmType[0]) {
          alarmGroupFlag = alarmType[0] === res.alarmGroup
        }
        let alarmTypeFlag = true
        if (alarmType[1]) {
          alarmTypeFlag = alarmType[1] === res.alarmType
        }
        const alarmLevelFlag = alarmLevel !== '' ? alarmLevel == res.alarmLevel : true
        const checkStateFlag = checkState !== '' ? checkState == res.checkState : true
        if (alarmGroupFlag && alarmTypeFlag && alarmLevelFlag && checkStateFlag) {
          if (this.alarmLists.length === 100) {
            this.alarmLists.pop()
          }
          this.alarmLists.unshift({
            alarmDevId: res.deviceId,
            alarmDevName: res.alarmDevName,
            alarmGroup: res.alarmGroup,
            alarmId: res.alarmId,
            alarmLevel: res.alarmLevel,
            alarmLevelColor: res.alarmLevelColor,
            alarmState: res.alarmState,
            alarmTime: res.alarmTime,
            alarmType: res.alarmType,
            alarmTypeName: res.alarmTypeName,
            checkState: res.checkState,
            confirmState: res.confirmState,
            alarmSnapUrl: res.alarmSnapUrl,
            snapUrlType: 0
          })

          for (let i = 0; i < this.alarmGroupsList.length; i++) {
            if (this.alarmLists[0].alarmGroup == this.alarmGroupsList[i].groupCode) {
              this.alarmLists[0].groupName =
                this.locale == 'en'
                  ? this.alarmGroupsList[i].groupEnName
                  : this.alarmGroupsList[i].groupName
              break
            }
          }
        }
      }
    },
    //告警级别接口
    getAlarmLevel() {
      // 请求

      this.$api.getAlarmLevelList().then(res => {
        if (res && res.alarmLevelList) {
          this.alarmLevelList = res.alarmLevelList
        }
      })
    },

    pageRefresh() {
      this.refershFlag = !this.refershFlag
    },
    // 下载图片
    downImg(url) {
      // 如果没有图片,就让其return掉
      if (!url || url.indexOf('http') == -1) {
        this.ifDownLoad = true
        return
      }
      // 否则就进行下载操作
      let obj = { url, functionId: 'snap_download_req' }
      window.webkitProc('snap_download_req', JSON.stringify(obj))
    },
    contentText(obj) {
      let { confirmDesc, alarmId } = obj
      this.alarmLists.forEach((item, index) => {
        if (item.alarmId == alarmId) {
          this.alarmLists[index].confirmDesc = confirmDesc
        }
      })
    },
    // 告警正误检(清除/确认处理意见)
    handleAlarm(value, data) {
      if (data) {
        this.currentRowData = data
      }
      if (value === 'delete') {
        this.handleAlarmInfoObj.title = this.$t('newAlarm.deleteAdvise')
        this.handleAlarmInfoObj.index = 'delete'
      } else {
        this.handleAlarmInfoObj.title = this.$t('newAlarm.disposeAdvise')
        this.handleAlarmInfoObj.index = 'dispose'
      }
      this.createVisible = true
    },
    // 告警类型获取
    async getGroups() {
      await this.$api.getGroupsQuery({}).then(res => {
        if (res && res.alarmGroups) {
          this.alarmGroupsList = res.alarmGroups
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            options.push({
              value: res.alarmGroups[i].groupCode,
              label:
                this.locale == 'en' ? res.alarmGroups[i].groupEnName : res.alarmGroups[i].groupName,
              children: []
            })
          }
          const requests = options.map(option => {
            return this.$api.getAlarmTypesQuery({
              alarmGroup: option.value,
              canQuery: 1
            })
          })
          Promise.all(requests).then(responses => {
            responses.forEach((res, i) => {
              for (let j = 0; j < res.alarmTypeList.length; j++) {
                options[i].children.push({
                  value: res.alarmTypeList[j].alarmType,
                  label: res.alarmTypeList[j].alarmName
                })
              }
              options[i].children.unshift({
                value: '',
                label: options[i].label
              })
            })
            this.options = options // 更新 options
          })

          this.searchAlarmInfo.alarmType = [this.options[0].value, '']
          this.getAlarmList()
        }
      })
    },
    //获取告警列表
    async getAlarmList() {
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: 1,
          pageSize: 100 //默认查询100条数据
        },
        searchInfo: {
          beginTime: this.dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.dayjs(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
          alarmGroupType: this.searchAlarmInfo.alarmType[0],
          checkState: this.searchAlarmInfo.checkState,
          alarmLevel: this.searchAlarmInfo.alarmLevel
        }
      }
      obj.searchInfo.groupId = ''
      if (this.searchAlarmInfo.alarmType[1]) {
        obj.searchInfo.typeList = []
        obj.searchInfo.typeList.push(this.searchAlarmInfo.alarmType[1])
      }
      const lists = await this.$api.getAlarmList(obj)
      if (lists.resultCode != 0) {
        this.loading = false
      }

      if (lists.alarmList.length) {
        for (let item of lists.alarmList) {
          for (let i = 0; i < this.alarmGroupsList.length; i++) {
            if (item.alarmGroup == this.alarmGroupsList[i].groupCode) {
              item.groupName =
                this.locale == 'en'
                  ? this.alarmGroupsList[i].groupEnName
                  : this.alarmGroupsList[i].groupName
              break
            }
          }
          let data = {
            alarmId: item.alarmId,
            alarmTime: item.alarmTime
          }
          item.alarmSnapUrl = this.url
          this.getAlarmSnap(data, item)
        }
      }
      this.alarmLists = lists.alarmList
      this.loading = false
    },
    async getAlarmSnap(data, item) {
      await this.$api
        .getAlarmSnap(data)
        .then(res => {
          if (res.snapUrl) {
            item.alarmSnapUrl = res.snapUrl
          }
          item.snapUrlType = res.snapUrlType

          if (!item.alarmSnapUrl || item.alarmSnapUrl.indexOf('http') == -1) {
            this.ifDownLoad = true
            return
          }
        })
        .catch(err => {
          item.snapUrlType = 0
          item.alarmSnapUrl = this.url
        })
    },
    //搜索
    handleFind() {
      this.pageNum = 1
      this.getAlarmList()
    },
    //重置
    handleRest() {
      this.searchAlarmInfo = {
        alarmType: [],
        alarmLevel: '',
        checkState: ''
      }
      this.getAlarmList()
    },
    //关闭播放
    closeRVC() {
      this.videoShow = false
      this.player = null
    },
    //放大
    biggerVideo() {
      this.videoDbShow = true
    },
    // 放大图片
    biggerImage(item, flag) {
      if (flag) {
        this.bigInfo.alarmTime = item.alarmTime
        this.bigInfo.alarmTypeName = item.alarmTypeName
        this.bigInfo.alarmDevName = item.alarmDevName

        this.$refs.bigImg.style.width = this.$refs.smallBoxs[0].offsetWidth * 4 + 'px'
        this.$refs.bigImg.style.height = this.$refs.smallBoxs[0].offsetHeight * 3.5 + 'px'
      } else {
        this.$refs.bigImg.style.width = this.$refs.smallBox.offsetWidth * 1.5 + 'px'
        this.$refs.bigImg.style.height = this.$refs.smallBox.offsetHeight * 1.5 + 'px'
      }
      this.bigInfo.alarmSnapUrl = item.alarmSnapUrl

      this.bigInfoShow = flag
      this.ifshowImg = true
    },
    maskClick() {
      this.ifshowImg = false
    },
    // 滚轮放大缩小图片
    wheelFun(e) {
      let ev = e || window.event
      let dir = ev.wheelDelta || ev.detail
      if (ev.preventDefault) {
        ev.preventDefault()
      } else {
        ev.returnValue = false
      }
      if (dir == -3 || dir == 120) {
        let maxWidth = document.getElementsByTagName('body')[0].offsetWidth
        let maxHeight = document.getElementsByTagName('body')[0].offsetHeight
        if (this.$refs.bigImg.offsetWidth > maxWidth - 20) {
          return
        }
        if (this.$refs.bigImg.offsetHeight > maxHeight - 50) {
          return
        }
        this.$refs.bigImg.style.width = this.$refs.bigImg.offsetWidth * 1.03 + 'px'
        this.$refs.bigImg.style.height = this.$refs.bigImg.offsetHeight * 1.03 + 'px'
      } else {
        //向下
        if (this.$refs.bigImg.offsetWidth < 500) {
          return
        }
        if (this.$refs.bigImg.offsetHeight < 500) {
          return
        }
        this.$refs.bigImg.style.width = this.$refs.bigImg.offsetWidth / 1.03 + 'px'
        this.$refs.bigImg.style.height = this.$refs.bigImg.offsetHeight / 1.03 + 'px'
      }
    },
    async handleInfo(item) {
      if (item.alarmGroup !== 2 || this.infoLoading) {
        return
      }
      try {
        this.infoLoading = true
        const res = await this.$api.getGuardHitInfo({
          alarmId: item.alarmId,
          netType: this.$getNetType()
        })
        if (res.resultCode == 0) {
          this.dataForm = {
            ...res.guardHitInfo,
            ...{
              previewCaptureImage: handleGetPreview(res.guardHitInfo.captureImage),
              previewDetectImage: handleGetPreview(res.guardHitInfo.detectImage),
              previewVehiclePhoto: handleGetPreview(res.guardHitInfo.vehiclePhoto),
              previewFacePhoto: handleGetPreview(res.guardHitInfo.facePhoto)
            }
          }
          this.detailDialogVisible = true
        }
      } finally {
        this.infoLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
#new-alarm {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  .el-row24 {
    padding: 0 30px;
  }

  .search-btn {
    position: absolute;
    top: 0;
    text-align: right;
  }
  .search-form .el-select {
  }

  .el-form--inline .el-form-item {
    margin-right: 0px;
  }
  .search-form .el-form-item--small.el-form-item {
    margin-bottom: 18px;
  }

  .snapBox {
    width: 100%;
    position: relative;
  }
  .alarmTitle {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .MainCenter {
    width: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-wrap: wrap;
    .bgColor {
      //width: 56px;
      padding: 0 5px;
      min-width: 85px;
      height: 22px;
      background: rgba(255, 203, 161, 0.2);
      border-radius: 2px;
      text-align: center;
      line-height: 22px;
    }
    .danger {
      color: #ff344d;
    }
    .warning {
      color: #ff9744;
    }
    .success {
      color: #fec842;
    }
    .dispose-buttom,
    .delete-buttom {
      display: inline-block;
      //width: 64px;
      padding: 0 5px;
      height: 26px;
      border-radius: 2px;
      text-align: center;
      line-height: 26px;
      cursor: pointer;
    }
    .dispose-buttom {
      margin-left: 0.6em;
      background-color: hsla(207, 100%, 52%, 1);
      &:hover {
        background-color: hsla(207, 100%, 52%, 0.8);
      }
    }
    .delete-buttom {
      background-color: hsla(18, 73%, 56%, 1);
      &:hover {
        background-color: hsla(18, 73%, 56%, 0.8);
      }
    }
    .alarmDevName-title {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
      display: inline-block;
      white-space: nowrap;
    }
    .content-info {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
      text-align: end;
      display: inline-block;
      margin-left: 10px;
      white-space: nowrap;
    }
    .centerTop {
      width: 19%;
      height: 314px;
      aspect-ratio: 16/9;
      margin-right: 1.2%;
      background-color: #163648;
      margin-bottom: 32px;
      border-radius: 4px;
      &:nth-of-type(5n) {
        margin-right: 0;
      }
      .MainCenter-top {
        width: 100%;
        height: 180px;
        position: relative;
        aspect-ratio: 16/9;
      }
      .MainCenter-top video {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .MainCenter-center {
        width: 93%;
        margin: 10px auto;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
      }
      .MainCenter-bottom {
        display: flex;
        justify-content: space-around;
        span {
          font-size: 14px;
          cursor: pointer;
        }
        :hover {
          font-size: 16px;
        }
      }
    }
  }

  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #000;
    left: 0;
    top: 0;
    z-index: 1000;
    opacity: 0.5;
    i {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }
  .bigimg {
    position: fixed;
    width: 300px;
    height: 200px;
    z-index: 1001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .nunu {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: black;
      opacity: 0.65;
      position: absolute;
      bottom: 0%;
      display: flex;
      justify-content: space-around;
      span {
        display: inline-block;
        font-size: 16px;
        color: #fff;
      }
    }
  }

  //视频
  .video-showbig {
    position: fixed !important;
    z-index: 1001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80% !important;
    &:focus {
      outline: none;
    }
  }

  //播放器
  $background: rgba(23, 45, 58, 1);
  #rvc {
    background: $background;
    width: 760px;
    height: 430px;
    position: fixed;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 120;
    #video {
      width: 100%;
      height: 100%;
      background: $background;
    }
    .close {
      width: 35px;
      height: 35px;
      text-align: center;
      line-height: 35px;
      background: rgba(84, 242, 255, 0.2);
      border-radius: 4px;
      position: absolute;
      top: 4px;
      right: 4px;
      .closeRVC {
        margin: 6px;
        cursor: pointer;
        color: #fff;
        font-size: 30px;
      }
    }
  }
  @media screen and (max-width: 1400px) {
    .with1 {
      width: 58.33333% !important;
    }
    .with2 {
      width: 41.66667% !important;
    }
  }
}
</style>
