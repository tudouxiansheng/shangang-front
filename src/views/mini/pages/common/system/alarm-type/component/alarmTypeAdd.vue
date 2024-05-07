<template>
  <el-dialog
    :title="
      $parent.operation
        ? $t('alarmTypeManage.addAlertType')
        : $t('alarmTypeManage.modifyTheAlarmType')
    "
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    class="dialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules2"
      :label-width="$parent.locale == 'en' ? '240px' : '150px'"
      size="small"
      label-position="left"
      :style="$parent.locale == 'en' ? { marginLeft: '-50px' } : ''"
    >
      <el-form-item :label="$t('alarmTypeManage.alarmTypeName') + '：'" prop="alarmName">
        <el-input
          v-model="form.alarmName"
          auto-complete="off"
          :placeholder="$t('alarmTypeManage.inputTheAlarmTypeName')"
        />
      </el-form-item>

      <el-form-item :label="$t('alarmTypeManage.alarmTypeCode') + '：'" prop="alarmType">
        <el-tooltip v-if="!$parent.operation" effect="dark" :content="form.alarmType">
          <el-input v-model="form.alarmType" auto-complete="off" disabled />
        </el-tooltip>
        <el-input
          v-else
          v-model="form.alarmType"
          auto-complete="off"
          :placeholder="$t('alarmTypeManage.inputTheAlarmTypeCode')"
        />
      </el-form-item>

      <el-form-item :label="$t('alarmTypeManage.alarmClassification') + '：'" prop="alarmGroup">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.alarmGroup"
          :placeholder="$t('alarmTypeManage.selectAnAlarmCategory')"
        >
          <el-option
            v-for="(item, index) in $parent.alarmGroupTypeArray"
            :key="index"
            :label="$parent.locale == 'en' ? item.groupEnName : item.groupName"
            :value="item.groupCode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('public.alarmLevel') + '：'" prop="alarmLevel">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.alarmLevel"
          :placeholder="$t('public.alarmLevelPrompt')"
        >
          <el-option
            v-for="item in $parent.alarmLevelList"
            :key="item.alarmLevelId"
            :label="$parent.locale == 'en' ? item.alarmLevelEnName : item.alarmLevelName"
            :value="item.alarmLevelId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('alarmTypeManage.whetherToSupportQuery') + '：'" prop="canQuery">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.canQuery"
          :placeholder="$t('alarmTypeManage.whetherToSupportQueryContent')"
        >
          <el-option :label="$t('alarmTypeManage.yes')" :value="1"></el-option>
          <el-option :label="$t('alarmTypeManage.no')" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('alarmTypeManage.whetherToSupportLinkage') + '：'" prop="canLinkage">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.canLinkage"
          :placeholder="$t('alarmTypeManage.selectIfCanLinkage')"
        >
          <el-option :label="$t('alarmTypeManage.yes')" :value="1"></el-option>
          <el-option :label="$t('alarmTypeManage.no')" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('alarmTypeManage.whetherToEnable') + '：'"
        prop="enable"
        v-if="$parent.operation"
      >
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.enable"
          :placeholder="$t('alarmTypeManage.selectWhetherToEnable')"
        >
          <el-option :label="$t('alarmTypeManage.yes')" :value="1"></el-option>
          <el-option :label="$t('alarmTypeManage.no')" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      rules2: {},
      //判断是否有角色权限
      PermissionRoleManage: true,
      //密码复杂度
      pwdRules: '',
      rulesLength: [],

      form: {
        alarmName: '', //告警类型名称
        alarmEnName: '', //告警类型英文名称
        alarmGroup: '', //告警类型英文名称
        alarmType: '', //告警分类
        alarmLevel: '', //告警级别
        canQuery: 1, //是否可查询
        canLinkage: 1, //是否可联动
        enable: 1 //是否启用
      },

      rules: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    //判断是否有角色权限
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },

    setFormRules() {
      // 验证alarmType
      var reg = /^[A-Za-z_]+$/
      var validateType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('alarmTypeManage.inputTheAlarmTypeCode')))
        } else {
          if (!reg.test(value)) {
            callback(new Error(this.$t('alarmTypeManage.EngAndUnderline')))
          } else if (value.length > 64 || value.length < 1) {
            callback(new Error(this.$t('alarmTypeManage.oneToSixtyFour')))
          }
          callback()
        }
      }

      //验证英文名称
      var validateEnName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('alarmTypeManage.inputTheEnglishNameOfTheAlarmType')))
        } else {
          if (value.indexOf('*') != -1) {
            callback(new Error(this.$t('alarmTypeManage.inputEnNamePort')))
          }
          callback()
        }
      }
      this.rules2 = {
        alarmName: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('alarmTypeManage.inputTheAlarmTypeName')
          },
          {
            max: 128,
            message: this.$t('alarmTypeManage.alarmTypeManage128Prop'),
            trigger: 'blur'
          }
        ],
        alarmEnName: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEnName
          }
        ],
        alarmGroup: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('alarmTypeManage.selectAnAlarmCategory')
          }
        ],
        alarmType: [{ required: true, validator: validateType, trigger: 'blur' }],
        alarmLevel: [
          {
            required: true,
            message: this.$t('public.alarmLevelPrompt'),
            trigger: 'change'
          }
        ],
        canLinkage: [
          {
            required: true,
            message: this.$t('alarmTypeManage.selectIfCanLinkage'),
            trigger: 'change'
          }
        ],
        canQuery: [
          {
            required: true,
            message: this.$t('alarmTypeManage.selectIfCanQuery'),
            trigger: 'change'
          }
        ],
        enable: [
          {
            required: true,
            message: this.$t('alarmTypeManage.selectWhetherToEnable'),
            trigger: 'change'
          }
        ]
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.maskloading = true

          let obj = {
            alarmType: this.form.alarmType,
            alarmName: this.form.alarmName,
            alarmEnName: this.form.alarmName,
            alarmGroup: this.form.alarmGroup,
            alarmLevel: this.form.alarmLevel,
            canQuery: this.form.canQuery,
            canLinkage: this.form.canLinkage
          }
          if (!this.$parent.operation) {
            // 编辑告警类型
            this.$api.modifyAlarmType(obj).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          } else {
            Object.assign(obj, {
              enable: this.form.enable
            })
            // 添加告警类型
            this.$api.addAlarmType(obj).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>
