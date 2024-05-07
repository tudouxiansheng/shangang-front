<template>
    <cus-dialog
        :title="$t('AlarmHandlingPlanTitle.PlanInfo')"
        :visible="$parent.infoVisible"
        :width="800"
        isDetail
        @close="dialogClose"
        @open="dialogOpen"
    >
        <template slot="body">
            <el-form class="addForm long" label-suffix="：" :model="formData" inline>
                <el-form-item :label="$t('AlarmHandlingPlanForm.planName')">
                    {{ formData.disposalPlanName }}
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.planDesc')">
                    {{ formData.disposalPlanDesc }}
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.planStep')">
                    <div class="stepBox" v-for="(item, i) in formData.planStep">
                        <el-form-item :label="$t('AlarmHandlingPlanForm.stepName')">
                            <div>{{ item.planStepName }}</div>
                        </el-form-item>
                        <el-form-item :label="$t('AlarmHandlingPlanForm.stepContent')">
                            <div>{{ item.planStepDesc }}</div>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('AlarmHandlingPlanForm.alarmType')">
                    <div class="alarmRow flex" v-for="item in alarmData" :key="item.key">
                        <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                        <div class="alarmRow-item2">
                            <span v-for="val in item.value" :key="val.label">
                                {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                            </span>
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
            formData: {
                planStep: [],
                disposalPlanName: '',
                disposalPlanDesc: '',
                alarmType: [],
            },
            alarmData: [],
        }
    },
    methods: {
        //获取列表
        dialogClose() {
            this.$parent.infoVisible = false
        },
        dialogOpen() {
            this.formData = this.$parent.planInfoData
            this.setAlarmType(this.formData.alarmType)
        },
        // 设置告警来源文字
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
        },
        // 设置告警类型还原
        setAlarmType(types) {
            let obj = {}
            this.$parent.alarmList.forEach((al) => {
                if (types.includes(al.alarmType)) {
                    if (!obj[al.scene]) obj[al.scene] = []
                    obj[al.scene].push(al)
                }
            })
            this.alarmData = Object.keys(obj).map((k) => {
                return {
                    key: k,
                    value: obj[k],
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
            vertical-align: initial;
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
}
</style>
