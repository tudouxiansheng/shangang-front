<template>
  <!--事件处理详情-->
  <div class="eventDetail">
    <div class="topContent">
      <div class="topTitle">
        <div class="jinzhan">事件进展</div>
        <div class="bihuan" @click="toclosedLoop">闭环进展</div>
      </div>
      <i class="el-icon-close infoIcon iconclose" @click="closeAll"></i>
    </div>
    <div class="formemit">
      <el-form ref="form2" :rules="rules" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理方式">
              <el-radio-group v-model="form.processMode" :disabled="modifyEdit">
                <el-radio :label="0">直接处理</el-radio>
                <el-radio :label="1">转工单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.processMode == 0">
          <el-col :span="24">
            <el-form-item label="问题描述:" class="long">
              <el-input
                type="textarea"
                v-model="form.description"
                style="width: 450px"
                :disabled="modifyEdit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.processMode == 1">
          <el-col :span="12">
            <el-form-item label="工单名称:" prop="workSheetName">
              <el-input
                v-model="form.workSheetName"
                :disabled="modifyEdit"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单等级:" prop="workSheetLevel">
              <el-select v-model="form.workSheetLevel" :disabled="modifyEdit">
                <el-option
                  v-for="(item, index) in alarmLevel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.processMode == 1">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                type="datetime"
                placeholder="开始时间"
                v-model="form.startTime"
                suffix-icon="el-icon-date"
                style="width: 185px"
                default-time="08:00:00"
                @change="changeStartTime"
                :picker-options="pickerOptionsStart"
                value-format="timestamp"
                :disabled="modifyEdit"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                type="datetime"
                placeholder="结束时间"
                v-model="form.endTime"
                suffix-icon="el-icon-date"
                style="width: 185px"
                :picker-options="pickerOptionsEnd"
                default-time="20:00:00"
                @change="changeEndTime"
                value-format="timestamp"
                :disabled="modifyEdit"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        :model="formData"
        ref="elform2"
        class="elform"
        v-show="form.processMode == 1"
      >
        <div
          v-for="(item, index) in formData.handlerRelatedList"
          :key="item.handlerId"
        >
          <el-form-item
            label="处理人"
            :prop="'handlerRelatedList.' + index + '.handlerId'"
            :ref="index + 'handlerId'"
            :rules="{
              required: true,
              message: '请选择处理人',
              trigger: 'blur',
            }"
          >
            <div class="mywrapper">
              <el-select
                placeholder="请选择处理人"
                v-model="item.handlerId"
                suffix-icon="el-icon-user"
                style="width: 396px"
                :disabled="modifyEdit"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
              <img
                src="@/assets/common/add.png"
                @click="addUser"
                class="myimg"
                v-if="item.add"
              />
              <img
                src="@/assets/common/reduce.png"
                class="myimg"
                v-if="item.reduce"
                @click="deleteUser(index)"
              />
            </div>
          </el-form-item>
          <el-form-item label="问题描述">
            <textarea
              class="mytextArea22"
              :prop="'handlerRelatedList.' + index + '.description'"
              :ref="index + 'description'"
              v-model="item.description"
              :disabled="modifyEdit"
            ></textarea>
          </el-form-item>
          <el-form-item label="附件" v-if="item.fujian">
            <img :src="item.fujian" style="width: 60px; height: 60px" />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="bottomDeal">
      <div class="back" @click="backTopatroldetail">返回</div>
      <el-button
        @click="submiteventDetail"
        :disabled="workSheetInfoStatus"
        :class="[workSheetInfoStatus ? 'disabled' : '']"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  addWorkSheet, //新增工单
  getWorkSheetInfo,
  getUserList,
  checkAlarmReport,
} from '@/utils/api'
import { getFormatDate, timeChangeType } from '@/utils/mutil'
export default {
  name: 'aiEventDetail',
  data() {
    return {
      form: {
        workSheetName: '',
        handlerName: '',
        longtitude: '',
        latitude: '',
        submitTime: '',
        processMode: 0, //0是直接处理 1是转工单
        workSheetType: '', //工单类型
        workSheetLevel: '', //工单等级
        // startTime: this.time(new Date()).split(" ")[0] + " " + "08:00:00",
        // endTime: this.time(new Date()).split(" ")[0] + " " + "20:00:00",
        startTime: '',
        endTime: '',
      },

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
      formData: {
        handlerRelatedList: [],
      },
      eventId: this.$store.state.aiEventId,
      rules: {
        workSheetName: [
          { required: true, trigger: 'change', message: '工单名称必填' },
        ],
        workSheetType: [
          { required: true, trigger: 'change', message: '工单类型必选' },
        ],
        workSheetLevel: [
          {
            required: true,
            trigger: 'change',
            message: '工单紧急程度必选',
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
      },
      workSheetInfoStatus: false,
      userList: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          let endDateVal = this.form.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          let beginDateVal = this.form.startTime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        },
      },
      modifyEdit: false,
    }
  },
  mounted() {
    this.fetchWorkSheetInfo()
    this.getUserTreeList()
    this.formData.handlerRelatedList = [
      {
        handlerId: '',
        description: '',
        add: true,
        fujian: this.$parent.infoObj.alarmSnapUrl,
      },
    ]
  },

  methods: {
    time(a) {
      const resDate =
        a.getFullYear() +
        '-' +
        this.p(a.getMonth() + 1) +
        '-' +
        this.p(a.getDate())
      const resTime =
        this.p(a.getHours()) +
        ':' +
        this.p(a.getMinutes()) +
        ':' +
        this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    //删除处理人
    deleteUser(index) {
      if (this.formData.handlerRelatedList.length > 1) {
        this.formData.handlerRelatedList.splice(index, 1)
      } else {
        this.$warn('至少选择一个处理人')
      }
    },
    //添加处理人
    addUser() {
      this.formData.handlerRelatedList.push({
        handlerId: '',
        description: '',
        reduce: true,
      })
    },
    //获取用户数
    getUserTreeList() {
      getUserList({
        pageInfo: { pageNum: 1, pageSize: 50 },
        organizationId: 0,
      }).then((res) => {
        console.log(res)
        this.userList = res.userList
      })
    },
    changeStartTime() {},
    // 改变结束时间
    changeEndTime() {
      // let now = new Date().valueOf();
      // if (now > this.form.endTime) {
      //   this.form.endTime = new Date().valueOf() + 86400000;
      // }
    },
    //获取父工单详情
    fetchWorkSheetInfo() {
      getWorkSheetInfo({ eventId: this.eventId }).then((res) => {
        console.log(res, 'res')
        if (res.workSheetInfo) {
          this.workSheetInfoStatus = true
          this.form = res.workSheetInfo
          if (res.workSheetInfo) {
            this.$store.commit('alarmparentInfo', res.workSheetInfo)
          }
          this.form.processMode = res.workSheetInfo.processMode
          this.formData.handlerRelatedList = this.form.handlerRelatedList
          this.form.startTime = timeChangeType(this.form.startTime)
          this.form.endTime = timeChangeType(this.form.endTime)
          this.modifyEdit = true
        } else {
          // this.setFormRules();
        }
      })
    },
    //返回
    backTopatroldetail() {
      this.$store.commit('dealAialarm', 1)
    },
    //关闭
    closeAll() {
      this.$store.commit('dealAialarm', 0)
    },
    //提交巡逻工单
    submiteventDetail() {
      let data = {
        processMode: 0,
        eventId: this.$store.state.aiEventId,
        workSheetType: 1,
      }
      //转工单
      if (Number(this.form.processMode) == 1) {
        Object.assign(this.form, data)
        this.form.processMode = 1
        this.form.handlerRelatedList = this.formData.handlerRelatedList
        console.log(this.form.startTime, this.form.endTime)
        this.form.startTime !== ''
          ? (this.form.startTime = getFormatDate(this.form.startTime))
          : (this.form.startTime = '')
        this.form.endTime !== ''
          ? (this.form.endTime = getFormatDate(this.form.endTime))
          : (this.form.endTime = '')
        this.form.eventImgUrl = this.$parent.infoObj.alarmSnapUrl
        this.form.eventTime = this.$parent.infoObj.alarmTime

        this.$refs['form2'].validate((valid) => {
          if (valid) {
            //审核通过
            this.$refs['elform2'].validate((valid2) => {
              if (valid2) {
                let obj = {
                  alarmId: this.$store.state.alarmItem.alarmId,
                  alarmGroupType: this.$store.state.alarmItem.alarmGroup,
                  cameraId: this.$store.state.alarmItem.deviceId,
                  alarmTime: this.$store.state.alarmItem.alarmTime,
                  checkResult: 2, //正检2
                }
                checkAlarmReport(obj).then((res) => {
                  if (res.resultCode == 0) {
                    addWorkSheet(this.form).then((res) => {
                      if (res.resultCode == 0) {
                        this.$success('提交成功')
                        this.$store.commit('dealAialarm', 0)
                        //处理列表页
                        this.$emit('refresh', true)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      if (Number(this.form.processMode) == 0) {
        this.form.processMode = Number(this.form.processMode)
        this.form.eventId = this.$store.state.aiEventId
        this.form.eventImgUrl = this.$parent.infoObj.alarmSnapUrl
        this.form.workSheetType = 1
        this.form.eventTime = this.$parent.infoObj.alarmTime
        let obj = {
          alarmId: this.$store.state.alarmItem.alarmId,
          alarmGroupType: this.$store.state.alarmItem.alarmType,
          cameraId: this.$store.state.alarmItem.deviceId,
          alarmTime: this.$store.state.alarmItem.alarmTime,
          checkResult: 1, //正检2
        }
        checkAlarmReport(obj).then((res) => {
          if (res.resultCode == 0) {
            addWorkSheet(this.form).then((res) => {
              if (res.resultCode == 0) {
                this.$success('处理成功')
                this.workSheetInfoStatus = true
                this.$emit('refresh', true)

                //正误检
              }
            })
          }
        })
      }
    },
    //事件闭环进展
    toclosedLoop() {
      this.$store.commit('dealAialarm', 3)
    },
    //校验规则
    // setFormRules() {
    //   this.rules = {
    //     workSheetName: [
    //       { required: true, trigger: "blur", message: "工单名称必填" },
    //     ],
    //     workSheetType: [
    //       { required: true, trigger: "change", message: "工单类型必选" },
    //     ],
    //     workSheetLevel: [
    //       {
    //         required: true,
    //         trigger: "change",
    //         message: "工单紧急程度必选",
    //       },
    //     ],
    //     startTime: [
    //       {
    //         required: true,
    //         message: "请选择开始时间",
    //         trigger: "change",
    //       },
    //     ],
    //     endTime: [
    //       {
    //         required: true,
    //         message: "请选择结束时间",
    //         // validator: this.pickerOptionsEnd,
    //         trigger: "change",
    //       },
    //     ],
    //   };
    // },
  },
}
</script>

<style lang="scss">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: transparent !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
  background-color: #70a9ff !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background-color: transparent !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
  background-color: transparent;
}
.eventDetail {
  width: 600px;
  min-height: 473px;
  padding: 20px;
  border-radius: 8px;
  pointer-events: auto;
  position: absolute;
  right: 500px;
  top: 120px;
  background: url('../../../minivisionAlarm/images/800.png');
  background-size: 100% 100%;
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
  }
  .el-input.is-disabled .el-input__inner {
    border-color: #00ccff;
  }
  .mywrapper {
    display: inline-block;
    width: 420px;
  }
  .mytextArea22 {
    background-color: #4d4d4d;
    width: 391px !important;
    border: none;
    color: white;
    font-size: 16px;
    min-height: 60px;
    border-radius: 6px;
    padding: 5px;
    resize: none;
  }
  .topContent {
    display: flex;
    justify-content: space-between;
    .topTitle {
      display: flex;
      .jinzhan {
        font-size: 14px;
        font-weight: 400;
        color: #1efffc;
      }
      .bihuan {
        font-size: 14px;
        font-weight: 400;
        color: #00ccff;
        margin-left: 17px;
        cursor: pointer;
      }
    }
    .iconclose {
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .formemit {
    padding-top: 20px;
    .el-textarea__inner {
      background: #192f3f;
      opacity: 0.65;
      border: 1px solid #00ccff;
      color: #ffffff;
      font-size: 16px;
    }
    .el-form-item__content {
      width: 185px;
    }
    .el-form-item {
      display: flex;
    }
    .el-form-item__label {
      width: 90px;
    }
  }
  .bottomDeal {
    display: flex;
    justify-content: center;
    .back {
      width: 120px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #b5bdbf;
      border-radius: 4px;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
    }
    .el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover,
    .el-button {
      margin-left: 20px;
      width: 120px;
      height: 40px;
      border-radius: 4px;
      background: #00ccff;
      color: white;
      text-align: center;
    }
    .disabled {
      background: #909399 !important;
    }
  }
}
.elform {
  max-height: 450px;
  overflow-y: scroll;
}
</style>
