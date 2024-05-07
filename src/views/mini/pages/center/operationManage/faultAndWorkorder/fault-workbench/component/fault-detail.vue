<template>
  <div class="fault-detail-box" v-if="isRouterAlive" ref="faultDetail">
    <el-page-header @back="goBack" :content="$t('faultAndWorkorder.faultDetail')" />
    <div class="fault-detail">
      <div class="fault-detail-left">
        <collapse-card :title="$t('faultAndWorkorder.faultHandleStatus')" hideCollapse collapse>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in eventList"
              :key="index"
              :icon="item.icon"
              :color="item.color"
            >
              <p class="time-line-title">{{ item.operationName }}</p>
              <p class="time-line-time">{{ item.operationTime }}</p>
            </el-timeline-item>
          </el-timeline>
        </collapse-card>
      </div>
      <div class="fault-detail-right">
        <collapse-card :title="$t('faultAndWorkorder.reportFaultInfo')" hideCollapse collapse>
          <el-row class="mt-3">
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultId') }}:</span>
              <span>{{ form.faultId }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultOrderStatus') }}:</span>
              <span>{{ form.faultStatusName }}</span>
            </el-col>
            <el-col :span="8" v-show="form.woId">
              <span class="label">{{ $t('faultAndWorkorder.workorderId') }}:</span>
              <el-tooltip :content="form.woId" effect="light">
                <span class="woId-value">{{ form.woId }}</span>
              </el-tooltip>
              <el-tag class="check-workorder" @click="toWorkorder">
                {{ $t('faultAndWorkorder.overviewWorkorder') }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <span class="label">{{ $t('deviceInfo.deviceID') }}:</span>
              <span>{{ form.devId }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('deviceInfo.deviceName') }}:</span>
              <span>{{ form.devName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultType') }}:</span>
              <span>{{ form.faultTypeName }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.reportPerson') }}:</span>
              <span>{{ form.reportPerson }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultDiscoveryTime') }}:</span>
              <span>{{ form.faultDiscoveryTime }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultReportTime') }}:</span>
              <span>{{ form.createTime }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <span class="label">{{ $t('faultAndWorkorder.faultRemark') }}:</span>
            <span>{{ form.faultRemark }}</span>
          </el-row>
          <el-row class="mt-10" v-show="form.faultStatus == 3">
            <span class="label">{{ $t('faultAndWorkorder.repairResult') }}:</span>
            <span>{{ form.processResult }}</span>
          </el-row>
          <el-row class="mt-10">
            <span class="label file-label">{{ $t('faultAndWorkorder.attachment') }}:</span>
            <div class="file" v-for="(item, index) in fileList" :key="index">
              <svg-icon
                :icon-class="item.fileType == 1 ? 'video-icon' : 'image-icon'"
                class-name="file-icon"
              ></svg-icon>
              <div class="file-info">
                <p>
                  <span>{{ item.filename }}</span>
                  <span v-if="item.size">
                    {{ '(' + item.size + ')' }}
                  </span>
                </p>
                <p>
                  <span class="cursor-pointer text-detail" @click="previewHandle(item)">
                    {{ $t('public.preview') }}
                  </span>
                  <span class="ml-5 cursor-pointer text-detail" @click="downFileHandle(item)">
                    {{ $t('operateManage.down') }}
                  </span>
                </p>
              </div>
            </div>
          </el-row>
        </collapse-card>
      </div>
      <el-image-viewer
        v-if="showViewer && fileType == 2"
        @close="closeViewer"
        :url-list="imageList"
      />
      <el-dialog
        :title="$t('faultAndWorkorder.playVideo')"
        v-model="isShowIframe"
        width="900px"
        :before-close="closeIframe"
        :close-on-click-modal="false"
      >
        <iframe :src="videoSrc" sandbox="" height="500px" width="800px"></iframe>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import collapseCard from '@/components/collapse-card'
import { ElImageViewer } from 'element-plus'
const apply = require('@/assets/img/common/apply.png')
const checking = require('@/assets/img/common/checking.png')
const closed = require('@/assets/img/common/closed.png')
import { mapState } from 'vuex'
import { download } from '@/utils/common/download'

export default {
  name: 'FaultDetail',
  components: { collapseCard, ElImageViewer },
  data() {
    return {
      isRouterAlive: true,
      faultId: '',
      woId: undefined,
      eventList: [],
      processImgList: [apply, checking, closed],
      form: {
        faultId: undefined,
        faultType: undefined,
        devId: undefined,
        devName: undefined,
        reportPerson: undefined,
        faultDiscoveryTime: undefined,
        createTime: undefined,
        faultRemark: undefined,
        faultTypeName: undefined,
        woId: undefined,
        faultStatus: undefined,
        faultStatusName: undefined,
        repairTime: undefined,
        processResult: undefined
      },
      imageTypeList: ['jpg', 'png', 'bmp'],
      videoTypeList: ['mp4'],

      fileType: undefined, //1视频，2图片
      imageList: [],
      fileList: [],
      showViewer: false,
      isShowIframe: false,
      videoSrc: undefined
    }
  },
  computed: {
    ...mapState({
      faultTypeData: state => state.dict.fault_type,
      faultStatusData: state => state.dict.fault_status,
      faultOperationData: state => state.dict.workorder_operation
    })
  },
  mounted() {
    this.getRouteParams()
    this.getFaultDetail()
    this.getFaultTechnologicalProcess()
  },
  methods: {
    getRouteParams() {
      this.faultId = this.$route.params.id
      this.form.faultId = this.$route.params.id
    },
    goBack() {
      this.$router.back()
    },
    async getFaultDetail() {
      let res = await this.$api.getFaultDetail({ faultId: this.faultId })
      if (res.resultCode == 0) {
        this.form = {
          faultId: res.faultId,
          faultType: res.faultType,
          devId: res.devId,
          devName: res.devName,
          reportPerson: res.reportPerson,
          faultDiscoveryTime: res.faultDiscoveryTime,
          createTime: res.createTime,
          faultRemark: res.faultRemark,
          woId: res.woId,
          faultStatus: res.faultStatus,
          repairTime: res.repairTime,
          maintainerName: res.maintainerName,
          processResult: res.processResult
        }
        this.woId = this.form.woId
        this.faultTypeFormatter()
        this.faultStatusFormatter()
      }
      let fileList = res.fileList
      if (fileList.length > 0) {
        fileList.forEach(item => {
          let obj = item
          obj.size = (item.fileSize / 1024).toFixed(2) + 'kb'
          let extension = item.filename.slice(item.filename.lastIndexOf('.') + 1)
          if (this.imageTypeList.includes(extension)) {
            obj.fileType = 2
            obj.imageList = []
            obj.imageList.push(item.filePath)
          } else {
            obj.fileType = 1
          }
          this.fileList.push(obj)
        })
      }
    },
    async getFaultTechnologicalProcess() {
      let res = await this.$api.getFaultTechnologicalProcess({
        faultId: this.faultId
      })
      if (res.resultCode == 0) {
        let eventList = res.eventList
        this.eventList = []
        eventList.forEach(item => {
          item.color = '#2C6DD2'
          this.eventList.push(item)
          item.operationName = this.faultOperationFormatter(item.operation)
        })
      }
    },
    toWorkorder() {
      this.$router.push({
        name: 'WorkOrderWorkbenchDetail',
        params: {
          woId: this.woId,
          faultId: this.faultId
        }
      })
    },
    previewHandle(item) {
      this.fileType = item.fileType
      if (item.fileType == 1) {
        if (this.cuType == 4) {
          var link = document.createElement('a')
          var body = document.querySelector('body')
          link.href = item.filePath
          link.style.display = 'none'
          body.appendChild(link)
          link.click()
          body.removeChild(link)
        } else if (this.cuType == 1) {
          this.isShowIframe = true
          this.videoSrc = item.filePath
        }
      } else if (item.fileType == 2) {
        this.imageList = [item.imageList[0]]
        this.showViewer = true
      }
    },
    closeIframe() {
      this.isShowIframe = false
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    async downFileHandle(item) {
      let res = await this.$api.getDownloadUrl({
        fileId: item.fileId,
        netType: this.$getNetType()
      })
      if (res.resultCode == 0) {
        download(res.downloadUrl, item.filename)
      }
    },
    faultTypeFormatter() {
      this.form.faultTypeName = this.selectDictLabel(this.faultTypeData, this.form.faultType)
    },
    faultStatusFormatter() {
      this.form.faultStatusName = this.selectDictLabel(this.faultStatusData, this.form.faultStatus)
    },
    faultOperationFormatter(data) {
      let name = ''
      switch (data) {
        case 3:
          name = this.$t('faultAndWorkorder.faultHandling')
          break
        case 11:
          name = this.$t('faultAndWorkorder.faultClose')
          break
        default:
          name = this.selectDictLabel(this.faultOperationData, data)
          break
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.fault-detail-box {
  height: 847px;
  .fault-detail {
    display: flex;
    margin-top: 15px;
    .fault-detail-left {
      width: 350px;
      margin-right: 20px;
      padding: 20px;
      background: #0a314f;
      height: 810px;
    }
    .fault-detail-right {
      flex: 1;
      background: #0a314f;
      height: 810px;
      .label {
        display: inline-block;
        width: 100px;
        color: #fff;
      }
      .check-workorder {
        margin-left: 20px;
        cursor: pointer;
      }
      .file-label {
        display: inline-block;
        float: left;
        height: 460px;
      }
      .file {
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
        padding: 15px;
        height: 80px;
        background: rgba(44, 109, 210, 0.1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        .file-icon {
          display: inline-block;
          width: 46px;
          height: 53px;
        }
        .file-info {
          float: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 15px;
          height: 53px;
        }
      }
      .woId-value {
        display: inline-block;
        width: calc(100% - 100px - 115px);
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 12px;
      }
    }
  }
  :deep(.el-page-header) {
    padding: 15px 15px 0 15px;
  }
  :deep(.el-page-header__left) {
    color: #fff;
  }
  :deep(.el-page-header__content) {
    color: #fff;
  }
  :deep(.el-step__icon) {
    width: 56px;
    height: 56px;
  }
  :deep(.el-step__icon.is-text) {
    border-radius: 0;
    border: none;
    border-color: none;
  }
  :deep(.el-step.is-vertical) .el-step__line {
    left: 28px;
  }
  :deep(.el-step.is-vertical) .el-step__main {
    padding-left: 60px;
    padding-top: 18px;
  }
  :deep(.el-step__description.is-finish) {
    color: #7a869a;
  }
}
:deep(.collapse-card) {
  background: transparent !important;
  border-bottom: none;
  color: #fff !important;
  .card-header {
    color: #fff !important;
    .card-header-title::before {
      bottom: 3px;
    }
  }
  .card-body {
    font-size: 14px;
  }
  .el-timeline-item__content {
    color: #fff;
  }
}
</style>
