<template>
  <!--告警事件弹窗-->
  <div class="dialogDetail">
    <div class="infoDiv">
      <div class="detail-title">
        <div class="blueSpan">告警详情</div>
        <i class="el-icon-close infoIcon" @click="allfalse"></i>
      </div>
      <div class="pDiv" style="position: relative">
        <div class="content" style="display: flex">
          <div class="video myContent">
            <el-image
              class="alarmImg"
              :src="$store.state.alarmItem.alarmSnapUrl"
              :preview-src-list="[$store.state.alarmItem.alarmSnapUrl]"
            >
              <div slot="error" class="image-slot">
                <el-image
                  class="alarmImg"
                  :src="require('../../../../../assets/alarmImg/' + iconSty($store.state.alarmItem) + '.png')"
                  :preview-src-list="[
                    require('../../../../../assets/alarmImg/' + iconSty($store.state.alarmItem) + '.png'),
                  ]"
                ></el-image>
              </div>
            </el-image>
          </div>
          <div class="alarm-detail">
            <div class="title">
              <span class="blueSpan">告警类型：</span>
              {{ $store.state.alarmItem.alarmTypeName }}
            </div>
            <div class="title">
              <span class="blueSpan">告警等级：</span>
              <div class="rangeJ" :class="setLevelClass($store.state.alarmItem.alarmLevel)">
                {{ setAlarmLevel($store.state.alarmItem.alarmLevel) }}
              </div>
            </div>
            <div class="title">
              <span class="blueSpan">告警时间：</span>
              {{ $store.state.alarmItem.alarmTime }}
            </div>
            <div class="title">
              <span class="blueSpan">设备名称：</span>
              {{ $store.state.alarmItem.deviceName || $store.state.alarmItem.alarmDevName }}
            </div>
            <div class="title">
              <span class="blueSpan">设备位置：</span>
              {{ $store.state.alarmItem.installLocation ? $store.state.alarmItem.installLocation : '未知' }}
            </div>
            <div class="bottom-tools">
              <div class="replay" @click="goToVideo($store.state.alarmItem)">
                <span style="display: flex; align-items: center">
                  <img src="../../../../../assets/alarmImg/录像.png" alt />告警录像
                </span>
              </div>
              <div class="live" @click="goToLive($store.state.alarmItem)">
                <span style="display: flex; align-items: center">
                  <img src="../../../../../assets/alarmImg/实况.png" alt />实况
                </span>
              </div>
            </div>
            <div class="tips" v-if="isAlarm">
              查看该设备更多告警信息，请前往
              <span
                @click="handleGoAlarmCenter($store.state.alarmItem.deviceId)"
                style="color: #00ccff; cursor: pointer"
                >告警中心 >></span
              >
            </div>
            <!--            <div class="title">-->
            <!--              <span class="blueSpan">告警源设备ID：</span>-->
            <!--              {{ $store.state.alarmItem.deviceId }}-->
            <!--            </div>-->

            <!--            <div class="title">-->
            <!--              <span class="blueSpan">告警状态：</span>-->
            <!--              {{ setCheckState($store.state.alarmItem.confirmState) }}-->
            <!--            </div>-->
            <div class="title" v-if="false">
              <span class="blueSpan">事件处理：</span>
              <span @click="clickDeal($store.state.alarmItem.alarmId)">请点击处理</span>
            </div>
          </div>
        </div>
        <div class="detail-title">
          <div class="blueSpan">告警处理</div>
        </div>
        <div class="handle-wrapper">
          <el-form ref="handleForm" :rules="rules" :model="handleForm" label-width="100px">
            <el-form-item label="处理方式">
              <el-radio-group @change="handleChangeProcessMode" v-model="handleForm.processMode" :disabled="modifyEdit">
                <el-radio :label="0" :disabled="workSheetInfoStatus">直接处理</el-radio>
                <el-radio :label="1" :disabled="workSheetInfoStatus">转工单</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="处理内容" v-show="handleForm.processMode == 0">
              <el-input v-model="handleForm.description" :disabled="modifyEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-row v-show="handleForm.processMode != 0">
              <el-col :span="12">
                <el-form-item label="工单名称:" prop="workSheetName">
                  <el-input
                    :disabled="modifyEdit"
                    v-model="handleForm.workSheetName"
                    placeholder="请输入工单名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工单等级:" prop="workSheetLevel">
                  <el-select :disabled="modifyEdit" v-model="handleForm.workSheetLevel" placeholder="请输入工单等级">
                    <el-option
                      v-for="(item, index) in alarmLevel"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker
                    :disabled="modifyEdit"
                    type="datetime"
                    placeholder="开始时间"
                    v-model="handleForm.startTime"
                    suffix-icon="el-icon-date"
                    default-time="08:00:00"
                    @change="changeStartTime"
                    value-format="timestamp"
                    :picker-options="pickerOptionsStart"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <el-date-picker
                    :disabled="modifyEdit"
                    type="datetime"
                    placeholder="结束时间"
                    v-model="handleForm.endTime"
                    suffix-icon="el-icon-date"
                    :picker-options="pickerOptionsEnd"
                    default-time="20:00:00"
                    @change="changeEndTime"
                    value-format="timestamp"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-for="(item, index) in handleForm.handlerRelatedList" :key="index">
                <el-form-item
                  label="处理人"
                  :prop="'handlerRelatedList.' + index + '.handlerId'"
                  :ref="index + 'handlerId'"
                  :rules="{
                    required: true,
                    message: '请选择处理人',
                    trigger: 'change',
                  }"
                >
                  <div class="mywrapper">
                    <el-select
                      placeholder="请选择处理人"
                      v-model="item.handlerId"
                      suffix-icon="el-icon-user"
                      class="handle-select"
                      :disabled="modifyEdit"
                    >
                      <el-option
                        v-for="user in userList"
                        :key="user.userId"
                        :label="user.userName"
                        :value="user.userId"
                      ></el-option>
                    </el-select>
                    <span class="add" @click="addUser">添加处理人</span>
                    <span class="delete" v-if="handleForm.handlerRelatedList.length > 1" @click="deleteUser(item)"
                      >删除处理人</span
                    >
                  </div>
                </el-form-item>
                <el-form-item label="问题描述">
                  <el-input
                    class="mytextArea22"
                    :prop="'handlerRelatedList.' + index + '.description'"
                    :ref="index + 'description'"
                    v-model="item.description"
                    placeholder="请输入描述信息"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="bottom-tools" style="justify-content: center">
        <div class="btn cancel" @click="allfalse">取消</div>
        <el-button
          class="btn"
          @click="submitEventDetail"
          :disabled="workSheetInfoStatus"
          :class="[workSheetInfoStatus ? 'disabled' : '']"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { addWorkSheet, getUserList, getWorkSheetInfo, checkAlarmReport } from '../../../../../utils/api'
