<!-- 告警修改 -->
<template>
    <cus-dialog
        :title="$t('AlarmType.Title.modifyTheAlarmType')"
        :visible.sync="$parent.dialogFormVisible"
        :width="600"
        @submit="submitForm"
        :submitLoading="maskloading"
        @close="dialogClosed"
        @open="dialogOpen"
    >
        <el-form
            slot="body"
            ref="form"
            :model="form"
            :rules="rules"
            class="addForm"
            label-position="right"
            inline
            label-suffix="："
        >
            <el-form-item :label="$t('AlarmType.Form.alarmTypeName')" prop="alarmName">
                {{ locale == 'en' ? $parent.dataForm.alarmEnName : $parent.dataForm.alarmName }}
            </el-form-item>
            <!-- <el-form-item :label="$t('AlarmType.Table.alarmType')" prop="alarmGroup">
        <el-select
          clearable
          v-model="form.alarmGroup"
          :placeholder="$t('public.select', { type: $t('AlarmType.Table.alarmType') })">
          <el-option
            v-for="(item, index) in $parent.alarmSource"
            :key="index"
            :label="item.groupName"
            :value="item.groupCode"></el-option>
        </el-select>
      </el-form-item> -->

            <el-form-item :label="$t('AlarmType.Table.alarmLevel')" prop="alarmLevel">
                <el-select
                    clearable
                    v-model="form.alarmLevel"
                    :placeholder="$t('public.select', { type: $t('AlarmType.Table.alarmLevel') })"
                >
                    <el-option
                        v-for="item in $parent.alarmLevelList"
                        :key="item.alarmLevelId"
                        :label="item.alarmLevelName"
                        :value="item.alarmLevelId"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </cus-dialog>
</template>

<script>
export default {
    data() {
        return {
            maskloading: false,
            rules: {},
            form: {
                alarmName: '', //告警类型名称
                alarmType: '',
                alarmGroup: '', //告警类型英文名称
                alarmLevel: 1, //告警级别
            },
        }
    },
    // watch: {
    //   //监听语言切换
    //   '$i18n.locale': function () {
    //     this.setFormRules()
    //   }
    // },
    async mounted() {
        //判断是否有角色权限
        this.setFormRules()
    },
    methods: {
        dialogOpen() {
            this.form = this.$parent.dataForm
        },
        dialogClosed() {
            this.$parent.dialogFormVisible = false
            this.maskloading = false
            this.$parent.dataForm = {}
        },
        setFormRules() {
            // 验证alarmType
            var reg = /^[A-Z_]+$/
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
            this.rules = {
                alarmGroup: [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('length.required'),
                    },
                ],
                alarmLevel: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                        trigger: 'change',
                    },
                ],
                // alarmType: [{ required: true, validator: validateType, trigger: 'blur' }],
                // alarmName: [
                //   {
                //     required: true,
                //     trigger: 'blur',
                //     message: this.$t('alarmTypeManage.inputTheAlarmTypeName')
                //   }
                // ],
                // alarmEnName: [
                //   {
                //     required: true,
                //     trigger: 'blur',
                //     validator: validateEnName
                //   }
                // ],
                // canLinkage: [
                //   {
                //     required: true,
                //     message: this.$t('alarmTypeManage.selectIfCanLinkage'),
                //     trigger: 'change'
                //   }
                // ],
                // canQuery: [
                //   {
                //     required: true,
                //     message: this.$t('alarmTypeManage.selectIfCanQuery'),
                //     trigger: 'change'
                //   }
                // ],
                // enable: [
                //   {
                //     required: true,
                //     message: this.$t('alarmTypeManage.selectWhetherToEnable'),
                //     trigger: 'change'
                //   }
                // ]
            }
        },

        // 表单提交
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.maskloading = true
                    let obj = {
                        alarmType: this.form.alarmType,
                        alarmGroup: this.form.alarmGroup,
                        alarmLevel: this.form.alarmLevel,
                    }
                    // 编辑告警类型
                    this.$api.modifyAlarmType(obj).then((res) => {
                        this.successResult(res, this.$t('public.modifySuccess'))
                    })
                }
            })
        },

        successResult(res, title) {
            if (res.resultCode === 0) {
                this.$parent.dialogFormVisible = false
                this.$message({
                    type: 'success',
                    message: title,
                })
                this.$parent.handleFind()
            }
            this.maskloading = false
        },
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-form {
    .el-form-item {
        width: 100%;
    }
}
</style>
