<template>
  <!--告警事件弹窗-->
  <div class="dialogDetail">
    <div class="infoDiv">
      <div class="info-content">
        <div class="detail-title">
          <div class="blueSpan">{{ $t('alarm.detail') }}</div>
          <i class="el-icon-close infoIcon" @click="allfalse"></i>
        </div>
        <div class="pDiv" style="position: relative">
          <div class="content" style="display: flex">
            <div class="video myContent">
              <div
                class="compared-wrapper"
                v-if="['VEHICLE_MONITOR_ALARM', 'PERSONNEL_MONITOR_ALARM'].indexOf(infoObj.alarmType) != -1"
              >
                <div class="compared-item">
                  <div class="compared-title">{{ $t('alarm.snapshot') }}</div>
                  <div class="img">
                    <img class="alarmImg" v-viewer :src="infoObj.detectImage" alt="" />
                  </div>
                </div>
                <div class="compared-item">
                  <div class="compared-title">{{ $t('alarm.controlPicture') }}</div>
                  <div class="img">
                    <img class="alarmImg" v-viewer :src="infoObj.facePhoto" alt="" />
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
              <div class="compared-title">
                {{ $t('application.alarmInfo') }}
              </div>
              <template>
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.alarmType') }}：</span>
                  <span class="value">{{ isZh ? infoObj.alarmName : infoObj.alarmType || infoObj.alarmName }}</span>
                </div>
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
                <template v-if="infoObj.alarmType == 'PERSONNEL_MONITOR_ALARM'">
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
                    <span class="value">{{
                      infoObj.repositoryType == 3 ? $t('application.whitelist') : $t('application.blacklist')
                    }}</span>
                  </div>
                  <div class="title" v-if="infoObj.similarity">
                    <span class="blueSpan">{{ $t('public.similarity') }}：</span>
                    <span class="value">{{ (infoObj.similarity * 1).toFixed(2) }}%</span>
                  </div>
                </template>
                <template v-else-if="infoObj.alarmType == 'VEHICLE_MONITOR_ALARM'">
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
                <div class="title">
                  <span class="blueSpan">{{ $t('application.deviceName') }}：</span>
                  <span class="value" :title="infoObj.deviceName">{{ infoObj.deviceName }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('application.devicePos') }}：</span>
                  <span class="value" :title="infoObj.installLocation">{{
                    infoObj.installLocation ? infoObj.installLocation : $t('public.unknown')
                  }}</span>
                </div>
                <div class="title">
                  <span class="blueSpan">{{ $t('alarm.alarmStatus') }}：</span>
                  <span class="value" :class="infoObj.confirmState == 0 ? 'red' : 'blue'">
                    {{ infoObj.confirmState == 0 ? $t('home.noHandle') : $t('home.handled') }}
                  </span>
                </div>
                <div class="bottom-tools">
                  <div class="replay" @click="goToVideo(infoObj)">
                    <span style="display: flex; align-items: center">
                      <img src="../../assets/alarmImg/录像.png" alt />
                      {{ $t('application.alarmVideo') }}
                    </span>
                  </div>
                  <div v-if="false" class="live" @click="goToLive(infoObj)">
                    <span style="display: flex; align-items: center">
                      <img src="../../assets/alarmImg/实况.png" alt />
                      {{ $t('application.live') }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="detail-title" v-if="isHandle">
            <div class="blueSpan">{{ $t('alarm.alarmHandling') }}</div>
          </div>
          <div class="handle-wrapper" v-if="isHandle">
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
                  v-model="handleForm.description"
                  :disabled="modifyEdit"
                  :placeholder="!modifyEdit ? $t('alarm.handleContent') : ''"
                ></el-input>
              </el-form-item>
              <el-row v-if="handleForm.processMode == 1">
                <el-col :span="12">
                  <el-form-item :label="$t('alarm.workOrderName')" prop="workSheetName">
                    <el-input
                      :disabled="modifyEdit"
                      v-model="handleForm.workSheetName"
                      :placeholder="$t('alarm.workOrderName')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('alarm.workOrderLevel')" prop="workSheetLevel">
                    <el-select
                      :disabled="modifyEdit"
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
                      v-model="handleForm.description"
                      :disabled="modifyEdit"
                      :placeholder="!modifyEdit ? $t('public.placeholderEnter', { type: $t('alarm.proDesc') }) : ''"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="bottom-tools" style="justify-content: center" v-if="!modifyEdit && isHandle">
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
      </div>
    </div>
  </div>
</template>

<script>
import { addWorkSheet, getWorkSheetInfo, checkAlarmReport, confirmEcsAlarm } from '../../utils/api'
import { permissions } from '../../utils/permissions'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  props: ['infoObj'],
  mixins: [VideoScreen],
  watch: {
    infoObj(val) {
      console.log(val)
      this.$set(this.handleForm, 'processMode', 0)
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
  },
  data() {
    return {
      isHandle: true,
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
        handlerRelatedList: [
          {
            handlerId: '',
            description: '',
          },
        ],
      },
      wordOrderoptions: [
        {
          value: 0,
          label: '巡逻',
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
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
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
      this.fetchWorkSheetInfo()
    }
    this.$refs.handleForm.clearValidate()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.isHandle = await permissions(873) //处理权限
    },
    handleChangeProcessMode(val) {
      this.$set(this.handleForm, 'workSheetName', '')
      this.$set(this.handleForm, 'workSheetLevel', '')
      this.$set(this.handleForm, 'description', '')
      if (val == 1) {
        //获取处理人列表
        this.$refs.handleForm.clearValidate()
      }
    },
    handleGoAlarmCenter(deviceId) {
      this.$router.push({
        path: 'alarmpage',
        query: {
          deviceId,
        },
      })
      this.allfalse()
    },
    submitEventDetail() {
      console.log(this.infoObj)
      //误报
      if (this.handleForm.processMode == -1) {
        this.$refs['handleForm'].validate((valid) => {
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
    deleteUser(item) {
      let index = this.handleForm.handlerRelatedList.indexOf(item)
      if (index !== -1) {
        this.handleForm.handlerRelatedList.splice(index, 1)
      }
    },
    //添加处理人
    addUser() {
      this.handleForm.handlerRelatedList.push({
        handlerId: '',
        description: '',
      })
    },
    //获取复工单详情
    fetchWorkSheetInfo() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      getWorkSheetInfo({
        eventId: this.infoObj.alarmId,
      })
        .then((res) => {
          loading.close()
          if (res.workSheetInfo) {
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
    //关闭第一页告警
    allfalse() {
      this.$store.commit('alarmPage', 0)
      console.log(this.$store.state.alarmpage, 'alarmpage')
      //首页的关闭弹窗
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
  },
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff4d4f;
}
.blue {
  color: #17cd57;
}
.el-textarea {
  ::v-deep.el-textarea__inner {
    background-color: transparent;
    border-color: #1f60a3;
    color: #fff;
    resize: none;
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
.bottom-tools {
  margin-top: 10px;
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
.dialogDetail {
  pointer-events: none;
  position: absolute;
  z-index: 1003;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //background-color: #051c2eb8;
  .infoDiv {
    pointer-events: auto;
    width: 842px;
    //height: 446px;
    border-radius: 30px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 10px 20px 15px;
    box-sizing: border-box;
    background: url('./images/800.png') no-repeat;
    background-size: 100% 100%;
    .info-content {
      padding: 0 20px 15px;
      box-sizing: border-box;
      border-radius: 8px;
      background-color: rgba(42, 74, 107, 0.9);
    }
    .detail-title {
      height: 30px;
      line-height: 30px;
      position: relative;
      margin-top: 10px;
      color: #fff;
      font-size: 16px;
    }
    .alarm-detail {
      margin-left: 25px;
      width: 400px;
      .compared-title {
        margin-bottom: 20px;
      }
    }
    .pDiv {
      color: #edf6f7;
      margin-left: 20px;
      padding-top: 10px;
      padding-right: 20px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      box-sizing: border-box;
      height: 100%;
      max-height: 650px;
      overflow: auto;

      .content {
        margin-top: 20px;
        align-items: flex-start;
        height: 100%;
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
      }
      .blueSpan {
        color: #1efffc;
        white-space: nowrap;
      }
    }
  }
  .infoIcon {
    color: #edf6f7;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 18px;
  }
}
.myContent {
  width: 450px;
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

.el-icon-circle-close {
  color: white;
  margin-top: 64px;
}
</style>
