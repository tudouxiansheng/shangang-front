<template>
    <cus-dialog
        :title="operation === 0 ? $t('AlarmHandlingPlanTitle.addPlan') : $t('AlarmHandlingPlanTitle.editPlan')"
        :visible="$parent.addVisible"
        :width="800"
        @close="dialogClose"
        @open="dialogOpen"
        @submit="submitForm"
        :submitLoading="loading"
    >
        <template slot="body">
            <el-form ref="forms" class="addForm long" label-suffix="：" inline :model="formData" :rules="formRule">
                <el-form-item :label="$t('AlarmHandlingPlanForm.planName')" prop="disposalPlanName">
                    <el-input
                        v-model="formData.disposalPlanName"
                        :placeholder="$t('public.input', { type: $t('AlarmHandlingPlanForm.planName') })"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.planDesc')" prop="disposalPlanDesc">
                    <el-input
                        v-model="formData.disposalPlanDesc"
                        type="textarea"
                        :placeholder="$t('public.input', { type: $t('AlarmHandlingPlanForm.planDesc') })"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.planStep')" prop="stepStutas">
                    <el-input v-model="formData.stepStutas" v-show="false"></el-input>
                    <div class="stepBox" v-for="(item, i) in formData.planStep">
                        <el-form-item :label="$t('AlarmHandlingPlanForm.stepName')">
                            <el-input
                                v-model="item.planStepName"
                                maxlength="30"
                                show-word-limit
                                :placeholder="$t('public.input', { type: $t('AlarmHandlingPlanForm.stepName') })"
                            ></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('AlarmHandlingPlanForm.stepContent')">
                            <el-input
                                type="textarea"
                                :placeholder="$t('public.input', { type: $t('AlarmHandlingPlanForm.stepContent') })"
                                v-model="item.planStepDesc"
                                maxlength="100"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                        <span class="close" @click="delStep(i)">X</span>
                        <!-- <span class="close" @click="delStep(i)" v-if="i > 0">X</span> -->
                    </div>
                    <el-button type="primary" @click="addStep">
                        {{ $t('AlarmHandlingPlanButton.addStep') }}
                    </el-button>
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.alarmType')" prop="alarmType">
                    <div class="alarmRow flex" v-for="item in $parent.alarmData" :key="item.key">
                        <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                        <div class="alarmRow-item2">
                            <el-checkbox-group v-model="formData.alarmType">
                                <el-checkbox
                                    v-for="val in item.value"
                                    :label="val.alarmType"
                                    :key="val.label"
                                    :disabled="disableAlarmType.includes(val.alarmType)"
                                >
                                    {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </template>
    </cus-dialog>
</template>

<script>
export default {
    props: {
        sceneList: {
            type: Array,
        },
    },
    data() {
        return {
            // alarmData: [],
            loading: false,
            operation: '',
            formData: {
                stepStutas: '',
                planStep: [
                    {
                        planStepName: '',
                        planStepDesc: '',
                    },
                ],
                disposalPlanName: '',
                disposalPlanDesc: '',
                alarmType: [],
            },
            formRule: {
                disposalPlanName: [
                    {
                        required: true,
                        transform: (value) => value?.trim(), //不计算前后空格
                        message: this.$t('length.required'),
                    },
                    {
                        max: 30,
                        message: this.$t('length.less30'),
                    },
                ],
                stepStutas: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (this.formData.planStep.length) {
                                callback()
                            } else {
                                callback(new Error(this.$t('length.required')))
                            }
                        },
                    },
                ],
            },
            disableAlarmType: [], //已选择过的类型
        }
    },
    methods: {
        //获取列表
        dialogClose() {
            this.$parent.addVisible = false
        },
        async dialogOpen() {
            this.operation = this.$parent.operation
            this.$refs?.forms.resetFields()
            await this.getDisabledType()
            if (this.operation == 0) {
                this.formData.planStep = [
                    {
                        planStepName: '',
                        planStepDesc: '',
                    },
                ]
            } else {
                // 作回显并禁选
                this.disableAlarmType = this.disableAlarmType.filter(
                    (t) => !this.$parent.planInfoData.alarmType.includes(t)
                )
                let alarmType = this.$parent.planInfoData.alarmType.concat(this.disableAlarmType)
                this.formData = {
                    stepStutas: '',
                    planStep: this.$parent.planInfoData.planStep,
                    disposalPlanName: this.$parent.planInfoData.disposalPlanName,
                    disposalPlanDesc: this.$parent.planInfoData.disposalPlanDesc,
                    alarmType,
                    id: this.$parent.planInfoData.id,
                }
            }
        },
        // 获取禁选的类型
        async getDisabledType() {
            await this.$api.getAlarmTypeByPlan({}).then((res) => {
                if (res.resultCode == 0) {
                    this.disableAlarmType = []
                    if (res.alarmTypeList) {
                        this.disableAlarmType = res.alarmTypeList
                        this.formData.alarmType = res.alarmTypeList
                    }
                }
            })
        },
        // 设置告警来源文字
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
        },
        // 增加步骤
        addStep() {
            this.formData.planStep.push({
                planStepName: '',
                planStepDesc: '',
            })
            this.$refs.forms.validateField('stepStutas')
        },
        // 删除步骤
        delStep(index) {
            this.formData.planStep.splice(index, 1)
            this.$refs.forms.validateField('stepStutas')
        },
        submitForm() {
            this.$refs.forms.validate((valid) => {
                if (valid) {
                    let complete = true
                    this.formData.planStep.some((step) => {
                        if (!step.planStepName || !step.planStepDesc) {
                            complete = false
                        }
                    })
                    if (!complete) {
                        return this.$message.warning(this.$t('AlarmHandlingPlan.Tips.stepMust'))
                    }
                    this.loading = true
                    let alarmType = this.formData.alarmType
                    alarmType = alarmType.filter((a) => !this.disableAlarmType.includes(a))

                    let disposalPlanInfo = {
                        disposalPlanName: this.formData.disposalPlanName,
                        disposalPlanDesc: this.formData.disposalPlanDesc,
                        alarmType: alarmType.join(','),
                        planStepList: [],
                    }
                    disposalPlanInfo.planStepList = this.formData.planStep.map((s, i) => {
                        s.sort = i + 1
                        return s
                    })
                    if (this.operation == 0) {
                        this.$api
                            .addAlarmPlan({
                                disposalPlanInfo,
                            })
                            .then((res) => {
                                this.loading = false
                                if (res.resultCode == 0) {
                                    this.$message.success(this.$t('public.addSuccess'))
                                    this.$parent.addVisible = false
                                    this.$parent.handleFind()
                                }
                            })
                    } else {
                        disposalPlanInfo.id = this.formData.id
                        this.$api
                            .modifyAlarmPlan({
                                disposalPlanInfo,
                            })
                            .then((res) => {
                                this.loading = false
                                if (res.resultCode == 0) {
                                    this.$message.success(this.$t('public.modifySuccess'))
                                    this.$parent.addVisible = false
                                    this.$parent.handleFind()
                                }
                            })
                    }
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.el-form-item {
    width: 100%;
}
.stepBox {
    padding: 10px;
    background: #134b71;
    margin-bottom: 10px;
    position: relative;
    .close {
        display: none;
    }
    &:hover {
        .close {
            user-select: none;
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: #23bfff;
            color: #fff;
            position: absolute;
            top: -5px;
            right: -5px;
            cursor: pointer;
            line-height: 20px;
            text-align: center;
        }
    }
    ::v-deep .el-form-item {
        .el-form-item__label {
            width: 120px !important;
        }
        .el-form-item__content {
            width: calc(100% - 120px) !important;
        }
    }
}
.alarmRow {
    width: 100%;
    border: 1px solid #156c9e;
    background: #134b71;
    &-item1 {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30%;
        border-right: 1px solid #156c9e;
    }
    &-item2 {
        padding: 10px 20px;
        width: 70%;
    }
    ::v-deep .el-checkbox-group {
        display: flex;
        //   flex-direction: column;
        flex-wrap: wrap;
        height: 100%;
        .el-checkbox {
            color: #fff;
            width: 50%;
        }
    }
}
</style>
