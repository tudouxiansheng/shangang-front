<template>
  <CusDialog
    :visible="visible"
    @close="handleClose(false)"
    @opened="handleOpened"
    :title="$t('patrol.unusualPatrol')"
    :isDetail="!(info.processMode != '0' && info.processMode != '1')"
  >
    <div class="task-info-content" slot="body">
      <el-tabs v-if="info.processMode == '1'" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('patrol.info')" name="info"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.workOrderInfo')" name="work"></el-tab-pane>
      </el-tabs>
      <div class="task-left" v-if="activeName == 'info'">
        <el-form
          :model="handleForm"
          label-position="right"
          label-suffix="："
          ref="handleForm"
          :rules="rules"
          :label-width="isZh ? '120px' : '150px'"
        >
          <el-form-item :label="$t('patrol.taskNum')">
            <div class="form-value">{{ info.taskChildId }}</div>
          </el-form-item>
          <el-form-item :label="$t('patrol.taskName')" v-if="info.name">
            <div class="form-value">{{ info.name }}</div>
          </el-form-item>
          <el-form-item :label="$t('patrol.route')">
            <div class="form-value">
              <span :title="info.routeName">{{ info.routeName }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.point')">
            <div class="form-value">
              <span :title="info.pointName">{{ info.pointName }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.patrolMan')">
            <div class="form-value">
              <span>{{ info.userName }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.desc')">
            <div>
              <span :title="info.recordDescribe">{{ info.recordDescribe }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.image')">
            <div class="form-value">
              <template v-if="info.fileList && info.fileList.length">
                <div class="img-wrapper" v-viewer>
                  <img
                    class="img-item"
                    v-for="(file, index) in info.fileList"
                    :key="index"
                    :src="file.fileUrl"
                    alt=""
                  />
                </div>
              </template>
              <span v-else>-</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.PunchTime')">
            <div class="form-value">
              <span :title="info.reportTime">{{ info.reportTime }}</span>
            </div>
          </el-form-item>
          <template v-if="info.processMode == '0' || info.processMode == '1'">
            <el-form-item :label="$t('alarm.handleType')">
              <span>{{ info.processMode == '0' ? $t('alarm.handle') : $t('alarm.workOrder') }}</span>
            </el-form-item>
            <template v-if="info.processMode == '1'">
              <el-form-item :label="$t('alarm.workOrderName')">
                <span>{{ workInfo.workSheetName }}</span>
              </el-form-item>
              <el-form-item :label="$t('alarm.workOrderLevel')">
                <span>{{ setAlarmLevel(workInfo.workSheetLevel) }}</span>
              </el-form-item>
            </template>
            <el-form-item :label="handleForm.processMode == 0 ? $t('alarm.proDesc') : $t('alarm.handleContent')">
              <span>{{ workInfo.description }}</span>
            </el-form-item>
          </template>
          <template v-if="info.processMode != '0' && info.processMode != '1' && !workSheetInfoStatus">
            <el-form-item :label="$t('alarm.handleType')" prop="processMode">
              <el-radio-group @change="handleChangeProcessMode" v-model="handleForm.processMode" :disabled="modifyEdit">
                <el-radio :label="0" :disabled="workSheetInfoStatus">{{ $t('alarm.handle') }}</el-radio>
                <el-radio :label="1" :disabled="workSheetInfoStatus">{{ $t('alarm.workOrder') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('alarm.handleContent')" prop="description" v-if="handleForm.processMode == '0'">
              <el-input
                type="textarea"
                v-model.trim="handleForm.description"
                :disabled="modifyEdit"
                :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.handleContent') }) : ''"
              ></el-input>
            </el-form-item>
            <el-row v-if="handleForm.processMode == '1'">
              <el-col :span="12">
                <el-form-item :label="$t('alarm.workOrderName')" prop="workSheetName">
                  <el-input
                    :disabled="modifyEdit"
                    v-model.trim="handleForm.workSheetName"
                    :placeholder="$t('alarm.workOrderName')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('alarm.workOrderLevel')" prop="workSheetLevel">
                  <el-select
                    :disabled="modifyEdit"
                    style="width: 100%"
                    v-model="handleForm.workSheetLevel"
                    :placeholder="$t('public.placeholderSelect', { type: $t('alarm.workOrderLevel') })"
                  >
                    <el-option
                      v-for="(item, index) in alarmLevel"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('alarm.proDesc')" prop="description">
                  <el-input
                    type="textarea"
                    v-model.trim="handleForm.description"
                    :disabled="modifyEdit"
                    :placeholder="!modifyEdit ? '' : $t('public.placeholderEnter', { type: $t('alarm.proDesc') })"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
      </div>
      <div class="work-detail" v-if="activeName == 'work'">
        <div class="work-base-info">
          <div class="item">
            <div class="item-label">{{ $t('alarm.workOrderName') }}</div>
            <div class="item-value">{{ workInfo.workSheetName }}</div>
          </div>
          <div class="item">
            <div class="item-label">{{ $t('work.status') }}</div>
            <div class="item-value" :class="workInfo.state != 3 ? 'red' : 'blue'">
              {{ workInfo.state | formatStatus(that) }}
            </div>
          </div>
          <!-- <div class="item">
              <div class="item-label">{{ $t('work.resource') }}</div>
              <div class="item-value">
                {{ workInfo.resource == 1 ? $t('alarm.alarm') : $t('patrol.task') }}
              </div>
            </div> -->
        </div>
        <el-timeline class="custom-timeline">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            placement="top"
            color="#3696E5"
            hide-timestamp
            :timestamp="activity.timestamp"
          >
            <div class="timeline-status">
              <div class="label">{{ activity.label }}</div>
              <div class="time">{{ activity.time }}</div>
            </div>
            <div class="timeline-content">
              <template v-if="activity.value == 0">
                <div class="timeline-wrapper" v-for="(item, index) in activity.data" :key="index">
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.workLevel') }}</div>
                    <div class="item-value">{{ item.workSheetLevel | formatLevel(that) }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.desc') }}</div>
                    <div class="item-value">{{ item.description }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.creator') }}</div>
                    <div class="item-value">{{ item.distributorName }}</div>
                  </div>
                </div>
              </template>
              <template v-if="activity.value == 1">
                <div class="timeline-wrapper" v-for="(item, index) in activity.data" :key="index">
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.handler') }}</div>
                    <div class="item-value">{{ item.handlerName }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.collaborator') }}</div>
                    <div class="item-value">{{ item.childHandlerNames }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.dispatcher') }}</div>
                    <div class="item-value">{{ item.distributorName }}</div>
                  </div>
                </div>
              </template>
              <template v-if="activity.value == 2">
                <div class="timeline-wrapper" v-for="(item, index) in activity.data" :key="index">
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.handleResult') }}</div>
                    <div class="item-value">{{ item.opinion }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.attachment') }}</div>
                    <div class="item-value">
                      <div
                        class="img-wrapper"
                        v-if="item.childWorkSheetAttachmentList && item.childWorkSheetAttachmentList.length"
                        v-viewer
                      >
                        <template v-for="(file, index) in item.childWorkSheetAttachmentList">
                          <img v-if="file.fileUrl" class="img-item" :key="index" :src="file.fileUrl" alt="" />
                        </template>
                      </div>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.collaborator') }}</div>
                    <div class="item-value">{{ item.childHandlerName }}</div>
                  </div>
                </div>
              </template>
              <template v-if="activity.value == 3">
                <div class="timeline-wrapper" v-for="(item, index) in activity.data" :key="index">
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.handleResult') }}</div>
                    <div class="item-value">{{ item.opinion }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.attachment') }}</div>
                    <div class="item-value">
                      <div
                        class="img-wrapper"
                        v-if="item.childWorkSheetAttachmentList && item.childWorkSheetAttachmentList.length"
                        v-viewer
                      >
                        <img
                          class="img-item"
                          v-for="(file, index) in item.childWorkSheetAttachmentList"
                          :key="index"
                          :src="file.fileUrl"
                          alt=""
                        />
                      </div>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.handler') }}</div>
                    <div class="item-value">{{ item.handlerName }}</div>
                  </div>
                </div>
              </template>
              <template v-if="activity.value == 4">
                <div class="timeline-wrapper" v-for="(item, index) in activity.data" :key="index">
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.auditResult') }}</div>
                    <div class="item-value">{{ item.state == 3 ? $t('work.pass') : $t('work.reject') }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.auditOpinion') }}</div>
                    <div class="item-value">{{ item.suggestion }}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="item-label">{{ $t('work.reviewer') }}</div>
                    <div class="item-value">{{ item.reviewerName }}</div>
                  </div>
                </div>
              </template>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div slot="footer" v-if="info.processMode != '0' && info.processMode != '1'">
      <el-button @click="handleClose(false)">{{ $t('public.cancel') }}</el-button>
      <el-button v-has-permi="[878]" type="primary" @click="handleSubmitAudit">{{ $t('public.submit') }}</el-button>
    </div>
  </CusDialog>
</template>

<script>
import { addWorkSheet, getWorkSheetInfo, viewWorkSheet } from '../../../../../utils/api'

export default {
  name: 'patrolDetail',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      activities1: [],
      rules: {},
      workInfo: {},
      workDetail: {},
      alarmLevel: [
        {
          value: 1,
          label: this.$t('home.level1'),
        },
        {
          value: 2,
          label: this.$t('home.level2'),
        },
        {
          value: 3,
          label: this.$t('home.level3'),
        },
        {
          value: 4,
          label: this.$t('home.level4'),
        },
      ],
      activeName: 'info',
      workSheetInfoStatus: false,
      modifyEdit: false,
      handleForm: {
        workSheetName: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
        description: '',
      },
      that: this,
      workSheetState: [
        {
          value: 0,
          label: this.$t('work.pending'),
        },
        {
          value: 1,
          label: this.$t('work.processed'),
        },
        {
          value: 2,
          label: this.$t('work.audit'),
        },
        {
          value: 3,
          label: this.$t('work.completed'),
        },
      ],
    }
  },
  computed: {
    activities() {
      let arr = []
      if (this.workDetail && Object.keys(this.workDetail).length) {
        arr.push({
          label: this.$t('work.create'),
          value: 0,
          time: this.workDetail.createTime,
          data: [
            {
              workSheetLevel: this.workDetail.workSheetLevel,
              description: this.workDetail.description,
              distributorName: this.workDetail.creatorName,
            },
          ],
        })
        if (this.workDetail.state == 0) {
          //待派发
          arr.push({
            label: this.$t('work.pending'),
            value: -1,
            time: '',
            data: [],
          })
          return arr
        }
        //已派发待处理
        arr.push({
          label: this.$t('work.dispatchWorkOrder'),
          value: 1,
          time: this.workDetail.distributorTime,
          data: [
            {
              handlerName: this.workDetail.handlerName,
              childHandlerNames: this.workDetail.childHandlerNames,
              distributorName: this.workDetail.distributorName,
            },
          ],
        })
        if (this.workDetail.childWorkSheetInfoList && this.workDetail.childWorkSheetInfoList.length) {
          let childWorkSheetInfoList = this.workDetail.childWorkSheetInfoList
          childWorkSheetInfoList.map((item, index) => {
            console.log(item.state)
            if (item.childHandlerName) {
              //回复工单
              arr.push({
                label: this.$t('work.replyWorkOrder'),
                value: 2,
                time: item.createTime,
                data: [
                  {
                    opinion: item.opinion,
                    childHandlerName: item.childHandlerName,
                    childWorkSheetAttachmentList: item.childWorkSheetAttachmentList, //附件
                  },
                ],
              })
              if (this.workDetail.state == 1 && childWorkSheetInfoList.length - 1 == index) {
                arr.push({
                  label: this.$t('work.processed'),
                  value: -1,
                  time: '',
                  data: [],
                })
                return arr
              }
            } else {
              //处理工单
              arr.push({
                label: this.$t('work.workOrderProcessing'),
                value: 3,
                time: item.createTime,
                data: [
                  {
                    opinion: item.opinion,
                    handlerName: item.handlerName,
                    childWorkSheetAttachmentList: item.childWorkSheetAttachmentList, //附件
                  },
                ],
              })
            }
            if (item.state == 4 || item.state == 3) {
              //工单驳回
              arr.push({
                label: this.$t('work.workOrderVerify'),
                value: 4,
                time: item.updateTime,
                data: [
                  {
                    suggestion: item.suggestion,
                    state: item.state,
                    reviewerName: item.reviewerName,
                  },
                ],
              })
              if (this.workDetail.state == 1 && childWorkSheetInfoList.length - 1 == index) {
                arr.push({
                  label: this.$t('work.processed'),
                  value: -1,
                  time: '',
                  data: [],
                })
                return arr
              }

              if (item.state == 3) {
                arr.push({
                  label: this.$t('work.completed'),
                  value: -1,
                  time: '',
                  data: [],
                })
                return arr
              }
            }
          })
        } else {
          arr.push({
            label: this.$t('work.processed'),
            value: -1,
            time: '',
            data: [],
          })
          return arr
        }
        if (this.workInfo.state == 2) {
          arr.push({
            label: this.$t('work.audit'),
            value: -1,
            time: '',
            data: [],
          })
          return arr
        }
      }
      console.log(arr)
      return arr
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  filters: {
    formatStatus(val, that) {
      let temp = that.workSheetState.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
    formatLevel(val, that) {
      let temp = that.alarmLevel.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
  },
  methods: {
    handleWorkDetail(item) {
      let params = {
        workSheetId: item.id,
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      viewWorkSheet(params)
        .then((res) => {
          loading.close()
          this.workDetail = { ...res.workSheetInfo }
        })
        .catch(() => {
          loading.close()
        })
    },
    setAlarmLevel(val) {
      switch (val) {
        case 1:
          return this.$t('home.level1')
        case 2:
          return this.$t('home.level2')
        case 3:
          return this.$t('home.level3')
        case 4:
          return this.$t('home.level4')
      }
    },
    handleOpened() {
      // this.workSheetInfoStatus = false
      // this.modifyEdit = false
      // this.activeName = 'info'
      if (this.info.processMode != '1' && this.info.processMode != '0' && this.info.state == 0) {
        this.workSheetInfoStatus = false
        this.setFormRules()
      } else {
        //已处理查询
        console.log(this.info)
        this.fetchWorkSheetInfo()
      }
      this.$refs.handleForm.clearValidate()
    },
    //获取复工单详情
    fetchWorkSheetInfo() {
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      getWorkSheetInfo({
        eventId: this.info.id,
      })
        .then((res) => {
          this.$refs.handleForm.clearValidate()
          loading.close()
          if (res.workSheetInfo) {
            this.workSheetInfoStatus = true
            this.workInfo = { ...res.workSheetInfo }
            this.modifyEdit = true
            this.$refs.handleForm.resetFields()
          } else {
            this.setFormRules()
            this.$refs.handleForm.clearValidate()
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    handleSubmitAudit() {
      //直接处理
      if (Number(this.handleForm.processMode) == 0) {
        let params = {
          processMode: Number(this.handleForm.processMode),
          eventId: this.info.id,
          workSheetType: 0,
          description: this.handleForm.description,
          resource: 0,
        }
        this.$refs.handleForm.validate((valid) => {
          if (valid) {
            addWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.$emit('handleRight')
              }
            })
          }
        })
      }
      //转工单
      if (Number(this.handleForm.processMode) == 1) {
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            let params = {
              processMode: 1,
              resource: 0,
              eventId: this.info.id,
              eventTime: this.info.reportTime,
              workSheetName: this.handleForm.workSheetName,
              workSheetType: 0,
              workSheetLevel: this.handleForm.workSheetLevel,
              description: this.handleForm.description,
            }
            addWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.$emit('handleRight')
              }
            })
          }
        })
      }
    },
    handleChangeProcessMode(val) {
      this.$set(this.handleForm, 'workSheetName', '')
      this.$set(this.handleForm, 'workSheetLevel', '')
      this.$set(this.handleForm, 'description', '')
    },
    handleClick() {
      if (this.activeName == 'work') {
        this.handleWorkDetail(this.workInfo)
      } else {
        this.fetchWorkSheetInfo()
      }
    },
    setFormRules() {
      this.rules = {
        workSheetName: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('public.placeholderEnter', { type: this.$t('alarm.workOrderName') }),
          },
          {
            max: 30,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.workOrderName'), size: 30 }),
          },
        ],
        workSheetLevel: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('public.placeholderSelect', { type: this.$t('alarm.workOrderLevel') }),
          },
        ],
        description: [
          {
            max: 100,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.proDesc'), size: 100 }),
          },
        ],
        remark: [
          {
            max: 100,
            trigger: 'blur',
            message: this.$t('tips.size', { type: this.$t('alarm.proDesc'), size: 100 }),
          },
        ],
        startTime: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('public.startTime') }),
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('public.endTime') }),
            // validator: this.pickerOptionsEnd,
            trigger: 'change',
          },
        ],
      }
    },
    handleFormatStatus(status) {
      const statusDict = {
        1: this.$t('patrol.notStarted'),
        2: this.$t('patrol.execution'),
        3: this.$t('patrol.executed'),
        4: this.$t('patrol.expired'),
        5: this.$t('patrol.undone'),
      }
      return statusDict[status]
    },
    handleClose(type) {
      // this.$refs.handleForm.resetFields()
      this.handleForm = {
        workSheetName: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
        description: '',
      }
      this.workSheetInfoStatus = false
      this.modifyEdit = false
      this.activeName = 'info'
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.work-detail {
  padding: 0 30px;
  box-sizing: border-box;
  height: 500px;
  .work-base-info {
    .item {
      display: flex;
      margin-bottom: 10px;
      .red {
        color: #ff4d4f;
      }
      .blue {
        color: #17cd57;
      }
      .item-label {
        margin-right: 5px;
        white-space: nowrap;
        &:after {
          content: '：';
        }
      }
      .item-value {
      }
    }
  }
}
.timeline-wrapper {
  margin-top: 20px;
  font-size: 12px;
}
.timeline-item {
  display: flex;
  margin-bottom: 10px;
  .item-label {
    white-space: nowrap;
    color: #ddd;
    &:after {
      content: '：';
    }
  }
  .item-value {
    //overflow: hidden;
    //white-space: nowrap;
    ///*文字超出宽度则显示ellipsis省略号*/
    //text-overflow: ellipsis;
  }
}
.custom-timeline {
  margin-top: 30px;
  margin-bottom: 30px;
  max-height: 380px;
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
  ::v-deep.el-timeline-item {
    .el-timeline-item__content {
      color: #fff;
    }
  }
  .timeline-status {
    color: #909399;
    display: flex;
    font-size: 14px;
    .time {
      margin-left: 30px;
    }
  }
}
.img-wrapper {
  display: flex;
  margin: 10px 0;
  .img-item {
    width: 120px;
    height: 120px;
    margin-right: 30px;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.dialog-title {
  color: #0cd8fa;
  font-size: 18px;
  padding-top: 10px;
  box-sizing: border-box;
}
.form-value {
  overflow: hidden;
  white-space: nowrap;
  /*文字超出宽度则显示ellipsis省略号*/
  text-overflow: ellipsis;
  span {
    overflow: hidden;
    white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
  }
}
::v-deep.el-tabs {
  .el-tabs__nav-wrap {
    &::after {
      display: none;
      height: 1px;
    }
  }
}
::v-deep.el-textarea {
  .el-textarea__inner {
    background-color: transparent;
    border-color: #1f60a3;
    color: #fff;
    resize: none;
  }
  &.is-disabled .el-textarea__inner {
    border-color: #e4e7ed;
  }
}
.task-info-content {
  color: #fff;
  display: flex;
  padding: 20px 30px;
  flex-direction: column;
  box-sizing: border-box;
  .task-left {
    flex: 2;
    overflow: hidden;
    padding-right: 10px;
  }
  .task-process {
    flex: 3;
    padding-left: 15px;
  }
}
.timeline-wrapper {
  margin-top: 20px;
  font-size: 12px;
}
.timeline-item {
  display: flex;
  margin-bottom: 10px;
  .item-label {
    white-space: nowrap;
    color: #ddd;
    &:after {
      content: '：';
    }
  }
  .item-value {
    //overflow: hidden;
    //white-space: nowrap;
    ///*文字超出宽度则显示ellipsis省略号*/
    //text-overflow: ellipsis;
  }
}
.custom-timeline {
  margin-top: 30px;
  margin-bottom: 30px;
  max-height: 380px;
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
  ::v-deep.el-timeline-item {
    .el-timeline-item__content {
      color: #fff;
    }
  }
  .timeline-status {
    color: #909399;
    display: flex;
    font-size: 14px;
    .time {
      margin-left: 30px;
    }
  }
}
.work-detail {
  padding: 0 30px;
  box-sizing: border-box;
  .work-base-info {
    .item {
      display: flex;
      margin-bottom: 10px;
      .red {
        color: #ff4d4f;
      }
      .blue {
        color: #17cd57;
      }
      .item-label {
        margin-right: 5px;
        white-space: nowrap;
        &:after {
          content: '：';
        }
      }
      .item-value {
      }
    }
  }
}
</style>
