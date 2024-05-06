<template>
  <div class="linkage-form-item step3">
    <div class="flex flex-col">
      <el-skeleton class="action-skeleton" :loading="actionTypeLoading" animated>
        <template #template>
          <el-skeleton-item variant="rect" />
        </template>
        <div class="alarm-action">
          <div class="title title_p">
            {{ $t('alarmLinkage.chooseAction') }}
          </div>
          <div class="alarm-action-list">
            <el-checkbox-group class="checkBoxDiv-group" v-model="checkedActions">
              <el-checkbox
                v-for="(action, index) in actionTypeList"
                :key="action.actionType"
                :label="action"
                @change="handleActionChange($event, index)"
              >
                <span :title="action.actionName">
                  {{ action.actionName }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-skeleton>

      <div class="flex justify-between action-config">
        <div class="action-list">
          <div class="title title_p">
            {{ $t('alarmLinkage.choosedAction') }}({{ $t('alarmLinkage.total') }}
            {{ checkedActions.length }} {{ $t('alarmLinkage.record') }})
          </div>
          <ul class="selected-action-list">
            <li
              v-for="(item, index) in checkedActions"
              :key="item.actionType"
              :class="['selected-action-list-item', { liBg: index === isActive }]"
              @click="handleActionClick(index)"
            >
              {{ item.actionName }}
              <el-icon @click.stop="handleDeleteAction(index)"><el-icon-close /></el-icon>
            </li>
          </ul>
        </div>
        <div class="configure-rules">
          <div class="title title_p">
            {{ $t('alarmLinkage.setRules') }}
          </div>
          <div
            v-for="(form, index) in actionList"
            :key="form.actionType"
            class="configure-form-container"
          >
            <el-form
              v-show="isActive === index"
              :model="form"
              :rules="rules"
              :label-width="locale == 'en' ? '200px' : '120px'"
              label-position="left"
            >
              <!--短信通知-->
              <el-form-item
                :label="$t('alarmLinkage.messageTemplate') + '：'"
                v-if="form.actionType === ACTION_TYPE_SMS"
                required
              >
                <el-select
                  v-model="form.actionParam.templateId"
                  :placeholder="$t('alarmLinkage.chooseMessageTemplate')"
                >
                  <el-option
                    v-for="item in messageTemplateArr"
                    :key="item.templateId"
                    :label="item.templateName"
                    :value="item.templateId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--邮件通知 -->
              <el-form-item
                :label="$t('alarmLinkage.emailTemplate') + '：'"
                v-if="form.actionType === ACTION_TYPE_EMAIL"
                required
              >
                <el-select
                  v-model="form.actionParam.templateId"
                  :placeholder="$t('alarmLinkage.selectEmailTemplate')"
                >
                  <el-option
                    v-for="item in emailTemplateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!--微信通知--微信模板 -->
              <el-form-item
                :label="$t('alarmLinkage.weixinTemplate') + '：'"
                v-if="form.actionType === ACTION_TYPE_WE_CHAT"
                required
              >
                <el-select
                  v-model="form.actionParam.templateId"
                  :placeholder="$t('alarmLinkage.selectWeixinTemplate')"
                >
                  <el-option
                    v-for="item in weixinTemplateList"
                    :key="item.templateId"
                    :label="item.templateName"
                    :value="item.templateId"
                  />
                </el-select>
              </el-form-item>
              <!--邮件通知--手动输入 -->
              <el-form-item
                :label="$t('alarmLinkage.manuallyEnter') + '：'"
                v-if="form.actionType === ACTION_TYPE_EMAIL"
                prop="emails"
              >
                <el-input
                  v-model="form.actionParam.emails"
                  :placeholder="$t('alarmLinkage.EmailsFormat')"
                  clearable
                />
              </el-form-item>
              <!--前端录像/平台录像 -->
              <el-form-item
                :label="$t('alarmLinkage.videoTime') + '：'"
                prop="duration"
                v-if="
                  form.actionType === ACTION_TYPE_PU_RECORD ||
                  form.actionType === ACTION_TYPE_PLAT_RECORD
                "
              >
                <el-input
                  v-model="form.actionParam.duration"
                  :placeholder="$t('alarmLinkage.inputVideoTime')"
                  clearable
                />
              </el-form-item>
              <!--短信通知--手动输入-->
              <el-form-item
                :label="$t('alarmLinkage.manuallyEnter') + '：'"
                prop="mobiles"
                v-if="form.actionType === ACTION_TYPE_SMS"
              >
                <el-input
                  v-model="form.actionParam.mobiles"
                  :placeholder="$t('alarmLinkage.phoneNumbersFormat')"
                  clearable
                />
              </el-form-item>
              <!--用户树-->
              <el-form-item
                :label="$t('alarmLinkage.linkageUserList') + '：'"
                required
                v-if="
                  form.actionType === ACTION_TYPE_SMS ||
                  form.actionType === ACTION_TYPE_EMAIL ||
                  form.actionType === ACTION_TYPE_WE_CHAT ||
                  form.actionType === ACTION_TYPE_CU_LIVE ||
                  form.actionType === ACTION_TYPE_CU_WALL
                "
              >
                <UserTree
                  @tree-created="handleUserTreeCreated($event, index)"
                  @check-change="handleUserCheckChange($event, index)"
                ></UserTree>
              </el-form-item>
              <!--设备树-->
              <el-form-item
                :label="$t('alarmLinkage.linkageDevList') + '：'"
                required
                v-if="
                  form.actionType === ACTION_TYPE_PU_SNAP ||
                  form.actionType === ACTION_TYPE_PU_PRESET ||
                  form.actionType === ACTION_TYPE_CU_LIVE ||
                  form.actionType === ACTION_TYPE_PU_RECORD ||
                  form.actionType === ACTION_TYPE_PLAT_RECORD ||
                  form.actionType === ACTION_TYPE_CU_WALL
                "
              >
                <DeviceTree
                  :max="LINKAGE_DEVICE_SIZE_LIMIT"
                  @tree-created="handleDeviceTreeCreated($event, index)"
                  @check-change="handleDeviceCheckChange($event, index)"
                  @on-check="handleDeviceCheck($event, index)"
                ></DeviceTree>
              </el-form-item>
              <!--预置位-->
              <div
                v-if="form.actionType === ACTION_TYPE_PU_PRESET"
                style="max-height: 112px; overflow-y: auto"
              >
                <el-form-item
                  class="no-wrap"
                  v-for="device in form.selCameras"
                  :key="device.deviceId"
                  :label="device.deviceName + '：'"
                  required
                  :title="device.deviceName"
                  v-show="
                    (device.deviceType === 2 || device.deviceType === 3) && device.presetList.length
                  "
                >
                  <el-select
                    v-model="device.presetIndex"
                    :placeholder="$t('alarmLinkage.choosePreset')"
                  >
                    <el-option
                      v-for="item in device.presetList"
                      :key="item.presetIndex"
                      :label="item.presetName"
                      :value="item.presetIndex"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!--大喇叭-->
              <el-form-item
                :label="$t('alarmLinkage.fileType') + '：'"
                v-if="form.actionType === ACTION_TYPE_SUO_NA"
                required
              >
                <el-radio-group v-model="form.actionParam.fileType">
                  <el-radio :label="1">{{ $t('alarmLinkage.uploadAudio') }}</el-radio>
                  <el-radio :label="2">{{ $t('alarmLinkage.uploadText') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('alarmLinkage.inputContent') + '：'"
                v-if="form.actionType === ACTION_TYPE_SUO_NA && form.actionParam.fileType === 2"
                required
              >
                <el-input
                  v-model="form.actionParam.content"
                  :placeholder="$t('alarmLinkage.inputContentPrompt')"
                  clearable
                  type="textarea"
                  maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('alarmLinkage.fileName') + '：'"
                v-if="form.actionType === ACTION_TYPE_SUO_NA && form.actionParam.fileType === 1"
                class="uploadFile"
                required
                :element-loading-text="$t('public.uploadLoading')"
                
                v-loading="uploading"
              >
                <input
                  type="file"
                  ref="shanghcuan_file"
                  accept
                  multiple
                  title
                  @change="changeFile(index)"
                  style="display: none"
                />
                <el-input
                  v-model="form.actionParam.fileName"
                  readonly
                  :placeholder="$t('alarmLinkage.fileSizePrompt')"
                />
                <el-button type="primary" @click="uploadFile" style="margin-left: 5px">
                  {{ $t('public.import') }}
                </el-button>
              </el-form-item>
              <p
                style="color: #f56c6c; margin-top: -14px; margin-left: 118px; margin-bottom: 0"
                v-if="form.actionType === ACTION_TYPE_SUO_NA && form.actionParam.fileType === 1"
              >
                {{ $t('alarmLinkage.audioTypePrompt') }}
              </p>
              <!--平台备份-->
              <el-form-item
                v-if="form.actionType === ACTION_TYPE_PLAT_BACKUP"
                :label="$t('alarmLinkage.backUpTime') + '：'"
                prop="duration"
              >
                <el-input
                  v-model="form.actionParam.duration"
                  :placeholder="$t('alarmLinkage.inputBackUpTime')"
                  clearable
                ></el-input>
              </el-form-item>
              <!--抑制时间-->
              <el-form-item
                :label="$t('alarmLinkage.restrainTime') + '：'"
                style="min-width: 430px"
              >
                <div>
                  <el-input-number
                    v-model="inhibitionTime_hour"
                    controls-position="right"
                    :min="0"
                    :max="23"
                    class="inputNumber"
                  ></el-input-number>
                  <span
                    style="color: #000"
                    :style="locale == 'en' ? { marginLeft: '3px' } : { margin: '0 10px' }"
                  >
                    {{ $t('alarmLinkage.hours') }}
                  </span>
                  <el-input-number
                    v-model="inhibitionTime_minute"
                    controls-position="right"
                    :min="0"
                    :max="59"
                    class="inputNumber"
                  ></el-input-number>
                  <span
                    style="color: #000"
                    :style="locale == 'en' ? { marginLeft: '3px' } : { margin: '0 10px' }"
                  >
                    {{ $t('alarmLinkage.minutes') }}
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="previousStep">
        {{ $t('alarmLinkage.previousStep') }}
      </el-button>
      <el-button type="primary" @click="nextStep">
        {{ $t('alarmLinkage.nextStep') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { Close as ElIconClose } from '@element-plus/icons-vue'
import {
  INTELLIGENT_ANALYSIS_ALARM,
  ACTION_TYPE_PU_RECORD,
  ACTION_TYPE_PU_SNAP,
  ACTION_TYPE_PLAT_RECORD,
  ACTION_TYPE_PLAT_BACKUP,
  ACTION_TYPE_SMS,
  ACTION_TYPE_EMAIL,
  ACTION_TYPE_WE_CHAT,
  ACTION_TYPE_SUO_NA,
  ACTION_TYPE_PU_PRESET,
  ACTION_TYPE_CU_LIVE,
  ACTION_TYPE_CU_WALL,
  LINKAGE_DEVICE_SIZE_LIMIT
} from '../constant'
import UserTree from './user-tree'
import DeviceTree from './device-tree'
const regDuration = /^[1-9]\d*$/
const regManInput =
  /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
const regManInputEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
export default {
  components: {
    UserTree,
    DeviceTree,
    ElIconClose
  },
  name: 'step3',
  props: {
    alarmGroups: {
      type: Array,
      default: () => []
    },
    operation: {
      type: String,
      default: 'add'
    },
    policyInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      actionTypeLoading: false,
      checkedActions: [],
      actionTypeList: [],
      isActive: -1,
      actionList: [],
      //短信模板名称数组
      messageTemplateArr: [],
      emailTemplateList: [],
      weixinTemplateList: [],
      rules: {},
      uploading: false,
      inhibitionTime_hour: 0, //抑制时间小时
      inhibitionTime_minute: 0, //抑制时间分钟
      userIdsForEdit: []
    }
  },
  async created() {
    this.setFormRules()
    await this.getActionList()
    if (this.operation === 'edit') {
      this.backFillPolicyInfo()
    }
    // todo: 平台备份树
  },
  computed: {
    ifChooseAIType() {
      return this.alarmGroups
        .filter(item => item.alarmTypeList.length)
        .some(item => item.groupCode === INTELLIGENT_ANALYSIS_ALARM)
    },
    ACTION_TYPE_SMS() {
      return ACTION_TYPE_SMS
    },
    ACTION_TYPE_EMAIL() {
      return ACTION_TYPE_EMAIL
    },
    ACTION_TYPE_WE_CHAT() {
      return ACTION_TYPE_WE_CHAT
    },
    ACTION_TYPE_PU_RECORD() {
      return ACTION_TYPE_PU_RECORD
    },
    ACTION_TYPE_PLAT_RECORD() {
      return ACTION_TYPE_PLAT_RECORD
    },
    ACTION_TYPE_SUO_NA() {
      return ACTION_TYPE_SUO_NA
    },
    ACTION_TYPE_PU_PRESET() {
      return ACTION_TYPE_PU_PRESET
    },
    ACTION_TYPE_PLAT_BACKUP() {
      return ACTION_TYPE_PLAT_BACKUP
    },
    ACTION_TYPE_CU_LIVE() {
      return ACTION_TYPE_CU_LIVE
    },
    ACTION_TYPE_CU_WALL() {
      return ACTION_TYPE_CU_WALL
    },
    ACTION_TYPE_PU_SNAP() {
      return ACTION_TYPE_PU_SNAP
    },
    LINKAGE_DEVICE_SIZE_LIMIT() {
      return LINKAGE_DEVICE_SIZE_LIMIT
    }
  },
  methods: {
    previousStep() {
      this.$emit('prev')
    },
    nextStep() {
      if (this.checkedActions.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('alarmLinkage.chooseAlarmActionContent')
        })
        return
      }
      const valid = this.validateActionList()
      if (!valid) return
      const actionList = this.serializeActionList(this.actionList)
      this.$emit('next', {
        step: 3,
        data: {
          actionList,
          restrainTime: this.inhibitionTime_hour * 3600 + this.inhibitionTime_minute * 60,
          checkedActions: this.checkedActions
        }
      })
    },
    validateActionList() {
      const returnFuc = (type = 1) => {
        this.$message({
          type: 'warning',
          message:
            type === 1
              ? this.$t('alarmLinkage.haveAlarmActionNoComplete')
              : this.$t('alarmLinkage.alarmActionNoTrue')
        })
        return false
      }
      for (let i = 0; i < this.actionList.length; i++) {
        const action = this.actionList[i]
        const { actionType, actionParam, selCameras } = action
        let presetNotSelected
        switch (actionType) {
          case ACTION_TYPE_SMS:
            if (
              actionParam.templateId === undefined ||
              ((actionParam.mobiles === undefined || actionParam.mobiles === '') &&
                actionParam.userIds.length === 0)
            ) {
              return returnFuc()
            }
            if (actionParam.mobiles !== undefined && actionParam.mobiles !== '') {
              for (let i = 0; i < actionParam.mobiles.split(',').length; i++) {
                if (!regManInput.test(actionParam.mobiles.split(',')[i])) {
                  return returnFuc(2)
                }
              }
            }
            break
          case ACTION_TYPE_EMAIL:
            if (
              actionParam.templateId === undefined ||
              ((actionParam.emails === undefined || actionParam.emails === '') &&
                actionParam.userIds.length === 0)
            ) {
              return returnFuc()
            }
            if (actionParam.emails !== undefined && actionParam.emails !== '') {
              for (let i = 0; i < actionParam.emails.split(',').length; i++) {
                if (!regManInputEmail.test(actionParam.emails.split(',')[i])) {
                  return returnFuc(2)
                }
              }
            }
            break
          case ACTION_TYPE_WE_CHAT:
            if (actionParam.templateId === undefined || actionParam.userIds.length === 0) {
              return returnFuc()
            }
            break
          case ACTION_TYPE_PU_RECORD:
          case ACTION_TYPE_PLAT_RECORD:
          case ACTION_TYPE_PLAT_BACKUP:
            if (
              actionParam.duration === undefined ||
              actionParam.duration === '' ||
              actionParam.deviceIds.length === 0
            ) {
              return returnFuc()
            }
            if (
              !regDuration.test(actionParam.duration) ||
              actionParam.duration < 30 ||
              actionParam.duration > 600
            ) {
              return returnFuc(2)
            }
            break
          case ACTION_TYPE_PU_SNAP:
            if (actionParam.deviceIds.length === 0) {
              return returnFuc()
            }
            break
          case ACTION_TYPE_PU_PRESET:
            if (selCameras.length === 0) {
              return returnFuc()
            }
            presetNotSelected = selCameras.some(camera => camera.presetIndex === undefined)
            if (presetNotSelected) {
              return returnFuc()
            }
            break
          case ACTION_TYPE_SUO_NA:
            if (
              (actionParam.fileType === 1 && actionParam.fileId === undefined) ||
              (actionParam.fileType === 2 && actionParam.content === undefined)
            ) {
              return returnFuc()
            }
            break
          case ACTION_TYPE_CU_LIVE:
          case ACTION_TYPE_CU_WALL:
            if (actionParam.deviceIds.length === 0 || actionParam.userIds.length === 0) {
              return returnFuc()
            }
            break
          default:
            return returnFuc()
        }
      }
      return true
    },
    setFormRules() {
      const validateManInput = (rule, value, callback) => {
        const mobiles = this.actionList[this.isActive].actionParam.mobiles
        if (mobiles !== '' && mobiles !== undefined) {
          for (let i = 0; i < mobiles.split(',').length; i++) {
            if (!regManInput.test(mobiles.split(',')[i])) {
              callback(new Error(this.$t('alarmLinkage.enterTruePhoneNum')))
            }
          }
        }
        callback()
      }

      const validateManInputEmail = (rule, value, callback) => {
        const emails = this.actionList[this.isActive].actionParam.mobiles
        if (emails !== '' && emails !== undefined) {
          for (let i = 0; i < emails.split(',').length; i++) {
            if (!regManInputEmail.test(emails.split(',')[i])) {
              callback(new Error(`${this.$t('alarmLinkage.emailFormatPrompt')}`))
            }
          }
        }
        callback()
      }

      const validateDuration = (rule, value, callback) => {
        const duration = this.actionList[this.isActive].actionParam.duration
        if (duration && !regDuration.test(duration)) {
          callback(new Error(`${this.$t('alarmLinkage.recordDurationFormatPrompt')}`))
        } else if (duration !== '') {
          if (duration < 30 || duration > 600) {
            callback(new Error(`${this.$t('alarmLinkage.recordDurationPrompt')}`))
          }
        }
        callback()
      }

      this.rules = {
        mobiles: [{ trigger: 'blur', validator: validateManInput }],
        duration: [{ required: true, trigger: 'change', validator: validateDuration }],
        emails: [{ trigger: 'blur', validator: validateManInputEmail }]
      }
    },
    async getActionList() {
      this.actionTypeLoading = true
      try {
        const res = await this.$api.getLinkageActionTypeList({})
        if (res.resultCode === 0) this.actionTypeList = res.actionTypeList
      } finally {
        this.actionTypeLoading = false
      }
    },
    backFillPolicyInfo() {
      const { actionList, restrainTime } = this.policyInfo
      // 回填已选动作
      const checkedActions = []
      actionList.forEach(action => {
        const actionType = this.actionTypeList.find(item => item.actionType === action.actionType)
        if (actionType) {
          checkedActions.push(actionType)
        }
      })
      this.checkedActions = checkedActions
      // 处理动作表单数据
      this.actionList = this.deserializeActionList(actionList)
      // 回填抑制时间
      if (restrainTime < 3600) {
        this.inhibitionTime_hour = 0
        this.inhibitionTime_minute = Math.floor(restrainTime / 60)
      } else {
        this.inhibitionTime_hour = Math.floor(restrainTime / 3600)
        this.inhibitionTime_minute = (restrainTime % 3600) / 60
      }
      // 选中第一个动作
      this.checkedActions.length && (this.isActive = 0)
    },
    async handleActionChange(val, index) {
      const action = this.actionTypeList[index]
      const { actionType } = action
      if (val) {
        //智能分析告警 不支持 前端录像、平台录像、前端抓拍
        if (
          actionType === ACTION_TYPE_PU_RECORD ||
          actionType === ACTION_TYPE_PU_SNAP ||
          actionType === ACTION_TYPE_PLAT_RECORD ||
          actionType === ACTION_TYPE_PLAT_BACKUP
        ) {
          if (this.ifChooseAIType) {
            this.$message({
              type: 'warning',
              message: `${this.$t('alarmLinkage.aiTypeLimitPrompt')}`
            })
            await this.$nextTick()
            let i = this.checkedActions.indexOf(action)
            this.checkedActions.splice(i, 1)
            return
          }
        }
        this.actionList.push(this.generateActionData(actionType, this.actionList.length + 1))
      } else {
        let i = this.actionList.findIndex(item => item.actionType === actionType)
        this.actionList.splice(i, 1)
      }
      if (this.actionList.length === 1) {
        this.isActive = 0
      } else if (this.actionList.length === 0) {
        this.isActive = -1
      }
    },
    generateActionData(actionType, sort) {
      const action = {
        actionType,
        actionParam: {},
        actionSort: sort
      }
      switch (actionType) {
        case ACTION_TYPE_SMS:
          action.actionParam = {
            userIds: [],
            mobiles: undefined,
            templateId: undefined
          }
          break
        case ACTION_TYPE_EMAIL:
          action.actionParam = {
            userIds: [],
            emails: undefined,
            templateId: undefined
          }
          break
        case ACTION_TYPE_WE_CHAT:
          action.actionParam = {
            userIds: [],
            templateId: undefined
          }
          break
        case ACTION_TYPE_PU_RECORD:
        case ACTION_TYPE_PLAT_RECORD:
        case ACTION_TYPE_PLAT_BACKUP:
          action.actionParam = {
            duration: undefined,
            deviceIds: []
          }
          break
        case ACTION_TYPE_PU_SNAP:
          action.actionParam = {
            deviceIds: []
          }
          break
        case ACTION_TYPE_PU_PRESET:
          action.actionParam = {
            deviceIds: []
          }
          action.selCameras = []
          break
        case ACTION_TYPE_SUO_NA:
          action.actionParam = {
            fileName: undefined,
            fileId: undefined,
            fileType: 1,
            content: undefined
          }
          break
        case ACTION_TYPE_CU_LIVE:
        case ACTION_TYPE_CU_WALL:
          action.actionParam = {
            deviceIds: [],
            userIds: []
          }
          break
        default:
          break
      }
      return action
    },
    serializeActionList(actionList) {
      const actionListCopy = this.$loadash.cloneDeep(actionList)
      return actionListCopy.map(action => {
        const { actionType, actionParam, selCameras } = action
        switch (actionType) {
          case ACTION_TYPE_PU_RECORD:
          case ACTION_TYPE_PLAT_RECORD:
          case ACTION_TYPE_PLAT_BACKUP:
            action.actionParam = actionParam.deviceIds.map(deviceId => {
              return {
                deviceId,
                duration: actionParam.duration
              }
            })
            break
          case ACTION_TYPE_PU_SNAP:
            action.actionParam = actionParam.deviceIds.map(deviceId => ({
              deviceId
            }))
            break
          case ACTION_TYPE_PU_PRESET:
            action.actionParam = selCameras.map(camera => ({
              deviceId: camera.deviceId,
              presetIndex: camera.presetIndex
            }))
            delete action.selCameras
            break
          case ACTION_TYPE_SUO_NA:
            if (actionParam.fileType === 1) {
              action.actionParam = {
                fileType: actionParam.fileType,
                fileId: actionParam.fileId,
                fileName: actionParam.fileName
              }
            } else {
              action.actionParam = {
                fileType: actionParam.fileType,
                content: actionParam.content
              }
            }
            break
          default:
            break
        }
        return action
      })
    },
    deserializeActionList(actionList) {
      const actionListCopy = this.$loadash.cloneDeep(actionList)
      return actionListCopy.map(action => {
        action.actionParam = JSON.parse(action.actionParam)
        let { actionType, actionParam } = action
        // actionParam 恢复原始格式
        switch (actionType) {
          case ACTION_TYPE_PU_RECORD:
          case ACTION_TYPE_PLAT_RECORD:
          case ACTION_TYPE_PLAT_BACKUP:
            action.actionParam = {
              deviceIds: actionParam.map(item => item.deviceId),
              duration: actionParam[0].duration
            }
            break
          case ACTION_TYPE_PU_SNAP:
            action.actionParam = {
              deviceIds: actionParam.map(item => item.deviceId)
            }
            break
          case ACTION_TYPE_PU_PRESET:
            action.actionParam = {
              deviceIds: actionParam.map(item => item.deviceId)
            }
            action.selCameras = actionParam
            break
          default:
            break
        }
        return action
      })
    },
    handleActionClick(index) {
      this.isActive = index
    },
    handleDeleteAction(index) {
      this.checkedActions.splice(index, 1)
      this.actionList.splice(index, 1)
      if (this.isActive === index) {
        // 删除的当前项
        if (this.actionList.length === 0) {
          this.isActive = -1
        } else if (this.actionList.length === index) {
          this.isActive = index - 1
        }
      } else if (this.isActive > index) {
        // 删除的是当前项之前的项
        this.isActive--
      }
    },
    //获取短信模板列表
    async getSmsTemplateList() {
      const res = await this.$api.getSmsTemplateList({
        pageInfo: {
          pageNum: 1,
          pageSize: this.$maxPageSize
        },
        templateType: 2
      })
      if (res.resultCode === 0) {
        this.messageTemplateArr = res.templateList
      }
    },
    //获取邮件模板
    async getEmailTemplateList() {
      const res = this.$api.getMailTemplateByType({
        type: 2,
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode === 0) {
        this.emailTemplateList = res.mailTemplateInfoList
      }
    },
    //获取微信模板
    async getWeixinTemplateList() {
      const res = this.$api.searchWeChatTemplate({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode === 0) {
        this.weixinTemplateList = res.weChatTemplateInfoList
      }
    },
    // 大喇叭文件上传
    changeFile(index) {
      const file = this.$refs.shanghcuan_file[0].files[0]
      if (file) {
        let fileName = file.name
        let typeName = fileName.substring(fileName.lastIndexOf('.')).toLocaleLowerCase().slice(1)
        if (typeName !== 'mp3') {
          this.$message({
            type: 'error',
            message: `${this.$t('alarmLinkage.notSupportedFileType')}`
          })
          return
        }
        this.uploading = true
        if (file.size / (1024 * 1024) > 100) {
          this.$message({
            type: 'warning',
            message: this.$t('alarmLinkage.fileSizePrompt')
          })
          this.uploading = false
          return
        }
        let formData = new FormData()
        formData.append('file', file)
        formData.append('api', '/api/ecs/alarm/linkage/add')
        formData.append('netType', this.$getNetType())
        this.$api
          .uploadFile(formData)
          .then(res => {
            if (res.resultCode === 0) {
              this.actionList[index].actionParam.fileName = file.name
              this.actionList[index].actionParam.fileId = res.fileId
            }
          })
          .finally(() => {
            this.uploading = false
          })
      }
    },
    uploadFile() {
      this.$refs.shanghcuan_file[0].click()
    },
    // 用户树初始化回调
    handleUserTreeCreated(treeRef, index) {
      // 初始化时回显选中数据
      const actionParam = this.actionList[index].actionParam
      if (actionParam.userIds.length) {
        for (let id of actionParam.userIds) {
          treeRef.checkNode(id, true)
        }
      }
    },
    // 设备树初始化回调
    async handleDeviceTreeCreated(treeRef, index) {
      // 初始化时回显选中数据
      const actionParam = this.actionList[index].actionParam
      if (actionParam.deviceIds.length) {
        for (let id of actionParam.deviceIds) {
          await treeRef.checkNode(id, true, true, true)
        }
      }
    },
    handleUserCheckChange(val, index) {
      this.actionList[index].actionParam.userIds = val.map(node => node.payload.userId)
    },
    handleDeviceCheckChange(val, index) {
      this.actionList[index].actionParam.deviceIds = val.map(item => item.payload.deviceId)
    },
    async handleDeviceCheck(data, actionIndex) {
      const { treeRef, node } = data
      const { actionType } = this.actionList[actionIndex]
      if (actionType === ACTION_TYPE_PU_PRESET) {
        const { status, deviceType, deviceId } = node.payload
        const deleteSelCamera = () => {
          let idIndex = this.actionList[actionIndex].actionParam.deviceIds.findIndex(
            id => id === deviceId
          )
          if (idIndex > -1) {
            this.actionList[actionIndex].actionParam.deviceIds.splice(idIndex, 1)
          }
          let index = this.actionList[actionIndex].selCameras.findIndex(
            camera => camera.deviceId === deviceId
          )
          if (index > -1) {
            this.actionList[actionIndex].selCameras.splice(index, 1)
          }
        }
        // 处理选中预置位数据
        if (node.checked) {
          const cancelCheck = async () => {
            await this.$nextTick()
            treeRef.checkNode(deviceId, false)
            deleteSelCamera()
          }
          // 离线不支持
          if (status !== 1) {
            this.$message({
              type: 'warning',
              message: this.$t('alarmLinkage.alarmOfflineDev')
            })
            await cancelCheck()
            return false
          }
          if (deviceType !== 2 && deviceType !== 3) {
            this.$message({
              type: 'warning',
              message: this.$t('alarmLinkage.NoPresetBitInfo')
            })
            await cancelCheck()
            return false
          }
          try {
            const res = await this.$api.getPreset({ cameraId: deviceId })
            if (res.resultCode === 0) {
              if (!('presetList' in res) || res.presetList.length === 0) {
                this.$message({
                  type: 'warning',
                  message: this.$t('alarmLinkage.NoPresetBitInfo')
                })
                await cancelCheck()
                return false
              } else {
                let index = this.actionList[actionIndex].selCameras.findIndex(
                  camera => camera.deviceId === deviceId
                )
                if (index > -1) {
                  this.actionList[actionIndex].selCameras[index] = {
                    ...node.payload,
                    presetList: res.presetList,
                    presetIndex: this.actionList[actionIndex].selCameras[index].presetIndex
                  }
                } else {
                  this.actionList[actionIndex].selCameras.push({
                    ...node.payload,
                    presetList: res.presetList,
                    presetIndex: undefined
                  })
                }
              }
            }
          } catch (error) {
            this.$message({
              type: 'warning',
              message: this.$t('alarmLinkage.NoSupportConfig')
            })
            await cancelCheck()
          }
        } else {
          deleteSelCamera()
        }
      }
    }
  }
}
</script>