import Dayjs from '../../../../../utils/Dayjs'
import VideoScreen from "@/mixin/VideoScreen" //查看视频
export default {
  props: ['infoObj'],
  mixins:[VideoScreen],
  watch: {
    infoObj(val) {
      console.log(val)
      this.$set(this.handleForm, 'processMode', 0)
    },
  },
  computed: {
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
          label: '非常紧急',
        },
        {
          value: 2,
          label: '紧急',
        },
        {
          value: 3,
          label: '一般',
        },
        {
          value: 4,
          label: '低',
        },
      ],
      userList: [],
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
          }
        },
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          let endDateVal = this.handleForm.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          } else {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
    }
  },
  mounted() {
    this.fetchWorkSheetInfo()
    this.setFormRules()
    this.$refs.handleForm.clearValidate()
  },
  methods: {
    handleChangeProcessMode(val) {
      if (val == 1) {
        //获取处理人列表
        this.pageNum = 1
        this.pageSize = 50
        this.userList = []
        this.getUserTreeList()
        this.$refs.handleForm.clearValidate()
      }
      console.log(val)
    },
    handleGoAlarmCenter(deviceId) {
      // 根据cutype 区分路由跳转或者发送指令qt跳转
      if (sessionStorage.getItem('cuType') == 1) {
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/alarmpage',
            menuName: localStorage.getItem('locale') != 'en' ? '告警信息' : 'Alarm information',
            // params:{
            //   deviceId
            // }
            // dialogIdList: [],
          })
        )
        // qt
      } else {
        this.$router.push({
          path: '/alarmpage',
          query: {
            deviceId,
          },
        })
      }
      debugger
      // this.$router.push({
      //   path: '/alarmpage',
      //   query: {
      //     deviceId,
      //   },
      // })
      this.allfalse()
    },
    submitEventDetail() {
      console.log(this.infoObj)
      let data = {
        processMode: Number(this.handleForm.processMode) == 1 ? 1 : 0,
        eventId: this.infoObj.alarmId,
        workSheetType: 1,
      }
      //转工单
      if (Number(this.handleForm.processMode) == 1) {
        Object.assign(this.handleForm, data)
        this.handleForm.processMode = 1
        this.handleForm.eventImgUrl = this.infoObj.alarmSnapUrl
        this.handleForm.startTime =
          this.handleForm.startTime !== '' ? Dayjs(this.handleForm.startTime).format('YYYY-MM-DD HH:mm:ss') : ''

        this.handleForm.endTime =
          this.handleForm.endTime !== '' ? Dayjs(this.handleForm.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.handleForm.site = this.infoObj.alarmLocate
        this.handleForm.eventTime = this.infoObj.alarmTime
        this.$refs['handleForm'].validate((valid) => {
          if (valid) {
            //审核通过
            let obj = {
              alarmId: this.infoObj.alarmId,
              alarmGroupType: this.infoObj.alarmGroup,
              cameraId: this.infoObj.deviceId,
              alarmTime: this.infoObj.alarmTime,
              checkResult: 2, //正检2
            }
            checkAlarmReport(obj).then((res) => {
              if (res.resultCode == 0) {
                addWorkSheet(this.handleForm).then((res) => {
                  if (res.resultCode == 0) {
                    this.$message.success('提交成功')
                    this.workSheetInfoStatus = true
                    this.allfalse()
                    this.$store.commit('commitPtrolTab', 0)
                    this.$refs.handleForm.resetFields()
                  }
                })
              }
            })
          }
        })
      }

      //直接处理
      if (Number(this.handleForm.processMode) == 0) {
        this.handleForm.processMode = Number(this.handleForm.processMode)
        this.handleForm.eventId = this.infoObj.alarmId
        this.handleForm.workSheetType = 1
        this.handleForm.eventTime = this.infoObj.alarmTime
        let obj = {
          alarmId: this.infoObj.alarmId,
          alarmGroupType: this.infoObj.alarmGroup,
          cameraId: this.infoObj.deviceId,
          alarmTime: this.infoObj.alarmTime,
          checkResult: 1,
        }
        checkAlarmReport(obj).then((res) => {
          if (res.resultCode == 0) {
            addWorkSheet(this.handleForm).then((res) => {
              if (res.resultCode == 0) {
                this.$message.success('处理成功')
                this.allfalse()
                this.workSheetInfoStatus = true
                this.$refs.handleForm.resetFields()
                this.$store.commit('commitPtrolTab', 0)
              }
            })
          }
        })
      }
    },
    changeStartTime() {
      // this.form.startTime = getFormatDate(val);
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
      getWorkSheetInfo({
        eventId: this.infoObj.alarmId,
      }).then((res) => {
        if (res.workSheetInfo) {
          this.workSheetInfoStatus = true
          this.handleForm = { ...res.workSheetInfo }
          this.$store.commit('parentInfo', res.workSheetInfo)
          this.handleForm.processMode = res.workSheetInfo.processMode
          this.modifyEdit = true
          this.$refs.handleForm.resetFields()
        } else {
          this.setFormRules()
          this.$refs.handleForm.clearValidate()
        }
      })
    },
    setFormRules() {
      this.rules = {
        workSheetName: [
          {
            required: true,
            trigger: 'blur',
            message: '工单名称必填',
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
            message: '工单等级必选',
          },
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            // validator: this.pickerOptionsEnd,
            trigger: 'change',
          },
        ],
      }
    },
    //获取用户数
    getUserTreeList() {
      getUserList({
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        organizationId: 0,
      }).then((res) => {
        if (res.userList && res.userList.length) {
          this.userList = this.userList.concat(res.userList)
        }
        if (res.pageInfo.totalNum > this.pageNum * this.pageSize) {
          this.pageNum++
          this.getUserTreeList()
        }
      })
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
          return '非常紧急'
        case 2:
          return '紧急'
        case 3:
          return '一般'
        case 4:
          return '低'
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
  min-height: calc(100vh - 65px);
  top: 65px;
  .infoDiv {
    pointer-events: auto;
    width: 842px;
    //height: 446px;
    border-radius: 30px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 10px 20px;
    box-sizing: border-box;
    background: url('../images/800.png') no-repeat;
    background-size: 100% 100%;
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
      max-height: 650px;
      overflow: auto;

      .content {
        margin-top: 30px;
        height: 100%;
        .title {
          margin-bottom: 12px;
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
  width: 350px;
  height: 240px;
  background: #dff8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  .alarmImg {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.el-icon-circle-close {
  color: white;
  margin-top: 64px;
}
</style>
