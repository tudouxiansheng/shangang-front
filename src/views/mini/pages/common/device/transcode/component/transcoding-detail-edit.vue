<template>
  <div>
    <el-dialog
      :title="title"
      v-model="$parent.dialogFormVisible"
      top="10vh"
      :width="locale == 'en' ? '1050px' : modifyOrDetailType === 2 ? '600px' : '1020px'"
      :close-on-click-modal="false"
      class="play_detail_dialog"
      :modal="false"
      draggable
      @closed="dialogClosed"
      @open="dialogOpen"
    >
      <div v-if="modifyOrDetailType === 1 && errorInfo === ''">
        <el-radio-group v-model="urlType" @change="urlTypeChange">
          <el-radio-button :label="4">flv</el-radio-button>
          <el-radio-button :label="2">hls</el-radio-button>
          <el-radio-button :label="1">rtmp</el-radio-button>
        </el-radio-group>
      </div>
      <div class="main">
        <!-- 编辑时返回错误信息得位置 -->
        <div v-if="modifyOrDetailType === 1 && errorInfo !== ''" class="errorInfo">
          <span class="errorInfoTitle">{{ $t('lensTranscodingTask.reason') }}:{{ errorInfo }}</span>
        </div>
        <div class="tabs" :style="initWidth()">
          <div class="tabs-top">
            <div class="tabs-top-item">
              {{ $t('devOps.transcodeAttributes') }}
            </div>
          </div>
          <ul class="tabs-info">
            <li>
              <span>{{ $t('lensTranscodingTask.taskId') }}：</span>
              <span>{{ liveInfo.taskId }}</span>
            </li>
            <li>
              <span>{{ $t('deviceCamera.cameraId') }}：</span>
              <span>{{ liveInfo.cameraId }}</span>
            </li>
            <li>
              <span>{{ $t('deviceCamera.cameraName') }}：</span>
              <el-tooltip class="item" effect="dark" :content="liveInfo.cameraName" placement="top">
                <span class="shengnue">{{ liveInfo.cameraName }}</span>
              </el-tooltip>
            </li>
            <li>
              <span>{{ $t('lensTranscodingTask.status') }}：</span>
              <span
                :class="
                  liveInfo.status == '0'
                    ? 'warning'
                    : liveInfo.status == '1'
                    ? 'success'
                    : liveInfo.status == '2'
                    ? 'danger'
                    : ''
                "
              >
                {{ $parent.setStatus(liveInfo.status) }}
              </span>
            </li>
            <li v-show="modifyOrDetailType === 1">
              <span>{{ $t('lens.StreamType') }}：</span>
              <span>{{ $parent.setStreamType(liveInfo.streamType) }}</span>
            </li>
            <li v-show="modifyOrDetailType === 2">
              <span>{{ $t('lens.StreamType') }}：</span>
              <el-select v-model="liveInfo.streamType" @change="cameraStreamType">
                <el-option
                  v-for="item in liveInfo.cameraStreamInfoList"
                  :key="item.streamType"
                  :label="item.streamName"
                  :value="item.streamType"
                />
              </el-select>
            </li>

            <li>
              <span>{{ $t('lensTranscodingTask.encodeType1') }}：</span>
              <span>{{ $parent.setEncodeType(liveInfo.encodeType) }}</span>
            </li>
            <li>
              <span>{{ $t('lensTranscodingTask.resolution') }}：</span>
              <span>{{ liveInfo.resolution }}</span>
            </li>
            <li v-show="modifyOrDetailType === 1">
              <span>{{ $t('lens.transcoding') }}：</span>
              <span>{{ $parent.templateListObj[liveInfo.templateId] }}</span>
            </li>
            <li v-show="modifyOrDetailType === 2">
              <span>{{ $t('lens.transcoding') }}：</span>
              <el-select v-model="liveInfo.templateId" filterable>
                <el-option
                  v-for="item in $parent.templateList"
                  :key="item.templateId"
                  :label="item.templateName"
                  :value="item.templateId"
                />
              </el-select>
            </li>
            <li v-show="modifyOrDetailType === 1">
              <span>{{ $t('lensTranscodingTask.transcodingNodes') }}：</span>
              <span>{{ liveInfo.transcodeNode }}</span>
            </li>
            <li v-show="modifyOrDetailType === 2">
              <span>{{ $t('lensTranscodingTask.transcodingNodes') }}：</span>
              <el-input
                v-model="liveInfo.transcodeNode"
                type="text"
                readonly
                @click.native="getTranscodeNode(liveInfo)"
              />
            </li>
            <li v-show="modifyOrDetailType === 1 && liveInfo.backupTranscodeNode">
              <span>{{ $t('lensTranscodingTask.backupTranscodeNode') }}：</span>
              <span>{{ liveInfo.backupTranscodeNode }}</span>
            </li>
            <div v-show="tipText" style="color: #e6a23c; margin-top: 10px">
              <el-icon class="warning" style="font-size: 16px; margin-right: 10px">
                <el-icon-warning-outline />
              </el-icon>
              {{ $t('lensTranscodingTask.tipText') }}
            </div>
          </ul>
        </div>
      </div>

      <div v-show="modifyOrDetailType === 1 && errorInfo === ''" style="display: flex">
        <el-input type="textarea" v-model="videoUrl" />
      </div>
      <template v-if="modifyOrDetailType === 2" #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>

      <div
        v-if="modifyOrDetailType === 2"
        style="color: #e6a23c; margin-top: 10px; display: flex; align-items: center"
      >
        <el-icon class="warning" style="font-size: 26px; margin-right: 10px">
          <el-icon-warning-outline />
        </el-icon>
        <div>
          <span>{{ $t('lensTranscodingTask.encodeTypeTips') }}!</span>
          <div>{{ $t('lensTranscodingTask.resolutionTips') }}！</div>
          <div>{{ $t('lensTranscodingTask.transcodingNodesTips') }}</div>
        </div>
      </div>
    </el-dialog>
    <SelectTranscoding
      :transcodeNodeInfo="transcodeNodeInfo"
      @getTranscodeNodeItem="getNodeItem"
    ></SelectTranscoding>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
