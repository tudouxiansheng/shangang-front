<template>
  <div>
    <CusDialog :visible="visible" @close="handleClose(false)" defaultBgc="bigBgc" :isDetail="hasOption">
      <el-tabs slot="title" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('work.workOrderDetail')" name="work"></el-tab-pane>
        <el-tab-pane v-if="info.resource == 1" :label="$t('work.alarmInfo')" name="alarm"></el-tab-pane>
        <el-tab-pane v-if="info.resource == 0" :label="$t('patrol.info')" name="patrol"></el-tab-pane>
      </el-tabs>
      <div slot="body" class="content">
        <div class="work-detail" v-if="activeName == 'work'">
          <div class="work-base-info">
            <div class="item">
              <div class="item-label">{{ $t('alarm.workOrderName') }}</div>
              <div class="item-value">{{ info.workSheetName }}</div>
            </div>
            <div class="item">
              <div class="item-label">{{ $t('work.status') }}</div>
              <div class="item-value" :class="info.state != 3 ? 'red' : 'blue'">
                {{ info.state | formatStatus(that) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">{{ $t('work.resource') }}</div>
              <div class="item-value">
                {{ info.resource == 1 ? $t('alarm.alarm') : $t('patrol.task') }}
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
        <div class="alarm-info" v-if="activeName == 'alarm'">
          <div class="alarm-info-content">
            <!-- 如果是人群密度,排队长度，过线统计3种态势，则不展示图片 -->
            <!-- v-if="!['LINE_CROSSING_STATISTICS', 'ALARM_QUEUE_LENGTH', 'CROWD_DENSITY'].includes(alarmInfo.alarmType)" -->
            <div class="video myContent" v-if="!!(alarmInfo.captureImage || alarmInfo.alarmSnapUrl)">
              <div
                class="compared-wrapper"
                v-if="
                  [
                    'BLACKLISTED_VEHICLE_ALERT',
                    'BLACKLIST_PERSONNEL_ALERT',
                    'WHITELIST_PERSONNEL_ALERT',
                    'STRANGER_ALERT',
                  ].indexOf(alarmInfo.alarmType) != -1
                "
              >
                <div class="compared-item">
                  <div class="compared-title">{{ $t('alarm.snapshot') }}</div>
                  <div class="img">
                    <img v-if="alarmInfo.detectImage" class="alarmImg" v-viewer :src="alarmInfo.detectImage" alt="" />
                  </div>
                </div>
                <div class="compared-item">
                  <div class="compared-title">{{ $t('alarm.controlPicture') }}</div>
                  <div class="img">
                    <img v-if="alarmInfo.facePhoto" class="alarmImg" v-viewer :src="alarmInfo.facePhoto" alt="" />
                  </div>
                </div>
              </div>
              <!-- NVR800只有全景图 -->
              <div class="snap-wrapper">
                <div class="compared-title">{{ $t('alarm.panorama') }}</div>
                <div class="img">
                  <img
                    v-if="alarmInfo.captureImage || alarmInfo.alarmSnapUrl"
                    class="alarmImg"
                    v-viewer
                    :src="alarmInfo.captureImage || alarmInfo.alarmSnapUrl"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="alarm-detail">
              <div class="compared-title">{{ $t('application.alarmInfo') }}</div>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmType') }}：</span>
                <span class="value">{{
                  isZh
                    ? alarmInfo.alarmName || alarmInfo.alarmTypeName
                    : alarmInfo.alarmType || alarmInfo.alarmName || alarmInfo.alarmTypeName
                }}</span>
              </div>
              <!-- 人群密度 字段-->
              <template v-if="['CROWD_DENSITY'].includes(alarmInfo.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.areaDetection') }}：</span>
                  <span class="value">{{ alarmInfo.situationAnalysis }}{{ $t('home.person') }}</span>
                </div>
              </template>
              <!-- 排队长度 字段-->
              <template v-if="['ALARM_QUEUE_LENGTH'].includes(alarmInfo.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.queueLength') }}：</span>
                  <span class="value">{{ alarmInfo.situationAnalysis }}{{ $t('home.person') }}</span>
                </div>
              </template>
              <!-- 过线统计 字段 -->
              <template v-if="['LINE_CROSSING_STATISTICS'].includes(alarmInfo.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.lineEntry') }}：</span>
                  <span class="value">{{ alarmInfo.situationAnalysis.split('-')[0] }}{{ $t('home.person') }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.lineLeave') }}：</span>
                  <span class="value">{{ alarmInfo.situationAnalysis.split('-')[1] }}{{ $t('home.person') }}</span>
                </div>
              </template>
              <!-- 告警人员抓拍 字段-->
              <template v-if="['ALARM_CAPTURE_ALARM'].includes(alarmInfo.alarmType)">
                <div class="title">
                  <span class="blueSpan">{{ $t('traffic.name') }}：</span>
                  <span class="value">{{ alarmInfo.personName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('public.similarity') }}：</span>
                  <span class="value">{{ getSimilarity(alarmInfo.similarity) }}</span>
                </div>
              </template>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmSource') }}：</span>
                <span class="value">{{
                  isZh ? alarmInfo.groupName || alarmInfo.alarmGroupName : alarmInfo.alarmGroupNameEn
                }}</span>
              </div>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmLevel') }}：</span>
                <div class="value" :class="setLevelClass(alarmInfo.alarmLevel)">
                  {{ setAlarmLevel(alarmInfo.alarmLevel) }}
                </div>
              </div>
              <template
                v-if="
                  ['WHITELIST_PERSONNEL_ALERT', 'BLACKLIST_PERSONNEL_ALERT', 'STRANGER_ALERT'].includes(
                    alarmInfo.alarmType
                  ) && !isNvr
                "
              >
                <div class="title">
                  <span class="blueSpan">{{ $t('home.name') }}：</span>
                  <span class="value">{{ alarmInfo.personName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.library') }}：</span>
                  <span class="value" :title="alarmInfo.repositoryName">{{ alarmInfo.repositoryName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.personType') }}：</span>
                  <span class="value">{{
                    alarmInfo.repositoryType
                      ? alarmInfo.repositoryType == 3
                        ? $t('application.whitelist')
                        : $t('application.blacklist')
                      : ''
                  }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('public.similarity') }}：</span>
                  <span
                    class="value"
                    v-if="alarmInfo.similarity && alarmInfo.similarity != 'null' && alarmInfo.similarity != '0.0'"
                    >{{ (alarmInfo.similarity * 1).toFixed(2) }}%</span
                  >
                </div>
              </template>
              <template v-else-if="alarmInfo.alarmType == 'BLACKLISTED_VEHICLE_ALERT' && !isNvr">
                <div class="title">
                  <span class="blueSpan">{{ $t('application.plateNum') }}：</span>
                  <span class="value">{{ alarmInfo.lpn ? alarmInfo.lpn : $t('public.unknown') }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.library') }}：</span>
                  <span class="value">{{ alarmInfo.repositoryName }}</span>
                </div>
              </template>
              <div class="title">
                <span class="blueSpan">{{ $t('alarm.alarmTime') }}：</span>
                <span class="value">{{ alarmInfo.hitTime || alarmInfo.alarmTime }}</span>
              </div>
              <div class="title">
                <span class="blueSpan">{{ $t('application.deviceName') }}：</span>
                <span class="value" :title="alarmInfo.deviceName || alarmInfo.alarmDevName">{{
                  alarmInfo.deviceName || alarmInfo.alarmDevName
                }}</span>
              </div>
              <div class="title">
                <span class="blueSpan">{{ $t('application.devicePos') }}：</span>
                <span class="value" :title="alarmInfo.installLocate || alarmInfo.installLocation">{{
                  alarmInfo.installLocate || alarmInfo.installLocation || $t('public.unknown')
                }}</span>
              </div>
              <div class="bottom-tools" v-if="alarmInfo.scene != 'video_quality_alarm'">
                <div class="replay" @click="goToVideo(alarmInfo)">
                  <span style="display: flex; align-items: center">
                    <img src="../../../../../assets/alarmImg/录像.png" alt />
                    {{ $t('application.alarmVideo') }}
                  </span>
                </div>
                <!-- <div v-if="false" class="live" @click="goToLive(alarmInfo)">
                  <span style="display: flex; align-items: center">
                    <img src="../../../../../assets/alarmImg/实况.png" alt />
                    {{ $t('application.live') }}
                  </span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="patrol-detail" v-if="activeName == 'patrol'">
          <div class="item">
            <span class="label">{{ $t('patrol.taskNum') }}</span>
            <span class="value">{{ workInfo.taskChildId }}</span>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.route') }}</span>
            <span class="value">{{ workInfo.routeName }}</span>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.point') }}</span>
            <span class="value">{{ workInfo.pointName }}</span>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.patrolMan') }}</span>
            <span class="value">{{ workInfo.userName }}</span>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.desc') }}</span>
            <span class="value">{{ workInfo.recordDescribe }}</span>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.image') }}</span>
            <div class="img-list" v-if="workInfo.fileList && workInfo.fileList.length">
              <img v-viewer v-for="item in workInfo.fileList" :key="item.fileId" :src="item.fileUrl" alt="pic" />
            </div>
          </div>
          <div class="item">
            <span class="label">{{ $t('patrol.PunchTime') }}</span>
            <span class="value">{{ workInfo.reportTime }}</span>
          </div>
        </div>
        <template>
          <div class="work-handle">
            <div class="title" v-if="info.state == 1 && isProcess && isHandler">{{ $t('work.handleInfo') }}</div>
            <div class="title" v-if="info.state == 1 && isChildHandler && isProcess">{{ $t('work.replyInfo') }}</div>
            <div class="title" v-if="info.state == 2 && isAudit">{{ $t('work.auditInfo') }}</div>
            <div class="title" v-if="!info.handlerName && isIssued">{{ $t('work.dispatchInformation') }}</div>
            <div class="work-handle-wrapper">
              <el-form
                ref="elForm"
                :model="handleForm"
                :rules="handleFormRules"
                label-suffix=":"
                :label-width="isZh ? '100px' : '180px'"
              >
                <el-form-item
                  v-if="info.state == 1 && isProcess && isHandler"
                  :label="$t('work.handleResult')"
                  prop="handleResult"
                >
                  <el-input
                    :placeholder="$t('public.placeholderEnter', { type: $t('work.handleResult') })"
                    style="width: 80%"
                    type="textarea"
                    v-model.trim="handleForm.handleResult"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="info.state == 1 && isChildHandler && isProcess"
                  :label="$t('work.info')"
                  prop="opinion"
                  :rules="[
                    {
                      required: true,
                      message: $t('public.placeholderEnter', { type: $t('work.info') }),
                      trigger: 'blur',
                    },
                    {
                      max: 100,
                      message: $t('tips.size', { type: $t('work.info'), size: 100 }),
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    :placeholder="$t('public.placeholderEnter', { type: $t('work.info') })"
                    style="width: 80%"
                    type="textarea"
                    v-model.trim="handleForm.opinion"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="info.state == 2 && isAudit" :label="$t('work.auditResult')" prop="checkResult">
                  <el-radio-group v-model="handleForm.checkResult">
                    <el-radio label="3">{{ $t('work.complete') }}</el-radio>
                    <el-radio label="4">{{ $t('work.reject') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="info.state == 2 && isAudit"
                  :label="$t('work.auditOpinion')"
                  :rules="[
                    {
                      required: handleForm.checkResult == 4,
                      message: $t('public.placeholderEnter', { type: $t('work.auditOpinion') }),
                      trigger: 'blur',
                    },
                    {
                      max: 100,
                      message: $t('tips.size', { type: $t('work.auditOpinion'), size: 100 }),
                      trigger: 'blur',
                    },
                  ]"
                  prop="suggestion"
                >
                  <el-input
                    type="textarea"
                    v-model.trim="handleForm.suggestion"
                    :placeholder="$t('public.placeholderEnter', { type: $t('work.auditOpinion') })"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="(info.state == 1 && isChildHandler && isProcess) || (info.state == 1 && isHandler && isProcess)"
                  :label="$t('work.attachment')"
                >
                  <div class="upload-wrapper">
                    <el-upload
                      ref="uploadImg"
                      action
                      :auto-upload="false"
                      :limit="3"
                      accept="image/*"
                      class="upload"
                      list-type="picture-card"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      :on-change="handleChangeFile"
                      :class="{ hide: hideUploadBtn }"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <div class="tips">
                      <div class="title">{{ $t('public.prompt') }}</div>
                      <ul>
                        <li>1、{{ $t('work.limitSize') }}</li>
                        <li>2、{{ $t('work.limitImg') }}</li>
                      </ul>
                    </div>
                  </div>
                </el-form-item>
                <el-row v-if="!info.handlerName && isIssued">
                  <el-col :span="12">
                    <el-form-item :label="$t('work.handler')" required>
                      <el-input
                        readonly
                        @click.native="handleSelectPerson(1)"
                        v-model="handleForm.handlerName"
                        :placeholder="$t('public.placeholderSelect', { type: $t('work.handler') })"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('work.collaborator')">
                      <el-input
                        readonly
                        @click.native="handleSelectPerson(2)"
                        v-model="handleForm.childHandlerNames"
                        :placeholder="$t('public.placeholderSelect', { type: $t('work.collaborator') })"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </template>
      </div>
      <!--处理人提交审核-->
      <div v-if="info.state == 1 && isProcess && isHandler" slot="footer">
        <el-button @click="handleClose(false)">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitAudit">{{ $t('work.submitReview') }}</el-button>
      </div>
      <!--协作人回复-->
      <div v-if="info.state == 1 && isChildHandler && isProcess" slot="footer">
        <el-button @click="handleClose(false)">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitReview">{{ $t('public.save') }}</el-button>
      </div>
      <!--审核工单-->
      <div v-if="info.state == 2 && isAudit" slot="footer">
        <el-button @click="handleClose(false)">{{ $t('public.cancel') }}</el-button>
        <el-button @click="handleSubmit" type="primary">{{ $t('public.submit') }}</el-button>
      </div>
      <!--工单派发-->
      <div v-if="!info.handlerName && isIssued" slot="footer">
        <el-button @click="handleClose(false)">{{ $t('public.cancel') }}</el-button>
        <el-button @click="handleIssued" type="primary">{{ $t('public.submit') }}</el-button>
      </div>
      <!--        <div v-if="info.state == 3" slot="footer">-->
      <!--          <el-button @click="handleClose(false)">{{ $t('public.close') }}</el-button>-->
      <!--        </div>-->
    </CusDialog>
    <!-- 人员选择 -->
    <CusDialog
      :visible="selectDialogVisible"
      @close="handleCloseSelectDialog"
      :appendToBody="true"
      :title="$t('work.selectPerson')"
    >
      <div class="select-wrapper" slot="body">
        <div class="left">
          <div class="title">{{ $t('work.optional') }}</div>
          <div class="select-content">
            <el-tree
              check-strictly
              check-on-click-node
              :props="defaultProps"
              :data="treeData"
              @check="handleCheckChange"
              show-checkbox
              node-key="id"
              ref="personTree"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.type == 1 ? 'iconfont icon-tree' : ''" class="iconCss"></i>
                <span class="label" :title="node.label">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ $t('work.selectedPerson') }}</div>
          <div class="select-content">
            <ul>
              <li v-for="item in checkedPerson" :key="item.id" :title="item.payload.userName">
                {{ item.payload.userName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="handleCloseSelectDialog">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="handleEnterSelect">{{ $t('public.confirm') }}</el-button>
      </div>
    </CusDialog>
  </div>
</template>

<script>
import {
  auditWorkSheet,
  getWorkOrderTree,
  issuedWork,
  submitWorkSheet,
  insertCollaborateWorkSheet,
  getGuardHitInfo,
  getPatrolReportInfo,
  getAlarmInfo,
} from '../../../../../utils/api'
import fileCheck from '../../../../../mixin/fileCheck'
import Dayjs from '../../../../../utils/Dayjs'
import { permissions } from '../../../../../utils/permissions'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  name: 'workDetail',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mixins: [fileCheck, VideoScreen],
  data() {
    return {
      isNvr: false,
      //权限判断
      isAudit: true, //审核权限
      isIssued: true, //派发权限
      isProcess: true, //处理权限
      uploadUrl: '',
      that: this,
      alarmInfo: {
        detectImage: '',
        facePhoto: '',
        captureImage: '',
        alarmSnapUrl: '',
      },
      workInfo: {},
      treeData: [],
      selectDialogVisible: false,
      hideUploadBtn: false,
      checkedPerson: [],
      childHandler: [],
      handler: [],
      selectType: 1, //1：单选，2：多选
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.disabledFn,
      },
      activeName: 'work',
      handleForm: {
        handleResult: '',
        checkResult: '3',
      },
      handleFormRules: {
        checkResult: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('work.auditResult') }),
            trigger: 'blur',
          },
        ],
        handleResult: [
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('work.handleResult') }),
            trigger: 'blur',
          },
          {
            max: 100,
            message: this.$t('tips.size', { type: this.$t('work.handleResult'), size: 100 }),
            trigger: 'blur',
          },
        ],
      },
      fileList: [],
      degreeOfUrgency: [
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
      ], //紧急程度
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
  created() {
    this.getPermissions()
    this.handleGetUser()
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    // 是否有操作按钮
    hasOption() {
      return ![
        this.info.state == 1 && this.isProcess && this.isHandler,
        this.info.state == 1 && this.isChildHandler && this.isProcess,
        this.info.state == 2 && this.isAudit,
        !this.info.handlerName && this.isIssued,
      ].some((item) => item === true)
    },
    isChildHandler() {
      //是否是协作人
      return (
        this.info.childHandlerIds &&
        this.info.childHandlerIds.split(',').indexOf(sessionStorage.getItem('userId')) != -1
      )
    },
    isHandler() {
      //是否是处理人
      return this.info.handlerId == sessionStorage.getItem('userId')
    },
    isDistributor() {
      //是否审核分配人
      return this.info.distributorId == sessionStorage.getItem('userId')
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
  filters: {
    formatStatus(val, that) {
      let temp = that.workSheetState.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
    formatLevel(val, that) {
      let temp = that.degreeOfUrgency.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.isAudit = await permissions(872) //审核权限
      this.isIssued = await permissions(870) //派发权限
      this.isProcess = await permissions(871) //处理权限
    },
    handleSubmitReview() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          let params = {
            workSheetId: this.info.id,
            opinion: this.handleForm.opinion,
            childWorkSheetAttachmentList: [],
          }
          let fileAll = []
          if (this.fileList.length) {
            this.fileList.map((item) => {
              fileAll.push(this.uploadFile(item.raw))
            })
          }
          if (fileAll.length) {
            Promise.all(fileAll).then((result) => {
              result.map((item) => {
                params.childWorkSheetAttachmentList.push({
                  fileId: item.fileId,
                  fileUrl: item.filePath,
                })
              })
              insertCollaborateWorkSheet(params).then((res) => {
                if (res.resultCode == 0) {
                  this.fileList = []
                  if (this.$refs.uploadImg) {
                    this.$refs.uploadImg.clearFiles()
                  }

                  this.$message.success(this.$t('public.success'))
                  this.handleClose(true)
                }
              })
            })
          } else {
            insertCollaborateWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.handleClose(true)
              }
            })
          }
        }
      })
    },
    disabledFn(data) {
      if (this.selectType == 1) {
        let index = this.childHandler.map((item) => item.id).indexOf(data.id)
        if (index !== -1) {
          return true
        }
      } else {
        let index = this.handler.map((item) => item.id).indexOf(data.id)
        if (index !== -1) {
          return true
        }
      }
      return data.type == 1
    },
    //获取复工单详情
    fetchWorkSheetInfo() {
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      this.workInfo = {}
      getPatrolReportInfo({
        pointRecordId: this.info.eventId,
      })
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) this.workInfo = res
        })
        .catch(() => {
          loading.close()
        })
    },
    //审核工单
    handleSubmit() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          let params = {
            workSheetId: this.info.id,
            checkResult: this.handleForm.checkResult,
            auditOpinion: this.handleForm.suggestion,
          }
          auditWorkSheet(params).then((res) => {
            if (res.resultCode == 0) {
              this.$message.success(this.$t('public.success'))
              this.handleClose(true)
            }
          })
        }
      })
    },
    //提交审核
    handleSubmitAudit() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          let params = {
            workSheetId: this.info.id,
            handleResult: this.handleForm.handleResult,
            childWorkSheetAttachmentList: [],
          }
          let fileAll = []
          if (this.fileList.length) {
            this.fileList.map((item) => {
              fileAll.push(this.uploadFile(item.raw))
            })
          }
          if (fileAll.length) {
            Promise.all(fileAll).then((result) => {
              result.map((item) => {
                params.childWorkSheetAttachmentList.push({
                  fileId: item.fileId,
                  fileUrl: item.filePath,
                })
              })
              submitWorkSheet(params).then((res) => {
                if (res.resultCode == 0) {
                  this.fileList = []
                  this.$message.success(this.$t('public.success'))
                  this.handleClose(true)
                }
              })
            })
          } else {
            submitWorkSheet(params).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('public.success'))
                this.handleClose(true)
              }
            })
          }
        }
      })

      // submitWorkSheet
    },
    handleIssued() {
      if (!this.handleForm.handlerName) {
        this.$message.warning(this.$t('public.placeholderSelect', { type: this.$t('work.handler') }))
        return
      }
      let params = {
        workSheetId: this.info.id,
        handlerId: this.handler.map((item) => item.id).join(','),
        handlerName: this.handler.map((item) => item.payload.userName).join(','),
      }
      if (this.childHandler.length) {
        params.childHandlerIds = this.childHandler.map((item) => item.id).join(',')
        params.childHandlerNames = this.childHandler.map((item) => item.payload.userName).join(',')
      }
      issuedWork(params).then((res) => {
        if (res.resultCode == 0) {
          this.$message.success(this.$t('public.success'))
          this.handleClose(true)
        }
      })
    },
    handleEnterSelect() {
      if (this.selectType == 1) {
        this.handler = [...this.checkedPerson]
        this.handleForm.handlerName = this.handler.map((item) => item.payload.userName).join(',')
        this.handleForm.handlerId = this.handler.map((item) => item.id)
      } else {
        this.childHandler = [...this.checkedPerson]
        this.handleForm.childHandlerNames = this.childHandler.map((item) => item.payload.userName).join(',')
        this.handleForm.childHandlerId = this.childHandler.map((item) => item.id)
      }
      // this.$refs.personTree.setCheckedNodes([])
      // this.selectDialogVisible = false
      // 选完人员确定后，关闭弹框
      this.handleCloseSelectDialog()
    },
    handleCloseSelectDialog() {
      this.$refs.personTree.setCheckedNodes([])
      this.selectDialogVisible = false
      this.checkedPerson = []
    },
    handleSelectPerson(type) {
      this.selectType = type
      this.selectDialogVisible = true
      this.$nextTick(() => {
        if (this.selectType == 1) {
          //需要禁用已选择
          let index = this.handler.map((item) => item.label).indexOf(this.handleForm.handlerName)
          if (this.handleForm.handlerName && index != -1) {
            this.checkedPerson = [...this.handler]
            this.$refs.personTree.setCheckedNodes(this.checkedPerson)
          } else {
            if (this.handleForm.handlerId && this.handleForm.handlerId.length) {
              let temp = [
                {
                  id: this.handleForm.handlerId.join(','),
                  payload: {
                    userName: this.handleForm.handlerName,
                    id: this.handleForm.handlerId.join(','),
                  },
                },
              ]
              this.$refs.personTree.setCheckedKeys(this.handleForm.handlerId)
              this.checkedPerson = [...temp]
              this.handler = [...temp]
            }
          }
        } else {
          let index = this.childHandler.map((item) => item.label).indexOf(this.handleForm.childHandlerNames)
          if (this.handleForm.childHandlerNames && index != -1) {
            this.checkedPerson = [...this.childHandler]
            this.$refs.personTree.setCheckedNodes(this.checkedPerson)
          } else {
            if (this.handleForm.childHandlerId && this.handleForm.childHandlerId.length) {
              this.$refs.personTree.setCheckedKeys(this.handleForm.childHandlerId)
              //循环了
              let temp = []
              let childHandlerNames = this.handleForm.childHandlerNames.split(',')
              this.handleForm.childHandlerId.map((item, index) => {
                temp.push({
                  id: item,
                  payload: {
                    userName: childHandlerNames[index],
                    id: item,
                  },
                })
              })
              this.checkedPerson = [...temp]
              this.childHandler = [...temp]
            }
          }
        }
      })
    },
    handleCheckChange(data, nodes) {
      const { checkedNodes } = nodes
      this.$set(data, 'disabled', true)
      if (this.selectType == 1) {
        this.checkedPerson = [data]
        this.$refs.personTree.setCheckedNodes(this.checkedPerson)
      } else {
        this.checkedPerson = checkedNodes
      }
    },
    async handleGetUser() {
      const res = await getWorkOrderTree()
      if (res.resultCode == 0 && res.nodeList) {
        this.treeData = res.nodeList
      } else {
        this.treeData = []
      }
    },
    handleClick() {
      if (this.activeName == 'alarm') {
        const loading = this.$loading({
          lock: true,
          text: this.$t('public.loading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        getGuardHitInfo({ alarmId: this.info.eventId })
          .then((res) => {
            loading.close()
            if (res.resultCode == 0) {
              if (res.guardHitInfo && Object.keys(res.guardHitInfo).length) {
                this.alarmInfo = { ...this.info, ...res.guardHitInfo, alarmId: this.info.eventId }
              } else {
                // this.$message.warning(this.$t('public.empty'))
                getAlarmInfo({ alarmId: this.info.eventId, alarmTime: this.info.eventTime }).then((res) => {
                  if (res.alarmInfo && Object.keys(res.alarmInfo).length) {
                    this.alarmInfo = {
                      ...this.info,
                      ...res.alarmInfo,
                      alarmId: this.info.eventId,
                      deviceName: res.alarmInfo.alarmDevName,
                      hitTime: this.info.eventTime,
                    }
                    const platId = this.alarmInfo.platId.slice(12, 14)
                    this.isNvr = platId === '90' ? true : false
                  } else {
                    this.$message.warning(this.$t('public.empty'))
                  }
                })
              }
            }
          })
          .catch(() => {
            loading.close()
          })
      } else if (this.activeName == 'patrol') {
        this.fetchWorkSheetInfo()
      }
      this.$refs.elForm.clearValidate()
    },
    handleClose(type) {
      this.close_sdk_video(this.alarmInfo.deviceId)
      this.checkedPerson = []
      this.childHandler = []
      this.handler = []
      this.isNvr = false
      this.handleForm = {
        checkResult: '3',
        handleResult: '',
        handlerName: '',
        childHandlerNames: '',
      }
      this.alarmInfo = {
        detectImage: '',
        facePhoto: '',
        captureImage: '',
        alarmSnapUrl: '',
      }
      this.activeName = 'work'
      if (this.$refs.uploadImg) {
        this.$refs.uploadImg.clearFiles()
      }
      this.hideUploadBtn = false
      this.fileList = []
      this.$emit('close', type)
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
    /**
     * utils
     */
    getSimilarity(item) {
      if (!item) return ''
      const res = item === '0.0' ? ' ' : infoObj.similarity + '%'
      return res
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  color: #fff;
}
.upload-wrapper {
  display: flex;
  ::v-deep.upload {
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
  }
  .tips {
    line-height: initial;
    //padding-bottom: 15px;
    margin-left: 20px;
    font-size: 14px;
    color: #b3b3b3;
    .title {
      margin-bottom: 10px;
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
.alarm-info {
  max-height: 500px;
  overflow: auto;
  margin-bottom: 30px;
  pointer-events: auto;
  .alarm-info-content {
    display: flex;
    padding: 0 30px;
    box-sizing: border-box;
    .myContent {
      width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .compared-wrapper {
        display: flex;
        width: 100%;
        height: 130px;
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
        height: 260px;
        width: 100%;
        .img {
          width: 100%;
          height: calc(100% - 40px);
          background-color: #ccc;
          border-radius: 4px;
          overflow: hidden;
          .alarmImg {
            width: 100%;
            height: 100%;
          }
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
  }
  .alarm-detail {
    margin-left: 25px;
    flex: 1;
    overflow: hidden;
    .compared-title {
      margin-bottom: 15px;
      font-size: 16px;
    }
    .title {
      margin-bottom: 12px;
      display: flex;

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
    .blueSpan {
      color: #1efffc;
      white-space: nowrap;
    }
    .bottom-tools {
      margin-top: 40px;
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
  }
}
// 隐藏上传组件
.hide {
  ::v-deep.el-upload--picture-card {
    display: none !important;
  }
}
.el-textarea {
  ::v-deep.el-textarea__inner {
    background-color: transparent;
    color: #fff;
  }
}
.custom-tree-node {
  font-size: 14px;
  display: inline-block;
  width: calc(100% - 44px);
  .iconCss {
    margin-right: 5px;
  }
  .label {
    width: calc(100% - 24px);
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
  }
}
.el-tree {
  background: transparent;
  ::v-deep .el-tree-node__content {
    background: transparent;
    color: #fff;
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      //background: #edf2fc;
      //display: none;
    }
  }
}
.select-content {
  height: calc(100% - 65px);
  //padding-bottom: 20px;
  overflow: auto;
  ul {
    padding: 20px;
    box-sizing: border-box;
    li {
      margin-bottom: 10px;
      overflow: hidden;
      white-space: nowrap;
      /*文字超出宽度则显示ellipsis省略号*/
      text-overflow: ellipsis;
    }
  }
}
.select-wrapper {
  display: flex;
  height: 550px;
  color: #fff;
  .left {
    flex: 1;
    margin-right: 10px;
    background: rgba(32, 75, 116, 0.65);
    border-radius: 10px;
    overflow: hidden;
  }
  .right {
    flex: 1;
    overflow: hidden;
    background: rgba(32, 75, 116, 0.65);
    border-radius: 10px;
  }
  .title {
    padding: 15px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
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
  // max-height: 380px;
  // overflow: auto;
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
.work-handle {
  padding: 0 20px;
  ::v-deep.el-upload-list__item {
    transition: none !important;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .work-handle-wrapper {
    padding: 0 30px 30px 0;
    box-sizing: border-box;
    ::v-deep.el-form {
      .el-form-item__label {
        width: 100px;
      }
      .el-form-item__content {
        margin-left: 100px;
      }
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
.patrol-detail {
  padding: 0 30px 20px;
  .item {
    display: flex;
    margin: 10px 0;
    width: 100%;
    .label {
      // text-align: right;
      // display: inline-block;
      // width: 120px;
      margin-right: 5px;
      white-space: nowrap;
      &:after {
        content: '：';
      }
    }
    .value {
      width: calc(100% - 130px);
    }
    .img-list {
      display: flex;
      img {
        // object-fit: contain;
        height: 100px;
        width: 100px;
        margin-right: 20px;
      }
    }
  }
}
</style>
