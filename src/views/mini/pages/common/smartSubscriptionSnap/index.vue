<template>
  <div id="smartSubscriptionSnap" v-if="isRouterAlive" ref="smartSubscriptionSnap">
    <el-row>
      <!-- 订阅抓拍搜索表单 -->
      <el-col :span="6" style="padding: 20px 30px 0">
        <div class="middle">
          <div
            class="left"
            style="min-height: 760px"
            v-loading="loadingGroup"
            :element-loading-text="$t('public.loading')"
            
            element-loading-background="rgba(8,55,83,0.7)"
          >
            <div style="margin: 20px">
              <el-form
                ref="form"
                :model="searchForm"
                :rules="valueRules"
                :label-width="'160px'"
                class="demo-form-inline"
                label-position="top"
              >
                <div class="flex">
                  <el-form-item :label="$t('metadata.snapTime') + ' ：'" prop="dateVal">
                    <el-date-picker
                      :default-time="[
                        new Date(2000, 1, 1, 0, 0, 0),
                        new Date(2000, 1, 1, 23, 59, 59)
                      ]"
                      :shortcuts="pickerOptions && pickerOptions.shortcuts"
                      :disabled-date="pickerOptions && pickerOptions.disabledDate"
                      :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                      style="width: 100% !important"
                      v-model="searchForm.dateVal"
                      type="datetimerange"
                      :range-separator="$t('public.to')"
                      :start-placeholder="$t('public.startTimePrompt')"
                      :end-placeholder="$t('public.endTimePrompt')"
                      @change="changeDate"
                      :clearable="false"
                      popper-class="no-clear"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <el-form-item :label="$t('retrieval.selectPlatform')" prop="platId">
                  <el-select
                    v-model="searchForm.platId"
                    clearable
                    :placeholder="$t('retrieval.selectPlatformPrompt')"
                    @change="handleAccessPlatformIdChange"
                  >
                    <el-option
                      v-for="item in platformList"
                      :key="item.platformId"
                      :label="item.platformName"
                      :value="item.platformId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('metadata.sourceName') + ' ：'" prop="cameraName">
                  <el-input
                    ref="sourceNameInput"
                    style="width: 100%"
                    @focus="openDialog"
                    v-model="searchForm.cameraName"
                    :placeholder="$t('alarmList.selectACamera')"
                  >
                    <template #suffix>
                      <svg-icon icon-class="add-input" class-name="el-input__icon" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('snapList.snapType') + ' ：'" prop="metaDataTypes">
                  <el-checkbox-group v-model="searchForm.metaDataTypes">
                    <el-checkbox :label="1">
                      {{ $t('platformManagement.face') }}
                    </el-checkbox>
                    <el-checkbox :label="3">
                      {{ $t('platformManagement.car') }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <div style="margin-bottom: 20px; text-align: center">
                  <el-button
                    v-show="!isShow"
                    type="primary"
                    :loading="loading"
                    @click="handleFind"
                    class="miniBtn"
                  >
                    {{ $t('public.search') }}
                  </el-button>
                  <el-button v-show="isShow" type="primary" @click="cancelSeach()" class="miniBtn">
                    {{ $t('deviceCamera.cancelSearch') }}
                  </el-button>
                  <el-button type="primary" @click="resetForm" class="miniBtn">
                    {{ $t('public.reset') }}
                  </el-button>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </el-col>

      <el-col
        :span="18"
        style="padding: 0px 29px; margin-top: 20px; min-height: 600px; position: relative"
      >
        <div
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div style="margin: 1% 0" class="buttonall" v-show="!loading && tableData.length">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              style="margin-right: 20px"
            >
              {{ $t('repo.allSelect') }}
            </el-checkbox>

            <el-popover trigger="click" placement="top-start">
              <div class="el-select-dropdown__item" @click="downLoadPhoto(1)">
                {{ $t('retrieval.exportSelected') }}
              </div>
              <div class="el-select-dropdown__item" @click="downLoadPhoto(3)">
                {{ $t('retrieval.exportAll') }}
              </div>

              <el-icon :title="$t('public.export')" :style="{ cursor: delButton ? 'default' : 'pointer' }"><el-icon-upload2 /></el-icon>
            </el-popover>
          </div>
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <ul v-show="!loading && tableData.length" class="table-list">
            <li v-for="item in tableData" :key="item.metadataContent.captureTime" class="list-li">
              <div class="header">
                <el-checkbox
                  v-model="item.checked"
                  @change="handleCheckedChange(item)"
                ></el-checkbox>
              </div>
              <div class="imgs" @click="openBigImg(item)">
                <el-image
                  fit="contain"
                  style="height: 100%; width: 100%"
                  :key="item.metadataContent.detectUrl"
                  :src="item.metadataContent.detectUrl"
                  lazy
                ></el-image>
              </div>

              <div class="content" @click="openBigImg(item)">
                <div class="content-item" v-if="item.cameraName">
                  <span class="content-item-left">{{ $t('metadata.camera') }}：</span>
                  <span class="content-item-right">{{ item.cameraName }}</span>
                </div>
                <div class="content-item">
                  <span class="content-item-left">{{ $t('metadata.time') }}：</span>
                  <el-tooltip
                    effect="light"
                    :content="item.metadataContent && item.metadataContent.captureTime"
                    placement="top-start"
                    :disabled="!(item.metadataContent && item.metadataContent.captureTime)"
                  >
                    <span class="content-item-right">
                      {{ item.metadataContent.captureTime }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <camera-selector
      v-if="showComponent"
      :key="deviceToolKey"
      :title="$t('metadata.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      :device-type="1"
      :platform-id="accessPlatformId"
      mode="single"
    />

    <subscribe-export v-model:visible="batchVisible"></subscribe-export>
    <capture-detail
      v-model:visible="detailDialogVisible"
      :repository-type="repositoryType"
      :form="dataForm"
    ></capture-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { UploadFilled as ElIconUpload2 } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { getFormatDate, getRecentDays } from '@/utils/common/mutil'
import subscribeExport from './components/face-export'
import { repositoryType as RepositoryTypeEnum } from './components/repositoryModal/constant'
import CaptureDetail from './components/capture-detail.vue'
import CameraSelector from '@components/cameraSelector'

export default {
  components: {
    subscribeExport,
    CaptureDetail,
    CameraSelector,
    ElIconUpload2
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      loadingGroup: false,
      isShow: false,
      searchForm: {
        dateVal: [],
        cameraName: '',
        deviceIds: [],
        captureStartTime: '',
        captureEndTime: '',
        platId: '',
        metaDataTypes: [1, 3]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().setHours(23, 59, 59, 0)
        }
      },
      platformList: [],
      accessPlatformId: undefined,
      deviceToolKey: 0,
      valueRules: {
        dateVal: [
          {
            required: true,
            message: this.$t('deviceCamera.dateValProp'),
            trigger: 'change'
          }
        ],
        platId: [
          {
            required: true,
            message: this.$t('deviceCamera.platIdProp'),
            trigger: 'change'
          }
        ],
        cameraName: [
          {
            required: true,
            message: this.$t('deviceCamera.cameraNameProp'),
            trigger: 'change'
          }
        ],
        metaDataTypes: [
          {
            required: true,
            message: this.$t('deviceCamera.metaDataTypesProp'),
            trigger: 'change'
          }
        ]
      },
      dialogDeviceVisible: false,
      showComponent: true,
      loading: false,
      tableData: [],
      isIndeterminate: false,
      checkAll: false,
      delButton: true,
      //目标抓拍详情弹窗是否显示
      detailDialogVisible: false,
      //被选中的导出数据
      checkedCopyDate: [],
      batchVisible: false,
      dataForm: {},
      cameraId: null,
      repositoryType: undefined,
      dayjs
    }
  },
  name: 'SmartSubscriptionCapture',
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  created() {
    this.bindEvent()
  },
  async mounted() {
    await this.getAccessPlatList()
    this.initialization_Date()
  },
  beforeDestroy() {
    this.unBindEvent()
    // 页面销毁的时候要取消订阅
    this.cancelSeach()
  },
  deactivated() {
    this.cancelSeach()
  },
  methods: {
    bindEvent() {
      this.$bus.$on('webkit_notify', this.webkitNotify)
    },
    unBindEvent() {
      this.$bus.$off('webkit_notify')
    },
    cancelSeach(flag = true) {
      if (this.cameraId) {
        this.unsubscribeMetadata(this.cameraId).then(res => {
          if (res && res.resultCode == 0) {
            this.stopTimerRequest()
            this.isShow = false
            flag ? this.$message.success(this.$t('deviceCamera.cancelSearchSuccess')) : ''
          }
        })
      }
    },
    // 处理接受过来的消息数据
    handleHistoryMetadata(item) {
      let obj = JSON.parse(this.cuType == 1 ? item : item.newValue)

      this.tableData.unshift({
        ...obj,
        checked: false
      })
    },
    // 取消订阅
    unsubscribeMetadata(cameraId) {
      if (cameraId) {
        return this.$api.clientUnsubscribeMetadata({ cameraId })
      }
      return Promise.resolve()
    },

    // 获取订阅抓拍
    async getSubCaptureData() {
      this.tableData = []
      this.loading = true
      let obj = JSON.parse(JSON.stringify(this.searchForm))
      obj.cameraId = obj.deviceIds[0]
      delete obj.deviceIds
      delete obj.cameraName
      delete obj.dateVal
      this.$api
        .clientSubscribeMetadata(obj)
        .then(res => {
          if (res?.resultCode == 0) {
            this.$message.success(this.$t('deviceCamera.subscribeSuccess'))
            this.cameraId = obj.cameraId
            this.isShow = !this.isShow
            this.startTimerRequest('clientSubscribeMetadata', obj, 15000)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDialog() {
      this.$refs.sourceNameInput.blur()
      if (this.isShow) {
        this.$confirm(this.$t('metadata.selectCameraTip'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(async () => {
            await this.cancelSeach(false)
            this.dialogDeviceVisible = true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('metadata.cancelSelectCameraTip')
            })
          })
      } else {
        this.dialogDeviceVisible = true
      }
    },
    // 改变开始时间
    changeDate(val) {
      if (val) {
        this.searchForm.captureStartTime = getFormatDate(val[0])
        this.searchForm.captureEndTime = getFormatDate(val[1])
      } else {
        this.searchForm.captureStartTime = ''
        this.searchForm.captureEndTime = ''
      }
    },
    // 初始化日期
    initialization_Date() {
      const times = getRecentDays(1)
      this.searchForm.dateVal = [getFormatDate(times[0]), getFormatDate(times[1])]
      this.searchForm.captureStartTime = getFormatDate(this.searchForm.dateVal[0])
      this.searchForm.captureEndTime = getFormatDate(this.searchForm.dateVal[1])
    },
    getCameras(cameras) {
      let currentCameras = [],
        camerasArray = []
      if (cameras.length) {
        for (let i = 0; i < cameras.length; i++) {
          currentCameras.push(cameras[i].name)
          camerasArray.push(cameras[i].id)
        }
        this.searchForm.cameraName = currentCameras.join(',')
        this.searchForm.deviceIds = camerasArray
      } else {
        this.searchForm.cameraName = ''
        this.searchForm.deviceIds = []
      }
    },
    handleFind() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.getSubCaptureData()
        }
      })
    },
    // 重置表单
    resetForm() {
      const times = getRecentDays(1)
      this.searchForm.dateVal = [getFormatDate(times[0]), getFormatDate(times[1])]
      if (this.platformList.length > 0) {
        this.searchForm.platId = this.platformList[0].platformId
      }
      this.searchForm.cameraName = ''
      this.searchForm.deviceIds = []
      this.tableData = []
    },
    //抓拍全选
    handleCheckAllChange(val) {
      if (val) {
        this.delButton = false
      } else {
        this.delButton = true
      }
      this.tableData.forEach(item => {
        item.checked = val
      })
      if (this.tableData.length == 0) {
        this.delButton = true
      }
      this.isIndeterminate = false
    },
    // 查看大图详情
    async openBigImg(row) {
      let data = {
        ...row.metadataContent,
        ...row.metadataContent.attributes,
        ...row
      }
      if (row.metadataContent.attributes?.lprInfo) {
        data = {
          ...data,
          ...row.metadataContent.attributes.lprInfo
        }
      }
      this.dataForm = data
      this.repositoryType =
        row.metadataType === 3 ? RepositoryTypeEnum.vehicle : RepositoryTypeEnum.person

      this.detailDialogVisible = true
    },
    handleCheckedChange(item) {
      let checkedAll = this.tableData.every(item => {
        return item.checked
      })
      let checkedSome = this.tableData.some(item => {
        return item.checked
      })
      if (checkedAll) {
        this.checkAll = true
        this.delButton = false
        this.isIndeterminate = false
      } else if (checkedSome) {
        this.delButton = false
        this.isIndeterminate = true
      } else {
        this.delButton = true
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    // 导出功能
    async downLoadPhoto(exportType) {
      const filterList = this.tableData.filter(item => item.checked)
      if (exportType === 1 && filterList.length === 0) {
        this.$message.error(this.$t('retrieval.selectExportData'))
        return
      }
      try {
        await this.$confirm(this.$t('retrieval.vehicleExportPrompt'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
      } catch {
        return
      }
      if (exportType == 1) {
        this.checkedCopyDate = filterList
        this.batchVisible = true
      } else if (exportType === 3) {
        this.checkedCopyDate = this.tableData
        this.batchVisible = true
      }
    },

    async getAccessPlatList() {
      const res = await this.$api.queryAccessPlatformList({
        platformType: 5
      })
      if (res.resultCode == 0) {
        this.platformList = res.platformList
        // 默认选择第一个平台
        if (this.platformList.length > 0) {
          this.searchForm.platId = this.platformList[0].platformId
        }
      }
    },
    handleAccessPlatformIdChange(val) {
      if (val) {
        this.accessPlatformId = val
      } else {
        this.accessPlatformId = undefined
      }
      // 平台变化 情况已选择的镜头
      this.searchForm.cameraName = ''
      this.searchForm.deviceIds = []
    },
    webkitNotify(e) {
      const { func, message } = e
      if (func == 'history-metadata-subscribe-result') {
        let obj = JSON.parse(message)
        obj.checked = false
        this.tableData.unshift(obj)
        this.tableData.forEach(item => {
          item.checked = false
        })
        this.checkAll = false
        this.delButton = true
        this.isIndeterminate = false
      }
    },
    /**
     * 发起定时请求
     * @param {string} url - 请求的URL
     * @param {object} params - 请求的参数
     * @param {number} interval - 定时请求的时间间隔，单位为毫秒
     */
    startTimerRequest(url, params, interval) {
      this.stopTimerRequest()
      this.heartbeatTimer = setInterval(() => {
        this.$api[url](params).catch(error => {
          // 如果出现错误，停止定时器
          this.stopTimerRequest()
        })
      }, interval)
    },
    stopTimerRequest() {
      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    }
  }
}
</script>

<style lang="scss">
#smartSubscriptionSnap {
  position: relative;
  .el-loading-parent--relative {
    position: initial !important;
  }

  .el-tabs__content {
    display: none;
  }
  .el-tabs {
    padding-left: 16px;
    margin-top: 20px;
  }
  .el-tabs__item {
    color: #ccc;
    font-size: 18px !important;
    font-weight: 400;
    background: none !important;
  }
  .el-tabs__item.is-active {
    color: #409eff !important;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-form--inline .el-form-item__content {
    width: 100% !important;
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__header {
    background: transparent;
    color: #fff;
    font-size: 20px;
    border: none;
    margin-bottom: 10px;
  }
  .el-collapse-item__wrap {
    background: transparent;
    border: none;
  }
  .el-collapse-item__content {
    color: #fff;
  }

  .top {
    .el-radio {
      color: #fff;
    }
    .el-radio__inner {
      background-color: transparent;
    }

    .chooseList {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      align-items: center;
      .btns {
        position: absolute;
        top: 0;
        right: -40px;
        margin: 10px 100px 10px 0 !important;
      }
      li {
        margin: 10px 100px 10px 0 !important;
      }
    }
  }
  .groupList {
    width: 100%;
    padding-bottom: 25px;
    overflow: auto;
    li {
      padding-left: calc(25% - 9px);
      padding-top: 8px;
      padding-bottom: 8px;
      margin: 8px 0;
      cursor: pointer;
      position: relative;
    }
  }
  .middle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .left {
      background-color: #083753;
      color: #f2f2f2;
      font-size: 15px;
      padding-bottom: 20px;
      .editGroup {
        display: flex;
        align-items: center;
        .el-input--small .el-input__inner {
          height: 20px;
          line-height: 24px;
          border-radius: 0;
          background-color: #0c4d73;
          width: 100%;
        }
        .el-input--small {
          width: 60%;
        }
      }
      .groupList {
        width: 100%;
        padding-bottom: 25px;
        overflow: auto;
        li {
          padding-left: calc(25% - 9px);
          padding-top: 8px;
          padding-bottom: 8px;
          margin: 8px 0;
          cursor: pointer;
          position: relative;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .right {
      width: 78%;
      .buttonall {
        i {
          margin-left: 30px;
          font-size: 14px;
          cursor: pointer;
        }
        i:before {
          margin-right: 6px;
        }
      }
      .el-checkbox {
        color: #fff;
      }
      .boxList {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .box {
          width: 22%;
          padding-bottom: 10px;
          background-color: #083753;
          margin-bottom: 1.5%;
          color: #cccccc;
          font-size: 14px;
          .el-button--small,
          .el-button--small.is-round {
            padding: 6px 12px;
          }
          span {
            color: #fff;
          }
        }
      }
      li:nth-child(4n + 2) {
        margin: 0 2% 1.5% 4%;
      }
      li:nth-child(4n + 3) {
        margin: 0 4% 1.5% 2%;
      }
    }
  }
  .newCameras {
    position: relative;
    display: inline-block;

    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addIcon {
      position: absolute;
      right: 5px;
      top: 13px;
      width: 16px;
      height: 16px;
    }
  }
  .table-list {
    width: 100%;
    height: calc(100vh - 200px);
    position: relative;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-wrap: wrap;
    .list-li {
      margin-right: 3%;
      margin-bottom: 20px;
      width: 22%;
      max-height: 375px;
      border-radius: 4px;
      background: rgba(41, 41, 41, 1);
      cursor: pointer;
      .header {
        padding-left: 20px;
        padding-top: 10px;
      }
      .imgs {
        margin: 0 auto;
        padding: 20px;
        padding-top: 10px;
        padding-bottom: 0px;
        height: 200px;
        border-radius: 4px;
        text-align: center;
        .imgCor {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        margin-top: 10px;
        padding: 20px;
        .content-item {
          font-size: 16px;
          color: #fff;
          line-height: 24px;
          display: flex;
          .content-item-left {
            width: 25%;
            min-width: 82px;
          }
          .content-item-right {
            width: 75%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .el-tooltip__popper {
    max-width: 300px;
  }
}
</style>
