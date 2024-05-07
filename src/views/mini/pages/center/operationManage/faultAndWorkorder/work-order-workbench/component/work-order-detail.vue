<template>
  <div class="workorder-detail-box" v-if="isRouterAlive" ref="workorderDetail">
    <el-page-header @back="goBack" :content="$t('faultAndWorkorder.workorderDetail')" />
    <div class="fault-detail">
      <div class="fault-detail-left">
        <collapse-card :title="$t('faultAndWorkorder.workorderStatus')" hideCollapse collapse>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in eventList"
              :key="index"
              :icon="item.icon"
              :color="item.color"
            >
              <p class="time-line-title">{{ item.woStatusName }}</p>
              <p class="time-line-time">{{ item.operationTime }}</p>
              <p class="time-line-remark">
                <span v-show="item.operatorName">{{ item.operatorName }}</span>
                <span v-show="item.operatorName && item.remark">:</span>
                <span>{{ item.remark }}</span>
              </p>
            </el-timeline-item>
          </el-timeline>
        </collapse-card>
      </div>
      <div class="fault-detail-right">
        <collapse-card :title="$t('faultAndWorkorder.workorderInfo')" hideCollapse collapse>
          <el-row class="mt-3">
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.workorderId') }}:</span>
              <span>{{ form1.woId }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.workorderStatus') }}:</span>
              <span>{{ form1.woStatusName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultType') }}:</span>
              <span>{{ form1.faultTypeName }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <span class="label">{{ $t('deviceInfo.deviceID') }}:</span>
              <span>{{ form1.devId }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('deviceInfo.deviceName') }}:</span>
              <span>{{ form1.devName }}</span>
            </el-col>

            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.operator') }}:</span>
              <span>{{ form1.operatorName }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.createTime') }}:</span>
              <span>{{ form1.createTime }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.maintainer') }}:</span>
              <span>{{ form1.maintainerName }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <span class="label">{{ $t('faultAndWorkorder.workorderDes') }}:</span>
            <span>{{ form1.woRemark }}</span>
          </el-row>
        </collapse-card>
        <collapse-card :title="$t('faultAndWorkorder.faultDetail')" hideCollapse collapse>
          <el-row class="mt-3">
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultReporter') }}:</span>
              <span>{{ form2.reportPerson }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.faultDiscoveryTime') }}:</span>
              <span>{{ form2.faultDiscoveryTime }}</span>
            </el-col>
            <el-col :span="8">
              <span class="label">{{ $t('faultAndWorkorder.reportTime') }}:</span>
              <span>{{ form2.createTime }}</span>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <span class="label">{{ $t('faultAndWorkorder.faultDes') }}:</span>
            <span>{{ form2.faultRemark }}</span>
          </el-row>
          <el-row class="mt-10">
            <span class="label file-lable">{{ $t('faultAndWorkorder.attachment') }}:</span>
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
  </div>
</template>

<script>
import collapseCard from '@/components/collapse-card'
import { mapState } from 'vuex'
import { download } from '@/utils/common/download'
import { ElImageViewer } from 'element-plus'
export default {
  name: 'WorkOrderWorkbenchDetail',
  components: { collapseCard, ElImageViewer },
  data() {
    return {
      isRouterAlive: true,
      faultId: '',
      woId: '',
      eventList: [],
      form1: {
        woId: undefined,
        woStatus: undefined,
        faultType: undefined,
        devId: undefined,
        devName: undefined,
        woCreateTime: undefined,
        operatorName: undefined,
        maintainerName: undefined,
        woRemark: undefined,
        woStatusName: undefined,
        faultTypeName: undefined,
        createTime: undefined
      },
      form2: {
        reportPerson: '123',
        faultDiscoveryTime: 1,
        createTime: 1,
        faultRemark: 1
      },
      imageTypeList: ['jpg', 'png', 'bmp'],
      videoTypeList: ['mp4'],
      fileType: undefined, // 1视频，2图片
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
      workorderStatusData: state => state.dict.workorder_status
    })
  },
  mounted() {
    this.getRouteParams()
    this.getWorkOrderFlow()
    this.getWorkOrderInfo()
    this.getFaultDetail()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    getRouteParams() {
      this.faultId = this.$route.params.faultId
      this.woId = this.$route.params.woId
    },
    async getWorkOrderFlow() {
      let res = await this.$api.getWorkOrderFlow({ woId: this.woId })
      if (res.resultCode == 0) {
        let eventList = res.eventList
        this.eventList = []

        let time = ''
        eventList.forEach((item, index) => {
          index == 0 ? (time = item.operationTime) : ''
          item.color = '#2C6DD2'
          this.eventList.push(item)
          item.woStatusName = this.workorderStatusFormatter(item.woStatusAfter)
        })
        this.eventList.unshift({
          color: '#2C6DD2',
          woStatusName: this.$t('faultAndWorkorder.workorderCreate'),
          operationTime: time
        })
      }
    },
    async getWorkOrderInfo() {
      let res = await this.$api.getWorkOrderInfo({ woId: this.woId })
      if (res.resultCode == 0) {
        this.form1 = {
          woId: res.woId,
          woStatus: res.woStatus,
          faultType: res.faultType,
          devId: res.devId,
          devName: res.devName,
          woCreateTime: res.woCreateTime,
          operatorName: res.operatorName,
          faultRemark: res.faultRemark,
          maintainerName: res.maintainerName,
          woRemark: res.woRemark,
          createTime: res.createTime
        }
        this.faultTypeFormatter()
        this.form1.woStatusName = this.workorderStatusFormatter(this.form1.woStatus)
      }
    },
    async getFaultDetail() {
      let res = await this.$api.getFaultDetail({ faultId: this.faultId })
      if (res.resultCode == 0) {
        this.form2 = {
          faultId: res.faultId,
          reportPerson: res.reportPerson,
          faultDiscoveryTime: res.faultDiscoveryTime,
          createTime: res.createTime,
          faultRemark: res.faultRemark
        }
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
          this.videoSrc = item.filePath + '?rel=0&amp&autoplay=1'
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
      this.form1.faultTypeName = this.selectDictLabel(this.faultTypeData, this.form1.faultType)
    },
    workorderStatusFormatter(data) {
      return this.selectDictLabel(this.workorderStatusData, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.workorder-detail-box {
  height: 847px;
  .fault-detail {
    display: flex;
    margin-top: 15px;
    .fault-detail-left {
      width: 350px;
      margin-right: 20px;
      background: #0a314f;
      height: 810px;
      overflow: auto;
    }
    .fault-detail-right {
      flex: 1;
      background: #0a314f;
      .label {
        display: inline-block;
        width: 100px;
        color: #fff;
      }
      .check-workorder {
        margin-left: 20px;
      }
      .file-lable {
        display: inline-block;
        float: left;
        height: 270px;
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
    }
  }
}
.time-line-title {
  color: #fff;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
}
.time-line-time,
.time-line-remark {
  margin-top: 3px;
  color: #fff;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
}
.time-line-remark {
  line-height: 21px;
}
:deep(.el-timeline-item__tail) {
  border-left: 2px solid #2c6dd2;
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
:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
</style>
