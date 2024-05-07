<template>
    <cus-dialog
        :title="operation == 0 ? $t('AlarmPushRule.Title.addRule') : $t('AlarmPushRule.Title.editRule')"
        :width="1340"
        :visible.sync="show"
        @close="dialogClose"
        @open="dialogOpen"
    >
        <template slot="body">
            <el-steps :active="stepIndex" align-center finish-status="success">
                <el-step :title="$t('AlarmPushRule.Title.device')"></el-step>
                <el-step :title="$t('AlarmPushRule.Title.alarmType')"></el-step>
                <el-step :title="$t('AlarmPushRule.Title.recipient')"></el-step>
                <el-step :title="$t('AlarmPushRule.Title.receiveTime')"></el-step>
                <el-step :title="$t('AlarmPushRule.Title.complete')"></el-step>
            </el-steps>
            <el-form
                label-suffix="："
                label-position="right"
                class="addForm long"
                inline
                ref="myForm"
                :model="formData"
                :rules="rules"
            >
                <!-- 第一步 -->
                <div v-show="stepIndex == 0">
                    <el-form-item :label="$t('AlarmPushRule.Form.ruleName')" prop="ruleName">
                        <el-input
                            v-model="formData.ruleName"
                            :placeholder="$t('public.input', { type: $t('AlarmPushRule.Form.ruleName') })"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('AlarmPushRule.Title.device')" prop="deviceGroup">
                        <CameraTree
                            v-if="show"
                            :canModify="true"
                            :repalyIdArr="cameraIds"
                            ref="camera"
                            :dataOption="{ dataType: 'all', strictly: true }"
                        ></CameraTree>
                    </el-form-item>
                </div>
                <!-- 第二步 -->
                <div v-show="stepIndex == 1">
                    <el-form-item :label="$t('AlarmPushRule.Title.alarmType')" prop="alarmTypes">
                        <div class="alarmRow flex" v-for="item in alarmData" :key="item.key">
                            <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                            <div class="alarmRow-item2">
                                <el-checkbox-group v-model="formData.alarmTypes">
                                    <el-checkbox v-for="val in item.value" :label="val.alarmType" :key="val.label">
                                        {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <!-- 第三步 -->
                <div v-show="stepIndex == 2">
                    <el-form-item :label="$t('AlarmPushRule.Title.recipient')" prop="roleIds">
                        <div class="flex">
                            <div class="user-type" :class="userIndex == 0 ? 'active' : ''" @click="userTypeChg(0)">
                                {{ $t('AlarmPushRule.Title.byRole') }}
                            </div>
                            <div class="user-type" :class="userIndex == 1 ? 'active' : ''" @click="userTypeChg(1)">
                                {{ $t('AlarmPushRule.Title.byUser') }}
                            </div>
                        </div>
                        <div v-show="userIndex == 0" class="role-box">
                            <el-checkbox-group v-model="formData.roleIds">
                                <el-checkbox v-for="role in rolesData" :key="role.roleId" :label="role.roleId">
                                    {{ role.roleName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-show="userIndex == 1">
                            <!-- 查询具有告警perm的人员树 -->
                            <UserTree
                                :canModify="true"
                                :repalyIdArr="userIds"
                                ref="userTree"
                                @clearAll="clearUser"
                                @nodeCheck="nodeCheck"
                                v-if="show"
                            ></UserTree>
                        </div>
                    </el-form-item>
                </div>
                <!-- 第四步 -->
                <div v-show="stepIndex == 3">
                    <el-form-item :label="$t('AlarmPushRule.Title.receiveTime')" prop="timeType">
                        <el-input v-model="formData.timeType" v-show="false"></el-input>
                        <div
                            class="flex timeType"
                            :class="[formData.timeType === 1 ? 'active' : '']"
                            @click="formData.timeType = 1"
                        >
                            <div class="type">{{ $t('AlarmPushRule.Form.allDay') }}</div>
                            <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip1') }}</div>
                            <i v-if="formData.timeType === 1" class="check aci-check iconCss"></i>
                        </div>
                        <div
                            class="flex timeType"
                            :class="[formData.timeType == 2 ? 'active' : '']"
                            @click="formData.timeType = 2"
                        >
                            <div class="type">{{ $t('AlarmPushRule.Form.workDay') }}</div>
                            <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip2') }}</div>
                            <i v-if="formData.timeType === 2" class="check aci-check iconCss"></i>
                        </div>
                        <div
                            class="flex timeType"
                            :class="[formData.timeType == 3 ? 'active' : '']"
                            @click="formData.timeType = 3"
                        >
                            <div class="type">{{ $t('AlarmPushRule.Form.weekend') }}</div>
                            <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip3') }}</div>
                            <i v-if="formData.timeType === 3" class="check aci-check iconCss"></i>
                        </div>
                        <div
                            class="flex timeType"
                            :class="[formData.timeType == 4 ? 'active' : '']"
                            @click="formData.timeType = 4"
                        >
                            <div class="type">{{ $t('AlarmPushRule.Form.custom') }}</div>
                            <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip4') }}</div>
                            <i v-if="formData.timeType === 4" class="check aci-check iconCss"></i>
                        </div>
                        <div v-show="formData.timeType == 4">
                            <el-radio-group v-model="planType" @change="planTypeChange">
                                <el-radio v-for="item in planTypeList" :label="item.value" :key="item.value">
                                    {{ $t(item.name) }}
                                </el-radio>
                            </el-radio-group>
                            <el-button type="text" @click="clearAll" style="position: absolute; right: 0">
                                {{ $t('IntelligentTask.Button.clearAll') }}
                            </el-button>
                            <!-- 网格时间选择控件 -->
                            <time-grid-control ref="timeGridControl" id="time_grid_control"></time-grid-control>
                        </div>
                    </el-form-item>
                </div>
                <!-- 完成 -->
                <div v-show="stepIndex == 4" style="display: flex; flex-direction: column; align-items: center">
                    <h2 v-if="$parent.operation == 0">
                        <i class="el-icon-success"></i>
                        {{ $t('AlarmPushRule.Tips.addRuleSucc') }}
                    </h2>
                    <h2 v-else>
                        <i class="el-icon-success"></i>
                        {{ $t('AlarmPushRule.Tips.editRuleSucc') }}
                    </h2>
                    <p>{{ $t('AlarmPushRule.Tips.clickButtonTo') }}</p>
                </div>
            </el-form>
        </template>
        <template slot="footer">
            <el-button type="primary" @click="preBack" v-show="stepIndex > 0 && stepIndex < 4">
                {{ $t('public.previousStep') }}
            </el-button>
            <el-button type="primary" @click="nextTo" v-show="stepIndex < 3">
                {{ $t('public.nextStep') }}
            </el-button>
            <el-button type="primary" @click="submitForm" v-show="stepIndex == 3">
                {{ $t('public.save') }}
            </el-button>
            <el-button v-show="stepIndex == 4" type="primary" @click="backToList">
                {{ $t('AlarmPushRule.Button.backToList') }}
            </el-button>
            <el-button v-show="stepIndex == 4" type="success" @click="viewInfo">
                {{ $t('AlarmPushRule.Button.viewInfo') }}
            </el-button>
        </template>
    </cus-dialog>
</template>

<script>
const CameraTree = () => import('@/components/CameraTree')
const UserTree = () => import('@/components/UserTree')
const timeGridControl = () => import('@/components/time-grid-control.vue')
export default {
    components: {
        CameraTree,
        UserTree,
        timeGridControl,
    },
    props: {
        datas: {
            type: Object,
            default: function () {
                return {
                    ruleName: '',
                    alarmTypes: [],
                    roleIds: [],
                }
            },
        },
        operation: {
            type: Number,
        },
        sceneList: {
            type: Array,
        },
    },
    data() {
        return {
            show: false,
            stepIndex: 0,
            userIndex: 0,
            alarmData: [],
            rolesData: [],
            formData: {},
            policyId: '',
            cameraIds: [], //回显的摄像机集
            userIds: [], //回显的用户集
            planType: 1,
            periodList: [], //时间回显
            rules: {
                ruleName: [
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
                deviceGroup: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            //校验用户
                            this.$nextTick(() => {
                                let datas = this.$refs.camera.getSaveData()
                                if (datas.length) {
                                    callback()
                                } else {
                                    callback(new Error(this.$t('length.required')))
                                }
                            })
                        },
                        trigger: 'change',
                    },
                ],
                alarmTypes: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                    },
                ],
                roleIds: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (this.userIndex == 0) {
                                //校验角色
                                if (this.formData.roleIds.length) {
                                    callback()
                                } else {
                                    callback(new Error(this.$t('length.required')))
                                }
                            } else {
                                //校验用户
                                this.$nextTick(() => {
                                    let datas = this.$refs.userTree.getUserSaveData()
                                    if (datas.length) {
                                        callback()
                                    } else if (this.userIds.length) {
                                        callback()
                                    } else {
                                        callback(new Error(this.$t('length.required')))
                                    }
                                })
                            }
                        },
                    },
                ],
                timeType: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (value == 4) {
                                if (!this.$refs.timeGridControl.getTimeSpanList().length) {
                                    callback(this.$t('length.required'))
                                } else callback()
                            } else {
                                callback()
                            }
                        },
                    },
                ],
            },
            planTypeList: [
                {
                    name: 'IntelligentTask.Form.dayPlan',
                    value: 1,
                },
                {
                    name: 'IntelligentTask.Form.weekPlan',
                    value: 0,
                },
            ],
        }
    },
    methods: {
        dialogClose() {
            this.show = false
            if (this.stepIndex == 4) this.$parent.handleFind()
        },
        dialogOpen() {
            if (!this.alarmData.length) this.getAlarmType()
            if (!this.rolesData.length) this.getRoles()
            this.cameraIds = []
            this.userIds = []
            this.stepIndex = 0
            this.policyId = ''
            this.formData = {
                ruleName: '',
                alarmTypes: [],
                roleIds: [],
                timeType: 1,
            }
            this.planType = 1
            // 新增
            if (this.operation == 0) {
                this.userIndex = 0
                this.$nextTick(() => {
                    this.$refs.myForm.clearValidate()
                    this.$refs.timeGridControl.time_initialize(this.planType, 2, [
                        {
                            dayType: 0,
                            startTime: '00:00:00',
                            stopTime: '23:59:59',
                        },
                    ])
                })
            } else {
                this.$nextTick(() => {
                    this.$refs.timeGridControl.time_initialize(this.planType, 2, [
                        {
                            dayType: 0,
                            startTime: '00:00:00',
                            stopTime: '23:59:59',
                        },
                    ])
                    //编辑
                    this.formData.ruleName = this.datas.ruleName
                    this.formData.alarmTypes = this.datas.alarmTypes || []
                    this.formData.roleIds = this.datas.roleIds || []
                    let actionParam = JSON.parse(this.datas.actionParam)
                    if (actionParam.timeList) {
                        this.formData.timeType = actionParam?.timeList[0].type || 1
                        if (this.formData.timeType == 4) {
                            this.periodList = actionParam.timeList[0].periodList
                            this.planType = this.periodList[0].dayType == 0 ? 1 : 0
                            this.$refs.timeGridControl.time_initialize(this.planType, 2, this.periodList)
                        }
                    }
                    this.policyId = this.datas.policyId
                    let arr = []
                    actionParam.cameraList.forEach((c) => {
                        arr.push({
                            type: 2,
                            id: c,
                        })
                    })
                    actionParam.areaList.forEach((c) => {
                        arr.push({
                            type: 1,
                            id: c,
                        })
                    })
                    this.cameraIds = arr
                    if (actionParam.roleList && actionParam.roleList.length) {
                        this.userIndex = 0
                        this.formData.roleIds = actionParam.roleList
                    } else {
                        this.userIndex = 1
                        let arr = []
                        actionParam?.userList.forEach((id) => {
                            arr.push({
                                type: 2,
                                id,
                            })
                        })
                        actionParam?.orgList.forEach((id) => {
                            arr.push({
                                type: 1,
                                id,
                            })
                        })
                        this.userIds = arr
                        this.$refs.myForm.validateField('roleIds')
                    }
                })
            }
        },
        /**
         * 下一步 校验前两步步骤
         */
        nextTo() {
            let msgList = []
            if (this.stepIndex == 0) {
                this.$refs.myForm.validateField('ruleName', (msg) => {
                    this.$refs.myForm.validateField('deviceGroup', (msg2) => {
                        if (!msg && !msg2) this.stepIndex++
                    })
                })
            } else if (this.stepIndex == 1) {
                this.$refs.myForm.validateField(['alarmTypes'], (msg) => {
                    if (!msg) msgList.push(msg)
                })
                // 通过数等于校验数
                if (msgList.length == 1) {
                    this.stepIndex++
                }
            } else if (this.stepIndex == 2) {
                this.$refs.myForm.validateField(['roleIds'], (msg) => {
                    // 校验通过
                    if (!msg) {
                        this.stepIndex++
                    }
                })
            } else if (this.stepIndex == 3) {
                this.stepIndex++
            }
        },
        // 上一步
        preBack() {
            this.stepIndex--
        },
        // 提交
        submitForm() {
            this.$refs.myForm.validateField(['timeType'], (msg) => {
                // 校验通过
                if (!msg) {
                    // 参数处理并保存
                    let obj = {
                        alarmTypes: this.formData.alarmTypes,
                        actionList: [],
                    }
                    let _params = {
                        ruleName: this.formData.ruleName,
                        actionSort: 0,
                        actionType: 31,
                    }
                    obj.actionList.push(_params)
                    let actionParam = {
                        cameraList: [],
                        areaList: [],
                        timeList: [],
                    }
                    // 处理告警设备信息
                    this.cameraIds = this.$refs.camera.getSaveData()
                    this.cameraIds.forEach((c) => {
                        if (c.type == 1) actionParam.areaList.push(c.id)
                        if (c.type == 2) actionParam.cameraList.push(c.id)
                    })
                    // 处理接收人信息
                    if (this.userIndex == 0) {
                        actionParam.roleList = this.formData.roleIds
                    } else {
                        this.userIds = this.$refs.userTree.getUserSaveData()
                        if (!this.userIds.length) return this.$refs.myForm.validateField('roleIds')
                        actionParam.orgList = this.userIds.filter((u) => u.type == 1).map((u) => u.id)
                        actionParam.userList = this.userIds.filter((u) => u.type == 2).map((u) => u.id)
                    }
                    actionParam.timeList.push({
                        type: this.formData.timeType,
                        periodList: this.formData.timeType == 4 ? this.$refs.timeGridControl.getTimeSpanList() : [],
                    })
                    _params.actionParam = JSON.stringify(actionParam)
                    if (!!this.policyId) {
                        _params.policyId = this.policyId
                        this.$api.modifyLinkagePolicyInfo({ param: obj, policyId: this.policyId }).then((res) => {
                            if (res.resultCode == 0) {
                                // 保存成功后
                                this.stepIndex++
                            }
                        })
                    } else {
                        this.$api.addLinkagePolicyInfo({ param: obj }).then((res) => {
                            if (res.resultCode == 0) {
                                this.policyId = res.policyId
                                // 保存成功后
                                this.stepIndex++
                            }
                        })
                    }
                }
            })
        },
        userTypeChg(index) {
            if (this.userIndex == index) return
            this.userIndex = index
            if (index == 0) {
                this.formData.roleIds = []
                this.$refs.userTree.removeAllSel()
            }
            if (index == 1) this.userIds = []
            // this.$nextTick(() => {
            //   this.$refs.myForm.clearValidate()
            // })
        },
        planTypeChange(val) {
            if (this.$refs.timeGridControl) {
                this.$refs.timeGridControl.planTypeChange(val)
            }
        },
        // 清除全部
        clearAll() {
            this.$refs.timeGridControl.clearAll()
        },
        // 编辑的时候点击清空用户
        clearUser() {
            this.userIds = []
        },
        nodeCheck(node, check, nodes) {
            if (!check) {
                if (!nodes.checkedNodes.length) this.userIds = []
            }
        },
        // 保存成功后返回列表
        backToList() {
            this.show = false
            this.$parent.handleFind()
        },
        // 查看详情信息
        viewInfo() {
            this.show = false
            this.$parent.handleFind()
            this.$parent.handleView({ policyId: this.policyId })
        },
        // 获取告警类型 并分类
        getAlarmType() {
            this.$api
                .getAlarmTypes({
                    pageInfo: {
                        pageNum: 1,
                    },
                })
                .then((res) => {
                    if (res.resultCode == 0) {
                        let obj = {}
                        if (res.alarmTypeList && res.alarmTypeList.length) {
                            res.alarmTypeList.forEach((al) => {
                                if (!obj[al.scene]) obj[al.scene] = []
                                obj[al.scene].push(al)
                            })
                            this.alarmData = Object.keys(obj).map((k) => {
                                return {
                                    key: k,
                                    value: obj[k],
                                }
                            })
                        }
                    }
                })
        },
        // 获取角色
        getRoles() {
            this.$api
                .selectRoles({
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 500,
                    },
                })
                .then((res) => {
                    if (res.resultCode == 0) {
                        if (res.roleList && res.roleList.length) {
                            this.rolesData = res.roleList
                        }
                    }
                })
        },
        // 设置告警来源文字
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
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
::v-deep .el-steps {
    width: 100%;
    margin-bottom: 20px;
    .el-step__icon.is-text {
        width: 68px;
        height: 68px;
        // border-color: #64BEFD;
        background: transparent;
        color: #fff;
    }
    .el-step.is-center .el-step__line {
        left: 65%;
        top: 33px;
        width: 70.3%;
    }
    .el-step__head.is-process .el-step__icon.is-text {
        border-color: #64befd !important;
        color: #64befd;
    }
    .el-step__title.is-process {
        color: #64befd;
    }
    .el-step__title.is-success {
        color: #ccc;
    }
    .el-step__head.is-success .el-step__icon.is-text {
        border-color: #64befd !important;
        background: #64befd;
    }
    .el-step__head.is-success {
        border-color: #bfbfbf;
    }
    .el-step__icon-inner {
        font-size: 20px;
    }
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
.user-type {
    cursor: pointer;
    color: #7c7c7c;
    &:last-child {
        margin-left: 40px;
    }
    &.active {
        color: #fff;
    }
}
.role-box {
    background: #134b71;
    max-height: 300px;
    overflow: auto;
    padding: 20px;
}
.timeType {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: #134b71;
    margin-bottom: 20px;
    cursor: pointer;
    .type {
        width: 100px;
    }
    &.active {
        background-color: #0662a1;
        .check {
            position: absolute;
            right: 20px;
        }
    }
}
</style>
