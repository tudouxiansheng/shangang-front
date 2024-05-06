<template>
  <!--告警事件弹窗-->
  <CusDialog
    :title="$t('alarm.detail')"
    @close="allfalse"
    @open="diaOpen"
    :visible="visible"
    defaultBgc="bigBgc"
    :width="1100"
    :isDetail="modifyEdit"
    appendToBody
  >
    <div slot="body">
      <div class="pDiv" style="position: relative">
        <div class="content" style="display: flex">
          <!-- v-if="!['ALARM_QUEUE_LENGTH', 'LINE_CROSSING_STATISTICS', 'CROWD_DENSITY'].includes(infoObj.alarmType)" -->
          <div class="video myContent" v-if="!!infoObj.alarmSnapUrl">
            <div
              class="compared-wrapper"
              v-if="
                [
                  'BLACKLISTED_VEHICLE_ALERT',
                  'BLACKLIST_PERSONNEL_ALERT',
                  'WHITELIST_PERSONNEL_ALERT',
                  'STRANGER_ALERT',
                  'ALARM_CAPTURE_ALARM',
                ].indexOf(infoObj.alarmType) != -1
              "
            >
              <div class="compared-item">
                <div class="compared-title">{{ $t('alarm.snapshot') }}</div>
                <div class="img">
                  <img
                    class="alarmImg"
                    v-if="['ALARM_CAPTURE_ALARM'].includes(infoObj.alarmType)"
                    v-viewer
                    :src="infoObj.facePhoto"
                    alt=""
                  />
                  <img class="alarmImg" v-else v-viewer :src="infoObj.detectImage" alt="" />
                </div>
              </div>
              <div class="compared-item">
                <div class="compared-title">{{ $t('alarm.controlPicture') }}</div>
                <div class="img">
                  <template v-if="!['ALARM_CAPTURE_ALARM'].includes(infoObj.alarmType)">
                    <img class="alarmImg" v-if="!!infoObj.facePhoto" v-viewer :src="infoObj.facePhoto" alt="" />
                    <img class="alarmImg" v-else :src="noImg" alt="" />
                  </template>
                </div>
              </div>
            </div>
            <div class="snap-wrapper">
              <div class="compared-title">{{ $t('alarm.panorama') }}</div>
              <div class="img">
                <img class="alarmImg" v-viewer :src="infoObj.captureImage" alt="" />
              </div>
            </div>
          </div>
          <div class="alarm-detail">
            <ul class="change-tab">
              <li @click="handleChangeTab(1)" :class="showTab == 1 ? 'active' : ''" class="compared-title">
                {{ $t('application.alarmInfo') }}
              </li>
              <li
                v-if="handleForm.processMode == 1 && workSheetInfoStatus"
                @click="handleChangeTab(2)"
                :class="showTab == 2 ? 'active' : ''"
                class="compared-title"
              >
                {{ $t('work.workOrderInfo') }}
              </li>
            </ul>
            <template v-if="showTab == 1">
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmType') }}：</span>
                <!-- 告警中心的 -->
                <span class="value">{{ isZh ? infoObj.alarmName : infoObj.alarmType }}</span>
              </div>
              <!-- 排队长度 字段-->
              <template v-if="['ALARM_QUEUE_LENGTH'].includes(infoObj.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.queueLength') }}：</span>
                  <span class="value">{{ infoObj.situationAnalysis }}{{ $t('home.person') }}</span>
                </div>
              </template>
              <!-- 过线统计 字段 -->
              <template v-if="['LINE_CROSSING_STATISTICS'].includes(infoObj.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.lineEntry') }}：</span>
                  <span class="value">{{ infoObj.situationAnalysis.split('-')[0] }}{{ $t('home.person') }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.lineLeave') }}：</span>
                  <span class="value">{{ infoObj.situationAnalysis.split('-')[1] }}{{ $t('home.person') }}</span>
                </div>
              </template>
              <!-- 告警人员抓拍 字段-->
              <template v-if="['ALARM_CAPTURE_ALARM'].includes(infoObj.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('traffic.name') }}：</span>
                  <span class="value">{{ infoObj.personName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('public.similarity') }}：</span>
                  <span class="value">{{ getSimilarity(infoObj.similarity) }}</span>
                </div>
              </template>
              <!-- 人群密度 字段-->
              <template v-if="['CROWD_DENSITY'].includes(infoObj.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.areaDetection') }}：</span>
                  <span class="value">{{ infoObj.situationAnalysis }}{{ $t('home.person') }}</span>
                </div>
              </template>

              <!-- 告警人员告警 字段 -->
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmSource') }}：</span>
                <span class="value">{{ isZh ? infoObj.alarmGroupName : infoObj.alarmGroupNameEn }}</span>
              </div>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmLevel') }}：</span>
                <div class="value" :class="setLevelClass(infoObj.alarmLevel)">
                  {{ setAlarmLevel(infoObj.alarmLevel) }}
                </div>
              </div>
              <!-- 黑白名单人员 字段 -->
              <template
                v-if="
                  infoObj.alarmType == 'BLACKLIST_PERSONNEL_ALERT' ||
                  infoObj.alarmType == 'WHITELIST_PERSONNEL_ALERT' ||
                  infoObj.alarmType == 'STRANGER_ALERT'
                "
              >
                <div class="title">
                  <span class="blueSpan">{{ $t('home.name') }}：</span>
                  <span class="value">{{ infoObj.personName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.library') }}：</span>
                  <span class="value" :title="infoObj.repositoryName">{{ infoObj.repositoryName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.personType') }}：</span>
                  <!-- v-if="[2, 3, 4].includes(infoObj.repositoryType)" -->
                  <span class="value">{{ getRepositoryType(infoObj.repositoryType) }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('public.similarity') }}：</span>
                  <span
                    class="value"
                    v-if="infoObj.similarity && infoObj.similarity != 'null' && infoObj.similarity != '0.0'"
                    >{{ (infoObj.similarity * 1).toFixed(2) }}%</span
                  >
                </div>
              </template>
              <!-- 黑名单车辆 字段 -->
              <template v-else-if="infoObj.alarmType == 'BLACKLISTED_VEHICLE_ALERT'">
                <div class="title">
                  <span class="blueSpan">{{ $t('application.plateNum') }}：</span>
                  <span class="value">{{ infoObj.lpn ? infoObj.lpn : $t('public.unknown') }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.library') }}：</span>
                  <span class="value">{{ infoObj.repositoryName }}</span>
                </div>
              </template>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmTime') }}：</span>
                <span class="value">{{ infoObj.hitTime }}</span>
              </div>
              <!-- 公共字段 -->
              <div class="title">
                <span class="blueSpan">{{ $t('application.deviceName') }}：</span>
                <span class="value" :title="infoObj.deviceName">{{ infoObj.deviceName }}</span>
              </div>
              <div class="title">
                <span class="blueSpan">{{ $t('application.devicePos') }}：</span>
                <span class="value" :title="infoObj.installLocate || infoObj.installLocation">{{
                  infoObj.installLocate || infoObj.installLocation || $t('public.unknown')
                }}</span>
              </div>
              <!--  -->
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmStatus') }}：</span>
                <span class="value" :class="infoObj.confirmState == 0 ? 'red' : 'blue'">
                  {{ infoObj.confirmState == 0 ? $t('home.noHandle') : $t('home.handled') }}
                </span>
              </div>
              <div class="bottom-tools" v-if="infoObj.scene !== 'video_quality_alarm'">
                <div class="replay" @click="goToVideo(infoObj)">
                  <span style="display: flex; align-items: center">
                    <img src="../../../../../assets/alarmImg/录像.png" alt />
                    {{ $t('application.alarmVideo') }}
                  </span>
                </div>
                <!-- <div v-if="false" class="live" @click="goToLive(infoObj)">
                                    <span style="display: flex; align-items: center">
                                        <img src="../../../../../assets/alarmImg/实况.png" alt />
                                        {{ $t('application.live') }}
                                    </span>
                                </div> -->
              </div>
            </template>
            <div v-else class="work-detail">
              <div class="work-base-info">
                <div class="item">
                  <div class="item-label">{{ $t('alarm.workOrderName') }}</div>
                  <div class="item-value" :title="info.workSheetName">{{ info.workSheetName }}</div>
                </div>
                <div class="item">
                  <div class="item-label">{{ $t('work.status') }}</div>
                  <div class="item-value" :class="info.state != 3 ? 'red' : 'blue'">
                    {{ info.state | formatStatus(that) }}
                  </div>
                </div>
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
                          <div class="item-value">
                            {{ item.workSheetLevel | formatLevel(that) }}
                          </div>
                        </div>
                        <div class="timeline-item">
                          <div class="item-label">{{ $t('work.desc') }}</div>
                          <div class="item-value" :title="item.description">
                            {{ item.description }}
                          </div>
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
                          <div class="item-value" :title="item.opinion">
                            {{ item.opinion }}
                          </div>
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
                          <div class="item-value" :title="item.opinion">
                            {{ item.opinion }}
                          </div>
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
                          <div class="item-value">
                            {{ item.state == 3 ? $t('work.pass') : $t('work.reject') }}
                          </div>
                        </div>
                        <div class="timeline-item">
                          <div class="item-label">{{ $t('work.auditOpinion') }}</div>
                          <div class="item-value" :title="item.suggestion">
                            {{ item.suggestion }}
                          </div>
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
        </div>
        <template v-if="isHandle">
          <div class="detail-title">
            <div class="blueSpan">{{ $t('alarm.alarmHandling') }}</div>
          </div>
          <div class="handle-wrapper">
            <el-form
              ref="handleForm"
              :rules="rules"
              :model="handleForm"
              label-suffix=":"
              :label-width="isZh ? '100px' : '150px'"
            >
              <el-form-item :label="$t('alarm.handleType')">
                <el-radio-group
                  @change="handleChangeProcessMode"
                  v-model="handleForm.processMode"
                  :disabled="modifyEdit"
                >
                  <el-radio :label="0" :disabled="workSheetInfoStatus">{{ $t('alarm.handle') }}</el-radio>
                  <el-radio :label="1" :disabled="workSheetInfoStatus">{{ $t('alarm.workOrder') }}</el-radio>
                  <el-radio :label="-1" :disabled="workSheetInfoStatus">{{ $t('alarm.mistake') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('alarm.proDesc')" prop="remark" v-if="handleForm.processMode == -1">
                <el-input
                  type="textarea"
                  v-model="handleForm.remark"
                  :disabled="modifyEdit"
                  :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.proDesc') }) : ''"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('alarm.handleContent')" prop="description" v-if="handleForm.processMode == 0">
                <el-input
                  type="textarea"
                  v-model.trim="handleForm.description"
                  :disabled="modifyEdit"
                  :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.handleContent') }) : ''"
                ></el-input>
              </el-form-item>
              <el-row v-if="handleForm.processMode == 1">
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
                      :placeholder="modifyEdit ? '' : $t('public.placeholderEnter', { type: $t('alarm.proDesc') })"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
      </div>
    </div>

    <div class="bottom-tools" slot="footer" style="justify-content: center" v-if="!modifyEdit && isHandle">
      <div class="btn cancel" @click="allfalse">{{ $t('public.cancel') }}</div>
      <div
        class="btn"
        @click="submitEventDetail"
        :disabled="workSheetInfoStatus"
        :class="[workSheetInfoStatus ? 'disabled' : '']"
      >
        {{ $t('public.submit') }}
      </div>
    </div>
  </CusDialog>
</template>

<script>
import {
  addWorkSheet,
  getWorkSheetInfo,
  checkAlarmReport,
  viewWorkSheet,
  confirmEcsAlarm,
} from '../../../../../utils/api'
import Dayjs from '../../../../../utils/Dayjs'
import { permissions } from '../../../../../utils/permissions'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  props: ['infoObj', 'visible'],
  mixins: [VideoScreen],
  watch: {
    infoObj(val) {
      console.log(val)
      this.$set(this.handleForm, 'processMode', 0)
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
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    iconSty(item) {
      return (item) => {
        if (item.alarmType == 'ALARM_SMOKE_ALARM') {
          return '烟雾'
        } else if (item.alarmType == 'ALARM_GAS_DETECTION') {
          return '燃气'
        } else if (item.alarmType == 'ALARM_PERIMETER_INVASION') {
          return '巡更'
        } else {
          return 'noLogo'
        }
      }
    },
    isAlarm() {
      if (this.$route.path == '/alarmpage') {
        return false
      }
      return true
    },
    activities() {
      let arr = []
      if (this.info && Object.keys(this.info).length) {
        arr.push({
          label: this.$t('work.create'),
          value: 0,
          time: this.info.createTime,
          data: [
            {
              workSheetLevel: this.info.workSheetLevel,
              description: this.info.description,
              distributorName: this.info.creatorName,
            },
          ],
        })
        if (this.info.state == 0) {
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
          time: this.info.distributorTime,
          data: [
            {
              handlerName: this.info.handlerName,
              childHandlerNames: this.info.childHandlerNames,
              distributorName: this.info.distributorName,
            },
          ],
        })
        if (this.info.childWorkSheetInfoList && this.info.childWorkSheetInfoList.length) {
          let childWorkSheetInfoList = this.info.childWorkSheetInfoList
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
              if (this.info.state == 1 && childWorkSheetInfoList.length - 1 == index) {
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
              if (this.info.state == 1 && childWorkSheetInfoList.length - 1 == index) {
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
        if (this.info.state == 2) {
          arr.push({
            label: this.$t('work.audit'),
            value: -1,
            time: '',
            data: [],
          })
          return arr
        }
      }
      return arr
    },
  },
  data() {
    return {
      info: {},
      that: this,
      isHandle: true,
      showTab: 1,
      handleType: 1,
      handleForm: {
        workSheetName: '',
        handlerName: '',
        longtitude: '',
        latitude: '',
        submitTime: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
        startTime: '',
        endTime: '',
        description: '',
      },
      wordOrderoptions: [
        {
          value: 0,
          label: '巡逻',
        },
      ],
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
      rules: {},
      pageNum: 1,
      pageSize: 50,
      workSheetInfoStatus: false,
      modifyEdit: false,
      pickerOptionsEnd: {
        disabledDate: (time) => {
          let beginDateVal = this.handleForm.startTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          } else {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        },
      },
      noImg: require('@/assets/alarmImg/nosnap.png'),
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {},
  methods: {
    //用户权限判断
    async getPermissions() {
      this.isHandle = await permissions(873) //处理权限
    },
    diaOpen() {
      if (this.infoObj.confirmState == 3) {
        this.workSheetInfoStatus = true
        console.log(this.handleForm)
        this.handleForm.processMode = -1
        if (this.infoObj.remark) {
          this.handleForm.remark = this.infoObj.remark
        }

        this.modifyEdit = true
        this.$refs.handleForm.resetFields()
      } else {
        this.workSheetInfoStatus = false
        this.modifyEdit = false
        this.fetchWorkSheetInfo()
      }
    },
    handleChangeTab(tab) {
      if (tab == 2) {
        let params = {
          workSheetId: this.handleForm.id,
        }
        viewWorkSheet(params).then((res) => {
          this.info = { ...res.workSheetInfo }
          console.log(res)
        })
      }
      this.showTab = tab
    },
    handleChangeProcessMode(val) {
      this.$set(this.handleForm, 'workSheetName', '')
      this.$set(this.handleForm, 'workSheetLevel', '')
      this.$set(this.handleForm, 'description', '')
      if (val == 1) {
        //获取处理人列表
        this.$refs.handleForm.clearValidate()
      }

      console.log(val)
    },
    // handleGoAlarmCenter(deviceId) {
    //   this.$router.push({
    //     path: 'alarmpage',
    //     query: {
    //       deviceId,
    //     },
    //   })
    //   this.allfalse()
    // },
    submitEventDetail() {
      console.log(this.infoObj)
      //误报
      if (this.handleForm.processMode == -1) {
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            let params = {
              alarmId: this.infoObj.alarmId,
              alarmTime: this.infoObj.alarmTime,
              confirmState: 3,
              remark: this.handleForm.remark,
            }
            confirmEcsAlarm(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.allfalse()
                this.$store.commit('commitPtrolTab', 0)
                this.$refs.handleForm.resetFields()
                this.$emit('handleRight')
              }
            })
          }
        })

        return
      }
      //转工单
      if (Number(this.handleForm.processMode) == 1) {
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            let params = {
              processMode: 1,
              resource: 1,
              eventId: this.infoObj.alarmId,
              eventTime: this.infoObj.alarmTime,
              workSheetName: this.handleForm.workSheetName,
              workSheetType: 1,
              workSheetLevel: this.handleForm.workSheetLevel,
              description: this.handleForm.description,
              site: this.infoObj.installLocation,
            }
            addWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.workSheetInfoStatus = true
                this.allfalse()
                this.$store.commit('commitPtrolTab', 0)
                this.$refs.handleForm.resetFields()
                this.$emit('handleRight')
              }
            })

            // let obj = {
            //   alarmId: this.infoObj.alarmId,
            //   alarmGroupType: this.infoObj.alarmGroup,
            //   cameraId: this.infoObj.deviceId,
            //   alarmTime: this.infoObj.alarmTime,
            //   checkResult: 2, //正检2
            // }
            // checkAlarmReport(obj).then((res) => {
            //   if (res.resultCode == 0) {
            //
            //   }
            // })
          }
        })
      }

      //直接处理
      if (Number(this.handleForm.processMode) == 0) {
        this.handleForm.processMode = Number(this.handleForm.processMode)
        this.handleForm.eventId = this.infoObj.alarmId
        this.handleForm.workSheetType = 1
        this.handleForm.eventTime = this.infoObj.alarmTime
        this.$refs.handleForm.validate((valid) => {
          if (valid) {
            addWorkSheet({
              resource: 1,
              ...this.handleForm,
            }).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.allfalse()
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.$store.commit('commitPtrolTab', 0)
                this.$emit('handleRight')
              }
            })
            // let obj = {
            //   alarmId: this.infoObj.alarmId,
            //   alarmGroupType: this.infoObj.alarmGroup,
            //   cameraId: this.infoObj.deviceId,
            //   alarmTime: this.infoObj.alarmTime,
            //   checkResult: 1,
            // }
            // checkAlarmReport(obj).then((res) => {
            //   if (res.resultCode == 0) {
            //
            //   }
            // })
          }
        })
      }
    },
    changeStartTime(val) {
      // console.log(val);
      // this.handleForm.startTime = getFormatDate(val);
    },
    // 改变结束时间
    changeEndTime() {
      let now = new Date().valueOf()
      if (now > this.handleForm.endTime) {
        this.handleForm.endTime = new Date().valueOf() + 86400000
      }
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
        eventId: this.infoObj.alarmId,
      })
        .then((res) => {
          this.$refs.handleForm.clearValidate()
          loading.close()
          if (res.workSheetInfo) {
            // this.getUserTreeList()
            this.workSheetInfoStatus = true
            this.handleForm = { ...res.workSheetInfo }
            console.log(this.handleForm)
            this.$store.commit('parentInfo', res.workSheetInfo)
            this.handleForm.processMode = res.workSheetInfo.processMode
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
        workSheetType: [
          {
            required: true,
            trigger: 'change',
            message: '工单类型必选',
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
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
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
    setCheckState(val) {
      switch (val) {
        case 0:
          return '未处理'
        case 1:
          return '进行中'
        default:
          return '已处理'
      }
    },
    getRepositoryType(val) {
      if (val == 2) return this.$t('application.blacklist')
      if (val == 3) return this.$t('application.whitelist')
      if (val == 4) return this.$t('application.strangerList')
    },
    //关闭第一页告警
    allfalse() {
      this.resetAll()
      this.$store.commit('alarmPage', 0)
      console.log(this.$store.state.alarmpage, 'alarmpage')
      //首页的关闭弹窗
      this.showTab = 1
      this.$emit('closeIcon', 1)
    },
    //点击处理
    clickDeal(alarmId) {
      console.log('处理弹窗')
      console.log(alarmId)
      this.$store.commit('alarmPage', 2)
      this.$store.commit('alarmEventId', alarmId)
      //首页的关闭弹窗
      this.$emit('closeIcon', 0)
    },
    /**
     * utils
     */
    getSimilarity(item) {
      if (!item) return ''
      const res = item === '0.0' ? ' ' : infoObj.similarity + '%'
      return res
    },
    // 清除所有
    resetAll() {
      this.close_sdk_video(this.infoObj.deviceId)
      this.info = {}
      this.workSheetInfoStatus = false
      this.modifyEdit = false
      this.handleForm = {}
    },
  },
}
</script>

<style lang="scss" scoped>
.img-wrapper {
  display: flex;
  margin: 10px 0;
  .img-item {
    width: 100px;
    height: 100px;
    margin-right: 20px;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
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
    overflow: hidden;
    //white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
  }
}
.custom-timeline {
  margin-top: 30px;
  max-height: 300px;
  overflow: auto;
  padding-left: 10px;
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
  padding: 0;
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
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
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

.mywrapper {
  display: flex;
  .handle-select {
    flex: 1;
  }
  .add {
    margin-left: 10px;
    color: #1fbaf2;
    cursor: pointer;
  }
  .delete {
    margin-left: 10px;
    color: rgba(241, 49, 49, 0.75);
    cursor: pointer;
  }
}
.handle-wrapper {
  padding-right: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .title {
    display: flex;
  }
}
.detail-title {
  height: 30px;
  line-height: 30px;
  position: relative;
  margin-top: 10px;
  color: #fff;
  font-size: 16px;
}
.bottom-tools {
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .btn {
    cursor: pointer;
    padding: 10px 25px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #1fbaf2;
    color: #fff;
    font-size: 14px;
    margin-right: 15px;
    border: 1px solid #1fbaf2;
    &.cancel {
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
  }
  .live {
    margin-left: 30px;
    cursor: pointer;
    padding: 8px 25px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #1fbaf2;
    color: #fff;
    font-size: 14px;
    img {
      width: 22px;
      margin-right: 5px;
    }
  }
  .replay {
    cursor: pointer;
    padding: 8px 15px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #1fbaf2;
    img {
      width: 22px;
      margin-right: 5px;
    }
  }
}
.pDiv {
  color: #edf6f7;
  margin-left: 20px;
  // padding-top: 10px;
  padding-right: 20px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  box-sizing: border-box;
  // max-height: 650px;
  // overflow: auto;

  .content {
    // margin-top: 30px;
    height: 100%;
    .title {
      margin-bottom: 12px;
      display: flex;
      .red {
        color: #ff4d4f;
      }
      .blue {
        color: #17cd57;
      }
      .value {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
    }
    .rangeJ {
      display: inline-block;
      // width: 48px;
      height: 26px;
      // border: 1px solid #ff0000;
      border-radius: 4px;
      text-align: center;
      line-height: 26px;
      // color: #ff0000;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 14px;
    }
  }
  .blueSpan {
    color: #1efffc;
    white-space: nowrap;
  }
  .level1 {
    color: #ff4d4f;
  }
  .level2 {
    color: #ff4e00;
  }
  .level3 {
    color: #ffa900;
  }
  .level4 {
    color: #00ccff;
  }
}
.alarm-detail {
  margin-left: 25px;
  flex: 1;
  overflow: hidden;
  .change-tab {
    display: flex;
    li {
      margin-right: 30px;
      color: #b3b3b3;
      cursor: pointer;
      &.active {
        color: #fff;
      }
    }
  }
  .compared-title {
    margin-bottom: 15px;
    font-size: 16px;
  }
}
.myContent {
  max-width: 450px;
  //height: 320px;
  //background: #dff8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  .compared-wrapper {
    display: flex;
    height: 130px;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
    .img {
      width: 100%;
      height: calc(100% - 20px);
      background-color: #c2c2c5;
      border-radius: 4px;
    }
    .compared-item {
      width: 48%;
      font-size: 16px;
      .compared-title {
        margin-bottom: 10px;
      }
    }
  }
  .snap-wrapper {
    font-size: 16px;
    width: 100%;
    .img {
      width: 100%;
      height: 305px;
      background-color: #ccc;
      border-radius: 4px;
      overflow: hidden;
    }
    .compared-title {
      margin-bottom: 10px;
    }
  }
  .alarmImg {
    display: block;
    position: relative;
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
