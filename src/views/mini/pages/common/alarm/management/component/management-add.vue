<template>
  <!-- 等级管理添加修改 -->
  <el-dialog
    :title="$parent.operation ? $t('alarmList.addAlarmLevel') : $t('alarmList.reviseAlarmLevel')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1400px"
    :close-on-click-modal="false"
    class="addManagement"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="$parent.locale == 'en' ? '300px' : '150px'"
      size="small"
      label-position="left"
    >
      <div style="display: flex">
        <el-form-item
          :label="$t('alarmList.levelName') + '：'"
          prop="alarmLevelName"
          style="width: 50%"
        >
          <el-input
            v-model="form.alarmLevelName"
            auto-complete="off"
            :placeholder="$t('alarmList.inputLevelName')"
            :disabled="disabled"
            clearable
          />
        </el-form-item>
        <div class="tips">
          <img class="logoimg" src="@/assets/img/common/tips.png" alt />
          {{ $t('alarmList.suggestedShortName') }}
        </div>
      </div>

      <div style="display: flex">
        <el-form-item
          :label="$t('alarmList.alarmWeight') + '：'"
          prop="alarmLevelValue"
          style="width: 50%"
        >
          <el-input
            v-model="form.alarmLevelValue"
            auto-complete="off"
            :placeholder="$t('alarmList.inputAlarmWeight')"
            :disabled="disabled"
            clearable
          />
        </el-form-item>
        <div class="tips">
          <img class="logoimg" src="@/assets/img/common/tips.png" alt />
          {{ $t('alarmList.higherLeval') }}
        </div>
      </div>
      <div v-if="!$parent.operation" style="font-size: 14px; line-height: 20px">
        {{ $t('alarmList.alarmType') }}
      </div>
      <div
        v-if="!$parent.operation"
        style="
          background: #fffbe8;
          margin-top: 10px;
          padding-left: 20px;
          font-size: 12px;
          font-weight: 500;
        "
      >
        <el-icon style="color: #ed6a0c; line-height: 32px"><el-icon-info /></el-icon>
        &nbsp;&nbsp;&nbsp;{{ $t('alarmList.operateTip') }}
      </div>
      <div v-if="!$parent.operation" class="alarmGroups">
        <div v-for="(item, index) in alarmGroups" :key="index" class="chooseAlarm">
          <p class="groupName">
            {{ locale == 'en' ? item.groupEnName : item.groupName }}
          </p>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(checkItem, checkIndex) in item.alarmChecks"
              :key="checkIndex"
              @change="changeChecks(checkItem, checkItem.alarmType)"
              ref="checkBox"
              :checkValue="checkItem.alarmType"
              :label="checkItem.alarmType"
              :disabled="true"
            >
              {{ checkItem.alarmName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <el-form-item
        :label="$t('alarmList.levelColor') + '：'"
        prop="color"
        style="width: 50%; margin-top: 10px"
      >
        <el-color-picker v-model="form.color" :disabled="disabled"></el-color-picker>
      </el-form-item>
      <el-form-item :label="$t('alarmList.describe') + '：'" prop="remark" style="width: 80%">
        <el-input
          type="textarea"
          :rows="2"
          maxlength="256"
          show-word-limit
          :placeholder="$t('alarmList.inputDescribe')"
          v-model="form.remark"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button
          v-has-permi="[78]"
          :loading="$parent.maskloading"
          @click="submitForm"
          type="primary"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { InfoFilled as ElIconInfo } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconInfo
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        alarmLevelName: '',
        alarmLevelEnName: '',
        alarmLevelValue: '',
        color: '#409EFF',
        remark: '',
        alarmTypes: []
      },
      rules: {},
      alarmGroups: [], // 告警组
      checkList: [],
      checkListCopy: [],
      //已选择的告警checkbox数组
      choosedCheckBoxsArr: [],
      disabled: false
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
    this.getGroups()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.disabled = false
          this.choosedCheckBoxsArr = []
        })
      }
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
        this.form.alarmTypes.forEach(element => {
          this.checkList.push(element.alarmType)
        })
        this.$parent.disabledArr.forEach(element => {
          this.checkListCopy.push(element.alarmType)
        })
        if (!this.$parent.operation) {
          let add = this.checkListCopy.filter(item => !this.checkList.some(ele => ele === item))
          this.checkListCopy = add
        }
        if (
          this.form.alarmLevelValue == '100' ||
          this.form.alarmLevelValue == '80' ||
          this.form.alarmLevelValue == '50'
        ) {
          this.disabled = true
        }
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.checkList = []
      this.checkListCopy = []
    },

    setFormRules() {
      var reg = /^([1-9][0-9]{0,1}|100)$/
      // 验证告警权值
      var validateLeval = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('alarmList.requiredAlarmLevel')))
        } else {
          if (!reg.test(value)) {
            callback(new Error(this.$t('alarmList.weightRange')))
          }
          callback()
        }
      }
      this.rules = {
        alarmLevelName: [
          {
            required: true,
            message: this.$t('alarmList.requiredLevelName'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('alarmList.requiredLevelName128Prop'),
            trigger: 'blur'
          }
        ],
        alarmLevelEnName: [
          {
            required: true,
            message: this.$t('alarmList.requiredLevelEnName'),
            trigger: 'blur'
          }
        ],
        alarmLevelValue: [
          {
            required: true,
            validator: validateLeval,
            trigger: 'blur'
          }
        ],
        color: [
          {
            required: true,
            message: this.$t('alarmList.requiredColor'),
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: this.$t('alarmList.requiredDescribe'),
            trigger: 'blur'
          }
        ]
      }
      this.locale = localStorage.getItem('locale')
    },
    //获取告警组
    getGroups() {
      this.$api.getGroupsQuery({}).then(res => {
        if (res.resultCode == 0) {
          this.alarmGroups = res.alarmGroups
          this.alarmGroups.forEach(item => {
            let getAlarmTypesObj = {
              alarmGroup: item.groupCode,
              canLinkage: 1 //过滤可联动的告警类型
            }
            //获取告警类型
            this.$api.getAlarmTypesQuery(getAlarmTypesObj).then(res1 => {
              if (res1.resultCode == 0) {
                item.alarmChecks = res1.alarmTypeList
              }
            })
          })
        }
      })
    },
    //选择告警类型
    changeChecks(item, itemType) {
      if (this.choosedCheckBoxsArr.indexOf(itemType) == -1) {
        this.choosedCheckBoxsArr.push(itemType)
      } else {
        this.choosedCheckBoxsArr.splice(this.choosedCheckBoxsArr.indexOf(itemType), 1)
      }

      let obj = {}
      obj.alarmGroup = item.alarmGroup
      obj.alarmName = item.alarmName
    },
    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          this.form.alarmLevelEnName = this.form.alarmLevelName
          if (this.$parent.operation) {
            this.form.alarmTypes = undefined
            let data = this.form
            this.$api.addAlarmLevel(data).then(res => {
              this.successBack(res, this.$t('public.addSuccess'))
            })
          } else {
            this.form.alarmLevelId = this.$parent.dataForm.alarmLevelId
            this.form.alarmTypes = this.choosedCheckBoxsArr
            let data = this.form
            this.$api.modifyAlarmLevel(data).then(res => {
              this.successBack(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },

    successBack(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.getTemplateList()
      } else {
        this.form.permList = [] //清空表单提交数组数据
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.addManagement {
  .el-dialog__body {
    padding: 15px;
    overflow-x: hidden;
    .tips {
      width: 50%;
      line-height: 34px;
      margin-left: 20px;
      color: #aaaaaa;
      opacity: 1;
      img {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .alarmGroups {
      display: flex;
      overflow-x: auto;
      .chooseAlarm {
        width: 25%;
        border: 1px solid #535353;
        margin: 20px 10px 0;

        .groupName {
          padding: 10px 0px;
          border-bottom: 1px solid #535353;
          margin: 0px;
          text-align: center;
        }
        .el-checkbox-group {
          padding: 10px;
          height: 400px;
          overflow-y: auto;
          .el-checkbox {
            margin-bottom: 5px;
            display: block;
          }
        }
      }
    }
  }
}
</style>