import SelectTranscoding from '../component/select-transcoding'
import { mapState } from 'vuex'
export default {
  components: {
    SelectTranscoding,
    ElIconWarningOutline
  },
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    modifyOrDetailType: {
      type: Number
    },
    transDetail: {
      type: Object
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      liveInfo: {
        taskId: undefined,
        cameraId: undefined,
        cameraName: undefined,
        status: undefined,

        streamType: undefined,
        encodeType: undefined,
        resolution: undefined,
        templateId: undefined,
        transcodeNode: undefined,
        transcodeNodeId: undefined
      },
      urlType: 4,
      videoUrl: '',
      playStartTime: '',

      selectDialogVisible: false, // 选择转码节点 面板显隐
      transcodeNodeInfo: null //当前转码任务的item
    }
  },
  computed: {
    //接口错误信息提取
    ...mapState({
      errorInfo: state => state.transcodingTask.errorInfo
    }),
    //提示性文字展示
    tipText() {
      return this.$parent.setEncodeType(this.liveInfo.encodeType) == 'H265' &&
        this.$parent.templateListObj[this.liveInfo.templateId].indexOf('透传') > 0
        ? true
        : false
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  methods: {
    //中英文下不同宽度（美观度）
    initWidth() {
      let rightWidth = ''
      if (this.modifyOrDetailType == 1) {
        switch (this.locale) {
          case 'en':
            rightWidth = '390px'
            break

          case 'zh':
            rightWidth = '364px'
            break
        }
      } else {
        rightWidth = '554px'
      }
      return {
        '--right-width': rightWidth
      }
    },

    //修改转码参数提交
    submitForm() {
      this.$parent.maskloading = true
      this.$api
        .updateCameraTranscode({
          taskId: this.liveInfo.taskId,
          cameraId: this.liveInfo.cameraId,
          streamType: this.liveInfo.streamType,
          resolution: this.liveInfo.resolution,
          encodeType: this.liveInfo.encodeType,
          templateId: this.liveInfo.templateId,
          transcodeNode: this.liveInfo.transcodeNode,
          transcodeNodeId: this.liveInfo.transcodeNodeId
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.$parent.dialogFormVisible = false
            this.$parent.getTranscodeTasks()
          }
          this.$parent.maskloading = false
        })
    },

    //打开静态转码任务(详情/修改)
    dialogOpen() {
      this.$nextTick(async () => {
        
        //获取详细信息
        this.$api
          .getCameraTranscodeTaskInfo({
            cameraId: this.transDetail.cameraId,
            taskId: this.transDetail.taskId
          })
          .then(res => {
            if (res.resultCode == 0) {
              res.cameraTranscodeTaskInfo.cameraStreamInfoList
                ? res.cameraTranscodeTaskInfo.cameraStreamInfoList.forEach(item => {
                    if (item.streamType == res.cameraTranscodeTaskInfo.streamType) {
                      res.cameraTranscodeTaskInfo.encodeType = item.encodeType
                      res.cameraTranscodeTaskInfo.resolution = item.resolution
                    }
                  })
                : (res.cameraTranscodeTaskInfo.cameraStreamInfoList = [])
              if (res.cameraTranscodeTaskInfo.cameraStreamInfoList.length === 0) {
                res.cameraTranscodeTaskInfo.encodeType = ''
                res.cameraTranscodeTaskInfo.resolution = ''
                //默认主码流
                res.cameraTranscodeTaskInfo.cameraStreamInfoList.push({
                  streamName: this.$t('lensTranscodingTask.streamName'),
                  streamType: 1
                })
              }
              this.liveInfo = res.cameraTranscodeTaskInfo
              //如果是详情，展示并调用转码接口
              if (this.modifyOrDetailType == 1) {
                this.urlTypeChange(4)
              }
            }
          })
      })
    },

    cameraStreamType(value) {
      this.liveInfo.cameraStreamInfoList
        ? this.liveInfo.cameraStreamInfoList.forEach(item => {
            if (item.streamType == value) {
              this.liveInfo.encodeType = item.encodeType
              this.liveInfo.resolution = item.resolution
            }
          })
        : ''
    },

    //关闭静态转码任务(详情/修改)
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.liveInfo.taskId = ''
      this.liveInfo.cameraId = ''
      this.liveInfo.cameraName = ''
      this.liveInfo.status = undefined
      this.liveInfo.streamType = ''
      this.liveInfo.encodeType = ''
      this.liveInfo.resolution = ''
      this.liveInfo.templateId = ''
      this.videoUrl = ''
      this.urlType = 4
      this.$refs.videoPlay.videoPause()
    },

    //变化视频格式
    urlTypeChange(val) {
      this.urlType = val //视频格式问题
      this.getRequestLiveUrl(this.liveInfo.cameraId, this.liveInfo.streamType, val)
    },

    // 获取直播流地址
    async getRequestLiveUrl(cameraId, streamType = 1, urlType = 2) {
      let obj = {
        contentId: cameraId,
        streamType,
        urlType
      }
      this.$api.getMediaLiveUrl(obj).then(res => {
        if (res.liveUrl) {
          this.$refs.videoPlay.videoPause()
          if (urlType == 1) {
            let isChrome =
              navigator.userAgent.indexOf('Chrome') > -1 &&
              navigator.userAgent.indexOf('Safari') > -1
            if (isChrome) {
              this.$message.warning(this.$t('devOps.videoPlayPrompt'))
            }
            this.$refs.videoPlay.rtmpPlay(res.liveUrl)
            this.videoUrl = res.liveUrl
          } else if (urlType == 4) {
            this.$refs.videoPlay.flvPlay(res.liveUrl)
            this.videoUrl = res.liveUrl
          } else if (urlType == 2) {
            this.$refs.videoPlay.hlsPlay(res.liveUrl)
            this.videoUrl = res.liveUrl
          }
          this.playStartTime = Date.now()
        }
      })
    },
    //复制
    copy() {
      this.$message({
        type: 'success',
        message: this.$t('lens.urlCopySuccess')
      })
    },
    //点击转码节点打开选择弹窗
    getTranscodeNode(item) {
      item.transcodeNode = item.transcodeNode ? item.transcodeNode : ''

      this.transcodeNodeInfo = JSON.parse(JSON.stringify(item))
      this.selectDialogVisible = true
    },
    //获取选择的转码节点
    getNodeItem(nodeItem) {
      this.selectDialogVisible = false
      this.liveInfo = Object.assign({}, this.liveInfo, {
        transcodeNode: nodeItem.nodeIp,
        transcodeNodeId: nodeItem.mediaNodeId
      })
    }
  }
}
</script>

<style lang="scss">
.play_detail_dialog {
  .el-dialog__body {
    padding: 15px;
    .el-textarea__inner {
      margin-top: 8px;
    }
    .el-select {
      width: 204px;
    }
    .el-input {
      width: 204px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-left: 1px solid #888;
    }
    .el-radio-button--small .el-radio-button__inner {
      padding: 9px 61px;
      font-size: 14px;
      font-weight: 600;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border: 1px solid #409eff;
    }
    .el-radio-button__inner {
      border: 1px solid #888;
      border-left: 0;
    }
    .main {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;

      .errorInfo {
        background: #f2f2f2;
        width: 600px;
        .errorInfoTitle {
          line-height: 300px;
          text-align: center;
          color: #f56c6c;
          display: block;
        }
      }

      .tabs {
        padding: 8px;
        width: var(--right-width);
        background: #f2f2f2;
        .tabs-top {
          color: #fff;
          height: 40px;
          line-height: 40px;
          border: 1px solid #409eff;
          border-radius: 4px;
          background: #409eff;
          text-align: center;
          margin-bottom: 15px;
        }
        .shengnue {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 260px;
          text-align: right;
        }
        .tabs-info {
          line-height: 30px;
          font-size: 14px;
          padding: 0 2px;
          li {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
