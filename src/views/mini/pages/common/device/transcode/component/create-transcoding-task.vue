<template>
  <!-- 创建静态转码任务 -->
  <div>
    <el-dialog
      class="video-preview"
      :title="$t('lensTranscodingTask.createTask')"
      v-model="$parent.createDialogVisible"
      width="1250px"
      top="10vh"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      @closed="dialogClosed"
      @open="dialogOpen"
    >
      <div class="btnMargin">
        <el-button type="primary" :disabled="templateBtnShow" @click="setTemplate">
          {{ $t('lensTranscodingTask.setTranscodingTemplate') }}
        </el-button>
        <el-button type="primary" :disabled="nodesBtnShow" @click="setNodesBtn">
          {{ $t('lensTranscodingTask.setTranscodingNodes') }}
        </el-button>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '105px' : '86px'"
        label-position="left"
      >
        <el-form-item :label="$t('lensTranscodingTask.camera') + '：'" prop="choosedCameras_dialog">
          <el-tooltip
            effect="light"
            class="newCameras"
            :content="form.choosedCameras_dialog"
            placement="top-start"
            :disabled="ifDisable"
          >
            <el-input
              v-input-focus
              v-model="form.choosedCameras_dialog"
              :placeholder="$t('lensTranscodingTask.selectCameraPlz')"
              @focus="dialogDeviceVisible = true"
            >
              <template #suffix>
                <img
                  src="@/assets/img/common/add.png"
                  class="addIcon"
                  @click="dialogDeviceVisible = true"
                />
              </template>
            </el-input>
          </el-tooltip>
        </el-form-item>
      </el-form>

      <el-table
        :data="camerasTable"
        :row-class-name="$parent.tableRowClassName"
        max-height="600"
        border
        @selection-change="handleSelectionChangeNode"
      >
        <template #empty>
          <span>{{ $t('public.noData') }}</span>
        </template>
        <el-table-column label width="50" type="selection" />
        <el-table-column show-overflow-tooltip :label="$t('deviceCamera.cameraId')" min-width="130">
          <template #default="{ row }">
            <span>{{ row.cameraId }}</span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('deviceCamera.cameraName')"
          min-width="130"
        >
          <template #default="{ row }">
            <span>{{ row.cameraName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('lensTranscodingTask.cameraStatus')"
          min-width="80"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span
              :class="
                row.status == '0'
                  ? 'warning'
                  : row.status == '1'
                  ? 'success'
                  : row.status == '2'
                  ? 'danger'
                  : ''
              "
            >
              {{ $parent.setStatus(row.status) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('lensTranscodingTask.streamType')"
          min-width="100"
          prop="streamType"
        >
          <template #default="{ row }">
            <el-select
              v-if="row.cameraStreamInfoList"
              v-model="row.streamType"
              @change="changeCameraStream(row, row.streamType)"
            >
              <el-option
                v-for="(item, index) in row.cameraStreamInfoList"
                :key="index"
                :label="item.streamName"
                :value="item.streamType"
              />
            </el-select>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('lensTranscodingTask.encodeType')"
          min-width="80"
        >
          <template #default="{ row }">
            <span>
              {{ row.cameraStreamInfoList ? $parent.setEncodeType(row.encodeType) : '--' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('lensTranscodingTask.resolution')"
          min-width="80"
        >
          <template #default="{ row }">
            <span>{{ row.cameraStreamInfoList ? row.resolution : '--' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="$t('lensTranscodingTask.templateId')"
          min-width="140"
        >
          <template #default="{ row }">
            <el-select v-model="row.templateId" filterable>
              <el-option
                v-for="item in $parent.templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('lensTranscodingTask.transcodingNodes')"
          min-width="100"
        >
          <template #default="{ row, $index }">
            <el-input
              v-model="row.transcodeNode"
              type="text"
              readonly
              @click.native="getTranscodeNode(row, $index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>

      <div style="color: #e6a23c; margin-top: 10px; display: flex; align-items: center">
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
    <device-tools
      ref="deviceTools"
      @getChooseCameras="getCameras"
      :currentChooseCameras="currentChooseCameras"
      :title="$t('lensTranscodingTask.selectCamera')"
      type="1"
      :maxSelect="10"
    />

    <!-- 调拨镜头失败列表 -->
    <device-allcate-error-list :title="title" />
    <SelectTranscoding
      :transcodeNodeInfo="transcodeNodeInfo"
      @getTranscodeNodeItem="getNodeItem"
      :nodeArr="nodeArr"
      :selectState="selectState"
    ></SelectTranscoding>
    <!-- 批量设置转码模板 -->
    <el-dialog
      :title="$t('lensTranscodingTask.selectTranscodingTemplate')"
      v-model="selectTemplate"
      top="16vh"
      :close-on-click-modal="false"
      @closed="dialogClosedTemp"
      @open="dialogOpenTemp"
      :modal="false"
    >
      <el-form :inline="true" ref="templateForm" :model="templateForm" label-position="left">
        <el-form-item :label="$t('lensTranscodingTask.templateId') + '：'">
          <el-select v-model="templateForm.templateId" filterable>
            <el-option
              v-for="item in $parent.templateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="templateconfirm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :title="$t('lensTranscodingTask.tips1')"
      top="10vh"
      width="800px"
      v-model="selectNodeTip"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div style="text-align: center; margin-bottom: 30px">
        <h2>
          {{
            $t('lensTranscodingTask.selectTranscodingNodesTips1', {
              taskNum: taskNum
            })
          }}
        </h2>
        <span>{{ $t('lensTranscodingTask.selectTranscodingNodesTips2') }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="tipsconfirm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
import deviceTools from '@/components/device-tools'
const deviceAllcateErrorList = () => import('../../component/device-allcate-error-list')
import SelectTranscoding from '../component/select-transcoding'
import BatchOperate from '@/components/batchOperate' //批量操作
export default {
  components: {
    deviceTools,
    'device-allcate-error-list': deviceAllcateErrorList,
    SelectTranscoding,
    BatchOperate,
    ElIconWarningOutline
  },
  // 暂时不根据租户id展开对应设备节点,所以此处参数没有用
  props: {
    payload: {
      type: Object
    },
    payloadFirst: {
      type: Object
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      allcateErrorDialogVisible: false, //测试
      title: '',
      currentChooseCameras: [],
      camerasTable: [],
      camerasArray: [],
      dialogDeviceVisible: false,
      form: {
        choosedCameras_dialog: ''
      },
      rules: {
        choosedCameras_dialog: [
          {
            required: true,
            message: this.$t('lensTranscodingTask.caemraCantEmpty'),
            trigger: 'change'
          }
        ]
      },
      selectDialogVisible: false, // 选择转码节点 面板显隐
      transcodeNodeInfo: {}, //当前转码任务的item
      rowIndex: null, //
      nodeList: [], //
      nodeArr: [],

      operate: '',
      batchApi: '',
      multipleSelectionMany: [],
      batchDialogVisible: false, //批量操作对话框

      templateForm: {
        templateId: ''
      },
      templateBtnShow: true,
      nodesBtnShow: true,
      selectTemplate: false,
      selectState: 1, //1.每条任务单选 2.批量任务选择
      selectNodeTip: false,
      taskNum: 0
    }
  },
  computed: {
    ifDisable() {
      return this.camerasArray.length > 0 ? false : true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.title = this.$t('lensTranscodingTask.errorTitle')
    },
    changeCameraStream(row, value) {
      //选择不同码流显示不同得分辨率和编码格式
      row.cameraStreamInfoList.forEach(item => {
        if (item.streamType == value) {
          row.encodeType = item.encodeType
          row.resolution = item.resolution
        }
      })
    },
    async getCameras(cameras) {
      //表格数据
      this.camerasTable = []
      this.$nextTick(async () => {
        await this.getNodeList()
        cameras.forEach(item => {
          this.$api.getCameraConfigInfo({ cameraId: item.id }).then(res => {
            res.streamType = 1 //默认是主码流
            res.cameraStreamInfoList
              ? res.cameraStreamInfoList.forEach(item1 => {
                  if (item1.streamType == 1) {
                    res.resolution = item1.resolution
                    res.encodeType = item1.encodeType
                  }
                })
              : ''

            for (let i = 0; i < this.nodeList.length; i++) {
              if (this.nodeList[i].totalTask - this.nodeList[i].nowTask > 0) {
                res.transcodeNode = this.nodeList[i].nodeIp
                res.transcodeNodeId = this.nodeList[i].mediaNodeId
                this.nodeList[i].nowTask += 1
                break
              }
            }
            this.camerasTable.push(res)
          })
        })
      })
      let currentCameras_dialog = []
      this.form.choosedCameras_dialog = ''
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        //输入框显示得文字
        currentCameras_dialog.push(cameras[i].label)
        //是否显示toopTip
        this.camerasArray.push(cameras[i].id)
      }
      //确定选择得设备(父传子得数据)
      this.currentChooseCameras = JSON.parse(JSON.stringify(cameras))
      //输入框得显示文字拼接
      this.form.choosedCameras_dialog = currentCameras_dialog.join(',')
    },

    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(async () => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      //如果有选择的镜头,按取消将删除选择的镜头
      if (this.currentChooseCameras.length > 0) {
        this.$refs.deviceTools.deleteNodes()
      }
      this.$parent.createDialogVisible = false
      this.$parent.maskloading = false
      this.form.choosedCameras_dialog = ''
      this.camerasArray = []
      this.currentChooseCameras = []
      this.camerasTable = []
      //初始化数据
    },
    //提交创建任务
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let data = []
          data = this.camerasTable.filter(item => !item.templateId)
          if (data.length > 0) {
            this.$message.warning(this.$t('lensTranscodingTask.nochooseTemplate') + '！')
            this.$parent.maskloading = false
            return
          }
          let nodeData = []
          nodeData = this.camerasTable.filter(item => !item.transcodeNode)
          if (nodeData.length > 0) {
            this.$message.warning(this.$t('lensTranscodingTask.noTranscodingNodes') + '！')
            this.$parent.maskloading = false
            return
          }
          this.$api.createCameraTranscodes({ cameraTranscodeList: this.camerasTable }).then(res => {
            if (res.resultCode == 0) {
              this.errorList(res.failList)
              this.$parent.getTranscodeTasks()
              this.$parent.createDialogVisible = false
            }
            this.$parent.maskloading = false
          })
        }
      })
    },
    //错误列表
    errorList(failList) {
      if (failList) {
        this.resultList = failList
        this.allcateErrorDialogVisible = true
      }
    },
    //点击转码节点打开选择弹窗
    getTranscodeNode(row, index) {
      this.rowIndex = index
      this.transcodeNodeInfo = JSON.parse(JSON.stringify(row))
      this.selectState = 1
      this.getNodeArr()
    },
    //获取选择的转码节点
    getNodeItem(nodeItem) {
      this.selectDialogVisible = false
      if (this.selectState == 1) {
        this.camerasTable[this.rowIndex]['transcodeNode'] = nodeItem.nodeIp
        this.camerasTable[this.rowIndex]['transcodeNodeId'] = nodeItem.mediaNodeId
      } else if (this.selectState == 2) {
        if (nodeItem.totalTask - nodeItem.nowTask >= this.multipleSelection.length) {
          this.multipleSelection.forEach(item => {
            item.transcodeNode = nodeItem.nodeIp
            item.transcodeNodeId = nodeItem.mediaNodeId
          })
        } else {
          this.taskNum = nodeItem.totalTask - nodeItem.nowTask
          this.selectNodeTip = true
          for (let i = 0; i < this.taskNum; i++) {
            this.multipleSelection[i]['transcodeNode'] = nodeItem.nodeIp
            this.multipleSelection[i]['transcodeNodeId'] = nodeItem.mediaNodeId
          }
        }
      }
    },
    async getNodeList() {
      let obj = {
        type: 'transcode',
        pageInfo: {
          pageSize: 10,
          pageNum: 1
        },
        searchInfo: {
          nodeIp: ''
        }
      }
      await this.$api.getTranscodeNodes(obj).then(res1 => {
        if (res1.resultCode == 0) {
          this.nodeList = res1.nodes
        }
      })
    },
    //获取当前任务数的转码节点 传递给打开的转码节点窗口
    getNodeArr() {
      this.nodeArr = this.camerasTable.map((item, index) => {
        return item.transcodeNode
      })
      this.selectDialogVisible = true
    },

    getParTranscodeTasks() {
      this.$parent.getTranscodeTasks()
      this.$parent.createDialogVisible = false
    },
    setTemplate() {
      this.selectTemplate = true
    },
    setNodesBtn() {
      this.selectState = 2
      this.transcodeNodeInfo = {
        transcodeNode: ''
      }
      this.getNodeArr()
    },
    handleSelectionChangeNode(val) {
      // 多选控制不同功能按钮
      this.multipleSelection = val
      if (val.length) {
        this.templateBtnShow = false
        this.nodesBtnShow = false
      } else {
        this.templateBtnShow = true
        this.nodesBtnShow = true
      }
    },
    templateconfirm() {
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          if (!this.templateForm.templateId) {
            this.$message.warning(
              this.$t('lensTranscodingTask.pleaseSelectTranscodingTemplate') + '！'
            )
            return
          }
          this.multipleSelection.forEach(item => {
            item.templateId = this.templateForm.templateId
          })
          this.selectTemplate = false
        }
      })
    },
    dialogClosedTemp() {
      this.selectTemplate = false
      this.templateForm.templateId = ''
    },
    dialogOpenTemp() {
      if (this.$refs.templateForm) {
        this.$nextTick(() => {
          this.$refs.templateForm.resetFields()
        })
      }
      this.$nextTick(async () => {
        this.setDialogCss()
      })
    },
    tipsconfirm() {
      this.selectNodeTip = false
    }
  }
}
</script>

<style lang="scss">
.video-preview {
  .el-input__suffix {
    right: 8px;
    top: 8px;
  }
  .el-dialog__body {
    padding: 15px 30px 5px 30px;
    max-height: 70vh;
    .el-radio-button:first-child .el-radio-button__inner {
      border-left: 1px solid #dcdfe6;
    }
    .el-radio-button__inner {
      border: 1px solid #dcdfe6;
      border-left: 0;
    }
    .el-table__empty-text {
      line-height: 300px;
    }
  }
}
</style>
